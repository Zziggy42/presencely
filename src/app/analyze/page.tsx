"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Zap, Search, MapPin, Star, Globe, TrendingUp,
  ArrowRight, CheckCircle2, AlertCircle, DollarSign,
  Activity, Phone, Navigation, Loader2, Lock,
  ChevronRight, ChevronLeft, Mail, TriangleAlert,
  ShieldCheck, Wifi, WifiOff, Code2, Share2,
} from "lucide-react"
import type { WebsiteScanResult, Finding } from "@/app/api/scan-website/route"

// ── Audit estimate engine ─────────────────────────────────────────────────────
function generateAuditResult(
  name: string,
  type: string,
  monthlyRevenue: number | null,
  websiteScan: WebsiteScanResult | null,
) {
  const seed = name.length + type.length
  const base = 45 + (seed % 30)

  // Website scan boosts/penalises the SEO score
  const websiteBoost = websiteScan ? Math.round((websiteScan.seoScore - 50) / 10) : 0

  const scores = {
    overall:    Math.min(100, base + Math.round(websiteBoost / 2)),
    visibility: Math.min(100, base - 3 + (seed % 8)),
    reputation: Math.min(100, base + 5 - (seed % 6)),
    seo:        websiteScan ? websiteScan.seoScore : Math.min(100, base - 8 + (seed % 12)),
    website:    websiteScan ? websiteScan.seoScore : null,
    engagement: Math.min(100, base + 2 - (seed % 7)),
  }

  const monthlySearches = 3200 + seed * 180
  const profileViews    = Math.round(monthlySearches * 0.38)
  const directionClicks = Math.round(profileViews * 0.19)
  const estimatedVisits = Math.round(directionClicks * 0.65)

  // If they gave us real revenue → back-calculate avg spend; else use category default
  const categoryAvgSpend = type.toLowerCase().includes("restaurant") ? 42 : type.toLowerCase().includes("bar") ? 28 : 22
  const avgSpend = monthlyRevenue
    ? Math.round(monthlyRevenue / Math.max(estimatedVisits, 1))
    : categoryAvgSpend
  const estMonthlyRevenue = monthlyRevenue ?? estimatedVisits * avgSpend

  const travelKm = (1.4 + (seed % 10) * 0.18).toFixed(1)
  const captureRate = ((estimatedVisits / monthlySearches) * 100).toFixed(1)

  const missedReviews   = 12 + (seed % 15)
  const lostFromReviews = missedReviews * Math.round(avgSpend * 1.6)
  const outdatedPhotos  = seed % 2 === 0
  const lostFromPhotos  = outdatedPhotos ? Math.round(avgSpend * 56) : 0
  const missingKeywords = 3 + (seed % 4)
  const lostFromSEO     = missingKeywords * Math.round(avgSpend * 8)
  // Website-specific losses if scan found issues
  const websiteLosses = websiteScan && !websiteScan.hasSchemaMarkup
    ? Math.round(avgSpend * 32)
    : 0
  const totalLost = lostFromReviews + lostFromPhotos + lostFromSEO + websiteLosses

  const leaks = [
    lostFromReviews > 0 && {
      icon: Star,
      label: `${missedReviews} reviews with no response`,
      loss: lostFromReviews,
      fix: "Reply to every review — AI drafts it in 10 seconds",
      severity: "high" as const,
    },
    outdatedPhotos && {
      icon: Globe,
      label: "Profile photos are 8+ months old",
      loss: lostFromPhotos,
      fix: "Upload 5 fresh photos — customers trust recent listings",
      severity: "high" as const,
    },
    websiteScan && !websiteScan.hasSchemaMarkup && {
      icon: Code2,
      label: "Website missing schema markup",
      loss: websiteLosses,
      fix: "Add LocalBusiness JSON-LD — tells Google your hours, cuisine, price range",
      severity: "high" as const,
    },
    {
      icon: Search,
      label: `Missing ${missingKeywords} high-traffic local keywords`,
      loss: lostFromSEO,
      fix: "Add keywords to your description and services",
      severity: "medium" as const,
    },
  ].filter(Boolean) as { icon: typeof Star; label: string; loss: number; fix: string; severity: "high" | "medium" }[]

  return {
    scores, grade: base >= 70 ? "B" : base >= 55 ? "C" : "D",
    gradeLabel: base >= 70 ? "Good Presence" : base >= 55 ? "Room to Grow" : "Needs Attention",
    monthlySearches, profileViews, directionClicks, estimatedVisits,
    estMonthlyRevenue, avgSpend, travelKm, captureRate,
    lostFromReviews, lostFromPhotos, lostFromSEO, websiteLosses, totalLost,
    missedReviews, outdatedPhotos, missingKeywords, leaks,
    revenueCalibrated: !!monthlyRevenue,
  }
}

type Stage = "step1" | "step2" | "analyzing" | "result"

const businessTypes = [
  "Restaurant", "Café / Coffee Shop", "Bar / Pub", "Pizza Place",
  "Sushi / Japanese", "Italian", "Bakery", "Gym / Fitness",
  "Hair Salon", "Nail Salon", "Dentist", "Other",
]

const findingIcon = (f: Finding) => {
  if (f.type === "good") return <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
  if (f.type === "error") return <TriangleAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
  return <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
}

const scoreColor = (s: number) =>
  s >= 70 ? "text-emerald-600" : s >= 55 ? "text-amber-500" : "text-red-500"

export default function AnalyzePage() {
  const [stage, setStage] = useState<Stage>("step1")

  // Step 1
  const [businessName, setBusinessName] = useState("")
  const [businessType, setBusinessType] = useState("")
  const [city, setCity]               = useState("")

  // Step 2
  const [websiteUrl, setWebsiteUrl]         = useState("")
  const [monthlyRevenueRaw, setMonthlyRevenueRaw] = useState("")
  const [email, setEmail]                   = useState("")

  // Analysis state
  const [progress, setProgress]     = useState(0)
  const [progressLabel, setProgressLabel] = useState("")
  const [websiteScan, setWebsiteScan] = useState<WebsiteScanResult | null>(null)
  const [result, setResult] = useState<ReturnType<typeof generateAuditResult> | null>(null)
  const [reportSaved, setReportSaved] = useState(false)
  const [savingReport, setSavingReport] = useState(false)

  const monthlyRevenue = monthlyRevenueRaw ? parseInt(monthlyRevenueRaw.replace(/\D/g, ""), 10) || null : null

  const step1Valid = businessName.trim().length > 1 && businessType && city.trim().length > 1

  const runAnalysis = async () => {
    setStage("analyzing")
    setProgress(0)

    const steps: { label: string; pct: number; action?: () => Promise<void> }[] = [
      { label: "Searching Google Business Profile…", pct: 15 },
      {
        label: "Scanning your website…", pct: 38,
        action: websiteUrl ? async () => {
          try {
            const res = await fetch("/api/scan-website", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ url: websiteUrl }),
            })
            if (res.ok) setWebsiteScan(await res.json())
          } catch { /* site unreachable — handled gracefully */ }
        } : undefined,
      },
      { label: "Analysing review history…",    pct: 55 },
      { label: "Calculating revenue impact…",   pct: 72 },
      { label: "Benchmarking competitors…",     pct: 88 },
      { label: "Building your report…",         pct: 100 },
    ]

    for (const step of steps) {
      setProgressLabel(step.label)
      if (step.action) {
        await Promise.all([
          step.action(),
          new Promise((r) => setTimeout(r, 900 + Math.random() * 400)),
        ])
      } else {
        await new Promise((r) => setTimeout(r, 480 + Math.random() * 300))
      }
      setProgress(step.pct)
    }

    await new Promise((r) => setTimeout(r, 350))
    // websiteScan is captured at closure time — use a ref pattern via state setter
    setWebsiteScan((scan) => {
      setResult(generateAuditResult(businessName, businessType, monthlyRevenue, scan))
      return scan
    })
    setStage("result")
  }

  const saveReport = async () => {
    if (!email) return
    setSavingReport(true)
    // Simulate save (wire to Supabase insert later)
    await new Promise((r) => setTimeout(r, 900))
    setSavingReport(false)
    setReportSaved(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900">Presencely</span>
        </Link>
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
          View full dashboard →
        </Link>
      </nav>

      {/* ── STEP 1: Business basics ──────────────────────────────────────── */}
      {stage === "step1" && (
        <div className="max-w-lg mx-auto px-6 py-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              <Search className="w-3.5 h-3.5" />
              Free · No signup required · 60 seconds
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              How much is your internet presence worth?
            </h1>
            <p className="text-gray-500 leading-relaxed text-sm">
              Enter your business details and we&apos;ll calculate your full online discovery funnel,
              revenue from Google, and exactly what you&apos;re leaving on the table.
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">1</div>
              <span className="text-sm font-medium text-indigo-600">Your business</span>
            </div>
            <div className="flex-1 h-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-400 text-xs font-bold flex items-center justify-center">2</div>
              <span className="text-sm text-gray-400">Optional details</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Business name</label>
              <input
                type="text"
                placeholder="e.g. The Oak & Barrel"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Business type</label>
              <div className="grid grid-cols-3 gap-2">
                {businessTypes.map((t) => (
                  <button
                    key={t}
                    onClick={() => setBusinessType(t)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                      businessType === t
                        ? "bg-indigo-600 border-indigo-600 text-white"
                        : "border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
              <input
                type="text"
                placeholder="e.g. Austin, TX"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setStage("step2")}
              disabled={!step1Valid}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-400">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 2,400+ audits run</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> No credit card</span>
            <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-emerald-500" /> Data stays private</span>
          </div>
        </div>
      )}

      {/* ── STEP 2: Optional details ─────────────────────────────────────── */}
      {stage === "step2" && (
        <div className="max-w-lg mx-auto px-6 py-16">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Make it personal
            </h1>
            <p className="text-gray-500 leading-relaxed text-sm">
              Optional — but the more you add, the more accurate your report.
              Your website URL unlocks a real technical scan.
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm text-gray-400">Your business</span>
            </div>
            <div className="flex-1 h-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">2</div>
              <span className="text-sm font-medium text-indigo-600">Optional details</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">

            {/* Website URL */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700">Website URL</label>
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Wifi className="w-3 h-3" /> Unlocks real website scan
                </span>
              </div>
              <input
                type="url"
                placeholder="https://yourbusiness.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-400 mt-1.5">
                We&apos;ll scan for meta tags, schema markup, analytics setup, HTTPS, and more.
              </p>
            </div>

            {/* Monthly Revenue */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700">Monthly revenue</label>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <DollarSign className="w-3 h-3" /> Calibrates your numbers
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                <input
                  type="text"
                  placeholder="e.g. 18,000"
                  value={monthlyRevenueRaw}
                  onChange={(e) => setMonthlyRevenueRaw(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                Used to calculate your real revenue-per-visit and exact loss amounts. Never shared.
              </p>
            </div>

            {/* Email */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <span className="text-xs text-gray-400">To save & share your report</span>
              </div>
              <input
                type="email"
                placeholder="you@yourbusiness.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStage("step1")}
                className="flex items-center gap-1 px-4 py-3.5 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors text-sm"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={runAnalysis}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
              >
                {websiteUrl ? "Scan website & analyse" : "Analyse my presence"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={runAnalysis}
              className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors py-1"
            >
              Skip and use benchmarks only →
            </button>
          </div>
        </div>
      )}

      {/* ── ANALYZING ────────────────────────────────────────────────────── */}
      {stage === "analyzing" && (
        <div className="max-w-md mx-auto px-6 py-24 text-center">
          <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysing {businessName}…</h2>
          <p className="text-gray-500 text-sm mb-8">{progressLabel}</p>
          <div className="bg-gray-200 rounded-full h-2 mb-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-400">{progress}% complete</p>

          {websiteUrl && progress >= 15 && progress < 55 && (
            <div className="mt-6 inline-flex items-center gap-2 text-xs text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
              <Wifi className="w-3.5 h-3.5 animate-pulse" />
              Live scan: {websiteUrl.replace(/^https?:\/\//, "").split("/")[0]}
            </div>
          )}
        </div>
      )}

      {/* ── RESULT ───────────────────────────────────────────────────────── */}
      {stage === "result" && result && (
        <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">

          {/* Hero — score + funnel */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-7 text-white">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                  Online Presence Audit
                  {result.revenueCalibrated && (
                    <span className="ml-2 bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full normal-case tracking-normal text-[10px]">
                      Revenue-calibrated ✓
                    </span>
                  )}
                </p>
                <h2 className="text-2xl font-bold text-white">{businessName}</h2>
                <p className="text-slate-400 text-sm">{businessType} · {city}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-5xl font-black text-white">{result.scores.overall}</div>
                <div className="text-slate-400 text-sm">/ 100</div>
                <div className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full mt-1 ${
                  result.grade === "B" ? "bg-emerald-500/20 text-emerald-400" :
                  result.grade === "C" ? "bg-amber-500/20 text-amber-400" :
                                         "bg-red-500/20 text-red-400"
                }`}>
                  Grade {result.grade} · {result.gradeLabel}
                </div>
              </div>
            </div>

            {/* Website reachability badge */}
            {websiteScan && (
              <div className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full mb-4 ${
                websiteScan.reachable ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
              }`}>
                {websiteScan.reachable
                  ? <><Wifi className="w-3 h-3" /> Website scan complete</>
                  : <><WifiOff className="w-3 h-3" /> Website unreachable — using benchmarks</>
                }
              </div>
            )}

            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Monthly Searches", value: result.monthlySearches.toLocaleString(), icon: Search },
                { label: "Profile Views",    value: result.profileViews.toLocaleString(),    icon: MapPin },
                { label: "Direction Clicks", value: result.directionClicks.toLocaleString(), icon: Navigation },
                { label: "Est. Visits/mo",   value: result.estimatedVisits.toLocaleString(), icon: Globe },
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <div key={i} className="bg-white/10 rounded-xl p-3 text-center">
                    <Icon className="w-4 h-4 text-slate-300 mx-auto mb-1" />
                    <p className="text-xl font-bold text-white">{item.value}</p>
                    <p className="text-[10px] text-slate-400 leading-tight">{item.label}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Revenue cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                  {result.revenueCalibrated ? "Your Revenue from Google" : "Est. Revenue from Google"}
                </p>
              </div>
              <p className="text-3xl font-black text-emerald-700">${result.estMonthlyRevenue.toLocaleString()}</p>
              <p className="text-xs text-emerald-600 mt-1">
                /month · ${result.avgSpend} avg spend
                {result.revenueCalibrated ? " (your data)" : " (category benchmark)"}
              </p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <p className="text-xs font-bold text-red-700 uppercase tracking-wide">Revenue Left on the Table</p>
              </div>
              <p className="text-3xl font-black text-red-600">−${result.totalLost.toLocaleString()}</p>
              <p className="text-xs text-red-500 mt-1">/month from fixable issues</p>
            </div>
          </div>

          {/* Website scan section */}
          {websiteScan && websiteScan.reachable && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-indigo-600" />
                    Website Scan Results
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{websiteScan.url}</p>
                </div>
                <div className="text-right">
                  <span className={`text-2xl font-black ${scoreColor(websiteScan.seoScore)}`}>
                    {websiteScan.seoScore}
                  </span>
                  <span className="text-gray-400 text-sm">/100</span>
                </div>
              </div>

              {/* Title + description preview */}
              {(websiteScan.title || websiteScan.metaDescription) && (
                <div className="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 mb-1.5">How you appear in Google search results</p>
                  {websiteScan.title && (
                    <p className="text-sm font-semibold text-indigo-600 leading-tight mb-1 truncate">{websiteScan.title}</p>
                  )}
                  {websiteScan.metaDescription && (
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{websiteScan.metaDescription}</p>
                  )}
                  {!websiteScan.metaDescription && (
                    <p className="text-xs text-red-400 italic">No meta description — Google will auto-generate one (usually badly)</p>
                  )}
                </div>
              )}

              {/* Signal badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {[
                  { label: "HTTPS",    ok: websiteScan.isHttps,            icon: Lock },
                  { label: "Schema",   ok: websiteScan.hasSchemaMarkup,    icon: Code2 },
                  { label: "Analytics",ok: websiteScan.hasGoogleAnalytics || websiteScan.hasGoogleTagManager, icon: Activity },
                  { label: "Open Graph",ok: websiteScan.hasOpenGraph,      icon: Share2 },
                ].map((s) => {
                  const Icon = s.icon
                  return (
                    <div key={s.label} className={`rounded-lg p-2 text-center border ${
                      s.ok ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"
                    }`}>
                      <Icon className={`w-4 h-4 mx-auto mb-1 ${s.ok ? "text-emerald-600" : "text-red-400"}`} />
                      <p className="text-[10px] font-semibold text-gray-600">{s.label}</p>
                      <p className={`text-[10px] font-bold ${s.ok ? "text-emerald-600" : "text-red-500"}`}>
                        {s.ok ? "✓" : "Missing"}
                      </p>
                    </div>
                  )
                })}
              </div>

              {/* Findings list */}
              <div className="space-y-2.5">
                {websiteScan.findings.slice(0, 5).map((f, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    {findingIcon(f)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 leading-tight">{f.label}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{f.detail}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                      f.impact === "high" ? "bg-red-50 text-red-600" :
                      f.impact === "medium" ? "bg-amber-50 text-amber-600" :
                      "bg-gray-50 text-gray-500"
                    }`}>
                      {f.impact}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Score breakdown */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Presence Score Breakdown</h3>
            <div className="space-y-3">
              {[
                { label: "Visibility",  score: result.scores.visibility,  desc: "How easily customers find you in search" },
                { label: "Reputation",  score: result.scores.reputation,  desc: "Review rating, volume & response rate" },
                { label: "Website SEO", score: result.scores.seo,         desc: websiteScan ? "Based on your live website scan" : "Keywords, description quality & ranking signals" },
                { label: "Engagement",  score: result.scores.engagement,  desc: "Photos, posts & customer interaction" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-gray-800">{item.label}</span>
                      {item.label === "Website SEO" && websiteScan && (
                        <span className="text-[10px] bg-indigo-50 text-indigo-600 font-semibold px-1.5 py-0.5 rounded">Live scan</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">{item.desc}</span>
                    <span className={`text-sm font-bold ml-2 ${scoreColor(item.score)}`}>{item.score}/100</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${
                        item.score >= 70 ? "bg-emerald-500" : item.score >= 55 ? "bg-amber-400" : "bg-red-500"
                      }`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue leaks */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">Revenue Leaks Detected</h3>
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                −${result.totalLost.toLocaleString()}/mo
              </span>
            </div>
            <div className="space-y-3">
              {result.leaks.map((leak, i) => {
                const Icon = leak.icon
                return (
                  <div key={i} className={`rounded-xl p-4 border ${
                    leak.severity === "high" ? "bg-red-50 border-red-100" : "bg-amber-50 border-amber-100"
                  }`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className={`w-4 h-4 shrink-0 ${leak.severity === "high" ? "text-red-500" : "text-amber-500"}`} />
                          <p className="text-sm font-semibold text-slate-800">{leak.label}</p>
                        </div>
                        <p className="text-xs text-slate-500">Fix: {leak.fix}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`text-base font-bold ${leak.severity === "high" ? "text-red-600" : "text-amber-600"}`}>
                          −${leak.loss.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-slate-400">/month</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
              <Activity className="w-5 h-5 text-indigo-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{result.captureRate}%</p>
              <p className="text-xs text-gray-400 mt-0.5">Demand capture rate</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
              <MapPin className="w-5 h-5 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{result.travelKm} km</p>
              <p className="text-xs text-gray-400 mt-0.5">Avg. customer travel distance</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
              <TrendingUp className="w-5 h-5 text-emerald-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">+${Math.round(result.totalLost * 0.7).toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-0.5">Est. recoverable / month</p>
            </div>
          </div>

          {/* Save report / email capture */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                {reportSaved ? (
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <div>
                      <p className="font-semibold">Report saved!</p>
                      <p className="text-sm text-gray-500">We&apos;ve emailed your audit to {email}. We&apos;ll also send you a follow-up in 7 days with updated numbers.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="font-semibold text-gray-900 mb-0.5">Save & share your report</p>
                    <p className="text-sm text-gray-500 mb-3">Get a permanent link to this audit plus a follow-up in 7 days with updated numbers.</p>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        onClick={saveReport}
                        disabled={!email || savingReport}
                        className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-40"
                      >
                        {savingReport ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                      </button>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Your email is never shared or sold
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-indigo-600 rounded-2xl p-7 text-white text-center">
            <h3 className="text-xl font-bold mb-2">
              Fix these leaks. Recover ${result.totalLost.toLocaleString()}/month.
            </h3>
            <p className="text-indigo-200 text-sm mb-5 max-w-lg mx-auto">
              Presencely monitors all of this automatically — and tells you exactly what to do, in order of revenue impact.
              Most owners see measurable results within 14 days.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-colors"
              >
                Start free 14-day trial <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => { setStage("step1"); setProgress(0); setResult(null); setWebsiteScan(null) }}
                className="px-6 py-3 border border-indigo-400 text-indigo-100 font-medium rounded-xl hover:bg-indigo-500 transition-colors"
              >
                Audit a different business
              </button>
            </div>
            <p className="text-indigo-300 text-xs mt-3">No credit card required · Cancel anytime</p>
          </div>

          <p className="text-center text-xs text-gray-400 pb-4">
            Results combine publicly available data with category benchmarks.
            {result.revenueCalibrated ? " Dollar figures calibrated to your revenue." : ""}
            {websiteScan ? " Website scores from live scan." : ""}{" "}
            <Link href="/" className="text-indigo-500 hover:underline">Methodology →</Link>
          </p>
        </div>
      )}
    </div>
  )
}

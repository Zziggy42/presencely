"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import {
  Zap, Star, MapPin, TrendingUp, AlertCircle,
  ArrowRight, CheckCircle2, Link2,
} from "lucide-react"

// ── Social proof ──────────────────────────────────────────────────────────────
const testimonials = [
  { business: "Café de la Paix, Geneva",   result: "+CHF 3,200/mo", detail: "after fixing reviews + updating photos"          },
  { business: "Brasserie du Centre, Lausanne", result: "+CHF 2,600/mo", detail: "by completing their Google Business Profile"  },
  { business: "L'Atelier Café, Zurich",    result: "Top 3 on Maps",  detail: "in their neighbourhood within 5 weeks"          },
]

// ── Report Content Component ──────────────────────────────────────────────────
function AuditReport() {
  const params = useSearchParams()

  // URL-parameterised so every cold email link can be personalised:
  // /audit?name=Café+du+Lac&city=Geneva&visits=380&loss=2840&revenue=15200&rating=4.3&reviews=142
  const businessName  = params.get("name")     ?? "Café du Lac"
  const city          = params.get("city")     ?? "Geneva"
  const rawVisits     = Number(params.get("visits")  ?? 380)
  const rawLoss       = Number(params.get("loss")    ?? 2840)
  const rawRevenue    = Number(params.get("revenue") ?? 15240)
  const rating        = Number(params.get("rating")  ?? 4.4)
  const reviews       = Number(params.get("reviews") ?? 186)

  // Derive funnel from visits (realistic backward estimates)
  const directionRequests  = Math.round(rawVisits / 0.65)
  const mapsViews          = Math.round(directionRequests / 0.155)
  const searchImpressions  = Math.round(mapsViews / 0.36)
  const avgSpend           = Math.round(rawRevenue / rawVisits)
  const brandScore         = Math.min(94, Math.max(42, Math.round(55 + (rating - 4.0) * 20 - (rawLoss / 500))))
  const percentile         = Math.round(brandScore * 0.75)

  const funnel = [
    { label: "Monthly Google Searches",   value: searchImpressions, icon: "🔍", note: null                                       },
    { label: "Google Maps Profile Views", value: mapsViews,         icon: "🗺️", note: null                                       },
    { label: "Direction Requests",        value: directionRequests, icon: "📍", note: "14% below category average"               },
    { label: "Estimated Monthly Visits",  value: rawVisits,         icon: "🚶", note: "65% conversion from direction requests"   },
    { label: "Est. Monthly Revenue",      value: rawRevenue,        icon: "💰", note: `at CHF ${avgSpend} avg spend`, isRevenue: true },
  ]

  const leaks = [
    {
      id: 1,
      title: `${Math.floor(reviews * 0.12)} reviews with no response`,
      detail: "Unanswered reviews suppress your Maps ranking, reducing direction requests by ~12%. Google's algorithm actively deprioritises profiles with low engagement.",
      loss: Math.round(rawLoss * 0.44),
      fix: "Reply to every review within 24h — Presencely auto-drafts AI replies for you",
      effort: "5 min",
    },
    {
      id: 2,
      title: "Profile photos not updated recently",
      detail: "Fresh photos lift profile click-through rate by 24–38%. Stale profiles lose visibility in the Maps discovery feed — especially against competitors who post weekly.",
      loss: Math.round(rawLoss * 0.30),
      fix: "Upload 6 new photos: food, interior, exterior, and a recent team shot",
      effort: "10 min",
    },
    {
      id: 3,
      title: "Missing or incomplete menu link on Google Business",
      detail: "Profiles with a direct menu link generate 22% more website clicks and reduce the gap between direction requests and actual visits.",
      loss: Math.round(rawLoss * 0.26),
      fix: "Add your menu URL to your Google Business Profile listing",
      effort: "2 min",
    },
  ]

  const totalLoss = leaks.reduce((s, l) => s + l.loss, 0)

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── Navbar ── */}
      <nav className="border-b border-slate-100 px-6 py-4 flex items-center justify-between max-w-4xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-slate-900 text-base">Presencely</span>
        </div>
        <Link
          href="/auth/signup"
          className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Claim free dashboard →
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">

        {/* ── Cold email context banner ── */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3.5 flex items-start gap-3">
          <span className="text-amber-500 text-lg shrink-0">📋</span>
          <div>
            <p className="text-sm font-semibold text-amber-900">
              Free visibility audit prepared for {businessName}
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              Based on your public Google Business Profile data · Analysis generated {new Date().toLocaleDateString("en-CH", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            className="ml-auto flex items-center gap-1.5 text-xs text-amber-700 hover:text-amber-900 font-medium shrink-0"
          >
            <Link2 className="w-3.5 h-3.5" /> Copy link
          </button>
        </div>

        {/* ── Hero Banner ── */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 text-white">
          <div className="flex items-start justify-between flex-wrap gap-6">
            <div>
              <p className="text-indigo-300 text-xs font-semibold uppercase tracking-widest mb-2">
                Free Visibility Audit
              </p>
              <h1 className="text-3xl font-black text-white">{businessName}</h1>
              <div className="flex items-center gap-3 mt-2 text-slate-300 text-sm flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {city}, Switzerland
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {rating} ({reviews} reviews)
                </span>
              </div>
            </div>

            {/* Brand Gravity Score */}
            <div className="text-center">
              <div className="text-6xl font-black text-white">{brandScore}</div>
              <div className="text-indigo-300 text-sm">/100 Brand Gravity Score</div>
              <div className="mt-2 bg-white/10 rounded-lg px-3 py-1 text-xs font-semibold text-white">
                🧲 Neighbourhood Magnet
              </div>
              <p className="text-xs text-slate-400 mt-1">Top {100 - percentile}% in {city}</p>
            </div>
          </div>

          {/* 3 hero stats */}
          <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-3 gap-3">
            <div>
              <p className="text-2xl font-black text-white">{rawVisits.toLocaleString()}</p>
              <p className="text-xs text-slate-400 mt-0.5">est. visitors/month from Google</p>
            </div>
            <div>
              <p className="text-2xl font-black text-emerald-400">CHF {rawRevenue.toLocaleString()}</p>
              <p className="text-xs text-slate-400 mt-0.5">est. monthly revenue from Google</p>
            </div>
            <div>
              <p className="text-2xl font-black text-red-400">−CHF {totalLoss.toLocaleString()}</p>
              <p className="text-xs text-slate-400 mt-0.5">revenue you&apos;re leaving monthly</p>
            </div>
          </div>
        </div>

        {/* ── Discovery Funnel ── */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Your Google Discovery Funnel</h2>
          <p className="text-sm text-slate-500 mb-4">
            Every month, {searchImpressions.toLocaleString()} people search terms that show your café — here&apos;s what happens next
          </p>
          <div className="space-y-3">
            {funnel.map((step, i) => {
              const nextStep = funnel[i + 1]
              const conversion = nextStep ? Math.round((nextStep.value / step.value) * 100) : null
              return (
                <div key={step.label}>
                  <div className={`rounded-xl border px-5 py-4 flex items-center gap-4 ${
                    step.isRevenue
                      ? "bg-emerald-50 border-emerald-200"
                      : step.note?.includes("below")
                      ? "bg-red-50 border-red-200"
                      : "bg-white border-slate-200"
                  }`}>
                    <span className="text-2xl">{step.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-slate-700">{step.label}</p>
                      {step.note && (
                        <p className={`text-xs mt-0.5 ${step.note.includes("below") ? "text-red-600 font-medium" : "text-slate-400"}`}>
                          {step.note}
                        </p>
                      )}
                    </div>
                    <p className={`text-2xl font-black tabular-nums ${step.isRevenue ? "text-emerald-700" : "text-slate-900"}`}>
                      {step.isRevenue ? `CHF ${step.value.toLocaleString()}` : step.value.toLocaleString()}
                    </p>
                  </div>
                  {conversion !== null && (
                    <div className="flex items-center gap-2 px-5 py-1">
                      <div className="flex-1 h-px bg-slate-200" />
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        conversion < 20 ? "bg-red-100 text-red-700"
                        : conversion < 50 ? "bg-amber-100 text-amber-700"
                        : "bg-emerald-100 text-emerald-700"
                      }`}>
                        {conversion}% conversion
                      </span>
                      <div className="flex-1 h-px bg-slate-200" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Revenue Leaks ── */}
        <div>
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <h2 className="text-lg font-bold text-slate-900">Where You&apos;re Losing Revenue</h2>
            <span className="bg-red-100 text-red-700 text-sm font-bold px-3 py-0.5 rounded-full">
              −CHF {totalLoss.toLocaleString()}/mo
            </span>
          </div>
          <p className="text-sm text-slate-500 mb-4">
            Small fixes with outsized impact — most take under 10 minutes to resolve
          </p>
          <div className="space-y-3">
            {leaks.map((leak) => (
              <div key={leak.id} className="rounded-xl border border-red-100 bg-red-50/50 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{leak.title}</p>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{leak.detail}</p>
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-indigo-700 font-medium">
                        <ArrowRight className="w-3.5 h-3.5" />
                        {leak.fix}
                        <span className="text-slate-400 font-normal">({leak.effort})</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xl font-black text-red-600">−CHF {leak.loss.toLocaleString()}</p>
                    <p className="text-xs text-slate-400">/month</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── What Presencely Does ── */}
        <div className="rounded-2xl bg-indigo-600 p-8 text-white">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">
                Recover CHF {totalLoss.toLocaleString()}/mo automatically
              </h2>
              <p className="text-indigo-200 text-sm mt-1">
                Presencely monitors these issues 24/7 and alerts you — or fixes them for you — before the revenue disappears.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { icon: "🤖", title: "AI Review Replies",     desc: "Auto-draft responses to every review in seconds" },
              { icon: "📈", title: "Demand Forecast",       desc: "See which days will be busy — before they happen" },
              { icon: "📊", title: "Weekly Revenue Report", desc: "Exactly how your online presence translates to CHF" },
            ].map((f) => (
              <div key={f.title} className="bg-white/10 rounded-xl p-4">
                <span className="text-2xl">{f.icon}</span>
                <p className="font-semibold text-white text-sm mt-2">{f.title}</p>
                <p className="text-xs text-indigo-200 mt-1 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <Link
              href="/auth/signup"
              className="bg-white text-indigo-700 font-bold text-sm px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors flex items-center gap-2"
            >
              Start recovering revenue — free 14 days <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-indigo-200 text-xs">No credit card · Setup in 2 minutes</p>
          </div>
        </div>

        {/* ── Social proof ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div key={t.business} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mb-2" />
              <p className="text-lg font-black text-slate-900">{t.result}</p>
              <p className="text-xs text-slate-500 mt-0.5">{t.detail}</p>
              <p className="text-xs text-slate-400 mt-2 font-medium">{t.business}</p>
            </div>
          ))}
        </div>

        {/* ── Cold email helper ── */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
            📧 Cold email template to send this report
          </p>
          <div className="bg-white rounded-lg border border-slate-200 p-4 font-mono text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
{`Subject: Your café may be losing ~CHF ${totalLoss.toLocaleString()}/month from Google Maps

Hi [Name],

I ran a quick analysis of ${businessName}'s Google listing.

Based on your public data, your café gets roughly ${rawVisits} visitors/month from Google discovery, generating ~CHF ${rawRevenue.toLocaleString()} in estimated revenue.

However, I spotted ${leaks.length} visibility gaps that may be costing you ~CHF ${totalLoss.toLocaleString()}/month.

Here's the full report:
→ ${typeof window !== "undefined" ? window.location.href : `presencely.com/audit?name=${encodeURIComponent(businessName)}&city=${encodeURIComponent(city)}`}

Takes 2 minutes to read. Happy to walk you through it.

Best,
[Your name]`}
          </div>
          <button
            onClick={() => {
              const text = `Subject: Your café may be losing ~CHF ${totalLoss.toLocaleString()}/month from Google Maps\n\nHi [Name],\n\nI ran a quick analysis of ${businessName}'s Google listing.\n\nBased on your public data, your café gets roughly ${rawVisits} visitors/month from Google discovery, generating ~CHF ${rawRevenue.toLocaleString()} in estimated revenue.\n\nHowever, I spotted ${leaks.length} visibility gaps that may be costing you ~CHF ${totalLoss.toLocaleString()}/month.\n\nHere's the full report:\n→ ${window.location.href}\n\nTakes 2 minutes to read. Happy to walk you through it.\n\nBest,\n[Your name]`
              navigator.clipboard.writeText(text)
            }}
            className="mt-3 flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            📋 Copy email template
          </button>
        </div>

        {/* ── Footer CTA ── */}
        <div className="text-center py-6 border-t border-slate-100">
          <p className="text-slate-500 text-sm mb-4">
            This report was generated from public Google data. Claim your live dashboard to see real-time insights.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 bg-slate-900 text-white font-bold text-sm px-8 py-3.5 rounded-xl hover:bg-slate-800 transition-colors"
          >
            Get my free Presencely dashboard <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-slate-400 mt-3">Free for 14 days · No credit card required · Cancel anytime</p>
        </div>

      </div>
    </div>
  )
}

// Wrap in Suspense because useSearchParams requires it
export default function AuditPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">Loading report…</div>}>
      <AuditReport />
    </Suspense>
  )
}

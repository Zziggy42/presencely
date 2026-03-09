"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  Zap, Search, CheckCircle2, ArrowRight,
  MapPin, Star, Globe, BarChart3, AlertCircle, Loader2,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────
interface PlaceResult {
  name: string
  formatted_address: string
  rating?: number
  user_ratings_total?: number
  place_id: string
  website?: string
  formatted_phone_number?: string
  photos?: unknown[]
}

// ─── Step indicator ───────────────────────────────────────────────────────────
function Steps({ current }: { current: 1 | 2 | 3 }) {
  const steps = ["Find your business", "Connect Google", "You're all set"]
  return (
    <div className="flex items-center gap-2 mb-10">
      {steps.map((label, i) => {
        const n = i + 1
        const done    = n < current
        const active  = n === current
        return (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              done   ? "bg-emerald-500 text-white" :
              active ? "bg-indigo-600 text-white"  :
                       "bg-slate-100 text-slate-400"
            }`}>
              {done ? <CheckCircle2 className="w-4 h-4" /> : n}
            </div>
            <span className={`text-sm font-medium hidden sm:block ${
              active ? "text-slate-900" : "text-slate-400"
            }`}>{label}</span>
            {i < steps.length - 1 && (
              <div className={`w-8 h-px mx-1 ${done ? "bg-emerald-300" : "bg-slate-200"}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Step 1: Find business ────────────────────────────────────────────────────
function Step1({
  onFound,
}: {
  onFound: (place: PlaceResult) => void
}) {
  const [name, setName]       = useState("")
  const [city, setCity]       = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState<PlaceResult | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [error, setError]     = useState("")

  async function search() {
    if (!name.trim() || !city.trim()) return
    setLoading(true)
    setResult(null)
    setNotFound(false)
    setError("")

    try {
      const res = await fetch("/api/google/places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), city: city.trim() }),
      })
      const data = await res.json()

      if (data.fallback) {
        // Places API not configured — create a synthetic result so onboarding can proceed
        setResult({
          name: name.trim(),
          formatted_address: `${city.trim()}, Switzerland`,
          place_id: "not_configured",
        })
      } else if (data.found && data.details) {
        setResult(data.details)
      } else {
        setNotFound(true)
      }
    } catch {
      setError("Something went wrong — please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-1">Find your business on Google</h2>
      <p className="text-slate-500 text-sm mb-8">
        We'll pull your real Google data and build your personalised Presence Score.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Business name (e.g. Café du Lac)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          placeholder="City (e.g. Geneva)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          className="sm:w-40 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={search}
          disabled={loading || !name.trim() || !city.trim()}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold text-sm px-5 py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          Search
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm mb-4">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {notFound && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 mb-4">
          We couldn't find <strong>{name}</strong> in {city} on Google Maps. Check the spelling or try a nearby city.
        </div>
      )}

      {result && (
        <div className="border border-slate-200 rounded-2xl p-5 bg-white shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-base">{result.name}</p>
                <p className="text-slate-500 text-sm mt-0.5">{result.formatted_address}</p>
                {(result.rating || result.user_ratings_total) && (
                  <div className="flex items-center gap-3 mt-2">
                    {result.rating && (
                      <span className="flex items-center gap-1 text-sm font-medium text-slate-700">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {result.rating}
                      </span>
                    )}
                    {result.user_ratings_total && (
                      <span className="text-xs text-slate-400">
                        {result.user_ratings_total.toLocaleString()} reviews
                      </span>
                    )}
                    {result.photos && (
                      <span className="text-xs text-slate-400">
                        {result.photos.length} photos
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <button
              onClick={() => onFound(result)}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Yes, this is my business <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setResult(null); setName(""); setCity("") }}
              className="px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-900 border border-slate-200 rounded-xl transition-colors"
            >
              Not mine
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Step 2: Connect Google ───────────────────────────────────────────────────
function Step2({
  place,
  alreadyConnected,
  onSkip,
}: {
  place: PlaceResult
  alreadyConnected: boolean
  onSkip: () => void
}) {
  const [connecting, setConnecting] = useState(false)

  function handleConnect() {
    setConnecting(true)
    window.location.href = "/api/google/connect"
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-1">Connect your Google accounts</h2>
      <p className="text-slate-500 text-sm mb-8">
        This unlocks your real Presence Score, keyword rankings, and review insights for{" "}
        <strong className="text-slate-700">{place.name}</strong>.
      </p>

      <div className="space-y-4 mb-8">
        {/* GBP card */}
        <div className="border border-slate-200 rounded-2xl p-5 bg-white">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0 text-base font-bold text-blue-700">G</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-slate-900 text-sm">Google Business Profile</p>
                {alreadyConnected && (
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Connected</span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Reviews, Maps ranking, photo count, Q&A, business info
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {["Review responses", "Maps visibility", "Photo optimisation", "Competitor ranking"].map((t) => (
                  <span key={t} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* GSC card */}
        <div className="border border-slate-200 rounded-2xl p-5 bg-white">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0 text-base font-bold text-green-700">G</div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900 text-sm">Google Search Console</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Keyword rankings, search impressions, click-through rates
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {["Keyword gaps", "Search impressions", "Click rates", "Page performance"].map((t) => (
                  <span key={t} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security note */}
      <div className="flex items-start gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-6 text-xs text-slate-500">
        <span className="text-base leading-none mt-0.5">🔒</span>
        <span>
          Read-only access. We never post, delete, or modify your listings without your explicit approval.
          You can disconnect at any time from Settings.
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleConnect}
          disabled={connecting}
          className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {connecting ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Connecting…</>
          ) : (
            <><Globe className="w-4 h-4" /> Connect with Google</>
          )}
        </button>
        <button
          onClick={onSkip}
          className="px-5 py-3 text-sm font-medium text-slate-500 hover:text-slate-900 border border-slate-200 rounded-xl transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  )
}

// ─── Step 3: Success ──────────────────────────────────────────────────────────
function Step3({
  place,
  googleConnected,
  gscSiteUrl,
}: {
  place: PlaceResult | null
  googleConnected: boolean
  gscSiteUrl?: string
}) {
  const router = useRouter()

  const features = [
    { icon: BarChart3,    label: "Presence Score", detail: "Live score calculated from real data",       ready: googleConnected },
    { icon: Star,         label: "Review insights", detail: "Unanswered reviews + AI reply drafts",       ready: googleConnected },
    { icon: Search,       label: "Keyword rankings", detail: "Which searches bring people to your door",  ready: !!gscSiteUrl },
    { icon: MapPin,       label: "Maps visibility", detail: "Your rank for top local keywords",           ready: googleConnected },
  ]

  return (
    <div>
      <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-1">
        {googleConnected ? "You're all set!" : "Dashboard is ready"}
      </h2>
      <p className="text-slate-500 text-sm mb-8">
        {googleConnected
          ? `Your Presence Score for ${place?.name ?? "your business"} is being calculated. Check back in a few minutes.`
          : "Your dashboard is ready with your business profile. Connect Google any time from Settings."}
      </p>

      <div className="space-y-3 mb-8">
        {features.map((f) => (
          <div key={f.label} className="flex items-center gap-4 bg-white border border-slate-100 rounded-xl px-4 py-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              f.ready ? "bg-indigo-100" : "bg-slate-100"
            }`}>
              <f.icon className={`w-4 h-4 ${f.ready ? "text-indigo-600" : "text-slate-400"}`} />
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${f.ready ? "text-slate-900" : "text-slate-400"}`}>{f.label}</p>
              <p className="text-xs text-slate-400">{f.detail}</p>
            </div>
            {f.ready
              ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              : <span className="text-xs text-slate-400 shrink-0">Connect to unlock</span>
            }
          </div>
        ))}
      </div>

      <button
        onClick={() => router.push("/dashboard")}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold text-sm px-6 py-3.5 rounded-xl hover:bg-indigo-700 transition-colors"
      >
        Go to my dashboard <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
}

// ─── Main onboarding page ─────────────────────────────────────────────────────
function OnboardingContent() {
  const params = useSearchParams()
  const [step, setStep]   = useState<1 | 2 | 3>(1)
  const [place, setPlace] = useState<PlaceResult | null>(null)

  // Handle return from Google OAuth
  const connected    = params.get("connected") === "true"
  const oauthError   = params.get("error")
  const businessName = params.get("business")
  const gscSiteUrl   = params.get("site") ?? undefined

  useEffect(() => {
    if (connected) {
      setStep(3)
    }
  }, [connected])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Nav */}
      <nav className="px-6 py-4 border-b border-slate-100 bg-white flex items-center gap-2">
        <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
          <Zap className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="font-bold text-slate-900">Presencely</span>
        <span className="text-slate-300 mx-2">·</span>
        <span className="text-sm text-slate-500">Setup</span>
      </nav>

      <div className="flex-1 flex items-start justify-center px-4 py-12">
        <div className="w-full max-w-xl">
          <Steps current={step} />

          {oauthError && step !== 3 && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-6">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {oauthError === "access_denied"
                ? "Google access was denied. You can connect later from Settings."
                : `Connection error: ${oauthError}. Please try again.`}
            </div>
          )}

          {step === 1 && (
            <Step1
              onFound={(p) => {
                setPlace(p)
                setStep(2)
              }}
            />
          )}

          {step === 2 && place && (
            <Step2
              place={place}
              alreadyConnected={false}
              onSkip={() => setStep(3)}
            />
          )}

          {step === 3 && (
            <Step3
              place={place ?? (businessName ? { name: businessName, formatted_address: "", place_id: "" } : null)}
              googleConnected={connected}
              gscSiteUrl={gscSiteUrl}
            />
          )}

          {/* Skip link */}
          {step < 3 && (
            <div className="mt-8 text-center">
              <Link href="/dashboard" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
                Skip setup — go to dashboard →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  )
}

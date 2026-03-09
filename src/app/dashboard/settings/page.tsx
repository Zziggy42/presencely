"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle, AlertCircle, Link2, Building2,
  Bell, CreditCard, Zap, ArrowRight, Database,
  CheckCircle2, TrendingUp, Users, Loader2,
} from "lucide-react"
import { businessInfo, posIntegrations, posUnlockPreview } from "@/lib/mock-data"
import type { GoogleConnectionStatus } from "@/app/api/google/status/route"

// ─── Secondary integrations (static) ─────────────────────────────────────────
const secondaryIntegrations = [
  { name: "Google Analytics 4", initial: "G", color: "bg-orange-100 text-orange-700", connected: false, description: "Website traffic & sessions" },
  { name: "Yelp Business",      initial: "Y", color: "bg-red-100 text-red-700",       connected: false, description: "Yelp reviews & rating"      },
  { name: "TripAdvisor",        initial: "T", color: "bg-emerald-100 text-emerald-700",connected: false, description: "TripAdvisor reviews"        },
  { name: "Facebook Pages",     initial: "f", color: "bg-indigo-100 text-indigo-700", connected: false, description: "Social engagement & reach"  },
]

export default function SettingsPage() {
  const [googleStatus, setGoogleStatus] = useState<GoogleConnectionStatus | null>(null)
  const [googleLoading, setGoogleLoading] = useState(true)

  useEffect(() => {
    fetch("/api/google/status")
      .then((r) => r.json())
      .then((d) => setGoogleStatus(d))
      .catch(() => setGoogleStatus({ connected: false, gbpConnected: false, gscConnected: false }))
      .finally(() => setGoogleLoading(false))
  }, [])

  const connectedCount =
    (googleStatus?.gbpConnected ? 1 : 0) +
    (googleStatus?.gscConnected ? 1 : 0)

  return (
    <div className="p-6 space-y-8 max-w-5xl">

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your business profile, integrations and billing</p>
      </div>

      {/* ══════════════════════════════════════════════════════
          POS INTEGRATIONS — HERO SECTION
      ══════════════════════════════════════════════════════ */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">

        {/* Dark header */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-slate-900" />
                </div>
                <Badge className="bg-amber-400 text-slate-900 hover:bg-amber-400 text-xs font-semibold border-0">
                  Biggest upgrade
                </Badge>
              </div>
              <h2 className="text-xl font-bold mb-1">Connect Your POS — Unlock Real Revenue Attribution</h2>
              <p className="text-slate-300 text-sm max-w-xl">
                Right now Presencely estimates your revenue from Google. Connect your POS and see the
                exact CHF amount every Google search generates — down to individual transactions.
              </p>
            </div>
          </div>

          {/* Before / After comparison */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            {/* Without POS */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-3">
                Without POS — current state
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Revenue from Google</span>
                  <span className="text-sm font-semibold text-slate-300 line-through">
                    ~CHF {posUnlockPreview.withoutPOS.revenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Monthly visits</span>
                  <span className="text-sm font-semibold text-slate-300 line-through">
                    ~{posUnlockPreview.withoutPOS.visits}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Avg order value</span>
                  <span className="text-sm font-semibold text-slate-300 line-through">
                    CHF {posUnlockPreview.withoutPOS.avgOrder}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Staffing accuracy</span>
                  <span className="text-sm font-semibold text-slate-400">
                    {posUnlockPreview.withoutPOS.staffingAccuracy}%
                  </span>
                </div>
                <div className="mt-1 pt-2 border-t border-white/10">
                  <span className="text-[11px] text-slate-500 italic">{posUnlockPreview.withoutPOS.attribution}</span>
                </div>
              </div>
            </div>

            {/* With POS */}
            <div className="bg-emerald-950/40 border border-emerald-700/40 rounded-xl p-4">
              <p className="text-xs font-medium text-emerald-400 uppercase tracking-wide mb-3">
                With POS connected ✓
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Revenue from Google</span>
                  <span className="text-sm font-bold text-emerald-400">
                    CHF {posUnlockPreview.withPOS.revenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Monthly visits</span>
                  <span className="text-sm font-bold text-emerald-400">
                    {posUnlockPreview.withPOS.visits} transactions
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Avg order value</span>
                  <span className="text-sm font-bold text-emerald-400">
                    CHF {posUnlockPreview.withPOS.avgOrder}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Staffing accuracy</span>
                  <span className="text-sm font-bold text-emerald-400">
                    {posUnlockPreview.withPOS.staffingAccuracy}%
                  </span>
                </div>
                <div className="mt-1 pt-2 border-t border-emerald-700/30">
                  <span className="text-[11px] text-emerald-500 font-medium">{posUnlockPreview.withPOS.attribution}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Extra insights preview */}
          <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10">
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide mb-2">
              Example insights you&apos;ll unlock
            </p>
            <div className="space-y-1.5">
              {posUnlockPreview.withPOS.extraInsights.map((insight, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-slate-300">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* POS platform cards */}
        <div className="bg-slate-50 p-5">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-4">
            Choose your POS platform
          </p>
          <div className="grid grid-cols-3 gap-4">
            {posIntegrations.map((pos) => (
              <div
                key={pos.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${pos.color}`}>
                      {pos.initial}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{pos.name}</p>
                      <p className="text-[10px] text-slate-400 leading-tight">{pos.description}</p>
                    </div>
                  </div>
                </div>

                {/* Badge + Markets */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${pos.badgeColor}`}>
                    {pos.badge}
                  </span>
                  {pos.markets.slice(0, 2).map((m) => (
                    <span key={m} className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {m}
                    </span>
                  ))}
                </div>

                {/* Data points */}
                <div className="mb-3">
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide mb-1.5">
                    Data we receive
                  </p>
                  <div className="space-y-1">
                    {pos.dataPoints.slice(0, 3).map((d) => (
                      <div key={d} className="flex items-center gap-1.5">
                        <Database className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                        <span className="text-[11px] text-slate-500">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* What you unlock */}
                <div className="mb-4 flex-1">
                  <p className="text-[10px] text-emerald-600 font-medium uppercase tracking-wide mb-1.5">
                    What you unlock
                  </p>
                  <div className="space-y-1">
                    {pos.unlocks.slice(0, 3).map((u) => (
                      <div key={u} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
                        <span className="text-[11px] text-emerald-700 font-medium">{u}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Connect button */}
                <button className="w-full flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors mt-auto">
                  Connect {pos.name} <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <p className="text-center text-[11px] text-slate-400 mt-4">
            More POS platforms coming soon · Epos Now · Clover · SumUp
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          ONLINE PRESENCE INTEGRATIONS
      ══════════════════════════════════════════════════════ */}
      <Card className="border border-slate-100 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link2 className="w-4 h-4 text-slate-500" />
              <CardTitle className="text-base font-semibold">Google Integrations</CardTitle>
            </div>
            {!googleLoading && (
              <span className="text-xs text-slate-400">
                {connectedCount > 0 ? `${connectedCount} connected` : "Not connected"}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">

          {/* Google Business Profile */}
          <div className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
            googleStatus?.gbpConnected ? "border-emerald-100 bg-emerald-50/30" : "border-slate-100"
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm bg-blue-100 text-blue-700">G</div>
              <div>
                <p className="text-sm font-medium text-slate-900">Google Business Profile</p>
                <p className="text-xs text-slate-400">
                  {googleStatus?.gbpConnected
                    ? googleStatus.gbpBusinessName ?? "Connected"
                    : "Maps ranking, reviews, photos, visibility"}
                </p>
              </div>
            </div>
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
            ) : googleStatus?.gbpConnected ? (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                <CheckCircle className="w-4 h-4" /> Connected
              </div>
            ) : (
              <a
                href="/api/google/connect"
                className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Connect
              </a>
            )}
          </div>

          {/* Google Search Console */}
          <div className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
            googleStatus?.gscConnected ? "border-emerald-100 bg-emerald-50/30" : "border-slate-100"
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm bg-green-100 text-green-700">G</div>
              <div>
                <p className="text-sm font-medium text-slate-900">Google Search Console</p>
                <p className="text-xs text-slate-400">
                  {googleStatus?.gscConnected
                    ? googleStatus.gscSiteUrl ?? "Connected"
                    : "Keyword rankings, impressions, click-through rates"}
                </p>
              </div>
            </div>
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
            ) : googleStatus?.gscConnected ? (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                <CheckCircle className="w-4 h-4" /> Connected
              </div>
            ) : (
              <a
                href="/api/google/connect"
                className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Connect
              </a>
            )}
          </div>

          {/* Secondary integrations */}
          {secondaryIntegrations.map((int) => (
            <div key={int.name} className="flex items-center justify-between p-3 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${int.color}`}>
                  {int.initial}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{int.name}</p>
                  <p className="text-xs text-slate-400">{int.description}</p>
                </div>
              </div>
              <button className="px-3 py-1.5 bg-slate-100 text-slate-500 text-xs font-medium rounded-lg hover:bg-slate-200 transition-colors cursor-not-allowed" disabled>
                Coming soon
              </button>
            </div>
          ))}

          {!googleLoading && !googleStatus?.connected && (
            <div className="mt-1 p-3 bg-indigo-50 rounded-xl border border-indigo-100 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
              <p className="text-xs text-indigo-700">
                <strong>Connect Google</strong> to replace mock data with your real Presence Score,
                keyword rankings, and review insights.{" "}
                <a href="/api/google/connect" className="underline font-semibold">Connect now →</a>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ══════════════════════════════════════════════════════
          BUSINESS PROFILE
      ══════════════════════════════════════════════════════ */}
      <Card className="border border-slate-100 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-500" />
            <CardTitle className="text-base font-semibold">Business Profile</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          {[
            { label: "Business Name", value: businessInfo.name },
            { label: "Category",      value: businessInfo.category },
            { label: "Address",       value: businessInfo.address },
            { label: "Phone",         value: businessInfo.phone },
            { label: "Website",       value: businessInfo.website },
            { label: "Google Rating", value: `${businessInfo.googleRating} ★` },
          ].map((field) => (
            <div key={field.label} className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-400 mb-0.5">{field.label}</p>
              <p className="text-sm font-medium text-slate-900 truncate">{field.value}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ══════════════════════════════════════════════════════
          PLAN & BILLING
      ══════════════════════════════════════════════════════ */}
      <Card className="border border-slate-100 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-slate-500" />
            <CardTitle className="text-base font-semibold">Plan &amp; Billing</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge className="bg-indigo-600 text-white hover:bg-indigo-600 mb-2">Pro Plan</Badge>
                <p className="text-2xl font-bold text-slate-900">
                  CHF 79<span className="text-base font-normal text-slate-500">/month</span>
                </p>
                <p className="text-xs text-slate-500 mt-0.5">Billed monthly · Cancel anytime</p>
              </div>
              <button className="text-xs text-indigo-600 hover:underline font-medium">
                Manage billing →
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: TrendingUp, text: "1 location — all analytics" },
                { icon: Users,      text: "Customer travel intelligence" },
                { icon: CheckCircle2, text: "Smart Staffing Forecast" },
                { icon: CheckCircle2, text: "AI review responses" },
                { icon: CheckCircle2, text: "Weekly SEO reports" },
                { icon: CheckCircle2, text: "Priority support" },
              ].map((f) => (
                <div key={f.text} className="flex items-center gap-2 text-xs text-slate-600">
                  <f.icon className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  {f.text}
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-white/60 rounded-lg border border-indigo-100">
              <p className="text-xs text-slate-600">
                <strong>POS integration</strong> is included in the Pro plan.
                Connect Lightspeed, Square, or Toast at no extra cost.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ══════════════════════════════════════════════════════
          NOTIFICATIONS
      ══════════════════════════════════════════════════════ */}
      <Card className="border border-slate-100 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-slate-500" />
            <CardTitle className="text-base font-semibold">Notifications</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "New review alerts",         description: "Get notified when you receive a new review",   enabled: true  },
            { label: "Negative review alerts",    description: "Immediate alert for 1–2 star reviews",         enabled: true  },
            { label: "Weekly performance report", description: "Email summary every Monday morning",            enabled: true  },
            { label: "Demand spike alerts",       description: "SMS alert when a busy period is forecast",      enabled: true  },
            { label: "SEO issue alerts",          description: "When new critical issues are detected",         enabled: false },
          ].map((notif) => (
            <div key={notif.label} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-slate-900">{notif.label}</p>
                <p className="text-xs text-slate-400">{notif.description}</p>
              </div>
              <div className={`w-10 h-5 rounded-full cursor-pointer transition-colors shrink-0 ${notif.enabled ? "bg-indigo-600" : "bg-slate-200"}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow m-0.5 transition-transform ${notif.enabled ? "translate-x-5" : ""}`} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

    </div>
  )
}

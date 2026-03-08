"use client"

import Header from "@/components/layout/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  MapPin, TrendingUp, Users, Star, Navigation,
  Zap, Share2, ArrowRight, Info,
} from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts"
import {
  businessInfo,
  brandGravityData,
  travelBands,
  competitorGravityData,
} from "@/lib/mock-data"

// ── Business type system ────────────────────────────────────────────────────
const BUSINESS_TYPES: Record<string, { emoji: string; color: string; bg: string; description: string }> = {
  "Local Favorite":      { emoji: "🏘️", color: "text-amber-700",   bg: "bg-amber-100",   description: "Your community's trusted go-to spot" },
  "Neighborhood Magnet": { emoji: "🧲", color: "text-purple-700",  bg: "bg-purple-100",  description: "Drawing customers from across the neighbourhood" },
  "Destination Spot":    { emoji: "🎯", color: "text-indigo-700",  bg: "bg-indigo-100",  description: "People actively choose to travel to you" },
  "Citywide Pull":       { emoji: "🌆", color: "text-emerald-700", bg: "bg-emerald-100", description: "Your reputation extends across the entire city" },
}

const type = BUSINESS_TYPES[brandGravityData.type] ?? BUSINESS_TYPES["Destination Spot"]

// Revenue per band (visits × avgSpend)
const revenueByBand = travelBands.map((b) => ({
  ...b,
  revenue: b.monthlyVisits * b.avgSpend,
}))

const totalRevenue = revenueByBand.reduce((s, b) => s + b.revenue, 0)

export default function BrandGravityPage() {
  return (
    <div>
      <Header
        title="Brand Gravity"
        subtitle="How far customers travel for you — and what your brand pull is worth"
      />

      <div className="p-6 space-y-6">

        {/* ── Hero: Score + Type ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

          {/* Score card */}
          <Card className="border-0 shadow-sm bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white xl:col-span-1">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-indigo-200 text-sm font-medium">Brand Gravity Score</p>
                  <p className="text-indigo-300 text-xs mt-0.5">{businessInfo.name}</p>
                </div>
                <Badge className={cn("border-0 text-xs font-semibold px-2.5", type.bg, type.color)}>
                  {type.emoji} {brandGravityData.type}
                </Badge>
              </div>

              <div className="flex items-end gap-3 mb-2">
                <span className="text-7xl font-black leading-none">{brandGravityData.score}</span>
                <span className="text-indigo-300 text-2xl mb-2">/ 100</span>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-white/20 text-white border-0 text-xs">
                  +{brandGravityData.trend} pts this month
                </Badge>
                <span className="text-indigo-300 text-xs">
                  Stronger than {brandGravityData.percentile}% of Geneva cafés
                </span>
              </div>

              <p className="text-sm text-indigo-200 leading-relaxed">{type.description}</p>
            </CardContent>
          </Card>

          {/* Score components */}
          <Card className="border-0 shadow-sm bg-white xl:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Score Breakdown</CardTitle>
              <p className="text-sm text-slate-500">Four signals that measure how much gravitational pull your brand has</p>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {brandGravityData.components.map((c) => (
                <div key={c.label} className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-600">{c.label}</span>
                    <span className="text-lg font-bold text-slate-900">{c.score}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden mb-2">
                    <div
                      className="h-1.5 rounded-full"
                      style={{ width: `${c.score}%`, backgroundColor: c.color }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{c.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* ── The Viral Feature: Travel Radius ────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* Concentric ring visualization */}
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Customer Travel Radius</CardTitle>
              <p className="text-sm text-slate-500">Where your customers come from — by distance from your door</p>
            </CardHeader>
            <CardContent>
              {/* Ring visualization */}
              <div className="flex items-center justify-center py-4">
                <div className="relative" style={{ width: 280, height: 280 }}>
                  {/* Ring 5km+ */}
                  <div className="absolute rounded-full" style={{
                    width: 280, height: 280, top: 0, left: 0,
                    backgroundColor: "rgba(148,163,184,0.12)",
                    border: "2px dashed rgba(148,163,184,0.35)",
                  }} />
                  {/* Ring 2-5km */}
                  <div className="absolute rounded-full" style={{
                    width: 210, height: 210, top: 35, left: 35,
                    backgroundColor: "rgba(6,182,212,0.10)",
                    border: "2px solid rgba(6,182,212,0.35)",
                  }} />
                  {/* Ring 500m-2km */}
                  <div className="absolute rounded-full" style={{
                    width: 148, height: 148, top: 66, left: 66,
                    backgroundColor: "rgba(139,92,246,0.12)",
                    border: "2px solid rgba(139,92,246,0.4)",
                  }} />
                  {/* Ring <500m */}
                  <div className="absolute rounded-full" style={{
                    width: 88, height: 88, top: 96, left: 96,
                    backgroundColor: "rgba(99,102,241,0.18)",
                    border: "2px solid rgba(99,102,241,0.5)",
                  }} />
                  {/* Center pin */}
                  <div className="absolute z-10 flex flex-col items-center" style={{
                    top: "50%", left: "50%", transform: "translate(-50%,-50%)"
                  }}>
                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Ring labels — positioned around the rings */}
                  <div className="absolute text-right" style={{ top: 6, right: 6 }}>
                    <span className="text-[10px] font-semibold text-slate-400">5km+</span>
                    <span className="text-[10px] text-slate-300 ml-1">6%</span>
                  </div>
                  <div className="absolute" style={{ top: 42, left: 6 }}>
                    <span className="text-[10px] font-semibold text-cyan-600">2–5km</span>
                    <span className="text-[10px] text-slate-400 ml-1">17%</span>
                  </div>
                  <div className="absolute text-right" style={{ top: 75, right: 6 }}>
                    <span className="text-[10px] font-semibold text-purple-600">500m–2km</span>
                    <span className="text-[10px] text-slate-400 ml-1">31%</span>
                  </div>
                  <div className="absolute" style={{ bottom: 90, left: 16 }}>
                    <span className="text-[10px] font-semibold text-indigo-600">&lt;500m</span>
                    <span className="text-[10px] text-slate-400 ml-1">46%</span>
                  </div>
                </div>
              </div>

              {/* Key stats */}
              <div className="grid grid-cols-3 gap-3 mt-2">
                {[
                  { label: "Average distance",  value: `${brandGravityData.avgTravelDistance} km` },
                  { label: "Top 10% travel",    value: `${brandGravityData.top10PctDistance} km` },
                  { label: "Loyalty radius",    value: `${brandGravityData.loyaltyRadius} km` },
                ].map((s) => (
                  <div key={s.label} className="bg-slate-50 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-slate-900">{s.value}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Insight */}
              <div className="mt-3 flex items-start gap-2 bg-indigo-50 rounded-xl p-3">
                <Info className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                <p className="text-xs text-indigo-800">
                  <strong>{brandGravityData.top10PctDistance} km</strong> — your most loyal customers travel this far.
                  Your top 10% destination customers likely spend <strong>34–42% more per visit</strong> than local walk-ins.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* vs Category Benchmark */}
          <div className="space-y-4">
            {/* The big benchmark card */}
            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-6">
                <p className="text-sm text-slate-500 mb-1">How your pull compares</p>
                <p className="text-3xl font-black text-slate-900 leading-tight">
                  Customers travel{" "}
                  <span className="text-indigo-600">{brandGravityData.categoryMultiplier}×</span>{" "}
                  farther for you
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  than the average café in Geneva ({brandGravityData.categoryAvgDistance} km avg vs your {brandGravityData.avgTravelDistance} km)
                </p>

                {/* Visual comparison */}
                <div className="mt-5 space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-indigo-700">{businessInfo.name} (you)</span>
                      <span className="font-bold text-indigo-700">{brandGravityData.avgTravelDistance} km</span>
                    </div>
                    <div className="h-3 rounded-full bg-indigo-100 overflow-hidden">
                      <div className="h-3 rounded-full bg-indigo-600" style={{ width: "74%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500">Geneva café average</span>
                      <span className="text-slate-500">{brandGravityData.categoryAvgDistance} km</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-3 rounded-full bg-slate-300" style={{ width: "38%" }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Competitor gravity table */}
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Gravity vs Nearby Competitors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {competitorGravityData
                  .slice()
                  .sort((a, b) => b.avgDistance - a.avgDistance)
                  .map((c) => (
                    <div key={c.name} className={cn(
                      "flex items-center gap-3 rounded-xl p-3",
                      c.isYou ? "bg-indigo-50 border border-indigo-200" : "bg-slate-50"
                    )}>
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-xs font-semibold truncate",
                          c.isYou ? "text-indigo-700" : "text-slate-700"
                        )}>
                          {c.name}{c.isYou && " ✓"}
                        </p>
                        <div className="mt-1 h-1.5 rounded-full bg-white overflow-hidden">
                          <div
                            className={cn("h-1.5 rounded-full", c.isYou ? "bg-indigo-500" : "bg-slate-400")}
                            style={{ width: `${(c.avgDistance / 3.5) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={cn("text-sm font-bold", c.isYou ? "text-indigo-700" : "text-slate-700")}>
                          {c.avgDistance} km
                        </p>
                        <p className="text-[10px] text-slate-400">score {c.score}</p>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ── Revenue by Distance Band ─────────────────────────────────── */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Revenue by Distance Band</CardTitle>
                <p className="text-sm text-slate-500 mt-0.5">
                  Destination customers spend more — here&apos;s exactly how much
                </p>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs">
                Total: CHF {totalRevenue.toLocaleString()}/mo
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Bar chart */}
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={revenueByBand} margin={{ left: -10, right: 8, top: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="band" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `CHF ${v}`} />
                  <Tooltip
                    formatter={(value) => [`CHF ${Number(value).toLocaleString()}`, "Revenue"]}
                    contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 12 }}
                  />
                  <Bar dataKey="revenue" radius={[6, 6, 0, 0]} maxBarSize={52}>
                    {revenueByBand.map((entry) => (
                      <Cell key={entry.band} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Band breakdown */}
              <div className="space-y-3">
                {revenueByBand.map((b) => (
                  <div key={b.band} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: b.color }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-700">{b.band} · {b.label}</span>
                        <span className="text-xs font-bold text-slate-900">CHF {b.revenue.toLocaleString()}/mo</span>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 text-[11px] text-slate-400">
                        <span>{b.monthlyVisits} visits</span>
                        <span>·</span>
                        <span>CHF {b.avgSpend} avg spend</span>
                        <span>·</span>
                        <span>{b.pct}% of customers</span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="mt-3 flex items-start gap-2 bg-emerald-50 rounded-lg p-3">
                  <TrendingUp className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-emerald-800">
                    <strong>Destination customers (5km+) spend CHF {revenueByBand[3]?.avgSpend} per visit</strong> —{" "}
                    {Math.round(((revenueByBand[3]?.avgSpend ?? 28) / (revenueByBand[0]?.avgSpend ?? 12) - 1) * 100)}% more
                    than your local walk-ins. Growing this segment by just 10 extra visits/month adds
                    CHF {((revenueByBand[3]?.avgSpend ?? 28) * 10).toLocaleString()} to your revenue.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Shareable Brand Report Card ──────────────────────────────── */}
        <Card className="border-0 shadow-sm bg-white overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Your Brand Gravity Report</CardTitle>
                <p className="text-sm text-slate-500 mt-0.5">Share this card — it&apos;s worth more than a marketing post</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                <Share2 className="w-3.5 h-3.5" />
                Share report
              </button>
            </div>
          </CardHeader>
          <CardContent>
            {/* The shareable card */}
            <div className="rounded-2xl bg-gradient-to-br from-gray-950 via-indigo-950 to-gray-950 p-8 text-white max-w-xl">
              {/* Header */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-indigo-300 text-sm font-semibold tracking-wide">PRESENCELY BRAND REPORT</span>
              </div>

              {/* Business name */}
              <p className="text-white/60 text-sm mb-1">{businessInfo.category} · {businessInfo.city}, Switzerland</p>
              <p className="text-2xl font-black text-white mb-6">{businessInfo.name}</p>

              {/* The viral stat */}
              <div className="mb-6">
                <p className="text-indigo-300 text-sm mb-1">People travel</p>
                <p className="text-6xl font-black text-white leading-none">
                  {brandGravityData.avgTravelDistance} km
                </p>
                <p className="text-white/70 text-sm mt-2">
                  for our coffee — {brandGravityData.categoryMultiplier}× the Geneva average
                </p>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Brand Gravity", value: `${brandGravityData.score}/100` },
                  { label: "Type",          value: brandGravityData.type },
                  { label: "City rank",     value: `Top ${100 - brandGravityData.percentile}%` },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-white/50 text-[10px] uppercase tracking-wider">{s.label}</p>
                    <p className="text-white text-sm font-bold mt-0.5">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Type badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                <span className="text-lg">{type.emoji}</span>
                <span className="text-white text-sm font-semibold">{brandGravityData.type}</span>
              </div>
            </div>

            {/* What this means */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: Users,      color: "text-indigo-600", bg: "bg-indigo-50",  label: "13% destination customers", sub: "Travelling 5km+ specifically for you — your brand has real pull" },
                { icon: Star,       color: "text-purple-600", bg: "bg-purple-50",  label: "133% more per visit",       sub: "Destination customers spend significantly more than local walk-ins" },
                { icon: Navigation, color: "text-emerald-600", bg: "bg-emerald-50", label: "Top 32% in Geneva",         sub: "Your brand gravity is stronger than most cafés in the city" },
              ].map((tip) => {
                const Icon = tip.icon
                return (
                  <div key={tip.label} className={cn("rounded-xl p-4 flex gap-3", tip.bg)}>
                    <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", tip.color)} />
                    <div>
                      <p className="text-sm font-bold text-slate-800">{tip.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{tip.sub}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* How to improve */}
            <div className="mt-4 flex items-center justify-between bg-slate-50 rounded-xl p-4">
              <div>
                <p className="text-sm font-semibold text-slate-800">Want to grow your gravity score?</p>
                <p className="text-xs text-slate-500 mt-0.5">Improving your rating from 4.6 → 4.8 could expand your travel radius by ~18% and attract more destination customers</p>
              </div>
              <a href="/dashboard/reputation" className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 whitespace-nowrap ml-4">
                Boost score <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

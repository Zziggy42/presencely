"use client"

import Header from "@/components/layout/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Search,
  MapPin,
  Navigation,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  Zap,
  Info,
  ChevronRight,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import {
  overviewMetrics,
  customerDistanceData,
  customerSegments,
  weekForecastData,
  hourlyDemandData,
  businessSettings,
  decisionTimeData,
} from "@/lib/mock-data"
import { computeDiscoveryFunnel, computeLoyaltyRadius } from "@/lib/insights-engine"

// ── Compute everything at render time ────────────────────────────────────────
const funnel = computeDiscoveryFunnel(
  overviewMetrics.searchImpressions.value,
  overviewMetrics.mapsViews.value,
  overviewMetrics.directionRequests.value,
  businessSettings.directionToVisitRate,
  businessSettings.avgSpendPerVisit,
)

const loyalty = computeLoyaltyRadius(customerDistanceData, funnel[3].value)

// Heatmap helpers
const HOURS = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
const DAYS  = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

function formatHour(h: number): string {
  if (h === 12) return "12pm"
  return h < 12 ? `${h}am` : `${h - 12}pm`
}

function heatColor(score: number): string {
  if (score >= 85) return "bg-indigo-600 text-white"
  if (score >= 65) return "bg-indigo-400 text-white"
  if (score >= 40) return "bg-indigo-200 text-indigo-900"
  if (score >= 20) return "bg-indigo-100 text-indigo-700"
  return "bg-slate-100 text-slate-400"
}

// Build lookup for heatmap: "Mon-7" → score
const heatLookup: Record<string, number> = {}
for (const d of hourlyDemandData) {
  for (const h of HOURS) {
    const score = (d as Record<string, unknown>)[h.toString()]
    if (typeof score === "number") heatLookup[`${d.day}-${h}`] = score
  }
}

// Funnel icon mapping
const FUNNEL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Search,
  MapPin,
  Navigation,
  Users,
  DollarSign,
}

export default function CustomersPage() {
  return (
    <div>
      <Header
        title="Customer Intelligence"
        subtitle="Deep analytics on your customer journey, origin, and demand patterns"
      />

      <div className="p-6 space-y-6">

        {/* ── Hero Stats Row ───────────────────────────────────────────── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            {
              label: "Avg Distance Traveled",
              value: `${loyalty.avgDistance} km`,
              sub: "to visit your business",
              icon: MapPin,
              color: "text-indigo-600",
              bg: "bg-indigo-50",
            },
            {
              label: "Loyalty Radius",
              value: `${loyalty.loyaltyRadius80pct} km`,
              sub: "80% of customers live within",
              icon: Zap,
              color: "text-purple-600",
              bg: "bg-purple-50",
            },
            {
              label: "True Monthly Visitors",
              value: `~${loyalty.estimatedTrueMonthlyVisitors.toLocaleString()}`,
              sub: "incl. walk-ins who skip Google",
              icon: Users,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
            },
            {
              label: "Maps → Visit Rate",
              value: `${Math.round(businessSettings.directionToVisitRate * 100)}%`,
              sub: "of direction clicks become visits",
              icon: Navigation,
              color: "text-cyan-600",
              bg: "bg-cyan-50",
            },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="border-0 shadow-sm bg-white">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-500 mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                      <p className="text-xs text-slate-400 mt-1">{stat.sub}</p>
                    </div>
                    <div className={cn("p-2.5 rounded-xl", stat.bg)}>
                      <Icon className={cn("w-5 h-5", stat.color)} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* ── Discovery Funnel ─────────────────────────────────────────── */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Full Discovery Funnel</CardTitle>
                <p className="text-sm text-slate-500 mt-0.5">
                  How customers move from finding you online to spending money in person
                </p>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs">This Month</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Funnel stages */}
            <div className="flex items-stretch gap-0 mt-2 overflow-x-auto pb-2">
              {funnel.map((stage, i) => {
                const Icon = FUNNEL_ICONS[stage.iconName]
                const isLast = i === funnel.length - 1
                return (
                  <div key={stage.label} className="flex items-stretch flex-1 min-w-[120px]">
                    {/* Stage node */}
                    <div className="flex-1 flex flex-col items-center text-center bg-slate-50 rounded-xl p-4">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center mb-3",
                        i === 0 ? "bg-indigo-100" :
                        i === 1 ? "bg-purple-100" :
                        i === 2 ? "bg-cyan-100" :
                        i === 3 ? "bg-emerald-100" : "bg-orange-100"
                      )}>
                        <Icon className={cn("w-5 h-5",
                          i === 0 ? "text-indigo-600" :
                          i === 1 ? "text-purple-600" :
                          i === 2 ? "text-cyan-600" :
                          i === 3 ? "text-emerald-600" : "text-orange-600"
                        )} />
                      </div>
                      <p className="text-xl font-bold text-slate-900">{stage.formatted}</p>
                      <p className="text-xs text-slate-500 mt-1 leading-tight">{stage.label}</p>
                    </div>

                    {/* Arrow + conversion rate */}
                    {!isLast && stage.conversionToNext !== null && (
                      <div className="flex flex-col items-center justify-center px-1 min-w-[56px]">
                        <div className={cn(
                          "text-xs font-bold mb-0.5",
                          stage.aboveAvg ? "text-emerald-600" : "text-orange-500"
                        )}>
                          {stage.conversionToNext}%
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                        {stage.industryAvg !== null && (
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            avg {stage.industryAvg}%
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Funnel insight */}
            <div className="mt-4 flex items-start gap-2 bg-amber-50 rounded-lg p-3">
              <Info className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-800">
                <strong>Biggest opportunity:</strong> Only 19% of Maps visitors request directions — below the 25% top-quartile benchmark.
                Improving your GBP photos, menu completeness, and review responses could push this to 25%+,
                adding <strong>~186 more direction requests/month</strong>.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ── Decision Time ─────────────────────────────────────────────── */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  Customer Decision Time
                </CardTitle>
                <p className="text-sm text-slate-500 mt-0.5">
                  Average time between Google search and arriving in person
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-slate-900">
                  {decisionTimeData.avgMinutes}
                  <span className="text-base font-normal text-slate-400 ml-1">min avg</span>
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {decisionTimeData.breakdown.map((row) => {
              const INTENT: Record<typeof row.intent, {
                bar: string; label: string; bg: string; tip: string;
              }> = {
                immediate:   { bar: "bg-emerald-500", label: "bg-emerald-200 text-emerald-800", bg: "bg-emerald-50",  tip: "text-emerald-700"  },
                high:        { bar: "bg-indigo-500",  label: "bg-indigo-200 text-indigo-800",   bg: "bg-indigo-50",   tip: "text-indigo-700"  },
                planning:    { bar: "bg-amber-400",   label: "bg-amber-200 text-amber-800",     bg: "bg-amber-50",    tip: "text-amber-700"   },
                exploratory: { bar: "bg-slate-400",   label: "bg-slate-200 text-slate-700",     bg: "bg-slate-50",    tip: "text-slate-600"   },
              }
              const s = INTENT[row.intent]
              const intentLabels = { immediate: "Immediate", high: "High intent", planning: "Planning", exploratory: "Browsing" }
              return (
                <div key={row.situation} className={cn("rounded-xl p-4", s.bg)}>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2.5">
                        <p className="text-sm font-semibold text-slate-800">{row.situation}</p>
                        <span className={cn("text-xs font-semibold px-1.5 py-0.5 rounded-full shrink-0", s.label)}>
                          {intentLabels[row.intent]}
                        </span>
                      </div>
                      <div className="h-2 bg-white/60 rounded-full overflow-hidden">
                        <div
                          className={cn("h-full rounded-full", s.bar)}
                          style={{ width: `${(row.minutes / 36) * 100}%` }}
                        />
                      </div>
                      <p className={cn("text-xs mt-2 font-medium", s.tip)}>→ {row.tip}</p>
                    </div>
                    <div className="text-right shrink-0 w-14">
                      <p className="text-2xl font-black text-slate-900">{row.minutes}</p>
                      <p className="text-xs text-slate-400">min</p>
                    </div>
                  </div>
                </div>
              )
            })}
            <div className="flex items-start gap-2 bg-indigo-50 rounded-xl p-3 border border-indigo-100 mt-1">
              <Zap className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
              <p className="text-xs text-indigo-800">
                <strong>Key insight:</strong> Morning searches arrive within 5 minutes — every minute your doors
                are closed after 7h costs you customers who are already on their way to Café du Lac.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ── Distance + Segments row ──────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* Distance distribution */}
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Customer Origin & Distance</CardTitle>
              <p className="text-sm text-slate-500">
                Where your customers travel from — based on direction request origin data
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={customerDistanceData}
                  layout="vertical"
                  margin={{ left: 8, right: 32, top: 4, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" domain={[0, 50]} tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} unit="%" />
                  <YAxis type="category" dataKey="range" tick={{ fontSize: 12, fill: "#64748b" }} tickLine={false} axisLine={false} width={56} />
                  <Tooltip
                    formatter={(value, _, entry) => [`${value}% — ${(entry.payload as { label: string }).label}`, ""]}
                    contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 12 }}
                  />
                  <Bar dataKey="pct" radius={[0, 6, 6, 0]} maxBarSize={24}>
                    {customerDistanceData.map((entry) => (
                      <Cell key={entry.range} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Key stats */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { label: "Avg distance", value: `${loyalty.avgDistance} km` },
                  { label: "Walk-in rate", value: `${loyalty.walkInRate}%` },
                  { label: "Destination", value: `${loyalty.destinationRate}%` },
                ].map((s) => (
                  <div key={s.label} className="bg-slate-50 rounded-lg p-3 text-center">
                    <p className="text-base font-bold text-slate-900">{s.value}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex items-start gap-2 bg-indigo-50 rounded-lg p-3">
                <Info className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                <p className="text-xs text-indigo-800">
                  <strong>{loyalty.walkInRate}% of customers live within walking distance</strong> and rarely request Google directions.
                  Your true monthly visitor count is estimated at <strong>~{loyalty.estimatedTrueMonthlyVisitors.toLocaleString()}</strong> — much higher than direction requests suggest.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Customer Segments */}
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Customer Segments</CardTitle>
              <p className="text-sm text-slate-500">
                Three distinct groups — each needs a different strategy to grow
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {customerSegments.map((seg) => (
                <div key={seg.label} className="border border-slate-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: seg.color }}
                      />
                      <span className="font-semibold text-sm text-slate-800">{seg.label}</span>
                      <span className="text-xs text-slate-400">{seg.range}</span>
                    </div>
                    <Badge className="text-white border-0 text-xs" style={{ backgroundColor: seg.color }}>
                      {seg.pct}% of customers
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <div>
                      <p className="text-lg font-bold text-slate-900">CHF {seg.avgSpend}</p>
                      <p className="text-xs text-slate-400">avg spend / visit</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-slate-900">{seg.freqPerMonth}×</p>
                      <p className="text-xs text-slate-400">visits / month</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{seg.insight}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* ── Peak Hour Heatmap ─────────────────────────────────────────── */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Peak Demand Heatmap</CardTitle>
                <p className="text-sm text-slate-500 mt-0.5">
                  Hour-by-hour demand across the week — your staffing and prep bible
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <div className="flex gap-1 items-center">
                  <div className="w-3 h-3 rounded-sm bg-slate-100" />
                  <span>Low</span>
                </div>
                <div className="flex gap-1 items-center">
                  <div className="w-3 h-3 rounded-sm bg-indigo-200" />
                  <span>Med</span>
                </div>
                <div className="flex gap-1 items-center">
                  <div className="w-3 h-3 rounded-sm bg-indigo-400" />
                  <span>High</span>
                </div>
                <div className="flex gap-1 items-center">
                  <div className="w-3 h-3 rounded-sm bg-indigo-600" />
                  <span>Peak</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {/* Day header row */}
              <div className="grid gap-1 mb-1" style={{ gridTemplateColumns: "48px repeat(7, 1fr)" }}>
                <div />
                {DAYS.map((d) => (
                  <div key={d} className="text-center text-xs font-semibold text-slate-500 py-1">{d}</div>
                ))}
              </div>

              {/* Hour rows */}
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="grid gap-1 mb-1"
                  style={{ gridTemplateColumns: "48px repeat(7, 1fr)" }}
                >
                  {/* Hour label */}
                  <div className="text-right text-xs text-slate-400 pr-2 flex items-center justify-end">
                    {formatHour(hour)}
                  </div>
                  {/* Day cells */}
                  {DAYS.map((day) => {
                    const score = heatLookup[`${day}-${hour}`] ?? 0
                    return (
                      <div
                        key={day}
                        title={`${day} ${formatHour(hour)}: ${score}/100 demand`}
                        className={cn(
                          "rounded-md h-7 flex items-center justify-center text-[10px] font-medium cursor-help transition-opacity hover:opacity-80",
                          heatColor(score)
                        )}
                      >
                        {score >= 65 ? score : ""}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>

            {/* Heatmap insight */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50", label: "Peak slot", value: "Fri 9am", sub: "Score 92 — max prep needed" },
                { icon: Clock,      color: "text-purple-600", bg: "bg-purple-50",  label: "Daily peak window", value: "8am – 10am", sub: "Consistent across all days" },
                { icon: TrendingDown, color: "text-slate-400", bg: "bg-slate-50", label: "Quietest slot", value: "Sun 7am",  sub: "Score 6 — minimal staff" },
              ].map((tip) => {
                const Icon = tip.icon
                return (
                  <div key={tip.label} className={cn("rounded-xl p-3 flex items-start gap-3", tip.bg)}>
                    <Icon className={cn("w-4 h-4 mt-0.5", tip.color)} />
                    <div>
                      <p className="text-xs text-slate-500">{tip.label}</p>
                      <p className="text-sm font-bold text-slate-800">{tip.value}</p>
                      <p className="text-xs text-slate-400">{tip.sub}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* ── Week Ahead Forecast ───────────────────────────────────────── */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Week Ahead Forecast</CardTitle>
                <p className="text-sm text-slate-500 mt-0.5">
                  Predicted demand for Mar 8–14 — plan staffing and promotions in advance
                </p>
              </div>
              <Badge className="bg-indigo-100 text-indigo-700 border-0 text-xs">Next 7 Days</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {weekForecastData.map((day) => {
                const isUp = day.vsLastWeek >= 0
                const isHot = day.index >= 150
                const TrendIcon = isUp ? TrendingUp : TrendingDown
                return (
                  <div
                    key={day.day}
                    className={cn(
                      "flex flex-col items-center rounded-xl p-3 text-center border",
                      isHot
                        ? "border-indigo-200 bg-indigo-50"
                        : "border-slate-100 bg-white"
                    )}
                  >
                    <p className="text-xs font-bold text-slate-700">{day.day}</p>
                    <p className="text-[10px] text-slate-400 mb-2">{day.date}</p>

                    {/* Demand bar */}
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2">
                      <div
                        className={cn("h-1.5 rounded-full", isHot ? "bg-indigo-600" : "bg-indigo-300")}
                        style={{ width: `${Math.min(100, (day.index / 180) * 100)}%` }}
                      />
                    </div>

                    <p className={cn("text-lg font-bold", isHot ? "text-indigo-700" : "text-slate-800")}>
                      {day.index}
                    </p>
                    <div className={cn("flex items-center gap-0.5 text-[10px] font-medium mt-0.5",
                      isUp ? "text-emerald-600" : "text-red-500"
                    )}>
                      <TrendIcon className="w-2.5 h-2.5" />
                      {Math.abs(day.vsLastWeek)}% vs last wk
                    </div>

                    <div className="mt-2 flex items-center gap-0.5 text-[10px] text-slate-400">
                      <Clock className="w-2.5 h-2.5" />
                      {day.busyHour}
                    </div>

                    {isHot && (
                      <div className="mt-1.5">
                        <Badge className="bg-indigo-600 text-white border-0 text-[9px] px-1.5 py-0">Peak</Badge>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Action recommendations */}
            <div className="mt-4 space-y-2">
              {weekForecastData.filter((d) => d.index >= 100).slice(0, 3).map((day) => (
                <div key={day.day} className="flex items-start gap-3 bg-slate-50 rounded-lg p-3">
                  <div className={cn(
                    "text-xs font-bold px-2 py-0.5 rounded-md min-w-[36px] text-center mt-0.5",
                    day.index >= 150 ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-700"
                  )}>
                    {day.day}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">{day.date} · Peak: {day.busyHour}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{day.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

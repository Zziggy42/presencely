"use client"

import Header from "@/components/layout/Header"
import MetricCard from "@/components/dashboard/MetricCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  BarChart, Bar,
} from "recharts"
import {
  MapPin, Search, Globe, Phone, Navigation, Star,
  AlertCircle, ArrowRight, DollarSign, TrendingUp,
  Zap, ChevronRight, Clock, CheckCircle2, Target, Activity,
} from "lucide-react"
import {
  overviewMetrics, weeklySearchData, trafficSourceData,
  recentReviews, seoIssues, businessInfo, businessSettings,
  revenueLeaks, growthScore, actionQueue, revenueAttributionData,
  brandGravityData, demandCaptureData, visibilityEfficiencyData,
  dailyPulse,
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"]

const metricCards = [
  { key: "searchImpressions", icon: Search,     color: "text-indigo-600" },
  { key: "mapsViews",         icon: MapPin,      color: "text-purple-600" },
  { key: "websiteClicks",     icon: Globe,       color: "text-cyan-600"   },
  { key: "directionRequests", icon: Navigation,  color: "text-emerald-600"},
  { key: "phoneCallClicks",   icon: Phone,       color: "text-orange-600" },
  { key: "reviewCount",       icon: Star,        color: "text-yellow-600" },
]

// Derived revenue numbers
const estimatedVisits   = Math.round(overviewMetrics.directionRequests.value * businessSettings.directionToVisitRate)
const monthlyRevenue    = estimatedVisits * businessSettings.avgSpendPerVisit
const totalRevenueAtRisk = revenueLeaks.reduce((s, l) => s + l.estimatedLoss, 0)
const totalActionUplift  = actionQueue.reduce((s, a) => s + a.revenueImpact, 0)

export default function DashboardPage() {
  const criticalIssues = seoIssues.filter((i) => i.severity === "critical")

  return (
    <div>
      <Header
        title="Revenue Intelligence"
        subtitle={`${businessInfo.name} — what your online presence earned you this month`}
      />

      <div className="p-6 space-y-6">

        {/* ── Daily Business Pulse ─────────────────────────────────────── */}
        {(() => {
          const pulse = dailyPulse
          const statusConfig = {
            above:  { bg: "from-emerald-500 to-green-600",   badge: "bg-emerald-100 text-emerald-800",  dot: "bg-emerald-400",  barColor: "#10b981", label: "Above Average" },
            normal: { bg: "from-indigo-500 to-blue-600",     badge: "bg-indigo-100 text-indigo-800",    dot: "bg-indigo-400",   barColor: "#6366f1", label: "Normal"        },
            below:  { bg: "from-amber-500 to-orange-500",    badge: "bg-amber-100 text-amber-800",      dot: "bg-amber-400",    barColor: "#f59e0b", label: "Below Average" },
            slow:   { bg: "from-red-500 to-rose-600",        badge: "bg-red-100 text-red-800",          dot: "bg-red-400",      barColor: "#ef4444", label: "Slow Day"      },
          }[pulse.status]

          return (
            <div className={`rounded-2xl bg-gradient-to-r ${statusConfig.bg} text-white p-5 shadow-sm`}>
              <div className="flex flex-col xl:flex-row xl:items-center gap-5">

                {/* Left: headline pulse */}
                <div className="xl:w-64 shrink-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-4 h-4 text-white/80" />
                    <p className="text-xs font-bold uppercase tracking-widest text-white/70">Today&apos;s Demand Pulse</p>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black">{pulse.pulsePercent}%</span>
                    <span className="text-lg text-white/70">of normal</span>
                  </div>
                  <p className="text-sm font-semibold text-white/90 mt-1">{pulse.statusLabel}</p>
                  <p className="text-xs text-white/60 mt-0.5">{pulse.today}, {pulse.date} · {pulse.driver}</p>
                </div>

                {/* Centre: hourly bar chart */}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2">Hourly forecast vs normal</p>
                  <div className="h-16">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={pulse.hourlyForecast} barGap={1} barCategoryGap="20%">
                        <Bar dataKey="normal" fill="rgba(255,255,255,0.2)" radius={[2,2,0,0]} />
                        <Bar dataKey="today" radius={[2,2,0,0]}>
                          {pulse.hourlyForecast.map((h, i) => (
                            <Cell
                              key={i}
                              fill={h.isCurrent ? "#fff" : h.isPast ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.65)"}
                            />
                          ))}
                        </Bar>
                        <XAxis dataKey="hour" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 9 }} axisLine={false} tickLine={false} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Right: stats + insight */}
                <div className="xl:w-56 shrink-0 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white/15 rounded-xl p-2.5 text-center">
                      <p className="text-xl font-bold">{pulse.estimatedVisitsToday}</p>
                      <p className="text-[10px] text-white/60 leading-tight">est. visitors today</p>
                    </div>
                    <div className="bg-white/15 rounded-xl p-2.5 text-center">
                      <p className="text-xl font-bold">+{pulse.extraVisitsToday}</p>
                      <p className="text-[10px] text-white/60 leading-tight">above your norm</p>
                    </div>
                  </div>
                  <div className="bg-black/20 rounded-xl p-3">
                    <p className="text-[11px] text-white/90 leading-snug font-medium">💡 {pulse.todayInsight}</p>
                  </div>
                </div>

              </div>
            </div>
          )
        })()}

        {/* ── 4 Core Business Metrics ──────────────────────────────────── */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-4 divide-x divide-slate-100">
            {([
              {
                label:  "Brand Gravity",
                value:  `${brandGravityData.score}`,
                unit:   "/ 100",
                sub:    brandGravityData.type,
                change: `+${brandGravityData.trend} pts this month`,
                color:  "#6366f1",
                href:   "/dashboard/brand-gravity",
                Icon:   Target,
              },
              {
                label:  "Customer Reach",
                value:  `${brandGravityData.avgTravelDistance} km`,
                unit:   "",
                sub:    `${brandGravityData.categoryMultiplier}× the city average`,
                change: "Loyalty radius expanding ↑",
                color:  "#8b5cf6",
                href:   "/dashboard/customers",
                Icon:   MapPin,
              },
              {
                label:  "Demand Capture Rate",
                value:  `${demandCaptureData.captureRate}%`,
                unit:   "",
                sub:    "of local searches convert",
                change: `${demandCaptureData.topCompetitorRate}% possible`,
                color:  "#f59e0b",
                href:   "/dashboard/visibility",
                Icon:   TrendingUp,
              },
              {
                label:  "Online → Visit Rate",
                value:  `${visibilityEfficiencyData.onlineToVisitConvRate}%`,
                unit:   "",
                sub:    `vs ${visibilityEfficiencyData.industryAvgConvRate}% industry avg`,
                change: `+${(visibilityEfficiencyData.onlineToVisitConvRate - visibilityEfficiencyData.industryAvgConvRate).toFixed(1)}% above average`,
                color:  "#10b981",
                href:   "/dashboard/customers",
                Icon:   Navigation,
              },
            ] as const).map((kpi) => {
              const Icon = kpi.Icon
              return (
                <a
                  key={kpi.label}
                  href={kpi.href}
                  className="p-5 hover:bg-slate-50/80 transition-colors group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: kpi.color }} />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{kpi.label}</p>
                    <Icon className="w-3.5 h-3.5 ml-auto text-slate-300 group-hover:text-slate-400 transition-colors" />
                  </div>
                  <div className="flex items-baseline gap-1">
                    <p className="text-3xl font-black text-slate-900">{kpi.value}</p>
                    {kpi.unit && <span className="text-slate-400 text-sm font-normal">{kpi.unit}</span>}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-tight">{kpi.sub}</p>
                  <p className="text-xs font-semibold mt-2 flex items-center gap-1" style={{ color: kpi.color }}>
                    {kpi.change}
                  </p>
                </a>
              )
            })}
          </div>
        </div>

        {/* ── Revenue Hero Row ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Monthly revenue */}
          <Card className="border-0 shadow-sm bg-gradient-to-br from-indigo-600 to-purple-600 text-white col-span-1">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm font-medium text-indigo-200">Est. Monthly Revenue</p>
                <div className="bg-white/20 rounded-lg p-1.5">
                  <DollarSign className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold">CHF {monthlyRevenue.toLocaleString()}</p>
              <p className="text-xs text-indigo-200 mt-1">from online discovery this month</p>
              <div className="mt-3 flex items-center gap-1 text-xs text-indigo-200">
                <TrendingUp className="w-3 h-3" />
                <span>+22% vs last month</span>
              </div>
            </CardContent>
          </Card>

          {/* Growth Score */}
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-2">
                <p className="text-xs font-medium text-slate-500">Growth Score</p>
                <div className="bg-emerald-50 rounded-lg p-1.5">
                  <Zap className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold text-slate-900">{growthScore.overall}</p>
                <span className="text-slate-400 text-lg mb-0.5">/ 100</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px] px-1.5">
                  +{growthScore.trend} pts this month
                </Badge>
                <span className="text-[10px] text-slate-400">avg {growthScore.benchmark}</span>
              </div>
            </CardContent>
          </Card>

          {/* Revenue at risk */}
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-2">
                <p className="text-xs font-medium text-slate-500">Revenue at Risk</p>
                <div className="bg-red-50 rounded-lg p-1.5">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                </div>
              </div>
              <p className="text-3xl font-bold text-red-600">−CHF {totalRevenueAtRisk.toLocaleString()}</p>
              <p className="text-xs text-slate-400 mt-1">leaving on the table this month</p>
              <a href="/dashboard/reputation" className="mt-2 flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium">
                Fix leaks <ArrowRight className="w-3 h-3" />
              </a>
            </CardContent>
          </Card>

          {/* Best opportunity */}
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-2">
                <p className="text-xs font-medium text-slate-500">Quick Wins Available</p>
                <div className="bg-amber-50 rounded-lg p-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-500" />
                </div>
              </div>
              <p className="text-3xl font-bold text-amber-600">+CHF {totalActionUplift.toLocaleString()}</p>
              <p className="text-xs text-slate-400 mt-1">reachable in under 30 min total</p>
              <a href="/dashboard/insights" className="mt-2 flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 font-medium">
                See actions <ArrowRight className="w-3 h-3" />
              </a>
            </CardContent>
          </Card>
        </div>

        {/* ── Revenue Leaks + Action Queue ─────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* Revenue Leaks — Causality Engine */}
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Revenue Leaks</CardTitle>
                  <p className="text-sm text-slate-500 mt-0.5">Exactly why you&apos;re losing money — and how to stop it</p>
                </div>
                <Badge className="bg-red-100 text-red-700 border-0 text-xs">
                  −CHF {totalRevenueAtRisk.toLocaleString()}/mo
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {revenueLeaks.map((leak) => (
                <a key={leak.id} href={leak.href} className="block group">
                  <div className={cn(
                    "rounded-xl p-4 border transition-colors",
                    leak.severity === "high"
                      ? "border-red-100 bg-red-50 hover:border-red-200"
                      : "border-orange-100 bg-orange-50 hover:border-orange-200"
                  )}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{leak.cause}</p>
                        {/* Causal chain */}
                        <p className="text-[11px] text-slate-500 mt-1 font-mono tracking-tight">{leak.causalChain}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-[11px] text-slate-500">Fix:</span>
                          <span className="text-[11px] font-medium text-slate-700 flex items-center gap-1">
                            {leak.action} <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={cn("text-lg font-bold",
                          leak.severity === "high" ? "text-red-600" : "text-orange-500"
                        )}>
                          −CHF {leak.estimatedLoss.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-slate-400">/month</p>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </CardContent>
          </Card>

          {/* Do This Now — Action Queue */}
          <div className="space-y-4">

            {/* Action Queue */}
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">Do This → Earn More</CardTitle>
                    <p className="text-sm text-slate-500 mt-0.5">Prioritised by revenue impact per minute of effort</p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs">
                    +CHF {totalActionUplift.toLocaleString()}/mo
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {actionQueue.map((item, i) => (
                  <a key={item.id} href={item.href} className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors group">
                    {/* Priority number */}
                    <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 leading-tight">{item.action}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-1 text-[11px] text-slate-500">
                          <Clock className="w-3 h-3" />{item.effort}
                        </span>
                        <span className="text-[11px] text-slate-300">·</span>
                        <span className="text-[11px] text-slate-500">Results in {item.timeToResults}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-base font-bold text-emerald-600">+CHF {item.revenueImpact.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400">/month</p>
                    </div>
                  </a>
                ))}
              </CardContent>
            </Card>

            {/* Growth Score Breakdown */}
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Growth Score Breakdown</CardTitle>
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold text-slate-900">{growthScore.overall}</span>
                    <span className="text-slate-400">/100</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {growthScore.components.map((c) => (
                  <div key={c.label}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700">{c.label}</span>
                      <span className="font-bold text-slate-800">{c.score}/100</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{ width: `${c.score}%`, backgroundColor: c.color }}
                      />
                    </div>
                  </div>
                ))}
                <p className="text-[11px] text-slate-400 pt-1">
                  Industry average: {growthScore.benchmark}/100 · You&apos;re {growthScore.overall - growthScore.benchmark} pts ahead
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ── Metrics grid ─────────────────────────────────────────────── */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">This Month&apos;s Signals</p>
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
            {metricCards.map(({ key, icon, color }) => {
              const metric = overviewMetrics[key as keyof typeof overviewMetrics]
              return (
                <MetricCard
                  key={key}
                  label={metric.label}
                  value={metric.value}
                  change={metric.change}
                  icon={icon}
                  iconColor={color}
                />
              )
            })}
          </div>
        </div>

        {/* ── Charts row ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-6">
          {/* Weekly activity */}
          <div className="col-span-2">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Weekly Search & Maps Activity</CardTitle>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-1 bg-indigo-500 rounded-full inline-block" />
                      Google Search
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-1 bg-purple-400 rounded-full inline-block" />
                      Maps Views
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={weeklySearchData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                    <defs>
                      <linearGradient id="colorSearches" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorMaps" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                    <Area type="monotone" dataKey="searches" stroke="#6366f1" strokeWidth={2} fill="url(#colorSearches)" name="Google Search" />
                    <Area type="monotone" dataKey="maps" stroke="#a78bfa" strokeWidth={2} fill="url(#colorMaps)" name="Maps Views" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Revenue attribution */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Revenue by Source</CardTitle>
              <p className="text-xs text-slate-500">Where your CHF {monthlyRevenue.toLocaleString()} came from</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie
                    data={revenueAttributionData}
                    cx="50%" cy="50%"
                    innerRadius={40} outerRadius={65}
                    paddingAngle={3}
                    dataKey="revenue"
                  >
                    {revenueAttributionData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`CHF ${Number(value).toLocaleString()}`, ""]}
                    contentStyle={{ borderRadius: 8, border: "none" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-1">
                {revenueAttributionData.map((item) => (
                  <div key={item.source} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-600 truncate">{item.source}</span>
                    </div>
                    <span className="font-semibold text-slate-800 shrink-0">CHF {item.revenue.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Recent Reviews ───────────────────────────────────────────── */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Recent Reviews</CardTitle>
              <a href="/dashboard/reputation" className="text-xs text-indigo-600 hover:underline">View all →</a>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
              {recentReviews.slice(0, 3).map((review) => (
                <div key={review.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">{review.author}</span>
                      <Badge variant="outline" className="text-xs px-1.5 py-0 capitalize">{review.platform}</Badge>
                      {!review.replied && (
                        <Badge className="text-xs px-1.5 py-0 bg-amber-100 text-amber-700 hover:bg-amber-100">Needs reply</Badge>
                      )}
                    </div>
                    <div className="flex mb-1">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} className={`w-3 h-3 ${s <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                      ))}
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">{review.text}</p>
                  </div>
                </div>
              ))}
            </div>
            {criticalIssues.length > 0 && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <p className="text-xs font-medium text-red-800 flex-1">
                  {criticalIssues.length} critical SEO issues suppressing your revenue
                </p>
                <a href="/dashboard/seo" className="text-xs font-semibold text-red-700 hover:text-red-900 shrink-0">
                  Fix now →
                </a>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

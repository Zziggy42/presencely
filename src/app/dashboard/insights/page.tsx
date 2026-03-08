"use client"

import Header from "@/components/layout/Header"
import MetricCard from "@/components/dashboard/MetricCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts"
import {
  Users,
  DollarSign,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Info,
  Zap,
} from "lucide-react"
import {
  seoIssues,
  recentReviews,
  weeklySearchData,
  projectionData,
  businessSettings,
  overviewMetrics,
} from "@/lib/mock-data"
import {
  computeImpactBreakdown,
  computeTrafficLift,
  computeROI,
  computeBusiestDays,
  computeOverallConfidence,
  computeVisibilityGapPercent,
  type ImpactTier,
} from "@/lib/insights-engine"

// ─── Run the algorithms ────────────────────────────────────────────────────

// 1. Gap must be computed first — it anchors the ROI to real observed data
const visibilityGap = computeVisibilityGapPercent(projectionData)

// 2. Factor status (resolved/pending) drives the impact breakdown cards
const factors = computeImpactBreakdown(
  seoIssues,
  recentReviews,
  overviewMetrics.directionRequests.value
)

// 3. Traffic lift uses the measured gap so ROI reflects actual improvement
const trafficLift = computeTrafficLift(
  overviewMetrics.directionRequests.value,
  factors,
  visibilityGap
)
const roi = computeROI(trafficLift, businessSettings.avgSpendPerVisit, businessSettings.directionToVisitRate, factors)
const busyDays = computeBusiestDays(weeklySearchData)
const confidence = computeOverallConfidence(factors)

// ─── Tier styling helpers ──────────────────────────────────────────────────

const TIER_BAR_COLOR: Record<ImpactTier, string> = {
  Peak:   "bg-red-400",
  High:   "bg-orange-400",
  Medium: "bg-yellow-400",
  Low:    "bg-gray-300",
}

const TIER_BADGE_STYLE: Record<ImpactTier, string> = {
  Peak:   "bg-red-100 text-red-700",
  High:   "bg-orange-100 text-orange-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Low:    "bg-gray-100 text-gray-500",
}

// ─── Custom chart tooltip ──────────────────────────────────────────────────

function ProjectionTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  const isProjected = projectionData.find((d) => d.month === label)?.projected
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-gray-900 mb-1.5">
        {label} {isProjected && <span className="text-xs text-indigo-500 font-normal">(projected)</span>}
      </p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="text-xs">
          {p.name}: <strong>{p.value.toLocaleString()}</strong> impressions
        </p>
      ))}
      {payload.length === 2 && (
        <p className="text-xs text-emerald-600 mt-1 font-medium border-t border-gray-100 pt-1">
          +{(payload[0].value - payload[1].value).toLocaleString()} from Presencely
        </p>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────

export default function InsightsPage() {
  const pendingFactors = factors.filter((f) => f.status === "pending")
  const resolvedFactors = factors.filter((f) => f.status === "resolved")

  return (
    <div>
      <Header
        title="Predictive Insights"
        subtitle="Algorithm-powered traffic predictions and revenue impact analysis"
      />

      <div className="p-6 space-y-6">

        {/* Confidence banner */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-indigo-900">
              Presencely has boosted your online visibility by <span className="text-indigo-600">{visibilityGap}%</span> above the industry baseline
            </p>
            <p className="text-xs text-indigo-600">
              Prediction confidence: {confidence}% · Based on Google, BrightLocal & Moz research benchmarks
            </p>
          </div>
          <div className="flex-shrink-0 text-right">
            <div className="text-xs text-indigo-500 mb-1">Model confidence</div>
            <Progress value={confidence} className="w-24 h-1.5" />
          </div>
        </div>

        {/* Hero metric cards */}
        <div className="grid grid-cols-3 gap-4">
          <MetricCard
            label="Additional Monthly Visits"
            value={roi.currentMonthlyVisits}
            icon={Users}
            iconColor="text-emerald-600"
            description="Already generated by using Presencely"
            change={undefined}
          />
          <MetricCard
            label="Est. Monthly Revenue Impact"
            value={`CHF ${roi.currentRevenue.toLocaleString()}`}
            icon={DollarSign}
            iconColor="text-emerald-600"
            description={`Based on CHF ${businessSettings.avgSpendPerVisit} avg spend per visit`}
            change={undefined}
          />
          <MetricCard
            label="Untapped Potential"
            value={`+${Math.round(trafficLift.remainingLift * businessSettings.directionToVisitRate)} visits/mo`}
            icon={TrendingUp}
            iconColor="text-indigo-600"
            description={`${pendingFactors.length} actions remaining to unlock full potential`}
            change={undefined}
          />
        </div>

        {/* Comparison chart */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Presencely vs Without — Search Visibility</CardTitle>
                <p className="text-xs text-gray-500 mt-0.5">
                  Historical data (Sep–Mar) + AI-projected forecast (Apr–Jun 2026)
                </p>
              </div>
              <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 text-xs">
                Projected → Apr–Jun
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={projectionData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="gradPresencely" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradBaseline" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#94a3b8" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                {/* Vertical separator between historical and projected */}
                <ReferenceLine
                  x="Mar"
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                  label={{ value: "Now", position: "top", fontSize: 10, fill: "#94a3b8" }}
                />
                <Tooltip content={<ProjectionTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) =>
                    value === "withPresencely" ? "With Presencely" : "Without Presencely"
                  }
                />
                <Area
                  type="monotone"
                  dataKey="withPresencely"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fill="url(#gradPresencely)"
                  name="withPresencely"
                  strokeDasharray="5 0"
                />
                <Area
                  type="monotone"
                  dataKey="withoutPresencely"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  fill="url(#gradBaseline)"
                  name="withoutPresencely"
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-3 flex items-start gap-2 bg-gray-50 rounded-lg px-3 py-2.5">
              <Info className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-500 leading-relaxed">
                <strong>How this is calculated:</strong> The "Without Presencely" baseline assumes industry-average 3% month-over-month growth from your September starting point. Your actual trajectory shows a {visibilityGap}% higher visibility thanks to Presencely's optimizations. Projected months extend both curves forward using linear trend analysis.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Busiest days */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Predicted Foot Traffic by Day</CardTitle>
                <p className="text-xs text-gray-500 mt-0.5">
                  Score = (Google Searches × 40%) + (Maps Clicks × 60%) — Maps weighted higher for in-person intent
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                {(["Peak", "High", "Medium", "Low"] as ImpactTier[]).map((t) => (
                  <span key={t} className={`px-2 py-0.5 rounded-full font-medium ${TIER_BADGE_STYLE[t]}`}>{t}</span>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {busyDays.map((day) => (
              <div key={day.day}>
                <div className="flex items-center gap-3 mb-1">
                  <span className="w-8 text-sm font-semibold text-gray-700">{day.day}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                    <div
                      className={`${TIER_BAR_COLOR[day.tier]} h-full rounded-full transition-all flex items-center justify-end pr-2`}
                      style={{ width: `${Math.max(day.score, 8)}%` }}
                    >
                      {day.score >= 30 && (
                        <span className="text-white text-[10px] font-bold">{day.score}</span>
                      )}
                    </div>
                  </div>
                  <Badge className={`text-xs w-16 justify-center ${TIER_BADGE_STYLE[day.tier]} hover:${TIER_BADGE_STYLE[day.tier]}`}>
                    {day.tier}
                  </Badge>
                  <span className="text-xs text-gray-400 w-28 text-right">{day.staffingNote}</span>
                </div>
                <p className="text-xs text-gray-500 pl-11">{day.recommendation}</p>
              </div>
            ))}

            <div className="mt-2 pt-3 border-t border-gray-100 flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-400">
                Predictions based on your 7-day Google Search and Maps click patterns. Maps clicks are weighted 60% as they indicate stronger physical visit intent than general searches.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Impact breakdown */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Traffic Impact Breakdown</h2>
              <p className="text-xs text-gray-500">What each action contributes to your foot traffic — and what you still have to gain</p>
            </div>
            <div className="text-xs text-gray-400">
              <span className="text-emerald-600 font-semibold">{resolvedFactors.length} resolved</span>
              {" · "}
              <span className="text-amber-600 font-semibold">{pendingFactors.length} pending</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {factors.map((factor) => (
              <Card key={factor.id} className={`border shadow-sm transition-all ${
                factor.status === "resolved"
                  ? "border-emerald-100 bg-emerald-50/30"
                  : "border-amber-100 bg-amber-50/20 hover:shadow-md"
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      {factor.status === "resolved" ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      )}
                      <span className="text-sm font-semibold text-gray-900 leading-tight">
                        {factor.label}
                      </span>
                    </div>
                    <span className={`text-sm font-bold flex-shrink-0 ${
                      factor.status === "resolved" ? "text-emerald-600" : "text-amber-600"
                    }`}>
                      +{Math.round(factor.lift * 100)}%
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed mb-3">
                    {factor.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Affects: <strong className="text-gray-700">{factor.affectsMetric}</strong></span>
                      <span>+{factor.estimatedLiftValue} directions/mo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={factor.confidence} className="flex-1 h-1.5" />
                      <span className="text-xs text-gray-400 w-12 text-right">{factor.confidence}% conf.</span>
                    </div>
                  </div>

                  {factor.status === "pending" && (
                    <a
                      href={factor.href}
                      className="mt-3 flex items-center gap-1 text-xs text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
                    >
                      Fix this <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {factor.status === "resolved" && (
                    <p className="mt-3 text-xs text-emerald-600 font-medium">
                      ✓ Already contributing to your traffic
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ROI summary banner */}
        <Card className="border-0 shadow-sm bg-gradient-to-r from-indigo-600 to-purple-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="text-indigo-200 text-sm mb-1">Already generating</p>
                <p className="text-white text-3xl font-bold mb-1">
                  +CHF {roi.currentRevenue.toLocaleString()}<span className="text-lg font-normal text-indigo-200">/month</span>
                </p>
                <p className="text-indigo-200 text-sm">
                  ~{roi.currentMonthlyVisits} additional visits from Presencely vs not using it
                </p>
              </div>

              <div className="hidden md:block w-px h-16 bg-indigo-400" />

              <div>
                <p className="text-indigo-200 text-sm mb-1">Unlock an extra</p>
                <p className="text-white text-3xl font-bold mb-1">
                  +CHF {(roi.fullPotentialRevenue - roi.currentRevenue).toLocaleString()}<span className="text-lg font-normal text-indigo-200">/month</span>
                </p>
                <p className="text-indigo-200 text-sm">
                  by completing {roi.pendingActionCount} remaining actions
                </p>
              </div>

              <a
                href="/dashboard/seo"
                className="flex-shrink-0 px-5 py-2.5 bg-white text-indigo-700 font-semibold text-sm rounded-xl hover:bg-indigo-50 transition-colors"
              >
                Fix issues →
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Methodology footnote */}
        <div className="flex items-start gap-2 text-xs text-gray-400 pb-2">
          <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
          <p>
            <strong>Methodology:</strong> Lift benchmarks sourced from Google/Ipsos GBP Engagement Study, BrightLocal Local Consumer Review Survey, Moz Local Search Ranking Factors, and Google Mobile Speed research. "Without Presencely" baseline uses industry-average 3% month-over-month organic growth. Direction-request-to-visit conversion rate of 65% sourced from Uberall restaurant location data. Individual results vary by market, competition, and category. All figures are estimates.
          </p>
        </div>

      </div>
    </div>
  )
}

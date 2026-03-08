"use client"

import Header from "@/components/layout/Header"
import MetricCard from "@/components/dashboard/MetricCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts"
import { MapPin, Search, Navigation, Phone, TrendingUp, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { monthlyVisibilityData, competitorData, businessInfo, demandCaptureData, visibilityEfficiencyData } from "@/lib/mock-data"

const howFoundData = [
  { label: "Direct Search\n(your name)", value: 1840, color: "bg-indigo-500" },
  { label: "Discovery\n(category search)", value: 4920, color: "bg-purple-500" },
  { label: "Branded", value: 1660, color: "bg-cyan-500" },
]

export default function VisibilityPage() {
  return (
    <div>
      <Header
        title="Visibility"
        subtitle="How customers find you on Google Search & Maps"
      />

      <div className="p-6 space-y-6">
        {/* Metric cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <MetricCard label="Search Impressions" value={8420} change={12.4} icon={Search} iconColor="text-indigo-600" />
          <MetricCard label="Google Maps Views" value={3210} change={8.7} icon={MapPin} iconColor="text-purple-600" />
          <MetricCard label="Direction Requests" value={620} change={22.1} icon={Navigation} iconColor="text-emerald-600" />
          <MetricCard label="Phone Call Clicks" value={190} change={5.8} icon={Phone} iconColor="text-orange-600" />
        </div>

        {/* How were you found */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">How Customers Found You</CardTitle>
            <p className="text-xs text-gray-500">Google Search impression breakdown — March 2026</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {howFoundData.map((item) => {
                const total = howFoundData.reduce((a, b) => a + b.value, 0)
                const pct = Math.round((item.value / total) * 100)
                return (
                  <div key={item.label} className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-3xl font-bold text-gray-900 mb-1">{item.value.toLocaleString()}</div>
                    <div className="text-sm text-gray-500 mb-3 whitespace-pre-line">{item.label}</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${item.color} h-2 rounded-full`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{pct}% of total</div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Monthly trend chart */}
        <div className="grid grid-cols-2 gap-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Impressions & Map Views — 7 Month Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={monthlyVisibilityData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                  <Legend iconType="circle" iconSize={8} />
                  <Line type="monotone" dataKey="impressions" stroke="#6366f1" strokeWidth={2.5} dot={false} name="Search Impressions" />
                  <Line type="monotone" dataKey="mapViews" stroke="#a78bfa" strokeWidth={2.5} dot={false} name="Maps Views" />
                  <Line type="monotone" dataKey="directions" stroke="#10b981" strokeWidth={2.5} dot={false} name="Directions" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Competitor comparison */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Local Competitor Snapshot</CardTitle>
              <p className="text-xs text-gray-500">Estimated monthly search impressions</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart
                  data={competitorData}
                  layout="vertical"
                  margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                    width={110}
                  />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "none" }} />
                  <Bar dataKey="visibility" radius={[0, 4, 4, 0]} name="Impressions">
                    {competitorData.map((entry, index) => (
                      <rect
                        key={index}
                        fill={entry.name === businessInfo.name ? "#6366f1" : "#e2e8f0"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-3 space-y-2">
                {competitorData.map((c) => (
                  <div key={c.name} className="flex items-center justify-between text-xs">
                    <span className={`font-medium ${c.name === businessInfo.name ? "text-indigo-700" : "text-gray-600"}`}>
                      {c.name === businessInfo.name ? "★ " : ""}{c.name}
                    </span>
                    <span className="text-gray-500">{c.visibility.toLocaleString()} impressions</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Demand Capture Rate ──────────────────────────────────────── */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Demand Capture Rate</CardTitle>
                <p className="text-xs text-gray-500 mt-0.5">
                  Of all coffee &amp; restaurant searches within 1 km, how many actually visit you?
                </p>
              </div>
              <Badge className="bg-amber-100 text-amber-700 border-0 hover:bg-amber-100">
                Opportunity
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* 3 headline numbers */}
            <div className="grid grid-cols-3 gap-4 mb-5">
              <div className="text-center p-4 bg-slate-50 rounded-xl">
                <p className="text-3xl font-black text-slate-900">{demandCaptureData.monthlyAreaSearches.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">Searches in 1 km this month</p>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-xl">
                <p className="text-3xl font-black text-slate-900">{demandCaptureData.visitsCaptured}</p>
                <p className="text-xs text-slate-500 mt-1">Visits you captured</p>
              </div>
              <div className="text-center p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <p className="text-3xl font-black text-indigo-700">{demandCaptureData.captureRate}%</p>
                <p className="text-xs text-indigo-600 mt-1 font-medium">Your capture rate</p>
              </div>
            </div>

            {/* Comparison bars */}
            <div className="space-y-3 mb-5">
              {[
                { label: "Top competitor",               rate: demandCaptureData.topCompetitorRate, barColor: "bg-slate-700",   isYou: false },
                { label: "Category average",             rate: demandCaptureData.categoryAvgRate,   barColor: "bg-slate-400",   isYou: false },
                { label: `${businessInfo.name} (you)`,   rate: demandCaptureData.captureRate,        barColor: "bg-indigo-500",  isYou: true  },
              ].map((row) => (
                <div key={row.label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className={cn("font-medium", row.isYou ? "text-indigo-700" : "text-slate-600")}>
                      {row.isYou ? "★ " : ""}{row.label}
                    </span>
                    <span className="font-bold text-slate-800">{row.rate}%</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all", row.barColor)}
                      style={{ width: `${(row.rate / 16) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Revenue opportunity callout */}
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl p-4">
              <TrendingUp className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-900">
                  Match the top competitor → +{(demandCaptureData.potentialVisits - demandCaptureData.visitsCaptured).toLocaleString()} visits/month
                </p>
                <p className="text-xs text-amber-700 mt-0.5">
                  At your average spend, that&apos;s an extra{" "}
                  <strong className="text-amber-900">${demandCaptureData.extraRevenue.toLocaleString()}/month</strong> in revenue
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Visibility-to-Revenue Efficiency ─────────────────────────── */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Visibility → Revenue Efficiency</CardTitle>
            <p className="text-xs text-gray-500">How effectively your Google profile converts views into paying customers</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">

              {/* Revenue per view */}
              <div>
                <div className="flex items-end gap-2 mb-1">
                  <p className="text-4xl font-black text-slate-900">
                    ${visibilityEfficiencyData.revenuePerView.toFixed(2)}
                  </p>
                  <p className="text-slate-500 text-sm pb-1">revenue per profile view</p>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-slate-400">city avg ${visibilityEfficiencyData.cityAvgRevenuePerView}</span>
                  <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs hover:bg-emerald-100">
                    {visibilityEfficiencyData.efficiencyPctAboveAvg}% better
                  </Badge>
                </div>
                <div className="space-y-2.5">
                  {[
                    { label: `${businessInfo.name} (you)`, val: visibilityEfficiencyData.revenuePerView, isYou: true },
                    { label: "Austin average",              val: visibilityEfficiencyData.cityAvgRevenuePerView, isYou: false },
                  ].map((row) => (
                    <div key={row.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className={cn("font-medium", row.isYou ? "text-indigo-700" : "text-slate-500")}>
                          {row.isYou ? "★ " : ""}{row.label}
                        </span>
                        <span className="font-bold text-slate-800">${row.val}</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={cn("h-full rounded-full", row.isYou ? "bg-indigo-500" : "bg-slate-300")}
                          style={{ width: `${(row.val / 6.5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Online → Visit conversion */}
              <div>
                <div className="flex items-end gap-2 mb-1">
                  <p className="text-4xl font-black text-slate-900">
                    {visibilityEfficiencyData.onlineToVisitConvRate}%
                  </p>
                  <p className="text-slate-500 text-sm pb-1">online → visit rate</p>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-slate-400">industry avg {visibilityEfficiencyData.industryAvgConvRate}%</span>
                  <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs hover:bg-emerald-100">
                    +{(visibilityEfficiencyData.onlineToVisitConvRate - visibilityEfficiencyData.industryAvgConvRate).toFixed(1)}%
                  </Badge>
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="text-sm font-semibold text-emerald-800 leading-snug">
                    Your listing converts discovery into customers{" "}
                    {visibilityEfficiencyData.efficiencyPctAboveAvg}% better than average.
                  </p>
                  <p className="text-xs text-emerald-600 mt-1.5 leading-relaxed">
                    Main drivers: high review rating ({businessInfo.googleRating}⭐), recent photos,
                    and active review responses. Keep this up.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action tips */}
        <Card className="border-0 shadow-sm bg-indigo-50 border-indigo-100">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-indigo-900 mb-2">How to improve your visibility</p>
                <ul className="space-y-1.5 text-xs text-indigo-800">
                  <li>• <strong>Post on Google Business Profile weekly</strong> — businesses that post regularly see 3x more views</li>
                  <li>• <strong>Add more photos</strong> — profiles with 100+ photos get 520% more calls</li>
                  <li>• <strong>Complete your menu on GBP</strong> — drives discovery searches</li>
                  <li>• <strong>Respond to all reviews</strong> — signals active management to Google</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

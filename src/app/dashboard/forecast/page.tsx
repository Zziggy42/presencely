"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine,
} from "recharts"
import {
  CloudRain, Calendar, TrendingUp, Zap,
  ArrowRight, CreditCard, MapPin,
} from "lucide-react"
import {
  demandForecast,
  weatherForecast,
  localEvents,
  posCorrelationData,
} from "@/lib/mock-data"

export default function ForecastPage() {
  const totalVisits  = demandForecast.reduce((s, d) => s + d.predicted, 0)
  const totalRevenue = demandForecast.reduce((s, d) => s + d.revenue, 0)
  const avgWeatherEffect = Math.round(
    weatherForecast.reduce((s, w) => s + w.demandEffect, 0) / weatherForecast.length
  )
  const peakEvent = [...localEvents].sort((a, b) => b.expectedImpact - a.expectedImpact)[0]
  const top3Days  = [...demandForecast].sort((a, b) => b.predicted - a.predicted).slice(0, 3)

  const chartData = demandForecast.map((d) => ({
    day:      d.day,
    Baseline: d.base,
    Weather:  Math.max(0, d.weatherBoost),
    Events:   Math.max(0, d.eventBoost),
  }))

  return (
    <div className="p-6 space-y-8 max-w-5xl">

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Demand Forecast</h1>
        <p className="text-slate-500 mt-1">
          Predict your foot traffic before it happens — combining search signals, local events &amp; weather
        </p>
      </div>

      {/* ── 3 Signal Summary Cards ── */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-0 bg-blue-50">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <CloudRain className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Weather Signal</p>
                <p className="text-2xl font-bold text-slate-900">+{avgWeatherEffect}%<span className="text-sm font-normal text-slate-500 ml-1">avg</span></p>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              2 rainy days this week — indoor demand spike expected Mon &amp; Tue
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-amber-50">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-amber-600 font-medium uppercase tracking-wide">Events Radar</p>
                <p className="text-2xl font-bold text-slate-900">{localEvents.length}<span className="text-sm font-normal text-slate-500 ml-1">nearby</span></p>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Peak: {peakEvent.emoji} {peakEvent.name.split(" ").slice(0, 3).join(" ")} (+{peakEvent.expectedImpact}%)
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-indigo-50">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-indigo-600 font-medium uppercase tracking-wide">Search Trend</p>
                <p className="text-2xl font-bold text-slate-900">+12%<span className="text-sm font-normal text-slate-500 ml-1">vs last week</span></p>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Rising intent — your Google visibility is compounding
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Main Forecast Chart ── */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>This Week&apos;s Predicted Traffic</CardTitle>
              <CardDescription>Stacked by signal: baseline + weather boost + event lift</CardDescription>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-900">{totalVisits.toLocaleString()}</p>
              <p className="text-sm text-slate-500">predicted visits</p>
              <p className="text-base font-semibold text-emerald-600 mt-0.5">
                CHF {totalRevenue.toLocaleString()} est. revenue
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
              <Tooltip
                formatter={(value, name) => {
                  const labels: Record<string, string> = {
                    Baseline: "Baseline visits",
                    Weather:  "Weather boost",
                    Events:   "Event lift",
                  }
                  return [`${value} visits`, labels[name as string] ?? (name as string)]
                }}
              />
              <Legend />
              <Bar dataKey="Baseline" stackId="a" fill="#cbd5e1" radius={[0, 0, 3, 3]} name="Baseline" />
              <Bar dataKey="Weather"  stackId="a" fill="#60a5fa" radius={[0, 0, 0, 0]} name="Weather"  />
              <Bar dataKey="Events"   stackId="a" fill="#f59e0b" radius={[3, 3, 0, 0]} name="Events"   />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ── Day-by-Day + Events Radar ── */}
      <div className="grid grid-cols-5 gap-6">

        {/* Day list — 3 cols */}
        <div className="col-span-3">
          <h3 className="font-semibold text-slate-800 mb-3">Day-by-Day Breakdown</h3>
          <div className="space-y-2">
            {demandForecast.map((d) => (
              <div
                key={d.day}
                className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 hover:border-indigo-100 transition-colors"
              >
                <div className="w-12 shrink-0 text-center">
                  <p className="text-xs text-slate-400 uppercase tracking-wide">{d.day}</p>
                  <p className="text-sm font-semibold text-slate-700">{d.date.split(" ")[1]}</p>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{d.driverEmoji}</span>
                    <span className="text-xs text-slate-500 truncate">{d.topDriver}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-400 rounded-full"
                      style={{ width: `${Math.min((d.predicted / 220) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-base font-bold text-slate-900">{d.predicted}</p>
                  <p className="text-xs text-slate-400">visitors</p>
                </div>

                <div className="text-right shrink-0 w-[72px]">
                  <p className="text-sm font-semibold text-emerald-600">CHF {d.revenue.toLocaleString()}</p>
                  <p className="text-xs text-slate-400">{d.confidence}% conf.</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Events radar — 2 cols */}
        <Card className="col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Events Radar</CardTitle>
            <CardDescription>Nearby events that drive foot traffic</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {localEvents.map((e) => (
              <div key={e.name} className="flex items-start gap-3">
                <span className="text-2xl leading-none mt-0.5">{e.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-slate-800">{e.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {e.date} · {e.distance} km away · {e.attendees.toLocaleString()} attending
                  </p>
                  <p className="text-xs text-indigo-600 font-medium mt-1">→ {e.tip}</p>
                </div>
                <Badge className="bg-amber-100 text-amber-800 text-xs shrink-0 hover:bg-amber-100">
                  +{e.expectedImpact}%
                </Badge>
              </div>
            ))}
            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Events within 3 km of your location
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── POS Search → Transaction Lag ── */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-slate-400" />
                Search → Visit Lag
              </CardTitle>
              <CardDescription>
                Google searches predict your POS transactions 14–18 minutes in advance
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg">
              <Zap className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-semibold text-indigo-700">Avg lag: 16 min</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={posCorrelationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} domain={[0, 115]} />
              <Tooltip
                formatter={(value, name) => [
                  `${value} (indexed)`,
                  name === "searches" ? "Search intent" : "POS transactions",
                ]}
              />
              <ReferenceLine
                x="12pm"
                stroke="#6366f1"
                strokeDasharray="5 3"
                label={{ value: "Search peak", fill: "#6366f1", fontSize: 10, position: "insideTopRight" }}
              />
              <ReferenceLine
                x="1pm"
                stroke="#10b981"
                strokeDasharray="5 3"
                label={{ value: "Tx peak  (+16 min)", fill: "#10b981", fontSize: 10, position: "insideTopLeft" }}
              />
              <Line
                type="monotone"
                dataKey="searches"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={false}
                name="searches"
              />
              <Line
                type="monotone"
                dataKey="transactions"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={false}
                name="transactions"
              />
              <Legend
                formatter={(value) =>
                  value === "searches" ? "Search intent (Google)" : "POS transactions"
                }
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-center text-slate-400 mt-3">
            Connect Square, Toast or Lightspeed POS to enable real-time correlation —{" "}
            <span className="text-indigo-500 font-medium cursor-pointer hover:underline">
              Connect POS →
            </span>
          </p>
        </CardContent>
      </Card>

      {/* ── 7-Day Weather Impact Strip ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Weather Demand Impact</CardTitle>
          <CardDescription>
            How this week&apos;s forecast conditions shift your expected foot traffic
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weatherForecast.map((w) => (
              <div
                key={w.day}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-center border ${
                  w.demandEffect >= 15
                    ? "bg-blue-100 border-blue-200"
                    : w.demandEffect >= 8
                    ? "bg-blue-50 border-blue-100"
                    : "bg-slate-50 border-slate-100"
                }`}
              >
                <p className="text-xs font-medium text-slate-500">{w.day}</p>
                <span className="text-2xl">{w.emoji}</span>
                <p className="text-xs text-slate-500">{w.high}°C</p>
                <span
                  className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                    w.demandEffect >= 15
                      ? "bg-blue-600 text-white"
                      : w.demandEffect >= 8
                      ? "bg-blue-400 text-white"
                      : w.demandEffect >= 4
                      ? "bg-slate-300 text-slate-700"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  +{w.demandEffect}%
                </span>
                <p className="text-[10px] text-slate-400 leading-tight">{w.note}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Prepare for Your Top 3 Days ── */}
      <Card>
        <CardHeader>
          <CardTitle>Prepare for Your Top 3 Days</CardTitle>
          <CardDescription>
            Highest predicted traffic this week — act now to maximise revenue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {top3Days.map((d, i) => (
              <div
                key={d.day}
                className={`rounded-xl p-4 border ${
                  i === 0
                    ? "bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge
                    className={
                      i === 0
                        ? "bg-indigo-600 text-white text-xs hover:bg-indigo-600"
                        : "bg-slate-500 text-white text-xs hover:bg-slate-500"
                    }
                  >
                    #{i + 1} Peak Day
                  </Badge>
                  <span className="text-xl">{d.driverEmoji}</span>
                </div>

                <p className="font-bold text-slate-900 text-sm">{d.day}, {d.date}</p>
                <p className="text-3xl font-black text-slate-900 mt-1">
                  {d.predicted}
                  <span className="text-sm font-normal text-slate-400 ml-1">visitors</span>
                </p>
                <p className="text-sm font-semibold text-emerald-600 mt-0.5">
                  CHF {d.revenue.toLocaleString()} expected
                </p>
                <p className="text-xs text-slate-500 mt-1.5">{d.topDriver}</p>

                <div className="mt-3 pt-3 border-t border-slate-200 flex items-start gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-slate-700 font-medium">{d.action}</p>
                </div>

                {/* Confidence bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[10px] text-slate-400">Forecast confidence</p>
                    <p className="text-[10px] font-semibold text-slate-600">{d.confidence}%</p>
                  </div>
                  <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${i === 0 ? "bg-indigo-500" : "bg-slate-400"}`}
                      style={{ width: `${d.confidence}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── How the Model Works ── */}
      <Card className="bg-slate-900 border-slate-700 text-white">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">How Presencely predicts demand</h3>
              <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                Predicted traffic = (search intent × visibility score) + (direction requests × conversion rate) + event attendance multiplier + weather demand effect + POS transaction correlation
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { label: "Search + Maps",  desc: "Google intent signals",         color: "bg-indigo-500" },
                  { label: "Events Radar",   desc: "Nearby concerts, sport, markets", color: "bg-amber-500" },
                  { label: "POS + Weather",  desc: "Transaction & climate signals",  color: "bg-emerald-500" },
                ].map((s) => (
                  <div key={s.label} className="bg-slate-800 rounded-lg p-3">
                    <div className={`w-2 h-2 rounded-full ${s.color} mb-2`} />
                    <p className="text-xs font-semibold text-white">{s.label}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts"
import {
  Users, AlertTriangle, TrendingUp, Clock,
  ChevronRight, Zap, CheckCircle2, ArrowRight,
  CalendarCheck, Banknote,
} from "lucide-react"
import {
  staffingForecast,
  staffingInsights,
  staffingSettings,
  todayHourlyStaffing,
} from "@/lib/mock-data"
import { computeStaffingROI } from "@/lib/insights-engine"
import Link from "next/link"

// ─── Helpers ────────────────────────────────────────────────────────────────

function staffColor(n: number) {
  if (n >= 4) return "bg-red-100 text-red-700 border border-red-200"
  if (n === 3) return "bg-amber-100 text-amber-700 border border-amber-200"
  if (n === 2) return "bg-indigo-100 text-indigo-700 border border-indigo-200"
  return "bg-slate-100 text-slate-600 border border-slate-200"
}

function staffBarColor(n: number) {
  if (n >= 4) return "#ef4444"
  if (n === 3) return "#f59e0b"
  if (n === 2) return "#6366f1"
  return "#94a3b8"
}

function driverTypeColor(type: string) {
  if (type === "event")   return "bg-purple-50 text-purple-700 border border-purple-100"
  if (type === "weather") return "bg-blue-50 text-blue-700 border border-blue-100"
  return "bg-slate-50 text-slate-600 border border-slate-100"
}

const roi = computeStaffingROI(
  staffingInsights.weekRevenue,
  staffingInsights.weekTotalLaborCost,
  staffingSettings.avgHourlyWage,
  staffingSettings.closeHour - staffingSettings.openHour
)

// Hourly chart data
const hourlyChartData = todayHourlyStaffing.map((h) => ({
  hour:   h.hour,
  visitors: h.visitors,
  staff:    h.staffNeeded,
  isPast:   h.isPast,
  isCurrent: h.isCurrent,
}))

// Day currently selected in the weekly table for shift detail
const TODAY_INDEX = 0 // Sunday = index 0

// ─── Page ────────────────────────────────────────────────────────────────────

export default function StaffingPage() {
  const [selectedDay, setSelectedDay] = useState(TODAY_INDEX)
  const selected = staffingForecast[selectedDay]

  return (
    <div className="p-6 space-y-8 max-w-5xl">

      {/* ── Header ── */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold text-slate-900">Smart Staffing Forecast</h1>
          <Badge className="bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-100 text-xs font-semibold">
            Pro
          </Badge>
        </div>
        <p className="text-slate-500">
          Know exactly how many staff you need — before each shift. Save on labour, never lose a customer to slow service.
        </p>
      </div>

      {/* ── Alert Banner (high-demand upcoming day) ── */}
      <div className="rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-4 flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-amber-900 text-sm">
            ⚡ Saturday {staffingInsights.peakDayDate} needs {staffingInsights.peakDayStaff} staff
            — {staffingInsights.peakDayDriver} (+32% demand expected)
          </p>
          <p className="text-amber-700 text-xs mt-0.5">
            If you&apos;re understaffed, you risk losing CHF {staffingInsights.understaffingRisk.revenueAtRisk} in revenue.
            Book your team now.
          </p>
        </div>
        <button
          onClick={() => setSelectedDay(6)}
          className="text-xs font-medium text-amber-700 hover:text-amber-900 flex items-center gap-1 shrink-0 mt-1"
        >
          View Saturday <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* ── 3 Summary Cards ── */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-0 bg-gradient-to-br from-red-50 to-orange-50">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-red-600 font-medium uppercase tracking-wide">Peak Staff</p>
                <p className="text-2xl font-bold text-slate-900">
                  {staffingInsights.peakDayStaff}
                  <span className="text-sm font-normal text-slate-500 ml-1">people (Sat)</span>
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              Highest demand day of the week — Geneva Half Marathon
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-indigo-50 to-purple-50">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                <Banknote className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-indigo-600 font-medium uppercase tracking-wide">Est. Week Labour</p>
                <p className="text-2xl font-bold text-slate-900">
                  CHF {staffingInsights.weekTotalLaborCost.toLocaleString()}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              {roi.laborPct}% of week revenue · {staffingInsights.weekTotalStaffHours} total staff-hours
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-emerald-600 font-medium uppercase tracking-wide">Revenue This Week</p>
                <p className="text-2xl font-bold text-slate-900">
                  CHF {staffingInsights.weekRevenue.toLocaleString()}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              Correct staffing protects CHF {staffingInsights.correctStaffingUplift.toLocaleString()} in profit
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Weekly Staffing Table ── */}
      <Card className="border border-slate-100 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">This Week&apos;s Staffing Plan</CardTitle>
          <CardDescription>Click any day to see the shift-by-shift breakdown</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left text-xs font-medium text-slate-500 px-4 py-3">Day</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-4 py-3">Demand Signal</th>
                  <th className="text-right text-xs font-medium text-slate-500 px-4 py-3">Est. Visits</th>
                  <th className="text-center text-xs font-medium text-slate-500 px-4 py-3">Shifts</th>
                  <th className="text-center text-xs font-medium text-slate-500 px-4 py-3">Peak Staff</th>
                  <th className="text-right text-xs font-medium text-slate-500 px-4 py-3">Labour</th>
                  <th className="text-right text-xs font-medium text-slate-500 px-4 py-3">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {staffingForecast.map((d, i) => {
                  const isSelected = i === selectedDay
                  const isToday = i === 0
                  return (
                    <tr
                      key={d.day}
                      onClick={() => setSelectedDay(i)}
                      className={`border-b border-slate-50 cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-indigo-50 border-indigo-100"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div>
                            <span className="font-semibold text-slate-900">{d.day}</span>
                            <span className="text-slate-400 text-xs ml-1">{d.date}</span>
                          </div>
                          {isToday && (
                            <Badge className="text-[10px] h-4 bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-100">
                              Today
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full font-medium ${driverTypeColor(d.driverType)}`}>
                          {d.driverEmoji} {d.driver}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-900">
                        {d.expectedVisits}
                        <span className="text-xs text-slate-400 font-normal ml-1">{d.confidence}%</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-0.5">
                          {d.shifts.map((s, si) => (
                            <span
                              key={si}
                              className={`inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold ${staffColor(s.staff)}`}
                            >
                              {s.staff}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center justify-center text-sm font-bold px-2.5 py-0.5 rounded-lg ${staffColor(d.peakStaff)}`}>
                          {d.peakStaff}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600 text-xs font-medium">
                        CHF {d.laborCost.toLocaleString()}
                        <div className="text-[10px] text-slate-400">{d.laborPct}%</div>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-900 text-xs">
                        CHF {d.revenue.toLocaleString()}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── Selected Day Detail ── */}
      <div className="grid grid-cols-2 gap-6">

        {/* Shift Breakdown */}
        <Card className="border border-slate-100 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">
                  {selected.driverEmoji} {selected.day} {selected.date} — Shift Plan
                </CardTitle>
                <CardDescription className="mt-0.5">{selected.expectedVisits} expected visitors · {selected.confidence}% confidence</CardDescription>
              </div>
              {selected.alert && (
                <Badge className="bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-50 text-xs shrink-0 max-w-36 text-center whitespace-normal leading-tight">
                  ⚡ Action needed
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {selected.shifts.map((shift, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex items-center gap-2 w-24 shrink-0">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span className="text-xs font-medium text-slate-600">{shift.label}</span>
                </div>
                <div className="flex-1 relative h-6 bg-slate-100 rounded-md overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-md transition-all"
                    style={{
                      width: `${Math.min(100, (shift.visitors / 60) * 100)}%`,
                      backgroundColor: staffBarColor(shift.staff),
                      opacity: 0.25,
                    }}
                  />
                  <span className="absolute inset-y-0 left-2 flex items-center text-xs text-slate-600">
                    ~{shift.visitors} visitors
                  </span>
                </div>
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold ${staffColor(shift.staff)} shrink-0`}>
                  <Users className="w-3 h-3" />
                  {shift.staff}
                </div>
              </div>
            ))}
            {selected.alert && (
              <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
                <p className="text-xs text-amber-800 font-medium">{selected.alert}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Today's Hourly Heatmap */}
        <Card className="border border-slate-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Today&apos;s Hourly Demand</CardTitle>
            <CardDescription>Staff needed each hour — Sunday 8 Mar</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={hourlyChartData}
                margin={{ top: 4, right: 4, bottom: 4, left: -20 }}
                barSize={16}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }}
                  formatter={(val, name) => [val, name === "visitors" ? "Visitors" : "Staff needed"]}
                  cursor={{ fill: "#f8fafc" }}
                />
                <Bar dataKey="visitors" name="visitors" radius={[3, 3, 0, 0]}>
                  {hourlyChartData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.isCurrent ? "#6366f1" : entry.isPast ? "#cbd5e1" : "#a5b4fc"}
                      opacity={entry.isCurrent ? 1 : entry.isPast ? 0.6 : 0.85}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-2 text-[10px] text-slate-400">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-slate-300 inline-block" /> Past</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-indigo-500 inline-block" /> Now</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-indigo-300 inline-block" /> Forecast</span>
            </div>
            {/* Staff pills per hour */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {todayHourlyStaffing.filter(h => h.staffNeeded > 0).map((h) => (
                <div
                  key={h.hour}
                  className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-medium
                    ${h.isCurrent ? "ring-2 ring-indigo-400 ring-offset-1" : ""} ${staffColor(h.staffNeeded)}`}
                >
                  {h.hour} · {h.staffNeeded}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Revenue Impact of Correct Staffing ── */}
      <Card className="border-0 bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-yellow-300" />
                </div>
                <h3 className="font-semibold text-lg">Revenue Impact of Correct Staffing</h3>
              </div>
              <p className="text-slate-300 text-sm mb-5">
                The difference between guessing and knowing your staffing needs
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/8 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-xs font-medium text-red-300 uppercase tracking-wide">Understaffing Risk</span>
                  </div>
                  <p className="text-2xl font-bold text-white mb-1">
                    −CHF {staffingInsights.understaffingRisk.revenueAtRisk.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-400">
                    Lost revenue if Saturday is 1 staff short. ~15% of customers leave when service is slow.
                  </p>
                </div>
                <div className="bg-white/8 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-medium text-amber-300 uppercase tracking-wide">Overstaffing Waste</span>
                  </div>
                  <p className="text-2xl font-bold text-white mb-1">
                    −CHF {staffingInsights.overstaffingWasteIfIgnored.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-400">
                    Unnecessary labour cost this week if you keep 1 extra staff on during quiet shifts.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 rounded-2xl p-6 text-center border border-white/10 shrink-0 min-w-44">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-xs text-slate-400 mb-1">Correct staffing protects</p>
              <p className="text-3xl font-bold text-emerald-400">
                CHF {staffingInsights.correctStaffingUplift.toLocaleString()}
              </p>
              <p className="text-xs text-slate-400 mt-1">this week</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Week Staffing Tips ── */}
      <div>
        <h2 className="text-base font-semibold text-slate-900 mb-4">This Week&apos;s Staffing Tips</h2>
        <div className="grid grid-cols-3 gap-4">
          {staffingForecast
            .filter((d) => d.alert)
            .map((d, i) => (
              <Card
                key={i}
                className="border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedDay(staffingForecast.indexOf(d))}
              >
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{d.driverEmoji}</span>
                    <div>
                      <p className="text-xs font-semibold text-slate-700">{d.day} {d.date}</p>
                      <p className="text-[10px] text-slate-400">{d.expectedVisits} visitors · {d.peakStaff} staff</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{d.alert}</p>
                  <div className="flex items-center gap-1 mt-3 text-xs text-indigo-600 font-medium">
                    View shift plan <ArrowRight className="w-3 h-3" />
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {/* ── Labour efficiency ── */}
      <Card className="border border-slate-100 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Labour Efficiency Breakdown</CardTitle>
          <CardDescription>Daily revenue vs. labour cost ratio</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={staffingForecast.map((d) => ({ day: d.day, Revenue: d.revenue, Labour: d.laborCost }))}
              margin={{ top: 4, right: 4, bottom: 4, left: -8 }}
              barSize={20}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`} />
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }}
                formatter={(val) => [`CHF ${Number(val).toLocaleString()}`, ""]}
                cursor={{ fill: "#f8fafc" }}
              />
              <Bar dataKey="Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} opacity={0.85} />
              <Bar dataKey="Labour"  fill="#f59e0b" radius={[4, 4, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-indigo-500 inline-block" />Revenue</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-400 inline-block" />Labour cost</span>
            <span className="ml-auto font-medium text-slate-700">
              Avg labour ratio: {roi.laborPct}% · Target for cafés: &lt;35%
            </span>
          </div>
        </CardContent>
      </Card>

      {/* ── Upgrade prompt ── */}
      <Card className="border border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-sm">
        <CardContent className="py-5 px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
              <CalendarCheck className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">Unlock POS Integration</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Connect your till to get real transaction data, auto-calibrate the staffing model, and receive SMS alerts before demand spikes.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shrink-0"
          >
            Connect POS <ArrowRight className="w-3 h-3" />
          </Link>
        </CardContent>
      </Card>

    </div>
  )
}

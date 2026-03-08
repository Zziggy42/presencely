"use client"

import Header from "@/components/layout/Header"
import MetricCard from "@/components/dashboard/MetricCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Globe, Users, Clock, MousePointer } from "lucide-react"
import { trafficSourceData, monthlyVisibilityData } from "@/lib/mock-data"

const COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"]

const sessionData = monthlyVisibilityData.map((d) => ({
  month: d.month,
  sessions: Math.round(d.impressions * 0.18),
  pageviews: Math.round(d.impressions * 0.42),
  newUsers: Math.round(d.impressions * 0.11),
}))

const topPages = [
  { page: "/", title: "Homepage", sessions: 680, bounceRate: "42%" },
  { page: "/menu", title: "Our Menu", sessions: 340, bounceRate: "28%" },
  { page: "/reservations", title: "Book a Table", sessions: 220, bounceRate: "18%" },
  { page: "/about", title: "About Us", sessions: 140, bounceRate: "55%" },
  { page: "/contact", title: "Contact & Hours", sessions: 100, bounceRate: "31%" },
]

export default function TrafficPage() {
  return (
    <div>
      <Header
        title="Website Traffic"
        subtitle="Visitors, sessions and engagement on your website"
      />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <MetricCard label="Monthly Sessions" value={1480} change={-3.2} icon={Globe} iconColor="text-indigo-600" />
          <MetricCard label="Unique Visitors" value={1120} change={2.1} icon={Users} iconColor="text-purple-600" />
          <MetricCard label="Avg. Session Duration" value="2m 14s" icon={Clock} iconColor="text-cyan-600" />
          <MetricCard label="Avg. Pages / Session" value="3.2" change={8.4} icon={MousePointer} iconColor="text-emerald-600" />
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Sessions & Pageviews — 7 Month Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={sessionData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                    <defs>
                      <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorPageviews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                    <Area type="monotone" dataKey="sessions" stroke="#6366f1" strokeWidth={2} fill="url(#colorSessions)" name="Sessions" />
                    <Area type="monotone" dataKey="pageviews" stroke="#06b6d4" strokeWidth={2} fill="url(#colorPageviews)" name="Pageviews" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={trafficSourceData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                    {trafficSourceData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v}%`, ""]} contentStyle={{ borderRadius: 8, border: "none" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {trafficSourceData.map((item, i) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                      <span className="text-gray-600">{item.name}</span>
                    </div>
                    <span className="font-semibold text-gray-800">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Top Pages This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-gray-100">
                  <th className="text-left font-medium pb-2">Page</th>
                  <th className="text-right font-medium pb-2">Sessions</th>
                  <th className="text-right font-medium pb-2">Bounce Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {topPages.map((p) => (
                  <tr key={p.page} className="hover:bg-gray-50">
                    <td className="py-3">
                      <p className="font-medium text-gray-900">{p.title}</p>
                      <p className="text-xs text-gray-400">{p.page}</p>
                    </td>
                    <td className="py-3 text-right text-gray-700 font-medium">{p.sessions}</td>
                    <td className="py-3 text-right text-gray-500">{p.bounceRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

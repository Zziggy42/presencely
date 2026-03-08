"use client"

import Header from "@/components/layout/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts"
import {
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
  Search,
} from "lucide-react"
import { seoIssues, keywordRankings, seoScore } from "@/lib/mock-data"

const radarData = [
  { subject: "Technical", value: seoScore.technical },
  { subject: "Content", value: seoScore.content },
  { subject: "Local SEO", value: seoScore.localSeo },
  { subject: "Performance", value: seoScore.performance },
  { subject: "Overall", value: seoScore.overall },
]

function SeverityIcon({ severity }: { severity: string }) {
  if (severity === "critical") return <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
  if (severity === "warning") return <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
  return <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
}

function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, string> = {
    critical: "bg-red-100 text-red-700",
    warning: "bg-amber-100 text-amber-700",
    info: "bg-blue-100 text-blue-700",
  }
  return (
    <Badge className={`text-xs capitalize hover:${map[severity]} ${map[severity]}`}>
      {severity}
    </Badge>
  )
}

function ScoreGauge({ score, label }: { score: number; label: string }) {
  const color = score >= 70 ? "text-emerald-600" : score >= 50 ? "text-amber-600" : "text-red-600"
  const barColor = score >= 70 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-red-500"
  return (
    <div className="text-center">
      <div className={`text-3xl font-bold mb-1 ${color}`}>{score}</div>
      <Progress value={score} className="h-2 mb-1" />
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  )
}

export default function SeoPage() {
  const critical = seoIssues.filter((i) => i.severity === "critical")
  const warnings = seoIssues.filter((i) => i.severity === "warning")
  const info = seoIssues.filter((i) => i.severity === "info")

  return (
    <div>
      <Header
        title="SEO Health"
        subtitle="Your website's search engine performance and issues"
      />

      <div className="p-6 space-y-6">
        {/* Score overview */}
        <div className="grid grid-cols-5 gap-4">
          <Card className="col-span-2 border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">SEO Score Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <ScoreGauge score={seoScore.overall} label="Overall" />
              <ScoreGauge score={seoScore.technical} label="Technical" />
              <ScoreGauge score={seoScore.content} label="Content" />
              <ScoreGauge score={seoScore.localSeo} label="Local SEO" />
            </CardContent>
          </Card>

          <Card className="col-span-3 border-0 shadow-sm">
            <CardHeader className="pb-0">
              <CardTitle className="text-base font-semibold">SEO Radar</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: "#64748b" }} />
                  <Radar
                    name="Score"
                    dataKey="value"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Issues list */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Issues to Fix</CardTitle>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-red-600 font-medium">{critical.length} critical</span>
                <span className="text-gray-300">·</span>
                <span className="text-amber-600 font-medium">{warnings.length} warnings</span>
                <span className="text-gray-300">·</span>
                <span className="text-blue-600 font-medium">{info.length} info</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {seoIssues.map((issue) => (
              <div
                key={issue.id}
                className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all hover:shadow-sm ${
                  issue.severity === "critical"
                    ? "bg-red-50 border-red-200"
                    : issue.severity === "warning"
                    ? "bg-amber-50 border-amber-200"
                    : "bg-blue-50 border-blue-100"
                }`}
              >
                <SeverityIcon severity={issue.severity} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-gray-900">{issue.title}</span>
                    <SeverityBadge severity={issue.severity} />
                  </div>
                  <p className="text-xs text-gray-500">{issue.impact}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <code className="text-xs bg-white px-2 py-0.5 rounded border border-gray-200 text-gray-500">{issue.page}</code>
                  <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">
                    Fix <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Keyword rankings */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Keyword Rankings</CardTitle>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Search className="w-3.5 h-3.5" />
                Google Search — Austin, TX
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-400 border-b border-gray-100">
                    <th className="text-left font-medium pb-2">Keyword</th>
                    <th className="text-center font-medium pb-2">Position</th>
                    <th className="text-center font-medium pb-2">Change</th>
                    <th className="text-right font-medium pb-2">Monthly Volume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {keywordRankings.map((kw) => (
                    <tr key={kw.keyword} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 text-gray-800 font-medium">{kw.keyword}</td>
                      <td className="py-3 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-6 rounded text-xs font-bold ${
                            kw.position <= 3
                              ? "bg-emerald-100 text-emerald-700"
                              : kw.position <= 10
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          #{kw.position}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {kw.change > 0 ? (
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                          ) : kw.change < 0 ? (
                            <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                          ) : (
                            <Minus className="w-3.5 h-3.5 text-gray-400" />
                          )}
                          <span
                            className={`text-xs font-medium ${
                              kw.change > 0 ? "text-emerald-600" : kw.change < 0 ? "text-red-500" : "text-gray-400"
                            }`}
                          >
                            {kw.change > 0 ? "+" : ""}{kw.change}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-right text-gray-600">{kw.volume.toLocaleString()}/mo</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

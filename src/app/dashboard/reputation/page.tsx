"use client"

import { useState } from "react"
import Header from "@/components/layout/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Star, MessageSquare, TrendingUp, Zap } from "lucide-react"
import { recentReviews, ratingHistory, businessInfo } from "@/lib/mock-data"

const ratingBreakdown = [
  { stars: 5, count: 198 },
  { stars: 4, count: 72 },
  { stars: 3, count: 21 },
  { stars: 2, count: 11 },
  { stars: 1, count: 10 },
]

const totalReviews = ratingBreakdown.reduce((a, b) => a + b.count, 0)

function StarRow({ stars, count }: { stars: number; count: number }) {
  const pct = Math.round((count / totalReviews) * 100)
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-4 text-right text-gray-500">{stars}</span>
      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
      <Progress value={pct} className="flex-1 h-2" />
      <span className="w-8 text-right text-gray-500 text-xs">{count}</span>
    </div>
  )
}

export default function ReputationPage() {
  const [replyDraft, setReplyDraft] = useState<{ [id: number]: string }>({})
  const [aiLoading, setAiLoading] = useState<number | null>(null)
  const [replied, setReplied] = useState<number[]>([])

  const unreplied = recentReviews.filter((r) => !r.replied && !replied.includes(r.id))
  const negative = recentReviews.filter((r) => r.rating <= 2)

  function generateAiReply(review: typeof recentReviews[0]) {
    setAiLoading(review.id)
    setTimeout(() => {
      const positive = review.rating >= 4
      const draft = positive
        ? `Thank you so much, ${review.author.split(" ")[0]}! We're thrilled you had such a great experience at ${businessInfo.name}. We can't wait to welcome you back soon! 🙌`
        : `Hi ${review.author.split(" ")[0]}, thank you for your honest feedback. We sincerely apologise for falling short of your expectations. Please reach out to us directly so we can make this right — this isn't the experience we aim to deliver.`
      setReplyDraft((prev) => ({ ...prev, [review.id]: draft }))
      setAiLoading(null)
    }, 1200)
  }

  function markReplied(id: number) {
    setReplied((prev) => [...prev, id])
    setReplyDraft((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  return (
    <div>
      <Header
        title="Reviews & Reputation"
        subtitle="Manage your ratings across Google, Yelp and more"
      />

      <div className="p-6 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4">
          {/* Google rating */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-blue-600">G</span>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Google Rating</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-900">{businessInfo.googleRating}</span>
                  <span className="text-sm text-gray-400">/ 5</span>
                </div>
                <div className="flex mt-1">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className={`w-3 h-3 ${s <= Math.round(businessInfo.googleRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Yelp rating */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-red-500">Y</span>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Yelp Rating</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-900">{businessInfo.yelpRating}</span>
                  <span className="text-sm text-gray-400">/ 5</span>
                </div>
                <div className="flex mt-1">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className={`w-3 h-3 ${s <= Math.round(businessInfo.yelpRating) ? "text-red-400 fill-red-400" : "text-gray-200"}`} />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Needs attention */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <p className="text-xs text-gray-500 mb-1">Needs Attention</p>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-2xl font-bold text-amber-600">{unreplied.length}</span>
                <span className="text-sm text-gray-400">unanswered reviews</span>
              </div>
              {negative.length > 0 && (
                <Badge className="bg-red-100 text-red-700 hover:bg-red-100 text-xs">
                  {negative.length} negative
                </Badge>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Rating breakdown */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Rating Breakdown</CardTitle>
              <p className="text-xs text-gray-500">All platforms combined</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {ratingBreakdown.map((r) => (
                <StarRow key={r.stars} stars={r.stars} count={r.count} />
              ))}
              <div className="pt-2 border-t border-gray-100 text-xs text-gray-400">
                Based on {totalReviews} total reviews
              </div>
            </CardContent>
          </Card>

          {/* Rating trend */}
          <div className="col-span-2">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Rating Trend — 7 Months</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={ratingHistory} margin={{ top: 4, right: 4, bottom: 0, left: -30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[3.5, 5]} tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: "none" }} />
                    <Legend iconType="circle" iconSize={8} />
                    <Line type="monotone" dataKey="google" stroke="#4285F4" strokeWidth={2.5} dot={{ fill: "#4285F4", r: 3 }} name="Google" />
                    <Line type="monotone" dataKey="yelp" stroke="#ef4444" strokeWidth={2.5} dot={{ fill: "#ef4444", r: 3 }} name="Yelp" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Review inbox */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Review Inbox</CardTitle>
              <Badge variant="outline" className="text-xs">{recentReviews.length} this month</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentReviews.map((review) => {
              const isReplied = review.replied || replied.includes(review.id)
              return (
                <div
                  key={review.id}
                  className={`p-4 rounded-xl border ${
                    review.rating <= 2 ? "border-red-200 bg-red-50" : "border-gray-100 bg-gray-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-gray-900">{review.author}</span>
                      <Badge variant="outline" className="text-xs capitalize">{review.platform}</Badge>
                      <span className="text-xs text-gray-400">{review.date}</span>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-3">{review.text}</p>

                  {!isReplied && (
                    <div className="space-y-2">
                      {replyDraft[review.id] ? (
                        <>
                          <textarea
                            value={replyDraft[review.id]}
                            onChange={(e) =>
                              setReplyDraft((prev) => ({ ...prev, [review.id]: e.target.value }))
                            }
                            rows={3}
                            className="w-full text-sm border border-gray-200 rounded-lg p-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => markReplied(review.id)}
                              className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                              <MessageSquare className="w-3 h-3 inline mr-1" />
                              Submit Reply
                            </button>
                            <button
                              onClick={() => setReplyDraft((prev) => { const n = { ...prev }; delete n[review.id]; return n })}
                              className="px-3 py-1.5 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <button
                          onClick={() => generateAiReply(review)}
                          disabled={aiLoading === review.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Zap className="w-3 h-3 text-indigo-500" />
                          {aiLoading === review.id ? "Generating..." : "AI Draft Reply"}
                        </button>
                      )}
                    </div>
                  )}

                  {isReplied && (
                    <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      Replied
                    </div>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

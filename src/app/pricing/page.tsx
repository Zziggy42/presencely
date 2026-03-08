"use client"

import { useState } from "react"
import Link from "next/link"
import { CheckCircle, Zap, ArrowLeft } from "lucide-react"
import { PLANS } from "@/lib/stripe"

const planOrder = ["starter", "pro", "agency"] as const

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)

  async function handleCheckout(planKey: string) {
    setLoading(planKey)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planKey }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else if (data.error === "Unauthorized") {
        window.location.href = `/auth/signup?next=/pricing`
      }
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>

        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">Presencely</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Simple, honest pricing</h1>
          <p className="text-lg text-gray-500">
            Start with a 14-day free trial. No credit card required.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {planOrder.map((key) => {
            const plan = PLANS[key]
            const isPopular = key === "pro"

            return (
              <div
                key={key}
                className={`rounded-2xl p-7 border ${
                  isPopular
                    ? "bg-indigo-600 border-indigo-600"
                    : "bg-white border-gray-200"
                }`}
              >
                {isPopular && (
                  <div className="text-xs font-semibold bg-indigo-500 text-white px-3 py-1 rounded-full inline-block mb-4">
                    Most popular
                  </div>
                )}

                <h2 className={`text-xl font-bold mb-1 ${isPopular ? "text-white" : "text-gray-900"}`}>
                  {plan.name}
                </h2>

                <div className="flex items-baseline gap-1 mb-5">
                  <span className={`text-4xl font-bold ${isPopular ? "text-white" : "text-gray-900"}`}>
                    ${plan.price}
                  </span>
                  <span className={`text-sm ${isPopular ? "text-indigo-200" : "text-gray-400"}`}>/month</span>
                </div>

                <ul className="space-y-3 mb-7">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isPopular ? "text-indigo-300" : "text-indigo-600"}`} />
                      <span className={isPopular ? "text-indigo-100" : "text-gray-700"}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleCheckout(key)}
                  disabled={loading === key}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60 ${
                    isPopular
                      ? "bg-white text-indigo-700 hover:bg-indigo-50"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {loading === key ? "Loading..." : "Start 14-day free trial"}
                </button>
              </div>
            )
          })}
        </div>

        {/* FAQs */}
        <div className="mt-20 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently asked questions</h2>
          <div className="space-y-5">
            {[
              { q: "Do I need a credit card to start?", a: "No. Your 14-day trial is completely free with no card required." },
              { q: "Can I cancel anytime?", a: "Yes — cancel from your account settings anytime and you won't be charged again." },
              { q: "Does it work for any type of business?", a: "Yes. While built with restaurants in mind, it works for any local business with a Google Business Profile." },
              { q: "How do you get my Google data?", a: "You connect your Google Business Profile and Google Search Console via OAuth. We never store your Google password." },
              { q: "What if I have multiple locations?", a: "The Agency plan supports up to 10 locations. For more, contact us for enterprise pricing." },
            ].map((faq) => (
              <div key={faq.q} className="bg-white rounded-xl p-5 border border-gray-100">
                <p className="font-semibold text-gray-900 mb-1.5">{faq.q}</p>
                <p className="text-sm text-gray-500">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

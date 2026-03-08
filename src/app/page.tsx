import Link from "next/link"
import {
  Zap, ArrowRight, MapPin, Globe, Star, Search,
  TrendingUp, Users, DollarSign, CheckCircle,
  BarChart2, MessageSquare, Activity, ChevronRight,
} from "lucide-react"

// The core narrative: every online touchpoint is a step toward a real customer walking in
const journeySteps = [
  {
    step: "01",
    from: "Google Search",
    action: 'They type "coffee near me"',
    icon: Search,
    color: "indigo",
    metric: "8,420 searches/mo",
    desc: "Your business appears in search results based on your online presence strength.",
  },
  {
    step: "02",
    from: "Maps & Profile",
    action: "They open your Google listing",
    icon: MapPin,
    color: "purple",
    metric: "3,210 profile views/mo",
    desc: "Photos, reviews, hours, and your rating all influence whether they stay or leave.",
  },
  {
    step: "03",
    from: "Reviews & Trust",
    action: "They read what others say",
    icon: Star,
    color: "amber",
    metric: "4.6★ · 312 reviews",
    desc: "Each unanswered review or missing reply is a reason to choose your competitor.",
  },
  {
    step: "04",
    from: "Direction Click",
    action: 'They tap "Get directions"',
    icon: TrendingUp,
    color: "cyan",
    metric: "620 direction clicks/mo",
    desc: "This is your strongest buying signal — they've made the decision to visit.",
  },
  {
    step: "05",
    from: "The Visit",
    action: "They walk through your door",
    icon: Users,
    color: "emerald",
    metric: "403 visits/mo",
    desc: "Online presence converts to real foot traffic and real revenue.",
  },
  {
    step: "06",
    from: "Revenue",
    action: "They spend money",
    icon: DollarSign,
    color: "green",
    metric: "$14,508/mo from Google",
    desc: "Every fix to your online presence compounds — the funnel gets more efficient over time.",
  },
]

const features = [
  {
    icon: Activity,
    title: "Daily Demand Pulse",
    description: "Every morning, see how today compares to your normal — green means busier, amber means prepare. One number that tells you if today is a big day.",
    color: "bg-emerald-50 text-emerald-600",
    tag: "Daily habit",
  },
  {
    icon: DollarSign,
    title: "Revenue Causality Engine",
    description: "\"18 unanswered reviews → estimated lost revenue: $1,240/month.\" Every insight is tied directly to a dollar amount so you know exactly what to fix first.",
    color: "bg-red-50 text-red-600",
    tag: "Revenue clarity",
  },
  {
    icon: BarChart2,
    title: "Demand Forecast Engine",
    description: "See what's coming: weather boosts, local events, search trends. Know 7 days out when to add staff, push specials, or extend hours.",
    color: "bg-indigo-50 text-indigo-600",
    tag: "Operational edge",
  },
  {
    icon: MessageSquare,
    title: "AI Review Replies",
    description: "Every unanswered review costs you money. Presencely drafts the perfect response in seconds — personalised, brand-consistent, conversion-optimised.",
    color: "bg-yellow-50 text-yellow-600",
    tag: "Reputation",
  },
  {
    icon: Search,
    title: "SEO → Revenue Attribution",
    description: "See which keyword fixes translate into more foot traffic. Ranked by dollar impact per hour of effort — not by technical complexity.",
    color: "bg-purple-50 text-purple-600",
    tag: "SEO",
  },
  {
    icon: Globe,
    title: "Full Discovery Funnel",
    description: "Track the complete journey: search → map view → direction click → estimated visit → revenue. See exactly where customers drop off.",
    color: "bg-cyan-50 text-cyan-600",
    tag: "Funnel analytics",
  },
]

const plans = [
  {
    name: "Starter",
    price: "$29",
    description: "For single-location businesses just getting started.",
    features: ["1 location", "Discovery funnel tracking", "Review monitoring", "Basic SEO health score", "Monthly report"],
    cta: "Start free trial",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$79",
    description: "Everything you need to dominate local search.",
    features: ["1 location", "Daily Demand Pulse", "AI review reply drafts", "Demand Forecast + Events", "Full keyword rankings", "Competitor benchmarking", "Weekly reports", "Priority support"],
    cta: "Start free trial",
    highlight: true,
  },
  {
    name: "Agency",
    price: "$199",
    description: "Manage multiple locations or clients.",
    features: ["Up to 10 locations", "All Pro features", "White-label reports", "Multi-location dashboard", "Team member access", "API access"],
    cta: "Contact us",
    highlight: false,
  },
]

const testimonials = [
  {
    name: "Marco R.",
    business: "Trattoria Bella, Chicago",
    quote: "The Daily Pulse is the first thing I check every morning. If it's green I know we're good; if it's amber I post a special. It actually changed how I run the restaurant.",
    result: "+34% foot traffic in 30 days",
    rating: 5,
  },
  {
    name: "Jasmine T.",
    business: "The Coffee Collective, NYC",
    quote: "I didn't realise my outdated photos were costing me 90 visits a month. Presencely showed me the dollar figure, I updated the photos, and within two weeks the funnel numbers shifted.",
    result: "$1,800/mo recovered",
    rating: 5,
  },
  {
    name: "Derek L.",
    business: "Southpaw BBQ, Austin",
    quote: "The forecast told me the UT game night would spike demand by 42%. I doubled staff and prepped accordingly — sold out in 3 hours. Game changer.",
    result: "Best revenue week ever",
    rating: 5,
  },
]

const colorMap: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  indigo: { bg: "bg-indigo-50",  text: "text-indigo-600",  border: "border-indigo-100", badge: "bg-indigo-100 text-indigo-700" },
  purple: { bg: "bg-purple-50",  text: "text-purple-600",  border: "border-purple-100", badge: "bg-purple-100 text-purple-700" },
  amber:  { bg: "bg-amber-50",   text: "text-amber-600",   border: "border-amber-100",  badge: "bg-amber-100 text-amber-700"  },
  cyan:   { bg: "bg-cyan-50",    text: "text-cyan-600",    border: "border-cyan-100",   badge: "bg-cyan-100 text-cyan-700"   },
  emerald:{ bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100",badge: "bg-emerald-100 text-emerald-700"},
  green:  { bg: "bg-green-50",   text: "text-green-600",   border: "border-green-100",  badge: "bg-green-100 text-green-700" },
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── Nav ── */}
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto sticky top-0 bg-white/95 backdrop-blur-sm z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900">Presencely</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
          <a href="#how-it-works" className="hover:text-gray-900 transition-colors">How it works</a>
          <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
          <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
          <a href="#testimonials" className="hover:text-gray-900 transition-colors">Stories</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/analyze" className="text-sm text-indigo-600 font-medium hover:text-indigo-700 transition-colors">
            Free audit →
          </Link>
          <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Log in
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Start free trial
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
          The AI Revenue OS for restaurants, cafés, bars &amp; local businesses
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6 max-w-4xl mx-auto">
          Your internet presence
          <br />
          <span className="text-indigo-600">turns into customers.</span>
          <br />
          We show you how.
        </h1>

        <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed">
          Every Google search, every map view, every review is a step toward a customer walking through your door.
          Presencely tracks the entire journey — and tells you exactly how much money each step is making you.
        </p>

        {/* Revenue proof strip */}
        <div className="inline-flex items-center gap-4 bg-white border border-gray-200 rounded-2xl px-6 py-3.5 mb-8 shadow-sm">
          <div className="text-left">
            <p className="text-2xl font-bold text-emerald-600">+$4,200</p>
            <p className="text-xs text-gray-400">avg. additional monthly revenue</p>
          </div>
          <div className="w-px h-8 bg-gray-100" />
          <div className="text-left">
            <p className="text-2xl font-bold text-gray-900">14 days</p>
            <p className="text-xs text-gray-400">avg. time to first result</p>
          </div>
          <div className="w-px h-8 bg-gray-100" />
          <div className="text-left">
            <p className="text-2xl font-bold text-gray-900">2,400+</p>
            <p className="text-xs text-gray-400">local businesses</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
          <Link
            href="/analyze"
            className="flex items-center gap-2 px-7 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors text-base shadow-sm shadow-indigo-200"
          >
            Get your free audit
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/dashboard"
            className="px-7 py-4 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors text-base"
          >
            View live demo
          </Link>
        </div>
        <p className="text-sm text-gray-400">See your real online presence score in 60 seconds · No credit card required</p>
      </section>

      {/* ── How It Works: The Journey ── */}
      <section id="how-it-works" className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-indigo-600 text-sm font-bold uppercase tracking-wider mb-3">The customer journey</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              From &ldquo;coffee near me&rdquo; to money in your register
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Most businesses can only see the first step. Presencely tracks every step of the journey
              — and tells you exactly where you&apos;re losing customers.
            </p>
          </div>

          <div className="relative">
            {/* Connector line */}
            <div className="hidden lg:block absolute top-12 left-[calc(8.33%+2rem)] right-[calc(8.33%+2rem)] h-0.5 bg-gradient-to-r from-indigo-200 via-purple-200 via-amber-200 via-cyan-200 via-emerald-200 to-green-200" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {journeySteps.map((step) => {
                const Icon = step.icon
                const c = colorMap[step.color]
                return (
                  <div key={step.step} className="relative text-center">
                    {/* Step circle */}
                    <div className={`w-16 h-16 ${c.bg} rounded-2xl flex items-center justify-center mx-auto mb-3 border-2 ${c.border} relative z-10 shadow-sm`}>
                      <Icon className={`w-6 h-6 ${c.text}`} />
                    </div>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${c.text} mb-1`}>{step.from}</p>
                    <p className="text-sm font-semibold text-gray-800 mb-2 leading-tight">{step.action}</p>
                    <div className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full mb-2 ${c.badge}`}>
                      {step.metric}
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Conversion callout */}
          <div className="mt-12 bg-white rounded-2xl border border-gray-200 p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-500 mb-1">The gap most businesses don&apos;t know about</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                8,420 searches · 3,210 views · 403 visits
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                For every 100 people who search for your type of business, only 5 end up visiting you.
                Presencely shows you which steps are leaking customers — and exactly how much revenue each leak is costing.
              </p>
            </div>
            <div className="shrink-0">
              <Link
                href="/analyze"
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
              >
                See your funnel <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Daily Pulse Preview ── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-emerald-600 text-sm font-bold uppercase tracking-wider mb-3">The habit that changes everything</p>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Open it every morning.<br />Know in 5 seconds.
              </h2>
              <p className="text-lg text-gray-500 mb-6 leading-relaxed">
                Most analytics tools are checked once a month. Presencely&apos;s Daily Demand Pulse gives you one
                number every morning that tells you how today compares to your normal — and what to do about it.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  { color: "bg-emerald-400", label: "Green", desc: "Busier than usual — ride the wave, post a special" },
                  { color: "bg-indigo-400",  label: "Blue",  desc: "Normal day — standard operations, stay the course" },
                  { color: "bg-amber-400",   label: "Amber", desc: "Below average — run a promotion, engage socials" },
                  { color: "bg-red-400",     label: "Red",   desc: "Slow day — push an offer, reply to pending reviews" },
                ].map((item) => (
                  <li key={item.label} className="flex items-center gap-3 text-sm">
                    <span className={`w-3 h-3 rounded-full shrink-0 ${item.color}`} />
                    <span className="font-semibold text-gray-800">{item.label}:</span>
                    <span className="text-gray-500">{item.desc}</span>
                  </li>
                ))}
              </ul>
              <Link href="/dashboard" className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
                See the live dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Pulse card mockup */}
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl p-6 text-white shadow-xl shadow-emerald-100">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-white/80" />
                <p className="text-xs font-bold uppercase tracking-widest text-white/70">Today&apos;s Demand Pulse</p>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-6xl font-black">132%</span>
                <span className="text-xl text-white/70">of normal</span>
              </div>
              <p className="text-sm font-semibold text-white/90 mb-1">Busier than usual</p>
              <p className="text-xs text-white/60 mb-5">Sunday, Mar 8 · ☀️ Warm weather + Farmers Market nearby</p>

              {/* Mini bar chart mockup */}
              <div className="flex items-end gap-1 h-14 mb-4">
                {[22, 41, 68, 84, 98, 120, 114, 88, 68, 60, 80, 96, 88, 54, 30].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end gap-0.5">
                    <div
                      className={`w-full rounded-sm ${i === 3 ? "bg-white" : i < 3 ? "bg-white/35" : "bg-white/65"}`}
                      style={{ height: `${(h / 120) * 100}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <div className="bg-white/15 rounded-xl p-2.5 text-center">
                    <p className="text-xl font-bold">134</p>
                    <p className="text-[10px] text-white/60">est. visitors</p>
                  </div>
                  <div className="bg-white/15 rounded-xl p-2.5 text-center">
                    <p className="text-xl font-bold">+33</p>
                    <p className="text-[10px] text-white/60">above norm</p>
                  </div>
                </div>
                <div className="bg-black/20 rounded-xl p-3 flex-1">
                  <p className="text-[11px] text-white/90 leading-snug font-medium">
                    💡 Post your Sunday special now — demand peaks at 12pm (+30% above usual)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything in one place</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Stop juggling 6 different tools. One dashboard, every metric that drives foot traffic and revenue.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${feature.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      {feature.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Real results from real owners</h2>
            <p className="text-lg text-gray-500">Not vanity metrics. Real money.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex mb-3">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.business}</p>
                  </div>
                  <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                    {t.result}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, honest pricing</h2>
            <p className="text-lg text-gray-500">14-day free trial on all plans. No credit card required.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 border ${
                  plan.highlight
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "bg-white border-gray-200 text-gray-900"
                }`}
              >
                {plan.highlight && (
                  <div className="text-xs font-semibold bg-indigo-500 text-indigo-100 px-2.5 py-1 rounded-full inline-block mb-3">
                    Most popular
                  </div>
                )}
                <h3 className={`text-lg font-bold mb-1 ${plan.highlight ? "text-white" : "text-gray-900"}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className={`text-4xl font-bold ${plan.highlight ? "text-white" : "text-gray-900"}`}>{plan.price}</span>
                  <span className={`text-sm ${plan.highlight ? "text-indigo-200" : "text-gray-400"}`}>/month</span>
                </div>
                <p className={`text-sm mb-5 ${plan.highlight ? "text-indigo-200" : "text-gray-500"}`}>{plan.description}</p>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? "text-indigo-300" : "text-indigo-600"}`} />
                      <span className={plan.highlight ? "text-indigo-100" : "text-gray-700"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/dashboard"
                  className={`block text-center px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                    plan.highlight
                      ? "bg-white text-indigo-700 hover:bg-indigo-50"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            See how much your internet presence is really worth
          </h2>
          <p className="text-lg text-gray-500 mb-8">
            Get a free audit of your Google presence in 60 seconds. No signup required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors text-base"
            >
              Get my free audit <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-4 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors text-base"
            >
              View live demo
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-4">Join 2,400+ restaurants and local businesses</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-gray-900">Presencely</span>
          </div>
          <p className="text-xs text-gray-400">© 2026 Presencely. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

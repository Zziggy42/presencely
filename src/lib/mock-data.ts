// ─── Mock data for Café du Lac — Geneva, Switzerland ────────────────────────
// All monetary values in CHF. Replace with live API calls per integration docs.

// ─── Currency helper ─────────────────────────────────────────────────────────
export const CURRENCY = "CHF"
export const fmt = (n: number) => `CHF ${n.toLocaleString("en-CH")}`

// ─── Business profile ─────────────────────────────────────────────────────────
export const businessInfo = {
  name: "Café du Lac",
  category: "Café & Coffee Shop",
  address: "12 Quai du Mont-Blanc, 1201 Geneva, Switzerland",
  phone: "+41 22 555 01 82",
  website: "www.cafedulac.ch",
  googleRating: 4.7,
  yelpRating: 4.5,
  totalReviews: 247,
  plan: "Pro",
  currency: "CHF",
  city: "Geneva",
}

export const businessSettings = {
  avgSpendPerVisit: 18,          // CHF 18 avg (coffee + pastry/snack)
  directionToVisitRate: 0.65,    // 65% of direction requests become visits
  profileViewConversionRate: 0.12,
  walkInMultiplier: 1.8,         // total visits ≈ google-attributed × 1.8
  industry: "cafe",
}

// ─── Core monthly metrics ─────────────────────────────────────────────────────
export const overviewMetrics = {
  searchImpressions: { value: 6840,  change: 11.2, label: "Google Searches"    },
  mapsViews:         { value: 2480,  change: 8.4,  label: "Google Maps Views"  },
  websiteClicks:     { value: 1120,  change: -2.8, label: "Website Clicks"     },
  directionRequests: { value: 384,   change: 18.2, label: "Direction Requests" },
  phoneCallClicks:   { value: 142,   change: 4.2,  label: "Phone Call Clicks"  },
  reviewCount:       { value: 247,   change: 11.6, label: "Reviews"            },
}

// ─── Weekly search + maps trend (last 7 days) ─────────────────────────────────
export const weeklySearchData = [
  { day: "Mon", searches: 1080, maps: 390, directions: 58 },
  { day: "Tue", searches: 1020, maps: 364, directions: 54 },
  { day: "Wed", searches: 1140, maps: 408, directions: 60 },
  { day: "Thu", searches: 980,  maps: 350, directions: 52 },
  { day: "Fri", searches: 1200, maps: 438, directions: 66 },
  { day: "Sat", searches: 860,  maps: 308, directions: 48 },
  { day: "Sun", searches: 560,  maps: 222, directions: 46 },
]

// ─── Traffic sources ──────────────────────────────────────────────────────────
export const trafficSourceData = [
  { name: "Google Search", value: 42, color: "#6366f1" },
  { name: "Google Maps",   value: 28, color: "#8b5cf6" },
  { name: "Direct",        value: 15, color: "#06b6d4" },
  { name: "Social",        value: 9,  color: "#10b981" },
  { name: "Other",         value: 6,  color: "#f59e0b" },
]

// ─── Recent reviews ───────────────────────────────────────────────────────────
export const recentReviews = [
  {
    id: 1, platform: "Google", author: "Sophie M.", rating: 5, date: "2026-03-07",
    text: "Meilleur café de Genève! The almond croissant is extraordinary. Came back three times this week.",
    replied: false, sentiment: "positive" as const,
  },
  {
    id: 2, platform: "Google", author: "Thomas B.", rating: 4, date: "2026-03-06",
    text: "Great location on the Quai, lovely lake view from the terrace. Coffee could be slightly stronger but still excellent.",
    replied: true, sentiment: "positive" as const,
  },
  {
    id: 3, platform: "Google", author: "Elena K.", rating: 5, date: "2026-03-05",
    text: "Found this via Google Maps — completely worth the detour. The flat white is the best in the city. Staff are warm and friendly.",
    replied: false, sentiment: "positive" as const,
  },
  {
    id: 4, platform: "Yelp", author: "Marco R.", rating: 3, date: "2026-03-04",
    text: "Nice atmosphere and good pastries but waited 15 minutes for my order on a busy Saturday. Could improve service speed.",
    replied: false, sentiment: "neutral" as const,
  },
  {
    id: 5, platform: "Google", author: "Claire D.", rating: 5, date: "2026-03-02",
    text: "Absolutely charming. Sat by the window watching the Jet d'Eau. Perfect Viennese coffee. Will be back every week.",
    replied: true, sentiment: "positive" as const,
  },
]

// ─── Rating history (7 months) ────────────────────────────────────────────────
export const ratingHistory = [
  { month: "Sep", google: 4.4, yelp: 4.3 },
  { month: "Oct", google: 4.5, yelp: 4.3 },
  { month: "Nov", google: 4.5, yelp: 4.4 },
  { month: "Dec", google: 4.6, yelp: 4.4 },
  { month: "Jan", google: 4.6, yelp: 4.5 },
  { month: "Feb", google: 4.7, yelp: 4.5 },
  { month: "Mar", google: 4.7, yelp: 4.5 },
]

// ─── SEO health ───────────────────────────────────────────────────────────────
export const seoIssues = [
  { id: 1, severity: "critical" as const, title: "Missing meta description",             impact: "+9% CTR",    effort: "5 min",  page: "/home",  href: "/dashboard/seo" },
  { id: 2, severity: "critical" as const, title: "Page load time 4.1s (target <2s)",     impact: "+7% CVR",    effort: "2 hrs",  page: "/home",  href: "/dashboard/seo" },
  { id: 3, severity: "warning"  as const, title: "Missing LocalBusiness schema markup",  impact: "+12% views", effort: "30 min", page: "/home",  href: "/dashboard/seo" },
  { id: 4, severity: "warning"  as const, title: "No Open Graph image",                  impact: "+4% social", effort: "15 min", page: "/home",  href: "/dashboard/seo" },
  { id: 5, severity: "info"     as const, title: "Title tag could include 'Geneva'",      impact: "+3% local",  effort: "2 min",  page: "/home",  href: "/dashboard/seo" },
  { id: 6, severity: "info"     as const, title: "Missing canonical tag",                 impact: "SEO safety", effort: "5 min",  page: "/home",  href: "/dashboard/seo" },
]

export const seoScore = { overall: 62, technical: 54, content: 66, localSeo: 72, performance: 48 }

export const keywordRankings = [
  { keyword: "café geneva",             position: 4,  volume: 1840, change:  2 },
  { keyword: "coffee quai mont-blanc",  position: 2,  volume: 620,  change:  1 },
  { keyword: "best café geneva",        position: 8,  volume: 940,  change: -1 },
  { keyword: "brunch geneva",           position: 11, volume: 2200, change:  3 },
  { keyword: "café lac genève",         position: 3,  volume: 480,  change:  0 },
  { keyword: "flat white geneva",       position: 6,  volume: 320,  change:  2 },
]

// ─── 7-month visibility trend ─────────────────────────────────────────────────
export const monthlyVisibilityData = [
  { month: "Sep", impressions: 5200, maps: 1840, directions: 288 },
  { month: "Oct", impressions: 5480, maps: 1960, directions: 296 },
  { month: "Nov", impressions: 5700, maps: 2040, directions: 308 },
  { month: "Dec", impressions: 6120, maps: 2180, directions: 328 },
  { month: "Jan", impressions: 6340, maps: 2280, directions: 346 },
  { month: "Feb", impressions: 6580, maps: 2380, directions: 364 },
  { month: "Mar", impressions: 6840, maps: 2480, directions: 384 },
]

// ─── Competitor benchmarks ────────────────────────────────────────────────────
export const competitorData = [
  { name: "Café du Lac",       rating: 4.7, reviews: 247, visibility: 84, isYou: true  },
  { name: "Café de la Paix",   rating: 4.5, reviews: 312, visibility: 91, isYou: false },
  { name: "La Buvette",        rating: 4.6, reviews: 188, visibility: 78, isYou: false },
  { name: "Café Remor",        rating: 4.4, reviews: 402, visibility: 96, isYou: false },
]

// ─── With/without Presencely trajectory ──────────────────────────────────────
export const projectionData = [
  { month: "Sep", withPresencely: 288, withoutPresencely: 288, projected: false },
  { month: "Oct", withPresencely: 304, withoutPresencely: 294, projected: false },
  { month: "Nov", withPresencely: 322, withoutPresencely: 298, projected: false },
  { month: "Dec", withPresencely: 340, withoutPresencely: 302, projected: false },
  { month: "Jan", withPresencely: 358, withoutPresencely: 306, projected: false },
  { month: "Feb", withPresencely: 372, withoutPresencely: 310, projected: false },
  { month: "Mar", withPresencely: 384, withoutPresencely: 312, projected: false },
  { month: "Apr", withPresencely: 406, withoutPresencely: 316, projected: true  },
  { month: "May", withPresencely: 432, withoutPresencely: 320, projected: true  },
  { month: "Jun", withPresencely: 460, withoutPresencely: 324, projected: true  },
]

// ─── Hourly demand heatmap ────────────────────────────────────────────────────
// 7 days × hours 7–19 (café hours). Values = demand index 0–100.
export const hourlyDemandData = [
  { day: "Mon", "7":18,"8":72,"9":84,"10":62,"11":48,"12":78,"13":80,"14":52,"15":38,"16":44,"17":36,"18":24,"19":14 },
  { day: "Tue", "7":16,"8":68,"9":80,"10":58,"11":44,"12":72,"13":76,"14":48,"15":34,"16":40,"17":32,"18":20,"19":12 },
  { day: "Wed", "7":20,"8":76,"9":88,"10":66,"11":50,"12":82,"13":86,"14":56,"15":40,"16":46,"17":38,"18":26,"19":16 },
  { day: "Thu", "7":14,"8":64,"9":76,"10":56,"11":42,"12":70,"13":72,"14":46,"15":32,"16":38,"17":30,"18":18,"19":10 },
  { day: "Fri", "7":22,"8":80,"9":92,"10":72,"11":56,"12":88,"13":90,"14":60,"15":44,"16":52,"17":42,"18":30,"19":18 },
  { day: "Sat", "7":10,"8":40,"9":68,"10":84,"11":90,"12":86,"13":80,"14":72,"15":58,"16":44,"17":28,"18":16,"19":8  },
  { day: "Sun", "7":6, "8":28,"9":52,"10":72,"11":84,"12":80,"13":74,"14":64,"15":50,"16":36,"17":22,"18":12,"19":6  },
]

// ─── Customer distance distribution (km) ─────────────────────────────────────
export const customerDistanceData = [
  { range: "<0.5 km",  pct: 38, label: "Walk-in locals",        color: "#6366f1" },
  { range: "0.5–2 km", pct: 31, label: "Neighbourhood",          color: "#8b5cf6" },
  { range: "2–5 km",   pct: 18, label: "City visitors",          color: "#06b6d4" },
  { range: "5–10 km",  pct: 9,  label: "Greater Geneva",         color: "#10b981" },
  { range: "10+ km",   pct: 4,  label: "Destination travellers", color: "#f59e0b" },
]

// ─── Customer segments ────────────────────────────────────────────────────────
export const customerSegments = [
  {
    id: "locals",
    name: "Quai Regulars",
    label: "Quai Regulars",
    range: "<0.5 km",
    pct: 38,
    description: "Walk-to-work coffee stop — arrive before 9h, loyal weekday visitors",
    insight: "Walk-to-work coffee stop — arrive before 9h, loyal weekday visitors",
    avgDistance: 0.3,
    avgSpend: 12,
    visitFrequency: "Daily or near-daily",
    freqPerMonth: 20,
    color: "#6366f1",
  },
  {
    id: "neighbourhood",
    name: "Neighbourhood Crowd",
    label: "Neighbourhood Crowd",
    range: "0.5–2 km",
    pct: 31,
    description: "Lunch and mid-morning regulars from Pâquis and Old Town",
    insight: "Lunch and mid-morning regulars from Pâquis and Old Town",
    avgDistance: 1.4,
    avgSpend: 18,
    visitFrequency: "2–3×/week",
    freqPerMonth: 10,
    color: "#8b5cf6",
  },
  {
    id: "destination",
    name: "Destination Visitors",
    label: "Destination Visitors",
    range: "2+ km",
    pct: 31,
    description: "Found via Google — tourists, business travellers, special-occasion seekers",
    insight: "Found via Google — tourists, business travellers, special-occasion seekers",
    avgDistance: 7.2,
    avgSpend: 24,
    visitFrequency: "Once or twice",
    freqPerMonth: 2,
    color: "#10b981",
  },
]

// ─── Week-ahead demand forecast ───────────────────────────────────────────────
export const weekForecastData = [
  { day: "Mon", date: "Mar 9",  demandIndex: 78, index: 78, vsLastWeek: 3,   busyHour: "9h",  expectedVisits: 62, action: "Normal week-start. Push the 9h flat white offer." },
  { day: "Tue", date: "Mar 10", demandIndex: 74, index: 74, vsLastWeek: -4,  busyHour: "10h", expectedVisits: 58, action: "Quiet Tuesday — loyalty promotion could lift by 15%." },
  { day: "Wed", date: "Mar 11", demandIndex: 86, index: 86, vsLastWeek: 8,   busyHour: "9h",  expectedVisits: 70, action: "Mid-week peak. Prepare extra pastries from 8h." },
  { day: "Thu", date: "Mar 12", demandIndex: 92, index: 92, vsLastWeek: 18,  busyHour: "8h",  expectedVisits: 76, action: "Motor Show last day. Open early at 7h, push takeaway." },
  { day: "Fri", date: "Mar 13", demandIndex: 94, index: 94, vsLastWeek: 12,  busyHour: "9h",  expectedVisits: 78, action: "Strong Friday. Post 'pastry of the day' on GBP." },
  { day: "Sat", date: "Mar 14", demandIndex: 96, index: 96, vsLastWeek: 22,  busyHour: "10h", expectedVisits: 82, action: "Half Marathon Saturday. Full staff. Stock energy snacks." },
  { day: "Sun", date: "Mar 15", demandIndex: 76, index: 76, vsLastWeek: -2,  busyHour: "11h", expectedVisits: 64, action: "Leisure Sunday. Promote the Sunday brunch special." },
]

// ─── Revenue leaks (causal chain) ────────────────────────────────────────────
export const revenueLeaks = [
  {
    id: 1,
    cause: "14 unanswered reviews in the last 60 days",
    causalChain: "No response → lower trust score → −8% conversion rate",
    action: "Reply to all 14 reviews",
    estimatedLoss: 840,
    severity: "high" as const,
    href: "/dashboard/reputation",
  },
  {
    id: 2,
    cause: "Google profile photos are 7 months old",
    causalChain: "Stale photos → lower CTR on Maps → −12% profile views",
    action: "Upload 8 fresh seasonal photos",
    estimatedLoss: 620,
    severity: "high" as const,
    href: "/dashboard/visibility",
  },
  {
    id: 3,
    cause: "Missing LocalBusiness schema markup",
    causalChain: "No schema → no rich snippets → −11% search impressions",
    action: "Add JSON-LD schema to website",
    estimatedLoss: 382,
    severity: "medium" as const,
    href: "/dashboard/seo",
  },
  {
    id: 4,
    cause: "Google Business Profile posted 0 times this month",
    causalChain: "No posts → lower Maps algorithm signal → −9% direction clicks",
    action: "Post a weekly update or special offer",
    estimatedLoss: 284,
    severity: "medium" as const,
    href: "/dashboard/visibility",
  },
]

// ─── Growth score ─────────────────────────────────────────────────────────────
export const growthScore = {
  overall: 68,
  trend: 4,
  benchmark: 54,
  components: [
    { label: "Visibility",  score: 72, color: "#6366f1", icon: "MapPin"        },
    { label: "Reputation",  score: 78, color: "#10b981", icon: "Star"          },
    { label: "SEO Health",  score: 54, color: "#f59e0b", icon: "Search"        },
    { label: "Engagement",  score: 66, color: "#8b5cf6", icon: "MessageSquare" },
  ],
}

// ─── Action queue ─────────────────────────────────────────────────────────────
export const actionQueue = [
  {
    id: "reply-reviews",
    action: "Reply to 14 unanswered reviews",
    category: "Reputation" as const,
    revenueImpact: 840,
    timeMinutes: 20,
    effort: "20 min",
    timeToResults: "24–48 hrs",
    urgency: "high" as const,
    href: "/dashboard/reputation",
  },
  {
    id: "fix-meta",
    action: "Add meta description to homepage",
    category: "SEO" as const,
    revenueImpact: 520,
    timeMinutes: 5,
    effort: "5 min",
    timeToResults: "2–4 weeks",
    urgency: "high" as const,
    href: "/dashboard/seo",
  },
  {
    id: "upload-photos",
    action: "Upload 8 new café photos to GBP",
    category: "Visibility" as const,
    revenueImpact: 420,
    timeMinutes: 15,
    effort: "15 min",
    timeToResults: "1 week",
    urgency: "medium" as const,
    href: "/dashboard/visibility",
  },
]

// ─── Revenue attribution by source ───────────────────────────────────────────
export const revenueAttributionData = [
  { source: "Google Search", visits: 108, revenue: 1944, color: "#6366f1" },
  { source: "Google Maps",   visits: 72,  revenue: 1296, color: "#8b5cf6" },
  { source: "Direct",        visits: 38,  revenue: 684,  color: "#06b6d4" },
  { source: "Social",        visits: 24,  revenue: 432,  color: "#10b981" },
  { source: "Other",         visits: 8,   revenue: 144,  color: "#f59e0b" },
]

// ─── Brand Gravity ────────────────────────────────────────────────────────────
export const brandGravityData = {
  score: 72,
  type: "Neighbourhood Magnet",
  trend: 5,
  percentile: 68,
  avgTravelDistance: 2.1,    // km
  categoryAvgDistance: 1.3,  // km avg for Geneva cafés
  top10PctDistance: 5.2,     // km your top 10% of customers travel
  loyaltyRadius: 3.5,        // 80% of customers within this km radius
  categoryMultiplier: 1.6,   // vs city avg for cafés
  components: [
    { label: "Review Strength",       score: 82, color: "#10b981", description: "4.7★ average, good volume" },
    { label: "Travel Pull",           score: 68, color: "#6366f1", description: "Customers travel avg 2.1 km" },
    { label: "Visibility Power",      score: 72, color: "#8b5cf6", description: "Ranked top 5 for 3 keywords" },
    { label: "Conversion Efficiency", score: 64, color: "#f59e0b", description: "10.1% online → visit rate" },
  ],
}

// ─── Travel bands (km) ───────────────────────────────────────────────────────
export const travelBands = [
  { range: "<0.5 km",  band: "<0.5 km",  label: "Walk-in locals",        visits: 95,  monthlyVisits: 95,  pct: 38, avgSpend: 12, revenue: 1140, color: "#6366f1" },
  { range: "0.5–2 km", band: "0.5–2 km", label: "Neighbourhood",          visits: 78,  monthlyVisits: 78,  pct: 31, avgSpend: 18, revenue: 1404, color: "#8b5cf6" },
  { range: "2–5 km",   band: "2–5 km",   label: "City visitors",          visits: 45,  monthlyVisits: 45,  pct: 18, avgSpend: 20, revenue: 900,  color: "#06b6d4" },
  { range: "5–10 km",  band: "5–10 km",  label: "Greater Geneva",         visits: 22,  monthlyVisits: 22,  pct: 9,  avgSpend: 24, revenue: 528,  color: "#10b981" },
  { range: "10+ km",   band: "10+ km",   label: "Destination travellers", visits: 10,  monthlyVisits: 10,  pct: 4,  avgSpend: 28, revenue: 280,  color: "#f59e0b" },
]

// ─── Competitor Brand Gravity ─────────────────────────────────────────────────
export const competitorGravityData = [
  { name: "Café du Lac",     avgTravelKm: 2.1, avgDistance: 2.1, gravityScore: 72, score: 72, isYou: true  },
  { name: "Café de la Paix", avgTravelKm: 2.8, avgDistance: 2.8, gravityScore: 81, score: 81, isYou: false },
  { name: "La Buvette",      avgTravelKm: 1.9, avgDistance: 1.9, gravityScore: 66, score: 66, isYou: false },
  { name: "Café Remor",      avgTravelKm: 3.2, avgDistance: 3.2, gravityScore: 88, score: 88, isYou: false },
]

// ─── Weather forecast (Geneva, 7-day) ────────────────────────────────────────
export const weatherForecast = [
  { day: "Sun", date: "Mar 8",  emoji: "⛅", high: 11, low: 4, demandEffect: 8,  note: "Mild start — good for terrace" },
  { day: "Mon", date: "Mar 9",  emoji: "🌧️", high: 8,  low: 3, demandEffect: 14, note: "Rain drives indoor café traffic" },
  { day: "Tue", date: "Mar 10", emoji: "🌧️", high: 7,  low: 2, demandEffect: 18, note: "Heavy rain — café as refuge +18%" },
  { day: "Wed", date: "Mar 11", emoji: "🌥️", high: 9,  low: 3, demandEffect: 6,  note: "Overcast — steady morning trade" },
  { day: "Thu", date: "Mar 12", emoji: "☀️", high: 13, low: 5, demandEffect: 5,  note: "Sunny — terrace may open" },
  { day: "Fri", date: "Mar 13", emoji: "☀️", high: 14, low: 6, demandEffect: 10, note: "Warm Friday — strong finish" },
  { day: "Sat", date: "Mar 14", emoji: "☀️", high: 15, low: 7, demandEffect: 18, note: "Best weekend of March forecast" },
]

// ─── Local events radar (Geneva) ─────────────────────────────────────────────
export const localEvents = [
  {
    name: "Marché de Rive",
    date: "Mar 8", day: "Sun",
    distance: 0.4, attendees: 1200, expectedImpact: 12,
    category: "market" as const, emoji: "🛒",
    tip: "Weekly market crowd — stock up on display pastries early",
  },
  {
    name: "Geneva Motor Show (last day)",
    date: "Mar 12", day: "Thu",
    distance: 1.2, attendees: 22000, expectedImpact: 38,
    category: "event" as const, emoji: "🚗",
    tip: "Motor Show overflow — open early at 7h, push takeaway",
  },
  {
    name: "Quai du Mont-Blanc Art Night",
    date: "Mar 13", day: "Fri",
    distance: 0.1, attendees: 1800, expectedImpact: 24,
    category: "arts" as const, emoji: "🎨",
    tip: "Art crowd on your doorstep. Stay open until 21h",
  },
  {
    name: "Geneva Half Marathon",
    date: "Mar 14", day: "Sat",
    distance: 0.6, attendees: 5400, expectedImpact: 32,
    category: "sports" as const, emoji: "🏃",
    tip: "Post-race recovery crowd. Stock energy snacks and isotonic drinks",
  },
]

// ─── POS search-to-transaction correlation ────────────────────────────────────
export const posCorrelationData = [
  { time: "7h",  searches: 28,  transactions: 24  },
  { time: "8h",  searches: 74,  transactions: 62  },
  { time: "9h",  searches: 100, transactions: 84  },
  { time: "10h", searches: 68,  transactions: 92  },
  { time: "11h", searches: 52,  transactions: 58  },
  { time: "12h", searches: 86,  transactions: 72  },
  { time: "13h", searches: 78,  transactions: 88  },
  { time: "14h", searches: 44,  transactions: 52  },
  { time: "15h", searches: 38,  transactions: 40  },
  { time: "16h", searches: 32,  transactions: 36  },
  { time: "17h", searches: 28,  transactions: 30  },
  { time: "18h", searches: 18,  transactions: 22  },
  { time: "19h", searches: 12,  transactions: 14  },
]

// ─── 7-day demand forecast ────────────────────────────────────────────────────
export const demandForecast = [
  { day: "Sun", date: "Mar 8",  base: 62,  weatherBoost: 8,  eventBoost: 12, searchBoost: 4,  predicted: 86,  confidence: 82, revenue: 1548, topDriver: "Marché de Rive nearby",      driverEmoji: "🛒", driverType: "event"   as const, action: "Open on time, display fresh pastries" },
  { day: "Mon", date: "Mar 9",  base: 64,  weatherBoost: 14, eventBoost: 0,  searchBoost: 3,  predicted: 81,  confidence: 78, revenue: 1458, topDriver: "Rain forecast +14%",          driverEmoji: "🌧️", driverType: "weather" as const, action: "Push warm drink offers on Google" },
  { day: "Tue", date: "Mar 10", base: 60,  weatherBoost: 18, eventBoost: 0,  searchBoost: 2,  predicted: 80,  confidence: 76, revenue: 1440, topDriver: "Heavy rain — café as refuge", driverEmoji: "🌧️", driverType: "weather" as const, action: "Max indoor seating, promote co-working vibe" },
  { day: "Wed", date: "Mar 11", base: 68,  weatherBoost: 6,  eventBoost: 0,  searchBoost: 3,  predicted: 77,  confidence: 80, revenue: 1386, topDriver: "Steady mid-week",             driverEmoji: "📈", driverType: "trend"   as const, action: "Standard operations" },
  { day: "Thu", date: "Mar 12", base: 58,  weatherBoost: 5,  eventBoost: 38, searchBoost: 6,  predicted: 107, confidence: 74, revenue: 1926, topDriver: "Geneva Motor Show last day",  driverEmoji: "🚗", driverType: "event"   as const, action: "Open 7h, max takeaway capacity, push on social" },
  { day: "Fri", date: "Mar 13", base: 74,  weatherBoost: 10, eventBoost: 24, searchBoost: 8,  predicted: 116, confidence: 76, revenue: 2088, topDriver: "Art Night on the Quai",       driverEmoji: "🎨", driverType: "event"   as const, action: "Stay open until 21h, promote evening specials" },
  { day: "Sat", date: "Mar 14", base: 78,  weatherBoost: 18, eventBoost: 32, searchBoost: 10, predicted: 138, confidence: 79, revenue: 2484, topDriver: "Geneva Half Marathon",        driverEmoji: "🏃", driverType: "event"   as const, action: "Full team, stock energy snacks, open terrace" },
]

// ─── Decision time metric ─────────────────────────────────────────────────────
export const decisionTimeData = {
  avgMinutes: 14,
  breakdown: [
    { situation: "Morning coffee (7–9h)",    minutes: 5,  intent: "immediate"   as const, tip: "They decide in 5 min — be the top result at 7h" },
    { situation: "Lunch break (12–13h)",     minutes: 8,  intent: "high"        as const, tip: "Fast lunch decisions — post your plat du jour by 11h" },
    { situation: "Afternoon catch-up (15h)", minutes: 18, intent: "planning"    as const, tip: "They check reviews first — reply to unanswered ones tonight" },
    { situation: "Weekend brunch (10–12h)",  minutes: 26, intent: "exploratory" as const, tip: "Photos drive these bookings — keep your gallery fresh" },
  ],
}

// ─── Demand capture rate ──────────────────────────────────────────────────────
export const demandCaptureData = {
  monthlyAreaSearches: 4800,
  visitsCaptured: 250,
  captureRate: 5.2,
  categoryAvgRate: 7.1,
  topCompetitorRate: 11.4,
  potentialVisits: 547,
  extraRevenue: 5346,        // (547 − 250) × CHF 18
}

// ─── Visibility-to-revenue efficiency ────────────────────────────────────────
export const visibilityEfficiencyData = {
  profileViews: 2480,
  estimatedVisits: 250,
  monthlyRevenue: 4500,
  revenuePerView: 1.81,
  cityAvgRevenuePerView: 1.42,
  efficiencyPctAboveAvg: 27,
  onlineToVisitConvRate: 10.1,
  industryAvgConvRate: 8.2,
}

// ─── Daily Business Pulse ─────────────────────────────────────────────────────
export const dailyPulse = {
  today: "Sunday",
  date: "Mar 8",
  currentHour: 10,
  pulsePercent: 124,
  status: "above" as "above" | "normal" | "below" | "slow",
  statusLabel: "Busier than usual",
  driver: "⛅ Mild weather + Marché de Rive nearby",
  driverType: "event" as const,
  hourlyForecast: [
    { hour: "7h",  normal: 14, today: 16, isPast: true,  isCurrent: false },
    { hour: "8h",  normal: 28, today: 32, isPast: true,  isCurrent: false },
    { hour: "9h",  normal: 44, today: 52, isPast: true,  isCurrent: false },
    { hour: "10h", normal: 56, today: 68, isPast: false, isCurrent: true  },
    { hour: "11h", normal: 64, today: 80, isPast: false, isCurrent: false },
    { hour: "12h", normal: 72, today: 88, isPast: false, isCurrent: false },
    { hour: "13h", normal: 68, today: 82, isPast: false, isCurrent: false },
    { hour: "14h", normal: 52, today: 62, isPast: false, isCurrent: false },
    { hour: "15h", normal: 38, today: 44, isPast: false, isCurrent: false },
    { hour: "16h", normal: 32, today: 38, isPast: false, isCurrent: false },
    { hour: "17h", normal: 26, today: 30, isPast: false, isCurrent: false },
    { hour: "18h", normal: 18, today: 20, isPast: false, isCurrent: false },
    { hour: "19h", normal: 10, today: 12, isPast: false, isCurrent: false },
  ],
  peakHour: "12h",
  peakPercent: 122,
  todayInsight: "Marché de Rive crowd peaks at 12h — post your Sunday brunch special now.",
  estimatedVisitsToday: 86,
  normalVisitsToday: 70,
  extraVisitsToday: 16,
  extraRevenueToday: 288,   // 16 × CHF 18
}

// ─── POS Integrations ─────────────────────────────────────────────────────────

export const posIntegrations = [
  {
    id: "lightspeed",
    name: "Lightspeed",
    initial: "L",
    color: "bg-amber-100 text-amber-700",
    description: "Full hospitality POS suite — built for cafés & restaurants",
    markets: ["Switzerland", "Europe", "Asia Pacific"],
    badge: "Popular in Geneva",
    badgeColor: "bg-amber-100 text-amber-700 border border-amber-200",
    connected: false,
    dataPoints: [
      "Every transaction with timestamp",
      "Revenue by hour and shift",
      "Table vs takeaway split",
      "Average order value",
      "Kitchen order data",
    ],
    unlocks: [
      "Google-to-table revenue (exact CHF)",
      "Takeaway vs dine-in attribution",
      "Peak service timing model",
      "Labour cost vs revenue matching",
    ],
  },
  {
    id: "square",
    name: "Square",
    initial: "S",
    color: "bg-slate-100 text-slate-700",
    description: "Simple, global POS — works worldwide including Switzerland",
    markets: ["Global", "Switzerland", "United States", "EU"],
    badge: "Most popular",
    badgeColor: "bg-indigo-100 text-indigo-700 border border-indigo-200",
    connected: false,
    dataPoints: [
      "Transaction data (real-time)",
      "Revenue & refunds",
      "Items sold by category",
      "Shift & staff reports",
      "Customer frequency",
    ],
    unlocks: [
      "Exact revenue from Google discovery",
      "Transaction-confirmed visit count",
      "Auto-calibrated staffing model",
      "Real average order value per channel",
    ],
  },
  {
    id: "toast",
    name: "Toast",
    initial: "T",
    color: "bg-orange-100 text-orange-700",
    description: "Built exclusively for restaurants — US market leader",
    markets: ["United States", "Canada"],
    badge: "US restaurants",
    badgeColor: "bg-orange-100 text-orange-700 border border-orange-200",
    connected: false,
    dataPoints: [
      "Online vs in-person orders",
      "Menu-item level analytics",
      "Takeout & delivery data",
      "Staff tip data",
      "Revenue by daypart",
    ],
    unlocks: [
      "Online ordering attribution",
      "Menu demand signal integration",
      "Daypart revenue forecasting",
      "Delivery vs walk-in revenue split",
    ],
  },
]

export const posUnlockPreview = {
  withoutPOS: {
    revenueLabel: "Estimated",
    revenue: 4500,
    visits: 250,
    avgOrder: 18,
    staffingAccuracy: 67,
    attribution: "Google-estimated",
  },
  withPOS: {
    revenueLabel: "Verified",
    revenue: 4743,
    visits: 403,
    avgOrder: 11.8,
    staffingAccuracy: 94,
    attribution: "Transaction-confirmed",
    extraInsights: [
      "CHF 1,847 came from customers who found you via Google Maps",
      "Takeaway avg CHF 8.40 vs dine-in CHF 14.20",
      "Fri 18h–21h = 31% of weekly revenue in just 3 hours",
    ],
  },
}

// ─── Smart Staffing Forecast ──────────────────────────────────────────────────

export const staffingSettings = {
  capacityPerStaffPerHour: 14,  // orders per staff member per hour (café pace incl. prep)
  avgHourlyWage: 26,            // CHF/hour (Geneva living-wage rates)
  openHour: 7,
  closeHour: 19,
  minStaff: 1,
}

// 7-day staffing forecast aligned with demandForecast
export const staffingForecast = [
  {
    day: "Sun", date: "Mar 8",
    expectedVisits: 86, confidence: 82,
    driver: "Marché de Rive nearby", driverEmoji: "🛒", driverType: "event" as const,
    shifts: [
      { label: "7h – 11h",  staff: 2, visitors: 28, note: "Market crowd builds from 9h" },
      { label: "11h – 14h", staff: 3, visitors: 38, note: "Peak — market + lunch overlap" },
      { label: "14h – 17h", staff: 2, visitors: 14, note: "" },
      { label: "17h – 19h", staff: 1, visitors: 6,  note: "Wind down" },
    ],
    peakStaff: 3,
    totalStaffHours: 25,
    laborCost: 650,
    revenue: 1548,
    laborPct: 42,
    alert: null as string | null,
  },
  {
    day: "Mon", date: "Mar 9",
    expectedVisits: 81, confidence: 78,
    driver: "Rain drives indoor traffic", driverEmoji: "🌧️", driverType: "weather" as const,
    shifts: [
      { label: "7h – 11h",  staff: 2, visitors: 26, note: "Rain commuters seeking warmth" },
      { label: "11h – 14h", staff: 2, visitors: 32, note: "Rainy lunch crowd" },
      { label: "14h – 17h", staff: 2, visitors: 18, note: "Remote workers linger" },
      { label: "17h – 19h", staff: 1, visitors: 5,  note: "" },
    ],
    peakStaff: 2,
    totalStaffHours: 22,
    laborCost: 572,
    revenue: 1458,
    laborPct: 39,
    alert: "Rain forecast — promote co-working vibes on Google",
  },
  {
    day: "Tue", date: "Mar 10",
    expectedVisits: 80, confidence: 76,
    driver: "Heavy rain — café as refuge", driverEmoji: "🌧️", driverType: "weather" as const,
    shifts: [
      { label: "7h – 11h",  staff: 2, visitors: 25, note: "" },
      { label: "11h – 14h", staff: 2, visitors: 32, note: "" },
      { label: "14h – 17h", staff: 2, visitors: 18, note: "Remote workers stay all day" },
      { label: "17h – 19h", staff: 1, visitors: 5,  note: "" },
    ],
    peakStaff: 2,
    totalStaffHours: 22,
    laborCost: 572,
    revenue: 1440,
    laborPct: 40,
    alert: null as string | null,
  },
  {
    day: "Wed", date: "Mar 11",
    expectedVisits: 77, confidence: 80,
    driver: "Steady mid-week", driverEmoji: "📈", driverType: "trend" as const,
    shifts: [
      { label: "7h – 11h",  staff: 2, visitors: 24, note: "" },
      { label: "11h – 14h", staff: 2, visitors: 30, note: "" },
      { label: "14h – 17h", staff: 1, visitors: 16, note: "" },
      { label: "17h – 19h", staff: 1, visitors: 7,  note: "" },
    ],
    peakStaff: 2,
    totalStaffHours: 20,
    laborCost: 520,
    revenue: 1386,
    laborPct: 38,
    alert: null as string | null,
  },
  {
    day: "Thu", date: "Mar 12",
    expectedVisits: 107, confidence: 74,
    driver: "Geneva Motor Show last day", driverEmoji: "🚗", driverType: "event" as const,
    shifts: [
      { label: "7h – 11h",  staff: 3, visitors: 38, note: "Open early — Motor Show crowd" },
      { label: "11h – 14h", staff: 3, visitors: 42, note: "Peak — event overflow + lunch" },
      { label: "14h – 17h", staff: 2, visitors: 20, note: "" },
      { label: "17h – 19h", staff: 1, visitors: 7,  note: "" },
    ],
    peakStaff: 3,
    totalStaffHours: 29,
    laborCost: 754,
    revenue: 1926,
    laborPct: 39,
    alert: "Motor Show ends — expect groups after 14h. Push takeaway.",
  },
  {
    day: "Fri", date: "Mar 13",
    expectedVisits: 116, confidence: 76,
    driver: "Art Night on the Quai", driverEmoji: "🎨", driverType: "event" as const,
    shifts: [
      { label: "7h – 11h",  staff: 2, visitors: 32, note: "" },
      { label: "11h – 14h", staff: 3, visitors: 44, note: "Strong Friday lunch" },
      { label: "14h – 17h", staff: 2, visitors: 22, note: "" },
      { label: "17h – 19h", staff: 2, visitors: 18, note: "Art Night pre-crowd — stay open late" },
    ],
    peakStaff: 3,
    totalStaffHours: 28,
    laborCost: 728,
    revenue: 2088,
    laborPct: 35,
    alert: "Art Night on the Quai — consider extending to 21h.",
  },
  {
    day: "Sat", date: "Mar 14",
    expectedVisits: 138, confidence: 79,
    driver: "Geneva Half Marathon", driverEmoji: "🏃", driverType: "event" as const,
    shifts: [
      { label: "7h – 11h",  staff: 3, visitors: 44, note: "Pre-race early risers" },
      { label: "11h – 14h", staff: 4, visitors: 55, note: "Post-race recovery peak 🏆" },
      { label: "14h – 17h", staff: 2, visitors: 26, note: "" },
      { label: "17h – 19h", staff: 2, visitors: 13, note: "Terrace crowd if sunny" },
    ],
    peakStaff: 4,
    totalStaffHours: 33,
    laborCost: 858,
    revenue: 2484,
    laborPct: 35,
    alert: "⚡ Busiest day of the week. Book 4 staff now.",
  },
]

// Today's (Sunday) hourly staffing breakdown
export const todayHourlyStaffing = [
  { hour: "7h",  visitors: 6,  staffNeeded: 1, isPast: true,  isCurrent: false, note: "" },
  { hour: "8h",  visitors: 12, staffNeeded: 1, isPast: true,  isCurrent: false, note: "Morning coffee" },
  { hour: "9h",  visitors: 16, staffNeeded: 2, isPast: true,  isCurrent: false, note: "Peak morning" },
  { hour: "10h", visitors: 12, staffNeeded: 1, isPast: false, isCurrent: true,  note: "" },
  { hour: "11h", visitors: 10, staffNeeded: 1, isPast: false, isCurrent: false, note: "" },
  { hour: "12h", visitors: 16, staffNeeded: 2, isPast: false, isCurrent: false, note: "Market + lunch peak" },
  { hour: "13h", visitors: 14, staffNeeded: 1, isPast: false, isCurrent: false, note: "" },
  { hour: "14h", visitors: 6,  staffNeeded: 1, isPast: false, isCurrent: false, note: "" },
  { hour: "15h", visitors: 5,  staffNeeded: 1, isPast: false, isCurrent: false, note: "" },
  { hour: "16h", visitors: 4,  staffNeeded: 1, isPast: false, isCurrent: false, note: "" },
  { hour: "17h", visitors: 3,  staffNeeded: 1, isPast: false, isCurrent: false, note: "" },
  { hour: "18h", visitors: 2,  staffNeeded: 1, isPast: false, isCurrent: false, note: "" },
  { hour: "19h", visitors: 0,  staffNeeded: 0, isPast: false, isCurrent: false, note: "Closed" },
]

// Staffing summary insights for the week
export const staffingInsights = {
  weekTotalLaborCost: 4654,    // CHF (sum of all days)
  weekRevenue: 12330,          // CHF
  weekLaborPct: 38,            // labor as % of revenue
  peakDay: "Sat",
  peakDayDate: "Mar 14",
  peakDayStaff: 4,
  peakDayDriver: "Geneva Half Marathon",
  weekTotalStaffHours: 179,
  understaffingRisk: {
    day: "Sat",
    date: "Mar 14",
    driver: "Geneva Half Marathon",
    expectedVisits: 138,
    recommendedStaff: 4,
    revenueAtRisk: 373,       // ~15% of Saturday revenue if 1 staff short
  },
  overstaffingWasteIfIgnored: 676,  // cost of 1 unnecessary extra staff all week (26 × avg 4h/day × 6.5 days)
  correctStaffingUplift: 1049,      // revenue protected/gained by correct staffing (risk + waste avoided)
}

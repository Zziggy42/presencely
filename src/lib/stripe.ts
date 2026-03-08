import Stripe from "stripe"

// Lazy singleton — avoids module-load error when STRIPE_SECRET_KEY is not set at build time
let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-02-25.clover",
    })
  }
  return _stripe
}

/** @deprecated Use getStripe() instead */
export const stripe = {
  get webhooks() { return getStripe().webhooks },
  get checkout() { return getStripe().checkout },
}

export const PLANS = {
  starter: {
    name: "Starter",
    price: 29,
    priceId: process.env.STRIPE_PRICE_STARTER!,
    features: [
      "1 location",
      "Google Maps & Search data",
      "Review monitoring (Google + Yelp)",
      "Basic SEO health score",
      "Monthly performance report",
    ],
  },
  pro: {
    name: "Pro",
    price: 79,
    priceId: process.env.STRIPE_PRICE_PRO!,
    features: [
      "Everything in Starter",
      "AI review reply drafts",
      "Full keyword rankings",
      "Competitor benchmarking",
      "Weekly SEO reports",
      "Priority support",
    ],
  },
  agency: {
    name: "Agency",
    price: 199,
    priceId: process.env.STRIPE_PRICE_AGENCY!,
    features: [
      "Up to 10 locations",
      "Everything in Pro",
      "White-label reports",
      "Team member access",
      "API access",
    ],
  },
} as const

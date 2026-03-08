import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import type Stripe from "stripe"

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const supabase = await createClient()

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.client_reference_id
      const subscriptionId = session.subscription as string

      if (userId) {
        await supabase
          .from("subscriptions")
          .upsert({
            user_id: userId,
            stripe_subscription_id: subscriptionId,
            stripe_customer_id: session.customer as string,
            status: "trialing",
            plan: "pro", // default — update based on price lookup if needed
            current_period_end: null,
          })
      }
      break
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription
      const userId = subscription.metadata.supabase_user_id

      // current_period_end moved to subscription items in newer Stripe API versions
      const periodEnd = (subscription as unknown as Record<string, number>).current_period_end
      if (userId) {
        await supabase
          .from("subscriptions")
          .update({
            status: subscription.status,
            ...(periodEnd ? { current_period_end: new Date(periodEnd * 1000).toISOString() } : {}),
          })
          .eq("stripe_subscription_id", subscription.id)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}

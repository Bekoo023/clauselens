import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStripe, PRICE_IDS } from "@/lib/stripe";
import { getServerEnv } from "@/lib/env";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

const schema = z.object({
  plan: z.enum(["pro", "business"]),
  interval: z.enum(["monthly", "yearly"]),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  }

  const rate = await checkRateLimit("checkout", session.user.id);
  if (!rate.success) return rateLimitResponse(rate, "Too many checkout attempts. Please wait a moment and try again.");

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid plan." }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "Account not found." }, { status: 404 });

  // Stripe is the source of truth for subscriptions — never let a signed-in
  // subscriber open a second, competing checkout session. Send them to the
  // billing portal (or a future change-plan flow) instead.
  if (user.plan !== "FREE" && user.stripeSubscriptionId) {
    return NextResponse.json(
      {
        error: "You already have an active subscription. Manage or change your plan from the billing portal.",
        code: "ALREADY_SUBSCRIBED",
      },
      { status: 409 }
    );
  }

  const priceKey = `${parsed.data.plan}_${parsed.data.interval}` as keyof typeof PRICE_IDS;
  const priceId = PRICE_IDS[priceKey]();
  if (!priceId) {
    console.error(`[stripe checkout] Missing price id env var for ${priceKey}.`);
    return NextResponse.json({ error: "This plan isn't available right now. Please contact support." }, { status: 500 });
  }

  try {
    const stripe = getStripe();

    // Reuse or create the Stripe customer for this user (never create a
    // second Stripe customer for the same account).
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create(
        { email: user.email, metadata: { userId: user.id } },
        { idempotencyKey: `customer-create-${user.id}` }
      );
      customerId = customer.id;
      await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } });
    }

    const appUrl = getServerEnv().NEXT_PUBLIC_APP_URL;
    // Bucketed idempotency key: guards against double-submit / retry storms
    // creating two checkout sessions for the same click, without blocking a
    // genuinely new attempt a few seconds later.
    const idempotencyKey = `checkout-${user.id}-${priceKey}-${Math.floor(Date.now() / 10_000)}`;

    const checkout = await stripe.checkout.sessions.create(
      {
        customer: customerId,
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${appUrl}/dashboard?upgraded=1`,
        cancel_url: `${appUrl}/pricing`,
        metadata: { userId: user.id, plan: parsed.data.plan },
        subscription_data: { metadata: { userId: user.id, plan: parsed.data.plan } },
        allow_promotion_codes: true,
      },
      { idempotencyKey }
    );

    return NextResponse.json({ url: checkout.url });
  } catch (err) {
    console.error("[stripe checkout] Failed to create checkout session:", err instanceof Error ? err.message : "unknown error");
    return NextResponse.json({ error: "Could not start checkout. Please try again." }, { status: 500 });
  }
}

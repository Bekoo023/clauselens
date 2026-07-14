import { NextResponse } from "next/server";
import type Stripe from "stripe";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { getServerEnv } from "@/lib/env";
import { resolveSubscriptionState } from "@/lib/subscription";

// Stripe requires the raw body for signature verification
export async function POST(req: Request) {
  const stripe = getStripe();
  const signature = req.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, getServerEnv().STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Idempotency fast path: a previously-processed event id is a no-op.
  const already = await prisma.processedWebhookEvent.findUnique({ where: { id: event.id } });
  if (already) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  let apply: (tx: Prisma.TransactionClient) => Promise<void>;
  try {
    apply = await buildHandler(event, stripe);
  } catch (err) {
    console.error(`[stripe webhook] Failed to prepare handler for ${event.type}:`, err instanceof Error ? err.message : "unknown error");
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }

  try {
    await prisma.$transaction(async (tx) => {
      await apply(tx);
      // Marker insert is part of the same transaction: if anything above
      // throws, nothing commits and a Stripe retry reprocesses cleanly.
      await tx.processedWebhookEvent.create({ data: { id: event.id, type: event.type } });
    });
  } catch (err) {
    if (isUniqueConstraintViolation(err)) {
      // A concurrent delivery of the same event already committed first.
      return NextResponse.json({ received: true, duplicate: true });
    }
    console.error(`[stripe webhook] Failed to apply ${event.type}:`, err instanceof Error ? err.message : "unknown error");
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

function isUniqueConstraintViolation(err: unknown): boolean {
  return typeof err === "object" && err !== null && "code" in err && (err as { code?: string }).code === "P2002";
}

type TxHandler = (tx: Prisma.TransactionClient) => Promise<void>;

async function noop(): Promise<void> {}

/** Resolves any Stripe API calls needed for this event and returns a pure-DB function to run inside the transaction. */
async function buildHandler(event: Stripe.Event, stripe: Stripe): Promise<TxHandler> {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== "subscription") return noop;

      const userId = session.metadata?.userId;
      const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
      if (!userId || !subscriptionId) {
        console.error("[stripe webhook] checkout.session.completed missing userId or subscription id.");
        return noop;
      }

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id ?? null;
      const resolved = resolveSubscriptionState(subscription);

      return async (tx) => {
        const user = await tx.user.findUnique({ where: { id: userId }, select: { id: true } });
        if (!user) return;
        await tx.user.update({
          where: { id: userId },
          data: {
            ...(customerId ? { stripeCustomerId: customerId } : {}),
            stripeSubscriptionId: subscription.id,
            subscriptionStatus: resolved.status,
            planRenewsAt: resolved.currentPeriodEnd,
            ...(resolved.hasAccess && !resolved.planRecognized ? {} : { plan: resolved.plan }),
          },
        });
        if (resolved.hasAccess && !resolved.planRecognized) {
          console.error(`[stripe webhook] Unrecognized price id ${resolved.priceId ?? "none"} for subscription ${subscription.id}; plan left unchanged.`);
        }
      };
    }

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
      const resolved = resolveSubscriptionState(subscription);

      return async (tx) => {
        const userId = await findUserIdForCustomer(tx, stripe, customerId);
        if (!userId) {
          console.error(`[stripe webhook] No user found for Stripe customer on ${event.type}.`);
          return;
        }
        await tx.user.update({
          where: { id: userId },
          data: {
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscription.id,
            subscriptionStatus: resolved.status,
            planRenewsAt: resolved.currentPeriodEnd,
            ...(resolved.hasAccess && !resolved.planRecognized ? {} : { plan: resolved.plan }),
          },
        });
      };
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;

      return async (tx) => {
        const userId = await findUserIdForCustomer(tx, stripe, customerId);
        if (!userId) return;
        await tx.user.update({
          where: { id: userId },
          data: { plan: "FREE", stripeSubscriptionId: null, subscriptionStatus: "canceled", planRenewsAt: null },
        });
      };
    }

    case "invoice.paid":
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = typeof invoice.subscription === "string" ? invoice.subscription : invoice.subscription?.id;
      if (!subscriptionId) return noop;

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
      const resolved = resolveSubscriptionState(subscription);

      return async (tx) => {
        const userId = await findUserIdForCustomer(tx, stripe, customerId);
        if (!userId) return;
        await tx.user.update({
          where: { id: userId },
          data: {
            stripeSubscriptionId: subscription.id,
            subscriptionStatus: resolved.status,
            planRenewsAt: resolved.currentPeriodEnd,
            ...(resolved.hasAccess && !resolved.planRecognized ? {} : { plan: resolved.plan }),
          },
        });
      };
    }

    default:
      return noop;
  }
}

/** Finds the ClauseLens user for a Stripe customer id, backfilling the link from Stripe customer metadata if it isn't set yet (handles out-of-order webhook delivery). */
async function findUserIdForCustomer(tx: Prisma.TransactionClient, stripe: Stripe, customerId: string): Promise<string | null> {
  const existing = await tx.user.findFirst({ where: { stripeCustomerId: customerId }, select: { id: true } });
  if (existing) return existing.id;

  const customer = await stripe.customers.retrieve(customerId);
  if (customer.deleted) return null;
  const userId = customer.metadata?.userId;
  if (!userId) return null;

  const user = await tx.user.findUnique({ where: { id: userId }, select: { id: true } });
  if (!user) return null;

  await tx.user.update({ where: { id: userId }, data: { stripeCustomerId: customerId } });
  return userId;
}

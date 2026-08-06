import type Stripe from "stripe";
import type { Plan } from "@prisma/client";
import { buildPriceToPlanMap } from "@/lib/stripe";

// Stripe's real Subscription object is the single source of truth for what
// plan a user is on. Nothing here trusts client- or checkout-supplied
// metadata for the plan itself: only the active Price ID on the
// subscription decides that.

// Statuses under which the user keeps paid access.
const ACCESS_GRANTING_STATUSES: ReadonlySet<Stripe.Subscription.Status> = new Set(["active", "trialing"]);

export type ResolvedSubscription = {
  status: Stripe.Subscription.Status;
  priceId: string | null;
  /** True if this price id is one of the four known ClauseLens prices. */
  planRecognized: boolean;
  /** True if the subscription status should currently grant paid access. */
  hasAccess: boolean;
  /**
   * The plan to persist on the User record. FREE whenever access isn't
   * currently granted (covers past_due, unpaid, canceled, incomplete,
   * incomplete_expired, paused): a permanently or temporarily failed
   * payment never leaves paid access in place.
   */
  plan: Plan;
  currentPeriodEnd: Date | null;
};

export function resolveSubscriptionState(subscription: Stripe.Subscription): ResolvedSubscription {
  const priceId = subscription.items.data[0]?.price?.id ?? null;
  const priceToPlan = buildPriceToPlanMap();
  const mappedPlan = priceId ? priceToPlan[priceId] : undefined;
  const hasAccess = ACCESS_GRANTING_STATUSES.has(subscription.status);

  return {
    status: subscription.status,
    priceId,
    planRecognized: mappedPlan !== undefined,
    hasAccess,
    plan: hasAccess && mappedPlan ? mappedPlan : "FREE",
    currentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end * 1000) : null,
  };
}

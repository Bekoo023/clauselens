import { describe, it, expect, vi } from "vitest";
import type Stripe from "stripe";

vi.mock("@/lib/env", () => ({
  getServerEnv: () => ({
    STRIPE_PRICE_PRO_MONTHLY: "price_pro_monthly",
    STRIPE_PRICE_PRO_YEARLY: "price_pro_yearly",
    STRIPE_PRICE_BUSINESS_MONTHLY: "price_business_monthly",
    STRIPE_PRICE_BUSINESS_YEARLY: "price_business_yearly",
  }),
  hasRedisConfig: () => false,
}));

const { resolveSubscriptionState } = await import("@/lib/subscription");

function fakeSubscription(overrides: Partial<Stripe.Subscription> & { priceId?: string }): Stripe.Subscription {
  const { priceId, ...rest } = overrides;
  return {
    id: "sub_123",
    status: "active",
    current_period_end: 1_800_000_000,
    items: {
      data: priceId ? [{ price: { id: priceId } }] : [],
    },
    ...rest,
  } as unknown as Stripe.Subscription;
}

describe("resolveSubscriptionState", () => {
  it("maps the Pro monthly price id to PRO with access", () => {
    const result = resolveSubscriptionState(fakeSubscription({ priceId: "price_pro_monthly", status: "active" }));
    expect(result).toMatchObject({ plan: "PRO", hasAccess: true, planRecognized: true });
  });

  it("maps the Business yearly price id to BUSINESS with access", () => {
    const result = resolveSubscriptionState(fakeSubscription({ priceId: "price_business_yearly", status: "active" }));
    expect(result).toMatchObject({ plan: "BUSINESS", hasAccess: true, planRecognized: true });
  });

  it("treats trialing as having access", () => {
    const result = resolveSubscriptionState(fakeSubscription({ priceId: "price_pro_monthly", status: "trialing" }));
    expect(result.hasAccess).toBe(true);
    expect(result.plan).toBe("PRO");
  });

  it("downgrades a canceled subscription to FREE with no access", () => {
    const result = resolveSubscriptionState(fakeSubscription({ priceId: "price_business_monthly", status: "canceled" }));
    expect(result).toMatchObject({ plan: "FREE", hasAccess: false });
  });

  it("downgrades past_due (failed payment) to FREE, never leaving unlimited access", () => {
    const result = resolveSubscriptionState(fakeSubscription({ priceId: "price_business_yearly", status: "past_due" }));
    expect(result).toMatchObject({ plan: "FREE", hasAccess: false });
  });

  it("downgrades unpaid to FREE", () => {
    const result = resolveSubscriptionState(fakeSubscription({ priceId: "price_pro_yearly", status: "unpaid" }));
    expect(result).toMatchObject({ plan: "FREE", hasAccess: false });
  });

  it("flags an unrecognized price id instead of silently trusting it", () => {
    const result = resolveSubscriptionState(fakeSubscription({ priceId: "price_unknown_xyz", status: "active" }));
    expect(result.planRecognized).toBe(false);
    expect(result.hasAccess).toBe(true);
    // Caller (webhook handler) is responsible for not touching `plan` when
    // hasAccess && !planRecognized: verified in the webhook route.
  });
});

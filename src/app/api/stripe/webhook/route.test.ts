import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/env", () => ({ getServerEnv: () => ({ STRIPE_WEBHOOK_SECRET: "whsec_test" }) }));

const constructEventMock = vi.fn();
const retrieveSubscriptionMock = vi.fn();
const retrieveCustomerMock = vi.fn();

vi.mock("@/lib/stripe", () => ({
  getStripe: () => ({
    webhooks: { constructEvent: constructEventMock },
    subscriptions: { retrieve: retrieveSubscriptionMock },
    customers: { retrieve: retrieveCustomerMock },
  }),
  buildPriceToPlanMap: () => ({ price_pro_monthly: "PRO" }),
}));

type UserRow = {
  id: string;
  stripeCustomerId: string | null;
  plan: string;
  stripeSubscriptionId: string | null;
  subscriptionStatus: string | null;
  planRenewsAt: Date | null;
};

let users: Map<string, UserRow>;
let processed: Map<string, { id: string; type: string }>;

const fakeTx = {
  user: {
    findUnique: async ({ where }: { where: { id: string } }) => users.get(where.id) ?? null,
    findFirst: async ({ where }: { where: { stripeCustomerId: string } }) =>
      [...users.values()].find((u) => u.stripeCustomerId === where.stripeCustomerId) ?? null,
    update: async ({ where, data }: { where: { id: string }; data: Partial<UserRow> }) => {
      const user = users.get(where.id);
      if (!user) throw new Error("not found");
      Object.assign(user, data);
    },
  },
  processedWebhookEvent: {
    create: async ({ data }: { data: { id: string; type: string } }) => {
      if (processed.has(data.id)) {
        const err = new Error("Unique constraint failed") as Error & { code: string };
        err.code = "P2002";
        throw err;
      }
      processed.set(data.id, data);
    },
  },
};

vi.mock("@/lib/prisma", () => ({
  prisma: {
    processedWebhookEvent: {
      findUnique: async ({ where }: { where: { id: string } }) => processed.get(where.id) ?? null,
    },
    $transaction: async (fn: (tx: unknown) => Promise<unknown>) => fn(fakeTx),
  },
}));

const { POST } = await import("@/app/api/stripe/webhook/route");

function makeRequest() {
  return new Request("http://localhost/api/stripe/webhook", {
    method: "POST",
    headers: { "stripe-signature": "test-signature" },
    body: "{}",
  });
}

beforeEach(() => {
  users = new Map([
    ["user-1", { id: "user-1", stripeCustomerId: "cus_1", plan: "FREE", stripeSubscriptionId: null, subscriptionStatus: null, planRenewsAt: null }],
  ]);
  processed = new Map();
  constructEventMock.mockReset();
  retrieveSubscriptionMock.mockReset();
});

describe("POST /api/stripe/webhook — idempotency", () => {
  it("applies customer.subscription.updated exactly once for a given event id", async () => {
    const event = {
      id: "evt_1",
      type: "customer.subscription.updated",
      data: {
        object: {
          id: "sub_1",
          customer: "cus_1",
          status: "active",
          items: { data: [{ price: { id: "price_pro_monthly" } }] },
          current_period_end: 1_800_000_000,
        },
      },
    };
    constructEventMock.mockReturnValue(event);

    const first = await POST(makeRequest());
    expect(first.status).toBe(200);
    expect(users.get("user-1")?.plan).toBe("PRO");

    // Simulate Stripe resending the identical event (e.g. it timed out
    // waiting for our 200). Mutate what the "new" delivery would carry to
    // prove it's ignored, not reprocessed.
    const resent = { ...event, data: { object: { ...event.data.object, status: "canceled" } } };
    constructEventMock.mockReturnValue(resent);

    const second = await POST(makeRequest());
    const secondBody = await second.json();
    expect(second.status).toBe(200);
    expect(secondBody.duplicate).toBe(true);
    // Plan must be untouched by the resend — proves no duplicate action ran.
    expect(users.get("user-1")?.plan).toBe("PRO");
  });

  it("processes two different event ids independently", async () => {
    const baseSub = {
      id: "sub_1",
      customer: "cus_1",
      status: "active",
      items: { data: [{ price: { id: "price_pro_monthly" } }] },
      current_period_end: 1_800_000_000,
    };
    constructEventMock.mockReturnValueOnce({ id: "evt_a", type: "customer.subscription.updated", data: { object: baseSub } });
    await POST(makeRequest());

    constructEventMock.mockReturnValueOnce({ id: "evt_b", type: "customer.subscription.updated", data: { object: { ...baseSub, status: "past_due" } } });
    const second = await POST(makeRequest());
    const secondBody = await second.json();

    expect(secondBody.duplicate).toBeUndefined();
    expect(users.get("user-1")?.plan).toBe("FREE"); // past_due => no access => FREE
  });

  it("rejects a request with no stripe-signature header", async () => {
    const res = await POST(new Request("http://localhost/api/stripe/webhook", { method: "POST", body: "{}" }));
    expect(res.status).toBe(400);
  });
});

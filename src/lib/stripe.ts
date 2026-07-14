import Stripe from "stripe";
import type { Plan } from "@prisma/client";
import { getServerEnv } from "@/lib/env";

// Lazily initialised so builds succeed without env vars present
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(getServerEnv().STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia",
    });
  }
  return _stripe;
}

export const PRICE_IDS = {
  pro_monthly: () => getServerEnv().STRIPE_PRICE_PRO_MONTHLY,
  pro_yearly: () => getServerEnv().STRIPE_PRICE_PRO_YEARLY,
  business_monthly: () => getServerEnv().STRIPE_PRICE_BUSINESS_MONTHLY,
  business_yearly: () => getServerEnv().STRIPE_PRICE_BUSINESS_YEARLY,
};

/** Maps every known Stripe Price ID to its ClauseLens plan. Source of truth for P3. */
export function buildPriceToPlanMap(): Record<string, Plan> {
  return {
    [PRICE_IDS.pro_monthly()]: "PRO",
    [PRICE_IDS.pro_yearly()]: "PRO",
    [PRICE_IDS.business_monthly()]: "BUSINESS",
    [PRICE_IDS.business_yearly()]: "BUSINESS",
  };
}

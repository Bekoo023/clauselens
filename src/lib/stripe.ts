import Stripe from "stripe";

// Lazily initialised so builds succeed without env vars present
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
      apiVersion: "2025-02-24.acacia",
    });
  }
  return _stripe;
}

export const PRICE_IDS = {
  pro_monthly: () => process.env.STRIPE_PRICE_PRO_MONTHLY ?? "",
  pro_yearly: () => process.env.STRIPE_PRICE_PRO_YEARLY ?? "",
  business_monthly: () => process.env.STRIPE_PRICE_BUSINESS_MONTHLY ?? "",
  business_yearly: () => process.env.STRIPE_PRICE_BUSINESS_YEARLY ?? "",
};

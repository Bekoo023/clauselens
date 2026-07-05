import type { Plan } from "@prisma/client";

export const PLAN_LIMITS: Record<Plan, { analysesPerMonth: number; label: string }> = {
  FREE: { analysesPerMonth: 1, label: "Free" },
  PRO: { analysesPerMonth: 20, label: "Pro" },
  BUSINESS: { analysesPerMonth: Infinity, label: "Business" },
};

export const PRICING = {
  pro: { monthly: 29, yearly: 24 },
  business: { monthly: 79, yearly: 66 },
};

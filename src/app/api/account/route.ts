import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

// Permanent, self-service account deletion — the privacy policy promises
// this can be done from the dashboard "at any time". Deleting the User row
// cascades to Contracts, PlaybookRules, Accounts and Sessions (all declared
// onDelete: Cascade in schema.prisma), so no orphaned data is left behind.
export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "Account not found." }, { status: 404 });

  if (user.stripeSubscriptionId) {
    try {
      await getStripe().subscriptions.cancel(user.stripeSubscriptionId);
    } catch (err) {
      // Don't block account deletion on a Stripe hiccup — the webhook will
      // eventually reconcile, and a canceled Stripe customer with no linked
      // user is harmless.
      console.error("[account delete] Failed to cancel Stripe subscription:", err instanceof Error ? err.message : "unknown error");
    }
  }

  await prisma.user.delete({ where: { id: user.id } });

  return NextResponse.json({ ok: true });
}

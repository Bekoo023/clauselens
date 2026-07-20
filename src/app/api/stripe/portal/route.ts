import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { getServerEnv } from "@/lib/env";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user?.stripeCustomerId) {
    return NextResponse.json({ error: "No billing account found." }, { status: 404 });
  }

  const stripe = getStripe();
  const appUrl = getServerEnv().NEXT_PUBLIC_APP_URL;

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${appUrl}/dashboard/settings`,
  });

  return NextResponse.json({ url: portalSession.url });
}

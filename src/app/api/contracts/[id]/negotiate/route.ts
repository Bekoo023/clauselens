import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { analysisSchema, draftNegotiationEmail } from "@/lib/analyze";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const maxDuration = 60;

// Drafts a ready-to-send negotiation email from the stored analysis.
// Pro/Business only — the strongest single upgrade trigger in the product.
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Also calls the paid Anthropic API, so it gets the same fail-closed
  // per-user rate limit as /api/analyze.
  const rate = await checkRateLimit("negotiate", session.user.id);
  if (!rate.success) return rateLimitResponse(rate, "Too many requests. Please slow down and try again in a moment.");

  const { id } = await params;

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.plan === "FREE") {
    return NextResponse.json(
      { error: "Negotiation emails are a Pro feature. Upgrade to unlock them.", code: "UPGRADE_REQUIRED" },
      { status: 402 }
    );
  }

  const contract = await prisma.contract.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!contract || !contract.analysis) {
    return NextResponse.json({ error: "Contract or analysis not found." }, { status: 404 });
  }

  // Return the cached draft if we already generated one
  if (contract.negotiationEmail) {
    return NextResponse.json({ email: contract.negotiationEmail, cached: true });
  }

  const parsed = analysisSchema.safeParse(contract.analysis);
  if (!parsed.success) {
    return NextResponse.json({ error: "Stored analysis is in an unexpected format." }, { status: 500 });
  }

  try {
    const email = await draftNegotiationEmail(contract.title, parsed.data);
    await prisma.contract.update({ where: { id }, data: { negotiationEmail: email } });
    return NextResponse.json({ email, cached: false });
  } catch (err) {
    console.error("Negotiation email failed:", err instanceof Error ? err.message : "unknown error");
    return NextResponse.json({ error: "Failed to draft the email. Please try again." }, { status: 500 });
  }
}

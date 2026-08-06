import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  analyzeContract,
  riskLevelFromScore,
  MAX_CONTRACT_CHARS,
  ContractTooLargeError,
  AnalysisFailedError,
} from "@/lib/analyze";
import { reserveAnalysisSlot, releaseAnalysisSlot } from "@/lib/quota";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const maxDuration = 60;

const schema = z.object({
  title: z.string().min(1).max(200),
  body: z
    .string()
    .min(100, "Contract text is too short to analyze.")
    .max(
      MAX_CONTRACT_CHARS,
      `This contract is too long to analyze in a single pass (limit: ${MAX_CONTRACT_CHARS.toLocaleString()} characters). Please shorten it or split it into sections.`
    ),
  contractType: z.string().max(50).optional(),
  perspective: z.string().max(50).optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  }

  // Applies regardless of plan: even Business's "unlimited" monthly quota
  // is still protected from abusive burst traffic against the paid
  // Anthropic API behind it.
  const rate = await checkRateLimit("analyze", session.user.id);
  if (!rate.success) {
    return rateLimitResponse(rate, "Too many analysis requests. Please slow down and try again in a moment.");
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "Account not found." }, { status: 404 });

  // Only credentials accounts need explicit verification: Google sign-ins
  // are stamped verified via the provider's own check (see auth.ts signIn).
  if (user.passwordHash && !user.emailVerified) {
    return NextResponse.json(
      { error: "Please verify your email address before running an analysis.", code: "EMAIL_NOT_VERIFIED" },
      { status: 403 }
    );
  }

  // Reserve the quota unit BEFORE calling Anthropic. The row lock inside
  // reserveAnalysisSlot means two concurrent requests can never both claim
  // the same last unit of quota.
  const reservation = await reserveAnalysisSlot(user.id);
  if (!reservation.ok) {
    return NextResponse.json(
      { error: "Monthly analysis limit reached. Upgrade your plan to continue.", code: "LIMIT_REACHED" },
      { status: 402 }
    );
  }

  try {
    const playbookRules =
      user.plan === "BUSINESS"
        ? (
            await prisma.playbookRule.findMany({
              where: { userId: user.id },
              orderBy: { createdAt: "asc" },
            })
          ).map((r) => r.rule)
        : undefined;

    const analysis = await analyzeContract(parsed.data.body, {
      contractType: parsed.data.contractType,
      perspective: parsed.data.perspective,
      playbookRules,
    });

    const contract = await prisma.contract.create({
      data: {
        userId: user.id,
        title: parsed.data.title,
        body: parsed.data.body,
        contractType: parsed.data.contractType ?? null,
        perspective: parsed.data.perspective ?? null,
        riskScore: analysis.riskScore,
        riskLevel: riskLevelFromScore(analysis.riskScore),
        analysis,
      },
    });

    return NextResponse.json({ contractId: contract.id, analysis });
  } catch (err) {
    // The analysis never got saved: give the reserved unit back.
    await releaseAnalysisSlot(user.id);

    if (err instanceof ContractTooLargeError || err instanceof AnalysisFailedError) {
      return NextResponse.json({ error: err.message }, { status: 422 });
    }
    console.error("Contract analysis failed:", err instanceof Error ? err.message : "unknown error");
    return NextResponse.json(
      { error: "Analysis failed. Nothing was deducted from your quota, please try again." },
      { status: 500 }
    );
  }
}

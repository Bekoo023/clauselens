import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { analyzeContract, riskLevelFromScore } from "@/lib/analyze";
import { PLAN_LIMITS } from "@/lib/plans";
import type { Plan } from "@prisma/client";

export const maxDuration = 60;

const schema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().min(100, "Contract text is too short to analyze.").max(200_000),
  contractType: z.string().max(50).optional(),
  perspective: z.string().max(50).optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "Account not found." }, { status: 404 });

  // Reset monthly usage counter when a new calendar month starts
  const now = new Date();
  const resetNeeded =
    user.usageResetAt.getUTCMonth() !== now.getUTCMonth() ||
    user.usageResetAt.getUTCFullYear() !== now.getUTCFullYear();
  const used = resetNeeded ? 0 : user.analysesThisMonth;

  const limit = PLAN_LIMITS[user.plan as Plan].analysesPerMonth;
  if (used >= limit) {
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

    await prisma.user.update({
      where: { id: user.id },
      data: { analysesThisMonth: used + 1, usageResetAt: now },
    });

    return NextResponse.json({ contractId: contract.id, analysis });
  } catch (err) {
    console.error("Contract analysis failed:", err);
    return NextResponse.json(
      { error: "Analysis failed. Nothing was deducted from your quota — please try again." },
      { status: 500 }
    );
  }
}

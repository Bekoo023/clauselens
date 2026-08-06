import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({ rule: z.string().min(3).max(300) });

// Add a playbook rule: Business plan only. Every future analysis is
// checked against every rule the user has saved here.
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.plan !== "BUSINESS") {
    return NextResponse.json(
      { error: "Custom playbooks are a Business feature. Upgrade to unlock them.", code: "UPGRADE_REQUIRED" },
      { status: 402 }
    );
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }

  const count = await prisma.playbookRule.count({ where: { userId: user.id } });
  if (count >= 20) {
    return NextResponse.json({ error: "You can save up to 20 playbook rules." }, { status: 400 });
  }

  const created = await prisma.playbookRule.create({
    data: { userId: user.id, rule: parsed.data.rule },
  });

  return NextResponse.json({ rule: created });
}

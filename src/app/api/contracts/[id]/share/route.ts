import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { getServerEnv } from "@/lib/env";

// POST = enable sharing (generates a token), DELETE = revoke the link.
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rate = await checkRateLimit("share", session.user.id);
  if (!rate.success) return rateLimitResponse(rate);

  const { id } = await params;

  const contract = await prisma.contract.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!contract) {
    return NextResponse.json({ error: "Contract not found." }, { status: 404 });
  }
  if (!contract.analysis) {
    return NextResponse.json({ error: "Nothing to share yet, the analysis is missing." }, { status: 400 });
  }

  const shareToken = contract.shareToken ?? randomBytes(16).toString("hex");
  if (!contract.shareToken) {
    await prisma.contract.update({ where: { id }, data: { shareToken } });
  }

  return NextResponse.json({ shareToken, url: `${getServerEnv().NEXT_PUBLIC_APP_URL}/share/${shareToken}` });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const contract = await prisma.contract.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!contract) {
    return NextResponse.json({ error: "Contract not found." }, { status: 404 });
  }

  await prisma.contract.update({ where: { id }, data: { shareToken: null } });
  return NextResponse.json({ ok: true });
}

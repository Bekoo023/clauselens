import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { normalizeEmail } from "@/lib/normalize-email";
import { hashToken } from "@/lib/tokens";
import { checkRateLimit, rateLimitResponse, getClientIp } from "@/lib/rate-limit";
import { EMAIL_VERIFY_PREFIX } from "@/lib/email-verification";

const schema = z.object({ email: z.string().trim().email(), token: z.string().min(1) });
const NO_STORE = { "Cache-Control": "no-store" };

export async function POST(req: Request) {
  const ip = getClientIp(req.headers);
  const rate = await checkRateLimit("verifyEmail", ip);
  if (!rate.success) return rateLimitResponse(rate);

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400, headers: NO_STORE });
  }

  const email = normalizeEmail(parsed.data.email);
  const identifier = `${EMAIL_VERIFY_PREFIX}${email}`;
  const tokenHash = hashToken(parsed.data.token);

  const result = await prisma.$transaction(async (tx) => {
    const deleted = await tx.verificationToken.deleteMany({
      where: { identifier, token: tokenHash, expires: { gt: new Date() } },
    });
    if (deleted.count === 0) return { ok: false as const };

    await tx.user.updateMany({ where: { email }, data: { emailVerified: new Date() } });
    return { ok: true as const };
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: "This verification link is invalid or has expired. Request a new one." },
      { status: 400, headers: NO_STORE }
    );
  }

  return NextResponse.json({ ok: true }, { headers: NO_STORE });
}

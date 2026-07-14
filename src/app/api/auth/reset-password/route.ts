import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { normalizeEmail } from "@/lib/normalize-email";
import { hashToken } from "@/lib/tokens";
import { checkRateLimit, rateLimitResponse, getClientIp } from "@/lib/rate-limit";

const schema = z.object({
  email: z.string().trim().email(),
  token: z.string().min(1),
  password: z.string().min(8).max(128),
});
const RESET_PREFIX = "password-reset:";

const NO_STORE = { "Cache-Control": "no-store" };

export async function POST(req: Request) {
  const ip = getClientIp(req.headers);
  const rate = await checkRateLimit("resetPassword", ip);
  if (!rate.success) return rateLimitResponse(rate);

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check your details and try again." }, { status: 400, headers: NO_STORE });
  }

  const email = normalizeEmail(parsed.data.email);
  const identifier = `${RESET_PREFIX}${email}`;
  const tokenHash = hashToken(parsed.data.token);
  const passwordHash = await hash(parsed.data.password, 12);

  // Delete-then-update inside one transaction: the conditional delete acts
  // as the single-use guard (a second concurrent request finds 0 rows and
  // aborts) and the password change + session invalidation always land
  // together, so a partially-applied reset can never happen.
  const result = await prisma.$transaction(async (tx) => {
    const deleted = await tx.verificationToken.deleteMany({
      where: { identifier, token: tokenHash, expires: { gt: new Date() } },
    });
    if (deleted.count === 0) return { ok: false as const };

    await tx.user.update({
      where: { email },
      data: { passwordHash, sessionVersion: { increment: 1 } },
    });
    return { ok: true as const };
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: "This reset link is invalid, expired, or has already been used." },
      { status: 400, headers: NO_STORE }
    );
  }

  return NextResponse.json({ ok: true }, { headers: NO_STORE });
}

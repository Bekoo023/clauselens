import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { site } from "@/lib/site";
import { normalizeEmail } from "@/lib/normalize-email";
import { generateRawToken, hashToken } from "@/lib/tokens";
import { checkRateLimit, rateLimitResponse, getClientIp } from "@/lib/rate-limit";

const schema = z.object({ email: z.string().trim().email() });
const RESET_PREFIX = "password-reset:";
const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input." }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }
  const email = normalizeEmail(parsed.data.email);

  const ip = getClientIp(req.headers);
  const rate = await checkRateLimit("forgotPassword", `${ip}:${email}`);
  if (!rate.success) return rateLimitResponse(rate);

  const user = await prisma.user.findUnique({ where: { email } });

  // Always respond the same way, whether or not the account exists, to avoid leaking which emails are registered.
  if (user?.passwordHash) {
    const identifier = `${RESET_PREFIX}${email}`;
    await prisma.verificationToken.deleteMany({ where: { identifier } });

    const rawToken = generateRawToken();
    await prisma.verificationToken.create({
      data: { identifier, token: hashToken(rawToken), expires: new Date(Date.now() + TOKEN_TTL_MS) },
    });

    const resetUrl = `${site.url}/reset-password?token=${rawToken}&email=${encodeURIComponent(email)}`;
    await sendEmail({
      to: email,
      subject: "Reset your ClauseLens password",
      html: `<p>Click the link below to set a new password. This link expires in 1 hour.</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>If you didn't request this, you can safely ignore this email.</p>`,
    });
  }

  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}

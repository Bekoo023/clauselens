import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { normalizeEmail } from "@/lib/normalize-email";
import { checkRateLimit, rateLimitResponse, getClientIp } from "@/lib/rate-limit";
import { sendVerificationEmail } from "@/lib/email-verification";

const schema = z.object({ email: z.string().trim().email() });
const NO_STORE = { "Cache-Control": "no-store" };

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input." }, { status: 400, headers: NO_STORE });
  }
  const email = normalizeEmail(parsed.data.email);

  const ip = getClientIp(req.headers);
  // Keyed by IP + email so one person can't keep re-triggering emails to an
  // address they don't own, while a legitimate user isn't blocked by other
  // people's traffic.
  const rate = await checkRateLimit("resendVerification", `${ip}:${email}`);
  if (!rate.success) return rateLimitResponse(rate);

  const user = await prisma.user.findUnique({ where: { email } });
  if (user?.passwordHash && !user.emailVerified) {
    try {
      await sendVerificationEmail(email);
    } catch (err) {
      console.error("[resend-verification] Failed to send email:", err instanceof Error ? err.message : "unknown error");
    }
  }

  // Same generic response regardless of account existence or verification
  // state, to avoid leaking which emails are registered.
  return NextResponse.json({ ok: true }, { headers: NO_STORE });
}

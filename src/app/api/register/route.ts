import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { normalizeEmail } from "@/lib/normalize-email";
import { checkRateLimit, rateLimitResponse, getClientIp } from "@/lib/rate-limit";
import { sendVerificationEmail } from "@/lib/email-verification";

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
});

export async function POST(req: Request) {
  const ip = getClientIp(req.headers);
  const rate = await checkRateLimit("register", ip);
  if (!rate.success) return rateLimitResponse(rate, "Too many signup attempts. Please try again later.");

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check your details and try again." }, { status: 400 });
  }
  const { name, password } = parsed.data;
  const email = normalizeEmail(parsed.data.email);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const passwordHash = await hash(password, 12);
  await prisma.user.create({ data: { name, email, passwordHash } });

  try {
    await sendVerificationEmail(email);
  } catch (err) {
    console.error("[register] Failed to send verification email:", err instanceof Error ? err.message : "unknown error");
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}

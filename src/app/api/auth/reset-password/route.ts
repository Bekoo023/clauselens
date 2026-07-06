import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email(),
  token: z.string().min(1),
  password: z.string().min(8).max(128),
});
const RESET_PREFIX = "password-reset:";

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please check your details and try again." }, { status: 400 });
  const { email, token, password } = parsed.data;

  const identifier = `${RESET_PREFIX}${email}`;
  const record = await prisma.verificationToken.findUnique({
    where: { identifier_token: { identifier, token } },
  });

  if (!record || record.expires < new Date()) {
    return NextResponse.json({ error: "This reset link is invalid or has expired." }, { status: 400 });
  }

  const passwordHash = await hash(password, 12);
  await prisma.user.update({ where: { email }, data: { passwordHash } });
  await prisma.verificationToken.delete({ where: { identifier_token: { identifier, token } } });

  return NextResponse.json({ ok: true });
}

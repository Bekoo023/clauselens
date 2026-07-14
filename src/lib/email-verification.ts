import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { site } from "@/lib/site";
import { generateRawToken, hashToken } from "@/lib/tokens";

export const EMAIL_VERIFY_PREFIX = "email-verify:";
export const EMAIL_VERIFY_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/** Issues a fresh (hashed, single-use, 24h) verification token and emails the raw token to the user. Never logs the raw token. */
export async function sendVerificationEmail(normalizedEmail: string): Promise<void> {
  const identifier = `${EMAIL_VERIFY_PREFIX}${normalizedEmail}`;
  await prisma.verificationToken.deleteMany({ where: { identifier } });

  const rawToken = generateRawToken();
  await prisma.verificationToken.create({
    data: { identifier, token: hashToken(rawToken), expires: new Date(Date.now() + EMAIL_VERIFY_TTL_MS) },
  });

  const verifyUrl = `${site.url}/verify-email?token=${rawToken}&email=${encodeURIComponent(normalizedEmail)}`;
  await sendEmail({
    to: normalizedEmail,
    subject: "Verify your email for ClauseLens",
    html: `<p>Confirm your email address to unlock contract analysis on ClauseLens.</p><p><a href="${verifyUrl}">${verifyUrl}</a></p><p>This link expires in 24 hours. If you didn't create this account, you can safely ignore this email.</p>`,
  });
}

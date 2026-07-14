import { NextResponse } from "next/server";
import { z } from "zod";
import { sendEmail } from "@/lib/email";
import { checkRateLimit, rateLimitResponse, getClientIp } from "@/lib/rate-limit";

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().trim().email(),
  message: z.string().min(1).max(5000),
});

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: Request) {
  const ip = getClientIp(req.headers);
  const rate = await checkRateLimit("contact", ip);
  if (!rate.success) return rateLimitResponse(rate, "Too many messages sent. Please try again later.");

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  const { name, email, message } = parsed.data;

  await sendEmail({
    to: "support@clauselens.org",
    subject: `New contact form message from ${escapeHtml(name)}`,
    html: `<p><strong>From:</strong> ${escapeHtml(name)} (${escapeHtml(email)})</p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
  });

  return NextResponse.json({ ok: true });
}

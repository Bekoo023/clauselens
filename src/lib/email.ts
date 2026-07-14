import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * Sends a transactional email via Resend. Falls back to a console log when
 * RESEND_API_KEY isn't configured, so local dev and unconfigured deploys
 * don't crash — just note that nothing is actually delivered until it's set.
 */
export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (!resend) {
    console.info(`[email] RESEND_API_KEY not set — skipping send. Would have sent "${subject}" to ${to}.`);
    return;
  }
  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "ClauseLens <noreply@clauselens.org>",
    to,
    subject,
    html,
  });
}

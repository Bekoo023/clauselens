import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

// Structured shape the model must return
export const analysisSchema = z.object({
  riskScore: z.number().min(0).max(100),
  summary: z.string(),
  clauses: z.array(
    z.object({
      title: z.string(),
      excerpt: z.string(),
      risk: z.enum(["low", "medium", "high"]),
      explanation: z.string(),
      negotiationTip: z.string(),
    })
  ),
  missingClauses: z.array(
    z.object({ title: z.string(), whyItMatters: z.string() })
  ),
  // Only present when the user has playbook rules configured (Business plan)
  playbookChecks: z
    .array(
      z.object({
        rule: z.string(),
        status: z.enum(["followed", "violated"]),
        note: z.string(),
      })
    )
    .optional(),
});

export type ContractAnalysis = z.infer<typeof analysisSchema>;

const SYSTEM_PROMPT = `You are a contract analyst for non-lawyers (freelancers, agencies, startup founders).
Analyze the contract and respond ONLY with valid JSON matching this TypeScript type, no markdown fences, no preamble:

{
  "riskScore": number,          // 0 (safe) to 100 (very risky) for the signing party
  "summary": string,            // 2-3 plain-language sentences
  "clauses": [{
    "title": string,            // e.g. "Unlimited liability"
    "excerpt": string,          // short verbatim quote from the contract (max 25 words)
    "risk": "low"|"medium"|"high",
    "explanation": string,      // plain language, no jargon
    "negotiationTip": string    // one concrete counter-proposal
  }],
  "missingClauses": [{ "title": string, "whyItMatters": string }],
  "playbookChecks": [{ "rule": string, "status": "followed"|"violated", "note": string }]
    // one entry per playbook rule listed below, in the same order — omit this field entirely if no playbook rules are given
}

Focus on: liability, payment terms, IP ownership, termination, non-compete, indemnification, auto-renewal, jurisdiction.
This is informational analysis, not legal advice.`;

export async function analyzeContract(
  contractText: string,
  options?: { contractType?: string; perspective?: string; playbookRules?: string[] }
): Promise<ContractAnalysis> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const context: string[] = [];
  if (options?.contractType) context.push(`Contract type: ${options.contractType}.`);
  if (options?.perspective) context.push(`The user's role in this contract: ${options.perspective}. Score risk from THEIR side.`);
  if (options?.playbookRules?.length) {
    context.push(
      `The user's playbook — their own red lines. Check the contract against each one and report it in "playbookChecks":\n${options.playbookRules
        .map((r, i) => `${i + 1}. ${r}`)
        .join("\n")}`
    );
  }

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4000,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `${context.length ? context.join(" ") + "\n\n" : ""}Analyze this contract:\n\n${contractText.slice(0, 60_000)}`,
      },
    ],
  });

  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .replace(/```json|```/g, "")
    .trim();

  return analysisSchema.parse(JSON.parse(text));
}

const NEGOTIATION_SYSTEM_PROMPT = `You draft professional negotiation emails for non-lawyers based on a contract analysis.
Write a complete, ready-to-send email to the counterparty requesting specific changes.
Rules:
- Friendly but firm, collaborative tone ("to make this work for both of us")
- Reference the 2-4 highest-risk clauses with a concrete counter-proposal for each
- Short paragraphs, no legalese, no bullet-point dump — it must read like a human wrote it
- Include a subject line on the first line as "Subject: ..."
- Do NOT mention AI, ClauseLens, or that an analysis tool was used
- Respond with the email text only, no preamble or commentary`;

export async function draftNegotiationEmail(
  contractTitle: string,
  analysis: ContractAnalysis
): Promise<string> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1200,
    system: NEGOTIATION_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Contract: "${contractTitle}"\nRisk score: ${analysis.riskScore}/100\nSummary: ${analysis.summary}\n\nFlagged clauses:\n${analysis.clauses
          .map((c) => `- [${c.risk}] ${c.title}: ${c.explanation} Suggested counter: ${c.negotiationTip}`)
          .join("\n")}\n\nDraft the negotiation email.`,
      },
    ],
  });

  return message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
}

export function riskLevelFromScore(score: number): "LOW" | "MEDIUM" | "HIGH" {
  if (score < 34) return "LOW";
  if (score < 67) return "MEDIUM";
  return "HIGH";
}

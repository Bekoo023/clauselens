import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { detectFileKind, assertSafeDocx, UnsafeDocxError } from "@/lib/document-safety";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB upload
const MAX_PDF_PAGES = 300;
const MAX_EXTRACTED_CHARS = 2_000_000; // hard backstop against runaway/zip-bomb output

// Extracts plain text from an uploaded contract file (PDF, DOCX, or TXT).
// The file itself is never stored: only the extracted text travels onward,
// and it's read straight into memory (no temp files touch disk, and the
// filename is only ever used to pick a parser / for display, never as a path).
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rate = await checkRateLimit("extract", session.user.id);
  if (!rate.success) {
    return rateLimitResponse(rate, "Too many uploads. Please wait a moment and try again.");
  }

  const formData = await req.formData().catch(() => null);
  const file = formData?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "The uploaded file is empty." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 10 MB)." }, { status: 413 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const kind = detectFileKind(buffer, file.name, file.type);
  if (!kind) {
    return NextResponse.json(
      { error: "Unsupported or unrecognized file. Upload a genuine PDF, DOCX, or plain text file." },
      { status: 415 }
    );
  }

  try {
    let text = "";

    if (kind === "pdf") {
      const { extractText, getDocumentProxy } = await import("unpdf");
      const pdf = await getDocumentProxy(new Uint8Array(buffer));
      if (pdf.numPages > MAX_PDF_PAGES) {
        return NextResponse.json({ error: `This PDF has too many pages (max ${MAX_PDF_PAGES}).` }, { status: 413 });
      }
      const result = await extractText(pdf, { mergePages: true });
      text = result.text;
    } else if (kind === "docx") {
      await assertSafeDocx(buffer);
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else {
      text = buffer.toString("utf-8");
    }

    text = text.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();

    if (text.length > MAX_EXTRACTED_CHARS) {
      return NextResponse.json({ error: "This document is too large once its text is extracted." }, { status: 413 });
    }
    if (text.length < 100) {
      return NextResponse.json(
        { error: "Could not extract readable text. If this is a scanned PDF, paste the text manually." },
        { status: 422 }
      );
    }

    return NextResponse.json({ text, characters: text.length });
  } catch (err) {
    if (err instanceof UnsafeDocxError) {
      return NextResponse.json({ error: err.message }, { status: 422 });
    }
    console.error("Extraction failed:", err instanceof Error ? err.name : "unknown error");
    return NextResponse.json({ error: "Failed to read the file. Try pasting the text instead." }, { status: 500 });
  }
}

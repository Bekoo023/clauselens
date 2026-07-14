import JSZip from "jszip";

export type FileKind = "pdf" | "docx" | "text";

const PDF_MAGIC = "%PDF-";

/**
 * Identifies the real file type from magic bytes (not just the extension or
 * browser-supplied MIME type, both of which are trivially spoofable) and
 * confirms it matches what the filename/extension claims to be.
 * Returns null when the content doesn't match any explicitly supported format.
 */
export function detectFileKind(buffer: Buffer, filename: string, mimeType: string): FileKind | null {
  const name = filename.toLowerCase();
  const isPdfExt = name.endsWith(".pdf") || mimeType === "application/pdf";
  const isDocxExt = name.endsWith(".docx");
  const isTextExt = name.endsWith(".txt") || name.endsWith(".md") || mimeType.startsWith("text/");

  if (isPdfExt) {
    return isPdfMagic(buffer) ? "pdf" : null;
  }
  if (isDocxExt) {
    return isZipMagic(buffer) ? "docx" : null;
  }
  if (isTextExt) {
    return looksLikePlainText(buffer) ? "text" : null;
  }
  return null;
}

function isPdfMagic(buffer: Buffer): boolean {
  return buffer.length >= 5 && buffer.subarray(0, 5).toString("latin1") === PDF_MAGIC;
}

function isZipMagic(buffer: Buffer): boolean {
  if (buffer.length < 4 || buffer[0] !== 0x50 || buffer[1] !== 0x4b) return false;
  // PK\x03\x04 (local file header), PK\x05\x06 (empty archive), PK\x07\x08 (spanned archive)
  return (
    (buffer[2] === 0x03 && buffer[3] === 0x04) ||
    (buffer[2] === 0x05 && buffer[3] === 0x06) ||
    (buffer[2] === 0x07 && buffer[3] === 0x08)
  );
}

/** Rejects binary content masquerading as a .txt/.md upload (e.g. a NUL byte is never valid in text). */
export function looksLikePlainText(buffer: Buffer): boolean {
  const sampleLength = Math.min(buffer.length, 8000);
  let suspicious = 0;
  for (let i = 0; i < sampleLength; i++) {
    const byte = buffer[i];
    if (byte === 0) return false;
    // Control characters other than tab (9), LF (10), CR (13) are suspicious in real text.
    if (byte < 9 || (byte > 13 && byte < 32)) suspicious++;
  }
  return suspicious / Math.max(1, sampleLength) < 0.02;
}

export class UnsafeDocxError extends Error {}

const MAX_DOCX_ENTRIES = 2000;
const MAX_DOCX_UNCOMPRESSED_BYTES = 50 * 1024 * 1024; // 50 MB decompressed
const MAX_DOCX_COMPRESSION_RATIO = 100;

// JSZip's per-entry compressed/uncompressed size lives on an undocumented
// internal field. It's the only way to see a zip entry's size *before*
// paying the cost of decompressing it, which is the whole point of this
// check (a zip bomb is a tiny file that decompresses to gigabytes).
type ZipEntryInternal = { _data?: { compressedSize?: number; uncompressedSize?: number } };

/** Rejects a DOCX (zip) file that would decompress to an unreasonable size — a zip-bomb guard. */
export async function assertSafeDocx(buffer: Buffer): Promise<void> {
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(buffer);
  } catch {
    throw new UnsafeDocxError("This file doesn't look like a valid DOCX document.");
  }

  const entries = Object.values(zip.files);
  if (entries.length > MAX_DOCX_ENTRIES) {
    throw new UnsafeDocxError("This DOCX file has an unusually large number of internal parts and was rejected.");
  }

  let totalUncompressed = 0;
  for (const entry of entries) {
    const internal = (entry as unknown as ZipEntryInternal)._data;
    const uncompressedSize = internal?.uncompressedSize ?? 0;
    const compressedSize = internal?.compressedSize ?? 0;
    totalUncompressed += uncompressedSize;

    if (compressedSize > 0 && uncompressedSize / compressedSize > MAX_DOCX_COMPRESSION_RATIO) {
      throw new UnsafeDocxError("This DOCX file failed a safety check and was rejected.");
    }
    if (totalUncompressed > MAX_DOCX_UNCOMPRESSED_BYTES) {
      throw new UnsafeDocxError("This DOCX file is too large once decompressed and was rejected.");
    }
  }
}

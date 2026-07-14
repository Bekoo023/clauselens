import { describe, it, expect } from "vitest";
import JSZip from "jszip";
import { detectFileKind, assertSafeDocx, UnsafeDocxError, looksLikePlainText } from "@/lib/document-safety";

const PDF_HEADER = Buffer.from("%PDF-1.7\n%âãÏÓ\n");
const ZIP_HEADER = Buffer.from([0x50, 0x4b, 0x03, 0x04, 0, 0, 0, 0]);

describe("detectFileKind", () => {
  it("accepts a real PDF (magic bytes + extension match)", () => {
    expect(detectFileKind(PDF_HEADER, "contract.pdf", "application/pdf")).toBe("pdf");
  });

  it("rejects a .pdf file whose content isn't actually a PDF", () => {
    const fake = Buffer.from("this is just text pretending to be a pdf");
    expect(detectFileKind(fake, "contract.pdf", "application/pdf")).toBeNull();
  });

  it("accepts a real DOCX (zip magic bytes + extension match)", () => {
    expect(detectFileKind(ZIP_HEADER, "contract.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")).toBe("docx");
  });

  it("rejects a .docx file that isn't a zip", () => {
    const fake = Buffer.from("not a zip file");
    expect(detectFileKind(fake, "contract.docx", "application/octet-stream")).toBeNull();
  });

  it("accepts plain text for .txt", () => {
    const text = Buffer.from("This is a plain text contract.\nSecond line.");
    expect(detectFileKind(text, "contract.txt", "text/plain")).toBe("text");
  });

  it("rejects binary data disguised as .txt", () => {
    const binary = Buffer.from([0x00, 0x01, 0x02, 0x00, 0x03, 0x00, 0x04, 0xff, 0x00, 0x00]);
    expect(detectFileKind(binary, "contract.txt", "text/plain")).toBeNull();
  });

  it("rejects unsupported extensions entirely", () => {
    expect(detectFileKind(Buffer.from("MZ"), "malware.exe", "application/octet-stream")).toBeNull();
  });
});

describe("looksLikePlainText", () => {
  it("rejects a buffer containing a NUL byte", () => {
    expect(looksLikePlainText(Buffer.from([0x41, 0x00, 0x42]))).toBe(false);
  });

  it("accepts normal prose", () => {
    expect(looksLikePlainText(Buffer.from("Hello, this is a normal contract.\n\tIndented line."))).toBe(true);
  });
});

describe("assertSafeDocx", () => {
  it("accepts a small, normal DOCX-shaped zip", async () => {
    const zip = new JSZip();
    zip.file("word/document.xml", "<w:document>Hello world</w:document>");
    zip.file("[Content_Types].xml", "<Types/>");
    const buffer = await zip.generateAsync({ type: "nodebuffer" });

    await expect(assertSafeDocx(buffer)).resolves.toBeUndefined();
  });

  it("rejects a file that isn't a valid zip at all", async () => {
    await expect(assertSafeDocx(Buffer.from("not a zip"))).rejects.toBeInstanceOf(UnsafeDocxError);
  });

  it("rejects a zip bomb (extreme compression ratio)", async () => {
    const zip = new JSZip();
    // Highly repetitive content compresses extremely well — a stand-in for a
    // zip bomb without actually generating gigabytes of data in the test.
    const bomb = "A".repeat(5_000_000);
    zip.file("word/document.xml", bomb, { compression: "DEFLATE", compressionOptions: { level: 9 } });
    const buffer = await zip.generateAsync({ type: "nodebuffer" });

    await expect(assertSafeDocx(buffer)).rejects.toBeInstanceOf(UnsafeDocxError);
  });
});

/** Browser-only: extracts plain text from PDF, DOCX, TXT/MD resumes. */
export async function extractResumeText(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  if (file.size > 10 * 1024 * 1024) throw new Error("File is too large. Please upload a resume under 10 MB.");

  if (name.endsWith(".pdf") || file.type === "application/pdf") {
    const pdfjs = await import("pdfjs-dist");
    const worker = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
    pdfjs.GlobalWorkerOptions.workerSrc = worker;
    const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
    const pages: string[] = [];
    for (let i = 1; i <= Math.min(doc.numPages, 15); i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      pages.push(content.items.map((it) => ("str" in it ? it.str : "")).join(" "));
    }
    const text = pages.join("\n\n").replace(/[ \t]+/g, " ").trim();
    if (text.length < 30) throw new Error("This PDF looks like a scanned image with no readable text. Please upload a text-based PDF or DOCX.");
    return text;
  }

  if (name.endsWith(".docx")) {
    const mammoth = await import("mammoth");
    const { value } = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    return value.trim();
  }

  if (name.endsWith(".doc")) throw new Error("Old .doc files aren't supported. Please save it as .docx or PDF.");

  if (/\.(txt|md|rtf)$/.test(name) || file.type.startsWith("text/")) return (await file.text()).trim();

  throw new Error("Unsupported file. Please upload a PDF, DOCX or TXT resume.");
}

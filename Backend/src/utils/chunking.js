import { Document } from "@langchain/core/documents";

export async function chunkDocs(
  docs
) {
  const chunkSize = 1000;
  const chunkOverlap = 200;
  const chunks = [];

  for (const doc of docs) {
    const text = doc.pageContent || "";
    let start = 0;

    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);
      const pageContent = text.slice(start, end).trim();

      if (pageContent) {
        chunks.push(new Document({
          pageContent,
          metadata: {
            ...doc.metadata,
            chunkStart: start,
            chunkEnd: end,
          },
        }));
      }

      if (end === text.length) {
        break;
      }

      start = Math.max(end - chunkOverlap, start + 1);
    }
  }

  return chunks;
}

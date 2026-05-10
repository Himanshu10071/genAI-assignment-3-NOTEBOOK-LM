import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import path from "node:path";

export async function getCollectionNameForFile(filePath, originalName) {
  const displayName = originalName || path.basename(filePath);
  const slug = path
    .basename(displayName, path.extname(displayName))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 40) || "document";

  const hash = await hashFile(filePath);
  return `doc_${slug}_${hash.slice(0, 12)}`;
}

function hashFile(filePath) {
  return new Promise((resolve, reject) => {
    const hash = createHash("sha256");
    const stream = createReadStream(filePath);

    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(hash.digest("hex")));
  });
}

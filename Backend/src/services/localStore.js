import fs from "node:fs/promises";
import path from "node:path";
import { Document } from "@langchain/core/documents";
import { embeddings, embeddingModel, localStoreDir } from "../config/db.js";

const storeRoot = path.resolve(localStoreDir);

async function ensureStoreDir() {
  await fs.mkdir(storeRoot, { recursive: true });
}

function collectionPath(collectionName) {
  return path.join(storeRoot, `${collectionName}.json`);
}

async function readCollectionFile(collectionName) {
  await ensureStoreDir();
  const filePath = collectionPath(collectionName);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

async function writeCollectionFile(collectionName, payload) {
  await ensureStoreDir();
  const filePath = collectionPath(collectionName);
  await fs.writeFile(filePath, JSON.stringify(payload), "utf8");
}

function cosineSimilarity(vectorA, vectorB) {
  const length = Math.min(vectorA.length, vectorB.length);
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < length; i += 1) {
    const a = vectorA[i] || 0;
    const b = vectorB[i] || 0;
    dot += a * b;
    normA += a * a;
    normB += b * b;
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function resetLocalCollection(collectionName) {
  await ensureStoreDir();
  const filePath = collectionPath(collectionName);
  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
}

export async function storeChunks(collectionName, chunks) {
  const texts = chunks.map((chunk) => chunk.pageContent || "");
  const embeddingsList = texts.length > 0
    ? await embeddings.embedDocuments(texts)
    : [];

  const vectors = chunks.map((chunk, index) => ({
    id: `${collectionName}_${index}`,
    embedding: embeddingsList[index] || [],
    pageContent: chunk.pageContent || "",
    metadata: chunk.metadata || {},
  }));

  await writeCollectionFile(collectionName, {
    collectionName,
    embeddingModel,
    createdAt: new Date().toISOString(),
    vectors,
  });

  return { totalVectors: vectors.length };
}

export async function retrieveTopK(query, collectionName, k = 4) {
  const stored = await readCollectionFile(collectionName);
  if (!stored || !Array.isArray(stored.vectors) || stored.vectors.length === 0) {
    return [];
  }

  const queryEmbedding = await embeddings.embedQuery(query);
  const scored = stored.vectors.map((item) => ({
    score: cosineSimilarity(queryEmbedding, item.embedding || []),
    doc: new Document({
      pageContent: item.pageContent || "",
      metadata: item.metadata || {},
    }),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k).map((item) => item.doc);
}

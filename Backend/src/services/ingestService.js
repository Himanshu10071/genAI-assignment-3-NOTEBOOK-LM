import {QdrantVectorStore} from "@langchain/qdrant"
import { client, embeddings , qdrantConfig } from "../config/db.js"
import { loadDocument } from "./DocumentLoader.js"
import { chunkDocs } from "../utils/chunking.js"
import { getCollectionNameForFile } from "../utils/collectionName.js";

export async function  ingestDocument(filePath, options = {}) {

    // doc --> chuncks -- embedding 
    const collectionName = await getCollectionNameForFile(
        filePath,
        options.originalName
    );
    console.log(`[Ingest] Loading document from: ${filePath}`);
    const docs = await loadDocument(filePath);
    console.log(`[Ingest] Loaded ${docs.length} pages/parts`);

    const docsWithMetadata = docs.map((doc) => ({
        ...doc,
        metadata: {
            ...doc.metadata,
            originalName: options.originalName,
            collectionName,
        },
    }));

    const chunks = await chunkDocs(docsWithMetadata);
    console.log(`[Ingest] Generated ${chunks.length} chunks for vectorization`);

    console.log(`[Ingest] Resetting collection: ${collectionName}`);
    await resetCollection(collectionName);

    console.log(`[Ingest] Creating embeddings and pushing to Qdrant...`);
    await QdrantVectorStore.fromDocuments(chunks, embeddings, {
        ...qdrantConfig,
        collectionName,
    });

    console.log(`[Ingest] Successfully vectorized document: ${collectionName}`);
    return { success : true , collectionName, totalChunks : chunks.length,};

    
}

async function resetCollection(collectionName) {
    const { exists } = await client.collectionExists(collectionName);

    if (exists) {
        await client.deleteCollection(collectionName);
    }

    await client.createCollection(collectionName, {
        vectors: {
            size: 1536,
            distance: "Cosine",
        },
    });
}

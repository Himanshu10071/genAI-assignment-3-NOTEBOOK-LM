import { loadDocument } from "./DocumentLoader.js";
import { chunkDocs } from "../utils/chunking.js";
import { getCollectionNameForFile } from "../utils/collectionName.js";
import { resetLocalCollection, storeChunks } from "./localStore.js";

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

    console.log(`[Ingest] Resetting local collection: ${collectionName}`);
    await resetLocalCollection(collectionName);

    console.log(`[Ingest] Creating embeddings and storing locally...`);
    await storeChunks(collectionName, chunks);

    console.log(`[Ingest] Successfully stored document: ${collectionName}`);
    return { success : true , collectionName, totalChunks : chunks.length,};

    
}


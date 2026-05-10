import { QdrantVectorStore } from "@langchain/qdrant";

import { embeddings , qdrantConfig } from "../config/db.js";

export async function  retrieveChunks(query, collectionName) {
    if (!collectionName || typeof collectionName !== "string") {
        throw new Error("collectionName is required");
    }

    const vectorStore =  await QdrantVectorStore.fromExistingCollection(embeddings,{
        ...qdrantConfig,
        collectionName,
    });
    const retriever = vectorStore.asRetriever({k:4});
    return await retriever.invoke(query);
}

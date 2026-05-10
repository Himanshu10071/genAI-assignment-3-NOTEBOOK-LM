import { retrieveTopK } from "./localStore.js";

export async function  retrieveChunks(query, collectionName) {
    if (!collectionName || typeof collectionName !== "string") {
        throw new Error("collectionName is required");
    }

    return await retrieveTopK(query, collectionName, 4);
}

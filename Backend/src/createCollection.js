import "dotenv/config";

import { client }
from "./config/db.js";

async function createCollection() {

  try {
    const collectionName = process.env.COLLECTION_NAME;

    if (!collectionName) {
      throw new Error("COLLECTION_NAME is required");
    }

    const { exists } = await client.collectionExists(collectionName);

    if (exists) {
      console.log("Collection already exists");
      return;
    }

    await client.createCollection(
      collectionName,
      {
        vectors: {
          size: 1536,
          distance: "Cosine",
        },
      }
    );

    console.log(
      "Collection Created"
    );

  }

  catch (error) {

    console.error(error.message);
    process.exitCode = 1;
  }
}

createCollection();

import "dotenv/config";

import { QdrantClient }
from "@qdrant/js-client-rest";

import { OpenAIEmbeddings }
from "@langchain/openai";

export const client =
  new QdrantClient({
    url:
      process.env.QDRANT_URL,

    apiKey:
      process.env.QDRANT_API_KEY,

    checkCompatibility:
      false,
  });

export const embeddings =
  new OpenAIEmbeddings({

    apiKey:
      process.env.OPENROUTER_API_KEY,

    model:
      "openai/text-embedding-3-small",

    configuration: {
      baseURL:
        "https://openrouter.ai/api/v1",
    },
  });

export const qdrantConfig = {

  url:
    process.env.QDRANT_URL,

  apiKey:
    process.env.QDRANT_API_KEY,

  checkCompatibility:
    false,

  collectionName:
    process.env.COLLECTION_NAME,
};

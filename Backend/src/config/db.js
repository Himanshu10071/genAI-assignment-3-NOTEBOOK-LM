import "dotenv/config";

import { OpenAIEmbeddings }
from "@langchain/openai";

export const embeddingModel =
  process.env.EMBEDDING_MODEL
  || "openai/text-embedding-3-small";

export const embeddings =
  new OpenAIEmbeddings({

    apiKey:
      process.env.OPENROUTER_API_KEY,

    model:
      embeddingModel,

    configuration: {
      baseURL:
        "https://openrouter.ai/api/v1",
    },
  });

export const localStoreDir =
  process.env.LOCAL_STORE_DIR
  || "local_store";

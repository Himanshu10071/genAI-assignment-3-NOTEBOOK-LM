import "dotenv/config";

import OpenAI from "openai";

let openrouter;

export function getOpenRouterClient() {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is required");
  }

  if (!openrouter) {
    openrouter = new OpenAI({
      baseURL:
        "https://openrouter.ai/api/v1",

      apiKey:
        process.env.OPENROUTER_API_KEY,
    });
  }

  return openrouter;
}

export function getOpenRouterModel() {
  if (!process.env.MODEL) {
    throw new Error("MODEL is required");
  }

  return process.env.MODEL;
}

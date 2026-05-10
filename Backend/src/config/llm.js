import "dotenv/config";

import OpenAI from "openai";

let openrouter;

const DEFAULT_FALLBACK_MODELS = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "google/gemma-2-9b-it:free",
  "nvidia/llama-3.1-nemotron-70b-instruct:free",
  "moonshotai/kimi-k2:free",
];

function normalizeModel(value) {
  if (!value || typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function parseModelList(value) {
  if (!value || typeof value !== "string") {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

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

export function getOpenRouterModels(requestedModel) {
  const requested = normalizeModel(requestedModel);
  const primary = normalizeModel(process.env.MODEL);
  const fallbacks = parseModelList(process.env.MODEL_FALLBACKS);

  let models = [];
  if (primary) {
    models.push(primary);
  }
  if (fallbacks.length > 0) {
    models = models.concat(fallbacks);
  }
  if (models.length === 0) {
    models = DEFAULT_FALLBACK_MODELS.slice();
  }
  if (requested) {
    models.unshift(requested);
  }

  const uniqueModels = [];
  const seen = new Set();
  for (const model of models) {
    if (!seen.has(model)) {
      uniqueModels.push(model);
      seen.add(model);
    }
  }

  if (uniqueModels.length === 0) {
    throw new Error("No OpenRouter models configured");
  }

  return uniqueModels;
}

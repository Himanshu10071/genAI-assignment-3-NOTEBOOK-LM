import { retrieveChunks } from "../services/retrievalService.js";

import { generateAnswer } from "../services/llmService.js";

export async function  askQuestion(req,res) {
    try {
    const { question, collectionName } = req.body;
    if (!question || typeof question !== "string") {
      return res.status(400).json({
        success: false,
        error: "Question is required",
      });
    }

    console.log(`[Chat] Incoming question for collection: ${collectionName || "default"}`);
    console.log(`[Chat] Query: "${question}"`);

    let chunks = [];
    try {
      if (collectionName) {
        chunks = await retrieveChunks(question, collectionName);
        console.log(`[Chat] Retrieved ${chunks.length} relevant chunks`);
      }
    } catch (error) {
      console.log("[Chat Warning] Retrieval failed:", error.message);
      // Continue without chunks (for greetings/general talk)
    }

    const answer = await generateAnswer(question, chunks);
    console.log(`[Chat] Answer generated successfully`);

    res.status(200).json({
      success: true,
      collectionName: collectionName || "default",
      answer,
      source: chunks,
    });
    }
    catch (error){
        res.status(500).json({
      success: false,
      error:
        error.message,
    });
    }
}

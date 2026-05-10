import { getOpenRouterClient, getOpenRouterModel } from "../config/llm.js";

export async function generateAnswer(question, chunks) {
  const openrouter = getOpenRouterClient();
  const model = getOpenRouterModel();
  
  const context = chunks && chunks.length > 0 
    ? chunks.map((chunk) => chunk.pageContent).join("\n\n")
    : "No document context available.";

  const response = await openrouter.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content: `You are NOTEBOOK LM, a professional AI research assistant inspired by NotebookLM. 
        Your goal is to provide accurate, grounded answers based ONLY on the provided context.

        RULES:
        1. GREETINGS: If the user says "hi", "hello", or similar greetings, respond warmly and ask how you can help with their research.
        2. GROUNDING: For research questions, use ONLY the provided context. Do not use outside knowledge.
        3. CITATIONS: You MUST cite the source of your information using [number] format (e.g., [1], [2]) corresponding to the chunks provided.
        4. OUT OF CONTEXT: If a question is NOT related to the context and is NOT a greeting, politely inform the user that you are grounded in the document and cannot answer general knowledge questions outside its scope.
        5. UNCERTAINTY: If the answer is not in the context, say: "I'm sorry, but I couldn't find information about that in the uploaded document."
        6. FORMATTING: Use professional, editorial-style language. Use bullet points for complex lists.

        Context:
        ${context}`,
      },
      { role: "user", content: question },
    ],
  });

  const answer = response.choices[0].message.content;
  console.log(`[LLM Response] Answer generated (${answer.length} chars)`);
  return answer;
}

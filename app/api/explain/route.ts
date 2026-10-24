import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return Response.json(
      { error: "The server is missing its GEMINI_API_KEY." },
      { status: 500 }
    );
  }

  const { question, cedis, target, converted } = await req.json();

  if (typeof question !== "string" || !question.trim()) {
    return Response.json({ error: "Type a question first." }, { status: 400 });
  }
  if (question.length > 200) {
    return Response.json(
      { error: "Keep your question under 200 characters." },
      { status: 400 }
    );
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const prompt = `You are a money helper for people in Ghana.
GH₵ ${cedis} is about ${converted} (${target}) at a live exchange rate.
Only answer questions about money and what this amount can buy. For anything else, say you can only help with money questions.
Reply in at most 3 short sentences. You don't have live prices, so say when you are estimating.

Question: ${question}`;

  try {
    const stream = await ai.models.generateContentStream({
      model: "gemma-4-26b-a4b-it",
      contents: prompt,
      config: { maxOutputTokens: 300, temperature: 0.4 },
    });

    const encoder = new TextEncoder();
    const body = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.text) controller.enqueue(encoder.encode(chunk.text));
          }
        } catch {
          controller.enqueue(encoder.encode("\n\n(Gemma stopped early. Try again.)"));
        }
        controller.close();
      },
    });

    return new Response(body, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch {
    return Response.json(
      { error: "Gemma couldn't answer right now. Try again in a moment." },
      { status: 500 }
    );
  }
}
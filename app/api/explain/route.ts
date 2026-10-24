import { GoogleGenAI, type GenerateContentResponse } from "@google/genai";

export const maxDuration = 60;

const MODELS = ["gemma-4-26b-a4b-it", "gemma-4-31b-it"];
const START_TIMEOUT_MS = 15000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

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

  let iterator: AsyncGenerator<GenerateContentResponse> | undefined;
  let first: IteratorResult<GenerateContentResponse> | undefined;

  for (const model of MODELS) {
    try {
      const stream = await withTimeout(
        ai.models.generateContentStream({ model, contents: prompt }),
        START_TIMEOUT_MS
      );
      const it = stream[Symbol.asyncIterator]();
      first = await withTimeout(it.next(), START_TIMEOUT_MS);
      iterator = it;
      break;
    } catch (err) {
      console.error(`Gemma error (${model}):`, err);
    }
  }

  if (!iterator || !first) {
    return Response.json(
      { error: "Gemma is slow or unavailable on Google's side. Try again in a minute." },
      { status: 502 }
    );
  }

  const encoder = new TextEncoder();
  const body = new ReadableStream({
    async start(controller) {
      try {
        if (!first.done && first.value?.text) {
          controller.enqueue(encoder.encode(first.value.text));
        }
        if (!first.done) {
          while (true) {
            const result = await iterator.next();
            if (result.done) break;
            if (result.value.text) {
              controller.enqueue(encoder.encode(result.value.text));
            }
          }
        }
      } catch (err) {
        console.error("Gemma stream error:", err);
        controller.enqueue(encoder.encode("\n\n(Gemma stopped early. Try again.)"));
      }
      controller.close();
    },
  });

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
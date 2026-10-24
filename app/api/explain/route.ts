import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  const { question, cedis, rate, usd } = await req.json();

  if (!question) {
    return NextResponse.json({ error: "Type a question first." }, { status: 400 });
  }

  const prompt = `You are a friendly money helper for people in Ghana.
The user converted GH₵ ${cedis} to about $${usd} USD at a rate of GH₵ ${rate} per $1.
Answer their question in 3-4 short, plain sentences. If you are guessing prices, say they are rough estimates.

Question: ${question}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemma-4-26b-a4b-it",
      contents: prompt,
    });
    return NextResponse.json({ answer: response.text });
  } catch {
    return NextResponse.json(
      { error: "Gemma couldn't answer right now. Try again." },
      { status: 500 }
    );
  }
}
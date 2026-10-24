# Cedi Converter

A small web app that converts Ghana cedis (GH₵) to other currencies using a live exchange rate, with a box where you can ask Gemma 4 what the amount could buy.

Built at the KNUST Hacktoberfest Hack Day (MLH x WikiTech) 2026.

## Why I built it
It was a fun idea I wanted to bring to life.

## What it does
- Converts GH₵ to USD, GBP, EUR, NGN, CAD and CNY using live rates from open.er-api.com
- "Ask Gemma 4" panel with quick questions and a free-text box
- Gemma's answer streams in as it is generated
- If Gemma is slow or fails, the app retries and falls back to the larger Gemma 4 model

## Built with
Next.js, TypeScript, React, Tailwind CSS, Gemma 4 (gemma-4-26b-a4b-it and gemma-4-31b-it) through the Gemini API

## Run it yourself
1. Clone the repo and run `npm install`
2. Get a free API key at aistudio.google.com
3. Create a `.env.local` file with `GEMINI_API_KEY=your-key`
4. Run `npm run dev` and open http://localhost:3000

## Known limits
Gemma answers can be slow or fail when the API is busy. Answers are rough estimates, not financial advice.

## What I learned
This was my first hackathon. 
I learned how to call an AI model from a Next.js server route so the API key stays private, and how to stream the answer back to the page. I also learned that outside APIs can be slow or fail, so the app needs timeouts, retries and a clear error message. Splitting the code into small components and a hook made it much easier to change.
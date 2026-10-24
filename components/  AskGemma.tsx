"use client";

import { useState } from "react";

const QUICK_QUESTIONS = [
  "What could I buy with this?",
  "Is this enough for a flight ticket?",
  "Explain this amount like I'm 12",
];

type Props = {
  cedis: string;
  target: string;
  converted: string | null;
};

export default function AskGemma({ cedis, target, converted }: Props) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const disabled = !converted;

  async function ask(q: string) {
    if (!q.trim() || loading || !converted) return;
    setQuestion(q);
    setLoading(true);
    setAnswer("");

    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, cedis, target, converted }),
      });
      const data = await res.json();
      setAnswer(data.answer || data.error || "No answer came back.");
    } catch {
      setAnswer("Something went wrong. Check your connection.");
    }

    setLoading(false);
  }

  return (
    <section className="flex flex-col rounded-3xl bg-white p-6 shadow-xl ring-1 ring-black/5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold">Ask Gemma 4</h2>
        <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-neutral-600">
          Open-weight AI
        </span>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {QUICK_QUESTIONS.map((q) => (
          <button
            key={q}
            type="button"
            disabled={loading || disabled}
            onClick={() => ask(q)}
            className="rounded-full border border-green-800 px-3 py-1.5 text-xs font-medium text-green-800 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {q}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={question}
          maxLength={200}
          disabled={disabled}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && ask(question)}
          placeholder={disabled ? "Enter an amount first..." : "Or type your own question..."}
          className="min-w-0 flex-1 rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-neutral-900 outline-none focus:border-green-700 focus:ring-4 focus:ring-green-700/15 disabled:bg-stone-50"
        />
        <button
          type="button"
          disabled={loading || disabled || !question.trim()}
          onClick={() => ask(question)}
          className="rounded-xl bg-green-800 px-5 py-2.5 font-semibold text-white transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </div>

      <div className="mt-4 min-h-32 flex-1 overflow-y-auto lg:max-h-64">
        {loading && (
          <div className="space-y-2" aria-label="Gemma is thinking">
            <div className="h-3 w-full animate-pulse rounded bg-stone-200" />
            <div className="h-3 w-5/6 animate-pulse rounded bg-stone-200" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-stone-200" />
          </div>
        )}

        {!loading && answer && (
          <div className="whitespace-pre-wrap rounded-2xl bg-amber-50 p-4 leading-relaxed text-neutral-800 ring-1 ring-amber-200">
            {answer}
          </div>
        )}

        {!loading && !answer && (
          <p className="rounded-2xl border border-dashed border-stone-300 p-4 text-sm text-neutral-500">
            {disabled
              ? "Convert an amount on the left, then ask Gemma what it means."
              : "Pick a question above or type your own."}
          </p>
        )}
      </div>
    </section>
  );
}
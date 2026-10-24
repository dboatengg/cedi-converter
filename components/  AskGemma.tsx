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
    <section className="flex flex-col rounded-lg border border-stone-300 bg-white p-6">
      <h2 className="text-sm font-medium">Ask Gemma 4</h2>
      <p className="mt-1 text-sm text-stone-600">
        Ask what this amount could pay for.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {QUICK_QUESTIONS.map((q) => (
          <button
            key={q}
            type="button"
            disabled={loading || disabled}
            onClick={() => ask(q)}
            className="rounded-md border border-stone-300 px-2.5 py-1 text-sm hover:border-stone-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-stone-300"
          >
            {q}
          </button>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          value={question}
          maxLength={200}
          disabled={disabled}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && ask(question)}
          placeholder={disabled ? "Enter an amount first" : "Type your own question"}
          className="min-w-0 flex-1 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-stone-900 disabled:bg-stone-50"
        />
        <button
          type="button"
          disabled={loading || disabled || !question.trim()}
          onClick={() => ask(question)}
          className="rounded-md bg-green-900 px-4 py-2 text-sm font-medium text-white hover:bg-green-950 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Asking..." : "Ask"}
        </button>
      </div>

      <div className="mt-4 min-h-28 flex-1 overflow-y-auto lg:max-h-64">
        {loading && <p className="text-sm text-stone-500">Waiting for Gemma...</p>}

        {!loading && answer && (
          <p className="whitespace-pre-wrap border-l-2 border-stone-900 pl-3 text-sm leading-relaxed">
            {answer}
          </p>
        )}

        {!loading && !answer && (
          <p className="text-sm text-stone-500">
            {disabled
              ? "Enter an amount on the left first."
              : "Pick a question or type your own."}
          </p>
        )}
      </div>
    </section>
  );
}
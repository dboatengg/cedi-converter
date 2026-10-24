"use client";

import { useEffect, useState } from "react";

const CURRENCIES = ["USD", "GBP", "EUR", "NGN"];

const QUICK_QUESTIONS = [
  "What could I buy with this?",
  "Is this enough for a flight ticket?",
  "Explain this amount like I'm 12",
];

const inputClass =
  "flex-1 min-w-0 rounded-lg border border-stone-300 bg-white px-3 py-2 text-base text-neutral-900";
const chipClass =
  "rounded-full border border-green-800 bg-white px-3 py-1.5 text-xs text-green-800 disabled:cursor-not-allowed disabled:opacity-50";
const buttonClass =
  "rounded-lg bg-green-800 px-4 py-2 text-base text-white disabled:cursor-not-allowed disabled:opacity-50";

export default function Home() {
  const [cedis, setCedis] = useState("");
  const [target, setTarget] = useState("USD");
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [rateError, setRateError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((res) => res.json())
      .then((data) => {
        if (!data.rates?.GHS) throw new Error("No GHS rate");
        setRates(data.rates);
        setRateError(false);
      })
      .catch(() => setRateError(true));
  }, [attempt]);

  const amount = Number(cedis);
  const perCedi = rates ? rates[target] / rates.GHS : null;
  const converted = perCedi && amount > 0 ? amount * perCedi : null;
  const formatted =
    converted !== null
      ? new Intl.NumberFormat("en-US", { style: "currency", currency: target }).format(converted)
      : "";

  async function ask(q: string) {
    if (!q.trim() || !formatted) return;
    setQuestion(q);
    setLoading(true);
    setAnswer("");
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, cedis, target, converted: formatted }),
      });
      const data = await res.json();
      setAnswer(data.answer || data.error || "No answer came back.");
    } catch {
      setAnswer("Something went wrong. Check your connection.");
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-start justify-center bg-stone-100 px-4 py-12 text-neutral-900">
      <main className="w-full max-w-md rounded-2xl bg-white p-7 shadow-lg">
        <h1 className="text-2xl font-bold">Cedi Converter</h1>
        <p className="mb-6 text-sm text-neutral-500">
          Convert GH₵ and ask Gemma 4 what it means.
        </p>

        <label className="mb-1.5 block text-sm font-semibold">Amount in GH₵</label>
        <div className="mb-4 flex gap-2">
          <input
            className={inputClass}
            type="number"
            min="0"
            value={cedis}
            onChange={(e) => setCedis(e.target.value)}
            placeholder="e.g. 500"
          />
          <select
            className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-base text-neutral-900"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {rateError && (
          <p className="my-2 text-sm text-red-700">
            Couldn&apos;t load the exchange rate.{" "}
            <button
              className={chipClass}
              onClick={() => {
                setRateError(false);
                setAttempt(attempt + 1);
              }}
            >
              Try again
            </button>
          </p>
        )}
        {!rates && !rateError && (
          <p className="text-sm text-neutral-500">Loading live rate...</p>
        )}

        {formatted && perCedi && (
          <div className="mt-2 rounded-xl bg-green-800 p-4 text-center text-white">
            <div className="text-3xl font-bold">{formatted}</div>
            <div className="text-xs opacity-85">
              1 GH₵ = {perCedi.toFixed(4)} {target} (live rate)
            </div>
          </div>
        )}

        {formatted && (
          <>
            <hr className="my-6 border-stone-200" />
            <label className="mb-1.5 block text-sm font-semibold">Ask Gemma 4</label>
            <div className="mb-3 flex flex-wrap gap-2">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  className={chipClass}
                  disabled={loading}
                  onClick={() => ask(q)}
                >
                  {q}
                </button>
              ))}
            </div>
            <div className="mb-4 flex gap-2">
              <input
                className={inputClass}
                value={question}
                maxLength={200}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && ask(question)}
                placeholder="Or type your own question..."
              />
              <button
                className={buttonClass}
                disabled={loading || !question.trim()}
                onClick={() => ask(question)}
              >
                {loading ? "Thinking..." : "Ask"}
              </button>
            </div>
            {answer && (
              <div className="whitespace-pre-wrap rounded-xl bg-stone-100 p-3.5 leading-relaxed">
                {answer}
              </div>
            )}
          </>
        )}

        <p className="mt-5 text-center text-xs text-neutral-400">
          Powered by Gemma 4 and live exchange rates
        </p>
      </main>
    </div>
  );
}
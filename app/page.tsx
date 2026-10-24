"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [cedis, setCedis] = useState("");
  const [rate, setRate] = useState("");
  const [status, setStatus] = useState("Loading live rate...");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((res) => res.json())
      .then((data) => {
        setRate(String(data.rates.GHS));
        setStatus("Live rate loaded");
      })
      .catch(() => setStatus("Couldn't load the rate. Type one in below."));
  }, []);

  const usd = Number(cedis) / Number(rate);
  const showResult = cedis !== "" && Number(rate) > 0;

  async function askGemma() {
    setLoading(true);
    setAnswer("");
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, cedis, rate, usd: usd.toFixed(2) }),
      });
      const data = await res.json();
      setAnswer(data.answer || data.error);
    } catch {
      setAnswer("Something went wrong. Check your connection.");
    }
    setLoading(false);
  }

  return (
    <main style={{ maxWidth: 400, margin: "60px auto", fontFamily: "sans-serif" }}>
      <h1>Cedi → USD Converter</h1>

      <label>Amount in GH₵</label>
      <input
        type="number"
        value={cedis}
        onChange={(e) => setCedis(e.target.value)}
        placeholder="e.g. 500"
        style={{ display: "block", width: "100%", padding: 8, marginBottom: 16 }}
      />

      <label>GH₵ per $1</label>
      <input
        type="number"
        value={rate}
        onChange={(e) => setRate(e.target.value)}
        style={{ display: "block", width: "100%", padding: 8, marginBottom: 8 }}
      />
      <small>{status}</small>

      {showResult && <h2>${usd.toFixed(2)} USD</h2>}

      {showResult && (
        <section style={{ marginTop: 24 }}>
          <h3>Ask Gemma 4</h3>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Is this enough for a week of groceries in the US?"
            style={{ display: "block", width: "100%", padding: 8, marginBottom: 8 }}
          />
          <button onClick={askGemma} disabled={loading || !question}>
            {loading ? "Thinking..." : "Ask"}
          </button>
          {answer && <p>{answer}</p>}
        </section>
      )}
    </main>
  );
}
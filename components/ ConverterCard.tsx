"use client";

import { useState } from "react";
import { useExchangeRates } from "@/hooks/useExchangeRates";
import { formatMoney } from "@/lib/format";
import type { CurrencyCode } from "@/lib/currencies";
import AmountInput from "./  AmountInput";
import CurrencyPicker from "./  CurrencyPicker";
import ResultCard from "./  ResultCard";
import AskGemma from "./  AskGemma";

export default function ConverterCard() {
  const [cedis, setCedis] = useState("");
  const [target, setTarget] = useState<CurrencyCode>("USD");
  const { rates, error, loading, retry } = useExchangeRates();

  const amount = Number(cedis);
  const perCedi = rates ? rates[target] / rates.GHS : null;
  const converted =
    perCedi !== null && amount > 0 ? formatMoney(amount * perCedi, target) : null;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="rounded-lg border border-stone-300 bg-white p-6">
        <AmountInput value={cedis} onChange={setCedis} />
        <CurrencyPicker value={target} onChange={setTarget} />
        <ResultCard
          converted={converted}
          perCedi={perCedi}
          target={target}
          loading={loading}
          error={error}
          onRetry={retry}
        />
      </section>

      <AskGemma cedis={cedis} target={target} converted={converted} />
    </div>
  );
}
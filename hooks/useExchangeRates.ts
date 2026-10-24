"use client";

import { useCallback, useEffect, useState } from "react";

const RATES_URL = "https://open.er-api.com/v6/latest/USD";

export function useExchangeRates() {
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetch(RATES_URL)
      .then((res) => res.json())
      .then((data) => {
        if (!data.rates?.GHS) throw new Error("No GHS rate");
        if (!cancelled) {
          setRates(data.rates);
          setError(false);
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = useCallback(() => {
    setError(false);
    setAttempt((a) => a + 1);
  }, []);

  return { rates, error, loading: !rates && !error, retry };
}
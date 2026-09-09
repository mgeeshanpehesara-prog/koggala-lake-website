"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Currency } from "@/lib/types";
import { convertPrice, formatPrice } from "@/lib/currency/currency";

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convertAmount: (amount: number, fromCurrency: Currency) => number;
  displayPrice: (amount: number, fromCurrency: Currency) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);
const STORAGE_KEY = "koggala-currency";

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("USD");
  const [rates, setRates] = useState<Record<string, number>>({ USD: 1 });

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) setCurrencyState(saved);
    fetch("/api/currency", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((data: { rates?: Record<string, number> } | null) => {
        if (data?.rates?.USD === 1) setRates(data.rates);
      })
      .catch(() => undefined);
  }, []);

  const setCurrency = (nextCurrency: Currency) => {
    setCurrencyState(nextCurrency);
    window.localStorage.setItem(STORAGE_KEY, nextCurrency);
  };

  const value = useMemo<CurrencyContextValue>(() => ({
    currency,
    setCurrency,
    convertAmount: (amount, fromCurrency) => rates[currency] && rates[fromCurrency]
      ? convertPrice(amount, fromCurrency, currency, rates)
      : amount,
    displayPrice: (amount, fromCurrency) => rates[currency] && rates[fromCurrency]
      ? formatPrice(convertPrice(amount, fromCurrency, currency, rates), currency)
      : formatPrice(amount, fromCurrency),
  }), [currency, rates]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used within a CurrencyProvider");
  return context;
}

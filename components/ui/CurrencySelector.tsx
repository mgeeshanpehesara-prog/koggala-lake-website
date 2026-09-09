"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ALL_CURRENCIES, POPULAR_CURRENCIES } from "@/lib/currency/currency";
import { useCurrency } from "@/lib/currency/CurrencyContext";
import { cn } from "@/lib/utils";

export default function CurrencySelector({ variant = "light" }: { variant?: "light" | "dark" }) {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const selected = ALL_CURRENCIES.find((option) => option.code === currency) || POPULAR_CURRENCIES[0];
  const filtered = useMemo(() => ALL_CURRENCIES.filter((option) => `${option.code} ${option.name}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const popular = filtered.filter((option) => POPULAR_CURRENCIES.some((popularOption) => popularOption.code === option.code));
  const other = filtered.filter((option) => !POPULAR_CURRENCIES.some((popularOption) => popularOption.code === option.code));

  useEffect(() => {
    const onClick = (event: MouseEvent) => { if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const choose = (code: string) => { setCurrency(code); setQuery(""); setOpen(false); };
  const option = (item: typeof ALL_CURRENCIES[number]) => <li key={item.code}><button type="button" onClick={() => choose(item.code)} className={cn("flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-sand-100 hover:bg-white/10", currency === item.code && "text-teal-400")}><span>{item.flag}</span><span className="font-semibold">{item.code}</span><span className="truncate text-sand-200/60">{item.name}</span></button></li>;

  return <div className="relative" ref={ref}>
    <button type="button" onClick={() => setOpen((value) => !value)} aria-haspopup="listbox" aria-expanded={open} className={cn("flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors", variant === "light" ? "text-sand-100 hover:bg-white/10" : "text-navy-900 hover:bg-navy-900/5")}>
      {selected.flag} {currency}<svg className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} viewBox="0 0 12 8" fill="none"><path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
    </button>
    {open && <div className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-xl2 border border-white/10 bg-navy-800/95 p-2 shadow-lift backdrop-blur-xl">
      <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search currencies..." className="mb-2 w-full rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-xs text-sand-50 outline-none placeholder:text-sand-200/40" />
      <ul role="listbox" className="max-h-80 overflow-y-auto">{popular.length > 0 && <li className="px-3 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-wider text-teal-400">Popular currencies</li>}{popular.map(option)}{other.length > 0 && <li className="px-3 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-wider text-teal-400">All currencies</li>}{other.map(option)}{popular.length === 0 && other.length === 0 && <li className="px-3 py-4 text-xs text-sand-200/50">No currencies found.</li>}</ul>
    </div>}
  </div>;
}

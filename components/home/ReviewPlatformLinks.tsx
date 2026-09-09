"use client";

import { useState } from "react";

type ReviewPlatformLinksProps = {
  platformName: string;
  links: string[];
  action: string;
};

export default function ReviewPlatformLinks({ platformName, links, action }: ReviewPlatformLinksProps) {
  const [open, setOpen] = useState(false);
  const validLinks = links.filter(Boolean);

  if (validLinks.length === 0) return <span className="mt-auto inline-flex text-sm text-sand-200/40">Reviews coming soon</span>;
  if (validLinks.length === 1) {
    return <a href={validLinks[0]} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center text-sm font-semibold text-teal-400 transition-colors hover:text-teal-300">{action}<Arrow /></a>;
  }

  return (
    <div className="relative mt-auto">
      <button type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open} className="inline-flex items-center text-sm font-semibold text-teal-400 transition-colors hover:text-teal-300">
        View Reviews <span className="ml-2 text-xs">({validLinks.length})</span><Chevron open={open} />
      </button>
      {open && <div className="absolute bottom-full left-0 z-10 mb-2 grid min-w-[220px] gap-1 rounded-xl2 border border-white/10 bg-navy-950 p-2 shadow-lift">{validLinks.map((link, index) => <a key={`${link}-${index}`} href={link} target="_blank" rel="noopener noreferrer" className="rounded-lg px-3 py-2 text-xs text-sand-100 transition-colors hover:bg-white/10 hover:text-teal-300">{platformName} link {index + 1}<Arrow /></a>)}</div>}
    </div>
  );
}

function Arrow() {
  return <svg viewBox="0 0 16 16" className="ml-2 inline-block h-4 w-4 fill-none stroke-current" strokeWidth="1.8" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function Chevron({ open }: { open: boolean }) {
  return <svg viewBox="0 0 16 16" className={`ml-2 inline-block h-4 w-4 fill-none stroke-current transition-transform ${open ? "rotate-180" : ""}`} strokeWidth="1.8" aria-hidden="true"><path d="m4 6 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

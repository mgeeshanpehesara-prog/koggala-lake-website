"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/experiences", label: "All Experiences" },
  { href: "/experiences/boat-safari", label: "Boat Safari" },
  { href: "/experiences/kayak", label: "Kayak" },
];

export default function CategoryTabs() {
  const pathname = usePathname();

  return (
    <div className="scroll-row flex gap-2 overflow-x-auto pb-1">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition-colors",
              active
                ? "bg-teal-500 text-navy-950"
                : "glass-panel text-sand-100 hover:bg-white/10"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}

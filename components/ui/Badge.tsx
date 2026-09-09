import { cn } from "@/lib/utils";

export default function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-gold-500/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-navy-950 shadow-soft",
        className
      )}
    >
      {children}
    </span>
  );
}

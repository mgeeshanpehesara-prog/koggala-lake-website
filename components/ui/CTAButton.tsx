import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

interface CTAButtonProps {
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-all duration-200 ease-premium select-none active:translate-y-[2px] disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950";

const sizes: Record<Size, string> = {
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

const variants: Record<Variant, string> = {
  primary:
    "press-button bg-gradient-to-b from-teal-300 via-teal-400 to-teal-600 text-navy-950 shadow-[0_7px_0_0_rgba(23,136,120,0.65),0_14px_28px_-10px_rgba(47,209,180,0.55)] hover:-translate-y-1 hover:shadow-[0_9px_0_0_rgba(23,136,120,0.65),0_20px_34px_-12px_rgba(47,209,180,0.48)] active:translate-y-[3px] active:shadow-[0_3px_0_0_rgba(23,136,120,0.65),0_8px_16px_-8px_rgba(47,209,180,0.4)]",
  secondary:
    "glass-panel text-sand-50 hover:bg-white/10 hover:-translate-y-0.5",
  ghost:
    "text-teal-400 hover:text-teal-300 px-0 py-0 underline-offset-4 hover:underline",
};

export default function CTAButton({
  href,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  className,
  children,
}: CTAButtonProps) {
  const classes = cn(base, sizes[size], variants[variant], className);

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}

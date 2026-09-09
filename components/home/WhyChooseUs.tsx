import SectionHeading from "@/components/ui/SectionHeading";

const REASONS = [
  {
    title: "100% Private",
    description: "Enjoy the lake with your own private experience.",
    icon: "private",
  },
  {
    title: "Local Experience",
    description: "Discover Koggala Lake with local knowledge.",
    icon: "local",
  },
  {
    title: "Safety First",
    description: "Life jackets and safety guidance included.",
    icon: "safety",
  },
  {
    title: "Flexible Booking",
    description: "Easy booking and flexible arrangements.",
    icon: "flexible",
  },
  {
    title: "Transparent Pricing",
    description: "No hidden costs.",
    icon: "pricing",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 sm:py-28 bg-navy-900/40">
      <div className="container-premium">
        <SectionHeading
          eyebrow="Why Us"
          title="More Than Just a Tour"
          align="center"
          className="mx-auto"
        />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {REASONS.map((reason) => (
            <div
              key={reason.title}
              className="card-lift rounded-xl2 glass-panel p-6 text-center hover:border-teal-500/30"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-500/10 text-teal-400">
                <ReasonIcon icon={reason.icon} />
              </div>
              <p className="font-display text-lg font-medium text-sand-50">
                {reason.title}
              </p>
              <p className="mt-2 text-sm text-sand-200/60">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReasonIcon({ icon }: { icon: string }) {
  const common = { viewBox: "0 0 24 24", className: "h-5 w-5 fill-none stroke-current", strokeWidth: 1.6 } as const;
  switch (icon) {
    case "private":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.2" />
          <path d="M5 20c1-3.5 4-5.5 7-5.5S18 16.5 19 20" strokeLinecap="round" />
        </svg>
      );
    case "local":
      return (
        <svg {...common}>
          <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
          <circle cx="12" cy="9.5" r="2.3" />
        </svg>
      );
    case "safety":
      return (
        <svg {...common}>
          <path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6l7-3z" />
        </svg>
      );
    case "flexible":
      return (
        <svg {...common}>
          <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
          <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M9.5 12.5l1.8 1.8L15 10.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
}

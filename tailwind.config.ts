import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#040B14",
          900: "#071626",
          800: "#0C2138",
          700: "#122C49",
          600: "#1A3A5C",
          500: "#234B72",
        },
        teal: {
          400: "#5FE0C8",
          500: "#2FD1B4",
          600: "#1FAE96",
          700: "#178878",
        },
        sand: {
          50: "#FBF8F1",
          100: "#F3EDDF",
          200: "#E7DCC2",
        },
        gold: {
          400: "#E8C77A",
          500: "#D9AF56",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(4, 11, 20, 0.35)",
        lift: "0 24px 48px -18px rgba(4, 11, 20, 0.5)",
        glow: "0 0 0 1px rgba(95, 224, 200, 0.15), 0 8px 24px -8px rgba(47, 209, 180, 0.35)",
        btn: "0 6px 16px -6px rgba(47, 209, 180, 0.55)",
        "btn-press": "0 2px 6px -2px rgba(47, 209, 180, 0.45)",
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(180deg, rgba(4,11,20,0.15) 0%, rgba(4,11,20,0.55) 55%, rgba(4,11,20,0.92) 100%)",
        "navy-fade":
          "linear-gradient(180deg, #071626 0%, #040B14 100%)",
        "card-sheen":
          "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 60%)",
      },
      borderRadius: {
        xl2: "1.25rem",
        xl3: "1.75rem",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-in-up": "fadeInUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        shimmer: "shimmer 2.5s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;

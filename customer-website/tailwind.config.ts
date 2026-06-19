import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border:     "rgb(var(--border) / <alpha-value>)",
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        card: {
          DEFAULT:    "rgb(var(--card) / <alpha-value>)",
          foreground: "rgb(var(--card-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT:    "rgb(var(--muted) / <alpha-value>)",
          foreground: "rgb(var(--muted-foreground) / <alpha-value>)",
        },
        primary: {
          DEFAULT:    "rgb(var(--primary) / <alpha-value>)",
          foreground: "rgb(var(--primary-foreground) / <alpha-value>)",
        },
        ring: "rgb(var(--ring) / <alpha-value>)",
        brand: {
          maroon: {
            50:  "#fdf2f2",
            100: "#fce4e4",
            200: "#fbcfcf",
            300: "#f7a8a8",
            400: "#f17474",
            500: "#e74747",
            600: "#d32b2b",
            700: "#b11f1f",
            800: "#7c1d1d",  // Primary dark maroon
            900: "#5a1a1a",
            950: "#3d0d0d",
          },
          gold: {
            50:  "#fffbeb",
            100: "#fef3c7",
            200: "#fde68a",
            300: "#fcd34d",
            400: "#fbbf24",
            500: "#f59e0b",  // Primary gold
            600: "#d97706",
            700: "#b45309",
            800: "#92400e",
            900: "#78350f",
          },
        },
        royal: {
          maroon: "#7C1D1D",
          gold:   "#F59E0B",
          cream:  "#FFF8F0",
          dark:   "#1A0A0A",
          "dark-surface": "#2D1414",
          "dark-variant": "#3C1919",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"],
        sans:  ["var(--font-inter)", "sans-serif"],
        mughal: ["var(--font-cinzel)", "serif"],
      },
      backgroundImage: {
        "royal-gradient":
          "linear-gradient(135deg, #7C1D1D 0%, #5a1a1a 50%, #3d0d0d 100%)",
        "gold-gradient":
          "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
        "hero-pattern":
          "url('/images/mughal-pattern.svg')",
      },
      boxShadow: {
        royal: "0 4px 24px rgba(124, 29, 29, 0.3)",
        gold:  "0 4px 24px rgba(245, 158, 11, 0.4)",
        card:  "0 2px 16px rgba(0, 0, 0, 0.08)",
      },
      animation: {
        "fade-in":     "fadeIn 0.5s ease-out",
        "slide-up":    "slideUp 0.4s ease-out",
        "pulse-royal": "pulseRoyal 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        pulseRoyal: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: ".7" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

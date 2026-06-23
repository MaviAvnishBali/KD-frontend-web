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
        maroon: {
          50:  "#fdf2f3",
          100: "#fce4e6",
          200: "#fbd0d4",
          300: "#f8adb4",
          400: "#f37b87",
          500: "#ea4f60",
          600: "#d63043",
          700: "#b31d30",
          800: "#6B0F1A",
          900: "#5a0f18",
          950: "#340409",
        },
        gold: {
          50:  "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#D4AF37",
          500: "#ca8a04",
          600: "#a16207",
          700: "#854d0e",
          800: "#713f12",
          900: "#422006",
        },
        ivory: "#F8F4E9",
        obsidian: "#111111",
      },
      fontFamily: {
        serif:  ["var(--font-playfair)", "Georgia", "serif"],
        sans:   ["var(--font-inter)", "system-ui", "sans-serif"],
        royal:  ["var(--font-cinzel)", "serif"],
        cormo:  ["var(--font-cormorant)", "serif"],
      },
      backgroundImage: {
        "royal-gradient":   "linear-gradient(135deg, #6B0F1A 0%, #3d0409 100%)",
        "gold-gradient":    "linear-gradient(135deg, #D4AF37 0%, #9a7d20 100%)",
        "dark-gradient":    "linear-gradient(135deg, #111111 0%, #1a0a0b 100%)",
        "hero-radial":      "radial-gradient(ellipse at 50% 50%, rgba(107,15,26,0.4) 0%, rgba(17,17,17,0.9) 70%)",
      },
      boxShadow: {
        royal:   "0 8px 40px rgba(107, 15, 26, 0.4)",
        gold:    "0 8px 40px rgba(212, 175, 55, 0.35)",
        "gold-sm": "0 4px 20px rgba(212, 175, 55, 0.25)",
        glass:   "0 8px 32px rgba(0,0,0,0.3)",
        glow:    "0 0 60px rgba(212, 175, 55, 0.15)",
      },
      animation: {
        "fade-up":       "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in":       "fadeIn 0.6s ease-out forwards",
        "shimmer":       "shimmer 2.5s linear infinite",
        "float":         "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 2s infinite",
        "marquee":       "marquee 35s linear infinite",
        "marquee-rev":   "marqueeRev 35s linear infinite",
        "pulse-gold":    "pulseGold 3s ease-in-out infinite",
        "spin-slow":     "spin 12s linear infinite",
        "draw-line":     "drawLine 1.5s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(40px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-20px)" },
        },
        marquee: {
          "0%":   { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        marqueeRev: {
          "0%":   { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(212,175,55,0.3)" },
          "50%":      { boxShadow: "0 0 60px rgba(212,175,55,0.6)" },
        },
        drawLine: {
          from: { strokeDashoffset: "1000" },
          to:   { strokeDashoffset: "0" },
        },
      },
      transitionTimingFunction: {
        "expo-out": "cubic-bezier(0.16, 1, 0.3, 1)",
        "back-out": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};

export default config;

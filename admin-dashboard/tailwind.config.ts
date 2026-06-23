import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "royal-maroon": "#7C1D1D",
        "maroon-700":   "#6B1919",
        border:         "hsl(var(--border))",
        muted:          { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        card:           { DEFAULT: "hsl(var(--card))",  foreground: "hsl(var(--card-foreground))" },
        foreground:     "hsl(var(--foreground))",
      },
      boxShadow: {
        royal: "0 4px 24px rgba(124,29,29,0.12)",
      },
    },
  },
  plugins: [],
};
export default config;

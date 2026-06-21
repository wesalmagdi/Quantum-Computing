import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        journey: {
          bg: "#f8fafc",
          card: "#ffffff",
          primary: "#6366f1",
          "primary-dark": "#4f46e5",
          accent: "#f59e0b",
          "accent-light": "#fbbf24",
          text: "#0f172a",
          muted: "#64748b",
          border: "#e2e8f0",
          "border-light": "#f1f5f9",
          surface: "#f1f5f9",
        },
      },
    },
  },
  plugins: [],
};

export default config;

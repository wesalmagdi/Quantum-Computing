import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        journey: {
          bg: "var(--journey-bg)",
          card: "var(--journey-card)",
          primary: "var(--journey-primary)",
          "primary-dark": "var(--journey-primary-dark)",
          accent: "var(--journey-accent)",
          "accent-light": "var(--journey-accent-light)",
          text: "var(--journey-text)",
          muted: "var(--journey-muted)",
          border: "var(--journey-border)",
          "border-light": "var(--journey-border-light)",
          surface: "var(--journey-surface)",
        },
      },
    },
  },
  plugins: [],
};

export default config;

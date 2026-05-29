import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        quantum: {
          bg: "#0a0a1a",
          card: "#141428",
          cyan: "#00d4ff",
          magenta: "#ff00aa",
          orange: "#ff6b35",
          purple: "#7c3aed",
        },
      },
    },
  },
  plugins: [],
};

export default config;

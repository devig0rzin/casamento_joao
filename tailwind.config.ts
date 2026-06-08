import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        rosewood: "#3a1d27",
        fuchsiaWedding: "#e01882",
        blush: "#fff0f8",
        champagne: "#f3dfce",
        nude: "#d8b9a7",
        goldRose: "#b9876a",
        ink: "#271a1f",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        premium: "0 28px 90px rgba(58, 29, 39, 0.16)",
        soft: "0 18px 50px rgba(58, 29, 39, 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/common/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)", // background
        secondary: "var(--secondary)", // secondary background
        primaryaccent: "var(--primaryaccent)", // accent/text
        secondaryaccent: "var(--secondaryaccent)", // accent/text
        success: "var(--success)",
        error: "var(--error)",
        errortext: "var(--errortext)",
      },
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
        "6xl": "3.75rem",
      },
      fontFamily: {
        sans: ["--font-playfair", "sans-serif"],
        display: ["--font-inter", "serif"],
      },
    },
  },
};

export default config;

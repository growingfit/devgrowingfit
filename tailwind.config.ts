import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: "#67238A",
          "purple-hover": "#531B70",
          "purple-light": "#8834B4",
          "purple-subtle": "#F6F1F9",
          red: "#F21F2B",
          "red-dark": "#C9141F",
          navy: "#172033",
          gray: "#667085",
          border: "#E8E8EC",
          bg: "#FAFAFC",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
        elevated: "0 10px 15px -3px rgba(103, 35, 138, 0.1), 0 4px 6px -2px rgba(103, 35, 138, 0.05)",
      },
      clipPath: {
        hero: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      },
    },
  },
  plugins: [],
};

export default config;

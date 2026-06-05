import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#1E2A38',   // Deep Indigo: Headers, Nav, Primary Text
          secondary: '#2E7D32', // Sprout Green: CTAs, Add to Cart, Success
          accent: '#C59B27',    // Harvest Gold: Badges, Star Ratings, Highlights
          canvas: '#FDFBF7',    // Canvas: Main App Background
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
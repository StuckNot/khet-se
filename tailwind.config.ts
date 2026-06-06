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
          primary: '#4A2C1A',   // Deep Brown: Headers, Nav, Primary Text
          secondary: '#7B4B2A', // Warm Brown: Subheadings, Secondary Text
          accent: '#C26D3A',    // Terracotta: CTAs, Highlights, Buttons
          canvas: '#FAF7F2',    // Off White: Main App Background
          beige: '#F3E9DC',     // Beige: Card Backgrounds, Sections
          green: '#6D8B74',     // Muted Green: Decorative/Large Text Only
        },
        success: '#2E7D32',
        error: '#D32F2F',
        warning: '#F57C00',
        sale: '#C26D3A',
        info: '#1976D2',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
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
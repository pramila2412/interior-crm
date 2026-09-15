/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic mapping for Moody Gold Theme
        primary: {
          DEFAULT: '#E5A93C', // Antique Gold
          foreground: '#1C1C1E', // Dark Charcoal
        },
        secondary: {
          DEFAULT: '#5C6B73', // Dusty Blue
          foreground: '#F5F5F5',
        },
        background: '#1C1C1E', // Dark Charcoal
        card: '#2C2C2E', // Lighter Charcoal
        accent: {
          DEFAULT: '#D9795C', // Rust
          foreground: '#FFFFFF',
        },
        foreground: '#F5F5F5',
        muted: '#A0A0A5',
        border: '#3A3A3C',
      },
    },
  },
  plugins: [],
}

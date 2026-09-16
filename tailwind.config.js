/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic mapping for Modern Indigo & Emerald Theme (Light Mode Only)
        primary: {
          DEFAULT: '#1e3a8a', // Indigo 900
          foreground: '#ffffff', // White text on primary buttons
        },
        secondary: {
          DEFAULT: '#f1f5f9', // Slate 100
          foreground: '#0f172a', // Slate 900
        },
        background: '#f8fafc', // Slate 50
        card: '#ffffff', // White cards
        accent: {
          DEFAULT: '#10b981', // Emerald 500
          foreground: '#ffffff',
        },
        foreground: '#0f172a', // Slate 900
        muted: '#64748b', // Slate 500
        border: '#e2e8f0', // Slate 200
        ring: '#3b82f6', // Blue 500 for focus rings
      },
    },
  },
  plugins: [],
}

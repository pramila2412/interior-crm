/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic mapping for Classic Luxury Theme (Light & High Contrast)
        primary: {
          DEFAULT: '#2D3748', // Deep Slate (Very high contrast)
          foreground: '#FFFFFF', // White text on primary buttons
        },
        secondary: {
          DEFAULT: '#EDF2F7', // Soft grayish blue for backgrounds/hover
          foreground: '#2D3748', // Deep Slate text on secondary
        },
        background: '#F8F9FA', // Crisp very light gray
        card: '#FFFFFF', // Pure White cards
        accent: {
          DEFAULT: '#C05621', // Burnt Orange / Warm Wood accent
          foreground: '#FFFFFF',
        },
        foreground: '#1A202C', // Almost black for primary text
        muted: '#718096', // Slate gray for secondary text
        border: '#E2E8F0', // Clean borders
      },
    },
  },
  plugins: [],
}

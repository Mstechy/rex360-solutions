/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // We are defining your official CAC brand colors here
        'cac-green': '#059669', // Emerald Green for Nigeria/Growth
        'cac-blue': '#1e3a8a',  // Deep Royal Blue for Trust
        'cac-light-blue': '#60a5fa', // Light Blue for Hovers
      },
      animation: {
        'blink-light': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
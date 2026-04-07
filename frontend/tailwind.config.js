/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mzansi-green': '#10b981', 
        'mzansi-dark': '#030712', 
        'mzansi-card': '#111827', 
      }
    },
  },
  plugins: [],
}
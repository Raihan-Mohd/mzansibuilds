/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mzansi: {
          green: '#10b981', 
          dark: '#111827',  
          light: '#f9fafb' 
        }
      }
    },
  },
  plugins: [],
}
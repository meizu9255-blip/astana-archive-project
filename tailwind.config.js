/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#003366', // Строгий государственный синий
          gold: '#cda434', // Золотой акцент (флаг)
          cyan: '#00bfff', // Голубой акцент
          light: '#f4f7f6',
          dark: '#1a1a1a'
        }
      }
    },
  },
  plugins: [],
}

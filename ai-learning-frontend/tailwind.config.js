/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Dòng này cực quan trọng: Bảo Tailwind quét tất cả file trong src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
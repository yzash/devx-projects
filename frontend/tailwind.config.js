/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sidebar: '#111827',
        'sidebar-hover': '#1f2937',
      }
    },
  },
  plugins: [],
}

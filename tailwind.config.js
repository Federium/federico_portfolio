/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // se usi app router
    "./slices/**/*.{js,ts,jsx,tsx}", // cartelle prismic slices
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
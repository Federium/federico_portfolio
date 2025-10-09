/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/slices/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['var(--font-jetbrains-mono)', 'monospace'],
      },
      colors: {
        primary: '#BBDAF7',
        secondary: '#FFFFFF',
        accent: '#02f713',
        background: '#000000',
      },
    },
  },
  plugins: [],
};
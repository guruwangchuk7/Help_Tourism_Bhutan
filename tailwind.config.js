/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1A1A1D",
        secondary: "#5A5A5C",
        accent: "#C2A878",
        accentDark: "#A38A5C",
        bgLight: "#FAFAFA",
        bgAlt: "#F3F1ED",
      },
      fontFamily: {
        heading: ["Playfair Display", "serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}
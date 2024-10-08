/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        darkgray: "#1d2023",
        lightgray: "#ccd0d8",
        lightblue: "#84a4fc",
      },
    },
  },
  plugins: [],
};

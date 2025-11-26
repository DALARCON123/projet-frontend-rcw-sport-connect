/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#5580e3ff",
      },
      boxShadow: {
        glass: "0 10px 30px rgba(2,6,23,0.08)",
      },
    },
  },
  plugins: [],
};

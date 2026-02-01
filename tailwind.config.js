/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // ✅ required for toggle
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      /* OPTIONAL: keep brand only if really needed */
      colors: {
        brand: "#00ACF0",
      },

      /* glow used for gaming cards */
      boxShadow: {
        glow: "0 0 60px rgba(168,85,247,0.35)", // purple-500 glow
      },

      /* gaming grid background */
      backgroundImage: {
        grid:
          "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        hebrew: ["Assistant", "Alef", "sans-serif"],
      },
      colors: {
        wizard: {
          dark: "#0d0520",
          purple: "#1a0a2e",
          mid: "#2d1b5e",
          violet: "#7c3aed",
          gold: "#f59e0b",
          blue: "#1e3a5f",
          star: "#fbbf24",
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        sparkle: "sparkle 1.5s ease-in-out infinite",
        "pulse-gold": "pulse-gold 2s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        sparkle: {
          "0%,100%": { opacity: 1, transform: "scale(1)" },
          "50%": { opacity: 0.5, transform: "scale(1.2)" },
        },
        "pulse-gold": {
          "0%,100%": { boxShadow: "0 0 10px #f59e0b44" },
          "50%": { boxShadow: "0 0 30px #f59e0b99" },
        },
      },
    },
  },
  plugins: [],
};

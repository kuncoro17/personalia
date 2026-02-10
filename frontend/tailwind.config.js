import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/config/**/*.{js,ts,jsx,tsx}", 
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: "#344561",
        red: "#8C2526",
        primary: "#0B345E",
        gray: "#ABB1BB",
        yellow: "#FBBC05",
      },
      fontFamily: {
        Poppins: ["Poppins", "sans-serif"],
        TimesNewRoman: ["Times New Roman", "Times", "serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};
import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        customRed: "#f87171",
        customRedHover: "#b91c1c",
        customSky: "#38bdf8",
        customSkyHover: "#7dd3fc",
      },
    },
  },
  plugins: [],
} satisfies Config;

import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e6eef7",
          100: "#b3c9e5",
          200: "#80a4d3",
          300: "#4d7fc1",
          400: "#1a5aaf",
          500: "#00419d",
          600: "#00357f",
          700: "#002961",
          800: "#001f5c",
          900: "#001543",
          950: "#000f2e",
        },
        accent: {
          50: "#ffe6e6",
          100: "#ffd6d6",
          200: "#ff8080",
          300: "#ff4d4d",
          400: "#ff1a1a",
          500: "#e60000",
          600: "#cc0000",
          700: "#b30000",
          800: "#8b0000",
          900: "#800000",
          950: "#4d0000",
        },
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;

import {nextui} from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */

const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'bookmark-pink': '#FF3366',
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()]
}

export default config;
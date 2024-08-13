/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["nord",
     {
      dark: {
        ...require("daisyui/src/theming/themes")["dark"],
        "primary": "#A8A8A8",
        "neutral":"#A8A8A8",
        "base-100":"#1B1F2A",
        "base-200":"#181C25",
        "base-300":"#14171F",
        "base-content":"#A8A8A8",
      },
    }
    , "sunset","black","cyberpunk","synthwave","aqua"],
  },
}


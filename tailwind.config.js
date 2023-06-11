/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        extendToBottom: "1s ease-out 0s 1 extendToBottom",
      },
      keyframes: {
        extendToBottom: {
          from: "max-height: 0",
          to: "max-height: 100rem",
        },
      },
    },
  },
  plugins: [],
};

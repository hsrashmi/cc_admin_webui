/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary-color)",
        secondary: "var(--secondary-color)",
        tertiary: "var(--tertiary-color)",
      },
      fontFamily: {
        // This overrides the default sans font
        sans: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};

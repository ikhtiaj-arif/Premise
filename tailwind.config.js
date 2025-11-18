/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        xxs: "402px",
        sm: "640px",
        md: "770px",
        lg: "1154px",
        xl: "1440px",
        xxl: "1540px",
        "2xl": "1636px",
        "3xl": "1920px",
      },
      colors: {
        primary: "#101828",
        secondary: "#00C3FF",
        lightGrey: "#FAFAFA",
        textGrey: "#616161",
        boxGrey: "#EAEAEA",
        textColor: "#4A5565",
      },
    },
  },
  plugins: [],
};


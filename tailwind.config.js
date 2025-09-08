/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  // plugins: [require("daisyui")],
  // daisyui: {
  //   themes: ["light",],
  // },
  theme : {
    screens: {
      'xxs': '402px',
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '770px',
      // => @media (min-width: 768px) { ... }

      'lg': '1154px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1440px',
      // => @media (min-width: 1280px) { ... }
      'xxl': '1540px',

      '2xl': '1636px',
      
      '3xl': '1920px',
      // => @media (min-width: 1536px) { ... }
    },
    
  }
};


// tailwind.config.js
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'], // Aquí estamos extendiendo las fuentes con Inter
      },
    },
  },
  plugins: [],
};



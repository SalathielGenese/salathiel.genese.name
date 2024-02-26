const defaultConfig = require("tailwindcss/defaultConfig");
const colors = require("tailwindcss/colors");
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      './src/**/*.{ts,sass,html}',
  ],
  theme: {
    extend: {
        fontFamily: {
            'serif': ['Domine', 'serif'],
            'sans': ['Signika', 'sans-serif'],
            'handwriting': ['Dancing Script'],
        },
        colors: {
            ...colors,
            brown: '#a73109',
            grey: colors.neutral,
        },
    },
  },
  plugins: [],
}

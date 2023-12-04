const colors = require("tailwindcss/colors");
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      './src/**/*.{ts,sass,html}',
  ],
  theme: {
    extend: {
        colors: {
            ...colors,
            brown: '#a73109',
            grey: colors.neutral,
        },
    },
  },
  plugins: [],
}

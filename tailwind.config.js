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
            grey: colors.neutral,
        },
    },
  },
  plugins: [],
}

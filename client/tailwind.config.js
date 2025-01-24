/** @type {import('tailwindcss').Config} */
const flowbite = require("flowbite-react/tailwind");

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
    flowbite.content(),
  ],
  theme: {
    extend: {
      colors: {
        app_yellow: '#ffca38',
        app_blue: '#1778ff'
      }
    },
  },
  plugins: [
    require('flowbite/plugin'),
  ],
}


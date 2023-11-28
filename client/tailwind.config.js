/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx}",
    "./public/index.html",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      width: {
        main: "1330px",
      },
      colors: {
        main: "#349fe2",
        textColor: "#515151",
      },
      backgroundColor: {
        main: "#349fe2",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};

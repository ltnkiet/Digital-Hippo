/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx}",
    "./public/index.html",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      width: {
        main: "1330px",
      },
      flex: {
        '2': "2 2 0%",
        '3': "3 3 0%",
        '4': "4 4 0%",
        '5': "5 5 0%",
      },
      colors: {
        main: "#349fe2",
        textColor: "#515151",
      },
      backgroundColor: {
        main: "#349fe2",
      },
      keyframes: {
        "slide-top": {
          "0%": {
            "-webkit-transform": "translateY(40px)",
            transform: "translateY(40px)",
          },
          "100%": {
            "-webkit-transform": "translateY(0px)",
            transform: "translateY(0px)",
          },
        },
      },
      animation: {
        "slide-top":
          "animation: slide-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};

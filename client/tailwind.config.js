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
        main: "1200px",
      },
      flex: {
        2: "2 2 0%",
        3: "3 3 0%",
        4: "4 4 0%",
        5: "5 5 0%",
      },
      colors: {
        main: "#349fe2",
        textColor: "#515151",
      },
      backgroundColor: {
        main: "#349fe2",
        primary: '#F5F5F5',
        'overlay-70': 'rgba(0,0,0,0.7)',
      },
      listStyleType: {
        none: "none",
        disc: "disc",
        decimal: "decimal",
        square: "square",
        roman: "upper-roman",
      },
      gridTemplateRows: {
        10: "repeat(10, minmax(0, 1fr))",
        layout: "200px minmax(900px, 1fr) 100px",
      },
      gridRow: {
        "span-7": "span 7 / span 7",
      },
      keyframes: {
        "slide-top": {
          "0%": {
            "-webkit-transform": "translateY(60px)",
            transform: "translateY(60px)",
          },
          "100%": {
            "-webkit-transform": "translateY(0px)",
            transform: "translateY(0px)",
          },
        },
        "slide-right": {
          "0%": {
            "-webkit-transform": "translateX(20px);",
            transform: "translateX(20px);",
          },
          "100%": {
            "-webkit-transform": "translateX(0);",
            transform: "translateX(0);",
          },
        },
      },
      animation: {
        "slide-top":
          "slide-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;",
        "slide-right":
          "slide-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;",
      },
    },
  },
  plugins: [
    require("flowbite/plugin"),
    require("@tailwindcss/forms")({ strategy: "class" }),
  ],
  
};

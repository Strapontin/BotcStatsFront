// tailwind.config.js
/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");
const colors = require("tailwindcss/colors");

delete colors["blueGray"];
delete colors["coolGray"];
delete colors["lightBlue"];
delete colors["trueGray"];
delete colors["warmGray"];

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      ...colors,
      transparent: "transparent",
      current: "currentColor",
      townsfolk: "#08c1ff",
      outsider: "rgb(23, 104, 255)",
      minion: "rgb(248, 2, 5)",
      demon: "rgb(197, 0, 0)",
      traveller: "rgb(154, 77, 159)",
      fabled: "rgb(168, 153, 50)",
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};

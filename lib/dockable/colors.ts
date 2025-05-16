const colors = {
  light: {
    headers: "rgb(225, 229, 233)",
    selected: "rgb(66,137,204)",
    background: "rgb(191, 198, 207)",
    document: "rgb(92, 95, 99)",
    border: "rgba(0,0,0,0.1)",
    text: "rgb(63, 63, 63)",
    gap: "rgb(133, 140, 151)",
    input: "rgb(255,255,255)",
    inputText: "rgb(0,0,0)",
  },
  medium: {
    headers: "rgb(80,80,80)",
    selected: "rgb(46,104,162)",
    background: "rgb(60, 60, 60)",
    document: "rgb(32,32,32)",
    border: "rgba(0,0,0,0.125)",
    text: "rgb(255, 255, 255)",
    gap: "rgb(32, 32, 32)",
    input: "rgba(0,0,0,0.2)",
    inputText: "rgb(255,255,255)",
  },
  dark: {
    headers: "rgb(54, 57, 63)",
    selected: "rgb(46,104,162)",
    background: "rgb(40, 44, 48)",
    content: "rgb(46, 49, 54)",
    document: "rgb(13, 13, 14)",
    border: "rgba(0, 0, 0, 0.15)",
    text: "rgb(213, 218, 221)",
    gap: "rgb(24, 24, 26)",
    input: "rgba(0,0,0,0.2)",
    inputText: "rgb(255,255,255)",
  },
  darker: {
    headers: "rgb(39, 44, 53)",
    selected: "rgb(46,104,162)",
    background: "rgb(31, 36, 43)",
    content: "rgb(46, 49, 54)",
    document: "rgb(13, 13, 14)",
    border: "rgba(0, 0, 0, 0.15)",
    text: "rgb(200, 207, 211)",
    gap: "rgb(20, 20, 20)",
    input: "rgba(0,0,0,0.2)",
    inputText: "rgb(200, 207, 211)",
  },
};

// get the user's preferred theme
const userPreferredTheme = window.matchMedia("(prefers-color-scheme: dark)")
  .matches
  ? "dark"
  : "light";

const currentTheme = colors[userPreferredTheme];
// const currentTheme = colors.dark;

// Set CSS variables on body for current theme
Object.entries(currentTheme).forEach(([key, value]) => {
  document.body.style.setProperty(`--${key}`, value);
});

export default currentTheme;

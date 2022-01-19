const { resolve } = require("path");

module.exports = {
  type: "react-component",
  npm: {
    esModules: true,
    umd: {
      global: "ReactDockable",
      externals: {
        react: "React",
      },
    },
  },
  webpack: {
    rules: {
      css: {
        modules: { auto: true },
      },
      babel: {
        test: /\.jsx?/,
      },
    },
    extra: {
      entry: resolve(__dirname, "./demo/src"),
      resolve: {
        extensions: [".js", ".jsx"],
      },
    },
  },
};

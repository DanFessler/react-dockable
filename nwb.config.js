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
    },
  },
};

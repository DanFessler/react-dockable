module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'ReactDockable',
      externals: {
        react: 'React'
      }
    }
  }
}

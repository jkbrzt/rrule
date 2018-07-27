const path = require('path');

module.exports = {
  entry: {
    demo: './demo/demo.js',
    index: './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'source-map',
  mode: 'production'
};
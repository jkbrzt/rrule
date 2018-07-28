const path = require('path');

module.exports = [{
  entry: {
    index: './src/index.js'
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'rrule',
    libraryTarget: 'umd',
    globalObject: 'typeof self !== \'undefined\' ? self : this'
  },
  devtool: 'source-map',
  mode: 'production'
}, {
  entry: {
    demo: './demo/demo.js',
  },
  output: {
    filename: 'demo.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'source-map',
  mode: 'production'
}];
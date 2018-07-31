const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');

const paths = {
  demo: {
    styles: path.resolve(__dirname, 'demo/demo.css'),
    template: path.resolve(__dirname, 'demo/index.html'),
    vendor: path.resolve(__dirname, 'demo/vendor'),
  },
  dist: path.resolve(__dirname, 'dist'),
}

module.exports = [{
  entry: {
    index: './src/index.js'
  },
  output: {
    filename: 'rrule.js',
    path: paths.dist,
    library: 'rrule',
    libraryTarget: 'umd',
    globalObject: 'typeof self !== \'undefined\' ? self : this'
  },
  devtool: 'source-map',
  mode: 'production'
}, {
  entry: {
    demo: './demo/demo.coffee',
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        loader: 'coffee-loader',
        test: /\.coffee$/,
      }
    ],
  },
  output: {
    filename: 'demo.js',
    path: paths.dist
  },
  plugins: [
    new CopyWebpackPlugin([{
      from: paths.demo.vendor,
      to: paths.dist,
    }, {
      from: paths.demo.styles,
      to: paths.dist,
    }]),
    new HtmlWebpackPlugin({
      template: paths.demo.template,
    })
  ],
  devtool: 'source-map',
  mode: 'production'
}];
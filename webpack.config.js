const path = require('path');

module.exports = [{
  entry: {
    index: './dist/es6/index.js'
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist', 'es5'),
    library: 'rrule',
    libraryTarget: 'umd',
    globalObject: 'typeof self !== \'undefined\' ? self : this'
  },
  devtool: 'source-map',
  mode: 'production',
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/
    }]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  optimization: {
    minimize: false
  }
}, {
  entry: {
    demo: './demo/demo.js',
  },
  output: {
    filename: 'demo.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'source-map',
  mode: 'production',
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }]
  }
}];
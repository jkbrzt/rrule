const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const paths = {
  demo: {
    styles: path.resolve(__dirname, "demo/demo.css"),
    template: path.resolve(__dirname, "demo/index.html")
  },
  demoDist: path.resolve(__dirname, "dist"),
  es5: path.resolve(__dirname, "dist", "es5"),
  esm: path.resolve(__dirname, "dist", "esm")
};

const commonConfig = {
  output: {
    filename: "[name].js",
    path: paths.es5,
    library: "rrule",
    libraryTarget: "umd",
    globalObject: "typeof self !== 'undefined' ? self : this"
  },
  devtool: "source-map",
  mode: "production",
  resolve: {
    extensions: [".js"]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        include: /\.min\.js$/
      })
    ]
  }
};

const rruleConfig = {
  entry: {
    rrule: path.join(paths.esm, "index.js"),
    'rrule.min': path.join(paths.esm, "index.js")
  },
  externals: {
    luxon: 'luxon'
  },
  ...commonConfig
};

const rruleWithLuxonConfig = {
  entry: {
    'rrule-tz': path.join(paths.esm, "index.js"),
    'rrule-tz.min': path.join(paths.esm, "index.js")
  },
  ...commonConfig
}

const demoConfig = {
  entry: {
    demo: "./demo/demo.coffee"
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        loader: "coffee-loader",
        test: /\.coffee$/
      }
    ]
  },
  output: {
    filename: "demo.js",
    path: paths.demoDist
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
    new CopyWebpackPlugin([
      {
        from: paths.demo.styles,
        to: paths.demoDist
      }
    ]),
    new HtmlWebpackPlugin({
      template: paths.demo.template
    })
  ],
  devtool: "source-map",
  mode: "production"
};

module.exports = [rruleConfig, rruleWithLuxonConfig, demoConfig];

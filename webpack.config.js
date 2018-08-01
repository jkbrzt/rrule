const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const paths = {
  demo: {
    styles: path.resolve(__dirname, "demo/demo.css"),
    template: path.resolve(__dirname, "demo/index.html")
  },
  demoDist: path.resolve(__dirname, "dist"),
  es5: path.resolve(__dirname, "dist", "es5"),
  es6: path.resolve(__dirname, "dist", "es6")
};

const rruleConfig = {
  entry: {
    index: path.join(paths.es6, "index.js")
  },
  output: {
    filename: "rrule.js",
    path: paths.es5,
    library: "rrule",
    libraryTarget: "umd",
    globalObject: "typeof self !== 'undefined' ? self : this"
  },
  devtool: "source-map",
  mode: "production",
  module: {
    rules: [
      {
        test: /\.js?$/,
        use: "babel-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".js"]
  },
  optimization: {
    minimize: false
  }
};

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

module.exports = [rruleConfig, demoConfig];

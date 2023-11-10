const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const paths = {
  demo: {
    source: path.resolve(__dirname),
    styles: path.resolve(__dirname, "demo.css"),
    template: path.resolve(__dirname, "index.html")
  },
};

const demoConfig = {
  entry: {
    demo: path.join(paths.demo.source, "demo.ts"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre"
      },
      {
        exclude: /node_modules/,
        loader: "ts-loader",
        test: /\.ts$/
      }
    ]
  },
  output: {
    filename: "demo.js",
    path: paths.demoDist
  },
  resolve: {
    extensions: [".js", ".ts"]
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

module.exports = [demoConfig];

const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

const paths = {
  source: path.resolve(__dirname, 'src'),
  es5: path.resolve(__dirname, "dist", "es5"),
};

const commonConfig = {
  output: {
    filename: '[name].js',
    path: paths.es5,
    library: 'rrule',
    libraryTarget: 'umd',
    globalObject: "typeof self !== 'undefined' ? self : this",
  },
  devtool: 'source-map',
  mode: 'production',
  resolve: {
    extensions: ['.js', '.ts'],
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        loader: 'ts-loader',
        test: /\.ts$/,
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(),
    ]
  }
};

const rruleConfig = Object.assign(
  {
    entry: {
      rrule: path.join(paths.source, 'index.ts'),
      'rrule.min': path.join(paths.source, 'index.ts'),
    },
  },
  commonConfig
)

module.exports = [rruleConfig]

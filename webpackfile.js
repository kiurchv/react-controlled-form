const path = require("path");
const upperCamelCase = require("uppercamelcase");
const { optimize: { UglifyJsPlugin } } = require("webpack");
const UnminifiedWebpackPlugin = require("unminified-webpack-plugin");

const cwd = process.cwd();
const basename = path.basename(cwd);

module.exports = {
  entry: "./src",
  output: {
    path: path.resolve(cwd, "dist"),
    filename: `${basename}.min.js`,
    library: upperCamelCase(basename),
    libraryTarget: "umd"
  },
  module: {
    rules: [
      { test: /\.js$/, loader: "babel-loader", exclude: /node_modules/ }
    ]
  },
  plugins: [
    new UglifyJsPlugin(),
    new UnminifiedWebpackPlugin()
  ]
};

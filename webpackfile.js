const path = require("path");
const umdExternal = require("webpack-umd-external");
const { optimize: { UglifyJsPlugin } } = require("webpack");
const UnminifiedWebpackPlugin = require("unminified-webpack-plugin");

module.exports = {
  entry: "./src",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "react-controlled-form.min.js",
    library: "ReactControlledForm",
    libraryTarget: "umd"
  },
  module: {
    rules: [
      { test: /\.js$/, loader: "babel-loader", exclude: /node_modules/ }
    ]
  },
  externals: umdExternal({
    react: "React",
    recompose: "Recompose",
    lodash: "_",
    immutable: "Immutable"
  }),
  plugins: [
    new UglifyJsPlugin(),
    new UnminifiedWebpackPlugin()
  ]
};

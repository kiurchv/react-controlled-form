const merge = require("webpack-merge");
const umdExternal = require("webpack-umd-external");

const base = require("../../webpackfile");

module.exports = merge(base, {
  externals: umdExternal({
    react: "React",
    recompose: "Recompose",
    lodash: "_",
    immutable: "Immutable"
  })
});

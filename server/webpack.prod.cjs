const path = require("path");
const _externals = require("webpack-node-externals");

module.exports = {
    entry: path.resolve("./", "src/index.js"),
    mode: "production",
    output: {
        path: path.resolve("./", "dist/"),
        filename: "bundle.cjs"
    },
    target: "node",
    externals:  _externals()
}
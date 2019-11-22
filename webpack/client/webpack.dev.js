const common = require("./webpack.common");
const merge = require("webpack-merge");
const path = require("path");

module.exports = merge(common, {
    mode: "development",
    devtool: "eval-source-map",
    devServer: {
        contentBase: path.resolve("./", "dist/client"),
        compress: true,
        port: 9000,
        host: "0.0.0.0"
    }
});
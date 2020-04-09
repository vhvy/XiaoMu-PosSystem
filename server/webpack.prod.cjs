const path = require("path");
const _externals = require("webpack-node-externals");
const webpack = require("webpack");

module.exports = env => {
    const { JWT_KEY, MODE } = env;

    return {
        entry: path.resolve("./", "src/index.js"),
        mode: "production",
        output: {
            path: MODE === "DEMO" ? path.resolve("./dist") : path.resolve("./", "../", "public/"),
            filename: "bundle.cjs"
        },
        target: "node",
        externals: _externals(),
        plugins: [
            new webpack.DefinePlugin({
                "process.env.JWT_KEY": JSON.stringify(JWT_KEY),
                "process.env.DEMO": JSON.stringify(MODE || "NOTMODE")
            })
        ]
    };
}
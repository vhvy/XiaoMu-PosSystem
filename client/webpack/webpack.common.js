const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWeboackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: path.resolve("./", "src/index.js"),
    output: {
        path: path.resolve("./", "dist/"),
        filename: "static/js/client.bundle.js",
        publicPath: "/"
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "static/images/[path][name].[ext]"
                        },
                    },
                ],
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        babelrc: true
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader",
                        options: {
                            modules: {
                                localIdentName: "[path][name]__[local]--[hash:base64:5]"
                            }
                        }
                    },
                    {
                        loader: "sass-loader"
                    },
                ]
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "less-loader"
                    },
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new htmlWebpackPlugin({
            template: path.resolve("./", "src/public/index.html"),
            filename: "./index.html"
        }),
        new CopyWeboackPlugin([
            {
                from: "src/public/iconfontcn.js",
                to:  "static/js/iconfontcn.js"
            }
        ])
    ],
    resolve: {
        extensions: [".js", ".jsx", ".json"]
    }
};
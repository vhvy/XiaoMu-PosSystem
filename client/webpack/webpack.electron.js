const common = require("./webpack.common");
const merge = require("webpack-merge");
const webpack = require("webpack");

function customizeObject(a, b, key) {
    if (key === 'module') {

        const a_rules = a.rules;
        const b_rules = b.rules;

        let rules = [];
        for (let base_rule of a_rules) {
            const { test } = base_rule;
            const rule = b_rules.find(i => i.test + "" === test + "");

            rules.push(rule ? rule : base_rule);
        }

        return {
            rules
        };
    }
    else if (key === "plugins") {

        return b && b.length !== 0 && [...a, ...b] || undefined;
    }

    // Fall back to default merging
    return undefined;
}

module.exports = env => {

    const TYPE = env && env.TYPE || "online";
    console.log(env, TYPE)
    return merge(
        {
            customizeObject
        }
    )(common, {
        mode: "production",
        output: {
            publicPath: "./"
        },
        module: {
            rules: [
                {
                    test: /\.(png|jpg|gif)$/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                publicPath: "images://static/images/",
                                outputPath: "static/images",
                                name: "[hash].[ext]"
                            },
                        },
                    ],
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
            new webpack.DefinePlugin({
                "process.env.TYPE": JSON.stringify(TYPE)
            })
        ]
    });
}
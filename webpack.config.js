var webpack = require("webpack");

var plugins = [
    new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    }),
];

if (process.env.NODE_ENV == "production") {
    plugins.push(new webpack.optimize.UglifyJsPlugin({compress: true}));
}

module.exports = {
    entry: "./lib/client/index",
    resolve: {
        extensions: [".js"],
        unsafeCache: true,
    },
    output: {
        path: __dirname + "/static/js",
        filename: "app.js",
    },
    plugins: plugins,
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
            },
        ],
    },
};

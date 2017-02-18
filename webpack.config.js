var webpack = require("webpack");

var plugins = [];

if (process.env.NODE_ENV == "production") {
    plugins.push(new webpack.optimize.UglifyJsPlugin({compress: true}));
}

module.exports = {
    entry: "./lib/client/index",
    resolve: {
        extensions: [".js"],
    },
    output: {
        path: __dirname + "/static/js",
        filename: "app.js",
    },
    plugins: plugins,
}

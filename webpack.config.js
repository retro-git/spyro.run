const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require("path");
const dist = path.resolve(__dirname, "dist");

module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    performance: {
        hints: false,
    },
    mode: "production",
    entry: {
        index: "./www/index.js"
    },
    output: {
        path: dist,
        filename: "[name].js"
    },
    devServer: {
        static: {
            directory: dist,
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'www/index.html'
        }),
        new CleanWebpackPlugin(),
        /*new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'www/roms',
                    to: 'roms/[name][ext]',
                },
                {
                    from: 'www/ace-builds/src-noconflict',
                    to: 'ace-builds/src-noconflict/[name][ext]',
                },
                {
                    from: 'www/ace-builds/webpack-resolver.js',
                    to: 'ace-builds/[name][ext]',
                }
            ]
        })*/
    ]
};
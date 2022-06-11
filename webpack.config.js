const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require("path");
const dist = path.resolve(__dirname, "dist");

module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.wasm$/,
                type: 'javascript/auto',
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.json5$/i,
                loader: 'json5-loader',
                type: 'javascript/auto',
            },
        ],
    },
    performance: {
        hints: false,
    },
    mode: "production",
    entry: {
        index: "./src/index.js"
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
    resolve: {
        fallback: {
            path: false,
            fs: false,
            crypto: false,
        }
    },
    experiments: {
        asyncWebAssembly: true,
        topLevelAwait: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'src-dump/out',
                    to: 'data/[path][name][ext]',
                },
                {
                    from: 'src/data',
                    to: 'data/[path][name][ext]',
                },
                {
                    from: 'node_modules/sql.js/dist/sql-wasm.wasm',
                    to: '[name][ext]',
                },
                {
                    from: 'CNAME',
                    to: '[name]',
                }
            ]
        })
    ]
};
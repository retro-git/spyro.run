const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require("path");
const dist = path.resolve(__dirname, "dist");

const pages = ["index", "boards", "submit", "records", "prachack"]

module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
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
    mode: "development",
    entry: pages.reduce((config, page) => {
        config[page] = `./www/${page}.js`;
        return config;
    }, {}),
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
    plugins: [].concat(
        pages.map(
            (page) =>
                new HtmlWebpackPlugin({
                    inject: true,
                    template: `./www/${page}.html`,
                    filename: `${page}.html`,
                    chunks: [page],
                })
        ),
        [
            new CleanWebpackPlugin(),
            new MiniCssExtractPlugin(),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: 'www/assets',
                        to: 'assets/[path][name][ext]',
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
    ),
};
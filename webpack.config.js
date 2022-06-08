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
            {
                test: /\.wasm$/,
                type: 'javascript/auto',
            }
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
            template: 'www/index.html'
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'src-dump/out',
                    to: 'data/[path][name][ext]',
                },
                {
                    from: 'node_modules/sql.js/dist/sql-wasm.wasm',
                    to: '[name][ext]',
                }
            ]
        })
    ]
};
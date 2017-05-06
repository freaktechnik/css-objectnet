const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const manifest = require("./webextension/manifest.json");
const webpack = require("webpack");
const path = require("path");

const defaultLanguage = manifest.default_locale;

module.exports = {
    entry: {
        background: "./src/background/index.js",
        "devtools/page": "./src/devtools/page/index.js",
        "devtools/panel": "./src/devtools/panel/index.js"
    },
    output: {
        path: path.resolve(__dirname, "./webextension"),
        filename: "[name]/index.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/
            },
            {
                test: /\.(svg|png)$/,
                loader: 'file-loader?name=assets/images/[name].[ext]'
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },
            {
                test: /_locales\/[a-zA-Z_]{2,5}\/messages\.json$/,
                use: [
                    'file-loader?name=[path][name].[ext]'/*,
                    'transifex-loader'*/
                ]
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: "[name]/style.css"
        }),
        new HtmlWebpackPlugin({
            template: 'src/devtools/page/index.html',
            filename: 'devtools/page/index.html',
            chunks: [
                'devtools/page'
            ],
            defaultLanguage
        }),
        new HtmlWebpackPlugin({
            template: 'src/devtools/panel/index.html',
            filename: 'devtools/panel/index.html',
            chunks: [
                'devtools/panel'
            ],
            defaultLanguage
        })
    ],
    externals: {
        d3: 'd3'
    }
};

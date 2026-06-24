const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('css-minimizer-webpack-plugin');
var webpack = require('webpack');

module.exports = (env, argv) => {

    console.log("starting");
    console.log("mode = " + argv.mode);
    const devmode = argv.mode != 'production';
    // var devmode = true

    if (devmode) {
        console.log("got devmode")
    } else {
        console.log("got production mode")
    }

    let result = {
    entry: {
            main_app: './static/tactic_js/main_app.jsx',
            notebook_app: './static/tactic_js/notebook_app.jsx',
            library_home_react: './static/tactic_js/library_home_react.jsx',
            repository_home_react: './static/tactic_js/repository_home_react.jsx',
            admin_home_react: "./static/tactic_js/admin_home_react.jsx",
            tile_creator_react: './static/tactic_js/tile_maker_react.jsx',
            code_viewer_react: './static/tactic_js/code_viewer_react.jsx',
            list_viewer_react: './static/tactic_js/list_viewer_react.jsx',
            module_viewer_react: './static/tactic_js/module_viewer_react.jsx',
            register_react: './static/tactic_js/register_react.jsx',
            duplicate_user_react: './static/tactic_js/duplicate_user_react.jsx',
            account_react: './static/tactic_js/account_react.jsx',
            auth_react: './static/tactic_js/auth_react.jsx',
            history_viewer_react: './static/tactic_js/history_viewer_react.jsx',
            tile_differ_react: './static/tactic_js/tile_differ_react.jsx',
            context_react: './static/tactic_js/context_react.jsx',
    },

    mode: devmode ? "development" : "production",
    devtool: devmode ? "source-map" : false,

    resolve: {
        extensions: ['.jsx', '.js']
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
        new webpack.DefinePlugin({
            "process.env": "{}",
        })
    ],

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: path.resolve(__dirname, 'static/tactic_js'),
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react'
                        ],
                        sourceMaps: true
                    }
                }
            },

            {
                test: /\.(sa|sc|c)ss$/i,
                include: [
                    path.resolve(__dirname, 'static/css'),
                    path.resolve(__dirname, 'static/tactic_css'),
                    path.resolve(__dirname, 'node_modules/codemirror'),
                    path.resolve(__dirname, 'node_modules/markdown-it-latex'),
                    path.resolve(__dirname, 'node_modules/highlight.js'),
                    path.resolve(__dirname, 'node_modules/allotment'),
                    path.resolve(__dirname, 'node_modules/react-grid-layout'),
                    path.resolve(__dirname, 'node_modules/react-resizable')
                ],
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ],
            },

            // your asset/resource rule...
        ],
    },
};

    if (!devmode) {
        result.mode = "production";
        result.optimization = {
            minimizer: [new TerserJSPlugin({extractComments: false,}), new OptimizeCSSAssetsPlugin({})],
        };
        result.output = {
            filename: '[name].production.bundle.js',
            path: path.resolve(__dirname, 'static/tactic_js_dist')
        }
    } else {
        result.mode = "development";
        result.output = {
            filename: '[name].bundle.js',
            path: path.resolve(__dirname, 'static/tactic_js_dev')
        }
    }
    return result
};


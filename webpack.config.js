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
            main_app: './static/tactic_js/main_app.js',
            notebook_app: './static/tactic_js/notebook_app.js',
            library_home_react: './static/tactic_js/library_home_react.js',
            repository_home_react: './static/tactic_js/repository_home_react.js',
            admin_home_react: "./static/tactic_js/admin_home_react.js",
            tile_creator_react: './static/tactic_js/tile_maker_react.js',
            code_viewer_react: './static/tactic_js/code_viewer_react.js',
            list_viewer_react: './static/tactic_js/list_viewer_react.js',
            module_viewer_react: './static/tactic_js/module_viewer_react.js',
            register_react: './static/tactic_js/register_react.js',
            duplicate_user_react: './static/tactic_js/duplicate_user_react.js',
            account_react: './static/tactic_js/account_react.js',
            auth_react: './static/tactic_js/auth_react.js',
            history_viewer_react: './static/tactic_js/history_viewer_react.js',
            tile_differ_react: './static/tactic_js/tile_differ_react.js',
            context_react: './static/tactic_js/context_react.js',
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
                {
                    test: /\.(eot|ttf|woff|woff2|svg|png|gif|jpe?g)$/,
                    include: [
                        path.resolve(__dirname, 'static'),
                        path.resolve(__dirname, 'node_modules/@blueprintjs'),
                        path.resolve(__dirname, 'node_modules/katex'),
                        path.resolve(__dirname, 'node_modules/markdown-it-latex'),
                        path.resolve(__dirname, 'node_modules/highlight.js')
                        ],
                    type: 'asset/resource',
                    dependency: { not: ['url'] }
                    // use: [
                    //     {
                    //         loader: 'url-loader',
                    //         options: {
                    //             limit: 8192,
                    //             name: '[path][name].[ext]',
                    //         }
                    //     }
                    // ]
                    // loader: require.resolve("file-loader"),
                }
            ],
        },
        mode: argv.mode,
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


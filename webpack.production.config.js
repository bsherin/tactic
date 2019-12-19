const path = require('path');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'production',
      optimization: {
        minimizer: [new TerserJSPlugin({extractComments: false,}), new OptimizeCSSAssetsPlugin({})],
      },
    entry: {
      main_app:'./tactic_app/static/tactic_js/main_app.js',
      notebook_app:'./tactic_app/static/tactic_js/notebook_app.js',
      library_home_react: './tactic_app/static/tactic_js/library_home_react.js',
      repository_home_react: './tactic_app/static/tactic_js/repository_home_react.js',
      admin_home_react: "./tactic_app/static/tactic_js/admin_home_react.js",
      tile_creator_react: './tactic_app/static/tactic_js/tile_creator_react.js',
      code_viewer_react: './tactic_app/static/tactic_js/code_viewer_react.js',
      list_viewer_react: './tactic_app/static/tactic_js/list_viewer_react.js',
      module_viewer_react: './tactic_app/static/tactic_js/module_viewer_react.js',
      register_react: './tactic_app/static/tactic_js/register_react.js',
      duplicate_user_react: './tactic_app/static/tactic_js/duplicate_user_react.js',
      account_react: './tactic_app/static/tactic_js/account_react.js',
      auth_react: './tactic_app/static/tactic_js/auth_react.js',
      history_viewer_react: './tactic_app/static/tactic_js/history_viewer_react.js',
      tile_differ_react: './tactic_app/static/tactic_js/tile_differ_react.js'
    },
    plugins: [
        new MiniCssExtractPlugin({
          filename: '[name].css',
          chunkFilename: '[id].css',
        }),
      ],
    output: {
      filename: '[name].production.bundle.js',
      path: path.resolve(__dirname, 'tactic_app/static/tactic_js_dist')
    },
    module: {
        rules: [
            {
             test: /\.(sa|sc|c)ss$/i,
                use: [
                     MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
            ],
       },
        {
            test: /\.(eot|ttf|woff|woff2|svg|png|gif|jpe?g)$/,
            loader: require.resolve("file-loader"),
        },
     ],
   },
  };
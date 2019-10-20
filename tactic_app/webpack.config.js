const path = require('path');

module.exports = {
  entry: {
    main_app:'./static/tactic_js/main_app.js',
    notebook_app:'./static/tactic_js/notebook_app.js',
    library_home_react: './static/tactic_js/library_home_react.js',
    repository_home_react: './static/tactic_js/repository_home_react.js',
    admin_home_react: "./static/tactic_js/admin_home_react.js",
    tile_creator_react: './static/tactic_js/tile_creator_react.js',
    code_viewer_react: './static/tactic_js/code_viewer_react.js',
    list_viewer_react: './static/tactic_js/list_viewer_react.js',
    module_viewer_react: './static/tactic_js/module_viewer_react.js',
    register_react: './static/tactic_js/register_react.js',
    duplicate_user_react: './static/tactic_js/duplicate_user_react.js',
    account_react: './static/tactic_js/account_react.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'static/tactic_js')
  }
};
import os

_develop = ("DEVELOP" in os.environ) and (os.environ.get("DEVELOP") == "True")

if _develop:
    js_source_dict = {"main_app": 'tactic_js_dev/main_app.bundle.js',
                      "notebook_app": 'tactic_js_dev/notebook_app.bundle.js',
                      "library_home_react": 'tactic_js_dev/library_home_react.bundle.js',
                      "repository_home_react": 'tactic_js_dev/repository_home_react.bundle.js',
                      "admin_home_react": "tactic_js_dev/admin_home_react.bundle.js",
                      "tile_creator_react": 'tactic_js_dev/tile_creator_react.bundle.js',
                      "code_viewer_react": 'tactic_js_dev/code_viewer_react.bundle.js',
                      "list_viewer_react": 'tactic_js_dev/list_viewer_react.bundle.js',
                      "module_viewer_react": 'tactic_js_dev/module_viewer_react.bundle.js',
                      "register_react": './tactic_js_dev/register_react.bundle.js',
                      "duplicate_user_react": './tactic_js_dev/duplicate_user_react.bundle.js',
                      "account_react": './tactic_js_dev/account_react.bundle.js',
                      "auth_react": './tactic_js_dev/auth_react.bundle.js',
                      "history_viewer_react": './tactic_js_dev/history_viewer_react.bundle.js',
                      "tile_differ_react": './tactic_js_dev/tile_differ_react.bundle.js'
                      }

else:
    js_source_dict = {"main_app": 'tactic_js_dist/main_app.production.bundle.js',
                      "notebook_app": 'tactic_js_dist/notebook_app.production.bundle.js',
                      "library_home_react": 'tactic_js_dist/library_home_react.production.bundle.js',
                      "repository_home_react": 'tactic_js_dist/repository_home_react.production.bundle.js',
                      "admin_home_react": "tactic_js_dist/admin_home_react.production.bundle.js",
                      "tile_creator_react": 'tactic_js_dist/tile_creator_react.production.bundle.js',
                      "code_viewer_react": 'tactic_js_dist/code_viewer_react.production.bundle.js',
                      "list_viewer_react": 'tactic_js_dist/list_viewer_react.production.bundle.js',
                      "module_viewer_react": 'tactic_js_dist/module_viewer_react.production.bundle.js',
                      "register_react": './tactic_js_dist/register_react.production.bundle.js',
                      "duplicate_user_react": './tactic_js_dist/duplicate_user_react.production.bundle.js',
                      "account_react": './tactic_js_dist/account_react.production.bundle.js',
                      "auth_react": './tactic_js_dist/auth_react.production.bundle.js',
                      "history_viewer_react": './tactic_js_dev/history_viewer_react.bundle.js',
                      "tile_differ_react": './tactic_js_dist/tile_differ_react.production.bundle.js'
                      }


def css_source(entry_name):
    if _develop:
        return "tactic_js_dev/{}.css".format(entry_name)
    else:
        return "tactic_js_dist/{}.css".format(entry_name)
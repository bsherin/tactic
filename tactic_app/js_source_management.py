import os

_develop = ("DEVELOP" in os.environ) and (os.environ.get("DEVELOP") == "True")

if _develop:
    js_source_dict = {"main_app": 'tactic_js/main_app.js',
                      "notebook_app": 'tactic_js/notebook_app.js',
                      "library_home_react": 'tactic_js/library_home_react.js',
                      "repository_home_react": 'tactic_js/repository_home_react.js',
                      "admin_home_react": "tactic_js/admin_home_react.js",
                      "tile_creator_react": 'tactic_js/tile_creator_react.js',
                      "code_viewer_react": 'tactic_js/code_viewer_react.js',
                      "list_viewer_react": 'tactic_js/list_viewer_react.js',
                      "module_viewer_react": 'tactic_js/module_viewer_react.js'}

else:
    js_source_dict = {"main_app": 'tactic_js/main_app.bundle.js',
                      "notebook_app": 'tactic_js/notebook_app.bundle.js',
                      "library_home_react": 'tactic_js/library_home_react.bundle.js',
                      "repository_home_react": 'tactic_js/repository_home_react.bundle.js',
                      "admin_home_react": "tactic_js/admin_home_react.bundle.js",
                      "tile_creator_react": 'tactic_js/tile_creator_react.bundle.js',
                      "code_viewer_react": 'tactic_js/code_viewer_react.bundle.js',
                      "list_viewer_react": 'tactic_js/list_viewer_react.bundle.js',
                      "module_viewer_react": 'tactic_js/module_viewer_react.bundle.js'}

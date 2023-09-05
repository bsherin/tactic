

import PropTypes from 'prop-types';
import { useEffect, useRef, memo, useContext } from "react";
import React from "react";

import CodeMirror from 'codemirror/lib/codemirror'
import 'codemirror/mode/python/python'

import 'codemirror/lib/codemirror.css'

import 'codemirror/addon/merge/merge'
import 'codemirror/addon/merge/merge.css'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/show-hint.css'

import 'codemirror/addon/dialog/dialog'
import 'codemirror/addon/dialog/dialog.css'

import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/search/match-highlighter'

import 'codemirror/theme/material.css'
import 'codemirror/theme/nord.css'
import 'codemirror/theme/oceanic-next.css'
import 'codemirror/theme/pastel-on-dark.css'
import 'codemirror/theme/elegant.css'
import 'codemirror/theme/neat.css'
import 'codemirror/theme/solarized.css'
import 'codemirror/theme/juejin.css'
import {postAjax} from "./communication_react";

import {ThemeContext} from "./theme"

export {ReactCodemirrorMergeView}

function ReactCodemirrorMergeView(props) {

    const code_container_ref = useRef(null);
    const mousetrap = useRef(new Mousetrap());
    const saved_theme = useRef(null);
    const preferred_themes = useRef(null);
    const cmobject = useRef(null);

    const themer = useContext(ThemeContext);

    useEffect(()=>{
        postAjax("get_preferred_codemirror_themes", {}, (data)=> {
            preferred_themes.current = data;
            cmobject.current = createMergeArea(code_container_ref.current);
            resizeHeights(props.max_height);
            refreshAreas();
            create_keymap();
            saved_theme.current = theme.dark_theme
        })
    }, []);

    useEffect(()=>{
        if (!cmobject.current) {
            return
        }

        if (theme.dark_theme != saved_theme.current) {
            postAjax("get_preferred_codemirror_themes", {}, (data) => {
                preferred_themes.current = data;
                cmobject.current.editor().setOption("theme", _current_codemirror_theme());
                cmobject.current.rightOriginal().setOption("theme", _current_codemirror_theme());
                saved_theme.current = theme.dark_theme
            })
        }
        if (cmobject.current.editor().getValue() != props.editor_content) {
            cmobject.current.editor().setValue(props.editor_content)
        }
        cmobject.current.rightOriginal().setValue(props.right_content);
        resizeHeights(props.max_height);
    });

    function _current_codemirror_theme() {
        return theme.dark_theme ? preferred_themes.current.preferred_dark_theme :
            preferred_themes.current.preferred_light_theme;
    }

    function createMergeArea(codearea) {
        let cmobject = CodeMirror.MergeView(codearea, {
            value: props.editor_content,
            lineNumbers: true,
            matchBrackets: true,
            highlightSelectionMatches: true,
            autoCloseBrackets: true,
            indentUnit: 4,
            theme: _current_codemirror_theme(),
            origRight: props.right_content
        });

        cmobject.editor().setOption("extraKeys", {
            Tab: function (cm) {
                let spaces = new Array(5).join(" ");
                cm.replaceSelection(spaces);
            },
            "Ctrl-Space": "autocomplete"
        });

        cmobject.editor().on("change", handleChange);
        return cmobject
    }

    function mergeViewHeight() {
        function editorHeight(editor) {
            return editor ? editor.getScrollInfo().height : 0;
        }
        return Math.max(editorHeight(cmobject.current.editor()), editorHeight(cmobject.current.rightOriginal()));
    }

    function resizeHeights(max_height) {
        var height = Math.min(mergeViewHeight(), max_height);
        cmobject.current.editor().setSize(null, height);
        if (cmobject.current.rightOriginal()) {
            cmobject.current.rightOriginal().setSize(null, height);
        }
        cmobject.current.wrap.style.height = height + "px";
    }

    function handleChange(cm, changeObject) {
        props.handleEditChange(cm.getValue());
        resizeHeights(props.max_height);
    }

    function refreshAreas() {
        cmobject.current.editor().refresh();
        cmobject.current.rightOriginal().refresh()
    }

    function create_api() {
        let self = this;
        postAjax("get_api_dict", {}, function (data) {
            let api_dict_by_category = data.api_dict_by_category;
            let api_dict_by_name = data.api_dict_by_name;
            let ordered_api_categories = data.ordered_api_categories;

            let api_list = [];
            for (let cat of ordered_api_categories) {
                for (let entry of api_dict_by_category[cat]) {
                    api_list.push(entry["name"])
                }
            }
            //noinspection JSUnresolvedVariable
            CodeMirror.commands.autocomplete = function (cm) {
                //noinspection JSUnresolvedFunction
                cm.showHint({
                    hint: CodeMirror.hint.anyword, api_list: api_list,
                    extra_autocomplete_list: extra_autocomplete_list
                });
            };
        })
    }

    function searchCM() {
        CodeMirror.commands.find(cmobject.current)
    }

    function clearSelections() {
        CodeMirror.commands.clearSearch(cmobject.current.editor());
        CodeMirror.commands.singleSelection(cmobject.current.editor());
    }

    function create_keymap() {
        let self = this;
        CodeMirror.keyMap["default"]["Esc"] = function () {clearSelections()};
        let is_mac = CodeMirror.keyMap["default"].hasOwnProperty("Cmd-S");

        mousetrap.current.bind(['escape'], function (e) {
            clearSelections();
            e.preventDefault()
        });

        if (is_mac) {
            CodeMirror.keyMap["default"]["Cmd-S"] = function () {props.saveMe()};

            mousetrap.current.bind(['command+f'], function (e) {
                searchCM();
                e.preventDefault()
            });
        }
        else {
            CodeMirror.keyMap["default"]["Ctrl-S"] = function () {props.saveMe()};

            mousetrap.current.bind(['ctrl+f'], function (e) {
                searchCM();
                e.preventDefault()
            });
        }
    }
    let ccstyle = {
        "height": "100%"
    };
    return (
        <div className="code-container" style={ccstyle} ref={code_container_ref}>

        </div>
    )
}

ReactCodemirrorMergeView.propTypes = {
    handleEditChange: PropTypes.func,
    editor_content: PropTypes.string,
    right_content: PropTypes.string,
    saveMe: PropTypes.func,
};

ReactCodemirrorMergeView = memo(ReactCodemirrorMergeView);
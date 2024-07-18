

import { useEffect, useRef, memo, useMemo, useContext } from "react";
import React from "react";

import { useHotkeys } from "@blueprintjs/core";

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
import {postAjaxPromise} from "./communication_react";

import {ThemeContext} from "./theme"

export {ReactCodemirrorMergeView}

function ReactCodemirrorMergeView(props) {

    const code_container_ref = useRef(null);
    const saved_theme = useRef(null);
    const preferred_themes = useRef(null);
    const cmobject = useRef(null);

    const theme = useContext(ThemeContext);

    const hotkeys = useMemo(
        () => [
            {
                combo: "Ctrl+S",
                global: false,
                group: "Merge Viewer",
                label: "Save Code",
                onKeyDown: props.saveMe
            },
            {
                combo: "Escape",
                global: false,
                group: "Merge Viewer",
                label: "Clear Selections",
                onKeyDown: (e)=>{
                    clearSelections();
                    e.preventDefault()
                }
            },
            {   combo: "Ctrl+F",
                global: false,
                group: "Merge Viewer",
                label: "Search Code",
                onKeyDown: (e)=>{
                    searchCM();
                    e.preventDefault()
                }
            },
        ],
        [props.saveMe],
    );
    const { handleKeyDown, handleKeyUp } = useHotkeys(hotkeys);

    useEffect(()=> {
        postAjaxPromise("get_preferred_codemirror_themes", {})
            .then((data) => {
                preferred_themes.current = data;
                cmobject.current = createMergeArea(code_container_ref.current);
                resizeHeights(props.max_height);
                refreshAreas();
                create_keymap();
                saved_theme.current = theme.dark_theme
            })
            .catch((e) =>{
                errorDrawerFuncs.addFromError("Error getting preferred theme", e);
                return
            })
    }, []);

    useEffect(()=>{
        if (!cmobject.current) {
            return
        }
        if (theme.dark_theme != saved_theme.current) {
            postAjaxPromise("get_preferred_codemirror_themes", {})
            .then((data) => {
                preferred_themes.current = data;
                cmobject.current.editor().setOption("theme", _current_codemirror_theme());
                cmobject.current.rightOriginal().setOption("theme", _current_codemirror_theme());
                saved_theme.current = theme.dark_theme
            })
            .catch((e) =>{
                errorDrawerFuncs.addFromError("Error getting preferred theme", e);
                return
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

    async function create_api() {
        let data = await postAjaxPromise("get_api_dict", {});
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
    }

    function searchCM() {
        // CodeMirror.commands.find(cmobject.current)
    }

    function clearSelections() {
        cmobject.current.editor().setSelection({ line: 0, ch: 0 });
        cmobject.current.rightOriginal().setSelection({ line: 0, ch: 0 });
    }

    function create_keymap() {
        CodeMirror.keyMap["default"]["Esc"] = function () {clearSelections()};
        let is_mac = CodeMirror.keyMap["default"].hasOwnProperty("Cmd-S");

        if (is_mac) {
            CodeMirror.keyMap["default"]["Ctrl-S"] = function () {props.saveMe()};
        }
        else {
            CodeMirror.keyMap["default"]["Ctrl-S"] = function () {
                props.saveMe()
            };
        }
        CodeMirror.keyMap["default"]["Ctrl-F"] = function (e) {
            searchCM()
        };
    }
    let ccstyle = {
        "height": "100%"
    };
    return (
        <div className="code-container" style={ccstyle} ref={code_container_ref}
            tabIndex="0" onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>

        </div>
    )
}

ReactCodemirrorMergeView = memo(ReactCodemirrorMergeView);
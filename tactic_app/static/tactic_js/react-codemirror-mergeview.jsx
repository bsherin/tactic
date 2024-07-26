

import { useEffect, useRef, memo, useMemo, useContext, Fragment } from "react";
import React from "react";
import {Helmet} from 'react-helmet';
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

import {postAjaxPromise} from "./communication_react";

import {SettingsContext} from "./settings"

export {ReactCodemirrorMergeView}

function ReactCodemirrorMergeView(props) {

    const code_container_ref = useRef(null);
    const cmobject = useRef(null);

    const settingsContext = useContext(SettingsContext);

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
        let current_theme = _current_codemirror_theme();
        cmobject.current = createMergeArea(code_container_ref.current);
        cmobject.current.editor().setOption("theme", current_theme);
        cmobject.current.rightOriginal().setOption("theme", current_theme);
        resizeHeights(props.max_height);
        refreshAreas();
        create_keymap();
    }, []);

    useEffect(()=>{
        if (!cmobject.current) {
            return
        }
        if (cmobject.current.editor().getValue() != props.editor_content) {
            cmobject.current.editor().setValue(props.editor_content)
        }
        cmobject.current.rightOriginal().setValue(props.right_content);
        resizeHeights(props.max_height);
    });

    useEffect(()=>{
        if (!cmobject.current) {
            return
        }
        let current_theme = _current_codemirror_theme();
        cmobject.current.editor().setOption("theme", current_theme);
        cmobject.current.rightOriginal().setOption("theme", current_theme);
    }, [settingsContext.settings.theme, settingsContext.settings.preferred_dark_theme, settingsContext.settings.preferred_light_theme]);

    function isDark() {
        return settingsContext.settingsRef.current.theme == "dark";
    }

    function _current_codemirror_theme() {
        return isDark() ? settingsContext.settingsRef.current.preferred_dark_theme :
            settingsContext.settingsRef.current.preferred_light_theme;
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
    const tTheme = settingsContext.settingsRef.current.theme;
    return (
        <Fragment>
            <Helmet>
                <link rel="stylesheet"
                      href={`/static/tactic_css/codemirror_${tTheme}/${_current_codemirror_theme()}.css`}
                      type="text/css"/>
            </Helmet>
            <div className="code-container" style={ccstyle} ref={code_container_ref}
                 tabIndex="0" onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>

            </div>
        </Fragment>
    )
}

ReactCodemirrorMergeView = memo(ReactCodemirrorMergeView);
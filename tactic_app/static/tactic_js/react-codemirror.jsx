import React from "react";
import {Fragment, useEffect, useRef, memo, useLayoutEffect, useContext} from "react";

import {Button, ButtonGroup} from "@blueprintjs/core";
import {Helmet} from 'react-helmet';

//import {postAjaxPromise} from "./communication_react"
import {useSize} from "./sizing_tools";


import CodeMirror from 'codemirror/lib/codemirror';
import 'codemirror/mode/python/python';
import 'codemirror/lib/codemirror.css'

import 'codemirror/addon/merge/merge'
import 'codemirror/addon/merge/merge.css'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/indent-fold'
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/display/autorefresh'


import 'codemirror/addon/dialog/dialog'
import 'codemirror/addon/dialog/dialog.css'

import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/search/match-highlighter'

import {propsAreEqual} from "./utilities_react";
import {SettingsContext} from "./settings"
import {SelectedPaneContext} from "./utilities_react";

export {ReactCodemirror}
import './autocomplete'
import {ErrorDrawerContext} from "./error_drawer";
import {SearchForm} from "./library_widgets";

const REGEXTYPE = Object.getPrototypeOf(new RegExp("that"));
const TITLE_STYLE = {display: "flex", paddingLeft: 5, paddingBottom: 2, alignItems: "self-end"};


function isRegex(ob) {
    return Object.getPrototypeOf(ob) == REGEXTYPE
}

function countOccurrences(query, the_text) {
    if (isRegex(query)) {
        const split_text = the_text.split(/\r?\n/);
        let total = 0;
        for (let str of split_text) {
            total += (str.match(query) || []).length
        }
        return total
    } else {
        return the_text.split(query).length - 1
    }
}

function ReactCodemirror(props) {
    props = {
        iCounter: 0,
        no_width: false,
        no_height: false,
        show_search: false,
        first_line_number: 1,
        show_line_numbers: true,
        show_fold_button: false,
        soft_wrap: false,
        code_container_height: null,
        code_container_width: null,
        search_term: null,
        update_search_state: null,
        alt_clear_selections: null,
        regex_search: false,
        handleChange: null,
        handleBlur: null,
        handleFocus: null,
        sync_to_prop: false,
        force_sync_to_prop: false,
        clear_force_sync: null,
        mode: "python",
        readOnly: false,
        extraKeys: {},
        setCMObject: null,
        code_container_ref: null,
        setSearchMatches: null,
        current_search_number: null,
        extra_autocomplete_list: [],
        ...props
    };
    const localRef = useRef(null);
    const preferred_themes = useRef(null);
    const cmobject = useRef(null);
    const overlay = useRef(null);
    const matches = useRef(null);
    const search_focus_info = useRef(null);
    const first_render = useRef(true);
    const prevSoftWrap = useRef(null);
    const registeredHandlers = useRef([]);

    const settingsContext = useContext(SettingsContext);
    const errorDrawerFuncs = useContext(ErrorDrawerContext);

    const [usable_width, usable_height, topX, topY] = useSize(localRef, props.iCounter, "CodeMirror");

    useEffect(() => {
        prevSoftWrap.current = props.soft_wrap;
        if (props.registerSetFocusFunc) {
            props.registerSetFocusFunc(setFocus);
        }

        cmobject.current = createCMArea(localRef.current, props.first_line_number);
        cmobject.current.setValue(props.code_content);
        cmobject.current.setOption("theme", _current_codemirror_theme());
        cmobject.current.setOption("extra_autocomplete_list", props.extra_autocomplete_list);
        create_keymap();
        if (props.setCMObject != null) {
            props.setCMObject(cmobject.current)
        }
        cmobject.current.refresh();
        _doHighlight();
    }, []);

    useEffect(()=>{
        if (!cmobject.current) {
            return
        }
        cmobject.current.setOption("theme", _current_codemirror_theme());
        cmobject.current.refresh();
    }, [settingsContext.settings.theme, settingsContext.settings.preferred_dark_theme, settingsContext.settings.preferred_light_theme]);

    useLayoutEffect(() => {
        return (() => {
            if (cmobject.current) {
                cmobject.current.refresh();
                for (let [event, handler] of registeredHandlers.current) {
                    cmobject.current.off(event, handler)
                }
                delete CodeMirror.keyMap["default"].Esc;
                cmobject.current.setOption("extraKeys", null);
                cmobject.current = null;
                if (localRef.current) {
                    localRef.current.innerHTML = '';
                }
            }
        });
    }, []);

    useEffect(()=>{
        _doHighlight();
    }, [props.search_term, props.current_search_number]);

    useEffect(() => {
        if (!cmobject.current) {
            return
        }

        if (props.soft_wrap != prevSoftWrap.current) {
            cmobject.current.setOption("lineWrapping", props.soft_wrap);
            prevSoftWrap.current = props.soft_wrap;
        }
        if (props.sync_to_prop || props.force_sync_to_prop) {
            cmobject.current.setValue(props.code_content);
            if (props.force_sync_to_prop) {
                props.clear_force_sync()
            }
        }
        if (props.first_line_number != 1) {
            cmobject.current.setOption("firstLineNumber", props.first_line_number);
        }
        cmobject.current.setOption("extra_autocomplete_list", props.extra_autocomplete_list);

        set_keymap();
    });

    const selectedPane = useContext(SelectedPaneContext);

    function isDark() {
        return settingsContext.settingsRef.current.theme == "dark";
    }

    function setFocus() {
        if (cmobject.current) {
            cmobject.current.focus();
            cmobject.current.setCursor({line: 0, ch: 0});
        }
    }

    function _current_codemirror_theme() {
        return isDark() ? settingsContext.settingsRef.current.preferred_dark_theme :
            settingsContext.settingsRef.current.preferred_light_theme;
    }

    function createCMArea(codearea, first_line_number = 1) {

        let lcmobject = CodeMirror(codearea, {
            lineNumbers: props.show_line_numbers,
            lineWrapping: props.soft_wrap,
            matchBrackets: true,
            highlightSelectionMatches: true,
            autoCloseBrackets: true,
            indentUnit: 4,
            theme: _current_codemirror_theme(),
            mode: props.mode,
            readOnly: props.readOnly,
            foldGutter: true,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            foldOptions: {
                minFoldSize: 6
            },
            autoRefresh: true
        });
        if (first_line_number != 1) {
            lcmobject.setOption("firstLineNumber", first_line_number)
        }

        let all_extra_keys = Object.assign(props.extraKeys, {
                Tab: function (cm) {
                    let spaces = new Array(5).join(" ");
                    cm.replaceSelection(spaces);
                },
                "Ctrl-Space": "autocomplete"
            }
        );

        lcmobject.setOption("extraKeys", all_extra_keys);
        lcmobject.setSize("100%", "100%");
        lcmobject.on("change", handleChange);
        lcmobject.on("blur", handleBlur);
        lcmobject.on("focus", handleFocus);
        registeredHandlers.current = registeredHandlers.current.concat([["change", handleChange], ["blur", handleBlur], ["focus", handleFocus]]);
        return lcmobject
    }

    function handleChange(cm, changeObject) {
        if (props.handleChange) {
            props.handleChange(cm.getDoc().getValue())
        }
    }

    function handleBlur(cm, changeObject) {
        if (props.handleBlur) {
            props.handleBlur(cm.getDoc().getValue())
        }
    }

    function handleFocus(cm, changeObject) {
        if (props.handleFocus) {
            props.handleFocus()
        }
    }

    function _searchMatcher(term, global = false) {
        let matcher;
        if (props.regex_search) {
            try {
                matcher = global ? new RegExp(term, "g") : new RegExp(term)
            } catch (e) {
                matcher = term
            }
        } else {
            matcher = term
        }
        return matcher
    }

    function _lineNumberFromSearchNumber() {
        let lines = props.code_content.split("\n");
        let lnum = 0;
        let mnum = 0;
        let matcher = _searchMatcher(props.search_term);
        for (let line of lines) {
            let new_matches = (line.match(matcher) || []).length;
            if (new_matches + mnum - 1 >= props.current_search_number) {
                return {line: lnum, match: props.current_search_number - mnum};
            }
            mnum += new_matches;
            lnum += 1
        }
        return null
    }

    function _doHighlight() {
        try {
            if (!cmobject.current) return;
            if (props.search_term == null || props.search_term == "") {
                cmobject.current.operation(function () {
                    _removeOverlay()
                })
            } else {
                if (props.current_search_number != null) {
                    search_focus_info.current = {..._lineNumberFromSearchNumber()};
                    if (search_focus_info.current) {
                        _scrollToLine(search_focus_info.current.line)
                    }
                } else {
                    search_focus_info.current = null;
                }
                cmobject.current.operation(function () {
                    _removeOverlay();
                    _addOverlay(props.search_term);
                });
            }
        } catch (e) {
            console.log(e.message)
        }
    }

    function _scrollToLine(lnumber) {
        cmobject.current.scrollIntoView({line: lnumber, char: 0}, 50);
        window.scrollTo(0, 0)  // A kludge. Without it whole window can move when switching contexts
    }

    function _addOverlay(query, hasBoundary = false, style = "searchhighlight", focus_style = "focussearchhighlight") {
        let prev_matches = matches.current;
        var reg = _searchMatcher(query, true);
        matches.current = countOccurrences(reg, props.code_content);
        if (props.setSearchMatches && matches.current != prev_matches) {
            props.setSearchMatches(matches.current)
        }
        overlay.current = _makeOverlay(query, hasBoundary, style, focus_style);
        cmobject.current.addOverlay(overlay.current);
    }

    function _makeOverlay(query, hasBoundary, style, focus_style) {
        let last_line = -1;
        let line_counter = -1;
        let matcher = _searchMatcher(query);
        return {
            token: function (stream) {
                if (stream.match(matcher) &&
                    (!hasBoundary || _boundariesAround(stream, hasBoundary))) {
                    let lnum = stream.lineOracle.line;

                    if (search_focus_info.current && lnum == search_focus_info.current.line) {
                        if (lnum != last_line) {
                            line_counter = 0;
                            last_line = lnum
                        } else {
                            line_counter += 1
                        }
                        if (line_counter == search_focus_info.current.match) {
                            return focus_style
                        }
                    } else {
                        last_line = -1;
                        line_counter = -1;
                    }
                    return style;
                }

                stream.next();
                if (!isRegex(matcher)) {
                    stream.skipTo(query.charAt(0)) || stream.skipToEnd();
                }
            }
        };
    }

    function _boundariesAround(stream, re) {
        return (!stream.start || !re.test(stream.string.charAt(stream.start - 1))) &&
            (stream.pos == stream.string.length || !re.test(stream.string.charAt(stream.pos)));
    }

    function _removeOverlay() {
        if (overlay.current) {
            cmobject.current.removeOverlay(overlay.current);
            overlay.current = null;
        }
    }

    function searchCM() {
        CodeMirror.commands.find(cmobject.current)
    }

    function _foldAll() {
        CodeMirror.commands.foldAll(cmobject.current)
    }

    function _unfoldAll() {
        CodeMirror.commands.unfoldAll(cmobject.current)
    }

    function clearSelections() {
        if (props.alt_clear_selections) {
            props.alt_clear_selections()
        } else {
            let to = cmobject.current.getCursor("to");
            cmobject.current.setCursor(to);
        }
        if (props.update_search_state) {
            props.update_search_state({search_string: ""})
        }
    }

    function set_keymap() {
        if (selectedPane.amSelected(selectedPane.tab_id, selectedPane.selectedTabIdRef)) {
            CodeMirror.keyMap["default"]["Esc"] = function () {
                clearSelections()
            }
        } else {
            delete CodeMirror.keyMap["default"].Esc
        }
    }

    function create_keymap() {
        set_keymap();
        let is_mac = CodeMirror.keyMap["default"].hasOwnProperty("Cmd-S");
    }

    let ccstyle = {
        lineHeight: "21px",
    };
    if (!props.no_height) {
        ccstyle.height = usable_height
    }

    if (!props.no_width) {
        ccstyle.width = usable_width
    }

    let bgstyle = null;
    if (props.show_fold_button) {
        if (usable_width > 175) {
            bgstyle = {
                position: "fixed",
                left: topX + usable_width - 135 - 15,
                top: topY + usable_height - 35,
                zIndex: 1
            };
            if (first_render.current) {
                bgstyle.top -= 10;
                first_render.current = false
            }
        }
    }
    const tTheme = settingsContext.settingsRef.current.theme;
    if (props.show_search) {
        let title_label = props.title_label ? props.title_label : "";
        return (
            <Fragment>
                <Helmet>
                    <link rel="stylesheet" href={`/static/tactic_css/codemirror_${tTheme}/${_current_codemirror_theme()}.css`} type="text/css"/>
                </Helmet>
                <div style={{
                    display: "flex", flexDirection: "row", justifyContent: "space-between",
                    marginRight: 10,
                    width: "100%"
                }}>
                    <span className="bp5-ui-text"
                          style={{
                              display: "flex",
                              paddingLeft: 5,
                              paddingBottom: 2,
                              alignItems: "self-end"
                          }}>{title_label}</span>
                    <SearchForm update_search_state={props.updateSearchState}
                                search_string={props.search_term}
                                regex={props.regex_search}
                                allow_regex={true}
                                field_width={200}
                                include_search_jumper={true}
                                searchPrev={props.searchPrev}
                                searchNext={props.searchNext}
                                search_ref={props.search_ref}
                                number_matches={props.search_matches}
                    />
                </div>
                {props.show_fold_button && bgstyle &&
                    <ButtonGroup minimal={false} style={bgstyle}>
                        <Button small={true} icon="collapse-all" text="fold" onClick={_foldAll}/>
                        <Button small={true} icon="expand-all" text="unfold" onClick={_unfoldAll}/>
                    </ButtonGroup>
                }
                <div className="code-container" style={ccstyle} ref={localRef}>

                </div>

            </Fragment>
        )
    }

    return (
        <Fragment>
            <Helmet>
                <link rel="stylesheet" href={`/static/tactic_css/codemirror_${tTheme}/${_current_codemirror_theme()}.css`} type="text/css"/>
            </Helmet>
            {props.show_fold_button && bgstyle &&
                <ButtonGroup minimal={false} style={bgstyle}>
                    <Button small={true} icon="collapse-all" text="fold" onClick={_foldAll}/>
                    <Button small={true} icon="expand-all" text="unfold" onClick={_unfoldAll}/>
                </ButtonGroup>

            }
            {props.title_label &&
                <span className="bp5-ui-text"
                      style={TITLE_STYLE}>{props.title_label}</span>
            }
            <div className="code-container" style={ccstyle} ref={localRef}>

            </div>
        </Fragment>
    )
}

ReactCodemirror = memo(ReactCodemirror, (prevProps, newProps) => {
    propsAreEqual(prevProps, newProps, ["extraKeys"])
});

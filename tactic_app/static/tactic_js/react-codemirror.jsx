
import React from "react";
import { Fragment, useEffect, useRef, memo, forwardRef } from "react";
import PropTypes from 'prop-types';

import { Button, ButtonGroup } from "@blueprintjs/core";

import {postAjax, postAjaxPromise} from "./communication_react"

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

import 'codemirror/theme/material.css'
import 'codemirror/theme/nord.css'
import 'codemirror/theme/oceanic-next.css'
import 'codemirror/theme/pastel-on-dark.css'
import 'codemirror/theme/elegant.css'
import 'codemirror/theme/neat.css'
import 'codemirror/theme/solarized.css'
import 'codemirror/theme/juejin.css'
import {doFlash} from "./toaster";

import {propsAreEqual} from "./utilities_react";

export {ReactCodemirror}
import './autocomplete'

const REGEXTYPE = Object.getPrototypeOf(new RegExp("that"));

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
    }
    else {
        return the_text.split(query).length - 1
    }
}

function ReactCodemirror(props, passedRef) {
    const localRef = useRef(null);
    const code_container_ref = useRef(passedRef ? passedRef : localRef);
    const mousetrap = useRef(new Mousetrap());
    const saved_theme = useRef(null);
    const preferred_themes = useRef(null);
    const cmobject = useRef(null);
    const overlay = useRef(null);
    const matches = useRef(null);
    const search_focus_info = useRef(null);
    const first_render = useRef(true);
    const prevSoftWrap = useRef(null);

    useEffect(()=>{
        prevSoftWrap.current = props.soft_wrap;
        if (props.registerSetFocusFunc) {
            props.registerSetFocusFunc(setFocus);
        }
        postAjaxPromise('get_preferred_codemirror_themes', {})
            .then((data) => {
                    preferred_themes.current = data;
                    cmobject.current = createCMArea(code_container_ref.current.current, props.first_line_number);
                    cmobject.current.setValue(props.code_content);
                    cmobject.current.setOption("extra_autocomplete_list", props.extra_autocomplete_list);
                    create_keymap();
                    if (props.setCMObject != null) {
                        props.setCMObject(cmobject.current)
                    }
                    saved_theme.current = props.dark_theme;
                    _doHighlight()
                }
            )
            .catch((data) => {doFlash(data)});
    }, []);

    useEffect(()=>{
        if (!cmobject.current) {
            return
        }
        if (props.dark_theme != saved_theme.current) {
            postAjax("get_preferred_codemirror_themes", {}, (data)=> {
                preferred_themes.current = data;
                cmobject.current.setOption("theme", _current_codemirror_theme());
                saved_theme.current = props.dark_theme
            })
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
        _doHighlight();
        set_keymap()
    });

    function setFocus() {
        if (cmobject.current) {
            cmobject.current.focus();
            cmobject.current.setCursor({line: 0, ch: 0});
        }
    }

    function _current_codemirror_theme() {
        return props.dark_theme ? preferred_themes.current.preferred_dark_theme :
                preferred_themes.current.preferred_light_theme;
    }

    function createCMArea(codearea, first_line_number = 1) {

        let cmobject = CodeMirror(codearea, {
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
            cmobject.setOption("firstLineNumber", first_line_number)
        }

        let all_extra_keys = Object.assign(props.extraKeys, {
            Tab: function (cm) {
                    let spaces = new Array(5).join(" ");
                    cm.replaceSelection(spaces);
                },
                "Ctrl-Space": "autocomplete"
            }
        );

        cmobject.setOption("extraKeys", all_extra_keys);
        cmobject.setSize("100%", "100%");
        cmobject.on("change", handleChange);
        cmobject.on("blur", handleBlur);
        cmobject.on("focus", handleFocus);
        return cmobject
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

    function _searchMatcher(term, global=false) {
        let matcher;
        if (props.regex_search) {
            try {
                matcher = global ? new RegExp(term, "g"): new RegExp(term)
            }
            catch(e) {
                matcher = term
            }
        }
        else {
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
            if (props.search_term == null || props.search_term == "") {
                cmobject.current.operation(function() {
                    _removeOverlay()
                })
            }
            else{
                if (props.current_search_number != null) {
                    search_focus_info.current = {..._lineNumberFromSearchNumber()};
                    if (search_focus_info.current) {
                        _scrollToLine(search_focus_info.current.line)
                    }
                }
                else {
                    search_focus_info.current = null;
                }
                cmobject.current.operation(function() {
                    _removeOverlay();
                    _addOverlay(props.search_term);
                });
            }
        }
        catch(e) {
            console.log(e.message)
        }
    }

    function _scrollToLine(lnumber) {
        cmobject.current.scrollIntoView({line: lnumber, char: 0}, 50);
        window.scrollTo(0, 0)  // A kludge. Without it whole window can move when switching contexts
    }

    function _addOverlay(query, hasBoundary=false, style="searchhighlight", focus_style="focussearchhighlight") {
        // var state = cm.state.matchHighlighter;
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
        return {token: function(stream) {
          if (stream.match(matcher) &&
              (!hasBoundary || _boundariesAround(stream, hasBoundary))) {
              let lnum = stream.lineOracle.line;

              if (search_focus_info.current && lnum == search_focus_info.current.line) {
                  if (lnum != last_line) {
                      line_counter = 0;
                      last_line = lnum
                  }
                  else {
                      line_counter += 1
                  }
                  if (line_counter == search_focus_info.current.match) {
                      return focus_style
                  }
              }
              else {
                  last_line = -1;
                  line_counter = -1;
              }
              return style;
          }

          stream.next();
          if (!isRegex(matcher)) {
              stream.skipTo(query.charAt(0)) || stream.skipToEnd();
          }
        }};
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
        }
        else {
            let to = cmobject.current.getCursor("to");
            cmobject.current.setCursor(to);
        }
        if (props.update_search_state) {
            props.update_search_state({search_string: ""})
        }
    }

    function set_keymap() {
        if (props.am_selected) {
            CodeMirror.keyMap["default"]["Esc"] = function () {
                clearSelections()
            }
        }
        else {
            delete CodeMirror.keyMap["default"].esc
        }
    }

    function create_keymap() {
        set_keymap();
        let is_mac = CodeMirror.keyMap["default"].hasOwnProperty("Cmd-S");

        mousetrap.current.bind(['escape'], function (e) {
            if (!props.am_selected) {
                return false;
            }
            clearSelections();
            e.preventDefault()
        });
    }

    let ccstyle = {
        "height": props.code_container_height,
        "width": props.code_container_width,
        lineHeight: "21px",
    };

    let bgstyle = null;
    if (props.show_fold_button && code_container_ref.current && code_container_ref.current.current) {
        let cc_rect = code_container_ref.current.current.getBoundingClientRect();
        if (cc_rect.width > 175) {
            bgstyle = {
                position: "absolute",
                left: cc_rect.left + cc_rect.width - 135 - 15,
                top: cc_rect.top + cc_rect.height - 35
            };
            if (first_render.current) {
                bgstyle.top -= 10;
                first_render.current = false
            }
        }


    }
    return (
         <Fragment>
             {props.show_fold_button && bgstyle &&
                 <ButtonGroup minimal={false} style={bgstyle}>
                    <Button small={true} icon="collapse-all" text="fold" onClick={_foldAll}/>
                     <Button small={true}  icon="expand-all"  text="unfold" onClick={_unfoldAll}/>
                </ButtonGroup>

             }
            <div className="code-container" style={ccstyle} ref={code_container_ref.current}>

            </div>
         </Fragment>
    )
}

ReactCodemirror = memo(forwardRef(ReactCodemirror), (prevProps, newProps)=>{
    propsAreEqual(prevProps, newProps, ["extraKeys"])
});

ReactCodemirror.propTypes = {
    am_selected: PropTypes.bool,
    handleChange: PropTypes.func,
    show_line_numbers: PropTypes.bool,
    show_fold_button: PropTypes.bool,
    soft_wrap: PropTypes.bool,
    handleBlur: PropTypes.func,
    handleFocus: PropTypes.func,
    code_content: PropTypes.string,
    sync_to_prop: PropTypes.bool,
    force_sync_to_prop: PropTypes.bool,
    clear_force_sync: PropTypes.func,
    mode: PropTypes.string,
    saveMe: PropTypes.func,
    first_line_number: PropTypes.number,
    extraKeys: PropTypes.object,
    setCMObject: PropTypes.func,
    search_term: PropTypes.string,
    update_search_state: PropTypes.func,
    alt_clear_selections: PropTypes.func,
    regex_search: PropTypes.bool,
    code_container_ref: PropTypes.object,
    code_container_width: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number]),
    code_container_height: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number]),
    setSearchMatches: PropTypes.func,
    current_search_number: PropTypes.number,
    extra_autocomplete_list: PropTypes.array
};

ReactCodemirror.defaultProps = {
    am_selected: true,
    first_line_number: 1,
    show_line_numbers: true,
    show_fold_button: false,
    soft_wrap: false,
    code_container_height: "100%",
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
    code_container_width: "100%",
    setSearchMatches: null,
    current_search_number: null,
    extra_autocomplete_list: [],
};
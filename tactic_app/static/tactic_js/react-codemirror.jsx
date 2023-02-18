
import React from "react";
import PropTypes from 'prop-types';

import { Button, ButtonGroup } from "@blueprintjs/core";

import {postAjax, postAjaxPromise} from "./communication_react.js"

import CodeMirror from 'codemirror/lib/codemirror.js';
import 'codemirror/mode/python/python.js';
import 'codemirror/lib/codemirror.css'

import 'codemirror/addon/merge/merge.js'
import 'codemirror/addon/merge/merge.css'
import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/fold/foldcode.js'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/fold/indent-fold.js'
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/display/autorefresh.js'
// import 'codemirror/addon/hint/anyword-hint.js'

import 'codemirror/addon/dialog/dialog.js'
import 'codemirror/addon/dialog/dialog.css'

import 'codemirror/addon/edit/matchbrackets.js'
import 'codemirror/addon/edit/closebrackets.js'
import 'codemirror/addon/search/match-highlighter.js'

import 'codemirror/theme/material.css'
import 'codemirror/theme/nord.css'
import 'codemirror/theme/oceanic-next.css'
import 'codemirror/theme/pastel-on-dark.css'
import 'codemirror/theme/elegant.css'
import 'codemirror/theme/neat.css'
import 'codemirror/theme/solarized.css'
import 'codemirror/theme/juejin.css'
import {propsAreEqual} from "./utilities_react";
import {doFlash} from "./toaster";

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

class ReactCodemirror extends React.Component {

    constructor(props) {
        super(props);
        if (this.props.code_container_ref) {
            this.code_container_ref = this.props.code_container_ref
        }
        else {
            this.code_container_ref = React.createRef();
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this._current_codemirror_theme = this._current_codemirror_theme.bind(this);
        this._foldAll = this._foldAll.bind(this);
        this._unfoldAll = this._unfoldAll.bind(this);
        this.clearSelections = this.clearSelections.bind(this);
        this.mousetrap = new Mousetrap();
        this.saved_theme = null;
        this.overlay = null;
        this.matches = null;
        this.search_focus_info = null;
        this.first_render = true;
    }

    _current_codemirror_theme() {
        return this.props.dark_theme ? this.preferred_themes.preferred_dark_theme :
                this.preferred_themes.preferred_light_theme;
    }

    createCMArea(codearea, first_line_number = 1) {

        let cmobject = CodeMirror(codearea, {
            lineNumbers: this.props.show_line_numbers,
            lineWrapping: this.props.soft_wrap,
            matchBrackets: true,
            highlightSelectionMatches: true,
            autoCloseBrackets: true,
            indentUnit: 4,
            theme: this._current_codemirror_theme(),
            mode: this.props.mode,
            readOnly: this.props.readOnly,
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

        let all_extra_keys = Object.assign(this.props.extraKeys, {
            Tab: function (cm) {
                    let spaces = new Array(5).join(" ");
                    cm.replaceSelection(spaces);
                },
                "Ctrl-Space": "autocomplete"
            }
        );

        cmobject.setOption("extraKeys", all_extra_keys);
        cmobject.setSize("100%", "100%");
        cmobject.on("change", this.handleChange);
        cmobject.on("blur", this.handleBlur);
        return cmobject
    }

    handleChange(cm, changeObject) {
        if (this.props.handleChange) {
            this.props.handleChange(cm.getDoc().getValue())
        }
    }

    handleBlur(cm, changeObject) {
        if (this.props.handleBlur) {
            this.props.handleBlur(cm.getDoc().getValue())
        }
    }

    componentDidMount() {
        let self = this;
        postAjaxPromise('get_preferred_codemirror_themes', {})
            .then((data) => {
                    self.preferred_themes = data;
                    self.cmobject = self.createCMArea(this.code_container_ref.current, this.props.first_line_number);
                    self.cmobject.setValue(this.props.code_content);
                    self.cmobject.setOption("extra_autocomplete_list", self.props.extra_autocomplete_list);
                    self.create_keymap();
                    if (self.props.setCMObject != null) {
                        self.props.setCMObject(self.cmobject)
                    }
                    self.saved_theme = self.props.dark_theme;
                    self._doHighlight()
                }
            )
            .catch((data) => {doFlash(data)});
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !propsAreEqual(nextProps, this.props, ["extraKeys"])
    }

    componentDidUpdate(prevProps) {
        if (!this.cmobject) {
            return
        }
        let self = this;
        if (this.props.dark_theme != this.saved_theme) {
            postAjax("get_preferred_codemirror_themes", {}, (data)=> {
                self.preferred_themes = data;
                self.cmobject.setOption("theme", self._current_codemirror_theme());
                self.saved_theme = this.props.dark_theme
            })
        }
        if (this.props.soft_wrap != prevProps.soft_wrap) {
            this.cmobject.setOption("lineWrapping", this.props.soft_wrap)
        }
        if (this.props.sync_to_prop || this.props.force_sync_to_prop) {
            this.cmobject.setValue(this.props.code_content);
            if (this.props.force_sync_to_prop) {
                this.props.clear_force_sync()
            }
        }
        if (this.props.first_line_number != 1) {
            this.cmobject.setOption("firstLineNumber", this.props.first_line_number);
        }
        this.cmobject.setOption("extra_autocomplete_list", self.props.extra_autocomplete_list);
        this._doHighlight();
        this.set_keymap()
    }

    _searchMatcher(term, global=false) {
        let matcher;
        if (this.props.regex_search) {
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

    _lineNumberFromSearchNumber() {
        let lines = this.props.code_content.split("\n");
        let lnum = 0;
        let mnum = 0;
        let matcher = this._searchMatcher(this.props.search_term);
        for (let line of lines) {
            let new_matches = (line.match(matcher) || []).length;
            if (new_matches + mnum - 1 >= this.props.current_search_number) {
                return {line: lnum, match: this.props.current_search_number - mnum};
            }
            mnum += new_matches;
            lnum += 1
        }
        return null
    }

    _doHighlight() {
        let self = this;
        try {
            if (this.props.search_term == null || this.props.search_term == "") {
                this.cmobject.operation(function() {
                    self._removeOverlay()
                })
            }
            else{
                if (this.props.current_search_number != null) {
                    this.search_focus_info = {...this._lineNumberFromSearchNumber()};
                    if (this.search_focus_info) {
                        this._scrollToLine(this.search_focus_info.line)
                    }
                }
                else {
                    this.search_focus_info = null;
                }
                this.cmobject.operation(function() {
                    self._removeOverlay();
                    self._addOverlay(self.props.search_term);
                });
            }
        }
        catch(e) {
            console.log(e.message)
        }
    }

    _scrollToLine(lnumber) {
        this.cmobject.scrollIntoView({line: lnumber, char: 0}, 50);
        window.scrollTo(0, 0)  // A kludge. Without it whole window can move when switching contexts
    }

    _addOverlay(query, hasBoundary=false, style="searchhighlight", focus_style="focussearchhighlight") {
        // var state = cm.state.matchHighlighter;
        let prev_matches = this.matches;
        var reg = this._searchMatcher(query, true);
        this.matches = countOccurrences(reg, this.props.code_content);
        if (this.props.setSearchMatches && this.matches != prev_matches) {
            this.props.setSearchMatches(this.matches)
        }
        this.overlay = this._makeOverlay(query, hasBoundary, style, focus_style);
        this.cmobject.addOverlay(this.overlay);
      }

    _makeOverlay(query, hasBoundary, style, focus_style) {
        let self = this;
        let last_line = -1;
        let line_counter = -1;
        let matcher = this._searchMatcher(query);
        return {token: function(stream) {
          if (stream.match(matcher) &&
              (!hasBoundary || ReactCodemirror._boundariesAround(stream, hasBoundary))) {
              let lnum = stream.lineOracle.line;

              if (self.search_focus_info && lnum == self.search_focus_info.line) {
                  if (lnum != last_line) {
                      line_counter = 0;
                      last_line = lnum
                  }
                  else {
                      line_counter += 1
                  }
                  if (line_counter == self.search_focus_info.match) {
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

    static _boundariesAround(stream, re) {
        return (!stream.start || !re.test(stream.string.charAt(stream.start - 1))) &&
          (stream.pos == stream.string.length || !re.test(stream.string.charAt(stream.pos)));
    }

    _removeOverlay() {
        if (this.overlay) {
          this.cmobject.removeOverlay(this.overlay);
          this.overlay = null;
        }
    }


    searchCM() {
        CodeMirror.commands.find(this.cmobject)
    }

    _foldAll() {
        CodeMirror.commands.foldAll(this.cmobject)
    }
    _unfoldAll() {
        CodeMirror.commands.unfoldAll(this.cmobject)
    }

    clearSelections() {
        if (this.props.alt_clear_selections) {
            this.props.alt_clear_selections()
        }
        else {
            let self = this;
            let to = this.cmobject.getCursor("to");
            this.cmobject.setCursor(to);
        }
        if (this.props.update_search_state) {
            // this.props.update_search_state({search_string: ""}, ()=>{self.cmobject.setCursor(self.cmobject.getCursor())})
            this.props.update_search_state({search_string: ""})
        }
    }



    set_keymap() {
        let self = this;
        if (self.props.am_selected) {
            CodeMirror.keyMap["default"]["Esc"] = function () {
                self.clearSelections()
            }
        }
        else {
            delete CodeMirror.keyMap["default"].esc
        }
    }

    create_keymap() {
        let self = this;
        this.set_keymap();
        let is_mac = CodeMirror.keyMap["default"].hasOwnProperty("Cmd-S");

        this.mousetrap.bind(['escape'], function (e) {
            if (!self.props.am_selected) {
                return false;
            }
            self.clearSelections();
            e.preventDefault()
        });

    }

    render() {
        let ccstyle = {
            "height": this.props.code_container_height,
            "width": this.props.code_container_width,
            lineHeight: "21px",
            // fontSize: "14",
            // fontFamily: DEFAULT_FONT_FAMILY
        };
        let bgstyle = null;
        if (this.props.show_fold_button && this.code_container_ref && this.code_container_ref.current) {
            let cc_rect = this.code_container_ref.current.getBoundingClientRect();
            if (cc_rect.width > 175) {
                bgstyle = {
                    position: "absolute",
                    left: cc_rect.left + cc_rect.width - 135 - 15,
                    top: cc_rect.top + cc_rect.height - 35
                };
                if (this.first_render) {
                    bgstyle.top -= 10;
                    this.first_render = false
                }
            }


        }
        return (
             <React.Fragment>
                 {this.props.show_fold_button && bgstyle &&
                     <ButtonGroup minimal={false} style={bgstyle}>
                        <Button small={true} icon="collapse-all" text="fold" onClick={this._foldAll}/>
                         <Button small={true}  icon="expand-all"  text="unfold" onClick={this._unfoldAll}/>
                    </ButtonGroup>

                 }
                <div className="code-container" style={ccstyle} ref={this.code_container_ref}>

                </div>
             </React.Fragment>
        )

    }
}


ReactCodemirror.propTypes = {
    am_selected: PropTypes.bool,
    handleChange: PropTypes.func,
    show_line_numbers: PropTypes.bool,
    show_fold_button: PropTypes.bool,
    soft_wrap: PropTypes.bool,
    handleBlur: PropTypes.func,
    code_content: PropTypes.string,
    sync_to_prop: PropTypes.bool,
    force_sync_to_prop: PropTypes.bool,
    clear_force_sync: PropTypes.func,
    mode: PropTypes.string,
    saveMe: PropTypes.func,
    first_line_number: PropTypes.number,
    extraKeys: PropTypes.object,
    setCMObject: PropTypes.func,
    searchTerm: PropTypes.string,
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
    searchTerm: null,
    update_search_state: null,
    alt_clear_selections: null,
    regex_search: false,
    handleChange: null,
    handleBlur: null,
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
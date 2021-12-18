
import React from "react";
import PropTypes from 'prop-types';

import {postAjax} from "./communication_react.js"
// import { CodeMirror } from "./codemirror/src/edit/main.js"
// import "./codemirror/mode/python/python.js"

import CodeMirror from 'codemirror/lib/codemirror.js'
import 'codemirror/mode/python/python.js'

import 'codemirror/lib/codemirror.css'

import 'codemirror/addon/merge/merge.js'
import 'codemirror/addon/merge/merge.css'
import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/addon/hint/show-hint.css'

import 'codemirror/addon/dialog/dialog.js'
import 'codemirror/addon/dialog/dialog.css'

import 'codemirror/addon/edit/matchbrackets.js'
import 'codemirror/addon/edit/closebrackets.js'
import 'codemirror/addon/search/match-highlighter.js'

import 'codemirror/theme/material.css'
import 'codemirror/theme/nord.css'
import 'codemirror/theme/oceanic-next.css'
import 'codemirror/theme/pastel-on-dark.css'
import {propsAreEqual} from "./utilities_react";


export {ReactCodemirror}

const DARK_THEME = window.dark_theme_name;

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
        this.mousetrap = new Mousetrap();
        this.create_api();
        this.saved_theme = null;
        this.overlay = null;
        this.matches = null;
        this.search_focus_info = null
    }

    createCMArea(codearea, first_line_number = 1) {
        let cmobject = CodeMirror(codearea, {
            lineNumbers: this.props.show_line_numbers,
            lineWrapping: this.props.soft_wrap,
            matchBrackets: true,
            highlightSelectionMatches: true,
            autoCloseBrackets: true,
            indentUnit: 4,
            theme: this.props.dark_theme ? DARK_THEME : "default",
            mode: this.props.mode,
            readOnly: this.props.readOnly
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
        cmobject.setSize(null, this.props.code_container_width);
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
        this.cmobject = this.createCMArea(this.code_container_ref.current, this.props.first_line_number);
        this.cmobject.setValue(this.props.code_content);
        this.create_keymap();
        if (this.props.setCMObject != null) {
            this.props.setCMObject(this.cmobject)
        }
        this.saved_theme = this.props.dark_theme;
        this._doHighlight(this.props.search_term)
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !propsAreEqual(nextProps, this.props)
    }

    componentDidUpdate(prevProps) {
        if (this.props.dark_theme != this.saved_theme) {
            if (this.props.dark_theme) {
                this.cmobject.setOption("theme", DARK_THEME)
            }
            else {
                this.cmobject.setOption("theme", "default")
            }
            this.saved_theme = this.props.dark_theme
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
        this.cmobject.refresh();
        this._doHighlight(this.props.search_term)
    }

    _lineNumberFromSearchNumber() {
        let lines = this.props.code_content.split("\n");
        let lnum = 0;
        let mnum = 0;
        let reg = new RegExp(this.props.search_term, "g");
        for (let line of lines) {
            let new_matches = (line.match(reg) || []).length;
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

    _scrollToLine(lnumber) {
        this.cmobject.scrollIntoView({line: lnumber, char: 0}, 50);
        window.scrollTo(0, 0)  // A kludge. Without it whole window can move when switching contexts
    }

    _addOverlay(query, hasBoundary=false, style="searchhighlight", focus_style="focussearchhighlight") {
        // var state = cm.state.matchHighlighter;
        let prev_matches = this.matches;
        var reg = new RegExp(query, "g");
        this.matches = (this.props.code_content.match(reg) || []).length;
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
        return {token: function(stream) {
          if (stream.match(query) &&
              (!hasBoundary || self._boundariesAround(stream, hasBoundary))) {
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
          stream.skipTo(query.charAt(0)) || stream.skipToEnd();
        }};
    }

    _boundariesAround(stream, re) {
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

    clearSelections() {
        // CodeMirror.commands.clearSearch(this.cmobject);
        CodeMirror.commands.singleSelection(this.cmobject);
    }

    create_api() {
        let self = this;
        postAjax("get_api_dict", {}, function (data) {
            self.api_dict_by_category = data.api_dict_by_category;
            self.api_dict_by_name = data.api_dict_by_name;
            self.ordered_api_categories = data.ordered_api_categories;

            self.api_list = [];
            for (let cat of self.ordered_api_categories) {
                for (let entry of self.api_dict_by_category[cat]) {
                    self.api_list.push(entry["name"])
                }
            }
            //noinspection JSUnresolvedVariable
            CodeMirror.commands.autocomplete = function (cm) {
                //noinspection JSUnresolvedFunction
                cm.showHint({
                    hint: CodeMirror.hint.anyword, api_list: self.api_list,
                    extra_autocomplete_list: self.extra_autocomplete_list
                });
            };
        })
    }

    create_keymap() {
        let self = this;
        CodeMirror.keyMap["default"]["Esc"] = function () {self.clearSelections()};
        let is_mac = CodeMirror.keyMap["default"].hasOwnProperty("Cmd-S");

        this.mousetrap.bind(['escape'], function (e) {
            self.clearSelections();
            e.preventDefault()
        });

    }

    render() {
        let ccstyle = {
            "height": this.props.code_container_height,
            "width": this.props.code_container_width,
            lineHeight: "21px",
        };
        return (
            <div className="code-container" style={ccstyle} ref={this.code_container_ref}>

            </div>
        )

    }
}


ReactCodemirror.propTypes = {
    handleChange: PropTypes.func,
    show_line_numbers: PropTypes.bool,
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
    code_container_ref: PropTypes.object,
    code_container_width: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number]),
    code_container_height: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number]),
    setSearchMatches: PropTypes.func,
    current_search_number: PropTypes.number
};

ReactCodemirror.defaultProps = {
    first_line_number: 1,
    show_line_numbers: true,
    soft_wrap: false,
    code_container_height: "100%",
    searchTerm: null,
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
    current_search_number: null
};
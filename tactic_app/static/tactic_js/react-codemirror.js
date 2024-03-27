"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReactCodemirror = ReactCodemirror;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
var _communication_react = require("./communication_react");
var _sizing_tools = require("./sizing_tools");
var _codemirror = _interopRequireDefault(require("codemirror/lib/codemirror"));
require("codemirror/mode/python/python");
require("codemirror/lib/codemirror.css");
require("codemirror/addon/merge/merge");
require("codemirror/addon/merge/merge.css");
require("codemirror/addon/hint/show-hint");
require("codemirror/addon/hint/show-hint.css");
require("codemirror/addon/fold/foldcode");
require("codemirror/addon/fold/foldgutter");
require("codemirror/addon/fold/indent-fold");
require("codemirror/addon/fold/foldgutter.css");
require("codemirror/addon/display/autorefresh");
require("codemirror/addon/dialog/dialog");
require("codemirror/addon/dialog/dialog.css");
require("codemirror/addon/edit/matchbrackets");
require("codemirror/addon/edit/closebrackets");
require("codemirror/addon/search/match-highlighter");
require("codemirror/theme/material.css");
require("codemirror/theme/nord.css");
require("codemirror/theme/oceanic-next.css");
require("codemirror/theme/pastel-on-dark.css");
require("codemirror/theme/elegant.css");
require("codemirror/theme/neat.css");
require("codemirror/theme/solarized.css");
require("codemirror/theme/juejin.css");
var _utilities_react = require("./utilities_react");
var _theme = require("./theme");
require("./autocomplete");
var _error_drawer = require("./error_drawer");
var _library_widgets = require("./library_widgets");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const REGEXTYPE = Object.getPrototypeOf(new RegExp("that"));
function isRegex(ob) {
  return Object.getPrototypeOf(ob) == REGEXTYPE;
}
function countOccurrences(query, the_text) {
  if (isRegex(query)) {
    const split_text = the_text.split(/\r?\n/);
    let total = 0;
    for (let str of split_text) {
      total += (str.match(query) || []).length;
    }
    return total;
  } else {
    return the_text.split(query).length - 1;
  }
}
function ReactCodemirror(props) {
  const localRef = (0, _react.useRef)(null);
  const saved_theme = (0, _react.useRef)(null);
  const preferred_themes = (0, _react.useRef)(null);
  const cmobject = (0, _react.useRef)(null);
  const overlay = (0, _react.useRef)(null);
  const matches = (0, _react.useRef)(null);
  const search_focus_info = (0, _react.useRef)(null);
  const first_render = (0, _react.useRef)(true);
  const prevSoftWrap = (0, _react.useRef)(null);
  const registeredHandlers = (0, _react.useRef)([]);
  const theme = (0, _react.useContext)(_theme.ThemeContext);
  const errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  const [usable_width, usable_height, topX, topY] = (0, _sizing_tools.useSize)(localRef, props.iCounter, "CodeMirror");
  (0, _react.useEffect)(() => {
    prevSoftWrap.current = props.soft_wrap;
    if (props.registerSetFocusFunc) {
      props.registerSetFocusFunc(setFocus);
    }
    (0, _communication_react.postAjaxPromise)('get_preferred_codemirror_themes', {}).then(data => {
      preferred_themes.current = data;
      cmobject.current = createCMArea(localRef.current, props.first_line_number);
      cmobject.current.setValue(props.code_content);
      cmobject.current.setOption("extra_autocomplete_list", props.extra_autocomplete_list);
      create_keymap();
      if (props.setCMObject != null) {
        props.setCMObject(cmobject.current);
      }
      saved_theme.current = theme.dark_theme;
      cmobject.current.refresh();
      _doHighlight();
    }).catch(e => {
      errorDrawerFuncs.addErrorDrawerEntry({
        title: `Error getting preferred codemirror theme`,
        content: "message" in e ? e.message : ""
      });
      return;
    });
  }, []);
  (0, _react.useLayoutEffect)(() => {
    return () => {
      if (cmobject.current) {
        cmobject.current.refresh();
        for (let [event, handler] of registeredHandlers.current) {
          cmobject.current.off(event, handler);
        }
        delete _codemirror.default.keyMap["default"].Esc;
        cmobject.current.setOption("extraKeys", null);
        cmobject.current = null;
        if (localRef.current) {
          localRef.current.innerHTML = '';
        }
      }
    };
  }, []);
  (0, _react.useEffect)(() => {
    if (!cmobject.current) {
      return;
    }
    if (props.soft_wrap != prevSoftWrap.current) {
      cmobject.current.setOption("lineWrapping", props.soft_wrap);
      prevSoftWrap.current = props.soft_wrap;
    }
    if (props.sync_to_prop || props.force_sync_to_prop) {
      cmobject.current.setValue(props.code_content);
      if (props.force_sync_to_prop) {
        props.clear_force_sync();
      }
    }
    if (props.first_line_number != 1) {
      cmobject.current.setOption("firstLineNumber", props.first_line_number);
    }
    cmobject.current.setOption("extra_autocomplete_list", props.extra_autocomplete_list);
    _doHighlight();
    set_keymap();
    if (theme.dark_theme != saved_theme.current) {
      (0, _communication_react.postAjaxPromise)("get_preferred_codemirror_themes", {}).then(data => {
        preferred_themes.current = data;
        cmobject.current.setOption("theme", _current_codemirror_theme());
        saved_theme.current = theme.dark_theme;
      }).catch(e => {
        errorDrawerFuncs.addErrorDrawerEntry({
          title: `Error getting preferred codemirror theme`,
          content: "message" in e ? e.message : ""
        });
        return;
      });
    }
  });
  const selectedPane = (0, _react.useContext)(_utilities_react.SelectedPaneContext);
  function setFocus() {
    if (cmobject.current) {
      cmobject.current.focus();
      cmobject.current.setCursor({
        line: 0,
        ch: 0
      });
    }
  }
  function _current_codemirror_theme() {
    return theme.dark_theme ? preferred_themes.current.preferred_dark_theme : preferred_themes.current.preferred_light_theme;
  }
  function createCMArea(codearea) {
    let first_line_number = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    let lcmobject = (0, _codemirror.default)(codearea, {
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
      lcmobject.setOption("firstLineNumber", first_line_number);
    }
    let all_extra_keys = Object.assign(props.extraKeys, {
      Tab: function (cm) {
        let spaces = new Array(5).join(" ");
        cm.replaceSelection(spaces);
      },
      "Ctrl-Space": "autocomplete"
    });
    lcmobject.setOption("extraKeys", all_extra_keys);
    lcmobject.setSize("100%", "100%");
    lcmobject.on("change", handleChange);
    lcmobject.on("blur", handleBlur);
    lcmobject.on("focus", handleFocus);
    registeredHandlers.current = registeredHandlers.current.concat([["change", handleChange], ["blur", handleBlur], ["focus", handleFocus]]);
    return lcmobject;
  }
  function handleChange(cm, changeObject) {
    if (props.handleChange) {
      props.handleChange(cm.getDoc().getValue());
    }
  }
  function handleBlur(cm, changeObject) {
    if (props.handleBlur) {
      props.handleBlur(cm.getDoc().getValue());
    }
  }
  function handleFocus(cm, changeObject) {
    if (props.handleFocus) {
      props.handleFocus();
    }
  }
  function _searchMatcher(term) {
    let global = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    let matcher;
    if (props.regex_search) {
      try {
        matcher = global ? new RegExp(term, "g") : new RegExp(term);
      } catch (e) {
        matcher = term;
      }
    } else {
      matcher = term;
    }
    return matcher;
  }
  function _lineNumberFromSearchNumber() {
    let lines = props.code_content.split("\n");
    let lnum = 0;
    let mnum = 0;
    let matcher = _searchMatcher(props.search_term);
    for (let line of lines) {
      let new_matches = (line.match(matcher) || []).length;
      if (new_matches + mnum - 1 >= props.current_search_number) {
        return {
          line: lnum,
          match: props.current_search_number - mnum
        };
      }
      mnum += new_matches;
      lnum += 1;
    }
    return null;
  }
  function _doHighlight() {
    try {
      if (props.search_term == null || props.search_term == "") {
        cmobject.current.operation(function () {
          _removeOverlay();
        });
      } else {
        if (props.current_search_number != null) {
          search_focus_info.current = {
            ..._lineNumberFromSearchNumber()
          };
          if (search_focus_info.current) {
            _scrollToLine(search_focus_info.current.line);
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
      console.log(e.message);
    }
  }
  function _scrollToLine(lnumber) {
    cmobject.current.scrollIntoView({
      line: lnumber,
      char: 0
    }, 50);
    window.scrollTo(0, 0); // A kludge. Without it whole window can move when switching contexts
  }
  function _addOverlay(query) {
    let hasBoundary = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    let style = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "searchhighlight";
    let focus_style = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "focussearchhighlight";
    let prev_matches = matches.current;
    var reg = _searchMatcher(query, true);
    matches.current = countOccurrences(reg, props.code_content);
    if (props.setSearchMatches && matches.current != prev_matches) {
      props.setSearchMatches(matches.current);
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
        if (stream.match(matcher) && (!hasBoundary || _boundariesAround(stream, hasBoundary))) {
          let lnum = stream.lineOracle.line;
          if (search_focus_info.current && lnum == search_focus_info.current.line) {
            if (lnum != last_line) {
              line_counter = 0;
              last_line = lnum;
            } else {
              line_counter += 1;
            }
            if (line_counter == search_focus_info.current.match) {
              return focus_style;
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
    return (!stream.start || !re.test(stream.string.charAt(stream.start - 1))) && (stream.pos == stream.string.length || !re.test(stream.string.charAt(stream.pos)));
  }
  function _removeOverlay() {
    if (overlay.current) {
      cmobject.current.removeOverlay(overlay.current);
      overlay.current = null;
    }
  }
  function searchCM() {
    _codemirror.default.commands.find(cmobject.current);
  }
  function _foldAll() {
    _codemirror.default.commands.foldAll(cmobject.current);
  }
  function _unfoldAll() {
    _codemirror.default.commands.unfoldAll(cmobject.current);
  }
  function clearSelections() {
    if (props.alt_clear_selections) {
      props.alt_clear_selections();
    } else {
      let to = cmobject.current.getCursor("to");
      cmobject.current.setCursor(to);
    }
    if (props.update_search_state) {
      props.update_search_state({
        search_string: ""
      });
    }
  }
  function set_keymap() {
    if (selectedPane.amSelected(selectedPane.tab_id, selectedPane.selectedTabIdRef)) {
      _codemirror.default.keyMap["default"]["Esc"] = function () {
        clearSelections();
      };
    } else {
      delete _codemirror.default.keyMap["default"].Esc;
    }
  }
  function create_keymap() {
    set_keymap();
    let is_mac = _codemirror.default.keyMap["default"].hasOwnProperty("Cmd-S");
  }
  let ccstyle = {
    lineHeight: "21px"
  };
  if (!props.no_height) {
    ccstyle.height = usable_height;
  }
  if (!props.no_width) {
    ccstyle.width = usable_width;
  }
  let bgstyle = null;
  if (props.show_fold_button) {
    if (usable_width > 175) {
      bgstyle = {
        position: "fixed",
        left: topX + usable_width - 135 - 15,
        top: topY + usable_height - 35,
        zIndex: 100
      };
      if (first_render.current) {
        bgstyle.top -= 10;
        first_render.current = false;
      }
    }
  }
  if (props.show_search) {
    let title_label = props.title_label ? props.title_label : "";
    return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginRight: 10,
        width: "100%"
      }
    }, /*#__PURE__*/_react.default.createElement("span", {
      className: "bp5-ui-text",
      style: {
        display: "flex",
        paddingLeft: 5,
        paddingBottom: 2,
        alignItems: "self-end"
      }
    }, title_label), /*#__PURE__*/_react.default.createElement(_library_widgets.SearchForm, {
      update_search_state: props.updateSearchState,
      search_string: props.search_term,
      regex: props.regex_search,
      allow_regex: true,
      field_width: 200,
      include_search_jumper: true,
      searchPrev: props.searchPrev,
      searchNext: props.searchNext,
      search_ref: props.search_ref,
      number_matches: props.search_matches
    })), props.show_fold_button && bgstyle && /*#__PURE__*/_react.default.createElement(_core.ButtonGroup, {
      minimal: false,
      style: bgstyle
    }, /*#__PURE__*/_react.default.createElement(_core.Button, {
      small: true,
      icon: "collapse-all",
      text: "fold",
      onClick: _foldAll
    }), /*#__PURE__*/_react.default.createElement(_core.Button, {
      small: true,
      icon: "expand-all",
      text: "unfold",
      onClick: _unfoldAll
    })), /*#__PURE__*/_react.default.createElement("div", {
      className: "code-container",
      style: ccstyle,
      ref: localRef
    }));
  }
  return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, props.show_fold_button && bgstyle && /*#__PURE__*/_react.default.createElement(_core.ButtonGroup, {
    minimal: false,
    style: bgstyle
  }, /*#__PURE__*/_react.default.createElement(_core.Button, {
    small: true,
    icon: "collapse-all",
    text: "fold",
    onClick: _foldAll
  }), /*#__PURE__*/_react.default.createElement(_core.Button, {
    small: true,
    icon: "expand-all",
    text: "unfold",
    onClick: _unfoldAll
  })), props.title_label && /*#__PURE__*/_react.default.createElement("span", {
    className: "bp5-ui-text",
    style: {
      display: "flex",
      paddingLeft: 5,
      paddingBottom: 2,
      alignItems: "self-end"
    }
  }, props.title_label), /*#__PURE__*/_react.default.createElement("div", {
    className: "code-container",
    style: ccstyle,
    ref: localRef
  }));
}
exports.ReactCodemirror = ReactCodemirror = /*#__PURE__*/(0, _react.memo)(ReactCodemirror, (prevProps, newProps) => {
  (0, _utilities_react.propsAreEqual)(prevProps, newProps, ["extraKeys"]);
});
ReactCodemirror.propTypes = {
  no_width: _propTypes.default.bool,
  no_height: _propTypes.default.bool,
  handleChange: _propTypes.default.func,
  show_line_numbers: _propTypes.default.bool,
  show_fold_button: _propTypes.default.bool,
  soft_wrap: _propTypes.default.bool,
  handleBlur: _propTypes.default.func,
  handleFocus: _propTypes.default.func,
  code_content: _propTypes.default.string,
  sync_to_prop: _propTypes.default.bool,
  force_sync_to_prop: _propTypes.default.bool,
  clear_force_sync: _propTypes.default.func,
  mode: _propTypes.default.string,
  saveMe: _propTypes.default.func,
  first_line_number: _propTypes.default.number,
  extraKeys: _propTypes.default.object,
  setCMObject: _propTypes.default.func,
  search_term: _propTypes.default.string,
  update_search_state: _propTypes.default.func,
  alt_clear_selections: _propTypes.default.func,
  regex_search: _propTypes.default.bool,
  code_container_ref: _propTypes.default.object,
  code_container_width: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
  code_container_height: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
  setSearchMatches: _propTypes.default.func,
  current_search_number: _propTypes.default.number,
  extra_autocomplete_list: _propTypes.default.array
};
ReactCodemirror.defaultProps = {
  iCounter: 0,
  no_width: false,
  no_height: false,
  show_search: false,
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
  extra_autocomplete_list: []
};
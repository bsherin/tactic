"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReactCodemirror = ReactCodemirror;
var _react = _interopRequireWildcard(require("react"));
var _core = require("@blueprintjs/core");
var _reactHelmet = require("react-helmet");
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
var _utilities_react = require("./utilities_react");
var _settings = require("./settings");
require("./autocomplete");
var _error_drawer = require("./error_drawer");
var _library_widgets = require("./library_widgets");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; } //import {postAjaxPromise} from "./communication_react"
var REGEXTYPE = Object.getPrototypeOf(new RegExp("that"));
var TITLE_STYLE = {
  display: "flex",
  paddingLeft: 5,
  paddingBottom: 2,
  alignItems: "self-end"
};
function isRegex(ob) {
  return Object.getPrototypeOf(ob) == REGEXTYPE;
}
function countOccurrences(query, the_text) {
  if (isRegex(query)) {
    var split_text = the_text.split(/\r?\n/);
    var total = 0;
    var _iterator = _createForOfIteratorHelper(split_text),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var str = _step.value;
        total += (str.match(query) || []).length;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return total;
  } else {
    return the_text.split(query).length - 1;
  }
}
function ReactCodemirror(props) {
  props = _objectSpread({
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
    extra_autocomplete_list: []
  }, props);
  var localRef = (0, _react.useRef)(null);
  var preferred_themes = (0, _react.useRef)(null);
  var cmobject = (0, _react.useRef)(null);
  var overlay = (0, _react.useRef)(null);
  var matches = (0, _react.useRef)(null);
  var search_focus_info = (0, _react.useRef)(null);
  var first_render = (0, _react.useRef)(true);
  var prevSoftWrap = (0, _react.useRef)(null);
  var registeredHandlers = (0, _react.useRef)([]);
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  var _useSize = (0, _sizing_tools.useSize)(localRef, props.iCounter, "CodeMirror"),
    _useSize2 = _slicedToArray(_useSize, 4),
    usable_width = _useSize2[0],
    usable_height = _useSize2[1],
    topX = _useSize2[2],
    topY = _useSize2[3];
  (0, _react.useEffect)(function () {
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
      props.setCMObject(cmobject.current);
    }
    cmobject.current.refresh();
    _doHighlight();
  }, []);
  (0, _react.useEffect)(function () {
    if (!cmobject.current) {
      return;
    }
    cmobject.current.setOption("theme", _current_codemirror_theme());
    cmobject.current.refresh();
  }, [settingsContext.settings.theme, settingsContext.settings.preferred_dark_theme, settingsContext.settings.preferred_light_theme]);
  (0, _react.useLayoutEffect)(function () {
    return function () {
      if (cmobject.current) {
        cmobject.current.refresh();
        var _iterator2 = _createForOfIteratorHelper(registeredHandlers.current),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var _step2$value = _slicedToArray(_step2.value, 2),
              event = _step2$value[0],
              handler = _step2$value[1];
            cmobject.current.off(event, handler);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
        delete _codemirror["default"].keyMap["default"].Esc;
        cmobject.current.setOption("extraKeys", null);
        cmobject.current = null;
        if (localRef.current) {
          localRef.current.innerHTML = '';
        }
      }
    };
  }, []);
  (0, _react.useEffect)(function () {
    _doHighlight();
  }, [props.search_term, props.current_search_number]);
  (0, _react.useEffect)(function () {
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
    set_keymap();
  });
  var selectedPane = (0, _react.useContext)(_utilities_react.SelectedPaneContext);
  function isDark() {
    return settingsContext.settingsRef.current.theme == "dark";
  }
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
    return isDark() ? settingsContext.settingsRef.current.preferred_dark_theme : settingsContext.settingsRef.current.preferred_light_theme;
  }
  function createCMArea(codearea) {
    var first_line_number = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var lcmobject = (0, _codemirror["default"])(codearea, {
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
    var all_extra_keys = Object.assign(props.extraKeys, {
      Tab: function Tab(cm) {
        var spaces = new Array(5).join(" ");
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
    var global = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var matcher;
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
    var lines = props.code_content.split("\n");
    var lnum = 0;
    var mnum = 0;
    var matcher = _searchMatcher(props.search_term);
    var _iterator3 = _createForOfIteratorHelper(lines),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var line = _step3.value;
        var new_matches = (line.match(matcher) || []).length;
        if (new_matches + mnum - 1 >= props.current_search_number) {
          return {
            line: lnum,
            match: props.current_search_number - mnum
          };
        }
        mnum += new_matches;
        lnum += 1;
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    return null;
  }
  function _doHighlight() {
    try {
      if (!cmobject.current) return;
      if (props.search_term == null || props.search_term == "") {
        cmobject.current.operation(function () {
          _removeOverlay();
        });
      } else {
        if (props.current_search_number != null) {
          search_focus_info.current = _objectSpread({}, _lineNumberFromSearchNumber());
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
      "char": 0
    }, 50);
    window.scrollTo(0, 0); // A kludge. Without it whole window can move when switching contexts
  }
  function _addOverlay(query) {
    var hasBoundary = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var style = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "searchhighlight";
    var focus_style = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "focussearchhighlight";
    var prev_matches = matches.current;
    var reg = _searchMatcher(query, true);
    matches.current = countOccurrences(reg, props.code_content);
    if (props.setSearchMatches && matches.current != prev_matches) {
      props.setSearchMatches(matches.current);
    }
    overlay.current = _makeOverlay(query, hasBoundary, style, focus_style);
    cmobject.current.addOverlay(overlay.current);
  }
  function _makeOverlay(query, hasBoundary, style, focus_style) {
    var last_line = -1;
    var line_counter = -1;
    var matcher = _searchMatcher(query);
    return {
      token: function token(stream) {
        if (stream.match(matcher) && (!hasBoundary || _boundariesAround(stream, hasBoundary))) {
          var lnum = stream.lineOracle.line;
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
    _codemirror["default"].commands.find(cmobject.current);
  }
  function _foldAll() {
    _codemirror["default"].commands.foldAll(cmobject.current);
  }
  function _unfoldAll() {
    _codemirror["default"].commands.unfoldAll(cmobject.current);
  }
  function clearSelections() {
    if (props.alt_clear_selections) {
      props.alt_clear_selections();
    } else {
      var to = cmobject.current.getCursor("to");
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
      _codemirror["default"].keyMap["default"]["Esc"] = function () {
        clearSelections();
      };
    } else {
      delete _codemirror["default"].keyMap["default"].Esc;
    }
  }
  function create_keymap() {
    set_keymap();
    var is_mac = _codemirror["default"].keyMap["default"].hasOwnProperty("Cmd-S");
  }
  var ccstyle = {
    lineHeight: "21px"
  };
  if (!props.no_height) {
    ccstyle.height = usable_height;
  }
  if (!props.no_width) {
    ccstyle.width = usable_width;
  }
  var bgstyle = null;
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
        first_render.current = false;
      }
    }
  }
  var tTheme = settingsContext.settingsRef.current.theme;
  if (props.show_search) {
    var title_label = props.title_label ? props.title_label : "";
    return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_reactHelmet.Helmet, null, /*#__PURE__*/_react["default"].createElement("link", {
      rel: "stylesheet",
      href: "/static/tactic_css/codemirror_".concat(tTheme, "/").concat(_current_codemirror_theme(), ".css"),
      type: "text/css"
    })), /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginRight: 10,
        width: "100%"
      }
    }, /*#__PURE__*/_react["default"].createElement("span", {
      className: "bp5-ui-text",
      style: {
        display: "flex",
        paddingLeft: 5,
        paddingBottom: 2,
        alignItems: "self-end"
      }
    }, title_label), /*#__PURE__*/_react["default"].createElement(_library_widgets.SearchForm, {
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
    })), props.show_fold_button && bgstyle && /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, {
      minimal: false,
      style: bgstyle
    }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
      small: true,
      icon: "collapse-all",
      text: "fold",
      onClick: _foldAll
    }), /*#__PURE__*/_react["default"].createElement(_core.Button, {
      small: true,
      icon: "expand-all",
      text: "unfold",
      onClick: _unfoldAll
    })), /*#__PURE__*/_react["default"].createElement("div", {
      className: "code-container",
      style: ccstyle,
      ref: localRef
    }));
  }
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_reactHelmet.Helmet, null, /*#__PURE__*/_react["default"].createElement("link", {
    rel: "stylesheet",
    href: "/static/tactic_css/codemirror_".concat(tTheme, "/").concat(_current_codemirror_theme(), ".css"),
    type: "text/css"
  })), props.show_fold_button && bgstyle && /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, {
    minimal: false,
    style: bgstyle
  }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
    small: true,
    icon: "collapse-all",
    text: "fold",
    onClick: _foldAll
  }), /*#__PURE__*/_react["default"].createElement(_core.Button, {
    small: true,
    icon: "expand-all",
    text: "unfold",
    onClick: _unfoldAll
  })), props.title_label && /*#__PURE__*/_react["default"].createElement("span", {
    className: "bp5-ui-text",
    style: TITLE_STYLE
  }, props.title_label), /*#__PURE__*/_react["default"].createElement("div", {
    className: "code-container",
    style: ccstyle,
    ref: localRef
  }));
}
exports.ReactCodemirror = ReactCodemirror = /*#__PURE__*/(0, _react.memo)(ReactCodemirror, function (prevProps, newProps) {
  (0, _utilities_react.propsAreEqual)(prevProps, newProps, ["extraKeys"]);
});
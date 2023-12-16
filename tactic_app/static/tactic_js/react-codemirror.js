"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReactCodemirror = ReactCodemirror;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
var _communication_react = require("./communication_react");
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
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var REGEXTYPE = Object.getPrototypeOf(new RegExp("that"));
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
function ReactCodemirror(props, passedRef) {
  var localRef = (0, _react.useRef)(null);
  var code_container_ref = (0, _react.useRef)(passedRef ? passedRef : localRef);
  var mousetrap = (0, _react.useRef)(new Mousetrap());
  var saved_theme = (0, _react.useRef)(null);
  var preferred_themes = (0, _react.useRef)(null);
  var cmobject = (0, _react.useRef)(null);
  var overlay = (0, _react.useRef)(null);
  var matches = (0, _react.useRef)(null);
  var search_focus_info = (0, _react.useRef)(null);
  var first_render = (0, _react.useRef)(true);
  var prevSoftWrap = (0, _react.useRef)(null);
  var theme = (0, _react.useContext)(_theme.ThemeContext);
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  (0, _react.useEffect)(function () {
    prevSoftWrap.current = props.soft_wrap;
    if (props.registerSetFocusFunc) {
      props.registerSetFocusFunc(setFocus);
    }
    (0, _communication_react.postAjaxPromise)('get_preferred_codemirror_themes', {}).then(function (data) {
      preferred_themes.current = data;
      cmobject.current = createCMArea(code_container_ref.current.current, props.first_line_number);
      cmobject.current.setValue(props.code_content);
      cmobject.current.setOption("extra_autocomplete_list", props.extra_autocomplete_list);
      create_keymap();
      if (props.setCMObject != null) {
        props.setCMObject(cmobject.current);
      }
      saved_theme.current = theme.dark_theme;
      _doHighlight();
    })["catch"](function (data) {
      errorDrawerFuncs.addErrorDrawerEntry({
        title: "Error getting preferred codemirror theme",
        content: "message" in data ? data.message : ""
      });
    });
  }, []);
  (0, _react.useEffect)(function () {
    if (!cmobject.current) {
      return;
    }
    if (theme.dark_theme != saved_theme.current) {
      (0, _communication_react.postAjax)("get_preferred_codemirror_themes", {}, function (data) {
        preferred_themes.current = data;
        cmobject.current.setOption("theme", _current_codemirror_theme());
        saved_theme.current = theme.dark_theme;
      });
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
  });
  var selectedPane = (0, _react.useContext)(_utilities_react.SelectedPaneContext);
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
    var first_line_number = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var cmobject = (0, _codemirror["default"])(codearea, {
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
      cmobject.setOption("firstLineNumber", first_line_number);
    }
    var all_extra_keys = Object.assign(props.extraKeys, {
      Tab: function Tab(cm) {
        var spaces = new Array(5).join(" ");
        cm.replaceSelection(spaces);
      },
      "Ctrl-Space": "autocomplete"
    });
    cmobject.setOption("extraKeys", all_extra_keys);
    cmobject.setSize("100%", "100%");
    cmobject.on("change", handleChange);
    cmobject.on("blur", handleBlur);
    cmobject.on("focus", handleFocus);
    return cmobject;
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
    var _iterator2 = _createForOfIteratorHelper(lines),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var line = _step2.value;
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
      _iterator2.e(err);
    } finally {
      _iterator2.f();
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
    // var state = cm.state.matchHighlighter;
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
      delete _codemirror["default"].keyMap["default"].esc;
    }
  }
  function create_keymap() {
    set_keymap();
    var is_mac = _codemirror["default"].keyMap["default"].hasOwnProperty("Cmd-S");
    mousetrap.current.bind(['escape'], function (e) {
      if (selectedPane.amSelected(selectedPane.tab_id, selectedPane.selectedTabIdRef)) {
        return false;
      }
      clearSelections();
      e.preventDefault();
    });
  }
  var ccstyle = {
    "height": props.code_container_height,
    "width": props.code_container_width,
    lineHeight: "21px"
  };
  var bgstyle = null;
  if (props.show_fold_button && code_container_ref.current && code_container_ref.current.current) {
    var cc_rect = code_container_ref.current.current.getBoundingClientRect();
    if (cc_rect.width > 175) {
      bgstyle = {
        position: "absolute",
        left: cc_rect.left + cc_rect.width - 135 - 15,
        top: cc_rect.top + cc_rect.height - 35
      };
      if (first_render.current) {
        bgstyle.top -= 10;
        first_render.current = false;
      }
    }
  }
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, props.show_fold_button && bgstyle && /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, {
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
    ref: code_container_ref.current
  }));
}
exports.ReactCodemirror = ReactCodemirror = /*#__PURE__*/(0, _react.memo)( /*#__PURE__*/(0, _react.forwardRef)(ReactCodemirror), function (prevProps, newProps) {
  (0, _utilities_react.propsAreEqual)(prevProps, newProps, ["extraKeys"]);
});
ReactCodemirror.propTypes = {
  handleChange: _propTypes["default"].func,
  show_line_numbers: _propTypes["default"].bool,
  show_fold_button: _propTypes["default"].bool,
  soft_wrap: _propTypes["default"].bool,
  handleBlur: _propTypes["default"].func,
  handleFocus: _propTypes["default"].func,
  code_content: _propTypes["default"].string,
  sync_to_prop: _propTypes["default"].bool,
  force_sync_to_prop: _propTypes["default"].bool,
  clear_force_sync: _propTypes["default"].func,
  mode: _propTypes["default"].string,
  saveMe: _propTypes["default"].func,
  first_line_number: _propTypes["default"].number,
  extraKeys: _propTypes["default"].object,
  setCMObject: _propTypes["default"].func,
  search_term: _propTypes["default"].string,
  update_search_state: _propTypes["default"].func,
  alt_clear_selections: _propTypes["default"].func,
  regex_search: _propTypes["default"].bool,
  code_container_ref: _propTypes["default"].object,
  code_container_width: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
  code_container_height: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
  setSearchMatches: _propTypes["default"].func,
  current_search_number: _propTypes["default"].number,
  extra_autocomplete_list: _propTypes["default"].array
};
ReactCodemirror.defaultProps = {
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
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SearchableConsole = SearchableConsole;
var _react = _interopRequireWildcard(require("react"));
var _core = require("@blueprintjs/core");
var _search_form = require("./search_form");
var _communication_react = require("./communication_react");
var _utilities_react = require("./utilities_react");
var _tactic_socket = require("./tactic_socket");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function SearchableConsole(props, inner_ref) {
  var _useState = (0, _react.useState)(null),
    _useState2 = _slicedToArray(_useState, 2),
    search_string = _useState2[0],
    set_search_string = _useState2[1];
  var _useState3 = (0, _react.useState)(null),
    _useState4 = _slicedToArray(_useState3, 2),
    search_helper_text = _useState4[0],
    set_search_helper_text = _useState4[1];
  var _useState5 = (0, _react.useState)(false),
    _useState6 = _slicedToArray(_useState5, 2),
    filter = _useState6[0],
    set_filter = _useState6[1];
  var _useState7 = (0, _react.useState)(""),
    _useState8 = _slicedToArray(_useState7, 2),
    console_command_value = _useState8[0],
    set_console_command_value = _useState8[1];
  var _useState9 = (0, _react.useState)(true),
    _useState10 = _slicedToArray(_useState9, 2),
    livescroll = _useState10[0],
    set_livescroll = _useState10[1];
  var _useState11 = (0, _react.useState)(null),
    _useState12 = _slicedToArray(_useState11, 2),
    log_since = _useState12[0],
    set_log_since = _useState12[1];

  // I need to have these as refs because the are accessed within the _handleUpdateMessage
  // callback. So they would have the old value.
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)(100),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    max_console_lines = _useStateAndRef2[0],
    set_max_console_lines = _useStateAndRef2[1],
    max_console_lines_ref = _useStateAndRef2[2];
  var _useStateAndRef3 = (0, _utilities_react.useStateAndRef)(""),
    _useStateAndRef4 = _slicedToArray(_useStateAndRef3, 3),
    log_content = _useStateAndRef4[0],
    set_log_content = _useStateAndRef4[1],
    log_content_ref = _useStateAndRef4[2];
  var tsocket = (0, _react.useRef)(null);
  var past_commands = (0, _react.useRef)([]);
  var past_commands_index = (0, _react.useRef)(null);
  (0, _react.useEffect)(function () {
    if (livescroll && inner_ref && inner_ref.current) {
      inner_ref.current.scrollTo(0, inner_ref.current.scrollHeight);
    }
  });
  (0, _react.useEffect)(function () {
    tsocket.current = new _tactic_socket.TacticSocket("main", 5000, "searchable-console", props.main_id);
    initSocket();
    _getLogAndStartStreaming();
    return function () {
      _stopLogStreaming();
      tsocket.current.disconnect();
    };
  }, []);
  (0, _utilities_react.useDidMount)(function () {
    _stopLogStreaming(_getLogAndStartStreaming);
  }, [log_since, max_console_lines]);
  function initSocket() {
    tsocket.current.attachListener("searchable-console-message", _handleUpdateMessage);
  }
  function _handleUpdateMessage(data) {
    if (data.container_id != props.container_id || data.message != "updateLog") return;
    _addToLog(data.new_line);
  }
  function _setLogSince() {
    var now = new Date().getTime();
    set_log_since(now);
  }
  function _setMaxConsoleLines(event) {
    set_max_console_lines(parseInt(event.target.value));
  }
  function _getLogAndStartStreaming() {
    (0, _communication_react.postWithCallback)("host", "get_container_log", {
      container_id: props.container_id,
      since: log_since,
      max_lines: max_console_lines_ref.current
    }, function (res) {
      set_log_content(res.log_text);
      (0, _communication_react.postWithCallback)(props.main_id, "StartLogStreaming", {
        container_id: props.container_id
      }, null, null, props.main_id);
    }, null, props.main_id);
  }
  function _stopLogStreaming() {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    (0, _communication_react.postWithCallback)(props.main_id, "StopLogStreaming", {
      container_id: props.container_id
    }, callback, null, props.main_id);
  }
  function _addToLog(new_line) {
    var log_list = log_content_ref.current.split(/\r?\n/);
    var mlines = max_console_lines_ref.current;
    var new_log_content;
    if (log_list.length >= mlines) {
      log_list = log_list.slice(-1 * mlines + 1);
      new_log_content = log_list.join("\n");
    } else {
      new_log_content = log_content_ref.current;
    }
    new_log_content = new_log_content + new_line;
    set_log_content(new_log_content);
  }
  function _prepareText() {
    var the_text = "";
    if (log_content_ref.current) {
      // without this can get an error if project saved with tile log showing
      var tlist = log_content_ref.current.split(/\r?\n/);
      if (search_string) {
        if (filter) {
          var new_tlist = [];
          var _iterator = _createForOfIteratorHelper(tlist),
            _step;
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var t = _step.value;
              if (t.includes(search_string)) {
                new_tlist.push(t);
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
          tlist = new_tlist;
        }
        var _iterator2 = _createForOfIteratorHelper(tlist),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var _t = _step2.value;
            the_text = the_text + _t + "<br>";
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
        var regex = new RegExp(search_string, "gi");
        the_text = String(the_text).replace(regex, function (matched) {
          return "<mark>" + matched + "</mark>";
        });
      } else {
        var _iterator3 = _createForOfIteratorHelper(tlist),
          _step3;
        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var _t2 = _step3.value;
            the_text = the_text + _t2 + "<br>";
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }
    }
    return "<div style=\"white-space:pre\">".concat(the_text, "</div>");
  }
  function _handleSearchFieldChange(event) {
    set_search_helper_text(null);
    set_search_string(event.target.value);
  }
  function _handleFilter() {
    set_filter(true);
  }
  function _handleUnFilter() {
    set_search_helper_text(null);
    set_search_string(null);
    set_filter(false);
  }
  function _searchNext() {}
  function _structureText() {}
  function _searchPrevious() {}
  function _logExec(command) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    (0, _communication_react.postWithCallback)(props.container_id, "os_command_exec", {
      "the_code": command
    }, callback);
  }
  function _commandSubmit(e) {
    e.preventDefault();
    past_commands.current.push(console_command_value);
    past_commands_index.current = null;
    _logExec(console_command_value, function () {
      set_console_command_value("");
    });
  }
  function _setLiveScroll(event) {
    set_livescroll(event.target.checked);
  }
  function _onInputChange(event) {
    set_console_command_value(event.target.value);
  }
  function _handleKeyDown(event) {
    var charCode = event.keyCode;
    var new_val;
    if (charCode == 38) {
      // down arraw
      if (past_commands.current.length == 0) {
        return;
      }
      if (past_commands_index.current == null) {
        past_commands_index.current = past_commands.current.length - 1;
      }
      new_val = past_commands.current[past_commands_index.current];
      if (past_commands_index.current > 0) {
        past_commands_index.current -= 1;
      }
    } else if (charCode == 40) {
      // up arro
      if (past_commands.current.length == 0 || past_commands_index.current == null || past_commands_index.current == past_commands.current.length - 1) {
        return;
      }
      past_commands_index.current += 1;
      new_val = past_commands.current[past_commands_index.current];
    } else {
      return;
    }
    set_console_command_value(new_val);
  }
  var the_text = {
    __html: _prepareText()
  };
  var the_style = _objectSpread({
    whiteSpace: "nowrap",
    fontSize: 12,
    fontFamily: "monospace"
  }, props.outer_style);
  if (props.showCommandField) {
    the_style.height = the_style.height - 40;
  }
  var bottom_info = "575 lines";
  var self = this;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "searchable-console"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-row",
    style: {
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.ControlGroup, {
    vertical: false,
    style: {
      marginLeft: 15,
      marginTop: 10
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
    onClick: _setLogSince,
    style: {
      height: 30
    },
    minimal: true,
    small: true,
    icon: "trash"
  }), /*#__PURE__*/_react["default"].createElement(_core.HTMLSelect, {
    onChange: _setMaxConsoleLines,
    large: false,
    minimal: true,
    value: max_console_lines_ref.current,
    options: [100, 250, 500, 1000, 2000]
  }), /*#__PURE__*/_react["default"].createElement(_core.Switch, {
    label: "livescroll",
    large: false,
    checked: livescroll,
    onChange: _setLiveScroll,
    style: {
      marginBottom: 0,
      marginTop: 5,
      alignSelf: "center",
      height: 30
    }
  })), /*#__PURE__*/_react["default"].createElement(_search_form.FilterSearchForm, {
    search_string: search_string,
    handleSearchFieldChange: _handleSearchFieldChange,
    handleFilter: _handleFilter,
    handleUnFilter: _handleUnFilter,
    searchNext: null,
    searchPrevious: null,
    search_helper_text: search_helper_text,
    margin_right: 25
  })), /*#__PURE__*/_react["default"].createElement("div", {
    ref: inner_ref,
    style: the_style,
    dangerouslySetInnerHTML: the_text
  }), props.showCommandField && /*#__PURE__*/_react["default"].createElement("form", {
    onSubmit: _commandSubmit,
    style: {
      position: "relative",
      bottom: 8,
      margin: 10
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
    type: "text",
    className: "bp5-monospace-text",
    onChange: _onInputChange,
    small: true,
    large: false,
    leftIcon: "chevron-right",
    fill: true,
    onKeyDown: function onKeyDown(e) {
      return _handleKeyDown(e);
    },
    value: console_command_value
  })));
}
exports.SearchableConsole = SearchableConsole = /*#__PURE__*/(0, _react.memo)( /*#__PURE__*/(0, _react.forwardRef)(SearchableConsole));
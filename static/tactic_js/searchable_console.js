"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResponsiveFlex = ResponsiveFlex;
exports.SearchableConsole = SearchableConsole;
var _react = _interopRequireWildcard(require("react"));
var _core = require("@blueprintjs/core");
var _search_form = require("./search_form");
var _communication_react = require("./communication_react");
var _utilities_react = require("./utilities_react");
var _tactic_socket = require("./tactic_socket");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t3 in e) "default" !== _t3 && {}.hasOwnProperty.call(e, _t3) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t3)) && (i.get || i.set) ? o(f, _t3, i) : f[_t3] = e[_t3]); return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
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
    _useState0 = _slicedToArray(_useState9, 2),
    livescroll = _useState0[0],
    set_livescroll = _useState0[1];

  // I need to have these as refs because they are accessed within the _handleUpdateMessage
  // callback. So they would have the old value.
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)(100),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    max_console_lines = _useStateAndRef2[0],
    set_max_console_lines = _useStateAndRef2[1],
    max_console_lines_ref = _useStateAndRef2[2];
  var _useStateAndRef3 = (0, _utilities_react.useStateAndRef)(""),
    _useStateAndRef4 = _slicedToArray(_useStateAndRef3, 3),
    set_log_content = _useStateAndRef4[1],
    log_content_ref = _useStateAndRef4[2];
  var cont_id = (0, _react.useRef)(props.container_id);
  var sc_id = (0, _react.useRef)(null);
  var streamer_info = (0, _react.useRef)(null);
  // const [, doUpdate] = useDebounce(set_log_content);

  var past_commands = (0, _react.useRef)([]);
  var past_commands_index = (0, _react.useRef)(null);
  (0, _react.useEffect)(function () {
    if (livescroll && inner_ref && inner_ref.current) {
      inner_ref.current.scrollTo(0, inner_ref.current.scrollHeight);
    }
  });
  (0, _react.useEffect)(function () {
    sc_id.current = (0, _utilities_react.guid)();
    function cleanup() {
      _stopLogStreaming().then(function () {
        props.tsocket.detachListener("searchable-console-message");
      });
    }
    _getLogAndStartStreaming().then(function () {
      window.addEventListener('beforeunload', cleanup);
    });
    return function () {
      cleanup();
      window.removeEventListener('beforeunload', cleanup);
    };
  }, []);
  (0, _utilities_react.useDidMount)(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          _context.n = 1;
          return _stopLogStreaming(_getLogAndStartStreaming);
        case 1:
          return _context.a(2);
      }
    }, _callee);
  })), [max_console_lines]);
  (0, _utilities_react.useDidMount)(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          _context2.n = 1;
          return _stopLogStreaming();
        case 1:
          cont_id.current = props.container_id;
          set_max_console_lines(100);
          _context2.n = 2;
          return _getLogAndStartStreaming();
        case 2:
          return _context2.a(2);
      }
    }, _callee2);
  })), [props.container_id]);
  (0, _tactic_socket.useSocketListener)(props.tsocket, "searchable-console-message", _handleUpdateMessage);
  function _handleUpdateMessage(data) {
    if (data["sc_id"] != sc_id.current) return;
    if (data["console_message"] == "streamerExited") {
      streamer_info.current = null;
      return;
    }
    if (data["console_message"] != "updateLog") return;
    _addToLog(data["new_line"]);
  }
  function _setLogSince() {
    return _setLogSince2.apply(this, arguments);
  }
  function _setLogSince2() {
    _setLogSince2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.n) {
          case 0:
            set_log_content("");
            _context3.n = 1;
            return (0, _communication_react.postPromise)("host", "set_log_since", {
              cont_id: cont_id.current,
              local_id: props.local_id
            }, props.local_id);
          case 1:
            _context3.n = 2;
            return _getLogAndStartStreaming();
          case 2:
            return _context3.a(2);
        }
      }, _callee3);
    }));
    return _setLogSince2.apply(this, arguments);
  }
  function _setMaxConsoleLines(event) {
    set_max_console_lines(parseInt(event.target.value));
  }
  function _getLogAndStartStreaming() {
    return _getLogAndStartStreaming2.apply(this, arguments);
  }
  function _getLogAndStartStreaming2() {
    _getLogAndStartStreaming2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
      var res, data;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.n) {
          case 0:
            if (props.container_id) {
              _context4.n = 1;
              break;
            }
            return _context4.a(2);
          case 1:
            _context4.n = 2;
            return _stopLogStreaming();
          case 2:
            _context4.n = 3;
            return (0, _communication_react.postPromise)("host", "get_container_log", {
              cont_id: cont_id.current,
              max_lines: max_console_lines_ref.current,
              local_id: props.local_id
            }, props.local_id);
          case 3:
            res = _context4.v;
            _addToLog(res["log_text"]);
            _context4.n = 4;
            return (0, _communication_react.postPromise)("host", "start_log_stream", {
              cont_id: cont_id.current,
              local_id: props.local_id,
              sc_id: sc_id.current,
              user_id: window.user_id
            }, props.local_id);
          case 4:
            data = _context4.v;
            streamer_info.current = data["stream_info"];
          case 5:
            return _context4.a(2);
        }
      }, _callee4);
    }));
    return _getLogAndStartStreaming2.apply(this, arguments);
  }
  function _stopLogStreaming() {
    return _stopLogStreaming2.apply(this, arguments);
  }
  function _stopLogStreaming2() {
    _stopLogStreaming2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
      var callback,
        _args5 = arguments;
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.n) {
          case 0:
            callback = _args5.length > 0 && _args5[0] !== undefined ? _args5[0] : null;
            if (!(streamer_info && streamer_info.current)) {
              _context5.n = 2;
              break;
            }
            _context5.n = 1;
            return (0, _communication_react.postPromise)(streamer_info.current.stream_host, "stop_log_stream", {
              streamer_id: streamer_info.current.stream_id
            }, props.local_id);
          case 1:
            streamer_info.current = null;
            if (callback) {
              callback();
            }
          case 2:
            return _context5.a(2, null);
        }
      }, _callee5);
    }));
    return _stopLogStreaming2.apply(this, arguments);
  }
  function _addToLog(new_line) {
    set_log_content(function (prev_log_content) {
      return prev_log_content + new_line;
    });
  }
  function _prepareText() {
    var the_text = "";
    if (log_content_ref.current) {
      // without this can get an error if project saved with tile log showing
      var tlist = log_content_ref.current.split(/\r?\n/);
      tlist = tlist.slice(-1 * max_console_lines_ref.current);
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
  function _logExec(_x) {
    return _logExec2.apply(this, arguments);
  }
  function _logExec2() {
    _logExec2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(command) {
      return _regenerator().w(function (_context6) {
        while (1) switch (_context6.n) {
          case 0:
            _context6.n = 1;
            return (0, _communication_react.postPromise)(cont_id.current, "os_command_exec", {
              "the_code": command
            }, props.local_id);
          case 1:
            return _context6.a(2, _context6.v);
        }
      }, _callee6);
    }));
    return _logExec2.apply(this, arguments);
  }
  function _commandSubmit(_x2) {
    return _commandSubmit2.apply(this, arguments);
  }
  function _commandSubmit2() {
    _commandSubmit2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(e) {
      return _regenerator().w(function (_context7) {
        while (1) switch (_context7.n) {
          case 0:
            e.preventDefault();
            past_commands.current.push(console_command_value);
            past_commands_index.current = null;
            _context7.n = 1;
            return _logExec(console_command_value);
          case 1:
            set_console_command_value("");
          case 2:
            return _context7.a(2);
        }
      }, _callee7);
    }));
    return _commandSubmit2.apply(this, arguments);
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
  var inner_style = {
    whiteSpace: "nowrap",
    fontSize: 12,
    fontFamily: "monospace",
    flex: "1 1 0",
    minHeight: 0,
    overflow: "auto"
  };
  var outer_style = _objectSpread({
    width: "100%",
    height: "100%",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column"
  }, props.outer_style);
  var leftContent = /*#__PURE__*/_react["default"].createElement(_core.ControlGroup, {
    vertical: false
  }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
    onClick: _setLogSince,
    style: {
      height: 30
    },
    variant: "minimal",
    size: "small",
    icon: "trash"
  }), /*#__PURE__*/_react["default"].createElement(_core.HTMLSelect, {
    onChange: _setMaxConsoleLines,
    large: false,
    variant: "minimal",
    value: max_console_lines_ref.current,
    options: [100, 250, 500, 1000, 2000]
  }), /*#__PURE__*/_react["default"].createElement(_core.Switch, {
    label: "livescroll",
    size: "medium",
    checked: livescroll,
    onChange: _setLiveScroll,
    style: {
      marginBottom: 0,
      marginLeft: 5,
      alignSelf: "center"
    }
  }));
  var rightContent = /*#__PURE__*/_react["default"].createElement(_search_form.FilterSearchForm, {
    search_string: search_string,
    handleSearchFieldChange: _handleSearchFieldChange,
    handleFilter: _handleFilter,
    handleUnFilter: _handleUnFilter,
    searchNext: null,
    searchPrevious: null,
    search_helper_text: search_helper_text,
    margin_right: 25
  });
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "searchable-console",
    style: outer_style
  }, /*#__PURE__*/_react["default"].createElement(ResponsiveFlex, {
    leftContent: leftContent,
    rightContent: rightContent
  }), /*#__PURE__*/_react["default"].createElement("div", {
    ref: inner_ref,
    style: inner_style,
    dangerouslySetInnerHTML: the_text
  }), props.showCommandField && /*#__PURE__*/_react["default"].createElement("form", {
    onSubmit: _commandSubmit
  }, /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
    type: "text",
    className: "bp6-monospace-text",
    onChange: _onInputChange,
    size: "small",
    leftIcon: "chevron-right",
    fill: true,
    onKeyDown: function onKeyDown(e) {
      return _handleKeyDown(e);
    },
    value: console_command_value
  })));
}
exports.SearchableConsole = SearchableConsole = /*#__PURE__*/(0, _react.memo)(/*#__PURE__*/(0, _react.forwardRef)(SearchableConsole));
function ResponsiveFlex(props) {
  props = _objectSpread({
    gapThreshold: 100,
    leftContent: null,
    rightContent: null
  }, props);
  var containerRef = (0, _react.useRef)(null);
  var leftContentRef = (0, _react.useRef)(null);
  var rightContentRef = (0, _react.useRef)(null);
  var _useState1 = (0, _react.useState)(false),
    _useState10 = _slicedToArray(_useState1, 2),
    hideRight = _useState10[0],
    setHideRight = _useState10[1];
  (0, _react.useEffect)(function () {
    var observer = new ResizeObserver(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 1),
        entry = _ref4[0];
      var width = entry.contentRect.width;
      var le_width = leftContentRef.current.getBoundingClientRect().width;
      var re_width = rightContentRef.current.getBoundingClientRect().width;
      if (width - (re_width + le_width) < props.gapThreshold) {
        setHideRight(true);
      } else {
        setHideRight(false);
      }
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return function () {
      return observer.disconnect();
    };
  }, []);
  return /*#__PURE__*/_react["default"].createElement("div", {
    ref: containerRef,
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "self-start",
      width: "100%",
      position: "relative"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    ref: leftContentRef
  }, props.leftContent), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      opacity: hideRight ? 0 : 1
    },
    ref: rightContentRef
  }, props.rightContent));
}
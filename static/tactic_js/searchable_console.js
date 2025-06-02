"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t3 in e) "default" !== _t3 && {}.hasOwnProperty.call(e, _t3) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t3)) && (i.get || i.set) ? o(f, _t3, i) : f[_t3] = e[_t3]); return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return r; }; var t, r = {}, e = Object.prototype, n = e.hasOwnProperty, o = "function" == typeof Symbol ? Symbol : {}, i = o.iterator || "@@iterator", a = o.asyncIterator || "@@asyncIterator", u = o.toStringTag || "@@toStringTag"; function c(t, r, e, n) { return Object.defineProperty(t, r, { value: e, enumerable: !n, configurable: !n, writable: !n }); } try { c({}, ""); } catch (t) { c = function c(t, r, e) { return t[r] = e; }; } function h(r, e, n, o) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype); return c(a, "_invoke", function (r, e, n) { var o = 1; return function (i, a) { if (3 === o) throw Error("Generator is already running"); if (4 === o) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var u = n.delegate; if (u) { var c = d(u, n); if (c) { if (c === f) continue; return c; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (1 === o) throw o = 4, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = 3; var h = s(r, e, n); if ("normal" === h.type) { if (o = n.done ? 4 : 2, h.arg === f) continue; return { value: h.arg, done: n.done }; } "throw" === h.type && (o = 4, n.method = "throw", n.arg = h.arg); } }; }(r, n, new Context(o || [])), !0), a; } function s(t, r, e) { try { return { type: "normal", arg: t.call(r, e) }; } catch (t) { return { type: "throw", arg: t }; } } r.wrap = h; var f = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var l = {}; c(l, i, function () { return this; }); var p = Object.getPrototypeOf, y = p && p(p(x([]))); y && y !== e && n.call(y, i) && (l = y); var v = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(l); function g(t) { ["next", "throw", "return"].forEach(function (r) { c(t, r, function (t) { return this._invoke(r, t); }); }); } function AsyncIterator(t, r) { function e(o, i, a, u) { var c = s(t[o], t, i); if ("throw" !== c.type) { var h = c.arg, f = h.value; return f && "object" == _typeof(f) && n.call(f, "__await") ? r.resolve(f.__await).then(function (t) { e("next", t, a, u); }, function (t) { e("throw", t, a, u); }) : r.resolve(f).then(function (t) { h.value = t, a(h); }, function (t) { return e("throw", t, a, u); }); } u(c.arg); } var o; c(this, "_invoke", function (t, n) { function i() { return new r(function (r, o) { e(t, n, r, o); }); } return o = o ? o.then(i, i) : i(); }, !0); } function d(r, e) { var n = e.method, o = r.i[n]; if (o === t) return e.delegate = null, "throw" === n && r.i["return"] && (e.method = "return", e.arg = t, d(r, e), "throw" === e.method) || "return" !== n && (e.method = "throw", e.arg = new TypeError("The iterator does not provide a '" + n + "' method")), f; var i = s(o, r.i, e.arg); if ("throw" === i.type) return e.method = "throw", e.arg = i.arg, e.delegate = null, f; var a = i.arg; return a ? a.done ? (e[r.r] = a.value, e.next = r.n, "return" !== e.method && (e.method = "next", e.arg = t), e.delegate = null, f) : a : (e.method = "throw", e.arg = new TypeError("iterator result is not an object"), e.delegate = null, f); } function w(t) { this.tryEntries.push(t); } function m(r) { var e = r[4] || {}; e.type = "normal", e.arg = t, r[4] = e; } function Context(t) { this.tryEntries = [[-1]], t.forEach(w, this), this.reset(!0); } function x(r) { if (null != r) { var e = r[i]; if (e) return e.call(r); if ("function" == typeof r.next) return r; if (!isNaN(r.length)) { var o = -1, a = function e() { for (; ++o < r.length;) if (n.call(r, o)) return e.value = r[o], e.done = !1, e; return e.value = t, e.done = !0, e; }; return a.next = a; } } throw new TypeError(_typeof(r) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, c(v, "constructor", GeneratorFunctionPrototype), c(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = c(GeneratorFunctionPrototype, u, "GeneratorFunction"), r.isGeneratorFunction = function (t) { var r = "function" == typeof t && t.constructor; return !!r && (r === GeneratorFunction || "GeneratorFunction" === (r.displayName || r.name)); }, r.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, c(t, u, "GeneratorFunction")), t.prototype = Object.create(v), t; }, r.awrap = function (t) { return { __await: t }; }, g(AsyncIterator.prototype), c(AsyncIterator.prototype, a, function () { return this; }), r.AsyncIterator = AsyncIterator, r.async = function (t, e, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(h(t, e, n, o), i); return r.isGeneratorFunction(e) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, g(v), c(v, u, "Generator"), c(v, i, function () { return this; }), c(v, "toString", function () { return "[object Generator]"; }), r.keys = function (t) { var r = Object(t), e = []; for (var n in r) e.unshift(n); return function t() { for (; e.length;) if ((n = e.pop()) in r) return t.value = n, t.done = !1, t; return t.done = !0, t; }; }, r.values = x, Context.prototype = { constructor: Context, reset: function reset(r) { if (this.prev = this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(m), !r) for (var e in this) "t" === e.charAt(0) && n.call(this, e) && !isNaN(+e.slice(1)) && (this[e] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0][4]; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(r) { if (this.done) throw r; var e = this; function n(t) { a.type = "throw", a.arg = r, e.next = t; } for (var o = e.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i[4], u = this.prev, c = i[1], h = i[2]; if (-1 === i[0]) return n("end"), !1; if (!c && !h) throw Error("try statement without catch or finally"); if (null != i[0] && i[0] <= u) { if (u < c) return this.method = "next", this.arg = t, n(c), !0; if (u < h) return n(h), !1; } } }, abrupt: function abrupt(t, r) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var n = this.tryEntries[e]; if (n[0] > -1 && n[0] <= this.prev && this.prev < n[2]) { var o = n; break; } } o && ("break" === t || "continue" === t) && o[0] <= r && r <= o[2] && (o = null); var i = o ? o[4] : {}; return i.type = t, i.arg = r, o ? (this.method = "next", this.next = o[2], f) : this.complete(i); }, complete: function complete(t, r) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && r && (this.next = r), f; }, finish: function finish(t) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var e = this.tryEntries[r]; if (e[2] === t) return this.complete(e[4], e[3]), m(e), f; } }, "catch": function _catch(t) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var e = this.tryEntries[r]; if (e[0] === t) { var n = e[4]; if ("throw" === n.type) { var o = n.arg; m(e); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(r, e, n) { return this.delegate = { i: x(r), r: e, n: n }, "next" === this.method && (this.arg = t), f; } }, r; }
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
  var _useState1 = (0, _react.useState)(null),
    _useState10 = _slicedToArray(_useState1, 2),
    log_since = _useState10[0],
    set_log_since = _useState10[1];

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
  var cont_id = (0, _react.useRef)(props.container_id);
  var my_room = (0, _react.useRef)(null);
  var streamer_id = (0, _react.useRef)(null);
  var tsocket = (0, _react.useRef)(null);
  var past_commands = (0, _react.useRef)([]);
  var past_commands_index = (0, _react.useRef)(null);
  (0, _react.useEffect)(function () {
    if (livescroll && inner_ref && inner_ref.current) {
      inner_ref.current.scrollTo(0, inner_ref.current.scrollHeight);
    }
  });
  (0, _react.useEffect)(function () {
    my_room.current = (0, _utilities_react.guid)();
    tsocket.current = new _tactic_socket.TacticSocket("main", 5000, "searchable-console", props.main_id);
    tsocket.current.socket.emit("join", {
      "room": my_room.current
    });
    function cleanup() {
      _stopLogStreaming().then(function () {
        tsocket.current.disconnect();
      });
    }
    initSocket();
    _getLogAndStartStreaming().then(function () {
      window.addEventListener('beforeunload', cleanup);
    });
    return function () {
      cleanup();
      window.removeEventListener('beforeunload', cleanup);
    };
  }, []);
  (0, _utilities_react.useDidMount)(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return _stopLogStreaming(_getLogAndStartStreaming);
        case 2:
        case "end":
          return _context.stop();
      }
    }, _callee);
  })), [max_console_lines]);
  (0, _utilities_react.useDidMount)(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return _stopLogStreaming();
        case 2:
          cont_id.current = props.container_id;
          set_log_since(null);
          set_max_console_lines(100);
          _context2.next = 7;
          return _getLogAndStartStreaming();
        case 7:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  })), [props.container_id]);
  function initSocket() {
    tsocket.current.attachListener("searchable-console-message", _handleUpdateMessage);
  }
  function _handleUpdateMessage(data) {
    if (data.message != "updateLog") return;
    _addToLog(data.new_line);
  }
  function _setLogSince() {
    var now = new Date().getTime();
    set_log_since(now);
    set_log_content("");
  }
  function _setMaxConsoleLines(event) {
    set_max_console_lines(parseInt(event.target.value));
  }
  function _getLogAndStartStreaming() {
    return _getLogAndStartStreaming2.apply(this, arguments);
  }
  function _getLogAndStartStreaming2() {
    _getLogAndStartStreaming2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
      var gotStreamerId, res, data;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            gotStreamerId = function _gotStreamerId(data) {
              streamer_id.current = data.streamer_id;
            };
            _context3.next = 3;
            return (0, _communication_react.postPromise)("host", "get_container_log", {
              container_id: cont_id.current,
              since: log_since,
              max_lines: max_console_lines_ref.current
            }, props.main_id);
          case 3:
            res = _context3.sent;
            set_log_content(res.log_text);
            _context3.next = 7;
            return (0, _communication_react.postPromise)(props.streaming_host, "StartLogStreaming", {
              container_id: cont_id.current,
              room: my_room.current,
              user_id: window.user_id
            }, props.main_id);
          case 7:
            data = _context3.sent;
            gotStreamerId(data);
          case 9:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
    return _getLogAndStartStreaming2.apply(this, arguments);
  }
  function _stopLogStreaming() {
    return _stopLogStreaming2.apply(this, arguments);
  }
  function _stopLogStreaming2() {
    _stopLogStreaming2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
      var callback,
        _args4 = arguments;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            callback = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : null;
            if (!(streamer_id && streamer_id.current)) {
              _context4.next = 5;
              break;
            }
            _context4.next = 4;
            return (0, _communication_react.postPromise)(props.streaming_host, "StopLogStreaming", {
              streamer_id: streamer_id.current
            }, props.main_id);
          case 4:
            if (callback) {
              callback();
            }
          case 5:
            return _context4.abrupt("return", null);
          case 6:
          case "end":
            return _context4.stop();
        }
      }, _callee4);
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
  function _searchNext() {}
  function _structureText() {}
  function _searchPrevious() {}
  function _logExec(_x) {
    return _logExec2.apply(this, arguments);
  }
  function _logExec2() {
    _logExec2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(command) {
      var callback,
        _args5 = arguments;
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            callback = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : null;
            _context5.next = 3;
            return (0, _communication_react.postPromise)(cont_id.current, "os_command_exec", {
              "the_code": command
            }, props.main_id);
          case 3:
            return _context5.abrupt("return", _context5.sent);
          case 4:
          case "end":
            return _context5.stop();
        }
      }, _callee5);
    }));
    return _logExec2.apply(this, arguments);
  }
  function _commandSubmit(_x2) {
    return _commandSubmit2.apply(this, arguments);
  }
  function _commandSubmit2() {
    _commandSubmit2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(e) {
      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            e.preventDefault();
            past_commands.current.push(console_command_value);
            past_commands_index.current = null;
            _context6.next = 5;
            return _logExec(console_command_value);
          case 5:
            set_console_command_value("");
          case 6:
          case "end":
            return _context6.stop();
        }
      }, _callee6);
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
  var the_style = _objectSpread({
    whiteSpace: "nowrap",
    fontSize: 12,
    fontFamily: "monospace"
  }, props.outer_style);
  if (props.showCommandField) {
    the_style.height = the_style.height - 40;
  }
  var bottom_info = "575 lines";
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "searchable-console",
    style: {
      width: "100%"
    }
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
exports.SearchableConsole = SearchableConsole = /*#__PURE__*/(0, _react.memo)(/*#__PURE__*/(0, _react.forwardRef)(SearchableConsole));
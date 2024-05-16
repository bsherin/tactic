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
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
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
  (0, _utilities_react.useDidMount)( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
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
  (0, _utilities_react.useDidMount)( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
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
    _getLogAndStartStreaming2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
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
    _stopLogStreaming2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
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
    set_log_content(log_content_ref.current + new_line);
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
    _logExec2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(command) {
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
    _commandSubmit2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(e) {
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
exports.SearchableConsole = SearchableConsole = /*#__PURE__*/(0, _react.memo)( /*#__PURE__*/(0, _react.forwardRef)(SearchableConsole));
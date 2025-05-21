"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConsoleComponent = ConsoleComponent;
var _react = _interopRequireWildcard(require("react"));
var _core = require("@blueprintjs/core");
var _utilities_react = require("./utilities_react");
var _lodash = _interopRequireDefault(require("lodash"));
var _core2 = _interopRequireDefault(require("highlight.js/lib/core"));
var _javascript = _interopRequireDefault(require("highlight.js/lib/languages/javascript"));
var _python = _interopRequireDefault(require("highlight.js/lib/languages/python"));
var _markdownIt = _interopRequireDefault(require("markdown-it"));
require("markdown-it-latex/dist/index.css");
var _markdownItLatex = _interopRequireDefault(require("markdown-it-latex"));
var _blueprint_react_widgets = require("./blueprint_react_widgets");
var _reactCodemirror = require("./react-codemirror6");
var _sortable_container = require("./sortable_container");
var _communication_react = require("./communication_react");
var _blueprint_mdata_fields = require("./blueprint_mdata_fields");
var _library_pane = require("./library_pane");
var _menu_utilities = require("./menu_utilities");
var _search_form = require("./search_form");
var _searchable_console = require("./searchable_console");
var _settings = require("./settings");
var _modal_react = require("./modal_react");
var _sizing_tools = require("./sizing_tools");
var _error_drawer = require("./error_drawer");
var _assistant = require("./assistant");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } // noinspection JSConstructorReturnsPrimitive,JSUnusedAssignment
_core2["default"].registerLanguage('javascript', _javascript["default"]);
_core2["default"].registerLanguage('python', _python["default"]);
var mdi = (0, _markdownIt["default"])({
  html: true,
  highlight: function highlight(str, lang) {
    if (lang && _core2["default"].getLanguage(lang)) {
      try {
        return '<pre><code class="hljs">' + _core2["default"].highlight(str, {
          language: lang,
          ignoreIllegals: true
        }).value + '</code></pre>';
      } catch (__) {}
    }
    return '<pre><code class="hljs">' + mdi.utils.escapeHtml(str) + '</code></pre>';
  }
});
mdi.use(_markdownItLatex["default"]);
var MAX_CONSOLE_WIDTH = 1800;
var BUTTON_CONSUMED_SPACE = 63;
var SECTION_INDENT = 25; // This is also hard coded into the css file at the moment
var MAX_OUTPUT_LENGTH = 500000;
var GLYPH_BUTTON_STYLE = {
  marginLeft: 2
};
var GLYPH_BUTTON_STYLE2 = {
  marginRight: 5,
  marginTop: 2
};
var GLYPH_BUTTON_STYLE3 = {
  marginLeft: 10,
  marginRight: 66,
  minHeight: 0
};
var GlYPH_BUTTON_STYLE4 = {
  marginLeft: 10,
  marginRight: 66
};
var GLYPH_BUTTON_STYLE5 = {
  marginTop: 5
};
var GLYPH_BUTTON_STYLE6 = {
  marginLeft: 10,
  marginRight: 0
};
var SPINNER_STYLE = {
  marginTop: 10,
  marginRight: 22
};
var MB10_STYLE = {
  marginBottom: 10
};
var WIDTH_100 = {
  width: "100%"
};
var SHOW_DRAWER_FALSE = {
  show_drawer: false
};
var empty_style = {};
var trash_icon = /*#__PURE__*/_react["default"].createElement(_core.Icon, {
  icon: "trash",
  size: 14
});
var clean_icon = /*#__PURE__*/_react["default"].createElement(_core.Icon, {
  icon: "clean",
  size: 14
});
function ConsoleComponent(props) {
  props = _objectSpread({
    style: {},
    shrinkable: true,
    zoomable: true
  }, props);
  var header_ref = (0, _react.useRef)(null);
  var body_ref = (0, _react.useRef)(null);
  var temporarily_closed_items = (0, _react.useRef)([]);
  var filtered_items_ref = (0, _react.useRef)([]);
  var _useState = (0, _react.useState)(null),
    _useState2 = _slicedToArray(_useState, 2),
    console_item_with_focus = _useState2[0],
    set_console_item_with_focus = _useState2[1];
  var _useState3 = (0, _react.useState)(null),
    _useState4 = _slicedToArray(_useState3, 2),
    console_item_saved_focus = _useState4[0],
    set_console_item_saved_focus = _useState4[1];
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)(null),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    search_string = _useStateAndRef2[0],
    set_search_string = _useStateAndRef2[1],
    search_string_ref = _useStateAndRef2[2];
  var _useState5 = (0, _react.useState)(false),
    _useState6 = _slicedToArray(_useState5, 2),
    filter_console_items = _useState6[0],
    set_filter_console_items = _useState6[1];
  var _useState7 = (0, _react.useState)(null),
    _useState8 = _slicedToArray(_useState7, 2),
    search_helper_text = _useState8[0],
    set_search_helper_text = _useState8[1];
  var _useState9 = (0, _react.useState)(false),
    _useState10 = _slicedToArray(_useState9, 2),
    show_main_log = _useState10[0],
    set_show_main_log = _useState10[1];
  var _useState11 = (0, _react.useState)(false),
    _useState12 = _slicedToArray(_useState11, 2),
    show_pseudo_log = _useState12[0],
    set_show_pseudo_log = _useState12[1];
  var _useState13 = (0, _react.useState)(null),
    _useState14 = _slicedToArray(_useState13, 2),
    pseudo_tile_id = _useState14[0],
    set_pseudo_tile_id = _useState14[1];
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  var selectedPane = (0, _react.useContext)(_utilities_react.SelectedPaneContext);
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  var _useSize = (0, _sizing_tools.useSize)(header_ref, 0, "HConsoleComponent"),
    _useSize2 = _slicedToArray(_useSize, 4),
    header_usable_width = _useSize2[0],
    header_usable_height = _useSize2[1],
    header_topX = _useSize2[2],
    header_topY = _useSize2[3];
  var _useSize3 = (0, _sizing_tools.useSize)(body_ref, 0, "ConsoleComponent"),
    _useSize4 = _slicedToArray(_useSize3, 4),
    usable_width = _useSize4[0],
    usable_height = _useSize4[1],
    topX = _useSize4[2],
    topY = _useSize4[3];
  (0, _react.useEffect)(function () {
    initSocket();
    _requestPseudoTileId();
    if (props.console_items.current.length == 0) {
      _addCodeArea("", false);
    }
    if (props.console_selected_items_ref.current.length == 0) {
      _clear_all_selected_items(function () {
        if (props.console_items.current && props.console_items.current.length > 0) {
          _selectConsoleItem(props.console_items.current[0].unique_id);
        }
      });
    }
  }, []);
  (0, _react.useEffect)(function () {
    //console.log("theme changed")  // This is to force re-rendering because of highlight.js theme change
  }, [settingsContext.settings.theme]);
  var _addBlankCode = (0, _react.useCallback)( /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(e) {
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            if (!(window.in_context && !am_selected())) {
              _context.next = 2;
              break;
            }
            return _context.abrupt("return");
          case 2:
            _context.next = 4;
            return _addCodeArea("");
          case 4:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }(), []);
  var _addBlankText = (0, _react.useCallback)( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          if (!(window.in_context && !am_selected())) {
            _context2.next = 2;
            break;
          }
          return _context2.abrupt("return");
        case 2:
          _context2.next = 4;
          return _addConsoleText("");
        case 4:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  })), []);
  var hotkeys = (0, _react.useMemo)(function () {
    return [{
      combo: "Ctrl+C",
      global: false,
      group: "Notebook",
      label: "New Code Cell",
      onKeyDown: _addBlankCode
    }, {
      combo: "Ctrl+T",
      global: false,
      group: "Notebook",
      label: "New Text Cell",
      onKeyDown: _addBlankText
    }, {
      combo: "Ctrl+Enter",
      global: false,
      group: "Notebook",
      label: "Run Selected Cell",
      onKeyDown: _runSelected
    }, {
      combo: "Cmd+Enter",
      global: false,
      group: "Notebook",
      label: "Run Selected Cell",
      onKeyDown: _runSelected
    }, {
      combo: "Escape",
      global: false,
      group: "Notebook",
      label: "Clear Selected Cells",
      onKeyDown: function onKeyDown() {
        _clear_all_selected_items();
      }
    }];
  }, [_addBlankCode, _addBlankText, _runSelected, _clear_all_selected_items]);
  var _useHotkeys = (0, _core.useHotkeys)(hotkeys),
    handleKeyDown = _useHotkeys.handleKeyDown,
    handleKeyUp = _useHotkeys.handleKeyUp;
  function initSocket() {
    function _handleConsoleMessage(data) {
      if (data.main_id == props.main_id) {
        // noinspection JSUnusedGlobalSymbols
        var handlerDict = {
          consoleLog: function consoleLog(data) {
            return _addConsoleEntry(data.message, data.force_open, true);
          },
          consoleLogMultiple: function consoleLogMultiple(data) {
            return _addConsoleEntries(data.message, data.force_open, true);
          },
          createLink: function () {
            var _createLink = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(data) {
              var unique_id;
              return _regeneratorRuntime().wrap(function _callee3$(_context3) {
                while (1) switch (_context3.prev = _context3.next) {
                  case 0:
                    unique_id = data.message.unique_id;
                    _context3.next = 3;
                    return _addConsoleEntry(data.message, data.force_open, false, null, function () {
                      _insertLinkInItem(unique_id);
                    });
                  case 3:
                  case "end":
                    return _context3.stop();
                }
              }, _callee3);
            }));
            function createLink(_x2) {
              return _createLink.apply(this, arguments);
            }
            return createLink;
          }(),
          stopConsoleSpinner: function stopConsoleSpinner(data) {
            var execution_count = "execution_count" in data ? data.execution_count : null;
            _stopConsoleSpinner(data.console_id, execution_count);
          },
          consoleCodePrint: function consoleCodePrint(data) {
            return _appendConsoleItemOutput(data);
          },
          consoleCodeOverwrite: function consoleCodeOverwrite(data) {
            return _setConsoleItemOutput(data);
          }
        };
        handlerDict[data.console_message](data);
      }
    }

    // We have to careful to get the very same instance of the listerner function
    // That requires storing it outside of this component since the console can be unmounted

    props.tsocket.attachListener("console-message", _handleConsoleMessage);
  }
  function _requestPseudoTileId() {
    if (pseudo_tile_id == null) {
      (0, _communication_react.postWithCallback)(props.main_id, "get_pseudo_tile_id", {}, function (res) {
        set_pseudo_tile_id(res.pseudo_tile_id);
      });
    }
  }
  function _createTextEntry(unique_id, summary_text) {
    return {
      unique_id: unique_id,
      type: "text",
      am_shrunk: false,
      summary_text: summary_text,
      console_text: "",
      show_markdown: false
    };
  }
  function _pasteImage() {
    return _pasteImage2.apply(this, arguments);
  }
  function _pasteImage2() {
    _pasteImage2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee14() {
      var clipboardContents, blob, _iterator14, _step14, item, gotBlob, _gotBlob;
      return _regeneratorRuntime().wrap(function _callee14$(_context15) {
        while (1) switch (_context15.prev = _context15.next) {
          case 0:
            _gotBlob = function _gotBlob3() {
              _gotBlob = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee13(blob) {
                var formData;
                return _regeneratorRuntime().wrap(function _callee13$(_context14) {
                  while (1) switch (_context14.prev = _context14.next) {
                    case 0:
                      formData = new FormData();
                      formData.append('image', blob, 'image.png');
                      formData.append("main_id", props.main_id);
                      _context14.prev = 3;
                      _context14.next = 6;
                      return (0, _communication_react.postFormDataPromise)("print_blob_area_to_console", formData);
                    case 6:
                      _context14.next = 11;
                      break;
                    case 8:
                      _context14.prev = 8;
                      _context14.t0 = _context14["catch"](3);
                      console.log(_context14.t0);
                    case 11:
                    case "end":
                      return _context14.stop();
                  }
                }, _callee13, null, [[3, 8]]);
              }));
              return _gotBlob.apply(this, arguments);
            };
            gotBlob = function _gotBlob2(_x8) {
              return _gotBlob.apply(this, arguments);
            };
            blob = null;
            _context15.next = 5;
            return navigator.clipboard.read();
          case 5:
            clipboardContents = _context15.sent;
            _iterator14 = _createForOfIteratorHelper(clipboardContents);
            _context15.prev = 7;
            _iterator14.s();
          case 9:
            if ((_step14 = _iterator14.n()).done) {
              _context15.next = 22;
              break;
            }
            item = _step14.value;
            if (!item.types.includes("image/png")) {
              _context15.next = 20;
              break;
            }
            _context15.next = 14;
            return item.getType("image/png");
          case 14:
            blob = _context15.sent;
            if (!(blob == null)) {
              _context15.next = 17;
              break;
            }
            return _context15.abrupt("return");
          case 17:
            _context15.next = 19;
            return gotBlob(blob);
          case 19:
            return _context15.abrupt("break", 22);
          case 20:
            _context15.next = 9;
            break;
          case 22:
            _context15.next = 27;
            break;
          case 24:
            _context15.prev = 24;
            _context15.t0 = _context15["catch"](7);
            _iterator14.e(_context15.t0);
          case 27:
            _context15.prev = 27;
            _iterator14.f();
            return _context15.finish(27);
          case 30:
          case "end":
            return _context15.stop();
        }
      }, _callee14, null, [[7, 24, 27, 30]]);
    }));
    return _pasteImage2.apply(this, arguments);
  }
  function _addConsoleText(_x3) {
    return _addConsoleText2.apply(this, arguments);
  }
  function _addConsoleText2() {
    _addConsoleText2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee15(the_text) {
      var callback,
        _args16 = arguments;
      return _regeneratorRuntime().wrap(function _callee15$(_context16) {
        while (1) switch (_context16.prev = _context16.next) {
          case 0:
            callback = _args16.length > 1 && _args16[1] !== undefined ? _args16[1] : null;
            _context16.prev = 1;
            _context16.next = 4;
            return (0, _communication_react.postPromise)("host", "print_text_area_to_console", {
              "console_text": the_text,
              "user_id": window.user_id,
              "main_id": props.main_id
            }, props.main_id);
          case 4:
            if (callback != null) {
              callback();
            }
            _context16.next = 10;
            break;
          case 7:
            _context16.prev = 7;
            _context16.t0 = _context16["catch"](1);
            errorDrawerFuncs.addFromError("Error creating text area", _context16.t0);
          case 10:
          case "end":
            return _context16.stop();
        }
      }, _callee15, null, [[1, 7]]);
    }));
    return _addConsoleText2.apply(this, arguments);
  }
  function am_selected() {
    return selectedPane.amSelected(selectedPane.tab_id, selectedPane.selectedTabIdRef);
  }
  function _addConsoleDivider(_x4) {
    return _addConsoleDivider2.apply(this, arguments);
  }
  function _addConsoleDivider2() {
    _addConsoleDivider2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee16(header_text) {
      var callback,
        _args17 = arguments;
      return _regeneratorRuntime().wrap(function _callee16$(_context17) {
        while (1) switch (_context17.prev = _context17.next) {
          case 0:
            callback = _args17.length > 1 && _args17[1] !== undefined ? _args17[1] : null;
            _context17.prev = 1;
            _context17.next = 4;
            return (0, _communication_react.postPromise)("host", "print_divider_area_to_console", {
              "header_text": header_text,
              "user_id": window.user_id,
              "main_id": props.main_id
            }, props.main_id);
          case 4:
            if (callback != null) {
              callback();
            }
            _context17.next = 10;
            break;
          case 7:
            _context17.prev = 7;
            _context17.t0 = _context17["catch"](1);
            errorDrawerFuncs.addFromError("Error creating divider", _context17.t0);
          case 10:
          case "end":
            return _context17.stop();
        }
      }, _callee16, null, [[1, 7]]);
    }));
    return _addConsoleDivider2.apply(this, arguments);
  }
  var _addBlankDivider = (0, _react.useCallback)( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          if (!(window.in_context && !am_selected())) {
            _context4.next = 2;
            break;
          }
          return _context4.abrupt("return");
        case 2:
          _context4.next = 4;
          return _addConsoleDivider("");
        case 4:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  })), []);
  function _getSectionIds(unique_id) {
    var cindex = _consoleItemIndex(unique_id);
    var id_list = [unique_id];
    for (var i = cindex + 1; i < props.console_items.current.length; ++i) {
      var entry = props.console_items.current[i];
      id_list.push(entry.unique_id);
      if (entry.type == "section-end") {
        break;
      }
    }
    return id_list;
  }
  var _deleteSection = (0, _react.useCallback)( /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(unique_id) {
      var centry, confirm_text, id_list, cindex, new_console_items;
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            centry = get_console_item_entry(unique_id);
            confirm_text = "Delete section ".concat(centry.header_text, "?");
            _context5.prev = 2;
            _context5.next = 5;
            return dialogFuncs.showModalPromise("ConfirmDialog", {
              title: "Delete Section",
              text_body: confirm_text,
              cancel_text: "do nothing",
              submit_text: "delete",
              handleClose: dialogFuncs.hideModal
            });
          case 5:
            id_list = _getSectionIds(unique_id);
            cindex = _consoleItemIndex(unique_id);
            new_console_items = _toConsumableArray(props.console_items.current);
            new_console_items.splice(cindex, id_list.length);
            _clear_all_selected_items();
            props.dispatch({
              type: "delete_items",
              id_list: id_list
            });
            _context5.next = 16;
            break;
          case 13:
            _context5.prev = 13;
            _context5.t0 = _context5["catch"](2);
            if (_context5.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error deleting section", _context5.t0);
            }
          case 16:
          case "end":
            return _context5.stop();
        }
      }, _callee5, null, [[2, 13]]);
    }));
    return function (_x5) {
      return _ref4.apply(this, arguments);
    };
  }(), []);
  var _copySection = (0, _react.useCallback)(function () {
    var unique_id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    if (!unique_id) {
      if (props.console_selected_items_ref.current.length != 1) {
        return;
      }
      unique_id = props.console_selected_items_ref.current[0];
      var entry = get_console_item_entry(unique_id);
      if (entry.type != "divider") {
        return;
      }
    }
    var id_list = _getSectionIds(unique_id);
    _copyItems(id_list);
  }, []);
  var _copyCell = (0, _react.useCallback)(function () {
    var unique_id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var id_list;
    if (!unique_id) {
      id_list = _sortSelectedItems();
      if (id_list.length == 0) {
        return;
      }
    } else {
      id_list = [unique_id];
    }
    _copyItems(id_list);
  }, []);
  function _copyAll() {
    var result_dict = {
      "main_id": props.main_id,
      "console_items": props.console_items.current,
      "user_id": window.user_id
    };
    (0, _communication_react.postWithCallback)("host", "copy_console_cells", result_dict, null, null, props.main_id);
  }
  function _copyItems(id_list) {
    var entry_list = [];
    var in_section = false;
    var _iterator = _createForOfIteratorHelper(props.console_items.current),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var entry = _step.value;
        if (in_section) {
          entry.am_selected = false;
          entry_list.push(entry);
          in_section = entry.type != "section-end";
        } else {
          if (id_list.includes(entry.unique_id)) {
            entry.am_selected = false;
            entry_list.push(entry);
            if (entry.type == "divider") {
              in_section = true;
            }
          }
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    var result_dict = {
      "main_id": props.main_id,
      "console_items": entry_list,
      "user_id": window.user_id
    };
    (0, _communication_react.postWithCallback)("host", "copy_console_cells", result_dict, null, null, props.main_id);
  }
  var _pasteCell = (0, _react.useCallback)( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
    var unique_id,
      data,
      _args6 = arguments;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          unique_id = _args6.length > 0 && _args6[0] !== undefined ? _args6[0] : null;
          _context6.prev = 1;
          _context6.next = 4;
          return (0, _communication_react.postPromise)("host", "get_copied_console_cells", {
            user_id: window.user_id
          }, props.main_id);
        case 4:
          data = _context6.sent;
          _addConsoleEntries(data.console_items, true, false, unique_id);
          _context6.next = 11;
          break;
        case 8:
          _context6.prev = 8;
          _context6.t0 = _context6["catch"](1);
          errorDrawerFuncs.addFromError("Error getting copied cells", _context6.t0);
        case 11:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[1, 8]]);
  })), []);
  function _addConsoleTextLink() {
    return _addConsoleTextLink2.apply(this, arguments);
  }
  function _addConsoleTextLink2() {
    _addConsoleTextLink2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee17() {
      var callback,
        _args18 = arguments;
      return _regeneratorRuntime().wrap(function _callee17$(_context18) {
        while (1) switch (_context18.prev = _context18.next) {
          case 0:
            callback = _args18.length > 0 && _args18[0] !== undefined ? _args18[0] : null;
            _context18.prev = 1;
            _context18.next = 4;
            return (0, _communication_react.postPromise)("host", "print_link_area_to_console", {
              "user_id": window.user_id,
              "main_id": props.main_id
            }, props.main_id);
          case 4:
            if (callback) {
              callback();
            }
            _context18.next = 10;
            break;
          case 7:
            _context18.prev = 7;
            _context18.t0 = _context18["catch"](1);
            errorDrawerFuncs.addFromError("Error creating link", _context18.t0);
          case 10:
          case "end":
            return _context18.stop();
        }
      }, _callee17, null, [[1, 7]]);
    }));
    return _addConsoleTextLink2.apply(this, arguments);
  }
  function _currently_selected() {
    if (props.console_selected_items_ref.current.length == 0) {
      return null;
    } else {
      return _lodash["default"].last(props.console_selected_items_ref.current);
    }
  }
  var _insertResourceLink = (0, _react.useCallback)( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7() {
    var entry;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          if (_currently_selected()) {
            _context7.next = 4;
            break;
          }
          _context7.next = 3;
          return _addConsoleTextLink();
        case 3:
          return _context7.abrupt("return");
        case 4:
          entry = get_console_item_entry(_currently_selected());
          if (!(!entry || entry.type != "text")) {
            _context7.next = 9;
            break;
          }
          _context7.next = 8;
          return _addConsoleTextLink();
        case 8:
          return _context7.abrupt("return");
        case 9:
          _context7.next = 11;
          return _insertLinkInItem(_currently_selected());
        case 11:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  })), []);
  function _insertLinkInItem(_x6) {
    return _insertLinkInItem2.apply(this, arguments);
  }
  function _insertLinkInItem2() {
    _insertLinkInItem2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee18(unique_id) {
      var entry, result, new_links;
      return _regeneratorRuntime().wrap(function _callee18$(_context19) {
        while (1) switch (_context19.prev = _context19.next) {
          case 0:
            _context19.prev = 0;
            entry = get_console_item_entry(unique_id);
            _context19.next = 4;
            return dialogFuncs.showModalPromise("SelectResourceDialog", {
              cancel_text: "cancel",
              submit_text: "insert link",
              handleClose: dialogFuncs.hideModal
            });
          case 4:
            result = _context19.sent;
            new_links = "links" in entry ? _toConsumableArray(entry.links) : [];
            new_links.push({
              res_type: result.type,
              res_name: result.selected_resource
            });
            _setConsoleItemValue(entry.unique_id, "links", new_links);
            _context19.next = 13;
            break;
          case 10:
            _context19.prev = 10;
            _context19.t0 = _context19["catch"](0);
            errorDrawerFuncs.addFromError("Error inserting link", _context19.t0);
          case 13:
          case "end":
            return _context19.stop();
        }
      }, _callee18, null, [[0, 10]]);
    }));
    return _insertLinkInItem2.apply(this, arguments);
  }
  function _addCodeArea(the_text) {
    var force_open = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    try {
      (0, _communication_react.postWithCallback)("host", "print_code_area_to_console", {
        console_text: the_text,
        user_id: window.user_id,
        main_id: props.main_id,
        force_open: force_open
      }, null, null, props.main_id);
    } catch (e) {
      errorDrawerFuncs.addFromError("Error creating code cell", e);
    }
  }
  var _resetConsole = (0, _react.useCallback)(function () {
    props.dispatch({
      type: "reset"
    });
    (0, _communication_react.postWithCallback)(props.main_id, "clear_console_namespace", {}, null, null, props.main_id);
  }, []);
  function _stopAll() {
    (0, _communication_react.postWithCallback)(props.main_id, "stop_all_console_code", {}, null, null, props.main_id);
  }
  var _clearConsole = (0, _react.useCallback)( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8() {
    var confirm_text;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          confirm_text = "Are you sure that you want to erase everything in this log?";
          _context8.next = 4;
          return dialogFuncs.showModalPromise("ConfirmDialog", {
            title: "Clear entire log",
            text_body: confirm_text,
            cancel_text: "do nothing",
            submit_text: "clear",
            handleClose: dialogFuncs.hideModal
          });
        case 4:
          props.set_console_selected_items([]);
          pushCallback(function () {
            props.dispatch({
              type: "delete_all_items"
            });
          });
          _context8.next = 11;
          break;
        case 8:
          _context8.prev = 8;
          _context8.t0 = _context8["catch"](0);
          if (_context8.t0 != "canceled") {
            errorDrawerFuncs.addFromError("Error clearing console", _context8.t0);
          }
        case 11:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[0, 8]]);
  })), []);
  function _togglePseudoLog() {
    set_show_pseudo_log(!show_pseudo_log);
  }
  function _toggleMainLog() {
    set_show_main_log(!show_main_log);
  }
  var _setFocusedItem = (0, _react.useCallback)(function (unique_id) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    set_console_item_with_focus(unique_id);
    if (unique_id) {
      set_console_item_saved_focus(unique_id);
    }
    pushCallback(callback);
  }, []);
  var _zoomConsole = (0, _react.useCallback)(function () {
    props.setMainStateValue("console_is_zoomed", true);
  }, []);
  var _unzoomConsole = (0, _react.useCallback)(function () {
    props.setMainStateValue("console_is_zoomed", false);
  }, []);
  var _expandConsole = (0, _react.useCallback)(function () {
    props.setMainStateValue("console_is_shrunk", false);
  }, []);
  var _shrinkConsole = (0, _react.useCallback)(function () {
    props.setMainStateValue("console_is_shrunk", true);
    if (props.mState.console_is_zoomed) {
      _unzoomConsole();
    }
  }, [props.mState.console_is_zoomed]);
  var _toggleExports = (0, _react.useCallback)(function () {
    props.setMainStateValue("show_exports_pane", !props.mState.show_exports_pane);
  }, [props.mState.show_exports_pane]);
  var _setConsoleItemValue = (0, _react.useCallback)(function (unique_id, field, new_value) {
    var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    props.dispatch({
      type: "change_item_value",
      unique_id: unique_id,
      field: field,
      new_value: new_value
    });
    pushCallback(callback);
  }, []);
  function _reOpenClosedDividers() {
    if (temporarily_closed_items.current.length == 0) {
      return;
    }
    props.dispatch({
      type: "open_listed_dividers",
      divider_list: temporarily_closed_items.current
    });
  }
  function _closeAllDividers() {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var _iterator2 = _createForOfIteratorHelper(console_items.current),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var entry = _step2.value;
        if (entry.type == "divider") {
          if (!entry.am_shrunk) {
            entry.am_shrunk = true;
            temporarily_closed_items.current.push(entry.unique_id);
          }
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    props.dispatch("close_all_divider");
  }
  function _multiple_console_item_updates(updates) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    props.dispatch({
      type: "update_items",
      updates: updates
    });
    pushCallback(callback);
  }
  function _clear_all_selected_items() {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    props.set_console_selected_items([]);
    pushCallback(function () {
      props.dispatch({
        type: "clear_all_selected"
      });
    });
    pushCallback(callback);
  }
  function _reduce_to_last_selected() {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    if (props.console_selected_items_ref.current.length <= 1) {
      if (callback) {
        callback();
      }
      return;
    }
    var updates = {};
    var _iterator3 = _createForOfIteratorHelper(props.console_selected_items_ref.current.slice(0, -1)),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var uid = _step3.value;
        updates[uid] = {
          am_selected: false,
          search_string: null
        };
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    _multiple_console_item_updates(updates, function () {
      props.set_console_selected_items(props.console_selected_items_ref.current.slice(-1));
      pushCallback(callback);
    });
  }
  function get_console_item_entry(unique_id) {
    return _lodash["default"].cloneDeep(props.console_items.current[_consoleItemIndex(unique_id)]);
  }
  function _dselectOneItem(unique_id) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var updates = {};
    if (props.console_selected_items_ref.current.includes(unique_id)) {
      updates[unique_id] = {
        am_selected: false,
        search_string: null
      };
      _multiple_console_item_updates(updates, function () {
        var narray = _lodash["default"].cloneDeep(props.console_selected_items_ref.current);
        var myIndex = narray.indexOf(unique_id);
        if (myIndex !== -1) {
          narray.splice(myIndex, 1);
        }
        props.set_console_selected_items(narray);
        pushCallback(callback);
      });
    } else {
      pushCallback(callback);
    }
  }
  var _selectConsoleItem = (0, _react.useCallback)(function (unique_id) {
    var event = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var updates = {};
    var shift_down = event != null && event.shiftKey;
    if (!shift_down) {
      var _iterator4 = _createForOfIteratorHelper(props.console_selected_items_ref.current),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var uid = _step4.value;
          if (uid != unique_id) {
            updates[uid] = {
              am_selected: false,
              search_string: null
            };
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
      updates[unique_id] = {
        am_selected: true,
        search_string: search_string_ref.current
      };
      _multiple_console_item_updates(updates, function () {
        props.set_console_selected_items([unique_id]);
        pushCallback(callback);
      });
    } else {
      if (props.console_selected_items_ref.current.includes(unique_id)) {
        _dselectOneItem(unique_id);
      } else {
        updates[unique_id] = {
          am_selected: true,
          search_string: search_string_ref.current
        };
        _multiple_console_item_updates(updates, function () {
          var narray = _lodash["default"].cloneDeep(props.console_selected_items_ref.current);
          narray.push(unique_id);
          props.set_console_selected_items(narray);
          pushCallback(callback);
        });
      }
    }
  }, []);
  function _sortSelectedItems() {
    var sitems = _lodash["default"].cloneDeep(props.console_selected_items_ref.current);
    sitems.sort(function (firstEl, secondEl) {
      return _consoleItemIndex(firstEl) < _consoleItemIndex(secondEl) ? -1 : 1;
    });
    return sitems;
  }
  function _clearSelectedItem() {
    var updates = {};
    var _iterator5 = _createForOfIteratorHelper(props.console_selected_items_ref.current),
      _step5;
    try {
      for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
        var uid = _step5.value;
        updates[unique_id] = {
          am_selected: false,
          search_string: null
        };
      }
    } catch (err) {
      _iterator5.e(err);
    } finally {
      _iterator5.f();
    }
    _multiple_console_item_updates(updates, function () {
      props.set_console_selected_items({});
      set_console_item_with_focus(null);
    });
  }
  function _consoleItemIndex(unique_id) {
    var console_items = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var counter = 0;
    if (console_items == null) {
      console_items = props.console_items.current;
    }
    var _iterator6 = _createForOfIteratorHelper(console_items),
      _step6;
    try {
      for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
        var entry = _step6.value;
        if (entry.unique_id == unique_id) {
          return counter;
        }
        ++counter;
      }
    } catch (err) {
      _iterator6.e(err);
    } finally {
      _iterator6.f();
    }
    return -1;
  }
  function _moveSection(_ref8, filtered_items) {
    var oldIndex = _ref8.oldIndex,
      newIndex = _ref8.newIndex;
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    if (newIndex > oldIndex) {
      newIndex += 1;
    }
    var move_entry = filtered_items[oldIndex];
    var move_index = _consoleItemIndex(move_entry.unique_id);
    var section_ids = _getSectionIds(move_entry.unique_id);
    var the_section = _lodash["default"].cloneDeep(props.console_items.current.slice(move_index, move_index + section_ids.length));
    props.dispatch({
      type: "delete_items",
      id_list: section_ids
    });
    pushCallback(function () {
      var below_index;
      if (newIndex == 0) {
        below_index = 0;
      } else {
        var trueNewIndex;
        if (newIndex >= filtered_items.length) {
          trueNewIndex = -1;
        } else trueNewIndex = _consoleItemIndex(filtered_items[newIndex].unique_id);
        // noinspection ES6ConvertIndexedForToForOf
        if (trueNewIndex == -1) {
          below_index = props.console_items.current.length;
        } else {
          for (below_index = trueNewIndex; below_index < props.console_items.current.length; ++below_index) {
            if (props.console_items.current[below_index].type == "divider") {
              break;
            }
          }
          if (below_index >= props.console_items.current.length) {
            below_index = props.console_items.current.length;
          }
        }
      }
      console.log("Got below index " + String(below_index));
      props.dispatch({
        type: "add_at_index",
        new_items: the_section,
        insert_index: below_index
      });
      pushCallback(callback);
    });
  }
  function _moveEntryAfterEntry(move_id, above_id) {
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var new_console_items = _toConsumableArray(props.console_items.current);
    var move_entry = _lodash["default"].cloneDeep(get_console_item_entry(move_id));
    props.dispatch({
      type: "delete_item",
      unique_id: move_id
    });
    pushCallback(function () {
      var target_index;
      if (above_id == null) {
        target_index = 0;
      } else {
        target_index = _consoleItemIndex(above_id) + 1;
      }
      props.dispatch({
        type: "add_at_index",
        insert_index: target_index,
        new_items: [move_entry]
      });
      pushCallback(callback);
    });
  }
  var _resortConsoleItems = (0, _react.useCallback)(function (_ref9) {
    var destination = _ref9.destination,
      source = _ref9.source;
    var oldIndex = source.index;
    var newIndex = destination.index;
    filtered_items = filtered_items_ref.current;
    var callback = _showNonDividers;
    console.log("Got oldIndex ".concat(String(oldIndex), " newIndex ").concat(String(newIndex), " ").concat(filtered_items.length, " items"));
    if (oldIndex == newIndex) {
      callback();
      return;
    }
    var move_entry = filtered_items[oldIndex];
    if (move_entry.type == "divider") {
      _moveSection({
        oldIndex: oldIndex,
        newIndex: newIndex
      }, filtered_items, callback);
      return;
    }
    var trueOldIndex = _consoleItemIndex(move_entry.unique_id);
    var trueNewIndex;
    var above_entry;
    if (newIndex == 0) {
      above_entry = null;
    } else {
      if (newIndex > oldIndex) {
        above_entry = filtered_items[newIndex];
      } else {
        above_entry = filtered_items[newIndex - 1];
      }
      if (above_entry.type == "divider" && above_entry.am_shrunk) {
        var section_ids = _getSectionIds(above_entry.unique_id);
        var lastIdInSection = _lodash["default"].last(section_ids);
        _moveEntryAfterEntry(move_entry.unique_id, lastIdInSection, callback);
        return;
      }
    }
    var target_id = above_entry == null ? null : above_entry.unique_id;
    _moveEntryAfterEntry(move_entry.unique_id, target_id, callback);
  }, []);
  var _goToNextCell = (0, _react.useCallback)( /*#__PURE__*/function () {
    var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(unique_id) {
      var next_index, _loop, _ret;
      return _regeneratorRuntime().wrap(function _callee9$(_context10) {
        while (1) switch (_context10.prev = _context10.next) {
          case 0:
            next_index = _consoleItemIndex(unique_id) + 1;
            _loop = /*#__PURE__*/_regeneratorRuntime().mark(function _loop() {
              var next_id, next_item;
              return _regeneratorRuntime().wrap(function _loop$(_context9) {
                while (1) switch (_context9.prev = _context9.next) {
                  case 0:
                    next_id = props.console_items.current[next_index].unique_id;
                    next_item = props.console_items.current[next_index];
                    if (!(!next_item.am_shrunk && (next_item.type == "code" || next_item.type == "text" && !next_item.show_markdown))) {
                      _context9.next = 5;
                      break;
                    }
                    if (!next_item.show_on_filtered) {
                      set_filter_console_items(false);
                      pushCallback(function () {
                        _setConsoleItemValue(next_id, "set_focus", true);
                      });
                    } else {
                      _setConsoleItemValue(next_id, "set_focus", true);
                    }
                    return _context9.abrupt("return", {
                      v: void 0
                    });
                  case 5:
                    next_index += 1;
                  case 6:
                  case "end":
                    return _context9.stop();
                }
              }, _loop);
            });
          case 2:
            if (!(next_index < props.console_items.current.length)) {
              _context10.next = 9;
              break;
            }
            return _context10.delegateYield(_loop(), "t0", 4);
          case 4:
            _ret = _context10.t0;
            if (!_ret) {
              _context10.next = 7;
              break;
            }
            return _context10.abrupt("return", _ret.v);
          case 7:
            _context10.next = 2;
            break;
          case 9:
            _context10.next = 11;
            return _addCodeArea("");
          case 11:
            return _context10.abrupt("return");
          case 12:
          case "end":
            return _context10.stop();
        }
      }, _callee9);
    }));
    return function (_x7) {
      return _ref10.apply(this, arguments);
    };
  }(), []);
  function _isDividerSelected() {
    var _iterator7 = _createForOfIteratorHelper(props.console_selected_items_ref.current),
      _step7;
    try {
      for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
        var uid = _step7.value;
        var centry = get_console_item_entry(uid);
        if (centry.type == "divider") {
          return true;
        }
      }
    } catch (err) {
      _iterator7.e(err);
    } finally {
      _iterator7.f();
    }
    return false;
  }
  function _doDeleteSelected() {
    var new_console_items = [];
    var in_section = false;
    var to_delete = [];
    var _iterator8 = _createForOfIteratorHelper(props.console_items.current),
      _step8;
    try {
      for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
        var entry = _step8.value;
        if (in_section) {
          to_delete.push(entry.unique_id);
          in_section = entry.type != "section-end";
          continue;
        }
        if (props.console_selected_items_ref.current.includes(entry.unique_id)) {
          to_delete.push(entry.unique_id);
          if (entry.type == "divider") {
            in_section = true;
          }
        }
      }
    } catch (err) {
      _iterator8.e(err);
    } finally {
      _iterator8.f();
    }
    _clear_all_selected_items(function () {
      props.dispatch({
        type: "delete_items",
        id_list: to_delete
      });
    });
  }
  function _deleteSelected() {
    return _deleteSelected2.apply(this, arguments);
  }
  function _deleteSelected2() {
    _deleteSelected2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee19() {
      var new_console_items, confirm_text;
      return _regeneratorRuntime().wrap(function _callee19$(_context20) {
        while (1) switch (_context20.prev = _context20.next) {
          case 0:
            if (!_are_selected()) {
              _context20.next = 13;
              break;
            }
            new_console_items = [];
            _context20.prev = 2;
            if (!_isDividerSelected()) {
              _context20.next = 7;
              break;
            }
            confirm_text = "The selection includes section dividers. " + "The sections will be completed in their entirety. Do you want to continue";
            _context20.next = 7;
            return dialogFuncs.showModalPromise("ConfirmDialog", {
              title: "Do Delete",
              text_body: confirm_text,
              cancel_text: "do nothing",
              submit_text: "delete",
              handleClose: dialogFuncs.hideModal
            });
          case 7:
            _doDeleteSelected();
            _context20.next = 13;
            break;
          case 10:
            _context20.prev = 10;
            _context20.t0 = _context20["catch"](2);
            if (_context20.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error duplicating resource ".concat(res_name), _context20.t0);
            }
          case 13:
          case "end":
            return _context20.stop();
        }
      }, _callee19, null, [[2, 10]]);
    }));
    return _deleteSelected2.apply(this, arguments);
  }
  var _closeConsoleItem = (0, _react.useCallback)(function (unique_id) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var centry = get_console_item_entry(unique_id);
    if (centry.type == "divider") {
      _deleteSection(unique_id);
    } else {
      _dselectOneItem(unique_id, function () {
        props.dispatch({
          type: "delete_item",
          unique_id: unique_id
        });
      });
    }
  }, []);
  function _getNextEndIndex(start_id) {
    var start_index = _consoleItemIndex(start_id);
    var _iterator9 = _createForOfIteratorHelper(props.console_items.current.slice(start_index)),
      _step9;
    try {
      for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
        var entry = _step9.value;
        if (entry.type == "section-end") {
          return _consoleItemIndex(entry.unique_id);
        }
      }
    } catch (err) {
      _iterator9.e(err);
    } finally {
      _iterator9.f();
    }
    return props.console_items.current.length;
  }
  function _isInSection(unique_id) {
    var idx = _consoleItemIndex(unique_id);
    var _iterator10 = _createForOfIteratorHelper(props.console_items.current.slice(idx + 1)),
      _step10;
    try {
      for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
        var entry = _step10.value;
        if (entry.type == "divider") {
          return false;
        } else {
          if (entry.type == "section-end") {
            return true;
          }
        }
      }
    } catch (err) {
      _iterator10.e(err);
    } finally {
      _iterator10.f();
    }
    return false;
  }
  function _addConsoleEntries(new_entries) {
    var force_open = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var set_focus = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var unique_id = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var callback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    _lodash["default"].last(new_entries).set_focus = set_focus;
    var inserting_divider = false;
    var _iterator11 = _createForOfIteratorHelper(new_entries),
      _step11;
    try {
      for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
        var entry = _step11.value;
        if (entry.type == "divider") {
          inserting_divider = true;
        }
      }
    } catch (err) {
      _iterator11.e(err);
    } finally {
      _iterator11.f();
    }
    var last_id = _lodash["default"].last(new_entries).unique_id;
    var insert_index;
    if (unique_id) {
      if (inserting_divider && _isInSection(unique_id)) {
        insert_index = _getNextEndIndex(unique_id) + 1;
      } else {
        insert_index = _consoleItemIndex(unique_id) + 1;
      }
    } else if (props.console_items.current.length == 0 || props.console_selected_items_ref.current.length == 0) {
      insert_index = props.console_items.current.length;
    } else {
      var current_selected_id = _currently_selected();
      if (inserting_divider && _isInSection(current_selected_id)) {
        insert_index = _getNextEndIndex(current_selected_id) + 1;
      } else {
        var selected_item = get_console_item_entry(current_selected_id);
        if (selected_item.type == "divider") {
          if (selected_item.am_shrunk) {
            insert_index = _getNextEndIndex(current_selected_id) + 1;
          } else {
            insert_index = _consoleItemIndex(current_selected_id) + 1;
          }
        } else {
          insert_index = _consoleItemIndex(current_selected_id) + 1;
        }
      }
    }
    props.dispatch({
      type: "add_at_index",
      insert_index: insert_index,
      new_items: new_entries
    });
    pushCallback(function () {
      if (force_open) {
        props.setMainStateValue("console_is_shrunk", false, function () {
          _selectConsoleItem(last_id, null, callback);
        });
      } else {
        _selectConsoleItem(last_id, null, callback);
      }
    });
  }
  function _addConsoleEntry(new_entry) {
    var force_open = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var set_focus = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var unique_id = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var callback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    _addConsoleEntries([new_entry], force_open, set_focus, unique_id, callback);
  }
  function _startSpinner(unique_id) {
    var update_dict = {
      show_spinner: true,
      running: true
    };
    var updates = {};
    updates[unique_id] = update_dict;
    props.dispatch({
      type: "update_items",
      updates: updates
    });
  }
  function _stopConsoleSpinner(unique_id) {
    var execution_count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var update_dict = {
      show_spinner: false,
      running: false
    };
    if ("execution_count" != null) {
      update_dict.execution_count = execution_count;
    }
    var updates = {};
    updates[unique_id] = update_dict;
    props.dispatch({
      type: "update_items",
      updates: updates
    });
  }
  function _appendConsoleItemOutput(data) {
    //let current = get_console_item_entry(data.console_id).output_dict;
    // if (current != "") {
    //     current += "<br>"
    // }
    // current[data.counter] = data.result_text;
    // if (current.length > MAX_OUTPUT_LENGTH) {
    //     current = current.slice(-1 * MAX_OUTPUT_LENGTH,)
    // }
    props.dispatch({
      type: "change_code_output_row",
      unique_id: data.console_id,
      row: data.counter,
      new_value: data.result_text
    });

    // _setConsoleItemValue(data.console_id, "output_dict", current)
  }
  function _setConsoleItemOutput(data) {
    var current = {};
    current[-1] = data.result_text;
    // if (current.length > MAX_OUTPUT_LENGTH) {
    //     current = current.slice(-1 * MAX_OUTPUT_LENGTH,)
    // }
    props.dispatch({
      type: "change_code_output",
      unique_id: data.console_id,
      new_value: current
    });
    //_setConsoleItemValue(data.console_id, "output_dict", current)
  }
  function _addToLog(new_line) {
    var log_content = console_error_log_text_ref.current;
    var log_list = log_content.split(/\r?\n/);
    var mlines = max_console_lines;
    if (log_list.length >= mlines) {
      log_list = log_list.slice(-1 * mlines + 1);
      log_content = log_list.join("\n");
    }
    set_console_error_log_text(log_content + new_line);
  }
  var renderContextMenu = (0, _react.useMemo)(function () {
    // return a single element, or nothing to use default browser behavior
    return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "new-text-box",
      onClick: _addBlankText,
      text: "New Text Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "code",
      onClick: _addBlankCode,
      text: "New Code Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "header",
      onClick: _addBlankDivider,
      text: "New Section"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "clipboard",
      onClick: function onClick() {
        _pasteCell();
      },
      text: "Paste Cells"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "reset",
      onClick: _resetConsole,
      intent: "warning",
      text: "Clear output and reset"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "trash",
      onClick: _clearConsole,
      intent: "danger",
      text: "Erase everything"
    }));
  }, []);
  function _glif_text(show_glif_text, txt) {
    if (show_glif_text) {
      return txt;
    }
    return null;
  }
  function _clickConsoleBody(e) {
    _clear_all_selected_items();
    e.stopPropagation();
  }
  function _handleSearchFieldChange(event) {
    if (search_helper_text) {
      set_search_helper_text(null);
      pushCallback(function () {
        _setSearchString(event.target.value);
      });
    } else {
      _setSearchString(event.target.value);
    }
  }
  function _are_selected() {
    return props.console_selected_items_ref.current.length > 0;
  }
  function _setSearchString(val) {
    var nval = val == "" ? null : val;
    var updates = {};
    set_search_string(nval);
    pushCallback(function () {
      if (_are_selected()) {
        var _iterator12 = _createForOfIteratorHelper(props.console_selected_items_ref.current),
          _step12;
        try {
          for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
            var uid = _step12.value;
            updates[uid] = {
              search_string: search_string_ref.current
            };
          }
        } catch (err) {
          _iterator12.e(err);
        } finally {
          _iterator12.f();
        }
        _multiple_console_item_updates(updates);
      }
    });
  }
  function _handleUnFilter() {
    set_filter_console_items(false);
    set_search_helper_text(null);
    pushCallback(function () {
      _setSearchString(null);
    });
  }
  function _handleFilter() {
    var updates = {};
    var _iterator13 = _createForOfIteratorHelper(props.console_items.current),
      _step13;
    try {
      for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
        var entry = _step13.value;
        if (entry.type == "code" || entry.type == "text") {
          updates[entry.unique_id] = {
            show_on_filtered: entry.console_text.toLowerCase().includes(search_string_ref.current.toLowerCase())
          };
        } else if (entry.type == "divider") {
          updates[entry.unique_id] = {
            show_on_filtered: true
          };
        }
      }
    } catch (err) {
      _iterator13.e(err);
    } finally {
      _iterator13.f();
    }
    _multiple_console_item_updates(updates, function () {
      set_filter_console_items(true);
    });
  }
  function _searchNext() {
    var current_index;
    if (!_are_selected()) {
      current_index = 0;
    } else {
      current_index = _consoleItemIndex(_currently_selected()) + 1;
    }
    var _loop2 = function _loop2() {
        var entry = props.console_items.current[current_index];
        if (entry.type == "code" || entry.type == "text") {
          if (_selectIfMatching(entry, "console_text", function () {
            if (entry.type == "text") {
              _setConsoleItemValue(entry.unique_id, "show_markdown", false);
            }
          })) {
            set_search_helper_text(null);
            return {
              v: void 0
            };
          }
        }
        current_index += 1;
      },
      _ret2;
    while (current_index < props.console_items.current.length) {
      _ret2 = _loop2();
      if (_ret2) return _ret2.v;
    }
    set_search_helper_text("No more results");
  }
  function _selectIfMatching(entry, text_field) {
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    if (entry[text_field].toLowerCase().includes(search_string_ref.current.toLowerCase())) {
      if (entry.am_shrunk) {
        _setConsoleItemValue(entry.unique_id, "am_shrunk", false, function () {
          _selectConsoleItem(entry.unique_id, null, callback);
        });
      } else {
        _selectConsoleItem(entry.unique_id, null, callback);
      }
      return true;
    }
    return false;
  }
  function _searchPrevious() {
    var current_index;
    if (!_are_selected()) {
      current_index = props.console_items.current.length - 1;
    } else {
      current_index = _consoleItemIndex(_currently_selected()) - 1;
    }
    var _loop3 = function _loop3() {
        var entry = props.console_items.current[current_index];
        if (entry.type == "code" || entry.type == "text") {
          if (_selectIfMatching(entry, "console_text", function () {
            if (entry.type == "text") {
              _setConsoleItemValue(entry.unique_id, "show_markdown", false);
            }
          })) {
            set_search_helper_text(null);
            return {
              v: void 0
            };
          }
        }
        current_index -= 1;
      },
      _ret3;
    while (current_index >= 0) {
      _ret3 = _loop3();
      if (_ret3) return _ret3.v;
    }
    set_search_helper_text("No more results");
  }
  function _handleSubmit(e) {
    _searchNext();
    e.preventDefault();
  }
  function _shouldCancelSortStart() {
    return filter_console_items;
  }
  var menu_specs = (0, _react.useMemo)(function () {
    var ms = {
      Insert: [{
        name_text: "Text Cell",
        icon_name: "new-text-box",
        click_handler: _addBlankText,
        key_bindings: ["Ctrl+T"]
      }, {
        name_text: "Code Cell",
        icon_name: "code",
        click_handler: _addBlankCode,
        key_bindings: ["Ctrl+C"]
      }, {
        name_text: "Section",
        icon_name: "header",
        click_handler: _addBlankDivider
      }, {
        name_text: "Resource Link",
        icon_name: "link",
        click_handler: _insertResourceLink
      }],
      Edit: [{
        name_text: "Copy All",
        icon_name: "duplicate",
        click_handler: function click_handler() {
          _copyAll();
        }
      }, {
        name_text: "Copy Selected",
        icon_name: "duplicate",
        click_handler: function click_handler() {
          _copyCell();
        }
      }, {
        name_text: "Paste Cells",
        icon_name: "clipboard",
        click_handler: function click_handler() {
          _pasteCell();
        }
      }, {
        name_text: "Paste Image",
        icon_name: "clipboard",
        click_handler: function () {
          var _click_handler = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10() {
            return _regeneratorRuntime().wrap(function _callee10$(_context11) {
              while (1) switch (_context11.prev = _context11.next) {
                case 0:
                  _context11.next = 2;
                  return _pasteImage();
                case 2:
                case "end":
                  return _context11.stop();
              }
            }, _callee10);
          }));
          function click_handler() {
            return _click_handler.apply(this, arguments);
          }
          return click_handler;
        }()
      }, {
        name_text: "Delete Selected",
        icon_name: "trash",
        click_handler: function () {
          var _click_handler2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11() {
            return _regeneratorRuntime().wrap(function _callee11$(_context12) {
              while (1) switch (_context12.prev = _context12.next) {
                case 0:
                  _context12.next = 2;
                  return _deleteSelected();
                case 2:
                case "end":
                  return _context12.stop();
              }
            }, _callee11);
          }));
          function click_handler() {
            return _click_handler2.apply(this, arguments);
          }
          return click_handler;
        }()
      }, {
        name_text: "divider2",
        icon_name: null,
        click_handler: "divider"
      }, {
        name_text: "Clear Log",
        icon_name: "trash",
        click_handler: _clearConsole
      }],
      Execute: [{
        name_text: "Run Selected",
        icon_name: "play",
        click_handler: _runSelected,
        key_bindings: ["Ctrl+Enter", "Command+Enter"]
      }, {
        name_text: "Stop All",
        icon_name: "stop",
        click_handler: _stopAll
      }, {
        name_text: "Reset All",
        icon_name: "reset",
        click_handler: _resetConsole
      }]
    };
    if (!(show_pseudo_log || show_main_log)) {
      ms["Consoles"] = [{
        name_text: "Show Log Console",
        icon_name: "console",
        click_handler: _togglePseudoLog
      }, {
        name_text: "Show Main Console",
        icon_name: "console",
        click_handler: _toggleMainLog
      }];
    } else {
      ms["Consoles"] = [{
        name_text: "Hide Console",
        icon_name: "console",
        click_handler: show_main_log ? _toggleMainLog : _togglePseudoLog
      }];
    }
    return ms;
  }, [show_main_log, show_pseudo_log]);
  function disabled_items() {
    var items = [];
    if (!_are_selected() || props.console_selected_items_ref.current.length != 1) {
      items.push("Run Selected");
      items.push("Copy Section");
      items.push("Delete Section");
    }
    if (props.console_selected_items_ref.current.length == 1) {
      var _unique_id = props.console_selected_items_ref.current[0];
      var entry = get_console_item_entry(_unique_id);
      if (!entry) {
        return [];
      }
      if (entry.type != "divider") {
        items.push("Copy Section");
        items.push("Delete Section");
      }
    }
    if (!_are_selected()) {
      items.push("Copy Selected");
      items.push("Delete Selected");
    }
    return items;
  }
  function _clearCodeOutput(unique_id) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    _setConsoleItemValue(unique_id, "output_dict", {}, callback);
  }
  function _runSelected() {
    if (window.in_context && !am_selected()) {
      return;
    }
    if (_are_selected() && props.console_selected_items_ref.current.length == 1) {
      var entry = get_console_item_entry(_currently_selected());
      if (entry.type == "code") {
        _runCodeItem(_currently_selected());
      } else if (entry.type == "text") {
        _showTextItemMarkdown(_currently_selected());
      }
    }
  }
  var _runCodeItem = (0, _react.useCallback)(function (unique_id) {
    var go_to_next = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    _clearCodeOutput(unique_id, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee12() {
      var entry;
      return _regeneratorRuntime().wrap(function _callee12$(_context13) {
        while (1) switch (_context13.prev = _context13.next) {
          case 0:
            _startSpinner(unique_id);
            entry = get_console_item_entry(unique_id);
            _context13.next = 4;
            return (0, _communication_react.postPromise)(props.main_id, "exec_console_code", {
              "the_code": entry.console_text,
              "console_id": unique_id
            }, props.main_id);
          case 4:
            if (go_to_next) {
              _goToNextCell(unique_id);
            }
          case 5:
          case "end":
            return _context13.stop();
        }
      }, _callee12);
    })));
  }, []);
  function _showTextItemMarkdown(unique_id) {
    _setConsoleItemValue(unique_id, "show_markdown", true);
  }
  function _hideNonDividers() {
    $(".in-section:not(.divider-log-panel)").css({
      opacity: "10%"
    });
  }
  function _showNonDividers() {
    $(".in-section:not(.divider-log-panel)").css({
      opacity: "100%"
    });
  }
  var _sortStart = (0, _react.useCallback)(function (_ref12) {
    var draggableId = _ref12.draggableId,
      mode = _ref12.mode;
    var idx = _consoleItemIndex(draggableId);
    var entry = props.console_items.current[idx];
    if (entry.type == "divider") {
      _hideNonDividers();
    }
  }, []);
  function superItemMaker(passDowns) {
    return /*#__PURE__*/(0, _react.memo)(function (item_props) {
      return /*#__PURE__*/_react["default"].createElement(SuperItem, _extends({}, item_props, passDowns));
    });
  }
  var TailoredSuperItem = (0, _react.useMemo)(function () {
    return superItemMaker({
      setConsoleItemValue: _setConsoleItemValue,
      selectConsoleItem: _selectConsoleItem,
      runCodeItem: _runCodeItem,
      handleDelete: _closeConsoleItem,
      goToNextCell: _goToNextCell,
      setFocus: _setFocusedItem,
      addNewTextItem: _addBlankText,
      addNewCodeItem: _addBlankCode,
      addNewDivider: _addBlankDivider,
      copyCell: _copyCell,
      pasteCell: _pasteCell,
      copySection: _copySection,
      deleteSection: _deleteSection,
      insertResourceLink: _insertResourceLink,
      pseudo_tile_id: pseudo_tile_id,
      handleCreateViewer: props.handleCreateViewer
    });
  }, []);
  var gbstyle = {
    marginLeft: 1,
    marginTop: 2
  };
  var console_class = props.mState.console_is_shrunk ? "am-shrunk" : "not-shrunk";
  if (props.mState.console_is_zoomed) {
    console_class = "am-zoomed";
  }
  var true_usable_width = props.mState.console_is_shrunk ? header_usable_width : usable_width;
  true_usable_width = true_usable_width > MAX_CONSOLE_WIDTH ? MAX_CONSOLE_WIDTH : true_usable_width;
  var outer_style = (0, _react.useMemo)(function () {
    var newStyle = {};
    if (props.style) {
      newStyle = Object.assign({}, props.style);
    }
    newStyle.width = true_usable_width;
    return newStyle;
  }, [true_usable_width]);
  var header_style = (0, _react.useMemo)(function () {
    var newStyle = {};
    if (!props.shrinkable) {
      newStyle["paddingLeft"] = 10;
    }
    return newStyle;
  }, []);
  var show_glif_text = outer_style.width > 800;
  var in_closed_section = false;
  var in_section = false;
  var filtered_items = props.console_items.current.filter(function (entry) {
    if (entry.type == "divider") {
      in_section = true;
      in_closed_section = entry.am_shrunk;
      return true;
    } else if (entry.type == "section-end") {
      entry.in_section = true;
      var was_in_closed_section = in_closed_section;
      in_closed_section = false;
      in_section = false;
      return !was_in_closed_section;
    } else if (!in_closed_section) {
      entry.in_section = in_section;
      return true;
    }
  });
  if (filter_console_items) {
    filtered_items = filtered_items.filter(function (entry) {
      return entry.show_on_filtered;
    });
  }
  filtered_items_ref.current = filtered_items;
  var suggestionGlyphs = [];
  if (show_pseudo_log || show_main_log) {
    suggestionGlyphs.push({
      intent: "primary",
      icon: "console",
      handleClick: show_main_log ? _toggleMainLog : _togglePseudoLog
    });
  }
  var extraProps = (0, _react.useMemo)(function () {
    return {
      main_id: props.main_id
    };
  });
  return /*#__PURE__*/_react["default"].createElement(_core.Card, {
    id: "console-panel",
    className: console_class,
    elevation: 2,
    style: outer_style,
    tabIndex: "0",
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-column justify-content-around"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    id: "console-heading",
    ref: header_ref,
    style: header_style,
    className: "d-flex flex-row justify-content-between"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    id: "console-header-left",
    className: "d-flex flex-row"
  }, props.mState.console_is_shrunk && props.shrinkable && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _expandConsole,
    style: GLYPH_BUTTON_STYLE,
    icon: "chevron-right"
  }), !props.mState.console_is_shrunk && props.shrinkable && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _shrinkConsole,
    style: GLYPH_BUTTON_STYLE,
    icon: "chevron-down"
  }), /*#__PURE__*/_react["default"].createElement(_assistant.AssistantContext.Provider, {
    value: null
  }, /*#__PURE__*/_react["default"].createElement(_menu_utilities.TacticMenubar, {
    menu_specs: menu_specs,
    disabled_items: disabled_items(),
    suggestionGlyphs: suggestionGlyphs,
    showRefresh: false,
    showClose: false,
    showIconBar: false,
    refreshTab: props.refreshTab,
    closeTab: null,
    controlled: window.in_context
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    id: "console-header-right",
    className: "d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    extra_glyph_text: _glif_text(show_glif_text, "exports"),
    tooltip: "Show export browser",
    small: true,
    className: "show-exports-but",
    style: GLYPH_BUTTON_STYLE2,
    handleClick: _toggleExports,
    icon: "variable"
  }), !props.mState.console_is_zoomed && props.zoomable && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _zoomConsole,
    icon: "maximize"
  }), props.mState.console_is_zoomed && props.zoomable && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _unzoomConsole,
    icon: "minimize"
  })))), !props.mState.console_is_shrunk && !show_pseudo_log && !show_main_log && /*#__PURE__*/_react["default"].createElement(_search_form.FilterSearchForm, {
    search_string: search_string_ref.current,
    handleSearchFieldChange: _handleSearchFieldChange,
    handleFilter: _handleFilter,
    handleUnFilter: _handleUnFilter,
    searchNext: _searchNext,
    searchPrevious: _searchPrevious,
    search_helper_text: search_helper_text
  }), !props.mState.console_is_shrunk && show_main_log && /*#__PURE__*/_react["default"].createElement(_searchable_console.SearchableConsole, {
    main_id: props.main_id,
    streaming_host: "host",
    container_id: props.main_id,
    ref: body_ref,
    outer_style: {
      overflowX: "auto",
      overflowY: "auto",
      height: usable_height,
      marginLeft: 20,
      marginRight: 20
    },
    showCommandField: false
  }), !props.mState.console_is_shrunk && show_pseudo_log && /*#__PURE__*/_react["default"].createElement(_searchable_console.SearchableConsole, {
    main_id: props.main_id,
    streaming_host: "host",
    container_id: pseudo_tile_id,
    ref: body_ref,
    outer_style: {
      overflowX: "auto",
      overflowY: "auto",
      height: usable_height,
      marginLeft: 20,
      marginRight: 20
    },
    showCommandField: true
  }), !props.mState.console_is_shrunk && !show_pseudo_log && !show_main_log && /*#__PURE__*/_react["default"].createElement("div", {
    id: "console",
    ref: body_ref,
    className: "contingent-scroll",
    onClick: _clickConsoleBody,
    style: {
      height: usable_height
    }
  }, /*#__PURE__*/_react["default"].createElement(_sizing_tools.SizeProvider, {
    value: {
      availableWidth: true_usable_width,
      availableHeight: usable_height,
      topX: topX,
      topY: topY
    }
  }, /*#__PURE__*/_react["default"].createElement(_sortable_container.SortableComponent, {
    className: "console-items-div",
    direction: "vertical",
    style: empty_style,
    main_id: props.main_id,
    ElementComponent: TailoredSuperItem,
    key_field_name: "unique_id",
    item_list: filtered_items,
    helperClass: settingsContext.isDark() ? "bp5-dark" : "light-theme",
    handle: ".console-sorter",
    onBeforeCapture: _sortStart,
    onDragEnd: _resortConsoleItems,
    useDragHandle: false,
    axis: "y",
    tsocket: props.tsocket,
    extraProps: extraProps
  })), /*#__PURE__*/_react["default"].createElement("div", {
    id: "padding-div",
    style: {
      height: 500
    }
  })));
}
exports.ConsoleComponent = ConsoleComponent = /*#__PURE__*/(0, _react.memo)(ConsoleComponent);
var sHandleStyle = {
  marginLeft: 0,
  marginRight: 6
};
function Shandle(props) {
  return /*#__PURE__*/_react["default"].createElement("span", props.dragHandleProps, /*#__PURE__*/_react["default"].createElement(_core.Icon, _extends({
    icon: "drag-handle-vertical"
  }, props.dragHandleProps, {
    style: sHandleStyle,
    size: 20,
    className: "console-sorter"
  })));
}
function SuperItem(props) {
  switch (props.type) {
    case "text":
      return /*#__PURE__*/_react["default"].createElement(ConsoleTextItem, props);
    case "code":
      return /*#__PURE__*/_react["default"].createElement(ConsoleCodeItem, props);
    case "fixed":
      return /*#__PURE__*/_react["default"].createElement(LogItem, props);
    case "figure":
      return /*#__PURE__*/_react["default"].createElement(BlobItem, props);
    case "divider":
      return /*#__PURE__*/_react["default"].createElement(DividerItem, props);
    case "section-end":
      return /*#__PURE__*/_react["default"].createElement(SectionEndItem, props);
    default:
      return null;
  }
}
SuperItem = /*#__PURE__*/(0, _react.memo)(SuperItem);
var divider_item_update_props = ["am_shrunk", "am_selected", "header_text", "console_available_width"];
function DividerItem(props) {
  var _toggleShrink = (0, _react.useCallback)(function () {
    props.setConsoleItemValue(props.unique_id, "am_shrunk", !props.am_shrunk);
  }, [props.am_shrunk]);
  var _deleteMe = (0, _react.useCallback)(function () {
    props.handleDelete(props.unique_id);
  }, []);
  var _handleHeaderTextChange = (0, _react.useCallback)(function (value) {
    props.setConsoleItemValue(props.unique_id, "header_text", value);
  }, []);
  function _copyMe() {
    props.copyCell(props.unique_id);
  }
  function _copySection() {
    props.copySection(props.unique_id);
  }
  function _deleteSection() {
    props.deleteSection(props.unique_id);
  }
  function _pasteCell() {
    props.pasteCell(props.unique_id);
  }
  function _selectMe() {
    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    props.selectConsoleItem(props.unique_id, e, callback);
  }
  function _addBlankText() {
    _selectMe(null, function () {
      props.addNewTextItem();
    });
  }
  function _addBlankDivider() {
    var self = this;
    _selectMe(null, function () {
      props.addNewDividerItem();
    });
  }
  function _addBlankCode() {
    _selectMe(null, function () {
      props.addNewCodeItem();
    });
  }
  var contextMenu = (0, _react.useMemo)(function () {
    // return a single element, or nothing to use default browser behavior
    return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "duplicate",
      onClick: _copyMe,
      text: "Copy"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "clipboard",
      onClick: _pasteCell,
      text: "Paste Cells"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "new-text-box",
      onClick: _addBlankText,
      text: "New Text Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "code",
      onClick: _addBlankCode,
      text: "New Code Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "header",
      onClick: _addBlankDivider,
      text: "New Section"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "trash",
      onClick: _deleteMe,
      intent: "danger",
      text: "Delete Section"
    }));
  }, []);
  function _consoleItemClick(e) {
    _selectMe(e);
    e.stopPropagation();
  }
  var converted_dict = {
    __html: props.console_text
  };
  var panel_class = props.am_shrunk ? "log-panel in-section divider-log-panel log-panel-invisible fixed-log-panel" : "log-panel divider-log-panel log-panel-visible fixed-log-panel";
  if (props.am_selected) {
    panel_class += " selected";
  }
  if (props.is_error) {
    panel_class += " error-log-panel";
  }
  return /*#__PURE__*/_react["default"].createElement(_core.ContextMenu, {
    content: contextMenu
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: panel_class + " d-flex flex-row",
    onClick: _consoleItemClick,
    id: props.unique_id,
    style: {
      marginBottom: 10
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div shrink-expand-div d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(Shandle, {
    dragHandleProps: props.dragHandleProps
  }), !props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    icon: "chevron-down",
    handleClick: _toggleShrink
  }), props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    icon: "chevron-right",
    style: GLYPH_BUTTON_STYLE5,
    handleClick: _toggleShrink
  })), /*#__PURE__*/_react["default"].createElement(_core.EditableText, {
    value: props.header_text,
    onChange: _handleHeaderTextChange,
    className: "console-divider-text"
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _deleteMe,
    intent: "danger",
    tooltip: "Delete this item",
    style: GLYPH_BUTTON_STYLE3,
    icon: "trash"
  }))));
}
DividerItem = /*#__PURE__*/(0, _react.memo)(DividerItem);
var section_end_item_update_props = ["am_selected", "console_available_width"];
function SectionEndItem(props) {
  function _pasteCell() {
    props.pasteCell(props.unique_id);
  }
  function _selectMe() {
    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    props.selectConsoleItem(props.unique_id, e, callback);
  }
  function _addBlankText() {
    _selectMe(null, function () {
      props.addNewTextItem();
    });
  }
  function _addBlankDivider() {
    _selectMe(null, function () {
      props.addNewDividerItem();
    });
  }
  function _addBlankCode() {
    _selectMe(null, function () {
      props.addNewCodeItem();
    });
  }
  var contextMenu = (0, _react.useMemo)(function () {
    // return a single element, or nothing to use default browser behavior
    return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "clipboard",
      onClick: _pasteCell,
      text: "Paste Cells"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "new-text-box",
      onClick: _addBlankText,
      text: "New Text Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "code",
      onClick: _addBlankCode,
      text: "New Code Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "header",
      onClick: _addBlankDivider,
      text: "New Section"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null));
  }, []);
  var _consoleItemClick = (0, _react.useCallback)(function (e) {
    _selectMe(e);
    e.stopPropagation();
  }, []);
  var panel_class = "log-panel in-section section-end-log-panel log-panel-visible fixed-log-panel";
  if (props.am_selected) {
    panel_class += " selected";
  }
  var line_style = {
    marginLeft: 65,
    marginRight: 85,
    marginTop: 10,
    borderBottomWidth: 2
  };
  return /*#__PURE__*/_react["default"].createElement(_core.ContextMenu, {
    content: contextMenu
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: panel_class + " d-flex flex-row",
    onClick: _consoleItemClick,
    id: props.unique_id,
    style: {
      marginBottom: 10
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, {
    minimal: true,
    vertical: true,
    style: {
      width: "100%"
    }
  }, /*#__PURE__*/_react["default"].createElement("span", props.dragHandleProps), /*#__PURE__*/_react["default"].createElement(_core.Divider, {
    style: line_style
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div d-flex flex-row"
  })));
}
SectionEndItem = /*#__PURE__*/(0, _react.memo)(SectionEndItem);
var log_item_update_props = ["is_error", "am_shrunk", "am_selected", "in_section", "summary_text", "console_text", "console_available_width"];
function LogItem(props) {
  var last_output_text = (0, _react.useRef)("");
  var body_ref = (0, _react.useRef)(null);
  var _useSize5 = (0, _sizing_tools.useSize)(body_ref, 0, "LogItem"),
    _useSize6 = _slicedToArray(_useSize5, 4),
    usable_width = _useSize6[0],
    usable_height = _useSize6[1],
    topX = _useSize6[2],
    topY = _useSize6[3];
  (0, _react.useEffect)(function () {
    executeEmbeddedScripts();
    // makeTablesSortable()
  });
  var _toggleShrink = (0, _react.useCallback)(function () {
    props.setConsoleItemValue(props.unique_id, "am_shrunk", !props.am_shrunk);
  }, [props.am_shrunk]);
  var _deleteMe = (0, _react.useCallback)(function () {
    props.handleDelete(props.unique_id);
  }, []);
  var _handleSummaryTextChange = (0, _react.useCallback)(function (value) {
    props.setConsoleItemValue(props.unique_id, "summary_text", value);
  }, []);
  function executeEmbeddedScripts() {
    if (props.output_text != last_output_text.current) {
      // to avoid doubles of bokeh images
      last_output_text.current = props.output_text;
      var scripts = $("#" + props.unique_id + " .log-code-output script").toArray();
      var _iterator15 = _createForOfIteratorHelper(scripts),
        _step15;
      try {
        for (_iterator15.s(); !(_step15 = _iterator15.n()).done;) {
          var script = _step15.value;
          try {
            window.eval(script.text);
          } catch (e) {}
        }
      } catch (err) {
        _iterator15.e(err);
      } finally {
        _iterator15.f();
      }
    }
  }

  // function makeTablesSortable() {
  //     let tables = $("#" + props.unique_id + " table.sortable").toArray();
  //     for (let table of tables) {
  //         sorttable.makeSortable(table)
  //     }
  // }

  function _copyMe() {
    props.copyCell(props.unique_id);
  }
  function _pasteCell() {
    props.pasteCell(props.unique_id);
  }
  function _selectMe() {
    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    props.selectConsoleItem(props.unique_id, e, callback);
  }
  function _addBlankText() {
    _selectMe(null, function () {
      props.addNewTextItem();
    });
  }
  function _addBlankDivider() {
    _selectMe(null, function () {
      props.addNewDividerItem();
    });
  }
  function _addBlankCode() {
    _selectMe(null, function () {
      props.addNewCodeItem();
    });
  }
  function renderContextMenu() {
    // return a single element, or nothing to use default browser behavior
    return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "duplicate",
      onClick: _copyMe,
      text: "Copy Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "clipboard",
      onClick: _pasteCell,
      text: "Paste Cells"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "new-text-box",
      onClick: _addBlankText,
      text: "New Text Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "code",
      onClick: _addBlankCode,
      text: "New Code Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "header",
      onClick: _addBlankDivider,
      text: "New Section"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "trash",
      onClick: _deleteMe,
      intent: "danger",
      text: "Delete Cell"
    }));
  }
  function _consoleItemClick(e) {
    _selectMe(e);
    e.stopPropagation();
  }
  var panel_class = props.am_shrunk ? "log-panel log-panel-invisible fixed-log-panel" : "log-panel log-panel-visible fixed-log-panel";
  var converted_dict = {
    __html: props.console_text
  };
  if (props.in_section) {
    panel_class += " in-section";
  }
  if (props.am_selected) {
    panel_class += " selected";
  }
  if (props.is_error) {
    panel_class += " error-log-panel";
  }
  var uwidth = props.in_section ? usable_width - SECTION_INDENT / 2 : usable_width;
  uwidth -= BUTTON_CONSUMED_SPACE;
  var body_style = (0, _react.useMemo)(function () {
    return {
      marginTop: 10,
      marginLeft: 30,
      padding: 8,
      width: uwidth,
      border: ".5px solid #c7c7c7",
      overflowY: "scroll"
    };
  }, [uwidth]);
  var body_shrunk_style = (0, _react.useMemo)(function () {
    return {
      marginLeft: 30,
      width: uwidth
    };
  }, [uwidth]);
  return /*#__PURE__*/_react["default"].createElement(_core.ContextMenu, {
    content: renderContextMenu()
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: panel_class + " d-flex flex-row",
    onClick: _consoleItemClick,
    id: props.unique_id,
    style: MB10_STYLE
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div shrink-expand-div d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(Shandle, {
    dragHandleProps: props.dragHandleProps
  }), !props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    icon: "chevron-down",
    handleClick: _toggleShrink
  }), props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    icon: "chevron-right",
    style: GLYPH_BUTTON_STYLE5,
    handleClick: _toggleShrink
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-column"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "log-panel-body d-flex flex-row"
  }, props.am_shrunk && /*#__PURE__*/_react["default"].createElement("div", {
    ref: body_ref,
    style: body_shrunk_style
  }, /*#__PURE__*/_react["default"].createElement(_core.EditableText, {
    value: props.summary_text,
    onChange: _handleSummaryTextChange,
    className: "log-panel-summary"
  })), !props.am_shrunk && /*#__PURE__*/_react["default"].createElement("div", {
    ref: body_ref,
    style: body_style,
    dangerouslySetInnerHTML: converted_dict
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _deleteMe,
    tooltip: "Delete this item",
    style: GlYPH_BUTTON_STYLE4,
    icon: "trash"
  }))))));
}
LogItem = /*#__PURE__*/(0, _react.memo)(LogItem);
var blob_item_update_props = ["is_error", "am_shrunk", "am_selected", "in_section", "summary_text", "image_data_str", "console_available_width"];
function BlobItem(props) {
  var last_output_text = (0, _react.useRef)("");
  var body_ref = (0, _react.useRef)(null);
  var _useSize7 = (0, _sizing_tools.useSize)(body_ref, 0, "BlobItem"),
    _useSize8 = _slicedToArray(_useSize7, 4),
    usable_width = _useSize8[0],
    usable_height = _useSize8[1],
    topX = _useSize8[2],
    topY = _useSize8[3];
  (0, _react.useEffect)(function () {
    executeEmbeddedScripts();
    // makeTablesSortable()
  });
  var _toggleShrink = (0, _react.useCallback)(function () {
    props.setConsoleItemValue(props.unique_id, "am_shrunk", !props.am_shrunk);
  }, [props.am_shrunk]);
  var _deleteMe = (0, _react.useCallback)(function () {
    props.handleDelete(props.unique_id);
  }, []);
  var _handleSummaryTextChange = (0, _react.useCallback)(function (value) {
    props.setConsoleItemValue(props.unique_id, "summary_text", value);
  }, []);
  function executeEmbeddedScripts() {
    if (props.output_text != last_output_text.current) {
      // to avoid doubles of bokeh images
      last_output_text.current = props.output_text;
      var scripts = $("#" + props.unique_id + " .log-code-output script").toArray();
      var _iterator16 = _createForOfIteratorHelper(scripts),
        _step16;
      try {
        for (_iterator16.s(); !(_step16 = _iterator16.n()).done;) {
          var script = _step16.value;
          try {
            window.eval(script.text);
          } catch (e) {}
        }
      } catch (err) {
        _iterator16.e(err);
      } finally {
        _iterator16.f();
      }
    }
  }

  // function makeTablesSortable() {
  //     let tables = $("#" + props.unique_id + " table.sortable").toArray();
  //     for (let table of tables) {
  //         sorttable.makeSortable(table)
  //     }
  // }

  function _copyMe() {
    props.copyCell(props.unique_id);
  }
  function _pasteCell() {
    props.pasteCell(props.unique_id);
  }
  function _selectMe() {
    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    props.selectConsoleItem(props.unique_id, e, callback);
  }
  function _addBlankText() {
    _selectMe(null, function () {
      props.addNewTextItem();
    });
  }
  function _addBlankDivider() {
    _selectMe(null, function () {
      props.addNewDividerItem();
    });
  }
  function _addBlankCode() {
    var self = this;
    _selectMe(null, function () {
      props.addNewCodeItem();
    });
  }
  function renderContextMenu() {
    // return a single element, or nothing to use default browser behavior
    return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "duplicate",
      onClick: _copyMe,
      text: "Copy Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "clipboard",
      onClick: _pasteCell,
      text: "Paste Cells"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "new-text-box",
      onClick: _addBlankText,
      text: "New Text Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "code",
      onClick: _addBlankCode,
      text: "New Code Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "header",
      onClick: _addBlankDivider,
      text: "New Section"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "trash",
      onClick: _deleteMe,
      intent: "danger",
      text: "Delete Cell"
    }));
  }
  function _consoleItemClick(e) {
    _selectMe(e);
    e.stopPropagation();
  }
  var panel_class = props.am_shrunk ? "log-panel log-panel-invisible fixed-log-panel" : "log-panel log-panel-visible fixed-log-panel";
  if (props.in_section) {
    panel_class += " in-section";
  }
  if (props.am_selected) {
    panel_class += " selected";
  }
  var uwidth = props.in_section ? usable_width - SECTION_INDENT / 2 : usable_width;
  uwidth -= BUTTON_CONSUMED_SPACE;
  var body_style = (0, _react.useMemo)(function () {
    return {
      marginTop: 10,
      marginLeft: 30,
      padding: 8,
      width: uwidth,
      border: ".5px solid #c7c7c7",
      overflowY: "scroll"
    };
  }, [uwidth]);
  var body_shrunk_style = (0, _react.useMemo)(function () {
    return {
      marginLeft: 30,
      width: uwidth
    };
  }, [uwidth]);
  return /*#__PURE__*/_react["default"].createElement(_core.ContextMenu, {
    content: renderContextMenu()
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: panel_class + " d-flex flex-row",
    onClick: _consoleItemClick,
    id: props.unique_id,
    style: MB10_STYLE
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div shrink-expand-div d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(Shandle, {
    dragHandleProps: props.dragHandleProps
  }), !props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    icon: "chevron-down",
    handleClick: _toggleShrink
  }), props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    icon: "chevron-right",
    style: GLYPH_BUTTON_STYLE5,
    handleClick: _toggleShrink
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-column"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "log-panel-body d-flex flex-row"
  }, props.am_shrunk && /*#__PURE__*/_react["default"].createElement("div", {
    ref: body_ref,
    style: body_shrunk_style
  }, /*#__PURE__*/_react["default"].createElement(_core.EditableText, {
    value: props.summary_text,
    onChange: _handleSummaryTextChange,
    className: "log-panel-summary"
  })), !props.am_shrunk && /*#__PURE__*/_react["default"].createElement("div", {
    ref: body_ref,
    style: body_style
  }, props.image_data_str && /*#__PURE__*/_react["default"].createElement("img", {
    src: props.image_data_str,
    alt: "An Image",
    width: uwidth - 25
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _deleteMe,
    tooltip: "Delete this item",
    style: GlYPH_BUTTON_STYLE4,
    intent: "danger",
    icon: "trash"
  }))))));
}
BlobItem = /*#__PURE__*/(0, _react.memo)(BlobItem);
var code_item_update_props = ["am_shrunk", "set_focus", "am_selected", "search_string", "summary_text", "console_text", "in_section", "show_spinner", "execution_count", "output_dict", "console_available_width", "dark_theme"];
function ConsoleCodeItem(props) {
  props = _objectSpread({
    summary_text: null
  }, props);
  var elRef = (0, _react.useRef)(null);
  var am_selected_previous = (0, _react.useRef)(false);
  var setFocusFunc = (0, _react.useRef)(null);
  var _useSize9 = (0, _sizing_tools.useSize)(elRef, 0, "ConsoleCodeItem"),
    _useSize10 = _slicedToArray(_useSize9, 4),
    usable_width = _useSize10[0],
    usable_height = _useSize10[1],
    topX = _useSize10[2],
    topY = _useSize10[3];
  (0, _react.useEffect)(function () {
    if (props.am_selected && !am_selected_previous.current && elRef && elRef.current) {
      scrollMeIntoView();
    }
    am_selected_previous.current = props.am_selected;
    if (props.set_focus && setFocusFunc.current) {
      setFocusFunc.current();
      props.setConsoleItemValue(props.unique_id, "set_focus", false, _selectMe);
    }
  });
  (0, _react.useLayoutEffect)(function () {
    return function () {
      if (elRef.current) {
        var tables = elRef.current.querySelectorAll('table.sortable');
        tables.forEach(function (table) {
          var parent = table.parentElement;
          if (parent) {
            parent.innerHTML = '';
          }
        });
      }
    };
  }, []);
  var registerSetFocusFunc = (0, _react.useCallback)(function (theFunc) {
    setFocusFunc.current = theFunc;
  }, []);
  function scrollMeIntoView() {
    var my_element = elRef.current;
    var outer_element = my_element.parentNode.parentNode;
    var scrolled_element = my_element.parentNode;
    var outer_height = outer_element.offsetHeight;
    var distance_from_top = my_element.offsetTop - outer_element.scrollTop - scrolled_element.offsetTop;
    if (distance_from_top > outer_height - 35) {
      var distance_to_move = distance_from_top - .5 * outer_height;
      outer_element.scrollTop += distance_to_move;
    } else if (distance_from_top < 0) {
      var _distance_to_move = .25 * outer_height - distance_from_top;
      outer_element.scrollTop -= _distance_to_move;
    }
  }
  function executeEmbeddedScripts() {
    var scripts = $("#" + props.unique_id + " .log-code-output script").toArray();
    var _iterator17 = _createForOfIteratorHelper(scripts),
      _step17;
    try {
      for (_iterator17.s(); !(_step17 = _iterator17.n()).done;) {
        var script = _step17.value;
        // noinspection EmptyCatchBlockJS,UnusedCatchParameterJS
        try {
          window.eval(script.text);
        } catch (e) {}
      }
    } catch (err) {
      _iterator17.e(err);
    } finally {
      _iterator17.f();
    }
  }

  // function makeTablesSortable() {
  //     let tables = $("#" + props.unique_id + " table.sortable").toArray();
  //     for (let table of tables) {
  //         sorttable.makeSortable(table)
  //     }
  // }

  var _stopMe = (0, _react.useCallback)(function () {
    _stopMySpinner();
    (0, _communication_react.postWithCallback)(props.main_id, "stop_console_code", {
      "console_id": props.unique_id
    }, null, null, props.main_id);
  }, []);
  function _showMySpinner() {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    props.setConsoleItemValue(props.unique_id, "show_spinner", true, callback);
  }
  function _stopMySpinner() {
    props.setConsoleItemValue(props.unique_id, "show_spinner", false);
  }
  var _handleChange = (0, _react.useCallback)(function (new_code) {
    props.setConsoleItemValue(props.unique_id, "console_text", new_code);
  }, []);
  var _handleSummaryTextChange = (0, _react.useCallback)(function (value) {
    props.setConsoleItemValue(props.unique_id, "summary_text", value);
  });
  var _toggleShrink = (0, _react.useCallback)(function () {
    props.setConsoleItemValue(props.unique_id, "am_shrunk", !props.am_shrunk);
  }, [props.am_shrunk]);
  var _deleteMe = (0, _react.useCallback)(function () {
    if (props.show_spinner) {
      _stopMe();
    }
    props.handleDelete(props.unique_id);
  }, [props.show_spinner]);
  var _clearOutput = (0, _react.useCallback)(function () {
    props.setConsoleItemValue(props.unique_id, "output_dict", {});
  }, []);
  var _extraKeys = (0, _react.useMemo)(function () {
    return [{
      key: 'Ctrl-Enter',
      run: function run() {
        return props.runCodeItem(props.unique_id, true);
      }
    }, {
      key: 'Cmd-Enter',
      run: function run() {
        return props.runCodeItem(props.unique_id, true);
      }
    }, {
      key: 'Ctrl-c',
      run: props.addNewCodeItem
    }, {
      key: 'Ctrl-t',
      run: props.addNewTextItem
    }];
  }, []);
  var _getFirstLine = (0, _react.useCallback)(function () {
    var re = /^(.*)$/m;
    if (props.console_text == "") {
      return "empty text cell";
    } else {
      return re.exec(props.console_text)[0];
    }
  }, [props.console_text]);
  var _copyMe = (0, _react.useCallback)(function () {
    props.copyCell(props.unique_id);
  }, []);
  var _pasteCell = (0, _react.useCallback)(function () {
    props.pasteCell(props.unique_id);
  }, []);
  function _selectMe() {
    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    props.selectConsoleItem(props.unique_id, e, callback);
  }
  var _addBlankText = (0, _react.useCallback)(function () {
    _selectMe(null, function () {
      props.addNewTextItem();
    });
  }, []);
  var _addBlankDivider = (0, _react.useCallback)(function () {
    _selectMe(null, function () {
      props.addNewDividerItem();
    });
  }, []);
  var _addBlankCode = (0, _react.useCallback)(function () {
    _selectMe(null, function () {
      props.addNewCodeItem();
    });
  }, []);
  var _codeRunner = (0, _react.useCallback)(function () {
    props.runCodeItem(props.unique_id);
  }, []);
  var cm = (0, _react.useMemo)(function () {
    // return a single element, or nothing to use default browser behavior
    return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, !props.show_spinner && /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "play",
      intent: "success",
      onClick: _codeRunner,
      text: "Run Cell"
    }), props.show_spinner && /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "stop",
      intent: "danger",
      onClick: _stopMe,
      text: "Stop Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "new-text-box",
      onClick: _addBlankText,
      text: "New Text Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "code",
      onClick: _addBlankCode,
      text: "New Code Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "header",
      onClick: _addBlankDivider,
      text: "New Section"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "duplicate",
      onClick: _copyMe,
      text: "Copy Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "clipboard",
      onClick: _pasteCell,
      text: "Paste Cells"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "trash",
      onClick: _deleteMe,
      intent: "danger",
      text: "Delete Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "clean",
      intent: "warning",
      onClick: _clearOutput,
      text: "Clear Output"
    }));
  }, []);
  var _consoleItemClick = (0, _react.useCallback)(function (e) {
    _selectMe(e);
    e.stopPropagation();
  });
  var _handleFocus = (0, _react.useCallback)(function () {
    if (!props.am_selected) {
      _selectMe();
    }
  }, []);
  var panel_style = props.am_shrunk ? "log-panel log-panel-invisible" : "log-panel log-panel-visible";
  if (props.am_selected) {
    panel_style += " selected";
  }
  if (props.in_section) {
    panel_style += " in-section";
  }
  var output_dict = {
    __html: props.output_text
  };
  var spinner_val = props.running ? null : 0;
  var uwidth = props.in_section ? usable_width - SECTION_INDENT / 2 : usable_width;
  uwidth -= BUTTON_CONSUMED_SPACE;
  var body_shrunk_style = (0, _react.useMemo)(function () {
    return {
      marginLeft: 30,
      width: uwidth - 80
    };
  }, [uwidth]);
  return /*#__PURE__*/_react["default"].createElement(_core.ContextMenu, {
    content: cm
  }, /*#__PURE__*/_react["default"].createElement(_sizing_tools.SizeProvider, {
    value: {
      availableWidth: uwidth,
      availableHeight: usable_height,
      topX: topX,
      topY: topY
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: panel_style + " d-flex flex-row",
    ref: elRef,
    onClick: _consoleItemClick,
    id: props.unique_id
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div shrink-expand-div d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(Shandle, {
    dragHandleProps: props.dragHandleProps
  }), !props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    icon: "chevron-down",
    handleClick: _toggleShrink
  }), props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    icon: "chevron-right",
    style: GLYPH_BUTTON_STYLE5,
    handleClick: _toggleShrink
  })), props.am_shrunk && /*#__PURE__*/_react["default"].createElement("div", {
    style: body_shrunk_style,
    className: "d-flex flex-row console-code"
  }, /*#__PURE__*/_react["default"].createElement(_core.EditableText, {
    value: props.summary_text ? props.summary_text : _getFirstLine(),
    onChange: _handleSummaryTextChange,
    className: "log-panel-summary code-panel-summary"
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div float-buttons d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _deleteMe,
    tooltip: "Delete this item",
    style: empty_style,
    icon: trash_icon
  }))), !props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-column",
    style: WIDTH_100
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "log-panel-body d-flex flex-row console-code"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div d-flex pr-1"
  }, !props.show_spinner && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _codeRunner,
    intent: "success",
    tooltip: "Execute this item",
    icon: "play"
  }), props.show_spinner && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _stopMe,
    intent: "danger",
    tooltip: "Stop this item",
    icon: "stop"
  })), /*#__PURE__*/_react["default"].createElement(_reactCodemirror.ReactCodemirror6, {
    handleChange: _handleChange,
    handleFocus: _handleFocus,
    registerSetFocusFunc: registerSetFocusFunc,
    readOnly: false,
    show_line_numbers: true,
    code_content: props.console_text,
    extraKeys: _extraKeys,
    search_term: props.search_string,
    no_height: true,
    tsocket: props.tsocket,
    container_id: props.main_id,
    saveMe: null
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div float-buttons d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _deleteMe,
    tooltip: "Delete this item",
    style: empty_style,
    icon: trash_icon
  }), /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _clearOutput,
    tooltip: "Clear this item's output",
    style: empty_style,
    icon: clean_icon
  }))), !props.show_spinner && /*#__PURE__*/_react["default"].createElement("div", {
    className: "execution-counter"
  }, "[", String(props.execution_count), "]"), props.show_spinner && /*#__PURE__*/_react["default"].createElement("div", {
    style: SPINNER_STYLE
  }, /*#__PURE__*/_react["default"].createElement(_core.Spinner, {
    size: 13,
    value: spinner_val
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "log-code-output",
    dangerouslySetInnerHTML: output_dict
  }))))));
}
ConsoleCodeItem = /*#__PURE__*/(0, _react.memo)(ConsoleCodeItem);
function ResourceLinkButton(props) {
  var my_view = (0, _react.useRef)(null);
  (0, _utilities_react.useConstructor)(function () {
    my_view.current = (0, _library_pane.view_views)(false)[props.res_type];
    if (window.in_context) {
      var re = new RegExp("/$");
      my_view.current = my_view.current.replace(re, "_in_context");
    }
  });
  function _goToLink() {
    return _goToLink2.apply(this, arguments);
  }
  function _goToLink2() {
    _goToLink2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee20() {
      var data;
      return _regeneratorRuntime().wrap(function _callee20$(_context21) {
        while (1) switch (_context21.prev = _context21.next) {
          case 0:
            if (!window.in_context) {
              _context21.next = 13;
              break;
            }
            _context21.prev = 1;
            _context21.next = 4;
            return (0, _communication_react.postAjaxPromise)(my_view.current, {
              context_id: window.context_id,
              resource_name: props.res_name
            });
          case 4:
            data = _context21.sent;
            props.handleCreateViewer(data);
            _context21.next = 11;
            break;
          case 8:
            _context21.prev = 8;
            _context21.t0 = _context21["catch"](1);
            errorDrawerFuncs.addFromError("Error following link", _context21.t0);
          case 11:
            _context21.next = 14;
            break;
          case 13:
            window.open($SCRIPT_ROOT + my_view.current + props.res_name);
          case 14:
          case "end":
            return _context21.stop();
        }
      }, _callee20, null, [[1, 8]]);
    }));
    return _goToLink2.apply(this, arguments);
  }
  return /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, {
    className: "link-button-group"
  }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
    small: true,
    text: props.res_name,
    icon: _blueprint_mdata_fields.icon_dict[props.res_type],
    minimal: true,
    onClick: _goToLink
  }), /*#__PURE__*/_react["default"].createElement(_core.Button, {
    small: true,
    icon: "small-cross",
    minimal: true,
    onClick: function onClick(e) {
      props.deleteMe(props.my_index);
      e.stopPropagation();
    }
  }));
}
ResourceLinkButton = /*#__PURE__*/(0, _react.memo)(ResourceLinkButton);
var text_item_update_props = ["am_shrunk", "set_focus", "serach_string", "am_selected", "show_markdown", "in_section", "summary_text", "console_text", "console_available_width", "links"];
function ConsoleTextItem(props) {
  props = _objectSpread({
    summary_text: null,
    links: []
  }, props);
  var elRef = (0, _react.useRef)(null);
  var am_selected_previous = (0, _react.useRef)(false);
  var setFocusFunc = (0, _react.useRef)(null);
  var _useSize11 = (0, _sizing_tools.useSize)(elRef, 0, "ConsoleTextItem"),
    _useSize12 = _slicedToArray(_useSize11, 4),
    usable_width = _useSize12[0],
    usable_height = _useSize12[1],
    topX = _useSize12[2],
    topY = _useSize12[3];
  (0, _react.useEffect)(function () {
    if (props.am_selected && !am_selected_previous.current && elRef && elRef.current) {
      scrollMeIntoView();
    }
    am_selected_previous.current = props.am_selected;
    if (props.set_focus) {
      if (props.show_markdown) {
        _hideMarkdown();
      } else if (setFocusFunc.current) {
        setFocusFunc.current();
        props.setConsoleItemValue(props.unique_id, "set_focus", false, _selectMe);
      }
    }
  });
  var registerSetFocusFunc = (0, _react.useCallback)(function (theFunc) {
    setFocusFunc.current = theFunc;
  }, []);
  function scrollMeIntoView() {
    var my_element = elRef.current;
    var outer_element = my_element.parentNode.parentNode;
    var scrolled_element = my_element.parentNode;
    var outer_height = outer_element.offsetHeight;
    var distance_from_top = my_element.offsetTop - outer_element.scrollTop - scrolled_element.offsetTop;
    if (distance_from_top > outer_height - 35) {
      var distance_to_move = distance_from_top - .5 * outer_height;
      outer_element.scrollTop += distance_to_move;
    } else if (distance_from_top < 0) {
      var _distance_to_move2 = .25 * outer_height - distance_from_top;
      outer_element.scrollTop -= _distance_to_move2;
    }
  }
  function hasOnlyWhitespace() {
    return !props.console_text.trim().length;
  }
  function _showMarkdown() {
    props.setConsoleItemValue(props.unique_id, "show_markdown", true);
  }
  var _toggleMarkdown = (0, _react.useCallback)(function () {
    if (props.show_markdown) {
      _hideMarkdown();
    } else {
      _showMarkdown();
    }
  }, [props.show_markdown]);
  var _hideMarkdown = (0, _react.useCallback)(function () {
    props.setConsoleItemValue(props.unique_id, "show_markdown", false);
  }, []);
  var _handleChange = (0, _react.useCallback)(function (new_text) {
    props.setConsoleItemValue(props.unique_id, "console_text", new_text);
  }, []);
  function _handleSummaryTextChange(value) {
    props.setConsoleItemValue(props.unique_id, "summary_text", value);
  }
  var _toggleShrink = (0, _react.useCallback)(function () {
    props.setConsoleItemValue(props.unique_id, "am_shrunk", !props.am_shrunk);
  }, [props.am_shrunk]);
  var _deleteMe = (0, _react.useCallback)(function () {
    props.handleDelete(props.unique_id);
  }, []);
  function _handleKeyDown(event) {
    if (event.key == "Tab") {
      props.goToNextCell(props.unique_id);
      event.preventDefault();
    }
  }
  function _gotEnter() {
    props.goToNextCell(props.unique_id);
    _showMarkdown();
  }
  function _getFirstLine() {
    var re = /^(.*)$/m;
    if (props.console_text == "") {
      return "empty text cell";
    } else {
      return re.exec(props.console_text)[0];
    }
  }
  function _copyMe() {
    props.copyCell(props.unique_id);
  }
  function _pasteCell() {
    props.pasteCell(props.unique_id);
  }
  function _selectMe() {
    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    props.selectConsoleItem(props.unique_id, e, callback);
  }
  function _insertResourceLink() {
    return _insertResourceLink2.apply(this, arguments);
  }
  function _insertResourceLink2() {
    _insertResourceLink2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee21() {
      var result, new_links;
      return _regeneratorRuntime().wrap(function _callee21$(_context22) {
        while (1) switch (_context22.prev = _context22.next) {
          case 0:
            _context22.prev = 0;
            _context22.next = 3;
            return dialogFuncs.showModalPromise("SelectResourceDialog", {
              cancel_text: "cancel",
              submit_text: "insert link",
              handleClose: dialogFuncs.hideModal
            });
          case 3:
            result = _context22.sent;
            new_links = _toConsumableArray(props.links);
            new_links.push({
              res_type: result.type,
              res_name: result.selected_resource
            });
            props.setConsoleItemValue(props.unique_id, "links", new_links);
            _context22.next = 13;
            break;
          case 9:
            _context22.prev = 9;
            _context22.t0 = _context22["catch"](0);
            if (_context22.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error duplicating resource ".concat(res_name), _context22.t0);
            }
            return _context22.abrupt("return");
          case 13:
          case "end":
            return _context22.stop();
        }
      }, _callee21, null, [[0, 9]]);
    }));
    return _insertResourceLink2.apply(this, arguments);
  }
  function _deleteLinkButton(index) {
    var new_links = _lodash["default"].cloneDeep(props.links);
    new_links.splice(index, 1);
    var self = this;
    props.setConsoleItemValue(props.unique_id, "links", new_links, function () {
      console.log("i am here with nlinks " + String(props.links.length));
    });
  }
  function _addBlankText() {
    _selectMe(null, function () {
      props.addNewTextItem();
    });
  }
  function _addBlankDivider() {
    _selectMe(null, function () {
      props.addNewDividerItem();
    });
  }
  function _addBlankCode() {
    _selectMe(null, function () {
      props.addNewCodeItem();
    });
  }
  var contextMenu = (0, _react.useMemo)(function () {
    return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "paragraph",
      intent: "success",
      onClick: _showMarkdown,
      text: "Show Markdown"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "new-text-box",
      onClick: _addBlankText,
      text: "New Text Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "code",
      onClick: _addBlankCode,
      text: "New Code Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "header",
      onClick: _addBlankDivider,
      text: "New Section"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "link",
      onClick: _insertResourceLink,
      text: "Insert ResourceLink"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "duplicate",
      onClick: _copyMe,
      text: "Copy Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "clipboard",
      onClick: _pasteCell,
      text: "Paste Cells"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "trash",
      onClick: _deleteMe,
      intent: "danger",
      text: "Delete Cell"
    }));
  }, []);
  var _consoleItemClick = (0, _react.useCallback)(function (e) {
    _selectMe(e);
    e.stopPropagation();
  }, []);
  var _handleFocus = (0, _react.useCallback)(function () {
    if (!props.am_selected) {
      _selectMe();
    }
  }, []);
  function _setCMObject(cmobject) {
    cmobject.current = cmobject;
    if (props.set_focus) {
      cmobject.current.focus();
      cmobject.current.setCursor({
        line: 0,
        ch: 0
      });
      props.setConsoleItemValue(props.unique_id, "set_focus", false, _selectMe);
    }
    if (cmobject.current != null) {
      cmobject.current.on("focus", function () {
        props.setFocus(props.unique_id, _selectMe);
      });
      cmobject.current.on("blur", function () {
        props.setFocus(null);
      });
    }
  }
  var _extraKeys = (0, _react.useMemo)(function () {
    return [{
      key: 'Ctrl-Enter',
      run: function run() {
        return _gotEnter();
      }
    }, {
      key: 'Cmd-Enter',
      run: function run() {
        return _gotEnter();
      }
    }, {
      key: 'Ctrl-c',
      run: props.addNewCodeItem
    }, {
      key: 'Ctrl-t',
      run: props.addNewTextItem
    }];
  }, []);
  var really_show_markdown = hasOnlyWhitespace() && props.links.length == 0 ? false : props.show_markdown;
  var converted_markdown;
  if (really_show_markdown) {
    converted_markdown = mdi.render(props.console_text);
  }
  var converted_dict = {
    __html: converted_markdown
  };
  var panel_class = props.am_shrunk ? "log-panel log-panel-invisible text-log-item" : "log-panel log-panel-visible text-log-item";
  if (props.am_selected) {
    panel_class += " selected";
  }
  if (props.in_section) {
    panel_class += " in-section";
  }
  var gbstyle = {
    marginLeft: 1
  };
  var link_buttons = props.links.map(function (link, index) {
    return /*#__PURE__*/_react["default"].createElement(ResourceLinkButton, {
      key: index,
      my_index: index,
      handleCreateViewer: props.handleCreateViewer,
      deleteMe: _deleteLinkButton,
      res_type: link.res_type,
      res_name: link.res_name
    });
  });
  var uwidth = props.in_section ? usable_width - SECTION_INDENT / 2 : usable_width;
  uwidth -= BUTTON_CONSUMED_SPACE;
  var body_shrunk_style = (0, _react.useMemo)(function () {
    return {
      marginLeft: 30,
      width: uwidth - 80
    };
  }, [uwidth]);
  // noinspection JSUnusedAssignment
  return /*#__PURE__*/_react["default"].createElement(_core.ContextMenu, {
    content: contextMenu
  }, /*#__PURE__*/_react["default"].createElement(_sizing_tools.SizeProvider, {
    value: {
      availableWidth: uwidth,
      availableHeight: usable_height,
      topX: topX,
      topY: topY
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: panel_class + " d-flex flex-row",
    onClick: _consoleItemClick,
    ref: elRef,
    id: props.unique_id,
    style: MB10_STYLE
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div shrink-expand-div d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(Shandle, {
    dragHandleProps: props.dragHandleProps
  }), !props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    icon: "chevron-down",
    handleClick: _toggleShrink
  }), props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    icon: "chevron-right",
    style: {
      marginTop: 5
    },
    handleClick: _toggleShrink
  })), props.am_shrunk && /*#__PURE__*/_react["default"].createElement("div", {
    style: body_shrunk_style,
    className: "d-flex flex-row text-box"
  }, /*#__PURE__*/_react["default"].createElement(_core.EditableText, {
    value: props.summary_text ? props.summary_text : _getFirstLine(),
    onChange: _handleSummaryTextChange,
    className: "log-panel-summary"
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div float-buttons d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _deleteMe,
    tooltip: "Delete this item",
    style: empty_style,
    icon: trash_icon
  }))), !props.am_shrunk && /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-column",
    style: {
      width: "100%"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "log-panel-body text-box d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div d-inline-flex pr-1"
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _toggleMarkdown,
    intent: "success",
    tooltip: "Convert to/from markdown",
    icon: "paragraph"
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-column"
  }, !really_show_markdown && /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_reactCodemirror.ReactCodemirror6, {
    handleChange: _handleChange,
    readOnly: false,
    handleFocus: _handleFocus,
    registerSetFocusFunc: registerSetFocusFunc,
    show_line_numbers: false,
    soft_wrap: true,
    mode: "markdown",
    code_content: props.console_text,
    extraKeys: _extraKeys,
    search_term: props.search_string,
    no_height: true,
    tsocket: props.tsocket,
    container_id: props.main_id,
    saveMe: null
  })), really_show_markdown && !hasOnlyWhitespace() && /*#__PURE__*/_react["default"].createElement("div", {
    className: "text-panel-output markdown-heading-sizes",
    onDoubleClick: _hideMarkdown,
    style: {
      width: uwidth - 81,
      padding: 9
    },
    dangerouslySetInnerHTML: converted_dict
  }), link_buttons), /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div float-buttons d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _deleteMe,
    tooltip: "Delete this item",
    style: empty_style,
    icon: trash_icon
  })))))));
}
ConsoleTextItem = /*#__PURE__*/(0, _react.memo)(ConsoleTextItem);
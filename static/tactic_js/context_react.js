"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
require("../tactic_css/tactic.scss");
require("../tactic_css/context.scss");
require("../tactic_css/tactic_table.scss");
require("../tactic_css/library_home.scss");
require("../tactic_css/tile_creator.scss");
var _react = _interopRequireWildcard(require("react"));
var _client = require("react-dom/client");
var _core = require("@blueprintjs/core");
var _utilities_react = require("./utilities_react");
var _tactic_socket = require("./tactic_socket");
var _TacticOmnibar = require("./TacticOmnibar");
var _communication_react = require("./communication_react");
var _toaster = require("./toaster");
var _blueprint_navbar = require("./blueprint_navbar");
var _error_boundary = require("./error_boundary");
var _blueprint_mdata_fields = require("./blueprint_mdata_fields");
var _library_home_react = require("./library_home_react");
var _pool_browser = require("./pool_browser");
var _pool_tree = require("./pool_tree");
var _library_pane = require("./library_pane");
var _module_viewer_react = require("./module_viewer_react");
var _tile_maker_react = require("./tile_maker_react");
var _tile_creator_support = require("./tile_creator_support");
var _main_app = require("./main_app");
var _main_support = require("./main_support");
var _notebook_app = require("./notebook_app");
var _notebook_support = require("./notebook_support");
var _code_viewer_react = require("./code_viewer_react");
var _list_viewer_react = require("./list_viewer_react");
var _text_viewer_react = require("./text_viewer_react");
var _error_drawer = require("./error_drawer");
var _assistant = require("./assistant");
var _sizing_tools = require("./sizing_tools");
var _resizing_layouts = require("./resizing_layouts2");
var _settings = require("./settings");
var _modal_react = require("./modal_react");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return r; }; var t, r = {}, e = Object.prototype, n = e.hasOwnProperty, o = "function" == typeof Symbol ? Symbol : {}, i = o.iterator || "@@iterator", a = o.asyncIterator || "@@asyncIterator", u = o.toStringTag || "@@toStringTag"; function c(t, r, e, n) { return Object.defineProperty(t, r, { value: e, enumerable: !n, configurable: !n, writable: !n }); } try { c({}, ""); } catch (t) { c = function c(t, r, e) { return t[r] = e; }; } function h(r, e, n, o) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype); return c(a, "_invoke", function (r, e, n) { var o = 1; return function (i, a) { if (3 === o) throw Error("Generator is already running"); if (4 === o) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var u = n.delegate; if (u) { var c = d(u, n); if (c) { if (c === f) continue; return c; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (1 === o) throw o = 4, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = 3; var h = s(r, e, n); if ("normal" === h.type) { if (o = n.done ? 4 : 2, h.arg === f) continue; return { value: h.arg, done: n.done }; } "throw" === h.type && (o = 4, n.method = "throw", n.arg = h.arg); } }; }(r, n, new Context(o || [])), !0), a; } function s(t, r, e) { try { return { type: "normal", arg: t.call(r, e) }; } catch (t) { return { type: "throw", arg: t }; } } r.wrap = h; var f = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var l = {}; c(l, i, function () { return this; }); var p = Object.getPrototypeOf, y = p && p(p(x([]))); y && y !== e && n.call(y, i) && (l = y); var v = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(l); function g(t) { ["next", "throw", "return"].forEach(function (r) { c(t, r, function (t) { return this._invoke(r, t); }); }); } function AsyncIterator(t, r) { function e(o, i, a, u) { var c = s(t[o], t, i); if ("throw" !== c.type) { var h = c.arg, f = h.value; return f && "object" == _typeof(f) && n.call(f, "__await") ? r.resolve(f.__await).then(function (t) { e("next", t, a, u); }, function (t) { e("throw", t, a, u); }) : r.resolve(f).then(function (t) { h.value = t, a(h); }, function (t) { return e("throw", t, a, u); }); } u(c.arg); } var o; c(this, "_invoke", function (t, n) { function i() { return new r(function (r, o) { e(t, n, r, o); }); } return o = o ? o.then(i, i) : i(); }, !0); } function d(r, e) { var n = e.method, o = r.i[n]; if (o === t) return e.delegate = null, "throw" === n && r.i["return"] && (e.method = "return", e.arg = t, d(r, e), "throw" === e.method) || "return" !== n && (e.method = "throw", e.arg = new TypeError("The iterator does not provide a '" + n + "' method")), f; var i = s(o, r.i, e.arg); if ("throw" === i.type) return e.method = "throw", e.arg = i.arg, e.delegate = null, f; var a = i.arg; return a ? a.done ? (e[r.r] = a.value, e.next = r.n, "return" !== e.method && (e.method = "next", e.arg = t), e.delegate = null, f) : a : (e.method = "throw", e.arg = new TypeError("iterator result is not an object"), e.delegate = null, f); } function w(t) { this.tryEntries.push(t); } function m(r) { var e = r[4] || {}; e.type = "normal", e.arg = t, r[4] = e; } function Context(t) { this.tryEntries = [[-1]], t.forEach(w, this), this.reset(!0); } function x(r) { if (null != r) { var e = r[i]; if (e) return e.call(r); if ("function" == typeof r.next) return r; if (!isNaN(r.length)) { var o = -1, a = function e() { for (; ++o < r.length;) if (n.call(r, o)) return e.value = r[o], e.done = !1, e; return e.value = t, e.done = !0, e; }; return a.next = a; } } throw new TypeError(_typeof(r) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, c(v, "constructor", GeneratorFunctionPrototype), c(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = c(GeneratorFunctionPrototype, u, "GeneratorFunction"), r.isGeneratorFunction = function (t) { var r = "function" == typeof t && t.constructor; return !!r && (r === GeneratorFunction || "GeneratorFunction" === (r.displayName || r.name)); }, r.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, c(t, u, "GeneratorFunction")), t.prototype = Object.create(v), t; }, r.awrap = function (t) { return { __await: t }; }, g(AsyncIterator.prototype), c(AsyncIterator.prototype, a, function () { return this; }), r.AsyncIterator = AsyncIterator, r.async = function (t, e, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(h(t, e, n, o), i); return r.isGeneratorFunction(e) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, g(v), c(v, u, "Generator"), c(v, i, function () { return this; }), c(v, "toString", function () { return "[object Generator]"; }), r.keys = function (t) { var r = Object(t), e = []; for (var n in r) e.unshift(n); return function t() { for (; e.length;) if ((n = e.pop()) in r) return t.value = n, t.done = !1, t; return t.done = !0, t; }; }, r.values = x, Context.prototype = { constructor: Context, reset: function reset(r) { if (this.prev = this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(m), !r) for (var e in this) "t" === e.charAt(0) && n.call(this, e) && !isNaN(+e.slice(1)) && (this[e] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0][4]; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(r) { if (this.done) throw r; var e = this; function n(t) { a.type = "throw", a.arg = r, e.next = t; } for (var o = e.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i[4], u = this.prev, c = i[1], h = i[2]; if (-1 === i[0]) return n("end"), !1; if (!c && !h) throw Error("try statement without catch or finally"); if (null != i[0] && i[0] <= u) { if (u < c) return this.method = "next", this.arg = t, n(c), !0; if (u < h) return n(h), !1; } } }, abrupt: function abrupt(t, r) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var n = this.tryEntries[e]; if (n[0] > -1 && n[0] <= this.prev && this.prev < n[2]) { var o = n; break; } } o && ("break" === t || "continue" === t) && o[0] <= r && r <= o[2] && (o = null); var i = o ? o[4] : {}; return i.type = t, i.arg = r, o ? (this.method = "next", this.next = o[2], f) : this.complete(i); }, complete: function complete(t, r) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && r && (this.next = r), f; }, finish: function finish(t) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var e = this.tryEntries[r]; if (e[2] === t) return this.complete(e[4], e[3]), m(e), f; } }, "catch": function _catch(t) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var e = this.tryEntries[r]; if (e[0] === t) { var n = e[4]; if ("throw" === n.type) { var o = n.arg; m(e); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(r, e, n) { return this.delegate = { i: x(r), r: e, n: n }, "next" === this.method && (this.arg = t), f; } }, r; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; } // noinspection XmlDeprecatedElement,JSXUnresolvedComponent
//import { HotkeysProvider } from "@blueprintjs/core";
_core.FocusStyleManager.onlyShowFocusOnTabs();
var spinner_panel = /*#__PURE__*/_react["default"].createElement("div", {
  style: {
    height: "100%",
    position: "absolute",
    top: "50%",
    left: "50%"
  }
}, /*#__PURE__*/_react["default"].createElement(_core.Spinner, {
  size: 100
}));
var MIN_CONTEXT_WIDTH = 45;
var MIN_CONTEXT_SAVED_WIDTH = 100;
var iconDict = {
  "module-viewer": "application",
  "code-viewer": "code",
  "list-viewer": "list",
  "text-viewer": "list",
  "creator-viewer": "application",
  "main-viewer": "projects",
  "notebook-viewer": "projects"
};
var libIconDict = {
  all: _blueprint_mdata_fields.icon_dict["all"],
  collections: _blueprint_mdata_fields.icon_dict["collection"],
  projects: _blueprint_mdata_fields.icon_dict["project"],
  tiles: _blueprint_mdata_fields.icon_dict["tile"],
  lists: _blueprint_mdata_fields.icon_dict["list"],
  code: _blueprint_mdata_fields.icon_dict["code"],
  pool: _blueprint_mdata_fields.icon_dict["pool"]
};
var propDict = {
  "module-viewer": _module_viewer_react.module_viewer_props,
  "code-viewer": _code_viewer_react.code_viewer_props,
  "list-viewer": _list_viewer_react.list_viewer_props,
  "text-viewer": _text_viewer_react.text_viewer_props,
  "creator-viewer": _tile_creator_support.creator_props,
  "main-viewer": _main_support.main_props,
  "notebook-viewer": _notebook_support.notebook_props
};
var panelRootDict = {
  "module-viewer": "root",
  "code-viewer": "root",
  "list-viewer": "root",
  "text-viewer": "root",
  "creator-viewer": "creator-root",
  "main-viewer": "main-root",
  "notebook-viewer": "main-root"
};
window.context_id = (0, _utilities_react.guid)();
window.main_id = window.context_id;
var tsocket = new _tactic_socket.TacticSocket("main", 5000, "context", window.context_id);
var classDict = {
  "module-viewer": _module_viewer_react.ModuleViewerApp,
  "code-viewer": _code_viewer_react.CodeViewerApp,
  "list-viewer": _list_viewer_react.ListViewerApp,
  "creator-viewer": _tile_maker_react.CreatorApp,
  "main-viewer": _main_app.MainApp,
  "notebook-viewer": _notebook_app.NotebookApp,
  "text-viewer": _text_viewer_react.TextViewerApp
};
function _context_main() {
  var ContextAppPlus = (0, _pool_tree.withPool)((0, _settings.withSettings)((0, _modal_react.withDialogs)((0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)((0, _assistant.withAssistant)(ContextApp))))));
  var domContainer = document.querySelector('#context-root');
  var root = (0, _client.createRoot)(domContainer);
  root.render(
  /*#__PURE__*/
  //<HotkeysProvider>
  _react["default"].createElement(ContextAppPlus, {
    tsocket: tsocket
  })
  //</HotkeysProvider>
  );
}
function ContextApp(props) {
  var _useStateAndRefAndCou = (0, _utilities_react.useStateAndRefAndCounter)("library"),
    _useStateAndRefAndCou2 = _slicedToArray(_useStateAndRefAndCou, 4),
    selectedTabId = _useStateAndRefAndCou2[0],
    setSelectedTabId = _useStateAndRefAndCou2[1],
    selectedTabIdRef = _useStateAndRefAndCou2[2],
    selectedTabIdCounter = _useStateAndRefAndCou2[3];
  var _useState = (0, _react.useState)(_sizing_tools.INIT_CONTEXT_PANEL_WIDTH),
    _useState2 = _slicedToArray(_useState, 2),
    saved_width = _useState2[0],
    set_saved_width = _useState2[1];
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)({}),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    set_tab_panel_dict = _useStateAndRef2[1],
    tab_panel_dict_ref = _useStateAndRef2[2];
  var _useStateAndRef3 = (0, _utilities_react.useStateAndRef)([]),
    _useStateAndRef4 = _slicedToArray(_useStateAndRef3, 3),
    set_tab_ids = _useStateAndRef4[1],
    tab_ids_ref = _useStateAndRef4[2];
  var _useStateAndRef5 = (0, _utilities_react.useStateAndRef)([]),
    _useStateAndRef6 = _slicedToArray(_useStateAndRef5, 3),
    set_open_resources = _useStateAndRef6[1],
    open_resources_ref = _useStateAndRef6[2];
  var _useState3 = (0, _react.useState)({}),
    _useState4 = _slicedToArray(_useState3, 2),
    dirty_methods = _useState4[0],
    set_dirty_methods = _useState4[1];
  var _useState5 = (0, _react.useState)(null),
    _useState6 = _slicedToArray(_useState5, 2),
    lastSelectedTabId = _useState6[0],
    setLastSelectedTabId = _useState6[1];
  var _useState7 = (0, _react.useState)(function () {
      return (0, _sizing_tools.getUsableDimensions)(true).usable_width - _sizing_tools.INIT_CONTEXT_PANEL_WIDTH - _sizing_tools.ICON_BAR_WIDTH;
    }),
    _useState8 = _slicedToArray(_useState7, 2),
    usable_width = _useState8[0],
    set_usable_width = _useState8[1];
  var _useState9 = (0, _react.useState)(function () {
      return (0, _sizing_tools.getUsableDimensions)(true).usable_height_no_bottom;
    }),
    _useState0 = _slicedToArray(_useState9, 2),
    usable_height = _useState0[0],
    set_usable_height = _useState0[1];
  var _useState1 = (0, _react.useState)(170),
    _useState10 = _slicedToArray(_useState1, 2),
    paneX = _useState10[0],
    setPaneX = _useState10[1];
  var _useState11 = (0, _react.useState)(_sizing_tools.USUAL_NAVBAR_HEIGHT),
    _useState12 = _slicedToArray(_useState11, 2),
    paneY = _useState12[0],
    setPaneY = _useState12[1];
  var _useState13 = (0, _react.useState)(_sizing_tools.INIT_CONTEXT_PANEL_WIDTH),
    _useState14 = _slicedToArray(_useState13, 2),
    tabWidth = _useState14[0],
    setTabWidth = _useState14[1];
  var _useState15 = (0, _react.useState)(null),
    _useState16 = _slicedToArray(_useState15, 2),
    dragging_over = _useState16[0],
    set_dragging_over = _useState16[1];
  var _useState17 = (0, _react.useState)(null),
    _useState18 = _slicedToArray(_useState17, 2),
    currently_dragging = _useState18[0],
    set_currently_dragging = _useState18[1];
  var _useState19 = (0, _react.useState)(false),
    _useState20 = _slicedToArray(_useState19, 2),
    showOpenOmnibar = _useState20[0],
    setShowOpenOmnibar = _useState20[1];
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  var statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  var _useState21 = (0, _react.useState)(0),
    _useState22 = _slicedToArray(_useState21, 2),
    tabSelectCounter = _useState22[0],
    setTabSelectCounter = _useState22[1];
  var omniItemsRef = (0, _react.useRef)({});
  var top_ref = (0, _react.useRef)(null);
  var hotkeys = (0, _react.useMemo)(function () {
    return [{
      combo: "Tab",
      global: true,
      label: "Go To Next Pane",
      onKeyDown: _goToNextPane
    }, {
      combo: "Shift+Tab",
      global: true,
      label: "Go To Previous Pane",
      onKeyDown: _goToPreviousPane
    }, {
      combo: "Ctrl+Space",
      global: true,
      label: "Show Omnibar",
      onKeyDown: _showOpenOmnibar
    }, {
      combo: "Ctrl+W",
      global: true,
      label: "Close Tab",
      onKeyDown: function () {
        var _onKeyDown = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
          return _regeneratorRuntime().wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _closeTab(selectedTabIdRef.current);
              case 2:
              case "end":
                return _context.stop();
            }
          }, _callee);
        }));
        function onKeyDown() {
          return _onKeyDown.apply(this, arguments);
        }
        return onKeyDown;
      }()
    }];
  }, [_goToNextPane, _goToPreviousPane, _showOpenOmnibar, _closeTab, selectedTabIdRef.current]);
  var _useHotkeys = (0, _core.useHotkeys)(hotkeys),
    handleKeyDown = _useHotkeys.handleKeyDown,
    handleKeyUp = _useHotkeys.handleKeyUp;
  var pushCallback = (0, _utilities_react.useCallbackStack)("context");
  (0, _react.useEffect)(function () {
    initSocket();
    _addContextOmniItems();
    errorDrawerFuncs.registerGoToModule(_goToModule);
    var tab_list_elem = document.querySelector("#context-container .context-tab-list > .bp5-tab-list");
    if (tab_list_elem) {
      tab_list_elem.setAttribute("style", "width:".concat(_sizing_tools.INIT_CONTEXT_PANEL_WIDTH, "px"));
    }
    return function () {
      tsocket.disconnect();
    };
  }, []);
  (0, _react.useEffect)(function () {
    // for mount
    window.addEventListener("resize", function () {
      return _update_window_dimensions(null);
    });
    window.addEventListener("beforeunload", function (e) {
      e.preventDefault();
      e.returnValue = 'Are you sure you want to close? All changes will be lost.';
    });
    _update_window_dimensions(null);
    var tab_list_elem = document.querySelector("#context-container .context-tab-list > .bp5-tab-list");
    var resizeObserver = new ResizeObserver(function () {
      _update_window_dimensions(null);
    });
    if (tab_list_elem) {
      resizeObserver.observe(tab_list_elem);
    }
  }, []);
  (0, _react.useEffect)(function () {
    _update_window_dimensions(null);
  }, [selectedTabId]);
  function get_tab_list_elem() {
    return document.querySelector("#context-container .context-tab-list > .bp5-tab-list");
  }
  function _togglePane(pane_closed) {
    var w = pane_closed ? saved_width : MIN_CONTEXT_WIDTH;
    var tab_elem = get_tab_list_elem();
    tab_elem.setAttribute("style", "width:".concat(w, "px"));
    pushCallback(_update_window_dimensions);
  }
  function _handleTabResize(e, ui, lastX) {
    var tab_elem = get_tab_list_elem();
    var w = lastX > window.innerWidth / 2 ? window.innerWidth / 2 : lastX;
    w = w <= MIN_CONTEXT_WIDTH ? MIN_CONTEXT_WIDTH : w;
    tab_elem.setAttribute("style", "width:".concat(w, "px"));
  }
  function _handleTabResizeStart() {
    var new_width = Math.max(tabWidth, MIN_CONTEXT_SAVED_WIDTH);
    if (new_width !== saved_width) {
      set_saved_width(new_width);
    }
  }
  function _handleTabResizeEnd() {
    var tab_elem = get_tab_list_elem();
    var tab_rect = tab_elem.getBoundingClientRect();
    if (tab_rect.width > 45) {
      var new_width = Math.max(tab_rect.width, MIN_CONTEXT_SAVED_WIDTH);
      if (new_width !== saved_width) {
        set_saved_width(new_width);
      }
    }
    pushCallback(_update_window_dimensions);
  }
  function _update_window_dimensions() {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var tab_list_elem = get_tab_list_elem();
    var uwidth;
    var uheight;
    var tWidth;
    var top_rect;
    if (top_ref && top_ref.current) {
      top_rect = top_ref.current.getBoundingClientRect();
      uheight = window.innerHeight - top_rect.top;
    } else {
      uheight = window.innerHeight - _sizing_tools.USUAL_NAVBAR_HEIGHT;
    }
    if (tab_list_elem) {
      var tab_rect = tab_list_elem.getBoundingClientRect();
      uwidth = window.innerWidth - tab_rect.width;
      tWidth = tab_rect.width;
    } else {
      uwidth = window.innerWidth - 150;
      tWidth = 150;
    }
    set_usable_height(uheight);
    set_usable_width(uwidth - _sizing_tools.ICON_BAR_WIDTH);
    setPaneX(tWidth);
    setPaneY(top_ref.current ? top_rect.top : _sizing_tools.USUAL_NAVBAR_HEIGHT);
    setTabWidth(tWidth);
    statusFuncs.setLeftEdge(tWidth);
    pushCallback(callback);
  }
  function _registerDirtyMethod(tab_id, dirty_method) {
    var new_dirty_methods = _objectSpread({}, dirty_methods);
    new_dirty_methods[tab_id] = dirty_method;
    set_dirty_methods(new_dirty_methods);
  }
  function initSocket() {
    props.tsocket.attachListener("window-open", function (data) {
      window.open("".concat($SCRIPT_ROOT, "/load_temp_page/").concat(data["the_id"]));
    });
    props.tsocket.attachListener('close-user-windows', function (data) {
      if (!(data["originator"] === window.context_id)) {
        window.close();
      }
    });
    props.tsocket.attachListener("doFlashUser", function (data) {
      (0, _toaster.doFlash)(data);
    });
    props.tsocket.attachListener('handle-callback', function (task_packet) {
      (0, _communication_react.handleCallback)(task_packet, window.context_id);
    });
    props.tsocket.attachListener("create-viewer", _handleCreateViewer);
  }
  function _refreshTab(_x) {
    return _refreshTab2.apply(this, arguments);
  }
  function _refreshTab2() {
    _refreshTab2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(the_id) {
      var title, confirm_text, old_tab_panel, resource_name, res_type, the_view, re, drmethod, data;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            if (!(the_id === "library")) {
              _context4.next = 2;
              break;
            }
            return _context4.abrupt("return");
          case 2:
            _context4.prev = 2;
            if (!(!(the_id in dirty_methods) || dirty_methods[the_id]())) {
              _context4.next = 8;
              break;
            }
            title = tab_panel_dict_ref.current[the_id].title;
            confirm_text = "Are you sure that you want to reload the tab ".concat(title, "? Changes will be lost");
            _context4.next = 8;
            return dialogFuncs.showModalPromise("ConfirmDialog", {
              title: "Reload the tab ".concat(title),
              text_body: confirm_text,
              cancel_text: "do nothing",
              submit_text: "reload",
              handleClose: dialogFuncs.hideModal
            });
          case 8:
            old_tab_panel = _objectSpread({}, tab_panel_dict_ref.current[the_id]);
            resource_name = old_tab_panel.panel.resource_name;
            res_type = old_tab_panel.res_type;
            if (old_tab_panel.kind === "notebook-viewer" && !old_tab_panel.panel.is_project) {
              the_view = "/new_notebook_in_context/";
            } else {
              the_view = (0, _library_pane.view_views)()[res_type];
              re = new RegExp("/$");
              the_view = the_view.replace(re, "_in_context");
            }
            drmethod = function drmethod(dmethod) {
              _registerDirtyMethod(the_id, dmethod);
            };
            _context4.next = 15;
            return _updatePanelPromise(the_id, {
              panel: "spinner"
            });
          case 15:
            _context4.next = 17;
            return (0, _communication_react.postAjaxPromise)($SCRIPT_ROOT + the_view, {
              context_id: window.context_id,
              resource_name: resource_name
            });
          case 17:
            data = _context4.sent;
            propDict[data.kind](data, drmethod, function (new_panel) {
              _updatePanel(the_id, {
                panel: new_panel,
                kind: data.kind
              });
            });
            _context4.next = 24;
            break;
          case 21:
            _context4.prev = 21;
            _context4.t0 = _context4["catch"](2);
            if (String(_context4.t0) !== "canceled") {
              errorDrawerFuncs.addFromError("Error refreshing pane", _context4.t0);
            }
          case 24:
          case "end":
            return _context4.stop();
        }
      }, _callee4, null, [[2, 21]]);
    }));
    return _refreshTab2.apply(this, arguments);
  }
  function _closeTab(_x2) {
    return _closeTab2.apply(this, arguments);
  }
  function _closeTab2() {
    _closeTab2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(the_id) {
      var title, confirm_text, idx, copied_tab_panel_dict, copied_tab_ids, copied_dirty_methods;
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            if (!(the_id === "library")) {
              _context5.next = 2;
              break;
            }
            return _context5.abrupt("return");
          case 2:
            _context5.prev = 2;
            if (!(!(the_id in dirty_methods) || dirty_methods[the_id]())) {
              _context5.next = 8;
              break;
            }
            title = tab_panel_dict_ref.current[the_id].title;
            confirm_text = "Are you sure that you want to close the tab ".concat(title, "? Changes will be lost");
            _context5.next = 8;
            return dialogFuncs.showModalPromise("ConfirmDialog", {
              title: "Close the tab ".concat(title, "\""),
              text_body: confirm_text,
              cancel_text: "do nothing",
              submit_text: "close",
              handleClose: dialogFuncs.hideModal
            });
          case 8:
            idx = tab_ids_ref.current.indexOf(the_id);
            copied_tab_panel_dict = _objectSpread({}, tab_panel_dict_ref.current);
            copied_tab_ids = _toConsumableArray(tab_ids_ref.current);
            copied_dirty_methods = _objectSpread({}, dirty_methods);
            if (idx > -1) {
              copied_tab_ids.splice(idx, 1);
              delete copied_tab_panel_dict[the_id];
              delete copied_dirty_methods[the_id];
            }
            set_tab_ids(copied_tab_ids);
            set_dirty_methods(copied_dirty_methods);
            set_tab_panel_dict(copied_tab_panel_dict);
            if (the_id in omniItemsRef.current) {
              delete omniItemsRef.current[the_id];
            }
            pushCallback(function () {
              if (the_id === selectedTabIdRef.current) {
                var newSelectedId;
                if (lastSelectedTabId && copied_tab_ids.includes(lastSelectedTabId)) {
                  newSelectedId = lastSelectedTabId;
                } else {
                  newSelectedId = "library";
                }
                setSelectedTabId(newSelectedId);
                setLastSelectedTabId("library");
              } else {
                setSelectedTabId(selectedTabId);
                if (lastSelectedTabId === the_id) {
                  setLastSelectedTabId("library");
                }
              }
              pushCallback(function () {
                _updateOpenResources(function () {
                  return _update_window_dimensions();
                });
              });
            });
            _context5.next = 23;
            break;
          case 20:
            _context5.prev = 20;
            _context5.t0 = _context5["catch"](2);
            if (_context5.t0 !== "canceled") {
              errorDrawerFuncs.addFromError("Error closing tab", _context5.t0);
            }
          case 23:
          case "end":
            return _context5.stop();
        }
      }, _callee5, null, [[2, 20]]);
    }));
    return _closeTab2.apply(this, arguments);
  }
  function _addPanel(new_id, viewer_kind, res_type, title, new_panel) {
    var callback = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
    var data = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;
    var new_tab_panel_dict = _objectSpread({}, tab_panel_dict_ref.current);
    new_tab_panel_dict[new_id] = {
      kind: viewer_kind,
      res_type: res_type,
      title: title,
      panel: new_panel,
      data: data
    };
    set_tab_panel_dict(new_tab_panel_dict);
    var new_tab_ids = [].concat(_toConsumableArray(tab_ids_ref.current), [new_id]);
    set_tab_ids(new_tab_ids);
    setLastSelectedTabId(selectedTabIdRef.current);
    setSelectedTabId(new_id);
    pushCallback(function () {
      _updateOpenResources(callback);
    });
  }
  function _addPanelPromise(new_id, viewer_kind, res_type, title, new_panel) {
    var data = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
    return new Promise(function (resolve) {
      _addPanel(new_id, viewer_kind, res_type, title, new_panel, resolve, data);
    });
  }
  function _updatePanel(the_id, new_panel) {
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var new_tab_panel_dict = _objectSpread({}, tab_panel_dict_ref.current);
    for (var k in new_panel) {
      if (k !== "panel") {
        new_tab_panel_dict[the_id][k] = new_panel[k];
      }
    }
    if ("panel" in new_panel) {
      if (new_panel.panel === "spinner") {
        new_tab_panel_dict[the_id].panel = "spinner";
      } else if (new_tab_panel_dict[the_id].panel !== "spinner") {
        for (var j in new_panel.panel) {
          new_tab_panel_dict[the_id].panel[j] = new_panel.panel[j];
        }
      } else {
        new_tab_panel_dict[the_id].panel = new_panel.panel;
      }
    }
    set_tab_panel_dict(new_tab_panel_dict);
    pushCallback(function () {
      _updateOpenResources(function () {
        return _update_window_dimensions(callback);
      });
    });
  }
  function _updatePanelPromise(the_id, new_panel) {
    return new Promise(function (resolve) {
      _updatePanel(the_id, new_panel, resolve);
    });
  }
  function _changeResourceName(the_id, new_name) {
    var change_title = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var new_tab_panel_dict = _objectSpread({}, tab_panel_dict_ref.current);
    if (change_title) {
      new_tab_panel_dict[the_id].title = new_name;
    }
    new_tab_panel_dict[the_id].panel.resource_name = new_name;
    set_tab_panel_dict(new_tab_panel_dict);
    pushCallback(function () {
      _updateOpenResources(function () {
        return _update_window_dimensions(callback);
      });
    });
  }
  function _getResourceId(res_name, res_type) {
    var _iterator = _createForOfIteratorHelper(tab_ids_ref.current),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var the_id = _step.value;
        var the_panel = tab_panel_dict_ref.current[the_id];
        if (the_panel.panel.resource_name === res_name && the_panel.res_type === res_type) {
          return the_id;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return -1;
  }
  function _showOpenOmnibar() {
    setShowOpenOmnibar(true);
  }
  function _closeOpenOmnibar() {
    setShowOpenOmnibar(false);
  }
  var _handleCreateViewer = (0, _react.useCallback)(/*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(data) {
      var callback,
        existing_id,
        new_id,
        drmethod,
        _args2 = arguments;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            callback = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : null;
            existing_id = _getResourceId(data.resource_name, data.res_type);
            if (!(existing_id !== -1)) {
              _context2.next = 6;
              break;
            }
            setSelectedTabId(existing_id);
            pushCallback(callback);
            return _context2.abrupt("return");
          case 6:
            new_id = "a" + (0, _utilities_react.guid)();
            drmethod = function drmethod(dmethod) {
              _registerDirtyMethod(new_id, dmethod);
            };
            _context2.next = 10;
            return _addPanelPromise(new_id, data.kind, data.res_type, data.resource_name, "spinner");
          case 10:
            propDict[data.kind](data, drmethod, function (new_panel) {
              _updatePanel(new_id, {
                panel: new_panel
              }, callback);
            });
          case 11:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return function (_x3) {
      return _ref.apply(this, arguments);
    };
  }(), []);
  function _goToNextPane(e) {
    var templist = ["library"];
    if (window.has_pool) templist.push("pool");
    templist = [].concat(_toConsumableArray(templist), _toConsumableArray(tab_ids_ref.current));
    var newId;
    var tabIndex = templist.indexOf(selectedTabIdRef.current) + 1;
    newId = tabIndex === templist.length ? "library" : templist[tabIndex];
    _handleTabSelect(newId, selectedTabIdRef.current);
    if (e) {
      e.preventDefault();
    }
  }
  function _goToPreviousPane(e) {
    var templist = ["library"];
    if (window.has_pool) templist.push("pool");
    templist = [].concat(_toConsumableArray(templist), _toConsumableArray(tab_ids_ref.current));
    var tabIndex = templist.indexOf(selectedTabIdRef.current) - 1;
    var newId = tabIndex === -1 ? templist.at(-1) : templist[tabIndex];
    _handleTabSelect(newId, selectedTabIdRef.current);
    if (e) {
      e.preventDefault();
    }
  }
  function _handleTabSelect(newTabId, prevTabId) {
    var event = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    setSelectedTabId(newTabId);
    setLastSelectedTabId(prevTabId);
    pushCallback(function () {
      _update_window_dimensions(callback);
      setTabSelectCounter(tabSelectCounter + 1);
    });
  }
  function _goToModule(_x4, _x5) {
    return _goToModule2.apply(this, arguments);
  }
  function _goToModule2() {
    _goToModule2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(module_name, line_number) {
      var _loop, _ret, tab_id, the_view, re, data, _new_id, drmethod;
      return _regeneratorRuntime().wrap(function _callee6$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
          case 0:
            _loop = /*#__PURE__*/_regeneratorRuntime().mark(function _loop() {
              var pdict;
              return _regeneratorRuntime().wrap(function _loop$(_context6) {
                while (1) switch (_context6.prev = _context6.next) {
                  case 0:
                    pdict = tab_panel_dict_ref.current[tab_id];
                    if (!(pdict.kind === "creator-viewer" && pdict.panel.resource_name === module_name)) {
                      _context6.next = 4;
                      break;
                    }
                    _handleTabSelect(tab_id, selectedTabIdRef.current, null, function () {
                      if ("line_setter" in pdict) {
                        pdict.line_setter(line_number);
                      }
                    });
                    return _context6.abrupt("return", {
                      v: void 0
                    });
                  case 4:
                  case "end":
                    return _context6.stop();
                }
              }, _loop);
            });
            _context7.t0 = _regeneratorRuntime().keys(tab_panel_dict_ref.current);
          case 2:
            if ((_context7.t1 = _context7.t0()).done) {
              _context7.next = 10;
              break;
            }
            tab_id = _context7.t1.value;
            return _context7.delegateYield(_loop(), "t2", 5);
          case 5:
            _ret = _context7.t2;
            if (!_ret) {
              _context7.next = 8;
              break;
            }
            return _context7.abrupt("return", _ret.v);
          case 8:
            _context7.next = 2;
            break;
          case 10:
            the_view = (0, _library_pane.view_views)()["tile"];
            re = new RegExp("/$");
            the_view = the_view.replace(re, "_in_context");
            _context7.prev = 13;
            _context7.next = 16;
            return (0, _communication_react.postAjaxPromise)(the_view, {
              context_id: window.context_id,
              resource_name: module_name
            });
          case 16:
            data = _context7.sent;
            _new_id = "".concat(data.kind, ": ").concat(data.resource_name);
            drmethod = function drmethod(dmethod) {
              _registerDirtyMethod(_new_id, dmethod);
            };
            _context7.next = 21;
            return _addPanelPromise(_new_id, data.kind, data.res_type, data.resource_name, "spinner");
          case 21:
            propDict[data.kind](data, drmethod, function (new_panel) {
              _updatePanel(_new_id, {
                panel: new_panel
              });
            });
            _context7.next = 27;
            break;
          case 24:
            _context7.prev = 24;
            _context7.t3 = _context7["catch"](13);
            errorDrawerFuncs.addFromError("Error going to module ".concat(module_name), _context7.t3);
          case 27:
          case "end":
            return _context7.stop();
        }
      }, _callee6, null, [[13, 24]]);
    }));
    return _goToModule2.apply(this, arguments);
  }
  function _registerLineSetter(tab_id, rfunc) {
    _updatePanel(tab_id, {
      line_setter: rfunc
    });
  }
  function _onDragStart(event, tab_id) {
    set_currently_dragging(tab_id);
    event.stopPropagation();
  }
  function _onDragEnd(event) {
    set_dragging_over(null);
    set_currently_dragging(null);
    event.stopPropagation();
    event.preventDefault();
  }
  function _nextTab(tab_id) {
    var tidx = tab_ids_ref.current.indexOf(tab_id);
    if (tidx === -1) return null;
    if (tidx === tab_ids_ref.current.length - 1) return "dummy";
    return tab_ids_ref.current[tidx + 1];
  }
  function _onDrop(event, target_id) {
    if (currently_dragging === null || currently_dragging === target_id) return;
    var current_index = tab_ids_ref.current.indexOf(currently_dragging);
    var new_tab_ids = _toConsumableArray(tab_ids_ref.current);
    new_tab_ids.splice(current_index, 1);
    if (target_id === "dummy") {
      new_tab_ids.push(currently_dragging);
    } else {
      var target_index = new_tab_ids.indexOf(target_id);
      new_tab_ids.splice(target_index, 0, currently_dragging);
    }
    set_tab_ids(new_tab_ids);
    set_dragging_over(null);
    event.stopPropagation();
  }
  function _onDragOver(event) {
    event.stopPropagation();
    event.preventDefault();
  }
  function _onDragEnter(event, target_id) {
    if (target_id === currently_dragging || target_id === _nextTab(currently_dragging)) {
      set_dragging_over(null);
    } else {
      set_dragging_over(target_id);
    }
    event.stopPropagation();
    event.preventDefault();
  }
  function _onDragLeave(event) {
    event.stopPropagation();
    event.preventDefault();
  }
  function _getOpenResources() {
    var open_resources = [];
    for (var the_id in tab_panel_dict_ref.current) {
      var entry = tab_panel_dict_ref.current[the_id];
      if (entry.panel !== "spinner") {
        open_resources.push({
          id: the_id,
          resource_name: entry.panel.resource_name,
          res_type: entry.res_type,
          main_id: entry.panel.main_id
        });
      }
    }
    return open_resources;
  }
  function _updateOpenResources() {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    set_open_resources(_getOpenResources());
    pushCallback(callback);
  }
  function _addOmniItems(tid, items) {
    if (!(tid in omniItemsRef.current)) {
      omniItemsRef.current[tid] = [];
    }
    omniItemsRef.current[tid] = omniItemsRef.current[tid].concat(items);
  }
  function _addContextOmniItems() {
    var omni_funcs = [["Go To Next Panel", "context", _goToNextPane, "arrow-right"], ["Go To Previous Panel", "context", _goToPreviousPane, "arrow-left"]];
    var omni_items = [];
    for (var _i = 0, _omni_funcs = omni_funcs; _i < _omni_funcs.length; _i++) {
      var item = _omni_funcs[_i];
      omni_items.push({
        category: "Global",
        display_text: item[0],
        search_text: item[0],
        icon_name: item[3],
        the_function: item[2],
        item_type: "command"
      });
    }
    _addOmniItems("global", omni_items);
  }
  var bclass = "context-tab-button-content";
  if (selectedTabIdRef.current === "library") {
    bclass += " selected-tab-button";
  }
  var library_panel = /*#__PURE__*/_react["default"].createElement(_utilities_react.SelectedPaneContext.Provider, {
    value: {
      tab_id: "library",
      selectedTabIdRef: selectedTabIdRef,
      amSelected: amSelected,
      counter: selectedTabIdCounter,
      addOmniItems: function addOmniItems(items) {
        _addOmniItems("library", items);
      }
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    id: "library-home-root"
  }, /*#__PURE__*/_react["default"].createElement(_library_home_react.LibraryHomeApp, {
    tsocket: tsocket,
    library_style: window.library_style,
    controlled: true,
    am_selected: selectedTabIdRef.current === "library",
    open_resources_ref: open_resources_ref,
    handleCreateViewer: _handleCreateViewer,
    usable_width: usable_width,
    usable_height: usable_height
  })));
  var ltab = /*#__PURE__*/_react["default"].createElement(_core.Tab, {
    id: "library",
    tabIndex: -1,
    key: "library",
    style: {
      paddingLeft: 10,
      marginBottom: 0
    },
    panelClassName: "context-tab",
    title: "",
    panel: library_panel
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: bclass + " open-resource-tab",
    style: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      display: "table-cell",
      flexDirection: "row",
      justifyContent: "flex-start",
      textOverflow: "ellipsis",
      overflow: "hidden"
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
    icon: libIconDict["all"],
    style: {
      verticalAlign: "middle",
      marginRight: 5
    },
    size: 16,
    tabIndex: -1
  }), /*#__PURE__*/_react["default"].createElement("span", null, "Library"))));
  var all_tabs = [ltab];
  if (window.has_pool) {
    var pclass = "context-tab-button-content";
    if (selectedTabIdRef.current === "pool") {
      pclass += " selected-tab-button";
    }
    var pool_panel = /*#__PURE__*/_react["default"].createElement(_utilities_react.SelectedPaneContext.Provider, {
      value: {
        tab_id: "pool",
        selectedTabIdRef: selectedTabIdRef,
        amSelected: amSelected,
        counter: selectedTabIdCounter,
        addOmniItems: function addOmniItems(items) {
          _addOmniItems("pool", items);
        }
      }
    }, /*#__PURE__*/_react["default"].createElement("div", {
      id: "pool-browser-root"
    }, /*#__PURE__*/_react["default"].createElement(_pool_browser.PoolBrowser, {
      tsocket: tsocket,
      am_selected: selectedTabIdRef.current === "pool",
      usable_width: usable_width,
      getOpenResources: _getOpenResources,
      setSelectedTabId: setSelectedTabId,
      handleCreateViewer: _handleCreateViewer,
      usable_height: usable_height
    })));
    var ptab = /*#__PURE__*/_react["default"].createElement(_core.Tab, {
      id: "pool",
      tabIndex: -1,
      key: "pool",
      style: {
        paddingLeft: 10,
        marginBottom: 0
      },
      panelClassName: "context-tab",
      title: "",
      panel: pool_panel
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: pclass + " open-resource-tab",
      style: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between"
      }
    }, /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        display: "table-cell",
        flexDirection: "row",
        justifyContent: "flex-start",
        textOverflow: "ellipsis",
        overflow: "hidden"
      }
    }, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
      icon: libIconDict["pool"],
      style: {
        verticalAlign: "middle",
        marginRight: 5
      },
      size: 16,
      tabIndex: -1
    }), /*#__PURE__*/_react["default"].createElement("span", null, "Pool"))));
    all_tabs.push(ptab);
  }
  function amSelected(ltab_id, lselectedTabIdRef) {
    return !window.in_context || ltab_id === lselectedTabIdRef.current;
  }
  var _omni_view_func = (0, _react.useCallback)(/*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(item) {
      var the_view, re, data;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            the_view = (0, _library_pane.view_views)(false)[item.res_type];
            statusFuncs.setStatus({
              show_spinner: true,
              status_message: "Opening ..."
            });
            if (!window.in_context) {
              _context3.next = 19;
              break;
            }
            re = new RegExp("/$");
            the_view = the_view.replace(re, "_in_context");
            _context3.prev = 5;
            _context3.next = 8;
            return (0, _communication_react.postAjaxPromise)(the_view, {
              context_id: context_id,
              resource_name: item.name
            });
          case 8:
            data = _context3.sent;
            _context3.next = 11;
            return _handleCreateViewer(data, statusFuncs.clearStatus);
          case 11:
            _context3.next = 17;
            break;
          case 13:
            _context3.prev = 13;
            _context3.t0 = _context3["catch"](5);
            statusFuncs.clearStatus();
            errorDrawerFuncs.addFromError("Error following ".concat(the_view), _context3.t0);
          case 17:
            _context3.next = 21;
            break;
          case 19:
            statusFuncs.clearStatus();
            window.open($SCRIPT_ROOT + the_view + item.name);
          case 21:
          case "end":
            return _context3.stop();
        }
      }, _callee3, null, [[5, 13]]);
    }));
    return function (_x6) {
      return _ref2.apply(this, arguments);
    };
  }(), []);
  var _iterator2 = _createForOfIteratorHelper(tab_ids_ref.current),
    _step2;
  try {
    var _loop2 = function _loop2() {
      var tab_id = _step2.value;
      var tab_entry = tab_panel_dict_ref.current[tab_id];
      var bclass = "context-tab-button-content";
      if (selectedTabIdRef.current === tab_id) {
        bclass += " selected-tab-button";
      }
      var visible_title = tab_entry.title;
      var wrapped_panel;
      if (tab_entry.panel === "spinner") {
        wrapped_panel = spinner_panel;
      } else {
        var TheClass = classDict[tab_entry.kind];
        var the_panel = /*#__PURE__*/_react["default"].createElement(_utilities_react.SelectedPaneContext.Provider, {
          value: {
            tab_id: tab_id,
            selectedTabIdRef: selectedTabIdRef,
            amSelected: amSelected,
            counter: selectedTabIdCounter,
            addOmniItems: function addOmniItems(items) {
              _addOmniItems(tab_id, items);
            }
          }
        }, /*#__PURE__*/_react["default"].createElement(TheClass, _extends({}, tab_entry.panel, {
          controlled: true,
          handleCreateViewer: _handleCreateViewer,
          tab_id: tab_id,
          selectedTabIdRef: selectedTabIdRef,
          changeResourceName: function changeResourceName(new_name) {
            var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            var change_title = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
            _changeResourceName(tab_id, new_name, change_title, callback);
          },
          updatePanel: function updatePanel(new_panel) {
            var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            _updatePanel(tab_id, new_panel, callback);
          },
          goToModule: _goToModule,
          registerLineSetter: function registerLineSetter(rfunc) {
            return _registerLineSetter(tab_id, rfunc);
          },
          refreshTab: /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7() {
            return _regeneratorRuntime().wrap(function _callee7$(_context8) {
              while (1) switch (_context8.prev = _context8.next) {
                case 0:
                  _context8.next = 2;
                  return _refreshTab(tab_id);
                case 2:
                case "end":
                  return _context8.stop();
              }
            }, _callee7);
          })),
          closeTab: /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8() {
            return _regeneratorRuntime().wrap(function _callee8$(_context9) {
              while (1) switch (_context9.prev = _context9.next) {
                case 0:
                  _context9.next = 2;
                  return _closeTab(tab_id);
                case 2:
                case "end":
                  return _context9.stop();
              }
            }, _callee8);
          })),
          tsocket: tab_entry.panel.tsocket,
          usable_width: usable_width,
          usable_height: usable_height
        })));
        wrapped_panel = /*#__PURE__*/_react["default"].createElement(_error_boundary.ErrorBoundary, null, /*#__PURE__*/_react["default"].createElement("div", {
          id: "".concat(tab_id, "-holder"),
          className: panelRootDict[tab_panel_dict_ref.current[tab_id].kind]
        }, the_panel));
      }
      var icon_style = {
        verticalAlign: "middle",
        paddingLeft: 4
      };
      if (tab_id === dragging_over) {
        bclass += " hovering";
      }
      if (tab_id === currently_dragging) {
        bclass += " currently-dragging";
      }
      var new_tab = /*#__PURE__*/_react["default"].createElement(_core.Tab, {
        id: tab_id,
        draggable: "true",
        onDragStart: function onDragStart(e) {
          _onDragStart(e, tab_id);
        },
        onDrop: function onDrop(e) {
          _onDrop(e, tab_id);
        },
        onDragEnter: function onDragEnter(e) {
          _onDragEnter(e, tab_id);
        },
        onDragOver: function onDragOver(e) {
          _onDragOver(e, tab_id);
        },
        onDragLeave: function onDragLeave(e) {
          _onDragLeave(e, tab_id);
        },
        onDragEnd: function onDragEnd(e) {
          _onDragEnd(e);
        },
        tabIndex: -1,
        key: tab_id,
        panelClassName: "context-tab",
        title: "",
        panel: wrapped_panel
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: bclass + " open-resource-tab",
        style: {
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between"
        }
      }, /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          display: "table-cell",
          flexDirection: "row",
          justifyContent: "flex-start",
          textOverflow: "ellipsis",
          overflow: "hidden"
        }
      }, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
        icon: iconDict[tab_entry.kind],
        style: {
          verticalAlign: "middle",
          marginRight: 5
        },
        size: 16,
        tabIndex: -1
      }), /*#__PURE__*/_react["default"].createElement("span", null, visible_title)), /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
        icon: "reset",
        style: icon_style,
        size: 13,
        className: "context-close-button",
        tabIndex: -1,
        onClick: /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9() {
          return _regeneratorRuntime().wrap(function _callee9$(_context0) {
            while (1) switch (_context0.prev = _context0.next) {
              case 0:
                _context0.next = 2;
                return _refreshTab(tab_id);
              case 2:
              case "end":
                return _context0.stop();
            }
          }, _callee9);
        }))
      }), /*#__PURE__*/_react["default"].createElement(_core.Icon, {
        icon: "delete",
        style: icon_style,
        size: 13,
        className: "context-close-button",
        tabIndex: -1,
        onClick: /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee0() {
          return _regeneratorRuntime().wrap(function _callee0$(_context1) {
            while (1) switch (_context1.prev = _context1.next) {
              case 0:
                _context1.next = 2;
                return _closeTab(tab_id);
              case 2:
              case "end":
                return _context1.stop();
            }
          }, _callee0);
        }))
      }))));
      all_tabs.push(new_tab);
    };
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      _loop2();
    }

    // The purpose of the dummy tab is to make it possible to drag a tab to the bottom of the list
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  bclass = "context-tab-button-content";
  if (dragging_over === "dummy") {
    bclass += " hovering";
  }
  var dummy_tab = /*#__PURE__*/_react["default"].createElement(_core.Tab, {
    id: "dummy",
    draggable: "false",
    disabled: true,
    onDrop: function onDrop(e) {
      _onDrop(e, "dummy");
    },
    onDragEnter: function onDragEnter(e) {
      _onDragEnter(e, "dummy");
    },
    onDragOver: function onDragOver(e) {
      _onDragOver(e, "dummy");
    },
    onDragLeave: function onDragLeave(e) {
      _onDragLeave(e, "dummy");
    },
    tabIndex: -1,
    key: "dummy",
    panelClassName: "context-tab",
    title: "",
    panel: null
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: bclass,
    style: {
      height: 30,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between"
    }
  }));
  all_tabs.push(dummy_tab);
  var outer_class = "pane-holder ";
  if (settingsContext.isDark()) {
    outer_class = "".concat(outer_class, " bp5-dark");
  } else {
    outer_class = "".concat(outer_class, " light-theme");
  }
  var outer_style = {
    width: "100%",
    height: usable_height,
    paddingLeft: 0
  };
  var tlclass = "context-tab-list";
  var pane_closed = tabWidth <= MIN_CONTEXT_WIDTH;
  if (pane_closed) {
    tlclass += " context-pane-closed";
  }
  var sid = selectedTabIdRef.current;
  var commandItems = omniItemsRef.current["global"];
  if (sid in omniItemsRef.current) {
    commandItems = commandItems.concat(omniItemsRef.current[sid]);
  }
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    selected: null,
    show_api_links: false,
    extra_text: window.database_type === "Local" ? "" : window.database_type,
    page_id: window.context_id,
    user_name: window.username
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: outer_class,
    tabIndex: "0",
    style: outer_style,
    ref: top_ref,
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp
  }, /*#__PURE__*/_react["default"].createElement("div", {
    id: "context-container",
    style: outer_style
  }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
    icon: /*#__PURE__*/_react["default"].createElement(_core.Icon, {
      icon: pane_closed ? "drawer-left-filled" : "drawer-right-filled",
      size: 18
    }),
    style: {
      paddingLeft: 4,
      paddingRight: 0,
      position: "fixed",
      left: tabWidth - 30,
      bottom: 10,
      zIndex: 1
    },
    minimal: true,
    className: "context-close-button",
    small: true,
    tabIndex: -1,
    onClick: function onClick() {
      _togglePane(pane_closed);
    }
  }), /*#__PURE__*/_react["default"].createElement(_resizing_layouts.DragHandle, {
    position_dict: {
      position: "fixed",
      left: tabWidth - 5
    },
    onDrag: _handleTabResize,
    dragStart: _handleTabResizeStart,
    dragEnd: _handleTabResizeEnd,
    direction: "x",
    barHeight: "100%",
    useThinBar: true
  }), /*#__PURE__*/_react["default"].createElement(_sizing_tools.SizeContext.Provider, {
    value: {
      availableWidth: usable_width,
      availableHeight: usable_height,
      topX: paneX,
      topY: paneY
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.Tabs, {
    id: "context-tabs",
    selectedTabId: selectedTabIdRef.current,
    className: tlclass,
    vertical: true,
    onChange: _handleTabSelect
  }, all_tabs))), /*#__PURE__*/_react["default"].createElement(_utilities_react.SelectedPaneContext.Provider, {
    value: {
      tab_id: sid,
      selectedTabIdRef: selectedTabIdRef,
      amSelected: amSelected,
      addOmniItems: function addOmniItems(items) {
        _addOmniItems(sid, items);
      }
    }
  }, /*#__PURE__*/_react["default"].createElement(_TacticOmnibar.OpenOmnibar, {
    commandItems: commandItems,
    page_id: window.context_id,
    showOmnibar: showOpenOmnibar,
    openFunc: _omni_view_func,
    is_authenticated: window.is_authenticated,
    closeOmnibar: _closeOpenOmnibar
  }))));
}
_context_main();
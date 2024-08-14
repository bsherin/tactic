"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MainApp = MainApp;
require("../tactic_css/tactic.scss");
require("../tactic_css/tactic_main.scss");
require("../tactic_css/tactic_table.scss");
require("../tactic_css/tactic_console.scss");
require("../tactic_css/tactic_select.scss");
var _react = _interopRequireWildcard(require("react"));
var _client = require("react-dom/client");
var _core = require("@blueprintjs/core");
var _table = require("@blueprintjs/table");
var _lodash = _interopRequireDefault(require("lodash"));
var _main_support = require("./main_support");
var _blueprint_navbar = require("./blueprint_navbar");
var _menu_utilities = require("./menu_utilities");
var _table_react = require("./table_react");
var _blueprint_table = require("./blueprint_table");
var _resizing_layouts = require("./resizing_layouts2");
var _main_menus_react = require("./main_menus_react");
var _tile_react = require("./tile_react");
var _export_viewer_react = require("./export_viewer_react");
var _console_component = require("./console_component");
var _console_support = require("./console_support");
var _communication_react = require("./communication_react");
var _toaster = require("./toaster");
var _error_drawer = require("./error_drawer");
var _utilities_react = require("./utilities_react");
var _sizing_tools = require("./sizing_tools");
var _error_boundary = require("./error_boundary");
var _settings = require("./settings");
var _pool_tree = require("./pool_tree");
var _assistant = require("./assistant");
var _modal_react = require("./modal_react");
var _metadata_drawer = require("./metadata_drawer");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } // import { HotkeysProvider } from "@blueprintjs/core";
var MARGIN_SIZE = 0;
var BOTTOM_MARGIN = 30; // includes space for status messages at bottom
var MARGIN_ADJUSTMENT = 8; // This is the amount at the top of both the table and the console
var CONSOLE_HEADER_HEIGHT = 35;
var EXTRA_TABLE_AREA_SPACE = 500;
var MENU_BAR_HEIGHT = 30; // will only appear when in context
var TABLE_CONSOLE_GAP = 20; // handle width plus margin

var iStateDefaults = {
  table_is_shrunk: false,
  tile_list: [],
  console_items: [],
  console_width_fraction: .5,
  horizontal_fraction: .65,
  console_is_shrunk: true,
  height_fraction: .85,
  show_exports_pane: true,
  show_console_pane: true,
  console_is_zoomed: false
};
function MainApp(props) {
  props = _objectSpread({
    controlled: false,
    changeResourceName: null,
    refreshTab: null,
    closeTab: null,
    updatePanel: null
  }, props);
  function iStateOrDefault(pname) {
    if (props.is_project) {
      if ("interface_state" in props && props.interface_state && pname in props.interface_state) {
        return props.interface_state[pname];
      }
    }
    return iStateDefaults[pname];
  }
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  var last_save = (0, _react.useRef)({});
  var resizing = (0, _react.useRef)(false);
  var updateExportsList = (0, _react.useRef)(null);
  var table_container_ref = (0, _react.useRef)(null);
  var main_outer_ref = (0, _react.useRef)(null);
  var set_table_scroll = (0, _react.useRef)(null);
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)([]),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    console_selected_items = _useStateAndRef2[0],
    set_console_selected_items = _useStateAndRef2[1],
    console_selected_items_ref = _useStateAndRef2[2];
  var _useReducerAndRef = (0, _utilities_react.useReducerAndRef)(_console_support.consoleItemsReducer, []),
    _useReducerAndRef2 = _slicedToArray(_useReducerAndRef, 3),
    console_items = _useReducerAndRef2[0],
    dispatch = _useReducerAndRef2[1],
    console_items_ref = _useReducerAndRef2[2];
  var _useReducerAndRef3 = (0, _utilities_react.useReducerAndRef)(_tile_react.tilesReducer, iStateOrDefault("tile_list")),
    _useReducerAndRef4 = _slicedToArray(_useReducerAndRef3, 3),
    tile_list = _useReducerAndRef4[0],
    tileDispatch = _useReducerAndRef4[1],
    tile_list_ref = _useReducerAndRef4[2];
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  var statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  var selectedPane = (0, _react.useContext)(_utilities_react.SelectedPaneContext);
  var _useReducer = (0, _react.useReducer)(_main_support.mainReducer, {
      table_is_shrunk: props.doc_type == "none" || iStateOrDefault("table_is_shrunk"),
      console_width_fraction: iStateOrDefault("console_width_fraction"),
      horizontal_fraction: iStateOrDefault("horizontal_fraction"),
      height_fraction: iStateOrDefault("height_fraction"),
      console_is_shrunk: iStateOrDefault("console_is_shrunk"),
      console_is_zoomed: iStateOrDefault("console_is_zoomed"),
      show_exports_pane: iStateOrDefault("show_exports_pane"),
      show_console_pane: iStateOrDefault("show_console_pane"),
      show_metadata: false,
      table_spec: props.initial_table_spec,
      doc_type: props.doc_type,
      data_text: props.doc_type == "freeform" ? props.initial_data_text : "",
      data_row_dict: props.doc_type == "freeform" ? {} : props.initial_data_row_dict,
      total_rows: props.doc_type == "freeform" ? 0 : props.total_rows,
      doc_names: props.initial_doc_names,
      short_collection_name: props.short_collection_name,
      tile_types: props.initial_tile_types,
      tile_icon_dict: props.initial_tile_icon_dict,
      alt_search_text: null,
      selected_column: null,
      selected_row: null,
      selected_regions: [],
      table_is_filtered: false,
      search_text: "",
      soft_wrap: false,
      show_table_spinner: false,
      cells_to_color_text: {},
      spreadsheet_mode: false,
      // These will maybe only be used if not controlled
      resource_name: props.resource_name,
      is_project: props.is_project
    }),
    _useReducer2 = _slicedToArray(_useReducer, 2),
    mState = _useReducer2[0],
    mDispatch = _useReducer2[1];
  var _useSize = (0, _sizing_tools.useSize)(main_outer_ref, 0, "MainApp"),
    _useSize2 = _slicedToArray(_useSize, 4),
    usable_width = _useSize2[0],
    usable_height = _useSize2[1],
    topX = _useSize2[2],
    topY = _useSize2[3];
  var connection_status = (0, _utilities_react.useConnection)(props.tsocket, initSocket);
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  (0, _utilities_react.useConstructor)(function () {
    dispatch({
      type: "initialize",
      new_items: props.is_project && props.interface_state ? props.interface_state["console_items"] : []
    });
  });
  (0, _react.useEffect)(function () {
    if (props.controlled) {
      props.registerDirtyMethod(_dirty);
    } else {
      window.addEventListener("beforeunload", function (e) {
        if (_dirty()) {
          e.preventDefault();
          e.returnValue = '';
        }
      });
    }
    _updateLastSave();
    statusFuncs.stopSpinner();
    if (!props.controlled) {
      document.title = mState.resource_name;
    }
    function sendRemove() {
      console.log("got the beacon");
      navigator.sendBeacon("/remove_mainwindow", JSON.stringify({
        "main_id": props.main_id
      }));
    }
    window.addEventListener("unload", sendRemove);
    return function () {
      delete_my_containers();
      window.removeEventListener("unload", sendRemove);
    };
  }, []);
  (0, _react.useEffect)(function () {
    var data = {
      active_row_id: mState.selected_row,
      doc_name: mState.table_spec.current_doc_name
    };
    _broadcast_event_to_server("MainTableRowSelect", data);
  }, [mState.selected_row]);
  function _filteredColumnNames() {
    return mState.table_spec.column_names.filter(function (name) {
      return !(mState.table_spec.hidden_columns_list.includes(name) || name == "__id__");
    });
  }
  function _cProp(pname) {
    return props.controlled ? props[pname] : mState[pname];
  }
  function am_selected() {
    return selectedPane.amSelected(selectedPane.tab_id, selectedPane.selectedTabIdRef);
  }
  var save_state = {
    tile_list: tile_list,
    console_items: console_items,
    table_is_shrunk: mState.table_is_shrunk,
    console_width_fraction: mState.console_width_fraction,
    horizontal_fraction: mState.horizontal_fraction,
    console_is_shrunk: mState.console_is_shrunk,
    height_fraction: mState.height_fraction,
    show_exports_pane: mState.show_exports_pane,
    show_console_pane: mState.show_console_pane,
    console_is_zoomed: mState.console_is_zoomed
  };
  function _updateLastSave() {
    last_save.current = save_state;
  }
  function _dirty() {
    var current_state = save_state;
    for (var k in current_state) {
      if (current_state[k] != last_save.current[k]) {
        return true;
      }
    }
    return false;
  }
  function delete_my_containers() {
    (0, _communication_react.postAjax)("/remove_mainwindow", {
      "main_id": props.main_id
    });
  }
  function _update_menus_listener() {
    return _update_menus_listener2.apply(this, arguments);
  }
  function _update_menus_listener2() {
    _update_menus_listener2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
      var data;
      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return (0, _communication_react.postPromise)("host", "get_tile_types", {
              "user_id": window.user_id
            }, props.main_id);
          case 2:
            data = _context6.sent;
            mDispatch({
              type: "change_multiple_fields",
              newPartialState: {
                tile_types: data.tile_types,
                tile_icon_dict: data.icon_dict
              }
            });
          case 4:
          case "end":
            return _context6.stop();
        }
      }, _callee6);
    }));
    return _update_menus_listener2.apply(this, arguments);
  }
  function _change_doc_listener(_x) {
    return _change_doc_listener2.apply(this, arguments);
  }
  function _change_doc_listener2() {
    _change_doc_listener2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(data) {
      var row_id, scroll_to_row, select_row;
      return _regeneratorRuntime().wrap(function _callee7$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
          case 0:
            if (!(data.main_id == props.main_id)) {
              _context7.next = 7;
              break;
            }
            row_id = data.hasOwnProperty("row_id") ? data.row_id : null;
            scroll_to_row = data.hasOwnProperty("scroll_to_row") ? data.scroll_to_row : true;
            select_row = data.hasOwnProperty("select_row") ? data.select_row : true;
            if (mState.table_is_shrunk) {
              _setMainStateValue("table_is_shrunk", false);
            }
            _context7.next = 7;
            return _handleChangeDoc(data.doc_name, row_id, scroll_to_row, select_row);
          case 7:
          case "end":
            return _context7.stop();
        }
      }, _callee7);
    }));
    return _change_doc_listener2.apply(this, arguments);
  }
  function _setTileValue(tile_id, field, value) {
    tileDispatch({
      type: "change_item_value",
      tile_id: tile_id,
      field: field,
      new_value: value
    });
  }
  function _handleTileFinishedLoading(data) {
    _setTileValue(data.tile_id, "finished_loading", true);
  }
  function initSocket() {
    props.tsocket.attachListener("window-open", function (data) {
      window.open("".concat($SCRIPT_ROOT, "/load_temp_page/").concat(data["the_id"]));
    });
    if (!window.in_context) {
      props.tsocket.attachListener('close-user-windows', function (data) {
        if (!(data["originator"] == main_id)) {
          window.close();
        }
      });
      props.tsocket.attachListener("notebook-open", function (data) {
        window.open($SCRIPT_ROOT + "/new_notebook_with_data/" + data.temp_data_id);
      });
      props.tsocket.attachListener("doFlashUser", function (data) {
        (0, _toaster.doFlash)(data);
      });
    } else {
      props.tsocket.attachListener("notebook-open", /*#__PURE__*/function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(data) {
          var the_view, createData;
          return _regeneratorRuntime().wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                the_view = "".concat($SCRIPT_ROOT, "/new_notebook_in_context");
                _context.prev = 1;
                _context.next = 4;
                return (0, _communication_react.postAjaxPromise)(the_view, {
                  temp_data_id: data.temp_data_id,
                  resource_name: ""
                });
              case 4:
                createData = _context.sent;
                props.handleCreateViewer(createData);
                _context.next = 11;
                break;
              case 8:
                _context.prev = 8;
                _context.t0 = _context["catch"](1);
                errorDrawerFuncs.addFromError("Error saving list", _context.t0);
              case 11:
              case "end":
                return _context.stop();
            }
          }, _callee, null, [[1, 8]]);
        }));
        return function (_x2) {
          return _ref.apply(this, arguments);
        };
      }());
    }
    props.tsocket.attachListener('table-message', _handleTableMessage);
    props.tsocket.attachListener("update-menus", _update_menus_listener);
    props.tsocket.attachListener("tile-finished-loading", _handleTileFinishedLoading);
    props.tsocket.attachListener('change-doc', _change_doc_listener);
    props.tsocket.attachListener('handle-callback', function (task_packet) {
      (0, _communication_react.handleCallback)(task_packet, props.main_id);
    });
  }
  function isFreeform() {
    return mState.doc_type == "freeform";
  }

  // Every item in tile_list is a list of this form
  function _createTileEntry(tile_name, tile_type, tile_id, form_data) {
    return {
      tile_name: tile_name,
      tile_type: tile_type,
      tile_id: tile_id,
      form_data: form_data,
      tile_height: 345,
      tile_width: 410,
      show_form: false,
      show_spinner: false,
      source_changed: false,
      javascript_code: null,
      javascript_arg_dict: null,
      show_log: false,
      log_content: "",
      // log_since: null,
      // max_console_lines: 100,
      shrunk: false,
      finished_loading: true,
      front_content: ""
    };
  }
  var _setMainStateValue = (0, _react.useCallback)(function (field_name) {
    var new_value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    if (_typeof(field_name) == "object") {
      mDispatch({
        type: "change_multiple_fields",
        newPartialState: field_name
      });
      pushCallback(callback);
    } else {
      mDispatch({
        type: "change_field",
        field: field_name,
        new_value: new_value
      });
      pushCallback(callback);
    }
  });
  function _handleSearchFieldChange(lsearch_text) {
    mDispatch({
      type: "change_multiple_fields",
      newPartialState: {
        search_text: lsearch_text,
        alt_search_text: null
      }
    });
    if (lsearch_text == null && !isFreeform()) {
      _setMainStateValue("cells_to_color_text", {});
    }
  }
  function _handleSpreadsheetModeChange(event) {
    _setMainStateValue("spreadsheet_mode", event.target.checked);
  }
  function _handleSoftWrapChange(event) {
    _setMainStateValue("soft_wrap", event.target.checked);
  }
  function _setAltSearchText(the_text) {
    _setMainStateValue("alt_search_text", the_text);
  }
  function _handleChangeDoc(_x3) {
    return _handleChangeDoc2.apply(this, arguments);
  }
  function _handleChangeDoc2() {
    _handleChangeDoc2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(new_doc_name) {
      var row_index,
        scroll_to_row,
        select_row,
        data,
        new_table_spec,
        data_dict,
        _data,
        _args8 = arguments;
      return _regeneratorRuntime().wrap(function _callee8$(_context8) {
        while (1) switch (_context8.prev = _context8.next) {
          case 0:
            row_index = _args8.length > 1 && _args8[1] !== undefined ? _args8[1] : 0;
            scroll_to_row = _args8.length > 2 && _args8[2] !== undefined ? _args8[2] : true;
            select_row = _args8.length > 3 && _args8[3] !== undefined ? _args8[3] : true;
            _setMainStateValue("show_table_spinner", true);
            if (!isFreeform()) {
              _context8.next = 21;
              break;
            }
            _context8.prev = 5;
            _context8.next = 8;
            return (0, _communication_react.postPromise)(props.main_id, "grab_freeform_data", {
              "doc_name": new_doc_name,
              "set_visible_doc": true
            }, props.main_id);
          case 8:
            data = _context8.sent;
            statusFuncs.stopSpinner();
            statusFuncs.clearStatusMessage();
            new_table_spec = {
              "current_doc_name": new_doc_name
            };
            mDispatch({
              type: "change_multiple_fields",
              newPartialState: {
                data_text: data.data_text,
                table_spec: new_table_spec,
                visible_doc: new_doc_name
              }
            });
            pushCallback(function () {
              _setMainStateValue("show_table_spinner", false);
            });
            _context8.next = 19;
            break;
          case 16:
            _context8.prev = 16;
            _context8.t0 = _context8["catch"](5);
            errorDrawerFuncs.addFromError("Error changing doc", _context8.t0);
          case 19:
            _context8.next = 32;
            break;
          case 21:
            _context8.prev = 21;
            data_dict = {
              "doc_name": new_doc_name,
              "row_index": row_index,
              "set_visible_doc": true
            };
            _context8.next = 25;
            return (0, _communication_react.postPromise)(props.main_id, "grab_chunk_by_row_index", data_dict, props.main_id);
          case 25:
            _data = _context8.sent;
            _setStateFromDataObject(_data, new_doc_name, function () {
              _setMainStateValue("show_table_spinner", false);
              if (select_row) {
                _setMainStateValue({
                  selected_regions: [_table.Regions.row(row_index)],
                  selected_row: row_index,
                  selected_column: null
                }, null);
              }
              if (scroll_to_row) {
                set_table_scroll.current = row_index;
              }
            });
            _context8.next = 32;
            break;
          case 29:
            _context8.prev = 29;
            _context8.t1 = _context8["catch"](21);
            errorDrawerFuncs.addFromError("Error changing doc", _context8.t1);
          case 32:
          case "end":
            return _context8.stop();
        }
      }, _callee8, null, [[5, 16], [21, 29]]);
    }));
    return _handleChangeDoc2.apply(this, arguments);
  }
  function _handleVerticalSplitUpdate(top_height, bottom_height, top_fraction) {
    _setMainStateValue("height_fraction", top_fraction);
  }
  function _updateTableSpec(spec_update) {
    var broadcast = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    mDispatch({
      type: "update_table_spec",
      spec_update: spec_update
    });
    if (broadcast) {
      spec_update["doc_name"] = mState.table_spec.current_doc_name;
      (0, _communication_react.postWithCallback)(props.main_id, "UpdateTableSpec", spec_update, null, null, props.main_id);
    }
  }
  var _broadcast_event_to_server = (0, _react.useCallback)(function (event_name, data_dict) {
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    data_dict.main_id = props.main_id;
    data_dict.event_name = event_name;
    if (!("doc_name" in data_dict)) {
      data_dict.doc_name = mState.table_spec.current_doc_name;
    }
    (0, _communication_react.postWithCallback)(props.main_id, "distribute_events_stub", data_dict, callback, null, props.main_id);
  }, [props.main_id, mState.table_spec.current_doc_name]);
  function _broadcast_event_promise(event_name, data_dict) {
    data_dict.main_id = props.main_id;
    data_dict.event_name = event_name;
    if (!("doc_name" in data_dict)) {
      data_dict.doc_name = mState.table_spec.current_doc_name;
    }
    return (0, _communication_react.postPromise)(props.main_id, "distribute_events_stub", data_dict, props.main_id);
  }
  function _tile_command(_x4) {
    return _tile_command2.apply(this, arguments);
  }
  function _tile_command2() {
    _tile_command2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(menu_id) {
      var existing_tile_names, _iterator3, _step3, tile_entry, tile_name, data_dict, create_data, new_tile_entry;
      return _regeneratorRuntime().wrap(function _callee9$(_context9) {
        while (1) switch (_context9.prev = _context9.next) {
          case 0:
            existing_tile_names = [];
            _iterator3 = _createForOfIteratorHelper(tile_list);
            try {
              for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                tile_entry = _step3.value;
                existing_tile_names.push(tile_entry.tile_name);
              }
            } catch (err) {
              _iterator3.e(err);
            } finally {
              _iterator3.f();
            }
            _context9.prev = 3;
            _context9.next = 6;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Create " + menu_id,
              field_title: "New Tile Name",
              default_value: menu_id,
              existing_names: existing_tile_names,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 6:
            tile_name = _context9.sent;
            statusFuncs.startSpinner();
            statusFuncs.statusMessage("Creating Tile " + tile_name);
            data_dict = {
              tile_name: tile_name,
              tile_type: menu_id,
              user_id: window.user_id,
              parent: props.main_id
            };
            _context9.next = 12;
            return (0, _communication_react.postPromise)(props.main_id, "create_tile", data_dict, props.main_id);
          case 12:
            create_data = _context9.sent;
            new_tile_entry = _createTileEntry(tile_name, menu_id, create_data.tile_id, create_data.form_data);
            tileDispatch({
              type: "add_at_index",
              insert_index: tile_list.length,
              new_item: new_tile_entry
            });
            if (updateExportsList.current) updateExportsList.current();
            statusFuncs.clearStatusMessage();
            statusFuncs.stopSpinner();
            _context9.next = 25;
            break;
          case 20:
            _context9.prev = 20;
            _context9.t0 = _context9["catch"](3);
            if (_context9.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error creating tile}", _context9.t0);
            }
            statusFuncs.clearStatusMessage();
            statusFuncs.stopSpinner();
          case 25:
          case "end":
            return _context9.stop();
        }
      }, _callee9, null, [[3, 20]]);
    }));
    return _tile_command2.apply(this, arguments);
  }
  function create_tile_menus() {
    var menu_items = [];
    var sorted_categories = _toConsumableArray(Object.keys(mState.tile_types));
    sorted_categories.sort();
    var _iterator = _createForOfIteratorHelper(sorted_categories),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var category = _step.value;
        var option_dict = {};
        var icon_dict = {};
        var sorted_types = _toConsumableArray(mState.tile_types[category]);
        sorted_types.sort();
        var _iterator2 = _createForOfIteratorHelper(sorted_types),
          _step2;
        try {
          var _loop = function _loop() {
            var ttype = _step2.value;
            option_dict[ttype] = function () {
              return _tile_command(ttype);
            };
            icon_dict[ttype] = mState.tile_icon_dict[ttype];
          };
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            _loop();
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
        menu_items.push( /*#__PURE__*/_react["default"].createElement(_main_menus_react.MenuComponent, {
          menu_name: category,
          option_dict: option_dict,
          binding_dict: {},
          icon_dict: icon_dict,
          disabled_items: [],
          key: category
        }));
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return menu_items;
  }
  function _toggleTableShrink() {
    _setMainStateValue("table_is_shrunk", !mState.table_is_shrunk);
  }
  function _handleHorizontalFractionChange(left_width, right_width, new_fraction) {
    _setMainStateValue("horizontal_fraction", new_fraction);
  }
  function _handleResizeStart() {
    resizing.current = true;
  }
  function _handleResizeEnd() {
    resizing.current = false;
  }
  function _handleConsoleFractionChange(left_width, right_width, new_fraction) {
    _setMainStateValue("console_width_fraction", new_fraction);
  }

  // Table doctype-only methods start here

  function _setFreeformDoc(doc_name, new_content) {
    if (doc_name == mState.table_spec.current_doc_name) {
      _setMainStateValue("data_text", new_content);
    }
  }
  function _handleTableMessage(data) {
    if (data.main_id == props.main_id) {
      var handlerDict = {
        refill_table: _refill_table,
        dehighlightAllText: function dehighlightAllText(data) {
          return _handleSearchFieldChange(null);
        },
        highlightTxtInDocument: function highlightTxtInDocument(data) {
          return _setAltSearchText(data.text_to_find);
        },
        updateNumberRows: function updateNumberRows(data) {
          return _updateNumberRows(data.doc_name, data.number_rows);
        },
        setCellContent: function setCellContent(data) {
          return _setCellContent(data.row, data.column_header, data.new_content);
        },
        colorTxtInCell: function colorTxtInCell(data) {
          return _colorTextInCell(data.row_id, data.column_header, data.token_text, data.color_dict);
        },
        setFreeformContent: function setFreeformContent(data) {
          return _setFreeformDoc(data.doc_name, data.new_content);
        },
        updateDocList: function updateDocList(data) {
          return _updateDocList(data.doc_names, data.visible_doc);
        },
        setCellBackground: function setCellBackground(data) {
          return _setCellBackgroundColor(data.row, data.column_header, data.color);
        }
      };
      handlerDict[data.table_message](data);
    }
  }
  var _setCellContent = (0, _react.useCallback)(function (row_id, column_header, new_content) {
    var broadcast = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    mDispatch({
      type: "set_cell_content",
      row_id: row_id,
      column_header: column_header,
      new_content: new_content
    });
    var data = {
      id: row_id,
      column_header: column_header,
      new_content: new_content,
      cellchange: false
    };
    if (broadcast) {
      _broadcast_event_to_server("SetCellContent", data, null);
    }
  }, []);
  function _setCellBackgroundColor(row_id, column_header, color) {
    mDispatch({
      type: "set_cell_background",
      row_id: row_id,
      column_header: column_header
    });
  }
  function _colorTextInCell(row_id, column_header, token_text, color_dict) {
    mDispatch({
      type: "set_cells_to_color_text",
      row_id: row_id,
      column_header: column_header,
      token_text: token_text,
      color_dict: color_dict
    });
  }
  function _refill_table(data_object) {
    _setStateFromDataObject(data_object, data_object.doc_name);
  }
  function _moveColumn(tag_to_move, place_to_move) {
    var colnames = _toConsumableArray(mState.table_spec.column_names);
    var start_index = colnames.indexOf(tag_to_move);
    colnames.splice(start_index, 1);
    if (!place_to_move) {
      colnames.push(tag_to_move);
    } else {
      var end_index = colnames.indexOf(place_to_move);
      colnames.splice(end_index, 0, tag_to_move);
    }
    var fnames = _filteredColumnNames();
    start_index = fnames.indexOf(tag_to_move);
    fnames.splice(start_index, 1);
    var cwidths = _toConsumableArray(mState.table_spec.column_widths);
    var width_to_move = cwidths[start_index];
    cwidths.splice(start_index, 1);
    if (!place_to_move) {
      cwidths.push(width_to_move);
    } else {
      var _end_index = fnames.indexOf(place_to_move);
      cwidths.splice(_end_index, 0, width_to_move);
    }
    _updateTableSpec({
      column_names: colnames,
      column_widths: cwidths
    }, true);
  }
  function _hideColumn() {
    var hc_list = _toConsumableArray(mState.table_spec.hidden_columns_list);
    var fnames = _filteredColumnNames();
    var cname = mState.selected_column;
    var col_index = fnames.indexOf(cname);
    var cwidths = _toConsumableArray(mState.table_spec.column_widths);
    cwidths.splice(col_index, 1);
    hc_list.push(cname);
    _updateTableSpec({
      hidden_columns_list: hc_list,
      column_widths: cwidths
    }, true);
  }
  function _hideColumnInAll() {
    return _hideColumnInAll2.apply(this, arguments);
  }
  function _hideColumnInAll2() {
    _hideColumnInAll2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10() {
      var hc_list, fnames, cname, col_index, cwidths, data_dict;
      return _regeneratorRuntime().wrap(function _callee10$(_context10) {
        while (1) switch (_context10.prev = _context10.next) {
          case 0:
            hc_list = _toConsumableArray(mState.table_spec.hidden_columns_list);
            fnames = _filteredColumnNames();
            cname = mState.selected_column;
            col_index = fnames.indexOf(cname);
            cwidths = _toConsumableArray(mState.table_spec.column_widths);
            cwidths.splice(col_index, 1);
            hc_list.push(cname);
            data_dict = {
              "column_name": mState.selected_column
            };
            _context10.next = 10;
            return _broadcast_event_promise("HideColumnInAllDocs", data_dict, false);
          case 10:
            _updateTableSpec({
              hidden_columns_list: hc_list,
              column_widths: cwidths
            });
          case 11:
          case "end":
            return _context10.stop();
        }
      }, _callee10);
    }));
    return _hideColumnInAll2.apply(this, arguments);
  }
  function _unhideAllColumns() {
    _updateTableSpec({
      hidden_columns_list: ["__filename__"]
    }, true);
  }
  var _clearTableScroll = (0, _react.useCallback)(function () {
    set_table_scroll.current = null;
  }, []);
  function _deleteRow() {
    return _deleteRow2.apply(this, arguments);
  }
  function _deleteRow2() {
    _deleteRow2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11() {
      return _regeneratorRuntime().wrap(function _callee11$(_context11) {
        while (1) switch (_context11.prev = _context11.next) {
          case 0:
            _context11.next = 2;
            return (0, _communication_react.postPromise)(props.main_id, "delete_row", {
              "document_name": mState.table_spec.current_doc_name,
              "index": mState.selected_row
            });
          case 2:
          case "end":
            return _context11.stop();
        }
      }, _callee11);
    }));
    return _deleteRow2.apply(this, arguments);
  }
  function _insertRow(_x5) {
    return _insertRow2.apply(this, arguments);
  }
  function _insertRow2() {
    _insertRow2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee12(index) {
      return _regeneratorRuntime().wrap(function _callee12$(_context12) {
        while (1) switch (_context12.prev = _context12.next) {
          case 0:
            _context12.next = 2;
            return (0, _communication_react.postPromise)(props.main_id, "insert_row", {
              "document_name": mState.table_spec.current_doc_name,
              "index": index,
              "row_dict": {}
            }, props.main_id);
          case 2:
          case "end":
            return _context12.stop();
        }
      }, _callee12);
    }));
    return _insertRow2.apply(this, arguments);
  }
  function _duplicateRow() {
    return _duplicateRow2.apply(this, arguments);
  }
  function _duplicateRow2() {
    _duplicateRow2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee13() {
      return _regeneratorRuntime().wrap(function _callee13$(_context13) {
        while (1) switch (_context13.prev = _context13.next) {
          case 0:
            _context13.next = 2;
            return (0, _communication_react.postPromise)(props.main_id, "insert_row", {
              "document_name": mState.table_spec.current_doc_name,
              "index": mState.selected_row,
              "row_dict": mState.data_text[mState.selected_row]
            }, props.main_id);
          case 2:
          case "end":
            return _context13.stop();
        }
      }, _callee13);
    }));
    return _duplicateRow2.apply(this, arguments);
  }
  function _deleteColumn() {
    return _deleteColumn2.apply(this, arguments);
  }
  function _deleteColumn2() {
    _deleteColumn2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee14() {
      var delete_in_all,
        fnames,
        cname,
        col_index,
        cwidths,
        hc_list,
        cnames,
        data_dict,
        _args14 = arguments;
      return _regeneratorRuntime().wrap(function _callee14$(_context14) {
        while (1) switch (_context14.prev = _context14.next) {
          case 0:
            delete_in_all = _args14.length > 0 && _args14[0] !== undefined ? _args14[0] : false;
            fnames = _filteredColumnNames();
            cname = mState.selected_column;
            col_index = fnames.indexOf(cname);
            cwidths = _toConsumableArray(mState.table_spec.column_widths);
            cwidths.splice(col_index, 1);
            hc_list = _lodash["default"].without(mState.table_spec.hidden_columns_list, cname);
            cnames = _lodash["default"].without(mState.table_spec.column_names, cname);
            _updateTableSpec({
              column_names: cnames,
              hidden_columns_list: hc_list,
              column_widths: cwidths
            }, false);
            data_dict = {
              "column_name": cname,
              "doc_name": mState.table_spec.current_doc_name,
              "all_docs": delete_in_all
            };
            _context14.next = 12;
            return (0, _communication_react.postPromise)(props.main_id, "DeleteColumn", data_dict, props.main_id);
          case 12:
          case "end":
            return _context14.stop();
        }
      }, _callee14);
    }));
    return _deleteColumn2.apply(this, arguments);
  }
  function _addColumn() {
    return _addColumn2.apply(this, arguments);
  }
  function _addColumn2() {
    _addColumn2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee15() {
      var add_in_all,
        title,
        new_name,
        cwidth,
        data_dict,
        _args15 = arguments;
      return _regeneratorRuntime().wrap(function _callee15$(_context15) {
        while (1) switch (_context15.prev = _context15.next) {
          case 0:
            add_in_all = _args15.length > 0 && _args15[0] !== undefined ? _args15[0] : false;
            _context15.prev = 1;
            title = add_in_all ? "Create Column All Documents" : "Create Column This Document";
            _context15.next = 5;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: title,
              field_title: "New Column Name",
              default_value: "newcol",
              existing_names: mState.table_spec.column_names,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 5:
            new_name = _context15.sent;
            cwidth = (0, _blueprint_table.compute_added_column_width)(new_name);
            _updateTableSpec({
              column_names: [].concat(_toConsumableArray(mState.table_spec.column_names), [new_name]),
              column_widths: [].concat(_toConsumableArray(mState.table_spec.column_widths), [cwidth])
            }, false);
            data_dict = {
              "column_name": new_name,
              "doc_name": mState.table_spec.current_doc_name,
              "column_width": cwidth,
              "all_docs": add_in_all
            };
            _broadcast_event_to_server("CreateColumn", data_dict);
            _context15.next = 16;
            break;
          case 12:
            _context15.prev = 12;
            _context15.t0 = _context15["catch"](1);
            if (_context15.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error adding column", _context15.t0);
            }
            return _context15.abrupt("return");
          case 16:
          case "end":
            return _context15.stop();
        }
      }, _callee15, null, [[1, 12]]);
    }));
    return _addColumn2.apply(this, arguments);
  }
  function _setStateFromDataObject(data, doc_name) {
    var func = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    mDispatch({
      type: "change_multiple_fields",
      newPartialState: {
        data_row_dict: data.data_row_dict,
        total_rows: data.total_rows,
        table_spec: {
          column_names: data.table_spec.header_list,
          column_widths: data.table_spec.column_widths,
          hidden_columns_list: data.table_spec.hidden_columns_list,
          cell_backgrounds: data.table_spec.cell_backgrounds,
          current_doc_name: doc_name
        }
      }
    });
    pushCallback(func);
  }
  var _initiateDataGrab = (0, _react.useCallback)( /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(row_index) {
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _grabNewChunkWithRow(row_index);
          case 2:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return function (_x6) {
      return _ref2.apply(this, arguments);
    };
  }(), []);
  function _grabNewChunkWithRow(_x7) {
    return _grabNewChunkWithRow2.apply(this, arguments);
  }
  function _grabNewChunkWithRow2() {
    _grabNewChunkWithRow2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee16(row_index) {
      var data;
      return _regeneratorRuntime().wrap(function _callee16$(_context16) {
        while (1) switch (_context16.prev = _context16.next) {
          case 0:
            _context16.prev = 0;
            _context16.next = 3;
            return (0, _communication_react.postPromise)(props.main_id, "grab_chunk_by_row_index", {
              doc_name: mState.table_spec.current_doc_name,
              row_index: row_index
            }, props.main_id);
          case 3:
            data = _context16.sent;
            mDispatch({
              type: "update_data_row_dict",
              new_data_row_dict: data.data_row_dict
            });
            _context16.next = 10;
            break;
          case 7:
            _context16.prev = 7;
            _context16.t0 = _context16["catch"](0);
            errorDrawerFuncs.addFromError("Error grabbing data chunk", _context16.t0);
          case 10:
          case "end":
            return _context16.stop();
        }
      }, _callee16, null, [[0, 7]]);
    }));
    return _grabNewChunkWithRow2.apply(this, arguments);
  }
  function _removeCollection() {
    return _removeCollection2.apply(this, arguments);
  }
  function _removeCollection2() {
    _removeCollection2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee17() {
      var result_dict, data_object, table_spec;
      return _regeneratorRuntime().wrap(function _callee17$(_context17) {
        while (1) switch (_context17.prev = _context17.next) {
          case 0:
            _context17.prev = 0;
            result_dict = {
              "new_collection_name": null,
              "main_id": props.main_id
            };
            _context17.next = 4;
            return (0, _communication_react.postPromise)(props.main_id, "remove_collection_from_project", result_dict, props.main_id);
          case 4:
            data_object = _context17.sent;
            table_spec = {
              current_doc_name: ""
            };
            mDispatch({
              type: "change_multiple_fields",
              newPartialState: {
                doc_names: [],
                table_is_shrunk: true,
                short_collection_name: data_object.short_collection_name,
                doc_type: "none",
                table_spec: table_spec
              }
            });
            _context17.next = 12;
            break;
          case 9:
            _context17.prev = 9;
            _context17.t0 = _context17["catch"](0);
            errorDrawerFuncs.addFromError("Error removing collection", _context17.t0);
          case 12:
          case "end":
            return _context17.stop();
        }
      }, _callee17, null, [[0, 9]]);
    }));
    return _removeCollection2.apply(this, arguments);
  }
  function _changeCollection() {
    return _changeCollection2.apply(this, arguments);
  }
  function _changeCollection2() {
    _changeCollection2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee18() {
      var data, new_collection_name, result_dict, data_object, table_spec;
      return _regeneratorRuntime().wrap(function _callee18$(_context18) {
        while (1) switch (_context18.prev = _context18.next) {
          case 0:
            _context18.prev = 0;
            statusFuncs.startSpinner();
            _context18.next = 4;
            return (0, _communication_react.postPromise)("host", "get_collection_names", {
              "user_id": user_id
            }, props.main_id);
          case 4:
            data = _context18.sent;
            _context18.next = 7;
            return dialogFuncs.showModalPromise("SelectDialog", {
              title: "Select New Collection",
              select_label: "New Collection",
              cancel_text: "Cancel",
              submit_text: "Submit",
              option_list: data.collection_names,
              handleClose: dialogFuncs.hideModal
            });
          case 7:
            new_collection_name = _context18.sent;
            result_dict = {
              "new_collection_name": new_collection_name,
              "main_id": props.main_id
            };
            _context18.next = 11;
            return (0, _communication_react.postPromise)(props.main_id, "change_collection", result_dict, props.main_id);
          case 11:
            data_object = _context18.sent;
            if (!window.in_context && !_cProp("is_project")) document.title = new_collection_name;
            window._collection_name = data_object.collection_name;
            if (data_object.doc_type == "table") {
              table_spec = {
                column_names: data_object.table_spec.header_list,
                column_widths: data_object.table_spec.column_widths,
                cell_backgrounds: data_object.table_spec.cell_backgrounds,
                hidden_columns_list: data_object.table_spec.hidden_columns_list,
                current_doc_name: data_object.doc_names[0]
              };
            } else if (data_object.doc_type == "freeform") {
              table_spec = {
                current_doc_name: data_object.doc_names[0]
              };
            } else {
              table_spec = {
                current_doc_name: ""
              };
            }
            mDispatch({
              type: "change_multiple_fields",
              newPartialState: {
                doc_names: data_object.doc_names,
                table_is_shrunk: data_object.doc_type == "none",
                short_collection_name: data_object.short_collection_name,
                doc_type: data_object.doc_type,
                table_spec: table_spec
              }
            });
            pushCallback(function () {
              _handleChangeDoc(data_object.doc_names[0]);
            });
            statusFuncs.clearStatusMessage();
            statusFuncs.stopSpinner();
            _context18.next = 26;
            break;
          case 21:
            _context18.prev = 21;
            _context18.t0 = _context18["catch"](0);
            if (_context18.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error changing collection", _context18.t0);
            }
            statusFuncs.clearStatusMessage();
            statusFuncs.stopSpinner();
          case 26:
          case "end":
            return _context18.stop();
        }
      }, _callee18, null, [[0, 21]]);
    }));
    return _changeCollection2.apply(this, arguments);
  }
  function _updateDocList(doc_names, visible_doc) {
    _setMainStateValue("doc_names", doc_names);
    pushCallback( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _handleChangeDoc(visible_doc);
          case 2:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    })));
  }
  function showMetadata() {
    _setMainStateValue("show_metadata", true);
  }
  function hideMetadata() {
    _setMainStateValue("show_metadata", false);
  }
  function _setProjectName(new_project_name) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    if (props.controlled) {
      props.updatePanel({
        res_type: "project",
        title: new_project_name,
        panel: {
          resource_name: new_project_name,
          is_project: true
        }
      });
      pushCallback(function () {
        pushCallback(callback);
      });
    } else {
      mDispatch({
        type: "change_multiple_fields",
        newPartialState: {
          resource_name: new_project_name,
          is_project: true
        }
      });
      pushCallback(callback);
    }
  }
  var my_props = _objectSpread({}, props);
  if (!props.controlled) {
    my_props.is_project = mState.is_project;
    my_props.resource_name = mState.resource_name;
  }
  var disabled_column_items = [];
  if (mState.selected_column == null) {
    disabled_column_items = ["Shift Left", "Shift Right", "Hide", "Hide in All Docs", "Delete Column", "Delete Column In All Docs"];
  }
  var disabled_row_items = [];
  if (mState.selected_row == null) {
    disabled_row_items = ["Delete Row", "Insert Row Before", "Insert Row After", "Duplicate Row"];
  }
  var project_name = my_props.is_project ? props.resource_name : "";
  var disabled_project_items = [];
  if (!my_props.is_project) {
    disabled_project_items.push("Save");
  }
  if (mState.doc_type == "none") {
    disabled_project_items.push("Export Table as Collection");
    disabled_project_items.push("Remove Collection");
  }
  var menus = /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_main_menus_react.ProjectMenu, {
    main_id: props.main_id,
    project_name: project_name,
    is_notebook: props.is_notebook,
    is_juptyer: props.is_jupyter,
    setProjectName: _setProjectName,
    console_items: console_items_ref.current,
    tile_list: tile_list_ref.current,
    mState: mState,
    setMainStateValue: _setMainStateValue,
    updateLastSave: _updateLastSave,
    changeCollection: _changeCollection,
    removeCollection: _removeCollection,
    disabled_items: disabled_project_items,
    hidden_items: ["Export as Jupyter Notebook"]
  }), mState.doc_type != "none" && /*#__PURE__*/_react["default"].createElement(_main_menus_react.DocumentMenu, {
    main_id: props.main_id,
    documentNames: mState.doc_names,
    currentDoc: mState.table_spec.current_doc_name
  }), !isFreeform() && mState.doc_type != "none" && /*#__PURE__*/_react["default"].createElement(_main_menus_react.ColumnMenu, {
    main_id: props.main_id,
    project_name: project_name,
    is_notebook: props.is_notebook,
    is_juptyer: props.is_jupyter,
    moveColumn: _moveColumn,
    table_spec: mState.table_spec,
    filtered_column_names: _filteredColumnNames(),
    selected_column: mState.selected_column,
    disabled_items: disabled_column_items,
    hideColumn: _hideColumn,
    hideInAll: _hideColumnInAll,
    unhideAllColumns: _unhideAllColumns,
    addColumn: _addColumn,
    deleteColumn: _deleteColumn
  }), !isFreeform() && mState.doc_type != "none" && /*#__PURE__*/_react["default"].createElement(_main_menus_react.RowMenu, {
    main_id: props.main_id,
    project_name: project_name,
    is_notebook: props.is_notebook,
    is_juptyer: props.is_jupyter,
    deleteRow: _deleteRow,
    insertRowBefore: /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _insertRow(mState.selected_row);
          case 2:
          case "end":
            return _context4.stop();
        }
      }, _callee4);
    })),
    insertRowAfter: /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return _insertRow(mState.selected_row + 1);
          case 2:
          case "end":
            return _context5.stop();
        }
      }, _callee5);
    })),
    duplicateRow: _duplicateRow,
    selected_row: mState.selected_row,
    disabled_items: disabled_row_items
  }), /*#__PURE__*/_react["default"].createElement(_main_menus_react.ViewMenu, {
    main_id: props.main_id,
    project_name: project_name,
    is_notebook: props.is_notebook,
    is_juptyer: props.is_jupyter,
    table_is_shrunk: mState.table_is_shrunk,
    toggleTableShrink: mState.doc_type == "none" ? null : _toggleTableShrink,
    show_exports_pane: mState.show_exports_pane,
    show_console_pane: mState.show_console_pane,
    show_metadata: mState.show_metadata,
    setMainStateValue: _setMainStateValue
  }), /*#__PURE__*/_react["default"].createElement(_core.NavbarDivider, null), create_tile_menus());
  var card_body;
  var card_header;
  if (mState.doc_type != "none") {
    card_header = /*#__PURE__*/_react["default"].createElement(_table_react.MainTableCardHeader, {
      main_id: props.main_id,
      toggleShrink: mState.doc_type == "none" ? null : _toggleTableShrink,
      mState: mState,
      setMainStateValue: _setMainStateValue,
      handleChangeDoc: _handleChangeDoc,
      handleSearchFieldChange: _handleSearchFieldChange,
      show_filter_button: !isFreeform(),
      handleSpreadsheetModeChange: _handleSpreadsheetModeChange,
      handleSoftWrapChange: _handleSoftWrapChange,
      is_freeform: isFreeform()
    });
    if (isFreeform()) {
      card_body = /*#__PURE__*/_react["default"].createElement(_table_react.FreeformBody, {
        main_id: props.main_id,
        mState: mState,
        setMainStateValue: _setMainStateValue
      });
    } else {
      card_body = /*#__PURE__*/_react["default"].createElement(_blueprint_table.BlueprintTable, {
        main_id: props.main_id,
        clearScroll: _clearTableScroll,
        initiateDataGrab: _initiateDataGrab,
        setCellContent: _setCellContent,
        filtered_column_names: _filteredColumnNames(),
        moveColumn: _moveColumn,
        updateTableSpec: _updateTableSpec,
        setMainStateValue: _setMainStateValue,
        mState: mState,
        set_scroll: set_table_scroll
      });
    }
  }
  var tile_pane = /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_tile_react.TileContainer, {
    main_id: props.main_id,
    tsocket: props.tsocket,
    tile_list: tile_list_ref,
    current_doc_name: mState.table_spec.current_doc_name,
    selected_row: mState.selected_row,
    table_is_shrunk: mState.table_is_shrunk,
    broadcast_event: _broadcast_event_to_server,
    goToModule: props.goToModule,
    tileDispatch: tileDispatch,
    setMainStateValue: _setMainStateValue
  }));
  var exports_pane;
  if (mState.show_exports_pane) {
    exports_pane = /*#__PURE__*/_react["default"].createElement(_export_viewer_react.ExportsViewer, {
      main_id: props.main_id,
      tsocket: props.tsocket,
      setUpdate: function setUpdate(ufunc) {
        updateExportsList.current = ufunc;
      },
      setMainStateValue: _setMainStateValue,
      console_is_shrunk: mState.console_is_shrunk,
      console_is_zoomed: mState.console_is_zoomed
    });
  } else {
    exports_pane = /*#__PURE__*/_react["default"].createElement("div", null);
  }
  var console_pane;
  if (mState.show_console_pane) {
    console_pane = /*#__PURE__*/_react["default"].createElement(_console_component.ConsoleComponent, {
      main_id: props.main_id,
      tsocket: props.tsocket,
      handleCreateViewer: props.handleCreateViewer,
      controlled: props.controlled,
      console_items: console_items_ref,
      console_selected_items_ref: console_selected_items_ref,
      set_console_selected_items: set_console_selected_items,
      dispatch: dispatch,
      mState: mState,
      setMainStateValue: _setMainStateValue,
      zoomable: true,
      shrinkable: true,
      style: null
    });
  } else {
    console_pane = /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        width: "100%"
      }
    });
  }
  var outer_hp_style = null;
  if (mState.console_is_shrunk) {
    outer_hp_style = {
      marginTop: TABLE_CONSOLE_GAP
    };
  }
  var bottom_pane = /*#__PURE__*/_react["default"].createElement(_resizing_layouts.HorizontalPanes, {
    left_pane: console_pane,
    right_pane: exports_pane,
    show_handle: true,
    fixed_height: mState.console_is_shrunk,
    initial_width_fraction: mState.console_width_fraction,
    dragIconSize: 15,
    outer_style: outer_hp_style,
    handleSplitUpdate: _handleConsoleFractionChange
  });
  var table_pane;
  if (mState.doc_type != "none") {
    table_pane = /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
      ref: table_container_ref
    }, /*#__PURE__*/_react["default"].createElement(_table_react.MainTableCard, {
      card_body: card_body,
      card_header: card_header
    })));
  }
  var top_pane;
  if (mState.table_is_shrunk) {
    top_pane = /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        paddingLeft: 10
      }
    }, tile_pane), mState.console_is_shrunk && bottom_pane);
  } else {
    top_pane = /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_resizing_layouts.HorizontalPanes, {
      left_pane: table_pane,
      right_pane: tile_pane,
      show_handle: true,
      scrollAdjustSelectors: [".bp5-table-quadrant-scroll-container", ".tile-div"],
      initial_width_fraction: mState.horizontal_fraction,
      dragIconSize: 15,
      handleSplitUpdate: _handleHorizontalFractionChange,
      handleResizeStart: _handleResizeStart,
      handleResizeEnd: _handleResizeEnd
    }));
  }
  var extra_menubar_buttons = [];
  if (mState.doc_type != "none") {
    extra_menubar_buttons = [{
      onClick: _toggleTableShrink,
      icon: mState.table_is_shrunk ? "th" : "th-disconnect"
    }];
  }
  return /*#__PURE__*/_react["default"].createElement(_error_boundary.ErrorBoundary, null, !window.in_context && /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    user_name: window.username,
    menus: null,
    page_id: props.main_id
  }), /*#__PURE__*/_react["default"].createElement(_menu_utilities.TacticMenubar, {
    connection_status: connection_status,
    menus: menus,
    showRefresh: true,
    showClose: true,
    refreshTab: props.refreshTab,
    closeTab: props.closeTab,
    resource_name: _cProp("resource_name"),
    showIconBar: true,
    showErrorDrawerButton: true,
    showMetadataDrawerButton: true,
    showAssistantDrawerButton: true,
    showSettingsDrawerButton: true,
    showMetadata: showMetadata,
    extraButtons: extra_menubar_buttons
  }), /*#__PURE__*/_react["default"].createElement(_error_boundary.ErrorBoundary, null, /*#__PURE__*/_react["default"].createElement("div", {
    className: "main-outer ".concat(settingsContext.isDark() ? "bp5-dark" : "light-theme"),
    ref: main_outer_ref,
    style: {
      width: "100%",
      height: usable_height
    }
  }, mState.console_is_zoomed && /*#__PURE__*/_react["default"].createElement(_sizing_tools.SizeContext.Provider, {
    value: {
      availableWidth: usable_width,
      availableHeight: usable_height - BOTTOM_MARGIN,
      topX: topX,
      topY: topY
    }
  }, /*#__PURE__*/_react["default"].createElement(_resizing_layouts.HorizontalPanes, {
    left_pane: console_pane,
    right_pane: exports_pane,
    show_handle: true,
    fixed_height: mState.console_is_shrunk,
    initial_width_fraction: mState.console_width_fraction,
    dragIconSize: 15,
    outer_style: outer_hp_style,
    handleSplitUpdate: _handleConsoleFractionChange
  })), !mState.console_is_zoomed && mState.console_is_shrunk && /*#__PURE__*/_react["default"].createElement(_sizing_tools.SizeContext.Provider, {
    value: {
      availableWidth: usable_width,
      availableHeight: usable_height - CONSOLE_HEADER_HEIGHT - BOTTOM_MARGIN - 20,
      topX: topX,
      topY: topY
    }
  }, top_pane, /*#__PURE__*/_react["default"].createElement(_sizing_tools.SizeContext.Provider, {
    value: {
      topX: topX,
      topY: topY,
      availableWidth: usable_width,
      availableHeight: CONSOLE_HEADER_HEIGHT
    }
  }, bottom_pane)), !mState.console_is_zoomed && !mState.console_is_shrunk && /*#__PURE__*/_react["default"].createElement(_sizing_tools.SizeContext.Provider, {
    value: {
      availableWidth: usable_width,
      availableHeight: usable_height - BOTTOM_MARGIN,
      topX: topX,
      topY: topY
    }
  }, /*#__PURE__*/_react["default"].createElement(_resizing_layouts.VerticalPanes, {
    top_pane: top_pane,
    bottom_pane: bottom_pane,
    show_handle: true,
    initial_height_fraction: mState.height_fraction,
    dragIconSize: 15,
    scrollAdjustSelectors: [".bp5-table-quadrant-scroll-container", ".tile-div"],
    handleSplitUpdate: _handleVerticalSplitUpdate,
    handleResizeStart: _handleResizeStart,
    handleResizeEnd: _handleResizeEnd,
    overflow: "hidden"
  }))), /*#__PURE__*/_react["default"].createElement(_metadata_drawer.MetadataDrawer, {
    res_type: "project",
    res_name: _cProp("resource_name"),
    tsocket: props.tsocket,
    readOnly: false,
    is_repository: false,
    show_drawer: mState.show_metadata,
    position: "right",
    onClose: hideMetadata,
    size: "45%"
  })));
}
exports.MainApp = MainApp = /*#__PURE__*/(0, _react.memo)(MainApp);
function main_main() {
  function gotProps(the_props) {
    var MainAppPlus = (0, _pool_tree.withPool)((0, _sizing_tools.withSizeContext)((0, _settings.withSettings)((0, _modal_react.withDialogs)((0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)((0, _assistant.withAssistant)(MainApp)))))));
    var the_element = /*#__PURE__*/_react["default"].createElement(MainAppPlus, _extends({}, the_props, {
      controlled: false,
      changeName: null
    }));
    var domContainer = document.querySelector('#main-root');
    var root = (0, _client.createRoot)(domContainer);
    root.render(
    // <HotkeysProvider>
    the_element
    // </HotkeysProvider>
    );
  }
  (0, _utilities_react.renderSpinnerMessage)("Starting up ...");
  var target;
  if (window.project_name == "") {
    if (window.collection_name == "") {
      target = "new_project_in_context";
    } else {
      target = "main_collection_in_context";
    }
  } else {
    target = "main_project_in_context";
  }
  var resource_name = window.project_name == "" ? window.collection_name : window.project_name;
  (0, _communication_react.postAjaxPromise)(target, {
    "resource_name": resource_name
  }).then(function (data) {
    (0, _main_support.main_props)(data, null, gotProps, null);
  });
}
if (!window.in_context) {
  main_main();
}
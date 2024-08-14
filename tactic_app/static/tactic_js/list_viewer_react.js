"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListViewerApp = ListViewerApp;
exports.list_viewer_props = list_viewer_props;
require("../tactic_css/tactic.scss");
var _react = _interopRequireWildcard(require("react"));
var _client = require("react-dom/client");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
var _resource_viewer_react_app = require("./resource_viewer_react_app");
var _tactic_socket = require("./tactic_socket");
var _communication_react = require("./communication_react");
var _toaster = require("./toaster.js");
var _assistant = require("./assistant");
var _settings = require("./settings");
var _error_drawer = require("./error_drawer.js");
var _utilities_react = require("./utilities_react");
var _blueprint_navbar = require("./blueprint_navbar");
var _modal_react = require("./modal_react");
var _toaster2 = require("./toaster");
var _sizing_tools = require("./sizing_tools");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function list_viewer_props(data, registerDirtyMethod, finalCallback) {
  var resource_viewer_id = (0, _utilities_react.guid)();
  if (!window.in_context) {
    window.main_id = resource_viewer_id;
  }
  var tsocket = new _tactic_socket.TacticSocket("main", 5000, "list_viewer", resource_viewer_id);
  finalCallback({
    resource_viewer_id: resource_viewer_id,
    main_id: resource_viewer_id,
    tsocket: tsocket,
    split_tags: data.mdata.tags == "" ? [] : data.mdata.tags.split(" "),
    created: data.mdata.datestring,
    resource_name: data.resource_name,
    the_content: data.the_content,
    notes: data.mdata.notes,
    readOnly: data.read_only,
    is_repository: data.is_repository,
    registerDirtyMethod: registerDirtyMethod
  });
}
var LIST_PADDING_TOP = 20;
function ListEditor(props) {
  var top_ref = (0, _react.useRef)(null);
  var _useSize = (0, _sizing_tools.useSize)(top_ref, 0, "ListEditor"),
    _useSize2 = _slicedToArray(_useSize, 4),
    usable_width = _useSize2[0],
    usable_height = _useSize2[1],
    topX = _useSize2[2],
    topY = _useSize2[3];
  var tastyle = {
    resize: "horizontal",
    margin: 2,
    height: usable_height - LIST_PADDING_TOP - 4
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    id: "listarea-container",
    ref: top_ref,
    style: {
      margin: 2,
      paddingTop: LIST_PADDING_TOP
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.TextArea, {
    cols: "50",
    style: tastyle,
    disabled: props.readOnly,
    onChange: props.handleChange,
    value: props.the_content
  }));
}
ListEditor = /*#__PURE__*/(0, _react.memo)(ListEditor);
ListEditor.propTypes = {
  the_content: _propTypes["default"].string,
  handleChange: _propTypes["default"].func,
  readOnly: _propTypes["default"].bool,
  height: _propTypes["default"].number
};
function ListViewerApp(props) {
  props = _objectSpread({
    controlled: false,
    changeResourceName: null,
    updatePanel: null,
    refreshTab: null,
    closeTab: null
  }, props);
  var top_ref = (0, _react.useRef)(null);
  var search_ref = (0, _react.useRef)(null);
  var savedContent = (0, _react.useRef)(props.the_content);
  var savedTags = (0, _react.useRef)(props.split_tags);
  var savedNotes = (0, _react.useRef)(props.notes);
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)(props.the_content),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    list_content = _useStateAndRef2[0],
    set_list_content = _useStateAndRef2[1],
    list_content_ref = _useStateAndRef2[2];
  var _useStateAndRef3 = (0, _utilities_react.useStateAndRef)(props.notes),
    _useStateAndRef4 = _slicedToArray(_useStateAndRef3, 3),
    notes = _useStateAndRef4[0],
    set_notes = _useStateAndRef4[1],
    notes_ref = _useStateAndRef4[2];
  var _useStateAndRef5 = (0, _utilities_react.useStateAndRef)(props.split_tags),
    _useStateAndRef6 = _slicedToArray(_useStateAndRef5, 3),
    tags = _useStateAndRef6[0],
    set_tags = _useStateAndRef6[1],
    tags_ref = _useStateAndRef6[2];
  var _useSize3 = (0, _sizing_tools.useSize)(top_ref, 0, "ListViewer"),
    _useSize4 = _slicedToArray(_useSize3, 4),
    usable_width = _useSize4[0],
    usable_height = _useSize4[1],
    topX = _useSize4[2],
    topY = _useSize4[3];
  var _useState = (0, _react.useState)(props.resource_name),
    _useState2 = _slicedToArray(_useState, 2),
    resource_name = _useState2[0],
    set_resource_name = _useState2[1];
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  var statusFuncs = (0, _react.useContext)(_toaster2.StatusContext);
  var selectedPane = (0, _react.useContext)(_utilities_react.SelectedPaneContext);
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  var sizeInfo = (0, _react.useContext)(_sizing_tools.SizeContext);
  (0, _react.useEffect)(function () {
    statusFuncs.stopSpinner();
    if (props.controlled) {
      props.registerDirtyMethod(_dirty);
    }
  }, []);
  var pushCallback = (0, _utilities_react.useCallbackStack)("code_viewer");
  var hotkeys = (0, _react.useMemo)(function () {
    return [{
      combo: "Ctrl+S",
      global: false,
      group: "Module Viewer",
      label: "Save Code",
      onKeyDown: _saveMe
    }];
  }, [_saveMe]);
  var _useHotkeys = (0, _core.useHotkeys)(hotkeys),
    handleKeyDown = _useHotkeys.handleKeyDown,
    handleKeyUp = _useHotkeys.handleKeyUp;
  (0, _utilities_react.useConstructor)(function () {
    if (!props.controlled) {
      window.addEventListener("beforeunload", function (e) {
        if (_dirty()) {
          e.preventDefault();
          e.returnValue = '';
        }
      });
    }
  });
  function cPropGetters() {
    return {
      resource_name: resource_name
    };
  }
  function _cProp(pname) {
    return props.controlled ? props[pname] : cPropGetters()[pname];
  }
  function menu_specs() {
    var ms;
    if (props.is_repository) {
      ms = {
        Transfer: [{
          "name_text": "Copy to library",
          "icon_name": "import",
          "click_handler": function () {
            var _click_handler = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
              return _regeneratorRuntime().wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return (0, _resource_viewer_react_app.copyToLibrary)("list", _cProp("resource_name"), dialogFuncs, statusFuncs, errorDrawerFuncs);
                  case 2:
                  case "end":
                    return _context.stop();
                }
              }, _callee);
            }));
            function click_handler() {
              return _click_handler.apply(this, arguments);
            }
            return click_handler;
          }(),
          tooltip: "Copy to library"
        }]
      };
    } else {
      ms = {
        Save: [{
          name_text: "Save",
          icon_name: "saved",
          click_handler: _saveMe,
          key_bindings: ['Ctrl+S'],
          tooltip: "Save"
        }, {
          name_text: "Save As...",
          icon_name: "floppy-disk",
          click_handler: _saveMeAs,
          tooltip: "Save as"
        }],
        Transfer: [{
          name_text: "Share",
          icon_name: "share",
          click_handler: function () {
            var _click_handler2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
              return _regeneratorRuntime().wrap(function _callee2$(_context2) {
                while (1) switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return (0, _resource_viewer_react_app.sendToRepository)("list", _cProp("resource_name"), dialogFuncs, statusFuncs, errorDrawerFuncs);
                  case 2:
                  case "end":
                    return _context2.stop();
                }
              }, _callee2);
            }));
            function click_handler() {
              return _click_handler2.apply(this, arguments);
            }
            return click_handler;
          }(),
          tooltip: "Share to repository"
        }]
      };
    }
    for (var _i = 0, _Object$entries = Object.entries(ms); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        menu_name = _Object$entries$_i[0],
        menu = _Object$entries$_i[1];
      var _iterator = _createForOfIteratorHelper(menu),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var but = _step.value;
          but.click_handler = but.click_handler.bind(this);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
    return ms;
  }
  function _setResourceNameState(new_name) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    if (props.controlled) {
      props.changeResourceName(new_name, callback);
    } else {
      set_resource_name(new_name);
      pushCallback(callback);
    }
  }
  function _handleMetadataChange(_x) {
    return _handleMetadataChange2.apply(this, arguments);
  }
  function _handleMetadataChange2() {
    _handleMetadataChange2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(state_stuff) {
      var field, result_dict;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            _context3.t0 = _regeneratorRuntime().keys(state_stuff);
          case 1:
            if ((_context3.t1 = _context3.t0()).done) {
              _context3.next = 12;
              break;
            }
            field = _context3.t1.value;
            _context3.t2 = field;
            _context3.next = _context3.t2 === "tags" ? 6 : _context3.t2 === "notes" ? 8 : 10;
            break;
          case 6:
            set_tags(state_stuff[field]);
            return _context3.abrupt("break", 10);
          case 8:
            set_notes(state_stuff[field]);
            return _context3.abrupt("break", 10);
          case 10:
            _context3.next = 1;
            break;
          case 12:
            result_dict = {
              "res_type": "list",
              "res_name": _cProp("resource_name"),
              "tags": "tags" in state_stuff ? state_stuff["tags"].join(" ") : tags,
              "notes": "notes" in state_stuff ? state_stuff["notes"] : notes
            };
            _context3.prev = 13;
            _context3.next = 16;
            return (0, _communication_react.postAjaxPromise)("save_metadata", result_dict);
          case 16:
            _context3.next = 21;
            break;
          case 18:
            _context3.prev = 18;
            _context3.t3 = _context3["catch"](13);
            console.log("error saving metadata ", _context3.t3);
          case 21:
          case "end":
            return _context3.stop();
        }
      }, _callee3, null, [[13, 18]]);
    }));
    return _handleMetadataChange2.apply(this, arguments);
  }
  function _handleListChange(event) {
    set_list_content(event.target.value);
  }
  function am_selected() {
    return selectedPane.amSelected(selectedPane.tab_id, selectedPane.selectedTabIdRef);
  }
  function _saveMe() {
    return _saveMe2.apply(this, arguments);
  }
  function _saveMe2() {
    _saveMe2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
      var new_list_as_string, tagstring, local_notes, local_tags, result_dict, _data;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            if (am_selected()) {
              _context4.next = 2;
              break;
            }
            return _context4.abrupt("return", false);
          case 2:
            new_list_as_string = list_content;
            tagstring = tags.join(" ");
            local_notes = notes;
            local_tags = tags; // In case it's modified wile saving
            result_dict = {
              "list_name": _cProp("resource_name"),
              "new_list_as_string": new_list_as_string,
              "tags": tagstring,
              "notes": notes
            };
            _context4.prev = 7;
            _context4.next = 10;
            return (0, _communication_react.postAjaxPromise)("update_list", result_dict);
          case 10:
            _data = _context4.sent;
            savedContent.current = new_list_as_string;
            savedTags.current = local_tags;
            savedNotes.current = local_notes;
            statusFuncs.statusMessage("Saved list ".concat(result_dict.list_name));
            _context4.next = 20;
            break;
          case 17:
            _context4.prev = 17;
            _context4.t0 = _context4["catch"](7);
            errorDrawerFuncs.addErrorDrawerEntry({
              title: "Error creating new notebook",
              content: "message" in data ? data.message : ""
            });
          case 20:
          case "end":
            return _context4.stop();
        }
      }, _callee4, null, [[7, 17]]);
    }));
    return _saveMe2.apply(this, arguments);
  }
  function _saveMeAs(_x2) {
    return _saveMeAs2.apply(this, arguments);
  }
  function _saveMeAs2() {
    _saveMeAs2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(e) {
      var ln_result, new_name, result_dict, _data2;
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            if (am_selected()) {
              _context5.next = 2;
              break;
            }
            return _context5.abrupt("return", false);
          case 2:
            _context5.prev = 2;
            _context5.next = 5;
            return (0, _communication_react.postPromise)("host", "get_list_names", {
              "user_id": window.user_id
            }, props.main_id);
          case 5:
            ln_result = _context5.sent;
            _context5.next = 8;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Save List As",
              field_title: "New List Name",
              default_value: "NewList",
              existing_names: ln_result.list_names,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 8:
            new_name = _context5.sent;
            result_dict = {
              "new_res_name": new_name,
              "res_to_copy": _cProp("resource_name")
            };
            _context5.next = 12;
            return (0, _communication_react.postAjaxPromise)('/create_duplicate_list', result_dict);
          case 12:
            _data2 = _context5.sent;
            _setResourceNameState(new_name, function () {
              _saveMe();
            });
            _context5.next = 19;
            break;
          case 16:
            _context5.prev = 16;
            _context5.t0 = _context5["catch"](2);
            if (_context5.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error saving listy", _context5.t0);
            }
          case 19:
          case "end":
            return _context5.stop();
        }
      }, _callee5, null, [[2, 16]]);
    }));
    return _saveMeAs2.apply(this, arguments);
  }
  function _dirty() {
    return !(list_content_ref.current == savedContent.current && tags_ref.current == savedTags.current && notes_ref.current == savedNotes.current);
  }
  var my_props = _objectSpread({}, props);
  var outer_style = {
    width: "100%",
    height: sizeInfo.availableHeight,
    paddingLeft: 0,
    position: "relative"
  };
  var outer_class = "resource-viewer-holder";
  if (!props.controlled) {
    my_props.resource_name = resource_name;
    if (settingsContext.isDark()) {
      outer_class = outer_class + " bp5-dark";
    } else {
      outer_class = outer_class + " light-theme";
    }
  }
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, !props.controlled && /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    selected: null,
    show_api_links: true,
    page_id: props.resource_viewer_id,
    user_name: window.username
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: outer_class,
    ref: top_ref,
    style: outer_style,
    tabIndex: "0",
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp
  }, /*#__PURE__*/_react["default"].createElement(_resource_viewer_react_app.ResourceViewerApp, _extends({}, my_props, {
    resource_viewer_id: props.resource_viewer_id,
    setResourceNameState: _setResourceNameState,
    refreshTab: props.refreshTab,
    closeTab: props.closeTab,
    res_type: "list",
    resource_name: my_props.resource_name,
    menu_specs: menu_specs(),
    handleStateChange: _handleMetadataChange,
    created: props.created,
    notes: notes,
    tags: tags,
    showErrorDrawerButton: false,
    saveMe: _saveMe
  }), /*#__PURE__*/_react["default"].createElement(ListEditor, {
    the_content: list_content,
    readOnly: props.readOnly,
    handleChange: _handleListChange
  }))));
}
exports.ListViewerApp = ListViewerApp = /*#__PURE__*/(0, _react.memo)(ListViewerApp);
function list_viewer_main() {
  return _list_viewer_main.apply(this, arguments);
}
function _list_viewer_main() {
  _list_viewer_main = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
    var gotProps, target, data;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          gotProps = function _gotProps(the_props) {
            var ListViewerAppPlus = (0, _sizing_tools.withSizeContext)((0, _settings.withSettings)((0, _modal_react.withDialogs)((0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)((0, _assistant.withAssistant)(ListViewerApp))))));
            var the_element = /*#__PURE__*/_react["default"].createElement(ListViewerAppPlus, _extends({}, the_props, {
              controlled: false,
              changeName: null
            }));
            var domContainer = document.querySelector('#root');
            var root = (0, _client.createRoot)(domContainer);
            root.render(
            // <HotkeysProvider>
            the_element
            // </HotkeysProvider>
            );
          };
          target = window.is_repository ? "repository_view_list_in_context" : "view_list_in_context";
          _context6.next = 4;
          return (0, _communication_react.postAjaxPromise)(target, {
            "resource_name": window.resource_name
          });
        case 4:
          data = _context6.sent;
          list_viewer_props(data, null, gotProps);
        case 6:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return _list_viewer_main.apply(this, arguments);
}
if (!window.in_context) {
  list_viewer_main().then();
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModuleViewerApp = ModuleViewerApp;
exports.module_viewer_props = module_viewer_props;
require("../tactic_css/tactic.scss");
var _react = _interopRequireWildcard(require("react"));
var _client = require("react-dom/client");
var _core = require("@blueprintjs/core");
var _resource_viewer_react_app = require("./resource_viewer_react_app");
var _tactic_socket = require("./tactic_socket");
var _reactCodemirror = require("./react-codemirror6");
var _communication_react = require("./communication_react");
var _error_drawer = require("./error_drawer");
var _toaster = require("./toaster");
var _assistant = require("./assistant");
var _sizing_tools = require("./sizing_tools");
var _utilities_react = require("./utilities_react");
var _blueprint_navbar = require("./blueprint_navbar");
var _settings = require("./settings");
var _modal_react = require("./modal_react");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
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
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function module_viewer_props(data, registerDirtyMethod, finalCallback) {
  var resource_viewer_id = (0, _utilities_react.guid)();
  if (!window.in_context) {
    window.main_id = resource_viewer_id;
  }
  var tsocket = new _tactic_socket.TacticSocket("main", 5000, "module_viewer", resource_viewer_id);
  finalCallback({
    resource_viewer_id: resource_viewer_id,
    main_id: resource_viewer_id,
    tsocket: tsocket,
    split_tags: data.mdata.tags == "" ? [] : data.mdata.tags.split(" "),
    created: data.mdata.datestring,
    resource_name: data.resource_name,
    the_content: data.the_content,
    notes: data.mdata.notes,
    icon: data.mdata.additional_mdata.icon,
    readOnly: data.read_only,
    is_repository: data.is_repository,
    registerDirtyMethod: registerDirtyMethod
  });
}
function ModuleViewerApp(props) {
  props = _objectSpread({
    controlled: false,
    changeResourceName: null,
    refreshTab: null,
    closeTab: null,
    updatePanel: null
  }, props);
  var top_ref = (0, _react.useRef)(null);
  var search_ref = (0, _react.useRef)(null);
  var savedContent = (0, _react.useRef)(props.the_content);
  var savedTags = (0, _react.useRef)(props.split_tags);
  var savedNotes = (0, _react.useRef)(props.notes);
  var savedIcon = (0, _react.useRef)(props.icon);
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)(props.the_content),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    code_content = _useStateAndRef2[0],
    set_code_content = _useStateAndRef2[1],
    code_content_ref = _useStateAndRef2[2];
  var _useStateAndRef3 = (0, _utilities_react.useStateAndRef)(null),
    _useStateAndRef4 = _slicedToArray(_useStateAndRef3, 3),
    current_search_number = _useStateAndRef4[0],
    set_current_search_number = _useStateAndRef4[1],
    current_search_number_ref = _useStateAndRef4[2];
  var _useStateAndRef5 = (0, _utilities_react.useStateAndRef)(props.notes),
    _useStateAndRef6 = _slicedToArray(_useStateAndRef5, 3),
    notes = _useStateAndRef6[0],
    set_notes = _useStateAndRef6[1],
    notes_ref = _useStateAndRef6[2];
  var _useStateAndRef7 = (0, _utilities_react.useStateAndRef)(props.split_tags),
    _useStateAndRef8 = _slicedToArray(_useStateAndRef7, 3),
    tags = _useStateAndRef8[0],
    set_tags = _useStateAndRef8[1],
    tags_ref = _useStateAndRef8[2];
  var _useStateAndRef9 = (0, _utilities_react.useStateAndRef)(props.icon),
    _useStateAndRef10 = _slicedToArray(_useStateAndRef9, 3),
    icon = _useStateAndRef10[0],
    set_icon = _useStateAndRef10[1],
    icon_ref = _useStateAndRef10[2];
  var _useState = (0, _react.useState)(""),
    _useState2 = _slicedToArray(_useState, 2),
    search_string = _useState2[0],
    set_search_string = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = _slicedToArray(_useState3, 2),
    regex = _useState4[0],
    set_regex = _useState4[1];
  var _useStateAndRef11 = (0, _utilities_react.useStateAndRef)(null),
    _useStateAndRef12 = _slicedToArray(_useStateAndRef11, 3),
    search_matches = _useStateAndRef12[0],
    set_search_matches = _useStateAndRef12[1],
    search_matches_ref = _useStateAndRef12[2];
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  var statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  var sizeInfo = (0, _react.useContext)(_sizing_tools.SizeContext);
  var _useState5 = (0, _react.useState)(props.resource_name),
    _useState6 = _slicedToArray(_useState5, 2),
    resource_name = _useState6[0],
    set_resource_name = _useState6[1];
  var selectedPane = (0, _react.useContext)(_utilities_react.SelectedPaneContext);
  var _useSize = (0, _sizing_tools.useSize)(top_ref, 0, "ModuleViewer"),
    _useSize2 = _slicedToArray(_useSize, 4),
    usable_width = _useSize2[0],
    usable_height = _useSize2[1],
    topX = _useSize2[2],
    topY = _useSize2[3];
  (0, _react.useEffect)(function () {
    statusFuncs.stopSpinner();
    if (props.controlled) {
      props.registerDirtyMethod(_dirty);
    }
  }, []);
  var pushCallback = (0, _utilities_react.useCallbackStack)("module_viewer");
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
  function _update_search_state(nstate) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    set_current_search_number(0);
    for (var field in nstate) {
      switch (field) {
        case "regex":
          set_regex(nstate[field]);
          break;
        case "search_string":
          set_search_string(nstate[field]);
          break;
      }
    }
  }
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
                    return (0, _resource_viewer_react_app.copyToLibrary)("tile", _cProp("resource_name"), dialogFuncs, statusFuncs, errorDrawerFuncs);
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
          "name_text": "Save",
          "icon_name": "saved",
          "click_handler": _saveMe,
          key_bindings: ['Ctrl+S'],
          tooltip: "Save"
        }, {
          "name_text": "Save As...",
          "icon_name": "floppy-disk",
          "click_handler": _saveModuleAs,
          tooltip: "Save as"
        }, {
          "name_text": "Save and Checkpoint",
          "icon_name": "map-marker",
          "click_handler": _saveAndCheckpoint,
          key_bindings: ['Ctrl+M'],
          tooltip: "Save and checkpoint"
        }],
        Load: [{
          "name_text": "Save and Load",
          "icon_name": "upload",
          "click_handler": _saveAndLoadModule,
          key_bindings: ['Ctrl+L'],
          tooltip: "Save and load module"
        }, {
          "name_text": "Load",
          "icon_name": "upload",
          "click_handler": _loadModule,
          tooltip: "Load tile"
        }],
        Compare: [{
          "name_text": "View History",
          "icon_name": "history",
          "click_handler": _showHistoryViewer,
          tooltip: "Show history viewer"
        }, {
          "name_text": "Compare to Other Modules",
          "icon_name": "comparison",
          "click_handler": _showTileDiffer,
          tooltip: "Compare to another tile"
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
    return ms;
  }
  function _handleCodeChange(new_code) {
    set_code_content(new_code);
  }
  function _handleMetadataChange(_x) {
    return _handleMetadataChange2.apply(this, arguments);
  }
  function _handleMetadataChange2() {
    _handleMetadataChange2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(state_stuff) {
      var field, result_dict;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            _context4.t0 = _regeneratorRuntime().keys(state_stuff);
          case 1:
            if ((_context4.t1 = _context4.t0()).done) {
              _context4.next = 14;
              break;
            }
            field = _context4.t1.value;
            _context4.t2 = field;
            _context4.next = _context4.t2 === "tags" ? 6 : _context4.t2 === "notes" ? 8 : _context4.t2 === "icon" ? 10 : 12;
            break;
          case 6:
            set_tags(state_stuff[field]);
            return _context4.abrupt("break", 12);
          case 8:
            set_notes(state_stuff[field]);
            return _context4.abrupt("break", 12);
          case 10:
            set_icon(state_stuff[field]);
            return _context4.abrupt("break", 12);
          case 12:
            _context4.next = 1;
            break;
          case 14:
            result_dict = {
              "res_type": "tile",
              "res_name": _cProp("resource_name"),
              "tags": "tags" in state_stuff ? state_stuff["tags"].join(" ") : tags,
              "notes": "notes" in state_stuff ? state_stuff["notes"] : notes,
              "icon": "icon" in state_stuff ? state_stuff["icon"] : icon
            };
            _context4.prev = 15;
            _context4.next = 18;
            return (0, _communication_react.postAjaxPromise)("save_metadata", result_dict);
          case 18:
            _context4.next = 23;
            break;
          case 20:
            _context4.prev = 20;
            _context4.t3 = _context4["catch"](15);
            console.log("error saving metadata ", _context4.t3);
          case 23:
          case "end":
            return _context4.stop();
        }
      }, _callee4, null, [[15, 20]]);
    }));
    return _handleMetadataChange2.apply(this, arguments);
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
  function handleResult(data, success_message, failure_tiltle) {
    if (!data.success) {
      errorDrawerFuncs.addErrorDrawerEntry({
        title: failur_title,
        content: "message" in data ? data.message : ""
      });
    } else {
      statusFuncs.statusMessage(success_message);
    }
    statusFuncs.stopSpinner();
    statusFuncs.clearStatusMessage();
  }
  function _extraKeys() {
    var ekeys = {
      'Ctrl-s': _saveMe,
      'Ctrl-l': _saveAndLoadModule,
      'Ctrl-m': _saveAndCheckpoint,
      'Ctrl-f': function CtrlF() {
        search_ref.current.focus();
      },
      'Cmd-f': function CmdF() {
        search_ref.current.focus();
      }
    };
    var convertedKeys = (0, _utilities_react.convertExtraKeys)(ekeys);
    var moreKeys = [{
      key: 'Ctrl-g',
      run: function run() {
        _searchNext();
      },
      preventDefault: true
    }, {
      key: 'Cmd-g',
      run: function run() {
        _searchNext();
      },
      preventDefault: true
    }, {
      key: 'Ctrl-Shift-g',
      run: function run() {
        _searchPrev();
      },
      preventDefault: true
    }, {
      key: 'Cmd-Shift-g',
      run: function run() {
        _searchPrev();
      },
      preventDefault: true
    }];
    return [].concat(_toConsumableArray(convertedKeys), moreKeys);
  }
  function am_selected() {
    return selectedPane.amSelected(selectedPane.tab_id, selectedPane.selectedTabIdRef);
  }
  function _saveMe() {
    return _saveMe2.apply(this, arguments);
  }
  function _saveMe2() {
    _saveMe2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            if (am_selected()) {
              _context5.next = 2;
              break;
            }
            return _context5.abrupt("return", false);
          case 2:
            statusFuncs.startSpinner();
            statusFuncs.statusMessage("Saving nodule");
            _context5.prev = 4;
            _context5.next = 7;
            return doSavePromise();
          case 7:
            statusFuncs.stopSpinner();
            statusFuncs.statusMessage("Saved module");
            _context5.next = 15;
            break;
          case 11:
            _context5.prev = 11;
            _context5.t0 = _context5["catch"](4);
            errorDrawerFuncs.addFromError("Error saving module", _context5.t0);
            statusFuncs.stopSpinner();
          case 15:
            return _context5.abrupt("return", false);
          case 16:
          case "end":
            return _context5.stop();
        }
      }, _callee5, null, [[4, 11]]);
    }));
    return _saveMe2.apply(this, arguments);
  }
  function doSavePromise() {
    return new Promise( /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(resolve, reject) {
        var new_code, tagstring, local_notes, local_tags, local_icon, result_dict, category, data;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              new_code = code_content;
              tagstring = tags.join(" ");
              local_notes = notes;
              local_tags = tags; // In case it's modified wile saving
              local_icon = icon;
              category = null;
              result_dict = {
                "module_name": _cProp("resource_name"),
                "category": category,
                "tags": tagstring,
                "notes": local_notes,
                "icon": local_icon,
                "new_code": new_code,
                "last_saved": "viewer"
              };
              _context3.prev = 7;
              _context3.next = 10;
              return (0, _communication_react.postAjaxPromise)("update_module", result_dict);
            case 10:
              data = _context3.sent;
              savedContent.current = new_code;
              savedTags.current = local_tags;
              savedNotes.current = local_notes;
              savedIcon.current = local_icon;
              data.timeout = 2000;
              resolve(data);
              _context3.next = 22;
              break;
            case 19:
              _context3.prev = 19;
              _context3.t0 = _context3["catch"](7);
              reject(_context3.t0);
            case 22:
            case "end":
              return _context3.stop();
          }
        }, _callee3, null, [[7, 19]]);
      }));
      return function (_x2, _x3) {
        return _ref.apply(this, arguments);
      };
    }());
  }
  function _saveModuleAs() {
    return _saveModuleAs2.apply(this, arguments);
  }
  function _saveModuleAs2() {
    _saveModuleAs2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
      var data, new_name, result_dict;
      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            statusFuncs.startSpinner();
            _context6.prev = 1;
            _context6.next = 4;
            return (0, _communication_react.postPromise)("host", "get_tile_names", {
              "user_id": window.user_id
            }, props.main_id);
          case 4:
            data = _context6.sent;
            _context6.next = 7;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Save Module As",
              field_title: "New Module Name",
              default_value: "NewModule",
              existing_names: data.tile_names,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 7:
            new_name = _context6.sent;
            result_dict = {
              "new_res_name": new_name,
              "res_to_copy": _cProp("resource_name")
            };
            _context6.next = 11;
            return (0, _communication_react.postAjaxPromise)('/create_duplicate_tile', result_dict);
          case 11:
            _setResourceNameState(new_name, function () {
              _saveMe();
            });
            statusFuncs.stopSpinner();
            _context6.next = 21;
            break;
          case 15:
            _context6.prev = 15;
            _context6.t0 = _context6["catch"](1);
            statusFuncs.stopSpinner();
            statusFuncs.clearstatus();
            if (_context6.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error saving module", _context6.t0);
            }
            return _context6.abrupt("return");
          case 21:
          case "end":
            return _context6.stop();
        }
      }, _callee6, null, [[1, 15]]);
    }));
    return _saveModuleAs2.apply(this, arguments);
  }
  function _saveAndLoadModule() {
    return _saveAndLoadModule2.apply(this, arguments);
  }
  function _saveAndLoadModule2() {
    _saveAndLoadModule2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7() {
      var data;
      return _regeneratorRuntime().wrap(function _callee7$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
          case 0:
            if (am_selected()) {
              _context7.next = 2;
              break;
            }
            return _context7.abrupt("return", false);
          case 2:
            statusFuncs.startSpinner();
            _context7.prev = 3;
            _context7.next = 6;
            return doSavePromise();
          case 6:
            statusFuncs.statusMessage("Loading Module");
            _context7.next = 9;
            return (0, _communication_react.postPromise)("host", "load_tile_module_task", {
              "tile_module_name": _cProp("resource_name"),
              "user_id": window.user_id
            }, props.resource_viewer_id);
          case 9:
            data = _context7.sent;
            statusFuncs.statusMessage("Saved and loaded module");
            statusFuncs.stopSpinner();
            _context7.next = 20;
            break;
          case 14:
            _context7.prev = 14;
            _context7.t0 = _context7["catch"](3);
            errorDrawerFuncs.addFromError("Error saving and loading module", _context7.t0);
            statusFuncs.clearStatusMessage();
            statusFuncs.stopSpinner();
            return _context7.abrupt("return");
          case 20:
          case "end":
            return _context7.stop();
        }
      }, _callee7, null, [[3, 14]]);
    }));
    return _saveAndLoadModule2.apply(this, arguments);
  }
  function _loadModule() {
    return _loadModule2.apply(this, arguments);
  }
  function _loadModule2() {
    _loadModule2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8() {
      return _regeneratorRuntime().wrap(function _callee8$(_context8) {
        while (1) switch (_context8.prev = _context8.next) {
          case 0:
            if (am_selected()) {
              _context8.next = 2;
              break;
            }
            return _context8.abrupt("return", false);
          case 2:
            _context8.prev = 2;
            statusFuncs.startSpinner();
            statusFuncs.statusMessage("Loading Module");
            _context8.next = 7;
            return (0, _communication_react.postPromise)("host", "load_tile_module_task", {
              "tile_module_name": _cProp("resource_name"),
              "user_id": window.user_id
            }, props.resource_viewer_id);
          case 7:
            statusFuncs.statusMessage("Loaded module");
            statusFuncs.stopSpinner();
            _context8.next = 16;
            break;
          case 11:
            _context8.prev = 11;
            _context8.t0 = _context8["catch"](2);
            errorDrawerFuncs.addFromError("Error loading module", _context8.t0);
            statusFuncs.clearStatusMessage();
            statusFuncs.stopSpinner();
          case 16:
          case "end":
            return _context8.stop();
        }
      }, _callee8, null, [[2, 11]]);
    }));
    return _loadModule2.apply(this, arguments);
  }
  function _saveAndCheckpoint() {
    return _saveAndCheckpoint2.apply(this, arguments);
  }
  function _saveAndCheckpoint2() {
    _saveAndCheckpoint2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9() {
      return _regeneratorRuntime().wrap(function _callee9$(_context9) {
        while (1) switch (_context9.prev = _context9.next) {
          case 0:
            if (am_selected()) {
              _context9.next = 2;
              break;
            }
            return _context9.abrupt("return", false);
          case 2:
            _context9.prev = 2;
            statusFuncs.startSpinner();
            statusFuncs.statusMessage("Saving...");
            _context9.next = 7;
            return doSavePromise();
          case 7:
            statusFuncs.statusMessage("Checkpointing...");
            _context9.next = 10;
            return doCheckpointPromise();
          case 10:
            statusFuncs.stopSpinner();
            statusFuncs.statusMessage("Saved and checkpointed");
            _context9.next = 20;
            break;
          case 14:
            _context9.prev = 14;
            _context9.t0 = _context9["catch"](2);
            errorDrawerFuncs.addFromError("Error saving and checkpointing", _context9.t0);
            statusFuncs.clearStatusMessage();
            statusFuncs.stopSpinner();
            return _context9.abrupt("return");
          case 20:
          case "end":
            return _context9.stop();
        }
      }, _callee9, null, [[2, 14]]);
    }));
    return _saveAndCheckpoint2.apply(this, arguments);
  }
  function doCheckpointPromise() {
    return (0, _communication_react.postAjaxPromise)("checkpoint_module", {
      "module_name": _cProp("resource_name")
    });
  }
  function _showHistoryViewer() {
    window.open("".concat($SCRIPT_ROOT, "/show_history_viewer/").concat(_cProp("resource_name")));
  }
  function _showTileDiffer() {
    window.open("".concat($SCRIPT_ROOT, "/show_tile_differ/").concat(_cProp("resource_name")));
  }
  function _dirty() {
    return !(code_content_ref.current == savedContent.current && icon_ref.current == savedIcon.current && tags_ref.current == savedTags.current && notes_ref.current == savedNotes.current);
  }
  function _setSearchMatches(nmatches) {
    set_search_matches(nmatches);
  }
  function _searchNext() {
    if (current_search_number_ref.current < search_matches_ref.current - 1) {
      set_current_search_number(current_search_number_ref.current + 1);
    }
  }
  function _searchPrev() {
    if (current_search_number_ref.current > 0) {
      set_current_search_number(current_search_number_ref.current - 1);
    }
  }
  var my_props = _objectSpread({}, props);
  if (!props.controlled) {
    my_props.resource_name = resource_name;
  }
  var outer_style = {
    width: "100%",
    height: sizeInfo.availableHeight,
    paddingLeft: 0,
    position: "relative"
  };
  // let cc_height = get_new_cc_height();
  var outer_class = "resource-viewer-holder";
  if (!props.controlled) {
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
    resource_viewer_id: my_props.resource_viewer_id,
    refreshTab: props.refreshTab,
    closeTab: props.closeTab,
    res_type: "tile",
    resource_name: my_props.resource_name,
    menu_specs: menu_specs(),
    handleStateChange: _handleMetadataChange,
    created: props.created,
    notes: notes,
    tags: tags,
    mdata_icon: icon,
    show_search: false,
    showErrorDrawerButton: true
  }), /*#__PURE__*/_react["default"].createElement(_reactCodemirror.ReactCodemirror6, {
    code_content: code_content,
    show_fold_button: true,
    no_width: true,
    extraKeys: _extraKeys(),
    readOnly: props.readOnly,
    handleChange: _handleCodeChange,
    saveMe: _saveMe,
    show_search: true,
    search_term: search_string,
    search_ref: search_ref,
    search_matches: search_matches,
    updateSearchState: _update_search_state,
    regex_search: regex,
    searchPrev: _searchPrev,
    searchNext: _searchNext,
    highlight_active_line: true,
    current_search_number: current_search_number,
    setSearchMatches: _setSearchMatches
  }))));
}
exports.ModuleViewerApp = ModuleViewerApp = /*#__PURE__*/(0, _react.memo)(ModuleViewerApp);
function module_viewer_main() {
  function gotProps(the_props) {
    var ModuleViewerAppPlus = (0, _sizing_tools.withSizeContext)((0, _settings.withSettings)((0, _modal_react.withDialogs)((0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)((0, _assistant.withAssistant)(ModuleViewerApp))))));
    var the_element = /*#__PURE__*/_react["default"].createElement(ModuleViewerAppPlus, _extends({}, the_props, {
      controlled: false,
      changeName: null
    }));
    var domContainer = document.querySelector('#root');
    var root = (0, _client.createRoot)(domContainer);
    root.render(the_element);
  }
  var target = window.is_repository ? "repository_view_module_in_context" : "view_module_in_context";
  (0, _communication_react.postAjaxPromise)(target, {
    "resource_name": window.resource_name
  }).then(function (data) {
    module_viewer_props(data, null, gotProps, null);
  });
}
if (!window.in_context) {
  module_viewer_main();
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LibraryPane = LibraryPane;
exports.res_types = void 0;
exports.view_views = view_views;
var _react = _interopRequireWildcard(require("react"));
var _core = require("@blueprintjs/core");
var _table = require("@blueprintjs/table");
var _combined_metadata = require("./combined_metadata");
var _resizing_allotment = require("./resizing_allotment");
var _communication_react = require("./communication_react");
var _toaster = require("./toaster");
var _utilities_react = require("./utilities_react");
var _modal_react = require("./modal_react");
var _error_drawer = require("./error_drawer");
var _library_table_pane = require("./library_table_pane");
var _library_pane_reducer = require("./library_pane_reducer");
var _library_widgets = require("./library_widgets");
var _tactic_socket = require("./tactic_socket");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
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
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } // noinspection JSValidateTypes,JSDeprecatedSymbols
var res_types = exports.res_types = ["collection", "project", "tile", "list", "code", "metabook"];
function view_views() {
  var is_repository = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  if (is_repository) {
    return {
      collection: null,
      project: null,
      tile: "/repository_view_module/",
      list: "/repository_view_list/",
      code: "/repository_view_code/"
    };
  } else {
    return {
      collection: "/main_collection/",
      project: "/main_project/",
      tile: "/last_saved_view/",
      list: "/view_list/",
      code: "/view_code/"
    };
  }
}
function BodyMenu(props) {
  function getIntent(item) {
    return item.intent ? item.intent : null;
  }
  var menu_items = props.items.map(function (item, index) {
    if (item.text == "__divider__") {
      return /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, {
        key: index
      });
    } else {
      var the_row = props.selected_rows[0];
      var disabled = item.res_type && the_row.res_type != item.res_type;
      return /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: item.icon,
        disabled: disabled,
        onClick: function onClick() {
          return item.onClick(the_row);
        },
        intent: getIntent(item),
        key: item.text,
        text: item.text
      });
    }
  });
  return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, {
    title: props.selected_rows[0].name,
    className: "context-menu-header"
  }), menu_items);
}
var initial_state = {
  data_dict: {},
  num_rows: 0,
  tag_list: [],
  show_filter_bar: false,
  contextMenuItems: [],
  select_state: {
    selected_resource: {
      "name": "",
      "_id": "",
      "tags": "",
      "notes": "",
      "updated": "",
      "created": ""
    },
    selected_rows: [],
    multi_select: false,
    list_of_selected: [],
    list_of_selected_types: [],
    selectedRegions: [_table.Regions.row(0)]
  },
  search_state: {
    sort_field: "updated",
    sort_direction: "descending",
    expanded_tags: [],
    active_tag: "all",
    tagRoot: "all",
    search_string: "",
    search_inside: false,
    search_metadata: false,
    filterType: [],
    show_hidden: false
  },
  rowChanged: 0
};
function LibraryPane(props) {
  props = _objectSpread({
    columns: _library_widgets.all_columns,
    is_repository: false,
    tsocket: null
  }, props);
  var _useImmerReducerAndRe = (0, _utilities_react.useImmerReducerAndRef)(_library_pane_reducer.paneReducer, initial_state),
    _useImmerReducerAndRe2 = _slicedToArray(_useImmerReducerAndRe, 3),
    pState = _useImmerReducerAndRe2[0],
    pDispatch = _useImmerReducerAndRe2[1],
    pStateRef = _useImmerReducerAndRe2[2];
  var top_ref = (0, _react.useRef)(null);
  var previous_search_spec = (0, _react.useRef)(null);
  var selectedTypeRef = (0, _react.useRef)(null);
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  var statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  var _handleArrowKeyPress = (0, _react.useCallback)( /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(key) {
      var the_res, current_index, new_index;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            if (!pStateRef.current.select_state.multi_select) {
              _context.next = 2;
              break;
            }
            return _context.abrupt("return");
          case 2:
            the_res = pStateRef.current.select_state.selected_resource;
            current_index = parseInt((0, _library_pane_reducer.get_index)(the_res.name, the_res.res_type, pStateRef.current.data_dict));
            if (!(key == "ArrowDown")) {
              _context.next = 8;
              break;
            }
            new_index = current_index + 1;
            _context.next = 11;
            break;
          case 8:
            new_index = current_index - 1;
            if (!(new_index < 0)) {
              _context.next = 11;
              break;
            }
            return _context.abrupt("return");
          case 11:
            _context.next = 13;
            return _selectRow(new_index);
          case 13:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }(), [pStateRef.current.select_state.multi_select, pStateRef.current.select_state.selected_resource, pStateRef.current.data_dict]);
  var _view_func = (0, _react.useCallback)( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
    var the_view,
      res_type,
      _args2 = arguments;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          the_view = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : null;
          res_type = pStateRef.current.select_state.selected_resource.res_type;
          if (res_type) {
            _context2.next = 4;
            break;
          }
          return _context2.abrupt("return");
        case 4:
          if (!(res_type == "metabook")) {
            _context2.next = 9;
            break;
          }
          if (window.in_context) {
            _context2.next = 7;
            break;
          }
          return _context2.abrupt("return");
        case 7:
          props.setCurrentMetabook(pStateRef.current.select_state.selected_resource._id);
          return _context2.abrupt("return");
        case 9:
          statusFuncs.setStatus({
            show_spinner: true,
            status_message: "Opening ..."
          });
          if (!window.in_context) {
            _context2.next = 14;
            break;
          }
          try {
            props.handleCreateViewer(res_type, pStateRef.current.select_state.selected_resource.name, statusFuncs.clearStatus);
          } catch (e) {
            statusFuncs.clearStatus();
            errorDrawerFuncs.addFromError("Error viewing with view ".concat(the_view), e);
          }
          _context2.next = 19;
          break;
        case 14:
          if (the_view == null) {
            the_view = view_views(props.is_repository)[pStateRef.current.select_state.selected_resource.res_type];
          }
          statusFuncs.clearStatus();
          if (!(the_view == null)) {
            _context2.next = 18;
            break;
          }
          return _context2.abrupt("return");
        case 18:
          window.open($SCRIPT_ROOT + the_view + pStateRef.current.select_state.selected_resource.name);
        case 19:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  })), [pStateRef.current.select_state.selected_resource]);
  function _unsearch() {
    return _unsearch2.apply(this, arguments);
  }
  function _unsearch2() {
    _unsearch2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8() {
      return _regeneratorRuntime().wrap(function _callee8$(_context8) {
        while (1) switch (_context8.prev = _context8.next) {
          case 0:
            if (!(pStateRef.current.search_state.search_string != "")) {
              _context8.next = 4;
              break;
            }
            _update_search_state({
              search_string: ""
            });
            _context8.next = 11;
            break;
          case 4:
            if (!(pStateRef.current.search_state.active_tag != "all")) {
              _context8.next = 8;
              break;
            }
            _update_search_state({
              active_tag: "all"
            });
            _context8.next = 11;
            break;
          case 8:
            if (_.isEqual(pStateRef.current.search_state.filterType, res_types)) {
              _context8.next = 11;
              break;
            }
            _context8.next = 11;
            return _setFilterType(res_types);
          case 11:
          case "end":
            return _context8.stop();
        }
      }, _callee8);
    }));
    return _unsearch2.apply(this, arguments);
  }
  var hotkeys = (0, _react.useMemo)(function () {
    return [{
      combo: "Enter",
      global: false,
      group: "Library",
      label: "Open Selected Resource",
      onKeyDown: function () {
        var _onKeyDown = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
          return _regeneratorRuntime().wrap(function _callee3$(_context3) {
            while (1) switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return _view_func();
              case 2:
              case "end":
                return _context3.stop();
            }
          }, _callee3);
        }));
        function onKeyDown() {
          return _onKeyDown.apply(this, arguments);
        }
        return onKeyDown;
      }()
    }, {
      combo: "ArrowDown",
      global: false,
      group: "Library",
      label: "Move Selection Down",
      onKeyDown: function () {
        var _onKeyDown2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
          return _regeneratorRuntime().wrap(function _callee4$(_context4) {
            while (1) switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return _handleArrowKeyPress("ArrowDown");
              case 2:
              case "end":
                return _context4.stop();
            }
          }, _callee4);
        }));
        function onKeyDown() {
          return _onKeyDown2.apply(this, arguments);
        }
        return onKeyDown;
      }()
    }, {
      combo: "ArrowUp",
      global: false,
      group: "Library",
      label: "Move Selection Up",
      onKeyDown: function () {
        var _onKeyDown3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
          return _regeneratorRuntime().wrap(function _callee5$(_context5) {
            while (1) switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return _handleArrowKeyPress("ArrowUp");
              case 2:
              case "end":
                return _context5.stop();
            }
          }, _callee5);
        }));
        function onKeyDown() {
          return _onKeyDown3.apply(this, arguments);
        }
        return onKeyDown;
      }()
    }, {
      combo: "Escape",
      global: false,
      group: "Library",
      label: "Undo Search",
      onKeyDown: _unsearch
    }];
  }, [_view_func, _handleArrowKeyPress, _unsearch]);
  var _useHotkeys = (0, _core.useHotkeys)(hotkeys),
    handleKeyDown = _useHotkeys.handleKeyDown,
    handleKeyUp = _useHotkeys.handleKeyUp;
  (0, _react.useEffect)(function () {
    _grabNewChunkWithRow(0).then(function () {});
  }, [props.columns]);
  var pushCallback = (0, _utilities_react.useCallbackStack)("library_home");
  (0, _tactic_socket.useSocketListener)(props.tsocket, "update-selector-row", _handleRowUpdate, props.tsocket && !props.is_repository);
  (0, _tactic_socket.useSocketListener)(props.tsocket, "refresh-selector", _refresh_func, props.tsocket != null && !props.is_repository);
  (0, _tactic_socket.useSocketListener)(props.tsocket, "update-repository-selector-row", _handleRowUpdate, props.tsocket != null && props.is_repository);
  (0, _tactic_socket.useSocketListener)(props.tsocket, "refresh-repository-selector", _refresh_func, props.tsocket != null && props.is_repository);
  function _renderBodyContextMenu(menu_context) {
    if (event) {
      event.preventDefault();
    }
    var regions = menu_context.regions;
    if (regions.length == 0) return null; // Without this get an error when clicking on a body cell
    var selected_rows = [];
    var _iterator = _createForOfIteratorHelper(regions),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var region = _step.value;
        if (region.hasOwnProperty("rows")) {
          var first_row = region["rows"][0];
          var last_row = region["rows"][1];
          for (var i = first_row; i <= last_row; ++i) {
            if (!selected_rows.includes(i)) {
              selected_rows.push(pStateRef.current.data_dict[i]);
            }
          }
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return /*#__PURE__*/_react["default"].createElement(BodyMenu, {
      items: pStateRef.current.contextMenuItems,
      selected_rows: selected_rows
    });
  }
  function _setFilterType(_x2) {
    return _setFilterType2.apply(this, arguments);
  }
  function _setFilterType2() {
    _setFilterType2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10(rtypes) {
      var sres;
      return _regeneratorRuntime().wrap(function _callee10$(_context10) {
        while (1) switch (_context10.prev = _context10.next) {
          case 0:
            if (!_.isEqual(rtypes, pStateRef.current.search_state.filterType)) {
              _context10.next = 2;
              break;
            }
            return _context10.abrupt("return");
          case 2:
            if (pStateRef.current.search_state.multi_select) {
              _context10.next = 7;
              break;
            }
            sres = pStateRef.current.select_state.selected_resource;
            if (!(sres.name != "" && sres.notes != get_data_dict_entry(sres.name, sres.res_type).notes)) {
              _context10.next = 7;
              break;
            }
            _context10.next = 7;
            return _saveFromSelectedResource();
          case 7:
            pDispatch({
              type: "UPDATE_SEARCH_STATE",
              search_state: {
                filterType: rtypes
              }
            });
            clearSelected();
            pushCallback( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9() {
              return _regeneratorRuntime().wrap(function _callee9$(_context9) {
                while (1) switch (_context9.prev = _context9.next) {
                  case 0:
                    _context9.next = 2;
                    return _grabNewChunkWithRow(0, true, null, true);
                  case 2:
                  case "end":
                    return _context9.stop();
                }
              }, _callee9);
            })));
          case 10:
          case "end":
            return _context10.stop();
        }
      }, _callee10);
    }));
    return _setFilterType2.apply(this, arguments);
  }
  function clearSelected() {
    pDispatch({
      type: "CLEAR_SELECTED"
    });
  }
  function compactRowsToRegions(rowIndices) {
    if (rowIndices.length === 0) return [];
    var regions = [];
    var start = rowIndices[0];
    var end = rowIndices[0];
    var _iterator2 = _createForOfIteratorHelper(rowIndices),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var current = _step2.value;
        if (current === end + 1) {
          end = current;
        } else {
          regions.push({
            rows: [start, end]
          });
          start = current;
          end = current;
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    regions.push({
      rows: [start, end]
    });
    return regions;
  }
  function _onTableSelection(_x3) {
    return _onTableSelection2.apply(this, arguments);
  }
  function _onTableSelection2() {
    _onTableSelection2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11(regions) {
      var selected_rows, selected_row_indices, _iterator3, _step3, region, _region$rows, first_row, last_row, i, sortedIndices, revised_regions;
      return _regeneratorRuntime().wrap(function _callee11$(_context11) {
        while (1) switch (_context11.prev = _context11.next) {
          case 0:
            if (!(regions.length === 0)) {
              _context11.next = 2;
              break;
            }
            return _context11.abrupt("return");
          case 2:
            selected_rows = [];
            selected_row_indices = new Set();
            _iterator3 = _createForOfIteratorHelper(regions);
            try {
              for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                region = _step3.value;
                if (region.hasOwnProperty("rows")) {
                  _region$rows = _slicedToArray(region.rows, 2), first_row = _region$rows[0], last_row = _region$rows[1];
                  for (i = first_row; i <= last_row; ++i) {
                    if (!selected_row_indices.has(i)) {
                      selected_row_indices.add(i);
                      selected_rows.push(pStateRef.current.data_dict[i]);
                    }
                  }
                }
              }
            } catch (err) {
              _iterator3.e(err);
            } finally {
              _iterator3.f();
            }
            sortedIndices = Array.from(selected_row_indices).sort(function (a, b) {
              return a - b;
            });
            revised_regions = compactRowsToRegions(sortedIndices);
            _context11.next = 10;
            return _handleRowSelection(selected_rows);
          case 10:
            pDispatch({
              type: "UPDATE_SELECT_STATE",
              select_state: {
                selectedRegions: revised_regions
              }
            });
          case 11:
          case "end":
            return _context11.stop();
        }
      }, _callee11);
    }));
    return _onTableSelection2.apply(this, arguments);
  }
  function _grabNewChunkWithRow(_x4) {
    return _grabNewChunkWithRow2.apply(this, arguments);
  }
  function _grabNewChunkWithRow2() {
    _grabNewChunkWithRow2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee12(row_index) {
      var flush,
        spec_update,
        select,
        select_by_name,
        callback,
        search_spec,
        args,
        data,
        _args12 = arguments;
      return _regeneratorRuntime().wrap(function _callee12$(_context12) {
        while (1) switch (_context12.prev = _context12.next) {
          case 0:
            flush = _args12.length > 1 && _args12[1] !== undefined ? _args12[1] : false;
            spec_update = _args12.length > 2 && _args12[2] !== undefined ? _args12[2] : null;
            select = _args12.length > 3 && _args12[3] !== undefined ? _args12[3] : false;
            select_by_name = _args12.length > 4 && _args12[4] !== undefined ? _args12[4] : null;
            callback = _args12.length > 5 && _args12[5] !== undefined ? _args12[5] : null;
            search_spec = _objectSpread({}, pStateRef.current.search_state);
            if (search_spec.active_tag == "all") {
              search_spec.active_tag = null;
            }
            if (spec_update) {
              search_spec = Object.assign(search_spec, spec_update);
            }
            if (search_spec.active_tag && search_spec.active_tag[0] != "/") {
              search_spec.active_tag = "/" + search_spec.active_tag;
            }
            args = {
              res_types: pStateRef.current.search_state.filterType,
              search_spec: search_spec,
              row_number: row_index,
              is_repository: props.is_repository,
              columns: props.columns
            };
            /** @type {{ chunk_dict: object, all_tags: array, num_rows: int }} */
            _context12.prev = 10;
            _context12.next = 13;
            return (0, _communication_react.postPromise)("host", "grab_all_list_chunk_task", args);
          case 13:
            data = _context12.sent;
            if (flush) {
              pDispatch({
                type: "INIT_DATA_DICT",
                data_dict: data.chunk_dict,
                num_rows: data.num_rows
              });
            } else {
              pDispatch({
                type: "UPDATE_DATA_DICT",
                data_dict: data.chunk_dict,
                num_rows: data.num_rows
              });
            }
            previous_search_spec.current = search_spec;
            set_tag_list(data.all_tags);
            if (callback) {
              pushCallback(callback);
            } else if (select || pStateRef.current.select_state.selected_resource.name == "") {
              pushCallback(function () {
                _selectRow(row_index);
              });
            }
            _context12.next = 23;
            break;
          case 20:
            _context12.prev = 20;
            _context12.t0 = _context12["catch"](10);
            errorDrawerFuncs.addFromError("Error grabbing resource chunk", _context12.t0);
          case 23:
          case "end":
            return _context12.stop();
        }
      }, _callee12, null, [[10, 20]]);
    }));
    return _grabNewChunkWithRow2.apply(this, arguments);
  }
  function set_tag_list(tag_list) {
    pDispatch({
      type: "SET_TAG_LIST",
      tag_list: tag_list
    });
  }
  function _handleRowUpdate(_x5) {
    return _handleRowUpdate2.apply(this, arguments);
  }
  function _handleRowUpdate2() {
    _handleRowUpdate2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee14(res_dict) {
      var res_name, ind, _id, event_type, the_row, selected_ind, new_selected_ind;
      return _regeneratorRuntime().wrap(function _callee14$(_context14) {
        while (1) switch (_context14.prev = _context14.next) {
          case 0:
            res_name = res_dict.name;
            event_type = res_dict.event_type;
            delete res_dict.event_type;
            _context14.t0 = event_type;
            _context14.next = _context14.t0 === "update" ? 6 : _context14.t0 === "insert" ? 12 : _context14.t0 === "delete" ? 15 : 23;
            break;
          case 6:
            if ("_id" in res_dict) {
              _id = res_dict._id;
              ind = (0, _library_pane_reducer.get_index_from_id)(res_dict._id, pStateRef.current.data_dict);
            } else {
              ind = (0, _library_pane_reducer.get_index)(res_name, res_dict.res_type, pStateRef.current.data_dict);
              if (ind) {
                _id = pStateRef.current.data_dict[ind]._id;
              }
            }
            if (ind) {
              _context14.next = 9;
              break;
            }
            return _context14.abrupt("return");
          case 9:
            pDispatch({
              type: "UPDATE_ROW",
              index: ind,
              res_dict: res_dict
            });
            if (_id == pStateRef.current.select_state.selected_resource._id) {
              the_row = _objectSpread(_objectSpread({}, pStateRef.current.data_dict[ind]), res_dict);
              pDispatch({
                type: "UPDATE_SELECT_STATE",
                select_state: {
                  selected_resource: the_row
                }
              });
            }
            return _context14.abrupt("break", 24);
          case 12:
            _context14.next = 14;
            return _grabNewChunkWithRow(0, true, null, false, res_name);
          case 14:
            return _context14.abrupt("break", 24);
          case 15:
            if ("_id" in res_dict) {
              ind = parseInt((0, _library_pane_reducer.get_index_from_id)(res_dict._id, pStateRef.current.data_dict));
            } else {
              ind = parseInt((0, _library_pane_reducer.get_index)(res_name, res_dict.res_type, pStateRef.current.data_dict));
            }
            selected_ind = null;
            if ("_id" in pStateRef.current.select_state.selected_resource) {
              selected_ind = parseInt((0, _library_pane_reducer.get_index_from_id)(pStateRef.current.select_state.selected_resource._id, pStateRef.current.data_dict));
            }
            new_selected_ind = selected_ind;
            if (selected_ind > ind) {
              new_selected_ind = selected_ind - 1;
            }
            pDispatch({
              type: "DELETE_ROW",
              index: ind
            });
            pushCallback( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee13() {
              return _regeneratorRuntime().wrap(function _callee13$(_context13) {
                while (1) switch (_context13.prev = _context13.next) {
                  case 0:
                    _context13.next = 2;
                    return _grabNewChunkWithRow(ind, false, null, false, null, function () {
                      if (new_selected_ind) {
                        _selectRow(new_selected_ind);
                      } else {
                        clearSelected();
                      }
                    });
                  case 2:
                  case "end":
                    return _context13.stop();
                }
              }, _callee13);
            })));
            return _context14.abrupt("break", 24);
          case 23:
            return _context14.abrupt("return");
          case 24:
          case "end":
            return _context14.stop();
        }
      }, _callee14);
    }));
    return _handleRowUpdate2.apply(this, arguments);
  }
  function get_data_dict_entry(name, res_type) {
    for (var index in pStateRef.current.data_dict) {
      var the_row = pStateRef.current.data_dict[index];
      if (the_row.name == name && the_row.res_type == res_type) {
        return pStateRef.current.data_dict[index];
      }
    }
    return null;
  }
  function _saveFromSelectedResource() {
    return _saveFromSelectedResource2.apply(this, arguments);
  }
  function _saveFromSelectedResource2() {
    _saveFromSelectedResource2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee15() {
      var result_dict;
      return _regeneratorRuntime().wrap(function _callee15$(_context15) {
        while (1) switch (_context15.prev = _context15.next) {
          case 0:
            // This will only be called when there is a single row selected
            result_dict = {
              "res_type": pStateRef.current.select_state.selected_rows[0].res_type,
              "res_name": pStateRef.current.select_state.list_of_selected[0],
              "metadata": {
                "tags": pStateRef.current.select_state.selected_resource.tags,
                "notes": pStateRef.current.select_state.selected_resource.notes
              }
            };
            if (pStateRef.current.select_state.selected_rows[0].res_type == "tile" && "icon" in pStateRef.current.select_state.selected_resource) {
              result_dict["metadata"]["icon"] = pStateRef.current.select_state.selected_resource["icon"];
            }
            _context15.prev = 2;
            _context15.next = 5;
            return (0, _communication_react.postPromise)("host", "save_metadata_task", result_dict);
          case 5:
            _context15.next = 10;
            break;
          case 7:
            _context15.prev = 7;
            _context15.t0 = _context15["catch"](2);
            errorDrawerFuncs.addFromError("Error updating resource ".concat(result_dict.res_name), _context15.t0);
          case 10:
          case "end":
            return _context15.stop();
        }
      }, _callee15, null, [[2, 7]]);
    }));
    return _saveFromSelectedResource2.apply(this, arguments);
  }
  function _handleRowDoubleClick(row_dict) {
    statusFuncs.setStatus({
      show_spinner: true,
      status_message: "Opening ..."
    });
    pDispatch({
      type: "UPDATE_SELECT_STATE",
      select_state: {
        selected_resource: row_dict,
        multi_select: false,
        list_of_selected: [row_dict.name],
        list_of_selected_types: [row_dict.res_type],
        selected_rows: [row_dict]
      }
    });
    pushCallback( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
      var _view_view;
      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            if (!window.in_context) {
              _context6.next = 4;
              break;
            }
            try {
              props.handleCreateViewer(row_dict.res_type, row_dict.name, statusFuncs.clearStatus);
            } catch (e) {
              statusFuncs.clearStatus();
              errorDrawerFuncs.addFromError("Error handling double click with view ".concat(view_view), e);
            }
            _context6.next = 9;
            break;
          case 4:
            _view_view = view_views(props.is_repository)[row_dict.res_type];
            statusFuncs.clearStatus();
            if (!(_view_view == null)) {
              _context6.next = 8;
              break;
            }
            return _context6.abrupt("return");
          case 8:
            window.open($SCRIPT_ROOT + _view_view + row_dict.name);
          case 9:
          case "end":
            return _context6.stop();
        }
      }, _callee6);
    })));
  }
  function _selectedTypes() {
    var the_types = pStateRef.current.select_state.selected_rows.map(function (row) {
      return row.res_type;
    });
    the_types = _toConsumableArray(new Set(the_types));
    return the_types;
  }
  function _handleRowSelection(_x6) {
    return _handleRowSelection2.apply(this, arguments);
  }
  function _handleRowSelection2() {
    _handleRowSelection2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee16(selected_rows) {
      var sres, common_tags, other_rows, _iterator4, _step4, row_dict, new_common_tags, new_tag_list, _iterator5, _step5, tag, multi_select_list, multi_select_types, new_selected_resource, _row_dict;
      return _regeneratorRuntime().wrap(function _callee16$(_context16) {
        while (1) switch (_context16.prev = _context16.next) {
          case 0:
            if (pStateRef.current.select_state.multi_select) {
              _context16.next = 5;
              break;
            }
            sres = pStateRef.current.select_state.selected_resource;
            if (!(sres.name != "" && get_data_dict_entry(sres.name, sres.res_type) && sres.notes != get_data_dict_entry(sres.name, sres.res_type).notes)) {
              _context16.next = 5;
              break;
            }
            _context16.next = 5;
            return _saveFromSelectedResource();
          case 5:
            if (selected_rows.length > 1) {
              // I think the common_tags stuff doesn't currently do anything
              common_tags = selected_rows[0].tags.split(" ");
              other_rows = selected_rows.slice(1, selected_rows.length);
              _iterator4 = _createForOfIteratorHelper(other_rows);
              try {
                for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                  row_dict = _step4.value;
                  new_common_tags = [];
                  new_tag_list = row_dict.tags.split(" ");
                  _iterator5 = _createForOfIteratorHelper(new_tag_list);
                  try {
                    for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
                      tag = _step5.value;
                      if (common_tags.includes(tag)) {
                        new_common_tags.push(tag);
                      }
                    }
                  } catch (err) {
                    _iterator5.e(err);
                  } finally {
                    _iterator5.f();
                  }
                  common_tags = new_common_tags;
                }
              } catch (err) {
                _iterator4.e(err);
              } finally {
                _iterator4.f();
              }
              multi_select_list = selected_rows.map(function (row_dict) {
                return row_dict.name;
              });
              multi_select_types = selected_rows.map(function (row_dict) {
                return row_dict.res_type;
              });
              new_selected_resource = {
                name: "__multiple__",
                tags: common_tags.join(" "),
                notes: ""
              };
              pDispatch({
                type: "UPDATE_SELECT_STATE",
                select_state: {
                  selected_resource: new_selected_resource,
                  multi_select: true,
                  list_of_selected: multi_select_list,
                  list_of_selected_types: multi_select_types,
                  selected_rows: selected_rows
                }
              });
            } else {
              _row_dict = selected_rows[0];
              pDispatch({
                type: "UPDATE_SELECT_STATE",
                select_state: {
                  selected_resource: _row_dict,
                  multi_select: false,
                  list_of_selected: [_row_dict.name],
                  list_of_selected_types: [_row_dict.res_type],
                  selected_rows: selected_rows
                }
              });
            }
          case 6:
          case "end":
            return _context16.stop();
        }
      }, _callee16);
    }));
    return _handleRowSelection2.apply(this, arguments);
  }
  function _update_search_state(new_state) {
    pDispatch({
      type: "UPDATE_SEARCH_STATE",
      search_state: new_state
    });
    pushCallback( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7() {
      return _regeneratorRuntime().wrap(function _callee7$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
          case 0:
            if (!search_spec_changed(new_state)) {
              _context7.next = 4;
              break;
            }
            clearSelected();
            _context7.next = 4;
            return _grabNewChunkWithRow(0, true, new_state, true);
          case 4:
          case "end":
            return _context7.stop();
        }
      }, _callee7);
    })));
  }
  function search_spec_changed(new_spec) {
    if (!previous_search_spec.current) {
      return true;
    }
    for (var key in previous_search_spec.current) {
      if (new_spec.hasOwnProperty(key)) {
        // noinspection TypeScriptValidateTypes
        if (new_spec[key] != previous_search_spec.current[key]) {
          return true;
        }
      }
    }
    return false;
  }
  function _set_sort_state(column_name, direction) {
    var spec_update = {
      sort_field: column_name,
      sort_direction: direction
    };
    _update_search_state(spec_update);
  }
  function _selectRow(_x7) {
    return _selectRow2.apply(this, arguments);
  }
  function _selectRow2() {
    _selectRow2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee17(new_index) {
      return _regeneratorRuntime().wrap(function _callee17$(_context17) {
        while (1) switch (_context17.prev = _context17.next) {
          case 0:
            if (Object.keys(pStateRef.current.data_dict).includes(String(new_index))) {
              _context17.next = 5;
              break;
            }
            _context17.next = 3;
            return _grabNewChunkWithRow(new_index, false, null, false, null, function () {
              _selectRow(new_index);
            });
          case 3:
            _context17.next = 6;
            break;
          case 5:
            pDispatch({
              type: "UPDATE_SELECT_STATE",
              select_state: {
                selected_resource: pStateRef.current.data_dict[new_index],
                multi_select: false,
                list_of_selected: [pStateRef.current.data_dict[new_index].name],
                list_of_selected_types: [pStateRef.current.data_dict[new_index].res_type],
                selected_rows: [pStateRef.current.data_dict[new_index]],
                selectedRegions: [_table.Regions.row(new_index)]
              }
            });
          case 6:
          case "end":
            return _context17.stop();
        }
      }, _callee17);
    }));
    return _selectRow2.apply(this, arguments);
  }
  function _open_raw(_x8) {
    return _open_raw2.apply(this, arguments);
  }
  function _open_raw2() {
    _open_raw2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee18(selected_resource) {
      var data, html, blob, url;
      return _regeneratorRuntime().wrap(function _callee18$(_context18) {
        while (1) switch (_context18.prev = _context18.next) {
          case 0:
            statusFuncs.clearStatus();
            if (!(selected_resource.type == "freeform")) {
              _context18.next = 11;
              break;
            }
            _context18.next = 4;
            return (0, _communication_react.postPromise)("host", "open_raw", {
              collection_name: selected_resource.name
            });
          case 4:
            data = _context18.sent;
            html = data["the_html"];
            blob = new Blob([html], {
              type: "text/html"
            });
            url = URL.createObjectURL(blob);
            window.open(url, "_blank");
            // window.open($SCRIPT_ROOT + "/open_raw/" + selected_resource.name)
            _context18.next = 12;
            break;
          case 11:
            statusFuncs.statusMessage("Only Freeform documents can be raw opened", 5);
          case 12:
          case "end":
            return _context18.stop();
        }
      }, _callee18);
    }));
    return _open_raw2.apply(this, arguments);
  }
  function _view_resource(_x9) {
    return _view_resource2.apply(this, arguments);
  }
  function _view_resource2() {
    _view_resource2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee19(selected_resource) {
      var the_view,
        force_new_tab,
        resource_name,
        _args19 = arguments;
      return _regeneratorRuntime().wrap(function _callee19$(_context19) {
        while (1) switch (_context19.prev = _context19.next) {
          case 0:
            the_view = _args19.length > 1 && _args19[1] !== undefined ? _args19[1] : null;
            force_new_tab = _args19.length > 2 && _args19[2] !== undefined ? _args19[2] : false;
            resource_name = selected_resource.name;
            statusFuncs.setStatus({
              show_spinner: true,
              status_message: "Opening ..."
            });
            if (!(window.in_context && !force_new_tab)) {
              _context19.next = 8;
              break;
            }
            try {
              props.handleCreateViewer(selected_resource.res_type, resource_name, statusFuncs.clearStatus);
            } catch (e) {
              statusFuncs.clearStatus();
              errorDrawerFuncs.addFromError("Error viewing resource ".concat(resource_name), e);
            }
            _context19.next = 13;
            break;
          case 8:
            if (the_view == null) {
              the_view = view_views(props.is_repository)[selected_resource.res_type];
            }
            statusFuncs.clearStatus();
            if (!(the_view == null)) {
              _context19.next = 12;
              break;
            }
            return _context19.abrupt("return");
          case 12:
            window.open($SCRIPT_ROOT + the_view + resource_name);
          case 13:
          case "end":
            return _context19.stop();
        }
      }, _callee19);
    }));
    return _view_resource2.apply(this, arguments);
  }
  function _duplicate_func() {
    return _duplicate_func2.apply(this, arguments);
  }
  function _duplicate_func2() {
    _duplicate_func2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee20() {
      var row,
        the_row,
        res_name,
        res_type,
        data,
        new_name,
        result_dict,
        _args20 = arguments;
      return _regeneratorRuntime().wrap(function _callee20$(_context20) {
        while (1) switch (_context20.prev = _context20.next) {
          case 0:
            row = _args20.length > 0 && _args20[0] !== undefined ? _args20[0] : null;
            the_row = row ? row : pStateRef.current.select_state.selected_resource;
            res_name = the_row.name;
            res_type = the_row.res_type;
            _context20.prev = 4;
            _context20.next = 7;
            return (0, _communication_react.postPromise)("host", "get_resource_names_task", {
              res_type: res_type
            });
          case 7:
            data = _context20.sent;
            _context20.next = 10;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Duplicate ".concat(res_type),
              field_title: "New Name",
              default_value: res_name,
              existing_names: data.res_names,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 10:
            new_name = _context20.sent;
            result_dict = {
              "new_res_name": new_name,
              "res_to_copy": res_name,
              "is_repository": false,
              "res_type": res_type
            };
            _context20.next = 14;
            return (0, _communication_react.postPromise)("host", "create_duplicate_resource_task", result_dict);
          case 14:
            _context20.next = 19;
            break;
          case 16:
            _context20.prev = 16;
            _context20.t0 = _context20["catch"](4);
            if (_context20.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error duplicating resource ".concat(res_name), _context20.t0);
            }
          case 19:
          case "end":
            return _context20.stop();
        }
      }, _callee20, null, [[4, 16]]);
    }));
    return _duplicate_func2.apply(this, arguments);
  }
  function _delete_func(_x10) {
    return _delete_func2.apply(this, arguments);
  }
  function _delete_func2() {
    _delete_func2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee21(resource) {
      var res_list, confirm_text, _res_name, first_index, _iterator6, _step6, row, ind;
      return _regeneratorRuntime().wrap(function _callee21$(_context21) {
        while (1) switch (_context21.prev = _context21.next) {
          case 0:
            res_list = resource ? [resource] : pStateRef.current.select_state.selected_rows;
            if (res_list.length == 1) {
              _res_name = res_list[0].name;
              confirm_text = "Are you sure that you want to delete ".concat(_res_name, "?");
            } else {
              confirm_text = "Are you sure that you want to delete multiple items?";
            }
            first_index = 99999;
            _iterator6 = _createForOfIteratorHelper(pStateRef.current.select_state.selected_rows);
            try {
              for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
                row = _step6.value;
                ind = parseInt((0, _library_pane_reducer.get_index)(row.name, row.res_type, pStateRef.current.data_dict));
                if (ind < first_index) {
                  first_index = ind;
                }
              }
            } catch (err) {
              _iterator6.e(err);
            } finally {
              _iterator6.f();
            }
            _context21.prev = 5;
            _context21.next = 8;
            return dialogFuncs.showModalPromise("ConfirmDialog", {
              title: "Delete resources",
              text_body: confirm_text,
              cancel_text: "do nothing",
              submit_text: "delete",
              handleClose: dialogFuncs.hideModal
            });
          case 8:
            _context21.next = 10;
            return (0, _communication_react.postPromise)("host", "delete_resource_list_task", {
              "resource_list": res_list
            });
          case 10:
            _context21.next = 15;
            break;
          case 12:
            _context21.prev = 12;
            _context21.t0 = _context21["catch"](5);
            if (_context21.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error duplicating resource ".concat(res_name), _context21.t0);
            }
          case 15:
          case "end":
            return _context21.stop();
        }
      }, _callee21, null, [[5, 12]]);
    }));
    return _delete_func2.apply(this, arguments);
  }
  function _rename_func() {
    return _rename_func2.apply(this, arguments);
  }
  function _rename_func2() {
    _rename_func2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee22() {
      var row,
        res_type,
        res_name,
        data,
        res_names,
        index,
        new_name,
        _args22 = arguments;
      return _regeneratorRuntime().wrap(function _callee22$(_context22) {
        while (1) switch (_context22.prev = _context22.next) {
          case 0:
            row = _args22.length > 0 && _args22[0] !== undefined ? _args22[0] : null;
            if (!row) {
              res_type = pStateRef.current.select_state.selected_resource.res_type;
              res_name = pStateRef.current.select_state.selected_resource.name;
            } else {
              res_type = row.res_type;
              res_name = row.name;
            }
            _context22.prev = 2;
            _context22.next = 5;
            return (0, _communication_react.postPromise)("host", "get_resource_names_task", {
              res_type: res_type
            });
          case 5:
            data = _context22.sent;
            res_names = data["res_names"];
            index = res_names.indexOf(res_name);
            if (index >= 0) {
              res_names.splice(index, 1);
            }
            _context22.next = 11;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Rename ".concat(res_type),
              field_title: "New Name",
              handleClose: dialogFuncs.hideModal,
              default_value: res_name,
              existing_names: res_names,
              checkboxes: []
            });
          case 11:
            new_name = _context22.sent;
            _context22.next = 14;
            return (0, _communication_react.postPromise)("host", "rename_resource_task", {
              old_name: res_name,
              res_type: res_type,
              new_name: new_name
            });
          case 14:
            _context22.next = 19;
            break;
          case 16:
            _context22.prev = 16;
            _context22.t0 = _context22["catch"](2);
            if (_context22.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error renaming resource ".concat(res_name), _context22.t0);
            }
          case 19:
          case "end":
            return _context22.stop();
        }
      }, _callee22, null, [[2, 16]]);
    }));
    return _rename_func2.apply(this, arguments);
  }
  function _repository_copy_func() {
    return _repository_copy_func2.apply(this, arguments);
  }
  function _repository_copy_func2() {
    _repository_copy_func2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee23() {
      var res_type, res_name, data, new_name, result_dict, _result_dict;
      return _regeneratorRuntime().wrap(function _callee23$(_context23) {
        while (1) switch (_context23.prev = _context23.next) {
          case 0:
            if (pStateRef.current.select_state.multi_select) {
              _context23.next = 22;
              break;
            }
            res_type = pStateRef.current.select_state.selected_resource.res_type;
            res_name = pStateRef.current.select_state.selected_resource.name;
            _context23.prev = 3;
            _context23.next = 6;
            return (0, _communication_react.postPromise)("host", "get_resource_names_task", {
              res_type: res_type
            });
          case 6:
            data = _context23.sent;
            _context23.next = 9;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Import ".concat(res_type),
              field_title: "New Name",
              default_value: res_name,
              existing_names: data.res_names,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 9:
            new_name = _context23.sent;
            result_dict = {
              "res_type": res_type,
              "res_name": res_name,
              "new_res_name": new_name
            };
            _context23.next = 13;
            return (0, _communication_react.postPromise)("host", "copy_from_repository_task", result_dict);
          case 13:
            statusFuncs.statusMessage("Imported Resource ".concat(res_name));
            return _context23.abrupt("return", res_name);
          case 17:
            _context23.prev = 17;
            _context23.t0 = _context23["catch"](3);
            if (_context23.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error getting resources names", _context23.t0);
            }
          case 20:
            _context23.next = 33;
            break;
          case 22:
            _result_dict = {
              "selected_rows": pStateRef.current.select_state.selected_rows
            };
            _context23.prev = 23;
            _context23.next = 26;
            return (0, _communication_react.postPromise)("host", "copy_from_repository_task", _result_dict);
          case 26:
            statusFuncs.statusMessage("Imported Resources");
            _context23.next = 32;
            break;
          case 29:
            _context23.prev = 29;
            _context23.t1 = _context23["catch"](23);
            errorDrawerFuncs.addFromError("Error importing resources", _context23.t1);
          case 32:
            return _context23.abrupt("return", "");
          case 33:
          case "end":
            return _context23.stop();
        }
      }, _callee23, null, [[3, 17], [23, 29]]);
    }));
    return _repository_copy_func2.apply(this, arguments);
  }
  function _send_repository_func() {
    return _send_repository_func2.apply(this, arguments);
  }
  function _send_repository_func2() {
    _send_repository_func2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee24() {
      var res_type, res_name, data, new_name, result_dict, _result_dict2;
      return _regeneratorRuntime().wrap(function _callee24$(_context24) {
        while (1) switch (_context24.prev = _context24.next) {
          case 0:
            if (pStateRef.current.select_state.multi_select) {
              _context24.next = 21;
              break;
            }
            res_type = pStateRef.current.select_state.selected_resource.res_type;
            res_name = pStateRef.current.select_state.selected_resource.name;
            _context24.prev = 3;
            _context24.next = 6;
            return (0, _communication_react.postPromise)("host", "get_resource_names_task", {
              res_type: res_type,
              is_repository: true
            });
          case 6:
            data = _context24.sent;
            _context24.next = 9;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Share ".concat(res_type),
              field_title: "New ".concat(res_type, " Name"),
              default_value: res_name,
              existing_names: data.res_names,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 9:
            new_name = _context24.sent;
            result_dict = {
              "res_type": res_type,
              "res_name": res_name,
              "new_res_name": new_name
            };
            _context24.next = 13;
            return (0, _communication_react.postPromise)("host", 'send_to_repository_task', result_dict);
          case 13:
            statusFuncs.statusMessage("Shared resource ".concat(res_name));
            _context24.next = 19;
            break;
          case 16:
            _context24.prev = 16;
            _context24.t0 = _context24["catch"](3);
            if (_context24.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error sharing resource ".concat(res_name), _context24.t0);
            }
          case 19:
            _context24.next = 32;
            break;
          case 21:
            _result_dict2 = {
              "selected_rows": pStateRef.current.select_state.selected_rows
            };
            _context24.prev = 22;
            _context24.next = 25;
            return (0, _communication_react.postPromise)("host", 'send_to_repository_task', _result_dict2);
          case 25:
            statusFuncs.statusMessage("Shared resources");
            _context24.next = 31;
            break;
          case 28:
            _context24.prev = 28;
            _context24.t1 = _context24["catch"](22);
            errorDrawerFuncs.addFromError("Error sharing resources", _context24.t1);
          case 31:
            return _context24.abrupt("return", "");
          case 32:
          case "end":
            return _context24.stop();
        }
      }, _callee24, null, [[3, 16], [22, 28]]);
    }));
    return _send_repository_func2.apply(this, arguments);
  }
  function _refresh_func() {
    return _refresh_func2.apply(this, arguments);
  }
  function _refresh_func2() {
    _refresh_func2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee25() {
      var callback,
        _args25 = arguments;
      return _regeneratorRuntime().wrap(function _callee25$(_context25) {
        while (1) switch (_context25.prev = _context25.next) {
          case 0:
            callback = _args25.length > 0 && _args25[0] !== undefined ? _args25[0] : null;
            _context25.next = 3;
            return _grabNewChunkWithRow(0, true, null, true, callback);
          case 3:
          case "end":
            return _context25.stop();
        }
      }, _callee25);
    }));
    return _refresh_func2.apply(this, arguments);
  }
  function _new_notebook() {
    return _new_notebook2.apply(this, arguments);
  }
  function _new_notebook2() {
    _new_notebook2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee26() {
      return _regeneratorRuntime().wrap(function _callee26$(_context26) {
        while (1) switch (_context26.prev = _context26.next) {
          case 0:
            if (window.in_context) {
              try {
                props.handleCreateViewer("new-notebook");
              } catch (e) {
                errorDrawerFuncs.addFromError("Error creating new notebook", e);
              }
            } else {
              window.open("".concat($SCRIPT_ROOT, "/new_notebook"));
            }
          case 1:
          case "end":
            return _context26.stop();
        }
      }, _callee26);
    }));
    return _new_notebook2.apply(this, arguments);
  }
  function _new_project() {
    return _new_project2.apply(this, arguments);
  }
  function _new_project2() {
    _new_project2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee27() {
      return _regeneratorRuntime().wrap(function _callee27$(_context27) {
        while (1) switch (_context27.prev = _context27.next) {
          case 0:
            if (window.in_context) {
              try {
                props.handleCreateViewer("new-project");
              } catch (e) {
                errorDrawerFuncs.addFromError("Error creating new project", e);
              }
            } else {
              window.open("".concat($SCRIPT_ROOT, "/new_project"));
            }
          case 1:
          case "end":
            return _context27.stop();
        }
      }, _callee27);
    }));
    return _new_project2.apply(this, arguments);
  }
  function _downloadJupyter() {
    return _downloadJupyter2.apply(this, arguments);
  }
  function _downloadJupyter2() {
    _downloadJupyter2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee28() {
      var res_name, new_name;
      return _regeneratorRuntime().wrap(function _callee28$(_context28) {
        while (1) switch (_context28.prev = _context28.next) {
          case 0:
            res_name = pStateRef.current.select_state.selected_resource.name;
            _context28.prev = 1;
            _context28.next = 4;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Download Notebook as Jupyter Notebook",
              field_title: "New File Name",
              default_value: res_name + ".ipynb",
              existing_names: [],
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 4:
            new_name = _context28.sent;
            window.open("".concat($SCRIPT_ROOT, "/download_jupyter/") + res_name + "/" + new_name);
            _context28.next = 11;
            break;
          case 8:
            _context28.prev = 8;
            _context28.t0 = _context28["catch"](1);
            errorDrawerFuncs.addFromError("Error downloading jupyter notebook", _context28.t0);
          case 11:
          case "end":
            return _context28.stop();
        }
      }, _callee28, null, [[1, 8]]);
    }));
    return _downloadJupyter2.apply(this, arguments);
  }
  function _showJupyterImport() {
    dialogFuncs.showModal("FileImportDialog", {
      title: "Import Jupyter Notebook",
      res_type: "project",
      allowed_file_types: ".ipynb",
      checkboxes: [],
      chunking: false,
      chunkSize: null,
      forceChunking: false,
      process_handler: _import_jupyter,
      tsocket: props.tsocket,
      combine: false,
      show_csv_options: false,
      after_upload: null,
      show_address_selector: false,
      initial_address: null,
      handleClose: dialogFuncs.hideModal,
      handleCancel: null
    });
  }
  function _import_jupyter(myDropZone, setCurrentUrl) {
    var new_url = "import_jupyter/".concat(props.library_id);
    myDropZone.options.url = new_url;
    setCurrentUrl(new_url);
    myDropZone.processQueue();
  }
  function _combineCollections() {
    return _combineCollections2.apply(this, arguments);
  }
  function _combineCollections2() {
    _combineCollections2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee29() {
      var res_name, data, other_name, _data, new_name;
      return _regeneratorRuntime().wrap(function _callee29$(_context29) {
        while (1) switch (_context29.prev = _context29.next) {
          case 0:
            res_name = pStateRef.current.select_state.selected_resource.name;
            if (pStateRef.current.select_state.multi_select) {
              _context29.next = 22;
              break;
            }
            _context29.prev = 2;
            _context29.next = 5;
            return (0, _communication_react.postPromise)("host", "get_resource_names_tasks", {
              res_type: "collection"
            });
          case 5:
            data = _context29.sent;
            _context29.next = 8;
            return dialogFuncs.showModalPromise("SelectDialog", {
              title: "Select a new collection to combine with " + res_name,
              select_label: "Collection to Combine",
              cancel_text: "Cancel",
              submit_text: "Combine",
              option_list: data.res_names,
              handleClose: dialogFuncs.hideModal
            });
          case 8:
            other_name = _context29.sent;
            statusFuncs.startSpinner();
            // const target = `combine_collections/${res_name}/${other_name}`;
            _context29.next = 12;
            return (0, _communication_react.postPromise)("host", "combine_collections_task", {
              base_collection_name: res_name,
              collection_to_add: other_name
            });
          case 12:
            statusFuncs.stopSpinner();
            statusFuncs.statusMessage("Combined Collections");
            _context29.next = 20;
            break;
          case 16:
            _context29.prev = 16;
            _context29.t0 = _context29["catch"](2);
            if (_context29.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error combining collections", _context29.t0);
            }
            statusFuncs.stopSpinner();
          case 20:
            _context29.next = 37;
            break;
          case 22:
            _context29.prev = 22;
            _context29.next = 25;
            return (0, _communication_react.postPromise)("host", "get_resource_names_tasks", {
              res_type: "collection"
            });
          case 25:
            _data = _context29.sent;
            _context29.next = 28;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Combine Collections",
              field_title: "Name for combined collection",
              default_value: "NewCollection",
              existing_names: _data.res_names,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 28:
            new_name = _context29.sent;
            _context29.next = 31;
            return (0, _communication_react.postPromise)("host", "combine_to_new_collection", {
              "original_collections": pStateRef.current.select_state.list_of_selected,
              "new_name": new_name
            });
          case 31:
            _context29.next = 37;
            break;
          case 33:
            _context29.prev = 33;
            _context29.t1 = _context29["catch"](22);
            if (_context29.t1 != "canceled") {
              errorDrawerFuncs.addFromError("Error combining collections", _context29.t1);
            }
            statusFuncs.stopSpinner();
          case 37:
          case "end":
            return _context29.stop();
        }
      }, _callee29, null, [[2, 16], [22, 33]]);
    }));
    return _combineCollections2.apply(this, arguments);
  }
  function _downloadCollection() {
    return _downloadCollection2.apply(this, arguments);
  }
  function _downloadCollection2() {
    _downloadCollection2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee30() {
      var resource_name,
        res_name,
        new_name,
        _args30 = arguments;
      return _regeneratorRuntime().wrap(function _callee30$(_context30) {
        while (1) switch (_context30.prev = _context30.next) {
          case 0:
            resource_name = _args30.length > 0 && _args30[0] !== undefined ? _args30[0] : null;
            res_name = resource_name ? resource_name : pStateRef.current.select_state.selected_resource.name;
            _context30.prev = 2;
            _context30.next = 5;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Download Collection",
              field_title: "New File Name",
              default_value: res_name,
              existing_names: [],
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 5:
            new_name = _context30.sent;
            window.open("".concat($SCRIPT_ROOT, "/download_collection/") + res_name + "/" + new_name);
            _context30.next = 12;
            break;
          case 9:
            _context30.prev = 9;
            _context30.t0 = _context30["catch"](2);
            if (_context30.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error combing collections", _context30.t0);
            }
          case 12:
          case "end":
            return _context30.stop();
        }
      }, _callee30, null, [[2, 9]]);
    }));
    return _downloadCollection2.apply(this, arguments);
  }
  function _showCollectionImport() {
    dialogFuncs.showModal("FileImportDialog", {
      title: "Import Collection",
      res_type: "collection",
      allowed_file_types: ".csv,.tsv,.txt,.xls,.xlsx,.html",
      checkboxes: [{
        "checkname": "import_as_freeform",
        "checktext": "Import as freeform"
      }],
      process_handler: _import_collection,
      chunking: false,
      chunkSize: null,
      forceChunking: false,
      tsocket: props.tsocket,
      combine: true,
      show_csv_options: true,
      after_upload: null,
      show_address_selector: false,
      initial_address: null,
      handleClose: dialogFuncs.hideModal,
      handleCancel: null
    });
  }
  function _import_collection(_x11, _x12, _x13, _x14) {
    return _import_collection2.apply(this, arguments);
  }
  function _import_collection2() {
    _import_collection2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee31(myDropZone, setCurrentUrl, new_name, check_results) {
      var csv_options,
        doc_type,
        data,
        new_url,
        _args31 = arguments;
      return _regeneratorRuntime().wrap(function _callee31$(_context31) {
        while (1) switch (_context31.prev = _context31.next) {
          case 0:
            csv_options = _args31.length > 4 && _args31[4] !== undefined ? _args31[4] : null;
            doc_type = check_results["import_as_freeform"] ? "freeform" : "table";
            _context31.prev = 2;
            _context31.next = 5;
            return (0, _communication_react.postPromise)("host", "create_empty_collection_task", {
              "collection_name": new_name,
              "doc_type": doc_type,
              "library_id": props.library_id,
              "csv_options": csv_options
            });
          case 5:
            data = _context31.sent;
            if (data.success) {
              _context31.next = 9;
              break;
            }
            errorDrawerFuncs.addErrorDrawerEntry({
              title: "Error creating collection",
              content: data.message
            });
            return _context31.abrupt("return");
          case 9:
            new_url = "append_documents_to_collection/".concat(new_name, "/").concat(doc_type, "/").concat(props.library_id);
            myDropZone.options.url = new_url;
            setCurrentUrl(new_url);
            myDropZone.processQueue();
            _context31.next = 18;
            break;
          case 15:
            _context31.prev = 15;
            _context31.t0 = _context31["catch"](2);
            errorDrawerFuncs.addFromError("Error importing document", _context31.t0);
          case 18:
          case "end":
            return _context31.stop();
        }
      }, _callee31, null, [[2, 15]]);
    }));
    return _import_collection2.apply(this, arguments);
  }
  function _showHistoryViewer() {
    window.open("".concat($SCRIPT_ROOT, "/show_history_viewer/").concat(pStateRef.current.select_state.selected_resource.name));
  }
  function _compare_tiles() {
    var res_names = pStateRef.current.select_state.list_of_selected;
    if (res_names.length == 0) return;
    if (res_names.length == 1) {
      window.open("".concat($SCRIPT_ROOT, "/show_tile_differ/").concat(res_names[0]));
    } else if (res_names.length == 2) {
      window.open("".concat($SCRIPT_ROOT, "/show_tile_differ/both_names/").concat(res_names[0], "/").concat(res_names[1]));
    } else {
      (0, _toaster.doFlash)({
        "alert-type": "alert-warning",
        "message": "Select only one or two tiles before launching compare"
      });
    }
  }
  function _load_tile() {
    return _load_tile2.apply(this, arguments);
  }
  function _load_tile2() {
    _load_tile2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee32() {
      var resource,
        res_name,
        _args32 = arguments;
      return _regeneratorRuntime().wrap(function _callee32$(_context32) {
        while (1) switch (_context32.prev = _context32.next) {
          case 0:
            resource = _args32.length > 0 && _args32[0] !== undefined ? _args32[0] : null;
            res_name = resource ? resource.name : pStateRef.current.select_state.selected_resource.name;
            _context32.prev = 2;
            _context32.next = 5;
            return (0, _communication_react.postPromise)("host", "load_tile_module_task", {
              "tile_module_name": res_name,
              "user_id": window.user_id
            });
          case 5:
            statusFuncs.statusMessage("Loaded tile ".concat(res_name));
            _context32.next = 11;
            break;
          case 8:
            _context32.prev = 8;
            _context32.t0 = _context32["catch"](2);
            errorDrawerFuncs.addFromError("Error loading tile", _context32.t0);
          case 11:
          case "end":
            return _context32.stop();
        }
      }, _callee32, null, [[2, 8]]);
    }));
    return _load_tile2.apply(this, arguments);
  }
  function _unload_module() {
    return _unload_module2.apply(this, arguments);
  }
  function _unload_module2() {
    _unload_module2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee33() {
      var resource,
        res_name,
        _args33 = arguments;
      return _regeneratorRuntime().wrap(function _callee33$(_context33) {
        while (1) switch (_context33.prev = _context33.next) {
          case 0:
            resource = _args33.length > 0 && _args33[0] !== undefined ? _args33[0] : null;
            res_name = resource ? resource.name : pStateRef.current.select_state.selected_resource.name;
            _context33.prev = 2;
            _context33.next = 5;
            return (0, _communication_react.postPromise)("host", "unload_one_module_task", {
              "tile_module_name": res_name
            });
          case 5:
            statusFuncs.statusMessage("Tile unloaded");
            _context33.next = 11;
            break;
          case 8:
            _context33.prev = 8;
            _context33.t0 = _context33["catch"](2);
            errorDrawerFuncs.addFromError("Error unloading tile", _context33.t0);
          case 11:
          case "end":
            return _context33.stop();
        }
      }, _callee33, null, [[2, 8]]);
    }));
    return _unload_module2.apply(this, arguments);
  }
  function _unload_all_tiles() {
    return _unload_all_tiles2.apply(this, arguments);
  }
  function _unload_all_tiles2() {
    _unload_all_tiles2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee34() {
      return _regeneratorRuntime().wrap(function _callee34$(_context34) {
        while (1) switch (_context34.prev = _context34.next) {
          case 0:
            _context34.prev = 0;
            _context34.next = 3;
            return (0, _communication_react.postPromise)("host", "unload_all_tiles_task", {});
          case 3:
            statusFuncs.statusMessage("Unloaded all tiles");
            _context34.next = 9;
            break;
          case 6:
            _context34.prev = 6;
            _context34.t0 = _context34["catch"](0);
            errorDrawerFuncs.addFromError("Error unloading tiles", _context34.t0);
          case 9:
          case "end":
            return _context34.stop();
        }
      }, _callee34, null, [[0, 6]]);
    }));
    return _unload_all_tiles2.apply(this, arguments);
  }
  function _new_in_creator(_x15) {
    return _new_in_creator2.apply(this, arguments);
  }
  function _new_in_creator2() {
    _new_in_creator2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee35(template_name) {
      var data, new_name, result_dict;
      return _regeneratorRuntime().wrap(function _callee35$(_context35) {
        while (1) switch (_context35.prev = _context35.next) {
          case 0:
            _context35.prev = 0;
            _context35.next = 3;
            return (0, _communication_react.postPromise)("host", "get_tile_names_task", {});
          case 3:
            data = _context35.sent;
            _context35.next = 6;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "New Tile",
              field_title: "New Tile Name",
              default_value: "NewTileModule",
              existing_names: data.tile_names,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 6:
            new_name = _context35.sent;
            result_dict = {
              "template_name": template_name,
              "new_tile_name": new_name,
              "last_saved": "creator"
            };
            _context35.next = 10;
            return (0, _communication_react.postPromise)("host", "create_tile_from_repository_template", result_dict);
          case 10:
            _context35.next = 12;
            return _view_resource({
              name: String(new_name),
              res_type: "tile"
            });
          case 12:
            _context35.next = 17;
            break;
          case 14:
            _context35.prev = 14;
            _context35.t0 = _context35["catch"](0);
            if (_context35.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error creating tile module", _context35.t0);
            }
          case 17:
          case "end":
            return _context35.stop();
        }
      }, _callee35, null, [[0, 14]]);
    }));
    return _new_in_creator2.apply(this, arguments);
  }
  function _new_metabook() {
    return _new_metabook2.apply(this, arguments);
  }
  function _new_metabook2() {
    _new_metabook2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee36() {
      var data, new_name, result_dict, new_metabook_data;
      return _regeneratorRuntime().wrap(function _callee36$(_context36) {
        while (1) switch (_context36.prev = _context36.next) {
          case 0:
            _context36.prev = 0;
            _context36.next = 3;
            return (0, _communication_react.postPromise)("host", "get_metabook_names_task", {});
          case 3:
            data = _context36.sent;
            _context36.next = 6;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "New Metabook Resource",
              field_title: "New Metabook Name",
              default_value: "NewMetabookResource",
              existing_names: data.res_names,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 6:
            new_name = _context36.sent;
            result_dict = {
              "metabook_name": new_name
            };
            _context36.next = 10;
            return (0, _communication_react.postPromise)("host", "create_empty_metabook", result_dict);
          case 10:
            new_metabook_data = _context36.sent;
            props.setCurrentMetabook(new_metabook_data._id);
            _context36.next = 17;
            break;
          case 14:
            _context36.prev = 14;
            _context36.t0 = _context36["catch"](0);
            if (_context36.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error creating metabook resource", _context36.t0);
            }
          case 17:
          case "end":
            return _context36.stop();
        }
      }, _callee36, null, [[0, 14]]);
    }));
    return _new_metabook2.apply(this, arguments);
  }
  function _new_list(_x16) {
    return _new_list2.apply(this, arguments);
  }
  function _new_list2() {
    _new_list2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee37(template_name) {
      var data, new_name, result_dict;
      return _regeneratorRuntime().wrap(function _callee37$(_context37) {
        while (1) switch (_context37.prev = _context37.next) {
          case 0:
            _context37.prev = 0;
            _context37.next = 3;
            return (0, _communication_react.postPromise)("host", "get_list_names_task", {});
          case 3:
            data = _context37.sent;
            _context37.next = 6;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "New List Resource",
              field_title: "New List Name",
              default_value: "NewListResource",
              existing_names: data.list_names,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 6:
            new_name = _context37.sent;
            result_dict = {
              "template_name": template_name,
              "new_list_name": new_name
            };
            _context37.next = 10;
            return (0, _communication_react.postPromise)("host", "create_list_from_repository_template", result_dict);
          case 10:
            _context37.next = 12;
            return _view_resource({
              name: String(new_name),
              res_type: "list"
            }, "/view_list/");
          case 12:
            _context37.next = 17;
            break;
          case 14:
            _context37.prev = 14;
            _context37.t0 = _context37["catch"](0);
            if (_context37.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error creating list resource", _context37.t0);
            }
          case 17:
          case "end":
            return _context37.stop();
        }
      }, _callee37, null, [[0, 14]]);
    }));
    return _new_list2.apply(this, arguments);
  }
  function _add_list(myDropZone, setCurrentUrl) {
    var new_url = "import_list/".concat(props.library_id);
    myDropZone.options.url = new_url;
    setCurrentUrl(new_url);
    myDropZone.processQueue();
  }
  function _showListImport() {
    dialogFuncs.showModal("FileImportDialog", {
      title: "Import List",
      res_type: "list",
      allowed_file_types: "text/*",
      checkboxes: [],
      chunking: false,
      chunkSize: null,
      forceChunking: false,
      process_handler: _add_list,
      tsocket: props.tsocket,
      combine: false,
      show_csv_options: false,
      after_upload: null,
      show_address_selector: false,
      initial_address: null,
      handleClose: dialogFuncs.hideModal,
      handleCancel: null
    });
  }
  function _new_code(_x17) {
    return _new_code2.apply(this, arguments);
  }
  function _new_code2() {
    _new_code2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee38(template_name) {
      var data, new_name, result_dict;
      return _regeneratorRuntime().wrap(function _callee38$(_context38) {
        while (1) switch (_context38.prev = _context38.next) {
          case 0:
            _context38.prev = 0;
            _context38.next = 3;
            return (0, _communication_react.postPromise)("host", "get_code_names_task", {});
          case 3:
            data = _context38.sent;
            _context38.next = 6;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "New code Resource",
              field_title: "New Code Resource Name",
              default_value: "NewCodeResource",
              existing_names: data.code_names,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 6:
            new_name = _context38.sent;
            result_dict = {
              "template_name": template_name,
              "new_code_name": new_name
            };
            _context38.next = 10;
            return (0, _communication_react.postPromise)("host", "create_code_from_repository_template", result_dict);
          case 10:
            _context38.next = 12;
            return _view_resource({
              name: String(new_name),
              res_type: "code"
            }, "/view_code/");
          case 12:
            _context38.next = 17;
            break;
          case 14:
            _context38.prev = 14;
            _context38.t0 = _context38["catch"](0);
            if (_context38.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error creating code resource", _context38.t0);
            }
          case 17:
          case "end":
            return _context38.stop();
        }
      }, _callee38, null, [[0, 14]]);
    }));
    return _new_code2.apply(this, arguments);
  }
  function setContextMenuItems(context_menu_items) {
    pDispatch({
      type: "SET_CONTEXT_MENU_ITEMS",
      context_menu_items: context_menu_items
    });
  }
  function toggleFilterBar() {
    pDispatch({
      type: "TOGGLE_FILTER_BAR"
    });
  }
  function _menu_funcs() {
    return {
      view_func: _view_func,
      setCurrentMetabook: props.setCurrentMetabook,
      send_repository_func: _send_repository_func,
      repository_copy_func: _repository_copy_func,
      duplicate_func: _duplicate_func,
      refresh_func: _refresh_func,
      delete_func: _delete_func,
      rename_func: _rename_func,
      new_notebook: _new_notebook,
      new_project: _new_project,
      downloadJupyter: _downloadJupyter,
      showJupyterImport: _showJupyterImport,
      combineCollections: _combineCollections,
      showCollectionImport: _showCollectionImport,
      downloadCollection: _downloadCollection,
      new_in_creator: _new_in_creator,
      load_tile: _load_tile,
      unload_module: _unload_module,
      unload_all_tiles: _unload_all_tiles,
      showHistoryViewer: _showHistoryViewer,
      compare_tiles: _compare_tiles,
      new_metabook: _new_metabook,
      new_list: _new_list,
      showListImport: _showListImport,
      new_code: _new_code
    };
  }
  var res_type = pStateRef.current.select_state.selected_resource.res_type;
  var res_name = pStateRef.current.select_state.selected_resource.name;
  var right_pane = /*#__PURE__*/_react["default"].createElement(_combined_metadata.CombinedMetadata, {
    key: "combined-metadata-library",
    elevation: 0,
    tsocket: props.tsocket,
    res_name: res_name,
    res_type: res_type,
    list_of_selected: pStateRef.current.select_state.list_of_selected,
    list_of_selected_types: pStateRef.current.select_state.list_of_selected_types,
    multi_select: pStateRef.current.select_state.multi_select,
    expandWidth: true,
    search_string: pStateRef.current.search_state.search_string,
    search_inside: pStateRef.current.search_state.search_inside,
    readOnly: props.is_repository
  });
  var MenubarClass = props.MenubarClass;
  var column_selector = props.updateColumns ? /*#__PURE__*/_react["default"].createElement(_library_widgets.ColumnSelector, {
    icon_dict: [],
    selectedColumns: props.columns,
    onColumnChange: props.updateColumns
  }) : null;
  var left_pane = /*#__PURE__*/_react["default"].createElement(_library_table_pane.LibraryTablePane, _extends({}, props, {
    pStateRef: pStateRef,
    res_types: res_types,
    setFilterType: _setFilterType,
    toggleFilterBar: toggleFilterBar,
    column_selector: column_selector,
    update_search_state: _update_search_state,
    show_filter_bar: pStateRef.current.show_filter_bar,
    updateTagState: _update_search_state,
    sortColumn: _set_sort_state,
    onSelection: _onTableSelection,
    keyHandler: null,
    initiateDataGrab: _grabNewChunkWithRow,
    renderBodyContextMenu: _renderBodyContextMenu,
    handleRowDoubleClick: _handleRowDoubleClick
  }));
  var selected_types = _selectedTypes();
  selectedTypeRef.current = selected_types.length == 1 ? pState.select_state.selected_resource.res_type : "multi";
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(MenubarClass, _extends({
    selected_resource: pStateRef.current.select_state.selected_resource,
    connection_status: props.connection_status,
    multi_select: pStateRef.current.select_state.multi_select,
    list_of_selected: pStateRef.current.select_state.list_of_selected,
    selected_rows: pStateRef.current.select_state.selected_rows,
    selectedTypeRef: selectedTypeRef
  }, _menu_funcs(), {
    sendContextMenuItems: setContextMenuItems,
    view_resource: _view_resource,
    open_raw: _open_raw
  }, props.errorDrawerFuncs, {
    handleCreateViewer: props.handleCreateViewer,
    library_id: props.library_id // Does this do anything
    ,
    controlled: props.controlled,
    tsocket: props.tsocket
  })), /*#__PURE__*/_react["default"].createElement("div", {
    ref: top_ref,
    style: {
      display: "flex",
      flexGrow: 1,
      width: "100%",
      overflow: "hidden",
      minHeight: 0,
      minWidth: 0,
      position: "relative"
    },
    tabIndex: "0",
    className: "d-flex flex-column",
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp
  }, /*#__PURE__*/_react["default"].createElement(_resizing_allotment.HorizontalPanes, {
    show_handle: true,
    left_pane: left_pane,
    right_pane: right_pane,
    right_pane_overflow: "auto",
    initial_width_fraction: .75
  })));
}
exports.LibraryPane = LibraryPane = /*#__PURE__*/(0, _react.memo)(LibraryPane);
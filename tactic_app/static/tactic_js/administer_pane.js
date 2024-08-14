"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AdminPane = AdminPane;
var _react = _interopRequireWildcard(require("react"));
var _table = require("@blueprintjs/table");
var _library_widgets = require("./library_widgets");
var _resizing_layouts = require("./resizing_layouts2");
var _sizing_tools = require("./sizing_tools");
var _utilities_react = require("./utilities_react");
var _communication_react = require("./communication_react");
var _lodash = _interopRequireDefault(require("lodash"));
var _searchable_console = require("./searchable_console");
var _error_drawer = require("./error_drawer");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function AdminPane(props) {
  props = _objectSpread({
    is_repository: false,
    tsocket: null
  }, props);
  var top_ref = (0, _react.useRef)(null);
  var table_ref = (0, _react.useRef)(null);
  var console_text_ref = (0, _react.useRef)(null);
  var previous_search_spec = (0, _react.useRef)(null);
  var get_url = "grab_".concat(props.res_type, "_list_chunk");
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)({}),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    data_dict = _useStateAndRef2[0],
    set_data_dict = _useStateAndRef2[1],
    data_dict_ref = _useStateAndRef2[2];
  var _useState = (0, _react.useState)(0),
    _useState2 = _slicedToArray(_useState, 2),
    num_rows = _useState2[0],
    set_num_rows = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = _slicedToArray(_useState3, 2),
    awaiting_data = _useState4[0],
    set_awaiting_data = _useState4[1];
  var _useState5 = (0, _react.useState)(false),
    _useState6 = _slicedToArray(_useState5, 2),
    mounted = _useState6[0],
    set_mounted = _useState6[1];
  var _useState7 = (0, _react.useState)(500),
    _useState8 = _slicedToArray(_useState7, 2),
    total_width = _useState8[0],
    set_total_width = _useState8[1];
  var _useSize = (0, _sizing_tools.useSize)(top_ref, 0, "AdminPane"),
    _useSize2 = _slicedToArray(_useSize, 4),
    usable_width = _useSize2[0],
    usable_height = _useSize2[1],
    topX = _useSize2[2],
    topY = _useSize2[3];
  var _useSize3 = (0, _sizing_tools.useSize)(table_ref, 0, "AdminPane"),
    _useSize4 = _slicedToArray(_useSize3, 4),
    table_usable_width = _useSize4[0],
    table_usable_height = _useSize4[1],
    table_topX = _useSize4[2],
    table_topY = _useSize4[3];
  var _useSize5 = (0, _sizing_tools.useSize)(console_text_ref, 0, "AdminConsole"),
    _useSize6 = _slicedToArray(_useSize5, 4),
    console_usable_width = _useSize6[0],
    console_usable_height = _useSize6[1],
    console_topX = _useSize6[2],
    console_topY = _useSize6[3];
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  (0, _react.useEffect)(function () {
    initSocket();
    _grabNewChunkWithRow(0, true, null, true).then(function () {});
  }, []);
  function initSocket() {
    if (props.tsocket != null) {
      props.tsocket.attachListener("update-".concat(props.res_type, "-selector-row"), _handleRowUpdate);
      props.tsocket.attachListener("refresh-".concat(props.res_type, "-selector"), _refresh_func);
    }
  }
  function _getSearchSpec() {
    return {
      search_string: props.search_string,
      sort_field: props.sort_field,
      sort_direction: props.sort_direction
    };
  }
  function _onTableSelection(_x) {
    return _onTableSelection2.apply(this, arguments);
  }
  function _onTableSelection2() {
    _onTableSelection2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(regions) {
      var selected_rows, revised_regions, _iterator2, _step2, region, first_row, last_row, i;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            if (!(regions.length == 0)) {
              _context3.next = 2;
              break;
            }
            return _context3.abrupt("return");
          case 2:
            // Without this get an error when clicking on a body cell
            selected_rows = [];
            revised_regions = [];
            _iterator2 = _createForOfIteratorHelper(regions);
            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                region = _step2.value;
                if (region.hasOwnProperty("rows")) {
                  first_row = region["rows"][0];
                  revised_regions.push(_table.Regions.row(first_row));
                  last_row = region["rows"][1];
                  for (i = first_row; i <= last_row; ++i) {
                    selected_rows.push(data_dict_ref.current[i]);
                    revised_regions.push(_table.Regions.row(i));
                  }
                }
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
            _context3.next = 8;
            return _handleRowSelection(selected_rows);
          case 8:
            _updatePaneState({
              selectedRegions: revised_regions
            });
          case 9:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
    return _onTableSelection2.apply(this, arguments);
  }
  function _grabNewChunkWithRow(_x2) {
    return _grabNewChunkWithRow2.apply(this, arguments);
  }
  function _grabNewChunkWithRow2() {
    _grabNewChunkWithRow2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(row_index) {
      var flush,
        spec_update,
        select,
        callback,
        search_spec,
        query,
        data,
        new_data_dict,
        _args4 = arguments;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            flush = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : false;
            spec_update = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : null;
            select = _args4.length > 3 && _args4[3] !== undefined ? _args4[3] : false;
            callback = _args4.length > 4 && _args4[4] !== undefined ? _args4[4] : null;
            _context4.prev = 4;
            search_spec = _getSearchSpec();
            if (spec_update) {
              search_spec = Object.assign(search_spec, spec_update);
            }
            query = {
              search_spec: search_spec,
              row_number: row_index
            };
            _context4.next = 10;
            return (0, _communication_react.postAjaxPromise)(get_url, query);
          case 10:
            data = _context4.sent;
            if (flush) {
              new_data_dict = data.chunk_dict;
            } else {
              new_data_dict = _lodash["default"].cloneDeep(data_dict_ref.current);
              new_data_dict = Object.assign(new_data_dict, data.chunk_dict);
            }
            previous_search_spec.current = search_spec;
            set_data_dict(new_data_dict);
            set_num_rows(data.num_rows);
            pushCallback(function () {
              if (callback) {
                callback();
              } else if (select) {
                _selectRow(row_index);
              }
            });
            _context4.next = 21;
            break;
          case 18:
            _context4.prev = 18;
            _context4.t0 = _context4["catch"](4);
            errorDrawerFuncs.addFromError("Error grabbing row chunk", _context4.t0);
          case 21:
          case "end":
            return _context4.stop();
        }
      }, _callee4, null, [[4, 18]]);
    }));
    return _grabNewChunkWithRow2.apply(this, arguments);
  }
  function _grabNewChunkWithRowPromise(row_index) {
    var flush = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var spec_update = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var select = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    return new Promise( /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(resolve, reject) {
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _grabNewChunkWithRow(row_index, flush, spec_update, select, resolve);
            case 2:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      return function (_x3, _x4) {
        return _ref.apply(this, arguments);
      };
    }());
  }
  function _initiateDataGrab(row_index) {
    set_awaiting_data(true);
    pushCallback( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
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
    })));
  }
  function _handleRowUpdate(res_dict) {
    var res_idval = res_dict.Id;
    var ind = get_data_dict_index(res_idval);
    var new_data_dict = _lodash["default"].cloneDeep(data_dict_ref.current);
    var the_row = new_data_dict[ind];
    for (var field in res_dict) {
      the_row[field] = res_dict[field];
    }
    if (res_name == props.selected_resource.name) {
      props.updatePaneState({
        "selected_resource": the_row
      });
    }
    set_data_dict(new_data_dict);
  }
  function _updatePaneState(new_state, callback) {
    props.updatePaneState(props.res_type, new_state, callback);
  }
  function _updatePaneStatePromise(_x5) {
    return _updatePaneStatePromise2.apply(this, arguments);
  }
  function _updatePaneStatePromise2() {
    _updatePaneStatePromise2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(new_state) {
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return props.updatePaneStatePromise(props.res_type, new_state);
          case 2:
          case "end":
            return _context5.stop();
        }
      }, _callee5);
    }));
    return _updatePaneStatePromise2.apply(this, arguments);
  }
  function get_data_dict_index(idval) {
    for (var index in data_dict_ref.current) {
      if (data_dict_ref.current[index].Id == idval) {
        return index;
      }
    }
    return null;
  }
  function _delete_row(idval) {
    var ind = get_data_dict_index(idval);
    var new_data_dict = _objectSpread({}, data_dict_ref.current);
    delete new_data_dict[ind];
    set_data_dict(new_data_dict);
  }
  function get_data_dict_entry(name) {
    for (var index in data_dict_ref.current) {
      if (data_dict_ref.current[index].name == name) {
        return data_dict_ref.current[index];
      }
    }
    return null;
  }
  function _handleSplitResize(left_width, right_width, width_fraction) {
    _updatePaneState({
      left_width_fraction: width_fraction
    });
  }
  function _handleRowClick(_x6) {
    return _handleRowClick2.apply(this, arguments);
  }
  function _handleRowClick2() {
    _handleRowClick2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(row_dict) {
      var shift_key_down,
        _args6 = arguments;
      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            shift_key_down = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : false;
            _context6.next = 3;
            return _updatePaneStatePromise({
              selected_resource: row_dict,
              multi_select: false,
              list_of_selected: [row_dict[props.id_field]]
            });
          case 3:
          case "end":
            return _context6.stop();
        }
      }, _callee6);
    }));
    return _handleRowClick2.apply(this, arguments);
  }
  function _handleRowSelection(_x7) {
    return _handleRowSelection2.apply(this, arguments);
  }
  function _handleRowSelection2() {
    _handleRowSelection2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(selected_rows) {
      var row_dict;
      return _regeneratorRuntime().wrap(function _callee7$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
          case 0:
            row_dict = selected_rows[0];
            _context7.next = 3;
            return _handleRowClick(row_dict);
          case 3:
          case "end":
            return _context7.stop();
        }
      }, _callee7);
    }));
    return _handleRowSelection2.apply(this, arguments);
  }
  function _filter_func(resource_dict, search_string) {
    for (var key in resource_dict) {
      if (resource_dict[key].toLowerCase().search(search_string) != -1) {
        return true;
      }
    }
    return resource_dict[props.id_field].toLowerCase().search(search_string) != -1;
  }
  function _update_search_state(_x8) {
    return _update_search_state2.apply(this, arguments);
  }
  function _update_search_state2() {
    _update_search_state2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(new_state) {
      return _regeneratorRuntime().wrap(function _callee8$(_context8) {
        while (1) switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return _updatePaneStatePromise(new_state);
          case 2:
            if (!search_spec_changed(new_state)) {
              _context8.next = 5;
              break;
            }
            _context8.next = 5;
            return _grabNewChunkWithRow(0, true, new_state, true);
          case 5:
          case "end":
            return _context8.stop();
        }
      }, _callee8);
    }));
    return _update_search_state2.apply(this, arguments);
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
  function _set_sort_state(_x9, _x10, _x11) {
    return _set_sort_state2.apply(this, arguments);
  }
  function _set_sort_state2() {
    _set_sort_state2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(column_name, sort_field, direction) {
      var spec_update;
      return _regeneratorRuntime().wrap(function _callee9$(_context9) {
        while (1) switch (_context9.prev = _context9.next) {
          case 0:
            spec_update = {
              sort_field: column_name,
              sort_direction: direction
            };
            _context9.next = 3;
            return _updatePaneState(spec_update);
          case 3:
            if (!search_spec_changed(spec_update)) {
              _context9.next = 6;
              break;
            }
            _context9.next = 6;
            return _grabNewChunkWithRow(0, true, spec_update, true);
          case 6:
          case "end":
            return _context9.stop();
        }
      }, _callee9);
    }));
    return _set_sort_state2.apply(this, arguments);
  }
  function _handleArrowKeyPress(_x12) {
    return _handleArrowKeyPress2.apply(this, arguments);
  }
  function _handleArrowKeyPress2() {
    _handleArrowKeyPress2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10(key) {
      var current_index, new_index, new_selected_res;
      return _regeneratorRuntime().wrap(function _callee10$(_context10) {
        while (1) switch (_context10.prev = _context10.next) {
          case 0:
            current_index = parseInt(get_data_dict_index(props.selected_resource.Id));
            if (!(key == "ArrowDown")) {
              _context10.next = 5;
              break;
            }
            new_index = current_index + 1;
            _context10.next = 8;
            break;
          case 5:
            new_index = current_index - 1;
            if (!(new_index < 0)) {
              _context10.next = 8;
              break;
            }
            return _context10.abrupt("return");
          case 8:
            _context10.next = 10;
            return _selectRow(new_index);
          case 10:
          case "end":
            return _context10.stop();
        }
      }, _callee10);
    }));
    return _handleArrowKeyPress2.apply(this, arguments);
  }
  function _selectRow(_x13) {
    return _selectRow2.apply(this, arguments);
  }
  function _selectRow2() {
    _selectRow2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11(new_index) {
      var new_regions;
      return _regeneratorRuntime().wrap(function _callee11$(_context11) {
        while (1) switch (_context11.prev = _context11.next) {
          case 0:
            if (Object.keys(data_dict_ref.current).includes(String(new_index))) {
              _context11.next = 7;
              break;
            }
            _context11.next = 3;
            return _grabNewChunkWithRowPromise(new_index, false, null, false);
          case 3:
            _context11.next = 5;
            return _selectRow(new_index);
          case 5:
            _context11.next = 9;
            break;
          case 7:
            new_regions = [_table.Regions.row(new_index)];
            _updatePaneState({
              selected_resource: data_dict_ref.current[new_index],
              list_of_selected: [data_dict_ref.current[new_index].name],
              selectedRegions: new_regions
            });
          case 9:
          case "end":
            return _context11.stop();
        }
      }, _callee11);
    }));
    return _selectRow2.apply(this, arguments);
  }
  function _refresh_func() {
    return _refresh_func2.apply(this, arguments);
  }
  function _refresh_func2() {
    _refresh_func2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee12() {
      var callback,
        _args12 = arguments;
      return _regeneratorRuntime().wrap(function _callee12$(_context12) {
        while (1) switch (_context12.prev = _context12.next) {
          case 0:
            callback = _args12.length > 0 && _args12[0] !== undefined ? _args12[0] : null;
            _context12.next = 3;
            return _grabNewChunkWithRow(0, true, null, true, callback);
          case 3:
          case "end":
            return _context12.stop();
        }
      }, _callee12);
    }));
    return _refresh_func2.apply(this, arguments);
  }
  function _setConsoleText(_x14) {
    return _setConsoleText2.apply(this, arguments);
  }
  function _setConsoleText2() {
    _setConsoleText2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee13(the_text) {
      return _regeneratorRuntime().wrap(function _callee13$(_context13) {
        while (1) switch (_context13.prev = _context13.next) {
          case 0:
            _context13.next = 2;
            return _updatePaneStatePromise({
              "console_text": the_text
            });
          case 2:
            if (console_text_ref && console_text_ref.current) {
              console_text_ref.current.scrollTop = console_text_ref.current.scrollHeight;
            }
          case 3:
          case "end":
            return _context13.stop();
        }
      }, _callee13);
    }));
    return _setConsoleText2.apply(this, arguments);
  }
  function _communicateColumnWidthSum(total_width) {
    set_total_width(total_width + 50);
  }
  var new_button_groups;
  var left_width = props.usable_width * props.left_width_fraction;
  var primary_mdata_fields = ["name", "created", "created_for_sort", "updated", "updated_for_sort", "tags", "notes"];
  var additional_metadata = {};
  for (var field in props.selected_resource) {
    if (!primary_mdata_fields.includes(field)) {
      additional_metadata[field] = props.selected_resource[field];
    }
  }
  if (Object.keys(additional_metadata).length == 0) {
    additional_metadata = null;
  }
  var right_pane;
  if (props.res_type == "container") {
    right_pane = /*#__PURE__*/_react["default"].createElement("div", {
      className: "d-flex d-inline",
      ref: console_text_ref,
      style: {
        height: "100%",
        overflow: "hidden",
        marginRight: 50
      }
    }, /*#__PURE__*/_react["default"].createElement(_searchable_console.SearchableConsole, {
      main_id: window.library_id,
      streaming_host: "host",
      container_id: props.selected_resource.Id,
      ref: null,
      outer_style: {
        overflowX: "auto",
        overflowY: "auto",
        height: console_usable_height - _sizing_tools.BOTTOM_MARGIN - 25,
        width: "100%",
        marginTop: 0,
        marginLeft: 5,
        marginRight: 0,
        padding: 15
      },
      showCommandField: true
    }));
  } else {
    right_pane = /*#__PURE__*/_react["default"].createElement("div", null);
  }
  var th_style = {
    "display": "inline-block",
    "verticalAlign": "top",
    "maxHeight": "100%",
    "overflowY": "scroll",
    "lineHeight": 1,
    "whiteSpace": "nowrap",
    "overflowX": "hidden"
  };
  var MenubarClass = props.MenubarClass;
  var column_specs = {};
  var _iterator = _createForOfIteratorHelper(props.colnames),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var col = _step.value;
      column_specs[col] = {
        "sort_field": col,
        "first_sort": "ascending"
      };
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  var left_pane = /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-row",
    style: {
      "maxHeight": "100%"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    ref: table_ref,
    style: {
      width: table_usable_width,
      maxWidth: total_width,
      maxHeight: table_usable_height,
      padding: 15,
      marginTop: 10
    }
  }, /*#__PURE__*/_react["default"].createElement(_library_widgets.SearchForm, {
    allow_search_inside: false,
    allow_search_metadata: false,
    update_search_state: _update_search_state,
    search_string: props.search_string
  }), /*#__PURE__*/_react["default"].createElement(_library_widgets.BpSelectorTable, {
    data_dict: data_dict_ref.current,
    num_rows: num_rows,
    awaiting_data: awaiting_data,
    enableColumnResizing: true,
    sortColumn: _set_sort_state,
    selectedRegions: props.selectedRegions,
    communicateColumnWidthSum: _communicateColumnWidthSum,
    onSelection: _onTableSelection,
    initiateDataGrab: _initiateDataGrab,
    columns: column_specs,
    identifier_field: props.id_field
  }))));
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(MenubarClass, {
    selected_resource: props.selected_resource,
    list_of_selected: props.list_of_selected,
    setConsoleText: _setConsoleText,
    delete_row: _delete_row,
    refresh_func: _refresh_func
  }), /*#__PURE__*/_react["default"].createElement("div", {
    ref: top_ref,
    className: "d-flex flex-column mt-3"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      width: props.usable_width,
      height: props.usable_height
    }
  }, /*#__PURE__*/_react["default"].createElement(_resizing_layouts.HorizontalPanes, {
    left_pane: left_pane,
    right_pane: right_pane,
    show_handle: true,
    available_width: props.usable_width,
    available_height: table_usable_height,
    initial_width_fraction: .65,
    handleSplitUpdate: _handleSplitResize
  }))));
}
exports.AdminPane = AdminPane = /*#__PURE__*/(0, _react.memo)(AdminPane);
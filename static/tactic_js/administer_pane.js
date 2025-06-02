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
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
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
    _onTableSelection2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(regions) {
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
    _grabNewChunkWithRow2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(row_index) {
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
    return new Promise(/*#__PURE__*/function () {
      var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(resolve, reject) {
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
    pushCallback(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
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
    _updatePaneStatePromise2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(new_state) {
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
    _handleRowClick2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(row_dict) {
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
    _handleRowSelection2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(selected_rows) {
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
    _update_search_state2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(new_state) {
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
  function _set_sort_state(_x9, _x0, _x1) {
    return _set_sort_state2.apply(this, arguments);
  }
  function _set_sort_state2() {
    _set_sort_state2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9(column_name, sort_field, direction) {
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
  function _handleArrowKeyPress(_x10) {
    return _handleArrowKeyPress2.apply(this, arguments);
  }
  function _handleArrowKeyPress2() {
    _handleArrowKeyPress2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee0(key) {
      var current_index, new_index, new_selected_res;
      return _regeneratorRuntime().wrap(function _callee0$(_context0) {
        while (1) switch (_context0.prev = _context0.next) {
          case 0:
            current_index = parseInt(get_data_dict_index(props.selected_resource.Id));
            if (!(key == "ArrowDown")) {
              _context0.next = 5;
              break;
            }
            new_index = current_index + 1;
            _context0.next = 8;
            break;
          case 5:
            new_index = current_index - 1;
            if (!(new_index < 0)) {
              _context0.next = 8;
              break;
            }
            return _context0.abrupt("return");
          case 8:
            _context0.next = 10;
            return _selectRow(new_index);
          case 10:
          case "end":
            return _context0.stop();
        }
      }, _callee0);
    }));
    return _handleArrowKeyPress2.apply(this, arguments);
  }
  function _selectRow(_x11) {
    return _selectRow2.apply(this, arguments);
  }
  function _selectRow2() {
    _selectRow2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee1(new_index) {
      var new_regions;
      return _regeneratorRuntime().wrap(function _callee1$(_context1) {
        while (1) switch (_context1.prev = _context1.next) {
          case 0:
            if (Object.keys(data_dict_ref.current).includes(String(new_index))) {
              _context1.next = 7;
              break;
            }
            _context1.next = 3;
            return _grabNewChunkWithRowPromise(new_index, false, null, false);
          case 3:
            _context1.next = 5;
            return _selectRow(new_index);
          case 5:
            _context1.next = 9;
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
            return _context1.stop();
        }
      }, _callee1);
    }));
    return _selectRow2.apply(this, arguments);
  }
  function _refresh_func() {
    return _refresh_func2.apply(this, arguments);
  }
  function _refresh_func2() {
    _refresh_func2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee10() {
      var callback,
        _args10 = arguments;
      return _regeneratorRuntime().wrap(function _callee10$(_context10) {
        while (1) switch (_context10.prev = _context10.next) {
          case 0:
            callback = _args10.length > 0 && _args10[0] !== undefined ? _args10[0] : null;
            _context10.next = 3;
            return _grabNewChunkWithRow(0, true, null, true, callback);
          case 3:
          case "end":
            return _context10.stop();
        }
      }, _callee10);
    }));
    return _refresh_func2.apply(this, arguments);
  }
  function _setConsoleText(_x12) {
    return _setConsoleText2.apply(this, arguments);
  }
  function _setConsoleText2() {
    _setConsoleText2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee11(the_text) {
      return _regeneratorRuntime().wrap(function _callee11$(_context11) {
        while (1) switch (_context11.prev = _context11.next) {
          case 0:
            _context11.next = 2;
            return _updatePaneStatePromise({
              "console_text": the_text
            });
          case 2:
            if (console_text_ref && console_text_ref.current) {
              console_text_ref.current.scrollTop = console_text_ref.current.scrollHeight;
            }
          case 3:
          case "end":
            return _context11.stop();
        }
      }, _callee11);
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
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LibraryPane = LibraryPane;
exports.res_types = void 0;
exports.view_views = view_views;
var _react = _interopRequireWildcard(require("react"));
var _core = require("@blueprintjs/core");
var _popover = require("@blueprintjs/popover2");
var _table = require("@blueprintjs/table");
var _blueprint_mdata_fields = require("./blueprint_mdata_fields");
var _resizing_layouts = require("./resizing_layouts2");
var _communication_react = require("./communication_react");
var _sizing_tools = require("./sizing_tools");
var _toaster = require("./toaster");
var _utilities_react = require("./utilities_react");
var _settings = require("./settings");
var _modal_react = require("./modal_react");
var _error_drawer = require("./error_drawer");
var _library_table_pane = require("./library_table_pane");
var _library_pane_reducer = require("./library_pane_reducer");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
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
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } // noinspection JSValidateTypes,JSDeprecatedSymbols
var res_types = exports.res_types = ["collection", "project", "tile", "list", "code"];
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
function duplicate_views() {
  var is_repository = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  return {
    collection: "/duplicate_collection",
    project: "/duplicate_project",
    tile: "/create_duplicate_tile",
    list: "/create_duplicate_list",
    code: "/create_duplicate_code"
  };
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
var metadata_outer_style = {
  marginTop: 0,
  marginLeft: 0,
  overflow: "auto",
  padding: 25,
  marginRight: 0,
  height: "100%"
};
var initial_state = {
  data_dict: {},
  num_rows: 0,
  tag_list: [],
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
    filterType: "all",
    show_hidden: false
  },
  rowChanged: 0
};
function LibraryPane(props) {
  props = _objectSpread({
    columns: {
      "name": {
        "first_sort": "ascending"
      },
      "created": {
        "first_sort": "descending"
      },
      "updated": {
        "first_sort": "ascending"
      },
      "tags": {
        "first_sort": "ascending"
      }
    },
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
  var socket_counter = (0, _react.useRef)(null);
  var blank_selected_resource = (0, _react.useRef)({});
  var selectedTypeRef = (0, _react.useRef)(null);
  var _useSize = (0, _sizing_tools.useSize)(top_ref, 0, "LibraryPane"),
    _useSize2 = _slicedToArray(_useSize, 4),
    usable_width = _useSize2[0],
    usable_height = _useSize2[1],
    topX = _useSize2[2],
    topY = _useSize2[3];
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  var statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  var _handleArrowKeyPress = (0, _react.useCallback)(/*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(key) {
      var the_res, current_index, new_index, new_selected_res;
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
  var _view_func = (0, _react.useCallback)(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
    var the_view,
      re,
      data,
      _args2 = arguments;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          the_view = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : null;
          if (the_view == null) {
            the_view = view_views(props.is_repository)[pStateRef.current.select_state.selected_resource.res_type];
          }
          statusFuncs.setStatus({
            show_spinner: true,
            status_message: "Opening ..."
          });
          if (!window.in_context) {
            _context2.next = 19;
            break;
          }
          re = new RegExp("/$");
          the_view = the_view.replace(re, "_in_context");
          _context2.prev = 6;
          _context2.next = 9;
          return (0, _communication_react.postAjaxPromise)(the_view, {
            context_id: context_id,
            resource_name: pStateRef.current.select_state.selected_resource.name
          });
        case 9:
          data = _context2.sent;
          props.handleCreateViewer(data, statusFuncs.clearStatus);
          _context2.next = 17;
          break;
        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](6);
          statusFuncs.clearstatus();
          errorDrawerFuncs.addFromError("Error viewing with view ".concat(the_view), _context2.t0);
        case 17:
          _context2.next = 21;
          break;
        case 19:
          statusFuncs.clearStatus();
          window.open($SCRIPT_ROOT + the_view + pStateRef.current.select_state.selected_resource.name);
        case 21:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[6, 13]]);
  })), [pStateRef.current.select_state.selected_resource]);
  function _unsearch() {
    return _unsearch2.apply(this, arguments);
  }
  function _unsearch2() {
    _unsearch2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8() {
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
            if (!(props.pane_type == "all" && pStateRef.current.search_state.filterType != "all")) {
              _context8.next = 11;
              break;
            }
            _context8.next = 11;
            return _setFilterType("all");
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
        var _onKeyDown = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
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
        var _onKeyDown2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
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
        var _onKeyDown3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
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
  (0, _utilities_react.useConstructor)(function () {
    for (var col in props.columns) {
      blank_selected_resource.current[col] = "";
    }
  });
  (0, _react.useEffect)(function () {
    initSocket();
    _grabNewChunkWithRow(0).then(function () {});
  }, []);
  var pushCallback = (0, _utilities_react.useCallbackStack)("library_home");
  function initSocket() {
    if (props.tsocket != null && !props.is_repository) {
      props.tsocket.attachListener("update-selector-row", _handleRowUpdate);
      props.tsocket.attachListener("refresh-selector", _refresh_func);
    } else if (props.tsocket != null && props.is_repository) {
      props.tsocket.attachListener("update-repository-selector-row", _handleRowUpdate);
      props.tsocket.attachListener("refresh-repository-selector", _refresh_func);
    }
  }
  function _getSearchSpec() {
    return pStateRef.current.search_state;
  }
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
    _setFilterType2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee0(rtype) {
      var sres;
      return _regeneratorRuntime().wrap(function _callee0$(_context0) {
        while (1) switch (_context0.prev = _context0.next) {
          case 0:
            if (!(rtype == pStateRef.current.search_state.filterType)) {
              _context0.next = 2;
              break;
            }
            return _context0.abrupt("return");
          case 2:
            if (pStateRef.current.search_state.multi_select) {
              _context0.next = 7;
              break;
            }
            sres = pStateRef.current.select_state.selected_resource;
            if (!(sres.name != "" && sres.notes != get_data_dict_entry(sres.name, sres.res_type).notes)) {
              _context0.next = 7;
              break;
            }
            _context0.next = 7;
            return _saveFromSelectedResource();
          case 7:
            pDispatch({
              type: "UPDATE_SEARCH_STATE",
              search_state: {
                filterType: rtype
              }
            });
            clearSelected();
            pushCallback(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9() {
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
            return _context0.stop();
        }
      }, _callee0);
    }));
    return _setFilterType2.apply(this, arguments);
  }
  function clearSelected() {
    pDispatch({
      type: "CLEAR_SELECTED"
    });
  }
  function _onTableSelection(_x3) {
    return _onTableSelection2.apply(this, arguments);
  }
  function _onTableSelection2() {
    _onTableSelection2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee1(regions) {
      var selected_rows, selected_row_indices, revised_regions, _iterator4, _step4, region, first_row, last_row, i;
      return _regeneratorRuntime().wrap(function _callee1$(_context1) {
        while (1) switch (_context1.prev = _context1.next) {
          case 0:
            if (!(regions.length == 0)) {
              _context1.next = 2;
              break;
            }
            return _context1.abrupt("return");
          case 2:
            // Without this get an error when clicking on a body cell
            selected_rows = [];
            selected_row_indices = [];
            revised_regions = [];
            _iterator4 = _createForOfIteratorHelper(regions);
            try {
              for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                region = _step4.value;
                if (region.hasOwnProperty("rows")) {
                  first_row = region["rows"][0];
                  revised_regions.push(_table.Regions.row(first_row));
                  last_row = region["rows"][1];
                  for (i = first_row; i <= last_row; ++i) {
                    if (!selected_row_indices.includes(i)) {
                      selected_row_indices.push(i);
                      selected_rows.push(pStateRef.current.data_dict[i]);
                      revised_regions.push(_table.Regions.row(i));
                    }
                  }
                }
              }
            } catch (err) {
              _iterator4.e(err);
            } finally {
              _iterator4.f();
            }
            _context1.next = 9;
            return _handleRowSelection(selected_rows);
          case 9:
            pDispatch({
              type: "UPDATE_SELECT_STATE",
              select_state: {
                selectedRegions: revised_regions
              }
            });
          case 10:
          case "end":
            return _context1.stop();
        }
      }, _callee1);
    }));
    return _onTableSelection2.apply(this, arguments);
  }
  function _grabNewChunkWithRow(_x4) {
    return _grabNewChunkWithRow2.apply(this, arguments);
  }
  function _grabNewChunkWithRow2() {
    _grabNewChunkWithRow2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee10(row_index) {
      var flush,
        spec_update,
        select,
        select_by_name,
        callback,
        search_spec,
        args,
        data,
        new_data_dict,
        _args10 = arguments;
      return _regeneratorRuntime().wrap(function _callee10$(_context10) {
        while (1) switch (_context10.prev = _context10.next) {
          case 0:
            flush = _args10.length > 1 && _args10[1] !== undefined ? _args10[1] : false;
            spec_update = _args10.length > 2 && _args10[2] !== undefined ? _args10[2] : null;
            select = _args10.length > 3 && _args10[3] !== undefined ? _args10[3] : false;
            select_by_name = _args10.length > 4 && _args10[4] !== undefined ? _args10[4] : null;
            callback = _args10.length > 5 && _args10[5] !== undefined ? _args10[5] : null;
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
              pane_type: pStateRef.current.search_state.filterType,
              search_spec: search_spec,
              row_number: row_index,
              is_repository: props.is_repository
            };
            _context10.prev = 10;
            _context10.next = 13;
            return (0, _communication_react.postAjaxPromise)("grab_all_list_chunk", args);
          case 13:
            data = _context10.sent;
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
            _context10.next = 23;
            break;
          case 20:
            _context10.prev = 20;
            _context10.t0 = _context10["catch"](10);
            errorDrawerFuncs.addFromError("Error grabbing resource chunk", _context10.t0);
          case 23:
          case "end":
            return _context10.stop();
        }
      }, _callee10, null, [[10, 20]]);
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
    _handleRowUpdate2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee12(res_dict) {
      var res_name, ind, _id, event_type, the_row, _the_row, is_last, selected_ind, is_selected_row, new_selected_ind;
      return _regeneratorRuntime().wrap(function _callee12$(_context12) {
        while (1) switch (_context12.prev = _context12.next) {
          case 0:
            res_name = res_dict.name;
            event_type = res_dict.event_type;
            delete res_dict.event_type;
            _context12.t0 = event_type;
            _context12.next = _context12.t0 === "update" ? 6 : _context12.t0 === "insert" ? 13 : _context12.t0 === "delete" ? 16 : 26;
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
              _context12.next = 9;
              break;
            }
            return _context12.abrupt("return");
          case 9:
            the_row = _objectSpread(_objectSpread({}, pStateRef.current.data_dict[ind]), res_dict);
            pDispatch({
              type: "UPDATE_ROW",
              index: ind,
              res_dict: res_dict
            });
            // if ("tags" in res_dict) {
            //     let data_dict = {
            //         pane_type: props.pane_type,
            //         is_repository: props.is_repository,
            //         show_hidden: pStateRef.current.search_state.show_hidden
            //     };
            //     let data = await postAjaxPromise("get_tag_list", data_dict);
            //     let all_tags = data.tag_list;
            //     set_tag_list(all_tags);
            // }
            if (_id == pStateRef.current.select_state.selected_resource._id) {
              _the_row = _objectSpread(_objectSpread({}, pStateRef.current.data_dict[ind]), res_dict);
              pDispatch({
                type: "UPDATE_SELECT_STATE",
                select_state: {
                  selected_resource: _the_row
                }
              });
            }
            return _context12.abrupt("break", 27);
          case 13:
            _context12.next = 15;
            return _grabNewChunkWithRow(0, true, null, false, res_name);
          case 15:
            return _context12.abrupt("break", 27);
          case 16:
            if ("_id" in res_dict) {
              ind = parseInt((0, _library_pane_reducer.get_index_from_id)(res_dict._id, pStateRef.current.data_dict));
            } else {
              ind = parseInt((0, _library_pane_reducer.get_index)(res_name, res_dict.res_type, pStateRef.current.data_dict));
            }
            is_last = ind == pStateRef.current.data_dict.length - 1;
            selected_ind = null;
            if ("_id" in pStateRef.current.select_state.selected_resource) {
              selected_ind = parseInt((0, _library_pane_reducer.get_index_from_id)(pStateRef.current.select_state.selected_resource._id, pStateRef.current.data_dict));
            }
            is_selected_row = ind && ind == selected_ind;
            new_selected_ind = selected_ind;
            if (selected_ind > ind) {
              new_selected_ind = selected_ind - 1;
            }
            pDispatch({
              type: "DELETE_ROW",
              index: ind
            });
            pushCallback(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee11() {
              return _regeneratorRuntime().wrap(function _callee11$(_context11) {
                while (1) switch (_context11.prev = _context11.next) {
                  case 0:
                    _context11.next = 2;
                    return _grabNewChunkWithRow(ind, false, null, false, null, function () {
                      if (new_selected_ind) {
                        _selectRow(new_selected_ind);
                      } else {
                        clearSelected();
                      }
                    });
                  case 2:
                  case "end":
                    return _context11.stop();
                }
              }, _callee11);
            })));
            return _context12.abrupt("break", 27);
          case 26:
            return _context12.abrupt("return");
          case 27:
          case "end":
            return _context12.stop();
        }
      }, _callee12);
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
  function _extractNewTags(tstring) {
    var tlist = tstring.split(" ");
    var new_tags = [];
    var _iterator2 = _createForOfIteratorHelper(tlist),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var tag = _step2.value;
        if (!(tag.length == 0) && !(tag in pStateRef.current.tag_list)) {
          new_tags.push(tag);
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    return new_tags;
  }
  function _saveFromSelectedResource() {
    return _saveFromSelectedResource2.apply(this, arguments);
  }
  function _saveFromSelectedResource2() {
    _saveFromSelectedResource2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee13() {
      var result_dict, saved_selected_resource, saved_selected_rows, new_tags;
      return _regeneratorRuntime().wrap(function _callee13$(_context13) {
        while (1) switch (_context13.prev = _context13.next) {
          case 0:
            // This will only be called when there is a single row selected
            result_dict = {
              "res_type": pStateRef.current.select_state.selected_rows[0].res_type,
              "res_name": pStateRef.current.select_state.list_of_selected[0],
              "tags": pStateRef.current.select_state.selected_resource.tags,
              "notes": pStateRef.current.select_state.selected_resource.notes
            };
            if (pStateRef.current.select_state.selected_rows[0].res_type == "tile" && "icon" in pStateRef.current.select_state.selected_resource) {
              result_dict["icon"] = pStateRef.current.select_state.selected_resource["icon"];
            }
            saved_selected_resource = Object.assign({}, pStateRef.current.select_state.selected_resource);
            saved_selected_rows = _toConsumableArray(pStateRef.current.select_state.selected_rows);
            new_tags = _extractNewTags(pStateRef.current.select_state.selected_resource.tags);
            _context13.prev = 5;
            _context13.next = 8;
            return (0, _communication_react.postAjaxPromise)("save_metadata", result_dict);
          case 8:
            _context13.next = 13;
            break;
          case 10:
            _context13.prev = 10;
            _context13.t0 = _context13["catch"](5);
            errorDrawerFuncs.addFromError("Error updating resource ".concat(result_dict.res_name), _context13.t0);
          case 13:
          case "end":
            return _context13.stop();
        }
      }, _callee13, null, [[5, 10]]);
    }));
    return _saveFromSelectedResource2.apply(this, arguments);
  }
  function _overwriteCommonTags() {
    return _overwriteCommonTags2.apply(this, arguments);
  }
  function _overwriteCommonTags2() {
    _overwriteCommonTags2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee14() {
      var result_dict, new_tags;
      return _regeneratorRuntime().wrap(function _callee14$(_context14) {
        while (1) switch (_context14.prev = _context14.next) {
          case 0:
            result_dict = {
              "selected_rows": pStateRef.current.select_state.selected_rows,
              "tags": pStateRef.current.select_state.selected_resource.tags
            };
            new_tags = _extractNewTags(pStateRef.current.select_state.selected_resource.tags);
            _context14.prev = 2;
            _context14.next = 5;
            return (0, _communication_react.postAjaxPromise)("overwrite_common_tags", result_dict);
          case 5:
            _context14.next = 10;
            break;
          case 7:
            _context14.prev = 7;
            _context14.t0 = _context14["catch"](2);
            errorDrawerFuncs.addFromError("Error overwriting tags", _context14.t0);
          case 10:
          case "end":
            return _context14.stop();
        }
      }, _callee14, null, [[2, 7]]);
    }));
    return _overwriteCommonTags2.apply(this, arguments);
  }
  function set_selected_resource(new_resource) {
    pDispatch({
      type: "UPDATE_SELECT_STATE",
      select_state: {
        selected_resource: new_resource
      }
    });
  }
  function _handleMetadataChange(changed_state_elements) {
    if (!pStateRef.current.select_state.multi_select) {
      var revised_selected_resource = Object.assign({}, pStateRef.current.select_state.selected_resource);
      revised_selected_resource = Object.assign(revised_selected_resource, changed_state_elements);
      if (Object.keys(changed_state_elements).includes("tags")) {
        revised_selected_resource["tags"] = revised_selected_resource["tags"].join(" ");
        set_selected_resource(revised_selected_resource);
        pushCallback(_saveFromSelectedResource);
      } else {
        set_selected_resource(revised_selected_resource);
        pushCallback(_saveFromSelectedResource);
      }
    } else {
      var _revised_selected_resource = Object.assign({}, pStateRef.current.select_state.selected_resource);
      _revised_selected_resource = Object.assign(_revised_selected_resource, changed_state_elements);
      _revised_selected_resource["tags"] = _revised_selected_resource["tags"].join(" ");
      set_selected_resource(_revised_selected_resource);
      pushCallback(_overwriteCommonTags);
    }
  }
  function set_multi_select(new_val) {
    pDispatch({
      type: "UPDATE_SELECT_STATE",
      select_state: {
        multi_select: new_val
      }
    });
  }
  function _handleRowDoubleClick(row_dict) {
    var view_view = view_views(props.is_repository)[row_dict.res_type];
    if (view_view == null) return;
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
        selected_rows: [row_dict]
      }
    });
    pushCallback(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
      var re, data;
      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            if (!window.in_context) {
              _context6.next = 16;
              break;
            }
            re = new RegExp("/$");
            view_view = view_view.replace(re, "_in_context");
            _context6.prev = 3;
            _context6.next = 6;
            return (0, _communication_react.postAjaxPromise)(view_view, {
              context_id: context_id,
              resource_name: row_dict.name
            });
          case 6:
            data = _context6.sent;
            props.handleCreateViewer(data, statusFuncs.clearStatus);
            _context6.next = 14;
            break;
          case 10:
            _context6.prev = 10;
            _context6.t0 = _context6["catch"](3);
            statusFuncs.clearStatus();
            errorDrawerFuncs.addFromError("Error handling double click with view ".concat(view_view), _context6.t0);
          case 14:
            _context6.next = 18;
            break;
          case 16:
            statusFuncs.clearStatus();
            window.open($SCRIPT_ROOT + view_view + row_dict.name);
          case 18:
          case "end":
            return _context6.stop();
        }
      }, _callee6, null, [[3, 10]]);
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
    _handleRowSelection2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee15(selected_rows) {
      var sres, common_tags, other_rows, _iterator5, _step5, row_dict, new_common_tags, new_tag_list, _iterator6, _step6, tag, multi_select_list, new_selected_resource, _row_dict;
      return _regeneratorRuntime().wrap(function _callee15$(_context15) {
        while (1) switch (_context15.prev = _context15.next) {
          case 0:
            if (pStateRef.current.select_state.multi_select) {
              _context15.next = 5;
              break;
            }
            sres = pStateRef.current.select_state.selected_resource;
            if (!(sres.name != "" && get_data_dict_entry(sres.name, sres.res_type) && sres.notes != get_data_dict_entry(sres.name, sres.res_type).notes)) {
              _context15.next = 5;
              break;
            }
            _context15.next = 5;
            return _saveFromSelectedResource();
          case 5:
            if (selected_rows.length > 1) {
              common_tags = selected_rows[0].tags.split(" ");
              other_rows = selected_rows.slice(1, selected_rows.length);
              _iterator5 = _createForOfIteratorHelper(other_rows);
              try {
                for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
                  row_dict = _step5.value;
                  new_common_tags = [];
                  new_tag_list = row_dict.tags.split(" ");
                  _iterator6 = _createForOfIteratorHelper(new_tag_list);
                  try {
                    for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
                      tag = _step6.value;
                      if (common_tags.includes(tag)) {
                        new_common_tags.push(tag);
                      }
                    }
                  } catch (err) {
                    _iterator6.e(err);
                  } finally {
                    _iterator6.f();
                  }
                  common_tags = new_common_tags;
                }
              } catch (err) {
                _iterator5.e(err);
              } finally {
                _iterator5.f();
              }
              multi_select_list = selected_rows.map(function (row_dict) {
                return row_dict.name;
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
                  selected_rows: selected_rows
                }
              });
            }
          case 6:
          case "end":
            return _context15.stop();
        }
      }, _callee15);
    }));
    return _handleRowSelection2.apply(this, arguments);
  }
  function _filter_func(resource_dict, search_string) {
    try {
      return resource_dict.name.toLowerCase().search(search_string) != -1;
    } catch (e) {
      return false;
    }
  }
  function _update_search_state(new_state) {
    pDispatch({
      type: "UPDATE_SEARCH_STATE",
      search_state: new_state
    });
    pushCallback(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7() {
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
    _selectRow2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee16(new_index) {
      return _regeneratorRuntime().wrap(function _callee16$(_context16) {
        while (1) switch (_context16.prev = _context16.next) {
          case 0:
            if (Object.keys(pStateRef.current.data_dict).includes(String(new_index))) {
              _context16.next = 5;
              break;
            }
            _context16.next = 3;
            return _grabNewChunkWithRow(new_index, false, null, false, null, function () {
              _selectRow(new_index);
            });
          case 3:
            _context16.next = 6;
            break;
          case 5:
            pDispatch({
              type: "UPDATE_SELECT_STATE",
              select_state: {
                selected_resource: pStateRef.current.data_dict[new_index],
                multi_select: false,
                list_of_selected: [pStateRef.current.data_dict[new_index].name],
                selected_rows: [pStateRef.current.data_dict[new_index]],
                selectedRegions: [_table.Regions.row(new_index)]
              }
            });
          case 6:
          case "end":
            return _context16.stop();
        }
      }, _callee16);
    }));
    return _selectRow2.apply(this, arguments);
  }
  function _open_raw(selected_resource) {
    statusFuncs.clearStatus();
    if (selected_resource.type == "freeform") {
      window.open($SCRIPT_ROOT + "/open_raw/" + selected_resource.name);
    } else {
      statusFuncs.statusMessage("Only Freeform documents can be raw opened", 5);
    }
  }
  function _view_resource(_x8) {
    return _view_resource2.apply(this, arguments);
  }
  function _view_resource2() {
    _view_resource2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee17(selected_resource) {
      var the_view,
        force_new_tab,
        resource_name,
        re,
        data,
        _args17 = arguments;
      return _regeneratorRuntime().wrap(function _callee17$(_context17) {
        while (1) switch (_context17.prev = _context17.next) {
          case 0:
            the_view = _args17.length > 1 && _args17[1] !== undefined ? _args17[1] : null;
            force_new_tab = _args17.length > 2 && _args17[2] !== undefined ? _args17[2] : false;
            resource_name = selected_resource.name;
            if (the_view == null) {
              the_view = view_views(props.is_repository)[selected_resource.res_type];
            }
            statusFuncs.setStatus({
              show_spinner: true,
              status_message: "Opening ..."
            });
            if (!(window.in_context && !force_new_tab)) {
              _context17.next = 21;
              break;
            }
            re = new RegExp("/$");
            the_view = the_view.replace(re, "_in_context");
            _context17.prev = 8;
            _context17.next = 11;
            return (0, _communication_react.postAjaxPromise)(the_view, {
              context_id: context_id,
              resource_name: resource_name
            });
          case 11:
            data = _context17.sent;
            props.handleCreateViewer(data, statusFuncs.clearStatus);
            _context17.next = 19;
            break;
          case 15:
            _context17.prev = 15;
            _context17.t0 = _context17["catch"](8);
            statusFuncs.clearstatus();
            errorDrawerFuncs.addFromError("Error viewing resource ".concat(resource_name), _context17.t0);
          case 19:
            _context17.next = 23;
            break;
          case 21:
            statusFuncs.clearStatus();
            window.open($SCRIPT_ROOT + the_view + resource_name);
          case 23:
          case "end":
            return _context17.stop();
        }
      }, _callee17, null, [[8, 15]]);
    }));
    return _view_resource2.apply(this, arguments);
  }
  function _duplicate_func() {
    return _duplicate_func2.apply(this, arguments);
  }
  function _duplicate_func2() {
    _duplicate_func2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee18() {
      var row,
        the_row,
        res_name,
        res_type,
        data,
        new_name,
        duplicate_view,
        result_dict,
        _args18 = arguments;
      return _regeneratorRuntime().wrap(function _callee18$(_context18) {
        while (1) switch (_context18.prev = _context18.next) {
          case 0:
            row = _args18.length > 0 && _args18[0] !== undefined ? _args18[0] : null;
            the_row = row ? row : pStateRef.current.select_state.selected_resource;
            res_name = the_row.name;
            res_type = the_row.res_type;
            _context18.prev = 4;
            _context18.next = 7;
            return (0, _communication_react.postAjaxPromise)("get_resource_names/" + res_type, {});
          case 7:
            data = _context18.sent;
            _context18.next = 10;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Duplicate ".concat(res_type),
              field_title: "New Name",
              default_value: res_name,
              existing_names: data.resource_names,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 10:
            new_name = _context18.sent;
            duplicate_view = duplicate_views()[res_type];
            result_dict = {
              "new_res_name": new_name,
              "res_to_copy": res_name,
              "library_id": props.library_id,
              "is_repository": false
            };
            _context18.next = 15;
            return (0, _communication_react.postAjaxPromise)(duplicate_view, result_dict);
          case 15:
            _context18.next = 21;
            break;
          case 17:
            _context18.prev = 17;
            _context18.t0 = _context18["catch"](4);
            if (_context18.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error duplicating resource ".concat(res_name), _context18.t0);
            }
            return _context18.abrupt("return");
          case 21:
          case "end":
            return _context18.stop();
        }
      }, _callee18, null, [[4, 17]]);
    }));
    return _duplicate_func2.apply(this, arguments);
  }
  function _delete_func(_x9) {
    return _delete_func2.apply(this, arguments);
  }
  function _delete_func2() {
    _delete_func2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee19(resource) {
      var res_list, confirm_text, _res_name, first_index, _iterator7, _step7, row, ind;
      return _regeneratorRuntime().wrap(function _callee19$(_context19) {
        while (1) switch (_context19.prev = _context19.next) {
          case 0:
            res_list = resource ? [resource] : pStateRef.current.select_state.selected_rows;
            if (res_list.length == 1) {
              _res_name = res_list[0].name;
              confirm_text = "Are you sure that you want to delete ".concat(_res_name, "?");
            } else {
              confirm_text = "Are you sure that you want to delete multiple items?";
            }
            first_index = 99999;
            _iterator7 = _createForOfIteratorHelper(pStateRef.current.select_state.selected_rows);
            try {
              for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
                row = _step7.value;
                ind = parseInt((0, _library_pane_reducer.get_index)(row.name, row.res_type, pStateRef.current.data_dict));
                if (ind < first_index) {
                  first_index = ind;
                }
              }
            } catch (err) {
              _iterator7.e(err);
            } finally {
              _iterator7.f();
            }
            _context19.prev = 5;
            _context19.next = 8;
            return dialogFuncs.showModalPromise("ConfirmDialog", {
              title: "Delete resources",
              text_body: confirm_text,
              cancel_text: "do nothing",
              submit_text: "delete",
              handleClose: dialogFuncs.hideModal
            });
          case 8:
            _context19.next = 10;
            return (0, _communication_react.postAjaxPromise)("delete_resource_list", {
              "resource_list": res_list
            });
          case 10:
            _context19.next = 16;
            break;
          case 12:
            _context19.prev = 12;
            _context19.t0 = _context19["catch"](5);
            if (_context19.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error duplicating resource ".concat(res_name), _context19.t0);
            }
            return _context19.abrupt("return");
          case 16:
          case "end":
            return _context19.stop();
        }
      }, _callee19, null, [[5, 12]]);
    }));
    return _delete_func2.apply(this, arguments);
  }
  function _rename_func() {
    return _rename_func2.apply(this, arguments);
  }
  function _rename_func2() {
    _rename_func2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee20() {
      var row,
        res_type,
        res_name,
        data,
        res_names,
        index,
        new_name,
        the_data,
        _args20 = arguments;
      return _regeneratorRuntime().wrap(function _callee20$(_context20) {
        while (1) switch (_context20.prev = _context20.next) {
          case 0:
            row = _args20.length > 0 && _args20[0] !== undefined ? _args20[0] : null;
            if (!row) {
              res_type = pStateRef.current.select_state.selected_resource.res_type;
              res_name = pStateRef.current.select_state.selected_resource.name;
            } else {
              res_type = row.res_type;
              res_name = row.name;
            }
            _context20.prev = 2;
            _context20.next = 5;
            return (0, _communication_react.postAjaxPromise)("get_resource_names/" + res_type, {});
          case 5:
            data = _context20.sent;
            res_names = data["resource_names"];
            index = res_names.indexOf(res_name);
            if (index >= 0) {
              res_names.splice(index, 1);
            }
            _context20.next = 11;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Rename ".concat(res_type),
              field_title: "New Name",
              handleClose: dialogFuncs.hideModal,
              default_value: res_name,
              existing_names: res_names,
              checkboxes: []
            });
          case 11:
            new_name = _context20.sent;
            the_data = {
              "new_name": new_name
            };
            _context20.next = 15;
            return (0, _communication_react.postAjaxPromise)("rename_resource/".concat(res_type, "/").concat(res_name), the_data);
          case 15:
            _context20.next = 21;
            break;
          case 17:
            _context20.prev = 17;
            _context20.t0 = _context20["catch"](2);
            if (_context20.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error renaming resource ".concat(res_name), _context20.t0);
            }
            return _context20.abrupt("return");
          case 21:
          case "end":
            return _context20.stop();
        }
      }, _callee20, null, [[2, 17]]);
    }));
    return _rename_func2.apply(this, arguments);
  }
  function _repository_copy_func() {
    return _repository_copy_func2.apply(this, arguments);
  }
  function _repository_copy_func2() {
    _repository_copy_func2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee21() {
      var res_type, res_name, data, new_name, result_dict, _result_dict;
      return _regeneratorRuntime().wrap(function _callee21$(_context21) {
        while (1) switch (_context21.prev = _context21.next) {
          case 0:
            if (pStateRef.current.select_state.multi_select) {
              _context21.next = 23;
              break;
            }
            res_type = pStateRef.current.select_state.selected_resource.res_type;
            res_name = pStateRef.current.select_state.selected_resource.name;
            _context21.prev = 3;
            _context21.next = 6;
            return (0, _communication_react.postAjaxPromise)("get_resource_names/" + res_type, {});
          case 6:
            data = _context21.sent;
            _context21.next = 9;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Import ".concat(res_type),
              field_title: "New Name",
              default_value: res_name,
              existing_names: data.resource_names,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 9:
            new_name = _context21.sent;
            result_dict = {
              "res_type": res_type,
              "res_name": res_name,
              "new_res_name": new_name
            };
            _context21.next = 13;
            return (0, _communication_react.postAjaxPromise)("/copy_from_repository", result_dict);
          case 13:
            statusFuncs.statusMessage("Imported Resource ".concat(res_name));
            return _context21.abrupt("return", res_name);
          case 17:
            _context21.prev = 17;
            _context21.t0 = _context21["catch"](3);
            if (_context21.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error getting resources names", _context21.t0);
            }
            return _context21.abrupt("return");
          case 21:
            _context21.next = 34;
            break;
          case 23:
            _result_dict = {
              "selected_rows": pStateRef.current.select_state.selected_rows
            };
            _context21.prev = 24;
            _context21.next = 27;
            return (0, _communication_react.postAjaxPromise)("/copy_from_repository", _result_dict);
          case 27:
            statusFuncs.statusMessage("Imported Resources");
            _context21.next = 33;
            break;
          case 30:
            _context21.prev = 30;
            _context21.t1 = _context21["catch"](24);
            errorDrawerFuncs.addFromError("Error importing resources", _context21.t1);
          case 33:
            return _context21.abrupt("return", "");
          case 34:
          case "end":
            return _context21.stop();
        }
      }, _callee21, null, [[3, 17], [24, 30]]);
    }));
    return _repository_copy_func2.apply(this, arguments);
  }
  function _send_repository_func() {
    return _send_repository_func2.apply(this, arguments);
  }
  function _send_repository_func2() {
    _send_repository_func2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee22() {
      var pane_type, res_type, res_name, data, new_name, result_dict, _result_dict2;
      return _regeneratorRuntime().wrap(function _callee22$(_context22) {
        while (1) switch (_context22.prev = _context22.next) {
          case 0:
            pane_type = props.pane_type;
            if (pStateRef.current.select_state.multi_select) {
              _context22.next = 23;
              break;
            }
            res_type = pStateRef.current.select_state.selected_resource.res_type;
            res_name = pStateRef.current.select_state.selected_resource.name;
            _context22.prev = 4;
            _context22.next = 7;
            return (0, _communication_react.postAjaxPromise)("get_repository_resource_names/" + res_type, {});
          case 7:
            data = _context22.sent;
            _context22.next = 10;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Share ".concat(res_type),
              field_title: "New ".concat(res_type, " Name"),
              default_value: res_name,
              existing_names: data.resource_names,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 10:
            new_name = _context22.sent;
            result_dict = {
              "pane_type": pane_type,
              "res_type": res_type,
              "res_name": res_name,
              "new_res_name": new_name
            };
            _context22.next = 14;
            return (0, _communication_react.postAjaxPromise)('/send_to_repository', result_dict);
          case 14:
            statusFuncs.statusMessage("Shared resource ".concat(res_name));
            _context22.next = 21;
            break;
          case 17:
            _context22.prev = 17;
            _context22.t0 = _context22["catch"](4);
            if (_context22.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error sharing resource ".concat(res_name), _context22.t0);
            }
            return _context22.abrupt("return");
          case 21:
            _context22.next = 34;
            break;
          case 23:
            _result_dict2 = {
              "pane_type": pane_type,
              "selected_rows": pStateRef.current.select_state.selected_rows
            };
            _context22.prev = 24;
            _context22.next = 27;
            return (0, _communication_react.postAjaxPromise)('/send_to_repository', _result_dict2);
          case 27:
            statusFuncs.statusMessage("Shared resources");
            _context22.next = 33;
            break;
          case 30:
            _context22.prev = 30;
            _context22.t1 = _context22["catch"](24);
            errorDrawerFuncs.addFromError("Error sharing resources", _context22.t1);
          case 33:
            return _context22.abrupt("return", "");
          case 34:
          case "end":
            return _context22.stop();
        }
      }, _callee22, null, [[4, 17], [24, 30]]);
    }));
    return _send_repository_func2.apply(this, arguments);
  }
  function _refresh_func() {
    return _refresh_func2.apply(this, arguments);
  }
  function _refresh_func2() {
    _refresh_func2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee23() {
      var callback,
        _args23 = arguments;
      return _regeneratorRuntime().wrap(function _callee23$(_context23) {
        while (1) switch (_context23.prev = _context23.next) {
          case 0:
            callback = _args23.length > 0 && _args23[0] !== undefined ? _args23[0] : null;
            _context23.next = 3;
            return _grabNewChunkWithRow(0, true, null, true, callback);
          case 3:
          case "end":
            return _context23.stop();
        }
      }, _callee23);
    }));
    return _refresh_func2.apply(this, arguments);
  }
  function _new_notebook() {
    return _new_notebook2.apply(this, arguments);
  }
  function _new_notebook2() {
    _new_notebook2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee24() {
      var the_view, data;
      return _regeneratorRuntime().wrap(function _callee24$(_context24) {
        while (1) switch (_context24.prev = _context24.next) {
          case 0:
            if (!window.in_context) {
              _context24.next = 14;
              break;
            }
            _context24.prev = 1;
            the_view = "new_notebook_in_context";
            _context24.next = 5;
            return (0, _communication_react.postAjaxPromise)(the_view, {
              resource_name: ""
            });
          case 5:
            data = _context24.sent;
            props.handleCreateViewer(data);
            _context24.next = 12;
            break;
          case 9:
            _context24.prev = 9;
            _context24.t0 = _context24["catch"](1);
            errorDrawerFuncs.addFromError("Error creating new notebook", _context24.t0);
          case 12:
            _context24.next = 15;
            break;
          case 14:
            window.open("".concat($SCRIPT_ROOT, "/new_notebook"));
          case 15:
          case "end":
            return _context24.stop();
        }
      }, _callee24, null, [[1, 9]]);
    }));
    return _new_notebook2.apply(this, arguments);
  }
  function _new_project() {
    return _new_project2.apply(this, arguments);
  }
  function _new_project2() {
    _new_project2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee25() {
      var the_view, data;
      return _regeneratorRuntime().wrap(function _callee25$(_context25) {
        while (1) switch (_context25.prev = _context25.next) {
          case 0:
            if (!window.in_context) {
              _context25.next = 14;
              break;
            }
            _context25.prev = 1;
            the_view = "new_project_in_context";
            _context25.next = 5;
            return (0, _communication_react.postAjaxPromise)(the_view, {
              resource_name: ""
            });
          case 5:
            data = _context25.sent;
            props.handleCreateViewer(data);
            _context25.next = 12;
            break;
          case 9:
            _context25.prev = 9;
            _context25.t0 = _context25["catch"](1);
            errorDrawerFuncs.addFromError("Error creating new project", _context25.t0);
          case 12:
            _context25.next = 15;
            break;
          case 14:
            window.open("".concat($SCRIPT_ROOT, "/new_project"));
          case 15:
          case "end":
            return _context25.stop();
        }
      }, _callee25, null, [[1, 9]]);
    }));
    return _new_project2.apply(this, arguments);
  }
  function _downloadJupyter() {
    return _downloadJupyter2.apply(this, arguments);
  }
  function _downloadJupyter2() {
    _downloadJupyter2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee26() {
      var res_name, new_name;
      return _regeneratorRuntime().wrap(function _callee26$(_context26) {
        while (1) switch (_context26.prev = _context26.next) {
          case 0:
            res_name = pStateRef.current.select_state.selected_resource.name;
            _context26.prev = 1;
            _context26.next = 4;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Download Notebook as Jupyter Notebook",
              field_title: "New File Name",
              default_value: res_name + ".ipynb",
              existing_names: [],
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 4:
            new_name = _context26.sent;
            window.open("".concat($SCRIPT_ROOT, "/download_jupyter/") + res_name + "/" + new_name);
            _context26.next = 11;
            break;
          case 8:
            _context26.prev = 8;
            _context26.t0 = _context26["catch"](1);
            errorDrawerFuncs.addFromError("Error downloading jupyter notebook", _context26.t0);
          case 11:
          case "end":
            return _context26.stop();
        }
      }, _callee26, null, [[1, 8]]);
    }));
    return _downloadJupyter2.apply(this, arguments);
  }
  function _showJupyterImport() {
    dialogFuncs.showModal("FileImportDialog", {
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
    _combineCollections2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee27() {
      var res_name, data, other_name, target, _data, new_name;
      return _regeneratorRuntime().wrap(function _callee27$(_context27) {
        while (1) switch (_context27.prev = _context27.next) {
          case 0:
            res_name = pStateRef.current.select_state.selected_resource.name;
            if (pStateRef.current.select_state.multi_select) {
              _context27.next = 24;
              break;
            }
            _context27.prev = 2;
            _context27.next = 5;
            return (0, _communication_react.postAjaxPromise)("get_resource_names/collection", {});
          case 5:
            data = _context27.sent;
            _context27.next = 8;
            return dialogFuncs.showModalPromise("SelectDialog", {
              title: "Select a new collection to combine with " + res_name,
              select_label: "Collection to Combine",
              cancel_text: "Cancel",
              submit_text: "Combine",
              option_list: data.resource_names,
              handleClose: dialogFuncs.hideModal
            });
          case 8:
            other_name = _context27.sent;
            statusFuncs.startSpinner(true);
            target = "combine_collections/".concat(res_name, "/").concat(other_name);
            _context27.next = 13;
            return (0, _communication_react.postAjaxPromise)(target, {});
          case 13:
            statusFuncs.stopSpinner();
            statusFuncs.statusMessage("Combined Collections");
            _context27.next = 22;
            break;
          case 17:
            _context27.prev = 17;
            _context27.t0 = _context27["catch"](2);
            if (_context27.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error combining collections", _context27.t0);
            }
            statusFuncs.stopSpinner();
            return _context27.abrupt("return");
          case 22:
            _context27.next = 40;
            break;
          case 24:
            _context27.prev = 24;
            _context27.next = 27;
            return (0, _communication_react.postAjaxPromise)("get_resource_names/collection", {});
          case 27:
            _data = _context27.sent;
            _context27.next = 30;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Combine Collections",
              field_title: "Name for combined collection",
              default_value: "NewCollection",
              existing_names: _data.resource_names,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 30:
            new_name = _context27.sent;
            _context27.next = 33;
            return (0, _communication_react.postAjaxPromise)("combine_to_new_collection", {
              "original_collections": pStateRef.current.select_state.list_of_selected,
              "new_name": new_name
            });
          case 33:
            _context27.next = 40;
            break;
          case 35:
            _context27.prev = 35;
            _context27.t1 = _context27["catch"](24);
            if (_context27.t1 != "canceled") {
              errorDrawerFuncs.addFromError("Error combining collections", _context27.t1);
            }
            statusFuncs.stopSpinner();
            return _context27.abrupt("return");
          case 40:
          case "end":
            return _context27.stop();
        }
      }, _callee27, null, [[2, 17], [24, 35]]);
    }));
    return _combineCollections2.apply(this, arguments);
  }
  function _downloadCollection() {
    return _downloadCollection2.apply(this, arguments);
  }
  function _downloadCollection2() {
    _downloadCollection2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee28() {
      var resource_name,
        res_name,
        new_name,
        _args28 = arguments;
      return _regeneratorRuntime().wrap(function _callee28$(_context28) {
        while (1) switch (_context28.prev = _context28.next) {
          case 0:
            resource_name = _args28.length > 0 && _args28[0] !== undefined ? _args28[0] : null;
            res_name = resource_name ? resource_name : pStateRef.current.select_state.selected_resource.name;
            _context28.prev = 2;
            _context28.next = 5;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Download Collection",
              field_title: "New File Name",
              default_value: res_name,
              existing_names: [],
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 5:
            new_name = _context28.sent;
            window.open("".concat($SCRIPT_ROOT, "/download_collection/") + res_name + "/" + new_name);
            _context28.next = 13;
            break;
          case 9:
            _context28.prev = 9;
            _context28.t0 = _context28["catch"](2);
            if (_context28.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error combing collections", _context28.t0);
            }
            return _context28.abrupt("return");
          case 13:
          case "end":
            return _context28.stop();
        }
      }, _callee28, null, [[2, 9]]);
    }));
    return _downloadCollection2.apply(this, arguments);
  }
  function _displayImportResults(data) {
    var title = "Collection Created";
    var message = "";
    var number_of_errors;
    if (data.file_decoding_errors == null) {
      statusFuncs.statusMessage("No import errors");
    } else {
      message = "<b>Decoding errors were enountered</b>";
      for (var filename in data.file_decoding_errors) {
        number_of_errors = String(data.file_decoding_errors[filename].length);
        message = message + "<br>".concat(filename, ": ").concat(number_of_errors, " errors");
      }
      errorDrawerFuncs.addErrorDrawerEntry({
        title: title,
        content: message
      });
    }
  }
  function _showCollectionImport() {
    dialogFuncs.showModal("FileImportDialog", {
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
  function _import_collection(_x0, _x1, _x10, _x11) {
    return _import_collection2.apply(this, arguments);
  }
  function _import_collection2() {
    _import_collection2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee29(myDropZone, setCurrentUrl, new_name, check_results) {
      var csv_options,
        doc_type,
        new_url,
        _args29 = arguments;
      return _regeneratorRuntime().wrap(function _callee29$(_context29) {
        while (1) switch (_context29.prev = _context29.next) {
          case 0:
            csv_options = _args29.length > 4 && _args29[4] !== undefined ? _args29[4] : null;
            doc_type = check_results["import_as_freeform"] ? "freeform" : "table";
            _context29.prev = 2;
            _context29.next = 5;
            return (0, _communication_react.postAjaxPromise)("create_empty_collection", {
              "collection_name": new_name,
              "doc_type": doc_type,
              "library_id": props.library_id,
              "csv_options": csv_options
            });
          case 5:
            new_url = "append_documents_to_collection/".concat(new_name, "/").concat(doc_type, "/").concat(props.library_id);
            myDropZone.options.url = new_url;
            setCurrentUrl(new_url);
            myDropZone.processQueue();
            _context29.next = 14;
            break;
          case 11:
            _context29.prev = 11;
            _context29.t0 = _context29["catch"](2);
            errorDrawerFuncs.addFromError("Error importing document", _context29.t0);
          case 14:
          case "end":
            return _context29.stop();
        }
      }, _callee29, null, [[2, 11]]);
    }));
    return _import_collection2.apply(this, arguments);
  }
  function _tile_view() {
    return _tile_view2.apply(this, arguments);
  }
  function _tile_view2() {
    _tile_view2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee30() {
      return _regeneratorRuntime().wrap(function _callee30$(_context30) {
        while (1) switch (_context30.prev = _context30.next) {
          case 0:
            _context30.next = 2;
            return _view_func("/view_module/");
          case 2:
          case "end":
            return _context30.stop();
        }
      }, _callee30);
    }));
    return _tile_view2.apply(this, arguments);
  }
  function _view_named_tile(_x12) {
    return _view_named_tile2.apply(this, arguments);
  }
  function _view_named_tile2() {
    _view_named_tile2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee31(res) {
      var in_new_tab,
        _args31 = arguments;
      return _regeneratorRuntime().wrap(function _callee31$(_context31) {
        while (1) switch (_context31.prev = _context31.next) {
          case 0:
            in_new_tab = _args31.length > 1 && _args31[1] !== undefined ? _args31[1] : false;
            _context31.next = 3;
            return _view_resource({
              name: res.name,
              res_type: "tile"
            }, "/view_module/", in_new_tab);
          case 3:
          case "end":
            return _context31.stop();
        }
      }, _callee31);
    }));
    return _view_named_tile2.apply(this, arguments);
  }
  function _creator_view_named_tile(_x13) {
    return _creator_view_named_tile2.apply(this, arguments);
  }
  function _creator_view_named_tile2() {
    _creator_view_named_tile2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee32(res) {
      var in_new_tab,
        _args32 = arguments;
      return _regeneratorRuntime().wrap(function _callee32$(_context32) {
        while (1) switch (_context32.prev = _context32.next) {
          case 0:
            in_new_tab = _args32.length > 1 && _args32[1] !== undefined ? _args32[1] : false;
            _context32.next = 3;
            return _view_resource({
              name: res.tile,
              res_type: "tile"
            }, "/view_in_creator/", in_new_tab);
          case 3:
          case "end":
            return _context32.stop();
        }
      }, _callee32);
    }));
    return _creator_view_named_tile2.apply(this, arguments);
  }
  function _creator_view() {
    return _creator_view2.apply(this, arguments);
  }
  function _creator_view2() {
    _creator_view2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee33() {
      return _regeneratorRuntime().wrap(function _callee33$(_context33) {
        while (1) switch (_context33.prev = _context33.next) {
          case 0:
            _context33.next = 2;
            return _view_func("/view_in_creator/");
          case 2:
          case "end":
            return _context33.stop();
        }
      }, _callee33);
    }));
    return _creator_view2.apply(this, arguments);
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
    _load_tile2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee34() {
      var resource,
        res_name,
        _args34 = arguments;
      return _regeneratorRuntime().wrap(function _callee34$(_context34) {
        while (1) switch (_context34.prev = _context34.next) {
          case 0:
            resource = _args34.length > 0 && _args34[0] !== undefined ? _args34[0] : null;
            res_name = resource ? resource.name : pStateRef.current.select_state.selected_resource.name;
            _context34.prev = 2;
            _context34.next = 5;
            return (0, _communication_react.postPromise)("host", "load_tile_module_task", {
              "tile_module_name": res_name,
              "user_id": window.user_id
            });
          case 5:
            statusFuncs.statusMessage("Loaded tile ".concat(res_name));
            _context34.next = 11;
            break;
          case 8:
            _context34.prev = 8;
            _context34.t0 = _context34["catch"](2);
            errorDrawerFuncs.addFromError("Error loading tile", _context34.t0);
          case 11:
          case "end":
            return _context34.stop();
        }
      }, _callee34, null, [[2, 8]]);
    }));
    return _load_tile2.apply(this, arguments);
  }
  function _unload_module() {
    return _unload_module2.apply(this, arguments);
  }
  function _unload_module2() {
    _unload_module2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee35() {
      var resource,
        res_name,
        _args35 = arguments;
      return _regeneratorRuntime().wrap(function _callee35$(_context35) {
        while (1) switch (_context35.prev = _context35.next) {
          case 0:
            resource = _args35.length > 0 && _args35[0] !== undefined ? _args35[0] : null;
            res_name = resource ? resource.name : pStateRef.current.select_state.selected_resource.name;
            _context35.prev = 2;
            _context35.next = 5;
            return (0, _communication_react.postAjaxPromise)("unload_one_module/".concat(res_name), {});
          case 5:
            statusFuncs.statusMessage("Tile unloaded");
            _context35.next = 11;
            break;
          case 8:
            _context35.prev = 8;
            _context35.t0 = _context35["catch"](2);
            errorDrawerFuncs.addFromError("Error unloading tile", _context35.t0);
          case 11:
          case "end":
            return _context35.stop();
        }
      }, _callee35, null, [[2, 8]]);
    }));
    return _unload_module2.apply(this, arguments);
  }
  function _unload_all_tiles() {
    return _unload_all_tiles2.apply(this, arguments);
  }
  function _unload_all_tiles2() {
    _unload_all_tiles2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee36() {
      return _regeneratorRuntime().wrap(function _callee36$(_context36) {
        while (1) switch (_context36.prev = _context36.next) {
          case 0:
            _context36.prev = 0;
            _context36.next = 3;
            return (0, _communication_react.postAjaxPromise)("unload_all_tiles", {});
          case 3:
            statusFuncs.statusMessage("Unloaded all tiles");
            _context36.next = 9;
            break;
          case 6:
            _context36.prev = 6;
            _context36.t0 = _context36["catch"](0);
            errorDrawerFuncs.addFromError("Error unloading tiles", _context36.t0);
          case 9:
          case "end":
            return _context36.stop();
        }
      }, _callee36, null, [[0, 6]]);
    }));
    return _unload_all_tiles2.apply(this, arguments);
  }
  function _new_tile(_x14) {
    return _new_tile2.apply(this, arguments);
  }
  function _new_tile2() {
    _new_tile2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee37(template_name) {
      var data, new_name, result_dict;
      return _regeneratorRuntime().wrap(function _callee37$(_context37) {
        while (1) switch (_context37.prev = _context37.next) {
          case 0:
            _context37.prev = 0;
            _context37.next = 3;
            return (0, _communication_react.postAjaxPromise)("get_resource_names/tile", {});
          case 3:
            data = _context37.sent;
            _context37.next = 6;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "New Tile",
              field_title: "New Tile Name",
              default_value: "NewTileModule",
              existing_names: data.resource_names,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 6:
            new_name = _context37.sent;
            result_dict = {
              "template_name": template_name,
              "new_res_name": new_name,
              "last_saved": "viewer"
            };
            _context37.next = 10;
            return (0, _communication_react.postAjaxPromise)("/create_tile_module", result_dict);
          case 10:
            _context37.next = 12;
            return _view_resource({
              name: new_name,
              res_type: "tile"
            }, "/view_module/");
          case 12:
            _context37.next = 18;
            break;
          case 14:
            _context37.prev = 14;
            _context37.t0 = _context37["catch"](0);
            if (_context37.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error creating tile module", _context37.t0);
            }
            return _context37.abrupt("return");
          case 18:
          case "end":
            return _context37.stop();
        }
      }, _callee37, null, [[0, 14]]);
    }));
    return _new_tile2.apply(this, arguments);
  }
  function _new_in_creator(_x15) {
    return _new_in_creator2.apply(this, arguments);
  }
  function _new_in_creator2() {
    _new_in_creator2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee38(template_name) {
      var data, new_name, result_dict;
      return _regeneratorRuntime().wrap(function _callee38$(_context38) {
        while (1) switch (_context38.prev = _context38.next) {
          case 0:
            _context38.prev = 0;
            _context38.next = 3;
            return (0, _communication_react.postAjaxPromise)("get_resource_names/tile", {});
          case 3:
            data = _context38.sent;
            _context38.next = 6;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "New Tile",
              field_title: "New Tile Name",
              default_value: "NewTileModule",
              existing_names: data.resource_names,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 6:
            new_name = _context38.sent;
            result_dict = {
              "template_name": template_name,
              "new_res_name": new_name,
              "last_saved": "creator"
            };
            _context38.next = 10;
            return (0, _communication_react.postAjaxPromise)("/create_tile_module", result_dict);
          case 10:
            _context38.next = 12;
            return _view_resource({
              name: String(new_name),
              res_type: "tile"
            }, "/view_in_creator/");
          case 12:
            _context38.next = 17;
            break;
          case 14:
            _context38.prev = 14;
            _context38.t0 = _context38["catch"](0);
            if (_context38.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error creating tile module", _context38.t0);
            }
          case 17:
          case "end":
            return _context38.stop();
        }
      }, _callee38, null, [[0, 14]]);
    }));
    return _new_in_creator2.apply(this, arguments);
  }
  function _new_list(_x16) {
    return _new_list2.apply(this, arguments);
  }
  function _new_list2() {
    _new_list2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee39(template_name) {
      var data, new_name, result_dict;
      return _regeneratorRuntime().wrap(function _callee39$(_context39) {
        while (1) switch (_context39.prev = _context39.next) {
          case 0:
            _context39.prev = 0;
            _context39.next = 3;
            return (0, _communication_react.postAjaxPromise)("get_resource_names/list", {});
          case 3:
            data = _context39.sent;
            _context39.next = 6;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "New List Resource",
              field_title: "New List Name",
              default_value: "NewListResource",
              existing_names: data.resource_names,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 6:
            new_name = _context39.sent;
            result_dict = {
              "template_name": template_name,
              "new_res_name": new_name
            };
            _context39.next = 10;
            return (0, _communication_react.postAjaxPromise)("/create_list", result_dict);
          case 10:
            _context39.next = 12;
            return _view_resource({
              name: String(new_name),
              res_type: "list"
            }, "/view_list/");
          case 12:
            _context39.next = 17;
            break;
          case 14:
            _context39.prev = 14;
            _context39.t0 = _context39["catch"](0);
            if (_context39.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error creating list resource", _context39.t0);
            }
          case 17:
          case "end":
            return _context39.stop();
        }
      }, _callee39, null, [[0, 14]]);
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
  function _add_to_pool(myDropZone, setCurrentUrl, current_value) {
    var new_url = "import_pool/".concat(props.library_id);
    myDropZone.options.url = new_url;
    setCurrentUrl(new_url);
    myDropZone.processQueue();
  }
  function _new_code(_x17) {
    return _new_code2.apply(this, arguments);
  }
  function _new_code2() {
    _new_code2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee40(template_name) {
      var data, new_name, result_dict;
      return _regeneratorRuntime().wrap(function _callee40$(_context40) {
        while (1) switch (_context40.prev = _context40.next) {
          case 0:
            _context40.prev = 0;
            _context40.next = 3;
            return (0, _communication_react.postAjaxPromise)("get_resource_names/code", {});
          case 3:
            data = _context40.sent;
            _context40.next = 6;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "New code Resource",
              field_title: "New Code Resource Name",
              default_value: "NewCodeResource",
              existing_names: data.resource_names,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 6:
            new_name = _context40.sent;
            result_dict = {
              "template_name": template_name,
              "new_res_name": new_name
            };
            _context40.next = 10;
            return (0, _communication_react.postAjaxPromise)("/create_code", result_dict);
          case 10:
            _context40.next = 12;
            return _view_resource({
              name: String(new_name),
              res_type: "code"
            }, "/view_code/");
          case 12:
            _context40.next = 17;
            break;
          case 14:
            _context40.prev = 14;
            _context40.t0 = _context40["catch"](0);
            if (_context40.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error creating code resource", _context40.t0);
            }
          case 17:
          case "end":
            return _context40.stop();
        }
      }, _callee40, null, [[0, 14]]);
    }));
    return _new_code2.apply(this, arguments);
  }
  function setContextMenuItems(context_menu_items) {
    pDispatch({
      type: "SET_CONTEXT_MENU_ITEMS",
      context_menu_items: context_menu_items
    });
  }
  function _menu_funcs() {
    return {
      view_func: _view_func,
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
      creator_view: _creator_view,
      tile_view: _tile_view,
      creator_view_named_tile: _creator_view_named_tile,
      view_named_tile: _view_named_tile,
      load_tile: _load_tile,
      unload_module: _unload_module,
      unload_all_tiles: _unload_all_tiles,
      showHistoryViewer: _showHistoryViewer,
      compare_tiles: _compare_tiles,
      new_list: _new_list,
      showListImport: _showListImport,
      new_code: _new_code
    };
  }
  var new_button_groups;
  var res_type = pStateRef.current.select_state.selected_resource.res_type;
  var res_name = pStateRef.current.select_state.selected_resource.name;
  var right_pane = /*#__PURE__*/_react["default"].createElement(_blueprint_mdata_fields.CombinedMetadata, {
    key: "key=".concat(res_type, "-").concat(res_name, "-metadata"),
    elevation: 0,
    tsocket: props.tsocket,
    res_name: res_name,
    res_type: res_type,
    outer_style: metadata_outer_style,
    expandWidth: true,
    readOnly: props.is_repository
  });
  var th_style = {
    "display": "inline-block",
    "verticalAlign": "top",
    "maxHeight": "100%",
    "overflowY": "scroll",
    "overflowX": "scroll",
    "lineHeight": 1,
    "whiteSpace": "nowrap"
  };
  var MenubarClass = props.MenubarClass;
  var filter_buttons = [];
  var _iterator3 = _createForOfIteratorHelper(["all"].concat(res_types)),
    _step3;
  try {
    var _loop = function _loop() {
      var rtype = _step3.value;
      filter_buttons.push(/*#__PURE__*/_react["default"].createElement(_popover.Tooltip2, {
        content: rtype,
        key: rtype,
        placement: "top",
        hoverOpenDelay: 700,
        intent: "warning"
      }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
        icon: _blueprint_mdata_fields.icon_dict[rtype],
        minimal: true,
        active: rtype == pState.search_state.filterType,
        onClick: /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee41() {
          return _regeneratorRuntime().wrap(function _callee41$(_context41) {
            while (1) switch (_context41.prev = _context41.next) {
              case 0:
                _context41.next = 2;
                return _setFilterType(rtype);
              case 2:
              case "end":
                return _context41.stop();
            }
          }, _callee41);
        }))
      })));
    };
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      _loop();
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
  var left_pane = /*#__PURE__*/_react["default"].createElement(_library_table_pane.LibraryTablePane, _extends({}, props, {
    pStateRef: pStateRef,
    filter_buttons: filter_buttons,
    update_search_state: _update_search_state,
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
    library_id: props.library_id,
    controlled: props.controlled,
    tsocket: props.tsocket
  })), /*#__PURE__*/_react["default"].createElement("div", {
    ref: top_ref,
    tabIndex: "0",
    className: "d-flex flex-column",
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      width: "100%",
      height: usable_height
    }
  }, /*#__PURE__*/_react["default"].createElement(_resizing_layouts.HorizontalPanes, {
    show_handle: true,
    left_pane: left_pane,
    right_pane: right_pane,
    right_pane_overflow: "auto",
    initial_width_fraction: .75,
    scrollAdjustSelectors: [".bp5-table-quadrant-scroll-container"],
    handleSplitUpdate: null,
    handleResizeStart: null,
    handleResizeEnd: null
  }))));
}
exports.LibraryPane = LibraryPane = /*#__PURE__*/(0, _react.memo)(LibraryPane);
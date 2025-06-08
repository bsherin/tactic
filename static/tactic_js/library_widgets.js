"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BpSelectorTable = BpSelectorTable;
exports.SearchForm = SearchForm;
require("../tactic_css/tactic_select.scss");
var _react = _interopRequireWildcard(require("react"));
var _objectHash = _interopRequireDefault(require("object-hash"));
var _core = require("@blueprintjs/core");
var _table = require("@blueprintjs/table");
var _lodash = _interopRequireDefault(require("lodash"));
var _utilities_react = require("./utilities_react");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return r; }; var t, r = {}, e = Object.prototype, n = e.hasOwnProperty, o = "function" == typeof Symbol ? Symbol : {}, i = o.iterator || "@@iterator", a = o.asyncIterator || "@@asyncIterator", u = o.toStringTag || "@@toStringTag"; function c(t, r, e, n) { return Object.defineProperty(t, r, { value: e, enumerable: !n, configurable: !n, writable: !n }); } try { c({}, ""); } catch (t) { c = function c(t, r, e) { return t[r] = e; }; } function h(r, e, n, o) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype); return c(a, "_invoke", function (r, e, n) { var o = 1; return function (i, a) { if (3 === o) throw Error("Generator is already running"); if (4 === o) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var u = n.delegate; if (u) { var c = d(u, n); if (c) { if (c === f) continue; return c; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (1 === o) throw o = 4, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = 3; var h = s(r, e, n); if ("normal" === h.type) { if (o = n.done ? 4 : 2, h.arg === f) continue; return { value: h.arg, done: n.done }; } "throw" === h.type && (o = 4, n.method = "throw", n.arg = h.arg); } }; }(r, n, new Context(o || [])), !0), a; } function s(t, r, e) { try { return { type: "normal", arg: t.call(r, e) }; } catch (t) { return { type: "throw", arg: t }; } } r.wrap = h; var f = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var l = {}; c(l, i, function () { return this; }); var p = Object.getPrototypeOf, y = p && p(p(x([]))); y && y !== e && n.call(y, i) && (l = y); var v = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(l); function g(t) { ["next", "throw", "return"].forEach(function (r) { c(t, r, function (t) { return this._invoke(r, t); }); }); } function AsyncIterator(t, r) { function e(o, i, a, u) { var c = s(t[o], t, i); if ("throw" !== c.type) { var h = c.arg, f = h.value; return f && "object" == _typeof(f) && n.call(f, "__await") ? r.resolve(f.__await).then(function (t) { e("next", t, a, u); }, function (t) { e("throw", t, a, u); }) : r.resolve(f).then(function (t) { h.value = t, a(h); }, function (t) { return e("throw", t, a, u); }); } u(c.arg); } var o; c(this, "_invoke", function (t, n) { function i() { return new r(function (r, o) { e(t, n, r, o); }); } return o = o ? o.then(i, i) : i(); }, !0); } function d(r, e) { var n = e.method, o = r.i[n]; if (o === t) return e.delegate = null, "throw" === n && r.i["return"] && (e.method = "return", e.arg = t, d(r, e), "throw" === e.method) || "return" !== n && (e.method = "throw", e.arg = new TypeError("The iterator does not provide a '" + n + "' method")), f; var i = s(o, r.i, e.arg); if ("throw" === i.type) return e.method = "throw", e.arg = i.arg, e.delegate = null, f; var a = i.arg; return a ? a.done ? (e[r.r] = a.value, e.next = r.n, "return" !== e.method && (e.method = "next", e.arg = t), e.delegate = null, f) : a : (e.method = "throw", e.arg = new TypeError("iterator result is not an object"), e.delegate = null, f); } function w(t) { this.tryEntries.push(t); } function m(r) { var e = r[4] || {}; e.type = "normal", e.arg = t, r[4] = e; } function Context(t) { this.tryEntries = [[-1]], t.forEach(w, this), this.reset(!0); } function x(r) { if (null != r) { var e = r[i]; if (e) return e.call(r); if ("function" == typeof r.next) return r; if (!isNaN(r.length)) { var o = -1, a = function e() { for (; ++o < r.length;) if (n.call(r, o)) return e.value = r[o], e.done = !1, e; return e.value = t, e.done = !0, e; }; return a.next = a; } } throw new TypeError(_typeof(r) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, c(v, "constructor", GeneratorFunctionPrototype), c(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = c(GeneratorFunctionPrototype, u, "GeneratorFunction"), r.isGeneratorFunction = function (t) { var r = "function" == typeof t && t.constructor; return !!r && (r === GeneratorFunction || "GeneratorFunction" === (r.displayName || r.name)); }, r.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, c(t, u, "GeneratorFunction")), t.prototype = Object.create(v), t; }, r.awrap = function (t) { return { __await: t }; }, g(AsyncIterator.prototype), c(AsyncIterator.prototype, a, function () { return this; }), r.AsyncIterator = AsyncIterator, r.async = function (t, e, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(h(t, e, n, o), i); return r.isGeneratorFunction(e) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, g(v), c(v, u, "Generator"), c(v, i, function () { return this; }), c(v, "toString", function () { return "[object Generator]"; }), r.keys = function (t) { var r = Object(t), e = []; for (var n in r) e.unshift(n); return function t() { for (; e.length;) if ((n = e.pop()) in r) return t.value = n, t.done = !1, t; return t.done = !0, t; }; }, r.values = x, Context.prototype = { constructor: Context, reset: function reset(r) { if (this.prev = this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(m), !r) for (var e in this) "t" === e.charAt(0) && n.call(this, e) && !isNaN(+e.slice(1)) && (this[e] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0][4]; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(r) { if (this.done) throw r; var e = this; function n(t) { a.type = "throw", a.arg = r, e.next = t; } for (var o = e.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i[4], u = this.prev, c = i[1], h = i[2]; if (-1 === i[0]) return n("end"), !1; if (!c && !h) throw Error("try statement without catch or finally"); if (null != i[0] && i[0] <= u) { if (u < c) return this.method = "next", this.arg = t, n(c), !0; if (u < h) return n(h), !1; } } }, abrupt: function abrupt(t, r) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var n = this.tryEntries[e]; if (n[0] > -1 && n[0] <= this.prev && this.prev < n[2]) { var o = n; break; } } o && ("break" === t || "continue" === t) && o[0] <= r && r <= o[2] && (o = null); var i = o ? o[4] : {}; return i.type = t, i.arg = r, o ? (this.method = "next", this.next = o[2], f) : this.complete(i); }, complete: function complete(t, r) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && r && (this.next = r), f; }, finish: function finish(t) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var e = this.tryEntries[r]; if (e[2] === t) return this.complete(e[4], e[3]), m(e), f; } }, "catch": function _catch(t) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var e = this.tryEntries[r]; if (e[0] === t) { var n = e[4]; if ("throw" === n.type) { var o = n.arg; m(e); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(r, e, n) { return this.delegate = { i: x(r), r: e, n: n }, "next" === this.method && (this.arg = t), f; } }, r; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
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
function SearchForm(props) {
  props = _objectSpread({
    allow_search_inside: false,
    allow_search_metadata: false,
    allow_show_hidden: false,
    allow_regex: false,
    regex: false,
    search_inside: false,
    search_metadata: false,
    show_hidden: false,
    field_width: 265,
    include_search_jumper: false,
    current_search_number: null,
    searchNext: null,
    searchPrev: null,
    search_ref: null,
    number_matches: null,
    update_delay: 500
  }, props);
  var _useState = (0, _react.useState)(null),
    _useState2 = _slicedToArray(_useState, 2),
    temp_text = _useState2[0],
    set_temp_text = _useState2[1];
  var _useDebounce = (0, _utilities_react.useDebounce)(function (newval) {
      props.update_search_state({
        "search_string": newval
      });
    }),
    _useDebounce2 = _slicedToArray(_useDebounce, 2),
    waiting = _useDebounce2[0],
    doUpdate = _useDebounce2[1];
  function _handleSearchFieldChange(event) {
    doUpdate(event.target.value);
    set_temp_text(event.target.value);
  }
  function _handleClearSearch() {
    props.update_search_state({
      "search_string": ""
    });
  }
  function _handleSearchMetadataChange(event) {
    props.update_search_state({
      "search_metadata": event.target.checked
    });
  }
  function _handleSearchInsideChange(event) {
    props.update_search_state({
      "search_inside": event.target.checked
    });
  }
  function _handleShowHiddenChange(event) {
    props.update_search_state({
      "show_hidden": event.target.checked
    });
  }
  function _handleRegexChange(event) {
    props.update_search_state({
      "regex": event.target.checked
    });
  }
  var match_text;
  if (props.number_matches != null && props.search_string && props.search_string != "") {
    switch (props.number_matches) {
      case 0:
        match_text = "no matches";
        break;
      case 1:
        match_text = "1 match";
        break;
      default:
        match_text = "".concat(props.number_matches, " matches");
        break;
    }
  } else {
    match_text = null;
  }
  var current_text = waiting.current ? temp_text : props.search_string;
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    helperText: match_text,
    style: {
      marginBottom: 0
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-row",
    style: {
      marginTop: 5,
      marginBottom: 5
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
    type: "search",
    className: "search-input",
    placeholder: "Search",
    leftIcon: "search",
    value: current_text,
    onChange: _handleSearchFieldChange,
    style: {
      "width": props.field_width
    },
    autoCapitalize: "none",
    autoCorrect: "off",
    small: true,
    inputRef: props.search_ref
  }), props.allow_regex && /*#__PURE__*/_react["default"].createElement(_core.Switch, {
    label: "regexp",
    className: "ml-3 mb-0 mt-1",
    large: false,
    checked: props.regex,
    onChange: _handleRegexChange
  }), props.allow_search_metadata && /*#__PURE__*/_react["default"].createElement(_core.Switch, {
    label: "metadata",
    className: "ml-3 mb-0 mt-1",
    large: false,
    checked: props.search_metadata,
    onChange: _handleSearchMetadataChange
  }), props.allow_search_inside && /*#__PURE__*/_react["default"].createElement(_core.Switch, {
    label: "inside",
    className: "ml-3 mb-0 mt-1",
    large: false,
    checked: props.search_inside,
    onChange: _handleSearchInsideChange
  }), props.allow_show_hidden && /*#__PURE__*/_react["default"].createElement(_core.Switch, {
    label: "show hidden",
    className: "ml-3 mb-0 mt-1",
    large: false,
    checked: props.show_hidden,
    onChange: _handleShowHiddenChange
  }), props.include_search_jumper && /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, {
    style: {
      marginLeft: 5,
      padding: 2
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
    onClick: props.searchNext,
    icon: "caret-down",
    text: undefined,
    small: true
  }), /*#__PURE__*/_react["default"].createElement(_core.Button, {
    onClick: props.searchPrev,
    icon: "caret-up",
    text: undefined,
    small: true
  })))));
}
exports.SearchForm = SearchForm = /*#__PURE__*/(0, _react.memo)(SearchForm);
function BpSelectorTable(props) {
  props = _objectSpread({
    columns: {
      "name": {
        "sort_field": "name",
        "first_sort": "ascending"
      },
      "created": {
        "sort_field": "created_for_sort",
        "first_sort": "descending"
      },
      "updated": {
        "sort_field": "updated_for_sort",
        "first_sort": "ascending"
      },
      "tags": {
        "sort_field": "tags",
        "first_sort": "ascending"
      }
    },
    identifier_field: "name",
    enableColumnResigin: false,
    maxColumnWidth: null,
    active_row: 0,
    show_animations: false,
    handleSpaceBarPress: null,
    keyHandler: null,
    draggable: true,
    rowChanged: 0
  }, props);
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)(null),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    columnWidths = _useStateAndRef2[0],
    setColumnWidths = _useStateAndRef2[1],
    columnWidthsRef = _useStateAndRef2[2];
  var saved_data_dict = (0, _react.useRef)(null);
  var data_update_required = (0, _react.useRef)(null);
  var table_ref = (0, _react.useRef)(null);
  (0, _react.useEffect)(function () {
    computeColumnWidths();
    saved_data_dict.current = props.data_dict;
  }, []);
  (0, _react.useEffect)(function () {
    if (columnWidthsRef.current == null || !_lodash["default"].isEqual(props.data_dict, saved_data_dict.current)) {
      computeColumnWidths();
      saved_data_dict.current = props.data_dict;
    }
  });
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  function computeColumnWidths() {
    if (Object.keys(props.data_dict).length == 0) return;
    var column_names = Object.keys(props.columns);
    var bcwidths = compute_initial_column_widths(column_names, Object.values(props.data_dict));
    var cwidths = [];
    if (props.maxColumnWidth) {
      var _iterator = _createForOfIteratorHelper(bcwidths),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var c = _step.value;
          if (c > props.maxColumnWidth) {
            cwidths.push(props.maxColumnWidth);
          } else {
            cwidths.push(c);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    } else {
      cwidths = bcwidths;
    }
    setColumnWidths(cwidths);
    pushCallback(function () {
      var the_sum = columnWidthsRef.current.reduce(function (a, b) {
        return a + b;
      }, 0);
      props.communicateColumnWidthSum(the_sum);
    });
  }
  function _onCompleteRender() {
    return _onCompleteRender2.apply(this, arguments);
  }
  function _onCompleteRender2() {
    _onCompleteRender2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var lastColumnRegion, firstColumnRegion;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            if (!(data_update_required.current != null)) {
              _context.next = 4;
              break;
            }
            _context.next = 3;
            return props.initiateDataGrab(data_update_required.current);
          case 3:
            data_update_required.current = null;
          case 4:
            lastColumnRegion = _table.Regions.column(Object.keys(props.columns).length - 1);
            firstColumnRegion = _table.Regions.column(0);
            table_ref.current.scrollToRegion(lastColumnRegion);
            table_ref.current.scrollToRegion(firstColumnRegion);
          case 8:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return _onCompleteRender2.apply(this, arguments);
  }
  function haveRowData(rowIndex) {
    return props.data_dict.hasOwnProperty(rowIndex);
  }
  function _cellRendererCreator(column_name) {
    return function (rowIndex) {
      if (!haveRowData(rowIndex)) {
        if (data_update_required.current == null) {
          data_update_required.current = rowIndex;
        }
        return /*#__PURE__*/_react["default"].createElement(_table.Cell, {
          key: column_name,
          loading: true
        });
      }
      var the_body;
      var the_class = "";
      if (Object.keys(props.data_dict[rowIndex]).includes(column_name)) {
        if ("hidden" in props.data_dict[rowIndex] && props.data_dict[rowIndex]["hidden"]) {
          the_class = "hidden_cell";
        }
        var the_text = String(props.data_dict[rowIndex][column_name]);
        if (the_text.startsWith("icon:")) {
          the_text = the_text.replace(/(^icon:)/gi, "");
          the_body = /*#__PURE__*/_react["default"].createElement(_core.Icon, {
            icon: the_text,
            size: 14
          });
        } else {
          the_body = /*#__PURE__*/_react["default"].createElement(_table.TruncatedFormat, {
            className: the_class
          }, the_text);
        }
      } else {
        the_body = "";
      }
      var tclass;
      if (props.open_resources_ref && props.open_resources_ref.current && props.open_resources_ref.current.includes(props.data_dict[rowIndex][props.identifier_field])) {
        tclass = "open-selector-row";
      } else {
        tclass = "";
      }
      return /*#__PURE__*/_react["default"].createElement(_table.Cell, {
        key: column_name,
        interactive: true,
        truncated: true,
        tabIndex: -1,
        onKeyDown: props.keyHandler,
        wrapText: true
      }, /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
        className: tclass,
        onDoubleClick: function onDoubleClick() {
          return props.handleRowDoubleClick(props.data_dict[rowIndex]);
        }
      }, the_body)));
    };
  }
  function _renderMenu(sortColumn) {
    var sortAsc = function sortAsc() {
      props.sortColumn(sortColumn, "ascending");
    };
    var sortDesc = function sortDesc() {
      props.sortColumn(sortColumn, "descending");
    };
    return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "sort-asc",
      onClick: sortAsc,
      text: "Sort Asc"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "sort-desc",
      onClick: sortDesc,
      text: "Sort Desc"
    }));
  }
  function _columnHeaderNameRenderer(the_text) {
    var the_body;
    the_text = String(the_text);
    if (the_text.startsWith("icon:")) {
      the_text = the_text.replace(/(^icon:)/gi, "");
      the_body = /*#__PURE__*/_react["default"].createElement(_core.Icon, {
        icon: the_text,
        size: 14
      });
    } else {
      the_body = /*#__PURE__*/_react["default"].createElement("div", {
        className: "bp5-table-truncated-text"
      }, the_text);
    }
    return the_body;
  }
  var column_names = Object.keys(props.columns);
  var columns = column_names.map(function (column_name) {
    var cellRenderer = _cellRendererCreator(column_name);
    var columnHeaderCellRenderer = function columnHeaderCellRenderer() {
      return /*#__PURE__*/_react["default"].createElement(_table.ColumnHeaderCell, {
        name: column_name,
        nameRenderer: _columnHeaderNameRenderer,
        menuRenderer: function menuRenderer() {
          return _renderMenu(column_name);
        }
      });
    };
    return /*#__PURE__*/_react["default"].createElement(_table.Column, {
      cellRenderer: cellRenderer,
      enableColumnReordering: false,
      columnHeaderCellRenderer: columnHeaderCellRenderer,
      key: column_name,
      name: column_name
    });
  });
  var obj = {
    cwidths: columnWidths,
    nrows: props.num_rows
  };
  var hsh = (0, _objectHash["default"])(obj);
  var dependencies;
  if (props.open_resources_ref && props.open_resources_ref.current) {
    dependencies = [props.data_dict, props.open_resources_ref.current];
  } else {
    dependencies = [props.data_dict];
  }
  return /*#__PURE__*/_react["default"].createElement(_table.Table2, {
    numRows: props.num_rows,
    ref: table_ref,
    cellRendererDependencies: dependencies,
    bodyContextMenuRenderer: props.renderBodyContextMenu,
    enableColumnReordering: false,
    enableColumnResizing: props.enableColumnResizing,
    maxColumnWidth: props.maxColumnWidth,
    enableMultipleSelection: true,
    defaultRowHeight: 27,
    selectedRegions: props.selectedRegions,
    enableRowHeader: false,
    columnWidths: columnWidthsRef.current,
    onCompleteRender: _onCompleteRender,
    selectionModes: _table.SelectionModes.ALL,
    onSelection: function onSelection(regions) {
      return props.onSelection(regions);
    }
  }, columns);
}
exports.BpSelectorTable = BpSelectorTable = /*#__PURE__*/(0, _react.memo)(BpSelectorTable);
var MAX_INITIAL_CELL_WIDTH = 300;
var ICON_WIDTH = 35;
function compute_initial_column_widths(header_list, data_list) {
  var ncols = header_list.length;
  var max_field_width = MAX_INITIAL_CELL_WIDTH;

  // Get sample header and body cells

  // set up a canvas so that we can use it to compute the width of text
  // let body_font = $($(".bp5-table-truncated-text")[0]).css("font");
  var element = document.querySelector(".bp5-table-truncated-text");
  var body_font = window.getComputedStyle(element).getPropertyValue("font");
  //let header_font = $($(".bp5-table-column-name-text")[0]).css("font");
  var header_element = document.querySelector(".bp5-table-column-name-text");
  var header_font = window.getComputedStyle(header_element).getPropertyValue("font");
  var canvas_element = document.getElementById("measure-canvas");
  var ctx = canvas_element.getContext("2d");
  var added_body_width = 20;
  var added_header_width = 30;
  var column_widths = {};
  var columns_remaining = [];
  ctx.font = header_font;
  var _iterator2 = _createForOfIteratorHelper(header_list),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var c = _step2.value;
      var cstr = String(c);
      if (cstr.startsWith("icon:")) {
        column_widths[cstr] = ICON_WIDTH;
      } else {
        column_widths[cstr] = ctx.measureText(cstr).width + added_header_width;
      }
      columns_remaining.push(cstr);
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  var the_row;
  var the_width;
  var the_text;
  var the_child;

  // Find the width of each body cell
  // Keep track of the largest value for each column
  // Once a column has the max value can ignore that column in the future.
  ctx.font = body_font;
  var _iterator3 = _createForOfIteratorHelper(data_list),
    _step3;
  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var item = _step3.value;
      if (columns_remaining.length == 0) {
        break;
      }
      the_row = item;
      var cols_to_remove = [];
      var _iterator5 = _createForOfIteratorHelper(columns_remaining),
        _step5;
      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var _c2 = _step5.value;
          the_text = String(the_row[_c2]);
          if (the_text.startsWith("icon:")) {
            the_width = ICON_WIDTH;
          } else {
            the_width = ctx.measureText(the_text).width + added_body_width;
          }
          if (the_width > max_field_width) {
            the_width = max_field_width;
            cols_to_remove.push(_c2);
          }
          if (the_width > column_widths[_c2]) {
            column_widths[_c2] = the_width;
          }
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
      for (var _i = 0, _cols_to_remove = cols_to_remove; _i < _cols_to_remove.length; _i++) {
        var _c = _cols_to_remove[_i];
        var index = columns_remaining.indexOf(_c);
        if (index !== -1) {
          columns_remaining.splice(index, 1);
        }
      }
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
  var result = [];
  var _iterator4 = _createForOfIteratorHelper(header_list),
    _step4;
  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var _c3 = _step4.value;
      result.push(column_widths[_c3]);
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }
  return result;
}
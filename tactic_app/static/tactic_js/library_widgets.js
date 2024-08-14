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
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
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
  function _handleSubmit(event) {
    event.preventDefault();
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
    _onCompleteRender2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
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
    selectionModes: [_table.RegionCardinality.FULL_ROWS, _table.RegionCardinality.CELLS],
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
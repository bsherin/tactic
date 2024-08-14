"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExportsViewer = ExportsViewer;
var _react = _interopRequireWildcard(require("react"));
var _core = require("@blueprintjs/core");
var _blueprint_react_widgets = require("./blueprint_react_widgets.js");
var _communication_react = require("./communication_react.js");
var _utilities_react = require("./utilities_react");
var _error_drawer = require("./error_drawer");
var _sizing_tools = require("./sizing_tools");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var FOOTING_HEIGHT = 23;
function TextIcon(props) {
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("span", {
    className: "bp5-icon",
    style: {
      fontWeight: 500
    }
  }, props.the_text));
}
TextIcon = /*#__PURE__*/(0, _react.memo)(TextIcon);
var export_icon_dict = {
  str: "font",
  list: "array",
  range: "array",
  dict: /*#__PURE__*/_react["default"].createElement(TextIcon, {
    the_text: "{#}"
  }),
  set: /*#__PURE__*/_react["default"].createElement(TextIcon, {
    the_text: "{..}"
  }),
  tuple: /*#__PURE__*/_react["default"].createElement(TextIcon, {
    the_text: "(..)"
  }),
  bool: /*#__PURE__*/_react["default"].createElement(TextIcon, {
    the_text: "tf"
  }),
  bytes: /*#__PURE__*/_react["default"].createElement(TextIcon, {
    the_text: "b"
  }),
  NoneType: "small-cross",
  "int": "numerical",
  "float": "numerical",
  complex: "numerical",
  "function": "function",
  TacticDocument: "th",
  DetachedTacticDocument: "th",
  TacticCollection: "database",
  DetachedTacticCollection: "database",
  DetachedTacticRow: "th-derived",
  TacticRow: "th-derived",
  ndarray: "array-numeric",
  DataFrame: /*#__PURE__*/_react["default"].createElement(TextIcon, {
    the_text: "df"
  }),
  other: "cube",
  unknown: /*#__PURE__*/_react["default"].createElement(TextIcon, {
    the_text: "?"
  })
};
function ExportButtonListButton(props) {
  function _onPressed() {
    props.buttonPress(props.fullname);
  }
  return /*#__PURE__*/_react["default"].createElement(_core.Button, {
    className: "export-button",
    icon: export_icon_dict[props.type],
    minimal: false,
    onClick: _onPressed,
    key: props.fullname,
    active: props.active,
    small: true,
    value: props.fullname,
    text: props.shortname
  });
}
ExportButtonListButton = /*#__PURE__*/(0, _react.memo)(ExportButtonListButton);
function ExportButtonList(props) {
  var top_ref = (0, _react.useRef)(null);
  var select_ref = (0, _react.useRef)(null);
  var export_index_ref = (0, _react.useRef)({});
  var _useSize = (0, _sizing_tools.useSize)(top_ref, 0, "ExportButtonList"),
    _useSize2 = _slicedToArray(_useSize, 4),
    usable_width = _useSize2[0],
    usable_height = _useSize2[1],
    topX = _useSize2[2],
    topY = _useSize2[3];
  function _buttonPress(fullname) {
    props.handleChange(fullname, export_index_ref.current[fullname].shortname, export_index_ref.current[fullname].tilename);
  }
  function _compareEntries(a, b) {
    if (a[1].toLowerCase() == b[1].toLowerCase()) return 0;
    if (b[1].toLowerCase() > a[1].toLowerCase()) return -1;
    return 1;
  }
  function create_groups() {
    var groups = [];
    var group_names = Object.keys(props.pipe_dict);
    group_names.sort();
    var index = 0;
    for (var _i = 0, _group_names = group_names; _i < _group_names.length; _i++) {
      var group = _group_names[_i];
      var group_items = [];
      var entries = props.pipe_dict[group];
      entries.sort(_compareEntries);
      var _iterator = _createForOfIteratorHelper(entries),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var entry = _step.value;
          var fullname = entry[0];
          var shortname = entry[1];
          var type = entry.length == 3 ? entry[2] : "unknown";
          if (!(type in export_icon_dict)) {
            type = "other";
          }
          export_index_ref.current[fullname] = {
            tilename: group,
            shortname: shortname
          };
          group_items.push( /*#__PURE__*/_react["default"].createElement(ExportButtonListButton, {
            fullname: fullname,
            key: fullname,
            shortname: shortname,
            type: type,
            active: props.value == fullname,
            buttonPress: _buttonPress
          }));
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      if (group == "__log__") {
        groups.unshift( /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
          key: group,
          inline: false,
          label: null,
          className: "export-label"
        }, /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, {
          minimal: false,
          vertical: true,
          alignText: "left",
          key: group
        }, group_items)));
      } else {
        groups.push( /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
          key: group,
          inline: false,
          label: group,
          className: "export-label"
        }, /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, {
          minimal: false,
          vertical: true,
          alignText: "left",
          key: group
        }, group_items)));
      }
    }
    return groups;
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    id: "exports-button-list",
    ref: top_ref,
    style: {
      flexDirection: "column",
      display: "inline-block",
      verticalAlign: "top",
      padding: 15,
      height: usable_height - FOOTING_HEIGHT
    },
    className: "contingent-scroll"
  }, create_groups());
}
ExportButtonList = /*#__PURE__*/(0, _react.memo)(ExportButtonList);
var body_style = {
  padding: 15,
  width: "80%",
  height: "100%",
  display: "inline-block"
};
function ExportsViewer(props) {
  props = _objectSpread({
    style: {}
  }, props);
  var header_ref = (0, _react.useRef)(null);
  var footer_ref = (0, _react.useRef)(null);
  var body_ref = (0, _react.useRef)(null);
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)(""),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    selected_export = _useStateAndRef2[0],
    set_selected_export = _useStateAndRef2[1],
    selected_export_ref = _useStateAndRef2[2];
  var _useState = (0, _react.useState)(null),
    _useState2 = _slicedToArray(_useState, 2),
    selected_export_tilename = _useState2[0],
    set_selected_export_tilename = _useState2[1];
  var _useState3 = (0, _react.useState)(null),
    _useState4 = _slicedToArray(_useState3, 2),
    key_list = _useState4[0],
    set_key_list = _useState4[1];
  var _useState5 = (0, _react.useState)(null),
    _useState6 = _slicedToArray(_useState5, 2),
    key_list_value = _useState6[0],
    set_key_list_value = _useState6[1];
  var _useState7 = (0, _react.useState)(""),
    _useState8 = _slicedToArray(_useState7, 2),
    tail_value = _useState8[0],
    set_tail_value = _useState8[1];
  var _useStateAndRef3 = (0, _utilities_react.useStateAndRef)(25),
    _useStateAndRef4 = _slicedToArray(_useStateAndRef3, 3),
    max_rows = _useStateAndRef4[0],
    set_max_rows = _useStateAndRef4[1],
    max_rows_ref = _useStateAndRef4[2];
  var _useState9 = (0, _react.useState)(null),
    _useState10 = _slicedToArray(_useState9, 2),
    exports_info_value = _useState10[0],
    set_exports_info_value = _useState10[1];
  var _useState11 = (0, _react.useState)(null),
    _useState12 = _slicedToArray(_useState11, 2),
    selected_export_short_name = _useState12[0],
    set_selected_export_short_name = _useState12[1];
  var _useState13 = (0, _react.useState)(false),
    _useState14 = _slicedToArray(_useState13, 2),
    show_spinner = _useState14[0],
    set_show_spinner = _useState14[1];
  var _useState15 = (0, _react.useState)(false),
    _useState16 = _slicedToArray(_useState15, 2),
    running = _useState16[0],
    set_running = _useState16[1];
  var _useState17 = (0, _react.useState)(""),
    _useState18 = _slicedToArray(_useState17, 2),
    exports_body_value = _useState18[0],
    set_exports_body_value = _useState18[1];
  var _useState19 = (0, _react.useState)(null),
    _useState20 = _slicedToArray(_useState19, 2),
    type = _useState20[0],
    set_type = _useState20[1];
  var _useState21 = (0, _react.useState)({}),
    _useState22 = _slicedToArray(_useState21, 2),
    pipe_dict = _useState22[0],
    set_pipe_dict = _useState22[1];
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  (0, _react.useEffect)(function () {
    initSocket();
    props.setUpdate(_updateExportsList);
    _updateExportsList().then(function () {});
  }, []);
  var _useSize3 = (0, _sizing_tools.useSize)(body_ref, 0, "ExportsViewer"),
    _useSize4 = _slicedToArray(_useSize3, 4),
    usable_width = _useSize4[0],
    usable_height = _useSize4[1],
    topX = _useSize4[2],
    topY = _useSize4[3];
  function initSocket() {
    props.tsocket.attachListener("export-viewer-message", _handleExportViewerMessage);
  }
  function _handleExportViewerMessage(data) {
    if (data.main_id == props.main_id) {
      var handlerDict = {
        update_exports_popup: _updateExportsList,
        display_result: _displayResult,
        showMySpinner: _showMySpinner,
        stopMySpinner: _stopMySpinner,
        startMySpinner: _startMySpinner,
        got_export_info: _gotExportInfo
      };
      handlerDict[data.export_viewer_message](data);
    }
  }
  function _handleMaxRowsChange(new_value) {
    set_max_rows(parseInt(new_value));
    pushCallback(_eval);
  }
  function _updateExportsList() {
    return _updateExportsList2.apply(this, arguments);
  }
  function _updateExportsList2() {
    _updateExportsList2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var data;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return (0, _communication_react.postPromise)(props.main_id, "get_full_pipe_dict", {}, props.main_id);
          case 3:
            data = _context.sent;
            set_pipe_dict(data.pipe_dict);
            _context.next = 10;
            break;
          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);
            errorDrawerFuncs.addFromError("Error geting pipe didct", _context.t0);
          case 10:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[0, 7]]);
    }));
    return _updateExportsList2.apply(this, arguments);
  }
  function _refresh() {
    _handleExportListChange(selected_export_ref.current, selected_export_short_name, true);
  }
  function _displayResult(data) {
    set_exports_body_value(data.the_html);
    set_show_spinner(false);
    set_running(false);
  }
  function _eval() {
    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    _showMySpinner();
    var send_data = {
      "export_name": selected_export_ref.current,
      "tail": tail_value,
      "max_rows": max_rows_ref.current
    };
    if (key_list) {
      send_data.key = key_list_value;
    }
    (0, _communication_react.postWithCallback)(props.main_id, "evaluate_export", send_data, null, null, props.main_id);
    if (e) e.preventDefault();
  }
  function _stopMe() {
    _stopMySpinner();
    (0, _communication_react.postWithCallback)(props.main_id, "stop_evaluate_export", {}, null, null, props.main_id);
  }
  function _showMySpinner() {
    set_show_spinner(true);
  }
  function _startMySpinner() {
    set_show_spinner(true);
    set_running(true);
  }
  function _stopMySpinner() {
    set_show_spinner(false);
    set_running(false);
  }
  function _gotExportInfo(data) {
    var new_key_list = null;
    var new_key_list_value = null;
    if (data.hasOwnProperty("key_list")) {
      new_key_list = data.key_list;
      if (data.hasOwnProperty("key_list_value")) {
        new_key_list_value = data.key_list_value;
      } else {
        if (new_key_list.length > 0) {
          new_key_list_value = data.key_list[0];
        }
      }
    }
    set_type(data.type);
    set_exports_info_value(data.info_string);
    set_tail_value("");
    set_show_spinner(false);
    set_running(false);
    set_key_list(new_key_list);
    set_key_list_value(new_key_list_value);
    pushCallback(_eval);
  }
  function _handleExportListChange(fullname, shortname, tilename) {
    var force_refresh = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    if (!force_refresh && fullname == selected_export_ref.current) return;
    // set_show_spinner(true);
    set_selected_export(fullname);
    set_selected_export_tilename(tilename);
    set_selected_export_short_name(shortname);
    (0, _communication_react.postWithCallback)(props.main_id, "get_export_info", {
      "export_name": fullname
    }, null, null, props.main_id);
  }
  function _handleKeyListChange(new_value) {
    set_key_list_value(new_value);
    pushCallback(_eval);
  }
  function _handleTailChange(event) {
    set_tail_value(event.target.value);
  }
  function _sendToConsole() {
    return _sendToConsole2.apply(this, arguments);
  }
  function _sendToConsole2() {
    _sendToConsole2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      var tail, tilename, shortname, key_string, the_text;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            tail = tail_value;
            tilename = selected_export_tilename;
            shortname = selected_export_short_name;
            key_string = "";
            if (!(key_list == null)) {
              key_string = "[\"".concat(key_list_value, "\"]");
            }
            if (tilename == "__log__") {
              the_text = shortname + key_string + tail;
            } else {
              the_text = "Tiles[\"".concat(tilename, "\"][\"").concat(shortname, "\"]") + key_string + tail;
            }
            _context2.prev = 6;
            _context2.next = 9;
            return (0, _communication_react.postPromise)("host", "print_code_area_to_console", {
              "console_text": the_text,
              "user_id": window.user_id,
              "main_id": props.main_id
            }, props.main_id);
          case 9:
            _context2.next = 14;
            break;
          case 11:
            _context2.prev = 11;
            _context2.t0 = _context2["catch"](6);
            errorDrawerFuncs.addFromError("Error creating code area", _context2.t0);
          case 14:
          case "end":
            return _context2.stop();
        }
      }, _callee2, null, [[6, 11]]);
    }));
    return _sendToConsole2.apply(this, arguments);
  }
  var exports_body_dict = {
    __html: exports_body_value
  };
  var butclass = "notclose bottom-heading-element bottom-heading-element-button";
  var exports_class = props.console_is_shrunk ? "am-shrunk" : "not-shrunk";
  var spinner_val = running ? null : 0;
  if (props.console_is_zoomed) {
    exports_class = "am-zoomed";
  }
  var usable_height_style = (0, _react.useMemo)(function () {
    return {
      height: usable_height
    };
  });
  var height_minus_footing_style = (0, _react.useMemo)(function () {
    return {
      height: usable_height - FOOTING_HEIGHT
    };
  });
  return /*#__PURE__*/_react["default"].createElement(_core.Card, {
    id: "exports-panel",
    elevation: 2,
    className: "mr-3 " + exports_class,
    style: props.style
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-column justify-content-around"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    id: "exports-heading",
    ref: header_ref,
    className: "d-flex flex-row justify-content-start"
  }, !show_spinner && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _eval,
    intent: "primary",
    tooltip: "Send code to the console",
    style: {
      marginLeft: 6,
      marginTop: 2
    },
    icon: "play"
  }), show_spinner && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _stopMe,
    intent: "danger",
    tooltip: "Send code to the console",
    style: {
      marginLeft: 6,
      marginTop: 2
    },
    icon: "stop"
  }), /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _sendToConsole,
    intent: "primary",
    tooltip: "Send code to the console",
    style: {
      marginLeft: 6,
      marginTop: 2
    },
    icon: "circle-arrow-left"
  }), Object.keys(pipe_dict).length > 0 && /*#__PURE__*/_react["default"].createElement("form", {
    onSubmit: _eval,
    className: "d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement("span", {
    id: "selected-export",
    className: "bottom-heading-element mr-2"
  }, selected_export_short_name), key_list && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.SelectList, {
    option_list: key_list,
    onChange: _handleKeyListChange,
    the_value: key_list_value,
    minimal: true,
    fontSize: 11
  }), /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
    type: "text",
    small: true,
    onChange: _handleTailChange,
    onSubmit: _eval,
    value: tail_value,
    className: "export-tail"
  })), show_spinner && /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      marginTop: 7,
      marginRight: 10,
      marginLeft: 10
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.Spinner, {
    size: 13,
    value: spinner_val
  }))), !props.console_is_shrunk && /*#__PURE__*/_react["default"].createElement("div", {
    ref: body_ref,
    style: usable_height_style
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-row",
    style: height_minus_footing_style
  }, /*#__PURE__*/_react["default"].createElement(ExportButtonList, {
    pipe_dict: pipe_dict,
    value: selected_export_ref.current,
    handleChange: _handleExportListChange
  }), /*#__PURE__*/_react["default"].createElement(_core.Divider, null), /*#__PURE__*/_react["default"].createElement("div", {
    id: "exports-body",
    style: body_style,
    className: "contingent-scroll",
    dangerouslySetInnerHTML: exports_body_dict
  })), /*#__PURE__*/_react["default"].createElement("div", {
    id: "exports-footing",
    ref: footer_ref,
    className: "d-flex flex-row justify-content-between"
  }, /*#__PURE__*/_react["default"].createElement("span", {
    id: "exports-info",
    className: "bottom-heading-element ml-2"
  }, exports_info_value), /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "max rows",
    inline: true
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.SelectList, {
    option_list: [25, 100, 250, 500],
    onChange: _handleMaxRowsChange,
    the_value: max_rows_ref.current,
    minimal: true,
    fontSize: 11
  }))))));
}
exports.ExportsViewer = ExportsViewer = /*#__PURE__*/(0, _react.memo)(ExportsViewer);
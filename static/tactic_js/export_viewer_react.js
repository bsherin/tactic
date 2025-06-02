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
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return r; }; var t, r = {}, e = Object.prototype, n = e.hasOwnProperty, o = "function" == typeof Symbol ? Symbol : {}, i = o.iterator || "@@iterator", a = o.asyncIterator || "@@asyncIterator", u = o.toStringTag || "@@toStringTag"; function c(t, r, e, n) { return Object.defineProperty(t, r, { value: e, enumerable: !n, configurable: !n, writable: !n }); } try { c({}, ""); } catch (t) { c = function c(t, r, e) { return t[r] = e; }; } function h(r, e, n, o) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype); return c(a, "_invoke", function (r, e, n) { var o = 1; return function (i, a) { if (3 === o) throw Error("Generator is already running"); if (4 === o) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var u = n.delegate; if (u) { var c = d(u, n); if (c) { if (c === f) continue; return c; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (1 === o) throw o = 4, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = 3; var h = s(r, e, n); if ("normal" === h.type) { if (o = n.done ? 4 : 2, h.arg === f) continue; return { value: h.arg, done: n.done }; } "throw" === h.type && (o = 4, n.method = "throw", n.arg = h.arg); } }; }(r, n, new Context(o || [])), !0), a; } function s(t, r, e) { try { return { type: "normal", arg: t.call(r, e) }; } catch (t) { return { type: "throw", arg: t }; } } r.wrap = h; var f = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var l = {}; c(l, i, function () { return this; }); var p = Object.getPrototypeOf, y = p && p(p(x([]))); y && y !== e && n.call(y, i) && (l = y); var v = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(l); function g(t) { ["next", "throw", "return"].forEach(function (r) { c(t, r, function (t) { return this._invoke(r, t); }); }); } function AsyncIterator(t, r) { function e(o, i, a, u) { var c = s(t[o], t, i); if ("throw" !== c.type) { var h = c.arg, f = h.value; return f && "object" == _typeof(f) && n.call(f, "__await") ? r.resolve(f.__await).then(function (t) { e("next", t, a, u); }, function (t) { e("throw", t, a, u); }) : r.resolve(f).then(function (t) { h.value = t, a(h); }, function (t) { return e("throw", t, a, u); }); } u(c.arg); } var o; c(this, "_invoke", function (t, n) { function i() { return new r(function (r, o) { e(t, n, r, o); }); } return o = o ? o.then(i, i) : i(); }, !0); } function d(r, e) { var n = e.method, o = r.i[n]; if (o === t) return e.delegate = null, "throw" === n && r.i["return"] && (e.method = "return", e.arg = t, d(r, e), "throw" === e.method) || "return" !== n && (e.method = "throw", e.arg = new TypeError("The iterator does not provide a '" + n + "' method")), f; var i = s(o, r.i, e.arg); if ("throw" === i.type) return e.method = "throw", e.arg = i.arg, e.delegate = null, f; var a = i.arg; return a ? a.done ? (e[r.r] = a.value, e.next = r.n, "return" !== e.method && (e.method = "next", e.arg = t), e.delegate = null, f) : a : (e.method = "throw", e.arg = new TypeError("iterator result is not an object"), e.delegate = null, f); } function w(t) { this.tryEntries.push(t); } function m(r) { var e = r[4] || {}; e.type = "normal", e.arg = t, r[4] = e; } function Context(t) { this.tryEntries = [[-1]], t.forEach(w, this), this.reset(!0); } function x(r) { if (null != r) { var e = r[i]; if (e) return e.call(r); if ("function" == typeof r.next) return r; if (!isNaN(r.length)) { var o = -1, a = function e() { for (; ++o < r.length;) if (n.call(r, o)) return e.value = r[o], e.done = !1, e; return e.value = t, e.done = !0, e; }; return a.next = a; } } throw new TypeError(_typeof(r) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, c(v, "constructor", GeneratorFunctionPrototype), c(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = c(GeneratorFunctionPrototype, u, "GeneratorFunction"), r.isGeneratorFunction = function (t) { var r = "function" == typeof t && t.constructor; return !!r && (r === GeneratorFunction || "GeneratorFunction" === (r.displayName || r.name)); }, r.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, c(t, u, "GeneratorFunction")), t.prototype = Object.create(v), t; }, r.awrap = function (t) { return { __await: t }; }, g(AsyncIterator.prototype), c(AsyncIterator.prototype, a, function () { return this; }), r.AsyncIterator = AsyncIterator, r.async = function (t, e, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(h(t, e, n, o), i); return r.isGeneratorFunction(e) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, g(v), c(v, u, "Generator"), c(v, i, function () { return this; }), c(v, "toString", function () { return "[object Generator]"; }), r.keys = function (t) { var r = Object(t), e = []; for (var n in r) e.unshift(n); return function t() { for (; e.length;) if ((n = e.pop()) in r) return t.value = n, t.done = !1, t; return t.done = !0, t; }; }, r.values = x, Context.prototype = { constructor: Context, reset: function reset(r) { if (this.prev = this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(m), !r) for (var e in this) "t" === e.charAt(0) && n.call(this, e) && !isNaN(+e.slice(1)) && (this[e] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0][4]; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(r) { if (this.done) throw r; var e = this; function n(t) { a.type = "throw", a.arg = r, e.next = t; } for (var o = e.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i[4], u = this.prev, c = i[1], h = i[2]; if (-1 === i[0]) return n("end"), !1; if (!c && !h) throw Error("try statement without catch or finally"); if (null != i[0] && i[0] <= u) { if (u < c) return this.method = "next", this.arg = t, n(c), !0; if (u < h) return n(h), !1; } } }, abrupt: function abrupt(t, r) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var n = this.tryEntries[e]; if (n[0] > -1 && n[0] <= this.prev && this.prev < n[2]) { var o = n; break; } } o && ("break" === t || "continue" === t) && o[0] <= r && r <= o[2] && (o = null); var i = o ? o[4] : {}; return i.type = t, i.arg = r, o ? (this.method = "next", this.next = o[2], f) : this.complete(i); }, complete: function complete(t, r) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && r && (this.next = r), f; }, finish: function finish(t) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var e = this.tryEntries[r]; if (e[2] === t) return this.complete(e[4], e[3]), m(e), f; } }, "catch": function _catch(t) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var e = this.tryEntries[r]; if (e[0] === t) { var n = e[4]; if ("throw" === n.type) { var o = n.arg; m(e); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(r, e, n) { return this.delegate = { i: x(r), r: e, n: n }, "next" === this.method && (this.arg = t), f; } }, r; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
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
          group_items.push(/*#__PURE__*/_react["default"].createElement(ExportButtonListButton, {
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
        groups.unshift(/*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
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
        groups.push(/*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
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
    _useState0 = _slicedToArray(_useState9, 2),
    exports_info_value = _useState0[0],
    set_exports_info_value = _useState0[1];
  var _useState1 = (0, _react.useState)(null),
    _useState10 = _slicedToArray(_useState1, 2),
    selected_export_short_name = _useState10[0],
    set_selected_export_short_name = _useState10[1];
  var _useState11 = (0, _react.useState)(false),
    _useState12 = _slicedToArray(_useState11, 2),
    show_spinner = _useState12[0],
    set_show_spinner = _useState12[1];
  var _useState13 = (0, _react.useState)(false),
    _useState14 = _slicedToArray(_useState13, 2),
    running = _useState14[0],
    set_running = _useState14[1];
  var _useState15 = (0, _react.useState)(""),
    _useState16 = _slicedToArray(_useState15, 2),
    exports_body_value = _useState16[0],
    set_exports_body_value = _useState16[1];
  var _useState17 = (0, _react.useState)(null),
    _useState18 = _slicedToArray(_useState17, 2),
    type = _useState18[0],
    set_type = _useState18[1];
  var _useState19 = (0, _react.useState)({}),
    _useState20 = _slicedToArray(_useState19, 2),
    pipe_dict = _useState20[0],
    set_pipe_dict = _useState20[1];
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
    _updateExportsList2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
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
    _sendToConsole2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
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
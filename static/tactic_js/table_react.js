"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FreeformBody = FreeformBody;
exports.MainTableCard = MainTableCard;
exports.MainTableCardHeader = MainTableCardHeader;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
var _blueprint_react_widgets = require("./blueprint_react_widgets");
var _reactCodemirror = require("./react-codemirror6");
var _blueprint_mdata_fields = require("./blueprint_mdata_fields");
var _communication_react = require("./communication_react");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
function FreeformBody(props) {
  var top_ref = (0, _react.useRef)(null);
  var cmobject = (0, _react.useRef)(null);
  var overlay = (0, _react.useRef)(null);
  function _setCMObject(lcmobject) {
    cmobject.current = lcmobject;
  }
  function _clearSearch() {
    if (cmobject.current && overlay.current) {
      cmobject.current.removeOverlay(overlay.current);
      overlay.current = null;
    }
  }
  function _doSearch() {
    if (props.mState.alt_search_text && props.mState.alt_search_text != "" && cmobject.current) {
      overlay.current = mySearchOverlay(props.mState.alt_search_text, true);
      cmobject.current.addOverlay(overlay.current);
    } else if (props.mState.search_text && props.mState.search_text != "" && cmobject) {
      overlay.current = mySearchOverlay(props.mState.search_text, true);
      cmobject.current.addOverlay(overlay.current);
    }
  }
  function mySearchOverlay(query, caseInsensitive) {
    if (typeof query == "string") {
      // noinspection RegExpRedundantEscape
      query = new RegExp(query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), caseInsensitive ? "gi" : "g");
    } else if (!query.global) query = new RegExp(query.source, query.ignoreCase ? "gi" : "g");
    return {
      token: function token(stream) {
        query.lastIndex = stream.pos;
        var match = query.exec(stream.string);
        if (match && match.index == stream.pos) {
          stream.pos += match[0].length || 1;
          return "searching"; // I believe this causes the style .cm-searching to be applied
        } else if (match) {
          stream.pos = match.index;
        } else {
          stream.skipToEnd();
        }
      }
    };
  }
  function _handleBlur(new_data_text) {
    (0, _communication_react.postWithCallback)(props.main_id, "add_freeform_document", {
      document_name: props.mState.table_spec.current_doc_name,
      doc_text: new_data_text
    }, null);
  }
  function _handleChange(new_data_text) {}
  _clearSearch();
  _doSearch();
  return /*#__PURE__*/_react["default"].createElement("div", {
    ref: top_ref
  }, /*#__PURE__*/_react["default"].createElement(_reactCodemirror.ReactCodemirror6, {
    handleChange: null,
    handleBlur: _handleBlur,
    code_content: props.mState.data_text,
    sync_to_prop: true,
    soft_wrap: props.mState.soft_wrap,
    mode: "text",
    controlled: true,
    setCMObject: _setCMObject,
    readOnly: !props.mState.spreadsheet_mode
  }));
}
exports.FreeformBody = FreeformBody = /*#__PURE__*/(0, _react.memo)(FreeformBody);
function SmallSpinner() {
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex"
  }, /*#__PURE__*/_react["default"].createElement("span", {
    className: " loader-small"
  }));
}
function MainTableCardHeader(props) {
  props = _objectSpread({
    is_freeform: false,
    soft_wrap: false,
    handleSoftWrapChange: null
  }, props);
  var heading_left_ref = (0, _react.useRef)(null);
  var heading_right_ref = (0, _react.useRef)(null);
  var _useState = (0, _react.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    hide_right_element = _useState2[0],
    set_hide_right_element = _useState2[1];
  (0, _react.useEffect)(function () {
    var hide_right = _getHideRight();
    if (hide_right != hide_right_element) {
      set_hide_right_element(hide_right);
    }
  });
  function _getHideRight() {
    var le_rect = heading_left_ref.current.getBoundingClientRect();
    var re_rect = heading_right_ref.current.getBoundingClientRect();
    return re_rect.x < le_rect.x + le_rect.width + 10;
  }
  function _handleSearchFieldChange(event) {
    props.handleSearchFieldChange(event.target.value);
  }
  function _handleFilter() {
    return _handleFilter2.apply(this, arguments);
  }
  function _handleFilter2() {
    _handleFilter2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var data_dict;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            data_dict = {
              "text_to_find": props.mState.search_text
            };
            _context.prev = 1;
            _context.next = 4;
            return (0, _communication_react.postPromise)(props.main_id, "UnfilterTable", data_dict);
          case 4:
            if (!(props.search_text !== "")) {
              _context.next = 8;
              break;
            }
            _context.next = 7;
            return (0, _communication_react.postPromise)(props.main_id, "FilterTable", data_dict);
          case 7:
            props.setMainStateValue({
              "table_is_filtered": true,
              "selected_regions": null,
              "selected_row": null
            });
          case 8:
            _context.next = 13;
            break;
          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](1);
            errorDrawerFuncs.addFromError("Error filtering table", _context.t0);
          case 13:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[1, 10]]);
    }));
    return _handleFilter2.apply(this, arguments);
  }
  function _handleUnFilter() {
    return _handleUnFilter2.apply(this, arguments);
  }
  function _handleUnFilter2() {
    _handleUnFilter2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            props.handleSearchFieldChange(null);
            _context2.prev = 1;
            if (!props.mState.table_is_filtered) {
              _context2.next = 6;
              break;
            }
            _context2.next = 5;
            return (0, _communication_react.postPromise)(props.main_id, "UnfilterTable", {
              selected_row: props.mState.selected_row
            });
          case 5:
            props.setMainStateValue({
              "table_is_filtered": false,
              "selected_regions": null,
              "selected_row": null
            });
          case 6:
            _context2.next = 12;
            break;
          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2["catch"](1);
            errorDrawerFuncs.addFromError("Error unfiltering table", _context2.t0);
            return _context2.abrupt("return");
          case 12:
          case "end":
            return _context2.stop();
        }
      }, _callee2, null, [[1, 8]]);
    }));
    return _handleUnFilter2.apply(this, arguments);
  }
  function _handleSubmit(e) {
    e.preventDefault();
  }
  function _onChangeDoc(value) {
    props.handleChangeDoc(value);
  }
  var heading_right_opacity = hide_right_element ? 0 : 100;
  var select_style = {
    height: 30,
    maxWidth: 250
  };
  var doc_button_text = /*#__PURE__*/_react["default"].createElement(_core.Text, {
    ellipsize: true
  }, props.mState.table_spec.current_doc_name);
  var self = this;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex pl-2 pr-2 justify-content-between align-baseline main-heading",
    style: {
      height: 50
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    id: "heading-left",
    ref: heading_left_ref,
    className: "d-flex flex-column justify-content-around"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: props.toggleShrink,
    icon: "minimize"
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-column justify-content-around"
  }, /*#__PURE__*/_react["default"].createElement("form", {
    className: "d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: props.mState.short_collection_name,
    inline: true,
    style: {
      marginBottom: 0,
      marginLeft: 5,
      marginRight: 10
    }
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_mdata_fields.BpSelect, {
    options: props.mState.doc_names,
    onChange: _onChangeDoc,
    buttonStyle: select_style,
    buttonTextObject: doc_button_text,
    value: props.mState.table_spec.current_doc_name
  })), props.mState.show_table_spinner && /*#__PURE__*/_react["default"].createElement(_core.Spinner, {
    size: 15
  }))))), /*#__PURE__*/_react["default"].createElement("div", {
    id: "heading-right",
    ref: heading_right_ref,
    style: {
      opacity: heading_right_opacity
    },
    className: "d-flex flex-column justify-content-around"
  }, /*#__PURE__*/_react["default"].createElement("form", {
    onSubmit: _handleSubmit,
    style: {
      alignItems: "center"
    },
    className: "d-flex flex-row"
  }, props.is_freeform && /*#__PURE__*/_react["default"].createElement(_core.Switch, {
    label: "soft wrap",
    className: "mr-2 mb-0",
    large: false,
    checked: props.mState.soft_wrap,
    onChange: props.handleSoftWrapChange
  }), /*#__PURE__*/_react["default"].createElement(_core.Switch, {
    label: "edit",
    className: "mr-4 mb-0",
    large: false,
    checked: props.mState.spreadsheet_mode,
    onChange: props.handleSpreadsheetModeChange
  }), /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
    type: "search",
    leftIcon: "search",
    placeholder: "Search",
    value: !props.mState.search_text ? "" : props.mState.search_text,
    onChange: _handleSearchFieldChange,
    autoCapitalize: "none",
    autoCorrect: "off",
    className: "mr-2"
  }), /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, null, props.show_filter_button && /*#__PURE__*/_react["default"].createElement(_core.Button, {
    onClick: _handleFilter
  }, "Filter"), /*#__PURE__*/_react["default"].createElement(_core.Button, {
    onClick: _handleUnFilter
  }, "Clear")))));
}
exports.MainTableCardHeader = MainTableCardHeader = /*#__PURE__*/(0, _react.memo)(MainTableCardHeader);
var MAX_INITIAL_CELL_WIDTH = 400;
var EXTRA_TABLE_AREA_SPACE = 500;
function MainTableCard(props) {
  return /*#__PURE__*/_react["default"].createElement(_core.Card, {
    id: "main-panel",
    elevation: 2
  }, props.card_header, /*#__PURE__*/_react["default"].createElement("div", {
    id: "table-wrapper"
  }, props.card_body));
}
MainTableCard.propTypes = {
  card_body: _propTypes["default"].object,
  card_header: _propTypes["default"].object
};
exports.MainTableCard = MainTableCard = /*#__PURE__*/(0, _react.memo)(MainTableCard);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BpSelect = BpSelect;
exports.BpSelectAdvanced = BpSelectAdvanced;
exports.CombinedMetadata = CombinedMetadata;
exports.NotesField = NotesField;
exports.icon_dict = void 0;
require("../tactic_css/tactic_select.scss");
var _react = _interopRequireWildcard(require("react"));
var _core = require("@blueprintjs/core");
var _select = require("@blueprintjs/select");
var _settings = require("./settings");
var _core2 = _interopRequireDefault(require("highlight.js/lib/core"));
var _javascript = _interopRequireDefault(require("highlight.js/lib/languages/javascript"));
var _python = _interopRequireDefault(require("highlight.js/lib/languages/python"));
var _markdownIt = _interopRequireDefault(require("markdown-it"));
require("markdown-it-latex/dist/index.css");
var _markdownItLatex = _interopRequireDefault(require("markdown-it-latex"));
var _lodash = _interopRequireDefault(require("lodash"));
var _utilities_react = require("./utilities_react");
var _icon_info = require("./icon_info");
var _sizing_tools = require("./sizing_tools");
var _error_boundary = require("./error_boundary");
var _communication_react = require("./communication_react");
var _reactCodemirror = require("./react-codemirror6");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
_core2["default"].registerLanguage('javascript', _javascript["default"]);
_core2["default"].registerLanguage('python', _python["default"]);
var mdi = (0, _markdownIt["default"])({
  html: true,
  highlight: function highlight(str, lang) {
    if (lang && _core2["default"].getLanguage(lang)) {
      try {
        return '<pre><code class="hljs">' + _core2["default"].highlight(str, {
          language: lang,
          ignoreIllegals: true
        }).value + '</code></pre>';
      } catch (__) {}
    }
    return '<pre><code class="hljs">' + mdi.utils.escapeHtml(str) + '</code></pre>';
  }
});
mdi.use(_markdownItLatex["default"]);
var icon_dict = exports.icon_dict = {
  all: "cube",
  collection: "database",
  project: "projects",
  tile: "application",
  list: "list",
  code: "code",
  pool: "folder-close",
  poolDir: "folder-close",
  poolFile: "document"
};
function SuggestionItemAdvanced(_ref) {
  var item = _ref.item,
    handleClick = _ref.handleClick,
    modifiers = _ref.modifiers;
  var display_text = "display_text" in item ? item.display_text : item.text;
  var the_icon = "icon" in item ? item.icon : null;
  if (item.isgroup) {
    return /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, {
      className: "tile-form-menu-item",
      title: display_text
    });
  } else {
    return /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      className: "tile-form-menu-item",
      text: display_text,
      key: display_text,
      icon: the_icon,
      onClick: handleClick,
      active: modifiers.active,
      shouldDismissPopover: true
    });
  }
}
SuggestionItemAdvanced = /*#__PURE__*/(0, _react.memo)(SuggestionItemAdvanced);
function renderSuggestionAdvanced(item, _ref2) {
  var modifiers = _ref2.modifiers,
    handleClick = _ref2.handleClick,
    index = _ref2.index;
  return /*#__PURE__*/_react["default"].createElement(SuggestionItemAdvanced, {
    item: item,
    key: index,
    modifiers: modifiers,
    handleClick: handleClick
  });
}
function BpSelectAdvanced(_ref3) {
  var options = _ref3.options,
    value = _ref3.value,
    onChange = _ref3.onChange,
    _ref3$buttonIcon = _ref3.buttonIcon,
    buttonIcon = _ref3$buttonIcon === void 0 ? null : _ref3$buttonIcon,
    readOnly = _ref3.readOnly;
  function _filterSuggestion(query, item) {
    if (query.length === 0) {
      return true;
    }
    var re = new RegExp(query.toLowerCase());
    var the_text;
    if (_typeof(item) == "object") {
      the_text = item["text"];
    } else {
      the_text = item;
    }
    return re.test(the_text.toLowerCase());
  }
  function _getActiveItem(val) {
    var _iterator = _createForOfIteratorHelper(options),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var option = _step.value;
        if (_lodash["default"].isEqual(option, val)) {
          return option;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return null;
  }
  var display_text = "display_text" in value ? value.display_text : value.text;
  return /*#__PURE__*/_react["default"].createElement(_error_boundary.ErrorBoundary, null, /*#__PURE__*/_react["default"].createElement(_select.Select, {
    activeItem: _getActiveItem(value),
    itemRenderer: renderSuggestionAdvanced,
    itemPredicate: _filterSuggestion,
    items: options,
    disabled: readOnly,
    onItemSelect: onChange,
    popoverProps: {
      minimal: true,
      boundary: "window",
      modifiers: {
        flip: false,
        preventOverflow: true
      },
      position: _core.PopoverPosition.BOTTOM_LEFT
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
    text: display_text,
    className: "button-in-select",
    icon: buttonIcon
  })));
}
exports.BpSelectAdvanced = BpSelectAdvanced = /*#__PURE__*/(0, _react.memo)(BpSelectAdvanced);
function BpSelect(props) {
  props = _objectSpread({
    buttonIcon: null,
    buttonStyle: {},
    popoverPosition: _core.PopoverPosition.BOTTOM_LEFT,
    buttonTextObject: null,
    filterable: true,
    small: undefined
  }, props);
  function _filterSuggestion(query, item) {
    if (query.length === 0 || item["isgroup"]) {
      return true;
    }
    var re = new RegExp(query.toLowerCase());
    var the_text;
    if (_typeof(item) == "object") {
      the_text = item["text"];
    } else {
      the_text = item;
    }
    return re.test(the_text.toLowerCase());
  }
  function _getActiveItem(val) {
    var _iterator2 = _createForOfIteratorHelper(props.options),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var option = _step2.value;
        if (_lodash["default"].isEqual(option, val)) {
          return option;
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    return null;
  }
  return /*#__PURE__*/_react["default"].createElement(_select.Select, {
    activeItem: _getActiveItem(props.value),
    className: "tile-form-menu-item",
    filterable: props.filterable,
    itemRenderer: renderSuggestion,
    itemPredicate: _filterSuggestion,
    items: _lodash["default"].cloneDeep(props.options),
    onItemSelect: props.onChange,
    popoverProps: {
      minimal: true,
      boundary: "window",
      modifiers: {
        flip: false,
        preventOverflow: true
      },
      position: props.popoverPosition
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
    className: "button-in-select",
    style: props.buttonStyle,
    small: props.small,
    text: props.buttonTextObject ? props.buttonTextObject : props.value,
    icon: props.buttonIcon
  }));
}
exports.BpSelect = BpSelect = /*#__PURE__*/(0, _react.memo)(BpSelect, function (prevProps, newProps) {
  (0, _utilities_react.propsAreEqual)(newProps, prevProps, ["buttonTextObject"]);
});
function SuggestionItem(_ref4) {
  var item = _ref4.item,
    modifiers = _ref4.modifiers,
    handleClick = _ref4.handleClick;
  var the_text;
  var the_icon;
  if (_typeof(item) == "object") {
    the_text = item["text"];
    the_icon = item["icon"];
  } else {
    the_text = item;
    the_icon = null;
  }
  return /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
    className: "tile-form-menu-item",
    text: the_text,
    icon: the_icon,
    active: modifiers.active,
    onClick: function onClick() {
      return handleClick(the_text);
    },
    shouldDismissPopover: true
  });
}
SuggestionItem = /*#__PURE__*/(0, _react.memo)(SuggestionItem);
function renderSuggestion(item, _ref5) {
  var modifiers = _ref5.modifiers,
    handleClick = _ref5.handleClick,
    index = _ref5.index;
  return /*#__PURE__*/_react["default"].createElement(SuggestionItem, {
    item: item,
    key: index,
    modifiers: modifiers,
    handleClick: handleClick
  });
}
var renderCreateNewTag = function renderCreateNewTag(query, active, handleClick) {
  var hclick = handleClick;
  return /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
    icon: "add",
    key: "create_item",
    text: "Create \"".concat(query, "\""),
    active: active,
    onClick: handleClick,
    shouldDismissPopover: false
  });
};
function NativeTags(props) {
  var _useState = (0, _react.useState)(""),
    _useState2 = _slicedToArray(_useState, 2),
    query = _useState2[0],
    setQuery = _useState2[1];
  function renderTag(item) {
    return item;
  }
  function _createItemFromQuery(name) {
    return name;
  }
  function _handleDelete(tag, i) {
    var new_tlist = _toConsumableArray(props.tags);
    new_tlist.splice(i, 1);
    props.handleChange(new_tlist);
  }
  function _handleAddition(tag) {
    var new_tlist = _toConsumableArray(props.tags);
    new_tlist.push(tag);
    props.handleChange(new_tlist);
  }
  function _filterSuggestion(query, item) {
    if (query.length === 0) {
      return false;
    }
    var re = new RegExp("^".concat(query));
    return re.test(item);
  }
  if (props.readOnly) {
    return /*#__PURE__*/_react["default"].createElement(_core.TagInput, {
      values: props.tags,
      disabled: true
    });
  }
  return /*#__PURE__*/_react["default"].createElement(_select.MultiSelect, {
    allowCreate: true,
    openOnKeyDown: true,
    createNewItemFromQuery: _createItemFromQuery,
    createNewItemRenderer: renderCreateNewTag,
    resetOnSelect: true,
    itemRenderer: renderSuggestion,
    selectedItems: props.tags,
    allowNew: true,
    items: props.all_tags,
    itemPredicate: _filterSuggestion,
    tagRenderer: renderTag,
    tagInputProps: {
      onRemove: _handleDelete
    },
    onItemSelect: _handleAddition
  });
}
NativeTags = /*#__PURE__*/(0, _react.memo)(NativeTags);
function NotesField(props) {
  props = _objectSpread({
    handleBlur: null
  }, props);
  var setFocusFunc = (0, _react.useRef)(null);
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  (0, _react.useEffect)(function () {
    if (props.notesRef.current.length == 0) {
      console.log("got notes of zero length");
    } else {
      console.log("Got new notes " + props.notesRef.current.slice(0, 100));
    }
  }, [props.notesRef.current]);
  (0, _react.useEffect)(function () {
    // console.log("theme changed")  // This is to force re-rendering because of highlight.js theme change
  }, [settingsContext.settings.theme]);
  var _useState3 = (0, _react.useState)(500),
    _useState4 = _slicedToArray(_useState3, 2),
    mdHeight = _useState4[0],
    setMdHeight = _useState4[1];
  var _useState5 = (0, _react.useState)(hasOnlyWhitespace() ? false : props.show_markdown_initial),
    _useState6 = _slicedToArray(_useState5, 2),
    showMarkdown = _useState6[0],
    setShowMarkdown = _useState6[1];
  var awaitingFocus = (0, _react.useRef)(false);
  var cmObject = (0, _react.useRef)(null);
  var mdRef = (0, _react.useRef)(null);
  //var notesRef = useRef(null);

  (0, _react.useEffect)(function () {
    if (awaitingFocus.current) {
      focusNotes();
      awaitingFocus.current = false;
    }
    if (cmObject.current && !cmObject.current.hasFocus) {
      setShowMarkdown(!hasOnlyWhitespace());
    }
    //else if (hasOnlyWhitespace()) {
    //     if (showMarkdown) {
    //         // If we are here, then we are reusing a notes field that previously showed markdown
    //         // and now is empty. We want to prevent markdown being shown when a character is typed.
    //         setShowMarkdown(false)
    //     }
    // } //else if (!showMarkdown && (notesRef.current !== document.activeElement)) {
    //     // If we are here it means the change was initiated externally
    //     _showMarkdown()
    // }
  });
  (0, _react.useEffect)(function () {
    setShowMarkdown(!hasOnlyWhitespace());
  }, [props.res_name, props.res_type]);

  // function getNotesField() {
  //     return notesRef.current
  // }

  function hasOnlyWhitespace() {
    return !props.notesRef.current || !props.notesRef.current.trim().length;
  }
  function getMarkdownField() {
    return mdRef.current;
  }
  function focusNotes() {
    setFocusFunc.current();
  }
  function _hideMarkdown() {
    if (props.readOnly) return;
    awaitingFocus.current = true; // We can't set focus until the input is visible
    setShowMarkdown(false);
  }
  function _handleMyBlur() {
    _showMarkdown();
    if (props.handleBlur != null) {
      props.handleBlur();
    }
  }
  function _showMarkdown() {
    if (!hasOnlyWhitespace()) {
      setShowMarkdown(true);
    }
  }
  function _setCmObject(cmobject) {
    cmObject.current = cmobject;
  }
  var registerSetFocusFunc = (0, _react.useCallback)(function (theFunc) {
    setFocusFunc.current = theFunc;
  }, []);
  var really_show_markdown = hasOnlyWhitespace() ? false : showMarkdown;
  var notes_style = {
    display: really_show_markdown ? "none" : "block",
    fontSize: 13,
    resize: "both"
  };
  var md_style = {
    display: really_show_markdown ? "block" : "none",
    maxHeight: mdHeight,
    fontSize: 13
  };
  var converted_markdown;
  if (really_show_markdown) {
    converted_markdown = mdi.render(props.notesRef.current);
  }
  var converted_dict = {
    __html: converted_markdown
  };
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, !really_show_markdown && /*#__PURE__*/_react["default"].createElement(_reactCodemirror.ReactCodemirror6, {
    handleChange: props.handleChange,
    readOnly: props.readOnly,
    setCMObject: _setCmObject
    //handleFocus={_handleFocus}
    ,
    handleBlur: _handleMyBlur,
    registerSetFocusFunc: registerSetFocusFunc,
    show_line_numbers: false,
    soft_wrap: true,
    controlled: true,
    mode: "markdown",
    code_content: props.notesRef.current,
    no_height: true,
    saveMe: null
  }), /*#__PURE__*/_react["default"].createElement("div", {
    ref: mdRef,
    style: md_style,
    onClick: _hideMarkdown,
    className: "notes-field-markdown-output markdown-heading-sizes",
    dangerouslySetInnerHTML: converted_dict
  }));
}
exports.NotesField = NotesField = /*#__PURE__*/(0, _react.memo)(NotesField);
var icon_list = ["application", "code", "timeline-line-chart", "heatmap", "graph", "heat-grid", "chart", "pie-chart", "regression-chart", "grid", "numerical", "font", "array", "array-numeric", "array-string", "data-lineage", "function", "variable", "build", "group-objects", "ungroup-objects", "inner-join", "filter", "sort-asc", "sort-alphabetical", "sort-numerical", "random", "layout", "layout-auto", "layout-balloon", "changes", "comparison", "exchange", "derive_column", "list-columns", "delta", "edit", "fork", "numbered-list", "path-search", "search", "plus", "repeat", "reset", "resolve", "widget-button", "star", "time", "settings", "properties", "cog", "key-command", "ip-address", "download", "cloud", "globe", "tag", "label", "history", "predictive-analysis", "calculator", "pulse", "warning-sign", "cube", "wrench"];
var icon_dlist = [];
var icon_entry_dict = {};
var cat_order = ['data', 'action', 'table', 'interface', 'editor', 'file', 'media', 'miscellaneous'];
for (var _i = 0, _cat_order = cat_order; _i < _cat_order.length; _i++) {
  var category = _cat_order[_i];
  var cat_entry = {
    text: category,
    display_text: category,
    isgroup: true
  };
  icon_dlist.push(cat_entry);
  var _iterator3 = _createForOfIteratorHelper(_icon_info.tile_icon_dict[category]),
    _step3;
  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var entry = _step3.value;
      var new_entry = {
        text: entry.tags + ", " + category + ", " + entry.iconName,
        val: entry.iconName,
        icon: entry.iconName,
        display_text: entry.displayName,
        isgroup: false
      };
      cat_entry.text = cat_entry.text + ", " + entry.tags + ", " + entry.iconName;
      icon_dlist.push(new_entry);
      icon_entry_dict[new_entry.val] = new_entry;
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
}
function IconSelector(_ref6) {
  var handleSelectChange = _ref6.handleSelectChange,
    icon_val = _ref6.icon_val,
    readOnly = _ref6.readOnly;
  var value = icon_entry_dict[icon_val] ? icon_entry_dict[icon_val] : icon_entry_dict["application"];
  return /*#__PURE__*/_react["default"].createElement(_error_boundary.ErrorBoundary, null, /*#__PURE__*/_react["default"].createElement(BpSelectAdvanced, {
    options: icon_dlist,
    onChange: function onChange(item) {
      handleSelectChange(item.val);
    },
    readOnly: readOnly,
    buttonIcon: icon_val,
    value: value
  }));
}
IconSelector = /*#__PURE__*/(0, _react.memo)(IconSelector);
var primary_mdata_fields = ["name", "created", "updated", "tags", "notes"];
var ignore_fields = ["doc_type", "res_type"];
function CombinedMetadata(props) {
  props = _objectSpread({
    expandWidth: true,
    tabSelectCounter: 0,
    useTags: true,
    useNotes: true,
    outer_style: {
      overflow: "auto",
      padding: 15
    },
    elevation: 0,
    handleNotesBlur: null,
    category: null,
    icon: null,
    res_name: null,
    updated: null,
    additional_metadata: null,
    notes_buttons: null,
    res_type: null,
    is_repository: false,
    useFixedData: false,
    tsocket: null
  }, props);
  var top_ref = (0, _react.useRef)();
  var _useState7 = (0, _react.useState)([]),
    _useState8 = _slicedToArray(_useState7, 2),
    allTags = _useState8[0],
    setAllTags = _useState8[1];
  var _useState9 = (0, _react.useState)(null),
    _useState10 = _slicedToArray(_useState9, 2),
    tags = _useState10[0],
    setTags = _useState10[1];
  var _useState11 = (0, _react.useState)(null),
    _useState12 = _slicedToArray(_useState11, 2),
    created = _useState12[0],
    setCreated = _useState12[1];
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)(null),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    updated = _useStateAndRef2[0],
    setUpdated = _useStateAndRef2[1],
    updatedRef = _useStateAndRef2[2];
  var _useStateAndRef3 = (0, _utilities_react.useStateAndRef)(null),
    _useStateAndRef4 = _slicedToArray(_useStateAndRef3, 3),
    notes = _useStateAndRef4[0],
    setNotes = _useStateAndRef4[1],
    notesRef = _useStateAndRef4[2];
  var _useState13 = (0, _react.useState)(null),
    _useState14 = _slicedToArray(_useState13, 2),
    icon = _useState14[0],
    setIcon = _useState14[1];
  var _useState15 = (0, _react.useState)(null),
    _useState16 = _slicedToArray(_useState15, 2),
    category = _useState16[0],
    setCategory = _useState16[1];
  var _useState17 = (0, _react.useState)(null),
    _useState18 = _slicedToArray(_useState17, 2),
    additionalMdata = _useState18[0],
    setAdditionalMdata = _useState18[1];
  var _useStateAndRef5 = (0, _utilities_react.useStateAndRef)(null),
    _useStateAndRef6 = _slicedToArray(_useStateAndRef5, 3),
    tempNotes = _useStateAndRef6[0],
    setTempNotes = _useStateAndRef6[1],
    tempNotesRef = _useStateAndRef6[2];
  var updatedIdRef = (0, _react.useRef)(null);
  var _useDebounce = (0, _utilities_react.useDebounce)(function (state_stuff) {
      postChanges(state_stuff).then(function () {});
    }),
    _useDebounce2 = _slicedToArray(_useDebounce, 2),
    waiting = _useDebounce2[0],
    doUpdate = _useDebounce2[1];
  var _useSize = (0, _sizing_tools.useSize)(top_ref, props.tabSelectCounter, "CombinedMetadata"),
    _useSize2 = _slicedToArray(_useSize, 4),
    usable_width = _useSize2[0],
    usable_height = _useSize2[1],
    topX = _useSize2[2],
    topY = _useSize2[3];
  (0, _react.useEffect)(function () {
    if (props.tsocket != null && !props.is_repository && !props.useFixedData) {
      var handleExternalUpdate = function handleExternalUpdate(data) {
        if (data.res_type == props.res_type && data.res_name == props.res_name && data.mdata_uid != updatedIdRef.current) {
          grabMetadata();
        }
      };
      props.tsocket.attachListener("resource-updated", handleExternalUpdate);
      return function () {
        props.tsocket.detachListener("resource-updated");
      };
    }
  }, [props.tsocket, props.res_name, props.res_type]);
  (0, _react.useEffect)(function () {
    grabMetadata();
  }, [props.res_name, props.res_type]);
  function grabMetadata() {
    if (props.useFixedData || props.res_name == null || props.res_type == null) return;
    if (!props.readOnly) {
      var data_dict = {
        pane_type: props.res_type,
        is_repository: false,
        show_hidden: true
      };
      (0, _communication_react.postAjaxPromise)("get_tag_list", data_dict).then(function (data) {
        setAllTags(data.tag_list);
      });
    }
    console.log("grabbing metadata for ".concat(props.res_type, " ").concat(props.res_name));
    (0, _communication_react.postAjaxPromise)("grab_metadata", {
      res_type: props.res_type,
      res_name: props.res_name,
      is_repository: props.is_repository
    }).then(function (data) {
      setTags(data.tags);
      console.log("length of data.notes is " + data.notes.length);
      setNotes(data.notes);
      setCreated(data.datestring);
      setUpdated(data.additional_mdata.updated);
      updatedIdRef.current = data.additional_mdata.mdata_uid;
      setIcon(data.additional_mdata.icon ? data.additional_mdata.icon : null);
      setCategory(data.additional_mdata.category ? data.additional_mdata.category : null);
      var amdata = data.additional_mdata;
      delete amdata.updated;
      setAdditionalMdata(amdata);
    })["catch"](function (e) {
      console.log("error getting metadata", e);
    });
  }
  function postChanges(_x) {
    return _postChanges.apply(this, arguments);
  }
  function _postChanges() {
    _postChanges = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(state_stuff) {
      var result_dict;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            result_dict = {
              "res_type": props.res_type,
              "res_name": props.res_name,
              "tags": "tags" in state_stuff ? state_stuff["tags"].join(" ") : tags,
              "notes": "notes" in state_stuff ? state_stuff["notes"] : notes,
              "icon": "icon" in state_stuff ? state_stuff["icon"] : icon,
              "category": "category" in state_stuff ? state_stuff["category"] : category,
              "mdata_uid": (0, _utilities_react.guid)()
            };
            if ("notes" in state_stuff) {
              console.log("notes is in state_stuff");
            }
            console.log("postingChanges ".concat(props.res_type, " ").concat(props.res_name, " with notes ").concat(result_dict["notes"]));
            _context.prev = 3;
            _context.next = 6;
            return (0, _communication_react.postAjaxPromise)("save_metadata", result_dict);
          case 6:
            updatedIdRef.current = result_dict["mdata_uid"];
            _context.next = 12;
            break;
          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](3);
            console.log("error saving metadata ", _context.t0);
          case 12:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[3, 9]]);
    }));
    return _postChanges.apply(this, arguments);
  }
  function _handleMetadataChange(_x2) {
    return _handleMetadataChange2.apply(this, arguments);
  }
  function _handleMetadataChange2() {
    _handleMetadataChange2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(state_stuff) {
      var post_immediate,
        _field2,
        _args2 = arguments;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            post_immediate = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : true;
            _context2.t0 = _regeneratorRuntime().keys(state_stuff);
          case 2:
            if ((_context2.t1 = _context2.t0()).done) {
              _context2.next = 17;
              break;
            }
            _field2 = _context2.t1.value;
            _context2.t2 = _field2;
            _context2.next = _context2.t2 === "tags" ? 7 : _context2.t2 === "notes" ? 9 : _context2.t2 === "icon" ? 11 : _context2.t2 === "category" ? 13 : 15;
            break;
          case 7:
            setTags(state_stuff[_field2].join(" "));
            return _context2.abrupt("break", 15);
          case 9:
            setNotes(state_stuff[_field2]);
            return _context2.abrupt("break", 15);
          case 11:
            setIcon(state_stuff[_field2]);
            return _context2.abrupt("break", 15);
          case 13:
            setCategory(state_stuff[_field2]);
            return _context2.abrupt("break", 15);
          case 15:
            _context2.next = 2;
            break;
          case 17:
            if (!post_immediate) {
              _context2.next = 22;
              break;
            }
            _context2.next = 20;
            return postChanges(state_stuff);
          case 20:
            _context2.next = 23;
            break;
          case 22:
            doUpdate(state_stuff);
          case 23:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return _handleMetadataChange2.apply(this, arguments);
  }
  function _handleNotesChange(_x3) {
    return _handleNotesChange2.apply(this, arguments);
  }
  function _handleNotesChange2() {
    _handleNotesChange2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(new_text) {
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _handleMetadataChange({
              "notes": new_text
            }, true);
          case 2:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
    return _handleNotesChange2.apply(this, arguments);
  }
  function _handleTagsChange(_x4) {
    return _handleTagsChange2.apply(this, arguments);
  }
  function _handleTagsChange2() {
    _handleTagsChange2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(tags) {
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _handleMetadataChange({
              "tags": tags
            });
          case 2:
          case "end":
            return _context4.stop();
        }
      }, _callee4);
    }));
    return _handleTagsChange2.apply(this, arguments);
  }
  function _handleTagsChangeNative(_x5) {
    return _handleTagsChangeNative2.apply(this, arguments);
  }
  function _handleTagsChangeNative2() {
    _handleTagsChangeNative2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(tags) {
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return _handleMetadataChange({
              "tags": tags
            });
          case 2:
          case "end":
            return _context5.stop();
        }
      }, _callee5);
    }));
    return _handleTagsChangeNative2.apply(this, arguments);
  }
  function _handleCategoryChange(_x6) {
    return _handleCategoryChange2.apply(this, arguments);
  }
  function _handleCategoryChange2() {
    _handleCategoryChange2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(event) {
      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return _handleMetadataChange({
              "category": event.target.value
            });
          case 2:
          case "end":
            return _context6.stop();
        }
      }, _callee6);
    }));
    return _handleCategoryChange2.apply(this, arguments);
  }
  function _handleIconChange(_x7) {
    return _handleIconChange2.apply(this, arguments);
  }
  function _handleIconChange2() {
    _handleIconChange2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(icon) {
      return _regeneratorRuntime().wrap(function _callee7$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return _handleMetadataChange({
              "icon": icon
            });
          case 2:
          case "end":
            return _context7.stop();
        }
      }, _callee7);
    }));
    return _handleIconChange2.apply(this, arguments);
  }
  var addition_field_style = {
    fontSize: 14
  };
  var additional_items;
  if (props.useFixedData) {
    additional_items = [];
    for (var field in props.fixedData) {
      var md = props.fixedData[field];
      additional_items.push( /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
        label: field + ": ",
        className: "metadata-form_group",
        key: field,
        inline: true
      }, /*#__PURE__*/_react["default"].createElement("span", {
        className: "bp5-ui-text metadata-field"
      }, String(md))));
    }
  } else if (additionalMdata != null) {
    additional_items = [];
    for (var _field in additionalMdata) {
      var _md = additionalMdata[_field];
      if (Array.isArray(_md)) {
        _md = _md.join(", ");
      } else if (_field == "collection_name") {
        var sresult = /\.\w*$/.exec(_md);
        if (sresult != null) _md = sresult[0].slice(1);
      }
      additional_items.push( /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
        label: _field + ": ",
        className: "metadata-form_group",
        key: _field,
        inline: true
      }, /*#__PURE__*/_react["default"].createElement("span", {
        className: "bp5-ui-text metadata-field"
      }, String(_md))));
    }
  }
  var ostyle = props.outer_style ? _lodash["default"].cloneDeep(props.outer_style) : {};
  if (props.expandWidth) {
    ostyle["width"] = "100%";
  } else {
    ostyle["width"] = usable_width;
  }
  var split_tags = !tags || tags == "" ? [] : tags.split(" ");
  return /*#__PURE__*/_react["default"].createElement(_core.Card, {
    ref: top_ref,
    elevation: props.elevation,
    className: "combined-metadata accent-bg",
    style: ostyle
  }, props.res_name != null && /*#__PURE__*/_react["default"].createElement(_core.H4, null, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
    icon: icon_dict[props.res_type],
    style: {
      marginRight: 6,
      marginBottom: 2
    }
  }), props.res_name), !props.useFixedData && props.useTags && tags != null && allTags.length > 0 && /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "Tags"
  }, /*#__PURE__*/_react["default"].createElement(NativeTags, {
    tags: split_tags,
    all_tags: allTags,
    readOnly: props.readOnly,
    handleChange: _handleTagsChange,
    res_type: props.res_type
  })), !props.useFixedData && category != null && /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "Category"
  }, /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
    onChange: _handleCategoryChange,
    value: category
  })), icon != null && /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "Icon"
  }, /*#__PURE__*/_react["default"].createElement(IconSelector, {
    icon_val: icon,
    readOnly: props.readOnly,
    handleSelectChange: _handleIconChange
  })), !props.useFixedData && props.useNotes && notesRef.current != null && /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "Notes"
  }, /*#__PURE__*/_react["default"].createElement(NotesField, {
    key: "".concat(props.res_name, "-").concat(props.res_type),
    notesRef: notesRef,
    res_name: props.res_name,
    res_type: props.res_type,
    readOnly: props.readOnly,
    handleChange: _handleNotesChange,
    show_markdown_initial: true,
    handleBlur: props.handleNotesBlur
  }), props.notes_buttons && props.notes_buttons()), created != null && /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "Created: ",
    className: "metadata-form_group",
    inline: true
  }, /*#__PURE__*/_react["default"].createElement("span", {
    className: "bp5-ui-text metadata-field"
  }, created)), updated != null && /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "Updated: ",
    className: "metadata-form_group",
    inline: true
  }, /*#__PURE__*/_react["default"].createElement("span", {
    className: "bp5-ui-text metadata-field"
  }, updated)), additional_items && additional_items.length > 0 && additional_items, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      height: 100
    }
  }));
}
exports.CombinedMetadata = CombinedMetadata = /*#__PURE__*/(0, _react.memo)(CombinedMetadata);
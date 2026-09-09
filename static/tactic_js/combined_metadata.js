"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CombinedMetadata = CombinedMetadata;
exports.IconSelector = IconSelector;
exports.NativeTags = NativeTags;
exports.NotesField = NotesField;
exports.icon_dict = void 0;
var _react = _interopRequireWildcard(require("react"));
var _core = require("@blueprintjs/core");
var _select = require("@blueprintjs/select");
var _settings = require("./settings");
var _metadata_reducer = require("./metadata_reducer");
var _selector_advanced = require("./selector_advanced");
var _tactic_socket = require("./tactic_socket");
var _core2 = _interopRequireDefault(require("highlight.js/lib/core"));
var _javascript = _interopRequireDefault(require("highlight.js/lib/languages/javascript"));
var _python = _interopRequireDefault(require("highlight.js/lib/languages/python"));
var _markdownIt = _interopRequireDefault(require("markdown-it"));
require("markdown-it-latex/dist/index.css");
var _markdownItLatex = _interopRequireDefault(require("markdown-it-latex"));
var _markdown_checkbox = require("./markdown_checkbox");
var _lodash = _interopRequireDefault(require("lodash"));
var _utilities_react = require("./utilities_react");
var _icon_info = require("./icon_info");
var _error_boundary = require("./error_boundary");
var _reactCodemirror = require("./react-codemirror6");
var _communication_react = require("./communication_react");
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
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
(0, _markdown_checkbox.enableMarkdownCheckboxes)(mdi, {
  interactive: true
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
var renderCreateNewTag = function renderCreateNewTag(query, active, handleClick) {
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
  props = _objectSpread({
    all_tags: []
  }, props);
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
    itemRenderer: _selector_advanced.renderSuggestion,
    selectedItems: props.tags,
    allowNew: true,
    items: props.all_tags ? props.all_tags : [],
    itemPredicate: _filterSuggestion,
    tagRenderer: renderTag,
    tagInputProps: {
      onRemove: _handleDelete
    },
    onItemSelect: _handleAddition
  });
}
exports.NativeTags = NativeTags = /*#__PURE__*/(0, _react.memo)(NativeTags);
function NotesField(props) {
  props = _objectSpread({
    handleBlur: null,
    setCMObject: null,
    handleChange: null
  }, props);
  var setFocusFunc = (0, _react.useRef)(null);
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  (0, _react.useEffect)(function () {}, [props.mStateRef.current.notes]);
  (0, _react.useEffect)(function () {
    // console.log("theme changed")  // This is to force re-rendering because of highlight.js theme change
  }, [settingsContext.settings.theme]);
  var _useState = (0, _react.useState)(500),
    _useState2 = _slicedToArray(_useState, 1),
    mdHeight = _useState2[0];
  var _useState3 = (0, _react.useState)(hasOnlyWhitespace() ? false : props.show_markdown_initial),
    _useState4 = _slicedToArray(_useState3, 2),
    showMarkdown = _useState4[0],
    setShowMarkdown = _useState4[1];
  var awaitingFocus = (0, _react.useRef)(false);
  var cmObject = (0, _react.useRef)(null);
  var mdRef = (0, _react.useRef)(null);
  (0, _react.useEffect)(function () {
    if (awaitingFocus.current) {
      focusNotes();
      awaitingFocus.current = false;
    }
    if (cmObject.current && !cmObject.current.hasFocus) {
      setShowMarkdown(!hasOnlyWhitespace());
    }
  });
  (0, _react.useEffect)(function () {
    return function () {
      if (cmObject.current) {
        cmObject.current.destroy();
        cmObject.current = null;
      }
      setFocusFunc.current = null;
    };
  }, []);
  (0, _react.useEffect)(function () {
    setShowMarkdown(!hasOnlyWhitespace());
  }, [props.res_name, props.res_type]);
  function hasOnlyWhitespace() {
    return !props.mStateRef.current.notes || !props.mStateRef.current.notes.trim().length;
  }
  function focusNotes() {
    if (setFocusFunc.current) {
      setFocusFunc.current();
    }
  }
  function _hideMarkdown() {
    if (props.readOnly) return;
    awaitingFocus.current = true; // We can't set focus until the input is visible
    setShowMarkdown(false);
  }
  function _handleMarkdownClick(event) {
    var handled = (0, _markdown_checkbox.handleMarkdownCheckboxClick)(event, props.mStateRef.current.notes, props.handleChange, props.readOnly);
    if (!handled) {
      _hideMarkdown();
    }
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
    var previousCmObject = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    if (props.setCMObject) {
      props.setCMObject(cmobject, previousCmObject);
    } else {
      cmObject.current = cmobject;
    }
  }
  var registerSetFocusFunc = (0, _react.useCallback)(function (theFunc) {
    setFocusFunc.current = theFunc;
  }, []);
  var really_show_markdown = hasOnlyWhitespace() ? false : showMarkdown;
  var md_style = {
    display: really_show_markdown ? "block" : "none",
    maxHeight: mdHeight,
    fontSize: 13
  };
  var converted_markdown;
  if (really_show_markdown) {
    converted_markdown = mdi.render(props.mStateRef.current.notes, {
      markdownCheckboxesDisabled: props.readOnly
    });
  }
  var converted_dict = {
    __html: converted_markdown
  };
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      display: really_show_markdown ? "none" : "block"
    }
  }, /*#__PURE__*/_react["default"].createElement(_reactCodemirror.ReactCodemirror6, {
    handleChange: props.handleChange,
    className: "notes-field",
    readOnly: props.readOnly,
    setCMObject: _setCmObject,
    handleBlur: _handleMyBlur,
    registerSetFocusFunc: registerSetFocusFunc,
    show_line_numbers: false,
    controlled: true,
    mode: "markdown",
    code_content: props.mStateRef.current.notes,
    no_height: true,
    no_width: true,
    saveMe: null,
    tsocket: props.tsocket
  })), /*#__PURE__*/_react["default"].createElement("div", {
    ref: mdRef,
    style: md_style,
    onClick: _handleMarkdownClick,
    className: "notes-field-markdown-output markdown-heading-sizes",
    dangerouslySetInnerHTML: converted_dict
  }));
}
exports.NotesField = NotesField = /*#__PURE__*/(0, _react.memo)(NotesField);
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
  var _iterator = _createForOfIteratorHelper(_icon_info.tile_icon_dict[category]),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var entry = _step.value;
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
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}
function IconSelector(_ref) {
  var handleSelectChange = _ref.handleSelectChange,
    icon_val = _ref.icon_val,
    readOnly = _ref.readOnly;
  var value = icon_entry_dict[icon_val] ? icon_entry_dict[icon_val] : icon_entry_dict["application"];
  return /*#__PURE__*/_react["default"].createElement(_error_boundary.ErrorBoundary, null, /*#__PURE__*/_react["default"].createElement(_selector_advanced.BpSelectAdvanced, {
    options: icon_dlist,
    onChange: function onChange(item) {
      handleSelectChange(item.val);
    },
    readOnly: readOnly,
    buttonIcon: icon_val,
    value: value
  }));
}
exports.IconSelector = IconSelector = /*#__PURE__*/(0, _react.memo)(IconSelector);
var ignore_fields = ["doc_type", "res_type"];
var initial_state = {
  allTags: [],
  tags: null,
  created: null,
  updated: null,
  notes: null,
  icon: null,
  category: null,
  additional_metadata: null,
  search_context: null
};
function CombinedMetadata(props) {
  props = _objectSpread({
    expandWidth: true,
    tabSelectCounter: 0,
    useTags: true,
    useNotes: true,
    outer_style: null,
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
    tsocket: null,
    alt_category: null,
    setCMObject: null,
    search_string: "",
    search_inside: false,
    list_of_selected: null,
    list_of_selected_types: null,
    multi_select: false
  }, props);
  var top_ref = (0, _react.useRef)();
  var _useImmerReducerAndRe = (0, _utilities_react.useImmerReducerAndRef)(_metadata_reducer.metadataReducer, initial_state),
    _useImmerReducerAndRe2 = _slicedToArray(_useImmerReducerAndRe, 3),
    mDispatch = _useImmerReducerAndRe2[1],
    mStateRef = _useImmerReducerAndRe2[2];
  var _useState5 = (0, _react.useState)(props.res_type === "tile"),
    _useState6 = _slicedToArray(_useState5, 2),
    isTile = _useState6[0],
    setIsTile = _useState6[1];
  var _useState7 = (0, _react.useState)(false),
    _useState8 = _slicedToArray(_useState7, 2),
    isAllTiles = _useState8[0],
    setIsAllTiles = _useState8[1];
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  var updatedIdRef = (0, _react.useRef)(null);
  var _useDebounce = (0, _utilities_react.useDebounce)(function (state_stuff) {
      var latestProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      postChanges(state_stuff, latestProps).then(function () {});
    }, 8000),
    _useDebounce2 = _slicedToArray(_useDebounce, 3),
    doUpdate = _useDebounce2[1],
    forceUpdate = _useDebounce2[2];
  var latestPropsRef = (0, _react.useRef)(props);
  (0, _react.useEffect)(function () {
    latestPropsRef.current = props;
  }, [props]);
  (0, _tactic_socket.useSocketListener)(props.tsocket, "resource-updated", handleExternalUpdate);
  (0, _react.useEffect)(function () {
    setIsAllTiles(getIsAllTiles());
  }, [props.list_of_selected_types]);
  (0, _react.useEffect)(function () {
    setIsTile(props.res_type === "tile");
  }, [props.res_type]);
  (0, _react.useEffect)(function () {
    grabMetadata();
  }, [props.res_name, props.res_type]);
  function getIsAllTiles() {
    if (!latestPropsRef.current.multi_select) {
      return false;
    }
    var _iterator2 = _createForOfIteratorHelper(latestPropsRef.current.list_of_selected_types),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var t = _step2.value;
        if (t != "tile") {
          return false;
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    return true;
  }
  function handleExternalUpdate(data) {
    if (data.res_type == props.res_type && data.res_name == props.res_name && data.mdata_uid != updatedIdRef.current) {
      grabMetadata();
    }
  }
  function grabMetadata() {
    if (props.useFixedData || props.res_name == null || props.res_type == null) return;
    if (!props.readOnly) {
      var data_dict = {
        res_type: props.res_type,
        is_repository: false,
        show_hidden: true
      };
      (0, _communication_react.postPromise)("host", "get_all_tags_task", data_dict).then(function (data) {
        mDispatch({
          "type": "set_all_tags",
          "value": data.tag_list
        });
      });
    }
    (0, _communication_react.postPromise)("host", "grab_processed_metadata_task", {
      res_type: props.res_type,
      res_name: props.res_name,
      search_string: props.search_string,
      search_inside: props.search_inside,
      is_repository: props.is_repository
    }).then(function (data) {
      var updater = {
        "tags": data.tags,
        "notes": data.notes,
        "created": data["datestring"],
        "updated": data["additional_mdata"].updated
      };
      var amdata = data["additional_mdata"];
      delete amdata.updated;
      if (props.res_type == "tile") {
        if (data["additional_mdata"].icon) {
          updater["icon"] = data["additional_mdata"].icon;
        } else {
          updater["icon"] = "application";
        }
        if (data["additional_mdata"].category) {
          updater["category"] = data["additional_mdata"].category;
          delete amdata.category;
        } else {
          updater["category"] = "nocat";
        }
        if (updater["category"] == "nocat" && props.alt_category) {
          updater["category"] = props.alt_category;
        }
      }
      updater["additionalMdata"] = amdata;
      updater["search_context"] = data === null || data === void 0 ? void 0 : data.search_context;
      mDispatch({
        type: "update_item",
        new_item: updater
      });
    })["catch"](function (e) {
      console.log("error getting metadata", e);
    });
  }
  function postChanges(_x) {
    return _postChanges.apply(this, arguments);
  }
  function _postChanges() {
    _postChanges = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(state_stuff) {
      var latestProps,
        processRes,
        _result_dict,
        _found_a_field,
        _i2,
        _arr,
        _field2,
        result_dict,
        found_a_field,
        _i3,
        _arr2,
        _field3,
        _args2 = arguments;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            latestProps = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : null;
            console.log("in postChanges");
            if (latestProps == null) {
              latestProps = latestPropsRef.current;
            }
            if (!latestProps.multi_select) {
              _context2.next = 19;
              break;
            }
            processRes = /*#__PURE__*/function () {
              var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(res_name, index) {
                return _regeneratorRuntime().wrap(function _callee$(_context) {
                  while (1) switch (_context.prev = _context.next) {
                    case 0:
                      _result_dict["res_type"] = latestProps.list_of_selected_types[index];
                      _result_dict["res_name"] = res_name;
                      _result_dict["mdata_uid"] = (0, _utilities_react.guid)();
                      _context.prev = 3;
                      _context.next = 6;
                      return (0, _communication_react.postPromise)("host", "save_metadata_task", _result_dict);
                    case 6:
                      updatedIdRef.current = _result_dict["mdata_uid"];
                      _context.next = 12;
                      break;
                    case 9:
                      _context.prev = 9;
                      _context.t0 = _context["catch"](3);
                      console.log("error saving metadata for ".concat(res_name), _context.t0);
                    case 12:
                    case "end":
                      return _context.stop();
                  }
                }, _callee, null, [[3, 9]]);
              }));
              return function processRes(_x9, _x10) {
                return _ref2.apply(this, arguments);
              };
            }();
            _result_dict = {};
            if (!isAllTiles) {
              _context2.next = 14;
              break;
            }
            _result_dict["metadata"] = {};
            _found_a_field = false;
            for (_i2 = 0, _arr = ["tags", "icon", "category"]; _i2 < _arr.length; _i2++) {
              _field2 = _arr[_i2];
              if (_field2 in state_stuff) {
                _found_a_field = true;
                _result_dict["metadata"][_field2] = state_stuff[_field2];
              }
            }
            if (_found_a_field) {
              _context2.next = 12;
              break;
            }
            return _context2.abrupt("return");
          case 12:
            _context2.next = 17;
            break;
          case 14:
            if ("tags" in state_stuff) {
              _context2.next = 16;
              break;
            }
            return _context2.abrupt("return");
          case 16:
            _result_dict = {
              "metadata": {
                "tags": state_stuff["tags"]
              }
            };
          case 17:
            latestProps.list_of_selected.forEach(processRes);
            return _context2.abrupt("return");
          case 19:
            result_dict = {
              "res_type": latestProps.res_type,
              "res_name": latestProps.res_name,
              "metadata": {
                "mdata_uid": (0, _utilities_react.guid)()
              }
            };
            found_a_field = false;
            for (_i3 = 0, _arr2 = ["tags", "notes", "icon", "category"]; _i3 < _arr2.length; _i3++) {
              _field3 = _arr2[_i3];
              if (_field3 in state_stuff) {
                found_a_field = true;
                result_dict["metadata"][_field3] = state_stuff[_field3];
              }
            }
            if (found_a_field) {
              _context2.next = 24;
              break;
            }
            return _context2.abrupt("return");
          case 24:
            _context2.prev = 24;
            _context2.next = 27;
            return (0, _communication_react.postPromise)("host", "save_metadata_task", result_dict);
          case 27:
            updatedIdRef.current = result_dict["mdata_uid"];
            _context2.next = 33;
            break;
          case 30:
            _context2.prev = 30;
            _context2.t0 = _context2["catch"](24);
            console.log("error saving metadata ", _context2.t0);
          case 33:
          case "end":
            return _context2.stop();
        }
      }, _callee2, null, [[24, 30]]);
    }));
    return _postChanges.apply(this, arguments);
  }
  function _handleMetadataChange(_x2) {
    return _handleMetadataChange2.apply(this, arguments);
  }
  function _handleMetadataChange2() {
    _handleMetadataChange2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(state_stuff) {
      var post_immediate,
        isExternal,
        _args3 = arguments;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            post_immediate = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : true;
            isExternal = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : false;
            mDispatch({
              type: "update_item",
              "new_item": state_stuff
            });
            if (!isExternal) {
              _context3.next = 5;
              break;
            }
            return _context3.abrupt("return");
          case 5:
            if (!post_immediate) {
              _context3.next = 10;
              break;
            }
            _context3.next = 8;
            return postChanges(state_stuff);
          case 8:
            _context3.next = 11;
            break;
          case 10:
            doUpdate(state_stuff, latestPropsRef.current);
          case 11:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
    return _handleMetadataChange2.apply(this, arguments);
  }
  function appendToNotes(_x3) {
    return _appendToNotes.apply(this, arguments);
  }
  function _appendToNotes() {
    _appendToNotes = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(text) {
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            mDispatch({
              type: "append_to_notes",
              "value": text
            });
            pushCallback( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
              return _regeneratorRuntime().wrap(function _callee4$(_context4) {
                while (1) switch (_context4.prev = _context4.next) {
                  case 0:
                    _context4.next = 2;
                    return postChanges({
                      "notes": mStateRef.current.notes
                    });
                  case 2:
                  case "end":
                    return _context4.stop();
                }
              }, _callee4);
            })));
          case 2:
          case "end":
            return _context5.stop();
        }
      }, _callee5);
    }));
    return _appendToNotes.apply(this, arguments);
  }
  function _handleNotesChange(_x4, _x5) {
    return _handleNotesChange2.apply(this, arguments);
  }
  function _handleNotesChange2() {
    _handleNotesChange2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(new_text, isExternal) {
      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return _handleMetadataChange({
              "notes": new_text
            }, false, isExternal);
          case 2:
          case "end":
            return _context6.stop();
        }
      }, _callee6);
    }));
    return _handleNotesChange2.apply(this, arguments);
  }
  function _handleTagsChange(_x6) {
    return _handleTagsChange2.apply(this, arguments);
  }
  function _handleTagsChange2() {
    _handleTagsChange2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(tag_list) {
      return _regeneratorRuntime().wrap(function _callee7$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return _handleMetadataChange({
              "tags": tag_list.join(" ")
            });
          case 2:
          case "end":
            return _context7.stop();
        }
      }, _callee7);
    }));
    return _handleTagsChange2.apply(this, arguments);
  }
  function _handleCategoryChange(_x7) {
    return _handleCategoryChange2.apply(this, arguments);
  }
  function _handleCategoryChange2() {
    _handleCategoryChange2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(event) {
      return _regeneratorRuntime().wrap(function _callee8$(_context8) {
        while (1) switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return _handleMetadataChange({
              "category": event.target.value
            });
          case 2:
          case "end":
            return _context8.stop();
        }
      }, _callee8);
    }));
    return _handleCategoryChange2.apply(this, arguments);
  }
  function _handleIconChange(_x8) {
    return _handleIconChange2.apply(this, arguments);
  }
  function _handleIconChange2() {
    _handleIconChange2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(icon) {
      return _regeneratorRuntime().wrap(function _callee9$(_context9) {
        while (1) switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return _handleMetadataChange({
              "icon": icon
            });
          case 2:
          case "end":
            return _context9.stop();
        }
      }, _callee9);
    }));
    return _handleIconChange2.apply(this, arguments);
  }
  function handleNotesBlur() {
    console.log("got handleNotesBlur");
    forceUpdate();
  }
  var additional_items;
  if (!props.multi_select) {
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
          className: "bp6-ui-text metadata-field"
        }, String(md))));
      }
    } else if (mStateRef.current.additionalMdata != null) {
      additional_items = [];
      for (var _field in mStateRef.current.additionalMdata) {
        var _md = mStateRef.current.additionalMdata[_field];
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
          className: "bp6-ui-text metadata-field"
        }, String(_md))));
      }
    }
  }
  var ostyle = props.outer_style ? _lodash["default"].cloneDeep(props.outer_style) : {
    height: "100%"
  };
  ostyle["width"] = "100%";
  ostyle["overflow"] = "auto";
  var split_tags = !mStateRef.current.tags || mStateRef.current.tags == "" ? [] : mStateRef.current.tags.split(" ");
  var MetadataNotesButtons = props.notes_buttons;
  return /*#__PURE__*/_react["default"].createElement(_error_boundary.ErrorBoundary, null, /*#__PURE__*/_react["default"].createElement(_core.Card, {
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
  }), props.res_name), !props.useFixedData && props.useTags && mStateRef.current.tags != null && mStateRef.current.allTags.length > 0 && /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "Tags"
  }, /*#__PURE__*/_react["default"].createElement(NativeTags, {
    key: "".concat(props.res_name, "-").concat(props.res_type, "-tags"),
    tags: split_tags,
    all_tags: mStateRef.current.allTags,
    readOnly: props.readOnly,
    handleChange: _handleTagsChange,
    res_type: props.res_type
  })), (isTile || isAllTiles) && !props.useFixedData && mStateRef.current.category != null && /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "Category",
    key: "".concat(props.res_name, "-").concat(props.res_type, "-cagegory")
  }, /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
    onChange: _handleCategoryChange,
    disabled: props.readOnly,
    value: mStateRef.current.category
  })), (isTile || isAllTiles) && /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "Icon"
  }, /*#__PURE__*/_react["default"].createElement(IconSelector, {
    key: "".concat(props.res_name, "-").concat(props.res_type, "-icon-selector"),
    icon_val: mStateRef.current.icon ? mStateRef.current.icon : "application",
    readOnly: props.readOnly,
    handleSelectChange: _handleIconChange
  })), !props.useFixedData && !props.multi_select && props.useNotes && mStateRef.current.notes != null && /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "Notes"
  }, /*#__PURE__*/_react["default"].createElement(NotesField, {
    key: "metadata-notes",
    mStateRef: mStateRef,
    currentNotes: mStateRef.current.notes,
    res_name: props.res_name,
    res_type: props.res_type,
    readOnly: props.readOnly,
    handleChange: _handleNotesChange,
    show_markdown_initial: true,
    setCMObject: props.setCMObject,
    tsocket: props.tsocket,
    handleBlur: handleNotesBlur
  }), props.notes_buttons && /*#__PURE__*/_react["default"].createElement(MetadataNotesButtons, {
    appendToNotes: appendToNotes
  })), props.search_inside && mStateRef.current.search_context && !props.multi_select && /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "Search Context",
    readOnly: true
  }, /*#__PURE__*/_react["default"].createElement(_core.TextArea, {
    value: mStateRef.current.search_context,
    fill: true,
    autoResize: true
  })), mStateRef.current.created != null && !props.multi_select && /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "Created: ",
    className: "metadata-form_group",
    inline: true
  }, /*#__PURE__*/_react["default"].createElement("span", {
    className: "bp6-ui-text metadata-field"
  }, mStateRef.current.created)), mStateRef.current.updated != null && !props.multi_select && /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "Updated: ",
    className: "metadata-form_group",
    inline: true
  }, /*#__PURE__*/_react["default"].createElement("span", {
    className: "bp6-ui-text metadata-field"
  }, mStateRef.current.updated)), additional_items && additional_items.length > 0 && !props.multi_select && additional_items, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      height: 100
    }
  })));
}
exports.CombinedMetadata = CombinedMetadata = /*#__PURE__*/(0, _react.memo)(CombinedMetadata);
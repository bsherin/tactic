"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReactCodemirrorMergeView = ReactCodemirrorMergeView;
var _react = _interopRequireWildcard(require("react"));
var _reactHelmet = require("react-helmet");
var _core = require("@blueprintjs/core");
var _codemirror = _interopRequireDefault(require("codemirror/lib/codemirror"));
require("codemirror/mode/python/python");
require("codemirror/lib/codemirror.css");
require("codemirror/addon/merge/merge");
require("codemirror/addon/merge/merge.css");
require("codemirror/addon/hint/show-hint");
require("codemirror/addon/hint/show-hint.css");
require("codemirror/addon/dialog/dialog");
require("codemirror/addon/dialog/dialog.css");
require("codemirror/addon/edit/matchbrackets");
require("codemirror/addon/edit/closebrackets");
require("codemirror/addon/search/match-highlighter");
var _communication_react = require("./communication_react");
var _settings = require("./settings");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return r; }; var t, r = {}, e = Object.prototype, n = e.hasOwnProperty, o = "function" == typeof Symbol ? Symbol : {}, i = o.iterator || "@@iterator", a = o.asyncIterator || "@@asyncIterator", u = o.toStringTag || "@@toStringTag"; function c(t, r, e, n) { return Object.defineProperty(t, r, { value: e, enumerable: !n, configurable: !n, writable: !n }); } try { c({}, ""); } catch (t) { c = function c(t, r, e) { return t[r] = e; }; } function h(r, e, n, o) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype); return c(a, "_invoke", function (r, e, n) { var o = 1; return function (i, a) { if (3 === o) throw Error("Generator is already running"); if (4 === o) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var u = n.delegate; if (u) { var c = d(u, n); if (c) { if (c === f) continue; return c; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (1 === o) throw o = 4, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = 3; var h = s(r, e, n); if ("normal" === h.type) { if (o = n.done ? 4 : 2, h.arg === f) continue; return { value: h.arg, done: n.done }; } "throw" === h.type && (o = 4, n.method = "throw", n.arg = h.arg); } }; }(r, n, new Context(o || [])), !0), a; } function s(t, r, e) { try { return { type: "normal", arg: t.call(r, e) }; } catch (t) { return { type: "throw", arg: t }; } } r.wrap = h; var f = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var l = {}; c(l, i, function () { return this; }); var p = Object.getPrototypeOf, y = p && p(p(x([]))); y && y !== e && n.call(y, i) && (l = y); var v = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(l); function g(t) { ["next", "throw", "return"].forEach(function (r) { c(t, r, function (t) { return this._invoke(r, t); }); }); } function AsyncIterator(t, r) { function e(o, i, a, u) { var c = s(t[o], t, i); if ("throw" !== c.type) { var h = c.arg, f = h.value; return f && "object" == _typeof(f) && n.call(f, "__await") ? r.resolve(f.__await).then(function (t) { e("next", t, a, u); }, function (t) { e("throw", t, a, u); }) : r.resolve(f).then(function (t) { h.value = t, a(h); }, function (t) { return e("throw", t, a, u); }); } u(c.arg); } var o; c(this, "_invoke", function (t, n) { function i() { return new r(function (r, o) { e(t, n, r, o); }); } return o = o ? o.then(i, i) : i(); }, !0); } function d(r, e) { var n = e.method, o = r.i[n]; if (o === t) return e.delegate = null, "throw" === n && r.i["return"] && (e.method = "return", e.arg = t, d(r, e), "throw" === e.method) || "return" !== n && (e.method = "throw", e.arg = new TypeError("The iterator does not provide a '" + n + "' method")), f; var i = s(o, r.i, e.arg); if ("throw" === i.type) return e.method = "throw", e.arg = i.arg, e.delegate = null, f; var a = i.arg; return a ? a.done ? (e[r.r] = a.value, e.next = r.n, "return" !== e.method && (e.method = "next", e.arg = t), e.delegate = null, f) : a : (e.method = "throw", e.arg = new TypeError("iterator result is not an object"), e.delegate = null, f); } function w(t) { this.tryEntries.push(t); } function m(r) { var e = r[4] || {}; e.type = "normal", e.arg = t, r[4] = e; } function Context(t) { this.tryEntries = [[-1]], t.forEach(w, this), this.reset(!0); } function x(r) { if (null != r) { var e = r[i]; if (e) return e.call(r); if ("function" == typeof r.next) return r; if (!isNaN(r.length)) { var o = -1, a = function e() { for (; ++o < r.length;) if (n.call(r, o)) return e.value = r[o], e.done = !1, e; return e.value = t, e.done = !0, e; }; return a.next = a; } } throw new TypeError(_typeof(r) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, c(v, "constructor", GeneratorFunctionPrototype), c(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = c(GeneratorFunctionPrototype, u, "GeneratorFunction"), r.isGeneratorFunction = function (t) { var r = "function" == typeof t && t.constructor; return !!r && (r === GeneratorFunction || "GeneratorFunction" === (r.displayName || r.name)); }, r.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, c(t, u, "GeneratorFunction")), t.prototype = Object.create(v), t; }, r.awrap = function (t) { return { __await: t }; }, g(AsyncIterator.prototype), c(AsyncIterator.prototype, a, function () { return this; }), r.AsyncIterator = AsyncIterator, r.async = function (t, e, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(h(t, e, n, o), i); return r.isGeneratorFunction(e) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, g(v), c(v, u, "Generator"), c(v, i, function () { return this; }), c(v, "toString", function () { return "[object Generator]"; }), r.keys = function (t) { var r = Object(t), e = []; for (var n in r) e.unshift(n); return function t() { for (; e.length;) if ((n = e.pop()) in r) return t.value = n, t.done = !1, t; return t.done = !0, t; }; }, r.values = x, Context.prototype = { constructor: Context, reset: function reset(r) { if (this.prev = this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(m), !r) for (var e in this) "t" === e.charAt(0) && n.call(this, e) && !isNaN(+e.slice(1)) && (this[e] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0][4]; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(r) { if (this.done) throw r; var e = this; function n(t) { a.type = "throw", a.arg = r, e.next = t; } for (var o = e.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i[4], u = this.prev, c = i[1], h = i[2]; if (-1 === i[0]) return n("end"), !1; if (!c && !h) throw Error("try statement without catch or finally"); if (null != i[0] && i[0] <= u) { if (u < c) return this.method = "next", this.arg = t, n(c), !0; if (u < h) return n(h), !1; } } }, abrupt: function abrupt(t, r) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var n = this.tryEntries[e]; if (n[0] > -1 && n[0] <= this.prev && this.prev < n[2]) { var o = n; break; } } o && ("break" === t || "continue" === t) && o[0] <= r && r <= o[2] && (o = null); var i = o ? o[4] : {}; return i.type = t, i.arg = r, o ? (this.method = "next", this.next = o[2], f) : this.complete(i); }, complete: function complete(t, r) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && r && (this.next = r), f; }, finish: function finish(t) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var e = this.tryEntries[r]; if (e[2] === t) return this.complete(e[4], e[3]), m(e), f; } }, "catch": function _catch(t) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var e = this.tryEntries[r]; if (e[0] === t) { var n = e[4]; if ("throw" === n.type) { var o = n.arg; m(e); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(r, e, n) { return this.delegate = { i: x(r), r: e, n: n }, "next" === this.method && (this.arg = t), f; } }, r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function ReactCodemirrorMergeView(props) {
  var code_container_ref = (0, _react.useRef)(null);
  var cmobject = (0, _react.useRef)(null);
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  var hotkeys = (0, _react.useMemo)(function () {
    return [{
      combo: "Ctrl+S",
      global: false,
      group: "Merge Viewer",
      label: "Save Code",
      onKeyDown: props.saveMe
    }, {
      combo: "Escape",
      global: false,
      group: "Merge Viewer",
      label: "Clear Selections",
      onKeyDown: function onKeyDown(e) {
        clearSelections();
        e.preventDefault();
      }
    }, {
      combo: "Ctrl+F",
      global: false,
      group: "Merge Viewer",
      label: "Search Code",
      onKeyDown: function onKeyDown(e) {
        searchCM();
        e.preventDefault();
      }
    }];
  }, [props.saveMe]);
  var _useHotkeys = (0, _core.useHotkeys)(hotkeys),
    handleKeyDown = _useHotkeys.handleKeyDown,
    handleKeyUp = _useHotkeys.handleKeyUp;
  (0, _react.useEffect)(function () {
    var current_theme = _current_codemirror_theme();
    cmobject.current = createMergeArea(code_container_ref.current);
    cmobject.current.editor().setOption("theme", current_theme);
    cmobject.current.rightOriginal().setOption("theme", current_theme);
    resizeHeights(props.max_height);
    refreshAreas();
    create_keymap();
  }, []);
  (0, _react.useEffect)(function () {
    if (!cmobject.current) {
      return;
    }
    if (cmobject.current.editor().getValue() != props.editor_content) {
      cmobject.current.editor().setValue(props.editor_content);
    }
    cmobject.current.rightOriginal().setValue(props.right_content);
    resizeHeights(props.max_height);
  });
  (0, _react.useEffect)(function () {
    if (!cmobject.current) {
      return;
    }
    var current_theme = _current_codemirror_theme();
    cmobject.current.editor().setOption("theme", current_theme);
    cmobject.current.rightOriginal().setOption("theme", current_theme);
  }, [settingsContext.settings.theme, settingsContext.settings.preferred_dark_theme, settingsContext.settings.preferred_light_theme]);
  function isDark() {
    return settingsContext.settingsRef.current.theme == "dark";
  }
  function _current_codemirror_theme() {
    return isDark() ? settingsContext.settingsRef.current.preferred_dark_theme : settingsContext.settingsRef.current.preferred_light_theme;
  }
  function createMergeArea(codearea) {
    var cmobject = _codemirror["default"].MergeView(codearea, {
      value: props.editor_content,
      lineNumbers: true,
      matchBrackets: true,
      highlightSelectionMatches: true,
      autoCloseBrackets: true,
      indentUnit: 4,
      theme: _current_codemirror_theme(),
      origRight: props.right_content
    });
    cmobject.editor().setOption("extraKeys", {
      Tab: function Tab(cm) {
        var spaces = new Array(5).join(" ");
        cm.replaceSelection(spaces);
      },
      "Ctrl-Space": "autocomplete"
    });
    cmobject.editor().on("change", handleChange);
    return cmobject;
  }
  function mergeViewHeight() {
    function editorHeight(editor) {
      return editor ? editor.getScrollInfo().height : 0;
    }
    return Math.max(editorHeight(cmobject.current.editor()), editorHeight(cmobject.current.rightOriginal()));
  }
  function resizeHeights(max_height) {
    var height = Math.min(mergeViewHeight(), max_height);
    cmobject.current.editor().setSize(null, height);
    if (cmobject.current.rightOriginal()) {
      cmobject.current.rightOriginal().setSize(null, height);
    }
    cmobject.current.wrap.style.height = height + "px";
  }
  function handleChange(cm, changeObject) {
    props.handleEditChange(cm.getValue());
    resizeHeights(props.max_height);
  }
  function refreshAreas() {
    cmobject.current.editor().refresh();
    cmobject.current.rightOriginal().refresh();
  }
  function create_api() {
    return _create_api.apply(this, arguments);
  }
  function _create_api() {
    _create_api = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var data, api_dict_by_category, api_dict_by_name, ordered_api_categories, api_list, _iterator, _step, cat, _iterator2, _step2, entry;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _communication_react.postAjaxPromise)("get_api_dict", {});
          case 2:
            data = _context.sent;
            api_dict_by_category = data.api_dict_by_category;
            api_dict_by_name = data.api_dict_by_name;
            ordered_api_categories = data.ordered_api_categories;
            api_list = [];
            _iterator = _createForOfIteratorHelper(ordered_api_categories);
            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                cat = _step.value;
                _iterator2 = _createForOfIteratorHelper(api_dict_by_category[cat]);
                try {
                  for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                    entry = _step2.value;
                    api_list.push(entry["name"]);
                  }
                } catch (err) {
                  _iterator2.e(err);
                } finally {
                  _iterator2.f();
                }
              }
              //noinspection JSUnresolvedVariable
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }
            _codemirror["default"].commands.autocomplete = function (cm) {
              //noinspection JSUnresolvedFunction
              cm.showHint({
                hint: _codemirror["default"].hint.anyword,
                api_list: api_list,
                extra_autocomplete_list: extra_autocomplete_list
              });
            };
          case 10:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return _create_api.apply(this, arguments);
  }
  function searchCM() {
    // CodeMirror.commands.find(cmobject.current)
  }
  function clearSelections() {
    cmobject.current.editor().setSelection({
      line: 0,
      ch: 0
    });
    cmobject.current.rightOriginal().setSelection({
      line: 0,
      ch: 0
    });
  }
  function create_keymap() {
    _codemirror["default"].keyMap["default"]["Esc"] = function () {
      clearSelections();
    };
    var is_mac = _codemirror["default"].keyMap["default"].hasOwnProperty("Cmd-S");
    if (is_mac) {
      _codemirror["default"].keyMap["default"]["Ctrl-S"] = function () {
        props.saveMe();
      };
    } else {
      _codemirror["default"].keyMap["default"]["Ctrl-S"] = function () {
        props.saveMe();
      };
    }
    _codemirror["default"].keyMap["default"]["Ctrl-F"] = function (e) {
      searchCM();
    };
  }
  var ccstyle = {
    "height": "100%"
  };
  var tTheme = settingsContext.settingsRef.current.theme;
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_reactHelmet.Helmet, null, /*#__PURE__*/_react["default"].createElement("link", {
    rel: "stylesheet",
    href: "/static/tactic_css/codemirror_".concat(tTheme, "/").concat(_current_codemirror_theme(), ".css"),
    type: "text/css"
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: "code-container",
    style: ccstyle,
    ref: code_container_ref,
    tabIndex: "0",
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp
  }));
}
exports.ReactCodemirrorMergeView = ReactCodemirrorMergeView = /*#__PURE__*/(0, _react.memo)(ReactCodemirrorMergeView);
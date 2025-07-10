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
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
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
    _create_api = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
      var data, api_dict_by_category, api_dict_by_name, ordered_api_categories, api_list, _iterator, _step, cat, _iterator2, _step2, entry;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            _context.n = 1;
            return (0, _communication_react.postAjaxPromise)("get_api_dict", {});
          case 1:
            data = _context.v;
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
          case 2:
            return _context.a(2);
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
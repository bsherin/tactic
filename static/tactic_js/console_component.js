"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConsoleComponent = ConsoleComponent;
var _react = _interopRequireWildcard(require("react"));
var _core = require("@blueprintjs/core");
var _error_boundary = require("./error_boundary");
var _utilities_react = require("./utilities_react");
var _widgets = require("./widgets");
var _lodash = _interopRequireDefault(require("lodash"));
var _core2 = _interopRequireDefault(require("highlight.js/lib/core"));
var _javascript = _interopRequireDefault(require("highlight.js/lib/languages/javascript"));
var _python = _interopRequireDefault(require("highlight.js/lib/languages/python"));
var _markdownIt = _interopRequireDefault(require("markdown-it"));
require("markdown-it-latex/dist/index.css");
var _markdownItLatex = _interopRequireDefault(require("markdown-it-latex"));
var _blueprint_react_widgets = require("./blueprint_react_widgets");
var _reactCodemirror = require("./react-codemirror6");
var _sortable_container = require("./sortable_container");
var _communication_react = require("./communication_react");
var _combined_metadata = require("./combined_metadata");
var _library_pane = require("./library_pane");
var _menu_utilities = require("./menu_utilities");
var _search_form = require("./search_form");
var _searchable_console = require("./searchable_console");
var _settings = require("./settings");
var _modal_react = require("./modal_react");
var _error_drawer = require("./error_drawer");
var _assistant = require("./assistant");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t10 in e) "default" !== _t10 && {}.hasOwnProperty.call(e, _t10) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t10)) && (i.get || i.set) ? o(f, _t10, i) : f[_t10] = e[_t10]); return f; })(e, t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _regeneratorValues(e) { if (null != e) { var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"], r = 0; if (t) return t.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) return { next: function next() { return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }; } }; } throw new TypeError(_typeof(e) + " is not iterable"); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
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
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } // noinspection JSConstructorReturnsPrimitive,JSUnusedAssignment
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
var trash_icon = /*#__PURE__*/_react["default"].createElement(_core.Icon, {
  icon: "trash",
  size: 14
});
var clean_icon = /*#__PURE__*/_react["default"].createElement(_core.Icon, {
  icon: "clean",
  size: 14
});
var SHRINK_EXPAND_GLYPH_BUTTON_STYLE = {
  marginLeft: 2
};
var SHOW_EXPORTS_GLYPH_BUTTON_STYLE2 = {
  marginRight: 5,
  marginTop: 2
};
var GLYPH_BUTTON_STYLE3 = {
  marginLeft: 10,
  marginRight: 66,
  minHeight: 0
};
var GlYPH_BUTTON_STYLE4 = {
  marginLeft: 10,
  marginRight: 66
};
var GLYPH_BUTTON_STYLE5 = {
  marginTop: 5
};
var SPINNER_STYLE = {
  marginTop: 10,
  marginRight: 22
};
var MB10_STYLE = {
  marginBottom: 10
};
var searchable_console_style = {
  padding: 15
};
var sHandleStyle = {
  marginLeft: 0,
  marginRight: 6
};
var FILTER_SEARCH_RIGHT_MARGIN = 20;
var empty_style = {};
function ConsoleComponent(props) {
  props = _objectSpread({
    style: {},
    shrinkable: true,
    zoomable: true
  }, props);
  var header_ref = (0, _react.useRef)(null);
  var filtered_items_ref = (0, _react.useRef)([]);
  var widgetHomesRef = (0, _react.useRef)({});
  var _useState = (0, _react.useState)(null),
    _useState2 = _slicedToArray(_useState, 2),
    set_console_item_with_focus = _useState2[1];
  var _useState3 = (0, _react.useState)(null),
    _useState4 = _slicedToArray(_useState3, 2),
    set_console_item_saved_focus = _useState4[1];
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)(null),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    set_search_string = _useStateAndRef2[1],
    search_string_ref = _useStateAndRef2[2];
  var _useState5 = (0, _react.useState)(false),
    _useState6 = _slicedToArray(_useState5, 2),
    filter_console_items = _useState6[0],
    set_filter_console_items = _useState6[1];
  var _useState7 = (0, _react.useState)(null),
    _useState8 = _slicedToArray(_useState7, 2),
    search_helper_text = _useState8[0],
    set_search_helper_text = _useState8[1];
  var _useState9 = (0, _react.useState)(false),
    _useState0 = _slicedToArray(_useState9, 2),
    show_main_log = _useState0[0],
    set_show_main_log = _useState0[1];
  var _useState1 = (0, _react.useState)(false),
    _useState10 = _slicedToArray(_useState1, 2),
    show_pseudo_log = _useState10[0],
    set_show_pseudo_log = _useState10[1];
  var _useState11 = (0, _react.useState)(null),
    _useState12 = _slicedToArray(_useState11, 2),
    pseudo_tile_id = _useState12[0],
    set_pseudo_tile_id = _useState12[1];
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  var selectedPane = (0, _react.useContext)(_utilities_react.SelectedPaneContext);
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  (0, _react.useEffect)(function () {
    initSocket();
    // _requestPseudoTileId();
    if (props.console_items.current.length == 0) {
      _addCodeArea("", false);
    }
    if (props.console_selected_items_ref.current.length == 0) {
      _clear_all_selected_items(function () {
        if (props.console_items.current && props.console_items.current.length > 0) {
          _selectConsoleItem(props.console_items.current[0].unique_id);
        }
      });
    }
  }, []);
  (0, _react.useEffect)(function () {
    if (show_pseudo_log) {
      _requestPseudoTileId();
    }
  }, [show_pseudo_log]);
  (0, _react.useEffect)(function () {
    //console.log("theme changed")  // This is to force re-rendering because of highlight.js theme change
  }, [settingsContext.settings.theme]);
  var _addBlankCode = (0, _react.useCallback)(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          if (!(window.in_context && !am_selected())) {
            _context.n = 1;
            break;
          }
          return _context.a(2);
        case 1:
          _context.n = 2;
          return _addCodeArea("");
        case 2:
          return _context.a(2);
      }
    }, _callee);
  })), []);
  var _addBlankText = (0, _react.useCallback)(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          if (!(window.in_context && !am_selected())) {
            _context2.n = 1;
            break;
          }
          return _context2.a(2);
        case 1:
          _context2.n = 2;
          return _addConsoleText("");
        case 2:
          return _context2.a(2);
      }
    }, _callee2);
  })), []);
  var hotkeys = (0, _react.useMemo)(function () {
    return [{
      combo: "Ctrl+C",
      global: false,
      group: "Notebook",
      label: "New Code Cell",
      onKeyDown: _addBlankCode
    }, {
      combo: "Ctrl+T",
      global: false,
      group: "Notebook",
      label: "New Text Cell",
      onKeyDown: _addBlankText
    }, {
      combo: "Ctrl+Enter",
      global: false,
      group: "Notebook",
      label: "Run Selected Cell",
      onKeyDown: _runSelected
    }, {
      combo: "Cmd+Enter",
      global: false,
      group: "Notebook",
      label: "Run Selected Cell",
      onKeyDown: _runSelected
    }, {
      combo: "Escape",
      global: false,
      group: "Notebook",
      label: "Clear Selected Cells",
      onKeyDown: function onKeyDown() {
        _clear_all_selected_items();
      }
    }];
  }, [_addBlankCode, _addBlankText, _runSelected, _clear_all_selected_items]);
  var _useHotkeys = (0, _core.useHotkeys)(hotkeys),
    handleKeyDown = _useHotkeys.handleKeyDown,
    handleKeyUp = _useHotkeys.handleKeyUp;
  function initSocket() {
    function _handleConsoleMessage(data) {
      if (data.local_id == props.local_id) {
        // noinspection JSUnusedGlobalSymbols
        var handlerDict = {
          consoleLog: function consoleLog(data) {
            return _addConsoleEntry(data.message, data.force_open, true);
          },
          consoleLogMultiple: function consoleLogMultiple(data) {
            return _addConsoleEntries(data.message, data.force_open, true);
          },
          createLink: function () {
            var _createLink = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(data) {
              var unique_id;
              return _regenerator().w(function (_context3) {
                while (1) switch (_context3.n) {
                  case 0:
                    unique_id = data.message.unique_id;
                    _context3.n = 1;
                    return _addConsoleEntry(data.message, data.force_open, false, null, function () {
                      _insertLinkInItem(unique_id);
                    });
                  case 1:
                    return _context3.a(2);
                }
              }, _callee3);
            }));
            function createLink(_x) {
              return _createLink.apply(this, arguments);
            }
            return createLink;
          }(),
          stopConsoleSpinner: function stopConsoleSpinner(data) {
            var execution_count = "execution_count" in data ? data.execution_count : null;
            _stopConsoleSpinner(data.console_id, execution_count);
          },
          consoleCodePrint: function consoleCodePrint(data) {
            return _appendConsoleItemOutput(data);
          },
          consoleCodeOverwrite: function consoleCodeOverwrite(data) {
            return _setConsoleItemOutput(data);
          },
          consoleCodeWidget: function consoleCodeWidget(data) {
            return _appendWidgetToConsoleItem(data);
          },
          consoleWidgetUpdate: function consoleWidgetUpdate(data) {
            return updateWidgetData(data);
          }
        };
        handlerDict[data["console_message"]](data);
      }
    }

    // We have to careful to get the very same instance of the listerner function
    // That requires storing it outside of this component since the console can be unmounted

    props.tsocket.attachListener("console-message", _handleConsoleMessage);
  }
  function updateWidgetData(data) {
    props.dispatch({
      type: "update_widget_data",
      unique_id: widgetHomesRef.current[data["widgetId"]],
      widgetId: data["widgetId"],
      widgetData: data["widgetData"]
    });
  }
  function _requestPseudoTileId() {
    if (pseudo_tile_id == null) {
      (0, _communication_react.postWithCallback)(props.local_id, "get_pseudo_tile_id", {}, function (res) {
        set_pseudo_tile_id(res.pseudo_tile_id);
      });
    }
  }
  function _pasteImage() {
    return _pasteImage2.apply(this, arguments);
  }
  function _pasteImage2() {
    _pasteImage2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee14() {
      var clipboardContents, blob, _iterator1, _step1, item, gotBlob, _gotBlob, _t5;
      return _regenerator().w(function (_context15) {
        while (1) switch (_context15.n) {
          case 0:
            _gotBlob = function _gotBlob3() {
              _gotBlob = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13(blob) {
                var formData, _t4;
                return _regenerator().w(function (_context14) {
                  while (1) switch (_context14.n) {
                    case 0:
                      formData = new FormData();
                      formData.append('image', blob, 'image.png');
                      formData.append("local_id", props.local_id);
                      _context14.p = 1;
                      _context14.n = 2;
                      return (0, _communication_react.postFormDataPromise)("print_blob_area_to_console", formData);
                    case 2:
                      _context14.n = 4;
                      break;
                    case 3:
                      _context14.p = 3;
                      _t4 = _context14.v;
                      console.log(_t4);
                    case 4:
                      return _context14.a(2);
                  }
                }, _callee13, null, [[1, 3]]);
              }));
              return _gotBlob.apply(this, arguments);
            };
            gotBlob = function _gotBlob2(_x8) {
              return _gotBlob.apply(this, arguments);
            };
            blob = null;
            _context15.n = 1;
            return navigator.clipboard.read();
          case 1:
            clipboardContents = _context15.v;
            _iterator1 = _createForOfIteratorHelper(clipboardContents);
            _context15.p = 2;
            _iterator1.s();
          case 3:
            if ((_step1 = _iterator1.n()).done) {
              _context15.n = 8;
              break;
            }
            item = _step1.value;
            if (!item.types.includes("image/png")) {
              _context15.n = 7;
              break;
            }
            _context15.n = 4;
            return item.getType("image/png");
          case 4:
            blob = _context15.v;
            if (!(blob == null)) {
              _context15.n = 5;
              break;
            }
            return _context15.a(2);
          case 5:
            _context15.n = 6;
            return gotBlob(blob);
          case 6:
            return _context15.a(3, 8);
          case 7:
            _context15.n = 3;
            break;
          case 8:
            _context15.n = 10;
            break;
          case 9:
            _context15.p = 9;
            _t5 = _context15.v;
            _iterator1.e(_t5);
          case 10:
            _context15.p = 10;
            _iterator1.f();
            return _context15.f(10);
          case 11:
            return _context15.a(2);
        }
      }, _callee14, null, [[2, 9, 10, 11]]);
    }));
    return _pasteImage2.apply(this, arguments);
  }
  function _addConsoleText(_x2) {
    return _addConsoleText2.apply(this, arguments);
  }
  function _addConsoleText2() {
    _addConsoleText2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee15(the_text) {
      var callback,
        _args16 = arguments,
        _t6;
      return _regenerator().w(function (_context16) {
        while (1) switch (_context16.n) {
          case 0:
            callback = _args16.length > 1 && _args16[1] !== undefined ? _args16[1] : null;
            _context16.p = 1;
            _context16.n = 2;
            return (0, _communication_react.postPromise)("host", "print_text_area_to_console", {
              "console_text": the_text,
              "user_id": window.user_id,
              "local_id": props.local_id
            }, props.local_id);
          case 2:
            if (callback != null) {
              callback();
            }
            _context16.n = 4;
            break;
          case 3:
            _context16.p = 3;
            _t6 = _context16.v;
            errorDrawerFuncs.addFromError("Error creating text area", _t6);
          case 4:
            return _context16.a(2);
        }
      }, _callee15, null, [[1, 3]]);
    }));
    return _addConsoleText2.apply(this, arguments);
  }
  function am_selected() {
    return selectedPane.amSelected(selectedPane.tab_id, selectedPane.selectedTabIdRef);
  }
  function _addConsoleDivider(_x3) {
    return _addConsoleDivider2.apply(this, arguments);
  }
  function _addConsoleDivider2() {
    _addConsoleDivider2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee16(header_text) {
      var callback,
        _args17 = arguments,
        _t7;
      return _regenerator().w(function (_context17) {
        while (1) switch (_context17.n) {
          case 0:
            callback = _args17.length > 1 && _args17[1] !== undefined ? _args17[1] : null;
            _context17.p = 1;
            _context17.n = 2;
            return (0, _communication_react.postPromise)("host", "print_divider_area_to_console", {
              "header_text": header_text,
              "user_id": window.user_id,
              "local_id": props.local_id
            }, props.local_id);
          case 2:
            if (callback != null) {
              callback();
            }
            _context17.n = 4;
            break;
          case 3:
            _context17.p = 3;
            _t7 = _context17.v;
            errorDrawerFuncs.addFromError("Error creating divider", _t7);
          case 4:
            return _context17.a(2);
        }
      }, _callee16, null, [[1, 3]]);
    }));
    return _addConsoleDivider2.apply(this, arguments);
  }
  var _addBlankDivider = (0, _react.useCallback)(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          if (!(window.in_context && !am_selected())) {
            _context4.n = 1;
            break;
          }
          return _context4.a(2);
        case 1:
          _context4.n = 2;
          return _addConsoleDivider("");
        case 2:
          return _context4.a(2);
      }
    }, _callee4);
  })), []);
  function _getSectionIds(unique_id) {
    var cindex = _consoleItemIndex(unique_id);
    var id_list = [unique_id];
    for (var i = cindex + 1; i < props.console_items.current.length; ++i) {
      var entry = props.console_items.current[i];
      id_list.push(entry.unique_id);
      if (entry.type == "section-end") {
        break;
      }
    }
    return id_list;
  }
  var _deleteSection = (0, _react.useCallback)(/*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(unique_id) {
      var centry, confirm_text, id_list, cindex, new_console_items, _t;
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.n) {
          case 0:
            centry = get_console_item_entry(unique_id);
            confirm_text = "Delete section ".concat(centry.header_text, "?");
            _context5.p = 1;
            _context5.n = 2;
            return dialogFuncs.showModalPromise("ConfirmDialog", {
              title: "Delete Section",
              text_body: confirm_text,
              cancel_text: "do nothing",
              submit_text: "delete",
              handleClose: dialogFuncs.hideModal
            });
          case 2:
            id_list = _getSectionIds(unique_id);
            cindex = _consoleItemIndex(unique_id);
            new_console_items = _toConsumableArray(props.console_items.current);
            new_console_items.splice(cindex, id_list.length);
            _clear_all_selected_items();
            props.dispatch({
              type: "delete_items",
              id_list: id_list
            });
            _context5.n = 4;
            break;
          case 3:
            _context5.p = 3;
            _t = _context5.v;
            if (_t != "canceled") {
              errorDrawerFuncs.addFromError("Error deleting section", _t);
            }
          case 4:
            return _context5.a(2);
        }
      }, _callee5, null, [[1, 3]]);
    }));
    return function (_x4) {
      return _ref4.apply(this, arguments);
    };
  }(), []);
  var _copySection = (0, _react.useCallback)(function () {
    var unique_id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    if (!unique_id) {
      if (props.console_selected_items_ref.current.length != 1) {
        return;
      }
      unique_id = props.console_selected_items_ref.current[0];
      var entry = get_console_item_entry(unique_id);
      if (entry.type != "divider") {
        return;
      }
    }
    var id_list = _getSectionIds(unique_id);
    _copyItems(id_list);
  }, []);
  var _copyCell = (0, _react.useCallback)(function () {
    var unique_id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var id_list;
    if (!unique_id) {
      id_list = _sortSelectedItems();
      if (id_list.length == 0) {
        return;
      }
    } else {
      id_list = [unique_id];
    }
    _copyItems(id_list);
  }, []);
  function _copyAll() {
    var result_dict = {
      "local_id": props.local_id,
      "console_items": props.console_items.current,
      "user_id": window.user_id
    };
    (0, _communication_react.postWithCallback)("host", "copy_console_cells", result_dict, null, null, props.local_id);
  }
  function _copyItems(id_list) {
    var entry_list = [];
    var in_section = false;
    var _iterator = _createForOfIteratorHelper(props.console_items.current),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var entry = _step.value;
        if (in_section) {
          entry.am_selected = false;
          entry_list.push(entry);
          in_section = entry.type != "section-end";
        } else {
          if (id_list.includes(entry.unique_id)) {
            entry.am_selected = false;
            entry_list.push(entry);
            if (entry.type == "divider") {
              in_section = true;
            }
          }
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    var result_dict = {
      "local_id": props.local_id,
      "console_items": entry_list,
      "user_id": window.user_id
    };
    (0, _communication_react.postWithCallback)("host", "copy_console_cells", result_dict, null, null, props.local_id);
  }
  var _pasteCell = (0, _react.useCallback)(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
    var unique_id,
      data,
      _args6 = arguments,
      _t2;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.n) {
        case 0:
          unique_id = _args6.length > 0 && _args6[0] !== undefined ? _args6[0] : null;
          _context6.p = 1;
          _context6.n = 2;
          return (0, _communication_react.postPromise)("host", "get_copied_console_cells", {
            user_id: window.user_id
          }, props.local_id);
        case 2:
          data = _context6.v;
          _addConsoleEntries(data.console_items, true, false, unique_id);
          _context6.n = 4;
          break;
        case 3:
          _context6.p = 3;
          _t2 = _context6.v;
          errorDrawerFuncs.addFromError("Error getting copied cells", _t2);
        case 4:
          return _context6.a(2);
      }
    }, _callee6, null, [[1, 3]]);
  })), []);
  function _addConsoleTextLink() {
    return _addConsoleTextLink2.apply(this, arguments);
  }
  function _addConsoleTextLink2() {
    _addConsoleTextLink2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee17() {
      var callback,
        _args18 = arguments,
        _t8;
      return _regenerator().w(function (_context18) {
        while (1) switch (_context18.n) {
          case 0:
            callback = _args18.length > 0 && _args18[0] !== undefined ? _args18[0] : null;
            _context18.p = 1;
            _context18.n = 2;
            return (0, _communication_react.postPromise)("host", "print_link_area_to_console", {
              "user_id": window.user_id,
              "local_id": props.local_id
            }, props.local_id);
          case 2:
            if (callback) {
              callback();
            }
            _context18.n = 4;
            break;
          case 3:
            _context18.p = 3;
            _t8 = _context18.v;
            errorDrawerFuncs.addFromError("Error creating link", _t8);
          case 4:
            return _context18.a(2);
        }
      }, _callee17, null, [[1, 3]]);
    }));
    return _addConsoleTextLink2.apply(this, arguments);
  }
  function _currently_selected() {
    if (props.console_selected_items_ref.current.length == 0) {
      return null;
    } else {
      return _lodash["default"].last(props.console_selected_items_ref.current);
    }
  }
  var _insertResourceLink = (0, _react.useCallback)(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
    var entry;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.n) {
        case 0:
          if (_currently_selected()) {
            _context7.n = 2;
            break;
          }
          _context7.n = 1;
          return _addConsoleTextLink();
        case 1:
          return _context7.a(2);
        case 2:
          entry = get_console_item_entry(_currently_selected());
          if (!(!entry || entry.type != "text")) {
            _context7.n = 4;
            break;
          }
          _context7.n = 3;
          return _addConsoleTextLink();
        case 3:
          return _context7.a(2);
        case 4:
          _context7.n = 5;
          return _insertLinkInItem(_currently_selected());
        case 5:
          return _context7.a(2);
      }
    }, _callee7);
  })), []);
  function _insertLinkInItem(_x5) {
    return _insertLinkInItem2.apply(this, arguments);
  }
  function _insertLinkInItem2() {
    _insertLinkInItem2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee18(unique_id) {
      var entry, result, new_links, _t9;
      return _regenerator().w(function (_context19) {
        while (1) switch (_context19.n) {
          case 0:
            _context19.p = 0;
            entry = get_console_item_entry(unique_id);
            _context19.n = 1;
            return dialogFuncs.showModalPromise("SelectResourceDialog", {
              cancel_text: "cancel",
              submit_text: "insert link",
              handleClose: dialogFuncs.hideModal
            });
          case 1:
            result = _context19.v;
            new_links = "links" in entry ? _toConsumableArray(entry.links) : [];
            new_links.push({
              res_type: result.type,
              res_name: result.selected_resource
            });
            _setConsoleItemValue(entry.unique_id, "links", new_links);
            _context19.n = 3;
            break;
          case 2:
            _context19.p = 2;
            _t9 = _context19.v;
            errorDrawerFuncs.addFromError("Error inserting link", _t9);
          case 3:
            return _context19.a(2);
        }
      }, _callee18, null, [[0, 2]]);
    }));
    return _insertLinkInItem2.apply(this, arguments);
  }
  function _addCodeArea(the_text) {
    var force_open = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    try {
      (0, _communication_react.postWithCallback)("host", "print_code_area_to_console", {
        console_text: the_text,
        user_id: window.user_id,
        local_id: props.local_id,
        force_open: force_open
      }, null, null, props.local_id);
    } catch (e) {
      errorDrawerFuncs.addFromError("Error creating code cell", e);
    }
  }
  var _resetConsole = (0, _react.useCallback)(function () {
    props.dispatch({
      type: "reset"
    });
    (0, _communication_react.postWithCallback)(props.local_id, "clear_console_namespace", {}, null, null, props.local_id);
  }, []);
  function _stopAll() {
    (0, _communication_react.postWithCallback)(props.local_id, "stop_all_console_code", {}, null, null, props.local_id);
  }
  var _clearConsole = (0, _react.useCallback)(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
    var confirm_text, _t3;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.n) {
        case 0:
          _context8.p = 0;
          confirm_text = "Are you sure that you want to erase everything in this log?";
          _context8.n = 1;
          return dialogFuncs.showModalPromise("ConfirmDialog", {
            title: "Clear entire log",
            text_body: confirm_text,
            cancel_text: "do nothing",
            submit_text: "clear",
            handleClose: dialogFuncs.hideModal
          });
        case 1:
          props.set_console_selected_items([]);
          pushCallback(function () {
            props.dispatch({
              type: "delete_all_items"
            });
          });
          _context8.n = 3;
          break;
        case 2:
          _context8.p = 2;
          _t3 = _context8.v;
          if (_t3 != "canceled") {
            errorDrawerFuncs.addFromError("Error clearing console", _t3);
          }
        case 3:
          return _context8.a(2);
      }
    }, _callee8, null, [[0, 2]]);
  })), []);
  function _togglePseudoLog() {
    set_show_pseudo_log(!show_pseudo_log);
  }
  function _toggleMainLog() {
    set_show_main_log(!show_main_log);
  }
  var _setFocusedItem = (0, _react.useCallback)(function (unique_id) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    set_console_item_with_focus(unique_id);
    if (unique_id) {
      set_console_item_saved_focus(unique_id);
    }
    pushCallback(callback);
  }, []);
  var _zoomConsole = (0, _react.useCallback)(function () {
    props.setMainStateValue("console_is_zoomed", true);
  }, []);
  var _unzoomConsole = (0, _react.useCallback)(function () {
    props.setMainStateValue("console_is_zoomed", false);
  }, []);
  var _expandConsole = (0, _react.useCallback)(function () {
    props.setMainStateValue("console_is_shrunk", false);
  }, []);
  var _shrinkConsole = (0, _react.useCallback)(function () {
    props.setMainStateValue("console_is_shrunk", true);
    if (props.mState.console_is_zoomed) {
      _unzoomConsole();
    }
  }, [props.mState.console_is_zoomed]);
  var _toggleExports = (0, _react.useCallback)(function () {
    props.setMainStateValue("show_exports_pane", !props.mState.show_exports_pane);
  }, [props.mState.show_exports_pane]);
  var _setConsoleItemValue = (0, _react.useCallback)(function (unique_id, field, new_value) {
    var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    props.dispatch({
      type: "change_item_value",
      unique_id: unique_id,
      field: field,
      new_value: new_value
    });
    pushCallback(callback);
  }, []);
  function _multiple_console_item_updates(updates) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    props.dispatch({
      type: "update_items",
      updates: updates
    });
    pushCallback(callback);
  }
  function _clear_all_selected_items() {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    props.set_console_selected_items([]);
    pushCallback(function () {
      props.dispatch({
        type: "clear_all_selected"
      });
    });
    pushCallback(callback);
  }
  function get_console_item_entry(unique_id) {
    return _lodash["default"].cloneDeep(props.console_items.current[_consoleItemIndex(unique_id)]);
  }
  function _dselectOneItem(unique_id) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var updates = {};
    if (props.console_selected_items_ref.current.includes(unique_id)) {
      updates[unique_id] = {
        am_selected: false,
        search_string: null
      };
      _multiple_console_item_updates(updates, function () {
        var narray = _lodash["default"].cloneDeep(props.console_selected_items_ref.current);
        var myIndex = narray.indexOf(unique_id);
        if (myIndex !== -1) {
          narray.splice(myIndex, 1);
        }
        props.set_console_selected_items(narray);
        pushCallback(callback);
      });
    } else {
      pushCallback(callback);
    }
  }
  var _selectConsoleItem = (0, _react.useCallback)(function (unique_id) {
    var event = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var updates = {};
    var shift_down = event != null && event.shiftKey;
    if (!shift_down) {
      var _iterator2 = _createForOfIteratorHelper(props.console_selected_items_ref.current),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var uid = _step2.value;
          if (uid != unique_id) {
            updates[uid] = {
              am_selected: false,
              search_string: null
            };
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      updates[unique_id] = {
        am_selected: true,
        search_string: search_string_ref.current
      };
      _multiple_console_item_updates(updates, function () {
        props.set_console_selected_items([unique_id]);
        pushCallback(callback);
      });
    } else {
      if (props.console_selected_items_ref.current.includes(unique_id)) {
        _dselectOneItem(unique_id);
      } else {
        updates[unique_id] = {
          am_selected: true,
          search_string: search_string_ref.current
        };
        _multiple_console_item_updates(updates, function () {
          var narray = _lodash["default"].cloneDeep(props.console_selected_items_ref.current);
          narray.push(unique_id);
          props.set_console_selected_items(narray);
          pushCallback(callback);
        });
      }
    }
  }, []);
  function _sortSelectedItems() {
    var sitems = _lodash["default"].cloneDeep(props.console_selected_items_ref.current);
    sitems.sort(function (firstEl, secondEl) {
      return _consoleItemIndex(firstEl) < _consoleItemIndex(secondEl) ? -1 : 1;
    });
    return sitems;
  }
  function _consoleItemIndex(unique_id) {
    var console_items = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var counter = 0;
    if (console_items == null) {
      console_items = props.console_items.current;
    }
    var _iterator3 = _createForOfIteratorHelper(console_items),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var entry = _step3.value;
        if (entry.unique_id == unique_id) {
          return counter;
        }
        ++counter;
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    return -1;
  }
  function _moveSection(_ref8, filtered_items) {
    var oldIndex = _ref8.oldIndex,
      newIndex = _ref8.newIndex;
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    if (newIndex > oldIndex) {
      newIndex += 1;
    }
    var move_entry = filtered_items[oldIndex];
    var move_index = _consoleItemIndex(move_entry.unique_id);
    var section_ids = _getSectionIds(move_entry.unique_id);
    var the_section = _lodash["default"].cloneDeep(props.console_items.current.slice(move_index, move_index + section_ids.length));
    props.dispatch({
      type: "delete_items",
      id_list: section_ids
    });
    pushCallback(function () {
      var below_index;
      if (newIndex == 0) {
        below_index = 0;
      } else {
        var trueNewIndex;
        if (newIndex >= filtered_items.length) {
          trueNewIndex = -1;
        } else trueNewIndex = _consoleItemIndex(filtered_items[newIndex].unique_id);
        // noinspection ES6ConvertIndexedForToForOf
        if (trueNewIndex == -1) {
          below_index = props.console_items.current.length;
        } else {
          for (below_index = trueNewIndex; below_index < props.console_items.current.length; ++below_index) {
            if (props.console_items.current[below_index].type == "divider") {
              break;
            }
          }
          if (below_index >= props.console_items.current.length) {
            below_index = props.console_items.current.length;
          }
        }
      }
      props.dispatch({
        type: "add_at_index",
        new_items: the_section,
        insert_index: below_index
      });
      pushCallback(callback);
    });
  }
  function _moveEntryAfterEntry(move_id, above_id) {
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var move_entry = _lodash["default"].cloneDeep(get_console_item_entry(move_id));
    props.dispatch({
      type: "delete_item",
      unique_id: move_id
    });
    pushCallback(function () {
      var target_index;
      if (above_id == null) {
        target_index = 0;
      } else {
        target_index = _consoleItemIndex(above_id) + 1;
      }
      props.dispatch({
        type: "add_at_index",
        insert_index: target_index,
        new_items: [move_entry]
      });
      pushCallback(callback);
    });
  }
  var _resortConsoleItems = (0, _react.useCallback)(function (oldIndex, newIndex) {
    filtered_items = filtered_items_ref.current;
    var callback = _showNonDividers;
    if (oldIndex == newIndex) {
      callback();
      return;
    }
    var move_entry = filtered_items[oldIndex];
    if (move_entry.type == "divider") {
      _moveSection({
        oldIndex: oldIndex,
        newIndex: newIndex
      }, filtered_items, callback);
      return;
    }
    var above_entry;
    if (newIndex == 0) {
      above_entry = null;
    } else {
      if (newIndex > oldIndex) {
        above_entry = filtered_items[newIndex];
      } else {
        above_entry = filtered_items[newIndex - 1];
      }
      if (above_entry.type == "divider" && above_entry.am_shrunk) {
        var section_ids = _getSectionIds(above_entry.unique_id);
        var lastIdInSection = _lodash["default"].last(section_ids);
        _moveEntryAfterEntry(move_entry.unique_id, lastIdInSection, callback);
        return;
      }
    }
    var target_id = above_entry == null ? null : above_entry.unique_id;
    _moveEntryAfterEntry(move_entry.unique_id, target_id, callback);
  }, []);
  var _goToNextCell = (0, _react.useCallback)(/*#__PURE__*/function () {
    var _ref9 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(unique_id) {
      var next_index, _loop, _ret;
      return _regenerator().w(function (_context0) {
        while (1) switch (_context0.n) {
          case 0:
            next_index = _consoleItemIndex(unique_id) + 1;
            _loop = /*#__PURE__*/_regenerator().m(function _loop() {
              var next_id, next_item;
              return _regenerator().w(function (_context9) {
                while (1) switch (_context9.n) {
                  case 0:
                    next_id = props.console_items.current[next_index].unique_id;
                    next_item = props.console_items.current[next_index];
                    if (!(!next_item.am_shrunk && (next_item.type == "code" || next_item.type == "text" && !next_item["show_markdown"]))) {
                      _context9.n = 1;
                      break;
                    }
                    if (!next_item.show_on_filtered) {
                      set_filter_console_items(false);
                      pushCallback(function () {
                        _setConsoleItemValue(next_id, "set_focus", true);
                      });
                    } else {
                      _setConsoleItemValue(next_id, "set_focus", true);
                    }
                    return _context9.a(2, {
                      v: void 0
                    });
                  case 1:
                    next_index += 1;
                  case 2:
                    return _context9.a(2);
                }
              }, _loop);
            });
          case 1:
            if (!(next_index < props.console_items.current.length)) {
              _context0.n = 4;
              break;
            }
            return _context0.d(_regeneratorValues(_loop()), 2);
          case 2:
            _ret = _context0.v;
            if (!_ret) {
              _context0.n = 3;
              break;
            }
            return _context0.a(2, _ret.v);
          case 3:
            _context0.n = 1;
            break;
          case 4:
            _context0.n = 5;
            return _addCodeArea("");
          case 5:
            return _context0.a(2);
        }
      }, _callee9);
    }));
    return function (_x6) {
      return _ref9.apply(this, arguments);
    };
  }(), []);
  function _isDividerSelected() {
    var _iterator4 = _createForOfIteratorHelper(props.console_selected_items_ref.current),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var uid = _step4.value;
        var centry = get_console_item_entry(uid);
        if (centry.type == "divider") {
          return true;
        }
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
    return false;
  }
  function _doDeleteSelected() {
    var in_section = false;
    var to_delete = [];
    var _iterator5 = _createForOfIteratorHelper(props.console_items.current),
      _step5;
    try {
      for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
        var entry = _step5.value;
        if (in_section) {
          to_delete.push(entry.unique_id);
          in_section = entry.type != "section-end";
          continue;
        }
        if (props.console_selected_items_ref.current.includes(entry.unique_id)) {
          to_delete.push(entry.unique_id);
          if (entry.type == "divider") {
            in_section = true;
          }
        }
      }
    } catch (err) {
      _iterator5.e(err);
    } finally {
      _iterator5.f();
    }
    _clear_all_selected_items(function () {
      props.dispatch({
        type: "delete_items",
        id_list: to_delete
      });
    });
  }
  function _deleteSelected() {
    return _deleteSelected2.apply(this, arguments);
  }
  function _deleteSelected2() {
    _deleteSelected2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee19() {
      var confirm_text, _t0;
      return _regenerator().w(function (_context20) {
        while (1) switch (_context20.n) {
          case 0:
            if (!_are_selected()) {
              _context20.n = 4;
              break;
            }
            _context20.p = 1;
            if (!_isDividerSelected()) {
              _context20.n = 2;
              break;
            }
            confirm_text = "The selection includes section dividers. " + "The sections will be completed in their entirety. Do you want to continue";
            _context20.n = 2;
            return dialogFuncs.showModalPromise("ConfirmDialog", {
              title: "Do Delete",
              text_body: confirm_text,
              cancel_text: "do nothing",
              submit_text: "delete",
              handleClose: dialogFuncs.hideModal
            });
          case 2:
            _doDeleteSelected();
            _context20.n = 4;
            break;
          case 3:
            _context20.p = 3;
            _t0 = _context20.v;
            if (_t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error duplicating resource", _t0);
            }
          case 4:
            return _context20.a(2);
        }
      }, _callee19, null, [[1, 3]]);
    }));
    return _deleteSelected2.apply(this, arguments);
  }
  var _closeConsoleItem = (0, _react.useCallback)(/*#__PURE__*/function () {
    var _ref0 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(unique_id) {
      var centry;
      return _regenerator().w(function (_context1) {
        while (1) switch (_context1.n) {
          case 0:
            centry = get_console_item_entry(unique_id);
            if (!(centry.type == "divider")) {
              _context1.n = 2;
              break;
            }
            _context1.n = 1;
            return _deleteSection(unique_id);
          case 1:
            _context1.n = 3;
            break;
          case 2:
            _dselectOneItem(unique_id, function () {
              props.dispatch({
                type: "delete_item",
                unique_id: unique_id
              });
            });
          case 3:
            return _context1.a(2);
        }
      }, _callee0);
    }));
    return function (_x7) {
      return _ref0.apply(this, arguments);
    };
  }(), []);
  function _getNextEndIndex(start_id) {
    var start_index = _consoleItemIndex(start_id);
    var _iterator6 = _createForOfIteratorHelper(props.console_items.current.slice(start_index)),
      _step6;
    try {
      for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
        var entry = _step6.value;
        if (entry.type == "section-end") {
          return _consoleItemIndex(entry.unique_id);
        }
      }
    } catch (err) {
      _iterator6.e(err);
    } finally {
      _iterator6.f();
    }
    return props.console_items.current.length;
  }
  function _isInSection(unique_id) {
    var idx = _consoleItemIndex(unique_id);
    var _iterator7 = _createForOfIteratorHelper(props.console_items.current.slice(idx + 1)),
      _step7;
    try {
      for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
        var entry = _step7.value;
        if (entry.type == "divider") {
          return false;
        } else {
          if (entry.type == "section-end") {
            return true;
          }
        }
      }
    } catch (err) {
      _iterator7.e(err);
    } finally {
      _iterator7.f();
    }
    return false;
  }
  function _addConsoleEntries(new_entries) {
    var force_open = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var set_focus = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var unique_id = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var callback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    _lodash["default"].last(new_entries).set_focus = set_focus;
    var inserting_divider = false;
    var _iterator8 = _createForOfIteratorHelper(new_entries),
      _step8;
    try {
      for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
        var entry = _step8.value;
        if (entry.type == "divider") {
          inserting_divider = true;
        }
      }
    } catch (err) {
      _iterator8.e(err);
    } finally {
      _iterator8.f();
    }
    var last_id = _lodash["default"].last(new_entries).unique_id;
    var insert_index;
    if (unique_id) {
      if (inserting_divider && _isInSection(unique_id)) {
        insert_index = _getNextEndIndex(unique_id) + 1;
      } else {
        insert_index = _consoleItemIndex(unique_id) + 1;
      }
    } else if (props.console_items.current.length == 0 || props.console_selected_items_ref.current.length == 0) {
      insert_index = props.console_items.current.length;
    } else {
      var current_selected_id = _currently_selected();
      if (inserting_divider && _isInSection(current_selected_id)) {
        insert_index = _getNextEndIndex(current_selected_id) + 1;
      } else {
        var selected_item = get_console_item_entry(current_selected_id);
        if (selected_item.type == "divider") {
          if (selected_item.am_shrunk) {
            insert_index = _getNextEndIndex(current_selected_id) + 1;
          } else {
            insert_index = _consoleItemIndex(current_selected_id) + 1;
          }
        } else {
          insert_index = _consoleItemIndex(current_selected_id) + 1;
        }
      }
    }
    props.dispatch({
      type: "add_at_index",
      insert_index: insert_index,
      new_items: new_entries
    });
    pushCallback(function () {
      if (force_open) {
        props.setMainStateValue("console_is_shrunk", false, function () {
          _selectConsoleItem(last_id, null, callback);
        });
      } else {
        _selectConsoleItem(last_id, null, callback);
      }
    });
  }
  function _addConsoleEntry(new_entry) {
    var force_open = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var set_focus = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var unique_id = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var callback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    _addConsoleEntries([new_entry], force_open, set_focus, unique_id, callback);
  }
  function _startSpinner(unique_id) {
    var update_dict = {
      show_spinner: true,
      running: true
    };
    var updates = {};
    updates[unique_id] = update_dict;
    props.dispatch({
      type: "update_items",
      updates: updates
    });
  }
  function _stopConsoleSpinner(unique_id) {
    var execution_count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var update_dict = {
      show_spinner: false,
      running: false
    };
    if ("execution_count" != null) {
      update_dict.execution_count = execution_count;
    }
    var updates = {};
    updates[unique_id] = update_dict;
    props.dispatch({
      type: "update_items",
      updates: updates
    });
  }
  function _appendWidgetToConsoleItem(data) {
    var vdict = {
      widgetId: data["widgetId"],
      widgetKind: data["widgetKind"],
      widgetData: data["widgetData"]
    };
    props.dispatch({
      type: "replace_code_output_row",
      unique_id: data.console_id,
      row: data.counter,
      new_value: vdict
    });
  }
  function _appendConsoleItemOutput(data) {
    var new_value;
    if (typeof data["result_text"] == "string") {
      new_value = {
        widgetId: (0, _utilities_react.guid)(),
        widgetKind: "rawHtml",
        widgetData: {
          value: data["result_text"]
        }
      };
    } else {
      new_value = data["result_text"];
    }
    props.dispatch({
      type: "replace_code_output_row",
      unique_id: data.console_id,
      row: data.counter,
      new_value: new_value
    });
  }
  function _setConsoleItemOutput(data) {
    var current = {};
    current[-1] = {
      widgetId: (0, _utilities_react.guid)(),
      widgetKind: "text",
      widgetData: data["result_text"]
    };
    props.dispatch({
      type: "change_code_output",
      unique_id: data.console_id,
      new_value: current
    });
  }
  function _glif_text(show_glif_text, txt) {
    if (show_glif_text) {
      return txt;
    }
    return null;
  }
  function _clickConsoleBody(e) {
    _clear_all_selected_items();
    e.stopPropagation();
  }
  function _handleSearchFieldChange(event) {
    if (search_helper_text) {
      set_search_helper_text(null);
      pushCallback(function () {
        _setSearchString(event.target.value);
      });
    } else {
      _setSearchString(event.target.value);
    }
  }
  function _are_selected() {
    return props.console_selected_items_ref.current.length > 0;
  }
  function _setSearchString(val) {
    var nval = val == "" ? null : val;
    var updates = {};
    set_search_string(nval);
    pushCallback(function () {
      if (_are_selected()) {
        var _iterator9 = _createForOfIteratorHelper(props.console_selected_items_ref.current),
          _step9;
        try {
          for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
            var uid = _step9.value;
            updates[uid] = {
              search_string: search_string_ref.current
            };
          }
        } catch (err) {
          _iterator9.e(err);
        } finally {
          _iterator9.f();
        }
        _multiple_console_item_updates(updates);
      }
    });
  }
  function _handleUnFilter() {
    set_filter_console_items(false);
    set_search_helper_text(null);
    pushCallback(function () {
      _setSearchString(null);
    });
  }
  function _handleFilter() {
    var updates = {};
    var _iterator0 = _createForOfIteratorHelper(props.console_items.current),
      _step0;
    try {
      for (_iterator0.s(); !(_step0 = _iterator0.n()).done;) {
        var entry = _step0.value;
        if (entry.type == "code" || entry.type == "text") {
          updates[entry.unique_id] = {
            show_on_filtered: entry.console_text.toLowerCase().includes(search_string_ref.current.toLowerCase())
          };
        } else if (entry.type == "divider") {
          updates[entry.unique_id] = {
            show_on_filtered: true
          };
        }
      }
    } catch (err) {
      _iterator0.e(err);
    } finally {
      _iterator0.f();
    }
    _multiple_console_item_updates(updates, function () {
      set_filter_console_items(true);
    });
  }
  function _searchNext() {
    var current_index;
    if (!_are_selected()) {
      current_index = 0;
    } else {
      current_index = _consoleItemIndex(_currently_selected()) + 1;
    }
    var _loop2 = function _loop2() {
        var entry = props.console_items.current[current_index];
        if (entry.type == "code" || entry.type == "text") {
          if (_selectIfMatching(entry, "console_text", function () {
            if (entry.type == "text") {
              _setConsoleItemValue(entry.unique_id, "show_markdown", false);
            }
          })) {
            set_search_helper_text(null);
            return {
              v: void 0
            };
          }
        }
        current_index += 1;
      },
      _ret2;
    while (current_index < props.console_items.current.length) {
      _ret2 = _loop2();
      if (_ret2) return _ret2.v;
    }
    set_search_helper_text("No more results");
  }
  function _selectIfMatching(entry, text_field) {
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    if (entry[text_field].toLowerCase().includes(search_string_ref.current.toLowerCase())) {
      if (entry.am_shrunk) {
        _setConsoleItemValue(entry.unique_id, "am_shrunk", false, function () {
          _selectConsoleItem(entry.unique_id, null, callback);
        });
      } else {
        _selectConsoleItem(entry.unique_id, null, callback);
      }
      return true;
    }
    return false;
  }
  function _searchPrevious() {
    var current_index;
    if (!_are_selected()) {
      current_index = props.console_items.current.length - 1;
    } else {
      current_index = _consoleItemIndex(_currently_selected()) - 1;
    }
    var _loop3 = function _loop3() {
        var entry = props.console_items.current[current_index];
        if (entry.type == "code" || entry.type == "text") {
          if (_selectIfMatching(entry, "console_text", function () {
            if (entry.type == "text") {
              _setConsoleItemValue(entry.unique_id, "show_markdown", false);
            }
          })) {
            set_search_helper_text(null);
            return {
              v: void 0
            };
          }
        }
        current_index -= 1;
      },
      _ret3;
    while (current_index >= 0) {
      _ret3 = _loop3();
      if (_ret3) return _ret3.v;
    }
    set_search_helper_text("No more results");
  }
  var menu_specs = (0, _react.useMemo)(function () {
    var ms = {
      Insert: [{
        name_text: "Text Cell",
        icon_name: "new-text-box",
        click_handler: _addBlankText,
        key_bindings: ["Ctrl+T"]
      }, {
        name_text: "Code Cell",
        icon_name: "code",
        click_handler: _addBlankCode,
        key_bindings: ["Ctrl+C"]
      }, {
        name_text: "Section",
        icon_name: "header",
        click_handler: _addBlankDivider
      }, {
        name_text: "Resource Link",
        icon_name: "link",
        click_handler: _insertResourceLink
      }],
      Edit: [{
        name_text: "Copy All",
        icon_name: "duplicate",
        click_handler: function click_handler() {
          _copyAll();
        }
      }, {
        name_text: "Copy Selected",
        icon_name: "duplicate",
        click_handler: function click_handler() {
          _copyCell();
        }
      }, {
        name_text: "Paste Cells",
        icon_name: "clipboard",
        click_handler: function () {
          var _click_handler = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1() {
            return _regenerator().w(function (_context10) {
              while (1) switch (_context10.n) {
                case 0:
                  _context10.n = 1;
                  return _pasteCell();
                case 1:
                  return _context10.a(2);
              }
            }, _callee1);
          }));
          function click_handler() {
            return _click_handler.apply(this, arguments);
          }
          return click_handler;
        }()
      }, {
        name_text: "Paste Image",
        icon_name: "clipboard",
        click_handler: function () {
          var _click_handler2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10() {
            return _regenerator().w(function (_context11) {
              while (1) switch (_context11.n) {
                case 0:
                  _context11.n = 1;
                  return _pasteImage();
                case 1:
                  return _context11.a(2);
              }
            }, _callee10);
          }));
          function click_handler() {
            return _click_handler2.apply(this, arguments);
          }
          return click_handler;
        }()
      }, {
        name_text: "Delete Selected",
        icon_name: "trash",
        click_handler: function () {
          var _click_handler3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11() {
            return _regenerator().w(function (_context12) {
              while (1) switch (_context12.n) {
                case 0:
                  _context12.n = 1;
                  return _deleteSelected();
                case 1:
                  return _context12.a(2);
              }
            }, _callee11);
          }));
          function click_handler() {
            return _click_handler3.apply(this, arguments);
          }
          return click_handler;
        }()
      }, {
        name_text: "divider2",
        icon_name: null,
        click_handler: "divider"
      }, {
        name_text: "Clear Log",
        icon_name: "trash",
        click_handler: _clearConsole
      }],
      Execute: [{
        name_text: "Run Selected",
        icon_name: "play",
        click_handler: _runSelected,
        key_bindings: ["Ctrl+Enter", "Command+Enter"]
      }, {
        name_text: "Stop All",
        icon_name: "stop",
        click_handler: _stopAll
      }, {
        name_text: "Reset All",
        icon_name: "reset",
        click_handler: _resetConsole
      }]
    };
    if (!(show_pseudo_log || show_main_log)) {
      ms["Consoles"] = [{
        name_text: "Show Log Console",
        icon_name: "console",
        click_handler: _togglePseudoLog
      }, {
        name_text: "Show Main Console",
        icon_name: "console",
        click_handler: _toggleMainLog
      }];
    } else {
      ms["Consoles"] = [{
        name_text: "Hide Console",
        icon_name: "console",
        click_handler: show_main_log ? _toggleMainLog : _togglePseudoLog
      }];
    }
    return ms;
  }, [show_main_log, show_pseudo_log]);
  function disabled_items() {
    var items = [];
    if (!_are_selected() || props.console_selected_items_ref.current.length != 1) {
      items.push("Run Selected");
      items.push("Copy Section");
      items.push("Delete Section");
    }
    if (props.console_selected_items_ref.current.length == 1) {
      var unique_id = props.console_selected_items_ref.current[0];
      var entry = get_console_item_entry(unique_id);
      if (!entry) {
        return [];
      }
      if (entry.type != "divider") {
        items.push("Copy Section");
        items.push("Delete Section");
      }
    }
    if (!_are_selected()) {
      items.push("Copy Selected");
      items.push("Delete Selected");
    }
    return items;
  }
  function _clearCodeOutput(unique_id) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    _setConsoleItemValue(unique_id, "output_dict", {}, callback);
  }
  function _runSelected() {
    if (window.in_context && !am_selected()) {
      return;
    }
    if (_are_selected() && props.console_selected_items_ref.current.length == 1) {
      var entry = get_console_item_entry(_currently_selected());
      if (entry.type == "code") {
        _runCodeItem(_currently_selected());
      } else if (entry.type == "text") {
        _showTextItemMarkdown(_currently_selected());
      }
    }
  }
  var _runCodeItem = (0, _react.useCallback)(function (unique_id) {
    var go_to_next = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    _clearCodeOutput(unique_id, /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12() {
      var entry;
      return _regenerator().w(function (_context13) {
        while (1) switch (_context13.n) {
          case 0:
            _startSpinner(unique_id);
            entry = get_console_item_entry(unique_id);
            _context13.n = 1;
            return (0, _communication_react.postPromise)(props.local_id, "exec_console_code", {
              "the_code": entry.console_text,
              "console_id": unique_id
            }, props.local_id);
          case 1:
            if (!go_to_next) {
              _context13.n = 2;
              break;
            }
            _context13.n = 2;
            return _goToNextCell(unique_id);
          case 2:
            return _context13.a(2);
        }
      }, _callee12);
    })));
  }, []);
  function _showTextItemMarkdown(unique_id) {
    _setConsoleItemValue(unique_id, "show_markdown", true);
  }
  function _hideNonDividers() {
    $(".in-section:not(.divider-log-panel)").css({
      opacity: "10%"
    });
  }
  function _showNonDividers() {
    $(".in-section:not(.divider-log-panel)").css({
      opacity: "100%"
    });
  }
  var _sortStart = (0, _react.useCallback)(function (_ref10) {
    var draggableId = _ref10.draggableId;
    var idx = _consoleItemIndex(draggableId);
    var entry = props.console_items.current[idx];
    if (entry.type == "divider") {
      _hideNonDividers();
    }
  }, []);
  function superItemMaker(passDowns) {
    return /*#__PURE__*/(0, _react.memo)(function (item_props) {
      return /*#__PURE__*/_react["default"].createElement(SuperItem, _extends({}, item_props, passDowns));
    });
  }
  var TailoredSuperItem = (0, _react.useMemo)(function () {
    return superItemMaker({
      setConsoleItemValue: _setConsoleItemValue,
      selectConsoleItem: _selectConsoleItem,
      runCodeItem: _runCodeItem,
      handleDelete: _closeConsoleItem,
      goToNextCell: _goToNextCell,
      setFocus: _setFocusedItem,
      addNewTextItem: _addBlankText,
      addNewCodeItem: _addBlankCode,
      addNewDivider: _addBlankDivider,
      copyCell: _copyCell,
      pasteCell: _pasteCell,
      copySection: _copySection,
      deleteSection: _deleteSection,
      insertResourceLink: _insertResourceLink,
      pseudo_tile_id: pseudo_tile_id,
      widgetHomesRef: widgetHomesRef,
      dispatch: props.dispatch,
      handleCreateViewer: props.handleCreateViewer
    });
  }, []);
  var console_class = props.mState.console_is_shrunk ? "am-shrunk" : "not-shrunk";
  if (props.mState.console_is_zoomed) {
    console_class = "am-zoomed";
  }
  console_class = "console-panel ".concat(console_class);
  var outer_style = {
    display: 'flex',
    flexDirection: 'column',
    flex: "1 1 0",
    paddingLeft: 0,
    position: "relative",
    margin: 0
  };
  if (!props.mState.console_is_shrunk) {
    outer_style.height = "100%";
  }
  var header_style = (0, _react.useMemo)(function () {
    var newStyle = {};
    if (!props.shrinkable) {
      newStyle["paddingLeft"] = 10;
    }
    return newStyle;
  }, []);
  var show_glif_text = outer_style.width > 800;
  var in_closed_section = false;
  var in_section = false;
  var filtered_items = props.console_items.current.filter(function (entry) {
    if (entry.type == "divider") {
      in_section = true;
      in_closed_section = entry.am_shrunk;
      return true;
    } else if (entry.type == "section-end") {
      entry.in_section = true;
      var was_in_closed_section = in_closed_section;
      in_closed_section = false;
      in_section = false;
      return !was_in_closed_section;
    } else if (!in_closed_section) {
      entry.in_section = in_section;
      return true;
    }
  });
  if (filter_console_items) {
    filtered_items = filtered_items.filter(function (entry) {
      return entry.show_on_filtered;
    });
  }
  filtered_items_ref.current = filtered_items;
  var suggestionGlyphs = [];
  if (show_pseudo_log || show_main_log) {
    suggestionGlyphs.push({
      intent: "primary",
      icon: "console",
      handleClick: show_main_log ? _toggleMainLog : _togglePseudoLog
    });
  }
  var extraProps = (0, _react.useMemo)(function () {
    return {
      local_id: props.local_id
    };
  });
  return /*#__PURE__*/_react["default"].createElement(_core.Card, {
    className: console_class,
    elevation: props.mState.console_is_shrunk ? 0 : 2,
    style: outer_style,
    tabIndex: "0",
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-column justify-content-around "
  }, /*#__PURE__*/_react["default"].createElement("div", {
    ref: header_ref,
    style: header_style,
    className: "console-heading d-flex flex-row justify-content-between"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "console-header-left d-flex flex-row"
  }, props.mState.console_is_shrunk && props.shrinkable && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _expandConsole,
    style: SHRINK_EXPAND_GLYPH_BUTTON_STYLE,
    icon: "chevron-right"
  }), !props.mState.console_is_shrunk && props.shrinkable && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _shrinkConsole,
    style: SHRINK_EXPAND_GLYPH_BUTTON_STYLE,
    icon: "chevron-down"
  }), /*#__PURE__*/_react["default"].createElement(_assistant.AssistantContext.Provider, {
    value: null
  }, /*#__PURE__*/_react["default"].createElement(_menu_utilities.TacticMenubar, {
    menu_specs: menu_specs,
    disabled_items: disabled_items(),
    suggestionGlyphs: suggestionGlyphs,
    showRefresh: false,
    showClose: false,
    showIconBar: false,
    refreshTab: props.refreshTab,
    closeTab: null,
    controlled: window.in_context
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    id: "console-header-right",
    className: "d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    extra_glyph_text: _glif_text(show_glif_text, "exports"),
    tooltip: "Show export browser",
    size: "small",
    className: "show-exports-but",
    style: SHOW_EXPORTS_GLYPH_BUTTON_STYLE2,
    handleClick: _toggleExports,
    icon: "variable"
  }), !props.mState.console_is_zoomed && props.zoomable && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _zoomConsole,
    icon: "maximize"
  }), props.mState.console_is_zoomed && props.zoomable && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _unzoomConsole,
    icon: "minimize"
  })))), !props.mState.console_is_shrunk && !show_pseudo_log && !show_main_log && /*#__PURE__*/_react["default"].createElement(_search_form.FilterSearchForm, {
    search_string: search_string_ref.current,
    handleSearchFieldChange: _handleSearchFieldChange,
    handleFilter: _handleFilter,
    handleUnFilter: _handleUnFilter,
    searchNext: _searchNext,
    searchPrevious: _searchPrevious,
    outer_style: {
      marginRight: 50,
      marginTop: 10,
      justifyContent: 'flex-end'
    },
    marginLeft: 0,
    marginRight: FILTER_SEARCH_RIGHT_MARGIN,
    search_helper_text: search_helper_text
  }), !props.mState.console_is_shrunk && show_main_log && /*#__PURE__*/_react["default"].createElement(_searchable_console.SearchableConsole, {
    local_id: props.local_id,
    container_id: props.local_id,
    outer_style: searchable_console_style,
    showCommandField: false
  }), !props.mState.console_is_shrunk && show_pseudo_log && /*#__PURE__*/_react["default"].createElement(_searchable_console.SearchableConsole, {
    local_id: props.local_id,
    container_id: pseudo_tile_id,
    outer_style: searchable_console_style,
    showCommandField: true
  }), !props.mState.console_is_shrunk && !show_pseudo_log && !show_main_log && /*#__PURE__*/_react["default"].createElement("div", {
    className: "console contingent-scroll",
    onClick: _clickConsoleBody,
    style: {
      flexGrow: 1,
      width: "100%",
      position: "relative",
      overflow: "auto"
    }
  }, /*#__PURE__*/_react["default"].createElement(_sortable_container.SortableComponent, {
    className: "console-items-div",
    direction: "vertical",
    style: empty_style,
    local_id: props.local_id,
    ElementComponent: TailoredSuperItem,
    key_field_name: "unique_id",
    item_list: filtered_items,
    helperClass: settingsContext.isDark() ? "bp6-dark" : "light-theme",
    handle: ".console-sorter",
    onBeforeCapture: _sortStart,
    onDragEnd: _resortConsoleItems,
    useDragHandle: false,
    axis: "y",
    tsocket: props.tsocket,
    extraProps: extraProps
  }), /*#__PURE__*/_react["default"].createElement("div", {
    id: "padding-div",
    style: {
      height: 500
    }
  })));
}
exports.ConsoleComponent = ConsoleComponent = /*#__PURE__*/(0, _react.memo)(ConsoleComponent);
function Shandle(props) {
  return /*#__PURE__*/_react["default"].createElement("span", props.dragHandleProps, /*#__PURE__*/_react["default"].createElement(_core.Icon, _extends({
    icon: "drag-handle-vertical"
  }, props.dragHandleProps, {
    style: sHandleStyle,
    size: 20,
    className: "console-sorter"
  })));
}
function SuperItem(props) {
  switch (props.type) {
    case "text":
      return /*#__PURE__*/_react["default"].createElement(ConsoleTextItem, props);
    case "code":
      return /*#__PURE__*/_react["default"].createElement(ConsoleCodeItem, props);
    case "fixed":
      return /*#__PURE__*/_react["default"].createElement(LogItem, props);
    case "figure":
      return /*#__PURE__*/_react["default"].createElement(BlobItem, props);
    case "divider":
      return /*#__PURE__*/_react["default"].createElement(DividerItem, props);
    case "section-end":
      return /*#__PURE__*/_react["default"].createElement(SectionEndItem, props);
    default:
      return null;
  }
}
SuperItem = /*#__PURE__*/(0, _react.memo)(SuperItem);
function DividerItem(props) {
  var _toggleShrink = (0, _react.useCallback)(function () {
    props.setConsoleItemValue(props.unique_id, "am_shrunk", !props.am_shrunk);
  }, [props.am_shrunk]);
  var _deleteMe = (0, _react.useCallback)(function () {
    props.handleDelete(props.unique_id);
  }, []);
  var _handleHeaderTextChange = (0, _react.useCallback)(function (value) {
    props.setConsoleItemValue(props.unique_id, "header_text", value);
  }, []);
  function _copyMe() {
    props.copyCell(props.unique_id);
  }
  function _pasteCell() {
    props.pasteCell(props.unique_id);
  }
  function _selectMe() {
    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    props.selectConsoleItem(props.unique_id, e, callback);
  }
  function _addBlankText() {
    _selectMe(null, function () {
      props.addNewTextItem();
    });
  }
  function _addBlankDivider() {
    _selectMe(null, function () {
      props.addNewDivider();
    });
  }
  function _addBlankCode() {
    _selectMe(null, function () {
      props.addNewCodeItem();
    });
  }
  var contextMenu = (0, _react.useMemo)(function () {
    // return a single element, or nothing to use default browser behavior
    return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "duplicate",
      onClick: _copyMe,
      text: "Copy"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "clipboard",
      onClick: _pasteCell,
      text: "Paste Cells"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "new-text-box",
      onClick: _addBlankText,
      text: "New Text Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "code",
      onClick: _addBlankCode,
      text: "New Code Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "header",
      onClick: _addBlankDivider,
      text: "New Section"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "trash",
      onClick: _deleteMe,
      intent: "danger",
      text: "Delete Section"
    }));
  }, []);
  function _consoleItemClick(e) {
    _selectMe(e);
    e.stopPropagation();
  }
  var panel_class = props["am_shrunk"] ? "log-panel in-section divider-log-panel log-panel-invisible fixed-log-panel" : "log-panel divider-log-panel log-panel-visible fixed-log-panel";
  if (props.am_selected) {
    panel_class += " selected";
  }
  if (props["is_error"]) {
    panel_class += " error-log-panel";
  }
  return /*#__PURE__*/_react["default"].createElement(_core.ContextMenu, {
    content: contextMenu
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: panel_class + " d-flex flex-row",
    onClick: _consoleItemClick,
    id: props.unique_id,
    style: MB10_STYLE
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div shrink-expand-div d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(Shandle, {
    dragHandleProps: props.dragHandleProps
  }), !props["am_shrunk"] && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    icon: "chevron-down",
    handleClick: _toggleShrink
  }), props["am_shrunk"] && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    icon: "chevron-right",
    style: GLYPH_BUTTON_STYLE5,
    handleClick: _toggleShrink
  })), /*#__PURE__*/_react["default"].createElement(_core.EditableText, {
    value: props.header_text,
    onChange: _handleHeaderTextChange,
    style: {
      flex: "1 1 0",
      "overflow": "auto"
    },
    className: "console-divider-text"
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _deleteMe,
    intent: "danger",
    tooltip: "Delete this item",
    style: GLYPH_BUTTON_STYLE3,
    icon: "trash"
  }))));
}
DividerItem = /*#__PURE__*/(0, _react.memo)(DividerItem);
function SectionEndItem(props) {
  function _pasteCell() {
    props.pasteCell(props.unique_id);
  }
  function _selectMe() {
    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    props.selectConsoleItem(props.unique_id, e, callback);
  }
  function _addBlankText() {
    _selectMe(null, function () {
      props.addNewTextItem();
    });
  }
  function _addBlankDivider() {
    _selectMe(null, function () {
      props.addNewDivider();
    });
  }
  function _addBlankCode() {
    _selectMe(null, function () {
      props.addNewCodeItem();
    });
  }
  var contextMenu = (0, _react.useMemo)(function () {
    // return a single element, or nothing to use default browser behavior
    return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "clipboard",
      onClick: _pasteCell,
      text: "Paste Cells"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "new-text-box",
      onClick: _addBlankText,
      text: "New Text Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "code",
      onClick: _addBlankCode,
      text: "New Code Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "header",
      onClick: _addBlankDivider,
      text: "New Section"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null));
  }, []);
  var _consoleItemClick = (0, _react.useCallback)(function (e) {
    _selectMe(e);
    e.stopPropagation();
  }, []);
  var panel_class = "log-panel in-section section-end-log-panel log-panel-visible fixed-log-panel";
  if (props.am_selected) {
    panel_class += " selected";
  }
  var line_style = {
    marginLeft: 65,
    marginRight: 85,
    marginTop: 10,
    borderBottomWidth: 2
  };
  return /*#__PURE__*/_react["default"].createElement(_core.ContextMenu, {
    content: contextMenu
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: panel_class + " d-flex flex-row",
    onClick: _consoleItemClick,
    id: props.unique_id,
    style: MB10_STYLE
  }, /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, {
    variant: "minimal",
    vertical: true,
    style: {
      width: "100%"
    }
  }, /*#__PURE__*/_react["default"].createElement("span", props.dragHandleProps), /*#__PURE__*/_react["default"].createElement(_core.Divider, {
    style: line_style
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div d-flex flex-row"
  })));
}
SectionEndItem = /*#__PURE__*/(0, _react.memo)(SectionEndItem);
function LogItem(props) {
  var last_output_text = (0, _react.useRef)("");
  (0, _react.useEffect)(function () {
    executeEmbeddedScripts();
    // makeTablesSortable()
  });
  var _toggleShrink = (0, _react.useCallback)(function () {
    props.setConsoleItemValue(props.unique_id, "am_shrunk", !props.am_shrunk);
  }, [props.am_shrunk]);
  var _deleteMe = (0, _react.useCallback)(function () {
    props.handleDelete(props.unique_id);
  }, []);
  var _handleSummaryTextChange = (0, _react.useCallback)(function (value) {
    props.setConsoleItemValue(props.unique_id, "summary_text", value);
  }, []);
  function executeEmbeddedScripts() {
    if (props.output_text != last_output_text.current) {
      // to avoid doubles of bokeh images
      last_output_text.current = props.output_text;
      var scripts = $("#" + props.unique_id + " .log-code-output script").toArray();
      var _iterator10 = _createForOfIteratorHelper(scripts),
        _step10;
      try {
        for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
          var script = _step10.value;
          try {
            window.eval(script.text);
          } catch (e) {}
        }
      } catch (err) {
        _iterator10.e(err);
      } finally {
        _iterator10.f();
      }
    }
  }

  // function makeTablesSortable() {
  //     let tables = $("#" + props.unique_id + " table.sortable").toArray();
  //     for (let table of tables) {
  //         sorttable.makeSortable(table)
  //     }
  // }

  function _copyMe() {
    props.copyCell(props.unique_id);
  }
  function _pasteCell() {
    props.pasteCell(props.unique_id);
  }
  function _selectMe() {
    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    props.selectConsoleItem(props.unique_id, e, callback);
  }
  function _addBlankText() {
    _selectMe(null, function () {
      props.addNewTextItem();
    });
  }
  function _addBlankDivider() {
    _selectMe(null, function () {
      props.addNewDivider();
    });
  }
  function _addBlankCode() {
    _selectMe(null, function () {
      props.addNewCodeItem();
    });
  }
  function renderContextMenu() {
    // return a single element, or nothing to use default browser behavior
    return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "duplicate",
      onClick: _copyMe,
      text: "Copy Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "clipboard",
      onClick: _pasteCell,
      text: "Paste Cells"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "new-text-box",
      onClick: _addBlankText,
      text: "New Text Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "code",
      onClick: _addBlankCode,
      text: "New Code Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "header",
      onClick: _addBlankDivider,
      text: "New Section"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "trash",
      onClick: _deleteMe,
      intent: "danger",
      text: "Delete Cell"
    }));
  }
  function _consoleItemClick(e) {
    _selectMe(e);
    e.stopPropagation();
  }
  var panel_class = props.am_shrunk ? "log-panel log-panel-invisible fixed-log-panel" : "log-panel log-panel-visible fixed-log-panel";
  // let converted_dict = {__html: props.console_text};

  if (props.in_section) {
    panel_class += " in-section";
  }
  if (props.am_selected) {
    panel_class += " selected";
  }
  if (props["is_error"]) {
    panel_class += " error-log-panel";
  }
  var outputWidgets = props.console_text.map(function (w) {
    var widgetKind = w["widgetKind"];
    var widgetId = w["widgetId"];
    var widgetData = w["widgetData"];
    var the_widget;
    if (widgetKind in _widgets.widgetDict) {
      var WidgetComponent = _widgets.widgetDict[widgetKind];
      the_widget = /*#__PURE__*/_react["default"].createElement("div", {
        className: "log-code-output  log-item-output",
        style: {
          paddingBottom: 5
        },
        key: widgetId
      }, /*#__PURE__*/_react["default"].createElement(WidgetComponent, {
        key: widgetId,
        widgetId: widgetId,
        local_id: props.local_id,
        console_id: props.unique_id,
        dispatch: props.dispatch,
        widgetDict: _widgets.widgetDict,
        widgetData: widgetData,
        tsocket: props.tsocket
      }));
    } else {
      var _WidgetComponent = _widgets.widgetDict["text"];
      the_widget = /*#__PURE__*/_react["default"].createElement("div", {
        className: "log-code-output log-item-output",
        style: {
          paddingBottom: 5
        },
        key: widgetId
      }, /*#__PURE__*/_react["default"].createElement(_WidgetComponent, {
        key: widgetId,
        widgetId: widgetId,
        local_id: props.local_id,
        console_id: props.unique_id,
        dispatch: props.dispatch,
        widgetData: "Widget kind not found ".concat(widgetId, ", ").concat(widgetKind, " ").concat(widgetData)
      }));
    }
    props.widgetHomesRef.current[widgetId] = props.unique_id;
    return the_widget;
  });
  return /*#__PURE__*/_react["default"].createElement(_core.ContextMenu, {
    content: renderContextMenu()
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: panel_class + " d-flex flex-row",
    onClick: _consoleItemClick,
    id: props.unique_id,
    style: MB10_STYLE
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div shrink-expand-div d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(Shandle, {
    dragHandleProps: props.dragHandleProps
  }), !props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    icon: "chevron-down",
    handleClick: _toggleShrink
  }), props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    icon: "chevron-right",
    style: GLYPH_BUTTON_STYLE5,
    handleClick: _toggleShrink
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-column",
    style: {
      flex: "1 1 0",
      minWidth: 0,
      overflow: "auto"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "log-panel-body d-flex flex-row"
  }, props.am_shrunk && /*#__PURE__*/_react["default"].createElement("div", {
    className: "body-shrunk-style"
  }, /*#__PURE__*/_react["default"].createElement(_core.EditableText, {
    value: props.summary_text,
    onChange: _handleSummaryTextChange,
    className: "log-panel-summary"
  })), !props.am_shrunk && outputWidgets && outputWidgets.length > 0 && /*#__PURE__*/_react["default"].createElement("div", {
    className: "body-style",
    style: {}
  }, outputWidgets), /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _deleteMe,
    tooltip: "Delete this item",
    style: GlYPH_BUTTON_STYLE4,
    icon: "trash"
  }))))));
}
LogItem = /*#__PURE__*/(0, _react.memo)(LogItem);
function BlobItem(props) {
  var last_output_text = (0, _react.useRef)("");
  (0, _react.useEffect)(function () {
    executeEmbeddedScripts();
    // makeTablesSortable()
  });
  var _toggleShrink = (0, _react.useCallback)(function () {
    props.setConsoleItemValue(props.unique_id, "am_shrunk", !props.am_shrunk);
  }, [props.am_shrunk]);
  var _deleteMe = (0, _react.useCallback)(function () {
    props.handleDelete(props.unique_id);
  }, []);
  var _handleSummaryTextChange = (0, _react.useCallback)(function (value) {
    props.setConsoleItemValue(props.unique_id, "summary_text", value);
  }, []);
  function executeEmbeddedScripts() {
    if (props.output_text != last_output_text.current) {
      // to avoid doubles of bokeh images
      last_output_text.current = props.output_text;
      var scripts = $("#" + props.unique_id + " .log-code-output script").toArray();
      var _iterator11 = _createForOfIteratorHelper(scripts),
        _step11;
      try {
        for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
          var script = _step11.value;
          try {
            window.eval(script.text);
          } catch (e) {}
        }
      } catch (err) {
        _iterator11.e(err);
      } finally {
        _iterator11.f();
      }
    }
  }

  // function makeTablesSortable() {
  //     let tables = $("#" + props.unique_id + " table.sortable").toArray();
  //     for (let table of tables) {
  //         sorttable.makeSortable(table)
  //     }
  // }

  function _copyMe() {
    props.copyCell(props.unique_id);
  }
  function _pasteCell() {
    props.pasteCell(props.unique_id);
  }
  function _selectMe() {
    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    props.selectConsoleItem(props.unique_id, e, callback);
  }
  function _addBlankText() {
    _selectMe(null, function () {
      props.addNewTextItem();
    });
  }
  function _addBlankDivider() {
    _selectMe(null, function () {
      props.addNewDivider();
    });
  }
  function _addBlankCode() {
    _selectMe(null, function () {
      props.addNewCodeItem();
    });
  }
  function renderContextMenu() {
    // return a single element, or nothing to use default browser behavior
    return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "duplicate",
      onClick: _copyMe,
      text: "Copy Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "clipboard",
      onClick: _pasteCell,
      text: "Paste Cells"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "new-text-box",
      onClick: _addBlankText,
      text: "New Text Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "code",
      onClick: _addBlankCode,
      text: "New Code Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "header",
      onClick: _addBlankDivider,
      text: "New Section"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "trash",
      onClick: _deleteMe,
      intent: "danger",
      text: "Delete Cell"
    }));
  }
  function _consoleItemClick(e) {
    _selectMe(e);
    e.stopPropagation();
  }
  var panel_class = props.am_shrunk ? "log-panel log-panel-invisible fixed-log-panel" : "log-panel log-panel-visible fixed-log-panel";
  if (props.in_section) {
    panel_class += " in-section";
  }
  if (props.am_selected) {
    panel_class += " selected";
  }
  return /*#__PURE__*/_react["default"].createElement(_core.ContextMenu, {
    content: renderContextMenu()
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: panel_class + " d-flex flex-row",
    onClick: _consoleItemClick,
    id: props.unique_id,
    style: MB10_STYLE
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div shrink-expand-div d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(Shandle, {
    dragHandleProps: props.dragHandleProps
  }), !props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    icon: "chevron-down",
    handleClick: _toggleShrink
  }), props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    icon: "chevron-right",
    style: GLYPH_BUTTON_STYLE5,
    handleClick: _toggleShrink
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-column",
    style: {
      flex: "1 1 0",
      minWidth: 0,
      overflow: "auto"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "log-panel-body d-flex flex-row"
  }, props.am_shrunk && /*#__PURE__*/_react["default"].createElement("div", {
    className: "body-shrunk-style"
  }, /*#__PURE__*/_react["default"].createElement(_core.EditableText, {
    value: props.summary_text,
    onChange: _handleSummaryTextChange,
    className: "log-panel-summary"
  })), !props.am_shrunk && /*#__PURE__*/_react["default"].createElement("div", {
    className: "body-style"
  }, props.image_data_str && /*#__PURE__*/_react["default"].createElement("img", {
    src: props.image_data_str,
    alt: "An Image"
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _deleteMe,
    tooltip: "Delete this item",
    style: GlYPH_BUTTON_STYLE4,
    intent: "danger",
    icon: "trash"
  }))))));
}
BlobItem = /*#__PURE__*/(0, _react.memo)(BlobItem);
function ConsoleCodeItem(props) {
  props = _objectSpread({
    summary_text: null
  }, props);
  var elRef = (0, _react.useRef)(null);
  var am_selected_previous = (0, _react.useRef)(false);
  var setFocusFunc = (0, _react.useRef)(null);
  var simpleTableId = (0, _react.useRef)(null);
  (0, _react.useEffect)(function () {
    simpleTableId.current = (0, _utilities_react.guid)();
  }, [props.table]);
  (0, _react.useEffect)(function () {
    if (props.am_selected && !am_selected_previous.current && elRef && elRef.current) {
      scrollMeIntoView();
    }
    am_selected_previous.current = props.am_selected;
    if (props.set_focus && setFocusFunc.current) {
      setFocusFunc.current();
      props.setConsoleItemValue(props.unique_id, "set_focus", false, _selectMe);
    }
  });
  (0, _react.useLayoutEffect)(function () {
    return function () {
      if (elRef.current) {
        var tables = elRef.current.querySelectorAll('table.sortable');
        tables.forEach(function (table) {
          var parent = table.parentElement;
          if (parent) {
            parent.innerHTML = '';
          }
        });
      }
    };
  }, []);
  var registerSetFocusFunc = (0, _react.useCallback)(function (theFunc) {
    setFocusFunc.current = theFunc;
  }, []);
  function scrollMeIntoView() {
    var my_element = elRef.current;
    var outer_element = my_element.parentNode.parentNode;
    var scrolled_element = my_element.parentNode;
    var outer_height = outer_element["offsetHeight"];
    var distance_from_top = my_element.offsetTop - outer_element.scrollTop - scrolled_element.offsetTop;
    if (distance_from_top > outer_height - 35) {
      var distance_to_move = distance_from_top - .5 * outer_height;
      outer_element.scrollTop += distance_to_move;
    } else if (distance_from_top < 0) {
      var _distance_to_move = .25 * outer_height - distance_from_top;
      outer_element.scrollTop -= _distance_to_move;
    }
  }

  // function executeEmbeddedScripts() {
  //     let scripts = $("#" + props.unique_id + " .log-code-output script").toArray();
  //     for (let script of scripts) {
  //         // noinspection EmptyCatchBlockJS,UnusedCatchParameterJS
  //         try {
  //             window.eval(script.text)
  //         } catch (e) {
  //
  //         }
  //     }
  // }

  // function makeTablesSortable() {
  //     let tables = $("#" + props.unique_id + " table.sortable").toArray();
  //     for (let table of tables) {
  //         sorttable.makeSortable(table)
  //     }
  // }

  var _stopMe = (0, _react.useCallback)(function () {
    _stopMySpinner();
    (0, _communication_react.postWithCallback)(props.local_id, "stop_console_code", {
      "console_id": props.unique_id
    }, null, null, props.local_id);
  }, []);
  function _stopMySpinner() {
    props.setConsoleItemValue(props.unique_id, "show_spinner", false);
  }
  var _handleChange = (0, _react.useCallback)(function (new_code) {
    props.setConsoleItemValue(props.unique_id, "console_text", new_code);
  }, []);
  var _handleSummaryTextChange = (0, _react.useCallback)(function (value) {
    props.setConsoleItemValue(props.unique_id, "summary_text", value);
  });
  var _toggleShrink = (0, _react.useCallback)(function () {
    props.setConsoleItemValue(props.unique_id, "am_shrunk", !props.am_shrunk);
  }, [props.am_shrunk]);
  var _deleteMe = (0, _react.useCallback)(function () {
    if (props.show_spinner) {
      _stopMe();
    }
    props.handleDelete(props.unique_id);
  }, [props.show_spinner]);
  var _clearOutput = (0, _react.useCallback)(function () {
    props.dispatch({
      type: "clear_code_output",
      unique_id: props.unique_id
    });
  }, []);
  var _extraKeys = (0, _react.useMemo)(function () {
    return [{
      key: 'Ctrl-Enter',
      run: function run() {
        return props.runCodeItem(props.unique_id, true);
      }
    }, {
      key: 'Cmd-Enter',
      run: function run() {
        return props.runCodeItem(props.unique_id, true);
      }
    }, {
      key: 'Ctrl-c',
      run: props.addNewCodeItem
    }, {
      key: 'Ctrl-t',
      run: props.addNewTextItem
    }];
  }, []);
  var _getFirstLine = (0, _react.useCallback)(function () {
    var re = /^(.*)$/m;
    if (props.console_text == "") {
      return "empty text cell";
    } else {
      return re.exec(props.console_text)[0];
    }
  }, [props.console_text]);
  var _copyMe = (0, _react.useCallback)(function () {
    props.copyCell(props.unique_id);
  }, []);
  var _pasteCell = (0, _react.useCallback)(function () {
    props.pasteCell(props.unique_id);
  }, []);
  function _selectMe() {
    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    props.selectConsoleItem(props.unique_id, e, callback);
  }
  var _addBlankText = (0, _react.useCallback)(function () {
    _selectMe(null, function () {
      props.addNewTextItem();
    });
  }, []);
  var _addBlankDivider = (0, _react.useCallback)(function () {
    _selectMe(null, function () {
      props.addNewDivider();
    });
  }, []);
  var _addBlankCode = (0, _react.useCallback)(function () {
    _selectMe(null, function () {
      props.addNewCodeItem();
    });
  }, []);
  var _codeRunner = (0, _react.useCallback)(function () {
    props.runCodeItem(props.unique_id);
  }, []);
  var cm = (0, _react.useMemo)(function () {
    // return a single element, or nothing to use default browser behavior
    return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, !props.show_spinner && /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "play",
      intent: "success",
      onClick: _codeRunner,
      text: "Run Cell"
    }), props.show_spinner && /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "stop",
      intent: "danger",
      onClick: _stopMe,
      text: "Stop Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "new-text-box",
      onClick: _addBlankText,
      text: "New Text Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "code",
      onClick: _addBlankCode,
      text: "New Code Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "header",
      onClick: _addBlankDivider,
      text: "New Section"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "duplicate",
      onClick: _copyMe,
      text: "Copy Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "clipboard",
      onClick: _pasteCell,
      text: "Paste Cells"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "trash",
      onClick: _deleteMe,
      intent: "danger",
      text: "Delete Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "clean",
      intent: "warning",
      onClick: _clearOutput,
      text: "Clear Output"
    }));
  }, []);
  var _consoleItemClick = (0, _react.useCallback)(function (e) {
    _selectMe(e);
    e.stopPropagation();
  });
  var _handleFocus = (0, _react.useCallback)(function () {
    if (!props.am_selected) {
      _selectMe();
    }
  }, []);
  var panel_class = props.am_shrunk ? "log-panel log-panel-invisible" : "log-panel log-panel-visible";
  if (props.am_selected) {
    panel_class += " selected";
  }
  if (props.in_section) {
    panel_class += " in-section";
  }
  var sortedOutputKeys = Object.keys(props.output_dict).map(Number).sort(function (a, b) {
    return a - b;
  });
  //let output_dict = {__html: props.output_text};
  var outputWidgets = sortedOutputKeys.map(function (idx) {
    var the_widget;
    try {
      var outputDict = props.output_dict[idx];
      var widgetKind = outputDict["widgetKind"];
      var widgetId = outputDict["widgetId"];
      var widgetData = outputDict["widgetData"];
      if (widgetKind in _widgets.widgetDict) {
        var WidgetComponent = _widgets.widgetDict[widgetKind];
        the_widget = /*#__PURE__*/_react["default"].createElement("div", {
          key: widgetId,
          className: "log-code-output",
          style: {
            paddingBottom: 5
          }
        }, /*#__PURE__*/_react["default"].createElement(_error_boundary.ErrorBoundary, {
          custom_message: "Error in output widget ".concat(widgetId, " of kind ").concat(widgetKind)
        }, /*#__PURE__*/_react["default"].createElement(WidgetComponent, {
          key: widgetId,
          widgetId: widgetId,
          local_id: props.local_id,
          console_id: props.unique_id,
          row: idx,
          dispatch: props.dispatch,
          widgetData: widgetData,
          tsocket: props.tsocket
        })));
      } else {
        var _WidgetComponent2 = _widgets.widgetDict["text"];
        the_widget = /*#__PURE__*/_react["default"].createElement("div", {
          key: widgetId,
          className: "log-code-output",
          style: {
            paddingBottom: 5
          }
        }, /*#__PURE__*/_react["default"].createElement(_error_boundary.ErrorBoundary, {
          custom_message: "Error outputting not found messsage"
        }, /*#__PURE__*/_react["default"].createElement(_WidgetComponent2, {
          key: widgetId,
          widgetId: widgetId,
          local_id: props.local_id,
          row: idx,
          console_id: props.unique_id,
          dispatch: props.dispatch,
          widgetData: "Widget kind not found ".concat(widgetId, ", ").concat(widgetKind, " ").concat(widgetData)
        })));
      }
      props.widgetHomesRef.current[widgetId] = props.unique_id;
      return the_widget;
    } catch (e) {
      the_widget = /*#__PURE__*/_react["default"].createElement("div", {
        className: "log-code-output",
        style: {
          paddingBottom: 5
        }
      }, "Error outputting widget ".concat(e));
      return the_widget;
    }
  });
  var spinner_val = props.running ? null : 0;

  // noinspection JSValidateTypes
  return /*#__PURE__*/_react["default"].createElement(_core.ContextMenu, {
    content: cm,
    key: props.unique_id
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: panel_class + " d-flex flex-row",
    ref: elRef,
    style: MB10_STYLE,
    onClick: _consoleItemClick,
    id: props.unique_id
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div shrink-expand-div d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(Shandle, {
    dragHandleProps: props.dragHandleProps
  }), !props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    icon: "chevron-down",
    handleClick: _toggleShrink
  }), props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    icon: "chevron-right",
    style: GLYPH_BUTTON_STYLE5,
    handleClick: _toggleShrink
  })), props.am_shrunk && /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-row console-code body-shrunk-style"
  }, /*#__PURE__*/_react["default"].createElement(_core.EditableText, {
    value: props.summary_text ? props.summary_text : _getFirstLine(),
    onChange: _handleSummaryTextChange,
    className: "log-panel-summary code-panel-summary"
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div float-buttons d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _deleteMe,
    tooltip: "Delete this item",
    style: empty_style,
    icon: trash_icon
  }))), !props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-column",
    style: {
      flex: "1 1 0",
      minWidth: 0,
      overflow: "hidden"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "log-panel-body d-flex flex-row console-code",
    style: {
      minWidth: 0,
      overflow: "hidden"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div d-flex pr-1"
  }, !props.show_spinner && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _codeRunner,
    intent: "success",
    tooltip: "Execute this item",
    icon: "play"
  }), props.show_spinner && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _stopMe,
    intent: "danger",
    tooltip: "Stop this item",
    icon: "stop"
  })), /*#__PURE__*/_react["default"].createElement(_reactCodemirror.ReactCodemirror6, {
    handleChange: _handleChange,
    handleFocus: _handleFocus,
    registerSetFocusFunc: registerSetFocusFunc,
    readOnly: false,
    show_line_numbers: true,
    code_content: props.console_text,
    extraKeys: _extraKeys,
    search_term: props.search_string,
    flex_size: true,
    tsocket: props.tsocket,
    local_id: props.local_id,
    saveMe: null
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div float-buttons d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _deleteMe,
    tooltip: "Delete this item",
    style: empty_style,
    icon: trash_icon
  }), /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _clearOutput,
    tooltip: "Clear this item's output",
    style: empty_style,
    icon: clean_icon
  }))), !props.show_spinner && /*#__PURE__*/_react["default"].createElement("div", {
    className: "execution-counter"
  }, "[", String(props.execution_count), "]"), props.show_spinner && /*#__PURE__*/_react["default"].createElement("div", {
    style: SPINNER_STYLE
  }, /*#__PURE__*/_react["default"].createElement(_core.Spinner, {
    size: 13,
    value: spinner_val
  }))), outputWidgets && outputWidgets.length > 0 && /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      paddingBottom: 10,
      display: "flex",
      flexDirection: "column",
      position: "relative"
    }
  }, outputWidgets)))));
}
ConsoleCodeItem = /*#__PURE__*/(0, _react.memo)(ConsoleCodeItem);
function ResourceLinkButton(props) {
  var my_view = (0, _react.useRef)(null);
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  (0, _utilities_react.useConstructor)(function () {
    my_view.current = (0, _library_pane.view_views)(false)[props.res_type];
  });
  function _goToLink() {
    return _goToLink2.apply(this, arguments);
  }
  function _goToLink2() {
    _goToLink2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee20() {
      return _regenerator().w(function (_context21) {
        while (1) switch (_context21.n) {
          case 0:
            if (window.in_context) {
              try {
                props.handleCreateViewer(props.res_type, props.res_name);
              } catch (e) {
                errorDrawerFuncs.addFromError("Error following link", e);
              }
            } else {
              window.open($SCRIPT_ROOT + my_view.current + props.res_name);
            }
          case 1:
            return _context21.a(2);
        }
      }, _callee20);
    }));
    return _goToLink2.apply(this, arguments);
  }
  return /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, {
    className: "link-button-group"
  }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
    size: "small",
    text: props.res_name,
    icon: _combined_metadata.icon_dict[props.res_type],
    variant: "minimal",
    onClick: _goToLink
  }), /*#__PURE__*/_react["default"].createElement(_core.Button, {
    size: "small",
    icon: "small-cross",
    variant: "minimal",
    onClick: function onClick(e) {
      props.deleteMe(props.my_index);
      e.stopPropagation();
    }
  }));
}
ResourceLinkButton = /*#__PURE__*/(0, _react.memo)(ResourceLinkButton);
function ConsoleTextItem(props) {
  props = _objectSpread({
    summary_text: null,
    links: []
  }, props);
  var elRef = (0, _react.useRef)(null);
  var am_selected_previous = (0, _react.useRef)(false);
  var setFocusFunc = (0, _react.useRef)(null);
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  (0, _react.useEffect)(function () {
    if (props.am_selected && !am_selected_previous.current && elRef && elRef.current) {
      scrollMeIntoView();
    }
    am_selected_previous.current = props.am_selected;
    if (props.set_focus) {
      if (props["show_markdown"]) {
        _hideMarkdown();
      } else if (setFocusFunc.current) {
        setFocusFunc.current();
        props.setConsoleItemValue(props.unique_id, "set_focus", false, _selectMe);
      }
    }
  });
  var registerSetFocusFunc = (0, _react.useCallback)(function (theFunc) {
    setFocusFunc.current = theFunc;
  }, []);
  function scrollMeIntoView() {
    var my_element = elRef.current;
    var outer_element = my_element.parentNode.parentNode;
    var scrolled_element = my_element.parentNode;
    var outer_height = outer_element["offsetHeight"];
    var distance_from_top = my_element.offsetTop - outer_element.scrollTop - scrolled_element.offsetTop;
    if (distance_from_top > outer_height - 35) {
      var distance_to_move = distance_from_top - .5 * outer_height;
      outer_element.scrollTop += distance_to_move;
    } else if (distance_from_top < 0) {
      var _distance_to_move2 = .25 * outer_height - distance_from_top;
      outer_element.scrollTop -= _distance_to_move2;
    }
  }
  function hasOnlyWhitespace() {
    return !props.console_text.trim().length;
  }
  function _showMarkdown() {
    props.setConsoleItemValue(props.unique_id, "show_markdown", true);
  }
  var _toggleMarkdown = (0, _react.useCallback)(function () {
    if (props["show_markdown"]) {
      _hideMarkdown();
    } else {
      _showMarkdown();
    }
  }, [props["show_markdown"]]);
  var _hideMarkdown = (0, _react.useCallback)(function () {
    props.setConsoleItemValue(props.unique_id, "show_markdown", false);
  }, []);
  var _handleChange = (0, _react.useCallback)(function (new_text) {
    props.setConsoleItemValue(props.unique_id, "console_text", new_text);
  }, []);
  function _handleSummaryTextChange(value) {
    props.setConsoleItemValue(props.unique_id, "summary_text", value);
  }
  var _toggleShrink = (0, _react.useCallback)(function () {
    props.setConsoleItemValue(props.unique_id, "am_shrunk", !props.am_shrunk);
  }, [props.am_shrunk]);
  var _deleteMe = (0, _react.useCallback)(function () {
    props.handleDelete(props.unique_id);
  }, []);
  function _gotEnter() {
    props.goToNextCell(props.unique_id);
    _showMarkdown();
  }
  function _getFirstLine() {
    var re = /^(.*)$/m;
    if (props.console_text == "") {
      return "empty text cell";
    } else {
      return re.exec(props.console_text)[0];
    }
  }
  function _copyMe() {
    props.copyCell(props.unique_id);
  }
  function _pasteCell() {
    props.pasteCell(props.unique_id);
  }
  function _selectMe() {
    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    props.selectConsoleItem(props.unique_id, e, callback);
  }
  function _insertResourceLink() {
    return _insertResourceLink2.apply(this, arguments);
  }
  function _insertResourceLink2() {
    _insertResourceLink2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee21() {
      var result, new_links, _t1;
      return _regenerator().w(function (_context22) {
        while (1) switch (_context22.n) {
          case 0:
            _context22.p = 0;
            _context22.n = 1;
            return dialogFuncs.showModalPromise("SelectResourceDialog", {
              cancel_text: "cancel",
              submit_text: "insert link",
              handleClose: dialogFuncs.hideModal
            });
          case 1:
            result = _context22.v;
            new_links = _toConsumableArray(props.links);
            new_links.push({
              res_type: result.type,
              res_name: result.selected_resource
            });
            props.setConsoleItemValue(props.unique_id, "links", new_links);
            _context22.n = 3;
            break;
          case 2:
            _context22.p = 2;
            _t1 = _context22.v;
            if (_t1 != "canceled") {
              errorDrawerFuncs.addFromError("Error inserting resource", _t1);
            }
          case 3:
            return _context22.a(2);
        }
      }, _callee21, null, [[0, 2]]);
    }));
    return _insertResourceLink2.apply(this, arguments);
  }
  function _deleteLinkButton(index) {
    var new_links = _lodash["default"].cloneDeep(props.links);
    new_links.splice(index, 1);
    props.setConsoleItemValue(props.unique_id, "links", new_links, function () {
      console.log("i am here with nlinks " + String(props.links.length));
    });
  }
  function _addBlankText() {
    _selectMe(null, function () {
      props.addNewTextItem();
    });
  }
  function _addBlankDivider() {
    _selectMe(null, function () {
      props.addNewDivider();
    });
  }
  function _addBlankCode() {
    _selectMe(null, function () {
      props.addNewCodeItem();
    });
  }
  var contextMenu = (0, _react.useMemo)(function () {
    return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "paragraph",
      intent: "success",
      onClick: _showMarkdown,
      text: "Show Markdown"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "new-text-box",
      onClick: _addBlankText,
      text: "New Text Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "code",
      onClick: _addBlankCode,
      text: "New Code Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "header",
      onClick: _addBlankDivider,
      text: "New Section"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "link",
      onClick: _insertResourceLink,
      text: "Insert ResourceLink"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "duplicate",
      onClick: _copyMe,
      text: "Copy Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "clipboard",
      onClick: _pasteCell,
      text: "Paste Cells"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "trash",
      onClick: _deleteMe,
      intent: "danger",
      text: "Delete Cell"
    }));
  }, []);
  var _consoleItemClick = (0, _react.useCallback)(function (e) {
    _selectMe(e);
    e.stopPropagation();
  }, []);
  var _handleFocus = (0, _react.useCallback)(function () {
    if (!props.am_selected) {
      _selectMe();
    }
  }, []);
  var _extraKeys = (0, _react.useMemo)(function () {
    return [{
      key: 'Ctrl-Enter',
      run: function run() {
        return _gotEnter();
      }
    }, {
      key: 'Cmd-Enter',
      run: function run() {
        return _gotEnter();
      }
    }, {
      key: 'Ctrl-c',
      run: props.addNewCodeItem
    }, {
      key: 'Ctrl-t',
      run: props.addNewTextItem
    }];
  }, []);
  var really_show_markdown = hasOnlyWhitespace() && props.links.length == 0 ? false : props["show_markdown"];
  var converted_markdown;
  if (really_show_markdown) {
    converted_markdown = mdi.render(props.console_text);
  }
  var converted_dict = {
    __html: converted_markdown
  };
  var panel_class = props.am_shrunk ? "log-panel log-panel-invisible text-log-item" : "log-panel log-panel-visible text-log-item";
  if (props.am_selected) {
    panel_class += " selected";
  }
  if (props.in_section) {
    panel_class += " in-section";
  }
  var link_buttons = props.links.map(function (link, index) {
    return /*#__PURE__*/_react["default"].createElement(ResourceLinkButton, {
      key: index,
      my_index: index,
      handleCreateViewer: props.handleCreateViewer,
      deleteMe: _deleteLinkButton,
      res_type: link.res_type,
      res_name: link.res_name
    });
  });

  // noinspection JSUnusedAssignment,JSValidateTypes
  return /*#__PURE__*/_react["default"].createElement(_core.ContextMenu, {
    content: contextMenu
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: panel_class + " d-flex flex-row",
    onClick: _consoleItemClick,
    ref: elRef,
    id: props.unique_id,
    style: MB10_STYLE
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div shrink-expand-div d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(Shandle, {
    dragHandleProps: props.dragHandleProps
  }), !props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    icon: "chevron-down",
    handleClick: _toggleShrink
  }), props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    icon: "chevron-right",
    style: GLYPH_BUTTON_STYLE5,
    handleClick: _toggleShrink
  })), props.am_shrunk && /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-row text-box body-shrunk-style"
  }, /*#__PURE__*/_react["default"].createElement(_core.EditableText, {
    value: props.summary_text ? props.summary_text : _getFirstLine(),
    onChange: _handleSummaryTextChange,
    className: "log-panel-summary"
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div float-buttons d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _deleteMe,
    tooltip: "Delete this item",
    style: empty_style,
    icon: trash_icon
  }))), !props.am_shrunk && /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-column",
    style: {
      flex: "1 1 0",
      minWidth: 0,
      overflow: "hidden"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "log-panel-body console-code d-flex flex-row",
    style: {
      minWidth: 0,
      overflow: "hidden"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div d-flex pr-1"
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _toggleMarkdown,
    intent: "success",
    tooltip: "Convert to/from markdown",
    icon: "paragraph"
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-column",
    style: {
      flex: "1 1 0",
      minWidth: 0,
      position: "relative",
      overflow: "hidden"
    }
  }, !really_show_markdown && /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_reactCodemirror.ReactCodemirror6, {
    handleChange: _handleChange,
    readOnly: false,
    handleFocus: _handleFocus,
    registerSetFocusFunc: registerSetFocusFunc,
    show_line_numbers: false,
    soft_wrap: true,
    mode: "markdown",
    code_content: props.console_text,
    extraKeys: _extraKeys,
    search_term: props.search_string,
    flex_size: true,
    tsocket: props.tsocket,
    local_id: props.local_id,
    saveMe: null
  })), really_show_markdown && !hasOnlyWhitespace() && /*#__PURE__*/_react["default"].createElement("div", {
    className: "text-panel-output markdown-heading-sizes",
    onDoubleClick: _hideMarkdown,
    style: {
      padding: 9
    },
    dangerouslySetInnerHTML: converted_dict
  }), link_buttons), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      width: 37
    }
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div float-buttons d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _deleteMe,
    tooltip: "Delete this item",
    style: empty_style,
    icon: trash_icon
  }))))));
}
ConsoleTextItem = /*#__PURE__*/(0, _react.memo)(ConsoleTextItem);
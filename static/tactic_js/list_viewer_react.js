"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListViewerApp = ListViewerApp;
exports.list_viewer_props = list_viewer_props;
require("../tactic_css/tactic.scss");
var _react = _interopRequireWildcard(require("react"));
var _client = require("react-dom/client");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
var _resource_viewer_react_app = require("./resource_viewer_react_app");
var _tactic_socket = require("./tactic_socket");
var _communication_react = require("./communication_react");
var _toaster = require("./toaster.js");
var _assistant = require("./assistant");
var _settings = require("./settings");
var _error_drawer = require("./error_drawer.js");
var _utilities_react = require("./utilities_react");
var _blueprint_navbar = require("./blueprint_navbar");
var _modal_react = require("./modal_react");
var _toaster2 = require("./toaster");
var _sizing_tools = require("./sizing_tools");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return r; }; var t, r = {}, e = Object.prototype, n = e.hasOwnProperty, o = "function" == typeof Symbol ? Symbol : {}, i = o.iterator || "@@iterator", a = o.asyncIterator || "@@asyncIterator", u = o.toStringTag || "@@toStringTag"; function c(t, r, e, n) { return Object.defineProperty(t, r, { value: e, enumerable: !n, configurable: !n, writable: !n }); } try { c({}, ""); } catch (t) { c = function c(t, r, e) { return t[r] = e; }; } function h(r, e, n, o) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype); return c(a, "_invoke", function (r, e, n) { var o = 1; return function (i, a) { if (3 === o) throw Error("Generator is already running"); if (4 === o) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var u = n.delegate; if (u) { var c = d(u, n); if (c) { if (c === f) continue; return c; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (1 === o) throw o = 4, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = 3; var h = s(r, e, n); if ("normal" === h.type) { if (o = n.done ? 4 : 2, h.arg === f) continue; return { value: h.arg, done: n.done }; } "throw" === h.type && (o = 4, n.method = "throw", n.arg = h.arg); } }; }(r, n, new Context(o || [])), !0), a; } function s(t, r, e) { try { return { type: "normal", arg: t.call(r, e) }; } catch (t) { return { type: "throw", arg: t }; } } r.wrap = h; var f = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var l = {}; c(l, i, function () { return this; }); var p = Object.getPrototypeOf, y = p && p(p(x([]))); y && y !== e && n.call(y, i) && (l = y); var v = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(l); function g(t) { ["next", "throw", "return"].forEach(function (r) { c(t, r, function (t) { return this._invoke(r, t); }); }); } function AsyncIterator(t, r) { function e(o, i, a, u) { var c = s(t[o], t, i); if ("throw" !== c.type) { var h = c.arg, f = h.value; return f && "object" == _typeof(f) && n.call(f, "__await") ? r.resolve(f.__await).then(function (t) { e("next", t, a, u); }, function (t) { e("throw", t, a, u); }) : r.resolve(f).then(function (t) { h.value = t, a(h); }, function (t) { return e("throw", t, a, u); }); } u(c.arg); } var o; c(this, "_invoke", function (t, n) { function i() { return new r(function (r, o) { e(t, n, r, o); }); } return o = o ? o.then(i, i) : i(); }, !0); } function d(r, e) { var n = e.method, o = r.i[n]; if (o === t) return e.delegate = null, "throw" === n && r.i["return"] && (e.method = "return", e.arg = t, d(r, e), "throw" === e.method) || "return" !== n && (e.method = "throw", e.arg = new TypeError("The iterator does not provide a '" + n + "' method")), f; var i = s(o, r.i, e.arg); if ("throw" === i.type) return e.method = "throw", e.arg = i.arg, e.delegate = null, f; var a = i.arg; return a ? a.done ? (e[r.r] = a.value, e.next = r.n, "return" !== e.method && (e.method = "next", e.arg = t), e.delegate = null, f) : a : (e.method = "throw", e.arg = new TypeError("iterator result is not an object"), e.delegate = null, f); } function w(t) { this.tryEntries.push(t); } function m(r) { var e = r[4] || {}; e.type = "normal", e.arg = t, r[4] = e; } function Context(t) { this.tryEntries = [[-1]], t.forEach(w, this), this.reset(!0); } function x(r) { if (null != r) { var e = r[i]; if (e) return e.call(r); if ("function" == typeof r.next) return r; if (!isNaN(r.length)) { var o = -1, a = function e() { for (; ++o < r.length;) if (n.call(r, o)) return e.value = r[o], e.done = !1, e; return e.value = t, e.done = !0, e; }; return a.next = a; } } throw new TypeError(_typeof(r) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, c(v, "constructor", GeneratorFunctionPrototype), c(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = c(GeneratorFunctionPrototype, u, "GeneratorFunction"), r.isGeneratorFunction = function (t) { var r = "function" == typeof t && t.constructor; return !!r && (r === GeneratorFunction || "GeneratorFunction" === (r.displayName || r.name)); }, r.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, c(t, u, "GeneratorFunction")), t.prototype = Object.create(v), t; }, r.awrap = function (t) { return { __await: t }; }, g(AsyncIterator.prototype), c(AsyncIterator.prototype, a, function () { return this; }), r.AsyncIterator = AsyncIterator, r.async = function (t, e, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(h(t, e, n, o), i); return r.isGeneratorFunction(e) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, g(v), c(v, u, "Generator"), c(v, i, function () { return this; }), c(v, "toString", function () { return "[object Generator]"; }), r.keys = function (t) { var r = Object(t), e = []; for (var n in r) e.unshift(n); return function t() { for (; e.length;) if ((n = e.pop()) in r) return t.value = n, t.done = !1, t; return t.done = !0, t; }; }, r.values = x, Context.prototype = { constructor: Context, reset: function reset(r) { if (this.prev = this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(m), !r) for (var e in this) "t" === e.charAt(0) && n.call(this, e) && !isNaN(+e.slice(1)) && (this[e] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0][4]; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(r) { if (this.done) throw r; var e = this; function n(t) { a.type = "throw", a.arg = r, e.next = t; } for (var o = e.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i[4], u = this.prev, c = i[1], h = i[2]; if (-1 === i[0]) return n("end"), !1; if (!c && !h) throw Error("try statement without catch or finally"); if (null != i[0] && i[0] <= u) { if (u < c) return this.method = "next", this.arg = t, n(c), !0; if (u < h) return n(h), !1; } } }, abrupt: function abrupt(t, r) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var n = this.tryEntries[e]; if (n[0] > -1 && n[0] <= this.prev && this.prev < n[2]) { var o = n; break; } } o && ("break" === t || "continue" === t) && o[0] <= r && r <= o[2] && (o = null); var i = o ? o[4] : {}; return i.type = t, i.arg = r, o ? (this.method = "next", this.next = o[2], f) : this.complete(i); }, complete: function complete(t, r) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && r && (this.next = r), f; }, finish: function finish(t) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var e = this.tryEntries[r]; if (e[2] === t) return this.complete(e[4], e[3]), m(e), f; } }, "catch": function _catch(t) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var e = this.tryEntries[r]; if (e[0] === t) { var n = e[4]; if ("throw" === n.type) { var o = n.arg; m(e); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(r, e, n) { return this.delegate = { i: x(r), r: e, n: n }, "next" === this.method && (this.arg = t), f; } }, r; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function list_viewer_props(data, registerDirtyMethod, finalCallback) {
  var resource_viewer_id = (0, _utilities_react.guid)();
  if (!window.in_context) {
    window.main_id = resource_viewer_id;
  }
  var tsocket = new _tactic_socket.TacticSocket("main", 5000, "list_viewer", resource_viewer_id);
  finalCallback({
    resource_viewer_id: resource_viewer_id,
    main_id: resource_viewer_id,
    tsocket: tsocket,
    split_tags: data.mdata.tags == "" ? [] : data.mdata.tags.split(" "),
    created: data.mdata.datestring,
    resource_name: data.resource_name,
    the_content: data.the_content,
    notes: data.mdata.notes,
    readOnly: data.read_only,
    is_repository: data.is_repository,
    registerDirtyMethod: registerDirtyMethod
  });
}
var LIST_PADDING_TOP = 20;
function ListEditor(props) {
  var top_ref = (0, _react.useRef)(null);
  var _useSize = (0, _sizing_tools.useSize)(top_ref, 0, "ListEditor"),
    _useSize2 = _slicedToArray(_useSize, 4),
    usable_width = _useSize2[0],
    usable_height = _useSize2[1],
    topX = _useSize2[2],
    topY = _useSize2[3];
  var tastyle = {
    resize: "horizontal",
    margin: 2,
    height: usable_height - LIST_PADDING_TOP - 4
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    id: "listarea-container",
    ref: top_ref,
    style: {
      margin: 2,
      paddingTop: LIST_PADDING_TOP
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.TextArea, {
    cols: "50",
    style: tastyle,
    disabled: props.readOnly,
    onChange: props.handleChange,
    value: props.the_content
  }));
}
ListEditor = /*#__PURE__*/(0, _react.memo)(ListEditor);
ListEditor.propTypes = {
  the_content: _propTypes["default"].string,
  handleChange: _propTypes["default"].func,
  readOnly: _propTypes["default"].bool,
  height: _propTypes["default"].number
};
function ListViewerApp(props) {
  props = _objectSpread({
    controlled: false,
    changeResourceName: null,
    updatePanel: null,
    refreshTab: null,
    closeTab: null
  }, props);
  var top_ref = (0, _react.useRef)(null);
  var search_ref = (0, _react.useRef)(null);
  var savedContent = (0, _react.useRef)(props.the_content);
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)(props.the_content),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    list_content = _useStateAndRef2[0],
    set_list_content = _useStateAndRef2[1],
    list_content_ref = _useStateAndRef2[2];
  var _useSize3 = (0, _sizing_tools.useSize)(top_ref, 0, "ListViewer"),
    _useSize4 = _slicedToArray(_useSize3, 4),
    usable_width = _useSize4[0],
    usable_height = _useSize4[1],
    topX = _useSize4[2],
    topY = _useSize4[3];
  var _useState = (0, _react.useState)(props.resource_name),
    _useState2 = _slicedToArray(_useState, 2),
    resource_name = _useState2[0],
    set_resource_name = _useState2[1];
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  var statusFuncs = (0, _react.useContext)(_toaster2.StatusContext);
  var selectedPane = (0, _react.useContext)(_utilities_react.SelectedPaneContext);
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  var sizeInfo = (0, _react.useContext)(_sizing_tools.SizeContext);
  (0, _react.useEffect)(function () {
    statusFuncs.stopSpinner();
    if (props.controlled) {
      props.registerDirtyMethod(_dirty);
    }
  }, []);
  var pushCallback = (0, _utilities_react.useCallbackStack)("code_viewer");
  var hotkeys = (0, _react.useMemo)(function () {
    return [{
      combo: "Ctrl+S",
      global: false,
      group: "Module Viewer",
      label: "Save Code",
      onKeyDown: _saveMe
    }];
  }, [_saveMe]);
  var _useHotkeys = (0, _core.useHotkeys)(hotkeys),
    handleKeyDown = _useHotkeys.handleKeyDown,
    handleKeyUp = _useHotkeys.handleKeyUp;
  (0, _utilities_react.useConstructor)(function () {
    if (!props.controlled) {
      window.addEventListener("beforeunload", function (e) {
        if (_dirty()) {
          e.preventDefault();
          e.returnValue = '';
        }
      });
    }
  });
  function cPropGetters() {
    return {
      resource_name: resource_name
    };
  }
  function _cProp(pname) {
    return props.controlled ? props[pname] : cPropGetters()[pname];
  }
  function menu_specs() {
    var ms;
    if (props.is_repository) {
      ms = {
        Transfer: [{
          "name_text": "Copy to library",
          "icon_name": "import",
          "click_handler": function () {
            var _click_handler = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
              return _regeneratorRuntime().wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return (0, _resource_viewer_react_app.copyToLibrary)("list", _cProp("resource_name"), dialogFuncs, statusFuncs, errorDrawerFuncs);
                  case 2:
                  case "end":
                    return _context.stop();
                }
              }, _callee);
            }));
            function click_handler() {
              return _click_handler.apply(this, arguments);
            }
            return click_handler;
          }(),
          tooltip: "Copy to library"
        }]
      };
    } else {
      ms = {
        Save: [{
          name_text: "Save",
          icon_name: "saved",
          click_handler: _saveMe,
          key_bindings: ['Ctrl+S'],
          tooltip: "Save"
        }, {
          name_text: "Save As...",
          icon_name: "floppy-disk",
          click_handler: _saveMeAs,
          tooltip: "Save as"
        }],
        Transfer: [{
          name_text: "Share",
          icon_name: "share",
          click_handler: function () {
            var _click_handler2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
              return _regeneratorRuntime().wrap(function _callee2$(_context2) {
                while (1) switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return (0, _resource_viewer_react_app.sendToRepository)("list", _cProp("resource_name"), dialogFuncs, statusFuncs, errorDrawerFuncs);
                  case 2:
                  case "end":
                    return _context2.stop();
                }
              }, _callee2);
            }));
            function click_handler() {
              return _click_handler2.apply(this, arguments);
            }
            return click_handler;
          }(),
          tooltip: "Share to repository"
        }]
      };
    }
    for (var _i = 0, _Object$entries = Object.entries(ms); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        menu_name = _Object$entries$_i[0],
        menu = _Object$entries$_i[1];
      var _iterator = _createForOfIteratorHelper(menu),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var but = _step.value;
          but.click_handler = but.click_handler.bind(this);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
    return ms;
  }
  function _setResourceNameState(new_name) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    if (props.controlled) {
      props.changeResourceName(new_name, callback);
    } else {
      set_resource_name(new_name);
      pushCallback(callback);
    }
  }
  function _handleListChange(event) {
    set_list_content(event.target.value);
  }
  function am_selected() {
    return selectedPane.amSelected(selectedPane.tab_id, selectedPane.selectedTabIdRef);
  }
  function _saveMe() {
    return _saveMe2.apply(this, arguments);
  }
  function _saveMe2() {
    _saveMe2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
      var new_list_as_string, result_dict, _data;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            if (am_selected()) {
              _context3.next = 2;
              break;
            }
            return _context3.abrupt("return", false);
          case 2:
            new_list_as_string = list_content_ref.current;
            result_dict = {
              "list_name": _cProp("resource_name"),
              "new_list_as_string": new_list_as_string
            };
            _context3.prev = 4;
            _context3.next = 7;
            return (0, _communication_react.postAjaxPromise)("update_list", result_dict);
          case 7:
            _data = _context3.sent;
            savedContent.current = new_list_as_string;
            statusFuncs.statusMessage("Saved list ".concat(result_dict.list_name));
            _context3.next = 15;
            break;
          case 12:
            _context3.prev = 12;
            _context3.t0 = _context3["catch"](4);
            errorDrawerFuncs.addErrorDrawerEntry({
              title: "Error creating new notebook",
              content: "message" in data ? data.message : ""
            });
          case 15:
          case "end":
            return _context3.stop();
        }
      }, _callee3, null, [[4, 12]]);
    }));
    return _saveMe2.apply(this, arguments);
  }
  function _saveMeAs(_x) {
    return _saveMeAs2.apply(this, arguments);
  }
  function _saveMeAs2() {
    _saveMeAs2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(e) {
      var ln_result, new_name, result_dict, _data2;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            if (am_selected()) {
              _context4.next = 2;
              break;
            }
            return _context4.abrupt("return", false);
          case 2:
            _context4.prev = 2;
            _context4.next = 5;
            return (0, _communication_react.postPromise)("host", "get_list_names", {
              "user_id": window.user_id
            }, props.main_id);
          case 5:
            ln_result = _context4.sent;
            _context4.next = 8;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Save List As",
              field_title: "New List Name",
              default_value: "NewList",
              existing_names: ln_result.list_names,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 8:
            new_name = _context4.sent;
            result_dict = {
              "new_res_name": new_name,
              "res_to_copy": _cProp("resource_name")
            };
            _context4.next = 12;
            return (0, _communication_react.postAjaxPromise)('/create_duplicate_list', result_dict);
          case 12:
            _data2 = _context4.sent;
            _setResourceNameState(new_name, function () {
              _saveMe();
            });
            _context4.next = 19;
            break;
          case 16:
            _context4.prev = 16;
            _context4.t0 = _context4["catch"](2);
            if (_context4.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error saving listy", _context4.t0);
            }
          case 19:
          case "end":
            return _context4.stop();
        }
      }, _callee4, null, [[2, 16]]);
    }));
    return _saveMeAs2.apply(this, arguments);
  }
  function _dirty() {
    return !(list_content_ref.current == savedContent.current);
  }
  var my_props = _objectSpread({}, props);
  var outer_style = {
    width: "100%",
    height: sizeInfo.availableHeight,
    paddingLeft: 0,
    position: "relative"
  };
  var outer_class = "resource-viewer-holder";
  if (!props.controlled) {
    my_props.resource_name = resource_name;
    if (settingsContext.isDark()) {
      outer_class = outer_class + " bp5-dark";
    } else {
      outer_class = outer_class + " light-theme";
    }
  }
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, !props.controlled && /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    selected: null,
    show_api_links: true,
    page_id: props.resource_viewer_id,
    user_name: window.username
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: outer_class,
    ref: top_ref,
    style: outer_style,
    tabIndex: "0",
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp
  }, /*#__PURE__*/_react["default"].createElement(_resource_viewer_react_app.ResourceViewerApp, _extends({}, my_props, {
    resource_viewer_id: props.resource_viewer_id,
    setResourceNameState: _setResourceNameState,
    refreshTab: props.refreshTab,
    closeTab: props.closeTab,
    res_type: "list",
    resource_name: my_props.resource_name,
    menu_specs: menu_specs(),
    created: props.created,
    showErrorDrawerButton: false,
    saveMe: _saveMe
  }), /*#__PURE__*/_react["default"].createElement(ListEditor, {
    the_content: list_content,
    readOnly: props.readOnly,
    handleChange: _handleListChange
  }))));
}
exports.ListViewerApp = ListViewerApp = /*#__PURE__*/(0, _react.memo)(ListViewerApp);
function list_viewer_main() {
  return _list_viewer_main.apply(this, arguments);
}
function _list_viewer_main() {
  _list_viewer_main = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
    var gotProps, target, data;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          gotProps = function _gotProps(the_props) {
            var ListViewerAppPlus = (0, _sizing_tools.withSizeContext)((0, _settings.withSettings)((0, _modal_react.withDialogs)((0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)((0, _assistant.withAssistant)(ListViewerApp))))));
            var the_element = /*#__PURE__*/_react["default"].createElement(ListViewerAppPlus, _extends({}, the_props, {
              controlled: false,
              changeName: null
            }));
            var domContainer = document.querySelector('#root');
            var root = (0, _client.createRoot)(domContainer);
            root.render(
            // <HotkeysProvider>
            the_element
            // </HotkeysProvider>
            );
          };
          target = window.is_repository ? "repository_view_list_in_context" : "view_list_in_context";
          _context5.next = 4;
          return (0, _communication_react.postAjaxPromise)(target, {
            "resource_name": window.resource_name
          });
        case 4:
          data = _context5.sent;
          list_viewer_props(data, null, gotProps);
        case 6:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return _list_viewer_main.apply(this, arguments);
}
if (!window.in_context) {
  list_viewer_main().then();
}
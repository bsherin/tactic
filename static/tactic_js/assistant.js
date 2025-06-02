"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AssistantContext = void 0;
exports.ChatModule = ChatModule;
exports.withAssistant = withAssistant;
var _react = _interopRequireWildcard(require("react"));
var _markdownIt = _interopRequireDefault(require("markdown-it"));
require("markdown-it-latex/dist/index.css");
var _markdownItLatex = _interopRequireDefault(require("markdown-it-latex"));
var _core = _interopRequireDefault(require("highlight.js/lib/core"));
var _javascript = _interopRequireDefault(require("highlight.js/lib/languages/javascript"));
var _python = _interopRequireDefault(require("highlight.js/lib/languages/python"));
var _core2 = require("@blueprintjs/core");
var _utilities_react = require("./utilities_react");
var _communication_react = require("./communication_react");
var _settings = require("./settings");
var _error_drawer = require("./error_drawer");
var _toaster = require("./toaster");
var _modal_react = require("./modal_react");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return r; }; var t, r = {}, e = Object.prototype, n = e.hasOwnProperty, o = "function" == typeof Symbol ? Symbol : {}, i = o.iterator || "@@iterator", a = o.asyncIterator || "@@asyncIterator", u = o.toStringTag || "@@toStringTag"; function c(t, r, e, n) { return Object.defineProperty(t, r, { value: e, enumerable: !n, configurable: !n, writable: !n }); } try { c({}, ""); } catch (t) { c = function c(t, r, e) { return t[r] = e; }; } function h(r, e, n, o) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype); return c(a, "_invoke", function (r, e, n) { var o = 1; return function (i, a) { if (3 === o) throw Error("Generator is already running"); if (4 === o) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var u = n.delegate; if (u) { var c = d(u, n); if (c) { if (c === f) continue; return c; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (1 === o) throw o = 4, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = 3; var h = s(r, e, n); if ("normal" === h.type) { if (o = n.done ? 4 : 2, h.arg === f) continue; return { value: h.arg, done: n.done }; } "throw" === h.type && (o = 4, n.method = "throw", n.arg = h.arg); } }; }(r, n, new Context(o || [])), !0), a; } function s(t, r, e) { try { return { type: "normal", arg: t.call(r, e) }; } catch (t) { return { type: "throw", arg: t }; } } r.wrap = h; var f = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var l = {}; c(l, i, function () { return this; }); var p = Object.getPrototypeOf, y = p && p(p(x([]))); y && y !== e && n.call(y, i) && (l = y); var v = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(l); function g(t) { ["next", "throw", "return"].forEach(function (r) { c(t, r, function (t) { return this._invoke(r, t); }); }); } function AsyncIterator(t, r) { function e(o, i, a, u) { var c = s(t[o], t, i); if ("throw" !== c.type) { var h = c.arg, f = h.value; return f && "object" == _typeof(f) && n.call(f, "__await") ? r.resolve(f.__await).then(function (t) { e("next", t, a, u); }, function (t) { e("throw", t, a, u); }) : r.resolve(f).then(function (t) { h.value = t, a(h); }, function (t) { return e("throw", t, a, u); }); } u(c.arg); } var o; c(this, "_invoke", function (t, n) { function i() { return new r(function (r, o) { e(t, n, r, o); }); } return o = o ? o.then(i, i) : i(); }, !0); } function d(r, e) { var n = e.method, o = r.i[n]; if (o === t) return e.delegate = null, "throw" === n && r.i["return"] && (e.method = "return", e.arg = t, d(r, e), "throw" === e.method) || "return" !== n && (e.method = "throw", e.arg = new TypeError("The iterator does not provide a '" + n + "' method")), f; var i = s(o, r.i, e.arg); if ("throw" === i.type) return e.method = "throw", e.arg = i.arg, e.delegate = null, f; var a = i.arg; return a ? a.done ? (e[r.r] = a.value, e.next = r.n, "return" !== e.method && (e.method = "next", e.arg = t), e.delegate = null, f) : a : (e.method = "throw", e.arg = new TypeError("iterator result is not an object"), e.delegate = null, f); } function w(t) { this.tryEntries.push(t); } function m(r) { var e = r[4] || {}; e.type = "normal", e.arg = t, r[4] = e; } function Context(t) { this.tryEntries = [[-1]], t.forEach(w, this), this.reset(!0); } function x(r) { if (null != r) { var e = r[i]; if (e) return e.call(r); if ("function" == typeof r.next) return r; if (!isNaN(r.length)) { var o = -1, a = function e() { for (; ++o < r.length;) if (n.call(r, o)) return e.value = r[o], e.done = !1, e; return e.value = t, e.done = !0, e; }; return a.next = a; } } throw new TypeError(_typeof(r) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, c(v, "constructor", GeneratorFunctionPrototype), c(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = c(GeneratorFunctionPrototype, u, "GeneratorFunction"), r.isGeneratorFunction = function (t) { var r = "function" == typeof t && t.constructor; return !!r && (r === GeneratorFunction || "GeneratorFunction" === (r.displayName || r.name)); }, r.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, c(t, u, "GeneratorFunction")), t.prototype = Object.create(v), t; }, r.awrap = function (t) { return { __await: t }; }, g(AsyncIterator.prototype), c(AsyncIterator.prototype, a, function () { return this; }), r.AsyncIterator = AsyncIterator, r.async = function (t, e, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(h(t, e, n, o), i); return r.isGeneratorFunction(e) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, g(v), c(v, u, "Generator"), c(v, i, function () { return this; }), c(v, "toString", function () { return "[object Generator]"; }), r.keys = function (t) { var r = Object(t), e = []; for (var n in r) e.unshift(n); return function t() { for (; e.length;) if ((n = e.pop()) in r) return t.value = n, t.done = !1, t; return t.done = !0, t; }; }, r.values = x, Context.prototype = { constructor: Context, reset: function reset(r) { if (this.prev = this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(m), !r) for (var e in this) "t" === e.charAt(0) && n.call(this, e) && !isNaN(+e.slice(1)) && (this[e] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0][4]; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(r) { if (this.done) throw r; var e = this; function n(t) { a.type = "throw", a.arg = r, e.next = t; } for (var o = e.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i[4], u = this.prev, c = i[1], h = i[2]; if (-1 === i[0]) return n("end"), !1; if (!c && !h) throw Error("try statement without catch or finally"); if (null != i[0] && i[0] <= u) { if (u < c) return this.method = "next", this.arg = t, n(c), !0; if (u < h) return n(h), !1; } } }, abrupt: function abrupt(t, r) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var n = this.tryEntries[e]; if (n[0] > -1 && n[0] <= this.prev && this.prev < n[2]) { var o = n; break; } } o && ("break" === t || "continue" === t) && o[0] <= r && r <= o[2] && (o = null); var i = o ? o[4] : {}; return i.type = t, i.arg = r, o ? (this.method = "next", this.next = o[2], f) : this.complete(i); }, complete: function complete(t, r) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && r && (this.next = r), f; }, finish: function finish(t) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var e = this.tryEntries[r]; if (e[2] === t) return this.complete(e[4], e[3]), m(e), f; } }, "catch": function _catch(t) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var e = this.tryEntries[r]; if (e[0] === t) { var n = e[4]; if ("throw" === n.type) { var o = n.arg; m(e); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(r, e, n) { return this.delegate = { i: x(r), r: e, n: n }, "next" === this.method && (this.arg = t), f; } }, r; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; } // noinspection TypeScriptUMDGlobal
_core["default"].registerLanguage('javascript', _javascript["default"]);
_core["default"].registerLanguage('python', _python["default"]);
var mdi = (0, _markdownIt["default"])({
  html: true,
  highlight: function highlight(str, lang) {
    if (lang && _core["default"].getLanguage(lang)) {
      try {
        return '<pre><code class="hljs">' + _core["default"].highlight(str, {
          language: lang,
          ignoreIllegals: true
        }).value + '</code></pre>';
      } catch (__) {}
    }
    return '<pre><code class="hljs">' + mdi.utils.escapeHtml(str) + '</code></pre>';
  }
});
mdi.use(_markdownItLatex["default"]);
var AssistantContext = exports.AssistantContext = /*#__PURE__*/(0, _react.createContext)(null);
function formatLatexEquations(text) {
  var displayRegex = /\$\$([^]+?)\$\$/g;
  text = text.replace(displayRegex, function (_, equation) {
    return "`$".concat(equation, "$`");
  });
  var inlineRegex = /\$(.+?)\$/g;
  text = text.replace(inlineRegex, function (_, equation) {
    return "`$".concat(equation, "$`");
  });
  return text;
}
function withAssistant(WrappedComponent) {
  var lposition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "right";
  var assistant_drawer_size = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "45%";
  function WithAssistant(props) {
    var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      show_drawer = _useState2[0],
      set_show_drawer = _useState2[1];
    var _useStateAndRef = (0, _utilities_react.useStateAndRef)([]),
      _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
      item_list = _useStateAndRef2[0],
      set_item_list = _useStateAndRef2[1],
      item_list_ref = _useStateAndRef2[2];
    var _useStateAndRef3 = (0, _utilities_react.useStateAndRef)(""),
      _useStateAndRef4 = _slicedToArray(_useStateAndRef3, 3),
      stream_text = _useStateAndRef4[0],
      set_stream_text = _useStateAndRef4[1],
      stream_text_ref = _useStateAndRef4[2];
    var _useStateAndRef5 = (0, _utilities_react.useStateAndRef)(null),
      _useStateAndRef6 = _slicedToArray(_useStateAndRef5, 3),
      assistant_id = _useStateAndRef6[0],
      set_assistant_id = _useStateAndRef6[1],
      assistant_id_ref = _useStateAndRef6[2];
    var _useStateAndRef7 = (0, _utilities_react.useStateAndRef)(window.has_openapi_key ? "idle" : null),
      _useStateAndRef8 = _slicedToArray(_useStateAndRef7, 3),
      chat_status = _useStateAndRef8[0],
      set_chat_status = _useStateAndRef8[1],
      chat_status_ref = _useStateAndRef8[2];
    var _useStateAndRef9 = (0, _utilities_react.useStateAndRef)(""),
      _useStateAndRef0 = _slicedToArray(_useStateAndRef9, 3),
      assistant_prompt_value = _useStateAndRef0[0],
      set_assistant_prompt_value = _useStateAndRef0[1],
      assistant_prompt_value_ref = _useStateAndRef0[2];
    var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
    (0, _react.useEffect)(function () {
      if (window.has_openapi_key) {
        getAssistant();
      }
      return function () {};
    }, []);
    (0, _react.useEffect)(function () {
      if (show_drawer) {
        getAssistant();
      }
    }, [show_drawer]);
    var pushCallback = (0, _utilities_react.useCallbackStack)();
    function sendRemove() {
      if (assistant_id_ref.current) {
        navigator.sendBeacon("/delete_container_on_unload", JSON.stringify({
          "container_id": assistant_id_ref.current,
          "notify": false
        }));
      }
    }
    function getPastMessages() {
      if (assistant_id_ref.current == null) return;
      (0, _communication_react.postPromise)(assistant_id_ref.current, "get_past_messages", {}).then(function (data) {
        var _iterator = _createForOfIteratorHelper(data["messages"]),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var msg = _step.value;
            if (msg["kind"] == "assistant") {
              msg["text"] = formatLatexEquations(msg["text"]);
              msg["text"] = mdi.render(msg["text"]);
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        set_item_list(data["messages"]);
      })["catch"](function (data) {
        errorDrawerFuncs.addErrorDrawerEntry({
          title: "Error getting past messages",
          content: "message" in data ? data.message : ""
        });
      });
    }
    function getAssistant() {
      (0, _communication_react.postPromise)("host", "GetAssistant", {
        user_id: window.user_id
      }).then(function (response) {
        if (response.assistant_id == null) {
          startAssistant();
        } else if (response.assistant_id != assistant_id_ref.current) {
          set_assistant_id(response.assistant_id);
          pushCallback(getPastMessages);
        }
      })["catch"](function (data) {
        errorDrawerFuncs.addErrorDrawerEntry({
          title: "Error getting assistant",
          content: "message" in data ? data.message : ""
        });
      });
    }
    function startAssistant() {
      (0, _communication_react.postPromise)("host", "StartAssistant", {
        main_id: window.main_id,
        user_id: window.user_id
      }).then(function (response) {
        set_assistant_id(response.assistant_id);
      });
    }
    function delete_my_container() {
      if (assistant_id_ref.current) {
        (0, _communication_react.postAjax)("/delete_container_on_unload", {
          "container_id": assistant_id_ref.current,
          "notify": false
        });
        assistant_id_ref.current = null;
      }
    }
    function _close(data) {
      if (data == null || !("main_id" in data) || data.main_id == window.main_id) {
        set_show_drawer(false);
      }
    }
    function _open(data) {
      if (data == null || !("main_id" in data) || data.main_id == window.main_id) {
        set_show_drawer(true);
      }
    }
    function _toggle(data) {
      if (data == null || !("main_id" in data) || data.main_id == window.main_id) {
        set_show_drawer(!show_drawer);
      }
    }
    function _postAjaxFailure(qXHR, textStatus, errorThrown) {
      _addEntry({
        title: "Post Ajax Failure: {}".format(textStatus),
        content: errorThrown
      });
    }
    function _onClose() {
      set_show_drawer(false);
    }
    var assistantDrawerFuncs = {
      showAssistantDrawerButton: window.has_openapi_key,
      openAssistantDrawer: _open,
      closeAssistantDrawer: _close,
      postAjaxFailure: _postAjaxFailure,
      toggleAssistantDrawer: _toggle,
      item_list_ref: item_list_ref,
      set_item_list: set_item_list,
      stream_text_ref: stream_text_ref,
      set_stream_text: set_stream_text,
      chat_status_ref: chat_status_ref,
      set_chat_status: set_chat_status,
      assistant_id_ref: assistant_id_ref,
      show_drawer: show_drawer
    };
    return /*#__PURE__*/_react["default"].createElement(AssistantContext.Provider, {
      value: assistantDrawerFuncs
    }, /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, window.has_openapi_key && /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(WrappedComponent, props), /*#__PURE__*/_react["default"].createElement(AssistantDrawer, {
      show_drawer: show_drawer,
      position: lposition,
      tsocket: props.tsocket,
      assistant_prompt_value_ref: assistant_prompt_value_ref,
      set_assistant_prompt_value: set_assistant_prompt_value,
      assistant_drawer_size: assistant_drawer_size,
      closeAssistantDrawer: _close,
      title: "ChatBot",
      size: assistant_drawer_size,
      onClose: _onClose
    })), !window.has_openapi_key && /*#__PURE__*/_react["default"].createElement(WrappedComponent, props)));
  }
  return /*#__PURE__*/(0, _react.memo)(WithAssistant);
}
function AssistantDrawer(props) {
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  (0, _react.useEffect)(function () {
    // console.log("theme changed")  // This is to force re-rendering because of highlight.js theme change
  }, [settingsContext.settings.theme]);
  return /*#__PURE__*/_react["default"].createElement(_core2.Drawer, {
    icon: "chat",
    className: settingsContext.isDark() ? "bp5-dark" : "light-theme",
    title: props.title,
    isOpen: props.show_drawer,
    position: props.position,
    canOutsideClickClose: false,
    onClose: props.onClose,
    enforceFocus: false,
    hasBackdrop: false,
    size: props.size
  }, /*#__PURE__*/_react["default"].createElement(ChatModule, {
    tsocket: props.tsocket,
    assistant_prompt_value_ref: props.assistant_prompt_value_ref,
    set_assistant_prompt_value: props.set_assistant_prompt_value
  }));
}
AssistantDrawer = /*#__PURE__*/(0, _react.memo)(AssistantDrawer);
var input_style = {
  position: "relative",
  bottom: 0,
  margin: 10
};
var idle_statuses = ["completed", "expired", "cancelled", "failed"];
var BOTTOM_MARGIN = 25;
function ChatModule(props) {
  var top_ref = /*#__PURE__*/_react["default"].createRef();
  var control_ref = /*#__PURE__*/_react["default"].createRef();
  var list_ref = /*#__PURE__*/_react["default"].createRef();
  var stream_dict_ref = /*#__PURE__*/_react["default"].createRef();
  var _useStateAndRef1 = (0, _utilities_react.useStateAndRef)(0),
    _useStateAndRef10 = _slicedToArray(_useStateAndRef1, 3),
    response_counter = _useStateAndRef10[0],
    set_response_counter = _useStateAndRef10[1],
    response_counter_ref = _useStateAndRef10[2];
  var _useState3 = (0, _react.useState)(function () {
      return window.innerHeight - 40 - BOTTOM_MARGIN;
    }),
    _useState4 = _slicedToArray(_useState3, 2),
    usable_height = _useState4[0],
    set_usable_height = _useState4[1];
  var assistantDrawerFuncs = (0, _react.useContext)(AssistantContext);
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  var statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  (0, _react.useEffect)(function () {
    initSocket();
    stream_dict_ref.current = {};
    window.addEventListener("resize", _update_window_dimensions);
    _update_window_dimensions();
    return function () {
      window.removeEventListener("resize", _update_window_dimensions);
    };
  }, []);
  (0, _react.useEffect)(function () {
    if (list_ref && list_ref.current) {
      list_ref.current.scrollTo(0, list_ref.current.scrollHeight);
    }
  });
  function initSocket() {
    props.tsocket.attachListener("chat_status", _handleChatStatus);
    props.tsocket.attachListener("chat_delta", _handleChatDelta);
  }
  function _update_window_dimensions() {
    var uheight;
    var top_rect;
    if (top_ref && top_ref.current) {
      top_rect = top_ref.current.getBoundingClientRect();
      uheight = window.innerHeight - top_rect.top - BOTTOM_MARGIN;
    } else {
      uheight = window.innerHeight - 40 - BOTTOM_MARGIN;
    }
    set_usable_height(uheight);
  }
  function _onInputChange(event) {
    props.set_assistant_prompt_value(event.target.value);
  }
  function stream_dict_to_string() {
    var sortedKeys = Object.keys(stream_dict_ref.current).sort(function (a, b) {
      return a - b;
    });
    return sortedKeys.map(function (key) {
      return stream_dict_ref.current[key];
    }).join('');
  }
  function _handleChatDelta(data) {
    var current_stream_dict = stream_dict_ref.current;
    current_stream_dict[data.counter] = data.delta;
    var new_text = stream_dict_to_string();
    assistantDrawerFuncs.set_stream_text(new_text);
    pushCallback(function () {
      set_response_counter(response_counter_ref.current + 1);
    });
  }
  function _handleChatEnd(stream_text) {
    stream_dict_ref.current = {};
    stream_text = formatLatexEquations(stream_text);
    var converted_markdown = mdi.render(stream_text);
    var new_item_list = [].concat(_toConsumableArray(assistantDrawerFuncs.item_list_ref.current), [{
      kind: "response",
      text: converted_markdown
    }]);
    assistantDrawerFuncs.set_item_list(new_item_list);
    assistantDrawerFuncs.set_chat_status("idle");
  }
  function _handleChatStatus(data) {
    if (idle_statuses.includes(data.status)) {
      assistantDrawerFuncs.set_chat_status("idle");
      if (Object.keys(stream_dict_ref.current).length == 0) return;
      var current_stream_text = assistantDrawerFuncs.stream_text_ref.current;
      assistantDrawerFuncs.set_stream_text({});
      _handleChatEnd(current_stream_text);
    } else {
      assistantDrawerFuncs.set_chat_status(data.status);
    }
  }
  function _handleButton(_x) {
    return _handleButton2.apply(this, arguments);
  }
  function _handleButton2() {
    _handleButton2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(event) {
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            event.preventDefault();
            if (!(assistantDrawerFuncs.chat_status_ref.current == "idle")) {
              _context.next = 6;
              break;
            }
            _context.next = 4;
            return _promptSubmit();
          case 4:
            _context.next = 8;
            break;
          case 6:
            _context.next = 8;
            return _cancelPrompt();
          case 8:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return _handleButton2.apply(this, arguments);
  }
  function _cancelPrompt() {
    return _cancelPrompt2.apply(this, arguments);
  }
  function _cancelPrompt2() {
    _cancelPrompt2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return (0, _communication_react.postPromise)(assistantDrawerFuncs.assistant_id_ref.current, "cancel_run_task", {});
          case 3:
            _context2.next = 8;
            break;
          case 5:
            _context2.prev = 5;
            _context2.t0 = _context2["catch"](0);
            console.log(_context2.t0.message);
          case 8:
          case "end":
            return _context2.stop();
        }
      }, _callee2, null, [[0, 5]]);
    }));
    return _cancelPrompt2.apply(this, arguments);
  }
  function _addEntry(entry) {
    var new_item_list = [].concat(_toConsumableArray(assistantDrawerFuncs.item_list_ref.current), [entry]);
    assistantDrawerFuncs.set_item_list(new_item_list);
  }
  function _promptSubmit(_x2) {
    return _promptSubmit2.apply(this, arguments);
  }
  function _promptSubmit2() {
    _promptSubmit2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(event) {
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _addEntry({
              kind: "user",
              text: props.assistant_prompt_value_ref.current
            });
            props.set_assistant_prompt_value("");
            assistantDrawerFuncs.set_chat_status("posted");
            _context3.next = 6;
            return (0, _communication_react.postPromise)(assistantDrawerFuncs.assistant_id_ref.current, "post_prompt_stream", {
              prompt: props.assistant_prompt_value_ref.current,
              main_id: window.main_id
            });
          case 6:
            _context3.next = 11;
            break;
          case 8:
            _context3.prev = 8;
            _context3.t0 = _context3["catch"](0);
            console.log(_context3.t0.message);
          case 11:
          case "end":
            return _context3.stop();
        }
      }, _callee3, null, [[0, 8]]);
    }));
    return _promptSubmit2.apply(this, arguments);
  }
  function handleKeyDown(_x3) {
    return _handleKeyDown.apply(this, arguments);
  }
  function _handleKeyDown() {
    _handleKeyDown = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(event) {
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            if (!(event.ctrlKey && event.key === 'Enter')) {
              _context4.next = 4;
              break;
            }
            event.preventDefault();
            _context4.next = 4;
            return _promptSubmit(event);
          case 4:
          case "end":
            return _context4.stop();
        }
      }, _callee4);
    }));
    return _handleKeyDown.apply(this, arguments);
  }
  function _clearThread() {
    return _clearThread2.apply(this, arguments);
  }
  function _clearThread2() {
    _clearThread2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return (0, _communication_react.postPromise)(assistantDrawerFuncs.assistant_id_ref.current, "clear_thread", {
              main_id: window.main_id
            });
          case 3:
            assistantDrawerFuncs.set_item_list([]);
            _context5.next = 9;
            break;
          case 6:
            _context5.prev = 6;
            _context5.t0 = _context5["catch"](0);
            errorDrawerFuncs.addFromError(title, _context5.t0);
          case 9:
          case "end":
            return _context5.stop();
        }
      }, _callee5, null, [[0, 6]]);
    }));
    return _clearThread2.apply(this, arguments);
  }
  function _saveThreadAs() {
    return _saveThreadAs2.apply(this, arguments);
  }
  function _saveThreadAs2() {
    _saveThreadAs2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
      var data, new_name, _title;
      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            statusFuncs.startSpinner();
            _context6.next = 3;
            return (0, _communication_react.postPromise)("host", "get_project_names", {
              "user_id": window.user_id
            }, props.main_id);
          case 3:
            data = _context6.sent;
            _context6.prev = 4;
            _context6.next = 7;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Save Thread To Notebook",
              field_title: "New Notebook Name",
              default_value: "ThreadNotebook",
              existing_names: data.project_names,
              checkboxes: null,
              handleClose: dialogFuncs.hideModal
            });
          case 7:
            new_name = _context6.sent;
            _context6.next = 10;
            return (0, _communication_react.postPromise)("host", "SaveAssistantThread", {
              main_id: window.main_id,
              assistant_id: assistantDrawerFuncs.assistant_id_ref.current,
              new_name: new_name,
              user_id: window.user_id
            });
          case 10:
            statusFuncs.clearStatusMessage();
            statusFuncs.stopSpinner();
            statusFuncs.statusMessage("Saved project ".concat(new_name));
            _context6.next = 20;
            break;
          case 15:
            _context6.prev = 15;
            _context6.t0 = _context6["catch"](4);
            if (_context6.t0 != "canceled") {
              _title = "title" in _context6.t0 ? _context6.t0.title : "Error saving thread";
              errorDrawerFuncs.addFromError(_title, _context6.t0);
            }
            statusFuncs.clearStatusMessage();
            statusFuncs.stopSpinner();
          case 20:
          case "end":
            return _context6.stop();
        }
      }, _callee6, null, [[4, 15]]);
    }));
    return _saveThreadAs2.apply(this, arguments);
  }
  var items = assistantDrawerFuncs.item_list_ref.current.map(function (item, index) {
    if (item.kind == "user") {
      return /*#__PURE__*/_react["default"].createElement(Prompt, _extends({
        key: index
      }, item));
    } else {
      return /*#__PURE__*/_react["default"].createElement(Response, _extends({
        key: index
      }, item));
    }
  });
  if (assistantDrawerFuncs.chat_status_ref.current != "idle") {
    items.push(/*#__PURE__*/_react["default"].createElement(ResponseInProgress, {
      key: "response-in-progress",
      stream_text: assistantDrawerFuncs.stream_text_ref.current
    }));
  }
  var card_list_height = usable_height - 30;
  if (control_ref.current) {
    card_list_height = usable_height - control_ref.current.clientHeight;
  }
  var chat_pane_style = {
    marginTop: 10,
    marginLeft: 25,
    marginRight: 25,
    paddingTop: 10,
    height: usable_height,
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "chat-module",
    ref: top_ref,
    style: chat_pane_style
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-row justify-content-end mt-2"
  }, /*#__PURE__*/_react["default"].createElement(_core2.ButtonGroup, null, /*#__PURE__*/_react["default"].createElement(_core2.Button, {
    icon: "trash",
    text: "Clear",
    onClick: _clearThread
  }), /*#__PURE__*/_react["default"].createElement(_core2.Button, {
    icon: "floppy-disk",
    text: "Save",
    onClick: _saveThreadAs
  }))), /*#__PURE__*/_react["default"].createElement(_core2.CardList, {
    ref: list_ref,
    bordered: false,
    style: {
      height: card_list_height
    }
  }, items), /*#__PURE__*/_react["default"].createElement(_core2.ControlGroup, {
    ref: control_ref,
    vertical: false,
    style: input_style
  }, /*#__PURE__*/_react["default"].createElement(_core2.Button, {
    icon: assistantDrawerFuncs.chat_status_ref.current == "idle" ? "send-message" : "stop",
    minimal: true,
    large: true,
    onClick: _handleButton
  }), /*#__PURE__*/_react["default"].createElement(_core2.TextArea, {
    type: "text",
    autoResize: true,
    style: {
      width: "100%"
    },
    onChange: _onInputChange,
    large: true,
    fill: true,
    onKeyDown: handleKeyDown,
    value: props.assistant_prompt_value_ref.current
  })));
}
exports.ChatModule = ChatModule = /*#__PURE__*/(0, _react.memo)(ChatModule);
var chat_item_style = {
  display: "flex",
  flexDirection: "column",
  width: "100%"
};
function Prompt(props) {
  return /*#__PURE__*/_react["default"].createElement(_core2.Card, {
    interactive: false
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: chat_item_style
  }, /*#__PURE__*/_react["default"].createElement("h6", null, "You"), /*#__PURE__*/_react["default"].createElement("div", null, props.text)));
}
Prompt = /*#__PURE__*/(0, _react.memo)(Prompt);
function Response(props) {
  var converted_dict = {
    __html: props.text
  };
  return /*#__PURE__*/_react["default"].createElement(_core2.Card, {
    interactive: false
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: chat_item_style
  }, /*#__PURE__*/_react["default"].createElement("h6", null, "ChatBot"), /*#__PURE__*/_react["default"].createElement("div", {
    className: "chat-response markdown-heading-sizes",
    dangerouslySetInnerHTML: converted_dict
  })));
}
Response = /*#__PURE__*/(0, _react.memo)(Response);
var dummy_text = "This is a test of the chatbot. This is only a test. \nIf this were a real chatbot, you would be getting useful information.";
function ResponseInProgress(props) {
  if (props.stream_text != "") {
    var sortedKeys = Object.keys(props.stream_text).sort(function (a, b) {
      return a - b;
    });
    var result = sortedKeys.map(function (key) {
      return props.stream_text[key];
    }).join('');
    result = formatLatexEquations(result);
    var converted_markdown = mdi.render(result);
    return /*#__PURE__*/_react["default"].createElement(Response, {
      text: converted_markdown
    });
  }
  var converted_dict = {
    __html: dummy_text
  };
  return /*#__PURE__*/_react["default"].createElement(_core2.Card, {
    className: "bp-skeleton",
    interactive: false
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: chat_item_style
  }, /*#__PURE__*/_react["default"].createElement("h6", null, "ChatBot"), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      height: 100
    },
    className: "chat-response markdown-heading-sizes bp5-skeleton",
    dangerouslySetInnerHTML: converted_dict
  })));
}
ResponseInProgress = /*#__PURE__*/(0, _react.memo)(ResponseInProgress);
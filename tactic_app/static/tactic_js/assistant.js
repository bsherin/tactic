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
var _core = require("@blueprintjs/core");
var _utilities_react = require("./utilities_react");
var _communication_react = require("./communication_react");
var _theme = require("./theme");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; } // noinspection TypeScriptUMDGlobal
var mdi = (0, _markdownIt["default"])({
  html: true
});
mdi.use(_markdownItLatex["default"]);
var AssistantContext = exports.AssistantContext = /*#__PURE__*/(0, _react.createContext)(null);
function formatLatexEquations(text) {
  var displayRegex = /\$\$([\s\S]+?)\$\$/g;
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
    (0, _react.useEffect)(function () {
      if (window.has_openapi_key) {
        getAssistant();
        window.addEventListener("unload", sendRemove);
      }
      return function () {
        sendRemove();
        window.removeEventListener("unload", sendRemove);
      };
    }, []);
    (0, _react.useEffect)(function () {
      if (show_drawer) {
        getAssistant();
      }
    }, [show_drawer]);
    function sendRemove() {
      if (assistant_id_ref.current) {
        navigator.sendBeacon("/delete_container_on_unload", JSON.stringify({
          "container_id": assistant_id_ref.current,
          "notify": false
        }));
      }
    }
    function getAssistant() {
      (0, _communication_react.postPromise)("host", "GetAssistant", {
        user_id: window.user_id
      }).then(function (response) {
        if (response.assistant_id == null) {
          startAssistant();
        } else if (response.assistant_id != assistant_id_ref.current) {
          set_assistant_id(response.assistant_id);
        }
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
  var theme = (0, _react.useContext)(_theme.ThemeContext);
  return /*#__PURE__*/_react["default"].createElement(_core.Drawer, {
    icon: "chat",
    className: theme.dark_theme ? "bp5-dark" : "light-theme",
    title: props.title,
    isOpen: props.show_drawer,
    position: props.position,
    canOutsideClickClose: true,
    onClose: props.onClose,
    enforceFocus: true,
    hasBackdrop: false,
    size: props.size
  }, /*#__PURE__*/_react["default"].createElement(ChatModule, {
    tsocket: props.tsocket
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
  var _useStateAndRef9 = (0, _utilities_react.useStateAndRef)(""),
    _useStateAndRef10 = _slicedToArray(_useStateAndRef9, 3),
    prompt_value = _useStateAndRef10[0],
    set_prompt_value = _useStateAndRef10[1],
    prompt_value_ref = _useStateAndRef10[2];
  var _useStateAndRef11 = (0, _utilities_react.useStateAndRef)(0),
    _useStateAndRef12 = _slicedToArray(_useStateAndRef11, 3),
    response_counter = _useStateAndRef12[0],
    set_response_counter = _useStateAndRef12[1],
    response_counter_ref = _useStateAndRef12[2];
  var _useState3 = (0, _react.useState)(function () {
      return window.innerHeight - 40 - BOTTOM_MARGIN;
    }),
    _useState4 = _slicedToArray(_useState3, 2),
    usable_height = _useState4[0],
    set_usable_height = _useState4[1];
  var assistantDrawerFuncs = (0, _react.useContext)(AssistantContext);
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
    set_prompt_value(event.target.value);
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
    _handleButton2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(event) {
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
    _cancelPrompt2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
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
  function _promptSubmit(_x2) {
    return _promptSubmit2.apply(this, arguments);
  }
  function _promptSubmit2() {
    _promptSubmit2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(event) {
      var new_item_list;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            new_item_list = [].concat(_toConsumableArray(assistantDrawerFuncs.item_list_ref.current), [{
              kind: "prompt",
              text: prompt_value_ref.current
            }]);
            assistantDrawerFuncs.set_item_list(new_item_list);
            set_prompt_value("");
            assistantDrawerFuncs.set_chat_status("posted");
            _context3.next = 7;
            return (0, _communication_react.postPromise)(assistantDrawerFuncs.assistant_id_ref.current, "post_prompt_stream", {
              prompt: prompt_value_ref.current
            });
          case 7:
            _context3.next = 12;
            break;
          case 9:
            _context3.prev = 9;
            _context3.t0 = _context3["catch"](0);
            console.log(_context3.t0.message);
          case 12:
          case "end":
            return _context3.stop();
        }
      }, _callee3, null, [[0, 9]]);
    }));
    return _promptSubmit2.apply(this, arguments);
  }
  function handleKeyDown(_x3) {
    return _handleKeyDown.apply(this, arguments);
  }
  function _handleKeyDown() {
    _handleKeyDown = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(event) {
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
  var items = assistantDrawerFuncs.item_list_ref.current.map(function (item, index) {
    if (item.kind == "prompt") {
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
    items.push( /*#__PURE__*/_react["default"].createElement(ResponseInProgress, {
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
  }, /*#__PURE__*/_react["default"].createElement(_core.CardList, {
    ref: list_ref,
    bordered: false,
    style: {
      height: card_list_height
    }
  }, items), /*#__PURE__*/_react["default"].createElement(_core.ControlGroup, {
    ref: control_ref,
    vertical: false,
    style: input_style
  }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
    icon: assistantDrawerFuncs.chat_status_ref.current == "idle" ? "send-message" : "stop",
    minimal: true,
    large: true,
    onClick: _handleButton
  }), /*#__PURE__*/_react["default"].createElement(_core.TextArea, {
    type: "text",
    autoResize: true,
    style: {
      width: "100%"
    },
    onChange: _onInputChange,
    large: true,
    fill: true,
    onKeyDown: handleKeyDown,
    value: prompt_value_ref.current
  })));
}
exports.ChatModule = ChatModule = /*#__PURE__*/(0, _react.memo)(ChatModule);
var chat_item_style = {
  display: "flex",
  flexDirection: "column",
  width: "100%"
};
function Prompt(props) {
  return /*#__PURE__*/_react["default"].createElement(_core.Card, {
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
  return /*#__PURE__*/_react["default"].createElement(_core.Card, {
    interactive: false
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: chat_item_style
  }, /*#__PURE__*/_react["default"].createElement("h6", null, "ChatBot"), /*#__PURE__*/_react["default"].createElement("div", {
    className: "chat-response",
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
  return /*#__PURE__*/_react["default"].createElement(_core.Card, {
    className: "bp-skeleton",
    interactive: false
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: chat_item_style
  }, /*#__PURE__*/_react["default"].createElement("h6", null, "ChatBot"), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      height: 100
    },
    className: "chat-response bp5-skeleton",
    dangerouslySetInnerHTML: converted_dict
  })));
}
ResponseInProgress = /*#__PURE__*/(0, _react.memo)(ResponseInProgress);
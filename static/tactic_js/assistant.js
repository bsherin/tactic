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
var _tactic_socket = require("./tactic_socket");
var _communication_react = require("./communication_react");
var _settings = require("./settings");
var _error_drawer = require("./error_drawer");
var _toaster = require("./toaster");
var _modal_react = require("./modal_react");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t5 in e) "default" !== _t5 && {}.hasOwnProperty.call(e, _t5) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t5)) && (i.get || i.set) ? o(f, _t5, i) : f[_t5] = e[_t5]); return f; })(e, t); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
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
      set_item_list = _useStateAndRef2[1],
      item_list_ref = _useStateAndRef2[2];
    var _useStateAndRef3 = (0, _utilities_react.useStateAndRef)(""),
      _useStateAndRef4 = _slicedToArray(_useStateAndRef3, 3),
      set_stream_text = _useStateAndRef4[1],
      stream_text_ref = _useStateAndRef4[2];
    var _useStateAndRef5 = (0, _utilities_react.useStateAndRef)(window.has_openapi_key ? "idle" : null),
      _useStateAndRef6 = _slicedToArray(_useStateAndRef5, 3),
      set_chat_status = _useStateAndRef6[1],
      chat_status_ref = _useStateAndRef6[2];
    var _useStateAndRef7 = (0, _utilities_react.useStateAndRef)(""),
      _useStateAndRef8 = _slicedToArray(_useStateAndRef7, 3),
      set_assistant_prompt_value = _useStateAndRef8[1],
      assistant_prompt_value_ref = _useStateAndRef8[2];
    var initialized = (0, _react.useRef)(false);
    var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
    (0, _react.useEffect)(function () {
      if (show_drawer && window.has_openapi_key && !initialized.current) {
        getAssistant();
      }
    }, [show_drawer]);
    function getPastMessages() {
      (0, _communication_react.postPromise)("assistant", "get_past_messages", {
        local_id: window.global_id
      }).then(function (data) {
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
        initialized.current = true;
      })["catch"](function (data) {
        errorDrawerFuncs.addErrorDrawerEntry({
          title: "Error getting past messages",
          content: "message" in data ? data.message : ""
        });
      });
    }
    function getAssistant() {
      (0, _communication_react.postPromise)("assistant", "start_session", {
        user_id: window.user_id,
        global_id: window.global_id,
        local_id: window.global_id
      }).then(function (response) {
        if (response.status == "exists") {
          getPastMessages();
        }
      })["catch"](function (data) {
        errorDrawerFuncs.addErrorDrawerEntry({
          title: "Error getting assistant",
          content: "message" in data ? data.message : ""
        });
      });
    }
    function _close() {
      set_show_drawer(false);
    }
    function _open() {
      set_show_drawer(true);
    }
    function _toggle() {
      set_show_drawer(!show_drawer);
    }
    function _onClose() {
      set_show_drawer(false);
    }
    var assistantDrawerFuncs = {
      showAssistantDrawerButton: window.has_openapi_key,
      openAssistantDrawer: _open,
      closeAssistantDrawer: _close,
      toggleAssistantDrawer: _toggle,
      item_list_ref: item_list_ref,
      set_item_list: set_item_list,
      stream_text_ref: stream_text_ref,
      set_stream_text: set_stream_text,
      chat_status_ref: chat_status_ref,
      set_chat_status: set_chat_status,
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
    className: settingsContext.isDark() ? "bp6-dark" : "light-theme",
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
function ChatModule(props) {
  var top_ref = /*#__PURE__*/_react["default"].createRef();
  var control_ref = /*#__PURE__*/_react["default"].createRef();
  var list_ref = /*#__PURE__*/_react["default"].createRef();
  var stream_dict_ref = /*#__PURE__*/_react["default"].createRef();
  var _useStateAndRef9 = (0, _utilities_react.useStateAndRef)(0),
    _useStateAndRef0 = _slicedToArray(_useStateAndRef9, 3),
    set_response_counter = _useStateAndRef0[1],
    response_counter_ref = _useStateAndRef0[2];
  var assistantDrawerFuncs = (0, _react.useContext)(AssistantContext);
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  var statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  (0, _react.useEffect)(function () {
    stream_dict_ref.current = {};
  }, []);
  (0, _react.useEffect)(function () {
    if (list_ref && list_ref.current) {
      list_ref.current.scrollTo(0, list_ref.current.scrollHeight);
    }
  });
  (0, _tactic_socket.useSocketListener)(props.tsocket, "chat_status", function (data) {
    if (idle_statuses.includes(data.status)) {
      assistantDrawerFuncs.set_chat_status("idle");
      if (Object.keys(stream_dict_ref.current).length == 0) return;
      var current_stream_text = assistantDrawerFuncs.stream_text_ref.current;
      assistantDrawerFuncs.set_stream_text({});
      _handleChatEnd(current_stream_text);
    } else {
      assistantDrawerFuncs.set_chat_status(data.status);
    }
  }, []);
  (0, _tactic_socket.useSocketListener)(props.tsocket, "chat_delta", function (data) {
    var current_stream_dict = stream_dict_ref.current;
    current_stream_dict[data.counter] = data.delta;
    var new_text = stream_dict_to_string();
    assistantDrawerFuncs.set_stream_text(new_text);
    pushCallback(function () {
      set_response_counter(response_counter_ref.current + 1);
    });
  }, []);
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
  function _handleButton(_x) {
    return _handleButton2.apply(this, arguments);
  }
  function _handleButton2() {
    _handleButton2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(event) {
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            event.preventDefault();
            if (!(assistantDrawerFuncs.chat_status_ref.current == "idle")) {
              _context.n = 2;
              break;
            }
            _context.n = 1;
            return _promptSubmit();
          case 1:
            _context.n = 3;
            break;
          case 2:
            _context.n = 3;
            return _cancelPrompt();
          case 3:
            return _context.a(2);
        }
      }, _callee);
    }));
    return _handleButton2.apply(this, arguments);
  }
  function _cancelPrompt() {
    return _cancelPrompt2.apply(this, arguments);
  }
  function _cancelPrompt2() {
    _cancelPrompt2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
      var _t;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            _context2.p = 0;
            _context2.n = 1;
            return (0, _communication_react.postPromise)("assistant", "cancel_run_task", {
              local_id: window.global_id
            });
          case 1:
            _context2.n = 3;
            break;
          case 2:
            _context2.p = 2;
            _t = _context2.v;
            console.log(_t.message);
          case 3:
            return _context2.a(2);
        }
      }, _callee2, null, [[0, 2]]);
    }));
    return _cancelPrompt2.apply(this, arguments);
  }
  function _addEntry(entry) {
    var new_item_list = [].concat(_toConsumableArray(assistantDrawerFuncs.item_list_ref.current), [entry]);
    assistantDrawerFuncs.set_item_list(new_item_list);
  }
  function _promptSubmit() {
    return _promptSubmit2.apply(this, arguments);
  }
  function _promptSubmit2() {
    _promptSubmit2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
      var _t2;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.n) {
          case 0:
            _context3.p = 0;
            _addEntry({
              kind: "user",
              text: props.assistant_prompt_value_ref.current
            });
            props.set_assistant_prompt_value("");
            assistantDrawerFuncs.set_chat_status("posted");
            _context3.n = 1;
            return (0, _communication_react.postPromise)("assistant", "post_prompt_stream", {
              prompt: props.assistant_prompt_value_ref.current,
              local_id: window.global_id
            });
          case 1:
            _context3.n = 3;
            break;
          case 2:
            _context3.p = 2;
            _t2 = _context3.v;
            console.log(_t2.message);
          case 3:
            return _context3.a(2);
        }
      }, _callee3, null, [[0, 2]]);
    }));
    return _promptSubmit2.apply(this, arguments);
  }
  function handleKeyDown(_x2) {
    return _handleKeyDown.apply(this, arguments);
  }
  function _handleKeyDown() {
    _handleKeyDown = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(event) {
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.n) {
          case 0:
            if (!(event.ctrlKey && event.key === 'Enter')) {
              _context4.n = 1;
              break;
            }
            event.preventDefault();
            _context4.n = 1;
            return _promptSubmit(event);
          case 1:
            return _context4.a(2);
        }
      }, _callee4);
    }));
    return _handleKeyDown.apply(this, arguments);
  }
  function _clearThread() {
    return _clearThread2.apply(this, arguments);
  }
  function _clearThread2() {
    _clearThread2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
      var _t3;
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.n) {
          case 0:
            _context5.p = 0;
            _context5.n = 1;
            return (0, _communication_react.postPromise)("assistant", "clear_thread", {
              local_id: window.global_id
            });
          case 1:
            assistantDrawerFuncs.set_item_list([]);
            _context5.n = 3;
            break;
          case 2:
            _context5.p = 2;
            _t3 = _context5.v;
            errorDrawerFuncs.addFromError("error clearing thread", _t3);
          case 3:
            return _context5.a(2);
        }
      }, _callee5, null, [[0, 2]]);
    }));
    return _clearThread2.apply(this, arguments);
  }
  function _saveThreadAs() {
    return _saveThreadAs2.apply(this, arguments);
  }
  function _saveThreadAs2() {
    _saveThreadAs2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
      var data, new_name, title, _t4;
      return _regenerator().w(function (_context6) {
        while (1) switch (_context6.n) {
          case 0:
            statusFuncs.startSpinner();
            _context6.n = 1;
            return (0, _communication_react.postPromise)("host", "get_project_names_task", {});
          case 1:
            data = _context6.v;
            _context6.p = 2;
            _context6.n = 3;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Save Thread To Notebook",
              field_title: "New Notebook Name",
              default_value: "ThreadNotebook",
              existing_names: data.project_names,
              checkboxes: null,
              handleClose: dialogFuncs.hideModal
            });
          case 3:
            new_name = _context6.v;
            _context6.n = 4;
            return (0, _communication_react.postPromise)("host", "SaveAssistantThread", {
              room: window.global_id,
              local_id: window.global_id,
              new_name: new_name,
              user_id: window.user_id
            });
          case 4:
            statusFuncs.clearStatusMessage();
            statusFuncs.stopSpinner();
            statusFuncs.statusMessage("Saved project ".concat(new_name));
            _context6.n = 6;
            break;
          case 5:
            _context6.p = 5;
            _t4 = _context6.v;
            if (_t4 != "canceled") {
              title = "title" in _t4 ? _t4.title : "Error saving thread";
              errorDrawerFuncs.addFromError(title, _t4);
            }
            statusFuncs.clearStatusMessage();
            statusFuncs.stopSpinner();
          case 6:
            return _context6.a(2);
        }
      }, _callee6, null, [[2, 5]]);
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
  var chat_pane_style = {
    marginLeft: 25,
    marginRight: 25,
    flex: "1 1 0",
    minHeight: 0,
    overflow: "auto",
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
      flex: "1 1 0",
      overflow: "auto",
      position: "relative"
    }
  }, items), /*#__PURE__*/_react["default"].createElement(_core2.ControlGroup, {
    ref: control_ref,
    vertical: false,
    style: input_style
  }, /*#__PURE__*/_react["default"].createElement(_core2.Button, {
    icon: assistantDrawerFuncs.chat_status_ref.current == "idle" ? "send-message" : "stop",
    variant: "minimal",
    size: "large",
    onClick: _handleButton
  }), /*#__PURE__*/_react["default"].createElement(_core2.TextArea, {
    type: "text",
    autoResize: true,
    style: {
      width: "100%"
    },
    onChange: _onInputChange,
    size: "large",
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
    className: "chat-response markdown-heading-sizes bp6-skeleton",
    dangerouslySetInnerHTML: converted_dict
  })));
}
ResponseInProgress = /*#__PURE__*/(0, _react.memo)(ResponseInProgress);
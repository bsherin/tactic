"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
require("../tactic_css/tactic.scss");
var _react = _interopRequireWildcard(require("react"));
var _client = require("react-dom/client");
var _merge_viewer_app = require("./merge_viewer_app");
var _toaster = require("./toaster.js");
var _communication_react = require("./communication_react.js");
var _error_drawer = require("./error_drawer.js");
var _sizing_tools = require("./sizing_tools");
var _utilities_react = require("./utilities_react.js");
var _blueprint_navbar = require("./blueprint_navbar");
var _tactic_socket = require("./tactic_socket.js");
var _utilities_react2 = require("./utilities_react");
var _settings = require("./settings");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return r; }; var t, r = {}, e = Object.prototype, n = e.hasOwnProperty, o = "function" == typeof Symbol ? Symbol : {}, i = o.iterator || "@@iterator", a = o.asyncIterator || "@@asyncIterator", u = o.toStringTag || "@@toStringTag"; function c(t, r, e, n) { return Object.defineProperty(t, r, { value: e, enumerable: !n, configurable: !n, writable: !n }); } try { c({}, ""); } catch (t) { c = function c(t, r, e) { return t[r] = e; }; } function h(r, e, n, o) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype); return c(a, "_invoke", function (r, e, n) { var o = 1; return function (i, a) { if (3 === o) throw Error("Generator is already running"); if (4 === o) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var u = n.delegate; if (u) { var c = d(u, n); if (c) { if (c === f) continue; return c; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (1 === o) throw o = 4, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = 3; var h = s(r, e, n); if ("normal" === h.type) { if (o = n.done ? 4 : 2, h.arg === f) continue; return { value: h.arg, done: n.done }; } "throw" === h.type && (o = 4, n.method = "throw", n.arg = h.arg); } }; }(r, n, new Context(o || [])), !0), a; } function s(t, r, e) { try { return { type: "normal", arg: t.call(r, e) }; } catch (t) { return { type: "throw", arg: t }; } } r.wrap = h; var f = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var l = {}; c(l, i, function () { return this; }); var p = Object.getPrototypeOf, y = p && p(p(x([]))); y && y !== e && n.call(y, i) && (l = y); var v = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(l); function g(t) { ["next", "throw", "return"].forEach(function (r) { c(t, r, function (t) { return this._invoke(r, t); }); }); } function AsyncIterator(t, r) { function e(o, i, a, u) { var c = s(t[o], t, i); if ("throw" !== c.type) { var h = c.arg, f = h.value; return f && "object" == _typeof(f) && n.call(f, "__await") ? r.resolve(f.__await).then(function (t) { e("next", t, a, u); }, function (t) { e("throw", t, a, u); }) : r.resolve(f).then(function (t) { h.value = t, a(h); }, function (t) { return e("throw", t, a, u); }); } u(c.arg); } var o; c(this, "_invoke", function (t, n) { function i() { return new r(function (r, o) { e(t, n, r, o); }); } return o = o ? o.then(i, i) : i(); }, !0); } function d(r, e) { var n = e.method, o = r.i[n]; if (o === t) return e.delegate = null, "throw" === n && r.i["return"] && (e.method = "return", e.arg = t, d(r, e), "throw" === e.method) || "return" !== n && (e.method = "throw", e.arg = new TypeError("The iterator does not provide a '" + n + "' method")), f; var i = s(o, r.i, e.arg); if ("throw" === i.type) return e.method = "throw", e.arg = i.arg, e.delegate = null, f; var a = i.arg; return a ? a.done ? (e[r.r] = a.value, e.next = r.n, "return" !== e.method && (e.method = "next", e.arg = t), e.delegate = null, f) : a : (e.method = "throw", e.arg = new TypeError("iterator result is not an object"), e.delegate = null, f); } function w(t) { this.tryEntries.push(t); } function m(r) { var e = r[4] || {}; e.type = "normal", e.arg = t, r[4] = e; } function Context(t) { this.tryEntries = [[-1]], t.forEach(w, this), this.reset(!0); } function x(r) { if (null != r) { var e = r[i]; if (e) return e.call(r); if ("function" == typeof r.next) return r; if (!isNaN(r.length)) { var o = -1, a = function e() { for (; ++o < r.length;) if (n.call(r, o)) return e.value = r[o], e.done = !1, e; return e.value = t, e.done = !0, e; }; return a.next = a; } } throw new TypeError(_typeof(r) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, c(v, "constructor", GeneratorFunctionPrototype), c(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = c(GeneratorFunctionPrototype, u, "GeneratorFunction"), r.isGeneratorFunction = function (t) { var r = "function" == typeof t && t.constructor; return !!r && (r === GeneratorFunction || "GeneratorFunction" === (r.displayName || r.name)); }, r.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, c(t, u, "GeneratorFunction")), t.prototype = Object.create(v), t; }, r.awrap = function (t) { return { __await: t }; }, g(AsyncIterator.prototype), c(AsyncIterator.prototype, a, function () { return this; }), r.AsyncIterator = AsyncIterator, r.async = function (t, e, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(h(t, e, n, o), i); return r.isGeneratorFunction(e) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, g(v), c(v, u, "Generator"), c(v, i, function () { return this; }), c(v, "toString", function () { return "[object Generator]"; }), r.keys = function (t) { var r = Object(t), e = []; for (var n in r) e.unshift(n); return function t() { for (; e.length;) if ((n = e.pop()) in r) return t.value = n, t.done = !1, t; return t.done = !0, t; }; }, r.values = x, Context.prototype = { constructor: Context, reset: function reset(r) { if (this.prev = this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(m), !r) for (var e in this) "t" === e.charAt(0) && n.call(this, e) && !isNaN(+e.slice(1)) && (this[e] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0][4]; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(r) { if (this.done) throw r; var e = this; function n(t) { a.type = "throw", a.arg = r, e.next = t; } for (var o = e.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i[4], u = this.prev, c = i[1], h = i[2]; if (-1 === i[0]) return n("end"), !1; if (!c && !h) throw Error("try statement without catch or finally"); if (null != i[0] && i[0] <= u) { if (u < c) return this.method = "next", this.arg = t, n(c), !0; if (u < h) return n(h), !1; } } }, abrupt: function abrupt(t, r) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var n = this.tryEntries[e]; if (n[0] > -1 && n[0] <= this.prev && this.prev < n[2]) { var o = n; break; } } o && ("break" === t || "continue" === t) && o[0] <= r && r <= o[2] && (o = null); var i = o ? o[4] : {}; return i.type = t, i.arg = r, o ? (this.method = "next", this.next = o[2], f) : this.complete(i); }, complete: function complete(t, r) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && r && (this.next = r), f; }, finish: function finish(t) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var e = this.tryEntries[r]; if (e[2] === t) return this.complete(e[4], e[3]), m(e), f; } }, "catch": function _catch(t) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var e = this.tryEntries[r]; if (e[0] === t) { var n = e[4]; if ("throw" === n.type) { var o = n.arg; m(e); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(r, e, n) { return this.delegate = { i: x(r), r: e, n: n }, "next" === this.method && (this.arg = t), f; } }, r; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; } /**
 * Created by bls910
 */ // import { HotkeysProvider } from "@blueprintjs/core";
function history_viewer_main() {
  return _history_viewer_main.apply(this, arguments);
}
function _history_viewer_main() {
  _history_viewer_main = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    var gotProps, get_url, data, edit_content, data2, fallback, domContainer, root, the_element;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          gotProps = function _gotProps(the_props) {
            var HistoryViewerAppPlus = (0, _settings.withSettings)((0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(HistoryViewerApp)));
            var the_element = /*#__PURE__*/_react["default"].createElement(HistoryViewerAppPlus, _extends({}, the_props, {
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
          get_url = "get_module_code";
          _context.prev = 2;
          _context.next = 5;
          return (0, _communication_react.postAjaxPromise)("".concat(get_url, "/").concat(window.resource_name), {});
        case 5:
          data = _context.sent;
          edit_content = data.the_content;
          _context.next = 9;
          return (0, _communication_react.postAjaxPromise)("get_checkpoint_dates", {
            "module_name": window.resource_name
          });
        case 9:
          data2 = _context.sent;
          data.history_list = data2.checkpoints;
          data.resource_name = window.resource_name;
          history_viewer_props(data, null, gotProps);
          _context.next = 23;
          break;
        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](2);
          fallback = "History viewer failed to load";
          if ("message" in _context.t0) {
            fallback = fallback + " " + _context.t0.message;
          }
          domContainer = document.querySelector('#root');
          root = (0, _client.createRoot)(domContainer);
          the_element = /*#__PURE__*/_react["default"].createElement("pre", null, fallback);
          root.render(the_element);
        case 23:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[2, 15]]);
  }));
  return _history_viewer_main.apply(this, arguments);
}
function history_viewer_props(data, registerDirtyMethod, finalCallback) {
  var resource_viewer_id = (0, _utilities_react.guid)();
  var tsocket = new _tactic_socket.TacticSocket("main", 5000, "history_viewer", resource_viewer_id);
  finalCallback({
    resource_viewer_id: resource_viewer_id,
    tsocket: tsocket,
    history_list: data.history_list,
    resource_name: data.resource_name,
    edit_content: data.the_content,
    is_repository: false,
    registerDirtyMethod: registerDirtyMethod
  });
}
function HistoryViewerApp(props) {
  var _useState = (0, _react.useState)(props.edit_content),
    _useState2 = _slicedToArray(_useState, 2),
    edit_content = _useState2[0],
    set_edit_content = _useState2[1];
  var _useState3 = (0, _react.useState)(""),
    _useState4 = _slicedToArray(_useState3, 2),
    right_content = _useState4[0],
    set_right_content = _useState4[1];
  var _useState5 = (0, _react.useState)(props.history_list[0]["updatestring"]),
    _useState6 = _slicedToArray(_useState5, 2),
    history_popup_val = _useState6[0],
    set_history_popup_val = _useState6[1];
  var _useState7 = (0, _react.useState)(props.history_list),
    _useState8 = _slicedToArray(_useState7, 2),
    history_list = _useState8[0],
    set_history_list = _useState8[1];
  var _useState9 = (0, _react.useState)(props.resource_name),
    _useState0 = _slicedToArray(_useState9, 2),
    resource_name = _useState0[0],
    set_resource_name = _useState0[1];
  var connection_status = (0, _utilities_react2.useConnection)(props.tsocket, initSocket);
  var savedContent = (0, _react.useRef)(props.edit_content);
  var statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  var pushCallback = (0, _utilities_react2.useCallbackStack)();
  (0, _react.useEffect)(function () {
    function beforeUnloadFunc(e) {
      if (_dirty()) {
        e.preventDefault();
        e.returnValue = '';
      }
    }
    window.addEventListener("beforeunload", beforeUnloadFunc);
    return function () {
      props.tsocket.disconnect();
      window.removeEventListener("beforeunload", beforeUnloadFunc);
    };
  }, []);
  function initSocket() {
    props.tsocket.attachListener("window-open", function (data) {
      return window.open("".concat($SCRIPT_ROOT, "/load_temp_page/").concat(data["the_id"]));
    });
    props.tsocket.attachListener('close-user-windows', function (data) {
      if (!(data["originator"] == window.library_id)) {
        window.close();
      }
    });
    props.tsocket.attachListener('doflashUser', _toaster.doFlash);
  }
  function handleSelectChange(new_value) {
    set_history_popup_val(new_value);
    var _iterator = _createForOfIteratorHelper(history_list),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var item = _step.value;
        if (item["updatestring"] == new_value) {
          var updatestring_for_sort = item["updatestring_for_sort"];
          (0, _communication_react.postAjaxPromise)("get_checkpoint_code", {
            "module_name": resource_name,
            "updatestring_for_sort": updatestring_for_sort
          }).then(function (data) {
            set_right_content(data.module_code);
          })["catch"](function (data) {
            errorDrawerFuncs.addErrorDrawerEntry({
              title: "Error getting checkpoint code",
              content: "message" in data ? data.message : ""
            });
          });
          return;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
  function handleEditChange(new_code) {
    set_edit_content(new_code);
  }
  function doCheckpointPromise() {
    return new Promise(function (resolve, reject) {
      (0, _communication_react.postAjax)("checkpoint_module", {
        "module_name": props.resource_name
      }, function (data) {
        if (data.success) {
          resolve(data);
        } else {
          reject(data);
        }
      });
    });
  }
  function checkpointThenSaveFromLeft() {
    var self = this;
    var current_popup_val = history_popup_val;
    doCheckpointPromise().then(function () {
      (0, _communication_react.postAjaxPromise)("get_checkpoint_dates", {
        "module_name": resource_name
      }).then(function (data) {
        set_history_list(data.checkpoints);
      })["catch"](function (data) {
        errorDrawerFuncs.addErrorDrawerEntry({
          title: "Error getting checkpoint dates",
          content: "message" in data ? data.message : ""
        });
      });
      saveFromLeft();
    })["catch"](function (data) {
      errorDrawerFuncs.addErrorDrawerEntry({
        title: "Error checkpointing module",
        content: "message" in data ? data.message : ""
      });
    });
  }
  function saveFromLeft() {
    var data_dict = {
      "module_name": props.resource_name,
      "module_code": edit_content
    };
    (0, _communication_react.postAjaxPromise)("update_from_left", data_dict).then(function (data) {
      statusFuncs.statusMessage("Updated from left");
    })["catch"](function (data) {
      errorDrawerFuncs.addErrorDrawerEntry({
        title: "Error updating from left",
        content: "message" in data ? data.message : ""
      });
    });
  }
  function dirty() {
    return edit_content != savedContent.current;
  }
  var option_list = history_list.map(function (item) {
    return item["updatestring"];
  });
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, !props.controlled, " ", /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    selected: null,
    show_api_links: true,
    page_id: props.resource_viewer_id,
    user_name: window.username
  }), /*#__PURE__*/_react["default"].createElement(_merge_viewer_app.MergeViewerApp, {
    connection_status: connection_status,
    page_id: props.resource_viewer_id,
    resource_viewer_id: props.resource_viewer_id,
    resource_name: props.resource_name,
    option_list: option_list,
    select_val: history_popup_val,
    edit_content: edit_content,
    right_content: right_content,
    handleSelectChange: handleSelectChange,
    handleEditChange: handleEditChange,
    saveHandler: checkpointThenSaveFromLeft
  }));
}
HistoryViewerApp = (0, _sizing_tools.withSizeContext)(/*#__PURE__*/(0, _react.memo)(HistoryViewerApp));
if (!window.in_context) {
  try {
    history_viewer_main().then();
  } catch (e) {
    console.log("Error at the top level");
  }
}
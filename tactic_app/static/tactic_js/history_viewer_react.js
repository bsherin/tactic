"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
require("../tactic_css/tactic.scss");
var _react = _interopRequireWildcard(require("react"));
var ReactDOM = _interopRequireWildcard(require("react-dom"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _merge_viewer_app = require("./merge_viewer_app");
var _toaster = require("./toaster.js");
var _communication_react = require("./communication_react.js");
var _error_drawer = require("./error_drawer.js");
var _sizing_tools = require("./sizing_tools");
var _utilities_react = require("./utilities_react.js");
var _blueprint_navbar = require("./blueprint_navbar");
var _tactic_socket = require("./tactic_socket.js");
var _utilities_react2 = require("./utilities_react");
var _theme = require("./theme");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; } /**
 * Created by bls910
 */
function history_viewer_main() {
  return _history_viewer_main.apply(this, arguments);
}
function _history_viewer_main() {
  _history_viewer_main = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    var gotProps, get_url, data, edit_content, data2, fallback, domContainer, the_element;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          gotProps = function _gotProps(the_props) {
            var HistoryViewerAppPlus = (0, _theme.withTheme)((0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(HistoryViewerApp)));
            var the_element = /*#__PURE__*/_react["default"].createElement(HistoryViewerAppPlus, _extends({}, the_props, {
              controlled: false,
              initial_theme: window.theme,
              changeName: null
            }));
            var domContainer = document.querySelector('#root');
            ReactDOM.render(the_element, domContainer);
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
          _context.next = 22;
          break;
        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](2);
          fallback = "History viewer failed to load";
          if ("message" in _context.t0) {
            fallback = fallback + " " + _context.t0.message;
          }
          domContainer = document.querySelector('#root');
          the_element = /*#__PURE__*/_react["default"].createElement("pre", null, fallback);
          ReactDOM.render(the_element, domContainer);
        case 22:
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
    _useState10 = _slicedToArray(_useState9, 2),
    resource_name = _useState10[0],
    set_resource_name = _useState10[1];
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
HistoryViewerApp.propTypes = {
  resource_name: _propTypes["default"].string,
  history_list: _propTypes["default"].array,
  edit_content: _propTypes["default"].string
};
HistoryViewerApp = (0, _sizing_tools.withSizeContext)( /*#__PURE__*/(0, _react.memo)(HistoryViewerApp));
if (!window.in_context) {
  try {
    history_viewer_main().then();
  } catch (e) {
    console.log("Error at the top level");
  }
}
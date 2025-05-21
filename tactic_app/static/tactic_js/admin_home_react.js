"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
require("../tactic_css/tactic.scss");
require("../tactic_css/tactic_table.scss");
require("../tactic_css/library_home.scss");
var _react = _interopRequireWildcard(require("react"));
var _client = require("react-dom/client");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
var _table = require("@blueprintjs/table");
var _tactic_socket = require("./tactic_socket");
var _toaster = require("./toaster");
var _blueprint_navbar = require("./blueprint_navbar");
var _communication_react = require("./communication_react");
var _modal_react = require("./modal_react");
var _administer_pane = require("./administer_pane");
var _sizing_tools = require("./sizing_tools");
var _resource_viewer_context = require("./resource_viewer_context");
var _error_drawer = require("./error_drawer");
var _utilities_react = require("./utilities_react");
var _library_menubars = require("./library_menubars");
var _settings = require("./settings");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
window.library_id = (0, _utilities_react.guid)();
var MARGIN_SIZE = 17;
var tsocket;
function _administer_home_main() {
  tsocket = new _tactic_socket.TacticSocket("main", 5000, "admin", window.library_id);
  var AdministerHomeAppPlus = (0, _sizing_tools.withSizeContext)((0, _settings.withSettings)((0, _modal_react.withDialogs)((0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(AdministerHomeApp)))));
  var domContainer = document.querySelector('#library-home-root');
  var root = (0, _client.createRoot)(domContainer);
  root.render( /*#__PURE__*/_react["default"].createElement(AdministerHomeAppPlus, {
    tsocket: tsocket
  }));
}
var res_types = ["container", "user"];
var col_names = {
  container: ["Id", "Other_name", "Name", "Image", "Owner", "Status", "Uptime"],
  user: ["_id", "username", "full_name", "last_login", "email", "alt_id", "status"]
};
function NamesToDict(acc, item) {
  acc[item] = "";
  return acc;
}
var initial_pane_states = {};
for (var _i = 0, _res_types = res_types; _i < _res_types.length; _i++) {
  var res_type = _res_types[_i];
  initial_pane_states[res_type] = {
    left_width_fraction: .65,
    selected_resource: col_names[res_type].reduce(NamesToDict, {}),
    tag_button_state: {
      expanded_tags: [],
      active_tag: "all",
      tree: []
    },
    console_text: "",
    search_from_field: false,
    search_from_tag: false,
    sort_field: "updated",
    sorting_field: "updated_for_sort",
    sort_direction: "descending",
    multi_select: false,
    list_of_selected: [],
    search_string: "",
    search_inside: false,
    search_metadata: false,
    selectedRegions: [_table.Regions.row(0)]
  };
}
function AdministerHomeApp(props) {
  var _useState = (0, _react.useState)(),
    _useState2 = _slicedToArray(_useState, 2),
    selected_tab_id = _useState2[0],
    set_selected_tab_id = _useState2[1];
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)(initial_pane_states),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    pane_states = _useStateAndRef2[0],
    set_pane_states = _useStateAndRef2[1],
    pane_states_ref = _useStateAndRef2[2];

  // const [usable_height, set_usable_height] = useState(getUsableDimensions(true).usable_height_no_bottom);
  // const [usable_width, set_usable_width] = useState(getUsableDimensions(true).usable_width - 170);
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  var statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  var top_ref = (0, _react.useRef)(null);
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  (0, _react.useEffect)(function () {
    initSocket();
    statusFuncs.stopSpinner();
    // window.addEventListener("resize", _update_window_dimensions);
    // _update_window_dimensions();
    return function () {
      props.tsocket.disconnect();
    };
  }, []);
  function initSocket() {
    props.tsocket.attachListener("window-open", function (data) {
      return window.open("".concat($SCRIPT_ROOT, "/load_temp_page/").concat(data["the_id"]));
    });
    props.tsocket.attachListener('handle-callback', function (task_packet) {
      (0, _communication_react.handleCallback)(task_packet, window.library_id);
    });
    props.tsocket.attachListener('close-user-windows', function (data) {
      if (!(data["originator"] == window.library_id)) {
        window.close();
      }
    });
    props.tsocket.attachListener('doflashUser', _toaster.doFlash);
  }
  function _updatePaneState(res_type, state_update) {
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var old_state = Object.assign({}, pane_states_ref.current[res_type]);
    var new_pane_states = Object.assign({}, pane_states_ref.current);
    new_pane_states[res_type] = Object.assign(old_state, state_update);
    set_pane_states(new_pane_states);
    pushCallback(callback);
  }
  function _updatePaneStatePromise(res_type, state_update) {
    return new Promise(function (resolve, reject) {
      _updatePaneState(res_type, state_update, resolve);
    });
  }
  function _handleTabChange(newTabId, prevTabId, event) {
    set_selected_tab_id(newTabId);
    pushCallback(_update_window_dimensions);
  }
  function getIconColor(paneId) {
    return paneId == selected_tab_id ? "white" : "#CED9E0";
  }
  var container_pane = /*#__PURE__*/_react["default"].createElement(_administer_pane.AdminPane, _extends({}, props, {
    // usable_width={usable_width}
    // usable_height={usable_height}
    res_type: "container",
    allow_search_inside: false,
    allow_search_metadata: false,
    MenubarClass: ContainerMenubar,
    updatePaneState: _updatePaneState,
    updatePaneStatePromise: _updatePaneStatePromise
  }, pane_states_ref.current["container"], {
    tsocket: tsocket,
    colnames: col_names.container,
    id_field: "Id"
  }));
  var user_pane = /*#__PURE__*/_react["default"].createElement(_administer_pane.AdminPane, _extends({}, props, {
    // usable_width={usable_width}
    // usable_height={usable_height}
    res_type: "user",
    allow_search_inside: false,
    allow_search_metadata: false,
    MenubarClass: UserMenubar,
    updatePaneState: _updatePaneState,
    updatePaneStatePromise: _updatePaneStatePromise
  }, pane_states_ref.current["user"], {
    tsocket: tsocket,
    colnames: col_names.user,
    id_field: "_id"
  }));
  var outer_style = {
    width: "100%",
    // height: usable_height,
    paddingLeft: 0
  };
  var outer_class = "pane-holder";
  if (settingsContext.isDark()) {
    outer_class = "".concat(outer_class, " bp5-dark");
  } else {
    outer_class = "".concat(outer_class, " light-theme");
  }
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    selected: null,
    show_api_links: false,
    extra_text: "",
    page_id: window.library_id,
    user_name: window.username
  }), /*#__PURE__*/_react["default"].createElement(_resource_viewer_context.ViewerContext.Provider, {
    value: {
      readOnly: false
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: outer_class,
    ref: top_ref,
    style: outer_style
  }, /*#__PURE__*/_react["default"].createElement(_core.Tabs, {
    id: "the_container",
    style: {
      marginTop: 100
    },
    selectedTabId: selected_tab_id,
    renderActiveTabPanelOnly: true,
    vertical: true,
    large: true,
    onChange: _handleTabChange
  }, /*#__PURE__*/_react["default"].createElement(_core.Tab, {
    id: "containers-pane",
    panel: container_pane
  }, /*#__PURE__*/_react["default"].createElement(_core.Tooltip, {
    content: "Containers",
    position: _core.Position.RIGHT
  }, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
    icon: "box",
    size: 20,
    tabIndex: -1,
    color: getIconColor("collections-pane")
  }))), /*#__PURE__*/_react["default"].createElement(_core.Tab, {
    id: "users-pane",
    panel: user_pane
  }, /*#__PURE__*/_react["default"].createElement(_core.Tooltip, {
    content: "users",
    position: _core.Position.RIGHT
  }, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
    icon: "user",
    size: 20,
    tabIndex: -1,
    color: getIconColor("collections-pane")
  })))))));
}
AdministerHomeApp = /*#__PURE__*/(0, _react.memo)(AdministerHomeApp);
function ContainerMenubar(props) {
  var statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  function _doFlashStopSpinner(data) {
    statusFuncs.stopSpinner();
    (0, _toaster.doFlash)(data);
  }
  function _container_logs() {
    return _container_logs2.apply(this, arguments);
  }
  function _container_logs2() {
    _container_logs2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var cont_id, data;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            cont_id = props.selected_resource.Id;
            _context.next = 3;
            return (0, _communication_react.postAjaxPromise)('container_logs/' + cont_id);
          case 3:
            data = _context.sent;
            props.setConsoleText(data.log_text);
          case 5:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return _container_logs2.apply(this, arguments);
  }
  function _clear_user_func(_x) {
    return _clear_user_func2.apply(this, arguments);
  }
  function _clear_user_func2() {
    _clear_user_func2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(event) {
      var data;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            statusFuncs.startSpinner();
            _context2.next = 3;
            return (0, _communication_react.postAjaxPromise)('clear_user_containers');
          case 3:
            data = _context2.sent;
            _doFlashStopSpinner(data);
          case 5:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return _clear_user_func2.apply(this, arguments);
  }
  function _reset_server_func(_x2) {
    return _reset_server_func2.apply(this, arguments);
  }
  function _reset_server_func2() {
    _reset_server_func2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(event) {
      var data;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            statusFuncs.startSpinner();
            _context3.next = 3;
            return (0, _communication_react.postAjaxPromise)("reset_server/" + library_id);
          case 3:
            data = _context3.sent;
            _doFlashStopSpinner(data);
          case 5:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
    return _reset_server_func2.apply(this, arguments);
  }
  function _destroy_container() {
    return _destroy_container2.apply(this, arguments);
  }
  function _destroy_container2() {
    _destroy_container2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
      var cont_id, data;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            statusFuncs.startSpinner();
            cont_id = props.selected_resource.Id;
            _context4.prev = 2;
            _context4.next = 5;
            return (0, _communication_react.postAjaxPromise)('kill_container/' + cont_id, {});
          case 5:
            data = _context4.sent;
            _doFlashStopSpinner(data);
            props.delete_row(cont_id);
            _context4.next = 14;
            break;
          case 10:
            _context4.prev = 10;
            _context4.t0 = _context4["catch"](2);
            errorDrawerFuncs.addFromError("Error destroying container", _context4.t0);
            statusFuncs.stopSpinner();
          case 14:
          case "end":
            return _context4.stop();
        }
      }, _callee4, null, [[2, 10]]);
    }));
    return _destroy_container2.apply(this, arguments);
  }
  function menu_specs() {
    return {
      Danger: [{
        name_text: "Reset Host Container",
        icon_name: "reset",
        click_handler: _reset_server_func
      }, {
        name_text: "Kill All User Containers",
        icon_name: "clean",
        click_handler: _clear_user_func
      }, {
        name_text: "Kill One Container",
        icon_name: "console",
        click_handler: _destroy_container
      }]
    };
  }
  return /*#__PURE__*/_react["default"].createElement(_library_menubars.LibraryMenubar, {
    menu_specs: menu_specs(),
    context_menu_items: null,
    multi_select: false,
    controlled: false,
    am_selected: false,
    refreshTab: props.refresh_func,
    closeTab: null,
    resource_name: "",
    showErrorDrawerButton: false
  });
}
ContainerMenubar.propTypes = {
  selected_resource: _propTypes["default"].object,
  list_of_selected: _propTypes["default"].array,
  setConsoleText: _propTypes["default"].func,
  delete_row: _propTypes["default"].func,
  refresh_func: _propTypes["default"].func
};
ContainerMenubar = /*#__PURE__*/(0, _react.memo)(ContainerMenubar);
function UserMenubar(props) {
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  function _delete_user() {
    var user_id = props.selected_resource._id;
    var username = props.selected_resource.username;
    var confirm_text = "Are you sure that you want to delete user ".concat(username, " and all their data ?");
    dialogFuncs.showModal("ConfirmDialog", {
      title: "Delete User",
      text_body: confirm_text,
      cancel_text: "do nothing",
      submit_text: "delete",
      handleSubmit: function handleSubmit() {
        $.getJSON($SCRIPT_ROOT + '/delete_user/' + user_id, _toaster.doFlash);
      },
      handleClose: dialogFuncs.hideModal,
      handleCancel: null
    });
  }
  function _bump_user_alt_id() {
    var user_id = props.selected_resource._id;
    var username = props.selected_resource.username;
    var confirm_text = "Are you sure that you want to bump the id for user " + String(username) + "?  " + "This will effectively log them out";
    dialogFuncs.showModal("ConfirmDialog", {
      title: "Bump User",
      text_body: confirm_text,
      cancel_text: "do nothing",
      submit_text: "bump",
      handleSubmit: function handleSubmit() {
        $.getJSON($SCRIPT_ROOT + '/bump_one_alt_id/' + user_id, _toaster.doFlash);
      },
      handleClose: dialogFuncs.hideModal,
      handleCancel: null
    });
  }
  function _toggle_status() {
    var user_id = props.selected_resource._id;
    $.getJSON($SCRIPT_ROOT + '/toggle_status/' + user_id, _toaster.doFlash);
  }
  function _bump_all_alt_ids() {
    var confirm_text = "Are you sure that you want to bump all alt ids?" + "This will effectively log them out";
    dialogFuncs.showModal("ConfirmDialog", {
      title: "Bump all",
      text_body: confirm_text,
      cancel_text: "do nothing",
      submit_text: "bump",
      handleSubmit: function handleSubmit() {
        $.getJSON($SCRIPT_ROOT + '/bump_all_alt_ids', _toaster.doFlash);
      },
      handleClose: dialogFuncs.hideModal,
      handleCancel: null
    });
  }

  // function _upgrade_all_users () {
  //     const confirm_text = "Are you sure that you want to upgrade all users?";
  //     showConfirmDialogReact("Bump all", confirm_text, "do nothing", "upgrade", function () {
  //         $.getJSON($SCRIPT_ROOT + '/upgrade_all_users', doFlash);
  //     });
  // }

  // function _remove_all_duplicates () {
  //     const confirm_text = "Are you sure that you want to remove all duplicates?";
  //     showConfirmDialogReact("Bump all", confirm_text, "do nothing", "remove", function () {
  //         $.getJSON($SCRIPT_ROOT + '/remove_all_duplicate_collections', doFlash);
  //     });
  // }
  //
  // function update_user_starters (event) {
  //     let user_id = props.selected_resource._id;
  //     const confirm_text = "Are you sure that you want to update starter tiles for user " + String(user_id) + "?";
  //     showConfirmDialogReact("Update User", confirm_text, "do nothing", "update", function () {
  //         $.getJSON($SCRIPT_ROOT + '/update_user_starter_tiles/' + user_id, doFlash);
  //     });
  // }
  //
  // function _migrate_user (event) {
  //     let user_id = props.selected_resource._id;
  //     const confirm_text = "Are you sure that you want to migrate user " + String(user_id) + "?";
  //     showConfirmDialogReact("Migrate User", confirm_text, "do nothing", "migrate", function () {
  //         $.getJSON($SCRIPT_ROOT + '/migrate_user/' + user_id, doFlash);
  //     });
  // }

  function _create_user(event) {
    window.open($SCRIPT_ROOT + '/register');
  }
  function _duplicate_user(event) {
    var username = props.selected_resource.username;
    window.open($SCRIPT_ROOT + '/user_duplicate/' + username);
  }
  function _update_all_collections(event) {
    window.open($SCRIPT_ROOT + '/update_all_collections');
  }
  function menu_specs() {
    return {
      Manage: [{
        name_text: "Create User",
        icon_name: "new-object",
        click_handler: _create_user
      }, {
        name_text: "Toggle Status",
        icon_name: "exchange",
        click_handler: _toggle_status
      }, {
        name_text: "Delete User",
        icon_name: "delete",
        click_handler: _delete_user
      }, {
        name_text: "Bump Alt Id",
        icon_name: "reset",
        click_handler: _bump_user_alt_id
      }, {
        name_text: "Bump All Alt Ids",
        icon_name: "reset",
        click_handler: _bump_all_alt_ids
      }
      // {name_text: "Upgrade all users", icon_name: "reset",
      //     click_handler: _upgrade_all_users},
      // {name_text: "Remove All Duplicates", icon_name: "reset",
      //     click_handler: _remove_all_duplicates},
      ]
    };
  }
  return /*#__PURE__*/_react["default"].createElement(_library_menubars.LibraryMenubar, {
    menu_specs: menu_specs(),
    context_menu_items: null,
    multi_select: false,
    controlled: false,
    am_selected: false,
    refreshTab: props.refresh_func,
    closeTab: null,
    resource_name: "",
    showErrorDrawerButton: false
  });
}
UserMenubar.propTypes = {
  selected_resource: _propTypes["default"].object,
  list_of_selected: _propTypes["default"].array,
  setConsoleText: _propTypes["default"].func,
  delete_row: _propTypes["default"].func,
  refresh_func: _propTypes["default"].func
};
UserMenubar = /*#__PURE__*/(0, _react.memo)(UserMenubar);
_administer_home_main();
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
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return r; }; var t, r = {}, e = Object.prototype, n = e.hasOwnProperty, o = "function" == typeof Symbol ? Symbol : {}, i = o.iterator || "@@iterator", a = o.asyncIterator || "@@asyncIterator", u = o.toStringTag || "@@toStringTag"; function c(t, r, e, n) { return Object.defineProperty(t, r, { value: e, enumerable: !n, configurable: !n, writable: !n }); } try { c({}, ""); } catch (t) { c = function c(t, r, e) { return t[r] = e; }; } function h(r, e, n, o) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype); return c(a, "_invoke", function (r, e, n) { var o = 1; return function (i, a) { if (3 === o) throw Error("Generator is already running"); if (4 === o) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var u = n.delegate; if (u) { var c = d(u, n); if (c) { if (c === f) continue; return c; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (1 === o) throw o = 4, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = 3; var h = s(r, e, n); if ("normal" === h.type) { if (o = n.done ? 4 : 2, h.arg === f) continue; return { value: h.arg, done: n.done }; } "throw" === h.type && (o = 4, n.method = "throw", n.arg = h.arg); } }; }(r, n, new Context(o || [])), !0), a; } function s(t, r, e) { try { return { type: "normal", arg: t.call(r, e) }; } catch (t) { return { type: "throw", arg: t }; } } r.wrap = h; var f = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var l = {}; c(l, i, function () { return this; }); var p = Object.getPrototypeOf, y = p && p(p(x([]))); y && y !== e && n.call(y, i) && (l = y); var v = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(l); function g(t) { ["next", "throw", "return"].forEach(function (r) { c(t, r, function (t) { return this._invoke(r, t); }); }); } function AsyncIterator(t, r) { function e(o, i, a, u) { var c = s(t[o], t, i); if ("throw" !== c.type) { var h = c.arg, f = h.value; return f && "object" == _typeof(f) && n.call(f, "__await") ? r.resolve(f.__await).then(function (t) { e("next", t, a, u); }, function (t) { e("throw", t, a, u); }) : r.resolve(f).then(function (t) { h.value = t, a(h); }, function (t) { return e("throw", t, a, u); }); } u(c.arg); } var o; c(this, "_invoke", function (t, n) { function i() { return new r(function (r, o) { e(t, n, r, o); }); } return o = o ? o.then(i, i) : i(); }, !0); } function d(r, e) { var n = e.method, o = r.i[n]; if (o === t) return e.delegate = null, "throw" === n && r.i["return"] && (e.method = "return", e.arg = t, d(r, e), "throw" === e.method) || "return" !== n && (e.method = "throw", e.arg = new TypeError("The iterator does not provide a '" + n + "' method")), f; var i = s(o, r.i, e.arg); if ("throw" === i.type) return e.method = "throw", e.arg = i.arg, e.delegate = null, f; var a = i.arg; return a ? a.done ? (e[r.r] = a.value, e.next = r.n, "return" !== e.method && (e.method = "next", e.arg = t), e.delegate = null, f) : a : (e.method = "throw", e.arg = new TypeError("iterator result is not an object"), e.delegate = null, f); } function w(t) { this.tryEntries.push(t); } function m(r) { var e = r[4] || {}; e.type = "normal", e.arg = t, r[4] = e; } function Context(t) { this.tryEntries = [[-1]], t.forEach(w, this), this.reset(!0); } function x(r) { if (null != r) { var e = r[i]; if (e) return e.call(r); if ("function" == typeof r.next) return r; if (!isNaN(r.length)) { var o = -1, a = function e() { for (; ++o < r.length;) if (n.call(r, o)) return e.value = r[o], e.done = !1, e; return e.value = t, e.done = !0, e; }; return a.next = a; } } throw new TypeError(_typeof(r) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, c(v, "constructor", GeneratorFunctionPrototype), c(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = c(GeneratorFunctionPrototype, u, "GeneratorFunction"), r.isGeneratorFunction = function (t) { var r = "function" == typeof t && t.constructor; return !!r && (r === GeneratorFunction || "GeneratorFunction" === (r.displayName || r.name)); }, r.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, c(t, u, "GeneratorFunction")), t.prototype = Object.create(v), t; }, r.awrap = function (t) { return { __await: t }; }, g(AsyncIterator.prototype), c(AsyncIterator.prototype, a, function () { return this; }), r.AsyncIterator = AsyncIterator, r.async = function (t, e, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(h(t, e, n, o), i); return r.isGeneratorFunction(e) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, g(v), c(v, u, "Generator"), c(v, i, function () { return this; }), c(v, "toString", function () { return "[object Generator]"; }), r.keys = function (t) { var r = Object(t), e = []; for (var n in r) e.unshift(n); return function t() { for (; e.length;) if ((n = e.pop()) in r) return t.value = n, t.done = !1, t; return t.done = !0, t; }; }, r.values = x, Context.prototype = { constructor: Context, reset: function reset(r) { if (this.prev = this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(m), !r) for (var e in this) "t" === e.charAt(0) && n.call(this, e) && !isNaN(+e.slice(1)) && (this[e] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0][4]; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(r) { if (this.done) throw r; var e = this; function n(t) { a.type = "throw", a.arg = r, e.next = t; } for (var o = e.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i[4], u = this.prev, c = i[1], h = i[2]; if (-1 === i[0]) return n("end"), !1; if (!c && !h) throw Error("try statement without catch or finally"); if (null != i[0] && i[0] <= u) { if (u < c) return this.method = "next", this.arg = t, n(c), !0; if (u < h) return n(h), !1; } } }, abrupt: function abrupt(t, r) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var n = this.tryEntries[e]; if (n[0] > -1 && n[0] <= this.prev && this.prev < n[2]) { var o = n; break; } } o && ("break" === t || "continue" === t) && o[0] <= r && r <= o[2] && (o = null); var i = o ? o[4] : {}; return i.type = t, i.arg = r, o ? (this.method = "next", this.next = o[2], f) : this.complete(i); }, complete: function complete(t, r) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && r && (this.next = r), f; }, finish: function finish(t) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var e = this.tryEntries[r]; if (e[2] === t) return this.complete(e[4], e[3]), m(e), f; } }, "catch": function _catch(t) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var e = this.tryEntries[r]; if (e[0] === t) { var n = e[4]; if ("throw" === n.type) { var o = n.arg; m(e); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(r, e, n) { return this.delegate = { i: x(r), r: e, n: n }, "next" === this.method && (this.arg = t), f; } }, r; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
window.library_id = (0, _utilities_react.guid)();
var MARGIN_SIZE = 17;
var tsocket;
function _administer_home_main() {
  tsocket = new _tactic_socket.TacticSocket("main", 5000, "admin", window.library_id);
  var AdministerHomeAppPlus = (0, _sizing_tools.withSizeContext)((0, _settings.withSettings)((0, _modal_react.withDialogs)((0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(AdministerHomeApp)))));
  var domContainer = document.querySelector('#library-home-root');
  var root = (0, _client.createRoot)(domContainer);
  root.render(/*#__PURE__*/_react["default"].createElement(AdministerHomeAppPlus, {
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
    _container_logs2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
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
    _clear_user_func2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(event) {
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
    _reset_server_func2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(event) {
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
    _destroy_container2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
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
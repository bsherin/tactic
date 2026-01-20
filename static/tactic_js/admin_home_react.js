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
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t3 in e) "default" !== _t3 && {}.hasOwnProperty.call(e, _t3) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t3)) && (i.get || i.set) ? o(f, _t3, i) : f[_t3] = e[_t3]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
window.global_id = "a" + (0, _utilities_react.guid)(); // I don't know why pycharm doesn't like this

var tsocket;
function _administer_home_main() {
  tsocket = new _tactic_socket.TacticSocket("main", 5000, "admin", window.global_id, /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
    var AdministerHomeAppPlus, domContainer, root;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          tsocket.attachListener('handle-callback', function (task_packet) {
            (0, _communication_react.handleCallback)(task_packet, window.global_id);
          });
          AdministerHomeAppPlus = (0, _utilities_react.withRegisterActivity)((0, _settings.withSettings)((0, _modal_react.withDialogs)((0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(AdministerHomeApp)))));
          domContainer = document.querySelector('#library-home-root');
          root = (0, _client.createRoot)(domContainer);
          root.render(/*#__PURE__*/_react["default"].createElement(AdministerHomeAppPlus, {
            tsocket: tsocket
          }));
        case 1:
          return _context.a(2);
      }
    }, _callee);
  })));
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
var LOG_LEVELS = ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"];
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
    set_pane_states = _useStateAndRef2[1],
    pane_states_ref = _useStateAndRef2[2];
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  var statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  var top_ref = (0, _react.useRef)(null);
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  (0, _tactic_socket.useListeners)(props.tsocket, initSocket);
  (0, _react.useEffect)(function () {
    statusFuncs.stopSpinner();
  }, []);
  function initSocket(theSocket) {
    theSocket.attachListener("window-open", function (data) {
      return window.open("".concat($SCRIPT_ROOT, "/load_temp_page/").concat(data["the_id"]));
    });
    theSocket.attachListener('close-user-windows', function (data) {
      if (!(data["originator"] == window.global_id)) {
        window.close();
      }
    });
    theSocket.attachListener('doflashUser', _toaster.doFlash);
    theSocket.attachListener("endSession", function () {
      dialogFuncs.showModal("EndSessionDialog", {});
    });
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
    return new Promise(function (resolve) {
      _updatePaneState(res_type, state_update, resolve);
    });
  }
  function _handleTabChange(newTabId) {
    set_selected_tab_id(newTabId);
  }
  function getIconColor(paneId) {
    return paneId == selected_tab_id ? "white" : "#CED9E0";
  }
  var container_pane = /*#__PURE__*/_react["default"].createElement(_administer_pane.AdminPane, _extends({}, props, {
    res_type: "container",
    allow_search_inside: false,
    allow_search_metadata: false,
    MenubarClass: ContainerMenubar,
    updatePaneState: _updatePaneState,
    updatePaneStatePromise: _updatePaneStatePromise
  }, pane_states_ref.current["container"], {
    tsocket: tsocket,
    extraControls: /*#__PURE__*/_react["default"].createElement(AWSControls, null),
    columns: col_names.container,
    id_field: "Id"
  }));
  var user_pane = /*#__PURE__*/_react["default"].createElement(_administer_pane.AdminPane, _extends({}, props, {
    res_type: "user",
    allow_search_inside: false,
    allow_search_metadata: false,
    MenubarClass: UserMenubar,
    updatePaneState: _updatePaneState,
    updatePaneStatePromise: _updatePaneStatePromise
  }, pane_states_ref.current["user"], {
    tsocket: tsocket,
    extraControls: null,
    columns: col_names.user,
    id_field: "_id"
  }));
  var outer_style = {
    width: "calc(100% - ".concat(_sizing_tools.ICON_BAR_WIDTH, "px)"),
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 0,
    position: "relative"
  };
  var outer_class = "pane-holder admin-pane";
  if (settingsContext.isDark()) {
    outer_class = "".concat(outer_class, " bp6-dark");
  } else {
    outer_class = "".concat(outer_class, " light-theme");
  }
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    selected: null,
    show_api_links: false,
    extra_text: "",
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
    id: "admin-tabs",
    style: {
      marginTop: 100
    },
    selectedTabId: selected_tab_id,
    renderActiveTabPanelOnly: true,
    vertical: true,
    size: "large",
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
function AWSControls(props) {
  var _useState3 = (0, _react.useState)(0),
    _useState4 = _slicedToArray(_useState3, 2),
    desiredIdle = _useState4[0],
    setDesiredIdle = _useState4[1];
  var _useState5 = (0, _react.useState)(0),
    _useState6 = _slicedToArray(_useState5, 2),
    numberOfQueues = _useState6[0],
    setNumberOfQueues = _useState6[1];
  var _useState7 = (0, _react.useState)(""),
    _useState8 = _slicedToArray(_useState7, 2),
    trueLogLevel = _useState8[0],
    setTrueLogLevel = _useState8[1];
  var _useState9 = (0, _react.useState)(""),
    _useState0 = _slicedToArray(_useState9, 2),
    redisLogLevel = _useState0[0],
    setRedisLogLevel = _useState0[1];
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  function grabDesiredIdle() {
    return _grabDesiredIdle.apply(this, arguments);
  }
  function _grabDesiredIdle() {
    _grabDesiredIdle = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            return _context2.a(2, (0, _communication_react.postPromise)("host", "get_desired_idle_tiles", {}));
        }
      }, _callee2);
    }));
    return _grabDesiredIdle.apply(this, arguments);
  }
  function grabQueueCounnt() {
    return _grabQueueCounnt.apply(this, arguments);
  }
  function _grabQueueCounnt() {
    _grabQueueCounnt = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.n) {
          case 0:
            return _context3.a(2, (0, _communication_react.postPromise)("host", "get_queue_count", {}));
        }
      }, _callee3);
    }));
    return _grabQueueCounnt.apply(this, arguments);
  }
  function updateQueueCount() {
    grabQueueCounnt().then(function (data) {
      if (data.success) {
        setNumberOfQueues(data.target_value);
      } else {
        errorDrawerFuncs.addFromError("Error getting queue count", data);
      }
    });
  }
  function getLogLevelInfo() {
    return _getLogLevelInfo.apply(this, arguments);
  }
  function _getLogLevelInfo() {
    _getLogLevelInfo = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.n) {
          case 0:
            return _context4.a(2, (0, _communication_react.postPromise)("host", "get_current_log_level", {}));
        }
      }, _callee4);
    }));
    return _getLogLevelInfo.apply(this, arguments);
  }
  function updateLogLevels() {
    getLogLevelInfo().then(function (data) {
      if (data.success) {
        setTrueLogLevel(data["true_level"]);
        setRedisLogLevel(data["redis_level"]);
      } else {
        errorDrawerFuncs.addFromError("Error getting log level info", data);
      }
    });
  }
  (0, _react.useEffect)(function () {
    grabDesiredIdle().then(function (data) {
      if (data.success) {
        setDesiredIdle(data.target_value);
      } else {
        errorDrawerFuncs.addFromError("Error getting desired idle tiles", data);
      }
    });
    updateQueueCount();
    updateLogLevels();
  }, []);
  function postDesiredIdle(_x) {
    return _postDesiredIdle.apply(this, arguments);
  }
  function _postDesiredIdle() {
    _postDesiredIdle = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(newVal) {
      var data;
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.n) {
          case 0:
            _context5.n = 1;
            return (0, _communication_react.postPromise)("host", "set_desired_idle_tiles", {
              target_value: newVal
            });
          case 1:
            data = _context5.v;
            if (!data.success) {
              errorDrawerFuncs.addFromError("Error setting desired idle tiles", data);
            }
            return _context5.a(2, data.success);
        }
      }, _callee5);
    }));
    return _postDesiredIdle.apply(this, arguments);
  }
  function onChange(_x2) {
    return _onChange.apply(this, arguments);
  }
  function _onChange() {
    _onChange = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(newVal) {
      var oldVal, success;
      return _regenerator().w(function (_context6) {
        while (1) switch (_context6.n) {
          case 0:
            oldVal = desiredIdle;
            if (!(newVal === oldVal)) {
              _context6.n = 1;
              break;
            }
            return _context6.a(2);
          case 1:
            setDesiredIdle(newVal);
            _context6.n = 2;
            return postDesiredIdle(newVal);
          case 2:
            success = _context6.v;
            if (!success) {
              setDesiredIdle(oldVal);
            }
          case 3:
            return _context6.a(2);
        }
      }, _callee6);
    }));
    return _onChange.apply(this, arguments);
  }
  function onLogLevelSelected(newLevel) {
    if (newLevel === redisLogLevel) {
      return;
    }
    (0, _communication_react.postPromise)("host", "set_log_level_task", {
      target_level: newLevel
    }).then(function (data) {
      if (!data.success) {
        errorDrawerFuncs.addFromError("Error setting log level", data);
      } else {
        updateLogLevels();
      }
    });
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "aws-controls",
    style: {
      display: "flex",
      flexDirection: "column",
      width: 300,
      margin: 25
    }
  }, /*#__PURE__*/_react["default"].createElement("h4", null, "AWS Controls"), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      width: 300
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.Label, null, "Desired Idle Tiles: ", desiredIdle, /*#__PURE__*/_react["default"].createElement(_core.Slider, {
    onChange: onChange,
    min: 0,
    max: 50,
    stepSize: 1,
    labelStepSize: 10,
    value: desiredIdle
  })), /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "Number of Queues",
    className: "metadata-form_group",
    inline: true
  }, /*#__PURE__*/_react["default"].createElement("span", {
    style: {
      lineHeight: "30px"
    },
    className: "bp6-ui-text metadata-field"
  }, String(numberOfQueues)), /*#__PURE__*/_react["default"].createElement(_core.Button, {
    style: {
      marginLeft: 10
    },
    onClick: updateQueueCount,
    icon: "refresh"
  })), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      display: "inline-flex"
    }
  }, /*#__PURE__*/_react["default"].createElement("h5", {
    style: {
      marginBottom: 8
    }
  }, "LogLevel"), /*#__PURE__*/_react["default"].createElement(_core.Button, {
    style: {
      marginLeft: 10
    },
    onClick: updateLogLevels,
    icon: "refresh"
  })), /*#__PURE__*/_react["default"].createElement(_core.HTMLSelect, {
    options: LOG_LEVELS,
    onChange: function onChange(e) {
      onLogLevelSelected(e.currentTarget.value);
    },
    value: redisLogLevel
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: "bp6-ui-text metadata-field"
  }, "True: ", String(trueLogLevel)), /*#__PURE__*/_react["default"].createElement("div", {
    className: "bp6-ui-text metadata-field"
  }, "Redis: ", String(redisLogLevel))));
}
function ContainerMenubar(props) {
  var statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  function _doFlashStopSpinner(data) {
    statusFuncs.stopSpinner();
    (0, _toaster.doFlash)(data);
  }
  function _clear_user_func() {
    return _clear_user_func2.apply(this, arguments);
  }
  function _clear_user_func2() {
    _clear_user_func2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
      var data;
      return _regenerator().w(function (_context7) {
        while (1) switch (_context7.n) {
          case 0:
            statusFuncs.startSpinner();
            _context7.n = 1;
            return (0, _communication_react.postPromise)("host", 'clear_user_containers_task', {});
          case 1:
            data = _context7.v;
            _doFlashStopSpinner(data);
          case 2:
            return _context7.a(2);
        }
      }, _callee7);
    }));
    return _clear_user_func2.apply(this, arguments);
  }
  function _reset_server_func() {
    return _reset_server_func2.apply(this, arguments);
  }
  function _reset_server_func2() {
    _reset_server_func2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
      var data;
      return _regenerator().w(function (_context8) {
        while (1) switch (_context8.n) {
          case 0:
            statusFuncs.startSpinner();
            _context8.n = 1;
            return (0, _communication_react.postPromise)("host", "reset_server_task", {});
          case 1:
            data = _context8.v;
            _doFlashStopSpinner(data);
          case 2:
            return _context8.a(2);
        }
      }, _callee8);
    }));
    return _reset_server_func2.apply(this, arguments);
  }
  function _destroy_container() {
    return _destroy_container2.apply(this, arguments);
  }
  function _destroy_container2() {
    _destroy_container2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9() {
      var cont_id, data, _t;
      return _regenerator().w(function (_context9) {
        while (1) switch (_context9.n) {
          case 0:
            statusFuncs.startSpinner();
            cont_id = props.selected_resource.Id;
            _context9.p = 1;
            _context9.n = 2;
            return (0, _communication_react.postPromise)("host", 'kill_container_task', {
              cont_id: cont_id
            });
          case 2:
            data = _context9.v;
            _doFlashStopSpinner(data);
            props.delete_row(cont_id);
            _context9.n = 4;
            break;
          case 3:
            _context9.p = 3;
            _t = _context9.v;
            errorDrawerFuncs.addFromError("Error destroying container", _t);
            statusFuncs.stopSpinner();
          case 4:
            return _context9.a(2);
        }
      }, _callee9, null, [[1, 3]]);
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
  var statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  function _delete_user() {
    var true_id = props.selected_resource._id;
    var username = props.selected_resource.username;
    var confirm_text = "Are you sure that you want to delete user ".concat(username, " and all their data ?");
    dialogFuncs.showModal("ConfirmDialog", {
      title: "Delete User",
      text_body: confirm_text,
      cancel_text: "do nothing",
      submit_text: "delete",
      handleSubmit: function () {
        var _handleSubmit = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0() {
          return _regenerator().w(function (_context0) {
            while (1) switch (_context0.n) {
              case 0:
                (0, _communication_react.postPromise)("host", "delete_user_task", {
                  true_id: true_id
                }).then(_toaster.doFlash);
              case 1:
                return _context0.a(2);
            }
          }, _callee0);
        }));
        function handleSubmit() {
          return _handleSubmit.apply(this, arguments);
        }
        return handleSubmit;
      }(),
      handleClose: dialogFuncs.hideModal,
      handleCancel: null
    });
  }
  function createSeedDatabase() {
    return _createSeedDatabase.apply(this, arguments);
  }
  function _createSeedDatabase() {
    _createSeedDatabase = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11() {
      var data, _t2;
      return _regenerator().w(function (_context11) {
        while (1) switch (_context11.n) {
          case 0:
            statusFuncs.startSpinner();
            _context11.p = 1;
            _context11.n = 2;
            return (0, _communication_react.postPromise)("host", 'create_seed_database_task', {});
          case 2:
            data = _context11.v;
            if (data["success"]) {
              (0, _toaster.doFlash)(data);
              statusFuncs.startSpinner();
            } else {
              statusFuncs.stopSpinner();
              errorDrawerFuncs.addFromError("Error creating seed database", data);
            }
            _context11.n = 4;
            break;
          case 3:
            _context11.p = 3;
            _t2 = _context11.v;
            errorDrawerFuncs.addFromError("Error creating database", _t2);
            statusFuncs.stopSpinner();
          case 4:
            return _context11.a(2);
        }
      }, _callee11, null, [[1, 3]]);
    }));
    return _createSeedDatabase.apply(this, arguments);
  }
  function _create_seed_database() {
    var confirm_text = "Are you sure that you want to create the seed database?";
    dialogFuncs.showModal("ConfirmDialog", {
      title: "Delete User",
      text_body: confirm_text,
      cancel_text: "do nothing",
      submit_text: "create",
      handleSubmit: createSeedDatabase,
      handleClose: dialogFuncs.hideModal,
      handleCancel: null
    });
  }
  function dumpUserDatabase() {
    return _dumpUserDatabase.apply(this, arguments);
  }
  function _dumpUserDatabase() {
    _dumpUserDatabase = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12() {
      var user_id;
      return _regenerator().w(function (_context12) {
        while (1) switch (_context12.n) {
          case 0:
            user_id = props.selected_resource._id;
            statusFuncs.startSpinner();
            (0, _communication_react.postPromise)("host", "create_user_database", {
              user_id: user_id
            }).then(function (data) {
              (0, _toaster.doFlash)(data);
              statusFuncs.startSpinner();
            })["catch"](function (e) {
              errorDrawerFuncs.addFromError("Error creating user database", e);
              statusFuncs.stopSpinner();
            });
          case 1:
            return _context12.a(2);
        }
      }, _callee12);
    }));
    return _dumpUserDatabase.apply(this, arguments);
  }
  function _dump_user_database() {
    var username = props.selected_resource.username;
    var confirm_text = "Do you want to dump a database for " + String(username) + "?  ";
    dialogFuncs.showModal("ConfirmDialog", {
      title: "Bump User",
      text_body: confirm_text,
      cancel_text: "do nothing",
      submit_text: "create",
      handleSubmit: dumpUserDatabase,
      handleClose: dialogFuncs.hideModal,
      handleCancel: null
    });
  }
  function _bump_user_alt_id() {
    var true_id = props.selected_resource._id;
    var username = props.selected_resource.username;
    var confirm_text = "Are you sure that you want to bump the id for user " + String(username) + "?  " + "This will effectively log them out";
    dialogFuncs.showModal("ConfirmDialog", {
      title: "Bump User",
      text_body: confirm_text,
      cancel_text: "do nothing",
      submit_text: "bump",
      handleSubmit: function () {
        var _handleSubmit2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1() {
          return _regenerator().w(function (_context1) {
            while (1) switch (_context1.n) {
              case 0:
                (0, _communication_react.postPromise)("host", "bump_one_alt_id_task", {
                  true_id: true_id
                }).then(_toaster.doFlash);
              case 1:
                return _context1.a(2);
            }
          }, _callee1);
        }));
        function handleSubmit() {
          return _handleSubmit2.apply(this, arguments);
        }
        return handleSubmit;
      }(),
      handleClose: dialogFuncs.hideModal,
      handleCancel: null
    });
  }
  function _toggle_status() {
    return _toggle_status2.apply(this, arguments);
  }
  function _toggle_status2() {
    _toggle_status2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13() {
      var user_id;
      return _regenerator().w(function (_context13) {
        while (1) switch (_context13.n) {
          case 0:
            user_id = props.selected_resource._id;
            (0, _communication_react.postPromise)("host", "toggle_user_status_task", {
              true_id: user_id
            }).then(_toaster.doFlash);
          case 1:
            return _context13.a(2);
        }
      }, _callee13);
    }));
    return _toggle_status2.apply(this, arguments);
  }
  function _bump_all_alt_ids() {
    var confirm_text = "Are you sure that you want to bump all alt ids?" + "This will effectively log them out";
    dialogFuncs.showModal("ConfirmDialog", {
      title: "Bump all",
      text_body: confirm_text,
      cancel_text: "do nothing",
      submit_text: "bump",
      handleSubmit: function () {
        var _handleSubmit3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10() {
          return _regenerator().w(function (_context10) {
            while (1) switch (_context10.n) {
              case 0:
                (0, _communication_react.postPromise)("host", "bump_all_alt_ids_task", {}).then(_toaster.doFlash);
              case 1:
                return _context10.a(2);
            }
          }, _callee10);
        }));
        function handleSubmit() {
          return _handleSubmit3.apply(this, arguments);
        }
        return handleSubmit;
      }(),
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

  function _create_user() {
    window.open($SCRIPT_ROOT + '/register');
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
      }, {
        name_text: "Create Seed Database",
        icon_name: "database",
        click_handler: _create_seed_database
      }, {
        name_text: "Dump a User's Database",
        icon_name: "database",
        click_handler: _dump_user_database
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
UserMenubar.propTypes = {
  selected_resource: _propTypes["default"].object,
  list_of_selected: _propTypes["default"].array,
  setConsoleText: _propTypes["default"].func,
  delete_row: _propTypes["default"].func,
  refresh_func: _propTypes["default"].func
};
UserMenubar = /*#__PURE__*/(0, _react.memo)(UserMenubar);
_administer_home_main();
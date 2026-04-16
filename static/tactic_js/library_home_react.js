"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LibraryHomeApp = LibraryHomeApp;
var _react = _interopRequireWildcard(require("react"));
var _client = require("react-dom/client");
var _tactic_socket = require("./tactic_socket");
var _toaster = require("./toaster.js");
var _library_pane = require("./library_pane");
var _toaster2 = require("./toaster");
var _error_drawer = require("./error_drawer");
var _utilities_react = require("./utilities_react");
var _blueprint_navbar = require("./blueprint_navbar");
var _library_menubars = require("./library_menubars");
var _settings = require("./settings");
var _sizing_tools = require("./sizing_tools");
var _modal_react = require("./modal_react");
var _assistant = require("./assistant");
var _communication_react = require("./communication_react");
var _library_widgets = require("./library_widgets");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
// noinspection JSCheckFunctionSignatures

if (!window.in_context) {
  Promise.resolve().then(function () {
    return _interopRequireWildcard(require("../tactic_css/tactic.scss"));
  });
  Promise.resolve().then(function () {
    return _interopRequireWildcard(require("../tactic_css/tactic_table.scss"));
  });
  Promise.resolve().then(function () {
    return _interopRequireWildcard(require("../tactic_css/library_home.scss"));
  });
  Promise.resolve().then(function () {
    return _interopRequireWildcard(require("../tactic_css/resource_viewer.scss"));
  });
  Promise.resolve().then(function () {
    return _interopRequireWildcard(require("../tactic_css/themeable.scss"));
  });
}
var library_id = "a" + (0, _utilities_react.guid)();
if (!window.in_context) {
  window.global_id = library_id;
}
function LibraryHomeApp(props) {
  var top_ref = (0, _react.useRef)(null);
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  var statusFuncs = (0, _react.useContext)(_toaster2.StatusContext);
  var _useState = (0, _react.useState)([]),
    _useState2 = _slicedToArray(_useState, 2),
    columns = _useState2[0],
    setColumns = _useState2[1];
  var connection_status = (0, _tactic_socket.useConnection)(props.tsocket, initSocket);
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  (0, _react.useEffect)(function () {
    statusFuncs.stopSpinner(null);
  }, []);
  (0, _react.useEffect)(function () {
    setColumns([].concat(_toConsumableArray(_library_widgets.base_columns), _toConsumableArray(settingsContext.settingsRef.current.library_columns)));
  }, [settingsContext.settingsRef.current.library_columns]);
  function initSocket(theSocket) {
    theSocket.attachListener("window-open", function (data) {
      return window.open("".concat($SCRIPT_ROOT, "/load_temp_page/").concat(data["the_id"]));
    });
    if (!window.in_context) {
      theSocket.attachListener("doFlashUser", function (data) {
        (0, _toaster.doFlash)(data);
      });
      theSocket.attachListener('close-user-windows', function (data) {
        if (!(data["originator"] == window.global_id)) {
          window.close();
        }
      });
      theSocket.attachListener("endSession", function () {
        dialogFuncs.showModal("EndSessionDialog", {});
      });
    }
  }
  function updateColumns(new_columns) {
    new_columns = new_columns.filter(function (col) {
      return !_library_widgets.base_columns.includes(col);
    });
    var unique = _toConsumableArray(new Set(new_columns));
    settingsContext.updateSetting("library_columns", unique);
  }
  var lib_props = _objectSpread({}, props);
  var all_pane = /*#__PURE__*/_react["default"].createElement(_library_pane.LibraryPane, _extends({}, lib_props, {
    connection_status: connection_status,
    columns: columns,
    updateColumns: updateColumns,
    handleCreateViewer: props.handleCreateViewer,
    setCurrentMetabook: props.setCurrentMetabook,
    open_resources_ref: props.open_resources_ref,
    allow_search_inside: true,
    allow_search_metadata: true,
    MenubarClass: _library_menubars.AllMenubar
  }, props.errorDrawerFuncs, {
    errorDrawerFuncs: props.errorDrawerFuncs,
    library_id: library_id
  }));
  var outer_style = {
    width: "calc(100% - ".concat(_sizing_tools.ICON_BAR_WIDTH, "px)"),
    height: "calc(100% - ".concat(_sizing_tools.STATUS_BAR_HEIGHT, "px)"),
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 0,
    position: "relative"
  };
  var outer_class = "resource-viewer-holder top";
  if (!window.in_context) {
    outer_style.height = "100%";
    outer_class = "".concat(outer_class, " pane-holder ").concat(settingsContext.isDark() ? "bp6-dark" : "light-theme");
  }
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, !props.controlled && /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    selected: null,
    show_api_links: false,
    extra_text: window.database_type == "Local" ? "" : window.database_type,
    user_name: window.username
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: outer_class,
    ref: top_ref,
    style: outer_style
  }, all_pane));
}
exports.LibraryHomeApp = LibraryHomeApp = /*#__PURE__*/(0, _react.memo)(LibraryHomeApp);
function _library_home_main() {
  var tsocket = new _tactic_socket.TacticSocket("main", 5000, "library", library_id, function () {
    tsocket.attachListener('handle-callback', function (task_packet) {
      (0, _communication_react.handleCallback)(task_packet, library_id);
    });
    var LibraryHomeAppPlus = (0, _utilities_react.withRegisterActivity)((0, _settings.withSettings)((0, _modal_react.withDialogs)((0, _error_drawer.withErrorDrawer)((0, _toaster2.withStatus)((0, _assistant.withAssistant)(LibraryHomeApp))))));
    var domContainer = document.querySelector('#library-home-root');
    var root = (0, _client.createRoot)(domContainer);
    root.render(/*#__PURE__*/_react["default"].createElement(LibraryHomeAppPlus, {
      tsocket: tsocket,
      controlled: false
    }));
  });
}
if (!window.in_context) {
  _library_home_main();
}
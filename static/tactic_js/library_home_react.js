"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LibraryHomeApp = LibraryHomeApp;
exports.library_id = void 0;
require("../tactic_css/tactic.scss");
require("../tactic_css/tactic_table.scss");
require("../tactic_css/library_home.scss");
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
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; } // noinspection JSCheckFunctionSignatures
// import { HotkeysProvider } from "@blueprintjs/core";
var TAB_BAR_WIDTH = 50;
var library_id = exports.library_id = (0, _utilities_react.guid)();
if (!window.in_context) {
  window.main_id = library_id;
}
var tab_panes = ["all-pane", "collections-pane", "projects-pane", "tiles-pane", "lists-pane", "code-pane"];
var controllable_props = ["usable_width", "usable_height"];
function LibraryHomeApp(props) {
  var top_ref = (0, _react.useRef)(null);
  var _useSize = (0, _sizing_tools.useSize)(top_ref, 0, "Library"),
    _useSize2 = _slicedToArray(_useSize, 4),
    usable_width = _useSize2[0],
    usable_height = _useSize2[1],
    topX = _useSize2[2],
    topY = _useSize2[3];
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  var statusFuncs = (0, _react.useContext)(_toaster2.StatusContext);
  var sizeInfo = (0, _react.useContext)(_sizing_tools.SizeContext);
  var connection_status = (0, _utilities_react.useConnection)(props.tsocket, initSocket);
  var pushCallback = (0, _utilities_react.useCallbackStack)("library_home");
  (0, _react.useEffect)(function () {
    statusFuncs.stopSpinner(null);
  }, []);
  function initSocket() {
    props.tsocket.attachListener("window-open", function (data) {
      return window.open("".concat($SCRIPT_ROOT, "/load_temp_page/").concat(data["the_id"]));
    });
    if (!window.in_context) {
      props.tsocket.attachListener("doFlashUser", function (data) {
        (0, _toaster.doFlash)(data);
      });
      props.tsocket.attachListener('close-user-windows', function (data) {
        if (!(data["originator"] == library_id)) {
          window.close();
        }
      });
      props.tsocket.attachListener('handle-callback', function (task_packet) {
        (0, _communication_react.handleCallback)(task_packet, window.main_id);
      });
    }
  }
  var lib_props = _objectSpread({}, props);
  var all_pane = /*#__PURE__*/_react["default"].createElement(_library_pane.LibraryPane, _extends({}, lib_props, {
    connection_status: connection_status,
    columns: {
      "icon:th": {
        first_sort: "ascending"
      },
      "name": {
        first_sort: "ascending"
      },
      "icon:upload": {
        first_sort: "ascending"
      },
      "created": {
        first_sort: "descending"
      },
      "updated": {
        first_sort: "ascending"
      },
      "tags": {
        first_sort: "ascending"
      },
      "size": {
        first_sort: "descending"
      }
    },
    pane_type: "all",
    handleCreateViewer: props.handleCreateViewer,
    open_resources_ref: props.open_resources_ref,
    allow_search_inside: true,
    allow_search_metadata: true,
    MenubarClass: _library_menubars.AllMenubar
  }, props.errorDrawerFuncs, {
    errorDrawerFuncs: props.errorDrawerFuncs,
    library_id: library_id
  }));
  var outer_style = {
    width: "100%",
    paddingLeft: 0
  };
  var outer_class = "";
  if (!window.in_context) {
    outer_style.height = "100%";
    outer_class = "pane-holder  ";
    if (settingsContext.isDark()) {
      outer_class = "".concat(outer_class, " bp6-dark");
    } else {
      outer_class = "".concat(outer_class, " light-theme");
    }
  }
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, !props.controlled && /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    selected: null,
    show_api_links: false,
    extra_text: window.database_type == "Local" ? "" : window.database_type,
    page_id: library_id,
    user_name: window.username
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: outer_class,
    ref: top_ref,
    style: outer_style
  }, /*#__PURE__*/_react["default"].createElement(_sizing_tools.SizeContext.Provider, {
    value: {
      topX: topX,
      topY: topY,
      availableWidth: usable_width,
      availableHeight: usable_height - _sizing_tools.BOTTOM_MARGIN
    }
  }, all_pane)));
}
exports.LibraryHomeApp = LibraryHomeApp = /*#__PURE__*/(0, _react.memo)(LibraryHomeApp);
function _library_home_main() {
  var tsocket = new _tactic_socket.TacticSocket("main", 5000, "library", library_id);
  var LibraryHomeAppPlus = (0, _sizing_tools.withSizeContext)((0, _settings.withSettings)((0, _modal_react.withDialogs)((0, _error_drawer.withErrorDrawer)((0, _toaster2.withStatus)((0, _assistant.withAssistant)(LibraryHomeApp))))));
  var domContainer = document.querySelector('#library-home-root');
  var root = (0, _client.createRoot)(domContainer);
  root.render(
  /*#__PURE__*/
  //<HotkeysProvider>
  _react["default"].createElement(LibraryHomeAppPlus, {
    tsocket: tsocket,
    controlled: false
  })
  //</HotkeysProvider>
  );
}
if (!window.in_context) {
  _library_home_main();
}
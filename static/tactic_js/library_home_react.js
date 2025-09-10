"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LibraryHomeApp = LibraryHomeApp;
exports.library_id = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
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
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
// noinspection JSCheckFunctionSignatures

if (!window.in_context) {
  Promise.resolve().then(() => _interopRequireWildcard(require("../tactic_css/tactic.scss")));
  Promise.resolve().then(() => _interopRequireWildcard(require("../tactic_css/tactic_table.scss")));
  Promise.resolve().then(() => _interopRequireWildcard(require("../tactic_css/library_home.scss")));
  Promise.resolve().then(() => _interopRequireWildcard(require("../tactic_css/resource_viewer.scss")));
  Promise.resolve().then(() => _interopRequireWildcard(require("../tactic_css/themeable.scss")));
}
const library_id = exports.library_id = (0, _utilities_react.guid)();
if (!window.in_context) {
  window.main_id = library_id;
}
function LibraryHomeApp(props) {
  const top_ref = (0, _react.useRef)(null);
  const settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  const statusFuncs = (0, _react.useContext)(_toaster2.StatusContext);
  const [columns, setColumns] = (0, _react.useState)([]);
  const connection_status = (0, _utilities_react.useConnection)(props.tsocket, initSocket);
  (0, _react.useEffect)(() => {
    statusFuncs.stopSpinner(null);
  }, []);
  (0, _react.useEffect)(() => {
    setColumns([..._library_widgets.base_columns, ...settingsContext.settingsRef.current.library_columns]);
  }, [settingsContext.settingsRef.current.library_columns]);
  function initSocket() {
    props.tsocket.attachListener("window-open", data => window.open(`${$SCRIPT_ROOT}/load_temp_page/${data["the_id"]}`));
    if (!window.in_context) {
      props.tsocket.attachListener("doFlashUser", function (data) {
        (0, _toaster.doFlash)(data);
      });
      props.tsocket.attachListener('close-user-windows', data => {
        if (!(data["originator"] == library_id)) {
          window.close();
        }
      });
      props.tsocket.attachListener('handle-callback', task_packet => {
        (0, _communication_react.handleCallback)(task_packet, window.main_id);
      });
    }
  }
  function updateColumns(new_columns) {
    new_columns = new_columns.filter(col => !_library_widgets.base_columns.includes(col));
    const unique = [...new Set(new_columns)];
    settingsContext.updateSetting("library_columns", unique);
  }
  let lib_props = {
    ...props
  };
  let all_pane = /*#__PURE__*/_react.default.createElement(_library_pane.LibraryPane, (0, _extends2.default)({}, lib_props, {
    connection_status: connection_status,
    columns: columns,
    updateColumns: updateColumns,
    handleCreateViewer: props.handleCreateViewer,
    open_resources_ref: props.open_resources_ref,
    allow_search_inside: true,
    allow_search_metadata: true,
    MenubarClass: _library_menubars.AllMenubar
  }, props.errorDrawerFuncs, {
    errorDrawerFuncs: props.errorDrawerFuncs,
    library_id: library_id
  }));
  let outer_style = {
    width: `calc(100% - ${_sizing_tools.ICON_BAR_WIDTH}px)`,
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 0,
    position: "relative"
  };
  let outer_class = "resource-viewer-holder top";
  if (!window.in_context) {
    outer_style.height = "100%";
    outer_class = `${outer_class} pane-holder ${settingsContext.isDark() ? "bp6-dark" : "light-theme"}`;
  }
  return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, !props.controlled && /*#__PURE__*/_react.default.createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    selected: null,
    show_api_links: false,
    extra_text: window.database_type == "Local" ? "" : window.database_type,
    page_id: library_id,
    user_name: window.username
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: outer_class,
    ref: top_ref,
    style: outer_style
  }, all_pane));
}
exports.LibraryHomeApp = LibraryHomeApp = /*#__PURE__*/(0, _react.memo)(LibraryHomeApp);
function _library_home_main() {
  const tsocket = new _tactic_socket.TacticSocket("main", 5000, "library", library_id);
  const LibraryHomeAppPlus = (0, _settings.withSettings)((0, _modal_react.withDialogs)((0, _error_drawer.withErrorDrawer)((0, _toaster2.withStatus)((0, _assistant.withAssistant)(LibraryHomeApp)))));
  const domContainer = document.querySelector('#library-home-root');
  const root = (0, _client.createRoot)(domContainer);
  root.render(/*#__PURE__*/_react.default.createElement(LibraryHomeAppPlus, {
    tsocket: tsocket,
    controlled: false
  }));
}
if (!window.in_context) {
  _library_home_main();
}
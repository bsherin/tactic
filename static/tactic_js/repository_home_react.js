"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RepositoryHomeApp = RepositoryHomeApp;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
require("../tactic_css/tactic.scss");
require("../tactic_css/tactic_table.scss");
require("../tactic_css/library_home.scss");
require("../tactic_css/resource_viewer.scss");
var _react = _interopRequireWildcard(require("react"));
var _client = require("react-dom/client");
var _tactic_socket = require("./tactic_socket");
var _communication_react = require("./communication_react");
var _library_pane = require("./library_pane");
var _toaster = require("./toaster");
var _error_drawer = require("./error_drawer");
var _utilities_react = require("./utilities_react");
var _blueprint_navbar = require("./blueprint_navbar");
var _settings = require("./settings");
var _modal_react = require("./modal_react");
var _repository_menubars = require("./repository_menubars");
var _sizing_tools = require("./sizing_tools");
var _library_widgets = require("./library_widgets");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const library_id = "a" + (0, _utilities_react.guid)();
window.global_id = library_id;
let tsocket;
function RepositoryHomeApp(props) {
  const connection_status = (0, _utilities_react.useConnection)(props.tsocket, initSocket);
  const settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  const statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  const top_ref = (0, _react.useRef)(null);
  (0, _react.useEffect)(() => {
    statusFuncs.stopSpinner();
  }, []);
  function initSocket() {
    let tsocket = props.tsocket;
    tsocket.attachListener("window-open", data => window.open(`${$SCRIPT_ROOT}/load_temp_page/${data["the_id"]}`));
    if (!window.in_context) {
      tsocket.attachListener('close-user-windows', data => {
        if (!(data["originator"] == window.global_id)) {
          window.close();
        }
      });
    }
  }
  let lib_props = {
    ...props
  };
  let all_pane = /*#__PURE__*/_react.default.createElement(_library_pane.LibraryPane, (0, _extends2.default)({}, lib_props, {
    connection_status: connection_status,
    columns: _library_widgets.all_columns,
    updateColumns: null,
    handleCreateViewer: null,
    open_resources_ref: null,
    allow_search_inside: true,
    allow_search_metadata: true,
    MenubarClass: _repository_menubars.RepositoryAllMenubar
  }, props.errorDrawerFuncs, {
    errorDrawerFuncs: props.errorDrawerFuncs,
    library_id: library_id,
    is_repository: true
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
  outer_style.height = "100%";
  outer_class = `${outer_class} pane-holder ${settingsContext.isDark() ? "bp6-dark" : "light-theme"}`;
  return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    selected: null,
    global_id: window.global_id,
    show_api_links: false,
    extra_text: window.repository_type == "Local" ? "" : window.repository_type,
    user_name: window.username
  }), /*#__PURE__*/_react.default.createElement("div", {
    id: "repository_container",
    className: outer_class,
    ref: top_ref,
    style: outer_style
  }, all_pane));
}
exports.RepositoryHomeApp = RepositoryHomeApp = /*#__PURE__*/(0, _react.memo)(RepositoryHomeApp);
function _repository_home_main() {
  tsocket = new _tactic_socket.TacticSocket("main", 5000, "repository", library_id, () => {
    tsocket.attachListener('handle-callback', task_packet => {
      (0, _communication_react.handleCallback)(task_packet, library_id);
    });
    tsocket.socket.emit('join-repository', {});
    let RepositoryHomeAppPlus = (0, _settings.withSettings)((0, _modal_react.withDialogs)((0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(RepositoryHomeApp))));
    const domContainer = document.querySelector('#library-home-root');
    const root = (0, _client.createRoot)(domContainer);
    root.render(/*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        position: "relative",
        height: "100%",
        width: "100%"
      }
    }, /*#__PURE__*/_react.default.createElement(RepositoryHomeAppPlus, {
      controlled: false,
      tsocket: tsocket
    })));
  });
}
_repository_home_main();
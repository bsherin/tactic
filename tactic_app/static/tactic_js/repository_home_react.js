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
var _react = _interopRequireWildcard(require("react"));
var _client = require("react-dom/client");
var _tactic_socket = require("./tactic_socket");
var _communication_react = require("./communication_react");
var _library_pane = require("./library_pane");
var _toaster = require("./toaster");
var _error_drawer = require("./error_drawer");
var _utilities_react = require("./utilities_react");
var _blueprint_navbar = require("./blueprint_navbar");
var _theme = require("./theme");
var _modal_react = require("./modal_react");
var _repository_menubars = require("./repository_menubars");
var _library_home_react = require("./library_home_react");
var _sizing_tools = require("./sizing_tools");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const MARGIN_SIZE = 17;
let tsocket;
const controllable_props = ["usable_height", "usable_width"];
function RepositoryHomeApp(props) {
  const connection_status = (0, _utilities_react.useConnection)(props.tsocket, initSocket);
  const theme = (0, _react.useContext)(_theme.ThemeContext);
  const statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  const top_ref = (0, _react.useRef)(null);
  const [usable_width, usable_height, topX, topY] = (0, _sizing_tools.useSize)(top_ref, 0, "Repository");
  const pushCallback = (0, _utilities_react.useCallbackStack)("repository_home");
  (0, _react.useEffect)(() => {
    statusFuncs.stopSpinner();
  }, []);
  function initSocket() {
    let tsocket = props.tsocket;
    tsocket.attachListener("window-open", data => window.open(`${$SCRIPT_ROOT}/load_temp_page/${data["the_id"]}`));
    if (!window.in_context) {
      tsocket.attachListener('handle-callback', task_packet => {
        (0, _communication_react.handleCallback)(task_packet, window.library_id);
      });
      tsocket.attachListener('close-user-windows', data => {
        if (!(data["originator"] == window.library_id)) {
          window.close();
        }
      });
    }
  }
  function getIconColor(paneId) {
    return paneId == selected_tab_id ? "white" : "#CED9E0";
  }
  let lib_props = {
    ...props
  };
  let all_pane = /*#__PURE__*/_react.default.createElement(_library_pane.LibraryPane, (0, _extends2.default)({}, lib_props, {
    connection_status: connection_status,
    columns: {
      "icon:th": {
        "first_sort": "ascending"
      },
      "name": {
        "first_sort": "ascending"
      },
      "icon:upload": {
        "first_sort": "ascending"
      },
      "created": {
        "first_sort": "descending"
      },
      "updated": {
        "first_sort": "ascending"
      },
      "tags": {
        "first_sort": "ascending"
      },
      "size": {
        "first_sort": "descending"
      }
    },
    pane_type: "all",
    handleCreateViewer: null,
    open_resources_ref: null,
    allow_search_inside: true,
    allow_search_metadata: true,
    MenubarClass: _repository_menubars.RepositoryAllMenubar
  }, props.errorDrawerFuncs, {
    errorDrawerFuncs: props.errorDrawerFuncs,
    library_id: _library_home_react.library_id,
    is_repository: true
  }));
  let outer_style = {
    width: "100%",
    height: "100%",
    paddingLeft: 0
  };
  let outer_class = "library-pane-holder  ";
  if (theme.dark_theme) {
    outer_class = `${outer_class} bp5-dark`;
  } else {
    outer_class = `${outer_class} light-theme`;
  }
  return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    selected: null,
    page_id: _library_home_react.library_id,
    show_api_links: false,
    extra_text: window.repository_type == "Local" ? "" : window.repository_type,
    user_name: window.username
  }), /*#__PURE__*/_react.default.createElement("div", {
    id: "repository_container",
    className: outer_class,
    ref: top_ref,
    style: outer_style
  }, /*#__PURE__*/_react.default.createElement(_sizing_tools.SizeContext.Provider, {
    value: {
      topX: topX,
      topY: topY,
      availableWidth: usable_width,
      availableHeight: usable_height - _sizing_tools.BOTTOM_MARGIN
    }
  }, all_pane)));
}
exports.RepositoryHomeApp = RepositoryHomeApp = /*#__PURE__*/(0, _react.memo)(RepositoryHomeApp);
function _repository_home_main() {
  tsocket = new _tactic_socket.TacticSocket("main", 5000, "repository", _library_home_react.library_id);
  tsocket.socket.emit('join-repository', {});
  let RepositoryHomeAppPlus = (0, _sizing_tools.withSizeContext)((0, _theme.withTheme)((0, _modal_react.withDialogs)((0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(RepositoryHomeApp)))));
  const domContainer = document.querySelector('#library-home-root');
  const root = (0, _client.createRoot)(domContainer);
  root.render( /*#__PURE__*/_react.default.createElement(RepositoryHomeAppPlus, {
    initial_theme: window.theme,
    controlled: false,
    tsocket: tsocket
  }));
}
_repository_home_main();
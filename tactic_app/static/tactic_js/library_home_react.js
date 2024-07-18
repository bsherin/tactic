"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LibraryHomeApp = LibraryHomeApp;
exports.library_id = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
require("../tactic_css/tactic.scss");
require("../tactic_css/tactic_table.scss");
require("../tactic_css/library_home.scss");
var _react = _interopRequireWildcard(require("react"));
var _client = require("react-dom/client");
var _core = require("@blueprintjs/core");
var _tactic_socket = require("./tactic_socket");
var _toaster = require("./toaster.js");
var _library_pane = require("./library_pane");
var _toaster2 = require("./toaster");
var _error_drawer = require("./error_drawer");
var _utilities_react = require("./utilities_react");
var _blueprint_navbar = require("./blueprint_navbar");
var _library_menubars = require("./library_menubars");
var _theme = require("./theme");
var _sizing_tools = require("./sizing_tools");
var _modal_react = require("./modal_react");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// noinspection JSCheckFunctionSignatures

const TAB_BAR_WIDTH = 50;
const library_id = exports.library_id = (0, _utilities_react.guid)();
const tab_panes = ["all-pane", "collections-pane", "projects-pane", "tiles-pane", "lists-pane", "code-pane"];
const controllable_props = ["usable_width", "usable_height"];
function LibraryHomeApp(props) {
  const top_ref = (0, _react.useRef)(null);
  const [usable_width, usable_height, topX, topY] = (0, _sizing_tools.useSize)(top_ref, 0, "Library");
  const theme = (0, _react.useContext)(_theme.ThemeContext);
  const statusFuncs = (0, _react.useContext)(_toaster2.StatusContext);
  const sizeInfo = (0, _react.useContext)(_sizing_tools.SizeContext);
  const connection_status = (0, _utilities_react.useConnection)(props.tsocket, initSocket);
  const pushCallback = (0, _utilities_react.useCallbackStack)("library_home");
  (0, _react.useEffect)(() => {
    statusFuncs.stopSpinner(null);
  }, []);
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
    }
  }
  let lib_props = {
    ...props
  };
  let all_pane = /*#__PURE__*/_react.default.createElement(_library_pane.LibraryPane, (0, _extends2.default)({}, lib_props, {
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
  let outer_style = {
    width: "100%",
    paddingLeft: 0
  };
  let outer_class = "";
  if (!window.in_context) {
    outer_style.height = "100%";
    outer_class = "pane-holder  ";
    if (theme.dark_theme) {
      outer_class = `${outer_class} bp5-dark`;
    } else {
      outer_class = `${outer_class} light-theme`;
    }
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
  }, /*#__PURE__*/_react.default.createElement(_sizing_tools.SizeContext.Provider, {
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
  const tsocket = new _tactic_socket.TacticSocket("main", 5000, "library", library_id);
  const LibraryHomeAppPlus = (0, _sizing_tools.withSizeContext)((0, _theme.withTheme)((0, _modal_react.withDialogs)((0, _error_drawer.withErrorDrawer)((0, _toaster2.withStatus)(LibraryHomeApp)))));
  const domContainer = document.querySelector('#library-home-root');
  const root = (0, _client.createRoot)(domContainer);
  root.render( /*#__PURE__*/_react.default.createElement(_core.HotkeysProvider, null, /*#__PURE__*/_react.default.createElement(LibraryHomeAppPlus, {
    tsocket: tsocket,
    controlled: false,
    initial_theme: window.theme
  })));
}
if (!window.in_context) {
  _library_home_main();
}
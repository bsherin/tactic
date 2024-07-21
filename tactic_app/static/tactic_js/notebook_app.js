"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NotebookApp = NotebookApp;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
require("../tactic_css/tactic.scss");
require("../tactic_css/tactic_console.scss");
require("../tactic_css/tactic_main.scss");
var _react = _interopRequireWildcard(require("react"));
var _client = require("react-dom/client");
var _blueprint_navbar = require("./blueprint_navbar");
var _menu_utilities = require("./menu_utilities");
var _main_menus_react = require("./main_menus_react");
var _console_component = require("./console_component");
var _console_support = require("./console_support");
var _toaster = require("./toaster");
var _utilities_react = require("./utilities_react");
var _communication_react = require("./communication_react");
var _export_viewer_react = require("./export_viewer_react");
var _resizing_layouts = require("./resizing_layouts2");
var _error_drawer = require("./error_drawer");
var _sizing_tools = require("./sizing_tools");
var _assistant = require("./assistant");
var _notebook_support = require("./notebook_support");
var _theme = require("./theme");
var _modal_react = require("./modal_react");
var _metadata_drawer = require("./metadata_drawer");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
//import { HotkeysProvider } from "@blueprintjs/core";

const MARGIN_SIZE = 10;
const BOTTOM_MARGIN = 35;
const MARGIN_ADJUSTMENT = 8; // This is the amount at the top of both the table and the conso
const MENU_BAR_HEIGHT = 30; // will only appear when in context

const cc_style = {
  marginTop: MARGIN_SIZE
};
function NotebookApp(props) {
  props = {
    refreshTab: null,
    closeTab: null,
    ...props
  };
  const last_save = (0, _react.useRef)({});
  const main_outer_ref = (0, _react.useRef)(null);
  const updateExportsList = (0, _react.useRef)(null);
  const connection_status = (0, _utilities_react.useConnection)(props.tsocket, initSocket);
  const [console_selected_items, set_console_selected_items, console_selected_items_ref] = (0, _utilities_react.useStateAndRef)([]);
  const [console_items, dispatch, console_items_ref] = (0, _utilities_react.useReducerAndRef)(_console_support.consoleItemsReducer, []);
  const [mState, mDispatch] = (0, _react.useReducer)(_notebook_support.notebookReducer, {
    show_exports_pane: props.is_project && props.interface_state ? props.interface_state["show_exports_pane"] : true,
    console_width_fraction: props.is_project && props.interface_state && "console_width_fraction" in props.interface_state ? props.interface_state["console_width_fraction"] : .5,
    console_is_zoomed: true,
    console_is_shrunk: false,
    resource_name: props.resource_name,
    is_project: props.is_project,
    show_metadata: false
  });
  const theme = (0, _react.useContext)(_theme.ThemeContext);
  const statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  const errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  const pushCallback = (0, _utilities_react.useCallbackStack)();
  const selectedPane = (0, _react.useContext)(_utilities_react.SelectedPaneContext);
  const [usable_width, usable_height, topX, topY] = (0, _sizing_tools.useSize)(main_outer_ref, 0, "NotebookApp");
  (0, _utilities_react.useConstructor)(() => {
    dispatch({
      type: "initialize",
      new_items: props.is_project && props.interface_state ? props.interface_state["console_items"] : []
    });
  });
  (0, _react.useEffect)(() => {
    if (props.controlled) {
      props.registerDirtyMethod(_dirty);
    } else {
      window.addEventListener("beforeunload", function (e) {
        if (_dirty()) {
          e.preventDefault();
          e.returnValue = '';
        }
      });
    }
    function sendRemove() {
      console.log("got the beacon");
      navigator.sendBeacon("/remove_mainwindow", JSON.stringify({
        "main_id": props.main_id
      }));
    }
    window.addEventListener("unload", sendRemove);
    _updateLastSave();
    statusFuncs.stopSpinner();
    if (!props.controlled) {
      document.title = mState.resource_name;
    }
    return () => {
      delete_my_containers();
      window.removeEventListener("unload", sendRemove);
    };
  }, []);
  function am_selected() {
    return selectedPane.amSelected(selectedPane.tab_id, selectedPane.selectedTabIdRef);
  }
  function _cProp(pname) {
    return props.controlled ? props[pname] : mState[pname];
  }
  const save_state = {
    console_items: console_items,
    show_exports_pane: mState.show_exports_pane,
    console_width_fraction: mState.console_width_fraction
  };
  const _setMainStateValue = (0, _react.useCallback)(function (field_name, new_value) {
    let callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    mDispatch({
      type: "change_field",
      field: field_name,
      new_value: new_value
    });
    pushCallback(callback);
  }, []);
  function _updateLastSave() {
    last_save.current = save_state;
  }
  function _dirty() {
    let current_state = save_state;
    for (let k in current_state) {
      if (current_state[k] != last_save.current[k]) {
        return true;
      }
    }
    return false;
  }
  function delete_my_containers() {
    (0, _communication_react.postAjax)("/remove_mainwindow", {
      "main_id": props.main_id
    });
  }
  function initSocket() {
    props.tsocket.attachListener("window-open", data => {
      window.open(`${$SCRIPT_ROOT}/load_temp_page/${data["the_id"]}`);
    });
    if (!window.in_context) {
      props.tsocket.attachListener("doFlashUser", function (data) {
        (0, _toaster.doFlash)(data);
      });
      props.tsocket.attachListener('close-user-windows', function (data) {
        if (!(data["originator"] == main_id)) {
          window.close();
        }
      });
    }
  }
  const _handleConsoleFractionChange = (0, _react.useCallback)((left_width, right_width, new_fraction) => {
    _setMainStateValue("console_width_fraction", new_fraction);
  }, []);
  function _setProjectName(new_project_name) {
    let callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    if (props.controlled) {
      props.updatePanel({
        res_type: "project",
        title: new_project_name,
        panel: {
          resource_name: new_project_name,
          is_project: true
        }
      }, () => {
        pushCallback(callback);
      });
    } else {
      mDispatch({
        type: "change_multiple_fields",
        newPartialState: {
          resource_name: new_project_name,
          is_project: true
        }
      });
      pushCallback(callback);
    }
  }
  function showMetadata() {
    _setMainStateValue("show_metadata", true);
  }
  function hideMetadata() {
    _setMainStateValue("show_metadata", false);
  }
  let my_props = {
    ...props
  };
  if (!props.controlled) {
    my_props.resource_name = mState.resource_name;
    my_props.is_project = mState.is_project;
  }
  let project_name = my_props.is_project ? props.resource_name : "";
  let menus = /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(_main_menus_react.ProjectMenu, {
    main_id: props.main_id,
    project_name: project_name,
    is_notebook: true,
    is_juptyer: props.is_jupyter,
    setProjectName: _setProjectName,
    console_items: console_items_ref.current,
    tile_list: [],
    mState: mState,
    setMainStateValue: _setMainStateValue,
    updateLastSave: _updateLastSave,
    changeCollection: null,
    disabled_items: my_props.is_project ? [] : ["Save"],
    hidden_items: ["Open Console as Notebook", "Export Table as Collection", "divider2", "Change collection"]
  }), /*#__PURE__*/_react.default.createElement(_main_menus_react.ViewMenu, {
    main_id: props.main_id,
    project_name: project_name,
    is_notebook: true,
    is_juptyer: props.is_jupyter,
    table_is_shrunk: true,
    toggleTableShrink: null,
    show_exports_pane: mState.show_exports_pane,
    show_console_pane: true,
    show_metadata: mState.show_metadata,
    setMainStateValue: _setMainStateValue
  }));
  let console_pane = /*#__PURE__*/_react.default.createElement(_console_component.ConsoleComponent, {
    main_id: props.main_id,
    tsocket: props.tsocket,
    handleCreateViewer: props.handleCreateViewer,
    controlled: props.controlled,
    console_items: console_items_ref,
    console_selected_items_ref: console_selected_items_ref,
    set_console_selected_items: set_console_selected_items,
    dispatch: dispatch,
    mState: mState,
    setMainStateValue: _setMainStateValue,
    zoomable: false,
    shrinkable: false,
    style: cc_style
  });
  let exports_pane;
  if (mState.show_exports_pane) {
    exports_pane = /*#__PURE__*/_react.default.createElement(_export_viewer_react.ExportsViewer, {
      main_id: props.main_id,
      tsocket: props.tsocket,
      setUpdate: ufunc => {
        updateExportsList.current = ufunc;
      },
      console_is_shrunk: mState.console_is_shrunk,
      console_is_zoomed: mState.console_is_zoomed,
      style: cc_style
    });
  } else {
    exports_pane = /*#__PURE__*/_react.default.createElement("div", null);
  }
  const outer_style = (0, _react.useMemo)(() => {
    return {
      width: "100%",
      height: usable_height
    };
  }, [usable_height]);
  return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, !window.in_context && /*#__PURE__*/_react.default.createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    user_name: window.username,
    menus: null,
    page_id: props.main_id
  }), /*#__PURE__*/_react.default.createElement(_menu_utilities.TacticMenubar, {
    connection_status: connection_status,
    menus: menus,
    showRefresh: true,
    showClose: true,
    page_id: props.main_id,
    refreshTab: props.refreshTab,
    closeTab: props.closeTab,
    resource_name: _cProp("resource_name"),
    showIconBar: true,
    showErrorDrawerButton: true,
    showMetadataDrawerButton: true,
    showAssistantDrawerButton: true,
    showMetadata: showMetadata
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: `main-outer ${theme.dark_theme ? "bp5-dark" : "light-theme"}`,
    ref: main_outer_ref,
    style: outer_style
  }, /*#__PURE__*/_react.default.createElement(_sizing_tools.SizeProvider, {
    value: {
      availableWidth: usable_width,
      availableHeight: usable_height - BOTTOM_MARGIN,
      topX: topX,
      topY: topY
    }
  }, /*#__PURE__*/_react.default.createElement(_resizing_layouts.HorizontalPanes, {
    left_pane: console_pane,
    right_pane: exports_pane,
    show_handle: true,
    initial_width_fraction: mState.console_width_fraction,
    controlled: true,
    dragIconSize: 15,
    handleSplitUpdate: _handleConsoleFractionChange
  }))), /*#__PURE__*/_react.default.createElement(_metadata_drawer.MetadataDrawer, {
    res_type: "project",
    res_name: project_name,
    readOnly: false,
    is_repository: false,
    show_drawer: mState.show_metadata,
    position: "right",
    onClose: hideMetadata,
    size: "45%"
  }));
}
exports.NotebookApp = NotebookApp = /*#__PURE__*/(0, _react.memo)(NotebookApp);
function main_main() {
  function gotProps(the_props) {
    let NotebookAppPlus = (0, _sizing_tools.withSizeContext)((0, _theme.withTheme)((0, _modal_react.withDialogs)((0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)((0, _assistant.withAssistant)(NotebookApp))))));
    let the_element = /*#__PURE__*/_react.default.createElement(NotebookAppPlus, (0, _extends2.default)({}, the_props, {
      controlled: false,
      initial_theme: window.theme,
      changeName: null
    }));
    const domContainer = document.querySelector('#main-root');
    const root = (0, _client.createRoot)(domContainer);
    root.render(
    //<HotkeysProvider>
    the_element
    //</HotkeysProvider>
    );
  }
  (0, _utilities_react.renderSpinnerMessage)("Starting up ...");
  var target = window.is_new_notebook ? "new_notebook_in_context" : "main_project_in_context";
  var resource_name = window.is_new_notebook ? "" : window.project_name;
  let post_data = {
    "resource_name": resource_name
  };
  if (window.is_new_notebook) {
    post_data.temp_data_id = window.temp_data_id;
  }
  (0, _communication_react.postAjaxPromise)(target, post_data).then(data => {
    (0, _notebook_support.notebook_props)(data, null, gotProps);
  });
}
if (!window.in_context) {
  main_main();
}
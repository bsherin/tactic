"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NotebookApp = NotebookApp;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _tactic_socket = require("./tactic_socket");
var _utilities_react = require("./utilities_react");
var _react = _interopRequireWildcard(require("react"));
var _client = require("react-dom/client");
var _blueprint_navbar = require("./blueprint_navbar");
var _menu_utilities = require("./menu_utilities");
var _main_menus_react = require("./main_menus_react");
var _console_component = require("./console_component");
var _console_support = require("./console_support");
var _toaster = require("./toaster");
var _sizing_tools = require("./sizing_tools");
var _communication_react = require("./communication_react");
var _export_viewer_react = require("./export_viewer_react");
var _resizing_allotment = require("./resizing_allotment");
var _error_drawer = require("./error_drawer");
var _metadata_drawer = require("./metadata_drawer");
var _assistant = require("./assistant");
var _notebook_support = require("./notebook_support");
var _settings = require("./settings");
var _modal_react = require("./modal_react");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
if (!window.in_context) {
  Promise.resolve().then(() => _interopRequireWildcard(require("../tactic_css/tactic.scss")));
  Promise.resolve().then(() => _interopRequireWildcard(require("../tactic_css/tactic_console.scss")));
  Promise.resolve().then(() => _interopRequireWildcard(require("../tactic_css/tactic_main.scss")));
  Promise.resolve().then(() => _interopRequireWildcard(require("../tactic_css/themeable.scss")));
}
function NotebookApp(props) {
  props = {
    refreshTab: null,
    closeTab: null,
    ...props
  };
  const last_save = (0, _react.useRef)({});
  const updateExportsList = (0, _react.useRef)(null);
  const connection_status = (0, _utilities_react.useConnection)(props.tsocket, initSocket);
  const [, set_console_selected_items, console_selected_items_ref] = (0, _utilities_react.useStateAndRef)([]);
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
  const settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  const statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  const pushCallback = (0, _utilities_react.useCallbackStack)();
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
        props.tsocket.disconnect();
      });
    }
    function sendRemove() {
      console.log("got the beacon");
      navigator.sendBeacon("/remove_mainwindow", JSON.stringify({
        "local_id": props.local_id
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
  function _cProp(pname) {
    return props.controlled ? props[pname] : mState[pname];
  }
  const save_state = {
    console_items: console_items,
    show_exports_pane: mState.show_exports_pane,
    console_width_fraction: mState.console_width_fraction
  };
  const _setMainStateValue = (0, _react.useCallback)(function (field_name, new_value, callback = null) {
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
      "local_id": props.local_id
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
        if (!(data["originator"] == window.global_id)) {
          window.close();
        }
      });
    }
  }
  const _handleConsoleFractionChange = (0, _react.useCallback)((left_width, right_width, new_fraction) => {
    _setMainStateValue("console_width_fraction", new_fraction);
  }, []);
  function _setProjectName(new_project_name, callback = null) {
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
  function toggleMetadata() {
    _setMainStateValue("show_metadata", !mState.show_metadata);
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
    local_id: props.local_id,
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
    local_id: props.local_id,
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
    local_id: props.local_id,
    tsocket: props.tsocket,
    handleCreateViewer: props.handleCreateViewer,
    controlled: props.controlled,
    console_items: console_items_ref,
    console_items_not_ref: console_items,
    console_selected_items_ref: console_selected_items_ref,
    set_console_selected_items: set_console_selected_items,
    dispatch: dispatch,
    mState: mState,
    setMainStateValue: _setMainStateValue,
    zoomable: false,
    shrinkable: false
  });
  let exports_pane;
  if (mState.show_exports_pane) {
    exports_pane = /*#__PURE__*/_react.default.createElement(_export_viewer_react.ExportsViewer, {
      local_id: props.local_id,
      tsocket: props.tsocket,
      setUpdate: ufunc => {
        updateExportsList.current = ufunc;
      },
      console_is_shrunk: mState.console_is_shrunk,
      console_is_zoomed: mState.console_is_zoomed
    });
  } else {
    exports_pane = /*#__PURE__*/_react.default.createElement("div", null);
  }
  let outer_style = {
    width: `calc(100% - ${_sizing_tools.ICON_BAR_WIDTH}px)`,
    height: "100%",
    flex: "1 1 0",
    overflow: "auto",
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 0,
    position: "relative"
  };
  return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, !window.in_context && /*#__PURE__*/_react.default.createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    user_name: window.username,
    menus: null,
    global_id: props.global_id
  }), /*#__PURE__*/_react.default.createElement(_metadata_drawer.MetadataContext.Provider, {
    value: {
      showMetadata: showMetadata,
      toggleMetadata: toggleMetadata,
      hideMetadata: hideMetadata
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: `main-outer ${settingsContext.isDark() ? "bp6-dark" : "light-theme"}`,
    style: outer_style
  }, /*#__PURE__*/_react.default.createElement(_menu_utilities.TacticMenubar, {
    connection_status: connection_status,
    menus: menus,
    showRefresh: true,
    showClose: true,
    local_id: props.local_id,
    refreshTab: props.refreshTab,
    closeTab: props.closeTab,
    resource_name: _cProp("resource_name"),
    showIconBar: true,
    showErrorDrawerButton: true,
    showMetadataDrawerButton: true,
    showAssistantDrawerButton: true,
    showSettingsDrawerButton: true
  }), /*#__PURE__*/_react.default.createElement(_resizing_allotment.HorizontalPanes, {
    left_pane: console_pane,
    right_pane: exports_pane,
    show_handle: true,
    initial_width_fraction: mState.console_width_fraction,
    controlled: true,
    className: "project-outer-padding",
    handleSplitUpdate: _handleConsoleFractionChange
  }))), /*#__PURE__*/_react.default.createElement(_metadata_drawer.MetadataDrawer, {
    res_type: "project",
    res_name: project_name,
    tsocket: props.tsocket,
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
    let NotebookAppPlus = (0, _settings.withSettings)((0, _modal_react.withDialogs)((0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)((0, _assistant.withAssistant)(NotebookApp)))));
    let the_element = /*#__PURE__*/_react.default.createElement(NotebookAppPlus, (0, _extends2.default)({}, the_props, {
      controlled: false,
      changeName: null
    }));
    const domContainer = document.querySelector('#main-root');
    const root = (0, _client.createRoot)(domContainer);
    root.render(/*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        position: "relative",
        height: "100%",
        width: "100%"
      }
    }, the_element));
  }
  (0, _utilities_react.renderSpinnerMessage)("Starting up ...");
  const local_id = "a" + (0, _utilities_react.guid)();
  var target = window.is_new_notebook ? "initate_new_notebook_in_context" : "initiate_project_in_context";
  var resource_name = window.is_new_notebook ? "" : window.project_name;
  let tsocket = new _tactic_socket.TacticSocket("main", 5000, "notebook", local_id, async () => {
    tsocket.attachListener('handle-callback', task_packet => {
      (0, _communication_react.handleCallback)(task_packet, local_id);
    });
    let post_data = {
      "project_name": resource_name,
      local_id
    };
    if (window.is_new_notebook) {
      post_data.temp_data_id = window.temp_data_id;
    }
    (0, _communication_react.postPromise)("host", target, post_data, local_id).then(data => {
      data.tsocket = tsocket;
      data.local_id = local_id;
      data.readOnly = window.read_only;
      data.is_repository = window.is_repository;
      (0, _notebook_support.notebook_props)(data, null, gotProps);
    });
  });
}
if (!window.in_context) {
  main_main();
}
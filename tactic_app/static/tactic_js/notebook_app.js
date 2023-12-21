"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NotebookApp = NotebookApp;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
require("../tactic_css/tactic.scss");
require("../tactic_css/tactic_console.scss");
require("../tactic_css/tactic_main.scss");
var _react = _interopRequireWildcard(require("react"));
var ReactDOM = _interopRequireWildcard(require("react-dom"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _blueprint_navbar = require("./blueprint_navbar");
var _menu_utilities = require("./menu_utilities");
var _main_menus_react = require("./main_menus_react");
var _console_component = require("./console_component");
var _console_support = require("./console_support");
var _toaster = require("./toaster");
var _utilities_react = require("./utilities_react");
var _communication_react = require("./communication_react");
var _export_viewer_react = require("./export_viewer_react");
var _resizing_layouts = require("./resizing_layouts");
var _error_drawer = require("./error_drawer");
var _sizing_tools = require("./sizing_tools");
var _notebook_support = require("./notebook_support");
var _theme = require("./theme");
var _modal_react = require("./modal_react");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2.default)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var MARGIN_SIZE = 10;
var BOTTOM_MARGIN = 20;
var MARGIN_ADJUSTMENT = 8; // This is the amount at the top of both the table and the conso
var USUAL_TOOLBAR_HEIGHT = 50;
var MENU_BAR_HEIGHT = 30; // will only appear when in context

function NotebookApp(props) {
  var last_save = (0, _react.useRef)({});
  var main_outer_ref = (0, _react.useRef)(null);
  var updateExportsList = (0, _react.useRef)(null);
  var height_adjustment = (0, _react.useRef)(props.controlled ? MENU_BAR_HEIGHT : 0);
  var connection_status = (0, _utilities_react.useConnection)(props.tsocket, initSocket);
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)([]),
    _useStateAndRef2 = (0, _slicedToArray2.default)(_useStateAndRef, 3),
    console_selected_items = _useStateAndRef2[0],
    set_console_selected_items = _useStateAndRef2[1],
    console_selected_items_ref = _useStateAndRef2[2];
  var _useReducerAndRef = (0, _utilities_react.useReducerAndRef)(_console_support.consoleItemsReducer, []),
    _useReducerAndRef2 = (0, _slicedToArray2.default)(_useReducerAndRef, 3),
    console_items = _useReducerAndRef2[0],
    dispatch = _useReducerAndRef2[1],
    console_items_ref = _useReducerAndRef2[2];
  var _useReducer = (0, _react.useReducer)(_notebook_support.notebookReducer, {
      show_exports_pane: props.is_project && props.interface_state ? props.interface_state["show_exports_pane"] : true,
      console_width_fraction: props.is_project && props.interface_state ? props.interface_state["console_width_fraction"] : .5,
      console_is_zoomed: true,
      console_is_shrunk: false,
      resource_name: props.resource_name,
      is_project: props.is_project,
      usable_height: (0, _sizing_tools.getUsableDimensions)(true).usable_height_no_bottom,
      usable_width: (0, _sizing_tools.getUsableDimensions)(true).usable_width - 170
    }),
    _useReducer2 = (0, _slicedToArray2.default)(_useReducer, 2),
    mState = _useReducer2[0],
    mDispatch = _useReducer2[1];
  var theme = (0, _react.useContext)(_theme.ThemeContext);
  var statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  var selectedPane = (0, _react.useContext)(_utilities_react.SelectedPaneContext);
  (0, _utilities_react.useConstructor)(function () {
    dispatch({
      type: "initialize",
      new_items: props.is_project && props.interface_state ? props.interface_state["console_items"] : []
    });
  });
  (0, _react.useEffect)(function () {
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
    _updateLastSave();
    statusFuncs.stopSpinner();
    if (!props.controlled) {
      document.title = mState.resource_name;
      window.addEventListener("resize", _update_window_dimensions);
      _update_window_dimensions();
    }
    return function () {
      delete_my_containers();
    };
  }, []);
  function am_selected() {
    return selectedPane.amSelected(selectedPane.tab_id, selectedPane.selectedTabIdRef);
  }
  function _cProp(pname) {
    return props.controlled ? props[pname] : mState[pname];
  }
  var save_state = {
    console_items: console_items,
    show_exports_pane: mState.show_exports_pane,
    console_width_fraction: mState.console_width_fraction
  };
  function _setMainStateValue(field_name, new_value) {
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    mDispatch({
      type: "change_field",
      field: field_name,
      new_value: new_value
    });
    pushCallback(callback);
  }
  function _update_window_dimensions() {
    var uwidth;
    var uheight;
    if (main_outer_ref && main_outer_ref.current) {
      uheight = window.innerHeight - main_outer_ref.current.offsetTop;
      uwidth = window.innerWidth - main_outer_ref.current.offsetLeft;
    } else {
      uheight = window.innerHeight - USUAL_TOOLBAR_HEIGHT;
      uwidth = window.innerWidth - 2 * MARGIN_SIZE;
    }
    mDispatch({
      type: "change_multiple_fields",
      newPartialState: {
        usable_height: uheight,
        usable_width: uwidth
      }
    });
  }
  function _updateLastSave() {
    last_save.current = save_state;
  }
  function _dirty() {
    var current_state = save_state;
    for (var k in current_state) {
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
    props.tsocket.attachListener("window-open", function (data) {
      window.open("".concat($SCRIPT_ROOT, "/load_temp_page/").concat(data["the_id"]));
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
  function _handleConsoleFractionChange(left_width, right_width, new_fraction) {
    _setMainStateValue("console_width_fraction", new_fraction);
  }
  function _setProjectName(new_project_name) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    if (props.controlled) {
      props.updatePanel({
        res_type: "project",
        title: new_project_name,
        panel: {
          resource_name: new_project_name,
          is_project: true
        }
      }, function () {
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
  function get_zoomed_console_height() {
    if (main_outer_ref.current) {
      return _cProp("usable_height") - height_adjustment.current - BOTTOM_MARGIN;
    } else {
      return _cProp("usable_height") - height_adjustment.current - 50;
    }
  }
  var my_props = _objectSpread({}, props);
  if (!props.controlled) {
    my_props.resource_name = mState.resource_name;
    my_props.usable_height = mState.usable_height;
    my_props.usable_width = mState.usable_width;
    my_props.is_project = mState.is_project;
  }
  var true_usable_width = my_props.usable_width;
  var console_available_height = get_zoomed_console_height() - MARGIN_ADJUSTMENT;
  var project_name = my_props.is_project ? props.resource_name : "";
  var menus = /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(_main_menus_react.ProjectMenu, {
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
  }));
  var console_pane = /*#__PURE__*/_react.default.createElement(_console_component.ConsoleComponent, {
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
    console_available_height: console_available_height - MARGIN_SIZE,
    console_available_width: true_usable_width * mState.console_width_fraction - 16,
    zoomable: false,
    shrinkable: false,
    style: {
      marginTop: MARGIN_SIZE
    }
  });
  var exports_pane;
  if (mState.show_exports_pane) {
    exports_pane = /*#__PURE__*/_react.default.createElement(_export_viewer_react.ExportsViewer, {
      main_id: props.main_id,
      tsocket: props.tsocket,
      setUpdate: function setUpdate(ufunc) {
        updateExportsList.current = ufunc;
      },
      available_height: console_available_height - MARGIN_SIZE,
      console_is_shrunk: mState.console_is_shrunk,
      console_is_zoomed: mState.console_is_zoomed,
      style: {
        marginTop: MARGIN_SIZE
      }
    });
  } else {
    exports_pane = /*#__PURE__*/_react.default.createElement("div", null);
  }
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
    showErrorDrawerButton: true
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: "main-outer ".concat(theme.dark_theme ? "bp5-dark" : "light-theme"),
    ref: main_outer_ref,
    style: {
      width: "100%",
      height: my_props.usable_height - height_adjustment.current
    }
  }, /*#__PURE__*/_react.default.createElement(_resizing_layouts.HorizontalPanes, {
    left_pane: console_pane,
    right_pane: exports_pane,
    show_handle: true,
    available_height: console_available_height,
    available_width: true_usable_width,
    initial_width_fraction: mState.console_width_fraction,
    controlled: true,
    dragIconSize: 15,
    handleSplitUpdate: _handleConsoleFractionChange
  })));
}
exports.NotebookApp = NotebookApp = /*#__PURE__*/(0, _react.memo)(NotebookApp);
NotebookApp.propTypes = {
  console_items: _propTypes.default.array,
  console_component: _propTypes.default.object,
  is_project: _propTypes.default.bool,
  interface_state: _propTypes.default.object,
  refreshTab: _propTypes.default.func,
  closeTab: _propTypes.default.func
};
NotebookApp.defaultProps = {
  refreshTab: null,
  closeTab: null
};
function main_main() {
  function gotProps(the_props) {
    var NotebookAppPlus = (0, _theme.withTheme)((0, _modal_react.withDialogs)((0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(NotebookApp))));
    var the_element = /*#__PURE__*/_react.default.createElement(NotebookAppPlus, (0, _extends2.default)({}, the_props, {
      controlled: false,
      initial_theme: window.theme,
      changeName: null
    }));
    var domContainer = document.querySelector('#main-root');
    ReactDOM.render(the_element, domContainer);
  }
  (0, _utilities_react.renderSpinnerMessage)("Starting up ...");
  var target = window.is_new_notebook ? "new_notebook_in_context" : "main_project_in_context";
  var resource_name = window.is_new_notebook ? "" : window.project_name;
  var post_data = {
    "resource_name": resource_name
  };
  if (window.is_new_notebook) {
    post_data.temp_data_id = window.temp_data_id;
  }
  (0, _communication_react.postAjaxPromise)(target, post_data).then(function (data) {
    (0, _notebook_support.notebook_props)(data, null, gotProps);
  });
}
if (!window.in_context) {
  main_main();
}
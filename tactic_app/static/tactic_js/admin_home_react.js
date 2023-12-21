"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
require("../tactic_css/tactic.scss");
require("../tactic_css/tactic_table.scss");
require("../tactic_css/library_home.scss");
var _react = _interopRequireWildcard(require("react"));
var ReactDOM = _interopRequireWildcard(require("react-dom"));
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
var _theme = require("./theme");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
window.library_id = (0, _utilities_react.guid)();
const MARGIN_SIZE = 17;
let tsocket;
function _administer_home_main() {
  tsocket = new _tactic_socket.TacticSocket("main", 5000, "admin", window.library_id);
  let AdministerHomeAppPlus = (0, _theme.withTheme)((0, _modal_react.withDialogs)((0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(AdministerHomeApp))));
  let domContainer = document.querySelector('#library-home-root');
  ReactDOM.render( /*#__PURE__*/_react.default.createElement(AdministerHomeAppPlus, {
    tsocket: tsocket,
    initial_theme: window.theme
  }), domContainer);
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
var initial_pane_states = {};
for (let res_type of res_types) {
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
  const [selected_tab_id, set_selected_tab_id] = (0, _react.useState)();
  const [pane_states, set_pane_states, pane_states_ref] = (0, _utilities_react.useStateAndRef)(initial_pane_states);
  const [usable_height, set_usable_height] = (0, _react.useState)((0, _sizing_tools.getUsableDimensions)(true).usable_height_no_bottom);
  const [usable_width, set_usable_width] = (0, _react.useState)((0, _sizing_tools.getUsableDimensions)(true).usable_width - 170);
  const theme = (0, _react.useContext)(_theme.ThemeContext);
  const dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  const statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  const top_ref = (0, _react.useRef)(null);
  const pushCallback = (0, _utilities_react.useCallbackStack)();
  (0, _react.useEffect)(() => {
    initSocket();
    statusFuncs.stopSpinner();
    window.addEventListener("resize", _update_window_dimensions);
    _update_window_dimensions();
    return () => {
      props.tsocket.disconnect();
    };
  }, []);
  function initSocket() {
    props.tsocket.attachListener("window-open", data => window.open(`${$SCRIPT_ROOT}/load_temp_page/${data["the_id"]}`));
    props.tsocket.attachListener('handle-callback', task_packet => {
      (0, _communication_react.handleCallback)(task_packet, window.library_id);
    });
    props.tsocket.attachListener('close-user-windows', data => {
      if (!(data["originator"] == window.library_id)) {
        window.close();
      }
    });
    props.tsocket.attachListener('doflashUser', _toaster.doFlash);
  }
  function _updatePaneState(res_type, state_update) {
    let callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    let old_state = Object.assign({}, pane_states_ref.current[res_type]);
    let new_pane_states = Object.assign({}, pane_states_ref.current);
    new_pane_states[res_type] = Object.assign(old_state, state_update);
    set_pane_states(new_pane_states);
    pushCallback(callback);
  }
  function _updatePaneStatePromise(res_type, state_update) {
    return new Promise((resolve, reject) => {
      _updatePaneState(res_type, state_update, resolve);
    });
  }
  function _update_window_dimensions() {
    let uwidth = window.innerWidth - 2 * _sizing_tools.SIDE_MARGIN;
    let uheight = window.innerHeight;
    if (top_ref && top_ref.current) {
      uheight = uheight - top_ref.current.offsetTop;
    } else {
      uheight = uheight - _sizing_tools.USUAL_TOOLBAR_HEIGHT;
    }
    set_usable_height(uheight);
    set_usable_width(uwidth);
  }
  function _handleTabChange(newTabId, prevTabId, event) {
    set_selected_tab_id(newTabId);
    pushCallback(_update_window_dimensions);
  }
  function getIconColor(paneId) {
    return paneId == selected_tab_id ? "white" : "#CED9E0";
  }
  let container_pane = /*#__PURE__*/_react.default.createElement(_administer_pane.AdminPane, (0, _extends2.default)({}, props, {
    usable_width: usable_width,
    usable_height: usable_height,
    res_type: "container",
    allow_search_inside: false,
    allow_search_metadata: false,
    MenubarClass: ContainerMenubar,
    updatePaneState: _updatePaneState,
    updatePaneStatePromise: _updatePaneStatePromise
  }, pane_states_ref.current["container"], {
    tsocket: tsocket,
    colnames: col_names.container,
    id_field: "Id"
  }));
  let user_pane = /*#__PURE__*/_react.default.createElement(_administer_pane.AdminPane, (0, _extends2.default)({}, props, {
    usable_width: usable_width,
    usable_height: usable_height,
    res_type: "user",
    allow_search_inside: false,
    allow_search_metadata: false,
    MenubarClass: UserMenubar,
    updatePaneState: _updatePaneState,
    updatePaneStatePromise: _updatePaneStatePromise
  }, pane_states_ref.current["user"], {
    tsocket: tsocket,
    colnames: col_names.user,
    id_field: "_id"
  }));
  let outer_style = {
    width: "100%",
    height: usable_height,
    paddingLeft: 0
  };
  let outer_class = "pane-holder";
  if (theme.dark_theme) {
    outer_class = `${outer_class} bp5-dark`;
  } else {
    outer_class = `${outer_class} light-theme`;
  }
  return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    selected: null,
    show_api_links: false,
    extra_text: "",
    page_id: window.library_id,
    user_name: window.username
  }), /*#__PURE__*/_react.default.createElement(_resource_viewer_context.ViewerContext.Provider, {
    value: {
      readOnly: false
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: outer_class,
    ref: top_ref,
    style: outer_style
  }, /*#__PURE__*/_react.default.createElement(_core.Tabs, {
    id: "the_container",
    style: {
      marginTop: 100
    },
    selectedTabId: selected_tab_id,
    renderActiveTabPanelOnly: true,
    vertical: true,
    large: true,
    onChange: _handleTabChange
  }, /*#__PURE__*/_react.default.createElement(_core.Tab, {
    id: "containers-pane",
    panel: container_pane
  }, /*#__PURE__*/_react.default.createElement(_core.Tooltip, {
    content: "Containers",
    position: _core.Position.RIGHT
  }, /*#__PURE__*/_react.default.createElement(_core.Icon, {
    icon: "box",
    size: 20,
    tabIndex: -1,
    color: getIconColor("collections-pane")
  }))), /*#__PURE__*/_react.default.createElement(_core.Tab, {
    id: "users-pane",
    panel: user_pane
  }, /*#__PURE__*/_react.default.createElement(_core.Tooltip, {
    content: "users",
    position: _core.Position.RIGHT
  }, /*#__PURE__*/_react.default.createElement(_core.Icon, {
    icon: "user",
    size: 20,
    tabIndex: -1,
    color: getIconColor("collections-pane")
  })))))));
}
AdministerHomeApp = /*#__PURE__*/(0, _react.memo)(AdministerHomeApp);
function ContainerMenubar(props) {
  const statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  const errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  function _doFlashStopSpinner(data) {
    statusFuncs.stopSpinner();
    (0, _toaster.doFlash)(data);
  }
  async function _container_logs() {
    let cont_id = props.selected_resource.Id;
    let data = await (0, _communication_react.postAjaxPromise)('container_logs/' + cont_id);
    props.setConsoleText(data.log_text);
  }
  async function _clear_user_func(event) {
    statusFuncs.startSpinner();
    let data = await (0, _communication_react.postAjaxPromise)('clear_user_containers');
    _doFlashStopSpinner(data);
  }
  async function _reset_server_func(event) {
    statusFuncs.startSpinner();
    let data = await (0, _communication_react.postAjaxPromise)("reset_server/" + library_id);
    _doFlashStopSpinner(data);
  }
  async function _destroy_container() {
    statusFuncs.startSpinner();
    let cont_id = props.selected_resource.Id;
    try {
      let data = await (0, _communication_react.postAjaxPromise)('kill_container/' + cont_id, {});
      _doFlashStopSpinner(data);
      props.delete_row(cont_id);
    } catch (e) {
      errorDrawerFuncs.addFromError("Error destroying container", e);
      statusFuncs.stopSpinner();
    }
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
  return /*#__PURE__*/_react.default.createElement(_library_menubars.LibraryMenubar, {
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
  selected_resource: _propTypes.default.object,
  list_of_selected: _propTypes.default.array,
  setConsoleText: _propTypes.default.func,
  delete_row: _propTypes.default.func,
  refresh_func: _propTypes.default.func
};
ContainerMenubar = /*#__PURE__*/(0, _react.memo)(ContainerMenubar);
function UserMenubar(props) {
  const dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  function _delete_user() {
    let user_id = props.selected_resource._id;
    let username = props.selected_resource.username;
    const confirm_text = `Are you sure that you want to delete user ${username} and all their data ?`;
    dialogFuncs.showModal("ConfirmDialog", {
      title: "Delete User",
      text_body: confirm_text,
      cancel_text: "do nothing",
      submit_text: "delete",
      handleSubmit: () => {
        $.getJSON($SCRIPT_ROOT + '/delete_user/' + user_id, _toaster.doFlash);
      },
      handleClose: dialogFuncs.hideModal,
      handleCancel: null
    });
  }
  function _bump_user_alt_id() {
    let user_id = props.selected_resource._id;
    let username = props.selected_resource.username;
    const confirm_text = "Are you sure that you want to bump the id for user " + String(username) + "?  " + "This will effectively log them out";
    dialogFuncs.showModal("ConfirmDialog", {
      title: "Bump User",
      text_body: confirm_text,
      cancel_text: "do nothing",
      submit_text: "bump",
      handleSubmit: () => {
        $.getJSON($SCRIPT_ROOT + '/bump_one_alt_id/' + user_id, _toaster.doFlash);
      },
      handleClose: dialogFuncs.hideModal,
      handleCancel: null
    });
  }
  function _toggle_status() {
    let user_id = props.selected_resource._id;
    $.getJSON($SCRIPT_ROOT + '/toggle_status/' + user_id, _toaster.doFlash);
  }
  function _bump_all_alt_ids() {
    const confirm_text = "Are you sure that you want to bump all alt ids?" + "This will effectively log them out";
    dialogFuncs.showModal("ConfirmDialog", {
      title: "Bump all",
      text_body: confirm_text,
      cancel_text: "do nothing",
      submit_text: "bump",
      handleSubmit: () => {
        $.getJSON($SCRIPT_ROOT + '/bump_all_alt_ids', _toaster.doFlash);
      },
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

  function _create_user(event) {
    window.open($SCRIPT_ROOT + '/register');
  }
  function _duplicate_user(event) {
    let username = props.selected_resource.username;
    window.open($SCRIPT_ROOT + '/user_duplicate/' + username);
  }
  function _update_all_collections(event) {
    window.open($SCRIPT_ROOT + '/update_all_collections');
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
      }
      // {name_text: "Upgrade all users", icon_name: "reset",
      //     click_handler: _upgrade_all_users},
      // {name_text: "Remove All Duplicates", icon_name: "reset",
      //     click_handler: _remove_all_duplicates},
      ]
    };
  }
  return /*#__PURE__*/_react.default.createElement(_library_menubars.LibraryMenubar, {
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
  selected_resource: _propTypes.default.object,
  list_of_selected: _propTypes.default.array,
  setConsoleText: _propTypes.default.func,
  delete_row: _propTypes.default.func,
  refresh_func: _propTypes.default.func
};
UserMenubar = /*#__PURE__*/(0, _react.memo)(UserMenubar);
_administer_home_main();
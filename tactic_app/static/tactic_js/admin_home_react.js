"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
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
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
window.library_id = (0, _utilities_react.guid)();
var MARGIN_SIZE = 17;
var tsocket;
function _administer_home_main() {
  tsocket = new _tactic_socket.TacticSocket("main", 5000, "admin", window.library_id);
  var AdministerHomeAppPlus = (0, _theme.withTheme)((0, _modal_react.withDialogs)((0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(AdministerHomeApp))));
  var domContainer = document.querySelector('#library-home-root');
  ReactDOM.render( /*#__PURE__*/_react["default"].createElement(AdministerHomeAppPlus, {
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
for (var _i = 0, _res_types = res_types; _i < _res_types.length; _i++) {
  var res_type = _res_types[_i];
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
  var _useState = (0, _react.useState)(),
    _useState2 = _slicedToArray(_useState, 2),
    selected_tab_id = _useState2[0],
    set_selected_tab_id = _useState2[1];
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)(initial_pane_states),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    pane_states = _useStateAndRef2[0],
    set_pane_states = _useStateAndRef2[1],
    pane_states_ref = _useStateAndRef2[2];
  var _useState3 = (0, _react.useState)((0, _sizing_tools.getUsableDimensions)(true).usable_height_no_bottom),
    _useState4 = _slicedToArray(_useState3, 2),
    usable_height = _useState4[0],
    set_usable_height = _useState4[1];
  var _useState5 = (0, _react.useState)((0, _sizing_tools.getUsableDimensions)(true).usable_width - 170),
    _useState6 = _slicedToArray(_useState5, 2),
    usable_width = _useState6[0],
    set_usable_width = _useState6[1];
  var theme = (0, _react.useContext)(_theme.ThemeContext);
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  var statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  var top_ref = (0, _react.useRef)(null);
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  (0, _react.useEffect)(function () {
    initSocket();
    statusFuncs.stopSpinner();
    window.addEventListener("resize", _update_window_dimensions);
    _update_window_dimensions();
    return function () {
      props.tsocket.disconnect();
    };
  }, []);
  function initSocket() {
    props.tsocket.attachListener("window-open", function (data) {
      return window.open("".concat($SCRIPT_ROOT, "/load_temp_page/").concat(data["the_id"]));
    });
    props.tsocket.attachListener('handle-callback', function (task_packet) {
      (0, _communication_react.handleCallback)(task_packet, window.library_id);
    });
    props.tsocket.attachListener('close-user-windows', function (data) {
      if (!(data["originator"] == window.library_id)) {
        window.close();
      }
    });
    props.tsocket.attachListener('doflash', _toaster.doFlash);
    props.tsocket.attachListener('doflashUser', _toaster.doFlash);
  }
  function _updatePaneState(res_type, state_update) {
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var old_state = Object.assign({}, pane_states_ref.current[res_type]);
    var new_pane_states = Object.assign({}, pane_states_ref.current);
    new_pane_states[res_type] = Object.assign(old_state, state_update);
    set_pane_states(new_pane_states);
    pushCallback(callback);
  }
  function _update_window_dimensions() {
    var uwidth = window.innerWidth - 2 * _sizing_tools.SIDE_MARGIN;
    var uheight = window.innerHeight;
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
  var container_pane = /*#__PURE__*/_react["default"].createElement(_administer_pane.AdminPane, _extends({}, props, {
    usable_width: usable_width,
    usable_height: usable_height,
    res_type: "container",
    allow_search_inside: false,
    allow_search_metadata: false,
    MenubarClass: ContainerMenubar,
    updatePaneState: _updatePaneState
  }, pane_states_ref.current["container"], props.errorDrawerFuncs, {
    errorDrawerFuncs: props.errorDrawerFuncs,
    tsocket: tsocket,
    colnames: col_names.container,
    id_field: "Id"
  }));
  var user_pane = /*#__PURE__*/_react["default"].createElement(_administer_pane.AdminPane, _extends({}, props, {
    usable_width: usable_width,
    usable_height: usable_height,
    res_type: "user",
    allow_search_inside: false,
    allow_search_metadata: false,
    MenubarClass: UserMenubar,
    updatePaneState: _updatePaneState
  }, pane_states_ref.current["user"], props.errorDrawerFuncs, {
    errorDrawerFuncs: props.errorDrawerFuncs,
    tsocket: tsocket,
    colnames: col_names.user,
    id_field: "_id"
  }));
  var outer_style = {
    width: "100%",
    height: usable_height,
    paddingLeft: 0
  };
  var outer_class = "pane-holder";
  if (theme.dark_theme) {
    outer_class = "".concat(outer_class, " bp5-dark");
  } else {
    outer_class = "".concat(outer_class, " light-theme");
  }
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    registerOmniFunction: null,
    selected: null,
    show_api_links: false,
    extra_text: "",
    page_id: window.library_id,
    user_name: window.username
  }), /*#__PURE__*/_react["default"].createElement(_resource_viewer_context.ViewerContext.Provider, {
    value: {
      readOnly: false
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: outer_class,
    ref: top_ref,
    style: outer_style
  }, /*#__PURE__*/_react["default"].createElement(_core.Tabs, {
    id: "the_container",
    style: {
      marginTop: 100
    },
    selectedTabId: selected_tab_id,
    renderActiveTabPanelOnly: true,
    vertical: true,
    large: true,
    onChange: _handleTabChange
  }, /*#__PURE__*/_react["default"].createElement(_core.Tab, {
    id: "containers-pane",
    panel: container_pane
  }, /*#__PURE__*/_react["default"].createElement(_core.Tooltip, {
    content: "Containers",
    position: _core.Position.RIGHT
  }, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
    icon: "box",
    size: 20,
    tabIndex: -1,
    color: getIconColor("collections-pane")
  }))), /*#__PURE__*/_react["default"].createElement(_core.Tab, {
    id: "users-pane",
    panel: user_pane
  }, /*#__PURE__*/_react["default"].createElement(_core.Tooltip, {
    content: "users",
    position: _core.Position.RIGHT
  }, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
    icon: "user",
    size: 20,
    tabIndex: -1,
    color: getIconColor("collections-pane")
  })))))));
}
AdministerHomeApp = /*#__PURE__*/(0, _react.memo)(AdministerHomeApp);
function ContainerMenubar(props) {
  var statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  function _doFlashStopSpinner(data) {
    statusFuncs.stopSpinner();
    (0, _toaster.doFlash)(data);
  }
  function _container_logs() {
    var cont_id = props.selected_resource.Id;
    $.getJSON($SCRIPT_ROOT + '/container_logs/' + cont_id, function (data) {
      props.setConsoleText(data.log_text);
    });
  }
  function _clear_user_func(event) {
    statusFuncs.startSpinner();
    $.getJSON($SCRIPT_ROOT + '/clear_user_containers/' + window.library_id, _doFlashStopSpinner);
  }
  function _reset_server_func(event) {
    statusFuncs.startSpinner();
    $.getJSON($SCRIPT_ROOT + '/reset_server/' + library_id, _doFlashStopSpinner);
  }
  function _destroy_container() {
    statusFuncs.startSpinner();
    var cont_id = props.selected_resource.Id;
    $.getJSON($SCRIPT_ROOT + '/kill_container/' + cont_id, function (data) {
      _doFlashStopSpinner(data);
      if (data.success) {
        props.delete_row(cont_id);
      }
    });
    statusFuncs.stopSpinner();
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
  return /*#__PURE__*/_react["default"].createElement(_library_menubars.LibraryMenubar, {
    menu_specs: menu_specs(),
    context_menu_items: null,
    multi_select: false,
    controlled: false,
    am_selected: false,
    refreshTab: props.refresh_func,
    closeTab: null,
    resource_name: "",
    showErrorDrawerButton: false,
    toggleErrorDrawer: null
  });
}
ContainerMenubar.propTypes = {
  selected_resource: _propTypes["default"].object,
  list_of_selected: _propTypes["default"].array,
  setConsoleText: _propTypes["default"].func,
  delete_row: _propTypes["default"].func,
  refresh_func: _propTypes["default"].func
};
ContainerMenubar = /*#__PURE__*/(0, _react.memo)(ContainerMenubar);
function UserMenubar(props) {
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  function _delete_user() {
    var user_id = props.selected_resource._id;
    var username = props.selected_resource.username;
    var confirm_text = "Are you sure that you want to delete user ".concat(username, " and all their data ?");
    dialogFuncs.showModal("ConfirmDialog", {
      title: "Delete User",
      text_body: confirm_text,
      cancel_text: "do nothing",
      submit_text: "delete",
      handleSubmit: function handleSubmit() {
        $.getJSON($SCRIPT_ROOT + '/delete_user/' + user_id, _toaster.doFlash);
      },
      handleClose: dialogFuncs.hideModal,
      handleCancel: null
    });
  }
  function _bump_user_alt_id() {
    var user_id = props.selected_resource._id;
    var username = props.selected_resource.username;
    var confirm_text = "Are you sure that you want to bump the id for user " + String(username) + "?  " + "This will effectively log them out";
    dialogFuncs.showModal("ConfirmDialog", {
      title: "Bump User",
      text_body: confirm_text,
      cancel_text: "do nothing",
      submit_text: "bump",
      handleSubmit: function handleSubmit() {
        $.getJSON($SCRIPT_ROOT + '/bump_one_alt_id/' + user_id, _toaster.doFlash);
      },
      handleClose: dialogFuncs.hideModal,
      handleCancel: null
    });
  }
  function _toggle_status() {
    var user_id = props.selected_resource._id;
    $.getJSON($SCRIPT_ROOT + '/toggle_status/' + user_id, _toaster.doFlash);
  }
  function _bump_all_alt_ids() {
    var confirm_text = "Are you sure that you want to bump all alt ids?" + "This will effectively log them out";
    dialogFuncs.showModal("ConfirmDialog", {
      title: "Bump all",
      text_body: confirm_text,
      cancel_text: "do nothing",
      submit_text: "bump",
      handleSubmit: function handleSubmit() {
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
    var username = props.selected_resource.username;
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

  return /*#__PURE__*/_react["default"].createElement(_library_menubars.LibraryMenubar, {
    menu_specs: menu_specs(),
    context_menu_items: null,
    multi_select: false,
    controlled: false,
    am_selected: false,
    refreshTab: props.refresh_func,
    closeTab: null,
    resource_name: "",
    showErrorDrawerButton: false,
    toggleErrorDrawer: null
  });
}
UserMenubar.propTypes = {
  selected_resource: _propTypes["default"].object,
  list_of_selected: _propTypes["default"].array,
  setConsoleText: _propTypes["default"].func,
  delete_row: _propTypes["default"].func,
  refresh_func: _propTypes["default"].func
};
UserMenubar = /*#__PURE__*/(0, _react.memo)(UserMenubar);
_administer_home_main();
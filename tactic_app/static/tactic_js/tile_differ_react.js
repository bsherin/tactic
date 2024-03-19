"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
require("../tactic_css/tactic.scss");
var _react = _interopRequireWildcard(require("react"));
var ReactDOM = _interopRequireWildcard(require("react-dom"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _merge_viewer_app = require("./merge_viewer_app");
var _toaster = require("./toaster");
var _communication_react = require("./communication_react");
var _error_drawer = require("./error_drawer");
var _utilities_react = require("./utilities_react");
var _blueprint_navbar = require("./blueprint_navbar");
var _tactic_socket = require("./tactic_socket");
var _theme = require("./theme");
var _sizing_tools = require("./sizing_tools");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function tile_differ_main() {
  function gotProps(the_props) {
    let TileDifferAppPlus = (0, _theme.withTheme)((0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(TileDifferApp)));
    let the_element = /*#__PURE__*/_react.default.createElement(TileDifferAppPlus, (0, _extends2.default)({}, the_props, {
      controlled: false,
      initial_theme: window.theme,
      changeName: null
    }));
    let domContainer = document.querySelector('#root');
    ReactDOM.render(the_element, domContainer);
  }
  function failedToLoad(data) {
    let fallback = "Tile differ failed to load";
    if ("message" in data) {
      fallback = fallback + " " + data.message;
    }
    let domContainer = document.querySelector('#root');
    let the_element = /*#__PURE__*/_react.default.createElement("pre", null, fallback);
    return ReactDOM.render(the_element, domContainer);
  }
  let get_url = "get_module_code";
  (0, _communication_react.postAjaxPromise)(`${get_url}/${window.resource_name}`, {}).then(function (data) {
    var edit_content = data.the_content;
    (0, _communication_react.postAjaxPromise)("get_tile_names").then(function (data2) {
      data.tile_list = data2.tile_names;
      data.resource_name = window.resource_name, data.second_resource_name = window.second_resource_name;
      tile_differ_props(data, null, gotProps);
    }).catch(data => {
      failedToLoad(data);
    });
  }).catch(data => {
    failedToLoad(data);
  });
}
function tile_differ_props(data, registerDirtyMethod, finalCallback) {
  let resource_viewer_id = (0, _utilities_react.guid)();
  var tsocket = new _tactic_socket.TacticSocket("main", 5000, "differ", resource_viewer_id);
  finalCallback({
    resource_viewer_id: resource_viewer_id,
    tsocket: tsocket,
    tile_list: data.tile_list,
    resource_name: data.resource_name,
    second_resource_name: data.second_resource_name,
    edit_content: data.the_content,
    is_repository: false,
    registerDirtyMethod: registerDirtyMethod
  });
}
function TileDifferApp(props) {
  const [edit_content, set_edit_content] = (0, _react.useState)(props.edit_content);
  const [right_content, set_right_content] = (0, _react.useState)("");
  const [tile_popup_val, set_tile_popup_val] = (0, _react.useState)(props.second_resource_name == "none" ? props.resource_name : props.second_resource_name);
  const [tile_list, set_tile_list] = (0, _react.useState)(props.tile_list);
  const [resource_name, set_resource_name] = (0, _react.useState)(props.resource_name);
  const connection_status = (0, _utilities_react.useConnection)(props.tsocket, initSocket);
  const savedContent = (0, _react.useRef)(props.edit_content);
  const pushCallback = (0, _utilities_react.useCallbackStack)();
  const statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  const errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  (0, _react.useEffect)(() => {
    window.addEventListener("beforeunload", function (e) {
      if (_dirty()) {
        e.preventDefault();
        e.returnValue = '';
      }
    });
  }, []);
  function initSocket() {
    props.tsocket.attachListener("window-open", data => window.open(`${$SCRIPT_ROOT}/load_temp_page/${data["the_id"]}`));
    props.tsocket.attachListener('close-user-windows', data => {
      if (!(data["originator"] == window.library_id)) {
        window.close();
      }
    });
    props.tsocket.attachListener('doflashUser', _toaster.doFlash);
  }
  async function handleSelectChange(new_value) {
    set_tile_popup_val(new_value);
    try {
      let data = await (0, _communication_react.postAjaxPromise)("get_module_code/" + new_value, {});
      set_right_content(data.the_content);
    } catch (e) {
      errorDrawerFuncs.addErrorDrawerEntry({
        title: "Error getting module code",
        content: "message" in e ? e.message : ""
      });
    }
  }
  function handleEditChange(new_code) {
    set_edit_content(new_code);
  }
  async function saveFromLeft() {
    let data_dict = {
      "module_name": props.resource_name,
      "module_code": edit_content
    };
    try {
      await (0, _communication_react.postAjaxPromise)("update_from_left", data_dict);
      statusFuncs.statusMessage("Updated from left");
    } catch (e) {
      errorDrawerFuncs.addErrorDrawerEntry({
        title: "Error saving from left",
        content: "message" in e ? e.message : ""
      });
    }
  }
  function dirty() {
    return edit_content != savedContent.current;
  }
  return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, !props.controlled, " ", /*#__PURE__*/_react.default.createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    selected: null,
    show_api_links: true,
    page_id: props.resource_viewer_id,
    user_name: window.username
  }), /*#__PURE__*/_react.default.createElement(_merge_viewer_app.MergeViewerApp, {
    connection_status: connection_status,
    page_id: props.resource_viewer_id,
    resource_viewer_id: props.resource_viewer_id,
    resource_name: props.resource_name,
    option_list: tile_list,
    select_val: tile_popup_val,
    edit_content: edit_content,
    right_content: right_content,
    handleSelectChange: handleSelectChange,
    handleEditChange: handleEditChange,
    saveHandler: saveFromLeft
  }));
}
TileDifferApp.propTypes = {
  resource_name: _propTypes.default.string,
  tile_list: _propTypes.default.array,
  edit_content: _propTypes.default.string,
  second_resource_name: _propTypes.default.string
};
TileDifferApp = (0, _sizing_tools.withSizeContext)( /*#__PURE__*/(0, _react.memo)(TileDifferApp));
if (!window.in_context) {
  tile_differ_main();
}
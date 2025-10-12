"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
require("../tactic_css/tactic.scss");
require("../tactic_css/themeable.scss");
var _react = _interopRequireWildcard(require("react"));
var _client = require("react-dom/client");
var _merge_viewer_app = require("./merge_viewer_app");
var _toaster = require("./toaster");
var _communication_react = require("./communication_react");
var _error_drawer = require("./error_drawer");
var _utilities_react = require("./utilities_react");
var _blueprint_navbar = require("./blueprint_navbar");
var _tactic_socket = require("./tactic_socket");
var _settings = require("./settings");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
window.global_id = "a" + (0, _utilities_react.guid)();
async function tile_differ_main() {
  function gotProps(the_props) {
    let TileDifferAppPlus = (0, _settings.withSettings)((0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(TileDifferApp)));
    let the_element = /*#__PURE__*/_react.default.createElement(TileDifferAppPlus, (0, _extends2.default)({}, the_props, {
      controlled: false,
      changeName: null
    }));
    const domContainer = document.querySelector('#root');
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
  try {
    tile_differ_props({}, null, gotProps);
  } catch (e) {
    let fallback = "Tile differ failed to load";
    if ("message" in e) {
      fallback = fallback + " " + e.message;
    }
    const domContainer = document.querySelector('#root');
    const root = (0, _client.createRoot)(domContainer);
    let the_element = /*#__PURE__*/_react.default.createElement("pre", null, fallback);
    root.render(the_element);
  }
}
function tile_differ_props(data, registerDirtyMethod, finalCallback) {
  let tsocket = new _tactic_socket.TacticSocket("main", 5000, "differ", window.global_id, () => {
    tsocket.attachListener('handle-callback', task_packet => {
      (0, _communication_react.handleCallback)(task_packet, window.global_id);
    });
    finalCallback({
      local_id: window.global_id,
      tsocket: tsocket,
      tile_list: [],
      resource_name: window.resource_name,
      second_resource_name: "second_resource_name" in window ? window.second_resource_name : null,
      edit_content: "",
      is_repository: false,
      registerDirtyMethod: registerDirtyMethod
    });
  });
}
function TileDifferApp(props) {
  const [edit_content, set_edit_content, edit_content_ref] = (0, _utilities_react.useStateAndRef)(props.edit_content);
  const [right_content, set_right_content] = (0, _react.useState)("");
  const [tile_popup_val, set_tile_popup_val] = (0, _react.useState)(props.second_resource_name == "none" ? props.resource_name : props.second_resource_name);
  const [tile_list, set_tile_list] = (0, _react.useState)(props.tile_list);
  const [second_resource_name, set_second_resource_name] = (0, _react.useState)("");
  const [initialized, setInitialized] = (0, _react.useState)(false);
  const connection_status = (0, _utilities_react.useConnection)(props.tsocket, initSocket);
  const savedContent = (0, _react.useRef)(props.edit_content);
  const statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  const errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  const pushCallback = (0, _utilities_react.useCallbackStack)();
  (0, _react.useEffect)(() => {
    window.addEventListener("beforeunload", function (e) {
      if (_dirty()) {
        e.preventDefault();
      }
      props.tsocket.disconnect();
    });
  }, []);
  (0, _react.useEffect)(() => {
    (0, _communication_react.postPromise)("host", "get_tile_content_task", {
      "tile_module_name": window.resource_name
    }).then(data => {
      (0, _communication_react.postPromise)("host", "get_tile_names_task", {}).then(data2 => {
        set_tile_list(data2["tile_names"]);
        set_edit_content(data.tile_content);
        savedContent.current = data.tile_content;
        getRightTileCode(tile_popup_val).then();
        pushCallback(() => {
          setInitialized(true);
        });
      });
    });
  }, []);
  function initSocket() {
    props.tsocket.attachListener("window-open", data => window.open(`${$SCRIPT_ROOT}/load_temp_page/${data["the_id"]}`));
    props.tsocket.attachListener('close-user-windows', data => {
      if (!(data["originator"] == window.global_id)) {
        window.close();
      }
    });
    props.tsocket.attachListener('doflashUser', _toaster.doFlash);
  }
  async function getRightTileCode(tile_name) {
    if (!tile_name) return;
    let data = await (0, _communication_react.postPromise)("host", "get_tile_content_task", {
      tile_module_name: tile_name
    });
    if (!data || !data.success) {
      errorDrawerFuncs.addErrorDrawerEntry({
        title: "Error getting module code",
        content: data.message
      });
    } else {
      set_right_content(data.tile_content);
    }
  }
  async function handleSelectChange(new_value) {
    if (!new_value) return;
    set_tile_popup_val(new_value);
    await getRightTileCode(new_value);
  }
  function handleEditChange(new_code) {
    set_edit_content(new_code);
  }
  async function saveFromLeft() {
    let data_dict = {
      "module_name": window.resource_name,
      "module_code": edit_content_ref.current
    };
    try {
      await (0, _communication_react.postPromise)("host", "update_from_left_task", data_dict);
      statusFuncs.statusMessage("Updated from left");
    } catch (e) {
      errorDrawerFuncs.addErrorDrawerEntry({
        title: "Error saving from left",
        content: "message" in e ? e.message : ""
      });
    }
  }
  function _dirty() {
    return edit_content_ref.current != savedContent.current;
  }
  return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, !props.controlled, " ", /*#__PURE__*/_react.default.createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    selected: null,
    show_api_links: true,
    global_id: props.global_id,
    user_name: window.username
  }), /*#__PURE__*/_react.default.createElement(_merge_viewer_app.MergeViewerApp, {
    connection_status: connection_status,
    initialized: initialized,
    resource_name: window.resource_name,
    option_list: tile_list,
    select_val: tile_popup_val,
    edit_content: edit_content,
    right_content: right_content,
    handleSelectChange: handleSelectChange,
    handleEditChange: handleEditChange,
    saveHandler: saveFromLeft
  }));
}
TileDifferApp = /*#__PURE__*/(0, _react.memo)(TileDifferApp);
if (!window.in_context) {
  tile_differ_main().then();
}
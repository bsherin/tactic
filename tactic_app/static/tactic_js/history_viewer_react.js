"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
require("../tactic_css/tactic.scss");
var _react = _interopRequireWildcard(require("react"));
var _client = require("react-dom/client");
var _core = require("@blueprintjs/core");
var _merge_viewer_app = require("./merge_viewer_app");
var _toaster = require("./toaster.js");
var _communication_react = require("./communication_react.js");
var _error_drawer = require("./error_drawer.js");
var _sizing_tools = require("./sizing_tools");
var _utilities_react = require("./utilities_react.js");
var _blueprint_navbar = require("./blueprint_navbar");
var _tactic_socket = require("./tactic_socket.js");
var _utilities_react2 = require("./utilities_react");
var _theme = require("./theme");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/**
 * Created by bls910
 */

async function history_viewer_main() {
  function gotProps(the_props) {
    let HistoryViewerAppPlus = (0, _theme.withTheme)((0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(HistoryViewerApp)));
    let the_element = /*#__PURE__*/_react.default.createElement(HistoryViewerAppPlus, (0, _extends2.default)({}, the_props, {
      controlled: false,
      initial_theme: window.theme,
      changeName: null
    }));
    const domContainer = document.querySelector('#root');
    const root = (0, _client.createRoot)(domContainer);
    root.render( /*#__PURE__*/_react.default.createElement(_core.HotkeysProvider, null, the_element));
  }
  let get_url = "get_module_code";
  try {
    let data = await (0, _communication_react.postAjaxPromise)(`${get_url}/${window.resource_name}`, {});
    var edit_content = data.the_content;
    let data2 = await (0, _communication_react.postAjaxPromise)("get_checkpoint_dates", {
      "module_name": window.resource_name
    });
    data.history_list = data2.checkpoints;
    data.resource_name = window.resource_name;
    history_viewer_props(data, null, gotProps);
  } catch (e) {
    let fallback = "History viewer failed to load";
    if ("message" in e) {
      fallback = fallback + " " + e.message;
    }
    const domContainer = document.querySelector('#root');
    const root = (0, _client.createRoot)(domContainer);
    let the_element = /*#__PURE__*/_react.default.createElement("pre", null, fallback);
    root.render(the_element);
  }
}
function history_viewer_props(data, registerDirtyMethod, finalCallback) {
  let resource_viewer_id = (0, _utilities_react.guid)();
  var tsocket = new _tactic_socket.TacticSocket("main", 5000, "history_viewer", resource_viewer_id);
  finalCallback({
    resource_viewer_id: resource_viewer_id,
    tsocket: tsocket,
    history_list: data.history_list,
    resource_name: data.resource_name,
    edit_content: data.the_content,
    is_repository: false,
    registerDirtyMethod: registerDirtyMethod
  });
}
function HistoryViewerApp(props) {
  const [edit_content, set_edit_content] = (0, _react.useState)(props.edit_content);
  const [right_content, set_right_content] = (0, _react.useState)("");
  const [history_popup_val, set_history_popup_val] = (0, _react.useState)(props.history_list[0]["updatestring"]);
  const [history_list, set_history_list] = (0, _react.useState)(props.history_list);
  const [resource_name, set_resource_name] = (0, _react.useState)(props.resource_name);
  const connection_status = (0, _utilities_react2.useConnection)(props.tsocket, initSocket);
  const savedContent = (0, _react.useRef)(props.edit_content);
  const statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  const errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  const pushCallback = (0, _utilities_react2.useCallbackStack)();
  (0, _react.useEffect)(() => {
    function beforeUnloadFunc(e) {
      if (_dirty()) {
        e.preventDefault();
        e.returnValue = '';
      }
    }
    window.addEventListener("beforeunload", beforeUnloadFunc);
    return () => {
      props.tsocket.disconnect();
      window.removeEventListener("beforeunload", beforeUnloadFunc);
    };
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
  function handleSelectChange(new_value) {
    set_history_popup_val(new_value);
    for (let item of history_list) {
      if (item["updatestring"] == new_value) {
        let updatestring_for_sort = item["updatestring_for_sort"];
        (0, _communication_react.postAjaxPromise)("get_checkpoint_code", {
          "module_name": resource_name,
          "updatestring_for_sort": updatestring_for_sort
        }).then(data => {
          set_right_content(data.module_code);
        }).catch(data => {
          errorDrawerFuncs.addErrorDrawerEntry({
            title: "Error getting checkpoint code",
            content: "message" in data ? data.message : ""
          });
        });
        return;
      }
    }
  }
  function handleEditChange(new_code) {
    set_edit_content(new_code);
  }
  function doCheckpointPromise() {
    return new Promise(function (resolve, reject) {
      (0, _communication_react.postAjax)("checkpoint_module", {
        "module_name": props.resource_name
      }, function (data) {
        if (data.success) {
          resolve(data);
        } else {
          reject(data);
        }
      });
    });
  }
  function checkpointThenSaveFromLeft() {
    let self = this;
    let current_popup_val = history_popup_val;
    doCheckpointPromise().then(function () {
      (0, _communication_react.postAjaxPromise)("get_checkpoint_dates", {
        "module_name": resource_name
      }).then(data => {
        set_history_list(data.checkpoints);
      }).catch(data => {
        errorDrawerFuncs.addErrorDrawerEntry({
          title: "Error getting checkpoint dates",
          content: "message" in data ? data.message : ""
        });
      });
      saveFromLeft();
    }).catch(data => {
      errorDrawerFuncs.addErrorDrawerEntry({
        title: "Error checkpointing module",
        content: "message" in data ? data.message : ""
      });
    });
  }
  function saveFromLeft() {
    let data_dict = {
      "module_name": props.resource_name,
      "module_code": edit_content
    };
    (0, _communication_react.postAjaxPromise)("update_from_left", data_dict).then(data => {
      statusFuncs.statusMessage("Updated from left");
    }).catch(data => {
      errorDrawerFuncs.addErrorDrawerEntry({
        title: "Error updating from left",
        content: "message" in data ? data.message : ""
      });
    });
  }
  function dirty() {
    return edit_content != savedContent.current;
  }
  let option_list = history_list.map(item => item["updatestring"]);
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
    option_list: option_list,
    select_val: history_popup_val,
    edit_content: edit_content,
    right_content: right_content,
    handleSelectChange: handleSelectChange,
    handleEditChange: handleEditChange,
    saveHandler: checkpointThenSaveFromLeft
  }));
}
HistoryViewerApp = (0, _sizing_tools.withSizeContext)( /*#__PURE__*/(0, _react.memo)(HistoryViewerApp));
if (!window.in_context) {
  try {
    history_viewer_main().then();
  } catch (e) {
    console.log("Error at the top level");
  }
}
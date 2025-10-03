"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
require("../tactic_css/tactic.scss");
require("../tactic_css/themeable.scss");
var _react = _interopRequireWildcard(require("react"));
var _client = require("react-dom/client");
var _merge_viewer_app = require("./merge_viewer_app");
var _toaster = require("./toaster.js");
var _communication_react = require("./communication_react.js");
var _error_drawer = require("./error_drawer.js");
var _utilities_react = require("./utilities_react.js");
var _blueprint_navbar = require("./blueprint_navbar");
var _tactic_socket = require("./tactic_socket.js");
var _utilities_react2 = require("./utilities_react");
var _settings = require("./settings");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/**
 * Created by bls910
 */

window.global_id = "a" + (0, _utilities_react.guid)();
async function history_viewer_main() {
  function gotProps(the_props) {
    let HistoryViewerAppPlus = (0, _settings.withSettings)((0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(HistoryViewerApp)));
    let the_element = /*#__PURE__*/_react.default.createElement(HistoryViewerAppPlus, (0, _extends2.default)({}, the_props, {
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
    history_viewer_props({}, null, gotProps);
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
  let tsocket = new _tactic_socket.TacticSocket("main", 5000, "history_viewer", window.global_id, () => {
    tsocket.attachListener('handle-callback', task_packet => {
      (0, _communication_react.handleCallback)(task_packet, window.global_id);
    });
    finalCallback({
      local_id: window.global_id,
      tsocket: tsocket,
      history_list: [],
      resource_name: window.resource_name,
      edit_content: "",
      is_repository: false,
      registerDirtyMethod: registerDirtyMethod
    });
  });
}
function HistoryViewerApp(props) {
  const [edit_content, set_edit_content, edit_content_ref] = (0, _utilities_react2.useStateAndRef)();
  const [right_content, set_right_content] = (0, _react.useState)("");
  const [history_popup_val, set_history_popup_val] = (0, _react.useState)("");
  const [history_list, set_history_list] = (0, _react.useState)(props.history_list);
  const [initialized, setInitialized] = (0, _react.useState)(false);
  const [resource_name] = (0, _react.useState)(props.resource_name);
  const connection_status = (0, _utilities_react2.useConnection)(props.tsocket, initSocket);
  const savedContent = (0, _react.useRef)("");
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
  (0, _react.useEffect)(() => {
    (0, _communication_react.postPromise)("host", "get_tile_content_task", {
      "tile_module_name": window.resource_name
    }).then(data => {
      (0, _communication_react.postPromise)("host", "get_checkpoint_dates_task", {
        "module_name": window.resource_name
      }).then(data2 => {
        set_history_list(data2.checkpoints);
        set_edit_content(data.tile_content);
        savedContent.current = data.tile_content;
        pushCallback(() => {
          setInitialized(true);
          set_history_popup_val(data2.checkpoints[0]["update_string"]);
          getCheckpointCode(data2.checkpoints[0]["updatestring_for_sort"]);
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
  function getCheckpointCode(updatestring_for_sort) {
    (0, _communication_react.postPromise)("host", "get_checkpoint_code_task", {
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
  }
  function handleSelectChange(new_value) {
    if (!new_value) return;
    set_history_popup_val(new_value);
    for (let item of history_list) {
      if (item["updatestring"] == new_value) {
        let updatestring_for_sort = item["updatestring_for_sort"];
        getCheckpointCode(updatestring_for_sort);
        return;
      }
    }
  }
  function handleEditChange(new_code) {
    set_edit_content(new_code);
  }
  function doCheckpointPromise() {
    return new Promise(async function (resolve, reject) {
      let data = (0, _communication_react.postPromise)("host", "checkpoint_module_task", {
        "module_name": props.resource_name
      });
      if (data.success) {
        resolve(data);
      } else {
        reject(data);
      }
    });
  }
  function checkpointThenSaveFromLeft() {
    doCheckpointPromise().then(function () {
      (0, _communication_react.postPromise)("host", "get_checkpoint_dates_task", {
        "module_name": resource_name
      }).then(data => {
        set_history_list(data["checkpoints"]);
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
      "module_code": edit_content_ref.current
    };
    (0, _communication_react.postPromise)("host", "update_from_left_task", data_dict).then(() => {
      statusFuncs.statusMessage("Updated from left");
    }).catch(data => {
      errorDrawerFuncs.addErrorDrawerEntry({
        title: "Error updating from left",
        content: "message" in data ? data.message : ""
      });
    });
  }
  function _dirty() {
    return edit_content_ref.current != savedContent.current;
  }
  let option_list = history_list.map(item => item["updatestring"]);
  return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, !props.controlled, " ", /*#__PURE__*/_react.default.createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    selected: null,
    show_api_links: true,
    global_id: props.global_id,
    user_name: window.username
  }), /*#__PURE__*/_react.default.createElement(_merge_viewer_app.MergeViewerApp, {
    connection_status: connection_status,
    initialized: initialized,
    resource_name: props.resource_name,
    option_list: option_list,
    select_val: history_popup_val,
    edit_content: edit_content_ref.current,
    right_content: right_content,
    handleSelectChange: handleSelectChange,
    handleEditChange: handleEditChange,
    saveHandler: checkpointThenSaveFromLeft
  }));
}
HistoryViewerApp = /*#__PURE__*/(0, _react.memo)(HistoryViewerApp);
if (!window.in_context) {
  try {
    history_viewer_main().then();
  } catch (e) {
    console.log("Error at the top level");
  }
}
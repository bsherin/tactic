"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResourceViewerApp = ResourceViewerApp;
exports.copyToLibrary = copyToLibrary;
exports.sendToRepository = sendToRepository;
var _react = _interopRequireWildcard(require("react"));
var _combined_metadata = require("./combined_metadata");
var _resizing_allotment = require("./resizing_allotment");
var _communication_react = require("./communication_react");
var _menu_utilities = require("./menu_utilities");
var _toaster = require("./toaster");
var _utilities_react = require("./utilities_react");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const PADDING = 20;
async function copyToLibrary(res_type, resource_name, dialogFuncs, statusFuncs, errorDrawerFuncs) {
  try {
    let data = await (0, _communication_react.postPromise)("host", "get_resource_names_task", {
      res_type
    });
    let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
      title: `Import ${res_type}`,
      field_title: `New ${res_type} Name`,
      default_value: resource_name,
      existing_names: data.res_names,
      checkboxes: [],
      handleClose: dialogFuncs.hideModal
    });
    const result_dict = {
      "res_type": res_type,
      "res_name": resource_name,
      "new_res_name": new_name
    };
    await (0, _communication_react.postPromise)("host", "copy_from_repository_task", result_dict);
    statusFuncs.statusMessage(`Copied resource from repository`);
  } catch (e) {
    if (e != "canceled") {
      errorDrawerFuncs.addFromError(`Error copying from repository`, e);
    }
  }
}
async function sendToRepository(res_type, resource_name, dialogFuncs, statusFuncs, errorDrawerFuncs) {
  try {
    let data = await (0, _communication_react.postPromise)("host", "get_resource_names_task", {
      res_type,
      is_repository: true
    });
    let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
      title: `Share ${res_type}`,
      field_title: `New ${res_type} Name`,
      default_value: resource_name,
      existing_names: data.res_names,
      checkboxes: [],
      handleClose: dialogFuncs.hideModal
    });
    const result_dict = {
      "res_type": res_type,
      "res_name": resource_name,
      "new_res_name": new_name
    };
    await (0, _communication_react.postPromise)("host", "send_to_repository_task", result_dict);
    statusFuncs.statusMessage(`Sent resource to repository`);
  } catch (e) {
    if (e != "canceled") {
      errorDrawerFuncs.addFromError(`Error sending to repository`, e);
    }
  }
}
const metadata_outer_style = {
  marginTop: 0,
  marginLeft: 0,
  overflow: "auto",
  padding: 25,
  marginRight: 0,
  height: "100%"
};
function ResourceViewerApp(props) {
  props = {
    search_string: "",
    padTop: false,
    search_matches: null,
    showErrorDrawerButton: false,
    am_selected: true,
    controlled: false,
    refreshTab: null,
    closeTab: null,
    search_ref: null,
    allow_regex_search: false,
    regex: false,
    mdata_icon: null,
    additional_metadata: null,
    ...props
  };
  const top_ref = (0, _react.useRef)(null);
  const statusFuncs = (0, _react.useContext)(_toaster.StatusContext);

  // Only used when not in context
  const connection_status = (0, _utilities_react.useConnection)(props.tsocket, initSocket);
  (0, _react.useEffect)(() => {
    statusFuncs.stopSpinner();
  }, []);
  function initSocket() {
    props.tsocket.attachListener('handle-callback', task_packet => {
      (0, _communication_react.handleCallback)(task_packet, props.local_id);
    });
    if (!props.controlled) {
      props.tsocket.attachListener('close-user-windows', data => {
        if (!(data["originator"] == props.global_id)) {
          window.close();
        }
      });
      props.tsocket.attachListener("doFlashUser", function (data) {
        (0, _toaster.doFlash)(data);
      });
    }
  }
  let left_pane = /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
    className: `resource-viewer-left-pane-holder ${props.padTop ? "top-padded" : ""}`,
    style: {
      height: "100%",
      width: "100%",
      position: "relative",
      overflow: "auto",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      height: "100%",
      width: "100%",
      position: "relative",
      overflow: "auto",
      display: "flex",
      flexDirection: "column"
    }
  }, props.children)));
  let right_pane = /*#__PURE__*/_react.default.createElement(_combined_metadata.CombinedMetadata, {
    expandWidth: true,
    tsocket: props.tsocket,
    useTags: true,
    useNotes: true,
    readOnly: props.readOnly,
    res_name: props.resource_name,
    res_type: props.res_type
  });
  return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(_menu_utilities.TacticMenubar, {
    menu_specs: props.menu_specs,
    connection_status: connection_status,
    showRefresh: window.in_context,
    showClose: window.in_context,
    refreshTab: props.refreshTab,
    closeTab: props.closeTab,
    resource_name: props.resource_name,
    showIconBar: true,
    showMetadataDrawerButton: false,
    showAssistantDrawerButton: true,
    showErrorDrawerButton: true,
    showSettingsDrawerButton: true
  }), /*#__PURE__*/_react.default.createElement("div", {
    ref: top_ref,
    className: "resource-viewer-hp-holder",
    style: {
      display: "flex",
      flexGrow: 1,
      width: "100%",
      position: "relative",
      marginTop: 0
    }
  }, /*#__PURE__*/_react.default.createElement(_resizing_allotment.HorizontalPanes, {
    left_pane: left_pane,
    show_handle: true,
    right_pane: right_pane,
    initial_width_fraction: .65,
    am_outer: true
  })));
}
exports.ResourceViewerApp = ResourceViewerApp = /*#__PURE__*/(0, _react.memo)(ResourceViewerApp);
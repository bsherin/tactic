"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResourceViewerApp = ResourceViewerApp;
exports.copyToLibrary = copyToLibrary;
exports.sendToRepository = sendToRepository;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _key_trap = require("./key_trap");
var _blueprint_mdata_fields = require("./blueprint_mdata_fields");
var _resizing_layouts = require("./resizing_layouts2");
var _communication_react = require("./communication_react");
var _menu_utilities = require("./menu_utilities");
var _toaster = require("./toaster");
var _sizing_tools = require("./sizing_tools");
var _library_widgets = require("./library_widgets");
var _utilities_react = require("./utilities_react");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
async function copyToLibrary(res_type, resource_name, dialogFuncs, statusFuncs, errorDrawerFuncs) {
  try {
    let data = await (0, _communication_react.postAjaxPromise)(`get_resource_names/${res_type}`);
    let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
      title: `Import ${res_type}`,
      field_title: `New ${res_type} Name`,
      default_value: resource_name,
      existing_names: data.resource_names,
      checkboxes: [],
      handleClose: dialogFuncs.hideModal
    });
    const result_dict = {
      "res_type": res_type,
      "res_name": resource_name,
      "new_res_name": new_name
    };
    await (0, _communication_react.postAjaxPromise)("copy_from_repository", result_dict);
    statusFuncs.statusMessage(`Copied resource from repository`);
  } catch (e) {
    if (e != "canceled") {
      errorDrawerFuncs.addFromError(`Error copying from repository`, e);
    }
  }
}
async function sendToRepository(res_type, resource_name, dialogFuncs, statusFuncs, errorDrawerFuncs) {
  try {
    let data = await (0, _communication_react.postAjaxPromise)(`get_repository_resource_names/${res_type}`, {});
    let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
      title: `Share ${res_type}`,
      field_title: `New ${res_type} Name`,
      default_value: resource_name,
      existing_names: data.resource_names,
      checkboxes: [],
      handleClose: dialogFuncs.hideModal
    });
    const result_dict = {
      "res_type": res_type,
      "res_name": resource_name,
      "new_res_name": new_name
    };
    await (0, _communication_react.postAjaxPromise)("send_to_repository", result_dict);
    statusFuncs.statusMessage(`Sent resource to repository`);
  } catch (e) {
    if (e != "canceled") {
      errorDrawerFuncs.addFromError(`Error sending to repository`, e);
    }
  }
}
function ResourceViewerApp(props) {
  const top_ref = (0, _react.useRef)(null);
  const savedContent = (0, _react.useRef)(props.the_content);
  const savedTags = (0, _react.useRef)(props.split_tags);
  const savedNotes = (0, _react.useRef)(props.notes);
  const key_bindings = (0, _react.useRef)([]);
  const [all_tags, set_all_tags] = (0, _react.useState)([]);
  const statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  const sizeInfo = (0, _react.useContext)(_sizing_tools.SizeContext);

  // Only used when not in context
  const connection_status = (0, _utilities_react.useConnection)(props.tsocket, initSocket);
  const [usable_width, usable_height, topX, topY] = (0, _sizing_tools.useSize)(top_ref, 0, "ResourceViewer");
  (0, _react.useEffect)(() => {
    statusFuncs.stopSpinner();
  }, []);
  (0, _react.useEffect)(() => {
    if (!props.readOnly) {
      let data_dict = {
        pane_type: props.res_type,
        is_repository: false,
        show_hidden: true
      };
      (0, _communication_react.postAjaxPromise)("get_tag_list", data_dict).then(data => {
        set_all_tags(data.tag_list);
      });
    }
  }, []);
  function initSocket() {
    props.tsocket.attachListener('handle-callback', task_packet => {
      (0, _communication_react.handleCallback)(task_packet, props.resource_viewer_id);
    });
    if (!props.controlled) {
      props.tsocket.attachListener('close-user-windows', data => {
        if (!(data["originator"] == props.resource_viewer_id)) {
          window.close();
        }
      });
      props.tsocket.attachListener("doFlashUser", function (data) {
        (0, _toaster.doFlash)(data);
      });
    }
  }
  let left_pane = /*#__PURE__*/_react.default.createElement(_react.Fragment, null, props.show_search && /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      marginBottom: 5,
      marginTop: 15
    }
  }, /*#__PURE__*/_react.default.createElement(_library_widgets.SearchForm, {
    update_search_state: props.update_search_state,
    search_string: props.search_string,
    regex: props.regex,
    search_ref: props.search_ref,
    allow_regex: props.allow_regex_search,
    number_matches: props.search_matches
  })), props.children);
  let right_pane = /*#__PURE__*/_react.default.createElement(_blueprint_mdata_fields.CombinedMetadata, {
    tags: props.tags,
    useTags: props.tags != null,
    expandWidth: true,
    outer_style: {
      marginTop: 0,
      marginLeft: 10,
      overflow: "auto",
      padding: 15,
      marginRight: 0,
      height: "100%"
    },
    all_tags: all_tags,
    created: props.created,
    updated: props.updated,
    notes: props.notes,
    useNotes: props.notes != null,
    icon: props.mdata_icon,
    readOnly: props.readOnly,
    handleChange: props.handleStateChange,
    additional_metadata: props.additional_metadata,
    pane_type: props.res_type
  });
  return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(_menu_utilities.TacticMenubar, {
    menu_specs: props.menu_specs,
    connection_status: connection_status,
    showRefresh: window.in_context,
    showClose: window.in_context,
    refreshTab: props.refreshTab,
    closeTab: props.closeTab,
    resource_name: props.resource_name,
    showErrorDrawerButton: props.showErrorDrawerButton
  }), /*#__PURE__*/_react.default.createElement("div", {
    ref: top_ref,
    style: {
      width: usable_width,
      height: usable_height,
      marginLeft: 15,
      marginTop: 0
    }
  }, /*#__PURE__*/_react.default.createElement(_resizing_layouts.HorizontalPanes, {
    left_pane: left_pane,
    show_handle: true,
    right_pane: right_pane,
    initial_width_fraction: .65,
    am_outer: true,
    bottom_margin: _sizing_tools.BOTTOM_MARGIN,
    right_margin: _sizing_tools.SIDE_MARGIN
  })), !window.in_context && /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(_key_trap.KeyTrap, {
    global: true,
    bindings: key_bindings.current
  })));
}
exports.ResourceViewerApp = ResourceViewerApp = /*#__PURE__*/(0, _react.memo)(ResourceViewerApp);
ResourceViewerApp.propTypes = {
  resource_name: _propTypes.default.string,
  search_string: _propTypes.default.string,
  search_matches: _propTypes.default.number,
  refreshTab: _propTypes.default.func,
  closeTab: _propTypes.default.func,
  res_type: _propTypes.default.string,
  menu_specs: _propTypes.default.object,
  created: _propTypes.default.string,
  tags: _propTypes.default.array,
  notes: _propTypes.default.string,
  mdata_icon: _propTypes.default.string,
  handleStateChange: _propTypes.default.func,
  meta_outer: _propTypes.default.string,
  dark_theme: _propTypes.default.bool,
  tsocket: _propTypes.default.object,
  saveMe: _propTypes.default.func,
  children: _propTypes.default.element,
  show_search: _propTypes.default.bool,
  update_search_state: _propTypes.default.func,
  search_ref: _propTypes.default.object,
  showErrorDrawerButton: _propTypes.default.bool,
  allow_regex_search: _propTypes.default.bool,
  regex: _propTypes.default.bool,
  additional_metadata: _propTypes.default.object
};
ResourceViewerApp.defaultProps = {
  search_string: "",
  search_matches: null,
  showErrorDrawerButton: false,
  dark_theme: false,
  am_selected: true,
  controlled: false,
  refreshTab: null,
  closeTab: null,
  search_ref: null,
  allow_regex_search: false,
  regex: false,
  mdata_icon: null,
  additional_metadata: null
};
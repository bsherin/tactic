"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResourceViewerApp = ResourceViewerApp;
exports.copyToLibrary = copyToLibrary;
exports.sendToRepository = sendToRepository;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _TacticOmnibar = require("./TacticOmnibar");
var _key_trap = require("./key_trap");
var _blueprint_mdata_fields = require("./blueprint_mdata_fields");
var _resizing_layouts = require("./resizing_layouts.js");
var _communication_react = require("./communication_react.js");
var _menu_utilities = require("./menu_utilities.js");
var _toaster = require("./toaster.js");
var _sizing_tools = require("./sizing_tools.js");
var _library_widgets = require("./library_widgets");
var _utilities_react = require("./utilities_react");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function copyToLibrary(res_type, resource_name, dialogFuncs) {
  $.getJSON($SCRIPT_ROOT + "get_resource_names/".concat(res_type), function (data) {
    dialogFuncs.showModal("ModalDialog", {
      title: "Import ".concat(res_type),
      field_title: "New ".concat(res_type, " Name"),
      handleSubmit: ImportResource,
      default_value: resource_name,
      existing_names: data.resource_names,
      checkboxes: [],
      handleCancel: null,
      handleClose: dialogFuncs.hideModal
    });
  });
  function ImportResource(new_name) {
    var result_dict = {
      "res_type": res_type,
      "res_name": resource_name,
      "new_res_name": new_name
    };
    (0, _communication_react.postAjax)("copy_from_repository", result_dict, _toaster.doFlashAlways);
  }
}
function sendToRepository(res_type, resource_name, dialogFuncs) {
  $.getJSON($SCRIPT_ROOT + "get_repository_resource_names/".concat(res_type), function (data) {
    dialogFuncs.showModal("ModalDialog", {
      title: "Share ".concat(res_type),
      field_title: "New ".concat(res_type, " Name"),
      handleSubmit: ShareResource,
      default_value: resource_name,
      existing_names: data.resource_names,
      checkboxes: [],
      handleCancel: null,
      handleClose: dialogFuncs.hideModal
    });
  });
  function ShareResource(new_name) {
    var result_dict = {
      "res_type": res_type,
      "res_name": resource_name,
      "new_res_name": new_name
    };
    (0, _communication_react.postAjax)("send_to_repository", result_dict, _toaster.doFlashAlways);
  }
}
function ResourceViewerApp(props) {
  var top_ref = (0, _react.useRef)(null);
  var savedContent = (0, _react.useRef)(props.the_content);
  var savedTags = (0, _react.useRef)(props.split_tags);
  var savedNotes = (0, _react.useRef)(props.notes);
  var omniGetters = (0, _react.useRef)({});
  var key_bindings = (0, _react.useRef)([]);
  var statusFuncs = (0, _react.useContext)(_toaster.StatusContext);

  // Only used when not in context
  var _useState = (0, _react.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    showOmnibar = _useState2[0],
    setShowOmnibar = _useState2[1];
  var connection_status = (0, _utilities_react.useConnection)(props.tsocket, initSocket);
  (0, _utilities_react.useConstructor)(function () {
    if (!window.in_context) {
      key_bindings.current = [[["ctrl+space"], _showOmnibar]];
    }
  });
  (0, _react.useEffect)(function () {
    statusFuncs.stopSpinner();
    if (props.registerOmniFunction) {
      props.registerOmniFunction(_omniFunction);
    }
  }, []);
  function initSocket() {
    props.tsocket.attachListener('handle-callback', function (task_packet) {
      (0, _communication_react.handleCallback)(task_packet, props.resource_viewer_id);
    });
    props.tsocket.attachListener("doFlash", function (data) {
      (0, _toaster.doFlash)(data);
    });
    if (!props.controlled) {
      props.tsocket.attachListener('close-user-windows', function (data) {
        if (!(data["originator"] == props.resource_viewer_id)) {
          window.close();
        }
      });
      props.tsocket.attachListener("doFlashUser", function (data) {
        (0, _toaster.doFlash)(data);
      });
    }
  }
  function _showOmnibar() {
    setShowOmnibar(true);
  }
  function _closeOmnibar() {
    setShowOmnibar(false);
  }
  function _omniFunction() {
    var omni_items = [];
    for (var ogetter in omniGetters.current) {
      omni_items = omni_items.concat(omniGetters.current[ogetter]());
    }
    return omni_items;
  }
  function _registerOmniGetter(name, the_function) {
    omniGetters.current[name] = the_function;
  }
  var left_pane = /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, props.show_search && /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      marginBottom: 5,
      marginTop: 15
    }
  }, /*#__PURE__*/_react["default"].createElement(_library_widgets.SearchForm, {
    update_search_state: props.update_search_state,
    search_string: props.search_string,
    regex: props.regex,
    search_ref: props.search_ref,
    allow_regex: props.allow_regex_search,
    number_matches: props.search_matches
  })), props.children);
  var right_pane = /*#__PURE__*/_react["default"].createElement(_blueprint_mdata_fields.CombinedMetadata, {
    tags: props.tags,
    outer_style: {
      marginTop: 0,
      marginLeft: 10,
      overflow: "auto",
      padding: 15,
      marginRight: 0,
      height: "100%"
    },
    created: props.created,
    notes: props.notes,
    icon: props.mdata_icon,
    readOnly: props.readOnly,
    handleChange: props.handleStateChange,
    pane_type: props.res_type
  });
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_menu_utilities.TacticMenubar, {
    menu_specs: props.menu_specs,
    connection_status: connection_status,
    showRefresh: window.in_context,
    showClose: window.in_context,
    refreshTab: props.refreshTab,
    closeTab: props.closeTab,
    resource_name: props.resource_name,
    showErrorDrawerButton: props.showErrorDrawerButton,
    toggleErrorDrawer: props.toggleErrorDrawer,
    registerOmniGetter: _registerOmniGetter
  }), /*#__PURE__*/_react["default"].createElement("div", {
    ref: top_ref,
    style: {
      width: props.usable_width,
      height: props.usable_height,
      marginLeft: 15,
      marginTop: 0
    }
  }, /*#__PURE__*/_react["default"].createElement(_resizing_layouts.HorizontalPanes, {
    available_width: props.usable_width - _sizing_tools.SIDE_MARGIN,
    available_height: props.usable_height,
    left_pane: left_pane,
    show_handle: true,
    right_pane: right_pane,
    initial_width_fraction: .65,
    am_outer: true
  })), !window.in_context && /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_TacticOmnibar.TacticOmnibar, {
    omniGetters: [_omniFunction],
    showOmnibar: showOmnibar,
    closeOmnibar: _closeOmnibar,
    is_authenticated: window.is_authenticated,
    setTheme: props.setTheme,
    page_id: props.resource_viewer_id
  }), /*#__PURE__*/_react["default"].createElement(_key_trap.KeyTrap, {
    global: true,
    bindings: key_bindings.current
  })));
}
exports.ResourceViewerApp = ResourceViewerApp = /*#__PURE__*/(0, _react.memo)(ResourceViewerApp);
ResourceViewerApp.propTypes = {
  resource_name: _propTypes["default"].string,
  search_string: _propTypes["default"].string,
  search_matches: _propTypes["default"].number,
  setResourceNameState: _propTypes["default"].func,
  refreshTab: _propTypes["default"].func,
  closeTab: _propTypes["default"].func,
  res_type: _propTypes["default"].string,
  menu_specs: _propTypes["default"].object,
  created: _propTypes["default"].string,
  tags: _propTypes["default"].array,
  notes: _propTypes["default"].string,
  mdata_icon: _propTypes["default"].string,
  handleStateChange: _propTypes["default"].func,
  meta_outer: _propTypes["default"].string,
  dark_theme: _propTypes["default"].bool,
  tsocket: _propTypes["default"].object,
  saveMe: _propTypes["default"].func,
  children: _propTypes["default"].element,
  show_search: _propTypes["default"].bool,
  update_search_state: _propTypes["default"].func,
  search_ref: _propTypes["default"].object,
  showErrorDrawerButton: _propTypes["default"].bool,
  toggleErrorDrawer: _propTypes["default"].func,
  allow_regex_search: _propTypes["default"].bool,
  regex: _propTypes["default"].bool
};
ResourceViewerApp.defaultProps = {
  search_string: "",
  search_matches: null,
  showErrorDrawerButton: false,
  toggleErrorDrawer: null,
  dark_theme: false,
  am_selected: true,
  controlled: false,
  refreshTab: null,
  closeTab: null,
  search_ref: null,
  allow_regex_search: false,
  regex: false,
  mdata_icon: null
};
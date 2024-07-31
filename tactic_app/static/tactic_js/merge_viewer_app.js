"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MergeViewerApp = MergeViewerApp;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
var _reactCodemirrorMergeview = require("./react-codemirror-mergeview6");
var _blueprint_mdata_fields = require("./blueprint_mdata_fields");
var _menu_utilities = require("./menu_utilities");
var _settings = require("./settings");
var _toaster = require("./toaster");
var _sizing_tools = require("./sizing_tools");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const BOTTOM_MARGIN = 85;
function MergeViewerApp(props) {
  const top_ref = (0, _react.useRef)(null);
  const above_main_ref = (0, _react.useRef)(null);
  const settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  const statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  const [usable_width, usable_height, topX, topY] = (0, _sizing_tools.useSize)(top_ref, 0, "MergeViewerApp");
  const button_groups = [[{
    "name_text": "Save",
    "icon_name": "saved",
    "click_handler": props.saveHandler
  }]];
  (0, _react.useEffect)(() => {
    props.handleSelectChange(props.select_val);
    statusFuncs.stopSpinner();
  }, []);
  const hotkeys = (0, _react.useMemo)(() => [{
    combo: "Ctrl+S",
    global: false,
    group: "Merge Viewer",
    label: "Save Current",
    onKeyDown: props.saveHandler
  }], [props.saveHandler]);
  const {
    handleKeyDown,
    handleKeyUp
  } = (0, _core.useHotkeys)(hotkeys);
  function menu_specs() {
    let ms;
    ms = {
      Save: [{
        name_text: "Save",
        icon_name: "saved",
        click_handler: props.saveHandler,
        key_bindings: ['Ctrl+S']
      }]
    };
    return ms;
  }
  let toolbar_holder_style = {
    "paddingTop": 20,
    paddingLeft: 50
  };
  let max_merge_height = usable_height - BOTTOM_MARGIN;
  let left_div_style = {
    "width": "100%",
    "height": usable_height,
    paddingLeft: 25,
    paddingRight: 25
  };
  let outer_class = "merge-viewer-outer";
  if (settingsContext.isDark()) {
    outer_class = outer_class + " bp5-dark";
  } else {
    outer_class = outer_class + " light-theme";
  }
  let current_style = {
    "bottom": 0
  };
  return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(_menu_utilities.TacticMenubar, {
    menu_specs: menu_specs(),
    connection_status: props.connection_status,
    showIconBar: true,
    showErrorDrawerButton: true,
    showMetadataDrawerButton: false,
    showAssistantDrawerButton: true,
    showSettingsDrawerButton: true,
    showRefresh: false,
    showClose: false,
    refreshTab: null,
    closeTab: null,
    resource_name: props.resource_name,
    controlled: false
  }), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      width: usable_width
    },
    className: outer_class,
    tabIndex: "0",
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp
  }, /*#__PURE__*/_react.default.createElement("div", {
    id: "left-div",
    ref: top_ref,
    style: left_div_style
  }, /*#__PURE__*/_react.default.createElement("div", {
    id: "above-main",
    ref: above_main_ref,
    className: "d-flex flex-row justify-content-between mb-2"
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "align-self-end"
  }, "Current"), /*#__PURE__*/_react.default.createElement(_blueprint_mdata_fields.BpSelect, {
    options: props.option_list,
    onChange: props.handleSelectChange,
    buttonIcon: "application",
    popoverPosition: _core.PopoverPosition.BOTTOM_RIGHT,
    value: props.select_val
  })), /*#__PURE__*/_react.default.createElement(_reactCodemirrorMergeview.ReactCodemirrorMergeView6, {
    handleEditChange: props.handleEditChange,
    editor_content: props.edit_content,
    right_content: props.right_content,
    saveMe: props.saveHandler,
    max_height: max_merge_height
  }))));
}
MergeViewerApp.propTypes = {
  resource_name: _propTypes.default.string,
  option_list: _propTypes.default.array,
  select_val: _propTypes.default.string,
  edit_content: _propTypes.default.string,
  right_content: _propTypes.default.string,
  handleSelectChange: _propTypes.default.func,
  handleEditChange: _propTypes.default.func,
  saveHandler: _propTypes.default.func
};
exports.MergeViewerApp = MergeViewerApp = /*#__PURE__*/(0, _react.memo)(MergeViewerApp);
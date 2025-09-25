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
var _selector_advanced = require("./selector_advanced");
var _menu_utilities = require("./menu_utilities");
var _settings = require("./settings");
var _toaster = require("./toaster");
var _sizing_tools = require("./sizing_tools");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function MergeViewerApp(props) {
  props = {
    initialized: true,
    ...props
  };
  const top_ref = (0, _react.useRef)(null);
  const above_main_ref = (0, _react.useRef)(null);
  const settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  const statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
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
  let left_div_style = {
    display: "flex",
    width: "100%",
    height: "100%",
    flexDirection: "column",
    paddingLeft: 25,
    paddingRight: 25
  };
  let outer_class = "merge-viewer-outer";
  if (settingsContext.isDark()) {
    outer_class = outer_class + " bp6-dark";
  } else {
    outer_class = outer_class + " light-theme";
  }
  let outer_style = {
    width: `calc(100% - ${_sizing_tools.ICON_BAR_WIDTH}px)`,
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 0,
    position: "relative"
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    style: outer_style
  }, /*#__PURE__*/_react.default.createElement(_menu_utilities.TacticMenubar, {
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
    className: outer_class,
    style: {
      display: "flex",
      flex: "1 1 0",
      minHeight: 0,
      width: "100%",
      position: "relative"
    },
    tabIndex: "0",
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp
  }, props.initialized && /*#__PURE__*/_react.default.createElement("div", {
    id: "left-div",
    ref: top_ref,
    style: left_div_style
  }, /*#__PURE__*/_react.default.createElement("div", {
    id: "above-main",
    ref: above_main_ref,
    className: "d-flex flex-row justify-content-between",
    style: {
      marginTop: 5,
      marginBottom: 2
    }
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "align-self-end"
  }, "Current"), /*#__PURE__*/_react.default.createElement(_selector_advanced.BpSelect, {
    options: props.option_list,
    onChange: props.handleSelectChange,
    buttonIcon: "application",
    popoverPosition: _core.PopoverPosition.BOTTOM_RIGHT,
    value: props.select_val
  })), /*#__PURE__*/_react.default.createElement(_reactCodemirrorMergeview.ReactCodemirrorMergeView6, {
    handleEditChange: props.handleEditChange,
    editor_content: props.edit_content,
    right_content: props.right_content,
    saveMe: props.saveHandler
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
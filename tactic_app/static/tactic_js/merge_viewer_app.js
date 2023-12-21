"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MergeViewerApp = MergeViewerApp;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
var _reactCodemirrorMergeview = require("./react-codemirror-mergeview");
var _blueprint_mdata_fields = require("./blueprint_mdata_fields");
var _menu_utilities = require("./menu_utilities");
var _theme = require("./theme");
var _toaster = require("./toaster");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function MergeViewerApp(props) {
  const left_div_ref = (0, _react.useRef)(null);
  const above_main_ref = (0, _react.useRef)(null);
  const [inner_height, set_inner_height] = (0, _react.useState)(window.innerHeight);
  const theme = (0, _react.useContext)(_theme.ThemeContext);
  const statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  const button_groups = [[{
    "name_text": "Save",
    "icon_name": "saved",
    "click_handler": props.saveHandler
  }]];
  (0, _react.useEffect)(() => {
    window.addEventListener("resize", resize_to_window);
    props.handleSelectChange(props.select_val);
    resize_to_window();
    statusFuncs.stopSpinner();
  }, []);
  function menu_specs() {
    let ms;
    ms = {
      Save: [{
        name_text: "Save",
        icon_name: "saved",
        click_handler: props.saveHandler,
        key_bindings: ['ctrl+s']
      }]
    };
    for (const [menu_name, menu] of Object.entries(ms)) {
      for (let but of menu) {
        but.click_handler = but.click_handler.bind(this);
      }
    }
    return ms;
  }
  function resize_to_window() {
    set_inner_height(window.innerHeight);
  }
  function get_new_heights(bottom_margin) {
    let new_ld_height;
    let max_merge_height;
    if (left_div_ref && left_div_ref.current) {
      // This will be true after the initial render
      new_ld_height = inner_height - left_div_ref.current.offsetTop;
      max_merge_height = new_ld_height - bottom_margin;
    } else {
      new_ld_height = inner_height - 45 - bottom_margin;
      max_merge_height = new_ld_height - 50;
    }
    return [new_ld_height, max_merge_height];
  }
  let toolbar_holder_style = {
    "paddingTop": 20,
    paddingLeft: 50
  };
  let new_ld_height;
  let max_merge_height;
  [new_ld_height, max_merge_height] = get_new_heights(65);
  let left_div_style = {
    "width": "100%",
    "height": new_ld_height,
    paddingLeft: 25,
    paddingRight: 25
  };
  let outer_class = "merge-viewer-outer";
  if (theme.dark_theme) {
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
    showRefresh: false,
    showClose: false,
    refreshTab: null,
    closeTab: null,
    resource_name: props.resource_name,
    controlled: false
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: outer_class
  }, /*#__PURE__*/_react.default.createElement("div", {
    id: "left-div",
    ref: left_div_ref,
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
  })), /*#__PURE__*/_react.default.createElement(_reactCodemirrorMergeview.ReactCodemirrorMergeView, {
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
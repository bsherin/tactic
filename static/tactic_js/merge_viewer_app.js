"use strict";

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
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function MergeViewerApp(props) {
  props = _objectSpread({
    initialized: true
  }, props);
  var top_ref = (0, _react.useRef)(null);
  var above_main_ref = (0, _react.useRef)(null);
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  var statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  var button_groups = [[{
    "name_text": "Save",
    "icon_name": "saved",
    "click_handler": props.saveHandler
  }]];
  (0, _react.useEffect)(function () {
    props.handleSelectChange(props.select_val);
    statusFuncs.stopSpinner();
  }, []);
  var hotkeys = (0, _react.useMemo)(function () {
    return [{
      combo: "Ctrl+S",
      global: false,
      group: "Merge Viewer",
      label: "Save Current",
      onKeyDown: props.saveHandler
    }];
  }, [props.saveHandler]);
  var _useHotkeys = (0, _core.useHotkeys)(hotkeys),
    handleKeyDown = _useHotkeys.handleKeyDown,
    handleKeyUp = _useHotkeys.handleKeyUp;
  function menu_specs() {
    var ms;
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
  var left_div_style = {
    display: "flex",
    minHeight: 0,
    minWidth: 0,
    width: "100%",
    height: "100%",
    flexDirection: "column",
    paddingLeft: 25,
    paddingRight: 25
  };
  var outer_class = "merge-viewer-outer";
  if (settingsContext.isDark()) {
    outer_class = outer_class + " bp6-dark";
  } else {
    outer_class = outer_class + " light-theme";
  }
  var outer_style = {
    width: "calc(100% - ".concat(_sizing_tools.ICON_BAR_WIDTH, "px)"),
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 0,
    position: "relative"
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: outer_style
  }, /*#__PURE__*/_react["default"].createElement(_menu_utilities.TacticMenubar, {
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
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: outer_class,
    style: {
      display: "flex",
      flex: "1 1 0",
      minHeight: 0,
      minWidth: 0,
      width: "100%",
      position: "relative"
    },
    tabIndex: "0",
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp
  }, props.initialized && /*#__PURE__*/_react["default"].createElement("div", {
    id: "left-div",
    ref: top_ref,
    style: left_div_style
  }, /*#__PURE__*/_react["default"].createElement("div", {
    id: "above-main",
    ref: above_main_ref,
    className: "d-flex flex-row justify-content-between",
    style: {
      marginTop: 5,
      marginBottom: 2
    }
  }, /*#__PURE__*/_react["default"].createElement("span", {
    className: "align-self-end"
  }, "Current"), /*#__PURE__*/_react["default"].createElement(_selector_advanced.BpSelect, {
    options: props.option_list,
    onChange: props.handleSelectChange,
    buttonIcon: "application",
    popoverPosition: _core.PopoverPosition.BOTTOM_RIGHT,
    value: props.select_val
  })), /*#__PURE__*/_react["default"].createElement(_reactCodemirrorMergeview.ReactCodemirrorMergeView6, {
    handleEditChange: props.handleEditChange,
    editor_content: props.edit_content,
    right_content: props.right_content,
    saveMe: props.saveHandler
  }))));
}
MergeViewerApp.propTypes = {
  resource_name: _propTypes["default"].string,
  option_list: _propTypes["default"].array,
  select_val: _propTypes["default"].string,
  edit_content: _propTypes["default"].string,
  right_content: _propTypes["default"].string,
  handleSelectChange: _propTypes["default"].func,
  handleEditChange: _propTypes["default"].func,
  saveHandler: _propTypes["default"].func
};
exports.MergeViewerApp = MergeViewerApp = /*#__PURE__*/(0, _react.memo)(MergeViewerApp);
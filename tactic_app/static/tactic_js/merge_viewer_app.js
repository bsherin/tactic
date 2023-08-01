"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
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
var _TacticOmnibar = require("./TacticOmnibar");
var _key_trap = require("./key_trap");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function MergeViewerApp(props) {
  var left_div_ref = (0, _react.useRef)(null);
  var above_main_ref = (0, _react.useRef)(null);
  var omniGetters = (0, _react.useRef)({});
  var _useState = (0, _react.useState)(window.innerHeight),
    _useState2 = _slicedToArray(_useState, 2),
    inner_height = _useState2[0],
    set_inner_height = _useState2[1];

  // These only matter if not controlled
  var _useState3 = (0, _react.useState)(false),
    _useState4 = _slicedToArray(_useState3, 2),
    showOmnibar = _useState4[0],
    setShowOmnibar = _useState4[1];
  var key_bindings = [[["ctrl+space"], _showOmnibar]];
  var button_groups = [[{
    "name_text": "Save",
    "icon_name": "saved",
    "click_handler": props.saveHandler
  }]];
  (0, _react.useEffect)(function () {
    window.addEventListener("resize", resize_to_window);
    props.handleSelectChange(props.select_val);
    resize_to_window();
    props.stopSpinner();
  }, []);
  function menu_specs() {
    var ms;
    ms = {
      Save: [{
        name_text: "Save",
        icon_name: "saved",
        click_handler: props.saveHandler,
        key_bindings: ['ctrl+s']
      }]
    };
    for (var _i2 = 0, _Object$entries = Object.entries(ms); _i2 < _Object$entries.length; _i2++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i2], 2),
        menu_name = _Object$entries$_i[0],
        menu = _Object$entries$_i[1];
      var _iterator = _createForOfIteratorHelper(menu),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var but = _step.value;
          but.click_handler = but.click_handler.bind(this);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
    return ms;
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
      omni_items = omni_items.concat(mniGetters.current[ogetter]());
    }
    return omni_items;
  }
  function _registerOmniGetter(name, the_function) {
    omniGetters.current[name] = the_function;
  }
  function resize_to_window() {
    set_inner_height(window.innerHeight);
  }
  function get_new_heights(bottom_margin) {
    var new_ld_height;
    var max_merge_height;
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
  var toolbar_holder_style = {
    "paddingTop": 20,
    paddingLeft: 50
  };
  var new_ld_height;
  var max_merge_height;
  var _get_new_heights = get_new_heights(65);
  var _get_new_heights2 = _slicedToArray(_get_new_heights, 2);
  new_ld_height = _get_new_heights2[0];
  max_merge_height = _get_new_heights2[1];
  var left_div_style = {
    "width": "100%",
    "height": new_ld_height,
    paddingLeft: 25,
    paddingRight: 25
  };
  var outer_class = "merge-viewer-outer";
  if (props.dark_theme) {
    outer_class = outer_class + " bp5-dark";
  } else {
    outer_class = outer_class + " light-theme";
  }
  var current_style = {
    "bottom": 0
  };
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_menu_utilities.TacticMenubar, {
    menu_specs: menu_specs(),
    showRefresh: false,
    showClose: false,
    dark_theme: props.dark_theme,
    refreshTab: null,
    closeTab: null,
    resource_name: props.resource_name,
    toggleErrorDrawer: props.toggleErrorDrawer,
    controlled: false,
    am_selected: false,
    registerOmniGetter: _registerOmniGetter
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: outer_class
  }, /*#__PURE__*/_react["default"].createElement("div", {
    id: "left-div",
    ref: left_div_ref,
    style: left_div_style
  }, /*#__PURE__*/_react["default"].createElement("div", {
    id: "above-main",
    ref: above_main_ref,
    className: "d-flex flex-row justify-content-between mb-2"
  }, /*#__PURE__*/_react["default"].createElement("span", {
    className: "align-self-end"
  }, "Current"), /*#__PURE__*/_react["default"].createElement(_blueprint_mdata_fields.BpSelect, {
    options: props.option_list,
    onChange: props.handleSelectChange,
    buttonIcon: "application",
    popoverPosition: _core.PopoverPosition.BOTTOM_RIGHT,
    value: props.select_val
  })), /*#__PURE__*/_react["default"].createElement(_reactCodemirrorMergeview.ReactCodemirrorMergeView, {
    handleEditChange: props.handleEditChange,
    dark_theme: props.dark_theme,
    editor_content: props.edit_content,
    right_content: props.right_content,
    saveMe: props.saveHandler,
    max_height: max_merge_height
  }))), /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_TacticOmnibar.TacticOmnibar, {
    omniGetters: [_omniFunction],
    page_id: props.page_id,
    showOmnibar: showOmnibar,
    closeOmnibar: _closeOmnibar,
    is_authenticated: window.is_authenticated,
    dark_theme: props.dark_theme,
    setTheme: props.setTheme
  }), /*#__PURE__*/_react["default"].createElement(_key_trap.KeyTrap, {
    global: true,
    bindings: key_bindings
  })));
}
MergeViewerApp.propTypes = {
  resource_name: _propTypes["default"].string,
  option_list: _propTypes["default"].array,
  select_val: _propTypes["default"].string,
  edit_content: _propTypes["default"].string,
  right_content: _propTypes["default"].string,
  handleSelectChange: _propTypes["default"].func,
  handleEditChange: _propTypes["default"].func,
  dark_theme: _propTypes["default"].bool,
  saveHandler: _propTypes["default"].func
};
exports.MergeViewerApp = MergeViewerApp = /*#__PURE__*/(0, _react.memo)(MergeViewerApp);
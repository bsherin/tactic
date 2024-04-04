"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
var _sizing_tools = require("./sizing_tools");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var BOTTOM_MARGIN = 85;
function MergeViewerApp(props) {
  var top_ref = (0, _react.useRef)(null);
  var above_main_ref = (0, _react.useRef)(null);
  var theme = (0, _react.useContext)(_theme.ThemeContext);
  var statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  var _useSize = (0, _sizing_tools.useSize)(top_ref, 0, "MergeViewerApp"),
    _useSize2 = _slicedToArray(_useSize, 4),
    usable_width = _useSize2[0],
    usable_height = _useSize2[1],
    topX = _useSize2[2],
    topY = _useSize2[3];
  var button_groups = [[{
    "name_text": "Save",
    "icon_name": "saved",
    "click_handler": props.saveHandler
  }]];
  (0, _react.useEffect)(function () {
    props.handleSelectChange(props.select_val);
    statusFuncs.stopSpinner();
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
    for (var _i = 0, _Object$entries = Object.entries(ms); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
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
  var toolbar_holder_style = {
    "paddingTop": 20,
    paddingLeft: 50
  };
  var max_merge_height = usable_height - BOTTOM_MARGIN;
  var left_div_style = {
    "width": "100%",
    "height": usable_height,
    paddingLeft: 25,
    paddingRight: 25
  };
  var outer_class = "merge-viewer-outer";
  if (theme.dark_theme) {
    outer_class = outer_class + " bp5-dark";
  } else {
    outer_class = outer_class + " light-theme";
  }
  var current_style = {
    "bottom": 0
  };
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_menu_utilities.TacticMenubar, {
    menu_specs: menu_specs(),
    connection_status: props.connection_status,
    showRefresh: false,
    showClose: false,
    refreshTab: null,
    closeTab: null,
    resource_name: props.resource_name,
    controlled: false
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: outer_class
  }, /*#__PURE__*/_react["default"].createElement("div", {
    id: "left-div",
    ref: top_ref,
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
    editor_content: props.edit_content,
    right_content: props.right_content,
    saveMe: props.saveHandler,
    max_height: max_merge_height
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
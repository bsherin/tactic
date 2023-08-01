"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
require("../tactic_css/tactic.scss");
var _react = _interopRequireWildcard(require("react"));
var ReactDOM = _interopRequireWildcard(require("react-dom"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _merge_viewer_app = require("./merge_viewer_app");
var _toaster = require("./toaster");
var _communication_react = require("./communication_react");
var _error_drawer = require("./error_drawer");
var _utilities_react = require("./utilities_react");
var _blueprint_navbar = require("./blueprint_navbar");
var _tactic_socket = require("./tactic_socket");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function tile_differ_main() {
  function gotProps(the_props) {
    var TileDifferAppPlus = (0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(TileDifferApp));
    var the_element = /*#__PURE__*/_react["default"].createElement(TileDifferAppPlus, _extends({}, the_props, {
      controlled: false,
      initial_theme: window.theme,
      changeName: null
    }));
    var domContainer = document.querySelector('#root');
    ReactDOM.render(the_element, domContainer);
  }
  var get_url = "get_module_code";
  (0, _communication_react.postAjaxPromise)("".concat(get_url, "/").concat(window.resource_name), {}).then(function (data) {
    var edit_content = data.the_content;
    (0, _communication_react.postAjaxPromise)("get_tile_names").then(function (data2) {
      data.tile_list = data2.tile_names;
      data.resource_name = window.resource_name, data.second_resource_name = window.second_resource_name;
      tile_differ_props(data, null, gotProps);
    })["catch"](_toaster.doFlash);
  })["catch"](_toaster.doFlash);
}
function tile_differ_props(data, registerDirtyMethod, finalCallback) {
  var resource_viewer_id = (0, _utilities_react.guid)();
  var tsocket = new _tactic_socket.TacticSocket("main", 5000, resource_viewer_id);
  finalCallback({
    resource_viewer_id: resource_viewer_id,
    tsocket: tsocket,
    tile_list: data.tile_list,
    resource_name: data.resource_name,
    second_resource_name: data.second_resource_name,
    edit_content: data.the_content,
    is_repository: false,
    registerDirtyMethod: registerDirtyMethod
  });
}
function TileDifferApp(props) {
  var _useState = (0, _react.useState)(props.edit_content),
    _useState2 = _slicedToArray(_useState, 2),
    edit_content = _useState2[0],
    set_edit_content = _useState2[1];
  var _useState3 = (0, _react.useState)(""),
    _useState4 = _slicedToArray(_useState3, 2),
    right_content = _useState4[0],
    set_right_content = _useState4[1];
  var _useState5 = (0, _react.useState)(props.second_resource_name == "none" ? props.resource_name : props.second_resource_name),
    _useState6 = _slicedToArray(_useState5, 2),
    tile_popup_val = _useState6[0],
    set_tile_popup_val = _useState6[1];
  var _useState7 = (0, _react.useState)(props.tile_list),
    _useState8 = _slicedToArray(_useState7, 2),
    tile_list = _useState8[0],
    set_tile_list = _useState8[1];
  var _useState9 = (0, _react.useState)(props.initial_theme === "dark"),
    _useState10 = _slicedToArray(_useState9, 2),
    dark_theme = _useState10[0],
    set_dark_theme = _useState10[1];
  var _useState11 = (0, _react.useState)(props.resource_name),
    _useState12 = _slicedToArray(_useState11, 2),
    resource_name = _useState12[0],
    set_resource_name = _useState12[1];
  var savedContent = (0, _react.useRef)(props.edit_content);
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  (0, _react.useEffect)(function () {
    window.addEventListener("beforeunload", function (e) {
      if (_dirty()) {
        e.preventDefault();
        e.returnValue = '';
      }
    });
    initSocket();
    if (!props.controlled) {
      window.dark_theme = dark_theme;
    }
    return function () {
      tsocket.disconnect();
    };
  }, []);
  function initSocket() {
    props.tsocket.attachListener("window-open", function (data) {
      return window.open("".concat($SCRIPT_ROOT, "/load_temp_page/").concat(data["the_id"]));
    });
    props.tsocket.attachListener('close-user-windows', function (data) {
      if (!(data["originator"] == window.library_id)) {
        window.close();
      }
    });
    props.tsocket.attachListener('doflash', _toaster.doFlash);
    props.tsocket.attachListener('doflashUser', _toaster.doFlash);
  }
  function _setTheme(dark_theme) {
    set_dark_theme(dark_theme);
    pushCallback(function () {
      if (!window.in_context) {
        window.dark_theme = dark_theme;
      }
    });
  }
  function handleSelectChange(new_value) {
    set_tile_popup_val(new_value);
    var self = this;
    (0, _communication_react.postAjaxPromise)("get_module_code/" + new_value, {}).then(function (data) {
      set_right_content(data.the_content);
    })["catch"](_toaster.doFlash);
  }
  function handleEditChange(new_code) {
    set_edit_content(new_code);
  }
  function saveFromLeft() {
    var data_dict = {
      "module_name": props.resource_name,
      "module_code": edit_content
    };
    (0, _communication_react.postAjaxPromise)("update_from_left", data_dict).then(_toaster.doFlash)["catch"](_toaster.doFlash);
  }
  function dirty() {
    return edit_content != savedContent.current;
  }
  var actual_dark_theme = props.controlled ? props.dark_theme : dark_theme;
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, !props.controlled, " ", /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    dark_theme: actual_dark_theme,
    setTheme: _setTheme,
    selected: null,
    show_api_links: true,
    page_id: props.resource_viewer_id,
    user_name: window.username
  }), /*#__PURE__*/_react["default"].createElement(_merge_viewer_app.MergeViewerApp, _extends({}, props.statusFuncs, {
    page_id: props.resource_viewer_id,
    setTheme: props.controlled ? null : _setTheme,
    dark_theme: actual_dark_theme,
    resource_viewer_id: props.resource_viewer_id,
    resource_name: props.resource_name,
    option_list: tile_list,
    select_val: tile_popup_val,
    edit_content: edit_content,
    right_content: right_content,
    handleSelectChange: handleSelectChange,
    handleEditChange: handleEditChange,
    saveHandler: saveFromLeft
  })));
}
TileDifferApp.propTypes = {
  resource_name: _propTypes["default"].string,
  tile_list: _propTypes["default"].array,
  edit_content: _propTypes["default"].string,
  second_resource_name: _propTypes["default"].string
};
TileDifferApp = /*#__PURE__*/(0, _react.memo)(TileDifferApp);
if (!window.in_context) {
  tile_differ_main();
}
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
require("../tactic_css/tactic.scss");
var _react = _interopRequireWildcard(require("react"));
var ReactDOM = _interopRequireWildcard(require("react-dom"));
var _core = require("@blueprintjs/core");
var _toaster = require("./toaster");
var _communication_react = require("./communication_react");
var _utilities_react = require("./utilities_react");
var _blueprint_navbar = require("./blueprint_navbar");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
window.page_id = (0, _utilities_react.guid)();
var tsocket;
function _login_main() {
  if (window._show_message) (0, _toaster.doFlash)(window._message);
  var domContainer = document.querySelector('#root');
  ReactDOM.render( /*#__PURE__*/_react["default"].createElement(LoginAppWithStatus, {
    tsocket: null,
    controlled: false
  }), domContainer);
}
function LoginApp(props) {
  var _useState = (0, _react.useState)(null),
    _useState2 = _slicedToArray(_useState, 2),
    username = _useState2[0],
    setUsername = _useState2[1];
  var _useState3 = (0, _react.useState)(null),
    _useState4 = _slicedToArray(_useState3, 2),
    password = _useState4[0],
    setPassword = _useState4[1];
  var _useState5 = (0, _react.useState)(""),
    _useState6 = _slicedToArray(_useState5, 2),
    username_warning_text = _useState6[0],
    set_username_warning_text = _useState6[1];
  var _useState7 = (0, _react.useState)(""),
    _useState8 = _slicedToArray(_useState7, 2),
    password_warning_text = _useState8[0],
    set_password_warning_text = _useState8[1];
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)((0, _blueprint_navbar.get_theme_cookie)() == "dark"),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    dark_theme = _useStateAndRef2[0],
    set_dark_theme = _useStateAndRef2[1],
    dark_theme_ref = _useStateAndRef2[2];
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  var inputRef = (0, _react.useRef)(null);
  (0, _react.useEffect)(function () {
    inputRef.current.focus();
  }, []);
  function _setTheme(local_dark_theme) {
    set_dark_theme(local_dark_theme);
    pushCallback(function () {
      window.dark_theme = dark_theme;
    });
  }
  function _onUsernameChange(event) {
    setUsername(event.target.value);
  }
  function _onPasswordChange(event) {
    setPassword(event.target.value);
  }
  function _submit_login_info() {
    props.setStatus({
      show_spinner: true,
      status_message: "Attempting login ..."
    });
    var data = {};
    if (username == "") {
      set_username_warning_text("Username cannot be empty");
      return;
    }
    if (password == "") {
      set_password_warning_text("Password cannot be empty");
      return;
    }
    data.username = username;
    data.password = password;
    data.remember_me = true;
    var x = new Date();
    data.tzOffset = x.getTimezoneOffset() / 60;
    (0, _communication_react.postAjax)("attempt_login", data, _return_from_submit_login);
  }
  function _return_from_submit_login(data) {
    console.log("returned from attempt login with data.login " + String(data.logged_in));
    props.clearStatus();
    if (data.logged_in) {
      window.open($SCRIPT_ROOT + window._next_view, "_self");
    } else {
      set_password_warning_text("Login failed");
    }
  }
  function _refHandler(the_ref) {
    inputRef.current = the_ref;
  }
  var outer_class = "login-body d-flex flex-column justify-content-center";
  if (dark_theme) {
    outer_class = outer_class + " bp4-dark";
  } else {
    outer_class = outer_class + " light-theme";
  }
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    dark_theme: dark_theme,
    setTheme: _setTheme,
    selected: null,
    show_api_links: false,
    page_id: window.page_id,
    user_name: window.username
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: outer_class,
    style: {
      textAlign: "center",
      height: "100%"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    id: "status-area"
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-row justify-content-around"
  }, /*#__PURE__*/_react["default"].createElement("img", {
    className: "mb-4",
    src: window.tactic_img_url,
    alt: "",
    width: "72",
    height: "72"
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-row justify-content-around"
  }, /*#__PURE__*/_react["default"].createElement("h4", null, "Please sign in")), /*#__PURE__*/_react["default"].createElement("form", {
    onSubmit: function onSubmit(e) {
      e.preventDefault();
      _submit_login_info();
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    className: "d-flex flex-row justify-content-around",
    helperText: username_warning_text
  }, /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
    type: "text",
    onChange: _onUsernameChange,
    large: true,
    fill: false,
    placeholder: "Username",
    autoCapitalize: "none",
    autoCorrect: "off",
    inputRef: _refHandler
  })), /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    className: "d-flex flex-row justify-content-around",
    helperText: password_warning_text
  }, /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
    type: "password",
    onChange: _onPasswordChange,
    large: true,
    fill: false,
    placeholder: "Password",
    autoCapitalize: "none",
    autoCorrect: "off"
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-row justify-content-around"
  }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
    icon: "log-in",
    large: true,
    type: "submit",
    text: "Sign in"
  })))));
}
LoginApp = /*#__PURE__*/(0, _react.memo)(LoginApp);
var LoginAppWithStatus = (0, _toaster.withStatus)(LoginApp);
_login_main();
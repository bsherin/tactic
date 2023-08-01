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
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
window.main_id = (0, _utilities_react.guid)();
function _account_main() {
  if (window._show_message) (0, _toaster.doFlash)(window._message);
  var domContainer = document.querySelector('#root');
  ReactDOM.render( /*#__PURE__*/_react["default"].createElement(AccountApp, {
    initial_theme: window.theme,
    controlled: false
  }), domContainer);
}
var field_names = ["new_password", "confirm_new_password"];
function AccountTextField(props) {
  return /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    key: props.name,
    inline: false,
    style: {
      padding: 5
    },
    label: props.display_text,
    helperText: props.helper_text
  }, /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
    type: "text",
    onChange: function onChange(event) {
      return props.onFieldChange(props.name, event.target.value, false);
    },
    onBlur: function onBlur() {
      return props.onBlur(props.name, props.value);
    },
    style: {
      width: 250
    },
    large: false,
    fill: false,
    placeholder: props.name,
    value: props.value
  }));
}
AccountTextField = /*#__PURE__*/(0, _react.memo)(AccountTextField);
function AccountSelectField(props) {
  return /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    key: props.name,
    inline: false,
    style: {
      padding: 5
    },
    label: props.display_text,
    helperText: props.helper_text
  }, /*#__PURE__*/_react["default"].createElement(_core.HTMLSelect, {
    options: props.options,
    onChange: function onChange(e) {
      props.onFieldChange(props.name, e.currentTarget.value, true);
    },
    value: props.value
  }));
}
AccountSelectField = /*#__PURE__*/(0, _react.memo)(AccountSelectField);
function AccountApp(props) {
  var _useState = (0, _react.useState)(props.initial_theme == "dark"),
    _useState2 = _slicedToArray(_useState, 2),
    dark_theme = _useState2[0],
    set_dark_theme = _useState2[1];
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)([]),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    fields = _useStateAndRef2[0],
    set_fields = _useStateAndRef2[1],
    fields_ref = _useStateAndRef2[2];
  var _useState3 = (0, _react.useState)(""),
    _useState4 = _slicedToArray(_useState3, 2),
    password = _useState4[0],
    set_password = _useState4[1];
  var _useState5 = (0, _react.useState)(""),
    _useState6 = _slicedToArray(_useState5, 2),
    confirm_password = _useState6[0],
    set_confirm_password = _useState6[1];
  var _useState7 = (0, _react.useState)(null),
    _useState8 = _slicedToArray(_useState7, 2),
    password_helper = _useState8[0],
    set_password_helper = _useState8[1];
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  (0, _react.useEffect)(function () {
    (0, _communication_react.postAjax)("get_account_info", {}, function (data) {
      set_fields(data.field_list);
      window.dark_theme = dark_theme;
    });
  }, []);
  function _setTheme(dark_theme) {
    set_dark_theme(dark_theme);
    pushCallback(function () {
      window.dark_theme = dark_theme;
    });
  }
  function _submitPassword() {
    var pwd = password;
    if (pwd != confirm_password) {
      set_password_helper("Passwords don't match");
      return;
    }
    if (pwd == "") {
      set_password_helper("Passwords can't be empty");
      return;
    }
    var data = {};
    data["password"] = pwd;
    (0, _communication_react.postAjax)("update_account_info", data, function (result) {
      if (result.success) {
        (0, _toaster.doFlash)({
          "message": "Password successfully updated",
          "alert_type": "alert-success"
        });
      } else {
        data.alert_type = "alert-warning";
        (0, _toaster.doFlash)(data);
      }
    });
  }
  function _onFieldChange(fname, value) {
    var submit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    if (fname == "password") {
      set_password(value);
    } else if (fname == "confirm_password") {
      set_confirm_password(value);
    } else {
      var new_fields = fields.map(function (fdict) {
        if (fdict.name == fname) {
          var ndict = _objectSpread({}, fdict);
          ndict.val = value;
          return ndict;
        } else {
          return fdict;
        }
      });
      set_fields(new_fields);
      pushCallback(function () {
        if (submit) {
          _submitUpdatedField(fname, value);
        }
      });
    }
  }
  function _clearHelperText(fname) {
    _setHelperText(fname, null);
  }
  function _setHelperText(fname, helper_text) {
    var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    // Need to use fields_ref here because of the setTimeout in which it appears.
    var new_fields = fields_ref.current.map(function (fdict) {
      if (fdict.name == fname) {
        var ndict = _objectSpread({}, fdict);
        ndict.helper_text = helper_text;
        return ndict;
      } else {
        return fdict;
      }
    });
    set_fields(new_fields);
    pushCallback(function () {
      if (timeout) {
        setTimeout(function () {
          _clearHelperText(fname);
        }, 5000);
      }
    });
  }
  function _submitUpdatedField(fname, fvalue) {
    var data = {};
    data[fname] = fvalue;
    (0, _communication_react.postAjax)("update_account_info", data, function (result) {
      if (result.success) {
        if (fname == "password") {
          (0, _toaster.doFlash)({
            "message": "Password successfully updated",
            "alert_type": "alert-success"
          });
        } else {
          _setHelperText(fname, "value updated", true);
        }
      } else {
        data.alert_type = "alert-warning";
        (0, _toaster.doFlash)(data);
      }
    });
  }
  function _submit_account_info() {
    (0, _communication_react.postAjax)("update_account_info", fields_ref.current, function (result) {
      if (result.success) {
        (0, _toaster.doFlash)({
          "message": "Account successfully updated",
          "alert_type": "alert-success"
        });
      } else {
        data.alert_type = "alert-warning";
        (0, _toaster.doFlash)(data);
      }
    });
  }
  function _getFieldItems() {
    var info_items = [];
    var setting_items = [];
    var _iterator = _createForOfIteratorHelper(fields),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var fdict = _step.value;
        var new_item = void 0;
        if (fdict.type == "text") {
          new_item = /*#__PURE__*/_react["default"].createElement(AccountTextField, {
            name: fdict.name,
            key: fdict.name,
            value: fdict.val,
            display_text: fdict.display_text,
            helper_text: fdict.helper_text,
            onBlur: _submitUpdatedField,
            onFieldChange: _onFieldChange
          });
        } else {
          new_item = /*#__PURE__*/_react["default"].createElement(AccountSelectField, {
            name: fdict.name,
            key: fdict.name,
            value: fdict.val,
            display_text: fdict.display_text,
            options: fdict.options,
            helper_text: fdict.helper_text,
            onFieldChange: _onFieldChange
          });
        }
        if (fdict.info_type == "info") {
          info_items.push(new_item);
        } else {
          setting_items.push(new_item);
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return [info_items, setting_items];
  }
  var field_items = _getFieldItems();
  var outer_class = "account-settings";
  if (dark_theme) {
    outer_class = outer_class + " bp5-dark";
  } else {
    outer_class = outer_class + " light-theme";
  }
  var self = this;
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    dark_theme: dark_theme,
    setTheme: props.controlled ? props.setTheme : _setTheme,
    selected: null,
    show_api_links: false,
    page_id: window.main_id,
    user_name: window.username
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: outer_class
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      overflowY: "scroll"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "account-pane bp5-card"
  }, /*#__PURE__*/_react["default"].createElement("h6", null, "User Info"), field_items[0]), /*#__PURE__*/_react["default"].createElement("div", {
    className: "account-pane bp5-card"
  }, /*#__PURE__*/_react["default"].createElement("h6", null, "User Settings"), field_items[1])), /*#__PURE__*/_react["default"].createElement("div", {
    className: "account-pane bp5-card"
  }, /*#__PURE__*/_react["default"].createElement("h6", null, "Change Password"), /*#__PURE__*/_react["default"].createElement(AccountTextField, {
    name: "password",
    key: "password",
    value: password,
    helper_text: password_helper,
    onFieldChange: _onFieldChange
  }), /*#__PURE__*/_react["default"].createElement(AccountTextField, {
    name: "confirm_password",
    key: "confirm_password",
    value: confirm_password,
    helper_text: password_helper,
    onFieldChange: _onFieldChange
  }), /*#__PURE__*/_react["default"].createElement(_core.Button, {
    icon: "log-in",
    large: true,
    text: "Update Password",
    onClick: _submitPassword
  }))));
}
AccountApp = /*#__PURE__*/(0, _react.memo)(AccountApp);
_account_main();
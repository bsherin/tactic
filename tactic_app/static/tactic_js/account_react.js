"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
require("../tactic_css/tactic.scss");
var _react = _interopRequireWildcard(require("react"));
var _client = require("react-dom/client");
var _core = require("@blueprintjs/core");
var _toaster = require("./toaster");
var _communication_react = require("./communication_react");
var _utilities_react = require("./utilities_react");
var _blueprint_navbar = require("./blueprint_navbar");
var _settings = require("./settings");
var _account_fields = require("./account_fields");
var _tactic_socket = require("./tactic_socket");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; } //comments
window.main_id = (0, _utilities_react.guid)();
function _account_main() {
  if (window._show_message) (0, _toaster.doFlash)(window._message);
  var domContainer = document.querySelector('#root');
  var root = (0, _client.createRoot)(domContainer);
  var tsocket = new _tactic_socket.TacticSocket("main", 5000, "code_viewer", window.main_id);
  var AccountAppPlus = (0, _settings.withSettings)(AccountApp);
  root.render( /*#__PURE__*/_react["default"].createElement(AccountAppPlus, {
    controlled: false,
    tsocket: tsocket
  }));
}
var field_names = ["new_password", "confirm_new_password"];
function AccountApp(props) {
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)([]),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    fields = _useStateAndRef2[0],
    set_fields = _useStateAndRef2[1],
    fields_ref = _useStateAndRef2[2];
  var _useState = (0, _react.useState)(""),
    _useState2 = _slicedToArray(_useState, 2),
    password = _useState2[0],
    set_password = _useState2[1];
  var _useState3 = (0, _react.useState)(""),
    _useState4 = _slicedToArray(_useState3, 2),
    confirm_password = _useState4[0],
    set_confirm_password = _useState4[1];
  var _useState5 = (0, _react.useState)(null),
    _useState6 = _slicedToArray(_useState5, 2),
    password_helper = _useState6[0],
    set_password_helper = _useState6[1];
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  (0, _react.useEffect)(function () {
    (0, _communication_react.postAjax)("get_account_info", {}, function (data) {
      set_fields(data.field_list);
    });
  }, []);
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
          new_item = /*#__PURE__*/_react["default"].createElement(_account_fields.AccountTextField, {
            name: fdict.name,
            key: fdict.name,
            value: fdict.val,
            display_text: fdict.display_text,
            helper_text: fdict.helper_text,
            onBlur: _submitUpdatedField,
            onFieldChange: _onFieldChange
          });
        } else {
          new_item = /*#__PURE__*/_react["default"].createElement(_account_fields.AccountSelectField, {
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
  if (settingsContext.isDark()) {
    outer_class = outer_class + " bp5-dark";
  } else {
    outer_class = outer_class + " light-theme";
  }
  var self = this;
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
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
  }, /*#__PURE__*/_react["default"].createElement("h6", null, "Change Password"), /*#__PURE__*/_react["default"].createElement(_account_fields.AccountTextField, {
    name: "password",
    key: "password",
    value: password,
    helper_text: password_helper,
    onFieldChange: _onFieldChange
  }), /*#__PURE__*/_react["default"].createElement(_account_fields.AccountTextField, {
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
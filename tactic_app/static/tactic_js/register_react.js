"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
require("../tactic_css/tactic.scss");
var _react = _interopRequireWildcard(require("react"));
var _client = require("react-dom/client");
var _core = require("@blueprintjs/core");
var _blueprint_navbar = require("./blueprint_navbar");
var _toaster = require("./toaster");
var _communication_react = require("./communication_react");
var _utilities_react = require("./utilities_react");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
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
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
window.page_id = (0, _utilities_react.guid)();
function _register_main() {
  var domContainer = document.querySelector('#root');
  var root = (0, _client.createRoot)(domContainer);
  root.render( /*#__PURE__*/_react["default"].createElement(RegisterApp, null));
}
var field_names = ["username", "password", "confirm_password"];
var initial_fields = {};
for (var _i = 0, _field_names = field_names; _i < _field_names.length; _i++) {
  var field = _field_names[_i];
  initial_fields[field] = "";
}
var initial_helper_text = {};
for (var _i2 = 0, _field_names2 = field_names; _i2 < _field_names2.length; _i2++) {
  var _field = _field_names2[_i2];
  initial_helper_text[_field] = null;
}
function RegisterApp(props) {
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)(initial_fields),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    fields = _useStateAndRef2[0],
    set_fields = _useStateAndRef2[1],
    fields_ref = _useStateAndRef2[2];
  var _useStateAndRef3 = (0, _utilities_react.useStateAndRef)(initial_helper_text),
    _useStateAndRef4 = _slicedToArray(_useStateAndRef3, 3),
    helper_text = _useStateAndRef4[0],
    set_helper_text = _useStateAndRef4[1],
    helper_text_ref = _useStateAndRef4[2];
  function _onFieldChange(field, value) {
    var new_fields = _objectSpread({}, fields_ref.current);
    new_fields[field] = value;
    set_fields(new_fields);
  }
  function _submit_register_info() {
    var pwd = fields_ref.current.password;
    var pwd2 = fields_ref.current.confirm_password;
    var data = {};
    if (pwd == "" || pwd2 == "") {
      var new_helper_text = _objectSpread({}, helper_text.current);
      new_helper_text.confirm_password = "Passwords cannot be empty";
      set_helper_text(new_helper_text);
      return;
    }
    if (pwd != pwd2) {
      var _new_helper_text = _objectSpread({}, helper_text.current);
      _new_helper_text.confirm_password = "Passwords don't match";
      set_helper_text(_new_helper_text);
      return;
    }
    data.password = pwd;
    (0, _communication_react.postAjax)("attempt_register", fields_ref.current, function (result) {
      if (result.success) {
        (0, _toaster.doFlash)({
          "message": "Account successfully created",
          "alert_type": "alert-success"
        });
      } else {
        data.alert_type = "alert-warning";
        (0, _toaster.doFlash)(data);
      }
    });
  }
  var field_items = Object.keys(fields_ref.current).map(function (field_name) {
    return /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
      key: field_name,
      inline: true,
      style: {
        padding: 10
      },
      label: field_name,
      helperText: helper_text_ref.current[field_name]
    }, /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
      type: "text",
      onChange: function onChange(event) {
        return _onFieldChange(field_name, event.target.value);
      },
      style: {
        width: 250
      },
      large: true,
      fill: false,
      placeholder: field_name,
      value: fields_ref.current[field_name]
    }));
  });
  var outer_style = {
    textAlign: "center",
    paddingLeft: 50,
    paddingTop: 50,
    height: "100%"
  };
  var outer_class = "d-flex flex-column pane-holder";
  outer_class = outer_class + " light-theme";
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    selected: null,
    show_api_links: true,
    page_id: window.page_id,
    user_name: window.username
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: outer_class,
    style: outer_style
  }, /*#__PURE__*/_react["default"].createElement("form", {
    onSubmit: function onSubmit(e) {
      e.preventDefault();
      _submit_register_info();
    }
  }, field_items, /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
    icon: "log-in",
    large: true,
    text: "Submit",
    onClick: _submit_register_info
  })))));
}
RegisterApp = /*#__PURE__*/(0, _react.memo)(RegisterApp);
_register_main();
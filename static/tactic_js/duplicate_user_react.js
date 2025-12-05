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
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
window.global_id = "a" + (0, _utilities_react.guid)();
function _duplicate_main() {
  (0, _blueprint_navbar.render_navbar)("account");
  var domContainer = document.querySelector('#root');
  var root = (0, _client.createRoot)(domContainer);
  root.render(/*#__PURE__*/_react["default"].createElement(DuplicateApp, null));
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
function DuplicateApp(props) {
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
  function _submit_duplicate_info() {
    var pwd = fields_ref.current.password;
    var pwd2 = fields_ref.current.confirm_password;
    var data = {};
    if (pwd == "" || pwd2 == "") {
      var new_helper_text = _objectSpread(_objectSpread({}, helper_text_ref.current), {}, {
        confirm_password: "Passwords cannot be empty"
      });
      set_helper_text(new_helper_text);
      return;
    }
    if (pwd != pwd2) {
      var _new_helper_text = _objectSpread(_objectSpread({}, helper_text_ref.current), {}, {
        confirm_password: "Passwords don't match"
      });
      set_helper_text(_new_helper_text);
      return;
    }
    data.password = pwd;
    var fields = _objectSpread({}, fields_ref.current);
    fields.old_username = window.old_username;
    (0, _communication_react.postAjax)("attempt_duplicate", fields, function (result) {
      if (result.success) {
        (0, _toaster.doFlash)({
          "message": "Account successfully duplicated",
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
      size: "large",
      fill: false,
      placeholder: field_name,
      value: fields_ref.current[field_name]
    }));
  });
  var outer_style = {
    textAlign: "center",
    marginLeft: 50,
    marginTop: 50,
    height: "100%"
  };
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-column",
    style: outer_style
  }, /*#__PURE__*/_react["default"].createElement("form", {
    onSubmit: function onSubmit(e) {
      e.preventDefault();
      _submit_duplicate_info();
    }
  }, field_items, /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
    icon: "log-in",
    size: "large",
    text: "Submit",
    onClick: _submit_duplicate_info
  })))));
}
DuplicateApp = /*#__PURE__*/(0, _react.memo)(DuplicateApp);
_duplicate_main();
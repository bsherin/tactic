"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
require("../tactic_css/tactic.scss");
var _react = _interopRequireWildcard(require("react"));
var ReactDOM = _interopRequireWildcard(require("react-dom"));
var _core = require("@blueprintjs/core");
var _blueprint_navbar = require("./blueprint_navbar");
var _toaster = require("./toaster");
var _communication_react = require("./communication_react");
var _utilities_react = require("./utilities_react");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
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
window.page_id = (0, _utilities_react.guid)();
function _duplicate_main() {
  (0, _blueprint_navbar.render_navbar)("account");
  var domContainer = document.querySelector('#root');
  ReactDOM.render( /*#__PURE__*/_react["default"].createElement(DuplicateApp, null), domContainer);
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
      large: true,
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
    large: true,
    text: "Submit",
    onClick: _submit_duplicate_info
  })))));
}
DuplicateApp = /*#__PURE__*/(0, _react.memo)(DuplicateApp);
_duplicate_main();
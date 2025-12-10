"use strict";

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
var _modal_react = require("./modal_react");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
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
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
Promise.resolve().then(function () {
  return _interopRequireWildcard(require("../tactic_css/themeable.scss"));
});
window.global_id = "a" + (0, _utilities_react.guid)();
function _account_main() {
  if (window._show_message) (0, _toaster.doFlash)(window._message);
  var domContainer = document.querySelector('#root');
  var root = (0, _client.createRoot)(domContainer);
  var tsocket = new _tactic_socket.TacticSocket("main", 5000, "code_viewer", window.global_id, /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
    var AccountAppPlus, the_element;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          AccountAppPlus = (0, _utilities_react.withRegisterActivity)((0, _settings.withSettings)(AccountApp));
          the_element = /*#__PURE__*/_react["default"].createElement(AccountAppPlus, {
            controlled: false,
            tsocket: tsocket
          });
          root.render(/*#__PURE__*/_react["default"].createElement("div", {
            style: {
              display: "flex",
              flexDirection: "column",
              position: "relative",
              height: "100%",
              width: "100%"
            }
          }, the_element));
        case 1:
          return _context.a(2);
      }
    }, _callee);
  })));
}
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
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  (0, _react.useEffect)(function () {
    (0, _communication_react.postAjax)("get_account_info", {}, function (data) {
      set_fields(data.field_list);
    });
    return function () {
      props.tsocket.disconnect();
    };
  }, []);
  (0, _tactic_socket.useSocketListener)(props.tsocket, "endSession", function () {
    dialogFuncs.showModal("EndSessionDialog", {});
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
    (0, _communication_react.postPromise)("host", "update_account_info", data).then(function (result) {
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
    (0, _communication_react.postPromise)("host", "update_account_info", data).then(function (result) {
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
    (0, _communication_react.postPromise)("host", "update_account_info", fields_ref.current).then(function (result) {
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
    outer_class = outer_class + " bp6-dark";
  } else {
    outer_class = outer_class + " light-theme";
  }
  var self = this;
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    selected: null,
    show_api_links: false,
    global_id: window.global_id,
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
    className: "account-pane bp6-card"
  }, /*#__PURE__*/_react["default"].createElement("h6", null, "User Info"), field_items[0]), /*#__PURE__*/_react["default"].createElement("div", {
    className: "account-pane bp6-card"
  }, /*#__PURE__*/_react["default"].createElement("h6", null, "User Settings"), field_items[1])), /*#__PURE__*/_react["default"].createElement("div", {
    className: "account-pane bp6-card"
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
    size: "large",
    text: "Update Password",
    onClick: _submitPassword
  }))));
}
AccountApp = /*#__PURE__*/(0, _react.memo)(AccountApp);
_account_main();
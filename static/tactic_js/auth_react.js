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
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t2 in e) "default" !== _t2 && {}.hasOwnProperty.call(e, _t2) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t2)) && (i.get || i.set) ? o(f, _t2, i) : f[_t2] = e[_t2]); return f; })(e, t); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
window.global_id = "a" + (0, _utilities_react.guid)();
function _login_main() {
  if (window._show_message) (0, _toaster.doFlash)(window._message);
  var domContainer = document.querySelector('#root');
  var root = (0, _client.createRoot)(domContainer);
  var LoginAppPlus = (0, _toaster.withStatus)(LoginApp);
  root.render(/*#__PURE__*/_react["default"].createElement(_settings.SettingsContext.Provider, {
    value: {
      settings: null,
      setSettings: null,
      setShowSettingsDrawer: null,
      toggleSettingsDrawer: null,
      isDark: function isDark() {
        return false;
      }
    }
  }, /*#__PURE__*/_react["default"].createElement(LoginAppPlus, {
    tsocket: null,
    controlled: false
  })));
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
  var statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  var inputRef = (0, _react.useRef)(null);
  (0, _react.useEffect)(function () {
    inputRef.current.focus();
  }, []);
  function _onUsernameChange(event) {
    setUsername(event.target.value);
  }
  function _onPasswordChange(event) {
    setPassword(event.target.value);
  }
  function _submit_login_info() {
    return _submit_login_info2.apply(this, arguments);
  }
  function _submit_login_info2() {
    _submit_login_info2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
      var data, x, result, _t;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            statusFuncs.setStatus({
              show_spinner: true,
              status_message: "Attempting login ..."
            });
            data = {};
            if (!(username == "")) {
              _context2.n = 1;
              break;
            }
            set_username_warning_text("Username cannot be empty");
            return _context2.a(2);
          case 1:
            if (!(password == "")) {
              _context2.n = 2;
              break;
            }
            set_password_warning_text("Password cannot be empty");
            return _context2.a(2);
          case 2:
            data.username = username;
            data.password = password;
            data.remember_me = true;
            x = new Date();
            data.tzOffset = x.getTimezoneOffset() / 60;
            _context2.p = 3;
            _context2.n = 4;
            return (0, _communication_react.postAjaxPromise)("attempt_login", data);
          case 4:
            result = _context2.v;
            console.log("returned from attempt login with data.login " + String(result.logged_in));
            _context2.n = 6;
            break;
          case 5:
            _context2.p = 5;
            _t = _context2.v;
            console.log("Server returned success=False. That shouldn't be possible.");
          case 6:
            statusFuncs.clearStatus();
            if (result.logged_in) {
              window.open($SCRIPT_ROOT + window._next_view, "_self");
            } else {
              set_password_warning_text("Login failed");
            }
          case 7:
            return _context2.a(2);
        }
      }, _callee2, null, [[3, 5]]);
    }));
    return _submit_login_info2.apply(this, arguments);
  }
  function _refHandler(the_ref) {
    inputRef.current = the_ref;
  }
  function ffunc() {
    return false;
  }
  var outer_class = "login-body d-flex flex-column justify-content-center";
  outer_class = outer_class + " light-theme";
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    selected: null,
    show_api_links: false,
    global_id: window.global_id,
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
    onSubmit: (/*#__PURE__*/function () {
      var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(e) {
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              e.preventDefault();
              _context.n = 1;
              return _submit_login_info();
            case 1:
              return _context.a(2);
          }
        }, _callee);
      }));
      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }())
  }, /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    className: "d-flex flex-row justify-content-around",
    helperText: username_warning_text
  }, /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
    type: "text",
    onChange: _onUsernameChange,
    size: "large",
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
    size: "large",
    fill: false,
    placeholder: "Password",
    autoCapitalize: "none",
    autoCorrect: "off"
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-row justify-content-around"
  }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
    icon: "log-in",
    size: "large",
    type: "submit",
    text: "Sign in"
  })))));
}
LoginApp = /*#__PURE__*/(0, _react.memo)(LoginApp);
_login_main();
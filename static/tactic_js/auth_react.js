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
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
window.global_id = (0, _utilities_react.guid)();
var tsocket;
function _login_main() {
  if (window._show_message) (0, _toaster.doFlash)(window._message);
  const domContainer = document.querySelector('#root');
  const root = (0, _client.createRoot)(domContainer);
  let LoginAppPlus = (0, _toaster.withStatus)(LoginApp);
  //let useDark = get_theme_cookie() == "dark";
  root.render(/*#__PURE__*/_react.default.createElement(_settings.SettingsContext.Provider, {
    value: {
      settings: null,
      setSettings: null,
      setShowSettingsDrawer: null,
      toggleSettingsDrawer: null,
      isDark: () => {
        return false;
      }
    }
  }, /*#__PURE__*/_react.default.createElement(LoginAppPlus, {
    tsocket: null,
    controlled: false
  })));
}
function LoginApp(props) {
  const [username, setUsername] = (0, _react.useState)(null);
  const [password, setPassword] = (0, _react.useState)(null);
  const [username_warning_text, set_username_warning_text] = (0, _react.useState)("");
  const [password_warning_text, set_password_warning_text] = (0, _react.useState)("");
  const statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  const pushCallback = (0, _utilities_react.useCallbackStack)();
  const inputRef = (0, _react.useRef)(null);
  (0, _react.useEffect)(() => {
    inputRef.current.focus();
  }, []);
  function _onUsernameChange(event) {
    setUsername(event.target.value);
  }
  function _onPasswordChange(event) {
    setPassword(event.target.value);
  }
  async function _submit_login_info() {
    statusFuncs.setStatus({
      show_spinner: true,
      status_message: "Attempting login ..."
    });
    const data = {};
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
    let result;
    try {
      result = await (0, _communication_react.postAjaxPromise)("attempt_login", data);
      console.log("returned from attempt login with data.login " + String(result.logged_in));
    } catch (e) {
      console.log("Server returned success=False. That shouldn't be possible.");
    }
    statusFuncs.clearStatus();
    if (result.logged_in) {
      window.open($SCRIPT_ROOT + window._next_view, "_self");
    } else {
      set_password_warning_text("Login failed");
    }
  }
  function _refHandler(the_ref) {
    inputRef.current = the_ref;
  }
  function ffunc() {
    return false;
  }
  let outer_class = "login-body d-flex flex-column justify-content-center";
  outer_class = outer_class + " light-theme";
  return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    selected: null,
    show_api_links: false,
    global_id: window.global_id,
    user_name: window.username
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: outer_class,
    style: {
      textAlign: "center",
      height: "100%"
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    id: "status-area"
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: "d-flex flex-row justify-content-around"
  }, /*#__PURE__*/_react.default.createElement("img", {
    className: "mb-4",
    src: window.tactic_img_url,
    alt: "",
    width: "72",
    height: "72"
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: "d-flex flex-row justify-content-around"
  }, /*#__PURE__*/_react.default.createElement("h4", null, "Please sign in")), /*#__PURE__*/_react.default.createElement("form", {
    onSubmit: async e => {
      e.preventDefault();
      await _submit_login_info();
    }
  }, /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
    className: "d-flex flex-row justify-content-around",
    helperText: username_warning_text
  }, /*#__PURE__*/_react.default.createElement(_core.InputGroup, {
    type: "text",
    onChange: _onUsernameChange,
    size: "large",
    fill: false,
    placeholder: "Username",
    autoCapitalize: "none",
    autoCorrect: "off",
    inputRef: _refHandler
  })), /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
    className: "d-flex flex-row justify-content-around",
    helperText: password_warning_text
  }, /*#__PURE__*/_react.default.createElement(_core.InputGroup, {
    type: "password",
    onChange: _onPasswordChange,
    size: "large",
    fill: false,
    placeholder: "Password",
    autoCapitalize: "none",
    autoCorrect: "off"
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: "d-flex flex-row justify-content-around"
  }, /*#__PURE__*/_react.default.createElement(_core.Button, {
    icon: "log-in",
    size: "large",
    type: "submit",
    text: "Sign in"
  })))));
}
LoginApp = /*#__PURE__*/(0, _react.memo)(LoginApp);
_login_main();
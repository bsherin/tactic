"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

require("../tactic_css/tactic.scss");

var _react = _interopRequireDefault(require("react"));

var ReactDOM = _interopRequireWildcard(require("react-dom"));

var _core = require("@blueprintjs/core");

var _toaster = require("./toaster.js");

var _communication_react = require("./communication_react.js");

var _utilities_react = require("./utilities_react.js");

var _blueprint_navbar = require("./blueprint_navbar");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

window.page_id = (0, _utilities_react.guid)();

function _login_main() {
  if (window._show_message) (0, _toaster.doFlash)(window._message);
  var domContainer = document.querySelector('#root');
  ReactDOM.render( /*#__PURE__*/_react["default"].createElement(LoginAppWithStatus, {
    controlled: false
  }), domContainer);
}

var LoginApp = /*#__PURE__*/function (_React$Component) {
  _inherits(LoginApp, _React$Component);

  var _super = _createSuper(LoginApp);

  function LoginApp(props) {
    var _this;

    _classCallCheck(this, LoginApp);

    _this = _super.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this));
    _this.state = {
      username: null,
      password: null,
      username_warning_text: "",
      password_warning_text: "",
      dark_theme: (0, _blueprint_navbar.get_theme_cookie)() == "dark"
    };
    _this.input_ref = null;
    return _this;
  }

  _createClass(LoginApp, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      $(this.input_ref).focus();
      window.dark_theme = this.state.dark_theme;
    }
  }, {
    key: "_setTheme",
    value: function _setTheme(dark_theme) {
      var _this2 = this;

      this.setState({
        dark_theme: dark_theme
      }, function () {
        window.dark_theme = _this2.state.dark_theme;
      });
    }
  }, {
    key: "_onUsernameChange",
    value: function _onUsernameChange(event) {
      this.setState({
        username: event.target.value
      });
    }
  }, {
    key: "_onPasswordChange",
    value: function _onPasswordChange(event) {
      this.setState({
        password: event.target.value
      });
    }
  }, {
    key: "_submit_login_info",
    value: function _submit_login_info() {
      this.props.setStatus({
        show_spinner: true,
        status_message: "Attempting login ..."
      });
      var data = {};

      if (this.state.username == "") {
        this.setState({
          username_warning_text: "Username cannot be empty"
        });
        return;
      }

      if (this.state.password == "") {
        this.setState({
          password_warning_text: "Password cannot be empty"
        });
        return;
      }

      data.username = this.state.username;
      data.password = this.state.password;
      data.remember_me = true;
      var x = new Date();
      data.tzOffset = x.getTimezoneOffset() / 60;
      (0, _communication_react.postAjax)("attempt_login", data, this._return_from_submit_login);
    }
  }, {
    key: "_return_from_submit_login",
    value: function _return_from_submit_login(data) {
      this.props.clearStatus();

      if (data.logged_in) {
        window.open($SCRIPT_ROOT + window._next_view, "_self");
      } else {
        this.setState({
          password_warning_text: "Login failed"
        });
      }
    }
  }, {
    key: "_refHandler",
    value: function _refHandler(the_ref) {
      this.input_ref = the_ref;
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var outer_class = "login-body d-flex flex-column justify-content-center";

      if (this.state.dark_theme) {
        outer_class = outer_class + " bp3-dark";
      } else {
        outer_class = outer_class + " light-theme";
      }

      return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
        is_authenticated: window.is_authenticated,
        dark_theme: this.state.dark_theme,
        setTheme: this._setTheme,
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

          _this3._submit_login_info();
        }
      }, /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
        className: "d-flex flex-row justify-content-around",
        helperText: this.state.username_warning_text
      }, /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
        type: "text",
        onChange: this._onUsernameChange,
        large: true,
        fill: false,
        placeholder: "Username",
        autoCapitalize: "none",
        autoCorrect: "off",
        inputRef: this._refHandler
      })), /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
        className: "d-flex flex-row justify-content-around",
        helperText: this.state.password_warning_text
      }, /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
        type: "password",
        onChange: this._onPasswordChange,
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
  }]);

  return LoginApp;
}(_react["default"].Component);

var LoginAppWithStatus = (0, _toaster.withStatus)(LoginApp);

_login_main();
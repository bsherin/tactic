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

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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
window.main_id = window.page_id;

function _account_main() {
  if (window._show_message) (0, _toaster.doFlash)(window._message);
  var domContainer = document.querySelector('#root');
  ReactDOM.render( /*#__PURE__*/_react["default"].createElement(AccountApp, {
    initial_theme: window.theme
  }), domContainer);
}

var field_names = ["new_password", "confirm_new_password"];

var AccountTextField = /*#__PURE__*/function (_React$Component) {
  _inherits(AccountTextField, _React$Component);

  var _super = _createSuper(AccountTextField);

  function AccountTextField(props) {
    var _this;

    _classCallCheck(this, AccountTextField);

    _this = _super.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(AccountTextField, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      return /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
        key: this.props.name,
        inline: false,
        style: {
          padding: 10
        },
        label: this.props.display_text,
        helperText: this.props.helper_text
      }, /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
        type: "text",
        onChange: function onChange(event) {
          return _this2.props.onFieldChange(_this2.props.name, event.target.value, false);
        },
        onBlur: function onBlur() {
          return _this2.props.onBlur(_this2.props.name, _this2.props.value);
        },
        style: {
          width: 250
        },
        large: true,
        fill: false,
        placeholder: this.props.name,
        value: this.props.value
      }));
    }
  }]);

  return AccountTextField;
}(_react["default"].Component);

var AccountSelectField = /*#__PURE__*/function (_React$Component2) {
  _inherits(AccountSelectField, _React$Component2);

  var _super2 = _createSuper(AccountSelectField);

  function AccountSelectField(props) {
    var _this3;

    _classCallCheck(this, AccountSelectField);

    _this3 = _super2.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this3));
    return _this3;
  }

  _createClass(AccountSelectField, [{
    key: "render",
    value: function render() {
      var _this4 = this;

      return /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
        key: this.props.name,
        inline: false,
        style: {
          padding: 10
        },
        label: this.props.display_text,
        helperText: this.props.helper_text
      }, /*#__PURE__*/_react["default"].createElement(_core.HTMLSelect, {
        options: this.props.options,
        onChange: function onChange(e) {
          _this4.props.onFieldChange(_this4.props.name, e.currentTarget.value, true);
        },
        value: this.props.value
      }));
    }
  }]);

  return AccountSelectField;
}(_react["default"].Component);

var AccountApp = /*#__PURE__*/function (_React$Component3) {
  _inherits(AccountApp, _React$Component3);

  var _super3 = _createSuper(AccountApp);

  function AccountApp(props) {
    var _this5;

    _classCallCheck(this, AccountApp);

    _this5 = _super3.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this5));
    _this5.state = {
      dark_theme: _this5.props.initial_theme == "dark"
    };
    _this5.state.fields = [];
    _this5.state.password = "";
    _this5.state.confirm_password = "";
    _this5.state.password_helper = null;
    return _this5;
  }

  _createClass(AccountApp, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var self = this;
      (0, _communication_react.postAjax)("get_account_info", {}, function (data) {
        // let new_fields = [];
        // let new_helper_text = Object.assign({}, this.state.helper_text);
        // for (let fdict of data.field_list) {
        //     new_field = Object.assign({}, fdict);
        // }
        var new_state = {
          fields: data.field_list
        };
        self.setState(new_state);
        window.dark_theme = self.state.dark_theme;
      });
    }
  }, {
    key: "_setTheme",
    value: function _setTheme(dark_theme) {
      var _this6 = this;

      this.setState({
        dark_theme: dark_theme
      }, function () {
        window.dark_theme = _this6.state.dark_theme;
      });
    }
  }, {
    key: "_submitPassword",
    value: function _submitPassword() {
      var pwd = this.state.password;
      var pwd2 = this.state.confirm_password;

      if (pwd != pwd2) {
        this.setState({
          password_helper: "Passwords don't match"
        });
        return;
      }

      if (pwd == "") {
        this.setState({
          password_helper: "Passwords can't be empty"
        });
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
  }, {
    key: "_onFieldChange",
    value: function _onFieldChange(fname, value) {
      var _this7 = this;

      var submit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (fname == "password" || fname == "confirm_password") {
        var new_state = Object.assign({}, this.state);
        new_state[fname] = value;
        this.setState(new_state);
      } else {
        var new_fields = [];

        var _iterator = _createForOfIteratorHelper(this.state.fields),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var fdict = _step.value;
            var ndict = Object.assign({}, fdict);

            if (fdict.name == fname) {
              ndict.val = value;
            }

            new_fields.push(ndict);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        var self = this;
        this.setState({
          fields: new_fields
        }, function () {
          if (submit) {
            _this7._submitUpdatedField(fname, value);
          }
        });
      }
    }
  }, {
    key: "_clearHelperText",
    value: function _clearHelperText(fname) {
      this._setHelperText(fname, null);
    }
  }, {
    key: "_setHelperText",
    value: function _setHelperText(fname, helper_text) {
      var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var new_fields = [];

      var _iterator2 = _createForOfIteratorHelper(this.state.fields),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var fdict = _step2.value;
          var ndict = Object.assign({}, fdict);

          if (fdict.name == fname) {
            ndict.helper_text = helper_text;
          }

          new_fields.push(ndict);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      var self = this;
      this.setState({
        fields: new_fields
      }, function () {
        if (timeout) {
          setTimeout(function () {
            self._clearHelperText(fname);
          }, 5000);
        }
      });
    }
  }, {
    key: "_submitUpdatedField",
    value: function _submitUpdatedField(fname, fvalue) {
      var data = {};
      data[fname] = fvalue;
      var self = this;
      (0, _communication_react.postAjax)("update_account_info", data, function (result) {
        if (result.success) {
          if (fname == "password") {
            (0, _toaster.doFlash)({
              "message": "Password successfully updated",
              "alert_type": "alert-success"
            });
          } else {
            self._setHelperText(fname, "value updated", true);
          }
        } else {
          data.alert_type = "alert-warning";
          (0, _toaster.doFlash)(data);
        }
      });
    }
  }, {
    key: "_submit_account_info",
    value: function _submit_account_info() {
      (0, _communication_react.postAjax)("update_account_info", this.state.fields, function (result) {
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
  }, {
    key: "_getFieldItems",
    value: function _getFieldItems() {
      var info_items = [];
      var setting_items = [];

      var _iterator3 = _createForOfIteratorHelper(this.state.fields),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var fdict = _step3.value;
          var new_item = void 0;

          if (fdict.type == "text") {
            new_item = /*#__PURE__*/_react["default"].createElement(AccountTextField, {
              name: fdict.name,
              value: fdict.val,
              display_text: fdict.display_text,
              helper_text: fdict.helper_text,
              onBlur: this._submitUpdatedField,
              onFieldChange: this._onFieldChange
            });
          } else {
            new_item = /*#__PURE__*/_react["default"].createElement(AccountSelectField, {
              name: fdict.name,
              value: fdict.val,
              display_text: fdict.display_text,
              options: fdict.options,
              helper_text: fdict.helper_text,
              onFieldChange: this._onFieldChange
            });
          }

          if (fdict.info_type == "info") {
            info_items.push(new_item);
          } else {
            setting_items.push(new_item);
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      return [info_items, setting_items];
    }
  }, {
    key: "render",
    value: function render() {
      var field_items = this._getFieldItems();

      var outer_class = "account-settings";

      if (this.state.dark_theme) {
        outer_class = outer_class + " bp3-dark";
      } else {
        outer_class = outer_class + " light-theme";
      }

      var self = this;
      return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
        is_authenticated: window.is_authenticated,
        selected: null,
        show_api_links: false,
        dark_theme: this.state.dark_theme,
        set_parent_theme: this._setTheme,
        user_name: window.username
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: outer_class
      }, /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          display: "flex",
          "flex-direction": "column"
        }
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "account-pane bp3-card"
      }, /*#__PURE__*/_react["default"].createElement("h6", null, "User Info"), field_items[0]), /*#__PURE__*/_react["default"].createElement("div", {
        className: "account-pane bp3-card"
      }, /*#__PURE__*/_react["default"].createElement("h6", null, "User Settings"), field_items[1])), /*#__PURE__*/_react["default"].createElement("div", {
        className: "account-pane bp3-card"
      }, /*#__PURE__*/_react["default"].createElement("h6", null, "Change Password"), /*#__PURE__*/_react["default"].createElement(AccountTextField, {
        name: "password",
        value: this.state.password,
        helper_text: this.state.password_helper,
        onFieldChange: this._onFieldChange
      }), /*#__PURE__*/_react["default"].createElement(AccountTextField, {
        name: "confirm_password",
        value: this.state.confirm_password,
        helper_text: this.state.password_helper,
        onFieldChange: this._onFieldChange
      }), /*#__PURE__*/_react["default"].createElement(_core.Button, {
        icon: "log-in",
        large: true,
        text: "Update Password",
        onClick: this._submitPassword
      }))));
    }
  }]);

  return AccountApp;
}(_react["default"].Component);

_account_main();
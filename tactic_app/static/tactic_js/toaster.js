'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.doFlash = doFlash;
exports.doFlashAlways = doFlashAlways;
exports.withStatus = withStatus;
exports.Status = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _core = require("@blueprintjs/core");

var _utilities_react = require("./utilities_react.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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

var AppToaster = _core.Toaster.create({
  className: "recipe-toaster",
  position: _core.Position.TOP,
  autoFocus: false,
  timeout: 2000
});

var intent_dict = {
  "alert-success": "Success",
  "alert-warning": "Warning",
  "alert-info": null
};

function doFlash(data) {
  var intent;

  if (!data.hasOwnProperty("alert_type")) {
    intent = null;
  } else {
    intent = intent_dict[data.alert_type];
  }

  if (!data.hasOwnProperty("timeout")) {
    data.timeout = null;
  }

  AppToaster.show({
    message: data.message,
    timeout: data.timeout,
    intent: intent
  });
}

function doFlashAlways(data) {
  doFlash(data);
}

function withStatus(WrappedComponent) {
  var tsocket = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var light_dark = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  return /*#__PURE__*/function (_React$Component) {
    _inherits(_class, _React$Component);

    var _super = _createSuper(_class);

    function _class(props) {
      var _this;

      _classCallCheck(this, _class);

      _this = _super.call(this, props);
      (0, _utilities_react.doBinding)(_assertThisInitialized(_this));
      _this.tsocket = tsocket;
      _this.state = {
        show_spinner: false,
        status_message: null,
        dark_theme: false,
        light_dark: light_dark,
        spinner_size: _this.props.spinner_size ? _this.props.spinner_size : 25
      };
      _this.socket_counter = null;
      return _this;
    }

    _createClass(_class, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        if (this.tsocket) {
          this.initSocket();
        }
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate() {
        if (this.tsocket && this.tsocket.counter != this.socket_counter) {
          this.initSocket();
        }
      }
    }, {
      key: "initSocket",
      value: function initSocket() {
        this.tsocket.socket.off('stop-spinner');
        this.tsocket.socket.off('start-spinner');
        this.tsocket.socket.off('show-status-msg');
        this.tsocket.socket.off("clear-status-msg");
        this.tsocket.socket.on('stop-spinner', this._stopSpinner);
        this.tsocket.socket.on('start-spinner', this._startSpinner);
        this.tsocket.socket.on('show-status-msg', this._statusMessageFromData);
        this.tsocket.socket.on("clear-status-msg", this._clearStatusMessage);
        this.socket_counter = this.tsocket.counter;
      }
    }, {
      key: "_stopSpinner",
      value: function _stopSpinner() {
        this.setState({
          show_spinner: false
        });
      }
    }, {
      key: "_startSpinner",
      value: function _startSpinner() {
        var dark_spinner = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        this.setState({
          show_spinner: true,
          dark_spinner: dark_spinner
        });
      }
    }, {
      key: "_clearStatusMessage",
      value: function _clearStatusMessage() {
        this.setState({
          status_message: null
        });
      }
    }, {
      key: "_clearStatus",
      value: function _clearStatus() {
        this.setState({
          show_spinner: false,
          status_message: null
        });
      }
    }, {
      key: "_statusMessage",
      value: function _statusMessage(message) {
        var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        this.setState({
          status_message: message
        }, function () {
          if (timeout) {
            setTimeout(self._clearStatusMessage, data.timeout * 1000);
          }
        });
      }
    }, {
      key: "_statusMessageFromData",
      value: function _statusMessageFromData(data) {
        var self = this;
        this.setState({
          status_message: data.message
        }, function () {
          if (data.hasOwnProperty("timeout") && data.timeout != null) {
            setTimeout(self._clearStatusMessage, data.timeout * 1000);
          }
        });
      }
    }, {
      key: "_setStatus",
      value: function _setStatus(sstate) {
        this.setState(sstate);
      }
    }, {
      key: "_setStatusTheme",
      value: function _setStatusTheme(dark_theme) {
        this.setState({
          dark_theme: dark_theme
        });
      }
    }, {
      key: "_statusFuncs",
      value: function _statusFuncs() {
        return {
          startSpinner: this._startSpinner,
          stopSpinner: this._stopSpinner,
          clearStatus: this._clearStatus,
          clearStatusMessage: this._clearStatusMessage,
          statusMessage: this._statusMessage,
          setStatus: this._setStatus,
          setStatusTheme: this._setStatusTheme
        };
      }
    }, {
      key: "render",
      value: function render() {
        return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(WrappedComponent, _extends({}, this.props, {
          ref: ref,
          statusFuncs: this._statusFuncs(),
          startSpinner: this._startSpinner,
          stopSpinner: this._stopSpinner,
          clearStatus: this._clearStatus,
          clearStatusMessage: this._clearStatus,
          statusMessage: this._statusMessage,
          setStatus: this._setStatus,
          setStatusTheme: this._setStatusTheme
        })), /*#__PURE__*/_react["default"].createElement(Status, this.state));
      }
    }]);

    return _class;
  }(_react["default"].Component);
}

var Status = /*#__PURE__*/function (_React$Component2) {
  _inherits(Status, _React$Component2);

  var _super2 = _createSuper(Status);

  function Status() {
    _classCallCheck(this, Status);

    return _super2.apply(this, arguments);
  }

  _createClass(Status, [{
    key: "render",
    value: function render() {
      var cname = "d-flex flex-row";
      var outer_cname;

      if (this.props.dark_theme) {
        outer_cname = "status-holder bp3-dark";

        if (this.props.light_dark) {
          outer_cname += " light-dark";
        }
      } else {
        outer_cname = "status-holder light-theme";
      }

      return /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          height: "100%",
          width: "100%",
          position: "absolute",
          "left": 0
        },
        className: outer_cname
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: cname,
        style: {
          position: "absolute",
          bottom: 10,
          marginLeft: 15
        }
      }, this.props.show_spinner && /*#__PURE__*/_react["default"].createElement(_core.Spinner, {
        size: 20
      }), this.props.status_message && /*#__PURE__*/_react["default"].createElement("div", {
        className: "d-flex flex-column justify-content-around",
        style: {
          positoin: "absolute",
          marginLeft: 50
        }
      }, /*#__PURE__*/_react["default"].createElement("div", {
        id: "status-msg-area",
        className: "bp3-ui-text"
      }, this.props.status_message))));
    }
  }]);

  return Status;
}(_react["default"].Component);

exports.Status = Status;
Status.propTypes = {
  show_spinner: _propTypes["default"].bool,
  status_message: _propTypes["default"].string,
  spinner_size: _propTypes["default"].number,
  dark_theme: _propTypes["default"].bool
};
Status.defaultProps = {
  show_spinner: false,
  status_message: null,
  spinner_size: 25,
  dark_theme: false
};
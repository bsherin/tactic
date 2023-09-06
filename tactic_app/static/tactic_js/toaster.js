'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StatusContext = void 0;
exports.doFlash = doFlash;
exports.doFlashAlways = doFlashAlways;
exports.withStatus = withStatus;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
var _blueprint_react_widgets = require("./blueprint_react_widgets");
var _utilities_react = require("./utilities_react");
var _theme = require("./theme");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var StatusContext = /*#__PURE__*/(0, _react.createContext)(null);
exports.StatusContext = StatusContext;
var DEFAULT_TIMEOUT = 20000;
var disconnect_toast_id = null;
var reconnect_toast_id = null;
var AppToaster = _core.OverlayToaster.create({
  className: "recipe-toaster",
  position: _core.Position.TOP,
  autoFocus: false
});
var intent_dict = {
  "alert-success": "Success",
  "alert-warning": "Warning",
  "alert-info": null
};
function doFlash(data) {
  var intent;
  if (typeof data == "string") {
    AppToaster.show({
      message: data,
      timeout: DEFAULT_TIMEOUT,
      intent: null
    });
    return;
  }
  if (!("alert_type" in data)) {
    intent = null;
  } else {
    intent = intent_dict[data.alert_type];
  }
  if (!("timeout" in data)) {
    data.timeout = DEFAULT_TIMEOUT;
  }
  if ("is_disconnect_message" in data) {
    if (disconnect_toast_id) {
      AppToaster.dismiss(disconnect_toast_id);
    }
    if (reconnect_toast_id) {
      AppToaster.dismiss(reconnect_toast_id);
    }
    disconnect_toast_id = AppToaster.show({
      message: data.message,
      timeout: data.timeout,
      intent: intent
    });
  } else if ("is_reconnect_message" in data) {
    if (reconnect_toast_id) {
      AppToaster.dismiss(reconnect_toast_id);
    }
    if (disconnect_toast_id) {
      AppToaster.dismiss(disconnect_toast_id);
      disconnect_toast_id = null;
    }
    reconnect_toast_id = AppToaster.show({
      message: data.message,
      timeout: data.timeout,
      intent: intent
    });
  } else {
    AppToaster.show({
      message: data.message,
      timeout: data.timeout,
      intent: intent
    });
  }
}
function doFlashAlways(data) {
  doFlash(data);
}
function withStatus(WrappedComponent) {
  function newFunc(props) {
    var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      show_spinner = _useState2[0],
      set_show_spinner = _useState2[1];
    var _useState3 = (0, _react.useState)(null),
      _useState4 = _slicedToArray(_useState3, 2),
      status_message = _useState4[0],
      set_status_message = _useState4[1];
    var _useState5 = (0, _react.useState)(props.spinner_size ? props.spinner_size : 25),
      _useState6 = _slicedToArray(_useState5, 2),
      spinner_size = _useState6[0],
      set_spinner_size = _useState6[1];
    var pushCallback = (0, _utilities_react.useCallbackStack)();
    (0, _react.useEffect)(function () {
      if (props.tsocket) {
        initSocket();
      }
    }, []);
    function initSocket() {
      props.tsocket.attachListener('stop-spinner', _stopSpinner);
      props.tsocket.attachListener('start-spinner', _startSpinner);
      props.tsocket.attachListener('show-status-msg', _statusMessageFromData);
      props.tsocket.attachListener("clear-status-msg", _clearStatusMessage);
    }
    function getId() {
      if ("main_id" in props) {
        return props.main_id;
      } else {
        return props.library_id;
      }
    }
    function _stopSpinner(data) {
      if (data == null || data.main_id == getId()) {
        set_show_spinner(false);
      }
    }
    function _startSpinner(data) {
      if (data == null || data.main_id == getId()) {
        set_show_spinner(true);
      }
    }
    function _clearStatusMessage(data) {
      if (data == null || data.main_id == getId()) {
        set_status_message(null);
      }
    }
    function _clearStatus(data) {
      if (data == null || data.main_id == getId()) {
        set_show_spinner(false);
        set_status_message(null);
      }
    }
    function _statusMessage(message) {
      var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var self = this;
      set_status_message(message);
      pushCallback(function () {
        if (timeout) {
          setTimeout(_clearStatusMessage, timeout * 1000);
        }
      });
    }
    function _statusMessageFromData(data) {
      if (data.main_id == props.main_id) {
        set_status_message(data.message);
        pushCallback(function () {
          if (data.hasOwnProperty("timeout") && data.timeout != null) {
            setTimeout(_clearStatusMessage, data.timeout * 1000);
          }
        });
      }
    }
    function _setStatus(sstate) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      if ("show_spinner" in sstate) {
        set_show_spinner(sstate["show_spinner"]);
      }
      if ("status_message" in sstate) {
        set_status_message(sstate["status_message"]);
      }
      if (callback) {
        pushCallback(callback);
      }
    }
    var _statusFuncs = {
      startSpinner: _startSpinner,
      stopSpinner: _stopSpinner,
      clearStatus: _clearStatus,
      clearStatusMessage: _clearStatusMessage,
      statusMessage: _statusMessage,
      setStatus: _setStatus
    };
    return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(StatusContext.Provider, {
      value: _statusFuncs
    }, /*#__PURE__*/_react["default"].createElement(WrappedComponent, props)), /*#__PURE__*/_react["default"].createElement(Status, {
      show_spinner: show_spinner,
      status_message: status_message,
      spinner_size: spinner_size,
      show_close: true,
      handleClose: function handleClose() {
        _clearStatus(null);
      }
    }));
  }
  return /*#__PURE__*/(0, _react.memo)(newFunc);
}
function Status(props) {
  var elRef = (0, _react.useRef)(null);
  var theme = (0, _react.useContext)(_theme.ThemeContext);
  var cname = "d-flex flex-row";
  var outer_cname = theme.dark_theme ? "status-holder bp5-dark" : "status-holder light-theme";
  var left = elRef && elRef.current ? elRef.current.parentNode.offsetLeft : 25;
  return /*#__PURE__*/_react["default"].createElement("div", {
    ref: elRef,
    style: {
      height: 35,
      width: "100%",
      position: "absolute",
      "left": left,
      "bottom": 0
    },
    className: outer_cname
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: cname,
    style: {
      position: "absolute",
      bottom: 7,
      marginLeft: 15
    }
  }, props.show_spinner && /*#__PURE__*/_react["default"].createElement(_core.Spinner, {
    size: 20
  }), props.show_close && (props.show_spiner || props.status_message) && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: props.handleClose,
    icon: "cross"
  }), props.status_message && /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-column justify-content-around",
    style: {
      marginLeft: 8
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    id: "status-msg-area",
    className: "bp5-ui-text"
  }, props.status_message))));
}
Status = /*#__PURE__*/(0, _react.memo)(Status);
Status.propTypes = {
  show_spinner: _propTypes["default"].bool,
  show_close: _propTypes["default"].bool,
  handleClose: _propTypes["default"].func,
  status_message: _propTypes["default"].string,
  spinner_size: _propTypes["default"].number
};
Status.defaultProps = {
  show_spinner: false,
  show_close: true,
  handleClose: null,
  status_message: null,
  spinner_size: 25
};
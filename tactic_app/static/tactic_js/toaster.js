'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StatusContext = void 0;
exports.doFlash = doFlash;
exports.messageOrError = messageOrError;
exports.withStatus = withStatus;
var _react = _interopRequireWildcard(require("react"));
var _client = require("react-dom/client");
var _core = require("@blueprintjs/core");
var _blueprint_react_widgets = require("./blueprint_react_widgets");
var _utilities_react = require("./utilities_react");
var _settings = require("./settings");
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
var StatusContext = exports.StatusContext = /*#__PURE__*/(0, _react.createContext)(null);
var DEFAULT_TIMEOUT = 20000;
var disconnect_toast_id = null;
var reconnect_toast_id = null;
var intent_dict = {
  "alert-success": "Success",
  "alert-warning": "Warning",
  "alert-info": null
};
function doFlash(data) {
  var AppToasterPromise = _core.OverlayToaster.createAsync({
    className: "recipe-toaster",
    position: _core.Position.TOP,
    autoFocus: false
  }, {
    domRenderer: function domRenderer(toaster, containerElement) {
      return (0, _client.createRoot)(containerElement).render(toaster);
    }
  });
  AppToasterPromise.then(function (AppToaster) {
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
  });
}
function messageOrError(data, success_message, failure_tiltle, statusFuncs, errorDrawerFuncs) {
  if (!data.success) {
    errorDrawerFuncs.addErrorDrawerEntry({
      title: failur_title,
      content: "message" in data ? data.message : ""
    });
  } else {
    statusFuncs.statusMessage(success_message);
  }
  statusFuncs.stopSpinner();
  statusFuncs.clearStatusMessage();
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
    var _useState7 = (0, _react.useState)(0),
      _useState8 = _slicedToArray(_useState7, 2),
      leftEdge = _useState8[0],
      setLeftEdge = _useState8[1];
    var pushCallback = (0, _utilities_react.useCallbackStack)();
    (0, _react.useEffect)(function () {
      if (props.tsocket) {
        initSocket();
      }
    }, []);
    function initSocket() {
      props.tsocket.attachListener('stop-spinner', _stopSpinner);
      props.tsocket.attachListener('show-status-msg', _statusMessageFromData);
      props.tsocket.attachListener("clear-status-msg", _clearStatusMessage);
    }
    var getId = (0, _react.useCallback)(function () {
      if ("main_id" in props) {
        return props.main_id;
      } else {
        return props.library_id;
      }
    }, [props.main_id, props.library_id]);
    var _stopSpinner = (0, _react.useCallback)(function (data) {
      if (data == null || data.main_id == getId()) {
        set_show_spinner(false);
      }
    }, []);
    var _startSpinner = (0, _react.useCallback)(function (data) {
      if (data == null || data.main_id == getId()) {
        set_show_spinner(true);
      }
    }, []);
    var _clearStatusMessage = (0, _react.useCallback)(function (data) {
      if (data == null || data.main_id == getId()) {
        set_status_message(null);
      }
    }, []);
    var _clearStatus = (0, _react.useCallback)(function (data) {
      if (data == null || data.main_id == getId()) {
        set_show_spinner(false);
        set_status_message(null);
      }
    }, []);
    var _statusMessage = (0, _react.useCallback)(function (message) {
      var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      set_status_message(message);
      if (!timeout) {
        timeout = 7;
      }
      pushCallback(function () {
        if (timeout) {
          setTimeout(_clearStatusMessage, timeout * 1000);
        }
      });
    }, []);
    var _statusMessageFromData = (0, _react.useCallback)(function (data) {
      set_status_message(data.message);
      pushCallback(function () {
        if (data.hasOwnProperty("timeout") && data.timeout != null) {
          setTimeout(_clearStatusMessage, data.timeout * 1000);
        }
      });
    }, []);
    var _setStatus = (0, _react.useCallback)(function (sstate) {
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
    }, []);
    var statusFuncsRef = (0, _react.useRef)({
      startSpinner: _startSpinner,
      stopSpinner: _stopSpinner,
      clearStatus: _clearStatus,
      clearStatusMessage: _clearStatusMessage,
      statusMessage: _statusMessage,
      setStatus: _setStatus,
      setLeftEdge: setLeftEdge
    }, []);
    return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(StatusContext.Provider, {
      value: statusFuncsRef.current
    }, /*#__PURE__*/_react["default"].createElement(WrappedComponent, props)), /*#__PURE__*/_react["default"].createElement(Status, {
      show_spinner: show_spinner,
      status_message: status_message,
      spinner_size: spinner_size,
      leftEdge: leftEdge,
      show_close: true,
      handleClose: function handleClose() {
        _clearStatus(null);
      }
    }));
  }
  return /*#__PURE__*/(0, _react.memo)(newFunc);
}
function Status(props) {
  props = _objectSpread({
    show_spinner: false,
    show_close: true,
    handleClose: null,
    status_message: null,
    spinner_size: 25
  }, props);
  var elRef = (0, _react.useRef)(null);
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  var cname = "d-flex flex-row";
  var outer_cname = settingsContext.isDark() ? "status-holder bp5-dark" : "status-holder light-theme";
  var left = elRef && elRef.current && elRef.current.parentNode ? elRef.current.parentNode.offsetLeft : 25;
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
      bottom: 5,
      left: props.leftEdge,
      marginLeft: 15
    }
  }, props.show_spinner && /*#__PURE__*/_react["default"].createElement(_core.Spinner, {
    size: 20
  }), props.show_close && (props.show_spiner || props.status_message) && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: props.handleClose,
    small: true,
    icon: "cross"
  }), props.status_message && /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-column justify-content-around",
    style: {
      marginLeft: 8
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    id: "status-msg-area",
    className: "bp5-ui-text",
    style: {
      fontSize: 12
    }
  }, props.status_message))));
}
Status = /*#__PURE__*/(0, _react.memo)(Status);
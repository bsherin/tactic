'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StatusContext = exports.STATUS_BAR_HEIGHT = void 0;
exports.doFlash = doFlash;
exports.messageOrError = messageOrError;
exports.withStatus = withStatus;
var _react = _interopRequireWildcard(require("react"));
var _client = require("react-dom/client");
var _core = require("@blueprintjs/core");
var _blueprint_react_widgets = require("./blueprint_react_widgets");
var _utilities_react = require("./utilities_react");
var _settings = require("./settings");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const StatusContext = exports.StatusContext = /*#__PURE__*/(0, _react.createContext)(null);
const STATUS_BAR_HEIGHT = exports.STATUS_BAR_HEIGHT = 25;
const DEFAULT_TIMEOUT = 20000;
let disconnect_toast_id = null;
let reconnect_toast_id = null;
const intent_dict = {
  "alert-success": "Success",
  "alert-warning": "Warning",
  "alert-info": null
};
function doFlash(data) {
  const AppToasterPromise = _core.OverlayToaster.createAsync({
    className: "recipe-toaster",
    position: _core.Position.TOP,
    autoFocus: false
  }, {
    domRenderer: (toaster, containerElement) => (0, _client.createRoot)(containerElement).render(toaster)
  });
  AppToasterPromise.then(AppToaster => {
    let intent;
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
    const [show_spinner, set_show_spinner] = (0, _react.useState)(false);
    const [status_message, set_status_message] = (0, _react.useState)(null);
    const [spinner_size] = (0, _react.useState)(props.spinner_size ? props.spinner_size : 25);
    const [leftEdge, setLeftEdge] = (0, _react.useState)(0);
    const pushCallback = (0, _utilities_react.useCallbackStack)();
    (0, _react.useEffect)(() => {
      if (props.tsocket) {
        initSocket();
      }
    }, []);
    function initSocket() {
      props.tsocket.attachListener('stop-spinner', _stopSpinner);
      props.tsocket.attachListener('show-status-msg', _statusMessageFromData);
      props.tsocket.attachListener("clear-status-msg", _clearStatusMessage);
    }
    const _stopSpinner = (0, _react.useCallback)(data => {
      set_show_spinner(false);
    }, []);
    const _startSpinner = (0, _react.useCallback)(data => {
      set_show_spinner(true);
    }, []);
    const _clearStatusMessage = (0, _react.useCallback)(data => {
      set_status_message(null);
    }, []);
    const _clearStatus = (0, _react.useCallback)(data => {
      set_show_spinner(false);
      set_status_message(null);
    }, []);
    const _statusMessage = (0, _react.useCallback)((message, timeout = null) => {
      set_status_message(message);
      if (!timeout) {
        timeout = 7;
      }
      pushCallback(() => {
        if (timeout) {
          setTimeout(_clearStatusMessage, timeout * 1000);
        }
      });
    }, []);
    const _statusMessageFromData = (0, _react.useCallback)(data => {
      set_status_message(data.message);
      pushCallback(() => {
        if (data.hasOwnProperty("timeout") && data.timeout != null) {
          setTimeout(_clearStatusMessage, data.timeout * 1000);
        }
      });
    }, []);
    const _setStatus = (0, _react.useCallback)((sstate, callback = null) => {
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
    const statusFuncsRef = (0, _react.useRef)({
      startSpinner: _startSpinner,
      stopSpinner: _stopSpinner,
      clearStatus: _clearStatus,
      clearStatusMessage: _clearStatusMessage,
      statusMessage: _statusMessage,
      setStatus: _setStatus,
      setLeftEdge: setLeftEdge
    }, []);
    return /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        position: "relative",
        width: "100%",
        height: "100%"
      }
    }, /*#__PURE__*/_react.default.createElement(StatusContext.Provider, {
      value: statusFuncsRef.current
    }, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        position: "relative",
        flex: "1 1 0",
        minHeight: 0
      }
    }, /*#__PURE__*/_react.default.createElement(WrappedComponent, props))), /*#__PURE__*/_react.default.createElement(Status, {
      show_spinner: show_spinner,
      status_message: status_message,
      spinner_size: spinner_size,
      leftEdge: leftEdge,
      show_close: true,
      handleClose: () => {
        _clearStatus(null);
      }
    }));
  }
  return /*#__PURE__*/(0, _react.memo)(newFunc);
}
function Status(props) {
  props = {
    show_spinner: false,
    show_close: true,
    handleClose: null,
    status_message: null,
    spinner_size: 25,
    ...props
  };
  const elRef = (0, _react.useRef)(null);
  const settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  let cname = "d-flex flex-row";
  let outer_cname = settingsContext.isDark() ? "status-holder bp6-dark" : "status-holder light-theme";
  let left = elRef && elRef.current && elRef.current.parentNode ? elRef.current.parentNode.offsetLeft : 25;
  return /*#__PURE__*/_react.default.createElement("div", {
    ref: elRef,
    style: {
      height: STATUS_BAR_HEIGHT,
      width: "100%",
      "left": left,
      position: "relative"
    },
    className: outer_cname
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: cname,
    style: {
      marginLeft: 15,
      marginBottom: 2
    }
  }, props.show_spinner && /*#__PURE__*/_react.default.createElement(_core.Spinner, {
    size: 20
  }), props.show_close && (props.show_spinner || props.status_message) && /*#__PURE__*/_react.default.createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: props.handleClose,
    size: "small",
    style: {
      paddingTop: 5
    },
    icon: "cross"
  }), props.status_message && /*#__PURE__*/_react.default.createElement("div", {
    className: "d-flex flex-column justify-content-around",
    style: {
      marginLeft: 8
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    id: "status-msg-area",
    className: "bp6-ui-text",
    style: {
      fontSize: 10,
      paddingTop: 5
    }
  }, props.status_message))));
}
Status = /*#__PURE__*/(0, _react.memo)(Status);
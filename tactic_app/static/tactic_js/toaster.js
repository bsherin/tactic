'use strict';

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
var _theme = require("./theme");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const StatusContext = exports.StatusContext = /*#__PURE__*/(0, _react.createContext)(null);
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
    const [spinner_size, set_spinner_size] = (0, _react.useState)(props.spinner_size ? props.spinner_size : 25);
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
    const getId = (0, _react.useCallback)(() => {
      if ("main_id" in props) {
        return props.main_id;
      } else {
        return props.library_id;
      }
    }, [props.main_id, props.library_id]);
    const _stopSpinner = (0, _react.useCallback)(data => {
      if (data == null || data.main_id == getId()) {
        set_show_spinner(false);
      }
    }, []);
    const _startSpinner = (0, _react.useCallback)(data => {
      if (data == null || data.main_id == getId()) {
        set_show_spinner(true);
      }
    }, []);
    const _clearStatusMessage = (0, _react.useCallback)(data => {
      if (data == null || data.main_id == getId()) {
        set_status_message(null);
      }
    }, []);
    const _clearStatus = (0, _react.useCallback)(data => {
      if (data == null || data.main_id == getId()) {
        set_show_spinner(false);
        set_status_message(null);
      }
    }, []);
    const _statusMessage = (0, _react.useCallback)(function (message) {
      let timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
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
    const _setStatus = (0, _react.useCallback)(function (sstate) {
      let callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
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
    return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(StatusContext.Provider, {
      value: statusFuncsRef.current
    }, /*#__PURE__*/_react.default.createElement(WrappedComponent, props)), /*#__PURE__*/_react.default.createElement(Status, {
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
  const theme = (0, _react.useContext)(_theme.ThemeContext);
  let cname = "d-flex flex-row";
  let outer_cname = theme.dark_theme ? "status-holder bp5-dark" : "status-holder light-theme";
  let left = elRef && elRef.current ? elRef.current.parentNode.offsetLeft : 25;
  return /*#__PURE__*/_react.default.createElement("div", {
    ref: elRef,
    style: {
      height: 35,
      width: "100%",
      position: "absolute",
      "left": left,
      "bottom": 0
    },
    className: outer_cname
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: cname,
    style: {
      position: "absolute",
      bottom: 5,
      left: props.leftEdge,
      marginLeft: 15
    }
  }, props.show_spinner && /*#__PURE__*/_react.default.createElement(_core.Spinner, {
    size: 20
  }), props.show_close && (props.show_spiner || props.status_message) && /*#__PURE__*/_react.default.createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: props.handleClose,
    small: true,
    icon: "cross"
  }), props.status_message && /*#__PURE__*/_react.default.createElement("div", {
    className: "d-flex flex-column justify-content-around",
    style: {
      marginLeft: 8
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    id: "status-msg-area",
    className: "bp5-ui-text",
    style: {
      fontSize: 12
    }
  }, props.status_message))));
}
Status = /*#__PURE__*/(0, _react.memo)(Status);
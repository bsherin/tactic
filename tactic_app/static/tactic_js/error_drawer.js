"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ErrorDrawerContext = void 0;
exports.ErrorItem = ErrorItem;
exports.withErrorDrawer = withErrorDrawer;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _react = _interopRequireWildcard(require("react"));
var _core = require("@blueprintjs/core");
var _communication_react = require("./communication_react");
var _blueprint_react_widgets = require("./blueprint_react_widgets");
var _utilities_react = require("./utilities_react");
var _settings = require("./settings");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const ErrorDrawerContext = exports.ErrorDrawerContext = /*#__PURE__*/(0, _react.createContext)(null);
function withErrorDrawer(WrappedComponent) {
  let lposition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "right";
  let error_drawer_size = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "30%";
  function WithErrorComponent(props) {
    const [show_drawer, set_show_drawer] = (0, _react.useState)(false);
    const [contents, set_contents, contents_ref] = (0, _utilities_react.useStateAndRef)({}); // the ref is necessary.

    const goToLineNumber = (0, _react.useRef)(null);
    const ucounter = (0, _react.useRef)(0);
    const local_id = (0, _react.useRef)(props.main_id ? props.main_id : props.library_id);
    const goToModule = (0, _react.useRef)(null);
    (0, _react.useEffect)(() => {
      initSocket();
      return () => {
        goToLineNumber.current = null;
        ucounter.current = null;
        local_id.current = null;
      };
    }, []);
    function initSocket() {
      props.tsocket.attachListener('add-error-drawer-entry', _addEntry);
    }
    const _registerGoToModule = (0, _react.useCallback)(the_func => {
      goToModule.current = the_func;
    }, []);
    const _close = (0, _react.useCallback)(data => {
      if (data == null || !("main_id" in data) || data.main_id == local_id.current) {
        set_show_drawer(false);
      }
    }, [local_id.current]);
    const _open = (0, _react.useCallback)(data => {
      if (data == null || !("main_id" in data) || data.main_id == local_id.current) {
        set_show_drawer(true);
      }
    }, [local_id.current]);
    const _toggle = (0, _react.useCallback)(data => {
      if (data == null || !("main_id" in data) || data.main_id == local_id.current) {
        set_show_drawer(prev_show_drawer => !prev_show_drawer);
      }
    }, [local_id.current]);
    const _addEntry = (0, _react.useCallback)(function (data) {
      let open = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      ucounter.current = ucounter.current + 1;
      const newcontents = {
        ...contents_ref.current
      };
      newcontents[String(ucounter.current)] = data;
      set_contents(newcontents);
      set_show_drawer(open);
    }, [contents_ref.current, ucounter.current]);
    const _addFromError = (0, _react.useCallback)(function (title, data) {
      let open = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      let content = "";
      if ("message" in data) {
        content = data.message;
      } else if (typeof data == "string") {
        content = data;
      }
      _addEntry({
        title: title,
        content: content
      }, open);
    }, []);
    const _closeEntry = (0, _react.useCallback)(ukey => {
      const newcontents = {
        ...contents_ref.current
      };
      delete newcontents[ukey];
      set_contents(newcontents);
      set_show_drawer(false);
    }, [contents_ref.current]);
    const _postAjaxFailure = (0, _react.useCallback)((qXHR, textStatus, errorThrown) => {
      _addEntry({
        title: "Post Ajax Failure: {}".format(textStatus),
        content: errorThrown
      });
    }, []);
    const _clearAll = (0, _react.useCallback)(data => {
      if (data == null || !("main_id" in data) || data.main_id == props.main_id) {
        set_contents([]);
        set_show_drawer(false);
      }
    }, [props.main_id]);
    const _onClose = (0, _react.useCallback)(() => {
      set_show_drawer(false);
    }, []);
    const _setGoToLineNumber = (0, _react.useCallback)(gtfunc => {
      goToLineNumber.current = gtfunc;
    }, []);
    const [errorDrawerFuncs, setErrorDrawerFuncs, errorDrawerFuncsRef] = (0, _utilities_react.useStateAndRef)({
      openErrorDrawer: _open,
      closeErrorDrawer: _close,
      clearErrorDrawer: _clearAll,
      addErrorDrawerEntry: _addEntry,
      addFromError: _addFromError,
      postAjaxFailure: _postAjaxFailure,
      toggleErrorDrawer: _toggle,
      setGoToLineNumber: _setGoToLineNumber,
      registerGoToModule: _registerGoToModule
    });
    (0, _react.useEffect)(() => {
      setErrorDrawerFuncs({
        openErrorDrawer: _open,
        closeErrorDrawer: _close,
        clearErrorDrawer: _clearAll,
        addErrorDrawerEntry: _addEntry,
        addFromError: _addFromError,
        postAjaxFailure: _postAjaxFailure,
        toggleErrorDrawer: _toggle,
        setGoToLineNumber: _setGoToLineNumber,
        registerGoToModule: _registerGoToModule
      });
    }, [local_id.current, contents_ref.current, ucounter.current]);
    return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(ErrorDrawerContext.Provider, {
      value: errorDrawerFuncs
    }, /*#__PURE__*/_react.default.createElement(WrappedComponent, (0, _extends2.default)({}, props, {
      errorDrawerFuncs: errorDrawerFuncsRef.current
    }))), /*#__PURE__*/_react.default.createElement(ErrorDrawer, {
      show_drawer: show_drawer,
      contents: contents_ref,
      position: lposition,
      local_id: local_id.current,
      handleCloseItem: _closeEntry,
      goToLineNumberFunc: goToLineNumber.current,
      goToModule: goToModule,
      closeErrorDrawer: _close,
      title: "Errors",
      size: error_drawer_size,
      onClose: _onClose,
      clearAll: _clearAll
    }));
  }
  return /*#__PURE__*/(0, _react.memo)(WithErrorComponent);
}
function ErrorItem(props) {
  props = {
    title: null,
    has_link: false,
    line_number: null,
    goToLineNumberfunc: null,
    tile_type: null,
    ...props
  };
  function _openError() {
    if (!window.in_context) {
      window.blur();
      (0, _communication_react.postWithCallback)("host", "go_to_module_viewer_if_exists", {
        user_id: window.user_id,
        tile_type: props.tile_type,
        line_number: props.line_number
      }, data => {
        if (!data.success) {
          window.open($SCRIPT_ROOT + "/view_location_in_creator/" + props.tile_type + "/" + props.line_number);
        } else {
          window.open("", data.window_name);
        }
      }, null, props.local_id);
    } else {
      props.closeErrorDrawer();
      props.goToModule.current(props.tile_type, props.line_number);
    }
  }
  let content_dict = {
    __html: props.content
  };
  return /*#__PURE__*/_react.default.createElement(_core.Card, {
    interactive: true,
    elevation: _core.Elevation.TWO,
    style: {
      marginBottom: 5,
      position: "relative"
    }
  }, props.title && /*#__PURE__*/_react.default.createElement("h6", {
    style: {
      overflow: "auto"
    }
  }, /*#__PURE__*/_react.default.createElement("span", null, /*#__PURE__*/_react.default.createElement(_core.Icon, {
    icon: "issue",
    size: 16
  }), /*#__PURE__*/_react.default.createElement("a", {
    href: "#",
    style: {
      marginLeft: 10
    }
  }, props.title))), /*#__PURE__*/_react.default.createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: () => {
      props.handleCloseItem(props.ukey);
    },
    style: {
      position: "absolute",
      right: 5,
      top: 5
    },
    icon: "cross"
  }), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      fontSize: 13,
      overflow: "auto"
    },
    dangerouslySetInnerHTML: content_dict
  }), props.has_link && /*#__PURE__*/_react.default.createElement(_core.Button, {
    text: "show",
    icon: "eye-open",
    small: true,
    onClick: _openError
  }));
}
exports.ErrorItem = ErrorItem = /*#__PURE__*/(0, _react.memo)(ErrorItem);
function ErrorDrawer(props) {
  props = {
    show_drawer: false,
    contents: [],
    position: "right",
    title: null,
    size: "30%",
    goToLineNumberfunc: null,
    ...props
  };
  const settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  let sorted_keys = [...Object.keys(props.contents.current)];
  sorted_keys.sort(function (a, b) {
    return parseInt(b) - parseInt(a);
  });
  let items = sorted_keys.map((ukey, index) => {
    let entry = props.contents.current[ukey];
    let content_dict = {
      __html: entry.content
    };
    let has_link = false;
    if (entry.hasOwnProperty("line_number")) {
      has_link = true;
    }
    return /*#__PURE__*/_react.default.createElement(ErrorItem, {
      ukey: ukey,
      title: entry.title,
      content: entry.content,
      has_link: has_link,
      key: ukey,
      local_id: props.local_id,
      handleCloseItem: props.handleCloseItem,
      openErrorDrawer: props.openErrorDrawer,
      closeErrorDrawer: props.closeErrorDrawer,
      goToLineNumberFunc: props.goToLineNumberFunc,
      goToModule: props.goToModule,
      line_number: entry.line_number,
      tile_type: entry.tile_type
    });
  });
  return /*#__PURE__*/_react.default.createElement(_core.Drawer, {
    icon: "console",
    className: settingsContext.isDark() ? "bp5-dark" : "light-theme",
    title: props.title,
    isOpen: props.show_drawer,
    position: props.position,
    canOutsideClickClose: false,
    onClose: props.onClose,
    hasBackdrop: false,
    size: props.size
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: _core.Classes.DRAWER_BODY
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "d-flex flex-row justify-content-around mt-2"
  }, /*#__PURE__*/_react.default.createElement(_core.Button, {
    text: "Clear All",
    onClick: props.clearAll
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: _core.Classes.DIALOG_BODY
  }, items)));
}
ErrorDrawer = /*#__PURE__*/(0, _react.memo)(ErrorDrawer);
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
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
var _communication_react = require("./communication_react");
var _blueprint_react_widgets = require("./blueprint_react_widgets");
var _utilities_react = require("./utilities_react");
var _theme = require("./theme");
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
    }, []);
    function initSocket() {
      props.tsocket.attachListener('add-error-drawer-entry', _addEntry);
    }
    function _registerGoToModule(the_func) {
      goToModule.current = the_func;
    }
    function _close(data) {
      if (data == null || !("main_id" in data) || data.main_id == local_id.current) {
        set_show_drawer(false);
      }
    }
    function _open(data) {
      if (data == null || !("main_id" in data) || data.main_id == local_id.current) {
        set_show_drawer(true);
      }
    }
    function _toggle(data) {
      if (data == null || !("main_id" in data) || data.main_id == local_id.current) {
        set_show_drawer(!show_drawer);
      }
    }
    function _addEntry(data) {
      let open = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      ucounter.current = ucounter.current + 1;
      const newcontents = {
        ...contents_ref.current
      };
      newcontents[String(ucounter.current)] = data;
      set_contents(newcontents);
      set_show_drawer(open);
    }
    function _addFromError(title, data) {
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
    }
    function _closeEntry(ukey) {
      const newcontents = {
        ...contents_ref.current
      };
      delete newcontents[ukey];
      set_contents(newcontents);
      set_show_drawer(false);
    }
    function _postAjaxFailure(qXHR, textStatus, errorThrown) {
      _addEntry({
        title: "Post Ajax Failure: {}".format(textStatus),
        content: errorThrown
      });
    }
    function _clearAll(data) {
      if (data == null || !("main_id" in data) || data.main_id == props.main_id) {
        set_contents([]);
        set_show_drawer(false);
      }
    }
    function _onClose() {
      set_show_drawer(false);
    }
    function _setGoToLineNumber(gtfunc) {
      goToLineNumber.current = gtfunc;
    }
    let errorDrawerFuncs = {
      openErrorDrawer: _open,
      closeErrorDrawer: _close,
      clearErrorDrawer: _clearAll,
      addErrorDrawerEntry: _addEntry,
      addFromError: _addFromError,
      postAjaxFailure: _postAjaxFailure,
      toggleErrorDrawer: _toggle,
      setGoToLineNumber: _setGoToLineNumber,
      registerGoToModule: _registerGoToModule
    };
    return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(ErrorDrawerContext.Provider, {
      value: errorDrawerFuncs
    }, /*#__PURE__*/_react.default.createElement(WrappedComponent, (0, _extends2.default)({}, props, {
      errorDrawerFuncs: errorDrawerFuncs
    }))), /*#__PURE__*/_react.default.createElement(ErrorDrawer, {
      show_drawer: show_drawer,
      contents: contents_ref,
      position: lposition,
      error_drawer_size: error_drawer_size,
      local_id: local_id.current,
      handleCloseItem: _closeEntry,
      goToLineNumberFunc: goToLineNumber.current,
      goToModule: goToModule,
      closeErrorDrawer: _close,
      title: "Error Drawer",
      size: error_drawer_size,
      onClose: _onClose,
      clearAll: _clearAll
    }));
  }
  return /*#__PURE__*/(0, _react.memo)(WithErrorComponent);
}
function ErrorItem(props) {
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
ErrorItem.propTypes = {
  ukey: _propTypes.default.string,
  title: _propTypes.default.string,
  content: _propTypes.default.string,
  has_link: _propTypes.default.bool,
  line_number: _propTypes.default.number,
  goToLineNumberFunc: _propTypes.default.func,
  tile_type: _propTypes.default.string,
  handleCloseItem: _propTypes.default.func
};
ErrorItem.defaultProps = {
  title: null,
  has_link: false,
  line_number: null,
  goToLineNumberfunc: null,
  tile_type: null
};
function ErrorDrawer(props) {
  const theme = (0, _react.useContext)(_theme.ThemeContext);
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
    className: theme.dark_theme ? "bp5-dark" : "light-theme",
    title: props.title,
    isOpen: props.show_drawer,
    position: props.position,
    canOutsideClickClose: true,
    onClose: props.onClose,
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
ErrorDrawer.propTypes = {
  show_drawer: _propTypes.default.bool,
  contents: _propTypes.default.object,
  title: _propTypes.default.string,
  onClose: _propTypes.default.func,
  handleCloseItem: _propTypes.default.func,
  position: _propTypes.default.string,
  clearAll: _propTypes.default.func,
  goToLineNumberFunc: _propTypes.default.func,
  size: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number])
};
ErrorDrawer.defaultProps = {
  show_drawer: false,
  contents: [],
  position: "right",
  title: null,
  size: "30%",
  goToLineNumberfunc: null
};
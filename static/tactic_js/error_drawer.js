"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ErrorDrawerContext = void 0;
exports.ErrorItem = ErrorItem;
exports.withErrorDrawer = withErrorDrawer;
var _react = _interopRequireWildcard(require("react"));
var _core = require("@blueprintjs/core");
var _communication_react = require("./communication_react");
var _blueprint_react_widgets = require("./blueprint_react_widgets");
var _utilities_react = require("./utilities_react");
var _settings = require("./settings");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var ErrorDrawerContext = exports.ErrorDrawerContext = /*#__PURE__*/(0, _react.createContext)(null);
function withErrorDrawer(WrappedComponent) {
  var lposition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "right";
  var error_drawer_size = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "30%";
  function WithErrorComponent(props) {
    var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      show_drawer = _useState2[0],
      set_show_drawer = _useState2[1];
    var _useStateAndRef = (0, _utilities_react.useStateAndRef)({}),
      _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
      set_contents = _useStateAndRef2[1],
      contents_ref = _useStateAndRef2[2]; // the ref is necessary.

    var goToLineNumber = (0, _react.useRef)(null);
    var ucounter = (0, _react.useRef)(0);
    var local_id = (0, _react.useRef)(props.main_id ? props.main_id : props.library_id);
    var goToModule = (0, _react.useRef)(null);
    (0, _react.useEffect)(function () {
      initSocket();
      return function () {
        goToLineNumber.current = null;
        ucounter.current = null;
        local_id.current = null;
      };
    }, []);
    function initSocket() {
      props.tsocket.attachListener('add-error-drawer-entry', _addEntry);
    }
    var _registerGoToModule = (0, _react.useCallback)(function (the_func) {
      goToModule.current = the_func;
    }, []);
    var _close = (0, _react.useCallback)(function (data) {
      if (data == null || !("main_id" in data) || data.main_id == local_id.current) {
        set_show_drawer(false);
      }
    }, [local_id.current]);
    var _open = (0, _react.useCallback)(function (data) {
      if (data == null || !("main_id" in data) || data.main_id == local_id.current) {
        set_show_drawer(true);
      }
    }, [local_id.current]);
    var _toggle = (0, _react.useCallback)(function (data) {
      if (data == null || !("main_id" in data) || data.main_id == local_id.current) {
        set_show_drawer(function (prev_show_drawer) {
          return !prev_show_drawer;
        });
      }
    }, [local_id.current]);
    var _addEntry = (0, _react.useCallback)(function (data) {
      var open = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      ucounter.current = ucounter.current + 1;
      var newcontents = _objectSpread({}, contents_ref.current);
      newcontents[String(ucounter.current)] = data;
      set_contents(newcontents);
      set_show_drawer(open);
    }, [contents_ref.current, ucounter.current]);
    var _addFromError = (0, _react.useCallback)(function (title, data) {
      var open = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var content = "";
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
    var _closeEntry = (0, _react.useCallback)(function (ukey) {
      var newcontents = _objectSpread({}, contents_ref.current);
      delete newcontents[ukey];
      set_contents(newcontents);
      set_show_drawer(false);
    }, [contents_ref.current]);
    var _postAjaxFailure = (0, _react.useCallback)(function (qXHR, textStatus, errorThrown) {
      _addEntry({
        title: "Post Ajax Failure: {}".format(textStatus),
        content: errorThrown
      });
    }, []);
    var _clearAll = (0, _react.useCallback)(function (data) {
      if (data == null || !("main_id" in data) || data.main_id == props.main_id) {
        set_contents([]);
        set_show_drawer(false);
      }
    }, [props.main_id]);
    var _onClose = (0, _react.useCallback)(function () {
      set_show_drawer(false);
    }, []);
    var _setGoToLineNumber = (0, _react.useCallback)(function (gtfunc) {
      goToLineNumber.current = gtfunc;
    }, []);
    var _useStateAndRef3 = (0, _utilities_react.useStateAndRef)({
        openErrorDrawer: _open,
        closeErrorDrawer: _close,
        clearErrorDrawer: _clearAll,
        addErrorDrawerEntry: _addEntry,
        addFromError: _addFromError,
        postAjaxFailure: _postAjaxFailure,
        toggleErrorDrawer: _toggle,
        setGoToLineNumber: _setGoToLineNumber,
        registerGoToModule: _registerGoToModule
      }),
      _useStateAndRef4 = _slicedToArray(_useStateAndRef3, 3),
      errorDrawerFuncs = _useStateAndRef4[0],
      setErrorDrawerFuncs = _useStateAndRef4[1],
      errorDrawerFuncsRef = _useStateAndRef4[2];
    (0, _react.useEffect)(function () {
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
    return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(ErrorDrawerContext.Provider, {
      value: errorDrawerFuncs
    }, /*#__PURE__*/_react["default"].createElement(WrappedComponent, _extends({}, props, {
      errorDrawerFuncs: errorDrawerFuncsRef.current
    }))), /*#__PURE__*/_react["default"].createElement(ErrorDrawer, {
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
  props = _objectSpread({
    title: null,
    has_link: false,
    line_number: null,
    goToLineNumberfunc: null,
    tile_type: null
  }, props);
  function _openError() {
    if (!window.in_context) {
      window.blur();
      (0, _communication_react.postWithCallback)("host", "go_to_module_viewer_if_exists", {
        user_id: window.user_id,
        tile_type: props.tile_type,
        line_number: props.line_number
      }, function (data) {
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
  var content_dict = {
    __html: props.content
  };
  return /*#__PURE__*/_react["default"].createElement(_core.Card, {
    interactive: true,
    elevation: _core.Elevation.TWO,
    style: {
      marginBottom: 5,
      position: "relative"
    }
  }, props.title && /*#__PURE__*/_react["default"].createElement("h6", {
    style: {
      overflow: "auto"
    }
  }, /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
    icon: "issue",
    size: 16
  }), /*#__PURE__*/_react["default"].createElement("a", {
    href: "#",
    style: {
      marginLeft: 10
    }
  }, props.title))), /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: function handleClick() {
      props.handleCloseItem(props.ukey);
    },
    style: {
      position: "absolute",
      right: 5,
      top: 5
    },
    icon: "cross"
  }), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      fontSize: 13,
      overflow: "auto"
    },
    dangerouslySetInnerHTML: content_dict
  }), props.has_link && /*#__PURE__*/_react["default"].createElement(_core.Button, {
    text: "show",
    icon: "eye-open",
    size: "small",
    onClick: _openError
  }));
}
exports.ErrorItem = ErrorItem = /*#__PURE__*/(0, _react.memo)(ErrorItem);
function ErrorDrawer(props) {
  props = _objectSpread({
    show_drawer: false,
    contents: [],
    position: "right",
    title: null,
    size: "30%",
    goToLineNumberfunc: null
  }, props);
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  var sorted_keys = _toConsumableArray(Object.keys(props.contents.current));
  sorted_keys.sort(function (a, b) {
    return parseInt(b) - parseInt(a);
  });
  var items = sorted_keys.map(function (ukey) {
    var entry = props.contents.current[ukey];
    var has_link = false;
    if (entry.hasOwnProperty("line_number")) {
      has_link = true;
    }
    return /*#__PURE__*/_react["default"].createElement(ErrorItem, {
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
  return /*#__PURE__*/_react["default"].createElement(_core.Drawer, {
    icon: "console",
    className: settingsContext.isDark() ? "bp6-dark" : "light-theme",
    title: props.title,
    isOpen: props.show_drawer,
    position: props.position,
    canOutsideClickClose: false,
    onClose: props.onClose,
    hasBackdrop: false,
    size: props.size
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: _core.Classes.DRAWER_BODY
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-row justify-content-around mt-2"
  }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
    text: "Clear All",
    onClick: props.clearAll
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: _core.Classes.DIALOG_BODY
  }, items)));
}
ErrorDrawer = /*#__PURE__*/(0, _react.memo)(ErrorDrawer);
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ErrorItem = ErrorItem;
exports.withErrorDrawer = withErrorDrawer;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
var _communication_react = require("./communication_react");
var _blueprint_react_widgets = require("./blueprint_react_widgets");
var _utilities_react = require("./utilities_react");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
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
      contents = _useStateAndRef2[0],
      set_contents = _useStateAndRef2[1],
      contents_ref = _useStateAndRef2[2]; // the ref is necessary.

    var goToLineNumber = (0, _react.useRef)(null);
    var ucounter = (0, _react.useRef)(0);
    var local_id = (0, _react.useRef)(props.main_id ? props.main_id : props.library_id);
    (0, _react.useEffect)(function () {
      initSocket();
    }, []);
    function initSocket() {
      props.tsocket.attachListener('close-error-drawer', _close);
      props.tsocket.attachListener('open-error-drawer', _open);
      props.tsocket.attachListener('add-error-drawer-entry', _addEntry);
      props.tsocket.attachListener("clear-error-drawer", _clearAll);
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
      var open = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      if (data == null || !("main_id" in data) || data.main_id == local_id.current) {
        ucounter.current = ucounter.current + 1;
        var newcontents = _objectSpread({}, contents_ref.current);
        newcontents[String(ucounter.current)] = data;
        set_contents(newcontents);
        set_show_drawer(open);
      }
    }
    function _closeEntry(ukey) {
      var newcontents = _objectSpread({}, contents_ref.current);
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
    var errorDrawerFuncs = {
      openErrorDrawer: _open,
      closeErrorDrawer: _close,
      clearErrorDrawer: _clearAll,
      addErrorDrawerEntry: _addEntry,
      postAjaxFailure: _postAjaxFailure,
      toggleErrorDrawer: _toggle,
      setGoToLineNumber: _setGoToLineNumber
    };
    return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(WrappedComponent, _extends({}, props, errorDrawerFuncs, {
      errorDrawerFuncs: errorDrawerFuncs
    })), /*#__PURE__*/_react["default"].createElement(ErrorDrawer, {
      show_drawer: show_drawer,
      contents: contents_ref,
      position: lposition,
      error_drawer_size: error_drawer_size,
      local_id: local_id.current,
      handleCloseItem: _closeEntry,
      goToLineNumberFunc: goToLineNumber.current,
      goToModule: props.goToModule,
      closeErrorDrawer: _close,
      title: "Error Drawer",
      dark_theme: props.controlled ? props.dark_theme : window.dark_theme,
      size: error_drawer_size,
      onClose: _onClose,
      clearAll: _clearAll
    }));
  }
  return /*#__PURE__*/(0, _react.memo)(WithErrorComponent);
}
function ErrorItem(props) {
  function _openError() {
    // This first condition will be true if this error drawer is in the tile creator
    if (props.goToLineNumberFunc) {
      props.goToLineNumberFunc(props.line_number);
    } else {
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
        props.goToModule(props.tile_type, props.line_number);
      }
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
  }, /*#__PURE__*/_react["default"].createElement("a", {
    href: "#"
  }, props.title)), /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
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
    small: true,
    onClick: _openError
  }));
}
exports.ErrorItem = ErrorItem = /*#__PURE__*/(0, _react.memo)(ErrorItem);
ErrorItem.propTypes = {
  ukey: _propTypes["default"].string,
  title: _propTypes["default"].string,
  content: _propTypes["default"].string,
  has_link: _propTypes["default"].bool,
  line_number: _propTypes["default"].number,
  goToLineNumberFunc: _propTypes["default"].func,
  tile_type: _propTypes["default"].string,
  handleCloseItem: _propTypes["default"].func
};
ErrorItem.defaultProps = {
  title: null,
  has_link: false,
  line_number: null,
  goToLineNumberfunc: null,
  tile_type: null
};
function ErrorDrawer(props) {
  var sorted_keys = _toConsumableArray(Object.keys(props.contents.current));
  sorted_keys.sort(function (a, b) {
    return parseInt(b) - parseInt(a);
  });
  var items = sorted_keys.map(function (ukey, index) {
    var entry = props.contents.current[ukey];
    var content_dict = {
      __html: entry.content
    };
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
      goToLineNumberFunc: props.goToLineNumberFunc,
      closeErrorDrawer: props.closeErrorDrawer,
      goToModule: props.goToModule,
      line_number: entry.line_number,
      tile_type: entry.tile_type
    });
  });
  return /*#__PURE__*/_react["default"].createElement(_core.Drawer, {
    icon: "console",
    className: props.dark_theme ? "bp5-dark" : "light-theme",
    title: props.title,
    isOpen: props.show_drawer,
    position: props.position,
    canOutsideClickClose: true,
    onClose: props.onClose,
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
ErrorDrawer.propTypes = {
  show_drawer: _propTypes["default"].bool,
  dark_theme: _propTypes["default"].bool,
  contents: _propTypes["default"].object,
  title: _propTypes["default"].string,
  onClose: _propTypes["default"].func,
  handleCloseItem: _propTypes["default"].func,
  position: _propTypes["default"].string,
  clearAll: _propTypes["default"].func,
  goToLineNumberFunc: _propTypes["default"].func,
  size: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number])
};
ErrorDrawer.defaultProps = {
  show_drawer: false,
  contents: [],
  position: "right",
  title: null,
  size: "30%",
  goToLineNumberfunc: null
};
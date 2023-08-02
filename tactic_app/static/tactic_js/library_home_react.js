"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LibraryHomeApp = LibraryHomeApp;
require("../tactic_css/tactic.scss");
require("../tactic_css/tactic_table.scss");
require("../tactic_css/library_home.scss");
var _react = _interopRequireWildcard(require("react"));
var ReactDOM = _interopRequireWildcard(require("react-dom"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _TacticOmnibar = require("./TacticOmnibar");
var _tactic_socket = require("./tactic_socket");
var _communication_react = require("./communication_react");
var _toaster = require("./toaster.js");
var _library_pane = require("./library_pane");
var _sizing_tools = require("./sizing_tools");
var _toaster2 = require("./toaster");
var _error_drawer = require("./error_drawer");
var _key_trap = require("./key_trap");
var _utilities_react = require("./utilities_react");
var _blueprint_navbar = require("./blueprint_navbar");
var _library_menubars = require("./library_menubars");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
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
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; } // noinspection JSCheckFunctionSignatures
var TAB_BAR_WIDTH = 50;
var library_id = (0, _utilities_react.guid)();
var tsocket = new _tactic_socket.TacticSocket("main", 5000, "library", library_id);
function _library_home_main() {
  var LibraryHomeAppPlus = (0, _error_drawer.withErrorDrawer)((0, _toaster2.withStatus)(LibraryHomeApp));
  var domContainer = document.querySelector('#library-home-root');
  ReactDOM.render( /*#__PURE__*/_react["default"].createElement(LibraryHomeAppPlus, {
    tsocket: tsocket,
    registerOmniFunction: null,
    controlled: false,
    initial_theme: window.theme
  }), domContainer);
}
var tab_panes = ["all-pane", "collections-pane", "projects-pane", "tiles-pane", "lists-pane", "code-pane"];
var controllable_props = ["usable_width", "usable_height"];
function LibraryHomeApp(props) {
  var omniGetters = (0, _react.useRef)({});
  var _useState = (0, _react.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    showOmnibar = _useState2[0],
    setShowOmnibar = _useState2[1];
  var _useState3 = (0, _react.useState)(null),
    _useState4 = _slicedToArray(_useState3, 2),
    usable_height = _useState4[0],
    set_usable_height = _useState4[1];
  var _useState5 = (0, _react.useState)(null),
    _useState6 = _slicedToArray(_useState5, 2),
    usable_width = _useState6[0],
    set_usable_width = _useState6[1];
  var _useState7 = (0, _react.useState)(null),
    _useState8 = _slicedToArray(_useState7, 2),
    dark_theme = _useState8[0],
    set_dark_theme = _useState8[1];
  var pushCallback = (0, _utilities_react.useCallbackStack)("library_home");
  var top_ref = (0, _react.useRef)(null);
  var key_bindings = [[["ctrl+space"], _showOmnibar]];
  (0, _utilities_react.useConstructor)(function () {
    if (props.registerOmniFunction) {
      props.registerOmniFunction(_omniFunction);
    }
    if (!window.in_context) {
      var aheight = (0, _sizing_tools.getUsableDimensions)(true).usable_height_no_bottom;
      var awidth = (0, _sizing_tools.getUsableDimensions)(true).usable_width - 170;
      set_usable_height(aheight);
      set_usable_width(awidth);
      set_dark_theme(props.initial_theme === "dark");
    }
  });
  (0, _react.useEffect)(function () {
    initSocket();
    props.stopSpinner(null);
    if (!props.controlled) {
      window.dark_theme = dark_theme;
      window.addEventListener("resize", _handleResize);
      _handleResize();
    }
    return function () {
      props.tsocket.disconnect();
    };
  }, []);
  function initSocket() {
    props.tsocket.attachListener('handle-callback', function (task_packet) {
      (0, _communication_react.handleCallback)(task_packet, props.library_id);
    });
    props.tsocket.attachListener("window-open", function (data) {
      return window.open("".concat($SCRIPT_ROOT, "/load_temp_page/").concat(data["the_id"]));
    });
    props.tsocket.attachListener("doFlash", function (data) {
      (0, _toaster.doFlash)(data);
    });
    if (!window.in_context) {
      props.tsocket.attachListener("doFlashUser", function (data) {
        (0, _toaster.doFlash)(data);
      });
      props.tsocket.attachListener('close-user-windows', function (data) {
        if (!(data["originator"] == library_id)) {
          window.close();
        }
      });
    }
  }
  function _showOmnibar() {
    setShowOmnibar(true);
  }
  function _closeOmnibar() {
    setShowOmnibar(false);
  }
  function _omniFunction() {
    var omni_items = [];
    for (var ogetter in omniGetters.current) {
      omni_items = omni_items.concat(omniGetters.current[ogetter]());
    }
    return omni_items;
  }
  function _registerOmniGetter(name, the_function) {
    omniGetters.current[name] = the_function;
  }
  function _setTheme(dark_theme) {
    set_dark_theme(dark_theme);
    pushCallback(function () {
      window.dark_theme = dark_theme;
    });
  }
  function _handleResize() {
    set_usable_width(window.innerWidth - top_ref.current.offsetLeft);
    set_usable_height(window.innerHeight - top_ref.current.offsetTop);
  }
  var real_dark_theme = props.controlled ? props.dark_theme : dark_theme;
  var lib_props = _objectSpread({}, props);
  if (!props.controlled) {
    lib_props.usable_width = usable_width - TAB_BAR_WIDTH;
    lib_props.usable_height = usable_height;
  }
  var all_pane = /*#__PURE__*/_react["default"].createElement(_library_pane.LibraryPane, _extends({}, lib_props, {
    columns: {
      "icon:th": {
        "sort_field": "type",
        "first_sort": "ascending"
      },
      "name": {
        "sort_field": "name",
        "first_sort": "ascending"
      },
      "icon:upload": {
        "sort_field": null,
        "first_sort": "ascending"
      },
      "created": {
        "sort_field": "created_for_sort",
        "first_sort": "descending"
      },
      "updated": {
        "sort_field": "updated_for_sort",
        "first_sort": "ascending"
      },
      "tags": {
        "sort_field": "tags",
        "first_sort": "ascending"
      },
      "size": {
        "sort_field": "size_for_sort",
        "first_sort": "descending"
      }
    },
    pane_type: "all",
    handleCreateViewer: props.handleCreateViewer,
    open_resources: props.open_resources ? props.open_resources["all"] : null,
    allow_search_inside: true,
    allow_search_metadata: true,
    MenubarClass: _library_menubars.AllMenubar,
    registerOmniGetter: _registerOmniGetter
  }, props.errorDrawerFuncs, {
    errorDrawerFuncs: props.errorDrawerFuncs,
    library_id: library_id
  }));
  var outer_style = {
    width: "100%",
    paddingLeft: 0
  };
  var outer_class = "";
  if (!props.controlled) {
    outer_class = "library-pane-holder  ";
    if (dark_theme) {
      outer_class = "".concat(outer_class, " bp5-dark");
    } else {
      outer_class = "".concat(outer_class, " light-theme");
    }
  }
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, !props.controlled && /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    dark_theme: dark_theme,
    registerOmniFunction: function registerOmniFunction(register_func) {
      return _registerOmniFunction("navbar", register_func);
    },
    set_theme: props.controlled ? props.setTheme : _setTheme,
    selected: null,
    show_api_links: false,
    extra_text: window.database_type == "Local" ? "" : window.database_type,
    page_id: props.library_id,
    user_name: window.username
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: outer_class,
    ref: top_ref,
    style: outer_style
  }, all_pane), !window.in_context && /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_TacticOmnibar.TacticOmnibar, {
    omniGetters: [_omniFunction],
    page_id: props.library_id,
    showOmnibar: showOmnibar,
    closeOmnibar: _closeOmnibar
  }), /*#__PURE__*/_react["default"].createElement(_key_trap.KeyTrap, {
    global: true,
    bindings: key_bindings
  })));
}
exports.LibraryHomeApp = LibraryHomeApp = /*#__PURE__*/(0, _react.memo)(LibraryHomeApp);
LibraryHomeApp.propTypes = {
  open_resources: _propTypes["default"].object
};
LibraryHomeApp.defaultProps = {
  open_resources: null
};
if (!window.in_context) {
  _library_home_main();
}
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RepositoryHomeApp = RepositoryHomeApp;
exports.repository_props = repository_props;
require("../tactic_css/tactic.scss");
require("../tactic_css/tactic_table.scss");
require("../tactic_css/library_home.scss");
var _react = _interopRequireWildcard(require("react"));
var ReactDOM = _interopRequireWildcard(require("react-dom"));
var _core = require("@blueprintjs/core");
var _table = require("@blueprintjs/table");
var _tactic_socket = require("./tactic_socket");
var _communication_react = require("./communication_react");
var _toaster = require("./toaster");
var _library_pane = require("./library_pane");
var _sizing_tools = require("./sizing_tools");
var _error_drawer = require("./error_drawer");
var _utilities_react = require("./utilities_react");
var _blueprint_navbar = require("./blueprint_navbar");
var _theme = require("./theme");
var _modal_react = require("./modal_react");
var _repository_menubars = require("./repository_menubars");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
var MARGIN_SIZE = 17;
var TAB_BAR_WIDTH = 50;
var tsocket;
function _repository_home_main() {
  window.library_id = (0, _utilities_react.guid)();
  tsocket = new _tactic_socket.TacticSocket("main", 5000, "repository", window.library_id);
  var RepositoryHomeAppPlus = (0, _theme.withTheme)((0, _modal_react.withDialogs)((0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(RepositoryHomeApp))));
  var domContainer = document.querySelector('#library-home-root');
  ReactDOM.render( /*#__PURE__*/_react["default"].createElement(RepositoryHomeAppPlus, _extends({}, repository_props(), {
    initial_theme: window.theme,
    controlled: false,
    tsocket: tsocket,
    registerLibraryTabChanger: null
  })), domContainer);
}
function repository_props() {
  return {
    library_id: (0, _utilities_react.guid)()
  };
}
var controllable_props = ["usable_height", "usable_width"];
var initial_pane_states = {};
var _iterator = _createForOfIteratorHelper(_library_pane.res_types),
  _step;
try {
  for (_iterator.s(); !(_step = _iterator.n()).done;) {
    var res_type = _step.value;
    initial_pane_states[res_type] = {
      left_width_fraction: .65,
      selected_resource: {
        "name": "",
        "tags": "",
        "notes": "",
        "updated": "",
        "created": ""
      },
      selected_rows: [],
      tag_button_state: {
        expanded_tags: [],
        active_tag: "all",
        tree: []
      },
      sort_field: "updated",
      sort_direction: "descending",
      filterType: res_type,
      multi_select: false,
      list_of_selected: [],
      search_string: "",
      search_inside: false,
      search_metadata: false,
      selectedRegions: [_table.Regions.row(0)]
    };
  }
} catch (err) {
  _iterator.e(err);
} finally {
  _iterator.f();
}
function RepositoryHomeApp(props) {
  var _useState = (0, _react.useState)(),
    _useState2 = _slicedToArray(_useState, 2),
    selected_tab_id = _useState2[0],
    set_selected_tab_id = _useState2[1];
  var _useState3 = (0, _react.useState)(initial_pane_states),
    _useState4 = _slicedToArray(_useState3, 2),
    pane_states = _useState4[0],
    set_pane_state = _useState4[1];
  var _useState5 = (0, _react.useState)((0, _sizing_tools.getUsableDimensions)(true).usable_height_no_bottom),
    _useState6 = _slicedToArray(_useState5, 2),
    usable_height = _useState6[0],
    set_usable_height = _useState6[1];
  var _useState7 = (0, _react.useState)((0, _sizing_tools.getUsableDimensions)(true).usable_width - 170),
    _useState8 = _slicedToArray(_useState7, 2),
    usable_width = _useState8[0],
    set_usable_width = _useState8[1];
  var theme = (0, _react.useContext)(_theme.ThemeContext);
  var statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  var top_ref = (0, _react.useRef)(null);
  (0, _utilities_react.useConstructor)(function () {
    if (props.registerLibraryTabChanger) {
      props.registerLibraryTabChanger(_handleTabChange);
    }
  });
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  (0, _react.useEffect)(function () {
    initSocket();
    statusFuncs.stopSpinner();
    if (!props.controlled) {
      window.addEventListener("resize", _update_window_dimensions);
      _update_window_dimensions();
    }
    return function () {
      props.tsocket.disconnect();
    };
  }, []);
  function initSocket() {
    var tsocket = props.tsocket;
    tsocket.attachListener("window-open", function (data) {
      return window.open("".concat($SCRIPT_ROOT, "/load_temp_page/").concat(data["the_id"]));
    });
    tsocket.attachListener("doFlash", function (data) {
      (0, _toaster.doFlash)(data);
    });
    if (!window.in_context) {
      tsocket.attachListener('handle-callback', function (task_packet) {
        (0, _communication_react.handleCallback)(task_packet, window.library_id);
      });
      tsocket.attachListener("doFlashUser", function (data) {
        (0, _toaster.doFlash)(data);
      });
      tsocket.attachListener('close-user-windows', function (data) {
        if (!(data["originator"] == window.library_id)) {
          window.close();
        }
      });
    }
  }
  function _updatePaneState(res_type, state_update) {
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var old_state = Object.assign({}, pane_states[res_type]);
    var new_pane_states = Object.assign({}, pane_states);
    new_pane_states[res_type] = Object.assign(old_state, state_update);
    set_pane_states(new_pane_states);
    pushCallback(callback);
  }
  function _update_window_dimensions() {
    if (!props.controlled) {
      var uwidth = window.innerWidth - 2 * _sizing_tools.SIDE_MARGIN;
      var uheight = window.innerHeight;
      if (top_ref && top_ref.current) {
        uheight = uheight - top_ref.current.offsetTop;
      } else {
        uheight = uheight - _sizing_tools.USUAL_TOOLBAR_HEIGHT;
      }
      set_usable_height(uheight);
      set_usable_width(uwidth);
    }
  }
  function _handleTabChange(newTabId, prevTabId, event) {
    set_selected_tab_id(newTabId);
    pushCallback(_update_window_dimensions);
  }
  function getIconColor(paneId) {
    return paneId == selected_tab_id ? "white" : "#CED9E0";
  }
  var tsocket = props.tsocket;
  var lib_props = _objectSpread({}, props);
  if (!props.controlled) {
    lib_props.usable_width = usable_width - TAB_BAR_WIDTH;
    lib_props.usable_height = usable_height;
  }
  var collection_pane = /*#__PURE__*/_react["default"].createElement(_library_pane.LibraryPane, _extends({}, lib_props, {
    pane_type: "collection",
    allow_search_inside: false,
    allow_search_metadata: false,
    MenubarClass: _repository_menubars.RepositoryCollectionMenubar,
    updatePaneState: _updatePaneState
  }, pane_states["collection"], props.errorDrawerFuncs, {
    errorDrawerFuncs: props.errorDrawerFuncs,
    is_repository: true
  }));
  var projects_pane = /*#__PURE__*/_react["default"].createElement(_library_pane.LibraryPane, _extends({}, lib_props, {
    pane_type: "project",
    allow_search_inside: false,
    allow_search_metadata: true,
    MenubarClass: _repository_menubars.RepositoryProjectMenubar,
    updatePaneState: _updatePaneState
  }, pane_states["project"], props.errorDrawerFuncs, {
    errorDrawerFuncs: props.errorDrawerFuncs,
    is_repository: true
  }));
  var tiles_pane = /*#__PURE__*/_react["default"].createElement(_library_pane.LibraryPane, _extends({}, lib_props, {
    pane_type: "tile",
    allow_search_inside: true,
    allow_search_metadata: true,
    MenubarClass: _repository_menubars.RepositoryTileMenubar,
    updatePaneState: _updatePaneState
  }, pane_states["tile"], props.errorDrawerFuncs, {
    errorDrawerFuncs: props.errorDrawerFuncs,
    is_repository: true
  }));
  var lists_pane = /*#__PURE__*/_react["default"].createElement(_library_pane.LibraryPane, _extends({}, lib_props, {
    pane_type: "list",
    allow_search_inside: true,
    allow_search_metadata: true,
    MenubarClass: _repository_menubars.RepositoryListMenubar,
    updatePaneState: _updatePaneState
  }, pane_states["list"], props.errorDrawerFuncs, {
    errorDrawerFuncs: props.errorDrawerFuncs,
    is_repository: true
  }));
  var code_pane = /*#__PURE__*/_react["default"].createElement(_library_pane.LibraryPane, _extends({}, lib_props, {
    pane_type: "code",
    allow_search_inside: true,
    allow_search_metadata: true,
    MenubarClass: _repository_menubars.RepositoryCodeMenubar,
    updatePaneState: _updatePaneState
  }, pane_states["code"], props.errorDrawerFuncs, {
    errorDrawerFuncs: props.errorDrawerFuncs,
    is_repository: true
  }));
  var outer_style = {
    width: "100%",
    height: usable_height,
    paddingLeft: 0
  };
  var outer_class = "";
  if (!props.controlled) {
    outer_class = "library-pane-holder  ";
    if (theme.dark_theme) {
      outer_class = "".concat(outer_class, " bp5-dark");
    } else {
      outer_class = "".concat(outer_class, " light-theme");
    }
  }
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, !props.controlled && /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    selected: null,
    page_id: props.library_id,
    show_api_links: false,
    extra_text: window.repository_type == "Local" ? "" : window.repository_type,
    user_name: window.username
  }), /*#__PURE__*/_react["default"].createElement("div", {
    id: "repository_container",
    className: outer_class,
    ref: top_ref,
    style: outer_style
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      width: lib_props.usable_width
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.Tabs, {
    id: "the_container",
    style: {
      marginTop: 100
    },
    selectedTabId: selected_tab_id,
    renderActiveTabPanelOnly: true,
    vertical: true,
    large: true,
    onChange: _handleTabChange
  }, /*#__PURE__*/_react["default"].createElement(_core.Tab, {
    id: "collections-pane",
    panel: collection_pane
  }, /*#__PURE__*/_react["default"].createElement(_core.Tooltip, {
    content: "Collections",
    position: _core.Position.RIGHT
  }, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
    icon: "box",
    size: 20,
    tabIndex: -1,
    color: getIconColor("collections-pane")
  }))), /*#__PURE__*/_react["default"].createElement(_core.Tab, {
    id: "projects-pane",
    panel: projects_pane
  }, /*#__PURE__*/_react["default"].createElement(_core.Tooltip, {
    content: "Projects",
    position: _core.Position.RIGHT
  }, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
    icon: "projects",
    size: 20,
    tabIndex: -1,
    color: getIconColor("projects-pane")
  }))), /*#__PURE__*/_react["default"].createElement(_core.Tab, {
    id: "tiles-pane",
    panel: tiles_pane
  }, /*#__PURE__*/_react["default"].createElement(_core.Tooltip, {
    content: "Tiles",
    position: _core.Position.RIGHT
  }, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
    icon: "application",
    size: 20,
    tabIndex: -1,
    color: getIconColor("tiles-pane")
  }))), /*#__PURE__*/_react["default"].createElement(_core.Tab, {
    id: "lists-pane",
    panel: lists_pane
  }, /*#__PURE__*/_react["default"].createElement(_core.Tooltip, {
    content: "Lists",
    position: _core.Position.RIGHT
  }, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
    icon: "list",
    size: 20,
    tabIndex: -1,
    color: getIconColor("lists-pane")
  }))), /*#__PURE__*/_react["default"].createElement(_core.Tab, {
    id: "code-pane",
    panel: code_pane
  }, /*#__PURE__*/_react["default"].createElement(_core.Tooltip, {
    content: "Code",
    position: _core.Position.RIGHT
  }, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
    icon: "code",
    tabIndex: -1,
    color: getIconColor("code-pane")
  })))))));
}
exports.RepositoryHomeApp = RepositoryHomeApp = /*#__PURE__*/(0, _react.memo)(RepositoryHomeApp);
if (!window.in_context) {
  _repository_home_main();
}
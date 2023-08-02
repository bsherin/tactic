"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreatorApp = CreatorApp;
exports.creator_props = creator_props;
require("../tactic_css/tactic.scss");
require("../tactic_css/tactic_table.scss");
require("../tactic_css/tile_creator.scss");
require("codemirror/mode/javascript/javascript");
var _react = _interopRequireWildcard(require("react"));
var ReactDOM = _interopRequireWildcard(require("react-dom"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
var _TacticOmnibar = require("./TacticOmnibar");
var _key_trap = require("./key_trap");
var _tactic_socket = require("./tactic_socket");
var _menu_utilities = require("./menu_utilities");
var _resource_viewer_react_app = require("./resource_viewer_react_app");
var _reactCodemirror = require("./react-codemirror");
var _blueprint_mdata_fields = require("./blueprint_mdata_fields");
var _creator_modules_react = require("./creator_modules_react");
var _resizing_layouts = require("./resizing_layouts");
var _communication_react = require("./communication_react");
var _toaster = require("./toaster");
var _sizing_tools = require("./sizing_tools");
var _error_drawer = require("./error_drawer");
var _utilities_react = require("./utilities_react");
var _blueprint_navbar = require("./blueprint_navbar");
var _library_widgets = require("./library_widgets");
var _modal_react = require("./modal_react");
var _error_boundary = require("./error_boundary");
var _autocomplete = require("./autocomplete");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
var BOTTOM_MARGIN = 50;
var MARGIN_SIZE = 17;
function tile_creator_main() {
  function gotProps(the_props) {
    var CreatorAppPlus = (0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(CreatorApp));
    var the_element = /*#__PURE__*/_react["default"].createElement(CreatorAppPlus, _extends({}, the_props, {
      controlled: false,
      initial_theme: window.theme,
      changeName: null
    }));
    var domContainer = document.querySelector('#creator-root');
    ReactDOM.render(the_element, domContainer);
  }
  (0, _utilities_react.renderSpinnerMessage)("Starting up ...", '#creator-root');
  (0, _communication_react.postAjaxPromise)("view_in_creator_in_context", {
    "resource_name": window.module_name
  }).then(function (data) {
    creator_props(data, null, gotProps, null);
  });
}
function creator_props(data, registerDirtyMethod, finalCallback, registerOmniFunction) {
  var mdata = data.mdata;
  var split_tags = mdata.tags == "" ? [] : mdata.tags.split(" ");
  var module_name = data.resource_name;
  var module_viewer_id = data.module_viewer_id;
  window.name = module_viewer_id;
  function readyListener() {
    _everyone_ready_in_context(finalCallback);
  }
  var tsocket = new _tactic_socket.TacticSocket("main", 5000, "creator", module_viewer_id, function (response) {
    tsocket.socket.on("remove-ready-block", readyListener);
    tsocket.socket.emit('client-ready', {
      "room": data.module_viewer_id,
      "user_id": window.user_id,
      "participant": "client",
      "rb_id": data.ready_block_id,
      "main_id": data.module_viewer_id
    });
  });
  var tile_collection_name = data.tile_collection_name;
  function _everyone_ready_in_context(finalCallback) {
    if (!window.in_context) {
      (0, _utilities_react.renderSpinnerMessage)("Everyone is ready, initializing...", '#creator-root');
    }
    var the_content = {
      "module_name": module_name,
      "module_viewer_id": module_viewer_id,
      "tile_collection_name": tile_collection_name,
      "user_id": window.user_id,
      "version_string": window.version_string
    };
    window.addEventListener("unload", function sendRemove() {
      navigator.sendBeacon("/delete_container_on_unload", JSON.stringify({
        "container_id": module_viewer_id,
        "notify": false
      }));
    });
    tsocket.attachListener('handle-callback', function (task_packet) {
      (0, _communication_react.handleCallback)(task_packet, module_viewer_id);
    });
    (0, _communication_react.postWithCallback)(module_viewer_id, "initialize_parser", the_content, function (pdata) {
      return got_parsed_data_in_context(pdata);
    }, null, module_viewer_id);
    function got_parsed_data_in_context(data_object) {
      if (!window.in_context) {
        (0, _utilities_react.renderSpinnerMessage)("Creating the page...", '#creator-root');
      }
      tsocket.socket.off("remove-ready-block", readyListener);
      var parsed_data = data_object.the_content;
      var category = parsed_data.category ? parsed_data.category : "basic";
      var result_dict = {
        "res_type": "tile",
        "res_name": module_name,
        "is_repository": false
      };
      var odict = parsed_data.option_dict;
      var initial_line_number = !window.in_context && window.line_number ? window.line_number : null;
      var couple_save_attrs_and_exports = !("couple_save_attrs_and_exports" in mdata.additional_mdata) || mdata.additional_mdata.couple_save_attrs_and_exports;
      finalCallback({
        resource_name: module_name,
        tsocket: tsocket,
        module_viewer_id: module_viewer_id,
        main_id: module_viewer_id,
        is_mpl: parsed_data.is_mpl,
        is_d3: parsed_data.is_d3,
        render_content_code: parsed_data.render_content_code,
        render_content_line_number: parsed_data.render_content_line_number,
        extra_methods_line_number: parsed_data.extra_methods_line_number,
        draw_plot_line_number: parsed_data.draw_plot_line_number,
        initial_line_number: initial_line_number,
        category: category,
        extra_functions: parsed_data.extra_functions,
        draw_plot_code: parsed_data.draw_plot_code,
        jscript_code: parsed_data.jscript_code,
        tags: split_tags,
        notes: mdata.notes,
        icon: mdata.additional_mdata.icon,
        initial_theme: window.theme,
        option_list: (0, _creator_modules_react.correctOptionListTypes)(parsed_data.option_dict),
        export_list: parsed_data.export_list,
        additional_save_attrs: parsed_data.additional_save_attrs,
        couple_save_attrs_and_exports: couple_save_attrs_and_exports,
        created: mdata.datestring,
        registerDirtyMethod: registerDirtyMethod,
        registerOmniFunction: registerOmniFunction
      });
    }
  }
}
function TileCreatorToolbar(props) {
  var tstyle = {
    "marginTop": window.in_context ? 0 : 20,
    "paddingRight": 20,
    "width": "100%"
  };
  var toolbar_outer_style = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 0,
    marginTop: 7,
    whiteSpace: "nowrap"
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: tstyle,
    className: "d-flex flex-row justify-content-between"
  }, /*#__PURE__*/_react["default"].createElement(_library_widgets.SearchForm, {
    update_search_state: props.update_search_state,
    search_string: props.search_string,
    field_width: 200,
    include_search_jumper: true,
    searchPrev: props.searchPrev,
    searchNext: props.searchNext,
    search_ref: props.search_ref,
    number_matches: props.search_matches
  }));
}
TileCreatorToolbar.proptypes = {
  button_groups: _propTypes["default"].array,
  setResourceNameState: _propTypes["default"].func,
  resource_name: _propTypes["default"].string,
  search_string: _propTypes["default"].string,
  update_search_state: _propTypes["default"].func,
  res_type: _propTypes["default"].string,
  search_ref: _propTypes["default"].object,
  search_matches: _propTypes["default"].number
};
TileCreatorToolbar.defaultProps = {};
function CreatorApp(props) {
  var omniGetters = (0, _react.useRef)({});
  var top_ref = (0, _react.useRef)(null);
  var rc_span_ref = (0, _react.useRef)(null);
  var vp_ref = (0, _react.useRef)(null);
  var methods_ref = (0, _react.useRef)(null);
  var commands_ref = (0, _react.useRef)(null);
  var search_ref = (0, _react.useRef)(null);
  var last_save = (0, _react.useRef)({});
  var dpObject = (0, _react.useRef)(null);
  var rcObject = (0, _react.useRef)(null);
  var emObject = (0, _react.useRef)(null);
  var rline_number = (0, _react.useRef)(props.initial_line_number);
  var cm_list = (0, _react.useRef)(props.is_mpl || props.is_d3 ? ["tc", "rc", "em"] : ["rc", "em"]);
  var search_match_numbers = (0, _react.useRef)({
    tc: 0,
    rc: 0,
    em: 0
  });
  var key_bindings = (0, _react.useRef)([]);
  var _useState = (0, _react.useState)(0),
    _useState2 = _slicedToArray(_useState, 2),
    tabSelectCounter = _useState2[0],
    setTabSelectCounter = _useState2[1];
  var _useState3 = (0, _react.useState)({
      "metadata": true,
      "options": false,
      "exports": false,
      "methods": false,
      "commands": false
    }),
    _useState4 = _slicedToArray(_useState3, 2),
    foregrounded_panes = _useState4[0],
    set_foregrounded_panes = _useState4[1];
  var _useState5 = (0, _react.useState)(""),
    _useState6 = _slicedToArray(_useState5, 2),
    search_string = _useState6[0],
    set_search_string = _useState6[1];
  var _useState7 = (0, _react.useState)(null),
    _useState8 = _slicedToArray(_useState7, 2),
    current_search_number = _useState8[0],
    set_current_search_number = _useState8[1];
  var _useState9 = (0, _react.useState)(cm_list.current[0]),
    _useState10 = _slicedToArray(_useState9, 2),
    current_search_cm = _useState10[0],
    set_current_search_cm = _useState10[1];
  var _useState11 = (0, _react.useState)(false),
    _useState12 = _slicedToArray(_useState11, 2),
    regex = _useState12[0],
    set_regex = _useState12[1];
  var _useState13 = (0, _react.useState)(0),
    _useState14 = _slicedToArray(_useState13, 2),
    search_matches = _useState14[0],
    set_search_matches = _useState14[1];
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)(props.render_content_code),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    render_content_code = _useStateAndRef2[0],
    set_render_content_code = _useStateAndRef2[1],
    render_content_code_ref = _useStateAndRef2[2];
  var _useStateAndRef3 = (0, _utilities_react.useStateAndRef)(props.draw_plot_code),
    _useStateAndRef4 = _slicedToArray(_useStateAndRef3, 3),
    draw_plot_code = _useStateAndRef4[0],
    set_draw_plot_code = _useStateAndRef4[1],
    draw_plot_code_ref = _useStateAndRef4[2];
  var _useStateAndRef5 = (0, _utilities_react.useStateAndRef)(props.jscript_code),
    _useStateAndRef6 = _slicedToArray(_useStateAndRef5, 3),
    jscript_code = _useStateAndRef6[0],
    set_jscript_code = _useStateAndRef6[1],
    jscript_code_ref = _useStateAndRef6[2];
  var _useStateAndRef7 = (0, _utilities_react.useStateAndRef)(props.extra_functions),
    _useStateAndRef8 = _slicedToArray(_useStateAndRef7, 3),
    extra_functions = _useStateAndRef8[0],
    set_extra_functions = _useStateAndRef8[1],
    extra_functions_ref = _useStateAndRef8[2];
  var _useStateAndRef9 = (0, _utilities_react.useStateAndRef)(props.option_list),
    _useStateAndRef10 = _slicedToArray(_useStateAndRef9, 3),
    option_list = _useStateAndRef10[0],
    set_option_list = _useStateAndRef10[1],
    option_list_ref = _useStateAndRef10[2];
  var _useStateAndRef11 = (0, _utilities_react.useStateAndRef)(props.export_list),
    _useStateAndRef12 = _slicedToArray(_useStateAndRef11, 3),
    export_list = _useStateAndRef12[0],
    set_export_list = _useStateAndRef12[1],
    export_list_ref = _useStateAndRef12[2];
  var _useStateAndRef13 = (0, _utilities_react.useStateAndRef)(props.render_content_line_number),
    _useStateAndRef14 = _slicedToArray(_useStateAndRef13, 3),
    render_content_line_number = _useStateAndRef14[0],
    set_render_content_line_number = _useStateAndRef14[1],
    render_content_line_number_ref = _useStateAndRef14[2];
  var _useStateAndRef15 = (0, _utilities_react.useStateAndRef)(props.draw_plot_line_number),
    _useStateAndRef16 = _slicedToArray(_useStateAndRef15, 3),
    draw_plot_line_number = _useStateAndRef16[0],
    set_draw_plot_line_number = _useStateAndRef16[1],
    draw_plot_line_number_ref = _useStateAndRef16[2];
  var _useStateAndRef17 = (0, _utilities_react.useStateAndRef)(props.extra_methods_line_number),
    _useStateAndRef18 = _slicedToArray(_useStateAndRef17, 3),
    extra_methods_line_number = _useStateAndRef18[0],
    set_extra_methods_line_number = _useStateAndRef18[1],
    extra_methods_line_number_ref = _useStateAndRef18[2];
  var _useStateAndRef19 = (0, _utilities_react.useStateAndRef)(props.notes),
    _useStateAndRef20 = _slicedToArray(_useStateAndRef19, 3),
    notes = _useStateAndRef20[0],
    set_notes = _useStateAndRef20[1],
    notes_ref = _useStateAndRef20[2];
  var _useStateAndRef21 = (0, _utilities_react.useStateAndRef)(props.tags),
    _useStateAndRef22 = _slicedToArray(_useStateAndRef21, 3),
    tags = _useStateAndRef22[0],
    set_tags = _useStateAndRef22[1],
    tags_ref = _useStateAndRef22[2];
  var _useStateAndRef23 = (0, _utilities_react.useStateAndRef)(props.icon),
    _useStateAndRef24 = _slicedToArray(_useStateAndRef23, 3),
    icon = _useStateAndRef24[0],
    set_icon = _useStateAndRef24[1],
    icon_ref = _useStateAndRef24[2];
  var _useStateAndRef25 = (0, _utilities_react.useStateAndRef)(props.category),
    _useStateAndRef26 = _slicedToArray(_useStateAndRef25, 3),
    category = _useStateAndRef26[0],
    set_category = _useStateAndRef26[1],
    category_ref = _useStateAndRef26[2];
  var _useStateAndRef27 = (0, _utilities_react.useStateAndRef)(props.additional_save_attrs || []),
    _useStateAndRef28 = _slicedToArray(_useStateAndRef27, 3),
    additional_save_attrs = _useStateAndRef28[0],
    set_additional_save_attrs = _useStateAndRef28[1],
    additional_save_attrs_ref = _useStateAndRef28[2];
  var _useStateAndRef29 = (0, _utilities_react.useStateAndRef)(props.couple_save_attrs_and_exports),
    _useStateAndRef30 = _slicedToArray(_useStateAndRef29, 3),
    couple_save_attrs_and_exports = _useStateAndRef30[0],
    set_couple_save_attrs_and_exports = _useStateAndRef30[1],
    couple_save_attrs_and_exports_ref = _useStateAndRef30[2];
  var _useState15 = (0, _react.useState)("metadata"),
    _useState16 = _slicedToArray(_useState15, 2),
    selectedTabId = _useState16[0],
    setSelectedTabId = _useState16[1];
  var _useState17 = (0, _react.useState)(props.is_mpl || props.is_d3 ? .5 : 1),
    _useState18 = _slicedToArray(_useState17, 2),
    top_pane_fraction = _useState18[0],
    set_top_pane_fraction = _useState18[1];
  var _useState19 = (0, _react.useState)(.5),
    _useState20 = _slicedToArray(_useState19, 2),
    left_pane_fraction = _useState20[0],
    set_left_pane_fraction = _useState20[1];
  var _useState21 = (0, _react.useState)(function () {
      return (0, _sizing_tools.getUsableDimensions)(true).usable_height_no_bottom;
    }),
    _useState22 = _slicedToArray(_useState21, 2),
    usable_height = _useState22[0],
    set_usable_height = _useState22[1];
  var _useState23 = (0, _react.useState)(function () {
      return (0, _sizing_tools.getUsableDimensions)(true).usable_width - 170;
    }),
    _useState24 = _slicedToArray(_useState23, 2),
    usable_width = _useState24[0],
    set_usable_width = _useState24[1];
  var _useState25 = (0, _react.useState)(false),
    _useState26 = _slicedToArray(_useState25, 2),
    showOmnibar = _useState26[0],
    setShowOmnibar = _useState26[1];
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  var _useState27 = (0, _react.useState)(function () {
      return props.initial_theme === "dark";
    }),
    _useState28 = _slicedToArray(_useState27, 2),
    dark_theme = _useState28[0],
    set_dark_theme = _useState28[1];
  var _useState29 = (0, _react.useState)(props.resource_name),
    _useState30 = _slicedToArray(_useState29, 2),
    resource_name = _useState30[0],
    set_resource_name = _useState30[1];
  var connection_status = (0, _utilities_react.useConnection)(props.tsocket, initSocket);
  (0, _utilities_react.useConstructor)(function () {
    if (!window.in_context) {
      key_bindings.current = [[["ctrl+space"], _showOmnibar]];
    }
  });
  (0, _react.useEffect)(function () {
    if (props.registerOmniFunction) {
      props.registerOmniFunction(_omniFunction);
    }
    if (props.controlled) {
      props.registerDirtyMethod(_dirty);
      props.registerLineSetter(_selectLineNumber);
    } else {
      window.dark_theme = dark_theme;
      window.addEventListener("beforeunload", function (e) {
        if (_dirty()) {
          e.preventDefault();
          e.returnValue = '';
        }
      });
      document.title = resource_name;
      window.addEventListener("resize", _update_window_dimensions);
      _update_window_dimensions();
    }
    _goToLineNumber();
    _update_saved_state();
    props.setGoToLineNumber(_selectLineNumber);
    props.stopSpinner();
    return function () {
      delete_my_container();
    };
  }, []);
  (0, _react.useEffect)(function () {
    _goToLineNumber();
  });
  function initSocket() {
    props.tsocket.attachListener('focus-me', function (data) {
      window.focus();
      _selectLineNumber(data.line_number);
    });
    props.tsocket.attachListener("doFlash", function (data) {
      (0, _toaster.doFlash)(data);
    });
    if (!window.in_context) {
      props.tsocket.attachListener("doFlashUser", function (data) {
        (0, _toaster.doFlash)(data);
      });
      props.tsocket.attachListener('close-user-windows', function (data) {
        if (!(data["originator"] == props.resource_viewer_id)) {
          window.close();
        }
      });
    }
  }
  function cPropGetters() {
    return {
      usable_width: usable_width,
      usable_height: usable_height,
      resource_name: resource_name
    };
  }
  function _cProp(pname) {
    return props.controlled ? props[pname] : cPropGetters()[pname];
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
  function menu_specs() {
    var ms = {
      Save: [{
        name_text: "Save",
        icon_name: "saved",
        click_handler: _saveMe,
        key_bindings: ['ctrl+s']
      }, {
        name_text: "Save As...",
        icon_name: "floppy-disk",
        click_handler: _saveModuleAs
      }, {
        name_text: "Save and Checkpoint",
        icon_name: "map-marker",
        click_handler: _saveAndCheckpoint,
        key_bindings: ['ctrl+m']
      }],
      Load: [{
        name_text: "Save and Load",
        icon_name: "upload",
        click_handler: _saveAndLoadModule,
        key_bindings: ['ctrl+l']
      }, {
        name_text: "Load",
        icon_name: "upload",
        click_handler: _loadModule
      }],
      Compare: [{
        name_text: "View History",
        icon_name: "history",
        click_handler: _showHistoryViewer
      }, {
        name_text: "Compare to Other Modules",
        icon_name: "comparison",
        click_handler: _showTileDiffer
      }],
      Transfer: [{
        name_text: "Share",
        icon_name: "share",
        click_handler: function click_handler() {
          (0, _resource_viewer_react_app.sendToRepository)("tile", _cProp("resource_name"));
        }
      }]
    };
    for (var menu in ms) {
      var _iterator = _createForOfIteratorHelper(ms[menu]),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var but = _step.value;
          but.click_handler = but.click_handler.bind(this);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
    return ms;
  }
  function _extraKeys() {
    return {
      'Ctrl-S': _saveMe,
      'Ctrl-L': _saveAndLoadModule,
      'Ctrl-M': _saveAndCheckpoint,
      'Ctrl-F': function CtrlF() {
        search_ref.current.focus();
      },
      'Cmd-F': function CmdF() {
        search_ref.current.focus();
      }
    };
  }
  function _searchNext() {
    if (current_search_number >= search_match_numbers.current[current_search_cm] - 1) {
      var next_cm;
      if (current_search_cm == "rc") {
        next_cm = "em";
        _handleTabSelect("methods");
      } else if (current_search_cm == "tc") {
        next_cm = "rc";
      } else {
        if (props.is_mpl || props.is_d3) {
          next_cm = "tc";
        } else {
          next_cm = "rc";
        }
      }
      if (next_cm == "em") {
        _handleTabSelect("methods");
      }
      set_current_search_cm(next_cm);
      set_current_search_number(0);
    } else {
      set_current_search_number(current_search_number + 1);
    }
  }
  function _searchPrev() {
    var next_cm;
    var next_search_number;
    if (current_search_number <= 0) {
      if (current_search_cm == "em") {
        next_cm = "rc";
        next_search_number = search_match_numbers.current["rc"] - 1;
      } else if (current_search_cm == "tc") {
        next_cm = "em";
        next_search_number = search_match_numbers.current["em"] - 1;
      } else {
        if (props.is_mpl || props.is_d3) {
          next_cm = "tc";
          next_search_number = search_match_numbers.current["tc"] - 1;
        } else {
          next_cm = "em";
          next_search_number = search_match_numbers.current["em"] - 1;
        }
      }
      if (next_cm == "em") {
        _handleTabSelect("methods");
      }
      set_current_search_cm(next_cm);
      set_current_search_number(next_search_number);
    } else {
      set_current_search_number(current_search_number - 1);
    }
  }
  function _updateSearchState(new_state) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    set_current_search_cm(cm_list.current[0]);
    set_current_search_number(0);
    for (var field in new_state) {
      switch (field) {
        case "regex":
          set_regex(new_state[field]);
          break;
        case "search_string":
          set_search_string(new_state[field]);
          break;
      }
    }
  }
  function _noSearchResults() {
    if (search_string == "" || search_string == null) {
      return true;
    } else {
      var _iterator2 = _createForOfIteratorHelper(cm_list.current),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var cm = _step2.value;
          if (search_match_numbers.current[cm]) {
            return false;
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      return true;
    }
  }
  function _setTheme(dark_theme) {
    set_dark_theme(dark_theme);
    if (!window.in_context) {
      pushCallback(function () {
        window.dark_theme = dark_theme;
      });
    }
  }
  function _showHistoryViewer() {
    window.open("".concat($SCRIPT_ROOT, "/show_history_viewer/").concat(_cProp("resource_name")));
  }
  function _showTileDiffer() {
    window.open("".concat($SCRIPT_ROOT, "/show_tile_differ/").concat(_cProp("resource_name")));
  }
  function _doFlashStopSpinner(data) {
    props.clearStatus();
    (0, _toaster.doFlash)(data);
  }
  function _selectLineNumber(lnumber) {
    rline_number.current = lnumber;
    _goToLineNumber();
  }
  function _logErrorStopSpinner(title) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    props.stopSpinner();
    var entry = {
      title: title,
      content: data.message
    };
    if ("line_number" in data) {
      entry.line_number = data.line_number;
    }
    props.addErrorDrawerEntry(entry, true);
    props.openErrorDrawer();
  }
  function _dirty() {
    var current_state = _getSaveDict();
    for (var k in current_state) {
      if (current_state[k] != last_save.current[k]) {
        return true;
      }
    }
    return false;
  }
  function _saveAndLoadModule() {
    props.startSpinner();
    doSavePromise().then(function () {
      props.statusMessage("Loading Module");
      (0, _communication_react.postWithCallback)("host", "load_tile_module_task", {
        "tile_module_name": _cProp("resource_name"),
        "user_id": window.user_id
      }, load_success, null, props.module_viewer_id);
    })["catch"](function (data) {
      _logErrorStopSpinner("Error loading module", data);
    });
    function load_success(data) {
      if (data.success) {
        data.timeout = 2000;
      }
      _doFlashStopSpinner(data);
      return false;
    }
  }
  function _loadModule() {
    props.startSpinner();
    props.statusMessage("Loading Module");
    (0, _communication_react.postWithCallback)("host", "load_tile_module_task", {
      "tile_module_name": _cProp("resource_name"),
      "user_id": window.user_id
    }, load_success, null, props.module_viewer_id);
    function load_success(data) {
      if (data.success) {
        data.timeout = 2000;
      }
      _doFlashStopSpinner(data);
      return false;
    }
  }
  function _saveModuleAs() {
    props.startSpinner();
    (0, _communication_react.postWithCallback)("host", "get_tile_names", {
      "user_id": window.user_id
    }, function (data) {
      var checkboxes;
      (0, _modal_react.showModalReact)("Save Module As", "New ModuleName Name", CreateNewModule, "NewModule", data["tile_names"], null, doCancel);
    }, null, props.main_id);
    function doCancel() {
      props.stopSpinner();
    }
    function CreateNewModule(new_name) {
      var result_dict = {
        "new_res_name": new_name,
        "res_to_copy": _cProp("resource_name")
      };
      (0, _communication_react.postAjaxPromise)('/create_duplicate_tile', result_dict).then(function (data) {
        _setResourceNameState(new_name, function () {
          _saveMe();
        });
      })["catch"](_toaster.doFlash);
    }
  }
  function _saveMe() {
    if (!props.am_selected) {
      return false;
    }
    props.startSpinner();
    props.statusMessage("Saving Module");
    doSavePromise().then(_doFlashStopSpinner)["catch"](function (data) {
      _logErrorStopSpinner("Error saving module", data);
    });
    return false;
  }
  function _saveAndCheckpoint() {
    props.startSpinner();
    doSavePromise().then(function () {
      props.statusMessage("Checkpointing");
      doCheckpointPromise().then(_doFlashStopSpinner)["catch"](function (data) {
        _logErrorStopSpinner("Error checkpointing module", data);
      });
    })["catch"](function (data) {
      _logErrorStopSpinner("Error saving module", data);
    });
    return false;
  }
  function get_tags_string() {
    var taglist = tags_ref.current;
    var local_tags = "";
    var _iterator3 = _createForOfIteratorHelper(taglist),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var tag = _step3.value;
        local_tags = local_tags + tag + " ";
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    return local_tags.trim();
  }
  function _getSaveDict() {
    return {
      "module_name": _cProp("resource_name"),
      "category": category.length == 0 ? "basic" : category_ref.current,
      "tags": get_tags_string(),
      "notes": notes_ref.current,
      "icon": icon_ref.current,
      "exports": export_list_ref.current,
      "additional_save_attrs": additional_save_attrs_ref.current,
      "couple_save_attrs_and_exports": couple_save_attrs_and_exports_ref.current,
      "options": option_list_ref.current,
      "extra_methods": extra_functions_ref.current,
      "render_content_body": render_content_code_ref.current,
      "is_mpl": props.is_mpl,
      "is_d3": props.is_d3,
      "draw_plot_body": draw_plot_code_ref.current,
      "jscript_body": jscript_code_ref.current,
      "last_saved": "creator"
    };
  }
  function doSavePromise() {
    return new Promise(function (resolve, reject) {
      var result_dict = _getSaveDict();
      (0, _communication_react.postWithCallback)(props.module_viewer_id, "update_module", result_dict, function (data) {
        if (data.success) {
          save_success(data);
          resolve(data);
        } else {
          reject(data);
        }
      }, null, props.module_viewer_id);
    });
  }
  function doCheckpointPromise() {
    return new Promise(function (resolve, reject) {
      (0, _communication_react.postAjax)("checkpoint_module", {
        "module_name": _cProp("resource_name")
      }, function (data) {
        if (data.success) {
          resolve(data);
        } else {
          reject(data);
        }
      });
    });
  }
  function save_success(data) {
    set_render_content_line_number(data.render_content_line_number);
    set_extra_methods_line_number(data.extra_methods_line_number);
    set_draw_plot_line_number(data.draw_plot_line_number);
    _update_saved_state();
  }
  function _update_window_dimensions() {
    set_usable_width(window.innerWidth - top_ref.current.offsetLeft);
    set_usable_height(window.innerHeight - top_ref.current.offsetTop);
  }
  function _update_saved_state() {
    last_save.current = _getSaveDict();
  }
  function _selectLine(cm, lnumber) {
    var doc = cm.getDoc();
    if (doc.getLine(lnumber)) {
      doc.setSelection({
        line: lnumber,
        ch: 0
      }, {
        line: lnumber,
        ch: doc.getLine(lnumber).length
      }, {
        scroll: true
      });
    }
  }
  function _goToLineNumber() {
    if (rline_number.current) {
      props.closeErrorDrawer();
      if (props.is_mpl || props.is_d3) {
        if (rline_number.current < draw_plot_line_number_ref.current) {
          if (emObject.current) {
            _handleTabSelect("methods");
            _selectLine(emObject.current, rline_number.current - extra_methods_line_number_ref.current);
            rline_number.current = null;
          } else {
            return;
          }
        } else if (rline_number.current < render_content_line_number_ref.current) {
          if (dpObject.current) {
            _selectLine(dpObject.current, rline_number.current - draw_plot_line_number_ref.current - 1);
            rline_number.current = null;
          } else {
            return;
          }
        } else if (rcObject.current) {
          _selectLine(rcObject.current, rline_number.current - render_content_line_number_ref.current - 1);
          rline_number.current = null;
        }
      } else {
        if (rline_number < props.render_content_line_number) {
          if (emObject.current) {
            _handleTabSelect("methods");
            _selectLine(emObject.current, rline_number.current - extra_methods_line_number_ref.current);
            rline_number.current = null;
          } else {
            return;
          }
        } else {
          if (rcObject.current) {
            _selectLine(rcObject.current, rline_number.current - render_content_line_number_ref.current - 1);
            rline_number.current = null;
          }
        }
      }
    }
  }
  function delete_my_container() {
    (0, _communication_react.postAjax)("/delete_container_on_unload", {
      "container_id": props.module_viewer_id,
      "notify": false
    });
  }
  function _handleTabSelect(newTabId, prevTabid, event) {
    var new_fg = Object.assign({}, foregrounded_panes);
    new_fg[newTabId] = true;
    setSelectedTabId(newTabId);
    set_foregrounded_panes(new_fg);
    pushCallback(function () {
      if (props.controlled) {
        setTabSelectCounter(tabSelectCounter + 1);
      } else {
        _update_window_dimensions();
      }
    });
  }
  function _handleNotesAppend(new_text) {
    set_notes(notes_ref.current + new_text);
  }
  function _appendOptionText() {
    var res_string = "\n\noptions: \n\n";
    var _iterator4 = _createForOfIteratorHelper(option_list_ref.current),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var opt = _step4.value;
        res_string += " * `".concat(opt.name, "` (").concat(opt.type, "): \n");
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
    _handleNotesAppend(res_string);
  }
  function _appendExportText() {
    var res_string = "\n\nexports: \n\n";
    var _iterator5 = _createForOfIteratorHelper(export_list_ref.current),
      _step5;
    try {
      for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
        var exp = _step5.value;
        res_string += " * `".concat(exp.name, "` : \n");
      }
    } catch (err) {
      _iterator5.e(err);
    } finally {
      _iterator5.f();
    }
    _handleNotesAppend(res_string);
  }
  function _metadataNotesButtons() {
    return /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, null, /*#__PURE__*/_react["default"].createElement(_core.Button, {
      style: {
        height: "fit-content",
        alignSelf: "start",
        marginTop: 10,
        fontSize: 12
      },
      text: "Add Options",
      small: true,
      minimal: true,
      intent: "primary",
      icon: "select",
      onClick: function onClick(e) {
        e.preventDefault();
        _appendOptionText();
      }
    }), /*#__PURE__*/_react["default"].createElement(_core.Button, {
      style: {
        height: "fit-content",
        alignSelf: "start",
        marginTop: 10,
        fontSize: 12
      },
      text: "Add Exports",
      small: true,
      minimal: true,
      intent: "primary",
      icon: "export",
      onClick: function onClick(e) {
        e.preventDefault();
        _appendExportText();
      }
    }));
  }
  function _handleMetadataChange(state_stuff) {
    for (var field in state_stuff) {
      switch (field) {
        case "tags":
          set_tags(state_stuff[field]);
          break;
        case "notes":
          set_notes(state_stuff[field]);
          break;
        case "icon":
          set_icon(state_stuff[field]);
          break;
        case "category":
          set_category(state_stuff[field]);
          break;
      }
    }
  }
  function handleExportsStateChange(state_stuff) {
    for (var field in state_stuff) {
      switch (field) {
        case "export_list":
          set_export_list(_toConsumableArray(state_stuff[field]));
          break;
        case "additional_save_attrs":
          set_additional_save_attrs(_toConsumableArray(state_stuff[field]));
          break;
        case "couple_save_attrs_and_exports":
          set_couple_save_attrs_and_exports(state_stuff[field]);
          break;
      }
    }
  }
  function handleOptionsListChange(new_option_list) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    set_option_list(_toConsumableArray(new_option_list));
    pushCallback(callback);
  }
  function handleMethodsChange(new_methods) {
    set_extra_functions(new_methods);
  }
  function get_height_minus_top_offset(element_ref) {
    var min_offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var default_offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 100;
    if (element_ref && element_ref.current) {
      var offset = element_ref.current.offsetTop;
      if (offset < min_offset) {
        offset = min_offset;
      }
      return _cProp("usable_height") - offset;
    } else {
      return _cProp("usable_height") - default_offset;
    }
  }
  function get_new_tc_height() {
    return _cProp("usable_height") * top_pane_fraction - 35;
  }
  function get_new_rc_height(outer_rc_height) {
    if (rc_span_ref && rc_span_ref.current) {
      return outer_rc_height - rc_span_ref.current.offsetHeight;
    } else {
      return outer_rc_height - 50;
    }
  }
  function handleTopPaneResize(top_height, bottom_height, top_fraction) {
    set_top_pane_fraction(top_fraction);
  }
  function handleLeftPaneResize(left_width, right_width, left_fraction) {
    set_left_pane_fraction(left_fraction);
  }
  function handleTopCodeChange(new_code) {
    if (props.is_mpl) {
      set_draw_plot_code(new_code);
    } else {
      set_jscript_code(new_code);
    }
  }
  function handleRenderContentChange(new_code) {
    set_render_content_code(new_code);
  }
  function _setResourceNameState(new_name) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    if (props.controlled) {
      props.changeResourceName(new_name, callback);
    } else {
      set_resource_name(new_name);
      pushCallback(callback);
    }
  }
  function _clearAllSelections() {
    for (var _i2 = 0, _arr2 = [rcObject.current, dpObject.current, emObject.current]; _i2 < _arr2.length; _i2++) {
      var cm = _arr2[_i2];
      if (cm) {
        var to = cm.getCursor("to");
        cm.setCursor(to);
      }
    }
  }
  function _setDpObject(cmobject) {
    dpObject.current = cmobject;
  }
  function _setRcObject(cmobject) {
    rcObject.current = cmobject;
  }
  function _setEmObject(cmobject) {
    emObject.current = cmobject;
  }
  function _setSearchMatches(rc_name, num) {
    search_match_numbers.current[rc_name] = num;
    var current_matches = 0;
    for (var cname in search_match_numbers.current) {
      current_matches += search_match_numbers.current[cname];
    }
    set_search_matches(current_matches);
  }
  function _getOptionNames() {
    var onames = [];
    var _iterator6 = _createForOfIteratorHelper(option_list_ref.current),
      _step6;
    try {
      for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
        var entry = _step6.value;
        onames.push(entry.name);
      }
    } catch (err) {
      _iterator6.e(err);
    } finally {
      _iterator6.f();
    }
    return onames;
  }
  var onames_for_autocomplete = [];
  var _iterator7 = _createForOfIteratorHelper(_getOptionNames()),
    _step7;
  try {
    for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
      var oname = _step7.value;
      var the_text = "" + oname;
      onames_for_autocomplete.push({
        text: the_text,
        icon: "select",
        render: _autocomplete.renderAutoCompleteElement
      });
    }
  } catch (err) {
    _iterator7.e(err);
  } finally {
    _iterator7.f();
  }
  var actual_dark_theme = props.controlled ? props.dark_theme : dark_theme;
  var my_props = _objectSpread({}, props);
  if (!props.controlled) {
    my_props.resource_name = resource_name;
    my_props.usable_height = usable_height;
    my_props.usable_width = usable_width;
  }
  var vp_height = get_height_minus_top_offset(vp_ref);
  var uwidth = my_props.usable_width - 2 * _sizing_tools.SIDE_MARGIN;
  var uheight = my_props.usable_height;
  var code_width = uwidth * left_pane_fraction - 35;
  var ch_style = {
    "width": "100%"
  };
  var tc_item;
  if (my_props.is_mpl || my_props.is_d3) {
    var tc_height = get_new_tc_height();
    var mode = my_props.is_mpl ? "python" : "javascript";
    var code_content = my_props.is_mpl ? draw_plot_code_ref.current : jscript_code_ref.current;
    var first_line_number = my_props.is_mpl ? draw_plot_line_number_ref.current + 1 : 1;
    var title_label = my_props.is_mpl ? "draw_plot" : "(selector, w, h, arg_dict, resizing) =>";
    tc_item = /*#__PURE__*/_react["default"].createElement("div", {
      key: "dpcode",
      style: ch_style,
      className: "d-flex flex-column align-items-baseline code-holder"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%"
      }
    }, /*#__PURE__*/_react["default"].createElement("span", {
      className: "bp5-ui-text",
      style: {
        display: "flex",
        alignItems: "self-end"
      }
    }, title_label), /*#__PURE__*/_react["default"].createElement(_library_widgets.SearchForm, {
      update_search_state: _updateSearchState,
      search_string: search_string,
      regex: regex,
      allow_regex: true,
      field_width: 200,
      include_search_jumper: true,
      searchPrev: _searchPrev,
      searchNext: _searchNext,
      search_ref: search_ref,
      number_matches: search_matches
    })), /*#__PURE__*/_react["default"].createElement(_reactCodemirror.ReactCodemirror, {
      code_content: code_content,
      mode: mode,
      am_selected: props.am_selected,
      extraKeys: _extraKeys(),
      current_search_number: current_search_cm == "tc" ? current_search_number : null,
      handleChange: handleTopCodeChange,
      saveMe: _saveAndCheckpoint,
      setCMObject: _setDpObject,
      search_term: search_string,
      update_search_state: _updateSearchState,
      alt_clear_selections: _clearAllSelections,
      first_line_number: first_line_number.current,
      code_container_height: tc_height,
      dark_theme: actual_dark_theme,
      readOnly: props.read_only,
      regex_search: regex,
      setSearchMatches: function setSearchMatches(num) {
        return _setSearchMatches("tc", num);
      },
      extra_autocomplete_list: mode == "python" ? onames_for_autocomplete : []
    }));
  }
  var rc_height;
  if (my_props.is_mpl || my_props.is_d3) {
    var bheight = (1 - top_pane_fraction) * uheight - 35;
    rc_height = get_new_rc_height(bheight);
  } else {
    rc_height = get_new_rc_height(vp_height);
  }
  var bc_item = /*#__PURE__*/_react["default"].createElement("div", {
    key: "rccode",
    id: "rccode",
    style: ch_style,
    className: "d-flex flex-column align-items-baseline code-holder"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%"
    }
  }, /*#__PURE__*/_react["default"].createElement("span", {
    className: "bp5-ui-text",
    style: {
      display: "flex",
      alignItems: "self-end"
    },
    ref: rc_span_ref
  }, "render_content"), !my_props.is_mpl && !my_props.is_d3 && /*#__PURE__*/_react["default"].createElement(_library_widgets.SearchForm, {
    update_search_state: _updateSearchState,
    search_string: search_string,
    regex: regex,
    allow_regex: true,
    field_width: 200,
    include_search_jumper: true,
    searchPrev: _searchPrev,
    searchNext: _searchNext,
    search_ref: search_ref,
    number_matches: search_matches
  })), /*#__PURE__*/_react["default"].createElement(_reactCodemirror.ReactCodemirror, {
    code_content: render_content_code_ref.current,
    current_search_number: current_search_cm == "rc" ? current_search_number : null,
    am_selected: props.am_selected,
    handleChange: handleRenderContentChange,
    extraKeys: _extraKeys(),
    saveMe: _saveAndCheckpoint,
    setCMObject: _setRcObject,
    search_term: search_string,
    update_search_state: _updateSearchState,
    alt_clear_selections: _clearAllSelections,
    first_line_number: render_content_line_number_ref.current + 1,
    code_container_height: rc_height,
    dark_theme: actual_dark_theme,
    readOnly: props.read_only,
    regex_search: regex,
    setSearchMatches: function setSearchMatches(num) {
      return _setSearchMatches("rc", num);
    },
    extra_autocomplete_list: onames_for_autocomplete
  }));
  var left_pane;
  if (my_props.is_mpl || my_props.is_d3) {
    left_pane = /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
      ref: vp_ref
    }), /*#__PURE__*/_react["default"].createElement(_resizing_layouts.VerticalPanes, {
      top_pane: tc_item,
      bottom_pane: bc_item,
      show_handle: true,
      available_height: vp_height,
      available_width: left_pane_fraction * uwidth - 20,
      handleSplitUpdate: handleTopPaneResize,
      id: "creator-left"
    }));
  } else {
    left_pane = /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
      ref: vp_ref
    }, bc_item));
  }
  var default_module_height = get_height_minus_top_offset(null, 128, 128);
  var mdata_style = {
    marginLeft: 20,
    overflow: "auto",
    padding: 15,
    height: default_module_height
  };
  var mdata_panel = /*#__PURE__*/_react["default"].createElement(_blueprint_mdata_fields.CombinedMetadata, {
    tags: tags_ref.current,
    readOnly: props.readOnly,
    notes: notes_ref.current,
    icon: icon_ref.current,
    created: my_props.created,
    category: category_ref.current,
    pane_type: "tile",
    notes_buttons: _metadataNotesButtons,
    handleChange: _handleMetadataChange
  });
  var option_panel = /*#__PURE__*/_react["default"].createElement(_creator_modules_react.OptionModule, {
    data_list: option_list_ref.current,
    foregrounded: foregrounded_panes["options"],
    handleChange: handleOptionsListChange,
    handleNotesAppend: _handleNotesAppend,
    available_height: default_module_height
  });
  var export_panel = /*#__PURE__*/_react["default"].createElement(_creator_modules_react.ExportModule, {
    export_list: export_list_ref.current,
    save_list: additional_save_attrs_ref.current,
    couple_save_attrs_and_exports: couple_save_attrs_and_exports_ref.current,
    foregrounded: foregrounded_panes["exports"],
    handleChange: handleExportsStateChange,
    handleNotesAppend: _handleNotesAppend,
    available_height: default_module_height
  });
  var methods_height = get_height_minus_top_offset(methods_ref, 128, 128);
  var methods_panel = /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      marginLeft: 5
    }
  }, /*#__PURE__*/_react["default"].createElement(_reactCodemirror.ReactCodemirror, {
    handleChange: handleMethodsChange,
    show_fold_button: true,
    am_selected: props.am_selected,
    current_search_number: current_search_cm == "em" ? current_search_number : null,
    dark_theme: dark_theme,
    extraKeys: _extraKeys(),
    readOnly: props.readOnly,
    code_content: extra_functions_ref.current,
    saveMe: _saveAndCheckpoint,
    setCMObject: _setEmObject,
    code_container_ref: methods_ref,
    code_container_height: methods_height,
    search_term: search_string,
    update_search_state: _updateSearchState,
    alt_clear_selections: _clearAllSelections,
    regex_search: regex,
    first_line_number: extra_methods_line_number_ref.current,
    setSearchMatches: function setSearchMatches(num) {
      return _setSearchMatches("em", num);
    },
    extra_autocomplete_list: onames_for_autocomplete
  }));
  var commands_height = get_height_minus_top_offset(commands_ref, 128, 128);
  var commands_panel = /*#__PURE__*/_react["default"].createElement(_creator_modules_react.CommandsModule, {
    foregrounded: foregrounded_panes["commands"],
    available_height: commands_height,
    commands_ref: commands_ref
  });
  var right_pane = /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
    id: "creator-resources",
    className: "d-block"
  }, /*#__PURE__*/_react["default"].createElement(_core.Tabs, {
    id: "resource_tabs",
    selectedTabId: selectedTabId,
    large: false,
    onChange: _handleTabSelect
  }, /*#__PURE__*/_react["default"].createElement(_core.Tab, {
    id: "metadata",
    title: /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
      size: 12,
      icon: "manually-entered-data"
    }), " metadata"),
    panel: mdata_panel
  }), /*#__PURE__*/_react["default"].createElement(_core.Tab, {
    id: "options",
    title: /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
      size: 12,
      icon: "select"
    }), " options"),
    panel: option_panel
  }), /*#__PURE__*/_react["default"].createElement(_core.Tab, {
    id: "exports",
    title: /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
      size: 12,
      icon: "export"
    }), " exports"),
    panel: export_panel
  }), /*#__PURE__*/_react["default"].createElement(_core.Tab, {
    id: "methods",
    title: /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
      size: 12,
      icon: "code"
    }), " methods"),
    panel: methods_panel
  }), /*#__PURE__*/_react["default"].createElement(_core.Tab, {
    id: "commands",
    title: /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
      size: 12,
      icon: "manual"
    }), " documentation"),
    panel: commands_panel
  }))));
  var outer_style = {
    width: "100%",
    height: uheight,
    paddingLeft: props.controlled ? 5 : _sizing_tools.SIDE_MARGIN,
    paddingTop: 15
  };
  var outer_class = "resource-viewer-holder pane-holder";
  if (!window.in_context) {
    if (dark_theme) {
      outer_class = outer_class + " bp5-dark";
    } else {
      outer_class = outer_class + " light-theme";
    }
  }
  return /*#__PURE__*/_react["default"].createElement(_error_boundary.ErrorBoundary, null, !window.in_context && /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    dark_theme: dark_theme,
    setTheme: _setTheme,
    selected: null,
    show_api_links: true,
    page_id: props.module_viewer_id,
    user_name: window.username
  }), /*#__PURE__*/_react["default"].createElement(_menu_utilities.TacticMenubar, {
    menu_specs: menu_specs(),
    connection_status: connection_status,
    showRefresh: window.in_context,
    showClose: window.in_context,
    dark_theme: dark_theme,
    refreshTab: props.refreshTab,
    closeTab: props.closeTab,
    resource_name: _cProp("resource_name"),
    showErrorDrawerButton: true,
    toggleErrorDrawer: props.toggleErrorDrawer,
    controlled: props.controlled,
    registerOmniGetter: _registerOmniGetter,
    am_selected: props.am_selected
  }), /*#__PURE__*/_react["default"].createElement(_error_boundary.ErrorBoundary, null, /*#__PURE__*/_react["default"].createElement("div", {
    className: outer_class,
    ref: top_ref,
    style: outer_style
  }, /*#__PURE__*/_react["default"].createElement(_resizing_layouts.HorizontalPanes, {
    left_pane: left_pane,
    right_pane: right_pane,
    show_handle: true,
    available_height: uheight,
    available_width: uwidth,
    handleSplitUpdate: handleLeftPaneResize
  })), !window.in_context && /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_TacticOmnibar.TacticOmnibar, {
    omniGetters: [_omniFunction],
    page_id: props.module_viewer_id,
    showOmnibar: showOmnibar,
    closeOmnibar: _closeOmnibar,
    is_authenticated: window.is_authenticated,
    dark_theme: dark_theme,
    setTheme: _setTheme
  }), /*#__PURE__*/_react["default"].createElement(_key_trap.KeyTrap, {
    global: true,
    bindings: key_bindings.current
  }))));
}
exports.CreatorApp = CreatorApp = /*#__PURE__*/(0, _react.memo)(CreatorApp);
CreatorApp.propTypes = {
  controlled: _propTypes["default"].bool,
  am_selected: _propTypes["default"].bool,
  changeResourceName: _propTypes["default"].func,
  changeResourceTitle: _propTypes["default"].func,
  changeResourceProps: _propTypes["default"].func,
  refreshTab: _propTypes["default"].func,
  closeTab: _propTypes["default"].func,
  registerLineSetter: _propTypes["default"].func,
  updatePanel: _propTypes["default"].func,
  is_mpl: _propTypes["default"].bool,
  render_content_code: _propTypes["default"].string,
  render_content_line_number: _propTypes["default"].number,
  extra_methods_line_number: _propTypes["default"].number,
  category: _propTypes["default"].string,
  extra_functions: _propTypes["default"].string,
  draw_plot_code: _propTypes["default"].string,
  jscript_code: _propTypes["default"].string,
  tags: _propTypes["default"].array,
  notes: _propTypes["default"].string,
  icon: _propTypes["default"].string,
  option_list: _propTypes["default"].array,
  export_list: _propTypes["default"].array,
  created: _propTypes["default"].string,
  tsocket: _propTypes["default"].object,
  usable_height: _propTypes["default"].number,
  usable_width: _propTypes["default"].number
};
CreatorApp.defaultProps = {
  am_selected: true,
  controlled: false,
  changeResourceName: null,
  changeResourceTitle: null,
  changeResourceProps: null,
  registerLineSetter: null,
  refreshTab: null,
  closeTab: null,
  updatePanel: null
};
if (!window.in_context) {
  tile_creator_main();
}
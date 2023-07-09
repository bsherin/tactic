"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NotebookApp = NotebookApp;
exports.notebook_props = notebook_props;
require("../tactic_css/tactic.scss");
require("../tactic_css/tactic_console.scss");
require("../tactic_css/tactic_main.scss");
var _react = _interopRequireWildcard(require("react"));
var ReactDOM = _interopRequireWildcard(require("react-dom"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _blueprint_navbar = require("./blueprint_navbar");
var _menu_utilities = require("./menu_utilities");
var _main_menus_react = require("./main_menus_react");
var _tactic_socket = require("./tactic_socket");
var _console_component = require("./console_component");
var _toaster = require("./toaster");
var _utilities_react = require("./utilities_react");
var _TacticOmnibar = require("./TacticOmnibar");
var _key_trap = require("./key_trap");
var _communication_react = require("./communication_react");
var _export_viewer_react = require("./export_viewer_react");
var _resizing_layouts = require("./resizing_layouts");
var _error_drawer = require("./error_drawer");
var _sizing_tools = require("./sizing_tools");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
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
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
var MARGIN_SIZE = 10;
var BOTTOM_MARGIN = 20;
var MARGIN_ADJUSTMENT = 8; // This is the amount at the top of both the table and the conso
var USUAL_TOOLBAR_HEIGHT = 50;
var MENU_BAR_HEIGHT = 30; // will only appear when in context

var tsocket;
var ppi;
function main_main() {
  function gotProps(the_props) {
    var NotebookAppPlus = (0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(NotebookApp));
    var the_element = /*#__PURE__*/_react["default"].createElement(NotebookAppPlus, _extends({}, the_props, {
      controlled: false,
      initial_theme: window.theme,
      changeName: null
    }));
    var domContainer = document.querySelector('#main-root');
    ReactDOM.render(the_element, domContainer);
  }
  (0, _utilities_react.renderSpinnerMessage)("Starting up ...");
  var target = window.is_new_notebook ? "new_notebook_in_context" : "main_project_in_context";
  var resource_name = window.is_new_notebook ? "" : window.project_name;
  var post_data = {
    "resource_name": resource_name
  };
  if (window.is_new_notebook) {
    post_data.temp_data_id = window.temp_data_id;
  }
  (0, _communication_react.postAjaxPromise)(target, post_data).then(function (data) {
    notebook_props(data, null, gotProps);
  });
}
function notebook_props(data, registerDirtyMethod, finalCallback, registerOmniFunction) {
  ppi = (0, _utilities_react.get_ppi)();
  var main_id = data.main_id;
  if (!window.in_context) {
    window.main_id = main_id;
  }
  tsocket = new _tactic_socket.TacticSocket("main", 5000, main_id, function (response) {
    tsocket.socket.on("remove-ready-block", readyListener);
    tsocket.socket.emit('client-ready', {
      "room": main_id,
      "user_id": window.user_id,
      "participant": "client",
      "rb_id": data.ready_block_id,
      "main_id": main_id
    });
  });
  tsocket.socket.on('finish-post-load', _finish_post_load_in_context);
  function readyListener() {
    _everyone_ready_in_context(finalCallback);
  }
  var is_totally_new = !data.is_jupyter && !data.is_project && data.temp_data_id == "";
  var opening_from_temp_id = data.temp_data_id != "";
  window.addEventListener("unload", function sendRemove() {
    console.log("got the beacon");
    navigator.sendBeacon("/remove_mainwindow", JSON.stringify({
      "main_id": main_id
    }));
  });
  function _everyone_ready_in_context() {
    if (!window.in_context) {
      (0, _utilities_react.renderSpinnerMessage)("Everyone is ready, initializing...");
    }
    tsocket.socket.off("remove-ready-block", readyListener);
    tsocket.attachListener('handle-callback', function (task_packet) {
      (0, _communication_react.handleCallback)(task_packet, main_id);
    });
    window.base_figure_url = data.base_figure_url;
    var data_dict = {
      "doc_type": "notebook",
      "base_figure_url": data.base_figure_url,
      "user_id": window.user_id,
      "ppi": ppi
    };
    if (is_totally_new) {
      (0, _communication_react.postWithCallback)(main_id, "initialize_mainwindow", data_dict, _finish_post_load_in_context, null, main_id);
    } else {
      if (data.is_jupyter) {
        data_dict["doc_type"] = "jupyter";
        data_dict["project_name"] = data.project_name;
      } else if (data.is_project) {
        data_dict["project_name"] = data.project_name;
      } else {
        data_dict["unique_id"] = data.temp_data_id;
      }
      (0, _communication_react.postWithCallback)(main_id, "initialize_project_mainwindow", data_dict, null, null, main_id);
    }
  }
  function _finish_post_load_in_context(fdata) {
    if (!window.in_context) {
      (0, _utilities_react.renderSpinnerMessage)("Creating the page...");
    }
    tsocket.socket.off("finish-post-load", _finish_post_load_in_context);
    var interface_state;
    if (data.is_project || opening_from_temp_id) {
      interface_state = fdata.interface_state;
    }
    var domContainer = document.querySelector('#main-root');
    if (data.is_project || opening_from_temp_id) {
      finalCallback({
        is_project: true,
        main_id: main_id,
        resource_name: data.project_name,
        tsocket: tsocket,
        interface_state: interface_state,
        is_notebook: true,
        is_juptyer: data.is_jupyter,
        initial_theme: window.theme,
        registerDirtyMethod: registerDirtyMethod,
        registerOmniFunction: registerOmniFunction
      });
    } else {
      finalCallback({
        is_project: false,
        main_id: main_id,
        resource_name: data.project_name,
        tsocket: tsocket,
        interface_state: null,
        is_notebook: true,
        is_juptyer: data.is_jupyter,
        initial_theme: window.theme,
        registerDirtyMethod: registerDirtyMethod,
        registerOmniFunction: registerOmniFunction
      });
    }
  }
}
var save_attrs = ["console_items", "show_exports_pane", "console_width_fraction"];
var controllable_props = ["is_project", "resource_name", "usable_width", "usable_height"];
function NotebookApp(props) {
  var last_save = (0, _react.useRef)({});
  var main_outer_ref = (0, _react.useRef)(null);
  var omniGetters = (0, _react.useRef)({});
  var key_bindings = (0, _react.useRef)([["ctrl+space"], _showOmnibar]);
  var updateExportsList = (0, _react.useRef)(null);
  var height_adjustment = (0, _react.useRef)(props.controlled ? MENU_BAR_HEIGHT : 0);
  var _useState = (0, _react.useState)(function () {
      return (0, _sizing_tools.getUsableDimensions)(true).usable_height_no_bottom;
    }),
    _useState2 = _slicedToArray(_useState, 2),
    usable_height = _useState2[0],
    set_usable_height = _useState2[1];
  var _useState3 = (0, _react.useState)(function () {
      return (0, _sizing_tools.getUsableDimensions)(true).usable_width - 170;
    }),
    _useState4 = _slicedToArray(_useState3, 2),
    usable_width = _useState4[0],
    set_usable_width = _useState4[1];
  var console_items_ref = (0, _react.useRef)([]);

  // const [console_items, set_console_items, console_items_ref] =
  //     useStateAndRe(props.is_project ? props.interface_state["console_items"] : []);
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)(false),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    console_is_shrunk = _useStateAndRef2[0],
    set_console_is_shrunk = _useStateAndRef2[1],
    console_is_shrunk_ref = _useStateAndRef2[2];
  var _useStateAndRef3 = (0, _utilities_react.useStateAndRef)(true),
    _useStateAndRef4 = _slicedToArray(_useStateAndRef3, 3),
    console_is_zoomed = _useStateAndRef4[0],
    set_console_is_zoomed = _useStateAndRef4[1],
    console_is_zoomed_ref = _useStateAndRef4[2];
  var _useState5 = (0, _react.useState)(true),
    _useState6 = _slicedToArray(_useState5, 2),
    show_exports_pane = _useState6[0],
    set_show_exports_pane = _useState6[1];
  var _useState7 = (0, _react.useState)(.5),
    _useState8 = _slicedToArray(_useState7, 2),
    console_width_fraction = _useState8[0],
    set_console_width_fraction = _useState8[1];

  // These will only be used if not controlled
  var _useState9 = (0, _react.useState)(true),
    _useState10 = _slicedToArray(_useState9, 2),
    sdark_theme = _useState10[0],
    set_dark_theme = _useState10[1];
  var _useState11 = (0, _react.useState)(""),
    _useState12 = _slicedToArray(_useState11, 2),
    sresource_name = _useState12[0],
    set_sresource_name = _useState12[1];
  var _useState13 = (0, _react.useState)(false),
    _useState14 = _slicedToArray(_useState13, 2),
    showOmnibar = _useState14[0],
    setShowOmnibar = _useState14[1];
  var _useState15 = (0, _react.useState)(false),
    _useState16 = _slicedToArray(_useState15, 2),
    is_project = _useState16[0],
    set_is_project = _useState16[1];
  function itemsReducer(console_items, action) {
    var _new_items;
    var new_items;
    switch (action.type) {
      case "initialize":
        new_items = action.new_items;
        break;
      case "delete_item":
        new_items = console_items.filter(function (t) {
          return t.unique_id !== action.unique_id;
        });
        break;
      case "delete_items":
        new_items = console_items.filter(function (t) {
          return !action.id_list.includes(t.unique_id);
        });
        break;
      case "delete_all_items":
        new_items = [];
        break;
      case "reset":
        new_items = console_items.map(function (t) {
          if (t.type != "code") {
            return t;
          } else {
            var new_t = _objectSpread({}, t);
            new_t.output_text = "";
            new_t.execution_count = 0;
            return new_t;
          }
        });
        break;
      case "replace_item":
        new_items = console_items.map(function (t) {
          if (t.unique === action.unique_id) {
            return action.new_item;
          } else {
            return t;
          }
        });
        break;
      case "clear_all_selected":
        new_items = console_items.map(function (t) {
          var new_t = _objectSpread({}, t);
          new_t.am_selected = false;
          new_t.search_string = null;
          return new_t;
        });
        break;
      case "change_item_value":
        new_items = console_items.map(function (t) {
          if (t.unique_id === action.unique_id) {
            var new_t = _objectSpread({}, t);
            new_t[action.field] = action.new_value;
            return new_t;
          } else {
            return t;
          }
        });
        break;
      case "update_items":
        new_items = console_items.map(function (t) {
          if (t.unique_id in action.updates) {
            var update_dict = action.updates[t.unique_id];
            return _objectSpread(_objectSpread({}, t), update_dict);
          } else {
            return t;
          }
        });
        break;
      case "add_at_index":
        new_items = _toConsumableArray(console_items);
        (_new_items = new_items).splice.apply(_new_items, [action.insert_index, 0].concat(_toConsumableArray(action.new_items)));
        break;
      case "open_listed_dividers":
        new_items = console_items.map(function (t) {
          if (t.type == "divider" && t.divider_list.includes(t.unique_id)) {
            var new_t = _objectSpread({}, t);
            new_t.am_shurnk = false;
            return new_t;
          } else {
            return t;
          }
        });
        break;
      case "close_all_dividers":
        new_items = console_items.map(function (t) {
          if (t.type == "divider") {
            var new_t = _objectSpread({}, t);
            new_t.am_shurnk = true;
            return new_t;
          } else {
            return t;
          }
        });
        break;
      default:
        console.log("Got Unknown action: " + action.type);
        return _toConsumableArray(console_items);
    }
    console_items_ref.current = new_items;
    return new_items;
  }
  var _useReducer = (0, _react.useReducer)(itemsReducer, []),
    _useReducer2 = _slicedToArray(_useReducer, 2),
    console_items = _useReducer2[0],
    dispatch = _useReducer2[1];
  var stateSetters = (0, _react.useRef)({
    show_exports_pane: set_show_exports_pane,
    console_width_fraction: set_console_width_fraction,
    console_is_shrunk: set_console_is_shrunk,
    console_is_zoomed: set_console_is_zoomed
  });
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  (0, _utilities_react.useConstructor)(function () {
    console_items_ref.current = console_items;
    set_show_exports_pane(props.is_project ? props.interface_state["show_exports_pane"] : true);
    set_console_width_fraction(props.is_project ? props.interface_state["console_width_fraction"] : .5);
    set_dark_theme(props.initial_theme === "dark");
    set_sresource_name(props.resource_name);
    set_is_project(props.is_project);
    dispatch({
      type: "initialize",
      new_items: props.is_project ? props.interface_state["console_items"] : []
    });
  });
  (0, _react.useEffect)(function () {
    initSocket();
    if (props.controlled) {
      props.registerDirtyMethod(_dirty);
    } else {
      window.addEventListener("beforeunload", function (e) {
        if (self._dirty()) {
          e.preventDefault();
          e.returnValue = '';
        }
      });
    }
    if (props.registerOmniFunction) {
      props.registerOmniFunction(_omniFunction);
    }
    _updateLastSave();
    props.stopSpinner();
    if (!props.controlled) {
      document.title = sresource_name;
      window.dark_theme = dark_theme;
      window.addEventListener("resize", _update_window_dimensions);
      _update_window_dimensions();
    }
    return function () {
      tsocket.disconnect();
      delete_my_containers();
    };
  }, []);
  function cPropGetters() {
    return {
      usable_width: usable_width,
      usable_height: usable_height,
      resource_name: sresource_name,
      is_project: is_project
    };
  }
  function _cProp(pname) {
    return props.controlled ? props[pname] : cPropGetters()[pname];
  }
  function interface_state() {
    return {
      console_items: console_items,
      show_exports_pane: show_exports_pane,
      console_width_fraction: console_width_fraction
    };
  }
  function _setMainStateValue(field_name, new_value) {
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    // console.log(`field_name is ${field_name} new_value is ${String(new_value)}`);
    stateSetters.current[field_name](new_value);
    pushCallback(callback);
  }
  function _update_window_dimensions() {
    var uwidth;
    var uheight;
    if (main_outer_ref && main_outer_ref.current) {
      uheight = window.innerHeight - main_outer_ref.current.offsetTop;
      uwidth = window.innerWidth - main_outer_ref.current.offsetLeft;
    } else {
      uheight = window.innerHeight - USUAL_TOOLBAR_HEIGHT;
      uwidth = window.innerWidth - 2 * MARGIN_SIZE;
    }
    set_usable_height(uheight);
    set_usable_width(uwidth);
  }
  function _updateLastSave() {
    last_save.current = interface_state();
  }
  function _dirty() {
    var current_state = interface_state();
    for (var k in current_state) {
      if (current_state[k] != last_save.current[k]) {
        return true;
      }
    }
    return false;
  }
  function delete_my_containers() {
    (0, _communication_react.postAjax)("/remove_mainwindow", {
      "main_id": props.main_id
    });
  }
  function initSocket() {
    var self = this;
    props.tsocket.attachListener("window-open", function (data) {
      window.open("".concat($SCRIPT_ROOT, "/load_temp_page/").concat(data["the_id"]));
    });
    props.tsocket.attachListener("doFlash", function (data) {
      (0, _toaster.doFlash)(data);
    });
    if (!window.in_context) {
      props.tsocket.attachListener("doFlashUser", function (data) {
        (0, _toaster.doFlash)(data);
      });
      props.tsocket.attachListener('close-user-windows', function (data) {
        if (!(data["originator"] == main_id)) {
          window.close();
        }
      });
    }
  }
  function _setTheme(dark_theme) {
    set_dark_theme(dark_theme);
    pushCallback(function () {
      window.dark_theme = dark_theme;
    });
  }
  function _broadcast_event_to_server(event_name, data_dict, callback) {
    data_dict.main_id = props.main_id;
    data_dict.event_name = event_name;
    (0, _communication_react.postWithCallback)(props.main_id, "distribute_events_stub", data_dict, callback, null, props.main - id);
  }
  function _handleConsoleFractionChange(left_width, right_width, new_fraction) {
    set_console_width_fraction(new_fraction);
  }
  function _setProjectName(new_project_name) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    if (props.controlled) {
      props.updatePanel({
        res_type: "project",
        title: new_project_name,
        panel: {
          resource_name: new_project_name,
          is_project: true
        }
      }, function () {
        pushCallback(callback);
      });
    } else {
      set_sresource_name(new_project_name);
      set_is_project(true);
      pushCallback(callback);
    }
  }
  function get_zoomed_console_height() {
    if (main_outer_ref.current) {
      return _cProp("usable_height") - height_adjustment.current - BOTTOM_MARGIN;
    } else {
      return _cProp("usable_height") - height_adjustment.current - 50;
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
  var actual_dark_theme = props.controlled ? props.dark_theme : sdark_theme;
  var my_props = _objectSpread({}, props);
  if (!props.controlled) {
    my_props.resource_name = sresource_name;
    my_props.usable_height = usable_height;
    my_props.usable_width = usable_width;
    my_props.is_project = is_project;
  }
  var true_usable_width = my_props.usable_width;
  var console_available_height = get_zoomed_console_height() - MARGIN_ADJUSTMENT;
  var project_name = my_props.is_project ? props.resource_name : "";
  var menus = /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_main_menus_react.ProjectMenu, _extends({}, props.statusFuncs, {
    main_id: props.main_id,
    project_name: project_name,
    is_notebook: true,
    is_juptyer: props.is_jupyter,
    setProjectName: _setProjectName,
    postAjaxFailure: props.postAjaxFailure,
    console_items: console_items_ref.current,
    interface_state: interface_state(),
    updateLastSave: _updateLastSave,
    changeCollection: null,
    disabled_items: my_props.is_project ? [] : ["Save"],
    registerOmniGetter: _registerOmniGetter,
    hidden_items: ["Open Console as Notebook", "Export Table as Collection", "divider2", "Change collection"]
  })));
  var console_pane = /*#__PURE__*/_react["default"].createElement(_console_component.ConsoleComponent, _extends({}, props.statusFuncs, {
    main_id: props.main_id,
    tsocket: props.tsocket,
    dark_theme: actual_dark_theme,
    handleCreateViewer: props.handleCreateViewer,
    controlled: props.controlled,
    am_selected: props.am_selected,
    pushCallback: pushCallback,
    console_items: console_items_ref,
    dispatch: dispatch,
    console_is_shrunk: false,
    console_is_zoomed: true,
    show_exports_pane: show_exports_pane,
    setMainStateValue: _setMainStateValue,
    console_available_height: console_available_height - MARGIN_SIZE,
    console_available_width: true_usable_width * console_width_fraction - 16,
    zoomable: false,
    shrinkable: false,
    style: {
      marginTop: MARGIN_SIZE
    }
  }));
  var exports_pane;
  if (show_exports_pane) {
    exports_pane = /*#__PURE__*/_react["default"].createElement(_export_viewer_react.ExportsViewer, {
      main_id: props.main_id,
      tsocket: props.tsocket,
      setUpdate: function setUpdate(ufunc) {
        updateExportsList.current = ufunc;
      },
      setMainStateValue: _setMainStateValue,
      available_height: console_available_height - MARGIN_SIZE,
      console_is_shrunk: false,
      console_is_zoomed: true,
      style: {
        marginTop: MARGIN_SIZE
      }
    });
  } else {
    exports_pane = /*#__PURE__*/_react["default"].createElement("div", null);
  }
  var outer_class = "main-outer";
  if (actual_dark_theme) {
    outer_class = outer_class + " bp5-dark";
  } else {
    outer_class = outer_class + " light-theme";
  }
  var outer_style = {
    width: "100%",
    height: my_props.usable_height - height_adjustment.current
  };
  var stheme = props.controlled ? props.setTheme : _setTheme;
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, !window.in_context && /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    dark_theme: actual_dark_theme,
    setTheme: stheme,
    user_name: window.username,
    menus: null,
    page_id: props.main_id
  }), /*#__PURE__*/_react["default"].createElement(_menu_utilities.TacticMenubar, {
    dark_theme: actual_dark_theme,
    menus: menus,
    showRefresh: true,
    showClose: true,
    page_id: props.main_id,
    refreshTab: props.refreshTab,
    closeTab: props.closeTab,
    resource_name: _cProp("resource_name"),
    showErrorDrawerButton: true,
    toggleErrorDrawer: props.toggleErrorDrawer
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: outer_class,
    ref: main_outer_ref,
    style: outer_style
  }, /*#__PURE__*/_react["default"].createElement(_resizing_layouts.HorizontalPanes, {
    left_pane: console_pane,
    right_pane: exports_pane,
    show_handle: true,
    available_height: console_available_height,
    available_width: true_usable_width,
    initial_width_fraction: console_width_fraction,
    controlled: true,
    dragIconSize: 15,
    handleSplitUpdate: _handleConsoleFractionChange
  })), !window.in_context && /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_TacticOmnibar.TacticOmnibar, {
    omniGetters: [_omniFunction],
    showOmnibar: showOmnibar,
    closeOmnibar: _closeOmnibar
  }), /*#__PURE__*/_react["default"].createElement(_key_trap.KeyTrap, {
    global: true,
    bindings: key_bindings.current
  })));
}
exports.NotebookApp = NotebookApp = /*#__PURE__*/(0, _react.memo)(NotebookApp);
NotebookApp.propTypes = {
  console_items: _propTypes["default"].array,
  console_component: _propTypes["default"].object,
  is_project: _propTypes["default"].bool,
  interface_state: _propTypes["default"].object,
  refreshTab: _propTypes["default"].func,
  closeTab: _propTypes["default"].func
};
NotebookApp.defaultProps = {
  refreshTab: null,
  closeTab: null
};
if (!window.in_context) {
  main_main();
}
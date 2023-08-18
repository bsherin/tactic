"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MainApp = MainApp;
require("../tactic_css/tactic.scss");
require("../tactic_css/tactic_main.scss");
require("../tactic_css/tactic_table.scss");
require("../tactic_css/tactic_console.scss");
require("../tactic_css/tactic_select.scss");
var _react = _interopRequireWildcard(require("react"));
var ReactDOM = _interopRequireWildcard(require("react-dom"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
var _table = require("@blueprintjs/table");
var _lodash = _interopRequireDefault(require("lodash"));
var _main_support = require("./main_support");
var _blueprint_navbar = require("./blueprint_navbar");
var _menu_utilities = require("./menu_utilities");
var _table_react = require("./table_react");
var _blueprint_table = require("./blueprint_table");
var _resizing_layouts = require("./resizing_layouts");
var _main_menus_react = require("./main_menus_react");
var _tile_react = require("./tile_react");
var _export_viewer_react = require("./export_viewer_react");
var _modal_react = require("./modal_react");
var _console_component = require("./console_component");
var _console_support = require("./console_support");
var _communication_react = require("./communication_react");
var _toaster = require("./toaster");
var _error_drawer = require("./error_drawer");
var _utilities_react = require("./utilities_react");
var _sizing_tools = require("./sizing_tools");
var _error_boundary = require("./error_boundary");
var _TacticOmnibar = require("./TacticOmnibar");
var _key_trap = require("./key_trap");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
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
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var MARGIN_SIZE = 0;
var BOTTOM_MARGIN = 30; // includes space for status messages at bottom
var MARGIN_ADJUSTMENT = 8; // This is the amount at the top of both the table and the console
var CONSOLE_HEADER_HEIGHT = 35;
var EXTRA_TABLE_AREA_SPACE = 500;
var USUAL_TOOLBAR_HEIGHT = 50;
var MENU_BAR_HEIGHT = 30; // will only appear when in context

var iStateDefaults = {
  table_is_shrunk: false,
  tile_list: [],
  console_items: [],
  console_width_fraction: .5,
  horizontal_fraction: .65,
  console_is_shrunk: true,
  height_fraction: .85,
  show_exports_pane: true,
  show_console_pane: true,
  console_is_zoomed: false
};
function MainApp(props) {
  function iStateOrDefault(pname) {
    if (props.is_project) {
      if ("interface_state" in props && props.interface_state && pname in props.interface_state) {
        return props.interface_state[pname];
      }
    }
    return iStateDefaults[pname];
  }
  var key_bindings = [[["ctrl+space"], _showOmnibar]];
  var last_save = (0, _react.useRef)({});
  var resizing = (0, _react.useRef)(false);
  var updateExportsList = (0, _react.useRef)(null);
  var omniGetters = (0, _react.useRef)({});
  var height_adjustment = (0, _react.useRef)(0);
  var table_container_ref = (0, _react.useRef)(null);
  var tile_div_ref = (0, _react.useRef)(null);
  var tbody_ref = (0, _react.useRef)(null);
  var main_outer_ref = (0, _react.useRef)(null);
  var set_table_scroll = (0, _react.useRef)(null);
  var _useReducerAndRef = (0, _utilities_react.useReducerAndRef)(_console_support.consoleItemsReducer, iStateOrDefault("console_items")),
    _useReducerAndRef2 = _slicedToArray(_useReducerAndRef, 3),
    console_items = _useReducerAndRef2[0],
    dispatch = _useReducerAndRef2[1],
    console_items_ref = _useReducerAndRef2[2];
  var _useReducerAndRef3 = (0, _utilities_react.useReducerAndRef)(_tile_react.tilesReducer, iStateOrDefault("tile_list")),
    _useReducerAndRef4 = _slicedToArray(_useReducerAndRef3, 3),
    tile_list = _useReducerAndRef4[0],
    tileDispatch = _useReducerAndRef4[1],
    tile_list_ref = _useReducerAndRef4[2];
  var _useReducer = (0, _react.useReducer)(_main_support.mainReducer, {
      table_is_shrunk: iStateOrDefault("table_is_shrunk"),
      console_width_fraction: iStateOrDefault("console_width_fraction"),
      horizontal_fraction: iStateOrDefault("console_width_fraction"),
      height_fraction: iStateOrDefault("height_fraction"),
      console_is_shrunk: iStateOrDefault("console_is_shrunk"),
      console_is_zoomed: iStateOrDefault("console_is_zoomed"),
      show_exports_pane: iStateOrDefault("show_exports_pane"),
      show_console_pane: iStateOrDefault("show_console_pane"),
      table_spec: props.initial_table_spec,
      data_text: props.is_freeform ? props.initial_data_text : null,
      data_row_dict: props.is_freeform ? null : props.initial_data_row_dict,
      total_rows: props.is_freeform ? null : props.total_rows,
      doc_names: props.initial_doc_names,
      short_collection_name: props.short_collection_name,
      tile_types: props.initial_tile_types,
      tile_icon_dict: props.initial_tile_icon_dict,
      alt_search_text: null,
      selected_column: null,
      selected_row: null,
      selected_regions: [],
      table_is_filtered: false,
      search_text: "",
      soft_wrap: false,
      show_table_spinner: false,
      cells_to_color_text: {},
      spreadsheet_mode: false,
      // These will maybe only be used if not controlled
      dark_theme: props.initial_theme === "dark",
      resource_name: props.resource_name,
      showOmnibar: false,
      is_project: props.is_project,
      usable_height: (0, _sizing_tools.getUsableDimensions)(true).usable_height_no_bottom,
      usable_width: (0, _sizing_tools.getUsableDimensions)(true).usable_width - 170
    }),
    _useReducer2 = _slicedToArray(_useReducer, 2),
    mState = _useReducer2[0],
    mDispatch = _useReducer2[1];
  var connection_status = (0, _utilities_react.useConnection)(props.tsocket, initSocket);
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  (0, _react.useEffect)(function () {
    if (props.controlled) {
      props.registerDirtyMethod(_dirty);
      height_adjustment.current = MENU_BAR_HEIGHT;
    } else {
      window.addEventListener("beforeunload", function (e) {
        if (_dirty()) {
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
      document.title = mState.resource_name;
      window.dark_theme = mState.dark_theme;
      window.addEventListener("resize", _update_window_dimensions);
      _update_window_dimensions();
    }
    return function () {
      delete_my_containers();
    };
  }, []);
  (0, _react.useEffect)(function () {
    var data = {
      active_row_id: mState.selected_row,
      doc_name: mState.table_spec.current_doc_name
    };
    _broadcast_event_to_server("MainTableRowSelect", data);
  }, [mState.selected_row]);
  function _cProp(pname) {
    return props.controlled ? props[pname] : mState[pname];
  }
  var save_state = {
    tile_list: tile_list,
    console_items: console_items,
    table_is_shrunk: mState.table_is_shrunk,
    console_width_fraction: mState.console_width_fraction,
    horizontal_fraction: mState.horizontal_fraction,
    console_is_shrunk: mState.console_is_shrunk,
    height_fraction: mState.height_fraction,
    show_exports_pane: mState.show_exports_pane,
    show_console_pane: mState.show_console_pane,
    console_is_zoomed: mState.console_is_zoomed
  };

  // This will only be called if not controlled
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
    mDispatch({
      type: "change_multiple_fields",
      newPartialState: {
        usable_height: uheight,
        usable_width: uwidth
      }
    });
  }
  function _updateLastSave() {
    last_save.current = save_state;
  }
  function _dirty() {
    var current_state = save_state;
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
  function _update_menus_listener(data) {
    (0, _communication_react.postWithCallback)("host", "get_tile_types", {
      "user_id": window.user_id
    }, function (data) {
      mDispatch({
        type: "change_multiple_fields",
        newPartialState: {
          tile_types: data.tile_types,
          tile_icon_dict: data.icon_dict
        }
      });
    }), null, props.main_id;
  }
  function _change_doc_listener(data) {
    if (data.main_id == props.main_id) {
      var row_id = data.hasOwnProperty("row_id") ? data.row_id : null;
      var scroll_to_row = data.hasOwnProperty("scroll_to_row") ? data.scroll_to_row : true;
      var select_row = data.hasOwnProperty("select_row") ? data.select_row : true;
      if (mState.table_is_shrunk) {
        _setMainStateValue("table_is_shrunk", false);
      }
      _handleChangeDoc(data.doc_name, row_id, scroll_to_row, select_row);
    }
  }
  function initSocket() {
    props.tsocket.attachListener("window-open", function (data) {
      window.open("".concat($SCRIPT_ROOT, "/load_temp_page/").concat(data["the_id"]));
    });
    props.tsocket.attachListener("doFlash", function (data) {
      (0, _toaster.doFlash)(data);
    });
    if (!window.in_context) {
      props.tsocket.attachListener('close-user-windows', function (data) {
        if (!(data["originator"] == main_id)) {
          window.close();
        }
      });
      props.tsocket.attachListener("notebook-open", function (data) {
        window.open($SCRIPT_ROOT + "/new_notebook_with_data/" + data.temp_data_id);
      });
      props.tsocket.attachListener("doFlashUser", function (data) {
        (0, _toaster.doFlash)(data);
      });
    } else {
      props.tsocket.attachListener("notebook-open", function (data) {
        var the_view = "".concat($SCRIPT_ROOT, "/new_notebook_in_context");
        (0, _communication_react.postAjaxPromise)(the_view, {
          temp_data_id: data.temp_data_id,
          resource_name: ""
        }).then(props.handleCreateViewer)["catch"](_toaster.doFlash);
      });
    }
    props.tsocket.attachListener('table-message', _handleTableMessage);
    props.tsocket.attachListener("update-menus", _update_menus_listener);
    props.tsocket.attachListener('change-doc', _change_doc_listener);
    props.tsocket.attachListener('handle-callback', function (task_packet) {
      (0, _communication_react.handleCallback)(task_packet, props.main_id);
    });
  }
  function setTheme(dark_theme) {
    _setMainStateValue("dark_theme", dark_theme);
    pushCallback(function () {
      window.dark_theme = dark_theme;
    });
  }

  // Every item in tile_list is a list of this form
  function _createTileEntry(tile_name, tile_type, tile_id, form_data) {
    return {
      tile_name: tile_name,
      tile_type: tile_type,
      tile_id: tile_id,
      form_data: form_data,
      tile_height: 345,
      tile_width: 410,
      show_form: false,
      show_spinner: false,
      source_changed: false,
      javascript_code: null,
      javascript_arg_dict: null,
      show_log: false,
      log_content: "",
      log_since: null,
      max_console_lines: 100,
      shrunk: false,
      finished_loading: true,
      front_content: ""
    };
  }
  function _setMainStateValue(field_name) {
    var new_value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    if (_typeof(field_name) == "object") {
      mDispatch({
        type: "change_multiple_fields",
        newPartialState: field_name
      });
      pushCallback(callback);
    } else {
      mDispatch({
        type: "change_field",
        field: field_name,
        new_value: new_value
      });
      pushCallback(callback);
    }
  }
  function _handleSearchFieldChange(lsearch_text) {
    mDispatch({
      type: "change_multiple_fields",
      newPartialState: {
        search_text: lsearch_text,
        alt_search_text: null
      }
    });
    if (lsearch_text == null && !props.is_freeform) {
      _setMainStateValue("cells_to_color_text", {});
    }
  }
  function _handleSpreadsheetModeChange(event) {
    _setMainStateValue("spreadsheet_mode", event.target.checked);
  }
  function _handleSoftWrapChange(event) {
    _setMainStateValue("soft_wrap", event.target.checked);
  }
  function _setAltSearchText(the_text) {
    _setMainStateValue("alt_search_text", the_text);
  }
  function _handleChangeDoc(new_doc_name) {
    var row_index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var scroll_to_row = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var select_row = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    _setMainStateValue("show_table_spinner", true);
    if (props.is_freeform) {
      (0, _communication_react.postWithCallback)(props.main_id, "grab_freeform_data", {
        "doc_name": new_doc_name,
        "set_visible_doc": true
      }, function (data) {
        props.stopSpinner();
        props.clearStatusMessage();
        var new_table_spec = {
          "current_doc_name": new_doc_name
        };
        mDispatch({
          type: "change_multiple_fields",
          newPartialState: {
            data_text: data.data_text,
            table_spec: new_table_spec,
            visible_doc: new_doc_name
          }
        });
        pushCallback(function () {
          _setMainStateValue("show_table_spinner", false);
        });
      }, null, props.main_id);
    } else {
      var data_dict = {
        "doc_name": new_doc_name,
        "row_index": row_index,
        "set_visible_doc": true
      };
      (0, _communication_react.postWithCallback)(props.main_id, "grab_chunk_by_row_index", data_dict, function (data) {
        _setStateFromDataObject(data, new_doc_name, function () {
          _setMainStateValue("show_table_spinner", false);
          if (select_row) {
            _setMainStateValue({
              selected_regions: [_table.Regions.row(row_index)],
              selected_row: row_index,
              selected_column: null
            }, null);
          }
          if (scroll_to_row) {
            set_table_scroll.current = row_index;
          }
        });
      }, null, props.main_id);
    }
  }
  function _handleVerticalSplitUpdate(top_height, bottom_height, top_fraction) {
    _setMainStateValue("height_fraction", top_fraction);
  }
  function _updateTableSpec(spec_update) {
    var broadcast = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    mDispatch({
      type: "update_table_spec",
      spec_update: spec_update
    });
    if (broadcast) {
      spec_update["doc_name"] = mState.table_spec.current_doc_name;
      (0, _communication_react.postWithCallback)(props.main_id, "UpdateTableSpec", spec_update, null, null, props.main_id);
    }
  }
  function _broadcast_event_to_server(event_name, data_dict, callback) {
    data_dict.main_id = props.main_id;
    data_dict.event_name = event_name;
    if (!("doc_name" in data_dict)) {
      data_dict.doc_name = mState.table_spec.current_doc_name;
    }
    (0, _communication_react.postWithCallback)(props.main_id, "distribute_events_stub", data_dict, callback, null, props.main_id);
  }
  function _tile_command(menu_id) {
    var existing_tile_names = [];
    var _iterator = _createForOfIteratorHelper(tile_list),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var tile_entry = _step.value;
        existing_tile_names.push(tile_entry.tile_name);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    (0, _modal_react.showModalReact)("Create " + menu_id, "New Tile Name", createNewTile, menu_id, existing_tile_names);
    function createNewTile(tile_name) {
      props.startSpinner();
      props.statusMessage("Creating Tile " + tile_name);
      var data_dict = {
        tile_name: tile_name,
        tile_type: menu_id,
        user_id: window.user_id,
        parent: props.main_id
      };
      (0, _communication_react.postWithCallback)(props.main_id, "create_tile", data_dict, function (create_data) {
        if (create_data.success) {
          var new_tile_entry = _createTileEntry(tile_name, menu_id, create_data.tile_id, create_data.form_data);
          tileDispatch({
            type: "add_at_index",
            insert_index: tile_list.length,
            new_item: new_tile_entry
          });
          if (updateExportsList.current) updateExportsList.current();
          props.clearStatusMessage();
          props.stopSpinner();
        } else {
          props.addErrorDrawerEntry({
            title: "Error creating tile",
            content: create_data
          });
        }
      }, null, props.main_id);
    }
  }
  function _showOmnibar() {
    _setMainStateValue("showOmnibar", true);
  }
  function _closeOmnibar() {
    _setMainStateValue("showOmnibar", false);
  }
  function _omniFunction() {
    var omni_items = [];
    for (var ogetter in omniGetters.current) {
      omni_items = omni_items.concat(omniGetters.current[ogetter]());
    }
    omni_items = omni_items.concat(_getTileOmniItems());
    return omni_items;
  }
  function _registerOmniGetter(name, the_function) {
    omniGetters.current[name] = the_function;
  }
  function _getTileOmniItems() {
    var omni_items = [];
    var sorted_categories = _toConsumableArray(Object.keys(mState.tile_types));
    sorted_categories.sort();
    var _iterator2 = _createForOfIteratorHelper(sorted_categories),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var category = _step2.value;
        var sorted_types = _toConsumableArray(mState.tile_types[category]);
        sorted_types.sort();
        var _iterator3 = _createForOfIteratorHelper(sorted_types),
          _step3;
        try {
          var _loop = function _loop() {
            var ttype = _step3.value;
            omni_items.push({
              category: category,
              display_text: ttype,
              search_text: ttype,
              icon_name: mState.tile_icon_dict[ttype],
              the_function: function the_function() {
                return _tile_command(ttype);
              }
            });
          };
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            _loop();
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    return omni_items;
  }
  function create_tile_menus() {
    var menu_items = [];
    var sorted_categories = _toConsumableArray(Object.keys(mState.tile_types));
    sorted_categories.sort();
    var _iterator4 = _createForOfIteratorHelper(sorted_categories),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var category = _step4.value;
        var option_dict = {};
        var icon_dict = {};
        var sorted_types = _toConsumableArray(mState.tile_types[category]);
        sorted_types.sort();
        var _iterator5 = _createForOfIteratorHelper(sorted_types),
          _step5;
        try {
          var _loop2 = function _loop2() {
            var ttype = _step5.value;
            option_dict[ttype] = function () {
              return _tile_command(ttype);
            };
            icon_dict[ttype] = mState.tile_icon_dict[ttype];
          };
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            _loop2();
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }
        menu_items.push( /*#__PURE__*/_react["default"].createElement(_main_menus_react.MenuComponent, {
          menu_name: category,
          option_dict: option_dict,
          binding_dict: {},
          icon_dict: icon_dict,
          disabled_items: [],
          key: category
        }));
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
    return menu_items;
  }
  function _toggleTableShrink() {
    _setMainStateValue("table_is_shrunk", !mState.table_is_shrunk);
  }
  function _handleHorizontalFractionChange(left_width, right_width, new_fraction) {
    _setMainStateValue("horizontal_fraction", new_fraction);
  }
  function _handleResizeStart() {
    resizing.current = true;
  }
  function _handleResizeEnd() {
    resizing.current = false;
  }
  function _handleConsoleFractionChange(left_width, right_width, new_fraction) {
    _setMainStateValue("console_width_fraction", new_fraction);
  }

  // Table doctype-only methods start here

  function _getTableBodyHeight(table_available_height) {
    if (!tbody_ref.current) {
      return table_available_height - 50;
    } else {
      var top_offset = tbody_ref.current.getBoundingClientRect().top - table_container_ref.current.getBoundingClientRect().top;
      var madjust = mState.console_is_shrunk ? 2 * MARGIN_ADJUSTMENT : MARGIN_ADJUSTMENT;
      return table_available_height - top_offset - madjust;
    }
  }
  function _setFreeformDoc(doc_name, new_content) {
    if (doc_name == mState.table_spec.current_doc_name) {
      _setMainStateValue("data_text", new_content);
    }
  }
  function _handleTableMessage(data) {
    if (data.main_id == props.main_id) {
      var handlerDict = {
        refill_table: _refill_table,
        dehighlightAllText: function dehighlightAllText(data) {
          return _handleSearchFieldChange(null);
        },
        highlightTxtInDocument: function highlightTxtInDocument(data) {
          return _setAltSearchText(data.text_to_find);
        },
        updateNumberRows: function updateNumberRows(data) {
          return _updateNumberRows(data.doc_name, data.number_rows);
        },
        setCellContent: function setCellContent(data) {
          return _setCellContent(data.row, data.column_header, data.new_content);
        },
        colorTxtInCell: function colorTxtInCell(data) {
          return _colorTextInCell(data.row_id, data.column_header, data.token_text, data.color_dict);
        },
        setFreeformContent: function setFreeformContent(data) {
          return _setFreeformDoc(data.doc_name, data.new_content);
        },
        updateDocList: function updateDocList(data) {
          return _updateDocList(data.doc_names, data.visible_doc);
        },
        setCellBackground: function setCellBackground(data) {
          return _setCellBackgroundColor(data.row, data.column_header, data.color);
        }
      };
      handlerDict[data.table_message](data);
    }
  }
  function _setCellContent(row_id, column_header, new_content) {
    var broadcast = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    mDispatch({
      type: "set_cell_content",
      row_id: row_id,
      column_header: column_header,
      new_content: new_content
    });
    var data = {
      id: row_id,
      column_header: column_header,
      new_content: new_content,
      cellchange: false
    };
    if (broadcast) {
      _broadcast_event_to_server("SetCellContent", data, null);
    }
  }
  function _setCellBackgroundColor(row_id, column_header, color) {
    mDispatch({
      type: "set_cell_background",
      row_id: row_id,
      column_header: column_header
    });
  }
  function _colorTextInCell(row_id, column_header, token_text, color_dict) {
    mDispatch({
      type: "set_cells_to_color_text",
      row_id: row_id,
      column_header: column_header,
      token_text: token_text,
      color_dict: color_dict
    });
  }
  function _refill_table(data_object) {
    _setStateFromDataObject(data_object, data_object.doc_name);
  }
  function _moveColumn(tag_to_move, place_to_move) {
    var colnames = _toConsumableArray(mState.table_spec.column_names);
    var start_index = colnames.indexOf(tag_to_move);
    colnames.splice(start_index, 1);
    if (!place_to_move) {
      colnames.push(tag_to_move);
    } else {
      var end_index = colnames.indexOf(place_to_move);
      colnames.splice(end_index, 0, tag_to_move);
    }
    var fnames = _filteredColumnNames();
    start_index = fnames.indexOf(tag_to_move);
    fnames.splice(start_index, 1);
    var cwidths = _toConsumableArray(mState.table_spec.column_widths);
    var width_to_move = cwidths[start_index];
    cwidths.splice(start_index, 1);
    if (!place_to_move) {
      cwidths.push(width_to_move);
    } else {
      var _end_index = fnames.indexOf(place_to_move);
      cwidths.splice(_end_index, 0, width_to_move);
    }
    _updateTableSpec({
      column_names: colnames,
      column_widths: cwidths
    }, true);
  }
  function _hideColumn() {
    var hc_list = _toConsumableArray(mState.table_spec.hidden_columns_list);
    var fnames = _filteredColumnNames();
    var cname = mState.selected_column;
    var col_index = fnames.indexOf(cname);
    var cwidths = _toConsumableArray(mState.table_spec.column_widths);
    cwidths.splice(col_index, 1);
    hc_list.push(cname);
    _updateTableSpec({
      hidden_columns_list: hc_list,
      column_widths: cwidths
    }, true);
  }
  function _hideColumnInAll() {
    var hc_list = _toConsumableArray(mState.table_spec.hidden_columns_list);
    var fnames = _filteredColumnNames();
    var cname = mState.selected_column;
    var col_index = fnames.indexOf(cname);
    var cwidths = _toConsumableArray(mState.table_spec.column_widths);
    cwidths.splice(col_index, 1);
    hc_list.push(cname);
    var data_dict = {
      "column_name": mState.selected_column
    };
    _broadcast_event_to_server("HideColumnInAllDocs", data_dict, function () {
      _updateTableSpec({
        hidden_columns_list: hc_list,
        column_widths: cwidths
      }, false);
    });
  }
  function _unhideAllColumns() {
    _updateTableSpec({
      hidden_columns_list: ["__filename__"]
    }, true);
  }
  function _clearTableScroll() {
    set_table_scroll.current = null;
  }
  function _deleteRow() {
    (0, _communication_react.postWithCallback)(props.main_id, "delete_row", {
      "document_name": mState.table_spec.current_doc_name,
      "index": mState.selected_row
    }, null);
  }
  function _insertRow(index) {
    (0, _communication_react.postWithCallback)(props.main_id, "insert_row", {
      "document_name": mState.table_spec.current_doc_name,
      "index": index,
      "row_dict": {}
    }, null, null, props.main_id);
  }
  function _duplicateRow() {
    (0, _communication_react.postWithCallback)(props.main_id, "insert_row", {
      "document_name": mState.table_spec.current_doc_name,
      "index": mState.selected_row,
      "row_dict": mState.data_text[mState.selected_row]
    }, null, null, props.main_id);
  }
  function _deleteColumn() {
    var delete_in_all = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var fnames = _filteredColumnNames();
    var cname = mState.selected_column;
    var col_index = fnames.indexOf(cname);
    var cwidths = _toConsumableArray(mState.table_spec.column_widths);
    cwidths.splice(col_index, 1);
    var hc_list = _lodash["default"].without(mState.table_spec.hidden_columns_list, cname);
    var cnames = _lodash["default"].without(mState.table_spec.column_names, cname);
    _updateTableSpec({
      column_names: cnames,
      hidden_columns_list: hc_list,
      column_widths: cwidths
    }, false);
    var data_dict = {
      "column_name": cname,
      "doc_name": mState.table_spec.current_doc_name,
      "all_docs": delete_in_all
    };
    (0, _communication_react.postWithCallback)(props.main_id, "DeleteColumn", data_dict, null, null, props.main_id);
  }
  function _addColumn() {
    var add_in_all = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var title = add_in_all ? "Create Column All Documents" : "Create Column This Document";
    (0, _modal_react.showModalReact)(title, "New Column Name", function (new_name) {
      var cwidth = (0, _blueprint_table.compute_added_column_width)(new_name);
      _updateTableSpec({
        column_names: [].concat(_toConsumableArray(mState.table_spec.column_names), [new_name]),
        column_widths: [].concat(_toConsumableArray(mState.table_spec.column_widths), [cwidth])
      }, false);
      var data_dict = {
        "column_name": new_name,
        "doc_name": mState.table_spec.current_doc_name,
        "column_width": cwidth,
        "all_docs": add_in_all
      };
      _broadcast_event_to_server("CreateColumn", data_dict);
    }, "newcol", mState.table_spec.column_names);
  }
  function _setStateFromDataObject(data, doc_name) {
    var func = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    mDispatch({
      type: "change_multiple_fields",
      newPartialState: {
        data_row_dict: data.data_row_dict,
        total_rows: data.total_rows,
        table_spec: {
          column_names: data.table_spec.header_list,
          column_widths: data.table_spec.column_widths,
          hidden_columns_list: data.table_spec.hidden_columns_list,
          cell_backgrounds: data.table_spec.cell_backgrounds,
          current_doc_name: doc_name
        }
      }
    });
    pushCallback(func);
  }
  function _initiateDataGrab(row_index) {
    _grabNewChunkWithRow(row_index);
  }
  function _grabNewChunkWithRow(row_index) {
    (0, _communication_react.postWithCallback)(props.main_id, "grab_chunk_by_row_index", {
      doc_name: mState.table_spec.current_doc_name,
      row_index: row_index
    }, function (data) {
      mDispatch({
        type: "update_data_row_dict",
        new_data_row_dict: data.data_row_dict
      });
    }, null, props.main_id);
  }
  function _changeCollection() {
    props.startSpinner();
    (0, _communication_react.postWithCallback)("host", "get_collection_names", {
      "user_id": user_id
    }, function (data) {
      var option_names = data["collection_names"];
      (0, _modal_react.showSelectDialog)("Select New Collection", "New Collection", "Cancel", "Submit", changeTheCollection, option_names);
    }, null, props.main_id);
    function changeTheCollection(new_collection_name) {
      var result_dict = {
        "new_collection_name": new_collection_name,
        "main_id": props.main_id
      };
      (0, _communication_react.postWithCallback)(props.main_id, "change_collection", result_dict, changeCollectionResult, null, props.main_id);
      function changeCollectionResult(data_object) {
        if (data_object.success) {
          if (!window.in_context && !_cProp("is_project")) document.title = new_collection_name;
          window._collection_name = data_object.collection_name;
          mDispatch({
            type: "change_multiple_fields",
            newPartialState: {
              doc_names: data_object.doc_names,
              short_collection_name: data_object.short_collection_name
            }
          });
          pushCallback(function () {
            _handleChangeDoc(data_object.doc_names[0]);
          });
          props.stopSpinner();
        } else {
          props.clearStatusMessage();
          props.stopSpinner();
          props.addErrorDrawerEntry({
            title: "Error changing collection",
            content: data_object.message
          });
        }
      }
    }
  }
  function _updateDocList(doc_names, visible_doc) {
    _setMainStateValue("doc_names", doc_names);
    pushCallback(function () {
      _handleChangeDoc(visible_doc);
    });
  }
  function get_hp_height() {
    if (tile_div_ref.current) {
      if (mState.console_is_shrunk) {
        return _cProp("usable_height") - CONSOLE_HEADER_HEIGHT - BOTTOM_MARGIN - height_adjustment.current;
      } else {
        return (_cProp("usable_height") - BOTTOM_MARGIN - height_adjustment.current) * mState.height_fraction;
      }
    } else {
      return _cProp("usable_height") - 100;
    }
  }
  function get_vp_height() {
    if (tile_div_ref.current) {
      return _cProp("usable_height") - height_adjustment.current - BOTTOM_MARGIN;
    } else {
      return _cProp("usable_height") - height_adjustment.current - 50;
    }
  }
  function get_zoomed_console_height() {
    if (main_outer_ref.current) {
      return _cProp("usable_height") - height_adjustment.current - BOTTOM_MARGIN;
    } else {
      return _cProp("usable_height") - height_adjustment.current - 50;
    }
  }
  function _filteredColumnNames() {
    return mState.table_spec.column_names.filter(function (name) {
      return !(mState.table_spec.hidden_columns_list.includes(name) || name == "__id__");
    });
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
      });
      pushCallback(function () {
        pushCallback(callback);
      });
    } else {
      mDispatch({
        type: "change_multiple_fields",
        newPartialState: {
          resource_name: new_project_name,
          is_project: true
        }
      });
      pushCallback(callback);
    }
  }
  var actual_dark_theme = props.controlled ? props.dark_theme : mState.dark_theme;
  var vp_height;
  var hp_height;
  var console_available_height;
  var my_props = _objectSpread({}, props);
  if (!props.controlled) {
    my_props.is_project = mState.is_project;
    my_props.resource_name = mState.resource_name;
    my_props.usable_width = mState.usable_width;
    my_props.usable_height = mState.usable_height;
  }
  var true_usable_width = my_props.usable_width;
  if (mState.console_is_zoomed) {
    console_available_height = get_zoomed_console_height() - MARGIN_ADJUSTMENT;
  } else {
    vp_height = get_vp_height();
    hp_height = get_hp_height();
    if (mState.console_is_shrunk) {
      console_available_height = CONSOLE_HEADER_HEIGHT;
    } else {
      console_available_height = vp_height - hp_height - MARGIN_ADJUSTMENT - 3;
    }
  }
  var disabled_column_items = [];
  if (mState.selected_column == null) {
    disabled_column_items = ["Shift Left", "Shift Right", "Hide", "Hide in All Docs", "Delete Column", "Delete Column In All Docs"];
  }
  var disabled_row_items = [];
  if (mState.selected_row == null) {
    disabled_row_items = ["Delete Row", "Insert Row Before", "Insert Row After", "Duplicate Row"];
  }
  var project_name = my_props.is_project ? props.resource_name : "";
  var menus = /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_main_menus_react.ProjectMenu, _extends({}, props.statusFuncs, {
    main_id: props.main_id,
    project_name: project_name,
    is_notebook: props.is_notebook,
    is_juptyer: props.is_jupyter,
    setProjectName: _setProjectName,
    postAjaxFailure: props.postAjaxFailure,
    console_items: console_items_ref.current,
    tile_list: tile_list_ref.current,
    mState: mState,
    setMainStateValue: _setMainStateValue,
    updateLastSave: _updateLastSave,
    changeCollection: _changeCollection,
    disabled_items: my_props.is_project ? [] : ["Save"],
    registerOmniGetter: _registerOmniGetter,
    hidden_items: ["Export as Jupyter Notebook"]
  })), /*#__PURE__*/_react["default"].createElement(_main_menus_react.DocumentMenu, _extends({}, props.statusFuncs, {
    main_id: props.main_id,
    documentNames: mState.doc_names,
    registerOmniGetter: _registerOmniGetter,
    currentDoc: mState.table_spec.current_doc_name
  })), !props.is_freeform && /*#__PURE__*/_react["default"].createElement(_main_menus_react.ColumnMenu, _extends({}, props.statusFuncs, {
    main_id: props.main_id,
    project_name: project_name,
    is_notebook: props.is_notebook,
    is_juptyer: props.is_jupyter,
    moveColumn: _moveColumn,
    table_spec: mState.table_spec,
    filtered_column_names: _filteredColumnNames(),
    selected_column: mState.selected_column,
    disabled_items: disabled_column_items,
    hideColumn: _hideColumn,
    hideInAll: _hideColumnInAll,
    unhideAllColumns: _unhideAllColumns,
    addColumn: _addColumn,
    registerOmniGetter: _registerOmniGetter,
    deleteColumn: _deleteColumn
  })), !props.is_freeform && /*#__PURE__*/_react["default"].createElement(_main_menus_react.RowMenu, _extends({}, props.statusFuncs, {
    main_id: props.main_id,
    project_name: project_name,
    is_notebook: props.is_notebook,
    is_juptyer: props.is_jupyter,
    deleteRow: _deleteRow,
    insertRowBefore: function insertRowBefore() {
      _insertRow(mStateRef.current.selected_row);
    },
    insertRowAfter: function insertRowAfter() {
      _insertRow(mStateRef.current.selected_row + 1);
    },
    duplicateRow: _duplicateRow,
    selected_row: mState.selected_row,
    registerOmniGetter: _registerOmniGetter,
    disabled_items: disabled_row_items
  })), /*#__PURE__*/_react["default"].createElement(_main_menus_react.ViewMenu, _extends({}, props.statusFuncs, {
    main_id: props.main_id,
    project_name: project_name,
    is_notebook: props.is_notebook,
    is_juptyer: props.is_jupyter,
    table_is_shrunk: mState.table_is_shrunk,
    toggleTableShrink: _toggleTableShrink,
    openErrorDrawer: props.openErrorDrawer,
    show_exports_pane: mState.show_exports_pane,
    show_console_pane: mState.show_console_pane,
    registerOmniGetter: _registerOmniGetter,
    setMainStateValue: _setMainStateValue
  })), /*#__PURE__*/_react["default"].createElement(_core.NavbarDivider, null), create_tile_menus());
  var table_available_height = hp_height;
  var card_header = /*#__PURE__*/_react["default"].createElement(_table_react.MainTableCardHeader, {
    main_id: props.main_id,
    toggleShrink: _toggleTableShrink,
    mState: mState,
    setMainStateValue: _setMainStateValue,
    handleChangeDoc: _handleChangeDoc,
    handleSearchFieldChange: _handleSearchFieldChange,
    show_filter_button: !props.is_freeform,
    handleSpreadsheetModeChange: _handleSpreadsheetModeChange,
    handleSoftWrapChange: _handleSoftWrapChange,
    is_freeform: props.is_freeform
  });
  var card_body;
  if (props.is_freeform) {
    card_body = /*#__PURE__*/_react["default"].createElement(_table_react.FreeformBody, {
      main_id: props.main_id,
      ref: tbody_ref,
      dark_theme: actual_dark_theme,
      code_container_width: mState.horizontal_fraction * true_usable_width,
      code_container_height: _getTableBodyHeight(table_available_height),
      mState: mState,
      setMainStateValue: _setMainStateValue
    });
  } else {
    card_body = /*#__PURE__*/_react["default"].createElement(_blueprint_table.BlueprintTable, {
      main_id: props.main_id,
      ref: tbody_ref,
      clearScroll: _clearTableScroll,
      initiateDataGrab: _initiateDataGrab,
      height: _getTableBodyHeight(table_available_height),
      setCellContent: _setCellContent,
      filtered_column_names: _filteredColumnNames(),
      moveColumn: _moveColumn,
      updateTableSpec: _updateTableSpec,
      setMainStateValue: _setMainStateValue,
      mState: mState,
      set_scroll: set_table_scroll
    });
  }
  var tile_container_height = mState.console_is_shrunk ? table_available_height - MARGIN_ADJUSTMENT : table_available_height;
  var tile_pane = /*#__PURE__*/_react["default"].createElement("div", {
    ref: tile_div_ref
  }, /*#__PURE__*/_react["default"].createElement(_tile_react.TileContainer, {
    main_id: props.main_id,
    tsocket: props.tsocket,
    dark_theme: actual_dark_theme,
    height: tile_container_height,
    tile_list: tile_list_ref,
    current_doc_name: mState.table_spec.current_doc_name,
    selected_row: mState.selected_row,
    table_is_shrunk: mState.table_is_shrunk,
    broadcast_event: _broadcast_event_to_server,
    goToModule: props.goToModule,
    tileDispatch: tileDispatch,
    setMainStateValue: _setMainStateValue
  }));
  var exports_pane;
  if (mState.show_exports_pane) {
    exports_pane = /*#__PURE__*/_react["default"].createElement(_export_viewer_react.ExportsViewer, {
      main_id: props.main_id,
      tsocket: props.tsocket,
      setUpdate: function setUpdate(ufunc) {
        updateExportsList.current = ufunc;
      },
      setMainStateValue: _setMainStateValue,
      available_height: console_available_height,
      console_is_shrunk: mState.console_is_shrunk,
      console_is_zoomed: mState.console_is_zoomed
    });
  } else {
    exports_pane = /*#__PURE__*/_react["default"].createElement("div", null);
  }
  var console_pane;
  if (mState.show_console_pane) {
    console_pane = /*#__PURE__*/_react["default"].createElement(_console_component.ConsoleComponent, _extends({}, props.statusFuncs, {
      main_id: props.main_id,
      tsocket: props.tsocket,
      dark_theme: actual_dark_theme,
      handleCreateViewer: props.handleCreateViewer,
      controlled: props.controlled,
      am_selected: props.am_selected,
      console_items: console_items_ref,
      dispatch: dispatch,
      mState: mState,
      setMainStateValue: _setMainStateValue,
      console_available_height: console_available_height,
      console_available_width: true_usable_width * mState.console_width_fraction - 16,
      zoomable: true,
      shrinkable: true
    }));
  } else {
    var console_available_width = true_usable_width * mState.console_width_fraction - 16;
    console_pane = /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        width: console_available_width
      }
    });
  }
  var bottom_pane = /*#__PURE__*/_react["default"].createElement(_resizing_layouts.HorizontalPanes, {
    left_pane: console_pane,
    right_pane: exports_pane,
    show_handle: !mState.console_is_shrunk,
    available_height: console_available_height,
    available_width: true_usable_width,
    initial_width_fraction: mState.console_width_fraction,
    dragIconSize: 15,
    handleSplitUpdate: _handleConsoleFractionChange
  });
  var table_pane = /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
    ref: table_container_ref
  }, /*#__PURE__*/_react["default"].createElement(_table_react.MainTableCard, {
    card_body: card_body,
    card_header: card_header
  })));
  var top_pane;
  if (mState.table_is_shrunk) {
    top_pane = /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        paddingLeft: 10
      }
    }, tile_pane), mState.console_is_shrunk && bottom_pane);
  } else {
    top_pane = /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_resizing_layouts.HorizontalPanes, {
      left_pane: table_pane,
      right_pane: tile_pane,
      available_height: hp_height,
      show_handle: true,
      scrollAdjustSelectors: [".bp5-table-quadrant-scroll-container", "#tile-div"],
      available_width: true_usable_width,
      initial_width_fraction: mState.horizontal_fraction,
      dragIconSize: 15,
      handleSplitUpdate: _handleHorizontalFractionChange,
      handleResizeStart: _handleResizeStart,
      handleResizeEnd: _handleResizeEnd
    }), mState.console_is_shrunk && bottom_pane);
  }
  return /*#__PURE__*/_react["default"].createElement(_error_boundary.ErrorBoundary, null, !window.in_context && /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    dark_theme: actual_dark_theme,
    setTheme: props.setTheme,
    user_name: window.username,
    menus: null,
    page_id: props.main_id
  }), /*#__PURE__*/_react["default"].createElement(_menu_utilities.TacticMenubar, {
    dark_theme: actual_dark_theme,
    connection_status: connection_status,
    menus: menus,
    showRefresh: true,
    showClose: true,
    refreshTab: props.refreshTab,
    closeTab: props.closeTab,
    resource_name: _cProp("resource_name"),
    showErrorDrawerButton: true,
    toggleErrorDrawer: props.toggleErrorDrawer,
    extraButtons: [{
      onClick: _toggleTableShrink,
      icon: mState.table_is_shrunk ? "th" : "th-disconnect"
    }]
  }), /*#__PURE__*/_react["default"].createElement(_error_boundary.ErrorBoundary, null, /*#__PURE__*/_react["default"].createElement("div", {
    className: "main-outer ".concat(actual_dark_theme ? "bp5-dark" : "light-theme"),
    ref: main_outer_ref,
    style: {
      width: "100%",
      height: my_props.usable_height - height_adjustment.current
    }
  }, mState.console_is_zoomed && bottom_pane, !mState.console_is_zoomed && mState.console_is_shrunk && top_pane, !mState.console_is_zoomed && !mState.console_is_shrunk && /*#__PURE__*/_react["default"].createElement(_resizing_layouts.VerticalPanes, {
    top_pane: top_pane,
    bottom_pane: bottom_pane,
    show_handle: true,
    available_width: true_usable_width,
    available_height: vp_height,
    initial_height_fraction: mState.height_fraction,
    dragIconSize: 15,
    scrollAdjustSelectors: [".bp5-table-quadrant-scroll-container", "#tile-div"],
    handleSplitUpdate: _handleVerticalSplitUpdate,
    handleResizeStart: _handleResizeStart,
    handleResizeEnd: _handleResizeEnd,
    overflow: "hidden"
  })), !window.in_context && /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_TacticOmnibar.TacticOmnibar, {
    omniGetters: [_omniFunction],
    page_id: props.main_id,
    showOmnibar: mState.showOmnibar,
    closeOmnibar: _closeOmnibar
  }), /*#__PURE__*/_react["default"].createElement(_key_trap.KeyTrap, {
    global: true,
    bindings: key_bindings
  }))));
}
exports.MainApp = MainApp = /*#__PURE__*/(0, _react.memo)(MainApp);
MainApp.propTypes = {
  controlled: _propTypes["default"].bool,
  am_selected: _propTypes["default"].bool,
  changeResourceName: _propTypes["default"].func,
  changeResourceTitle: _propTypes["default"].func,
  changeResourceProps: _propTypes["default"].func,
  updatePanel: _propTypes["default"].func,
  refreshTab: _propTypes["default"].func,
  closeTab: _propTypes["default"].func,
  interface_state: _propTypes["default"].object,
  initial_doc_names: _propTypes["default"].array,
  initial_data_row_dict: _propTypes["default"].object,
  doc_names: _propTypes["default"].array
};
MainApp.defaultProps = {
  am_selected: true,
  controlled: false,
  changeResourceName: null,
  changeResourceTitle: null,
  changeResourceProps: null,
  refreshTab: null,
  closeTab: null,
  updatePanel: null
};
function main_main() {
  function gotProps(the_props) {
    var MainAppPlus = (0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(MainApp));
    var the_element = /*#__PURE__*/_react["default"].createElement(MainAppPlus, _extends({}, the_props, {
      controlled: false,
      initial_theme: window.theme,
      changeName: null
    }));
    var domContainer = document.querySelector('#main-root');
    ReactDOM.render(the_element, domContainer);
  }
  (0, _utilities_react.renderSpinnerMessage)("Starting up ...");
  var target = window.project_name == "" ? "main_collection_in_context" : "main_project_in_context";
  var resource_name = window.project_name == "" ? window.collection_name : window.project_name;
  (0, _communication_react.postAjaxPromise)(target, {
    "resource_name": resource_name
  }).then(function (data) {
    (0, _main_support.main_props)(data, null, gotProps, null);
  });
}
if (!window.in_context) {
  main_main();
}
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mainReducer = mainReducer;
exports.main_props = main_props;
var _utilities_react = require("./utilities_react");
var _communication_react = require("./communication_react");
var _tactic_socket = require("./tactic_socket");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var ppi;
var tsocket;
function main_props(data, registerDirtyMethod, finalCallback, registerOmniFunction) {
  ppi = (0, _utilities_react.get_ppi)();
  var main_id = data.main_id;
  if (!window.in_context) {
    window.main_id = main_id;
  }
  var initial_tile_types;
  var initial_tile_icon_dict;
  tsocket = new _tactic_socket.TacticSocket("main", 5000, "main_app", main_id, function (response) {
    tsocket.socket.on("remove-ready-block", readyListener);
    initial_tile_types = response.tile_types;
    initial_tile_icon_dict = response.icon_dict;
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
  window.addEventListener("unload", function sendRemove(event) {
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
    if (data.is_project) {
      var data_dict = {
        "project_name": data.project_name,
        "doc_type": data.doc_type,
        "base_figure_url": data.base_figure_url,
        "user_id": window.user_id,
        "ppi": ppi
      };
      (0, _communication_react.postWithCallback)(main_id, "initialize_project_mainwindow", data_dict, null, null, main_id);
    } else {
      var _data_dict = {
        "collection_name": data.collection_name,
        "doc_type": data.doc_type,
        "base_figure_url": data.base_figure_url,
        "user_id": window.user_id,
        "ppi": ppi
      };
      (0, _communication_react.postWithCallback)(main_id, "initialize_mainwindow", _data_dict, _finish_post_load_in_context, null, main_id);
    }
  }
  function _finish_post_load_in_context(fdata) {
    if (!window.in_context) {
      (0, _utilities_react.renderSpinnerMessage)("Creating the page...");
    }
    tsocket.socket.off("finish-post-load", _finish_post_load_in_context);
    var interface_state;
    if (data.is_project) {
      interface_state = fdata.interface_state;
      // legacy below lines needed for older saves
      if (!("show_exports_pane" in interface_state)) {
        interface_state["show_exports_pane"] = true;
      }
      if (!("show_console_pane" in interface_state)) {
        interface_state["show_console_pane"] = true;
      }
      var _iterator = _createForOfIteratorHelper(interface_state.tile_list),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var entry = _step.value;
          entry.finished_loading = false;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
    if (data.is_freeform) {
      finalCallback({
        is_project: data.is_project,
        main_id: main_id,
        is_freeform: true,
        resource_name: data.is_project ? data.project_name : data.short_collection_name,
        is_notebook: false,
        is_jupyter: false,
        tsocket: tsocket,
        short_collection_name: data.short_collection_name,
        initial_tile_types: initial_tile_types,
        initial_tile_icon_dict: initial_tile_icon_dict,
        interface_state: interface_state,
        initial_data_text: fdata.data_text,
        initial_table_spec: {
          current_doc_name: fdata.doc_names[0]
        },
        initial_theme: window.theme,
        initial_doc_names: fdata.doc_names,
        registerDirtyMethod: registerDirtyMethod,
        registerOmniFunction: registerOmniFunction
      });
    } else {
      finalCallback({
        is_project: data.is_project,
        main_id: main_id,
        is_freeform: false,
        is_notebook: false,
        is_jupyter: false,
        tsocket: tsocket,
        resource_name: data.is_project ? data.project_name : data.short_collection_name,
        short_collection_name: data.short_collection_name,
        initial_tile_types: initial_tile_types,
        initial_tile_icon_dict: initial_tile_icon_dict,
        initial_table_spec: {
          column_names: fdata.table_spec.header_list,
          column_widths: fdata.table_spec.column_widths,
          cell_backgrounds: fdata.table_spec.cell_backgrounds,
          hidden_columns_list: fdata.table_spec.hidden_columns_list,
          current_doc_name: fdata.doc_names[0]
        },
        interface_state: interface_state,
        total_rows: fdata.total_rows,
        initial_theme: window.theme,
        initial_data_row_dict: fdata.data_row_dict,
        initial_doc_names: fdata.doc_names,
        registerDirtyMethod: registerDirtyMethod,
        registerOmniFunction: registerOmniFunction
      });
    }
  }
}
function mainReducer(mState, action) {
  var newMstate;
  switch (action.type) {
    case "change_field":
      newMstate = _objectSpread({}, mState);
      newMstate[action.field] = action.new_value;
      break;
    case "change_multiple_fields":
      newMstate = _objectSpread(_objectSpread({}, mState), action.newPartialState);
      break;
    case "update_table_spec":
      newMstate = _objectSpread({}, mState);
      newMstate.table_spec = _objectSpread(_objectSpread({}, mState.table_spec), action.spec_update);
      break;
    case "set_cell_content":
      newMstate = _objectSpread({}, mState);
      var new_data_row_dict = _objectSpread({}, mState.data_row_dict);
      var the_row = _objectSpread({}, new_data_row_dict[action.row_id]);
      the_row[action.column_header] = action.new_content;
      new_data_row_dict[action.row_id] = the_row;
      newMstate.data_row_dict = new_data_row_dict;
      break;
    case "set_cell_background":
      newMstate = _objectSpread({}, mState);
      var new_cell_backgrounds = _objectSpread({}, mState.table_spec.cell_backgrounds);
      if (!new_cell_backgrounds.hasOwnProperty(action.row_id)) {
        new_cell_backgrounds[action.row_id] = {};
      }
      new_cell_backgrounds[action.row_id][action.column_header] = color;
      newMstate.table_spec = _objectSpread(_objectSpread({}, mState.table_spec), {}, {
        cell_backgrounds: new_cell_backgrounds
      });
      break;
    case "set_cells_to_color_text":
      newMstate = _objectSpread({}, mState);
      var ccd = _objectSpread({}, newMstate.cells_to_color_text);
      var entry = _objectSpread({}, ccd[action.row_id]);
      entry[action.column_header] = {
        token_text: action.token_text,
        color_dict: action.color_dict
      };
      ccd[action.row_id] = entry;
      newMstate.cells_to_color_text = ccd;
      break;
    case "update_data_row_dict":
      newMstate = _objectSpread({}, mState);
      newMstate.data_row_dict = _objectSpread(_objectSpread({}, mState.data_row_dict), action.new_data_row_dict);
      break;
    default:
      console.log("Got Unknown action: " + action.type);
      newMstate = _objectSpread({}, mState);
  }
  return newMstate;
}
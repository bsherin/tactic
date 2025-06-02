"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mainReducer = mainReducer;
exports.main_props = main_props;
var _utilities_react = require("./utilities_react");
var _communication_react = require("./communication_react");
var _tactic_socket = require("./tactic_socket");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var ppi;
function main_props(data, registerDirtyMethod, finalCallback) {
  var tsocket;
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
  tsocket.attachListener('finish-post-load', _finish_post_load_in_context);
  function readyListener() {
    _everyone_ready_in_context(finalCallback);
  }
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
    if (data.doc_type == "none") {
      finalCallback({
        is_project: data.is_project,
        main_id: main_id,
        is_freeform: false,
        doc_type: data.doc_type,
        resource_name: data.is_project ? data.project_name : "",
        is_notebook: false,
        is_jupyter: false,
        tsocket: tsocket,
        short_collection_name: "",
        initial_tile_types: initial_tile_types,
        initial_tile_icon_dict: initial_tile_icon_dict,
        interface_state: interface_state,
        initial_data_text: fdata.data_text,
        initial_table_spec: {
          current_doc_name: ""
        },
        initial_doc_names: [],
        registerDirtyMethod: registerDirtyMethod
      });
    } else if (data.is_freeform) {
      finalCallback({
        is_project: data.is_project,
        main_id: main_id,
        doc_type: data.doc_type,
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
        initial_doc_names: fdata.doc_names,
        registerDirtyMethod: registerDirtyMethod
      });
    } else {
      finalCallback({
        is_project: data.is_project,
        main_id: main_id,
        doc_type: data.doc_type,
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
        initial_data_row_dict: fdata.data_row_dict,
        initial_doc_names: fdata.doc_names,
        registerDirtyMethod: registerDirtyMethod
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
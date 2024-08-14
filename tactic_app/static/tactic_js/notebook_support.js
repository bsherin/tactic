"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.notebookReducer = notebookReducer;
exports.notebook_props = notebook_props;
var _utilities_react = require("./utilities_react");
var _tactic_socket = require("./tactic_socket");
var _communication_react = require("./communication_react");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var ppi;
function notebook_props(data, registerDirtyMethod, finalCallback) {
  var tsocket;
  ppi = (0, _utilities_react.get_ppi)();
  var main_id = data.main_id;
  if (!window.in_context) {
    window.main_id = main_id;
  }
  tsocket = new _tactic_socket.TacticSocket("main", 5000, "notebook_app", main_id, function (response) {
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
    if (data.is_project || opening_from_temp_id) {
      finalCallback({
        is_project: true,
        main_id: main_id,
        resource_name: data.project_name,
        tsocket: tsocket,
        interface_state: interface_state,
        is_notebook: true,
        is_juptyer: data.is_jupyter,
        registerDirtyMethod: registerDirtyMethod
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
        registerDirtyMethod: registerDirtyMethod
      });
    }
  }
}
function notebookReducer(mState, action) {
  var newMstate;
  if (action.type == "change_field") {
    newMstate = _objectSpread({}, mState);
    newMstate[action.field] = action.new_value;
  } else if (action.type == "change_multiple_fields") {
    newMstate = _objectSpread(_objectSpread({}, mState), action.newPartialState);
  } else {
    console.log("Got Unknown action: " + action.type);
    newMstate = _objectSpread({}, mState);
  }
  return newMstate;
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.notebookReducer = notebookReducer;
exports.notebook_props = notebook_props;
var _utilities_react = require("./utilities_react");
var _communication_react = require("./communication_react");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function notebook_props(data, registerDirtyMethod, finalCallback) {
  var local_id = data.local_id;
  var tsocket = data.tsocket;
  if (!window.in_context) {
    window.global_id = local_id;
  }
  tsocket.attachListener('handle-callback', function (task_packet) {
    (0, _communication_react.handleCallback)(task_packet, local_id);
  });
  var is_totally_new = !data.is_jupyter && !data.is_project && data.temp_data_id == "";
  var opening_from_temp_id = data.temp_data_id != "";
  var interface_state;
  if (data.is_project || opening_from_temp_id) {
    interface_state = data.interface_state;
  }
  if (data.is_project || opening_from_temp_id) {
    finalCallback({
      is_project: true,
      local_id: local_id,
      resource_name: data.project_name,
      tsocket: tsocket,
      interface_state: interface_state,
      is_notebook: true,
      is_juptyer: data.is_jupyter,
      readOnly: data.read_only,
      is_repository: data.is_repository,
      registerDirtyMethod: registerDirtyMethod
    });
  } else {
    finalCallback({
      is_project: false,
      local_id: local_id,
      resource_name: data.project_name,
      tsocket: tsocket,
      interface_state: null,
      is_notebook: true,
      is_juptyer: data.is_jupyter,
      readOnly: data.read_only,
      is_repository: data.is_repository,
      registerDirtyMethod: registerDirtyMethod
    });
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
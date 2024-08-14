"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CommandsModule = CommandsModule;
exports.ExportModule = ExportModule;
exports.MetadataModule = MetadataModule;
exports.OptionModule = OptionModule;
exports.correctOptionListTypes = correctOptionListTypes;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
var _table = require("@blueprintjs/table");
var _communication_react = require("./communication_react");
var _library_widgets = require("./library_widgets");
var _blueprint_react_widgets = require("./blueprint_react_widgets");
var _toaster = require("./toaster");
var _lodash = _interopRequireDefault(require("lodash"));
var _utilities_react = require("./utilities_react");
var _blueprint_mdata_fields = require("./blueprint_mdata_fields");
var _sizing_tools = require("./sizing_tools");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; } // noinspection JSConstructorReturnsPrimitive
function correctType(type, val) {
  var error_flag = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "__ERROR__";
  var result;
  if (val == null || val.length == 0) {
    return null;
  }
  switch (type) {
    case "int":
      if ((0, _utilities_react.isInt)(val)) {
        result = typeof val == "number" ? val : parseInt(val);
      } else {
        result = error_flag;
      }
      break;
    case "float":
      if (isNaN(Number(val)) && isNaN(parseFloat(val))) {
        result = error_flag;
      } else {
        result = typeof val == "number" ? val : parseFloat(val);
      }
      break;
    case "boolean":
      if (typeof val == "boolean") {
        result = val;
      } else {
        var lval = val.toLowerCase();
        if (lval == "false") {
          result = false;
        } else if (lval == "true") {
          result = true;
        } else {
          result = error_flag;
        }
      }
      break;
    default:
      result = val;
      break;
  }
  return result;
}
function correctOptionListTypes(option_list) {
  var copied_olist = _lodash["default"].cloneDeep(option_list);
  var _iterator = _createForOfIteratorHelper(copied_olist),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var option = _step.value;
      option["default"] = correctType(option.type, option["default"]);
      // The following is needed because when reordering rows BpOrderableTable return the special_list
      // as a string
      if (option.type == "custom_list") {
        if (typeof option.special_list == 'string') {
          option.special_list = eval(option.special_list);
        }
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return copied_olist;
}
var option_types = ['text', 'int', 'float', 'boolean', 'textarea', 'codearea', 'column_select', 'document_select', 'list_select', 'collection_select', 'palette_select', 'pipe_select', 'custom_list', 'function_select', 'class_select', 'tile_select', 'divider', 'pool_select'];
var taggable_types = ["class_select", "function_select", "pipe_select", "list_select", "collection_select"];
function OptionModuleForm(props) {
  function _setFormState(new_state) {
    var new_form_state = Object.assign(_lodash["default"].cloneDeep(props.form_state), new_state);
    props.setFormState(new_form_state);
  }
  function handleNameChange(event) {
    _setFormState({
      "name": event.target.value
    });
  }
  function handleDisplayTextChange(event) {
    _setFormState({
      "display_text": event.target.value
    });
  }
  function handleDefaultChange(event) {
    var new_val = props.form_state.type == "boolean" ? event.target.checked : event.target.value;
    _setFormState({
      "default": new_val
    });
  }
  function handleTagChange(event) {
    _setFormState({
      "tags": event.target.value
    });
  }
  function handleSpecialListChange(event) {
    _setFormState({
      "special_list": textRowsToArray(event.target.value)
    });
  }
  function handlePoolTypeChange(event) {
    _setFormState({
      "pool_select_type": event.currentTarget.value
    });
  }
  function handleTypeChange(event) {
    var new_type = event.currentTarget.value;
    var updater = {
      "type": new_type
    };
    if (new_type != "custom_list") {
      updater["special_list"] = "";
    }
    if (!taggable_types.includes(new_type)) {
      updater["tags"] = "";
    }
    if (new_type == "boolean") {
      updater["default"] = false;
    }
    if (new_type != "pool_select") {
      updater["pool_select_type"] = "";
    }
    _setFormState(updater);
  }
  function handleSubmit(update) {
    var copied_state = _lodash["default"].cloneDeep(props.form_state);
    delete copied_state.default_warning_text;
    delete copied_state.name_warning_text;
    delete copied_state.update_warning_text;
    if (!update && props.nameExists(props.form_state.name, update)) {
      _setFormState({
        name_warning_text: "Name exists"
      });
      return;
    }
    if (props.form_state.type == "divider") {
      copied_state["default"] = "";
    } else {
      var val = props.form_state["default"];
      var fixed_val = correctType(copied_state.type, val);
      if (fixed_val == "__ERROR__") {
        _setFormState({
          default_warning_text: "Invalid value"
        });
        return;
      } else {
        copied_state["default"] = fixed_val;
      }
    }
    _setFormState({
      default_warning_text: null,
      name_warning_text: null
    });
    props.handleCreate(copied_state, update);
  }
  return /*#__PURE__*/_react["default"].createElement("form", null, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      padding: 25
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    style: {
      display: "flex",
      flexWrap: "wrap",
      flexDirection: "row",
      marginBottom: 20
    },
    helperText: props.form_state.update_warning_text
  }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
    type: "submit",
    style: {
      height: "fit-content",
      alignSelf: "start",
      marginTop: 23,
      marginRight: 5
    },
    text: "create",
    intent: "primary",
    onClick: function onClick(e) {
      e.preventDefault();
      handleSubmit(false);
    }
  }), /*#__PURE__*/_react["default"].createElement(_core.Button, {
    type: "submit",
    style: {
      height: "fit-content",
      alignSelf: "start",
      marginTop: 23,
      marginRight: 5
    },
    disabled: props.active_row == null,
    text: "update",
    intent: "warning",
    onClick: function onClick(e) {
      e.preventDefault();
      handleSubmit(true);
    }
  }), /*#__PURE__*/_react["default"].createElement(_core.Button, {
    style: {
      height: "fit-content",
      alignSelf: "start",
      marginTop: 23,
      marginRight: 5
    },
    disabled: props.active_row == null,
    text: "delete",
    intent: "danger",
    onClick: function onClick(e) {
      e.preventDefault();
      props.deleteOption();
    }
  }), /*#__PURE__*/_react["default"].createElement(_core.Button, {
    style: {
      height: "fit-content",
      alignSelf: "start",
      marginTop: 23,
      marginRight: 5
    },
    text: "clear",
    onClick: function onClick(e) {
      e.preventDefault();
      props.clearForm();
    }
  })), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      flexDirection: "row"
    }
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.LabeledFormField, {
    label: "Name",
    onChange: handleNameChange,
    the_value: props.form_state.name,
    helperText: props.form_state.name_warning_text
  }), /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.LabeledSelectList, {
    label: "Type",
    option_list: option_types,
    onChange: handleTypeChange,
    the_value: props.form_state.type
  }), /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.LabeledFormField, {
    label: "Display Text",
    onChange: handleDisplayTextChange,
    the_value: props.form_state.display_text,
    helperText: props.form_state.display_warning_text
  }), props.form_state.type != "divider" && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.LabeledFormField, {
    label: "Default",
    onChange: handleDefaultChange,
    the_value: props.form_state["default"],
    isBool: props.form_state.type == "boolean",
    helperText: props.form_state.default_warning_text
  }), props.form_state.type == "custom_list" && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.LabeledTextArea, {
    label: "Special List",
    onChange: handleSpecialListChange,
    the_value: arrayToTextRows(props.form_state.special_list)
  }), taggable_types.includes(props.form_state.type) && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.LabeledFormField, {
    label: "Tag",
    onChange: handleTagChange,
    the_value: props.form_state.tags
  }), props.form_state.type == "pool_select" && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.LabeledSelectList, {
    label: "Type",
    option_list: ["file", "folder", "both"],
    onChange: handlePoolTypeChange,
    the_value: props.form_state.pool_select_type
  }))));
}
OptionModuleForm = /*#__PURE__*/(0, _react.memo)(OptionModuleForm);
OptionModuleForm.propTypes = {
  handleCreate: _propTypes["default"].func,
  deleteOption: _propTypes["default"].func,
  nameExists: _propTypes["default"].func,
  setFormState: _propTypes["default"].func,
  clearForm: _propTypes["default"].func,
  form_state: _propTypes["default"].object,
  active_row: _propTypes["default"].number
};
function arrayToString(ar) {
  var nstring = "[";
  var isfirst = true;
  var _iterator2 = _createForOfIteratorHelper(ar),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var item = _step2.value;
      if (!isfirst) {
        nstring += ", ";
      } else {
        isfirst = false;
      }
      nstring += "'" + String(item) + "'";
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  nstring += "]";
  return nstring;
}
function arrayToTextRows(ar) {
  var nstring = "";
  var isfirst = true;
  var _iterator3 = _createForOfIteratorHelper(ar),
    _step3;
  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var item = _step3.value;
      if (!isfirst) {
        nstring += "\n";
      } else {
        isfirst = false;
      }
      nstring += String(item);
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
  return nstring;
}
function textRowsToArray(tstring) {
  var slist = [];
  var _iterator4 = _createForOfIteratorHelper(tstring.toString().split("\n")),
    _step4;
  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var item = _step4.value;
      slist.push(item);
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }
  return slist;
}
var blank_form = {
  name: "",
  display_text: "",
  type: "text",
  "default": "",
  special_list: "",
  tags: "",
  default_warning_text: null,
  name_warning_text: null
};
function OptionModule(props) {
  var top_ref = /*#__PURE__*/_react["default"].createRef();
  var _useState = (0, _react.useState)(null),
    _useState2 = _slicedToArray(_useState, 2),
    active_row = _useState2[0],
    set_active_row = _useState2[1];
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)(_objectSpread({}, blank_form)),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    form_state = _useStateAndRef2[0],
    set_form_state = _useStateAndRef2[1],
    form_state_ref = _useStateAndRef2[2];
  var _useSize = (0, _sizing_tools.useSize)(top_ref, props.tabSelectCounter, "OptionModule"),
    _useSize2 = _slicedToArray(_useSize, 4),
    usable_width = _useSize2[0],
    usable_height = _useSize2[1],
    topX = _useSize2[2],
    topY = _useSize2[3];
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  function _delete_option() {
    var old_active_row = active_row;
    props.optionDispatch({
      type: "delete_item",
      option_id: props.data_list_ref.current[active_row].option_id
    });
    pushCallback(function () {
      if (old_active_row >= props.data_list_ref.current.length) {
        _handleRowDeSelect();
      } else {
        handleActiveRowChange(old_active_row);
      }
    });
  }
  function _clearHighlights() {
    props.optionDispatch({
      type: "clear_highlights"
    });
  }
  function handleCreate(new_item, update) {
    if (update) {
      new_item.option_id = props.data_list_ref.current[active_row].option_id;
      new_item.className = "option-row-highlight";
      props.optionDispatch({
        type: "update_item",
        new_item: new_item
      });
      pushCallback(function () {
        var new_form_state = Object.assign(_lodash["default"].cloneDeep(form_state_ref.current), {
          update_warning_text: "Value Updated"
        });
        _setFormState(new_form_state);
        setTimeout(function () {
          _clearHighlights();
          var new_form_state = Object.assign(_lodash["default"].cloneDeep(form_state_ref.current), {
            update_warning_text: null
          });
          _setFormState(new_form_state);
        }, 5 * 1000);
      });
    } else {
      new_item.className = "option-row-highlight";
      props.optionDispatch({
        type: "add_at_index",
        insert_index: props.data_list_ref.current.length,
        new_item: new_item
      });
      pushCallback(function () {
        setTimeout(function () {
          _clearHighlights();
        }, 5 * 1000);
      });
    }
  }
  function _setFormState(new_form_state) {
    set_form_state(_objectSpread({}, new_form_state));
  }
  function _nameExists(name, update) {
    var rnum = 0;
    var _iterator5 = _createForOfIteratorHelper(props.data_list_ref.current),
      _step5;
    try {
      for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
        var option = _step5.value;
        if (option.name == name) {
          return !(update && rnum == active_row);
        }
        rnum += 1;
      }
    } catch (err) {
      _iterator5.e(err);
    } finally {
      _iterator5.f();
    }
    return false;
  }
  function handleActiveRowChange(row_index) {
    var new_form_state = Object.assign(_objectSpread({}, blank_form), props.data_list_ref.current[row_index]);
    set_form_state(_objectSpread({}, new_form_state));
    set_active_row(row_index);
  }
  function _clearForm() {
    _setFormState({
      name: "",
      display_text: "",
      "default": "",
      special_list: "",
      tags: "",
      default_warning_text: null,
      name_warning_text: null,
      update_warning_text: null,
      pool_select_type: ""
    });
  }
  function _handleRowDeSelect() {
    set_active_row(null);
    pushCallback(_clearForm);
  }
  var cols = ["name", "type", "display_text", "default", "tags"];
  var extra_cols = ["special_list", "pool_select_type"];
  var options_pane_style = {
    "marginTop": 10,
    "marginLeft": 10,
    "marginRight": 10,
    "height": usable_height
  };
  var copied_dlist = props.data_list_ref.current.map(function (opt) {
    var new_opt = {};
    var all_cols = extra_cols.concat(cols);
    var _iterator6 = _createForOfIteratorHelper(all_cols),
      _step6;
    try {
      for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
        var col = _step6.value;
        if (col in opt) {
          new_opt[col] = opt[col];
        }
        if (typeof new_opt["default"] == "boolean") {
          new_opt["default"] = new_opt["default"] ? "True" : "False";
        }
      }
    } catch (err) {
      _iterator6.e(err);
    } finally {
      _iterator6.f();
    }
    for (var param in new_opt) {
      if (Array.isArray(new_opt[param])) {
        new_opt[param] = arrayToString(new_opt[param]);
      }
    }
    if ("className" in opt && opt.className != "") {
      new_opt.className = opt.className;
    } else if (new_opt.type == "divider") {
      new_opt.className = "divider-option";
    }
    return new_opt;
  });
  return /*#__PURE__*/_react["default"].createElement(_core.Card, {
    ref: top_ref,
    elevation: 1,
    id: "options-pane",
    className: "d-flex flex-column",
    style: options_pane_style
  }, props.foregrounded && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.BpOrderableTable, {
    columns: cols,
    data_array: copied_dlist,
    active_row: active_row,
    useReducer: true,
    dispatch: props.optionDispatch,
    handleActiveRowChange: handleActiveRowChange,
    handleChange: null,
    selectionModes: [_table.RegionCardinality.FULL_ROWS],
    handleDeSelect: _handleRowDeSelect,
    content_editable: false
  }), /*#__PURE__*/_react["default"].createElement(OptionModuleForm, {
    handleCreate: handleCreate,
    deleteOption: _delete_option,
    active_row: active_row,
    setFormState: _setFormState,
    clearForm: _clearForm,
    form_state: form_state_ref.current,
    nameExists: _nameExists
  }));
}
exports.OptionModule = OptionModule = /*#__PURE__*/(0, _react.memo)(OptionModule);
OptionModule.propTypes = {
  data_list: _propTypes["default"].array,
  foregrounded: _propTypes["default"].bool,
  handleChange: _propTypes["default"].func,
  handleNotesAppend: _propTypes["default"].func,
  available_height: _propTypes["default"].number
};
function ExportModuleForm(props) {
  var _useState3 = (0, _react.useState)(""),
    _useState4 = _slicedToArray(_useState3, 2),
    name = _useState4[0],
    set_name = _useState4[1];
  var _useState5 = (0, _react.useState)(""),
    _useState6 = _slicedToArray(_useState5, 2),
    tags = _useState6[0],
    set_tags = _useState6[1];
  function handleNameChange(event) {
    set_name(event.target.value);
  }
  function handleTagChange(event) {
    set_tags(event.target.value);
  }
  function handleSubmit() {
    props.handleCreate({
      name: name,
      tags: tags
    });
  }
  return /*#__PURE__*/_react["default"].createElement("form", null, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      padding: 10
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      flexDirection: "row",
      marginBottom: 20
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
    style: {
      height: "fit-content",
      alignSelf: "start",
      marginTop: 23,
      marginRight: 5
    },
    text: "Create",
    type: "submit",
    intent: "primary",
    onClick: function onClick(e) {
      e.preventDefault();
      handleSubmit();
    }
  }), /*#__PURE__*/_react["default"].createElement(_core.Button, {
    style: {
      height: "fit-content",
      alignSelf: "start",
      marginTop: 23,
      marginRight: 5
    },
    disabled: props.active_row == null,
    text: "delete",
    intent: "danger",
    onClick: function onClick(e) {
      e.preventDefault();
      props.handleDelete();
    }
  })), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      flexDirection: "row"
    }
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.LabeledFormField, {
    label: "Name",
    onChange: handleNameChange,
    the_value: name
  }), props.include_tags && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.LabeledFormField, {
    label: "Tags",
    onChange: handleTagChange,
    the_value: tags
  }))));
}
ExportModuleForm = /*#__PURE__*/(0, _react.memo)(ExportModuleForm);
ExportModuleForm.propTypes = {
  handleCreate: _propTypes["default"].func,
  handleDelete: _propTypes["default"].func,
  active_row: _propTypes["default"].number,
  include_tags: _propTypes["default"].bool
};
function ExportModule(props) {
  var top_ref = /*#__PURE__*/_react["default"].createRef();
  var _useState7 = (0, _react.useState)(0),
    _useState8 = _slicedToArray(_useState7, 2),
    active_export_row = _useState8[0],
    set_active_export_row = _useState8[1];
  var _useState9 = (0, _react.useState)(0),
    _useState10 = _slicedToArray(_useState9, 2),
    active_save_row = _useState10[0],
    set_active_save_row = _useState10[1];
  var _useSize3 = (0, _sizing_tools.useSize)(top_ref, props.tabSelectCounter, "ExportModule"),
    _useSize4 = _slicedToArray(_useSize3, 4),
    usable_width = _useSize4[0],
    usable_height = _useSize4[1],
    topX = _useSize4[2],
    topY = _useSize4[3];
  function _delete_export() {
    var new_data_list = props.export_list;
    new_data_list.splice(active_export_row, 1);
    var old_active_row = active_export_row;
    props.handleChange({
      export_list: new_data_list
    }, function () {
      if (old_active_row >= props.export_list.length) {
        set_active_export_row(null);
      } else {
        _handleActiveExportRowChange(old_active_row);
      }
    });
  }
  function _delete_save() {
    var new_data_list = props.save_list;
    new_data_list.splice(active_save_row, 1);
    var old_active_row = active_save_row;
    props.handleChange({
      additional_save_attrs: new_data_list
    }, function () {
      if (old_active_row >= props.save_list.length) {
        set_active_save_row(null);
      } else {
        _handleActiveSaveRowChange(old_active_row);
      }
    });
  }
  function _handleCreateExport(new_row) {
    var new_data_list = props.export_list;
    new_data_list.push(new_row);
    props.handleChange({
      export_list: new_data_list
    });
  }
  function _handleCreateSave(new_row) {
    var new_data_list = props.save_list;
    new_data_list.push(new_row);
    props.handleChange({
      additional_save_attrs: new_data_list
    });
  }
  function _handleActiveExportRowChange(row_index) {
    set_active_export_row(row_index);
  }
  function _handleActiveSaveRowChange(row_index) {
    set_active_save_row(row_index);
  }
  function _handleCoupleChange(event) {
    props.handleChange({
      "couple_save_attrs_and_exports": event.target.checked
    });
  }
  function _handleExportChange(new_export_list) {
    props.handleChange({
      export_list: new_export_list
    });
  }
  function _handleSaveChange(new_export_list) {
    props.handleChange({
      additional_save_attrs: new_export_list
    });
  }
  var cols = ["name", "tags"];
  var exports_pane_style = {
    "marginTop": 10,
    "marginLeft": 10,
    "marginRight": 10,
    "height": usable_height
  };
  return /*#__PURE__*/_react["default"].createElement(_core.Card, {
    ref: top_ref,
    elevation: 1,
    id: "exports-pane",
    className: "d-flex flex-column",
    style: exports_pane_style
  }, props.foregrounded && /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("h4", {
    className: "bp5-heading"
  }, "Exports"), /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.BpOrderableTable, {
    columns: cols,
    data_array: props.export_list,
    active_row: active_export_row,
    handleActiveRowChange: _handleActiveExportRowChange,
    handleChange: _handleExportChange,
    content_editable: true
  })), /*#__PURE__*/_react["default"].createElement(ExportModuleForm, {
    handleCreate: _handleCreateExport,
    handleDelete: _delete_export,
    include_tags: true,
    active_row: active_export_row
  }), /*#__PURE__*/_react["default"].createElement(_core.Divider, null), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: 15
    }
  }, /*#__PURE__*/_react["default"].createElement("h4", {
    className: "bp5-heading"
  }, "Save Attrs"), /*#__PURE__*/_react["default"].createElement(_core.Switch, {
    label: "Couple save_attrs and exports",
    className: "ml-2 mb-0 mt-1",
    large: false,
    checked: props.couple_save_attrs_and_exports,
    onChange: _handleCoupleChange
  })), props.foregrounded && !props.couple_save_attrs_and_exports && /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.BpOrderableTable, {
    columns: ["name"],
    data_array: props.save_list,
    active_row: active_save_row,
    handleActiveRowChange: _handleActiveSaveRowChange,
    handleChange: _handleSaveChange,
    content_editable: true
  }), /*#__PURE__*/_react["default"].createElement(ExportModuleForm, {
    handleCreate: _handleCreateSave,
    handleDelete: _delete_save,
    include_tags: false,
    active_row: active_save_row
  })));
}
exports.ExportModule = ExportModule = /*#__PURE__*/(0, _react.memo)(ExportModule);
ExportModule.propTypes = {
  export_list: _propTypes["default"].array,
  save_list: _propTypes["default"].array,
  couple_save_attrs_and_exports: _propTypes["default"].bool,
  foregrounded: _propTypes["default"].bool,
  handleChange: _propTypes["default"].func,
  handleNotesAppend: _propTypes["default"].func,
  available_height: _propTypes["default"].number
};
function MetadataModule(props) {
  var top_ref = /*#__PURE__*/_react["default"].createRef();
  var _useSize5 = (0, _sizing_tools.useSize)(top_ref, props.tabSelectCounter, "CreatorModule"),
    _useSize6 = _slicedToArray(_useSize5, 4),
    usable_width = _useSize6[0],
    usable_height = _useSize6[1],
    topX = _useSize6[2],
    topY = _useSize6[3];
  var md_style = {
    height: "100%"
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    ref: top_ref,
    style: {
      marginLeft: 10,
      height: usable_height
    }
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_mdata_fields.CombinedMetadata, _extends({}, props, {
    outer_style: md_style
  })));
}
exports.MetadataModule = MetadataModule = /*#__PURE__*/(0, _react.memo)(MetadataModule);
function CommandsModule(props) {
  var top_ref = /*#__PURE__*/_react["default"].createRef();
  var commandsRef = (0, _react.useRef)(null);
  var _useState11 = (0, _react.useState)(""),
    _useState12 = _slicedToArray(_useState11, 2),
    search_string = _useState12[0],
    set_search_string = _useState12[1];
  var _useState13 = (0, _react.useState)({}),
    _useState14 = _slicedToArray(_useState13, 2),
    api_dict = _useState14[0],
    set_api_dict = _useState14[1];
  var _useState15 = (0, _react.useState)([]),
    _useState16 = _slicedToArray(_useState15, 2),
    ordered_categories = _useState16[0],
    set_ordered_categories = _useState16[1];
  var _useState17 = (0, _react.useState)({}),
    _useState18 = _slicedToArray(_useState17, 2),
    object_api_dict = _useState18[0],
    set_object_api_dict = _useState18[1];
  var _useState19 = (0, _react.useState)([]),
    _useState20 = _slicedToArray(_useState19, 2),
    ordered_object_categories = _useState20[0],
    set_ordered_object_categories = _useState20[1];
  var _useSize7 = (0, _sizing_tools.useSize)(top_ref, props.tabSelectCounter, "CommandModule"),
    _useSize8 = _slicedToArray(_useSize7, 4),
    usable_width = _useSize8[0],
    usable_height = _useSize8[1],
    topX = _useSize8[2],
    topY = _useSize8[3];
  (0, _react.useEffect)(function () {
    (0, _communication_react.postAjax)("get_api_dict", {}, function (data) {
      set_api_dict(data.api_dict_by_category);
      set_object_api_dict(data.object_api_dict_by_category);
      set_ordered_object_categories(data.ordered_object_categories);
      set_ordered_categories(data.ordered_api_categories);
    });
  }, []);
  function _updateSearchState(new_state) {
    set_search_string(new_state["search_string"]);
  }
  var object_items = [];
  var _iterator7 = _createForOfIteratorHelper(ordered_object_categories),
    _step7;
  try {
    for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
      var category = _step7.value;
      var res = /*#__PURE__*/_react["default"].createElement(ObjectCategoryEntry, {
        category_name: category,
        key: category,
        search_string: search_string,
        class_list: object_api_dict[category]
      });
      object_items.push(res);
    }
  } catch (err) {
    _iterator7.e(err);
  } finally {
    _iterator7.f();
  }
  var command_items = [];
  var _iterator8 = _createForOfIteratorHelper(ordered_categories),
    _step8;
  try {
    for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
      var _category = _step8.value;
      var _res = /*#__PURE__*/_react["default"].createElement(CategoryEntry, {
        category_name: _category,
        key: _category,
        search_string: search_string,
        command_list: api_dict[_category]
      });
      command_items.push(_res);
    }
  } catch (err) {
    _iterator8.e(err);
  } finally {
    _iterator8.f();
  }
  var commands_pane_style = {
    "marginTop": 10,
    "marginLeft": 10,
    "marginRight": 10,
    "paddingTop": 10,
    height: usable_height
  };
  return /*#__PURE__*/_react["default"].createElement(_core.Card, {
    ref: top_ref,
    elevation: 1,
    id: "commands-pane",
    className: "d-flex flex-column",
    style: commands_pane_style
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      marginRight: 25
    }
  }, /*#__PURE__*/_react["default"].createElement(_library_widgets.SearchForm, {
    update_search_state: _updateSearchState,
    search_string: search_string
  })), /*#__PURE__*/_react["default"].createElement("div", {
    ref: commandsRef,
    style: {
      fontSize: 13,
      overflow: "auto"
    }
  }, /*#__PURE__*/_react["default"].createElement("h4", null, "Object api"), object_items, /*#__PURE__*/_react["default"].createElement("h4", {
    style: {
      marginTop: 20
    }
  }, "TileBase methods (accessed with self)"), command_items));
}
exports.CommandsModule = CommandsModule = /*#__PURE__*/(0, _react.memo)(CommandsModule);
function stringIncludes(str1, str2) {
  return str1.toLowerCase().includes(str2.toLowerCase());
}
function ObjectCategoryEntry(props) {
  var classes = [];
  var show_whole_category = false;
  var show_category = false;
  if (props.search_string == "" || stringIncludes(props.category_name, props.search_string)) {
    show_whole_category = true;
    show_category = true;
  }
  var index = 0;
  var _iterator9 = _createForOfIteratorHelper(props.class_list),
    _step9;
  try {
    for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
      var class_entry = _step9.value;
      var entries = [];
      var show_class = false;
      if (class_entry[2] == "class") {
        var show_whole_class = false;
        if (show_whole_category || stringIncludes(class_entry[0], props.search_string)) {
          show_whole_class = true;
          show_category = true;
          show_class = true;
        }
        var _iterator10 = _createForOfIteratorHelper(class_entry[1]),
          _step10;
        try {
          for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
            var entry = _step10.value;
            entry["kind"] = "class_" + entry["kind"];
            var show_entry = false;
            if (show_whole_class || stringIncludes(entry.signature, props.search_string)) {
              entries.push( /*#__PURE__*/_react["default"].createElement(CommandEntry, _extends({
                key: "entry_".concat(index)
              }, entry)));
              index += 1;
              show_class = true;
              show_category = true;
            }
          }
        } catch (err) {
          _iterator10.e(err);
        } finally {
          _iterator10.f();
        }
        if (show_class) {
          classes.push( /*#__PURE__*/_react["default"].createElement(_react.Fragment, {
            key: "class_".concat(index)
          }, /*#__PURE__*/_react["default"].createElement("h6", {
            style: {
              fontStyle: "italic",
              marginTop: 20,
              fontFamily: "monospace"
            }
          }, "class" + class_entry[0]), entries));
          index += 1;
        }
      } else {
        var _entry = class_entry[1];
        if (show_whole_category || stringIncludes(_entry.signature, props.search_string)) {
          entries.push( /*#__PURE__*/_react["default"].createElement(CommandEntry, _extends({
            key: "entry_".concat(index)
          }, _entry)));
          index += 1;
          show_category = true;
        }
      }
    }
  } catch (err) {
    _iterator9.e(err);
  } finally {
    _iterator9.f();
  }
  if (show_category) {
    return /*#__PURE__*/_react["default"].createElement(_react.Fragment, {
      key: props.category_name
    }, /*#__PURE__*/_react["default"].createElement("h5", {
      style: {
        marginTop: 20
      }
    }, props.category_name), classes, /*#__PURE__*/_react["default"].createElement(_core.Divider, null));
  } else {
    return false;
  }
}
ObjectCategoryEntry = /*#__PURE__*/(0, _react.memo)(ObjectCategoryEntry);
ObjectCategoryEntry.propTypes = {
  category_name: _propTypes["default"].string,
  class_list: _propTypes["default"].array,
  search_string: _propTypes["default"].string
};
function CategoryEntry(props) {
  var show_whole_category = false;
  var show_category = false;
  if (props.search_string == "" || stringIncludes(props.category_name, props.search_string)) {
    show_whole_category = true;
    show_category = true;
  }
  var entries = [];
  var index = 0;
  var _iterator11 = _createForOfIteratorHelper(props.command_list),
    _step11;
  try {
    for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
      var entry = _step11.value;
      if (show_whole_category || stringIncludes(entry.signature, props.search_string)) {
        show_category = true;
        entries.push( /*#__PURE__*/_react["default"].createElement(CommandEntry, _extends({
          key: index
        }, entry)));
        index += 1;
      }
    }
  } catch (err) {
    _iterator11.e(err);
  } finally {
    _iterator11.f();
  }
  if (show_category) {
    return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("h5", {
      style: {
        marginTop: 20
      }
    }, props.category_name), entries, /*#__PURE__*/_react["default"].createElement(_core.Divider, null));
  } else {
    return null;
  }
}
CategoryEntry = /*#__PURE__*/(0, _react.memo)(CategoryEntry);
CategoryEntry.propTypes = {
  category_name: _propTypes["default"].string,
  command_list: _propTypes["default"].array,
  search_string: _propTypes["default"].string
};
function CommandEntry(props) {
  var _useState21 = (0, _react.useState)(false),
    _useState22 = _slicedToArray(_useState21, 2),
    isOpen = _useState22[0],
    setIsOpen = _useState22[1];
  var statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  function _handleClick() {
    setIsOpen(!isOpen);
  }
  function _doCopy() {
    if (navigator.clipboard && window.isSecureContext) {
      if (props.kind == "method" || props.kind == "attribute") {
        void navigator.clipboard.writeText("self." + props.signature);
      } else {
        void navigator.clipboard.writeText(props.signature);
      }
      statusFuncs.statusMessage("command copied");
    }
  }
  var md_style = {
    "display": "block",
    "fontSize": 13
  };
  var re = new RegExp("^([^(]*)");
  var bolded_command = props.signature.replace(re, function (matched) {
    return "<span class='command-name'>" + matched + "</span>";
  });
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_core.Button, {
    minimal: true,
    outlined: isOpen,
    className: "bp5-monospace-text",
    onClick: _handleClick
  }, /*#__PURE__*/_react["default"].createElement("span", {
    dangerouslySetInnerHTML: {
      __html: bolded_command
    }
  })), /*#__PURE__*/_react["default"].createElement(_core.Collapse, {
    isOpen: isOpen
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      maxWidth: 700,
      position: "relative"
    }
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    style: {
      position: "absolute",
      right: 5,
      top: 5,
      marginTop: 0
    },
    icon: "clipboard",
    small: true,
    handleClick: _doCopy
  }), /*#__PURE__*/_react["default"].createElement("div", {
    style: md_style,
    className: "notes-field-markdown-output bp5-button bp5-outlined",
    dangerouslySetInnerHTML: {
      __html: props.body
    }
  }))));
}
CommandEntry = /*#__PURE__*/(0, _react.memo)(CommandEntry);
CommandEntry.propTypes = {
  name: _propTypes["default"].string,
  signature: _propTypes["default"].string,
  body: _propTypes["default"].string,
  kind: _propTypes["default"].string
};
function ApiMenu(props) {
  var _useState23 = (0, _react.useState)(null),
    _useState24 = _slicedToArray(_useState23, 2),
    currently_selected = _useState24[0],
    set_currently_selected = _useState24[1];
  var _useState25 = (0, _react.useState)(null),
    _useState26 = _slicedToArray(_useState25, 2),
    menu_created = _useState26[0],
    set_menu_created = _useState26[1];
  (0, _react.useEffect)(function () {
    if (!menu_created && props.item_list.length > 0) {
      set_current_selected(props.item_list[0].name);
      set_menu_created(true);
    }
  });
  function _buildMenu() {
    var choices = [];
    var _iterator12 = _createForOfIteratorHelper(props.item_list),
      _step12;
    try {
      for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
        var item = _step12.value;
        if (item.kind == "header") {
          choices.push( /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, {
            title: item.name
          }));
        } else {
          choices.push( /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
            text: item.name
          }));
        }
      }
    } catch (err) {
      _iterator12.e(err);
    } finally {
      _iterator12.f();
    }
    return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, choices);
  }
  function _handleChange(value) {
    set_currently_selected(value);
  }
  var option_list = [];
  var _iterator13 = _createForOfIteratorHelper(props.item_list),
    _step13;
  try {
    for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
      var item = _step13.value;
      option_list.push(item.name);
    }
  } catch (err) {
    _iterator13.e(err);
  } finally {
    _iterator13.f();
  }
  return /*#__PURE__*/_react["default"].createElement(_blueprint_mdata_fields.BpSelect, {
    options: option_list,
    onChange: _handleChange,
    buttonIcon: "application",
    value: currently_selected
  });
}
ApiMenu = /*#__PURE__*/(0, _react.memo)(ApiMenu);
ApiMenu.propTypes = {
  item_list: _propTypes["default"].array
};
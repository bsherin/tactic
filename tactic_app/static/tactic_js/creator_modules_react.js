"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CommandsModule = CommandsModule;
exports.ExportModule = ExportModule;
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
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
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
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
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
    _setFormState(updater);
  }
  function handleSubmit(update) {
    var copied_state = _lodash["default"].cloneDeep(props.form_state);
    delete copied_state.default_warning_text;
    delete copied_state.name_warning_text;
    if (!update && props.nameExists(props.form_state.name, update)) {
      _setFormState({
        name_warning_text: "Name exists"
      });
      return;
    }
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
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      flexDirection: "row",
      marginBottom: 20
    }
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
  var _useState = (0, _react.useState)(null),
    _useState2 = _slicedToArray(_useState, 2),
    active_row = _useState2[0],
    set_active_row = _useState2[1];
  var _useState3 = (0, _react.useState)(_objectSpread({}, blank_form)),
    _useState4 = _slicedToArray(_useState3, 2),
    form_state = _useState4[0],
    set_form_state = _useState4[1];
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  function _delete_option() {
    var new_data_list = _lodash["default"].cloneDeep(props.data_list);
    new_data_list.splice(active_row, 1);
    var old_active_row = active_row;
    props.handleChange(new_data_list, function () {
      if (old_active_row >= props.data_list.length) {
        _handleRowDeSelect();
      } else {
        handleActiveRowChange(old_active_row);
      }
    });
  }
  function _clearHighlights(new_data_list) {
    var newer_data_list = [];
    var _iterator5 = _createForOfIteratorHelper(new_data_list),
      _step5;
    try {
      for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
        var option = _step5.value;
        if ("className" in option && option.className) {
          var new_option = _objectSpread({}, option);
          new_option.className = "";
          newer_data_list.push(new_option);
        } else {
          newer_data_list.push(option);
        }
      }
    } catch (err) {
      _iterator5.e(err);
    } finally {
      _iterator5.f();
    }
    props.handleChange(newer_data_list);
  }
  function handleCreate(new_row, update) {
    var new_data_list = _toConsumableArray(props.data_list);
    new_row.className = "option-row-highlight";
    if (update) {
      new_data_list[active_row] = new_row;
    } else {
      new_data_list.push(new_row);
    }
    props.handleChange(new_data_list, function () {
      setTimeout(function () {
        _clearHighlights(new_data_list);
      }, 5 * 1000);
    });
  }
  function _setFormState(new_form_state) {
    set_form_state(_objectSpread({}, new_form_state));
  }
  function _nameExists(name, update) {
    var rnum = 0;
    var _iterator6 = _createForOfIteratorHelper(props.data_list),
      _step6;
    try {
      for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
        var option = _step6.value;
        if (option.name == name) {
          return !(update && rnum == active_row);
        }
        rnum += 1;
      }
    } catch (err) {
      _iterator6.e(err);
    } finally {
      _iterator6.f();
    }
    return false;
  }
  function handleActiveRowChange(row_index) {
    var new_form_state = Object.assign(_objectSpread({}, blank_form), props.data_list[row_index]);
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
      name_warning_text: null
    });
  }
  function _handleRowDeSelect() {
    set_active_row(null);
    pushCallback(_clearForm);
  }
  var cols = ["name", "type", "display_text", "default", "special_list", "tags"];
  var options_pane_style = {
    "marginTop": 10,
    "marginLeft": 10,
    "marginRight": 10,
    "height": props.available_height
  };
  var copied_dlist = _lodash["default"].cloneDeep(props.data_list);
  var _iterator7 = _createForOfIteratorHelper(copied_dlist),
    _step7;
  try {
    for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
      var option = _step7.value;
      if (typeof option["default"] == "boolean") {
        option["default"] = option["default"] ? "True" : "False";
      }
      for (var param in option) {
        if (Array.isArray(option[param])) {
          option[param] = arrayToString(option[param]);
        }
      }
    }
  } catch (err) {
    _iterator7.e(err);
  } finally {
    _iterator7.f();
  }
  return /*#__PURE__*/_react["default"].createElement(_core.Card, {
    elevation: 1,
    id: "options-pane",
    className: "d-flex flex-column",
    style: options_pane_style
  }, props.foregrounded && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.BpOrderableTable, {
    columns: cols,
    data_array: copied_dlist,
    active_row: active_row,
    handleActiveRowChange: handleActiveRowChange,
    handleChange: function handleChange(olist) {
      props.handleChange(correctOptionListTypes(olist));
    },
    selectionModes: [_table.RegionCardinality.FULL_ROWS],
    handleDeSelect: _handleRowDeSelect,
    content_editable: false
  }), /*#__PURE__*/_react["default"].createElement(OptionModuleForm, {
    handleCreate: handleCreate,
    deleteOption: _delete_option,
    active_row: active_row,
    setFormState: _setFormState,
    clearForm: _clearForm,
    form_state: form_state,
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
  var _useState5 = (0, _react.useState)(""),
    _useState6 = _slicedToArray(_useState5, 2),
    name = _useState6[0],
    set_name = _useState6[1];
  var _useState7 = (0, _react.useState)(""),
    _useState8 = _slicedToArray(_useState7, 2),
    tags = _useState8[0],
    set_tags = _useState8[1];
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
  var _useState9 = (0, _react.useState)(0),
    _useState10 = _slicedToArray(_useState9, 2),
    active_export_row = _useState10[0],
    set_active_export_row = _useState10[1];
  var _useState11 = (0, _react.useState)(0),
    _useState12 = _slicedToArray(_useState11, 2),
    active_save_row = _useState12[0],
    set_active_save_row = _useState12[1];
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
    "height": props.available_height
  };
  return /*#__PURE__*/_react["default"].createElement(_core.Card, {
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
var commands_pane_style = {
  "marginTop": 10,
  "marginLeft": 10,
  "marginRight": 10,
  "paddingTop": 10
};
function CommandsModule(props) {
  var _useState13 = (0, _react.useState)(""),
    _useState14 = _slicedToArray(_useState13, 2),
    search_string = _useState14[0],
    set_search_string = _useState14[1];
  var _useState15 = (0, _react.useState)({}),
    _useState16 = _slicedToArray(_useState15, 2),
    api_dict = _useState16[0],
    set_api_dict = _useState16[1];
  var _useState17 = (0, _react.useState)([]),
    _useState18 = _slicedToArray(_useState17, 2),
    ordered_categories = _useState18[0],
    set_ordered_categories = _useState18[1];
  var _useState19 = (0, _react.useState)({}),
    _useState20 = _slicedToArray(_useState19, 2),
    object_api_dict = _useState20[0],
    set_object_api_dict = _useState20[1];
  var _useState21 = (0, _react.useState)([]),
    _useState22 = _slicedToArray(_useState21, 2),
    ordered_object_categories = _useState22[0],
    set_ordered_object_categories = _useState22[1];
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
  var _iterator8 = _createForOfIteratorHelper(ordered_object_categories),
    _step8;
  try {
    for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
      var category = _step8.value;
      var res = /*#__PURE__*/_react["default"].createElement(ObjectCategoryEntry, {
        category_name: category,
        key: category,
        search_string: search_string,
        class_list: object_api_dict[category]
      });
      object_items.push(res);
    }
  } catch (err) {
    _iterator8.e(err);
  } finally {
    _iterator8.f();
  }
  var command_items = [];
  var _iterator9 = _createForOfIteratorHelper(ordered_categories),
    _step9;
  try {
    for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
      var _category = _step9.value;
      var _res = /*#__PURE__*/_react["default"].createElement(CategoryEntry, {
        category_name: _category,
        key: _category,
        search_string: search_string,
        command_list: api_dict[_category]
      });
      command_items.push(_res);
    }
  } catch (err) {
    _iterator9.e(err);
  } finally {
    _iterator9.f();
  }
  return /*#__PURE__*/_react["default"].createElement(_core.Card, {
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
    ref: props.commands_ref,
    style: {
      fontSize: 13,
      overflow: "auto",
      height: props.available_height
    }
  }, /*#__PURE__*/_react["default"].createElement("h4", null, "Object api"), object_items, /*#__PURE__*/_react["default"].createElement("h4", {
    style: {
      marginTop: 20
    }
  }, "TileBase methods (accessed with self)"), command_items));
}
exports.CommandsModule = CommandsModule = /*#__PURE__*/(0, _react.memo)(CommandsModule);
CommandsModule.propTypes = {
  commands_ref: _propTypes["default"].object,
  available_height: _propTypes["default"].number
};
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
  var _iterator10 = _createForOfIteratorHelper(props.class_list),
    _step10;
  try {
    for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
      var class_entry = _step10.value;
      var entries = [];
      var show_class = false;
      if (class_entry[2] == "class") {
        var show_whole_class = false;
        if (show_whole_category || stringIncludes(class_entry[0], props.search_string)) {
          show_whole_class = true;
          show_category = true;
          show_class = true;
        }
        var _iterator11 = _createForOfIteratorHelper(class_entry[1]),
          _step11;
        try {
          for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
            var entry = _step11.value;
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
          _iterator11.e(err);
        } finally {
          _iterator11.f();
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
    _iterator10.e(err);
  } finally {
    _iterator10.f();
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
  var _iterator12 = _createForOfIteratorHelper(props.command_list),
    _step12;
  try {
    for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
      var entry = _step12.value;
      if (show_whole_category || stringIncludes(entry.signature, props.search_string)) {
        show_category = true;
        entries.push( /*#__PURE__*/_react["default"].createElement(CommandEntry, _extends({
          key: index
        }, entry)));
        index += 1;
      }
    }
  } catch (err) {
    _iterator12.e(err);
  } finally {
    _iterator12.f();
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
  var _useState23 = (0, _react.useState)(false),
    _useState24 = _slicedToArray(_useState23, 2),
    isOpen = _useState24[0],
    setIsOpen = _useState24[1];
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
      (0, _toaster.doFlash)({
        message: "command copied",
        "timeout": 2000,
        "alert_type": "alert-success"
      });
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
  var _useState25 = (0, _react.useState)(null),
    _useState26 = _slicedToArray(_useState25, 2),
    currently_selected = _useState26[0],
    set_currently_selected = _useState26[1];
  var _useState27 = (0, _react.useState)(null),
    _useState28 = _slicedToArray(_useState27, 2),
    menu_created = _useState28[0],
    set_menu_created = _useState28[1];
  (0, _react.useEffect)(function () {
    if (!menu_created && props.item_list.length > 0) {
      set_current_selected(props.item_list[0].name);
      set_menu_created(true);
    }
  });
  function _buildMenu() {
    var choices = [];
    var _iterator13 = _createForOfIteratorHelper(props.item_list),
      _step13;
    try {
      for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
        var item = _step13.value;
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
      _iterator13.e(err);
    } finally {
      _iterator13.f();
    }
    return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, choices);
  }
  function _handleChange(value) {
    set_currently_selected(value);
  }
  var option_list = [];
  var _iterator14 = _createForOfIteratorHelper(props.item_list),
    _step14;
  try {
    for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
      var item = _step14.value;
      option_list.push(item.name);
    }
  } catch (err) {
    _iterator14.e(err);
  } finally {
    _iterator14.f();
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
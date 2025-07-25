"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExportModule = ExportModule;
exports.MetadataModule = MetadataModule;
exports.OptionModule = OptionModule;
exports.correctOptionListTypes = correctOptionListTypes;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
var _table = require("@blueprintjs/table");
var _blueprint_react_widgets = require("../tactic_js/blueprint_react_widgets");
var _lodash = _interopRequireDefault(require("lodash"));
var _utilities_react = require("../tactic_js/utilities_react");
var _sizing_tools = require("../tactic_js/sizing_tools");
var _blueprint_mdata_fields = require("../tactic_js/blueprint_mdata_fields");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; } // noinspection JSConstructorReturnsPrimitive
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
    set_form_state = _useStateAndRef2[1],
    form_state_ref = _useStateAndRef2[2];
  var _useSize = (0, _sizing_tools.useSize)(top_ref, props.tabSelectCounter, "OptionModule"),
    _useSize2 = _slicedToArray(_useSize, 3),
    usable_height = _useSize2[1];
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
    _useState0 = _slicedToArray(_useState9, 2),
    active_save_row = _useState0[0],
    set_active_save_row = _useState0[1];
  var _useSize3 = (0, _sizing_tools.useSize)(top_ref, props.tabSelectCounter, "ExportModule"),
    _useSize4 = _slicedToArray(_useSize3, 3),
    usable_height = _useSize4[1];
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
    className: "bp6-heading"
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
    className: "bp6-heading"
  }, "Save Attrs"), /*#__PURE__*/_react["default"].createElement(_core.Switch, {
    label: "Couple save_attrs and exports",
    className: "ml-2 mb-0 mt-1",
    size: "medium",
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
  available_height: _propTypes["default"].number
};
function MetadataModule(props) {
  props = _objectSpread({
    "tabSelectCounter": 0,
    "foregrounded": false
  }, props);
  var top_ref = /*#__PURE__*/_react["default"].createRef();
  var _useSize5 = (0, _sizing_tools.useSize)(top_ref, props.tabSelectCounter, "CreatorModule"),
    _useSize6 = _slicedToArray(_useSize5, 3),
    usable_height = _useSize6[1];
  var md_style = {
    height: "100%"
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    ref: top_ref,
    style: {
      marginLeft: 10,
      height: usable_height
    }
  }, props.foregrounded && /*#__PURE__*/_react["default"].createElement(_blueprint_mdata_fields.CombinedMetadata, _extends({}, props, {
    outer_style: md_style
  })));
}
exports.MetadataModule = MetadataModule = /*#__PURE__*/(0, _react.memo)(MetadataModule);
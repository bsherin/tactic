"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChatModule = ChatModule;
exports.CommandsModule = CommandsModule;
exports.ExportModule = ExportModule;
exports.MetadataModule = MetadataModule;
exports.OptionModule = OptionModule;
exports.correctOptionListTypes = correctOptionListTypes;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _markdownIt = _interopRequireDefault(require("markdown-it"));
require("markdown-it-latex/dist/index.css");
var _markdownItLatex = _interopRequireDefault(require("markdown-it-latex"));
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
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// noinspection JSConstructorReturnsPrimitive

const mdi = (0, _markdownIt.default)({
  html: true
});
mdi.use(_markdownItLatex.default);
function correctType(type, val) {
  let error_flag = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "__ERROR__";
  let result;
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
        let lval = val.toLowerCase();
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
  let copied_olist = _lodash.default.cloneDeep(option_list);
  for (let option of copied_olist) {
    option.default = correctType(option.type, option.default);
    // The following is needed because when reordering rows BpOrderableTable return the special_list
    // as a string
    if (option.type == "custom_list") {
      if (typeof option.special_list == 'string') {
        option.special_list = eval(option.special_list);
      }
    }
  }
  return copied_olist;
}
const option_types = ['text', 'int', 'float', 'boolean', 'textarea', 'codearea', 'column_select', 'document_select', 'list_select', 'collection_select', 'palette_select', 'pipe_select', 'custom_list', 'function_select', 'class_select', 'tile_select', 'divider', 'pool_select'];
const taggable_types = ["class_select", "function_select", "pipe_select", "list_select", "collection_select"];
function OptionModuleForm(props) {
  function _setFormState(new_state) {
    let new_form_state = Object.assign(_lodash.default.cloneDeep(props.form_state), new_state);
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
    let new_val = props.form_state.type == "boolean" ? event.target.checked : event.target.value;
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
    let new_type = event.currentTarget.value;
    let updater = {
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
    let copied_state = _lodash.default.cloneDeep(props.form_state);
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
      copied_state.default = "";
    } else {
      let val = props.form_state.default;
      let fixed_val = correctType(copied_state.type, val);
      if (fixed_val == "__ERROR__") {
        _setFormState({
          default_warning_text: "Invalid value"
        });
        return;
      } else {
        copied_state.default = fixed_val;
      }
    }
    _setFormState({
      default_warning_text: null,
      name_warning_text: null
    });
    props.handleCreate(copied_state, update);
  }
  return /*#__PURE__*/_react.default.createElement("form", null, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      padding: 25
    }
  }, /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
    style: {
      display: "flex",
      flexWrap: "wrap",
      flexDirection: "row",
      marginBottom: 20
    },
    helperText: props.form_state.update_warning_text
  }, /*#__PURE__*/_react.default.createElement(_core.Button, {
    type: "submit",
    style: {
      height: "fit-content",
      alignSelf: "start",
      marginTop: 23,
      marginRight: 5
    },
    text: "create",
    intent: "primary",
    onClick: e => {
      e.preventDefault();
      handleSubmit(false);
    }
  }), /*#__PURE__*/_react.default.createElement(_core.Button, {
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
    onClick: e => {
      e.preventDefault();
      handleSubmit(true);
    }
  }), /*#__PURE__*/_react.default.createElement(_core.Button, {
    style: {
      height: "fit-content",
      alignSelf: "start",
      marginTop: 23,
      marginRight: 5
    },
    disabled: props.active_row == null,
    text: "delete",
    intent: "danger",
    onClick: e => {
      e.preventDefault();
      props.deleteOption();
    }
  }), /*#__PURE__*/_react.default.createElement(_core.Button, {
    style: {
      height: "fit-content",
      alignSelf: "start",
      marginTop: 23,
      marginRight: 5
    },
    text: "clear",
    onClick: e => {
      e.preventDefault();
      props.clearForm();
    }
  })), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      flexDirection: "row"
    }
  }, /*#__PURE__*/_react.default.createElement(_blueprint_react_widgets.LabeledFormField, {
    label: "Name",
    onChange: handleNameChange,
    the_value: props.form_state.name,
    helperText: props.form_state.name_warning_text
  }), /*#__PURE__*/_react.default.createElement(_blueprint_react_widgets.LabeledSelectList, {
    label: "Type",
    option_list: option_types,
    onChange: handleTypeChange,
    the_value: props.form_state.type
  }), /*#__PURE__*/_react.default.createElement(_blueprint_react_widgets.LabeledFormField, {
    label: "Display Text",
    onChange: handleDisplayTextChange,
    the_value: props.form_state.display_text,
    helperText: props.form_state.display_warning_text
  }), props.form_state.type != "divider" && /*#__PURE__*/_react.default.createElement(_blueprint_react_widgets.LabeledFormField, {
    label: "Default",
    onChange: handleDefaultChange,
    the_value: props.form_state.default,
    isBool: props.form_state.type == "boolean",
    helperText: props.form_state.default_warning_text
  }), props.form_state.type == "custom_list" && /*#__PURE__*/_react.default.createElement(_blueprint_react_widgets.LabeledTextArea, {
    label: "Special List",
    onChange: handleSpecialListChange,
    the_value: arrayToTextRows(props.form_state.special_list)
  }), taggable_types.includes(props.form_state.type) && /*#__PURE__*/_react.default.createElement(_blueprint_react_widgets.LabeledFormField, {
    label: "Tag",
    onChange: handleTagChange,
    the_value: props.form_state.tags
  }), props.form_state.type == "pool_select" && /*#__PURE__*/_react.default.createElement(_blueprint_react_widgets.LabeledSelectList, {
    label: "Type",
    option_list: ["file", "folder", "both"],
    onChange: handlePoolTypeChange,
    the_value: props.form_state.pool_select_type
  }))));
}
OptionModuleForm = /*#__PURE__*/(0, _react.memo)(OptionModuleForm);
OptionModuleForm.propTypes = {
  handleCreate: _propTypes.default.func,
  deleteOption: _propTypes.default.func,
  nameExists: _propTypes.default.func,
  setFormState: _propTypes.default.func,
  clearForm: _propTypes.default.func,
  form_state: _propTypes.default.object,
  active_row: _propTypes.default.number
};
function arrayToString(ar) {
  let nstring = "[";
  let isfirst = true;
  for (let item of ar) {
    if (!isfirst) {
      nstring += ", ";
    } else {
      isfirst = false;
    }
    nstring += "'" + String(item) + "'";
  }
  nstring += "]";
  return nstring;
}
function arrayToTextRows(ar) {
  let nstring = "";
  let isfirst = true;
  for (let item of ar) {
    if (!isfirst) {
      nstring += "\n";
    } else {
      isfirst = false;
    }
    nstring += String(item);
  }
  return nstring;
}
function textRowsToArray(tstring) {
  let slist = [];
  for (let item of tstring.toString().split("\n")) {
    slist.push(item);
  }
  return slist;
}
const blank_form = {
  name: "",
  display_text: "",
  type: "text",
  default: "",
  special_list: "",
  tags: "",
  default_warning_text: null,
  name_warning_text: null
};
function OptionModule(props) {
  const top_ref = /*#__PURE__*/_react.default.createRef();
  const [active_row, set_active_row] = (0, _react.useState)(null);
  const [form_state, set_form_state] = (0, _react.useState)({
    ...blank_form
  });
  const [usable_width, usable_height, topX, topY] = (0, _sizing_tools.useSize)(top_ref, props.tabSelectCounter, "OptionModule");
  const pushCallback = (0, _utilities_react.useCallbackStack)();
  function _delete_option() {
    let new_data_list = _lodash.default.cloneDeep(props.data_list_ref.current);
    new_data_list.splice(active_row, 1);
    let old_active_row = active_row;
    props.handleChange(new_data_list, () => {
      if (old_active_row >= props.data_list_ref.current.length) {
        _handleRowDeSelect();
      } else {
        handleActiveRowChange(old_active_row);
      }
    });
  }
  function _clearHighlights() {
    let new_data_list = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    if (!new_data_list) {
      new_data_list = props.data_list_ref.current;
    }
    let newer_data_list = [];
    for (let option of new_data_list) {
      if ("className" in option && option.className) {
        let new_option = {
          ...option
        };
        new_option.className = "";
        newer_data_list.push(new_option);
      } else {
        newer_data_list.push(option);
      }
    }
    props.handleChange(newer_data_list);
  }
  function handleCreate(new_row, update) {
    let new_data_list = [...props.data_list_ref.current];
    new_row.className = "option-row-highlight";
    if (update) {
      new_data_list[active_row] = new_row;
    } else {
      new_data_list.push(new_row);
    }
    props.handleChange(new_data_list, () => {
      if (update) {
        _setFormState({
          update_warning_text: "Value Updated"
        });
      }
      setTimeout(() => {
        _clearHighlights();
        let new_form_state = Object.assign(_lodash.default.cloneDeep(form_state), {
          update_warning_text: null
        });
        _setFormState(new_form_state);
      }, 5 * 1000);
    });
  }
  function _setFormState(new_form_state) {
    set_form_state({
      ...new_form_state
    });
  }
  function _nameExists(name, update) {
    let rnum = 0;
    for (let option of props.data_list_ref.current) {
      if (option.name == name) {
        return !(update && rnum == active_row);
      }
      rnum += 1;
    }
    return false;
  }
  function handleActiveRowChange(row_index) {
    let new_form_state = Object.assign({
      ...blank_form
    }, props.data_list_ref.current[row_index]);
    set_form_state({
      ...new_form_state
    });
    set_active_row(row_index);
  }
  function _clearForm() {
    _setFormState({
      name: "",
      display_text: "",
      default: "",
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
  let options_pane_style = {
    "marginTop": 10,
    "marginLeft": 10,
    "marginRight": 10,
    "height": usable_height
  };
  let copied_dlist = props.data_list_ref.current.map(opt => {
    let new_opt = {};
    for (let col of cols) {
      if (col in opt) {
        new_opt[col] = opt[col];
      }
      if (typeof new_opt.default == "boolean") {
        new_opt.default = new_opt.default ? "True" : "False";
      }
    }
    for (let param in new_opt) {
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
  return /*#__PURE__*/_react.default.createElement(_core.Card, {
    ref: top_ref,
    elevation: 1,
    id: "options-pane",
    className: "d-flex flex-column",
    style: options_pane_style
  }, props.foregrounded && /*#__PURE__*/_react.default.createElement(_blueprint_react_widgets.BpOrderableTable, {
    columns: cols,
    data_array: copied_dlist,
    active_row: active_row,
    handleActiveRowChange: handleActiveRowChange,
    handleChange: olist => {
      props.handleChange(correctOptionListTypes(olist));
    },
    selectionModes: [_table.RegionCardinality.FULL_ROWS],
    handleDeSelect: _handleRowDeSelect,
    content_editable: false
  }), /*#__PURE__*/_react.default.createElement(OptionModuleForm, {
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
  data_list: _propTypes.default.array,
  foregrounded: _propTypes.default.bool,
  handleChange: _propTypes.default.func,
  handleNotesAppend: _propTypes.default.func,
  available_height: _propTypes.default.number
};
function ExportModuleForm(props) {
  const [name, set_name] = (0, _react.useState)("");
  const [tags, set_tags] = (0, _react.useState)("");
  function handleNameChange(event) {
    set_name(event.target.value);
  }
  function handleTagChange(event) {
    set_tags(event.target.value);
  }
  function handleSubmit() {
    props.handleCreate({
      name,
      tags
    });
  }
  return /*#__PURE__*/_react.default.createElement("form", null, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      padding: 10
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      flexDirection: "row",
      marginBottom: 20
    }
  }, /*#__PURE__*/_react.default.createElement(_core.Button, {
    style: {
      height: "fit-content",
      alignSelf: "start",
      marginTop: 23,
      marginRight: 5
    },
    text: "Create",
    type: "submit",
    intent: "primary",
    onClick: e => {
      e.preventDefault();
      handleSubmit();
    }
  }), /*#__PURE__*/_react.default.createElement(_core.Button, {
    style: {
      height: "fit-content",
      alignSelf: "start",
      marginTop: 23,
      marginRight: 5
    },
    disabled: props.active_row == null,
    text: "delete",
    intent: "danger",
    onClick: e => {
      e.preventDefault();
      props.handleDelete();
    }
  })), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      flexDirection: "row"
    }
  }, /*#__PURE__*/_react.default.createElement(_blueprint_react_widgets.LabeledFormField, {
    label: "Name",
    onChange: handleNameChange,
    the_value: name
  }), props.include_tags && /*#__PURE__*/_react.default.createElement(_blueprint_react_widgets.LabeledFormField, {
    label: "Tags",
    onChange: handleTagChange,
    the_value: tags
  }))));
}
ExportModuleForm = /*#__PURE__*/(0, _react.memo)(ExportModuleForm);
ExportModuleForm.propTypes = {
  handleCreate: _propTypes.default.func,
  handleDelete: _propTypes.default.func,
  active_row: _propTypes.default.number,
  include_tags: _propTypes.default.bool
};
function ExportModule(props) {
  const top_ref = /*#__PURE__*/_react.default.createRef();
  const [active_export_row, set_active_export_row] = (0, _react.useState)(0);
  const [active_save_row, set_active_save_row] = (0, _react.useState)(0);
  const [usable_width, usable_height, topX, topY] = (0, _sizing_tools.useSize)(top_ref, props.tabSelectCounter, "ExportModule");
  function _delete_export() {
    let new_data_list = props.export_list;
    new_data_list.splice(active_export_row, 1);
    let old_active_row = active_export_row;
    props.handleChange({
      export_list: new_data_list
    }, () => {
      if (old_active_row >= props.export_list.length) {
        set_active_export_row(null);
      } else {
        _handleActiveExportRowChange(old_active_row);
      }
    });
  }
  function _delete_save() {
    let new_data_list = props.save_list;
    new_data_list.splice(active_save_row, 1);
    let old_active_row = active_save_row;
    props.handleChange({
      additional_save_attrs: new_data_list
    }, () => {
      if (old_active_row >= props.save_list.length) {
        set_active_save_row(null);
      } else {
        _handleActiveSaveRowChange(old_active_row);
      }
    });
  }
  function _handleCreateExport(new_row) {
    let new_data_list = props.export_list;
    new_data_list.push(new_row);
    props.handleChange({
      export_list: new_data_list
    });
  }
  function _handleCreateSave(new_row) {
    let new_data_list = props.save_list;
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
  let exports_pane_style = {
    "marginTop": 10,
    "marginLeft": 10,
    "marginRight": 10,
    "height": usable_height
  };
  return /*#__PURE__*/_react.default.createElement(_core.Card, {
    ref: top_ref,
    elevation: 1,
    id: "exports-pane",
    className: "d-flex flex-column",
    style: exports_pane_style
  }, props.foregrounded && /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement("h4", {
    className: "bp5-heading"
  }, "Exports"), /*#__PURE__*/_react.default.createElement(_blueprint_react_widgets.BpOrderableTable, {
    columns: cols,
    data_array: props.export_list,
    active_row: active_export_row,
    handleActiveRowChange: _handleActiveExportRowChange,
    handleChange: _handleExportChange,
    content_editable: true
  })), /*#__PURE__*/_react.default.createElement(ExportModuleForm, {
    handleCreate: _handleCreateExport,
    handleDelete: _delete_export,
    include_tags: true,
    active_row: active_export_row
  }), /*#__PURE__*/_react.default.createElement(_core.Divider, null), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: 15
    }
  }, /*#__PURE__*/_react.default.createElement("h4", {
    className: "bp5-heading"
  }, "Save Attrs"), /*#__PURE__*/_react.default.createElement(_core.Switch, {
    label: "Couple save_attrs and exports",
    className: "ml-2 mb-0 mt-1",
    large: false,
    checked: props.couple_save_attrs_and_exports,
    onChange: _handleCoupleChange
  })), props.foregrounded && !props.couple_save_attrs_and_exports && /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(_blueprint_react_widgets.BpOrderableTable, {
    columns: ["name"],
    data_array: props.save_list,
    active_row: active_save_row,
    handleActiveRowChange: _handleActiveSaveRowChange,
    handleChange: _handleSaveChange,
    content_editable: true
  }), /*#__PURE__*/_react.default.createElement(ExportModuleForm, {
    handleCreate: _handleCreateSave,
    handleDelete: _delete_save,
    include_tags: false,
    active_row: active_save_row
  })));
}
exports.ExportModule = ExportModule = /*#__PURE__*/(0, _react.memo)(ExportModule);
ExportModule.propTypes = {
  export_list: _propTypes.default.array,
  save_list: _propTypes.default.array,
  couple_save_attrs_and_exports: _propTypes.default.bool,
  foregrounded: _propTypes.default.bool,
  handleChange: _propTypes.default.func,
  handleNotesAppend: _propTypes.default.func,
  available_height: _propTypes.default.number
};
function MetadataModule(props) {
  const top_ref = /*#__PURE__*/_react.default.createRef();
  const [usable_width, usable_height, topX, topY] = (0, _sizing_tools.useSize)(top_ref, props.tabSelectCounter, "CreatorModule");
  let md_style = {
    height: "100%"
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    ref: top_ref,
    style: {
      marginLeft: 10,
      height: usable_height
    }
  }, /*#__PURE__*/_react.default.createElement(_blueprint_mdata_fields.CombinedMetadata, (0, _extends2.default)({}, props, {
    outer_style: md_style
  })));
}
exports.MetadataModule = MetadataModule = /*#__PURE__*/(0, _react.memo)(MetadataModule);
const chat_input_style = {
  position: "relative",
  bottom: 0,
  margin: 10,
  width: "100%"
};
const idle_statuses = ["completed", "expired", "cancelled", "failed"];
function ChatModule(props) {
  const top_ref = /*#__PURE__*/_react.default.createRef(null);
  const control_ref = /*#__PURE__*/_react.default.createRef(null);
  const [item_list, set_item_list, item_list_ref] = (0, _utilities_react.useStateAndRef)([]);
  const [prompt_value, set_prompt_value, prompt_value_ref] = (0, _utilities_react.useStateAndRef)("");
  const [chat_status, set_chat_status, chat_status_ref] = (0, _utilities_react.useStateAndRef)("idle");
  const [usable_width, usable_height, topX, topY] = (0, _sizing_tools.useSize)(top_ref, props.tabSelectCounter, "ChatModule");
  const connection_status = (0, _utilities_react.useConnection)(props.tsocket, initSocket);
  function initSocket() {
    props.tsocket.attachListener("chat_response", _handleChatResponse);
    props.tsocket.attachListener("chat_status", _handleChatStatus);
  }
  function _onInputChange(event) {
    set_prompt_value(event.target.value);
  }
  function _handleChatResponse(data) {
    let converted_markdown = mdi.render(data.response);
    const new_item_list = [...item_list_ref.current, {
      kind: "response",
      text: converted_markdown
    }];
    set_item_list(new_item_list);
    set_chat_status("idle");
  }
  function _handleChatStatus(data) {
    if (idle_statuses.includes(data.status)) {
      set_chat_status("idle");
    } else {
      set_chat_status(data.status);
    }
  }
  async function _handleButton(event) {
    event.preventDefault();
    if (chat_status_ref.current == "idle") {
      await _promptSubmit();
    } else {
      await _cancelPrompt();
    }
  }
  async function _cancelPrompt() {
    try {
      await (0, _communication_react.postPromise)(props.module_viewer_id, "cancel_run_task", {});
    } catch (error) {
      console.log(error.message);
    }
  }
  async function _promptSubmit(event) {
    try {
      const new_item_list = [...item_list_ref.current, {
        kind: "prompt",
        text: prompt_value_ref.current
      }];
      set_item_list(new_item_list);
      set_prompt_value("");
      set_chat_status("posted");
      await (0, _communication_react.postPromise)(props.module_viewer_id, "post_prompt", {
        prompt: prompt_value_ref.current
      });
    } catch (error) {
      console.log(error.message);
    }
  }
  let items = item_list.map((item, index) => {
    if (item.kind == "prompt") {
      return /*#__PURE__*/_react.default.createElement(Prompt, (0, _extends2.default)({
        key: index
      }, item));
    } else {
      return /*#__PURE__*/_react.default.createElement(Response, (0, _extends2.default)({
        key: index
      }, item));
    }
  });
  let card_list_height = usable_height - 30;
  if (control_ref.current) {
    card_list_height = usable_height - 20 - control_ref.current.clientHeight;
  }
  const chat_pane_style = {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    paddingTop: 10,
    width: usable_width - 20,
    height: usable_height,
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  };
  const chat_input_style = {
    position: "relative",
    bottom: 0,
    margin: 10,
    width: usable_width - 20,
    marginLeft: 0
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "chat-module",
    ref: top_ref,
    style: chat_pane_style
  }, /*#__PURE__*/_react.default.createElement(_core.CardList, {
    bordered: false,
    style: {
      height: card_list_height
    }
  }, items), /*#__PURE__*/_react.default.createElement(_core.ControlGroup, {
    ref: control_ref,
    vertical: false,
    style: chat_input_style
  }, /*#__PURE__*/_react.default.createElement(_core.Button, {
    icon: chat_status_ref.current == "idle" ? "send-message" : "stop",
    minimal: true,
    large: true,
    onClick: _handleButton
  }), /*#__PURE__*/_react.default.createElement(_core.TextArea, {
    type: "text",
    autoResize: true,
    style: {
      width: "100%"
    },
    onChange: _onInputChange,
    large: true,
    fill: true,
    value: prompt_value_ref.current
  })));
}
exports.ChatModule = ChatModule = /*#__PURE__*/(0, _react.memo)(ChatModule);
function Prompt(props) {
  return /*#__PURE__*/_react.default.createElement(_core.Card, {
    interactive: false
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/_react.default.createElement("h6", null, "You"), /*#__PURE__*/_react.default.createElement("div", null, props.text)));
}
Prompt = /*#__PURE__*/(0, _react.memo)(Prompt);
function Response(props) {
  let converted_dict = {
    __html: props.text
  };
  return /*#__PURE__*/_react.default.createElement(_core.Card, {
    interactive: false
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/_react.default.createElement("h6", null, "ChatBot"), /*#__PURE__*/_react.default.createElement("div", {
    className: "chat-response",
    dangerouslySetInnerHTML: converted_dict
  })));
}
Response = /*#__PURE__*/(0, _react.memo)(Response);
function CommandsModule(props) {
  const top_ref = /*#__PURE__*/_react.default.createRef();
  const commandsRef = (0, _react.useRef)(null);
  const [search_string, set_search_string] = (0, _react.useState)("");
  const [api_dict, set_api_dict] = (0, _react.useState)({});
  const [ordered_categories, set_ordered_categories] = (0, _react.useState)([]);
  const [object_api_dict, set_object_api_dict] = (0, _react.useState)({});
  const [ordered_object_categories, set_ordered_object_categories] = (0, _react.useState)([]);
  const [usable_width, usable_height, topX, topY] = (0, _sizing_tools.useSize)(top_ref, props.tabSelectCounter, "CommandModule");
  (0, _react.useEffect)(() => {
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
  let object_items = [];
  for (let category of ordered_object_categories) {
    let res = /*#__PURE__*/_react.default.createElement(ObjectCategoryEntry, {
      category_name: category,
      key: category,
      search_string: search_string,
      class_list: object_api_dict[category]
    });
    object_items.push(res);
  }
  let command_items = [];
  for (let category of ordered_categories) {
    let res = /*#__PURE__*/_react.default.createElement(CategoryEntry, {
      category_name: category,
      key: category,
      search_string: search_string,
      command_list: api_dict[category]
    });
    command_items.push(res);
  }
  const commands_pane_style = {
    "marginTop": 10,
    "marginLeft": 10,
    "marginRight": 10,
    "paddingTop": 10,
    height: usable_height
  };
  return /*#__PURE__*/_react.default.createElement(_core.Card, {
    ref: top_ref,
    elevation: 1,
    id: "commands-pane",
    className: "d-flex flex-column",
    style: commands_pane_style
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      marginRight: 25
    }
  }, /*#__PURE__*/_react.default.createElement(_library_widgets.SearchForm, {
    update_search_state: _updateSearchState,
    search_string: search_string
  })), /*#__PURE__*/_react.default.createElement("div", {
    ref: commandsRef,
    style: {
      fontSize: 13,
      overflow: "auto"
    }
  }, /*#__PURE__*/_react.default.createElement("h4", null, "Object api"), object_items, /*#__PURE__*/_react.default.createElement("h4", {
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
  let classes = [];
  let show_whole_category = false;
  let show_category = false;
  if (props.search_string == "" || stringIncludes(props.category_name, props.search_string)) {
    show_whole_category = true;
    show_category = true;
  }
  let index = 0;
  for (let class_entry of props.class_list) {
    let entries = [];
    let show_class = false;
    if (class_entry[2] == "class") {
      let show_whole_class = false;
      if (show_whole_category || stringIncludes(class_entry[0], props.search_string)) {
        show_whole_class = true;
        show_category = true;
        show_class = true;
      }
      for (let entry of class_entry[1]) {
        entry["kind"] = "class_" + entry["kind"];
        let show_entry = false;
        if (show_whole_class || stringIncludes(entry.signature, props.search_string)) {
          entries.push( /*#__PURE__*/_react.default.createElement(CommandEntry, (0, _extends2.default)({
            key: `entry_${index}`
          }, entry)));
          index += 1;
          show_class = true;
          show_category = true;
        }
      }
      if (show_class) {
        classes.push( /*#__PURE__*/_react.default.createElement(_react.Fragment, {
          key: `class_${index}`
        }, /*#__PURE__*/_react.default.createElement("h6", {
          style: {
            fontStyle: "italic",
            marginTop: 20,
            fontFamily: "monospace"
          }
        }, "class" + class_entry[0]), entries));
        index += 1;
      }
    } else {
      let entry = class_entry[1];
      if (show_whole_category || stringIncludes(entry.signature, props.search_string)) {
        entries.push( /*#__PURE__*/_react.default.createElement(CommandEntry, (0, _extends2.default)({
          key: `entry_${index}`
        }, entry)));
        index += 1;
        show_category = true;
      }
    }
  }
  if (show_category) {
    return /*#__PURE__*/_react.default.createElement(_react.Fragment, {
      key: props.category_name
    }, /*#__PURE__*/_react.default.createElement("h5", {
      style: {
        marginTop: 20
      }
    }, props.category_name), classes, /*#__PURE__*/_react.default.createElement(_core.Divider, null));
  } else {
    return false;
  }
}
ObjectCategoryEntry = /*#__PURE__*/(0, _react.memo)(ObjectCategoryEntry);
ObjectCategoryEntry.propTypes = {
  category_name: _propTypes.default.string,
  class_list: _propTypes.default.array,
  search_string: _propTypes.default.string
};
function CategoryEntry(props) {
  let show_whole_category = false;
  let show_category = false;
  if (props.search_string == "" || stringIncludes(props.category_name, props.search_string)) {
    show_whole_category = true;
    show_category = true;
  }
  let entries = [];
  let index = 0;
  for (let entry of props.command_list) {
    if (show_whole_category || stringIncludes(entry.signature, props.search_string)) {
      show_category = true;
      entries.push( /*#__PURE__*/_react.default.createElement(CommandEntry, (0, _extends2.default)({
        key: index
      }, entry)));
      index += 1;
    }
  }
  if (show_category) {
    return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement("h5", {
      style: {
        marginTop: 20
      }
    }, props.category_name), entries, /*#__PURE__*/_react.default.createElement(_core.Divider, null));
  } else {
    return null;
  }
}
CategoryEntry = /*#__PURE__*/(0, _react.memo)(CategoryEntry);
CategoryEntry.propTypes = {
  category_name: _propTypes.default.string,
  command_list: _propTypes.default.array,
  search_string: _propTypes.default.string
};
function CommandEntry(props) {
  const [isOpen, setIsOpen] = (0, _react.useState)(false);
  const statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
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
  let md_style = {
    "display": "block",
    "fontSize": 13
  };
  let re = new RegExp("^([^(]*)");
  let bolded_command = props.signature.replace(re, function (matched) {
    return "<span class='command-name'>" + matched + "</span>";
  });
  return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(_core.Button, {
    minimal: true,
    outlined: isOpen,
    className: "bp5-monospace-text",
    onClick: _handleClick
  }, /*#__PURE__*/_react.default.createElement("span", {
    dangerouslySetInnerHTML: {
      __html: bolded_command
    }
  })), /*#__PURE__*/_react.default.createElement(_core.Collapse, {
    isOpen: isOpen
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      maxWidth: 700,
      position: "relative"
    }
  }, /*#__PURE__*/_react.default.createElement(_blueprint_react_widgets.GlyphButton, {
    style: {
      position: "absolute",
      right: 5,
      top: 5,
      marginTop: 0
    },
    icon: "clipboard",
    small: true,
    handleClick: _doCopy
  }), /*#__PURE__*/_react.default.createElement("div", {
    style: md_style,
    className: "notes-field-markdown-output bp5-button bp5-outlined",
    dangerouslySetInnerHTML: {
      __html: props.body
    }
  }))));
}
CommandEntry = /*#__PURE__*/(0, _react.memo)(CommandEntry);
CommandEntry.propTypes = {
  name: _propTypes.default.string,
  signature: _propTypes.default.string,
  body: _propTypes.default.string,
  kind: _propTypes.default.string
};
function ApiMenu(props) {
  const [currently_selected, set_currently_selected] = (0, _react.useState)(null);
  const [menu_created, set_menu_created] = (0, _react.useState)(null);
  (0, _react.useEffect)(() => {
    if (!menu_created && props.item_list.length > 0) {
      set_current_selected(props.item_list[0].name);
      set_menu_created(true);
    }
  });
  function _buildMenu() {
    let choices = [];
    for (let item of props.item_list) {
      if (item.kind == "header") {
        choices.push( /*#__PURE__*/_react.default.createElement(_core.MenuDivider, {
          title: item.name
        }));
      } else {
        choices.push( /*#__PURE__*/_react.default.createElement(_core.MenuItem, {
          text: item.name
        }));
      }
    }
    return /*#__PURE__*/_react.default.createElement(_core.Menu, null, choices);
  }
  function _handleChange(value) {
    set_currently_selected(value);
  }
  let option_list = [];
  for (let item of props.item_list) {
    option_list.push(item.name);
  }
  return /*#__PURE__*/_react.default.createElement(_blueprint_mdata_fields.BpSelect, {
    options: option_list,
    onChange: _handleChange,
    buttonIcon: "application",
    value: currently_selected
  });
}
ApiMenu = /*#__PURE__*/(0, _react.memo)(ApiMenu);
ApiMenu.propTypes = {
  item_list: _propTypes.default.array
};
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DialogContext = void 0;
exports.withDialogs = withDialogs;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
var _blueprint_mdata_fields = require("./blueprint_mdata_fields");
var _utilities_react = require("./utilities_react");
var _communication_react = require("./communication_react");
var _pool_tree = require("./pool_tree");
var _settings = require("./settings");
var _import_dialog = require("./import_dialog");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const DialogContext = exports.DialogContext = /*#__PURE__*/(0, _react.createContext)(null);
const dialogDict = {
  ModalDialog,
  PresentationDialog,
  ReportDialog,
  SelectDialog,
  SelectAddressDialog,
  SelectResourceDialog,
  ConfirmDialog,
  FileImportDialog: _import_dialog.FileImportDialog
};
function withDialogs(WrappedComponent) {
  function ModalFunc(props) {
    // When state was dealt with in this way updates weren't getting batched and
    // that was causinga ll sorts of problems
    const [state, setState] = (0, _react.useState)({
      modalType: null,
      dialogProps: {},
      keyCounter: 0
    });
    function showModal(modalType, newDialogProps) {
      setState({
        modalType: modalType,
        dialogProps: newDialogProps,
        keyCounter: state.keyCounter + 1
      });
    }
    function showModalPromise(modalType, newDialogProps) {
      return new Promise(function (resolve, reject) {
        newDialogProps.handleSubmit = resolve;
        newDialogProps.handleCancel = () => {
          reject("canceled");
        };
        showModal(modalType, newDialogProps);
      });
    }
    function hideModal() {
      setState({
        modalType: null,
        dialogProps: {},
        keyCounter: 0
      });
    }
    let DialogComponent = null;
    if (state.modalType in dialogDict) {
      DialogComponent = dialogDict[state.modalType];
    }
    return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(DialogContext.Provider, {
      value: {
        showModal,
        hideModal,
        showModalPromise
      }
    }, /*#__PURE__*/_react.default.createElement(WrappedComponent, props)), /*#__PURE__*/_react.default.createElement("div", null, DialogComponent && /*#__PURE__*/_react.default.createElement(DialogComponent, (0, _extends2.default)({
      key: state.keyCounter,
      isOpen: state.modalType == state.modalType
    }, state.dialogProps))));
  }
  return /*#__PURE__*/(0, _react.memo)(ModalFunc);
}
function ModalDialog(props) {
  props = {
    existing_names: [],
    default_value: "",
    checkboxes: null,
    ...props
  };
  const [checkbox_states, set_checkbox_states, checkbox_states_ref] = (0, _utilities_react.useStateAndRef)({});
  const [warning_text, set_warning_text, warning_text_ref] = (0, _utilities_react.useStateAndRef)("");
  const [current_value, set_current_value, current_value_ref] = (0, _utilities_react.useStateAndRef)(null);
  const settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  const input_ref = (0, _react.useRef)(null);
  (0, _react.useEffect)(() => {
    if (props.checkboxes != null && props.checkboxes.length != 0) {
      let checkbox_states = {};
      for (let checkbox of props.checkboxes) {
        checkbox_states[checkbox.checkname] = false;
      }
      set_checkbox_states(checkbox_states);
    }
    var default_name = props.default_value;
    var name_counter = 1;
    while (_name_exists(default_name)) {
      name_counter += 1;
      default_name = props.default_value + String(name_counter);
    }
    set_current_value(default_name);
    set_warning_text(null);
  }, []);
  function _changeHandler(event) {
    set_current_value(event.target.value);
  }
  function _checkbox_change_handler(event) {
    let val = event.target.checked;
    let new_checkbox_states = Object.assign({}, checkbox_states);
    new_checkbox_states[event.target.id] = event.target.checked;
    set_checkbox_states(new_checkbox_states);
  }
  function _name_exists(name) {
    return props.existing_names.indexOf(name) > -1;
  }
  function _submitHandler(event) {
    let msg;
    if (current_value_ref.current == "") {
      msg = "An empty name is not allowed here.";
      set_warning_text(msg);
    } else if (_name_exists(current_value_ref.current)) {
      msg = "That name already exists";
      set_warning_text(msg);
    } else {
      if (props.checkboxes != null && props.checkboxes.length != 0) {
        props.handleSubmit([current_value_ref.current, checkbox_states]);
      } else {
        props.handleSubmit(current_value_ref.current);
      }
      props.handleClose();
    }
  }
  function _cancelHandler() {
    if (props.handleCancel) {
      props.handleCancel();
    }
    props.handleClose();
  }
  function _refHandler(the_ref) {
    input_ref.current = the_ref;
  }
  let checkbox_items = [];
  if (props.checkboxes != null && props.checkboxes.length != 0) {
    for (let checkbox of props.checkboxes) {
      let new_item = /*#__PURE__*/_react.default.createElement(_core.Checkbox, {
        checked: checkbox_states[checkbox.checkname],
        label: checkbox.checktext,
        id: checkbox.checkname,
        key: checkbox.checkname,
        onChange: _checkbox_change_handler
      });
      checkbox_items.push(new_item);
    }
  }
  return /*#__PURE__*/_react.default.createElement(_core.Dialog, {
    isOpen: props.isOpen,
    className: settingsContext.isDark() ? "bp5-dark" : "",
    title: props.title,
    onClose: _cancelHandler,
    onOpened: () => {
      input_ref.current.focus();
    },
    canEscapeKeyClose: true
  }, /*#__PURE__*/_react.default.createElement("form", {
    onSubmit: _submitHandler
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: _core.Classes.DIALOG_BODY
  }, /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
    label: props.field_title,
    helperText: warning_text_ref.current
  }, /*#__PURE__*/_react.default.createElement(_core.InputGroup, {
    inputRef: _refHandler,
    onChange: _changeHandler,
    value: current_value_ref.current
  })), checkbox_items.length != 0 && checkbox_items), /*#__PURE__*/_react.default.createElement("div", {
    className: _core.Classes.DIALOG_FOOTER
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: _core.Classes.DIALOG_FOOTER_ACTIONS
  }, /*#__PURE__*/_react.default.createElement(_core.Button, {
    onClick: _cancelHandler
  }, "Cancel"), /*#__PURE__*/_react.default.createElement(_core.Button, {
    intent: _core.Intent.PRIMARY,
    onClick: _submitHandler
  }, "Submit")))));
}
ModalDialog = /*#__PURE__*/(0, _react.memo)(ModalDialog);
function PresentationDialog(props) {
  props = {
    existing_names: [],
    default_name: "",
    ...props
  };
  const [show, set_show] = (0, _react.useState)(false);
  const [save_as_collection, set_save_as_collection] = (0, _react.useState)(false);
  const [collection_name, set_collection_name, collection_name_ref] = (0, _utilities_react.useStateAndRef)(null);
  const [use_dark_theme, set_use_dark_theme] = (0, _react.useState)(null);
  const [warning_text, set_warning_text] = (0, _react.useState)("");
  const settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  const input_ref = (0, _react.useRef)(null);
  (0, _react.useEffect)(() => {
    set_show(true);
    var default_name = props.default_value;
    var name_counter = 1;
    while (_name_exists(default_name)) {
      name_counter += 1;
      default_name = props.default_value + String(name_counter);
    }
    set_collection_name(default_name);
  }, []);
  function _changeName(event) {
    set_collection_name(event.target.value);
  }
  function _changeDark(event) {
    set_use_dark_theme(event.target.checked);
  }
  function _changeSaveCollection(event) {
    set_save_as_collection(event.target.checked);
  }
  function _name_exists(name) {
    return props.existing_names.indexOf(name) > -1;
  }
  function _submitHandler(event) {
    let msg;
    if (save_as_collection) {
      if (collection_name == "") {
        msg = "An empty name is not allowed here.";
        set_warning_text(msg);
        return;
      } else if (_name_exists(collection_name)) {
        msg = "That name already exists";
        set_warning_text(msg);
        return;
      }
    }
    set_show(false);
    props.handleSubmit([use_dark_theme, save_as_collection, collection_name]);
    props.handleClose();
  }
  function _cancelHandler() {
    set_show(false);
    if (props.handleCancel) {
      props.handleCancel();
    }
    props.handleClose();
  }
  function _refHandler(the_ref) {
    input_ref.current = the_ref;
  }
  return /*#__PURE__*/_react.default.createElement(_core.Dialog, {
    isOpen: show,
    className: settingsContext.isDark() ? "bp5-dark" : "",
    title: "Create Presentation",
    onClose: _cancelHandler,
    canEscapeKeyClose: true
  }, /*#__PURE__*/_react.default.createElement("form", {
    onSubmit: _submitHandler
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: _core.Classes.DIALOG_BODY
  }, /*#__PURE__*/_react.default.createElement(_core.Checkbox, {
    checked: use_dark_theme,
    label: "Use Dark Theme",
    id: "use_dark_check",
    key: "use_dark_check",
    onChange: _changeDark
  }), /*#__PURE__*/_react.default.createElement(_core.Checkbox, {
    checked: save_as_collection,
    label: "Save As Collection",
    id: "save_as_collection",
    key: "save_as_collection",
    onChange: _changeSaveCollection
  }), save_as_collection && /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
    label: "Collection Name",
    helperText: warning_text
  }, /*#__PURE__*/_react.default.createElement(_core.InputGroup, {
    inputRef: _refHandler,
    onChange: _changeName,
    value: collection_name_ref.current
  }))), /*#__PURE__*/_react.default.createElement("div", {
    className: _core.Classes.DIALOG_FOOTER
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: _core.Classes.DIALOG_FOOTER_ACTIONS
  }, /*#__PURE__*/_react.default.createElement(_core.Button, {
    onClick: _cancelHandler
  }, "Cancel"), /*#__PURE__*/_react.default.createElement(_core.Button, {
    intent: _core.Intent.PRIMARY,
    onClick: _submitHandler
  }, "Submit")))));
}
PresentationDialog = /*#__PURE__*/(0, _react.memo)(PresentationDialog);
function ReportDialog(props) {
  props = {
    existing_names: [],
    default_name: "NewReport",
    ...props
  };
  const [show, set_show] = (0, _react.useState)(false);
  const [save_as_collection, set_save_as_collection] = (0, _react.useState)(false);
  const [collection_name, set_collection_name] = (0, _react.useState)(null);
  const [use_dark_theme, set_use_dark_theme] = (0, _react.useState)(null);
  const [warning_text, set_warning_text] = (0, _react.useState)("");
  const [collapsible, set_collapsible] = (0, _react.useState)(false);
  const [include_summaries, set_include_summaries] = (0, _react.useState)(false);
  const settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  const input_ref = (0, _react.useRef)(null);
  (0, _react.useEffect)(() => {
    set_show(true);
    var default_name = props.default_value;
    var name_counter = 1;
    while (_name_exists(default_name)) {
      name_counter += 1;
      default_name = props.default_value + String(name_counter);
    }
    set_collection_name(default_name);
  }, []);
  function _changeName(event) {
    set_collection_name(event.target.value);
  }
  function _changeDark(event) {
    set_use_dark_theme(event.target.checked);
  }
  function _changeCollapsible(event) {
    set_collapsible(event.target.checked);
  }
  function _changeIncludeSummaries(event) {
    set_include_summaries(event.target.checked);
  }
  function _changeSaveCollection(event) {
    set_save_as_collection(event.target.checked);
  }
  function _name_exists(name) {
    return props.existing_names.indexOf(name) > -1;
  }
  function _submitHandler(event) {
    let msg;
    if (save_as_collection) {
      if (collection_name == "") {
        msg = "An empty name is not allowed here.";
        set_warning_text(msg);
        return;
      } else if (_name_exists(collection_name)) {
        msg = "That name already exists";
        set_warning_text(msg);
        return;
      }
    }
    set_show(false);
    props.handleSubmit([collapsible, include_summaries, use_dark_theme, save_as_collection, collection_name]);
    props.handleClose();
  }
  function _cancelHandler() {
    set_show(false);
    if (props.handleCancel) {
      props.handleCancel();
    }
    props.handleClose();
  }
  function _refHandler(the_ref) {
    input_ref.current = the_ref;
  }
  return /*#__PURE__*/_react.default.createElement(_core.Dialog, {
    isOpen: show,
    className: settingsContext.isDark() ? "bp5-dark" : "",
    title: "Create Report",
    onClose: _cancelHandler,
    canEscapeKeyClose: true
  }, /*#__PURE__*/_react.default.createElement("form", {
    onSubmit: _submitHandler
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: _core.Classes.DIALOG_BODY
  }, /*#__PURE__*/_react.default.createElement(_core.Checkbox, {
    checked: collapsible,
    label: "Collapsible Sections",
    id: "collapse_checked",
    key: "collapse_checked",
    onChange: _changeCollapsible
  }), /*#__PURE__*/_react.default.createElement(_core.Checkbox, {
    checked: include_summaries,
    label: "Include Summaries",
    id: "include_summaries",
    key: "include_summaries",
    onChange: _changeIncludeSummaries
  }), /*#__PURE__*/_react.default.createElement(_core.Checkbox, {
    checked: use_dark_theme,
    label: "Use Dark Theme",
    id: "use_dark_check",
    key: "use_dark_check",
    onChange: _changeDark
  }), /*#__PURE__*/_react.default.createElement(_core.Checkbox, {
    checked: save_as_collection,
    label: "Save As Collection",
    id: "save_as_collection",
    key: "save_as_collection",
    onChange: _changeSaveCollection
  }), save_as_collection && /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
    label: "Collection Name",
    helperText: warning_text
  }, /*#__PURE__*/_react.default.createElement(_core.InputGroup, {
    inputRef: _refHandler,
    onChange: _changeName,
    value: collection_name
  }))), /*#__PURE__*/_react.default.createElement("div", {
    className: _core.Classes.DIALOG_FOOTER
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: _core.Classes.DIALOG_FOOTER_ACTIONS
  }, /*#__PURE__*/_react.default.createElement(_core.Button, {
    onClick: _cancelHandler
  }, "Cancel"), /*#__PURE__*/_react.default.createElement(_core.Button, {
    intent: _core.Intent.PRIMARY,
    onClick: _submitHandler
  }, "Submit")))));
}
ReportDialog = /*#__PURE__*/(0, _react.memo)(ReportDialog);
function SelectDialog(props) {
  props = {
    checkboxes: null,
    ...props
  };
  const [show, set_show] = (0, _react.useState)(false);
  const [value, set_value] = (0, _react.useState)("");
  const [checkbox_states, set_checkbox_states, checkbox_states_ref] = (0, _utilities_react.useStateAndRef)({});
  const settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  (0, _react.useEffect)(() => {
    set_show(true);
    set_value(props.option_list[0]);
    if (props.checkboxes != null && props.checkboxes.length != 0) {
      let checkbox_states = {};
      for (let checkbox of props.checkboxes) {
        if ("checked" in checkbox) {
          checkbox_states[checkbox.checkname] = checkbox.checked;
        } else {
          checkbox_states[checkbox.checkname] = false;
        }
      }
      set_checkbox_states(checkbox_states);
    }
  }, []);
  function _handleChange(val) {
    set_value(val);
  }
  function _checkbox_change_handler(event) {
    let val = event.target.checked;
    let new_checkbox_states = Object.assign({}, checkbox_states);
    new_checkbox_states[event.target.id] = event.target.checked;
    set_checkbox_states(new_checkbox_states);
  }
  function _submitHandler(event) {
    set_show(false);
    if (props.checkboxes != null && props.checkboxes.length != 0) {
      props.handleSubmit([value, checkbox_states]);
    } else {
      props.handleSubmit(value);
    }
    props.handleClose();
  }
  function _cancelHandler() {
    set_show(false);
    props.handleClose();
  }
  let checkbox_items = [];
  if (props.checkboxes != null && props.checkboxes.length != 0) {
    for (let checkbox of props.checkboxes) {
      let new_item = /*#__PURE__*/_react.default.createElement(_core.Checkbox, {
        checked: checkbox_states[checkbox.checkname],
        label: checkbox.checktext,
        id: checkbox.checkname,
        key: checkbox.checkname,
        onChange: _checkbox_change_handler,
        disabled: checkbox.disabled
      });
      checkbox_items.push(new_item);
    }
  }
  return /*#__PURE__*/_react.default.createElement(_core.Dialog, {
    isOpen: show,
    className: settingsContext.isDark() ? "bp5-dark" : "",
    title: props.title,
    onClose: _cancelHandler,
    canEscapeKeyClose: true
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: _core.Classes.DIALOG_BODY
  }, props.option_list.length > 0 && /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
    title: props.select_label
  }, /*#__PURE__*/_react.default.createElement(_blueprint_mdata_fields.BpSelect, {
    options: props.option_list,
    onChange: _handleChange,
    value: value
  })), checkbox_items.length != 0 && checkbox_items), /*#__PURE__*/_react.default.createElement("div", {
    className: _core.Classes.DIALOG_FOOTER
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: _core.Classes.DIALOG_FOOTER_ACTIONS
  }, /*#__PURE__*/_react.default.createElement(_core.Button, {
    onClick: _cancelHandler
  }, "Cancel"), /*#__PURE__*/_react.default.createElement(_core.Button, {
    intent: _core.Intent.PRIMARY,
    onClick: _submitHandler
  }, "Submit"))));
}
SelectDialog = /*#__PURE__*/(0, _react.memo)(SelectDialog);
function SelectAddressDialog(props) {
  const [show, set_show] = (0, _react.useState)(false);
  const [new_name, set_new_name] = (0, _react.useState)("");
  const [path, set_path] = (0, _react.useState)();
  const settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  (0, _react.useEffect)(() => {
    set_show(true);
    set_path(props.initial_address);
    set_new_name(props.initial_name);
  }, []);
  function _changeName(event) {
    set_new_name(event.target.value);
  }
  function _submitHandler(event) {
    set_show(false);
    if (props.showName) {
      props.handleSubmit(`${path}/${new_name}`);
    } else {
      props.handleSubmit(path);
    }
    props.handleClose();
  }
  function _cancelHandler() {
    set_show(false);
    props.handleClose();
  }
  return /*#__PURE__*/_react.default.createElement(_core.Dialog, {
    isOpen: show,
    className: settingsContext.isDark() ? "bp5-dark" : "",
    title: props.title,
    onClose: _cancelHandler,
    canEscapeKeyClose: true
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: _core.Classes.DIALOG_BODY
  }, /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
    label: `Target Directory`,
    inline: true
  }, /*#__PURE__*/_react.default.createElement(_pool_tree.PoolAddressSelector, {
    value: path,
    tsocket: props.tsocket,
    select_type: props.selectType,
    setValue: set_path
  })), props.showName && /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
    label: "New Name"
  }, /*#__PURE__*/_react.default.createElement(_core.InputGroup, {
    onChange: _changeName,
    value: new_name
  }))), /*#__PURE__*/_react.default.createElement("div", {
    className: _core.Classes.DIALOG_FOOTER
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: _core.Classes.DIALOG_FOOTER_ACTIONS
  }, /*#__PURE__*/_react.default.createElement(_core.Button, {
    onClick: _cancelHandler
  }, "Cancel"), /*#__PURE__*/_react.default.createElement(_core.Button, {
    intent: _core.Intent.PRIMARY,
    onClick: _submitHandler
  }, "Submit"))));
}
SelectAddressDialog = /*#__PURE__*/(0, _react.memo)(SelectAddressDialog);
var res_types = ["collection", "project", "tile", "list", "code"];
function SelectResourceDialog(props) {
  const [show, set_show] = (0, _react.useState)(false);
  const [value, set_value] = (0, _react.useState)(null);
  const [type, set_type] = (0, _react.useState)("collection");
  const [option_names, set_option_names] = (0, _react.useState)([]);
  const [selected_resource, set_selected_resource] = (0, _react.useState)(null);
  const settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  const pushCallback = (0, _utilities_react.useCallbackStack)();
  (0, _react.useEffect)(() => {
    console.log("I'm in useEffect");
    _handleTypeChange("collection");
  }, []);
  function _handleTypeChange(val) {
    let get_url = `get_${val}_names`;
    let dict_hash = `${val}_names`;
    console.log("about to postWithCallback");
    (0, _communication_react.postWithCallback)("host", get_url, {
      "user_id": user_id
    }, function (data) {
      console.log("returned from post");
      set_show(true);
      set_type(val);
      set_option_names(data[dict_hash]);
      set_selected_resource(data[dict_hash][0]);
    }, data => {
      console.log("got error callback");
    });
  }
  function _handleResourceChange(val) {
    set_selected_resource(val);
  }
  function _submitHandler(event) {
    set_show(false);
    pushCallback(() => {
      props.handleSubmit({
        type: type,
        selected_resource: selected_resource
      });
      props.handleClose();
    });
  }
  function _cancelHandler() {
    set_show(false);
    props.handleClose();
  }
  return /*#__PURE__*/_react.default.createElement(_core.Dialog, {
    isOpen: show,
    className: settingsContext.isDark() ? "bp5-dark" : "",
    title: "Select a library resource",
    onClose: _cancelHandler,
    canEscapeKeyClose: true
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: _core.Classes.DIALOG_BODY
  }, /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
    label: "Resource Type"
  }, /*#__PURE__*/_react.default.createElement(_blueprint_mdata_fields.BpSelect, {
    options: res_types,
    onChange: _handleTypeChange,
    value: type
  })), /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
    label: "Specific Resource"
  }, /*#__PURE__*/_react.default.createElement(_blueprint_mdata_fields.BpSelect, {
    options: option_names,
    onChange: _handleResourceChange,
    value: selected_resource
  }))), /*#__PURE__*/_react.default.createElement("div", {
    className: _core.Classes.DIALOG_FOOTER
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: _core.Classes.DIALOG_FOOTER_ACTIONS
  }, /*#__PURE__*/_react.default.createElement(_core.Button, {
    onClick: _cancelHandler
  }, "Cancel"), /*#__PURE__*/_react.default.createElement(_core.Button, {
    intent: _core.Intent.PRIMARY,
    onClick: _submitHandler
  }, "Submit"))));
}
SelectResourceDialog = /*#__PURE__*/(0, _react.memo)(SelectResourceDialog);
SelectResourceDialog.propTypes = {
  handleSubmit: _propTypes.default.func,
  handleClose: _propTypes.default.func,
  handleCancel: _propTypes.default.func,
  submit_text: _propTypes.default.string,
  cancel_text: _propTypes.default.string
};
function ConfirmDialog(props) {
  props = {
    submit_text: "Submit",
    cancel_text: "Cancel",
    handleCancel: null,
    ...props
  };
  const [show, set_show] = (0, _react.useState)(false);
  const settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  (0, _react.useEffect)(() => {
    set_show(true);
  }, []);
  function _submitHandler(event) {
    set_show(false);
    props.handleSubmit();
    props.handleClose();
  }
  function _cancelHandler() {
    set_show(false);
    props.handleClose();
    if (props.handleCancel) {
      props.handleCancel();
    }
  }
  return /*#__PURE__*/_react.default.createElement(_core.Dialog, {
    isOpen: show,
    className: settingsContext.isDark() ? "bp5-dark" : "",
    title: props.title,
    onClose: _cancelHandler,
    autoFocus: true,
    enforceFocus: true,
    usePortal: false,
    canEscapeKeyClose: true
  }, /*#__PURE__*/_react.default.createElement(_core.DialogBody, null, /*#__PURE__*/_react.default.createElement("p", null, props.text_body)), /*#__PURE__*/_react.default.createElement(_core.DialogFooter, {
    actions: /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(_core.Button, {
      onClick: _cancelHandler
    }, props.cancel_text), /*#__PURE__*/_react.default.createElement(_core.Button, {
      type: "submit",
      intent: _core.Intent.PRIMARY,
      onClick: _submitHandler
    }, props.submit_text))
  }));
}
ConfirmDialog = /*#__PURE__*/(0, _react.memo)(ConfirmDialog);
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileImportDialog = FileImportDialog;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactDropzoneComponent = _interopRequireDefault(require("react-dropzone-component"));
require("../css/dzcss/dropzone.css");
require("../css/dzcss/filepicker.css");
require("../css/dzcss/basic.css");
var _core = require("@blueprintjs/core");
var _blueprint_mdata_fields = require("./blueprint_mdata_fields.js");
var _utilities_react = require("./utilities_react");
var _server = require("react-dom/server");
var _error_drawer = require("./error_drawer");
var _pool_tree = require("./pool_tree");
var _theme = require("./theme");
var _communication_react = require("./communication_react");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
var defaultImportDialogWidth = 700;
function FileImportDialog(props) {
  const name_counter = (0, _react.useRef)(1);
  const default_name = (0, _react.useRef)("new" + props.res_type);
  const picker_ref = (0, _react.useRef)(null);
  const existing_names = (0, _react.useRef)([]);
  const current_url = (0, _react.useRef)("dummy");
  const myDropzone = (0, _react.useRef)(null);
  const [show, set_show] = (0, _react.useState)(false);
  const [current_value, set_current_value, current_value_ref] = (0, _utilities_react.useStateAndRef)(props.show_address_selector ? "mydisk" : "new" + props.res_type);
  const [checkbox_states, set_checkbox_states] = (0, _react.useState)({});
  const [warning_text, set_warning_text] = (0, _react.useState)("  ");
  const [log_open, set_log_open] = (0, _react.useState)(false);
  const [log_contents, set_log_contents] = (0, _react.useState)([]);
  const [current_picker_width, set_current_picker_width] = (0, _react.useState)(defaultImportDialogWidth - 100);

  // These will only matter if props.show_csv_options
  const [delimiter, set_delimiter] = (0, _react.useState)(",");
  const [quoting, set_quoting] = (0, _react.useState)("QUOTE_MINIMAL");
  const [skipinitialspace, set_skipinitialspace] = (0, _react.useState)(true);
  const [csv_options_open, set_csv_options_open] = (0, _react.useState)(false);
  const theme = (0, _react.useContext)(_theme.ThemeContext);
  const errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  (0, _utilities_react.useConstructor)(async () => {
    try {
      let data = await (0, _communication_react.postAjaxPromise)(`get_resource_names/${props.res_type}`);
      existing_names.current = data.resource_names;
      while (_name_exists(default_name)) {
        name_counter.current += 1;
        default_name.current = "new" + props.res_type + String(name_counter.current);
      }
      set_show(true);
    } catch (e) {
      errorDrawerFuncs.addFromError("Error getting existing names", e);
    }
  });
  (0, _react.useEffect)(() => {
    if (props.checkboxes != null && props.checkboxes.length != 0) {
      let lcheckbox_states = {};
      for (let checkbox of props.checkboxes) {
        lcheckbox_states[checkbox.checkname] = false;
      }
      set_checkbox_states(lcheckbox_states);
    }
    if (props.show_address_selector && props.initial_address) {
      set_current_value(props.initial_address);
    }
    _updatePickerSize();
    initSocket();
    return () => {
      props.tsocket.disconnect();
    };
  }, []);
  (0, _react.useEffect)(() => {
    _updatePickerSize();
  });
  function _handleResponse(entry) {
    if (entry.resource_name && entry["success"] in ["success", "partial"]) {
      existing_names.current.push(entry.resource_name);
    }
    set_log_contents([...log_contents, entry]);
    set_log_open(true);
  }
  function _handleError(file, message) {
    let xhr = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    _handleResponse({
      title: `Error for ${file.name}`,
      "content": message
    });
  }
  function _updatePickerSize() {
    if (picker_ref && picker_ref.current) {
      let new_width = picker_ref.current.offsetWidth;
      if (new_width != current_picker_width) {
        set_current_picker_width(picker_ref.current.offsetWidth);
      }
    }
  }
  function initSocket() {
    props.tsocket.attachListener("upload-response", _handleResponse);
  }
  function _checkbox_change_handler(event) {
    let val = event.target.checked;
    let new_checkbox_states = Object.assign({}, checkbox_states);
    new_checkbox_states[event.target.id] = event.target.checked;
    set_checkbox_states(new_checkbox_states);
  }
  function _closeHandler() {
    set_show(false);
    props.handleClose();
  }
  function _do_submit() {
    let msg;
    if (myDropzone.current.getQueuedFiles().length == 0) {
      return;
    }
    if (current_value == "") {
      msg = "An empty name is not allowed here.";
      set_warning_text(msg);
    } else if (_name_exists(current_value)) {
      msg = "That name already exists";
      set_warning_text(msg);
    } else {
      let csv_options;
      if (props.show_csv_options && csv_options_open) {
        csv_options = {
          delimiter: delimiter,
          quoting: quoting,
          skipinitialspace: skipinitialspace
        };
      } else {
        csv_options = null;
      }
      props.process_handler(myDropzone.current, _setCurrentUrl, current_value, checkbox_states, csv_options);
    }
  }
  function _do_clear() {
    myDropzone.current.removeAllFiles();
  }
  function _initCallback(dropzone) {
    myDropzone.current = dropzone;
    if (props.initialFiles) {
      for (let theFile of props.initialFiles) {
        dropzone.addFile(theFile);
      }
    }
  }
  function _setCurrentUrl(new_url) {
    myDropzone.current.options.url = new_url;
    current_url.current = new_url;
  }

  // There's trickiness with setting the current url in the dropzone object.
  // If I don't set it below in uploadComplete, then the second file processed
  // gets the dummy url in some cases. It's related to the component re-rendering
  // I think, perhaps when messages are shown in the dialog.

  function _uploadComplete(f) {
    if (myDropzone.current.getQueuedFiles().length > 0) {
      myDropzone.current.options.url = current_url.current;
      myDropzone.current.processQueue();
    } else if (props.after_upload) {
      props.after_upload();
    }
  }
  function _onSending(f, xhr, formData) {
    f.previewElement.scrollIntoView(false);
    formData.append("extra_value", current_value_ref.current);
    if (props.chunking) {
      formData.append("dzuuid", f.upload.uuid);
    }
  }
  function _name_exists(name) {
    return existing_names.current.indexOf(name) > -1;
  }
  function _toggleLog() {
    set_log_open(!log_open);
  }
  function _clearLog() {
    set_log_contents([]);
  }
  function _handleDrop() {
    if (myDropzone.current.getQueuedFiles().length == 0) {
      _do_clear();
    }
  }
  function _nameChangeHandler(event) {
    set_current_value(event.target.value);
    set_warning_text("  ");
  }
  function _updateDelimiter(event) {
    set_delimiter(event.target.value);
  }
  function _updateSkipinitial(event) {
    set_skipinitialspace(event.target.checked);
  }
  function _toggleCSVOptions() {
    set_csv_options_open(!csv_options_open);
  }
  let half_width = .5 * current_picker_width - 10;
  let name_style = {
    display: "inline-block",
    maxWidth: half_width
  };
  let progress_style = {
    position: "relative",
    width: half_width - 100,
    marginRight: 5,
    marginLeft: "unset",
    left: "unset",
    right: "unset"
  };
  let size_style = {
    marginLeft: 5,
    width: 75
  };
  var componentConfig = {
    postUrl: current_url.current // Must have this even though will never be used
  };
  var djsConfig = {
    uploadMultiple: false,
    parallelUploads: 1,
    maxFilesize: 2000,
    timeout: 360000,
    chunking: props.chunking,
    forceChunking: props.forceChunking,
    chunkSize: props.chunkSize,
    autoProcessQueue: false,
    dictDefaultMessage: "Click or drop files here to upload",
    acceptedFiles: props.allowed_file_types,
    // addRemoveLinks: true,
    // dictRemoveFile: "x",
    previewTemplate: (0, _server.renderToStaticMarkup)( /*#__PURE__*/_react.default.createElement("div", {
      className: "dz-preview dz-file-preview"
    }, /*#__PURE__*/_react.default.createElement("div", {
      style: name_style,
      "data-dz-name": "true"
    }), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: "flex",
        width: half_width,
        flexDirection: "row",
        justifyContent: "space-bewteen"
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "dz-progress",
      style: progress_style
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "dz-upload",
      "data-dz-uploadprogress": "true"
    })), /*#__PURE__*/_react.default.createElement("div", {
      className: "dz-success-mark",
      style: progress_style
    }, /*#__PURE__*/_react.default.createElement("span", null, "\u2714")), /*#__PURE__*/_react.default.createElement("div", {
      className: "dz-error-mark",
      style: progress_style
    }, /*#__PURE__*/_react.default.createElement("span", null, "\u2718")), /*#__PURE__*/_react.default.createElement("div", {
      style: size_style,
      "data-dz-size": "true"
    })))),
    headers: {
      'X-CSRF-TOKEN': window.csrftoken
    }
  };
  var eventHandlers;
  eventHandlers = {
    init: _initCallback,
    complete: _uploadComplete,
    sending: _onSending,
    drop: _handleDrop,
    error: _handleError
  };
  let checkbox_items = [];
  if (props.checkboxes != null && props.checkboxes.length != 0) {
    for (let checkbox of props.checkboxes) {
      let new_item = /*#__PURE__*/_react.default.createElement(_core.Checkbox, {
        checked: checkbox_states[checkbox.checkname],
        label: checkbox.checktext,
        id: checkbox.checkname,
        key: checkbox.checkname,
        inline: "true",
        alignIndicator: _core.Alignment.RIGHT,
        onChange: _checkbox_change_handler
      });
      checkbox_items.push(new_item);
    }
  }
  var log_items;
  if (log_open) {
    if (log_contents.length > 0) {
      log_items = log_contents.map((entry, index) => {
        let content_dict = {
          __html: entry.content
        };
        let has_link = false;
        return /*#__PURE__*/_react.default.createElement(_error_drawer.ErrorItem, {
          key: index,
          title: entry.title,
          content: entry.content,
          has_link: has_link
        });
      });
    } else {
      log_items = /*#__PURE__*/_react.default.createElement("div", null, "Log is empty");
    }
  }
  let body_style = {
    marginTop: 25,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    minHeight: 101
  };
  let allowed_types_string;
  if (props.allowed_file_types) {
    allowed_types_string = props.allowed_file_types.replaceAll(",", " ");
  } else {
    allowed_types_string = "any";
  }
  return /*#__PURE__*/_react.default.createElement(_core.Dialog, {
    isOpen: show,
    className: theme.dark_theme ? "import-dialog bp5-dark" : "import-dialog light-theme",
    title: props.title,
    onClose: _closeHandler,
    canOutsideClickClose: true,
    canEscapeKeyClose: true
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: _core.Classes.DIALOG_BODY
  }, /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
    helperText: `allowed types: ${allowed_types_string}`
  }, /*#__PURE__*/_react.default.createElement(_reactDropzoneComponent.default, {
    config: componentConfig,
    eventHandlers: eventHandlers,
    djsConfig: djsConfig
  })), /*#__PURE__*/_react.default.createElement("div", {
    style: body_style
  }, props.combine && /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
    label: `New ${props.res_type} name`,
    labelFor: "name-input",
    inline: true,
    helperText: warning_text
  }, /*#__PURE__*/_react.default.createElement(_core.InputGroup, {
    onChange: _nameChangeHandler,
    fill: false,
    id: "name-input",
    value: current_value
  })), checkbox_items.length != 0 && checkbox_items, props.show_csv_options && /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_core.Divider, null), /*#__PURE__*/_react.default.createElement(_core.Button, {
    onClick: _toggleCSVOptions,
    minimal: true,
    intent: "primary",
    large: true
  }, "csv options: ", csv_options_open ? "manual" : "auto"), /*#__PURE__*/_react.default.createElement(_core.Collapse, {
    isOpen: csv_options_open
  }, /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
    label: "delimiter",
    inline: true,
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/_react.default.createElement(_core.InputGroup, {
    onChange: _updateDelimiter,
    value: delimiter
  })), /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
    label: "quoting",
    inline: true
  }, /*#__PURE__*/_react.default.createElement(_blueprint_mdata_fields.BpSelect, {
    onChange: set_quoting,
    value: quoting,
    filterable: false,
    small: true,
    options: ["QUOTE_MINIMAL", "QUOTE_ALL", "QUOTE_NONNUMERIC", "QUOTE_NONE"]
  })), /*#__PURE__*/_react.default.createElement(_core.Checkbox, {
    checked: skipinitialspace,
    label: "skipinitialspace",
    inline: "true",
    alignIndicator: _core.Alignment.RIGHT,
    onChange: _updateSkipinitial
  })))), props.show_address_selector && /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
    label: `Target Directory`,
    labelFor: "name-input",
    inline: true,
    helperText: warning_text
  }, /*#__PURE__*/_react.default.createElement(_pool_tree.PoolAddressSelector, {
    value: current_value,
    tsocket: props.tsocket,
    select_type: "folder",
    setValue: set_current_value
  }))), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-evenly"
    }
  }, /*#__PURE__*/_react.default.createElement(_core.Button, {
    intent: _core.Intent.PRIMARY,
    onClick: _do_submit
  }, "Upload"), /*#__PURE__*/_react.default.createElement(_core.Button, {
    onClick: _do_clear
  }, "Clear Files")))), /*#__PURE__*/_react.default.createElement(_core.Divider, null), /*#__PURE__*/_react.default.createElement("div", {
    className: _core.Classes.DIALOG_FOOTER,
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/_react.default.createElement(_core.ButtonGroup, null, /*#__PURE__*/_react.default.createElement(_core.Button, {
    onClick: _toggleLog
  }, log_open ? "Hide" : "Show", " log"), /*#__PURE__*/_react.default.createElement(_core.Button, {
    onClick: _clearLog
  }, "Clear log")), /*#__PURE__*/_react.default.createElement(_core.Collapse, {
    isOpen: log_open
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "bp5-dialog-body"
  }, log_items))));
}
FileImportDialog.propTypes = {
  res_type: _propTypes.default.string,
  title: _propTypes.default.string,
  existing_names: _propTypes.default.array,
  process_handler: _propTypes.default.func,
  after_upload: _propTypes.default.func,
  allowed_file_types: _propTypes.default.string,
  combine: _propTypes.default.bool,
  checkboxes: _propTypes.default.array,
  textoptions: _propTypes.default.array,
  popupoptions: _propTypes.default.array,
  handleClose: _propTypes.default.func,
  tsocket: _propTypes.default.object,
  show_address_selector: _propTypes.default.bool,
  initialFiles: _propTypes.default.array
};
FileImportDialog.defaultProps = {
  checkboxes: null,
  textoptions: null,
  popupoptions: null,
  after_upload: null,
  show_address_selector: false,
  initialFiles: []
};
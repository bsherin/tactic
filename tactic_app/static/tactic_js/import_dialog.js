"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
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
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var defaultImportDialogWidth = 700;
function FileImportDialog(props) {
  var name_counter = (0, _react.useRef)(1);
  var default_name = (0, _react.useRef)("new" + props.res_type);
  var picker_ref = (0, _react.useRef)(null);
  var existing_names = (0, _react.useRef)([]);
  var current_url = (0, _react.useRef)("dummy");
  var myDropzone = (0, _react.useRef)(null);
  var _useState = (0, _react.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    show = _useState2[0],
    set_show = _useState2[1];
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)(props.show_address_selector ? "mydisk" : "new" + props.res_type),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    current_value = _useStateAndRef2[0],
    set_current_value = _useStateAndRef2[1],
    current_value_ref = _useStateAndRef2[2];
  var _useState3 = (0, _react.useState)({}),
    _useState4 = _slicedToArray(_useState3, 2),
    checkbox_states = _useState4[0],
    set_checkbox_states = _useState4[1];
  var _useState5 = (0, _react.useState)("  "),
    _useState6 = _slicedToArray(_useState5, 2),
    warning_text = _useState6[0],
    set_warning_text = _useState6[1];
  var _useState7 = (0, _react.useState)(false),
    _useState8 = _slicedToArray(_useState7, 2),
    log_open = _useState8[0],
    set_log_open = _useState8[1];
  var _useState9 = (0, _react.useState)([]),
    _useState10 = _slicedToArray(_useState9, 2),
    log_contents = _useState10[0],
    set_log_contents = _useState10[1];
  var _useState11 = (0, _react.useState)(defaultImportDialogWidth - 100),
    _useState12 = _slicedToArray(_useState11, 2),
    current_picker_width = _useState12[0],
    set_current_picker_width = _useState12[1];

  // These will only matter if props.show_csv_options
  var _useState13 = (0, _react.useState)(","),
    _useState14 = _slicedToArray(_useState13, 2),
    delimiter = _useState14[0],
    set_delimiter = _useState14[1];
  var _useState15 = (0, _react.useState)("QUOTE_MINIMAL"),
    _useState16 = _slicedToArray(_useState15, 2),
    quoting = _useState16[0],
    set_quoting = _useState16[1];
  var _useState17 = (0, _react.useState)(true),
    _useState18 = _slicedToArray(_useState17, 2),
    skipinitialspace = _useState18[0],
    set_skipinitialspace = _useState18[1];
  var _useState19 = (0, _react.useState)(false),
    _useState20 = _slicedToArray(_useState19, 2),
    csv_options_open = _useState20[0],
    set_csv_options_open = _useState20[1];
  var theme = (0, _react.useContext)(_theme.ThemeContext);
  (0, _utilities_react.useConstructor)(function () {
    $.getJSON("".concat($SCRIPT_ROOT, "get_resource_names/").concat(props.res_type), function (data) {
      existing_names.current = data.resource_names;
      while (_name_exists(default_name)) {
        name_counter.current += 1;
        default_name.current = "new" + props.res_type + String(name_counter.current);
      }
      set_show(true);
    });
  });
  (0, _react.useEffect)(function () {
    if (props.checkboxes != null && props.checkboxes.length != 0) {
      var lcheckbox_states = {};
      var _iterator = _createForOfIteratorHelper(props.checkboxes),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var checkbox = _step.value;
          lcheckbox_states[checkbox.checkname] = false;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      set_checkbox_states(lcheckbox_states);
    }
    if (props.show_address_selector && props.initial_address) {
      set_current_value(props.initial_address);
    }
    _updatePickerSize();
    initSocket();
  }, []);
  (0, _react.useEffect)(function () {
    _updatePickerSize();
  });
  function _handleResponse(entry) {
    if (entry.resource_name && entry["success"] in ["success", "partial"]) {
      existing_names.current.push(entry.resource_name);
    }
    set_log_contents([].concat(_toConsumableArray(log_contents), [entry]));
    set_log_open(true);
  }
  function _handleError(file, message) {
    var xhr = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    _handleResponse({
      title: "Error for ".concat(file.name),
      "content": message
    });
  }
  function _updatePickerSize() {
    if (picker_ref && picker_ref.current) {
      var new_width = picker_ref.current.offsetWidth;
      if (new_width != current_picker_width) {
        set_current_picker_width(picker_ref.current.offsetWidth);
      }
    }
  }
  function initSocket() {
    props.tsocket.attachListener("upload-response", _handleResponse);
  }
  function _checkbox_change_handler(event) {
    var val = event.target.checked;
    var new_checkbox_states = Object.assign({}, checkbox_states);
    new_checkbox_states[event.target.id] = event.target.checked;
    set_checkbox_states(new_checkbox_states);
  }
  function _closeHandler() {
    set_show(false);
    props.handleClose();
  }
  function _do_submit() {
    var msg;
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
      var csv_options;
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
      var _iterator2 = _createForOfIteratorHelper(props.initialFiles),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var theFile = _step2.value;
          dropzone.addFile(theFile);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
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
  var half_width = .5 * current_picker_width - 10;
  var name_style = {
    display: "inline-block",
    maxWidth: half_width
  };
  var progress_style = {
    position: "relative",
    width: half_width - 100,
    marginRight: 5,
    marginLeft: "unset",
    left: "unset",
    right: "unset"
  };
  var size_style = {
    marginLeft: 5,
    width: 75
  };
  var componentConfig = {
    postUrl: current_url.current // Must have this even though will never be used
  };

  var djsConfig = {
    uploadMultiple: false,
    parallelUploads: 1,
    autoProcessQueue: false,
    dictDefaultMessage: "Click or drop files here to upload",
    acceptedFiles: props.allowed_file_types,
    // addRemoveLinks: true,
    // dictRemoveFile: "x",
    previewTemplate: (0, _server.renderToStaticMarkup)( /*#__PURE__*/_react["default"].createElement("div", {
      className: "dz-preview dz-file-preview"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      style: name_style,
      "data-dz-name": "true"
    }), /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        display: "flex",
        width: half_width,
        flexDirection: "row",
        justifyContent: "space-bewteen"
      }
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "dz-progress",
      style: progress_style
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "dz-upload",
      "data-dz-uploadprogress": "true"
    })), /*#__PURE__*/_react["default"].createElement("div", {
      className: "dz-success-mark",
      style: progress_style
    }, /*#__PURE__*/_react["default"].createElement("span", null, "\u2714")), /*#__PURE__*/_react["default"].createElement("div", {
      className: "dz-error-mark",
      style: progress_style
    }, /*#__PURE__*/_react["default"].createElement("span", null, "\u2718")), /*#__PURE__*/_react["default"].createElement("div", {
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
  var checkbox_items = [];
  if (props.checkboxes != null && props.checkboxes.length != 0) {
    var _iterator3 = _createForOfIteratorHelper(props.checkboxes),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var checkbox = _step3.value;
        var new_item = /*#__PURE__*/_react["default"].createElement(_core.Checkbox, {
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
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
  }
  var log_items;
  if (log_open) {
    if (log_contents.length > 0) {
      log_items = log_contents.map(function (entry, index) {
        var content_dict = {
          __html: entry.content
        };
        var has_link = false;
        return /*#__PURE__*/_react["default"].createElement(_error_drawer.ErrorItem, {
          key: index,
          title: entry.title,
          content: entry.content,
          has_link: has_link
        });
      });
    } else {
      log_items = /*#__PURE__*/_react["default"].createElement("div", null, "Log is empty");
    }
  }
  var body_style = {
    marginTop: 25,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    minHeight: 101
  };
  var allowed_types_string;
  if (props.allowed_file_types) {
    allowed_types_string = props.allowed_file_types.replaceAll(",", " ");
  } else {
    allowed_types_string = "any";
  }
  return /*#__PURE__*/_react["default"].createElement(_core.Dialog, {
    isOpen: show,
    className: theme.dark_theme ? "import-dialog bp5-dark" : "import-dialog light-theme",
    title: props.title,
    onClose: _closeHandler,
    canOutsideClickClose: true,
    canEscapeKeyClose: true
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: _core.Classes.DIALOG_BODY
  }, /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    helperText: "allowed types: ".concat(allowed_types_string)
  }, /*#__PURE__*/_react["default"].createElement(_reactDropzoneComponent["default"], {
    config: componentConfig,
    eventHandlers: eventHandlers,
    djsConfig: djsConfig
  })), /*#__PURE__*/_react["default"].createElement("div", {
    style: body_style
  }, props.combine && /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "New ".concat(props.res_type, " name"),
    labelFor: "name-input",
    inline: true,
    helperText: warning_text
  }, /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
    onChange: _nameChangeHandler,
    fill: false,
    id: "name-input",
    value: current_value
  })), checkbox_items.length != 0 && checkbox_items, props.show_csv_options && /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_core.Divider, null), /*#__PURE__*/_react["default"].createElement(_core.Button, {
    onClick: _toggleCSVOptions,
    minimal: true,
    intent: "primary",
    large: true
  }, "csv options: ", csv_options_open ? "manual" : "auto"), /*#__PURE__*/_react["default"].createElement(_core.Collapse, {
    isOpen: csv_options_open
  }, /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "delimiter",
    inline: true,
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
    onChange: _updateDelimiter,
    value: delimiter
  })), /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "quoting",
    inline: true
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_mdata_fields.BpSelect, {
    onChange: set_quoting,
    value: quoting,
    filterable: false,
    small: true,
    options: ["QUOTE_MINIMAL", "QUOTE_ALL", "QUOTE_NONNUMERIC", "QUOTE_NONE"]
  })), /*#__PURE__*/_react["default"].createElement(_core.Checkbox, {
    checked: skipinitialspace,
    label: "skipinitialspace",
    inline: "true",
    alignIndicator: _core.Alignment.RIGHT,
    onChange: _updateSkipinitial
  })))), props.show_address_selector && /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "Target Directory",
    labelFor: "name-input",
    inline: true,
    helperText: warning_text
  }, /*#__PURE__*/_react["default"].createElement(_pool_tree.PoolAddressSelector, {
    value: current_value,
    tsocket: props.tsocket,
    select_type: "folder",
    setValue: set_current_value
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-evenly"
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
    intent: _core.Intent.PRIMARY,
    onClick: _do_submit
  }, "Upload"), /*#__PURE__*/_react["default"].createElement(_core.Button, {
    onClick: _do_clear
  }, "Clear Files")))), /*#__PURE__*/_react["default"].createElement(_core.Divider, null), /*#__PURE__*/_react["default"].createElement("div", {
    className: _core.Classes.DIALOG_FOOTER,
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, null, /*#__PURE__*/_react["default"].createElement(_core.Button, {
    onClick: _toggleLog
  }, log_open ? "Hide" : "Show", " log"), /*#__PURE__*/_react["default"].createElement(_core.Button, {
    onClick: _clearLog
  }, "Clear log")), /*#__PURE__*/_react["default"].createElement(_core.Collapse, {
    isOpen: log_open
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "bp5-dialog-body"
  }, log_items))));
}
FileImportDialog.propTypes = {
  res_type: _propTypes["default"].string,
  title: _propTypes["default"].string,
  existing_names: _propTypes["default"].array,
  process_handler: _propTypes["default"].func,
  after_upload: _propTypes["default"].func,
  allowed_file_types: _propTypes["default"].string,
  combine: _propTypes["default"].bool,
  checkboxes: _propTypes["default"].array,
  textoptions: _propTypes["default"].array,
  popupoptions: _propTypes["default"].array,
  handleClose: _propTypes["default"].func,
  tsocket: _propTypes["default"].object,
  show_address_selector: _propTypes["default"].bool,
  initialFiles: _propTypes["default"].array
};
FileImportDialog.defaultProps = {
  checkboxes: null,
  textoptions: null,
  popupoptions: null,
  after_upload: null,
  show_address_selector: false,
  initialFiles: []
};
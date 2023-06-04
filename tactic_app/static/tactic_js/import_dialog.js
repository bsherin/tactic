"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showFileImportDialog = showFileImportDialog;

var _react = _interopRequireDefault(require("react"));

var ReactDOM = _interopRequireWildcard(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactDropzoneComponent = _interopRequireDefault(require("react-dropzone-component"));

var _core = require("@blueprintjs/core");

var _blueprint_mdata_fields = require("./blueprint_mdata_fields.js");

var _utilities_react = require("./utilities_react.js");

var _server = require("react-dom/server");

var _error_drawer = require("./error_drawer");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var defaultImportDialogWidth = 700;

var FileImportDialog = /*#__PURE__*/function (_React$Component) {
  _inherits(FileImportDialog, _React$Component);

  var _super = _createSuper(FileImportDialog);

  function FileImportDialog(props) {
    var _this;

    _classCallCheck(this, FileImportDialog);

    _this = _super.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this));
    var initial_default_name = "new" + props.res_type;
    var name_counter = 1;
    var default_name = initial_default_name;
    _this.picker_ref = /*#__PURE__*/_react["default"].createRef();
    _this.existing_names = props.existing_names;
    _this.current_url = "dummy";

    while (_this._name_exists(default_name)) {
      name_counter += 1;
      default_name = initial_default_name + String(name_counter);
    }

    _this.state = {
      show: false,
      current_value: default_name,
      checkbox_states: {},
      warning_text: "  ",
      log_open: false,
      log_contents: [],
      current_picker_width: defaultImportDialogWidth - 100
    };

    if (_this.props.show_csv_options) {
      _this.state.delimiter = ",";
      _this.state.quoting = "QUOTE_MINIMAL";
      _this.state.skipinitialspace = true;
      _this.state.csv_options_open = false;
    }

    _this.myDropzone = null;
    _this.socket_counter = null;
    return _this;
  }

  _createClass(FileImportDialog, [{
    key: "_handleResponse",
    value: function _handleResponse(entry) {
      if (entry.resource_name && entry["success"] in ["success", "partial"]) {
        this.existing_names.push(entry.resource_name);
      }

      this.setState({
        log_contents: [].concat(_toConsumableArray(this.state.log_contents), [entry]),
        log_open: true
      });
    }
  }, {
    key: "_handleError",
    value: function _handleError(file, message) {
      var xhr = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      this._handleResponse({
        title: "Error for ".concat(file.name),
        "content": message
      });
    }
  }, {
    key: "_updatePickerSize",
    value: function _updatePickerSize() {
      if (this.picker_ref && this.picker_ref.current) {
        var new_width = this.picker_ref.current.offsetWidth;

        if (new_width != this.state.current_picker_width) {
          this.setState({
            current_picker_width: this.picker_ref.current.offsetWidth
          });
        }
      }
    }
  }, {
    key: "initSocket",
    value: function initSocket() {
      this.props.tsocket.attachListener("upload-response", this._handleResponse);
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        "show": true
      });

      if (this.props.checkboxes != null && this.props.checkboxes.length != 0) {
        var checkbox_states = {};

        var _iterator = _createForOfIteratorHelper(this.props.checkboxes),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var checkbox = _step.value;
            checkbox_states[checkbox.checkname] = false;
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        this.setState({
          checkbox_states: checkbox_states
        });
      }

      this._updatePickerSize();

      this.initSocket();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this._updatePickerSize();
    }
  }, {
    key: "_checkbox_change_handler",
    value: function _checkbox_change_handler(event) {
      var val = event.target.checked;
      var new_checkbox_states = Object.assign({}, this.state.checkbox_states);
      new_checkbox_states[event.target.id] = event.target.checked;
      this.setState({
        checkbox_states: new_checkbox_states
      });
    }
  }, {
    key: "_closeHandler",
    value: function _closeHandler() {
      this.setState({
        "show": false
      });
      this.props.handleClose();
    }
  }, {
    key: "_do_submit",
    value: function _do_submit() {
      var msg;

      if (this.myDropzone.getQueuedFiles().length == 0) {
        return;
      }

      if (this.state.current_value == "") {
        msg = "An empty name is not allowed here.";
        this.setState({
          "warning_text": msg
        });
      } else if (this._name_exists(this.state.current_value)) {
        msg = "That name already exists";
        this.setState({
          "warning_text": msg
        });
      } else {
        var csv_options;

        if (this.props.show_csv_options && this.state.csv_options_open) {
          csv_options = {
            delimiter: this.state.delimiter,
            quoting: this.state.quoting,
            skipinitialspace: this.state.skipinitialspace
          };
        } else {
          csv_options = null;
        }

        this.props.process_handler(this.myDropzone, this._setCurrentUrl, this.state.current_value, this.state.checkbox_states, csv_options);
      }
    }
  }, {
    key: "_do_clear",
    value: function _do_clear() {
      this.myDropzone.removeAllFiles();
    }
  }, {
    key: "_initCallback",
    value: function _initCallback(dropzone) {
      this.myDropzone = dropzone;
    }
  }, {
    key: "_setCurrentUrl",
    value: function _setCurrentUrl(new_url) {
      this.myDropzone.options.url = new_url;
      this.current_url = new_url;
    } // There's trickiness with setting the current url in the dropzone object.
    // If I don't set it below in uploadComplete, then the second file processed
    // gets the dummy url in some cases. It's related to the component re-rendering
    // I think, perhaps when messages are shown in the dialog.

  }, {
    key: "_uploadComplete",
    value: function _uploadComplete(f) {
      if (this.myDropzone.getQueuedFiles().length > 0) {
        this.myDropzone.options.url = this.current_url;
        this.myDropzone.processQueue();
      } else if (this.props.after_upload) {
        this.props.after_upload();
      }
    }
  }, {
    key: "_onSending",
    value: function _onSending(f) {
      f.previewElement.scrollIntoView(false);
    }
  }, {
    key: "_name_exists",
    value: function _name_exists(name) {
      return this.existing_names.indexOf(name) > -1;
    }
  }, {
    key: "_toggleLog",
    value: function _toggleLog() {
      this.setState({
        log_open: !this.state.log_open
      });
    }
  }, {
    key: "_clearLog",
    value: function _clearLog() {
      this.setState({
        log_contents: []
      });
    }
  }, {
    key: "_handleDrop",
    value: function _handleDrop() {
      if (this.myDropzone.getQueuedFiles().length == 0) {
        this._do_clear();
      }
    }
  }, {
    key: "_nameChangeHandler",
    value: function _nameChangeHandler(event) {
      this.setState({
        "current_value": event.target.value,
        warning_text: "  "
      });
    }
  }, {
    key: "_updateDelimiter",
    value: function _updateDelimiter(event) {
      this.setState({
        delimiter: event.target.value
      });
    }
  }, {
    key: "_updateQuoting",
    value: function _updateQuoting(val) {
      this.setState({
        quoting: val
      });
    }
  }, {
    key: "_updateSkipinitial",
    value: function _updateSkipinitial(event) {
      this.setState({
        skipinitialspace: event.target.checked
      });
    }
  }, {
    key: "_toggleCSVOptions",
    value: function _toggleCSVOptions() {
      this.setState({
        csv_options_open: !this.state.csv_options_open
      });
    }
  }, {
    key: "render",
    value: function render() {
      var half_width = .5 * this.state.current_picker_width - 10;
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
        postUrl: this.current_url // Must have this even though will never be used
        // iconFiletypes: this.props.allowed_file_types,
        // showFiletypeIcon: true

      };
      var djsConfig = {
        uploadMultiple: false,
        parallelUploads: 1,
        autoProcessQueue: false,
        dictDefaultMessage: "Click or drop files here to upload",
        acceptedFiles: this.props.allowed_file_types,
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
        init: this._initCallback,
        complete: this._uploadComplete,
        sending: this._onSending,
        drop: this._handleDrop,
        error: this._handleError
      };
      var checkbox_items = [];

      if (this.props.checkboxes != null && this.props.checkboxes.length != 0) {
        var _iterator2 = _createForOfIteratorHelper(this.props.checkboxes),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var checkbox = _step2.value;

            var new_item = /*#__PURE__*/_react["default"].createElement(_core.Checkbox, {
              checked: this.state.checkbox_states[checkbox.checkname],
              label: checkbox.checktext,
              id: checkbox.checkname,
              key: checkbox.checkname,
              inline: "true",
              alignIndicator: _core.Alignment.RIGHT,
              onChange: this._checkbox_change_handler
            });

            checkbox_items.push(new_item);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }

      var log_items;

      if (this.state.log_open) {
        if (this.state.log_contents.length > 0) {
          log_items = this.state.log_contents.map(function (entry, index) {
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
      var allowed_types_string = this.props.allowed_file_types.replaceAll(",", " ");
      return /*#__PURE__*/_react["default"].createElement(_core.Dialog, {
        isOpen: this.state.show,
        className: this.props.dark_theme ? "import-dialog bp4-dark" : "import-dialog light-theme",
        title: this.props.title,
        onClose: this._closeHandler,
        canOutsideClickClose: false,
        canEscapeKeyClose: false
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
      }, this.props.combine && /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
        label: "New ".concat(this.props.res_type, " name"),
        labelFor: "name-input",
        inline: true,
        helperText: this.state.warning_text
      }, /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
        onChange: this._nameChangeHandler,
        fill: false,
        id: "name-input",
        value: this.state.current_value
      })), checkbox_items.length != 0 && checkbox_items, this.props.show_csv_options && /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_core.Divider, null), /*#__PURE__*/_react["default"].createElement(_core.Button, {
        onClick: this._toggleCSVOptions,
        minimal: true,
        intent: "primary",
        large: true
      }, "csv options: ", this.state.csv_options_open ? "manual" : "auto"), /*#__PURE__*/_react["default"].createElement(_core.Collapse, {
        isOpen: this.state.csv_options_open
      }, /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
        label: "delimiter",
        inline: true,
        style: {
          marginTop: 10
        }
      }, /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
        onChange: this._updateDelimiter,
        value: this.state.delimiter
      })), /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
        label: "quoting",
        inline: true
      }, /*#__PURE__*/_react["default"].createElement(_blueprint_mdata_fields.BpSelect, {
        onChange: this._updateQuoting,
        value: this.state.quoting,
        filterable: false,
        small: true,
        options: ["QUOTE_MINIMAL", "QUOTE_ALL", "QUOTE_NONNUMERIC", "QUOTE_NONE"]
      })), /*#__PURE__*/_react["default"].createElement(_core.Checkbox, {
        checked: this.state.skipinitialspace,
        label: "skipinitialspace",
        inline: "true",
        alignIndicator: _core.Alignment.RIGHT,
        onChange: this._updateSkipinitial
      })))), /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly"
        }
      }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
        intent: _core.Intent.PRIMARY,
        onClick: this._do_submit
      }, "Upload"), /*#__PURE__*/_react["default"].createElement(_core.Button, {
        onClick: this._do_clear
      }, "Clear Files")))), /*#__PURE__*/_react["default"].createElement(_core.Divider, null), /*#__PURE__*/_react["default"].createElement("div", {
        className: _core.Classes.DIALOG_FOOTER,
        style: {
          marginTop: 10
        }
      }, /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, null, /*#__PURE__*/_react["default"].createElement(_core.Button, {
        onClick: this._toggleLog
      }, this.state.log_open ? "Hide" : "Show", " log"), /*#__PURE__*/_react["default"].createElement(_core.Button, {
        onClick: this._clearLog
      }, "Clear log")), /*#__PURE__*/_react["default"].createElement(_core.Collapse, {
        isOpen: this.state.log_open
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "bp4-dialog-body"
      }, log_items))));
    }
  }]);

  return FileImportDialog;
}(_react["default"].Component);

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
  dark_theme: _propTypes["default"].bool
};
FileImportDialog.defaultProps = {
  checkboxes: null,
  textoptions: null,
  popupoptions: null,
  after_upload: null
};

function showFileImportDialog(res_type, allowed_file_types, checkboxes, process_handler, tsocket, dark_theme) {
  var combine = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
  var show_csv_options = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : false;
  var after_upload = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : null;
  $.getJSON("".concat($SCRIPT_ROOT, "get_resource_names/").concat(res_type), function (data) {
    showTheDialog(data["resource_names"]);
  });

  function showTheDialog(existing_names) {
    var domContainer = document.querySelector('#modal-area');

    function handle_close() {
      ReactDOM.unmountComponentAtNode(domContainer);
    }

    ReactDOM.render( /*#__PURE__*/_react["default"].createElement(FileImportDialog, {
      title: "Import ".concat(res_type),
      tsocket: tsocket,
      res_type: res_type,
      allowed_file_types: allowed_file_types,
      existing_names: existing_names,
      checkboxes: checkboxes,
      process_handler: process_handler,
      combine: combine,
      show_csv_options: show_csv_options,
      dark_theme: dark_theme,
      after_upload: after_upload,
      handleClose: handle_close
    }), domContainer);
  }
}
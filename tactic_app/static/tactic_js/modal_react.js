"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SelectResourceDialog = void 0;
exports.showConfirmDialogReact = showConfirmDialogReact;
exports.showInformDialogReact = showInformDialogReact;
exports.showModalReact = showModalReact;
exports.showPresentationDialog = showPresentationDialog;
exports.showReportDialog = showReportDialog;
exports.showSelectDialog = showSelectDialog;
exports.showSelectResourceDialog = showSelectResourceDialog;
var _react = _interopRequireWildcard(require("react"));
var ReactDOM = _interopRequireWildcard(require("react-dom"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
var _blueprint_mdata_fields = require("./blueprint_mdata_fields.js");
var _utilities_react = require("./utilities_react.js");
var _communication_react = require("./communication_react.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
var ModalDialog = /*#__PURE__*/function (_React$Component) {
  _inherits(ModalDialog, _React$Component);
  var _super = _createSuper(ModalDialog);
  function ModalDialog(props) {
    var _this;
    _classCallCheck(this, ModalDialog);
    _this = _super.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this));
    var default_name = _this.props.default_value;
    var name_counter = 1;
    while (_this._name_exists(default_name)) {
      name_counter += 1;
      default_name = _this.props.default_value + String(name_counter);
    }
    _this.state = {
      show: false,
      current_value: default_name,
      checkbox_states: {},
      warning_text: ""
    };
    return _this;
  }
  _createClass(ModalDialog, [{
    key: "_changeHandler",
    value: function _changeHandler(event) {
      this.setState({
        "current_value": event.target.value
      });
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
    }
  }, {
    key: "_name_exists",
    value: function _name_exists(name) {
      return this.props.existing_names.indexOf(name) > -1;
    }
  }, {
    key: "_submitHandler",
    value: function _submitHandler(event) {
      var msg;
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
        this.setState({
          "show": false
        });
        this.props.handleSubmit(this.state.current_value, this.state.checkbox_states);
        this.props.handleClose();
      }
    }
  }, {
    key: "_cancelHandler",
    value: function _cancelHandler() {
      this.setState({
        "show": false
      });
      if (this.props.handleCancel) {
        this.props.handleCancel();
      }
      this.props.handleClose();
    }
  }, {
    key: "_refHandler",
    value: function _refHandler(the_ref) {
      this.input_ref = the_ref;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
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
      return /*#__PURE__*/_react["default"].createElement(_core.Dialog, {
        isOpen: this.state.show,
        className: window.dark_theme ? "bp4-dark" : "",
        title: this.props.title,
        onClose: this._cancelHandler,
        onOpened: function onOpened() {
          $(_this2.input_ref).focus();
        },
        canEscapeKeyClose: true
      }, /*#__PURE__*/_react["default"].createElement("form", {
        onSubmit: this._submitHandler
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: _core.Classes.DIALOG_BODY
      }, /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
        label: this.props.field_title,
        helperText: this.state.warning_text
      }, /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
        inputRef: this._refHandler,
        onChange: this._changeHandler,
        value: this.state.current_value
      })), checkbox_items.length != 0 && checkbox_items), /*#__PURE__*/_react["default"].createElement("div", {
        className: _core.Classes.DIALOG_FOOTER
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: _core.Classes.DIALOG_FOOTER_ACTIONS
      }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
        onClick: this._cancelHandler
      }, "Cancel"), /*#__PURE__*/_react["default"].createElement(_core.Button, {
        intent: _core.Intent.PRIMARY,
        onClick: this._submitHandler
      }, "Submit")))));
    }
  }]);
  return ModalDialog;
}(_react["default"].Component);
ModalDialog.propTypes = {
  handleSubmit: _propTypes["default"].func,
  handleClose: _propTypes["default"].func,
  title: _propTypes["default"].string,
  field_title: _propTypes["default"].string,
  default_value: _propTypes["default"].string,
  existing_names: _propTypes["default"].array,
  checkboxes: _propTypes["default"].array
};
ModalDialog.defaultProps = {
  existing_names: [],
  default_value: "",
  checkboxes: null
};
function showModalReact(modal_title, field_title, submit_function, default_value, existing_names) {
  var checkboxes = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
  var cancel_function = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;
  if (typeof existing_names == "undefined") {
    existing_names = [];
  }
  var domContainer = document.querySelector('#modal-area');
  function handle_close() {
    ReactDOM.unmountComponentAtNode(domContainer);
  }
  ReactDOM.render( /*#__PURE__*/_react["default"].createElement(ModalDialog, {
    handleSubmit: submit_function,
    handleCancel: cancel_function,
    handleClose: handle_close,
    title: modal_title,
    field_title: field_title,
    default_value: default_value,
    checkboxes: checkboxes,
    existing_names: existing_names
  }), domContainer);
}
var PresentationDialog = /*#__PURE__*/function (_React$Component2) {
  _inherits(PresentationDialog, _React$Component2);
  var _super2 = _createSuper(PresentationDialog);
  function PresentationDialog(props) {
    var _this3;
    _classCallCheck(this, PresentationDialog);
    _this3 = _super2.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this3));
    var default_name = _this3.props.default_name;
    var name_counter = 1;
    while (_this3._name_exists(default_name)) {
      name_counter += 1;
      default_name = _this3.props.default_value + String(name_counter);
    }
    _this3.state = {
      save_as_collection: false,
      collection_name: default_name,
      use_dark_theme: false,
      warning_text: ""
    };
    return _this3;
  }
  _createClass(PresentationDialog, [{
    key: "_changeName",
    value: function _changeName(event) {
      this.setState({
        "collection_name": event.target.value
      });
    }
  }, {
    key: "_changeDark",
    value: function _changeDark(event) {
      this.setState({
        "use_dark_theme": event.target.checked
      });
    }
  }, {
    key: "_changeSaveCollection",
    value: function _changeSaveCollection(event) {
      this.setState({
        "save_as_collection": event.target.checked
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        "show": true
      });
    }
  }, {
    key: "_name_exists",
    value: function _name_exists(name) {
      return this.props.existing_names.indexOf(name) > -1;
    }
  }, {
    key: "_submitHandler",
    value: function _submitHandler(event) {
      var msg;
      if (this.state.save_as_collection) {
        if (this.state.collection_name == "") {
          msg = "An empty name is not allowed here.";
          this.setState({
            "warning_text": msg
          });
          return;
        } else if (this._name_exists(this.state.collection_name)) {
          msg = "That name already exists";
          this.setState({
            "warning_text": msg
          });
          return;
        }
      }
      this.setState({
        "show": false
      });
      this.props.handleSubmit(this.state.use_dark_theme, this.state.save_as_collection, this.state.collection_name);
      this.props.handleClose();
    }
  }, {
    key: "_cancelHandler",
    value: function _cancelHandler() {
      this.setState({
        "show": false
      });
      if (this.props.handleCancel) {
        this.props.handleCancel();
      }
      this.props.handleClose();
    }
  }, {
    key: "_refHandler",
    value: function _refHandler(the_ref) {
      this.input_ref = the_ref;
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_core.Dialog, {
        isOpen: this.state.show,
        className: window.dark_theme ? "bp4-dark" : "",
        title: "Create Presentation",
        onClose: this._cancelHandler,
        canEscapeKeyClose: true
      }, /*#__PURE__*/_react["default"].createElement("form", {
        onSubmit: this._submitHandler
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: _core.Classes.DIALOG_BODY
      }, /*#__PURE__*/_react["default"].createElement(_core.Checkbox, {
        checked: this.state.use_dark_theme,
        label: "Use Dark Theme",
        id: "use_dark_check",
        key: "use_dark_check",
        onChange: this._changeDark
      }), /*#__PURE__*/_react["default"].createElement(_core.Checkbox, {
        checked: this.state.save_as_collection,
        label: "Save As Collection",
        id: "save_as_collection",
        key: "save_as_collection",
        onChange: this._changeSaveCollection
      }), this.state.save_as_collection && /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
        label: "Collection Name",
        helperText: this.state.warning_text
      }, /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
        inputRef: this._refHandler,
        onChange: this._changeName,
        value: this.state.collection_name
      }))), /*#__PURE__*/_react["default"].createElement("div", {
        className: _core.Classes.DIALOG_FOOTER
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: _core.Classes.DIALOG_FOOTER_ACTIONS
      }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
        onClick: this._cancelHandler
      }, "Cancel"), /*#__PURE__*/_react["default"].createElement(_core.Button, {
        intent: _core.Intent.PRIMARY,
        onClick: this._submitHandler
      }, "Submit")))));
    }
  }]);
  return PresentationDialog;
}(_react["default"].Component);
PresentationDialog.propTypes = {
  handleSubmit: _propTypes["default"].func,
  handleClose: _propTypes["default"].func,
  default_name: _propTypes["default"].string,
  existing_names: _propTypes["default"].array
};
PresentationDialog.defaultProps = {
  existing_names: [],
  default_name: ""
};
function showPresentationDialog(submit_function, existing_names) {
  var cancel_function = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  if (typeof existing_names == "undefined") {
    existing_names = [];
  }
  var domContainer = document.querySelector('#modal-area');
  function handle_close() {
    ReactDOM.unmountComponentAtNode(domContainer);
  }
  ReactDOM.render( /*#__PURE__*/_react["default"].createElement(PresentationDialog, {
    handleSubmit: submit_function,
    handleCancel: cancel_function,
    handleClose: handle_close,
    default_name: "NewPresentation",
    existing_names: existing_names
  }), domContainer);
}
var ReportDialog = /*#__PURE__*/function (_React$Component3) {
  _inherits(ReportDialog, _React$Component3);
  var _super3 = _createSuper(ReportDialog);
  function ReportDialog(props) {
    var _this4;
    _classCallCheck(this, ReportDialog);
    _this4 = _super3.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this4));
    var default_name = _this4.props.default_name;
    var name_counter = 1;
    while (_this4._name_exists(default_name)) {
      name_counter += 1;
      default_name = _this4.props.default_value + String(name_counter);
    }
    _this4.state = {
      save_as_collection: false,
      collection_name: default_name,
      use_dark_theme: false,
      collapsible: false,
      include_summaries: false,
      warning_text: ""
    };
    return _this4;
  }
  _createClass(ReportDialog, [{
    key: "_changeName",
    value: function _changeName(event) {
      this.setState({
        "collection_name": event.target.value
      });
    }
  }, {
    key: "_changeDark",
    value: function _changeDark(event) {
      this.setState({
        "use_dark_theme": event.target.checked
      });
    }
  }, {
    key: "_changeCollapsible",
    value: function _changeCollapsible(event) {
      this.setState({
        "collapsible": event.target.checked
      });
    }
  }, {
    key: "_changeIncludeSummaries",
    value: function _changeIncludeSummaries(event) {
      this.setState({
        "include_summaries": event.target.checked
      });
    }
  }, {
    key: "_changeSaveCollection",
    value: function _changeSaveCollection(event) {
      this.setState({
        "save_as_collection": event.target.checked
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        "show": true
      });
    }
  }, {
    key: "_name_exists",
    value: function _name_exists(name) {
      return this.props.existing_names.indexOf(name) > -1;
    }
  }, {
    key: "_submitHandler",
    value: function _submitHandler(event) {
      var msg;
      if (this.state.save_as_collection) {
        if (this.state.collection_name == "") {
          msg = "An empty name is not allowed here.";
          this.setState({
            "warning_text": msg
          });
          return;
        } else if (this._name_exists(this.state.collection_name)) {
          msg = "That name already exists";
          this.setState({
            "warning_text": msg
          });
          return;
        }
      }
      this.setState({
        "show": false
      });
      this.props.handleSubmit(this.state.collapsible, this.state.include_summaries, this.state.use_dark_theme, this.state.save_as_collection, this.state.collection_name);
      this.props.handleClose();
    }
  }, {
    key: "_cancelHandler",
    value: function _cancelHandler() {
      this.setState({
        "show": false
      });
      if (this.props.handleCancel) {
        this.props.handleCancel();
      }
      this.props.handleClose();
    }
  }, {
    key: "_refHandler",
    value: function _refHandler(the_ref) {
      this.input_ref = the_ref;
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_core.Dialog, {
        isOpen: this.state.show,
        className: window.dark_theme ? "bp4-dark" : "",
        title: "Create Presentation",
        onClose: this._cancelHandler,
        canEscapeKeyClose: true
      }, /*#__PURE__*/_react["default"].createElement("form", {
        onSubmit: this._submitHandler
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: _core.Classes.DIALOG_BODY
      }, /*#__PURE__*/_react["default"].createElement(_core.Checkbox, {
        checked: this.state.collapsible,
        label: "Collapsible Sections",
        id: "collapse_checked",
        key: "collapse_checked",
        onChange: this._changeCollapsible
      }), /*#__PURE__*/_react["default"].createElement(_core.Checkbox, {
        checked: this.state.include_summaries,
        label: "Include Summaries",
        id: "include_summaries",
        key: "include_summaries",
        onChange: this._changeIncludeSummaries
      }), /*#__PURE__*/_react["default"].createElement(_core.Checkbox, {
        checked: this.state.use_dark_theme,
        label: "Use Dark Theme",
        id: "use_dark_check",
        key: "use_dark_check",
        onChange: this._changeDark
      }), /*#__PURE__*/_react["default"].createElement(_core.Checkbox, {
        checked: this.state.save_as_collection,
        label: "Save As Collection",
        id: "save_as_collection",
        key: "save_as_collection",
        onChange: this._changeSaveCollection
      }), this.state.save_as_collection && /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
        label: "Collection Name",
        helperText: this.state.warning_text
      }, /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
        inputRef: this._refHandler,
        onChange: this._changeName,
        value: this.state.collection_name
      }))), /*#__PURE__*/_react["default"].createElement("div", {
        className: _core.Classes.DIALOG_FOOTER
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: _core.Classes.DIALOG_FOOTER_ACTIONS
      }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
        onClick: this._cancelHandler
      }, "Cancel"), /*#__PURE__*/_react["default"].createElement(_core.Button, {
        intent: _core.Intent.PRIMARY,
        onClick: this._submitHandler
      }, "Submit")))));
    }
  }]);
  return ReportDialog;
}(_react["default"].Component);
ReportDialog.propTypes = {
  handleSubmit: _propTypes["default"].func,
  handleClose: _propTypes["default"].func,
  default_name: _propTypes["default"].string,
  existing_names: _propTypes["default"].array
};
ReportDialog.defaultProps = {
  existing_names: [],
  default_name: "NewReport"
};
function showReportDialog(submit_function, existing_names) {
  var cancel_function = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  if (typeof existing_names == "undefined") {
    existing_names = [];
  }
  var domContainer = document.querySelector('#modal-area');
  function handle_close() {
    ReactDOM.unmountComponentAtNode(domContainer);
  }
  ReactDOM.render( /*#__PURE__*/_react["default"].createElement(ReportDialog, {
    handleSubmit: submit_function,
    handleCancel: cancel_function,
    handleClose: handle_close,
    default_name: "NewReport",
    existing_names: existing_names
  }), domContainer);
}
var SelectDialog = /*#__PURE__*/function (_React$Component4) {
  _inherits(SelectDialog, _React$Component4);
  var _super4 = _createSuper(SelectDialog);
  function SelectDialog(props) {
    var _this5;
    _classCallCheck(this, SelectDialog);
    _this5 = _super4.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this5));
    _this5.state = {
      show: false,
      value: null
    };
    return _this5;
  }
  _createClass(SelectDialog, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        "show": true,
        "value": this.props.option_list[0]
      });
    }
  }, {
    key: "_handleChange",
    value: function _handleChange(val) {
      this.setState({
        "value": val
      });
    }
  }, {
    key: "_submitHandler",
    value: function _submitHandler(event) {
      this.setState({
        "show": false
      });
      this.props.handleSubmit(this.state.value);
      this.props.handleClose();
    }
  }, {
    key: "_cancelHandler",
    value: function _cancelHandler() {
      this.setState({
        "show": false
      });
      this.props.handleClose();
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_core.Dialog, {
        isOpen: this.state.show,
        className: window.dark_theme ? "bp4-dark" : "",
        title: this.props.title,
        onClose: this._cancelHandler,
        canEscapeKeyClose: true
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: _core.Classes.DIALOG_BODY
      }, /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
        title: this.props.select_label
      }, /*#__PURE__*/_react["default"].createElement(_blueprint_mdata_fields.BpSelect, {
        options: this.props.option_list,
        onChange: this._handleChange,
        value: this.state.value
      }))), /*#__PURE__*/_react["default"].createElement("div", {
        className: _core.Classes.DIALOG_FOOTER
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: _core.Classes.DIALOG_FOOTER_ACTIONS
      }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
        onClick: this._cancelHandler
      }, "Cancel"), /*#__PURE__*/_react["default"].createElement(_core.Button, {
        intent: _core.Intent.PRIMARY,
        onClick: this._submitHandler
      }, "Submit"))));
    }
  }]);
  return SelectDialog;
}(_react["default"].Component);
SelectDialog.propTypes = {
  handleSubmit: _propTypes["default"].func,
  handleClose: _propTypes["default"].func,
  handleCancel: _propTypes["default"].func,
  title: _propTypes["default"].string,
  select_label: _propTypes["default"].string,
  option_list: _propTypes["default"].array,
  submit_text: _propTypes["default"].string,
  cancel_text: _propTypes["default"].string
};
function showSelectDialog(title, select_label, cancel_text, submit_text, submit_function, option_list) {
  var dark_theme = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
  var domContainer = document.querySelector('#modal-area');
  function handle_close() {
    ReactDOM.unmountComponentAtNode(domContainer);
  }
  ReactDOM.render( /*#__PURE__*/_react["default"].createElement(SelectDialog, {
    handleSubmit: submit_function,
    handleClose: handle_close,
    title: title,
    select_label: select_label,
    submit_text: submit_text,
    option_list: option_list,
    cancel_text: cancel_text
  }), domContainer);
}
var res_types = ["collection", "project", "tile", "list", "code"];
var SelectResourceDialog = /*#__PURE__*/function (_React$Component5) {
  _inherits(SelectResourceDialog, _React$Component5);
  var _super5 = _createSuper(SelectResourceDialog);
  function SelectResourceDialog(props) {
    var _this6;
    _classCallCheck(this, SelectResourceDialog);
    _this6 = _super5.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this6));
    _this6.state = {
      show: false,
      type: "collection",
      value: null,
      option_names: [],
      selected_resource: null
    };
    return _this6;
  }
  _createClass(SelectResourceDialog, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this._handleTypeChange("collection");
    }
  }, {
    key: "_handleTypeChange",
    value: function _handleTypeChange(val) {
      var get_url = "get_".concat(val, "_names");
      var dict_hash = "".concat(val, "_names");
      var self = this;
      (0, _communication_react.postWithCallback)("host", get_url, {
        "user_id": user_id
      }, function (data) {
        var option_names = data[dict_hash];
        self.setState({
          show: true,
          type: val,
          option_names: option_names,
          selected_resource: option_names[0]
        });
      });
    }
  }, {
    key: "_handleResourceChange",
    value: function _handleResourceChange(val) {
      this.setState({
        selected_resource: val
      });
    }
  }, {
    key: "_submitHandler",
    value: function _submitHandler(event) {
      var _this7 = this;
      this.setState({
        "show": false
      }, function () {
        _this7.props.handleSubmit({
          type: _this7.state.type,
          selected_resource: _this7.state.selected_resource
        });
        _this7.props.handleClose();
      });
    }
  }, {
    key: "_cancelHandler",
    value: function _cancelHandler() {
      this.setState({
        "show": false
      });
      this.props.handleClose();
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_core.Dialog, {
        isOpen: this.state.show,
        className: window.dark_theme ? "bp4-dark" : "",
        title: "Select a library resource",
        onClose: this._cancelHandler,
        canEscapeKeyClose: true
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: _core.Classes.DIALOG_BODY
      }, /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
        label: "Resource Type"
      }, /*#__PURE__*/_react["default"].createElement(_blueprint_mdata_fields.BpSelect, {
        options: res_types,
        onChange: this._handleTypeChange,
        value: this.state.type
      })), /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
        label: "Specific Resource"
      }, /*#__PURE__*/_react["default"].createElement(_blueprint_mdata_fields.BpSelect, {
        options: this.state.option_names,
        onChange: this._handleResourceChange,
        value: this.state.selected_resource
      }))), /*#__PURE__*/_react["default"].createElement("div", {
        className: _core.Classes.DIALOG_FOOTER
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: _core.Classes.DIALOG_FOOTER_ACTIONS
      }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
        onClick: this._cancelHandler
      }, "Cancel"), /*#__PURE__*/_react["default"].createElement(_core.Button, {
        intent: _core.Intent.PRIMARY,
        onClick: this._submitHandler
      }, "Submit"))));
    }
  }]);
  return SelectResourceDialog;
}(_react["default"].Component);
exports.SelectResourceDialog = SelectResourceDialog;
SelectResourceDialog.propTypes = {
  handleSubmit: _propTypes["default"].func,
  handleClose: _propTypes["default"].func,
  handleCancel: _propTypes["default"].func,
  submit_text: _propTypes["default"].string,
  cancel_text: _propTypes["default"].string
};
function showSelectResourceDialog(cancel_text, submit_text, submit_function) {
  var dark_theme = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var domContainer = document.querySelector('#modal-area');
  function handle_close() {
    ReactDOM.unmountComponentAtNode(domContainer);
  }
  var the_elem = /*#__PURE__*/_react["default"].createElement(SelectResourceDialog, {
    handleSubmit: submit_function,
    handleClose: handle_close,
    submit_text: submit_text,
    cancel_text: cancel_text
  });
  ReactDOM.render(the_elem, domContainer);
  // ReactDOM.render(<ConfirmDialog handleSubmit={null}
  //                                handleCancel={null}
  //                              handleClose={handle_close}
  //                              title="blah"
  //                              text_body="blip"
  //                              submit_text="mob"
  //                              cancel_text="mob2"/>, domContainer);
}
var ConfirmDialog = /*#__PURE__*/function (_React$Component6) {
  _inherits(ConfirmDialog, _React$Component6);
  var _super6 = _createSuper(ConfirmDialog);
  function ConfirmDialog(props) {
    var _this8;
    _classCallCheck(this, ConfirmDialog);
    _this8 = _super6.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this8));
    _this8.state = {
      show: false
    };
    return _this8;
  }
  _createClass(ConfirmDialog, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        "show": true
      });
    }
  }, {
    key: "_submitHandler",
    value: function _submitHandler(event) {
      this.setState({
        "show": false
      });
      this.props.handleSubmit();
      this.props.handleClose();
    }
  }, {
    key: "_cancelHandler",
    value: function _cancelHandler() {
      this.setState({
        "show": false
      });
      this.props.handleClose();
      if (this.props.handleCancel) {
        this.props.handleCancel();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var self = this;
      return /*#__PURE__*/_react["default"].createElement(_core.Dialog, {
        isOpen: this.state.show,
        className: window.dark_theme ? "bp4-dark" : "",
        title: this.props.title,
        onClose: this._cancelHandler,
        autoFocus: true,
        enforceFocus: true,
        usePortal: false,
        canEscapeKeyClose: true
      }, /*#__PURE__*/_react["default"].createElement(_core.DialogBody, null, /*#__PURE__*/_react["default"].createElement("p", null, this.props.text_body)), /*#__PURE__*/_react["default"].createElement(_core.DialogFooter, {
        actions: /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_core.Button, {
          onClick: this._cancelHandler
        }, this.props.cancel_text), /*#__PURE__*/_react["default"].createElement(_core.Button, {
          type: "submit",
          intent: _core.Intent.PRIMARY,
          onClick: this._submitHandler
        }, this.props.submit_text))
      }));
    }
  }]);
  return ConfirmDialog;
}(_react["default"].Component);
ConfirmDialog.propTypes = {
  handleSubmit: _propTypes["default"].func,
  handleCancel: _propTypes["default"].func,
  handleClose: _propTypes["default"].func,
  title: _propTypes["default"].string,
  text_body: _propTypes["default"].string,
  submit_text: _propTypes["default"].string,
  cancel_text: _propTypes["default"].string
};
ConfirmDialog.defaultProps = {
  submit_text: "Submit",
  cancel_text: "Cancel",
  handleCancel: null
};
function showConfirmDialogReact(title, text_body, cancel_text, submit_text, submit_function) {
  var cancel_function = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
  var domContainer = document.querySelector('#modal-area');
  function handle_close() {
    ReactDOM.unmountComponentAtNode(domContainer);
  }
  ReactDOM.render( /*#__PURE__*/_react["default"].createElement(ConfirmDialog, {
    handleSubmit: submit_function,
    handleCancel: cancel_function,
    handleClose: handle_close,
    title: title,
    text_body: text_body,
    submit_text: submit_text,
    cancel_text: cancel_text
  }), domContainer);
}
var InformDialog = /*#__PURE__*/function (_React$Component7) {
  _inherits(InformDialog, _React$Component7);
  var _super7 = _createSuper(InformDialog);
  function InformDialog(props) {
    var _this9;
    _classCallCheck(this, InformDialog);
    _this9 = _super7.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this9));
    _this9.state = {
      show: false
    };
    return _this9;
  }
  _createClass(InformDialog, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        "show": true
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
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_core.Dialog, {
        isOpen: this.state.show,
        className: window.dark_theme ? "bp4-dark" : "",
        title: this.props.title,
        onClose: this._closeHandler,
        canEscapeKeyClose: true
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: _core.Classes.DIALOG_BODY
      }, /*#__PURE__*/_react["default"].createElement("p", null, this.props.text_body)), /*#__PURE__*/_react["default"].createElement("div", {
        className: _core.Classes.DIALOG_FOOTER
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: _core.Classes.DIALOG_FOOTER_ACTIONS
      }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
        onClick: this._closeHandler
      }, "Okay"))));
    }
  }]);
  return InformDialog;
}(_react["default"].Component);
InformDialog.propTypes = {
  handleClose: _propTypes["default"].func,
  title: _propTypes["default"].string,
  text_body: _propTypes["default"].string,
  close_text: _propTypes["default"].string
};
function showInformDialogReact(title, text_body) {
  var close_text = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "Okay";
  var domContainer = document.querySelector('#modal-area');
  function handle_close() {
    ReactDOM.unmountComponentAtNode(domContainer);
  }
  ReactDOM.render( /*#__PURE__*/_react["default"].createElement(ConfirmDialog, {
    handleClose: handle_close,
    title: title,
    text_body: text_body,
    close_text: close_text
  }), domContainer);
}
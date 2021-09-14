"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showModalReact = showModalReact;
exports.showConfirmDialogReact = showConfirmDialogReact;
exports.showSelectDialog = showSelectDialog;
exports.showSelectResourceDialog = showSelectResourceDialog;
exports.showInformDialogReact = showInformDialogReact;
exports.SelectResourceDialog = void 0;

var _react = _interopRequireDefault(require("react"));

var ReactDOM = _interopRequireWildcard(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _core = require("@blueprintjs/core");

var _blueprint_mdata_fields = require("./blueprint_mdata_fields.js");

var _utilities_react = require("./utilities_react.js");

var _communication_react = require("./communication_react.js");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

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

    while (_this.name_exists(default_name)) {
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
            checkbox_states[checkbox.id] = false;
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
    key: "name_exists",
    value: function name_exists(name) {
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
      } else if (this.name_exists(this.state.current_value)) {
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
        className: window.dark_theme ? "bp3-dark" : "",
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

var SelectDialog = /*#__PURE__*/function (_React$Component2) {
  _inherits(SelectDialog, _React$Component2);

  var _super2 = _createSuper(SelectDialog);

  function SelectDialog(props) {
    var _this3;

    _classCallCheck(this, SelectDialog);

    _this3 = _super2.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this3));
    _this3.state = {
      show: false,
      value: null
    };
    return _this3;
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
        className: window.dark_theme ? "bp3-dark" : "",
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

var SelectResourceDialog = /*#__PURE__*/function (_React$Component3) {
  _inherits(SelectResourceDialog, _React$Component3);

  var _super3 = _createSuper(SelectResourceDialog);

  function SelectResourceDialog(props) {
    var _this4;

    _classCallCheck(this, SelectResourceDialog);

    _this4 = _super3.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this4));
    _this4.state = {
      show: false,
      type: "collection",
      value: null,
      option_names: [],
      selected_resource: null
    };
    return _this4;
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
      var _this5 = this;

      this.setState({
        "show": false
      }, function () {
        _this5.props.handleSubmit({
          type: _this5.state.type,
          selected_resource: _this5.state.selected_resource
        });

        _this5.props.handleClose();
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
        className: window.dark_theme ? "bp3-dark" : "",
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

  ReactDOM.render(the_elem, domContainer); // ReactDOM.render(<ConfirmDialog handleSubmit={null}
  //                                handleCancel={null}
  //                              handleClose={handle_close}
  //                              title="blah"
  //                              text_body="blip"
  //                              submit_text="mob"
  //                              cancel_text="mob2"/>, domContainer);
}

var ConfirmDialog = /*#__PURE__*/function (_React$Component4) {
  _inherits(ConfirmDialog, _React$Component4);

  var _super4 = _createSuper(ConfirmDialog);

  function ConfirmDialog(props) {
    var _this6;

    _classCallCheck(this, ConfirmDialog);

    _this6 = _super4.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this6));
    _this6.state = {
      show: false
    };
    return _this6;
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
      return /*#__PURE__*/_react["default"].createElement(_core.Dialog, {
        isOpen: this.state.show,
        className: window.dark_theme ? "bp3-dark" : "",
        title: this.props.title,
        onClose: this._cancelHandler,
        canEscapeKeyClose: true
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: _core.Classes.DIALOG_BODY
      }, /*#__PURE__*/_react["default"].createElement("p", null, this.props.text_body)), /*#__PURE__*/_react["default"].createElement("div", {
        className: _core.Classes.DIALOG_FOOTER
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: _core.Classes.DIALOG_FOOTER_ACTIONS
      }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
        onClick: this._cancelHandler
      }, this.props.cancel_text), /*#__PURE__*/_react["default"].createElement(_core.Button, {
        intent: _core.Intent.PRIMARY,
        onClick: this._submitHandler
      }, this.props.submit_text))));
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

var InformDialog = /*#__PURE__*/function (_React$Component5) {
  _inherits(InformDialog, _React$Component5);

  var _super5 = _createSuper(InformDialog);

  function InformDialog(props) {
    var _this7;

    _classCallCheck(this, InformDialog);

    _this7 = _super5.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this7));
    _this7.state = {
      show: false
    };
    return _this7;
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
        className: window.dark_theme ? "bp3-dark" : "",
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
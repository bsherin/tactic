"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TileForm = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _core = require("@blueprintjs/core");

var _lodash = _interopRequireDefault(require("lodash"));

var _reactCodemirror = require("./react-codemirror.js");

var _blueprint_mdata_fields = require("./blueprint_mdata_fields.js");

var _utilities_react = require("./utilities_react.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

var selector_types = ["column_select", "tokenizer_select", "weight_function_select", "cluster_metric", "tile_select", "document_select", "list_select", "collection_select", "function_select", "class_select", "palette_select", "custom_list"];
var selector_type_icons = {
  column_select: "one-column",
  tokenizer_select: "function",
  weight_function_select: "function",
  cluster_metric: "function",
  tile_select: "application",
  document_select: "document",
  list_select: "properties",
  collection_select: "database",
  function_select: "function",
  class_select: "code",
  palette_select: "tint",
  custom_list: "property"
};

var TileForm = /*#__PURE__*/function (_React$Component) {
  _inherits(TileForm, _React$Component);

  var _super = _createSuper(TileForm);

  function TileForm(props) {
    var _this;

    _classCallCheck(this, TileForm);

    _this = _super.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(TileForm, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      return !(0, _utilities_react.propsAreEqual)(nextProps, this.props);
    }
  }, {
    key: "_updateValue",
    value: function _updateValue(att_name, new_value) {
      this.props.updateValue(att_name, new_value);
    }
  }, {
    key: "_submitOptions",
    value: function _submitOptions(e) {
      this.props.handleSubmit(this.props.tile_id);
      e.preventDefault();
    }
  }, {
    key: "render",
    value: function render() {
      var option_items = [];

      var _iterator = _createForOfIteratorHelper(this.props.options),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var option = _step.value;
          if ("visible" in option && !option["visible"]) continue;
          var att_name = option["name"];

          if (selector_types.includes(option["type"])) {
            option_items.push( /*#__PURE__*/_react["default"].createElement(SelectOption, {
              att_name: att_name,
              key: att_name,
              choice_list: option["option_list"],
              value: option.starting_value,
              buttonIcon: selector_type_icons[option["type"]],
              updateValue: this._updateValue
            }));
          } else switch (option["type"]) {
            case "pipe_select":
              option_items.push( /*#__PURE__*/_react["default"].createElement(PipeOption, {
                att_name: att_name,
                key: att_name,
                value: _lodash["default"].cloneDeep(option.starting_value),
                pipe_dict: _lodash["default"].cloneDeep(option["pipe_dict"]),
                updateValue: this._updateValue
              }));
              break;

            case "boolean":
              option_items.push( /*#__PURE__*/_react["default"].createElement(BoolOption, {
                att_name: att_name,
                key: att_name,
                value: option.starting_value,
                updateValue: this._updateValue
              }));
              break;

            case "textarea":
              option_items.push( /*#__PURE__*/_react["default"].createElement(TextAreaOption, {
                att_name: att_name,
                key: att_name,
                value: option.starting_value,
                updateValue: this._updateValue
              }));
              break;

            case "codearea":
              option_items.push( /*#__PURE__*/_react["default"].createElement(CodeAreaOption, {
                att_name: att_name,
                key: att_name,
                value: option.starting_value,
                updateValue: this._updateValue
              }));
              break;

            case "text":
              option_items.push( /*#__PURE__*/_react["default"].createElement(TextOption, {
                att_name: att_name,
                key: att_name,
                value: option.starting_value,
                leftIcon: "paragraph",
                updateValue: this._updateValue
              }));
              break;

            case "int":
              option_items.push( /*#__PURE__*/_react["default"].createElement(IntOption, {
                att_name: att_name,
                key: att_name,
                value: option.starting_value,
                updateValue: this._updateValue
              }));
              break;

            case "float":
              option_items.push( /*#__PURE__*/_react["default"].createElement(FloatOption, {
                att_name: att_name,
                key: att_name,
                value: option.starting_value,
                updateValue: this._updateValue
              }));
              break;

            case "divider":
              option_items.push( /*#__PURE__*/_react["default"].createElement(DividerOption, {
                att_name: att_name,
                key: att_name
              }));
              break;

            default:
              break;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("form", {
        className: "form-display-area",
        onSubmit: this._submitOptions
      }, option_items), /*#__PURE__*/_react["default"].createElement(_core.Button, {
        text: "Submit",
        intent: "primary",
        onClick: this._submitOptions
      }));
    }
  }]);

  return TileForm;
}(_react["default"].Component);

exports.TileForm = TileForm;
TileForm.propTypes = {
  tile_id: _propTypes["default"].string,
  options: _propTypes["default"].array,
  handleSubmit: _propTypes["default"].func,
  updateValue: _propTypes["default"].func
};

var DividerOption = /*#__PURE__*/function (_React$Component2) {
  _inherits(DividerOption, _React$Component2);

  var _super2 = _createSuper(DividerOption);

  function DividerOption(props) {
    var _this2;

    _classCallCheck(this, DividerOption);

    _this2 = _super2.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this2));
    return _this2;
  }

  _createClass(DividerOption, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      return !(0, _utilities_react.propsAreEqual)(nextProps, this.props);
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "tile-form-divider",
        style: {
          marginTop: 25,
          marginBottom: 15
        }
      }, /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          paddingLeft: 20,
          fontSize: 25
        }
      }, this.props.att_name), /*#__PURE__*/_react["default"].createElement(_core.Divider, null));
    }
  }]);

  return DividerOption;
}(_react["default"].Component);

DividerOption.propTypes = {
  att_name: _propTypes["default"].string
};

var TextOption = /*#__PURE__*/function (_React$Component3) {
  _inherits(TextOption, _React$Component3);

  var _super3 = _createSuper(TextOption);

  function TextOption(props) {
    var _this3;

    _classCallCheck(this, TextOption);

    _this3 = _super3.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this3));
    return _this3;
  }

  _createClass(TextOption, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      return !(0, _utilities_react.propsAreEqual)(nextProps, this.props);
    }
  }, {
    key: "_updateMe",
    value: function _updateMe(event) {
      this.props.updateValue(this.props.att_name, event.target.value);
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
        label: this.props.att_name
      }, /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
        asyncControl: true,
        type: "text",
        small: false,
        leftIcon: this.props.leftIcon,
        onChange: this._updateMe,
        value: this.props.value
      }));
    }
  }]);

  return TextOption;
}(_react["default"].Component);

TextOption.propTypes = {
  att_name: _propTypes["default"].string,
  value: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
  updateValue: _propTypes["default"].func,
  leftIcon: _propTypes["default"].string
};

var IntOption = /*#__PURE__*/function (_React$Component4) {
  _inherits(IntOption, _React$Component4);

  var _super4 = _createSuper(IntOption);

  function IntOption(props) {
    var _this4;

    _classCallCheck(this, IntOption);

    _this4 = _super4.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this4));
    return _this4;
  }

  _createClass(IntOption, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      return !(0, _utilities_react.propsAreEqual)(nextProps, this.props);
    }
  }, {
    key: "_updateMe",
    value: function _updateMe(att_name, val) {
      if (val.length == 0 || !isNaN(Number(val)) && !isNaN(parseInt(val))) {
        this.props.updateValue(this.props.att_name, val);
      }
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(TextOption, {
        att_name: this.props.att_name,
        leftIcon: "numerical",
        key: this.props.att_name,
        value: this.props.value,
        updateValue: this._updateMe
      });
    }
  }]);

  return IntOption;
}(_react["default"].Component);

IntOption.propTypes = {
  att_name: _propTypes["default"].string,
  value: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
  updateValue: _propTypes["default"].func
};

var FloatOption = /*#__PURE__*/function (_React$Component5) {
  _inherits(FloatOption, _React$Component5);

  var _super5 = _createSuper(FloatOption);

  function FloatOption(props) {
    var _this5;

    _classCallCheck(this, FloatOption);

    _this5 = _super5.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this5));
    return _this5;
  }

  _createClass(FloatOption, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      return !(0, _utilities_react.propsAreEqual)(nextProps, this.props);
    }
  }, {
    key: "_updateMe",
    value: function _updateMe(att_name, val) {
      if (val.length == 0 || val == "." || !isNaN(Number(val)) && !isNaN(parseFloat(val))) {
        this.props.updateValue(this.props.att_name, val);
      }
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(TextOption, {
        att_name: this.props.att_name,
        leftIcon: "numerical",
        key: this.props.att_name,
        value: this.props.value,
        updateValue: this._updateMe
      });
    }
  }]);

  return FloatOption;
}(_react["default"].Component);

FloatOption.propTypes = {
  att_name: _propTypes["default"].string,
  value: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
  updateValue: _propTypes["default"].func
};

var BoolOption = /*#__PURE__*/function (_React$Component6) {
  _inherits(BoolOption, _React$Component6);

  var _super6 = _createSuper(BoolOption);

  function BoolOption(props) {
    var _this6;

    _classCallCheck(this, BoolOption);

    _this6 = _super6.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this6));
    return _this6;
  }

  _createClass(BoolOption, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      return !(0, _utilities_react.propsAreEqual)(nextProps, this.props);
    }
  }, {
    key: "_updateMe",
    value: function _updateMe(event) {
      this.props.updateValue(this.props.att_name, event.target.checked);
    }
  }, {
    key: "boolify",
    value: function boolify(the_var) {
      if (typeof the_var == "boolean") {
        return the_var;
      }

      return the_var == "True" || the_var == "true";
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_core.Switch, {
        label: this.props.att_name,
        checked: this.boolify(this.props.value),
        onChange: this._updateMe,
        innerLabel: "False",
        innerLabelChecked: "True",
        alignIndicator: "center"
      });
    }
  }]);

  return BoolOption;
}(_react["default"].Component);

BoolOption.propTypes = {
  att_name: _propTypes["default"].string,
  value: _propTypes["default"].oneOfType([_propTypes["default"].bool, _propTypes["default"].string]),
  updateValue: _propTypes["default"].func
};

var CodeAreaOption = /*#__PURE__*/function (_React$Component7) {
  _inherits(CodeAreaOption, _React$Component7);

  var _super7 = _createSuper(CodeAreaOption);

  function CodeAreaOption(props) {
    var _this7;

    _classCallCheck(this, CodeAreaOption);

    _this7 = _super7.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this7));
    return _this7;
  }

  _createClass(CodeAreaOption, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      return !(0, _utilities_react.propsAreEqual)(nextProps, this.props);
    }
  }, {
    key: "_updateMe",
    value: function _updateMe(newval) {
      this.props.updateValue(this.props.att_name, newval);
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
        label: this.props.att_name
      }, /*#__PURE__*/_react["default"].createElement(_reactCodemirror.ReactCodemirror, {
        handleChange: this._updateMe,
        code_content: this.props.value,
        saveMe: null,
        code_container_height: 100
      }));
    }
  }]);

  return CodeAreaOption;
}(_react["default"].Component);

CodeAreaOption.propTypes = {
  att_name: _propTypes["default"].string,
  value: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
  updateValue: _propTypes["default"].func
};

var TextAreaOption = /*#__PURE__*/function (_React$Component8) {
  _inherits(TextAreaOption, _React$Component8);

  var _super8 = _createSuper(TextAreaOption);

  function TextAreaOption(props) {
    var _this8;

    _classCallCheck(this, TextAreaOption);

    _this8 = _super8.call(this, props);

    _defineProperty(_assertThisInitialized(_this8), "_setCursorPositions", function () {
      //reset the cursor position for input
      _this8.inputRef.current.selectionStart = _this8.cursor;
      _this8.inputRef.current.selectionEnd = _this8.cursor;
    });

    (0, _utilities_react.doBinding)(_assertThisInitialized(_this8));
    _this8.inputRef = /*#__PURE__*/_react["default"].createRef();
    _this8.cursor = null;
    return _this8;
  }

  _createClass(TextAreaOption, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      return !(0, _utilities_react.propsAreEqual)(nextProps, this.props);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this._setCursorPositions();
    }
  }, {
    key: "_updateMe",
    value: function _updateMe(event) {
      this.cursor = event.target.selectionStart;
      this.props.updateValue(this.props.att_name, event.target.value);
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
        label: this.props.att_name
      }, /*#__PURE__*/_react["default"].createElement(_core.TextArea, {
        onChange: this._updateMe,
        inputRef: this.inputRef,
        small: false,
        value: this.props.value
      }));
    }
  }]);

  return TextAreaOption;
}(_react["default"].Component);

TextAreaOption.propTypes = {
  att_name: _propTypes["default"].string,
  value: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
  updateValue: _propTypes["default"].func
};

var SelectOption = /*#__PURE__*/function (_React$Component9) {
  _inherits(SelectOption, _React$Component9);

  var _super9 = _createSuper(SelectOption);

  function SelectOption(props) {
    var _this9;

    _classCallCheck(this, SelectOption);

    _this9 = _super9.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this9));
    return _this9;
  }

  _createClass(SelectOption, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      return !(0, _utilities_react.propsAreEqual)(nextProps, this.props);
    }
  }, {
    key: "_updateMe",
    value: function _updateMe(val) {
      this.props.updateValue(this.props.att_name, val);
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
        label: this.props.att_name
      }, /*#__PURE__*/_react["default"].createElement(_blueprint_mdata_fields.BpSelect, {
        onChange: this._updateMe,
        value: this.props.value,
        buttonIcon: this.props.buttonIcon,
        options: this.props.choice_list
      }));
    }
  }]);

  return SelectOption;
}(_react["default"].Component);

SelectOption.propTypes = {
  att_name: _propTypes["default"].string,
  choice_list: _propTypes["default"].array,
  buttonIcon: _propTypes["default"].string,
  value: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
  updateValue: _propTypes["default"].func
};

var PipeOption = /*#__PURE__*/function (_React$Component10) {
  _inherits(PipeOption, _React$Component10);

  var _super10 = _createSuper(PipeOption);

  function PipeOption(props) {
    var _this10;

    _classCallCheck(this, PipeOption);

    _this10 = _super10.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this10));
    return _this10;
  }

  _createClass(PipeOption, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      return !(0, _utilities_react.propsAreEqual)(nextProps, this.props);
    }
  }, {
    key: "_updateMe",
    value: function _updateMe(item) {
      this.props.updateValue(this.props.att_name, item["value"]);
    }
  }, {
    key: "create_choice_list",
    value: function create_choice_list() {
      var choice_list = [];

      for (var group in this.props.pipe_dict) {
        choice_list.push({
          text: group,
          value: group + "_group",
          isgroup: true
        });

        var _iterator2 = _createForOfIteratorHelper(this.props.pipe_dict[group]),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var entry = _step2.value;
            choice_list.push({
              text: entry[1],
              value: entry[0],
              isgroup: false
            });
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }

      return choice_list;
    }
  }, {
    key: "_value_dict",
    value: function _value_dict() {
      var value_dict = {};

      for (var group in this.props.pipe_dict) {
        var _iterator3 = _createForOfIteratorHelper(this.props.pipe_dict[group]),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var entry = _step3.value;
            value_dict[entry[0]] = entry[1];
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }

      return value_dict;
    }
  }, {
    key: "render",
    value: function render() {
      var vdict = this._value_dict();

      var full_value = {
        text: vdict[this.props.value],
        value: this.props.value,
        isgroup: false
      };
      return /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
        label: this.props.att_name
      }, /*#__PURE__*/_react["default"].createElement(_blueprint_mdata_fields.BpSelectAdvanced, {
        onChange: this._updateMe,
        value: full_value,
        buttonIcon: "flow-end",
        options: this.create_choice_list()
      }));
    }
  }]);

  return PipeOption;
}(_react["default"].Component);

PipeOption.propTypes = {
  att_name: _propTypes["default"].string,
  pipe_dict: _propTypes["default"].object,
  value: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
  updateValue: _propTypes["default"].func
};

var PipeOptionOld = /*#__PURE__*/function (_React$Component11) {
  _inherits(PipeOptionOld, _React$Component11);

  var _super11 = _createSuper(PipeOptionOld);

  function PipeOptionOld(props) {
    var _this11;

    _classCallCheck(this, PipeOptionOld);

    _this11 = _super11.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this11));
    return _this11;
  }

  _createClass(PipeOptionOld, [{
    key: "_updateMe",
    value: function _updateMe(event) {
      this.props.updateValue(this.props.att_name, event.target.value);
    }
  }, {
    key: "create_groups",
    value: function create_groups() {
      var groups = [];

      for (var group in this.props.pipe_dict) {
        groups.push( /*#__PURE__*/_react["default"].createElement("optgroup", {
          key: group,
          label: group
        }, this.props.pipe_dict[group].map(function (entry) {
          return /*#__PURE__*/_react["default"].createElement("option", {
            key: entry[1],
            value: entry[0]
          }, entry[1]);
        })));
      }

      return groups;
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
        label: this.props.att_name
      }, /*#__PURE__*/_react["default"].createElement(_core.HTMLSelect, {
        onChange: this._updateMe,
        value: this.props.value
      }, this.create_groups()));
    }
  }]);

  return PipeOptionOld;
}(_react["default"].Component);

PipeOptionOld.propTypes = {
  att_name: _propTypes["default"].string,
  pipe_dict: _propTypes["default"].object,
  value: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
  updateValue: _propTypes["default"].func
};
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ToolbarButton = exports.Toolbar = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
var _key_trap = require("./key_trap.js");
var _blueprint_react_widgets = require("./blueprint_react_widgets.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
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
var default_button_class = "btn-outline-secondary";
var intent_colors = {
  danger: "#c23030",
  warning: "#bf7326",
  primary: "#106ba3",
  success: "#0d8050",
  regular: "#5c7080"
};
var ToolbarButton = /*#__PURE__*/function (_React$Component) {
  _inherits(ToolbarButton, _React$Component);
  var _super = _createSuper(ToolbarButton);
  function ToolbarButton(props) {
    _classCallCheck(this, ToolbarButton);
    return _super.call(this, props);
  }
  _createClass(ToolbarButton, [{
    key: "render",
    value: function render() {
      var _this = this;
      if (this.props.show_text) {
        return /*#__PURE__*/_react["default"].createElement(_core.Button, {
          text: this.props.name_text,
          icon: this.props.icon_name,
          large: false,
          minimal: false,
          onClick: function onClick() {
            return _this.props.click_handler();
          }
          // className="bp-toolbar-button bp5-elevation-0"
        });
      } else {
        return /*#__PURE__*/_react["default"].createElement(_core.Button, {
          icon: this.props.icon_name
          // intent={this.props.intent == "regular" ? "primary" : this.props.intent}
          ,
          large: false,
          minimal: false,
          onClick: function onClick() {
            return _this.props.click_handler();
          },
          className: "bp-toolbar-button bp5-elevation-0"
        });
      }
    }
  }]);
  return ToolbarButton;
}(_react["default"].Component);
exports.ToolbarButton = ToolbarButton;
ToolbarButton.propTypes = {
  show_text: _propTypes["default"].bool,
  icon_name: _propTypes["default"].string,
  click_handler: _propTypes["default"].func,
  button_class: _propTypes["default"].string,
  name_text: _propTypes["default"].string,
  small_size: _propTypes["default"].bool,
  intent: _propTypes["default"].string
};
ToolbarButton.defaultProps = {
  small_size: true,
  intent: "regular",
  show_text: false
};
exports.ToolbarButton = ToolbarButton = (0, _blueprint_react_widgets.withTooltip)(ToolbarButton);
var Toolbar = /*#__PURE__*/function (_React$Component2) {
  _inherits(Toolbar, _React$Component2);
  var _super2 = _createSuper(Toolbar);
  function Toolbar(props) {
    var _this2;
    _classCallCheck(this, Toolbar);
    _this2 = _super2.call(this, props);
    _this2.tb_ref = /*#__PURE__*/_react["default"].createRef();
    return _this2;
  }
  _createClass(Toolbar, [{
    key: "get_button_class",
    value: function get_button_class(but) {
      if (but.button_class == undefined) {
        return default_button_class;
      } else {
        return but.button_class;
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.sendRef) {
        this.props.sendRef(this.tb_ref);
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (this.props.sendRef) {
        this.props.sendRef(this.tb_ref);
      }
    }
  }, {
    key: "getTooltip",
    value: function getTooltip(item) {
      return item.tooltip ? item.tooltip : null;
    }
  }, {
    key: "getTooltipDelay",
    value: function getTooltipDelay(item) {
      return item.tooltipDelay ? item.tooltipDelay : null;
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;
      var items = [];
      var group_counter = 0;
      var _iterator = _createForOfIteratorHelper(this.props.button_groups),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var group = _step.value;
          var group_items = group.map(function (button, index) {
            return /*#__PURE__*/_react["default"].createElement(ToolbarButton, {
              name_text: button.name_text,
              icon_name: button.icon_name,
              show_text: button.show_text,
              tooltip: _this3.getTooltip(button),
              tooltipDeleay: _this3.getTooltipDelay(button),
              click_handler: button.click_handler,
              intent: button.hasOwnProperty("intent") ? button.intent : "regular",
              key: index
            });
          });
          items.push( /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, {
            large: false,
            style: {
              justifyContent: "center"
            },
            className: "toolbar-button-group",
            role: "group",
            key: group_counter
          }, group_items));
          group_counter += 1;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      var key_bindings = [];
      var _iterator2 = _createForOfIteratorHelper(this.props.button_groups),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _group = _step2.value;
          var _iterator3 = _createForOfIteratorHelper(_group),
            _step3;
          try {
            var _loop = function _loop() {
              var button = _step3.value;
              if (button.hasOwnProperty("key_bindings")) key_bindings.push([button.key_bindings, function () {
                return button.click_handler();
              }]);
            };
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              _loop();
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      var outer_style;
      if (this.props.alternate_outer_style) {
        outer_style = this.props.alternate_outer_style;
      } else {
        outer_style = {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          marginBottom: 10,
          whiteSpace: "nowrap"
        };
      }
      return /*#__PURE__*/_react["default"].createElement("div", {
        style: outer_style
      }, /*#__PURE__*/_react["default"].createElement("div", {
        ref: this.tb_ref
      }, items), /*#__PURE__*/_react["default"].createElement(_key_trap.KeyTrap, {
        global: true,
        active: !this.props.controlled || this.props.am_selected,
        bindings: key_bindings
      }));
    }
  }]);
  return Toolbar;
}(_react["default"].Component);
exports.Toolbar = Toolbar;
Toolbar.propTypes = {
  button_groups: _propTypes["default"].array,
  alternate_outer_style: _propTypes["default"].object,
  inputRef: _propTypes["default"].func,
  tsocket: _propTypes["default"].object,
  dark_theme: _propTypes["default"].bool
};
Toolbar.defaultProps = {
  controlled: false,
  am_selected: true,
  alternate_outer_style: null,
  sendRef: null,
  tsocket: null
};
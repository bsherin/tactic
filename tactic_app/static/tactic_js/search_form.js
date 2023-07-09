"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FilterSearchForm = void 0;
var _utilities_react = require("./utilities_react");
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
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
var FilterSearchForm = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(FilterSearchForm, _React$PureComponent);
  var _super = _createSuper(FilterSearchForm);
  function FilterSearchForm(props, context) {
    var _this;
    _classCallCheck(this, FilterSearchForm);
    _this = _super.call(this, props, context);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this));
    return _this;
  }
  _createClass(FilterSearchForm, [{
    key: "_handleSubmit",
    value: function _handleSubmit(e) {
      this.props.searchNext();
      e.preventDefault();
    }
  }, {
    key: "render",
    value: function render() {
      var self = this;
      return /*#__PURE__*/_react["default"].createElement("form", {
        onSubmit: self._handleSubmit,
        id: "console-search-form",
        className: "d-flex flex-row bp5-form-group",
        style: {
          justifyContent: "flex-end",
          marginRight: this.props.margin_right,
          marginBottom: 6,
          marginTop: 12
        }
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "d-flex flex-column"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "d-flex flex-row"
      }, /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
        type: "search",
        leftIcon: "search",
        placeholder: "Search",
        small: true,
        value: !this.props.search_string ? "" : this.props.search_string,
        onChange: this.props.handleSearchFieldChange,
        autoCapitalize: "none",
        autoCorrect: "off",
        className: "mr-2"
      }), /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, null, this.props.handleFilter && /*#__PURE__*/_react["default"].createElement(_core.Button, {
        onClick: this.props.handleFilter,
        small: true
      }, "Filter"), this.props.handleUnFilter && /*#__PURE__*/_react["default"].createElement(_core.Button, {
        onClick: this.props.handleUnFilter,
        small: true
      }, "Clear"), this.props.searchNext && /*#__PURE__*/_react["default"].createElement(_core.Button, {
        onClick: this.props.searchNext,
        icon: "caret-down",
        text: undefined,
        small: true
      }), this.props.searchPrevious && /*#__PURE__*/_react["default"].createElement(_core.Button, {
        onClick: this.props.searchPrevious,
        icon: "caret-up",
        text: undefined,
        small: true
      }))), /*#__PURE__*/_react["default"].createElement("div", {
        className: "bp5-form-helper-text",
        style: {
          marginLeft: 10
        }
      }, this.props.search_helper_text)));
    }
  }]);
  return FilterSearchForm;
}(_react["default"].PureComponent);
exports.FilterSearchForm = FilterSearchForm;
FilterSearchForm.propTypes = {
  search_string: _propTypes["default"].string,
  handleSearchFieldChange: _propTypes["default"].func,
  handleFilter: _propTypes["default"].func,
  handleUnFilter: _propTypes["default"].func,
  searchNext: _propTypes["default"].func,
  searchPrevious: _propTypes["default"].func,
  search_helper_text: _propTypes["default"].string,
  margin_right: _propTypes["default"].number
};
FilterSearchForm.defaultProps = {
  handleFilter: null,
  handleUnfilter: null,
  searchNext: null,
  searchPrevious: null,
  search_helper_text: null,
  margin_right: 116
};
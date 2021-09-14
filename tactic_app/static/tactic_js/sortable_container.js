"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MySortableElement = MySortableElement;
exports.SortableComponent = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactSortableHoc = require("react-sortable-hoc");

var _utilities_react = require("./utilities_react.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

function MySortableElement(WrappedComponent) {
  var SElement = (0, _reactSortableHoc.SortableElement)(WrappedComponent);
  return /*#__PURE__*/function (_React$PureComponent) {
    _inherits(_class, _React$PureComponent);

    var _super = _createSuper(_class);

    function _class() {
      _classCallCheck(this, _class);

      return _super.apply(this, arguments);
    }

    _createClass(_class, [{
      key: "render",
      value: function render() {
        return /*#__PURE__*/_react["default"].createElement(SElement, this.props);
      }
    }]);

    return _class;
  }(_react["default"].PureComponent);
}

var RawSortableComponent = /*#__PURE__*/function (_React$Component) {
  _inherits(RawSortableComponent, _React$Component);

  var _super2 = _createSuper(RawSortableComponent);

  function RawSortableComponent(props) {
    var _this;

    _classCallCheck(this, RawSortableComponent);

    _this = _super2.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this));
    _this.state = {
      mounted: false
    };
    _this.container_ref = _this.props.container_ref == null ? /*#__PURE__*/_react["default"].createRef() : _this.props.container_ref;
    return _this;
  }

  _createClass(RawSortableComponent, [{
    key: "sorter_exists",
    get: function get() {
      return $(this.container_ref.current).hasClass("ui-sortable");
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        mounted: true
      }); // this.createSorter()
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var WrappedComponent = this.props.ElementComponent;

      var props_to_pass = _objectSpread({}, this.props);

      delete props_to_pass.item_list;
      return /*#__PURE__*/_react["default"].createElement("div", {
        id: this.props.id,
        style: this.props.style,
        ref: this.container_ref
      }, this.props.item_list.length > 0 && this.props.item_list.map(function (entry, index) {
        return /*#__PURE__*/_react["default"].createElement(WrappedComponent, _extends({
          key: entry[_this2.props.key_field_name],
          index: index
        }, props_to_pass, entry));
      }));
    }
  }]);

  return RawSortableComponent;
}(_react["default"].Component);

RawSortableComponent.propTypes = {
  id: _propTypes["default"].string,
  handle: _propTypes["default"].string,
  key_field_name: _propTypes["default"].string,
  ElementComponent: _propTypes["default"].func,
  item_list: _propTypes["default"].array,
  style: _propTypes["default"].object,
  container_ref: _propTypes["default"].object,
  resortFunction: _propTypes["default"].func
};
RawSortableComponent.defaultProps = {
  container_ref: null
};
var SortableComponent = (0, _reactSortableHoc.SortableContainer)(RawSortableComponent);
exports.SortableComponent = SortableComponent;
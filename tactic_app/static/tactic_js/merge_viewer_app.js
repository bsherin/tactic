"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MergeViewerApp = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactCodemirrorMergeview = require("./react-codemirror-mergeview.js");

var _blueprint_toolbar = require("./blueprint_toolbar.js");

var _blueprint_mdata_fields = require("./blueprint_mdata_fields.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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

var MergeViewerApp = /*#__PURE__*/function (_React$Component) {
  _inherits(MergeViewerApp, _React$Component);

  var _super = _createSuper(MergeViewerApp);

  function MergeViewerApp(props) {
    var _this;

    _classCallCheck(this, MergeViewerApp);

    _this = _super.call(this, props);
    _this.left_div_ref = /*#__PURE__*/_react["default"].createRef();
    _this.above_main_ref = /*#__PURE__*/_react["default"].createRef();
    _this.merge_element_ref = /*#__PURE__*/_react["default"].createRef();

    var self = _assertThisInitialized(_this);

    _this.state = {
      "inner_height": window.innerHeight,
      "mounted": false
    };
    _this.resize_to_window = _this.resize_to_window.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(MergeViewerApp, [{
    key: "button_groups",
    get: function get() {
      return [[{
        "name_text": "Save",
        "icon_name": "saved",
        "click_handler": this.props.saveHandler
      }]];
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      window.addEventListener("resize", this.resize_to_window);
      this.setState({
        "mounted": true
      }); // let fake_event = {currentTarget: {value: this.props.select_val}};

      this.props.handleSelectChange(this.props.select_val);
      this.resize_to_window();
      this.props.stopSpinner();
    }
  }, {
    key: "resize_to_window",
    value: function resize_to_window() {
      this.setState({
        "inner_height": window.innerHeight
      });
    }
  }, {
    key: "get_new_heights",
    value: function get_new_heights(bottom_margin) {
      var new_ld_height;
      var max_merge_height;

      if (this.state.mounted) {
        // This will be true after the initial render
        new_ld_height = this.state.inner_height - this.left_div_ref.current.offsetTop;
        max_merge_height = new_ld_height - bottom_margin;
      } else {
        new_ld_height = this.state.inner_height - 45 - bottom_margin;
        max_merge_height = new_ld_height - 50;
      }

      return [new_ld_height, max_merge_height];
    }
  }, {
    key: "render",
    value: function render() {
      var toolbar_holder_style = {
        "paddingTop": 20,
        paddingLeft: 50
      };
      var new_ld_height;
      var max_merge_height;

      var _this$get_new_heights = this.get_new_heights(65);

      var _this$get_new_heights2 = _slicedToArray(_this$get_new_heights, 2);

      new_ld_height = _this$get_new_heights2[0];
      max_merge_height = _this$get_new_heights2[1];
      var left_div_style = {
        "width": "100%",
        "height": new_ld_height,
        paddingLeft: 25,
        paddingRight: 25
      };
      var outer_class = "merge-viewer-outer";

      if (this.props.dark_theme) {
        outer_class = outer_class + " bp3-dark";
      } else {
        outer_class = outer_class + " light-theme";
      }

      var current_style = {
        "bottom": 0
      };
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: outer_class
      }, /*#__PURE__*/_react["default"].createElement("div", {
        style: toolbar_holder_style
      }, /*#__PURE__*/_react["default"].createElement(_blueprint_toolbar.Toolbar, {
        button_groups: this.button_groups
      })), /*#__PURE__*/_react["default"].createElement("div", {
        id: "left-div",
        ref: this.left_div_ref,
        style: left_div_style
      }, /*#__PURE__*/_react["default"].createElement("div", {
        id: "above-main",
        ref: this.above_main_ref,
        className: "d-flex flex-row justify-content-between mb-2"
      }, /*#__PURE__*/_react["default"].createElement("span", {
        className: "align-self-end"
      }, "Current"), /*#__PURE__*/_react["default"].createElement(_blueprint_mdata_fields.BpSelect, {
        options: this.props.option_list,
        onChange: this.props.handleSelectChange,
        buttonIcon: "application",
        value: this.props.select_val
      })), /*#__PURE__*/_react["default"].createElement(_reactCodemirrorMergeview.ReactCodemirrorMergeView, {
        handleEditChange: this.props.handleEditChange,
        dark_theme: this.props.dark_theme,
        editor_content: this.props.edit_content,
        right_content: this.props.right_content,
        saveMe: this.props.saveHandler,
        max_height: max_merge_height,
        ref: this.merge_element_ref
      })));
    }
  }]);

  return MergeViewerApp;
}(_react["default"].Component);

exports.MergeViewerApp = MergeViewerApp;
MergeViewerApp.propTypes = {
  resource_name: _propTypes["default"].string,
  option_list: _propTypes["default"].array,
  select_val: _propTypes["default"].string,
  edit_content: _propTypes["default"].string,
  right_content: _propTypes["default"].string,
  handleSelectChange: _propTypes["default"].func,
  handleEditChange: _propTypes["default"].func,
  dark_theme: _propTypes["default"].bool,
  saveHandler: _propTypes["default"].func
};
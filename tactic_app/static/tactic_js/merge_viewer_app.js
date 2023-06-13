"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MergeViewerApp = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
var _reactCodemirrorMergeview = require("./react-codemirror-mergeview.js");
var _blueprint_mdata_fields = require("./blueprint_mdata_fields.js");
var _menu_utilities = require("./menu_utilities");
var _tactic_omnibar = require("./tactic_omnibar");
var _utilities_react = require("./utilities_react.js");
var _key_trap = require("./key_trap");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
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
var MergeViewerApp = /*#__PURE__*/function (_React$Component) {
  _inherits(MergeViewerApp, _React$Component);
  var _super = _createSuper(MergeViewerApp);
  function MergeViewerApp(props) {
    var _this;
    _classCallCheck(this, MergeViewerApp);
    _this = _super.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this));
    _this.left_div_ref = /*#__PURE__*/_react["default"].createRef();
    _this.above_main_ref = /*#__PURE__*/_react["default"].createRef();
    _this.merge_element_ref = /*#__PURE__*/_react["default"].createRef();
    var self = _assertThisInitialized(_this);
    _this.state = {
      "inner_height": window.innerHeight,
      "mounted": false
    };
    _this.resize_to_window = _this.resize_to_window.bind(_assertThisInitialized(_this));
    _this.omniGetters = {};
    if (!window.in_context) {
      _this.key_bindings = [[["ctrl+space"], _this._showOmnibar]];
      _this.state.showOmnibar = false;
    }
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
    key: "menu_specs",
    get: function get() {
      var ms;
      ms = {
        Save: [{
          name_text: "Save",
          icon_name: "saved",
          click_handler: this.props.saveHandler,
          key_bindings: ['ctrl+s']
        }]
      };
      for (var _i = 0, _Object$entries = Object.entries(ms); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          menu_name = _Object$entries$_i[0],
          menu = _Object$entries$_i[1];
        var _iterator = _createForOfIteratorHelper(menu),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var but = _step.value;
            but.click_handler = but.click_handler.bind(this);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
      return ms;
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      window.addEventListener("resize", this.resize_to_window);
      this.setState({
        "mounted": true
      });
      // let fake_event = {currentTarget: {value: this.props.select_val}};
      this.props.handleSelectChange(this.props.select_val);
      this.resize_to_window();
      this.props.stopSpinner();
    }
  }, {
    key: "_showOmnibar",
    value: function _showOmnibar() {
      this.setState({
        showOmnibar: true
      });
    }
  }, {
    key: "_closeOmnibar",
    value: function _closeOmnibar() {
      this.setState({
        showOmnibar: false
      });
    }
  }, {
    key: "_omniFunction",
    value: function _omniFunction() {
      var omni_items = [];
      for (var ogetter in this.omniGetters) {
        omni_items = omni_items.concat(this.omniGetters[ogetter]());
      }
      return omni_items;
    }
  }, {
    key: "_registerOmniGetter",
    value: function _registerOmniGetter(name, the_function) {
      this.omniGetters[name] = the_function;
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
        outer_class = outer_class + " bp4-dark";
      } else {
        outer_class = outer_class + " light-theme";
      }
      var current_style = {
        "bottom": 0
      };
      return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_menu_utilities.TacticMenubar, {
        menu_specs: this.menu_specs,
        showRefresh: false,
        showClose: false,
        dark_theme: this.props.dark_theme,
        refreshTab: null,
        closeTab: null,
        resource_name: this.props.resource_name,
        toggleErrorDrawer: this.props.toggleErrorDrawer,
        controlled: false,
        am_selected: false,
        registerOmniGetter: this._registerOmniGetter
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: outer_class
      }, /*#__PURE__*/_react["default"].createElement("div", {
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
        popoverPosition: _core.PopoverPosition.BOTTOM_RIGHT,
        value: this.props.select_val
      })), /*#__PURE__*/_react["default"].createElement(_reactCodemirrorMergeview.ReactCodemirrorMergeView, {
        handleEditChange: this.props.handleEditChange,
        dark_theme: this.props.dark_theme,
        editor_content: this.props.edit_content,
        right_content: this.props.right_content,
        saveMe: this.props.saveHandler,
        max_height: max_merge_height,
        ref: this.merge_element_ref
      }))), /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_tactic_omnibar.TacticOmnibar, {
        omniGetters: [this._omniFunction],
        showOmnibar: this.state.showOmnibar,
        closeOmnibar: this._closeOmnibar,
        is_authenticated: window.is_authenticated,
        dark_theme: this.props.dark_theme,
        setTheme: this.props.setTheme
      }), /*#__PURE__*/_react["default"].createElement(_key_trap.KeyTrap, {
        global: true,
        bindings: this.key_bindings
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
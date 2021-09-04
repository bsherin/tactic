"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

require("../tactic_css/tactic.scss");

var _react = _interopRequireDefault(require("react"));

var ReactDOM = _interopRequireWildcard(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _merge_viewer_app = require("./merge_viewer_app.js");

var _toaster = require("./toaster.js");

var _communication_react = require("./communication_react.js");

var _error_drawer = require("./error_drawer.js");

var _utilities_react = require("./utilities_react.js");

var _blueprint_navbar = require("./blueprint_navbar");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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

window.resource_viewer_id = (0, _utilities_react.guid)();
window.main_id = window.resource_viewer_id;

function tile_differ_main() {
  var get_url = "get_module_code";
  var tsocket = new _merge_viewer_app.MergeViewerSocket("main", 5000);
  var TileDifferAppPlus = (0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(TileDifferApp, tsocket), tsocket);
  (0, _communication_react.postAjaxPromise)("".concat(get_url, "/").concat(window.resource_name), {}).then(function (data) {
    var edit_content = data.the_content;
    (0, _communication_react.postAjaxPromise)("get_tile_names").then(function (data) {
      var tile_list = data.tile_names;
      var domContainer = document.querySelector('#root');
      ReactDOM.render( /*#__PURE__*/_react["default"].createElement(TileDifferAppPlus, {
        resource_name: window.resource_name,
        tile_list: tile_list,
        edit_content: edit_content,
        initial_theme: window.theme,
        second_resource_name: window.second_resource_name
      }), domContainer);
    })["catch"](_toaster.doFlash);
  })["catch"](_toaster.doFlash);
}

var TileDifferApp = /*#__PURE__*/function (_React$Component) {
  _inherits(TileDifferApp, _React$Component);

  var _super = _createSuper(TileDifferApp);

  function TileDifferApp(props) {
    var _this;

    _classCallCheck(this, TileDifferApp);

    _this = _super.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this));

    var self = _assertThisInitialized(_this);

    window.onbeforeunload = function (e) {
      if (self.dirty()) {
        return "Any unsaved changes will be lost.";
      }
    };

    _this.state = {
      "edit_content": props.edit_content,
      "right_content": "",
      "tile_popup_val": props.second_resource_name == "none" ? props.resource_name : props.second_resource_name,
      "tile_list": props.tile_list,
      dark_theme: _this.props.initial_theme == "dark"
    };
    _this.handleEditChange = _this.handleEditChange.bind(_assertThisInitialized(_this));
    _this.handleSelectChange = _this.handleSelectChange.bind(_assertThisInitialized(_this));
    _this.saveFromLeft = _this.saveFromLeft.bind(_assertThisInitialized(_this));
    _this.savedContent = props.edit_content;
    return _this;
  }

  _createClass(TileDifferApp, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.props.setStatusTheme(this.state.dark_theme);
      window.dark_theme = this.state.dark_theme;
    }
  }, {
    key: "_setTheme",
    value: function _setTheme(dark_theme) {
      var _this2 = this;

      this.setState({
        dark_theme: dark_theme
      }, function () {
        _this2.props.setStatusTheme(dark_theme);

        window.dark_theme = _this2.state.dark_theme;
      });
    }
  }, {
    key: "handleSelectChange",
    value: function handleSelectChange(new_value) {
      this.state.tile_popup_val = new_value;
      var self = this;
      (0, _communication_react.postAjaxPromise)("get_module_code/" + new_value, {}).then(function (data) {
        self.setState({
          "right_content": data.the_content
        });
      })["catch"](_toaster.doFlash);
    }
  }, {
    key: "handleEditChange",
    value: function handleEditChange(new_code) {
      this.setState({
        "edit_content": new_code
      });
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
        is_authenticated: window.is_authenticated,
        selected: null,
        show_api_links: true,
        dark_theme: this.state.dark_theme,
        set_parent_theme: this._setTheme,
        user_name: window.username
      }), /*#__PURE__*/_react["default"].createElement(_merge_viewer_app.MergeViewerApp, _extends({}, this.props.statusFuncs, {
        resource_name: this.props.resource_name,
        option_list: this.state.tile_list,
        select_val: this.state.tile_popup_val,
        edit_content: this.state.edit_content,
        right_content: this.state.right_content,
        handleSelectChange: this.handleSelectChange,
        handleEditChange: this.handleEditChange,
        dark_theme: this.state.dark_theme,
        saveHandler: this.saveFromLeft
      })));
    }
  }, {
    key: "saveFromLeft",
    value: function saveFromLeft() {
      var data_dict = {
        "module_name": this.props.resource_name,
        "module_code": this.state.edit_content
      };
      (0, _communication_react.postAjaxPromise)("update_from_left", data_dict).then(_toaster.doFlash)["catch"](_toaster.doFlash);
    }
  }, {
    key: "dirty",
    value: function dirty() {
      return this.state.edit_content != this.savedContent;
    }
  }]);

  return TileDifferApp;
}(_react["default"].Component);

TileDifferApp.propTypes = {
  resource_name: _propTypes["default"].string,
  tile_list: _propTypes["default"].array,
  edit_content: _propTypes["default"].string,
  second_resource_name: _propTypes["default"].string
};
tile_differ_main();
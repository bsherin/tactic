"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RepositoryTileMenubar = exports.RepositoryProjectMenubar = exports.RepositoryListMenubar = exports.RepositoryCollectionMenubar = exports.RepositoryCodeMenubar = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _library_menubars = require("./library_menubars.js");
var _utilities_react = require("./utilities_react");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
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
var specializedMenubarPropTypes = {
  sendContextMenuItems: _propTypes["default"].func,
  view_func: _propTypes["default"].func,
  view_resource: _propTypes["default"].func,
  duplicate_func: _propTypes["default"].func,
  delete_func: _propTypes["default"].func,
  rename_func: _propTypes["default"].func,
  refresh_func: _propTypes["default"].func,
  send_repository_func: _propTypes["default"].func,
  selected_resource: _propTypes["default"].object,
  list_of_selected: _propTypes["default"].array,
  muti_select: _propTypes["default"].bool,
  add_new_row: _propTypes["default"].func
};
var resource_icon = window.is_remote ? "globe-network" : "map-marker";
var RepositoryCollectionMenubar = /*#__PURE__*/function (_React$Component) {
  _inherits(RepositoryCollectionMenubar, _React$Component);
  var _super = _createSuper(RepositoryCollectionMenubar);
  function RepositoryCollectionMenubar(props) {
    var _this;
    _classCallCheck(this, RepositoryCollectionMenubar);
    _this = _super.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this));
    return _this;
  }
  _createClass(RepositoryCollectionMenubar, [{
    key: "menu_specs",
    get: function get() {
      var self = this;
      var ms = {
        Transfer: [{
          name_text: "Copy To Library",
          icon_name: "import",
          click_handler: this.props.repository_copy_func,
          multi_select: true
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
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_library_menubars.LibraryMenubar, {
        menu_specs: this.menu_specs,
        multi_select: this.props.multi_select,
        dark_theme: this.props.dark_theme,
        controlled: this.props.controlled,
        am_selected: this.props.am_selected,
        tsocket: this.props.tsocket,
        refreshTab: this.props.refresh_func,
        closeTab: null,
        resource_name: "",
        resource_icon: resource_icon,
        showErrorDrawerButton: false,
        toggleErrorDrawer: null
      });
    }
  }]);
  return RepositoryCollectionMenubar;
}(_react["default"].Component);
exports.RepositoryCollectionMenubar = RepositoryCollectionMenubar;
RepositoryCollectionMenubar.propTypes = specializedMenubarPropTypes;
var RepositoryProjectMenubar = /*#__PURE__*/function (_React$Component2) {
  _inherits(RepositoryProjectMenubar, _React$Component2);
  var _super2 = _createSuper(RepositoryProjectMenubar);
  function RepositoryProjectMenubar(props) {
    var _this2;
    _classCallCheck(this, RepositoryProjectMenubar);
    _this2 = _super2.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this2));
    return _this2;
  }
  _createClass(RepositoryProjectMenubar, [{
    key: "menu_specs",
    get: function get() {
      var self = this;
      var ms = {
        Transfer: [{
          name_text: "Copy To Library",
          icon_name: "import",
          click_handler: this.props.repository_copy_func,
          multi_select: true
        }]
      };
      for (var _i2 = 0, _Object$entries2 = Object.entries(ms); _i2 < _Object$entries2.length; _i2++) {
        var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
          menu_name = _Object$entries2$_i[0],
          menu = _Object$entries2$_i[1];
        var _iterator2 = _createForOfIteratorHelper(menu),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var but = _step2.value;
            but.click_handler = but.click_handler.bind(this);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
      return ms;
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_library_menubars.LibraryMenubar, {
        menu_specs: this.menu_specs,
        multi_select: this.props.multi_select,
        dark_theme: this.props.dark_theme,
        controlled: this.props.controlled,
        am_selected: this.props.am_selected,
        tsocket: this.props.tsocket,
        refreshTab: this.props.refresh_func,
        closeTab: null,
        resource_name: "",
        resource_icon: resource_icon,
        showErrorDrawerButton: false,
        toggleErrorDrawer: null
      });
    }
  }]);
  return RepositoryProjectMenubar;
}(_react["default"].Component);
exports.RepositoryProjectMenubar = RepositoryProjectMenubar;
RepositoryProjectMenubar.propTypes = specializedMenubarPropTypes;
var RepositoryTileMenubar = /*#__PURE__*/function (_React$Component3) {
  _inherits(RepositoryTileMenubar, _React$Component3);
  var _super3 = _createSuper(RepositoryTileMenubar);
  function RepositoryTileMenubar(props) {
    var _this3;
    _classCallCheck(this, RepositoryTileMenubar);
    _this3 = _super3.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this3));
    return _this3;
  }
  _createClass(RepositoryTileMenubar, [{
    key: "_tile_view",
    value: function _tile_view(e) {
      this.props.view_func("/repository_view_module/");
    }
  }, {
    key: "menu_specs",
    get: function get() {
      var self = this;
      var ms = {
        View: [{
          name_text: "View Tile",
          icon_name: "eye-open",
          click_handler: this._tile_view
        }],
        Transfer: [{
          name_text: "Copy To Library",
          icon_name: "import",
          click_handler: this.props.repository_copy_func,
          multi_select: true
        }]
      };
      for (var _i3 = 0, _Object$entries3 = Object.entries(ms); _i3 < _Object$entries3.length; _i3++) {
        var _Object$entries3$_i = _slicedToArray(_Object$entries3[_i3], 2),
          menu_name = _Object$entries3$_i[0],
          menu = _Object$entries3$_i[1];
        var _iterator3 = _createForOfIteratorHelper(menu),
          _step3;
        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var but = _step3.value;
            but.click_handler = but.click_handler.bind(this);
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }
      return ms;
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_library_menubars.LibraryMenubar, {
        menu_specs: this.menu_specs,
        multi_select: this.props.multi_select,
        dark_theme: this.props.dark_theme,
        controlled: this.props.controlled,
        am_selected: this.props.am_selected,
        tsocket: this.props.tsocket,
        refreshTab: this.props.refresh_func,
        closeTab: null,
        resource_name: "",
        resource_icon: resource_icon,
        showErrorDrawerButton: false,
        toggleErrorDrawer: null
      });
    }
  }]);
  return RepositoryTileMenubar;
}(_react["default"].Component);
exports.RepositoryTileMenubar = RepositoryTileMenubar;
RepositoryTileMenubar.propTypes = specializedMenubarPropTypes;
var RepositoryListMenubar = /*#__PURE__*/function (_React$Component4) {
  _inherits(RepositoryListMenubar, _React$Component4);
  var _super4 = _createSuper(RepositoryListMenubar);
  function RepositoryListMenubar(props) {
    var _this4;
    _classCallCheck(this, RepositoryListMenubar);
    _this4 = _super4.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this4));
    return _this4;
  }
  _createClass(RepositoryListMenubar, [{
    key: "_list_view",
    value: function _list_view(e) {
      this.props.view_func("/repository_view_list/");
    }
  }, {
    key: "menu_specs",
    get: function get() {
      var self = this;
      var ms = {
        View: [{
          name_text: "View List",
          icon_name: "eye-open",
          click_handler: this._list_view
        }],
        Transfer: [{
          name_text: "Copy To Library",
          icon_name: "import",
          click_handler: this.props.repository_copy_func,
          multi_select: true
        }]
      };
      for (var _i4 = 0, _Object$entries4 = Object.entries(ms); _i4 < _Object$entries4.length; _i4++) {
        var _Object$entries4$_i = _slicedToArray(_Object$entries4[_i4], 2),
          menu_name = _Object$entries4$_i[0],
          menu = _Object$entries4$_i[1];
        var _iterator4 = _createForOfIteratorHelper(menu),
          _step4;
        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var but = _step4.value;
            but.click_handler = but.click_handler.bind(this);
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
      }
      return ms;
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_library_menubars.LibraryMenubar, {
        menu_specs: this.menu_specs,
        multi_select: this.props.multi_select,
        dark_theme: this.props.dark_theme,
        controlled: this.props.controlled,
        am_selected: this.props.am_selected,
        tsocket: this.props.tsocket,
        refreshTab: this.props.refresh_func,
        closeTab: null,
        resource_name: "",
        resource_icon: resource_icon,
        showErrorDrawerButton: false,
        toggleErrorDrawer: null
      });
    }
  }]);
  return RepositoryListMenubar;
}(_react["default"].Component);
exports.RepositoryListMenubar = RepositoryListMenubar;
RepositoryListMenubar.propTypes = specializedMenubarPropTypes;
var RepositoryCodeMenubar = /*#__PURE__*/function (_React$Component5) {
  _inherits(RepositoryCodeMenubar, _React$Component5);
  var _super5 = _createSuper(RepositoryCodeMenubar);
  function RepositoryCodeMenubar(props) {
    var _this5;
    _classCallCheck(this, RepositoryCodeMenubar);
    _this5 = _super5.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this5));
    return _this5;
  }
  _createClass(RepositoryCodeMenubar, [{
    key: "_code_view",
    value: function _code_view(e) {
      this.props.view_func("/repository_view_code/");
    }
  }, {
    key: "menu_specs",
    get: function get() {
      var self = this;
      var ms = {
        View: [{
          name_text: "View Code",
          icon_name: "eye-open",
          click_handler: this._code_view
        }],
        Transfer: [{
          name_text: "Copy To Library",
          icon_name: "import",
          click_handler: this.props.repository_copy_func,
          multi_select: true
        }]
      };
      for (var _i5 = 0, _Object$entries5 = Object.entries(ms); _i5 < _Object$entries5.length; _i5++) {
        var _Object$entries5$_i = _slicedToArray(_Object$entries5[_i5], 2),
          menu_name = _Object$entries5$_i[0],
          menu = _Object$entries5$_i[1];
        var _iterator5 = _createForOfIteratorHelper(menu),
          _step5;
        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var but = _step5.value;
            but.click_handler = but.click_handler.bind(this);
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }
      }
      return ms;
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_library_menubars.LibraryMenubar, {
        menu_specs: this.menu_specs,
        multi_select: this.props.multi_select,
        dark_theme: this.props.dark_theme,
        controlled: this.props.controlled,
        am_selected: this.props.am_selected,
        tsocket: this.props.tsocket,
        refreshTab: this.props.refresh_func,
        closeTab: null,
        resource_name: "",
        resource_icon: resource_icon,
        showErrorDrawerButton: false,
        toggleErrorDrawer: null
      });
    }
  }]);
  return RepositoryCodeMenubar;
}(_react["default"].Component);
exports.RepositoryCodeMenubar = RepositoryCodeMenubar;
RepositoryCodeMenubar.propTypes = specializedMenubarPropTypes;
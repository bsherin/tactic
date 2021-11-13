"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TopLeftButtons = exports.TacticMenubar = exports.ToolMenu = exports.MenuComponent = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _core = require("@blueprintjs/core");

var _utilities_react = require("./utilities_react.js");

var _key_trap = require("./key_trap");

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

var TacticMenubar = /*#__PURE__*/function (_React$Component) {
  _inherits(TacticMenubar, _React$Component);

  var _super = _createSuper(TacticMenubar);

  function TacticMenubar() {
    _classCallCheck(this, TacticMenubar);

    return _super.apply(this, arguments);
  }

  _createClass(TacticMenubar, [{
    key: "render",
    value: function render() {
      var menus;

      if (this.props.menu_specs == null) {
        menus = this.props.menus;
      } else {
        menus = [];

        for (var menu_name in this.props.menu_specs) {
          menus.push( /*#__PURE__*/_react["default"].createElement(ToolMenu, {
            menu_name: menu_name,
            key: menu_name,
            disabled_items: this.props.disabled_items,
            menu_items: this.props.menu_specs[menu_name],
            controlled: this.props.controlled,
            am_selected: this.props.am_selected
          }));
        }
      }

      var theme_class = this.props.dark_theme ? "bp3-dark" : "light-theme";
      var name_style = {
        marginButton: 0,
        marginLeft: 10,
        marginRight: 10,
        display: "flex",
        alignItems: "center",
        fontWeight: "bold"
      };
      return /*#__PURE__*/_react["default"].createElement(_core.Navbar, {
        style: {
          paddingLeft: 3,
          height: 30,
          display: "flex"
        },
        className: theme_class
      }, (this.props.showClose || this.props.showRefresh) && /*#__PURE__*/_react["default"].createElement(TopLeftButtons, {
        showRefresh: this.props.showRefresh,
        showClose: this.props.showClose,
        refreshTab: this.props.refreshTab,
        closeTab: this.props.closeTab,
        extraButtons: this.props.extraButtons
      }), this.props.resource_name && /*#__PURE__*/_react["default"].createElement("div", {
        style: name_style
      }, this.props.resource_name), /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          height: 30
        },
        className: "bp3-navbar-group bp3-align-left"
      }, /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, menus)), this.props.showErrorDrawerButton && /*#__PURE__*/_react["default"].createElement(ErrorDrawerButton, {
        toggleErrorDrawer: this.props.toggleErrorDrawer
      }));
    }
  }]);

  return TacticMenubar;
}(_react["default"].Component);

exports.TacticMenubar = TacticMenubar;
TacticMenubar.propTypes = {
  refreshTab: _propTypes["default"].func,
  closeTab: _propTypes["default"].func,
  showClose: _propTypes["default"].bool,
  showRefresh: _propTypes["default"].bool,
  showErrorDrawerButton: _propTypes["default"].bool,
  toggleErrorDrawer: _propTypes["default"].func,
  menu_specs: _propTypes["default"].object,
  dark_theme: _propTypes["default"].bool,
  resource_name: _propTypes["default"].string,
  controlled: _propTypes["default"].bool,
  am_selected: _propTypes["default"].bool,
  diabled_items: _propTypes["default"].array,
  extraButtons: _propTypes["default"].array
};
TacticMenubar.defaultProps = {
  showClose: window.in_context,
  showRefresh: window.in_context,
  refreshTab: null,
  closeTab: null,
  menu_specs: null,
  menus: null,
  showErrorDrawerButton: false,
  toggleErrorDrawer: null,
  resource_name: null,
  disabled_items: [],
  extraButtons: null
};

function ErrorDrawerButton(props) {
  var top_icon_style = {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 0,
    paddingTop: 3,
    marginRight: 20,
    position: "absolute",
    right: 10
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: top_icon_style
  }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
    icon: /*#__PURE__*/_react["default"].createElement(_core.Icon, {
      icon: "drawer-right",
      iconSize: 18
    }),
    style: {
      paddingLeft: 4,
      paddingRight: 0
    },
    minimal: true,
    className: "context-close-button",
    small: true,
    tabIndex: -1,
    onClick: function onClick() {
      props.toggleErrorDrawer();
    }
  }));
}

var TopLeftButtons = /*#__PURE__*/function (_React$Component2) {
  _inherits(TopLeftButtons, _React$Component2);

  var _super2 = _createSuper(TopLeftButtons);

  function TopLeftButtons(props) {
    var _this;

    _classCallCheck(this, TopLeftButtons);

    _this = _super2.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(TopLeftButtons, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var top_icon_style = {
        display: "flex",
        justifyContent: "flex-start",
        marginTop: 0,
        paddingTop: 0,
        marginRight: 8
      };
      var ebuttons = [];

      if (this.props.extraButtons != null) {
        this.props.extraButtons.map(function (but_info, index) {
          ebuttons.push( /*#__PURE__*/_react["default"].createElement(_core.Button, {
            icon: /*#__PURE__*/_react["default"].createElement(_core.Icon, {
              icon: but_info.icon,
              iconSize: 14
            }),
            style: {
              paddingLeft: 8
            },
            minimal: true,
            className: "context-close-button",
            small: true,
            tabIndex: -1,
            onClick: function onClick() {
              but_info.onClick();
            }
          }));
        });
      }

      return /*#__PURE__*/_react["default"].createElement("div", {
        style: top_icon_style
      }, this.props.showClose && /*#__PURE__*/_react["default"].createElement(_core.Button, {
        icon: /*#__PURE__*/_react["default"].createElement(_core.Icon, {
          icon: "delete",
          iconSize: 14
        }),
        style: {
          paddingLeft: 4,
          paddingRight: 0
        },
        minimal: true,
        className: "context-close-button",
        small: true,
        tabIndex: -1,
        intent: "danger",
        onClick: function onClick() {
          _this2.props.closeTab();
        }
      }), this.props.showRefresh && /*#__PURE__*/_react["default"].createElement(_core.Button, {
        icon: /*#__PURE__*/_react["default"].createElement(_core.Icon, {
          icon: "reset",
          iconSize: 14
        }),
        style: {
          paddingLeft: 8
        },
        minimal: true,
        className: "context-close-button",
        small: true,
        tabIndex: -1,
        intent: "danger",
        onClick: function onClick() {
          _this2.props.refreshTab();
        }
      }), this.props.extraButtons && ebuttons);
    }
  }]);

  return TopLeftButtons;
}(_react["default"].Component);

exports.TopLeftButtons = TopLeftButtons;
TopLeftButtons.propTypes = {
  showRefresh: _propTypes["default"].bool,
  showClose: _propTypes["default"].bool,
  refreshTab: _propTypes["default"].func,
  closeTab: _propTypes["default"].func,
  extraButtons: _propTypes["default"].array
};
TopLeftButtons.defaultProps = {
  extraButtons: null
};

var MenuComponent = /*#__PURE__*/function (_React$Component3) {
  _inherits(MenuComponent, _React$Component3);

  var _super3 = _createSuper(MenuComponent);

  function MenuComponent(props) {
    var _this3;

    _classCallCheck(this, MenuComponent);

    _this3 = _super3.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this3));
    _this3.replacers = [["CTRL+", "^"], ["COMMAND+", "⌘"]];
    return _this3;
  }

  _createClass(MenuComponent, [{
    key: "_filter_on_match_list",
    value: function _filter_on_match_list(opt_name) {
      return !this.props.hidden_items.includes(opt_name);
    }
  }, {
    key: "_bindingsToString",
    value: function _bindingsToString(binding_list) {
      if (binding_list == null) {
        return null;
      }

      var new_binding = binding_list[0];

      var _iterator = _createForOfIteratorHelper(this.replacers),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var rep = _step.value;
          new_binding = new_binding.toUpperCase().replace(rep[0], rep[1]);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return /*#__PURE__*/_react["default"].createElement("span", {
        style: {
          fontFamily: "system-ui"
        }
      }, new_binding);
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var pruned_list = Object.keys(this.props.option_dict).filter(this._filter_on_match_list);
      var choices = pruned_list.map(function (opt_name, index) {
        if (opt_name.startsWith("divider")) {
          return /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, {
            key: index
          });
        }

        var icon = _this4.props.icon_dict.hasOwnProperty(opt_name) ? _this4.props.icon_dict[opt_name] : null;
        var label = null;

        if (opt_name in _this4.props.binding_dict) {
          label = _this4._bindingsToString(_this4.props.binding_dict[opt_name]);
        }

        return /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
          disabled: _this4.props.disable_all || _this4.props.disabled_items.includes(opt_name),
          onClick: _this4.props.option_dict[opt_name],
          icon: icon,
          labelElement: label,
          key: opt_name,
          text: opt_name,
          className: _this4.props.item_class
        });
      });

      var the_menu = /*#__PURE__*/_react["default"].createElement(_core.Menu, null, choices);

      if (this.props.alt_button) {
        var AltButton = this.props.alt_button;
        return /*#__PURE__*/_react["default"].createElement(_core.Popover, {
          minimal: true,
          content: the_menu,
          position: this.props.position
        }, /*#__PURE__*/_react["default"].createElement(AltButton, null));
      } else {
        return /*#__PURE__*/_react["default"].createElement(_core.Popover, {
          minimal: true,
          content: the_menu,
          position: this.props.position
        }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
          text: this.props.menu_name,
          small: true,
          minimal: true
        }));
      }
    }
  }]);

  return MenuComponent;
}(_react["default"].Component);

exports.MenuComponent = MenuComponent;
MenuComponent.propTypes = {
  menu_name: _propTypes["default"].string,
  item_class: _propTypes["default"].string,
  option_dict: _propTypes["default"].object,
  icon_dict: _propTypes["default"].object,
  binding_dict: _propTypes["default"].object,
  disabled_items: _propTypes["default"].array,
  disable_all: _propTypes["default"].bool,
  hidden_items: _propTypes["default"].array,
  alt_button: _propTypes["default"].func,
  position: _propTypes["default"].string
};
MenuComponent.defaultProps = {
  menu_name: null,
  item_class: "",
  disabled_items: [],
  binding_dict: {},
  disable_all: false,
  hidden_items: [],
  icon_dict: {},
  alt_button: null,
  position: _core.PopoverPosition.BOTTOM_LEFT
};

var ToolMenu = /*#__PURE__*/function (_React$Component4) {
  _inherits(ToolMenu, _React$Component4);

  var _super4 = _createSuper(ToolMenu);

  function ToolMenu(props) {
    var _this5;

    _classCallCheck(this, ToolMenu);

    _this5 = _super4.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this5));
    return _this5;
  }

  _createClass(ToolMenu, [{
    key: "option_dict",
    get: function get() {
      var opt_dict = {};

      var _iterator2 = _createForOfIteratorHelper(this.props.menu_items),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var but = _step2.value;
          opt_dict[but.name_text] = but.click_handler;
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return opt_dict;
    }
  }, {
    key: "icon_dict",
    get: function get() {
      var icon_dict = {};

      var _iterator3 = _createForOfIteratorHelper(this.props.menu_items),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var but = _step3.value;
          icon_dict[but.name_text] = but.icon_name;
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      return icon_dict;
    }
  }, {
    key: "binding_dict",
    get: function get() {
      var binding_dict = {};

      var _iterator4 = _createForOfIteratorHelper(this.props.menu_items),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var but = _step4.value;

          if ("key_bindings" in but) {
            binding_dict[but.name_text] = but.key_bindings;
          } else {
            binding_dict[but.name_text] = null;
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      return binding_dict;
    }
  }, {
    key: "render",
    value: function render() {
      var key_bindings = [];

      var _iterator5 = _createForOfIteratorHelper(this.props.menu_items),
          _step5;

      try {
        var _loop = function _loop() {
          var button = _step5.value;
          if (button.hasOwnProperty("key_bindings")) key_bindings.push([button.key_bindings, function () {
            return button.click_handler();
          }]);
        };

        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }

      return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(MenuComponent, {
        menu_name: this.props.menu_name,
        option_dict: this.option_dict,
        icon_dict: this.icon_dict,
        binding_dict: this.binding_dict,
        disabled_items: this.props.disabled_items,
        hidden_items: []
      }), /*#__PURE__*/_react["default"].createElement(_key_trap.KeyTrap, {
        global: true,
        active: !this.props.controlled || this.props.am_selected,
        bindings: key_bindings
      }));
    }
  }]);

  return ToolMenu;
}(_react["default"].Component);

exports.ToolMenu = ToolMenu;
ToolMenu.propTypes = {
  menu_name: _propTypes["default"].string,
  menu_items: _propTypes["default"].array,
  disabled_items: _propTypes["default"].array,
  controlled: _propTypes["default"].bool,
  am_selected: _propTypes["default"].bool
};
ToolMenu.defaultProps = {
  disabled_items: []
};
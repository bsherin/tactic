"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MenuComponent = MenuComponent;
exports.TacticMenubar = TacticMenubar;
exports.ToolMenu = ToolMenu;
exports.TopLeftButtons = TopLeftButtons;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
var _popover = require("@blueprintjs/popover2");
var _key_trap = require("./key_trap");
var _blueprint_react_widgets = require("./blueprint_react_widgets");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function TacticMenubar(props) {
  var menus;
  if (props.menu_specs == null) {
    menus = props.menus;
  } else {
    menus = [];
    for (var menu_name in props.menu_specs) {
      menus.push( /*#__PURE__*/_react["default"].createElement(ToolMenu, {
        menu_name: menu_name,
        key: menu_name,
        registerOmniGetter: props.registerOmniGetter,
        disabled_items: props.disabled_items,
        menu_items: props.menu_specs[menu_name],
        controlled: props.controlled,
        am_selected: props.am_selected
      }));
    }
  }
  var sug_glyphs = [];
  var _iterator = _createForOfIteratorHelper(props.suggestionGlyphs),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var sg = _step.value;
      sug_glyphs.push( /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        intent: sg.intent,
        handleClick: sg.handleClick,
        icon: sg.icon
      }));
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  var theme_class = props.dark_theme ? "bp4-dark" : "light-theme";
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
    className: theme_class + " menu-bar"
  }, (props.showClose || props.showRefresh) && /*#__PURE__*/_react["default"].createElement(TopLeftButtons, {
    showRefresh: props.showRefresh,
    showClose: props.showClose,
    refreshTab: props.refreshTab,
    closeTab: props.closeTab,
    extraButtons: props.extraButtons
  }), props.resource_icon && /*#__PURE__*/_react["default"].createElement(_core.Icon, {
    style: {
      marginTop: 6
    },
    icon: props.resource_icon,
    iconSize: 16,
    tabIndex: -1
  }), props.resource_name && /*#__PURE__*/_react["default"].createElement("div", {
    style: name_style
  }, props.resource_name), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      height: 30
    },
    className: "bp4-navbar-group bp4-align-left"
  }, /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, menus, sug_glyphs)), props.showErrorDrawerButton && /*#__PURE__*/_react["default"].createElement(ErrorDrawerButton, {
    toggleErrorDrawer: props.toggleErrorDrawer
  }));
}
exports.TacticMenubar = TacticMenubar = /*#__PURE__*/(0, _react.memo)(TacticMenubar);
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
  resource_icon: _propTypes["default"].string,
  controlled: _propTypes["default"].bool,
  am_selected: _propTypes["default"].bool,
  diabled_items: _propTypes["default"].array,
  extraButtons: _propTypes["default"].array,
  suggestionGlyphs: _propTypes["default"].array
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
  resource_icon: null,
  disabled_items: [],
  extraButtons: null,
  suggestionGlyphs: []
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
ErrorDrawerButton = /*#__PURE__*/(0, _react.memo)(ErrorDrawerButton);
function TopLeftButtons(props) {
  var top_icon_style = {
    display: "flex",
    justifyContent: "flex-start",
    marginTop: 0,
    paddingTop: 0,
    marginRight: 8
  };
  var ebuttons = [];
  if (props.extraButtons != null) {
    props.extraButtons.map(function (but_info, index) {
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
        key: index,
        tabIndex: -1,
        onClick: function onClick() {
          but_info.onClick();
        }
      }));
    });
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: top_icon_style
  }, props.showClose && /*#__PURE__*/_react["default"].createElement(_core.Button, {
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
      props.closeTab();
    }
  }), props.showRefresh && /*#__PURE__*/_react["default"].createElement(_core.Button, {
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
      props.refreshTab();
    }
  }), props.extraButtons && ebuttons);
}
exports.TopLeftButtons = TopLeftButtons = /*#__PURE__*/(0, _react.memo)(TopLeftButtons);
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
function MenuComponent(props) {
  var replacers = [["CTRL+", "^"], ["COMMAND+", "⌘"]];
  (0, _react.useEffect)(function () {
    if (props.registerOmniGetter) {
      props.registerOmniGetter(props.menu_name, _getOmniItems);
    }
  }, []);
  function _filter_on_match_list(opt_name) {
    return !props.hidden_items.includes(opt_name);
  }
  function _filter_on_disabled_list(opt_name) {
    return !props.disable_all && !props.disabled_items.includes(opt_name);
  }
  function _bindingsToString(binding_list) {
    if (binding_list == null) {
      return null;
    }
    var new_binding = binding_list[0];
    for (var _i = 0, _replacers = replacers; _i < _replacers.length; _i++) {
      var rep = _replacers[_i];
      // noinspection JSCheckFunctionSignatures
      new_binding = new_binding.toUpperCase().replace(rep[0], rep[1]);
    }
    return /*#__PURE__*/_react["default"].createElement("span", {
      style: {
        fontFamily: "system-ui"
      }
    }, new_binding);
  }
  function _getOmniItems() {
    var omni_items = [];
    var pruned_list = Object.keys(props.option_dict).filter(_filter_on_match_list);
    pruned_list = pruned_list.filter(_filter_on_disabled_list);
    var _iterator2 = _createForOfIteratorHelper(pruned_list),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var choice = _step2.value;
        if (choice.startsWith("divider")) continue;
        var icon_name = props.icon_dict.hasOwnProperty(choice) ? props.icon_dict[choice] : null;
        omni_items.push({
          category: props.menu_name,
          display_text: choice,
          search_text: choice,
          icon_name: icon_name,
          the_function: props.option_dict[choice]
        });
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    return omni_items;
  }
  var pruned_list = Object.keys(props.option_dict).filter(_filter_on_match_list);
  var choices = pruned_list.map(function (opt_name, index) {
    if (opt_name.startsWith("divider")) {
      return /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, {
        key: index
      });
    }
    var icon = null;
    if (props.icon_dict.hasOwnProperty(opt_name)) {
      icon = /*#__PURE__*/_react["default"].createElement(_core.Icon, {
        icon: props.icon_dict[opt_name],
        size: 14
      });
    }
    var label = null;
    if (opt_name in props.binding_dict) {
      label = _bindingsToString(props.binding_dict[opt_name]);
    }
    return /*#__PURE__*/_react["default"].createElement(_popover.MenuItem2, {
      disabled: props.disable_all || props.disabled_items.includes(opt_name),
      onClick: props.option_dict[opt_name],
      icon: icon,
      labelElement: label,
      key: opt_name,
      text: opt_name,
      className: props.item_class
    });
  });
  var the_menu = /*#__PURE__*/_react["default"].createElement(_core.Menu, {
    className: _core.Classes.ELEVATION_1
  }, choices);
  if (props.alt_button) {
    var AltButton = props.alt_button;
    return /*#__PURE__*/_react["default"].createElement(_popover.Popover2, {
      minimal: true,
      content: the_menu,
      transitionDuration: 150,
      position: props.position
    }, /*#__PURE__*/_react["default"].createElement(AltButton, null));
  } else {
    return /*#__PURE__*/_react["default"].createElement(_popover.Popover2, {
      minimal: true,
      content: the_menu,
      transitionDuration: 150,
      position: props.position
    }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
      text: props.menu_name,
      small: true,
      minimal: true
    }));
  }
}
exports.MenuComponent = MenuComponent = /*#__PURE__*/(0, _react.memo)(MenuComponent);
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
  position: _propTypes["default"].string,
  registerOmniGetter: _propTypes["default"].func
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
  position: _core.PopoverPosition.BOTTOM_LEFT,
  registerOmniGetter: null
};
function ToolMenu(props) {
  function option_dict() {
    var opt_dict = {};
    var _iterator3 = _createForOfIteratorHelper(props.menu_items),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var but = _step3.value;
        opt_dict[but.name_text] = but.click_handler;
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    return opt_dict;
  }
  function icon_dict() {
    var icon_dict = {};
    var _iterator4 = _createForOfIteratorHelper(props.menu_items),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var but = _step4.value;
        icon_dict[but.name_text] = but.icon_name;
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
    return icon_dict;
  }
  function binding_dict() {
    var binding_dict = {};
    var _iterator5 = _createForOfIteratorHelper(props.menu_items),
      _step5;
    try {
      for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
        var but = _step5.value;
        if ("key_bindings" in but) {
          binding_dict[but.name_text] = but.key_bindings;
        } else {
          binding_dict[but.name_text] = null;
        }
      }
    } catch (err) {
      _iterator5.e(err);
    } finally {
      _iterator5.f();
    }
    return binding_dict;
  }
  var key_bindings = [];
  var _iterator6 = _createForOfIteratorHelper(props.menu_items),
    _step6;
  try {
    var _loop = function _loop() {
      var button = _step6.value;
      if (button.hasOwnProperty("key_bindings")) key_bindings.push([button.key_bindings, function () {
        return button.click_handler();
      }]);
    };
    for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
      _loop();
    }
  } catch (err) {
    _iterator6.e(err);
  } finally {
    _iterator6.f();
  }
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(MenuComponent, {
    menu_name: props.menu_name,
    option_dict: option_dict(),
    icon_dict: icon_dict(),
    binding_dict: binding_dict(),
    disabled_items: props.disabled_items,
    registerOmniGetter: props.registerOmniGetter,
    hidden_items: []
  }), /*#__PURE__*/_react["default"].createElement(_key_trap.KeyTrap, {
    global: true,
    active: !props.controlled || props.am_selected,
    bindings: key_bindings
  }));
}
exports.ToolMenu = ToolMenu = /*#__PURE__*/(0, _react.memo)(ToolMenu);
ToolMenu.propTypes = {
  menu_name: _propTypes["default"].string,
  menu_items: _propTypes["default"].array,
  disabled_items: _propTypes["default"].array,
  controlled: _propTypes["default"].bool,
  am_selected: _propTypes["default"].bool,
  registerOmniGetter: _propTypes["default"].func
};
ToolMenu.defaultProps = {
  disabled_items: [],
  registerOmniGetter: null
};
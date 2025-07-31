"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MenuComponent = MenuComponent;
exports.TacticMenubar = TacticMenubar;
exports.ToolMenu = ToolMenu;
exports.TopLeftButtons = TopLeftButtons;
var _react = _interopRequireWildcard(require("react"));
var _core = require("@blueprintjs/core");
var _settings = require("./settings");
var _blueprint_react_widgets = require("./blueprint_react_widgets");
var _utilities_react = require("./utilities_react");
var _error_drawer = require("./error_drawer");
var _assistant = require("./assistant");
var _metadata_drawer = require("./metadata_drawer");
var _sizing_tools = require("./sizing_tools");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var name_style = {
  marginButton: 0,
  marginLeft: 10,
  marginRight: 10,
  display: "flex",
  alignItems: "center",
  fontWeight: "bold"
};
var top_icon_style = {
  display: "flex",
  justifyContent: "flex-end",
  marginTop: 0,
  paddingTop: 3,
  marginRight: 10
};
var button_group_style = {
  position: "absolute",
  right: 10
};
var chat_status_style = {
  marginRight: 7,
  paddingTop: 7
};
function TacticMenubar(props) {
  props = _objectSpread({
    showClose: window.in_context,
    showRefresh: window.in_context,
    refreshTab: null,
    closeTab: null,
    menu_specs: null,
    menus: null,
    showIconBar: false,
    showErrorDrawerButton: false,
    showMetadataDrawerButton: false,
    showAssistantDrawerButton: false,
    showSettingsDrawerButton: true,
    resource_name: null,
    resource_icon: null,
    disabled_items: [],
    extraButtons: null,
    suggestionGlyphs: [],
    connection_status: null
  }, props);
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  var menus;
  if (props.menu_specs == null) {
    menus = props.menus;
  } else {
    menus = [];
    var mcounter = 0;
    for (var menu_name in props.menu_specs) {
      mcounter += 1;
      menus.push(/*#__PURE__*/_react["default"].createElement(ToolMenu, {
        menu_name: menu_name,
        key: menu_name + String(mcounter),
        disabled_items: props.disabled_items,
        menu_items: props.menu_specs[menu_name],
        controlled: props.controlled
      }));
    }
  }
  var sug_glyphs = [];
  var scounter = 0;
  var _iterator = _createForOfIteratorHelper(props.suggestionGlyphs),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var sg = _step.value;
      scounter += 1;
      sug_glyphs.push(/*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        intent: sg.intent,
        key: sg.icon + String(scounter),
        handleClick: sg.handleClick,
        icon: sg.icon
      }));
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  var theme_class = settingsContext.isDark() ? "bp6-dark" : "light-theme";
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
    size: 16,
    tabIndex: -1
  }), props.resource_name && /*#__PURE__*/_react["default"].createElement("div", {
    style: name_style
  }, props.resource_name), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      height: 30
    },
    className: "bp6-navbar-group bp6-align-left"
  }, /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, menus, sug_glyphs)), props.connection_status && /*#__PURE__*/_react["default"].createElement(ConnectionIndicator, {
    connection_status: props.connection_status
  }), props.showIconBar && /*#__PURE__*/_react["default"].createElement(IconBar, {
    showErrorDrawerButton: props.showErrorDrawerButton,
    showAssistantDrawerButton: props.showAssistantDrawerButton,
    showMetadataDrawerButton: props.showMetadataDrawerButton,
    showSettingsDrawerButton: props.showSettingsDrawerButton
  }));
}
exports.TacticMenubar = TacticMenubar = /*#__PURE__*/(0, _react.memo)(TacticMenubar);
function ConnectionIndicator(props) {
  var top_icon_style = {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 3,
    paddingTop: 3,
    marginRight: 20,
    opacity: .75
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: top_icon_style
  }, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
    icon: props.connection_status == "up" ? "circle-arrow-up" : "offline",
    intent: props.connection_status == "up" ? null : "danger",
    size: 18
  }));
}
var IconBarStyle = {
  width: _sizing_tools.ICON_BAR_WIDTH
};
function IconBar(props) {
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  var assistantDrawerFuncs = (0, _react.useContext)(_assistant.AssistantContext);
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  var metadataContext = (0, _react.useContext)(_metadata_drawer.MetadataContext);
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "verticalIconBar",
    style: IconBarStyle
  }, props.showSettingsDrawerButton && /*#__PURE__*/_react["default"].createElement(IconBarButton, {
    icon: "cog",
    onClick: function onClick() {
      settingsContext.toggleSettingsDrawer();
      errorDrawerFuncs.closeErrorDrawer();
      if (props.showMetadataDrawerButton) {
        metadataContext.hideMetadata();
      }
      assistantDrawerFuncs.closeAssistantDrawer();
    }
  }), props.showErrorDrawerButton && /*#__PURE__*/_react["default"].createElement(IconBarButton, {
    icon: "bug",
    onClick: function onClick() {
      errorDrawerFuncs.toggleErrorDrawer();
      if (props.showMetadataDrawerButton) {
        metadataContext.hideMetadata();
      }
      settingsContext.setShowSettingsDrawer(false);
      assistantDrawerFuncs.closeAssistantDrawer();
    }
  }), window.has_openapi_key && props.showAssistantDrawerButton && assistantDrawerFuncs && props.showAssistantDrawerButton && /*#__PURE__*/_react["default"].createElement(IconBarButton, {
    icon: "chat",
    onClick: function onClick() {
      assistantDrawerFuncs.toggleAssistantDrawer();
      errorDrawerFuncs.closeErrorDrawer();
      if (props.showMetadataDrawerButton) {
        metadataContext.hideMetadata();
      }
      settingsContext.setShowSettingsDrawer(false);
    }
  }), props.showMetadataDrawerButton && /*#__PURE__*/_react["default"].createElement(IconBarButton, {
    icon: "list-columns",
    onClick: function onClick() {
      metadataContext.toggleMetadata();
      errorDrawerFuncs.closeErrorDrawer();
      settingsContext.setShowSettingsDrawer(false);
      assistantDrawerFuncs.closeAssistantDrawer();
    }
  }));
}
IconBar = /*#__PURE__*/(0, _react.memo)(IconBar);
function IconBarButton(props) {
  return /*#__PURE__*/_react["default"].createElement(_core.Button, {
    icon: /*#__PURE__*/_react["default"].createElement(_core.Icon, {
      icon: props.icon,
      size: 18
    }),
    variant: "minimal",
    size: "large",
    className: "iconBarButton",
    onClick: props.onClick
  });
}
function ErrorDrawerButton(props) {
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  return (
    /*#__PURE__*/
    // <div style={top_icon_style}>
    _react["default"].createElement(_core.Button, {
      icon: /*#__PURE__*/_react["default"].createElement(_core.Icon, {
        icon: "bug",
        size: 18
      })
      //style={{paddingLeft: 4, paddingRight: 0}}
      ,
      className: "context-close-button",
      text: "Errors",
      tabIndex: -1,
      onClick: function onClick() {
        errorDrawerFuncs.toggleErrorDrawer();
      }
    })
    // </div>
  );
}
ErrorDrawerButton = /*#__PURE__*/(0, _react.memo)(ErrorDrawerButton);
function AssistantDrawerButton(props) {
  var assistantDrawerFuncs = (0, _react.useContext)(_assistant.AssistantContext);
  return (
    /*#__PURE__*/
    //div style={top_icon_style}>
    _react["default"].createElement(_core.Button, {
      icon: /*#__PURE__*/_react["default"].createElement(_core.Icon, {
        icon: "chat",
        size: 18
      })
      //style={{paddingLeft: 4, paddingRight: 0}}
      ,
      minimal: false,
      className: "context-close-button",
      text: "Assistant",
      tabIndex: -1,
      onClick: function onClick() {
        assistantDrawerFuncs.toggleAssistantDrawer();
      }
    })
    //</div>
  );
}
AssistantDrawerButton = /*#__PURE__*/(0, _react.memo)(AssistantDrawerButton);
function MetadataDrawerButton(props) {
  return (
    /*#__PURE__*/
    //<div style={top_icon_style}>
    _react["default"].createElement(_core.Button, {
      icon: /*#__PURE__*/_react["default"].createElement(_core.Icon, {
        icon: "list-columns",
        size: 18
      })
      //style={{paddingLeft: 4, paddingRight: 0}}
      ,
      className: "context-close-button",
      text: "Metadata",
      tabIndex: -1,
      onClick: function onClick() {
        props.showMetadata();
      }
    })
    //</div>
  );
}
MetadataDrawerButton = /*#__PURE__*/(0, _react.memo)(MetadataDrawerButton);
function TopLeftButtons(props) {
  props = _objectSpread({
    extraButtons: null
  }, props);
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
      ebuttons.push(/*#__PURE__*/_react["default"].createElement(_core.Button, {
        icon: /*#__PURE__*/_react["default"].createElement(_core.Icon, {
          icon: but_info.icon,
          size: 14
        }),
        style: {
          paddingLeft: 8
        },
        variant: "minimal",
        className: "context-close-button",
        size: "small",
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
      size: 14
    }),
    style: {
      paddingLeft: 4,
      paddingRight: 0
    },
    variant: "minimal",
    className: "context-close-button",
    size: "small",
    tabIndex: -1,
    intent: "danger",
    onClick: function onClick() {
      props.closeTab();
    }
  }), props.showRefresh && /*#__PURE__*/_react["default"].createElement(_core.Button, {
    icon: /*#__PURE__*/_react["default"].createElement(_core.Icon, {
      icon: "reset",
      size: 14
    }),
    style: {
      paddingLeft: 8
    },
    variant: "minimal",
    className: "context-close-button",
    size: "small",
    tabIndex: -1,
    intent: "danger",
    onClick: function onClick() {
      props.refreshTab();
    }
  }), props.extraButtons && ebuttons);
}
exports.TopLeftButtons = TopLeftButtons = /*#__PURE__*/(0, _react.memo)(TopLeftButtons);
function MenuComponent(props) {
  props = _objectSpread({
    menu_name: null,
    item_class: "",
    disabled_items: [],
    binding_dict: {},
    disable_all: false,
    hidden_items: [],
    icon_dict: {},
    alt_button: null,
    position: _core.PopoverPosition.BOTTOM_LEFT,
    createOmniItems: true
  }, props);
  var replacers = [["CTRL+", "^"], ["COMMAND+", "⌘"]];
  var selectedPane = (0, _react.useContext)(_utilities_react.SelectedPaneContext);
  (0, _react.useEffect)(function () {
    if (props.createOmniItems && window.in_context && "addOmniItems" in selectedPane) {
      selectedPane.addOmniItems(_getOmniItems());
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
          category: "Menu Option",
          display_text: choice,
          search_text: choice,
          icon_name: icon_name,
          item_type: "command",
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
    return /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
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
    return /*#__PURE__*/_react["default"].createElement(_core.Popover, {
      variant: "minimal",
      content: the_menu,
      transitionDuration: 150,
      position: props.position
    }, /*#__PURE__*/_react["default"].createElement(AltButton, null));
  } else {
    return /*#__PURE__*/_react["default"].createElement(_core.Popover, {
      variant: "minimal",
      content: the_menu,
      transitionDuration: 150,
      position: props.position
    }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
      text: props.menu_name,
      size: "small",
      variant: "minimal"
    }));
  }
}
exports.MenuComponent = MenuComponent = /*#__PURE__*/(0, _react.memo)(MenuComponent);
function ToolMenu(props) {
  props = _objectSpread({
    disabled_items: []
  }, props);
  var selectedPane = (0, _react.useContext)(_utilities_react.SelectedPaneContext);
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
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(MenuComponent, {
    menu_name: props.menu_name,
    option_dict: option_dict(),
    icon_dict: icon_dict(),
    binding_dict: binding_dict(),
    disabled_items: props.disabled_items,
    hidden_items: []
  }));
}
exports.ToolMenu = ToolMenu = /*#__PURE__*/(0, _react.memo)(ToolMenu);
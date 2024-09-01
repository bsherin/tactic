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
var _popover = require("@blueprintjs/popover2");
var _settings = require("./settings");
var _blueprint_react_widgets = require("./blueprint_react_widgets");
var _utilities_react = require("./utilities_react");
var _error_drawer = require("./error_drawer");
var _assistant = require("./assistant");
var _metadata_drawer = require("./metadata_drawer");
var _sizing_tools = require("./sizing_tools");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const name_style = {
  marginButton: 0,
  marginLeft: 10,
  marginRight: 10,
  display: "flex",
  alignItems: "center",
  fontWeight: "bold"
};
let top_icon_style = {
  display: "flex",
  justifyContent: "flex-end",
  marginTop: 0,
  paddingTop: 3,
  marginRight: 10
};
const button_group_style = {
  position: "absolute",
  right: 10
};
const chat_status_style = {
  marginRight: 7,
  paddingTop: 7
};
function TacticMenubar(props) {
  props = {
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
    connection_status: null,
    ...props
  };
  const settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  let menus;
  if (props.menu_specs == null) {
    menus = props.menus;
  } else {
    menus = [];
    let mcounter = 0;
    for (let menu_name in props.menu_specs) {
      mcounter += 1;
      menus.push( /*#__PURE__*/_react.default.createElement(ToolMenu, {
        menu_name: menu_name,
        key: menu_name + String(mcounter),
        disabled_items: props.disabled_items,
        menu_items: props.menu_specs[menu_name],
        controlled: props.controlled
      }));
    }
  }
  let sug_glyphs = [];
  let scounter = 0;
  for (let sg of props.suggestionGlyphs) {
    scounter += 1;
    sug_glyphs.push( /*#__PURE__*/_react.default.createElement(_blueprint_react_widgets.GlyphButton, {
      intent: sg.intent,
      key: sg.icon + String(scounter),
      handleClick: sg.handleClick,
      icon: sg.icon
    }));
  }
  const theme_class = settingsContext.isDark() ? "bp5-dark" : "light-theme";
  return /*#__PURE__*/_react.default.createElement(_core.Navbar, {
    style: {
      paddingLeft: 3,
      height: 30,
      display: "flex"
    },
    className: theme_class + " menu-bar"
  }, (props.showClose || props.showRefresh) && /*#__PURE__*/_react.default.createElement(TopLeftButtons, {
    showRefresh: props.showRefresh,
    showClose: props.showClose,
    refreshTab: props.refreshTab,
    closeTab: props.closeTab,
    extraButtons: props.extraButtons
  }), props.resource_icon && /*#__PURE__*/_react.default.createElement(_core.Icon, {
    style: {
      marginTop: 6
    },
    icon: props.resource_icon,
    size: 16,
    tabIndex: -1
  }), props.resource_name && /*#__PURE__*/_react.default.createElement("div", {
    style: name_style
  }, props.resource_name), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      height: 30
    },
    className: "bp5-navbar-group bp5-align-left"
  }, /*#__PURE__*/_react.default.createElement(_react.Fragment, null, menus, sug_glyphs)), props.connection_status && /*#__PURE__*/_react.default.createElement(ConnectionIndicator, {
    connection_status: props.connection_status
  }), props.showIconBar && /*#__PURE__*/_react.default.createElement(IconBar, {
    showErrorDrawerButton: props.showErrorDrawerButton,
    showAssistantDrawerButton: props.showAssistantDrawerButton,
    showMetadataDrawerButton: props.showMetadataDrawerButton,
    showSettingsDrawerButton: props.showSettingsDrawerButton
  }));
}
exports.TacticMenubar = TacticMenubar = /*#__PURE__*/(0, _react.memo)(TacticMenubar);
function ConnectionIndicator(props) {
  let top_icon_style = {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 3,
    paddingTop: 3,
    marginRight: 20,
    opacity: .75
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    style: top_icon_style
  }, /*#__PURE__*/_react.default.createElement(_core.Icon, {
    icon: props.connection_status == "up" ? "circle-arrow-up" : "offline",
    intent: props.connection_status == "up" ? null : "danger",
    size: 18
  }));
}
const IconBarStyle = {
  width: _sizing_tools.ICON_BAR_WIDTH
};
function IconBar(props) {
  const errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  const assistantDrawerFuncs = (0, _react.useContext)(_assistant.AssistantContext);
  const settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  const metadataContext = (0, _react.useContext)(_metadata_drawer.MetadataContext);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "verticalIconBar",
    style: IconBarStyle
  }, props.showSettingsDrawerButton && /*#__PURE__*/_react.default.createElement(IconBarButton, {
    icon: "cog",
    onClick: () => {
      settingsContext.toggleSettingsDrawer();
      errorDrawerFuncs.closeErrorDrawer();
      if (props.showMetadataDrawerButton) {
        metadataContext.hideMetadata();
      }
      assistantDrawerFuncs.closeAssistantDrawer();
    }
  }), props.showErrorDrawerButton && /*#__PURE__*/_react.default.createElement(IconBarButton, {
    icon: "bug",
    onClick: () => {
      errorDrawerFuncs.toggleErrorDrawer();
      if (props.showMetadataDrawerButton) {
        metadataContext.hideMetadata();
      }
      settingsContext.setShowSettingsDrawer(false);
      assistantDrawerFuncs.closeAssistantDrawer();
    }
  }), window.has_openapi_key && props.showAssistantDrawerButton && assistantDrawerFuncs && props.showAssistantDrawerButton && /*#__PURE__*/_react.default.createElement(IconBarButton, {
    icon: "chat",
    onClick: () => {
      assistantDrawerFuncs.toggleAssistantDrawer();
      errorDrawerFuncs.closeErrorDrawer();
      if (props.showMetadataDrawerButton) {
        metadataContext.hideMetadata();
      }
      settingsContext.setShowSettingsDrawer(false);
    }
  }), props.showMetadataDrawerButton && /*#__PURE__*/_react.default.createElement(IconBarButton, {
    icon: "list-columns",
    onClick: () => {
      metadataContext.toggleMetadata();
      errorDrawerFuncs.closeErrorDrawer();
      settingsContext.setShowSettingsDrawer(false);
      assistantDrawerFuncs.closeAssistantDrawer();
    }
  }));
}
IconBar = /*#__PURE__*/(0, _react.memo)(IconBar);
function IconBarButton(props) {
  return /*#__PURE__*/_react.default.createElement(_core.Button, {
    icon: /*#__PURE__*/_react.default.createElement(_core.Icon, {
      icon: props.icon,
      size: 18
    }),
    minimal: true,
    large: true,
    className: "iconBarButton",
    onClick: props.onClick
  });
}
function DrawerButtonGroup(props) {
  const [visible, setVisible, visibleRef] = (0, _utilities_react.useStateAndRef)(false);
  const assistantDrawerFuncs = (0, _react.useContext)(_assistant.AssistantContext);
  (0, _react.useEffect)(() => {
    const handleMouseMove = event => {
      const {
        clientX
      } = event;
      const windowWidth = window.innerWidth;
      if (windowWidth - clientX < 50) {
        // Show buttons when near the right edge (50px threshold)
        if (!visibleRef.current) setVisible(true);
      } else {
        if (visibleRef.current) setVisible(false);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  return /*#__PURE__*/_react.default.createElement(_core.ButtonGroup, {
    className: `floating-button-group ${visible ? 'visible' : ''}`,
    large: true,
    alignText: "left",
    vertical: false
  }, props.showErrorDrawerButton && /*#__PURE__*/_react.default.createElement(ErrorDrawerButton, null), assistantDrawerFuncs && assistantDrawerFuncs.showAssistantDrawerButton && /*#__PURE__*/_react.default.createElement(AssistantDrawerButton, null), props.showMetadataDrawerButton && /*#__PURE__*/_react.default.createElement(MetadataDrawerButton, {
    show_drawer: props.showMetadata
  }));
}
function ErrorDrawerButton(props) {
  const errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  return (
    /*#__PURE__*/
    // <div style={top_icon_style}>
    _react.default.createElement(_core.Button, {
      icon: /*#__PURE__*/_react.default.createElement(_core.Icon, {
        icon: "bug",
        size: 18
      })
      //style={{paddingLeft: 4, paddingRight: 0}}
      ,
      minimal: false,
      className: "context-close-button",
      small: false,
      text: "Errors",
      tabIndex: -1,
      onClick: () => {
        errorDrawerFuncs.toggleErrorDrawer();
      }
    })
    // </div>
  );
}
ErrorDrawerButton = /*#__PURE__*/(0, _react.memo)(ErrorDrawerButton);
function AssistantDrawerButton(props) {
  const assistantDrawerFuncs = (0, _react.useContext)(_assistant.AssistantContext);
  return (
    /*#__PURE__*/
    //div style={top_icon_style}>
    _react.default.createElement(_core.Button, {
      icon: /*#__PURE__*/_react.default.createElement(_core.Icon, {
        icon: "chat",
        size: 18
      })
      //style={{paddingLeft: 4, paddingRight: 0}}
      ,
      minimal: false,
      className: "context-close-button",
      text: "Assistant",
      small: false,
      tabIndex: -1,
      onClick: () => {
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
    _react.default.createElement(_core.Button, {
      icon: /*#__PURE__*/_react.default.createElement(_core.Icon, {
        icon: "list-columns",
        size: 18
      })
      //style={{paddingLeft: 4, paddingRight: 0}}
      ,
      minimal: false,
      className: "context-close-button",
      small: false,
      text: "Metadata",
      tabIndex: -1,
      onClick: () => {
        props.showMetadata();
      }
    })
    //</div>
  );
}
MetadataDrawerButton = /*#__PURE__*/(0, _react.memo)(MetadataDrawerButton);
function TopLeftButtons(props) {
  props = {
    extraButtons: null,
    ...props
  };
  let top_icon_style = {
    display: "flex",
    justifyContent: "flex-start",
    marginTop: 0,
    paddingTop: 0,
    marginRight: 8
  };
  let ebuttons = [];
  if (props.extraButtons != null) {
    props.extraButtons.map((but_info, index) => {
      ebuttons.push( /*#__PURE__*/_react.default.createElement(_core.Button, {
        icon: /*#__PURE__*/_react.default.createElement(_core.Icon, {
          icon: but_info.icon,
          size: 14
        }),
        style: {
          paddingLeft: 8
        },
        minimal: true,
        className: "context-close-button",
        small: true,
        key: index,
        tabIndex: -1,
        onClick: () => {
          but_info.onClick();
        }
      }));
    });
  }
  return /*#__PURE__*/_react.default.createElement("div", {
    style: top_icon_style
  }, props.showClose && /*#__PURE__*/_react.default.createElement(_core.Button, {
    icon: /*#__PURE__*/_react.default.createElement(_core.Icon, {
      icon: "delete",
      size: 14
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
    onClick: () => {
      props.closeTab();
    }
  }), props.showRefresh && /*#__PURE__*/_react.default.createElement(_core.Button, {
    icon: /*#__PURE__*/_react.default.createElement(_core.Icon, {
      icon: "reset",
      size: 14
    }),
    style: {
      paddingLeft: 8
    },
    minimal: true,
    className: "context-close-button",
    small: true,
    tabIndex: -1,
    intent: "danger",
    onClick: () => {
      props.refreshTab();
    }
  }), props.extraButtons && ebuttons);
}
exports.TopLeftButtons = TopLeftButtons = /*#__PURE__*/(0, _react.memo)(TopLeftButtons);
function MenuComponent(props) {
  props = {
    menu_name: null,
    item_class: "",
    disabled_items: [],
    binding_dict: {},
    disable_all: false,
    hidden_items: [],
    icon_dict: {},
    alt_button: null,
    position: _core.PopoverPosition.BOTTOM_LEFT,
    createOmniItems: true,
    ...props
  };
  const replacers = [["CTRL+", "^"], ["COMMAND+", "⌘"]];
  const selectedPane = (0, _react.useContext)(_utilities_react.SelectedPaneContext);
  (0, _react.useEffect)(() => {
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
    let new_binding = binding_list[0];
    for (let rep of replacers) {
      // noinspection JSCheckFunctionSignatures
      new_binding = new_binding.toUpperCase().replace(rep[0], rep[1]);
    }
    return /*#__PURE__*/_react.default.createElement("span", {
      style: {
        fontFamily: "system-ui"
      }
    }, new_binding);
  }
  function _getOmniItems() {
    let omni_items = [];
    let pruned_list = Object.keys(props.option_dict).filter(_filter_on_match_list);
    pruned_list = pruned_list.filter(_filter_on_disabled_list);
    for (let choice of pruned_list) {
      if (choice.startsWith("divider")) continue;
      let icon_name = props.icon_dict.hasOwnProperty(choice) ? props.icon_dict[choice] : null;
      omni_items.push({
        category: "Menu Option",
        display_text: choice,
        search_text: choice,
        icon_name: icon_name,
        item_type: "command",
        the_function: props.option_dict[choice]
      });
    }
    return omni_items;
  }
  let pruned_list = Object.keys(props.option_dict).filter(_filter_on_match_list);
  let choices = pruned_list.map((opt_name, index) => {
    if (opt_name.startsWith("divider")) {
      return /*#__PURE__*/_react.default.createElement(_core.MenuDivider, {
        key: index
      });
    }
    let icon = null;
    if (props.icon_dict.hasOwnProperty(opt_name)) {
      icon = /*#__PURE__*/_react.default.createElement(_core.Icon, {
        icon: props.icon_dict[opt_name],
        size: 14
      });
    }
    let label = null;
    if (opt_name in props.binding_dict) {
      label = _bindingsToString(props.binding_dict[opt_name]);
    }
    return /*#__PURE__*/_react.default.createElement(_popover.MenuItem2, {
      disabled: props.disable_all || props.disabled_items.includes(opt_name),
      onClick: props.option_dict[opt_name],
      icon: icon,
      labelElement: label,
      key: opt_name,
      text: opt_name,
      className: props.item_class
    });
  });
  let the_menu = /*#__PURE__*/_react.default.createElement(_core.Menu, {
    className: _core.Classes.ELEVATION_1
  }, choices);
  if (props.alt_button) {
    let AltButton = props.alt_button;
    return /*#__PURE__*/_react.default.createElement(_popover.Popover2, {
      minimal: true,
      content: the_menu,
      transitionDuration: 150,
      position: props.position
    }, /*#__PURE__*/_react.default.createElement(AltButton, null));
  } else {
    return /*#__PURE__*/_react.default.createElement(_popover.Popover2, {
      minimal: true,
      content: the_menu,
      transitionDuration: 150,
      position: props.position
    }, /*#__PURE__*/_react.default.createElement(_core.Button, {
      text: props.menu_name,
      small: true,
      minimal: true
    }));
  }
}
exports.MenuComponent = MenuComponent = /*#__PURE__*/(0, _react.memo)(MenuComponent);
function ToolMenu(props) {
  props = {
    disabled_items: [],
    ...props
  };
  const selectedPane = (0, _react.useContext)(_utilities_react.SelectedPaneContext);
  function option_dict() {
    let opt_dict = {};
    for (let but of props.menu_items) {
      opt_dict[but.name_text] = but.click_handler;
    }
    return opt_dict;
  }
  function icon_dict() {
    let icon_dict = {};
    for (let but of props.menu_items) {
      icon_dict[but.name_text] = but.icon_name;
    }
    return icon_dict;
  }
  function binding_dict() {
    let binding_dict = {};
    for (let but of props.menu_items) {
      if ("key_bindings" in but) {
        binding_dict[but.name_text] = but.key_bindings;
      } else {
        binding_dict[but.name_text] = null;
      }
    }
    return binding_dict;
  }
  return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(MenuComponent, {
    menu_name: props.menu_name,
    option_dict: option_dict(),
    icon_dict: icon_dict(),
    binding_dict: binding_dict(),
    disabled_items: props.disabled_items,
    hidden_items: []
  }));
}
exports.ToolMenu = ToolMenu = /*#__PURE__*/(0, _react.memo)(ToolMenu);
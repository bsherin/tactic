"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TacticNavbar = TacticNavbar;
exports.get_theme_cookie = get_theme_cookie;
exports.render_navbar = render_navbar;
exports.set_theme_cookie = set_theme_cookie;
var _react = _interopRequireWildcard(require("react"));
var ReactDOM = _interopRequireWildcard(require("react-dom"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
var _main_menus_react = require("./main_menus_react.js");
var _communication_react = require("./communication_react");
var _theme = require("./theme");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const context_url = $SCRIPT_ROOT + '/context';
const library_url = $SCRIPT_ROOT + '/library';
const repository_url = $SCRIPT_ROOT + '/repository';
const account_url = $SCRIPT_ROOT + '/account_info';
const login_url = $SCRIPT_ROOT + "/login";
const padding = 10;
function get_theme_cookie() {
  let cookie_str = document.cookie.split('; ').find(row => row.startsWith('tactic_theme'));
  if (cookie_str == undefined) {
    set_theme_cookie("light");
    return "light";
  }
  return cookie_str.split('=')[1];
}
function set_theme_cookie(theme) {
  document.cookie = "tactic_theme=" + theme;
}
function TacticNavbar(props) {
  const [usable_width, set_usable_width] = (0, _react.useState)(() => {
    return window.innerWidth - padding * 2;
  });
  const [old_left_width, set_old_left_width] = (0, _react.useState)(null);
  const lg_ref = (0, _react.useRef)(null);
  const theme = (0, _react.useContext)(_theme.ThemeContext);
  var overflow_items = [];
  function _update_window_dimensions() {
    set_usable_width(window.innerWidth - 2 * padding);
  }

  // For some reason sizing things are a little flaky without old_left_width stuff
  (0, _react.useEffect)(() => {
    window.addEventListener("resize", _update_window_dimensions);
    _update_window_dimensions();
    if (!old_left_width) {
      set_old_left_width(_getLeftWidth());
    } else {
      let new_left_width = _getLeftWidth();
      if (new_left_width != old_left_width) {
        set_old_left_width(new_left_width);
      }
    }
  });
  function getIntent(butname) {
    return props.selected == butname ? "primary" : null;
  }
  function _onOverflow(items) {
    overflow_items = items;
  }
  function _handle_signout() {
    window.open($SCRIPT_ROOT + "/logout/" + props.page_id, "_self");
    return false;
  }
  function _setTheme(event) {
    let dtheme = event.target.checked ? "dark" : "light";
    set_theme_cookie(dtheme);
    if (window.user_id != undefined) {
      const result_dict = {
        "user_id": window.user_id,
        "theme": dtheme
      };
      (0, _communication_react.postWithCallback)("host", "set_user_theme", result_dict, null, null);
    }
    theme.setTheme(event.target.checked);
  }
  function renderNav(item) {
    return /*#__PURE__*/_react.default.createElement(_core.Button, {
      icon: item.icon,
      key: item.text,
      minimal: true,
      style: {
        minWidth: "fit-content"
      },
      text: item.text,
      intent: item.intent,
      onClick: item.onClick
    });
  }
  function _getLeftWidth() {
    if (lg_ref && lg_ref.current) {
      return lg_ref.current.getBoundingClientRect().width;
    }
    return null;
  }
  function _getRightWidth() {
    let lg_width = _getLeftWidth();
    if (lg_width) {
      return usable_width - lg_width - 35;
    } else {
      return .25 * usable_width - 35;
    }
  }
  function _authenticatedItems() {
    return [{
      icon: "add",
      text: "Context",
      intent: getIntent("library"),
      onClick: () => {
        window.open(context_url);
      }
    }, {
      icon: "add",
      text: "Tabbed",
      intent: getIntent("library"),
      onClick: () => {
        window.open(library_url);
      }
    }, {
      icon: "database",
      text: "Repository",
      intent: getIntent("repository"),
      onClick: () => {
        window.open(repository_url);
      }
    }, {
      icon: "person",
      text: props.user_name,
      intent: getIntent("account"),
      onClick: () => {
        window.open(account_url);
      }
    }, {
      icon: "log-out",
      text: "Logout",
      intent: getIntent("logout"),
      onClick: _handle_signout
    }];
  }
  function _notAuthenticatedItems() {
    return [{
      icon: "log-in",
      text: "Login",
      intent: getIntent("login"),
      onClick: () => {
        window.open(login_url);
      }
    }];
  }
  function _overflowRenderer() {
    let opt_dict = {};
    let icon_dict = {};
    for (let item of overflow_items) {
      opt_dict[item.text] = item.onClick;
      icon_dict[item.text] = item.icon;
    }
    return /*#__PURE__*/_react.default.createElement(_main_menus_react.MenuComponent, {
      alt_button: () => /*#__PURE__*/_react.default.createElement("span", {
        className: "bp5-breadcrumbs-collapsed",
        style: {
          marginTop: 5
        }
      }),
      option_dict: opt_dict,
      binding_dict: {},
      icon_dict: icon_dict
    });
  }
  let nav_class = props.menus == null ? "justify-content-end" : "justify-content-between";
  let right_nav_items = [];
  if (props.show_api_links) {
    right_nav_items = [{
      icon: "code-block",
      text: "Api",
      intent: null,
      onClick: () => {
        window.open("https://tactic.readthedocs.io/en/latest/Tile-Commands.html");
      }
    }, {
      icon: "code-block",
      text: "ObjApi",
      intent: null,
      onClick: () => {
        window.open("https://tactic.readthedocs.io/en/latest/Object-Oriented-API.html");
      }
    }];
  }
  right_nav_items.push({
    icon: "manual",
    text: "Docs",
    intent: null,
    onClick: () => {
      window.open("http://tactic.readthedocs.io/en/latest/index.html");
    }
  });
  if (props.is_authenticated) {
    right_nav_items = right_nav_items.concat(_authenticatedItems());
  } else {
    right_nav_items = right_nav_items.concat(_notAuthenticatedItems());
  }
  let right_width = _getRightWidth();
  let right_style = {
    width: right_width
  };
  right_style.justifyContent = "flex-end";
  let theme_class = theme.dark_theme ? "bp5-dark" : "light-theme";
  let name_string = "Tactic";
  if (props.extra_text != null) {
    name_string += " " + props.extra_text;
  }
  return /*#__PURE__*/_react.default.createElement(_core.Navbar, {
    style: {
      paddingLeft: 10
    },
    className: theme_class
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "bp5-navbar-group bp5-align-left",
    ref: lg_ref
  }, /*#__PURE__*/_react.default.createElement(_core.NavbarHeading, {
    className: "d-flex align-items-center"
  }, /*#__PURE__*/_react.default.createElement("img", {
    className: "mr-2",
    src: window.tactic_img_url,
    alt: "",
    width: "32 ",
    height: "32"
  }), name_string), props.menus != null && /*#__PURE__*/_react.default.createElement(_react.Fragment, null, props.menus)), /*#__PURE__*/_react.default.createElement(_core.NavbarGroup, {
    align: _core.Alignment.RIGHT,
    style: right_style
  }, /*#__PURE__*/_react.default.createElement(_core.NavbarDivider, null), /*#__PURE__*/_react.default.createElement(_core.OverflowList, {
    items: right_nav_items,
    overflowRenderer: _overflowRenderer,
    visibleItemRenderer: renderNav,
    onOverflow: _onOverflow
  }), /*#__PURE__*/_react.default.createElement(_core.NavbarDivider, null), /*#__PURE__*/_react.default.createElement(_core.Switch, {
    checked: theme.dark_theme,
    onChange: _setTheme,
    large: false,
    style: {
      marginBottom: 0
    },
    innerLabel: "Light",
    innerLabelChecked: "Dark",
    alignIndicator: "center"
  })));
}
exports.TacticNavbar = TacticNavbar = /*#__PURE__*/(0, _react.memo)(TacticNavbar);
TacticNavbar.propTypes = {
  is_authenticated: _propTypes.default.bool,
  user_name: _propTypes.default.string,
  menus: _propTypes.default.object,
  selected: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
  page_id: _propTypes.default.string,
  extra_text: _propTypes.default.string,
  setTheme: _propTypes.default.func,
  show_api_links: _propTypes.default.bool
};
TacticNavbar.defaultProps = {
  extra_text: null,
  refreshTab: null,
  closeTab: null,
  menus: null,
  selected: null,
  show_api_links: false,
  setTheme: null
};
function render_navbar() {
  let selected = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  let show_api_links = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  let dark_theme = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  let domContainer = document.querySelector('#navbar-root');
  ReactDOM.render( /*#__PURE__*/_react.default.createElement(TacticNavbar, {
    is_authenticated: window.is_authenticated,
    selected: selected,
    show_api_links: show_api_links,
    user_name: window.username
  }), domContainer);
}
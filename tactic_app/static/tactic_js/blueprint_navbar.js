"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
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
var context_url = $SCRIPT_ROOT + '/context';
var library_url = $SCRIPT_ROOT + '/library';
var repository_url = $SCRIPT_ROOT + '/repository';
var account_url = $SCRIPT_ROOT + '/account_info';
var login_url = $SCRIPT_ROOT + "/login";
var padding = 10;
function get_theme_cookie() {
  var cookie_str = document.cookie.split('; ').find(function (row) {
    return row.startsWith('tactic_theme');
  });
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
  var _useState = (0, _react.useState)(function () {
      return window.innerWidth - padding * 2;
    }),
    _useState2 = _slicedToArray(_useState, 2),
    usable_width = _useState2[0],
    set_usable_width = _useState2[1];
  var _useState3 = (0, _react.useState)(null),
    _useState4 = _slicedToArray(_useState3, 2),
    old_left_width = _useState4[0],
    set_old_left_width = _useState4[1];
  var lg_ref = (0, _react.useRef)(null);
  var overflow_items = [];
  function _update_window_dimensions() {
    set_usable_width(window.innerWidth - 2 * padding);
  }

  // For some reason sizing things are a little flaky without old_left_width stuff
  (0, _react.useEffect)(function () {
    window.addEventListener("resize", _update_window_dimensions);
    _update_window_dimensions();
    if (!old_left_width) {
      set_old_left_width(_getLeftWidth());
    } else {
      var new_left_width = _getLeftWidth();
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
    if (window.user_id == undefined) {
      var theme = event.target.checked ? "dark" : "light";
      set_theme_cookie(theme);
    } else {
      var result_dict = {
        "user_id": window.user_id,
        "theme": event.target.checked ? "dark" : "light"
      };
      (0, _communication_react.postWithCallback)("host", "set_user_theme", result_dict, null, null);
    }
    if (props.setTheme) {
      props.setTheme(event.target.checked);
    }
  }
  function renderNav(item) {
    return /*#__PURE__*/_react["default"].createElement(_core.Button, {
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
    var lg_width = _getLeftWidth();
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
      onClick: function onClick() {
        window.open(context_url);
      }
    }, {
      icon: "add",
      text: "Tabbed",
      intent: getIntent("library"),
      onClick: function onClick() {
        window.open(library_url);
      }
    }, {
      icon: "database",
      text: "Repository",
      intent: getIntent("repository"),
      onClick: function onClick() {
        window.open(repository_url);
      }
    }, {
      icon: "person",
      text: props.user_name,
      intent: getIntent("account"),
      onClick: function onClick() {
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
      onClick: function onClick() {
        window.open(login_url);
      }
    }];
  }
  function _overflowRenderer() {
    var opt_dict = {};
    var icon_dict = {};
    var _iterator = _createForOfIteratorHelper(overflow_items),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var item = _step.value;
        opt_dict[item.text] = item.onClick;
        icon_dict[item.text] = item.icon;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return /*#__PURE__*/_react["default"].createElement(_main_menus_react.MenuComponent, {
      alt_button: function alt_button() {
        return /*#__PURE__*/_react["default"].createElement("span", {
          className: "bp4-breadcrumbs-collapsed",
          style: {
            marginTop: 5
          }
        });
      },
      option_dict: opt_dict,
      binding_dict: {},
      icon_dict: icon_dict
    });
  }
  var nav_class = props.menus == null ? "justify-content-end" : "justify-content-between";
  var right_nav_items = [];
  if (props.show_api_links) {
    right_nav_items = [{
      icon: "code-block",
      text: "Api",
      intent: null,
      onClick: function onClick() {
        window.open("https://tactic.readthedocs.io/en/latest/Tile-Commands.html");
      }
    }, {
      icon: "code-block",
      text: "ObjApi",
      intent: null,
      onClick: function onClick() {
        window.open("https://tactic.readthedocs.io/en/latest/Object-Oriented-API.html");
      }
    }];
  }
  right_nav_items.push({
    icon: "manual",
    text: "Docs",
    intent: null,
    onClick: function onClick() {
      window.open("http://tactic.readthedocs.io/en/latest/index.html");
    }
  });
  if (props.is_authenticated) {
    right_nav_items = right_nav_items.concat(_authenticatedItems());
  } else {
    right_nav_items = right_nav_items.concat(_notAuthenticatedItems());
  }
  var right_width = _getRightWidth();
  var right_style = {
    width: right_width
  };
  right_style.justifyContent = "flex-end";
  var theme_class = props.dark_theme ? "bp4-dark" : "light-theme";
  var name_string = "Tactic";
  if (props.extra_text != null) {
    name_string += " " + props.extra_text;
  }
  return /*#__PURE__*/_react["default"].createElement(_core.Navbar, {
    style: {
      paddingLeft: 10
    },
    className: theme_class
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "bp4-navbar-group bp4-align-left",
    ref: lg_ref
  }, /*#__PURE__*/_react["default"].createElement(_core.NavbarHeading, {
    className: "d-flex align-items-center"
  }, /*#__PURE__*/_react["default"].createElement("img", {
    className: "mr-2",
    src: window.tactic_img_url,
    alt: "",
    width: "32 ",
    height: "32"
  }), name_string), props.menus != null && /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, props.menus)), /*#__PURE__*/_react["default"].createElement(_core.NavbarGroup, {
    align: _core.Alignment.RIGHT,
    style: right_style
  }, /*#__PURE__*/_react["default"].createElement(_core.NavbarDivider, null), /*#__PURE__*/_react["default"].createElement(_core.OverflowList, {
    items: right_nav_items,
    overflowRenderer: _overflowRenderer,
    visibleItemRenderer: renderNav,
    onOverflow: _onOverflow
  }), /*#__PURE__*/_react["default"].createElement(_core.NavbarDivider, null), /*#__PURE__*/_react["default"].createElement(_core.Switch, {
    checked: props.dark_theme,
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
  is_authenticated: _propTypes["default"].bool,
  user_name: _propTypes["default"].string,
  menus: _propTypes["default"].object,
  selected: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
  page_id: _propTypes["default"].string,
  extra_text: _propTypes["default"].string,
  dark_theme: _propTypes["default"].bool,
  setTheme: _propTypes["default"].func,
  show_api_links: _propTypes["default"].bool
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
  var selected = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var show_api_links = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var dark_theme = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var domContainer = document.querySelector('#navbar-root');
  ReactDOM.render( /*#__PURE__*/_react["default"].createElement(TacticNavbar, {
    is_authenticated: window.is_authenticated,
    selected: selected,
    show_api_links: show_api_links,
    dark_theme: dark_theme,
    user_name: window.username
  }), domContainer);
}
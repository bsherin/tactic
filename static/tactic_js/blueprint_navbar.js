"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TacticNavbar = TacticNavbar;
exports.render_navbar = render_navbar;
var _react = _interopRequireWildcard(require("react"));
var _client = require("react-dom/client");
var _core = require("@blueprintjs/core");
var _main_menus_react = require("./main_menus_react.js");
var _settings = require("./settings");
var _excluded = ["extra_text", "menus", "selected", "show_api_links"];
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
var context_url = $SCRIPT_ROOT + '/context';
var library_url = $SCRIPT_ROOT + '/library';
var repository_url = $SCRIPT_ROOT + '/repository';
var account_url = $SCRIPT_ROOT + '/account_info';
var login_url = $SCRIPT_ROOT + "/login";
var padding = 10;
function TacticNavbar(_ref) {
  var _ref$extra_text = _ref.extra_text,
    extra_text = _ref$extra_text === void 0 ? null : _ref$extra_text,
    _ref$menus = _ref.menus,
    menus = _ref$menus === void 0 ? null : _ref$menus,
    _ref$selected = _ref.selected,
    selected = _ref$selected === void 0 ? null : _ref$selected,
    _ref$show_api_links = _ref.show_api_links,
    show_api_links = _ref$show_api_links === void 0 ? false : _ref$show_api_links,
    props = _objectWithoutProperties(_ref, _excluded);
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
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
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
    return function () {
      window.removeEventListener("resize", _update_window_dimensions);
    };
  });
  function getIntent(butname) {
    return selected == butname ? "primary" : null;
  }
  function _onOverflow(items) {
    overflow_items = items;
  }
  function _handle_signout() {
    window.open($SCRIPT_ROOT + "/logout/" + props.page_id, "_self");
    return false;
  }

  // function _setTheme(event) {
  //     let dtheme = event.target.checked ? "dark" : "light";
  //     set_theme_cookie(dtheme);
  //     if (window.user_id != undefined) {
  //         const result_dict = {
  //             "user_id": window.user_id,
  //             "theme": dtheme,
  //         };
  //         postWithCallback("host", "set_user_theme", result_dict,
  //             null, null);
  //     }
  //     theme.setTheme(event.target.checked)
  // }

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
          className: "bp5-breadcrumbs-collapsed",
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
  var nav_class = menus == null ? "justify-content-end" : "justify-content-between";
  var right_nav_items = [];
  if (show_api_links) {
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
  var theme_class = settingsContext.isDark() ? "bp5-dark" : "light-theme";
  var name_string = "Tactic";
  if (extra_text != null) {
    name_string += " " + extra_text;
  }
  return /*#__PURE__*/_react["default"].createElement(_core.Navbar, {
    style: {
      paddingLeft: 10
    },
    className: theme_class
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "bp5-navbar-group bp5-align-left",
    ref: lg_ref
  }, /*#__PURE__*/_react["default"].createElement(_core.NavbarHeading, {
    className: "d-flex align-items-center"
  }, /*#__PURE__*/_react["default"].createElement("img", {
    className: "mr-2",
    src: window.tactic_img_url,
    alt: "",
    width: "32 ",
    height: "32"
  }), name_string), menus != null && /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, menus)), /*#__PURE__*/_react["default"].createElement(_core.NavbarGroup, {
    align: _core.Alignment.RIGHT,
    style: right_style
  }, /*#__PURE__*/_react["default"].createElement(_core.NavbarDivider, null), /*#__PURE__*/_react["default"].createElement(_core.OverflowList, {
    items: right_nav_items,
    overflowRenderer: _overflowRenderer,
    visibleItemRenderer: renderNav,
    onOverflow: _onOverflow
  })));
}
exports.TacticNavbar = TacticNavbar = /*#__PURE__*/(0, _react.memo)(TacticNavbar);
function render_navbar() {
  var selected = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var show_api_links = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var dark_theme = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var domContainer = document.querySelector('#navbar-root');
  var root = (0, _client.createRoot)(domContainer);
  root.render(/*#__PURE__*/_react["default"].createElement(TacticNavbar, {
    is_authenticated: window.is_authenticated,
    selected: selected,
    show_api_links: show_api_links,
    user_name: window.username
  }));
}
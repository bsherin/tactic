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
var _utilities_react = require("./utilities_react");
var _excluded = ["extra_text", "menus", "selected", "show_api_links"];
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
var context_url = $SCRIPT_ROOT + '/context';
var library_url = $SCRIPT_ROOT + '/library';
var repository_url = $SCRIPT_ROOT + '/repository';
var account_url = $SCRIPT_ROOT + '/account_info';
var login_url = $SCRIPT_ROOT + "/login";
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
  var lg_ref = (0, _react.useRef)(null);
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  var overflow_items = [];
  function getIntent(butname) {
    return selected == butname ? "primary" : null;
  }
  function _onOverflow(items) {
    overflow_items = items;
  }
  function _handle_signout() {
    window.open($SCRIPT_ROOT + "/logout/" + window.global_id, "_self");
    return false;
  }
  function renderNav(item) {
    return /*#__PURE__*/_react["default"].createElement(_core.Button, {
      icon: item.icon,
      key: item.text,
      variant: "minimal",
      style: {
        minWidth: "fit-content"
      },
      text: item.text,
      intent: item.intent,
      onClick: item.onClick
    });
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
          className: "bp6-breadcrumbs-collapsed",
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
  var theme_class = settingsContext.isDark() ? "bp6-dark" : "light-theme";
  var name_string = "Tactic";
  if (extra_text != null) {
    name_string += " " + extra_text;
  }
  return /*#__PURE__*/_react["default"].createElement(_core.Navbar, {
    style: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      paddingLeft: 10
    },
    className: theme_class
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "bp6-navbar-group bp6-align-left",
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
    style: {
      justifyContent: "flex-end",
      flex: "1 1 0",
      overflow: "hidden"
    }
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
  var domContainer = document.querySelector('#navbar-root');
  var root = (0, _client.createRoot)(domContainer);
  root.render(/*#__PURE__*/_react["default"].createElement(TacticNavbar, {
    is_authenticated: window.is_authenticated,
    selected: selected,
    show_api_links: show_api_links,
    user_name: window.username
  }));
}
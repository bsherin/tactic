"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render_navbar = render_navbar;
exports.get_theme_cookie = get_theme_cookie;
exports.set_theme_cookie = set_theme_cookie;
exports.TacticNavbar = void 0;

var _react = _interopRequireDefault(require("react"));

var ReactDOM = _interopRequireWildcard(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _core = require("@blueprintjs/core");

var _main_menus_react = require("./main_menus_react.js");

var _utilities_react = require("./utilities_react.js");

var _communication_react = require("./communication_react");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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

var TacticNavbar = /*#__PURE__*/function (_React$Component) {
  _inherits(TacticNavbar, _React$Component);

  var _super = _createSuper(TacticNavbar);

  function TacticNavbar(props) {
    var _this;

    _classCallCheck(this, TacticNavbar);

    _this = _super.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this));
    _this.lg_ref = /*#__PURE__*/_react["default"].createRef();
    _this.state = {
      usable_width: window.innerWidth - padding * 2,
      old_left_width: 0
    };
    _this.overflow_items = [];
    _this.update_state_vars = ["usable_width", "old_left_width"];
    _this.update_props = ["is_authenticated", "user_name", "menus", "selected", "show_api_links", "dark_theme"];
    return _this;
  }

  _createClass(TacticNavbar, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      var _iterator = _createForOfIteratorHelper(this.update_props),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var prop = _step.value;

          if (nextProps[prop] != this.props[prop]) {
            return true;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      var _iterator2 = _createForOfIteratorHelper(this.update_state_vars),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var state = _step2.value;

          if (nextState[state] != this.state[state]) {
            return true;
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return false;
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      window.addEventListener("resize", this._update_window_dimensions);

      this._update_window_dimensions();

      this.setState({
        old_left_width: this._getLeftWidth()
      });
      this.last_theme = this.props.dark_theme;
    } // For some reason sizing things are a little flaky without old_left_width stuff

  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var new_left_width = this._getLeftWidth();

      if (new_left_width != this.state.old_left_width) {
        this.setState({
          old_left_width: new_left_width
        });
      }
    }
  }, {
    key: "_update_window_dimensions",
    value: function _update_window_dimensions() {
      this.setState({
        "usable_width": window.innerWidth - 2 * padding
      });
    }
  }, {
    key: "_handle_signout",
    value: function _handle_signout() {
      window.open($SCRIPT_ROOT + "/logout/" + this.props.page_id, "_self");
      return false;
    }
  }, {
    key: "_toggleTheme",
    value: function _toggleTheme() {
      var result_dict = {
        "user_id": window.user_id,
        "theme": !this.props.dark_theme ? "dark" : "light"
      };
      (0, _communication_react.postWithCallback)("host", "set_user_theme", result_dict, null, null);

      if (this.props.setTheme) {
        this.props.setTheme(!this.props.dark_theme);
      }
    }
  }, {
    key: "_setTheme",
    value: function _setTheme(event) {
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

      if (this.props.setTheme) {
        this.props.setTheme(event.target.checked);
      }
    }
  }, {
    key: "getIntent",
    value: function getIntent(butname) {
      return this.props.selected == butname ? "primary" : null;
    }
  }, {
    key: "renderNav",
    value: function renderNav(item) {
      return /*#__PURE__*/_react["default"].createElement(_core.Button, {
        icon: item.icon,
        key: item.text,
        minimal: true,
        text: item.text,
        intent: item.intent,
        onClick: item.onClick
      });
    }
  }, {
    key: "_getLeftWidth",
    value: function _getLeftWidth() {
      if (this.lg_ref && this.lg_ref.current) {
        return this.lg_ref.current.getBoundingClientRect().width;
      }

      return null;
    }
  }, {
    key: "_getRightWidth",
    value: function _getRightWidth() {
      var lg_width = this._getLeftWidth();

      if (lg_width) {
        return this.state.usable_width - lg_width - 35;
      } else {
        return .25 * this.state.usable_width - 35;
      }
    }
  }, {
    key: "_authenticatedItems",
    value: function _authenticatedItems() {
      return [{
        icon: "add",
        text: "Context",
        intent: this.getIntent("library"),
        onClick: function onClick() {
          window.open(context_url);
        }
      }, {
        icon: "add",
        text: "Tabbed",
        intent: this.getIntent("library"),
        onClick: function onClick() {
          window.open(library_url);
        }
      }, {
        icon: "database",
        text: "Repository",
        intent: this.getIntent("repository"),
        onClick: function onClick() {
          window.open(repository_url);
        }
      }, {
        icon: "person",
        text: this.props.user_name,
        intent: this.getIntent("account"),
        onClick: function onClick() {
          window.open(account_url);
        }
      }, {
        icon: "log-out",
        text: "Logout",
        intent: this.getIntent("logout"),
        onClick: this._handle_signout
      }];
    }
  }, {
    key: "_notAuthenticatedItems",
    value: function _notAuthenticatedItems() {
      return [{
        icon: "log-in",
        text: "Login",
        intent: this.getIntent("login"),
        onClick: function onClick() {
          window.open(login_url);
        }
      }];
    }
  }, {
    key: "_onOverflow",
    value: function _onOverflow(items) {
      this.overflow_items = items;
    }
  }, {
    key: "_overflowRenderer",
    value: function _overflowRenderer() {
      var opt_dict = {};
      var icon_dict = {};

      var _iterator3 = _createForOfIteratorHelper(this.overflow_items),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var item = _step3.value;
          opt_dict[item.text] = item.onClick;
          icon_dict[item.text] = item.icon;
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      return /*#__PURE__*/_react["default"].createElement(_main_menus_react.MenuComponent, {
        alt_button: function alt_button() {
          return /*#__PURE__*/_react["default"].createElement("span", {
            className: "bp3-breadcrumbs-collapsed",
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
  }, {
    key: "render",
    value: function render() {
      var nav_class = this.props.menus == null ? "justify-content-end" : "justify-content-between";
      var right_nav_items = [];

      if (this.props.show_api_links) {
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

      if (this.props.is_authenticated) {
        right_nav_items = right_nav_items.concat(this._authenticatedItems());
      } else {
        right_nav_items = right_nav_items.concat(this._notAuthenticatedItems());
      }

      var right_width = this._getRightWidth();

      var right_style = {
        width: right_width
      };
      right_style.justifyContent = "flex-end";
      var theme_class = this.props.dark_theme ? "bp3-dark" : "light-theme";
      return /*#__PURE__*/_react["default"].createElement(_core.Navbar, {
        style: {
          paddingLeft: 10
        },
        className: theme_class
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "bp3-navbar-group bp3-align-left",
        ref: this.lg_ref
      }, /*#__PURE__*/_react["default"].createElement(_core.Navbar.Heading, {
        className: "d-flex align-items-center"
      }, /*#__PURE__*/_react["default"].createElement("img", {
        className: "mr-2",
        src: window.tactic_img_url,
        alt: "",
        width: "32 ",
        height: "32"
      }), "Tactic"), this.props.menus != null && /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, this.props.menus)), /*#__PURE__*/_react["default"].createElement(_core.Navbar.Group, {
        align: _core.Alignment.RIGHT,
        style: right_style
      }, /*#__PURE__*/_react["default"].createElement(_core.NavbarDivider, null), /*#__PURE__*/_react["default"].createElement(_core.OverflowList, {
        items: right_nav_items,
        overflowRenderer: this._overflowRenderer,
        visibleItemRenderer: this.renderNav,
        onOverflow: this._onOverflow
      }), /*#__PURE__*/_react["default"].createElement(_core.NavbarDivider, null), /*#__PURE__*/_react["default"].createElement(_core.Switch, {
        checked: this.props.dark_theme,
        onChange: this._setTheme,
        large: false,
        style: {
          marginBottom: 0
        },
        innerLabel: "Light",
        innerLabelChecked: "Dark",
        alignIndicator: "center"
      })));
    }
  }]);

  return TacticNavbar;
}(_react["default"].Component);

exports.TacticNavbar = TacticNavbar;
TacticNavbar.propTypes = {
  refreshTab: _propTypes["default"].func,
  closeTab: _propTypes["default"].func,
  is_authenticated: _propTypes["default"].bool,
  user_name: _propTypes["default"].string,
  menus: _propTypes["default"].object,
  selected: _propTypes["default"].string,
  page_id: _propTypes["default"].string
};
TacticNavbar.defaultProps = {
  refreshTab: null,
  closeTab: null,
  menus: null,
  selected: null,
  show_api_links: false
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
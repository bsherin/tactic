"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TacticOmnibar = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _select = require("@blueprintjs/select");
var _core = require("@blueprintjs/core");
var _utilities_react = require("./utilities_react");
var _communication_react = require("./communication_react");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
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
var context_url = $SCRIPT_ROOT + '/context';
var library_url = $SCRIPT_ROOT + '/library';
var repository_url = $SCRIPT_ROOT + '/repository';
var account_url = $SCRIPT_ROOT + '/account_info';
var login_url = $SCRIPT_ROOT + "/login";
var TacticOmnibarItem = /*#__PURE__*/function (_React$Component) {
  _inherits(TacticOmnibarItem, _React$Component);
  var _super = _createSuper(TacticOmnibarItem);
  function TacticOmnibarItem(props) {
    var _this;
    _classCallCheck(this, TacticOmnibarItem);
    _this = _super.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this));
    return _this;
  }
  _createClass(TacticOmnibarItem, [{
    key: "_handleClick",
    value: function _handleClick() {
      this.props.handleClick(this.props.item);
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: this.props.item.icon_name,
        active: this.props.modifiers.active,
        text: this.props.item.display_text,
        label: this.props.item.category,
        key: this.props.item.search_text,
        onClick: this._handleClick,
        shouldDismissPopover: true
      });
    }
  }]);
  return TacticOmnibarItem;
}(_react["default"].Component);
TacticOmnibarItem.propTypes = {
  item: _propTypes["default"].object,
  modifiers: _propTypes["default"].object,
  handleClick: _propTypes["default"].func
};
var TacticOmnibar = /*#__PURE__*/function (_React$Component2) {
  _inherits(TacticOmnibar, _React$Component2);
  var _super2 = _createSuper(TacticOmnibar);
  function TacticOmnibar(props) {
    var _this2;
    _classCallCheck(this, TacticOmnibar);
    _this2 = _super2.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this2));
    return _this2;
  }
  _createClass(TacticOmnibar, [{
    key: "_onItemSelect",
    value: function _onItemSelect(item) {
      item.the_function();
      this.props.closeOmnibar();
    }
  }, {
    key: "_globalOmniItems",
    value: function _globalOmniItems() {
      function wopenfunc(the_url) {
        return function () {
          window.open(the_url);
        };
      }
      var omni_funcs = [["Toggle Theme", "account", this._toggleTheme, "contrast"], ["Docs", "documentation", wopenfunc("https://tactic.readthedocs.io/en/latest/Object-Oriented-API.html"), "log-out"], ["Tile Commands", "documentation", wopenfunc("https://tactic.readthedocs.io/en/latest/Tile-Commands.html"), "code-block"], ["Object Api", "documentation", wopenfunc("https://tactic.readthedocs.io/en/latest/Object-Oriented-API.html"), "code-block"]];
      if (this.props.is_authenticated) {
        var new_funcs = [["New Context Tab", "window", wopenfunc(context_url), "add"], ["New Tabbed Window", "window", wopenfunc(library_url), "add"], ["Show Repository", "window", wopenfunc(repository_url), "database"], ["Show Account Info", "account", wopenfunc(account_url), "person"], ["Logout", "account", this._handle_signout, "log-out"]];
        omni_funcs = omni_funcs.concat(new_funcs);
      }
      var omni_items = [];
      var _iterator = _createForOfIteratorHelper(omni_funcs),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var item = _step.value;
          omni_items.push({
            category: item[1],
            display_text: item[0],
            search_text: item[0],
            icon_name: item[3],
            the_function: item[2]
          });
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return omni_items;
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
    key: "render",
    value: function render() {
      var the_items = [];
      if (this.props.showOmnibar) {
        var _iterator2 = _createForOfIteratorHelper(this.props.omniGetters),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var ogetter = _step2.value;
            the_items = the_items.concat(ogetter());
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
        the_items = the_items.concat(this._globalOmniItems());
      }
      return /*#__PURE__*/_react["default"].createElement(_select.Omnibar, {
        items: the_items,
        className: window.dark_theme ? "bp5-dark" : "",
        isOpen: this.props.showOmnibar,
        onItemSelect: this._onItemSelect,
        itemRenderer: TacticOmnibar._itemRenderer,
        itemPredicate: TacticOmnibar._itemPredicate,
        resetOnSelect: true,
        onClose: this.props.closeOmnibar
      });
    }
  }], [{
    key: "_itemRenderer",
    value: function _itemRenderer(item, _ref) {
      var modifiers = _ref.modifiers,
        handleClick = _ref.handleClick;
      return /*#__PURE__*/_react["default"].createElement(TacticOmnibarItem, {
        modifiers: modifiers,
        item: item,
        handleClick: handleClick
      });
    }
  }, {
    key: "_itemPredicate",
    value: function _itemPredicate(query, item) {
      if (query.length == 0) {
        return false;
      }
      var lquery = query.toLowerCase();
      var re = new RegExp(query);
      return re.test(item.search_text.toLowerCase()) || re.test(item.category.toLowerCase());
    }
  }]);
  return TacticOmnibar;
}(_react["default"].Component);
exports.TacticOmnibar = TacticOmnibar;
TacticOmnibar.propTypes = {
  omniGetters: _propTypes["default"].array,
  showOmniBar: _propTypes["default"].bool,
  closeOmniBar: _propTypes["default"].func,
  dark_theme: _propTypes["default"].bool
};
TacticOmnibar.defaultProps = {
  dark_theme: false,
  showOmnibar: false,
  omniGetters: null
};
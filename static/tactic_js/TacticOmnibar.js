"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OpenOmnibar = OpenOmnibar;
var _react = _interopRequireWildcard(require("react"));
var _select = require("@blueprintjs/select");
var _core = require("@blueprintjs/core");
var _communication_react = require("./communication_react");
var _settings = require("./settings");
var _utilities_react = require("./utilities_react");
var _assistant = require("./assistant");
var _error_drawer = require("./error_drawer");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t2 in e) "default" !== _t2 && {}.hasOwnProperty.call(e, _t2) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t2)) && (i.get || i.set) ? o(f, _t2, i) : f[_t2] = e[_t2]); return f; })(e, t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var context_url = $SCRIPT_ROOT + '/context';
var library_url = $SCRIPT_ROOT + '/library';
var repository_url = $SCRIPT_ROOT + '/repository';
var account_url = $SCRIPT_ROOT + '/account_info';
var login_url = $SCRIPT_ROOT + "/login";
var icon_dict = {
  collection: "database",
  project: "projects",
  tile: "application",
  list: "list",
  code: "code"
};
function OpenOmnibarItem(props) {
  function _handleClick() {
    props.handleClick(props.item);
    return null;
  }
  return /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
    icon: icon_dict[props.item.res_type],
    active: props.modifiers.active,
    text: props.item.name,
    label: props.item.res_type,
    key: props.item.search_text,
    onClick: _handleClick,
    shouldDismissPopover: true
  });
}
var resources_to_grab = 20;
function OpenOmnibar(props) {
  // const [commandItems, setCommandItems] = useState([]);
  var _useState = (0, _react.useState)([]),
    _useState2 = _slicedToArray(_useState, 2),
    item_list = _useState2[0],
    set_item_list = _useState2[1];
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  var old_search_string = (0, _react.useRef)("");
  var selectedPane = (0, _react.useContext)(_utilities_react.SelectedPaneContext);
  var assistantDrawerFuncs = (0, _react.useContext)(_assistant.AssistantContext);
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  (0, _react.useEffect)(function () {
    set_item_list([]);
  }, [selectedPane.tab_id]);
  var grabChunk = (0, _react.useCallback)(/*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(search_string) {
      var search_spec, data, result_data, fItems, gItems, rItems, _i, _rItems, the_item, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            search_spec = {
              active_tag: null,
              search_string: search_string,
              search_inside: false,
              search_metadata: false,
              show_hidden: false,
              sort_field: "updated",
              sort_direction: "descending"
            };
            data = {
              pane_type: "all",
              search_spec: search_spec,
              row_number: 0,
              number_to_get: 20,
              is_repository: false
            };
            _context.p = 1;
            _context.n = 2;
            return (0, _communication_react.postAjaxPromise)("grab_all_list_chunk", data);
          case 2:
            result_data = _context.v;
            fItems = props.commandItems.filter(function (item) {
              return commandItemPredicate(search_string, item);
            });
            gItems = _globalOmniItems().filter(function (item) {
              return commandItemPredicate(search_string, item);
            });
            fItems = fItems.concat(gItems);
            rItems = Object.values(result_data.chunk_dict);
            for (_i = 0, _rItems = rItems; _i < _rItems.length; _i++) {
              the_item = _rItems[_i];
              the_item.item_type = "resource";
            }
            fItems = fItems.concat(rItems);
            set_item_list(fItems);
            _context.n = 4;
            break;
          case 3:
            _context.p = 3;
            _t = _context.v;
            errorDrawerFuncs.addFromError("Error grabbing resource chunk", _t);
          case 4:
            return _context.a(2);
        }
      }, _callee, null, [[1, 3]]);
    }));
    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
  var _useDebounce = (0, _utilities_react.useDebounce)(grabChunk),
    _useDebounce2 = _slicedToArray(_useDebounce, 2),
    waiting = _useDebounce2[0],
    doUpdate = _useDebounce2[1];
  function commandItemPredicate(query, item) {
    if (query.length == 0) {
      return false;
    }
    var lquery = query.toLowerCase();
    var re = new RegExp(lquery);
    return re.test(item.search_text.toLowerCase());
  }
  function openItemListPredicate(search_string, items) {
    if (!props.showOmnibar) return [];
    if (search_string == "" && !waiting.current) {
      old_search_string.current = "";
      return [];
    }
    if (search_string == old_search_string.current) {
      return items;
    }
    old_search_string.current = search_string;
    doUpdate(search_string);
    return item_list;
  }
  function openItemRenderer(item, _ref2) {
    var modifiers = _ref2.modifiers,
      handleClick = _ref2.handleClick;
    if (item.item_type == "command") {
      return /*#__PURE__*/_react["default"].createElement(TacticOmnibarItem, {
        key: item.search_text,
        modifiers: modifiers,
        item: item,
        handleClick: handleClick
      });
    }
    return /*#__PURE__*/_react["default"].createElement(OpenOmnibarItem, {
      key: item.search_text,
      modifiers: modifiers,
      item: item,
      handleClick: handleClick
    });
  }
  function _onItemSelect(item) {
    if (item.item_type == "command") {
      item.the_function();
    } else {
      props.openFunc(item);
    }
    props.closeOmnibar();
  }
  function renderQueryList(listProps) {
    var handleKeyDown = listProps.handleKeyDown,
      handleKeyUp = listProps.handleKeyUp;
    var handlers = props.showOmnibar ? {
      onKeyDown: handleKeyDown,
      onKeyUp: handleKeyUp
    } : {};
    return /*#__PURE__*/_react["default"].createElement(_core.Overlay, {
      hasBackdrop: true,
      isOpen: props.showOmnibar,
      className: _select.Classes.OMNIBAR_OVERLAY,
      onClose: props.closeOmnibar
    }, /*#__PURE__*/_react["default"].createElement("div", _extends({
      className: "".concat(_select.Classes.OMNIBAR, " ").concat(listProps.className)
    }, handlers), /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
      autoFocus: true,
      size: "large",
      leftIcon: "cube",
      placeholder: "Search resources...",
      onChange: listProps.handleQueryChange,
      value: listProps.query
    }), listProps.itemList));
  }
  function _handle_signout() {
    window.open($SCRIPT_ROOT + "/logout/" + props.page_id, "_self");
    return false;
  }
  function _showSettings() {
    settingsContext.setShowSettingsDrawer(true);
  }
  function _globalOmniItems() {
    function wopenfunc(the_url) {
      return function () {
        window.open(the_url);
      };
    }
    var omni_funcs = [["Toggle Theme", "account", _toggleTheme, "contrast"], ["Settings", "account", _showSettings, "cog"], ["Errors", "account", errorDrawerFuncs.openErrorDrawer, "bug"], ["Docs", "documentation", wopenfunc("https://tactic.readthedocs.io/en/latest/Object-Oriented-API.html"), "log-out"], ["Tile Commands", "documentation", wopenfunc("https://tactic.readthedocs.io/en/latest/Tile-Commands.html"), "code-block"], ["Object Api", "documentation", wopenfunc("https://tactic.readthedocs.io/en/latest/Object-Oriented-API.html"), "code-block"]];
    if (props.is_authenticated) {
      var new_funcs = [["New Context Tab", "window", wopenfunc(context_url), "add"], ["New Tabbed Window", "window", wopenfunc(library_url), "add"], ["Show Repository", "window", wopenfunc(repository_url), "database"], ["Show Account Info", "account", wopenfunc(account_url), "person"], ["Logout", "account", _handle_signout, "log-out"]];
      omni_funcs = omni_funcs.concat(new_funcs);
      if (window.has_openapi_key) {
        omni_funcs.push(["Show Assistant", "blah", assistantDrawerFuncs.openAssistantDrawer, "chat"]);
      }
    }
    var omni_items = [];
    var _iterator = _createForOfIteratorHelper(omni_funcs),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var item = _step.value;
        omni_items.push({
          category: "Global",
          display_text: item[0],
          search_text: item[0],
          icon_name: item[3],
          the_function: item[2],
          item_type: "command"
        });
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return omni_items;
  }
  function _toggleTheme() {
    var new_theme = settingsContext.isDark() ? "light" : "dark";
    (0, _communication_react.postAjax)("update_settings", {
      theme: new_theme
    }, null);
  }
  return /*#__PURE__*/_react["default"].createElement(_select.QueryList, {
    items: item_list,
    className: settingsContext.isDark() ? "bp6-dark" : "",
    isOpen: props.showOmnibar,
    onItemSelect: _onItemSelect,
    itemRenderer: openItemRenderer,
    itemListPredicate: openItemListPredicate,
    resetOnSelect: true,
    resetOnQuery: false,
    renderer: renderQueryList,
    onClose: props.closeOmnibar
  });
}
exports.OpenOmnibar = OpenOmnibar = /*#__PURE__*/(0, _react.memo)(OpenOmnibar);
function TacticOmnibarItem(props) {
  function _handleClick() {
    props.handleClick(props.item);
  }
  return /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
    icon: props.item.icon_name,
    active: props.modifiers.active,
    text: props.item.display_text,
    label: props.item.category,
    key: props.item.search_text,
    onClick: _handleClick,
    shouldDismissPopover: true
  });
}
TacticOmnibarItem = /*#__PURE__*/(0, _react.memo)(TacticOmnibarItem);
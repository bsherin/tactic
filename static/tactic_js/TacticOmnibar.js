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
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return r; }; var t, r = {}, e = Object.prototype, n = e.hasOwnProperty, o = "function" == typeof Symbol ? Symbol : {}, i = o.iterator || "@@iterator", a = o.asyncIterator || "@@asyncIterator", u = o.toStringTag || "@@toStringTag"; function c(t, r, e, n) { return Object.defineProperty(t, r, { value: e, enumerable: !n, configurable: !n, writable: !n }); } try { c({}, ""); } catch (t) { c = function c(t, r, e) { return t[r] = e; }; } function h(r, e, n, o) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype); return c(a, "_invoke", function (r, e, n) { var o = 1; return function (i, a) { if (3 === o) throw Error("Generator is already running"); if (4 === o) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var u = n.delegate; if (u) { var c = d(u, n); if (c) { if (c === f) continue; return c; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (1 === o) throw o = 4, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = 3; var h = s(r, e, n); if ("normal" === h.type) { if (o = n.done ? 4 : 2, h.arg === f) continue; return { value: h.arg, done: n.done }; } "throw" === h.type && (o = 4, n.method = "throw", n.arg = h.arg); } }; }(r, n, new Context(o || [])), !0), a; } function s(t, r, e) { try { return { type: "normal", arg: t.call(r, e) }; } catch (t) { return { type: "throw", arg: t }; } } r.wrap = h; var f = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var l = {}; c(l, i, function () { return this; }); var p = Object.getPrototypeOf, y = p && p(p(x([]))); y && y !== e && n.call(y, i) && (l = y); var v = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(l); function g(t) { ["next", "throw", "return"].forEach(function (r) { c(t, r, function (t) { return this._invoke(r, t); }); }); } function AsyncIterator(t, r) { function e(o, i, a, u) { var c = s(t[o], t, i); if ("throw" !== c.type) { var h = c.arg, f = h.value; return f && "object" == _typeof(f) && n.call(f, "__await") ? r.resolve(f.__await).then(function (t) { e("next", t, a, u); }, function (t) { e("throw", t, a, u); }) : r.resolve(f).then(function (t) { h.value = t, a(h); }, function (t) { return e("throw", t, a, u); }); } u(c.arg); } var o; c(this, "_invoke", function (t, n) { function i() { return new r(function (r, o) { e(t, n, r, o); }); } return o = o ? o.then(i, i) : i(); }, !0); } function d(r, e) { var n = e.method, o = r.i[n]; if (o === t) return e.delegate = null, "throw" === n && r.i["return"] && (e.method = "return", e.arg = t, d(r, e), "throw" === e.method) || "return" !== n && (e.method = "throw", e.arg = new TypeError("The iterator does not provide a '" + n + "' method")), f; var i = s(o, r.i, e.arg); if ("throw" === i.type) return e.method = "throw", e.arg = i.arg, e.delegate = null, f; var a = i.arg; return a ? a.done ? (e[r.r] = a.value, e.next = r.n, "return" !== e.method && (e.method = "next", e.arg = t), e.delegate = null, f) : a : (e.method = "throw", e.arg = new TypeError("iterator result is not an object"), e.delegate = null, f); } function w(t) { this.tryEntries.push(t); } function m(r) { var e = r[4] || {}; e.type = "normal", e.arg = t, r[4] = e; } function Context(t) { this.tryEntries = [[-1]], t.forEach(w, this), this.reset(!0); } function x(r) { if (null != r) { var e = r[i]; if (e) return e.call(r); if ("function" == typeof r.next) return r; if (!isNaN(r.length)) { var o = -1, a = function e() { for (; ++o < r.length;) if (n.call(r, o)) return e.value = r[o], e.done = !1, e; return e.value = t, e.done = !0, e; }; return a.next = a; } } throw new TypeError(_typeof(r) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, c(v, "constructor", GeneratorFunctionPrototype), c(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = c(GeneratorFunctionPrototype, u, "GeneratorFunction"), r.isGeneratorFunction = function (t) { var r = "function" == typeof t && t.constructor; return !!r && (r === GeneratorFunction || "GeneratorFunction" === (r.displayName || r.name)); }, r.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, c(t, u, "GeneratorFunction")), t.prototype = Object.create(v), t; }, r.awrap = function (t) { return { __await: t }; }, g(AsyncIterator.prototype), c(AsyncIterator.prototype, a, function () { return this; }), r.AsyncIterator = AsyncIterator, r.async = function (t, e, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(h(t, e, n, o), i); return r.isGeneratorFunction(e) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, g(v), c(v, u, "Generator"), c(v, i, function () { return this; }), c(v, "toString", function () { return "[object Generator]"; }), r.keys = function (t) { var r = Object(t), e = []; for (var n in r) e.unshift(n); return function t() { for (; e.length;) if ((n = e.pop()) in r) return t.value = n, t.done = !1, t; return t.done = !0, t; }; }, r.values = x, Context.prototype = { constructor: Context, reset: function reset(r) { if (this.prev = this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(m), !r) for (var e in this) "t" === e.charAt(0) && n.call(this, e) && !isNaN(+e.slice(1)) && (this[e] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0][4]; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(r) { if (this.done) throw r; var e = this; function n(t) { a.type = "throw", a.arg = r, e.next = t; } for (var o = e.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i[4], u = this.prev, c = i[1], h = i[2]; if (-1 === i[0]) return n("end"), !1; if (!c && !h) throw Error("try statement without catch or finally"); if (null != i[0] && i[0] <= u) { if (u < c) return this.method = "next", this.arg = t, n(c), !0; if (u < h) return n(h), !1; } } }, abrupt: function abrupt(t, r) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var n = this.tryEntries[e]; if (n[0] > -1 && n[0] <= this.prev && this.prev < n[2]) { var o = n; break; } } o && ("break" === t || "continue" === t) && o[0] <= r && r <= o[2] && (o = null); var i = o ? o[4] : {}; return i.type = t, i.arg = r, o ? (this.method = "next", this.next = o[2], f) : this.complete(i); }, complete: function complete(t, r) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && r && (this.next = r), f; }, finish: function finish(t) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var e = this.tryEntries[r]; if (e[2] === t) return this.complete(e[4], e[3]), m(e), f; } }, "catch": function _catch(t) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var e = this.tryEntries[r]; if (e[0] === t) { var n = e[4]; if ("throw" === n.type) { var o = n.arg; m(e); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(r, e, n) { return this.delegate = { i: x(r), r: e, n: n }, "next" === this.method && (this.arg = t), f; } }, r; }
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
    var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(search_string) {
      var search_spec, data, result_data, fItems, gItems, rItems, _i, _rItems, the_item;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
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
            _context.prev = 2;
            _context.next = 5;
            return (0, _communication_react.postAjaxPromise)("grab_all_list_chunk", data);
          case 5:
            result_data = _context.sent;
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
            _context.next = 18;
            break;
          case 15:
            _context.prev = 15;
            _context.t0 = _context["catch"](2);
            errorDrawerFuncs.addFromError("Error grabbing resource chunk", _context.t0);
          case 18:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[2, 15]]);
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
      large: true,
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
    className: settingsContext.isDark() ? "bp5-dark" : "",
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
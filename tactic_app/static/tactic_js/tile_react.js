"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TileContainer = TileContainer;
exports.tilesReducer = tilesReducer;
var _react = _interopRequireWildcard(require("react"));
var _core = require("@blueprintjs/core");
var _reactTransitionGroup = require("react-transition-group");
var _lodash = _interopRequireDefault(require("lodash"));
var _tile_form_react = require("./tile_form_react");
var _blueprint_react_widgets = require("./blueprint_react_widgets");
var _resizing_layouts = require("./resizing_layouts2");
var _sortable_container = require("./sortable_container");
var _communication_react = require("./communication_react");
var _utilities_react = require("./utilities_react");
var _error_boundary = require("./error_boundary");
var _menu_utilities = require("./menu_utilities");
var _searchable_console = require("./searchable_console");
var _sizing_tools = require("./sizing_tools");
var _settings = require("./settings");
var _modal_react = require("./modal_react");
var _error_drawer = require("./error_drawer");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } // noinspection XmlDeprecatedElement
var using_touch = ("ontouchend" in document);
var click_event = using_touch ? "touchstart" : "click";
var TILE_DISPLAY_AREA_MARGIN = 15;
var ANI_DURATION = 300;
function composeObjs(base_style, new_style) {
  return Object.assign(Object.assign({}, base_style), new_style);
}
function tilesReducer(tile_list, action) {
  var new_items;
  switch (action.type) {
    case "initialize":
      new_items = action.new_items;
      break;
    case "delete_item":
      new_items = tile_list.filter(function (t) {
        return t.tile_id !== action.tile_id;
      });
      break;
    case "change_item_value":
      new_items = tile_list.map(function (t) {
        if (t.tile_id === action.tile_id) {
          var new_t = _objectSpread({}, t);
          new_t[action.field] = action.new_value;
          return new_t;
        } else {
          return t;
        }
      });
      break;
    case "change_item_state":
      new_items = tile_list.map(function (t) {
        if (t.tile_id === action.tile_id) {
          var new_t = _objectSpread({}, t);
          for (var field in action.new_state) {
            new_t[field] = action.new_state[field];
          }
          return new_t;
        } else {
          return t;
        }
      });
      break;
    case "change_items_value":
      new_items = tile_list.map(function (t) {
        if (action.id_list.includes(t.tile_id)) {
          var new_t = _objectSpread({}, t);
          new_t[action.field] = action.new_value;
          return new_t;
        } else {
          return t;
        }
      });
      break;
    case "update_items":
      new_items = tile_list.map(function (t) {
        if (t.unique_id in action.updates) {
          var update_dict = action.updates[t.unique_id];
          return _objectSpread(_objectSpread({}, t), update_dict);
        } else {
          return t;
        }
      });
      break;
    case "move_item":
      var old_list = _toConsumableArray(tile_list);
      new_items = (0, _utilities_react.arrayMove)(old_list, action.oldIndex, action.newIndex);
      break;
    case "add_at_index":
      new_items = _toConsumableArray(tile_list);
      new_items.splice(action.insert_index, 0, action.new_item);
      break;
    default:
      console.log("Got Unknown action: " + action.type);
      return _toConsumableArray(tile_list);
  }
  return new_items;
}
function TileContainer(props) {
  var tile_div_ref = (0, _react.useRef)(null);
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  var _useState = (0, _react.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    dragging = _useState2[0],
    setDragging = _useState2[1];
  var _useSize = (0, _sizing_tools.useSize)(tile_div_ref, 0, "TileContainer"),
    _useSize2 = _slicedToArray(_useSize, 4),
    usable_width = _useSize2[0],
    usable_height = _useSize2[1],
    topX = _useSize2[2],
    topY = _useSize2[3];
  (0, _react.useEffect)(function () {
    initSocket();
  }, []);
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  function _handleTileSourceChange(data) {
    _markSourceChange(data.tile_type);
  }
  function initSocket() {
    props.tsocket.attachListener("tile-message", _handleTileMessage);
    props.tsocket.attachListener('tile-source-change', _handleTileSourceChange);
  }
  function _resortTiles(_ref) {
    var destination = _ref.destination,
      source = _ref.source;
    props.tileDispatch({
      type: "move_item",
      oldIndex: source.index,
      newIndex: destination.index
    });
    setDragging(false);
    if (props.table_is_shrunk) {
      var elements = document.querySelectorAll('.tile-panel');
      elements.forEach(function (element) {
        element.classList.add('tile-panel-float');
      });
    }
  }
  function _markSourceChange(tile_type) {
    var change_list = [];
    var _iterator = _createForOfIteratorHelper(props.tile_list.current),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var entry = _step.value;
        if (entry.tile_type == tile_type) {
          change_list.push(entry.tile_id);
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    props.tileDispatch({
      type: "change_items_value",
      id_list: change_list,
      field: "source_changed",
      new_value: true
    });
  }
  function get_tile_entry(tile_id) {
    var tindex = tileIndex(tile_id);
    if (tindex == -1) return null;
    return _lodash["default"].cloneDeep(props.tile_list.current[tileIndex(tile_id)]);
  }
  function tileIndex(tile_id) {
    var counter = 0;
    var _iterator2 = _createForOfIteratorHelper(props.tile_list.current),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var entry = _step2.value;
        if (entry.tile_id == tile_id) {
          return counter;
        }
        ++counter;
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    return -1;
  }
  var _closeTile = (0, _react.useCallback)(function (tile_id) {
    props.tileDispatch({
      type: "delete_item",
      tile_id: tile_id
    });
    var data_dict = {
      main_id: props.main_id,
      tile_id: tile_id
    };
    (0, _communication_react.postWithCallback)(props.main_id, "RemoveTile", data_dict, null, null, props.main_id);
  }, []);
  var _setTileValue = (0, _react.useCallback)(function (tile_id, field, value) {
    var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    props.tileDispatch({
      type: "change_item_value",
      tile_id: tile_id,
      field: field,
      new_value: value
    });
    pushCallback(callback);
  }, []);
  var _setTileState = (0, _react.useCallback)(function (tile_id, new_state) {
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    props.tileDispatch({
      type: "change_item_state",
      tile_id: tile_id,
      new_state: new_state
    });
    pushCallback(callback);
  }, []);
  function _displayTileContentWithJavascript(tile_id, data) {
    _setTileState(tile_id, {
      front_content: data.html,
      javascript_code: data.javascript_code,
      javascript_arg_dict: data.arg_dict
    });
  }
  function _displayTileContent(tile_id, data) {
    _setTileState(tile_id, {
      front_content: data.html,
      javascript_code: null,
      javascript_arg_dict: null
    });
  }
  function _handleTileMessage(data) {
    var tile_id = data.tile_id;
    if (tileIndex(tile_id) != -1) {
      var handlerDict = {
        hideOptions: function hideOptions(tile_id, data) {
          return _setTileValue(tile_id, "show_form", false);
        },
        startSpinner: function startSpinner(tile_id, data) {
          return _setTileValue(tile_id, "show_spinner", true);
        },
        stopSpinner: function stopSpinner(tile_id, data) {
          return _setTileValue(tile_id, "show_spinner", false);
        },
        displayTileContent: _displayTileContent,
        displayFormContent: function displayFormContent(tile_id, data) {
          return _setTileValue(tile_id, "form_data", data.form_data);
        },
        displayTileContentWithJavascript: _displayTileContentWithJavascript
      };
      if (data.tile_message in handlerDict) {
        handlerDict[data.tile_message](tile_id, data);
      }
    }
  }
  function beforeCapture(_, event) {
    if (props.table_is_shrunk) {
      // Need to do this manually because of how react-dnd works
      var elements = document.querySelectorAll('.tile-panel.tile-panel-float');
      elements.forEach(function (element) {
        element.classList.remove('tile-panel-float');
      });
    }
    setDragging(true);
  }
  var outer_style = {
    height: usable_height
  };
  function makeTailoredTileComponent() {
    return /*#__PURE__*/(0, _react.memo)(function (tile_props) {
      return /*#__PURE__*/_react["default"].createElement(TileComponent, _extends({}, tile_props, {
        main_id: props.main_id,
        setTileValue: _setTileValue,
        setTileState: _setTileState,
        handleClose: _closeTile,
        goToModule: props.goToModule,
        broadcast_event: props.broadcast_event,
        tsocket: props.tsocket
      }));
    });
  }
  var TailoredTileComponent = (0, _react.useMemo)(function () {
    return makeTailoredTileComponent();
  }, []);
  return /*#__PURE__*/_react["default"].createElement("div", {
    ref: tile_div_ref
  }, /*#__PURE__*/_react["default"].createElement(_sortable_container.SortableComponent, {
    className: "tile-div",
    main_id: props.main_id,
    style: outer_style,
    helperClass: settingsContext.isDark() ? "bp5-dark" : "light-theme",
    ElementComponent: TailoredTileComponent,
    key_field_name: "tile_name",
    item_list: _lodash["default"].cloneDeep(props.tile_list.current),
    handle: ".tile-name-div",
    onSortStart: function onSortStart(_, event) {
      return event.preventDefault();
    } // This prevents Safari weirdness
    ,
    onDragEnd: _resortTiles,
    onBeforeCapture: beforeCapture,
    direction: "vertical",
    useDragHandle: true,
    axis: "xy",
    extraProps: {
      dragging: dragging,
      current_doc_name: props.current_doc_name,
      selected_row: props.selected_row,
      table_is_shrunk: props.table_is_shrunk
    }
  }));
}
exports.TileContainer = TileContainer = /*#__PURE__*/(0, _react.memo)(TileContainer);
function SortHandle(props) {
  return /*#__PURE__*/_react["default"].createElement("span", _extends({
    className: "tile-name-div"
  }, props.dragHandleProps), /*#__PURE__*/_react["default"].createElement(_core.Icon, {
    icon: "drag-handle-vertical",
    size: 15
  }), props.tile_name);
}
SortHandle = /*#__PURE__*/(0, _react.memo)(SortHandle);
var menu_icons = {
  "Kill and reload": "refresh",
  "Kill, reload, and resubmit": "social-media",
  "Run me": "play",
  "Stop me": "stop",
  "Toggle console": "console",
  "Log me": "clipboard",
  "Log parameters": "th",
  "Edit my source": "edit",
  "Delete me": "trash"
};
var menu_button = /*#__PURE__*/_react["default"].createElement(_core.Button, {
  minimal: true,
  small: true,
  icon: "more"
});
var alt_button = function alt_button() {
  return menu_button;
};
function TileComponent(props) {
  props = _objectSpread({
    javascript_code: null,
    log_since: null,
    max_console_lines: 100
  }, props);
  var my_ref = (0, _react.useRef)(null);
  var body_ref = (0, _react.useRef)(null);
  var inner_log_ref = (0, _react.useRef)(null);
  var tda_ref = (0, _react.useRef)(null);
  var log_ref = (0, _react.useRef)(null);
  var left_glyphs_ref = (0, _react.useRef)(null);
  var right_glyphs_ref = (0, _react.useRef)(null);
  var javascript_error_ref = (0, _react.useRef)(false);
  var last_front_content = (0, _react.useRef)("");
  var _useState3 = (0, _react.useState)(34),
    _useState4 = _slicedToArray(_useState3, 2),
    header_height = _useState4[0],
    set_header_height = _useState4[1];
  var _useState5 = (0, _react.useState)(1000),
    _useState6 = _slicedToArray(_useState5, 2),
    max_name_width = _useState6[0],
    set_max_name_width = _useState6[1];
  var _useState7 = (0, _react.useState)(false),
    _useState8 = _slicedToArray(_useState7, 2),
    resizing = _useState8[0],
    set_resizing = _useState8[1];
  var _useState9 = (0, _react.useState)(0),
    _useState10 = _slicedToArray(_useState9, 2),
    dwidth = _useState10[0],
    set_dwidth = _useState10[1];
  var _useState11 = (0, _react.useState)(0),
    _useState12 = _slicedToArray(_useState11, 2),
    dheight = _useState12[0],
    set_dheight = _useState12[1];

  // const menu_component_ref = useRef(null);

  var pushCallback = (0, _utilities_react.useCallbackStack)();
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  (0, _react.useEffect)(function () {
    _broadcastTileSize(props.tile_width, props.tile_height);
    // menu_component_ref.current = _createMenu();
    executeEmbeddedScripts();
    // makeTablesSortable();
    if (props.javascript_code) {
      _executeJavascript();
    }
    listen_for_clicks();
  }, []);

  // useEffect(()=>{
  //     menu_component_ref.current = _createMenu();
  // }, [props.setTileState, props.form_data, props.tile_id, props.show_log, props.tile_type,
  //     props.broadcast_event, props.tile_name, props.main_id]); //

  (0, _react.useEffect)(function () {
    if (!resizing) {
      executeEmbeddedScripts();
    }
    // makeTablesSortable();
    if (props.javascript_code) {
      _executeJavascript();
    }
    listen_for_clicks();
    if (props.show_log) {
      if (log_ref && log_ref.current) {
        log_ref.current.scrollTo(0, log_ref.current.scrollHeight);
      }
    }
  });
  (0, _react.useEffect)(function () {
    javascript_error_ref.current = false;
  }, [props.javascript_code]);
  (0, _react.useEffect)(function () {
    _broadcastTileSize(props.tile_width, props.tile_height);
  }, [props.tile_width, props.tile_height]);

  // Broadcasting the tile size is necessary because some tiles (notably matplotlib tiles)
  // need to know the size of the display area.
  function _broadcastTileSize() {
    (0, _communication_react.postWithCallback)(props.tile_id, "TileSizeChange", {
      width: tdaWidth(),
      height: tdaHeight()
    }, null, null, props.main_id);
  }
  function _resizeTileArea(dx, dy) {
    var hheight = $(body_ref.current).position().top;
    set_header_height(hheight);
    var new_state = {
      tile_height: props.tile_height + dy,
      tile_width: props.tile_width + dx
    };
    props.setTileState(props.tile_id, new_state);
  }
  function executeEmbeddedScripts() {
    if (props.front_content != last_front_content.current) {
      // to avoid doubles of bokeh images
      last_front_content.current = props.front_content;
      var scripts = $("#" + props.tile_id + " .tile-display-area script").toArray();
      var _iterator3 = _createForOfIteratorHelper(scripts),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var script = _step3.value;
          try {
            window.eval(script.text);
          } catch (e) {}
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  }

  // function makeTablesSortable() {
  //     let tables = $("#" + props.tile_id + " table.sortable").toArray();
  //     for (let table of tables) {
  //         sorttable.makeSortable(table)
  //     }
  // }

  function tdaWidth() {
    return props.tile_width + dwidth - TILE_DISPLAY_AREA_MARGIN * 2;
  }
  function tdaHeight() {
    return props.tile_height + dheight - header_height - TILE_DISPLAY_AREA_MARGIN * 2;
  }
  function _executeJavascript() {
    try {
      if (!javascript_error_ref.current) {
        var selector = "[id='" + props.tile_id + "'] .jscript-target";
        eval(props.javascript_code)(selector, tdaWidth(), tdaHeight(), props.javascript_arg_dict, resizing);
      }
    } catch (err) {
      javascript_error_ref.current = true;
      errorDrawerFuncs.addErrorDrawerEntry({
        title: "Error evaluating javascript",
        content: err.message
      });
    }
  }
  function _toggleTileLog() {
    props.setTileState(props.tile_id, {
      show_log: !props.show_log,
      show_form: false
    });
  }
  function _toggleShrunk() {
    props.setTileValue(props.tile_id, "shrunk", !props.shrunk);
  }
  function _closeTile() {
    return _closeTile2.apply(this, arguments);
  }
  function _closeTile2() {
    _closeTile2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return dialogFuncs.showModalPromise("ConfirmDialog", {
              title: "Delete Tile",
              text_body: "Delete tile ".concat(props.tile_name),
              cancel_text: "do nothing",
              submit_text: "delete",
              handleClose: dialogFuncs.hideModal
            });
          case 3:
            props.handleClose(props.tile_id);
            _context4.next = 9;
            break;
          case 6:
            _context4.prev = 6;
            _context4.t0 = _context4["catch"](0);
            if (_context4.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error closing tile", _context4.t0);
            }
          case 9:
          case "end":
            return _context4.stop();
        }
      }, _callee4, null, [[0, 6]]);
    }));
    return _closeTile2.apply(this, arguments);
  }
  function _standard_click_data() {
    return {
      tile_id: props.tile_id,
      main_id: props.main_id,
      doc_name: props.current_doc_name,
      active_row_id: props.selected_row
    };
  }
  function _updateOptionValue(_x, _x2) {
    return _updateOptionValue2.apply(this, arguments);
  }
  function _updateOptionValue2() {
    _updateOptionValue2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(option_name, value) {
      var callback,
        data_dict,
        data,
        _args5 = arguments;
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            callback = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : null;
            data_dict = {
              tile_id: props.tile_id,
              option_name: option_name,
              value: value
            };
            _context5.prev = 2;
            _context5.next = 5;
            return (0, _communication_react.postPromise)(props.tile_id, "_update_single_option", data_dict);
          case 5:
            data = _context5.sent;
            if (data && "form_data" in data) {
              props.setTileValue(props.tile_id, "form_data", data.form_data, callback);
            }
            _context5.next = 13;
            break;
          case 9:
            _context5.prev = 9;
            _context5.t0 = _context5["catch"](2);
            errorDrawerFuncs.addFromError("Error updating option value", _context5.t0);
            return _context5.abrupt("return");
          case 13:
          case "end":
            return _context5.stop();
        }
      }, _callee5, null, [[2, 9]]);
    }));
    return _updateOptionValue2.apply(this, arguments);
  }
  function _toggleBack() {
    props.setTileState(props.tile_id, {
      show_log: false,
      show_form: !props.show_form
    });
  }
  function _setTileBack(show_form) {
    props.setTileValue(props.tile_id, "show_form", show_form);
  }
  function _handleSubmitOptions() {
    props.setTileState(props.tile_id, {
      show_form: false,
      show_spinner: true
    });
    var data = {};
    var _iterator4 = _createForOfIteratorHelper(props.form_data),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var opt = _step4.value;
        data[opt.name] = opt.starting_value;
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
    data.tile_id = props.tile_id;
    props.broadcast_event("UpdateOptions", data);
  }
  function _startSpinner() {
    props.setTileValue(props.tile_id, "show_spinner", true);
  }
  function _stopSpinner() {
    props.setTileValue(props.tile_id, "show_spinner", false);
  }
  function _displayFormContent(data) {
    props.setTileValue(props.tile_id, "form_data", data.form_data);
  }
  function spin_and_refresh() {
    return _spin_and_refresh.apply(this, arguments);
  }
  function _spin_and_refresh() {
    _spin_and_refresh = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            _startSpinner();
            _context6.next = 3;
            return (0, _communication_react.postPromise)(props.tile_id, "RefreshTile", {}, props.main_id);
          case 3:
            _stopSpinner();
          case 4:
          case "end":
            return _context6.stop();
        }
      }, _callee6);
    }));
    return _spin_and_refresh.apply(this, arguments);
  }
  function _reloadTile() {
    return _reloadTile2.apply(this, arguments);
  }
  function _reloadTile2() {
    _reloadTile2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7() {
      var resubmit,
        data_dict,
        data,
        _args7 = arguments;
      return _regeneratorRuntime().wrap(function _callee7$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
          case 0:
            resubmit = _args7.length > 0 && _args7[0] !== undefined ? _args7[0] : false;
            data_dict = {
              "tile_id": props.tile_id,
              "tile_name": props.tile_name
            };
            _context7.prev = 2;
            _startSpinner();
            _context7.next = 6;
            return (0, _communication_react.postPromise)(props.main_id, "reload_tile", data_dict, props.main_id);
          case 6:
            data = _context7.sent;
            _displayFormContent(data);
            props.setTileValue(props.tile_id, "source_changed", false);
            if (!(data.options_changed || !resubmit)) {
              _context7.next = 14;
              break;
            }
            _stopSpinner();
            _setTileBack(true);
            _context7.next = 16;
            break;
          case 14:
            _context7.next = 16;
            return spin_and_refresh();
          case 16:
            _context7.next = 22;
            break;
          case 18:
            _context7.prev = 18;
            _context7.t0 = _context7["catch"](2);
            _stopSpinner();
            errorDrawerFuncs.addFromError("Error reloading tile", _context7.t0);
          case 22:
          case "end":
            return _context7.stop();
        }
      }, _callee7, null, [[2, 18]]);
    }));
    return _reloadTile2.apply(this, arguments);
  }
  function listen_for_clicks() {
    $(body_ref.current).off();
    $(body_ref.current).on(click_event, '.element-clickable', function (e) {
      var data_dict = _standard_click_data();
      var dset = e.target.dataset;
      data_dict.dataset = {};
      for (var key in dset) {
        if (!dset.hasOwnProperty(key)) continue;
        data_dict.dataset[key] = dset[key];
      }
      (0, _communication_react.postWithCallback)(props.tile_id, "TileElementClick", data_dict, null, null, props.main_id);
      e.stopPropagation();
    });
    $(body_ref.current).on(click_event, '.word-clickable', function (e) {
      var data_dict = _standard_click_data();
      var s = window.getSelection();
      var range = s.getRangeAt(0);
      var node = s.anchorNode;
      while (range.toString().indexOf(' ') !== 0 && range.startOffset !== 0) {
        range.setStart(node, range.startOffset - 1);
      }
      var nlen = node.textContent.length;
      if (range.startOffset !== 0) {
        range.setStart(node, range.startOffset + 1);
      }
      do {
        range.setEnd(node, range.endOffset + 1);
      } while (range.toString().indexOf(' ') == -1 && range.toString().trim() !== '' && range.endOffset < nlen);
      data_dict.clicked_text = range.toString().trim();
      (0, _communication_react.postWithCallback)(props.tile_id, "TileWordClick", data_dict, null, null, props.main_id);
    });
    $(body_ref.current).on(click_event, '.cell-clickable', function (e) {
      var data_dict = _standard_click_data();
      data_dict.clicked_cell = $(this).text();
      (0, _communication_react.postWithCallback)(props.tile_id, "TileCellClick", data_dict, null, null, props.main_id);
    });
    $(body_ref.current).on(click_event, '.row-clickable', function (e) {
      var data_dict = _standard_click_data();
      var cells = $(this).children();
      var row_vals = [];
      cells.each(function () {
        row_vals.push($(this).text());
      });
      data_dict["clicked_row"] = row_vals;
      (0, _communication_react.postWithCallback)(props.tile_id, "TileRowClick", data_dict, null, null, props.main_id);
    });
    $(body_ref.current).on(click_event, '.front button', function (e) {
      var data_dict = _standard_click_data();
      data_dict["button_value"] = e.target.value;
      (0, _communication_react.postWithCallback)(props.tile_id, "TileButtonClick", data_dict, null, null, props.main_id);
    });
    $(body_ref.current).on('submit', '.front form', function (e) {
      var data_dict = _standard_click_data();
      var form_data = {};
      var the_form = e.target;
      for (var i = 0; i < the_form.length; i += 1) {
        form_data[the_form[i]["name"]] = the_form[i]["value"];
      }
      data_dict["form_data"] = form_data;
      (0, _communication_react.postWithCallback)(props.tile_id, "TileFormSubmit", data_dict, null, null, props.main_id);
      return false;
    });
    $(body_ref.current).on("change", '.front select', function (e) {
      var data_dict = _standard_click_data();
      data_dict.select_value = e.target.value;
      data_dict.select_name = e.target.name;
      (0, _communication_react.postWithCallback)(props.tile_id, "SelectChange", data_dict, null, null, props.main_id);
    });
    $(body_ref.current).on('change', '.front textarea', function (e) {
      var data_dict = _standard_click_data();
      data_dict["text_value"] = e.target.value;
      (0, _communication_react.postWithCallback)(props.tile_id, "TileTextAreaChange", data_dict, null, null, props.main_id);
    });
  }
  var front_style;
  var tda_style;
  var back_style;
  var tile_log_style;
  var panel_body_style;
  var main_style;
  var transitionStylesAltUp;
  var transitionStylesAltDown;
  var transitionFadeStyles;
  var lg_style;
  function compute_styles() {
    var the_margin = 15;
    var tile_height = props.shrunk ? header_height : props.tile_height;
    front_style = {
      width: props.tile_width,
      height: tile_height - header_height
    };
    tda_style = {
      width: props.tile_width - TILE_DISPLAY_AREA_MARGIN * 2,
      height: tile_height - header_height - TILE_DISPLAY_AREA_MARGIN * 2
    };
    if (left_glyphs_ref.current && right_glyphs_ref.current) {
      var lg_rect = left_glyphs_ref.current.getBoundingClientRect();
      var rg_rect = right_glyphs_ref.current.getBoundingClientRect();
      var lg_width = rg_rect.x - lg_rect.x - 10;
      lg_style = {
        width: lg_width,
        overflow: "hidden"
      };
    } else {
      lg_style = {};
    }
    back_style = Object.assign({}, front_style);
    tile_log_style = {
      overflow: "auto",
      marginLeft: 20,
      marginRight: 20,
      marginTop: 10,
      marginBottom: 10,
      width: props.tile_width - 40,
      height: tile_height - header_height - 50
    };
    panel_body_style = {
      "width": props.tile_width
    };
    main_style = {
      width: props.tile_width + dwidth,
      height: tile_height + dheight,
      position: "relative"
    };
    if (!props.finished_loading) {
      main_style.opacity = .5;
    }
    front_style.transition = "top ".concat(ANI_DURATION, "ms ease-in-out");
    back_style.transition = "top ".concat(ANI_DURATION, "ms ease-in-out");
    transitionStylesAltUp = {
      transition: "top ".concat(ANI_DURATION, "ms ease-in-out"),
      entering: {
        top: header_height
      },
      entered: {
        top: header_height
      },
      exiting: {
        top: -1 * tile_height
      },
      exited: {
        top: -1 * tile_height
      }
    };
    transitionStylesAltDown = {
      entering: {
        top: header_height,
        opacity: 1
      },
      entered: {
        top: header_height,
        opacity: 1
      },
      exiting: {
        top: tile_height + 50
      },
      exited: {
        top: tile_height + 50,
        opacity: 0
      }
    };
    tile_log_style.transition = "opacity ".concat(ANI_DURATION, "ms ease-in-out");
    transitionFadeStyles = {
      entering: {
        opacity: 1
      },
      entered: {
        opacity: 1
      },
      exiting: {
        opacity: 0,
        width: 0,
        height: 0,
        padding: 0
      },
      exited: {
        opacity: 0,
        width: 0,
        height: 0,
        padding: 0
      }
    };
  }
  function logText(the_text) {
    (0, _communication_react.postWithCallback)(props.tile_id, "LogTile", {}, null, null, props.main_id);
  }
  function _stopMe() {
    (0, _communication_react.postWithCallback)("kill_" + props.tile_id, "StopMe", {}, null);
  }
  function _editMe() {
    return _editMe2.apply(this, arguments);
  }
  function _editMe2() {
    _editMe2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8() {
      var data;
      return _regeneratorRuntime().wrap(function _callee8$(_context8) {
        while (1) switch (_context8.prev = _context8.next) {
          case 0:
            if (window.in_context) {
              _context8.next = 14;
              break;
            }
            window.blur();
            _context8.prev = 2;
            _context8.next = 5;
            return (0, _communication_react.postPromise)("host", "go_to_module_viewer_if_exists", {
              user_id: window.user_id,
              tile_type: props.tile_type,
              line_number: 0
            }, props.main_id);
          case 5:
            data = _context8.sent;
            window.open("", data.window_name);
            _context8.next = 12;
            break;
          case 9:
            _context8.prev = 9;
            _context8.t0 = _context8["catch"](2);
            window.open($SCRIPT_ROOT + "/view_location_in_creator/" + props.tile_type + "/" + "0");
          case 12:
            _context8.next = 15;
            break;
          case 14:
            props.goToModule(props.tile_type, 0);
          case 15:
          case "end":
            return _context8.stop();
        }
      }, _callee8, null, [[2, 9]]);
    }));
    return _editMe2.apply(this, arguments);
  }
  function _logMe() {
    logText(props.front_content);
  }
  function _logParams() {
    var data_dict = {};
    data_dict["main_id"] = props.main_id;
    data_dict["tile_id"] = props.tile_id;
    data_dict["tile_name"] = props.tile_name;
    (0, _communication_react.postWithCallback)(props.tile_id, "LogParams", data_dict, null, null, props.main_id);
  }
  function _startResize(e, ui, startX, startY) {
    set_resizing(true);
    set_dwidth(0);
    set_dheight(0);
  }
  function _onResize(e, ui, x, y, dx, dy) {
    set_dwidth(dx);
    set_dheight(dy);
  }
  function _stopResize(e, ui, x, y, dx, dy) {
    set_resizing(false);
    set_dwidth(0);
    set_dheight(0);
    pushCallback(function () {
      _resizeTileArea(dx, dy);
    });
  }
  var show_front = !props.show_form && !props.show_log;
  var front_dict = {
    __html: props.front_content
  };
  compute_styles();
  var tile_class = props.table_is_shrunk && !props.dragging ? "tile-panel tile-panel-float" : "tile-panel";
  var tph_class = props.source_changed ? "tile-panel-heading tile-source-changed" : "tile-panel-heading";
  var draghandle_position_dict = {
    position: "absolute",
    bottom: 2,
    right: 1
  };
  var tile_menu_options = {
    "Run me": _handleSubmitOptions,
    "Stop me": _stopMe,
    "divider99": "divider",
    "Kill and reload": function () {
      var _KillAndReload = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _reloadTile(false);
            case 2:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      function KillAndReload() {
        return _KillAndReload.apply(this, arguments);
      }
      return KillAndReload;
    }(),
    "Kill, reload, and resubmit": function () {
      var _KillReloadAndResubmit = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _reloadTile(true);
            case 2:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      function KillReloadAndResubmit() {
        return _KillReloadAndResubmit.apply(this, arguments);
      }
      return KillReloadAndResubmit;
    }(),
    "divider0": "divider",
    "Toggle console": _toggleTileLog,
    "divider1": "divider",
    "Log me": _logMe,
    "Log parameters": _logParams,
    "divider2": "divider",
    "Edit my source": _editMe,
    "divider3": "divider",
    "Delete me": _closeTile
  };
  return /*#__PURE__*/_react["default"].createElement(_core.Card, {
    ref: my_ref,
    elevation: 2,
    style: main_style,
    className: tile_class,
    id: props.tile_id
  }, /*#__PURE__*/_react["default"].createElement(_error_boundary.ErrorBoundary, null, /*#__PURE__*/_react["default"].createElement("div", {
    className: tph_class
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "left-glyphs",
    ref: left_glyphs_ref,
    style: lg_style
  }, /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, null, props.shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    icon: "chevron-right",
    handleClick: _toggleShrunk
  }), !props.shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    icon: "chevron-down",
    handleClick: _toggleShrunk
  }), /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    intent: "primary",
    handleClick: _toggleBack,
    icon: "cog"
  }), /*#__PURE__*/_react["default"].createElement(SortHandle, {
    dragHandleProps: props.dragHandleProps,
    tile_name: props.tile_name
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "right-glyphs",
    style: {
      marginRight: 10
    },
    ref: right_glyphs_ref
  }, /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, null, props.show_log && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    intent: "primary",
    handleClick: _toggleTileLog,
    icon: "console"
  }), props.source_changed && !props.show_spinner && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    intent: "danger",
    handleClick: /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _reloadTile(true);
          case 2:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    })),
    icon: "social-media"
  }), props.show_spinner && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    intent: "danger",
    handleClick: _stopMe,
    icon: "stop"
  }), props.show_spinner && /*#__PURE__*/_react["default"].createElement(_core.Spinner, {
    size: 17
  }), /*#__PURE__*/_react["default"].createElement(_menu_utilities.MenuComponent, {
    option_dict: tile_menu_options,
    icon_dict: menu_icons,
    createOmniItems: false,
    item_class: "tile-menu-item",
    position: _core.PopoverPosition.BOTTOM_RIGHT,
    alt_button: alt_button
  })))), /*#__PURE__*/_react["default"].createElement(_error_boundary.ErrorBoundary, null, !props.shrunk && /*#__PURE__*/_react["default"].createElement("div", {
    ref: body_ref,
    style: panel_body_style,
    className: "tile-body"
  }, /*#__PURE__*/_react["default"].createElement(_error_boundary.ErrorBoundary, null, /*#__PURE__*/_react["default"].createElement(_reactTransitionGroup.Transition, {
    "in": props.show_form,
    timeout: ANI_DURATION
  }, function (state) {
    return /*#__PURE__*/_react["default"].createElement("div", {
      className: "back",
      style: composeObjs(back_style, transitionStylesAltUp[state])
    }, /*#__PURE__*/_react["default"].createElement(_tile_form_react.TileForm, {
      options: _lodash["default"].cloneDeep(props.form_data),
      tile_id: props.tile_id,
      updateValue: _updateOptionValue,
      handleSubmit: _handleSubmitOptions
    }));
  })), /*#__PURE__*/_react["default"].createElement(_error_boundary.ErrorBoundary, null, props.show_log && /*#__PURE__*/_react["default"].createElement("div", {
    className: "tile-log",
    ref: log_ref
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "tile-log-area"
  }, /*#__PURE__*/_react["default"].createElement(_searchable_console.SearchableConsole, {
    main_id: props.main_id,
    streaming_host: "host",
    container_id: props.tile_id,
    ref: inner_log_ref,
    outer_style: tile_log_style,
    showCommandField: true
  })))), /*#__PURE__*/_react["default"].createElement(_error_boundary.ErrorBoundary, null, /*#__PURE__*/_react["default"].createElement(_reactTransitionGroup.Transition, {
    "in": show_front,
    timeout: ANI_DURATION
  }, function (state) {
    return /*#__PURE__*/_react["default"].createElement("div", {
      className: "front",
      style: composeObjs(front_style, transitionStylesAltDown[state])
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "tile-display-area",
      style: tda_style,
      ref: tda_ref,
      dangerouslySetInnerHTML: front_dict
    }));
  })))), /*#__PURE__*/_react["default"].createElement(_resizing_layouts.DragHandle, {
    position_dict: draghandle_position_dict,
    dragStart: _startResize,
    onDrag: _onResize,
    dragEnd: _stopResize,
    direction: "both"
  })));
}
TileComponent = /*#__PURE__*/(0, _react.memo)(TileComponent);
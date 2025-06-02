"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ColumnMenu = ColumnMenu;
exports.DocumentMenu = DocumentMenu;
Object.defineProperty(exports, "MenuComponent", {
  enumerable: true,
  get: function get() {
    return _menu_utilities.MenuComponent;
  }
});
exports.ProjectMenu = ProjectMenu;
exports.RowMenu = RowMenu;
exports.ViewMenu = ViewMenu;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _markdownIt = _interopRequireDefault(require("markdown-it"));
require("markdown-it-latex/dist/index.css");
var _markdownItLatex = _interopRequireDefault(require("markdown-it-latex"));
var _communication_react = require("./communication_react");
var _menu_utilities = require("./menu_utilities");
var _modal_react = require("./modal_react");
var _toaster = require("./toaster");
var _error_drawer = require("./error_drawer");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return r; }; var t, r = {}, e = Object.prototype, n = e.hasOwnProperty, o = "function" == typeof Symbol ? Symbol : {}, i = o.iterator || "@@iterator", a = o.asyncIterator || "@@asyncIterator", u = o.toStringTag || "@@toStringTag"; function c(t, r, e, n) { return Object.defineProperty(t, r, { value: e, enumerable: !n, configurable: !n, writable: !n }); } try { c({}, ""); } catch (t) { c = function c(t, r, e) { return t[r] = e; }; } function h(r, e, n, o) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype); return c(a, "_invoke", function (r, e, n) { var o = 1; return function (i, a) { if (3 === o) throw Error("Generator is already running"); if (4 === o) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var u = n.delegate; if (u) { var c = d(u, n); if (c) { if (c === f) continue; return c; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (1 === o) throw o = 4, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = 3; var h = s(r, e, n); if ("normal" === h.type) { if (o = n.done ? 4 : 2, h.arg === f) continue; return { value: h.arg, done: n.done }; } "throw" === h.type && (o = 4, n.method = "throw", n.arg = h.arg); } }; }(r, n, new Context(o || [])), !0), a; } function s(t, r, e) { try { return { type: "normal", arg: t.call(r, e) }; } catch (t) { return { type: "throw", arg: t }; } } r.wrap = h; var f = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var l = {}; c(l, i, function () { return this; }); var p = Object.getPrototypeOf, y = p && p(p(x([]))); y && y !== e && n.call(y, i) && (l = y); var v = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(l); function g(t) { ["next", "throw", "return"].forEach(function (r) { c(t, r, function (t) { return this._invoke(r, t); }); }); } function AsyncIterator(t, r) { function e(o, i, a, u) { var c = s(t[o], t, i); if ("throw" !== c.type) { var h = c.arg, f = h.value; return f && "object" == _typeof(f) && n.call(f, "__await") ? r.resolve(f.__await).then(function (t) { e("next", t, a, u); }, function (t) { e("throw", t, a, u); }) : r.resolve(f).then(function (t) { h.value = t, a(h); }, function (t) { return e("throw", t, a, u); }); } u(c.arg); } var o; c(this, "_invoke", function (t, n) { function i() { return new r(function (r, o) { e(t, n, r, o); }); } return o = o ? o.then(i, i) : i(); }, !0); } function d(r, e) { var n = e.method, o = r.i[n]; if (o === t) return e.delegate = null, "throw" === n && r.i["return"] && (e.method = "return", e.arg = t, d(r, e), "throw" === e.method) || "return" !== n && (e.method = "throw", e.arg = new TypeError("The iterator does not provide a '" + n + "' method")), f; var i = s(o, r.i, e.arg); if ("throw" === i.type) return e.method = "throw", e.arg = i.arg, e.delegate = null, f; var a = i.arg; return a ? a.done ? (e[r.r] = a.value, e.next = r.n, "return" !== e.method && (e.method = "next", e.arg = t), e.delegate = null, f) : a : (e.method = "throw", e.arg = new TypeError("iterator result is not an object"), e.delegate = null, f); } function w(t) { this.tryEntries.push(t); } function m(r) { var e = r[4] || {}; e.type = "normal", e.arg = t, r[4] = e; } function Context(t) { this.tryEntries = [[-1]], t.forEach(w, this), this.reset(!0); } function x(r) { if (null != r) { var e = r[i]; if (e) return e.call(r); if ("function" == typeof r.next) return r; if (!isNaN(r.length)) { var o = -1, a = function e() { for (; ++o < r.length;) if (n.call(r, o)) return e.value = r[o], e.done = !1, e; return e.value = t, e.done = !0, e; }; return a.next = a; } } throw new TypeError(_typeof(r) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, c(v, "constructor", GeneratorFunctionPrototype), c(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = c(GeneratorFunctionPrototype, u, "GeneratorFunction"), r.isGeneratorFunction = function (t) { var r = "function" == typeof t && t.constructor; return !!r && (r === GeneratorFunction || "GeneratorFunction" === (r.displayName || r.name)); }, r.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, c(t, u, "GeneratorFunction")), t.prototype = Object.create(v), t; }, r.awrap = function (t) { return { __await: t }; }, g(AsyncIterator.prototype), c(AsyncIterator.prototype, a, function () { return this; }), r.AsyncIterator = AsyncIterator, r.async = function (t, e, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(h(t, e, n, o), i); return r.isGeneratorFunction(e) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, g(v), c(v, u, "Generator"), c(v, i, function () { return this; }), c(v, "toString", function () { return "[object Generator]"; }), r.keys = function (t) { var r = Object(t), e = []; for (var n in r) e.unshift(n); return function t() { for (; e.length;) if ((n = e.pop()) in r) return t.value = n, t.done = !1, t; return t.done = !0, t; }; }, r.values = x, Context.prototype = { constructor: Context, reset: function reset(r) { if (this.prev = this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(m), !r) for (var e in this) "t" === e.charAt(0) && n.call(this, e) && !isNaN(+e.slice(1)) && (this[e] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0][4]; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(r) { if (this.done) throw r; var e = this; function n(t) { a.type = "throw", a.arg = r, e.next = t; } for (var o = e.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i[4], u = this.prev, c = i[1], h = i[2]; if (-1 === i[0]) return n("end"), !1; if (!c && !h) throw Error("try statement without catch or finally"); if (null != i[0] && i[0] <= u) { if (u < c) return this.method = "next", this.arg = t, n(c), !0; if (u < h) return n(h), !1; } } }, abrupt: function abrupt(t, r) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var n = this.tryEntries[e]; if (n[0] > -1 && n[0] <= this.prev && this.prev < n[2]) { var o = n; break; } } o && ("break" === t || "continue" === t) && o[0] <= r && r <= o[2] && (o = null); var i = o ? o[4] : {}; return i.type = t, i.arg = r, o ? (this.method = "next", this.next = o[2], f) : this.complete(i); }, complete: function complete(t, r) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && r && (this.next = r), f; }, finish: function finish(t) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var e = this.tryEntries[r]; if (e[2] === t) return this.complete(e[4], e[3]), m(e), f; } }, "catch": function _catch(t) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var e = this.tryEntries[r]; if (e[0] === t) { var n = e[4]; if ("throw" === n.type) { var o = n.arg; m(e); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(r, e, n) { return this.delegate = { i: x(r), r: e, n: n }, "next" === this.method && (this.arg = t), f; } }, r; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var mdi = (0, _markdownIt["default"])({
  html: true
});
mdi.use(_markdownItLatex["default"]);
function ProjectMenu(props) {
  props = _objectSpread({
    disabled_items: []
  }, props);
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  var statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  var save_state;
  if (props.is_notebook) save_state = {
    console_items: props.console_items,
    show_exports_pane: props.mState.show_exports_pane,
    console_width_fraction: props.mState.console_width_fraction
  };else {
    save_state = {
      console_items: props.console_items,
      tile_list: props.tile_list,
      table_is_shrunk: props.mState.table_is_shrunk,
      horizontal_fraction: props.mState.horizontal_fraction,
      console_is_shrunk: props.mState.console_is_shrunk,
      height_fraction: props.mState.height_fraction,
      show_console_pane: props.mState.show_console_pane,
      console_is_zoomed: props.mState.console_is_zoomed,
      show_exports_pane: props.mState.show_exports_pane,
      console_width_fraction: props.mState.console_width_fraction
    };
  }
  function _saveProjectAs() {
    return _saveProjectAs2.apply(this, arguments);
  }
  function _saveProjectAs2() {
    _saveProjectAs2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
      var data, checkboxes, _yield$dialogFuncs$sh, _yield$dialogFuncs$sh2, new_name, checkbox_states, result_dict, data_object, title;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            statusFuncs.startSpinner();
            _context3.next = 3;
            return (0, _communication_react.postPromise)("host", "get_project_names", {
              "user_id": window.user_id
            }, props.main_id);
          case 3:
            data = _context3.sent;
            checkboxes = [{
              checkname: "lite_save",
              checktext: "create lite save"
            }];
            _context3.prev = 5;
            _context3.next = 8;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Save Project As",
              field_title: "New Project Name",
              default_value: "NewProject",
              existing_names: data.project_names,
              checkboxes: checkboxes,
              handleClose: dialogFuncs.hideModal
            });
          case 8:
            _yield$dialogFuncs$sh = _context3.sent;
            _yield$dialogFuncs$sh2 = _slicedToArray(_yield$dialogFuncs$sh, 2);
            new_name = _yield$dialogFuncs$sh2[0];
            checkbox_states = _yield$dialogFuncs$sh2[1];
            result_dict = {
              "project_name": new_name,
              "main_id": props.main_id,
              "doc_type": "table",
              "purgetiles": true,
              "lite_save": checkbox_states["lite_save"]
            };
            result_dict.interface_state = save_state;
            if (!props.is_notebook) {
              _context3.next = 19;
              break;
            }
            _context3.next = 17;
            return (0, _communication_react.postPromise)(props.main_id, "save_new_notebook_project", result_dict, props.main_id);
          case 17:
            _context3.next = 22;
            break;
          case 19:
            result_dict["purgetiles"] = true;
            _context3.next = 22;
            return (0, _communication_react.postPromise)(props.main_id, "save_new_project", result_dict, props.main_id);
          case 22:
            props.setProjectName(new_name, function () {
              if (!window.in_context) {
                document.title = new_name;
              }
              statusFuncs.clearStatusMessage();
              props.updateLastSave();
              statusFuncs.stopSpinner();
              statusFuncs.statusMessage("Saved project ".concat(new_name));
            });
            _context3.next = 30;
            break;
          case 25:
            _context3.prev = 25;
            _context3.t0 = _context3["catch"](5);
            if (_context3.t0 != "canceled") {
              title = "title" in _context3.t0 ? _context3.t0.title : "Error saving project";
              errorDrawerFuncs.addFromError(title, _context3.t0);
            }
            statusFuncs.clearStatusMessage();
            statusFuncs.stopSpinner();
          case 30:
          case "end":
            return _context3.stop();
        }
      }, _callee3, null, [[5, 25]]);
    }));
    return _saveProjectAs2.apply(this, arguments);
  }
  function _saveProject(_x) {
    return _saveProject2.apply(this, arguments);
  }
  function _saveProject2() {
    _saveProject2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(lite_save) {
      var result_dict, title;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            result_dict = {
              main_id: props.main_id,
              project_name: props.project_name,
              lite_save: lite_save
            };
            result_dict.interface_state = save_state;
            statusFuncs.startSpinner();
            _context4.next = 6;
            return (0, _communication_react.postPromise)(props.main_id, "update_project", result_dict, props.main_id);
          case 6:
            props.updateLastSave();
            statusFuncs.statusMessage("Saved project ".concat(props.project_name));
            statusFuncs.stopSpinner();
            _context4.next = 17;
            break;
          case 11:
            _context4.prev = 11;
            _context4.t0 = _context4["catch"](0);
            title = "title" in _context4.t0 ? _context4.t0.title : "Error saving project";
            errorDrawerFuncs.addFromError(title, _context4.t0);
            statusFuncs.clearStatusMessage();
            statusFuncs.stopSpinner();
          case 17:
          case "end":
            return _context4.stop();
        }
      }, _callee4, null, [[0, 11]]);
    }));
    return _saveProject2.apply(this, arguments);
  }
  function _exportAsPresentation() {
    return _exportAsPresentation2.apply(this, arguments);
  }
  function _exportAsPresentation2() {
    _exportAsPresentation2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
      var data, _yield$dialogFuncs$sh3, _yield$dialogFuncs$sh4, use_dark_theme, save_as_collection, collection_name, cell_list, _iterator, _step, entry, new_entry, result_dict, data_object, title;
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return (0, _communication_react.postPromise)("host", "get_collection_names", {
              "user_id": user_id
            }, props.main_id);
          case 3:
            data = _context5.sent;
            _context5.next = 6;
            return dialogFuncs.showModalPromise("PresentationDialog", {
              default_value: "NewPresentation",
              existing_names: data.collection_names,
              handleClose: dialogFuncs.hideModal
            });
          case 6:
            _yield$dialogFuncs$sh3 = _context5.sent;
            _yield$dialogFuncs$sh4 = _slicedToArray(_yield$dialogFuncs$sh3, 3);
            use_dark_theme = _yield$dialogFuncs$sh4[0];
            save_as_collection = _yield$dialogFuncs$sh4[1];
            collection_name = _yield$dialogFuncs$sh4[2];
            cell_list = [];
            _iterator = _createForOfIteratorHelper(props.console_items);
            _context5.prev = 13;
            _iterator.s();
          case 15:
            if ((_step = _iterator.n()).done) {
              _context5.next = 42;
              break;
            }
            entry = _step.value;
            new_entry = {};
            new_entry.type = entry.type;
            _context5.t0 = entry.type;
            _context5.next = _context5.t0 === "text" ? 22 : _context5.t0 === "code" ? 26 : _context5.t0 === "divider" ? 30 : _context5.t0 === "figure" ? 33 : 36;
            break;
          case 22:
            new_entry.console_text = mdi.render(entry.console_text);
            new_entry.raw_text = entry.console_text;
            new_entry.summary_text = entry.summary_text;
            return _context5.abrupt("break", 39);
          case 26:
            new_entry.console_text = entry.console_text;
            new_entry.output_text = entry.output_text;
            new_entry.summary_text = entry.summary_text;
            return _context5.abrupt("break", 39);
          case 30:
            new_entry.header_text = entry.header_text;
            new_entry.summary_text = "";
            return _context5.abrupt("break", 39);
          case 33:
            new_entry.image_data_str = entry.image_data_str;
            new_entry.summary_text = entry.summary_text;
            return _context5.abrupt("break", 39);
          case 36:
            new_entry.console_text = entry.console_text;
            new_entry.summary_text = entry.summary_text;
            return _context5.abrupt("break", 39);
          case 39:
            cell_list.push(new_entry);
          case 40:
            _context5.next = 15;
            break;
          case 42:
            _context5.next = 47;
            break;
          case 44:
            _context5.prev = 44;
            _context5.t1 = _context5["catch"](13);
            _iterator.e(_context5.t1);
          case 47:
            _context5.prev = 47;
            _iterator.f();
            return _context5.finish(47);
          case 50:
            result_dict = {
              "project_name": props.project_name,
              "collection_name": collection_name,
              "save_as_collection": save_as_collection,
              "use_dark_theme": use_dark_theme,
              "presentation": true,
              "main_id": props.main_id,
              "cell_list": cell_list
            };
            _context5.next = 53;
            return (0, _communication_react.postPromise)(props.main_id, "export_as_presentation", result_dict, props.main_id);
          case 53:
            data_object = _context5.sent;
            statusFuncs.clearStatusMessage();
            if (save_as_collection) {
              statusFuncs.statusMessage("Exported presentation");
            } else {
              window.open("".concat($SCRIPT_ROOT, "/load_temp_page/").concat(data_object["temp_id"]));
            }
            _context5.next = 61;
            break;
          case 58:
            _context5.prev = 58;
            _context5.t2 = _context5["catch"](0);
            if (_context5.t2 != "canceled") {
              title = "title" in _context5.t2 ? _context5.t2.title : "Error exporting presentation";
              errorDrawerFuncs.addFromError(title, _context5.t2);
            }
          case 61:
          case "end":
            return _context5.stop();
        }
      }, _callee5, null, [[0, 58], [13, 44, 47, 50]]);
    }));
    return _exportAsPresentation2.apply(this, arguments);
  }
  function _exportAsReport() {
    return _exportAsReport2.apply(this, arguments);
  }
  function _exportAsReport2() {
    _exportAsReport2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
      var data, _yield$dialogFuncs$sh5, _yield$dialogFuncs$sh6, collapsible, include_summaries, use_dark_theme, save_as_collection, collection_name, cell_list, _iterator2, _step2, entry, new_entry, result_dict, data_object, title;
      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            _context6.next = 3;
            return (0, _communication_react.postPromise)("host", "get_collection_names", {
              "user_id": user_id
            }, props.main_id);
          case 3:
            data = _context6.sent;
            _context6.next = 6;
            return dialogFuncs.showModalPromise("ReportDialog", {
              default_value: "NewReport",
              existing_names: data.collection_names,
              handleClose: dialogFuncs.hideModal
            });
          case 6:
            _yield$dialogFuncs$sh5 = _context6.sent;
            _yield$dialogFuncs$sh6 = _slicedToArray(_yield$dialogFuncs$sh5, 5);
            collapsible = _yield$dialogFuncs$sh6[0];
            include_summaries = _yield$dialogFuncs$sh6[1];
            use_dark_theme = _yield$dialogFuncs$sh6[2];
            save_as_collection = _yield$dialogFuncs$sh6[3];
            collection_name = _yield$dialogFuncs$sh6[4];
            cell_list = [];
            _iterator2 = _createForOfIteratorHelper(props.console_items);
            _context6.prev = 15;
            _iterator2.s();
          case 17:
            if ((_step2 = _iterator2.n()).done) {
              _context6.next = 43;
              break;
            }
            entry = _step2.value;
            new_entry = {};
            new_entry.type = entry.type;
            _context6.t0 = entry.type;
            _context6.next = _context6.t0 === "text" ? 24 : _context6.t0 === "code" ? 28 : _context6.t0 === "divider" ? 32 : _context6.t0 === "figure" ? 34 : 37;
            break;
          case 24:
            new_entry.console_text = mdi.render(entry.console_text);
            new_entry.raw_text = entry.console_text;
            new_entry.summary_text = entry.summary_text;
            return _context6.abrupt("break", 40);
          case 28:
            new_entry.console_text = entry.console_text;
            new_entry.output_text = entry.output_text;
            new_entry.summary_text = entry.summary_text;
            return _context6.abrupt("break", 40);
          case 32:
            new_entry.header_text = entry.header_text;
            return _context6.abrupt("break", 40);
          case 34:
            new_entry.image_data_str = entry.image_data_str;
            new_entry.summary_text = entry.summary_text;
            return _context6.abrupt("break", 40);
          case 37:
            new_entry.console_text = entry.console_text;
            new_entry.summary_text = entry.summary_text;
            return _context6.abrupt("break", 40);
          case 40:
            cell_list.push(new_entry);
          case 41:
            _context6.next = 17;
            break;
          case 43:
            _context6.next = 48;
            break;
          case 45:
            _context6.prev = 45;
            _context6.t1 = _context6["catch"](15);
            _iterator2.e(_context6.t1);
          case 48:
            _context6.prev = 48;
            _iterator2.f();
            return _context6.finish(48);
          case 51:
            result_dict = {
              "project_name": props.project_name,
              "collection_name": collection_name,
              "save_as_collection": save_as_collection,
              "use_dark_theme": use_dark_theme,
              "collapsible": collapsible,
              "include_summaries": include_summaries,
              "main_id": props.main_id,
              "cell_list": cell_list
            };
            _context6.next = 54;
            return (0, _communication_react.postPromise)(props.main_id, "export_as_report", result_dict, props.main_id);
          case 54:
            data_object = _context6.sent;
            statusFuncs.clearStatusMessage();
            if (save_as_collection) {
              data_object.alert_type = "alert-success";
              data_object.timeout = 2000;
              statusFuncs.statusMessage("Exported report");
            } else {
              window.open("".concat($SCRIPT_ROOT, "/load_temp_page/").concat(data_object["temp_id"]));
            }
            _context6.next = 63;
            break;
          case 59:
            _context6.prev = 59;
            _context6.t2 = _context6["catch"](0);
            if (_context6.t2 != "canceled") {
              title = "title" in _context6.t2 ? _context6.t2.title : "Error exporting report";
              errorDrawerFuncs.addFromError(title, _context6.t2);
            }
            statusFuncs.clearStatusMessage();
          case 63:
          case "end":
            return _context6.stop();
        }
      }, _callee6, null, [[0, 59], [15, 45, 48, 51]]);
    }));
    return _exportAsReport2.apply(this, arguments);
  }
  function _exportAsJupyter() {
    return _exportAsJupyter2.apply(this, arguments);
  }
  function _exportAsJupyter2() {
    _exportAsJupyter2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7() {
      var data, new_name, cell_list, _iterator3, _step3, entry, new_cell, result_dict, data_object, title;
      return _regeneratorRuntime().wrap(function _callee7$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
          case 0:
            statusFuncs.startSpinner();
            _context7.prev = 1;
            _context7.next = 4;
            return (0, _communication_react.postPromise)("host", "get_project_names", {
              "user_id": user_id
            }, props.main_id);
          case 4:
            data = _context7.sent;
            _context7.next = 7;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Export Notebook in Jupyter Format",
              field_title: "New Project Name",
              default_value: "NewJupyter",
              existing_names: data.project_names,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 7:
            new_name = _context7.sent;
            cell_list = [];
            _iterator3 = _createForOfIteratorHelper(props.console_items);
            _context7.prev = 10;
            _iterator3.s();
          case 12:
            if ((_step3 = _iterator3.n()).done) {
              _context7.next = 21;
              break;
            }
            entry = _step3.value;
            if (!(entry.type == "section-end")) {
              _context7.next = 16;
              break;
            }
            return _context7.abrupt("continue", 19);
          case 16:
            new_cell = {};
            if (entry.type == "divider") {
              new_cell.cell_type = "markdown";
              new_cell.source = "# " + entry.header_text;
            } else {
              new_cell.source = entry.console_text;
              new_cell.cell_type = entry.type == "code" ? "code" : "markdown";
              if (entry.type == "code") {
                new_cell.outputs = [];
              }
            }
            cell_list.push(new_cell);
          case 19:
            _context7.next = 12;
            break;
          case 21:
            _context7.next = 26;
            break;
          case 23:
            _context7.prev = 23;
            _context7.t0 = _context7["catch"](10);
            _iterator3.e(_context7.t0);
          case 26:
            _context7.prev = 26;
            _iterator3.f();
            return _context7.finish(26);
          case 29:
            result_dict = {
              "project_name": new_name,
              "main_id": props.main_id,
              "cell_list": cell_list
            };
            _context7.next = 32;
            return (0, _communication_react.postPromise)(props.main_id, "export_to_jupyter_notebook", result_dict, props.main_id);
          case 32:
            data_object = _context7.sent;
            statusFuncs.statusMessage("Exported jupyter notebook");
            statusFuncs.stopSpinner();
            _context7.next = 42;
            break;
          case 37:
            _context7.prev = 37;
            _context7.t1 = _context7["catch"](1);
            if (_context7.t1 != "canceled") {
              title = "title" in _context7.t1 ? _context7.t1.title : "Error exporting as Jupyter notebook";
              errorDrawerFuncs.addFromError(title, _context7.t1);
            }
            statusFuncs.clearStatusMessage();
            statusFuncs.stopSpinner();
          case 42:
          case "end":
            return _context7.stop();
        }
      }, _callee7, null, [[1, 37], [10, 23, 26, 29]]);
    }));
    return _exportAsJupyter2.apply(this, arguments);
  }
  function _exportDataTable() {
    return _exportDataTable2.apply(this, arguments);
  }
  function _exportDataTable2() {
    _exportDataTable2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8() {
      var data, new_name, result_dict;
      return _regeneratorRuntime().wrap(function _callee8$(_context8) {
        while (1) switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            _context8.next = 3;
            return (0, _communication_react.postPromise)("host", "get_collection_names", {
              "user_id": user_id
            });
          case 3:
            data = _context8.sent;
            _context8.next = 6;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Export Data",
              field_title: "New Collection NameName",
              default_value: "new collection",
              existing_names: data.collection_names,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 6:
            new_name = _context8.sent;
            result_dict = {
              "export_name": new_name,
              "main_id": props.main_id,
              "user_id": window.user_id
            };
            _context8.next = 10;
            return (0, _communication_react.postAjaxPromise)("export_data", result_dict);
          case 10:
            statusFuncs.statusMessage("Exported table as collection");
            _context8.next = 16;
            break;
          case 13:
            _context8.prev = 13;
            _context8.t0 = _context8["catch"](0);
            if (_context8.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error exporting table", _context8.t0);
            }
          case 16:
          case "end":
            return _context8.stop();
        }
      }, _callee8, null, [[0, 13]]);
    }));
    return _exportDataTable2.apply(this, arguments);
  }
  function _consoleToNotebook() {
    return _consoleToNotebook2.apply(this, arguments);
  }
  function _consoleToNotebook2() {
    _consoleToNotebook2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9() {
      var result_dict;
      return _regeneratorRuntime().wrap(function _callee9$(_context9) {
        while (1) switch (_context9.prev = _context9.next) {
          case 0:
            _context9.prev = 0;
            result_dict = {
              "main_id": props.main_id,
              "console_items": props.console_items,
              "user_id": window.user_id
            };
            _context9.next = 4;
            return (0, _communication_react.postPromise)(props.main_id, "console_to_notebook", result_dict, props.main_id);
          case 4:
            _context9.next = 9;
            break;
          case 6:
            _context9.prev = 6;
            _context9.t0 = _context9["catch"](0);
            errorDrawerFuncs.addFromError("Error converting to notebook", _context9.t0);
          case 9:
          case "end":
            return _context9.stop();
        }
      }, _callee9, null, [[0, 6]]);
    }));
    return _consoleToNotebook2.apply(this, arguments);
  }
  function menu_items() {
    var cc_name;
    var cc_icon;
    if (props.mState.doc_type == "none") {
      cc_name = "Add Collection";
      cc_icon = "add";
    } else {
      cc_name = "Change Collection";
      cc_icon = "exchange";
    }
    var items = [{
      name_text: "Save As...",
      icon_name: "floppy-disk",
      click_handler: _saveProjectAs
    }, {
      name_text: "Save",
      icon_name: "saved",
      click_handler: function () {
        var _click_handler = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
          return _regeneratorRuntime().wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _saveProject(false);
              case 2:
              case "end":
                return _context.stop();
            }
          }, _callee);
        }));
        function click_handler() {
          return _click_handler.apply(this, arguments);
        }
        return click_handler;
      }()
    }, {
      name_text: "Save Lite",
      icon_name: "saved",
      click_handler: function () {
        var _click_handler2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
          return _regeneratorRuntime().wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _saveProject(true);
              case 2:
              case "end":
                return _context2.stop();
            }
          }, _callee2);
        }));
        function click_handler() {
          return _click_handler2.apply(this, arguments);
        }
        return click_handler;
      }()
    }, {
      name_text: "divider1",
      icon_name: null,
      click_handler: "divider"
    }, {
      name_text: "Export as Jupyter Notebook",
      icon_name: "export",
      click_handler: _exportAsJupyter
    }, {
      name_text: "Create Report From Notebook",
      icon_name: "document",
      click_handler: _exportAsReport
    }, {
      name_text: "Create Presentation from Notebook",
      icon_name: "presentation",
      click_handler: _exportAsPresentation
    }, {
      name_text: "Export Table as Collection",
      icon_name: "export",
      click_handler: _exportDataTable
    }, {
      name_text: "Open Console as Notebook",
      icon_name: "console",
      click_handler: _consoleToNotebook
    }, {
      name_text: "divider2",
      icon_name: null,
      click_handler: "divider"
    }, {
      name_text: cc_name,
      icon_name: cc_icon,
      click_handler: props.changeCollection
    }, {
      name_text: "Remove Collection",
      icon_name: "cross-circle",
      click_handler: props.removeCollection
    }];
    var reduced_items = [];
    for (var _i = 0, _items = items; _i < _items.length; _i++) {
      var item = _items[_i];
      if (!props.hidden_items.includes(item.name_text)) {
        reduced_items.push(item);
      }
    }
    return reduced_items;
  }
  return /*#__PURE__*/_react["default"].createElement(_menu_utilities.ToolMenu, {
    menu_name: "Project",
    menu_items: menu_items(),
    binding_dict: {},
    disabled_items: props.disabled_items,
    disable_all: false
  });
}
exports.ProjectMenu = ProjectMenu = /*#__PURE__*/(0, _react.memo)(ProjectMenu);
function DocumentMenu(props) {
  props = _objectSpread({
    disabled_items: []
  }, props);
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  var statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  function _newDocument() {
    return _newDocument2.apply(this, arguments);
  }
  function _newDocument2() {
    _newDocument2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee0() {
      var new_name;
      return _regeneratorRuntime().wrap(function _callee0$(_context0) {
        while (1) switch (_context0.prev = _context0.next) {
          case 0:
            _context0.prev = 0;
            statusFuncs.startSpinner();
            _context0.next = 4;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "New Document",
              field_title: "New Document Name",
              default_value: props.currentDoc,
              existing_names: props.documentNames,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 4:
            new_name = _context0.sent;
            _context0.next = 7;
            return (0, _communication_react.postPromise)(props.main_id, "new_blank_document", {
              model_document_name: props.currentDoc,
              new_document_name: new_name
            }, props.main_id);
          case 7:
            statusFuncs.stopSpinner();
            _context0.next = 14;
            break;
          case 10:
            _context0.prev = 10;
            _context0.t0 = _context0["catch"](0);
            if (_context0.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error adding new document", _context0.t0);
            }
            statusFuncs.stopSpinner();
          case 14:
          case "end":
            return _context0.stop();
        }
      }, _callee0, null, [[0, 10]]);
    }));
    return _newDocument2.apply(this, arguments);
  }
  function _duplicateDocument() {
    return _duplicateDocument2.apply(this, arguments);
  }
  function _duplicateDocument2() {
    _duplicateDocument2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee1() {
      var new_name;
      return _regeneratorRuntime().wrap(function _callee1$(_context1) {
        while (1) switch (_context1.prev = _context1.next) {
          case 0:
            _context1.prev = 0;
            statusFuncs.startSpinner();
            _context1.next = 4;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Duplicate Document",
              field_title: "New Document Name",
              default_value: props.currentDoc,
              existing_names: props.documentNames,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 4:
            new_name = _context1.sent;
            _context1.next = 7;
            return (0, _communication_react.postPromise)(props.main_id, "duplicate_document", {
              original_document_name: props.currentDoc,
              new_document_name: new_name
            }, props.main_id);
          case 7:
            statusFuncs.stopSpinner();
            _context1.next = 14;
            break;
          case 10:
            _context1.prev = 10;
            _context1.t0 = _context1["catch"](0);
            if (_context1.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error duplicating document", _context1.t0);
            }
            statusFuncs.stopSpinner();
          case 14:
          case "end":
            return _context1.stop();
        }
      }, _callee1, null, [[0, 10]]);
    }));
    return _duplicateDocument2.apply(this, arguments);
  }
  function _renameDocument() {
    return _renameDocument2.apply(this, arguments);
  }
  function _renameDocument2() {
    _renameDocument2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee10() {
      var new_name;
      return _regeneratorRuntime().wrap(function _callee10$(_context10) {
        while (1) switch (_context10.prev = _context10.next) {
          case 0:
            _context10.prev = 0;
            statusFuncs.startSpinner();
            _context10.next = 4;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Rename Document",
              field_title: "New Document Name",
              default_value: props.currentDoc,
              existing_names: props.documentNames,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 4:
            new_name = _context10.sent;
            _context10.next = 7;
            return (0, _communication_react.postPromise)(props.main_id, "rename_document", {
              old_document_name: props.currentDoc,
              new_document_name: new_name
            }, props.main_id);
          case 7:
            statusFuncs.stopSpinner();
            _context10.next = 14;
            break;
          case 10:
            _context10.prev = 10;
            _context10.t0 = _context10["catch"](0);
            if (_context10.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error renaming document", _context10.t0);
            }
            statusFuncs.stopSpinner();
          case 14:
          case "end":
            return _context10.stop();
        }
      }, _callee10, null, [[0, 10]]);
    }));
    return _renameDocument2.apply(this, arguments);
  }
  var option_dict = {
    "New": _newDocument,
    "Duplicate": _duplicateDocument,
    "Rename": _renameDocument
  };
  var icon_dict = {
    "New": "document",
    "Duplicate": "duplicate",
    "Rename": "edit"
  };
  return /*#__PURE__*/_react["default"].createElement(_menu_utilities.MenuComponent, {
    menu_name: "Document",
    option_dict: option_dict,
    icon_dict: icon_dict,
    binding_dict: {},
    disabled_items: props.disabled_items,
    hidden_items: []
  });
}
exports.DocumentMenu = DocumentMenu = /*#__PURE__*/(0, _react.memo)(DocumentMenu);
function ColumnMenu(props) {
  props = _objectSpread({
    disabled_items: []
  }, props);
  function _shift_column_left() {
    var cnum = props.filtered_column_names.indexOf(props.selected_column);
    if (cnum == 0) return;
    var target_col = props.filtered_column_names[cnum - 1];
    props.moveColumn(props.selected_column, target_col);
  }
  function _shift_column_to_start() {
    var cnum = props.filtered_column_names.indexOf(props.selected_column);
    if (cnum == 0) return;
    var target_col = props.filtered_column_names[0];
    props.moveColumn(props.selected_column, target_col);
  }
  function _shift_column_right() {
    var cnum = props.table_spec.column_names.indexOf(props.selected_column);
    if (cnum == props.table_spec.column_names.length - 1) return;
    var target_col = props.table_spec.column_names[cnum + 2];
    props.moveColumn(props.selected_column, target_col);
  }
  function _shift_column_to_end() {
    var cnum = props.table_spec.column_names.indexOf(props.selected_column);
    if (cnum == props.table_spec.column_names.length - 1) return;
    props.moveColumn(props.selected_column, null);
  }
  var option_dict = {
    "Shift Left": _shift_column_left,
    "Shift Right": _shift_column_right,
    "Shift to Start": _shift_column_to_start,
    "Shift to End": _shift_column_to_end,
    "divider1": "divider",
    "Hide": props.hideColumn,
    "Hide in All Docs": props.hideInAll,
    "Unhide All": props.unhideAllColumns,
    "divider2": "divider",
    "Add Column": function Add_Column() {
      return props.addColumn(false);
    },
    "Add Column In All Docs": function Add_Column_In_All_Docs() {
      return props.addColumn(true);
    },
    "Delete Column": function Delete_Column() {
      return props.deleteColumn(false);
    },
    "Delete Column In All Docs": function Delete_Column_In_All_Docs() {
      return props.deleteColumn(true);
    }
  };
  var icon_dict = {
    "Shift Left": "direction-left",
    "Shift Right": "direction-right",
    "Shift to Start": "double-chevron-left",
    "Shift to End": "double-chevron-right",
    "Hide": "eye-off",
    "Hide in All Docs": "eye-off",
    "Unhide All": "eye-on",
    "Add Column": "add-column-right",
    "Add Column In All Docs": "add-column-right",
    "Delete Column": "remove-column",
    "Delete Column In All Docs": "remove-column"
  };
  return /*#__PURE__*/_react["default"].createElement(_menu_utilities.MenuComponent, {
    menu_name: "Column",
    option_dict: option_dict,
    icon_dict: icon_dict,
    binding_dict: {},
    disabled_items: props.disabled_items,
    hidden_items: []
  });
}
ColumnMenu.propTypes = {
  moveColumn: _propTypes["default"].func,
  table_spec: _propTypes["default"].object,
  filtered_column_names: _propTypes["default"].array,
  selected_column: _propTypes["default"].string,
  hideColumn: _propTypes["default"].func,
  hideInAll: _propTypes["default"].func,
  unhideAllColumns: _propTypes["default"].func,
  addColumn: _propTypes["default"].func,
  deleteColumn: _propTypes["default"].func,
  disabled_items: _propTypes["default"].array
};
exports.ColumnMenu = ColumnMenu = /*#__PURE__*/(0, _react.memo)(ColumnMenu);
function RowMenu(props) {
  props = _objectSpread({
    disabled_items: []
  }, props);
  var option_dict = {
    "Insert Row Before": props.insertRowBefore,
    "Insert Row After": props.insertRowAfter,
    "Duplicate Row": props.duplicateRow,
    "Delete Row": props.deleteRow
  };
  var icon_dict = {
    "Insert Row Before": "add-row-top",
    "Insert Row After": "add-row-bottom",
    "Duplicate Row": "add-row-bottom",
    "Delete Row": "remove-row-bottom"
  };
  return /*#__PURE__*/_react["default"].createElement(_menu_utilities.MenuComponent, {
    menu_name: "Row",
    option_dict: option_dict,
    icon_dict: icon_dict,
    binding_dict: {},
    disabled_items: props.disabled_items,
    hidden_items: []
  });
}
exports.RowMenu = RowMenu = /*#__PURE__*/(0, _react.memo)(RowMenu);
function ViewMenu(props) {
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  function _shift_column_left() {
    var cnum = props.table_spec.column_names.indexOf(props.selected_column);
    if (cnum == 0) return;
    var target_col = props.table_spec.column_names[cnum - 1];
    _moveColumn(props.selected_column, target_col);
  }
  function _shift_column_right() {
    var cnum = props.table_spec.column_names.indexOf(props.selected_column);
    if (cnum == props.table_spec.column_names.length - 1) return;
    var target_col = props.table_spec.column_names[cnum + 2];
    _moveColumn(props.selected_column, target_col);
  }
  function _toggleExports() {
    props.setMainStateValue("show_exports_pane", !props.show_exports_pane);
  }
  function _toggleConsole() {
    props.setMainStateValue("show_console_pane", !props.show_console_pane);
  }
  function _toggleMetadata() {
    props.setMainStateValue("show_metadata", !props.show_metadata);
  }
  function option_dict() {
    var result = {};
    if (!props.is_notebook) {
      if (props.toggleTableShrink) {
        var table_opt_name = props.table_is_shrunk ? "Maximize Table" : "Minimize Table";
        result[table_opt_name] = props.toggleTableShrink;
        result["divider1"] = "divider";
      }
      var console_opt_name = props.show_console_pane ? "Hide Log" : "Show Log";
      result[console_opt_name] = _toggleConsole;
    }
    var exports_opt_name = props.show_exports_pane ? "Hide Exports" : "Show Exports";
    result[exports_opt_name] = _toggleExports;
    result["divider2"] = "divider";
    result["Show Error Drawer"] = errorDrawerFuncs.openErrorDrawer;
    result["Show Metadata"] = _toggleMetadata;
    return result;
  }
  function icon_dict() {
    var result = {};
    if (!props.is_notebook) {
      if (props.toggleTableShrink) {
        var opt_name = props.table_is_shrunk ? "Maximize Table" : "Minimize Table";
        result[opt_name] = props.table_is_shrunk ? "maximize" : "minimize";
      }
      var console_opt_name = props.show_console_pane ? "Hide Log" : "Show Log";
      result[console_opt_name] = "code";
    }
    var exports_opt_name = props.show_exports_pane ? "Hide Exports" : "Show Exports";
    result[exports_opt_name] = "variable";
    result["Show Error Drawer"] = "panel-stats";
    result["Show Metadata"] = "panel-stats";
    return result;
  }
  return /*#__PURE__*/_react["default"].createElement(_menu_utilities.MenuComponent, {
    menu_name: "View",
    option_dict: option_dict(),
    icon_dict: icon_dict(),
    disabled_items: [],
    binding_dict: {},
    disable_all: props.disable_all,
    hidden_items: []
  });
}
ViewMenu.propTypes = {
  table_is_shrunk: _propTypes["default"].bool,
  toggleTableShrink: _propTypes["default"].func,
  openErrorDrawer: _propTypes["default"].func,
  show_exports_pane: _propTypes["default"].bool,
  show_console_pane: _propTypes["default"].bool,
  setMainStateValue: _propTypes["default"].func
};
exports.ViewMenu = ViewMenu = /*#__PURE__*/(0, _react.memo)(ViewMenu);
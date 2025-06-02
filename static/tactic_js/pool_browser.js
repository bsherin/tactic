"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PoolBrowser = PoolBrowser;
var _react = _interopRequireWildcard(require("react"));
var _core = require("@blueprintjs/core");
var _utilities_react = require("./utilities_react");
var _library_menubars = require("./library_menubars");
var _blueprint_mdata_fields = require("./blueprint_mdata_fields");
var _pool_tree = require("./pool_tree");
var _resizing_layouts = require("./resizing_layouts2");
var _communication_react = require("./communication_react");
var _error_drawer = require("./error_drawer");
var _sizing_tools = require("./sizing_tools");
var _toaster = require("./toaster");
var _settings = require("./settings");
var _modal_react = require("./modal_react");
var _library_home_react = require("./library_home_react");
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
var pool_browser_id = (0, _utilities_react.guid)();
function PoolBrowser(props) {
  var top_ref = (0, _react.useRef)(null);
  var resizing = (0, _react.useRef)(false);
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)({
      name: "",
      tags: "",
      notes: "",
      updated: "",
      created: "",
      size: "",
      res_type: null
    }),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    selected_resource = _useStateAndRef2[0],
    set_selected_resource = _useStateAndRef2[1],
    selected_resource_ref = _useStateAndRef2[2];
  var _useStateAndRef3 = (0, _utilities_react.useStateAndRef)("/mydisk"),
    _useStateAndRef4 = _slicedToArray(_useStateAndRef3, 3),
    currentRootPath = _useStateAndRef4[0],
    setCurrentRootPath = _useStateAndRef4[1],
    currentRootPathRef = _useStateAndRef4[2];
  var _useStateAndRef5 = (0, _utilities_react.useStateAndRef)(null),
    _useStateAndRef6 = _slicedToArray(_useStateAndRef5, 3),
    value = _useStateAndRef6[0],
    setValue = _useStateAndRef6[1],
    valueRef = _useStateAndRef6[2];
  var _useStateAndRef7 = (0, _utilities_react.useStateAndRef)(null),
    _useStateAndRef8 = _slicedToArray(_useStateAndRef7, 3),
    selectedNode = _useStateAndRef8[0],
    setSelectedNode = _useStateAndRef8[1],
    selectedNodeRef = _useStateAndRef8[2];
  var _useStateAndRef9 = (0, _utilities_react.useStateAndRef)(false),
    _useStateAndRef0 = _slicedToArray(_useStateAndRef9, 3),
    multi_select = _useStateAndRef0[0],
    set_multi_select = _useStateAndRef0[1],
    multi_select_ref = _useStateAndRef0[2];
  var _useStateAndRef1 = (0, _utilities_react.useStateAndRef)([]),
    _useStateAndRef10 = _slicedToArray(_useStateAndRef1, 3),
    list_of_selected = _useStateAndRef10[0],
    set_list_of_selected = _useStateAndRef10[1],
    list_of_selected_ref = _useStateAndRef10[2];
  var _useState = (0, _react.useState)([]),
    _useState2 = _slicedToArray(_useState, 2),
    contextMenuItems = _useState2[0],
    setContextMenuItems = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = _slicedToArray(_useState3, 2),
    have_activated = _useState4[0],
    set_have_activated = _useState4[1];
  var _useState5 = (0, _react.useState)(false),
    _useState6 = _slicedToArray(_useState5, 2),
    showHidden = _useState6[0],
    setShowHidden = _useState6[1];
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  var statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  var _useSize = (0, _sizing_tools.useSize)(top_ref, 0, "pool_browser"),
    _useSize2 = _slicedToArray(_useSize, 4),
    usable_width = _useSize2[0],
    usable_height = _useSize2[1],
    topX = _useSize2[2],
    topY = _useSize2[3];
  var treeRefreshFunc = (0, _react.useRef)(null);
  // Important note: The first mounting of the pool tree must happen after the pool pane
  // is first activated. Otherwise, I do GetPoolTree before everything is ready and I don't
  // get the callback for the post.

  (0, _react.useEffect)(function () {
    if (props.am_selected && !have_activated) {
      set_have_activated(true);
    }
  }, [props.am_selected]);
  (0, _react.useEffect)(function () {
    if (selectedNodeRef.current) {
      set_selected_resource({
        name: (0, _pool_tree.getBasename)(value),
        tags: "",
        notes: "",
        updated: selectedNodeRef.current.updated,
        created: selectedNodeRef.current.created,
        size: String(selectedNodeRef.current.size),
        res_type: selectedNodeRef.current.isDirectory ? "poolDir" : "poolFile"
      });
    } else {
      set_selected_resource({
        name: "",
        tags: "",
        notes: "",
        updated: "",
        created: "",
        res_type: null
      });
    }
  }, [value]);
  function handlePoolEvent() {}
  function sendNewCell(_x, _x2, _x3) {
    return _sendNewCell.apply(this, arguments);
  }
  function _sendNewCell() {
    _sendNewCell = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee13(path, main_id, read_as_dataframe) {
      var ext, code;
      return _regeneratorRuntime().wrap(function _callee13$(_context13) {
        while (1) switch (_context13.prev = _context13.next) {
          case 0:
            ext = (0, _utilities_react.getFileExtension)(path);
            code = "";
            if (read_as_dataframe) {
              if (ext === "csv") {
                code = "import pandas as pd\ndf = pd.read_csv(\"".concat(path, "\")");
              } else if (ext === "parquet") {
                code = "import pandas as pd\ndf = pd.read_parquet(\"".concat(path, "\")");
              } else {
                code = "import pandas as pd\ndf = pd.read_pickle(\"".concat(path, "\")");
              }
            } else {
              if (ext == "pkl") {
                code = "import pickle\nwith open(\"".concat(path, "\", \"rb\") as f:\n    data = pickle.load(f)");
              } else {
                code = "with open(\"".concat(path, "\") as f:\n    txt = f.read()");
              }
            }
            _context13.next = 5;
            return (0, _communication_react.postPromise)("host", "print_code_area_to_console", {
              "console_text": code,
              "user_id": window.user_id,
              "main_id": main_id
            }, props.main_id);
          case 5:
          case "end":
            return _context13.stop();
        }
      }, _callee13);
    }));
    return _sendNewCell.apply(this, arguments);
  }
  function openInNotebook() {
    return _openInNotebook.apply(this, arguments);
  }
  function _openInNotebook() {
    _openInNotebook = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee15() {
      var node,
        path,
        openResources,
        open_projects,
        open_projects_dict,
        requireNewNotebook,
        _iterator,
        _step,
        entry,
        _yield$dialogFuncs$sh,
        _yield$dialogFuncs$sh2,
        selectedResource,
        checkResults,
        data,
        _args15 = arguments;
      return _regeneratorRuntime().wrap(function _callee15$(_context15) {
        while (1) switch (_context15.prev = _context15.next) {
          case 0:
            node = _args15.length > 0 && _args15[0] !== undefined ? _args15[0] : null;
            if (!(!valueRef.current && !node)) {
              _context15.next = 3;
              break;
            }
            return _context15.abrupt("return");
          case 3:
            _context15.prev = 3;
            path = node && "isDirectory" in node ? node.fullpath : valueRef.current;
            if (!node.isDirectory) {
              _context15.next = 7;
              break;
            }
            return _context15.abrupt("return");
          case 7:
            openResources = props.getOpenResources();
            open_projects = [];
            open_projects_dict = {};
            if (openResources.length === 0) {
              requireNewNotebook = true;
            } else {
              requireNewNotebook = false;
              _iterator = _createForOfIteratorHelper(openResources);
              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  entry = _step.value;
                  if (entry.res_type === "project" || entry.res_type === "collection") {
                    open_projects.push(entry.resource_name);
                    open_projects_dict[entry.resource_name] = entry;
                  }
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }
            }
            _context15.next = 13;
            return dialogFuncs.showModalPromise("SelectDialog", {
              title: "Open resources in notebook",
              checkboxes: [{
                "checkname": "create_new_notebook",
                "checktext": "Create new notebook",
                "checked": requireNewNotebook,
                "disabled": requireNewNotebook
              }, {
                "checkname": "read_as_dataframe",
                "checktext": "Read as dataframe",
                "checked": false
              }],
              select_label: "Project",
              cancel_text: "Cancel",
              submit_text: "Open",
              option_list: open_projects,
              handleClose: dialogFuncs.hideModal
            });
          case 13:
            _yield$dialogFuncs$sh = _context15.sent;
            _yield$dialogFuncs$sh2 = _slicedToArray(_yield$dialogFuncs$sh, 2);
            selectedResource = _yield$dialogFuncs$sh2[0];
            checkResults = _yield$dialogFuncs$sh2[1];
            if (!checkResults["create_new_notebook"]) {
              _context15.next = 24;
              break;
            }
            _context15.next = 20;
            return (0, _communication_react.postAjaxPromise)("new_notebook_in_context", {});
          case 20:
            data = _context15.sent;
            if (data.success) {
              props.handleCreateViewer(data, /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee14() {
                return _regeneratorRuntime().wrap(function _callee14$(_context14) {
                  while (1) switch (_context14.prev = _context14.next) {
                    case 0:
                      _context14.next = 2;
                      return sendNewCell(path, data.main_id, checkResults["read_as_dataframe"]);
                    case 2:
                      return _context14.abrupt("return", _context14.sent);
                    case 3:
                    case "end":
                      return _context14.stop();
                  }
                }, _callee14);
              })));
            } else {
              errorDrawerFuncs.addErrorDrawerEntry({
                title: "Error opening in notebook",
                content: "message" in data ? data.message : ""
              });
            }
            _context15.next = 27;
            break;
          case 24:
            props.setSelectedTabId(open_projects_dict[selectedResource].id);
            _context15.next = 27;
            return sendNewCell(path, open_projects_dict[selectedResource].main_id, checkResults["read_as_dataframe"]);
          case 27:
            _context15.next = 32;
            break;
          case 29:
            _context15.prev = 29;
            _context15.t0 = _context15["catch"](3);
            errorDrawerFuncs.addFromError("Error opening in notebook", _context15.t0);
          case 32:
          case "end":
            return _context15.stop();
        }
      }, _callee15, null, [[3, 29]]);
    }));
    return _openInNotebook.apply(this, arguments);
  }
  function viewTextFile() {
    return _viewTextFile.apply(this, arguments);
  }
  function _viewTextFile() {
    _viewTextFile = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee16() {
      var node,
        data,
        path,
        _args16 = arguments;
      return _regeneratorRuntime().wrap(function _callee16$(_context16) {
        while (1) switch (_context16.prev = _context16.next) {
          case 0:
            node = _args16.length > 0 && _args16[0] !== undefined ? _args16[0] : null;
            if (!(!valueRef.current && !node)) {
              _context16.next = 3;
              break;
            }
            return _context16.abrupt("return");
          case 3:
            _context16.prev = 3;
            path = node && "isDirectory" in node ? node.fullpath : valueRef.current;
            if (!node.isDirectory) {
              _context16.next = 7;
              break;
            }
            return _context16.abrupt("return");
          case 7:
            _context16.next = 9;
            return (0, _communication_react.postAjaxPromise)("view_text_in_context", {
              context_id: context_id,
              file_path: path
            });
          case 9:
            data = _context16.sent;
            if (data.success) {
              props.handleCreateViewer(data);
            } else {
              errorDrawerFuncs.addErrorDrawerEntry({
                title: "Error viewing text file",
                content: "message" in data ? data.message : ""
              });
            }
            _context16.next = 16;
            break;
          case 13:
            _context16.prev = 13;
            _context16.t0 = _context16["catch"](3);
            errorDrawerFuncs.addFromError("Error viewing text file", _context16.t0);
          case 16:
          case "end":
            return _context16.stop();
        }
      }, _callee16, null, [[3, 13]]);
    }));
    return _viewTextFile.apply(this, arguments);
  }
  function _copy_func() {
    var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    if (!valueRef.current && !node) return;
    var path = node && "isDirectory" in node ? node.fullpath : valueRef.current;
    (0, _utilities_react.copyToClipboard)(path);
  }
  function _rename_func() {
    return _rename_func2.apply(this, arguments);
  }
  function _rename_func2() {
    _rename_func2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee17() {
      var node,
        path,
        new_name,
        the_data,
        _args17 = arguments;
      return _regeneratorRuntime().wrap(function _callee17$(_context17) {
        while (1) switch (_context17.prev = _context17.next) {
          case 0:
            node = _args17.length > 0 && _args17[0] !== undefined ? _args17[0] : null;
            if (!(!valueRef.current && !node)) {
              _context17.next = 3;
              break;
            }
            return _context17.abrupt("return");
          case 3:
            _context17.prev = 3;
            path = node && "isDirectory" in node ? node.fullpath : valueRef.current;
            _context17.next = 7;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Rename Pool Resource",
              field_title: "New Name",
              default_value: (0, _pool_tree.getBasename)(path),
              existing_names: [],
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 7:
            new_name = _context17.sent;
            the_data = {
              new_name: new_name,
              old_path: path
            };
            _context17.next = 11;
            return (0, _communication_react.postAjaxPromise)("rename_pool_resource", the_data);
          case 11:
            _context17.next = 17;
            break;
          case 13:
            _context17.prev = 13;
            _context17.t0 = _context17["catch"](3);
            if (_context17.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error renaming", _context17.t0);
            }
            return _context17.abrupt("return");
          case 17:
          case "end":
            return _context17.stop();
        }
      }, _callee17, null, [[3, 13]]);
    }));
    return _rename_func2.apply(this, arguments);
  }
  function _add_directory() {
    return _add_directory2.apply(this, arguments);
  }
  function _add_directory2() {
    _add_directory2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee18() {
      var node,
        sNode,
        initial_address,
        full_path,
        the_data,
        _args18 = arguments;
      return _regeneratorRuntime().wrap(function _callee18$(_context18) {
        while (1) switch (_context18.prev = _context18.next) {
          case 0:
            node = _args18.length > 0 && _args18[0] !== undefined ? _args18[0] : null;
            if (!(!valueRef.current && !node)) {
              _context18.next = 3;
              break;
            }
            return _context18.abrupt("return");
          case 3:
            _context18.prev = 3;
            sNode = node && "isDirectory" in node ? node : selectedNodeRef.current;
            if (sNode.isDirectory) {
              initial_address = sNode.fullpath;
            } else {
              initial_address = (0, _pool_tree.getFileParentPath)(sNode.fullpath);
            }
            _context18.next = 8;
            return dialogFuncs.showModalPromise("SelectAddressDialog", {
              title: "Add a Pool Directory",
              selectType: "folder",
              initial_address: initial_address,
              initial_name: "New Directory",
              showName: true,
              handleClose: dialogFuncs.hideModal
            });
          case 8:
            full_path = _context18.sent;
            the_data = {
              full_path: full_path
            };
            _context18.next = 12;
            return (0, _communication_react.postAjaxPromise)("create_pool_directory", the_data);
          case 12:
            _context18.next = 18;
            break;
          case 14:
            _context18.prev = 14;
            _context18.t0 = _context18["catch"](3);
            if (_context18.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error adding directory", _context18.t0);
            }
            return _context18.abrupt("return");
          case 18:
          case "end":
            return _context18.stop();
        }
      }, _callee18, null, [[3, 14]]);
    }));
    return _add_directory2.apply(this, arguments);
  }
  function _duplicate_file() {
    return _duplicate_file2.apply(this, arguments);
  }
  function _duplicate_file2() {
    _duplicate_file2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee19() {
      var node,
        sNode,
        src,
        _splitFilePath,
        _splitFilePath2,
        initial_address,
        initial_name,
        dst,
        the_data,
        _args19 = arguments;
      return _regeneratorRuntime().wrap(function _callee19$(_context19) {
        while (1) switch (_context19.prev = _context19.next) {
          case 0:
            node = _args19.length > 0 && _args19[0] !== undefined ? _args19[0] : null;
            if (!(!valueRef.current && !node)) {
              _context19.next = 3;
              break;
            }
            return _context19.abrupt("return");
          case 3:
            _context19.prev = 3;
            sNode = node && "isDirectory" in node ? node : selectedNodeRef.current;
            if (!sNode.isDirectory) {
              _context19.next = 8;
              break;
            }
            (0, _toaster.doFlash)("You can't duplicate a directory");
            return _context19.abrupt("return");
          case 8:
            src = sNode.fullpath;
            _splitFilePath = (0, _pool_tree.splitFilePath)(sNode.fullpath), _splitFilePath2 = _slicedToArray(_splitFilePath, 2), initial_address = _splitFilePath2[0], initial_name = _splitFilePath2[1];
            _context19.next = 12;
            return dialogFuncs.showModalPromise("SelectAddressDialog", {
              title: "Duplicate a file",
              selectType: "folder",
              initial_address: initial_address,
              initial_name: initial_name,
              showName: true,
              handleClose: dialogFuncs.hideModal
            });
          case 12:
            dst = _context19.sent;
            the_data = {
              dst: dst,
              src: src
            };
            _context19.next = 16;
            return (0, _communication_react.postAjaxPromise)("duplicate_pool_file", the_data);
          case 16:
            _context19.next = 22;
            break;
          case 18:
            _context19.prev = 18;
            _context19.t0 = _context19["catch"](3);
            if (_context19.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error duplicating file", _context19.t0);
            }
            return _context19.abrupt("return");
          case 22:
          case "end":
            return _context19.stop();
        }
      }, _callee19, null, [[3, 18]]);
    }));
    return _duplicate_file2.apply(this, arguments);
  }
  function _compress_file() {
    return _compress_file2.apply(this, arguments);
  }
  function _compress_file2() {
    _compress_file2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee20() {
      var node,
        sNode,
        src,
        _args20 = arguments;
      return _regeneratorRuntime().wrap(function _callee20$(_context20) {
        while (1) switch (_context20.prev = _context20.next) {
          case 0:
            node = _args20.length > 0 && _args20[0] !== undefined ? _args20[0] : null;
            if (!(!valueRef.current && !node)) {
              _context20.next = 3;
              break;
            }
            return _context20.abrupt("return");
          case 3:
            _context20.prev = 3;
            sNode = node && "isDirectory" in node ? node : selectedNodeRef.current;
            src = sNode.fullpath;
            _context20.next = 8;
            return (0, _communication_react.postPromise)("host", "compress_pool_resource", {
              full_path: sNode.fullpath,
              force_forward: true,
              user_id: window.user_id
            });
          case 8:
            _context20.next = 13;
            break;
          case 10:
            _context20.prev = 10;
            _context20.t0 = _context20["catch"](3);
            errorDrawerFuncs.addFromError("Error compressing file or folder", _context20.t0);
          case 13:
          case "end":
            return _context20.stop();
        }
      }, _callee20, null, [[3, 10]]);
    }));
    return _compress_file2.apply(this, arguments);
  }
  function _decompress_archive() {
    return _decompress_archive2.apply(this, arguments);
  }
  function _decompress_archive2() {
    _decompress_archive2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee21() {
      var node,
        sNode,
        src,
        _args21 = arguments;
      return _regeneratorRuntime().wrap(function _callee21$(_context21) {
        while (1) switch (_context21.prev = _context21.next) {
          case 0:
            node = _args21.length > 0 && _args21[0] !== undefined ? _args21[0] : null;
            if (!(!valueRef.current && !node)) {
              _context21.next = 3;
              break;
            }
            return _context21.abrupt("return");
          case 3:
            _context21.prev = 3;
            sNode = node && "isDirectory" in node ? node : selectedNodeRef.current;
            src = sNode.fullpath;
            _context21.next = 8;
            return (0, _communication_react.postPromise)("host", "decompress_archive", {
              full_path: sNode.fullpath,
              force_forward: true,
              user_id: window.user_id
            });
          case 8:
            _context21.next = 13;
            break;
          case 10:
            _context21.prev = 10;
            _context21.t0 = _context21["catch"](3);
            errorDrawerFuncs.addFromError("Error decompressing archive", _context21.t0);
          case 13:
          case "end":
            return _context21.stop();
        }
      }, _callee21, null, [[3, 10]]);
    }));
    return _decompress_archive2.apply(this, arguments);
  }
  function _downloadFile() {
    return _downloadFile2.apply(this, arguments);
  }
  function _downloadFile2() {
    _downloadFile2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee22() {
      var node,
        sNode,
        src,
        new_name,
        the_data,
        _yield$getBlobPromise,
        _yield$getBlobPromise2,
        data,
        status,
        xhr,
        blob,
        url,
        a,
        _args22 = arguments;
      return _regeneratorRuntime().wrap(function _callee22$(_context22) {
        while (1) switch (_context22.prev = _context22.next) {
          case 0:
            node = _args22.length > 0 && _args22[0] !== undefined ? _args22[0] : null;
            if (!(!valueRef.current && !node)) {
              _context22.next = 3;
              break;
            }
            return _context22.abrupt("return");
          case 3:
            _context22.prev = 3;
            sNode = node && "isDirectory" in node ? node : selectedNodeRef.current;
            if (!sNode.isDirectory) {
              _context22.next = 8;
              break;
            }
            (0, _toaster.doFlash)("You can't download a directory");
            return _context22.abrupt("return");
          case 8:
            src = sNode.fullpath;
            console.log("Got source " + String(src));
            _context22.next = 12;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Download File",
              field_title: "New File Name",
              default_value: (0, _pool_tree.getBasename)(src),
              existing_names: [],
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 12:
            new_name = _context22.sent;
            the_data = {
              src: src
            };
            _context22.next = 16;
            return (0, _communication_react.getBlobPromise)("download_pool_file", the_data);
          case 16:
            _yield$getBlobPromise = _context22.sent;
            _yield$getBlobPromise2 = _slicedToArray(_yield$getBlobPromise, 3);
            data = _yield$getBlobPromise2[0];
            status = _yield$getBlobPromise2[1];
            xhr = _yield$getBlobPromise2[2];
            if (xhr.status === 200) {
              // Create a download link and trigger the download
              blob = new Blob([data], {
                type: 'application/octet-stream'
              });
              url = window.URL.createObjectURL(blob);
              a = document.createElement('a');
              a.href = url;
              a.download = new_name; // Set the desired file name
              // noinspection XHTMLIncompatabilitiesJS
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
            }
            _context22.next = 27;
            break;
          case 24:
            _context22.prev = 24;
            _context22.t0 = _context22["catch"](3);
            if (_context22.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error downloading from pool", _context22.t0);
            }
          case 27:
          case "end":
            return _context22.stop();
        }
      }, _callee22, null, [[3, 24]]);
    }));
    return _downloadFile2.apply(this, arguments);
  }
  function MoveResource(_x4, _x5) {
    return _MoveResource.apply(this, arguments);
  }
  function _MoveResource() {
    _MoveResource = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee23(src, dst) {
      var the_data;
      return _regeneratorRuntime().wrap(function _callee23$(_context23) {
        while (1) switch (_context23.prev = _context23.next) {
          case 0:
            if (!(src == dst)) {
              _context23.next = 2;
              break;
            }
            return _context23.abrupt("return");
          case 2:
            _context23.prev = 2;
            the_data = {
              dst: dst,
              src: src
            };
            _context23.next = 6;
            return (0, _communication_react.postAjaxPromise)("move_pool_resource", the_data);
          case 6:
            _context23.next = 11;
            break;
          case 8:
            _context23.prev = 8;
            _context23.t0 = _context23["catch"](2);
            errorDrawerFuncs.addFromError("Error moving resource", _context23.t0);
          case 11:
          case "end":
            return _context23.stop();
        }
      }, _callee23, null, [[2, 8]]);
    }));
    return _MoveResource.apply(this, arguments);
  }
  function _move_resource() {
    return _move_resource2.apply(this, arguments);
  }
  function _move_resource2() {
    _move_resource2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee24() {
      var node,
        sNode,
        src,
        initial_address,
        dst,
        _args24 = arguments;
      return _regeneratorRuntime().wrap(function _callee24$(_context24) {
        while (1) switch (_context24.prev = _context24.next) {
          case 0:
            node = _args24.length > 0 && _args24[0] !== undefined ? _args24[0] : null;
            if (!(!valueRef.current && !node)) {
              _context24.next = 3;
              break;
            }
            return _context24.abrupt("return");
          case 3:
            _context24.prev = 3;
            sNode = node && "isDirectory" in node ? node : selectedNodeRef.current;
            src = sNode.fullpath;
            if (sNode.isDirectory) {
              initial_address = sNode.fullpath;
            } else {
              initial_address = (0, _pool_tree.getFileParentPath)(sNode.fullpath);
            }
            _context24.next = 9;
            return dialogFuncs.showModalPromise("SelectAddressDialog", {
              title: "Select a destination for ".concat((0, _pool_tree.getBasename)(src)),
              selectType: "folder",
              initial_address: initial_address,
              initial_name: "",
              showName: false,
              handleClose: dialogFuncs.hideModal
            });
          case 9:
            dst = _context24.sent;
            _context24.next = 12;
            return MoveResource(src, dst);
          case 12:
            _context24.next = 17;
            break;
          case 14:
            _context24.prev = 14;
            _context24.t0 = _context24["catch"](3);
            if (_context24.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error moving resource", _context24.t0);
            }
          case 17:
          case "end":
            return _context24.stop();
        }
      }, _callee24, null, [[3, 14]]);
    }));
    return _move_resource2.apply(this, arguments);
  }
  function _delete_func() {
    return _delete_func2.apply(this, arguments);
  }
  function _delete_func2() {
    _delete_func2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee25() {
      var node,
        path,
        sNode,
        basename,
        confirm_text,
        _args25 = arguments;
      return _regeneratorRuntime().wrap(function _callee25$(_context25) {
        while (1) switch (_context25.prev = _context25.next) {
          case 0:
            node = _args25.length > 0 && _args25[0] !== undefined ? _args25[0] : null;
            if (!(!valueRef.current && !node)) {
              _context25.next = 3;
              break;
            }
            return _context25.abrupt("return");
          case 3:
            _context25.prev = 3;
            path = node && "isDirectory" in node ? node.fullpath : valueRef.current;
            sNode = node && "isDirectory" in node ? node : selectedNodeRef.current;
            basename = (0, _pool_tree.getBasename)(path);
            if (sNode.isDirectory && sNode.childNodes.length > 0) {
              confirm_text = "Are you sure that you want to delete the non-empty directory ".concat(basename, "?");
            } else {
              confirm_text = "Are you sure that you want to delete ".concat(basename, "?");
            }
            _context25.next = 10;
            return dialogFuncs.showModalPromise("ConfirmDialog", {
              title: "Delete resource",
              text_body: confirm_text,
              cancel_text: "do nothing",
              submit_text: "delete",
              handleClose: dialogFuncs.hideModal
            });
          case 10:
            _context25.next = 12;
            return (0, _communication_react.postAjaxPromise)("delete_pool_resource", {
              full_path: path,
              is_directory: sNode.isDirectory
            });
          case 12:
            _context25.next = 17;
            break;
          case 14:
            _context25.prev = 14;
            _context25.t0 = _context25["catch"](3);
            if (_context25.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error deleting", _context25.t0);
            }
          case 17:
          case "end":
            return _context25.stop();
        }
      }, _callee25, null, [[3, 14]]);
    }));
    return _delete_func2.apply(this, arguments);
  }
  function _add_to_pool(myDropZone, setCurrentUrl, current_value) {
    var new_url = "import_pool/".concat(_library_home_react.library_id);
    myDropZone.options.url = new_url;
    setCurrentUrl(new_url);
    myDropZone.processQueue();
  }
  function _showPoolImport() {
    var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var initial_directory;
    var sNode = node && "isDirectory" in node ? node : selectedNodeRef.current;
    if (sNode && sNode.isDirectory) {
      initial_directory = sNode.fullpath;
    } else {
      initial_directory = "/mydisk";
    }
    dialogFuncs.showModal("FileImportDialog", {
      res_type: "pool",
      allowed_file_types: null,
      checkboxes: [],
      process_handler: _add_to_pool,
      chunking: true,
      chunkSize: 1024 * 1000 * 25,
      forceChunking: true,
      tsocket: props.tsocket,
      combine: false,
      show_csv_options: false,
      after_upload: null,
      show_address_selector: true,
      initial_address: initial_directory,
      handleClose: dialogFuncs.hideModal,
      handleCancel: null
    });
  }
  function handleDrop(_x6, _x7) {
    return _handleDrop.apply(this, arguments);
  }
  function _handleDrop() {
    _handleDrop = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee26(e, dst) {
      var files, src;
      return _regeneratorRuntime().wrap(function _callee26$(_context26) {
        while (1) switch (_context26.prev = _context26.next) {
          case 0:
            files = e.dataTransfer.files;
            if (!(files.length != 0)) {
              _context26.next = 5;
              break;
            }
            dialogFuncs.showModal("FileImportDialog", {
              res_type: "pool",
              allowed_file_types: null,
              checkboxes: [],
              chunking: true,
              chunkSize: 1024 * 1000 * 25,
              forceChunking: true,
              process_handler: _add_to_pool,
              tsocket: props.tsocket,
              combine: false,
              show_csv_options: false,
              after_upload: null,
              show_address_selector: true,
              initial_address: dst,
              handleClose: dialogFuncs.hideModal,
              handleCancel: null,
              initialFiles: files
            });
            _context26.next = 9;
            break;
          case 5:
            src = e.dataTransfer.getData("fullpath");
            if (!src) {
              _context26.next = 9;
              break;
            }
            _context26.next = 9;
            return MoveResource(src, dst);
          case 9:
          case "end":
            return _context26.stop();
        }
      }, _callee26);
    }));
    return _handleDrop.apply(this, arguments);
  }
  function handleNodeClick(node, nodes) {
    setValue(node.fullpath);
    setSelectedNode(node);
    return true;
  }
  function setRoot() {
    var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    if (!node) {
      node = selectedNodeRef.current;
    }
    setCurrentRootPath(node.fullpath);
  }
  function setRootToBase() {
    setCurrentRootPath("/mydisk");
  }
  function renderContextMenu(props) {
    return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, props.node.isDirectory && /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "folder-shared-open",
      onClick: /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return setRoot(props.node);
            case 2:
            case "end":
              return _context.stop();
          }
        }, _callee);
      })),
      text: "Go To Folder"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "home",
      onClick: /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return setRootToBase(props.node);
            case 2:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      })),
      text: "Go Home"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "clipboard",
      onClick: /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return _copy_func(props.node);
            case 2:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      })),
      text: "Copy Path"
    }), !props.node.isDirectory && /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "eye-open",
      onClick: /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return viewTextFile(props.node);
            case 2:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      })),
      text: "View as Text"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "code",
      onClick: /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return openInNotebook(props.node);
            case 2:
            case "end":
              return _context5.stop();
          }
        }, _callee5);
      })),
      text: "Open in Notebook"
    })), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "edit",
      onClick: /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return _rename_func(props.node);
            case 2:
            case "end":
              return _context6.stop();
          }
        }, _callee6);
      })),
      text: "Rename Resource"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "inheritance",
      onClick: /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7() {
        return _regeneratorRuntime().wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return _move_resource(props.node);
            case 2:
            case "end":
              return _context7.stop();
          }
        }, _callee7);
      })),
      text: "Move Resource"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "duplicate",
      onClick: /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8() {
        return _regeneratorRuntime().wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return _duplicate_file(props.node);
            case 2:
            case "end":
              return _context8.stop();
          }
        }, _callee8);
      })),
      text: "Duplicate File"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "folder-close",
      onClick: /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9() {
        return _regeneratorRuntime().wrap(function _callee9$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return _add_directory(props.node);
            case 2:
            case "end":
              return _context9.stop();
          }
        }, _callee9);
      })),
      text: "Create Directory"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "trash",
      onClick: /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee0() {
        return _regeneratorRuntime().wrap(function _callee0$(_context0) {
          while (1) switch (_context0.prev = _context0.next) {
            case 0:
              _context0.next = 2;
              return _delete_func(props.node);
            case 2:
            case "end":
              return _context0.stop();
          }
        }, _callee0);
      })),
      intent: "danger",
      text: "Delete Resource"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "archive",
      onClick: /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee1() {
        return _regeneratorRuntime().wrap(function _callee1$(_context1) {
          while (1) switch (_context1.prev = _context1.next) {
            case 0:
              _context1.next = 2;
              return _compress_file(props.node);
            case 2:
            case "end":
              return _context1.stop();
          }
        }, _callee1);
      })),
      text: "Compress Resource"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "unarchive",
      onClick: /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee10() {
        return _regeneratorRuntime().wrap(function _callee10$(_context10) {
          while (1) switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return _decompress_archive(props.node);
            case 2:
            case "end":
              return _context10.stop();
          }
        }, _callee10);
      })),
      text: "Decompress archive"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "cloud-upload",
      onClick: /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee11() {
        return _regeneratorRuntime().wrap(function _callee11$(_context11) {
          while (1) switch (_context11.prev = _context11.next) {
            case 0:
              _context11.next = 2;
              return _showPoolImport(props.node);
            case 2:
            case "end":
              return _context11.stop();
          }
        }, _callee11);
      })),
      text: "Import To Pool"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "download",
      onClick: /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee12() {
        return _regeneratorRuntime().wrap(function _callee12$(_context12) {
          while (1) switch (_context12.prev = _context12.next) {
            case 0:
              _context12.next = 2;
              return _downloadFile(props.node);
            case 2:
            case "end":
              return _context12.stop();
          }
        }, _callee12);
      })),
      text: "Download from Pool"
    }));
  }
  function registerTreeRefreshFunc(func) {
    treeRefreshFunc.current = func;
  }
  var outer_style = {
    marginTop: 0,
    marginLeft: 0,
    overflow: "auto",
    marginRight: 0,
    height: "100%"
  };
  var res_type = null;
  var fixed_data = {
    created: selected_resource_ref.current.created,
    updated: selected_resource_ref.current.updated,
    size: selected_resource_ref.current.size,
    path: valueRef.current
  };
  var right_pane = /*#__PURE__*/_react["default"].createElement(_blueprint_mdata_fields.CombinedMetadata, {
    res_type: selected_resource_ref.current.res_type,
    res_name: selected_resource_ref.current.name,
    useFixedData: true,
    fixedData: fixed_data,
    elevation: 2,
    outer_style: outer_style,
    readOnly: true
  });
  var left_pane = /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-column",
    style: {
      maxHeight: "100%",
      position: "relative",
      overflow: "scroll",
      padding: 15
    }
  }, (props.am_selected || have_activated) && /*#__PURE__*/_react["default"].createElement(_pool_tree.PoolContext.Provider, {
    value: {
      workingPath: null,
      setWorkingPath: function setWorkingPath() {}
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-row",
    style: {
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/_react["default"].createElement(PoolBreadcrumbs, {
    path: currentRootPathRef.current,
    setRoot: setRoot
  }), /*#__PURE__*/_react["default"].createElement(PoolHiddenSwitch, {
    showHidden: showHidden,
    setShowHidden: setShowHidden
  })), /*#__PURE__*/_react["default"].createElement(_pool_tree.PoolTree, {
    value: valueRef.current,
    currentRootPath: currentRootPathRef.current,
    showHidden: showHidden,
    setRoot: setRoot,
    renderContextMenu: renderContextMenu,
    select_type: "both",
    registerTreeRefreshFunc: registerTreeRefreshFunc,
    user_id: window.user_id,
    tsocket: props.tsocket,
    handleDrop: handleDrop,
    showSecondaryLabel: true,
    handleNodeClick: handleNodeClick
  }))));
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(PoolMenubar, _extends({
    selected_resource: selected_resource_ref.current,
    connection_status: null,
    copy_func: _copy_func,
    rename_func: _rename_func,
    delete_func: _delete_func,
    view_func: viewTextFile,
    open_in_notebook_func: openInNotebook,
    add_directory: _add_directory,
    duplicate_file: _duplicate_file,
    compress_file: _compress_file,
    decompress_archive: _decompress_archive,
    move_resource: _move_resource,
    download_file: _downloadFile,
    refreshFunc: treeRefreshFunc.current,
    showPoolImport: _showPoolImport,
    multi_select: multi_select_ref.current,
    list_of_selected: list_of_selected_ref.current,
    sendContextMenuItems: setContextMenuItems,
    setRootToBase: setRootToBase,
    setRoot: setRoot
  }, props.errorDrawerFuncs, {
    library_id: props.library_id,
    controlled: props.controlled,
    tsocket: props.tsocket
  })), /*#__PURE__*/_react["default"].createElement("div", {
    ref: top_ref,
    style: outer_style,
    className: "pool-browser"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      width: usable_width,
      height: usable_height
    }
  }, /*#__PURE__*/_react["default"].createElement(_resizing_layouts.HorizontalPanes, {
    outer_hp_style: {
      paddingBottom: "50px"
    },
    show_handle: true,
    left_pane: left_pane,
    right_pane: right_pane,
    right_pane_overflow: "auto",
    initial_width_fraction: .75,
    scrollAdjustSelectors: [".bp5-table-quadrant-scroll-container"],
    handleSplitUpdate: null,
    handleResizeStart: null,
    handleResizeEnd: null
  }))));
}
exports.PoolBrowser = PoolBrowser = /*#__PURE__*/(0, _react.memo)(PoolBrowser);
function PoolBreadcrumb(props) {
  return /*#__PURE__*/_react["default"].createElement(_core.Breadcrumb, {
    className: "pool-breadcrumb",
    key: props.path,
    icon: props.icon,
    onClick: props.onClick
  }, props.name);
}
function PoolHiddenSwitch(props) {
  function handleShowHiddenChange(event) {
    props.setShowHidden(event.target.checked);
  }
  return /*#__PURE__*/_react["default"].createElement(_core.Switch, {
    label: "show hidden",
    large: false,
    checked: props.showHidden,
    onChange: handleShowHiddenChange
  });
}
function PoolBreadcrumbs(props) {
  function clickFunc(path) {
    return function () {
      props.setRoot({
        fullpath: path
      });
    };
  }
  function pathToCrumbs(path) {
    var crumbs = [];
    var parts = path.split("/");
    var new_path = "";
    var _iterator2 = _createForOfIteratorHelper(parts),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var item = _step2.value;
        if (item === "") {
          continue;
        }
        new_path += "/" + item;
        crumbs.push({
          name: item,
          icon: "folder-close",
          path: new_path,
          onClick: clickFunc(new_path)
        });
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    return crumbs;
  }
  function renderBreadcrumb(props) {
    return /*#__PURE__*/_react["default"].createElement(PoolBreadcrumb, props);
  }
  var crumbs = pathToCrumbs(props.path);
  return /*#__PURE__*/_react["default"].createElement(_core.Breadcrumbs, {
    className: "pool-breadcrumbs",
    breadcrumbRenderer: renderBreadcrumb,
    items: crumbs
  });
}
function PoolMenubar(props) {
  var _useStateAndRef11 = (0, _utilities_react.useStateAndRef)(props.selected_resource.res_type),
    _useStateAndRef12 = _slicedToArray(_useStateAndRef11, 3),
    selectedType = _useStateAndRef12[0],
    setSelectedType = _useStateAndRef12[1],
    selectedTypeRef = _useStateAndRef12[2];
  (0, _react.useEffect)(function () {
    setSelectedType(props.selected_resource.res_type);
  }, [props.selected_resource]);
  function context_menu_items() {
    return [];
  }
  function menu_specs() {
    return {
      Navigate: [{
        name_text: "Go Home",
        icon_name: "home",
        click_handler: props.setRootToBase
      }, {
        name_text: "Go to Folder",
        icon_name: "folder-shared-open",
        click_handler: function click_handler() {
          props.setRoot();
        },
        res_type: "poolDir"
      }],
      Inspect: [{
        name_text: "Copy Path",
        icon_name: "clipboard",
        click_handler: props.copy_func
      }, {
        name_text: "View As Text File",
        icon_name: "eye-open",
        click_handler: props.view_func
      }, {
        name_text: "Open in Notebook",
        icon_name: "code",
        click_handler: props.open_in_notebook_func
      }],
      Edit: [{
        name_text: "Rename Resource",
        icon_name: "edit",
        click_handler: props.rename_func
      }, {
        name_text: "Move Resource",
        icon_name: "inheritance",
        click_handler: props.move_resource
      }, {
        name_text: "Duplicate File",
        icon_name: "duplicate",
        click_handler: props.duplicate_file
      }, {
        name_text: "Create Directory",
        icon_name: "folder-close",
        click_handler: props.add_directory
      }, {
        name_text: "Delete Resource",
        icon_name: "trash",
        click_handler: props.delete_func
      }],
      Archive: [{
        name_text: "Compress Resource",
        icon_name: "archive",
        click_handler: props.compress_file
      }, {
        name_text: "Decompress Archive",
        icon_name: "unarchive",
        click_handler: props.decompress_archive
      }],
      Transfer: [{
        name_text: "Import To Pool",
        icon_name: "cloud-upload",
        click_handler: props.showPoolImport
      }, {
        name_text: "Download File",
        icon_name: "download",
        click_handler: props.download_file
      }]
    };
  }
  return /*#__PURE__*/_react["default"].createElement(_library_menubars.LibraryMenubar, {
    sendContextMenuItems: props.sendContextMenuItems,
    connection_status: props.connection_status,
    context_menu_items: context_menu_items(),
    selected_rows: props.selected_rows,
    selectedTypeRef: selectedTypeRef,
    selected_resource: props.selected_resource,
    resource_icon: _blueprint_mdata_fields.icon_dict["pool"],
    menu_specs: menu_specs(),
    multi_select: props.multi_select,
    controlled: props.controlled,
    am_selected: props.am_selected,
    tsocket: props.tsocket,
    showRefresh: true,
    refreshTab: props.refreshFunc,
    closeTab: null,
    resource_name: ""
  });
}
PoolMenubar = /*#__PURE__*/(0, _react.memo)(PoolMenubar);
function FileDropWrapper(props) {
  var _useState7 = (0, _react.useState)(false),
    _useState8 = _slicedToArray(_useState7, 2),
    isDragging = _useState8[0],
    setIsDragging = _useState8[1];
  var handleDragOver = function handleDragOver(e) {
    e.preventDefault();
    setIsDragging(true);
  };
  var handleDragLeave = function handleDragLeave() {
    setIsDragging(false);
  };
  var handleDrop = function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    var files = e.dataTransfer.files;
    if (files) {
      if (props.processFiles) {
        props.processFiles(files);
      }
    }
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    id: "pool-drop-zone",
    className: "drop-zone ".concat(isDragging ? 'drag-over' : ''),
    onDragOver: handleDragOver,
    onDragLeave: handleDragLeave,
    onDrop: handleDrop
  }, props.children);
}
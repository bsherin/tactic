"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileImportDialog = FileImportDialog;
var _react = _interopRequireWildcard(require("react"));
var _reactDropzoneComponent = _interopRequireDefault(require("react-dropzone-component"));
require("../css/dzcss/dropzone.css");
require("../css/dzcss/filepicker.css");
require("../css/dzcss/basic.css");
var _core = require("@blueprintjs/core");
var _blueprint_mdata_fields = require("./blueprint_mdata_fields.js");
var _utilities_react = require("./utilities_react");
var _server = require("react-dom/server");
var _error_drawer = require("./error_drawer");
var _pool_tree = require("./pool_tree");
var _settings = require("./settings");
var _communication_react = require("./communication_react");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var defaultImportDialogWidth = 700;
function FileImportDialog(props) {
  props = _objectSpread({
    checkboxes: null,
    textoptions: null,
    popupoptions: null,
    after_upload: null,
    show_address_selector: false,
    initialFiles: []
  }, props);
  var name_counter = (0, _react.useRef)(1);
  var default_name = (0, _react.useRef)("new" + props.res_type);
  var picker_ref = (0, _react.useRef)(null);
  var existing_names = (0, _react.useRef)([]);
  var current_url = (0, _react.useRef)("dummy");
  var myDropzone = (0, _react.useRef)(null);
  var _useState = (0, _react.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    show = _useState2[0],
    set_show = _useState2[1];
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)(props.show_address_selector ? "mydisk" : "new" + props.res_type),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    current_value = _useStateAndRef2[0],
    set_current_value = _useStateAndRef2[1],
    current_value_ref = _useStateAndRef2[2];
  var _useState3 = (0, _react.useState)({}),
    _useState4 = _slicedToArray(_useState3, 2),
    checkbox_states = _useState4[0],
    set_checkbox_states = _useState4[1];
  var _useState5 = (0, _react.useState)("  "),
    _useState6 = _slicedToArray(_useState5, 2),
    warning_text = _useState6[0],
    set_warning_text = _useState6[1];
  var _useState7 = (0, _react.useState)(false),
    _useState8 = _slicedToArray(_useState7, 2),
    log_open = _useState8[0],
    set_log_open = _useState8[1];
  var _useState9 = (0, _react.useState)([]),
    _useState10 = _slicedToArray(_useState9, 2),
    log_contents = _useState10[0],
    set_log_contents = _useState10[1];
  var _useState11 = (0, _react.useState)(defaultImportDialogWidth - 100),
    _useState12 = _slicedToArray(_useState11, 2),
    current_picker_width = _useState12[0],
    set_current_picker_width = _useState12[1];

  // These will only matter if props.show_csv_options
  var _useState13 = (0, _react.useState)(","),
    _useState14 = _slicedToArray(_useState13, 2),
    delimiter = _useState14[0],
    set_delimiter = _useState14[1];
  var _useState15 = (0, _react.useState)("QUOTE_MINIMAL"),
    _useState16 = _slicedToArray(_useState15, 2),
    quoting = _useState16[0],
    set_quoting = _useState16[1];
  var _useState17 = (0, _react.useState)(true),
    _useState18 = _slicedToArray(_useState17, 2),
    skipinitialspace = _useState18[0],
    set_skipinitialspace = _useState18[1];
  var _useState19 = (0, _react.useState)(false),
    _useState20 = _slicedToArray(_useState19, 2),
    csv_options_open = _useState20[0],
    set_csv_options_open = _useState20[1];
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  (0, _utilities_react.useConstructor)( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    var data;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return (0, _communication_react.postAjaxPromise)("get_resource_names/".concat(props.res_type));
        case 3:
          data = _context.sent;
          existing_names.current = data.resource_names;
          while (_name_exists(default_name)) {
            name_counter.current += 1;
            default_name.current = "new" + props.res_type + String(name_counter.current);
          }
          set_show(true);
          _context.next = 12;
          break;
        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          errorDrawerFuncs.addFromError("Error getting existing names", _context.t0);
        case 12:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 9]]);
  })));
  (0, _react.useEffect)(function () {
    if (props.checkboxes != null && props.checkboxes.length != 0) {
      var lcheckbox_states = {};
      var _iterator = _createForOfIteratorHelper(props.checkboxes),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var checkbox = _step.value;
          lcheckbox_states[checkbox.checkname] = false;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      set_checkbox_states(lcheckbox_states);
    }
    if (props.show_address_selector && props.initial_address) {
      set_current_value(props.initial_address);
    }
    _updatePickerSize();
    initSocket();
  }, []);
  (0, _react.useEffect)(function () {
    _updatePickerSize();
  });
  function _handleResponse(entry) {
    if (entry.resource_name && entry["success"] in ["success", "partial"]) {
      existing_names.current.push(entry.resource_name);
    }
    set_log_contents([].concat(_toConsumableArray(log_contents), [entry]));
    set_log_open(true);
  }
  function _handleError(file, message) {
    var xhr = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    _handleResponse({
      title: "Error for ".concat(file.name),
      "content": message
    });
  }
  function _updatePickerSize() {
    if (picker_ref && picker_ref.current) {
      var new_width = picker_ref.current.offsetWidth;
      if (new_width != current_picker_width) {
        set_current_picker_width(picker_ref.current.offsetWidth);
      }
    }
  }
  function initSocket() {
    props.tsocket.attachListener("upload-response", _handleResponse);
  }
  function _checkbox_change_handler(event) {
    var val = event.target.checked;
    var new_checkbox_states = Object.assign({}, checkbox_states);
    new_checkbox_states[event.target.id] = event.target.checked;
    set_checkbox_states(new_checkbox_states);
  }
  function _closeHandler() {
    set_show(false);
    props.handleClose();
  }
  function _do_submit() {
    var msg;
    if (myDropzone.current.getQueuedFiles().length == 0) {
      return;
    }
    if (current_value == "") {
      msg = "An empty name is not allowed here.";
      set_warning_text(msg);
    } else if (_name_exists(current_value)) {
      msg = "That name already exists";
      set_warning_text(msg);
    } else {
      var csv_options;
      if (props.show_csv_options && csv_options_open) {
        csv_options = {
          delimiter: delimiter,
          quoting: quoting,
          skipinitialspace: skipinitialspace
        };
      } else {
        csv_options = null;
      }
      props.process_handler(myDropzone.current, _setCurrentUrl, current_value, checkbox_states, csv_options);
    }
  }
  function _do_clear() {
    myDropzone.current.removeAllFiles();
  }
  function _initCallback(dropzone) {
    myDropzone.current = dropzone;
    if (props.initialFiles) {
      var _iterator2 = _createForOfIteratorHelper(props.initialFiles),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var theFile = _step2.value;
          dropzone.addFile(theFile);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }
  function _setCurrentUrl(new_url) {
    myDropzone.current.options.url = new_url;
    current_url.current = new_url;
  }

  // There's trickiness with setting the current url in the dropzone object.
  // If I don't set it below in uploadComplete, then the second file processed
  // gets the dummy url in some cases. It's related to the component re-rendering
  // I think, perhaps when messages are shown in the dialog.

  function _uploadComplete(f) {
    if (myDropzone.current.getQueuedFiles().length > 0) {
      myDropzone.current.options.url = current_url.current;
      myDropzone.current.processQueue();
    } else if (props.after_upload) {
      props.after_upload();
    }
  }
  function _onSending(f, xhr, formData) {
    f.previewElement.scrollIntoView(false);
    formData.append("extra_value", current_value_ref.current);
    if (props.chunking) {
      formData.append("dzuuid", f.upload.uuid);
    }
  }
  function _name_exists(name) {
    return existing_names.current.indexOf(name) > -1;
  }
  function _toggleLog() {
    set_log_open(!log_open);
  }
  function _clearLog() {
    set_log_contents([]);
  }
  function _handleDrop() {
    if (myDropzone.current.getQueuedFiles().length == 0) {
      _do_clear();
    }
  }
  function _nameChangeHandler(event) {
    set_current_value(event.target.value);
    set_warning_text("  ");
  }
  function _updateDelimiter(event) {
    set_delimiter(event.target.value);
  }
  function _updateSkipinitial(event) {
    set_skipinitialspace(event.target.checked);
  }
  function _toggleCSVOptions() {
    set_csv_options_open(!csv_options_open);
  }
  var half_width = .5 * current_picker_width - 10;
  var name_style = {
    display: "inline-block",
    maxWidth: half_width
  };
  var progress_style = {
    position: "relative",
    width: half_width - 100,
    marginRight: 5,
    marginLeft: "unset",
    left: "unset",
    right: "unset"
  };
  var size_style = {
    marginLeft: 5,
    width: 75
  };
  var componentConfig = {
    postUrl: current_url.current // Must have this even though will never be used
  };
  var djsConfig = {
    uploadMultiple: false,
    parallelUploads: 1,
    maxFilesize: 2000,
    timeout: 360000,
    chunking: props.chunking,
    forceChunking: props.forceChunking,
    chunkSize: props.chunkSize,
    autoProcessQueue: false,
    dictDefaultMessage: "Click or drop files here to upload",
    acceptedFiles: props.allowed_file_types,
    // addRemoveLinks: true,
    // dictRemoveFile: "x",
    previewTemplate: (0, _server.renderToStaticMarkup)( /*#__PURE__*/_react["default"].createElement("div", {
      className: "dz-preview dz-file-preview"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      style: name_style,
      "data-dz-name": "true"
    }), /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        display: "flex",
        width: half_width,
        flexDirection: "row",
        justifyContent: "space-bewteen"
      }
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "dz-progress",
      style: progress_style
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "dz-upload",
      "data-dz-uploadprogress": "true"
    })), /*#__PURE__*/_react["default"].createElement("div", {
      className: "dz-success-mark",
      style: progress_style
    }, /*#__PURE__*/_react["default"].createElement("span", null, "\u2714")), /*#__PURE__*/_react["default"].createElement("div", {
      className: "dz-error-mark",
      style: progress_style
    }, /*#__PURE__*/_react["default"].createElement("span", null, "\u2718")), /*#__PURE__*/_react["default"].createElement("div", {
      style: size_style,
      "data-dz-size": "true"
    })))),
    headers: {
      'X-CSRF-TOKEN': window.csrftoken
    }
  };
  var eventHandlers;
  eventHandlers = {
    init: _initCallback,
    complete: _uploadComplete,
    sending: _onSending,
    drop: _handleDrop,
    error: _handleError
  };
  var checkbox_items = [];
  if (props.checkboxes != null && props.checkboxes.length != 0) {
    var _iterator3 = _createForOfIteratorHelper(props.checkboxes),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var checkbox = _step3.value;
        var new_item = /*#__PURE__*/_react["default"].createElement(_core.Checkbox, {
          checked: checkbox_states[checkbox.checkname],
          label: checkbox.checktext,
          id: checkbox.checkname,
          key: checkbox.checkname,
          inline: "true",
          alignIndicator: _core.Alignment.RIGHT,
          onChange: _checkbox_change_handler
        });
        checkbox_items.push(new_item);
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
  }
  var log_items;
  if (log_open) {
    if (log_contents.length > 0) {
      log_items = log_contents.map(function (entry, index) {
        var content_dict = {
          __html: entry.content
        };
        var has_link = false;
        return /*#__PURE__*/_react["default"].createElement(_error_drawer.ErrorItem, {
          key: index,
          title: entry.title,
          content: entry.content,
          has_link: has_link
        });
      });
    } else {
      log_items = /*#__PURE__*/_react["default"].createElement("div", null, "Log is empty");
    }
  }
  var body_style = {
    marginTop: 25,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    minHeight: 101
  };
  var allowed_types_string;
  if (props.allowed_file_types) {
    allowed_types_string = props.allowed_file_types.replaceAll(",", " ");
  } else {
    allowed_types_string = "any";
  }
  return /*#__PURE__*/_react["default"].createElement(_core.Dialog, {
    isOpen: show,
    className: settingsContext.isDark() ? "import-dialog bp5-dark" : "import-dialog light-theme",
    title: props.title,
    onClose: _closeHandler,
    canOutsideClickClose: true,
    canEscapeKeyClose: true
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: _core.Classes.DIALOG_BODY
  }, /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    helperText: "allowed types: ".concat(allowed_types_string)
  }, /*#__PURE__*/_react["default"].createElement(_reactDropzoneComponent["default"], {
    config: componentConfig,
    eventHandlers: eventHandlers,
    djsConfig: djsConfig
  })), /*#__PURE__*/_react["default"].createElement("div", {
    style: body_style
  }, props.combine && /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "New ".concat(props.res_type, " name"),
    labelFor: "name-input",
    inline: true,
    helperText: warning_text
  }, /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
    onChange: _nameChangeHandler,
    fill: false,
    id: "name-input",
    value: current_value
  })), checkbox_items.length != 0 && checkbox_items, props.show_csv_options && /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_core.Divider, null), /*#__PURE__*/_react["default"].createElement(_core.Button, {
    onClick: _toggleCSVOptions,
    minimal: true,
    intent: "primary",
    large: true
  }, "csv options: ", csv_options_open ? "manual" : "auto"), /*#__PURE__*/_react["default"].createElement(_core.Collapse, {
    isOpen: csv_options_open
  }, /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "delimiter",
    inline: true,
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
    onChange: _updateDelimiter,
    value: delimiter
  })), /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "quoting",
    inline: true
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_mdata_fields.BpSelect, {
    onChange: set_quoting,
    value: quoting,
    filterable: false,
    small: true,
    options: ["QUOTE_MINIMAL", "QUOTE_ALL", "QUOTE_NONNUMERIC", "QUOTE_NONE"]
  })), /*#__PURE__*/_react["default"].createElement(_core.Checkbox, {
    checked: skipinitialspace,
    label: "skipinitialspace",
    inline: "true",
    alignIndicator: _core.Alignment.RIGHT,
    onChange: _updateSkipinitial
  })))), props.show_address_selector && /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "Target Directory",
    labelFor: "name-input",
    inline: true,
    helperText: warning_text
  }, /*#__PURE__*/_react["default"].createElement(_pool_tree.PoolAddressSelector, {
    value: current_value,
    tsocket: props.tsocket,
    select_type: "folder",
    setValue: set_current_value
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-evenly"
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
    intent: _core.Intent.PRIMARY,
    onClick: _do_submit
  }, "Upload"), /*#__PURE__*/_react["default"].createElement(_core.Button, {
    onClick: _do_clear
  }, "Clear Files")))), /*#__PURE__*/_react["default"].createElement(_core.Divider, null), /*#__PURE__*/_react["default"].createElement("div", {
    className: _core.Classes.DIALOG_FOOTER,
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, null, /*#__PURE__*/_react["default"].createElement(_core.Button, {
    onClick: _toggleLog
  }, log_open ? "Hide" : "Show", " log"), /*#__PURE__*/_react["default"].createElement(_core.Button, {
    onClick: _clearLog
  }, "Clear log")), /*#__PURE__*/_react["default"].createElement(_core.Collapse, {
    isOpen: log_open
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "bp5-dialog-body"
  }, log_items))));
}
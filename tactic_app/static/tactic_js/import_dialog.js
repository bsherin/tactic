"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileImportDialog = FileImportDialog;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
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
var _theme = require("./theme");
var _communication_react = require("./communication_react");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var defaultImportDialogWidth = 700;
function FileImportDialog(props) {
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
  var theme = (0, _react.useContext)(_theme.ThemeContext);
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
    className: theme.dark_theme ? "import-dialog bp5-dark" : "import-dialog light-theme",
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
FileImportDialog.propTypes = {
  res_type: _propTypes["default"].string,
  title: _propTypes["default"].string,
  existing_names: _propTypes["default"].array,
  process_handler: _propTypes["default"].func,
  after_upload: _propTypes["default"].func,
  allowed_file_types: _propTypes["default"].string,
  combine: _propTypes["default"].bool,
  checkboxes: _propTypes["default"].array,
  textoptions: _propTypes["default"].array,
  popupoptions: _propTypes["default"].array,
  handleClose: _propTypes["default"].func,
  tsocket: _propTypes["default"].object,
  show_address_selector: _propTypes["default"].bool,
  initialFiles: _propTypes["default"].array
};
FileImportDialog.defaultProps = {
  checkboxes: null,
  textoptions: null,
  popupoptions: null,
  after_upload: null,
  show_address_selector: false,
  initialFiles: []
};
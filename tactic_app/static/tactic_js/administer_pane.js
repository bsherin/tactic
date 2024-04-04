"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AdminPane = AdminPane;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _table = require("@blueprintjs/table");
var _library_widgets = require("./library_widgets");
var _resizing_layouts = require("./resizing_layouts2");
var _sizing_tools = require("./sizing_tools");
var _utilities_react = require("./utilities_react");
var _communication_react = require("./communication_react");
var _lodash = _interopRequireDefault(require("lodash"));
var _searchable_console = require("./searchable_console");
var _error_drawer = require("./error_drawer");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function AdminPane(props) {
  var top_ref = (0, _react.useRef)(null);
  var table_ref = (0, _react.useRef)(null);
  var console_text_ref = (0, _react.useRef)(null);
  var previous_search_spec = (0, _react.useRef)(null);
  var get_url = "grab_".concat(props.res_type, "_list_chunk");
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)({}),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    data_dict = _useStateAndRef2[0],
    set_data_dict = _useStateAndRef2[1],
    data_dict_ref = _useStateAndRef2[2];
  var _useState = (0, _react.useState)(0),
    _useState2 = _slicedToArray(_useState, 2),
    num_rows = _useState2[0],
    set_num_rows = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = _slicedToArray(_useState3, 2),
    awaiting_data = _useState4[0],
    set_awaiting_data = _useState4[1];
  var _useState5 = (0, _react.useState)(false),
    _useState6 = _slicedToArray(_useState5, 2),
    mounted = _useState6[0],
    set_mounted = _useState6[1];
  var _useState7 = (0, _react.useState)(500),
    _useState8 = _slicedToArray(_useState7, 2),
    total_width = _useState8[0],
    set_total_width = _useState8[1];
  var _useSize = (0, _sizing_tools.useSize)(top_ref, 0, "AdminPane"),
    _useSize2 = _slicedToArray(_useSize, 4),
    usable_width = _useSize2[0],
    usable_height = _useSize2[1],
    topX = _useSize2[2],
    topY = _useSize2[3];
  var _useSize3 = (0, _sizing_tools.useSize)(table_ref, 0, "AdminPane"),
    _useSize4 = _slicedToArray(_useSize3, 4),
    table_usable_width = _useSize4[0],
    table_usable_height = _useSize4[1],
    table_topX = _useSize4[2],
    table_topY = _useSize4[3];
  var _useSize5 = (0, _sizing_tools.useSize)(console_text_ref, 0, "AdminConsole"),
    _useSize6 = _slicedToArray(_useSize5, 4),
    console_usable_width = _useSize6[0],
    console_usable_height = _useSize6[1],
    console_topX = _useSize6[2],
    console_topY = _useSize6[3];
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  (0, _react.useEffect)(function () {
    initSocket();
    _grabNewChunkWithRow(0, true, null, true).then(function () {});
  }, []);
  function initSocket() {
    if (props.tsocket != null) {
      props.tsocket.attachListener("update-".concat(props.res_type, "-selector-row"), _handleRowUpdate);
      props.tsocket.attachListener("refresh-".concat(props.res_type, "-selector"), _refresh_func);
    }
  }
  function _getSearchSpec() {
    return {
      search_string: props.search_string,
      sort_field: props.sort_field,
      sort_direction: props.sort_direction
    };
  }
  function _onTableSelection(regions) {
    if (regions.length == 0) return; // Without this get an error when clicking on a body cell
    var selected_rows = [];
    var revised_regions = [];
    var _iterator = _createForOfIteratorHelper(regions),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var region = _step.value;
        if (region.hasOwnProperty("rows")) {
          var first_row = region["rows"][0];
          revised_regions.push(_table.Regions.row(first_row));
          var last_row = region["rows"][1];
          for (var i = first_row; i <= last_row; ++i) {
            selected_rows.push(data_dict_ref.current[i]);
            revised_regions.push(_table.Regions.row(i));
          }
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    _handleRowSelection(selected_rows);
    _updatePaneState({
      selectedRegions: revised_regions
    });
  }
  function _grabNewChunkWithRow(_x2) {
    return _grabNewChunkWithRow2.apply(this, arguments);
  }
  function _grabNewChunkWithRow2() {
    _grabNewChunkWithRow2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(row_index) {
      var flush,
        spec_update,
        select,
        callback,
        search_spec,
        query,
        data,
        new_data_dict,
        _args3 = arguments;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            flush = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : false;
            spec_update = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : null;
            select = _args3.length > 3 && _args3[3] !== undefined ? _args3[3] : false;
            callback = _args3.length > 4 && _args3[4] !== undefined ? _args3[4] : null;
            _context3.prev = 4;
            search_spec = _getSearchSpec();
            if (spec_update) {
              search_spec = Object.assign(search_spec, spec_update);
            }
            query = {
              search_spec: search_spec,
              row_number: row_index
            };
            _context3.next = 10;
            return (0, _communication_react.postAjaxPromise)(get_url, query);
          case 10:
            data = _context3.sent;
            if (flush) {
              new_data_dict = data.chunk_dict;
            } else {
              new_data_dict = _lodash["default"].cloneDeep(data_dict_ref.current);
              new_data_dict = Object.assign(new_data_dict, data.chunk_dict);
            }
            previous_search_spec.current = search_spec;
            set_data_dict(new_data_dict);
            set_num_rows(data.num_rows);
            pushCallback(function () {
              if (callback) {
                callback();
              } else if (select) {
                _selectRow(row_index);
              }
            });
            _context3.next = 21;
            break;
          case 18:
            _context3.prev = 18;
            _context3.t0 = _context3["catch"](4);
            errorDrawerFuncs.addFromError("Error grabbing row chunk", _context3.t0);
          case 21:
          case "end":
            return _context3.stop();
        }
      }, _callee3, null, [[4, 18]]);
    }));
    return _grabNewChunkWithRow2.apply(this, arguments);
  }
  function _grabNewChunkWithRowPromise(row_index) {
    var flush = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var spec_update = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var select = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    return new Promise( /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(resolve, reject) {
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _grabNewChunkWithRow(row_index, flush, spec_update, select, resolve);
            case 2:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      return function (_x3, _x4) {
        return _ref.apply(this, arguments);
      };
    }());
  }
  function _initiateDataGrab(row_index) {
    set_awaiting_data(true);
    pushCallback( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _grabNewChunkWithRow(row_index);
          case 2:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    })));
  }
  function _handleRowUpdate(res_dict) {
    var res_idval = res_dict.Id;
    var ind = get_data_dict_index(res_idval);
    var new_data_dict = _lodash["default"].cloneDeep(data_dict_ref.current);
    var the_row = new_data_dict[ind];
    for (var field in res_dict) {
      the_row[field] = res_dict[field];
    }
    if (res_name == props.selected_resource.name) {
      props.updatePaneState({
        "selected_resource": the_row
      });
    }
    set_data_dict(new_data_dict);
  }
  function _updatePaneState(new_state, callback) {
    props.updatePaneState(props.res_type, new_state, callback);
  }
  function _updatePaneStatePromise(new_state) {
    props.updatePaneStatePromise(props.res_type, new_state);
  }
  function get_data_dict_index(idval) {
    for (var index in data_dict_ref.current) {
      if (data_dict_ref.current[index].Id == idval) {
        return index;
      }
    }
    return null;
  }
  function _delete_row(idval) {
    var ind = get_data_dict_index(idval);
    var new_data_dict = _objectSpread({}, data_dict_ref.current);
    delete new_data_dict[ind];
    set_data_dict(new_data_dict);
  }
  function get_data_dict_entry(name) {
    for (var index in data_dict_ref.current) {
      if (data_dict_ref.current[index].name == name) {
        return data_dict_ref.current[index];
      }
    }
    return null;
  }
  function _handleSplitResize(left_width, right_width, width_fraction) {
    _updatePaneState({
      left_width_fraction: width_fraction
    });
  }
  function _handleRowClick(row_dict) {
    var shift_key_down = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    _updatePaneState({
      selected_resource: row_dict,
      multi_select: false,
      list_of_selected: [row_dict[props.id_field]]
    });
  }
  function _handleRowSelection(selected_rows) {
    var row_dict = selected_rows[0];
    _updatePaneState({
      selected_resource: row_dict,
      multi_select: false,
      list_of_selected: [row_dict.name]
    });
  }
  function _filter_func(resource_dict, search_string) {
    for (var key in resource_dict) {
      if (resource_dict[key].toLowerCase().search(search_string) != -1) {
        return true;
      }
    }
    return resource_dict[props.id_field].toLowerCase().search(search_string) != -1;
  }
  function _update_search_state(_x5) {
    return _update_search_state2.apply(this, arguments);
  }
  function _update_search_state2() {
    _update_search_state2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(new_state) {
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return _updatePaneStatePromise(new_state);
          case 2:
            if (!search_spec_changed(new_state)) {
              _context4.next = 5;
              break;
            }
            _context4.next = 5;
            return _grabNewChunkWithRow(0, true, new_state, true);
          case 5:
          case "end":
            return _context4.stop();
        }
      }, _callee4);
    }));
    return _update_search_state2.apply(this, arguments);
  }
  function search_spec_changed(new_spec) {
    if (!previous_search_spec.current) {
      return true;
    }
    for (var key in previous_search_spec.current) {
      if (new_spec.hasOwnProperty(key)) {
        // noinspection TypeScriptValidateTypes
        if (new_spec[key] != previous_search_spec.current[key]) {
          return true;
        }
      }
    }
    return false;
  }
  function _set_sort_state(_x6, _x7, _x8) {
    return _set_sort_state2.apply(this, arguments);
  }
  function _set_sort_state2() {
    _set_sort_state2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(column_name, sort_field, direction) {
      var spec_update;
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            spec_update = {
              sort_field: column_name,
              sort_direction: direction
            };
            _context5.next = 3;
            return _updatePaneState(spec_update);
          case 3:
            if (!search_spec_changed(spec_update)) {
              _context5.next = 6;
              break;
            }
            _context5.next = 6;
            return _grabNewChunkWithRow(0, true, spec_update, true);
          case 6:
          case "end":
            return _context5.stop();
        }
      }, _callee5);
    }));
    return _set_sort_state2.apply(this, arguments);
  }
  function _handleArrowKeyPress(_x9) {
    return _handleArrowKeyPress2.apply(this, arguments);
  }
  function _handleArrowKeyPress2() {
    _handleArrowKeyPress2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(key) {
      var current_index, new_index, new_selected_res;
      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            current_index = parseInt(get_data_dict_index(props.selected_resource.Id));
            if (!(key == "ArrowDown")) {
              _context6.next = 5;
              break;
            }
            new_index = current_index + 1;
            _context6.next = 8;
            break;
          case 5:
            new_index = current_index - 1;
            if (!(new_index < 0)) {
              _context6.next = 8;
              break;
            }
            return _context6.abrupt("return");
          case 8:
            _context6.next = 10;
            return _selectRow(new_index);
          case 10:
          case "end":
            return _context6.stop();
        }
      }, _callee6);
    }));
    return _handleArrowKeyPress2.apply(this, arguments);
  }
  function _selectRow(_x10) {
    return _selectRow2.apply(this, arguments);
  }
  function _selectRow2() {
    _selectRow2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(new_index) {
      var new_regions;
      return _regeneratorRuntime().wrap(function _callee7$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
          case 0:
            if (Object.keys(data_dict_ref.current).includes(String(new_index))) {
              _context7.next = 7;
              break;
            }
            _context7.next = 3;
            return _grabNewChunkWithRowPromise(new_index, false, null, false);
          case 3:
            _context7.next = 5;
            return _selectRow(new_index);
          case 5:
            _context7.next = 9;
            break;
          case 7:
            new_regions = [_table.Regions.row(new_index)];
            _updatePaneState({
              selected_resource: data_dict_ref.current[new_index],
              list_of_selected: [data_dict_ref.current[new_index].name],
              selectedRegions: new_regions
            });
          case 9:
          case "end":
            return _context7.stop();
        }
      }, _callee7);
    }));
    return _selectRow2.apply(this, arguments);
  }
  function _refresh_func() {
    return _refresh_func2.apply(this, arguments);
  }
  function _refresh_func2() {
    _refresh_func2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8() {
      var callback,
        _args8 = arguments;
      return _regeneratorRuntime().wrap(function _callee8$(_context8) {
        while (1) switch (_context8.prev = _context8.next) {
          case 0:
            callback = _args8.length > 0 && _args8[0] !== undefined ? _args8[0] : null;
            _context8.next = 3;
            return _grabNewChunkWithRow(0, true, null, true, callback);
          case 3:
          case "end":
            return _context8.stop();
        }
      }, _callee8);
    }));
    return _refresh_func2.apply(this, arguments);
  }
  function _setConsoleText(_x11) {
    return _setConsoleText2.apply(this, arguments);
  }
  function _setConsoleText2() {
    _setConsoleText2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(the_text) {
      return _regeneratorRuntime().wrap(function _callee9$(_context9) {
        while (1) switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return _updatePaneStatePromise({
              "console_text": the_text
            });
          case 2:
            if (console_text_ref && console_text_ref.current) {
              console_text_ref.current.scrollTop = console_text_ref.current.scrollHeight;
            }
          case 3:
          case "end":
            return _context9.stop();
        }
      }, _callee9);
    }));
    return _setConsoleText2.apply(this, arguments);
  }
  function _communicateColumnWidthSum(total_width) {
    set_total_width(total_width + 50);
  }
  var new_button_groups;
  var left_width = props.usable_width * props.left_width_fraction;
  var primary_mdata_fields = ["name", "created", "created_for_sort", "updated", "updated_for_sort", "tags", "notes"];
  var additional_metadata = {};
  for (var field in props.selected_resource) {
    if (!primary_mdata_fields.includes(field)) {
      additional_metadata[field] = props.selected_resource[field];
    }
  }
  if (Object.keys(additional_metadata).length == 0) {
    additional_metadata = null;
  }
  var right_pane;
  if (props.res_type == "container") {
    right_pane = /*#__PURE__*/_react["default"].createElement("div", {
      className: "d-flex d-inline",
      ref: console_text_ref,
      style: {
        height: "100%",
        overflow: "hidden",
        marginRight: 50
      }
    }, /*#__PURE__*/_react["default"].createElement(_searchable_console.SearchableConsole, {
      main_id: window.library_id,
      streaming_host: "host",
      container_id: props.selected_resource.Id,
      ref: null,
      outer_style: {
        overflowX: "auto",
        overflowY: "auto",
        height: console_usable_height - _sizing_tools.BOTTOM_MARGIN - 25,
        width: "100%",
        marginTop: 0,
        marginLeft: 5,
        marginRight: 0,
        padding: 15
      },
      showCommandField: true
    }));
  } else {
    right_pane = /*#__PURE__*/_react["default"].createElement("div", null);
  }
  var th_style = {
    "display": "inline-block",
    "verticalAlign": "top",
    "maxHeight": "100%",
    "overflowY": "scroll",
    "lineHeight": 1,
    "whiteSpace": "nowrap",
    "overflowX": "hidden"
  };
  var MenubarClass = props.MenubarClass;
  var column_specs = {};
  var _iterator2 = _createForOfIteratorHelper(props.colnames),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var col = _step2.value;
      column_specs[col] = {
        "sort_field": col,
        "first_sort": "ascending"
      };
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  var left_pane = /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-row",
    style: {
      "maxHeight": "100%"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    ref: table_ref,
    style: {
      width: table_usable_width,
      maxWidth: total_width,
      maxHeight: table_usable_height,
      padding: 15,
      marginTop: 10
    }
  }, /*#__PURE__*/_react["default"].createElement(_library_widgets.SearchForm, {
    allow_search_inside: false,
    allow_search_metadata: false,
    update_search_state: _update_search_state,
    search_string: props.search_string
  }), /*#__PURE__*/_react["default"].createElement(_library_widgets.BpSelectorTable, {
    data_dict: data_dict_ref.current,
    num_rows: num_rows,
    awaiting_data: awaiting_data,
    enableColumnResizing: true,
    sortColumn: _set_sort_state,
    selectedRegions: props.selectedRegions,
    communicateColumnWidthSum: _communicateColumnWidthSum,
    onSelection: _onTableSelection,
    initiateDataGrab: _initiateDataGrab,
    columns: column_specs,
    identifier_field: props.id_field
  }))));
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(MenubarClass, {
    selected_resource: props.selected_resource,
    list_of_selected: props.list_of_selected,
    setConsoleText: _setConsoleText,
    delete_row: _delete_row,
    refresh_func: _refresh_func
  }), /*#__PURE__*/_react["default"].createElement("div", {
    ref: top_ref,
    className: "d-flex flex-column mt-3"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      width: props.usable_width,
      height: props.usable_height
    }
  }, /*#__PURE__*/_react["default"].createElement(_resizing_layouts.HorizontalPanes, {
    left_pane: left_pane,
    right_pane: right_pane,
    show_handle: true,
    available_width: props.usable_width,
    available_height: table_usable_height,
    initial_width_fraction: .65,
    handleSplitUpdate: _handleSplitResize
  }))));
}
AdminPane.propTypes = {
  usable_height: _propTypes["default"].number,
  usable_width: _propTypes["default"].number,
  res_type: _propTypes["default"].string,
  allow_search_inside: _propTypes["default"].bool,
  allow_search_metadata: _propTypes["default"].bool,
  search_inside_view: _propTypes["default"].string,
  search_metadata_view: _propTypes["default"].string,
  is_repository: _propTypes["default"].bool,
  tsocket: _propTypes["default"].object,
  colnames: _propTypes["default"].array,
  id_field: _propTypes["default"].string
};
AdminPane.defaultProps = {
  is_repository: false,
  tsocket: null
};
exports.AdminPane = AdminPane = /*#__PURE__*/(0, _react.memo)(AdminPane);
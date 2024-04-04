"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BpSelectorTable = BpSelectorTable;
exports.SearchForm = SearchForm;
require("../tactic_css/tactic_select.scss");
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _objectHash = _interopRequireDefault(require("object-hash"));
var _core = require("@blueprintjs/core");
var _table = require("@blueprintjs/table");
var _lodash = _interopRequireDefault(require("lodash"));
var _utilities_react = require("./utilities_react");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
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
function SearchForm(props) {
  var _useState = (0, _react.useState)(null),
    _useState2 = _slicedToArray(_useState, 2),
    temp_text = _useState2[0],
    set_temp_text = _useState2[1];
  var _useDebounce = (0, _utilities_react.useDebounce)(function (newval) {
      props.update_search_state({
        "search_string": newval
      });
    }),
    _useDebounce2 = _slicedToArray(_useDebounce, 2),
    waiting = _useDebounce2[0],
    doUpdate = _useDebounce2[1];
  function _handleSearchFieldChange(event) {
    doUpdate(event.target.value);
    set_temp_text(event.target.value);
  }
  function _handleClearSearch() {
    props.update_search_state({
      "search_string": ""
    });
  }
  function _handleSearchMetadataChange(event) {
    props.update_search_state({
      "search_metadata": event.target.checked
    });
  }
  function _handleSearchInsideChange(event) {
    props.update_search_state({
      "search_inside": event.target.checked
    });
  }
  function _handleShowHiddenChange(event) {
    props.update_search_state({
      "show_hidden": event.target.checked
    });
  }
  function _handleRegexChange(event) {
    props.update_search_state({
      "regex": event.target.checked
    });
  }
  function _handleSubmit(event) {
    event.preventDefault();
  }
  var match_text;
  if (props.number_matches != null && props.search_string && props.search_string != "") {
    switch (props.number_matches) {
      case 0:
        match_text = "no matches";
        break;
      case 1:
        match_text = "1 match";
        break;
      default:
        match_text = "".concat(props.number_matches, " matches");
        break;
    }
  } else {
    match_text = null;
  }
  var current_text = waiting.current ? temp_text : props.search_string;
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    helperText: match_text,
    style: {
      marginBottom: 0
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-row",
    style: {
      marginTop: 5,
      marginBottom: 5
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
    type: "search",
    className: "search-input",
    placeholder: "Search",
    leftIcon: "search",
    value: current_text,
    onChange: _handleSearchFieldChange,
    style: {
      "width": props.field_width
    },
    autoCapitalize: "none",
    autoCorrect: "off",
    small: true,
    inputRef: props.search_ref
  }), props.allow_regex && /*#__PURE__*/_react["default"].createElement(_core.Switch, {
    label: "regexp",
    className: "ml-3 mb-0 mt-1",
    large: false,
    checked: props.regex,
    onChange: _handleRegexChange
  }), props.allow_search_metadata && /*#__PURE__*/_react["default"].createElement(_core.Switch, {
    label: "metadata",
    className: "ml-3 mb-0 mt-1",
    large: false,
    checked: props.search_metadata,
    onChange: _handleSearchMetadataChange
  }), props.allow_search_inside && /*#__PURE__*/_react["default"].createElement(_core.Switch, {
    label: "inside",
    className: "ml-3 mb-0 mt-1",
    large: false,
    checked: props.search_inside,
    onChange: _handleSearchInsideChange
  }), props.allow_show_hidden && /*#__PURE__*/_react["default"].createElement(_core.Switch, {
    label: "show hidden",
    className: "ml-3 mb-0 mt-1",
    large: false,
    checked: props.show_hidden,
    onChange: _handleShowHiddenChange
  }), props.include_search_jumper && /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, {
    style: {
      marginLeft: 5,
      padding: 2
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
    onClick: props.searchNext,
    icon: "caret-down",
    text: undefined,
    small: true
  }), /*#__PURE__*/_react["default"].createElement(_core.Button, {
    onClick: props.searchPrev,
    icon: "caret-up",
    text: undefined,
    small: true
  })))));
}
exports.SearchForm = SearchForm = /*#__PURE__*/(0, _react.memo)(SearchForm);
SearchForm.propTypes = {
  allow_search_inside: _propTypes["default"].bool,
  allow_search_metadata: _propTypes["default"].bool,
  allow_show_hidden: _propTypes["default"].bool,
  allow_regex: _propTypes["default"].bool,
  regex: _propTypes["default"].bool,
  update_search_state: _propTypes["default"].func,
  search_string: _propTypes["default"].string,
  search_inside: _propTypes["default"].bool,
  search_metadata: _propTypes["default"].bool,
  show_hidden: _propTypes["default"].bool,
  field_with: _propTypes["default"].number,
  include_search_jumper: _propTypes["default"].bool,
  searchNext: _propTypes["default"].func,
  searchPrev: _propTypes["default"].func,
  search_ref: _propTypes["default"].object,
  number_matches: _propTypes["default"].number,
  update_delay: _propTypes["default"].number
};
SearchForm.defaultProps = {
  allow_search_inside: false,
  allow_search_metadata: false,
  allow_show_hidden: false,
  allow_regex: false,
  regex: false,
  search_inside: false,
  search_metadata: false,
  show_hidden: false,
  field_width: 265,
  include_search_jumper: false,
  current_search_number: null,
  searchNext: null,
  searchPrev: null,
  search_ref: null,
  number_matches: null,
  update_delay: 500
};
function BpSelectorTable(props) {
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)(null),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    columnWidths = _useStateAndRef2[0],
    setColumnWidths = _useStateAndRef2[1],
    columnWidthsRef = _useStateAndRef2[2];
  var saved_data_dict = (0, _react.useRef)(null);
  var data_update_required = (0, _react.useRef)(null);
  var table_ref = (0, _react.useRef)(null);
  (0, _react.useEffect)(function () {
    computeColumnWidths();
    saved_data_dict.current = props.data_dict;
  }, []);
  (0, _react.useEffect)(function () {
    if (columnWidthsRef.current == null || !_lodash["default"].isEqual(props.data_dict, saved_data_dict.current)) {
      computeColumnWidths();
      saved_data_dict.current = props.data_dict;
    }
  });
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  function computeColumnWidths() {
    if (Object.keys(props.data_dict).length == 0) return;
    var column_names = Object.keys(props.columns);
    var bcwidths = compute_initial_column_widths(column_names, Object.values(props.data_dict));
    var cwidths = [];
    if (props.maxColumnWidth) {
      var _iterator = _createForOfIteratorHelper(bcwidths),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var c = _step.value;
          if (c > props.maxColumnWidth) {
            cwidths.push(props.maxColumnWidth);
          } else {
            cwidths.push(c);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    } else {
      cwidths = bcwidths;
    }
    setColumnWidths(cwidths);
    pushCallback(function () {
      var the_sum = columnWidthsRef.current.reduce(function (a, b) {
        return a + b;
      }, 0);
      props.communicateColumnWidthSum(the_sum);
    });
  }
  function _onCompleteRender() {
    return _onCompleteRender2.apply(this, arguments);
  }
  function _onCompleteRender2() {
    _onCompleteRender2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var lastColumnRegion, firstColumnRegion;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            if (!(data_update_required.current != null)) {
              _context.next = 4;
              break;
            }
            _context.next = 3;
            return props.initiateDataGrab(data_update_required.current);
          case 3:
            data_update_required.current = null;
          case 4:
            lastColumnRegion = _table.Regions.column(Object.keys(props.columns).length - 1);
            firstColumnRegion = _table.Regions.column(0);
            table_ref.current.scrollToRegion(lastColumnRegion);
            table_ref.current.scrollToRegion(firstColumnRegion);
          case 8:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return _onCompleteRender2.apply(this, arguments);
  }
  function haveRowData(rowIndex) {
    return props.data_dict.hasOwnProperty(rowIndex);
  }
  function _cellRendererCreator(column_name) {
    return function (rowIndex) {
      if (!haveRowData(rowIndex)) {
        if (data_update_required.current == null) {
          data_update_required.current = rowIndex;
        }
        return /*#__PURE__*/_react["default"].createElement(_table.Cell, {
          key: column_name,
          loading: true
        });
      }
      var the_body;
      var the_class = "";
      if (Object.keys(props.data_dict[rowIndex]).includes(column_name)) {
        if ("hidden" in props.data_dict[rowIndex] && props.data_dict[rowIndex]["hidden"]) {
          the_class = "hidden_cell";
        }
        var the_text = String(props.data_dict[rowIndex][column_name]);
        if (the_text.startsWith("icon:")) {
          the_text = the_text.replace(/(^icon:)/gi, "");
          the_body = /*#__PURE__*/_react["default"].createElement(_core.Icon, {
            icon: the_text,
            size: 14
          });
        } else {
          the_body = /*#__PURE__*/_react["default"].createElement(_table.TruncatedFormat, {
            className: the_class
          }, the_text);
        }
      } else {
        the_body = "";
      }
      var tclass;
      if (props.open_resources_ref && props.open_resources_ref.current && props.open_resources_ref.current.includes(props.data_dict[rowIndex][props.identifier_field])) {
        tclass = "open-selector-row";
      } else {
        tclass = "";
      }
      return /*#__PURE__*/_react["default"].createElement(_table.Cell, {
        key: column_name,
        interactive: true,
        truncated: true,
        tabIndex: -1,
        onKeyDown: props.keyHandler,
        wrapText: true
      }, /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
        className: tclass,
        onDoubleClick: function onDoubleClick() {
          return props.handleRowDoubleClick(props.data_dict[rowIndex]);
        }
      }, the_body)));
    };
  }
  function _renderMenu(sortColumn) {
    var sortAsc = function sortAsc() {
      props.sortColumn(sortColumn, "ascending");
    };
    var sortDesc = function sortDesc() {
      props.sortColumn(sortColumn, "descending");
    };
    return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "sort-asc",
      onClick: sortAsc,
      text: "Sort Asc"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "sort-desc",
      onClick: sortDesc,
      text: "Sort Desc"
    }));
  }
  function _columnHeaderNameRenderer(the_text) {
    var the_body;
    the_text = String(the_text);
    if (the_text.startsWith("icon:")) {
      the_text = the_text.replace(/(^icon:)/gi, "");
      the_body = /*#__PURE__*/_react["default"].createElement(_core.Icon, {
        icon: the_text,
        size: 14
      });
    } else {
      the_body = /*#__PURE__*/_react["default"].createElement("div", {
        className: "bp5-table-truncated-text"
      }, the_text);
    }
    return the_body;
  }
  var column_names = Object.keys(props.columns);
  var columns = column_names.map(function (column_name) {
    var cellRenderer = _cellRendererCreator(column_name);
    var columnHeaderCellRenderer = function columnHeaderCellRenderer() {
      return /*#__PURE__*/_react["default"].createElement(_table.ColumnHeaderCell, {
        name: column_name,
        nameRenderer: _columnHeaderNameRenderer,
        menuRenderer: function menuRenderer() {
          return _renderMenu(column_name);
        }
      });
    };
    return /*#__PURE__*/_react["default"].createElement(_table.Column, {
      cellRenderer: cellRenderer,
      enableColumnReordering: false,
      columnHeaderCellRenderer: columnHeaderCellRenderer,
      key: column_name,
      name: column_name
    });
  });
  var obj = {
    cwidths: columnWidths,
    nrows: props.num_rows
  };
  var hsh = (0, _objectHash["default"])(obj);
  var dependencies;
  if (props.open_resources_ref && props.open_resources_ref.current) {
    dependencies = [props.data_dict, props.open_resources_ref.current];
  } else {
    dependencies = [props.data_dict];
  }
  return /*#__PURE__*/_react["default"].createElement(_core.HotkeysProvider, null, /*#__PURE__*/_react["default"].createElement(_table.Table2, {
    numRows: props.num_rows,
    ref: table_ref,
    cellRendererDependencies: dependencies,
    bodyContextMenuRenderer: props.renderBodyContextMenu,
    enableColumnReordering: false,
    enableColumnResizing: props.enableColumnResizing,
    maxColumnWidth: props.maxColumnWidth,
    enableMultipleSelection: true,
    defaultRowHeight: 23,
    selectedRegions: props.selectedRegions,
    enableRowHeader: false,
    columnWidths: columnWidthsRef.current,
    onCompleteRender: _onCompleteRender,
    selectionModes: [_table.RegionCardinality.FULL_ROWS, _table.RegionCardinality.CELLS],
    onSelection: function onSelection(regions) {
      return props.onSelection(regions);
    }
  }, columns));
}
exports.BpSelectorTable = BpSelectorTable = /*#__PURE__*/(0, _react.memo)(BpSelectorTable);
BpSelectorTable.propTypes = {
  columns: _propTypes["default"].object,
  open_resources_ref: _propTypes["default"].object,
  maxColumnWidth: _propTypes["default"].number,
  enableColumnResizing: _propTypes["default"].bool,
  selectedRegions: _propTypes["default"].array,
  data_dict: _propTypes["default"].object,
  num_rows: _propTypes["default"].number,
  keyHandler: _propTypes["default"].func,
  communicateColumnWidthSum: _propTypes["default"].func,
  sortColumn: _propTypes["default"].func,
  onSelection: _propTypes["default"].func,
  handleRowDoubleClick: _propTypes["default"].func,
  identifier_field: _propTypes["default"].string,
  rowChanged: _propTypes["default"].number
};
BpSelectorTable.defaultProps = {
  columns: {
    "name": {
      "sort_field": "name",
      "first_sort": "ascending"
    },
    "created": {
      "sort_field": "created_for_sort",
      "first_sort": "descending"
    },
    "updated": {
      "sort_field": "updated_for_sort",
      "first_sort": "ascending"
    },
    "tags": {
      "sort_field": "tags",
      "first_sort": "ascending"
    }
  },
  identifier_field: "name",
  enableColumnResigin: false,
  maxColumnWidth: null,
  active_row: 0,
  show_animations: false,
  handleSpaceBarPress: null,
  keyHandler: null,
  draggable: true,
  rowChanged: 0
};
var MAX_INITIAL_CELL_WIDTH = 300;
var ICON_WIDTH = 35;
function compute_initial_column_widths(header_list, data_list) {
  var ncols = header_list.length;
  var max_field_width = MAX_INITIAL_CELL_WIDTH;

  // Get sample header and body cells

  // set up a canvas so that we can use it to compute the width of text
  // let body_font = $($(".bp5-table-truncated-text")[0]).css("font");
  var element = document.querySelector(".bp5-table-truncated-text");
  var body_font = window.getComputedStyle(element).getPropertyValue("font");
  //let header_font = $($(".bp5-table-column-name-text")[0]).css("font");
  var header_element = document.querySelector(".bp5-table-column-name-text");
  var header_font = window.getComputedStyle(header_element).getPropertyValue("font");
  var canvas_element = document.getElementById("measure-canvas");
  var ctx = canvas_element.getContext("2d");
  var added_body_width = 20;
  var added_header_width = 30;
  var column_widths = {};
  var columns_remaining = [];
  ctx.font = header_font;
  var _iterator2 = _createForOfIteratorHelper(header_list),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var c = _step2.value;
      var cstr = String(c);
      if (cstr.startsWith("icon:")) {
        column_widths[cstr] = ICON_WIDTH;
      } else {
        column_widths[cstr] = ctx.measureText(cstr).width + added_header_width;
      }
      columns_remaining.push(cstr);
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  var the_row;
  var the_width;
  var the_text;
  var the_child;

  // Find the width of each body cell
  // Keep track of the largest value for each column
  // Once a column has the max value can ignore that column in the future.
  ctx.font = body_font;
  var _iterator3 = _createForOfIteratorHelper(data_list),
    _step3;
  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var item = _step3.value;
      if (columns_remaining.length == 0) {
        break;
      }
      the_row = item;
      var cols_to_remove = [];
      var _iterator5 = _createForOfIteratorHelper(columns_remaining),
        _step5;
      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var _c2 = _step5.value;
          the_text = String(the_row[_c2]);
          if (the_text.startsWith("icon:")) {
            the_width = ICON_WIDTH;
          } else {
            the_width = ctx.measureText(the_text).width + added_body_width;
          }
          if (the_width > max_field_width) {
            the_width = max_field_width;
            cols_to_remove.push(_c2);
          }
          if (the_width > column_widths[_c2]) {
            column_widths[_c2] = the_width;
          }
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
      for (var _i2 = 0, _cols_to_remove = cols_to_remove; _i2 < _cols_to_remove.length; _i2++) {
        var _c = _cols_to_remove[_i2];
        var index = columns_remaining.indexOf(_c);
        if (index !== -1) {
          columns_remaining.splice(index, 1);
        }
      }
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
  var result = [];
  var _iterator4 = _createForOfIteratorHelper(header_list),
    _step4;
  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var _c3 = _step4.value;
      result.push(column_widths[_c3]);
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }
  return result;
}
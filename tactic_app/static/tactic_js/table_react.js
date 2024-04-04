"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FreeformBody = FreeformBody;
exports.MainTableCard = MainTableCard;
exports.MainTableCardHeader = MainTableCardHeader;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
var _blueprint_react_widgets = require("./blueprint_react_widgets");
var _reactCodemirror = require("./react-codemirror");
var _blueprint_mdata_fields = require("./blueprint_mdata_fields");
var _communication_react = require("./communication_react");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
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
function FreeformBody(props) {
  var top_ref = (0, _react.useRef)(null);
  var cmobject = (0, _react.useRef)(null);
  var overlay = (0, _react.useRef)(null);
  function _setCMObject(lcmobject) {
    cmobject.current = lcmobject;
  }
  function _clearSearch() {
    if (cmobject.current && overlay.current) {
      cmobject.current.removeOverlay(overlay.current);
      overlay.current = null;
    }
  }
  function _doSearch() {
    if (props.mState.alt_search_text && props.mState.alt_search_text != "" && cmobject.current) {
      overlay.current = mySearchOverlay(props.mState.alt_search_text, true);
      cmobject.current.addOverlay(overlay.current);
    } else if (props.mState.search_text && props.mState.search_text != "" && cmobject) {
      overlay.current = mySearchOverlay(props.mState.search_text, true);
      cmobject.current.addOverlay(overlay.current);
    }
  }
  function mySearchOverlay(query, caseInsensitive) {
    if (typeof query == "string") {
      // noinspection RegExpRedundantEscape
      query = new RegExp(query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), caseInsensitive ? "gi" : "g");
    } else if (!query.global) query = new RegExp(query.source, query.ignoreCase ? "gi" : "g");
    return {
      token: function token(stream) {
        query.lastIndex = stream.pos;
        var match = query.exec(stream.string);
        if (match && match.index == stream.pos) {
          stream.pos += match[0].length || 1;
          return "searching"; // I believe this causes the style .cm-searching to be applied
        } else if (match) {
          stream.pos = match.index;
        } else {
          stream.skipToEnd();
        }
      }
    };
  }
  function _handleBlur(new_data_text) {
    (0, _communication_react.postWithCallback)(props.main_id, "add_freeform_document", {
      document_name: props.mState.table_spec.document_name,
      doc_text: new_data_text
    }, null);
  }
  function _handleChange(new_data_text) {}
  _clearSearch();
  _doSearch();
  return /*#__PURE__*/_react["default"].createElement("div", {
    ref: top_ref
  }, /*#__PURE__*/_react["default"].createElement(_reactCodemirror.ReactCodemirror, {
    handleBlur: _handleBlur,
    handleChange: null,
    code_content: props.mState.data_text,
    sync_to_prop: true,
    soft_wrap: props.mState.soft_wrap,
    mode: "Plain Text",
    setCMObject: _setCMObject,
    readOnly: false
  }));
}

// FreeformBody.propTypes = {
//     main_id: PropTypes.string,
//     document_name: PropTypes.string,
//     my_ref: PropTypes.object,
//     data_text: PropTypes.string,
//     code_container_height: PropTypes.number,
//     search_text: PropTypes.string,
//     alt_search_text: PropTypes.string,
//     setMainStateValue: PropTypes.func,
//     soft_wrap: PropTypes.bool,
// };

exports.FreeformBody = FreeformBody = /*#__PURE__*/(0, _react.memo)(FreeformBody);
function SmallSpinner() {
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex"
  }, /*#__PURE__*/_react["default"].createElement("span", {
    className: " loader-small"
  }));
}
function MainTableCardHeader(props) {
  var heading_left_ref = (0, _react.useRef)(null);
  var heading_right_ref = (0, _react.useRef)(null);
  var _useState = (0, _react.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    hide_right_element = _useState2[0],
    set_hide_right_element = _useState2[1];
  (0, _react.useEffect)(function () {
    var hide_right = _getHideRight();
    if (hide_right != hide_right_element) {
      set_hide_right_element(hide_right);
    }
  });
  function _getHideRight() {
    var le_rect = heading_left_ref.current.getBoundingClientRect();
    var re_rect = heading_right_ref.current.getBoundingClientRect();
    return re_rect.x < le_rect.x + le_rect.width + 10;
  }
  function _handleSearchFieldChange(event) {
    props.handleSearchFieldChange(event.target.value);
  }
  function _handleFilter() {
    return _handleFilter2.apply(this, arguments);
  }
  function _handleFilter2() {
    _handleFilter2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var data_dict;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            data_dict = {
              "text_to_find": props.mState.search_text
            };
            _context.prev = 1;
            _context.next = 4;
            return (0, _communication_react.postPromise)(props.main_id, "UnfilterTable", data_dict);
          case 4:
            if (!(props.search_text !== "")) {
              _context.next = 8;
              break;
            }
            _context.next = 7;
            return (0, _communication_react.postPromise)(props.main_id, "FilterTable", data_dict);
          case 7:
            props.setMainStateValue({
              "table_is_filtered": true,
              "selected_regions": null,
              "selected_row": null
            });
          case 8:
            _context.next = 13;
            break;
          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](1);
            errorDrawerFuncs.addFromError("Error filtering table", _context.t0);
          case 13:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[1, 10]]);
    }));
    return _handleFilter2.apply(this, arguments);
  }
  function _handleUnFilter() {
    return _handleUnFilter2.apply(this, arguments);
  }
  function _handleUnFilter2() {
    _handleUnFilter2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            props.handleSearchFieldChange(null);
            _context2.prev = 1;
            if (!props.mState.table_is_filtered) {
              _context2.next = 6;
              break;
            }
            _context2.next = 5;
            return (0, _communication_react.postPromise)(props.main_id, "UnfilterTable", {
              selected_row: props.mState.selected_row
            });
          case 5:
            props.setMainStateValue({
              "table_is_filtered": false,
              "selected_regions": null,
              "selected_row": null
            });
          case 6:
            _context2.next = 12;
            break;
          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2["catch"](1);
            errorDrawerFuncs.addFromError("Error unfiltering table", _context2.t0);
            return _context2.abrupt("return");
          case 12:
          case "end":
            return _context2.stop();
        }
      }, _callee2, null, [[1, 8]]);
    }));
    return _handleUnFilter2.apply(this, arguments);
  }
  function _handleSubmit(e) {
    e.preventDefault();
  }
  function _onChangeDoc(value) {
    props.handleChangeDoc(value);
  }
  var heading_right_opacity = hide_right_element ? 0 : 100;
  var select_style = {
    height: 30,
    maxWidth: 250
  };
  var doc_button_text = /*#__PURE__*/_react["default"].createElement(_core.Text, {
    ellipsize: true
  }, props.mState.table_spec.current_doc_name);
  var self = this;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex pl-2 pr-2 justify-content-between align-baseline main-heading",
    style: {
      height: 50
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    id: "heading-left",
    ref: heading_left_ref,
    className: "d-flex flex-column justify-content-around"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: props.toggleShrink,
    icon: "minimize"
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-column justify-content-around"
  }, /*#__PURE__*/_react["default"].createElement("form", {
    className: "d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: props.mState.short_collection_name,
    inline: true,
    style: {
      marginBottom: 0,
      marginLeft: 5,
      marginRight: 10
    }
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_mdata_fields.BpSelect, {
    options: props.mState.doc_names,
    onChange: _onChangeDoc,
    buttonStyle: select_style,
    buttonTextObject: doc_button_text,
    value: props.mState.table_spec.current_doc_name
  })), props.mState.show_table_spinner && /*#__PURE__*/_react["default"].createElement(_core.Spinner, {
    size: 15
  }))))), /*#__PURE__*/_react["default"].createElement("div", {
    id: "heading-right",
    ref: heading_right_ref,
    style: {
      opacity: heading_right_opacity
    },
    className: "d-flex flex-column justify-content-around"
  }, /*#__PURE__*/_react["default"].createElement("form", {
    onSubmit: _handleSubmit,
    style: {
      alignItems: "center"
    },
    className: "d-flex flex-row"
  }, props.is_freeform && /*#__PURE__*/_react["default"].createElement(_core.Switch, {
    label: "soft wrap",
    className: "mr-2 mb-0",
    large: false,
    checked: props.mState.soft_wrap,
    onChange: props.handleSoftWrapChange
  }), /*#__PURE__*/_react["default"].createElement(_core.Switch, {
    label: "edit",
    className: "mr-4 mb-0",
    large: false,
    checked: props.mState.spreadsheet_mode,
    onChange: props.handleSpreadsheetModeChange
  }), /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
    type: "search",
    leftIcon: "search",
    placeholder: "Search",
    value: !props.mState.search_text ? "" : props.mState.search_text,
    onChange: _handleSearchFieldChange,
    autoCapitalize: "none",
    autoCorrect: "off",
    className: "mr-2"
  }), /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, null, props.show_filter_button && /*#__PURE__*/_react["default"].createElement(_core.Button, {
    onClick: _handleFilter
  }, "Filter"), /*#__PURE__*/_react["default"].createElement(_core.Button, {
    onClick: _handleUnFilter
  }, "Clear")))));
}
MainTableCardHeader.propTypes = {
  toggleShrink: _propTypes["default"].func,
  selected_row: _propTypes["default"].number,
  table_is_filtered: _propTypes["default"].bool,
  setMainStateValue: _propTypes["default"].func,
  handleSearchFieldChange: _propTypes["default"].func,
  search_text: _propTypes["default"].string,
  handleFilter: _propTypes["default"].func,
  short_collection_name: _propTypes["default"].string,
  current_doc_name: _propTypes["default"].string,
  handleChangeDoc: _propTypes["default"].func,
  spreadsheet_mode: _propTypes["default"].bool,
  handleSpreadsheetModeChange: _propTypes["default"].func,
  doc_names: _propTypes["default"].array,
  show_table_spinner: _propTypes["default"].bool,
  show_filter_button: _propTypes["default"].bool,
  is_freeform: _propTypes["default"].bool,
  soft_wrap: _propTypes["default"].bool,
  handleSoftWrapChange: _propTypes["default"].func
};
MainTableCardHeader.defaultProps = {
  is_freeform: false,
  soft_wrap: false,
  handleSoftWrapChange: null
};
exports.MainTableCardHeader = MainTableCardHeader = /*#__PURE__*/(0, _react.memo)(MainTableCardHeader);
var MAX_INITIAL_CELL_WIDTH = 400;
var EXTRA_TABLE_AREA_SPACE = 500;
function MainTableCard(props) {
  return /*#__PURE__*/_react["default"].createElement(_core.Card, {
    id: "main-panel",
    elevation: 2
  }, props.card_header, /*#__PURE__*/_react["default"].createElement("div", {
    id: "table-wrapper"
  }, props.card_body));
}
MainTableCard.propTypes = {
  card_body: _propTypes["default"].object,
  card_header: _propTypes["default"].object
};
exports.MainTableCard = MainTableCard = /*#__PURE__*/(0, _react.memo)(MainTableCard);
function compute_added_column_width(header_text) {
  var max_field_width = MAX_INITIAL_CELL_WIDTH;
  var header_cell = $($("#table-wrapper th")[0]);
  var header_font = header_cell.css("font");
  var canvas_element = document.getElementById("measure-canvas");
  var ctx = canvas_element.getContext("2d");
  var added_header_width = parseInt(header_cell.css("padding-right")) + parseInt(header_cell.css("padding-left")) + 2;
  ctx.font = header_font;
  return ctx.measureText(header_text).width + added_header_width;
}
function compute_initial_column_widths(header_list) {
  var ncols = header_list.length;
  var max_field_width = MAX_INITIAL_CELL_WIDTH;

  // Get sample header and body cells
  var header_cell = $($("#table-wrapper th")[0]);
  var body_cell = $($("#table-wrapper td")[0]);

  // set up a canvas so that we can use it to compute the width of text
  var header_font = header_cell.css("font");
  var body_font = body_cell.css("font");
  var canvas_element = document.getElementById("measure-canvas");
  var ctx = canvas_element.getContext("2d");
  var added_header_width = parseInt(header_cell.css("padding-right")) + parseInt(header_cell.css("padding-left")) + 2;
  var added_body_width = parseInt(body_cell.css("padding-right")) + parseInt(body_cell.css("padding-left")) + 2;
  var header_row = $("#table-area thead tr")[0];
  var body_rows = $("#table-area tbody tr");
  var column_widths = [];
  var columns_remaining = [];
  for (var c = 0; c < ncols; ++c) {
    column_widths.push(0);
    columns_remaining.push(c);
  }
  // Get the width for each header column
  ctx.font = header_font;
  var the_row;
  var the_width;
  var the_text;
  var the_child;
  for (var _i2 = 0, _columns_remaining = columns_remaining; _i2 < _columns_remaining.length; _i2++) {
    var _c = _columns_remaining[_i2];
    the_child = header_row.cells[_c];
    the_text = the_child.innerText;
    the_width = ctx.measureText(the_text).width + added_header_width;
    if (the_width > max_field_width) {
      the_width = max_field_width;
      var index = columns_remaining.indexOf(_c);
      if (index !== -1) {
        columns_remaining.splice(index, 1);
      }
    }
    if (the_width > column_widths[_c]) {
      column_widths[_c] = the_width;
    }
  }

  // Find the width of each body cell
  // Keep track of the largest value for each column
  // Once a column has the max value can ignore that column in the future.
  ctx.font = body_font;
  for (var r = 0; r < body_rows.length; ++r) {
    if (columns_remaining.length == 0) {
      break;
    }
    the_row = body_rows[r];
    if ($(the_row).hasClass("spinner-row")) continue;
    var cols_to_remove = [];
    var _iterator = _createForOfIteratorHelper(columns_remaining),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _c3 = _step.value;
        the_child = the_row.cells[_c3];
        the_text = the_child.innerText;
        the_width = ctx.measureText(the_text).width + added_body_width;
        if (the_width > max_field_width) {
          the_width = max_field_width;
          cols_to_remove.push(_c3);
        }
        if (the_width > column_widths[_c3]) {
          column_widths[_c3] = the_width;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    for (var _i3 = 0, _cols_to_remove = cols_to_remove; _i3 < _cols_to_remove.length; _i3++) {
      var _c2 = _cols_to_remove[_i3];
      var _index = columns_remaining.indexOf(_c2);
      if (_index !== -1) {
        columns_remaining.splice(_index, 1);
      }
    }
  }
  return column_widths;
}
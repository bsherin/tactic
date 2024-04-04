"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LibraryPane = LibraryPane;
exports.res_types = void 0;
exports.view_views = view_views;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
var _popover = require("@blueprintjs/popover2");
var _table = require("@blueprintjs/table");
var _lodash = _interopRequireDefault(require("lodash"));
var _blueprint_mdata_fields = require("./blueprint_mdata_fields");
var _resizing_layouts = require("./resizing_layouts2");
var _communication_react = require("./communication_react");
var _sizing_tools = require("./sizing_tools");
var _toaster = require("./toaster.js");
var _key_trap = require("./key_trap.js");
var _utilities_react = require("./utilities_react");
var _theme = require("./theme");
var _modal_react = require("./modal_react");
var _toaster2 = require("./toaster");
var _error_drawer = require("./error_drawer");
var _library_table_pane = require("./library_table_pane");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; } // noinspection JSValidateTypes,JSDeprecatedSymbols
var res_types = ["collection", "project", "tile", "list", "code"];
exports.res_types = res_types;
function view_views() {
  var is_repository = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  if (is_repository) {
    return {
      collection: null,
      project: null,
      tile: "/repository_view_module/",
      list: "/repository_view_list/",
      code: "/repository_view_code/"
    };
  } else {
    return {
      collection: "/main_collection/",
      project: "/main_project/",
      tile: "/last_saved_view/",
      list: "/view_list/",
      code: "/view_code/"
    };
  }
}
function duplicate_views() {
  var is_repository = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  return {
    collection: "/duplicate_collection",
    project: "/duplicate_project",
    tile: "/create_duplicate_tile",
    list: "/create_duplicate_list",
    code: "/create_duplicate_code"
  };
}
function BodyMenu(props) {
  function getIntent(item) {
    return item.intent ? item.intent : null;
  }
  var menu_items = props.items.map(function (item, index) {
    if (item.text == "__divider__") {
      return /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, {
        key: index
      });
    } else {
      var the_row = props.selected_rows[0];
      var disabled = item.res_type && the_row.res_type != item.res_type;
      return /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: item.icon,
        disabled: disabled,
        onClick: function onClick() {
          return item.onClick(the_row);
        },
        intent: getIntent(item),
        key: item.text,
        text: item.text
      });
    }
  });
  return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, {
    title: props.selected_rows[0].name,
    className: "context-menu-header"
  }), menu_items);
}
BodyMenu.propTypes = {
  items: _propTypes["default"].array,
  selected_rows: _propTypes["default"].array
};
function LibraryPane(props) {
  var top_ref = (0, _react.useRef)(null);
  var previous_search_spec = (0, _react.useRef)(null);
  var socket_counter = (0, _react.useRef)(null);
  var blank_selected_resource = (0, _react.useRef)({});
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)({}),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    data_dict = _useStateAndRef2[0],
    set_data_dict = _useStateAndRef2[1],
    data_dict_ref = _useStateAndRef2[2];
  var _useState = (0, _react.useState)(0),
    _useState2 = _slicedToArray(_useState, 2),
    num_rows = _useState2[0],
    set_num_rows = _useState2[1];
  var _useStateAndRef3 = (0, _utilities_react.useStateAndRef)([]),
    _useStateAndRef4 = _slicedToArray(_useStateAndRef3, 3),
    tag_list = _useStateAndRef4[0],
    set_tag_list = _useStateAndRef4[1],
    tag_list_ref = _useStateAndRef4[2];
  var _useState3 = (0, _react.useState)([]),
    _useState4 = _slicedToArray(_useState3, 2),
    contextMenuItems = _useState4[0],
    setContextMenuItems = _useState4[1];
  var _useStateAndRef5 = (0, _utilities_react.useStateAndRef)({
      "name": "",
      "_id": "",
      "tags": "",
      "notes": "",
      "updated": "",
      "created": ""
    }),
    _useStateAndRef6 = _slicedToArray(_useStateAndRef5, 3),
    selected_resource = _useStateAndRef6[0],
    set_selected_resource = _useStateAndRef6[1],
    selected_resource_ref = _useStateAndRef6[2];
  var _useStateAndRef7 = (0, _utilities_react.useStateAndRef)([]),
    _useStateAndRef8 = _slicedToArray(_useStateAndRef7, 3),
    selected_rows = _useStateAndRef8[0],
    set_selected_rows = _useStateAndRef8[1],
    selected_rows_ref = _useStateAndRef8[2];
  var _useStateAndRef9 = (0, _utilities_react.useStateAndRef)([]),
    _useStateAndRef10 = _slicedToArray(_useStateAndRef9, 3),
    expanded_tags = _useStateAndRef10[0],
    set_expanded_tags = _useStateAndRef10[1],
    expanded_tags_ref = _useStateAndRef10[2];
  var _useStateAndRef11 = (0, _utilities_react.useStateAndRef)("all"),
    _useStateAndRef12 = _slicedToArray(_useStateAndRef11, 3),
    active_tag = _useStateAndRef12[0],
    set_active_tag = _useStateAndRef12[1],
    active_tag_ref = _useStateAndRef12[2];
  var _useStateAndRef13 = (0, _utilities_react.useStateAndRef)("updated"),
    _useStateAndRef14 = _slicedToArray(_useStateAndRef13, 3),
    sort_field = _useStateAndRef14[0],
    set_sort_field = _useStateAndRef14[1],
    sort_field_ref = _useStateAndRef14[2];
  var _useStateAndRef15 = (0, _utilities_react.useStateAndRef)("descending"),
    _useStateAndRef16 = _slicedToArray(_useStateAndRef15, 3),
    sort_direction = _useStateAndRef16[0],
    set_sort_direction = _useStateAndRef16[1],
    sort_direction_ref = _useStateAndRef16[2];
  var _useStateAndRef17 = (0, _utilities_react.useStateAndRef)(props.pane_type),
    _useStateAndRef18 = _slicedToArray(_useStateAndRef17, 3),
    filterType = _useStateAndRef18[0],
    setFilterType = _useStateAndRef18[1],
    filterTypeRef = _useStateAndRef18[2];
  var _useStateAndRef19 = (0, _utilities_react.useStateAndRef)(false),
    _useStateAndRef20 = _slicedToArray(_useStateAndRef19, 3),
    multi_select = _useStateAndRef20[0],
    set_multi_select = _useStateAndRef20[1],
    multi_select_ref = _useStateAndRef20[2];
  var _useStateAndRef21 = (0, _utilities_react.useStateAndRef)([]),
    _useStateAndRef22 = _slicedToArray(_useStateAndRef21, 3),
    list_of_selected = _useStateAndRef22[0],
    set_list_of_selected = _useStateAndRef22[1],
    list_of_selected_ref = _useStateAndRef22[2];
  var _useStateAndRef23 = (0, _utilities_react.useStateAndRef)(""),
    _useStateAndRef24 = _slicedToArray(_useStateAndRef23, 3),
    search_string = _useStateAndRef24[0],
    set_search_string = _useStateAndRef24[1],
    search_string_ref = _useStateAndRef24[2];
  var _useStateAndRef25 = (0, _utilities_react.useStateAndRef)(false),
    _useStateAndRef26 = _slicedToArray(_useStateAndRef25, 3),
    search_inside = _useStateAndRef26[0],
    set_search_inside = _useStateAndRef26[1],
    search_inside_ref = _useStateAndRef26[2];
  var _useStateAndRef27 = (0, _utilities_react.useStateAndRef)(false),
    _useStateAndRef28 = _slicedToArray(_useStateAndRef27, 3),
    search_metadata = _useStateAndRef28[0],
    set_search_metadata = _useStateAndRef28[1],
    search_metadata_ref = _useStateAndRef28[2];
  var _useStateAndRef29 = (0, _utilities_react.useStateAndRef)(false),
    _useStateAndRef30 = _slicedToArray(_useStateAndRef29, 3),
    show_hidden = _useStateAndRef30[0],
    set_show_hidden = _useStateAndRef30[1],
    show_hidden_ref = _useStateAndRef30[2];
  var _useStateAndRef31 = (0, _utilities_react.useStateAndRef)([_table.Regions.row(0)]),
    _useStateAndRef32 = _slicedToArray(_useStateAndRef31, 3),
    selectedRegions = _useStateAndRef32[0],
    setSelectedRegions = _useStateAndRef32[1],
    selectedRegionsRef = _useStateAndRef32[2];
  var _useState5 = (0, _react.useState)(0),
    _useState6 = _slicedToArray(_useState5, 2),
    rowChanged = _useState6[0],
    setRowChanged = _useState6[1];
  var selectedTypeRef = (0, _react.useRef)(null);
  var _useSize = (0, _sizing_tools.useSize)(top_ref, 0, "LibraryPane"),
    _useSize2 = _slicedToArray(_useSize, 4),
    usable_width = _useSize2[0],
    usable_height = _useSize2[1],
    topX = _useSize2[2],
    topY = _useSize2[3];
  var theme = (0, _react.useContext)(_theme.ThemeContext);
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  var statusFuncs = (0, _react.useContext)(_toaster2.StatusContext);
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  var stateSetters = {
    data_dict: set_data_dict,
    num_rows: set_num_rows,
    tag_list: set_tag_list,
    contextMenuItems: setContextMenuItems,
    selected_resource: set_selected_resource,
    selected_rows: set_selected_rows,
    expanded_tags: set_expanded_tags,
    active_tag: set_active_tag,
    sort_field: set_sort_field,
    sort_direction: set_sort_direction,
    filterType: setFilterType,
    multi_select: set_multi_select,
    list_of_selected: set_list_of_selected,
    search_string: set_search_string,
    search_inside: set_search_inside,
    search_metadata: set_search_metadata,
    show_hidden: set_show_hidden,
    selectedRegions: setSelectedRegions,
    rowChanged: setRowChanged
  };
  (0, _utilities_react.useConstructor)(function () {
    for (var col in props.columns) {
      blank_selected_resource.current[col] = "";
    }
  });
  (0, _react.useEffect)(function () {
    initSocket();
    _grabNewChunkWithRow(0).then(function () {});
  }, []);
  var pushCallback = (0, _utilities_react.useCallbackStack)("library_home");
  function setState(new_state) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    for (var attr in new_state) {
      stateSetters[attr](new_state[attr]);
    }
    pushCallback(callback);
  }
  function initSocket() {
    if (props.tsocket != null && !props.is_repository) {
      props.tsocket.attachListener("update-selector-row", _handleRowUpdate);
      props.tsocket.attachListener("refresh-selector", _refresh_func);
    } else if (props.tsocket != null && props.is_repository) {
      props.tsocket.attachListener("update-repository-selector-row", _handleRowUpdate);
      props.tsocket.attachListener("refresh-repository-selector", _refresh_func);
    }
  }
  function _getSearchSpec() {
    return {
      active_tag: active_tag_ref.current == "all" ? null : active_tag_ref.current,
      search_string: search_string_ref.current,
      search_inside: search_inside_ref.current,
      search_metadata: search_metadata_ref.current,
      show_hidden: show_hidden_ref.current,
      sort_field: sort_field_ref.current,
      sort_direction: sort_direction_ref.current
    };
  }
  function _renderBodyContextMenu(menu_context) {
    if (event) {
      event.preventDefault();
    }
    var regions = menu_context.regions;
    if (regions.length == 0) return null; // Without this get an error when clicking on a body cell
    var selected_rows = [];
    var _iterator = _createForOfIteratorHelper(regions),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var region = _step.value;
        if (region.hasOwnProperty("rows")) {
          var first_row = region["rows"][0];
          var last_row = region["rows"][1];
          for (var i = first_row; i <= last_row; ++i) {
            if (!selected_rows.includes(i)) {
              selected_rows.push(data_dict_ref.current[i]);
            }
          }
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return /*#__PURE__*/_react["default"].createElement(BodyMenu, {
      items: contextMenuItems,
      selected_rows: selected_rows
    });
  }
  function _setFilterType(_x2) {
    return _setFilterType2.apply(this, arguments);
  }
  function _setFilterType2() {
    _setFilterType2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(rtype) {
      var sres;
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            if (!(rtype == filterTypeRef.current)) {
              _context5.next = 2;
              break;
            }
            return _context5.abrupt("return");
          case 2:
            if (multi_select_ref.current) {
              _context5.next = 7;
              break;
            }
            sres = selected_resource_ref.current;
            if (!(sres.name != "" && sres.notes != get_data_dict_entry(sres.name, sres.res_type).notes)) {
              _context5.next = 7;
              break;
            }
            _context5.next = 7;
            return _saveFromSelectedResource();
          case 7:
            setFilterType(rtype);
            clearSelected();
            pushCallback( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
              return _regeneratorRuntime().wrap(function _callee4$(_context4) {
                while (1) switch (_context4.prev = _context4.next) {
                  case 0:
                    _context4.next = 2;
                    return _grabNewChunkWithRow(0, true, null, true);
                  case 2:
                  case "end":
                    return _context4.stop();
                }
              }, _callee4);
            })));
          case 10:
          case "end":
            return _context5.stop();
        }
      }, _callee5);
    }));
    return _setFilterType2.apply(this, arguments);
  }
  function clearSelected() {
    set_selected_resource({
      "name": "",
      "_id": "",
      "tags": "",
      "notes": "",
      "updated": "",
      "created": ""
    });
    set_list_of_selected([]);
    set_selected_rows([]);
  }
  function _onTableSelection(_x3) {
    return _onTableSelection2.apply(this, arguments);
  }
  function _onTableSelection2() {
    _onTableSelection2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(regions) {
      var selected_rows, selected_row_indices, revised_regions, _iterator5, _step5, region, first_row, last_row, i;
      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            if (!(regions.length == 0)) {
              _context6.next = 2;
              break;
            }
            return _context6.abrupt("return");
          case 2:
            // Without this get an error when clicking on a body cell
            selected_rows = [];
            selected_row_indices = [];
            revised_regions = [];
            _iterator5 = _createForOfIteratorHelper(regions);
            try {
              for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
                region = _step5.value;
                if (region.hasOwnProperty("rows")) {
                  first_row = region["rows"][0];
                  revised_regions.push(_table.Regions.row(first_row));
                  last_row = region["rows"][1];
                  for (i = first_row; i <= last_row; ++i) {
                    if (!selected_row_indices.includes(i)) {
                      selected_row_indices.push(i);
                      selected_rows.push(data_dict_ref.current[i]);
                      revised_regions.push(_table.Regions.row(i));
                    }
                  }
                }
              }
            } catch (err) {
              _iterator5.e(err);
            } finally {
              _iterator5.f();
            }
            _context6.next = 9;
            return _handleRowSelection(selected_rows);
          case 9:
            setSelectedRegions(revised_regions);
          case 10:
          case "end":
            return _context6.stop();
        }
      }, _callee6);
    }));
    return _onTableSelection2.apply(this, arguments);
  }
  function _grabNewChunkWithRow(_x4) {
    return _grabNewChunkWithRow2.apply(this, arguments);
  }
  function _grabNewChunkWithRow2() {
    _grabNewChunkWithRow2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(row_index) {
      var flush,
        spec_update,
        select,
        select_by_name,
        callback,
        search_spec,
        args,
        data,
        new_data_dict,
        _args7 = arguments;
      return _regeneratorRuntime().wrap(function _callee7$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
          case 0:
            flush = _args7.length > 1 && _args7[1] !== undefined ? _args7[1] : false;
            spec_update = _args7.length > 2 && _args7[2] !== undefined ? _args7[2] : null;
            select = _args7.length > 3 && _args7[3] !== undefined ? _args7[3] : false;
            select_by_name = _args7.length > 4 && _args7[4] !== undefined ? _args7[4] : null;
            callback = _args7.length > 5 && _args7[5] !== undefined ? _args7[5] : null;
            search_spec = _getSearchSpec();
            if (spec_update) {
              search_spec = Object.assign(search_spec, spec_update);
            }
            if (search_spec.active_tag && search_spec.active_tag[0] != "/") {
              search_spec.active_tag = "/" + search_spec.active_tag;
            }
            args = {
              pane_type: filterTypeRef.current,
              search_spec: search_spec,
              row_number: row_index,
              is_repository: props.is_repository
            };
            _context7.prev = 9;
            _context7.next = 12;
            return (0, _communication_react.postAjaxPromise)("grab_all_list_chunk", args);
          case 12:
            data = _context7.sent;
            if (flush) {
              new_data_dict = data.chunk_dict;
            } else {
              new_data_dict = _lodash["default"].cloneDeep(data_dict_ref.current);
              new_data_dict = Object.assign(new_data_dict, data.chunk_dict);
            }
            previous_search_spec.current = search_spec;
            set_data_dict(new_data_dict);
            set_num_rows(data.num_rows);
            set_tag_list(data.all_tags);
            if (callback) {
              pushCallback(callback);
            } else if (select || selected_resource_ref.current.name == "") {
              pushCallback(function () {
                _selectRow(row_index);
              });
            }
            _context7.next = 24;
            break;
          case 21:
            _context7.prev = 21;
            _context7.t0 = _context7["catch"](9);
            errorDrawerFuncs.addFromError("Error grabbing resource chunk", _context7.t0);
          case 24:
          case "end":
            return _context7.stop();
        }
      }, _callee7, null, [[9, 21]]);
    }));
    return _grabNewChunkWithRow2.apply(this, arguments);
  }
  function _handleRowUpdate(_x5) {
    return _handleRowUpdate2.apply(this, arguments);
  }
  function _handleRowUpdate2() {
    _handleRowUpdate2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(res_dict) {
      var res_name, ind, new_data_dict, new_state, _id, event_type, the_row, _field, _data_dict, data, all_tags, is_last, selected_ind, is_selected_row, new_selected_ind;
      return _regeneratorRuntime().wrap(function _callee9$(_context9) {
        while (1) switch (_context9.prev = _context9.next) {
          case 0:
            res_name = res_dict.name;
            event_type = res_dict.event_type;
            delete res_dict.event_type;
            _context9.t0 = event_type;
            _context9.next = _context9.t0 === "update" ? 6 : _context9.t0 === "insert" ? 22 : _context9.t0 === "delete" ? 25 : 37;
            break;
          case 6:
            if ("_id" in res_dict) {
              _id = res_dict._id;
              ind = get_data_dict_index_from_id(res_dict._id);
            } else {
              ind = get_data_dict_index(res_name, res_dict.res_type);
              if (ind) {
                _id = data_dict_ref.current[ind]._id;
              }
            }
            if (ind) {
              _context9.next = 9;
              break;
            }
            return _context9.abrupt("return");
          case 9:
            new_data_dict = _lodash["default"].cloneDeep(data_dict_ref.current);
            the_row = new_data_dict[ind];
            for (_field in res_dict) {
              the_row[_field] = res_dict[_field];
            }
            new_state = {
              data_dict: new_data_dict,
              rowChanged: rowChanged + 1
            };
            if (!("tags" in res_dict)) {
              _context9.next = 20;
              break;
            }
            _data_dict = {
              pane_type: props.pane_type,
              is_repository: props.is_repository,
              show_hidden: show_hidden_ref.current
            };
            _context9.next = 17;
            return (0, _communication_react.postAjaxPromise)("get_tag_list", _data_dict);
          case 17:
            data = _context9.sent;
            all_tags = data.tag_list;
            set_tag_list(all_tags);
          case 20:
            if (_id == selected_resource_ref.current._id) {
              set_selected_resource(the_row);
              pushCallback(function () {
                return setState(new_state);
              });
            } else {
              setState(new_state);
            }
            return _context9.abrupt("break", 38);
          case 22:
            _context9.next = 24;
            return _grabNewChunkWithRow(0, true, null, false, res_name);
          case 24:
            return _context9.abrupt("break", 38);
          case 25:
            if ("_id" in res_dict) {
              ind = parseInt(get_data_dict_index_from_id(res_dict._id));
            } else {
              ind = parseInt(get_data_dict_index(res_name, res_dict.res_type));
            }
            new_data_dict = _lodash["default"].cloneDeep(data_dict_ref.current);
            is_last = ind == new_data_dict.length - 1;
            selected_ind = null;
            if ("_id" in selected_resource_ref.current) {
              selected_ind = parseInt(get_data_dict_index_from_id(selected_resource_ref.current._id));
            }
            is_selected_row = ind && ind == selected_ind;
            new_selected_ind = selected_ind;
            if (selected_ind > ind) {
              new_selected_ind = selected_ind - 1;
            }
            delete new_data_dict[String(ind)];
            new_state = {
              data_dict: new_data_dict,
              rowChanged: rowChanged + 1
            };
            setState(new_state, /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8() {
              return _regeneratorRuntime().wrap(function _callee8$(_context8) {
                while (1) switch (_context8.prev = _context8.next) {
                  case 0:
                    _context8.next = 2;
                    return _grabNewChunkWithRow(ind, false, null, false, null, function () {
                      if (new_selected_ind) {
                        _selectRow(new_selected_ind);
                      } else {
                        clearSelected();
                      }
                    });
                  case 2:
                  case "end":
                    return _context8.stop();
                }
              }, _callee8);
            })));
            return _context9.abrupt("break", 38);
          case 37:
            return _context9.abrupt("return");
          case 38:
          case "end":
            return _context9.stop();
        }
      }, _callee9);
    }));
    return _handleRowUpdate2.apply(this, arguments);
  }
  function get_data_dict_entry(name, res_type) {
    for (var index in data_dict_ref.current) {
      var the_row = data_dict_ref.current[index];
      if (the_row.name == name && the_row.res_type == res_type) {
        return data_dict_ref.current[index];
      }
    }
    return null;
  }
  function _match_row(row1, row2) {
    return row1.name == row2.name && row1.res_type == row2.res_type;
  }
  function _match_row_by_id(row1, row2) {
    return row1._id == row2._id;
  }
  function _match_any_row(row1, row_list) {
    var _iterator2 = _createForOfIteratorHelper(row_list),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var row2 = _step2.value;
        if (_match_row(row1, row2)) {
          return true;
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    return false;
  }
  function set_in_data_dict(old_rows, new_val_dict, data_dict) {
    var new_data_dict = {};
    for (var index in data_dict_ref.current) {
      var entry = data_dict_ref.current[index];
      if (_match_any_row(entry, old_rows)) {
        for (var k in new_val_dict) {
          entry[k] = new_val_dict[k];
        }
      }
      new_data_dict[index] = entry;
    }
    return new_data_dict;
  }
  function get_data_dict_index(name, res_type) {
    for (var index in data_dict_ref.current) {
      if (_match_row(data_dict_ref.current[index], {
        name: name,
        res_type: res_type
      })) {
        return index;
      }
    }
    return null;
  }
  function get_data_dict_index_from_id(_id) {
    for (var index in data_dict_ref.current) {
      if (_match_row_by_id(data_dict_ref.current[index], {
        _id: _id
      })) {
        return index;
      }
    }
    return null;
  }
  function _extractNewTags(tstring) {
    var tlist = tstring.split(" ");
    var new_tags = [];
    var _iterator3 = _createForOfIteratorHelper(tlist),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var tag = _step3.value;
        if (!(tag.length == 0) && !(tag in tag_list)) {
          new_tags.push(tag);
        }
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    return new_tags;
  }
  function _saveFromSelectedResource() {
    return _saveFromSelectedResource2.apply(this, arguments);
  }
  function _saveFromSelectedResource2() {
    _saveFromSelectedResource2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10() {
      var result_dict, saved_selected_resource, saved_selected_rows, new_tags;
      return _regeneratorRuntime().wrap(function _callee10$(_context10) {
        while (1) switch (_context10.prev = _context10.next) {
          case 0:
            // This will only be called when there is a single row selected
            result_dict = {
              "res_type": selected_rows_ref.current[0].res_type,
              "res_name": list_of_selected_ref.current[0],
              "tags": selected_resource_ref.current.tags,
              "notes": selected_resource_ref.current.notes
            };
            if (selected_rows_ref.current[0].res_type == "tile" && "icon" in selected_resource_ref.current) {
              result_dict["icon"] = selected_resource_ref.current["icon"];
            }
            saved_selected_resource = Object.assign({}, selected_resource_ref.current);
            saved_selected_rows = _toConsumableArray(selected_rows_ref.current);
            new_tags = _extractNewTags(selected_resource_ref.current.tags);
            _context10.prev = 5;
            _context10.next = 8;
            return (0, _communication_react.postAjaxPromise)("save_metadata", result_dict);
          case 8:
            _context10.next = 13;
            break;
          case 10:
            _context10.prev = 10;
            _context10.t0 = _context10["catch"](5);
            errorDrawerFuncs.addFromError("Error updating resource ".concat(result_dict.res_name), _context10.t0);
          case 13:
          case "end":
            return _context10.stop();
        }
      }, _callee10, null, [[5, 10]]);
    }));
    return _saveFromSelectedResource2.apply(this, arguments);
  }
  function _overwriteCommonTags() {
    return _overwriteCommonTags2.apply(this, arguments);
  }
  function _overwriteCommonTags2() {
    _overwriteCommonTags2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11() {
      var result_dict, new_tags;
      return _regeneratorRuntime().wrap(function _callee11$(_context11) {
        while (1) switch (_context11.prev = _context11.next) {
          case 0:
            result_dict = {
              "selected_rows": selected_rows_ref.current,
              "tags": selected_resource_ref.current.tags
            };
            new_tags = _extractNewTags(selected_resource_ref.current.tags);
            _context11.prev = 2;
            _context11.next = 5;
            return (0, _communication_react.postAjaxPromise)("overwrite_common_tags", result_dict);
          case 5:
            _context11.next = 10;
            break;
          case 7:
            _context11.prev = 7;
            _context11.t0 = _context11["catch"](2);
            errorDrawerFuncs.addFromError("Error overwriting tags", _context11.t0);
          case 10:
          case "end":
            return _context11.stop();
        }
      }, _callee11, null, [[2, 7]]);
    }));
    return _overwriteCommonTags2.apply(this, arguments);
  }
  function _handleMetadataChange(changed_state_elements) {
    if (!multi_select_ref.current) {
      var revised_selected_resource = Object.assign({}, selected_resource_ref.current);
      revised_selected_resource = Object.assign(revised_selected_resource, changed_state_elements);
      if (Object.keys(changed_state_elements).includes("tags")) {
        revised_selected_resource["tags"] = revised_selected_resource["tags"].join(" ");
        set_selected_resource(revised_selected_resource);
        pushCallback(_saveFromSelectedResource);
      } else {
        set_selected_resource(revised_selected_resource);
        pushCallback(_saveFromSelectedResource);
      }
    } else {
      var _revised_selected_resource = Object.assign({}, selected_resource_ref.current);
      _revised_selected_resource = Object.assign(_revised_selected_resource, changed_state_elements);
      _revised_selected_resource["tags"] = _revised_selected_resource["tags"].join(" ");
      set_selected_resource(_revised_selected_resource);
      pushCallback(_overwriteCommonTags);
    }
  }
  function _handleRowDoubleClick(row_dict) {
    var view_view = view_views(props.is_repository)[row_dict.res_type];
    if (view_view == null) return;
    statusFuncs.setStatus({
      show_spinner: true,
      status_message: "Opening ..."
    });
    set_selected_resource(row_dict);
    set_multi_select(false);
    set_list_of_selected([row_dict.name]);
    set_selected_rows([row_dict]);
    pushCallback( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var re, data;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            if (!window.in_context) {
              _context.next = 16;
              break;
            }
            re = new RegExp("/$");
            view_view = view_view.replace(re, "_in_context");
            _context.prev = 3;
            _context.next = 6;
            return (0, _communication_react.postAjaxPromise)(view_view, {
              context_id: context_id,
              resource_name: row_dict.name
            });
          case 6:
            data = _context.sent;
            props.handleCreateViewer(data, statusFuncs.clearStatus);
            _context.next = 14;
            break;
          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](3);
            statusFuncs.clearStatus();
            errorDrawerFuncs.addFromError("Error handling double click with view ".concat(view_view), _context.t0);
          case 14:
            _context.next = 18;
            break;
          case 16:
            statusFuncs.clearStatus();
            window.open($SCRIPT_ROOT + view_view + row_dict.name);
          case 18:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[3, 10]]);
    })));
  }
  function _selectedTypes() {
    var the_types = selected_rows_ref.current.map(function (row) {
      return row.res_type;
    });
    the_types = _toConsumableArray(new Set(the_types));
    return the_types;
  }
  function _handleRowSelection(_x6) {
    return _handleRowSelection2.apply(this, arguments);
  }
  function _handleRowSelection2() {
    _handleRowSelection2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee12(selected_rows) {
      var sres, common_tags, other_rows, _iterator6, _step6, row_dict, new_common_tags, new_tag_list, _iterator7, _step7, tag, multi_select_list, new_selected_resource, _row_dict;
      return _regeneratorRuntime().wrap(function _callee12$(_context12) {
        while (1) switch (_context12.prev = _context12.next) {
          case 0:
            if (multi_select_ref.current) {
              _context12.next = 5;
              break;
            }
            sres = selected_resource_ref.current;
            if (!(sres.name != "" && get_data_dict_entry(sres.name, sres.res_type) && sres.notes != get_data_dict_entry(sres.name, sres.res_type).notes)) {
              _context12.next = 5;
              break;
            }
            _context12.next = 5;
            return _saveFromSelectedResource();
          case 5:
            if (selected_rows.length > 1) {
              common_tags = selected_rows[0].tags.split(" ");
              other_rows = selected_rows.slice(1, selected_rows.length);
              _iterator6 = _createForOfIteratorHelper(other_rows);
              try {
                for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
                  row_dict = _step6.value;
                  new_common_tags = [];
                  new_tag_list = row_dict.tags.split(" ");
                  _iterator7 = _createForOfIteratorHelper(new_tag_list);
                  try {
                    for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
                      tag = _step7.value;
                      if (common_tags.includes(tag)) {
                        new_common_tags.push(tag);
                      }
                    }
                  } catch (err) {
                    _iterator7.e(err);
                  } finally {
                    _iterator7.f();
                  }
                  common_tags = new_common_tags;
                }
              } catch (err) {
                _iterator6.e(err);
              } finally {
                _iterator6.f();
              }
              multi_select_list = selected_rows.map(function (row_dict) {
                return row_dict.name;
              });
              new_selected_resource = {
                name: "__multiple__",
                tags: common_tags.join(" "),
                notes: ""
              };
              set_selected_resource(new_selected_resource);
              set_multi_select(true);
              set_list_of_selected(multi_select_list);
              set_selected_rows(selected_rows);
            } else {
              _row_dict = selected_rows[0];
              set_selected_resource(_row_dict);
              set_multi_select(false);
              set_list_of_selected([_row_dict.name]);
              set_selected_rows(selected_rows);
            }
          case 6:
          case "end":
            return _context12.stop();
        }
      }, _callee12);
    }));
    return _handleRowSelection2.apply(this, arguments);
  }
  function _filter_func(resource_dict, search_string) {
    try {
      return resource_dict.name.toLowerCase().search(search_string) != -1;
    } catch (e) {
      return false;
    }
  }
  function _unsearch() {
    return _unsearch2.apply(this, arguments);
  }
  function _unsearch2() {
    _unsearch2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee13() {
      return _regeneratorRuntime().wrap(function _callee13$(_context13) {
        while (1) switch (_context13.prev = _context13.next) {
          case 0:
            if (!(search_string_ref.current != "")) {
              _context13.next = 4;
              break;
            }
            set_search_string("");
            _context13.next = 11;
            break;
          case 4:
            if (!(active_tag_ref.current != "all")) {
              _context13.next = 8;
              break;
            }
            _update_search_state({
              "active_tag": "all"
            });
            _context13.next = 11;
            break;
          case 8:
            if (!(props.pane_type == "all" && filterTypeRef.current != "all")) {
              _context13.next = 11;
              break;
            }
            _context13.next = 11;
            return _setFilterType("all");
          case 11:
          case "end":
            return _context13.stop();
        }
      }, _callee13);
    }));
    return _unsearch2.apply(this, arguments);
  }
  function _update_search_state(new_state) {
    setState(new_state);
    pushCallback( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            if (!search_spec_changed(new_state)) {
              _context2.next = 4;
              break;
            }
            clearSelected();
            _context2.next = 4;
            return _grabNewChunkWithRow(0, true, new_state, true);
          case 4:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    })));
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
  function _set_sort_state(column_name, direction) {
    var spec_update = {
      sort_field: column_name,
      sort_direction: direction
    };
    set_sort_field(column_name);
    set_sort_direction(direction);
    pushCallback( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            if (!search_spec_changed(spec_update)) {
              _context3.next = 3;
              break;
            }
            _context3.next = 3;
            return _grabNewChunkWithRow(0, true, spec_update, true);
          case 3:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    })));
  }
  function _handleArrowKeyPress(_x7) {
    return _handleArrowKeyPress2.apply(this, arguments);
  }
  function _handleArrowKeyPress2() {
    _handleArrowKeyPress2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee14(key) {
      var the_res, current_index, new_index, new_selected_res;
      return _regeneratorRuntime().wrap(function _callee14$(_context14) {
        while (1) switch (_context14.prev = _context14.next) {
          case 0:
            if (!multi_select_ref.current) {
              _context14.next = 2;
              break;
            }
            return _context14.abrupt("return");
          case 2:
            the_res = selected_resource_ref.current;
            current_index = parseInt(get_data_dict_index(the_res.name, the_res.res_type));
            if (!(key == "ArrowDown")) {
              _context14.next = 8;
              break;
            }
            new_index = current_index + 1;
            _context14.next = 11;
            break;
          case 8:
            new_index = current_index - 1;
            if (!(new_index < 0)) {
              _context14.next = 11;
              break;
            }
            return _context14.abrupt("return");
          case 11:
            _context14.next = 13;
            return _selectRow(new_index);
          case 13:
          case "end":
            return _context14.stop();
        }
      }, _callee14);
    }));
    return _handleArrowKeyPress2.apply(this, arguments);
  }
  function _handleTableKeyPress(_x8) {
    return _handleTableKeyPress2.apply(this, arguments);
  }
  function _handleTableKeyPress2() {
    _handleTableKeyPress2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee15(key) {
      return _regeneratorRuntime().wrap(function _callee15$(_context15) {
        while (1) switch (_context15.prev = _context15.next) {
          case 0:
            if (!(key.code == "ArrowUp")) {
              _context15.next = 5;
              break;
            }
            _context15.next = 3;
            return _handleArrowKeyPress("ArrowUp");
          case 3:
            _context15.next = 8;
            break;
          case 5:
            if (!(key.code == "ArrowDown")) {
              _context15.next = 8;
              break;
            }
            _context15.next = 8;
            return _handleArrowKeyPress("ArrowDown");
          case 8:
          case "end":
            return _context15.stop();
        }
      }, _callee15);
    }));
    return _handleTableKeyPress2.apply(this, arguments);
  }
  function _selectRow(_x9) {
    return _selectRow2.apply(this, arguments);
  }
  function _selectRow2() {
    _selectRow2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee16(new_index) {
      var new_regions;
      return _regeneratorRuntime().wrap(function _callee16$(_context16) {
        while (1) switch (_context16.prev = _context16.next) {
          case 0:
            if (Object.keys(data_dict_ref.current).includes(String(new_index))) {
              _context16.next = 5;
              break;
            }
            _context16.next = 3;
            return _grabNewChunkWithRow(new_index, false, null, false, null, function () {
              _selectRow(new_index);
            });
          case 3:
            _context16.next = 7;
            break;
          case 5:
            new_regions = [_table.Regions.row(new_index)];
            setState({
              selected_resource: data_dict_ref.current[new_index],
              list_of_selected: [data_dict_ref.current[new_index].name],
              selected_rows: [data_dict_ref.current[new_index]],
              multi_select: false,
              selectedRegions: new_regions
            });
          case 7:
          case "end":
            return _context16.stop();
        }
      }, _callee16);
    }));
    return _selectRow2.apply(this, arguments);
  }
  function _view_func() {
    return _view_func2.apply(this, arguments);
  }
  function _view_func2() {
    _view_func2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee17() {
      var the_view,
        re,
        data,
        _args17 = arguments;
      return _regeneratorRuntime().wrap(function _callee17$(_context17) {
        while (1) switch (_context17.prev = _context17.next) {
          case 0:
            the_view = _args17.length > 0 && _args17[0] !== undefined ? _args17[0] : null;
            if (the_view == null) {
              the_view = view_views(props.is_repository)[selected_resource_ref.current.res_type];
            }
            statusFuncs.setStatus({
              show_spinner: true,
              status_message: "Opening ..."
            });
            if (!window.in_context) {
              _context17.next = 19;
              break;
            }
            re = new RegExp("/$");
            the_view = the_view.replace(re, "_in_context");
            _context17.prev = 6;
            _context17.next = 9;
            return (0, _communication_react.postAjaxPromise)(the_view, {
              context_id: context_id,
              resource_name: selected_resource_ref.current.name
            });
          case 9:
            data = _context17.sent;
            props.handleCreateViewer(data, statusFuncs.clearStatus);
            _context17.next = 17;
            break;
          case 13:
            _context17.prev = 13;
            _context17.t0 = _context17["catch"](6);
            statusFuncs.clearstatus();
            errorDrawerFuncs.addFromError("Error viewing with view ".concat(the_view), _context17.t0);
          case 17:
            _context17.next = 21;
            break;
          case 19:
            statusFuncs.clearStatus();
            window.open($SCRIPT_ROOT + the_view + selected_resource_ref.current.name);
          case 21:
          case "end":
            return _context17.stop();
        }
      }, _callee17, null, [[6, 13]]);
    }));
    return _view_func2.apply(this, arguments);
  }
  function _open_raw(selected_resource) {
    statusFuncs.clearStatus();
    if (selected_resource.type == "freeform") {
      window.open($SCRIPT_ROOT + "/open_raw/" + selected_resource.name);
    } else {
      statusFuncs.statusMessage("Only Freeform documents can be raw opened", 5);
    }
  }
  function _view_resource(_x10) {
    return _view_resource2.apply(this, arguments);
  }
  function _view_resource2() {
    _view_resource2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee18(selected_resource) {
      var the_view,
        force_new_tab,
        resource_name,
        re,
        data,
        _args18 = arguments;
      return _regeneratorRuntime().wrap(function _callee18$(_context18) {
        while (1) switch (_context18.prev = _context18.next) {
          case 0:
            the_view = _args18.length > 1 && _args18[1] !== undefined ? _args18[1] : null;
            force_new_tab = _args18.length > 2 && _args18[2] !== undefined ? _args18[2] : false;
            resource_name = selected_resource.name;
            if (the_view == null) {
              the_view = view_views(props.is_repository)[selected_resource.res_type];
            }
            statusFuncs.setStatus({
              show_spinner: true,
              status_message: "Opening ..."
            });
            if (!(window.in_context && !force_new_tab)) {
              _context18.next = 21;
              break;
            }
            re = new RegExp("/$");
            the_view = the_view.replace(re, "_in_context");
            _context18.prev = 8;
            _context18.next = 11;
            return (0, _communication_react.postAjaxPromise)(the_view, {
              context_id: context_id,
              resource_name: resource_name
            });
          case 11:
            data = _context18.sent;
            props.handleCreateViewer(data, statusFuncs.clearStatus);
            _context18.next = 19;
            break;
          case 15:
            _context18.prev = 15;
            _context18.t0 = _context18["catch"](8);
            statusFuncs.clearstatus();
            errorDrawerFuncs.addFromError("Error viewing resource ".concat(resource_name), _context18.t0);
          case 19:
            _context18.next = 23;
            break;
          case 21:
            statusFuncs.clearStatus();
            window.open($SCRIPT_ROOT + the_view + resource_name);
          case 23:
          case "end":
            return _context18.stop();
        }
      }, _callee18, null, [[8, 15]]);
    }));
    return _view_resource2.apply(this, arguments);
  }
  function _duplicate_func() {
    return _duplicate_func2.apply(this, arguments);
  }
  function _duplicate_func2() {
    _duplicate_func2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee19() {
      var row,
        the_row,
        res_name,
        res_type,
        data,
        new_name,
        duplicate_view,
        result_dict,
        _args19 = arguments;
      return _regeneratorRuntime().wrap(function _callee19$(_context19) {
        while (1) switch (_context19.prev = _context19.next) {
          case 0:
            row = _args19.length > 0 && _args19[0] !== undefined ? _args19[0] : null;
            the_row = row ? row : selected_resource_ref.current;
            res_name = the_row.name;
            res_type = the_row.res_type;
            _context19.prev = 4;
            _context19.next = 7;
            return (0, _communication_react.postAjaxPromise)("get_resource_names/" + res_type, {});
          case 7:
            data = _context19.sent;
            _context19.next = 10;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Duplicate ".concat(res_type),
              field_title: "New Name",
              default_value: res_name,
              existing_names: data.resource_names,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 10:
            new_name = _context19.sent;
            duplicate_view = duplicate_views()[res_type];
            result_dict = {
              "new_res_name": new_name,
              "res_to_copy": res_name,
              "library_id": props.library_id,
              "is_repository": false
            };
            _context19.next = 15;
            return (0, _communication_react.postAjaxPromise)(duplicate_view, result_dict);
          case 15:
            _context19.next = 21;
            break;
          case 17:
            _context19.prev = 17;
            _context19.t0 = _context19["catch"](4);
            if (_context19.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error duplicating resource ".concat(res_name), _context19.t0);
            }
            return _context19.abrupt("return");
          case 21:
          case "end":
            return _context19.stop();
        }
      }, _callee19, null, [[4, 17]]);
    }));
    return _duplicate_func2.apply(this, arguments);
  }
  function _delete_func(_x11) {
    return _delete_func2.apply(this, arguments);
  }
  function _delete_func2() {
    _delete_func2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee20(resource) {
      var res_list, confirm_text, _res_name, first_index, _iterator8, _step8, row, ind;
      return _regeneratorRuntime().wrap(function _callee20$(_context20) {
        while (1) switch (_context20.prev = _context20.next) {
          case 0:
            res_list = resource ? [resource] : selected_rows_ref.current;
            if (res_list.length == 1) {
              _res_name = res_list[0].name;
              confirm_text = "Are you sure that you want to delete ".concat(_res_name, "?");
            } else {
              confirm_text = "Are you sure that you want to delete multiple items?";
            }
            first_index = 99999;
            _iterator8 = _createForOfIteratorHelper(selected_rows_ref.current);
            try {
              for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
                row = _step8.value;
                ind = parseInt(get_data_dict_index(row.name, row.res_type));
                if (ind < first_index) {
                  first_index = ind;
                }
              }
            } catch (err) {
              _iterator8.e(err);
            } finally {
              _iterator8.f();
            }
            _context20.prev = 5;
            _context20.next = 8;
            return dialogFuncs.showModalPromise("ConfirmDialog", {
              title: "Delete resources",
              text_body: confirm_text,
              cancel_text: "do nothing",
              submit_text: "delete",
              handleClose: dialogFuncs.hideModal
            });
          case 8:
            _context20.next = 10;
            return (0, _communication_react.postAjaxPromise)("delete_resource_list", {
              "resource_list": res_list
            });
          case 10:
            _context20.next = 16;
            break;
          case 12:
            _context20.prev = 12;
            _context20.t0 = _context20["catch"](5);
            if (_context20.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error duplicating resource ".concat(res_name), _context20.t0);
            }
            return _context20.abrupt("return");
          case 16:
          case "end":
            return _context20.stop();
        }
      }, _callee20, null, [[5, 12]]);
    }));
    return _delete_func2.apply(this, arguments);
  }
  function _rename_func() {
    return _rename_func2.apply(this, arguments);
  }
  function _rename_func2() {
    _rename_func2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee21() {
      var row,
        res_type,
        res_name,
        data,
        res_names,
        index,
        new_name,
        the_data,
        _args21 = arguments;
      return _regeneratorRuntime().wrap(function _callee21$(_context21) {
        while (1) switch (_context21.prev = _context21.next) {
          case 0:
            row = _args21.length > 0 && _args21[0] !== undefined ? _args21[0] : null;
            if (!row) {
              res_type = selected_resource_ref.current.res_type;
              res_name = selected_resource_ref.current.name;
            } else {
              res_type = row.res_type;
              res_name = row.name;
            }
            _context21.prev = 2;
            _context21.next = 5;
            return (0, _communication_react.postAjaxPromise)("get_resource_names/" + res_type, {});
          case 5:
            data = _context21.sent;
            res_names = data["resource_names"];
            index = res_names.indexOf(res_name);
            if (index >= 0) {
              res_names.splice(index, 1);
            }
            _context21.next = 11;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Rename ".concat(res_type),
              field_title: "New Name",
              handleClose: dialogFuncs.hideModal,
              default_value: res_name,
              existing_names: res_names,
              checkboxes: []
            });
          case 11:
            new_name = _context21.sent;
            the_data = {
              "new_name": new_name
            };
            _context21.next = 15;
            return (0, _communication_react.postAjaxPromise)("rename_resource/".concat(res_type, "/").concat(res_name), the_data);
          case 15:
            _context21.next = 21;
            break;
          case 17:
            _context21.prev = 17;
            _context21.t0 = _context21["catch"](2);
            if (_context21.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error renaming resource ".concat(res_name), _context21.t0);
            }
            return _context21.abrupt("return");
          case 21:
          case "end":
            return _context21.stop();
        }
      }, _callee21, null, [[2, 17]]);
    }));
    return _rename_func2.apply(this, arguments);
  }
  function _repository_copy_func() {
    return _repository_copy_func2.apply(this, arguments);
  }
  function _repository_copy_func2() {
    _repository_copy_func2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee22() {
      var res_type, _res_name2, data, new_name, result_dict, _result_dict;
      return _regeneratorRuntime().wrap(function _callee22$(_context22) {
        while (1) switch (_context22.prev = _context22.next) {
          case 0:
            if (multi_select_ref.current) {
              _context22.next = 23;
              break;
            }
            res_type = selected_resource_ref.current.res_type;
            _res_name2 = selected_resource_ref.current.name;
            _context22.prev = 3;
            _context22.next = 6;
            return (0, _communication_react.postAjaxPromise)("get_resource_names/" + res_type, {});
          case 6:
            data = _context22.sent;
            _context22.next = 9;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Import ".concat(res_type),
              field_title: "New Name",
              default_value: _res_name2,
              existing_names: data.resource_names,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 9:
            new_name = _context22.sent;
            result_dict = {
              "res_type": res_type,
              "res_name": _res_name2,
              "new_res_name": new_name
            };
            _context22.next = 13;
            return (0, _communication_react.postAjaxPromise)("/copy_from_repository", result_dict);
          case 13:
            statusFuncs.statusMessage("Imported Resource ".concat(_res_name2));
            return _context22.abrupt("return", _res_name2);
          case 17:
            _context22.prev = 17;
            _context22.t0 = _context22["catch"](3);
            if (_context22.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error getting resources names", _context22.t0);
            }
            return _context22.abrupt("return");
          case 21:
            _context22.next = 34;
            break;
          case 23:
            _result_dict = {
              "selected_rows": selected_rows_ref.current
            };
            _context22.prev = 24;
            _context22.next = 27;
            return (0, _communication_react.postAjaxPromise)("/copy_from_repository", _result_dict);
          case 27:
            statusFuncs.statusMessage("Imported Resources");
            _context22.next = 33;
            break;
          case 30:
            _context22.prev = 30;
            _context22.t1 = _context22["catch"](24);
            errorDrawerFuncs.addFromError("Error importing resources", _context22.t1);
          case 33:
            return _context22.abrupt("return", "");
          case 34:
          case "end":
            return _context22.stop();
        }
      }, _callee22, null, [[3, 17], [24, 30]]);
    }));
    return _repository_copy_func2.apply(this, arguments);
  }
  function _send_repository_func() {
    return _send_repository_func2.apply(this, arguments);
  }
  function _send_repository_func2() {
    _send_repository_func2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee23() {
      var pane_type, res_type, _res_name3, data, new_name, result_dict, _result_dict2;
      return _regeneratorRuntime().wrap(function _callee23$(_context23) {
        while (1) switch (_context23.prev = _context23.next) {
          case 0:
            pane_type = props.pane_type;
            if (multi_select_ref.current) {
              _context23.next = 23;
              break;
            }
            res_type = selected_resource_ref.current.res_type;
            _res_name3 = selected_resource_ref.current.name;
            _context23.prev = 4;
            _context23.next = 7;
            return (0, _communication_react.postAjaxPromise)("get_repository_resource_names/" + res_type, {});
          case 7:
            data = _context23.sent;
            _context23.next = 10;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Share ".concat(res_type),
              field_title: "New ".concat(res_type, " Name"),
              default_value: _res_name3,
              existing_names: data.resource_names,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 10:
            new_name = _context23.sent;
            result_dict = {
              "pane_type": pane_type,
              "res_type": res_type,
              "res_name": _res_name3,
              "new_res_name": new_name
            };
            _context23.next = 14;
            return (0, _communication_react.postAjaxPromise)('/send_to_repository', result_dict);
          case 14:
            statusFuncs.statusMessage("Shared resource ".concat(_res_name3));
            _context23.next = 21;
            break;
          case 17:
            _context23.prev = 17;
            _context23.t0 = _context23["catch"](4);
            if (_context23.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error sharing resource ".concat(_res_name3), _context23.t0);
            }
            return _context23.abrupt("return");
          case 21:
            _context23.next = 34;
            break;
          case 23:
            _result_dict2 = {
              "pane_type": pane_type,
              "selected_rows": selected_rows_ref.current
            };
            _context23.prev = 24;
            _context23.next = 27;
            return (0, _communication_react.postAjaxPromise)('/send_to_repository', _result_dict2);
          case 27:
            statusFuncs.statusMessage("Shared resources");
            _context23.next = 33;
            break;
          case 30:
            _context23.prev = 30;
            _context23.t1 = _context23["catch"](24);
            errorDrawerFuncs.addFromError("Error sharing resources", _context23.t1);
          case 33:
            return _context23.abrupt("return", "");
          case 34:
          case "end":
            return _context23.stop();
        }
      }, _callee23, null, [[4, 17], [24, 30]]);
    }));
    return _send_repository_func2.apply(this, arguments);
  }
  function _refresh_func() {
    return _refresh_func2.apply(this, arguments);
  }
  function _refresh_func2() {
    _refresh_func2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee24() {
      var callback,
        _args24 = arguments;
      return _regeneratorRuntime().wrap(function _callee24$(_context24) {
        while (1) switch (_context24.prev = _context24.next) {
          case 0:
            callback = _args24.length > 0 && _args24[0] !== undefined ? _args24[0] : null;
            _context24.next = 3;
            return _grabNewChunkWithRow(0, true, null, true, callback);
          case 3:
          case "end":
            return _context24.stop();
        }
      }, _callee24);
    }));
    return _refresh_func2.apply(this, arguments);
  }
  function _new_notebook() {
    return _new_notebook2.apply(this, arguments);
  }
  function _new_notebook2() {
    _new_notebook2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee25() {
      var the_view, data;
      return _regeneratorRuntime().wrap(function _callee25$(_context25) {
        while (1) switch (_context25.prev = _context25.next) {
          case 0:
            if (!window.in_context) {
              _context25.next = 14;
              break;
            }
            _context25.prev = 1;
            the_view = "new_notebook_in_context";
            _context25.next = 5;
            return (0, _communication_react.postAjaxPromise)(the_view, {
              resource_name: ""
            });
          case 5:
            data = _context25.sent;
            props.handleCreateViewer(data);
            _context25.next = 12;
            break;
          case 9:
            _context25.prev = 9;
            _context25.t0 = _context25["catch"](1);
            errorDrawerFuncs.addFromError("Error creating new notebook", _context25.t0);
          case 12:
            _context25.next = 15;
            break;
          case 14:
            window.open("".concat($SCRIPT_ROOT, "/new_notebook"));
          case 15:
          case "end":
            return _context25.stop();
        }
      }, _callee25, null, [[1, 9]]);
    }));
    return _new_notebook2.apply(this, arguments);
  }
  function _new_project() {
    return _new_project2.apply(this, arguments);
  }
  function _new_project2() {
    _new_project2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee26() {
      var the_view, data;
      return _regeneratorRuntime().wrap(function _callee26$(_context26) {
        while (1) switch (_context26.prev = _context26.next) {
          case 0:
            if (!window.in_context) {
              _context26.next = 14;
              break;
            }
            _context26.prev = 1;
            the_view = "new_project_in_context";
            _context26.next = 5;
            return (0, _communication_react.postAjaxPromise)(the_view, {
              resource_name: ""
            });
          case 5:
            data = _context26.sent;
            props.handleCreateViewer(data);
            _context26.next = 12;
            break;
          case 9:
            _context26.prev = 9;
            _context26.t0 = _context26["catch"](1);
            errorDrawerFuncs.addFromError("Error creating new project", _context26.t0);
          case 12:
            _context26.next = 15;
            break;
          case 14:
            window.open("".concat($SCRIPT_ROOT, "/new_project"));
          case 15:
          case "end":
            return _context26.stop();
        }
      }, _callee26, null, [[1, 9]]);
    }));
    return _new_project2.apply(this, arguments);
  }
  function _downloadJupyter() {
    return _downloadJupyter2.apply(this, arguments);
  }
  function _downloadJupyter2() {
    _downloadJupyter2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee27() {
      var res_name, new_name;
      return _regeneratorRuntime().wrap(function _callee27$(_context27) {
        while (1) switch (_context27.prev = _context27.next) {
          case 0:
            res_name = selected_resource_ref.current.name;
            _context27.prev = 1;
            _context27.next = 4;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Download Notebook as Jupyter Notebook",
              field_title: "New File Name",
              default_value: res_name + ".ipynb",
              existing_names: [],
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 4:
            new_name = _context27.sent;
            window.open("".concat($SCRIPT_ROOT, "/download_jupyter/") + res_name + "/" + new_name);
            _context27.next = 11;
            break;
          case 8:
            _context27.prev = 8;
            _context27.t0 = _context27["catch"](1);
            errorDrawerFuncs.addFromError("Error downloading jupyter notebook", _context27.t0);
          case 11:
          case "end":
            return _context27.stop();
        }
      }, _callee27, null, [[1, 8]]);
    }));
    return _downloadJupyter2.apply(this, arguments);
  }
  function _showJupyterImport() {
    dialogFuncs.showModal("FileImportDialog", {
      res_type: "project",
      allowed_file_types: ".ipynb",
      checkboxes: [],
      chunking: false,
      chunkSize: null,
      forceChunking: false,
      process_handler: _import_jupyter,
      tsocket: props.tsocket,
      combine: false,
      show_csv_options: false,
      after_upload: null,
      show_address_selector: false,
      initial_address: null,
      handleClose: dialogFuncs.hideModal,
      handleCancel: null
    });
  }
  function _import_jupyter(myDropZone, setCurrentUrl) {
    var new_url = "import_jupyter/".concat(props.library_id);
    myDropZone.options.url = new_url;
    setCurrentUrl(new_url);
    myDropZone.processQueue();
  }
  function _combineCollections() {
    return _combineCollections2.apply(this, arguments);
  }
  function _combineCollections2() {
    _combineCollections2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee28() {
      var res_name, data, other_name, target, _data, new_name;
      return _regeneratorRuntime().wrap(function _callee28$(_context28) {
        while (1) switch (_context28.prev = _context28.next) {
          case 0:
            res_name = selected_resource_ref.current.name;
            if (multi_select_ref.current) {
              _context28.next = 24;
              break;
            }
            _context28.prev = 2;
            _context28.next = 5;
            return (0, _communication_react.postAjaxPromise)("get_resource_names/collection", {});
          case 5:
            data = _context28.sent;
            _context28.next = 8;
            return dialogFuncs.showModalPromise("SelectDialog", {
              title: "Select a new collection to combine with " + res_name,
              select_label: "Collection to Combine",
              cancel_text: "Cancel",
              submit_text: "Combine",
              option_list: data.resource_names,
              handleClose: dialogFuncs.hideModal
            });
          case 8:
            other_name = _context28.sent;
            statusFuncs.startSpinner(true);
            target = "combine_collections/".concat(res_name, "/").concat(other_name);
            _context28.next = 13;
            return (0, _communication_react.postAjaxPromise)(target, {});
          case 13:
            statusFuncs.stopSpinner();
            statusFuncs.statusMessage("Combined Collections");
            _context28.next = 22;
            break;
          case 17:
            _context28.prev = 17;
            _context28.t0 = _context28["catch"](2);
            if (_context28.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error combining collections", _context28.t0);
            }
            statusFuncs.stopSpinner();
            return _context28.abrupt("return");
          case 22:
            _context28.next = 40;
            break;
          case 24:
            _context28.prev = 24;
            _context28.next = 27;
            return (0, _communication_react.postAjaxPromise)("get_resource_names/collection", {});
          case 27:
            _data = _context28.sent;
            _context28.next = 30;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Combine Collections",
              field_title: "Name for combined collection",
              default_value: "NewCollection",
              existing_names: _data.resource_names,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 30:
            new_name = _context28.sent;
            _context28.next = 33;
            return (0, _communication_react.postAjaxPromise)("combine_to_new_collection", {
              "original_collections": list_of_selected_ref.current,
              "new_name": new_name
            });
          case 33:
            _context28.next = 40;
            break;
          case 35:
            _context28.prev = 35;
            _context28.t1 = _context28["catch"](24);
            if (_context28.t1 != "canceled") {
              errorDrawerFuncs.addFromError("Error combining collections", _context28.t1);
            }
            statusFuncs.stopSpinner();
            return _context28.abrupt("return");
          case 40:
          case "end":
            return _context28.stop();
        }
      }, _callee28, null, [[2, 17], [24, 35]]);
    }));
    return _combineCollections2.apply(this, arguments);
  }
  function _downloadCollection() {
    return _downloadCollection2.apply(this, arguments);
  }
  function _downloadCollection2() {
    _downloadCollection2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee29() {
      var resource_name,
        res_name,
        new_name,
        _args29 = arguments;
      return _regeneratorRuntime().wrap(function _callee29$(_context29) {
        while (1) switch (_context29.prev = _context29.next) {
          case 0:
            resource_name = _args29.length > 0 && _args29[0] !== undefined ? _args29[0] : null;
            res_name = resource_name ? resource_name : selected_resource_ref.current.name;
            _context29.prev = 2;
            _context29.next = 5;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Download Collection",
              field_title: "New File Name",
              default_value: res_name,
              existing_names: [],
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 5:
            new_name = _context29.sent;
            window.open("".concat($SCRIPT_ROOT, "/download_collection/") + res_name + "/" + new_name);
            _context29.next = 13;
            break;
          case 9:
            _context29.prev = 9;
            _context29.t0 = _context29["catch"](2);
            if (_context29.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error combing collections", _context29.t0);
            }
            return _context29.abrupt("return");
          case 13:
          case "end":
            return _context29.stop();
        }
      }, _callee29, null, [[2, 9]]);
    }));
    return _downloadCollection2.apply(this, arguments);
  }
  function _displayImportResults(data) {
    var title = "Collection Created";
    var message = "";
    var number_of_errors;
    if (data.file_decoding_errors == null) {
      statusFuncs.statusMessage("No import errors");
    } else {
      message = "<b>Decoding errors were enountered</b>";
      for (var filename in data.file_decoding_errors) {
        number_of_errors = String(data.file_decoding_errors[filename].length);
        message = message + "<br>".concat(filename, ": ").concat(number_of_errors, " errors");
      }
      errorDrawerFuncs.addErrorDrawerEntry({
        title: title,
        content: message
      });
    }
  }
  function _showCollectionImport() {
    dialogFuncs.showModal("FileImportDialog", {
      res_type: "collection",
      allowed_file_types: ".csv,.tsv,.txt,.xls,.xlsx,.html",
      checkboxes: [{
        "checkname": "import_as_freeform",
        "checktext": "Import as freeform"
      }],
      process_handler: _import_collection,
      chunking: false,
      chunkSize: null,
      forceChunking: false,
      tsocket: props.tsocket,
      combine: true,
      show_csv_options: true,
      after_upload: null,
      show_address_selector: false,
      initial_address: null,
      handleClose: dialogFuncs.hideModal,
      handleCancel: null
    });
  }
  function _import_collection(_x12, _x13, _x14, _x15) {
    return _import_collection2.apply(this, arguments);
  }
  function _import_collection2() {
    _import_collection2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee30(myDropZone, setCurrentUrl, new_name, check_results) {
      var csv_options,
        doc_type,
        new_url,
        _args30 = arguments;
      return _regeneratorRuntime().wrap(function _callee30$(_context30) {
        while (1) switch (_context30.prev = _context30.next) {
          case 0:
            csv_options = _args30.length > 4 && _args30[4] !== undefined ? _args30[4] : null;
            doc_type = check_results["import_as_freeform"] ? "freeform" : "table";
            _context30.prev = 2;
            _context30.next = 5;
            return (0, _communication_react.postAjaxPromise)("create_empty_collection", {
              "collection_name": new_name,
              "doc_type": doc_type,
              "library_id": props.library_id,
              "csv_options": csv_options
            });
          case 5:
            new_url = "append_documents_to_collection/".concat(new_name, "/").concat(doc_type, "/").concat(props.library_id);
            myDropZone.options.url = new_url;
            setCurrentUrl(new_url);
            myDropZone.processQueue();
            _context30.next = 14;
            break;
          case 11:
            _context30.prev = 11;
            _context30.t0 = _context30["catch"](2);
            errorDrawerFuncs.addFromError("Error importing document", _context30.t0);
          case 14:
          case "end":
            return _context30.stop();
        }
      }, _callee30, null, [[2, 11]]);
    }));
    return _import_collection2.apply(this, arguments);
  }
  function _tile_view() {
    return _tile_view2.apply(this, arguments);
  }
  function _tile_view2() {
    _tile_view2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee31() {
      return _regeneratorRuntime().wrap(function _callee31$(_context31) {
        while (1) switch (_context31.prev = _context31.next) {
          case 0:
            _context31.next = 2;
            return _view_func("/view_module/");
          case 2:
          case "end":
            return _context31.stop();
        }
      }, _callee31);
    }));
    return _tile_view2.apply(this, arguments);
  }
  function _view_named_tile(_x16) {
    return _view_named_tile2.apply(this, arguments);
  }
  function _view_named_tile2() {
    _view_named_tile2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee32(res) {
      var in_new_tab,
        _args32 = arguments;
      return _regeneratorRuntime().wrap(function _callee32$(_context32) {
        while (1) switch (_context32.prev = _context32.next) {
          case 0:
            in_new_tab = _args32.length > 1 && _args32[1] !== undefined ? _args32[1] : false;
            _context32.next = 3;
            return _view_resource({
              name: res.name,
              res_type: "tile"
            }, "/view_module/", in_new_tab);
          case 3:
          case "end":
            return _context32.stop();
        }
      }, _callee32);
    }));
    return _view_named_tile2.apply(this, arguments);
  }
  function _creator_view_named_tile(_x17) {
    return _creator_view_named_tile2.apply(this, arguments);
  }
  function _creator_view_named_tile2() {
    _creator_view_named_tile2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee33(res) {
      var in_new_tab,
        _args33 = arguments;
      return _regeneratorRuntime().wrap(function _callee33$(_context33) {
        while (1) switch (_context33.prev = _context33.next) {
          case 0:
            in_new_tab = _args33.length > 1 && _args33[1] !== undefined ? _args33[1] : false;
            _context33.next = 3;
            return _view_resource({
              name: res.tile,
              res_type: "tile"
            }, "/view_in_creator/", in_new_tab);
          case 3:
          case "end":
            return _context33.stop();
        }
      }, _callee33);
    }));
    return _creator_view_named_tile2.apply(this, arguments);
  }
  function _creator_view() {
    return _creator_view2.apply(this, arguments);
  }
  function _creator_view2() {
    _creator_view2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee34() {
      return _regeneratorRuntime().wrap(function _callee34$(_context34) {
        while (1) switch (_context34.prev = _context34.next) {
          case 0:
            _context34.next = 2;
            return _view_func("/view_in_creator/");
          case 2:
          case "end":
            return _context34.stop();
        }
      }, _callee34);
    }));
    return _creator_view2.apply(this, arguments);
  }
  function _showHistoryViewer() {
    window.open("".concat($SCRIPT_ROOT, "/show_history_viewer/").concat(selected_resource_ref.current.name));
  }
  function _compare_tiles() {
    var res_names = list_of_selected_ref.current;
    if (res_names.length == 0) return;
    if (res_names.length == 1) {
      window.open("".concat($SCRIPT_ROOT, "/show_tile_differ/").concat(res_names[0]));
    } else if (res_names.length == 2) {
      window.open("".concat($SCRIPT_ROOT, "/show_tile_differ/both_names/").concat(res_names[0], "/").concat(res_names[1]));
    } else {
      (0, _toaster.doFlash)({
        "alert-type": "alert-warning",
        "message": "Select only one or two tiles before launching compare"
      });
    }
  }
  function _load_tile() {
    return _load_tile2.apply(this, arguments);
  }
  function _load_tile2() {
    _load_tile2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee35() {
      var resource,
        res_name,
        _args35 = arguments;
      return _regeneratorRuntime().wrap(function _callee35$(_context35) {
        while (1) switch (_context35.prev = _context35.next) {
          case 0:
            resource = _args35.length > 0 && _args35[0] !== undefined ? _args35[0] : null;
            res_name = resource ? resource.name : selected_resource_ref.current.name;
            _context35.prev = 2;
            _context35.next = 5;
            return (0, _communication_react.postPromise)("host", "load_tile_module_task", {
              "tile_module_name": res_name,
              "user_id": window.user_id
            });
          case 5:
            statusFuncs.statusMessage("Loaded tile ".concat(res_name));
            _context35.next = 11;
            break;
          case 8:
            _context35.prev = 8;
            _context35.t0 = _context35["catch"](2);
            errorDrawerFuncs.addFromError("Error loading tile", _context35.t0);
          case 11:
          case "end":
            return _context35.stop();
        }
      }, _callee35, null, [[2, 8]]);
    }));
    return _load_tile2.apply(this, arguments);
  }
  function _unload_module() {
    return _unload_module2.apply(this, arguments);
  }
  function _unload_module2() {
    _unload_module2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee36() {
      var resource,
        res_name,
        _args36 = arguments;
      return _regeneratorRuntime().wrap(function _callee36$(_context36) {
        while (1) switch (_context36.prev = _context36.next) {
          case 0:
            resource = _args36.length > 0 && _args36[0] !== undefined ? _args36[0] : null;
            res_name = resource ? resource.name : selected_resource_ref.current.name;
            _context36.prev = 2;
            _context36.next = 5;
            return (0, _communication_react.postAjaxPromise)("unload_one_module/".concat(res_name), {});
          case 5:
            statusFuncs.statusMessage("Tile unloaded");
            _context36.next = 11;
            break;
          case 8:
            _context36.prev = 8;
            _context36.t0 = _context36["catch"](2);
            errorDrawerFuncs.addFromError("Error unloading tile", _context36.t0);
          case 11:
          case "end":
            return _context36.stop();
        }
      }, _callee36, null, [[2, 8]]);
    }));
    return _unload_module2.apply(this, arguments);
  }
  function _unload_all_tiles() {
    return _unload_all_tiles2.apply(this, arguments);
  }
  function _unload_all_tiles2() {
    _unload_all_tiles2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee37() {
      return _regeneratorRuntime().wrap(function _callee37$(_context37) {
        while (1) switch (_context37.prev = _context37.next) {
          case 0:
            _context37.prev = 0;
            _context37.next = 3;
            return (0, _communication_react.postAjaxPromise)("unload_all_tiles", {});
          case 3:
            statusFuncs.statusMessage("Unloaded all tiles");
            _context37.next = 9;
            break;
          case 6:
            _context37.prev = 6;
            _context37.t0 = _context37["catch"](0);
            errorDrawerFuncs.addFromError("Error unloading tiles", _context37.t0);
          case 9:
          case "end":
            return _context37.stop();
        }
      }, _callee37, null, [[0, 6]]);
    }));
    return _unload_all_tiles2.apply(this, arguments);
  }
  function _new_tile(_x18) {
    return _new_tile2.apply(this, arguments);
  }
  function _new_tile2() {
    _new_tile2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee38(template_name) {
      var data, new_name, result_dict;
      return _regeneratorRuntime().wrap(function _callee38$(_context38) {
        while (1) switch (_context38.prev = _context38.next) {
          case 0:
            _context38.prev = 0;
            _context38.next = 3;
            return (0, _communication_react.postAjaxPromise)("get_resource_names/tile", {});
          case 3:
            data = _context38.sent;
            _context38.next = 6;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "New Tile",
              field_title: "New Tile Name",
              default_value: "NewTileModule",
              existing_names: data.resource_names,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 6:
            new_name = _context38.sent;
            result_dict = {
              "template_name": template_name,
              "new_res_name": new_name,
              "last_saved": "viewer"
            };
            _context38.next = 10;
            return (0, _communication_react.postAjaxPromise)("/create_tile_module", result_dict);
          case 10:
            _context38.next = 12;
            return _view_resource({
              name: new_name,
              res_type: "tile"
            }, "/view_module/");
          case 12:
            _context38.next = 18;
            break;
          case 14:
            _context38.prev = 14;
            _context38.t0 = _context38["catch"](0);
            if (_context38.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error creating tile module", _context38.t0);
            }
            return _context38.abrupt("return");
          case 18:
          case "end":
            return _context38.stop();
        }
      }, _callee38, null, [[0, 14]]);
    }));
    return _new_tile2.apply(this, arguments);
  }
  function _new_in_creator(_x19) {
    return _new_in_creator2.apply(this, arguments);
  }
  function _new_in_creator2() {
    _new_in_creator2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee39(template_name) {
      var data, new_name, result_dict;
      return _regeneratorRuntime().wrap(function _callee39$(_context39) {
        while (1) switch (_context39.prev = _context39.next) {
          case 0:
            _context39.prev = 0;
            _context39.next = 3;
            return (0, _communication_react.postAjaxPromise)("get_resource_names/tile", {});
          case 3:
            data = _context39.sent;
            _context39.next = 6;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "New Tile",
              field_title: "New Tile Name",
              default_value: "NewTileModule",
              existing_names: data.resource_names,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 6:
            new_name = _context39.sent;
            result_dict = {
              "template_name": template_name,
              "new_res_name": new_name,
              "last_saved": "creator"
            };
            _context39.next = 10;
            return (0, _communication_react.postAjaxPromise)("/create_tile_module", result_dict);
          case 10:
            _context39.next = 12;
            return _view_resource({
              name: String(new_name),
              res_type: "tile"
            }, "/view_in_creator/");
          case 12:
            _context39.next = 17;
            break;
          case 14:
            _context39.prev = 14;
            _context39.t0 = _context39["catch"](0);
            if (_context39.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error creating tile module", _context39.t0);
            }
          case 17:
          case "end":
            return _context39.stop();
        }
      }, _callee39, null, [[0, 14]]);
    }));
    return _new_in_creator2.apply(this, arguments);
  }
  function _new_list(_x20) {
    return _new_list2.apply(this, arguments);
  }
  function _new_list2() {
    _new_list2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee40(template_name) {
      var data, new_name, result_dict;
      return _regeneratorRuntime().wrap(function _callee40$(_context40) {
        while (1) switch (_context40.prev = _context40.next) {
          case 0:
            _context40.prev = 0;
            _context40.next = 3;
            return (0, _communication_react.postAjaxPromise)("get_resource_names/list", {});
          case 3:
            data = _context40.sent;
            _context40.next = 6;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "New List Resource",
              field_title: "New List Name",
              default_value: "NewListResource",
              existing_names: data.resource_names,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 6:
            new_name = _context40.sent;
            result_dict = {
              "template_name": template_name,
              "new_res_name": new_name
            };
            _context40.next = 10;
            return (0, _communication_react.postAjaxPromise)("/create_list", result_dict);
          case 10:
            _context40.next = 12;
            return _view_resource({
              name: String(new_name),
              res_type: "list"
            }, "/view_list/");
          case 12:
            _context40.next = 17;
            break;
          case 14:
            _context40.prev = 14;
            _context40.t0 = _context40["catch"](0);
            if (_context40.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error creating list resource", _context40.t0);
            }
          case 17:
          case "end":
            return _context40.stop();
        }
      }, _callee40, null, [[0, 14]]);
    }));
    return _new_list2.apply(this, arguments);
  }
  function _add_list(myDropZone, setCurrentUrl) {
    var new_url = "import_list/".concat(props.library_id);
    myDropZone.options.url = new_url;
    setCurrentUrl(new_url);
    myDropZone.processQueue();
  }
  function _showListImport() {
    dialogFuncs.showModal("FileImportDialog", {
      res_type: "list",
      allowed_file_types: "text/*",
      checkboxes: [],
      chunking: false,
      chunkSize: null,
      forceChunking: false,
      process_handler: _add_list,
      tsocket: props.tsocket,
      combine: false,
      show_csv_options: false,
      after_upload: null,
      show_address_selector: false,
      initial_address: null,
      handleClose: dialogFuncs.hideModal,
      handleCancel: null
    });
  }
  function _add_to_pool(myDropZone, setCurrentUrl, current_value) {
    var new_url = "import_pool/".concat(props.library_id);
    myDropZone.options.url = new_url;
    setCurrentUrl(new_url);
    myDropZone.processQueue();
  }
  function _new_code(_x21) {
    return _new_code2.apply(this, arguments);
  }
  function _new_code2() {
    _new_code2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee41(template_name) {
      var data, new_name, result_dict;
      return _regeneratorRuntime().wrap(function _callee41$(_context41) {
        while (1) switch (_context41.prev = _context41.next) {
          case 0:
            _context41.prev = 0;
            _context41.next = 3;
            return (0, _communication_react.postAjaxPromise)("get_resource_names/code", {});
          case 3:
            data = _context41.sent;
            _context41.next = 6;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "New code Resource",
              field_title: "New Code Resource Name",
              default_value: "NewCodeResource",
              existing_names: data.resource_names,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 6:
            new_name = _context41.sent;
            result_dict = {
              "template_name": template_name,
              "new_res_name": new_name
            };
            _context41.next = 10;
            return (0, _communication_react.postAjaxPromise)("/create_code", result_dict);
          case 10:
            _context41.next = 12;
            return _view_resource({
              name: String(new_name),
              res_type: "code"
            }, "/view_code/");
          case 12:
            _context41.next = 17;
            break;
          case 14:
            _context41.prev = 14;
            _context41.t0 = _context41["catch"](0);
            if (_context41.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error creating code resource", _context41.t0);
            }
          case 17:
          case "end":
            return _context41.stop();
        }
      }, _callee41, null, [[0, 14]]);
    }));
    return _new_code2.apply(this, arguments);
  }
  function _menu_funcs() {
    return {
      view_func: _view_func,
      send_repository_func: _send_repository_func,
      repository_copy_func: _repository_copy_func,
      duplicate_func: _duplicate_func,
      refresh_func: _refresh_func,
      delete_func: _delete_func,
      rename_func: _rename_func,
      new_notebook: _new_notebook,
      new_project: _new_project,
      downloadJupyter: _downloadJupyter,
      showJupyterImport: _showJupyterImport,
      combineCollections: _combineCollections,
      showCollectionImport: _showCollectionImport,
      downloadCollection: _downloadCollection,
      new_in_creator: _new_in_creator,
      creator_view: _creator_view,
      tile_view: _tile_view,
      creator_view_named_tile: _creator_view_named_tile,
      view_named_tile: _view_named_tile,
      load_tile: _load_tile,
      unload_module: _unload_module,
      unload_all_tiles: _unload_all_tiles,
      showHistoryViewer: _showHistoryViewer,
      compare_tiles: _compare_tiles,
      new_list: _new_list,
      showListImport: _showListImport,
      new_code: _new_code
    };
  }
  var new_button_groups;
  var primary_mdata_fields = ["name", "created", "updated", "tags", "notes"];
  var ignore_fields = ["doc_type", "res_type"];
  var additional_metadata = {};
  var selected_resource_icon = null;
  for (var field in selected_resource_ref.current) {
    if (selected_rows_ref.current.length == 1 && selected_resource_ref.current.res_type == "tile" && field == "icon") {
      selected_resource_icon = selected_resource_ref.current["icon"];
    }
    if (!primary_mdata_fields.includes(field) && !ignore_fields.includes(field) && !field.startsWith("icon:")) {
      additional_metadata[field] = selected_resource_ref.current[field];
    }
  }
  if (Object.keys(additional_metadata).length == 0) {
    additional_metadata = null;
  }
  var split_tags = selected_resource_ref.current.tags == "" ? [] : selected_resource_ref.current.tags.split(" ");
  var outer_style = {
    marginTop: 0,
    marginLeft: 5,
    overflow: "auto",
    padding: 15,
    marginRight: 0,
    height: "100%"
  };
  var right_pane = /*#__PURE__*/_react["default"].createElement(_blueprint_mdata_fields.CombinedMetadata, {
    tags: split_tags,
    all_tags: tag_list,
    elevation: 2,
    name: selected_resource_ref.current.name,
    created: selected_resource_ref.current.created,
    updated: selected_resource_ref.current.updated,
    notes: selected_resource_ref.current.notes,
    icon: selected_resource_icon,
    handleChange: _handleMetadataChange,
    res_type: selected_resource_ref.current.res_type,
    pane_type: props.pane_type,
    outer_style: outer_style,
    handleNotesBlur: null,
    additional_metadata: additional_metadata,
    readOnly: props.is_repository
  });
  var th_style = {
    "display": "inline-block",
    "verticalAlign": "top",
    "maxHeight": "100%",
    "overflowY": "scroll",
    "overflowX": "scroll",
    "lineHeight": 1,
    "whiteSpace": "nowrap"
  };
  var MenubarClass = props.MenubarClass;
  var key_bindings = [[["up"], function () {
    return _handleArrowKeyPress("ArrowUp");
  }], [["down"], function () {
    return _handleArrowKeyPress("ArrowDown");
  }], [["esc"], _unsearch]];
  var filter_buttons = [];
  var _iterator4 = _createForOfIteratorHelper(["all"].concat(res_types)),
    _step4;
  try {
    var _loop = function _loop() {
      var rtype = _step4.value;
      filter_buttons.push( /*#__PURE__*/_react["default"].createElement(_popover.Tooltip2, {
        content: rtype,
        key: rtype,
        placement: "top",
        hoverOpenDelay: 700,
        intent: "warning"
      }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
        icon: _blueprint_mdata_fields.icon_dict[rtype],
        minimal: true,
        active: rtype == filterTypeRef.current,
        onClick: /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee42() {
          return _regeneratorRuntime().wrap(function _callee42$(_context42) {
            while (1) switch (_context42.prev = _context42.next) {
              case 0:
                _context42.next = 2;
                return _setFilterType(rtype);
              case 2:
              case "end":
                return _context42.stop();
            }
          }, _callee42);
        }))
      })));
    };
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      _loop();
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }
  var left_pane = /*#__PURE__*/_react["default"].createElement(_library_table_pane.LibraryTablePane, _extends({}, props, {
    tag_list: tag_list,
    expanded_tags_ref: expanded_tags_ref,
    active_tag_ref: active_tag_ref,
    updateTagState: _update_search_state,
    filter_buttons: filter_buttons,
    update_search_state: _update_search_state,
    search_string_ref: search_string_ref,
    search_inside_ref: search_inside_ref,
    show_hidden_ref: show_hidden_ref,
    search_metadata_ref: search_metadata_ref,
    data_dict_ref: data_dict_ref,
    rowChanged: rowChanged,
    num_rows: num_rows,
    sortColumn: _set_sort_state,
    selectedRegionsRef: selectedRegionsRef,
    onSelection: _onTableSelection,
    keyHandler: _handleTableKeyPress,
    initiateDataGrab: _grabNewChunkWithRow,
    renderBodyContextMenu: _renderBodyContextMenu,
    handleRowDoubleClick: _handleRowDoubleClick
  }));
  var selected_types = _selectedTypes();
  selectedTypeRef.current = selected_types.length == 1 ? selected_resource_ref.current.res_type : "multi";
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(MenubarClass, _extends({
    selected_resource: selected_resource_ref.current,
    connection_status: props.connection_status,
    multi_select: multi_select_ref.current,
    list_of_selected: list_of_selected_ref.current,
    selected_rows: selected_rows_ref.current,
    selectedTypeRef: selectedTypeRef
  }, _menu_funcs(), {
    sendContextMenuItems: setContextMenuItems,
    view_resource: _view_resource,
    open_raw: _open_raw
  }, props.errorDrawerFuncs, {
    handleCreateViewer: props.handleCreateViewer,
    library_id: props.library_id,
    controlled: props.controlled,
    tsocket: props.tsocket
  })), /*#__PURE__*/_react["default"].createElement("div", {
    ref: top_ref,
    className: "d-flex flex-column"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      width: "100%",
      height: usable_height
    }
  }, /*#__PURE__*/_react["default"].createElement(_resizing_layouts.HorizontalPanes, {
    show_handle: true,
    left_pane: left_pane,
    right_pane: right_pane,
    right_pane_overflow: "auto",
    initial_width_fraction: .75,
    scrollAdjustSelectors: [".bp5-table-quadrant-scroll-container"],
    handleSplitUpdate: null,
    handleResizeStart: null,
    handleResizeEnd: null
  })), /*#__PURE__*/_react["default"].createElement(_key_trap.KeyTrap, {
    global: true,
    bindings: key_bindings
  })));
}
exports.LibraryPane = LibraryPane = /*#__PURE__*/(0, _react.memo)(LibraryPane);
LibraryPane.propTypes = {
  columns: _propTypes["default"].object,
  pane_type: _propTypes["default"].string,
  open_resources_ref: _propTypes["default"].object,
  allow_search_inside: _propTypes["default"].bool,
  allow_search_metadata: _propTypes["default"].bool,
  is_repository: _propTypes["default"].bool,
  selected_resource: _propTypes["default"].object,
  selected_rows: _propTypes["default"].array,
  sort_field: _propTypes["default"].string,
  sorting_field: _propTypes["default"].string,
  sort_direction: _propTypes["default"].string,
  filterType: _propTypes["default"].string,
  multi_select: _propTypes["default"].bool,
  list_of_selected: _propTypes["default"].array,
  search_string: _propTypes["default"].string,
  search_inside: _propTypes["default"].bool,
  search_metadata: _propTypes["default"].bool,
  show_hidden: _propTypes["default"].bool,
  search_tag: _propTypes["default"].string,
  tag_button_state: _propTypes["default"].object,
  contextItems: _propTypes["default"].array,
  library_id: _propTypes["default"].string
};
LibraryPane.defaultProps = {
  columns: {
    "name": {
      "first_sort": "ascending"
    },
    "created": {
      "first_sort": "descending"
    },
    "updated": {
      "first_sort": "ascending"
    },
    "tags": {
      "first_sort": "ascending"
    }
  },
  is_repository: false,
  tsocket: null
};
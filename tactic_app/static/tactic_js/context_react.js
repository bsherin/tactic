"use strict";

require("../tactic_css/tactic.scss");
require("../tactic_css/context.scss");
require("../tactic_css/tactic_table.scss");
require("../tactic_css/library_home.scss");
require("../tactic_css/tile_creator.scss");
var _react = _interopRequireWildcard(require("react"));
var ReactDOM = _interopRequireWildcard(require("react-dom"));
var _core = require("@blueprintjs/core");
var _utilities_react = require("./utilities_react");
var _tactic_socket = require("./tactic_socket");
var _TacticOmnibar = require("./TacticOmnibar");
var _communication_react = require("./communication_react");
var _toaster = require("./toaster");
var _blueprint_navbar = require("./blueprint_navbar");
var _error_boundary = require("./error_boundary");
var _blueprint_mdata_fields = require("./blueprint_mdata_fields");
var _library_home_react = require("./library_home_react");
var _pool_browser = require("./pool_browser");
var _library_pane = require("./library_pane");
var _module_viewer_react = require("./module_viewer_react");
var _tile_creator_react = require("./tile_creator_react");
var _tile_creator_support = require("./tile_creator_support");
var _main_app = require("./main_app");
var _main_support = require("./main_support");
var _notebook_app = require("./notebook_app");
var _notebook_support = require("./notebook_support");
var _code_viewer_react = require("./code_viewer_react");
var _list_viewer_react = require("./list_viewer_react");
var _error_drawer = require("./error_drawer");
var _sizing_tools = require("./sizing_tools");
var _key_trap = require("./key_trap");
var _resizing_layouts = require("./resizing_layouts");
var _theme = require("./theme");
var _modal_react = require("./modal_react");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; } // noinspection XmlDeprecatedElement,JSXUnresolvedComponent
_core.FocusStyleManager.onlyShowFocusOnTabs();
var spinner_panel = /*#__PURE__*/_react["default"].createElement("div", {
  style: {
    height: "100%",
    position: "absolute",
    top: "50%",
    left: "50%"
  }
}, /*#__PURE__*/_react["default"].createElement(_core.Spinner, {
  size: 100
}));
var MIN_CONTEXT_WIDTH = 45;
var MIN_CONTEXT_SAVED_WIDTH = 100;
var iconDict = {
  "module-viewer": "application",
  "code-viewer": "code",
  "list-viewer": "list",
  "creator-viewer": "application",
  "main-viewer": "projects",
  "notebook-viewer": "projects"
};
var libIconDict = {
  all: _blueprint_mdata_fields.icon_dict["all"],
  collections: _blueprint_mdata_fields.icon_dict["collection"],
  projects: _blueprint_mdata_fields.icon_dict["project"],
  tiles: _blueprint_mdata_fields.icon_dict["tile"],
  lists: _blueprint_mdata_fields.icon_dict["list"],
  code: _blueprint_mdata_fields.icon_dict["code"],
  pool: _blueprint_mdata_fields.icon_dict["pool"]
};
var propDict = {
  "module-viewer": _module_viewer_react.module_viewer_props,
  "code-viewer": _code_viewer_react.code_viewer_props,
  "list-viewer": _list_viewer_react.list_viewer_props,
  "creator-viewer": _tile_creator_support.creator_props,
  "main-viewer": _main_support.main_props,
  "notebook-viewer": _notebook_support.notebook_props
};
var panelRootDict = {
  "module-viewer": "root",
  "code-viewer": "root",
  "list-viewer": "root",
  "creator-viewer": "creator-root",
  "main-viewer": "main-root",
  "notebook-viewer": "main-root"
};
window.context_id = (0, _utilities_react.guid)();
window.main_id = window.context_id;
var tsocket = new _tactic_socket.TacticSocket("main", 5000, "context", window.context_id);
var classDict = {
  "module-viewer": _module_viewer_react.ModuleViewerApp,
  "code-viewer": _code_viewer_react.CodeViewerApp,
  "list-viewer": _list_viewer_react.ListViewerApp,
  "creator-viewer": _tile_creator_react.CreatorApp,
  "main-viewer": _main_app.MainApp,
  "notebook-viewer": _notebook_app.NotebookApp
};
function _context_main() {
  var ContextAppPlus = (0, _theme.withTheme)((0, _modal_react.withDialogs)((0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(ContextApp))));
  var domContainer = document.querySelector('#context-root');
  ReactDOM.render( /*#__PURE__*/_react["default"].createElement(ContextAppPlus, {
    initial_theme: window.theme,
    tsocket: tsocket
  }), domContainer);
}
function ContextApp(props) {
  var _useStateAndRefAndCou = (0, _utilities_react.useStateAndRefAndCounter)("library"),
    _useStateAndRefAndCou2 = _slicedToArray(_useStateAndRefAndCou, 4),
    selectedTabId = _useStateAndRefAndCou2[0],
    setSelectedTabId = _useStateAndRefAndCou2[1],
    selectedTabIdRef = _useStateAndRefAndCou2[2],
    selectedTabIdCounter = _useStateAndRefAndCou2[3];
  var _useState = (0, _react.useState)(_sizing_tools.INIT_CONTEXT_PANEL_WIDTH),
    _useState2 = _slicedToArray(_useState, 2),
    saved_width = _useState2[0],
    set_saved_width = _useState2[1];
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)({}),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    tab_panel_dict = _useStateAndRef2[0],
    set_tab_panel_dict = _useStateAndRef2[1],
    tab_panel_dict_ref = _useStateAndRef2[2];
  var _useStateAndRef3 = (0, _utilities_react.useStateAndRef)([]),
    _useStateAndRef4 = _slicedToArray(_useStateAndRef3, 3),
    tab_ids = _useStateAndRef4[0],
    set_tab_ids = _useStateAndRef4[1],
    tab_ids_ref = _useStateAndRef4[2];
  var _useStateAndRef5 = (0, _utilities_react.useStateAndRef)([]),
    _useStateAndRef6 = _slicedToArray(_useStateAndRef5, 3),
    open_resources = _useStateAndRef6[0],
    set_open_resources = _useStateAndRef6[1],
    open_resources_ref = _useStateAndRef6[2];
  var _useState3 = (0, _react.useState)({}),
    _useState4 = _slicedToArray(_useState3, 2),
    dirty_methods = _useState4[0],
    set_dirty_methods = _useState4[1];
  var _useState5 = (0, _react.useState)(null),
    _useState6 = _slicedToArray(_useState5, 2),
    lastSelectedTabId = _useState6[0],
    setLastSelectedTabId = _useState6[1];
  var _useState7 = (0, _react.useState)(function () {
      return (0, _sizing_tools.getUsableDimensions)(true).usable_width - _sizing_tools.INIT_CONTEXT_PANEL_WIDTH;
    }),
    _useState8 = _slicedToArray(_useState7, 2),
    usable_width = _useState8[0],
    set_usable_width = _useState8[1];
  var _useState9 = (0, _react.useState)(function () {
      return (0, _sizing_tools.getUsableDimensions)(true).usable_height_no_bottom;
    }),
    _useState10 = _slicedToArray(_useState9, 2),
    usable_height = _useState10[0],
    set_usable_height = _useState10[1];
  var _useState11 = (0, _react.useState)(170),
    _useState12 = _slicedToArray(_useState11, 2),
    paneX = _useState12[0],
    setPaneX = _useState12[1];
  var _useState13 = (0, _react.useState)(_sizing_tools.USUAL_NAVBAR_HEIGHT),
    _useState14 = _slicedToArray(_useState13, 2),
    paneY = _useState14[0],
    setPaneY = _useState14[1];
  var _useState15 = (0, _react.useState)(_sizing_tools.INIT_CONTEXT_PANEL_WIDTH),
    _useState16 = _slicedToArray(_useState15, 2),
    tabWidth = _useState16[0],
    setTabWidth = _useState16[1];
  var _useState17 = (0, _react.useState)(false),
    _useState18 = _slicedToArray(_useState17, 2),
    show_repository = _useState18[0],
    set_show_repository = _useState18[1];
  var _useState19 = (0, _react.useState)(null),
    _useState20 = _slicedToArray(_useState19, 2),
    dragging_over = _useState20[0],
    set_dragging_over = _useState20[1];
  var _useState21 = (0, _react.useState)(null),
    _useState22 = _slicedToArray(_useState21, 2),
    currently_dragging = _useState22[0],
    set_currently_dragging = _useState22[1];
  var _useState23 = (0, _react.useState)(false),
    _useState24 = _slicedToArray(_useState23, 2),
    showOpenOmnibar = _useState24[0],
    setShowOpenOmnibar = _useState24[1];
  var theme = (0, _react.useContext)(_theme.ThemeContext);
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  var statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  var _useState25 = (0, _react.useState)(0),
    _useState26 = _slicedToArray(_useState25, 2),
    tabSelectCounter = _useState26[0],
    setTabSelectCounter = _useState26[1];
  var omniItemsRef = (0, _react.useRef)({});
  var top_ref = (0, _react.useRef)(null);
  var key_bindings = [[["tab"], _goToNextPane], [["shift+tab"], _goToPreviousPane], [["ctrl+space"], _showOpenOmnibar], [["ctrl+w"], /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return _closeTab(selectedTabIdRef.current);
        case 2:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }))]];
  var pushCallback = (0, _utilities_react.useCallbackStack)("context");
  (0, _react.useEffect)(function () {
    initSocket();
    _addContextOmniItems();
    errorDrawerFuncs.registerGoToModule(_goToModule);
    return function () {
      tsocket.disconnect();
    };
  }, []);
  var _useDebounce = (0, _utilities_react.useDebounce)(function () {
      _update_window_dimensions(null);
    }, 0),
    _useDebounce2 = _slicedToArray(_useDebounce, 2),
    waiting = _useDebounce2[0],
    doResize = _useDebounce2[1];
  (0, _react.useEffect)(function () {
    // for mount
    window.addEventListener("resize", function () {
      return _update_window_dimensions(null);
    });
    window.addEventListener("beforeunload", function (e) {
      e.preventDefault();
      e.returnValue = 'Are you sure you want to close? All changes will be lost.';
    });
    _update_window_dimensions(null);
    var tab_list_elem = document.querySelector("#context-container .context-tab-list > .bp5-tab-list");
    var resizeObserver = new ResizeObserver(function (entries) {
      _update_window_dimensions(null);
    });
    if (tab_list_elem) {
      resizeObserver.observe(tab_list_elem);
    }
  }, []);
  (0, _react.useEffect)(function () {
    _update_window_dimensions(null);
  }, [selectedTabId]);
  function get_tab_list_elem() {
    return document.querySelector("#context-container .context-tab-list > .bp5-tab-list");
  }
  function _togglePane(pane_closed) {
    var w = pane_closed ? saved_width : MIN_CONTEXT_WIDTH;
    var tab_elem = get_tab_list_elem();
    tab_elem.setAttribute("style", "width:".concat(w, "px"));
    pushCallback(_update_window_dimensions);
  }
  function _handleTabResize(e, ui, lastX, lastY, dx, dy) {
    var tab_elem = get_tab_list_elem();
    var w = lastX > window.innerWidth / 2 ? window.innerWidth / 2 : lastX;
    w = w <= MIN_CONTEXT_WIDTH ? MIN_CONTEXT_WIDTH : w;
    tab_elem.setAttribute("style", "width:".concat(w, "px"));
  }
  function _handleTabResizeStart(e, ui, lastX, lastY, dx, dy) {
    var new_width = Math.max(tabWidth, MIN_CONTEXT_SAVED_WIDTH);
    if (new_width != saved_width) {
      set_saved_width(new_width);
    }
  }
  function _handleTabResizeEnd(e, ui, lastX, lastY, dx, dy) {
    var tab_elem = get_tab_list_elem();
    var tab_rect = tab_elem.getBoundingClientRect();
    if (tab_rect.width > 45) {
      var new_width = Math.max(tab_rect.width, MIN_CONTEXT_SAVED_WIDTH);
      if (new_width != saved_width) {
        set_saved_width(new_width);
      }
    }
    pushCallback(_update_window_dimensions);
  }
  function _update_window_dimensions() {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var tab_list_elem = get_tab_list_elem();
    var uwidth;
    var uheight;
    var tWidth;
    var top_rect;
    if (top_ref && top_ref.current) {
      top_rect = top_ref.current.getBoundingClientRect();
      uheight = window.innerHeight - top_rect.top;
    } else {
      uheight = window.innerHeight - _sizing_tools.USUAL_NAVBAR_HEIGHT;
    }
    if (tab_list_elem) {
      var tab_rect = tab_list_elem.getBoundingClientRect();
      uwidth = window.innerWidth - tab_rect.width;
      tWidth = tab_rect.width;
    } else {
      uwidth = window.innerWidth - 150;
      tWidth = 150;
    }
    set_usable_height(uheight);
    set_usable_width(uwidth);
    setPaneX(tWidth);
    setPaneY(top_ref.current ? top_rect.top : _sizing_tools.USUAL_NAVBAR_HEIGHT);
    setTabWidth(tWidth);
    statusFuncs.setLeftEdge(tWidth);
    pushCallback(callback);
  }
  function _registerDirtyMethod(tab_id, dirty_method) {
    var new_dirty_methods = _objectSpread({}, dirty_methods);
    new_dirty_methods[tab_id] = dirty_method;
    set_dirty_methods(new_dirty_methods);
  }
  function initSocket() {
    props.tsocket.attachListener("window-open", function (data) {
      window.open("".concat($SCRIPT_ROOT, "/load_temp_page/").concat(data["the_id"]));
    });
    props.tsocket.attachListener('close-user-windows', function (data) {
      if (!(data["originator"] === window.context_id)) {
        window.close();
      }
    });
    props.tsocket.attachListener("doFlashUser", function (data) {
      (0, _toaster.doFlash)(data);
    });
    props.tsocket.attachListener('handle-callback', function (task_packet) {
      (0, _communication_react.handleCallback)(task_packet, window.context_id);
    });
    props.tsocket.attachListener("create-viewer", _handleCreateViewer);
  }
  function _refreshTab(_x2) {
    return _refreshTab2.apply(this, arguments);
  }
  function _refreshTab2() {
    _refreshTab2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(the_id) {
      var title, confirm_text, old_tab_panel, resource_name, res_type, the_view, re, drmethod, data, new_panel;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            if (!(the_id == "library")) {
              _context4.next = 2;
              break;
            }
            return _context4.abrupt("return");
          case 2:
            _context4.prev = 2;
            if (!(!(the_id in dirty_methods) || dirty_methods[the_id]())) {
              _context4.next = 8;
              break;
            }
            title = tab_panel_dict_ref.current[the_id].title;
            confirm_text = "Are you sure that you want to reload the tab ".concat(title, "? Changes will be lost");
            _context4.next = 8;
            return dialogFuncs.showModalPromise("ConfirmDialog", {
              title: "Reload the tab ".concat(title),
              text_body: confirm_text,
              cancel_text: "do nothing",
              submit_text: "reload",
              handleClose: dialogFuncs.hideModal
            });
          case 8:
            old_tab_panel = _objectSpread({}, tab_panel_dict_ref.current[the_id]);
            resource_name = old_tab_panel.panel.resource_name;
            res_type = old_tab_panel.res_type;
            if (old_tab_panel.kind == "notebook-viewer" && !old_tab_panel.panel.is_project) {
              the_view = "/new_notebook_in_context/";
            } else {
              the_view = (0, _library_pane.view_views)()[res_type];
              re = new RegExp("/$");
              the_view = the_view.replace(re, "_in_context");
            }
            drmethod = function drmethod(dmethod) {
              _registerDirtyMethod(the_id, dmethod);
            };
            _context4.next = 15;
            return _updatePanelPromise(the_id, {
              panel: "spinner"
            });
          case 15:
            _context4.next = 17;
            return (0, _communication_react.postAjaxPromise)($SCRIPT_ROOT + the_view, {
              context_id: window.context_id,
              resource_name: resource_name
            });
          case 17:
            data = _context4.sent;
            new_panel = propDict[data.kind](data, drmethod, function (new_panel) {
              _updatePanel(the_id, {
                panel: new_panel,
                kind: data.kind
              });
            });
            _context4.next = 24;
            break;
          case 21:
            _context4.prev = 21;
            _context4.t0 = _context4["catch"](2);
            if (_context4.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error refreshing pane", _context4.t0);
            }
          case 24:
          case "end":
            return _context4.stop();
        }
      }, _callee4, null, [[2, 21]]);
    }));
    return _refreshTab2.apply(this, arguments);
  }
  function _closeTab(_x3) {
    return _closeTab2.apply(this, arguments);
  }
  function _closeTab2() {
    _closeTab2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(the_id) {
      var title, confirm_text, idx, copied_tab_panel_dict, copied_tab_ids, copied_dirty_methods;
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            if (!(the_id == "library")) {
              _context5.next = 2;
              break;
            }
            return _context5.abrupt("return");
          case 2:
            _context5.prev = 2;
            if (!(!(the_id in dirty_methods) || dirty_methods[the_id]())) {
              _context5.next = 8;
              break;
            }
            title = tab_panel_dict_ref.current[the_id].title;
            confirm_text = "Are you sure that you want to close the tab ".concat(title, "? Changes will be lost");
            _context5.next = 8;
            return dialogFuncs.showModalPromise("ConfirmDialog", {
              title: "Close the tab ".concat(title, "\""),
              text_body: confirm_text,
              cancel_text: "do nothing",
              submit_text: "close",
              handleClose: dialogFuncs.hideModal
            });
          case 8:
            idx = tab_ids_ref.current.indexOf(the_id);
            copied_tab_panel_dict = _objectSpread({}, tab_panel_dict_ref.current);
            copied_tab_ids = _toConsumableArray(tab_ids_ref.current);
            copied_dirty_methods = _objectSpread({}, dirty_methods);
            if (idx > -1) {
              copied_tab_ids.splice(idx, 1);
              delete copied_tab_panel_dict[the_id];
              delete copied_dirty_methods[the_id];
            }
            set_tab_ids(copied_tab_ids);
            set_dirty_methods(copied_dirty_methods);
            set_tab_panel_dict(copied_tab_panel_dict);
            if (the_id in omniItemsRef.current) {
              delete omniItemsRef.current[the_id];
            }
            pushCallback(function () {
              if (the_id == selectedTabIdRef.current) {
                var newSelectedId;
                if (lastSelectedTabId && copied_tab_ids.includes(lastSelectedTabId)) {
                  newSelectedId = lastSelectedTabId;
                } else {
                  newSelectedId = "library";
                }
                setSelectedTabId(newSelectedId);
                setLastSelectedTabId("library");
              } else {
                setSelectedTabId(selectedTabId);
                if (lastSelectedTabId == the_id) {
                  setLastSelectedTabId("library");
                }
              }
              pushCallback(function () {
                _updateOpenResources(function () {
                  return _update_window_dimensions();
                });
              });
            });
            _context5.next = 23;
            break;
          case 20:
            _context5.prev = 20;
            _context5.t0 = _context5["catch"](2);
            if (_context5.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error closing tab", _context5.t0);
            }
          case 23:
          case "end":
            return _context5.stop();
        }
      }, _callee5, null, [[2, 20]]);
    }));
    return _closeTab2.apply(this, arguments);
  }
  function _addPanel(new_id, viewer_kind, res_type, title, new_panel) {
    var callback = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
    var new_tab_panel_dict = _objectSpread({}, tab_panel_dict_ref.current);
    new_tab_panel_dict[new_id] = {
      kind: viewer_kind,
      res_type: res_type,
      title: title,
      panel: new_panel
    };
    set_tab_panel_dict(new_tab_panel_dict);
    var new_tab_ids = [].concat(_toConsumableArray(tab_ids_ref.current), [new_id]);
    set_tab_ids(new_tab_ids);
    setLastSelectedTabId(selectedTabIdRef.current);
    setSelectedTabId(new_id);
    pushCallback(function () {
      _updateOpenResources(callback);
    });
  }
  function _addPanelPromise(new_id, viewer_kind, res_type, title, new_panel) {
    return new Promise(function (resolve, reject) {
      _addPanel(new_id, viewer_kind, res_type, title, new_panel, resolve);
    });
  }
  function _updatePanel(the_id, new_panel) {
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var new_tab_panel_dict = _objectSpread({}, tab_panel_dict_ref.current);
    for (var k in new_panel) {
      if (k != "panel") {
        new_tab_panel_dict[the_id][k] = new_panel[k];
      }
    }
    if ("panel" in new_panel) {
      if (new_panel.panel == "spinner") {
        new_tab_panel_dict[the_id].panel = "spinner";
      } else if (new_tab_panel_dict[the_id].panel != "spinner") {
        for (var j in new_panel.panel) {
          new_tab_panel_dict[the_id].panel[j] = new_panel.panel[j];
        }
      } else {
        new_tab_panel_dict[the_id].panel = new_panel.panel;
      }
    }
    set_tab_panel_dict(new_tab_panel_dict);
    pushCallback(function () {
      _updateOpenResources(function () {
        return _update_window_dimensions(callback);
      });
    });
  }
  function _updatePanelPromise(the_id, new_panel) {
    return new Promise(function (resolve, reject) {
      _updatePanel(the_id, new_panel, resolve);
    });
  }
  function _changeResourceName(the_id, new_name) {
    var change_title = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var new_tab_panel_dict = _objectSpread({}, tab_panel_dict_ref.current);
    if (change_title) {
      new_tab_panel_dict[the_id].title = new_name;
    }
    new_tab_panel_dict[the_id].panel.resource_name = new_name;
    set_tab_panel_dict(new_tab_panel_dict);
    pushCallback(function () {
      _updateOpenResources(function () {
        return _update_window_dimensions(callback);
      });
    });
  }
  function _getResourceId(res_name, res_type) {
    var _iterator = _createForOfIteratorHelper(tab_ids_ref.current),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var the_id = _step.value;
        var the_panel = tab_panel_dict_ref.current[the_id];
        if (the_panel.panel.resource_name == res_name && the_panel.res_type == res_type) {
          return the_id;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return -1;
  }
  function _showOpenOmnibar() {
    setShowOpenOmnibar(true);
  }
  function _closeOpenOmnibar() {
    setShowOpenOmnibar(false);
  }
  var _handleCreateViewer = (0, _react.useCallback)( /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(data) {
      var callback,
        existing_id,
        new_id,
        drmethod,
        new_panel,
        _args2 = arguments;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            callback = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : null;
            existing_id = _getResourceId(data.resource_name, data.res_type);
            if (!(existing_id != -1)) {
              _context2.next = 6;
              break;
            }
            setSelectedTabId(existing_id);
            pushCallback(callback);
            return _context2.abrupt("return");
          case 6:
            new_id = (0, _utilities_react.guid)();
            drmethod = function drmethod(dmethod) {
              _registerDirtyMethod(new_id, dmethod);
            };
            _context2.next = 10;
            return _addPanelPromise(new_id, data.kind, data.res_type, data.resource_name, "spinner");
          case 10:
            new_panel = propDict[data.kind](data, drmethod, function (new_panel) {
              _updatePanel(new_id, {
                panel: new_panel
              }, callback);
            });
          case 11:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return function (_x4) {
      return _ref2.apply(this, arguments);
    };
  }(), []);
  function _goToNextPane(e) {
    var templist = ["library"];
    if (window.has_pool) templist.push("pool");
    templist = [].concat(_toConsumableArray(templist), _toConsumableArray(tab_ids_ref.current));
    var newId;
    var tabIndex = templist.indexOf(selectedTabIdRef.current) + 1;
    newId = tabIndex === templist.length ? "library" : templist[tabIndex];
    _handleTabSelect(newId, selectedTabIdRef.current);
    if (e) {
      e.preventDefault();
    }
  }
  function _goToPreviousPane(e) {
    var templist = ["library"];
    if (window.has_pool) templist.push("pool");
    templist = [].concat(_toConsumableArray(templist), _toConsumableArray(tab_ids_ref.current));
    var tabIndex = templist.indexOf(selectedTabIdRef.current) - 1;
    var newId = tabIndex == -1 ? templist.at(-1) : templist[tabIndex];
    _handleTabSelect(newId, selectedTabIdRef.current);
    if (e) {
      e.preventDefault();
    }
  }
  function _handleTabSelect(newTabId, prevTabId) {
    var event = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    setSelectedTabId(newTabId);
    setLastSelectedTabId(prevTabId);
    pushCallback(function () {
      _update_window_dimensions(callback);
      setTabSelectCounter(tabSelectCounter + 1);
    });
  }
  function _goToModule(_x5, _x6) {
    return _goToModule2.apply(this, arguments);
  }
  function _goToModule2() {
    _goToModule2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(module_name, line_number) {
      var _loop, tab_id, _ret, the_view, re, data, _new_id, drmethod, new_panel;
      return _regeneratorRuntime().wrap(function _callee6$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
          case 0:
            _loop = /*#__PURE__*/_regeneratorRuntime().mark(function _loop() {
              var pdict;
              return _regeneratorRuntime().wrap(function _loop$(_context6) {
                while (1) switch (_context6.prev = _context6.next) {
                  case 0:
                    pdict = tab_panel_dict_ref.current[tab_id];
                    if (!(pdict.kind == "creator-viewer" && pdict.panel.resource_name == module_name)) {
                      _context6.next = 4;
                      break;
                    }
                    _handleTabSelect(tab_id, selectedTabIdRef.current, null, function () {
                      if ("line_setter" in pdict) {
                        pdict.line_setter(line_number);
                      }
                    });
                    return _context6.abrupt("return", {
                      v: void 0
                    });
                  case 4:
                  case "end":
                    return _context6.stop();
                }
              }, _loop);
            });
            _context7.t0 = _regeneratorRuntime().keys(tab_panel_dict_ref.current);
          case 2:
            if ((_context7.t1 = _context7.t0()).done) {
              _context7.next = 10;
              break;
            }
            tab_id = _context7.t1.value;
            return _context7.delegateYield(_loop(), "t2", 5);
          case 5:
            _ret = _context7.t2;
            if (!(_typeof(_ret) === "object")) {
              _context7.next = 8;
              break;
            }
            return _context7.abrupt("return", _ret.v);
          case 8:
            _context7.next = 2;
            break;
          case 10:
            the_view = (0, _library_pane.view_views)()["tile"];
            re = new RegExp("/$");
            the_view = the_view.replace(re, "_in_context");
            _context7.prev = 13;
            _context7.next = 16;
            return (0, _communication_react.postAjaxPromise)(the_view, {
              context_id: window.context_id,
              resource_name: module_name
            });
          case 16:
            data = _context7.sent;
            _new_id = "".concat(data.kind, ": ").concat(data.resource_name);
            drmethod = function drmethod(dmethod) {
              _registerDirtyMethod(_new_id, dmethod);
            };
            _context7.next = 21;
            return _addPanelPromise(_new_id, data.kind, data.res_type, data.resource_name, "spinner");
          case 21:
            new_panel = propDict[data.kind](data, drmethod, function (new_panel) {
              _updatePanel(_new_id, {
                panel: new_panel
              }, function () {
                var pdict = tab_panel_dict_ref.current[_new_id];
              });
            });
            _context7.next = 27;
            break;
          case 24:
            _context7.prev = 24;
            _context7.t3 = _context7["catch"](13);
            errorDrawerFuncs.addFromError("Error going to module ".concat(module_name), _context7.t3);
          case 27:
            return _context7.abrupt("return");
          case 28:
          case "end":
            return _context7.stop();
        }
      }, _callee6, null, [[13, 24]]);
    }));
    return _goToModule2.apply(this, arguments);
  }
  function _registerLineSetter(tab_id, rfunc) {
    _updatePanel(tab_id, {
      line_setter: rfunc
    });
  }
  function _onDragStart(event, tab_id) {
    set_currently_dragging(tab_id);
    event.stopPropagation();
  }
  function _onDragEnd(event) {
    set_dragging_over(null);
    set_currently_dragging(null);
    event.stopPropagation();
    event.preventDefault();
  }
  function _nextTab(tab_id) {
    var tidx = tab_ids_ref.current.indexOf(tab_id);
    if (tidx == -1) return null;
    if (tidx == tab_ids_ref.current.length - 1) return "dummy";
    return tab_ids_ref.current[tidx + 1];
  }
  function _onDrop(event, target_id) {
    if (currently_dragging == null || currently_dragging == target_id) return;
    var current_index = tab_ids_ref.current.indexOf(currently_dragging);
    var new_tab_ids = _toConsumableArray(tab_ids_ref.current);
    new_tab_ids.splice(current_index, 1);
    if (target_id == "dummy") {
      new_tab_ids.push(currently_dragging);
    } else {
      var target_index = new_tab_ids.indexOf(target_id);
      new_tab_ids.splice(target_index, 0, currently_dragging);
    }
    set_tab_ids(new_tab_ids);
    set_dragging_over(null);
    event.stopPropagation();
  }
  function _onDragOver(event, target_id) {
    event.stopPropagation();
    event.preventDefault();
  }
  function _onDragEnter(event, target_id) {
    if (target_id == currently_dragging || target_id == _nextTab(currently_dragging)) {
      set_dragging_over(null);
    } else {
      set_dragging_over(target_id);
    }
    event.stopPropagation();
    event.preventDefault();
  }
  function _onDragLeave(event, target_id) {
    event.stopPropagation();
    event.preventDefault();
  }
  function _getOpenResources() {
    var open_resources = [];
    for (var the_id in tab_panel_dict_ref.current) {
      var entry = tab_panel_dict_ref.current[the_id];
      if (entry.panel != "spinner") {
        open_resources.push(entry.panel.resource_name);
      }
    }
    return open_resources;
  }
  function _updateOpenResources() {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    set_open_resources(_getOpenResources());
    pushCallback(callback);
  }
  function _addOmniItems(tid, items) {
    if (!(tid in omniItemsRef.current)) {
      omniItemsRef.current[tid] = [];
    }
    omniItemsRef.current[tid] = omniItemsRef.current[tid].concat(items);
  }
  function _addContextOmniItems() {
    var omni_funcs = [["Go To Next Panel", "context", _goToNextPane, "arrow-right"], ["Go To Previous Panel", "context", _goToPreviousPane, "arrow-left"]];
    var omni_items = [];
    for (var _i2 = 0, _omni_funcs = omni_funcs; _i2 < _omni_funcs.length; _i2++) {
      var item = _omni_funcs[_i2];
      omni_items.push({
        category: "Global",
        display_text: item[0],
        search_text: item[0],
        icon_name: item[3],
        the_function: item[2],
        item_type: "command"
      });
    }
    _addOmniItems("global", omni_items);
  }
  var bclass = "context-tab-button-content";
  if (selectedTabIdRef.current == "library") {
    bclass += " selected-tab-button";
  }
  var library_panel = /*#__PURE__*/_react["default"].createElement(_utilities_react.SelectedPaneContext.Provider, {
    value: {
      tab_id: "library",
      selectedTabIdRef: selectedTabIdRef,
      amSelected: amSelected,
      counter: selectedTabIdCounter,
      addOmniItems: function addOmniItems(items) {
        _addOmniItems("library", items);
      }
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    id: "library-home-root"
  }, /*#__PURE__*/_react["default"].createElement(_library_home_react.LibraryHomeApp, {
    tsocket: tsocket,
    library_style: window.library_style,
    controlled: true,
    am_selected: selectedTabIdRef.current == "library",
    open_resources_ref: open_resources_ref,
    handleCreateViewer: _handleCreateViewer,
    usable_width: usable_width,
    usable_height: usable_height
  })));
  var ltab = /*#__PURE__*/_react["default"].createElement(_core.Tab, {
    id: "library",
    tabIndex: -1,
    key: "library",
    style: {
      paddingLeft: 10,
      marginBottom: 0
    },
    panelClassName: "context-tab",
    title: "",
    panel: library_panel
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: bclass + " open-resource-tab",
    style: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      display: "table-cell",
      flexDirection: "row",
      justifyContent: "flex-start",
      textOverflow: "ellipsis",
      overflow: "hidden"
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
    icon: libIconDict["all"],
    style: {
      verticalAlign: "middle",
      marginRight: 5
    },
    size: 16,
    tabIndex: -1
  }), /*#__PURE__*/_react["default"].createElement("span", null, "Library"))));
  var all_tabs = [ltab];
  if (window.has_pool) {
    var pclass = "context-tab-button-content";
    if (selectedTabIdRef.current == "pool") {
      pclass += " selected-tab-button";
    }
    var pool_panel = /*#__PURE__*/_react["default"].createElement(_utilities_react.SelectedPaneContext.Provider, {
      value: {
        tab_id: "pool",
        selectedTabIdRef: selectedTabIdRef,
        amSelected: amSelected,
        counter: selectedTabIdCounter,
        addOmniItems: function addOmniItems(items) {
          _addOmniItems("pool", items);
        }
      }
    }, /*#__PURE__*/_react["default"].createElement("div", {
      id: "pool-browser-root"
    }, /*#__PURE__*/_react["default"].createElement(_pool_browser.PoolBrowser, {
      tsocket: tsocket,
      am_selected: selectedTabIdRef.current == "pool",
      usable_width: usable_width,
      usable_height: usable_height
    })));
    var ptab = /*#__PURE__*/_react["default"].createElement(_core.Tab, {
      id: "pool",
      tabIndex: -1,
      key: "pool",
      style: {
        paddingLeft: 10,
        marginBottom: 0
      },
      panelClassName: "context-tab",
      title: "",
      panel: pool_panel
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: pclass + " open-resource-tab",
      style: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between"
      }
    }, /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        display: "table-cell",
        flexDirection: "row",
        justifyContent: "flex-start",
        textOverflow: "ellipsis",
        overflow: "hidden"
      }
    }, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
      icon: libIconDict["pool"],
      style: {
        verticalAlign: "middle",
        marginRight: 5
      },
      size: 16,
      tabIndex: -1
    }), /*#__PURE__*/_react["default"].createElement("span", null, "Pool"))));
    all_tabs.push(ptab);
  }
  function amSelected(ltab_id, lselectedTabIdRef) {
    return !window.in_context || ltab_id == lselectedTabIdRef.current;
  }
  var _omni_view_func = (0, _react.useCallback)( /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(item) {
      var the_view, re, data;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            the_view = (0, _library_pane.view_views)(false)[item.res_type];
            statusFuncs.setStatus({
              show_spinner: true,
              status_message: "Opening ..."
            });
            if (!window.in_context) {
              _context3.next = 19;
              break;
            }
            re = new RegExp("/$");
            the_view = the_view.replace(re, "_in_context");
            _context3.prev = 5;
            _context3.next = 8;
            return (0, _communication_react.postAjaxPromise)(the_view, {
              context_id: context_id,
              resource_name: item.name
            });
          case 8:
            data = _context3.sent;
            _context3.next = 11;
            return _handleCreateViewer(data, statusFuncs.clearStatus);
          case 11:
            _context3.next = 17;
            break;
          case 13:
            _context3.prev = 13;
            _context3.t0 = _context3["catch"](5);
            statusFuncs.clearstatus();
            errorDrawerFuncs.addFromError("Error following ".concat(the_view), _context3.t0);
          case 17:
            _context3.next = 21;
            break;
          case 19:
            statusFuncs.clearStatus();
            window.open($SCRIPT_ROOT + the_view + item.name);
          case 21:
          case "end":
            return _context3.stop();
        }
      }, _callee3, null, [[5, 13]]);
    }));
    return function (_x7) {
      return _ref3.apply(this, arguments);
    };
  }());
  var _iterator2 = _createForOfIteratorHelper(tab_ids_ref.current),
    _step2;
  try {
    var _loop2 = function _loop2() {
      var tab_id = _step2.value;
      var tab_entry = tab_panel_dict_ref.current[tab_id];
      var bclass = "context-tab-button-content";
      if (selectedTabIdRef.current == tab_id) {
        bclass += " selected-tab-button";
      }
      var visible_title = tab_entry.title;
      var wrapped_panel;
      if (tab_entry.panel == "spinner") {
        wrapped_panel = spinner_panel;
      } else {
        var TheClass = classDict[tab_entry.kind];
        var the_panel = /*#__PURE__*/_react["default"].createElement(_utilities_react.SelectedPaneContext.Provider, {
          value: {
            tab_id: tab_id,
            selectedTabIdRef: selectedTabIdRef,
            amSelected: amSelected,
            counter: selectedTabIdCounter,
            addOmniItems: function addOmniItems(items) {
              _addOmniItems(tab_id, items);
            }
          }
        }, /*#__PURE__*/_react["default"].createElement(TheClass, _extends({}, tab_entry.panel, {
          controlled: true,
          handleCreateViewer: _handleCreateViewer,
          tab_id: tab_id,
          selectedTabIdRef: selectedTabIdRef,
          changeResourceName: function changeResourceName(new_name) {
            var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            var change_title = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
            _changeResourceName(tab_id, new_name, change_title, callback);
          },
          updatePanel: function updatePanel(new_panel) {
            var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            _updatePanel(tab_id, new_panel, callback);
          },
          goToModule: _goToModule,
          registerLineSetter: function registerLineSetter(rfunc) {
            return _registerLineSetter(tab_id, rfunc);
          },
          refreshTab: /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7() {
            return _regeneratorRuntime().wrap(function _callee7$(_context8) {
              while (1) switch (_context8.prev = _context8.next) {
                case 0:
                  _context8.next = 2;
                  return _refreshTab(tab_id);
                case 2:
                case "end":
                  return _context8.stop();
              }
            }, _callee7);
          })),
          closeTab: /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8() {
            return _regeneratorRuntime().wrap(function _callee8$(_context9) {
              while (1) switch (_context9.prev = _context9.next) {
                case 0:
                  _context9.next = 2;
                  return _closeTab(tab_id);
                case 2:
                case "end":
                  return _context9.stop();
              }
            }, _callee8);
          })),
          tsocket: tab_entry.panel.tsocket,
          usable_width: usable_width,
          usable_height: usable_height
        })));
        wrapped_panel = /*#__PURE__*/_react["default"].createElement(_error_boundary.ErrorBoundary, null, /*#__PURE__*/_react["default"].createElement("div", {
          id: tab_id + "-holder",
          className: panelRootDict[tab_panel_dict_ref.current[tab_id].kind]
        }, the_panel));
      }
      var icon_style = {
        verticalAlign: "middle",
        paddingLeft: 4
      };
      if (tab_id == dragging_over) {
        bclass += " hovering";
      }
      if (tab_id == currently_dragging) {
        bclass += " currently-dragging";
      }
      var new_tab = /*#__PURE__*/_react["default"].createElement(_core.Tab, {
        id: tab_id,
        draggable: "true",
        onDragStart: function onDragStart(e) {
          _onDragStart(e, tab_id);
        },
        onDrop: function onDrop(e) {
          _onDrop(e, tab_id);
        },
        onDragEnter: function onDragEnter(e) {
          _onDragEnter(e, tab_id);
        },
        onDragOver: function onDragOver(e) {
          _onDragOver(e, tab_id);
        },
        onDragLeave: function onDragLeave(e) {
          _onDragLeave(e, tab_id);
        },
        onDragEnd: function onDragEnd(e) {
          _onDragEnd(e);
        },
        tabIndex: -1,
        key: tab_id,
        panelClassName: "context-tab",
        title: "",
        panel: wrapped_panel
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: bclass + " open-resource-tab",
        style: {
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between"
        }
      }, /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          display: "table-cell",
          flexDirection: "row",
          justifyContent: "flex-start",
          textOverflow: "ellipsis",
          overflow: "hidden"
        }
      }, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
        icon: iconDict[tab_entry.kind],
        style: {
          verticalAlign: "middle",
          marginRight: 5
        },
        size: 16,
        tabIndex: -1
      }), /*#__PURE__*/_react["default"].createElement("span", null, visible_title)), /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
        icon: "reset",
        style: icon_style,
        size: 13,
        className: "context-close-button",
        tabIndex: -1,
        onClick: /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9() {
          return _regeneratorRuntime().wrap(function _callee9$(_context10) {
            while (1) switch (_context10.prev = _context10.next) {
              case 0:
                _context10.next = 2;
                return _refreshTab(tab_id);
              case 2:
              case "end":
                return _context10.stop();
            }
          }, _callee9);
        }))
      }), /*#__PURE__*/_react["default"].createElement(_core.Icon, {
        icon: "delete",
        style: icon_style,
        size: 13,
        className: "context-close-button",
        tabIndex: -1,
        onClick: /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10() {
          return _regeneratorRuntime().wrap(function _callee10$(_context11) {
            while (1) switch (_context11.prev = _context11.next) {
              case 0:
                _context11.next = 2;
                return _closeTab(tab_id);
              case 2:
              case "end":
                return _context11.stop();
            }
          }, _callee10);
        }))
      }))));
      all_tabs.push(new_tab);
    };
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      _loop2();
    }

    // The purpose of the dummy tab is to make it possible to drag a tab to the bottom of the list
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  bclass = "context-tab-button-content";
  if (dragging_over == "dummy") {
    bclass += " hovering";
  }
  var dummy_tab = /*#__PURE__*/_react["default"].createElement(_core.Tab, {
    id: "dummy",
    draggable: "false",
    disabled: true,
    onDrop: function onDrop(e) {
      _onDrop(e, "dummy");
    },
    onDragEnter: function onDragEnter(e) {
      _onDragEnter(e, "dummy");
    },
    onDragOver: function onDragOver(e) {
      _onDragOver(e, "dummy");
    },
    onDragLeave: function onDragLeave(e) {
      _onDragLeave(e, "dummy");
    },
    tabIndex: -1,
    key: "dummy",
    panelClassName: "context-tab",
    title: "",
    panel: null
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: bclass,
    style: {
      height: 30,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between"
    }
  }));
  all_tabs.push(dummy_tab);
  var outer_class = "pane-holder ";
  if (theme.dark_theme) {
    outer_class = "".concat(outer_class, " bp5-dark");
  } else {
    outer_class = "".concat(outer_class, " light-theme");
  }
  var outer_style = {
    width: "100%",
    height: usable_height,
    paddingLeft: 0
  };
  var tlclass = "context-tab-list";
  var pane_closed = tabWidth <= MIN_CONTEXT_WIDTH;
  if (pane_closed) {
    tlclass += " context-pane-closed";
  }
  var sid = selectedTabIdRef.current;
  var commandItems = omniItemsRef.current["global"];
  if (sid in omniItemsRef.current) {
    commandItems = commandItems.concat(omniItemsRef.current[sid]);
  }
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    selected: null,
    show_api_links: false,
    extra_text: window.database_type == "Local" ? "" : window.database_type,
    page_id: window.context_id,
    user_name: window.username
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: outer_class,
    style: outer_style,
    ref: top_ref
  }, /*#__PURE__*/_react["default"].createElement("div", {
    id: "context-container",
    style: outer_style
  }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
    icon: /*#__PURE__*/_react["default"].createElement(_core.Icon, {
      icon: pane_closed ? "drawer-left-filled" : "drawer-right-filled",
      size: 18
    }),
    style: {
      paddingLeft: 4,
      paddingRight: 0,
      position: "fixed",
      left: tabWidth - 30,
      bottom: 10,
      zIndex: 100
    },
    minimal: true,
    className: "context-close-button",
    small: true,
    tabIndex: -1,
    onClick: function onClick() {
      _togglePane(pane_closed);
    }
  }), /*#__PURE__*/_react["default"].createElement(_resizing_layouts.DragHandle, {
    position_dict: {
      position: "fixed",
      left: tabWidth - 5
    },
    onDrag: _handleTabResize,
    dragStart: _handleTabResizeStart,
    dragEnd: _handleTabResizeEnd,
    direction: "x",
    barHeight: "100%",
    useThinBar: true
  }), /*#__PURE__*/_react["default"].createElement(_sizing_tools.SizeContext.Provider, {
    value: {
      availableWidth: usable_width,
      availableHeight: usable_height,
      topX: paneX,
      topY: paneY
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.Tabs, {
    id: "context-tabs",
    selectedTabId: selectedTabIdRef.current,
    className: tlclass,
    vertical: true,
    onChange: _handleTabSelect
  }, all_tabs))), /*#__PURE__*/_react["default"].createElement(_utilities_react.SelectedPaneContext.Provider, {
    value: {
      tab_id: sid,
      selectedTabIdRef: selectedTabIdRef,
      amSelected: amSelected,
      addOmniItems: function addOmniItems(items) {
        _addOmniItems(sid, items);
      }
    }
  }, /*#__PURE__*/_react["default"].createElement(_TacticOmnibar.OpenOmnibar, {
    commandItems: commandItems,
    page_id: window.context_id,
    showOmnibar: showOpenOmnibar,
    openFunc: _omni_view_func,
    is_authenticated: window.is_authenticated,
    closeOmnibar: _closeOpenOmnibar
  }))), /*#__PURE__*/_react["default"].createElement(_key_trap.KeyTrap, {
    global: true,
    bindings: key_bindings
  }));
}
_context_main();
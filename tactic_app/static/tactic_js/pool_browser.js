"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
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
var _theme = require("./theme");
var _modal_react = require("./modal_react");
var _library_home_react = require("./library_home_react");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
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
      size: ""
    }),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    selected_resource = _useStateAndRef2[0],
    set_selected_resource = _useStateAndRef2[1],
    selected_resource_ref = _useStateAndRef2[2];
  var _useStateAndRef3 = (0, _utilities_react.useStateAndRef)(null),
    _useStateAndRef4 = _slicedToArray(_useStateAndRef3, 3),
    value = _useStateAndRef4[0],
    setValue = _useStateAndRef4[1],
    valueRef = _useStateAndRef4[2];
  var _useStateAndRef5 = (0, _utilities_react.useStateAndRef)(null),
    _useStateAndRef6 = _slicedToArray(_useStateAndRef5, 3),
    selectedNode = _useStateAndRef6[0],
    setSelectedNode = _useStateAndRef6[1],
    selectedNodeRef = _useStateAndRef6[2];
  var _useStateAndRef7 = (0, _utilities_react.useStateAndRef)(false),
    _useStateAndRef8 = _slicedToArray(_useStateAndRef7, 3),
    multi_select = _useStateAndRef8[0],
    set_multi_select = _useStateAndRef8[1],
    multi_select_ref = _useStateAndRef8[2];
  var _useStateAndRef9 = (0, _utilities_react.useStateAndRef)([]),
    _useStateAndRef10 = _slicedToArray(_useStateAndRef9, 3),
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
  var theme = (0, _react.useContext)(_theme.ThemeContext);
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  var statudFuncs = (0, _react.useContext)(_toaster.StatusContext);
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
        size: String(selectedNodeRef.current.size)
      });
    } else {
      set_selected_resource({
        name: "",
        tags: "",
        notes: "",
        updated: "",
        created: ""
      });
    }
  }, [value]);
  function handlePoolEvent() {}
  function _rename_func() {
    return _rename_func2.apply(this, arguments);
  }
  function _rename_func2() {
    _rename_func2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8() {
      var node,
        path,
        new_name,
        the_data,
        _args8 = arguments;
      return _regeneratorRuntime().wrap(function _callee8$(_context8) {
        while (1) switch (_context8.prev = _context8.next) {
          case 0:
            node = _args8.length > 0 && _args8[0] !== undefined ? _args8[0] : null;
            if (!(!valueRef.current && !node)) {
              _context8.next = 3;
              break;
            }
            return _context8.abrupt("return");
          case 3:
            _context8.prev = 3;
            path = node && "isDirectory" in node ? node.fullpath : valueRef.current;
            _context8.next = 7;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Rename Pool Resource",
              field_title: "New Name",
              default_value: (0, _pool_tree.getBasename)(path),
              existing_names: [],
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 7:
            new_name = _context8.sent;
            the_data = {
              new_name: new_name,
              old_path: path
            };
            _context8.next = 11;
            return (0, _communication_react.postAjaxPromise)("rename_pool_resource", the_data);
          case 11:
            _context8.next = 17;
            break;
          case 13:
            _context8.prev = 13;
            _context8.t0 = _context8["catch"](3);
            if (_context8.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error renaming", _context8.t0);
            }
            return _context8.abrupt("return");
          case 17:
          case "end":
            return _context8.stop();
        }
      }, _callee8, null, [[3, 13]]);
    }));
    return _rename_func2.apply(this, arguments);
  }
  function _add_directory() {
    return _add_directory2.apply(this, arguments);
  }
  function _add_directory2() {
    _add_directory2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9() {
      var node,
        sNode,
        initial_address,
        full_path,
        the_data,
        _args9 = arguments;
      return _regeneratorRuntime().wrap(function _callee9$(_context9) {
        while (1) switch (_context9.prev = _context9.next) {
          case 0:
            node = _args9.length > 0 && _args9[0] !== undefined ? _args9[0] : null;
            if (!(!valueRef.current && !node)) {
              _context9.next = 3;
              break;
            }
            return _context9.abrupt("return");
          case 3:
            _context9.prev = 3;
            sNode = node && "isDirectory" in node ? node : selectedNodeRef.current;
            if (sNode.isDirectory) {
              initial_address = sNode.fullpath;
            } else {
              initial_address = (0, _pool_tree.getFileParentPath)(sNode.fullpath);
            }
            _context9.next = 8;
            return dialogFuncs.showModalPromise("SelectAddressDialog", {
              title: "Add a Pool Directory",
              selectType: "folder",
              initial_address: initial_address,
              initial_name: "New Directory",
              showName: true,
              handleClose: dialogFuncs.hideModal
            });
          case 8:
            full_path = _context9.sent;
            the_data = {
              full_path: full_path
            };
            _context9.next = 12;
            return (0, _communication_react.postAjaxPromise)("create_pool_directory", the_data);
          case 12:
            _context9.next = 18;
            break;
          case 14:
            _context9.prev = 14;
            _context9.t0 = _context9["catch"](3);
            if (_context9.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error adding directory", _context9.t0);
            }
            return _context9.abrupt("return");
          case 18:
          case "end":
            return _context9.stop();
        }
      }, _callee9, null, [[3, 14]]);
    }));
    return _add_directory2.apply(this, arguments);
  }
  function _duplicate_file() {
    return _duplicate_file2.apply(this, arguments);
  }
  function _duplicate_file2() {
    _duplicate_file2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10() {
      var node,
        sNode,
        src,
        _splitFilePath,
        _splitFilePath2,
        initial_address,
        initial_name,
        dst,
        the_data,
        _args10 = arguments;
      return _regeneratorRuntime().wrap(function _callee10$(_context10) {
        while (1) switch (_context10.prev = _context10.next) {
          case 0:
            node = _args10.length > 0 && _args10[0] !== undefined ? _args10[0] : null;
            if (!(!valueRef.current && !node)) {
              _context10.next = 3;
              break;
            }
            return _context10.abrupt("return");
          case 3:
            _context10.prev = 3;
            sNode = node && "isDirectory" in node ? node : selectedNodeRef.current;
            if (!sNode.isDirectory) {
              _context10.next = 8;
              break;
            }
            (0, _toaster.doFlash)("You can't duplicate a directory");
            return _context10.abrupt("return");
          case 8:
            src = sNode.fullpath;
            _splitFilePath = (0, _pool_tree.splitFilePath)(sNode.fullpath), _splitFilePath2 = _slicedToArray(_splitFilePath, 2), initial_address = _splitFilePath2[0], initial_name = _splitFilePath2[1];
            _context10.next = 12;
            return dialogFuncs.showModalPromise("SelectAddressDialog", {
              title: "Duplicate a file",
              selectType: "folder",
              initial_address: initial_address,
              initial_name: initial_name,
              showName: true,
              handleClose: dialogFuncs.hideModal
            });
          case 12:
            dst = _context10.sent;
            the_data = {
              dst: dst,
              src: src
            };
            _context10.next = 16;
            return (0, _communication_react.postAjaxPromise)("duplicate_pool_file", the_data);
          case 16:
            _context10.next = 22;
            break;
          case 18:
            _context10.prev = 18;
            _context10.t0 = _context10["catch"](3);
            if (_context10.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error duplicating file", _context10.t0);
            }
            return _context10.abrupt("return");
          case 22:
          case "end":
            return _context10.stop();
        }
      }, _callee10, null, [[3, 18]]);
    }));
    return _duplicate_file2.apply(this, arguments);
  }
  function _downloadFile() {
    return _downloadFile2.apply(this, arguments);
  }
  function _downloadFile2() {
    _downloadFile2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11() {
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
        _args11 = arguments;
      return _regeneratorRuntime().wrap(function _callee11$(_context11) {
        while (1) switch (_context11.prev = _context11.next) {
          case 0:
            node = _args11.length > 0 && _args11[0] !== undefined ? _args11[0] : null;
            if (!(!valueRef.current && !node)) {
              _context11.next = 3;
              break;
            }
            return _context11.abrupt("return");
          case 3:
            _context11.prev = 3;
            sNode = node && "isDirectory" in node ? node : selectedNodeRef.current;
            if (!sNode.isDirectory) {
              _context11.next = 8;
              break;
            }
            (0, _toaster.doFlash)("You can't download a directory");
            return _context11.abrupt("return");
          case 8:
            src = sNode.fullpath;
            console.log("Got source " + String(src));
            _context11.next = 12;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Download File",
              field_title: "New File Name",
              default_value: (0, _pool_tree.getBasename)(src),
              existing_names: [],
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 12:
            new_name = _context11.sent;
            the_data = {
              src: src
            };
            _context11.next = 16;
            return (0, _communication_react.getBlobPromise)("download_pool_file", the_data);
          case 16:
            _yield$getBlobPromise = _context11.sent;
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
            _context11.next = 27;
            break;
          case 24:
            _context11.prev = 24;
            _context11.t0 = _context11["catch"](3);
            if (_context11.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error downloading from pool", _context11.t0);
            }
          case 27:
          case "end":
            return _context11.stop();
        }
      }, _callee11, null, [[3, 24]]);
    }));
    return _downloadFile2.apply(this, arguments);
  }
  function MoveResource(_x2, _x3) {
    return _MoveResource.apply(this, arguments);
  }
  function _MoveResource() {
    _MoveResource = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee12(src, dst) {
      var the_data;
      return _regeneratorRuntime().wrap(function _callee12$(_context12) {
        while (1) switch (_context12.prev = _context12.next) {
          case 0:
            if (!(src == dst)) {
              _context12.next = 2;
              break;
            }
            return _context12.abrupt("return");
          case 2:
            _context12.prev = 2;
            the_data = {
              dst: dst,
              src: src
            };
            _context12.next = 6;
            return (0, _communication_react.postAjaxPromise)("move_pool_resource", the_data);
          case 6:
            _context12.next = 11;
            break;
          case 8:
            _context12.prev = 8;
            _context12.t0 = _context12["catch"](2);
            errorDrawerFuncs.addFromError("Error moving resource", _context12.t0);
          case 11:
          case "end":
            return _context12.stop();
        }
      }, _callee12, null, [[2, 8]]);
    }));
    return _MoveResource.apply(this, arguments);
  }
  function _move_resource() {
    return _move_resource2.apply(this, arguments);
  }
  function _move_resource2() {
    _move_resource2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee13() {
      var node,
        sNode,
        src,
        initial_address,
        dst,
        _args13 = arguments;
      return _regeneratorRuntime().wrap(function _callee13$(_context13) {
        while (1) switch (_context13.prev = _context13.next) {
          case 0:
            node = _args13.length > 0 && _args13[0] !== undefined ? _args13[0] : null;
            if (!(!valueRef.current && !node)) {
              _context13.next = 3;
              break;
            }
            return _context13.abrupt("return");
          case 3:
            _context13.prev = 3;
            sNode = node && "isDirectory" in node ? node : selectedNodeRef.current;
            src = sNode.fullpath;
            if (sNode.isDirectory) {
              initial_address = sNode.fullpath;
            } else {
              initial_address = (0, _pool_tree.getFileParentPath)(sNode.fullpath);
            }
            _context13.next = 9;
            return dialogFuncs.showModalPromise("SelectAddressDialog", {
              title: "Select a destination for ".concat((0, _pool_tree.getBasename)(src)),
              selectType: "folder",
              initial_address: initial_address,
              initial_name: "",
              showName: false,
              handleClose: dialogFuncs.hideModal
            });
          case 9:
            dst = _context13.sent;
            _context13.next = 12;
            return MoveResource(src, dst);
          case 12:
            _context13.next = 17;
            break;
          case 14:
            _context13.prev = 14;
            _context13.t0 = _context13["catch"](3);
            if (_context13.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error moving resource", _context13.t0);
            }
          case 17:
          case "end":
            return _context13.stop();
        }
      }, _callee13, null, [[3, 14]]);
    }));
    return _move_resource2.apply(this, arguments);
  }
  function _delete_func() {
    return _delete_func2.apply(this, arguments);
  }
  function _delete_func2() {
    _delete_func2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee14() {
      var node,
        path,
        sNode,
        basename,
        confirm_text,
        _args14 = arguments;
      return _regeneratorRuntime().wrap(function _callee14$(_context14) {
        while (1) switch (_context14.prev = _context14.next) {
          case 0:
            node = _args14.length > 0 && _args14[0] !== undefined ? _args14[0] : null;
            if (!(!valueRef.current && !node)) {
              _context14.next = 3;
              break;
            }
            return _context14.abrupt("return");
          case 3:
            _context14.prev = 3;
            path = node && "isDirectory" in node ? node.fullpath : valueRef.current;
            sNode = node && "isDirectory" in node ? node : selectedNodeRef.current;
            if (!(sNode.isDirectory && sNode.childNodes.length > 0)) {
              _context14.next = 9;
              break;
            }
            (0, _toaster.doFlash)("You can't delete a non-empty directory");
            return _context14.abrupt("return");
          case 9:
            basename = (0, _pool_tree.getBasename)(path);
            confirm_text = "Are you sure that you want to delete ".concat(basename, "?");
            _context14.next = 13;
            return dialogFuncs.showModalPromise("ConfirmDialog", {
              title: "Delete resource",
              text_body: confirm_text,
              cancel_text: "do nothing",
              submit_text: "delete",
              handleClose: dialogFuncs.hideModal
            });
          case 13:
            _context14.next = 15;
            return (0, _communication_react.postAjaxPromise)("delete_pool_resource", {
              full_path: path,
              is_directory: sNode.isDirectory
            });
          case 15:
            _context14.next = 20;
            break;
          case 17:
            _context14.prev = 17;
            _context14.t0 = _context14["catch"](3);
            if (_context14.t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error deleting", _context14.t0);
            }
          case 20:
          case "end":
            return _context14.stop();
        }
      }, _callee14, null, [[3, 17]]);
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
  function handleDrop(_x4, _x5) {
    return _handleDrop.apply(this, arguments);
  }
  function _handleDrop() {
    _handleDrop = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee15(e, dst) {
      var files, src;
      return _regeneratorRuntime().wrap(function _callee15$(_context15) {
        while (1) switch (_context15.prev = _context15.next) {
          case 0:
            files = e.dataTransfer.files;
            if (!(files.length != 0)) {
              _context15.next = 5;
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
            _context15.next = 9;
            break;
          case 5:
            src = e.dataTransfer.getData("fullpath");
            if (!src) {
              _context15.next = 9;
              break;
            }
            _context15.next = 9;
            return MoveResource(src, dst);
          case 9:
          case "end":
            return _context15.stop();
        }
      }, _callee15);
    }));
    return _handleDrop.apply(this, arguments);
  }
  function handleNodeClick(node, nodes) {
    setValue(node.fullpath);
    setSelectedNode(node);
    return true;
  }
  function renderContextMenu(props) {
    return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "edit",
      onClick: /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _rename_func(props.node);
            case 2:
            case "end":
              return _context.stop();
          }
        }, _callee);
      })),
      text: "Rename Resource"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "inheritance",
      onClick: /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _move_resource(props.node);
            case 2:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      })),
      text: "Move Resource"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "duplicate",
      onClick: /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return _duplicate_file(props.node);
            case 2:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      })),
      text: "Duplicate File"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "folder-close",
      onClick: /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return _add_directory(props.node);
            case 2:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      })),
      text: "Create Directory"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "trash",
      onClick: /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return _delete_func(props.node);
            case 2:
            case "end":
              return _context5.stop();
          }
        }, _callee5);
      })),
      intent: "danger",
      text: "Delete Resource"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "cloud-upload",
      onClick: /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return _showPoolImport(props.node);
            case 2:
            case "end":
              return _context6.stop();
          }
        }, _callee6);
      })),
      text: "Import To Pool"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "download",
      onClick: /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7() {
        return _regeneratorRuntime().wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return _downloadFile(props.node);
            case 2:
            case "end":
              return _context7.stop();
          }
        }, _callee7);
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
  if (selectedNodeRef.current) {
    res_type = selectedNodeRef.current.isDirectory ? "poolDir" : "poolFile";
  }
  var right_pane = /*#__PURE__*/_react["default"].createElement(_blueprint_mdata_fields.CombinedMetadata, {
    useTags: false,
    all_tags: [],
    useNotes: false,
    elevation: 2,
    name: selected_resource_ref.current.name,
    created: selected_resource_ref.current.created,
    updated: selected_resource_ref.current.updated,
    size: selected_resource_ref.current.size,
    icon: null,
    handleChange: null,
    res_type: res_type,
    pane_type: "pool",
    outer_style: outer_style,
    handleNotesBlur: null,
    additional_metadata: {
      size: selected_resource_ref.current.size,
      path: valueRef.current
    },
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
  }, (props.am_selected || have_activated) && /*#__PURE__*/_react["default"].createElement(_pool_tree.PoolTree, {
    value: valueRef.current,
    renderContextMenu: renderContextMenu,
    select_type: "both",
    registerTreeRefreshFunc: registerTreeRefreshFunc,
    user_id: window.user_id,
    tsocket: props.tsocket,
    handleDrop: handleDrop,
    showSecondaryLabel: true,
    handleNodeClick: handleNodeClick
  })));
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(PoolMenubar, _extends({
    selected_resource: selected_resource_ref.current,
    connection_status: null,
    rename_func: _rename_func,
    delete_func: _delete_func,
    add_directory: _add_directory,
    duplicate_file: _duplicate_file,
    move_resource: _move_resource,
    download_file: _downloadFile,
    refreshFunc: treeRefreshFunc.current,
    showPoolImport: _showPoolImport,
    multi_select: multi_select_ref.current,
    list_of_selected: list_of_selected_ref.current,
    sendContextMenuItems: setContextMenuItems
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
function PoolMenubar(props) {
  function context_menu_items() {
    return [];
  }
  function menu_specs() {
    return {
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
    selected_type: props.selected_type,
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
    resource_name: "",
    showErrorDrawerButton: true
  });
}
PoolMenubar = /*#__PURE__*/(0, _react.memo)(PoolMenubar);
function FileDropWrapper(props) {
  var _useState5 = (0, _react.useState)(false),
    _useState6 = _slicedToArray(_useState5, 2),
    isDragging = _useState6[0],
    setIsDragging = _useState6[1];
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
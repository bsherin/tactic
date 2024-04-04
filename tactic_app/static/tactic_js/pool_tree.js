"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PoolAddressSelector = PoolAddressSelector;
exports.PoolTree = PoolTree;
exports.getBasename = getBasename;
exports.getFileParentPath = getFileParentPath;
exports.splitFilePath = splitFilePath;
var _react = _interopRequireWildcard(require("react"));
var _core = require("@blueprintjs/core");
var _lodash = _interopRequireDefault(require("lodash"));
var _toaster = require("./toaster");
var _utilities_react = require("./utilities_react");
var _communication_react = require("./communication_react");
var _theme = require("./theme");
var _library_widgets = require("./library_widgets");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function treeNodesReducer(nodes, action) {
  switch (action.type) {
    case "REPLACE_ALL":
      return _lodash["default"].cloneDeep(action.new_nodes);
    case "DESELECT_ALL":
      var newState1 = _lodash["default"].cloneDeep(nodes);
      forEachNode(newState1, function (node) {
        return node.isSelected = false;
      });
      return newState1;
    case "DISABLE_FOLDERS":
      var newState6 = _lodash["default"].cloneDeep(nodes);
      forEachNode(newState6, function (node) {
        node.disabled = node.isDirectory;
      });
      return newState6;
    case "DISABLE_FILES":
      var newState7 = _lodash["default"].cloneDeep(nodes);
      forEachNode(newState7, function (node) {
        node.disabled = !node.isDirectory;
      });
      return newState7;
    case "SET_IS_EXPANDED":
      var newState2 = _lodash["default"].cloneDeep(nodes);
      forEachNode(newState2, function (node) {
        if (node.id == action.node_id) {
          node.isExpanded = action.isExpanded;
        }
      });
      return newState2;
    case "MULTI_SET_IS_EXPANDED":
      var newState3 = _lodash["default"].cloneDeep(nodes);
      forEachNode(newState3, function (node) {
        if (action.node_list.includes(node.id)) {
          node.isExpanded = action.isExpanded;
        }
      });
      return newState3;
    case "SET_IS_SELECTED":
      var newState4 = _lodash["default"].cloneDeep(nodes);
      forEachNode(newState4, function (node) {
        node.isSelected = node.id == action.id;
      });
      return newState4;
    case "SET_IS_SELECTED_FROM_FULLPATH":
      var newState5 = _lodash["default"].cloneDeep(nodes);
      forEachNode(newState5, function (node) {
        node.isSelected = node.fullpath == action.fullpath;
      });
      return newState5;
    case "CHANGE_NODE_NAME":
      var newState8 = _lodash["default"].cloneDeep(nodes);
      forEachNode(newState8, function (node) {
        if (node.fullpath == action.old_path) {
          updateNode(node, action.new_path);
        }
      });
      var pNode = nodeFromPath(getFileParentPath(action.new_path), newState8[0]);
      return newState8;
    case "MODIFY_FILE":
      var newStateMF = _lodash["default"].cloneDeep(nodes);
      forEachNode(newStateMF, function (node) {
        if (node.fullpath == action.fileDict.fullpath) {
          action.fileDict.isSelected = node.isSelected;
          updateNode(node, action.fileDict);
        }
      });
      return newStateMF;
    case "MODIFY_DIRECTORY":
      var newStateMD = _lodash["default"].cloneDeep(nodes);
      forEachNode(newStateMD, function (node) {
        if (node.fullpath == action.folderDict.fullpath) {
          action.folderDict.isSelected = node.isSelected;
          action.folderDict.isExpanded = node.isExpanded;
          action.folderDict.childNodes = node.childNodes;
          updateNode(node, action.folderDict);
        }
      });
      return newStateMD;
    case "REMOVE_NODE":
      var newState9 = _lodash["default"].cloneDeep(nodes);
      forEachNode(newState9, function (node) {
        if (node.isDirectory) {
          var new_children = [];
          var _iterator = _createForOfIteratorHelper(node.childNodes),
            _step;
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var cnode = _step.value;
              if (cnode.fullpath != action.fullpath) {
                new_children.push(cnode);
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
          node.childNodes = new_children;
        }
      });
      return newState9;
    case "ADD_FILE":
      var newState10 = _lodash["default"].cloneDeep(nodes);
      var _splitFilePath = splitFilePath(action.fileDict.fullpath),
        _splitFilePath2 = _slicedToArray(_splitFilePath, 2),
        path = _splitFilePath2[0],
        fname = _splitFilePath2[1];
      forEachNode(newState10, function (node) {
        if (node.isDirectory) {
          if (node.fullpath == path) {
            node.childNodes.push(action.fileDict);
          }
        }
      });
      return newState10;
    case "ADD_DIRECTORY":
      var newState11 = _lodash["default"].cloneDeep(nodes);
      var _splitFilePath3 = splitFilePath(action.folderDict.fullpath),
        _splitFilePath4 = _slicedToArray(_splitFilePath3, 2),
        dpath = _splitFilePath4[0],
        dfname = _splitFilePath4[1];
      forEachNode(newState11, function (node) {
        if (node.isDirectory) {
          if (node.fullpath == dpath) {
            node.childNodes.push(action.folderDict);
          }
        }
      });
      return newState11;
    case "MOVE_FILE":
      var newState12 = _lodash["default"].cloneDeep(nodes);
      var src_node;
      var found_file = false;
      forEachNode(newState12, function (node) {
        if (node.isDirectory) {
          var new_children = [];
          var _iterator2 = _createForOfIteratorHelper(node.childNodes),
            _step2;
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var cnode = _step2.value;
              if (cnode.fullpath != action.src) {
                new_children.push(cnode);
              } else {
                found_file = true;
                action.fileDict.isSelected = cnode.isSelected;
              }
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
          node.childNodes = new_children;
        }
      });
      if (found_file) {
        forEachNode(newState12, function (node) {
          if (node.isDirectory && node.fullpath == action.dst) {
            node.childNodes.push(action.fileDict);
          }
        });
      }
      return newState12;
    case "MOVE_DIRECTORY":
      var newStateMDir = _lodash["default"].cloneDeep(nodes);
      var src_dir;
      var found_dir = false;
      forEachNode(newStateMDir, function (node) {
        if (node.isDirectory && node.fullpath != action.src) {
          var new_children = [];
          var _iterator3 = _createForOfIteratorHelper(node.childNodes),
            _step3;
          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              var cnode = _step3.value;
              if (cnode.fullpath != action.src) {
                new_children.push(cnode);
              } else {
                found_dir = true;
                action.folderDict.isSelected = cnode.isSelected;
                action.folderDict.childNodes = cnode.childNodes;
                action.folderDict.isExpanded = cnode.isExpanded;
                var newpath = "".concat(action.dst, "/").concat(action.folderDict.basename);
                var _iterator4 = _createForOfIteratorHelper(action.folderDict.childNodes),
                  _step4;
                try {
                  for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                    var ccnode = _step4.value;
                    ccnode.fullpath = "".concat(newpath, "/").concat(ccnode.basename);
                  }
                } catch (err) {
                  _iterator4.e(err);
                } finally {
                  _iterator4.f();
                }
              }
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }
          node.childNodes = new_children;
        }
      });
      if (found_dir) {
        forEachNode(newStateMDir, function (node) {
          if (node.isDirectory && node.fullpath == action.dst) {
            node.childNodes.push(action.folderDict);
          }
        });
      }
      return newStateMDir;
    default:
      return nodes;
  }
}
function updateNode(node, newDict) {
  for (var key in newDict) {
    node[key] = newDict[key];
  }
  return;
}
function filenode(path) {
  var basename = getBasename(path);
  return {
    id: path,
    icon: "document",
    isDirectory: false,
    fullpath: path,
    basename: basename,
    label: basename,
    isSelected: false
  };
}
function dirnode(path) {
  var basename = getBasename(path);
  return {
    id: path,
    icon: "folder-close",
    isDirectory: true,
    isExpanded: false,
    basename: basename,
    label: basename,
    fullpath: path,
    childNodes: [],
    isSelected: false
  };
}
function forEachNode(nodes, callback) {
  if (nodes === undefined) {
    return;
  }
  var _iterator5 = _createForOfIteratorHelper(nodes),
    _step5;
  try {
    for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
      var node = _step5.value;
      callback(node);
      forEachNode(node.childNodes, callback);
    }
  } catch (err) {
    _iterator5.e(err);
  } finally {
    _iterator5.f();
  }
}
function nodeFromPath(fullpath, root) {
  var _iterator6 = _createForOfIteratorHelper(root.childNodes),
    _step6;
  try {
    for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
      var node = _step6.value;
      if (node.fullpath == fullpath) {
        return node;
      }
    }
  } catch (err) {
    _iterator6.e(err);
  } finally {
    _iterator6.f();
  }
  var _iterator7 = _createForOfIteratorHelper(root.childNodes),
    _step7;
  try {
    for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
      var _node = _step7.value;
      if (_node.isDirectory) {
        var result = nodeFromPath(fullpath, _node);
        if (result) {
          return result;
        }
      }
    }
  } catch (err) {
    _iterator7.e(err);
  } finally {
    _iterator7.f();
  }
  return null;
}
function sortNodes(nlist) {
  var newList = _lodash["default"].cloneDeep(nlist);
  newList.sort(function (a, b) {
    return a.basename.localeCompare(b.basename);
  });
  return newList;
}
function PoolTree(props) {
  var _useReducerAndRef = (0, _utilities_react.useReducerAndRef)(treeNodesReducer, []),
    _useReducerAndRef2 = _slicedToArray(_useReducerAndRef, 3),
    nodes = _useReducerAndRef2[0],
    dispatch = _useReducerAndRef2[1],
    nodes_ref = _useReducerAndRef2[2];
  var _useState = (0, _react.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    showContextMenu = _useState2[0],
    setShowContextMenu = _useState2[1];
  var _useState3 = (0, _react.useState)({
      left: 0,
      top: 0
    }),
    _useState4 = _slicedToArray(_useState3, 2),
    contextMenuTarget = _useState4[0],
    setContentMenuTarget = _useState4[1];
  var _useState5 = (0, _react.useState)(""),
    _useState6 = _slicedToArray(_useState5, 2),
    contextMenuNode = _useState6[0],
    setContextMenuNode = _useState6[1];
  var _useState7 = (0, _react.useState)("null"),
    _useState8 = _slicedToArray(_useState7, 2),
    folderOver = _useState8[0],
    setFolderOver = _useState8[1];
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)(""),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    searchString = _useStateAndRef2[0],
    setSearchString = _useStateAndRef2[1],
    searchStringRef = _useStateAndRef2[2];
  var _useState9 = (0, _react.useState)("updated"),
    _useState10 = _slicedToArray(_useState9, 2),
    sortBy = _useState10[0],
    setSortBy = _useState10[1];
  var _useState11 = (0, _react.useState)("descending"),
    _useState12 = _slicedToArray(_useState11, 2),
    sortDirection = _useState12[0],
    setSortDirection = _useState12[1];
  var theme = (0, _react.useContext)(_theme.ThemeContext);
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  (0, _react.useEffect)(function () {
    initSocket();
    if (props.registerTreeRefreshFunc) {
      props.registerTreeRefreshFunc(getTree);
    }
    getTree().then(function () {});
  }, []);
  function getTree() {
    return _getTree.apply(this, arguments);
  }
  function _getTree() {
    _getTree = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var data;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return (0, _communication_react.postPromise)("host", "GetPoolTree", {
              user_id: props.user_id
            });
          case 3:
            data = _context.sent;
            if (data.dtree) {
              _context.next = 7;
              break;
            }
            (0, _toaster.doFlash)("No pool storage available for this account.");
            return _context.abrupt("return");
          case 7:
            data.dtree[0].isExpanded = true;
            dispatch({
              type: "REPLACE_ALL",
              new_nodes: data.dtree
            });
            if (props.value) {
              pushCallback(function () {
                dispatch({
                  type: "SET_IS_SELECTED_FROM_FULLPATH",
                  fullpath: props.value
                });
              });
              pushCallback(function () {
                exposeNode(props.value);
              });
            } else {
              pushCallback(exposeBaseNode);
            }
            _context.next = 15;
            break;
          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](0);
            errorDrawerFuncs.addFromError("Error getting pool tree", _context.t0);
          case 15:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[0, 12]]);
    }));
    return _getTree.apply(this, arguments);
  }
  function focusNode(fullpath, nodes) {
    if (props.handleNodeClick) {
      var dnode = nodeFromPath(fullpath, nodes[0]);
      if (dnode) {
        props.handleNodeClick(dnode, nodes);
      }
    }
    dispatch({
      type: "SET_IS_SELECTED_FROM_FULLPATH",
      fullpath: fullpath
    });
    exposeNode(fullpath);
  }
  function initSocket() {
    if (props.tsocket) {
      props.tsocket.attachListener("pool-directory-event", function (data) {
        var event_type = data["event_type"];
        var path = data["path"];
        var folderDict = data.folder_dict;
        folderDict.id = folderDict.fullpath;
        switch (event_type) {
          case "modify":
            dispatch({
              type: "MODIFY_DIRECTORY",
              folderDict: folderDict
            });
            break;
          case "create":
            dispatch({
              type: "ADD_DIRECTORY",
              folderDict: folderDict
            });
            focusNode(folderDict.fullpath, nodes_ref.current);
            break;
          case "delete":
            dispatch({
              type: "REMOVE_NODE",
              fullpath: folderDict.fullpath
            });
            break;
          case "move":
            dispatch({
              type: "MOVE_DIRECTORY",
              src: data.path,
              dst: getFileParentPath(folderDict.fullpath),
              folderDict: folderDict
            });
            break;
          default:
            break;
        }
      });
      props.tsocket.attachListener("pool-file-event", function (data) {
        var event_type = data["event_type"];
        var path = data["path"];
        var fileDict = data.file_dict;
        fileDict.id = fileDict.fullpath;
        switch (event_type) {
          case "modify":
            dispatch({
              type: "MODIFY_FILE",
              fileDict: fileDict
            });
            break;
          case "create":
            dispatch({
              type: "ADD_FILE",
              fileDict: fileDict
            });
            focusNode(fileDict.fullpath, nodes_ref.current);
            break;
          case "delete":
            dispatch({
              type: "REMOVE_NODE",
              fullpath: fileDict.fullpath
            });
            break;
          case "move":
            dispatch({
              type: "MOVE_FILE",
              src: data.path,
              dst: getFileParentPath(fileDict.fullpath),
              fileDict: fileDict
            });
            break;
          default:
            break;
        }
      });
    }
  }
  function exposeBaseNode() {
    if (nodes_ref.current.length == 0) return;
    dispatch({
      type: "SET_IS_EXPANDED",
      node_id: nodes_ref.current[0].id,
      isExpanded: true
    });
  }
  function exposeNode(fullpath) {
    var the_path = findNodePath(fullpath);
    if (the_path) {
      dispatch({
        type: "MULTI_SET_IS_EXPANDED",
        node_list: the_path,
        isExpanded: true
      });
    } else {
      exposeBaseNode();
    }
  }
  function findNodePath(fullpath) {
    var current_path = [];
    return searchDown(nodes_ref.current, fullpath, current_path);
  }
  function searchDown(childNodes, fullpath, current_path) {
    var _iterator8 = _createForOfIteratorHelper(childNodes),
      _step8;
    try {
      for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
        var node = _step8.value;
        if (node.fullpath == fullpath) {
          return current_path + [node.id];
        } else {
          if ("childNodes" in node) {
            var the_path = searchDown(node.childNodes, fullpath, current_path + [node.id]);
            if (the_path) {
              return the_path;
            }
          }
        }
      }
    } catch (err) {
      _iterator8.e(err);
    } finally {
      _iterator8.f();
    }
    return null;
  }
  function handleNodeCollapse(node) {
    dispatch({
      type: "SET_IS_EXPANDED",
      node_id: node.id,
      isExpanded: false
    });
  }
  function handleNodeExpand(node) {
    dispatch({
      type: "SET_IS_EXPANDED",
      node_id: node.id,
      isExpanded: true
    });
  }
  function handleNodeClick(node) {
    if (props.select_type == "file" && node.isDirectory) return;
    if (props.select_type == "folder" && !node.isDirectory) return;
    if (props.handleNodeClick) {
      props.handleNodeClick(node, nodes_ref.current);
      dispatch({
        type: "SET_IS_SELECTED",
        id: node.id
      });
    }
  }
  function displayContextMenu(node, nodepath, e) {
    e.preventDefault();
    setShowContextMenu(true);
    setContextMenuNode(node);
    setContentMenuTarget({
      left: e.clientX,
      top: e.clientY
    });
  }
  function _update_search_state(new_state) {
    setSearchString(new_state.search_string);
  }
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_core.ContextMenuPopover, {
    onClose: function onClose() {
      setShowContextMenu(false);
    } // Without this doesn't close
    ,
    content: props.renderContextMenu != null ? props.renderContextMenu({
      node: contextMenuNode
    }) : null,
    isOpen: showContextMenu,
    isDarkTheme: theme.dark_theme,
    targetOffset: contextMenuTarget
  }), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      paddingLeft: 10,
      paddingTop: 10,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/_react["default"].createElement(_library_widgets.SearchForm, {
    allow_search_inside: false,
    allow_search_metadata: false,
    update_search_state: _update_search_state,
    search_string: searchStringRef.current
  }), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      display: "flex",
      marginLeft: 15
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.HTMLSelect, {
    options: ["name", "size", "updated"],
    className: "tree-sort-select",
    onChange: function onChange(event) {
      setSortBy(event.target.value);
    },
    minimal: true,
    value: sortBy
  }), /*#__PURE__*/_react["default"].createElement(_core.HTMLSelect, {
    options: ["ascending", "descending"],
    className: "tree-sort-select",
    onChange: function onChange(event) {
      setSortDirection(event.target.value);
    },
    minimal: true,
    value: sortDirection
  }))), /*#__PURE__*/_react["default"].createElement(CustomTree, {
    contents: nodes_ref.current,
    searchString: searchStringRef.current,
    sortField: sortBy,
    sortDirection: sortDirection,
    showSecondaryLabel: props.showSecondaryLabel,
    className: "pool-select-tree",
    handleDrop: props.handleDrop,
    onNodeContextMenu: props.renderContextMenu ? displayContextMenu : null,
    onNodeClick: handleNodeClick,
    onNodeCollapse: handleNodeCollapse,
    onNodeExpand: handleNodeExpand
  }));
}
exports.PoolTree = PoolTree = /*#__PURE__*/(0, _react.memo)(PoolTree);
function getBasename(str) {
  return str.substring(str.lastIndexOf('/') + 1);
}
function getFileParentPath(path) {
  var plist = path.split("/");
  plist.pop();
  return plist.join("/");
}
function splitFilePath(path) {
  var plist = path.split("/");
  var fname = plist.pop();
  return [plist.join("/"), fname];
}
function PoolAddressSelector(props) {
  var _useState13 = (0, _react.useState)(false),
    _useState14 = _slicedToArray(_useState13, 2),
    isOpen = _useState14[0],
    setIsOpen = _useState14[1];
  var pop_ref = (0, _react.useRef)(null);
  var _useState15 = (0, _react.useState)(false),
    _useState16 = _slicedToArray(_useState15, 2),
    refAcquired = _useState16[0],
    setRefAcquired = _useState16[1];
  var _useStateAndRef3 = (0, _utilities_react.useStateAndRef)(.4 * window.innerHeight),
    _useStateAndRef4 = _slicedToArray(_useStateAndRef3, 3),
    maxPopoverHeight = _useStateAndRef4[0],
    setMaxPopoverHeight = _useStateAndRef4[1],
    maxPopoverHeightRef = _useStateAndRef4[2];
  (0, _react.useEffect)(function () {
    window.addEventListener("resize", resizePopover);
    setRefAcquired(false);
    return function () {
      window.removeEventListener("resize", resizePopover);
    };
  }, []);
  (0, _react.useEffect)(function () {
    resizePopover();
  }, [refAcquired]);
  function resizePopover() {
    if (pop_ref.current) {
      var max_height = window.innerHeight - pop_ref.current.offsetTop - 25;
      setMaxPopoverHeight(max_height);
    }
  }
  function handleNodeClick(node, nodes) {
    props.setValue(node.fullpath);
    setIsOpen(false);
    return true;
  }
  function onInteract(next_state, e) {
    if (e && e.currentTarget == document) {
      setIsOpen(false);
    }
  }
  var button_text;
  if (!props.value || props.value == "") {
    button_text = "not set";
  } else {
    button_text = getBasename(props.value);
  }
  var tree_element = /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      maxHeight: maxPopoverHeightRef.current,
      overflowY: "scroll"
    }
  }, /*#__PURE__*/_react["default"].createElement(PoolTree, {
    value: props.value,
    sortField: "name",
    sortDirection: "ascending",
    tsocket: props.tsocket,
    select_type: props.select_type,
    user_id: window.user_id,
    renderContextMenu: null,
    showSecondaryLabel: false,
    handleDrop: null,
    handleNodeClick: handleNodeClick
  }));
  return /*#__PURE__*/_react["default"].createElement(_core.Popover, {
    popoverRef: pop_ref,
    isOpen: isOpen,
    onInteraction: onInteract,
    onOpened: function onOpened() {
      setRefAcquired(true);
    },
    onClosed: function onClosed() {
      setRefAcquired(false);
    },
    position: "bottom-left",
    minimal: true,
    modifiers: {
      flip: {
        enabled: false
      },
      preventOverflow: {
        enabled: false
      }
    },
    content: tree_element
  }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
    text: button_text,
    onClick: function onClick() {
      setIsOpen(!isOpen);
    }
  }));
}
exports.PoolAddressSelector = PoolAddressSelector = /*#__PURE__*/(0, _react.memo)(PoolAddressSelector);

// CustomTree is necessary to support drag-and-drop
// This is largely copied from the blueprintjs source code
function CustomTree(props) {
  function sortFilterNodes(nlist) {
    var newList = _lodash["default"].cloneDeep(nlist);
    if (props.sortField == "name") {
      newList.sort(function (a, b) {
        return a.basename.localeCompare(b.basename);
      });
    } else if (props.sortField == "size") {
      newList.sort(function (a, b) {
        return a.size_for_sort - b.size_for_sort;
      });
    } else {
      newList.sort(function (a, b) {
        return a.updated_for_sort - b.updated_for_sort;
      });
    }
    if (props.sortDirection == "descending") {
      newList = newList.reverse();
    }
    if (props.searchString != "") {
      newList = newList.filter(function (a) {
        return a.isDirectory || a.basename.includes(props.searchString);
      });
    }
    return newList;
  }
  function renderNodes(treeNodes, currentPath, className) {
    if (treeNodes == null) {
      return null;
    }
    var sortedNodes = sortFilterNodes(treeNodes);
    var nodeItems = sortedNodes.map(function (node, i) {
      var elementPath = currentPath.concat(i);
      var tnode = /*#__PURE__*/_react["default"].createElement(_core.TreeNode, _extends({}, node, {
        key: node.id,
        contentRef: props.handleContentRef,
        depth: elementPath.length - 1,
        onClick: props.onNodeClick,
        onContextMenu: props.onNodeContextMenu,
        onCollapse: props.onNodeCollapse,
        onDoubleClick: props.onNodeDoubleClick,
        onExpand: props.onNodeExpand,
        onMouseEnter: props.onNodeMouseEnter,
        onMouseLeave: props.onNodeMouseLeave,
        path: elementPath,
        secondaryLabel: props.showSecondaryLabel ? "".concat(node.updated, "   ").concat(String(node.size)) : null
      }), renderNodes(node.childNodes, elementPath));
      if (node.isDirectory && props.handleDrop) {
        return /*#__PURE__*/_react["default"].createElement(FileDropWrapper, {
          handleDrop: props.handleDrop,
          suppress: false,
          key: node.fullpath,
          fullpath: node.fullpath
        }, tnode);
      } else if (!node.isDirectory && props.handleDrop) {
        return /*#__PURE__*/_react["default"].createElement("div", {
          key: node.fullpath,
          draggable: true,
          onDragStart: function onDragStart(e) {
            e.dataTransfer.setData("fullpath", node.fullpath);
          },
          onDragEnd: function onDragEnd(e) {}
        }, tnode);
      } else {
        return tnode;
      }
    });
    return /*#__PURE__*/_react["default"].createElement("ul", {
      className: "bp5-tree-node-list ".concat(props.className)
    }, nodeItems);
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "bp5-tree",
    style: {
      width: "100%"
    }
  }, renderNodes(props.contents, [], _core.Classes.TREE_ROOT));
}
CustomTree = /*#__PURE__*/(0, _react.memo)(CustomTree);
function FileDropWrapper(props) {
  var _useState17 = (0, _react.useState)(false),
    _useState18 = _slicedToArray(_useState17, 2),
    isDragging = _useState18[0],
    setIsDragging = _useState18[1];
  var handleDragOver = function handleDragOver(e) {
    if (props.suppress.current) return;
    e.preventDefault();
    e.stopPropagation(); // So that containing folders don't also get event;
    setIsDragging(true);
  };
  var handleDragLeave = function handleDragLeave() {
    setIsDragging(false);
  };
  var handleDrop = function handleDrop(e) {
    if (props.suppress.current) return;
    e.preventDefault();
    e.stopPropagation(); // So that containing folders don't also get event;
    setIsDragging(false);
    if (props.handleDrop) {
      props.handleDrop(e, props.fullpath);
    }
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "drop-zone ".concat(isDragging ? 'drag-over' : ''),
    onDragOver: props.suppress.current ? null : handleDragOver,
    onDragLeave: props.suppress.current ? null : handleDragLeave,
    onDrop: props.suppress.current ? null : handleDrop
  }, props.children);
}
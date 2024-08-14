"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PoolAddressSelector = PoolAddressSelector;
exports.PoolContext = void 0;
exports.PoolTree = PoolTree;
exports.getBasename = getBasename;
exports.getFileParentPath = getFileParentPath;
exports.splitFilePath = splitFilePath;
exports.withPool = withPool;
var _react = _interopRequireWildcard(require("react"));
var _core = require("@blueprintjs/core");
var _lodash = _interopRequireDefault(require("lodash"));
var _toaster = require("./toaster");
var _utilities_react = require("./utilities_react");
var _communication_react = require("./communication_react");
var _settings = require("./settings");
var _library_widgets = require("./library_widgets");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var PoolContext = exports.PoolContext = /*#__PURE__*/(0, _react.createContext)({
  workingPath: null,
  setWorkingPath: function setWorkingPath() {}
});
function withPool(WrappedComponent) {
  function newFunc(props) {
    var _useState = (0, _react.useState)(null),
      _useState2 = _slicedToArray(_useState, 2),
      workingPath = _useState2[0],
      setWorkingPath = _useState2[1];
    return /*#__PURE__*/_react["default"].createElement(PoolContext.Provider, {
      value: {
        workingPath: workingPath,
        setWorkingPath: setWorkingPath
      }
    }, /*#__PURE__*/_react["default"].createElement(WrappedComponent, props));
  }
  return /*#__PURE__*/(0, _react.memo)(newFunc);
}
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
  var _useState3 = (0, _react.useState)(false),
    _useState4 = _slicedToArray(_useState3, 2),
    showContextMenu = _useState4[0],
    setShowContextMenu = _useState4[1];
  var _useState5 = (0, _react.useState)({
      left: 0,
      top: 0
    }),
    _useState6 = _slicedToArray(_useState5, 2),
    contextMenuTarget = _useState6[0],
    setContentMenuTarget = _useState6[1];
  var _useState7 = (0, _react.useState)(""),
    _useState8 = _slicedToArray(_useState7, 2),
    contextMenuNode = _useState8[0],
    setContextMenuNode = _useState8[1];
  var _useState9 = (0, _react.useState)("null"),
    _useState10 = _slicedToArray(_useState9, 2),
    folderOver = _useState10[0],
    setFolderOver = _useState10[1];
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)(""),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    searchString = _useStateAndRef2[0],
    setSearchString = _useStateAndRef2[1],
    searchStringRef = _useStateAndRef2[2];
  var _useState11 = (0, _react.useState)("updated"),
    _useState12 = _slicedToArray(_useState11, 2),
    sortBy = _useState12[0],
    setSortBy = _useState12[1];
  var _useState13 = (0, _react.useState)("descending"),
    _useState14 = _slicedToArray(_useState13, 2),
    sortDirection = _useState14[0],
    setSortDirection = _useState14[1];
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  var pool_context = (0, _react.useContext)(PoolContext);
  (0, _react.useEffect)(function () {
    initSocket();
    if (props.registerTreeRefreshFunc) {
      props.registerTreeRefreshFunc(getTree);
    }
    getTree().then(function () {
      if (!props.value && pool_context.workingPath) {
        exposeNode(pool_context.workingPath, false);
      }
    });
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
    var set_working_path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var the_path = findNodePath(fullpath);
    if (the_path) {
      dispatch({
        type: "MULTI_SET_IS_EXPANDED",
        node_list: the_path,
        isExpanded: true
      });
      if (set_working_path) {
        pool_context.setWorkingPath(fullpath);
      }
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
    pool_context.setWorkingPath(node.fullpath);
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
    isDarkTheme: settingsContext.isDark(),
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
    currentRootPath: props.currentRootPath,
    setRoot: props.setRoot,
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
  var _useState15 = (0, _react.useState)(false),
    _useState16 = _slicedToArray(_useState15, 2),
    isOpen = _useState16[0],
    setIsOpen = _useState16[1];
  var pop_ref = (0, _react.useRef)(null);
  var _useState17 = (0, _react.useState)(false),
    _useState18 = _slicedToArray(_useState17, 2),
    refAcquired = _useState18[0],
    setRefAcquired = _useState18[1];
  var _useStateAndRef3 = (0, _utilities_react.useStateAndRef)(.4 * window.innerHeight),
    _useStateAndRef4 = _slicedToArray(_useStateAndRef3, 3),
    maxPopoverHeight = _useStateAndRef4[0],
    setMaxPopoverHeight = _useStateAndRef4[1],
    maxPopoverHeightRef = _useStateAndRef4[2];
  var _useStateAndRef5 = (0, _utilities_react.useStateAndRef)("/mydisk"),
    _useStateAndRef6 = _slicedToArray(_useStateAndRef5, 3),
    currentRootPath = _useStateAndRef6[0],
    setCurrentRootPath = _useStateAndRef6[1],
    currentRootPathRef = _useStateAndRef6[2];
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
    currentRootPath: currentRootPathRef.current,
    setRoot: null,
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
      newList = markNodesDisabled(newList);
      newList = newList.filter(function (a) {
        return !a.isDisabled;
      });
    }
    return newList;
  }
  function checkIfDisabled(node) {
    if (!node.isDirectory) {
      node.isDisabled = !node.basename.includes(props.searchString);
      return node.isDisabled;
    } else {
      var newChildren = [];
      var disabled = true;
      var _iterator9 = _createForOfIteratorHelper(node.childNodes),
        _step9;
      try {
        for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
          var child = _step9.value;
          var newChild = _lodash["default"].cloneDeep(child);
          newChild.isDisabled = checkIfDisabled(child);
          if (!newChild.isDisabled) {
            disabled = false;
          }
          newChildren.push(newChild);
        }
      } catch (err) {
        _iterator9.e(err);
      } finally {
        _iterator9.f();
      }
      node.childNodes = newChildren;
      node.isDisabled = disabled && !node.basename.includes(props.searchString);
      return node.isDisabled;
    }
  }
  function markNodesDisabled(nlist) {
    var newList = _lodash["default"].cloneDeep(nlist);
    var _iterator10 = _createForOfIteratorHelper(newList),
      _step10;
    try {
      for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
        var node = _step10.value;
        checkIfDisabled(node);
      }
    } catch (err) {
      _iterator10.e(err);
    } finally {
      _iterator10.f();
    }
    return newList;
  }
  function nodeDoubleClickFunc(node) {
    if (!node.isDirectory) return null;
    return function () {
      props.setRoot({
        fullpath: node.fullpath
      });
    };
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
        onDoubleClick: nodeDoubleClickFunc(node),
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
  function getNodeFromPath(fullpath, nodes) {
    if (nodes == null || nodes.length == 0) return null;
    var _iterator11 = _createForOfIteratorHelper(nodes),
      _step11;
    try {
      for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
        var node = _step11.value;
        if (node.fullpath == fullpath) {
          return node;
        }
        if (node.isDirectory) {
          var result = getNodeFromPath(fullpath, node.childNodes);
          if (result) {
            return result;
          }
        }
      }
    } catch (err) {
      _iterator11.e(err);
    } finally {
      _iterator11.f();
    }
    return null;
  }
  var rootNode = getNodeFromPath(props.currentRootPath, props.contents);
  var nodes_to_render = !rootNode ? null : [rootNode];
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "bp5-tree",
    style: {
      width: "100%"
    }
  }, renderNodes(nodes_to_render, [], _core.Classes.TREE_ROOT));
}
CustomTree = /*#__PURE__*/(0, _react.memo)(CustomTree);
function FileDropWrapper(props) {
  var _useState19 = (0, _react.useState)(false),
    _useState20 = _slicedToArray(_useState19, 2),
    isDragging = _useState20[0],
    setIsDragging = _useState20[1];
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
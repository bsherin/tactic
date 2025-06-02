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
var _error_drawer = require("./error_drawer");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return r; }; var t, r = {}, e = Object.prototype, n = e.hasOwnProperty, o = "function" == typeof Symbol ? Symbol : {}, i = o.iterator || "@@iterator", a = o.asyncIterator || "@@asyncIterator", u = o.toStringTag || "@@toStringTag"; function c(t, r, e, n) { return Object.defineProperty(t, r, { value: e, enumerable: !n, configurable: !n, writable: !n }); } try { c({}, ""); } catch (t) { c = function c(t, r, e) { return t[r] = e; }; } function h(r, e, n, o) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype); return c(a, "_invoke", function (r, e, n) { var o = 1; return function (i, a) { if (3 === o) throw Error("Generator is already running"); if (4 === o) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var u = n.delegate; if (u) { var c = d(u, n); if (c) { if (c === f) continue; return c; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (1 === o) throw o = 4, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = 3; var h = s(r, e, n); if ("normal" === h.type) { if (o = n.done ? 4 : 2, h.arg === f) continue; return { value: h.arg, done: n.done }; } "throw" === h.type && (o = 4, n.method = "throw", n.arg = h.arg); } }; }(r, n, new Context(o || [])), !0), a; } function s(t, r, e) { try { return { type: "normal", arg: t.call(r, e) }; } catch (t) { return { type: "throw", arg: t }; } } r.wrap = h; var f = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var l = {}; c(l, i, function () { return this; }); var p = Object.getPrototypeOf, y = p && p(p(x([]))); y && y !== e && n.call(y, i) && (l = y); var v = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(l); function g(t) { ["next", "throw", "return"].forEach(function (r) { c(t, r, function (t) { return this._invoke(r, t); }); }); } function AsyncIterator(t, r) { function e(o, i, a, u) { var c = s(t[o], t, i); if ("throw" !== c.type) { var h = c.arg, f = h.value; return f && "object" == _typeof(f) && n.call(f, "__await") ? r.resolve(f.__await).then(function (t) { e("next", t, a, u); }, function (t) { e("throw", t, a, u); }) : r.resolve(f).then(function (t) { h.value = t, a(h); }, function (t) { return e("throw", t, a, u); }); } u(c.arg); } var o; c(this, "_invoke", function (t, n) { function i() { return new r(function (r, o) { e(t, n, r, o); }); } return o = o ? o.then(i, i) : i(); }, !0); } function d(r, e) { var n = e.method, o = r.i[n]; if (o === t) return e.delegate = null, "throw" === n && r.i["return"] && (e.method = "return", e.arg = t, d(r, e), "throw" === e.method) || "return" !== n && (e.method = "throw", e.arg = new TypeError("The iterator does not provide a '" + n + "' method")), f; var i = s(o, r.i, e.arg); if ("throw" === i.type) return e.method = "throw", e.arg = i.arg, e.delegate = null, f; var a = i.arg; return a ? a.done ? (e[r.r] = a.value, e.next = r.n, "return" !== e.method && (e.method = "next", e.arg = t), e.delegate = null, f) : a : (e.method = "throw", e.arg = new TypeError("iterator result is not an object"), e.delegate = null, f); } function w(t) { this.tryEntries.push(t); } function m(r) { var e = r[4] || {}; e.type = "normal", e.arg = t, r[4] = e; } function Context(t) { this.tryEntries = [[-1]], t.forEach(w, this), this.reset(!0); } function x(r) { if (null != r) { var e = r[i]; if (e) return e.call(r); if ("function" == typeof r.next) return r; if (!isNaN(r.length)) { var o = -1, a = function e() { for (; ++o < r.length;) if (n.call(r, o)) return e.value = r[o], e.done = !1, e; return e.value = t, e.done = !0, e; }; return a.next = a; } } throw new TypeError(_typeof(r) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, c(v, "constructor", GeneratorFunctionPrototype), c(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = c(GeneratorFunctionPrototype, u, "GeneratorFunction"), r.isGeneratorFunction = function (t) { var r = "function" == typeof t && t.constructor; return !!r && (r === GeneratorFunction || "GeneratorFunction" === (r.displayName || r.name)); }, r.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, c(t, u, "GeneratorFunction")), t.prototype = Object.create(v), t; }, r.awrap = function (t) { return { __await: t }; }, g(AsyncIterator.prototype), c(AsyncIterator.prototype, a, function () { return this; }), r.AsyncIterator = AsyncIterator, r.async = function (t, e, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(h(t, e, n, o), i); return r.isGeneratorFunction(e) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, g(v), c(v, u, "Generator"), c(v, i, function () { return this; }), c(v, "toString", function () { return "[object Generator]"; }), r.keys = function (t) { var r = Object(t), e = []; for (var n in r) e.unshift(n); return function t() { for (; e.length;) if ((n = e.pop()) in r) return t.value = n, t.done = !1, t; return t.done = !0, t; }; }, r.values = x, Context.prototype = { constructor: Context, reset: function reset(r) { if (this.prev = this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(m), !r) for (var e in this) "t" === e.charAt(0) && n.call(this, e) && !isNaN(+e.slice(1)) && (this[e] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0][4]; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(r) { if (this.done) throw r; var e = this; function n(t) { a.type = "throw", a.arg = r, e.next = t; } for (var o = e.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i[4], u = this.prev, c = i[1], h = i[2]; if (-1 === i[0]) return n("end"), !1; if (!c && !h) throw Error("try statement without catch or finally"); if (null != i[0] && i[0] <= u) { if (u < c) return this.method = "next", this.arg = t, n(c), !0; if (u < h) return n(h), !1; } } }, abrupt: function abrupt(t, r) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var n = this.tryEntries[e]; if (n[0] > -1 && n[0] <= this.prev && this.prev < n[2]) { var o = n; break; } } o && ("break" === t || "continue" === t) && o[0] <= r && r <= o[2] && (o = null); var i = o ? o[4] : {}; return i.type = t, i.arg = r, o ? (this.method = "next", this.next = o[2], f) : this.complete(i); }, complete: function complete(t, r) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && r && (this.next = r), f; }, finish: function finish(t) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var e = this.tryEntries[r]; if (e[2] === t) return this.complete(e[4], e[3]), m(e), f; } }, "catch": function _catch(t) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var e = this.tryEntries[r]; if (e[0] === t) { var n = e[4]; if ("throw" === n.type) { var o = n.arg; m(e); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(r, e, n) { return this.delegate = { i: x(r), r: e, n: n }, "next" === this.method && (this.arg = t), f; } }, r; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
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
    _useState0 = _slicedToArray(_useState9, 2),
    folderOver = _useState0[0],
    setFolderOver = _useState0[1];
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)(""),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    searchString = _useStateAndRef2[0],
    setSearchString = _useStateAndRef2[1],
    searchStringRef = _useStateAndRef2[2];
  var _useState1 = (0, _react.useState)("updated"),
    _useState10 = _slicedToArray(_useState1, 2),
    sortBy = _useState10[0],
    setSortBy = _useState10[1];
  var _useState11 = (0, _react.useState)("descending"),
    _useState12 = _slicedToArray(_useState11, 2),
    sortDirection = _useState12[0],
    setSortDirection = _useState12[1];
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  var pool_context = (0, _react.useContext)(PoolContext);
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
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
  (0, _react.useEffect)(function () {
    getTree().then(function () {
      if (!props.value && pool_context.workingPath) {
        exposeNode(pool_context.workingPath, false);
      }
    });
  }, [props.showHidden]);
  function getTree() {
    return _getTree.apply(this, arguments);
  }
  function _getTree() {
    _getTree = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var data;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return (0, _communication_react.postPromise)("host", "GetPoolTree", {
              user_id: props.user_id,
              show_hidden: props.showHidden
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
    showHidden: false,
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
    var _iterator0 = _createForOfIteratorHelper(newList),
      _step0;
    try {
      for (_iterator0.s(); !(_step0 = _iterator0.n()).done;) {
        var node = _step0.value;
        checkIfDisabled(node);
      }
    } catch (err) {
      _iterator0.e(err);
    } finally {
      _iterator0.f();
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
    var _iterator1 = _createForOfIteratorHelper(nodes),
      _step1;
    try {
      for (_iterator1.s(); !(_step1 = _iterator1.n()).done;) {
        var node = _step1.value;
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
      _iterator1.e(err);
    } finally {
      _iterator1.f();
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
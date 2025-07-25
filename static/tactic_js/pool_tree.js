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
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t2 in e) "default" !== _t2 && {}.hasOwnProperty.call(e, _t2) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t2)) && (i.get || i.set) ? o(f, _t2, i) : f[_t2] = e[_t2]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
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
        _splitFilePath2 = _slicedToArray(_splitFilePath, 1),
        path = _splitFilePath2[0];
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
        _splitFilePath4 = _slicedToArray(_splitFilePath3, 1),
        dpath = _splitFilePath4[0];
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
function PoolTree(props) {
  var _useReducerAndRef = (0, _utilities_react.useReducerAndRef)(treeNodesReducer, []),
    _useReducerAndRef2 = _slicedToArray(_useReducerAndRef, 3),
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
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)(""),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    setSearchString = _useStateAndRef2[1],
    searchStringRef = _useStateAndRef2[2];
  var _useState9 = (0, _react.useState)("updated"),
    _useState0 = _slicedToArray(_useState9, 2),
    sortBy = _useState0[0],
    setSortBy = _useState0[1];
  var _useState1 = (0, _react.useState)("descending"),
    _useState10 = _slicedToArray(_useState1, 2),
    sortDirection = _useState10[0],
    setSortDirection = _useState10[1];
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
    _getTree = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
      var data, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            _context.p = 0;
            _context.n = 1;
            return (0, _communication_react.postPromise)("host", "GetPoolTree", {
              user_id: props.user_id,
              show_hidden: props.showHidden
            });
          case 1:
            data = _context.v;
            if (data.dtree) {
              _context.n = 2;
              break;
            }
            (0, _toaster.doFlash)("No pool storage available for this account.");
            return _context.a(2);
          case 2:
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
            _context.n = 4;
            break;
          case 3:
            _context.p = 3;
            _t = _context.v;
            errorDrawerFuncs.addFromError("Error getting pool tree", _t);
          case 4:
            return _context.a(2);
        }
      }, _callee, null, [[0, 3]]);
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
        var folderDict = data["folder_dict"];
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
    variant: "minimal",
    value: sortBy
  }), /*#__PURE__*/_react["default"].createElement(_core.HTMLSelect, {
    options: ["ascending", "descending"],
    className: "tree-sort-select",
    onChange: function onChange(event) {
      setSortDirection(event.target.value);
    },
    variant: "minimal",
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
  var _useState11 = (0, _react.useState)(false),
    _useState12 = _slicedToArray(_useState11, 2),
    isOpen = _useState12[0],
    setIsOpen = _useState12[1];
  var pop_ref = (0, _react.useRef)(null);
  var _useState13 = (0, _react.useState)(false),
    _useState14 = _slicedToArray(_useState13, 2),
    refAcquired = _useState14[0],
    setRefAcquired = _useState14[1];
  var _useStateAndRef3 = (0, _utilities_react.useStateAndRef)(.4 * window.innerHeight),
    _useStateAndRef4 = _slicedToArray(_useStateAndRef3, 3),
    setMaxPopoverHeight = _useStateAndRef4[1],
    maxPopoverHeightRef = _useStateAndRef4[2];
  var _useStateAndRef5 = (0, _utilities_react.useStateAndRef)("/mydisk"),
    _useStateAndRef6 = _slicedToArray(_useStateAndRef5, 3),
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
  function handleNodeClick(node) {
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
    variant: "minimal",
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
  function renderNodes(treeNodes, currentPath) {
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
          onDragEnd: function onDragEnd() {}
        }, tnode);
      } else {
        return tnode;
      }
    });
    return /*#__PURE__*/_react["default"].createElement("ul", {
      className: "bp6-tree-node-list ".concat(props.className)
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
    className: "bp6-tree",
    style: {
      width: "100%"
    }
  }, renderNodes(nodes_to_render, [], _core.Classes.TREE_ROOT));
}
CustomTree = /*#__PURE__*/(0, _react.memo)(CustomTree);
function FileDropWrapper(props) {
  var _useState15 = (0, _react.useState)(false),
    _useState16 = _slicedToArray(_useState15, 2),
    isDragging = _useState16[0],
    setIsDragging = _useState16[1];
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
"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PoolBrowser = PoolBrowser;
require("../tactic_css/pool.scss");
var _react = _interopRequireWildcard(require("react"));
var _core = require("@blueprintjs/core");
var _utilities_react = require("./utilities_react");
var _library_menubars = require("./library_menubars");
var _combined_metadata = require("./combined_metadata");
var _pool_tree = require("./pool_tree");
var _resizing_allotment = require("./resizing_allotment");
var _communication_react = require("./communication_react");
var _error_drawer = require("./error_drawer");
var _sizing_tools = require("./sizing_tools");
var _toaster = require("./toaster");
var _modal_react = require("./modal_react");
var _library_home_react = require("./library_home_react");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t10 in e) "default" !== _t10 && {}.hasOwnProperty.call(e, _t10) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t10)) && (i.get || i.set) ? o(f, _t10, i) : f[_t10] = e[_t10]); return f; })(e, t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function PoolBrowser(props) {
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)({
      name: "",
      tags: "",
      notes: "",
      updated: "",
      created: "",
      size: "",
      res_type: null
    }),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    set_selected_resource = _useStateAndRef2[1],
    selected_resource_ref = _useStateAndRef2[2];
  var _useStateAndRef3 = (0, _utilities_react.useStateAndRef)("/mydisk"),
    _useStateAndRef4 = _slicedToArray(_useStateAndRef3, 3),
    setCurrentRootPath = _useStateAndRef4[1],
    currentRootPathRef = _useStateAndRef4[2];
  var _useStateAndRef5 = (0, _utilities_react.useStateAndRef)(null),
    _useStateAndRef6 = _slicedToArray(_useStateAndRef5, 3),
    value = _useStateAndRef6[0],
    setValue = _useStateAndRef6[1],
    valueRef = _useStateAndRef6[2];
  var _useStateAndRef7 = (0, _utilities_react.useStateAndRef)(null),
    _useStateAndRef8 = _slicedToArray(_useStateAndRef7, 3),
    setSelectedNode = _useStateAndRef8[1],
    selectedNodeRef = _useStateAndRef8[2];
  var _useStateAndRef9 = (0, _utilities_react.useStateAndRef)(false),
    _useStateAndRef0 = _slicedToArray(_useStateAndRef9, 3),
    multi_select_ref = _useStateAndRef0[2];
  var _useStateAndRef1 = (0, _utilities_react.useStateAndRef)([]),
    _useStateAndRef10 = _slicedToArray(_useStateAndRef1, 3),
    list_of_selected_ref = _useStateAndRef10[2];
  var _useState = (0, _react.useState)([]),
    _useState2 = _slicedToArray(_useState, 2),
    setContextMenuItems = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = _slicedToArray(_useState3, 2),
    have_activated = _useState4[0],
    set_have_activated = _useState4[1];
  var _useState5 = (0, _react.useState)(false),
    _useState6 = _slicedToArray(_useState5, 2),
    showHidden = _useState6[0],
    setShowHidden = _useState6[1];
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
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
        size: String(selectedNodeRef.current.size),
        res_type: selectedNodeRef.current.isDirectory ? "poolDir" : "poolFile"
      });
    } else {
      set_selected_resource({
        name: "",
        tags: "",
        notes: "",
        updated: "",
        created: "",
        res_type: null
      });
    }
  }, [value]);
  function sendNewCell(_x, _x2, _x3) {
    return _sendNewCell.apply(this, arguments);
  }
  function _sendNewCell() {
    _sendNewCell = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13(path, main_id, read_as_dataframe) {
      var ext, code;
      return _regenerator().w(function (_context13) {
        while (1) switch (_context13.n) {
          case 0:
            ext = (0, _utilities_react.getFileExtension)(path);
            if (read_as_dataframe) {
              if (ext === "csv") {
                code = "import pandas as pd\ndf = pd.read_csv(\"".concat(path, "\")");
              } else if (ext === "parquet") {
                code = "import pandas as pd\ndf = pd.read_parquet(\"".concat(path, "\")");
              } else {
                code = "import pandas as pd\ndf = pd.read_pickle(\"".concat(path, "\")");
              }
            } else {
              if (ext == "pkl") {
                code = "import pickle\nwith open(\"".concat(path, "\", \"rb\") as f:\n    data = pickle.load(f)");
              } else {
                code = "with open(\"".concat(path, "\") as f:\n    txt = f.read()");
              }
            }
            _context13.n = 1;
            return (0, _communication_react.postPromise)("host", "print_code_area_to_console", {
              "console_text": code,
              "user_id": window.user_id,
              "main_id": main_id
            }, props.main_id);
          case 1:
            return _context13.a(2);
        }
      }, _callee13);
    }));
    return _sendNewCell.apply(this, arguments);
  }
  function openInNotebook() {
    return _openInNotebook.apply(this, arguments);
  }
  function _openInNotebook() {
    _openInNotebook = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee15() {
      var node,
        path,
        openResources,
        open_projects,
        open_projects_dict,
        requireNewNotebook,
        _iterator,
        _step,
        entry,
        _yield$dialogFuncs$sh,
        _yield$dialogFuncs$sh2,
        selectedResource,
        checkResults,
        data,
        _args15 = arguments,
        _t;
      return _regenerator().w(function (_context15) {
        while (1) switch (_context15.n) {
          case 0:
            node = _args15.length > 0 && _args15[0] !== undefined ? _args15[0] : null;
            if (!(!valueRef.current && !node)) {
              _context15.n = 1;
              break;
            }
            return _context15.a(2);
          case 1:
            _context15.p = 1;
            path = node && "isDirectory" in node ? node.fullpath : valueRef.current;
            if (!node.isDirectory) {
              _context15.n = 2;
              break;
            }
            return _context15.a(2);
          case 2:
            openResources = props.getOpenResources();
            open_projects = [];
            open_projects_dict = {};
            if (openResources.length === 0) {
              requireNewNotebook = true;
            } else {
              requireNewNotebook = false;
              _iterator = _createForOfIteratorHelper(openResources);
              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  entry = _step.value;
                  if (entry.res_type === "project" || entry.res_type === "collection") {
                    open_projects.push(entry.resource_name);
                    open_projects_dict[entry.resource_name] = entry;
                  }
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }
            }
            _context15.n = 3;
            return dialogFuncs.showModalPromise("SelectDialog", {
              title: "Open resources in notebook",
              checkboxes: [{
                "checkname": "create_new_notebook",
                "checktext": "Create new notebook",
                "checked": requireNewNotebook,
                "disabled": requireNewNotebook
              }, {
                "checkname": "read_as_dataframe",
                "checktext": "Read as dataframe",
                "checked": false
              }],
              select_label: "Project",
              cancel_text: "Cancel",
              submit_text: "Open",
              option_list: open_projects,
              handleClose: dialogFuncs.hideModal
            });
          case 3:
            _yield$dialogFuncs$sh = _context15.v;
            _yield$dialogFuncs$sh2 = _slicedToArray(_yield$dialogFuncs$sh, 2);
            selectedResource = _yield$dialogFuncs$sh2[0];
            checkResults = _yield$dialogFuncs$sh2[1];
            if (!checkResults["create_new_notebook"]) {
              _context15.n = 5;
              break;
            }
            _context15.n = 4;
            return (0, _communication_react.postAjaxPromise)("new_notebook_in_context", {});
          case 4:
            data = _context15.v;
            if (data.success) {
              props.handleCreateViewer(data, /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee14() {
                return _regenerator().w(function (_context14) {
                  while (1) switch (_context14.n) {
                    case 0:
                      _context14.n = 1;
                      return sendNewCell(path, data.main_id, checkResults["read_as_dataframe"]);
                    case 1:
                      return _context14.a(2, _context14.v);
                  }
                }, _callee14);
              })));
            } else {
              errorDrawerFuncs.addErrorDrawerEntry({
                title: "Error opening in notebook",
                content: "message" in data ? data.message : ""
              });
            }
            _context15.n = 6;
            break;
          case 5:
            props.setSelectedTabId(open_projects_dict[selectedResource].id);
            _context15.n = 6;
            return sendNewCell(path, open_projects_dict[selectedResource].main_id, checkResults["read_as_dataframe"]);
          case 6:
            _context15.n = 8;
            break;
          case 7:
            _context15.p = 7;
            _t = _context15.v;
            errorDrawerFuncs.addFromError("Error opening in notebook", _t);
          case 8:
            return _context15.a(2);
        }
      }, _callee15, null, [[1, 7]]);
    }));
    return _openInNotebook.apply(this, arguments);
  }
  function viewTextFile() {
    return _viewTextFile.apply(this, arguments);
  }
  function _viewTextFile() {
    _viewTextFile = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee16() {
      var node,
        data,
        path,
        _args16 = arguments,
        _t2;
      return _regenerator().w(function (_context16) {
        while (1) switch (_context16.n) {
          case 0:
            node = _args16.length > 0 && _args16[0] !== undefined ? _args16[0] : null;
            if (!(!valueRef.current && !node)) {
              _context16.n = 1;
              break;
            }
            return _context16.a(2);
          case 1:
            _context16.p = 1;
            path = node && "isDirectory" in node ? node.fullpath : valueRef.current;
            if (!node.isDirectory) {
              _context16.n = 2;
              break;
            }
            return _context16.a(2);
          case 2:
            _context16.n = 3;
            return (0, _communication_react.postAjaxPromise)("view_text_in_context", {
              context_id: context_id,
              file_path: path
            });
          case 3:
            data = _context16.v;
            if (data.success) {
              props.handleCreateViewer(data);
            } else {
              errorDrawerFuncs.addErrorDrawerEntry({
                title: "Error viewing text file",
                content: "message" in data ? data.message : ""
              });
            }
            _context16.n = 5;
            break;
          case 4:
            _context16.p = 4;
            _t2 = _context16.v;
            errorDrawerFuncs.addFromError("Error viewing text file", _t2);
          case 5:
            return _context16.a(2);
        }
      }, _callee16, null, [[1, 4]]);
    }));
    return _viewTextFile.apply(this, arguments);
  }
  function _copy_func() {
    var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    if (!valueRef.current && !node) return;
    var path = node && "isDirectory" in node ? node.fullpath : valueRef.current;
    (0, _utilities_react.copyToClipboard)(path);
  }
  function _rename_func() {
    return _rename_func2.apply(this, arguments);
  }
  function _rename_func2() {
    _rename_func2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee17() {
      var node,
        path,
        new_name,
        the_data,
        _args17 = arguments,
        _t3;
      return _regenerator().w(function (_context17) {
        while (1) switch (_context17.n) {
          case 0:
            node = _args17.length > 0 && _args17[0] !== undefined ? _args17[0] : null;
            if (!(!valueRef.current && !node)) {
              _context17.n = 1;
              break;
            }
            return _context17.a(2);
          case 1:
            _context17.p = 1;
            path = node && "isDirectory" in node ? node.fullpath : valueRef.current;
            _context17.n = 2;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Rename Pool Resource",
              field_title: "New Name",
              default_value: (0, _pool_tree.getBasename)(path),
              existing_names: [],
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 2:
            new_name = _context17.v;
            the_data = {
              new_name: new_name,
              old_path: path
            };
            _context17.n = 3;
            return (0, _communication_react.postAjaxPromise)("rename_pool_resource", the_data);
          case 3:
            _context17.n = 5;
            break;
          case 4:
            _context17.p = 4;
            _t3 = _context17.v;
            if (_t3 != "canceled") {
              errorDrawerFuncs.addFromError("Error renaming", _t3);
            }
          case 5:
            return _context17.a(2);
        }
      }, _callee17, null, [[1, 4]]);
    }));
    return _rename_func2.apply(this, arguments);
  }
  function _add_directory() {
    return _add_directory2.apply(this, arguments);
  }
  function _add_directory2() {
    _add_directory2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee18() {
      var node,
        sNode,
        initial_address,
        full_path,
        the_data,
        _args18 = arguments,
        _t4;
      return _regenerator().w(function (_context18) {
        while (1) switch (_context18.n) {
          case 0:
            node = _args18.length > 0 && _args18[0] !== undefined ? _args18[0] : null;
            if (!(!valueRef.current && !node)) {
              _context18.n = 1;
              break;
            }
            return _context18.a(2);
          case 1:
            _context18.p = 1;
            sNode = node && "isDirectory" in node ? node : selectedNodeRef.current;
            if (sNode.isDirectory) {
              initial_address = sNode.fullpath;
            } else {
              initial_address = (0, _pool_tree.getFileParentPath)(sNode.fullpath);
            }
            _context18.n = 2;
            return dialogFuncs.showModalPromise("SelectAddressDialog", {
              title: "Add a Pool Directory",
              selectType: "folder",
              initial_address: initial_address,
              initial_name: "New Directory",
              showName: true,
              handleClose: dialogFuncs.hideModal
            });
          case 2:
            full_path = _context18.v;
            the_data = {
              full_path: full_path
            };
            _context18.n = 3;
            return (0, _communication_react.postAjaxPromise)("create_pool_directory", the_data);
          case 3:
            _context18.n = 5;
            break;
          case 4:
            _context18.p = 4;
            _t4 = _context18.v;
            if (_t4 != "canceled") {
              errorDrawerFuncs.addFromError("Error adding directory", _t4);
            }
          case 5:
            return _context18.a(2);
        }
      }, _callee18, null, [[1, 4]]);
    }));
    return _add_directory2.apply(this, arguments);
  }
  function _duplicate_file() {
    return _duplicate_file2.apply(this, arguments);
  }
  function _duplicate_file2() {
    _duplicate_file2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee19() {
      var node,
        sNode,
        src,
        _splitFilePath,
        _splitFilePath2,
        initial_address,
        initial_name,
        dst,
        the_data,
        _args19 = arguments,
        _t5;
      return _regenerator().w(function (_context19) {
        while (1) switch (_context19.n) {
          case 0:
            node = _args19.length > 0 && _args19[0] !== undefined ? _args19[0] : null;
            if (!(!valueRef.current && !node)) {
              _context19.n = 1;
              break;
            }
            return _context19.a(2);
          case 1:
            _context19.p = 1;
            sNode = node && "isDirectory" in node ? node : selectedNodeRef.current;
            if (!sNode.isDirectory) {
              _context19.n = 2;
              break;
            }
            (0, _toaster.doFlash)("You can't duplicate a directory");
            return _context19.a(2);
          case 2:
            src = sNode.fullpath;
            _splitFilePath = (0, _pool_tree.splitFilePath)(sNode.fullpath), _splitFilePath2 = _slicedToArray(_splitFilePath, 2), initial_address = _splitFilePath2[0], initial_name = _splitFilePath2[1];
            _context19.n = 3;
            return dialogFuncs.showModalPromise("SelectAddressDialog", {
              title: "Duplicate a file",
              selectType: "folder",
              initial_address: initial_address,
              initial_name: initial_name,
              showName: true,
              handleClose: dialogFuncs.hideModal
            });
          case 3:
            dst = _context19.v;
            the_data = {
              dst: dst,
              src: src
            };
            _context19.n = 4;
            return (0, _communication_react.postAjaxPromise)("duplicate_pool_file", the_data);
          case 4:
            _context19.n = 6;
            break;
          case 5:
            _context19.p = 5;
            _t5 = _context19.v;
            if (_t5 != "canceled") {
              errorDrawerFuncs.addFromError("Error duplicating file", _t5);
            }
          case 6:
            return _context19.a(2);
        }
      }, _callee19, null, [[1, 5]]);
    }));
    return _duplicate_file2.apply(this, arguments);
  }
  function _compress_file() {
    return _compress_file2.apply(this, arguments);
  }
  function _compress_file2() {
    _compress_file2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee20() {
      var node,
        sNode,
        _args20 = arguments,
        _t6;
      return _regenerator().w(function (_context20) {
        while (1) switch (_context20.n) {
          case 0:
            node = _args20.length > 0 && _args20[0] !== undefined ? _args20[0] : null;
            if (!(!valueRef.current && !node)) {
              _context20.n = 1;
              break;
            }
            return _context20.a(2);
          case 1:
            _context20.p = 1;
            sNode = node && "isDirectory" in node ? node : selectedNodeRef.current;
            _context20.n = 2;
            return (0, _communication_react.postPromise)("host", "compress_pool_resource", {
              full_path: sNode.fullpath,
              force_forward: true,
              user_id: window.user_id
            });
          case 2:
            _context20.n = 4;
            break;
          case 3:
            _context20.p = 3;
            _t6 = _context20.v;
            errorDrawerFuncs.addFromError("Error compressing file or folder", _t6);
          case 4:
            return _context20.a(2);
        }
      }, _callee20, null, [[1, 3]]);
    }));
    return _compress_file2.apply(this, arguments);
  }
  function _decompress_archive() {
    return _decompress_archive2.apply(this, arguments);
  }
  function _decompress_archive2() {
    _decompress_archive2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee21() {
      var node,
        sNode,
        _args21 = arguments,
        _t7;
      return _regenerator().w(function (_context21) {
        while (1) switch (_context21.n) {
          case 0:
            node = _args21.length > 0 && _args21[0] !== undefined ? _args21[0] : null;
            if (!(!valueRef.current && !node)) {
              _context21.n = 1;
              break;
            }
            return _context21.a(2);
          case 1:
            _context21.p = 1;
            sNode = node && "isDirectory" in node ? node : selectedNodeRef.current;
            _context21.n = 2;
            return (0, _communication_react.postPromise)("host", "decompress_archive", {
              full_path: sNode.fullpath,
              force_forward: true,
              user_id: window.user_id
            });
          case 2:
            _context21.n = 4;
            break;
          case 3:
            _context21.p = 3;
            _t7 = _context21.v;
            errorDrawerFuncs.addFromError("Error decompressing archive", _t7);
          case 4:
            return _context21.a(2);
        }
      }, _callee21, null, [[1, 3]]);
    }));
    return _decompress_archive2.apply(this, arguments);
  }
  function _downloadFile() {
    return _downloadFile2.apply(this, arguments);
  }
  function _downloadFile2() {
    _downloadFile2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee22() {
      var node,
        sNode,
        src,
        new_name,
        the_data,
        _yield$getBlobPromise,
        _yield$getBlobPromise2,
        data,
        xhr,
        blob,
        url,
        a,
        _args22 = arguments,
        _t8;
      return _regenerator().w(function (_context22) {
        while (1) switch (_context22.n) {
          case 0:
            node = _args22.length > 0 && _args22[0] !== undefined ? _args22[0] : null;
            if (!(!valueRef.current && !node)) {
              _context22.n = 1;
              break;
            }
            return _context22.a(2);
          case 1:
            _context22.p = 1;
            sNode = node && "isDirectory" in node ? node : selectedNodeRef.current;
            if (!sNode.isDirectory) {
              _context22.n = 2;
              break;
            }
            (0, _toaster.doFlash)("You can't download a directory");
            return _context22.a(2);
          case 2:
            src = sNode.fullpath;
            console.log("Got source " + String(src));
            _context22.n = 3;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Download File",
              field_title: "New File Name",
              default_value: (0, _pool_tree.getBasename)(src),
              existing_names: [],
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 3:
            new_name = _context22.v;
            the_data = {
              src: src
            };
            _context22.n = 4;
            return (0, _communication_react.getBlobPromise)("download_pool_file", the_data);
          case 4:
            _yield$getBlobPromise = _context22.v;
            _yield$getBlobPromise2 = _slicedToArray(_yield$getBlobPromise, 3);
            data = _yield$getBlobPromise2[0];
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
            _context22.n = 6;
            break;
          case 5:
            _context22.p = 5;
            _t8 = _context22.v;
            if (_t8 != "canceled") {
              errorDrawerFuncs.addFromError("Error downloading from pool", _t8);
            }
          case 6:
            return _context22.a(2);
        }
      }, _callee22, null, [[1, 5]]);
    }));
    return _downloadFile2.apply(this, arguments);
  }
  function MoveResource(_x4, _x5) {
    return _MoveResource.apply(this, arguments);
  }
  function _MoveResource() {
    _MoveResource = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee23(src, dst) {
      var the_data, _t9;
      return _regenerator().w(function (_context23) {
        while (1) switch (_context23.n) {
          case 0:
            if (!(src == dst)) {
              _context23.n = 1;
              break;
            }
            return _context23.a(2);
          case 1:
            _context23.p = 1;
            the_data = {
              dst: dst,
              src: src
            };
            _context23.n = 2;
            return (0, _communication_react.postAjaxPromise)("move_pool_resource", the_data);
          case 2:
            _context23.n = 4;
            break;
          case 3:
            _context23.p = 3;
            _t9 = _context23.v;
            errorDrawerFuncs.addFromError("Error moving resource", _t9);
          case 4:
            return _context23.a(2);
        }
      }, _callee23, null, [[1, 3]]);
    }));
    return _MoveResource.apply(this, arguments);
  }
  function _move_resource() {
    return _move_resource2.apply(this, arguments);
  }
  function _move_resource2() {
    _move_resource2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee24() {
      var node,
        sNode,
        src,
        initial_address,
        dst,
        _args24 = arguments,
        _t0;
      return _regenerator().w(function (_context24) {
        while (1) switch (_context24.n) {
          case 0:
            node = _args24.length > 0 && _args24[0] !== undefined ? _args24[0] : null;
            if (!(!valueRef.current && !node)) {
              _context24.n = 1;
              break;
            }
            return _context24.a(2);
          case 1:
            _context24.p = 1;
            sNode = node && "isDirectory" in node ? node : selectedNodeRef.current;
            src = sNode.fullpath;
            if (sNode.isDirectory) {
              initial_address = sNode.fullpath;
            } else {
              initial_address = (0, _pool_tree.getFileParentPath)(sNode.fullpath);
            }
            _context24.n = 2;
            return dialogFuncs.showModalPromise("SelectAddressDialog", {
              title: "Select a destination for ".concat((0, _pool_tree.getBasename)(src)),
              selectType: "folder",
              initial_address: initial_address,
              initial_name: "",
              showName: false,
              handleClose: dialogFuncs.hideModal
            });
          case 2:
            dst = _context24.v;
            _context24.n = 3;
            return MoveResource(src, dst);
          case 3:
            _context24.n = 5;
            break;
          case 4:
            _context24.p = 4;
            _t0 = _context24.v;
            if (_t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error moving resource", _t0);
            }
          case 5:
            return _context24.a(2);
        }
      }, _callee24, null, [[1, 4]]);
    }));
    return _move_resource2.apply(this, arguments);
  }
  function _delete_func() {
    return _delete_func2.apply(this, arguments);
  }
  function _delete_func2() {
    _delete_func2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee25() {
      var node,
        path,
        sNode,
        basename,
        confirm_text,
        _args25 = arguments,
        _t1;
      return _regenerator().w(function (_context25) {
        while (1) switch (_context25.n) {
          case 0:
            node = _args25.length > 0 && _args25[0] !== undefined ? _args25[0] : null;
            if (!(!valueRef.current && !node)) {
              _context25.n = 1;
              break;
            }
            return _context25.a(2);
          case 1:
            _context25.p = 1;
            path = node && "isDirectory" in node ? node.fullpath : valueRef.current;
            sNode = node && "isDirectory" in node ? node : selectedNodeRef.current;
            basename = (0, _pool_tree.getBasename)(path);
            if (sNode.isDirectory && sNode.childNodes.length > 0) {
              confirm_text = "Are you sure that you want to delete the non-empty directory ".concat(basename, "?");
            } else {
              confirm_text = "Are you sure that you want to delete ".concat(basename, "?");
            }
            _context25.n = 2;
            return dialogFuncs.showModalPromise("ConfirmDialog", {
              title: "Delete resource",
              text_body: confirm_text,
              cancel_text: "do nothing",
              submit_text: "delete",
              handleClose: dialogFuncs.hideModal
            });
          case 2:
            _context25.n = 3;
            return (0, _communication_react.postAjaxPromise)("delete_pool_resource", {
              full_path: path,
              is_directory: sNode.isDirectory
            });
          case 3:
            _context25.n = 5;
            break;
          case 4:
            _context25.p = 4;
            _t1 = _context25.v;
            if (_t1 != "canceled") {
              errorDrawerFuncs.addFromError("Error deleting", _t1);
            }
          case 5:
            return _context25.a(2);
        }
      }, _callee25, null, [[1, 4]]);
    }));
    return _delete_func2.apply(this, arguments);
  }
  function _add_to_pool(myDropZone, setCurrentUrl) {
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
  function handleDrop(_x6, _x7) {
    return _handleDrop.apply(this, arguments);
  }
  function _handleDrop() {
    _handleDrop = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee26(e, dst) {
      var files, src;
      return _regenerator().w(function (_context26) {
        while (1) switch (_context26.n) {
          case 0:
            files = e.dataTransfer.files;
            if (!(files.length != 0)) {
              _context26.n = 1;
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
            _context26.n = 2;
            break;
          case 1:
            src = e.dataTransfer.getData("fullpath");
            if (!src) {
              _context26.n = 2;
              break;
            }
            _context26.n = 2;
            return MoveResource(src, dst);
          case 2:
            return _context26.a(2);
        }
      }, _callee26);
    }));
    return _handleDrop.apply(this, arguments);
  }
  function handleNodeClick(node) {
    setValue(node.fullpath);
    setSelectedNode(node);
    return true;
  }
  function setRoot() {
    var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    if (!node) {
      node = selectedNodeRef.current;
    }
    setCurrentRootPath(node.fullpath);
  }
  function setRootToBase() {
    setCurrentRootPath("/mydisk");
  }
  function renderContextMenu(props) {
    return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, props.node.isDirectory && /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "folder-shared-open",
      onClick: /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              _context.n = 1;
              return setRoot(props.node);
            case 1:
              return _context.a(2);
          }
        }, _callee);
      })),
      text: "Go To Folder"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "home",
      onClick: /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              _context2.n = 1;
              return setRootToBase(props.node);
            case 1:
              return _context2.a(2);
          }
        }, _callee2);
      })),
      text: "Go Home"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "clipboard",
      onClick: /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              _context3.n = 1;
              return _copy_func(props.node);
            case 1:
              return _context3.a(2);
          }
        }, _callee3);
      })),
      text: "Copy Path"
    }), !props.node.isDirectory && /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "eye-open",
      onClick: /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              _context4.n = 1;
              return viewTextFile(props.node);
            case 1:
              return _context4.a(2);
          }
        }, _callee4);
      })),
      text: "View as Text"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "code",
      onClick: /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.n) {
            case 0:
              _context5.n = 1;
              return openInNotebook(props.node);
            case 1:
              return _context5.a(2);
          }
        }, _callee5);
      })),
      text: "Open in Notebook"
    })), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "edit",
      onClick: /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.n) {
            case 0:
              _context6.n = 1;
              return _rename_func(props.node);
            case 1:
              return _context6.a(2);
          }
        }, _callee6);
      })),
      text: "Rename Resource"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "inheritance",
      onClick: /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.n) {
            case 0:
              _context7.n = 1;
              return _move_resource(props.node);
            case 1:
              return _context7.a(2);
          }
        }, _callee7);
      })),
      text: "Move Resource"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "duplicate",
      onClick: /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.n) {
            case 0:
              _context8.n = 1;
              return _duplicate_file(props.node);
            case 1:
              return _context8.a(2);
          }
        }, _callee8);
      })),
      text: "Duplicate File"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "folder-close",
      onClick: /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9() {
        return _regenerator().w(function (_context9) {
          while (1) switch (_context9.n) {
            case 0:
              _context9.n = 1;
              return _add_directory(props.node);
            case 1:
              return _context9.a(2);
          }
        }, _callee9);
      })),
      text: "Create Directory"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "trash",
      onClick: /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0() {
        return _regenerator().w(function (_context0) {
          while (1) switch (_context0.n) {
            case 0:
              _context0.n = 1;
              return _delete_func(props.node);
            case 1:
              return _context0.a(2);
          }
        }, _callee0);
      })),
      intent: "danger",
      text: "Delete Resource"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "archive",
      onClick: /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1() {
        return _regenerator().w(function (_context1) {
          while (1) switch (_context1.n) {
            case 0:
              _context1.n = 1;
              return _compress_file(props.node);
            case 1:
              return _context1.a(2);
          }
        }, _callee1);
      })),
      text: "Compress Resource"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "unarchive",
      onClick: /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10() {
        return _regenerator().w(function (_context10) {
          while (1) switch (_context10.n) {
            case 0:
              _context10.n = 1;
              return _decompress_archive(props.node);
            case 1:
              return _context10.a(2);
          }
        }, _callee10);
      })),
      text: "Decompress archive"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "cloud-upload",
      onClick: /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11() {
        return _regenerator().w(function (_context11) {
          while (1) switch (_context11.n) {
            case 0:
              _context11.n = 1;
              return _showPoolImport(props.node);
            case 1:
              return _context11.a(2);
          }
        }, _callee11);
      })),
      text: "Import To Pool"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "download",
      onClick: /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12() {
        return _regenerator().w(function (_context12) {
          while (1) switch (_context12.n) {
            case 0:
              _context12.n = 1;
              return _downloadFile(props.node);
            case 1:
              return _context12.a(2);
          }
        }, _callee12);
      })),
      text: "Download from Pool"
    }));
  }
  function registerTreeRefreshFunc(func) {
    treeRefreshFunc.current = func;
  }
  var fixed_data = {
    created: selected_resource_ref.current.created,
    updated: selected_resource_ref.current.updated,
    size: selected_resource_ref.current.size,
    path: valueRef.current
  };
  var right_pane = /*#__PURE__*/_react["default"].createElement(_combined_metadata.CombinedMetadata, {
    res_type: selected_resource_ref.current.res_type,
    res_name: selected_resource_ref.current.name,
    useFixedData: true,
    fixedData: fixed_data,
    elevation: 2,
    readOnly: true
  });
  var left_pane = /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-column resource-viewer-left-pane-holder top-padded",
    style: {
      maxHeight: "100%",
      position: "relative",
      overflow: "scroll"
    }
  }, (props.am_selected || have_activated) && /*#__PURE__*/_react["default"].createElement(_pool_tree.PoolContext.Provider, {
    value: {
      workingPath: null,
      setWorkingPath: function setWorkingPath() {}
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-row",
    style: {
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/_react["default"].createElement(PoolBreadcrumbs, {
    path: currentRootPathRef.current,
    setRoot: setRoot
  }), /*#__PURE__*/_react["default"].createElement(PoolHiddenSwitch, {
    showHidden: showHidden,
    setShowHidden: setShowHidden
  })), /*#__PURE__*/_react["default"].createElement(_pool_tree.PoolTree, {
    value: valueRef.current,
    currentRootPath: currentRootPathRef.current,
    showHidden: showHidden,
    setRoot: setRoot,
    renderContextMenu: renderContextMenu,
    select_type: "both",
    registerTreeRefreshFunc: registerTreeRefreshFunc,
    user_id: window.user_id,
    tsocket: props.tsocket,
    handleDrop: handleDrop,
    showSecondaryLabel: true,
    handleNodeClick: handleNodeClick
  }))));
  var outer_style = {
    width: "calc(100% - ".concat(_sizing_tools.ICON_BAR_WIDTH, "px)"),
    height: "100%",
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 0,
    position: "relative"
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: outer_style
  }, /*#__PURE__*/_react["default"].createElement(PoolMenubar, _extends({
    selected_resource: selected_resource_ref.current,
    connection_status: null,
    copy_func: _copy_func,
    rename_func: _rename_func,
    delete_func: _delete_func,
    view_func: viewTextFile,
    open_in_notebook_func: openInNotebook,
    add_directory: _add_directory,
    duplicate_file: _duplicate_file,
    compress_file: _compress_file,
    decompress_archive: _decompress_archive,
    move_resource: _move_resource,
    download_file: _downloadFile,
    refreshFunc: treeRefreshFunc.current,
    showPoolImport: _showPoolImport,
    multi_select: multi_select_ref.current,
    list_of_selected: list_of_selected_ref.current,
    sendContextMenuItems: setContextMenuItems,
    setRootToBase: setRootToBase,
    setRoot: setRoot
  }, props.errorDrawerFuncs, {
    library_id: props.library_id,
    controlled: props.controlled,
    tsocket: props.tsocket
  })), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      flex: "1 1 0",
      display: "flex",
      minHeight: 0,
      position: "relative"
    }
  }, /*#__PURE__*/_react["default"].createElement(_resizing_allotment.HorizontalPanes, {
    outer_hp_style: {},
    show_handle: true,
    left_pane: left_pane,
    right_pane: right_pane,
    right_pane_overflow: "auto",
    initial_width_fraction: .75
  })));
}
exports.PoolBrowser = PoolBrowser = /*#__PURE__*/(0, _react.memo)(PoolBrowser);
function PoolBreadcrumb(props) {
  return /*#__PURE__*/_react["default"].createElement(_core.Breadcrumb, {
    className: "pool-breadcrumb",
    key: props.path,
    icon: props.icon,
    onClick: props.onClick
  }, props.name);
}
function PoolHiddenSwitch(props) {
  function handleShowHiddenChange(event) {
    props.setShowHidden(event.target.checked);
  }
  return /*#__PURE__*/_react["default"].createElement(_core.Switch, {
    label: "show hidden",
    size: "medium",
    checked: props.showHidden,
    onChange: handleShowHiddenChange
  });
}
function PoolBreadcrumbs(props) {
  function clickFunc(path) {
    return function () {
      props.setRoot({
        fullpath: path
      });
    };
  }
  function pathToCrumbs(path) {
    var crumbs = [];
    var parts = path.split("/");
    var new_path = "";
    var _iterator2 = _createForOfIteratorHelper(parts),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var item = _step2.value;
        if (item === "") {
          continue;
        }
        new_path += "/" + item;
        crumbs.push({
          name: item,
          icon: "folder-close",
          path: new_path,
          onClick: clickFunc(new_path)
        });
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    return crumbs;
  }
  function renderBreadcrumb(props) {
    return /*#__PURE__*/_react["default"].createElement(PoolBreadcrumb, props);
  }
  var crumbs = pathToCrumbs(props.path);
  return /*#__PURE__*/_react["default"].createElement(_core.Breadcrumbs, {
    className: "pool-breadcrumbs",
    breadcrumbRenderer: renderBreadcrumb,
    items: crumbs
  });
}
function PoolMenubar(props) {
  var _useStateAndRef11 = (0, _utilities_react.useStateAndRef)(props.selected_resource.res_type),
    _useStateAndRef12 = _slicedToArray(_useStateAndRef11, 3),
    setSelectedType = _useStateAndRef12[1],
    selectedTypeRef = _useStateAndRef12[2];
  (0, _react.useEffect)(function () {
    setSelectedType(props.selected_resource.res_type);
  }, [props.selected_resource]);
  function context_menu_items() {
    return [];
  }
  function menu_specs() {
    return {
      Navigate: [{
        name_text: "Go Home",
        icon_name: "home",
        click_handler: props.setRootToBase
      }, {
        name_text: "Go to Folder",
        icon_name: "folder-shared-open",
        click_handler: function click_handler() {
          props.setRoot();
        },
        res_type: "poolDir"
      }],
      Inspect: [{
        name_text: "Copy Path",
        icon_name: "clipboard",
        click_handler: props.copy_func
      }, {
        name_text: "View As Text File",
        icon_name: "eye-open",
        click_handler: props.view_func
      }, {
        name_text: "Open in Notebook",
        icon_name: "code",
        click_handler: props.open_in_notebook_func
      }],
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
      Archive: [{
        name_text: "Compress Resource",
        icon_name: "archive",
        click_handler: props.compress_file
      }, {
        name_text: "Decompress Archive",
        icon_name: "unarchive",
        click_handler: props.decompress_archive
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
    selectedTypeRef: selectedTypeRef,
    selected_resource: props.selected_resource,
    resource_icon: _combined_metadata.icon_dict["pool"],
    menu_specs: menu_specs(),
    multi_select: props.multi_select,
    controlled: props.controlled,
    am_selected: props.am_selected,
    tsocket: props.tsocket,
    showRefresh: true,
    refreshTab: props.refreshFunc,
    closeTab: null,
    resource_name: ""
  });
}
PoolMenubar = /*#__PURE__*/(0, _react.memo)(PoolMenubar);
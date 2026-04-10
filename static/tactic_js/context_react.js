"use strict";

require("../tactic_css/tactic.scss");
require("../tactic_css/context.scss");
require("../tactic_css/tactic_table.scss");
require("../tactic_css/tactic_main.scss");
require("../tactic_css/library_home.scss");
require("../tactic_css/tile_creator.scss");
require("../tactic_css/resource_viewer.scss");
require("../tactic_css/themeable.scss");
var _react = _interopRequireWildcard(require("react"));
var _client = require("react-dom/client");
var _core = require("@blueprintjs/core");
var _utilities_react = require("./utilities_react");
var _tactic_socket = require("./tactic_socket");
var _TacticOmnibar = require("./TacticOmnibar");
var _communication_react = require("./communication_react");
var _toaster = require("./toaster");
var _blueprint_navbar = require("./blueprint_navbar");
var _error_boundary = require("./error_boundary");
var _library_home_react = require("./library_home_react");
var _pool_browser = require("./pool_browser");
var _pool_tree = require("./pool_tree");
var _module_viewer_react = require("./module_viewer_react");
var _tile_maker_react = require("./tile_maker_react");
var _tile_maker_support = require("./tile_maker_support");
var _main_app = require("./main_app");
var _main_support = require("./main_support");
var _notebook_app = require("./notebook_app");
var _notebook_support = require("./notebook_support");
var _code_viewer_react = require("./code_viewer_react");
var _list_viewer_react = require("./list_viewer_react");
var _text_viewer_react = require("./text_viewer_react");
var _error_drawer = require("./error_drawer");
var _resizing_allotment = require("./resizing_allotment");
var _property_list = require("./property_list");
var _assistant = require("./assistant");
var _metabook = require("./metabook");
var _sizing_tools = require("./sizing_tools");
var _settings = require("./settings");
var _context_elements = require("./context_elements");
var _modal_react = require("./modal_react");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorValues(e) { if (null != e) { var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"], r = 0; if (t) return t.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) return { next: function next() { return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }; } }; } throw new TypeError(_typeof(e) + " is not iterable"); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t7 in e) "default" !== _t7 && {}.hasOwnProperty.call(e, _t7) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t7)) && (i.get || i.set) ? o(f, _t7, i) : f[_t7] = e[_t7]); return f; })(e, t); } // noinspection XmlDeprecatedElement,JSXUnresolvedComponent
Promise.resolve().then(function () {
  return _interopRequireWildcard(require("../tactic_css/tactic_console.scss"));
});
_core.FocusStyleManager.onlyShowFocusOnTabs();
var spinner_panel = /*#__PURE__*/_react["default"].createElement("div", {
  style: {
    height: "100%",
    position: "absolute",
    top: "50%",
    left: "50%"
  },
  key: "spinner"
}, /*#__PURE__*/_react["default"].createElement(_core.Spinner, {
  size: 100
}));
var propDict = {
  "module-viewer": _module_viewer_react.module_viewer_props,
  "code-viewer": _code_viewer_react.code_viewer_props,
  "list-viewer": _list_viewer_react.list_viewer_props,
  "text-viewer": _text_viewer_react.text_viewer_props,
  "creator-viewer": _tile_maker_support.creator_props,
  "main-viewer": _main_support.main_props,
  "notebook-viewer": _notebook_support.notebook_props
};
var panelRootDict = {
  "module-viewer": "root",
  "code-viewer": "root",
  "list-viewer": "root",
  "text-viewer": "root",
  "creator-viewer": "creator-root",
  "main-viewer": "main-root",
  "notebook-viewer": "main-root"
};
window.global_id = "a" + (0, _utilities_react.guid)();
var tsocket = new _tactic_socket.TacticSocket("main", 5000, "context", window.global_id);
var classDict = {
  "module-viewer": _module_viewer_react.ModuleViewerApp,
  "code-viewer": _code_viewer_react.CodeViewerApp,
  "list-viewer": _list_viewer_react.ListViewerApp,
  "creator-viewer": _tile_maker_react.CreatorApp,
  "main-viewer": _main_app.MainApp,
  "notebook-viewer": _notebook_app.NotebookApp,
  "text-viewer": _text_viewer_react.TextViewerApp
};
var initialList = [{
  identifier: "library",
  title: "Library"
}];
if (window.has_pool) {
  initialList.push({
    identifier: "pool",
    title: "Pool"
  });
}
function _context_main() {
  var ContextAppPlus = (0, _utilities_react.withRegisterActivity)((0, _pool_tree.withPool)((0, _settings.withSettings)((0, _modal_react.withDialogs)((0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)((0, _assistant.withAssistant)(ContextApp)))))));
  var domContainer = document.querySelector('#context-root');
  var root = (0, _client.createRoot)(domContainer);
  root.render(/*#__PURE__*/_react["default"].createElement(ContextAppPlus, {
    tsocket: tsocket,
    local_id: window.global_id
  }));
}
function ContextApp(props) {
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)("library"),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    selectedTabId = _useStateAndRef2[0],
    setSelectedTabId = _useStateAndRef2[1],
    selectedTabIdRef = _useStateAndRef2[2];
  var _usePropertyListNoUnd = (0, _property_list.usePropertyListNoUndo)(initialList, 330, {}, false),
    _usePropertyListNoUnd2 = _slicedToArray(_usePropertyListNoUnd, 3),
    tabPanelList = _usePropertyListNoUnd2[0],
    tabPanelListDispatch = _usePropertyListNoUnd2[1],
    tabPanelListRef = _usePropertyListNoUnd2[2];
  var _useStateAndRef3 = (0, _utilities_react.useStateAndRef)([]),
    _useStateAndRef4 = _slicedToArray(_useStateAndRef3, 3),
    set_open_resources = _useStateAndRef4[1],
    open_resources_ref = _useStateAndRef4[2];
  var _useState = (0, _react.useState)({}),
    _useState2 = _slicedToArray(_useState, 2),
    dirty_methods = _useState2[0],
    set_dirty_methods = _useState2[1];
  var _useState3 = (0, _react.useState)({
      meta_id: null,
      visible: false,
      position: "right"
    }),
    _useState4 = _slicedToArray(_useState3, 2),
    metabookState = _useState4[0],
    setMetabookState = _useState4[1];
  var _useState5 = (0, _react.useState)(null),
    _useState6 = _slicedToArray(_useState5, 2),
    lastSelectedTabId = _useState6[0],
    setLastSelectedTabId = _useState6[1];
  var _useState7 = (0, _react.useState)(false),
    _useState8 = _slicedToArray(_useState7, 2),
    showOpenOmnibar = _useState8[0],
    setShowOpenOmnibar = _useState8[1];
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  var statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  var _useState9 = (0, _react.useState)(0),
    _useState0 = _slicedToArray(_useState9, 2),
    tabSelectCounter = _useState0[0],
    setTabSelectCounter = _useState0[1];
  var omniItemsRef = (0, _react.useRef)({});
  var top_ref = (0, _react.useRef)(null);
  var hotkeys = (0, _react.useMemo)(function () {
    return [{
      combo: "Tab",
      global: true,
      label: "Go To Next Pane",
      onKeyDown: _goToNextPane
    }, {
      combo: "Shift+Tab",
      global: true,
      label: "Go To Previous Pane",
      onKeyDown: _goToPreviousPane
    }, {
      combo: "Ctrl+Space",
      global: true,
      label: "Show Omnibar",
      onKeyDown: _showOpenOmnibar
    }, {
      combo: "Ctrl+W",
      global: true,
      label: "Close Tab",
      onKeyDown: function () {
        var _onKeyDown = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
          return _regenerator().w(function (_context) {
            while (1) switch (_context.n) {
              case 0:
                _context.n = 1;
                return _closeTab(selectedTabIdRef.current);
              case 1:
                return _context.a(2);
            }
          }, _callee);
        }));
        function onKeyDown() {
          return _onKeyDown.apply(this, arguments);
        }
        return onKeyDown;
      }()
    }];
  }, [_goToNextPane, _goToPreviousPane, _showOpenOmnibar, _closeTab, selectedTabIdRef.current]);
  var _useHotkeys = (0, _core.useHotkeys)(hotkeys),
    handleKeyDown = _useHotkeys.handleKeyDown,
    handleKeyUp = _useHotkeys.handleKeyUp;
  var pushCallback = (0, _utilities_react.useCallbackStack)("context");
  (0, _react.useEffect)(function () {
    _addContextOmniItems();
    errorDrawerFuncs.registerGoToModule(_goToModule);
  }, []);
  (0, _tactic_socket.useListeners)(props.tsocket, initSocket);
  (0, _react.useEffect)(function () {
    // for mount
    window.addEventListener("beforeunload", function (e) {
      e.preventDefault();
      e.returnValue = 'Are you sure you want to close? All changes will be lost.';
      (0, _communication_react.postWithCallback)("host", "end_client_session_task", {
        global_id: window.global_id,
        force_forward: true
      });
      tsocket.disconnect();
    });
  }, []);
  function _registerDirtyMethod(tab_id, dirty_method) {
    var new_dirty_methods = _objectSpread({}, dirty_methods);
    new_dirty_methods[tab_id] = dirty_method;
    set_dirty_methods(new_dirty_methods);
  }
  function initSocket(theSocket) {
    theSocket.attachListener("window-open", function (data) {
      window.open("".concat($SCRIPT_ROOT, "/load_temp_page/").concat(data["the_id"]));
    });
    theSocket.attachListener('close-user-windows', function (data) {
      if (!(data["originator"] === window.global_id)) {
        window.close();
      }
    });
    theSocket.attachListener("doFlashUser", function (data) {
      (0, _toaster.doFlash)(data);
    });
    theSocket.attachListener('handle-callback', function (task_packet) {
      (0, _communication_react.handleCallback)(task_packet, props.local_id);
    });
    theSocket.attachListener("endSession", function () {
      dialogFuncs.showModal("EndSessionDialog", {});
    });
  }
  function getItemFromdentifier(identifier) {
    var _iterator = _createForOfIteratorHelper(tabPanelListRef.current),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var item = _step.value;
        if (item.identifier === identifier) {
          return item;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return null;
  }
  function _refreshTab(_x) {
    return _refreshTab2.apply(this, arguments);
  }
  function _refreshTab2() {
    _refreshTab2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(the_id) {
      var item, title, confirm_text, old_tab_panel, resource_name, res_type, drmethod, data, _t2;
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.n) {
          case 0:
            if (!(the_id === "library")) {
              _context5.n = 1;
              break;
            }
            return _context5.a(2);
          case 1:
            _context5.p = 1;
            item = getItemFromdentifier(the_id);
            title = item.title;
            if (!(!(the_id in dirty_methods) || dirty_methods[the_id]())) {
              _context5.n = 2;
              break;
            }
            confirm_text = "Are you sure that you want to reload the tab ".concat(title, "? Changes will be lost");
            _context5.n = 2;
            return dialogFuncs.showModalPromise("ConfirmDialog", {
              title: "Reload the tab ".concat(title),
              text_body: confirm_text,
              cancel_text: "do nothing",
              submit_text: "reload",
              handleClose: dialogFuncs.hideModal
            });
          case 2:
            old_tab_panel = _objectSpread({}, item);
            resource_name = old_tab_panel.panel.resource_name;
            drmethod = function drmethod(dmethod) {
              _registerDirtyMethod(the_id, dmethod);
            };
            if (old_tab_panel.kind === "notebook-viewer" && !old_tab_panel.panel.is_project) {
              res_type = "new-notebook";
              // data = await postPromise("host", "initiate_new_notebook_in_context", {})
            } else if (old_tab_panel.kind === "main-viewer" && !old_tab_panel.panel.is_project && old_tab_panel.panel.original_res_type != "collection") {
              res_type = "new-project";
              // data = await postPromise("host", "initiate_new_project_in_context", {})
            } else {
              res_type = old_tab_panel.panel.original_res_type;
            }
            _context5.n = 3;
            return getViewerDataForResSocket(res_type, resource_name, null, old_tab_panel.panel.file_path);
          case 3:
            data = _context5.v;
            _context5.n = 4;
            return _updatePanelPromise(the_id, {
              panel: "spinner"
            });
          case 4:
            propDict[data.kind](data, drmethod, function (new_panel) {
              new_panel.original_res_type = res_type;
              _updatePanel(the_id, {
                panel: new_panel,
                kind: data.kind
              });
            });
            _context5.n = 6;
            break;
          case 5:
            _context5.p = 5;
            _t2 = _context5.v;
            if (String(_t2) !== "canceled") {
              errorDrawerFuncs.addFromError("Error refreshing pane", _t2);
            }
          case 6:
            return _context5.a(2);
        }
      }, _callee5, null, [[1, 5]]);
    }));
    return _refreshTab2.apply(this, arguments);
  }
  function getViewerDataForResSocket(res_type, resource_name) {
    var temp_data_id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var file_path = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var new_viewer_id = "a" + (0, _utilities_react.guid)();
    return new Promise(function (resolve) {
      var tsocket = new _tactic_socket.TacticSocket("main", 5000, resource_name, new_viewer_id, /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              tsocket.attachListener('handle-callback', function (task_packet) {
                (0, _communication_react.handleCallback)(task_packet, new_viewer_id);
              });
              _context2.n = 1;
              return getViewerDataForRes(res_type, resource_name, tsocket, new_viewer_id, temp_data_id, file_path, resolve);
            case 1:
              return _context2.a(2);
          }
        }, _callee2);
      })));
    });
  }
  function getViewerDataForRes(_x2, _x3, _x4, _x5) {
    return _getViewerDataForRes.apply(this, arguments);
  }
  function _getViewerDataForRes() {
    _getViewerDataForRes = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(res_type, resource_name, tsocket, new_viewer_id) {
      var temp_data_id,
        file_path,
        resolve,
        data,
        ls_result,
        last_saved,
        _args6 = arguments,
        _t3;
      return _regenerator().w(function (_context6) {
        while (1) switch (_context6.n) {
          case 0:
            temp_data_id = _args6.length > 4 && _args6[4] !== undefined ? _args6[4] : null;
            file_path = _args6.length > 5 && _args6[5] !== undefined ? _args6[5] : null;
            resolve = _args6.length > 6 && _args6[6] !== undefined ? _args6[6] : null;
            if (!["list", "code", "text"].includes(res_type)) {
              _context6.n = 1;
              break;
            }
            data = {
              kind: "".concat(res_type, "-viewer"),
              resource_name: file_path == null ? resource_name : (0, _pool_tree.getBasename)(file_path),
              res_type: res_type,
              local_id: new_viewer_id,
              file_path: file_path
            };
            _context6.n = 24;
            break;
          case 1:
            _t3 = res_type;
            _context6.n = _t3 === "raw-tile" ? 2 : _t3 === "creator-tile" ? 3 : _t3 === "tile" ? 5 : _t3 === "collection" ? 10 : _t3 === "project" ? 12 : _t3 === "new-notebook" ? 14 : _t3 === "new-project" ? 19 : _t3 === "text" ? 21 : 23;
            break;
          case 2:
            data = {
              kind: "module-viewer",
              resource_name: resource_name,
              res_type: "tile",
              original_res_type: "raw-tile",
              local_id: new_viewer_id
            };
            return _context6.a(3, 24);
          case 3:
            _context6.n = 4;
            return (0, _communication_react.postPromise)("host", "initiate_creator_in_context", {
              tile_module_name: resource_name,
              local_id: new_viewer_id,
              global_id: window.global_id
            });
          case 4:
            data = _context6.v;
            return _context6.a(3, 24);
          case 5:
            _context6.n = 6;
            return (0, _communication_react.postPromise)("host", "get_last_saved_task", {
              tile_module_name: resource_name
            });
          case 6:
            ls_result = _context6.v;
            last_saved = ls_result.last_saved;
            if (!(last_saved == "creator")) {
              _context6.n = 8;
              break;
            }
            _context6.n = 7;
            return (0, _communication_react.postPromise)("host", "initiate_creator_in_context", {
              tile_module_name: resource_name,
              local_id: new_viewer_id,
              global_id: window.global_id
            });
          case 7:
            data = _context6.v;
            _context6.n = 9;
            break;
          case 8:
            data = {
              kind: "module-viewer",
              resource_name: resource_name,
              res_type: "tile",
              original_res_type: "raw-tile",
              local_id: new_viewer_id
            };
          case 9:
            console.log("got data for tile", data);
            return _context6.a(3, 24);
          case 10:
            _context6.n = 11;
            return (0, _communication_react.postPromise)("main_service", "initialize_session_from_collection", {
              collection_name: resource_name,
              base_figure_url: window.base_figure_url,
              global_id: window.global_id,
              local_id: new_viewer_id,
              username: window.username,
              ppi: (0, _utilities_react.get_ppi)()
            });
          case 11:
            data = _context6.v;
            return _context6.a(3, 24);
          case 12:
            _context6.n = 13;
            return (0, _communication_react.postPromise)("main_service", "initialize_session_from_save", {
              project_name: resource_name,
              base_figure_url: window.base_figure_url,
              global_id: window.global_id,
              local_id: new_viewer_id,
              username: window.username,
              ppi: (0, _utilities_react.get_ppi)()
            });
          case 13:
            data = _context6.v;
            return _context6.a(3, 24);
          case 14:
            if (!temp_data_id) {
              _context6.n = 16;
              break;
            }
            _context6.n = 15;
            return (0, _communication_react.postPromise)("main_service", "initialize_session_for_new_notebook", {
              temp_data_id: temp_data_id,
              local_id: new_viewer_id,
              global_id: window.global_id,
              username: window.username,
              ppi: (0, _utilities_react.get_ppi)()
            });
          case 15:
            data = _context6.v;
            _context6.n = 18;
            break;
          case 16:
            _context6.n = 17;
            return (0, _communication_react.postPromise)("main_service", "initialize_session_for_new_notebook", {
              base_figure_url: window.base_figure_url,
              global_id: window.global_id,
              local_id: new_viewer_id,
              username: window.username,
              ppi: (0, _utilities_react.get_ppi)()
            });
          case 17:
            data = _context6.v;
          case 18:
            return _context6.a(3, 24);
          case 19:
            _context6.n = 20;
            return (0, _communication_react.postPromise)("main_service", "initialize_session_for_new_project", {
              base_figure_url: window.base_figure_url,
              global_id: window.global_id,
              local_id: new_viewer_id,
              username: window.username,
              ppi: (0, _utilities_react.get_ppi)()
            });
          case 20:
            data = _context6.v;
            return _context6.a(3, 24);
          case 21:
            _context6.n = 22;
            return (0, _communication_react.postPromise)("host", "initiate_text_viewer_in_context", {
              "file_path": file_path
            });
          case 22:
            data = _context6.v;
            return _context6.a(3, 24);
          case 23:
            data = {};
          case 24:
            data.original_res_type = res_type;
            data.file_path = file_path;
            data.tsocket = tsocket;
            data.read_only = false;
            data.is_repository = false;
            if (!resolve) {
              _context6.n = 25;
              break;
            }
            resolve(data);
            _context6.n = 26;
            break;
          case 25:
            return _context6.a(2, data);
          case 26:
            return _context6.a(2);
        }
      }, _callee6);
    }));
    return _getViewerDataForRes.apply(this, arguments);
  }
  function _closeTab(_x6) {
    return _closeTab2.apply(this, arguments);
  }
  function _closeTab2() {
    _closeTab2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(the_id) {
      var item, title, confirm_text, copied_dirty_methods, _t4;
      return _regenerator().w(function (_context7) {
        while (1) switch (_context7.n) {
          case 0:
            if (!(the_id === "library")) {
              _context7.n = 1;
              break;
            }
            return _context7.a(2);
          case 1:
            item = getItemFromdentifier(the_id);
            _context7.p = 2;
            if (!(!(the_id in dirty_methods) || dirty_methods[the_id]())) {
              _context7.n = 3;
              break;
            }
            title = item.title;
            confirm_text = "Are you sure that you want to close the tab ".concat(title, "? Changes will be lost");
            _context7.n = 3;
            return dialogFuncs.showModalPromise("ConfirmDialog", {
              title: "Close the tab ".concat(title, "\""),
              text_body: confirm_text,
              cancel_text: "do nothing",
              submit_text: "close",
              handleClose: dialogFuncs.hideModal
            });
          case 3:
            tabPanelListDispatch({
              type: "delete_item",
              identifier: the_id
            });
            copied_dirty_methods = _objectSpread({}, dirty_methods);
            delete copied_dirty_methods[the_id];
            set_dirty_methods(copied_dirty_methods);
            if (the_id in omniItemsRef.current) {
              delete omniItemsRef.current[the_id];
            }
            pushCallback(function () {
              if (the_id === selectedTabIdRef.current) {
                var newSelectedId;
                if (lastSelectedTabId && getItemFromdentifier(lastSelectedTabId)) {
                  newSelectedId = lastSelectedTabId;
                } else {
                  newSelectedId = "library";
                }
                setSelectedTabId(newSelectedId);
                setLastSelectedTabId("library");
              } else {
                setSelectedTabId(selectedTabId);
                if (lastSelectedTabId === the_id) {
                  setLastSelectedTabId("library");
                }
              }
            });
            _context7.n = 5;
            break;
          case 4:
            _context7.p = 4;
            _t4 = _context7.v;
            if (_t4 !== "canceled") {
              errorDrawerFuncs.addFromError("Error closing tab", _t4);
            }
          case 5:
            return _context7.a(2);
        }
      }, _callee7, null, [[2, 4]]);
    }));
    return _closeTab2.apply(this, arguments);
  }
  function _addPanel(new_id, viewer_kind, res_type, title, new_panel) {
    var callback = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
    var data = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;
    new_panel = {
      kind: viewer_kind,
      res_type: res_type,
      title: title,
      panel: new_panel,
      data: data,
      identifier: new_id
    };
    tabPanelListDispatch({
      type: "add_at_end",
      new_item: new_panel
    });
    setLastSelectedTabId(selectedTabIdRef.current);
    setSelectedTabId(new_id);
    pushCallback(function () {
      _updateOpenResources(callback);
    });
  }
  function _addPanelPromise(new_id, viewer_kind, res_type, title, new_panel) {
    var data = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
    return new Promise(function (resolve) {
      _addPanel(new_id, viewer_kind, res_type, title, new_panel, resolve, data);
    });
  }
  function _updatePanel(the_id, new_panel) {
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var lnew_panel = getItemFromdentifier(the_id);
    for (var k in new_panel) {
      if (k !== "panel") {
        lnew_panel[k] = new_panel[k];
      }
    }
    if ("panel" in new_panel) {
      if (new_panel.panel === "spinner") {
        lnew_panel.panel = "spinner";
      } else if (lnew_panel.panel !== "spinner") {
        lnew_panel.panel = _objectSpread(_objectSpread({}, lnew_panel.panel), new_panel.panel);
      } else {
        lnew_panel.panel = new_panel.panel;
      }
    }
    tabPanelListDispatch({
      type: "update_item",
      identifier: the_id,
      new_item: lnew_panel
    });
    pushCallback(function () {
      _updateOpenResources(callback);
    });
  }
  function _updatePanelPromise(the_id, new_panel) {
    return new Promise(function (resolve) {
      _updatePanel(the_id, new_panel, resolve);
    });
  }
  function _changeResourceName(the_id, new_name) {
    var change_title = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var lnew_panel = _objectSpread({}, getItemFromdentifier(the_id));
    if (change_title) {
      lnew_panel.title = new_name;
    }
    lnew_panel.panel.resource_name = new_name;
    tabPanelListDispatch({
      type: "update_item",
      identifier: the_id,
      new_item: lnew_panel
    });
    pushCallback(function () {
      _updateOpenResources(callback);
    });
  }
  function isStandardTab(entry) {
    return ["library", "pool"].includes(entry.identifier);
  }
  function _getResourceId(res_name, res_type) {
    var _iterator2 = _createForOfIteratorHelper(tabPanelListRef.current),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var the_panel = _step2.value;
        if (isStandardTab(the_panel)) {
          continue;
        }
        if (the_panel.panel.resource_name === res_name && the_panel.res_type === res_type) {
          return the_panel.identifier;
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    return -1;
  }
  function _showOpenOmnibar() {
    setShowOpenOmnibar(true);
  }
  function _closeOpenOmnibar() {
    setShowOpenOmnibar(false);
  }
  function _setCurrentMetabook(meta_id) {
    setMetabookState({
      meta_id: meta_id,
      visible: true
    });
  }
  var handleCreateViewer = (0, _react.useCallback)(/*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(res_type, resource_name) {
      var callback,
        temp_data_id,
        file_path,
        existing_id,
        new_id,
        drmethod,
        data,
        _args3 = arguments;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.n) {
          case 0:
            callback = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : null;
            temp_data_id = _args3.length > 3 && _args3[3] !== undefined ? _args3[3] : null;
            file_path = _args3.length > 4 && _args3[4] !== undefined ? _args3[4] : null;
            existing_id = _getResourceId(resource_name, resource_name);
            if (!(existing_id !== -1)) {
              _context3.n = 1;
              break;
            }
            setSelectedTabId(existing_id);
            pushCallback(callback);
            return _context3.a(2);
          case 1:
            new_id = "a" + (0, _utilities_react.guid)();
            drmethod = function drmethod(dmethod) {
              _registerDirtyMethod(new_id, dmethod);
            };
            _context3.n = 2;
            return getViewerDataForResSocket(res_type, resource_name, temp_data_id, file_path);
          case 2:
            data = _context3.v;
            _context3.n = 3;
            return _addPanelPromise(new_id, data.kind, data.res_type, data.resource_name, "spinner");
          case 3:
            propDict[data.kind](data, drmethod, function (new_panel) {
              new_panel.original_res_type = res_type;
              if (callback != null) {
                _updatePanel(new_id, {
                  panel: new_panel
                }, function () {
                  callback(data.local_id);
                });
              } else {
                _updatePanel(new_id, {
                  panel: new_panel
                });
              }
            });
          case 4:
            return _context3.a(2);
        }
      }, _callee3);
    }));
    return function (_x7, _x8) {
      return _ref2.apply(this, arguments);
    };
  }(), []);
  function getIdList() {
    return tabPanelListRef.current.map(function (item) {
      return item.identifier;
    });
  }
  function _goToNextPane(e) {
    var templist = getIdList();
    var newId;
    var tabIndex = templist.indexOf(selectedTabIdRef.current) + 1;
    newId = tabIndex === templist.length ? "library" : templist[tabIndex];
    _handleTabSelect(newId);
    if (e) {
      e.preventDefault();
    }
  }
  function _goToPreviousPane(e) {
    var templist = getIdList();
    var tabIndex = templist.indexOf(selectedTabIdRef.current) - 1;
    var newId = tabIndex === -1 ? templist.at(-1) : templist[tabIndex];
    _handleTabSelect(newId);
    if (e) {
      e.preventDefault();
    }
  }
  function _handleTabSelect(newTabId) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    setSelectedTabId(newTabId);
    setLastSelectedTabId(selectedTabIdRef.current);
    pushCallback(function () {
      setTabSelectCounter(tabSelectCounter + 1);
      if (callback) {
        callback();
      }
    });
  }
  function _goToModule(_x9, _x0) {
    return _goToModule2.apply(this, arguments);
  }
  function _goToModule2() {
    _goToModule2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(module_name, line_number) {
      var _iterator5, _step5, _loop, _ret, data, _new_id, drmethod, _t5, _t6;
      return _regenerator().w(function (_context9) {
        while (1) switch (_context9.n) {
          case 0:
            _iterator5 = _createForOfIteratorHelper(tabPanelListRef.current);
            _context9.p = 1;
            _loop = /*#__PURE__*/_regenerator().m(function _loop() {
              var pdict;
              return _regenerator().w(function (_context8) {
                while (1) switch (_context8.n) {
                  case 0:
                    pdict = _step5.value;
                    if (!(pdict.kind === "creator-viewer" && pdict.panel.resource_name === module_name)) {
                      _context8.n = 1;
                      break;
                    }
                    _handleTabSelect(pdict.identifier, function () {
                      if ("line_setter" in pdict) {
                        pdict.line_setter(line_number);
                      }
                    });
                    return _context8.a(2, {
                      v: void 0
                    });
                  case 1:
                    return _context8.a(2);
                }
              }, _loop);
            });
            _iterator5.s();
          case 2:
            if ((_step5 = _iterator5.n()).done) {
              _context9.n = 5;
              break;
            }
            return _context9.d(_regeneratorValues(_loop()), 3);
          case 3:
            _ret = _context9.v;
            if (!_ret) {
              _context9.n = 4;
              break;
            }
            return _context9.a(2, _ret.v);
          case 4:
            _context9.n = 2;
            break;
          case 5:
            _context9.n = 7;
            break;
          case 6:
            _context9.p = 6;
            _t5 = _context9.v;
            _iterator5.e(_t5);
          case 7:
            _context9.p = 7;
            _iterator5.f();
            return _context9.f(7);
          case 8:
            _context9.p = 8;
            _context9.n = 9;
            return getViewerDataForResSocket("tile", module_name);
          case 9:
            data = _context9.v;
            _new_id = "".concat(data.kind, ": ").concat(data.resource_name);
            drmethod = function drmethod(dmethod) {
              _registerDirtyMethod(_new_id, dmethod);
            };
            _context9.n = 10;
            return _addPanelPromise(_new_id, data.kind, data.res_type, data.resource_name, "spinner");
          case 10:
            propDict[data.kind](data, drmethod, function (new_panel) {
              new_panel.original_res_type = "tile";
              _updatePanel(_new_id, {
                panel: new_panel
              });
            });
            _context9.n = 12;
            break;
          case 11:
            _context9.p = 11;
            _t6 = _context9.v;
            errorDrawerFuncs.addFromError("Error going to module ".concat(module_name), _t6);
          case 12:
            return _context9.a(2);
        }
      }, _callee8, null, [[8, 11], [1, 6, 7, 8]]);
    }));
    return _goToModule2.apply(this, arguments);
  }
  function _registerLineSetter(tab_id, rfunc) {
    _updatePanel(tab_id, {
      line_setter: rfunc
    });
  }
  function _getOpenResources() {
    var open_resources = [];
    var _iterator3 = _createForOfIteratorHelper(tabPanelListRef.current),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var entry = _step3.value;
        if (!isStandardTab(entry) && entry.panel !== "spinner") {
          open_resources.push({
            id: entry.identifier,
            resource_name: entry.panel.resource_name,
            res_type: entry.res_type,
            local_id: entry.panel.local_id
          });
        }
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
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
    for (var _i = 0, _omni_funcs = omni_funcs; _i < _omni_funcs.length; _i++) {
      var item = _omni_funcs[_i];
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
  function amSelected(ltab_id, lselectedTabIdRef) {
    return !window.in_context || ltab_id === lselectedTabIdRef.current;
  }
  var library_panel = /*#__PURE__*/_react["default"].createElement(_utilities_react.SelectedPaneContext.Provider, {
    key: "library",
    value: {
      tab_id: "library",
      selectedTabIdRef: selectedTabIdRef,
      amSelected: amSelected,
      addOmniItems: function addOmniItems(items) {
        _addOmniItems("libary", items);
      }
    }
  }, /*#__PURE__*/_react["default"].createElement(_context_elements.ContextPaneElement, {
    identifier: "library"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    id: "library-home-root",
    style: {
      display: "flex",
      flexDirection: "column",
      position: "relative",
      height: "100%",
      width: "100%"
    }
  }, /*#__PURE__*/_react["default"].createElement(_library_home_react.LibraryHomeApp, {
    tsocket: tsocket,
    library_style: window.library_style,
    controlled: true,
    am_selected: selectedTabIdRef.current === "library",
    open_resources_ref: open_resources_ref,
    handleCreateViewer: handleCreateViewer,
    setCurrentMetabook: _setCurrentMetabook
  }))));
  var all_panels = [library_panel];
  if (window.has_pool) {
    var pool_panel = /*#__PURE__*/_react["default"].createElement(_utilities_react.SelectedPaneContext.Provider, {
      key: "pool",
      value: {
        tab_id: "pool",
        selectedTabIdRef: selectedTabIdRef,
        amSelected: amSelected,
        addOmniItems: function addOmniItems(items) {
          _addOmniItems("pool", items);
        }
      }
    }, /*#__PURE__*/_react["default"].createElement(_context_elements.ContextPaneElement, {
      identifier: "pool"
    }, /*#__PURE__*/_react["default"].createElement(_pool_browser.PoolBrowser, {
      tsocket: tsocket,
      am_selected: selectedTabIdRef.current === "pool",
      getOpenResources: _getOpenResources,
      setSelectedTabId: setSelectedTabId,
      handleCreateViewer: handleCreateViewer
    })));
    all_panels.push(pool_panel);
  }
  var _omni_view_func = (0, _react.useCallback)(/*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(item) {
      var _t;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.n) {
          case 0:
            statusFuncs.setStatus({
              show_spinner: true,
              status_message: "Opening ..."
            });
            if (!window.in_context) {
              _context4.n = 5;
              break;
            }
            _context4.p = 1;
            _context4.n = 2;
            return handleCreateViewer(item.res_type, item.name, statusFuncs.clearStatus);
          case 2:
            _context4.n = 4;
            break;
          case 3:
            _context4.p = 3;
            _t = _context4.v;
            statusFuncs.clearStatus();
            errorDrawerFuncs.addFromError("Error following ".concat(the_view), _t);
          case 4:
            _context4.n = 6;
            break;
          case 5:
            statusFuncs.clearStatus();
            window.open($SCRIPT_ROOT + the_view + item.name);
          case 6:
            return _context4.a(2);
        }
      }, _callee4, null, [[1, 3]]);
    }));
    return function (_x1) {
      return _ref3.apply(this, arguments);
    };
  }(), []);
  var _iterator4 = _createForOfIteratorHelper(tabPanelListRef.current),
    _step4;
  try {
    var _loop2 = function _loop2() {
      var entry = _step4.value;
      var wrapped_panel;
      if (["library", "pool"].includes(entry.identifier)) {
        return 1; // continue
      }
      if (entry.panel === "spinner") {
        wrapped_panel = spinner_panel;
      } else {
        var TheClass = classDict[entry.kind];
        var the_panel = /*#__PURE__*/_react["default"].createElement(_utilities_react.SelectedPaneContext.Provider, {
          value: {
            tab_id: entry.identifier,
            selectedTabIdRef: selectedTabIdRef,
            amSelected: amSelected,
            addOmniItems: function addOmniItems(items) {
              _addOmniItems(entry.identifier, items);
            }
          }
        }, /*#__PURE__*/_react["default"].createElement(_context_elements.ContextPaneElement, {
          identifier: entry.identifier
        }, /*#__PURE__*/_react["default"].createElement(TheClass, _extends({}, entry.panel, {
          controlled: true,
          handleCreateViewer: handleCreateViewer,
          tab_id: entry.identifier,
          selectedTabIdRef: selectedTabIdRef,
          changeResourceName: function changeResourceName(new_name) {
            var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            var change_title = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
            _changeResourceName(entry.identifier, new_name, change_title, callback);
          },
          updatePanel: function updatePanel(new_panel) {
            var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            _updatePanel(entry.identifier, new_panel, callback);
          },
          goToModule: _goToModule,
          registerLineSetter: function registerLineSetter(rfunc) {
            return _registerLineSetter(entry.identifier, rfunc);
          },
          refreshTab: /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9() {
            return _regenerator().w(function (_context0) {
              while (1) switch (_context0.n) {
                case 0:
                  _context0.n = 1;
                  return _refreshTab(entry.identifier);
                case 1:
                  return _context0.a(2);
              }
            }, _callee9);
          })),
          closeTab: /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0() {
            return _regenerator().w(function (_context1) {
              while (1) switch (_context1.n) {
                case 0:
                  _context1.n = 1;
                  return _closeTab(entry.identifier);
                case 1:
                  return _context1.a(2);
              }
            }, _callee0);
          })),
          tsocket: entry.panel.tsocket
        }))));
        wrapped_panel = /*#__PURE__*/_react["default"].createElement(_react.Fragment, {
          key: entry.identifier
        }, /*#__PURE__*/_react["default"].createElement(_error_boundary.ErrorBoundary, null, /*#__PURE__*/_react["default"].createElement("div", {
          id: "".concat(entry.identifier, "-holder"),
          style: {
            display: "flex",
            flexDirection: "column",
            position: "relative",
            height: selectedTabIdRef.current == entry.identifier ? "100%" : 0,
            width: "100%"
          },
          className: panelRootDict[entry.kind]
        }, the_panel)));
      }
      all_panels.push(wrapped_panel);
    };
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      if (_loop2()) continue;
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }
  var sid = selectedTabIdRef.current;
  var commandItems = omniItemsRef.current["global"];
  if (sid in omniItemsRef.current) {
    commandItems = commandItems.concat(omniItemsRef.current[sid]);
  }
  var left_pane = /*#__PURE__*/_react["default"].createElement(_context_elements.ContextNavigator, {
    handleTabSelect: _handleTabSelect,
    selectedItem: selectedTabIdRef.current,
    closeTab: _closeTab,
    refreshTab: _refreshTab,
    dispatch: tabPanelListDispatch,
    pushCallback: pushCallback,
    tabPanelList: tabPanelList
  });
  var right_main_panes = /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, all_panels);
  var right_pane;
  if (metabookState.visible) {
    var right_metabook_pane = /*#__PURE__*/_react["default"].createElement(_metabook.Metabook, _extends({}, metabookState, {
      tsocket: tsocket
    }));
    right_pane = /*#__PURE__*/_react["default"].createElement(_resizing_allotment.HorizontalPanes, {
      left_pane: right_main_panes,
      snap_left: true,
      minWidth: 100,
      right_pane: right_metabook_pane,
      show_handle: true,
      widths: [window.innerWidth - _sizing_tools.INIT_CONTEXT_PANEL_WIDTH - 200, 200],
      handleResizeEnd: null
    });
  } else {
    right_pane = right_main_panes;
  }
  var outer_class = "pane-holder ".concat(settingsContext.isDark() ? "bp6-dark" : "light-theme");
  var outer_style = {
    width: "100%",
    height: "100%",
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: 0,
    position: "relative"
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      position: "relative",
      height: "100%",
      width: "100%"
    }
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    selected: null,
    show_api_links: false,
    extra_text: window.database_type === "Local" ? "" : window.database_type,
    user_name: window.username
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: outer_class,
    tabIndex: "0",
    style: outer_style,
    ref: top_ref,
    id: "context-container",
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp
  }, /*#__PURE__*/_react["default"].createElement(_resizing_allotment.HorizontalPanes, {
    left_pane: left_pane,
    snap_left: true,
    minWidth: 100,
    right_pane: right_pane,
    show_handle: true,
    widths: [_sizing_tools.INIT_CONTEXT_PANEL_WIDTH, window.innerWidth - _sizing_tools.INIT_CONTEXT_PANEL_WIDTH],
    initial_width_fraction: .1,
    handleResizeEnd: null
  })), /*#__PURE__*/_react["default"].createElement(_utilities_react.SelectedPaneContext.Provider, {
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
    local_id: props.local_id,
    showOmnibar: showOpenOmnibar,
    openFunc: _omni_view_func,
    is_authenticated: window.is_authenticated,
    closeOmnibar: _closeOpenOmnibar
  })));
}
_context_main();
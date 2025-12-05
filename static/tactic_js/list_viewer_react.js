"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListViewerApp = ListViewerApp;
exports.list_viewer_props = list_viewer_props;
var _react = _interopRequireWildcard(require("react"));
var _client = require("react-dom/client");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
var _resource_viewer_react_app = require("./resource_viewer_react_app");
var _tactic_socket = require("./tactic_socket");
var _communication_react = require("./communication_react");
var _toaster = require("./toaster");
var _assistant = require("./assistant");
var _settings = require("./settings");
var _error_drawer = require("./error_drawer");
var _utilities_react = require("./utilities_react");
var _blueprint_navbar = require("./blueprint_navbar");
var _modal_react = require("./modal_react");
var _sizing_tools = require("./sizing_tools");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
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
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t3 in e) "default" !== _t3 && {}.hasOwnProperty.call(e, _t3) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t3)) && (i.get || i.set) ? o(f, _t3, i) : f[_t3] = e[_t3]); return f; })(e, t); }
if (!window.in_context) {
  Promise.resolve().then(function () {
    return _interopRequireWildcard(require("../tactic_css/tactic.scss"));
  });
  Promise.resolve().then(function () {
    return _interopRequireWildcard(require("../tactic_css/resource_viewer.scss"));
  });
  Promise.resolve().then(function () {
    return _interopRequireWildcard(require("../tactic_css/themeable.scss"));
  });
}
function list_viewer_props(data, registerDirtyMethod, finalCallback) {
  if (!window.in_context) {
    window.global_id = data.local_id;
  }
  finalCallback({
    local_id: data.local_id,
    tsocket: data.tsocket,
    created: "",
    resource_name: data.resource_name,
    the_content: [],
    readOnly: data.read_only,
    is_repository: data.is_repository,
    registerDirtyMethod: registerDirtyMethod
  });
}
function ListEditor(props) {
  var top_ref = (0, _react.useRef)(null);
  var tastyle = {
    resize: "horizontal",
    flexGrow: 1
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "listarea-container",
    ref: top_ref,
    style: {
      display: "flex",
      height: "100%"
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.TextArea, {
    cols: "50",
    style: tastyle,
    disabled: props.readOnly,
    onChange: props.handleChange,
    value: props.the_content
  }));
}
ListEditor = /*#__PURE__*/(0, _react.memo)(ListEditor);
ListEditor.propTypes = {
  the_content: _propTypes["default"].string,
  handleChange: _propTypes["default"].func,
  readOnly: _propTypes["default"].bool,
  height: _propTypes["default"].number
};
function ListViewerApp(props) {
  props = _objectSpread({
    controlled: false,
    changeResourceName: null,
    updatePanel: null,
    refreshTab: null,
    closeTab: null
  }, props);
  var top_ref = (0, _react.useRef)(null);
  var savedContent = (0, _react.useRef)();
  var initialized = (0, _react.useRef)(false);
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)(""),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    list_content = _useStateAndRef2[0],
    set_list_content = _useStateAndRef2[1],
    list_content_ref = _useStateAndRef2[2];
  var _useState = (0, _react.useState)(props.resource_name),
    _useState2 = _slicedToArray(_useState, 2),
    resource_name = _useState2[0],
    set_resource_name = _useState2[1];
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  var statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  var selectedPane = (0, _react.useContext)(_utilities_react.SelectedPaneContext);
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  (0, _react.useEffect)(function () {
    statusFuncs.stopSpinner();
    if (props.controlled) {
      props.registerDirtyMethod(_dirty);
      // This postPromise can't go to the local stack because it's not ready in time
    }
    (0, _communication_react.postPromise)("host", "get_list_content_with_metadata_task", {
      "list_name": props.resource_name
    }).then(function (data) {
      var the_list = data["the_list"];
      var metadata = data["metadata"];
      set_list_content(the_list);
      savedContent.current = the_list;
      initialized.current = true;
    });
  }, []);
  var pushCallback = (0, _utilities_react.useCallbackStack)("list_viewer");
  var hotkeys = (0, _react.useMemo)(function () {
    return [{
      combo: "Ctrl+S",
      global: false,
      group: "Module Viewer",
      label: "Save Code",
      onKeyDown: _saveMe
    }];
  }, [_saveMe]);
  var _useHotkeys = (0, _core.useHotkeys)(hotkeys),
    handleKeyDown = _useHotkeys.handleKeyDown,
    handleKeyUp = _useHotkeys.handleKeyUp;
  (0, _react.useEffect)(function () {
    if (!props.controlled) {
      window.addEventListener("beforeunload", function (e) {
        if (_dirty()) {
          e.preventDefault();
        }
        (0, _communication_react.postWithCallback)("host", "end_client_session_task", {
          global_id: window.global_id,
          force_forward: true
        });
      });
    }
  }, []);
  function cPropGetters() {
    return {
      resource_name: resource_name
    };
  }
  function _cProp(pname) {
    return props.controlled ? props[pname] : cPropGetters()[pname];
  }
  function menu_specs() {
    var ms;
    if (props.is_repository) {
      ms = {
        Transfer: [{
          "name_text": "Copy to library",
          "icon_name": "import",
          "click_handler": function () {
            var _click_handler = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
              return _regenerator().w(function (_context) {
                while (1) switch (_context.n) {
                  case 0:
                    _context.n = 1;
                    return (0, _resource_viewer_react_app.copyToLibrary)("list", _cProp("resource_name"), dialogFuncs, statusFuncs, errorDrawerFuncs);
                  case 1:
                    return _context.a(2);
                }
              }, _callee);
            }));
            function click_handler() {
              return _click_handler.apply(this, arguments);
            }
            return click_handler;
          }(),
          tooltip: "Copy to library"
        }]
      };
    } else {
      ms = {
        Save: [{
          name_text: "Save",
          icon_name: "saved",
          click_handler: _saveMe,
          key_bindings: ['Ctrl+S'],
          tooltip: "Save"
        }, {
          name_text: "Save As...",
          icon_name: "floppy-disk",
          click_handler: _saveMeAs,
          tooltip: "Save as"
        }],
        Transfer: [{
          name_text: "Share",
          icon_name: "share",
          click_handler: function () {
            var _click_handler2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
              return _regenerator().w(function (_context2) {
                while (1) switch (_context2.n) {
                  case 0:
                    _context2.n = 1;
                    return (0, _resource_viewer_react_app.sendToRepository)("list", _cProp("resource_name"), dialogFuncs, statusFuncs, errorDrawerFuncs);
                  case 1:
                    return _context2.a(2);
                }
              }, _callee2);
            }));
            function click_handler() {
              return _click_handler2.apply(this, arguments);
            }
            return click_handler;
          }(),
          tooltip: "Share to repository"
        }]
      };
    }
    for (var _i = 0, _Object$entries = Object.entries(ms); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        menu = _Object$entries$_i[1];
      var _iterator = _createForOfIteratorHelper(menu),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var but = _step.value;
          but.click_handler = but.click_handler.bind(this);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
    return ms;
  }
  function _setResourceNameState(new_name) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    if (props.controlled) {
      props.changeResourceName(new_name, callback);
    } else {
      set_resource_name(new_name);
      pushCallback(callback);
    }
  }
  function _handleListChange(event) {
    set_list_content(event.target.value);
  }
  function am_selected() {
    return selectedPane.amSelected(selectedPane.tab_id, selectedPane.selectedTabIdRef);
  }
  function _saveMe() {
    return _saveMe2.apply(this, arguments);
  }
  function _saveMe2() {
    _saveMe2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
      var new_list_as_string, result_dict, _t;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.n) {
          case 0:
            if (am_selected()) {
              _context3.n = 1;
              break;
            }
            return _context3.a(2, false);
          case 1:
            new_list_as_string = list_content_ref.current;
            result_dict = {
              "list_name": _cProp("resource_name"),
              "new_list_as_string": new_list_as_string
            };
            _context3.p = 2;
            _context3.n = 3;
            return (0, _communication_react.postPromise)("host", "update_list_task", result_dict, props.local_id);
          case 3:
            savedContent.current = new_list_as_string;
            statusFuncs.statusMessage("Saved list ".concat(result_dict.list_name));
            _context3.n = 5;
            break;
          case 4:
            _context3.p = 4;
            _t = _context3.v;
            errorDrawerFuncs.addErrorDrawerEntry({
              title: "Error creating new notebook",
              content: "message" in data ? data.message : ""
            });
          case 5:
            return _context3.a(2);
        }
      }, _callee3, null, [[2, 4]]);
    }));
    return _saveMe2.apply(this, arguments);
  }
  function _saveMeAs() {
    return _saveMeAs2.apply(this, arguments);
  }
  function _saveMeAs2() {
    _saveMeAs2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
      var ln_result, new_name, result_dict, _t2;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.n) {
          case 0:
            if (am_selected()) {
              _context4.n = 1;
              break;
            }
            return _context4.a(2, false);
          case 1:
            _context4.p = 1;
            _context4.n = 2;
            return (0, _communication_react.postPromise)("host", "get_list_names_task", {}, props.local_id);
          case 2:
            ln_result = _context4.v;
            _context4.n = 3;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Save List As",
              field_title: "New List Name",
              default_value: "NewList",
              existing_names: ln_result["list_names"],
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 3:
            new_name = _context4.v;
            result_dict = {
              "new_res_name": new_name,
              "res_to_copy": _cProp("resource_name")
            };
            _context4.n = 4;
            return (0, _communication_react.postPromise)("host", "create_duplicate_list_task", result_dict, props.local_id);
          case 4:
            _setResourceNameState(new_name, function () {
              _saveMe();
            });
            _context4.n = 6;
            break;
          case 5:
            _context4.p = 5;
            _t2 = _context4.v;
            if (_t2 != "canceled") {
              errorDrawerFuncs.addFromError("Error saving listy", _t2);
            }
          case 6:
            return _context4.a(2);
        }
      }, _callee4, null, [[1, 5]]);
    }));
    return _saveMeAs2.apply(this, arguments);
  }
  function _dirty() {
    return !(list_content_ref.current == savedContent.current);
  }
  var my_props = _objectSpread({}, props);
  var outer_style = {
    width: "calc(100% - ".concat(_sizing_tools.ICON_BAR_WIDTH, "px)"),
    height: "100%",
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 0,
    position: "relative"
  };
  var outer_class = "resource-viewer-holder";
  if (!props.controlled) {
    my_props.resource_name = resource_name;
    outer_class = "".concat(outer_class, " pane-holder ").concat(settingsContext.isDark() ? "bp6-dark" : "light-theme");
  }
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, !props.controlled && /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    selected: null,
    show_api_links: true,
    user_name: window.username
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: outer_class,
    ref: top_ref,
    style: outer_style,
    tabIndex: "0",
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp
  }, /*#__PURE__*/_react["default"].createElement(_resource_viewer_react_app.ResourceViewerApp, _extends({}, my_props, {
    padTop: true,
    local_id: props.local_id,
    setResourceNameState: _setResourceNameState,
    refreshTab: props.refreshTab,
    closeTab: props.closeTab,
    res_type: "list",
    resource_name: my_props.resource_name,
    menu_specs: menu_specs(),
    created: props.created,
    showErrorDrawerButton: false,
    saveMe: _saveMe
  }), /*#__PURE__*/_react["default"].createElement(ListEditor, {
    the_content: list_content,
    readOnly: props.readOnly,
    handleChange: _handleListChange
  }))));
}
exports.ListViewerApp = ListViewerApp = /*#__PURE__*/(0, _react.memo)(ListViewerApp);
function list_viewer_main() {
  return _list_viewer_main.apply(this, arguments);
}
function _list_viewer_main() {
  _list_viewer_main = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
    var local_id, gotProps, tsocket;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.n) {
        case 0:
          gotProps = function _gotProps(the_props) {
            var ListViewerAppPlus = (0, _utilities_react.withRegisterActivity)((0, _settings.withSettings)((0, _modal_react.withDialogs)((0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)((0, _assistant.withAssistant)(ListViewerApp))))));
            var the_element = /*#__PURE__*/_react["default"].createElement(ListViewerAppPlus, _extends({}, the_props, {
              controlled: false,
              changeName: null
            }));
            var domContainer = document.querySelector('#root');
            var root = (0, _client.createRoot)(domContainer);
            root.render(the_element);
          };
          local_id = "a" + (0, _utilities_react.guid)();
          tsocket = new _tactic_socket.TacticSocket("main", 5000, "list_viewer", local_id, /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
            var data;
            return _regenerator().w(function (_context5) {
              while (1) switch (_context5.n) {
                case 0:
                  tsocket.attachListener('handle-callback', function (task_packet) {
                    (0, _communication_react.handleCallback)(task_packet, local_id);
                  });
                  data = {
                    resource_name: resource_name,
                    res_type: "list",
                    local_id: local_id,
                    tsocket: tsocket
                  };
                  data.read_only = window.read_only;
                  data.is_repository = window.is_repository;
                  list_viewer_props(data, null, gotProps);
                case 1:
                  return _context5.a(2);
              }
            }, _callee5);
          })));
        case 1:
          return _context6.a(2);
      }
    }, _callee6);
  }));
  return _list_viewer_main.apply(this, arguments);
}
if (!window.in_context) {
  list_viewer_main().then();
}
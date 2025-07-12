"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CodeViewerApp = CodeViewerApp;
exports.code_viewer_props = code_viewer_props;
require("../tactic_css/tactic.scss");
var _react = _interopRequireWildcard(require("react"));
var _client = require("react-dom/client");
var _core = require("@blueprintjs/core");
var _resource_viewer_react_app = require("./resource_viewer_react_app");
var _tactic_socket = require("./tactic_socket");
var _reactCodemirror = require("./react-codemirror6");
var _communication_react = require("./communication_react.js");
var _toaster = require("./toaster.js");
var _error_drawer = require("./error_drawer.js");
var _utilities_react = require("./utilities_react");
var _blueprint_navbar = require("./blueprint_navbar");
var _settings = require("./settings");
var _assistant = require("./assistant");
var _modal_react = require("./modal_react");
var _error_drawer2 = require("./error_drawer");
var _sizing_tools = require("./sizing_tools");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t3 in e) "default" !== _t3 && {}.hasOwnProperty.call(e, _t3) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t3)) && (i.get || i.set) ? o(f, _t3, i) : f[_t3] = e[_t3]); return f; })(e, t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function code_viewer_props(data, registerDirtyMethod, finalCallback) {
  var resource_viewer_id = (0, _utilities_react.guid)();
  if (!window.in_context) {
    window.main_id = resource_viewer_id;
  }
  var tsocket = new _tactic_socket.TacticSocket("main", 5000, "code_viewer", resource_viewer_id);
  finalCallback({
    resource_viewer_id: resource_viewer_id,
    main_id: resource_viewer_id,
    tsocket: tsocket,
    split_tags: data.mdata.tags == "" ? [] : data.mdata.tags.split(" "),
    created: data.mdata["datestring"],
    resource_name: data.resource_name,
    the_content: data.the_content,
    notes: data.mdata.notes,
    readOnly: data["read_only"],
    is_repository: data.is_repository,
    registerDirtyMethod: registerDirtyMethod
  });
}
function CodeViewerApp(props) {
  props = _objectSpread({
    controlled: false,
    changeResourceName: null,
    updatePanel: null,
    refreshTab: null,
    closeTab: null
  }, props);
  var top_ref = (0, _react.useRef)(null);
  var search_ref = (0, _react.useRef)(null);
  var cmObjectRef = (0, _react.useRef)(null);
  var savedContent = (0, _react.useRef)(props.the_content);
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)(props.the_content),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    code_content = _useStateAndRef2[0],
    set_code_content = _useStateAndRef2[1],
    code_content_ref = _useStateAndRef2[2];
  var _useStateAndRef3 = (0, _utilities_react.useStateAndRef)(null),
    _useStateAndRef4 = _slicedToArray(_useStateAndRef3, 3),
    current_search_number = _useStateAndRef4[0],
    set_current_search_number = _useStateAndRef4[1],
    current_search_number_ref = _useStateAndRef4[2];
  var _useState = (0, _react.useState)(""),
    _useState2 = _slicedToArray(_useState, 2),
    search_string = _useState2[0],
    set_search_string = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = _slicedToArray(_useState3, 2),
    regex = _useState4[0],
    set_regex = _useState4[1];
  var _useStateAndRef5 = (0, _utilities_react.useStateAndRef)(null),
    _useStateAndRef6 = _slicedToArray(_useStateAndRef5, 3),
    search_matches = _useStateAndRef6[0],
    set_search_matches = _useStateAndRef6[1],
    search_matches_ref = _useStateAndRef6[2];
  var _useState5 = (0, _react.useState)(props.resource_name),
    _useState6 = _slicedToArray(_useState5, 2),
    resource_name = _useState6[0],
    set_resource_name = _useState6[1];
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  var statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer2.ErrorDrawerContext);
  var sizeInfo = (0, _react.useContext)(_sizing_tools.SizeContext);
  (0, _react.useEffect)(function () {
    statusFuncs.stopSpinner();
    if (props.controlled) {
      props.registerDirtyMethod(_dirty);
    }
    return function () {
      cmObjectRef.current = null;
      set_code_content(null);
      if (!props.controlled) {
        window.removeEventListener("beforeunload", function (e) {
          if (_dirty()) {
            e.preventDefault();
          }
        });
      }
    };
  }, []);
  var pushCallback = (0, _utilities_react.useCallbackStack)("code_viewer");
  var _saveMe = (0, _react.useCallback)(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
    var new_code, result_dict, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          if (am_selected()) {
            _context.n = 1;
            break;
          }
          return _context.a(2, false);
        case 1:
          new_code = code_content_ref.current;
          result_dict = {
            "code_name": _cProp("resource_name"),
            "new_code": new_code,
            "user_id": window.user_id
          };
          _context.p = 2;
          _context.n = 3;
          return (0, _communication_react.postPromise)("host", "update_code_task", result_dict, props.resource_viewer_id);
        case 3:
          savedContent.current = new_code;
          statusFuncs.statusMessage("Updated code resource ".concat(_cProp("resource_name")), 7);
          _context.n = 5;
          break;
        case 4:
          _context.p = 4;
          _t = _context.v;
          errorDrawerFuncs.addFromError("Error saving code", _t);
        case 5:
          return _context.a(2, false);
      }
    }, _callee, null, [[2, 4]]);
  })), [code_content]);
  var hotkeys = (0, _react.useMemo)(function () {
    return [{
      combo: "Ctrl+S",
      global: false,
      group: "Code Viewer",
      label: "Save Code",
      onKeyDown: _saveMe
    }];
  }, [_saveMe]);
  var _useHotkeys = (0, _core.useHotkeys)(hotkeys),
    handleKeyDown = _useHotkeys.handleKeyDown,
    handleKeyUp = _useHotkeys.handleKeyUp;
  (0, _utilities_react.useConstructor)(function () {
    if (!props.controlled) {
      window.addEventListener("beforeunload", function (e) {
        if (_dirty()) {
          e.preventDefault();
        }
      });
    }
  });
  var selectedPane = (0, _react.useContext)(_utilities_react.SelectedPaneContext);
  function _update_search_state(nstate) {
    set_current_search_number(0);
    for (var field in nstate) {
      switch (field) {
        case "regex":
          set_regex(nstate[field]);
          break;
        case "search_string":
          set_search_string(nstate[field]);
          break;
      }
    }
  }
  function cPropGetters() {
    return {
      resource_name: resource_name
    };
  }
  function _cProp(pname) {
    return props.controlled ? props[pname] : cPropGetters()[pname];
  }
  var menu_specs = (0, _react.useMemo)(function () {
    var ms;
    if (props.is_repository) {
      ms = {
        Transfer: [{
          "name_text": "Copy to library",
          "icon_name": "import",
          "click_handler": function () {
            var _click_handler = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
              return _regenerator().w(function (_context2) {
                while (1) switch (_context2.n) {
                  case 0:
                    _context2.n = 1;
                    return (0, _resource_viewer_react_app.copyToLibrary)("list", _cProp("resource_name"), dialogFuncs, statusFuncs, errorDrawerFuncs);
                  case 1:
                    return _context2.a(2);
                }
              }, _callee2);
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
            var _click_handler2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
              return _regenerator().w(function (_context3) {
                while (1) switch (_context3.n) {
                  case 0:
                    _context3.n = 1;
                    return (0, _resource_viewer_react_app.sendToRepository)("list", _cProp("resource_name"), dialogFuncs, statusFuncs, errorDrawerFuncs);
                  case 1:
                    return _context3.a(2);
                }
              }, _callee3);
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
    return ms;
  });
  function _handleCodeChange(new_code) {
    set_code_content(new_code);
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
  function _setResourceNameStatePromise(_x) {
    return _setResourceNameStatePromise2.apply(this, arguments);
  }
  function _setResourceNameStatePromise2() {
    _setResourceNameStatePromise2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(new_name) {
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.n) {
          case 0:
            return _context4.a(2, new Promise(function (resolve) {
              _setResourceNameState(new_name, resolve);
            }));
        }
      }, _callee4);
    }));
    return _setResourceNameStatePromise2.apply(this, arguments);
  }
  function _setSearchMatches(nmatches) {
    set_search_matches(nmatches);
  }
  function _searchNext() {
    if (current_search_number_ref.current < search_matches_ref.current - 1) {
      set_current_search_number(current_search_number_ref.current + 1);
    }
  }
  function _searchPrev() {
    if (current_search_number_ref.current > 0) {
      set_current_search_number(current_search_number_ref.current - 1);
    }
  }
  function _setCmObject(cm) {
    cmObjectRef.current = cm;
  }
  function _extraKeys() {
    return [{
      key: 'Ctrl-s',
      run: _saveMe
    }, {
      key: 'Ctrl-f',
      run: function run() {
        search_ref.current.focus();
      },
      preventDefault: true
    }, {
      key: 'Cmd-f',
      run: function run() {
        search_ref.current.focus();
      },
      preventDefault: true
    }, {
      key: 'Ctrl-g',
      run: function run() {
        _searchNext();
      },
      preventDefault: true
    }, {
      key: 'Cmd-g',
      run: function run() {
        _searchNext();
      },
      preventDefault: true
    }, {
      key: 'Ctrl-Shift-g',
      run: function run() {
        _searchPrev();
      },
      preventDefault: true
    }, {
      key: 'Cmd-Shift-g',
      run: function run() {
        _searchPrev();
      },
      preventDefault: true
    }];
  }
  function am_selected() {
    return selectedPane.amSelected(selectedPane.tab_id, selectedPane.selectedTabIdRef);
  }
  function _saveMeAs() {
    return _saveMeAs2.apply(this, arguments);
  }
  function _saveMeAs2() {
    _saveMeAs2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
      var data, new_name, result_dict, _t2;
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.n) {
          case 0:
            if (am_selected()) {
              _context5.n = 1;
              break;
            }
            return _context5.a(2, false);
          case 1:
            statusFuncs.startSpinner();
            _context5.p = 2;
            _context5.n = 3;
            return (0, _communication_react.postPromise)("host", "get_code_names", {
              "user_id": window.user_id
            }, props.main_id);
          case 3:
            data = _context5.v;
            _context5.n = 4;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Save Code As",
              field_title: "New Code Name",
              default_value: "NewCode",
              existing_names: data["code_names"],
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 4:
            new_name = _context5.v;
            result_dict = {
              "new_res_name": new_name,
              "res_to_copy": _cProp("resource_name")
            };
            _context5.n = 5;
            return (0, _communication_react.postAjaxPromise)('/create_duplicate_code', result_dict);
          case 5:
            _context5.n = 6;
            return _setResourceNameStatePromise(new_name);
          case 6:
            _context5.n = 7;
            return _saveMe();
          case 7:
            _context5.n = 9;
            break;
          case 8:
            _context5.p = 8;
            _t2 = _context5.v;
            if (_t2 != "canceled") {
              errorDrawerFuncs.addFromError("Error saving code", _t2);
            }
          case 9:
            statusFuncs.stopSpinner();
          case 10:
            return _context5.a(2);
        }
      }, _callee5, null, [[2, 8]]);
    }));
    return _saveMeAs2.apply(this, arguments);
  }
  function _dirty() {
    return !(code_content_ref.current == savedContent.current);
  }
  var my_props = _objectSpread({}, props);
  var outer_style = {
    width: "100%",
    height: sizeInfo.availableHeight,
    paddingLeft: 0,
    position: "relative"
  };
  var outer_class = "resource-viewer-holder";
  if (!props.controlled) {
    my_props.resource_name = resource_name;
    if (settingsContext.isDark()) {
      outer_class = outer_class + " bp6-dark";
    } else {
      outer_class = outer_class + " light-theme";
    }
  }
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, !props.controlled && /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    selected: null,
    show_api_links: true,
    page_id: props.resource_viewer_id,
    user_name: window.username
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: outer_class,
    ref: top_ref,
    style: outer_style,
    tabIndex: "0",
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp
  }, /*#__PURE__*/_react["default"].createElement(_resource_viewer_react_app.ResourceViewerApp, _extends({}, my_props, {
    resource_viewer_id: props.resource_viewer_id,
    refreshTab: props.refreshTab,
    closeTab: props.closeTab,
    res_type: "code",
    resource_name: my_props.resource_name,
    menu_specs: menu_specs,
    created: props.created,
    show_search: false,
    showErrorDrawerButton: true
  }), /*#__PURE__*/_react["default"].createElement(_reactCodemirror.ReactCodemirror6, {
    code_content: code_content,
    show_fold_button: true,
    no_width: true,
    extraKeys: _extraKeys(),
    readOnly: props.readOnly,
    handleChange: _handleCodeChange,
    saveMe: _saveMe,
    show_search: true,
    setCMObject: _setCmObject,
    search_term: search_string,
    search_ref: search_ref,
    search_matches: search_matches,
    updateSearchState: _update_search_state,
    regex_search: regex,
    searchPrev: _searchPrev,
    searchNext: _searchNext,
    highlight_active_line: true,
    current_search_number: current_search_number,
    setSearchMatches: _setSearchMatches
  }))));
}
exports.CodeViewerApp = CodeViewerApp = /*#__PURE__*/(0, _react.memo)(CodeViewerApp);
function code_viewer_main() {
  function gotProps(the_props) {
    var CodeViewerAppPlus = (0, _sizing_tools.withSizeContext)((0, _settings.withSettings)((0, _modal_react.withDialogs)((0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)((0, _assistant.withAssistant)(CodeViewerApp))))));
    var the_element = /*#__PURE__*/_react["default"].createElement(CodeViewerAppPlus, _extends({}, the_props, {
      controlled: false,
      changeName: null
    }));
    var domContainer = document.querySelector('#root');
    var root = (0, _client.createRoot)(domContainer);
    root.render(
    // <BlueprintProvider>
    the_element
    //</BlueprintProvider>
    );
  }
  var target = window.is_repository ? "repository_view_code_in_context" : "view_code_in_context";
  (0, _communication_react.postAjaxPromise)(target, {
    "resource_name": window.resource_name
  }).then(function (data) {
    code_viewer_props(data, null, gotProps, null);
  });
}
if (!window.in_context) {
  code_viewer_main();
}
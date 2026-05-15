"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
require("../tactic_css/tactic.scss");
require("../tactic_css/themeable.scss");
var _react = _interopRequireWildcard(require("react"));
var _client = require("react-dom/client");
var _merge_viewer_app = require("./merge_viewer_app");
var _toaster = require("./toaster");
var _communication_react = require("./communication_react");
var _error_drawer = require("./error_drawer");
var _utilities_react = require("./utilities_react");
var _blueprint_navbar = require("./blueprint_navbar");
var _tactic_socket = require("./tactic_socket");
var _settings = require("./settings");
var _modal_react = require("./modal_react");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t2 in e) "default" !== _t2 && {}.hasOwnProperty.call(e, _t2) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t2)) && (i.get || i.set) ? o(f, _t2, i) : f[_t2] = e[_t2]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
window.global_id = "a" + (0, _utilities_react.guid)();
function tile_differ_main() {
  return _tile_differ_main.apply(this, arguments);
}
function _tile_differ_main() {
  _tile_differ_main = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
    var gotProps, fallback, domContainer, root, the_element;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          gotProps = function _gotProps(the_props) {
            var TileDifferAppPlus = (0, _utilities_react.withRegisterActivity)((0, _settings.withSettings)((0, _modal_react.withDialogs)((0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(TileDifferApp)))));
            var the_element = /*#__PURE__*/_react["default"].createElement(TileDifferAppPlus, _extends({}, the_props, {
              controlled: false,
              changeName: null
            }));
            var domContainer = document.querySelector('#root');
            var root = (0, _client.createRoot)(domContainer);
            root.render(/*#__PURE__*/_react["default"].createElement("div", {
              style: {
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
                minWidth: 0,
                position: "relative",
                height: "100%",
                width: "100%"
              }
            }, the_element));
          };
          try {
            tile_differ_props({}, null, gotProps);
          } catch (e) {
            fallback = "Tile differ failed to load";
            if ("message" in e) {
              fallback = fallback + " " + e.message;
            }
            domContainer = document.querySelector('#root');
            root = (0, _client.createRoot)(domContainer);
            the_element = /*#__PURE__*/_react["default"].createElement("pre", null, fallback);
            root.render(the_element);
          }
        case 1:
          return _context4.a(2);
      }
    }, _callee4);
  }));
  return _tile_differ_main.apply(this, arguments);
}
function tile_differ_props(data, registerDirtyMethod, finalCallback) {
  var tsocket = new _tactic_socket.TacticSocket("main", 5000, "differ", window.global_id, function () {
    tsocket.attachListener('handle-callback', function (task_packet) {
      (0, _communication_react.handleCallback)(task_packet, window.global_id);
    });
    finalCallback({
      local_id: window.global_id,
      tsocket: tsocket,
      tile_list: [],
      resource_name: window.resource_name,
      second_resource_name: "second_resource_name" in window ? window.second_resource_name : null,
      edit_content: "",
      is_repository: false,
      registerDirtyMethod: registerDirtyMethod
    });
  });
}
function TileDifferApp(props) {
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)(props.edit_content),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    edit_content = _useStateAndRef2[0],
    set_edit_content = _useStateAndRef2[1],
    edit_content_ref = _useStateAndRef2[2];
  var _useState = (0, _react.useState)(""),
    _useState2 = _slicedToArray(_useState, 2),
    right_content = _useState2[0],
    set_right_content = _useState2[1];
  var _useState3 = (0, _react.useState)(props.second_resource_name == "none" ? props.resource_name : props.second_resource_name),
    _useState4 = _slicedToArray(_useState3, 2),
    tile_popup_val = _useState4[0],
    set_tile_popup_val = _useState4[1];
  var _useState5 = (0, _react.useState)(props.tile_list),
    _useState6 = _slicedToArray(_useState5, 2),
    tile_list = _useState6[0],
    set_tile_list = _useState6[1];
  var _useState7 = (0, _react.useState)(""),
    _useState8 = _slicedToArray(_useState7, 2),
    second_resource_name = _useState8[0],
    set_second_resource_name = _useState8[1];
  var _useState9 = (0, _react.useState)(false),
    _useState0 = _slicedToArray(_useState9, 2),
    initialized = _useState0[0],
    setInitialized = _useState0[1];
  var connection_status = (0, _tactic_socket.useConnection)(props.tsocket, initSocket);
  var savedContent = (0, _react.useRef)(props.edit_content);
  var statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  (0, _react.useEffect)(function () {
    window.addEventListener("beforeunload", function (e) {
      if (_dirty()) {
        e.preventDefault();
      }
      (0, _communication_react.postWithCallback)("host", "end_client_session_task", {
        global_id: window.global_id,
        force_forward: true
      });
      props.tsocket.disconnect();
    });
  }, []);
  (0, _react.useEffect)(function () {
    (0, _communication_react.postPromise)("host", "get_tile_content_task", {
      "tile_module_name": window.resource_name
    }).then(function (data) {
      (0, _communication_react.postPromise)("host", "get_tile_names_task", {}).then(function (data2) {
        set_tile_list(data2["tile_names"]);
        set_edit_content(data.tile_content);
        savedContent.current = data.tile_content;
        getRightTileCode(tile_popup_val).then();
        pushCallback(function () {
          setInitialized(true);
        });
      });
    });
  }, []);
  function initSocket(theSocket) {
    theSocket.attachListener("window-open", function (data) {
      return window.open("".concat($SCRIPT_ROOT, "/load_temp_page/").concat(data["the_id"]));
    });
    theSocket.attachListener('close-user-windows', function (data) {
      if (!(data["originator"] == window.global_id)) {
        window.close();
      }
    });
    theSocket.attachListener('doflashUser', _toaster.doFlash);
    if (!window.in_context) {
      theSocket.attachListener("endSession", function () {
        dialogFuncs.showModal("EndSessionDialog", {});
      });
    }
  }
  function getRightTileCode(_x) {
    return _getRightTileCode.apply(this, arguments);
  }
  function _getRightTileCode() {
    _getRightTileCode = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(tile_name) {
      var data;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            if (tile_name) {
              _context.n = 1;
              break;
            }
            return _context.a(2);
          case 1:
            _context.n = 2;
            return (0, _communication_react.postPromise)("host", "get_tile_content_task", {
              tile_module_name: tile_name
            });
          case 2:
            data = _context.v;
            if (!data || !data.success) {
              errorDrawerFuncs.addErrorDrawerEntry({
                title: "Error getting module code",
                content: data.message
              });
            } else {
              set_right_content(data.tile_content);
            }
          case 3:
            return _context.a(2);
        }
      }, _callee);
    }));
    return _getRightTileCode.apply(this, arguments);
  }
  function handleSelectChange(_x2) {
    return _handleSelectChange.apply(this, arguments);
  }
  function _handleSelectChange() {
    _handleSelectChange = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(new_value) {
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            if (new_value) {
              _context2.n = 1;
              break;
            }
            return _context2.a(2);
          case 1:
            set_tile_popup_val(new_value);
            _context2.n = 2;
            return getRightTileCode(new_value);
          case 2:
            return _context2.a(2);
        }
      }, _callee2);
    }));
    return _handleSelectChange.apply(this, arguments);
  }
  function handleEditChange(new_code) {
    set_edit_content(new_code);
  }
  function saveFromLeft() {
    return _saveFromLeft.apply(this, arguments);
  }
  function _saveFromLeft() {
    _saveFromLeft = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
      var data_dict, _t;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.n) {
          case 0:
            data_dict = {
              "module_name": window.resource_name,
              "module_code": edit_content_ref.current
            };
            _context3.p = 1;
            _context3.n = 2;
            return (0, _communication_react.postPromise)("host", "update_from_left_task", data_dict);
          case 2:
            statusFuncs.statusMessage("Updated from left");
            _context3.n = 4;
            break;
          case 3:
            _context3.p = 3;
            _t = _context3.v;
            errorDrawerFuncs.addErrorDrawerEntry({
              title: "Error saving from left",
              content: "message" in _t ? _t.message : ""
            });
          case 4:
            return _context3.a(2);
        }
      }, _callee3, null, [[1, 3]]);
    }));
    return _saveFromLeft.apply(this, arguments);
  }
  function _dirty() {
    return edit_content_ref.current != savedContent.current;
  }
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, !props.controlled, " ", /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    selected: null,
    show_api_links: true,
    user_name: window.username
  }), /*#__PURE__*/_react["default"].createElement(_merge_viewer_app.MergeViewerApp, {
    connection_status: connection_status,
    initialized: initialized,
    resource_name: window.resource_name,
    option_list: tile_list,
    select_val: tile_popup_val,
    edit_content: edit_content,
    right_content: right_content,
    handleSelectChange: handleSelectChange,
    handleEditChange: handleEditChange,
    saveHandler: saveFromLeft
  }));
}
TileDifferApp = /*#__PURE__*/(0, _react.memo)(TileDifferApp);
if (!window.in_context) {
  tile_differ_main().then();
}
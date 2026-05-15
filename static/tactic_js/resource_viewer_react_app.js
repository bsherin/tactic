"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResourceViewerApp = ResourceViewerApp;
exports.copyToLibrary = copyToLibrary;
exports.sendToRepository = sendToRepository;
var _react = _interopRequireWildcard(require("react"));
var _combined_metadata = require("./combined_metadata");
var _resizing_allotment = require("./resizing_allotment");
var _menu_utilities = require("./menu_utilities");
var _toaster = require("./toaster");
var _tactic_socket = require("./tactic_socket");
var _communication_react = require("./communication_react");
var _modal_react = require("./modal_react");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t3 in e) "default" !== _t3 && {}.hasOwnProperty.call(e, _t3) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t3)) && (i.get || i.set) ? o(f, _t3, i) : f[_t3] = e[_t3]); return f; })(e, t); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function copyToLibrary(_x, _x2, _x3, _x4, _x5) {
  return _copyToLibrary.apply(this, arguments);
}
function _copyToLibrary() {
  _copyToLibrary = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(res_type, resource_name, dialogFuncs, statusFuncs, errorDrawerFuncs) {
    var data, new_name, result_dict, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          _context.p = 0;
          _context.n = 1;
          return (0, _communication_react.postPromise)("host", "get_resource_names_task", {
            res_type: res_type
          });
        case 1:
          data = _context.v;
          _context.n = 2;
          return dialogFuncs.showModalPromise("ModalDialog", {
            title: "Import ".concat(res_type),
            field_title: "New ".concat(res_type, " Name"),
            default_value: resource_name,
            existing_names: data.res_names,
            checkboxes: [],
            handleClose: dialogFuncs.hideModal
          });
        case 2:
          new_name = _context.v;
          result_dict = {
            "res_type": res_type,
            "res_name": resource_name,
            "new_res_name": new_name
          };
          _context.n = 3;
          return (0, _communication_react.postPromise)("host", "copy_from_repository_task", result_dict);
        case 3:
          statusFuncs.statusMessage("Copied resource from repository");
          _context.n = 5;
          break;
        case 4:
          _context.p = 4;
          _t = _context.v;
          if (_t != "canceled") {
            errorDrawerFuncs.addFromError("Error copying from repository", _t);
          }
        case 5:
          return _context.a(2);
      }
    }, _callee, null, [[0, 4]]);
  }));
  return _copyToLibrary.apply(this, arguments);
}
function sendToRepository(_x6, _x7, _x8, _x9, _x0) {
  return _sendToRepository.apply(this, arguments);
}
function _sendToRepository() {
  _sendToRepository = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(res_type, resource_name, dialogFuncs, statusFuncs, errorDrawerFuncs) {
    var data, new_name, result_dict, _t2;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          _context2.p = 0;
          _context2.n = 1;
          return (0, _communication_react.postPromise)("host", "get_resource_names_task", {
            res_type: res_type,
            is_repository: true
          });
        case 1:
          data = _context2.v;
          _context2.n = 2;
          return dialogFuncs.showModalPromise("ModalDialog", {
            title: "Share ".concat(res_type),
            field_title: "New ".concat(res_type, " Name"),
            default_value: resource_name,
            existing_names: data.res_names,
            checkboxes: [],
            handleClose: dialogFuncs.hideModal
          });
        case 2:
          new_name = _context2.v;
          result_dict = {
            "res_type": res_type,
            "res_name": resource_name,
            "new_res_name": new_name
          };
          _context2.n = 3;
          return (0, _communication_react.postPromise)("host", "send_to_repository_task", result_dict);
        case 3:
          statusFuncs.statusMessage("Sent resource to repository");
          _context2.n = 5;
          break;
        case 4:
          _context2.p = 4;
          _t2 = _context2.v;
          if (_t2 != "canceled") {
            errorDrawerFuncs.addFromError("Error sending to repository", _t2);
          }
        case 5:
          return _context2.a(2);
      }
    }, _callee2, null, [[0, 4]]);
  }));
  return _sendToRepository.apply(this, arguments);
}
function ResourceViewerApp(props) {
  props = _objectSpread({
    search_string: "",
    padTop: false,
    search_matches: null,
    showErrorDrawerButton: false,
    am_selected: true,
    controlled: false,
    refreshTab: null,
    closeTab: null,
    search_ref: null,
    allow_regex_search: false,
    regex: false,
    mdata_icon: null,
    additional_metadata: null
  }, props);
  var top_ref = (0, _react.useRef)(null);
  var statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);

  // Only used when not in context
  var connection_status = (0, _tactic_socket.useConnection)(props.tsocket, initSocket);
  (0, _react.useEffect)(function () {
    statusFuncs.stopSpinner();
  }, []);
  function initSocket(theSocket) {
    if (!props.controlled) {
      theSocket.attachListener('close-user-windows', function (data) {
        if (!(data["originator"] == window.global_id)) {
          window.close();
        }
      });
      theSocket.attachListener("doFlashUser", function (data) {
        (0, _toaster.doFlash)(data);
      });
      theSocket.attachListener("endSession", function () {
        dialogFuncs.showModal("EndSessionDialog", {});
      });
    }
  }
  var left_pane = /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
    className: "resource-viewer-left-pane-holder ".concat(props.padTop ? "top-padded" : ""),
    style: {
      height: "100%",
      width: "100%",
      position: "relative",
      minHeight: 0,
      minWidth: 0,
      overflow: "auto",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      height: "100%",
      width: "100%",
      position: "relative",
      minHeight: 0,
      minWidth: 0,
      overflow: "auto",
      display: "flex",
      flexDirection: "column"
    }
  }, props.children)));
  var right_pane = /*#__PURE__*/_react["default"].createElement(_combined_metadata.CombinedMetadata, {
    expandWidth: true,
    tsocket: props.tsocket,
    useTags: true,
    useNotes: true,
    readOnly: props.readOnly,
    res_name: props.resource_name,
    res_type: props.res_type
  });
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_menu_utilities.TacticMenubar, {
    menu_specs: props.menu_specs,
    connection_status: connection_status,
    showRefresh: window.in_context,
    showClose: window.in_context,
    refreshTab: props.refreshTab,
    closeTab: props.closeTab,
    resource_name: props.resource_name,
    showIconBar: true,
    showMetadataDrawerButton: false,
    showAssistantDrawerButton: true,
    showErrorDrawerButton: true,
    showSettingsDrawerButton: true
  }), /*#__PURE__*/_react["default"].createElement("div", {
    ref: top_ref,
    className: "resource-viewer-hp-holder",
    style: {
      display: "flex",
      flexGrow: 1,
      minHeight: 0,
      minWidth: 0,
      width: "100%",
      position: "relative",
      overflow: "hidden",
      marginTop: 0
    }
  }, /*#__PURE__*/_react["default"].createElement(_resizing_allotment.HorizontalPanes, {
    left_pane: left_pane,
    show_handle: true,
    right_pane: right_pane,
    initial_width_fraction: .65,
    handleResizeEnd: null,
    am_outer: true
  })));
}
exports.ResourceViewerApp = ResourceViewerApp = /*#__PURE__*/(0, _react.memo)(ResourceViewerApp);
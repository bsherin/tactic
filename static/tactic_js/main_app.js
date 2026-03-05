"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MainApp = MainApp;
var _tactic_socket = require("./tactic_socket");
var _react = _interopRequireWildcard(require("react"));
var _client = require("react-dom/client");
var _core = require("@blueprintjs/core");
var _table = require("@blueprintjs/table");
var _lodash = _interopRequireDefault(require("lodash"));
var _main_support = require("./main_support");
var _blueprint_navbar = require("./blueprint_navbar");
var _menu_utilities = require("./menu_utilities");
var _table_react = require("./table_react");
var _blueprint_table = require("./blueprint_table");
var _resizing_allotment = require("./resizing_allotment");
var _main_menus_react = require("./main_menus_react");
var _tile_container = require("./tile_container");
var _tile_container_support = require("./tile_container_support");
var _export_viewer_react = require("./export_viewer_react");
var _console_component = require("./console_component");
var _console_support = require("./console_support");
var _communication_react = require("./communication_react");
var _toaster = require("./toaster");
var _error_drawer = require("./error_drawer");
var _utilities_react = require("./utilities_react");
var _sizing_tools = require("./sizing_tools");
var _error_boundary = require("./error_boundary");
var _settings = require("./settings");
var _pool_tree = require("./pool_tree");
var _assistant = require("./assistant");
var _modal_react = require("./modal_react");
var _metadata_drawer = require("./metadata_drawer");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t8 in e) "default" !== _t8 && {}.hasOwnProperty.call(e, _t8) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t8)) && (i.get || i.set) ? o(f, _t8, i) : f[_t8] = e[_t8]); return f; })(e, t); }
if (!window.in_context) {
  Promise.resolve().then(function () {
    return _interopRequireWildcard(require("../tactic_css/tactic.scss"));
  });
  Promise.resolve().then(function () {
    return _interopRequireWildcard(require("../tactic_css/tactic_console.scss"));
  });
  Promise.resolve().then(function () {
    return _interopRequireWildcard(require("../tactic_css/tactic_main.scss"));
  });
  Promise.resolve().then(function () {
    return _interopRequireWildcard(require("../tactic_css/tactic_table.scss"));
  });
  Promise.resolve().then(function () {
    return _interopRequireWildcard(require("../tactic_css/themeable.scss"));
  });
}
var iStateDefaults = {
  table_is_shrunk: false,
  tile_list: [],
  console_items: [],
  console_width_fraction: .5,
  horizontal_fraction: .65,
  console_is_shrunk: true,
  height_fraction: .85,
  show_exports_pane: true,
  show_console_pane: true,
  console_is_zoomed: false
};
function MainApp(props) {
  props = _objectSpread({
    controlled: false,
    changeResourceName: null,
    refreshTab: null,
    closeTab: null,
    updatePanel: null
  }, props);
  function iStateOrDefault(pname) {
    if (props.is_project) {
      if ("interface_state" in props && props.interface_state && pname in props.interface_state) {
        return props.interface_state[pname];
      }
    }
    return iStateDefaults[pname];
  }
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  var last_save = (0, _react.useRef)({});
  var updateExportsList = (0, _react.useRef)(null);
  var main_outer_ref = (0, _react.useRef)(null);
  var set_table_scroll = (0, _react.useRef)(null);
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)([]),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    set_console_selected_items = _useStateAndRef2[1],
    console_selected_items_ref = _useStateAndRef2[2];
  var _useReducerAndRef = (0, _utilities_react.useReducerAndRef)(_console_support.consoleItemsReducer, []),
    _useReducerAndRef2 = _slicedToArray(_useReducerAndRef, 3),
    console_items = _useReducerAndRef2[0],
    dispatch = _useReducerAndRef2[1],
    console_items_ref = _useReducerAndRef2[2];
  var _useReducerAndRef3 = (0, _utilities_react.useReducerAndRef)(_tile_container_support.tilesReducer),
    _useReducerAndRef4 = _slicedToArray(_useReducerAndRef3, 3),
    tile_list = _useReducerAndRef4[0],
    tileDispatch = _useReducerAndRef4[1],
    tile_list_ref = _useReducerAndRef4[2];
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  var statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  var _useReducerAndRef5 = (0, _utilities_react.useReducerAndRef)(_main_support.mainReducer, {
      update_index: 0,
      table_is_shrunk: props.doc_type == "none" || iStateOrDefault("table_is_shrunk"),
      console_width_fraction: iStateOrDefault("console_width_fraction"),
      horizontal_fraction: iStateOrDefault("horizontal_fraction"),
      height_fraction: iStateOrDefault("height_fraction"),
      console_is_shrunk: iStateOrDefault("console_is_shrunk"),
      console_is_zoomed: iStateOrDefault("console_is_zoomed"),
      show_exports_pane: iStateOrDefault("show_exports_pane"),
      show_console_pane: iStateOrDefault("show_console_pane"),
      show_metadata: false,
      pseudoTileStatus: "not initialized",
      table_spec: props.initial_table_spec,
      doc_type: props.doc_type,
      data_text: props.doc_type == "freeform" ? props.initial_data_text : "",
      data_row_dict: props.doc_type == "freeform" ? {} : props.initial_data_row_dict,
      total_rows: props.doc_type == "freeform" ? 0 : props.total_rows,
      doc_names: props.initial_doc_names,
      short_collection_name: props.short_collection_name,
      tile_types: props.initial_tile_types,
      tile_icon_dict: props.initial_tile_icon_dict,
      alt_search_text: null,
      selected_column: null,
      selected_row: null,
      selected_regions: [],
      table_is_filtered: false,
      search_text: "",
      soft_wrap: false,
      show_table_spinner: false,
      cells_to_color_text: {},
      spreadsheet_mode: false,
      // These will maybe only be used if not controlled
      resource_name: props.resource_name,
      is_project: props.is_project
    }),
    _useReducerAndRef6 = _slicedToArray(_useReducerAndRef5, 3),
    mState = _useReducerAndRef6[0],
    mDispatch = _useReducerAndRef6[1],
    mStateRef = _useReducerAndRef6[2];
  var connection_status = (0, _tactic_socket.useConnection)(props.tsocket, initSocket);
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  (0, _utilities_react.useConstructor)(function () {
    dispatch({
      type: "initialize",
      new_items: props.is_project && props.interface_state ? props.interface_state["console_items"] : []
    });
    tileDispatch({
      type: "initialize",
      new_items: iStateOrDefault("tile_list")
    });
  });
  (0, _react.useEffect)(function () {
    if (props.controlled) {
      props.registerDirtyMethod(_dirty);
    } else {
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
    }
    _updateLastSave();
    statusFuncs.stopSpinner();
    if (!props.controlled) {
      document.title = mState.resource_name;
    }
    function sendRemove() {
      console.log("got the beacon");
      navigator.sendBeacon("/remove_mainwindow", JSON.stringify({
        local_id: props.local_id
      }));
    }
    window.addEventListener("unload", sendRemove);
    getPseudoTileStatus();
    (0, _communication_react.postPromiseMain)(props.local_id, "load_modules", {}).then(function () {
      var _iterator = _createForOfIteratorHelper(tile_list_ref.current),
        _step;
      try {
        var _loop = function _loop() {
          var tile_entry = _step.value;
          (0, _communication_react.postPromiseMain)(props.local_id, "initialize_tile_from_save", {
            sid: props.local_id,
            tile_id: tile_entry.tile_id
          }).then(function (tile_data) {
            var new_tile_id = tile_data.tile_id;
            tileDispatch({
              type: "change_item_state",
              tile_id: tile_entry.tile_id,
              new_state: {
                loading_status: "loaded",
                tile_id: new_tile_id
              }
            });
          })["catch"](function (tile_data) {
            var new_tile_id = tile_data.tile_id;
            tileDispatch({
              type: "change_item_state",
              tile_id: tile_entry.tile_id,
              new_state: {
                loading_status: "loaded",
                tile_id: new_tile_id
              }
            });
          });
        };
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    });
    return function () {
      if (props.controlled) {
        (0, _communication_react.postWithCallbackMain)(props.local_id, "end_main_session_task", {
          sid: props.local_id
        });
      }
      window.removeEventListener("unload", sendRemove);
    };
  }, []);
  (0, _react.useEffect)(function () {
    var data = {
      active_row_id: mState.selected_row,
      doc_name: mState.table_spec.current_doc_name
    };
    _broadcast_event_to_server("MainTableRowSelect", data);
  }, [mState.selected_row]);
  function _filteredColumnNames() {
    return mState.table_spec.column_names.filter(function (name) {
      return !(mState.table_spec.hidden_columns_list.includes(name) || name == "__id__");
    });
  }
  function updatePseudoTileStatus(data) {
    if (mState.pseudoTileStatus == "loaded") {
      return;
    }
    setPseudoTileStatus(data.status);
  }
  function setPseudoTileStatus(status) {
    _setMainStateValue("pseudoTileStatus", status);
  }
  function getPseudoTileStatus() {
    (0, _communication_react.postPromise)("main_service", "get_pseudo_tile_status", {
      "sid": props.local_id
    }, props.local_id).then(function (data) {
      updatePseudoTileStatus(data);
    });
  }
  function _cProp(pname) {
    return props.controlled ? props[pname] : mState[pname];
  }
  var save_state = {
    tile_list: tile_list,
    console_items: console_items,
    table_is_shrunk: mState.table_is_shrunk,
    console_width_fraction: mState.console_width_fraction,
    horizontal_fraction: mState.horizontal_fraction,
    console_is_shrunk: mState.console_is_shrunk,
    height_fraction: mState.height_fraction,
    show_exports_pane: mState.show_exports_pane,
    show_console_pane: mState.show_console_pane,
    console_is_zoomed: mState.console_is_zoomed
  };
  function _updateLastSave() {
    last_save.current = save_state;
  }
  function _dirty() {
    var current_state = save_state;
    for (var k in current_state) {
      if (current_state[k] != last_save.current[k]) {
        return true;
      }
    }
    return false;
  }
  function _update_menus_listener() {
    return _update_menus_listener2.apply(this, arguments);
  }
  function _update_menus_listener2() {
    _update_menus_listener2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
      var data;
      return _regenerator().w(function (_context6) {
        while (1) switch (_context6.n) {
          case 0:
            _context6.n = 1;
            return (0, _communication_react.postPromise)("host", "get_tile_types_task", {
              "user_id": window.user_id
            }, props.local_id);
          case 1:
            data = _context6.v;
            mDispatch({
              type: "change_multiple_fields",
              newPartialState: {
                tile_types: data.tile_types,
                tile_icon_dict: data.icon_dict
              }
            });
          case 2:
            return _context6.a(2);
        }
      }, _callee6);
    }));
    return _update_menus_listener2.apply(this, arguments);
  }
  function _change_doc_listener(_x) {
    return _change_doc_listener2.apply(this, arguments);
  }
  function _change_doc_listener2() {
    _change_doc_listener2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(data) {
      var row_id, scroll_to_row, select_row;
      return _regenerator().w(function (_context7) {
        while (1) switch (_context7.n) {
          case 0:
            if (!(data.local_id == props.local_id)) {
              _context7.n = 1;
              break;
            }
            row_id = data.hasOwnProperty("row_id") ? data.row_id : null;
            scroll_to_row = data.hasOwnProperty("scroll_to_row") ? data.scroll_to_row : true;
            select_row = data.hasOwnProperty("select_row") ? data.select_row : true;
            if (mState.table_is_shrunk) {
              _setMainStateValue("table_is_shrunk", false);
            }
            _context7.n = 1;
            return _handleChangeDoc(data.doc_name, row_id, scroll_to_row, select_row);
          case 1:
            return _context7.a(2);
        }
      }, _callee7);
    }));
    return _change_doc_listener2.apply(this, arguments);
  }
  function initSocket(theSocket) {
    theSocket.attachListener("window-open", function (data) {
      window.open("".concat($SCRIPT_ROOT, "/load_temp_page/").concat(data["the_id"]));
    });
    theSocket.attachListener("pseudo-tile-status", updatePseudoTileStatus);
    if (!window.in_context) {
      theSocket.attachListener('close-user-windows', function (data) {
        if (!(data["originator"] == window.global_id)) {
          window.close();
        }
      });
      theSocket.attachListener("notebook-open", function (data) {
        window.open($SCRIPT_ROOT + "/new_notebook_with_data/" + data.temp_data_id);
      });
      theSocket.attachListener("doFlashUser", function (data) {
        (0, _toaster.doFlash)(data);
      });
    } else {
      theSocket.attachListener("notebook-open", /*#__PURE__*/function () {
        var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(data) {
          return _regenerator().w(function (_context) {
            while (1) switch (_context.n) {
              case 0:
                try {
                  props.handleCreateViewer("new-notebook", null, null, data.temp_data_id);
                } catch (e) {
                  errorDrawerFuncs.addFromError("Error saving list", e);
                }
              case 1:
                return _context.a(2);
            }
          }, _callee);
        }));
        return function (_x2) {
          return _ref.apply(this, arguments);
        };
      }());
    }
    theSocket.attachListener('table-message', _handleTableMessage);
    theSocket.attachListener("update-menus", _update_menus_listener);
    // theSocket.attachListener("tile-status-message", _handleTileStatusMessage);
    theSocket.attachListener('change-doc', _change_doc_listener);
    if (!props.controlled) {
      theSocket.attachListener("endSession", function () {
        dialogFuncs.showModal("EndSessionDialog", {});
      });
    }
  }
  function isFreeform() {
    return mState.doc_type == "freeform";
  }

  // Every item in tile_list is a list of this form
  function _createTileEntry(tile_name, tile_type, tile_id, form_data) {
    return {
      tile_name: tile_name,
      tile_type: tile_type,
      tile_id: tile_id,
      form_data: form_data,
      tile_height: 345,
      tile_width: 410,
      show_form: false,
      show_spinner: false,
      source_changed: false,
      javascript_code: null,
      javascript_arg_dict: null,
      show_log: false,
      log_content: "",
      shrunk: false,
      loading_status: "waiting",
      front_content: ""
    };
  }
  var _setMainStateValue = (0, _react.useCallback)(function (field_name) {
    var new_value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    if (_typeof(field_name) == "object") {
      mDispatch({
        type: "change_multiple_fields",
        newPartialState: field_name
      });
      pushCallback(callback);
    } else {
      mDispatch({
        type: "change_field",
        field: field_name,
        new_value: new_value
      });
      pushCallback(callback);
    }
  });
  function _handleSearchFieldChange(lsearch_text) {
    mDispatch({
      type: "change_multiple_fields",
      newPartialState: {
        search_text: lsearch_text,
        alt_search_text: null
      }
    });
    if (lsearch_text == null && !isFreeform()) {
      _setMainStateValue("cells_to_color_text", {});
    }
  }
  function _handleSpreadsheetModeChange(event) {
    _setMainStateValue("spreadsheet_mode", event.target.checked);
  }
  function _handleSoftWrapChange(event) {
    _setMainStateValue("soft_wrap", event.target.checked);
  }
  function _setAltSearchText(the_text) {
    _setMainStateValue("alt_search_text", the_text);
  }
  function _handleChangeDoc(_x3) {
    return _handleChangeDoc2.apply(this, arguments);
  }
  function _handleChangeDoc2() {
    _handleChangeDoc2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(new_doc_name) {
      var row_index,
        scroll_to_row,
        select_row,
        data,
        new_table_spec,
        data_dict,
        _data,
        _args8 = arguments,
        _t,
        _t2;
      return _regenerator().w(function (_context8) {
        while (1) switch (_context8.n) {
          case 0:
            row_index = _args8.length > 1 && _args8[1] !== undefined ? _args8[1] : 0;
            scroll_to_row = _args8.length > 2 && _args8[2] !== undefined ? _args8[2] : true;
            select_row = _args8.length > 3 && _args8[3] !== undefined ? _args8[3] : true;
            _setMainStateValue("show_table_spinner", true);
            if (!isFreeform()) {
              _context8.n = 5;
              break;
            }
            _context8.p = 1;
            _context8.n = 2;
            return (0, _communication_react.postPromiseMain)(props.local_id, "grab_freeform_data", {
              "doc_name": new_doc_name,
              "set_visible_doc": true
            }, props.local_id);
          case 2:
            data = _context8.v;
            statusFuncs.stopSpinner();
            statusFuncs.clearStatusMessage();
            new_table_spec = {
              "current_doc_name": new_doc_name
            };
            mDispatch({
              type: "change_multiple_fields",
              newPartialState: {
                data_text: data.data_text,
                table_spec: new_table_spec,
                visible_doc: new_doc_name
              }
            });
            pushCallback(function () {
              _setMainStateValue("show_table_spinner", false);
            });
            _context8.n = 4;
            break;
          case 3:
            _context8.p = 3;
            _t = _context8.v;
            errorDrawerFuncs.addFromError("Error changing doc", _t);
          case 4:
            _context8.n = 8;
            break;
          case 5:
            _context8.p = 5;
            data_dict = {
              "doc_name": new_doc_name,
              "row_index": row_index,
              "set_visible_doc": true
            };
            _context8.n = 6;
            return (0, _communication_react.postPromiseMain)(props.local_id, "grab_chunk_by_row_index", data_dict, props.local_id);
          case 6:
            _data = _context8.v;
            _setStateFromDataObject(_data, new_doc_name, function () {
              _setMainStateValue("show_table_spinner", false);
              if (select_row) {
                _setMainStateValue({
                  selected_regions: [_table.Regions.row(row_index)],
                  selected_row: row_index,
                  selected_column: null
                }, null);
              }
              if (scroll_to_row) {
                set_table_scroll.current = row_index;
              }
            });
            _context8.n = 8;
            break;
          case 7:
            _context8.p = 7;
            _t2 = _context8.v;
            errorDrawerFuncs.addFromError("Error changing doc", _t2);
          case 8:
            return _context8.a(2);
        }
      }, _callee8, null, [[5, 7], [1, 3]]);
    }));
    return _handleChangeDoc2.apply(this, arguments);
  }
  function _handleVerticalSplitUpdate(top_height, bottom_height, top_fraction) {
    _setMainStateValue("height_fraction", top_fraction);
  }
  function _updateTableSpec(spec_update) {
    var broadcast = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    mDispatch({
      type: "update_table_spec",
      spec_update: spec_update
    });
    if (broadcast) {
      spec_update["doc_name"] = mState.table_spec.current_doc_name;
      if (callback == null) {
        callback = updateUpdateIndex;
      }
      (0, _communication_react.postWithCallbackMain)(props.local_id, "UpdateTableSpec", spec_update, callback, null, props.local_id);
    }
  }
  var _broadcast_event_to_server = (0, _react.useCallback)(function (event_name, data_dict) {
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    data_dict.local_id = props.local_id;
    data_dict.event_name = event_name;
    if (!("doc_name" in data_dict)) {
      data_dict.doc_name = mState.table_spec.current_doc_name;
    }
    (0, _communication_react.postWithCallbackMain)(props.local_id, "distribute_events_stub", data_dict, callback, null, props.local_id);
  }, [props.local_id, mState.table_spec.current_doc_name]);
  function _broadcast_event_promise(event_name, data_dict) {
    data_dict.local_id = props.local_id;
    data_dict.event_name = event_name;
    if (!("doc_name" in data_dict)) {
      data_dict.doc_name = mState.table_spec.current_doc_name;
    }
    return (0, _communication_react.postPromiseMain)(props.local_id, "distribute_events_stub", data_dict, props.local_id);
  }
  function _tile_command(_x4) {
    return _tile_command2.apply(this, arguments);
  }
  function _tile_command2() {
    _tile_command2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(menu_id) {
      var existing_tile_names, _iterator4, _step4, tile_entry, tile_name, temp_id, data_dict, new_tile_entry, create_data, _t3;
      return _regenerator().w(function (_context9) {
        while (1) switch (_context9.n) {
          case 0:
            existing_tile_names = [];
            _iterator4 = _createForOfIteratorHelper(tile_list);
            try {
              for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                tile_entry = _step4.value;
                existing_tile_names.push(tile_entry["tile_name"]);
              }
            } catch (err) {
              _iterator4.e(err);
            } finally {
              _iterator4.f();
            }
            _context9.p = 1;
            _context9.n = 2;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Create " + menu_id,
              field_title: "New Tile Name",
              default_value: menu_id,
              existing_names: existing_tile_names,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 2:
            tile_name = _context9.v;
            temp_id = "temp_" + (0, _utilities_react.guid)();
            data_dict = {
              tile_name: tile_name,
              tile_type: menu_id,
              user_id: window.user_id,
              parent: props.local_id,
              temp_id: temp_id
            };
            new_tile_entry = _createTileEntry(tile_name, menu_id, temp_id, []);
            tileDispatch({
              type: "add_at_index",
              insert_index: tile_list.length,
              new_item: new_tile_entry
            });
            _context9.n = 3;
            return (0, _communication_react.postPromiseMain)(props.local_id, "create_tile", data_dict, props.local_id);
          case 3:
            create_data = _context9.v;
            tileDispatch({
              type: "change_item_state",
              tile_id: temp_id,
              new_state: {
                loading_status: "loaded",
                tile_id: create_data.tile_id,
                form_data: create_data.form_data
              }
            });
            if (updateExportsList.current) updateExportsList.current();
            _context9.n = 5;
            break;
          case 4:
            _context9.p = 4;
            _t3 = _context9.v;
            if (_t3 != "canceled") {
              errorDrawerFuncs.addFromError("Error creating tile}", _t3);
            }
            statusFuncs.clearStatusMessage();
            statusFuncs.stopSpinner();
          case 5:
            return _context9.a(2);
        }
      }, _callee9, null, [[1, 4]]);
    }));
    return _tile_command2.apply(this, arguments);
  }
  function create_tile_menus() {
    var menu_items = [];
    var sorted_categories = _toConsumableArray(Object.keys(mState.tile_types));
    sorted_categories.sort();
    var _iterator2 = _createForOfIteratorHelper(sorted_categories),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var category = _step2.value;
        var option_dict = {};
        var icon_dict = {};
        var sorted_types = _toConsumableArray(mState.tile_types[category]);
        sorted_types.sort();
        var _iterator3 = _createForOfIteratorHelper(sorted_types),
          _step3;
        try {
          var _loop2 = function _loop2() {
            var ttype = _step3.value;
            option_dict[ttype] = function () {
              return _tile_command(ttype);
            };
            icon_dict[ttype] = mState.tile_icon_dict[ttype];
          };
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            _loop2();
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
        menu_items.push(/*#__PURE__*/_react["default"].createElement(_main_menus_react.MenuComponent, {
          menu_name: category,
          option_dict: option_dict,
          binding_dict: {},
          icon_dict: icon_dict,
          disabled_items: [],
          key: category
        }));
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    return menu_items;
  }
  function _toggleTableShrink() {
    _setMainStateValue("table_is_shrunk", !mState.table_is_shrunk);
  }
  function _handleHorizontalFractionChange(left_width, right_width, new_fraction) {
    _setMainStateValue("horizontal_fraction", new_fraction);
  }
  function _handleConsoleFractionChange(left_width, right_width, new_fraction) {
    _setMainStateValue("console_width_fraction", new_fraction);
  }

  // Table doctype-only methods start here

  function _setFreeformDoc(doc_name, new_content) {
    if (doc_name == mState.table_spec.current_doc_name) {
      _setMainStateValue("data_text", new_content);
    }
  }
  function _handleTableMessage(data) {
    if (data.local_id == props.local_id) {
      // noinspection JSUnusedGlobalSymbols
      var handlerDict = {
        refill_table: _refill_table,
        dehighlightAllText: function dehighlightAllText() {
          return _handleSearchFieldChange(null);
        },
        highlightTxtInDocument: function highlightTxtInDocument(data) {
          return _setAltSearchText(data.text_to_find);
        },
        setCellContent: function setCellContent(data) {
          return _setCellContent(data.row, data.column_header, data.new_content);
        },
        colorTxtInCell: function colorTxtInCell(data) {
          return _colorTextInCell(data.row_id, data.column_header, data.token_text, data.color_dict);
        },
        setFreeformContent: function setFreeformContent(data) {
          return _setFreeformDoc(data.doc_name, data.new_content);
        },
        updateDocList: function updateDocList(data) {
          return _updateDocList(data.doc_names, data.visible_doc);
        },
        setCellBackground: function setCellBackground(data) {
          return _setCellBackgroundColor(data.doc_name, data.row, data.column_header, data.color);
        }
      };
      handlerDict[data["table_message"]](data);
    }
  }
  function _setCellContent(row_id, column_header, new_content) {
    var broadcast = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    mDispatch({
      type: "set_cell_content",
      row_id: row_id,
      column_header: column_header,
      new_content: new_content
    });
    var data = {
      doc_name: mState.table_spec.current_doc_name,
      id: row_id,
      column_header: column_header,
      new_content: new_content,
      cellchange: false
    };
    if (broadcast) {
      _broadcast_event_to_server("SetCellContent", data, null);
    }
  }
  function _setCellBackgroundColor(doc_name, row_id, column_header, color) {
    mDispatch({
      type: "set_cell_background",
      doc_name: doc_name,
      row_id: row_id,
      color: color,
      column_header: column_header
    });
  }
  function _colorTextInCell(row_id, column_header, token_text, color_dict) {
    mDispatch({
      type: "set_cells_to_color_text",
      row_id: row_id,
      column_header: column_header,
      token_text: token_text,
      color_dict: color_dict
    });
  }
  function _refill_table(data_object) {
    _setStateFromDataObject(data_object, data_object.doc_name, updateUpdateIndex);
  }
  function updateUpdateIndex() {
    _setMainStateValue("update_index", mState.update_index + 1);
  }
  function _moveColumn(tag_to_move, place_to_move) {
    var colnames = _toConsumableArray(mState.table_spec.column_names);
    var start_index = colnames.indexOf(tag_to_move);
    colnames.splice(start_index, 1);
    if (!place_to_move) {
      colnames.push(tag_to_move);
    } else {
      var end_index = colnames.indexOf(place_to_move);
      colnames.splice(end_index, 0, tag_to_move);
    }
    var fnames = _filteredColumnNames();
    start_index = fnames.indexOf(tag_to_move);
    fnames.splice(start_index, 1);
    var cwidths = _toConsumableArray(mState.table_spec.column_widths);
    var width_to_move = cwidths[start_index];
    cwidths.splice(start_index, 1);
    if (!place_to_move) {
      cwidths.push(width_to_move);
    } else {
      var _end_index = fnames.indexOf(place_to_move);
      cwidths.splice(_end_index, 0, width_to_move);
    }
    _updateTableSpec({
      column_names: colnames,
      column_widths: cwidths
    }, true);
  }
  function _hideColumn() {
    var hc_list = _toConsumableArray(mState.table_spec.hidden_columns_list);
    var fnames = _filteredColumnNames();
    var cname = mState.selected_column;
    var col_index = fnames.indexOf(cname);
    var cwidths = _toConsumableArray(mState.table_spec.column_widths);
    cwidths.splice(col_index, 1);
    hc_list.push(cname);
    _updateTableSpec({
      hidden_columns_list: hc_list,
      column_widths: cwidths
    }, true);
  }
  function _hideColumnInAll() {
    return _hideColumnInAll2.apply(this, arguments);
  }
  function _hideColumnInAll2() {
    _hideColumnInAll2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0() {
      var hc_list, fnames, cname, col_index, cwidths, data_dict;
      return _regenerator().w(function (_context0) {
        while (1) switch (_context0.n) {
          case 0:
            hc_list = _toConsumableArray(mState.table_spec.hidden_columns_list);
            fnames = _filteredColumnNames();
            cname = mState.selected_column;
            col_index = fnames.indexOf(cname);
            cwidths = _toConsumableArray(mState.table_spec.column_widths);
            cwidths.splice(col_index, 1);
            hc_list.push(cname);
            data_dict = {
              "column_name": mState.selected_column
            };
            _context0.n = 1;
            return _broadcast_event_promise("HideColumnInAllDocs", data_dict, false);
          case 1:
            _updateTableSpec({
              hidden_columns_list: hc_list,
              column_widths: cwidths
            }, true);
          case 2:
            return _context0.a(2);
        }
      }, _callee0);
    }));
    return _hideColumnInAll2.apply(this, arguments);
  }
  function _unhideAllColumns() {
    _updateTableSpec({
      hidden_columns_list: ["__filename__"]
    }, true);
  }
  var _clearTableScroll = (0, _react.useCallback)(function () {
    set_table_scroll.current = null;
  }, []);
  function _deleteRow() {
    return _deleteRow2.apply(this, arguments);
  }
  function _deleteRow2() {
    _deleteRow2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1() {
      return _regenerator().w(function (_context1) {
        while (1) switch (_context1.n) {
          case 0:
            _context1.n = 1;
            return (0, _communication_react.postPromiseMain)(props.local_id, "delete_row", {
              "document_name": mState.table_spec.current_doc_name,
              "index": mState.selected_row
            }).then(updateUpdateIndex);
          case 1:
            return _context1.a(2);
        }
      }, _callee1);
    }));
    return _deleteRow2.apply(this, arguments);
  }
  function _insertRow(_x5) {
    return _insertRow2.apply(this, arguments);
  }
  function _insertRow2() {
    _insertRow2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(index) {
      return _regenerator().w(function (_context10) {
        while (1) switch (_context10.n) {
          case 0:
            _context10.n = 1;
            return (0, _communication_react.postPromiseMain)(props.local_id, "insert_row", {
              "document_name": mState.table_spec.current_doc_name,
              "index": index,
              "row_dict": {}
            }, props.local_id).then(updateUpdateIndex);
          case 1:
            return _context10.a(2);
        }
      }, _callee10);
    }));
    return _insertRow2.apply(this, arguments);
  }
  function _duplicateRow() {
    return _duplicateRow2.apply(this, arguments);
  }
  function _duplicateRow2() {
    _duplicateRow2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11() {
      return _regenerator().w(function (_context11) {
        while (1) switch (_context11.n) {
          case 0:
            _context11.n = 1;
            return (0, _communication_react.postPromiseMain)(props.local_id, "insert_row", {
              "document_name": mState.table_spec.current_doc_name,
              "index": mState.selected_row,
              "row_dict": mState.data_row_dict[mState.selected_row]
            }, props.local_id).then(updateUpdateIndex);
          case 1:
            return _context11.a(2);
        }
      }, _callee11);
    }));
    return _duplicateRow2.apply(this, arguments);
  }
  function _deleteColumn() {
    return _deleteColumn2.apply(this, arguments);
  }
  function _deleteColumn2() {
    _deleteColumn2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12() {
      var delete_in_all,
        fnames,
        cname,
        col_index,
        cwidths,
        hc_list,
        cnames,
        data_dict,
        _args12 = arguments;
      return _regenerator().w(function (_context12) {
        while (1) switch (_context12.n) {
          case 0:
            delete_in_all = _args12.length > 0 && _args12[0] !== undefined ? _args12[0] : false;
            fnames = _filteredColumnNames();
            cname = mState.selected_column;
            col_index = fnames.indexOf(cname);
            cwidths = _toConsumableArray(mState.table_spec.column_widths);
            cwidths.splice(col_index, 1);
            hc_list = _lodash["default"].without(mState.table_spec.hidden_columns_list, cname);
            cnames = _lodash["default"].without(mState.table_spec.column_names, cname);
            _updateTableSpec({
              column_names: cnames,
              hidden_columns_list: hc_list,
              column_widths: cwidths
            }, false);
            data_dict = {
              "column_name": cname,
              "doc_name": mState.table_spec.current_doc_name,
              "all_docs": delete_in_all
            };
            _context12.n = 1;
            return (0, _communication_react.postPromiseMain)(props.local_id, "delete_column", data_dict, props.local_id).then(updateUpdateIndex);
          case 1:
            return _context12.a(2);
        }
      }, _callee12);
    }));
    return _deleteColumn2.apply(this, arguments);
  }
  function _addColumn() {
    return _addColumn2.apply(this, arguments);
  }
  function _addColumn2() {
    _addColumn2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13() {
      var add_in_all,
        title,
        new_name,
        cwidth,
        data_dict,
        _args13 = arguments,
        _t4;
      return _regenerator().w(function (_context13) {
        while (1) switch (_context13.n) {
          case 0:
            add_in_all = _args13.length > 0 && _args13[0] !== undefined ? _args13[0] : false;
            _context13.p = 1;
            title = add_in_all ? "Create Column All Documents" : "Create Column This Document";
            _context13.n = 2;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: title,
              field_title: "New Column Name",
              default_value: "newcol",
              existing_names: mState.table_spec.column_names,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 2:
            new_name = _context13.v;
            cwidth = (0, _blueprint_table.compute_added_column_width)(new_name);
            _updateTableSpec({
              column_names: [].concat(_toConsumableArray(mState.table_spec.column_names), [new_name]),
              column_widths: [].concat(_toConsumableArray(mState.table_spec.column_widths), [cwidth])
            }, false);
            data_dict = {
              "column_name": new_name,
              "doc_name": mState.table_spec.current_doc_name,
              "column_width": cwidth,
              "all_docs": add_in_all
            };
            _broadcast_event_to_server("CreateColumn", data_dict, updateUpdateIndex);
            _context13.n = 4;
            break;
          case 3:
            _context13.p = 3;
            _t4 = _context13.v;
            if (_t4 != "canceled") {
              errorDrawerFuncs.addFromError("Error adding column", _t4);
            }
          case 4:
            return _context13.a(2);
        }
      }, _callee13, null, [[1, 3]]);
    }));
    return _addColumn2.apply(this, arguments);
  }
  function _setStateFromDataObject(data, doc_name) {
    var func = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    mDispatch({
      type: "change_multiple_fields",
      newPartialState: {
        data_row_dict: data.data_row_dict,
        total_rows: data.total_rows,
        table_spec: {
          column_names: data.table_spec["header_list"],
          column_widths: data.table_spec.column_widths,
          hidden_columns_list: data.table_spec.hidden_columns_list,
          cell_backgrounds: data.table_spec.cell_backgrounds,
          current_doc_name: doc_name
        }
      }
    });
    pushCallback(func);
  }
  var _initiateDataGrab = (0, _react.useCallback)(/*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(row_index) {
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            _context2.n = 1;
            return _grabNewChunkWithRow(row_index);
          case 1:
            return _context2.a(2);
        }
      }, _callee2);
    }));
    return function (_x6) {
      return _ref2.apply(this, arguments);
    };
  }(), []);
  function _grabNewChunkWithRow(_x7) {
    return _grabNewChunkWithRow2.apply(this, arguments);
  }
  function _grabNewChunkWithRow2() {
    _grabNewChunkWithRow2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee14(row_index) {
      var data, _t5;
      return _regenerator().w(function (_context14) {
        while (1) switch (_context14.n) {
          case 0:
            _context14.p = 0;
            _context14.n = 1;
            return (0, _communication_react.postPromiseMain)(props.local_id, "grab_chunk_by_row_index", {
              doc_name: mStateRef.current.table_spec.current_doc_name,
              row_index: row_index
            }, props.local_id);
          case 1:
            data = _context14.v;
            mDispatch({
              type: "update_data_row_dict",
              new_data_row_dict: data.data_row_dict
            });
            _context14.n = 3;
            break;
          case 2:
            _context14.p = 2;
            _t5 = _context14.v;
            errorDrawerFuncs.addFromError("Error grabbing data chunk", _t5);
          case 3:
            return _context14.a(2);
        }
      }, _callee14, null, [[0, 2]]);
    }));
    return _grabNewChunkWithRow2.apply(this, arguments);
  }
  function _removeCollection() {
    return _removeCollection2.apply(this, arguments);
  }
  function _removeCollection2() {
    _removeCollection2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee15() {
      var result_dict, data_object, table_spec, _t6;
      return _regenerator().w(function (_context15) {
        while (1) switch (_context15.n) {
          case 0:
            _context15.p = 0;
            result_dict = {
              "new_collection_name": null,
              "local_id": props.local_id
            };
            _context15.n = 1;
            return (0, _communication_react.postPromiseMain)(props.local_id, "remove_collection_from_project", result_dict, props.local_id);
          case 1:
            data_object = _context15.v;
            table_spec = {
              current_doc_name: ""
            };
            mDispatch({
              type: "change_multiple_fields",
              newPartialState: {
                doc_names: [],
                table_is_shrunk: true,
                short_collection_name: data_object.short_collection_name,
                doc_type: "none",
                table_spec: table_spec
              }
            });
            _context15.n = 3;
            break;
          case 2:
            _context15.p = 2;
            _t6 = _context15.v;
            errorDrawerFuncs.addFromError("Error removing collection", _t6);
          case 3:
            return _context15.a(2);
        }
      }, _callee15, null, [[0, 2]]);
    }));
    return _removeCollection2.apply(this, arguments);
  }
  function _changeCollection() {
    return _changeCollection2.apply(this, arguments);
  }
  function _changeCollection2() {
    _changeCollection2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee16() {
      var data, new_collection_name, result_dict, data_object, table_spec, _t7;
      return _regenerator().w(function (_context16) {
        while (1) switch (_context16.n) {
          case 0:
            _context16.p = 0;
            statusFuncs.startSpinner();
            _context16.n = 1;
            return (0, _communication_react.postPromise)("host", "get_collection_names_task", {
              "user_id": user_id
            }, props.local_id);
          case 1:
            data = _context16.v;
            _context16.n = 2;
            return dialogFuncs.showModalPromise("SelectDialog", {
              title: "Select New Collection",
              select_label: "New Collection",
              cancel_text: "Cancel",
              submit_text: "Submit",
              option_list: data["collection_names"],
              handleClose: dialogFuncs.hideModal
            });
          case 2:
            new_collection_name = _context16.v;
            result_dict = {
              "new_collection_name": new_collection_name,
              "local_id": props.local_id
            };
            _context16.n = 3;
            return (0, _communication_react.postPromiseMain)(props.local_id, "change_collection", result_dict, props.local_id);
          case 3:
            data_object = _context16.v;
            if (!window.in_context && !_cProp("is_project")) document.title = new_collection_name;
            window._collection_name = data_object.collection_name;
            if (data_object.doc_type == "table") {
              table_spec = {
                column_names: data_object.table_spec["header_list"],
                column_widths: data_object.table_spec.column_widths,
                cell_backgrounds: data_object.table_spec.cell_backgrounds,
                hidden_columns_list: data_object.table_spec.hidden_columns_list,
                current_doc_name: data_object.doc_names[0]
              };
            } else if (data_object.doc_type == "freeform") {
              table_spec = {
                current_doc_name: data_object.doc_names[0]
              };
            } else {
              table_spec = {
                current_doc_name: ""
              };
            }
            mDispatch({
              type: "change_multiple_fields",
              newPartialState: {
                doc_names: data_object.doc_names,
                table_is_shrunk: data_object.doc_type == "none",
                short_collection_name: data_object.short_collection_name,
                doc_type: data_object.doc_type,
                table_spec: table_spec
              }
            });
            pushCallback(function () {
              _handleChangeDoc(data_object.doc_names[0]);
            });
            statusFuncs.clearStatusMessage();
            statusFuncs.stopSpinner();
            _context16.n = 5;
            break;
          case 4:
            _context16.p = 4;
            _t7 = _context16.v;
            if (_t7 != "canceled") {
              errorDrawerFuncs.addFromError("Error changing collection", _t7);
            }
            statusFuncs.clearStatusMessage();
            statusFuncs.stopSpinner();
          case 5:
            return _context16.a(2);
        }
      }, _callee16, null, [[0, 4]]);
    }));
    return _changeCollection2.apply(this, arguments);
  }
  function _updateDocList(doc_names, visible_doc) {
    _setMainStateValue("doc_names", doc_names);
    pushCallback(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.n) {
          case 0:
            _context3.n = 1;
            return _handleChangeDoc(visible_doc);
          case 1:
            return _context3.a(2);
        }
      }, _callee3);
    })));
  }
  function showMetadata() {
    _setMainStateValue("show_metadata", true);
  }
  function hideMetadata() {
    _setMainStateValue("show_metadata", false);
  }
  function toggleMetadata() {
    _setMainStateValue("show_metadata", !mStateRef.current.show_metadata);
  }
  function _setProjectName(new_project_name) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    if (props.controlled) {
      props.updatePanel({
        res_type: "project",
        title: new_project_name,
        panel: {
          resource_name: new_project_name,
          is_project: true
        }
      });
      pushCallback(function () {
        pushCallback(callback);
      });
    } else {
      mDispatch({
        type: "change_multiple_fields",
        newPartialState: {
          resource_name: new_project_name,
          is_project: true
        }
      });
      pushCallback(callback);
    }
  }
  var my_props = _objectSpread({}, props);
  if (!props.controlled) {
    my_props.is_project = mState.is_project;
    my_props.resource_name = mState.resource_name;
  }
  var disabled_column_items = [];
  if (mState.selected_column == null) {
    disabled_column_items = ["Shift Left", "Shift Right", "Hide", "Hide in All Docs", "Delete Column", "Delete Column In All Docs"];
  }
  var disabled_row_items = [];
  if (mState.selected_row == null) {
    disabled_row_items = ["Delete Row", "Insert Row Before", "Insert Row After", "Duplicate Row"];
  }
  var project_name = my_props.is_project ? props.resource_name : "";
  var disabled_project_items = [];
  if (!my_props.is_project) {
    disabled_project_items.push("Save");
  }
  if (mState.doc_type == "none") {
    disabled_project_items.push("Export Table as Collection");
    disabled_project_items.push("Remove Collection");
  }
  var menus = /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_main_menus_react.ProjectMenu, {
    local_id: props.local_id,
    project_name: project_name,
    is_notebook: props.is_notebook,
    is_juptyer: props.is_jupyter,
    setProjectName: _setProjectName,
    console_items: console_items_ref.current,
    pushCallback: pushCallback,
    dispatch: dispatch,
    tile_list: tile_list_ref.current,
    mState: mState,
    setMainStateValue: _setMainStateValue,
    updateLastSave: _updateLastSave,
    changeCollection: _changeCollection,
    removeCollection: _removeCollection,
    disabled_items: disabled_project_items,
    hidden_items: ["Export as Jupyter Notebook"]
  }), mState.doc_type != "none" && /*#__PURE__*/_react["default"].createElement(_main_menus_react.DocumentMenu, {
    local_id: props.local_id,
    documentNames: mState.doc_names,
    currentDoc: mState.table_spec.current_doc_name
  }), !isFreeform() && mState.doc_type != "none" && /*#__PURE__*/_react["default"].createElement(_main_menus_react.ColumnMenu, {
    local_id: props.local_id,
    project_name: project_name,
    is_notebook: props.is_notebook,
    is_juptyer: props.is_jupyter,
    moveColumn: _moveColumn,
    table_spec: mState.table_spec,
    filtered_column_names: _filteredColumnNames(),
    selected_column: mState.selected_column,
    disabled_items: disabled_column_items,
    hideColumn: _hideColumn,
    hideInAll: _hideColumnInAll,
    unhideAllColumns: _unhideAllColumns,
    addColumn: _addColumn,
    deleteColumn: _deleteColumn
  }), !isFreeform() && mState.doc_type != "none" && /*#__PURE__*/_react["default"].createElement(_main_menus_react.RowMenu, {
    local_id: props.local_id,
    project_name: project_name,
    is_notebook: props.is_notebook,
    is_juptyer: props.is_jupyter,
    deleteRow: _deleteRow,
    insertRowBefore: /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.n) {
          case 0:
            _context4.n = 1;
            return _insertRow(mState.selected_row);
          case 1:
            return _context4.a(2);
        }
      }, _callee4);
    })),
    insertRowAfter: /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.n) {
          case 0:
            _context5.n = 1;
            return _insertRow(mState.selected_row + 1);
          case 1:
            return _context5.a(2);
        }
      }, _callee5);
    })),
    duplicateRow: _duplicateRow,
    selected_row: mState.selected_row,
    disabled_items: disabled_row_items
  }), /*#__PURE__*/_react["default"].createElement(_main_menus_react.ViewMenu, {
    local_id: props.local_id,
    project_name: project_name,
    is_notebook: props.is_notebook,
    is_juptyer: props.is_jupyter,
    table_is_shrunk: mState.table_is_shrunk,
    toggleTableShrink: mState.doc_type == "none" ? null : _toggleTableShrink,
    show_exports_pane: mState.show_exports_pane,
    show_console_pane: mState.show_console_pane,
    show_metadata: mState.show_metadata,
    setMainStateValue: _setMainStateValue
  }), /*#__PURE__*/_react["default"].createElement(_core.NavbarDivider, null), create_tile_menus());
  var card_body;
  var card_header;
  if (mState.doc_type != "none") {
    card_header = /*#__PURE__*/_react["default"].createElement(_table_react.MainTableCardHeader, {
      local_id: props.local_id,
      toggleShrink: mState.doc_type == "none" ? null : _toggleTableShrink,
      mState: mState,
      setMainStateValue: _setMainStateValue,
      handleChangeDoc: _handleChangeDoc,
      handleSearchFieldChange: _handleSearchFieldChange,
      show_filter_button: !isFreeform(),
      handleSpreadsheetModeChange: _handleSpreadsheetModeChange,
      handleSoftWrapChange: _handleSoftWrapChange,
      errorDrawerFuncs: errorDrawerFuncs,
      is_freeform: isFreeform()
    });
    if (isFreeform()) {
      card_body = /*#__PURE__*/_react["default"].createElement(_table_react.FreeformBody, {
        local_id: props.local_id,
        mState: mState,
        setMainStateValue: _setMainStateValue
      });
    } else {
      card_body = /*#__PURE__*/_react["default"].createElement(_blueprint_table.BlueprintTable, {
        local_id: props.local_id,
        clearScroll: _clearTableScroll,
        initiateDataGrab: _initiateDataGrab,
        setCellContent: _setCellContent,
        filtered_column_names: _filteredColumnNames(),
        moveColumn: _moveColumn,
        updateTableSpec: _updateTableSpec,
        setMainStateValue: _setMainStateValue,
        mState: mState,
        set_scroll: set_table_scroll
      });
    }
  }
  var tile_pane = /*#__PURE__*/_react["default"].createElement(_tile_container.TileContainer, {
    local_id: props.local_id,
    tsocket: props.tsocket,
    tile_list: tile_list_ref,
    current_doc_name: mState.table_spec.current_doc_name,
    selected_row: mState.selected_row,
    table_is_shrunk: mState.table_is_shrunk,
    broadcast_event: _broadcast_event_to_server,
    goToModule: props.goToModule,
    tileDispatch: tileDispatch,
    setMainStateValue: _setMainStateValue
  });
  var exports_pane;
  if (mState.show_exports_pane) {
    exports_pane = /*#__PURE__*/_react["default"].createElement(_export_viewer_react.ExportsViewer, {
      local_id: props.local_id,
      tsocket: props.tsocket,
      setUpdate: function setUpdate(ufunc) {
        updateExportsList.current = ufunc;
      },
      setMainStateValue: _setMainStateValue,
      console_is_shrunk: mState.console_is_shrunk,
      console_is_zoomed: mState.console_is_zoomed
    });
  } else {
    exports_pane = /*#__PURE__*/_react["default"].createElement("div", null);
  }
  var console_pane;
  if (mState.show_console_pane) {
    console_pane = /*#__PURE__*/_react["default"].createElement(_console_component.ConsoleComponent, {
      local_id: props.local_id,
      tsocket: props.tsocket,
      handleCreateViewer: props.handleCreateViewer,
      controlled: props.controlled,
      console_items: console_items_ref,
      console_items_not_ref: console_items,
      console_selected_items_ref: console_selected_items_ref,
      set_console_selected_items: set_console_selected_items,
      dispatch: dispatch,
      mState: mState,
      setMainStateValue: _setMainStateValue,
      zoomable: true,
      shrinkable: true,
      style: null
    });
  } else {
    console_pane = /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        width: "100%"
      }
    });
  }
  var bottom_pane = /*#__PURE__*/_react["default"].createElement(_resizing_allotment.HorizontalPanes, {
    left_pane: console_pane,
    right_pane: exports_pane,
    show_handle: true,
    fixed_height: mState.console_is_shrunk,
    initial_width_fraction: mState.console_width_fraction,
    handleSplitUpdate: _handleConsoleFractionChange
  });
  var table_pane;
  if (mState.doc_type != "none") {
    table_pane = /*#__PURE__*/_react["default"].createElement(_table_react.MainTableCard, {
      style: {
        padding: 0
      },
      card_body: card_body,
      card_header: card_header
    });
  }
  var top_pane;
  if (mState.table_is_shrunk) {
    top_pane = tile_pane;
  } else {
    top_pane = /*#__PURE__*/_react["default"].createElement(_resizing_allotment.HorizontalPanes, {
      left_pane: table_pane,
      right_pane: tile_pane,
      show_handle: true,
      initial_width_fraction: mState.horizontal_fraction,
      handleSplitUpdate: _handleHorizontalFractionChange
    });
  }
  var extra_menubar_buttons = [];
  if (mState.doc_type != "none") {
    extra_menubar_buttons = [{
      onClick: _toggleTableShrink,
      icon: mState.table_is_shrunk ? "th" : "th-disconnect"
    }];
  }
  var outer_style = {
    width: "calc(100% - ".concat(_sizing_tools.ICON_BAR_WIDTH, "px)"),
    height: "100%",
    flex: "1 1 0",
    minHeight: 0,
    overflow: "auto",
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 0,
    position: "relative"
  };
  return /*#__PURE__*/_react["default"].createElement(_error_boundary.ErrorBoundary, null, !window.in_context && /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    user_name: window.username,
    menus: null
  }), /*#__PURE__*/_react["default"].createElement(_metadata_drawer.MetadataContext.Provider, {
    value: {
      showMetadata: showMetadata,
      toggleMetadata: toggleMetadata,
      hideMetadata: hideMetadata
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "main-outer ".concat(settingsContext.isDark() ? "bp6-dark" : "light-theme"),
    ref: main_outer_ref,
    style: outer_style
  }, /*#__PURE__*/_react["default"].createElement(_menu_utilities.TacticMenubar, {
    connection_status: connection_status,
    menus: menus,
    showRefresh: true,
    showClose: true,
    refreshTab: props.refreshTab,
    closeTab: props.closeTab,
    resource_name: _cProp("resource_name"),
    showIconBar: true,
    showErrorDrawerButton: true,
    showMetadataDrawerButton: true,
    showAssistantDrawerButton: true,
    showSettingsDrawerButton: true,
    extraButtons: extra_menubar_buttons
  }), /*#__PURE__*/_react["default"].createElement(_error_boundary.ErrorBoundary, null, mState.console_is_zoomed && /*#__PURE__*/_react["default"].createElement(_resizing_allotment.HorizontalPanes, {
    left_pane: console_pane,
    right_pane: exports_pane,
    show_handle: true,
    fixed_height: mState.console_is_shrunk,
    initial_width_fraction: mState.console_width_fraction,
    className: "project-outer-padding",
    handleSplitUpdate: _handleConsoleFractionChange
  }), !mState.console_is_zoomed && mState.console_is_shrunk && /*#__PURE__*/_react["default"].createElement("div", {
    className: "project-outer-padding",
    style: {
      flex: "1 1 0",
      minHeight: 0,
      overflow: "auto",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      flex: "1 1 0",
      minWidth: 0,
      overflow: "auto"
    }
  }, top_pane), /*#__PURE__*/_react["default"].createElement("div", {
    className: "shrunk-console"
  }, bottom_pane)), !mState.console_is_zoomed && !mState.console_is_shrunk && /*#__PURE__*/_react["default"].createElement(_resizing_allotment.VerticalPanes, {
    top_pane: top_pane,
    bottom_pane: bottom_pane,
    show_handle: true,
    initial_height_fraction: mState.height_fraction,
    handleSplitUpdate: _handleVerticalSplitUpdate,
    className: "project-outer-padding",
    overflow: "hidden"
  }))), /*#__PURE__*/_react["default"].createElement(_metadata_drawer.MetadataDrawer, {
    res_type: "project",
    res_name: _cProp("resource_name"),
    tsocket: props.tsocket,
    readOnly: false,
    is_repository: false,
    show_drawer: mState.show_metadata,
    position: "right",
    onClose: hideMetadata,
    size: "45%"
  })));
}
exports.MainApp = MainApp = /*#__PURE__*/(0, _react.memo)(MainApp);
function main_main() {
  function gotProps(the_props) {
    var MainAppPlus = (0, _utilities_react.withRegisterActivity)((0, _pool_tree.withPool)((0, _settings.withSettings)((0, _modal_react.withDialogs)((0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)((0, _assistant.withAssistant)(MainApp)))))));
    var the_element = /*#__PURE__*/_react["default"].createElement(MainAppPlus, _extends({}, the_props, {
      controlled: false,
      changeName: null
    }));
    var domContainer = document.querySelector('#main-root');
    var root = (0, _client.createRoot)(domContainer);
    root.render(/*#__PURE__*/_react["default"].createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        position: "relative",
        height: "100%",
        width: "100%"
      }
    }, the_element));
  }
  (0, _utilities_react.renderSpinnerMessage)("Starting up ...");
  var local_id = "a" + (0, _utilities_react.guid)();
  window.global_id = local_id;
  var resource_name = window.project_name == "" ? window.collection_name : window.project_name;
  var tsocket = new _tactic_socket.TacticSocket("main", 5000, "project", local_id, /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee17() {
    return _regenerator().w(function (_context17) {
      while (1) switch (_context17.n) {
        case 0:
          tsocket.attachListener('handle-callback', function (task_packet) {
            (0, _communication_react.handleCallback)(task_packet, local_id);
          });
          if (window.project_name == "") {
            if (window.collection_name != "") {
              (0, _communication_react.postPromise)("main_service", "initialize_session_from_collection", {
                collection_name: resource_name,
                global_id: window.global_id,
                base_figure_url: window.base_figure_url,
                local_id: local_id,
                username: window.username,
                ppi: (0, _utilities_react.get_ppi)()
              }).then(function (data) {
                data.tsocket = tsocket;
                data.local_id = local_id;
                data.read_only = window.read_only;
                data.is_repository = window.is_repository;
                (0, _main_support.main_props)(data, null, gotProps);
              });
            } else {
              (0, _communication_react.postPromise)("main_service", "initialize_session_for_new_project", {
                base_figure_url: window.base_figure_url,
                global_id: window.global_id,
                local_id: local_id,
                username: window.username,
                ppi: (0, _utilities_react.get_ppi)()
              }).then(function (data) {
                data.tsocket = tsocket;
                data.local_id = local_id;
                data.read_only = window.read_only;
                data.is_repository = window.is_repository;
                (0, _main_support.main_props)(data, null, gotProps);
              });
            }
          } else {
            (0, _communication_react.postPromise)("main_service", "initialize_session_from_save", {
              project_name: resource_name,
              global_id: window.global_id,
              base_figure_url: window.base_figure_url,
              local_id: local_id,
              username: window.username,
              ppi: (0, _utilities_react.get_ppi)()
            }).then(function (data) {
              data.tsocket = tsocket;
              data.local_id = local_id;
              data.read_only = window.read_only;
              data.is_repository = window.is_repository;
              (0, _main_support.main_props)(data, null, gotProps);
            });
          }
        case 1:
          return _context17.a(2);
      }
    }, _callee17);
  })));
}
if (!window.in_context) {
  main_main();
}
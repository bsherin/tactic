"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LibraryPane = LibraryPane;
exports.res_types = void 0;
exports.view_views = view_views;
var _react = _interopRequireWildcard(require("react"));
var _core = require("@blueprintjs/core");
var _table = require("@blueprintjs/table");
var _blueprint_mdata_fields = require("./blueprint_mdata_fields");
var _resizing_allotment = require("./resizing_allotment");
var _communication_react = require("./communication_react");
var _toaster = require("./toaster");
var _utilities_react = require("./utilities_react");
var _modal_react = require("./modal_react");
var _error_drawer = require("./error_drawer");
var _library_table_pane = require("./library_table_pane");
var _library_pane_reducer = require("./library_pane_reducer");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t25 in e) "default" !== _t25 && {}.hasOwnProperty.call(e, _t25) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t25)) && (i.get || i.set) ? o(f, _t25, i) : f[_t25] = e[_t25]); return f; })(e, t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
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
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } // noinspection JSValidateTypes,JSDeprecatedSymbols
var res_types = exports.res_types = ["collection", "project", "tile", "list", "code"];
function view_views() {
  var is_repository = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  if (is_repository) {
    return {
      collection: null,
      project: null,
      tile: "/repository_view_module/",
      list: "/repository_view_list/",
      code: "/repository_view_code/"
    };
  } else {
    return {
      collection: "/main_collection/",
      project: "/main_project/",
      tile: "/last_saved_view/",
      list: "/view_list/",
      code: "/view_code/"
    };
  }
}
function duplicate_views() {
  return {
    collection: "/duplicate_collection",
    project: "/duplicate_project",
    tile: "/create_duplicate_tile",
    list: "/create_duplicate_list",
    code: "/create_duplicate_code"
  };
}
function BodyMenu(props) {
  function getIntent(item) {
    return item.intent ? item.intent : null;
  }
  var menu_items = props.items.map(function (item, index) {
    if (item.text == "__divider__") {
      return /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, {
        key: index
      });
    } else {
      var the_row = props.selected_rows[0];
      var disabled = item.res_type && the_row.res_type != item.res_type;
      return /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: item.icon,
        disabled: disabled,
        onClick: function onClick() {
          return item.onClick(the_row);
        },
        intent: getIntent(item),
        key: item.text,
        text: item.text
      });
    }
  });
  return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, {
    title: props.selected_rows[0].name,
    className: "context-menu-header"
  }), menu_items);
}
var metadata_outer_style = {
  marginTop: 0,
  marginLeft: 0,
  overflow: "auto",
  padding: 25,
  marginRight: 0,
  height: "100%"
};
var initial_state = {
  data_dict: {},
  num_rows: 0,
  tag_list: [],
  contextMenuItems: [],
  select_state: {
    selected_resource: {
      "name": "",
      "_id": "",
      "tags": "",
      "notes": "",
      "updated": "",
      "created": ""
    },
    selected_rows: [],
    multi_select: false,
    list_of_selected: [],
    selectedRegions: [_table.Regions.row(0)]
  },
  search_state: {
    sort_field: "updated",
    sort_direction: "descending",
    expanded_tags: [],
    active_tag: "all",
    tagRoot: "all",
    search_string: "",
    search_inside: false,
    search_metadata: false,
    filterType: "all",
    show_hidden: false
  },
  rowChanged: 0
};
function LibraryPane(props) {
  props = _objectSpread({
    columns: {
      "name": {
        "first_sort": "ascending"
      },
      "created": {
        "first_sort": "descending"
      },
      "updated": {
        "first_sort": "ascending"
      },
      "tags": {
        "first_sort": "ascending"
      }
    },
    is_repository: false,
    tsocket: null
  }, props);
  var _useImmerReducerAndRe = (0, _utilities_react.useImmerReducerAndRef)(_library_pane_reducer.paneReducer, initial_state),
    _useImmerReducerAndRe2 = _slicedToArray(_useImmerReducerAndRe, 3),
    pState = _useImmerReducerAndRe2[0],
    pDispatch = _useImmerReducerAndRe2[1],
    pStateRef = _useImmerReducerAndRe2[2];
  var top_ref = (0, _react.useRef)(null);
  var previous_search_spec = (0, _react.useRef)(null);
  var blank_selected_resource = (0, _react.useRef)({});
  var selectedTypeRef = (0, _react.useRef)(null);
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  var statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  var _handleArrowKeyPress = (0, _react.useCallback)(/*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(key) {
      var the_res, current_index, new_index;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            if (!pStateRef.current.select_state.multi_select) {
              _context.n = 1;
              break;
            }
            return _context.a(2);
          case 1:
            the_res = pStateRef.current.select_state.selected_resource;
            current_index = parseInt((0, _library_pane_reducer.get_index)(the_res.name, the_res.res_type, pStateRef.current.data_dict));
            if (!(key == "ArrowDown")) {
              _context.n = 2;
              break;
            }
            new_index = current_index + 1;
            _context.n = 3;
            break;
          case 2:
            new_index = current_index - 1;
            if (!(new_index < 0)) {
              _context.n = 3;
              break;
            }
            return _context.a(2);
          case 3:
            _context.n = 4;
            return _selectRow(new_index);
          case 4:
            return _context.a(2);
        }
      }, _callee);
    }));
    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }(), [pStateRef.current.select_state.multi_select, pStateRef.current.select_state.selected_resource, pStateRef.current.data_dict]);
  var _view_func = (0, _react.useCallback)(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
    var the_view,
      re,
      data,
      _args2 = arguments,
      _t;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          the_view = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : null;
          if (the_view == null) {
            the_view = view_views(props.is_repository)[pStateRef.current.select_state.selected_resource.res_type];
          }
          statusFuncs.setStatus({
            show_spinner: true,
            status_message: "Opening ..."
          });
          if (!window.in_context) {
            _context2.n = 5;
            break;
          }
          re = new RegExp("/$");
          the_view = the_view.replace(re, "_in_context");
          _context2.p = 1;
          _context2.n = 2;
          return (0, _communication_react.postAjaxPromise)(the_view, {
            context_id: context_id,
            resource_name: pStateRef.current.select_state.selected_resource.name
          });
        case 2:
          data = _context2.v;
          props.handleCreateViewer(data, statusFuncs.clearStatus);
          _context2.n = 4;
          break;
        case 3:
          _context2.p = 3;
          _t = _context2.v;
          statusFuncs.clearStatus();
          errorDrawerFuncs.addFromError("Error viewing with view ".concat(the_view), _t);
        case 4:
          _context2.n = 6;
          break;
        case 5:
          statusFuncs.clearStatus();
          window.open($SCRIPT_ROOT + the_view + pStateRef.current.select_state.selected_resource.name);
        case 6:
          return _context2.a(2);
      }
    }, _callee2, null, [[1, 3]]);
  })), [pStateRef.current.select_state.selected_resource]);
  function _unsearch() {
    return _unsearch2.apply(this, arguments);
  }
  function _unsearch2() {
    _unsearch2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
      return _regenerator().w(function (_context8) {
        while (1) switch (_context8.n) {
          case 0:
            if (!(pStateRef.current.search_state.search_string != "")) {
              _context8.n = 1;
              break;
            }
            _update_search_state({
              search_string: ""
            });
            _context8.n = 3;
            break;
          case 1:
            if (!(pStateRef.current.search_state.active_tag != "all")) {
              _context8.n = 2;
              break;
            }
            _update_search_state({
              active_tag: "all"
            });
            _context8.n = 3;
            break;
          case 2:
            if (!(props.pane_type == "all" && pStateRef.current.search_state.filterType != "all")) {
              _context8.n = 3;
              break;
            }
            _context8.n = 3;
            return _setFilterType("all");
          case 3:
            return _context8.a(2);
        }
      }, _callee8);
    }));
    return _unsearch2.apply(this, arguments);
  }
  var hotkeys = (0, _react.useMemo)(function () {
    return [{
      combo: "Enter",
      global: false,
      group: "Library",
      label: "Open Selected Resource",
      onKeyDown: function () {
        var _onKeyDown = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
          return _regenerator().w(function (_context3) {
            while (1) switch (_context3.n) {
              case 0:
                _context3.n = 1;
                return _view_func();
              case 1:
                return _context3.a(2);
            }
          }, _callee3);
        }));
        function onKeyDown() {
          return _onKeyDown.apply(this, arguments);
        }
        return onKeyDown;
      }()
    }, {
      combo: "ArrowDown",
      global: false,
      group: "Library",
      label: "Move Selection Down",
      onKeyDown: function () {
        var _onKeyDown2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
          return _regenerator().w(function (_context4) {
            while (1) switch (_context4.n) {
              case 0:
                _context4.n = 1;
                return _handleArrowKeyPress("ArrowDown");
              case 1:
                return _context4.a(2);
            }
          }, _callee4);
        }));
        function onKeyDown() {
          return _onKeyDown2.apply(this, arguments);
        }
        return onKeyDown;
      }()
    }, {
      combo: "ArrowUp",
      global: false,
      group: "Library",
      label: "Move Selection Up",
      onKeyDown: function () {
        var _onKeyDown3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
          return _regenerator().w(function (_context5) {
            while (1) switch (_context5.n) {
              case 0:
                _context5.n = 1;
                return _handleArrowKeyPress("ArrowUp");
              case 1:
                return _context5.a(2);
            }
          }, _callee5);
        }));
        function onKeyDown() {
          return _onKeyDown3.apply(this, arguments);
        }
        return onKeyDown;
      }()
    }, {
      combo: "Escape",
      global: false,
      group: "Library",
      label: "Undo Search",
      onKeyDown: _unsearch
    }];
  }, [_view_func, _handleArrowKeyPress, _unsearch]);
  var _useHotkeys = (0, _core.useHotkeys)(hotkeys),
    handleKeyDown = _useHotkeys.handleKeyDown,
    handleKeyUp = _useHotkeys.handleKeyUp;
  (0, _utilities_react.useConstructor)(function () {
    for (var col in props.columns) {
      blank_selected_resource.current[col] = "";
    }
  });
  (0, _react.useEffect)(function () {
    initSocket();
    _grabNewChunkWithRow(0).then(function () {});
  }, []);
  var pushCallback = (0, _utilities_react.useCallbackStack)("library_home");
  function initSocket() {
    if (props.tsocket != null && !props.is_repository) {
      props.tsocket.attachListener("update-selector-row", _handleRowUpdate);
      props.tsocket.attachListener("refresh-selector", _refresh_func);
    } else if (props.tsocket != null && props.is_repository) {
      props.tsocket.attachListener("update-repository-selector-row", _handleRowUpdate);
      props.tsocket.attachListener("refresh-repository-selector", _refresh_func);
    }
  }
  function _renderBodyContextMenu(menu_context) {
    if (event) {
      event.preventDefault();
    }
    var regions = menu_context.regions;
    if (regions.length == 0) return null; // Without this get an error when clicking on a body cell
    var selected_rows = [];
    var _iterator = _createForOfIteratorHelper(regions),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var region = _step.value;
        if (region.hasOwnProperty("rows")) {
          var first_row = region["rows"][0];
          var last_row = region["rows"][1];
          for (var i = first_row; i <= last_row; ++i) {
            if (!selected_rows.includes(i)) {
              selected_rows.push(pStateRef.current.data_dict[i]);
            }
          }
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return /*#__PURE__*/_react["default"].createElement(BodyMenu, {
      items: pStateRef.current.contextMenuItems,
      selected_rows: selected_rows
    });
  }
  function _setFilterType(_x2) {
    return _setFilterType2.apply(this, arguments);
  }
  function _setFilterType2() {
    _setFilterType2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(rtype) {
      var sres;
      return _regenerator().w(function (_context0) {
        while (1) switch (_context0.n) {
          case 0:
            if (!(rtype == pStateRef.current.search_state.filterType)) {
              _context0.n = 1;
              break;
            }
            return _context0.a(2);
          case 1:
            if (pStateRef.current.search_state.multi_select) {
              _context0.n = 2;
              break;
            }
            sres = pStateRef.current.select_state.selected_resource;
            if (!(sres.name != "" && sres.notes != get_data_dict_entry(sres.name, sres.res_type).notes)) {
              _context0.n = 2;
              break;
            }
            _context0.n = 2;
            return _saveFromSelectedResource();
          case 2:
            pDispatch({
              type: "UPDATE_SEARCH_STATE",
              search_state: {
                filterType: rtype
              }
            });
            clearSelected();
            pushCallback(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9() {
              return _regenerator().w(function (_context9) {
                while (1) switch (_context9.n) {
                  case 0:
                    _context9.n = 1;
                    return _grabNewChunkWithRow(0, true, null, true);
                  case 1:
                    return _context9.a(2);
                }
              }, _callee9);
            })));
          case 3:
            return _context0.a(2);
        }
      }, _callee0);
    }));
    return _setFilterType2.apply(this, arguments);
  }
  function clearSelected() {
    pDispatch({
      type: "CLEAR_SELECTED"
    });
  }
  function compactRowsToRegions(rowIndices) {
    if (rowIndices.length === 0) return [];
    var regions = [];
    var start = rowIndices[0];
    var end = rowIndices[0];
    for (var i = 1; i < rowIndices.length; i++) {
      var current = rowIndices[i];
      if (current === end + 1) {
        end = current;
      } else {
        regions.push({
          rows: [start, end]
        });
        start = current;
        end = current;
      }
    }
    regions.push({
      rows: [start, end]
    });
    return regions;
  }
  function _onTableSelection(_x3) {
    return _onTableSelection2.apply(this, arguments);
  }
  function _onTableSelection2() {
    _onTableSelection2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(regions) {
      var selected_rows, selected_row_indices, _iterator3, _step3, region, _region$rows, first_row, last_row, i, sortedIndices, revised_regions;
      return _regenerator().w(function (_context1) {
        while (1) switch (_context1.n) {
          case 0:
            if (!(regions.length === 0)) {
              _context1.n = 1;
              break;
            }
            return _context1.a(2);
          case 1:
            selected_rows = [];
            selected_row_indices = new Set();
            _iterator3 = _createForOfIteratorHelper(regions);
            try {
              for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                region = _step3.value;
                if (region.hasOwnProperty("rows")) {
                  _region$rows = _slicedToArray(region.rows, 2), first_row = _region$rows[0], last_row = _region$rows[1];
                  for (i = first_row; i <= last_row; ++i) {
                    if (!selected_row_indices.has(i)) {
                      selected_row_indices.add(i);
                      selected_rows.push(pStateRef.current.data_dict[i]);
                    }
                  }
                }
              }
            } catch (err) {
              _iterator3.e(err);
            } finally {
              _iterator3.f();
            }
            sortedIndices = Array.from(selected_row_indices).sort(function (a, b) {
              return a - b;
            });
            revised_regions = compactRowsToRegions(sortedIndices);
            _context1.n = 2;
            return _handleRowSelection(selected_rows);
          case 2:
            pDispatch({
              type: "UPDATE_SELECT_STATE",
              select_state: {
                selectedRegions: revised_regions
              }
            });
          case 3:
            return _context1.a(2);
        }
      }, _callee1);
    }));
    return _onTableSelection2.apply(this, arguments);
  }
  function _grabNewChunkWithRow(_x4) {
    return _grabNewChunkWithRow2.apply(this, arguments);
  }
  function _grabNewChunkWithRow2() {
    _grabNewChunkWithRow2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(row_index) {
      var flush,
        spec_update,
        select,
        select_by_name,
        callback,
        search_spec,
        args,
        data,
        _args10 = arguments,
        _t3;
      return _regenerator().w(function (_context10) {
        while (1) switch (_context10.n) {
          case 0:
            flush = _args10.length > 1 && _args10[1] !== undefined ? _args10[1] : false;
            spec_update = _args10.length > 2 && _args10[2] !== undefined ? _args10[2] : null;
            select = _args10.length > 3 && _args10[3] !== undefined ? _args10[3] : false;
            select_by_name = _args10.length > 4 && _args10[4] !== undefined ? _args10[4] : null;
            callback = _args10.length > 5 && _args10[5] !== undefined ? _args10[5] : null;
            search_spec = _objectSpread({}, pStateRef.current.search_state);
            if (search_spec.active_tag == "all") {
              search_spec.active_tag = null;
            }
            if (spec_update) {
              search_spec = Object.assign(search_spec, spec_update);
            }
            if (search_spec.active_tag && search_spec.active_tag[0] != "/") {
              search_spec.active_tag = "/" + search_spec.active_tag;
            }
            args = {
              pane_type: pStateRef.current.search_state.filterType,
              search_spec: search_spec,
              row_number: row_index,
              is_repository: props.is_repository
            };
            /** @type {{ chunk_dict: object, all_tags: array, num_rows: int }} */
            _context10.p = 1;
            _context10.n = 2;
            return (0, _communication_react.postAjaxPromise)("grab_all_list_chunk", args);
          case 2:
            data = _context10.v;
            if (flush) {
              pDispatch({
                type: "INIT_DATA_DICT",
                data_dict: data.chunk_dict,
                num_rows: data.num_rows
              });
            } else {
              pDispatch({
                type: "UPDATE_DATA_DICT",
                data_dict: data.chunk_dict,
                num_rows: data.num_rows
              });
            }
            previous_search_spec.current = search_spec;
            set_tag_list(data.all_tags);
            if (callback) {
              pushCallback(callback);
            } else if (select || pStateRef.current.select_state.selected_resource.name == "") {
              pushCallback(function () {
                _selectRow(row_index);
              });
            }
            _context10.n = 4;
            break;
          case 3:
            _context10.p = 3;
            _t3 = _context10.v;
            errorDrawerFuncs.addFromError("Error grabbing resource chunk", _t3);
          case 4:
            return _context10.a(2);
        }
      }, _callee10, null, [[1, 3]]);
    }));
    return _grabNewChunkWithRow2.apply(this, arguments);
  }
  function set_tag_list(tag_list) {
    pDispatch({
      type: "SET_TAG_LIST",
      tag_list: tag_list
    });
  }
  function _handleRowUpdate(_x5) {
    return _handleRowUpdate2.apply(this, arguments);
  }
  function _handleRowUpdate2() {
    _handleRowUpdate2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12(res_dict) {
      var res_name, ind, _id, event_type, the_row, selected_ind, new_selected_ind, _t4;
      return _regenerator().w(function (_context12) {
        while (1) switch (_context12.n) {
          case 0:
            res_name = res_dict.name;
            event_type = res_dict.event_type;
            delete res_dict.event_type;
            _t4 = event_type;
            _context12.n = _t4 === "update" ? 1 : _t4 === "insert" ? 3 : _t4 === "delete" ? 5 : 6;
            break;
          case 1:
            if ("_id" in res_dict) {
              _id = res_dict._id;
              ind = (0, _library_pane_reducer.get_index_from_id)(res_dict._id, pStateRef.current.data_dict);
            } else {
              ind = (0, _library_pane_reducer.get_index)(res_name, res_dict.res_type, pStateRef.current.data_dict);
              if (ind) {
                _id = pStateRef.current.data_dict[ind]._id;
              }
            }
            if (ind) {
              _context12.n = 2;
              break;
            }
            return _context12.a(2);
          case 2:
            pDispatch({
              type: "UPDATE_ROW",
              index: ind,
              res_dict: res_dict
            });
            // if ("tags" in res_dict) {
            //     let data_dict = {
            //         pane_type: props.pane_type,
            //         is_repository: props.is_repository,
            //         show_hidden: pStateRef.current.search_state.show_hidden
            //     };
            //     let data = await postAjaxPromise("get_tag_list", data_dict);
            //     let all_tags = data.tag_list;
            //     set_tag_list(all_tags);
            // }
            if (_id == pStateRef.current.select_state.selected_resource._id) {
              the_row = _objectSpread(_objectSpread({}, pStateRef.current.data_dict[ind]), res_dict);
              pDispatch({
                type: "UPDATE_SELECT_STATE",
                select_state: {
                  selected_resource: the_row
                }
              });
            }
            return _context12.a(3, 7);
          case 3:
            _context12.n = 4;
            return _grabNewChunkWithRow(0, true, null, false, res_name);
          case 4:
            return _context12.a(3, 7);
          case 5:
            if ("_id" in res_dict) {
              ind = parseInt((0, _library_pane_reducer.get_index_from_id)(res_dict._id, pStateRef.current.data_dict));
            } else {
              ind = parseInt((0, _library_pane_reducer.get_index)(res_name, res_dict.res_type, pStateRef.current.data_dict));
            }
            selected_ind = null;
            if ("_id" in pStateRef.current.select_state.selected_resource) {
              selected_ind = parseInt((0, _library_pane_reducer.get_index_from_id)(pStateRef.current.select_state.selected_resource._id, pStateRef.current.data_dict));
            }
            new_selected_ind = selected_ind;
            if (selected_ind > ind) {
              new_selected_ind = selected_ind - 1;
            }
            pDispatch({
              type: "DELETE_ROW",
              index: ind
            });
            pushCallback(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11() {
              return _regenerator().w(function (_context11) {
                while (1) switch (_context11.n) {
                  case 0:
                    _context11.n = 1;
                    return _grabNewChunkWithRow(ind, false, null, false, null, function () {
                      if (new_selected_ind) {
                        _selectRow(new_selected_ind);
                      } else {
                        clearSelected();
                      }
                    });
                  case 1:
                    return _context11.a(2);
                }
              }, _callee11);
            })));
            return _context12.a(3, 7);
          case 6:
            return _context12.a(2);
          case 7:
            return _context12.a(2);
        }
      }, _callee12);
    }));
    return _handleRowUpdate2.apply(this, arguments);
  }
  function get_data_dict_entry(name, res_type) {
    for (var index in pStateRef.current.data_dict) {
      var the_row = pStateRef.current.data_dict[index];
      if (the_row.name == name && the_row.res_type == res_type) {
        return pStateRef.current.data_dict[index];
      }
    }
    return null;
  }
  function _saveFromSelectedResource() {
    return _saveFromSelectedResource2.apply(this, arguments);
  }
  function _saveFromSelectedResource2() {
    _saveFromSelectedResource2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13() {
      var result_dict, _t5;
      return _regenerator().w(function (_context13) {
        while (1) switch (_context13.n) {
          case 0:
            // This will only be called when there is a single row selected
            result_dict = {
              "res_type": pStateRef.current.select_state.selected_rows[0].res_type,
              "res_name": pStateRef.current.select_state.list_of_selected[0],
              "tags": pStateRef.current.select_state.selected_resource.tags,
              "notes": pStateRef.current.select_state.selected_resource.notes
            };
            if (pStateRef.current.select_state.selected_rows[0].res_type == "tile" && "icon" in pStateRef.current.select_state.selected_resource) {
              result_dict["icon"] = pStateRef.current.select_state.selected_resource["icon"];
            }
            _context13.p = 1;
            _context13.n = 2;
            return (0, _communication_react.postAjaxPromise)("save_metadata", result_dict);
          case 2:
            _context13.n = 4;
            break;
          case 3:
            _context13.p = 3;
            _t5 = _context13.v;
            errorDrawerFuncs.addFromError("Error updating resource ".concat(result_dict.res_name), _t5);
          case 4:
            return _context13.a(2);
        }
      }, _callee13, null, [[1, 3]]);
    }));
    return _saveFromSelectedResource2.apply(this, arguments);
  }
  function _handleRowDoubleClick(row_dict) {
    var view_view = view_views(props.is_repository)[row_dict.res_type];
    if (view_view == null) return;
    statusFuncs.setStatus({
      show_spinner: true,
      status_message: "Opening ..."
    });
    pDispatch({
      type: "UPDATE_SELECT_STATE",
      select_state: {
        selected_resource: row_dict,
        multi_select: false,
        list_of_selected: [row_dict.name],
        selected_rows: [row_dict]
      }
    });
    pushCallback(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
      var re, data, _t2;
      return _regenerator().w(function (_context6) {
        while (1) switch (_context6.n) {
          case 0:
            if (!window.in_context) {
              _context6.n = 5;
              break;
            }
            re = new RegExp("/$");
            view_view = view_view.replace(re, "_in_context");
            _context6.p = 1;
            _context6.n = 2;
            return (0, _communication_react.postAjaxPromise)(view_view, {
              context_id: context_id,
              resource_name: row_dict.name
            });
          case 2:
            data = _context6.v;
            props.handleCreateViewer(data, statusFuncs.clearStatus);
            _context6.n = 4;
            break;
          case 3:
            _context6.p = 3;
            _t2 = _context6.v;
            statusFuncs.clearStatus();
            errorDrawerFuncs.addFromError("Error handling double click with view ".concat(view_view), _t2);
          case 4:
            _context6.n = 6;
            break;
          case 5:
            statusFuncs.clearStatus();
            window.open($SCRIPT_ROOT + view_view + row_dict.name);
          case 6:
            return _context6.a(2);
        }
      }, _callee6, null, [[1, 3]]);
    })));
  }
  function _selectedTypes() {
    var the_types = pStateRef.current.select_state.selected_rows.map(function (row) {
      return row.res_type;
    });
    the_types = _toConsumableArray(new Set(the_types));
    return the_types;
  }
  function _handleRowSelection(_x6) {
    return _handleRowSelection2.apply(this, arguments);
  }
  function _handleRowSelection2() {
    _handleRowSelection2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee14(selected_rows) {
      var sres, common_tags, other_rows, _iterator4, _step4, row_dict, new_common_tags, new_tag_list, _iterator5, _step5, tag, multi_select_list, new_selected_resource, _row_dict;
      return _regenerator().w(function (_context14) {
        while (1) switch (_context14.n) {
          case 0:
            if (pStateRef.current.select_state.multi_select) {
              _context14.n = 1;
              break;
            }
            sres = pStateRef.current.select_state.selected_resource;
            if (!(sres.name != "" && get_data_dict_entry(sres.name, sres.res_type) && sres.notes != get_data_dict_entry(sres.name, sres.res_type).notes)) {
              _context14.n = 1;
              break;
            }
            _context14.n = 1;
            return _saveFromSelectedResource();
          case 1:
            if (selected_rows.length > 1) {
              // I think the common_tags stuff doesn't currently do anything
              common_tags = selected_rows[0].tags.split(" ");
              other_rows = selected_rows.slice(1, selected_rows.length);
              _iterator4 = _createForOfIteratorHelper(other_rows);
              try {
                for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                  row_dict = _step4.value;
                  new_common_tags = [];
                  new_tag_list = row_dict.tags.split(" ");
                  _iterator5 = _createForOfIteratorHelper(new_tag_list);
                  try {
                    for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
                      tag = _step5.value;
                      if (common_tags.includes(tag)) {
                        new_common_tags.push(tag);
                      }
                    }
                  } catch (err) {
                    _iterator5.e(err);
                  } finally {
                    _iterator5.f();
                  }
                  common_tags = new_common_tags;
                }
              } catch (err) {
                _iterator4.e(err);
              } finally {
                _iterator4.f();
              }
              multi_select_list = selected_rows.map(function (row_dict) {
                return row_dict.name;
              });
              new_selected_resource = {
                name: "__multiple__",
                tags: common_tags.join(" "),
                notes: ""
              };
              pDispatch({
                type: "UPDATE_SELECT_STATE",
                select_state: {
                  selected_resource: new_selected_resource,
                  multi_select: true,
                  list_of_selected: multi_select_list,
                  selected_rows: selected_rows
                }
              });
            } else {
              _row_dict = selected_rows[0];
              pDispatch({
                type: "UPDATE_SELECT_STATE",
                select_state: {
                  selected_resource: _row_dict,
                  multi_select: false,
                  list_of_selected: [_row_dict.name],
                  selected_rows: selected_rows
                }
              });
            }
          case 2:
            return _context14.a(2);
        }
      }, _callee14);
    }));
    return _handleRowSelection2.apply(this, arguments);
  }
  function _update_search_state(new_state) {
    pDispatch({
      type: "UPDATE_SEARCH_STATE",
      search_state: new_state
    });
    pushCallback(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
      return _regenerator().w(function (_context7) {
        while (1) switch (_context7.n) {
          case 0:
            if (!search_spec_changed(new_state)) {
              _context7.n = 1;
              break;
            }
            clearSelected();
            _context7.n = 1;
            return _grabNewChunkWithRow(0, true, new_state, true);
          case 1:
            return _context7.a(2);
        }
      }, _callee7);
    })));
  }
  function search_spec_changed(new_spec) {
    if (!previous_search_spec.current) {
      return true;
    }
    for (var key in previous_search_spec.current) {
      if (new_spec.hasOwnProperty(key)) {
        // noinspection TypeScriptValidateTypes
        if (new_spec[key] != previous_search_spec.current[key]) {
          return true;
        }
      }
    }
    return false;
  }
  function _set_sort_state(column_name, direction) {
    var spec_update = {
      sort_field: column_name,
      sort_direction: direction
    };
    _update_search_state(spec_update);
  }
  function _selectRow(_x7) {
    return _selectRow2.apply(this, arguments);
  }
  function _selectRow2() {
    _selectRow2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee15(new_index) {
      return _regenerator().w(function (_context15) {
        while (1) switch (_context15.n) {
          case 0:
            if (Object.keys(pStateRef.current.data_dict).includes(String(new_index))) {
              _context15.n = 2;
              break;
            }
            _context15.n = 1;
            return _grabNewChunkWithRow(new_index, false, null, false, null, function () {
              _selectRow(new_index);
            });
          case 1:
            _context15.n = 3;
            break;
          case 2:
            pDispatch({
              type: "UPDATE_SELECT_STATE",
              select_state: {
                selected_resource: pStateRef.current.data_dict[new_index],
                multi_select: false,
                list_of_selected: [pStateRef.current.data_dict[new_index].name],
                selected_rows: [pStateRef.current.data_dict[new_index]],
                selectedRegions: [_table.Regions.row(new_index)]
              }
            });
          case 3:
            return _context15.a(2);
        }
      }, _callee15);
    }));
    return _selectRow2.apply(this, arguments);
  }
  function _open_raw(selected_resource) {
    statusFuncs.clearStatus();
    if (selected_resource.type == "freeform") {
      window.open($SCRIPT_ROOT + "/open_raw/" + selected_resource.name);
    } else {
      statusFuncs.statusMessage("Only Freeform documents can be raw opened", 5);
    }
  }
  function _view_resource(_x8) {
    return _view_resource2.apply(this, arguments);
  }
  function _view_resource2() {
    _view_resource2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee16(selected_resource) {
      var the_view,
        force_new_tab,
        resource_name,
        re,
        data,
        _args16 = arguments,
        _t6;
      return _regenerator().w(function (_context16) {
        while (1) switch (_context16.n) {
          case 0:
            the_view = _args16.length > 1 && _args16[1] !== undefined ? _args16[1] : null;
            force_new_tab = _args16.length > 2 && _args16[2] !== undefined ? _args16[2] : false;
            resource_name = selected_resource.name;
            if (the_view == null) {
              the_view = view_views(props.is_repository)[selected_resource.res_type];
            }
            statusFuncs.setStatus({
              show_spinner: true,
              status_message: "Opening ..."
            });
            if (!(window.in_context && !force_new_tab)) {
              _context16.n = 5;
              break;
            }
            re = new RegExp("/$");
            the_view = the_view.replace(re, "_in_context");
            _context16.p = 1;
            _context16.n = 2;
            return (0, _communication_react.postAjaxPromise)(the_view, {
              context_id: context_id,
              resource_name: resource_name
            });
          case 2:
            data = _context16.v;
            props.handleCreateViewer(data, statusFuncs.clearStatus);
            _context16.n = 4;
            break;
          case 3:
            _context16.p = 3;
            _t6 = _context16.v;
            statusFuncs.clearStatus();
            errorDrawerFuncs.addFromError("Error viewing resource ".concat(resource_name), _t6);
          case 4:
            _context16.n = 6;
            break;
          case 5:
            statusFuncs.clearStatus();
            window.open($SCRIPT_ROOT + the_view + resource_name);
          case 6:
            return _context16.a(2);
        }
      }, _callee16, null, [[1, 3]]);
    }));
    return _view_resource2.apply(this, arguments);
  }
  function _duplicate_func() {
    return _duplicate_func2.apply(this, arguments);
  }
  function _duplicate_func2() {
    _duplicate_func2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee17() {
      var row,
        the_row,
        res_name,
        res_type,
        data,
        new_name,
        duplicate_view,
        result_dict,
        _args17 = arguments,
        _t7;
      return _regenerator().w(function (_context17) {
        while (1) switch (_context17.n) {
          case 0:
            row = _args17.length > 0 && _args17[0] !== undefined ? _args17[0] : null;
            the_row = row ? row : pStateRef.current.select_state.selected_resource;
            res_name = the_row.name;
            res_type = the_row.res_type;
            _context17.p = 1;
            _context17.n = 2;
            return (0, _communication_react.postAjaxPromise)("get_resource_names/" + res_type, {});
          case 2:
            data = _context17.v;
            _context17.n = 3;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Duplicate ".concat(res_type),
              field_title: "New Name",
              default_value: res_name,
              existing_names: data.resource_names,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 3:
            new_name = _context17.v;
            duplicate_view = duplicate_views()[res_type];
            result_dict = {
              "new_res_name": new_name,
              "res_to_copy": res_name,
              "library_id": props.library_id,
              "is_repository": false
            };
            _context17.n = 4;
            return (0, _communication_react.postAjaxPromise)(duplicate_view, result_dict);
          case 4:
            _context17.n = 6;
            break;
          case 5:
            _context17.p = 5;
            _t7 = _context17.v;
            if (_t7 != "canceled") {
              errorDrawerFuncs.addFromError("Error duplicating resource ".concat(res_name), _t7);
            }
          case 6:
            return _context17.a(2);
        }
      }, _callee17, null, [[1, 5]]);
    }));
    return _duplicate_func2.apply(this, arguments);
  }
  function _delete_func(_x9) {
    return _delete_func2.apply(this, arguments);
  }
  function _delete_func2() {
    _delete_func2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee18(resource) {
      var res_list, confirm_text, _res_name, first_index, _iterator6, _step6, row, ind, _t8;
      return _regenerator().w(function (_context18) {
        while (1) switch (_context18.n) {
          case 0:
            res_list = resource ? [resource] : pStateRef.current.select_state.selected_rows;
            if (res_list.length == 1) {
              _res_name = res_list[0].name;
              confirm_text = "Are you sure that you want to delete ".concat(_res_name, "?");
            } else {
              confirm_text = "Are you sure that you want to delete multiple items?";
            }
            first_index = 99999;
            _iterator6 = _createForOfIteratorHelper(pStateRef.current.select_state.selected_rows);
            try {
              for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
                row = _step6.value;
                ind = parseInt((0, _library_pane_reducer.get_index)(row.name, row.res_type, pStateRef.current.data_dict));
                if (ind < first_index) {
                  first_index = ind;
                }
              }
            } catch (err) {
              _iterator6.e(err);
            } finally {
              _iterator6.f();
            }
            _context18.p = 1;
            _context18.n = 2;
            return dialogFuncs.showModalPromise("ConfirmDialog", {
              title: "Delete resources",
              text_body: confirm_text,
              cancel_text: "do nothing",
              submit_text: "delete",
              handleClose: dialogFuncs.hideModal
            });
          case 2:
            _context18.n = 3;
            return (0, _communication_react.postAjaxPromise)("delete_resource_list", {
              "resource_list": res_list
            });
          case 3:
            _context18.n = 5;
            break;
          case 4:
            _context18.p = 4;
            _t8 = _context18.v;
            if (_t8 != "canceled") {
              errorDrawerFuncs.addFromError("Error duplicating resource ".concat(res_name), _t8);
            }
          case 5:
            return _context18.a(2);
        }
      }, _callee18, null, [[1, 4]]);
    }));
    return _delete_func2.apply(this, arguments);
  }
  function _rename_func() {
    return _rename_func2.apply(this, arguments);
  }
  function _rename_func2() {
    _rename_func2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee19() {
      var row,
        res_type,
        res_name,
        data,
        res_names,
        index,
        new_name,
        the_data,
        _args19 = arguments,
        _t9;
      return _regenerator().w(function (_context19) {
        while (1) switch (_context19.n) {
          case 0:
            row = _args19.length > 0 && _args19[0] !== undefined ? _args19[0] : null;
            if (!row) {
              res_type = pStateRef.current.select_state.selected_resource.res_type;
              res_name = pStateRef.current.select_state.selected_resource.name;
            } else {
              res_type = row.res_type;
              res_name = row.name;
            }
            _context19.p = 1;
            _context19.n = 2;
            return (0, _communication_react.postAjaxPromise)("get_resource_names/" + res_type, {});
          case 2:
            data = _context19.v;
            res_names = data["resource_names"];
            index = res_names.indexOf(res_name);
            if (index >= 0) {
              res_names.splice(index, 1);
            }
            _context19.n = 3;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Rename ".concat(res_type),
              field_title: "New Name",
              handleClose: dialogFuncs.hideModal,
              default_value: res_name,
              existing_names: res_names,
              checkboxes: []
            });
          case 3:
            new_name = _context19.v;
            the_data = {
              "new_name": new_name
            };
            _context19.n = 4;
            return (0, _communication_react.postAjaxPromise)("rename_resource/".concat(res_type, "/").concat(res_name), the_data);
          case 4:
            _context19.n = 6;
            break;
          case 5:
            _context19.p = 5;
            _t9 = _context19.v;
            if (_t9 != "canceled") {
              errorDrawerFuncs.addFromError("Error renaming resource ".concat(res_name), _t9);
            }
          case 6:
            return _context19.a(2);
        }
      }, _callee19, null, [[1, 5]]);
    }));
    return _rename_func2.apply(this, arguments);
  }
  function _repository_copy_func() {
    return _repository_copy_func2.apply(this, arguments);
  }
  function _repository_copy_func2() {
    _repository_copy_func2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee20() {
      var res_type, res_name, data, new_name, result_dict, _result_dict, _t0, _t1;
      return _regenerator().w(function (_context20) {
        while (1) switch (_context20.n) {
          case 0:
            if (pStateRef.current.select_state.multi_select) {
              _context20.n = 6;
              break;
            }
            res_type = pStateRef.current.select_state.selected_resource.res_type;
            res_name = pStateRef.current.select_state.selected_resource.name;
            _context20.p = 1;
            _context20.n = 2;
            return (0, _communication_react.postAjaxPromise)("get_resource_names/" + res_type, {});
          case 2:
            data = _context20.v;
            _context20.n = 3;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Import ".concat(res_type),
              field_title: "New Name",
              default_value: res_name,
              existing_names: data.resource_names,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 3:
            new_name = _context20.v;
            result_dict = {
              "res_type": res_type,
              "res_name": res_name,
              "new_res_name": new_name
            };
            _context20.n = 4;
            return (0, _communication_react.postAjaxPromise)("/copy_from_repository", result_dict);
          case 4:
            statusFuncs.statusMessage("Imported Resource ".concat(res_name));
            return _context20.a(2, res_name);
          case 5:
            _context20.p = 5;
            _t0 = _context20.v;
            if (_t0 != "canceled") {
              errorDrawerFuncs.addFromError("Error getting resources names", _t0);
            }
            _context20.n = 11;
            break;
          case 6:
            _result_dict = {
              "selected_rows": pStateRef.current.select_state.selected_rows
            };
            _context20.p = 7;
            _context20.n = 8;
            return (0, _communication_react.postAjaxPromise)("/copy_from_repository", _result_dict);
          case 8:
            statusFuncs.statusMessage("Imported Resources");
            _context20.n = 10;
            break;
          case 9:
            _context20.p = 9;
            _t1 = _context20.v;
            errorDrawerFuncs.addFromError("Error importing resources", _t1);
          case 10:
            return _context20.a(2, "");
          case 11:
            return _context20.a(2);
        }
      }, _callee20, null, [[7, 9], [1, 5]]);
    }));
    return _repository_copy_func2.apply(this, arguments);
  }
  function _send_repository_func() {
    return _send_repository_func2.apply(this, arguments);
  }
  function _send_repository_func2() {
    _send_repository_func2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee21() {
      var pane_type, res_type, res_name, data, new_name, result_dict, _result_dict2, _t10, _t11;
      return _regenerator().w(function (_context21) {
        while (1) switch (_context21.n) {
          case 0:
            pane_type = props.pane_type;
            if (pStateRef.current.select_state.multi_select) {
              _context21.n = 7;
              break;
            }
            res_type = pStateRef.current.select_state.selected_resource.res_type;
            res_name = pStateRef.current.select_state.selected_resource.name;
            _context21.p = 1;
            _context21.n = 2;
            return (0, _communication_react.postAjaxPromise)("get_repository_resource_names/" + res_type, {});
          case 2:
            data = _context21.v;
            _context21.n = 3;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Share ".concat(res_type),
              field_title: "New ".concat(res_type, " Name"),
              default_value: res_name,
              existing_names: data.resource_names,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 3:
            new_name = _context21.v;
            result_dict = {
              "pane_type": pane_type,
              "res_type": res_type,
              "res_name": res_name,
              "new_res_name": new_name
            };
            _context21.n = 4;
            return (0, _communication_react.postAjaxPromise)('/send_to_repository', result_dict);
          case 4:
            statusFuncs.statusMessage("Shared resource ".concat(res_name));
            _context21.n = 6;
            break;
          case 5:
            _context21.p = 5;
            _t10 = _context21.v;
            if (_t10 != "canceled") {
              errorDrawerFuncs.addFromError("Error sharing resource ".concat(res_name), _t10);
            }
          case 6:
            _context21.n = 12;
            break;
          case 7:
            _result_dict2 = {
              "pane_type": pane_type,
              "selected_rows": pStateRef.current.select_state.selected_rows
            };
            _context21.p = 8;
            _context21.n = 9;
            return (0, _communication_react.postAjaxPromise)('/send_to_repository', _result_dict2);
          case 9:
            statusFuncs.statusMessage("Shared resources");
            _context21.n = 11;
            break;
          case 10:
            _context21.p = 10;
            _t11 = _context21.v;
            errorDrawerFuncs.addFromError("Error sharing resources", _t11);
          case 11:
            return _context21.a(2, "");
          case 12:
            return _context21.a(2);
        }
      }, _callee21, null, [[8, 10], [1, 5]]);
    }));
    return _send_repository_func2.apply(this, arguments);
  }
  function _refresh_func() {
    return _refresh_func2.apply(this, arguments);
  }
  function _refresh_func2() {
    _refresh_func2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee22() {
      var callback,
        _args22 = arguments;
      return _regenerator().w(function (_context22) {
        while (1) switch (_context22.n) {
          case 0:
            callback = _args22.length > 0 && _args22[0] !== undefined ? _args22[0] : null;
            _context22.n = 1;
            return _grabNewChunkWithRow(0, true, null, true, callback);
          case 1:
            return _context22.a(2);
        }
      }, _callee22);
    }));
    return _refresh_func2.apply(this, arguments);
  }
  function _new_notebook() {
    return _new_notebook2.apply(this, arguments);
  }
  function _new_notebook2() {
    _new_notebook2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee23() {
      var the_view, data, _t12;
      return _regenerator().w(function (_context23) {
        while (1) switch (_context23.n) {
          case 0:
            if (!window.in_context) {
              _context23.n = 5;
              break;
            }
            _context23.p = 1;
            the_view = "new_notebook_in_context";
            _context23.n = 2;
            return (0, _communication_react.postAjaxPromise)(the_view, {
              resource_name: ""
            });
          case 2:
            data = _context23.v;
            props.handleCreateViewer(data);
            _context23.n = 4;
            break;
          case 3:
            _context23.p = 3;
            _t12 = _context23.v;
            errorDrawerFuncs.addFromError("Error creating new notebook", _t12);
          case 4:
            _context23.n = 6;
            break;
          case 5:
            window.open("".concat($SCRIPT_ROOT, "/new_notebook"));
          case 6:
            return _context23.a(2);
        }
      }, _callee23, null, [[1, 3]]);
    }));
    return _new_notebook2.apply(this, arguments);
  }
  function _new_project() {
    return _new_project2.apply(this, arguments);
  }
  function _new_project2() {
    _new_project2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee24() {
      var the_view, data, _t13;
      return _regenerator().w(function (_context24) {
        while (1) switch (_context24.n) {
          case 0:
            if (!window.in_context) {
              _context24.n = 5;
              break;
            }
            _context24.p = 1;
            the_view = "new_project_in_context";
            _context24.n = 2;
            return (0, _communication_react.postAjaxPromise)(the_view, {
              resource_name: ""
            });
          case 2:
            data = _context24.v;
            props.handleCreateViewer(data);
            _context24.n = 4;
            break;
          case 3:
            _context24.p = 3;
            _t13 = _context24.v;
            errorDrawerFuncs.addFromError("Error creating new project", _t13);
          case 4:
            _context24.n = 6;
            break;
          case 5:
            window.open("".concat($SCRIPT_ROOT, "/new_project"));
          case 6:
            return _context24.a(2);
        }
      }, _callee24, null, [[1, 3]]);
    }));
    return _new_project2.apply(this, arguments);
  }
  function _downloadJupyter() {
    return _downloadJupyter2.apply(this, arguments);
  }
  function _downloadJupyter2() {
    _downloadJupyter2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee25() {
      var res_name, new_name, _t14;
      return _regenerator().w(function (_context25) {
        while (1) switch (_context25.n) {
          case 0:
            res_name = pStateRef.current.select_state.selected_resource.name;
            _context25.p = 1;
            _context25.n = 2;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Download Notebook as Jupyter Notebook",
              field_title: "New File Name",
              default_value: res_name + ".ipynb",
              existing_names: [],
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 2:
            new_name = _context25.v;
            window.open("".concat($SCRIPT_ROOT, "/download_jupyter/") + res_name + "/" + new_name);
            _context25.n = 4;
            break;
          case 3:
            _context25.p = 3;
            _t14 = _context25.v;
            errorDrawerFuncs.addFromError("Error downloading jupyter notebook", _t14);
          case 4:
            return _context25.a(2);
        }
      }, _callee25, null, [[1, 3]]);
    }));
    return _downloadJupyter2.apply(this, arguments);
  }
  function _showJupyterImport() {
    dialogFuncs.showModal("FileImportDialog", {
      res_type: "project",
      allowed_file_types: ".ipynb",
      checkboxes: [],
      chunking: false,
      chunkSize: null,
      forceChunking: false,
      process_handler: _import_jupyter,
      tsocket: props.tsocket,
      combine: false,
      show_csv_options: false,
      after_upload: null,
      show_address_selector: false,
      initial_address: null,
      handleClose: dialogFuncs.hideModal,
      handleCancel: null
    });
  }
  function _import_jupyter(myDropZone, setCurrentUrl) {
    var new_url = "import_jupyter/".concat(props.library_id);
    myDropZone.options.url = new_url;
    setCurrentUrl(new_url);
    myDropZone.processQueue();
  }
  function _combineCollections() {
    return _combineCollections2.apply(this, arguments);
  }
  function _combineCollections2() {
    _combineCollections2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee26() {
      var res_name, data, other_name, target, _data, new_name, _t15, _t16;
      return _regenerator().w(function (_context26) {
        while (1) switch (_context26.n) {
          case 0:
            res_name = pStateRef.current.select_state.selected_resource.name;
            if (pStateRef.current.select_state.multi_select) {
              _context26.n = 7;
              break;
            }
            _context26.p = 1;
            _context26.n = 2;
            return (0, _communication_react.postAjaxPromise)("get_resource_names/collection", {});
          case 2:
            data = _context26.v;
            _context26.n = 3;
            return dialogFuncs.showModalPromise("SelectDialog", {
              title: "Select a new collection to combine with " + res_name,
              select_label: "Collection to Combine",
              cancel_text: "Cancel",
              submit_text: "Combine",
              option_list: data.resource_names,
              handleClose: dialogFuncs.hideModal
            });
          case 3:
            other_name = _context26.v;
            statusFuncs.startSpinner(true);
            target = "combine_collections/".concat(res_name, "/").concat(other_name);
            _context26.n = 4;
            return (0, _communication_react.postAjaxPromise)(target, {});
          case 4:
            statusFuncs.stopSpinner();
            statusFuncs.statusMessage("Combined Collections");
            _context26.n = 6;
            break;
          case 5:
            _context26.p = 5;
            _t15 = _context26.v;
            if (_t15 != "canceled") {
              errorDrawerFuncs.addFromError("Error combining collections", _t15);
            }
            statusFuncs.stopSpinner();
          case 6:
            _context26.n = 12;
            break;
          case 7:
            _context26.p = 7;
            _context26.n = 8;
            return (0, _communication_react.postAjaxPromise)("get_resource_names/collection", {});
          case 8:
            _data = _context26.v;
            _context26.n = 9;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Combine Collections",
              field_title: "Name for combined collection",
              default_value: "NewCollection",
              existing_names: _data.resource_names,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 9:
            new_name = _context26.v;
            _context26.n = 10;
            return (0, _communication_react.postAjaxPromise)("combine_to_new_collection", {
              "original_collections": pStateRef.current.select_state.list_of_selected,
              "new_name": new_name
            });
          case 10:
            _context26.n = 12;
            break;
          case 11:
            _context26.p = 11;
            _t16 = _context26.v;
            if (_t16 != "canceled") {
              errorDrawerFuncs.addFromError("Error combining collections", _t16);
            }
            statusFuncs.stopSpinner();
          case 12:
            return _context26.a(2);
        }
      }, _callee26, null, [[7, 11], [1, 5]]);
    }));
    return _combineCollections2.apply(this, arguments);
  }
  function _downloadCollection() {
    return _downloadCollection2.apply(this, arguments);
  }
  function _downloadCollection2() {
    _downloadCollection2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee27() {
      var resource_name,
        res_name,
        new_name,
        _args27 = arguments,
        _t17;
      return _regenerator().w(function (_context27) {
        while (1) switch (_context27.n) {
          case 0:
            resource_name = _args27.length > 0 && _args27[0] !== undefined ? _args27[0] : null;
            res_name = resource_name ? resource_name : pStateRef.current.select_state.selected_resource.name;
            _context27.p = 1;
            _context27.n = 2;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Download Collection",
              field_title: "New File Name",
              default_value: res_name,
              existing_names: [],
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 2:
            new_name = _context27.v;
            window.open("".concat($SCRIPT_ROOT, "/download_collection/") + res_name + "/" + new_name);
            _context27.n = 4;
            break;
          case 3:
            _context27.p = 3;
            _t17 = _context27.v;
            if (_t17 != "canceled") {
              errorDrawerFuncs.addFromError("Error combing collections", _t17);
            }
          case 4:
            return _context27.a(2);
        }
      }, _callee27, null, [[1, 3]]);
    }));
    return _downloadCollection2.apply(this, arguments);
  }
  function _showCollectionImport() {
    dialogFuncs.showModal("FileImportDialog", {
      res_type: "collection",
      allowed_file_types: ".csv,.tsv,.txt,.xls,.xlsx,.html",
      checkboxes: [{
        "checkname": "import_as_freeform",
        "checktext": "Import as freeform"
      }],
      process_handler: _import_collection,
      chunking: false,
      chunkSize: null,
      forceChunking: false,
      tsocket: props.tsocket,
      combine: true,
      show_csv_options: true,
      after_upload: null,
      show_address_selector: false,
      initial_address: null,
      handleClose: dialogFuncs.hideModal,
      handleCancel: null
    });
  }
  function _import_collection(_x0, _x1, _x10, _x11) {
    return _import_collection2.apply(this, arguments);
  }
  function _import_collection2() {
    _import_collection2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee28(myDropZone, setCurrentUrl, new_name, check_results) {
      var csv_options,
        doc_type,
        new_url,
        _args28 = arguments,
        _t18;
      return _regenerator().w(function (_context28) {
        while (1) switch (_context28.n) {
          case 0:
            csv_options = _args28.length > 4 && _args28[4] !== undefined ? _args28[4] : null;
            doc_type = check_results["import_as_freeform"] ? "freeform" : "table";
            _context28.p = 1;
            _context28.n = 2;
            return (0, _communication_react.postAjaxPromise)("create_empty_collection", {
              "collection_name": new_name,
              "doc_type": doc_type,
              "library_id": props.library_id,
              "csv_options": csv_options
            });
          case 2:
            new_url = "append_documents_to_collection/".concat(new_name, "/").concat(doc_type, "/").concat(props.library_id);
            myDropZone.options.url = new_url;
            setCurrentUrl(new_url);
            myDropZone.processQueue();
            _context28.n = 4;
            break;
          case 3:
            _context28.p = 3;
            _t18 = _context28.v;
            errorDrawerFuncs.addFromError("Error importing document", _t18);
          case 4:
            return _context28.a(2);
        }
      }, _callee28, null, [[1, 3]]);
    }));
    return _import_collection2.apply(this, arguments);
  }
  function _tile_view() {
    return _tile_view2.apply(this, arguments);
  }
  function _tile_view2() {
    _tile_view2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee29() {
      return _regenerator().w(function (_context29) {
        while (1) switch (_context29.n) {
          case 0:
            _context29.n = 1;
            return _view_func("/view_module/");
          case 1:
            return _context29.a(2);
        }
      }, _callee29);
    }));
    return _tile_view2.apply(this, arguments);
  }
  function _view_named_tile(_x12) {
    return _view_named_tile2.apply(this, arguments);
  }
  function _view_named_tile2() {
    _view_named_tile2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee30(res) {
      var in_new_tab,
        _args30 = arguments;
      return _regenerator().w(function (_context30) {
        while (1) switch (_context30.n) {
          case 0:
            in_new_tab = _args30.length > 1 && _args30[1] !== undefined ? _args30[1] : false;
            _context30.n = 1;
            return _view_resource({
              name: res.name,
              res_type: "tile"
            }, "/view_module/", in_new_tab);
          case 1:
            return _context30.a(2);
        }
      }, _callee30);
    }));
    return _view_named_tile2.apply(this, arguments);
  }
  function _creator_view_named_tile(_x13) {
    return _creator_view_named_tile2.apply(this, arguments);
  }
  function _creator_view_named_tile2() {
    _creator_view_named_tile2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee31(res) {
      var in_new_tab,
        _args31 = arguments;
      return _regenerator().w(function (_context31) {
        while (1) switch (_context31.n) {
          case 0:
            in_new_tab = _args31.length > 1 && _args31[1] !== undefined ? _args31[1] : false;
            _context31.n = 1;
            return _view_resource({
              name: res.tile,
              res_type: "tile"
            }, "/view_in_creator/", in_new_tab);
          case 1:
            return _context31.a(2);
        }
      }, _callee31);
    }));
    return _creator_view_named_tile2.apply(this, arguments);
  }
  function _creator_view() {
    return _creator_view2.apply(this, arguments);
  }
  function _creator_view2() {
    _creator_view2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee32() {
      return _regenerator().w(function (_context32) {
        while (1) switch (_context32.n) {
          case 0:
            _context32.n = 1;
            return _view_func("/view_in_creator/");
          case 1:
            return _context32.a(2);
        }
      }, _callee32);
    }));
    return _creator_view2.apply(this, arguments);
  }
  function _showHistoryViewer() {
    window.open("".concat($SCRIPT_ROOT, "/show_history_viewer/").concat(pStateRef.current.select_state.selected_resource.name));
  }
  function _compare_tiles() {
    var res_names = pStateRef.current.select_state.list_of_selected;
    if (res_names.length == 0) return;
    if (res_names.length == 1) {
      window.open("".concat($SCRIPT_ROOT, "/show_tile_differ/").concat(res_names[0]));
    } else if (res_names.length == 2) {
      window.open("".concat($SCRIPT_ROOT, "/show_tile_differ/both_names/").concat(res_names[0], "/").concat(res_names[1]));
    } else {
      (0, _toaster.doFlash)({
        "alert-type": "alert-warning",
        "message": "Select only one or two tiles before launching compare"
      });
    }
  }
  function _load_tile() {
    return _load_tile2.apply(this, arguments);
  }
  function _load_tile2() {
    _load_tile2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee33() {
      var resource,
        res_name,
        _args33 = arguments,
        _t19;
      return _regenerator().w(function (_context33) {
        while (1) switch (_context33.n) {
          case 0:
            resource = _args33.length > 0 && _args33[0] !== undefined ? _args33[0] : null;
            res_name = resource ? resource.name : pStateRef.current.select_state.selected_resource.name;
            _context33.p = 1;
            _context33.n = 2;
            return (0, _communication_react.postPromise)("host", "load_tile_module_task", {
              "tile_module_name": res_name,
              "user_id": window.user_id
            });
          case 2:
            statusFuncs.statusMessage("Loaded tile ".concat(res_name));
            _context33.n = 4;
            break;
          case 3:
            _context33.p = 3;
            _t19 = _context33.v;
            errorDrawerFuncs.addFromError("Error loading tile", _t19);
          case 4:
            return _context33.a(2);
        }
      }, _callee33, null, [[1, 3]]);
    }));
    return _load_tile2.apply(this, arguments);
  }
  function _unload_module() {
    return _unload_module2.apply(this, arguments);
  }
  function _unload_module2() {
    _unload_module2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee34() {
      var resource,
        res_name,
        _args34 = arguments,
        _t20;
      return _regenerator().w(function (_context34) {
        while (1) switch (_context34.n) {
          case 0:
            resource = _args34.length > 0 && _args34[0] !== undefined ? _args34[0] : null;
            res_name = resource ? resource.name : pStateRef.current.select_state.selected_resource.name;
            _context34.p = 1;
            _context34.n = 2;
            return (0, _communication_react.postAjaxPromise)("unload_one_module/".concat(res_name), {});
          case 2:
            statusFuncs.statusMessage("Tile unloaded");
            _context34.n = 4;
            break;
          case 3:
            _context34.p = 3;
            _t20 = _context34.v;
            errorDrawerFuncs.addFromError("Error unloading tile", _t20);
          case 4:
            return _context34.a(2);
        }
      }, _callee34, null, [[1, 3]]);
    }));
    return _unload_module2.apply(this, arguments);
  }
  function _unload_all_tiles() {
    return _unload_all_tiles2.apply(this, arguments);
  }
  function _unload_all_tiles2() {
    _unload_all_tiles2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee35() {
      var _t21;
      return _regenerator().w(function (_context35) {
        while (1) switch (_context35.n) {
          case 0:
            _context35.p = 0;
            _context35.n = 1;
            return (0, _communication_react.postAjaxPromise)("unload_all_tiles", {});
          case 1:
            statusFuncs.statusMessage("Unloaded all tiles");
            _context35.n = 3;
            break;
          case 2:
            _context35.p = 2;
            _t21 = _context35.v;
            errorDrawerFuncs.addFromError("Error unloading tiles", _t21);
          case 3:
            return _context35.a(2);
        }
      }, _callee35, null, [[0, 2]]);
    }));
    return _unload_all_tiles2.apply(this, arguments);
  }
  function _new_in_creator(_x14) {
    return _new_in_creator2.apply(this, arguments);
  }
  function _new_in_creator2() {
    _new_in_creator2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee36(template_name) {
      var data, new_name, result_dict, _t22;
      return _regenerator().w(function (_context36) {
        while (1) switch (_context36.n) {
          case 0:
            _context36.p = 0;
            _context36.n = 1;
            return (0, _communication_react.postAjaxPromise)("get_resource_names/tile", {});
          case 1:
            data = _context36.v;
            _context36.n = 2;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "New Tile",
              field_title: "New Tile Name",
              default_value: "NewTileModule",
              existing_names: data.resource_names,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 2:
            new_name = _context36.v;
            result_dict = {
              "template_name": template_name,
              "new_res_name": new_name,
              "last_saved": "creator"
            };
            _context36.n = 3;
            return (0, _communication_react.postAjaxPromise)("/create_tile_module", result_dict);
          case 3:
            _context36.n = 4;
            return _view_resource({
              name: String(new_name),
              res_type: "tile"
            }, "/view_in_creator/");
          case 4:
            _context36.n = 6;
            break;
          case 5:
            _context36.p = 5;
            _t22 = _context36.v;
            if (_t22 != "canceled") {
              errorDrawerFuncs.addFromError("Error creating tile module", _t22);
            }
          case 6:
            return _context36.a(2);
        }
      }, _callee36, null, [[0, 5]]);
    }));
    return _new_in_creator2.apply(this, arguments);
  }
  function _new_list(_x15) {
    return _new_list2.apply(this, arguments);
  }
  function _new_list2() {
    _new_list2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee37(template_name) {
      var data, new_name, result_dict, _t23;
      return _regenerator().w(function (_context37) {
        while (1) switch (_context37.n) {
          case 0:
            _context37.p = 0;
            _context37.n = 1;
            return (0, _communication_react.postAjaxPromise)("get_resource_names/list", {});
          case 1:
            data = _context37.v;
            _context37.n = 2;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "New List Resource",
              field_title: "New List Name",
              default_value: "NewListResource",
              existing_names: data.resource_names,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 2:
            new_name = _context37.v;
            result_dict = {
              "template_name": template_name,
              "new_res_name": new_name
            };
            _context37.n = 3;
            return (0, _communication_react.postAjaxPromise)("/create_list", result_dict);
          case 3:
            _context37.n = 4;
            return _view_resource({
              name: String(new_name),
              res_type: "list"
            }, "/view_list/");
          case 4:
            _context37.n = 6;
            break;
          case 5:
            _context37.p = 5;
            _t23 = _context37.v;
            if (_t23 != "canceled") {
              errorDrawerFuncs.addFromError("Error creating list resource", _t23);
            }
          case 6:
            return _context37.a(2);
        }
      }, _callee37, null, [[0, 5]]);
    }));
    return _new_list2.apply(this, arguments);
  }
  function _add_list(myDropZone, setCurrentUrl) {
    var new_url = "import_list/".concat(props.library_id);
    myDropZone.options.url = new_url;
    setCurrentUrl(new_url);
    myDropZone.processQueue();
  }
  function _showListImport() {
    dialogFuncs.showModal("FileImportDialog", {
      res_type: "list",
      allowed_file_types: "text/*",
      checkboxes: [],
      chunking: false,
      chunkSize: null,
      forceChunking: false,
      process_handler: _add_list,
      tsocket: props.tsocket,
      combine: false,
      show_csv_options: false,
      after_upload: null,
      show_address_selector: false,
      initial_address: null,
      handleClose: dialogFuncs.hideModal,
      handleCancel: null
    });
  }
  function _new_code(_x16) {
    return _new_code2.apply(this, arguments);
  }
  function _new_code2() {
    _new_code2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee38(template_name) {
      var data, new_name, result_dict, _t24;
      return _regenerator().w(function (_context38) {
        while (1) switch (_context38.n) {
          case 0:
            _context38.p = 0;
            _context38.n = 1;
            return (0, _communication_react.postAjaxPromise)("get_resource_names/code", {});
          case 1:
            data = _context38.v;
            _context38.n = 2;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "New code Resource",
              field_title: "New Code Resource Name",
              default_value: "NewCodeResource",
              existing_names: data.resource_names,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 2:
            new_name = _context38.v;
            result_dict = {
              "template_name": template_name,
              "new_res_name": new_name
            };
            _context38.n = 3;
            return (0, _communication_react.postAjaxPromise)("/create_code", result_dict);
          case 3:
            _context38.n = 4;
            return _view_resource({
              name: String(new_name),
              res_type: "code"
            }, "/view_code/");
          case 4:
            _context38.n = 6;
            break;
          case 5:
            _context38.p = 5;
            _t24 = _context38.v;
            if (_t24 != "canceled") {
              errorDrawerFuncs.addFromError("Error creating code resource", _t24);
            }
          case 6:
            return _context38.a(2);
        }
      }, _callee38, null, [[0, 5]]);
    }));
    return _new_code2.apply(this, arguments);
  }
  function setContextMenuItems(context_menu_items) {
    pDispatch({
      type: "SET_CONTEXT_MENU_ITEMS",
      context_menu_items: context_menu_items
    });
  }
  function _menu_funcs() {
    return {
      view_func: _view_func,
      send_repository_func: _send_repository_func,
      repository_copy_func: _repository_copy_func,
      duplicate_func: _duplicate_func,
      refresh_func: _refresh_func,
      delete_func: _delete_func,
      rename_func: _rename_func,
      new_notebook: _new_notebook,
      new_project: _new_project,
      downloadJupyter: _downloadJupyter,
      showJupyterImport: _showJupyterImport,
      combineCollections: _combineCollections,
      showCollectionImport: _showCollectionImport,
      downloadCollection: _downloadCollection,
      new_in_creator: _new_in_creator,
      creator_view: _creator_view,
      tile_view: _tile_view,
      creator_view_named_tile: _creator_view_named_tile,
      view_named_tile: _view_named_tile,
      load_tile: _load_tile,
      unload_module: _unload_module,
      unload_all_tiles: _unload_all_tiles,
      showHistoryViewer: _showHistoryViewer,
      compare_tiles: _compare_tiles,
      new_list: _new_list,
      showListImport: _showListImport,
      new_code: _new_code
    };
  }
  var res_type = pStateRef.current.select_state.selected_resource.res_type;
  var res_name = pStateRef.current.select_state.selected_resource.name;
  var right_pane = /*#__PURE__*/_react["default"].createElement(_blueprint_mdata_fields.CombinedMetadata, {
    key: "combined-metadata-library",
    elevation: 0,
    tsocket: props.tsocket,
    res_name: res_name,
    res_type: res_type,
    outer_style: metadata_outer_style,
    expandWidth: true,
    readOnly: props.is_repository
  });
  var MenubarClass = props.MenubarClass;
  var filter_buttons = [];
  var _iterator2 = _createForOfIteratorHelper(["all"].concat(res_types)),
    _step2;
  try {
    var _loop = function _loop() {
      var rtype = _step2.value;
      filter_buttons.push(/*#__PURE__*/_react["default"].createElement(_core.Tooltip, {
        content: rtype,
        key: rtype,
        placement: "top",
        hoverOpenDelay: 700,
        intent: "warning"
      }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
        icon: _blueprint_mdata_fields.icon_dict[rtype],
        variant: "minimal",
        active: rtype == pState.search_state.filterType,
        onClick: /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee39() {
          return _regenerator().w(function (_context39) {
            while (1) switch (_context39.n) {
              case 0:
                _context39.n = 1;
                return _setFilterType(rtype);
              case 1:
                return _context39.a(2);
            }
          }, _callee39);
        }))
      })));
    };
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      _loop();
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  var left_pane = /*#__PURE__*/_react["default"].createElement(_library_table_pane.LibraryTablePane, _extends({}, props, {
    pStateRef: pStateRef,
    filter_buttons: filter_buttons,
    update_search_state: _update_search_state,
    updateTagState: _update_search_state,
    sortColumn: _set_sort_state,
    onSelection: _onTableSelection,
    keyHandler: null,
    initiateDataGrab: _grabNewChunkWithRow,
    renderBodyContextMenu: _renderBodyContextMenu,
    handleRowDoubleClick: _handleRowDoubleClick
  }));
  var selected_types = _selectedTypes();
  selectedTypeRef.current = selected_types.length == 1 ? pState.select_state.selected_resource.res_type : "multi";
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(MenubarClass, _extends({
    selected_resource: pStateRef.current.select_state.selected_resource,
    connection_status: props.connection_status,
    multi_select: pStateRef.current.select_state.multi_select,
    list_of_selected: pStateRef.current.select_state.list_of_selected,
    selected_rows: pStateRef.current.select_state.selected_rows,
    selectedTypeRef: selectedTypeRef
  }, _menu_funcs(), {
    sendContextMenuItems: setContextMenuItems,
    view_resource: _view_resource,
    open_raw: _open_raw
  }, props.errorDrawerFuncs, {
    handleCreateViewer: props.handleCreateViewer,
    library_id: props.library_id,
    controlled: props.controlled,
    tsocket: props.tsocket
  })), /*#__PURE__*/_react["default"].createElement("div", {
    ref: top_ref,
    style: {
      display: "flex",
      flexGrow: 1,
      width: "100%",
      marginLeft: 15,
      marginTop: 0,
      position: "relative"
    },
    tabIndex: "0",
    className: "d-flex flex-column",
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp
  }, /*#__PURE__*/_react["default"].createElement(_resizing_allotment.HorizontalPanes, {
    show_handle: true,
    left_pane: left_pane,
    right_pane: right_pane,
    right_pane_overflow: "auto",
    initial_width_fraction: .75,
    scrollAdjustSelectors: [".bp6-table-quadrant-scroll-container"],
    handleSplitUpdate: null,
    handleResizeStart: null,
    handleResizeEnd: null
  })));
}
exports.LibraryPane = LibraryPane = /*#__PURE__*/(0, _react.memo)(LibraryPane);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AdminPane = AdminPane;
var _react = _interopRequireWildcard(require("react"));
var _table = require("@blueprintjs/table");
var _library_widgets = require("./library_widgets");
var _resizing_allotment = require("./resizing_allotment");
var _utilities_react = require("./utilities_react");
var _communication_react = require("./communication_react");
var _tactic_socket = require("./tactic_socket");
var _lodash = _interopRequireDefault(require("lodash"));
var _searchable_console = require("./searchable_console");
var _error_drawer = require("./error_drawer");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t2 in e) "default" !== _t2 && {}.hasOwnProperty.call(e, _t2) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t2)) && (i.get || i.set) ? o(f, _t2, i) : f[_t2] = e[_t2]); return f; })(e, t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
function AdminPane(props) {
  props = _objectSpread({
    is_repository: false,
    tsocket: null,
    extraControls: null
  }, props);
  var table_ref = (0, _react.useRef)(null);
  var console_text_ref = (0, _react.useRef)(null);
  var previous_search_spec = (0, _react.useRef)(null);
  var get_task = "grab_".concat(props.res_type, "_list_chunk_task");
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)({}),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    set_data_dict = _useStateAndRef2[1],
    data_dict_ref = _useStateAndRef2[2];
  var _useState = (0, _react.useState)(0),
    _useState2 = _slicedToArray(_useState, 2),
    num_rows = _useState2[0],
    set_num_rows = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = _slicedToArray(_useState3, 2),
    awaiting_data = _useState4[0],
    set_awaiting_data = _useState4[1];
  var _useState5 = (0, _react.useState)(500),
    _useState6 = _slicedToArray(_useState5, 2),
    set_total_width = _useState6[1];
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  (0, _react.useEffect)(function () {
    _grabNewChunkWithRow(0, true, null, true).then(function () {});
  }, []);
  function _handleRowUpdate(res_dict) {
    var res_idval = res_dict.Id;
    var ind = get_data_dict_index(res_idval);
    var new_data_dict = _lodash["default"].cloneDeep(data_dict_ref.current);
    var the_row = new_data_dict[ind];
    for (var field in res_dict) {
      the_row[field] = res_dict[field];
    }
    if (res_name == props.selected_resource.name) {
      props.updatePaneState({
        "selected_resource": the_row
      });
    }
    set_data_dict(new_data_dict);
  }
  function _refresh_func() {
    return _refresh_func2.apply(this, arguments);
  }
  function _refresh_func2() {
    _refresh_func2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
      var callback,
        _args3 = arguments;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.n) {
          case 0:
            callback = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : null;
            _context3.n = 1;
            return _grabNewChunkWithRow(0, true, null, true, callback);
          case 1:
            return _context3.a(2);
        }
      }, _callee3);
    }));
    return _refresh_func2.apply(this, arguments);
  }
  (0, _tactic_socket.useSocketListener)(props.tsocket, "update-".concat(props.res_type, "-selector-row"), _handleRowUpdate);
  (0, _tactic_socket.useSocketListener)(props.tsocket, "refresh-".concat(props.res_type, "-selector"), _refresh_func);
  function _getSearchSpec() {
    return {
      search_string: props.search_string,
      sort_field: props.sort_field,
      sort_direction: props.sort_direction
    };
  }
  function _onTableSelection(_x) {
    return _onTableSelection2.apply(this, arguments);
  }
  function _onTableSelection2() {
    _onTableSelection2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(regions) {
      var selected_rows, revised_regions, _iterator, _step, region, first_row, last_row, i;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.n) {
          case 0:
            if (!(regions.length == 0)) {
              _context4.n = 1;
              break;
            }
            return _context4.a(2);
          case 1:
            // Without this get an error when clicking on a body cell
            selected_rows = [];
            revised_regions = [];
            _iterator = _createForOfIteratorHelper(regions);
            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                region = _step.value;
                if (region.hasOwnProperty("rows")) {
                  first_row = region["rows"][0];
                  revised_regions.push(_table.Regions.row(first_row));
                  last_row = region["rows"][1];
                  for (i = first_row; i <= last_row; ++i) {
                    selected_rows.push(data_dict_ref.current[i]);
                    revised_regions.push(_table.Regions.row(i));
                  }
                }
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }
            _context4.n = 2;
            return _handleRowSelection(selected_rows);
          case 2:
            _updatePaneState({
              selectedRegions: revised_regions
            });
          case 3:
            return _context4.a(2);
        }
      }, _callee4);
    }));
    return _onTableSelection2.apply(this, arguments);
  }
  function _grabNewChunkWithRow(_x2) {
    return _grabNewChunkWithRow2.apply(this, arguments);
  }
  function _grabNewChunkWithRow2() {
    _grabNewChunkWithRow2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(row_index) {
      var flush,
        spec_update,
        select,
        callback,
        search_spec,
        query,
        data,
        new_data_dict,
        _args5 = arguments,
        _t;
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.n) {
          case 0:
            flush = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : false;
            spec_update = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : null;
            select = _args5.length > 3 && _args5[3] !== undefined ? _args5[3] : false;
            callback = _args5.length > 4 && _args5[4] !== undefined ? _args5[4] : null;
            _context5.p = 1;
            search_spec = _getSearchSpec();
            if (spec_update) {
              search_spec = Object.assign(search_spec, spec_update);
            }
            query = {
              search_spec: search_spec,
              row_number: row_index
            };
            _context5.n = 2;
            return (0, _communication_react.postPromise)("host", get_task, query);
          case 2:
            data = _context5.v;
            if (flush) {
              new_data_dict = data.chunk_dict;
            } else {
              new_data_dict = _lodash["default"].cloneDeep(data_dict_ref.current);
              new_data_dict = Object.assign(new_data_dict, data.chunk_dict);
            }
            previous_search_spec.current = search_spec;
            set_data_dict(new_data_dict);
            set_num_rows(data.num_rows);
            pushCallback(function () {
              if (callback) {
                callback();
              } else if (select) {
                _selectRow(row_index);
              }
            });
            _context5.n = 4;
            break;
          case 3:
            _context5.p = 3;
            _t = _context5.v;
            errorDrawerFuncs.addFromError("Error grabbing row chunk", _t);
          case 4:
            return _context5.a(2);
        }
      }, _callee5, null, [[1, 3]]);
    }));
    return _grabNewChunkWithRow2.apply(this, arguments);
  }
  function _grabNewChunkWithRowPromise(row_index) {
    var flush = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var spec_update = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var select = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    return new Promise(/*#__PURE__*/function () {
      var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(resolve) {
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              _context.n = 1;
              return _grabNewChunkWithRow(row_index, flush, spec_update, select, resolve);
            case 1:
              return _context.a(2);
          }
        }, _callee);
      }));
      return function (_x3) {
        return _ref.apply(this, arguments);
      };
    }());
  }
  function _initiateDataGrab(row_index) {
    set_awaiting_data(true);
    pushCallback(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            _context2.n = 1;
            return _grabNewChunkWithRow(row_index);
          case 1:
            return _context2.a(2);
        }
      }, _callee2);
    })));
  }
  function _updatePaneState(new_state, callback) {
    props.updatePaneState(props.res_type, new_state, callback);
  }
  function _updatePaneStatePromise(_x4) {
    return _updatePaneStatePromise2.apply(this, arguments);
  }
  function _updatePaneStatePromise2() {
    _updatePaneStatePromise2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(new_state) {
      return _regenerator().w(function (_context6) {
        while (1) switch (_context6.n) {
          case 0:
            _context6.n = 1;
            return props.updatePaneStatePromise(props.res_type, new_state);
          case 1:
            return _context6.a(2);
        }
      }, _callee6);
    }));
    return _updatePaneStatePromise2.apply(this, arguments);
  }
  function get_data_dict_index(idval) {
    for (var index in data_dict_ref.current) {
      if (data_dict_ref.current[index].Id == idval) {
        return index;
      }
    }
    return null;
  }
  function _delete_row(idval) {
    var ind = get_data_dict_index(idval);
    var new_data_dict = _objectSpread({}, data_dict_ref.current);
    delete new_data_dict[ind];
    set_data_dict(new_data_dict);
  }
  function _handleSplitResize(left_width, right_width, width_fraction) {
    _updatePaneState({
      left_width_fraction: width_fraction
    });
  }
  function _handleRowClick(_x5) {
    return _handleRowClick2.apply(this, arguments);
  }
  function _handleRowClick2() {
    _handleRowClick2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(row_dict) {
      return _regenerator().w(function (_context7) {
        while (1) switch (_context7.n) {
          case 0:
            _context7.n = 1;
            return _updatePaneStatePromise({
              selected_resource: row_dict,
              multi_select: false,
              list_of_selected: [row_dict[props.id_field]]
            });
          case 1:
            return _context7.a(2);
        }
      }, _callee7);
    }));
    return _handleRowClick2.apply(this, arguments);
  }
  function _handleRowSelection(_x6) {
    return _handleRowSelection2.apply(this, arguments);
  }
  function _handleRowSelection2() {
    _handleRowSelection2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(selected_rows) {
      var row_dict;
      return _regenerator().w(function (_context8) {
        while (1) switch (_context8.n) {
          case 0:
            row_dict = selected_rows[0];
            _context8.n = 1;
            return _handleRowClick(row_dict);
          case 1:
            return _context8.a(2);
        }
      }, _callee8);
    }));
    return _handleRowSelection2.apply(this, arguments);
  }
  function _update_search_state(_x7) {
    return _update_search_state2.apply(this, arguments);
  }
  function _update_search_state2() {
    _update_search_state2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(new_state) {
      return _regenerator().w(function (_context9) {
        while (1) switch (_context9.n) {
          case 0:
            _context9.n = 1;
            return _updatePaneStatePromise(new_state);
          case 1:
            if (!search_spec_changed(new_state)) {
              _context9.n = 2;
              break;
            }
            _context9.n = 2;
            return _grabNewChunkWithRow(0, true, new_state, true);
          case 2:
            return _context9.a(2);
        }
      }, _callee9);
    }));
    return _update_search_state2.apply(this, arguments);
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
  function _set_sort_state(_x8, _x9, _x0) {
    return _set_sort_state2.apply(this, arguments);
  }
  function _set_sort_state2() {
    _set_sort_state2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(column_name, sort_field, direction) {
      var spec_update;
      return _regenerator().w(function (_context0) {
        while (1) switch (_context0.n) {
          case 0:
            spec_update = {
              sort_field: column_name,
              sort_direction: direction
            };
            _context0.n = 1;
            return _updatePaneState(spec_update);
          case 1:
            if (!search_spec_changed(spec_update)) {
              _context0.n = 2;
              break;
            }
            _context0.n = 2;
            return _grabNewChunkWithRow(0, true, spec_update, true);
          case 2:
            return _context0.a(2);
        }
      }, _callee0);
    }));
    return _set_sort_state2.apply(this, arguments);
  }
  function _selectRow(_x1) {
    return _selectRow2.apply(this, arguments);
  }
  function _selectRow2() {
    _selectRow2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(new_index) {
      var new_regions;
      return _regenerator().w(function (_context1) {
        while (1) switch (_context1.n) {
          case 0:
            if (Object.keys(data_dict_ref.current).includes(String(new_index))) {
              _context1.n = 3;
              break;
            }
            _context1.n = 1;
            return _grabNewChunkWithRowPromise(new_index, false, null, false);
          case 1:
            _context1.n = 2;
            return _selectRow(new_index);
          case 2:
            _context1.n = 4;
            break;
          case 3:
            new_regions = [_table.Regions.row(new_index)];
            _updatePaneState({
              selected_resource: data_dict_ref.current[new_index],
              list_of_selected: [data_dict_ref.current[new_index].name],
              selectedRegions: new_regions
            });
          case 4:
            return _context1.a(2);
        }
      }, _callee1);
    }));
    return _selectRow2.apply(this, arguments);
  }
  function _setConsoleText(_x10) {
    return _setConsoleText2.apply(this, arguments);
  }
  function _setConsoleText2() {
    _setConsoleText2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(the_text) {
      return _regenerator().w(function (_context10) {
        while (1) switch (_context10.n) {
          case 0:
            _context10.n = 1;
            return _updatePaneStatePromise({
              "console_text": the_text
            });
          case 1:
            if (console_text_ref && console_text_ref.current) {
              console_text_ref.current.scrollTop = console_text_ref.current.scrollHeight;
            }
          case 2:
            return _context10.a(2);
        }
      }, _callee10);
    }));
    return _setConsoleText2.apply(this, arguments);
  }
  function _communicateColumnWidthSum(total_width) {
    set_total_width(total_width + 50);
  }
  var primary_mdata_fields = ["name", "created", "created_for_sort", "updated", "updated_for_sort", "tags", "notes"];
  var additional_metadata = {};
  for (var field in props.selected_resource) {
    if (!primary_mdata_fields.includes(field)) {
      additional_metadata[field] = props.selected_resource[field];
    }
  }
  if (Object.keys(additional_metadata).length == 0) {
    additional_metadata = null;
  }
  var right_pane;
  if (props.res_type == "container") {
    right_pane = /*#__PURE__*/_react["default"].createElement("div", {
      className: "d-flex d-inline",
      ref: console_text_ref,
      style: {
        height: "100%",
        overflow: "hidden",
        marginRight: 10,
        position: "relative"
      }
    }, /*#__PURE__*/_react["default"].createElement(_searchable_console.SearchableConsole, {
      local_id: window.global_id,
      tsocket: props.tsocket,
      container_id: props.selected_resource.Id,
      ref: null,
      outer_style: {
        padding: 20
      },
      showCommandField: true
    }));
  } else {
    right_pane = /*#__PURE__*/_react["default"].createElement("div", null);
  }
  var MenubarClass = props.MenubarClass;
  var left_pane = /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      "maxHeight": "100%",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    ref: table_ref,
    style: {
      //flex: "1 1 0",
      minWidth: 0,
      overflowY: "auto",
      marginTop: 15,
      padding: 5,
      marginBottom: 15,
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/_react["default"].createElement(_library_widgets.SearchForm, {
    allow_search_inside: false,
    allow_search_metadata: false,
    update_search_state: _update_search_state,
    search_string: props.search_string
  }), /*#__PURE__*/_react["default"].createElement(_library_widgets.BpSelectorTable, {
    data_dict: data_dict_ref.current,
    num_rows: num_rows,
    awaiting_data: awaiting_data,
    enableColumnResizing: true,
    sortColumn: _set_sort_state,
    selectedRegions: props.selectedRegions,
    communicateColumnWidthSum: _communicateColumnWidthSum,
    onSelection: _onTableSelection,
    initiateDataGrab: _initiateDataGrab,
    columns: props.columns,
    identifier_field: props.id_field
  })), props.extraControls && props.extraControls));
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(MenubarClass, {
    selected_resource: props.selected_resource,
    list_of_selected: props.list_of_selected,
    setConsoleText: _setConsoleText,
    delete_row: _delete_row,
    refresh_func: _refresh_func
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: "admin-pane",
    style: {
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
      width: "100%",
      marginLeft: 15,
      marginTop: 0,
      position: "relative"
    }
  }, /*#__PURE__*/_react["default"].createElement(_resizing_allotment.HorizontalPanes, {
    left_pane: left_pane,
    right_pane: right_pane,
    show_handle: true,
    initial_width_fraction: .65,
    handleSplitUpdate: _handleSplitResize
  })));
}
exports.AdminPane = AdminPane = /*#__PURE__*/(0, _react.memo)(AdminPane);
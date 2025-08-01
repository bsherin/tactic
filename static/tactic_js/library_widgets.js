"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BpSelectorTable = BpSelectorTable;
exports.SearchForm = SearchForm;
exports.compute_initial_column_widths = compute_initial_column_widths;
var _react = _interopRequireWildcard(require("react"));
var _core = require("@blueprintjs/core");
var _table = require("@blueprintjs/table");
var _utilities_react = require("./utilities_react");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
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
function SearchForm(props) {
  props = _objectSpread({
    allow_search_inside: false,
    allow_search_metadata: false,
    allow_show_hidden: false,
    allow_regex: false,
    regex: false,
    search_inside: false,
    search_metadata: false,
    show_hidden: false,
    field_width: 265,
    include_search_jumper: false,
    current_search_number: null,
    searchNext: null,
    searchPrev: null,
    search_ref: null,
    number_matches: null,
    update_delay: 500,
    update_search_state: null,
    search_string: ""
  }, props);
  var _useState = (0, _react.useState)(null),
    _useState2 = _slicedToArray(_useState, 2),
    temp_text = _useState2[0],
    set_temp_text = _useState2[1];
  var _useDebounce = (0, _utilities_react.useDebounce)(function (newval) {
      props.update_search_state({
        "search_string": newval
      });
    }),
    _useDebounce2 = _slicedToArray(_useDebounce, 2),
    waiting = _useDebounce2[0],
    doUpdate = _useDebounce2[1];
  function _handleSearchFieldChange(event) {
    doUpdate(event.target.value);
    set_temp_text(event.target.value);
  }
  function _handleSearchMetadataChange(event) {
    props.update_search_state({
      "search_metadata": event.target.checked
    });
  }
  function _handleSearchInsideChange(event) {
    props.update_search_state({
      "search_inside": event.target.checked
    });
  }
  function _handleShowHiddenChange(event) {
    props.update_search_state({
      "show_hidden": event.target.checked
    });
  }
  function _handleRegexChange(event) {
    props.update_search_state({
      "regex": event.target.checked
    });
  }
  var match_text;
  if (props.number_matches != null && props.search_string && props.search_string != "") {
    switch (props.number_matches) {
      case 0:
        match_text = "no matches";
        break;
      case 1:
        match_text = "1 match";
        break;
      default:
        match_text = "".concat(props.number_matches, " matches");
        break;
    }
  } else {
    match_text = null;
  }
  var current_text = waiting.current ? temp_text : props.search_string;
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    helperText: match_text,
    style: {
      marginBottom: 0
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-row",
    style: {
      marginTop: 5,
      marginBottom: 5
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
    type: "search",
    className: "search-input",
    placeholder: "Search",
    leftIcon: "search",
    value: current_text,
    onChange: _handleSearchFieldChange,
    style: {
      "width": props.field_width
    },
    autoCapitalize: "none",
    autoCorrect: "off",
    size: "small",
    inputRef: props.search_ref
  }), props.allow_regex && /*#__PURE__*/_react["default"].createElement(_core.Switch, {
    label: "regexp",
    className: "ml-3 mb-0 mt-1",
    size: "medium",
    checked: props.regex,
    onChange: _handleRegexChange
  }), props.allow_search_metadata && /*#__PURE__*/_react["default"].createElement(_core.Switch, {
    label: "metadata",
    className: "ml-3 mb-0 mt-1",
    size: "medium",
    checked: props.search_metadata,
    onChange: _handleSearchMetadataChange
  }), props.allow_search_inside && /*#__PURE__*/_react["default"].createElement(_core.Switch, {
    label: "inside",
    className: "ml-3 mb-0 mt-1",
    size: "medium",
    checked: props.search_inside,
    onChange: _handleSearchInsideChange
  }), props.allow_show_hidden && /*#__PURE__*/_react["default"].createElement(_core.Switch, {
    label: "show hidden",
    className: "ml-3 mb-0 mt-1",
    size: "medium",
    checked: props.show_hidden,
    onChange: _handleShowHiddenChange
  }), props.include_search_jumper && /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, {
    style: {
      marginLeft: 5,
      padding: 2
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
    onClick: props.searchNext,
    icon: "caret-down",
    text: undefined,
    size: "small"
  }), /*#__PURE__*/_react["default"].createElement(_core.Button, {
    onClick: props.searchPrev,
    icon: "caret-up",
    text: undefined,
    size: "small"
  })))));
}
exports.SearchForm = SearchForm = /*#__PURE__*/(0, _react.memo)(SearchForm);
function BpSelectorTable(props) {
  props = _objectSpread({
    columns: {
      "name": {
        "sort_field": "name",
        "first_sort": "ascending"
      },
      "created": {
        "sort_field": "created_for_sort",
        "first_sort": "descending"
      },
      "updated": {
        "sort_field": "updated_for_sort",
        "first_sort": "ascending"
      }
      // "tags": {"sort_field": "tags", "first_sort": "ascending"}
    },
    identifier_field: "_id",
    enableColumnResigin: false,
    maxColumnWidth: null,
    active_row: 0,
    show_animations: false,
    handleSpaceBarPress: null,
    keyHandler: null,
    draggable: true,
    rowChanged: 0,
    columnWidths: null
  }, props);
  var _useState3 = (0, _react.useState)(null),
    _useState4 = _slicedToArray(_useState3, 2),
    columnWidths = _useState4[0],
    setColumnWidths = _useState4[1];
  var saved_data_dict = (0, _react.useRef)(null);
  var data_update_required = (0, _react.useRef)(null);
  var table_ref = (0, _react.useRef)(null);
  (0, _react.useEffect)(function () {
    // computeColumnWidths();
    saved_data_dict.current = props.data_dict;
  }, []);

  // useEffect(() => {
  //     if ((columnWidthsRef.current == null) || !_.isEqual(props.data_dict, saved_data_dict.current)) {
  //         computeColumnWidths();
  //         saved_data_dict.current = props.data_dict;
  //     }
  // });

  function computeColumnWidths() {
    if (Object.keys(props.data_dict).length == 0) return;
    var column_names = Object.keys(props.columns);
    var bcwidths = compute_initial_column_widths(column_names, Object.values(props.data_dict));
    var cwidths = [];
    if (props.maxColumnWidth) {
      var _iterator = _createForOfIteratorHelper(bcwidths),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var c = _step.value;
          if (c > props.maxColumnWidth) {
            cwidths.push(props.maxColumnWidth);
          } else {
            cwidths.push(c);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    } else {
      cwidths = bcwidths;
    }
    setColumnWidths(cwidths);
  }
  function _onCompleteRender() {
    return _onCompleteRender2.apply(this, arguments);
  }
  function _onCompleteRender2() {
    _onCompleteRender2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
      var lastColumnRegion, firstColumnRegion;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            if (!props.columnWidths) {
              computeColumnWidths();
            }
            if (!(data_update_required.current != null)) {
              _context.n = 2;
              break;
            }
            _context.n = 1;
            return props.initiateDataGrab(data_update_required.current);
          case 1:
            data_update_required.current = null;
          case 2:
            lastColumnRegion = _table.Regions.column(Object.keys(props.columns).length - 1);
            firstColumnRegion = _table.Regions.column(0);
            table_ref.current.scrollToRegion(lastColumnRegion);
            table_ref.current.scrollToRegion(firstColumnRegion);
          case 3:
            return _context.a(2);
        }
      }, _callee);
    }));
    return _onCompleteRender2.apply(this, arguments);
  }
  function haveRowData(rowIndex) {
    return props.data_dict.hasOwnProperty(rowIndex);
  }
  function _cellRendererCreator(column_name) {
    return function (rowIndex) {
      if (!haveRowData(rowIndex)) {
        if (data_update_required.current == null) {
          data_update_required.current = rowIndex;
        }
        return /*#__PURE__*/_react["default"].createElement(_table.Cell, {
          key: column_name,
          loading: true
        });
      }
      var the_body;
      var the_class = "";
      if (Object.keys(props.data_dict[rowIndex]).includes(column_name)) {
        if ("hidden" in props.data_dict[rowIndex] && props.data_dict[rowIndex]["hidden"]) {
          the_class = "hidden_cell";
        }
        var the_text = String(props.data_dict[rowIndex][column_name]);
        if (the_text.startsWith("icon:")) {
          the_text = the_text.replace(/(^icon:)/gi, "");
          the_body = /*#__PURE__*/_react["default"].createElement(_core.Icon, {
            icon: the_text,
            size: 14
          });
        } else {
          the_body = /*#__PURE__*/_react["default"].createElement(_table.TruncatedFormat, {
            className: the_class
          }, the_text);
        }
      } else {
        the_body = "";
      }
      return /*#__PURE__*/_react["default"].createElement(_table.Cell, {
        key: column_name,
        className: "library-table-cell",
        interactive: true,
        truncated: true,
        tabIndex: -1,
        onKeyDown: props.keyHandler,
        wrapText: true
      }, /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
        onDoubleClick: function onDoubleClick() {
          return props.handleRowDoubleClick(props.data_dict[rowIndex]);
        }
      }, the_body)));
    };
  }
  function _renderMenu(sortColumn) {
    var sortAsc = function sortAsc() {
      props.sortColumn(sortColumn, "ascending");
    };
    var sortDesc = function sortDesc() {
      props.sortColumn(sortColumn, "descending");
    };
    return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "sort-asc",
      onClick: sortAsc,
      text: "Sort Asc"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "sort-desc",
      onClick: sortDesc,
      text: "Sort Desc"
    }));
  }
  function _columnHeaderNameRenderer(the_text) {
    var the_body;
    the_text = String(the_text);
    if (the_text.startsWith("icon:")) {
      the_text = the_text.replace(/(^icon:)/gi, "");
      the_body = /*#__PURE__*/_react["default"].createElement(_core.Icon, {
        icon: the_text,
        size: 14
      });
    } else {
      the_body = /*#__PURE__*/_react["default"].createElement("div", {
        className: "bp6-table-truncated-text"
      }, the_text);
    }
    return the_body;
  }
  var column_names = Object.keys(props.columns);
  var columns = column_names.map(function (column_name) {
    var cellRenderer = _cellRendererCreator(column_name);
    var columnHeaderCellRenderer = function columnHeaderCellRenderer() {
      return /*#__PURE__*/_react["default"].createElement(_table.ColumnHeaderCell, {
        name: column_name,
        className: "library-header-cell",
        nameRenderer: _columnHeaderNameRenderer,
        menuRenderer: function menuRenderer() {
          return _renderMenu(column_name);
        }
      });
    };
    return /*#__PURE__*/_react["default"].createElement(_table.Column, {
      cellRenderer: cellRenderer,
      enableColumnReordering: false,
      columnHeaderCellRenderer: columnHeaderCellRenderer,
      key: column_name,
      name: column_name
    });
  });
  var dependencies;
  if (props.open_resources_ref && props.open_resources_ref.current) {
    dependencies = [props.data_dict, props.open_resources_ref.current];
  } else {
    dependencies = [props.data_dict];
  }
  return /*#__PURE__*/_react["default"].createElement(_table.Table, {
    numRows: props.num_rows,
    ref: table_ref,
    cellRendererDependencies: dependencies,
    bodyContextMenuRenderer: props.renderBodyContextMenu,
    enableColumnReordering: false,
    enableColumnResizing: props.enableColumnResizing,
    maxColumnWidth: props.maxColumnWidth,
    enableMultipleSelection: true,
    defaultRowHeight: 27,
    selectedRegions: props.selectedRegions,
    enableRowHeader: false,
    columnWidths: props.columnWidths ? props.columnWidths : columnWidths,
    onCompleteRender: _onCompleteRender,
    selectionModes: _table.SelectionModes.ALL,
    onSelection: function onSelection(regions) {
      return props.onSelection(regions);
    }
  }, columns);
}
exports.BpSelectorTable = BpSelectorTable = /*#__PURE__*/(0, _react.memo)(BpSelectorTable);
var MAX_INITIAL_CELL_WIDTH = 300;
var ICON_WIDTH = 35;
function compute_initial_column_widths(header_list, data_list) {
  var max_field_width = MAX_INITIAL_CELL_WIDTH;

  // Get sample header and body cells

  // set up a canvas so that we can use it to compute the width of text
  // let body_font = $($(".bp6-table-truncated-text")[0]).css("font");
  var element = document.querySelector(".bp6-table-truncated-text");
  var body_font = window.getComputedStyle(element).getPropertyValue("font");
  //let header_font = $($(".bp6-table-column-name-text")[0]).css("font");
  var header_element = document.querySelector(".bp6-table-column-name-text");
  var header_font = window.getComputedStyle(header_element).getPropertyValue("font");
  var canvas_element = document.getElementById("measure-canvas");
  var ctx = canvas_element.getContext("2d");
  var added_body_width = 20;
  var added_header_width = 30;
  var column_widths = {};
  var columns_remaining = [];
  ctx.font = header_font;
  var _iterator2 = _createForOfIteratorHelper(header_list),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var c = _step2.value;
      var cstr = String(c);
      if (cstr.startsWith("icon:")) {
        column_widths[cstr] = ICON_WIDTH;
      } else {
        column_widths[cstr] = ctx.measureText(cstr).width + added_header_width;
      }
      columns_remaining.push(cstr);
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  var the_row;
  var the_width;
  var the_text;

  // Find the width of each body cell
  // Keep track of the largest value for each column
  // Once a column has the max value can ignore that column in the future.
  ctx.font = body_font;
  var _iterator3 = _createForOfIteratorHelper(data_list),
    _step3;
  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var item = _step3.value;
      if (columns_remaining.length == 0) {
        break;
      }
      the_row = item;
      var cols_to_remove = [];
      var _iterator5 = _createForOfIteratorHelper(columns_remaining),
        _step5;
      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var _c2 = _step5.value;
          the_text = String(the_row[_c2]);
          if (the_text.startsWith("icon:")) {
            the_width = ICON_WIDTH;
          } else {
            the_width = ctx.measureText(the_text).width + added_body_width;
          }
          if (the_width > max_field_width) {
            the_width = max_field_width;
            cols_to_remove.push(_c2);
          }
          if (the_width > column_widths[_c2]) {
            column_widths[_c2] = the_width;
          }
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
      for (var _i = 0, _cols_to_remove = cols_to_remove; _i < _cols_to_remove.length; _i++) {
        var _c = _cols_to_remove[_i];
        var index = columns_remaining.indexOf(_c);
        if (index !== -1) {
          columns_remaining.splice(index, 1);
        }
      }
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
  var result = [];
  var _iterator4 = _createForOfIteratorHelper(header_list),
    _step4;
  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var _c3 = _step4.value;
      result.push(column_widths[_c3]);
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }
  return result;
}
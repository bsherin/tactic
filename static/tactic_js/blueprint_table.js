"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BlueprintTable = BlueprintTable;
exports.compute_added_column_width = compute_added_column_width;
exports.compute_initial_column_widths = compute_initial_column_widths;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _table = require("@blueprintjs/table");
var _objectHash = _interopRequireDefault(require("object-hash"));
var _utilities_react = require("./utilities_react");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var MAX_INITIAL_CELL_WIDTH = 400;
function ColoredWord(props) {
  var style = {
    backgroundColor: props.the_color
  };
  return /*#__PURE__*/_react["default"].createElement("span", {
    style: style
  }, props.the_word);
}
ColoredWord.propTypes = {
  the_color: _propTypes["default"].string,
  the_word: _propTypes["default"].string
};
ColoredWord = /*#__PURE__*/(0, _react.memo)(ColoredWord);
function BlueprintTable(props) {
  var top_ref = (0, _react.useRef)(null);
  var mismatched_column_widths = (0, _react.useRef)(false);
  var table_ref = (0, _react.useRef)(null);
  var data_update_required = (0, _react.useRef)(null);
  var current_doc_name = (0, _react.useRef)(null);
  var _useState = (0, _react.useState)(null),
    _useState2 = _slicedToArray(_useState, 2),
    focusedCell = _useState2[0],
    setFocusedCell = _useState2[1];
  (0, _react.useEffect)(function () {
    computeColumnWidths();
    _updateRowHeights();
  }, []);
  (0, _react.useEffect)(function () {
    if (props.mState.table_spec.column_widths == null || mismatched_column_widths.current || props.mState.table_spec.current_doc_name != current_doc_name.current) {
      computeColumnWidths();
      current_doc_name.current = props.mState.table_spec.current_doc_name;
    }
    _updateRowHeights();
  });
  (0, _react.useEffect)(function () {
    computeColumnWidths();
    _updateRowHeights();
  }, [current_doc_name.current]);
  (0, _react.useEffect)(function () {
    _updateRowHeights();
  }, [props.mState.update_index]);
  function hash_value() {
    var obj = {
      cwidths: props.mState.table_spec.column_widths,
      nrows: props.mState.total_rows
      // sscroll: set_scroll
    };
    return (0, _objectHash["default"])(obj);
  }
  function computeColumnWidths() {
    if (props.mState.data_row_dict) {
      var _cwidths = compute_initial_column_widths(props.filtered_column_names, props.mState.data_row_dict);
      mismatched_column_widths.current = false;
      props.updateTableSpec({
        column_widths: _cwidths
      }, true);
    }
  }
  function haveRowData(rowIndex) {
    return props.mState.data_row_dict.hasOwnProperty(rowIndex);
  }
  function _doScroll() {
    if (data_update_required.current != null) {
      var rindex = data_update_required.current;
      data_update_required.current = null;
      props.initiateDataGrab(rindex);
    } else if (props.set_scroll.current != null && table_ref.current) {
      try {
        var singleCellRegion = _table.Regions.cell(props.set_scroll.current, 0);
        table_ref.current.scrollToRegion(singleCellRegion);
        props.clearScroll();
      } catch (e) {
        console.log(e.message);
      }
    }
  }
  function _updateRowHeights() {
    var fcnames = props.filtered_column_names;
    table_ref.current.resizeRowsByApproximateHeight(function (rowIndex, colIndex) {
      if (!haveRowData(rowIndex)) {
        return "empty cell";
      }
      return props.mState.data_row_dict[rowIndex][fcnames[colIndex]];
    }, {
      getNumBufferLines: 1
    });
  }
  function _rowHeaderCellRenderer(rowIndex) {
    if (haveRowData(rowIndex)) {
      return /*#__PURE__*/_react["default"].createElement(_table.RowHeaderCell, {
        key: rowIndex,
        name: props.mState.data_row_dict[rowIndex].__id__
      });
    } else {
      return /*#__PURE__*/_react["default"].createElement(_table.RowHeaderCell, {
        key: rowIndex,
        loading: true,
        name: rowIndex
      });
    }
  }
  function _text_color_dict(row_id, colname) {
    if (props.mState.cells_to_color_text.hasOwnProperty(row_id)) {
      var text_color_dict = props.mState.cells_to_color_text[row_id];
      if (text_color_dict.hasOwnProperty(colname)) {
        return text_color_dict[colname];
      }
      return null;
    }
    return null;
  }
  function _cell_background_color(row_id, colname) {
    if (props.mState.table_spec.cell_backgrounds.hasOwnProperty(row_id)) {
      var cell_background_dict = props.mState.table_spec.cell_backgrounds[row_id];
      if (cell_background_dict.hasOwnProperty(colname)) {
        return cell_background_dict[colname];
      }
      return null;
    }
    return null;
  }
  function _cellRendererCreator(column_name) {
    return function (rowIndex) {
      var the_text;
      var cell_bg_color;
      try {
        if (!haveRowData(rowIndex)) {
          if (data_update_required.current == null) {
            data_update_required.current = rowIndex;
          }
          return /*#__PURE__*/_react["default"].createElement(_table.Cell, {
            key: column_name,
            loading: true
          });
        }
        var text_color_dict = _text_color_dict(rowIndex, column_name);
        if (text_color_dict) {
          var color_dict = text_color_dict.color_dict;
          var token_text = text_color_dict.token_text;
          var revised_text = [];
          var index = 0;
          var _iterator = _createForOfIteratorHelper(token_text),
            _step;
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var w = _step.value;
              if (color_dict.hasOwnProperty(w)) {
                revised_text.push(/*#__PURE__*/_react["default"].createElement(ColoredWord, {
                  key: index,
                  the_color: color_dict[w],
                  the_word: w
                }));
              } else {
                revised_text.push(w + " ");
              }
              index += 1;
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
          return /*#__PURE__*/_react["default"].createElement(_table.Cell, {
            key: column_name,
            truncated: true,
            wrapText: true
          }, revised_text);
        }
        cell_bg_color = _cell_background_color(rowIndex, column_name);
        the_text = props.mState.data_row_dict[rowIndex][column_name];
        if (props.mState.alt_search_text != null && props.mState.alt_search_text != "") {
          var regex = new RegExp(props.mState.alt_search_text, "gi");
          the_text = String(the_text).replace(regex, function (matched) {
            return "<mark>" + matched + "</mark>";
          });
          var converted_dict = {
            __html: the_text
          };
          return /*#__PURE__*/_react["default"].createElement(_table.Cell, {
            key: column_name,
            style: {
              backgroundColor: cell_bg_color
            },
            truncated: true,
            wrapText: true
          }, /*#__PURE__*/_react["default"].createElement("div", {
            dangerouslySetInnerHTML: converted_dict
          }));
        }
        if (props.mState.search_text != null && props.mState.search_text != "") {
          var _regex = new RegExp(props.mState.search_text, "gi");
          the_text = String(the_text).replace(_regex, function (matched) {
            return "<mark>" + matched + "</mark>";
          });
          var _converted_dict = {
            __html: the_text
          };
          return /*#__PURE__*/_react["default"].createElement(_table.Cell, {
            key: column_name,
            style: {
              backgroundColor: cell_bg_color
            },
            truncated: true,
            wrapText: true
          }, /*#__PURE__*/_react["default"].createElement("div", {
            dangerouslySetInnerHTML: _converted_dict
          }));
        }
        if (!props.mState.spreadsheet_mode) {
          return /*#__PURE__*/_react["default"].createElement(_table.Cell, {
            key: column_name,
            style: {
              backgroundColor: cell_bg_color
            },
            truncated: true,
            wrapText: true
          }, the_text);
        }
      } catch (e) {
        console.log(e.message);
        the_text = "";
      }
      // Wrapping the contents of the cell in React.Fragment prevent React from
      // generating a warning for reasons that are mysterious
      return /*#__PURE__*/_react["default"].createElement(EnhancedEditableCell, {
        key: column_name,
        truncated: true,
        rowIndex: rowIndex,
        className: "cell-class",
        interactive: false,
        columnIndex: props.filtered_column_names.indexOf(column_name),
        columnHeader: column_name,
        wrapText: true,
        setCellContent: props.setCellContent,
        bgColor: cell_bg_color,
        value: the_text
      });
    };
  }
  function _onSelection(regions) {
    if (regions.length == 0) return; // Without this get an error when clicking on a body cell
    props.setMainStateValue("selected_regions", regions);
    if (regions[0].hasOwnProperty("cols")) {
      _setSelectedColumn(props.filtered_column_names[regions[0]["cols"][0]]);
    } else if (regions[0].hasOwnProperty("rows")) {
      _setSelectedRow(regions[0]["rows"][0]);
    }
  }
  function _setSelectedColumn(column_name) {
    props.setMainStateValue({
      "selected_column": column_name,
      "selected_row": null
    });
  }
  function _setSelectedRow(rowIndex) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    props.setMainStateValue({
      selected_row: props.mState.data_row_dict[rowIndex].__id__,
      selected_column: null
    }, null, callback);
  }
  function _onColumnWidthChanged(index, size) {
    var cwidths = props.mState.table_spec.column_widths;
    cwidths[index] = size;
    props.updateTableSpec({
      column_widths: cwidths
    }, true);
  }
  function updateUpdateIndex() {
    props.setMainStateValue("update_index", props.mState.update_index + 1);
  }
  function _onColumnsReordered(oldIndex, newIndex) {
    var col_to_move = props.filtered_column_names[oldIndex];
    var cnames = _toConsumableArray(props.filtered_column_names);
    cnames.splice(oldIndex, 1);
    var target_col = cnames[newIndex];
    props.moveColumn(col_to_move, target_col);
  }
  function _onFocusedCell(focusedCell) {
    setFocusedCell(focusedCell);
  }
  var columns = props.filtered_column_names.map(function (column_name) {
    var cellRenderer = _cellRendererCreator(column_name);
    return /*#__PURE__*/_react["default"].createElement(_table.Column, {
      cellRenderer: cellRenderer,
      enableColumnReordering: true,
      key: column_name,
      name: column_name
    });
  });
  var cwidths;
  if (props.mState.table_spec.column_widths == null || props.mState.table_spec.column_widths.length == 0) {
    cwidths = null;
  } else {
    cwidths = props.mState.table_spec.column_widths;
  }
  if (cwidths != null && cwidths.length != props.filtered_column_names.length) {
    cwidths = null;
    mismatched_column_widths.current = true;
  }
  var style = {
    display: "block",
    overflowY: "auto",
    overflowX: "hidden",
    height: "100%"
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "table-area",
    ref: top_ref,
    style: style
  }, /*#__PURE__*/_react["default"].createElement(_table.Table, {
    ref: table_ref,
    key: hash_value() // kludge: Having this prevents partial row rendering
    ,
    numRows: props.mState.total_rows,
    enableColumnReordering: true,
    onColumnsReordered: _onColumnsReordered,
    onSelection: _onSelection,
    selectedRegions: props.mState.selected_regions ? props.mState.selected_regions : [_table.Regions.row(0)],
    onCompleteRender: _doScroll,
    onColumnWidthChanged: _onColumnWidthChanged,
    onFocusedCell: _onFocusedCell,
    focusedCell: focusedCell,
    enableMultipleSelection: false,
    enableFocusedCell: props.mState.spreadsheet_mode,
    selectionModes: [_table.RegionCardinality.FULL_COLUMNS, _table.RegionCardinality.FULL_ROWS],
    minColumnWidth: 75,
    columnWidths: cwidths,
    rowHeaderCellRenderer: _rowHeaderCellRenderer
  }, columns));
}
exports.BlueprintTable = BlueprintTable = /*#__PURE__*/(0, _react.memo)(BlueprintTable);
function EnhancedEditableCell(props) {
  var cell_ref = (0, _react.useRef)(null);
  var _useState3 = (0, _react.useState)(false),
    _useState4 = _slicedToArray(_useState3, 2),
    am_editing = _useState4[0],
    set_am_editing = _useState4[1];
  var _useState5 = (0, _react.useState)(""),
    _useState6 = _slicedToArray(_useState5, 2),
    saved_text = _useState6[0],
    set_saved_text = _useState6[1];
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  function _handleKeyDown() {
    if (cell_ref.current) {
      cell_ref.current.handleEdit();
      set_am_editing(true);
      set_saved_text(props.value);
    }
  }
  function _onChange(value) {
    props.setCellContent(props.rowIndex, props.columnHeader, value, true);
  }
  function _onCancel() {
    props.setCellContent(props.rowIndex, props.columnHeader, saved_text, true);
    set_am_editing(false);
  }
  function _onConfirmCellEdit(value) {
    set_am_editing(false);
    pushCallback(function () {
      props.setCellContent(props.rowIndex, props.columnHeader, value, true);
    });
  }
  return /*#__PURE__*/_react["default"].createElement(_table.EditableCell, _extends({
    ref: cell_ref,
    onConfirm: _onConfirmCellEdit,
    onChange: _onChange,
    onCancel: _onCancel,
    style: {
      backgroundColor: props.bgColor
    },
    onKeyDown: am_editing ? null : _handleKeyDown
  }, props));
}
EnhancedEditableCell = /*#__PURE__*/(0, _react.memo)(EnhancedEditableCell);
function compute_added_column_width(header_text) {
  var max_field_width = MAX_INITIAL_CELL_WIDTH;
  var elements = document.querySelectorAll(".bp6-table-truncated-text");
  var added_header_width = 40;
  if (elements.length > 0) {
    var header_font = window.getComputedStyle(elements[0]).font;
    var canvas_element = document.getElementById("measure-canvas");
    if (canvas_element) {
      var ctx = canvas_element.getContext("2d");
      ctx.font = header_font;
      return ctx.measureText(header_text).width + added_header_width;
    }
  }
  return max_field_width + added_header_width;
}
function compute_initial_column_widths(header_list, data_row_dict) {
  var max_field_width = MAX_INITIAL_CELL_WIDTH;

  // Get sample header and body cells
  // set up a canvas so that we can use it to compute the width of text
  var elements = document.querySelectorAll(".bp6-table-truncated-text");
  var body_font;
  if (elements.length > 0) {
    body_font = window.getComputedStyle(elements[0]).font;
  } else {
    body_font = '600 14px / 30px "Helvetica Neue", Helvetica, Arial, sans-serif';
  }
  var header_font = body_font;
  var canvas_element = document.getElementById("measure-canvas");
  var ctx = canvas_element.getContext("2d");
  var added_header_width = 40;
  var added_body_width = 40;
  var column_widths = {};
  var columns_remaining = [];
  var _iterator2 = _createForOfIteratorHelper(header_list),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var _c3 = _step2.value;
      column_widths[_c3] = 0;
      columns_remaining.push(_c3);
    }
    // Get the width for each header column
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  ctx.font = header_font;
  var the_row;
  var the_width;
  var the_text;
  for (var _i = 0, _columns_remaining = columns_remaining; _i < _columns_remaining.length; _i++) {
    var c = _columns_remaining[_i];
    the_text = header_list[c];
    the_width = ctx.measureText(the_text).width + added_header_width;
    if (the_width > max_field_width) {
      the_width = max_field_width;
      var index = columns_remaining.indexOf(c);
      if (index !== -1) {
        columns_remaining.splice(index, 1);
      }
    }
    if (the_width > column_widths[c]) {
      column_widths[c] = the_width;
    }
  }

  // Find the width of each body cell
  // Keep track of the largest value for each column
  // Once a column has the max value can ignore that column in the future.
  ctx.font = body_font;
  var dkeys = Object.keys(data_row_dict);
  for (var _i2 = 0, _dkeys = dkeys; _i2 < _dkeys.length; _i2++) {
    var item = _dkeys[_i2];
    if (columns_remaining.length == 0) {
      break;
    }
    the_row = data_row_dict[item];
    var cols_to_remove = [];
    var _iterator3 = _createForOfIteratorHelper(columns_remaining),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var _c2 = _step3.value;
        the_text = the_row[_c2];
        the_width = ctx.measureText(the_text).width + added_body_width;
        if (the_width > max_field_width) {
          the_width = max_field_width;
          cols_to_remove.push(_c2);
        }
        if (the_width > column_widths[_c2]) {
          column_widths[_c2] = the_width;
        }
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    for (var _i3 = 0, _cols_to_remove = cols_to_remove; _i3 < _cols_to_remove.length; _i3++) {
      var _c = _cols_to_remove[_i3];
      var _index = columns_remaining.indexOf(_c);
      if (_index !== -1) {
        columns_remaining.splice(_index, 1);
      }
    }
  }
  var result = [];
  var _iterator4 = _createForOfIteratorHelper(header_list),
    _step4;
  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var _c4 = _step4.value;
      result.push(column_widths[_c4]);
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }
  return result;
}
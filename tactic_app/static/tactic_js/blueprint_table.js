"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BlueprintTable = BlueprintTable;
exports.compute_added_column_width = compute_added_column_width;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _table = require("@blueprintjs/table");
var _objectHash = _interopRequireDefault(require("object-hash"));
var _utilities_react = require("./utilities_react");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var MAX_INITIAL_CELL_WIDTH = 400;
var EXTRA_TABLE_AREA_SPACE = 500;
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
function BlueprintTable(props, passedRef) {
  var mismatched_column_widths = (0, _react.useRef)(false);
  var table_ref = (0, _react.useRef)(null);
  var data_update_required = (0, _react.useRef)(null);
  var _useState = (0, _react.useState)(null),
    _useState2 = _slicedToArray(_useState, 2),
    focusedCell = _useState2[0],
    setFocusedCell = _useState2[1];
  (0, _react.useEffect)(function () {
    computeColumnWidths();
    _updateRowHeights();
  }, []);
  (0, _react.useEffect)(function () {
    if (props.mState.table_spec.column_widths == null || mismatched_column_widths.current) {
      computeColumnWidths();
    }
    _updateRowHeights();
  });
  function hash_value() {
    var obj = {
      cwidths: props.mState.table_spec.column_widths,
      nrows: props.mState.total_rows
      // sscroll: set_scroll
    };

    return (0, _objectHash["default"])(obj);
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //     if (this.set_scroll || this.data_update_required) {
  //         return true
  //     }
  //     return !propsAreEqual(nextProps, this.props) || !propsAreEqual(nextState, this.state)
  // }

  function computeColumnWidths() {
    var cwidths = compute_initial_column_widths(props.filtered_column_names, props.mState.data_row_dict);
    mismatched_column_widths.current = false;
    props.updateTableSpec({
      column_widths: cwidths
    }, true);
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
    var self = this;
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
                revised_text.push( /*#__PURE__*/_react["default"].createElement(ColoredWord, {
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
          var converted_dict = {
            __html: revised_text
          };
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
        if (props.mState.search_text != null && props.mState.search_text != "") {
          var _regex = new RegExp(props.mState.search_text, "gi");
          the_text = String(the_text).replace(_regex, function (matched) {
            return "<mark>" + matched + "</mark>";
          });
          var _converted_dict2 = {
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
            dangerouslySetInnerHTML: _converted_dict2
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
    props.setMainStateValue({
      "selected_row": props.mState.data_row_dict[rowIndex].__id__,
      "selected_column": null
    });
  }
  function broadcast_column_widths(docname, cwidths) {
    props.broadcast_event_to_server("UpdateColumnWidths", {
      "doc_to_update": docname,
      "column_widths": cwidths
    }, null);
  }
  function _onColumnWidthChanged(index, size) {
    var cwidths = props.mState.table_spec.column_widths;
    cwidths[index] = size;
    props.updateTableSpec({
      column_widths: cwidths
    }, true);
  }
  function _onColumnsReordered(oldIndex, newIndex, length) {
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
    height: props.height
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    id: "table-area",
    ref: passedRef,
    style: style
  }, /*#__PURE__*/_react["default"].createElement(_table.Table, {
    ref: table_ref,
    key: hash_value() // kludge: Having this prevents partial row rendering
    ,
    numRows: props.mState.total_rows,
    enableColumnReordering: true,
    onColumnsReordered: _onColumnsReordered,
    onSelection: _onSelection,
    selectedRegions: props.mState.selected_regions,
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
exports.BlueprintTable = BlueprintTable = /*#__PURE__*/(0, _react.memo)( /*#__PURE__*/(0, _react.forwardRef)(BlueprintTable));
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
  function _handleKeyDown(event) {
    if (cell_ref.current) {
      cell_ref.current.handleEdit();
      set_am_editing(true);
      set_saved_text(props.value);
    }
  }
  function _onChange(value, rowIndex, columnIndex) {
    props.setCellContent(props.rowIndex, props.columnHeader, value, false);
  }
  function _onCancel() {
    props.setCellContent(props.rowIndex, props.columnHeader, saved_text, false);
    set_am_editing(false);
  }
  function _onConfirmCellEdit(value, rowIndex, columnIndex) {
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
  var header_font = $($(".bp5-table-truncated-text")[0]).css("font");
  var canvas_element = document.getElementById("measure-canvas");
  var ctx = canvas_element.getContext("2d");
  var added_header_width = 40;
  ctx.font = header_font;
  return ctx.measureText(header_text).width + added_header_width;
}
function compute_initial_column_widths(header_list, data_row_dict) {
  var ncols = header_list.length;
  var max_field_width = MAX_INITIAL_CELL_WIDTH;

  // Get sample header and body cells

  // set up a canvas so that we can use it to compute the width of text
  var body_font = $($(".bp5-table-truncated-text")[0]).css("font");
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
  var the_child;
  for (var _i2 = 0, _columns_remaining = columns_remaining; _i2 < _columns_remaining.length; _i2++) {
    var c = _columns_remaining[_i2];
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
  for (var _i3 = 0, _dkeys = dkeys; _i3 < _dkeys.length; _i3++) {
    var item = _dkeys[_i3];
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
    for (var _i4 = 0, _cols_to_remove = cols_to_remove; _i4 < _cols_to_remove.length; _i4++) {
      var _c = _cols_to_remove[_i4];
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
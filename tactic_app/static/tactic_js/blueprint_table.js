"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BlueprintTable = BlueprintTable;
exports.compute_added_column_width = compute_added_column_width;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _table = require("@blueprintjs/table");
var _objectHash = _interopRequireDefault(require("object-hash"));
var _utilities_react = require("./utilities_react");
var _sizing_tools = require("./sizing_tools");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const MAX_INITIAL_CELL_WIDTH = 400;
const EXTRA_TABLE_AREA_SPACE = 500;
function ColoredWord(props) {
  let style = {
    backgroundColor: props.the_color
  };
  return /*#__PURE__*/_react.default.createElement("span", {
    style: style
  }, props.the_word);
}
ColoredWord.propTypes = {
  the_color: _propTypes.default.string,
  the_word: _propTypes.default.string
};
ColoredWord = /*#__PURE__*/(0, _react.memo)(ColoredWord);
function BlueprintTable(props, passedRef) {
  const top_ref = (0, _react.useRef)(null);
  const mismatched_column_widths = (0, _react.useRef)(false);
  const table_ref = (0, _react.useRef)(null);
  const data_update_required = (0, _react.useRef)(null);
  const current_doc_name = (0, _react.useRef)(null);
  const [focusedCell, setFocusedCell] = (0, _react.useState)(null);
  const [usable_width, usable_height] = (0, _sizing_tools.useSize)(top_ref, 0, "BlueprintTable");
  (0, _react.useEffect)(() => {
    computeColumnWidths();
    _updateRowHeights();
  }, []);
  (0, _react.useEffect)(() => {
    // if ((props.mState.table_spec.column_widths == null) || (mismatched_column_widths.current) ||
    //     props.mState.table_spec.current_doc_name != current_doc_name.current) {
    //     computeColumnWidths();
    //     current_doc_name.current = props.mState.table_spec.current_doc_name
    // }
    computeColumnWidths(); // I need to do this every time or the rows don't resize when changing docs.
    _updateRowHeights();
  });
  function hash_value() {
    let obj = {
      cwidths: props.mState.table_spec.column_widths,
      nrows: props.mState.total_rows
      // sscroll: set_scroll
    };
    return (0, _objectHash.default)(obj);
  }
  function computeColumnWidths() {
    if (props.mState.data_row_dict) {
      let cwidths = compute_initial_column_widths(props.filtered_column_names, props.mState.data_row_dict);
      mismatched_column_widths.current = false;
      props.updateTableSpec({
        column_widths: cwidths
      }, true);
    }
  }
  function haveRowData(rowIndex) {
    return props.mState.data_row_dict.hasOwnProperty(rowIndex);
  }
  function _doScroll() {
    if (data_update_required.current != null) {
      let rindex = data_update_required.current;
      data_update_required.current = null;
      props.initiateDataGrab(rindex);
    } else if (props.set_scroll.current != null && table_ref.current) {
      try {
        let singleCellRegion = _table.Regions.cell(props.set_scroll.current, 0);
        table_ref.current.scrollToRegion(singleCellRegion);
        props.clearScroll();
      } catch (e) {
        console.log(e.message);
      }
    }
  }
  function _updateRowHeights() {
    let fcnames = props.filtered_column_names;
    table_ref.current.resizeRowsByApproximateHeight((rowIndex, colIndex) => {
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
      return /*#__PURE__*/_react.default.createElement(_table.RowHeaderCell, {
        key: rowIndex,
        name: props.mState.data_row_dict[rowIndex].__id__
      });
    } else {
      return /*#__PURE__*/_react.default.createElement(_table.RowHeaderCell, {
        key: rowIndex,
        loading: true,
        name: rowIndex
      });
    }
  }
  function _text_color_dict(row_id, colname) {
    if (props.mState.cells_to_color_text.hasOwnProperty(row_id)) {
      let text_color_dict = props.mState.cells_to_color_text[row_id];
      if (text_color_dict.hasOwnProperty(colname)) {
        return text_color_dict[colname];
      }
      return null;
    }
    return null;
  }
  function _cell_background_color(row_id, colname) {
    if (props.mState.table_spec.cell_backgrounds.hasOwnProperty(row_id)) {
      let cell_background_dict = props.mState.table_spec.cell_backgrounds[row_id];
      if (cell_background_dict.hasOwnProperty(colname)) {
        return cell_background_dict[colname];
      }
      return null;
    }
    return null;
  }
  function _cellRendererCreator(column_name) {
    let self = this;
    return rowIndex => {
      let the_text;
      let cell_bg_color;
      try {
        if (!haveRowData(rowIndex)) {
          if (data_update_required.current == null) {
            data_update_required.current = rowIndex;
          }
          return /*#__PURE__*/_react.default.createElement(_table.Cell, {
            key: column_name,
            loading: true
          });
        }
        let text_color_dict = _text_color_dict(rowIndex, column_name);
        if (text_color_dict) {
          let color_dict = text_color_dict.color_dict;
          let token_text = text_color_dict.token_text;
          let revised_text = [];
          let index = 0;
          for (let w of token_text) {
            if (color_dict.hasOwnProperty(w)) {
              revised_text.push( /*#__PURE__*/_react.default.createElement(ColoredWord, {
                key: index,
                the_color: color_dict[w],
                the_word: w
              }));
            } else {
              revised_text.push(w + " ");
            }
            index += 1;
          }
          let converted_dict = {
            __html: revised_text
          };
          return /*#__PURE__*/_react.default.createElement(_table.Cell, {
            key: column_name,
            truncated: true,
            wrapText: true
          }, revised_text);
        }
        cell_bg_color = _cell_background_color(rowIndex, column_name);
        the_text = props.mState.data_row_dict[rowIndex][column_name];
        if (props.mState.alt_search_text != null && props.mState.alt_search_text != "") {
          const regex = new RegExp(props.mState.alt_search_text, "gi");
          the_text = String(the_text).replace(regex, function (matched) {
            return "<mark>" + matched + "</mark>";
          });
          let converted_dict = {
            __html: the_text
          };
          return /*#__PURE__*/_react.default.createElement(_table.Cell, {
            key: column_name,
            style: {
              backgroundColor: cell_bg_color
            },
            truncated: true,
            wrapText: true
          }, /*#__PURE__*/_react.default.createElement("div", {
            dangerouslySetInnerHTML: converted_dict
          }));
        }
        if (props.mState.search_text != null && props.mState.search_text != "") {
          const regex = new RegExp(props.mState.search_text, "gi");
          the_text = String(the_text).replace(regex, function (matched) {
            return "<mark>" + matched + "</mark>";
          });
          let converted_dict = {
            __html: the_text
          };
          return /*#__PURE__*/_react.default.createElement(_table.Cell, {
            key: column_name,
            style: {
              backgroundColor: cell_bg_color
            },
            truncated: true,
            wrapText: true
          }, /*#__PURE__*/_react.default.createElement("div", {
            dangerouslySetInnerHTML: converted_dict
          }));
        }
        if (!props.mState.spreadsheet_mode) {
          return /*#__PURE__*/_react.default.createElement(_table.Cell, {
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
      return /*#__PURE__*/_react.default.createElement(EnhancedEditableCell, {
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
    let callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    console.log("Setting selected for " + String(rowIndex));
    props.setMainStateValue({
      selected_row: props.mState.data_row_dict[rowIndex].__id__,
      selected_column: null
    }, null, callback);
  }
  function _onColumnWidthChanged(index, size) {
    let cwidths = props.mState.table_spec.column_widths;
    cwidths[index] = size;
    props.updateTableSpec({
      column_widths: cwidths
    }, true);
  }
  function _onColumnsReordered(oldIndex, newIndex, length) {
    let col_to_move = props.filtered_column_names[oldIndex];
    let cnames = [...props.filtered_column_names];
    cnames.splice(oldIndex, 1);
    let target_col = cnames[newIndex];
    props.moveColumn(col_to_move, target_col);
  }
  function _onFocusedCell(focusedCell) {
    setFocusedCell(focusedCell);
  }
  let columns = props.filtered_column_names.map(column_name => {
    const cellRenderer = _cellRendererCreator(column_name);
    return /*#__PURE__*/_react.default.createElement(_table.Column, {
      cellRenderer: cellRenderer,
      enableColumnReordering: true,
      key: column_name,
      name: column_name
    });
  });
  let cwidths;
  if (props.mState.table_spec.column_widths == null || props.mState.table_spec.column_widths.length == 0) {
    cwidths = null;
  } else {
    cwidths = props.mState.table_spec.column_widths;
  }
  if (cwidths != null && cwidths.length != props.filtered_column_names.length) {
    cwidths = null;
    mismatched_column_widths.current = true;
  }
  let style = {
    display: "block",
    overflowY: "auto",
    overflowX: "hidden",
    height: usable_height
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    id: "table-area",
    ref: top_ref,
    style: style
  }, /*#__PURE__*/_react.default.createElement(_table.Table, {
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
exports.BlueprintTable = BlueprintTable = /*#__PURE__*/(0, _react.memo)(BlueprintTable);
function EnhancedEditableCell(props) {
  const cell_ref = (0, _react.useRef)(null);
  const [am_editing, set_am_editing] = (0, _react.useState)(false);
  const [saved_text, set_saved_text] = (0, _react.useState)("");
  const pushCallback = (0, _utilities_react.useCallbackStack)();
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
    pushCallback(() => {
      props.setCellContent(props.rowIndex, props.columnHeader, value, true);
    });
  }
  return /*#__PURE__*/_react.default.createElement(_table.EditableCell, (0, _extends2.default)({
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
  const max_field_width = MAX_INITIAL_CELL_WIDTH;
  const elements = document.querySelectorAll(".bp5-table-truncated-text");
  let added_header_width = 40;
  if (elements.length > 0) {
    let header_font = window.getComputedStyle(elements[0]).font;
    let canvas_element = document.getElementById("measure-canvas");
    if (canvas_element) {
      let ctx = canvas_element.getContext("2d");
      ctx.font = header_font;
      return ctx.measureText(header_text).width + added_header_width;
    }
  }
  return max_field_width + added_header_width;
}
function compute_initial_column_widths(header_list, data_row_dict) {
  const ncols = header_list.length;
  const max_field_width = MAX_INITIAL_CELL_WIDTH;

  // Get sample header and body cells
  // set up a canvas so that we can use it to compute the width of text
  const elements = document.querySelectorAll(".bp5-table-truncated-text");
  let body_font;
  if (elements.length > 0) {
    body_font = window.getComputedStyle(elements[0]).font;
  } else {
    body_font = '600 14px / 30px "Helvetica Neue", Helvetica, Arial, sans-serif';
  }
  let header_font = body_font;
  let canvas_element = document.getElementById("measure-canvas");
  let ctx = canvas_element.getContext("2d");
  let added_header_width = 40;
  let added_body_width = 40;
  let column_widths = {};
  let columns_remaining = [];
  for (let c of header_list) {
    column_widths[c] = 0;
    columns_remaining.push(c);
  }
  // Get the width for each header column
  ctx.font = header_font;
  let the_row;
  let the_width;
  let the_text;
  let the_child;
  for (let c of columns_remaining) {
    the_text = header_list[c];
    the_width = ctx.measureText(the_text).width + added_header_width;
    if (the_width > max_field_width) {
      the_width = max_field_width;
      let index = columns_remaining.indexOf(c);
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
  let dkeys = Object.keys(data_row_dict);
  for (const item of dkeys) {
    if (columns_remaining.length == 0) {
      break;
    }
    the_row = data_row_dict[item];
    let cols_to_remove = [];
    for (let c of columns_remaining) {
      the_text = the_row[c];
      the_width = ctx.measureText(the_text).width + added_body_width;
      if (the_width > max_field_width) {
        the_width = max_field_width;
        cols_to_remove.push(c);
      }
      if (the_width > column_widths[c]) {
        column_widths[c] = the_width;
      }
    }
    for (let c of cols_to_remove) {
      let index = columns_remaining.indexOf(c);
      if (index !== -1) {
        columns_remaining.splice(index, 1);
      }
    }
  }
  let result = [];
  for (let c of header_list) {
    result.push(column_widths[c]);
  }
  return result;
}
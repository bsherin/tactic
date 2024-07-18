"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BpOrderableTable = BpOrderableTable;
exports.GlyphButton = GlyphButton;
exports.LabeledFormField = LabeledFormField;
exports.LabeledSelectList = LabeledSelectList;
exports.LabeledTextArea = LabeledTextArea;
exports.SelectList = SelectList;
exports.withTooltip = withTooltip;
var _react = _interopRequireWildcard(require("react"));
var _core = require("@blueprintjs/core");
var _table = require("@blueprintjs/table");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function withTooltip(WrappedComponent) {
  function newFunction(props) {
    if (props.tooltip) {
      let delay = props.tooltipDelay ? props.tooltipDelay : 1000;
      return /*#__PURE__*/_react.default.createElement(_core.Tooltip, {
        content: props.tooltip,
        hoverOpenDelay: delay
      }, /*#__PURE__*/_react.default.createElement(WrappedComponent, props));
    } else {
      return /*#__PURE__*/_react.default.createElement(WrappedComponent, props);
    }
  }
  return /*#__PURE__*/(0, _react.memo)(newFunction);
}
function GlyphButton(props) {
  props = {
    style: null,
    className: "",
    extra_glyph_text: null,
    minimal: true,
    intent: "none",
    small: true,
    ...props
  };
  const _handleClick = (0, _react.useCallback)(e => {
    props.handleClick(e);
    e.stopPropagation();
  }, [props.handleClick]);
  const pDef = (0, _react.useCallback)(e => {
    e.preventDefault();
  }, []);
  let style = (0, _react.useMemo)(() => {
    return props.style == null ? {
      paddingLeft: 2,
      paddingRight: 2
    } : props.style;
  }, [props.style]);
  return /*#__PURE__*/_react.default.createElement(_core.Button, {
    type: "button",
    minimal: props.minimal,
    small: props.small,
    style: style,
    className: props.className,
    onMouseDown: pDef,
    onClick: _handleClick,
    intent: props.intent,
    icon: props.icon
  }, props.extra_glyph_text && /*#__PURE__*/_react.default.createElement("span", {
    className: "extra-glyph-text"
  }, props.extra_glyph_text));
}
exports.GlyphButton = GlyphButton = /*#__PURE__*/(0, _react.memo)(GlyphButton);
function LabeledTextArea(props) {
  return /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
    label: props.label,
    style: {
      marginRight: 5
    },
    helperText: props.helperText
  }, /*#__PURE__*/_react.default.createElement(_core.TextArea, {
    onChange: props.onChange,
    style: {
      resize: "none"
    },
    growVertically: true,
    value: props.the_value
  }));
}
exports.LabeledTextArea = LabeledTextArea = /*#__PURE__*/(0, _react.memo)(LabeledTextArea);
function LabeledFormField(props) {
  props = {
    show: true,
    helperText: null,
    isBool: false,
    ...props
  };
  let fvalue = props.the_value == null ? "" : props.the_value;
  return /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
    label: props.label,
    style: {
      marginRight: 5
    },
    helperText: props.helperText
  }, props.isBool ? /*#__PURE__*/_react.default.createElement(_core.Switch, {
    onChange: props.onChange,
    checked: props.the_value,
    innerLabel: "False",
    innerLabelChecked: "True"
  }) : /*#__PURE__*/_react.default.createElement(_core.InputGroup, {
    onChange: props.onChange,
    value: fvalue
  }));
}
exports.LabeledFormField = LabeledFormField = /*#__PURE__*/(0, _react.memo)(LabeledFormField);
function LabeledSelectList(props) {
  return /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
    label: props.label,
    style: {
      marginRight: 5
    }
  }, /*#__PURE__*/_react.default.createElement(_core.HTMLSelect, {
    options: props.option_list,
    onChange: props.onChange,
    value: props.the_value
  }));
}
exports.LabeledSelectList = LabeledSelectList = /*#__PURE__*/(0, _react.memo)(LabeledSelectList);
function SelectList(props) {
  props = {
    height: null,
    maxWidth: null,
    fontSize: null,
    minimal: false,
    ...props
  };
  function handleChange(event) {
    props.onChange(event.target.value);
  }
  let sstyle = {
    "marginBottom": 5,
    "width": "auto"
  };
  if (props.height != null) {
    sstyle["height"] = props.height;
  }
  if (props.maxWidth != null) {
    sstyle["maxWidth"] = props.maxWidth;
  }
  if (props.fontSize != null) {
    sstyle["fontSize"] = props.fontSize;
  }
  let option_items = props.option_list.map((opt, index) => /*#__PURE__*/_react.default.createElement("option", {
    key: index
  }, opt));
  return /*#__PURE__*/_react.default.createElement(_core.HTMLSelect, {
    style: sstyle,
    onChange: handleChange,
    minimal: props.minimal,
    value: props.value
  }, option_items);
}
exports.SelectList = SelectList = /*#__PURE__*/(0, _react.memo)(SelectList);
function BpOrderableTable(props, passedRef) {
  props = {
    content_editable: true,
    selectionModes: [_table.RegionCardinality.FULL_COLUMNS, _table.RegionCardinality.FULL_ROWS],
    handleDeSelect: null,
    ...props
  };
  function _onRowsReordered(oldIndex, newIndex) {
    let new_data_list = [...props.data_array];
    let the_item = new_data_list[oldIndex];
    new_data_list.splice(oldIndex, 1);
    new_data_list.splice(newIndex, 0, the_item);
    props.handleChange(new_data_list);
  }
  function _onConfirmCellEdit(value, rowIndex, columnIndex) {
    let new_data_list = [...props.data_array];
    new_data_list[rowIndex][props.columns[columnIndex]] = value;
    props.handleChange(new_data_list);
  }
  function _onSelection(regions) {
    if (regions.length == 0) {
      if (props.handleDeSelect) {
        props.handleDeSelect();
      }
      return;
    }
    if (regions[0].hasOwnProperty("rows")) {
      props.handleActiveRowChange(regions[0]["rows"][0]);
    }
  }
  function _cellRendererCreator(column_name) {
    return rowIndex => {
      let the_text;
      let className;
      if ("className" in props.data_array[rowIndex]) {
        className = props.data_array[rowIndex].className;
      } else {
        className = null;
      }
      if (rowIndex < props.data_array.length && Object.keys(props.data_array[rowIndex]).includes(column_name)) {
        the_text = props.data_array[rowIndex][column_name];
        the_text = the_text == null ? "" : the_text;
      } else {
        the_text = "";
      }
      if (props.content_editable) {
        return /*#__PURE__*/_react.default.createElement(_table.EditableCell2, {
          key: column_name,
          className: className,
          truncated: true,
          rowIndex: rowIndex,
          columnIndex: props.columns.indexOf(column_name),
          wrapText: true,
          onConfirm: _onConfirmCellEdit,
          value: the_text
        });
      } else {
        return /*#__PURE__*/_react.default.createElement(_table.Cell, {
          key: column_name,
          className: className,
          truncated: true,
          rowIndex: rowIndex,
          columnIndex: props.columns.indexOf(column_name),
          wrapText: true
        }, the_text);
      }
    };
  }
  function _rowHeaderCellRenderer(rowIndex) {
    return /*#__PURE__*/_react.default.createElement(_table.RowHeaderCell, {
      key: rowIndex,
      name: rowIndex
    });
  }
  let columns = props.columns.map(column_name => {
    const cellRenderer = _cellRendererCreator(column_name);
    return /*#__PURE__*/_react.default.createElement(_table.Column, {
      cellRenderer: cellRenderer,
      enableColumnReordering: false,
      key: column_name,
      name: column_name
    });
  });
  return /*#__PURE__*/_react.default.createElement(_table.Table2, {
    enableFocusedCell: false,
    cellRendererDependencies: [props.data_array],
    numRows: props.data_array.length,
    enableColumnReordering: false,
    selectionModes: props.selectionModes,
    enableRowReordering: true,
    onRowsReordered: _onRowsReordered,
    onSelection: _onSelection,
    enableMultipleSelection: false
  }, columns);
}
exports.BpOrderableTable = BpOrderableTable = /*#__PURE__*/(0, _react.memo)(BpOrderableTable);
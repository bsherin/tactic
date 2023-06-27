"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
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
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
var _table = require("@blueprintjs/table");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function withTooltip(WrappedComponent) {
  function newFunction(props) {
    if (props.tooltip) {
      var delay = props.tooltipDelay ? props.tooltipDelay : 1000;
      return /*#__PURE__*/_react["default"].createElement(_core.Tooltip, {
        content: props.tooltip,
        hoverOpenDelay: delay
      }, /*#__PURE__*/_react["default"].createElement(WrappedComponent, props));
    } else {
      return /*#__PURE__*/_react["default"].createElement(WrappedComponent, props);
    }
  }
  return /*#__PURE__*/(0, _react.memo)(newFunction);
}
function GlyphButton(props) {
  function _handleClick(e) {
    props.handleClick(e);
    e.stopPropagation();
  }
  var style = props.style == null ? {
    paddingLeft: 2,
    paddingRight: 2
  } : props.style;
  return /*#__PURE__*/_react["default"].createElement(_core.Button, {
    type: "button",
    minimal: props.minimal,
    small: props.small,
    style: style,
    className: props.className,
    onMouseDown: function onMouseDown(e) {
      e.preventDefault();
    },
    onClick: _handleClick,
    intent: props.intent,
    icon: props.icon
  }, props.extra_glyph_text && /*#__PURE__*/_react["default"].createElement("span", {
    className: "extra-glyph-text"
  }, props.extra_glyph_text));
}
exports.GlyphButton = GlyphButton = /*#__PURE__*/(0, _react.memo)(GlyphButton);
GlyphButton.propTypes = {
  icon: _propTypes["default"].string,
  minimal: _propTypes["default"].bool,
  small: _propTypes["default"].bool,
  className: _propTypes["default"].string,
  extra_glyph_text: _propTypes["default"].string,
  style: _propTypes["default"].object,
  handleClick: _propTypes["default"].func,
  intent: _propTypes["default"].string
};
GlyphButton.defaultProps = {
  style: null,
  className: "",
  extra_glyph_text: null,
  minimal: true,
  intent: "none",
  small: true
};
exports.GlyphButton = GlyphButton = withTooltip(GlyphButton);
function LabeledTextArea(props) {
  return /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: props.label,
    style: {
      marginRight: 5
    },
    helperText: props.helperText
  }, /*#__PURE__*/_react["default"].createElement(_core.TextArea, {
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
  var fvalue = props.the_value == null ? "" : props.the_value;
  return /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: props.label,
    style: {
      marginRight: 5
    },
    helperText: props.helperText
  }, props.isBool ? /*#__PURE__*/_react["default"].createElement(_core.Switch, {
    onChange: props.onChange,
    checked: props.the_value,
    innerLabel: "False",
    innerLabelChecked: "True"
  }) : /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
    onChange: props.onChange,
    value: fvalue
  }));
}
exports.LabeledFormField = LabeledFormField = /*#__PURE__*/(0, _react.memo)(LabeledFormField);
LabeledFormField.propTypes = {
  show: _propTypes["default"].bool,
  isBool: _propTypes["default"].bool,
  label: _propTypes["default"].string,
  onChange: _propTypes["default"].func,
  the_value: _propTypes["default"].oneOfType([_propTypes["default"].bool, _propTypes["default"].number, _propTypes["default"].string]),
  helperText: _propTypes["default"].string
};
LabeledFormField.defaultProps = {
  show: true,
  helperText: null,
  isBool: false
};
function LabeledSelectList(props) {
  return /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: props.label,
    style: {
      marginRight: 5
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.HTMLSelect, {
    options: props.option_list,
    onChange: props.onChange,
    value: props.the_value
  }));
}
exports.LabeledSelectList = LabeledSelectList = /*#__PURE__*/(0, _react.memo)(LabeledSelectList);
function SelectList(props) {
  function handleChange(event) {
    props.onChange(event.target.value);
  }
  var sstyle = {
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
  var option_items = props.option_list.map(function (opt, index) {
    return /*#__PURE__*/_react["default"].createElement("option", {
      key: index
    }, opt);
  });
  return /*#__PURE__*/_react["default"].createElement(_core.HTMLSelect, {
    style: sstyle,
    onChange: handleChange,
    minimal: props.minimal,
    value: props.value
  }, option_items);
}
exports.SelectList = SelectList = /*#__PURE__*/(0, _react.memo)(SelectList);
SelectList.propTypes = {
  option_list: _propTypes["default"].array,
  onChange: _propTypes["default"].func,
  minimal: _propTypes["default"].bool,
  value: _propTypes["default"].string,
  height: _propTypes["default"].number,
  maxWidth: _propTypes["default"].number,
  fontSize: _propTypes["default"].number
};
SelectList.defaultProps = {
  height: null,
  maxWidth: null,
  fontSize: null,
  minimal: false
};
function BpOrderableTable(props, passedRef) {
  function _onRowsReordered(oldIndex, newIndex) {
    var new_data_list = _toConsumableArray(props.data_array);
    var the_item = new_data_list[oldIndex];
    new_data_list.splice(oldIndex, 1);
    new_data_list.splice(newIndex, 0, the_item);
    props.handleChange(new_data_list);
  }
  function _onConfirmCellEdit(value, rowIndex, columnIndex) {
    var new_data_list = _toConsumableArray(props.data_array);
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
    return function (rowIndex) {
      var the_text;
      var className;
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
        return /*#__PURE__*/_react["default"].createElement(_table.EditableCell, {
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
        return /*#__PURE__*/_react["default"].createElement(_table.Cell, {
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
    return /*#__PURE__*/_react["default"].createElement(_table.RowHeaderCell, {
      key: rowIndex,
      name: rowIndex
    });
  }
  var columns = props.columns.map(function (column_name) {
    var cellRenderer = _cellRendererCreator(column_name);
    return /*#__PURE__*/_react["default"].createElement(_table.Column, {
      cellRenderer: cellRenderer,
      enableColumnReordering: false,
      key: column_name,
      name: column_name
    });
  });
  return /*#__PURE__*/_react["default"].createElement(_core.HotkeysProvider, null, /*#__PURE__*/_react["default"].createElement(_table.Table2, {
    enableFocusedCell: false,
    cellRendererDependencies: [props.data_array],
    numRows: props.data_array.length,
    enableColumnReordering: false,
    selectionModes: props.selectionModes,
    enableRowReordering: true,
    onRowsReordered: _onRowsReordered,
    onSelection: _onSelection,
    enableMultipleSelection: false
  }, columns));
}
exports.BpOrderableTable = BpOrderableTable = /*#__PURE__*/(0, _react.memo)(BpOrderableTable);
BpOrderableTable.propTypes = {
  columns: _propTypes["default"].array,
  data_array: _propTypes["default"].array,
  handleActiveRowChange: _propTypes["default"].func,
  handleDeSelect: _propTypes["default"].func,
  handleChange: _propTypes["default"].func,
  selectionModes: _propTypes["default"].array
};
BpOrderableTable.defaultProps = {
  content_editable: true,
  selectionModes: [_table.RegionCardinality.FULL_COLUMNS, _table.RegionCardinality.FULL_ROWS],
  handleDeSelect: null
};
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compute_added_column_width = compute_added_column_width;
exports.BlueprintTable = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _table = require("@blueprintjs/table");

var _objectHash = _interopRequireDefault(require("object-hash"));

var _utilities_react = require("./utilities_react.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var MAX_INITIAL_CELL_WIDTH = 400;
var EXTRA_TABLE_AREA_SPACE = 500;

var ColoredWord = /*#__PURE__*/function (_React$Component) {
  _inherits(ColoredWord, _React$Component);

  var _super = _createSuper(ColoredWord);

  function ColoredWord() {
    _classCallCheck(this, ColoredWord);

    return _super.apply(this, arguments);
  }

  _createClass(ColoredWord, [{
    key: "render",
    value: function render() {
      var style = {
        backgroundColor: this.props.the_color
      };
      return /*#__PURE__*/_react["default"].createElement("span", {
        style: style
      }, this.props.the_word);
    }
  }]);

  return ColoredWord;
}(_react["default"].Component);

ColoredWord.propTypes = {
  the_color: _propTypes["default"].string,
  the_word: _propTypes["default"].string
};

var BlueprintTable = /*#__PURE__*/function (_React$Component2) {
  _inherits(BlueprintTable, _React$Component2);

  var _super2 = _createSuper(BlueprintTable);

  function BlueprintTable(props) {
    var _this;

    _classCallCheck(this, BlueprintTable);

    _this = _super2.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this));
    _this.mismatched_column_widths = false;
    _this.table_ref = /*#__PURE__*/_react["default"].createRef();
    _this.set_scroll = null;
    _this.data_update_required = null;
    _this.state = {
      focusedCell: null
    };
    return _this;
  }

  _createClass(BlueprintTable, [{
    key: "hash_value",
    get: function get() {
      var obj = {
        cwidths: this.props.column_widths,
        nrows: this.props.total_rows // sscroll: this.set_scroll

      };
      return (0, _objectHash["default"])(obj);
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      if (this.set_scroll || this.data_update_required) {
        return true;
      }

      return !(0, _utilities_react.propsAreEqual)(nextProps, this.props) || !(0, _utilities_react.propsAreEqual)(nextState, this.state);
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        mounted: true
      });
      this.computeColumnWidths();

      this._updateRowHeights();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (this.props.column_widths == null || this.mismatched_column_widths) {
        this.computeColumnWidths();
      }

      this._updateRowHeights();
    }
  }, {
    key: "computeColumnWidths",
    value: function computeColumnWidths() {
      var cwidths = compute_initial_column_widths(this.props.filtered_column_names, this.props.data_row_dict);
      this.mismatched_column_widths = false;
      this.props.updateTableSpec({
        column_widths: cwidths
      }, true);
    }
  }, {
    key: "haveRowData",
    value: function haveRowData(rowIndex) {
      return this.props.data_row_dict.hasOwnProperty(rowIndex);
    }
  }, {
    key: "_doScroll",
    value: function _doScroll() {
      if (this.data_update_required != null) {
        var rindex = this.data_update_required;
        this.data_update_required = null;
        this.props.initiateDataGrab(rindex);
      } else if (this.set_scroll != null && this.table_ref && this.table_ref.current) {
        try {
          var singleCellRegion = _table.Regions.cell(this.set_scroll, 0);

          this.table_ref.current.scrollToRegion(singleCellRegion);
          this.set_scroll = null;
        } catch (e) {
          console.log(e.message);
        }
      }
    }
  }, {
    key: "_scrollToRow",
    value: function _scrollToRow(row_index) {
      this.set_scroll = row_index;
    }
  }, {
    key: "_updateRowHeights",
    value: function _updateRowHeights() {
      var fcnames = this.props.filtered_column_names;
      var self = this;
      this.table_ref.current.resizeRowsByApproximateHeight(function (rowIndex, colIndex) {
        if (!self.haveRowData(rowIndex)) {
          return "empty cell";
        }

        return self.props.data_row_dict[rowIndex][fcnames[colIndex]];
      }, {
        getNumBufferLines: 1
      });
    }
  }, {
    key: "_rowHeaderCellRenderer",
    value: function _rowHeaderCellRenderer(rowIndex) {
      if (this.haveRowData(rowIndex)) {
        return /*#__PURE__*/_react["default"].createElement(_table.RowHeaderCell, {
          key: rowIndex,
          name: this.props.data_row_dict[rowIndex].__id__
        });
      } else {
        return /*#__PURE__*/_react["default"].createElement(_table.RowHeaderCell, {
          key: rowIndex,
          loading: true,
          name: rowIndex
        });
      }
    }
  }, {
    key: "_text_color_dict",
    value: function _text_color_dict(row_id, colname) {
      if (this.props.cells_to_color_text.hasOwnProperty(row_id)) {
        var text_color_dict = this.props.cells_to_color_text[row_id];

        if (text_color_dict.hasOwnProperty(colname)) {
          return text_color_dict[colname];
        }

        return null;
      }

      return null;
    }
  }, {
    key: "_cell_background_color",
    value: function _cell_background_color(row_id, colname) {
      if (this.props.cell_backgrounds.hasOwnProperty(row_id)) {
        var cell_background_dict = this.props.cell_backgrounds[row_id];

        if (cell_background_dict.hasOwnProperty(colname)) {
          return cell_background_dict[colname];
        }

        return null;
      }

      return null;
    }
  }, {
    key: "_cellRendererCreator",
    value: function _cellRendererCreator(column_name) {
      var _this2 = this;

      var self = this;
      return function (rowIndex) {
        var the_text;
        var cell_bg_color;

        try {
          if (!_this2.haveRowData(rowIndex)) {
            if (self.data_update_required == null) {
              self.data_update_required = rowIndex;
            }

            return /*#__PURE__*/_react["default"].createElement(_table.Cell, {
              key: column_name,
              loading: true
            });
          }

          var text_color_dict = self._text_color_dict(rowIndex, column_name);

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

          cell_bg_color = self._cell_background_color(rowIndex, column_name);
          the_text = self.props.data_row_dict[rowIndex][column_name];

          if (_this2.props.alt_search_text != null && _this2.props.alt_search_text != "") {
            var regex = new RegExp(_this2.props.alt_search_text, "gi");
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

          if (self.props.search_text != null && self.props.search_text != "") {
            var _regex = new RegExp(self.props.search_text, "gi");

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

          if (!self.props.spreadsheet_mode) {
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
        } // Wrapping the contents of the cell in React.Fragment prevent React from
        // generating a warning for reasons that are mysterious


        return /*#__PURE__*/_react["default"].createElement(EnhancedEditableCell, {
          key: column_name,
          truncated: true,
          rowIndex: rowIndex,
          className: "cell-class",
          interactive: false,
          columnIndex: _this2.props.filtered_column_names.indexOf(column_name),
          columnHeader: column_name,
          wrapText: true,
          setCellContent: _this2.props.setCellContent,
          bgColor: cell_bg_color,
          value: the_text
        });
      };
    }
  }, {
    key: "_onSelection",
    value: function _onSelection(regions) {
      if (regions.length == 0) return; // Without this get an error when clicking on a body cell

      this.props.setMainStateValue("selected_regions", regions);

      if (regions[0].hasOwnProperty("cols")) {
        this._setSelectedColumn(this.props.filtered_column_names[regions[0]["cols"][0]]);
      } else if (regions[0].hasOwnProperty("rows")) {
        this._setSelectedRow(regions[0]["rows"][0]);
      }
    }
  }, {
    key: "_setSelectedColumn",
    value: function _setSelectedColumn(column_name) {
      this.props.setMainStateValue({
        "selected_column": column_name,
        "selected_row": null
      });
    }
  }, {
    key: "_setSelectedRow",
    value: function _setSelectedRow(rowIndex) {
      this.props.setMainStateValue({
        "selected_row": this.props.data_row_dict[rowIndex].__id__,
        "selected_column": null
      });
    }
  }, {
    key: "broadcast_column_widths",
    value: function broadcast_column_widths(docname, cwidths) {
      this.props.broadcast_event_to_server("UpdateColumnWidths", {
        "doc_to_update": docname,
        "column_widths": cwidths
      }, null);
    }
  }, {
    key: "_onColumnWidthChanged",
    value: function _onColumnWidthChanged(index, size) {
      var cwidths = this.props.column_widths;
      cwidths[index] = size;
      this.props.updateTableSpec({
        column_widths: cwidths
      }, true);
    }
  }, {
    key: "_onColumnsReordered",
    value: function _onColumnsReordered(oldIndex, newIndex, length) {
      var col_to_move = this.props.filtered_column_names[oldIndex];

      var cnames = _toConsumableArray(this.props.filtered_column_names);

      cnames.splice(oldIndex, 1);
      var target_col = cnames[newIndex];
      this.props.moveColumn(col_to_move, target_col);
    }
  }, {
    key: "_onFocusedCell",
    value: function _onFocusedCell(focusedCell) {
      this.setState({
        focusedCell: focusedCell
      });
    }
  }, {
    key: "render",
    value: function render() {
      var self = this;
      var columns = this.props.filtered_column_names.map(function (column_name) {
        var cellRenderer = self._cellRendererCreator(column_name);

        return /*#__PURE__*/_react["default"].createElement(_table.Column, {
          cellRenderer: cellRenderer,
          enableColumnReordering: true,
          key: column_name,
          name: column_name
        });
      });
      var cwidths;

      if (this.props.column_widths == null || this.props.column_widths.length == 0) {
        cwidths = null;
      } else {
        cwidths = this.props.column_widths;
      }

      if (cwidths != null && cwidths.length != this.props.filtered_column_names.length) {
        cwidths = null;
        this.mismatched_column_widths = true;
      }

      var style = {
        display: "block",
        overflowY: "auto",
        overflowX: "hidden",
        height: this.props.height
      };
      return /*#__PURE__*/_react["default"].createElement("div", {
        id: "table-area",
        ref: this.props.my_ref,
        style: style
      }, /*#__PURE__*/_react["default"].createElement(_table.Table, {
        ref: this.table_ref,
        key: this.hash_value // kludge: Having this prevents partial row rendering
        ,
        numRows: this.props.total_rows,
        enableColumnReordering: true,
        onColumnsReordered: this._onColumnsReordered,
        onSelection: this._onSelection,
        selectedRegions: this.props.selected_regions,
        onCompleteRender: this._doScroll,
        onColumnWidthChanged: this._onColumnWidthChanged,
        onFocusedCell: this._onFocusedCell,
        focusedCell: this.state.focusedCell,
        enableMultipleSelection: false,
        enableFocusedCell: this.props.spreadsheet_mode,
        selectionModes: [_table.RegionCardinality.FULL_COLUMNS, _table.RegionCardinality.FULL_ROWS],
        minColumnWidth: 75,
        columnWidths: cwidths,
        rowHeaderCellRenderer: this._rowHeaderCellRenderer
      }, columns));
    }
  }]);

  return BlueprintTable;
}(_react["default"].Component);

exports.BlueprintTable = BlueprintTable;
BlueprintTable.propTypes = {
  my_ref: _propTypes["default"].object,
  height: _propTypes["default"].number,
  setCellContent: _propTypes["default"].func,
  column_names: _propTypes["default"].array,
  filtered_column_names: _propTypes["default"].array,
  moveColumn: _propTypes["default"].func,
  updateTableSpec: _propTypes["default"].func,
  data_row_dict: _propTypes["default"].object,
  total_rows: _propTypes["default"].number,
  initiateDataGrab: _propTypes["default"].func,
  setMainStateValue: _propTypes["default"].func,
  broadcast_event_to_server: _propTypes["default"].func,
  cells_to_color_text: _propTypes["default"].object,
  cell_backgrounds: _propTypes["default"].object,
  column_widths: _propTypes["default"].array,
  hidden_columns_list: _propTypes["default"].array,
  search_text: _propTypes["default"].string,
  spreadsheet_mode: _propTypes["default"].bool,
  alt_search_text: _propTypes["default"].string
};

var EnhancedEditableCell = /*#__PURE__*/function (_React$Component3) {
  _inherits(EnhancedEditableCell, _React$Component3);

  var _super3 = _createSuper(EnhancedEditableCell);

  function EnhancedEditableCell(props) {
    var _this3;

    _classCallCheck(this, EnhancedEditableCell);

    _this3 = _super3.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this3));
    _this3.cell_ref = /*#__PURE__*/_react["default"].createRef();
    _this3.state = {
      am_editing: false,
      saved_text: ""
    };
    return _this3;
  }

  _createClass(EnhancedEditableCell, [{
    key: "_handleKeyDown",
    value: function _handleKeyDown(event) {
      if (this.cell_ref && this.cell_ref.current) {
        this.cell_ref.current.handleEdit();
        this.setState({
          am_editing: true,
          saved_text: this.props.value
        });
      }
    }
  }, {
    key: "_onChange",
    value: function _onChange(value, rowIndex, columnIndex) {
      this.props.setCellContent(this.props.rowIndex, this.props.columnHeader, value, false);
    }
  }, {
    key: "_onCancel",
    value: function _onCancel() {
      this.props.setCellContent(this.props.rowIndex, this.props.columnHeader, this.state.saved_text, false);
      this.setState({
        am_editing: false
      });
    }
  }, {
    key: "_onConfirmCellEdit",
    value: function _onConfirmCellEdit(value, rowIndex, columnIndex) {
      var _this4 = this;

      var self = this;
      this.setState({
        am_editing: false
      }, function () {
        self.props.setCellContent(_this4.props.rowIndex, _this4.props.columnHeader, value, true);
      });
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_table.EditableCell, _extends({
        ref: this.cell_ref,
        onConfirm: this._onConfirmCellEdit,
        onChange: this._onChange,
        onCancel: this._onCancel,
        style: {
          backgroundColor: this.props.bgColor
        },
        onKeyDown: this.state.am_editing ? null : this._handleKeyDown
      }, this.props));
    }
  }]);

  return EnhancedEditableCell;
}(_react["default"].Component);

function compute_added_column_width(header_text) {
  var max_field_width = MAX_INITIAL_CELL_WIDTH;
  var header_font = $($(".bp4-table-truncated-text")[0]).css("font");
  var canvas_element = document.getElementById("measure-canvas");
  var ctx = canvas_element.getContext("2d");
  var added_header_width = 40;
  ctx.font = header_font;
  return ctx.measureText(header_text).width + added_header_width;
}

function compute_initial_column_widths(header_list, data_row_dict) {
  var ncols = header_list.length;
  var max_field_width = MAX_INITIAL_CELL_WIDTH; // Get sample header and body cells
  // set up a canvas so that we can use it to compute the width of text

  var body_font = $($(".bp4-table-truncated-text")[0]).css("font");
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
    } // Get the width for each header column

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
  } // Find the width of each body cell
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
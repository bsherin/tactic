"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LabeledSelectList = LabeledSelectList;
exports.withTooltip = withTooltip;
exports.TopRightButtons = exports.GlyphButton = exports.DragThing = exports.BpOrderableTable = exports.OrderableTable = exports.SelectList = exports.LabeledFormField = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _core = require("@blueprintjs/core");

var _table = require("@blueprintjs/table");

var _utilities_react = require("./utilities_react.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

function withTooltip(WrappedComponent) {
  return /*#__PURE__*/function (_React$Component) {
    _inherits(_class, _React$Component);

    var _super = _createSuper(_class);

    function _class() {
      _classCallCheck(this, _class);

      return _super.apply(this, arguments);
    }

    _createClass(_class, [{
      key: "render",
      value: function render() {
        if (this.props.tooltip) {
          var delay = this.props.tooltipDelay ? this.props.tooltipDelay : 1000;
          return /*#__PURE__*/_react["default"].createElement(_core.Tooltip, {
            content: this.props.tooltip,
            hoverOpenDelay: delay
          }, /*#__PURE__*/_react["default"].createElement(WrappedComponent, this.props));
        } else {
          return /*#__PURE__*/_react["default"].createElement(WrappedComponent, this.props);
        }
      }
    }]);

    return _class;
  }(_react["default"].Component);
}

var TopRightButtons = /*#__PURE__*/function (_React$Component2) {
  _inherits(TopRightButtons, _React$Component2);

  var _super2 = _createSuper(TopRightButtons);

  function TopRightButtons(props) {
    var _this;

    _classCallCheck(this, TopRightButtons);

    _this = _super2.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(TopRightButtons, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var top_icon_style = {
        display: "flex",
        justifyContent: "flex-end",
        marginTop: 0,
        paddingTop: 3,
        marginRight: 20
      };
      return /*#__PURE__*/_react["default"].createElement("div", {
        style: top_icon_style
      }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
        icon: /*#__PURE__*/_react["default"].createElement(_core.Icon, {
          icon: "repeat",
          iconSize: 18
        }),
        style: {
          paddingLeft: 4,
          paddingRight: 0
        },
        minimal: true,
        className: "context-close-button",
        small: true,
        tabIndex: -1,
        intent: "danger",
        onClick: function onClick() {
          _this2.props.refreshTab();
        }
      }), /*#__PURE__*/_react["default"].createElement(_core.Button, {
        icon: /*#__PURE__*/_react["default"].createElement(_core.Icon, {
          icon: "delete",
          iconSize: 18
        }),
        style: {
          paddingLeft: 15
        },
        minimal: true,
        className: "context-close-button",
        small: true,
        tabIndex: -1,
        intent: "danger",
        onClick: function onClick() {
          _this2.props.closeTab();
        }
      }));
    }
  }]);

  return TopRightButtons;
}(_react["default"].Component);

exports.TopRightButtons = TopRightButtons;
TopRightButtons.propTypes = {
  refreshTab: _propTypes["default"].func,
  closeTab: _propTypes["default"].func
};

var GlyphButton = /*#__PURE__*/function (_React$Component3) {
  _inherits(GlyphButton, _React$Component3);

  var _super3 = _createSuper(GlyphButton);

  function GlyphButton(props) {
    var _this3;

    _classCallCheck(this, GlyphButton);

    _this3 = _super3.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this3));
    _this3.update_props = ["icon", "minimal", "extra_glyph_text", "style"];
    return _this3;
  }

  _createClass(GlyphButton, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      var _iterator = _createForOfIteratorHelper(this.update_props),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var prop = _step.value;

          if (nextProps[prop] != this.props[prop]) {
            return true;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return false;
    }
  }, {
    key: "_handleClick",
    value: function _handleClick(e) {
      this.props.handleClick(e);
      e.stopPropagation();
    }
  }, {
    key: "render",
    value: function render() {
      var style = this.props.style == null ? {
        paddingLeft: 2,
        paddingRight: 2
      } : this.props.style;
      return /*#__PURE__*/_react["default"].createElement(_core.Button, {
        type: "button",
        minimal: this.props.minimal,
        small: this.props.small,
        style: style,
        className: this.props.className,
        onMouseDown: function onMouseDown(e) {
          e.preventDefault();
        },
        onClick: this._handleClick,
        intent: this.props.intent,
        icon: this.props.icon
      }, this.props.extra_glyph_text && /*#__PURE__*/_react["default"].createElement("span", {
        className: "extra-glyph-text"
      }, this.props.extra_glyph_text));
    }
  }]);

  return GlyphButton;
}(_react["default"].Component);

exports.GlyphButton = GlyphButton;
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

var DragThing = /*#__PURE__*/function (_React$Component4) {
  _inherits(DragThing, _React$Component4);

  var _super4 = _createSuper(DragThing);

  function DragThing(props) {
    var _this4;

    _classCallCheck(this, DragThing);

    _this4 = _super4.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this4));
    _this4.state = {
      xpos: 0,
      ypos: 0,
      initial_x: null,
      initial_y: null,
      active: false
    };
    return _this4;
  }

  _createClass(DragThing, [{
    key: "_dragStart",
    value: function _dragStart(e) {
      this.setState({
        initial_x: e.clientX,
        initial_y: e.clientY,
        active: true
      });
    }
  }, {
    key: "_drag",
    value: function _drag(e) {
      if (this.state.active) {
        var currentX = e.clientX - this.state.initial_x;
        var currentY = e.clientY - this.state.initial_y; // this.props.handleDrag(xpos, ypos);

        this.setState({
          xpos: currentX,
          ypos: currentY
        });
      }
    }
  }, {
    key: "_dragEnd",
    value: function _dragEnd(e) {
      this.setState({
        active: false,
        xpos: 0,
        ypos: 0
      });
    }
  }, {
    key: "render",
    value: function render() {
      var style = {
        fontSize: 25
      };

      if (this.state.active) {
        style.transform = "translate3d(" + this.state.xpos + "px, " + this.state.ypos + "px, 0)";
      }

      return /*#__PURE__*/_react["default"].createElement("span", {
        style: style,
        onMouseDown: this._dragStart,
        onMouseMove: this._drag,
        onMouseUp: this._dragEnd,
        className: "fal fa-caret-right"
      });
    }
  }]);

  return DragThing;
}(_react["default"].Component);

exports.DragThing = DragThing;
DragThing.propTypes = {
  handleDrag: _propTypes["default"].func
};

var LabeledFormField = /*#__PURE__*/function (_React$Component5) {
  _inherits(LabeledFormField, _React$Component5);

  var _super5 = _createSuper(LabeledFormField);

  function LabeledFormField() {
    _classCallCheck(this, LabeledFormField);

    return _super5.apply(this, arguments);
  }

  _createClass(LabeledFormField, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
        label: this.props.label,
        style: {
          marginRight: 5
        }
      }, /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
        onChange: this.props.onChange,
        value: this.props.the_value
      }));
    }
  }]);

  return LabeledFormField;
}(_react["default"].Component);

exports.LabeledFormField = LabeledFormField;
LabeledFormField.propTypes = {
  show: _propTypes["default"].bool,
  label: _propTypes["default"].string,
  onChange: _propTypes["default"].func,
  the_value: _propTypes["default"].string
};
LabeledFormField.defaultProps = {
  show: true
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

var SelectList = /*#__PURE__*/function (_React$Component6) {
  _inherits(SelectList, _React$Component6);

  var _super6 = _createSuper(SelectList);

  function SelectList(props) {
    var _this5;

    _classCallCheck(this, SelectList);

    _this5 = _super6.call(this, props);
    _this5.handleChange = _this5.handleChange.bind(_assertThisInitialized(_this5));
    return _this5;
  }

  _createClass(SelectList, [{
    key: "handleChange",
    value: function handleChange(event) {
      this.props.onChange(event.target.value);
    }
  }, {
    key: "render",
    value: function render() {
      var sstyle = {
        "marginBottom": 5,
        "width": "auto"
      };

      if (this.props.height != null) {
        sstyle["height"] = this.props.height;
      }

      if (this.props.maxWidth != null) {
        sstyle["maxWidth"] = this.props.maxWidth;
      }

      if (this.props.fontSize != null) {
        sstyle["fontSize"] = this.props.fontSize;
      }

      var option_items = this.props.option_list.map(function (opt, index) {
        return /*#__PURE__*/_react["default"].createElement("option", {
          key: index
        }, opt);
      });
      return /*#__PURE__*/_react["default"].createElement(_core.HTMLSelect, {
        style: sstyle,
        onChange: this.handleChange,
        minimal: this.props.minimal,
        value: this.props.value
      }, option_items);
    }
  }]);

  return SelectList;
}(_react["default"].Component);

exports.SelectList = SelectList;
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

var TableCell = /*#__PURE__*/function (_React$Component7) {
  _inherits(TableCell, _React$Component7);

  var _super7 = _createSuper(TableCell);

  function TableCell(props) {
    var _this6;

    _classCallCheck(this, TableCell);

    _this6 = _super7.call(this, props);
    _this6.handleChange = _this6.handleChange.bind(_assertThisInitialized(_this6));
    _this6.td_ref = /*#__PURE__*/_react["default"].createRef();
    return _this6;
  }

  _createClass(TableCell, [{
    key: "handleChange",
    value: function handleChange(event) {
      var myval = this.td_ref.current.innerHTML.trim();
      this.props.handleCellChange(this.props.theRow, this.props.theCol, myval);
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement("td", {
        contentEditable: this.props.content_editable,
        onBlur: this.handleChange,
        ref: this.td_ref,
        suppressContentEditableWarning: true
      }, this.props.children);
    }
  }]);

  return TableCell;
}(_react["default"].Component);

TableCell.propTypes = {
  content_editable: _propTypes["default"].bool,
  handleCellChange: _propTypes["default"].func,
  theRow: _propTypes["default"].number,
  theColumn: _propTypes["default"].string
};

var TableRow = /*#__PURE__*/function (_React$Component8) {
  _inherits(TableRow, _React$Component8);

  var _super8 = _createSuper(TableRow);

  function TableRow(props) {
    var _this7;

    _classCallCheck(this, TableRow);

    _this7 = _super8.call(this, props);
    _this7.handleClick = _this7.handleClick.bind(_assertThisInitialized(_this7));
    return _this7;
  }

  _createClass(TableRow, [{
    key: "handleClick",
    value: function handleClick() {
      this.props.handleRowClick(this.props.row_index);
    }
  }, {
    key: "render",
    value: function render() {
      var _this8 = this;

      var cells = this.props.columns.map(function (col, index) {
        return /*#__PURE__*/_react["default"].createElement(TableCell, {
          key: index,
          content_editable: _this8.props.content_editable,
          theRow: _this8.props.row_index,
          theCol: col,
          handleCellChange: _this8.props.handleCellChange
        }, _this8.props.data_dict[col]);
      });
      cells.push( /*#__PURE__*/_react["default"].createElement("td", {
        key: "999"
      }, /*#__PURE__*/_react["default"].createElement("span", {
        className: "ui-icon ui-icon-arrowthick-2-n-s"
      })));
      var cname = this.props.active ? 'selector-button active' : 'selector-button';
      return /*#__PURE__*/_react["default"].createElement("tr", {
        className: cname,
        id: this.props.row_index,
        onClick: this.handleClick
      }, cells);
    }
  }]);

  return TableRow;
}(_react["default"].Component);

TableRow.propTypes = {
  columns: _propTypes["default"].array,
  row_index: _propTypes["default"].number,
  data_dict: _propTypes["default"].object,
  active: _propTypes["default"].bool,
  handleRowClick: _propTypes["default"].func,
  content_editable: _propTypes["default"].bool,
  handleCellChange: _propTypes["default"].func
};
TableRow.defaultProps = {
  content_editable: false
};

var TableHeader = /*#__PURE__*/function (_React$Component9) {
  _inherits(TableHeader, _React$Component9);

  var _super9 = _createSuper(TableHeader);

  function TableHeader() {
    _classCallCheck(this, TableHeader);

    return _super9.apply(this, arguments);
  }

  _createClass(TableHeader, [{
    key: "render",
    value: function render() {
      var cells = this.props.columns.map(function (col, index) {
        return /*#__PURE__*/_react["default"].createElement("th", {
          key: index
        }, col);
      });
      cells.push( /*#__PURE__*/_react["default"].createElement("th", {
        key: "999"
      }, " "));
      return /*#__PURE__*/_react["default"].createElement("thead", null, /*#__PURE__*/_react["default"].createElement("tr", {
        className: "selector-button",
        key: "header"
      }, cells));
    }
  }]);

  return TableHeader;
}(_react["default"].Component);

TableHeader.propTypes = {
  columns: _propTypes["default"].array
};

var BpOrderableTable = /*#__PURE__*/function (_React$Component10) {
  _inherits(BpOrderableTable, _React$Component10);

  var _super10 = _createSuper(BpOrderableTable);

  function BpOrderableTable(props) {
    var _this9;

    _classCallCheck(this, BpOrderableTable);

    _this9 = _super10.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this9));
    return _this9;
  }

  _createClass(BpOrderableTable, [{
    key: "_onRowsReordered",
    value: function _onRowsReordered(oldIndex, newIndex) {
      var new_data_list = _toConsumableArray(this.props.data_array);

      var the_item = new_data_list[oldIndex];
      new_data_list.splice(oldIndex, 1);
      new_data_list.splice(newIndex, 0, the_item);
      this.props.handleChange(new_data_list);
    }
  }, {
    key: "_onConfirmCellEdit",
    value: function _onConfirmCellEdit(value, rowIndex, columnIndex) {
      var new_data_list = _toConsumableArray(this.props.data_array);

      new_data_list[rowIndex][this.props.columns[columnIndex]] = value;
      this.props.handleChange(new_data_list);
    }
  }, {
    key: "_onSelection",
    value: function _onSelection(regions) {
      if (regions.length == 0) return; // Without this get an error when clicking on a body cell

      if (regions[0].hasOwnProperty("rows")) {
        this.props.handleActiveRowChange(regions[0]["rows"][0]);
      }
    }
  }, {
    key: "_cellRendererCreator",
    value: function _cellRendererCreator(column_name) {
      var _this10 = this;

      var self = this;
      return function (rowIndex) {
        var the_text;

        if (rowIndex < self.props.data_array.length && Object.keys(self.props.data_array[rowIndex]).includes(column_name)) {
          the_text = self.props.data_array[rowIndex][column_name];
        } else {
          the_text = "";
        }

        return /*#__PURE__*/_react["default"].createElement(_table.EditableCell, {
          key: column_name,
          truncated: true,
          rowIndex: rowIndex,
          columnIndex: _this10.props.columns.indexOf(column_name),
          wrapText: true,
          onConfirm: self._onConfirmCellEdit,
          value: the_text
        });
      };
    }
  }, {
    key: "_rowHeaderCellRenderer",
    value: function _rowHeaderCellRenderer(rowIndex) {
      return /*#__PURE__*/_react["default"].createElement(_table.RowHeaderCell, {
        key: rowIndex,
        name: rowIndex
      });
    }
  }, {
    key: "render",
    value: function render() {
      var self = this;
      var columns = this.props.columns.map(function (column_name) {
        var cellRenderer = self._cellRendererCreator(column_name);

        return /*#__PURE__*/_react["default"].createElement(_table.Column, {
          cellRenderer: cellRenderer,
          enableColumnReordering: false,
          key: column_name,
          name: column_name
        });
      });
      return /*#__PURE__*/_react["default"].createElement(_table.Table, {
        enableFocusedCell: true,
        numRows: this.props.data_array.length,
        enableColumnReordering: false,
        selectionModes: [_table.RegionCardinality.FULL_COLUMNS, _table.RegionCardinality.FULL_ROWS],
        enableRowReordering: true,
        onRowsReordered: this._onRowsReordered,
        onSelection: this._onSelection,
        enableMultipleSelection: false
      }, columns);
    }
  }]);

  return BpOrderableTable;
}(_react["default"].Component);

exports.BpOrderableTable = BpOrderableTable;
BpOrderableTable.propTypes = {
  columns: _propTypes["default"].array,
  data_array: _propTypes["default"].array,
  handleActiveRowChange: _propTypes["default"].func,
  handleChange: _propTypes["default"].func
};
BpOrderableTable.defaultProps = {
  content_editable: false
};

var OrderableTable = /*#__PURE__*/function (_React$Component11) {
  _inherits(OrderableTable, _React$Component11);

  var _super11 = _createSuper(OrderableTable);

  function OrderableTable(props) {
    var _this11;

    _classCallCheck(this, OrderableTable);

    _this11 = _super11.call(this, props);
    _this11.tbody_ref = /*#__PURE__*/_react["default"].createRef();
    _this11.update_option_order = _this11.update_option_order.bind(_assertThisInitialized(_this11));
    _this11.handleCellChange = _this11.handleCellChange.bind(_assertThisInitialized(_this11));
    return _this11;
  }

  _createClass(OrderableTable, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var self = this;
      $(this.tbody_ref.current).sortable({
        handle: ".ui-icon",
        update: self.update_option_order
      });
    }
  }, {
    key: "handleCellChange",
    value: function handleCellChange(r, c, new_val) {
      var new_data_list = this.props.data_array;
      new_data_list[r][c] = new_val;
      this.props.handleChange(new_data_list);
    }
  }, {
    key: "update_option_order",
    value: function update_option_order(event, ui) {
      var _this12 = this;

      var new_order = $(this.tbody_ref.current).sortable("toArray");
      var new_active_row = new_order.indexOf(String(this.props.active_row));
      var new_data_list = new_order.map(function (id, idx) {
        return _this12.props.data_array[parseInt(id)];
      });
      this.props.handleChange(new_data_list);
      this.props.handleActiveRowChange(new_active_row);
    }
  }, {
    key: "render",
    value: function render() {
      var _this13 = this;

      var trows = this.props.data_array.map(function (ddict, index) {
        return /*#__PURE__*/_react["default"].createElement(TableRow, {
          columns: _this13.props.columns,
          data_dict: ddict,
          key: ddict[_this13.props.columns[0]],
          row_index: index,
          active: index == _this13.props.active_row,
          handleRowClick: _this13.props.handleActiveRowChange,
          content_editable: _this13.props.content_editable,
          handleCellChange: _this13.handleCellChange
        });
      });
      return /*#__PURE__*/_react["default"].createElement(_core.HTMLTable, {
        style: {
          fontSize: 12
        },
        bordered: true,
        condensed: true,
        interactive: true,
        striped: false
      }, /*#__PURE__*/_react["default"].createElement(TableHeader, {
        columns: this.props.columns
      }), /*#__PURE__*/_react["default"].createElement("tbody", {
        ref: this.tbody_ref
      }, trows));
    }
  }]);

  return OrderableTable;
}(_react["default"].Component);

exports.OrderableTable = OrderableTable;
OrderableTable.propTypes = {
  columns: _propTypes["default"].array,
  data_array: _propTypes["default"].array,
  active_row: _propTypes["default"].number,
  handleActiveRowChange: _propTypes["default"].func,
  handleChange: _propTypes["default"].func,
  content_editable: _propTypes["default"].bool
};
OrderableTable.defaultProps = {
  content_editable: false
};
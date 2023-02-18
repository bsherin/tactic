"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LibraryOmnibar = exports.BpSelectorTable = exports.SearchForm = void 0;

require("../tactic_css/tactic_select.scss");

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _objectHash = _interopRequireDefault(require("object-hash"));

var _core = require("@blueprintjs/core");

var _table = require("@blueprintjs/table");

var _select = require("@blueprintjs/select");

var _lodash = _interopRequireDefault(require("lodash"));

var _utilities_react = require("./utilities_react.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

var OmnibarItem = /*#__PURE__*/function (_React$Component) {
  _inherits(OmnibarItem, _React$Component);

  var _super = _createSuper(OmnibarItem);

  function OmnibarItem(props) {
    var _this;

    _classCallCheck(this, OmnibarItem);

    _this = _super.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(OmnibarItem, [{
    key: "_handleClick",
    value: function _handleClick() {
      this.props.handleClick(this.props.item);
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        active: this.props.modifiers.active,
        text: this.props.item,
        key: this.props.item,
        onClick: this._handleClick,
        shouldDismissPopover: true
      });
    }
  }]);

  return OmnibarItem;
}(_react["default"].Component);

OmnibarItem.propTypes = {
  item: _propTypes["default"].string,
  modifiers: _propTypes["default"].object,
  handleClick: _propTypes["default"].func
};

var LibraryOmnibar = /*#__PURE__*/function (_React$Component2) {
  _inherits(LibraryOmnibar, _React$Component2);

  var _super2 = _createSuper(LibraryOmnibar);

  function LibraryOmnibar(props) {
    var _this2;

    _classCallCheck(this, LibraryOmnibar);

    _this2 = _super2.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this2));
    _this2.state = {
      items: []
    };
    return _this2;
  }

  _createClass(LibraryOmnibar, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (this.props.showOmnibar && !prevProps.showOmnibar) {
        var self = this;
        $.getJSON($SCRIPT_ROOT + "get_resource_names/".concat(this.props.res_type), function (data) {
          self.setState({
            items: data["resource_names"]
          });
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_select.Omnibar, {
        items: this.state.items,
        className: window.dark_theme ? "bp4-dark" : "",
        isOpen: this.props.showOmnibar,
        onItemSelect: this.props.onItemSelect,
        itemRenderer: LibraryOmnibar._itemRenderer,
        itemPredicate: LibraryOmnibar._itemPredicate,
        resetOnSelect: true,
        onClose: this.props.handleClose
      });
    }
  }], [{
    key: "_itemRenderer",
    value: function _itemRenderer(item, _ref) {
      var modifiers = _ref.modifiers,
          handleClick = _ref.handleClick;
      return /*#__PURE__*/_react["default"].createElement(OmnibarItem, {
        modifiers: modifiers,
        item: item,
        handleClick: handleClick
      });
    }
  }, {
    key: "_itemPredicate",
    value: function _itemPredicate(query, item) {
      if (query.length == 0) {
        return false;
      }

      var lquery = query.toLowerCase();
      var re = new RegExp(query);
      return re.test(item.toLowerCase());
    }
  }]);

  return LibraryOmnibar;
}(_react["default"].Component);

exports.LibraryOmnibar = LibraryOmnibar;
LibraryOmnibar.propTypes = {
  res_type: _propTypes["default"].string,
  onItemSelect: _propTypes["default"].func,
  showOmnibar: _propTypes["default"].bool,
  handleClose: _propTypes["default"].func,
  dark_theme: _propTypes["default"].bool
};
LibraryOmnibar.defaultProps = {
  dark_theme: false
};

var SearchForm = /*#__PURE__*/function (_React$Component3) {
  _inherits(SearchForm, _React$Component3);

  var _super3 = _createSuper(SearchForm);

  function SearchForm(props) {
    var _this3;

    _classCallCheck(this, SearchForm);

    _this3 = _super3.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this3));
    _this3.current_timer = null;
    _this3.state = {
      temp_text: null
    };
    _this3.temp_text = null;
    return _this3;
  }

  _createClass(SearchForm, [{
    key: "_handleSearchFieldChange",
    value: function _handleSearchFieldChange(event) {
      if (this.current_timer) {
        clearTimeout(this.current_timer);
        this.current_timer = null;
      }

      var self = this;
      var newval = event.target.value;
      this.current_timer = setTimeout(function () {
        self.current_timer = null;
        self.props.update_search_state({
          "search_string": newval
        });
      }, self.props.update_delay);
      this.setState({
        temp_text: newval
      });
    }
  }, {
    key: "_handleClearSearch",
    value: function _handleClearSearch() {
      this.props.update_search_state({
        "search_string": ""
      });
    }
  }, {
    key: "_handleSearchMetadataChange",
    value: function _handleSearchMetadataChange(event) {
      this.props.update_search_state({
        "search_metadata": event.target.checked
      });
    }
  }, {
    key: "_handleSearchInsideChange",
    value: function _handleSearchInsideChange(event) {
      this.props.update_search_state({
        "search_inside": event.target.checked
      });
    }
  }, {
    key: "_handleShowHiddenChange",
    value: function _handleShowHiddenChange(event) {
      this.props.update_search_state({
        "show_hidden": event.target.checked
      });
    }
  }, {
    key: "_handleRegexChange",
    value: function _handleRegexChange(event) {
      this.props.update_search_state({
        "regex": event.target.checked
      });
    }
  }, {
    key: "render",
    value: function render() {
      var match_text;

      if (this.props.number_matches != null && this.props.search_string && this.props.search_string != "") {
        switch (this.props.number_matches) {
          case 0:
            match_text = "no matches";
            break;

          case 1:
            match_text = "1 match";
            break;

          default:
            match_text = "".concat(this.props.number_matches, " matches");
            break;
        }
      } else {
        match_text = null;
      }

      var current_text = this.current_timer ? this.state.temp_text : this.props.search_string;
      return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
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
        placeholder: "Search",
        leftIcon: "search",
        value: current_text,
        onChange: this._handleSearchFieldChange,
        style: {
          "width": this.props.field_width
        },
        autoCapitalize: "none",
        autoCorrect: "off",
        small: true,
        inputRef: this.props.search_ref
      }), this.props.allow_regex && /*#__PURE__*/_react["default"].createElement(_core.Switch, {
        label: "regexp",
        className: "ml-3 mb-0 mt-1",
        large: false,
        checked: this.props.regex,
        onChange: this._handleRegexChange
      }), this.props.allow_search_metadata && /*#__PURE__*/_react["default"].createElement(_core.Switch, {
        label: "metadata",
        className: "ml-3 mb-0 mt-1",
        large: false,
        checked: this.props.search_metadata,
        onChange: this._handleSearchMetadataChange
      }), this.props.allow_search_inside && /*#__PURE__*/_react["default"].createElement(_core.Switch, {
        label: "inside",
        className: "ml-3 mb-0 mt-1",
        large: false,
        checked: this.props.search_inside,
        onChange: this._handleSearchInsideChange
      }), this.props.allow_show_hidden && /*#__PURE__*/_react["default"].createElement(_core.Switch, {
        label: "show hidden",
        className: "ml-3 mb-0 mt-1",
        large: false,
        checked: this.props.show_hidden,
        onChange: this._handleShowHiddenChange
      }), this.props.include_search_jumper && /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, {
        style: {
          marginLeft: 5,
          padding: 2
        }
      }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
        onClick: this.props.searchNext,
        icon: "caret-down",
        text: undefined,
        small: true
      }), /*#__PURE__*/_react["default"].createElement(_core.Button, {
        onClick: this.props.searchPrev,
        icon: "caret-up",
        text: undefined,
        small: true
      })))));
    }
  }], [{
    key: "_handleSubmit",
    value: function _handleSubmit(event) {
      event.preventDefault();
    }
  }]);

  return SearchForm;
}(_react["default"].Component);

exports.SearchForm = SearchForm;
SearchForm.propTypes = {
  allow_search_inside: _propTypes["default"].bool,
  allow_search_metadata: _propTypes["default"].bool,
  allow_show_hidden: _propTypes["default"].bool,
  allow_regex: _propTypes["default"].bool,
  regex: _propTypes["default"].bool,
  update_search_state: _propTypes["default"].func,
  search_string: _propTypes["default"].string,
  search_inside: _propTypes["default"].bool,
  search_metadata: _propTypes["default"].bool,
  show_hidden: _propTypes["default"].bool,
  field_with: _propTypes["default"].number,
  include_search_jumper: _propTypes["default"].bool,
  searchNext: _propTypes["default"].func,
  searchPrev: _propTypes["default"].func,
  search_ref: _propTypes["default"].object,
  number_matches: _propTypes["default"].number,
  update_delay: _propTypes["default"].number
};
SearchForm.defaultProps = {
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
  update_delay: 500
};

var BpSelectorTable = /*#__PURE__*/function (_React$Component4) {
  _inherits(BpSelectorTable, _React$Component4);

  var _super4 = _createSuper(BpSelectorTable);

  function BpSelectorTable(props) {
    var _this4;

    _classCallCheck(this, BpSelectorTable);

    _this4 = _super4.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this4));
    _this4.state = {
      columnWidths: null
    };
    _this4.saved_data_dict = null;
    _this4.data_update_required = null;
    _this4.table_ref = /*#__PURE__*/_react["default"].createRef();
    return _this4;
  }

  _createClass(BpSelectorTable, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.computeColumnWidths();
      this.saved_data_dict = this.props.data_dict;
    }
  }, {
    key: "computeColumnWidths",
    value: function computeColumnWidths() {
      var _this5 = this;

      if (Object.keys(this.props.data_dict).length == 0) return;
      var column_names = Object.keys(this.props.columns);
      var bcwidths = compute_initial_column_widths(column_names, Object.values(this.props.data_dict));
      var cwidths = [];

      if (this.props.maxColumnWidth) {
        var _iterator = _createForOfIteratorHelper(bcwidths),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var c = _step.value;

            if (c > this.props.maxColumnWidth) {
              cwidths.push(this.props.maxColumnWidth);
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

      var self = this;
      this.setState({
        columnWidths: cwidths
      }, function () {
        var the_sum = _this5.state.columnWidths.reduce(function (a, b) {
          return a + b;
        }, 0);

        self.props.communicateColumnWidthSum(the_sum);
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      // this.props.my_ref.current.scrollTop = this.props.scroll_top;
      if (this.state.columnWidths == null || !_lodash["default"].isEqual(this.props.data_dict, this.saved_data_dict)) {
        this.computeColumnWidths();
        this.saved_data_dict = this.props.data_dict;
      }
    }
  }, {
    key: "_onCompleteRender",
    value: function _onCompleteRender() {
      if (this.data_update_required != null) {
        this.props.initiateDataGrab(this.data_update_required);
        this.data_update_required = null;
      }

      var lastColumnRegion = _table.Regions.column(Object.keys(this.props.columns).length - 1);

      var firstColumnRegion = _table.Regions.column(0);

      this.table_ref.current.scrollToRegion(lastColumnRegion);
      this.table_ref.current.scrollToRegion(firstColumnRegion);
    }
  }, {
    key: "haveRowData",
    value: function haveRowData(rowIndex) {
      return this.props.data_dict.hasOwnProperty(rowIndex);
    }
  }, {
    key: "_cellRendererCreator",
    value: function _cellRendererCreator(column_name) {
      var _this6 = this;

      var self = this;
      return function (rowIndex) {
        if (!_this6.haveRowData(rowIndex)) {
          if (self.data_update_required == null) {
            self.data_update_required = rowIndex;
          }

          return /*#__PURE__*/_react["default"].createElement(_table.Cell, {
            key: column_name,
            loading: true
          });
        }

        var the_body;
        var the_class = "";

        if (Object.keys(self.props.data_dict[rowIndex]).includes(column_name)) {
          if ("hidden" in self.props.data_dict[rowIndex] && self.props.data_dict[rowIndex]["hidden"]) {
            the_class = "hidden_cell";
          }

          var the_text = String(self.props.data_dict[rowIndex][column_name]);

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

        var tclass;

        if (_this6.props.open_resources && _this6.props.open_resources.includes(_this6.props.data_dict[rowIndex][_this6.props.identifier_field])) {
          tclass = "open-selector-row";
        } else {
          tclass = "";
        }

        return /*#__PURE__*/_react["default"].createElement(_table.Cell, {
          key: column_name,
          interactive: true,
          truncated: true,
          tabIndex: -1,
          onKeyDown: _this6.props.keyHandler,
          wrapText: true
        }, /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
          className: tclass,
          onDoubleClick: function onDoubleClick() {
            return self.props.handleRowDoubleClick(self.props.data_dict[rowIndex]);
          }
        }, the_body)));
      };
    }
  }, {
    key: "_renderMenu",
    value: function _renderMenu(sortColumn) {
      var _this7 = this;

      if (!this.props.columns[sortColumn].sort_field) return null;

      var sortAsc = function sortAsc() {
        _this7.props.sortColumn(sortColumn, _this7.props.columns[sortColumn].sort_field, "ascending");
      };

      var sortDesc = function sortDesc() {
        _this7.props.sortColumn(sortColumn, _this7.props.columns[sortColumn].sort_field, "descending");
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
  }, {
    key: "render",
    value: function render() {
      var _this8 = this;

      var self = this;
      var column_names = Object.keys(this.props.columns);
      var columns = column_names.map(function (column_name) {
        var cellRenderer = self._cellRendererCreator(column_name);

        var columnHeaderCellRenderer = function columnHeaderCellRenderer() {
          return /*#__PURE__*/_react["default"].createElement(_table.ColumnHeaderCell, {
            name: column_name,
            nameRenderer: BpSelectorTable._columnHeaderNameRenderer,
            menuRenderer: function menuRenderer() {
              return self._renderMenu(column_name);
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
      var obj = {
        cwidths: this.state.columnWidths,
        nrows: this.props.num_rows
      };
      var hsh = (0, _objectHash["default"])(obj);
      return /*#__PURE__*/_react["default"].createElement(_core.HotkeysProvider, null, /*#__PURE__*/_react["default"].createElement(_table.Table2, {
        numRows: this.props.num_rows // key={this.props.num_rows}
        ,
        ref: this.table_ref,
        cellRendererDependencies: [self.props.data_dict],
        bodyContextMenuRenderer: function bodyContextMenuRenderer(mcontext) {
          return _this8.props.renderBodyContextMenu(mcontext);
        },
        enableColumnReordering: false,
        enableColumnResizing: this.props.enableColumnResizing,
        maxColumnWidth: this.props.maxColumnWidth,
        enableMultipleSelection: true,
        defaultRowHeight: 23,
        selectedRegions: this.props.selectedRegions,
        enableRowHeader: false,
        columnWidths: this.state.columnWidths,
        onCompleteRender: this._onCompleteRender,
        selectionModes: [_table.RegionCardinality.FULL_ROWS, _table.RegionCardinality.CELLS],
        onSelection: function onSelection(regions) {
          return _this8.props.onSelection(regions);
        }
      }, columns));
    }
  }], [{
    key: "_columnHeaderNameRenderer",
    value: function _columnHeaderNameRenderer(the_text) {
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
          className: "bp4-table-truncated-text"
        }, the_text);
      }

      return the_body;
    }
  }]);

  return BpSelectorTable;
}(_react["default"].Component);

exports.BpSelectorTable = BpSelectorTable;
BpSelectorTable.propTypes = {
  columns: _propTypes["default"].object,
  open_resources: _propTypes["default"].array,
  maxColumnWidth: _propTypes["default"].number,
  enableColumnResizing: _propTypes["default"].bool,
  selectedRegions: _propTypes["default"].array,
  data_dict: _propTypes["default"].object,
  num_rows: _propTypes["default"].number,
  keyHandler: _propTypes["default"].func,
  communicateColumnWidthSum: _propTypes["default"].func,
  sortColumn: _propTypes["default"].func,
  onSelection: _propTypes["default"].func,
  handleRowDoubleClick: _propTypes["default"].func,
  identifier_field: _propTypes["default"].string
};
BpSelectorTable.defaultProps = {
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
    },
    "tags": {
      "sort_field": "tags",
      "first_sort": "ascending"
    }
  },
  identifier_field: "name",
  enableColumnResigin: false,
  maxColumnWidth: null,
  active_row: 0,
  show_animations: false,
  handleSpaceBarPress: null,
  keyHandler: null,
  draggable: true
};
var MAX_INITIAL_CELL_WIDTH = 300;
var ICON_WIDTH = 35;

function compute_initial_column_widths(header_list, data_list) {
  var ncols = header_list.length;
  var max_field_width = MAX_INITIAL_CELL_WIDTH; // Get sample header and body cells
  // set up a canvas so that we can use it to compute the width of text

  var body_font = $($(".bp4-table-truncated-text")[0]).css("font");
  var header_font = $($(".bp4-table-column-name-text")[0]).css("font");
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
  var the_child; // Find the width of each body cell
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
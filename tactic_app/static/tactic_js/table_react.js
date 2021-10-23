"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FreeformBody = exports.MainTableCardHeader = exports.MainTableCard = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _core = require("@blueprintjs/core");

var _blueprint_react_widgets = require("./blueprint_react_widgets.js");

var _reactCodemirror = require("./react-codemirror.js");

var _blueprint_mdata_fields = require("./blueprint_mdata_fields.js");

var _utilities_react = require("./utilities_react.js");

var _communication_react = require("./communication_react.js");

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

var FreeformBody = /*#__PURE__*/function (_React$Component) {
  _inherits(FreeformBody, _React$Component);

  var _super = _createSuper(FreeformBody);

  function FreeformBody(props) {
    var _this;

    _classCallCheck(this, FreeformBody);

    _this = _super.call(this, props);
    _this.cmobject = null;
    _this.overlay = null;
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(FreeformBody, [{
    key: "_setCMObject",
    value: function _setCMObject(cmobject) {
      this.cmobject = cmobject;
    }
  }, {
    key: "_clearSearch",
    value: function _clearSearch() {
      if (this.cmobject && this.overlay) {
        this.cmobject.removeOverlay(this.overlay);
        this.overlay = null;
      }
    }
  }, {
    key: "_doSearch",
    value: function _doSearch() {
      if (this.props.alt_search_text && this.props.alt_search_text != "" && this.cmobject) {
        this.overlay = this.mySearchOverlay(this.props.alt_search_text, true);
        this.cmobject.addOverlay(this.overlay);
      } else if (this.props.search_text && this.props.search_text != "" && this.cmobject) {
        this.overlay = this.mySearchOverlay(this.props.search_text, true);
        this.cmobject.addOverlay(this.overlay);
      }
    }
  }, {
    key: "mySearchOverlay",
    value: function mySearchOverlay(query, caseInsensitive) {
      if (typeof query == "string") {
        // noinspection RegExpRedundantEscape
        query = new RegExp(query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), caseInsensitive ? "gi" : "g");
      } else if (!query.global) query = new RegExp(query.source, query.ignoreCase ? "gi" : "g");

      return {
        token: function token(stream) {
          query.lastIndex = stream.pos;
          var match = query.exec(stream.string);

          if (match && match.index == stream.pos) {
            stream.pos += match[0].length || 1;
            return "searching"; // I believe this causes the style .cm-searching to be applied
          } else if (match) {
            stream.pos = match.index;
          } else {
            stream.skipToEnd();
          }
        }
      };
    }
  }, {
    key: "_handleBlur",
    value: function _handleBlur(new_data_text) {
      (0, _communication_react.postWithCallback)(this.props.main_id, "add_freeform_document", {
        document_name: this.props.document_name,
        doc_text: new_data_text
      });
    }
  }, {
    key: "_handleChange",
    value: function _handleChange(new_data_text) {}
  }, {
    key: "render",
    value: function render() {
      this._clearSearch();

      this._doSearch();

      return /*#__PURE__*/_react["default"].createElement("div", {
        ref: this.props.my_ref
      }, /*#__PURE__*/_react["default"].createElement(_reactCodemirror.ReactCodemirror, {
        handleBlur: this._handleBlur,
        handleChange: null,
        code_content: this.props.data_text,
        sync_to_prop: true,
        dark_theme: this.props.dark_theme,
        soft_wrap: this.props.soft_wrap,
        mode: "Plain Text",
        code_container_height: this.props.code_container_height,
        code_container_width: this.props.code_container_width - 30,
        setCMObject: this._setCMObject,
        readOnly: false
      }));
    }
  }]);

  return FreeformBody;
}(_react["default"].Component);

exports.FreeformBody = FreeformBody;
FreeformBody.propTypes = {
  main_id: _propTypes["default"].string,
  document_name: _propTypes["default"].string,
  my_ref: _propTypes["default"].object,
  data_text: _propTypes["default"].string,
  code_container_height: _propTypes["default"].number,
  search_text: _propTypes["default"].string,
  alt_search_text: _propTypes["default"].string,
  setMainStateValue: _propTypes["default"].func,
  soft_wrap: _propTypes["default"].bool
};

function SmallSpinner() {
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex"
  }, /*#__PURE__*/_react["default"].createElement("span", {
    className: " loader-small"
  }));
}

var MainTableCardHeader = /*#__PURE__*/function (_React$Component2) {
  _inherits(MainTableCardHeader, _React$Component2);

  var _super2 = _createSuper(MainTableCardHeader);

  function MainTableCardHeader(props) {
    var _this2;

    _classCallCheck(this, MainTableCardHeader);

    _this2 = _super2.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this2));
    _this2.heading_left_ref = /*#__PURE__*/_react["default"].createRef();
    _this2.heading_right_ref = /*#__PURE__*/_react["default"].createRef();
    _this2.state = {
      hide_right_element: false
    };
    return _this2;
  }

  _createClass(MainTableCardHeader, [{
    key: "_getHideRight",
    value: function _getHideRight() {
      var le_rect = this.heading_left_ref.current.getBoundingClientRect();
      var re_rect = this.heading_right_ref.current.getBoundingClientRect();
      return re_rect.x < le_rect.x + le_rect.width + 10;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var hide_right = this._getHideRight();

      if (hide_right != this.state.hide_right_element) {
        this.setState({
          hide_right_element: hide_right
        });
      }
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      return !(0, _utilities_react.propsAreEqual)(nextProps, this.props) || this._getHideRight() != this.state.hide_right_element;
    }
  }, {
    key: "_handleSearchFieldChange",
    value: function _handleSearchFieldChange(event) {
      this.props.handleSearchFieldChange(event.target.value);
    }
  }, {
    key: "_handleFilter",
    value: function _handleFilter() {
      // this.props.handleFilter(this.state.search_field_value);
      var self = this;
      var data_dict = {
        "text_to_find": this.props.search_text
      };
      (0, _communication_react.postWithCallback)(this.props.main_id, "UnfilterTable", data_dict, function () {
        if (self.props.search_text !== "") {
          (0, _communication_react.postWithCallback)(self.props.main_id, "FilterTable", data_dict);
          self.props.setMainStateValue({
            "table_is_filtered": true,
            "selected_regions": null,
            "selected_row": null
          });
        }
      });
    }
  }, {
    key: "_handleUnFilter",
    value: function _handleUnFilter() {
      this.props.handleSearchFieldChange(null);

      if (this.props.table_is_filtered) {
        (0, _communication_react.postWithCallback)(this.props.main_id, "UnfilterTable", {
          selected_row: this.props.selected_row
        });
        this.props.setMainStateValue({
          "table_is_filtered": false,
          "selected_regions": null,
          "selected_row": null
        });
      }
    }
  }, {
    key: "_handleSubmit",
    value: function _handleSubmit(e) {
      e.preventDefault();
    }
  }, {
    key: "_onChangeDoc",
    value: function _onChangeDoc(value) {
      this.props.handleChangeDoc(value);
    }
  }, {
    key: "render",
    value: function render() {
      var heading_right_opacity = this.state.hide_right_element ? 0 : 100;
      var select_style = {
        height: 30,
        maxWidth: 250
      };

      var doc_button_text = /*#__PURE__*/_react["default"].createElement(_core.Text, {
        ellipsize: true
      }, this.props.current_doc_name);

      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "d-flex pl-2 pr-2 justify-content-between align-baseline main-heading",
        style: {
          height: 50
        }
      }, /*#__PURE__*/_react["default"].createElement("div", {
        id: "heading-left",
        ref: this.heading_left_ref,
        className: "d-flex flex-column justify-content-around"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "d-flex flex-row"
      }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        handleClick: this.props.toggleShrink,
        icon: "minimize"
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: "d-flex flex-column justify-content-around"
      }, /*#__PURE__*/_react["default"].createElement("form", {
        className: "d-flex flex-row"
      }, /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
        label: this.props.short_collection_name,
        inline: true,
        style: {
          marginBottom: 0,
          marginLeft: 5,
          marginRight: 10
        }
      }, /*#__PURE__*/_react["default"].createElement(_blueprint_mdata_fields.BpSelect, {
        options: this.props.doc_names,
        onChange: this._onChangeDoc,
        buttonStyle: select_style,
        buttonTextObject: doc_button_text,
        value: this.props.current_doc_name
      })), this.props.show_table_spinner && /*#__PURE__*/_react["default"].createElement(_core.Spinner, {
        size: 15
      }))))), /*#__PURE__*/_react["default"].createElement("div", {
        id: "heading-right",
        ref: this.heading_right_ref,
        style: {
          opacity: heading_right_opacity
        },
        className: "d-flex flex-column justify-content-around"
      }, /*#__PURE__*/_react["default"].createElement("form", {
        onSubmit: this._handleSubmit,
        style: {
          alignItems: "center"
        },
        className: "d-flex flex-row"
      }, this.props.is_freeform && /*#__PURE__*/_react["default"].createElement(_core.Switch, {
        label: "soft wrap",
        className: "mr-2 mb-0",
        large: false,
        checked: this.props.soft_wrap,
        onChange: this.props.handleSoftWrapChange
      }), /*#__PURE__*/_react["default"].createElement(_core.Switch, {
        label: "edit",
        className: "mr-4 mb-0",
        large: false,
        checked: this.props.spreadsheet_mode,
        onChange: this.props.handleSpreadsheetModeChange
      }), /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
        type: "search",
        leftIcon: "search",
        placeholder: "Search",
        value: !this.props.search_text ? "" : this.props.search_text,
        onChange: this._handleSearchFieldChange,
        autoCapitalize: "none",
        autoCorrect: "off",
        className: "mr-2"
      }), /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, null, this.props.show_filter_button && /*#__PURE__*/_react["default"].createElement(_core.Button, {
        onClick: this._handleFilter
      }, "Filter"), /*#__PURE__*/_react["default"].createElement(_core.Button, {
        onClick: this._handleUnFilter
      }, "Clear")))));
    }
  }]);

  return MainTableCardHeader;
}(_react["default"].Component);

exports.MainTableCardHeader = MainTableCardHeader;
MainTableCardHeader.propTypes = {
  toggleShrink: _propTypes["default"].func,
  selected_row: _propTypes["default"].number,
  table_is_filtered: _propTypes["default"].bool,
  setMainStateValue: _propTypes["default"].func,
  handleSearchFieldChange: _propTypes["default"].func,
  search_text: _propTypes["default"].string,
  handleFilter: _propTypes["default"].func,
  short_collection_name: _propTypes["default"].string,
  current_doc_name: _propTypes["default"].string,
  handleChangeDoc: _propTypes["default"].func,
  spreadsheet_mode: _propTypes["default"].bool,
  handleSpreadsheetModeChange: _propTypes["default"].func,
  doc_names: _propTypes["default"].array,
  show_table_spinner: _propTypes["default"].bool,
  show_filter_button: _propTypes["default"].bool,
  broadcast_event_to_server: _propTypes["default"].func,
  is_freeform: _propTypes["default"].bool,
  soft_wrap: _propTypes["default"].bool,
  handleSoftWrapChange: _propTypes["default"].func
};
MainTableCardHeader.defaultProps = {
  is_freeform: false,
  soft_wrap: false,
  handleSoftWrapChange: null
};
var MAX_INITIAL_CELL_WIDTH = 400;
var EXTRA_TABLE_AREA_SPACE = 500;

var MainTableCard = /*#__PURE__*/function (_React$Component3) {
  _inherits(MainTableCard, _React$Component3);

  var _super3 = _createSuper(MainTableCard);

  function MainTableCard(props) {
    var _this3;

    _classCallCheck(this, MainTableCard);

    _this3 = _super3.call(this, props);
    _this3.state = {
      mounted: false
    };
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this3));
    return _this3;
  }

  _createClass(MainTableCard, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        mounted: true
      });
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_core.Card, {
        id: "main-panel",
        elevation: 2
      }, this.props.card_header, /*#__PURE__*/_react["default"].createElement("div", {
        id: "table-wrapper"
      }, this.props.card_body));
    }
  }]);

  return MainTableCard;
}(_react["default"].Component);

exports.MainTableCard = MainTableCard;
MainTableCard.propTypes = {
  card_body: _propTypes["default"].object,
  card_header: _propTypes["default"].object,
  updateTableSpec: _propTypes["default"].func,
  table_spec: _propTypes["default"].object,
  broadcast_event_to_server: _propTypes["default"].func
};

function compute_added_column_width(header_text) {
  var max_field_width = MAX_INITIAL_CELL_WIDTH;
  var header_cell = $($("#table-wrapper th")[0]);
  var header_font = header_cell.css("font");
  var canvas_element = document.getElementById("measure-canvas");
  var ctx = canvas_element.getContext("2d");
  var added_header_width = parseInt(header_cell.css("padding-right")) + parseInt(header_cell.css("padding-left")) + 2;
  ctx.font = header_font;
  return ctx.measureText(header_text).width + added_header_width;
}

function compute_initial_column_widths(header_list) {
  var ncols = header_list.length;
  var max_field_width = MAX_INITIAL_CELL_WIDTH; // Get sample header and body cells

  var header_cell = $($("#table-wrapper th")[0]);
  var body_cell = $($("#table-wrapper td")[0]); // set up a canvas so that we can use it to compute the width of text

  var header_font = header_cell.css("font");
  var body_font = body_cell.css("font");
  var canvas_element = document.getElementById("measure-canvas");
  var ctx = canvas_element.getContext("2d");
  var added_header_width = parseInt(header_cell.css("padding-right")) + parseInt(header_cell.css("padding-left")) + 2;
  var added_body_width = parseInt(body_cell.css("padding-right")) + parseInt(body_cell.css("padding-left")) + 2;
  var header_row = $("#table-area thead tr")[0];
  var body_rows = $("#table-area tbody tr");
  var column_widths = [];
  var columns_remaining = [];

  for (var c = 0; c < ncols; ++c) {
    column_widths.push(0);
    columns_remaining.push(c);
  } // Get the width for each header column


  ctx.font = header_font;
  var the_row;
  var the_width;
  var the_text;
  var the_child;

  for (var _i = 0, _columns_remaining = columns_remaining; _i < _columns_remaining.length; _i++) {
    var _c = _columns_remaining[_i];
    the_child = header_row.cells[_c];
    the_text = the_child.innerText;
    the_width = ctx.measureText(the_text).width + added_header_width;

    if (the_width > max_field_width) {
      the_width = max_field_width;
      var index = columns_remaining.indexOf(_c);

      if (index !== -1) {
        columns_remaining.splice(index, 1);
      }
    }

    if (the_width > column_widths[_c]) {
      column_widths[_c] = the_width;
    }
  } // Find the width of each body cell
  // Keep track of the largest value for each column
  // Once a column has the max value can ignore that column in the future.


  ctx.font = body_font;

  for (var r = 0; r < body_rows.length; ++r) {
    if (columns_remaining.length == 0) {
      break;
    }

    the_row = body_rows[r];
    if ($(the_row).hasClass("spinner-row")) continue;
    var cols_to_remove = [];

    var _iterator = _createForOfIteratorHelper(columns_remaining),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _c3 = _step.value;
        the_child = the_row.cells[_c3];
        the_text = the_child.innerText;
        the_width = ctx.measureText(the_text).width + added_body_width;

        if (the_width > max_field_width) {
          the_width = max_field_width;
          cols_to_remove.push(_c3);
        }

        if (the_width > column_widths[_c3]) {
          column_widths[_c3] = the_width;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    for (var _i2 = 0, _cols_to_remove = cols_to_remove; _i2 < _cols_to_remove.length; _i2++) {
      var _c2 = _cols_to_remove[_i2];

      var _index = columns_remaining.indexOf(_c2);

      if (_index !== -1) {
        columns_remaining.splice(_index, 1);
      }
    }
  }

  return column_widths;
}
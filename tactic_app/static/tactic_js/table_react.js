"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FreeformBody = FreeformBody;
exports.MainTableCard = MainTableCard;
exports.MainTableCardHeader = MainTableCardHeader;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
var _blueprint_react_widgets = require("./blueprint_react_widgets");
var _reactCodemirror = require("./react-codemirror");
var _blueprint_mdata_fields = require("./blueprint_mdata_fields");
var _communication_react = require("./communication_react");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function FreeformBody(props, passedRef) {
  var cmobject = (0, _react.useRef)(null);
  var overlay = (0, _react.useRef)(null);
  function _setCMObject(lcmobject) {
    cmobject.current = lcmobject;
  }
  function _clearSearch() {
    if (cmobject.current && overlay.current) {
      cmobject.current.removeOverlay(overlay.current);
      overlay.current = null;
    }
  }
  function _doSearch() {
    if (props.mStateRef.current.alt_search_text && props.mStateRef.current.alt_search_text != "" && cmobject.current) {
      overlay.current = mySearchOverlay(props.mStateRef.current.alt_search_text, true);
      cmobject.current.addOverlay(overlay.current);
    } else if (props.mStateRef.current.search_text && props.mStateRef.current.search_text != "" && cmobject) {
      overlay.current = mySearchOverlay(props.mStateRef.current.search_text, true);
      cmobject.current.addOverlay(overlay.current);
    }
  }
  function mySearchOverlay(query, caseInsensitive) {
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
  function _handleBlur(new_data_text) {
    (0, _communication_react.postWithCallback)(props.main_id, "add_freeform_document", {
      document_name: props.mStateRef.current.table_spec.document_name,
      doc_text: new_data_text
    }, null);
  }
  function _handleChange(new_data_text) {}
  _clearSearch();
  _doSearch();
  return /*#__PURE__*/_react["default"].createElement("div", {
    ref: passedRef
  }, /*#__PURE__*/_react["default"].createElement(_reactCodemirror.ReactCodemirror, {
    handleBlur: _handleBlur,
    handleChange: null,
    code_content: props.mStateRef.current.data_text,
    sync_to_prop: true,
    soft_wrap: props.mStateRef.current.soft_wrap,
    mode: "Plain Text",
    code_container_height: props.code_container_height,
    code_container_width: props.code_container_width - 30,
    setCMObject: _setCMObject,
    readOnly: false
  }));
}

// FreeformBody.propTypes = {
//     main_id: PropTypes.string,
//     document_name: PropTypes.string,
//     my_ref: PropTypes.object,
//     data_text: PropTypes.string,
//     code_container_height: PropTypes.number,
//     search_text: PropTypes.string,
//     alt_search_text: PropTypes.string,
//     setMainStateValue: PropTypes.func,
//     soft_wrap: PropTypes.bool,
// };

exports.FreeformBody = FreeformBody = /*#__PURE__*/(0, _react.memo)( /*#__PURE__*/(0, _react.forwardRef)(FreeformBody));
function SmallSpinner() {
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex"
  }, /*#__PURE__*/_react["default"].createElement("span", {
    className: " loader-small"
  }));
}
function MainTableCardHeader(props) {
  var heading_left_ref = (0, _react.useRef)(null);
  var heading_right_ref = (0, _react.useRef)(null);
  var _useState = (0, _react.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    hide_right_element = _useState2[0],
    set_hide_right_element = _useState2[1];
  (0, _react.useEffect)(function () {
    var hide_right = _getHideRight();
    if (hide_right != hide_right_element) {
      set_hide_right_element(hide_right);
    }
  });
  function _getHideRight() {
    var le_rect = heading_left_ref.current.getBoundingClientRect();
    var re_rect = heading_right_ref.current.getBoundingClientRect();
    return re_rect.x < le_rect.x + le_rect.width + 10;
  }
  function _handleSearchFieldChange(event) {
    props.handleSearchFieldChange(event.target.value);
  }
  function _handleFilter() {
    var data_dict = {
      "text_to_find": props.mStateRef.current.search_text
    };
    (0, _communication_react.postWithCallback)(props.main_id, "UnfilterTable", data_dict, function () {
      if (props.search_text !== "") {
        (0, _communication_react.postWithCallback)(props.main_id, "FilterTable", data_dict, props.setMainStateValue({
          "table_is_filtered": true,
          "selected_regions": null,
          "selected_row": null
        }), null);
      }
    });
  }
  function _handleUnFilter() {
    props.handleSearchFieldChange(null);
    if (props.mStateRef.current.table_is_filtered) {
      (0, _communication_react.postWithCallback)(props.main_id, "UnfilterTable", {
        selected_row: props.mStateRef.current.selected_row
      }, null);
      props.setMainStateValue({
        "table_is_filtered": false,
        "selected_regions": null,
        "selected_row": null
      });
    }
  }
  function _handleSubmit(e) {
    e.preventDefault();
  }
  function _onChangeDoc(value) {
    props.handleChangeDoc(value);
  }
  var heading_right_opacity = hide_right_element ? 0 : 100;
  var select_style = {
    height: 30,
    maxWidth: 250
  };
  var doc_button_text = /*#__PURE__*/_react["default"].createElement(_core.Text, {
    ellipsize: true
  }, props.mStateRef.current.table_spec.current_doc_name);
  var self = this;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex pl-2 pr-2 justify-content-between align-baseline main-heading",
    style: {
      height: 50
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    id: "heading-left",
    ref: heading_left_ref,
    className: "d-flex flex-column justify-content-around"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: props.toggleShrink,
    icon: "minimize"
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-column justify-content-around"
  }, /*#__PURE__*/_react["default"].createElement("form", {
    className: "d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: props.mStateRef.current.short_collection_name,
    inline: true,
    style: {
      marginBottom: 0,
      marginLeft: 5,
      marginRight: 10
    }
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_mdata_fields.BpSelect, {
    options: props.mStateRef.current.doc_names,
    onChange: _onChangeDoc,
    buttonStyle: select_style,
    buttonTextObject: doc_button_text,
    value: props.mStateRef.current.table_spec.current_doc_name
  })), props.mStateRef.current.show_table_spinner && /*#__PURE__*/_react["default"].createElement(_core.Spinner, {
    size: 15
  }))))), /*#__PURE__*/_react["default"].createElement("div", {
    id: "heading-right",
    ref: heading_right_ref,
    style: {
      opacity: heading_right_opacity
    },
    className: "d-flex flex-column justify-content-around"
  }, /*#__PURE__*/_react["default"].createElement("form", {
    onSubmit: _handleSubmit,
    style: {
      alignItems: "center"
    },
    className: "d-flex flex-row"
  }, props.is_freeform && /*#__PURE__*/_react["default"].createElement(_core.Switch, {
    label: "soft wrap",
    className: "mr-2 mb-0",
    large: false,
    checked: props.mStateRef.current.soft_wrap,
    onChange: props.handleSoftWrapChange
  }), /*#__PURE__*/_react["default"].createElement(_core.Switch, {
    label: "edit",
    className: "mr-4 mb-0",
    large: false,
    checked: props.mStateRef.current.spreadsheet_mode,
    onChange: props.handleSpreadsheetModeChange
  }), /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
    type: "search",
    leftIcon: "search",
    placeholder: "Search",
    value: !props.mStateRef.current.search_text ? "" : props.mStateRef.current.search_text,
    onChange: _handleSearchFieldChange,
    autoCapitalize: "none",
    autoCorrect: "off",
    className: "mr-2"
  }), /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, null, props.show_filter_button && /*#__PURE__*/_react["default"].createElement(_core.Button, {
    onClick: _handleFilter
  }, "Filter"), /*#__PURE__*/_react["default"].createElement(_core.Button, {
    onClick: _handleUnFilter
  }, "Clear")))));
}
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
  is_freeform: _propTypes["default"].bool,
  soft_wrap: _propTypes["default"].bool,
  handleSoftWrapChange: _propTypes["default"].func
};
MainTableCardHeader.defaultProps = {
  is_freeform: false,
  soft_wrap: false,
  handleSoftWrapChange: null
};
exports.MainTableCardHeader = MainTableCardHeader = /*#__PURE__*/(0, _react.memo)(MainTableCardHeader);
var MAX_INITIAL_CELL_WIDTH = 400;
var EXTRA_TABLE_AREA_SPACE = 500;
function MainTableCard(props) {
  return /*#__PURE__*/_react["default"].createElement(_core.Card, {
    id: "main-panel",
    elevation: 2
  }, props.card_header, /*#__PURE__*/_react["default"].createElement("div", {
    id: "table-wrapper"
  }, props.card_body));
}
MainTableCard.propTypes = {
  card_body: _propTypes["default"].object,
  card_header: _propTypes["default"].object
};
exports.MainTableCard = MainTableCard = /*#__PURE__*/(0, _react.memo)(MainTableCard);
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
  var max_field_width = MAX_INITIAL_CELL_WIDTH;

  // Get sample header and body cells
  var header_cell = $($("#table-wrapper th")[0]);
  var body_cell = $($("#table-wrapper td")[0]);

  // set up a canvas so that we can use it to compute the width of text
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
  }
  // Get the width for each header column
  ctx.font = header_font;
  var the_row;
  var the_width;
  var the_text;
  var the_child;
  for (var _i2 = 0, _columns_remaining = columns_remaining; _i2 < _columns_remaining.length; _i2++) {
    var _c = _columns_remaining[_i2];
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
  }

  // Find the width of each body cell
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
    for (var _i3 = 0, _cols_to_remove = cols_to_remove; _i3 < _cols_to_remove.length; _i3++) {
      var _c2 = _cols_to_remove[_i3];
      var _index = columns_remaining.indexOf(_c2);
      if (_index !== -1) {
        columns_remaining.splice(_index, 1);
      }
    }
  }
  return column_widths;
}
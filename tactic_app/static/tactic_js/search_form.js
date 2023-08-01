"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FilterSearchForm = FilterSearchForm;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function FilterSearchForm(props) {
  function _handleSubmit(e) {
    props.searchNext();
    e.preventDefault();
  }
  return /*#__PURE__*/_react["default"].createElement("form", {
    onSubmit: _handleSubmit,
    id: "console-search-form",
    className: "d-flex flex-row bp5-form-group",
    style: {
      justifyContent: "flex-end",
      marginRight: props.margin_right,
      marginBottom: 6,
      marginTop: 12
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-column"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
    type: "search",
    leftIcon: "search",
    placeholder: "Search",
    small: true,
    value: !props.search_string ? "" : props.search_string,
    onChange: props.handleSearchFieldChange,
    autoCapitalize: "none",
    autoCorrect: "off",
    className: "mr-2"
  }), /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, null, props.handleFilter && /*#__PURE__*/_react["default"].createElement(_core.Button, {
    onClick: props.handleFilter,
    small: true
  }, "Filter"), props.handleUnFilter && /*#__PURE__*/_react["default"].createElement(_core.Button, {
    onClick: props.handleUnFilter,
    small: true
  }, "Clear"), props.searchNext && /*#__PURE__*/_react["default"].createElement(_core.Button, {
    onClick: props.searchNext,
    icon: "caret-down",
    text: undefined,
    small: true
  }), props.searchPrevious && /*#__PURE__*/_react["default"].createElement(_core.Button, {
    onClick: props.searchPrevious,
    icon: "caret-up",
    text: undefined,
    small: true
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "bp5-form-helper-text",
    style: {
      marginLeft: 10
    }
  }, props.search_helper_text)));
}
FilterSearchForm.propTypes = {
  search_string: _propTypes["default"].string,
  handleSearchFieldChange: _propTypes["default"].func,
  handleFilter: _propTypes["default"].func,
  handleUnFilter: _propTypes["default"].func,
  searchNext: _propTypes["default"].func,
  searchPrevious: _propTypes["default"].func,
  search_helper_text: _propTypes["default"].string,
  margin_right: _propTypes["default"].number
};
FilterSearchForm.defaultProps = {
  handleFilter: null,
  handleUnfilter: null,
  searchNext: null,
  searchPrevious: null,
  search_helper_text: null,
  margin_right: 116
};
exports.FilterSearchForm = FilterSearchForm = /*#__PURE__*/(0, _react.memo)(FilterSearchForm);
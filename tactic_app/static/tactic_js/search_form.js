"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FilterSearchForm = FilterSearchForm;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function FilterSearchForm(props) {
  function _handleSubmit(e) {
    props.searchNext();
    e.preventDefault();
  }
  return /*#__PURE__*/_react.default.createElement("form", {
    onSubmit: _handleSubmit,
    id: "console-search-form",
    className: "d-flex flex-row bp5-form-group",
    style: {
      justifyContent: "flex-end",
      marginRight: props.margin_right,
      marginBottom: 6,
      marginTop: 12
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "d-flex flex-column"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "d-flex flex-row"
  }, /*#__PURE__*/_react.default.createElement(_core.InputGroup, {
    type: "search",
    leftIcon: "search",
    placeholder: "Search",
    small: true,
    value: !props.search_string ? "" : props.search_string,
    onChange: props.handleSearchFieldChange,
    autoCapitalize: "none",
    autoCorrect: "off",
    className: "mr-2"
  }), /*#__PURE__*/_react.default.createElement(_core.ButtonGroup, null, props.handleFilter && /*#__PURE__*/_react.default.createElement(_core.Button, {
    onClick: props.handleFilter,
    small: true
  }, "Filter"), props.handleUnFilter && /*#__PURE__*/_react.default.createElement(_core.Button, {
    onClick: props.handleUnFilter,
    small: true
  }, "Clear"), props.searchNext && /*#__PURE__*/_react.default.createElement(_core.Button, {
    onClick: props.searchNext,
    icon: "caret-down",
    text: undefined,
    small: true
  }), props.searchPrevious && /*#__PURE__*/_react.default.createElement(_core.Button, {
    onClick: props.searchPrevious,
    icon: "caret-up",
    text: undefined,
    small: true
  }))), /*#__PURE__*/_react.default.createElement("div", {
    className: "bp5-form-helper-text",
    style: {
      marginLeft: 10
    }
  }, props.search_helper_text)));
}
FilterSearchForm.propTypes = {
  search_string: _propTypes.default.string,
  handleSearchFieldChange: _propTypes.default.func,
  handleFilter: _propTypes.default.func,
  handleUnFilter: _propTypes.default.func,
  searchNext: _propTypes.default.func,
  searchPrevious: _propTypes.default.func,
  search_helper_text: _propTypes.default.string,
  margin_right: _propTypes.default.number
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
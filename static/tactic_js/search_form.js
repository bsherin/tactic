"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FilterSearchForm = FilterSearchForm;
var _react = _interopRequireWildcard(require("react"));
var _core = require("@blueprintjs/core");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function FilterSearchForm(props) {
  props = _objectSpread({
    handleFilter: null,
    handleUnfilter: null,
    searchNext: null,
    searchPrevious: null,
    search_helper_text: null,
    outer_style: {}
  }, props);
  function _handleSubmit(e) {
    props.searchNext();
    e.preventDefault();
  }
  return /*#__PURE__*/_react["default"].createElement("form", {
    onSubmit: _handleSubmit,
    className: "console-search-form d-flex flex-row bp6-form-group",
    style: props.outer_style
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-column"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
    type: "search",
    leftIcon: "search",
    placeholder: "Search",
    size: "small",
    value: !props.search_string ? "" : props.search_string,
    onChange: props.handleSearchFieldChange,
    autoCapitalize: "none",
    autoCorrect: "off",
    className: "mr-2"
  }), /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, null, props.handleFilter && /*#__PURE__*/_react["default"].createElement(_core.Button, {
    onClick: props.handleFilter,
    size: "small"
  }, "Filter"), props.handleUnFilter && /*#__PURE__*/_react["default"].createElement(_core.Button, {
    onClick: props.handleUnFilter,
    size: "small"
  }, "Clear"), props.searchNext && /*#__PURE__*/_react["default"].createElement(_core.Button, {
    onClick: props.searchNext,
    icon: "caret-down",
    text: undefined,
    size: "small"
  }), props.searchPrevious && /*#__PURE__*/_react["default"].createElement(_core.Button, {
    onClick: props.searchPrevious,
    icon: "caret-up",
    text: undefined,
    size: "small"
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "bp6-form-helper-text",
    style: {
      marginLeft: 10
    }
  }, props.search_helper_text)));
}
exports.FilterSearchForm = FilterSearchForm = /*#__PURE__*/(0, _react.memo)(FilterSearchForm);
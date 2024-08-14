"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FilterSearchForm = FilterSearchForm;
var _react = _interopRequireWildcard(require("react"));
var _core = require("@blueprintjs/core");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function FilterSearchForm(props) {
  props = _objectSpread({
    handleFilter: null,
    handleUnfilter: null,
    searchNext: null,
    searchPrevious: null,
    search_helper_text: null,
    margin_right: 116
  }, props);
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
exports.FilterSearchForm = FilterSearchForm = /*#__PURE__*/(0, _react.memo)(FilterSearchForm);
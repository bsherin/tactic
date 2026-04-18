"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GlyphButton = GlyphButton;
exports.LabeledFormField = LabeledFormField;
exports.LabeledPoolSelect = LabeledPoolSelect;
exports.LabeledSelectAdvancedList = LabeledSelectAdvancedList;
exports.LabeledSelectList = LabeledSelectList;
exports.LabeledTextArea = LabeledTextArea;
exports.SelectList = SelectList;
exports.withTooltip = withTooltip;
var _react = _interopRequireWildcard(require("react"));
var _core = require("@blueprintjs/core");
var _selector_advanced = require("./selector_advanced");
var _pool_tree = require("./pool_tree");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
  props = _objectSpread({
    style: null,
    className: "",
    extra_glyph_text: null,
    variant: "minimal",
    intent: "none",
    size: "small"
  }, props);
  var _handleClick = (0, _react.useCallback)(function (e) {
    props.handleClick(e);
    e.stopPropagation();
  }, [props.handleClick]);
  var pDef = (0, _react.useCallback)(function (e) {
    e.preventDefault();
  }, []);
  var style = (0, _react.useMemo)(function () {
    return props.style == null ? {
      paddingLeft: 2,
      paddingRight: 2
    } : props.style;
  }, [props.style]);
  return /*#__PURE__*/_react["default"].createElement(_core.Button, {
    type: "button",
    variant: props.variant,
    size: props.size,
    style: style,
    className: props.className,
    onMouseDown: pDef,
    onClick: _handleClick,
    intent: props.intent,
    icon: props.icon
  }, props.extra_glyph_text && /*#__PURE__*/_react["default"].createElement("span", {
    className: "extra-glyph-text"
  }, props.extra_glyph_text));
}
exports.GlyphButton = GlyphButton = /*#__PURE__*/(0, _react.memo)(GlyphButton);
function LabeledTextArea(props) {
  props = _objectSpread({
    className: ""
  }, props);
  return /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: props.label,
    style: {
      marginRight: 5
    },
    helperText: props.helperText
  }, /*#__PURE__*/_react["default"].createElement(_core.TextArea, {
    onChange: props.onChange,
    autoResize: true,
    className: props.className,
    value: props.the_value
  }));
}
exports.LabeledTextArea = LabeledTextArea = /*#__PURE__*/(0, _react.memo)(LabeledTextArea);
var MIN_AUTO_FIELD_WIDTH = 150;
function AutoResizeInput(props) {
  props = _objectSpread({
    value: "",
    inputClassName: "",
    onChange: null
  }, props);
  var spanRef = (0, _react.useRef)(null);
  var _useState = (0, _react.useState)(MIN_AUTO_FIELD_WIDTH),
    _useState2 = _slicedToArray(_useState, 2),
    width = _useState2[0],
    setWidth = _useState2[1];
  (0, _react.useEffect)(function () {
    if (spanRef.current) {
      setWidth(Math.max(MIN_AUTO_FIELD_WIDTH, spanRef.current.offsetWidth + 30));
    }
  }, [props.value]);
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      display: "inline-block"
    }
  }, /*#__PURE__*/_react["default"].createElement("span", {
    ref: spanRef,
    style: {
      position: "absolute",
      visibility: "hidden",
      whiteSpace: "pre",
      font: "inherit"
    },
    className: props.inputClassName
  }, props.value || " "), /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
    value: props.value,
    inputClassName: props.inputClassName,
    onChange: props.onChange,
    style: {
      width: "".concat(width, "px")
    }
  }));
}
function LabeledFormField(props) {
  props = _objectSpread({
    show: true,
    helperText: null,
    isBool: false,
    className: ""
  }, props);
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
  }) : /*#__PURE__*/_react["default"].createElement(AutoResizeInput, {
    onChange: props.onChange,
    inputClassName: props.className,
    value: fvalue
  }));
}
exports.LabeledFormField = LabeledFormField = /*#__PURE__*/(0, _react.memo)(LabeledFormField);
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
function LabeledSelectAdvancedList(props) {
  return /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: props.label,
    style: {
      marginRight: 5
    }
  }, /*#__PURE__*/_react["default"].createElement(_selector_advanced.BpSelect, {
    options: props.option_list,
    onChange: props.onChange,
    value: props.the_value
  }));
}
exports.LabeledSelectAdvancedList = LabeledSelectAdvancedList = /*#__PURE__*/(0, _react.memo)(LabeledSelectAdvancedList);
function LabeledPoolSelect(props) {
  props = _objectSpread({
    select_type: "both"
  }, props);
  return /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: props.label
  }, /*#__PURE__*/_react["default"].createElement(_pool_tree.PoolAddressSelector, {
    value: props.the_value,
    tsocket: null,
    select_type: props.select_type,
    setValue: props.onChange
  }));
}
exports.LabeledPoolSelect = LabeledPoolSelect = /*#__PURE__*/(0, _react.memo)(LabeledPoolSelect);
function SelectList(props) {
  props = _objectSpread({
    height: null,
    maxWidth: null,
    fontSize: null,
    minimal: false
  }, props);
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

  // let option_items = props.option_list.map((opt, index) =>
  //     <option key={index}>
  //         {opt}
  //     </option>
  // );
  return /*#__PURE__*/_react["default"].createElement(_core.HTMLSelect, {
    style: sstyle,
    onChange: handleChange,
    minimal: props.minimal,
    value: props.value,
    options: props.option_list
  });
}
exports.SelectList = SelectList = /*#__PURE__*/(0, _react.memo)(SelectList);
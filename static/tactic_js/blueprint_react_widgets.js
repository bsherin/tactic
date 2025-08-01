"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GlyphButton = GlyphButton;
exports.LabeledFormField = LabeledFormField;
exports.LabeledSelectList = LabeledSelectList;
exports.LabeledTextArea = LabeledTextArea;
exports.SelectList = SelectList;
exports.withTooltip = withTooltip;
var _react = _interopRequireWildcard(require("react"));
var _core = require("@blueprintjs/core");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
  return /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: props.label,
    style: {
      marginRight: 5
    },
    helperText: props.helperText
  }, /*#__PURE__*/_react["default"].createElement(_core.TextArea, {
    onChange: props.onChange,
    style: {
      resize: "none"
    },
    autoResize: true,
    value: props.the_value
  }));
}
exports.LabeledTextArea = LabeledTextArea = /*#__PURE__*/(0, _react.memo)(LabeledTextArea);
function LabeledFormField(props) {
  props = _objectSpread({
    show: true,
    helperText: null,
    isBool: false
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
  }) : /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
    onChange: props.onChange,
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
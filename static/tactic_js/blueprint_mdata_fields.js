"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BpSelect = BpSelect;
exports.BpSelectAdvanced = BpSelectAdvanced;
exports.CombinedMetadata = CombinedMetadata;
exports.IconSelector = IconSelector;
exports.NativeTags = NativeTags;
exports.NotesField = NotesField;
exports.icon_dict = void 0;
require("../tactic_css/tactic_select.scss");
var _react = _interopRequireWildcard(require("react"));
var _core = require("@blueprintjs/core");
var _select = require("@blueprintjs/select");
var _settings = require("./settings");
var _core2 = _interopRequireDefault(require("highlight.js/lib/core"));
var _javascript = _interopRequireDefault(require("highlight.js/lib/languages/javascript"));
var _python = _interopRequireDefault(require("highlight.js/lib/languages/python"));
var _markdownIt = _interopRequireDefault(require("markdown-it"));
require("markdown-it-latex/dist/index.css");
var _markdownItLatex = _interopRequireDefault(require("markdown-it-latex"));
var _lodash = _interopRequireDefault(require("lodash"));
var _utilities_react = require("./utilities_react");
var _icon_info = require("./icon_info");
var _sizing_tools = require("./sizing_tools");
var _error_boundary = require("./error_boundary");
var _communication_react = require("./communication_react");
var _reactCodemirror = require("./react-codemirror6");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t2 in e) "default" !== _t2 && {}.hasOwnProperty.call(e, _t2) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t2)) && (i.get || i.set) ? o(f, _t2, i) : f[_t2] = e[_t2]); return f; })(e, t); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
_core2["default"].registerLanguage('javascript', _javascript["default"]);
_core2["default"].registerLanguage('python', _python["default"]);
var mdi = (0, _markdownIt["default"])({
  html: true,
  highlight: function highlight(str, lang) {
    if (lang && _core2["default"].getLanguage(lang)) {
      try {
        return '<pre><code class="hljs">' + _core2["default"].highlight(str, {
          language: lang,
          ignoreIllegals: true
        }).value + '</code></pre>';
      } catch (__) {}
    }
    return '<pre><code class="hljs">' + mdi.utils.escapeHtml(str) + '</code></pre>';
  }
});
mdi.use(_markdownItLatex["default"]);
var icon_dict = exports.icon_dict = {
  all: "cube",
  collection: "database",
  project: "projects",
  tile: "application",
  list: "list",
  code: "code",
  pool: "folder-close",
  poolDir: "folder-close",
  poolFile: "document"
};
function SuggestionItemAdvanced(_ref) {
  var item = _ref.item,
    handleClick = _ref.handleClick,
    modifiers = _ref.modifiers;
  var display_text = "display_text" in item ? item.display_text : item.text;
  var the_icon = "icon" in item ? item.icon : null;
  if (item.isgroup) {
    return /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, {
      className: "tile-form-menu-item",
      title: display_text
    });
  } else {
    return /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      className: "tile-form-menu-item",
      text: display_text,
      key: display_text,
      icon: the_icon,
      onClick: handleClick,
      active: modifiers.active,
      shouldDismissPopover: true
    });
  }
}
SuggestionItemAdvanced = /*#__PURE__*/(0, _react.memo)(SuggestionItemAdvanced);
function renderSuggestionAdvanced(item, _ref2) {
  var modifiers = _ref2.modifiers,
    handleClick = _ref2.handleClick,
    index = _ref2.index;
  return /*#__PURE__*/_react["default"].createElement(SuggestionItemAdvanced, {
    item: item,
    key: index,
    modifiers: modifiers,
    handleClick: handleClick
  });
}
function BpSelectAdvanced(_ref3) {
  var options = _ref3.options,
    value = _ref3.value,
    onChange = _ref3.onChange,
    _ref3$buttonIcon = _ref3.buttonIcon,
    buttonIcon = _ref3$buttonIcon === void 0 ? null : _ref3$buttonIcon,
    readOnly = _ref3.readOnly;
  function _filterSuggestion(query, item) {
    if (query.length === 0) {
      return true;
    }
    var re = new RegExp(query.toLowerCase());
    var the_text;
    if (_typeof(item) == "object") {
      the_text = item["text"];
    } else {
      the_text = item;
    }
    return re.test(the_text.toLowerCase());
  }
  function _getActiveItem(val) {
    var _iterator = _createForOfIteratorHelper(options),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var option = _step.value;
        if (_lodash["default"].isEqual(option, val)) {
          return option;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return null;
  }
  var display_text = "display_text" in value ? value.display_text : value.text;
  return /*#__PURE__*/_react["default"].createElement(_error_boundary.ErrorBoundary, null, /*#__PURE__*/_react["default"].createElement(_select.Select, {
    activeItem: _getActiveItem(value),
    itemRenderer: renderSuggestionAdvanced,
    itemPredicate: _filterSuggestion,
    items: options,
    disabled: readOnly,
    onItemSelect: onChange,
    popoverProps: {
      minimal: true,
      boundary: "window",
      modifiers: {
        flip: false,
        preventOverflow: true
      },
      position: _core.PopoverPosition.BOTTOM_LEFT
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
    text: display_text,
    className: "button-in-select",
    icon: buttonIcon
  })));
}
exports.BpSelectAdvanced = BpSelectAdvanced = /*#__PURE__*/(0, _react.memo)(BpSelectAdvanced);
function BpSelect(props) {
  props = _objectSpread({
    buttonIcon: null,
    buttonStyle: {},
    popoverPosition: _core.PopoverPosition.BOTTOM_LEFT,
    buttonTextObject: null,
    filterable: true,
    size: "medium"
  }, props);
  function _filterSuggestion(query, item) {
    if (query.length === 0 || item["isgroup"]) {
      return true;
    }
    var re = new RegExp(query.toLowerCase());
    var the_text;
    if (_typeof(item) == "object") {
      the_text = item["text"];
    } else {
      the_text = item;
    }
    return re.test(the_text.toLowerCase());
  }
  function _getActiveItem(val) {
    var _iterator2 = _createForOfIteratorHelper(props.options),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var option = _step2.value;
        if (_lodash["default"].isEqual(option, val)) {
          return option;
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    return null;
  }
  return /*#__PURE__*/_react["default"].createElement(_select.Select, {
    activeItem: _getActiveItem(props.value),
    className: "tile-form-menu-item",
    filterable: props.filterable,
    itemRenderer: renderSuggestion,
    itemPredicate: _filterSuggestion,
    items: _lodash["default"].cloneDeep(props.options),
    onItemSelect: props.onChange,
    popoverProps: {
      minimal: true,
      boundary: "window",
      modifiers: {
        flip: false,
        preventOverflow: true
      },
      position: props.popoverPosition
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
    className: "button-in-select",
    style: props.buttonStyle,
    size: props.size,
    text: props.buttonTextObject ? props.buttonTextObject : props.value,
    icon: props.buttonIcon
  }));
}
exports.BpSelect = BpSelect = /*#__PURE__*/(0, _react.memo)(BpSelect, function (prevProps, newProps) {
  (0, _utilities_react.propsAreEqual)(newProps, prevProps, ["buttonTextObject"]);
});
function SuggestionItem(_ref4) {
  var item = _ref4.item,
    modifiers = _ref4.modifiers,
    handleClick = _ref4.handleClick;
  var the_text;
  var the_icon;
  if (_typeof(item) == "object") {
    the_text = item["text"];
    the_icon = item["icon"];
  } else {
    the_text = item;
    the_icon = null;
  }
  return /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
    className: "tile-form-menu-item",
    text: the_text,
    icon: the_icon,
    active: modifiers.active,
    onClick: function onClick() {
      return handleClick(the_text);
    },
    shouldDismissPopover: true
  });
}
SuggestionItem = /*#__PURE__*/(0, _react.memo)(SuggestionItem);
function renderSuggestion(item, _ref5) {
  var modifiers = _ref5.modifiers,
    handleClick = _ref5.handleClick,
    index = _ref5.index;
  return /*#__PURE__*/_react["default"].createElement(SuggestionItem, {
    item: item,
    key: index,
    modifiers: modifiers,
    handleClick: handleClick
  });
}
var renderCreateNewTag = function renderCreateNewTag(query, active, handleClick) {
  return /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
    icon: "add",
    key: "create_item",
    text: "Create \"".concat(query, "\""),
    active: active,
    onClick: handleClick,
    shouldDismissPopover: false
  });
};
function NativeTags(props) {
  props = _objectSpread({
    all_tags: []
  }, props);
  function renderTag(item) {
    return item;
  }
  function _createItemFromQuery(name) {
    return name;
  }
  function _handleDelete(tag, i) {
    var new_tlist = _toConsumableArray(props.tags);
    new_tlist.splice(i, 1);
    props.handleChange(new_tlist);
  }
  function _handleAddition(tag) {
    var new_tlist = _toConsumableArray(props.tags);
    new_tlist.push(tag);
    props.handleChange(new_tlist);
  }
  function _filterSuggestion(query, item) {
    if (query.length === 0) {
      return false;
    }
    var re = new RegExp("^".concat(query));
    return re.test(item);
  }
  if (props.readOnly) {
    return /*#__PURE__*/_react["default"].createElement(_core.TagInput, {
      values: props.tags,
      disabled: true
    });
  }
  return /*#__PURE__*/_react["default"].createElement(_select.MultiSelect, {
    allowCreate: true,
    openOnKeyDown: true,
    createNewItemFromQuery: _createItemFromQuery,
    createNewItemRenderer: renderCreateNewTag,
    resetOnSelect: true,
    itemRenderer: renderSuggestion,
    selectedItems: props.tags,
    allowNew: true,
    items: props.all_tags ? props.all_tags : [],
    itemPredicate: _filterSuggestion,
    tagRenderer: renderTag,
    tagInputProps: {
      onRemove: _handleDelete
    },
    onItemSelect: _handleAddition
  });
}
exports.NativeTags = NativeTags = /*#__PURE__*/(0, _react.memo)(NativeTags);
function NotesField(props) {
  props = _objectSpread({
    handleBlur: null
  }, props);
  var setFocusFunc = (0, _react.useRef)(null);
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  (0, _react.useEffect)(function () {}, [props.mStateRef.current.notes]);
  (0, _react.useEffect)(function () {
    // console.log("theme changed")  // This is to force re-rendering because of highlight.js theme change
  }, [settingsContext.settings.theme]);
  var _useState = (0, _react.useState)(500),
    _useState2 = _slicedToArray(_useState, 1),
    mdHeight = _useState2[0];
  var _useState3 = (0, _react.useState)(hasOnlyWhitespace() ? false : props.show_markdown_initial),
    _useState4 = _slicedToArray(_useState3, 2),
    showMarkdown = _useState4[0],
    setShowMarkdown = _useState4[1];
  var awaitingFocus = (0, _react.useRef)(false);
  var cmObject = (0, _react.useRef)(null);
  var mdRef = (0, _react.useRef)(null);
  var localRefRef = (0, _react.useRef)(null);
  (0, _react.useEffect)(function () {
    if (awaitingFocus.current) {
      focusNotes();
      awaitingFocus.current = false;
    }
    if (cmObject.current && !cmObject.current.hasFocus) {
      setShowMarkdown(!hasOnlyWhitespace());
    }
  });
  (0, _react.useEffect)(function () {
    return function () {
      console.log("Unmounting notesfield");
      cmObject.current.destroy();
      cmObject.current = null;
      setFocusFunc.current = null;
    };
  }, []);
  (0, _react.useEffect)(function () {
    setShowMarkdown(!hasOnlyWhitespace());
  }, [props.res_name, props.res_type]);
  function hasOnlyWhitespace() {
    return !props.mStateRef.current.notes || !props.mStateRef.current.notes.trim().length;
  }
  function focusNotes() {
    if (setFocusFunc.current) {
      setFocusFunc.current();
    }
  }
  function _hideMarkdown() {
    if (props.readOnly) return;
    awaitingFocus.current = true; // We can't set focus until the input is visible
    setShowMarkdown(false);
  }
  function _handleMyBlur() {
    _showMarkdown();
    if (props.handleBlur != null) {
      props.handleBlur();
    }
  }
  function _showMarkdown() {
    if (!hasOnlyWhitespace()) {
      setShowMarkdown(true);
    }
  }
  function _setCmObject(cmobject) {
    cmObject.current = cmobject;
  }
  function registerLocalRef(localRef) {
    localRefRef.current = localRef;
  }
  var registerSetFocusFunc = (0, _react.useCallback)(function (theFunc) {
    setFocusFunc.current = theFunc;
  }, []);
  var really_show_markdown = hasOnlyWhitespace() ? false : showMarkdown;
  var md_style = {
    display: really_show_markdown ? "block" : "none",
    maxHeight: mdHeight,
    fontSize: 13
  };
  var converted_markdown;
  if (really_show_markdown) {
    converted_markdown = mdi.render(props.mStateRef.current.notes);
  }
  var converted_dict = {
    __html: converted_markdown
  };
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      display: really_show_markdown ? "none" : "block"
    }
  }, /*#__PURE__*/_react["default"].createElement(_reactCodemirror.ReactCodemirror6, {
    handleChange: props.handleChange,
    className: "notes-field",
    readOnly: props.readOnly,
    setCMObject: _setCmObject,
    handleBlur: _handleMyBlur,
    registerSetFocusFunc: registerSetFocusFunc,
    show_line_numbers: false,
    controlled: false,
    mode: "markdown",
    code_content: props.mStateRef.current.notes,
    no_height: true,
    saveMe: null
  })), /*#__PURE__*/_react["default"].createElement("div", {
    ref: mdRef,
    style: md_style,
    onClick: _hideMarkdown,
    className: "notes-field-markdown-output markdown-heading-sizes",
    dangerouslySetInnerHTML: converted_dict
  }));
}
exports.NotesField = NotesField = /*#__PURE__*/(0, _react.memo)(NotesField);
var icon_dlist = [];
var icon_entry_dict = {};
var cat_order = ['data', 'action', 'table', 'interface', 'editor', 'file', 'media', 'miscellaneous'];
for (var _i = 0, _cat_order = cat_order; _i < _cat_order.length; _i++) {
  var category = _cat_order[_i];
  var cat_entry = {
    text: category,
    display_text: category,
    isgroup: true
  };
  icon_dlist.push(cat_entry);
  var _iterator3 = _createForOfIteratorHelper(_icon_info.tile_icon_dict[category]),
    _step3;
  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var entry = _step3.value;
      var new_entry = {
        text: entry.tags + ", " + category + ", " + entry.iconName,
        val: entry.iconName,
        icon: entry.iconName,
        display_text: entry.displayName,
        isgroup: false
      };
      cat_entry.text = cat_entry.text + ", " + entry.tags + ", " + entry.iconName;
      icon_dlist.push(new_entry);
      icon_entry_dict[new_entry.val] = new_entry;
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
}
function IconSelector(_ref6) {
  var handleSelectChange = _ref6.handleSelectChange,
    icon_val = _ref6.icon_val,
    readOnly = _ref6.readOnly;
  var value = icon_entry_dict[icon_val] ? icon_entry_dict[icon_val] : icon_entry_dict["application"];
  return /*#__PURE__*/_react["default"].createElement(_error_boundary.ErrorBoundary, null, /*#__PURE__*/_react["default"].createElement(BpSelectAdvanced, {
    options: icon_dlist,
    onChange: function onChange(item) {
      handleSelectChange(item.val);
    },
    readOnly: readOnly,
    buttonIcon: icon_val,
    value: value
  }));
}
exports.IconSelector = IconSelector = /*#__PURE__*/(0, _react.memo)(IconSelector);
var ignore_fields = ["doc_type", "res_type"];
var initial_state = {
  allTags: [],
  tags: null,
  created: null,
  updated: null,
  notes: null,
  icon: null,
  category: null,
  additional_metadata: null
};
function metadataReducer(draft, action) {
  switch (action.type) {
    case "set_tags":
      draft.tags = action.value;
      break;
    case "set_notes":
      draft.notes = action.value;
      break;
    case "append_to_notes":
      draft.notes = draft.notes + action.value;
      break;
    case "set_icon":
      draft.icon = action.value;
      break;
    case "set_category":
      draft.category = action.value;
      break;
    case "set_additional_metadata":
      draft.additionalMdata = action.value;
      break;
    case "set_all_tags":
      draft.allTags = action.value;
      break;
    case "set_created":
      draft.created = action.value;
      break;
    case "set_updated":
      draft.updated = action.value;
      break;
    case "multi_update":
      for (var field in action.value) {
        draft[field] = action.value[field];
      }
      break;
    default:
      break;
  }
}
function CombinedMetadata(props) {
  props = _objectSpread({
    expandWidth: true,
    tabSelectCounter: 0,
    useTags: true,
    useNotes: true,
    outer_style: {
      overflow: "auto",
      padding: 15
    },
    elevation: 0,
    handleNotesBlur: null,
    category: null,
    icon: null,
    res_name: null,
    updated: null,
    additional_metadata: null,
    notes_buttons: null,
    res_type: null,
    is_repository: false,
    useFixedData: false,
    tsocket: null,
    alt_category: null
  }, props);
  var top_ref = (0, _react.useRef)();
  var _useImmerReducerAndRe = (0, _utilities_react.useImmerReducerAndRef)(metadataReducer, initial_state),
    _useImmerReducerAndRe2 = _slicedToArray(_useImmerReducerAndRe, 3),
    mDispatch = _useImmerReducerAndRe2[1],
    mStateRef = _useImmerReducerAndRe2[2];
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  var updatedIdRef = (0, _react.useRef)(null);
  var _useDebounce = (0, _utilities_react.useDebounce)(function (state_stuff) {
      postChanges(state_stuff).then(function () {});
    }),
    _useDebounce2 = _slicedToArray(_useDebounce, 2),
    doUpdate = _useDebounce2[1];
  var _useSize = (0, _sizing_tools.useSize)(top_ref, props.tabSelectCounter, "CombinedMetadata"),
    _useSize2 = _slicedToArray(_useSize, 3),
    usable_width = _useSize2[0];
  (0, _react.useEffect)(function () {
    if (props.tsocket != null && !props.is_repository && !props.useFixedData) {
      var handleExternalUpdate = function handleExternalUpdate(data) {
        if (data.res_type == props.res_type && data.res_name == props.res_name && data.mdata_uid != updatedIdRef.current) {
          grabMetadata();
        }
      };
      props.tsocket.attachListener("resource-updated", handleExternalUpdate);
      return function () {
        props.tsocket.detachListener("resource-updated");
      };
    }
  }, [props.tsocket, props.res_name, props.res_type]);
  (0, _react.useEffect)(function () {
    grabMetadata();
  }, [props.res_name, props.res_type]);
  function grabMetadata() {
    if (props.useFixedData || props.res_name == null || props.res_type == null) return;
    if (!props.readOnly) {
      var data_dict = {
        pane_type: props.res_type,
        is_repository: false,
        show_hidden: true
      };
      (0, _communication_react.postAjaxPromise)("get_tag_list", data_dict).then(function (data) {
        mDispatch({
          "type": "set_all_tags",
          "value": data.tag_list
        });
      });
    }
    (0, _communication_react.postAjaxPromise)("grab_metadata", {
      res_type: props.res_type,
      res_name: props.res_name,
      is_repository: props.is_repository
    }).then(function (data) {
      var updater = {
        "tags": data.tags,
        "notes": data.notes,
        "created": data.datestring,
        "updated": data.additional_mdata.updated
      };
      var amdata = data.additional_mdata;
      delete amdata.updated;
      if (data.additional_mdata.icon) {
        updater["icon"] = data.additional_mdata.icon;
      }
      if (props.res_type == "tile") {
        if (data.additional_mdata.category) {
          updater["category"] = data.additional_mdata.category;
          delete amdata.category;
        } else {
          updater["category"] = "nocat";
        }
        if (updater["category"] == "nocat" && props.alt_category) {
          updater["category"] = props.alt_category;
        }
      }
      updater["additionalMdata"] = amdata;
      mDispatch({
        type: "multi_update",
        value: updater
      });
    })["catch"](function (e) {
      console.log("error getting metadata", e);
    });
  }
  function postChanges(_x) {
    return _postChanges.apply(this, arguments);
  }
  function _postChanges() {
    _postChanges = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(state_stuff) {
      var result_dict, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            result_dict = {
              "res_type": props.res_type,
              "res_name": props.res_name,
              "tags": "tags" in state_stuff ? state_stuff["tags"] : mStateRef.current.tags,
              "notes": "notes" in state_stuff ? state_stuff["notes"] : mStateRef.current.notes,
              "icon": "icon" in state_stuff ? state_stuff["icon"] : mStateRef.current.icon,
              "category": "category" in state_stuff ? state_stuff["category"] : mStateRef.current.category,
              "mdata_uid": (0, _utilities_react.guid)()
            };
            _context.p = 1;
            _context.n = 2;
            return (0, _communication_react.postAjaxPromise)("save_metadata", result_dict);
          case 2:
            updatedIdRef.current = result_dict["mdata_uid"];
            _context.n = 4;
            break;
          case 3:
            _context.p = 3;
            _t = _context.v;
            console.log("error saving metadata ", _t);
          case 4:
            return _context.a(2);
        }
      }, _callee, null, [[1, 3]]);
    }));
    return _postChanges.apply(this, arguments);
  }
  function _handleMetadataChange(_x2) {
    return _handleMetadataChange2.apply(this, arguments);
  }
  function _handleMetadataChange2() {
    _handleMetadataChange2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(state_stuff) {
      var post_immediate,
        _args2 = arguments;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            post_immediate = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : true;
            mDispatch({
              type: "multi_update",
              "value": state_stuff
            });
            if (!post_immediate) {
              _context2.n = 2;
              break;
            }
            _context2.n = 1;
            return postChanges(state_stuff);
          case 1:
            _context2.n = 3;
            break;
          case 2:
            doUpdate(state_stuff);
          case 3:
            return _context2.a(2);
        }
      }, _callee2);
    }));
    return _handleMetadataChange2.apply(this, arguments);
  }
  function appendToNotes(_x3) {
    return _appendToNotes.apply(this, arguments);
  }
  function _appendToNotes() {
    _appendToNotes = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(text) {
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.n) {
          case 0:
            mDispatch({
              type: "append_to_notes",
              "value": text
            });
            pushCallback(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
              return _regenerator().w(function (_context3) {
                while (1) switch (_context3.n) {
                  case 0:
                    _context3.n = 1;
                    return postChanges({
                      "notes": mStateRef.current.notes
                    });
                  case 1:
                    return _context3.a(2);
                }
              }, _callee3);
            })));
          case 1:
            return _context4.a(2);
        }
      }, _callee4);
    }));
    return _appendToNotes.apply(this, arguments);
  }
  function _handleNotesChange(_x4) {
    return _handleNotesChange2.apply(this, arguments);
  }
  function _handleNotesChange2() {
    _handleNotesChange2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(new_text) {
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.n) {
          case 0:
            _context5.n = 1;
            return _handleMetadataChange({
              "notes": new_text
            }, false);
          case 1:
            return _context5.a(2);
        }
      }, _callee5);
    }));
    return _handleNotesChange2.apply(this, arguments);
  }
  function _handleTagsChange(_x5) {
    return _handleTagsChange2.apply(this, arguments);
  }
  function _handleTagsChange2() {
    _handleTagsChange2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(tag_list) {
      return _regenerator().w(function (_context6) {
        while (1) switch (_context6.n) {
          case 0:
            _context6.n = 1;
            return _handleMetadataChange({
              "tags": tag_list.join(" ")
            });
          case 1:
            return _context6.a(2);
        }
      }, _callee6);
    }));
    return _handleTagsChange2.apply(this, arguments);
  }
  function _handleCategoryChange(_x6) {
    return _handleCategoryChange2.apply(this, arguments);
  }
  function _handleCategoryChange2() {
    _handleCategoryChange2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(event) {
      return _regenerator().w(function (_context7) {
        while (1) switch (_context7.n) {
          case 0:
            _context7.n = 1;
            return _handleMetadataChange({
              "category": event.target.value
            }, false);
          case 1:
            return _context7.a(2);
        }
      }, _callee7);
    }));
    return _handleCategoryChange2.apply(this, arguments);
  }
  function _handleIconChange(_x7) {
    return _handleIconChange2.apply(this, arguments);
  }
  function _handleIconChange2() {
    _handleIconChange2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(icon) {
      return _regenerator().w(function (_context8) {
        while (1) switch (_context8.n) {
          case 0:
            _context8.n = 1;
            return _handleMetadataChange({
              "icon": icon
            });
          case 1:
            return _context8.a(2);
        }
      }, _callee8);
    }));
    return _handleIconChange2.apply(this, arguments);
  }
  var additional_items;
  if (props.useFixedData) {
    additional_items = [];
    for (var field in props.fixedData) {
      var md = props.fixedData[field];
      additional_items.push(/*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
        label: field + ": ",
        className: "metadata-form_group",
        key: field,
        inline: true
      }, /*#__PURE__*/_react["default"].createElement("span", {
        className: "bp6-ui-text metadata-field"
      }, String(md))));
    }
  } else if (mStateRef.current.additionalMdata != null) {
    additional_items = [];
    for (var _field in mStateRef.current.additionalMdata) {
      var _md = mStateRef.current.additionalMdata[_field];
      if (Array.isArray(_md)) {
        _md = _md.join(", ");
      } else if (_field == "collection_name") {
        var sresult = /\.\w*$/.exec(_md);
        if (sresult != null) _md = sresult[0].slice(1);
      }
      additional_items.push(/*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
        label: _field + ": ",
        className: "metadata-form_group",
        key: _field,
        inline: true
      }, /*#__PURE__*/_react["default"].createElement("span", {
        className: "bp6-ui-text metadata-field"
      }, String(_md))));
    }
  }
  var ostyle = props.outer_style ? _lodash["default"].cloneDeep(props.outer_style) : {};
  if (props.expandWidth) {
    ostyle["width"] = "100%";
  } else {
    ostyle["width"] = usable_width;
  }
  var split_tags = !mStateRef.current.tags || mStateRef.current.tags == "" ? [] : mStateRef.current.tags.split(" ");
  var MetadataNotesButtons = props.notes_buttons;
  return /*#__PURE__*/_react["default"].createElement(_error_boundary.ErrorBoundary, null, /*#__PURE__*/_react["default"].createElement(_core.Card, {
    ref: top_ref,
    elevation: props.elevation,
    className: "combined-metadata accent-bg",
    style: ostyle
  }, props.res_name != null && /*#__PURE__*/_react["default"].createElement(_core.H4, null, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
    icon: icon_dict[props.res_type],
    style: {
      marginRight: 6,
      marginBottom: 2
    }
  }), props.res_name), !props.useFixedData && props.useTags && mStateRef.current.tags != null && mStateRef.current.allTags.length > 0 && /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "Tags"
  }, /*#__PURE__*/_react["default"].createElement(NativeTags, {
    key: "".concat(props.res_name, "-").concat(props.res_type, "-tags"),
    tags: split_tags,
    all_tags: mStateRef.current.allTags,
    readOnly: props.readOnly,
    handleChange: _handleTagsChange,
    res_type: props.res_type
  })), !props.useFixedData && mStateRef.current.category != null && /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "Category",
    key: "".concat(props.res_name, "-").concat(props.res_type, "-cagegory")
  }, /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
    onChange: _handleCategoryChange,
    value: mStateRef.current.category
  })), mStateRef.current.icon != null && /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "Icon"
  }, /*#__PURE__*/_react["default"].createElement(IconSelector, {
    key: "".concat(props.res_name, "-").concat(props.res_type, "-icon-selector"),
    icon_val: mStateRef.current.icon,
    readOnly: props.readOnly,
    handleSelectChange: _handleIconChange
  })), !props.useFixedData && props.useNotes && mStateRef.current.notes != null && /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "Notes"
  }, /*#__PURE__*/_react["default"].createElement(NotesField, {
    key: "".concat(props.res_name, "-").concat(props.res_type, "-notes"),
    mStateRef: mStateRef,
    res_name: props.res_name,
    res_type: props.res_type,
    readOnly: props.readOnly,
    handleChange: _handleNotesChange,
    show_markdown_initial: true,
    handleBlur: props.handleNotesBlur
  }), props.notes_buttons && /*#__PURE__*/_react["default"].createElement(MetadataNotesButtons, {
    appendToNotes: appendToNotes
  })), mStateRef.current.created != null && /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "Created: ",
    className: "metadata-form_group",
    inline: true
  }, /*#__PURE__*/_react["default"].createElement("span", {
    className: "bp6-ui-text metadata-field"
  }, mStateRef.current.created)), mStateRef.current.updated != null && /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "Updated: ",
    className: "metadata-form_group",
    inline: true
  }, /*#__PURE__*/_react["default"].createElement("span", {
    className: "bp6-ui-text metadata-field"
  }, mStateRef.current.updated)), additional_items && additional_items.length > 0 && additional_items, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      height: 100
    }
  })));
}
exports.CombinedMetadata = CombinedMetadata = /*#__PURE__*/(0, _react.memo)(CombinedMetadata);
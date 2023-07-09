"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BpSelect = BpSelect;
exports.BpSelectAdvanced = BpSelectAdvanced;
exports.CombinedMetadata = CombinedMetadata;
exports.NotesField = NotesField;
exports.icon_dict = void 0;
require("../tactic_css/tactic_select.scss");
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
var _select = require("@blueprintjs/select");
var _markdownIt = _interopRequireDefault(require("markdown-it"));
require("markdown-it-latex/dist/index.css");
var _markdownItLatex = _interopRequireDefault(require("markdown-it-latex"));
var _lodash = _interopRequireDefault(require("lodash"));
var _communication_react = require("./communication_react");
var _utilities_react = require("./utilities_react");
var _icon_info = require("./icon_info");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var mdi = (0, _markdownIt["default"])({
  html: true
});
mdi.use(_markdownItLatex["default"]);
var icon_dict = {
  all: "cube",
  collection: "database",
  project: "projects",
  tile: "application",
  list: "list",
  code: "code"
};
exports.icon_dict = icon_dict;
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
SuggestionItemAdvanced.propTypes = {
  item: _propTypes["default"].object,
  modifiers: _propTypes["default"].object,
  handleClick: _propTypes["default"].func
};
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
    buttonIcon = _ref3.buttonIcon;
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
  return /*#__PURE__*/_react["default"].createElement(_select.Select2, {
    activeItem: _getActiveItem(value),
    onActiveItemChange: null,
    itemRenderer: renderSuggestionAdvanced,
    itemPredicate: _filterSuggestion,
    items: options,
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
  }));
}
exports.BpSelectAdvanced = BpSelectAdvanced = /*#__PURE__*/(0, _react.memo)(BpSelectAdvanced);
BpSelectAdvanced.propTypes = {
  options: _propTypes["default"].array,
  onChange: _propTypes["default"].func,
  value: _propTypes["default"].object,
  buttonIcon: _propTypes["default"].string
};
BpSelectAdvanced.defaultProps = {
  buttonIcon: null
};
function BpSelect(props) {
  var _useState = (0, _react.useState)(null),
    _useState2 = _slicedToArray(_useState, 2),
    activeItem = _useState2[0],
    setActiveItem = _useState2[1];
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
  function _handleActiveItemChange(newActiveItem) {
    var the_text;
    if ((typeof item === "undefined" ? "undefined" : _typeof(item)) == "object") {
      the_text = newActiveItem["text"];
    } else {
      the_text = newActiveItem;
    }
    setActiveItem(the_text);
  }
  return /*#__PURE__*/_react["default"].createElement(_select.Select2, {
    className: "tile-form-menu-item",
    activeItem: activeItem,
    filterable: props.filterable,
    onActiveItemChange: _handleActiveItemChange,
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
    small: props.small,
    text: props.buttonTextObject ? props.buttonTextObject : props.value,
    icon: props.buttonIcon
  }));
}
exports.BpSelect = BpSelect = /*#__PURE__*/(0, _react.memo)(BpSelect, function (prevProps, newProps) {
  (0, _utilities_react.propsAreEqual)(newProps, prevProps, ["buttonTextObject"]);
});
BpSelect.propTypes = {
  options: _propTypes["default"].array,
  onChange: _propTypes["default"].func,
  filterable: _propTypes["default"].bool,
  small: _propTypes["default"].bool,
  value: _propTypes["default"].string,
  buttonTextObject: _propTypes["default"].object,
  buttonIcon: _propTypes["default"].string,
  buttonStyle: _propTypes["default"].object,
  popoverPosition: _propTypes["default"].string
};
BpSelect.defaultProps = {
  buttonIcon: null,
  buttonStyle: {},
  popoverPosition: _core.PopoverPosition.BOTTOM_LEFT,
  buttonTextObject: null,
  filterable: true,
  small: undefined
};
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
SuggestionItem.propTypes = {
  item: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].object]),
  modifiers: _propTypes["default"].object,
  handleClick: _propTypes["default"].func
};
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
  var hclick = handleClick;
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
  var _useState3 = (0, _react.useState)(""),
    _useState4 = _slicedToArray(_useState3, 2),
    query = _useState4[0],
    setQuery = _useState4[1];
  var _useState5 = (0, _react.useState)([]),
    _useState6 = _slicedToArray(_useState5, 2),
    suggestions = _useState6[0],
    setSuggestions = _useState6[1];
  (0, _react.useEffect)(function () {
    var data_dict = {
      "pane_type": props.pane_type,
      "is_repository": false
    };
    if (!props.pane_type) {
      setSuggestions([]);
      return;
    }
    (0, _communication_react.postAjaxPromise)("get_tag_list", data_dict).then(function (data) {
      var all_tags = data.tag_list;
      setSuggestions(all_tags);
    });
  }, [props.pane_type]);
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
    items: suggestions,
    itemPredicate: _filterSuggestion,
    tagRenderer: renderTag,
    tagInputProps: {
      onRemove: _handleDelete
    },
    onItemSelect: _handleAddition
  });
}
NativeTags = /*#__PURE__*/(0, _react.memo)(NativeTags);
NativeTags.proptypes = {
  tags: _propTypes["default"].array,
  handleChange: _propTypes["default"].func,
  pane_type: _propTypes["default"].string,
  readOnly: _propTypes["default"].bool
};
function NotesField(props) {
  var _useState7 = (0, _react.useState)(500),
    _useState8 = _slicedToArray(_useState7, 2),
    mdHeight = _useState8[0],
    setMdHeight = _useState8[1];
  var _useState9 = (0, _react.useState)(function () {
      return hasOnlyWhitespace() ? false : props.show_markdown_initial;
    }),
    _useState10 = _slicedToArray(_useState9, 2),
    showMarkdown = _useState10[0],
    setShowMarkdown = _useState10[1];
  var awaitingFocus = (0, _react.useRef)(false);
  var mdRef = (0, _react.useRef)(null);
  var notesRef = (0, _react.useRef)(null);
  (0, _react.useEffect)(function () {
    if (awaitingFocus.current) {
      focusNotes();
      awaitingFocus.current = false;
    } else if (hasOnlyWhitespace()) {
      if (showMarkdown) {
        // If we are here, then we are reusing a notes field that previously showed markdown
        // and now is empty. We want to prevent markdown being shown when a character is typed.
        setShowMarkdown(false);
      }
    } else if (!showMarkdown && notesRef.current !== document.activeElement) {
      // If we are here it means the change was initiated externally
      _showMarkdown();
    }
  });
  function getNotesField() {
    return $(notesRef.current);
  }
  function hasOnlyWhitespace() {
    return !props.notes || !props.notes.trim().length;
  }
  function getMarkdownField() {
    return $(mdRef.current);
  }
  function focusNotes() {
    getNotesField().focus();
  }
  function _notesRefHandler(the_ref) {
    notesRef.current = the_ref;
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
  var really_show_markdown = hasOnlyWhitespace() ? false : showMarkdown;
  var notes_style = {
    display: really_show_markdown ? "none" : "block",
    fontSize: 13,
    resize: "both"
  };
  var md_style = {
    display: really_show_markdown ? "block" : "none",
    maxHeight: mdHeight,
    fontSize: 13
  };
  var converted_markdown;
  if (really_show_markdown) {
    converted_markdown = mdi.render(props.notes);
  }
  var converted_dict = {
    __html: converted_markdown
  };
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_core.TextArea, {
    rows: "20",
    cols: "75",
    inputRef: _notesRefHandler,
    growVertically: false,
    onBlur: _handleMyBlur,
    onChange: props.handleChange,
    value: props.notes,
    disabled: props.readOnly,
    style: notes_style
  }), /*#__PURE__*/_react["default"].createElement("div", {
    ref: mdRef,
    style: md_style,
    onClick: _hideMarkdown,
    className: "notes-field-markdown-output",
    dangerouslySetInnerHTML: converted_dict
  }));
}
exports.NotesField = NotesField = /*#__PURE__*/(0, _react.memo)(NotesField);
NotesField.propTypes = {
  readOnly: _propTypes["default"].bool,
  notes: _propTypes["default"].string,
  handleChange: _propTypes["default"].func,
  show_markdown_initial: _propTypes["default"].bool,
  handleBlur: _propTypes["default"].func
};
NotesField.defaultProps = {
  handleBlur: null
};
var icon_list = ["application", "code", "timeline-line-chart", "heatmap", "graph", "heat-grid", "chart", "pie-chart", "regression-chart", "grid", "numerical", "font", "array", "array-numeric", "array-string", "data-lineage", "function", "variable", "build", "group-objects", "ungroup-objects", "inner-join", "filter", "sort-asc", "sort-alphabetical", "sort-numerical", "random", "layout", "layout-auto", "layout-balloon", "changes", "comparison", "exchange", "derive_column", "list-columns", "delta", "edit", "fork", "numbered-list", "path-search", "search", "plus", "repeat", "reset", "resolve", "widget-button", "star", "time", "settings", "properties", "cog", "key-command", "ip-address", "download", "cloud", "globe", "tag", "label", "history", "predictive-analysis", "calculator", "pulse", "warning-sign", "cube", "wrench"];
var icon_dlist = [];
var icon_entry_dict = {};
var cat_order = ['data', 'action', 'table', 'interface', 'editor', 'file', 'media', 'miscellaneous'];
for (var _i2 = 0, _cat_order = cat_order; _i2 < _cat_order.length; _i2++) {
  var category = _cat_order[_i2];
  var cat_entry = {
    text: category,
    display_text: category,
    isgroup: true
  };
  icon_dlist.push(cat_entry);
  var _iterator2 = _createForOfIteratorHelper(_icon_info.tile_icon_dict[category]),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var entry = _step2.value;
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
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
}
function IconSelector(_ref6) {
  var handleSelectChange = _ref6.handleSelectChange,
    icon_val = _ref6.icon_val;
  return /*#__PURE__*/_react["default"].createElement(BpSelectAdvanced, {
    options: icon_dlist,
    onChange: function onChange(item) {
      handleSelectChange(item.val);
    },
    buttonIcon: icon_val,
    value: icon_entry_dict[icon_val]
  });
}
IconSelector = /*#__PURE__*/(0, _react.memo)(IconSelector);
IconSelector.propTypes = {
  handleSelectChange: _propTypes["default"].func,
  icon_val: _propTypes["default"].string
};
function CombinedMetadata(props) {
  var _useState11 = (0, _react.useState)(false),
    _useState12 = _slicedToArray(_useState11, 2),
    auxIsOpen = _useState12[0],
    setAuxIsOpen = _useState12[1];
  var _useState13 = (0, _react.useState)(null),
    _useState14 = _slicedToArray(_useState13, 2),
    tempNotes = _useState14[0],
    setTempNotes = _useState14[1];
  var _useDebounce = (0, _utilities_react.useDebounce)(function (newval) {
      props.handleChange({
        "notes": newval
      });
    }),
    _useDebounce2 = _slicedToArray(_useDebounce, 2),
    waiting = _useDebounce2[0],
    doUpdate = _useDebounce2[1];
  function _handleNotesChange(event) {
    doUpdate(event.target.value);
    setTempNotes(event.target.value);
  }
  function _handleTagsChange(tags) {
    props.handleChange({
      "tags": tags
    });
  }
  function _handleTagsChangeNative(tags) {
    props.handleChange({
      "tags": tags
    });
  }
  function _handleCategoryChange(event) {
    props.handleChange({
      "category": event.target.value
    });
  }
  function _handleIconChange(icon) {
    props.handleChange({
      "icon": icon
    });
  }
  function _toggleAuxVisibility() {
    setAuxIsOpen(!auxIsOpen);
  }
  var addition_field_style = {
    fontSize: 14
  };
  var additional_items;
  var current_notes = waiting.current ? tempNotes : props.notes;
  if (props.additional_metadata != null) {
    additional_items = [];
    for (var field in props.additional_metadata) {
      var md = props.additional_metadata[field];
      if (Array.isArray(md)) {
        md = md.join(", ");
      } else if (field == "collection_name") {
        var sresult = /\.\w*$/.exec(md);
        if (sresult != null) md = sresult[0].slice(1);
      }
      additional_items.push( /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
        label: field + ": ",
        className: "metadata-form_group",
        key: field,
        inline: true
      }, /*#__PURE__*/_react["default"].createElement("span", {
        className: "bp5-ui-text metadata-field"
      }, String(md))));
    }
  }
  var button_base = auxIsOpen ? "Hide" : "Show";
  return /*#__PURE__*/_react["default"].createElement(_core.Card, {
    elevation: props.elevation,
    className: "combined-metadata accent-bg",
    style: props.outer_style
  }, props.name != null && /*#__PURE__*/_react["default"].createElement(_core.H4, null, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
    icon: icon_dict[props.res_type],
    style: {
      marginRight: 6,
      marginBottom: 2
    }
  }), props.name), /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "Tags"
  }, /*#__PURE__*/_react["default"].createElement(NativeTags, {
    tags: props.tags,
    readOnly: props.readOnly,
    handleChange: _handleTagsChange,
    pane_type: props.pane_type
  })), props.category != null && /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "Category"
  }, /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
    onChange: _handleCategoryChange,
    value: props.category
  })), props.icon != null && /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "Icon"
  }, /*#__PURE__*/_react["default"].createElement(IconSelector, {
    icon_val: props.icon,
    handleSelectChange: _handleIconChange
  })), /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "Notes"
  }, /*#__PURE__*/_react["default"].createElement(NotesField, {
    notes: current_notes,
    readOnly: props.readOnly,
    handleChange: _handleNotesChange,
    show_markdown_initial: true,
    handleBlur: props.handleNotesBlur
  }), props.notes_buttons && props.notes_buttons()), /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "Created: ",
    className: "metadata-form_group",
    inline: true
  }, /*#__PURE__*/_react["default"].createElement("span", {
    className: "bp5-ui-text metadata-field"
  }, props.created)), props.updated != null && /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "Updated: ",
    className: "metadata-form_group",
    inline: true
  }, /*#__PURE__*/_react["default"].createElement("span", {
    className: "bp5-ui-text metadata-field"
  }, props.updated)), props.additional_metadata != null && additional_items, props.aux_pane != null && /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-row justify-content-around",
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
    fill: false,
    small: true,
    minimal: false,
    onClick: _toggleAuxVisibility
  }, button_base + " " + props.aux_pane_title)), /*#__PURE__*/_react["default"].createElement(_core.Collapse, {
    isOpen: auxIsOpen,
    keepChildrenMounted: true
  }, props.aux_pane)), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      height: 100
    }
  }));
}
exports.CombinedMetadata = CombinedMetadata = /*#__PURE__*/(0, _react.memo)(CombinedMetadata);
CombinedMetadata.propTypes = {
  outer_style: _propTypes["default"].object,
  readOnly: _propTypes["default"].bool,
  elevation: _propTypes["default"].number,
  res_type: _propTypes["default"].string,
  pane_type: _propTypes["default"].string,
  name: _propTypes["default"].string,
  created: _propTypes["default"].string,
  updated: _propTypes["default"].string,
  tags: _propTypes["default"].array,
  notes: _propTypes["default"].string,
  category: _propTypes["default"].string,
  icon: _propTypes["default"].string,
  handleChange: _propTypes["default"].func,
  handleNotesBlur: _propTypes["default"].func,
  additional_metadata: _propTypes["default"].object,
  aux_pane: _propTypes["default"].object,
  aux_pane_title: _propTypes["default"].string,
  notes_buttons: _propTypes["default"].oneOfType([_propTypes["default"].number, _propTypes["default"].func])
};
CombinedMetadata.defaultProps = {
  outer_style: {
    marginLeft: 20,
    overflow: "auto",
    padding: 15
  },
  elevation: 0,
  handleNotesBlur: null,
  category: null,
  icon: null,
  name: null,
  updated: null,
  additional_metadata: null,
  aux_pane: null,
  notes_buttons: null
};
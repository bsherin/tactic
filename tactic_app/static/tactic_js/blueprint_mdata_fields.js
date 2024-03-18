"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
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
var _utilities_react = require("./utilities_react");
var _icon_info = require("./icon_info");
var _sizing_tools = require("./sizing_tools");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const mdi = (0, _markdownIt.default)({
  html: true
});
mdi.use(_markdownItLatex.default);
let icon_dict = exports.icon_dict = {
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
  let {
    item,
    handleClick,
    modifiers
  } = _ref;
  let display_text = "display_text" in item ? item.display_text : item.text;
  let the_icon = "icon" in item ? item.icon : null;
  if (item.isgroup) {
    return /*#__PURE__*/_react.default.createElement(_core.MenuDivider, {
      className: "tile-form-menu-item",
      title: display_text
    });
  } else {
    return /*#__PURE__*/_react.default.createElement(_core.MenuItem, {
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
  item: _propTypes.default.object,
  modifiers: _propTypes.default.object,
  handleClick: _propTypes.default.func
};
function renderSuggestionAdvanced(item, _ref2) {
  let {
    modifiers,
    handleClick,
    index
  } = _ref2;
  return /*#__PURE__*/_react.default.createElement(SuggestionItemAdvanced, {
    item: item,
    key: index,
    modifiers: modifiers,
    handleClick: handleClick
  });
}
function BpSelectAdvanced(_ref3) {
  let {
    options,
    value,
    onChange,
    buttonIcon,
    readOnly
  } = _ref3;
  function _filterSuggestion(query, item) {
    if (query.length === 0) {
      return true;
    }
    let re = new RegExp(query.toLowerCase());
    let the_text;
    if (typeof item == "object") {
      the_text = item["text"];
    } else {
      the_text = item;
    }
    return re.test(the_text.toLowerCase());
  }
  let display_text = "display_text" in value ? value.display_text : value.text;
  return /*#__PURE__*/_react.default.createElement(_select.Select, {
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
  }, /*#__PURE__*/_react.default.createElement(_core.Button, {
    text: display_text,
    className: "button-in-select",
    icon: buttonIcon
  }));
}
exports.BpSelectAdvanced = BpSelectAdvanced = /*#__PURE__*/(0, _react.memo)(BpSelectAdvanced);
BpSelectAdvanced.propTypes = {
  options: _propTypes.default.array,
  onChange: _propTypes.default.func,
  value: _propTypes.default.object,
  buttonIcon: _propTypes.default.string
};
BpSelectAdvanced.defaultProps = {
  buttonIcon: null
};
function BpSelect(props) {
  function _filterSuggestion(query, item) {
    if (query.length === 0 || item["isgroup"]) {
      return true;
    }
    let re = new RegExp(query.toLowerCase());
    let the_text;
    if (typeof item == "object") {
      the_text = item["text"];
    } else {
      the_text = item;
    }
    return re.test(the_text.toLowerCase());
  }
  function _getActiveItem(val) {
    for (let option of props.options) {
      if (_lodash.default.isEqual(option, val)) {
        return option;
      }
    }
    return null;
  }
  return /*#__PURE__*/_react.default.createElement(_select.Select, {
    activeItem: _getActiveItem(props.value),
    className: "tile-form-menu-item",
    filterable: props.filterable,
    itemRenderer: renderSuggestion,
    itemPredicate: _filterSuggestion,
    items: _lodash.default.cloneDeep(props.options),
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
  }, /*#__PURE__*/_react.default.createElement(_core.Button, {
    className: "button-in-select",
    style: props.buttonStyle,
    small: props.small,
    text: props.buttonTextObject ? props.buttonTextObject : props.value,
    icon: props.buttonIcon
  }));
}
exports.BpSelect = BpSelect = /*#__PURE__*/(0, _react.memo)(BpSelect, (prevProps, newProps) => {
  (0, _utilities_react.propsAreEqual)(newProps, prevProps, ["buttonTextObject"]);
});
BpSelect.propTypes = {
  options: _propTypes.default.array,
  onChange: _propTypes.default.func,
  filterable: _propTypes.default.bool,
  small: _propTypes.default.bool,
  value: _propTypes.default.string,
  buttonTextObject: _propTypes.default.object,
  buttonIcon: _propTypes.default.string,
  buttonStyle: _propTypes.default.object,
  popoverPosition: _propTypes.default.string
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
  let {
    item,
    modifiers,
    handleClick
  } = _ref4;
  let the_text;
  let the_icon;
  if (typeof item == "object") {
    the_text = item["text"];
    the_icon = item["icon"];
  } else {
    the_text = item;
    the_icon = null;
  }
  return /*#__PURE__*/_react.default.createElement(_core.MenuItem, {
    className: "tile-form-menu-item",
    text: the_text,
    icon: the_icon,
    active: modifiers.active,
    onClick: () => handleClick(the_text),
    shouldDismissPopover: true
  });
}
SuggestionItem = /*#__PURE__*/(0, _react.memo)(SuggestionItem);
SuggestionItem.propTypes = {
  item: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.object]),
  modifiers: _propTypes.default.object,
  handleClick: _propTypes.default.func
};
function renderSuggestion(item, _ref5) {
  let {
    modifiers,
    handleClick,
    index
  } = _ref5;
  return /*#__PURE__*/_react.default.createElement(SuggestionItem, {
    item: item,
    key: index,
    modifiers: modifiers,
    handleClick: handleClick
  });
}
const renderCreateNewTag = (query, active, handleClick) => {
  let hclick = handleClick;
  return /*#__PURE__*/_react.default.createElement(_core.MenuItem, {
    icon: "add",
    key: "create_item",
    text: `Create "${query}"`,
    active: active,
    onClick: handleClick,
    shouldDismissPopover: false
  });
};
function NativeTags(props) {
  const [query, setQuery] = (0, _react.useState)("");
  function renderTag(item) {
    return item;
  }
  function _createItemFromQuery(name) {
    return name;
  }
  function _handleDelete(tag, i) {
    let new_tlist = [...props.tags];
    new_tlist.splice(i, 1);
    props.handleChange(new_tlist);
  }
  function _handleAddition(tag) {
    let new_tlist = [...props.tags];
    new_tlist.push(tag);
    props.handleChange(new_tlist);
  }
  function _filterSuggestion(query, item) {
    if (query.length === 0) {
      return false;
    }
    let re = new RegExp(`^${query}`);
    return re.test(item);
  }
  if (props.readOnly) {
    return /*#__PURE__*/_react.default.createElement(_core.TagInput, {
      values: props.tags,
      disabled: true
    });
  }
  return /*#__PURE__*/_react.default.createElement(_select.MultiSelect, {
    allowCreate: true,
    openOnKeyDown: true,
    createNewItemFromQuery: _createItemFromQuery,
    createNewItemRenderer: renderCreateNewTag,
    resetOnSelect: true,
    itemRenderer: renderSuggestion,
    selectedItems: props.tags,
    allowNew: true,
    items: props.all_tags,
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
  tags: _propTypes.default.array,
  handleChange: _propTypes.default.func,
  pane_type: _propTypes.default.string,
  readOnly: _propTypes.default.bool
};
function NotesField(props) {
  const [mdHeight, setMdHeight] = (0, _react.useState)(500);
  const [showMarkdown, setShowMarkdown] = (0, _react.useState)(() => {
    return hasOnlyWhitespace() ? false : props.show_markdown_initial;
  });
  const awaitingFocus = (0, _react.useRef)(false);
  var mdRef = (0, _react.useRef)(null);
  var notesRef = (0, _react.useRef)(null);
  (0, _react.useEffect)(() => {
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
  let really_show_markdown = hasOnlyWhitespace() ? false : showMarkdown;
  let notes_style = {
    display: really_show_markdown ? "none" : "block",
    fontSize: 13,
    resize: "both"
  };
  let md_style = {
    display: really_show_markdown ? "block" : "none",
    maxHeight: mdHeight,
    fontSize: 13
  };
  var converted_markdown;
  if (really_show_markdown) {
    converted_markdown = mdi.render(props.notes);
  }
  let converted_dict = {
    __html: converted_markdown
  };
  return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(_core.TextArea, {
    rows: "20",
    cols: "75",
    inputRef: _notesRefHandler,
    growVertically: false,
    onBlur: _handleMyBlur,
    onChange: props.handleChange,
    value: props.notes,
    disabled: props.readOnly,
    style: notes_style
  }), /*#__PURE__*/_react.default.createElement("div", {
    ref: mdRef,
    style: md_style,
    onClick: _hideMarkdown,
    className: "notes-field-markdown-output",
    dangerouslySetInnerHTML: converted_dict
  }));
}
exports.NotesField = NotesField = /*#__PURE__*/(0, _react.memo)(NotesField);
NotesField.propTypes = {
  readOnly: _propTypes.default.bool,
  notes: _propTypes.default.string,
  handleChange: _propTypes.default.func,
  show_markdown_initial: _propTypes.default.bool,
  handleBlur: _propTypes.default.func
};
NotesField.defaultProps = {
  handleBlur: null
};
const icon_list = ["application", "code", "timeline-line-chart", "heatmap", "graph", "heat-grid", "chart", "pie-chart", "regression-chart", "grid", "numerical", "font", "array", "array-numeric", "array-string", "data-lineage", "function", "variable", "build", "group-objects", "ungroup-objects", "inner-join", "filter", "sort-asc", "sort-alphabetical", "sort-numerical", "random", "layout", "layout-auto", "layout-balloon", "changes", "comparison", "exchange", "derive_column", "list-columns", "delta", "edit", "fork", "numbered-list", "path-search", "search", "plus", "repeat", "reset", "resolve", "widget-button", "star", "time", "settings", "properties", "cog", "key-command", "ip-address", "download", "cloud", "globe", "tag", "label", "history", "predictive-analysis", "calculator", "pulse", "warning-sign", "cube", "wrench"];
var icon_dlist = [];
var icon_entry_dict = {};
const cat_order = ['data', 'action', 'table', 'interface', 'editor', 'file', 'media', 'miscellaneous'];
for (let category of cat_order) {
  var cat_entry = {
    text: category,
    display_text: category,
    isgroup: true
  };
  icon_dlist.push(cat_entry);
  for (let entry of _icon_info.tile_icon_dict[category]) {
    let new_entry = {
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
}
function IconSelector(_ref6) {
  let {
    handleSelectChange,
    icon_val,
    readOnly
  } = _ref6;
  return /*#__PURE__*/_react.default.createElement(BpSelectAdvanced, {
    options: icon_dlist,
    onChange: item => {
      handleSelectChange(item.val);
    },
    readOnly: readOnly,
    buttonIcon: icon_val,
    value: icon_entry_dict[icon_val]
  });
}
IconSelector = /*#__PURE__*/(0, _react.memo)(IconSelector);
IconSelector.propTypes = {
  handleSelectChange: _propTypes.default.func,
  icon_val: _propTypes.default.string
};
function CombinedMetadata(props) {
  const top_ref = (0, _react.useRef)();
  const [auxIsOpen, setAuxIsOpen] = (0, _react.useState)(false);
  const [tempNotes, setTempNotes] = (0, _react.useState)(null);
  const [waiting, doUpdate] = (0, _utilities_react.useDebounce)(newval => {
    props.handleChange({
      "notes": newval
    });
  });
  const [usable_width, usable_height, topX, topY] = (0, _sizing_tools.useSize)(top_ref, props.tabSelectCounter, "CombinedMetadata");
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
  let addition_field_style = {
    fontSize: 14
  };
  let additional_items;
  let current_notes;
  if (props.useNotes) {
    current_notes = waiting.current ? tempNotes : props.notes;
  }
  if (props.additional_metadata != null) {
    additional_items = [];
    for (let field in props.additional_metadata) {
      let md = props.additional_metadata[field];
      if (Array.isArray(md)) {
        md = md.join(", ");
      } else if (field == "collection_name") {
        let sresult = /\.\w*$/.exec(md);
        if (sresult != null) md = sresult[0].slice(1);
      }
      additional_items.push( /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
        label: field + ": ",
        className: "metadata-form_group",
        key: field,
        inline: true
      }, /*#__PURE__*/_react.default.createElement("span", {
        className: "bp5-ui-text metadata-field"
      }, String(md))));
    }
  }
  let button_base = auxIsOpen ? "Hide" : "Show";
  let ostyle = props.outer_style ? _lodash.default.cloneDeep(props.outer_style) : {};
  if (props.expandWidth) {
    ostyle["width"] = "100%";
  } else {
    ostyle["width"] = usable_width;
  }
  return /*#__PURE__*/_react.default.createElement(_core.Card, {
    ref: top_ref,
    elevation: props.elevation,
    className: "combined-metadata accent-bg",
    style: ostyle
  }, props.name != null && /*#__PURE__*/_react.default.createElement(_core.H4, null, /*#__PURE__*/_react.default.createElement(_core.Icon, {
    icon: icon_dict[props.res_type],
    style: {
      marginRight: 6,
      marginBottom: 2
    }
  }), props.name), props.useTags && /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
    label: "Tags"
  }, /*#__PURE__*/_react.default.createElement(NativeTags, {
    tags: props.tags,
    all_tags: props.all_tags,
    readOnly: props.readOnly,
    handleChange: _handleTagsChange,
    pane_type: props.pane_type
  })), props.category != null && /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
    label: "Category"
  }, /*#__PURE__*/_react.default.createElement(_core.InputGroup, {
    onChange: _handleCategoryChange,
    value: props.category
  })), props.icon != null && /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
    label: "Icon"
  }, /*#__PURE__*/_react.default.createElement(IconSelector, {
    icon_val: props.icon,
    readOnly: props.readOnly,
    handleSelectChange: _handleIconChange
  })), props.useNotes && /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
    label: "Notes"
  }, /*#__PURE__*/_react.default.createElement(NotesField, {
    notes: current_notes,
    readOnly: props.readOnly,
    handleChange: _handleNotesChange,
    show_markdown_initial: true,
    handleBlur: props.handleNotesBlur
  }), props.notes_buttons && props.notes_buttons()), /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
    label: "Created: ",
    className: "metadata-form_group",
    inline: true
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "bp5-ui-text metadata-field"
  }, props.created)), props.updated != null && /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
    label: "Updated: ",
    className: "metadata-form_group",
    inline: true
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "bp5-ui-text metadata-field"
  }, props.updated)), props.additional_metadata != null && additional_items, props.aux_pane != null && /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
    className: "d-flex flex-row justify-content-around",
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/_react.default.createElement(_core.Button, {
    fill: false,
    small: true,
    minimal: false,
    onClick: _toggleAuxVisibility
  }, button_base + " " + props.aux_pane_title)), /*#__PURE__*/_react.default.createElement(_core.Collapse, {
    isOpen: auxIsOpen,
    keepChildrenMounted: true
  }, props.aux_pane)), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      height: 100
    }
  }));
}
exports.CombinedMetadata = CombinedMetadata = /*#__PURE__*/(0, _react.memo)(CombinedMetadata);
CombinedMetadata.propTypes = {
  useTags: _propTypes.default.bool,
  outer_style: _propTypes.default.object,
  readOnly: _propTypes.default.bool,
  elevation: _propTypes.default.number,
  res_type: _propTypes.default.string,
  pane_type: _propTypes.default.string,
  name: _propTypes.default.string,
  created: _propTypes.default.string,
  updated: _propTypes.default.string,
  tags: _propTypes.default.array,
  notes: _propTypes.default.string,
  category: _propTypes.default.string,
  icon: _propTypes.default.string,
  handleChange: _propTypes.default.func,
  handleNotesBlur: _propTypes.default.func,
  additional_metadata: _propTypes.default.object,
  aux_pane: _propTypes.default.object,
  aux_pane_title: _propTypes.default.string,
  notes_buttons: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.func])
};
CombinedMetadata.defaultProps = {
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
  name: null,
  updated: null,
  additional_metadata: null,
  aux_pane: null,
  notes_buttons: null
};
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
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
_core2.default.registerLanguage('javascript', _javascript.default);
_core2.default.registerLanguage('python', _python.default);
const mdi = (0, _markdownIt.default)({
  html: true,
  highlight: function (str, lang) {
    if (lang && _core2.default.getLanguage(lang)) {
      try {
        return '<pre><code class="hljs">' + _core2.default.highlight(str, {
          language: lang,
          ignoreIllegals: true
        }).value + '</code></pre>';
      } catch (__) {}
    }
    return '<pre><code class="hljs">' + mdi.utils.escapeHtml(str) + '</code></pre>';
  }
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
    buttonIcon = null,
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
  function _getActiveItem(val) {
    for (let option of options) {
      if (_lodash.default.isEqual(option, val)) {
        return option;
      }
    }
    return null;
  }
  let display_text = "display_text" in value ? value.display_text : value.text;
  return /*#__PURE__*/_react.default.createElement(_error_boundary.ErrorBoundary, null, /*#__PURE__*/_react.default.createElement(_select.Select, {
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
  }, /*#__PURE__*/_react.default.createElement(_core.Button, {
    text: display_text,
    className: "button-in-select",
    icon: buttonIcon
  })));
}
exports.BpSelectAdvanced = BpSelectAdvanced = /*#__PURE__*/(0, _react.memo)(BpSelectAdvanced);
function BpSelect(props) {
  props = {
    buttonIcon: null,
    buttonStyle: {},
    popoverPosition: _core.PopoverPosition.BOTTOM_LEFT,
    buttonTextObject: null,
    filterable: true,
    small: undefined,
    ...props
  };
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
function NotesField(props) {
  props = {
    handleBlur: null,
    ...props
  };
  const setFocusFunc = (0, _react.useRef)(null);
  const settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  (0, _react.useEffect)(() => {}, [props.mStateRef.current.notes]);
  (0, _react.useEffect)(() => {
    // console.log("theme changed")  // This is to force re-rendering because of highlight.js theme change
  }, [settingsContext.settings.theme]);
  const [mdHeight, setMdHeight] = (0, _react.useState)(500);
  const [showMarkdown, setShowMarkdown] = (0, _react.useState)(hasOnlyWhitespace() ? false : props.show_markdown_initial);
  const awaitingFocus = (0, _react.useRef)(false);
  const cmObject = (0, _react.useRef)(null);
  var mdRef = (0, _react.useRef)(null);
  (0, _react.useEffect)(() => {
    if (awaitingFocus.current) {
      focusNotes();
      awaitingFocus.current = false;
    }
    if (cmObject.current && !cmObject.current.hasFocus) {
      setShowMarkdown(!hasOnlyWhitespace());
    }
  });
  (0, _react.useEffect)(() => {
    setShowMarkdown(!hasOnlyWhitespace());
  }, [props.res_name, props.res_type]);
  function hasOnlyWhitespace() {
    return !props.mStateRef.current.notes || !props.mStateRef.current.notes.trim().length;
  }
  function getMarkdownField() {
    return mdRef.current;
  }
  function focusNotes() {
    setFocusFunc.current();
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
  const registerSetFocusFunc = (0, _react.useCallback)(theFunc => {
    setFocusFunc.current = theFunc;
  }, []);
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
    converted_markdown = mdi.render(props.mStateRef.current.notes);
  }
  let converted_dict = {
    __html: converted_markdown
  };
  return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, !really_show_markdown && /*#__PURE__*/_react.default.createElement(_reactCodemirror.ReactCodemirror6, {
    handleChange: props.handleChange,
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
  }), /*#__PURE__*/_react.default.createElement("div", {
    ref: mdRef,
    style: md_style,
    onClick: _hideMarkdown,
    className: "notes-field-markdown-output markdown-heading-sizes",
    dangerouslySetInnerHTML: converted_dict
  }));
}
exports.NotesField = NotesField = /*#__PURE__*/(0, _react.memo)(NotesField);
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
  let value = icon_entry_dict[icon_val] ? icon_entry_dict[icon_val] : icon_entry_dict["application"];
  return /*#__PURE__*/_react.default.createElement(_error_boundary.ErrorBoundary, null, /*#__PURE__*/_react.default.createElement(BpSelectAdvanced, {
    options: icon_dlist,
    onChange: item => {
      handleSelectChange(item.val);
    },
    readOnly: readOnly,
    buttonIcon: icon_val,
    value: value
  }));
}
IconSelector = /*#__PURE__*/(0, _react.memo)(IconSelector);
const primary_mdata_fields = ["name", "created", "updated", "tags", "notes"];
const ignore_fields = ["doc_type", "res_type"];
const initial_state = {
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
      for (let field in action.value) {
        draft[field] = action.value[field];
      }
      break;
    default:
      break;
  }
}
function CombinedMetadata(props) {
  props = {
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
    ...props
  };
  const top_ref = (0, _react.useRef)();
  const [mState, mDispatch, mStateRef] = (0, _utilities_react.useImmerReducerAndRef)(metadataReducer, initial_state);
  const pushCallback = (0, _utilities_react.useCallbackStack)();
  const updatedIdRef = (0, _react.useRef)(null);
  const [waiting, doUpdate] = (0, _utilities_react.useDebounce)(state_stuff => {
    postChanges(state_stuff).then(() => {});
  });
  const [usable_width, usable_height, topX, topY] = (0, _sizing_tools.useSize)(top_ref, props.tabSelectCounter, "CombinedMetadata");
  (0, _react.useEffect)(() => {
    if (props.tsocket != null && !props.is_repository && !props.useFixedData) {
      function handleExternalUpdate(data) {
        if (data.res_type == props.res_type && data.res_name == props.res_name && data.mdata_uid != updatedIdRef.current) {
          grabMetadata();
        }
      }
      props.tsocket.attachListener("resource-updated", handleExternalUpdate);
      return () => {
        props.tsocket.detachListener("resource-updated");
      };
    }
  }, [props.tsocket, props.res_name, props.res_type]);
  (0, _react.useEffect)(() => {
    grabMetadata();
  }, [props.res_name, props.res_type]);
  function grabMetadata() {
    if (props.useFixedData || props.res_name == null || props.res_type == null) return;
    if (!props.readOnly) {
      let data_dict = {
        pane_type: props.res_type,
        is_repository: false,
        show_hidden: true
      };
      (0, _communication_react.postAjaxPromise)("get_tag_list", data_dict).then(data => {
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
    }).then(data => {
      let updater = {
        "tags": data.tags,
        "notes": data.notes,
        "created": data.datestring,
        "updated": data.additional_mdata.updated
      };
      let amdata = data.additional_mdata;
      delete amdata.updated;
      if (data.additional_mdata.icon) {
        updater["icon"] = data.additional_mdata.icon;
      }
      if (data.additional_mdata.category) {
        updater["category"] = data.additional_mdata.category;
        delete amdata.category;
      } else if (props.res_type == "tile") {
        updater["category"] = "basic";
      }
      updater["additionalMdata"] = amdata;
      mDispatch({
        type: "multi_update",
        value: updater
      });
    }).catch(e => {
      console.log("error getting metadata", e);
    });
  }
  async function postChanges(state_stuff) {
    const result_dict = {
      "res_type": props.res_type,
      "res_name": props.res_name,
      "tags": "tags" in state_stuff ? state_stuff["tags"] : mStateRef.current.tags,
      "notes": "notes" in state_stuff ? state_stuff["notes"] : mStateRef.current.notes,
      "icon": "icon" in state_stuff ? state_stuff["icon"] : mStateRef.current.icon,
      "category": "category" in state_stuff ? state_stuff["category"] : mStateRef.current.category,
      "mdata_uid": (0, _utilities_react.guid)()
    };
    try {
      await (0, _communication_react.postAjaxPromise)("save_metadata", result_dict);
      updatedIdRef.current = result_dict["mdata_uid"];
    } catch (e) {
      console.log("error saving metadata ", e);
    }
  }
  async function _handleMetadataChange(state_stuff) {
    let post_immediate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    mDispatch({
      type: "multi_update",
      "value": state_stuff
    });
    if (post_immediate) {
      await postChanges(state_stuff);
    } else {
      doUpdate(state_stuff);
    }
  }
  async function appendToNotes(text) {
    mDispatch({
      type: "append_to_notes",
      "value": text
    });
    pushCallback(async () => {
      await postChanges({
        "notes": mStateRef.current.notes
      });
    });
  }
  async function _handleNotesChange(new_text) {
    await _handleMetadataChange({
      "notes": new_text
    }, false);
  }
  async function _handleTagsChange(tag_list) {
    await _handleMetadataChange({
      "tags": tag_list.join(" ")
    });
  }
  async function _handleCategoryChange(event) {
    await _handleMetadataChange({
      "category": event.target.value
    });
  }
  async function _handleIconChange(icon) {
    await _handleMetadataChange({
      "icon": icon
    });
  }
  let addition_field_style = {
    fontSize: 14
  };
  let additional_items;
  if (props.useFixedData) {
    additional_items = [];
    for (let field in props.fixedData) {
      let md = props.fixedData[field];
      additional_items.push( /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
        label: field + ": ",
        className: "metadata-form_group",
        key: field,
        inline: true
      }, /*#__PURE__*/_react.default.createElement("span", {
        className: "bp5-ui-text metadata-field"
      }, String(md))));
    }
  } else if (mStateRef.current.additionalMdata != null) {
    additional_items = [];
    for (let field in mStateRef.current.additionalMdata) {
      let md = mStateRef.current.additionalMdata[field];
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
  let ostyle = props.outer_style ? _lodash.default.cloneDeep(props.outer_style) : {};
  if (props.expandWidth) {
    ostyle["width"] = "100%";
  } else {
    ostyle["width"] = usable_width;
  }
  let split_tags = !mStateRef.current.tags || mStateRef.current.tags == "" ? [] : mStateRef.current.tags.split(" ");
  const MetadataNotesButtons = props.notes_buttons;
  return /*#__PURE__*/_react.default.createElement(_error_boundary.ErrorBoundary, null, /*#__PURE__*/_react.default.createElement(_core.Card, {
    ref: top_ref,
    elevation: props.elevation,
    className: "combined-metadata accent-bg",
    style: ostyle
  }, props.res_name != null && /*#__PURE__*/_react.default.createElement(_core.H4, null, /*#__PURE__*/_react.default.createElement(_core.Icon, {
    icon: icon_dict[props.res_type],
    style: {
      marginRight: 6,
      marginBottom: 2
    }
  }), props.res_name), !props.useFixedData && props.useTags && mStateRef.current.tags != null && mStateRef.current.allTags.length > 0 && /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
    label: "Tags"
  }, /*#__PURE__*/_react.default.createElement(NativeTags, {
    key: `${props.res_name}-${props.res_type}-tags`,
    tags: split_tags,
    all_tags: mStateRef.current.allTags,
    readOnly: props.readOnly,
    handleChange: _handleTagsChange,
    res_type: props.res_type
  })), !props.useFixedData && mStateRef.current.category != null && /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
    label: "Category",
    key: `${props.res_name}-${props.res_type}-cagegory`
  }, /*#__PURE__*/_react.default.createElement(_core.InputGroup, {
    onChange: _handleCategoryChange,
    value: mStateRef.current.category
  })), mStateRef.current.icon != null && /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
    label: "Icon"
  }, /*#__PURE__*/_react.default.createElement(IconSelector, {
    key: `${props.res_name}-${props.res_type}-icon-selector`,
    icon_val: mStateRef.current.icon,
    readOnly: props.readOnly,
    handleSelectChange: _handleIconChange
  })), !props.useFixedData && props.useNotes && mStateRef.current.notes != null && /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
    label: "Notes"
  }, /*#__PURE__*/_react.default.createElement(NotesField, {
    key: `${props.res_name}-${props.res_type}-notes`,
    mStateRef: mStateRef,
    res_name: props.res_name,
    res_type: props.res_type,
    readOnly: props.readOnly,
    handleChange: _handleNotesChange,
    show_markdown_initial: true,
    handleBlur: props.handleNotesBlur
  }), props.notes_buttons && /*#__PURE__*/_react.default.createElement(MetadataNotesButtons, {
    appendToNotes: appendToNotes
  })), mStateRef.current.created != null && /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
    label: "Created: ",
    className: "metadata-form_group",
    inline: true
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "bp5-ui-text metadata-field"
  }, mStateRef.current.created)), mStateRef.current.updated != null && /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
    label: "Updated: ",
    className: "metadata-form_group",
    inline: true
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "bp5-ui-text metadata-field"
  }, mStateRef.current.updated)), additional_items && additional_items.length > 0 && additional_items, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      height: 100
    }
  })));
}
exports.CombinedMetadata = CombinedMetadata = /*#__PURE__*/(0, _react.memo)(CombinedMetadata);
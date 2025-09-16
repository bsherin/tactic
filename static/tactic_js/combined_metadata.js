"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CombinedMetadata = CombinedMetadata;
exports.IconSelector = IconSelector;
exports.NativeTags = NativeTags;
exports.NotesField = NotesField;
exports.icon_dict = void 0;
var _react = _interopRequireWildcard(require("react"));
var _core = require("@blueprintjs/core");
var _select = require("@blueprintjs/select");
var _settings = require("./settings");
var _metadata_reducer = require("./metadata_reducer");
var _selector_advanced = require("./selector_advanced");
var _core2 = _interopRequireDefault(require("highlight.js/lib/core"));
var _javascript = _interopRequireDefault(require("highlight.js/lib/languages/javascript"));
var _python = _interopRequireDefault(require("highlight.js/lib/languages/python"));
var _markdownIt = _interopRequireDefault(require("markdown-it"));
require("markdown-it-latex/dist/index.css");
var _markdownItLatex = _interopRequireDefault(require("markdown-it-latex"));
var _lodash = _interopRequireDefault(require("lodash"));
var _utilities_react = require("./utilities_react");
var _icon_info = require("./icon_info");
var _error_boundary = require("./error_boundary");
var _communication_react = require("./communication_react");
var _reactCodemirror = require("./react-codemirror6");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
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
const renderCreateNewTag = (query, active, handleClick) => {
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
  props = {
    all_tags: [],
    ...props
  };
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
    itemRenderer: _selector_advanced.renderSuggestion,
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
  props = {
    handleBlur: null,
    setCMObject: null,
    handleChange: null,
    ...props
  };
  const setFocusFunc = (0, _react.useRef)(null);
  const settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  (0, _react.useEffect)(() => {}, [props.mStateRef.current.notes]);
  (0, _react.useEffect)(() => {
    // console.log("theme changed")  // This is to force re-rendering because of highlight.js theme change
  }, [settingsContext.settings.theme]);
  const [mdHeight] = (0, _react.useState)(500);
  const [showMarkdown, setShowMarkdown] = (0, _react.useState)(hasOnlyWhitespace() ? false : props.show_markdown_initial);
  const awaitingFocus = (0, _react.useRef)(false);
  const cmObject = (0, _react.useRef)(null);
  const mdRef = (0, _react.useRef)(null);
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
    return () => {
      if (cmObject.current) {
        cmObject.current.destroy();
        cmObject.current = null;
      }
      setFocusFunc.current = null;
    };
  }, []);
  (0, _react.useEffect)(() => {
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
    if (props.setCMObject) {
      props.setCMObject(cmobject);
    } else {
      cmObject.current = cmobject;
    }
  }
  const registerSetFocusFunc = (0, _react.useCallback)(theFunc => {
    setFocusFunc.current = theFunc;
  }, []);
  let really_show_markdown = hasOnlyWhitespace() ? false : showMarkdown;
  let md_style = {
    display: really_show_markdown ? "block" : "none",
    maxHeight: mdHeight,
    fontSize: 13
  };
  let converted_markdown;
  if (really_show_markdown) {
    converted_markdown = mdi.render(props.mStateRef.current.notes);
  }
  let converted_dict = {
    __html: converted_markdown
  };
  return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: really_show_markdown ? "none" : "block"
    }
  }, /*#__PURE__*/_react.default.createElement(_reactCodemirror.ReactCodemirror6, {
    handleChange: props.handleChange,
    className: "notes-field",
    readOnly: props.readOnly,
    setCMObject: _setCmObject,
    handleBlur: _handleMyBlur,
    registerSetFocusFunc: registerSetFocusFunc,
    show_line_numbers: false,
    controlled: true,
    mode: "markdown",
    code_content: props.mStateRef.current.notes,
    no_height: true,
    no_width: true,
    saveMe: null
  })), /*#__PURE__*/_react.default.createElement("div", {
    ref: mdRef,
    style: md_style,
    onClick: _hideMarkdown,
    className: "notes-field-markdown-output markdown-heading-sizes",
    dangerouslySetInnerHTML: converted_dict
  }));
}
exports.NotesField = NotesField = /*#__PURE__*/(0, _react.memo)(NotesField);
let icon_dlist = [];
let icon_entry_dict = {};
const cat_order = ['data', 'action', 'table', 'interface', 'editor', 'file', 'media', 'miscellaneous'];
for (let category of cat_order) {
  let cat_entry = {
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
function IconSelector({
  handleSelectChange,
  icon_val,
  readOnly
}) {
  let value = icon_entry_dict[icon_val] ? icon_entry_dict[icon_val] : icon_entry_dict["application"];
  return /*#__PURE__*/_react.default.createElement(_error_boundary.ErrorBoundary, null, /*#__PURE__*/_react.default.createElement(_selector_advanced.BpSelectAdvanced, {
    options: icon_dlist,
    onChange: item => {
      handleSelectChange(item.val);
    },
    readOnly: readOnly,
    buttonIcon: icon_val,
    value: value
  }));
}
exports.IconSelector = IconSelector = /*#__PURE__*/(0, _react.memo)(IconSelector);
const ignore_fields = ["doc_type", "res_type"];
const initial_state = {
  allTags: [],
  tags: null,
  created: null,
  updated: null,
  notes: null,
  icon: null,
  category: null,
  additional_metadata: null,
  search_context: null
};
function CombinedMetadata(props) {
  props = {
    expandWidth: true,
    tabSelectCounter: 0,
    useTags: true,
    useNotes: true,
    outer_style: null,
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
    alt_category: null,
    setCMObject: null,
    search_string: "",
    search_inside: false,
    ...props
  };
  const top_ref = (0, _react.useRef)();
  const listenderAttachedRef = (0, _react.useRef)(false);
  const [, mDispatch, mStateRef] = (0, _utilities_react.useImmerReducerAndRef)(_metadata_reducer.metadataReducer, initial_state);
  const pushCallback = (0, _utilities_react.useCallbackStack)();
  const updatedIdRef = (0, _react.useRef)(null);
  const [, doUpdate] = (0, _utilities_react.useDebounce)(state_stuff => {
    postChanges(state_stuff).then(() => {});
  });
  const latestPropsRef = (0, _react.useRef)(props);
  (0, _react.useEffect)(() => {
    latestPropsRef.current = props;
  }, [props]);
  (0, _react.useEffect)(() => {
    if (props.tsocket) {
      props.tsocket.attachListener("resource-updated", handleExternalUpdate);
      listenderAttachedRef.current = true;
    }
    return () => {
      if (props.tsocket) {
        props.tsocket.detachListener("resource-updated");
      }
    };
  }, []);
  (0, _react.useEffect)(() => {
    if (props.tsocket && !listenderAttachedRef.current) {
      props.tsocket.attachListener("resource-updated", handleExternalUpdate);
      listenderAttachedRef.current = true;
    }
  }, [props.tsocket]);
  (0, _react.useEffect)(() => {
    grabMetadata();
  }, [props.res_name, props.res_type]);
  function handleExternalUpdate(data) {
    if (data.res_type == props.res_type && data.res_name == props.res_name && data.mdata_uid != updatedIdRef.current) {
      grabMetadata();
    }
  }
  function grabMetadata() {
    if (props.useFixedData || props.res_name == null || props.res_type == null) return;
    if (!props.readOnly) {
      let data_dict = {
        res_types: [props.res_type],
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
      search_string: props.search_string,
      search_inside: props.search_inside,
      is_repository: props.is_repository
    }).then(data => {
      let updater = {
        "tags": data.tags,
        "notes": data.notes,
        "created": data["datestring"],
        "updated": data["additional_mdata"].updated
      };
      let amdata = data["additional_mdata"];
      delete amdata.updated;
      if (data["additional_mdata"].icon) {
        updater["icon"] = data["additional_mdata"].icon;
      }
      if (props.res_type == "tile") {
        if (data["additional_mdata"].category) {
          updater["category"] = data["additional_mdata"].category;
          delete amdata.category;
        } else {
          updater["category"] = "nocat";
        }
        if (updater["category"] == "nocat" && props.alt_category) {
          updater["category"] = props.alt_category;
        }
      }
      updater["additionalMdata"] = amdata;
      updater["search_context"] = data?.search_context;
      mDispatch({
        type: "update_item",
        new_item: updater
      });
    }).catch(e => {
      console.log("error getting metadata", e);
    });
  }
  async function postChanges(state_stuff) {
    const result_dict = {
      "res_type": latestPropsRef.current.res_type,
      "res_name": latestPropsRef.current.res_name,
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
  async function _handleMetadataChange(state_stuff, post_immediate = true) {
    mDispatch({
      type: "update_item",
      "new_item": state_stuff
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
  let additional_items;
  if (props.useFixedData) {
    additional_items = [];
    for (let field in props.fixedData) {
      let md = props.fixedData[field];
      additional_items.push(/*#__PURE__*/_react.default.createElement(_core.FormGroup, {
        label: field + ": ",
        className: "metadata-form_group",
        key: field,
        inline: true
      }, /*#__PURE__*/_react.default.createElement("span", {
        className: "bp6-ui-text metadata-field"
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
      additional_items.push(/*#__PURE__*/_react.default.createElement(_core.FormGroup, {
        label: field + ": ",
        className: "metadata-form_group",
        key: field,
        inline: true
      }, /*#__PURE__*/_react.default.createElement("span", {
        className: "bp6-ui-text metadata-field"
      }, String(md))));
    }
  }
  let ostyle = props.outer_style ? _lodash.default.cloneDeep(props.outer_style) : {
    height: "100%"
  };
  ostyle["width"] = "100%";
  ostyle["overflow"] = "auto";
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
    key: "metadata-notes",
    mStateRef: mStateRef,
    currentNotes: mStateRef.current.notes,
    res_name: props.res_name,
    res_type: props.res_type,
    readOnly: props.readOnly,
    handleChange: _handleNotesChange,
    show_markdown_initial: true,
    setCMObject: props.setCMObject,
    handleBlur: props.handleNotesBlur
  }), props.notes_buttons && /*#__PURE__*/_react.default.createElement(MetadataNotesButtons, {
    appendToNotes: appendToNotes
  })), props.search_inside && mStateRef.current.search_context && /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
    label: "Search Context",
    readOnly: true
  }, /*#__PURE__*/_react.default.createElement(_core.TextArea, {
    value: mStateRef.current.search_context,
    fill: true,
    autoResize: true
  })), mStateRef.current.created != null && /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
    label: "Created: ",
    className: "metadata-form_group",
    inline: true
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "bp6-ui-text metadata-field"
  }, mStateRef.current.created)), mStateRef.current.updated != null && /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
    label: "Updated: ",
    className: "metadata-form_group",
    inline: true
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "bp6-ui-text metadata-field"
  }, mStateRef.current.updated)), additional_items && additional_items.length > 0 && additional_items, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      height: 100
    }
  })));
}
exports.CombinedMetadata = CombinedMetadata = /*#__PURE__*/(0, _react.memo)(CombinedMetadata);
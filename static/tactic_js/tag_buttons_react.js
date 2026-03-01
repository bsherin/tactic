"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TagButtonList = TagButtonList;
exports.get_all_parent_tags = get_all_parent_tags;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
var _utilities_react = require("./utilities_react");
var _settings = require("./settings");
var _modal_react = require("./modal_react");
var _library_widgets = require("./library_widgets");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function has_slash(tag_text) {
  return tag_text.search("/") != -1;
}
function get_immediate_tag_parent(the_tag) {
  var re = /\/\w*$/;
  return the_tag.replace(re, "");
}
function get_all_parent_tags(tag_list) {
  var ptags = [];
  if (tag_list != undefined) {
    var _iterator = _createForOfIteratorHelper(tag_list),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var the_tag = _step.value;
        ptags = ptags.concat(get_parent_tags(the_tag));
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
  ptags = (0, _utilities_react.remove_duplicates)(ptags);
  return ptags;
}
function get_parent_tags(the_tag) {
  if (the_tag.search("/") == -1) {
    return [];
  } else {
    var parent_tag = get_immediate_tag_parent(the_tag);
    var ptags = get_parent_tags(parent_tag);
    ptags.push(parent_tag);
    return ptags;
  }
}
function tag_to_list(the_tag) {
  return the_tag.split("/");
}
function TagMenu(props) {
  var disabled = props.tagstring == "all";
  return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
    icon: "target",
    disabled: disabled,
    onClick: function onClick() {
      props.setTagRoot(props.tagstring);
      props.setShowContextMenu(false);
    },
    text: "Focus on Tag"
  }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
    icon: "edit",
    disabled: disabled,
    onClick: function onClick() {
      props.setTagRoot("all");
      props.setShowContextMenu(false);
    },
    text: "Show All Tags"
  }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
    icon: "edit",
    disabled: disabled,
    onClick: function onClick() {
      props.rename_tag(props.tagstring);
      props.setShowContextMenu(false);
    },
    text: "Rename"
  }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
    icon: "trash",
    disabled: disabled,
    onClick: function onClick() {
      props.delete_tag(props.tagstring);
      props.setShowContextMenu(false);
    },
    text: "Delete"
  }));
}
TagMenu = /*#__PURE__*/(0, _react.memo)(TagMenu);
function TagButtonList(props) {
  var _useState = (0, _react.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    showContextMenu = _useState2[0],
    setShowContextMenu = _useState2[1];
  var _useState3 = (0, _react.useState)({
      left: 0,
      top: 0
    }),
    _useState4 = _slicedToArray(_useState3, 2),
    contextMenuTarget = _useState4[0],
    setContentMenuTarget = _useState4[1];
  var _useState5 = (0, _react.useState)(""),
    _useState6 = _slicedToArray(_useState5, 2),
    contextMenuTagString = _useState6[0],
    setContextMenuTagString = _useState6[1];
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)(""),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    setSearchString = _useStateAndRef2[1],
    searchStringRef = _useStateAndRef2[2];
  function _update_search_state(new_state) {
    setSearchString(new_state.search_string);
  }
  function _renameTagPrep(old_tag, new_tag_base) {
    var old_tag_list = tag_to_list(old_tag);
    var ot_length = old_tag_list.length;
    var tag_changes = [];
    var _iterator2 = _createForOfIteratorHelper(props.tag_list),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var atag = _step2.value;
        var atag_list = tag_to_list(atag);
        if ((0, _utilities_react.arraysMatch)(atag_list.slice(0, ot_length), old_tag_list)) {
          atag_list[ot_length - 1] = new_tag_base;
          tag_changes.push([atag, atag_list.join("/")]);
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    props.doTagRename(tag_changes);
  }
  function _newNode(name, prelist) {
    var full_list = _toConsumableArray(prelist);
    full_list.push(name);
    var tag_string = full_list.join("/");
    var base_class = "library-tree-node";
    return {
      id: tag_string,
      childNodes: [],
      label: name,
      icon: "tag",
      hasCaret: false,
      className: "".concat(base_class, " ").concat(name == "hidden" ? "hidden-tag" : ""),
      isSelected: tag_string == props.active_tag,
      isExpanded: props.expanded_tags.includes(tag_string),
      nodeData: {
        tag_string: tag_string
      }
    };
  }
  function _nodeChild(node, child_name) {
    var _iterator3 = _createForOfIteratorHelper(node.childNodes),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var c = _step3.value;
        if (c.label == child_name) {
          return c;
        }
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    return null;
  }
  function _handleNodeExpand(node) {
    if (!props.expanded_tags.includes(node.nodeData.tag_string)) {
      var expanded_tags = _toConsumableArray(props.expanded_tags);
      expanded_tags.push(node.nodeData.tag_string);
      props.updateTagState({
        "expanded_tags": expanded_tags
      });
    }
  }
  function _handleNodeShrink(node) {
    if (props.expanded_tags.includes(node.nodeData.tag_string)) {
      var expanded_tags = _toConsumableArray(props.expanded_tags);
      var index = expanded_tags.indexOf(node.nodeData.tag_string);
      if (index !== -1) expanded_tags.splice(index, 1);
      props.updateTagState({
        "expanded_tags": expanded_tags
      });
    }
  }
  function _handleNodeClick(node) {
    if (node.nodeData.tag_string == "unfocus") {
      props.updateTagState({
        tagRoot: "all"
      });
    } else {
      props.updateTagState({
        active_tag: node.nodeData.tag_string
      });
    }
  }
  function addChildren(node, tlist, prelist) {
    if (tlist.length == 0) return;
    var new_child = _newNode(tlist[0], prelist);
    node.childNodes.push(new_child);
    node.icon = "folder-close";
    node.hasCaret = true;
    var new_tlist = _toConsumableArray(tlist);
    var new_prelist = _toConsumableArray(prelist);
    var first_tag = new_tlist.shift();
    new_prelist.push(first_tag);
    addChildren(new_child, new_tlist, new_prelist);
  }
  function _digNode(node, tlist, prelist) {
    if (tlist.length == 0) return;
    var res = _nodeChild(node, tlist[0]);
    if (res == null) {
      addChildren(node, tlist, prelist);
    } else {
      var new_tlist = _toConsumableArray(tlist);
      var new_prelist = _toConsumableArray(prelist);
      var first_tag = new_tlist.shift();
      new_prelist.push(first_tag);
      tlist.shift();
      _digNode(res, new_tlist, new_prelist);
    }
  }
  function _buildTree(tag_list) {
    var cnodes = [];
    if (props.tagRoot != "all") {
      var unfocus_node = _newNode("unfocus", []);
      unfocus_node.icon = "undo";
      cnodes.push(unfocus_node);
    }
    var all_node = _newNode("all", []);
    all_node.icon = "clean";
    cnodes.push(all_node);
    var tree = {
      childNodes: cnodes
    };
    var _iterator4 = _createForOfIteratorHelper(tag_list),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var tag = _step4.value;
        var _tlist = tag_to_list(tag);
        _digNode(tree, _tlist, [], true);
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
    return tree.childNodes;
  }
  function get_tag_base(tagstring) {
    if (!has_slash(tagstring)) {
      return tagstring;
    } else {
      var re = /\/\w*$/;
      return re.exec(tagstring)[0].slice(1);
    }
  }
  function _rename_tag(tagstring) {
    var self = this;
    var tag_base = get_tag_base(tagstring);
    dialogFuncs.showModal("ModalDialog", {
      title: "Rename tag \"".concat(tag_base),
      field_title: "New name for this tag",
      handleSubmit: RenameTag,
      default_value: tag_base,
      existing_names: [],
      checkboxes: [],
      handleCancel: null,
      handleClose: dialogFuncs.hideModal
    });
    function RenameTag(new_tag_base) {
      _renameTagPrep(tagstring, new_tag_base);
    }
  }
  function setTagRoot(tagstring) {
    props.updateTagState({
      "tagRoot": tagstring
    });
  }
  function _delete_tag(tagstring) {
    var confirm_text = "Are you sure that you want to delete the tag \"".concat(tagstring, "\" for this resource type?");
    var self = this;
    dialogFuncs.showModal("ConfirmDialog", {
      title: "Delete tag \"".concat(tagstring, "\""),
      text_body: confirm_text,
      cancel_text: "do nothing",
      submit_text: "delete",
      handleSubmit: function handleSubmit() {
        props.doTagDelete(tagstring);
      },
      handleClose: dialogFuncs.hideModal,
      handleCancel: null
    });
  }
  function _showContextMenu(node, nodepath, e) {
    e.preventDefault();
    setShowContextMenu(true);
    setContextMenuTagString(node.nodeData.tag_string);
    setContentMenuTarget({
      left: e.clientX,
      top: e.clientY
    });
  }
  function filterItem(item) {
    return searchStringRef.current == null || searchStringRef.current === "" || item.toLowerCase().includes(searchStringRef.current.toLowerCase());
  }
  var tlist = props.tag_list == undefined ? [] : props.tag_list;
  var parent_tags = get_all_parent_tags(tlist);
  var tag_list = _toConsumableArray(tlist);
  tag_list = tag_list.concat(parent_tags);
  tag_list = (0, _utilities_react.remove_duplicates)(tag_list);
  if (props.tagRoot != "all") {
    tag_list = tag_list.filter(function (x) {
      return x.startsWith(props.tagRoot);
    });
  }
  tag_list = tag_list.filter(filterItem);
  tag_list.sort();
  var tree = _buildTree(tag_list);
  var tmenu = /*#__PURE__*/_react["default"].createElement(TagMenu, {
    tagstring: contextMenuTagString,
    setShowContextMenu: setShowContextMenu,
    delete_tag: _delete_tag,
    setTagRoot: setTagRoot,
    rename_tag: _rename_tag
  });
  return /*#__PURE__*/_react["default"].createElement("div", {
    tabIndex: "0",
    className: "tactic-tag-button-list"
  }, /*#__PURE__*/_react["default"].createElement(_library_widgets.SearchForm, {
    allow_search_inside: false,
    placeholder: "Filter tags...",
    field_width: "100%",
    marginBottom: 10,
    allow_search_metadata: false,
    update_search_state: _update_search_state,
    search_string: searchStringRef.current
  }), /*#__PURE__*/_react["default"].createElement(_core.ContextMenuPopover, {
    onClose: function onClose() {
      setShowContextMenu(false);
    } // Without this doesn't close
    ,
    content: tmenu,
    isOpen: showContextMenu,
    isDarkTheme: settingsContext.isDark(),
    targetOffset: contextMenuTarget
  }), /*#__PURE__*/_react["default"].createElement(_core.Tree, {
    contents: tree,
    onNodeContextMenu: _showContextMenu,
    onNodeClick: _handleNodeClick,
    onNodeCollapse: _handleNodeShrink,
    onNodeExpand: _handleNodeExpand
  }));
}
exports.TagButtonList = TagButtonList = /*#__PURE__*/(0, _react.memo)(TagButtonList);
TagButtonList.propTypes = {
  tag_list: _propTypes["default"].array,
  updateTagState: _propTypes["default"].func,
  doTagDelete: _propTypes["default"].func,
  doTagRename: _propTypes["default"].func
};
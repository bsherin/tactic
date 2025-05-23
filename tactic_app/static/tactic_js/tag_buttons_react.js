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
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
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
  // const [tagRoot, setTagRoot] = useState("all");

  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
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
    return {
      id: tag_string,
      childNodes: [],
      label: name,
      icon: "tag",
      hasCaret: false,
      className: name == "hidden" ? "hidden-tag" : "",
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
  }, /*#__PURE__*/_react["default"].createElement(_core.ContextMenuPopover, {
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
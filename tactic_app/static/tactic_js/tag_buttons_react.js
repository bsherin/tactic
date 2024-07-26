"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
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
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function has_slash(tag_text) {
  return tag_text.search("/") != -1;
}
function get_immediate_tag_parent(the_tag) {
  let re = /\/\w*$/;
  return the_tag.replace(re, "");
}
function get_all_parent_tags(tag_list) {
  var ptags = [];
  if (tag_list != undefined) {
    for (let the_tag of tag_list) {
      ptags = ptags.concat(get_parent_tags(the_tag));
    }
  }
  ptags = (0, _utilities_react.remove_duplicates)(ptags);
  return ptags;
}
function get_parent_tags(the_tag) {
  if (the_tag.search("/") == -1) {
    return [];
  } else {
    let parent_tag = get_immediate_tag_parent(the_tag);
    let ptags = get_parent_tags(parent_tag);
    ptags.push(parent_tag);
    return ptags;
  }
}
function tag_to_list(the_tag) {
  return the_tag.split("/");
}
function TagMenu(props) {
  let disabled = props.tagstring == "all";
  return /*#__PURE__*/_react.default.createElement(_core.Menu, null, /*#__PURE__*/_react.default.createElement(_core.MenuItem, {
    icon: "target",
    disabled: disabled,
    onClick: () => {
      props.setTagRoot(props.tagstring);
      props.setShowContextMenu(false);
    },
    text: "Focus on Tag"
  }), /*#__PURE__*/_react.default.createElement(_core.MenuItem, {
    icon: "edit",
    disabled: disabled,
    onClick: () => {
      props.setTagRoot("all");
      props.setShowContextMenu(false);
    },
    text: "Show All Tags"
  }), /*#__PURE__*/_react.default.createElement(_core.MenuItem, {
    icon: "edit",
    disabled: disabled,
    onClick: () => {
      props.rename_tag(props.tagstring);
      props.setShowContextMenu(false);
    },
    text: "Rename"
  }), /*#__PURE__*/_react.default.createElement(_core.MenuItem, {
    icon: "trash",
    disabled: disabled,
    onClick: () => {
      props.delete_tag(props.tagstring);
      props.setShowContextMenu(false);
    },
    text: "Delete"
  }));
}
TagMenu = /*#__PURE__*/(0, _react.memo)(TagMenu);
function TagButtonList(props) {
  const [showContextMenu, setShowContextMenu] = (0, _react.useState)(false);
  const [contextMenuTarget, setContentMenuTarget] = (0, _react.useState)({
    left: 0,
    top: 0
  });
  const [contextMenuTagString, setContextMenuTagString] = (0, _react.useState)("");
  // const [tagRoot, setTagRoot] = useState("all");

  const settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  const dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  function _renameTagPrep(old_tag, new_tag_base) {
    let old_tag_list = tag_to_list(old_tag);
    let ot_length = old_tag_list.length;
    let tag_changes = [];
    for (let atag of props.tag_list) {
      let atag_list = tag_to_list(atag);
      if ((0, _utilities_react.arraysMatch)(atag_list.slice(0, ot_length), old_tag_list)) {
        atag_list[ot_length - 1] = new_tag_base;
        tag_changes.push([atag, atag_list.join("/")]);
      }
    }
    props.doTagRename(tag_changes);
  }
  function _newNode(name, prelist) {
    let full_list = [...prelist];
    full_list.push(name);
    let tag_string = full_list.join("/");
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
    for (let c of node.childNodes) {
      if (c.label == child_name) {
        return c;
      }
    }
    return null;
  }
  function _handleNodeExpand(node) {
    if (!props.expanded_tags.includes(node.nodeData.tag_string)) {
      let expanded_tags = [...props.expanded_tags];
      expanded_tags.push(node.nodeData.tag_string);
      props.updateTagState({
        "expanded_tags": expanded_tags
      });
    }
  }
  function _handleNodeShrink(node) {
    if (props.expanded_tags.includes(node.nodeData.tag_string)) {
      let expanded_tags = [...props.expanded_tags];
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
    let new_child = _newNode(tlist[0], prelist);
    node.childNodes.push(new_child);
    node.icon = "folder-close";
    node.hasCaret = true;
    let new_tlist = [...tlist];
    let new_prelist = [...prelist];
    let first_tag = new_tlist.shift();
    new_prelist.push(first_tag);
    addChildren(new_child, new_tlist, new_prelist);
  }
  function _digNode(node, tlist, prelist) {
    if (tlist.length == 0) return;
    let res = _nodeChild(node, tlist[0]);
    if (res == null) {
      addChildren(node, tlist, prelist);
    } else {
      let new_tlist = [...tlist];
      let new_prelist = [...prelist];
      let first_tag = new_tlist.shift();
      new_prelist.push(first_tag);
      tlist.shift();
      _digNode(res, new_tlist, new_prelist);
    }
  }
  function _buildTree(tag_list) {
    let cnodes = [];
    if (props.tagRoot != "all") {
      let unfocus_node = _newNode("unfocus", []);
      unfocus_node.icon = "undo";
      cnodes.push(unfocus_node);
    }
    let all_node = _newNode("all", []);
    all_node.icon = "clean";
    cnodes.push(all_node);
    let tree = {
      childNodes: cnodes
    };
    for (let tag of tag_list) {
      let tlist = tag_to_list(tag);
      _digNode(tree, tlist, [], true);
    }
    return tree.childNodes;
  }
  function get_tag_base(tagstring) {
    if (!has_slash(tagstring)) {
      return tagstring;
    } else {
      let re = /\/\w*$/;
      return re.exec(tagstring)[0].slice(1);
    }
  }
  function _rename_tag(tagstring) {
    let self = this;
    let tag_base = get_tag_base(tagstring);
    dialogFuncs.showModal("ModalDialog", {
      title: `Rename tag "${tag_base}`,
      field_title: `New name for this tag`,
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
    const confirm_text = `Are you sure that you want to delete the tag "${tagstring}" for this resource type?`;
    let self = this;
    dialogFuncs.showModal("ConfirmDialog", {
      title: `Delete tag "${tagstring}"`,
      text_body: confirm_text,
      cancel_text: "do nothing",
      submit_text: "delete",
      handleSubmit: () => {
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
  let tlist = props.tag_list == undefined ? [] : props.tag_list;
  let parent_tags = get_all_parent_tags(tlist);
  let tag_list = [...tlist];
  tag_list = tag_list.concat(parent_tags);
  tag_list = (0, _utilities_react.remove_duplicates)(tag_list);
  if (props.tagRoot != "all") {
    tag_list = tag_list.filter(x => x.startsWith(props.tagRoot));
  }
  tag_list.sort();
  let tree = _buildTree(tag_list);
  let tmenu = /*#__PURE__*/_react.default.createElement(TagMenu, {
    tagstring: contextMenuTagString,
    setShowContextMenu: setShowContextMenu,
    delete_tag: _delete_tag,
    setTagRoot: setTagRoot,
    rename_tag: _rename_tag
  });
  return /*#__PURE__*/_react.default.createElement("div", {
    tabIndex: "0",
    className: "tactic-tag-button-list"
  }, /*#__PURE__*/_react.default.createElement(_core.ContextMenuPopover, {
    onClose: () => {
      setShowContextMenu(false);
    } // Without this doesn't close
    ,
    content: tmenu,
    isOpen: showContextMenu,
    isDarkTheme: settingsContext.isDark(),
    targetOffset: contextMenuTarget
  }), /*#__PURE__*/_react.default.createElement(_core.Tree, {
    contents: tree,
    onNodeContextMenu: _showContextMenu,
    onNodeClick: _handleNodeClick,
    onNodeCollapse: _handleNodeShrink,
    onNodeExpand: _handleNodeExpand
  }));
}
exports.TagButtonList = TagButtonList = /*#__PURE__*/(0, _react.memo)(TagButtonList);
TagButtonList.propTypes = {
  tag_list: _propTypes.default.array,
  updateTagState: _propTypes.default.func,
  doTagDelete: _propTypes.default.func,
  doTagRename: _propTypes.default.func
};
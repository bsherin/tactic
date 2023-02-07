

import React from "react";
import PropTypes from 'prop-types';

import { Menu, MenuItem, ContextMenu, Tree } from "@blueprintjs/core";

import {showConfirmDialogReact, showModalReact} from "./modal_react.js";
import {doBinding, arraysMatch, remove_duplicates} from "./utilities_react.js";

export {TagButtonList, get_all_parent_tags}

function has_slash(tag_text) {
        return (tag_text.search("/") != -1)
}

function get_immediate_tag_parent(the_tag) {
        let re = /\/\w*$/;
        return the_tag.replace(re, "")
    }

function get_all_parent_tags(tag_list) {
    var ptags = [];
    if (tag_list != undefined) {
        for (let the_tag of tag_list) {
            ptags = ptags.concat(get_parent_tags(the_tag))
        }
    }
    ptags = remove_duplicates(ptags);
    return ptags
}

function get_parent_tags(the_tag) {
    if (the_tag.search("/") == -1) {
        return []
    }
    else {
        let parent_tag = get_immediate_tag_parent(the_tag);
        let ptags = get_parent_tags(parent_tag);
        ptags.push(parent_tag);
        return ptags
    }
}

function tag_to_list(the_tag) {
    return the_tag.split("/")
}


class TagMenu extends React.Component {
    render() {
        let disabled = this.props.tagstring == "all";
        return (
            <Menu>
                <MenuItem icon="edit" disabled={disabled} onClick={()=>this.props.rename_tag(this.props.tagstring)} text="Rename"/>
                <MenuItem icon="trash" disabled={disabled} onClick={()=>this.props.delete_tag(this.props.tagstring)} text="Delete"/>
            </Menu>
        )
    }
}

class TagButtonList extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);

    }

    _edit_tags(e) {
        this.setState({"edit_tags": !this.state.edit_tags});
        e.preventDefault()
    }

    _renameTagPrep(old_tag, new_tag_base) {
        let old_tag_list = tag_to_list(old_tag);
        let ot_length = old_tag_list.length;
        let tag_changes = [];
        for (let atag of this.props.tag_list) {
            let atag_list = tag_to_list(atag);
            if (arraysMatch(atag_list.slice(0, ot_length), old_tag_list)) {
                atag_list[ot_length - 1] = new_tag_base;
                tag_changes.push([atag, atag_list.join("/")])
            }
        }
        this.props.doTagRename(tag_changes)
    }

    _newNode(name, prelist) {
        let full_list = [...prelist];
        full_list.push(name);
        let tag_string = full_list.join("/");
        return {
            id: tag_string,
            childNodes: [],
            label: name,
            icon: "tag",
            hasCaret: false,
            className: name == "hidden" && prelist.length == 0 ? "hidden-tag" : "",
            isSelected: tag_string == this.props.active_tag,
            isExpanded: this.props.expanded_tags.includes(tag_string),
            nodeData: {tag_string: tag_string}
        }
    }

    _nodeChild(node, child_name) {
        for (let c of node.childNodes) {
            if (c.label == child_name) {
                return c
            }
        }
        return null
    }

    _handleNodeExpand(node) {
        if (!this.props.expanded_tags.includes(node.nodeData.tag_string)) {
            let expanded_tags = [...this.props.expanded_tags];
            expanded_tags.push(node.nodeData.tag_string);
            this.props.updateTagState({"expanded_tags": expanded_tags})
        }
    }

    _handleNodeShrink(node) {
        if (this.props.expanded_tags.includes(node.nodeData.tag_string)) {

            let expanded_tags = [...this.props.expanded_tags];
            var index = expanded_tags.indexOf(node.nodeData.tag_string);
            if (index !== -1) expanded_tags.splice(index, 1);
            this.props.updateTagState({"expanded_tags": expanded_tags})
        }
    }

    _handleNodeClick(node) {
        this.props.updateTagState({active_tag: node.nodeData.tag_string})
    }

    addChildren(node, tlist, prelist) {
        if (tlist.length == 0) return;
        let new_child = this._newNode(tlist[0], prelist);
        node.childNodes.push(new_child);
        node.icon = "folder-close";
        node.hasCaret = true;
        let new_tlist = [...tlist];
        let new_prelist = [...prelist];
        let first_tag = new_tlist.shift();
        new_prelist.push(first_tag);
        this.addChildren(new_child, new_tlist, new_prelist);
    }

    _digNode(node, tlist, prelist) {
        if (tlist.length == 0) return;
        let res = this._nodeChild(node, tlist[0]);
        if (res == null) {
            this.addChildren(node, tlist, prelist)
        }
        else {
             let new_tlist = [...tlist];
            let new_prelist = [...prelist];
            let first_tag = new_tlist.shift();
            new_prelist.push(first_tag);
            tlist.shift();
            this._digNode(res, new_tlist, new_prelist)
        }
    }

    _buildTree(tag_list) {
        let all_node = this._newNode("all", []);
        all_node.icon = "clean";
        let tree = {childNodes: [all_node]};
        for (let tag of tag_list) {
            let tlist = tag_to_list(tag);
            this._digNode(tree, tlist, [], true);
        }
        return tree.childNodes
    }

    get_tag_base(tagstring) {
        if (!has_slash(tagstring)){
            return tagstring
        }
        else {
            let re = /\/\w*$/;
            return re.exec(tagstring)[0].slice(1)
        }
    }

    _rename_tag(tagstring) {
        let self = this;
        let tag_base = this.get_tag_base(tagstring);
        showModalReact(`Rename tag "${tag_base}"`, `New name for this tag`, RenameTag, tag_base);

        function RenameTag(new_tag_base) {
            self._renameTagPrep(tagstring, new_tag_base)
        }
    }

    _delete_tag(tagstring) {
        const confirm_text = `Are you sure that you want to delete the tag "${tagstring}" for this resource type?`;
        let self = this;
        showConfirmDialogReact(`Delete tag "${tagstring}"`, confirm_text, "do nothing", "delete", function () {
            self.props.doTagDelete(tagstring)
        })

    }

    _showContextMenu(node, nodepath, e) {
        e.preventDefault();
        let tmenu = <TagMenu tagstring={node.nodeData.tag_string}
                             delete_tag={this._delete_tag}
                             rename_tag={this._rename_tag}/>;
        ContextMenu.show(tmenu, { left: e.clientX, top: e.clientY })
    }

    render() {
        let tlist = this.props.tag_list == undefined ? [] : this.props.tag_list;
        let parent_tags = get_all_parent_tags(tlist);
        let tag_list = [...tlist];
        tag_list = tag_list.concat(parent_tags);
        tag_list = remove_duplicates(tag_list);
        tag_list.sort();
        let tree = this._buildTree(tag_list);
        return (
            <div className="tactic-tag-button-list">
                <Tree contents={tree}
                         onNodeContextMenu={this._showContextMenu}
                         onNodeClick={this._handleNodeClick}
                         onNodeCollapse={this._handleNodeShrink}
                         onNodeExpand={this._handleNodeExpand}/>
            </div>
        )
    }

}

TagButtonList.propTypes = {
    tag_list: PropTypes.array,
    updateTagState: PropTypes.func,
    doTagDelete: PropTypes.func,
    doTagRename: PropTypes.func,
};
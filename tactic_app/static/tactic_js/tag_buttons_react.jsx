
import {showConfirmDialogReact, showModalReact} from "./modal_react.js";

export {TagButtonList, get_all_parent_tags}

var Rbs = window.ReactBootstrap;

function has_slash(tag_text) {
        return (tag_text.search("/") != -1)
}

function get_immediate_tag_parent(the_tag) {
        let re = /\/\w*$/;
        return the_tag.replace(re, "")
    }

function get_all_parent_tags(tag_list) {
    var ptags = [];
    for (let the_tag of tag_list){
        ptags = ptags.concat(get_parent_tags(the_tag))
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

class TagButton extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        this.state = {
            am_root : !has_slash(props.the_tag),
            drag_hover: false
        }
    }

    _handleExpanderClick(event) {
        this.props._handleExpanderToggle(this.props.the_tag, !this.props.am_expanded);
        event.stopPropagation()
    }

    get tag_base() {
        let the_tag = this.props.the_tag;
        if (!has_slash(the_tag)){
            return the_tag
        }
        else {
            let re = /\/\w*$/;
            return re.exec(the_tag)[0].slice(1)
        }
    }

    tag_depth(the_tag) {
        return (the_tag.match(/\//g) || []).length;
    }

    _handleSetActive() {
        if (!this.props.am_active) {
            this.props._handleSetActive(this.props.the_tag)
        }
    }

    _handleDrop(e, index, targetName) {
        this.setState({"drag_hover": false});
        let res_name = get_datum(e, "resourcename");
        if (res_name != "") {
            this.props.handleAddTag(res_name, this.props.the_tag);
        }
    }

    _handleDragOver(e) {
        e.preventDefault();
        this.setState({"drag_hover": true});

    }

    _handleDragLeave(e) {
        e.preventDefault();
        this.setState({"drag_hover": false});
    }

    _handleDragStart(e) {
        set_datum(e, "tagname", this.props.the_tag);
    }

    _rename_tag(e) {
        e.stopPropagation();
        let self = this;
        let tag_base = this.tag_base;
        showModalReact(`Rename tag ${tag_base}`, `New name for this tag`, RenameTag, tag_base);

        function RenameTag(new_tag_base) {
            self.props.renameTagPrep(self.props.the_tag, new_tag_base)
        }

    }

    _delete_tag(e) {
        e.stopPropagation();
        const confirm_text = `Are you sure that you want to delete the tag ${this.props.the_tag} for this resource type?`;
        let self = this;
        showConfirmDialogReact(`Delete tag`, confirm_text, "do nothing", "delete", function () {
            self.props.doTagDelete(self.props.the_tag)
        })

    }

    render () {
        let indent_amount = 12;
        let mleft = indent_amount * this.tag_depth(this.props.the_tag);
        let pf_style;
        let hcclass;
        let prefix;
        let icon_element;
        let active_folder_icon_element = <span className="tag-icon-folder fas fa-folder"></span>;
        let inactive_folder_icon_element = <span className="tag-icon-folder fal fa-folder"></span>;
        if (this.props.have_children) {
            hcclass = "has_children shrunk";
            pf_style = {marginLeft: mleft};
            if (this.props.am_expanded) {
                prefix = <span className="tag-expander fal fa-caret-down"
                               onClick={this._handleExpanderClick}
                               style={pf_style}/>;
                if (this.props.am_active) {
                    icon_element = active_folder_icon_element
                } else {
                    icon_element = inactive_folder_icon_element
                }
            } else {
                prefix = <span className="tag-expander fal fa-caret-right"
                               onClick={this._handleExpanderClick}
                               style={pf_style}/>;
                if (this.props.am_active) {
                    icon_element = active_folder_icon_element
                }
                else {
                    icon_element = inactive_folder_icon_element
                }
            }
        }
        else {
            hcclass = "no_children";
            pf_style = {marginLeft: mleft + indent_amount};
            prefix = <span style={pf_style}></span>;
            if (this.props.am_active) {
                if (this.props.the_tag == "all") {
                    icon_element = <span className="tag-icon-tag fas fa-tags"></span>
                }
                else {
                    icon_element = <span className="tag-icon-tag fas fa-tag"></span>
                }
            }
            else {
                if (this.props.the_tag == "all") {
                    icon_element = <span className="tag-icon-tag fal fa-tags"></span>
                }
                else {
                    icon_element = <span className="tag-icon-tag fal fa-tag"></span>
                }
            }
        }
        if (this.props.am_active) {
            hcclass = hcclass + " active"
        }
        if (this.state.drag_hover) {
            hcclass = hcclass + " draghover"
        }
        if (this.state.am_root) {
            return (
                <Rbs.Button className={`btn btn-outline-secondary tag-button root-tag ${hcclass}`}
                            onClick={this.props.edit_tags ? this._rename_tag : this._handleSetActive}
                            draggable={this.props.the_tag != "all"}
                            onDragStart={this._handleDragStart}
                            onDragOver={this._handleDragOver}
                            onDragLeave={this._handleDragLeave}
                            onDrop={this._handleDrop}
                >
                    {prefix}
                    {icon_element}
                    {this.tag_base}
                    {this.props.edit_tags && <span onClick={this._delete_tag}
                                                   className="tag-button-delete delete-visible"/>}
                </Rbs.Button>
            );
        }
        else {
            return (
                <Rbs.Button className={`btn btn-outline-secondary tag-button ${hcclass}`}
                            draggable={true}
                            onDragStart={this._handleDragStart}
                            onDragOver={this._handleDragOver}
                            onDragLeave={this._handleDragLeave}
                            onClick={this.props.edit_tags ? this._rename_tag : this._handleSetActive}
                >
                    {prefix}
                    {icon_element}
                    {this.tag_base}
                    {this.props.edit_tags && <span onClick={this._delete_tag}
                                                   className="tag-button-delete delete-visible"/>}
                </Rbs.Button>
            );
        }
    }
}

TagButton.propTypes = {
    the_tag: PropTypes.string,
    have_children: PropTypes.bool,
    am_expanded: PropTypes.bool,
    am_active: PropTypes.bool,
    _handleExpanderToggle: PropTypes.func,
    _handleSetActive: PropTypes.func,
    renameTagPrep: PropTypes.func,
    handleAddTag: PropTypes.func,
    edit_tags: PropTypes.bool
};

class TagButtonList extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        this.state = {
            expanded_tags: [],
            active_tag: "all",
            edit_tags: false
        }
    }

    _handleExpanderToggle(the_tag, set_to_expanded){
        if (set_to_expanded) {
            let ex_tags = [...this.state.expanded_tags];
            ex_tags.push(the_tag);
            this.setState({expanded_tags: ex_tags})
        }
        else {
            let ex_tags = [...this.state.expanded_tags];
            var index = ex_tags.indexOf(the_tag);
            if (index !== -1) ex_tags.splice(index, 1);
            this.setState({expanded_tags: ex_tags})
        }
    }
    
    _handleSetActive(the_tag) {
        this.setState({active_tag: the_tag}, () => {this.props.handleSearchFromTag(the_tag)})

    }

    subtag_visible(the_tag) {
        let all_parents = get_parent_tags(the_tag);
        for (let parent of all_parents) {
            if (!this.state.expanded_tags.includes(parent)) {
                return false
            }
        }
        return true
    }

    compute_visible_tags(tag_list) {
        let visible_tags = [];
        for (let tag of tag_list) {
            if (!has_slash(tag) || this.subtag_visible(tag)) {
                visible_tags.push(tag)
            }
        }
        return visible_tags
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

    render() {
        let parent_tags = get_all_parent_tags(this.props.tag_list);
        let tag_list = [...this.props.tag_list];
        tag_list = tag_list.concat(parent_tags);
        tag_list = remove_duplicates(tag_list);
        tag_list.sort();
        let visible_tags = this.compute_visible_tags(tag_list);
        let tag_buttons = [];
        let bg_style = {
            justifyContent: "start",
            display: "inline-block",
            overflowY: "scroll",
        };
        let all_tag = <TagButton the_tag="all"
                                 key="all"
                                 have_children={false}
                                 am_expanded={false}
                                 am_active={"all" == this.state.active_tag}
                                 _handleExpanderToggle={this._handleExpanderToggle}
                                 _handleSetActive={this._handleSetActive}
                                 edit_tags={false}
                />;
        tag_buttons.push(all_tag);
        for (let tag of tag_list) {
            if (visible_tags.includes(tag)) {
                let new_tag = <TagButton the_tag={tag}
                                         key={tag}
                                         have_children={parent_tags.includes(tag)}
                                         am_expanded={this.state.expanded_tags.includes(tag)}
                                         am_active={tag == this.state.active_tag}
                                         _handleExpanderToggle={this._handleExpanderToggle}
                                         _handleSetActive={this._handleSetActive}
                                         handleAddTag={this.props.handleAddTag}
                                         edit_tags={this.state.edit_tags}
                                         doTagDelete={this.props.doTagDelete}
                                         renameTagPrep={this._renameTagPrep}

                />;
                tag_buttons.push(new_tag)
            }
        }
        let eb_class = this.state.edit_tags ? "btn-danger" : "btn-outline-secondary";
        return (

            <div style={{marginTop: 85}}>
                <Rbs.Button className={`btn ${eb_class} ml-2 edit-tags-button`}
                            onClick={this._edit_tags}
                >
                    edit tags
                </Rbs.Button>
                <Rbs.ButtonGroup style={bg_style} vertical size="sm">
                    {tag_buttons}
                </Rbs.ButtonGroup>
            </div>
        )
    }

}

TagButtonList.propTypes = {
    res_type: PropTypes.string,
    tag_list: PropTypes.array,
    handleSearchFromTag: PropTypes.func,
    doTagDelete: PropTypes.func,
    doTagRename: PropTypes.func,
    handleAddTag: PropTypes.func
};
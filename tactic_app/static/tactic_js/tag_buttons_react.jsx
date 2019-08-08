
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

class TagButton extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        this.state = {
            am_root : !has_slash(props.the_tag)
        }
    }

    _handleExpanderClick() {
        this.props._handleExpanderToggle(this.props.the_tag, !this.props.am_expanded)
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

    render () {
        let indent_amount = 12;
        let mleft = indent_amount * this.tag_depth(this.props.the_tag);
        let pf_style;
        let hcclass;
        let prefix;
        let icon_element;
        if (this.props.have_children) {
            hcclass = "has_children shrunk";
            pf_style = {marginLeft: mleft};
            if (this.props.am_expanded) {
                prefix = <span className="tag-expander fal fa-caret-down"
                               onClick={this._handleExpanderClick}
                               style={pf_style}/>;
                if (this.props.am_active) {
                    icon_element = <span className="tag-icon-folder fas fa-folder"></span>
                } else {
                    icon_element = <span className="tag-icon-folder fal fa-folder"></span>
                }
            } else {
                prefix = <span className="tag-expander fal fa-caret-right"
                               onClick={this._handleExpanderClick}
                               style={pf_style}/>;
                if (this.props.am_active) {
                    icon_element = <span className="tag-icon-folder fas fa-folder"></span>
                }
                else {
                    icon_element = <span className="tag-icon-folder fal fa-folder"></span>
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
        if (this.state.am_root) {
            return (
                <Rbs.Button className={`btn btn-outline-secondary tag-button root-tag ${hcclass}`}
                            onClick={this._handleSetActive}
                >
                    {prefix}
                    {icon_element}
                    {this.tag_base}
                </Rbs.Button>
            );
        }
        else {
            return (
                <Rbs.Button className={`btn btn-outline-secondary tag-button ${hcclass}`}
                            onClick={this._handleSetActive}
                >
                    {prefix}
                    {icon_element}
                    {this.tag_base}
                    <span className="tag-button-delete"/>
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
    _handleSetActive: PropTypes.func
};

class TagButtonList extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        this.state = {
            expanded_tags: [],
            active_tag: "all"
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
            marginTop: 85,
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
                />;
                tag_buttons.push(new_tag)
            }
        }
        return (
            <Rbs.ButtonGroup style={bg_style} vertical size="sm">
                {tag_buttons}
            </Rbs.ButtonGroup>
        )
    }

}

TagButtonList.propTypes = {
    res_type: PropTypes.string,
    tag_list: PropTypes.array,
    handleSearchFromTag: PropTypes.func
};
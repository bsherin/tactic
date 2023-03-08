
import "../tactic_css/tactic_select.scss"

import React from "react";
import PropTypes from 'prop-types';

import { PopoverPosition, Button, MenuDivider, MenuItem, TagInput, TextArea, FormGroup, InputGroup,
    Card, Icon, Collapse} from "@blueprintjs/core";
import {Select2, MultiSelect} from "@blueprintjs/select";

import markdownIt from 'markdown-it'
import 'markdown-it-latex/dist/index.css'
import markdownItLatex from 'markdown-it-latex'
const mdi = markdownIt({html: true});
mdi.use(markdownItLatex);
import _ from 'lodash';

import {postAjaxPromise} from "./communication_react.js"
import {doBinding, propsAreEqual} from "./utilities_react.js";
import {tile_icon_dict} from "./icon_info.js";

export {icon_dict};
export {NotesField, CombinedMetadata, BpSelect, BpSelectAdvanced}

let icon_dict = {
    all: "cube",
    collection: "database",
    project: "projects",
    tile: "application",
    list: "list",
    code: "code"
};

class SuggestionItemAdvanced extends React.Component{
    constructor(props) {
        super(props);
        doBinding(this)
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !propsAreEqual(nextProps, this.props)
    }

    render() {
        let item = this.props.item;
        let display_text = "display_text" in item ? item.display_text : item.text;
        let the_icon = "icon" in item ? item.icon : null
        if (item.isgroup) {
            return (
                <MenuDivider className="tile-form-menu-item" title={display_text}/>
            )
        }
        else {
            return (
                <MenuItem
                    className="tile-form-menu-item"
                    text={display_text}
                    key={display_text}
                    icon={the_icon}
                    onClick={this.props.handleClick}
                    active={this.props.modifiers.active}
                    shouldDismissPopover={true}
                />
            );
        }
    }
}
SuggestionItemAdvanced.propTypes = {
    item: PropTypes.object,
    modifiers: PropTypes.object,
    handleClick: PropTypes.func
};

function renderSuggestionAdvanced (item, {modifiers, handleClick, index}) {
    return <SuggestionItemAdvanced item={item} key={index} modifiers={modifiers} handleClick={handleClick}/>
}

class BpSelectAdvanced extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
        this.state = {
            activeItem: this.props.value
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !propsAreEqual(nextProps, this.props)
    }

    _filterSuggestion(query, item) {
        if (query.length === 0) {
            return true
        }
        let re = new RegExp(query.toLowerCase());

        let the_text;
        if (typeof item == "object") {
            the_text = item["text"]
        }
        else {
            the_text = item
        }
        return re.test(the_text.toLowerCase())
    }

    _handleActiveItemChange(newActiveItem) {
        // this.setState({activeItem: newActiveItem})
    }

    _getActiveItem(val) {
        for (let option of this.props.options) {
            if (_.isEqual(option, val)) {
                return option
            }
        }
        return null
    }

    render () {
        let value = this.props.value;
        let display_text = "display_text" in value ? value.display_text : value.text;
        return (
            <Select2
                activeItem={this._getActiveItem(value)}
                onActiveItemChange={this._handleActiveItemChange}
                itemRenderer={renderSuggestionAdvanced}
                itemPredicate={this._filterSuggestion}
                items={this.props.options}
                onItemSelect={this.props.onChange}
                popoverProps={{minimal: true,
                    boundary: "window",
                    modifiers: {flip: false, preventOverflow: true},
                    position: PopoverPosition.BOTTOM_LEFT}}>
                <Button text={display_text} className="button-in-select" icon={this.props.buttonIcon}  />
            </Select2>
        )
    }
}

BpSelectAdvanced.propTypes = {
    options: PropTypes.array,
    onChange: PropTypes.func,
    value: PropTypes.object,
    buttonIcon: PropTypes.string,
};

BpSelectAdvanced.defaultProps = {
    buttonIcon: null,
};


class BpSelect extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
        this.state = {
            activeItem: this.props.value
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !propsAreEqual(nextProps, this.props, ["buttonTextObject"])
    }

    _filterSuggestion(query, item) {
        if ((query.length === 0) || (item["isgroup"])) {
            return true
        }
        let re = new RegExp(query.toLowerCase());

        let the_text;
        if (typeof item == "object") {
            the_text = item["text"]
        }
        else {
            the_text = item
        }
        return re.test(the_text.toLowerCase())
    }

    _handleActiveItemChange(newActiveItem) {
        let the_text;
        if (typeof item == "object") {
            the_text = newActiveItem["text"]
        }
        else {
            the_text = newActiveItem
        }
        this.setState({activeItem: the_text})
    }

    render () {
        return (
            <Select2
                className="tile-form-menu-item"
                activeItem={this.state.activeItem}
                filterable={this.props.filterable}
                onActiveItemChange={this._handleActiveItemChange}
                itemRenderer={renderSuggestion}
                itemPredicate={this._filterSuggestion}
                items={_.cloneDeep(this.props.options)}
                onItemSelect={this.props.onChange}
                popoverProps={{minimal: true,
                    boundary: "window",
                    modifiers: {flip: false, preventOverflow: true},
                    position: this.props.popoverPosition}}>
                <Button className="button-in-select"
                           style={this.props.buttonStyle}
                           small={this.props.small}
                           text={this.props.buttonTextObject ? this.props.buttonTextObject : this.props.value}
                           icon={this.props.buttonIcon} />
            </Select2>
        )
    }
}

BpSelect.propTypes = {
    options: PropTypes.array,
    onChange: PropTypes.func,
    filterable: PropTypes.bool,
    small: PropTypes.bool,
    value: PropTypes.string,
    buttonTextObject: PropTypes.object,
    buttonIcon: PropTypes.string,
    buttonStyle: PropTypes.object,
    popoverPosition: PropTypes.string
};

BpSelect.defaultProps = {
    buttonIcon: null,
    buttonStyle: {},
    popoverPosition: PopoverPosition.BOTTOM_LEFT,
    buttonTextObject: null,
    filterable: true,
    small: undefined
};


class SuggestionItem extends React.Component{
    constructor(props) {
        super(props);
        doBinding(this)
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !propsAreEqual(nextProps, this.props)
    }

    render() {
        let the_text;
        let the_icon;
        if (typeof this.props.item == "object") {
            the_text = this.props.item["text"];
            the_icon = this.props.item["icon"]
        }
        else {
            the_text = this.props.item;
            the_icon = null
        }
        return (
            <MenuItem
                className="tile-form-menu-item"
                text={the_text}
                icon={the_icon}
                active={this.props.modifiers.active}
                onClick={()=>this.props.handleClick(the_text)}
                shouldDismissPopover={true}
            />
        );
    }
}
SuggestionItem.propTypes = {
    item: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object]),
    index: PropTypes.number,
    modifiers: PropTypes.object,
    handleClick: PropTypes.func,
};


function renderSuggestion (item, { modifiers, handleClick, index}) {
    return <SuggestionItem item={item} key={index} modifiers={modifiers} handleClick={handleClick}/>
}

const renderCreateNewTag = (query, active, handleClick) => {
    let hclick = handleClick;
    return(
        <MenuItem
            icon="add"
            key="create_item"
            text={`Create "${query}"`}
            active={active}
            onClick={handleClick}
            shouldDismissPopover={false}
        />
    );
};

class NativeTags extends React.Component {
    constructor (props) {
        super(props);
        doBinding(this);

        this.state = {
            query: "",
          suggestions: [
          ]
        }
     }

     componentDidMount() {
        let self = this;
        let data_dict = {"pane_type": this.props.pane_type, "is_repository": false};
        if (!this.props.pane_type) {
            self.setState({"suggestions": []});
            return
        }
        postAjaxPromise("get_tag_list", data_dict)
            .then(data => {
                let all_tags = data.tag_list;
                self.setState({"suggestions": all_tags})
            })
     }

     renderTag(item) {
        return item
     }

    _handleDelete (tag, i) {
        let new_tlist = [...this.props.tags];
        new_tlist.splice(i, 1);
        this.props.handleChange(new_tlist)
      }

     _handleAddition (tag) {
        let new_tlist = [...this.props.tags];
        new_tlist.push(tag);
        this.props.handleChange(new_tlist)
    }

    _filterSuggestion(query, item) {
        if (query.length === 0) {
            return false
        }
        let re = new RegExp(`^${query}`);

        return re.test(item)
    }

    _createItemFromQuery(name) {
        return name
    }

      render () {
        if (this.props.readOnly) {
            return (
                <TagInput values={this.props.tags} disabled={true}/>
            )
        }
        return (
            <MultiSelect
                allowCreate={true}
                openOnKeyDown={true}
                createNewItemFromQuery={this._createItemFromQuery}
                createNewItemRenderer={renderCreateNewTag}
                resetOnSelect={true}
                itemRenderer={renderSuggestion}
                selectedItems={this.props.tags}
                allowNew={true}
                items={this.state.suggestions}
                itemPredicate={this._filterSuggestion}
                tagRenderer={this.renderTag}
                tagInputProps={{onRemove: this._handleDelete}}
                onItemSelect={this._handleAddition} />
        )
    }
}

NativeTags.proptypes = {
    tags: PropTypes.array,
    handleChange: PropTypes.func,
    pane_type: PropTypes.string
};

class NotesField extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            "md_height": 500,
            "show_markdown": this.hasOnlyWhitespace ? false : this.props.show_markdown_initial
        };
        doBinding(this);
        // this.notes_ref = React.createRef();
        this.md_ref = React.createRef();
        this.awaiting_focus = false
    }

    getNotesField() {
        return $(this.notes_ref)
    }

    get hasOnlyWhitespace() {
        return !this.props.notes.trim().length
    }

    getMarkdownField() {
        return $(this.md_ref.current)
    }

    componentDidUpdate(prevProps, prevState, snapShot) {
        if (this.awaiting_focus) {
            this.focusNotes();
            this.awaiting_focus = false
        }
        else if (this.hasOnlyWhitespace) {
            if (this.state.show_markdown) {
                // If we are here, then we are reusing a notes field that previously showed markdown
                // and now is empty. We want to prevent markdown being shown when a character is typed.
                this.setState({"show_markdown": false})
            }
        }
        else if (!this.state.show_markdown && (this.notes_ref !== document.activeElement)) {
            // If we are here it means the change was initiated externally
            this._showMarkdown()
        }
    }

    focusNotes() {
        this.getNotesField().focus()
    }

    _hideMarkdown() {
        if (this.props.readOnly) return;
        this.awaiting_focus = true;  // We can't set focus until the input is visible
        this.setState({"show_markdown": false});
    }

    _handleMyBlur() {
        this._showMarkdown();
        if (this.props.handleBlur != null) {
            this.props.handleBlur()
        }
    }

    _showMarkdown() {
        if (!this.hasOnlyWhitespace) {
            this.setState({"show_markdown": true})
        }
    }

    _notesRefHandler(the_ref) {
        this.notes_ref = the_ref;
    }

    render() {
        let really_show_markdown =  this.hasOnlyWhitespace ? false : this.state.show_markdown;
        let notes_style = {
            "display": really_show_markdown ? "none" : "block",
            fontSize: 13,
            resize: "both"
            // fontSize: 14
        };
        let md_style = {
            "display": really_show_markdown ? "block": "none",
            "maxHeight": this.state.md_height,
            "fontSize": 13
        };
        var converted_markdown;
        if (really_show_markdown) {
            // converted_markdown = this.converter.makeHtml(this.props.notes);
            converted_markdown = mdi.render(this.props.notes)
        }

        let converted_dict = {__html: converted_markdown};
        return (
        <React.Fragment>
            <TextArea
                      rows="20"
                      cols="75"
                      inputRef={this._notesRefHandler}
                      growVertically={false}
                      onBlur={this._handleMyBlur}
                      onChange={this.props.handleChange}
                      value={this.props.notes}
                      disabled={this.props.readOnly}
                      style={notes_style}
            />
            <div ref={this.md_ref}
                 style={md_style}
                 onClick={this._hideMarkdown}
                 className="notes-field-markdown-output"
                 dangerouslySetInnerHTML={converted_dict}/>
        </React.Fragment>
        )
    }
}

NotesField.propTypes = {
    notes: PropTypes.string,
    handleChange: PropTypes.func,
    show_markdown_initial: PropTypes.bool,
    handleBlur: PropTypes.func
};

NotesField.defaultProps = {
    handleBlur: null
};

const icon_list = ["application", "code",
    "timeline-line-chart", "heatmap", "graph", "heat-grid", "chart", "pie-chart", "regression-chart",
    "grid", "numerical", "font", "array", "array-numeric", "array-string", "data-lineage", "function", "variable",
    "build", "group-objects", "ungroup-objects", "inner-join", "filter",
    "sort-asc", "sort-alphabetical", "sort-numerical", "random",
    "layout", "layout-auto", "layout-balloon",
    "changes", "comparison",
    "exchange", "derive_column",
    "list-columns", "delta",
    "edit", "fork", "numbered-list", "path-search", "search",
    "plus", "repeat", "reset", "resolve",
    "widget-button", 
    "star", "time", "settings", "properties", "cog", "key-command",
    "ip-address", "download", "cloud", "globe",
    "tag", "label",
    "history", "predictive-analysis", "calculator", "pulse", "warning-sign", "cube", "wrench"
];

var icon_dlist = [];
var icon_entry_dict = {};

const cat_order = ['data', 'action', 'table', 'interface', 'editor', 'file', 'media', 'miscellaneous'];

for (let category of cat_order) {
    var cat_entry = {text: category, display_text: category, isgroup: true}
    icon_dlist.push(cat_entry);
    for (let entry of tile_icon_dict[category]) {
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

class IconSelector extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
    }

    render() {
        return (
            <BpSelectAdvanced options={icon_dlist}
                              onChange={(item)=>{this.props.handleSelectChange(item.val)}}
                              buttonIcon={this.props.icon_val}
                              value={icon_entry_dict[this.props.icon_val]}/>
        )
    }
}

IconSelector.propTypes = {
    handleSelectChange: PropTypes.func,
    icon_val: PropTypes.string
};


class CombinedMetadata extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        this.state = {
            auxIsOpen: false
        }
    }

    _handleNotesChange(event) {
        this.props.handleChange({"notes": event.target.value})
    }

    _handleTagsChange(tags) {
        this.props.handleChange({"tags": tags})
    }

    _handleTagsChangeNative(tags) {
        this.props.handleChange({"tags": tags})
    }

    _handleCategoryChange(event) {
        this.props.handleChange({"category": event.target.value})
    }
    _handleIconChange(icon) {
        this.props.handleChange({"icon": icon})
    }

    _toggleAuxVisibility() {
        this.setState({auxIsOpen: !this.state.auxIsOpen})
    }

    render () {
        let addition_field_style = {fontSize: 14};
        let additional_items;
        if (this.props.additional_metadata != null) {
            additional_items = [];
            for (let field in this.props.additional_metadata) {
                let md = this.props.additional_metadata[field];
                if (Array.isArray(md)) {
                    md = md.join(", ")
                }
                else if (field == "collection_name") {
                    let sresult = /\.\w*$/.exec(md);
                    if (sresult != null)  md = sresult[0].slice(1)
                }
                additional_items.push(
                     <FormGroup label={field + ": "} key={field} inline={true}>
                            <InputGroup disabled={true} value={md} fill={true}/>
                        </FormGroup>
                )
            }
        }
        let button_base = this.state.auxIsOpen ? "Hide" : "Show";
        return (
            <Card elevation={this.props.elevation} className="combined-metadata accent-bg" style={this.props.outer_style}>
                {this.props.name != null &&
                    <h6><Icon icon={icon_dict[this.props.res_type]} style={{marginRight: 4}}/>{this.props.name}</h6>
                }

                    <FormGroup label="Tags">
                        <NativeTags tags={this.props.tags}
                                    readOnly={this.props.readOnly}
                                    handleChange={this._handleTagsChange}
                                    pane_type={this.props.pane_type}/>
                    </FormGroup>
                    {this.props.category != null &&
                        <FormGroup label="Category">
                            <InputGroup  onChange={this._handleCategoryChange}
                                            value={this.props.category} />
                        </FormGroup>
                    }
                    {this.props.icon != null &&
                        <FormGroup label="Icon">
                            <IconSelector icon_val={this.props.icon}
                                          handleSelectChange={this._handleIconChange}/>
                        </FormGroup>
                    }
                    <FormGroup label="Notes">
                        <NotesField notes={this.props.notes}
                                    readOnly={this.props.readOnly}
                                    handleChange={this._handleNotesChange}
                                    show_markdown_initial={true}
                                    handleBlur={this.props.handleNotesBlur}
                        />
                        {this.props.notes_buttons && this.props.notes_buttons()}
                    </FormGroup>
                    <FormGroup label="Created " inline={true}>
                        <InputGroup disabled={true} value={this.props.created}/>
                    </FormGroup>
                    {this.props.updated != null &&
                        <FormGroup label="Updated: " inline={true}>
                            <InputGroup disabled={true} value={this.props.updated}/>
                        </FormGroup>
                    }
                    {this.props.additional_metadata != null &&
                        additional_items
                    }
                {this.props.aux_pane != null &&
                    <React.Fragment>
                    <div  className="d-flex flex-row justify-content-around" style={{marginTop: 20}}>
                        <Button fill={false}
                                   small={true}
                                   minimal={false}
                                   onClick={this._toggleAuxVisibility}>
                            {button_base + " " + this.props.aux_pane_title}
                        </Button>
                    </div>
                    <Collapse isOpen={this.state.auxIsOpen} keepChildrenMounted={true}>
                        {this.props.aux_pane}
                    </Collapse>
                </React.Fragment>
                }
                <div style={{height: 100}}/>
            </Card>
        )
    }
}

CombinedMetadata.propTypes = {
    outer_style: PropTypes.object,
    elevation: PropTypes.number,
    res_type: PropTypes.string,
    pane_type: PropTypes.string,
    name: PropTypes.string,
    created: PropTypes.string,
    updated: PropTypes.string,
    tags: PropTypes.array,
    notes: PropTypes.string,
    category: PropTypes.string,
    icon: PropTypes.string,
    handleChange: PropTypes.func,
    handleNotesBlur: PropTypes.func,
    additional_metadata: PropTypes.object,
    aux_pane: PropTypes.object,
    notes_buttons: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.func])
};

CombinedMetadata.defaultProps = {
    outer_style: {marginLeft: 20, overflow: "auto", padding: 15},
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

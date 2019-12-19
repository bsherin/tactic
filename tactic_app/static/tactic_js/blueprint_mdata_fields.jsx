
import "../tactic_css/tactic_select.scss"

import React from "react";
import PropTypes from 'prop-types';

import { PopoverPosition, Button, MenuDivider, MenuItem, TagInput, TextArea, FormGroup, InputGroup,
    Card, Icon} from "@blueprintjs/core";
import {Select, MultiSelect} from "@blueprintjs/select";

import showdown from 'showdown';
import _ from 'lodash';

import {ViewerContext} from "./resource_viewer_context.js";
import {postAjaxPromise} from "./communication_react.js"

import {doBinding, propsAreEqual} from "./utilities_react.js";

export {NotesField, CombinedMetadata, BpSelect, BpSelectAdvanced}

let icon_dict = {
    collection: "database",
    project: "projects",
    tile: "application",
    list: "list",
    code: "code"
};

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
        if ((query.length == 0) || (item["isgroup"])) {
            return true
        }
        let re = new RegExp(query.toLowerCase());

        return re.test(item["text"].toLowerCase())
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
        return (
            <Select
                activeItem={this._getActiveItem(this.props.value)}
                onActiveItemChange={this._handleActiveItemChange}
                itemRenderer={renderSuggestionAdvanced}
                itemPredicate={this._filterSuggestion}
                items={this.props.options}
                onItemSelect={this.props.onChange}
                popoverProps={{minimal: true,
                    boundary: "window",
                    modifiers: {flip: false, preventOverflow: true},
                    position: PopoverPosition.BOTTOM_LEFT}}>
                <Button text={this.props.value["text"]} className="button-in-select" icon={this.props.buttonIcon}  />
            </Select>
        )
    }
}

BpSelectAdvanced.propTypes = {
    options: PropTypes.array,
    onChange: PropTypes.func,
    value: PropTypes.object,
    buttonIcon: PropTypes.string
};

BpSelectAdvanced.defaultProps = {
    buttonIcon: null
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
        if (this.props.item["isgroup"]) {
            return (
                <MenuDivider className="tile-form-menu-item" title={this.props.item["text"]}/>
            )
        }
        else {
            return (
                <MenuItem
                    className="tile-form-menu-item"
                    text={this.props.item["text"]}
                    key={this.props.item}
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
        if (query.length == 0) {
            return true
        }
        let re = new RegExp(query.toLowerCase());

        return re.test(item.toLowerCase())
    }

    _handleActiveItemChange(newActiveItem) {
        this.setState({activeItem: newActiveItem})
    }

    render () {
        return (
            <Select
                className="tile-form-menu-item"
                activeItem={this.state.activeItem}
                onActiveItemChange={this._handleActiveItemChange}
                itemRenderer={renderSuggestion}
                itemPredicate={this._filterSuggestion}
                items={_.cloneDeep(this.props.options)}
                onItemSelect={this.props.onChange}
                popoverProps={{minimal: true,
                    boundary: "window",
                    modifiers: {flip: false, preventOverflow: true},
                    position: PopoverPosition.BOTTOM_LEFT}}>
                <Button className="button-in-select"
                           style={this.props.buttonStyle}
                           text={this.props.buttonTextObject ? this.props.buttonTextObject : this.props.value}
                           icon={this.props.buttonIcon} />
            </Select>
        )
    }
}

BpSelect.propTypes = {
    options: PropTypes.array,
    onChange: PropTypes.func,
    value: PropTypes.string,
    buttonTextObject: PropTypes.object,
    buttonIcon: PropTypes.string,
    buttonStyle: PropTypes.object
};

BpSelect.defaultProps = {
    buttonIcon: null,
    buttonStyle: {},
    buttonTextObject: null,
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
        return (
            <MenuItem
                className="tile-form-menu-item"
                text={this.props.item}
                active={this.props.modifiers.active}
                onClick={this.props.handleClick}
                shouldDismissPopover={true}
            />
        );
    }
}
SuggestionItem.propTypes = {
    item: PropTypes.string,
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
        let data_dict = {"res_type": this.props.res_type, "is_repository": false};
        postAjaxPromise("get_tag_list", data_dict)
            .then(function(data) {
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
        if (query.length == 0) {
            return false
        }
        let re = new RegExp("^" + query);

        return re.test(item)
    }

    _createItemFromQuery(name) {
        return name
    }

      render () {
        if (this.context.readOnly) {
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
    res_type: PropTypes.string
};


NativeTags.contextType = ViewerContext;

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
        this.converter = new showdown.Converter();
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
        else if (!this.state.show_markdown && (this.notes_ref != document.activeElement)) {
            // If we are here it means the change was initiated externally
            this._showMarkdown()
        }
    }

    focusNotes() {
        this.getNotesField().focus()
    }

    _hideMarkdown() {
        if (this.context.readOnly) return;
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
            converted_markdown = this.converter.makeHtml(this.props.notes);
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
                      disabled={this.context.readOnly}
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

NotesField.contextType = ViewerContext;

NotesField.propTypes = {
    notes: PropTypes.string,
    handleChange: PropTypes.func,
    show_markdown_initial: PropTypes.bool,
    handleBlur: PropTypes.func
};

NotesField.defaultProps = {
    handleBlur: null
};


class CombinedMetadata extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this)
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
                            <InputGroup disabled={true} style={{color:"#394B59"}} value={md} fill={true}/>
                        </FormGroup>
                )
            }
        }
        return (
            <Card elevation={this.props.elevation} className="combined-metadata" style={this.props.outer_style}>
                {this.props.name != null &&
                    <h6 style={{color: "#106ba3"}}><Icon icon={icon_dict[this.props.res_type]} style={{marginRight: 4}}/>{this.props.name}</h6>
                }

                    <FormGroup label="Tags">
                        <NativeTags tags={this.props.tags}
                                     handleChange={this._handleTagsChange}
                                    res_type={this.props.res_type}/>
                    </FormGroup>
                    {this.props.category != null &&
                        <FormGroup label="Category">
                            <InputGroup  onChange={this._handleCategoryChange}
                                            value={this.props.category} />
                        </FormGroup>
                    }
                    <FormGroup label="Notes">
                        <NotesField notes={this.props.notes}
                                    handleChange={this._handleNotesChange}
                                    show_markdown_initial={true}
                                    handleBlur={this.props.handleNotesBlur}
                        />
                    </FormGroup>
                    <FormGroup label="Created " inline={true}>
                        <InputGroup disabled={true} style={{color:"#394B59"}} value={this.props.created}/>
                    </FormGroup>
                    {this.props.updated != null &&
                        <FormGroup label="Updated: " inline={true}>
                            <InputGroup disabled={true} style={{color:"#394B59"}} value={this.props.updated}/>
                        </FormGroup>
                    }
                    {this.props.additional_metadata != null &&
                        additional_items
                    }
            </Card>
        )
    }
}

CombinedMetadata.propTypes = {
    outer_style: PropTypes.object,
    elevation: PropTypes.number,
    res_type: PropTypes.string,
    name: PropTypes.string,
    created: PropTypes.string,
    updated: PropTypes.string,
    tags: PropTypes.array,
    notes: PropTypes.string,
    category: PropTypes.string,
    handleChange: PropTypes.func,
    handleNotesBlur: PropTypes.func,
    additional_metadata: PropTypes.object,
};

CombinedMetadata.defaultProps = {
    outer_style: {marginLeft: 20, overflow: "auto",
            padding: 15, backgroundColor: "#f5f8fa"},
    elevation: 0,
    handleNotesBlur: null,
    category: null,
    name: null,
    updated: null,
    additional_metadata: null
};

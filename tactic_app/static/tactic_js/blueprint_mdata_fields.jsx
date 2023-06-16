import "../tactic_css/tactic_select.scss"

import React from "react";
import {Fragment, useState, useEffect, useRef, memo} from "react";
import PropTypes from 'prop-types';

import {
    PopoverPosition, Button, MenuDivider, MenuItem, TagInput, TextArea, FormGroup, InputGroup,
    Card, Icon, Collapse, H4
} from "@blueprintjs/core";
import {Select2, MultiSelect} from "@blueprintjs/select";

import markdownIt from 'markdown-it'
import 'markdown-it-latex/dist/index.css'
import markdownItLatex from 'markdown-it-latex'

const mdi = markdownIt({html: true});
mdi.use(markdownItLatex);
import _ from 'lodash';

import {postAjaxPromise} from "./communication_react.js"
import {propsAreEqual} from "./utilities_react.js";
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


function SuggestionItemAdvanced({item, handleClick, modifiers}) {
    let display_text = "display_text" in item ? item.display_text : item.text;
    let the_icon = "icon" in item ? item.icon : null;
    if (item.isgroup) {
        return (
            <MenuDivider className="tile-form-menu-item" title={display_text}/>
        )
    } else {
        return (
            <MenuItem
                className="tile-form-menu-item"
                text={display_text}
                key={display_text}
                icon={the_icon}
                onClick={handleClick}
                active={modifiers.active}
                shouldDismissPopover={true}
            />
        );
    }
}

SuggestionItemAdvanced = memo(SuggestionItemAdvanced);

SuggestionItemAdvanced.propTypes = {
    item: PropTypes.object,
    modifiers: PropTypes.object,
    handleClick: PropTypes.func
};

function renderSuggestionAdvanced(item, {modifiers, handleClick, index}) {
    return <SuggestionItemAdvanced item={item} key={index} modifiers={modifiers} handleClick={handleClick}/>
}

function BpSelectAdvanced({options, value, onChange, buttonIcon}) {
    function _filterSuggestion(query, item) {
        if (query.length === 0) {
            return true
        }
        let re = new RegExp(query.toLowerCase());

        let the_text;
        if (typeof item == "object") {
            the_text = item["text"]
        } else {
            the_text = item
        }
        return re.test(the_text.toLowerCase())
    }

    function _getActiveItem(val) {
        for (let option of options) {
            if (_.isEqual(option, val)) {
                return option
            }
        }
        return null
    }

    let display_text = "display_text" in value ? value.display_text : value.text;
    return (
        <Select2
            activeItem={_getActiveItem(value)}
            onActiveItemChange={null}
            itemRenderer={renderSuggestionAdvanced}
            itemPredicate={_filterSuggestion}
            items={options}
            onItemSelect={onChange}
            popoverProps={{
                minimal: true,
                boundary: "window",
                modifiers: {flip: false, preventOverflow: true},
                position: PopoverPosition.BOTTOM_LEFT
            }}>
            <Button text={display_text} className="button-in-select" icon={buttonIcon}/>
        </Select2>
    )
}

BpSelectAdvanced = memo(BpSelectAdvanced);

BpSelectAdvanced.propTypes = {
    options: PropTypes.array,
    onChange: PropTypes.func,
    value: PropTypes.object,
    buttonIcon: PropTypes.string,
};

BpSelectAdvanced.defaultProps = {
    buttonIcon: null,
};

function BpSelect(props) {

    const [activeItem, setActiveItem] = useState(null);

    function _filterSuggestion(query, item) {
        if ((query.length === 0) || (item["isgroup"])) {
            return true
        }
        let re = new RegExp(query.toLowerCase());

        let the_text;
        if (typeof item == "object") {
            the_text = item["text"]
        } else {
            the_text = item
        }
        return re.test(the_text.toLowerCase())
    }

    function _handleActiveItemChange(newActiveItem) {
        let the_text;
        if (typeof item == "object") {
            the_text = newActiveItem["text"]
        } else {
            the_text = newActiveItem
        }
        setActiveItem(the_text);
    }

    return (
        <Select2
            className="tile-form-menu-item"
            activeItem={activeItem}
            filterable={props.filterable}
            onActiveItemChange={_handleActiveItemChange}
            itemRenderer={renderSuggestion}
            itemPredicate={_filterSuggestion}
            items={_.cloneDeep(props.options)}
            onItemSelect={props.onChange}
            popoverProps={{
                minimal: true,
                boundary: "window",
                modifiers: {flip: false, preventOverflow: true},
                position: props.popoverPosition
            }}>
            <Button className="button-in-select"
                    style={props.buttonStyle}
                    small={props.small}
                    text={props.buttonTextObject ? props.buttonTextObject : props.value}
                    icon={props.buttonIcon}/>
        </Select2>
    )

}

BpSelect = memo(BpSelect, (prevProps, newProps) => {
    propsAreEqual(newProps, prevProps, ["buttonTextObject"])
});

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

function SuggestionItem({item, modifiers, handleClick}) {
    let the_text;
    let the_icon;
    if (typeof item == "object") {
        the_text = item["text"];
        the_icon = item["icon"]
    } else {
        the_text = item;
        the_icon = null
    }
    return (
        <MenuItem
            className="tile-form-menu-item"
            text={the_text}
            icon={the_icon}
            active={modifiers.active}
            onClick={() => handleClick(the_text)}
            shouldDismissPopover={true}
        />
    );
}

SuggestionItem = memo(SuggestionItem);

SuggestionItem.propTypes = {
    item: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object]),
    modifiers: PropTypes.object,
    handleClick: PropTypes.func,
};


function renderSuggestion(item, {modifiers, handleClick, index}) {
    return <SuggestionItem item={item} key={index} modifiers={modifiers} handleClick={handleClick}/>
}

const renderCreateNewTag = (query, active, handleClick) => {
    let hclick = handleClick;
    return (
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

function NativeTags(props) {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        let data_dict = {"pane_type": props.pane_type, "is_repository": false};
        if (!props.pane_type) {
            setSuggestions([]);
            return
        }
        postAjaxPromise("get_tag_list", data_dict)
            .then(data => {
                let all_tags = data.tag_list;
                setSuggestions(all_tags)
            })
    }, [props.pane_type]);

    function renderTag(item) {
        return item
    }

    function _createItemFromQuery(name) {
        return name
    }

    function _handleDelete(tag, i) {
        let new_tlist = [...props.tags];
        new_tlist.splice(i, 1);
        props.handleChange(new_tlist)
    }

    function _handleAddition(tag) {
        let new_tlist = [...props.tags];
        new_tlist.push(tag);
        props.handleChange(new_tlist)
    }

    function _filterSuggestion(query, item) {
        if (query.length === 0) {
            return false
        }
        let re = new RegExp(`^${query}`);
        return re.test(item)
    }

    if (props.readOnly) {
        return (<TagInput values={props.tags} disabled={true}/>)
    }

    return (
        <MultiSelect
            allowCreate={true}
            openOnKeyDown={true}
            createNewItemFromQuery={_createItemFromQuery}
            createNewItemRenderer={renderCreateNewTag}
            resetOnSelect={true}
            itemRenderer={renderSuggestion}
            selectedItems={props.tags}
            allowNew={true}
            items={suggestions}
            itemPredicate={_filterSuggestion}
            tagRenderer={renderTag}
            tagInputProps={{onRemove: _handleDelete}}
            onItemSelect={_handleAddition}/>
    )
}

NativeTags = memo(NativeTags);

NativeTags.proptypes = {
    tags: PropTypes.array,
    handleChange: PropTypes.func,
    pane_type: PropTypes.string,
    readOnly: PropTypes.bool,
};

function NotesField(props) {
    const [mdHeight, setMdHeight] = useState(500);
    const [showMarkdown, setShowMarkdown] = useState(() => {
        return hasOnlyWhitespace() ? false : props.show_markdown_initial
    });
    const awaitingFocus = useRef(false);

    var mdRef = useRef(null);
    var notesRef = useRef(null);

    useEffect(() => {
        if (awaitingFocus.current) {
            focusNotes();
            awaitingFocus.current = false
        } else if (hasOnlyWhitespace()) {
            if (showMarkdown) {
                // If we are here, then we are reusing a notes field that previously showed markdown
                // and now is empty. We want to prevent markdown being shown when a character is typed.
                setShowMarkdown(false)
            }
        } else if (!showMarkdown && (notesRef.current !== document.activeElement)) {
            // If we are here it means the change was initiated externally
            _showMarkdown()
        }
    });

    function getNotesField() {
        return $(notesRef.current)
    }

    function hasOnlyWhitespace() {
        return !props.notes.trim().length
    }

    function getMarkdownField() {
        return $(mdRef.current)
    }

    function focusNotes() {
        getNotesField().focus()
    }

    function _notesRefHandler(the_ref) {
        notesRef.current = the_ref
    }

    function _hideMarkdown() {
        if (props.readOnly) return;
        awaitingFocus.current = true;  // We can't set focus until the input is visible
        setShowMarkdown(false);
    }

    function _handleMyBlur() {
        _showMarkdown();
        if (props.handleBlur != null) {
            props.handleBlur()
        }
    }

    function _showMarkdown() {
        if (!hasOnlyWhitespace()) {
            setShowMarkdown(true)
        }
    }

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
        converted_markdown = mdi.render(props.notes)
    }

    let converted_dict = {__html: converted_markdown};
    return (
        <Fragment>
            <TextArea
                rows="20"
                cols="75"
                inputRef={_notesRefHandler}
                growVertically={false}
                onBlur={_handleMyBlur}
                onChange={props.handleChange}
                value={props.notes}
                disabled={props.readOnly}
                style={notes_style}
            />
            <div ref={mdRef}
                 style={md_style}
                 onClick={_hideMarkdown}
                 className="notes-field-markdown-output"
                 dangerouslySetInnerHTML={converted_dict}/>
        </Fragment>
    )
}

NotesField = memo(NotesField);

NotesField.propTypes = {
    readOnly: PropTypes.bool,
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
    var cat_entry = {text: category, display_text: category, isgroup: true};
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

function IconSelector({handleSelectChange, icon_val}) {
    return (
        <BpSelectAdvanced options={icon_dlist}
                          onChange={(item) => {
                              handleSelectChange(item.val)
                          }}
                          buttonIcon={icon_val}
                          value={icon_entry_dict[icon_val]}/>
    )
}

IconSelector = memo(IconSelector);

IconSelector.propTypes = {
    handleSelectChange: PropTypes.func,
    icon_val: PropTypes.string
};

function CombinedMetadata(props) {
    const [auxIsOpen, setAuxIsOpen] = useState(false);
    const [tempNotes, setTempNotes] = useState(null);
    const updateDelay = 500;
    const notesTimer = useRef(null);

    function _handleNotesChange(event) {
        if (notesTimer.current) {
            clearTimeout(notesTimer.current);
            notesTimer.current = null;
        }
        let new_val = event.target.value;
        notesTimer.current = setTimeout(() => {
            notesTimer.current = null;
            props.handleChange({"notes": new_val})
        }, updateDelay);
        setTempNotes(new_val);
    }

    function _handleTagsChange(tags) {
        props.handleChange({"tags": tags})
    }

    function _handleTagsChangeNative(tags) {
        props.handleChange({"tags": tags})
    }

    function _handleCategoryChange(event) {
        props.handleChange({"category": event.target.value})
    }

    function _handleIconChange(icon) {
        props.handleChange({"icon": icon})
    }

    function _toggleAuxVisibility() {
        setAuxIsOpen(!auxIsOpen)
    }

    let addition_field_style = {fontSize: 14};
    let additional_items;
    let current_notes = notesTimer.current ? tempNotes : props.notes;
    if (props.additional_metadata != null) {
        additional_items = [];
        for (let field in props.additional_metadata) {
            let md = props.additional_metadata[field];
            if (Array.isArray(md)) {
                md = md.join(", ")
            } else if (field == "collection_name") {
                let sresult = /\.\w*$/.exec(md);
                if (sresult != null) md = sresult[0].slice(1)
            }
            additional_items.push(
                <FormGroup label={field + ": "} className="metadata-form_group" key={field} inline={true}>
                    {/*<InputGroup disabled={true} value={md} fill={true}/>*/}
                    <span className="bp4-ui-text metadata-field">{String(md)}</span>
                </FormGroup>
            )
        }
    }
    let button_base = auxIsOpen ? "Hide" : "Show";
    return (
        <Card elevation={props.elevation} className="combined-metadata accent-bg" style={props.outer_style}>
            {props.name != null &&
                <H4><Icon icon={icon_dict[props.res_type]}
                          style={{marginRight: 6, marginBottom: 2}}/>{props.name}</H4>}
            <FormGroup label="Tags">
                <NativeTags tags={props.tags}
                            readOnly={props.readOnly}
                            handleChange={_handleTagsChange}
                            pane_type={props.pane_type}/>
            </FormGroup>
            {props.category != null &&
                <FormGroup label="Category">
                    <InputGroup onChange={_handleCategoryChange}
                                value={props.category}/>
                </FormGroup>
            }
            {props.icon != null &&
                <FormGroup label="Icon">
                    <IconSelector icon_val={props.icon}
                                  handleSelectChange={_handleIconChange}/>
                </FormGroup>
            }
            <FormGroup label="Notes">
                <NotesField notes={current_notes}
                            readOnly={props.readOnly}
                            handleChange={_handleNotesChange}
                            show_markdown_initial={true}
                            handleBlur={props.handleNotesBlur}
                />
                {props.notes_buttons && props.notes_buttons()}
            </FormGroup>
            <FormGroup label="Created: " className="metadata-form_group" inline={true}>
                <span className="bp4-ui-text metadata-field">{props.created}</span>
            </FormGroup>
            {props.updated != null &&
                <FormGroup label="Updated: " className="metadata-form_group" inline={true}>
                    <span className="bp4-ui-text metadata-field">{props.updated}</span>
                </FormGroup>
            }
            {props.additional_metadata != null &&
                additional_items
            }
            {props.aux_pane != null &&
                <Fragment>
                    <div className="d-flex flex-row justify-content-around" style={{marginTop: 20}}>
                        <Button fill={false}
                                small={true}
                                minimal={false}
                                onClick={_toggleAuxVisibility}>
                            {button_base + " " + props.aux_pane_title}
                        </Button>
                    </div>
                    <Collapse isOpen={auxIsOpen} keepChildrenMounted={true}>
                        {props.aux_pane}
                    </Collapse>
                </Fragment>
            }
            <div style={{height: 100}}/>
        </Card>
    )
}

CombinedMetadata = memo(CombinedMetadata);

CombinedMetadata.propTypes = {
    outer_style: PropTypes.object,
    readOnly: PropTypes.bool,
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
    aux_pane_title: PropTypes.string,
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

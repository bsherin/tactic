import "../tactic_css/tactic_select.scss"

import React from "react";
import {Fragment, useState, useEffect, useRef, memo, useContext, useCallback} from "react";

import {
    PopoverPosition, Button, MenuDivider, MenuItem, TagInput, FormGroup, InputGroup,
    Card, Icon, H4
} from "@blueprintjs/core";
import {Select, MultiSelect} from "@blueprintjs/select";
import {SettingsContext} from "./settings";

import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';

hljs.registerLanguage('javascript', javascript);

import python from 'highlight.js/lib/languages/python';

hljs.registerLanguage('python', python);

import markdownIt from 'markdown-it'
import 'markdown-it-latex/dist/index.css'
import markdownItLatex from 'markdown-it-latex'

const mdi = markdownIt({
    html: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return '<pre><code class="hljs">' +
                    hljs.highlight(str, {language: lang, ignoreIllegals: true}).value +
                    '</code></pre>';
            } catch (__) {
            }
        }
        return '<pre><code class="hljs">' + mdi.utils.escapeHtml(str) + '</code></pre>';
    }
});

mdi.use(markdownItLatex);
import _ from 'lodash';

import {propsAreEqual, useDebounce, guid, useImmerReducerAndRef, useCallbackStack} from "./utilities_react";
import {tile_icon_dict} from "./icon_info";

import {useSize} from "./sizing_tools";
import {ErrorBoundary} from "./error_boundary";
import {postAjaxPromise} from "./communication_react";
import {ReactCodemirror6} from "./react-codemirror6";

export {icon_dict};
export {NotesField, CombinedMetadata, BpSelect, BpSelectAdvanced}

let icon_dict = {
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

function renderSuggestionAdvanced(item, {modifiers, handleClick, index}) {
    return <SuggestionItemAdvanced item={item} key={index} modifiers={modifiers} handleClick={handleClick}/>
}

function BpSelectAdvanced({options, value, onChange, buttonIcon = null, readOnly}) {
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
        <ErrorBoundary>
            <Select
                activeItem={_getActiveItem(value)}
                itemRenderer={renderSuggestionAdvanced}
                itemPredicate={_filterSuggestion}
                items={options}
                disabled={readOnly}
                onItemSelect={onChange}
                popoverProps={{
                    minimal: true,
                    boundary: "window",
                    modifiers: {flip: false, preventOverflow: true},
                    position: PopoverPosition.BOTTOM_LEFT
                }}>
                <Button text={display_text} className="button-in-select" icon={buttonIcon}/>
            </Select>
        </ErrorBoundary>
    )
}

BpSelectAdvanced = memo(BpSelectAdvanced);

function BpSelect(props) {
    props = {
        buttonIcon: null,
        buttonStyle: {},
        popoverPosition: PopoverPosition.BOTTOM_LEFT,
        buttonTextObject: null,
        filterable: true,
        small: undefined,
        ...props
    };

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

    function _getActiveItem(val) {
        for (let option of props.options) {
            if (_.isEqual(option, val)) {
                return option
            }
        }
        return null
    }

    return (
        <Select
            activeItem={_getActiveItem(props.value)}
            className="tile-form-menu-item"
            filterable={props.filterable}
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
        </Select>
    )
}

BpSelect = memo(BpSelect, (prevProps, newProps) => {
    propsAreEqual(newProps, prevProps, ["buttonTextObject"])
});

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
            items={props.all_tags}
            itemPredicate={_filterSuggestion}
            tagRenderer={renderTag}
            tagInputProps={{onRemove: _handleDelete}}
            onItemSelect={_handleAddition}/>
    )
}

NativeTags = memo(NativeTags);

function NotesField(props) {
    props = {
        handleBlur: null,
        ...props
    };
    const setFocusFunc = useRef(null);

    const settingsContext = useContext(SettingsContext);

    useEffect(() => {
    }, [props.mStateRef.current.notes]);

    useEffect(() => {
        // console.log("theme changed")  // This is to force re-rendering because of highlight.js theme change
    }, [settingsContext.settings.theme]);

    const [mdHeight, setMdHeight] = useState(500);
    const [showMarkdown, setShowMarkdown] = useState(hasOnlyWhitespace() ? false : props.show_markdown_initial);
    const awaitingFocus = useRef(false);
    const cmObject = useRef(null);

    var mdRef = useRef(null);

    useEffect(() => {
        if (awaitingFocus.current) {
            focusNotes();
            awaitingFocus.current = false
        }
        if (cmObject.current && !cmObject.current.hasFocus) {
            setShowMarkdown(!hasOnlyWhitespace());
        }
    });

    useEffect(()=>{
        setShowMarkdown(!hasOnlyWhitespace());
    }, [props.res_name, props.res_type]);

    function hasOnlyWhitespace() {
        return !props.mStateRef.current.notes || !props.mStateRef.current.notes.trim().length
    }

    function getMarkdownField() {
        return mdRef.current
    }

    function focusNotes() {
        setFocusFunc.current()
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

    function _setCmObject(cmobject) {
        cmObject.current = cmobject
    }

     const registerSetFocusFunc = useCallback((theFunc) => {
        setFocusFunc.current = theFunc;
    }, []);

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
        converted_markdown = mdi.render(props.mStateRef.current.notes)
    }

    let converted_dict = {__html: converted_markdown};
    return (
        <Fragment>
            {!really_show_markdown &&
            <ReactCodemirror6 handleChange={props.handleChange}
                              readOnly={props.readOnly}
                              setCMObject={_setCmObject}
                              handleBlur={_handleMyBlur}
                              registerSetFocusFunc={registerSetFocusFunc}
                              show_line_numbers={false}
                              controlled={false}
                              mode="markdown"
                              code_content={props.mStateRef.current.notes}
                              no_height={true}
                              saveMe={null}/>
            }
            <div ref={mdRef}
                 style={md_style}
                 onClick={_hideMarkdown}
                 className="notes-field-markdown-output markdown-heading-sizes"
                 dangerouslySetInnerHTML={converted_dict}/>
        </Fragment>
    )
}

NotesField = memo(NotesField);

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

function IconSelector({handleSelectChange, icon_val, readOnly}) {
    let value = icon_entry_dict[icon_val] ? icon_entry_dict[icon_val] : icon_entry_dict["application"];
    return (
        <ErrorBoundary>
            <BpSelectAdvanced options={icon_dlist}
                              onChange={(item) => {
                                  handleSelectChange(item.val)
                              }}
                              readOnly={readOnly}
                              buttonIcon={icon_val}
                              value={value}/>
        </ErrorBoundary>
    )
}

IconSelector = memo(IconSelector);

const primary_mdata_fields = ["name", "created",
    "updated", "tags", "notes"];
const ignore_fields = ["doc_type", "res_type"];

const initial_state = {
    allTags: [],
    tags: null,
    created: null,
    updated: null,
    notes: null,
    icon: null,
    category: null,
    additional_metadata: null
};

function metadataReducer(draft, action) {
    switch (action.type) {
        case "set_tags":
            draft.tags = action.value;
            break;
        case "set_notes":
            draft.notes = action.value;
            break;
        case "append_to_notes":
            draft.notes = draft.notes + action.value;
            break;
        case "set_icon":
            draft.icon = action.value;
            break;
        case "set_category":
            draft.category = action.value;
            break;
        case "set_additional_metadata":
            draft.additional_metadata = action.value;
            break;
        case "set_all_tags":
            draft.allTags = action.value;
            break;
        case "set_created":
            draft.created = action.value;
            break;
        case "set_updated":
            draft.updated = action.value;
            break;
        case "multi_update":
            for (let field in action.value) {
                draft[field] = action.value[field]
            }
            break;
        default:
            break;
    }
}

function CombinedMetadata(props) {
    props = {
        expandWidth: true,
        tabSelectCounter: 0,
        useTags: true,
        useNotes: true,
        outer_style: {overflow: "auto", padding: 15},
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
        ...props
    };
    const top_ref = useRef();

    const [mState, mDispatch, mStateRef] = useImmerReducerAndRef(metadataReducer, initial_state);

    const pushCallback = useCallbackStack();

    const updatedIdRef = useRef(null);
    const [waiting, doUpdate] = useDebounce((state_stuff) => {
        postChanges(state_stuff)
            .then(() => {
            });
    });

    const [usable_width, usable_height, topX, topY] = useSize(top_ref, props.tabSelectCounter, "CombinedMetadata");

    useEffect(() => {
        if (props.tsocket != null && !props.is_repository && !props.useFixedData) {
            function handleExternalUpdate(data) {
                if (data.res_type == props.res_type && data.res_name == props.res_name && data.mdata_uid != updatedIdRef.current) {
                    grabMetadata()
                }
            }
            props.tsocket.attachListener("resource-updated", handleExternalUpdate);
            return () => {
                props.tsocket.detachListener("resource-updated");
            };
        }
    }, [props.tsocket, props.res_name, props.res_type]);

    useEffect(() => {
        grabMetadata()
    }, [props.res_name, props.res_type]);

    function grabMetadata() {
        if (props.useFixedData || props.res_name == null || props.res_type == null) return;
        if (!props.readOnly) {
            let data_dict = {
                pane_type: props.res_type,
                is_repository: false,
                show_hidden: true
            };
            postAjaxPromise("get_tag_list", data_dict)
                .then(data => {
                    mDispatch({"type": "set_all_tags", "value": data.tag_list})
                })
        }
        postAjaxPromise("grab_metadata", {
            res_type: props.res_type,
            res_name: props.res_name,
            is_repository: props.is_repository
        })
            .then(data => {
                let updater ={
                    "tags": data.tags,
                    "notes": data.notes,
                    "created": data.datestring,
                    "updated": data.additional_mdata.updated
                };
                let amdata = data.additional_mdata;
                delete amdata.updated;
                if (data.additional_mdata.icon) {
                    updater["icon"] = data.additional_mdata.icon
                }
                if (data.additional_mdata.category) {
                    updater["category"] = data.additional_mdata.category;
                    delete amdata.category
                }
                updater["additional_metadata"] = amdata;
                mDispatch({type: "multi_update", value: updater})
            })
            .catch((e) => {
                console.log("error getting metadata", e)
            })
    }

    async function postChanges(state_stuff) {

        const result_dict = {
            "res_type": props.res_type,
            "res_name": props.res_name,
            "tags": "tags" in state_stuff ? state_stuff["tags"] : mStateRef.current.tags,
            "notes": "notes" in state_stuff ? state_stuff["notes"] : mStateRef.current.notes,
            "icon": "icon" in state_stuff ? state_stuff["icon"] : mStateRef.current.icon,
            "category": "category" in state_stuff ? state_stuff["category"] : mStateRef.current.category,
            "mdata_uid": guid()
        };
        try {
            await postAjaxPromise("save_metadata", result_dict);
            updatedIdRef.current = result_dict["mdata_uid"];
        } catch (e) {
            console.log("error saving metadata ", e)
        }
    }

    async function _handleMetadataChange(state_stuff, post_immediate=true) {
        mDispatch({type: "multi_update", "value": state_stuff});
        if (post_immediate) {
            await postChanges(state_stuff)
        }
        else {
            doUpdate(state_stuff)
        }
    }

    async function appendToNotes(text) {
        mDispatch({type: "append_to_notes", "value": text});
        pushCallback(async () => {
            await postChanges({"notes": mStateRef.current.notes})
        })
    }

    async function _handleNotesChange(new_text) {
        await _handleMetadataChange({"notes": new_text}, false);
    }

    async function _handleTagsChange(tag_list) {
        await _handleMetadataChange({"tags": tag_list.join(" ")});
    }

    async function _handleCategoryChange(event) {
        await _handleMetadataChange({"category": event.target.value})
    }

    async function _handleIconChange(icon) {
        await _handleMetadataChange({"icon": icon})
    }

    let addition_field_style = {fontSize: 14};
    let additional_items;

    if (props.useFixedData) {
        additional_items = [];
        for (let field in props.fixedData) {
            let md = props.fixedData[field];
            additional_items.push(
                <FormGroup label={field + ": "} className="metadata-form_group" key={field} inline={true}>
                    <span className="bp5-ui-text metadata-field">{String(md)}</span>
                </FormGroup>
            )
        }
    }
    else if (mStateRef.current.additionalMdata != null) {
        additional_items = [];
        for (let field in mStateRef.current.additionalMdata) {
            let md = mStateRef.current.additionalMdata[field];
            if (Array.isArray(md)) {
                md = md.join(", ")
            } else if (field == "collection_name") {
                let sresult = /\.\w*$/.exec(md);
                if (sresult != null) md = sresult[0].slice(1)
            }
            additional_items.push(
                <FormGroup label={field + ": "} className="metadata-form_group" key={field} inline={true}>
                    <span className="bp5-ui-text metadata-field">{String(md)}</span>
                </FormGroup>
            )
        }
    }
    let ostyle = props.outer_style ? _.cloneDeep(props.outer_style) : {};
    if (props.expandWidth) {
        ostyle["width"] = "100%";
    } else {
        ostyle["width"] = usable_width;
    }
    let split_tags = !mStateRef.current.tags || mStateRef.current.tags == "" ? [] : mStateRef.current.tags.split(" ");
    const MetadataNotesButtons = props.notes_buttons;
    return (
        <ErrorBoundary>
            <Card ref={top_ref}
                  elevation={props.elevation} className="combined-metadata accent-bg" style={ostyle}>
                {props.res_name != null &&
                    <H4><Icon icon={icon_dict[props.res_type]}
                              style={{marginRight: 6, marginBottom: 2}}/>{props.res_name}</H4>}
                {!props.useFixedData && props.useTags && mStateRef.current.tags != null && mStateRef.current.allTags.length > 0 &&
                    <FormGroup label="Tags">
                        <NativeTags key={`${props.res_name}-${props.res_type}-tags`}
                                    tags={split_tags}
                                    all_tags={mStateRef.current.allTags}
                                    readOnly={props.readOnly}
                                    handleChange={_handleTagsChange}
                                    res_type={props.res_type}/>
                    </FormGroup>
                }

                {!props.useFixedData && mStateRef.current.category != null &&
                    <FormGroup label="Category" key={`${props.res_name}-${props.res_type}-cagegory`}>
                        <InputGroup onChange={_handleCategoryChange}
                                    value={mStateRef.current.category}/>
                    </FormGroup>
                }
                {mStateRef.current.icon != null &&
                    <FormGroup label="Icon">
                        <IconSelector key={`${props.res_name}-${props.res_type}-icon-selector`}
                                      icon_val={mStateRef.current.icon}
                                      readOnly={props.readOnly}
                                      handleSelectChange={_handleIconChange}/>
                    </FormGroup>
                }
                {!props.useFixedData && props.useNotes && mStateRef.current.notes != null &&
                    <FormGroup label="Notes">
                        <NotesField key={`${props.res_name}-${props.res_type}-notes`}
                                    mStateRef={mStateRef}
                                    res_name={props.res_name}
                                    res_type={props.res_type}
                                    readOnly={props.readOnly}
                                    handleChange={_handleNotesChange}
                                    show_markdown_initial={true}
                                    handleBlur={props.handleNotesBlur}
                        />
                        {props.notes_buttons &&
                            <MetadataNotesButtons appendToNotes={appendToNotes}/>
                        }
                    </FormGroup>
                }
                {mStateRef.current.created != null &&
                    <FormGroup label="Created: " className="metadata-form_group" inline={true}>
                        <span className="bp5-ui-text metadata-field">{mStateRef.current.created}</span>
                    </FormGroup>
                }
                {mStateRef.current.updated != null &&
                    <FormGroup label="Updated: " className="metadata-form_group" inline={true}>
                        <span className="bp5-ui-text metadata-field">{mStateRef.current.updated}</span>
                    </FormGroup>
                }
                {additional_items && additional_items.length > 0 &&
                    additional_items
                }
                <div style={{height: 100}}/>
            </Card>
        </ErrorBoundary>
    )
}

CombinedMetadata = memo(CombinedMetadata);

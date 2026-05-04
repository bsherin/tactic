// noinspection JSValidateTypes

import React, {memo, useContext, useEffect, useMemo, useRef, useState} from "react";
import {
    Button,
    Collapse,
    ControlGroup,
    ButtonGroup,
    Divider,
    Switch,
    Icon,
    EntityTitle,
    H4,
    H6,
    Menu, MenuItem, ContextMenu, Card, FormGroup, InputGroup
} from "@blueprintjs/core";
import {
    DndContext,
    useSensor,
    useSensors,
    PointerSensor,
    rectIntersection
} from '@dnd-kit/core';
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

import {CSSTransition} from 'react-transition-group';
import {ErrorBoundary} from "./error_boundary";

import {BpSelectAdvanced} from "./selector_advanced";
import {ReactCodemirror6} from "./react-codemirror6";
import {guid, isInt, useStateAndRef} from "./utilities_react"
import {MakerPaneContext} from "./tile_maker_support";
import {LabeledFormField, LabeledSelectList, LabeledTextArea, LabeledSelectAdvancedList} from "./blueprint_react_widgets";
import {NativeTags, IconSelector, NotesField} from "./combined_metadata";
import {postPromise} from "./communication_react";
import {DragHandle} from "./drag_handle";
import {SearchForm} from "./library_widgets";
import {widgetInfo, widgetDefaults} from "./widget_info";

export {
    CmElement, PaneElement, MakerNavigator, OptionModuleForm, WidgetModuleForm, ExportModuleForm, DividerElement, pane_type_icons,
    MetadataModule, option_icons, INITIAL_CODE_PANE_HEIGHT, INITIAL_FORM_PANE_HEIGHT
}

const INITIAL_CODE_PANE_HEIGHT = 330;
const INITIAL_FORM_PANE_HEIGHT = 125;

const NAV_ITEM_SPACER_HEIGHT = 10;
const NAV_ITEM_SPACER_HEIGHT_EMPTY_SECTION = 20;

const pane_type_icons = {
    "option": "select",
    "widget": "widget",
    "export": "export",
    "metadata": "properties",
    "save": "floppy-disk",
    "user_method": "user",
    "render_content": "control",
    "globals": "globe",
    "javascript": "function",
    "handler_method": "wrench",
};

function textRowsToArray(tstring) {
    let slist = [];
    for (let item of tstring.toString().split("\n")) {
        slist.push(item)
    }
    return slist
}

function arrayToTextRows(ar) {
    let nstring = "";
    let isfirst = true;
    for (let item of ar) {
        if (!isfirst) {
            nstring += "\n";
        } else {
            isfirst = false
        }
        nstring += String(item)
    }
    return nstring
}

function correctType(type, val, error_flag = "__ERROR__") {
    let result;
    if (val == null || val.length == 0) {
        return null
    }
    switch (type) {
        case "int":
            if (isInt(val)) {
                result = typeof val == "number" ? val : parseInt(val)
            } else {
                result = error_flag
            }
            break;
        case "float":
            if (isNaN(Number(val)) && isNaN(parseFloat(val))) {
                result = error_flag
            } else {
                result = typeof val == "number" ? val : parseFloat(val)
            }
            break;
        case "boolean":
            if (typeof val == "boolean") {
                result = val
            } else {
                let lval = val.toLowerCase();
                if (lval == "false") {
                    result = false
                } else if (lval == "true") {
                    result = true;
                } else {
                    result = error_flag;
                }
            }
            break;
        default:
            result = val;
            break;
    }
    return result
}


let draghandle_position_dict = {position: "absolute", bottom: 2, left: 0};

function SimplePaneTitle(props) {
    props = {
        title: "",
        subtitle: null,
        icon: null,
        ...props
    };

    let theIcon = <Icon icon={props.icon} size={13}/>;

    return (
        <div className="creator-simple-title">
            <EntityTitle title={props.title} heading={H6} subtitle={props.subtitle} icon={theIcon}/>
        </div>
    )
}

function AnimatedItem({visible, children}) {
    const nodeRef = useRef(null);
    return (
        <CSSTransition
            in={visible}
            timeout={300}
            classNames="fade"
            nodeRef={nodeRef}
            unmountOnExit={false}
            mountOnEnter={false}
        >
            <div ref={nodeRef} className="fade-container">{children}</div>
        </CSSTransition>
    );
}

function PaneElement(props) {
    props = {
        identifier: null,
        dispatch: () => {
        },
        pane_scroll_ref: null,
        allowDelete: false,
        children: null,
        pane_height: 0,
        className: "",
        icon: null,
        visible: false,
        updateItem: null,
        ...props,
    };
    const top_ref = useRef(null);
    const height_ref = useRef(props.pane_height);

    const mpContext = useContext(MakerPaneContext);

    const [resizing, set_resizing] = useState(false);
    const [, set_dwidth] = useState(0);
    const [dheight, set_dheight] = useState(0);

    useEffect(() => {
        if (props.pane_scroll_ref.current == props.identifier) {
            requestAnimationFrame(() => {
                const el = top_ref.current;
                if (el != null) {
                    el.scrollIntoView({behavior: 'smooth', block: 'center'});
                    props.pane_scroll_ref.current = null;
                }

            });
        }
    }, [props.pane_scroll_ref.current, top_ref.current]);

    function _startResize() {
        set_resizing(true);
        set_dwidth(0);
        set_dheight(0);
        if (top_ref.current) {
            const rect = top_ref.current.getBoundingClientRect();
            height_ref.current = rect.height;
        }
    }

    function _onResize(e, ui, x, y, dx, dy) {
        set_dwidth(dx);
        set_dheight(dy);
    }

    function _stopResize(e, ui, x, y, dx, dy) {
        resize_pane(dx, dy);
        set_resizing(false);
        set_dwidth(0);
        set_dheight(0);
    }

    function resize_pane(dx, dy) {
        if (props.updateItem) {
            props.updateItem({
                pane_height: height_ref.current + dy
            });
            return;
        }
        props.dispatch({
                type: "update_item",
                identifier: props.identifier,
                new_item: {pane_height: height_ref.current + dy}
            }
        )
    }

    const current_height = resizing
        ? height_ref.current + dheight
        : props.pane_height;

    function _deleteMe() {
        props.dispatch({type: "delete_item", identifier: props.identifier})
    }

    return (
        <AnimatedItem visible={props.visible} identifier={props.identifier}>
            <Card ref={top_ref} key={props.identifier} elevation={0}
                  className={`maker-pane ${props.className}`}
                  style={{
                      height: current_height, position: "relative", display: "flex",
                      flexDirection: "column"
                  }}>
                <Button variant="minimal" size="small" icon="cross"
                        className='maker-pane-button maker-pane-left-button'
                        onClick={() => {
                            mpContext.toggleVisibleTab(props.identifier)
                        }}/>
                {props.allowDelete &&
                    <Button variant="minimal" intent="danger" size="small" icon="trash"
                            className='maker-pane-button maker-pane-right-button'
                            onClick={_deleteMe}/>
                }
                {!props.allowDelete && props.icon &&
                    <Icon icon={props.icon} size={20} intent="primary"
                          className='maker-pane-button maker-pane-right-button'/>
                }
                {props.children}
                <DragHandle position_dict={draghandle_position_dict}
                            iconSize={20}
                            useThinBar={true}
                            dragStart={_startResize}
                            onDrag={_onResize}
                            dragEnd={_stopResize}
                            direction="y"/>
            </Card>
        </AnimatedItem>
    )
}

function MetadataModule(props) {
    props = {
        metadataRef: null,
        mdata: null,
        option_list_ref: null,
        export_list_ref: null,
        readOnly: false,
        res_name: null,
        res_type: "tile",
        registerCmObject: null,
        metadataDispatch: () => {
        },
        ...props
    };

    useEffect(() => {
        get_all_tags()
    }, []);


    function get_all_tags() {
        let data_dict = {
            res_type: "tile",
            is_repository: false,
            show_hidden: true
        };
        postPromise("host", "get_all_tags_task", data_dict)
            .then(data => {
                props.metadataDispatch({"type": "set_all_tags", "value": data.tag_list})
            })
    }

    function handleTagsChange(new_tags) {
        let tags = new_tags.join(" ");
        if (tags.length > 0 && tags[tags.length - 1] == " ") {
            tags = tags.slice(0, -1);
        }
        props.metadataDispatch({"type": "set_tags", "value": tags});
    }

    function handleCategoryChange(event) {
        props.metadataDispatch({"type": "set_category", "value": event.target.value})
    }

    function handleIconChange(new_icon) {
        props.metadataDispatch({"type": "set_icon", value: new_icon});
    }

    function handleNotesChange(new_notes) {
        props.metadataDispatch({"type": "set_notes", "value": new_notes});
    }

    function handleCoupleChange(event) {
        props.metadataDispatch({"type": "set_couple", "value": event.target.checked});
    }

    function appendToNotes(new_text) {
        props.metadataDispatch({"type": "append_to_notes", "value": new_text});
    }


    function appendOptionText() {
        let res_string = "\n\noptions: \n\n";
        for (let opt of props.option_list_ref.current) {
            res_string += ` * \`${opt.name}\` (${opt.type}): \n`
        }
        appendToNotes(res_string);
    }

    function appendExportText() {
        let res_string = "\n\nexports: \n\n";
        for (let exp of props.export_list_ref.current) {
            res_string += ` * \`${exp.name}\` : \n`
        }
        appendToNotes(res_string);
    }

    function MetadataNotesButtons(props) {
        return (
            <ButtonGroup>
                <Button style={{height: "fit-content", alignSelf: "start", marginTop: 10, fontSize: 12}}
                        text="Add Options"
                        size="small"
                        variant="minimal"
                        intent="primary"
                        icon="select"
                        onClick={e => {
                            e.preventDefault();
                            appendOptionText(props.appendToNotes)
                        }}/>
                <Button style={{height: "fit-content", alignSelf: "start", marginTop: 10, fontSize: 12}}
                        text="Add Exports"
                        size="small"
                        variant="minimal"
                        intent="primary"
                        icon="export"
                        onClick={e => {
                            e.preventDefault();
                            appendExportText(props.appendToNotes)
                        }}/>
            </ButtonGroup>
        )
    }

    let outer_style = {
        width: "100%",
        height: "100%",
        overflow: "auto",
    };

    const split_tags = props.metadataRef.current.tags.split(" ");

    return (
        <div className="creator-metadata-outer" style={outer_style}>
            <SimplePaneTitle title="Metadata" icon="properties"/>
            <ErrorBoundary custom_message="Error in NativeTags">
                <FormGroup label="Tags">
                    <NativeTags key={`${props.res_name}-${props.res_type}-tags`}
                                tags={split_tags}
                                all_tags={props.mdata.allTags}
                                readOnly={props.readOnly}
                                handleChange={handleTagsChange}
                                res_type="tile"/>
                </FormGroup>
            </ErrorBoundary>
            <ErrorBoundary custom_message="Error in Category">
                <FormGroup label="Category" key="Category">
                    <InputGroup onChange={handleCategoryChange}
                                value={props.metadataRef.current.category}/>
                </FormGroup>
            </ErrorBoundary>
            <ErrorBoundary custom_message="Error in Icon">
                <FormGroup label="Icon">
                    <IconSelector key={`${props.res_name}-${props.res_type}-icon-selector`}
                                  icon_val={props.metadataRef.current.icon}
                                  readOnly={props.readOnly}
                                  handleSelectChange={handleIconChange}/>
                </FormGroup>
            </ErrorBoundary>
            <ErrorBoundary custom_message="Error in Notes">
                <FormGroup label="Notes">
                    <NotesField key={`${props.res_name}-${props.res_type}-notes`}
                                mStateRef={props.metadataRef}
                                res_name={props.res_name}
                                res_type={props.res_type}
                                readOnly={props.readOnly}
                                setCMObject={props.registerCmObject}
                                handleChange={handleNotesChange}
                                show_markdown_initial={true}
                                handleBlur={null}
                    />
                    <MetadataNotesButtons/>
                </FormGroup>
            </ErrorBoundary>
            <ErrorBoundary custom_message="Error in bottom stuff">
                <Switch label="Couple save_attrs and exports"
                        className="ml-2 mb-0 mt-1"
                        size="medium"
                        checked={props.metadataRef.current.couple_save_attrs_and_exports}
                        onChange={handleCoupleChange}/>
            </ErrorBoundary>
        </div>
    )
}

MetadataModule = memo(MetadataModule);

function ExportModuleForm(props) {
    props = {
        exportItem: null,
        dispatch: () => {
        },
        ...props
    };

    function handleNameChange(event) {
        props.dispatch({
            type: "update_item",
            new_item: {name: event.target.value},
            identifier: props.exportItem.identifier
        });
    }

    function handleTagChange(event) {
        props.dispatch({
            type: "update_item",
            new_item: {tags: event.target.value},
            identifier: props.exportItem.identifier
        });
    }

    return (
        <div>
            <SimplePaneTitle icon={pane_type_icons["export"]} title={props.exportItem.name}/>
            <form className="maker-form-container">
                <div style={{display: "flex", flexWrap: "wrap", flexDirection: "row"}}>
                    <LabeledFormField label="Name" onChange={handleNameChange} the_value={props.exportItem.name}/>
                    <LabeledFormField label="Tags" onChange={handleTagChange} the_value={props.exportItem.tags}/>
                </div>
            </form>
        </div>
    )
}

ExportModuleForm = memo(ExportModuleForm);

const option_types = ['text', 'int', 'float', 'boolean', 'textarea', 'codearea', 'column_select', 'document_select',
    'list_select', 'collection_select', 'palette_select', 'pipe_select', 'custom_list', 'function_select',
    'class_select', 'tile_select', 'divider', 'pool_select', 'multi_select'];
const taggable_types = ["class_select", "function_select", "pipe_select", "list_select", "collection_select"];

const option_icons = {
    text: "label",
    int: "numerical",
    float: "numerical",
    boolean: "switch",
    textarea: "text-highlight",
    codearea: "code",
    column_select: "column-layout",
    document_select: "document",
    list_select: "list",
    collection_select: "folder-shared",
    palette_select: "color-fill",
    pipe_select: "flow-branch",
    custom_list: "list-detail-view",
    multi_select: "multi-select",
    function_select: "function",
    class_select: "curly-braces",
    tile_select: "application",
    divider: "minus",
    pool_select: "folder-open"
};

function OptionModuleForm(props) {
    props = {
        optionItem: null,
        dispatch: () => {
        },
        ...props
    };

    function handleNameChange(event) {
        props.dispatch({
            type: "update_item",
            new_item: {name: event.target.value},
            identifier: props.optionItem.identifier
        });
    }

    function handleDisplayTextChange(event) {
        props.dispatch({
            type: "update_item",
            new_item: {display_text: event.target.value},
            identifier: props.optionItem.identifier
        });
    }

    function handleDefaultChange(event) {
        let val = props.optionItem.type == "boolean" ? event.target.checked : event.target.value;
        let fixed_val = correctType(props.optionItem.type, val);
        if (fixed_val == "__ERROR__") {
            props.dispatch({
                type: "update_item",
                new_item: {default_warning_text: "Invalid value"},
                identifier: props.optionItem.identifier
            });
        } else {
            props.dispatch({type: "update_item", new_item: {default: val}, identifier: props.optionItem.identifier});
        }
    }

    function handleTagChange(event) {
        props.dispatch({
            type: "update_item",
            new_item: {tags: event.target.value},
            identifier: props.optionItem.identifier
        });
    }

    function handleSpecialListChange(event) {
        props.dispatch({
            type: "update_item",
            new_item: {special_list: textRowsToArray(event.target.value)},
            identifier: props.optionItem.identifier
        });
    }

    function handlePoolTypeChange(event) {
        props.dispatch({
            type: "update_item",
            new_item: {pool_select_type: event.currentTarget.value},
            identifier: props.optionItem.identifier
        });
    }

    function handleTypeChange(new_type) {
        let updater = {"type": new_type};
        if (!["custom_list", "multi_select"].includes(new_type)) {
            updater["special_list"] = []
        }
        if (!taggable_types.includes(new_type)) {
            updater["tags"] = ""
        }
        if (new_type == "boolean") {
            updater["default"] = false
        }
        if (new_type != "pool_select") {
            updater["pool_select_type"] = ""
        }
        props.dispatch({type: "update_item", new_item: updater, identifier: props.optionItem.identifier});
    }

    return (
        <div>
            <SimplePaneTitle icon={pane_type_icons["option"]} title={props.optionItem.name}/>
            <div>
                <form className="maker-form-container">
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <div style={{display: "flex", flexWrap: "wrap", flexDirection: "row"}}>
                            <LabeledFormField label="Name" onChange={handleNameChange} the_value={props.optionItem.name}
                                              className="code-font" helperText={props.optionItem["name_warning_text"]}
                            />
                            <LabeledSelectAdvancedList label="Type" option_list={option_types} onChange={handleTypeChange}
                                               the_value={props.optionItem.type}/>
                            <LabeledFormField label="Display Text" onChange={handleDisplayTextChange}
                                              the_value={props.optionItem.display_text}
                            />
                            {props.optionItem.type != "divider" &&
                                <LabeledFormField label="Default" onChange={handleDefaultChange}
                                                  the_value={props.optionItem.default}
                                                  isBool={props.optionItem.type == "boolean"}
                                                  helperText={props.optionItem.default_warning_text}
                                />
                            }
                            {["custom_list", "multi_select"].includes(props.optionItem.type) &&
                                <LabeledTextArea label="Special List"
                                                 className="code-font"
                                                 onChange={handleSpecialListChange}
                                                 the_value={arrayToTextRows(props.optionItem.hasOwnProperty("special_list") ?
                                                     props.optionItem.special_list : [])}
                                />}
                            {taggable_types.includes(props.optionItem.type) &&
                                <LabeledFormField label="Tag" onChange={handleTagChange}
                                                  className="code-font"
                                                  the_value={props.optionItem.tags}/>
                            }
                            {props.optionItem.type == "pool_select" &&
                                <LabeledSelectList label="Type" option_list={["file", "folder", "both"]}
                                                   onChange={handlePoolTypeChange}
                                                   the_value={props.optionItem.pool_select_type}/>
                            }
                        </div>
                    </div>

                </form>
            </div>
        </div>
    )
}

OptionModuleForm = memo(OptionModuleForm);


function WidgetModuleForm(props) {
    props = {
        widgetItem: null,
        dispatch: () => {
        },
        ...props
    };

    function handleFieldChange(field, event) {
        if (field == "kind") {
            handleKindChange(event);
            return
        }
        let fieldKind = widgetInfo[props.widgetItem.kind][field].type;
        let the_value;
        switch (fieldKind) {
            case "boolean":
                the_value = event.target.checked;
                break;
            case "number":
                the_value = event.target.value;
                if (the_value.length == 0 || the_value.endsWith("."))
                    break;
                the_value = Number(event.target.value);
                if (Number.isNaN(the_value)) {
                    the_value = event.target.value
                }
                break;
            case "list":
                the_value = textRowsToArray(event.target.value);
                break;
            default:
                the_value = event.target.value
        }
        let new_item = {}
        new_item[field] = the_value
        props.dispatch({type: "update_item", new_item: new_item, identifier: props.widgetItem.identifier})
    }

    function handleKindChange(new_kind) {
        let new_entry = {...widgetDefaults[new_kind]};
        new_entry.name = props.widgetItem.name;
        new_entry.pane_height = props.widgetItem.pane_height;
        new_entry.identifier = props.widgetItem.identifier;
        props.dispatch({type: "set_item", new_item: new_entry, identifier: props.widgetItem.identifier});
    }

    const fieldList = Object.keys(widgetDefaults[props.widgetItem.kind]);

    return (
        <div key={props.widgetItem.identifier}>
            <SimplePaneTitle icon={pane_type_icons["widget"]} title={props.widgetItem.name}/>
            <div>
                <form className="maker-form-container">
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <div style={{display: "flex", flexWrap: "wrap", flexDirection: "row"}}>
                            {fieldList.map((field) =>{
                                switch (widgetInfo[props.widgetItem.kind][field].type) {
                                    case "boolean":
                                        return (
                                            <LabeledFormField label={field} the_value={props.widgetItem[field]}
                                                              key={field}
                                                              isBool={true}
                                                              onChange={(event)=>{handleFieldChange(field, event)}}/>
                                        )
                                    case "text_box":
                                        return (
                                            <LabeledTextArea label={field} the_value={props.widgetItem[field]}
                                                             key={field}
                                                             onChange={(event)=>{handleFieldChange(field, event)}}/>
                                        )
                                    case "code_box":
                                        return (
                                            <LabeledTextArea label={field} the_value={props.widgetItem[field]}
                                                             key={field}
                                                             className="code-font" onChange={(event)=>{
                                                    handleFieldChange(field, event)}}/>
                                        )
                                    case "list":
                                        return (
                                            <LabeledTextArea label={field} the_value={arrayToTextRows(props.widgetItem[field])}
                                                             key={field}
                                                             className="code-font"
                                                             onChange={(event)=>{
                                                    handleFieldChange(field, event)}}/>
                                        )
                                    case "select":
                                        return (
                                           <LabeledSelectList label="Type" the_value={props.widgetItem[field]}
                                                              key={field}
                                                              option_list={widgetInfo[props.widgetItem.kind][field].options}
                                                              onChange={(event)=>{handleFieldChange(field, event)}}/>
                                        )
                                    case "select_advanced":
                                        return (
                                           <LabeledSelectAdvancedList label="Type" the_value={props.widgetItem[field]}
                                                              key={field}
                                                              option_list={widgetInfo[props.widgetItem.kind][field].options}
                                                              onChange={(event)=>{handleFieldChange(field, event)}}/>
                                        )
                                    case "method":
                                      return (
                                            <LabeledFormField label={field} the_value={props.widgetItem[field]}
                                                              key={field}
                                                              isBool={false} className="code-font"
                                                              onChange={(event)=>{handleFieldChange(field, event)}}/>
                                        )
                                    case "code_string":
                                      return (
                                            <LabeledFormField label={field} the_value={props.widgetItem[field]}
                                                              key={field}
                                                              isBool={false} className="code-font"
                                                              onChange={(event)=>{handleFieldChange(field, event)}}/>
                                        )
                                    default:
                                          return (
                                            <LabeledFormField label={field} the_value={props.widgetItem[field]}
                                                              key={field}
                                                              isBool={false}
                                                              onChange={(event)=>{handleFieldChange(field, event)}}/>
                                        )
                                }
                            })}
                        </div>
                    </div>

                </form>
            </div>
        </div>
    )
}

WidgetModuleForm = memo(WidgetModuleForm);

function SignatureHeader(props) {
    props = {
        name: "",
        argString: "",
        mode: "python",
        handleNameChange: () => {
        },
        handleArgChange: () => {
        },
        allowSignatureChange: false,
        registerCmObject: null,
        ...props
    };

    const lastNameRef = useRef(props.name);
    const lastArgStringRef = useRef(props.argString);

    function getEditableRanges(lineText) {
        if (props.mode == "python") {
            const match = lineText.match(/^def\s+(\w+)\s*\(([^)]*)\):/);
            if (!match) return [];

            const [, funcName, argsStr] = match;

            // Find function name range
            const shortLineText = lineText.slice(4);
            const funcNameStart = shortLineText.indexOf(funcName) + 4;
            const funcNameEnd = funcNameStart + funcName.length;

            // Compute where the argument list starts and ends
            const openParenIndex = lineText.indexOf("(");
            const closeParenIndex = lineText.indexOf(")", openParenIndex);
            if (openParenIndex === -1 || closeParenIndex === -1) return [];

            // Determine start of editable args: after 'self,' or after '(' if no 'self'
            let editableStart = openParenIndex + 1;

            const selfMatch = argsStr.match(/^\s*self\s*(,)?/);
            if (selfMatch) {
                // Skip past 'self' and optional comma
                editableStart = lineText.indexOf("self") + "self".length;
                if (selfMatch[1]) {
                    editableStart = lineText.indexOf(",", editableStart) + 1;
                }
            }

            // Trim leading whitespace
            while (lineText[editableStart] === " " || lineText[editableStart] === ",") {
                editableStart++;
            }

            return [
                {from: funcNameStart, to: funcNameEnd},
                {from: editableStart, to: closeParenIndex}
            ];
        } else if (props.mode == "javascript") {
            const match = lineText.match(/^function\s+(\w+)\s*/);
            if (!match) return [];

            const [, funcName,] = match;

            // Find function name range
            const shortLineText = lineText.slice(9);
            const funcNameStart = shortLineText.indexOf(funcName) + 9;
            const funcNameEnd = funcNameStart + funcName.length;
            return [
                {from: funcNameStart, to: funcNameEnd},
            ]
        } else {
            return []
        }


    }

    function handleSignatureChange(new_signature) {
        // Extract the function name and arguments from the new signature
        if (props.mode == "python") {
            let match = new_signature.match(/^def\s+(\w+)\s*\(([^)]*)\):/);
            let funcName;
            let argsStr;
            if (!match) {
                match = new_signature.match(/^def\s+\s*\(([^)]*)\):/);
                if (!match) {
                    funcName = lastNameRef.current;
                    argsStr = lastArgStringRef.current + "*";
                } else {
                    [, argsStr] = match;
                    funcName = "method";
                }
            } else {
                [, funcName, argsStr] = match;
            }

            // remove "self," from the argsStr if it exists
            const selfMatch = argsStr.match(/^\s*self\s*(,)?/);
            if (selfMatch) {
                // Remove 'self' and optional comma
                argsStr = argsStr.replace(/^\s*self\s*(,)?/, "").trim();
                if (argsStr.startsWith(",")) {
                    argsStr = argsStr.slice(1).trim(); // Remove leading comma if present
                }
            }

            // Update the name and argString props
            lastNameRef.current = funcName;
            lastArgStringRef.current = argsStr;
            props.handleNameChange(funcName);
            props.handleArgChange(argsStr);
        } else {

            let match = new_signature.match(/^function\s+(\w+)\s*/);
            let funcName;
            if (!match) {
                // match = new_signature.match(/^function\s+\s*\(/);
                funcName = "func";
            } else {
                [, funcName] = match;
            }

            lastNameRef.current = funcName;
            props.handleNameChange(funcName);
        }
    }

    let code_content;
    if (props.mode == "javascript") {
        code_content = `function ${props.name}(selector, w, h, value, setValue, resizing)`;
    } else if (props.name == "globals") {
        code_content = "# globals"
    } else {
        code_content = `def ${props.name}(self, ${props.argString}):`;
    }
    const handleChange = props.allowSignatureChange ? handleSignatureChange : null;
    return (
        <div className="d-flex flex-row cm-signature"
             style={{justifyContent: "space-between"}}>
            {props.mode == "javascipt" ?
                <ReactCodemirror6 readOnly={!props.allowSignatureChange}
                                  mode="javascript"
                                  show_line_numbers={false}
                                  no_height={true}
                                  controlled={true}
                                  setCMObject={props.registerCmObject}
                                  getEditableRanges={getEditableRanges}
                                  restrict_edits_to_range={props.allowSignatureChange}
                                  className="creator-code-header"
                                  handleChange={null}
                                  no_width={true}
                                  parentService="module_viewer"
                                  code_content={code_content}/> :
                <ReactCodemirror6 readOnly={!props.allowSignatureChange}
                                  mode={props.mode}
                                  show_line_numbers={false}
                                  no_height={true}
                                  controlled={true}
                                  setCMObject={props.registerCmObject}
                                  getEditableRanges={getEditableRanges}
                                  restrict_edits_to_range={props.allowSignatureChange}
                                  className="creator-code-header"
                                  no_width={true}
                                  parentService="module_viewer"
                                  handleChange={handleChange}
                                  code_content={code_content}/>
            }
        </div>
    )
}

function DividerElement(props) {
    props = {
        text: "",
        icon: "minus",
        ...props
    };

    return (
        <div style={{
            display: "flex", flexDirection: "row", paddingTop: 25, paddingBottom: 15,
            position: "relative", width: "100%"
        }}>
            <EntityTitle title={props.text} icon={props.icon} heading={H4}/>
            <Divider style={{flex: "1 1 0", marginLeft: 10, marginRight: 10, borderRight: "0px"}}/>
        </div>
    )
}

function CmElement(props) {
    props = {
        cmState: null,
        allowDelete: false,
        code_content: "",
        cmDispatch: null,
        updateItem: null,
        cmObjectRef: null,
        name: "",
        argString: "",
        identifier: "",
        extraKeys: null,
        saveAndCheckpoint: null,
        searchState: null,
        searchDispatch: null,
        clearAllSelections: null,
        search_ref: null,
        pushCallback: null,
        tsocket: null,
        extraSelfCompletions: null,
        local_id: null,
        show_search: true,
        no_height: false,
        allowSignatureChange: true,
        registerCmObject: null,
        ...props
    };

    const [doScroll, setDoScroll] = useState(props.cmState.scrollTop != null);

    function handleCodeChange(new_code) {
        if (props.updateItem) {
            props.updateItem({codeText: new_code});
            return;
        }
        props.cmDispatch({type: "update_item", new_item: {codeText: new_code}, identifier: props.identifier});
    }

    function handleNameChange(new_name) {
        if (props.updateItem) {
            props.updateItem({name: new_name});
            return;
        }
        props.cmDispatch({type: "update_item", new_item: {name: new_name}, identifier: props.identifier});
    }

    function handleArgChange(new_args) {
        if (props.updateItem) {
            props.updateItem({argString: new_args});
            return;
        }
        props.cmDispatch({type: "update_item", new_item: {argString: new_args}, identifier: props.identifier});
    }

    function setCmObject(cmObject) {
        if (props.updateItem) {
            props.updateItem({cmObject: cmObject}, true);
        } else {
            props.cmDispatch({
                type: "update_item",
                new_item: {cmObject: cmObject},
                identifier: props.identifier
            }, true);
        }

        if (doScroll) {
            setDoScroll(false);
            requestAnimationFrame(() => {
                // The timeout below is necessary because I can't do this until the cmObject is fully initialized
                setTimeout(() => {
                    cmObject.scrollDOM.scrollTop = props.cmState.scrollTop;
                }, 100)
            });
        }
    }

    let outer_style = {
        width: "100%",
        flex: "1 1 0",
        overflow: "auto",
        paddingLeft: 0,
        position: "relative",
        display: "flex",
        flexDirection: "column"
    };

    return (
        <div style={outer_style} className="cm-element-container">
            <SignatureHeader name={props.name}
                             argString={props.argString}
                             mode={props.cmState.mode}
                             registerCmObject={props.registerCmObject}
                             allowSignatureChange={props.allowSignatureChange}
                             handleNameChange={handleNameChange}
                             handleArgChange={handleArgChange}/>
            <ReactCodemirror6 code_content={props.cmState.codeText}
                              controlled={true}
                              flex_size={true}
                              show_search={false}
                              mode={props.cmState.mode}
                              extraKeys={props.extraKeys()}
                              handleChange={handleCodeChange}
                              setCMObject={setCmObject}
                              alt_clear_selections={props.clearAllSelections}
                              first_line_number={props.cmState.firstLineNumber}
                              readOnly={false}
                              current_search_number={props.searchState.current_search_cm == props.identifier ?
                                  props.searchState.current_search_number : null}
                              search_term={props.searchState.search_string}
                              updateSearchState={null}
                              regex_search={props.searchState.use_regex}
                              search_ref={null}
                              searchPrev={null}
                              searchNext={null}
                              search_matches={null}
                              setSearchMatches={null}
                              tsocket={props.tsocket}
                              no_width={true}
                              extraSelfCompletions={props.cmState.mode == "python" ? props.extraSelfCompletions : []}
                              local_id={props.local_id}
                              parentService="module_viewer"
                              highlight_active_line={true}/>
        </div>
    )
}

function MakerNavigator(props) {
    props = {
        handleTabSelect: () => {
        },
        sections: [],
        icon_dict: null,
        icon_field: null,
        registerCmObject: () => {
        },
        pushCallback: () => {
        },
        ...props
    };
    const [, setSearchString, searchStringRef] = useStateAndRef("");
    const sections = props.sections.filter(section => section.visible === true);  // saveattrs may be hidden
    function _update_search_state(new_state) {
        setSearchString(new_state.search_string)
    }

    return (
        <ErrorBoundary custom_message="There was an error in the Maker Navigator">
            <SearchForm allow_search_inside={false}
                        placeholder="Filter items..."
                        allow_search_metadata={false}
                        update_search_state={_update_search_state}
                        search_string={searchStringRef.current}
            />
            <div style={{overflow: "auto", height: "100%"}} className="maker-navigator">
                {sections.map((section,) => {
                    let createFromlist = section.createFromList ? section.createFromList : false;
                    let choiceDict = section.choiceDict ? section.choiceDict : null;
                    if (section.kind == "divider") {
                        return (
                            <NavDivider key={section.name} name={section.name}/>
                        )
                    }
                    if (section.kind == "direct") {
                        return (
                            <DirectNavSection key={section.name} title={section.name}
                                              item_list={null}
                                              className={section.className}
                                              identifier={section.identifier}
                                              icon={section.icon}/>
                        )
                    }
                    if (section.editable) {
                        return (
                            <SortableNavSection key={section.title} title={section.title} dispatch={section.dispatch}
                                                registerCmObject={props.registerCmObject}
                                                sub_items={section.sub_items} icon={section.icon}
                                                showAsCode={section.showAsCode}
                                                showSignature={section.showSignature}
                                                showDefault={section.showDefault}
                                                mode={section.mode}
                                                showSelf={section.showSelf}
                                                pushCallback={props.pushCallback}
                                                startExpaneded={section.start_expanded}
                                                createFromList={createFromlist}
                                                searchStringRef={searchStringRef}
                                                choiceDict={choiceDict}
                                                item_base={section.item_base}
                                                icon_dict={section.icon_dict} icon_field={section.icon_field}/>
                        )
                    } else {
                        return (
                            <NavSection key={section.title} title={section.title} dispatch={section.dispatch}
                                        sub_items={section.sub_items} icon={section.icon}
                                        searchStringRef={searchStringRef}
                                        startExpaneded={section.start_expanded}
                                        icon_dict={section.icon_dict} icon_field={section.icon_field}/>
                        )
                    }
                })}
            </div>
        </ErrorBoundary>
    )
}

function NavSection(props) {
    props = {
        "title": "",
        "sub_items": [],
        "startExpanded": true,
        "right_button": null,
        icon_dict: null,
        icon_field: null,
        searchStringRef: null,
        ...props
    };
    const [isOpen, setIsOpen] = React.useState(props.startExpanded);

    function filterItem(item) {
        return props.searchStringRef.current == null || props.searchStringRef.current === "" || item.name.toLowerCase().includes(props.searchStringRef.current.toLowerCase())
    }

    // noinspection JSValidateTypes
    return (
        <div className="nav-section">
            <ButtonGroup key="button-group">
                <Button variant="minimal"
                        className='nav-section-button'
                        icon={props.icon}
                        size="medium"
                        onClick={() => {
                            setIsOpen(!isOpen)
                        }}>
                    {props.title}
                </Button>
                {props.right_button != null && props.right_button}
            </ButtonGroup>
            <Collapse key="collapse" isOpen={isOpen}>
                {props.sub_items
                    .filter(filterItem)
                    .map((item,) => {
                        let icon = props.icon_dict ?
                            <Icon icon={props.icon_dict[item[props.icon_field]]} size={12}/> : null;
                        let isDivider = props.icon_dict && item[props.icon_field] === "divider";
                        return (
                            <NavItem key={item.identifier} isDivider={isDivider} identifier={item.identifier}
                                     title={item.name} icon={icon}
                                     item_list={item.item_list}/>
                        )
                    })
                }
            </Collapse>
        </div>
    );
}

function DirectNavSection(props) {
    props = {
        title: "",
        item_list: [],
        identifier: "",
        isDivider: false,
        directSet: null,
        className: "direct-nav-section-button",
        ...props
    };
    const mpContext = useContext(MakerPaneContext);
    const className = props.className;

    return (
        <ControlGroup>
            <Button className={className}
                    icon={props.icon}
                    intent={mpContext.visibleTabList.includes(props.identifier) ? "primary" : "none"}
                    size="medium"
                    variant="minimal"
                    onClick={() => {
                        mpContext.toggleVisibleTab(props.identifier)
                    }}>
                {props.title}
            </Button>
        </ControlGroup>
    );
}


function HandlerCreator(props) {
    props = {
        choiceDict: null,
        dispatch: null,
        ...props
    };

    const [selectedChoice, setSelectedChoice] = useState({
        text: Object.keys(props.choiceDict)[0],
        value: Object.keys(props.choiceDict)[0],
        isgroup: false
    });

    const mpContext = useContext(MakerPaneContext);

    const fullChoiceList = useMemo(() => {
        return Object.keys(props.choiceDict).map(choice => ({
            text: choice,
            value: choice,
            isgroup: false
        }));
    });

    function createItemFromChoiceDict() {
        const uid = guid();
        const new_entry = {
            name: selectedChoice.value,
            argString: props.choiceDict[selectedChoice.value],
            codeText: "",
            mode: "python", firstLineNumber: 1,
            identifier: uid,
        };
        props.dispatch({type: "add_at_end", new_item: new_entry});
        mpContext.pushCallback(() => {
            mpContext.toggleVisibleTab(uid);
        });
    }

    return (
        <div style={{marginLeft: 25, marginRight: 25, marginBottom: 10}}>
            <InputGroup
                size="small"
                leftElement={<BpSelectAdvanced options={fullChoiceList}
                                               value={selectedChoice}
                                               onChange={setSelectedChoice}/>}
                rightElement={<Button icon="plus" size="small" variant="minimal" onClick={createItemFromChoiceDict}/>}
            />
        </div>
    )
}

function NavDivider(props) {
    props = {
        name: "divider",
        ...props
    };
    return (
        <Divider key={name} style={{
            width: '90%',
            marginTop: 10,
            marginBottom: 10
        }}/>
    )
}

function SortableNavSection(props) {
    props = {
        title: "",
        item_base: {},
        sub_items: [],
        right_button: null,
        icon_dict: null,
        icon_field: null,
        createFromList: false,
        choiceDict: null,
        selectedChoice: null,
        setSelectedChoice: null,
        startExpanded: false,
        searchStringRef: null,
        showAsCode: false,
        showSignature: false,
        showDefault: false,
        showSelf: false,
        mode: "python",
        pushCallback: () => {
        },
        registerCmObject: () => {
        },
        dispatch: () => {
        },
        ...props
    };

    const [activeId, setActiveId] = React.useState(null);
    const [isOpen, setIsOpen] = React.useState(props.startExpanded);

    const sensors = useSensors(useSensor(PointerSensor, {activationConstraint: {distance: 5}}));

    const handleDragEnd = (event) => {
        const {active, over} = event;
        if (!over || active.id === over.id) return;

        const oldIndex = props.sub_items.findIndex((i) => i.identifier === active.id);
        const newIndex = over.id === '__drop_spacer__'
            ? props.sub_items.length
            : props.sub_items.findIndex(i => i.identifier === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
            setActiveId(active.id);
            props.dispatch({
                type: "move_item",
                oldIndex,
                newIndex
            });
        }
        props.pushCallback(() => {
            setActiveId(null);
        })
    };

    const mpContext = useContext(MakerPaneContext);

    function filterItem(item) {
        return props.searchStringRef.current == null || props.searchStringRef.current === "" || item.name.toLowerCase().includes(props.searchStringRef.current.toLowerCase())
    }


    function createItem() {
        const uid = guid();
        const new_entry = {...props.item_base, identifier: uid};
        props.dispatch({type: "add_at_end", new_item: new_entry});
        setIsOpen(true);
        mpContext.pushCallback(() => {
            mpContext.toggleVisibleTab(uid);
        });
    }

    const contextMenu = useMemo(() => {
        return (
            <Menu>
                <MenuItem icon="plus"
                          onClick={createItem}
                          intent="primary"
                          text="Create Item"/>
            </Menu>
        );
    }, []);

    let inSubSection = false;
    let currentSubSectionParent = null;
    let currentlyExpanded = false;
    return (
        <ContextMenu content={contextMenu}>
            <div className="sortable-nav-section">
                {props.createFromList &&
                    <ControlGroup vertical={true} style={{alignItems: "self-start"}}>
                        <Button className="nav-section-button"
                                variant="minimal"
                                icon={props.icon} size="medium"
                                onClick={() => {
                                    setIsOpen(!isOpen)
                                }}>
                            {props.title}
                        </Button>
                        {isOpen &&
                            <HandlerCreator choiceDict={props.choiceDict} dispatch={props.dispatch}/>
                        }
                    </ControlGroup>
                }
                {!props.createFromList &&
                    <ButtonGroup>
                        <Button className="nav-section-button"
                                variant="minimal"
                                icon={props.icon} size="medium"
                                onClick={() => {
                                    setIsOpen(!isOpen)
                                }}>
                            {props.title}
                        </Button>
                        <Button icon="plus" size="small" variant="minimal" onClick={createItem}/>
                    </ButtonGroup>
                }
                <Collapse className="nav-section" isOpen={isOpen}>
                    <DndContext sensors={sensors} collisionDetection={rectIntersection} onDragEnd={handleDragEnd}>
                        <SortableContext items={[...props.sub_items.map(i => i.identifier), '__drop_spacer__']}
                                         strategy={verticalListSortingStrategy}>
                            {props.sub_items
                                .filter(filterItem)
                                .map((item,) => {
                                    if (item.identifier === activeId) {
                                        return null; // Don't render the item being dragged
                                    }
                                    let icon = props.icon_dict ?
                                        <Icon icon={props.icon_dict[item[props.icon_field]]} size={12}/> : null;
                                    let isDivider = (props.icon_dict && item[props.icon_field] === "divider") || item.name.includes("divider");
                                    if (isDivider) {
                                        inSubSection = true;
                                        currentlyExpanded = mpContext.expandedSubList.includes(item.identifier)
                                    }
                                    else {
                                        if (inSubSection && !currentlyExpanded) {
                                            return null
                                        }
                                    }
                                    return (
                                        <SortableNavItem key={item.identifier} identifier={item.identifier}
                                                         title={item.name}
                                                         registerCmObject={props.registerCmObject}
                                                         showAsCode={props.showAsCode}
                                                         showSignature={props.showSignature}
                                                         showDefault={props.showDefault}
                                                         showSelf={props.showSelf}
                                                         mode={props.mode}
                                                         default={item.default}
                                                         argString={item.argString}
                                                         activeId={activeId}
                                                         isDivider={isDivider}
                                                         inSubSection={inSubSection}
                                                         expanded={item.expanded ? item.expanded : false}
                                                         icon={icon}
                                                         item_list={item.item_list}
                                                         dispatch={props.dispatch}/>
                                    )
                                })}
                            <SortableNavItem
                                key="__drop_spacer__"
                                is_empty_section={props.sub_items.length === 0}
                                identifier="__drop_spacer__"
                                activeId={activeId}
                                isSpacer={true}
                            />
                        </SortableContext>
                    </DndContext>
                </Collapse>
            </div>
        </ContextMenu>
    );
}

function SortableNavItem(props) {
    props = {
        identifier: null,
        activeId: null,
        isSpacer: false,
        isDivider: false,
        dispatch: null,
        showSignature: false,
        argString: null,
        is_empty_section: false,
        showDefault: false,
        showSelf: false,
        default: null,
        registerCmObject: ()=>{
        },
        ...props
    };
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: props.identifier});

    const mpContext = useContext(MakerPaneContext);

    let style = {
        transform: CSS.Transform.toString(transform),
    };
    if (props.inSubSection && !props.isDivider) {
        style.marginLeft = "10px"
    }

    if (props.isSpacer) {
        style.height = props.is_empty_section ? NAV_ITEM_SPACER_HEIGHT_EMPTY_SECTION : NAV_ITEM_SPACER_HEIGHT;
        style.transition = 'none'
    } else if (props.activeId) {
        style.transition = 'none'
    } else {
        style.transition = transition
    }


    function _deleteMe() {
        props.dispatch({type: "delete_item", identifier: props.identifier})
    }

    function _toggleDividerVisibility() {
        mpContext.toggleVisibleTab(props.identifier)

    }

    const delete_icon = <Icon icon="delete" size={12}/>;
    const edit_icon = <Icon icon="edit" size={12}/>;

    const contextMenu = useMemo(() => {
        return (
            <Menu>
                <MenuItem icon="delete"
                          onClick={_deleteMe}
                          intent="danger"
                          text="Delete Item"/>
            </Menu>
        );
    }, []);

    return (
        <ContextMenu content={contextMenu}>
            <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="sortable-nav-item">
                <ButtonGroup>
                    <NavItem {...props} />
                    {props.isSpacer ? null :
                        <Button icon={delete_icon} size="small" variant="minimal" className="show-on-hover"
                                tabIndex={-1} onClick={_deleteMe}/>
                    }
                    {!props.isDivider ? null :
                         <Button icon={edit_icon} size="small" variant="minimal" className="show-on-hover"
                                tabIndex={-1} onClick={_toggleDividerVisibility}/>
                    }
                </ButtonGroup>
            </div>
        </ContextMenu>
    );
}


function NavItem(props) {
    props = {
        title: "",
        is_empty_section: false,
        item_list: [],
        identifier: "",
        isDivider: false,
        showAsCode: false,
        showSignature: false,
        showDefault: false,
        showSelf: false,
        mode: "python",
        default: null,
        argString: null,
        registerCmObject: ()=>{},
        ...props
    };
    const mpContext = useContext(MakerPaneContext);

    if (props.isSpacer) {
        return (<ControlGroup>
            <Button className='spacer-nav-item maker-nav-item'
                    icon={null}
                    intent="none"
                    size="medium"
                    variant="minimal"
                    onClick={() => {
                    }}>
                {props.is_empty_section ? "..." : ""}
            </Button>
        </ControlGroup>)
    }

    const className = `maker-nav-item ${props.isDivider ? 'nav-divider' : ''} `;
    let buttonText = null;
    if (props.showAsCode && !props.isDivider) {
        if (props.showSignature) {
            // buttonText = <span style={{fontFamily: "monospace", fontSize: 12}}><span style={{fontWeight: 600}}>{props.title}</span>({props.argString})</span>
            let code = `def ${props.title}(${props.argString}):`;
            buttonText = (
                <ReactCodemirror6 readOnly={true}
                                  isLite={true}
                                  mode={props.mode}
                                  setCMObject={props.registerCmObject}
                                  show_line_numbers={false}
                                  no_height={true}
                                  controlled={true}
                                  getEditableRanges={null}
                                  restrict_edits_to_range={false}
                                  className="creator-code-header"
                                  no_width={true}
                                  parentService="module_viewer"
                                  handleChange={null}
                                  hideLeadingChars={4}
                                  code_content={code}/>
            )
        } else if (props.showDefault) {
            let code = `${props.title} = ${props.default}`;
            buttonText = (
                <ReactCodemirror6 readOnly={true}
                                  isLite={true}
                                  mode={props.mode}
                                  setCMObject={props.registerCmObject}
                                  show_line_numbers={false}
                                  no_height={true}
                                  controlled={true}
                                  getEditableRanges={null}
                                  restrict_edits_to_range={false}
                                  className="creator-code-header"
                                  no_width={true}
                                  parentService="module_viewer"
                                  handleChange={null}
                                  code_content={code}/>
            )
        } else if (props.showSelf) {
            let code = `self.${props.title}`;
            buttonText = (
                <ReactCodemirror6 readOnly={true}
                                  isLite={true}
                                  mode={props.mode}
                                  show_line_numbers={false}
                                  no_height={true}
                                  controlled={true}
                                  setCMObject={props.registerCmObject}
                                  getEditableRanges={null}
                                  restrict_edits_to_range={false}
                                  className="creator-code-header"
                                  no_width={true}
                                  parentService="module_viewer"
                                  handleChange={null}
                                  code_content={code}/>
            )

        } else if (props.mode == "javascript") {
            let code = `function ${props.title}()`;
            buttonText = (
                <ReactCodemirror6 readOnly={true}
                                  isLite={true}
                                  mode={props.mode}
                                  show_line_numbers={false}
                                  no_height={true}
                                  controlled={true}
                                  setCMObject={props.registerCmObject}
                                  getEditableRanges={null}
                                  restrict_edits_to_range={false}
                                  className="creator-code-header"
                                  no_width={true}
                                  parentService="module_viewer"
                                  handleChange={null}
                                  hideLeadingChars={9}
                                  code_content={code}/>
            )
        }
    }
    if (buttonText == null) {
        buttonText = <span style={{fontFamily: "monospace"}}>{props.title}</span>
    }


    let dot_opacity = mpContext.visibleTabList.includes(props.identifier) && !props.isDivider ? 1 : 0

    let fullButton = (
        <span>
            <Icon icon="record" size={10} style={{ opacity: dot_opacity, verticalAlign: "middle"}} />
            {buttonText}
        </span>
    )

    return (
        <ControlGroup>
            <Button className={className}
                    icon={props.icon}
                    size="medium"
                    variant="minimal"
                    ellipsizeText={true}
                    text={fullButton}
                    onClick={() => {
                        if (props.isDivider) {
                            mpContext.toggleExpandedSub(props.identifier)
                        }
                        else {
                            mpContext.toggleVisibleTab(props.identifier)
                        }

                    }}/>
        </ControlGroup>
    );
}


import React, {memo, useContext, useState} from "react";
import {Fragment} from "react";
import {Button, Collapse, ControlGroup, FormGroup, InputGroup, ButtonGroup, Switch} from "@blueprintjs/core";
import {
    DndContext,
    closestCenter,
    useSensor,
    useSensors,
    PointerSensor,
} from '@dnd-kit/core';
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';


import {ErrorBoundary} from "./error_boundary";

import {ReactCodemirror6} from "./react-codemirror6";
import {guid, isInt} from "./utilities_react"
import {MakerPaneContext} from "./tile_maker_support";
import _ from "lodash";
import {LabeledFormField, LabeledSelectList, LabeledTextArea} from "./blueprint_react_widgets";
import {useSize} from "./sizing_tools";
import {CombinedMetadata} from "./blueprint_mdata_fields";

export {CmElement, MakerNavigator, OptionModuleForm, ExportModuleForm, MetadataModule}

const INDENT = 25;

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

function MetadataModule(props) {
    const top_ref = React.createRef();
    const [, usable_height, , ] = useSize(top_ref, props.tabSelectCounter, "CreatorModule");

    let md_style = {height: "100%"};
    function handleCoupleChange(event) {
        props.set_couple_save_attrs_and_exports(event.target.checked)
    }
    return (
        <div ref={top_ref} style={{marginLeft: 10, height: usable_height}}>
            <CombinedMetadata {...props} outer_style={md_style}/>
                <Switch label="Couple save_attrs and exports"
                        className="ml-2 mb-0 mt-1"
                        size="medium"
                        checked={props.couple_save_attrs_and_exports}
                        onChange={handleCoupleChange}/>
        </div>
    )

}

MetadataModule = memo(MetadataModule);

function ExportModuleForm(props) {
    props = {
        exportItem: null,
        dispatch: ()=>{},
        ...props
    }

    function handleNameChange(event) {
        props.dispatch({type: "update_item", new_item: {name: event.target.value}, identifier: props.exportItem.identifier});
    }

    function handleTagChange(event) {
        props.dispatch({type: "update_item", new_item: {tags: event.target.value}, identifier: props.optionItem.identifier});
    }

    return (
        <form>
            <div style={{display: "flex", flexWrap: "wrap", flexDirection: "row"}}>
                <LabeledFormField label="Name" onChange={handleNameChange} the_value={props.exportItem.name}/>
                <LabeledFormField label="Tags" onChange={handleTagChange} the_value={props.exportItem.tags}/>
            </div>
        </form>
    )
}

ExportModuleForm = memo(ExportModuleForm);

const option_types = ['text', 'int', 'float', 'boolean', 'textarea', 'codearea', 'column_select', 'document_select',
    'list_select', 'collection_select', 'palette_select', 'pipe_select', 'custom_list', 'function_select',
    'class_select', 'tile_select', 'divider', 'pool_select'];
const taggable_types = ["class_select", "function_select", "pipe_select", "list_select", "collection_select"];

function OptionModuleForm(props) {
    props = {
        optionItem: null,
        dispatch: () => {},
        ...props
    }

    function handleNameChange(event) {
        props.dispatch({type: "update_item", new_item: {name: event.target.value}, identifier: props.optionItem.identifier});
    }

    function handleDisplayTextChange(event) {
        props.dispatch({type: "update_item", new_item: {display_text: event.target.value}, identifier: props.optionItem.identifier});
    }

    function handleDefaultChange(event) {
        let val = props.form_state.type == "boolean" ? event.target.checked : event.target.value;
        let fixed_val = correctType(props.optionItem.type, val);
        if (fixed_val == "__ERROR__") {
            props.dispatch({type: "update_item", new_item: {default_warning_text: "Invalid value"}, identifier: props.optionItem.identifier});
        } else {
            props.dispatch({type: "update_item", new_item: {default: val}, identifier: props.optionItem.identifier});
        }
    }

    function handleTagChange(event) {
        props.dispatch({type: "update_item", new_item: {tags: event.target.value}, identifier: props.optionItem.identifier});
    }

    function handleSpecialListChange(event) {
        props.dispatch({type: "update_item", new_item: {special_list: textRowsToArray(event.target.value)}, identifier: props.optionItem.identifier});
    }

    function handlePoolTypeChange(event) {
        props.dispatch({type: "update_item", new_item: {pool_select_type: event.currentTarget.value}, identifier: props.optionItem.identifier});
    }

    function handleTypeChange(event) {
        let new_type = event.currentTarget.value;
        let updater = {"type": new_type};
        if (new_type != "custom_list") {
            updater["special_list"] = ""
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
        <form>
            <div style={{display: "flex", flexDirection: "column", padding: 25}}>
                <div style={{display: "flex", flexWrap: "wrap", flexDirection: "row"}}>
                    <LabeledFormField label="Name" onChange={handleNameChange} the_value={props.optionItem.name}
                                      helperText={props.optionItem.name_warning_text}
                    />
                    <LabeledSelectList label="Type" option_list={option_types} onChange={handleTypeChange}
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
                    {props.optionItem.type == "custom_list" &&
                        <LabeledTextArea label="Special List"
                                         onChange={handleSpecialListChange}
                                         the_value={arrayToTextRows(props.optionItem.special_list)}/>}
                    {taggable_types.includes(props.optionItem.type) &&
                        <LabeledFormField label="Tag" onChange={handleTagChange} the_value={props.optionItem.tags}/>
                    }
                    {props.optionItem.type == "pool_select" &&
                        <LabeledSelectList label="Type" option_list={["file", "folder", "both"]}
                                           onChange={handlePoolTypeChange}
                                           the_value={props.optionItem.pool_select_type}/>
                    }
                </div>
            </div>

        </form>
    )
}

OptionModuleForm = memo(OptionModuleForm);

function SignatureHeader(props) {
    props = {
        funcName: "",
        argString: "",
        handleNameChange: () => {
        },
        handleArgChange: () => {
        },
        allowNameChange: true,
        allowArgChange: true,
        ...props
    }
    return (
        <div className="d-flex flex-row" style={{marginTop: 5, marginBottom: 5, alignSelf: "self-end"}}>
            <FormGroup label="Method Name" style={{fontSize: 12, marginBottom: 0}}>
                <InputGroup type="text"
                            size="small"
                            readOnly={!props.allowNameChange}
                            onChange={(event) => props.handleNameChange(event.target.value)}
                            value={props.funcName}/>
            </FormGroup>
            <FormGroup label="Arguments" style={{fontSize: 12, marginBottom: 0}}>
                <InputGroup type="text"
                            size="small"
                            readOnly={!props.allowArgChange}
                            onChange={(event) => props.handleArgChange(event.target.value)}
                            value={props.argString}/>
            </FormGroup>
        </div>
    )
}

function CmElement(props) {
    props = {
        cmState: null,
        cmDispatch: null,
        cmObjectRef: null,
        funcName: "",
        argString: "",
        identifier: "",
        extraKeys: null,
        saveAndCheckpoint: null,
        searchState: null,
        searchDispatch: null,
        clearAllSelections: null,
        search_ref: null,
        handleTabSelect: null,
        pushCallback: null,
        tsocket: null,
        extraSelfCompletions: null,
        module_viewer_id: null,
        show_search: true,
        ...props
    };

    function handleCodeChange(new_code) {
        props.cmDispatch({type: "SET_CODE_TEXT", payload: new_code, identifier: props.identifier});
    }

    function handleNameChange(new_name) {
        props.cmDispatch({type: "SET_FUNC_NAME", payload: new_name, identifier: props.identifier});
    }

    function handleArgChange(new_args) {
        props.cmDispatch({type: "SET_ARG_STRING", payload: new_args, identifier: props.identifier});
    }

    function setCmObject(cmObject) {
        if (props.cmObjectRef && props.cmObjectRef.current) {
            props.cmObjectRef.current = cmObject;
        }
    }

    function updateSearchState(new_state) {
        props.searchDispatch({type: "UPDATE_STATE", new_state: new_state, identifier: props.identifier});
    }

    function searchNext() {
        props.searchDispatch({type: "SEARCH_NEXT"});
        props.pushCallback(() => {
            props.handleTabSelect(props.searchState.current_search_cm);
        })
    }

    function searchPrev() {
        props.searchDispatch({type: "SEARCH_PREVIOUS"});
        props.pushCallback(() => {
            props.handleTabSelect(props.searchState.current_search_cm);
        })
    }

    function setSearchMatches(num) {
        props.searchDispatch({type: "SET_SEARCH_MATCHES", payload: {"identifier": props.identifier, "num": num}});
    }

    let header_left = (
        <SignatureHeader funcName={props.funcName}
                         argString={props.argString}
                         allowNameChange={props.allowNameChange}
                         allowArgChange={props.allowArgChange}
                         handleNameChange={handleNameChange}
                         handleArgChange={handleArgChange}
        />
    )

    return (
        <div>
            <ReactCodemirror6 code_content={props.cmState.codeText}
                              title_label={null}
                              show_search={true}
                              header_left={header_left}
                              mode={props.cmState.mode}
                              extraKeys={props.extraKeys()}
                              current_search_number={props.searchState.current_search_cm == props.identifier ?
                                  props.searchState.current_search_number : null}
                              handleChange={handleCodeChange}
                              saveMe={props.saveAndCheckpoint}
                              setCMObject={setCmObject}
                              search_term={props.searchState.search_string}
                              updateSearchState={updateSearchState}
                              alt_clear_selections={props.clearAllSelections}
                              first_line_number={props.cmState.firstLineNumber}
                              readOnly={props.read_only}
                              regex_search={props.searchState.use_regex}
                              search_ref={props.search_ref}
                              searchPrev={searchPrev}
                              searchNext={searchNext}
                              search_matches={props.searchState.search_matches}
                              setSearchMatches={setSearchMatches}
                              tsocket={props.tsocket}
                              extraSelfCompletions={props.mode == "python" ? props.extraSelfCompletions : []}
                              container_id={props.module_viewer_id}
                              highlight_active_line={true}/>
        </div>
    )
}

function MakerNavigator(props) {
    props = {
        handleTabSelect: () => {
        },
        selectedTab: "metadata",
        option_list: [],
        export_list: [],
        umList: [],
        is_mpl: false,
        is_d3: false,
        umDispatch: () => {
        },
        pushCallback: () => {
        },
        ...props
    }

    const mpContext = useContext(MakerPaneContext);

    function createMethod() {
        const uid = guid();
        props.umDispatch({type: "ADD_METHOD", uid: uid})
        props.pushCallback(() => {
            mpContext.setVisibleTab(uid);
        });
    }

    let method_create_button = (
        <Button icon="plus" variant="minimal" onClick={createMethod}/>
    )

    let option_name_list = props.option_list.map((option) => {
        return {
            title: option.name, identifier: null, onClick: () => {
            }
        }
    });

    let um_sub_items = props.umList.map((um) => {
        return {
            title: um.funcName,
            identifier: um.identifier,
            onClick: () => props.handleTabSelect(um.identifier),
            item_list: []
        }
    });
    let option_sub_items = props.option_list.map((opt) => {
        return {
            title: opt.name,
            identifier: opt.identifier,
            onClick: () => props.handleTabSelect(opt.identifier),
            item_list: []
        }
    });
    let export_sub_items = props.export_list.map((opt) => {
        return {
            title: opt.name,
            identifier: opt.identifier,
            onClick: () => props.handleTabSelect(opt.identifier),
            item_list: []
        }
    });
    let save_sub_items = props.save_list.map((opt) => {
        return {
            title: opt.name,
            identifier: opt.identifier,
            onClick: () => props.handleTabSelect(opt.identifier),
            item_list: []
        }
    });
    let code_sub_items = [
        {
            identifier: "render_content",
            title: "render_content",
            onClick: () => props.handleTabSelect("render_content"),
            icon: "play",
            item_list: []
        },
        {
            identifier: "globals",
            title: "globals",
            onClick: () => props.handleTabSelect("globals"),
            icon: "globe",
            item_list: []
        },
    ]

    if (props.is_mpl) {
        code_sub_items.unshift({
            identifier: "draw_plot",
            title: "draw_plot",
            onClick: () => props.handleTabSelect("draw_plot"),
            icon: "graph",
            item_list: []
        });
    }
    if (props.is_d3) {
        code_sub_items.unshift({
            identifier: "javascript",
            title: "javascript",
            onClick: () => props.handleTabSelect("javascript"),
            icon: "code",
            item_list: []
        });
    }
    const sections = [{
        title: "PROPERTIES",
        icon: "properties",
        sortable: false,
        sub_items: [
            {
                identifier: "metadata",
                title: "Metadata",
                onClick: () => props.handleTabSelect("metadata"),
                icon: "manually-entered-data",
                start_open: true,
                item_list: []
            },
        ]
    },
        {title: "OPTIONS", sortable: true, icon: "select", sub_items: option_sub_items},
        {title: "EXPORTS", sortable: true, icon: "select", sub_items: export_sub_items},
        {title: "SAVE_ATTRS", sortable: true, icon: "select", sub_items: save_sub_items},
        {title: "STANDARD METHODS", sortable: false, icon: "code", sub_items: code_sub_items},
        {title: "USER METHODS", sortable: true, icon: "code", sub_items: um_sub_items, right_button: method_create_button}
    ]

    return (
        <ErrorBoundary custom_message="There was an error in the Maker Navigator">
            <div style={{overflow: "hidden"}}>
                {sections.map((section, index) => (
                    section.sortable ?
                        <SortableNavSection key={index} title={section.title} umDispatch={props.umDispatch}
                                right_button={section.right_button ? section.right_button : null}
                                sub_items={section.sub_items} icon={section.icon}/> :
                    <NavSection key={index} title={section.title} umDispatch={props.umDispatch}
                                right_button={section.right_button ? section.right_button : null}
                                sub_items={section.sub_items} icon={section.icon}/>
                ))}
            </div>
        </ErrorBoundary>
    )
}

function NavSection(props) {
    props = {
        "title": "",
        "sub_items": [],
        "start_open": true,
        "right_button": null,
        ...props
    }
    const [isOpen, setIsOpen] = React.useState(props.start_open);

    return (
        <div>
            <ButtonGroup>
                <Button variant="minimal" icon={props.icon} size="large" onClick={() => setIsOpen(!isOpen)}>
                    {props.title}
                </Button>
                {props.right_button != null && props.right_button}
            </ButtonGroup>
            <Collapse className="nav-section-class" isOpen={isOpen}>
                {props.sub_items.map((item, index) => (
                    <NavItem key={index} identifier={item.identifier} title={item.title} icon={item.icon}
                             onClick={item.onClick} item_list={item.item_list}/>
                ))}
            </Collapse>
        </div>
    );
}

function SortableNavSection(props) {
    props = {
        "title": "",
        "sub_items": [],
        "start_open": true,
        "right_button": null,
        umDispatch: props.umDispatch,
        ...props
    }
    const [isOpen, setIsOpen] = React.useState(props.start_open);

    const sensors = useSensors(useSensor(PointerSensor, {activationConstraint: {distance: 5}}));

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = props.sub_items.findIndex((i) => i.identifier === active.id);
        const newIndex = props.sub_items.findIndex((i) => i.identifier === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
            props.umDispatch({
                type: "MOVE_ITEM",
                oldIndex,
                newIndex
            });
        }
    };

    return (
        <div>
            <ButtonGroup>
                <Button variant="minimal" icon={props.icon} size="large" onClick={() => setIsOpen(!isOpen)}>
                    {props.title}
                </Button>
                {props.right_button != null && props.right_button}
            </ButtonGroup>
            <Collapse className="nav-section-class" isOpen={isOpen}>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={props.sub_items.map((i) => i.identifier)}
                                     strategy={verticalListSortingStrategy}>
                        {props.sub_items.map((item, index) => (
                            <SortableNavItem key={item.identifier} identifier={item.identifier} title={item.title} icon={item.icon}
                                     onClick={item.onClick} item_list={item.item_list}/>
                        ))}
                    </SortableContext>
                </DndContext>
            </Collapse>
        </div>
    );
}

function SortableNavItem({identifier, ...props}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: identifier});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <NavItem {...props} />
        </div>
    );
}

function NavItem(props) {
    props = {
        title: "",
        onClick: () => {
        },
        item_list: [],
        identifier: "",
        ...props
    }
    const mpContext = useContext(MakerPaneContext);

    return (
        <Fragment>
            <ControlGroup>
                <Button style={{marginLeft: INDENT}}
                        icon={props.icon}
                        intent={mpContext.visibleTab == props.identifier ? "primary" : "none"}
                        size="medium"
                        variant="minimal"
                        onClick={props.onClick}>
                    {props.title}
                </Button>
            </ControlGroup>
            {props.item_list.map((item, index) => (
                <NavListItem key={index} title={item.title} onClick={item.onClick}/>
            ))}
        </Fragment>
    );
}

function NavListItem(props) {
    props = {
        title: "",
        ...props
    }
    return (
        <Button style={{marginLeft: INDENT * 2, fontSize: 13}} size="small" variant="minimal" onClick={props.onClick}>
            {props.title}
        </Button>
    );
}
import React, {memo, useContext, useMemo} from "react";
import {Fragment} from "react";
import {
    Button,
    Collapse,
    ControlGroup,
    FormGroup,
    InputGroup,
    ButtonGroup,
    Switch,
    Icon,
    Menu, MenuItem, ContextMenu
} from "@blueprintjs/core";
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
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';


import {ErrorBoundary} from "./error_boundary";

import {ReactCodemirror6} from "./react-codemirror6";
import {guid, isInt} from "./utilities_react"
import {MakerPaneContext} from "./tile_maker_support";
import {LabeledFormField, LabeledSelectList, LabeledTextArea} from "./blueprint_react_widgets";
import {useSize} from "./sizing_tools";
import {CombinedMetadata} from "./blueprint_mdata_fields";

export {CmElement, MakerNavigator, OptionModuleForm, ExportModuleForm, MetadataModule, option_icons, standard_method_icons}

const INDENT = 25;
const SECTION_TOP_MARGIN = 15;

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
    function_select: "function",
    class_select: "curly-braces",
    tile_select: "application",
    divider: "minus",
    pool_select: "folder-open"
}

const standard_method_icons = {
    render_content: "play",
    globals: "globe",
    draw_plot: "scatter-plot",
    javascript: "timeline-area-chart",
}

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
        name: "",
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
                            size="medium"
                            readOnly={!props.allowNameChange}
                            onChange={(event) => props.handleNameChange(event.target.value)}
                            value={props.name}/>
            </FormGroup>
            <FormGroup label="Arguments" style={{fontSize: 12, marginBottom: 0}}>
                <InputGroup type="text"
                            size="medium"
                            width={300}
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
        name: "",
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
        no_height: false,
        ...props
    };

    function handleCodeChange(new_code) {
        props.cmDispatch({type: "update_item", new_item: {codeText: new_code}, identifier: props.identifier});
    }

    function handleNameChange(new_name) {
        props.cmDispatch({type: "update_item", new_item: {name: new_name}, identifier: props.identifier});
    }

    function handleArgChange(new_args) {
        props.cmDispatch({type: "update_item", new_item: {argString: new_args}, identifier: props.identifier});
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
        <SignatureHeader name={props.name}
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
                              no_height={props.no_height}
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
        sections: [],
        icon_dict: null,
        icon_field: null,
        ...props
    }
    const sections = props.sections.filter(section => section.visible === true)
    return (
        <ErrorBoundary custom_message="There was an error in the Maker Navigator">
            <div style={{overflow: "hidden"}}>
                {sections.map((section, index) => (
                    section.editable ?
                        <SortableNavSection key={index} title={section.title} dispatch={section.dispatch}
                                            sub_items={section.sub_items} icon={section.icon}
                                            icon_dict={section.icon_dict} icon_field={section.icon_field}/> :
                    <NavSection key={index} title={section.title} dispatch={section.dispatch}
                                sub_items={section.sub_items} icon={section.icon}
                                icon_dict={section.icon_dict} icon_field={section.icon_field}/>
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
        icon_dict: null,
        icon_field: null,
        ...props
    }
    const [isOpen, setIsOpen] = React.useState(props.start_open);

    return (
        <div style={{marginTop: SECTION_TOP_MARGIN}}>
            <ButtonGroup>
                <Button variant="minimal" style={{paddingRight: 2}} icon={props.icon} size="medium" onClick={() => setIsOpen(!isOpen)}>
                    {props.title}
                </Button>
                {props.right_button != null && props.right_button}
            </ButtonGroup>
            <Collapse className="nav-section-class" isOpen={isOpen}>
                {props.sub_items.map((item, index) => {
                    let icon = props.icon_dict ? <Icon icon={props.icon_dict[item[props.icon_field]]} size={12}/> : null;
                    return (
                        <NavItem key={index} identifier={item.identifier} title={item.name} icon={icon}
                                 item_list={item.item_list}/>
                    )})
                }
            </Collapse>
        </div>
    );
}

function SortableNavSection(props) {
    props = {
        title: "",
        sub_items: [],
        start_open: true,
        right_button: null,
        icon_dict: null,
        icon_field: null,
        dispatch: () => {},
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
            props.dispatch({
                type: "move_item",
                oldIndex,
                newIndex
            });
        }
    };

    const mpContext = useContext(MakerPaneContext);

    function createItem() {
        const uid = guid();
        const new_entry = {
            name: "new_item",
            argString: "",
            codeText: "",
            mode: "python", firstLineNumber: 1,
            identifier: uid}
        props.dispatch({type: "add_at_end", new_item: new_entry});
        mpContext.pushCallback(() => {
            mpContext.setVisibleTab(uid);
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
    return (
        <ContextMenu content={contextMenu}>
        <div style={{marginTop: SECTION_TOP_MARGIN}}>
            <ButtonGroup>
                <Button style={{paddingRight: 2}} variant="minimal" icon={props.icon} size="medium" onClick={() => setIsOpen(!isOpen)}>
                    {props.title}
                </Button>
                <Button icon="plus"size="small" variant="minimal" onClick={createItem}/>
            </ButtonGroup>
            <Collapse className="nav-section-class" isOpen={isOpen}>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={props.sub_items.map((i) => i.identifier)}
                                     strategy={verticalListSortingStrategy}>
                        {props.sub_items.map((item, ) => {
                            let icon = props.icon_dict ? <Icon icon={props.icon_dict[item[props.icon_field]]} size={12}/> : null;
                            return (
                                <SortableNavItem key={item.identifier} identifier={item.identifier} title={item.name}
                                                 icon={icon} item_list={item.item_list} dispatch={props.dispatch}/>
                            )
                        })}
                    </SortableContext>
                </DndContext>
            </Collapse>
        </div>
        </ContextMenu>
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

    function _deleteMe() {
        props.dispatch({type: "delete_item", identifier: identifier})
    }

    const delete_icon = <Icon icon="delete" size={12} />;

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
                    <NavItem identifier={identifier} {...props} />
                    <Button icon={delete_icon} size="small" variant="minimal" className="show-on-hover"
                          tabIndex={-1} onClick={_deleteMe}/>
                </ButtonGroup>
            </div>
        </ContextMenu>
    );
}


function NavItem(props) {
    props = {
        title: "",
        item_list: [],
        identifier: "",
        ...props
    }
    const mpContext = useContext(MakerPaneContext);

    return (
        <Fragment>
            <ControlGroup>
                <Button style={{marginLeft: INDENT, paddingRight: 2}}
                        icon={props.icon}
                        intent={mpContext.visibleTab == props.identifier ? "primary" : "none"}
                        size="medium"
                        variant="minimal"
                        onClick={()=>{mpContext.setVisibleTab(props.identifier)}}>
                    {props.title}
                </Button>
            </ControlGroup>
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
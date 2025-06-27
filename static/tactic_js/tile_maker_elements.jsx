import React, {memo, useContext, useEffect, useMemo, useRef, useState} from "react";
import {Fragment} from "react";
import {
    Button,
    Collapse,
    ControlGroup,
    ButtonGroup,
    Switch,
    Icon,
    EntityTitle,
    H6,
    Menu, MenuItem, ContextMenu, Card, FormGroup, InputGroup
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
import {NativeTags, IconSelector, NotesField} from "./blueprint_mdata_fields";
import {postAjaxPromise} from "./communication_react";
import {SizeContext, useSize} from "./sizing_tools"
import {DragHandle} from "./resizing_layouts2";

export {
    CmElement, PaneElement, MakerNavigator, OptionModuleForm, ExportModuleForm,
    MetadataModule, option_icons, standard_method_icons
}

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


let draghandle_position_dict = {position: "absolute", bottom: 2, right: 1};

function PaneHeader(props) {
    props = {
        identifier: null,
        titleElem: null,
        dispatch: () => {
        },
        allowDelete: false,
        ...props
    }

    const mpContext = useContext(MakerPaneContext);

    function _deleteMe() {
        props.dispatch({type: "delete_item", identifier: props.identifier})
    }

    return (
        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between",
            marginBottom: 10, alignItems: "anchor-center"}}>
            <div style={{display: "flex", flexDirection: "row", justifyContent: "flex-start"}}>
                <Button variant="minimal" size="small" icon="cross"
                        style={{padding: 0, position: "absolute", left: 5, top: 5, zIndex: 100}}
                        onClick={() => {
                            mpContext.toggleVisibleTab(props.identifier)
                        }}/>
                {props.titleElem}
            </div>
            {props.allowDelete &&
                <Button variant="minimal" intent="danger" size="small" icon="trash"
                        style={{padding: 0, position: "absolute", left: 5, right: 5, zIndex: 100}}
                        onClick={_deleteMe}/>
            }
        </div>
    )
}

function SimplePaneTitlOlde(props) {
    props = {
        title: "",
        subTitle: null,
        ...props
    }

    if (!props.subTitle)
        return (
            <Fragment>
                <div style={{fontSize: 16, margin: 10}}><b>{props.title}</b></div>
            </Fragment>
        )
    else {
        return (
            <Fragment>
                <div style={{fontSize: 16, margin: 10}}><b>{props.title}</b>: {props.subTitle}</div>
            </Fragment>
        )
    }
}

function SimplePaneTitle(props) {
    props = {
        title: "",
        subtitle: null,
        icon: null,
        ...props
    }

    let theIcon = <Icon icon={props.icon} size={13} />

    return (
        <div style={{position: "absolute", left: 40, top: 20}}>
            <EntityTitle title={props.title} heading={H6} subtitle={props.subtitle} icon={theIcon} />
        </div>
    )
}

function PaneElement(props) {
    props = {
        identifier: null,
        dispatch: () => {
        },
        allowDelete: false,
        children: null,
        el: null,
        pane_height: 0,
        ...props,
    }
    const top_ref = useRef(null);

    const [usable_width, usable_height, topX, topY] = useSize(top_ref, 0);

    const mpContext = useContext(MakerPaneContext);

    const [, set_resizing] = useState(false);
    const [, set_dwidth] = useState(0);
    const [dheight, set_dheight] = useState(0);


    function _startResize(e, ui, startX, startY) {
        set_resizing(true);
        set_dwidth(0);
        set_dheight(0);
    }

    function _onResize(e, ui, x, y, dx, dy) {
        set_dwidth(dx);
        set_dheight(dy);
    }

    function _stopResize(e, ui, x, y, dx, dy) {
        set_resizing(false);
        set_dwidth(0);
        set_dheight(0);
        resize_pane(dx, dy)
    }

    function resize_pane(dx, dy) {
        props.dispatch({
                type: "update_item",
                identifier: props.identifier,
                new_item: {pane_height: props.pane_height + dy}
            }
        )
    }

    const current_height = props.pane_height + dheight;

    function _deleteMe() {
        props.dispatch({type: "delete_item", identifier: props.identifier})
    }

    return (
        <Card ref={top_ref} key={props.identifier} elevation={2} style={{height: current_height, position: "relative"}}>
            <Button variant="minimal" size="small" icon="cross"
                        style={{padding: 0, position: "absolute", left: 10, top: 10, zIndex: 100}}
                        onClick={() => {
                            mpContext.toggleVisibleTab(props.identifier)
                        }}/>
            {props.allowDelete &&
                <Button variant="minimal" intent="danger" size="small" icon="trash"
                        style={{padding: 0, position: "absolute", right: 10, top: 10, zIndex: 100}}
                        onClick={_deleteMe}/>
            }
            <SizeContext.Provider value={{
                availableWidth: usable_width,
                availableHeight: current_height - 30,
                topX: topX,
                topY: topY
            }}>

                {props.children}
            </SizeContext.Provider>
            <DragHandle position_dict={draghandle_position_dict}
                        dragStart={_startResize}
                        onDrag={_onResize}
                        dragEnd={_stopResize}
                        direction="both"/>
        </Card>
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
        metadataDispatch: () => {
        },
        ...props
    }

    useEffect(() => {
        get_all_tags()
    }, []);


    function get_all_tags() {
        let data_dict = {
            pane_type: "tile",
            is_repository: false,
            show_hidden: true
        };
        postAjaxPromise("get_tag_list", data_dict)
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

    const split_tags = props.metadataRef.current.tags.split(" ");
    return (
        <div>
            <SimplePaneTitle title="Metadata" icon="properties"/>
            <div style={{marginTop: 30}}>
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
    }

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
            identifier: props.optionItem.identifier
        });
    }

    return (
        <Fragment>
            <SimplePaneTitle icon="export" title={props.exportItem.name}/>
            <div style={{marginTop: 30}}>
            <form>
                <div style={{display: "flex", flexWrap: "wrap", flexDirection: "row"}}>
                    <LabeledFormField label="Name" onChange={handleNameChange} the_value={props.exportItem.name}/>
                    <LabeledFormField label="Tags" onChange={handleTagChange} the_value={props.exportItem.tags}/>
                </div>
            </form>
            </div>
        </Fragment>
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
        dispatch: () => {
        },
        ...props
    }

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
        let val = props.form_state.type == "boolean" ? event.target.checked : event.target.value;
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
        <Fragment>
            <SimplePaneTitle icon="select" title={props.optionItem.name}/>
            <div style={{marginTop: 30}}>
            <form>
                <div style={{display: "flex", flexDirection: "column"}}>
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
            </div>
        </Fragment>
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
        allowSignatureChange: false,
        ...props
    }

    const lastNameRef = useRef(props.name);
    const lastArgStringRef = useRef(props.argString);

    function getEditableRanges(lineText) {
        const match = lineText.match(/^def\s+(\w+)\s*\(([^)]*)\):/);
        if (!match) return [];

        const [, funcName, argsStr] = match;

        // Find function name range
        const funcNameStart = lineText.indexOf(funcName);
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
    }

    function handleSignatureChange(new_signature) {
        // Extract the function name and arguments from the new signature
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
    }

    return (
        <div className="d-flex flex-row cm-signature" style={{justifyContent: "space-between"}}>
            <ReactCodemirror6 readOnly={!props.allowSignatureChange}
                              show_line_numbers={false}
                              no_height={true}
                              controlled={true}
                              getEditableRanges={getEditableRanges}
                              restrict_edits_to_range={props.allowSignatureChange}
                              className="creator-code-header"
                              handleChange={props.allowSignatureChange ? handleSignatureChange : null}
                              code_content={`def ${props.name}(self, ${props.argString}):`}/>
        </div>
    )
}

function CmElement(props) {
    props = {
        cmState: null,
        allowDelete: false,
        code_content: "",
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
        allowSignatureChange: true,
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

    const sizeInfo = useContext(SizeContext)

    let outer_style = {
        width: "100%",
        height: sizeInfo.availableHeight,
        paddingLeft: 0,
        position: "relative"
    };

    return (
        <Fragment>
            <div style={outer_style}>
                    <SignatureHeader name={props.name}
                         argString={props.argString}
                         allowSignatureChange={props.allowSignatureChange}
                         handleNameChange={handleNameChange}
                         handleArgChange={handleArgChange}/>
                <ReactCodemirror6 code_content={props.cmState.codeText}
                                  controlled={true}
                                  no_height={props.no_height}
                                  title_label={null}
                                  show_search={false}
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
        </Fragment>
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
                {sections.map((section, ) => (
                    section.editable ?
                        <SortableNavSection key={section.title} title={section.title} dispatch={section.dispatch}
                                            sub_items={section.sub_items} icon={section.icon}
                                            icon_dict={section.icon_dict} icon_field={section.icon_field}/> :
                        <NavSection key={section.title} title={section.title} dispatch={section.dispatch}
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
                <Button variant="minimal" style={{paddingRight: 2, fontSize:13, fontWeight: 600}} icon={props.icon} size="medium"
                        onClick={() => setIsOpen(!isOpen)}>
                    {props.title}
                </Button>
                {props.right_button != null && props.right_button}
            </ButtonGroup>
            <Collapse className="nav-section-class" isOpen={isOpen}>
                {props.sub_items.map((item, index) => {
                    let icon = props.icon_dict ?
                        <Icon icon={props.icon_dict[item[props.icon_field]]} size={12}/> : null;
                    return (
                        <NavItem key={item.identifier} identifier={item.identifier} title={item.name} icon={icon}
                                 item_list={item.item_list}/>
                    )
                })
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
        dispatch: () => {
        },
        ...props
    }
    const [isOpen, setIsOpen] = React.useState(props.start_open);

    const sensors = useSensors(useSensor(PointerSensor, {activationConstraint: {distance: 5}}));

    const handleDragEnd = (event) => {
        const {active, over} = event;
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
            identifier: uid
        }
        props.dispatch({type: "add_at_end", new_item: new_entry});
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
    return (
        <ContextMenu content={contextMenu}>
            <div style={{marginTop: SECTION_TOP_MARGIN}}>
                <ButtonGroup>
                    <Button style={{paddingRight: 2, fontSize:13, fontWeight: 600}} variant="minimal" icon={props.icon} size="medium"
                            onClick={() => setIsOpen(!isOpen)}>
                        {props.title}
                    </Button>
                    <Button icon="plus" size="small" variant="minimal" onClick={createItem}/>
                </ButtonGroup>
                <Collapse className="nav-section-class" isOpen={isOpen}>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={props.sub_items.map((i) => i.identifier)}
                                         strategy={verticalListSortingStrategy}>
                            {props.sub_items.map((item,) => {
                                let icon = props.icon_dict ?
                                    <Icon icon={props.icon_dict[item[props.icon_field]]} size={12}/> : null;
                                return (
                                    <SortableNavItem key={item.identifier} identifier={item.identifier}
                                                     title={item.name}
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

    const delete_icon = <Icon icon="delete" size={12}/>;

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
                        intent={mpContext.visibleTabList.includes(props.identifier) ? "primary" : "none"}
                        size="medium"
                        variant="minimal"
                        onClick={() => {
                            mpContext.toggleVisibleTab(props.identifier)
                        }}>
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
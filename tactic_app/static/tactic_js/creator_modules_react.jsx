// noinspection JSConstructorReturnsPrimitive

import React from "react";
import {Fragment, useState, useEffect, memo, useContext, useRef} from "react";
import PropTypes from 'prop-types';

import {Button, Card, Collapse, Divider, Menu, MenuItem, MenuDivider, Switch, FormGroup} from "@blueprintjs/core";
import {RegionCardinality} from "@blueprintjs/table";

import {postAjax} from "./communication_react";
import {SearchForm} from "./library_widgets";
import {
    LabeledSelectList,
    LabeledFormField,
    LabeledTextArea,
    BpOrderableTable,
    GlyphButton
} from "./blueprint_react_widgets";
import {StatusContext} from "./toaster";
import _ from 'lodash';
import {isInt} from "./utilities_react";
import {BpSelect, CombinedMetadata} from "./blueprint_mdata_fields";
import {useCallbackStack} from "./utilities_react";
import {SizeContext, useSize} from "./sizing_tools";

export {OptionModule, ExportModule, CommandsModule, MetadataModule, correctOptionListTypes}

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

function correctOptionListTypes(option_list) {
    let copied_olist = _.cloneDeep(option_list);
    for (let option of copied_olist) {
        option.default = correctType(option.type, option.default);
        // The following is needed because when reordering rows BpOrderableTable return the special_list
        // as a string
        if (option.type == "custom_list") {
            if (typeof option.special_list == 'string') {
                option.special_list = eval(option.special_list)
            }
        }
    }
    return copied_olist
}

const option_types = ['text', 'int', 'float', 'boolean', 'textarea', 'codearea', 'column_select', 'document_select',
    'list_select', 'collection_select', 'palette_select', 'pipe_select', 'custom_list', 'function_select',
    'class_select', 'tile_select', 'divider', 'pool_select'];
const taggable_types = ["class_select", "function_select", "pipe_select", "list_select", "collection_select"];

function OptionModuleForm(props) {

    function _setFormState(new_state) {
        let new_form_state = Object.assign(_.cloneDeep(props.form_state), new_state);
        props.setFormState(new_form_state)
    }

    function handleNameChange(event) {
        _setFormState({"name": event.target.value});
    }

    function handleDisplayTextChange(event) {
        _setFormState({"display_text": event.target.value});
    }

    function handleDefaultChange(event) {
        let new_val = props.form_state.type == "boolean" ? event.target.checked : event.target.value;
        _setFormState({"default": new_val});
    }

    function handleTagChange(event) {
        _setFormState({"tags": event.target.value});
    }

    function handleSpecialListChange(event) {
        _setFormState({"special_list": textRowsToArray(event.target.value)});
    }

    function handlePoolTypeChange(event) {
        _setFormState({"pool_select_type": event.currentTarget.value});
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

        _setFormState(updater)
    }

    function handleSubmit(update) {
        let copied_state = _.cloneDeep(props.form_state);
        delete copied_state.default_warning_text;
        delete copied_state.name_warning_text;
        delete copied_state.update_warning_text;
        if (!update && props.nameExists(props.form_state.name, update)) {
            _setFormState({name_warning_text: "Name exists"});
            return
        }
        if (props.form_state.type == "divider") {
            copied_state.default = ""
        }
        else {
            let val = props.form_state.default;
            let fixed_val = correctType(copied_state.type, val);
            if (fixed_val == "__ERROR__") {
                _setFormState({default_warning_text: "Invalid value"});
                return
            } else {
                copied_state.default = fixed_val

            }
        }
        _setFormState({default_warning_text: null, name_warning_text: null});
        props.handleCreate(copied_state, update)
    }

    return (
        <form>
            <div style={{display: "flex", flexDirection: "column", padding: 25}}>
                <FormGroup style={{display: "flex", flexWrap: "wrap", flexDirection: "row", marginBottom: 20}}
                           helperText={props.form_state.update_warning_text}>
                    <Button type="submit"
                            style={{height: "fit-content", alignSelf: "start", marginTop: 23, marginRight: 5}}
                            text="create"
                            intent="primary"
                            onClick={e => {
                                e.preventDefault();
                                handleSubmit(false)
                            }}/>
                    <Button type="submit"
                            style={{height: "fit-content", alignSelf: "start", marginTop: 23, marginRight: 5}}
                            disabled={props.active_row == null}
                            text="update"
                            intent="warning"
                            onClick={e => {
                                e.preventDefault();
                                handleSubmit(true)
                            }}/>
                    <Button style={{height: "fit-content", alignSelf: "start", marginTop: 23, marginRight: 5}}
                            disabled={props.active_row == null}
                            text="delete"
                            intent="danger"
                            onClick={e => {
                                e.preventDefault();
                                props.deleteOption()
                            }}/>
                    <Button style={{height: "fit-content", alignSelf: "start", marginTop: 23, marginRight: 5}}
                            text="clear"
                            onClick={e => {
                                e.preventDefault();
                                props.clearForm()
                            }}/>
                </FormGroup>
                <div style={{display: "flex", flexWrap: "wrap", flexDirection: "row"}}>
                    <LabeledFormField label="Name" onChange={handleNameChange} the_value={props.form_state.name}
                                      helperText={props.form_state.name_warning_text}
                    />
                    <LabeledSelectList label="Type" option_list={option_types} onChange={handleTypeChange}
                                       the_value={props.form_state.type}/>
                    <LabeledFormField label="Display Text" onChange={handleDisplayTextChange}
                                      the_value={props.form_state.display_text}
                                      helperText={props.form_state.display_warning_text}
                    />
                    {props.form_state.type != "divider" &&
                        <LabeledFormField label="Default" onChange={handleDefaultChange}
                                          the_value={props.form_state.default}
                                          isBool={props.form_state.type == "boolean"}
                                          helperText={props.form_state.default_warning_text}
                        />
                    }
                    {props.form_state.type == "custom_list" &&
                        <LabeledTextArea label="Special List"
                                         onChange={handleSpecialListChange}
                                         the_value={arrayToTextRows(props.form_state.special_list)}/>}
                    {taggable_types.includes(props.form_state.type) &&
                        <LabeledFormField label="Tag" onChange={handleTagChange} the_value={props.form_state.tags}/>
                    }
                    {props.form_state.type == "pool_select" &&
                        <LabeledSelectList label="Type" option_list={["file", "folder", "both"]}
                                           onChange={handlePoolTypeChange}
                                           the_value={props.form_state.pool_select_type}/>
                    }
                </div>
            </div>

        </form>
    )
}

OptionModuleForm = memo(OptionModuleForm);

OptionModuleForm.propTypes = {
    handleCreate: PropTypes.func,
    deleteOption: PropTypes.func,
    nameExists: PropTypes.func,
    setFormState: PropTypes.func,
    clearForm: PropTypes.func,
    form_state: PropTypes.object,
    active_row: PropTypes.number
};

function arrayToString(ar) {
    let nstring = "[";
    let isfirst = true;
    for (let item of ar) {
        if (!isfirst) {
            nstring += ", ";
        } else {
            isfirst = false
        }
        nstring += "'" + String(item) + "'"
    }
    nstring += "]";
    return nstring
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

function textRowsToArray(tstring) {
    let slist = [];
    for (let item of tstring.toString().split("\n")) {
        slist.push(item)
    }
    return slist
}

const blank_form = {
    name: "",
    display_text: "",
    type: "text",
    default: "",
    special_list: "",
    tags: "",
    default_warning_text: null,
    name_warning_text: null
};

function OptionModule(props) {

    const top_ref = React.createRef();
    const [active_row, set_active_row] = useState(null);
    const [form_state, set_form_state] = useState({...blank_form});

    const sizeInfo = useContext(SizeContext);

    const [usable_width, usable_height, topX, topY] = useSize(top_ref, props.tabSelectCounter, "OptionModule");

    const pushCallback = useCallbackStack();

    function _delete_option() {
        let new_data_list = _.cloneDeep(props.data_list_ref.current);
        new_data_list.splice(active_row, 1);
        let old_active_row = active_row;
        props.handleChange(new_data_list, () => {
            if (old_active_row >= props.data_list_ref.current.length) {
                _handleRowDeSelect()
            } else {
                handleActiveRowChange(old_active_row)
            }
        });
    }

    function _clearHighlights(new_data_list=null) {
        if (!new_data_list) {
            new_data_list = props.data_list_ref.current
        }
        let newer_data_list = [];
        for (let option of new_data_list) {
            if ("className" in option && option.className) {
                let new_option = {...option};
                new_option.className = "";
                newer_data_list.push(new_option)
            } else {
                newer_data_list.push(option)
            }
        }
        props.handleChange(newer_data_list)
    }

    function handleCreate(new_row, update) {
        let new_data_list = [...props.data_list_ref.current];
        new_row.className = "option-row-highlight";
        if (update) {
            new_data_list[active_row] = new_row;

        } else {
            new_data_list.push(new_row);
        }
        props.handleChange(new_data_list, () => {
            if (update) {
                _setFormState({update_warning_text: "Value Updated"})
            }
            setTimeout(() => {
                _clearHighlights();
                let new_form_state = Object.assign(_.cloneDeep(form_state), {update_warning_text: null});
                _setFormState(new_form_state)
            }, 5 * 1000);
        })
    }

    function _setFormState(new_form_state) {
        set_form_state({...new_form_state})
    }

    function _nameExists(name, update) {
        let rnum = 0;
        for (let option of props.data_list_ref.current) {
            if (option.name == name) {
                return !(update && (rnum == active_row))
            }
            rnum += 1;
        }
        return false
    }

    function handleActiveRowChange(row_index) {
        let new_form_state = Object.assign({...blank_form}, props.data_list_ref.current[row_index]);
        set_form_state({...new_form_state});
        set_active_row(row_index)
    }

    function _clearForm() {
        _setFormState({
            name: "",
            display_text: "",
            default: "",
            special_list: "",
            tags: "",
            default_warning_text: null,
            name_warning_text: null,
            update_warning_text: null,
            pool_select_type: ""
        })
    }

    function _handleRowDeSelect() {
        set_active_row(null);
        pushCallback(_clearForm)
    }

    var cols = ["name", "type", "display_text", "default", "tags"];
    let options_pane_style = {
        "marginTop": 10,
        "marginLeft": 10,
        "marginRight": 10,
        "height": usable_height
    };

    let copied_dlist = props.data_list_ref.current.map(opt => {
        let new_opt = {};
        for (let col of cols) {
            if (col in opt) {
                new_opt[col] = opt[col]
            }
            if (typeof new_opt.default == "boolean") {
                new_opt.default = new_opt.default ? "True" : "False"
            }
        }
        for (let param in new_opt) {
            if (Array.isArray(new_opt[param])) {
                new_opt[param] = arrayToString(new_opt[param]);
            }
        }
        if ("className" in opt && opt.className != "") {
            new_opt.className = opt.className
        }
        else if (new_opt.type == "divider") {
            new_opt.className = "divider-option"
        }
        return new_opt
    });

    return (
        <Card ref={top_ref} elevation={1} id="options-pane" className="d-flex flex-column" style={options_pane_style}>
            {props.foregrounded &&
                <BpOrderableTable columns={cols}
                                  data_array={copied_dlist}
                                  active_row={active_row}
                                  handleActiveRowChange={handleActiveRowChange}
                                  handleChange={(olist) => {
                                      props.handleChange(correctOptionListTypes(olist))
                                  }}
                                  selectionModes={[RegionCardinality.FULL_ROWS]}
                                  handleDeSelect={_handleRowDeSelect}
                                  content_editable={false}
                />
            }

            <OptionModuleForm handleCreate={handleCreate}
                              deleteOption={_delete_option}
                              active_row={active_row}
                              setFormState={_setFormState}
                              clearForm={_clearForm}
                              form_state={form_state}
                              nameExists={_nameExists}/>
        </Card>
    )

}

OptionModule = memo(OptionModule);

OptionModule.propTypes = {
    data_list: PropTypes.array,
    foregrounded: PropTypes.bool,
    handleChange: PropTypes.func,
    handleNotesAppend: PropTypes.func,
    available_height: PropTypes.number
};

function ExportModuleForm(props) {
    const [name, set_name] = useState("");
    const [tags, set_tags] = useState("");

    function handleNameChange(event) {
        set_name(event.target.value)
    }


    function handleTagChange(event) {
        set_tags(event.target.value)
    }

    function handleSubmit() {
        props.handleCreate({name, tags})
    }

    return (
        <form>
            <div style={{display: "flex", flexDirection: "column", padding: 10}}>
                <div style={{display: "flex", flexWrap: "wrap", flexDirection: "row", marginBottom: 20}}>
                    <Button style={{height: "fit-content", alignSelf: "start", marginTop: 23, marginRight: 5}}
                            text="Create"
                            type="submit"
                            intent="primary"
                            onClick={e => {
                                e.preventDefault();
                                handleSubmit()
                            }}/>
                    <Button style={{height: "fit-content", alignSelf: "start", marginTop: 23, marginRight: 5}}
                            disabled={props.active_row == null}
                            text="delete"
                            intent="danger"
                            onClick={e => {
                                e.preventDefault();
                                props.handleDelete()
                            }}/>
                </div>
                <div style={{display: "flex", flexWrap: "wrap", flexDirection: "row"}}>
                    <LabeledFormField label="Name" onChange={handleNameChange} the_value={name}/>
                    {props.include_tags &&
                        <LabeledFormField label="Tags" onChange={handleTagChange} the_value={tags}/>
                    }
                </div>

            </div>
        </form>
    )
}

ExportModuleForm = memo(ExportModuleForm);

ExportModuleForm.propTypes = {
    handleCreate: PropTypes.func,
    handleDelete: PropTypes.func,
    active_row: PropTypes.number,
    include_tags: PropTypes.bool,
};

function ExportModule(props) {
    const top_ref = React.createRef();

    const [active_export_row, set_active_export_row] = useState(0);
    const [active_save_row, set_active_save_row] = useState(0);

    const sizeInfo = useContext(SizeContext);

    const [usable_width, usable_height, topX, topY] = useSize(top_ref, props.tabSelectCounter, "ExportModule");

    function _delete_export() {
        let new_data_list = props.export_list;
        new_data_list.splice(active_export_row, 1);
        let old_active_row = active_export_row;
        props.handleChange({export_list: new_data_list}, () => {
            if (old_active_row >= props.export_list.length) {
                set_active_export_row(null)
            } else {
                _handleActiveExportRowChange(old_active_row)
            }
        })
    }

    function _delete_save() {
        let new_data_list = props.save_list;
        new_data_list.splice(active_save_row, 1);
        let old_active_row = active_save_row;
        props.handleChange({additional_save_attrs: new_data_list}, () => {
            if (old_active_row >= props.save_list.length) {
                set_active_save_row(null)
            } else {
                _handleActiveSaveRowChange(old_active_row)
            }
        })
    }

    function _handleCreateExport(new_row) {
        let new_data_list = props.export_list;
        new_data_list.push(new_row);
        props.handleChange({export_list: new_data_list})
    }

    function _handleCreateSave(new_row) {
        let new_data_list = props.save_list;
        new_data_list.push(new_row);
        props.handleChange({additional_save_attrs: new_data_list})
    }

    function _handleActiveExportRowChange(row_index) {
        set_active_export_row(row_index)
    }

    function _handleActiveSaveRowChange(row_index) {
        set_active_save_row(row_index)
    }

    function _handleCoupleChange(event) {
        props.handleChange({"couple_save_attrs_and_exports": event.target.checked});
    }

    function _handleExportChange(new_export_list) {
        props.handleChange({export_list: new_export_list})
    }

    function _handleSaveChange(new_export_list) {
        props.handleChange({additional_save_attrs: new_export_list})
    }

    var cols = ["name", "tags"];
    let exports_pane_style = {
        "marginTop": 10,
        "marginLeft": 10,
        "marginRight": 10,
        "height": usable_height
    };
    return (
        <Card ref={top_ref} elevation={1} id="exports-pane" className="d-flex flex-column" style={exports_pane_style}>
            {props.foregrounded &&
                <Fragment>
                    <h4 className="bp5-heading">Exports</h4>
                    <BpOrderableTable columns={cols}
                                      data_array={props.export_list}
                                      active_row={active_export_row}
                                      handleActiveRowChange={_handleActiveExportRowChange}
                                      handleChange={_handleExportChange}
                                      content_editable={true}/>
                </Fragment>
            }
            <ExportModuleForm handleCreate={_handleCreateExport}
                              handleDelete={_delete_export}
                              include_tags={true}
                              active_row={active_export_row}

            />
            <Divider/>
            <div style={{display: "flex", justifyContent: "space-between", marginTop: 15}}>
                <h4 className="bp5-heading">Save Attrs</h4>
                <Switch label="Couple save_attrs and exports"
                        className="ml-2 mb-0 mt-1"
                        large={false}
                        checked={props.couple_save_attrs_and_exports}
                        onChange={_handleCoupleChange}/>
            </div>
            {props.foregrounded && !props.couple_save_attrs_and_exports &&
                <Fragment>
                    <BpOrderableTable columns={["name"]}
                                      data_array={props.save_list}
                                      active_row={active_save_row}
                                      handleActiveRowChange={_handleActiveSaveRowChange}
                                      handleChange={_handleSaveChange}
                                      content_editable={true}/>
                    <ExportModuleForm handleCreate={_handleCreateSave}
                                      handleDelete={_delete_save}
                                      include_tags={false}
                                      active_row={active_save_row}/>
                </Fragment>}
        </Card>
    )
}

ExportModule = memo(ExportModule);

ExportModule.propTypes = {
    export_list: PropTypes.array,
    save_list: PropTypes.array,
    couple_save_attrs_and_exports: PropTypes.bool,
    foregrounded: PropTypes.bool,
    handleChange: PropTypes.func,
    handleNotesAppend: PropTypes.func,
    available_height: PropTypes.number
};

function MetadataModule(props) {
    const top_ref = React.createRef();
    const [usable_width, usable_height, topX, topY] = useSize(top_ref, props.tabSelectCounter, "CreatorModule");

    let md_style = {height: "100%"};
    return (
        <div ref={top_ref} style={{marginLeft: 10, height: usable_height}}>
            <CombinedMetadata {...props}
                outer_style={md_style}
            />
        </div>
    )

}

MetadataModule = memo(MetadataModule);


function CommandsModule(props) {
    const top_ref = React.createRef();
    const commandsRef = useRef(null);
    const [search_string, set_search_string] = useState("");
    const [api_dict, set_api_dict] = useState({});
    const [ordered_categories, set_ordered_categories] = useState([]);
    const [object_api_dict, set_object_api_dict] = useState({});
    const [ordered_object_categories, set_ordered_object_categories] = useState([]);

    const sizeInfo = useContext(SizeContext);

    const [usable_width, usable_height, topX, topY] = useSize(top_ref, props.tabSelectCounter, "CommandModule");

    useEffect(() => {
        postAjax("get_api_dict", {}, function (data) {
            set_api_dict(data.api_dict_by_category);
            set_object_api_dict(data.object_api_dict_by_category);
            set_ordered_object_categories(data.ordered_object_categories);
            set_ordered_categories(data.ordered_api_categories);
        })
    }, []);

    function _updateSearchState(new_state) {
        set_search_string(new_state["search_string"])
    }

    let object_items = [];
    for (let category of ordered_object_categories) {
        let res = <ObjectCategoryEntry category_name={category}
                                       key={category}
                                       search_string={search_string}
                                       class_list={object_api_dict[category]}/>;
        object_items.push(res)
    }
    let command_items = [];
    for (let category of ordered_categories) {
        let res = <CategoryEntry category_name={category}
                                 key={category}
                                 search_string={search_string}
                                 command_list={api_dict[category]}/>;
        command_items.push(res)
    }

    const commands_pane_style = {
        "marginTop": 10,
        "marginLeft": 10,
        "marginRight": 10,
        "paddingTop": 10,
        height: usable_height
    };

    return (

        <Card ref={top_ref} elevation={1} id="commands-pane" className="d-flex flex-column" style={commands_pane_style}>
            <div style={{display: "flex", justifyContent: "flex-end", marginRight: 25}}>
                <SearchForm update_search_state={_updateSearchState}
                            search_string={search_string}/>
            </div>
            <div ref={commandsRef} style={{fontSize: 13, overflow: "auto"}}>
                <h4>Object api</h4>
                {object_items}
                <h4 style={{marginTop: 20}}>TileBase methods (accessed with self)</h4>
                {command_items}
            </div>
        </Card>
    )
}

CommandsModule = memo(CommandsModule);

function stringIncludes(str1, str2) {
    return str1.toLowerCase().includes(str2.toLowerCase())
}

function ObjectCategoryEntry(props) {
    let classes = [];
    let show_whole_category = false;
    let show_category = false;
    if (props.search_string == "" || stringIncludes(props.category_name, props.search_string)) {
        show_whole_category = true;
        show_category = true
    }
    let index = 0;
    for (let class_entry of props.class_list) {
        let entries = [];
        let show_class = false;
        if (class_entry[2] == "class") {
            let show_whole_class = false;
            if (show_whole_category || stringIncludes(class_entry[0], props.search_string)) {
                show_whole_class = true;
                show_category = true;
                show_class = true
            }
            for (let entry of class_entry[1]) {
                entry["kind"] = "class_" + entry["kind"];
                let show_entry = false;
                if (show_whole_class || stringIncludes(entry.signature, props.search_string)) {
                    entries.push(<CommandEntry key={`entry_${index}`} {...entry}/>);
                    index += 1;
                    show_class = true;
                    show_category = true;

                }
            }
            if (show_class) {
                classes.push(
                    <Fragment key={`class_${index}`}>
                        <h6 style={{
                            fontStyle: "italic",
                            marginTop: 20,
                            fontFamily: "monospace"
                        }}>{"class" + class_entry[0]}</h6>
                        {entries}
                    </Fragment>
                );
                index += 1;
            }


        } else {
            let entry = class_entry[1];
            if (show_whole_category || stringIncludes(entry.signature, props.search_string)) {
                entries.push(<CommandEntry key={`entry_${index}`} {...entry}/>);
                index += 1;
                show_category = true
            }
        }

    }

    if (show_category) {
        return (
            <Fragment key={props.category_name}>
                <h5 style={{marginTop: 20}}>
                    {props.category_name}
                </h5>
                {classes}
                <Divider/>
            </Fragment>
        )
    } else {
        return false
    }
}

ObjectCategoryEntry = memo(ObjectCategoryEntry);

ObjectCategoryEntry.propTypes = {
    category_name: PropTypes.string,
    class_list: PropTypes.array,
    search_string: PropTypes.string,
};

function CategoryEntry(props) {
    let show_whole_category = false;
    let show_category = false;
    if (props.search_string == "" || stringIncludes(props.category_name, props.search_string)) {
        show_whole_category = true;
        show_category = true
    }
    let entries = [];
    let index = 0;
    for (let entry of props.command_list) {
        if (show_whole_category || stringIncludes(entry.signature, props.search_string)) {
            show_category = true;
            entries.push(<CommandEntry key={index} {...entry}/>);
            index += 1;
        }

    }
    if (show_category) {
        return (
            <Fragment>
                <h5 style={{marginTop: 20}}>
                    {props.category_name}
                </h5>
                {entries}
                <Divider/>
            </Fragment>
        )
    } else {
        return null
    }
}

CategoryEntry = memo(CategoryEntry);

CategoryEntry.propTypes = {
    category_name: PropTypes.string,
    command_list: PropTypes.array,
    search_string: PropTypes.string
};

function CommandEntry(props) {
    const [isOpen, setIsOpen] = useState(false);

    const statusFuncs = useContext(StatusContext);

    function _handleClick() {
        setIsOpen(!isOpen);
    }

    function _doCopy() {
        if (navigator.clipboard && window.isSecureContext) {
            if (props.kind == "method" || props.kind == "attribute") {
                void navigator.clipboard.writeText("self." + props.signature)
            } else {
                void navigator.clipboard.writeText(props.signature)
            }

            statusFuncs.statusMessage("command copied");
        }
    }

    let md_style = {
        "display": "block",
        "fontSize": 13
    };
    let re = new RegExp("^([^(]*)");
    let bolded_command = props.signature.replace(re, function (matched) {
            return "<span class='command-name'>" + matched + "</span>"
        }
    );

    return (
        <Fragment>
            <Button minimal={true} outlined={isOpen} className="bp5-monospace-text"
                    onClick={_handleClick}>
                <span dangerouslySetInnerHTML={{__html: bolded_command}}/>
            </Button>
            <Collapse isOpen={isOpen}>
                <div style={{maxWidth: 700, position: "relative"}}>
                    <GlyphButton style={{position: "absolute", right: 5, top: 5, marginTop: 0}}
                                 icon="clipboard"
                                 small={true}
                                 handleClick={_doCopy}
                    />
                    <div style={md_style}
                         className="notes-field-markdown-output bp5-button bp5-outlined"
                         dangerouslySetInnerHTML={{__html: props.body}}/>
                </div>
            </Collapse>
        </Fragment>
    )
}

CommandEntry = memo(CommandEntry);

CommandEntry.propTypes = {
    name: PropTypes.string,
    signature: PropTypes.string,
    body: PropTypes.string,
    kind: PropTypes.string

};

function ApiMenu(props) {
    const [currently_selected, set_currently_selected] = useState(null);
    const [menu_created, set_menu_created] = useState(null);

    useEffect(() => {
        if (!menu_created && props.item_list.length > 0) {
            set_current_selected(props.item_list[0].name);
            set_menu_created(true)
        }
    });

    function _buildMenu() {
        let choices = [];
        for (let item of props.item_list) {
            if (item.kind == "header") {
                choices.push(<MenuDivider title={item.name}/>)
            } else {
                choices.push(<MenuItem text={item.name}/>)
            }
        }

        return (
            <Menu>
                {choices}
            </Menu>
        )
    }

    function _handleChange(value) {
        set_currently_selected(value)
    }

    let option_list = [];
    for (let item of props.item_list) {
        option_list.push(item.name)
    }
    return (
        <BpSelect options={option_list}
                  onChange={_handleChange}
                  buttonIcon="application"
                  value={currently_selected}/>
    )
}

ApiMenu = memo(ApiMenu);

ApiMenu.propTypes = {
    item_list: PropTypes.array
};
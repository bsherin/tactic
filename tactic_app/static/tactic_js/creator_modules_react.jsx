

import React from "react";
import PropTypes from 'prop-types';

import { Button, Card, Collapse, Divider, Menu, MenuItem, MenuDivider } from "@blueprintjs/core";
import {RegionCardinality} from "@blueprintjs/table";

import {Toolbar} from "./blueprint_toolbar.js";
import {postAjax} from "./communication_react.js";
import {SearchForm} from "./library_widgets.js";
import {LabeledSelectList, LabeledFormField, LabeledTextArea, BpOrderableTable, GlyphButton} from "./blueprint_react_widgets.js";
import {doFlash} from "./toaster.js";
import _ from 'lodash';
import {doBinding, isInt} from "./utilities_react";
import {BpSelect} from "./blueprint_mdata_fields";

export {OptionModule, ExportModule, CommandsModule, correctOptionListTypes}

function correctType(type, val, error_flag="__ERROR__") {
    let result;
    if (val == null || val.length == 0) {
        return null
    }
    switch (type) {
        case "int":
            if (isInt(val)) {
                result = typeof val == "number" ? val : parseInt(val)
            }
            else {
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
            }
            else {
                let lval = val.toLowerCase();
                if (lval == "false") {
                    result = false
                }
                else if (lval == "true") {
                    result = true;
                }
                else {
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
        option.default = correctType(option.type, option.default, null)
    }
    return copied_olist
}

class OptionModuleForm extends React.Component {

    constructor(props){
        super(props);
        this.option_types = ['text', 'int', 'float', 'boolean', 'textarea', 'codearea', 'column_select', 'document_select',
            'list_select', 'collection_select', 'palette_select', 'pipe_select', 'custom_list', 'function_select',
            'class_select', 'tile_select', 'divider'];
        this.taggable_types = ["class_select", "function_select", "pipe_select", "list_select", "collection_select"];
        this.state = {
        };
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleDisplayTextChange = this.handleDisplayTextChange.bind(this);
        this.handleDefaultChange = this.handleDefaultChange.bind(this);
        this.handleTagChange = this.handleTagChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleSpecialListChange = this.handleSpecialListChange.bind(this)
    }

    _setFormState(new_state) {
       let new_form_state = Object.assign(_.cloneDeep(this.props.form_state), new_state);
       this.props.setFormState(new_form_state)
    }

    handleNameChange(event) {
        this._setFormState({ "name": event.target.value });
    }

    handleDisplayTextChange(event) {
        this._setFormState({ "display_text": event.target.value });
    }

    handleDefaultChange(event) {
        let new_val = this.props.form_state.type == "boolean" ? event.target.checked : event.target.value;
        this._setFormState({ "default": new_val });
    }
    handleTagChange(event) {
        this._setFormState({ "tags": event.target.value });
    }

    handleSpecialListChange(event) {
        this._setFormState({ "special_list": textRowsToArray(event.target.value) });
    }
    
    handleTypeChange(event) {
        let new_type = event.currentTarget.value;
        let updater = {"type": new_type};
        if (new_type != "custom_list") {
            updater["special_list"] = ""
        }
        if (!this.taggable_types.includes(new_type)) {
            updater["tags"] = ""
        }
        if (new_type == "boolean") {
            updater["default"] = false
        }

        this._setFormState(updater)
    }

    handleSubmit(update) {
        let copied_state = _.cloneDeep(this.props.form_state);
        delete copied_state.default_warning_text;
        delete copied_state.name_warning_text;
        if (!update && this.props.nameExists(this.props.form_state.name, update)) {
            this._setFormState({name_warning_text: "Name exists"});
            return
        }
        let val = this.props.form_state.default;
        let fixed_val = correctType(copied_state.type, val);
        if (fixed_val == "__ERROR__") {
            this._setFormState({default_warning_text: "Invalid value"});
            return
        } else {
            copied_state.default = fixed_val

        }
        this._setFormState({default_warning_text: null, name_warning_text: null});
        this.props.handleCreate(copied_state, update)
    }

    render () {
        let self = this;
        return (
            <form>
                <div style={{display: "flex", flexDirection: "column", padding: 25}}>
                    <div style={{display: "flex", flexWrap: "wrap", flexDirection: "row", marginBottom: 20}}>
                        <Button type="submit"
                                style={{height: "fit-content", alignSelf: "start", marginTop: 23, marginRight: 5}}
                                text="create"
                                intent="primary"
                                onClick={e =>{
                                    e.preventDefault();
                                    self.handleSubmit(false)}} />
                        <Button type="submit"
                                style={{height: "fit-content", alignSelf: "start", marginTop: 23, marginRight: 5}}
                                disabled={this.props.active_row == null}
                                text="update"
                                intent="warning"
                                onClick={e =>{
                                    e.preventDefault();
                                    self.handleSubmit(true)}}/>
                        <Button style={{height: "fit-content", alignSelf: "start", marginTop: 23, marginRight: 5}}
                                disabled={this.props.active_row == null}
                                text="delete"
                                intent="danger"
                                onClick={e =>{
                                    e.preventDefault();
                                    self.props.deleteOption()}} />
                        <Button style={{height: "fit-content", alignSelf: "start", marginTop: 23, marginRight: 5}}
                                text="clear"
                                onClick={e =>{
                                    e.preventDefault();
                                    self.props.clearForm()}} />
                    </div>
                    <div style={{display: "flex", flexWrap: "wrap", flexDirection: "row"}}>
                        <LabeledFormField label="Name" onChange={this.handleNameChange} the_value={this.props.form_state.name}
                                          helperText={this.props.form_state.name_warning_text}
                        />
                        <LabeledSelectList label="Type" option_list={this.option_types} onChange={this.handleTypeChange} the_value={this.props.form_state.type}/>
                        <LabeledFormField label="Display Text" onChange={this.handleDisplayTextChange} the_value={this.props.form_state.display_text}
                                          helperText={this.props.form_state.display_warning_text}
                        />
                        {this.props.form_state.type != "divider" &&
                            <LabeledFormField label="Default" onChange={this.handleDefaultChange} the_value={this.props.form_state.default}
                                              isBool={this.props.form_state.type == "boolean"}
                                              helperText={this.props.form_state.default_warning_text}
                            />
                        }
                    {this.props.form_state.type == "custom_list" &&
                        <LabeledTextArea label="Special List"
                                         onChange={this.handleSpecialListChange}
                                         the_value={arrayToTextRows(this.props.form_state.special_list)}/>}
                    {this.taggable_types.includes(this.props.form_state.type) &&
                        <LabeledFormField label="Tag" onChange={this.handleTagChange} the_value={this.props.form_state.tags}/>
                    }
                    </div>
                </div>

            </form>
        )
    }
}

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

class OptionModule extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        this.table_ref = React.createRef();
        this.blank_form = {
            name: "",
            display_text: "",
            type: "text",
            default: "",
            special_list: "",
            tags: "",
            default_warning_text: null,
            name_warning_text: null
        };
        this.state = {
            active_row: null,
            form_state: {...this.blank_form}
        };
        this.handleActiveRowChange = this.handleActiveRowChange.bind(this);
        this.handleCreate = this.handleCreate.bind(this)
    }

    _delete_option() {
        let new_data_list = _.cloneDeep(this.props.data_list);
        new_data_list.splice(this.state.active_row, 1);
        let old_active_row = this.state.active_row;
        this.props.handleChange(new_data_list, ()=>{
            if (old_active_row >= this.props.data_list.length) {
                this._handleRowDeSelect()
            }
            else {
                this.handleActiveRowChange(old_active_row)
            }
        });
    }

    _clearHighlights() {
        let new_data_list = [];
        for (let option of this.props.data_list) {
            if ("className" in option && option.className) {
                let new_option = {...option};
                new_option.className = "";
                new_data_list.push(new_option)
            }
            else {
                new_data_list.push(option)
            }
        }
        let self = this;
        // The forceUpdate below is necessary to consistently make the change appear
        this.props.handleChange(new_data_list, ()=>{self.table_ref.current.forceUpdate()})
    }

    handleCreate(new_row, update) {
        let new_data_list = [...this.props.data_list];
        new_row.className = "option-row-highlight";
        if (update) {
            new_data_list[this.state.active_row] = new_row;

        }
        else {
            new_data_list.push(new_row);
        }
        let self = this;
        this.props.handleChange(new_data_list, ()=>{setTimeout(self._clearHighlights, 5 * 1000);})
    }

    _setFormState(new_form_state) {
        this.setState({form_state: new_form_state})
    }

    _nameExists(name, update) {
        let rnum = 0;
        for (let option of this.props.data_list) {
            if (option.name == name) {
                return !(update && (rnum == this.state.active_row))
            }
            rnum += 1;
        }
        return false
    }

    handleActiveRowChange(row_index) {
        let new_form_state = Object.assign({...this.blank_form}, this.props.data_list[row_index]);
        this.setState({form_state: new_form_state, active_row: row_index})
    }

    _clearForm() {
        this._setFormState({
            name: "",
            display_text: "",
            default: "",
            special_list: "",
            tags: "",
            default_warning_text: null,
            name_warning_text: null
        })
    }

    _handleRowDeSelect() {
        this.setState({active_row: null}, this._clearForm)
    }

    render () {
        var cols = ["name", "type", "display_text", "default", "special_list", "tags"];
        let options_pane_style = {
            "marginTop": 10,
            "marginLeft": 10,
            "marginRight": 10,
            "height": this.props.available_height
        };
        let copied_dlist = _.cloneDeep(this.props.data_list);
        for (let option of copied_dlist) {
            if (typeof option.default == "boolean") {
                option.default = option.default ? "True" : "False"
            }
            for (let param in option) {
                if (Array.isArray(option[param])) {
                    option[param] = arrayToString(option[param]);
                }
            }
        }
        return (
            <Card elevation={1} id="options-pane" className="d-flex flex-column" style={options_pane_style}>
                {this.props.foregrounded &&
                    <BpOrderableTable columns={cols}
                                      ref={this.table_ref}
                                      data_array={copied_dlist}
                                      active_row={this.state.active_row}
                                      handleActiveRowChange={this.handleActiveRowChange}
                                      handleChange={(olist)=>{this.props.handleChange(correctOptionListTypes(olist))}}
                                      selectionModes={[RegionCardinality.FULL_ROWS]}
                                      handleDeSelect={this._handleRowDeSelect}
                                      content_editable={false}
                    />
                }

                <OptionModuleForm handleCreate={this.handleCreate}
                                  deleteOption={this._delete_option}
                                  active_row={this.state.active_row}
                                  setFormState={this._setFormState}
                                  clearForm={this._clearForm}
                                  form_state={this.state.form_state}
                                  nameExists={this._nameExists}/>
            </Card>
        )
    }

}

OptionModule.propTypes = {
    data_list: PropTypes.array,
    foregrounded: PropTypes.bool,
    handleChange: PropTypes.func,
    handleNotesAppend: PropTypes.func,
    available_height: PropTypes.number
};

class ExportModuleForm extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            "name": "",
            "tags": ""
        };
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleTagChange = this.handleTagChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleNameChange(event) {
        this.setState({ "name": event.target.value });
    }


    handleTagChange(event) {
        this.setState({ "tags": event.target.value });
    }

    handleSubmit() {
        this.props.handleCreate(this.state)
    }

    render () {
        let self = this;
        return (
            <form>
                <div style={{display: "flex", flexDirection: "column", padding: 25}}>
                    <div style={{display: "flex", flexWrap: "wrap", flexDirection: "row", marginBottom: 20}}>
                        <Button style={{height: "fit-content", alignSelf: "start", marginTop: 23, marginRight: 5}}
                                text="Create"
                                type="submit"
                                intent="primary"
                                onClick={e => {
                                    e.preventDefault();
                                    self.handleSubmit()}}/>
                        <Button style={{height: "fit-content", alignSelf: "start", marginTop: 23, marginRight: 5}}
                                disabled={this.props.active_row == null}
                                text="delete"
                                intent="danger"
                                onClick={e =>{
                                    e.preventDefault();
                                    self.props.deleteExport()}} />
                    </div>
                <div style={{display: "flex", flexWrap: "wrap", flexDirection: "row"}}>
                    <LabeledFormField label="Name" onChange={this.handleNameChange} the_value={this.state.name} />
                    <LabeledFormField label="Tags" onChange={this.handleTagChange} the_value={this.state.tags}/>
                </div>

                </div>
            </form>
        )
    }
}

ExportModuleForm.propTypes = {
    handleCreate: PropTypes.func,
    deleteExport: PropTypes.func,
    active_row: PropTypes.number
};

class ExportModule extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            "active_row": 0
        };
        this.handleActiveRowChange = this.handleActiveRowChange.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.delete_export = this.delete_export.bind(this)
    }

    delete_export() {
        let new_data_list = this.props.data_list;
        new_data_list.splice(this.state.active_row, 1);
        let old_active_row = this.state.active_row;
        this.props.handleChange(new_data_list, ()=>{
            if (old_active_row >= this.props.data_list.length) {
                this.setState({active_row: null})
            }
            else {
                this.handleActiveRowChange(old_active_row)
            }
        })
    }

    handleCreate(new_row) {
        let new_data_list = this.props.data_list;
        new_data_list.push(new_row);
        this.props.handleChange(new_data_list)
    }

    handleActiveRowChange(row_index) {
        this.setState({"active_row": row_index})
    }

    render () {
        var cols = ["name", "tags"];
        let exports_pane_style = {
            "marginTop": 10,
            "marginLeft": 10,
            "marginRight": 10,
            "height": this.props.available_height
        };
        return (

            <Card elevation={1} id="exports-pane" className="d-flex flex-column" style={exports_pane_style}>
                {this.props.foregrounded &&
                    <BpOrderableTable columns={cols}
                                      data_array={this.props.data_list}
                                      active_row={this.state.active_row}
                                      handleActiveRowChange={this.handleActiveRowChange}
                                      handleChange={this.props.handleChange}
                                      content_editable={true}/>
                }
                <ExportModuleForm handleCreate={this.handleCreate}
                                  deleteExport={this.delete_export}
                                  active_row={this.state.active_row}

                />
            </Card>
        )
    }

}

ExportModule.propTypes = {
    data_list: PropTypes.array,
    foregrounded: PropTypes.bool,
    handleChange: PropTypes.func,
    handleNotesAppend: PropTypes.func,
    available_height: PropTypes.number
};

class CommandsModule extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        this.state = {
            search_string: "",
            api_dict: {},
            ordered_categories: [],
            object_api_dict: {},
            ordered_object_categories: []
        };
    }

    componentDidMount() {
        let self = this;
        postAjax("get_api_dict", {}, function (data) {
            self.setState({api_dict: data.api_dict_by_category,
                object_api_dict: data.object_api_dict_by_category,
                ordered_object_categories: data.ordered_object_categories,
                ordered_categories: data.ordered_api_categories})
        })
    }

    _updateSearchState(new_state) {
        this.setState(new_state)
    }

    render () {
        let commands_pane_style = {
            "marginTop": 10,
            "marginLeft": 10,
            "marginRight": 10,
            "paddingTop": 10,
        };
        let menu_items = [];
        let object_items = [];
        for (let category of this.state.ordered_object_categories) {
            let res = <ObjectCategoryEntry category_name={category}
                                           key={category}
                                           search_string={this.state.search_string}
                                           class_list={this.state.object_api_dict[category]}/>;
            object_items.push(res)
        }
        let command_items = [];
        for (let category of this.state.ordered_categories) {
            let res = <CategoryEntry category_name={category}
                                     key={category}
                                      search_string={this.state.search_string}
                                      command_list={this.state.api_dict[category]}/>;
            command_items.push(res)
        }
        return (

            <Card elevation={1} id="commands-pane" className="d-flex flex-column" style={commands_pane_style}>
                <div style={{display: "flex", justifyContent: "flex-end", marginRight: 25}}>
                <SearchForm update_search_state={this._updateSearchState}
                            search_string={this.state.search_string}/>
                </div>
                <div ref={this.props.commands_ref} style={{fontSize: 13, overflow: "auto", height: this.props.available_height}}>
                    <h4>Object api</h4>
                    {object_items}
                    <h4 style={{marginTop: 20}}>TileBase methods (accessed with self)</h4>
                    {command_items}
                </div>
            </Card>
        )
    }

}

CommandsModule.propTypes = {
    commands_ref: PropTypes.object,
    available_height: PropTypes.number
};

function stringIncludes(str1, str2) {
    return str1.toLowerCase().includes(str2.toLowerCase())
}

class ObjectCategoryEntry extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
    }

    render() {
        let classes = [];
        let show_whole_category = false;
        let show_category = false;
        if (this.props.search_string == "" || stringIncludes(this.props.category_name, this.props.search_string)) {
            show_whole_category = true;
            show_category = true
        }
        let index = 0;
        for (let class_entry of this.props.class_list) {
            let entries = [];
            let show_class = false;
            if (class_entry[2] == "class") {
                let show_whole_class = false;
                if (show_whole_category || stringIncludes(class_entry[0], this.props.search_string)) {
                    show_whole_class = true;
                    show_category = true;
                    show_class = true
                }
                for (let entry of class_entry[1]) {
                    entry["kind"] = "class_" + entry["kind"];
                    let show_entry = false;
                    if (show_whole_class || stringIncludes(entry.signature, this.props.search_string)) {
                        entries.push(<CommandEntry key={`entry_${index}`} {...entry}/>);
                        index += 1;
                        show_class = true;
                        show_category = true;

                    }
                }
                if (show_class) {
                    classes.push(
                        <React.Fragment key={`class_${index}`}>
                            <h6 style={{fontStyle: "italic", marginTop: 20, fontFamily: "monospace"}}>{"class" + class_entry[0]}</h6>
                            {entries}
                        </React.Fragment>
                    );
                    index += 1;
                }


            }
            else {
                let entry = class_entry[1];
                if (show_whole_category || stringIncludes(entry.signature, this.props.search_string)) {
                    entries.push(<CommandEntry key={`entry_${index}`} {...entry}/>);
                    index += 1;
                    show_category = true
                }
            }

        }

        if (show_category) {
            return (
                <React.Fragment key={this.props.category_name} >
                    <h5 style={{marginTop: 20}}>
                        {this.props.category_name}
                    </h5>
                    {classes}
                    <Divider/>
                </React.Fragment>
            )
        }
        else {
            return null
        }
    }
}

ObjectCategoryEntry.propTypes = {
    category_name: PropTypes.string,
    class_list: PropTypes.array,
    search_string: PropTypes.string,
};

class CategoryEntry extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
    }

    render() {
        let show_whole_category = false;
        let show_category = false;
        if (this.props.search_string == "" || stringIncludes(this.props.category_name, this.props.search_string)) {
            show_whole_category = true;
            show_category = true
        }
        let entries = [];
        let index = 0;
        for (let entry of this.props.command_list) {
            if (show_whole_category || stringIncludes(entry.signature, this.props.search_string)) {
                show_category = true;
                entries.push(<CommandEntry key={index} {...entry}/>);
                index += 1;
            }

        }
        if (show_category) {
            return (
                <React.Fragment>
                    <h5 style={{marginTop: 20}}>
                        {this.props.category_name}
                    </h5>
                    {entries}
                    <Divider/>
                </React.Fragment>
            )
        }
        else {
            return null
        }

    }
}

CategoryEntry.propTypes = {
    category_name: PropTypes.string,
    command_list: PropTypes.array,
    search_string: PropTypes.string
};

// noinspection JSIgnoredPromiseFromCall
class CommandEntry extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
        this.state = {
            isOpen: false
        }
    }
    _handleClick() {
        this.setState({ isOpen: !this.state.isOpen });
    }
    _doCopy() {
        if (navigator.clipboard && window.isSecureContext) {
            if (this.props.kind == "method" || this.props.kind == "attribute") {
                navigator.clipboard.writeText("self." + this.props.signature)
            }
            else {
                navigator.clipboard.writeText(this.props.signature)
            }

            doFlash({message: "command copied", "timeout": 2000, "alert_type": "alert-success"});
        }
    }
    render() {
        let md_style = {
            "display": "block",
            // "maxHeight": this.state.md_height,
            "fontSize": 13
        };
        return (
            <React.Fragment>
                <Button minimal={true} outlined={this.state.isOpen} className="bp4-monospace-text"
                        onClick={this._handleClick}>
                        {this.props.signature}
                </Button>
                <Collapse isOpen={this.state.isOpen}>
                    <div style={{maxWidth: 700, position: "relative"}}>
                        <GlyphButton style={{position: "absolute", right: 5, top: 5, marginTop: 0}}
                                     icon="clipboard"
                                     small={true}
                                     handleClick={this._doCopy}
                        />
                        <div style={md_style}
                             className="notes-field-markdown-output bp4-button bp4-outlined"
                             dangerouslySetInnerHTML={{__html: this.props.body}}/>
                    </div>
                </Collapse>
            </React.Fragment>
        )
    }
}

CommandEntry.propTypes = {
    name: PropTypes.string,
    signature: PropTypes.string,
    body: PropTypes.string,
    kind: PropTypes.string

};

class ApiMenu extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
        this.state = {
            currently_selected: null,
            menu_created: false
        }
    }

    componentDidMount() {
        if (!this.state.menu_created && this.props.item_list.length > 0) {
            this.setState({current_selected: this.props.item_list[0].name, menu_created: true})
        }
    }

    componentDidUpdate() {
        if (!this.state.menu_created && this.props.item_list.length > 0) {
            this.setState({current_selected: this.props.item_list[0].name, menu_created: true})
        }
    }

    _buildMenu() {
        let choices = [];
        for (let item of this.props.item_list) {
            if (item.kind == "header") {
                choices.push(<MenuDivider title={item.name}/>)
            }
            else {
                choices.push(<MenuItem text={item.name}/>)
            }
        }

        return (
            <Menu>
                {choices}
            </Menu>
        )
    }

    _handleChange(value) {
        this.setState({currently_selected: value})
    }


    render () {
        let option_list = [];
        for (let item of this.props.item_list) {
            option_list.push(item.name)
        }
        return (
            // <Popover minimal={true} content={this.state.the_menu} position={PopoverPosition.BOTTOM_LEFT}>
            //     <Button text="jump to..." small={true} minimal={true}/>
            // </Popover>
            <BpSelect options={option_list}
                      onChange={this._handleChange}
                      buttonIcon="application"
                      value={this.state.currently_selected}/>
        )
    }
}

ApiMenu.propTypes = {
    item_list: PropTypes.array
};
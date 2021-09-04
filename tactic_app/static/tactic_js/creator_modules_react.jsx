

import React from "react";
import PropTypes from 'prop-types';

import { Button, Card, Collapse, Divider, Menu, MenuItem, MenuDivider } from "@blueprintjs/core";

import {Toolbar} from "./blueprint_toolbar.js";
import {postAjax} from "./communication_react.js";
import {SearchForm} from "./library_widgets.js";
import {LabeledSelectList, LabeledFormField, BpOrderableTable, GlyphButton} from "./blueprint_react_widgets.js";
import {doFlash} from "./toaster.js";
import _ from 'lodash';
import {doBinding} from "./utilities_react";
import {BpSelect} from "./blueprint_mdata_fields";

export {OptionModule, ExportModule, CommandsModule}

class OptionModuleForm extends React.Component {

    constructor(props){
        super(props);
        this.option_types = ['text', 'int', 'float', 'boolean', 'textarea', 'codearea', 'column_select', 'document_select',
            'list_select', 'collection_select', 'palette_select', 'pipe_select', 'custom_list', 'function_select', 'class_select', 'tile_select'];
        this.taggable_types = ["class_select", "function_select", "pipe_select", "list_select",
                                      "collection_select"];
        this.state = {
            "name": "",
            "type": "text",
            "default": "",
            "special_list": "",
            "tags": ""
        };
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleDefaultChange = this.handleDefaultChange.bind(this);
        this.handleTagChange = this.handleTagChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleSpecialListChange = this.handleSpecialListChange.bind(this)
    }

    handleNameChange(event) {
        this.setState({ "name": event.target.value });
    }

    handleDefaultChange(event) {
        this.setState({ "default": event.target.value });
    }
    handleTagChange(event) {
        this.setState({ "tags": event.target.value });
    }

    handleSpecialListChange(event) {
        this.setState({ "special_list": event.currentTarget.value });
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

        this.setState(updater)
    }

    handleSubmit() {
        this.props.handleCreate(this.state)
    }

    render () {
        return (
            <form>
                <div style={{display: "flex", flexDirection: "row", padding: 25}}>
                    <LabeledFormField label="Name" onChange={this.handleNameChange} the_value={this.state.name} />
                    <LabeledSelectList label="Type" option_list={this.option_types} onChange={this.handleTypeChange} the_value={this.state.type}/>
                    <LabeledFormField label="Default" onChange={this.handleDefaultChange} the_value={this.state.default_value}/>
                    {this.state.type == "custom_list" &&
                        <LabeledFormField label="Special List" onChange={this.handleSpecialListChange} the_value={this.state.special_list}/>}
                    {this.taggable_types.includes(this.state.type) &&
                        <LabeledFormField label="Tag" onChange={this.handleTagChange} the_value={this.state.tag}/>
                    }
                </div>
                <Button type="submit" text="Create" onClick={e => {
                    e.preventDefault();
                    this.handleSubmit()}} />
            </form>
        )
    }
}

OptionModuleForm.propTypes = {
    handleCreate: PropTypes.func
};

class OptionModule extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            "active_row": 0
        };
        this.handleActiveRowChange = this.handleActiveRowChange.bind(this);
        this.handleCreate = this.handleCreate.bind(this)
    }

    delete_option() {
        let new_data_list = _.cloneDeep(this.props.data_list);
        new_data_list.splice(this.state.active_row, 1);
        this.props.handleChange(new_data_list)
    }

    send_doc_text() {
        let res_string = "\n\noptions: \n\n";
        for (let opt of this.props.data_list) {
            res_string += ` * \`${opt.name}\` (${opt.type}): \n`
        }
        this.props.handleNotesAppend(res_string);
    }

    handleCreate(new_row) {
        let new_data_list = this.props.data_list;
        new_data_list.push(new_row);
        this.props.handleChange(new_data_list)
    }


    handleActiveRowChange(row_index) {
        this.setState({"active_row": row_index})
    }
    
    get button_groups() {
        let bgs = [[{"name_text": "delete", "icon_name": "trash", "click_handler": this.delete_option, tooltip: "Delete option"},
                    {"name_text": "toMeta", "icon_name": "properties", "click_handler": this.send_doc_text, tooltip: "Append info to notes field"}
                    ]];
        for (let bg of bgs) {
            for (let but of bg) {
                but.click_handler = but.click_handler.bind(this)
            }
        }
        return bgs
    }

    render () {
        var cols = ["name", "type", "default", "special_list", "tags"];
        let options_pane_style = {
            "marginTop": 10,
            "marginLeft": 10,
            "marginRight": 10
        };
        if (this.state.active_row >= this.props.data_list.length) {
            this.state.active_row = this.props.data_list.length - 1
        }
        return (
            <Card elevation={1} id="options-pane" className="d-flex flex-column" style={options_pane_style}>
                <div className="d-flex flex-row mb-2">
                    <Toolbar button_groups={this.button_groups}/>
                </div>
                {this.props.foregrounded &&
                    <BpOrderableTable columns={cols}
                                data_array={this.props.data_list}
                                active_row={this.state.active_row}
                                handleActiveRowChange={this.handleActiveRowChange}
                                handleChange={this.props.handleChange}
                                content_editable={true}
                />
                }

                <OptionModuleForm handleCreate={this.handleCreate}/>
            </Card>
        )
    }

}

OptionModule.propTypes = {
    data_list: PropTypes.array,
    foregrounded: PropTypes.bool,
    handleChange: PropTypes.func,
    handleNotesAppend: PropTypes.func
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
        return (
            <form>
                <div style={{display: "flex", flexDirection: "row", padding: 25}}>
                    <LabeledFormField label="Name" onChange={this.handleNameChange} the_value={this.state.name} />
                    <LabeledFormField label="Tag" onChange={this.handleTagChange} the_value={this.state.tag}/>
                </div>
                <Button text="Create" type="submit" onClick={e => {
                    e.preventDefault();
                    this.handleSubmit()}}/>
            </form>
        )
    }
}

ExportModuleForm.propTypes = {
    handleCreate: PropTypes.func
};

class ExportModule extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            "active_row": 0
        };
        this.handleActiveRowChange = this.handleActiveRowChange.bind(this);
        this.handleCreate = this.handleCreate.bind(this)
    }

    delete_export() {
        let new_data_list = this.props.data_list;
        new_data_list.splice(this.state.active_row, 1);
        this.props.handleChange(new_data_list)
    }

    send_doc_text() {
        let res_string = "\n\nexports: \n\n";
        for (let exp of this.props.data_list) {
            res_string += ` * \`${exp.name}\` : \n`
        }
        this.props.handleNotesAppend(res_string);
    }

    handleCreate(new_row) {
        let new_data_list = this.props.data_list;
        new_data_list.push(new_row);
        this.props.handleChange(new_data_list)
    }


    handleActiveRowChange(row_index) {
        this.setState({"active_row": row_index})
    }

    get button_groups() {
        let bgs = [[{"name_text": "delete", "icon_name": "trash", "click_handler": this.delete_export, tooltip: "Delete export"},
                    {"name_text": "toMeta", "icon_name": "properties", "click_handler": this.send_doc_text, tooltip: "Append info to notes field"}
                    ]];
        for (let bg of bgs) {
            for (let but of bg) {
                but.click_handler = but.click_handler.bind(this)
            }
        }
        return bgs
    }

    render () {
        var cols = ["name", "tags"];
        let exports_pane_style = {
            "marginTop": 10,
            "marginLeft": 10,
            "marginRight": 10
        };
        if (this.state.active_row >= this.props.data_list.length) {
            this.state.active_row = this.props.data_list.length - 1
        }
        return (

            <Card elevation={1} id="exports-pane" className="d-flex flex-column" style={exports_pane_style}>
                <div className="d-flex flex-row mb-2">
                    <Toolbar button_groups={this.button_groups}/>
                </div>
                {this.props.foregrounded &&
                    <BpOrderableTable columns={cols}
                                      data_array={this.props.data_list}
                                      active_row={this.state.active_row}
                                      handleActiveRowChange={this.handleActiveRowChange}
                                      handleChange={this.props.handleChange}
                                      content_editable={true}/>
                }
                <ExportModuleForm handleCreate={this.handleCreate}/>
            </Card>
        )
    }

}

ExportModule.propTypes = {
    data_list: PropTypes.array,
    foregrounded: PropTypes.bool,
    handleChange: PropTypes.func,
    handleNotesAppend: PropTypes.func

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
                        entries.push(<CommandEntry {...entry}/>);
                        show_class = true;
                        show_category = true
                    }
                }
                if (show_class) {
                    classes.push(
                        <React.Fragment>
                            <h6 style={{marginTop: 20, fontFamily: "monospace"}}>{"class " + class_entry[0]}</h6>
                            {entries}
                        </React.Fragment>
                    )
                }

            }
            else {
                let entry = class_entry[1];
                if (show_whole_category || stringIncludes(entry.signature, this.props.search_string)) {
                    entries.push(<CommandEntry {...entry}/>);
                    show_category = true
                }
            }
        }

        if (show_category) {
            return (
                <React.Fragment>
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
        for (let entry of this.props.command_list) {
            if (show_whole_category || stringIncludes(entry.signature, this.props.search_string)) {
                show_category = true;
                entries.push(<CommandEntry {...entry}/>)
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
                <Button minimal={true} outlined={this.state.isOpen} className="bp3-monospace-text"
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
                             className="notes-field-markdown-output bp3-button bp3-outlined"
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

export {OptionModule, ExportModule}

import {Toolbar} from "./react_toolbar.js";
import {LabeledSelectList, LabeledFormField, OrderableTable} from "./react_widgets.js";

var Rbs = window.ReactBootstrap;


class OptionModuleForm extends React.Component {

    constructor(props){
        super(props);
        this.option_types = ['text', 'int', 'boolean', 'textarea', 'codearea', 'column_select', 'document_select',
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
        this.setState({ "special_list": event.target.value });
    }
    
    handleTypeChange(new_type) {
        this.setState({"type": new_type})
    }

    handleSubmit() {
        this.props.handleCreate(this.state)
    }

    render () {
        return (
            <Rbs.Form>
                <Rbs.Form.Row>
                    <LabeledFormField label="Name" onChange={this.handleNameChange} the_value={this.state.name} />
                    <LabeledSelectList label="Type" option_list={this.option_types} onChange={this.handleTypeChange} the_value={this.state.type}/>
                    <LabeledFormField label="Default" onChange={this.handleDefaultChange} the_value={this.state.default_value}/>
                    <LabeledFormField label="Special List" onChange={this.handleSpecialListChange} the_value={this.state.special_list} show={this.state.type == "custom_list"}/>
                    <LabeledFormField label="Tag" onChange={this.handleTagChange} the_value={this.state.tag} show={this.taggable_types.includes(this.state.type)}/>

                </Rbs.Form.Row>
                    <Rbs.Button variant="outline-secondary" type="button" onClick={this.handleSubmit}>
                        Create
                    </Rbs.Button>
            </Rbs.Form>
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
        let new_data_list = this.props.data_list;
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
        let bgs = [[{"name_text": "delete", "icon_name": "trash", "click_handler": this.delete_option},
                    {"name_text": "to meta", "icon_name": "list-alt", "click_handler": this.send_doc_text}
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
            "marginTop": 25,
            "marginLeft": 25,
            "marginRight": 25
        };
        if (this.state.active_row >= this.props.data_list.length) {
            this.state.active_row = this.props.data_list.length - 1
        }
        return (

            <div id="options-pane" className="d-flex flex-column" style={options_pane_style}>
                <div className="d-flex flex-row">
                    <Toolbar button_groups={this.button_groups}/>
                </div>
                <OrderableTable columns={cols}
                                data_array={this.props.data_list}
                                active_row={this.state.active_row}
                                handleActiveRowChange={this.handleActiveRowChange}
                                handleChange={this.props.handleChange}
                                content_editable={true}
                />
                <OptionModuleForm handleCreate={this.handleCreate}/>
            </div>
        )
    }

}

OptionModule.propTypes = {
    data_list: PropTypes.array,
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
            <Rbs.Form>
                <Rbs.Form.Row>
                    <LabeledFormField label="Name" onChange={this.handleNameChange} the_value={this.state.name} />
                    <LabeledFormField label="Tag" onChange={this.handleTagChange} the_value={this.state.tag}/>
                </Rbs.Form.Row>
                    <Rbs.Button variant="outline-secondary" type="button" onClick={this.handleSubmit}>
                        Create
                    </Rbs.Button>
            </Rbs.Form>
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
        let bgs = [[{"name_text": "delete", "icon_name": "trash", "click_handler": this.delete_export},
                    {"name_text": "to meta", "icon_name": "list-alt", "click_handler": this.send_doc_text}
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
            "marginTop": 25,
            "marginLeft": 25,
            "marginRight": 25
        };
        if (this.state.active_row >= this.props.data_list.length) {
            this.state.active_row = this.props.data_list.length - 1
        }
        return (

            <div id="exports-pane" className="d-flex flex-column" style={exports_pane_style}>
                <div className="d-flex flex-row">
                    <Toolbar button_groups={this.button_groups}/>
                </div>
                <OrderableTable columns={cols}
                                data_array={this.props.data_list}
                                active_row={this.state.active_row}
                                handleActiveRowChange={this.handleActiveRowChange}
                                handleChange={this.props.handleChange}
                                content_editable={true}
                />
                <ExportModuleForm handleCreate={this.handleCreate}/>
            </div>
        )
    }

}

ExportModule.propTypes = {
    data_list: PropTypes.array,
    handleChange: PropTypes.func,
    handleNotesAppend: PropTypes.func

};
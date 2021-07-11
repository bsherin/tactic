
import React from "react";
import * as ReactDOM from 'react-dom'
import PropTypes from 'prop-types';
import DropzoneComponent from 'react-dropzone-component';
import { renderToStaticMarkup } from 'react-dom/server'

import { Checkbox, Dialog, FormGroup, Classes, Button, InputGroup, ButtonGroup, Intent, Collapse, Divider} from "@blueprintjs/core";

import {BpSelect} from "./blueprint_mdata_fields.js"
import {doBinding} from "./utilities_react.js";
import {postWithCallback} from "./communication_react.js";
import {ErrorItem} from "./error_drawer";

export {showModalReact, showConfirmDialogReact, showSelectDialog, showFileImportDialog,
    showSelectResourceDialog, showInformDialogReact}

class ModalDialog extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        let default_name = this.props.default_value;
        var name_counter = 1;
        while (this.name_exists(default_name)) {
            name_counter += 1;
            default_name = this.props.default_value + String(name_counter)
        }
        this.state = {
            show: false,
            current_value: default_name,
            checkbox_states: {},
            warning_text: ""
        };
    }

    _changeHandler(event) {
        this.setState({"current_value": event.target.value})
    }

    _checkbox_change_handler(event) {
        let val = event.target.checked;
        let new_checkbox_states = Object.assign({}, this.state.checkbox_states);
        new_checkbox_states[event.target.id] = event.target.checked;
        this.setState({checkbox_states: new_checkbox_states})
    }

    componentDidMount() {
        this.setState({"show": true});
        if ((this.props.checkboxes != null) && (this.props.checkboxes.length != 0)) {
            let checkbox_states = {};
            for (let checkbox of this.props.checkboxes) {
                checkbox_states[checkbox.id] = false
            }
            this.setState({checkbox_states: checkbox_states})
        }
    }

    name_exists(name) {
        return (this.props.existing_names.indexOf(name) > -1)
    }

    _submitHandler(event) {
        let msg;
        if (this.state.current_value == "") {
            msg = "An empty name is not allowed here.";
            this.setState({"warning_text": msg})
        }
        else if (this.name_exists(this.state.current_value)) {
            msg = "That name already exists";
            this.setState({"warning_text": msg})
        }
        else {
            this.setState({"show": false});
            this.props.handleSubmit(this.state.current_value, this.state.checkbox_states);
            this.props.handleClose();
            }
    }

    _cancelHandler() {
        this.setState({"show": false});
        if (this.props.handleCancel) {
            this.props.handleCancel()
        }
        this.props.handleClose()
    }

    _refHandler(the_ref) {
        this.input_ref = the_ref;
    }

    render() {
        let checkbox_items = [];
        if ((this.props.checkboxes != null) && (this.props.checkboxes.length != 0)) {
            for (let checkbox of this.props.checkboxes) {
                let new_item = (
                    <Checkbox checked={this.state.checkbox_states[checkbox.checkname]}
                                    label={checkbox.checktext}
                                    id={checkbox.checkname}
                                    key={checkbox.checkname}
                                    onChange={this._checkbox_change_handler}
                    />
                );
                checkbox_items.push(new_item)
            }
        }
        return (
            <Dialog isOpen={this.state.show}
                    className={window.dark_theme ? "bp3-dark" : ""}
                       title={this.props.title}
                       onClose={this._cancelHandler}
                       onOpened={()=>{$(this.input_ref).focus()}}
                       canEscapeKeyClose={true}>
                <form onSubmit={this._submitHandler}>
                    <div className={Classes.DIALOG_BODY}>
                        <FormGroup label={this.props.field_title} helperText={this.state.warning_text}>
                                <InputGroup inputRef={this._refHandler}
                                               onChange={this._changeHandler}
                                               value={this.state.current_value}/>
                        </FormGroup>
                        {(checkbox_items.length != 0) && checkbox_items}
                    </div>
                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                            <Button onClick={this._cancelHandler}>Cancel</Button>
                            <Button intent={Intent.PRIMARY} onClick={this._submitHandler}>Submit</Button>
                        </div>
                    </div>
                </form>
            </Dialog>
        )
    }
}

ModalDialog.propTypes = {
    handleSubmit: PropTypes.func,
    handleClose: PropTypes.func,
    title: PropTypes.string,
    field_title: PropTypes.string,
    default_value: PropTypes.string,
    existing_names: PropTypes.array,
    checkboxes: PropTypes.array,
};

ModalDialog.defaultProps = {
    existing_names: [],
    default_value: "",
    checkboxes: null,
};

function showModalReact(modal_title, field_title, submit_function, default_value, existing_names,
                        checkboxes=null, cancel_function=null) {

    if (typeof existing_names == "undefined") {
        existing_names = []
    }

    let domContainer = document.querySelector('#modal-area');

    function handle_close () {
        ReactDOM.unmountComponentAtNode(domContainer)
    }
    ReactDOM.render(<ModalDialog handleSubmit={submit_function}
                                 handleCancel={cancel_function}
                                 handleClose={handle_close}
                                 title={modal_title}
                                 field_title={field_title}
                                 default_value={default_value}
                                 checkboxes={checkboxes}
                                 existing_names={existing_names}/>, domContainer);
}

class SelectDialog extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        this.state = {
            show: false,
            value: null
        };
    }

    componentDidMount() {
        this.setState({"show": true, "value": this.props.option_list[0]})
    }

    _handleChange(val) {
        this.setState({"value": val})
    }

    _submitHandler(event) {
        this.setState({"show": false});
        this.props.handleSubmit(this.state.value);
        this.props.handleClose();
    }

    _cancelHandler() {
        this.setState({"show": false});
        this.props.handleClose()
    }

    render() {
        return (
            <Dialog isOpen={this.state.show}
                    className={window.dark_theme ? "bp3-dark" : ""}
                       title={this.props.title}
                       onClose={this._cancelHandler}
                       canEscapeKeyClose={true}>
                <div className={Classes.DIALOG_BODY}>
                   <FormGroup title={this.props.select_label}>
                        <BpSelect options={this.props.option_list} onChange={this._handleChange} value={this.state.value}/>
                       {/*<Bp.HTMLSelect options={this.props.option_list} onChange={this._handleChange} value={this.state.value}/>*/}
                   </FormGroup>
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Button onClick={this._cancelHandler}>Cancel</Button>
                        <Button intent={Intent.PRIMARY} onClick={this._submitHandler}>Submit</Button>
                    </div>
                </div>
            </Dialog>
        )
    }
}

SelectDialog.propTypes = {
    handleSubmit: PropTypes.func,
    handleClose: PropTypes.func,
    handleCancel: PropTypes.func,
    title: PropTypes.string,
    select_label: PropTypes.string,
    option_list: PropTypes.array,
    submit_text: PropTypes.string,
    cancel_text: PropTypes.string,

};


function showSelectDialog(title, select_label, cancel_text, submit_text, submit_function, option_list, dark_theme=false) {

    let domContainer = document.querySelector('#modal-area');

    function handle_close () {
        ReactDOM.unmountComponentAtNode(domContainer)
    }
    ReactDOM.render(<SelectDialog handleSubmit={submit_function}
                                   handleClose={handle_close}
                                   title={title}
                                   select_label={select_label}
                                   submit_text={submit_text}
                                   option_list={option_list}
                                   cancel_text={cancel_text}/>, domContainer);
}

var res_types = ["collection", "project", "tile", "list", "code"];

class SelectResourceDialog extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        this.state = {
            show: false,
            type: "collection",
            value: null,
            option_names: [],
            selected_resource: null
        };
    }

    componentDidMount() {
        this._handleTypeChange("collection")
    }

    _handleTypeChange(val) {
        let get_url = `get_${val}_names`;
        let dict_hash = `${val}_names`;
        let self = this;
        postWithCallback("host", get_url,{"user_id": user_id}, function (data) {
            let option_names = data[dict_hash];
            self.setState({show: true, type: val, option_names: option_names, selected_resource: option_names[0]})
        });
    }

    _handleResourceChange(val) {
        this.setState({selected_resource: val})
    }

    _submitHandler(event) {
        this.setState({"show": false}, ()=>{
            this.props.handleSubmit({type: this.state.type, selected_resource: this.state.selected_resource});
            this.props.handleClose();
        });
    }

    _cancelHandler() {
        this.setState({"show": false});
        this.props.handleClose()
    }

    render() {
        return (
            <Dialog isOpen={this.state.show}
                    className={window.dark_theme ? "bp3-dark" : ""}
                       title="Select a library resource"
                       onClose={this._cancelHandler}
                       canEscapeKeyClose={true}>
                <div className={Classes.DIALOG_BODY}>
                   <FormGroup label="Resource Type">
                        <BpSelect options={res_types} onChange={this._handleTypeChange} value={this.state.type}/>
                   </FormGroup>
                   <FormGroup label="Specific Resource">
                        <BpSelect options={this.state.option_names} onChange={this._handleResourceChange} value={this.state.selected_resource}/>
                   </FormGroup>
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Button onClick={this._cancelHandler}>Cancel</Button>
                        <Button intent={Intent.PRIMARY} onClick={this._submitHandler}>Submit</Button>
                    </div>
                </div>
            </Dialog>
        )
    }
}

SelectResourceDialog.propTypes = {
    handleSubmit: PropTypes.func,
    handleClose: PropTypes.func,
    handleCancel: PropTypes.func,
    submit_text: PropTypes.string,
    cancel_text: PropTypes.string
};

function showSelectResourceDialog(cancel_text, submit_text, submit_function, dark_theme=false) {

    let domContainer = document.querySelector('#modal-area');

    function handle_close () {
        ReactDOM.unmountComponentAtNode(domContainer)
    }
    ReactDOM.render(<SelectResourceDialog handleSubmit={submit_function}
                                          handleClose={handle_close}
                                          submit_text={submit_text}
                                          cancel_text={cancel_text}/>, domContainer);
}

var defaultImportDialogWidth = 700;
class FileImportDialog extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
        let initial_default_name = "new" + props.res_type;
        var name_counter = 1;
        var default_name = initial_default_name;
        this.picker_ref = React.createRef();
        this.existing_names = props.existing_names;
        this.current_url = "dummy"
        while (this._name_exists(default_name)) {
            name_counter += 1;
            default_name = initial_default_name + String(name_counter)
        }
        this.state = {
            show: false,
            current_value: default_name,
            checkbox_states: {},
            warning_text: "  ",
            log_open: false,
            log_contents: [],
            current_picker_width: defaultImportDialogWidth - 100
        };
        this.myDropzone = null;
        this.socket_counter = null
    }

    _handleResponse(entry) {
        if (entry.resource_name && entry["success"] in ["success", "partial"]) {
            this.existing_names.push(entry.resource_name)
        }
        this.setState({log_contents: [...this.state.log_contents, entry], log_open: true})
    }

    _handleError(file, message, xhr=null) {
        this._handleResponse({title: `Error for ${file.name}`, "content": message})

    }

    _updatePickerSize() {
        if (this.picker_ref && this.picker_ref.current) {
            let new_width = this.picker_ref.current.offsetWidth;
            if (new_width != this.state.current_picker_width) {
                this.setState({current_picker_width: this.picker_ref.current.offsetWidth})
            }
        }
    }

    initSocket() {
        window.tsocket.socket.off("upload-response");
        window.tsocket.socket.on("upload-response", this._handleResponse);
        this.socket_counter = window.tsocket.counter
    }


    componentDidMount() {
        this.setState({"show": true});
        if ((this.props.checkboxes != null) && (this.props.checkboxes.length != 0)) {
            let checkbox_states = {};
            for (let checkbox of this.props.checkboxes) {
                checkbox_states[checkbox.id] = false
            }
            this.setState({checkbox_states: checkbox_states})
        }
        this._updatePickerSize();
        this.initSocket()

    }

    componentDidUpdate() {
        this._updatePickerSize();
        if (window.tsocket.counter != this.socket_counter) {
            this.initSocket();
        }
    }

    _checkbox_change_handler(event) {
        let val = event.target.checked;
        let new_checkbox_states = Object.assign({}, this.state.checkbox_states);
        new_checkbox_states[event.target.id] = event.target.checked;
        this.setState({checkbox_states: new_checkbox_states})
    }


    _closeHandler() {
        this.setState({"show": false});
        this.props.handleClose()
    }

    _do_submit() {
        let msg;
        if (this.state.current_value == "") {
            msg = "An empty name is not allowed here.";
            this.setState({"warning_text": msg})
        }
        else if (this._name_exists(this.state.current_value)) {
            msg = "That name already exists";
            this.setState({"warning_text": msg})
        }
        else {
            this.props.process_handler(this.myDropzone, this._setCurrentUrl, this.state.current_value, this.state.checkbox_states);
            }
    }

    _do_clear() {
        this.myDropzone.removeAllFiles()
    }

    _initCallback(dropzone) {
        this.myDropzone = dropzone;
    }

    _setCurrentUrl(new_url) {
        this.myDropzone.options.url = new_url  //
        this.current_url = new_url
    }

    // There's trickiness with setting the current url in the dropzone object.
    // If I don't set it below in uploadComplete, then the second file processed
    // gets the dummy url in some cases. It's related to the component re-rendering
    // I think, perhaps when messages are shown in the dialog.

    _uploadComplete(f) {
        if (this.myDropzone.getQueuedFiles().length > 0) {
            this.myDropzone.options.url = this.current_url
            this.myDropzone.processQueue()
        }
    }

    _onSending(f) {
        f.previewElement.scrollIntoView(false)
    }

    _name_exists(name) {
        return (this.existing_names.indexOf(name) > -1)
    }

    _toggleLog() {
        this.setState({ log_open: !this.state.log_open });
    }

    _clearLog() {
        this.setState({log_contents: []})
    }

    _handleDrop() {
        if (this.myDropzone.getQueuedFiles().length == 0) {
            this._do_clear()
        }
    }

    _nameChangeHandler(event) {
        this.setState({"current_value": event.target.value, warning_text: "  "})
    }

    render() {
        // let preview_style = {width: "unset", minHeight: "fit-content"};
        console.log("entering render with this.current_url " + this.current_url)
        let half_width = .5 * this.state.current_picker_width - 10
         let name_style = {display: "inline-block", maxWidth: half_width}
         let progress_style = {position: "relative", width: half_width - 100, marginRight: 5,
             marginLeft: "unset", left: "unset", right: "unset"}
         let size_style = {marginLeft: 5, width: 75}
         var componentConfig = {
             postUrl: this.current_url,  // Must have this even though will never be used
             // iconFiletypes: this.props.allowed_file_types,
             // showFiletypeIcon: true
        };
         var djsConfig = {
             uploadMultiple: false,
             parallelUploads: 1,
             autoProcessQueue: false,
             dictDefaultMessage: "Click or drop files here to upload",
             acceptedFiles: this.props.allowed_file_types,
             // addRemoveLinks: true,
             // dictRemoveFile: "x",
             previewTemplate: renderToStaticMarkup(
                <div className="dz-preview dz-file-preview">
                        <div style={name_style} data-dz-name="true"></div>
                        <div style={{display: "flex", width: half_width, flexDirection:
                             "row", justifyContent:"space-bewteen"}}>
                        <div className="dz-progress" style={progress_style}>
                            <div className="dz-upload" data-dz-uploadprogress="true"></div>
                        </div>
                        <div className="dz-success-mark" style={progress_style}><span>✔</span></div>
                        <div className="dz-error-mark" style={progress_style}><span>✘</span></div>
                         {/*<div className="dz-error-message" style={progress_style}><span data-dz-errormessage="true"></span></div>*/}
                        <div style={size_style} data-dz-size="true"></div>
                     </div>
                </div>
              ),
             headers: {
                 'X-CSRF-TOKEN': window.csrftoken
             }
         }
         var eventHandlers;
         eventHandlers = {
             init: this._initCallback,
             complete: this._uploadComplete,
             sending: this._onSending,
             drop: this._handleDrop,
             error: this._handleError,
         }

         let checkbox_items = [];
        if ((this.props.checkboxes != null) && (this.props.checkboxes.length != 0)) {
            for (let checkbox of this.props.checkboxes) {
                let new_item = (
                    <Checkbox checked={this.state.checkbox_states[checkbox.checkname]}
                                    label={checkbox.checktext}
                                    id={checkbox.checkname}
                                    key={checkbox.checkname}
                                    onChange={this._checkbox_change_handler}
                    />
                );
                checkbox_items.push(new_item)
            }
        }
        var log_items;
        if (this.state.log_open) {
            if (this.state.log_contents.length > 0) {
                log_items = this.state.log_contents.map((entry, index) => {
                    let content_dict = {__html: entry.content};
                    let has_link = false;
                    return (
                        <ErrorItem key={index} title={entry.title} content={entry.content} has_link={has_link}/>
                    )
                });
            }
            else {
                log_items = <div>Log is empty</div>
            }
        }
        let body_style = {
            marginTop: 25,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            minHeight: 101
        }
        return (
            <Dialog isOpen={this.state.show}
                    className={window.dark_theme ? "import-dialog bp3-dark" : "import-dialog light-theme"}
                    title={this.props.title}
                    onClose={this._closeHandler}
                    canOutsideClickClose={false}
                    canEscapeKeyClose={false}>
                <div className={Classes.DIALOG_BODY}>
                   <DropzoneComponent config={componentConfig}
                                      eventHandlers={eventHandlers}
                                      djsConfig={djsConfig}/>
                    <div style={body_style}>
                        {this.props.combine &&
                            <div style={{display: "flex", flexDirection: "column"}}>

                                <FormGroup label={`New ${this.props.res_type} name`}
                                           labelFor="name-input"
                                           inline={false}
                                           helperText={this.state.warning_text}>
                                    <InputGroup onChange={this._nameChangeHandler}
                                                fill={false}
                                                id="name-input"
                                                value={this.state.current_value}/>
                                </FormGroup>
                                {(checkbox_items.length != 0) && checkbox_items}
                            </div>
                        }
                        <div style={{display: "flex", flexDirection: "column", justifyContent: "space-evenly"}}>
                            <Button intent={Intent.PRIMARY} onClick={this._do_submit}>Upload</Button>
                            <Button onClick={this._do_clear}>Clear Files</Button>
                        </div>
                    </div>
                </div>
                <Divider/>
                <div className={Classes.DIALOG_FOOTER} style={{marginTop: 10}}>
                    <ButtonGroup>
                        <Button onClick={this._toggleLog}>
                             {this.state.log_open ? "Hide" : "Show"} log
                        </Button>
                        <Button onClick={this._clearLog}>
                             Clear log
                        </Button>
                    </ButtonGroup>
                    <Collapse isOpen={this.state.log_open}>
                        <div className="bp3-dialog-body">
                            {log_items}
                        </div>
                    </Collapse>
                </div>
            </Dialog>
        )
    }
}

FileImportDialog.propTypes = {
    res_type: PropTypes.string,
    title: PropTypes.string,
    existing_names: PropTypes.array,
    process_handler: PropTypes.func,
    allowed_file_types: PropTypes.string,
    combine: PropTypes.bool,
    checkboxes: PropTypes.array,
    handleClose: PropTypes.func
};

function showFileImportDialog(res_type, allowed_file_types, checkboxes, process_handler, combine=false) {


    $.getJSON(`${$SCRIPT_ROOT}get_resource_names/${res_type}`, function (data) {
            showTheDialog(data["resource_names"])
        }
    );

    function showTheDialog(existing_names) {
        let domContainer = document.querySelector('#modal-area');

        function handle_close () {
            ReactDOM.unmountComponentAtNode(domContainer)
        }

        ReactDOM.render(<FileImportDialog title={`Import ${res_type}`}
                                          res_type={res_type}
                                          allowed_file_types={allowed_file_types}
                                          existing_names={existing_names}
                                          checkboxes={checkboxes}
                                          process_handler={process_handler}
                                          combine={combine}
                                          handleClose={handle_close}/>, domContainer);
    }

}

class ConfirmDialog extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        this.state = {
            show: false,
        };
    }


    componentDidMount() {
        this.setState({"show": true})
    }

    _submitHandler(event) {
        this.setState({"show": false});
        this.props.handleSubmit();
        this.props.handleClose();
    }

    _cancelHandler() {
        this.setState({"show": false});
        this.props.handleClose()
    }

    render() {
        return (
            <Dialog isOpen={this.state.show}
                    className={window.dark_theme ? "bp3-dark" : ""}
                       title={this.props.title}
                       onClose={this._cancelHandler}
                       canEscapeKeyClose={true}>
                <div className={Classes.DIALOG_BODY}>
                    <p>{this.props.text_body}</p>
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Button onClick={this._cancelHandler}>{this.props.cancel_text}</Button>
                        <Button intent={Intent.PRIMARY} onClick={this._submitHandler}>{this.props.submit_text}</Button>
                    </div>
                </div>
            </Dialog>
        )
    }
}

ConfirmDialog.propTypes = {
    handleSubmit: PropTypes.func,
    handleClose: PropTypes.func,
    title: PropTypes.string,
    text_body: PropTypes.string,
    submit_text: PropTypes.string,
    cancel_text: PropTypes.string
};

ConfirmDialog.defaultProps = {
    submit_text: "Submit",
    cancel_text: "Cancel"
}

function showConfirmDialogReact(title, text_body, cancel_text, submit_text, submit_function) {

    let domContainer = document.querySelector('#modal-area');

    function handle_close () {
        ReactDOM.unmountComponentAtNode(domContainer)

    }
    ReactDOM.render(<ConfirmDialog handleSubmit={submit_function}
                                 handleClose={handle_close}
                                 title={title}
                                 text_body={text_body}
                                 submit_text={submit_text}
                                 cancel_text={cancel_text}/>, domContainer);
}

class InformDialog extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        this.state = {
            show: false,
        };
    }


    componentDidMount() {
        this.setState({"show": true})
    }

    _closeHandler() {
        this.setState({"show": false});
        this.props.handleClose()
    }

    render() {
        return (
            <Dialog isOpen={this.state.show}
                    className={window.dark_theme ? "bp3-dark" : ""}
                       title={this.props.title}
                       onClose={this._closeHandler}
                       canEscapeKeyClose={true}>
                <div className={Classes.DIALOG_BODY}>
                    <p>{this.props.text_body}</p>
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Button onClick={this._closeHandler}>Okay</Button>
                    </div>
                </div>
            </Dialog>
        )
    }
}

InformDialog.propTypes = {
    handleClose: PropTypes.func,
    title: PropTypes.string,
    text_body: PropTypes.string,
    close_text: PropTypes.string,
};

function showInformDialogReact(title, text_body, close_text="Okay") {

    let domContainer = document.querySelector('#modal-area');

    function handle_close () {
        ReactDOM.unmountComponentAtNode(domContainer)

    }
    ReactDOM.render(<ConfirmDialog
                                 handleClose={handle_close}
                                 title={title}
                                 text_body={text_body}
                                 close_text={close_text}/>, domContainer);
}
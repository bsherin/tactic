import React from "react";
import * as ReactDOM from 'react-dom'
import PropTypes from 'prop-types';
import DropzoneComponent from 'react-dropzone-component';

import { Checkbox, Dialog, FormGroup, Classes, Button, InputGroup, ButtonGroup,
    Intent, Collapse, Divider, Alignment} from "@blueprintjs/core";

import { BpSelect } from "./blueprint_mdata_fields.js";

import {doBinding} from "./utilities_react.js";
import {renderToStaticMarkup} from "react-dom/server";
import {ErrorItem} from "./error_drawer";

export {showFileImportDialog}

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

        if (this.props.show_csv_options) {
            this.state.delimiter = ",";
            this.state.quoting = "QUOTE_MINIMAL";
            this.state.skipinitialspace = true
            this.state.csv_options_open = false
        }

        this.myDropzone = null;
        this.socket_counter = null
    }

    _handleResponse(entry) {
        if (entry.resource_name && entry["success"] in ["success", "partial"]) {
            this.existing_names.push(entry.resource_name)
        }
        this.setState({log_contents: [...this.state.log_contents, entry], log_open: true})
    }

    _handleError(file, message, xhr = null) {
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
                checkbox_states[checkbox.checkname] = false
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
        if (this.myDropzone.getQueuedFiles().length == 0) {
            return
        }
        if (this.state.current_value == "") {
            msg = "An empty name is not allowed here.";
            this.setState({"warning_text": msg})
        } else if (this._name_exists(this.state.current_value)) {
            msg = "That name already exists";
            this.setState({"warning_text": msg})
        } else {
            let csv_options;
            if (this.props.show_csv_options && this.state.csv_options_open) {
                csv_options = {
                    delimiter: this.state.delimiter,
                    quoting: this.state.quoting,
                    skipinitialspace: this.state.skipinitialspace
                }
            }
            else {
                csv_options = null
            }
            this.props.process_handler(this.myDropzone, this._setCurrentUrl, this.state.current_value,
                this.state.checkbox_states, csv_options);
        }
    }

    _do_clear() {
        this.myDropzone.removeAllFiles()
    }

    _initCallback(dropzone) {
        this.myDropzone = dropzone;
    }

    _setCurrentUrl(new_url) {
        this.myDropzone.options.url = new_url;
        this.current_url = new_url
    }

    // There's trickiness with setting the current url in the dropzone object.
    // If I don't set it below in uploadComplete, then the second file processed
    // gets the dummy url in some cases. It's related to the component re-rendering
    // I think, perhaps when messages are shown in the dialog.

    _uploadComplete(f) {
        if (this.myDropzone.getQueuedFiles().length > 0) {
            this.myDropzone.options.url = this.current_url;
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
        this.setState({log_open: !this.state.log_open});
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

    _updateDelimiter(event) {
        this.setState({delimiter: event.target.value})
    }
    
    _updateQuoting(val) {
        this.setState({quoting: val})
    }

    _updateSkipinitial(event) {
        this.setState({skipinitialspace: event.target.checked})
    }

    _toggleCSVOptions() {
        this.setState({csv_options_open: !this.state.csv_options_open})
    }

    render() {
        // let preview_style = {width: "unset", minHeight: "fit-content"};
        console.log("entering render with this.current_url " + this.current_url)
        let half_width = .5 * this.state.current_picker_width - 10
        let name_style = {display: "inline-block", maxWidth: half_width}
        let progress_style = {
            position: "relative", width: half_width - 100, marginRight: 5,
            marginLeft: "unset", left: "unset", right: "unset"
        }
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
                    <div style={{
                        display: "flex", width: half_width, flexDirection:
                            "row", justifyContent: "space-bewteen"
                    }}>
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
                              inline="true"
                              alignIndicator={Alignment.RIGHT}
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
            } else {
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
        let allowed_types_string = this.props.allowed_file_types.replaceAll(",", " ");
        return (
            <Dialog isOpen={this.state.show}
                    className={window.dark_theme ? "import-dialog bp3-dark" : "import-dialog light-theme"}
                    title={this.props.title}
                    onClose={this._closeHandler}
                    canOutsideClickClose={false}
                    canEscapeKeyClose={false}>
                <div className={Classes.DIALOG_BODY}>
                    <FormGroup helperText={`allowed types: ${allowed_types_string}`}>
                        <DropzoneComponent config={componentConfig}
                                           eventHandlers={eventHandlers}
                                           djsConfig={djsConfig}/>
                    </FormGroup>
                    <div style={body_style}>
                        {this.props.combine &&
                        <div>
                            <FormGroup label={`New ${this.props.res_type} name`}
                                       labelFor="name-input"
                                       inline={true}
                                       helperText={this.state.warning_text}>
                                <InputGroup onChange={this._nameChangeHandler}
                                            fill={false}
                                            id="name-input"
                                            value={this.state.current_value}/>
                            </FormGroup>
                            {(checkbox_items.length != 0) && checkbox_items}
                            {this.props.show_csv_options &&
                            <div>
                                <Divider/>
                                <Button onClick={this._toggleCSVOptions} minimal={true} intent="primary" larg={true}>
                                    csv options: {this.state.csv_options_open ? "manual" : "auto"}
                                </Button>
                                <Collapse isOpen={this.state.csv_options_open}>
                                    <FormGroup label="delimiter"  inline={true} style={{marginTop: 10}}>
                                        <InputGroup onChange={this._updateDelimiter} value={this.state.delimiter}/>
                                    </FormGroup>
                                    <FormGroup label="quoting" inline={true}>
                                        <BpSelect onChange={this._updateQuoting}
                                                  value={this.state.quoting}
                                                  filterable={false}
                                                  small={true}
                                                  options={["QUOTE_MINIMAL", "QUOTE_ALL",
                                                      "QUOTE_NONNUMERIC", "QUOTE_NONE"]}/>
                                    </FormGroup>
                                    <Checkbox checked={this.state.skipinitialspace}
                                              label="skipinitialspace"
                                              inline="true"
                                              alignIndicator={Alignment.RIGHT}
                                              onChange={this._updateSkipinitial}
                                    />

                                </Collapse>
                            </div>
                        }
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
    textoptions: PropTypes.array,
    popupoptions: PropTypes.array,
    handleClose: PropTypes.func
};

FileImportDialog.cefaultProps = {
    checkboxes: null,
    textoptions: null,
    popupoptions: null
}

function showFileImportDialog(res_type, allowed_file_types, checkboxes, process_handler,
                              combine=false, show_csv_options=false) {


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
                                          show_csv_options={show_csv_options}
                                          handleClose={handle_close}/>, domContainer);
    }

}
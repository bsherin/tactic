import React from "react";
import {useState, useEffect, useRef, useContext} from "react";

import DropzoneComponent from 'react-dropzone-component';
import "../css/dzcss/dropzone.css";
import "../css/dzcss/filepicker.css";
import "../css/dzcss/basic.css";
import {
    Checkbox, Dialog, FormGroup, Classes, Button, InputGroup, ButtonGroup,
    Intent, Collapse, Divider, Alignment
} from "@blueprintjs/core";
import {BpSelect} from "./selector_advanced";
import {useConstructor, useStateAndRef} from "./utilities_react";
import {renderToStaticMarkup} from "react-dom/server";
import {ErrorDrawerContext, ErrorItem, withErrorDrawer} from "./error_drawer";
import {PoolAddressSelector} from "./pool_tree";

import {SettingsContext} from "./settings";
import {postPromise} from "./communication_react";
import {useSocketListener} from "./tactic_socket";
import {uploadManager} from "./uploadManager";
import {ProgressBar} from "@blueprintjs/core";

export {FileImportDialog}

const defaultImportDialogWidth = 700;

function FileImportDialog(props) {
    props = {
        checkboxes: null,
        textoptions: null,
        popupoptions: null,
        after_upload: null,
        show_address_selector: false,
        allowFolderSelection: false,
        initialFiles: [],
        use_s3: false,
        ...props
    };

    const name_counter = useRef(1);
    const default_name = useRef("new" + props.res_type);
    const picker_ref = useRef(null);
    const existing_names = useRef([]);
    const current_url = useRef("dummy");
    const progressAreaRef = useRef(null);

    const myDropzone = useRef(null);

    const [show, set_show] = useState(false);
    const [current_value, set_current_value, current_value_ref] =
        useStateAndRef(props.show_address_selector ? "mydisk" : "new" + props.res_type);
    const [checkbox_states, set_checkbox_states] = useState({});
    const [warning_text, set_warning_text] = useState("  ");
    const [log_open, set_log_open] = useState(false);
    const [log_contents, set_log_contents] = useState([]);
    const [current_picker_width, set_current_picker_width] = useState(defaultImportDialogWidth - 100);

    // These will only matter if props.show_csv_options
    const [delimiter, set_delimiter] = useState(",");
    const [quoting, set_quoting] = useState("QUOTE_MINIMAL");
    const [skipinitialspace, set_skipinitialspace] = useState(true);
    const [csv_options_open, set_csv_options_open] = useState(false);

    const settingsContext = useContext(SettingsContext);
    const errorDrawerFuncs = useContext(ErrorDrawerContext);

    const [activeUploads, setActiveUploads] = useState([]);

    const folderInputRef = useRef(null);

    useEffect(() => {
        if (!props.use_s3) return;
        return uploadManager.subscribe(setActiveUploads);
    }, []);

    useConstructor(async () => {
        try {
            if (props.res_type == "pool") {
                existing_names.current = [];
                set_show(true);
                return
            }
            let data = await postPromise("host", "get_resource_names_task", {res_type: props.res_type});
            existing_names.current = data.res_names;
            while (_name_exists(default_name)) {
                name_counter.current += 1;
                default_name.current = "new" + props.res_type + String(name_counter.current)
            }
            set_show(true);
        } catch (e) {
            errorDrawerFuncs.addFromError("Error getting existing names", e)
        }
    });

    useEffect(() => {
        if ((props.checkboxes != null) && (props.checkboxes.length != 0)) {
            let lcheckbox_states = {};
            for (let checkbox of props.checkboxes) {
                lcheckbox_states[checkbox.checkname] = false
            }
            set_checkbox_states(lcheckbox_states)
        }
        if ((props.show_address_selector && props.initial_address)) {
            set_current_value(props.initial_address)
        }
        _updatePickerSize();
    }, []);

    useEffect(() => {
        _updatePickerSize();
    });

    useEffect(() => {
        if (progressAreaRef.current) {
            progressAreaRef.current.scrollTop = progressAreaRef.current.scrollHeight;
        }
    }, [activeUploads]);

    useSocketListener(props.tsocket, "upload_response", _handleResponse);

    async function _startS3Uploads() {
        const files = myDropzone.current.getQueuedFiles();
        if (!files || files.length === 0) return;

        for (const file of files) {
            myDropzone.current.removeFile(file);

            const relpath =
                (file.webkitRelativePath && file.webkitRelativePath.length > 0)
                    ? file.webkitRelativePath
                    : file.name;

            let resp = await postPromise("host", "get_s3_upload_info_task", {
                filename: relpath,
                content_type: file.type || "application/octet-stream",
                dest_path: current_value_ref.current,
            });

            if (!resp.success) {
                errorDrawerFuncs.addErrorDrawerEntry({
                    title: "Failed to get presign",
                    content: resp.message
                });
                continue;
            }

            const {url, fields, key, bucket, content_type} = resp.upload_info;

            // Hand off to manager (persists across unmount)
            await uploadManager.startPresignedPostUpload({
                file,
                url,
                fields,
                meta: {bucket, key, content_type, dest_path: current_value_ref.current}
            });
        }
    }

    function _handleResponse(entry) {
        if (entry.resource_name && entry["success"] in ["success", "partial"]) {
            existing_names.current.push(entry.resource_name)
        }
        set_log_contents([...log_contents, entry]);
        set_log_open(true)
    }

    function _handleError(file, message, xhr = null) {
        _handleResponse({title: `Error for ${file.name}`, "content": message})
    }

    function _updatePickerSize() {
        if (picker_ref && picker_ref.current) {
            let new_width = picker_ref.current.offsetWidth;
            if (new_width != current_picker_width) {
                set_current_picker_width(picker_ref.current.offsetWidth)
            }
        }
    }

    function _checkbox_change_handler(event) {
        let new_checkbox_states = Object.assign({}, checkbox_states);
        new_checkbox_states[event.target.id] = event.target.checked;
        set_checkbox_states(new_checkbox_states)
    }

    function _closeHandler() {
        set_show(false);
        props.handleClose()
    }

    async function _do_submit() {
        let msg;
        if (myDropzone.current.getQueuedFiles().length == 0) {
            return
        }
        if (current_value == "") {
            msg = "An empty name is not allowed here.";
            set_warning_text(msg)
        } else if (_name_exists(current_value)) {
            msg = "That name already exists";
            set_warning_text(msg);
        } else {
            let csv_options = null;
            if (props.show_csv_options && csv_options_open) {
                csv_options = {delimiter, quoting, skipinitialspace};
            }

            if (props.use_s3) {
                await _startS3Uploads();   // manager-based
            } else {
                props.process_handler(
                    myDropzone.current,
                    _setCurrentUrl,
                    current_value,
                    checkbox_states,
                    csv_options
                );
            }
        }
    }

    function _do_clear() {
        myDropzone.current.removeAllFiles()
    }

    function _initCallback(dropzone) {
        myDropzone.current = dropzone;
        if (props.initialFiles) {
            for (let theFile of props.initialFiles) {
                dropzone.addFile(theFile)
            }
        }
    }

    function _setCurrentUrl(new_url) {
        myDropzone.current.options.url = new_url;
        current_url.current = new_url
    }

    // There's trickiness with setting the current url in the dropzone object.
    // If I don't set it below in uploadComplete, then the second file processed
    // gets the dummy url in some cases. It's related to the component re-rendering
    // I think, perhaps when messages are shown in the dialog.

    function _uploadComplete() {
        if (!props.use_s3) {
            if (myDropzone.current.getQueuedFiles().length > 0) {
                myDropzone.current.options.url = current_url.current;
                myDropzone.current.processQueue()
            } else if (props.after_upload) {
                props.after_upload()
            }
        }
    }

    async function _onSending(file, xhr, formData) {
        if (!props.use_s3) {
            file.previewElement.scrollIntoView(false);
            formData.append("extra_value", current_value_ref.current);
            if (props.chunking) {
                formData.append("dzuuid", file.upload.uuid)
            }
        }
    }

    function _name_exists(name) {
        return (existing_names.current.indexOf(name) > -1)
    }

    function _toggleLog() {
        set_log_open(!log_open);
    }

    function _clearLog() {
        set_log_contents([])
    }

    function _handleDrop() {
        if (myDropzone.current.getQueuedFiles().length == 0) {
            _do_clear()
        }
    }

    function _nameChangeHandler(event) {
        set_current_value(event.target.value);
        set_warning_text("  ")
    }

    function _updateDelimiter(event) {
        set_delimiter(event.target.value)
    }

    function _updateSkipinitial(event) {
        set_skipinitialspace(event.target.checked)
    }

    function _toggleCSVOptions() {
        set_csv_options_open(!csv_options_open)
    }

    function _clearInactiveUploads() {
        for (let u of activeUploads) {
            if (u.status !== "uploading") {
                uploadManager.clear(u.id);
            }
        }
    }

    let half_width = .5 * current_picker_width - 10;
    let name_style = {display: "inline-block", maxWidth: half_width};
    let progress_style = {
        position: "relative", width: half_width - 100, marginRight: 5,
        marginLeft: "unset", left: "unset", right: "unset"
    };
    let size_style = {marginLeft: 5, width: 75};
    var componentConfig = {
        postUrl: current_url.current,  // Must have this even though will never be used
    };
    var djsConfig = {
        uploadMultiple: false,
        parallelUploads: 1,
        maxFilesize: 2000,
        timeout: 360000,
        chunking: props.chunking,
        forceChunking: props.forceChunking,
        chunkSize: props.chunkSize,
        autoProcessQueue: false,
        dictDefaultMessage: "Click or drop files here to upload",
        acceptedFiles: props.allowed_file_types,
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
    };
    let eventHandlers;
    eventHandlers = {
        init: _initCallback,
        complete: _uploadComplete,
        sending: _onSending,
        drop: _handleDrop,
        error: _handleError,
    };
    let checkbox_items = [];
    if ((props.checkboxes != null) && (props.checkboxes.length != 0)) {
        for (let checkbox of props.checkboxes) {
            let new_item = (
                <Checkbox checked={checkbox_states[checkbox.checkname]}
                          label={checkbox.checktext}
                          id={checkbox.checkname}
                          key={checkbox.checkname}
                          inline="true"
                          alignIndicator={Alignment.RIGHT}
                          onChange={_checkbox_change_handler}
                />
            );
            checkbox_items.push(new_item)
        }
    }
    var log_items;
    if (log_open) {
        if (log_contents.length > 0) {
            log_items = log_contents.map((entry, index) => {
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
    };
    let allowed_types_string;
    if (props.allowed_file_types) {
        allowed_types_string = props.allowed_file_types.replaceAll(",", " ");
    } else {
        allowed_types_string = "any"
    }
    return (
        <Dialog isOpen={show}
                className={settingsContext.isDark() ? "import-dialog bp6-dark" : "import-dialog light-theme"}
                title={props.title}
                onClose={_closeHandler}
                canOutsideClickClose={true}
                canEscapeKeyClose={true}>
            <div className={Classes.DIALOG_BODY}>
                <FormGroup helperText={`allowed types: ${allowed_types_string}`}>
                    <DropzoneComponent config={componentConfig}
                                       eventHandlers={eventHandlers}
                                       djsConfig={djsConfig}/>
                </FormGroup>
                {props.allowFolderSelection &&
                    <div>
                        <Button onClick={() => folderInputRef.current?.click()}>Choose Folder</Button>
                        <input
                            ref={folderInputRef}
                            type="file"
                            webkitdirectory="true"
                            directory="true"
                            multiple
                            style={{display: "none"}}
                            onChange={(e) => {
                                const files = Array.from(e.target.files || []);
                                files.forEach(f => {
                                    if (!f.name.startsWith('.')) {
                                        myDropzone.current.addFile(f)
                                    }
                                })
                                e.target.value = ""; // allow picking same folder again
                            }}
                        />
                    </div>
                }

                <div style={body_style}>
                    {props.combine &&
                        <div>
                            <FormGroup label={`New ${props.res_type} name`}
                                       labelFor="name-input"
                                       inline={true}
                                       helperText={warning_text}>
                                <InputGroup onChange={_nameChangeHandler}
                                            fill={false}
                                            id="name-input"
                                            value={current_value}/>
                            </FormGroup>
                            {(checkbox_items.length != 0) && checkbox_items}
                            {props.show_csv_options &&
                                <div>
                                    <Divider/>
                                    <Button onClick={_toggleCSVOptions} variant="minimal" intent="primary"
                                            size="large">
                                        csv options: {csv_options_open ? "manual" : "auto"}
                                    </Button>
                                    <Collapse isOpen={csv_options_open}>
                                        <FormGroup label="delimiter" inline={true} style={{marginTop: 10}}>
                                            <InputGroup onChange={_updateDelimiter} value={delimiter}/>
                                        </FormGroup>
                                        <FormGroup label="quoting" inline={true}>
                                            <BpSelect onChange={set_quoting}
                                                      value={quoting}
                                                      filterable={false}
                                                      size="small"
                                                      options={["QUOTE_MINIMAL", "QUOTE_ALL",
                                                          "QUOTE_NONNUMERIC", "QUOTE_NONE"]}/>
                                        </FormGroup>
                                        <Checkbox checked={skipinitialspace}
                                                  label="skipinitialspace"
                                                  inline="true"
                                                  alignIndicator={Alignment.RIGHT}
                                                  onChange={_updateSkipinitial}
                                        />

                                    </Collapse>
                                </div>
                            }

                        </div>
                    }
                    {props.show_address_selector &&
                        <div>
                            <FormGroup label={`Target Directory`}
                                       labelFor="name-input"
                                       inline={true}
                                       helperText={warning_text}>
                                <PoolAddressSelector value={current_value}
                                                     tsocket={props.tsocket}
                                                     select_type="folder"
                                                     setValue={set_current_value}
                                />
                            </FormGroup>
                        </div>
                    }
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <Button intent={Intent.PRIMARY} onClick={_do_submit}>Upload</Button>
                    </div>
                </div>

                {props.use_s3 && activeUploads.length > 0 && (
                    <div ref={progressAreaRef} style={{marginTop: 10, maxHeight: 200, overflowY: "scroll"}}>
                        <Divider/>
                        {activeUploads.map(u => (
                            <div key={u.id} style={{display: "flex", alignItems: "center", gap: 10, marginBottom: 10}}>
                                <div style={{flex: 1}}>
                                    <div>{u.fileName}</div>
                                    <ProgressBar value={(u.pct || 0) / 100} stripes={false}/>
                                    <div className={Classes.TEXT_SMALL}>
                                        {u.status}{u.error ? ` — ${u.error}` : ""}
                                    </div>
                                </div>

                                {u.status === "uploading" && (
                                    <Button intent="danger" onClick={() => uploadManager.abort(u.id)}>
                                        Cancel
                                    </Button>
                                )}
                                {u.status === "done" && (
                                    <Button intent="success" onClick={() => uploadManager.clear(u.id)}>
                                        Clear
                                    </Button>
                                )}
                                {u.status === "aborted" && (
                                    <Button intent="primary" onClick={() => uploadManager.clear(u.id)}>
                                        Clear
                                    </Button>
                                )}
                                {u.status === "error" && (
                                    <Button intent="warning" onClick={() => uploadManager.clear(u.id)}>
                                        Clear
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Divider/>
            <div className={Classes.DIALOG_FOOTER} style={{marginTop: 10}}>
                <div style={{display: "flex", flexGrow: 1, flexDirection: "row", justifyContent: "space-between"}}>
                    <ButtonGroup>
                        <Button onClick={_toggleLog}>
                            {log_open ? "Hide" : "Show"} log
                        </Button>
                        <Button onClick={_clearLog}>
                            Clear log
                        </Button>
                    </ButtonGroup>
                    <ButtonGroup>
                        <Button onClick={_do_clear}>Clear Drop Area</Button>
                        {props.use_s3 &&
                            <Button onClick={_clearInactiveUploads}>Clear Progress Area</Button>
                        }
                    </ButtonGroup>
                </div>
                <Collapse isOpen={log_open}>
                    <div className="bp6-dialog-body">
                        {log_items}
                    </div>
                </Collapse>
            </div>
        </Dialog>
    )
}

FileImportDialog = withErrorDrawer(FileImportDialog)
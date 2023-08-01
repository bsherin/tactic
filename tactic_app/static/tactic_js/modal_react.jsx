import React from "react";
import {Fragment, useState, useRef, useEffect, memo} from "react"
import * as ReactDOM from 'react-dom'
import PropTypes from 'prop-types';

import {
    Checkbox,
    Dialog,
    DialogBody,
    DialogFooter,
    FormGroup,
    Classes,
    Button,
    InputGroup,
    Intent
} from "@blueprintjs/core";

import {BpSelect} from "./blueprint_mdata_fields"
import {useCallbackStack} from "./utilities_react";
import {postWithCallback} from "./communication_react";

export {
    showModalReact, showConfirmDialogReact, showSelectDialog, SelectResourceDialog,
    showSelectResourceDialog, showPresentationDialog, showReportDialog
}

function ModalDialog(props) {

    const [show, set_show] = useState(false);
    const [checkbox_states, set_checkbox_states] = useState({});
    const [warning_text, set_warning_text] = useState("");
    const [current_value, set_current_value] = useState(null);

    const input_ref = useRef(null);

    useEffect(() => {
        set_show(true);
        if ((props.checkboxes != null) && (props.checkboxes.length != 0)) {
            let checkbox_states = {};
            for (let checkbox of props.checkboxes) {
                checkbox_states[checkbox.checkname] = false
            }
            set_checkbox_states(checkbox_states)
        }
        var default_name = props.default_value;
        var name_counter = 1;
        while (_name_exists(default_name)) {
            name_counter += 1;
            default_name = props.default_value + String(name_counter)
        }
        set_current_value(default_name)
    }, []);

    function _changeHandler(event) {
        set_current_value(event.target.value)
    }

    function _checkbox_change_handler(event) {
        let val = event.target.checked;
        let new_checkbox_states = Object.assign({}, checkbox_states);
        new_checkbox_states[event.target.id] = event.target.checked;
        set_checkbox_states(new_checkbox_states)
    }

    function _name_exists(name) {
        return (props.existing_names.indexOf(name) > -1)
    }

    function _submitHandler(event) {
        let msg;
        if (current_value == "") {
            msg = "An empty name is not allowed here.";
            set_warning_text(msg)
        } else if (_name_exists(current_value)) {
            msg = "That name already exists";
            set_warning_text(msg)
        } else {
            set_show(false);
            props.handleSubmit(current_value, checkbox_states);
            props.handleClose();
        }
    }

    function _cancelHandler() {
        set_show(false);
        if (props.handleCancel) {
            props.handleCancel()
        }
        props.handleClose()
    }

    function _refHandler(the_ref) {
        input_ref.current = the_ref;
    }

    let checkbox_items = [];
    if ((props.checkboxes != null) && (props.checkboxes.length != 0)) {
        for (let checkbox of props.checkboxes) {
            let new_item = (
                <Checkbox checked={checkbox_states[checkbox.checkname]}
                          label={checkbox.checktext}
                          id={checkbox.checkname}
                          key={checkbox.checkname}
                          onChange={_checkbox_change_handler}
                />
            );
            checkbox_items.push(new_item)
        }
    }
    return (
        <Dialog isOpen={show}
                className={window.dark_theme ? "bp5-dark" : ""}
                title={props.title}
                onClose={_cancelHandler}
                onOpened={() => {
                    input_ref.current.focus()
                }}
                canEscapeKeyClose={true}>
            <form onSubmit={_submitHandler}>
                <div className={Classes.DIALOG_BODY}>
                    <FormGroup label={props.field_title} helperText={warning_text}>
                        <InputGroup inputRef={_refHandler}
                                    onChange={_changeHandler}
                                    value={current_value}/>
                    </FormGroup>
                    {(checkbox_items.length != 0) && checkbox_items}
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Button onClick={_cancelHandler}>Cancel</Button>
                        <Button intent={Intent.PRIMARY} onClick={_submitHandler}>Submit</Button>
                    </div>
                </div>
            </form>
        </Dialog>
    )

}

ModalDialog = memo(ModalDialog);

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
                        checkboxes = null, cancel_function = null) {

    if (typeof existing_names == "undefined") {
        existing_names = []
    }

    let domContainer = document.querySelector('#modal-area');

    function handle_close() {
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

function PresentationDialog(props) {

    const [show, set_show] = useState(false);
    const [save_as_collection, set_save_as_collection] = useState(false);
    const [collection_name, set_collection_name] = useState(null);
    const [use_dark_theme, set_use_dark_theme] = useState(null);
    const [warning_text, set_warning_text] = useState("");

    const input_ref = useRef(null);

    useEffect(() => {
        set_show(true);
        var default_name = props.default_value;
        var name_counter = 1;
        while (_name_exists(default_name)) {
            name_counter += 1;
            default_name = props.default_value + String(name_counter)
        }
        set_collection_name(default_name)
    }, []);

    function _changeName(event) {
        set_collection_name(event.target.value)
    }

    function _changeDark(event) {
        set_use_dark_theme(event.target.checked)
    }

    function _changeSaveCollection(event) {
        set_save_as_collection(event.target.checked)
    }

    function _name_exists(name) {
        return (props.existing_names.indexOf(name) > -1)
    }

    function _submitHandler(event) {
        let msg;
        if (save_as_collection) {
            if (collection_name == "") {
                msg = "An empty name is not allowed here.";
                set_warning_text(msg);
                return
            } else if (_name_exists(collection_name)) {
                msg = "That name already exists";
                set_warning_text(msg);
                return
            }
        }
        set_show(false);
        props.handleSubmit(
            use_dark_theme,
            save_as_collection,
            collection_name);
        props.handleClose();
    }

    function _cancelHandler() {
        set_show(false);
        if (props.handleCancel) {
            props.handleCancel()
        }
        props.handleClose()
    }

    function _refHandler(the_ref) {
        input_ref.current = the_ref;
    }

    return (
        <Dialog isOpen={show}
                className={window.dark_theme ? "bp5-dark" : ""}
                title="Create Presentation"
                onClose={_cancelHandler}
                canEscapeKeyClose={true}>
            <form onSubmit={_submitHandler}>
                <div className={Classes.DIALOG_BODY}>
                    <Checkbox checked={use_dark_theme}
                              label="Use Dark Theme"
                              id="use_dark_check"
                              key="use_dark_check"
                              onChange={_changeDark}
                    />
                    <Checkbox checked={save_as_collection}
                              label="Save As Collection"
                              id="save_as_collection"
                              key="save_as_collection"
                              onChange={_changeSaveCollection}
                    />
                    {save_as_collection &&
                        <FormGroup label="Collection Name" helperText={warning_text}>
                            <InputGroup inputRef={_refHandler}
                                        onChange={_changeName}
                                        value={collection_name}/>
                        </FormGroup>
                    }
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Button onClick={_cancelHandler}>Cancel</Button>
                        <Button intent={Intent.PRIMARY} onClick={_submitHandler}>Submit</Button>
                    </div>
                </div>
            </form>
        </Dialog>
    )
}

PresentationDialog = memo(PresentationDialog);

PresentationDialog.propTypes = {
    handleSubmit: PropTypes.func,
    handleClose: PropTypes.func,
    default_name: PropTypes.string,
    existing_names: PropTypes.array,
};

PresentationDialog.defaultProps = {
    existing_names: [],
    default_name: "",
};


function showPresentationDialog(submit_function, existing_names, cancel_function = null) {

    if (typeof existing_names == "undefined") {
        existing_names = []
    }

    let domContainer = document.querySelector('#modal-area');

    function handle_close() {
        ReactDOM.unmountComponentAtNode(domContainer)
    }

    ReactDOM.render(<PresentationDialog handleSubmit={submit_function}
                                        handleCancel={cancel_function}
                                        handleClose={handle_close}
                                        default_name="NewPresentation"
                                        existing_names={existing_names}/>, domContainer);
}

function ReportDialog(props) {
    const [show, set_show] = useState(false);
    const [save_as_collection, set_save_as_collection] = useState(false);
    const [collection_name, set_collection_name] = useState(null);
    const [use_dark_theme, set_use_dark_theme] = useState(null);
    const [warning_text, set_warning_text] = useState("");
    const [collapsible, set_collapsible] = useState(false);
    const [include_summaries, set_include_summaries] = useState(false);

    const input_ref = useRef(null);

    useEffect(() => {
        set_show(true);
        var default_name = props.default_value;
        var name_counter = 1;
        while (_name_exists(default_name)) {
            name_counter += 1;
            default_name = props.default_value + String(name_counter)
        }
        set_collection_name(default_name)
    }, []);

    function _changeName(event) {
        set_collection_name(event.target.value)
    }

    function _changeDark(event) {
        set_use_dark_theme(event.target.checked)
    }

    function _changeCollapsible(event) {
        set_collapsible(event.target.checked)
    }

    function _changeIncludeSummaries(event) {
        set_include_summaries(event.target.checked)
    }

    function _changeSaveCollection(event) {
        set_save_as_collection(event.target.checked)
    }

    function _name_exists(name) {
        return (props.existing_names.indexOf(name) > -1)
    }

    function _submitHandler(event) {
        let msg;
        if (save_as_collection) {
            if (collection_name == "") {
                msg = "An empty name is not allowed here.";
                set_warning_text(msg);
                return
            } else if (_name_exists(collection_name)) {
                msg = "That name already exists";
                set_warning_text(msg);
                return
            }
        }
        set_show(false);
        props.handleSubmit(
            collapsible,
            include_summaries,
            use_dark_theme,
            save_as_collection,
            collection_name);
        props.handleClose();
    }

    function _cancelHandler() {
        set_show(false);
        if (props.handleCancel) {
            props.handleCancel()
        }
        props.handleClose()
    }

    function _refHandler(the_ref) {
        input_ref.current = the_ref;
    }

    return (
        <Dialog isOpen={show}
                className={window.dark_theme ? "bp5-dark" : ""}
                title="Create Presentation"
                onClose={_cancelHandler}
                canEscapeKeyClose={true}>
            <form onSubmit={_submitHandler}>
                <div className={Classes.DIALOG_BODY}>
                    <Checkbox checked={collapsible}
                              label="Collapsible Sections"
                              id="collapse_checked"
                              key="collapse_checked"
                              onChange={_changeCollapsible}
                    />
                    <Checkbox checked={include_summaries}
                              label="Include Summaries"
                              id="include_summaries"
                              key="include_summaries"
                              onChange={_changeIncludeSummaries}
                    />
                    <Checkbox checked={use_dark_theme}
                              label="Use Dark Theme"
                              id="use_dark_check"
                              key="use_dark_check"
                              onChange={_changeDark}
                    />
                    <Checkbox checked={save_as_collection}
                              label="Save As Collection"
                              id="save_as_collection"
                              key="save_as_collection"
                              onChange={_changeSaveCollection}
                    />
                    {save_as_collection &&
                        <FormGroup label="Collection Name" helperText={warning_text}>
                            <InputGroup inputRef={_refHandler}
                                        onChange={_changeName}
                                        value={collection_name}/>
                        </FormGroup>
                    }
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Button onClick={_cancelHandler}>Cancel</Button>
                        <Button intent={Intent.PRIMARY} onClick={_submitHandler}>Submit</Button>
                    </div>
                </div>
            </form>
        </Dialog>
    )
}

ReportDialog = memo(ReportDialog);
ReportDialog.propTypes = {
    handleSubmit: PropTypes.func,
    handleClose: PropTypes.func,
    default_name: PropTypes.string,
    existing_names: PropTypes.array,
};

ReportDialog.defaultProps = {
    existing_names: [],
    default_name: "NewReport",
};


function showReportDialog(submit_function, existing_names, cancel_function = null) {

    if (typeof existing_names == "undefined") {
        existing_names = []
    }

    let domContainer = document.querySelector('#modal-area');

    function handle_close() {
        ReactDOM.unmountComponentAtNode(domContainer)
    }

    ReactDOM.render(<ReportDialog handleSubmit={submit_function}
                                  handleCancel={cancel_function}
                                  handleClose={handle_close}
                                  default_name="NewReport"
                                  existing_names={existing_names}/>, domContainer);
}

function SelectDialog(props) {
    const [show, set_show] = useState(false);
    const [value, set_value] = useState(false);

    useEffect(() => {
        set_show(true);
        set_value(props.option_list[0])
    }, []);

    function _handleChange(val) {
        set_value(val)
    }

    function _submitHandler(event) {
        set_show(false);
        props.handleSubmit(value);
        props.handleClose();
    }

    function _cancelHandler() {
        set_show(false);
        props.handleClose()
    }

    return (
        <Dialog isOpen={show}
                className={window.dark_theme ? "bp5-dark" : ""}
                title={props.title}
                onClose={_cancelHandler}
                canEscapeKeyClose={true}>
            <div className={Classes.DIALOG_BODY}>
                <FormGroup title={props.select_label}>
                    <BpSelect options={props.option_list} onChange={_handleChange} value={value}/>
                </FormGroup>
            </div>
            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button onClick={_cancelHandler}>Cancel</Button>
                    <Button intent={Intent.PRIMARY} onClick={_submitHandler}>Submit</Button>
                </div>
            </div>
        </Dialog>
    )
}

SelectDialog = memo(SelectDialog);

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

function showSelectDialog(title, select_label, cancel_text, submit_text, submit_function, option_list, dark_theme = false) {

    let domContainer = document.querySelector('#modal-area');

    function handle_close() {
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

function SelectResourceDialog(props) {
    const [show, set_show] = useState(false);
    const [value, set_value] = useState(null);
    const [type, set_type] = useState("collection");
    const [option_names, set_option_names] = useState([]);
    const [selected_resource, set_selected_resource] = useState(null);

    const pushCallback = useCallbackStack();

    useEffect(() => {
        console.log("I'm in useEffect");
        _handleTypeChange("collection")
    }, []);

    function _handleTypeChange(val) {
        let get_url = `get_${val}_names`;
        let dict_hash = `${val}_names`;
        console.log("about to postWithCallback");
        postWithCallback("host", get_url, {"user_id": user_id}, function (data) {
            console.log("returned from post");
            set_show(true);
            set_type(val);
            set_option_names(data[dict_hash]);
            set_selected_resource(data[dict_hash][0]);
        }, (data)=>{console.log("got error callback")});
    }

    function _handleResourceChange(val) {
        set_selected_resource(val)
    }

    function _submitHandler(event) {
        set_show(false);
        pushCallback(() => {
            props.handleSubmit({type: type, selected_resource: selected_resource});
            props.handleClose();
        });
    }

    function _cancelHandler() {
        set_show(false);
        props.handleClose()
    }

    return (
        <Dialog isOpen={show}
                className={window.dark_theme ? "bp5-dark" : ""}
                title="Select a library resource"
                onClose={_cancelHandler}
                canEscapeKeyClose={true}>
            <div className={Classes.DIALOG_BODY}>
                <FormGroup label="Resource Type">
                    <BpSelect options={res_types} onChange={_handleTypeChange} value={type}/>
                </FormGroup>
                <FormGroup label="Specific Resource">
                    <BpSelect options={option_names} onChange={_handleResourceChange} value={selected_resource}/>
                </FormGroup>
            </div>
            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button onClick={_cancelHandler}>Cancel</Button>
                    <Button intent={Intent.PRIMARY} onClick={_submitHandler}>Submit</Button>
                </div>
            </div>
        </Dialog>
    )
}

SelectDialog = memo(SelectDialog);

SelectResourceDialog.propTypes = {
    handleSubmit: PropTypes.func,
    handleClose: PropTypes.func,
    handleCancel: PropTypes.func,
    submit_text: PropTypes.string,
    cancel_text: PropTypes.string
};

function showSelectResourceDialog(cancel_text, submit_text, submit_function, dark_theme = false) {

    let domContainer = document.querySelector('#modal-area');

    function handle_close() {
        ReactDOM.unmountComponentAtNode(domContainer)
    }

    let the_elem = <SelectResourceDialog handleSubmit={submit_function}
                                         handleClose={handle_close}
                                         submit_text={submit_text}
                                         cancel_text={cancel_text}/>;
    ReactDOM.render(the_elem, domContainer);
}

function ConfirmDialog(props) {
    const [show, set_show] = useState(false);

    useEffect(() => {
        set_show(true);
    }, []);

    function _submitHandler(event) {
        set_show(false);
        props.handleSubmit();
        props.handleClose();
    }

    function _cancelHandler() {
        set_show(false);
        props.handleClose();
        if (props.handleCancel) {
            props.handleCancel()
        }
    }

    return (
        <Dialog isOpen={show}
                className={window.dark_theme ? "bp5-dark" : ""}
                title={props.title}
                onClose={_cancelHandler}
                autoFocus={true}
                enforceFocus={true}
                usePortal={false}
                canEscapeKeyClose={true}>
            <DialogBody>
                <p>{props.text_body}</p>
            </DialogBody>
            <DialogFooter actions={
                <Fragment>
                    <Button onClick={_cancelHandler}>{props.cancel_text}</Button>
                    <Button type="submit" intent={Intent.PRIMARY}
                            onClick={_submitHandler}>{props.submit_text}</Button>
                </Fragment>
            }/>
        </Dialog>
    )
}

ConfirmDialog = memo(ConfirmDialog);

ConfirmDialog.propTypes = {
    handleSubmit: PropTypes.func,
    handleCancel: PropTypes.func,
    handleClose: PropTypes.func,
    title: PropTypes.string,
    text_body: PropTypes.string,
    submit_text: PropTypes.string,
    cancel_text: PropTypes.string
};

ConfirmDialog.defaultProps = {
    submit_text: "Submit",
    cancel_text: "Cancel",
    handleCancel: null
};

function showConfirmDialogReact(title, text_body, cancel_text, submit_text, submit_function, cancel_function = null) {

    let domContainer = document.querySelector('#modal-area');

    function handle_close() {
        ReactDOM.unmountComponentAtNode(domContainer)

    }

    ReactDOM.render(<ConfirmDialog handleSubmit={submit_function}
                                   handleCancel={cancel_function}
                                   handleClose={handle_close}
                                   title={title}
                                   text_body={text_body}
                                   submit_text={submit_text}
                                   cancel_text={cancel_text}/>, domContainer);
}

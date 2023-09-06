import React from "react";
import {Fragment, useState, useRef, useEffect, memo, useContext, createContext} from "react"
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
import {PoolAddressSelector} from "./pool_tree";
import {ThemeContext} from "./theme";

import {useStateAndRef} from "./utilities_react";
import {FileImportDialog} from "./import_dialog";

export {DialogContext, withDialogs}

const DialogContext = createContext(null);

const dialogDict = {ModalDialog, PresentationDialog, ReportDialog,
    SelectDialog, SelectAddressDialog, SelectResourceDialog, ConfirmDialog, FileImportDialog};

function withDialogs(WrappedComponent) {

    function ModalFunc(props) {
        // When state was dealt with in this way updates weren't getting batched and
        // that was causinga ll sorts of problems
        const [state, setState] = useState({
            modalType: null,
            dialogProps: {},
            keyCounter: 0
        });

        function showModal(modalType, newDialogProps) {
            setState({
                modalType: modalType,
                dialogProps: newDialogProps,
                keyCounter: state.keyCounter + 1
            })
        }

        function hideModal() {
            setState({
                modalType: null,
                dialogProps: {},
                keyCounter: 0
            });
        }
        let DialogComponent = null;

        if (state.modalType in dialogDict) {
            DialogComponent = dialogDict[state.modalType]
        }
        return (
            <Fragment>
                <DialogContext.Provider value={{showModal, hideModal}}>
                    <WrappedComponent {...props}/>
                </DialogContext.Provider>
                <div>
                    {DialogComponent &&
                        <DialogComponent
                            key={state.keyCounter}
                            isOpen={state.modalType == state.modalType}
                            {...state.dialogProps}/>
                    }
                </div>
            </Fragment>
        )
    }
    return memo(ModalFunc)
}

function ModalDialog(props) {

    const [checkbox_states, set_checkbox_states, checkbox_states_ref] = useStateAndRef({});
    const [warning_text, set_warning_text, warning_text_ref] = useStateAndRef("");
    const [current_value, set_current_value, current_value_ref] = useStateAndRef(null);

    const theme = useContext(ThemeContext);

    const input_ref = useRef(null);

    useEffect(() => {
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
        set_current_value(default_name);
        set_warning_text(null);
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
        if (current_value_ref.current == "") {
            msg = "An empty name is not allowed here.";
            set_warning_text(msg)
        } else if (_name_exists(current_value_ref.current)) {
            msg = "That name already exists";
            set_warning_text(msg)
        } else {
            props.handleSubmit(current_value_ref.current, checkbox_states);
            props.handleClose();
        }
    }

    function _cancelHandler() {
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
        <Dialog isOpen={props.isOpen}
                className={theme.dark_theme ? "bp5-dark" : ""}
                title={props.title}
                onClose={_cancelHandler}
                onOpened={() => {
                    input_ref.current.focus()
                }}
                canEscapeKeyClose={true}>
            <form onSubmit={_submitHandler}>
                <div className={Classes.DIALOG_BODY}>
                    <FormGroup label={props.field_title} helperText={warning_text_ref.current}>
                        <InputGroup inputRef={_refHandler}
                                    onChange={_changeHandler}
                                    value={current_value_ref.current}/>
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

function PresentationDialog(props) {

    const [show, set_show] = useState(false);
    const [save_as_collection, set_save_as_collection] = useState(false);
    const [collection_name, set_collection_name, collection_name_ref] = useStateAndRef(null);
    const [use_dark_theme, set_use_dark_theme] = useState(null);
    const [warning_text, set_warning_text] = useState("");

    const theme = useContext(ThemeContext);

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
                className={theme.dark_theme ? "bp5-dark" : ""}
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
                                        value={collection_name_ref.current}/>
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

function ReportDialog(props) {
    const [show, set_show] = useState(false);
    const [save_as_collection, set_save_as_collection] = useState(false);
    const [collection_name, set_collection_name] = useState(null);
    const [use_dark_theme, set_use_dark_theme] = useState(null);
    const [warning_text, set_warning_text] = useState("");
    const [collapsible, set_collapsible] = useState(false);
    const [include_summaries, set_include_summaries] = useState(false);

    const theme = useContext(ThemeContext);

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
                className={theme.dark_theme ? "bp5-dark" : ""}
                title="Create Report"
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

function SelectDialog(props) {
    const [show, set_show] = useState(false);
    const [value, set_value] = useState(false);

    const theme = useContext(ThemeContext);

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
                className={theme.dark_theme ? "bp5-dark" : ""}
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

function SelectAddressDialog(props) {
    const [show, set_show] = useState(false);
    const [new_name, set_new_name] = useState("");
    const [path, set_path] = useState();

    const theme = useContext(ThemeContext);

    useEffect(() => {
        set_show(true);
        set_path(props.initial_address);
        set_new_name(props.initial_name)
    }, []);

    function _changeName(event) {
        set_new_name(event.target.value)
    }

    function _submitHandler(event) {
        set_show(false);
        if (props.showName) {
            props.handleSubmit(`${path}/${new_name}`);
        }
        else {
            props.handleSubmit(path)
        }
        props.handleClose();
    }

    function _cancelHandler() {
        set_show(false);
        props.handleClose()
    }

    return (
        <Dialog isOpen={show}
                className={theme.dark_theme ? "bp5-dark" : ""}
                title={props.title}
                onClose={_cancelHandler}
                canEscapeKeyClose={true}>
            <div className={Classes.DIALOG_BODY}>
                <FormGroup label={`Target Directory`}
                           inline={true}>
                    <PoolAddressSelector value={path}
                                         tsocket={props.tsocket}
                                         select_type={props.selectType}
                                         setValue={set_path}
                    />
                </FormGroup>
                {props.showName &&
                    <FormGroup label="New Name">
                        <InputGroup onChange={_changeName}
                                    value={new_name}/>
                    </FormGroup>
                }
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

SelectAddressDialog = memo(SelectAddressDialog);

var res_types = ["collection", "project", "tile", "list", "code"];

function SelectResourceDialog(props) {
    const [show, set_show] = useState(false);
    const [value, set_value] = useState(null);
    const [type, set_type] = useState("collection");
    const [option_names, set_option_names] = useState([]);
    const [selected_resource, set_selected_resource] = useState(null);

    const theme = useContext(ThemeContext);
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
                className={theme.dark_theme ? "bp5-dark" : ""}
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

SelectResourceDialog = memo(SelectResourceDialog);

SelectResourceDialog.propTypes = {
    handleSubmit: PropTypes.func,
    handleClose: PropTypes.func,
    handleCancel: PropTypes.func,
    submit_text: PropTypes.string,
    cancel_text: PropTypes.string
};

function ConfirmDialog(props) {
    const [show, set_show] = useState(false);
    const theme = useContext(ThemeContext);

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
                className={theme.dark_theme ? "bp5-dark" : ""}
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

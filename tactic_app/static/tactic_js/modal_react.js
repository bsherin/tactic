
import React from "react";
import * as ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { Checkbox, Dialog, FormGroup, Classes, Button, InputGroup, Intent } from "@blueprintjs/core";

import { BpSelect } from "./blueprint_mdata_fields.js";
import { doBinding } from "./utilities_react.js";
import { postWithCallback } from "./communication_react.js";

export { showModalReact, showConfirmDialogReact, showSelectDialog, showSelectResourceDialog, showInformDialogReact };

class ModalDialog extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        let default_name = this.props.default_value;
        var name_counter = 1;
        while (this.name_exists(default_name)) {
            name_counter += 1;
            default_name = this.props.default_value + String(name_counter);
        }
        this.state = {
            show: false,
            current_value: default_name,
            checkbox_states: {},
            warning_text: ""
        };
    }

    _changeHandler(event) {
        this.setState({ "current_value": event.target.value });
    }

    _checkbox_change_handler(event) {
        let val = event.target.checked;
        let new_checkbox_states = Object.assign({}, this.state.checkbox_states);
        new_checkbox_states[event.target.id] = event.target.checked;
        this.setState({ checkbox_states: new_checkbox_states });
    }

    componentDidMount() {
        this.setState({ "show": true });
        if (this.props.checkboxes != null && this.props.checkboxes.length != 0) {
            let checkbox_states = {};
            for (let checkbox of this.props.checkboxes) {
                checkbox_states[checkbox.id] = false;
            }
            this.setState({ checkbox_states: checkbox_states });
        }
    }

    name_exists(name) {
        return this.props.existing_names.indexOf(name) > -1;
    }

    _submitHandler(event) {
        let msg;
        if (this.state.current_value == "") {
            msg = "An empty name is not allowed here.";
            this.setState({ "warning_text": msg });
        } else if (this.name_exists(this.state.current_value)) {
            msg = "That name already exists";
            this.setState({ "warning_text": msg });
        } else {
            this.setState({ "show": false });
            this.props.handleSubmit(this.state.current_value, this.state.checkbox_states);
            this.props.handleClose();
        }
    }

    _cancelHandler() {
        this.setState({ "show": false });
        if (this.props.handleCancel) {
            this.props.handleCancel();
        }
        this.props.handleClose();
    }

    _refHandler(the_ref) {
        this.input_ref = the_ref;
    }

    render() {
        let checkbox_items = [];
        if (this.props.checkboxes != null && this.props.checkboxes.length != 0) {
            for (let checkbox of this.props.checkboxes) {
                let new_item = React.createElement(Checkbox, { checked: this.state.checkbox_states[checkbox.checkname],
                    label: checkbox.checktext,
                    id: checkbox.checkname,
                    key: checkbox.checkname,
                    onChange: this._checkbox_change_handler
                });
                checkbox_items.push(new_item);
            }
        }
        return React.createElement(
            Dialog,
            { isOpen: this.state.show,
                title: this.props.title,
                onClose: this._cancelHandler,
                onOpened: () => {
                    $(this.input_ref).focus();
                },
                canEscapeKeyClose: true },
            React.createElement(
                'form',
                { onSubmit: this._submitHandler },
                React.createElement(
                    'div',
                    { className: Classes.DIALOG_BODY },
                    React.createElement(
                        FormGroup,
                        { label: this.props.field_title, helperText: this.state.warning_text },
                        React.createElement(InputGroup, { inputRef: this._refHandler,
                            onChange: this._changeHandler,
                            value: this.state.current_value })
                    ),
                    checkbox_items.length != 0 && checkbox_items
                ),
                React.createElement(
                    'div',
                    { className: Classes.DIALOG_FOOTER },
                    React.createElement(
                        'div',
                        { className: Classes.DIALOG_FOOTER_ACTIONS },
                        React.createElement(
                            Button,
                            { onClick: this._cancelHandler },
                            'Cancel'
                        ),
                        React.createElement(
                            Button,
                            { intent: Intent.PRIMARY, onClick: this._submitHandler },
                            'Submit'
                        )
                    )
                )
            )
        );
    }
}

ModalDialog.propTypes = {
    handleSubmit: PropTypes.func,
    handleClose: PropTypes.func,
    title: PropTypes.string,
    field_title: PropTypes.string,
    default_value: PropTypes.string,
    existing_names: PropTypes.array,
    checkboxes: PropTypes.array
};

ModalDialog.defaultProps = {
    existing_names: [],
    default_value: "",
    checkboxes: null
};

function showModalReact(modal_title, field_title, submit_function, default_value, existing_names, checkboxes = null, cancel_function = null) {

    if (typeof existing_names == "undefined") {
        existing_names = [];
    }

    let domContainer = document.querySelector('#modal-area');

    function handle_close() {
        ReactDOM.unmountComponentAtNode(domContainer);
    }
    ReactDOM.render(React.createElement(ModalDialog, { handleSubmit: submit_function,
        handleCancel: cancel_function,
        handleClose: handle_close,
        title: modal_title,
        field_title: field_title,
        default_value: default_value,
        checkboxes: checkboxes,
        existing_names: existing_names }), domContainer);
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
        this.setState({ "show": true, "value": this.props.option_list[0] });
    }

    _handleChange(val) {
        this.setState({ "value": val });
    }

    _submitHandler(event) {
        this.setState({ "show": false });
        this.props.handleSubmit(this.state.value);
        this.props.handleClose();
    }

    _cancelHandler() {
        this.setState({ "show": false });
        this.props.handleClose();
    }

    render() {
        return React.createElement(
            Dialog,
            { isOpen: this.state.show,
                title: this.props.title,
                onClose: this._cancelHandler,
                canEscapeKeyClose: true },
            React.createElement(
                'div',
                { className: Classes.DIALOG_BODY },
                React.createElement(
                    FormGroup,
                    { title: this.props.select_label },
                    React.createElement(BpSelect, { options: this.props.option_list, onChange: this._handleChange, value: this.state.value })
                )
            ),
            React.createElement(
                'div',
                { className: Classes.DIALOG_FOOTER },
                React.createElement(
                    'div',
                    { className: Classes.DIALOG_FOOTER_ACTIONS },
                    React.createElement(
                        Button,
                        { onClick: this._cancelHandler },
                        'Cancel'
                    ),
                    React.createElement(
                        Button,
                        { intent: Intent.PRIMARY, onClick: this._submitHandler },
                        'Submit'
                    )
                )
            )
        );
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
    cancel_text: PropTypes.string
};

function showSelectDialog(title, select_label, cancel_text, submit_text, submit_function, option_list) {

    let domContainer = document.querySelector('#modal-area');

    function handle_close() {
        ReactDOM.unmountComponentAtNode(domContainer);
    }
    ReactDOM.render(React.createElement(SelectDialog, { handleSubmit: submit_function,
        handleClose: handle_close,
        title: title,
        select_label: select_label,
        submit_text: submit_text,
        option_list: option_list,
        cancel_text: cancel_text }), domContainer);
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
        this._handleTypeChange("collection");
    }

    _handleTypeChange(val) {
        let get_url = `get_${val}_names`;
        let dict_hash = `${val}_names`;
        let self = this;
        postWithCallback("host", get_url, { "user_id": user_id }, function (data) {
            let option_names = data[dict_hash];
            self.setState({ show: true, type: val, option_names: option_names, selected_resource: option_names[0] });
        });
    }

    _handleResourceChange(val) {
        this.setState({ selected_resource: val });
    }

    _submitHandler(event) {
        this.setState({ "show": false }, () => {
            this.props.handleSubmit({ type: this.state.type, selected_resource: this.state.selected_resource });
            this.props.handleClose();
        });
    }

    _cancelHandler() {
        this.setState({ "show": false });
        this.props.handleClose();
    }

    render() {
        return React.createElement(
            Dialog,
            { isOpen: this.state.show,
                title: 'Select a library resource',
                onClose: this._cancelHandler,
                canEscapeKeyClose: true },
            React.createElement(
                'div',
                { className: Classes.DIALOG_BODY },
                React.createElement(
                    FormGroup,
                    { label: 'Resource Type' },
                    React.createElement(BpSelect, { options: res_types, onChange: this._handleTypeChange, value: this.state.type })
                ),
                React.createElement(
                    FormGroup,
                    { label: 'Specific Resource' },
                    React.createElement(BpSelect, { options: this.state.option_names, onChange: this._handleResourceChange, value: this.state.selected_resource })
                )
            ),
            React.createElement(
                'div',
                { className: Classes.DIALOG_FOOTER },
                React.createElement(
                    'div',
                    { className: Classes.DIALOG_FOOTER_ACTIONS },
                    React.createElement(
                        Button,
                        { onClick: this._cancelHandler },
                        'Cancel'
                    ),
                    React.createElement(
                        Button,
                        { intent: Intent.PRIMARY, onClick: this._submitHandler },
                        'Submit'
                    )
                )
            )
        );
    }
}

SelectResourceDialog.propTypes = {
    handleSubmit: PropTypes.func,
    handleClose: PropTypes.func,
    handleCancel: PropTypes.func,
    submit_text: PropTypes.string,
    cancel_text: PropTypes.string
};

function showSelectResourceDialog(cancel_text, submit_text, submit_function) {

    let domContainer = document.querySelector('#modal-area');

    function handle_close() {
        ReactDOM.unmountComponentAtNode(domContainer);
    }
    ReactDOM.render(React.createElement(SelectResourceDialog, { handleSubmit: submit_function,
        handleClose: handle_close,
        submit_text: submit_text,
        cancel_text: cancel_text }), domContainer);
}

class ConfirmDialog extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        this.state = {
            show: false
        };
    }

    componentDidMount() {
        this.setState({ "show": true });
    }

    _submitHandler(event) {
        this.setState({ "show": false });
        this.props.handleSubmit();
        this.props.handleClose();
    }

    _cancelHandler() {
        this.setState({ "show": false });
        this.props.handleClose();
    }

    render() {
        return React.createElement(
            Dialog,
            { isOpen: this.state.show,
                title: this.props.title,
                onClose: this._cancelHandler,
                canEscapeKeyClose: true },
            React.createElement(
                'div',
                { className: Classes.DIALOG_BODY },
                React.createElement(
                    'p',
                    null,
                    this.props.text_body
                )
            ),
            React.createElement(
                'div',
                { className: Classes.DIALOG_FOOTER },
                React.createElement(
                    'div',
                    { className: Classes.DIALOG_FOOTER_ACTIONS },
                    React.createElement(
                        Button,
                        { onClick: this._cancelHandler },
                        this.props.cancel_text
                    ),
                    React.createElement(
                        Button,
                        { intent: Intent.PRIMARY, onClick: this._submitHandler },
                        this.props.submit_text
                    )
                )
            )
        );
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
};

function showConfirmDialogReact(title, text_body, cancel_text, submit_text, submit_function) {

    let domContainer = document.querySelector('#modal-area');

    function handle_close() {
        ReactDOM.unmountComponentAtNode(domContainer);
    }
    ReactDOM.render(React.createElement(ConfirmDialog, { handleSubmit: submit_function,
        handleClose: handle_close,
        title: title,
        text_body: text_body,
        submit_text: submit_text,
        cancel_text: cancel_text }), domContainer);
}

class InformDialog extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        this.state = {
            show: false
        };
    }

    componentDidMount() {
        this.setState({ "show": true });
    }

    _closeHandler() {
        this.setState({ "show": false });
        this.props.handleClose();
    }

    render() {
        return React.createElement(
            Dialog,
            { isOpen: this.state.show,
                title: this.props.title,
                onClose: this._closeHandler,
                canEscapeKeyClose: true },
            React.createElement(
                'div',
                { className: Classes.DIALOG_BODY },
                React.createElement(
                    'p',
                    null,
                    this.props.text_body
                )
            ),
            React.createElement(
                'div',
                { className: Classes.DIALOG_FOOTER },
                React.createElement(
                    'div',
                    { className: Classes.DIALOG_FOOTER_ACTIONS },
                    React.createElement(
                        Button,
                        { onClick: this._closeHandler },
                        'Okay'
                    )
                )
            )
        );
    }
}

InformDialog.propTypes = {
    handleClose: PropTypes.func,
    title: PropTypes.string,
    text_body: PropTypes.string,
    close_text: PropTypes.string
};

function showInformDialogReact(title, text_body, close_text = "Okay") {

    let domContainer = document.querySelector('#modal-area');

    function handle_close() {
        ReactDOM.unmountComponentAtNode(domContainer);
    }
    ReactDOM.render(React.createElement(ConfirmDialog, {
        handleClose: handle_close,
        title: title,
        text_body: text_body,
        close_text: close_text }), domContainer);
}
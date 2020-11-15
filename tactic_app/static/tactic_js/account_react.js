
import "../tactic_css/tactic.scss";

import React from "react";
import * as ReactDOM from 'react-dom';

import { FormGroup, InputGroup, Button, HTMLSelect } from "@blueprintjs/core";

import { doFlash } from "./toaster.js";
import { postAjax } from "./communication_react.js";

import { doBinding, guid } from "./utilities_react.js";
import { TacticNavbar } from "./blueprint_navbar";

window.page_id = guid();
window.main_id = window.page_id;

function _account_main() {
    if (window._show_message) doFlash(window._message);
    let domContainer = document.querySelector('#root');
    ReactDOM.render(React.createElement(AccountApp, { initial_theme: window.theme }), domContainer);
}

const field_names = ["new_password", "confirm_new_password"];

class AccountTextField extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
    }

    render() {
        return React.createElement(
            FormGroup,
            { key: this.props.name,
                inline: false,
                style: { padding: 10 },
                label: this.props.display_text,
                helperText: this.props.helper_text },
            React.createElement(InputGroup, { type: "text",
                onChange: event => this.props.onFieldChange(this.props.name, event.target.value, false),
                onBlur: () => this.props.onBlur(this.props.name, this.props.value),
                style: { width: 250 },
                large: true,
                fill: false,
                placeholder: this.props.name,
                value: this.props.value
            })
        );
    }

}

class AccountSelectField extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
    }

    render() {
        return React.createElement(
            FormGroup,
            { key: this.props.name,
                inline: false,
                style: { padding: 10 },
                label: this.props.display_text,
                helperText: this.props.helper_text },
            React.createElement(HTMLSelect, { options: this.props.options,
                onChange: e => {
                    this.props.onFieldChange(this.props.name, e.currentTarget.value, true);
                },
                value: this.props.value })
        );
    }

}

class AccountApp extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
        this.state = {
            dark_theme: this.props.initial_theme == "dark"
        };

        this.state.fields = [];
        this.state.password = "";
        this.state.confirm_password = "";
        this.state.password_helper = null;
    }

    componentDidMount() {
        let self = this;
        postAjax("get_account_info", {}, data => {
            // let new_fields = [];
            // let new_helper_text = Object.assign({}, this.state.helper_text);
            // for (let fdict of data.field_list) {
            //     new_field = Object.assign({}, fdict);
            // }
            let new_state = { fields: data.field_list };
            self.setState(new_state);
            window.dark_theme = self.state.dark_theme;
        });
    }

    _setTheme(dark_theme) {
        this.setState({ dark_theme: dark_theme }, () => {
            window.dark_theme = this.state.dark_theme;
        });
    }

    _submitPassword() {
        let pwd = this.state.password;
        let pwd2 = this.state.confirm_password;
        if (pwd != pwd2) {
            this.setState({ password_helper: "Passwords don't match" });
            return;
        }
        if (pwd == "") {
            this.setState({ password_helper: "Passwords can't be empty" });
            return;
        }
        let data = {};
        data["password"] = pwd;
        postAjax("update_account_info", data, function (result) {
            if (result.success) {
                doFlash({ "message": "Password successfully updated", "alert_type": "alert-success" });
            } else {
                data.alert_type = "alert-warning";
                doFlash(data);
            }
        });
    }

    _onFieldChange(fname, value, submit = false) {
        if (fname == "password" || fname == "confirm_password") {
            let new_state = Object.assign({}, this.state);
            new_state[fname] = value;
            this.setState(new_state);
        } else {
            let new_fields = [];
            for (let fdict of this.state.fields) {
                let ndict = Object.assign({}, fdict);
                if (fdict.name == fname) {
                    ndict.val = value;
                }
                new_fields.push(ndict);
            }
            let self = this;
            this.setState({ fields: new_fields }, () => {
                if (submit) {
                    this._submitUpdatedField(fname, value);
                }
            });
        }
    }

    _clearHelperText(fname) {
        this._setHelperText(fname, null);
    }

    _setHelperText(fname, helper_text, timeout = false) {
        let new_fields = [];
        for (let fdict of this.state.fields) {
            let ndict = Object.assign({}, fdict);
            if (fdict.name == fname) {
                ndict.helper_text = helper_text;
            }
            new_fields.push(ndict);
        }
        let self = this;
        this.setState({ fields: new_fields }, () => {
            if (timeout) {
                setTimeout(() => {
                    self._clearHelperText(fname);
                }, 5000);
            }
        });
    }

    _submitUpdatedField(fname, fvalue) {
        let data = {};
        data[fname] = fvalue;
        let self = this;
        postAjax("update_account_info", data, function (result) {
            if (result.success) {
                if (fname == "password") {
                    doFlash({ "message": "Password successfully updated", "alert_type": "alert-success" });
                } else {
                    self._setHelperText(fname, "value updated", true);
                }
            } else {
                data.alert_type = "alert-warning";
                doFlash(data);
            }
        });
    }
    _submit_account_info() {
        postAjax("update_account_info", this.state.fields, function (result) {
            if (result.success) {
                doFlash({ "message": "Account successfully updated", "alert_type": "alert-success" });
            } else {
                data.alert_type = "alert-warning";
                doFlash(data);
            }
        });
    }

    _getFieldItems() {
        let info_items = [];
        let setting_items = [];
        for (let fdict of this.state.fields) {
            let new_item;
            if (fdict.type == "text") {
                new_item = React.createElement(AccountTextField, { name: fdict.name,
                    value: fdict.val,
                    display_text: fdict.display_text,
                    helper_text: fdict.helper_text,
                    onBlur: this._submitUpdatedField,
                    onFieldChange: this._onFieldChange });
            } else {
                new_item = React.createElement(AccountSelectField, { name: fdict.name,
                    value: fdict.val,
                    display_text: fdict.display_text,
                    options: fdict.options,
                    helper_text: fdict.helper_text,
                    onFieldChange: this._onFieldChange });
            }
            if (fdict.info_type == "info") {
                info_items.push(new_item);
            } else {
                setting_items.push(new_item);
            }
        }
        return [info_items, setting_items];
    }

    render() {
        let field_items = this._getFieldItems();
        let outer_class = "account-settings";
        if (this.state.dark_theme) {
            outer_class = outer_class + " bp3-dark";
        } else {
            outer_class = outer_class + " light-theme";
        }
        let self = this;
        return React.createElement(
            React.Fragment,
            null,
            React.createElement(TacticNavbar, { is_authenticated: window.is_authenticated,
                selected: null,
                show_api_links: false,
                dark_theme: this.state.dark_theme,
                set_parent_theme: this._setTheme,
                user_name: window.username }),
            React.createElement(
                "div",
                { className: outer_class },
                React.createElement(
                    "div",
                    { style: { display: "flex", "flex-direction": "column" } },
                    React.createElement(
                        "div",
                        { className: "account-pane bp3-card" },
                        React.createElement(
                            "h6",
                            null,
                            "User Info"
                        ),
                        field_items[0]
                    ),
                    React.createElement(
                        "div",
                        { className: "account-pane bp3-card" },
                        React.createElement(
                            "h6",
                            null,
                            "User Settings"
                        ),
                        field_items[1]
                    )
                ),
                React.createElement(
                    "div",
                    { className: "account-pane bp3-card" },
                    React.createElement(
                        "h6",
                        null,
                        "Change Password"
                    ),
                    React.createElement(AccountTextField, { name: "password",
                        value: this.state.password,
                        helper_text: this.state.password_helper,
                        onFieldChange: this._onFieldChange }),
                    React.createElement(AccountTextField, { name: "confirm_password",
                        value: this.state.confirm_password,
                        helper_text: this.state.password_helper,
                        onFieldChange: this._onFieldChange }),
                    React.createElement(Button, { icon: "log-in", large: true, text: "Update Password", onClick: this._submitPassword })
                )
            )
        );
    }
}

_account_main();
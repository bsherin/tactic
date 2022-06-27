
import "../tactic_css/tactic.scss";

import React from "react";
import * as ReactDOM from 'react-dom'

import { FormGroup, InputGroup, Button, HTMLSelect } from "@blueprintjs/core";

import {doFlash} from "./toaster.js"
import {postAjax} from "./communication_react.js";

import {doBinding, guid} from "./utilities_react.js";
import {TacticNavbar} from "./blueprint_navbar";

window.main_id = guid();

function _account_main() {
    if (window._show_message) doFlash(window._message);
    let domContainer = document.querySelector('#root');
    ReactDOM.render(<AccountApp initial_theme={window.theme} controlled={false}/>, domContainer)
}

const field_names = ["new_password", "confirm_new_password"];

class AccountTextField extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this)
    }

    render() {
        return (
            <FormGroup key={this.props.name}
                          inline={false}
                          style={{padding: 10}}
                          label={this.props.display_text}
                          helperText={this.props.helper_text}>
                            <InputGroup type="text"
                                           onChange={(event)=>this.props.onFieldChange(this.props.name, event.target.value, false)}
                                           onBlur={()=>this.props.onBlur(this.props.name, this.props.value)}
                                           style={{width: 250}}
                                           large={true}
                                           fill={false}
                                           placeholder={this.props.name}
                                           value={this.props.value}
                                           />
                </FormGroup>
        )
    }

}

class AccountSelectField extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this)
    }

    render() {
        return (
            <FormGroup key={this.props.name}
                       inline={false}
                       style={{padding: 10}}
                       label={this.props.display_text}
                       helperText={this.props.helper_text}>
                <HTMLSelect options={this.props.options}
                            onChange={(e)=>{this.props.onFieldChange(this.props.name, e.currentTarget.value, true)}}
                            value={this.props.value}/>
            </FormGroup>
        )
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
        postAjax("get_account_info", {}, (data)=> {
                let new_state = {fields: data.field_list};
                self.setState(new_state);
                window.dark_theme = self.state.dark_theme
            }
        )
    }

    _setTheme(dark_theme) {
        this.setState({dark_theme: dark_theme}, ()=> {
            window.dark_theme = this.state.dark_theme
        })
    }

    _submitPassword() {
        let pwd = this.state.password;
        let pwd2 = this.state.confirm_password;
        if (pwd != pwd2) {
            this.setState({password_helper: "Passwords don't match"});
            return
        }
        if (pwd == "") {
            this.setState({password_helper: "Passwords can't be empty"});
            return
        }
        let data = {};
        data["password"] = pwd;
        postAjax("update_account_info", data, function (result) {
            if (result.success) {
                doFlash({"message": "Password successfully updated", "alert_type": "alert-success"});
            }
            else {
                data.alert_type = "alert-warning";
                doFlash(data);
            }
        })
    }

    _onFieldChange(fname, value, submit=false) {
        if (fname == "password" || fname == "confirm_password") {
            let new_state = Object.assign({}, this.state);
            new_state[fname] = value;
            this.setState(new_state)
        }
        else {
            let new_fields = [];
            for (let fdict of this.state.fields) {
                let ndict = Object.assign({}, fdict);
                if (fdict.name == fname) {
                    ndict.val = value
                }
                new_fields.push(ndict)
            }
            let self = this;
            this.setState({fields: new_fields}, ()=>{
                if (submit) {
                    this._submitUpdatedField(fname, value)
                }
            })
        }
    }

    _clearHelperText(fname) {
        this._setHelperText(fname, null);
    }

    _setHelperText(fname, helper_text, timeout=false) {
        let new_fields = [];
        for (let fdict of this.state.fields) {
            let ndict = Object.assign({}, fdict);
            if (fdict.name == fname) {
                ndict.helper_text = helper_text
            }
            new_fields.push(ndict)
        }
        let self = this;
        this.setState({fields: new_fields}, ()=>{
            if (timeout) {
                setTimeout(()=>{self._clearHelperText(fname)}, 5000)
            }
        })
    }

    _submitUpdatedField(fname, fvalue) {
        let data = {};
        data[fname] = fvalue;
        let self = this;
        postAjax("update_account_info", data, function (result) {
            if (result.success) {
                if (fname == "password") {
                    doFlash({"message": "Password successfully updated", "alert_type": "alert-success"});
                }
                else {
                    self._setHelperText(fname, "value updated", true)
                }
            }

            else {
                data.alert_type = "alert-warning";
                doFlash(data);
            }
        })
    }
     _submit_account_info() {
        postAjax("update_account_info", this.state.fields, function (result) {
            if (result.success) {
                doFlash({"message": "Account successfully updated", "alert_type": "alert-success"});
            }
            else {
                data.alert_type = "alert-warning";
                doFlash(data);
            }
        })
    }
    
    _getFieldItems() {
        let info_items = [];
        let setting_items = [];
        for (let fdict of this.state.fields) {
            let new_item;
            if (fdict.type == "text") {
                new_item = (
                    <AccountTextField name={fdict.name}
                                      value={fdict.val}
                                      display_text={fdict.display_text}
                                      helper_text={fdict.helper_text}
                                      onBlur={this._submitUpdatedField}
                                      onFieldChange={this._onFieldChange}/>)
            }
            else {
                new_item = (
                    <AccountSelectField name={fdict.name}
                                        value={fdict.val}
                                        display_text={fdict.display_text}
                                        options={fdict.options}
                                        helper_text={fdict.helper_text}
                                        onFieldChange={this._onFieldChange}/>)
            }
            if (fdict.info_type == "info") {
                info_items.push(new_item)
            }
            else {
                setting_items.push(new_item)
            }
        }
        return [info_items, setting_items]
    }

    render () {
        let field_items = this._getFieldItems();
        let outer_class = "account-settings";
        if (this.state.dark_theme) {
            outer_class = outer_class + " bp4-dark";
        }
        else {
            outer_class = outer_class + " light-theme"
        }
        let self = this;
        return (

            <React.Fragment>
                <TacticNavbar is_authenticated={window.is_authenticated}
                              dark_theme={this.state.dark_theme}
                              setTheme={this.props.controlled ? this.props.setTheme : this._setTheme}
                              selected={null}
                              show_api_links={false}
                              page_id={window.main_id}
                              user_name={window.username}/>
                <div className={outer_class}>
                    <div style={{display: "flex", "flex-direction": "column"}}>
                        <div className="account-pane bp4-card">
                            <h6>User Info</h6>
                            {field_items[0]}
                        </div>
                        <div className="account-pane bp4-card">
                            <h6>User Settings</h6>
                            {field_items[1]}
                        </div>
                    </div>
                    <div className="account-pane bp4-card">
                        <h6>Change Password</h6>
                        <AccountTextField name="password"
                                      value={this.state.password}
                                      helper_text={this.state.password_helper}
                                      onFieldChange={this._onFieldChange}/>
                        <AccountTextField name="confirm_password"
                                      value={this.state.confirm_password}
                                      helper_text={this.state.password_helper}
                                      onFieldChange={this._onFieldChange}/>
                        <Button icon="log-in" large={true} text="Update Password" onClick={this._submitPassword}/>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

_account_main();
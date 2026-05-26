import "../tactic_css/tactic.scss";
import ("../tactic_css/themeable.scss");

import React from "react";
import {Fragment, useEffect, useState, memo, useContext} from "react";
import { createRoot } from 'react-dom/client';

import { Button } from "@blueprintjs/core";

import {doFlash} from "./toaster"
import {postPromise, postAjax, handleCallback} from "./communication_react";

import {guid, useCallbackStack, useStateAndRef, withRegisterActivity} from "./utilities_react";
import {TacticNavbar} from "./blueprint_navbar";

import {withSettings, SettingsContext} from "./settings";

import {AccountTextField, AccountSelectField, AccountAddressSelectField} from "./account_fields";
import {TacticSocket, useSocketListener} from "./tactic_socket";
import {DialogContext} from "./modal_react";

window.global_id = "a" + guid();

function _account_main() {
    if (window._show_message) doFlash(window._message);
    const domContainer = document.querySelector('#root');
    const root = createRoot(domContainer);
    let tsocket = new TacticSocket("main", 5000, "account_interface", window.global_id, async ()=> {
        tsocket.attachListener('handle-callback', (task_packet) => {
            handleCallback(task_packet, window.global_id)
        });
        let AccountAppPlus = withRegisterActivity(withSettings(AccountApp));
        let the_element = <AccountAppPlus controlled={false} tsocket={tsocket}/>;
        root.render(
            <div style={{
                display: "flex", flexDirection: "column",
                position: "relative",
                height: "100%",
                width: "100%"
            }}>
                {the_element}
            </div>
        )
    })
}

function AccountApp(props) {

    const [fields, set_fields, fields_ref] = useStateAndRef([]);
    const [password, set_password] = useState("");
    const [confirm_password, set_confirm_password] = useState("");
    const [password_helper, set_password_helper] = useState(null);

    const settingsContext = useContext(SettingsContext);
    const dialogFuncs = useContext(DialogContext);

    const pushCallback = useCallbackStack();

    useEffect(()=>{
        postAjax("get_account_info", {}, (data)=> {
            set_fields(data.field_list);
        })
        return (()=>{
            props.tsocket.disconnect()
        })
    }, []);

    useSocketListener(props.tsocket, "endSession", function () {
        dialogFuncs.showModal("EndSessionDialog", {})
    }, []);

    function _submitPassword() {
        let pwd = password;
        if (pwd != confirm_password) {
            set_password_helper("Passwords don't match");
            return
        }
        if (pwd == "") {
            set_password_helper("Passwords can't be empty");
            return
        }
        let data = {};
        data["password"] = pwd;
        postPromise("host", "update_account_info", data)
            .then((result) => {
            if (result.success) {
                doFlash({"message": "Password successfully updated", "alert_type": "alert-success"});
            }
            else {
                data.alert_type = "alert-warning";
                doFlash(data);
            }
        })
    }

    function _onFieldChange(fname, value, submit=false) {
        if (fname == "password") {
            set_password(value)
        }
        else if (fname == "confirm_password") {
            set_confirm_password(value)
        }
        else {
            let new_fields = fields.map(fdict => {
                if (fdict.name == fname) {
                    let ndict = {...fdict};
                    ndict.val = value;
                    return ndict
                }
                else {
                    return fdict
                }
            });
            set_fields(new_fields);
            pushCallback(()=>{
                if (submit) {
                    _submitUpdatedField(fname, value)
                }
            })
        }
    }

    function _clearHelperText(fname) {
        _setHelperText(fname, null);
    }

    function _setHelperText(fname, helper_text, timeout=false) {
        // Need to use fields_ref here because of the setTimeout in which it appears.
        let new_fields = fields_ref.current.map(fdict => {
            if (fdict.name == fname) {
                let ndict = {...fdict};
                ndict.helper_text = helper_text;
                return ndict
            }
            else {
                return fdict
            }
        });
        set_fields(new_fields);
        pushCallback(()=>{
            if (timeout) {
                setTimeout(()=>{_clearHelperText(fname)}, 5000)
            }
        })
    }

    function _submitUpdatedField(fname, fvalue) {
        let data = {};
        data[fname] = fvalue;
        postPromise("host", "update_account_info", data)
            .then((result) =>{
            if (result.success) {
                if (fname == "password") {
                    doFlash({"message": "Password successfully updated", "alert_type": "alert-success"});
                }
                else {
                    _setHelperText(fname, "value updated", true)
                }
            }
            else {
                data.alert_type = "alert-warning";
                doFlash(data);
            }
        })
    }
     function _submit_account_info() {
        postPromise("host", "update_account_info", fields_ref.current)
            .then((result) => {
            if (result.success) {
                doFlash({"message": "Account successfully updated", "alert_type": "alert-success"});
            }
            else {
                data.alert_type = "alert-warning";
                doFlash(data);
            }
        })
    }
    
    function _getFieldItems() {
        let info_items = [];
        let setting_items = [];
        for (let fdict of fields) {
            let new_item;
            if (fdict.type == "text") {
                new_item = (
                    <AccountTextField name={fdict.name}
                                      key={fdict.name}
                                      value={fdict.val}
                                      display_text={fdict.display_text}
                                      helper_text={fdict.helper_text}
                                      onBlur={_submitUpdatedField}
                                      onFieldChange={_onFieldChange}/>)
            }
            else if (fdict.type == "pool_select") {
                new_item = (
                    <AccountAddressSelectField
                                        name={fdict.name}
                                        key={fdict.name}
                                        tsocket={props.tsocket}
                                        value={fdict.val}
                                        display_text={fdict.display_text}
                                        helper_text={fdict.helper_text}
                                        onFieldChange={_onFieldChange}/>)
            }
            else {
                new_item = (
                    <AccountSelectField name={fdict.name}
                                        key={fdict.name}
                                        value={fdict.val}
                                        display_text={fdict.display_text}
                                        options={fdict.options}
                                        helper_text={fdict.helper_text}
                                        onFieldChange={_onFieldChange}/>)
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

        let field_items = _getFieldItems();
        let outer_class = "account-settings";
        if (settingsContext.isDark()) {
            outer_class = outer_class + " bp6-dark";
        }
        else {
            outer_class = outer_class + " light-theme"
        }
        return (
            <Fragment>
                <TacticNavbar is_authenticated={window.is_authenticated}
                              selected={null}
                              show_api_links={false}
                              global_id={window.global_id}
                              user_name={window.username}/>
                <div className={outer_class}>
                    <div style={{display: "flex", flexDirection: "column", overflowY: "scroll"}}>
                        <div className="account-pane bp6-card">
                            <h6>User Info</h6>
                            {field_items[0]}
                        </div>
                        <div className="account-pane bp6-card">
                            <h6>User Settings</h6>
                            {field_items[1]}
                        </div>
                    </div>
                    <div className="account-pane bp6-card">
                        <h6>Change Password</h6>
                        <AccountTextField name="password"
                                          key="password"
                                      value={password}
                                      helper_text={password_helper}
                                      onFieldChange={_onFieldChange}/>
                        <AccountTextField name="confirm_password"
                                          key="confirm_password"
                                      value={confirm_password}
                                      helper_text={password_helper}
                                      onFieldChange={_onFieldChange}/>
                        <Button icon="log-in" size="large" text="Update Password" onClick={_submitPassword}/>
                    </div>
                </div>
            </Fragment>
        )
}

AccountApp = memo(AccountApp);

_account_main();
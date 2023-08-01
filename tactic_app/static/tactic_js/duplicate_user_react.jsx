
import "../tactic_css/tactic.scss";

import React from "react";
import {Fragment, memo} from "react";
import * as ReactDOM from 'react-dom'

import { FormGroup, InputGroup, Button } from "@blueprintjs/core";

import {render_navbar} from "./blueprint_navbar";
import {doFlash} from "./toaster"
import {postAjax} from "./communication_react";
import {guid, useStateAndRef} from "./utilities_react";

window.page_id = guid();

function _duplicate_main() {
    render_navbar("account");
    let domContainer = document.querySelector('#root');
    ReactDOM.render(<DuplicateApp/>, domContainer)
}

const field_names = ["username", "password", "confirm_password"];
var initial_fields = {};
for (let field of field_names) {
    initial_fields[field] = ""
}
var initial_helper_text = {};
for (let field of field_names) {
    initial_helper_text[field] = null;
}


function DuplicateApp(props) {

    const [fields, set_fields, fields_ref] = useStateAndRef(initial_fields);
    const [helper_text, set_helper_text, helper_text_ref] = useStateAndRef(initial_helper_text);

    function _onFieldChange(field, value) {
        let new_fields = {...fields_ref.current};
        new_fields[field] = value;

        set_fields(new_fields)
    }

     function _submit_duplicate_info() {
        let pwd = fields_ref.current.password;
        let pwd2 = fields_ref.current.confirm_password;

        const data = {};
        if ((pwd == "") || (pwd2 == "" )) {
            let new_helper_text = {...helper_text_ref.current, confirm_password: "Passwords cannot be empty"};
            set_helper_text(new_helper_text);
            return
        }
        if (pwd != pwd2) {
            let new_helper_text = {...helper_text_ref.current, confirm_password: "Passwords don't match"};
            set_helper_text(new_helper_text);
            return
        }
        data.password = pwd;
        let fields = {...fields_ref.current};
        fields.old_username = window.old_username;
        postAjax("attempt_duplicate", fields, function (result) {
            if (result.success) {
                doFlash({"message": "Account successfully duplicated", "alert_type": "alert-success"});
            }
            else {
                data.alert_type = "alert-warning";
                doFlash(data);
            }
        })
    }

    let field_items = Object.keys(fields_ref.current).map((field_name)=>(
        <FormGroup key={field_name}
                      inline={true}
                      style={{padding: 10}}
                          label={field_name}
                          helperText={helper_text_ref.current[field_name]}>
                        <InputGroup type="text"
                                       onChange={(event)=>_onFieldChange(field_name, event.target.value)}
                                       style={{width: 250}}
                                       large={true}
                                       fill={false}
                                       placeholder={field_name}
                                       value={fields_ref.current[field_name]}
                                       />
            </FormGroup>
    ));
    let outer_style = {textAlign:"center",
        marginLeft: 50,
        marginTop: 50,
        height: "100%"};
    return (
        <Fragment>
            <div className="d-flex flex-column" style={outer_style}>
                <form onSubmit={e => {
                          e.preventDefault();
                          _submit_duplicate_info();
                        }}>
                    {field_items}
                 <div className="d-flex flex-row">
                    <Button icon="log-in" large={true} text="Submit" onClick={_submit_duplicate_info}/>
                 </div>
                </form>
            </div>
        </Fragment>
    )
}

DuplicateApp = memo(DuplicateApp);

_duplicate_main();
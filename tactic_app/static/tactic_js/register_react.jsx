import "../tactic_css/tactic.scss";

import React from "react";
import {Fragment, memo, useContext} from "react";
import { createRoot } from 'react-dom/client';

import {FormGroup, InputGroup, Button} from "@blueprintjs/core";

import {TacticNavbar} from "./blueprint_navbar";
import {doFlash} from "./toaster"
import {postAjax} from "./communication_react";
import {useStateAndRef, guid} from "./utilities_react";

window.page_id = guid();

function _register_main() {
    const domContainer = document.querySelector('#root');
    const root = createRoot(domContainer);
    root.render(<RegisterApp/>)
}

const field_names = ["username", "password", "confirm_password"];

var initial_fields = {};
for (let field of field_names) {
    initial_fields[field] = ""
}

var initial_helper_text = {};
for (let field of field_names) {
    initial_helper_text[field] = null
}

function RegisterApp(props) {

    const [fields, set_fields, fields_ref] = useStateAndRef(initial_fields);
    const [helper_text, set_helper_text, helper_text_ref] = useStateAndRef(initial_helper_text);

    function _onFieldChange(field, value) {
        let new_fields = {...fields_ref.current};
        new_fields[field] = value;
        set_fields(new_fields)
    }

    function _submit_register_info() {
        let pwd = fields_ref.current.password;
        let pwd2 = fields_ref.current.confirm_password;
        const data = {};
        if ((pwd == "") || (pwd2 == "")) {
            let new_helper_text = {...helper_text.current};
            new_helper_text.confirm_password = "Passwords cannot be empty";
            set_helper_text(new_helper_text);
            return
        }
        if (pwd != pwd2) {
            let new_helper_text = {...helper_text.current};
            new_helper_text.confirm_password = "Passwords don't match";
            set_helper_text(new_helper_text);
            return
        }
        data.password = pwd;
        postAjax("attempt_register", fields_ref.current, function (result) {
            if (result.success) {
                doFlash({"message": "Account successfully created", "alert_type": "alert-success"});
            } else {
                data.alert_type = "alert-warning";
                doFlash(data);
            }
        })
    }

    let field_items = Object.keys(fields_ref.current).map((field_name) => (
        <FormGroup key={field_name}
                   inline={true}
                   style={{padding: 10}}
                   label={field_name}
                   helperText={helper_text_ref.current[field_name]}>
            <InputGroup type="text"
                        onChange={(event) => _onFieldChange(field_name, event.target.value)}
                        style={{width: 250}}
                        large={true}
                        fill={false}
                        placeholder={field_name}
                        value={fields_ref.current[field_name]}
            />
        </FormGroup>
    ));
    let outer_style = {
        textAlign: "center",
        paddingLeft: 50,
        paddingTop: 50,
        height: "100%"
    };
    let outer_class = "d-flex flex-column pane-holder";
    outer_class = outer_class + " light-theme";
    return (
        <Fragment>
            <TacticNavbar is_authenticated={window.is_authenticated}
                          selected={null}
                          show_api_links={true}
                          page_id={window.page_id}
                          user_name={window.username}/>
            <div className={outer_class}  style={outer_style}>
                <form onSubmit={e => {
                    e.preventDefault();
                    _submit_register_info();
                }}>
                    {field_items}
                    <div className="d-flex flex-row">
                        <Button icon="log-in" large={true} text="Submit" onClick={_submit_register_info}/>
                    </div>
                </form>
            </div>
        </Fragment>
    )
}

RegisterApp = memo(RegisterApp);

_register_main();
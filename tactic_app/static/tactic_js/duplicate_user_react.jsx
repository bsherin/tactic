
import "../tactic_css/tactic.scss";

import React from "react";
import * as ReactDOM from 'react-dom'

import { FormGroup, InputGroup, Button } from "@blueprintjs/core";

import {render_navbar} from "./blueprint_navbar.js";
import {doFlash} from "./toaster.js"
import {postAjax} from "./communication_react.js";
import {doBinding, guid} from "./utilities_react.js";

window.page_id = guid();

function _duplicate_main() {
    render_navbar("account");
    let domContainer = document.querySelector('#root');
    ReactDOM.render(<DuplicateApp/>, domContainer)
}

const field_names = ["username", "password", "confirm_password"];

class DuplicateApp extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
        this.state = {

        };
        let fields = {};
        for (let field of field_names) {
            fields[field] = ""
        }
        this.state.fields = fields;
        let helper_text = {};
        for (let field of field_names) {
            helper_text[field] = null;
        }
        this.state.helper_text = helper_text
    }

    componentDidMount() {
    }

    _onFieldChange(field, value) {
        let new_fields = Object.assign({}, this.state.fields);
        new_fields[field] = value;
        this.setState({fields: new_fields})
    }

     _submit_duplicate_info() {
        let pwd = this.state.fields.password;
        let pwd2 = this.state.fields.confirm_password;
        const data = {};
        if ((pwd == "") || (pwd == "" )) {
            let new_helper_text = Object.assign({}, this.state.helper_text);
            new_helper_text.confirm_password = "Passwords cannot be empty";
            this.setState({helper_text: new_helper_text});
            return
        }
        if (pwd != pwd2) {
            let new_helper_text = Object.assign({}, this.state.helper_text);
            new_helper_text.confirm_password = "Passwords don't match";
            this.setState({helper_text: new_helper_text});
            return
        }
        data.password = pwd;
        let fields = Object.assign({}, this.state.fields);
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

    render () {
        let field_items = Object.keys(this.state.fields).map((field_name)=>(
            <FormGroup key={field_name}
                          inline={true}
                          style={{padding: 10}}
                              label={field_name}
                              helperText={this.state.helper_text[field_name]}>
                            <InputGroup type="text"
                                           onChange={(event)=>this._onFieldChange(field_name, event.target.value)}
                                           style={{width: 250}}
                                           large={true}
                                           fill={false}
                                           placeholder={field_name}
                                           value={this.state.fields[field_name]}
                                           />
                </FormGroup>
        ));
        let outer_style = {textAlign:"center",
            marginLeft: 50,
            marginTop: 50,
            height: "100%"};
        return (

            <React.Fragment>
                <div className="d-flex flex-column" style={outer_style}>
                    <form onSubmit={e => {
                              e.preventDefault();
                              this._submit_duplicate_info();
                            }}>
                        {field_items}
                     <div className="d-flex flex-row">
                        <Button icon="log-in" large={true} text="Submit" onClick={this._submit_duplicate_info}/>
                     </div>
                    </form>
                </div>
            </React.Fragment>
        )
    }
}

_duplicate_main();
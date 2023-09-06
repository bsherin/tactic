
import "../tactic_css/tactic.scss";

import React from "react";
import { Fragment, useState, useEffect, useRef, memo, useContext } from "react";
import * as ReactDOM from 'react-dom'

import { FormGroup, InputGroup, Button } from "@blueprintjs/core";

import {doFlash, withStatus, StatusContext} from "./toaster"
import {postAjax} from "./communication_react";
import {guid} from "./utilities_react";
import {TacticNavbar, get_theme_cookie} from "./blueprint_navbar";
import { useCallbackStack, useStateAndRef } from "./utilities_react";
import {withTheme, ThemeContext} from "./theme";

window.page_id = guid();
var tsocket;

function _login_main() {
    if (window._show_message) doFlash(window._message);
    let domContainer = document.querySelector('#root');
    let useDark = get_theme_cookie() == "dark";
    let LoginAppPlus = withTheme(withStatus(LoginApp));
    ReactDOM.render(<LoginAppPlus tsocket={null} controlled={false} initial_dark={useDark}/>, domContainer)
}

function LoginApp(props) {
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [username_warning_text, set_username_warning_text] = useState("");
    const [password_warning_text, set_password_warning_text] = useState("");
    const theme = useContext(ThemeContext);
    const statusFuncs = useContext(StatusContext);
    const pushCallback = useCallbackStack();

    const inputRef = useRef(null);

    useEffect(()=>{
        inputRef.current.focus()
    }, []);

    function _onUsernameChange(event) {
        setUsername(event.target.value)
    }

    function _onPasswordChange(event) {
        setPassword(event.target.value)
    }

    function _submit_login_info() {
        statusFuncs.setStatus({show_spinner: true, status_message: "Attempting login ..."});
        const data = {};
        if (username == "") {
            set_username_warning_text("Username cannot be empty");
            return
        }
        if (password == "") {
            set_password_warning_text("Password cannot be empty");
            return
        }
        data.username = username;
        data.password = password;
        data.remember_me = true;
        var x = new Date();
        data.tzOffset = x.getTimezoneOffset() / 60;
        postAjax("attempt_login", data, _return_from_submit_login)
    }

    function _return_from_submit_login(data) {
        console.log("returned from attempt login with data.login " + String(data.logged_in));
        statusFuncs.clearStatus();
        if (data.logged_in) {
             window.open($SCRIPT_ROOT + window._next_view, "_self")
        }
        else {
            set_password_warning_text("Login failed");
        }
    }

    function _refHandler(the_ref) {
        inputRef.current = the_ref;
    }

    let outer_class = "login-body d-flex flex-column justify-content-center";
    if (theme.dark_theme) {
        outer_class = outer_class + " bp5-dark";
    }
    else {
        outer_class = outer_class + " light-theme"
    }
    return (
        <Fragment>
                <TacticNavbar is_authenticated={window.is_authenticated}
                              selected={null}
                              show_api_links={false}
                              page_id={window.page_id}
                              user_name={window.username}/>
                <div className={outer_class} style={{textAlign:"center", height: "100%"}}>
                    <div id="status-area"></div>
                    <div className="d-flex flex-row justify-content-around">
                        <img className="mb-4"
                             src={window.tactic_img_url}
                             alt="" width="72" height="72"/>
                     </div>
                     <div className="d-flex flex-row justify-content-around">
                        <h4>Please sign in</h4>
                    </div>
                    <form onSubmit={e => {
                              e.preventDefault();
                              _submit_login_info();
                            }}>
                        <FormGroup className="d-flex flex-row justify-content-around"
                                      helperText={username_warning_text}
                        >
                            <InputGroup type="text"
                                           onChange={_onUsernameChange}
                                           large={true}
                                           fill={false}
                                           placeholder="Username"
                                           autoCapitalize="none"
                                           autoCorrect="off"
                                           inputRef={_refHandler}
                                           />
                        </FormGroup>
                        <FormGroup className="d-flex flex-row justify-content-around"
                                      helperText={password_warning_text}
                        >
                            <InputGroup type="password"
                                           onChange={_onPasswordChange}
                                           large={true}
                                           fill={false}
                                           placeholder="Password"
                                           autoCapitalize="none"
                                           autoCorrect="off"
                           />
                        </FormGroup>
                         <div className="d-flex flex-row justify-content-around">
                            <Button icon="log-in" large={true} type="submit" text="Sign in"/>
                         </div>
                    </form>
                </div>
        </Fragment>
    )
}

LoginApp = memo(LoginApp);

_login_main();
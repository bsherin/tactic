import {render_navbar} from "./blueprint_navbar.js";
import {doFlash, withStatus} from "./toaster.js"
import {postAjax} from "./communication_react.js";

let Bp = blueprint;

function _login_main() {
    render_navbar();
    stopSpinner();
    if (window._show_message) doFlash(window._message);
    let domContainer = document.querySelector('#root');
    ReactDOM.render(<LoginAppWithStatus/>, domContainer)
}

class LoginApp extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
        this.state = {
            username: null,
            password: null,
            username_warning_text: "",
            password_warning_text: "",
        }
    }

    _onUsernameChange(event) {
        this.setState({username: event.target.value})
    }

    _onPasswordChange(event) {
        this.setState({password: event.target.value})
    }

    _submit_login_info() {
        this.props.setStatus({show_spinner: true, status_message: "Attempting login ..."});
        const data = {};
        if (this.state.username == "") {
            this.setState({username_warning_text: "Username cannot be empty"});
            return
        }
        if (this.state.password == "") {
            this.setState({password_warning_text: "Password cannot be empty"});
            return
        }
        data.username = this.state.username;
        data.password = this.state.password;
        data.remember_me = true;
        var x = new Date();
        data.tzOffset = x.getTimezoneOffset() / 60;
        postAjax("attempt_login", data, this._return_from_submit_login)
    }

    _return_from_submit_login(data) {
        this.props.clearStatus();
        if (data.logged_in) {
             window.open($SCRIPT_ROOT + window._next_view, "_self")
        }
        else {
            this.setState({password_warning_text: "Login failed"});
        }
    }

    render () {

        return (
            <React.Fragment>
                <div className="d-flex flex-column justify-content-center" style={{textAlign:"center", height: "100%"}}>
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
                              this._submit_login_info();
                            }}>
                        <Bp.FormGroup className="d-flex flex-row justify-content-around"
                                      helperText={this.state.username_warning_text}
                        >
                            <Bp.InputGroup type="text"
                                           onChange={this._onUsernameChange}
                                           large={true}
                                           fill={false}
                                           placeholder="Username"
                                           />
                        </Bp.FormGroup>
                        <Bp.FormGroup className="d-flex flex-row justify-content-around"
                                      helperText={this.state.password_warning_text}
                        >
                            <Bp.InputGroup type="password"
                                           onChange={this._onPasswordChange}
                                           large={true}
                                           fill={false}
                                           placeholder="Password"
                           />
                        </Bp.FormGroup>
                         <div className="d-flex flex-row justify-content-around">
                            <Bp.Button icon="log-in" large={true} type="submit" text="Sign in"/>
                         </div>
                    </form>
                </div>
            </React.Fragment>
        )
    }
}

var LoginAppWithStatus = withStatus(LoginApp);

_login_main();
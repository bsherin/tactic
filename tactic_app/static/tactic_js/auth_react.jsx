import {render_navbar} from "./base_module.js";

var Rbs = window.ReactBootstrap;

function _login_main() {
    render_navbar();
    let domContainer = document.querySelector('#login-root');
    ReactDOM.render(<LoginApp/>, domContainer)
}

class LoginApp extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this)
    }

    render () {

        return (
            <div className="body-outer" style={{textAlign:"center"}}>
                <div id="status-area"></div>
                <Rbs.Form>
                    <img className="mb-4"
                         src={window.tactic_img_url}
                         alt="" width="72" height="72"/>
                    <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
                    <Rbs.Form.Label>Username</Rbs.Form.Label>
                    <Rbs.Form.Control as="input" placeholder="Username" autoComplete="new-password">
                    </Rbs.Form.Control>

                </Rbs.Form>
            </div>
        )
    }
}
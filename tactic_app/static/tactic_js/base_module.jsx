

export {render_navbar}

var Rbs = window.ReactBootstrap;


let library_url = $SCRIPT_ROOT + '/library';
let repository_url = $SCRIPT_ROOT + '/repository';
let account_url = $SCRIPT_ROOT + '/account_info';
let login_url = $SCRIPT_ROOT + "/login";

class TacticNavbar extends React.Component {
    handle_signout () {
            doSignOut(window.page_id)
    }

    render () {

        let authenticated_items = (
            <React.Fragment>
                <Rbs.Nav.Item>
                    <Rbs.Nav.Link href={library_url}>
                        My Resources
                    </Rbs.Nav.Link>
                </Rbs.Nav.Item>
                <Rbs.Nav.Item>
                    <Rbs.Nav.Link href={repository_url}>
                        Repository
                    </Rbs.Nav.Link>
                </Rbs.Nav.Item>
                <Rbs.Nav.Item>
                    <Rbs.Nav.Link href={account_url}>
                        {this.props.user_name}
                    </Rbs.Nav.Link>
                </Rbs.Nav.Item>
                <Rbs.Nav.Item>
                    <Rbs.Nav.Link onClick={this.handle_signout}>
                        Logout
                    </Rbs.Nav.Link>
                </Rbs.Nav.Item>
            </React.Fragment>
        );

        let not_authenticated_items = (
            <Rbs.Nav.Item>
                    <Rbs.Nav.Link href={login_url}>
                        Login
                    </Rbs.Nav.Link>
            </Rbs.Nav.Item>
        );


        return (
            <Rbs.Navbar bg="light" expand="lg" variant="light">
                <Rbs.Navbar.Brand href="/">
                    <img className="mr-2" src={window.tactic_img_url} alt="" width="32 " height="32"/>
                     Tactic
                </Rbs.Navbar.Brand>
                <Rbs.Navbar.Collapse id="collapse-area" className="justify-content-end">
                    <Rbs.Nav >
                        <Rbs.Nav.Link href="http://tactic.readthedocs.io/en/latest/index.html">
                            Docs
                        </Rbs.Nav.Link>
                        {this.props.is_authenticated && authenticated_items}
                    </Rbs.Nav>
                </Rbs.Navbar.Collapse>

            </Rbs.Navbar>
        )
    }
}

TacticNavbar.propTypes={
    is_authenticated: PropTypes.bool,
    img_url: PropTypes.string,
    user_name: PropTypes.string
};

function render_navbar () {
    let domContainer = document.querySelector('#navbar-root');
    ReactDOM.render(<TacticNavbar is_authenticated={window.is_authenticated}
                                  user_name={window.username}/>, domContainer)
}


export {render_navbar, TacticNavbar}

var Rbs = window.ReactBootstrap;
var Bp = blueprint;

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
                <Bp.Button icon="home" minimal={true} text="My Resources" onClick={()=>{
                        window.open(library_url)
                    }}/>
                <Bp.Button icon="database" minimal={true} text="Repository" onClick={()=>{
                        window.open(repository_url)
                    }}/>
                <Bp.Button icon="settings" minimal={true} text={this.props.user_name} onClick={()=>{
                        window.open(account_url)
                    }}/>
                <Bp.Button icon="log-out" minimal={true} text="Logout" onClick={this.handle_signout}/>
            </React.Fragment>
        );

        let not_authenticated_items = (
            <Bp.Button icon="log-in" minimal={true} text="Login" onClick={()=>{
                        window.open(login_url)
                    }}/>
        );

        let nav_class = this.props.menus == null ? "justify-content-end" : "justify-content-between";
        return (
            <Bp.Navbar>
                <Bp.Navbar.Group align={Bp.Alignment.LEFT}>
                <Bp.Navbar.Heading>
                    <img className="mr-2" src={window.tactic_img_url} alt="" width="32 " height="32"/>
                     Tactic
                </Bp.Navbar.Heading>

                    {this.props.menus != null &&
                        <Rbs.Nav id="menu-area">
                            {this.props.menus}
                        </Rbs.Nav>
                    }
                </Bp.Navbar.Group>
                <Bp.Navbar.Group align={Bp.Alignment.RIGHT}>
                <Bp.NavbarDivider />
                    <Bp.Button icon="manual" minimal={true} text="docs" onClick={()=>{
                        window.open("http://tactic.readthedocs.io/en/latest/index.html")
                    }}/>
                    {this.props.is_authenticated && authenticated_items}
                    {!this.props.is_authenticated && not_authenticated_items}
                </Bp.Navbar.Group>
            </Bp.Navbar>
        )
    }
}

TacticNavbar.propTypes = {
    is_authenticated: PropTypes.bool,
    img_url: PropTypes.string,
    user_name: PropTypes.string,
    menus: PropTypes.object
};

TacticNavbar.defaultProps = {
    menus: null
};

function render_navbar () {
    let domContainer = document.querySelector('#navbar-root');
    ReactDOM.render(<TacticNavbar is_authenticated={window.is_authenticated}
                                  user_name={window.username}/>, domContainer)
}
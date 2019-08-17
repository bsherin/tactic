
import {Toolbar} from "./react_toolbar.js"
import {TacticSocket} from "./tactic_socket.js"
import {showConfirmDialogReact} from "./modal_react.js";

import {render_navbar} from "./base_module.js";

var Rbs = window.ReactBootstrap;

import {AdminPane} from "./administer_pane.js"

const MARGIN_SIZE = 17;

let tsocket;

function _administer_home_main () {
    render_navbar();
    tsocket = new LibraryTacticSocket("library", 5000);
    let domContainer = document.querySelector('#library-home-root');
    ReactDOM.render(<AdministerHomeApp/>, domContainer)
}

class LibraryTacticSocket extends TacticSocket {

    initialize_socket_stuff() {

        this.socket.emit('join', {"user_id":  window.user_id, "library_id":  window.library_id});

        this.socket.on("window-open", (data) => window.open(`${$SCRIPT_ROOT}/load_temp_page/${data["the_id"]}`));

        this.socket.on('handle-callback', handleCallback);
        this.socket.on('stop-spinner', stopSpinner);
        this.socket.on('start-spinner', startSpinner);
        this.socket.on('show-status-msg', statusMessage);
        this.socket.on("clear-status-msg", clearStatusMessage);
        this.socket.on('close-user-windows', (data) => {
            if (!(data["originator"] == window.library_id)) {
                window.close()
            }
        });
        this.socket.on('doflash', doFlash);
    }
}


class AdministerHomeApp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            "usable_width": window.innerWidth - 2 * MARGIN_SIZE - 30,
            "usable_height": window.innerHeight - 50
        };
        doBinding(this);
    }

    componentDidMount() {
        window.addEventListener("resize", this._update_window_dimensions);
        this.setState({"mounted": true});
        this._update_window_dimensions();
        stopSpinner()
    }

    _update_window_dimensions() {
        this.setState({
            "usable_width": window.innerWidth - 2 * MARGIN_SIZE - 30,
            "usable_height": window.innerHeight - 50
        });
    }

    render () {
        let nav_items = [["containers"], ["users"]].map((data)=>(
            <Rbs.Nav.Item key={data[0]}>
                <Rbs.Nav.Link eventKey={data[0] + "-pane"}>
                    <span className="um-nav-text">{data[0]}</span>
                </Rbs.Nav.Link>
            </Rbs.Nav.Item>
        ));
        return (
            <React.Fragment>
                <Rbs.Tab.Container id="the_container" defaultActiveKey="containers-pane">
                    <div id="repository_container" className="d-flex flex-row">
                        <div className="d-flex flex-column justify-content-between left-vertical-nav"
                             style={{"marginTop": 100}}>
                            <Rbs.Nav variant="pills" className="flex-column">
                                {nav_items}
                            </Rbs.Nav>
                        </div>
                        <div className="d-flex flex-column ml-5">
                            <Rbs.Tab.Content>
                                <Rbs.Tab.Pane eventKey="containers-pane">
                                    <AdminPane usable_height={this.state.usable_height}
                                               usable_width={this.state.usable_width}
                                               res_type="container"
                                               allow_search_inside={false}
                                               allow_search_metadata={false}
                                               is_repository={false}
                                               ToolbarClass={ContainerToolbar}
                                               tsocket={tsocket}
                                               colnames={["Id", "Other_name", "Name", "Image", "Owner", "Status", "Created"]}
                                               id_field="Id"
                                />
                                </Rbs.Tab.Pane>
                                <Rbs.Tab.Pane eventKey="users-pane">
                                    <AdminPane usable_height={this.state.usable_height}
                                                 usable_width={this.state.usable_width}
                                                 res_type="user"
                                                 allow_search_inside={false}
                                                 allow_search_metadata={false}
                                                 is_repository={false}
                                                 ToolbarClass={UserToolbar}
                                                 tsocket={tsocket}
                                                 colnames={["_id", "username", "full_name", "last_login", "email"]}
                                                 id_field="_id"
                                    />
                                </Rbs.Tab.Pane>
                            </Rbs.Tab.Content>
                        </div>
                    </div>
                </Rbs.Tab.Container>
            </React.Fragment>
        )
    }
}

class AdminToolbar extends React.Component {

    prepare_button_groups() {
        let new_bgs = [];
        let new_group;
        let new_button;
        for (let group of this.props.button_groups) {
            new_group = [];
            for (let button of group) {
                if (!this.props.multi_select || button[3]) {
                    new_button = {name_text: button[0],
                        click_handler: button[1],
                        icon_name: button[2],
                        multi_select: button[3]};
                    new_group.push(new_button)
                }
            }
            if (new_group.length != 0) {
                new_bgs.push(new_group)
            }

        }
        return new_bgs
    }

    render() {
       return <Toolbar button_groups={this.prepare_button_groups()}
                       file_adders={null}
                       popup_buttons={null}
       />
    }
}

AdminToolbar.propTypes = {
    button_groups: PropTypes.array,
};


class ContainerToolbar extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
    }


    _container_logs () {
        let cont_id = this.props.selected_resource.Id;
        let self = this;
        $.getJSON($SCRIPT_ROOT + '/container_logs/' + cont_id, function (data) {
            self.props.setConsoleText(data.log_text)
        });
    }

    _clear_user_func (event) {
        startSpinner();
        $.getJSON($SCRIPT_ROOT + '/clear_user_containers/' + window.library_id, doFlashStopSpinner);
    }

    reset_server_func (event) {
        startSpinner();
        $.getJSON($SCRIPT_ROOT + '/reset_server/' + library_id, doFlashStopSpinner);
    }

    _destroy_container () {
        startSpinner();
        let cont_id = this.props.selected_resource.Id;
        let self = this;
        $.getJSON($SCRIPT_ROOT + '/kill_container/' + cont_id, (data) => {
                doFlashStopSpinner(data);
                if (data.success) {
                    self.props.animation_phase(() => {
                        self.props.delete_row(cont_id);
                    })
                }
            }
        );
        stopSpinner();

    }

    get button_groups() {
        return [
            [["reset", this.reset_server_func, "recycle", false],
                ["killall", this._clear_user_func, "skull", false],
                ["killone", this._destroy_container, "exclamation-triangle", false]
            ],
            [["log", this._container_logs, "file-alt", false],
            ["refresh", this.props.refresh_func, "sync-alt", false]]

        ];
     }

     render () {
        return <AdminToolbar button_groups={this.button_groups}/>
     }
}

ContainerToolbar.propTypes = {
    selected_resource: PropTypes.object,
    list_of_selected: PropTypes.array,
    setConsoleText: PropTypes.func,
    animation_phase: PropTypes.func,
    delete_row: PropTypes.func,
    refresh_func: PropTypes.func

};

class UserToolbar extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
    }

    _delete_user () {
        let user_id = this.props.selected_resource._id;
        const confirm_text = "Are you sure that you want to delete user " + String(user_id) + "?";
        showConfirmDialogReact("Delete User", confirm_text, "do nothing", "delete", function () {
            $.getJSON($SCRIPT_ROOT + '/delete_user/' + user_id, doFlash);
        });
    }

    _update_user_starters (event) {
        let user_id = this.props.selected_resource._id;
        const confirm_text = "Are you sure that you want to update starter tiles for user " + String(user_id) + "?";
        showConfirmDialogReact("Update User", confirm_text, "do nothing", "update", function () {
            $.getJSON($SCRIPT_ROOT + '/update_user_starter_tiles/' + user_id, doFlash);
        });
    }


    _migrate_user (event) {
        let user_id = this.props.selected_resource._id;
        const confirm_text = "Are you sure that you want to migrate user " + String(user_id) + "?";
        showConfirmDialogReact("Migrate User", confirm_text, "do nothing", "migrate", function () {
            $.getJSON($SCRIPT_ROOT + '/migrate_user/' + user_id, doFlash);
        });
    }

    _create_user (event) {
        window.open($SCRIPT_ROOT + '/register');
    }

    _duplicate_user (event) {
        window.open($SCRIPT_ROOT + '/user_duplicate');
    }

    _update_all_collections (event) {
        window.open($SCRIPT_ROOT + '/update_all_collections');
    }

    get button_groups() {
        return [
            [["create", this._create_user, "user", false],
                ["duplicate", this._duplicate_user, "copy", false],
                ["delete", this._delete_user, "skull", false],
                ["update", this._update_user_starters, "recycle", false],
                ["refresh", this.props.refresh_func, "sync-alt", false]
            ]
        ];
     }

     render () {
        return <AdminToolbar button_groups={this.button_groups}/>
     }
}

UserToolbar.propTypes = {
    selected_resource: PropTypes.object,
    list_of_selected: PropTypes.array,
    setConsoleText: PropTypes.func,
    animation_phase: PropTypes.func,
    delete_row: PropTypes.func,
    refresh_func: PropTypes.func

};


_administer_home_main();
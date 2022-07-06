
import "../tactic_css/tactic.scss";
import "../tactic_css/tactic_table.scss";
import "../tactic_css/library_home.scss";

import React from "react";
import * as ReactDOM from 'react-dom'
import PropTypes from 'prop-types';

import { Tabs, Tab, Tooltip, Icon, Position } from "@blueprintjs/core";
import {Regions} from "@blueprintjs/table";

import {TacticSocket} from "./tactic_socket.js"
import {showConfirmDialogReact} from "./modal_react.js";
import {doFlash} from "./toaster.js"
import {render_navbar} from "./blueprint_navbar.js";
import {handleCallback}  from "./communication_react.js"
import {withStatus} from "./toaster.js";


import {AdminPane} from "./administer_pane.js"
import {SIDE_MARGIN, USUAL_TOOLBAR_HEIGHT, getUsableDimensions} from "./sizing_tools.js";
import {ViewerContext} from "./resource_viewer_context.js";
import {withErrorDrawer} from "./error_drawer.js";
import {doBinding, guid} from "./utilities_react.js";
import {LibraryMenubar} from "./library_menubars";

window.library_id = guid();
const MARGIN_SIZE = 17;

let tsocket;

function _administer_home_main () {
    render_navbar("library");
    tsocket = new TacticSocket("main", 5000, window.library_id);
    let AdministerHomeAppPlus = withErrorDrawer(withStatus(AdministerHomeApp));
    let domContainer = document.querySelector('#library-home-root');
    ReactDOM.render(<AdministerHomeAppPlus tsocket={tsocket}/>, domContainer)
}

var res_types = ["container", "user"];

var col_names = {
    container: ["Id", "Other_name", "Name", "Image", "Owner", "Status", "Uptime"],
    user: ["_id", "username", "full_name", "last_login", "email", "alt_id", "status"]
};

function NamesToDict (acc, item) {
    acc[item] = "";
    return acc;
}

class AdministerHomeApp extends React.Component {

    constructor(props) {
        super(props);
        let aheight = getUsableDimensions().usable_height_no_bottom;
        let awidth = getUsableDimensions().usable_width - 170;
        this.state = {
            selected_tab_id: "containers-pane",
            usable_width: awidth,
            usable_height: aheight,
            pane_states: {}
        };
        for (let res_type of res_types) {
            this.state.pane_states[res_type] = {
                left_width_fraction: .65,
                selected_resource: col_names[res_type].reduce(NamesToDict, {}),
                tag_button_state: {
                    expanded_tags: [],
                    active_tag: "all",
                    tree: []
                },
                console_text: "",
                search_from_field: false,
                search_from_tag: false,
                sort_field: "updated",
                sorting_field: "updated_for_sort",
                sort_direction: "descending",
                multi_select: false,
                list_of_selected: [],
                search_string: "",
                search_inside: false,
                search_metadata: false,
                selectedRegions: [Regions.row(0)]
            }
        }
        this.top_ref = React.createRef();
        doBinding(this);
        this.initSocket();
    }

    initSocket() {
        this.props.tsocket.attachListener("window-open", (data) => window.open(`${$SCRIPT_ROOT}/load_temp_page/${data["the_id"]}`));
        this.props.tsocket.attachListener('handle-callback', handleCallback);
        this.props.tsocket.attachListener('close-user-windows', (data) => {
            if (!(data["originator"] == window.library_id)) {
                window.close()
            }
        });
        this.props.tsocket.attachListener('doflash', doFlash);
    }

    componentDidMount() {
        window.addEventListener("resize", this._update_window_dimensions);
        this.setState({"mounted": true});
        this._update_window_dimensions();
        this.props.stopSpinner()
    }

    _updatePaneState (res_type, state_update, callback=null) {
        let old_state = Object.assign({}, this.state.pane_states[res_type]);
        let new_pane_states = Object.assign({}, this.state.pane_states);
        new_pane_states[res_type] = Object.assign(old_state, state_update);
        this.setState({pane_states: new_pane_states}, callback)
    }

    _update_window_dimensions() {
        let uwidth = window.innerWidth - 2 * SIDE_MARGIN;
        let uheight = window.innerHeight;
        if (this.top_ref && this.top_ref.current) {
            uheight = uheight - this.top_ref.current.offsetTop;
        }
        else {
            uheight = uheight - USUAL_TOOLBAR_HEIGHT
        }
        this.setState({usable_height: uheight, usable_width: uwidth})
    }

    _handleTabChange(newTabId, prevTabId, event) {
        this.setState({selected_tab_id: newTabId}, this._update_window_dimensions)
    }

    getIconColor(paneId) {
        return paneId == this.state.selected_tab_id ? "white" : "#CED9E0"
    }

    render () {
        let container_pane = (
            <AdminPane {...this.props}
                       res_type="container"
                       allow_search_inside={false}
                       allow_search_metadata={false}
                       MenubarClass={ContainerMenubar}
                       updatePaneState={this._updatePaneState}
                       {...this.state.pane_states["container"]}
                       {...this.props.errorDrawerFuncs}
                       errorDrawerFuncs={this.props.errorDrawerFuncs}
                       tsocket={tsocket}
                       colnames={col_names.container}
                       id_field="Id"

            />
        );
        let user_pane = (
            <AdminPane {...this.props}
                       res_type="user"
                       allow_search_inside={false}
                       allow_search_metadata={false}
                       MenubarClass={UserMenubar}
                       updatePaneState={this._updatePaneState}
                       {...this.state.pane_states["user"]}
                       {...this.props.errorDrawerFuncs}
                       errorDrawerFuncs={this.props.errorDrawerFuncs}
                       tsocket={tsocket}
                       colnames={col_names.user}
                       id_field="_id"

            />
        );
        let outer_style = {width: this.state.usable_width,
            height: this.state.usable_height,
            paddingLeft: 0
        };
        return (
            <ViewerContext.Provider value={{readOnly: false}}>
                <div className="pane-holder" ref={this.top_ref} style={outer_style}>
                    <Tabs id="the_container" style={{marginTop: 100}}
                             selectedTabId={this.state.selected_tab_id}
                             renderActiveTabPanelOnly={true}
                             vertical={true} large={true} onChange={this._handleTabChange}>
                        <Tab id="containers-pane" panel={container_pane}>
                            <Tooltip content="Containers" position={Position.RIGHT}>
                                <Icon icon="box" iconSize={20} tabIndex={-1} color={this.getIconColor("collections-pane")}/>
                            </Tooltip>
                        </Tab>
                        <Tab id="users-pane" panel={user_pane}>
                            <Tooltip content="users" position={Position.RIGHT}>
                                <Icon icon="user" iconSize={20} tabIndex={-1} color={this.getIconColor("collections-pane")}/>
                            </Tooltip>
                        </Tab>
                    </Tabs>
                </div>
            </ViewerContext.Provider>
        )
    }
}

class ContainerMenubar extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
    }
    
    _doFlashStopSpinner(data) {
        this.props.stopSpinner();
        doFlash(data)
    }


    _container_logs () {
        let cont_id = this.props.selected_resource.Id;
        let self = this;
        $.getJSON($SCRIPT_ROOT + '/container_logs/' + cont_id, function (data) {
            self.props.setConsoleText(data.log_text)
        });
    }

    _clear_user_func (event) {
        this.props.startSpinner();
        $.getJSON($SCRIPT_ROOT + '/clear_user_containers/' + window.library_id, this._doFlashStopSpinner);
    }

    _reset_server_func (event) {
        this.props.startSpinner();
        $.getJSON($SCRIPT_ROOT + '/reset_server/' + library_id, this._doFlashStopSpinner);
    }

    _destroy_container () {
        this.props.startSpinner();
        let cont_id = this.props.selected_resource.Id;
        let self = this;
        $.getJSON($SCRIPT_ROOT + '/kill_container/' + cont_id, (data) => {
                self._doFlashStopSpinner(data);
                if (data.success) {
                    self.props.delete_row(cont_id);
                }
            }
        );
        this.props.stopSpinner();

    }

     get menu_specs() {
        let self = this;
        let ms = {
            Danger: [
                {name_text: "Reset Host Container", icon_name: "reset",
                    click_handler: this._reset_server_func},
                {name_text: "Kill All User Containers", icon_name: "clean",
                    click_handler: this._clear_user_func},
                {name_text: "Kill One Container", icon_name: "console",
                    click_handler: this._destroy_container},
            ],
            Logs: [
                {name_text: "Show Container Log", icon_name: "delete",
                    click_handler: this._container_logs}
            ],

        };
        for (const [menu_name, menu] of Object.entries(ms)) {
            for (let but of menu) {
                but.click_handler = but.click_handler.bind(this)
            }
        }
        return ms
    }

     render () {
        return <LibraryMenubar menu_specs={this.menu_specs}
                               context_menu_items={null}
                               multi_select={false}
                               dark_theme={false}
                               controlled={false}
                               am_selected={false}
                               refreshTab={this.props.refresh_func}
                               closeTab={null}
                               resource_name=""
                               showErrorDrawerButton={false}
                               toggleErrorDrawer={null}
        />
     }
}

ContainerMenubar.propTypes = {
    selected_resource: PropTypes.object,
    list_of_selected: PropTypes.array,
    setConsoleText: PropTypes.func,
    delete_row: PropTypes.func,
    refresh_func: PropTypes.func

};

class UserMenubar extends React.Component {

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
    _bump_user_alt_id () {
        let user_id = this.props.selected_resource._id;
        const confirm_text = "Are you sure that you want to bump the id for user " + String(user_id) + "?";
        showConfirmDialogReact("Bump User", confirm_text, "do nothing", "bump", function () {
            $.getJSON($SCRIPT_ROOT + '/bump_one_alt_id/' + user_id, doFlash);
        });
    }

    _toggle_status () {
        let user_id = this.props.selected_resource._id;
        $.getJSON($SCRIPT_ROOT + '/toggle_status/' + user_id, doFlash);
    }

    _bump_all_alt_ids () {
        const confirm_text = "Are you sure that you want to bump all alt ids?";
        showConfirmDialogReact("Bump all", confirm_text, "do nothing", "bump", function () {
            $.getJSON($SCRIPT_ROOT + '/bump_all_alt_ids', doFlash);
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
        let username = this.props.selected_resource.username;
        window.open($SCRIPT_ROOT + '/user_duplicate/' + username);
    }

    _update_all_collections (event) {
        window.open($SCRIPT_ROOT + '/update_all_collections');
    }

    get button_groups() {
        return [
            [["create", this._create_user, "new-object", false, "Create user"],
                // ["duplicate", this._duplicate_user, "duplicate", false],
                ["delete", this._delete_user, "delete", false, "Delete user", "Delete user"],
                // ["update", this._update_user_starters, "automatic-updates", false, "],
                ["refresh", this.props.refresh_func, "refresh", false, "Refresh"]
            ]
        ];
     }

     get menu_specs() {
        let self = this;
        let ms = {
            Manage: [
                {name_text: "Create User", icon_name: "new-object",
                    click_handler: this._create_user},
                {name_text: "Toggle Status", icon_name: "exchange",
                    click_handler: this._toggle_status},
                {name_text: "Delete User", icon_name: "delete",
                    click_handler: this._delete_user},
                {name_text: "Bump Alt Id", icon_name: "reset",
                    click_handler: this._bump_user_alt_id},
                {name_text: "Bump All Alt Ids", icon_name: "reset",
                    click_handler: this._bump_all_alt_ids},
            ]
        };
        for (const [menu_name, menu] of Object.entries(ms)) {
            for (let but of menu) {
                but.click_handler = but.click_handler.bind(this)
            }
        }
        return ms
    }


     render () {
        return <LibraryMenubar menu_specs={this.menu_specs}
                               context_menu_items={null}
                               multi_select={false}
                               dark_theme={false}
                               controlled={false}
                               am_selected={false}
                               refreshTab={this.props.refresh_func}
                               closeTab={null}
                               resource_name=""
                               showErrorDrawerButton={false}
                               toggleErrorDrawer={null}
        />
     }
}

UserMenubar.propTypes = {
    selected_resource: PropTypes.object,
    list_of_selected: PropTypes.array,
    setConsoleText: PropTypes.func,
    delete_row: PropTypes.func,
    refresh_func: PropTypes.func

};

_administer_home_main();
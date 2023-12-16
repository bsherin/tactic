
import "../tactic_css/tactic.scss";
import "../tactic_css/tactic_table.scss";
import "../tactic_css/library_home.scss";

import React, {Fragment} from "react";
import {useState, useEffect, useRef, memo, useContext} from "react";
import * as ReactDOM from 'react-dom'
import PropTypes from 'prop-types';

import { Tabs, Tab, Tooltip, Icon, Position } from "@blueprintjs/core";
import {Regions} from "@blueprintjs/table";

import {TacticSocket} from "./tactic_socket"
import {doFlash} from "./toaster"
import {TacticNavbar} from "./blueprint_navbar";
import {handleCallback}  from "./communication_react"
import {withStatus} from "./toaster";
import {withDialogs} from "./modal_react";


import {AdminPane} from "./administer_pane"
import {SIDE_MARGIN, USUAL_TOOLBAR_HEIGHT, getUsableDimensions} from "./sizing_tools";
import {ViewerContext} from "./resource_viewer_context";
import {withErrorDrawer} from "./error_drawer";
import {guid} from "./utilities_react";
import {LibraryMenubar} from "./library_menubars";
import {useCallbackStack, useStateAndRef} from "./utilities_react";

import {ThemeContext, withTheme} from "./theme";
import {DialogContext} from "./modal_react";
import {StatusContext} from "./toaster"

window.library_id = guid();
const MARGIN_SIZE = 17;

let tsocket;

function _administer_home_main () {
    tsocket = new TacticSocket("main", 5000, "admin", window.library_id);
    let AdministerHomeAppPlus = withTheme(withDialogs(withErrorDrawer(withStatus(AdministerHomeApp))));
    let domContainer = document.querySelector('#library-home-root');
    ReactDOM.render(<AdministerHomeAppPlus tsocket={tsocket} initial_theme={window.theme}/>, domContainer)
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

var initial_pane_states = {};
for (let res_type of res_types) {
    initial_pane_states[res_type] = {
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

function AdministerHomeApp(props) {

    const [selected_tab_id, set_selected_tab_id] = useState();
    const [pane_states, set_pane_states, pane_states_ref] = useStateAndRef(initial_pane_states);

    const [usable_height, set_usable_height] = useState(getUsableDimensions(true).usable_height_no_bottom);
    const [usable_width, set_usable_width] = useState(getUsableDimensions(true).usable_width - 170);
    const theme = useContext(ThemeContext);
    const dialogFuncs = useContext(DialogContext);
    const statusFuncs = useContext(StatusContext);

    const top_ref = useRef(null);

    const pushCallback = useCallbackStack();


    useEffect(() => {
        initSocket();
        statusFuncs.stopSpinner();
        window.addEventListener("resize", _update_window_dimensions);
        _update_window_dimensions();
        return (() => {
            props.tsocket.disconnect()
        })
    }, []);

    function initSocket() {
        props.tsocket.attachListener("window-open", (data) => window.open(`${$SCRIPT_ROOT}/load_temp_page/${data["the_id"]}`));
        props.tsocket.attachListener('handle-callback', (task_packet) => {
            handleCallback(task_packet, window.library_id)
        });
        props.tsocket.attachListener('close-user-windows', (data) => {
            if (!(data["originator"] == window.library_id)) {
                window.close()
            }
        });
        props.tsocket.attachListener('doflashUser', doFlash);
    }

    function _updatePaneState (res_type, state_update, callback=null) {
        let old_state = Object.assign({}, pane_states_ref.current[res_type]);
        let new_pane_states = Object.assign({}, pane_states_ref.current);
        new_pane_states[res_type] = Object.assign(old_state, state_update);
        set_pane_states(new_pane_states);
        pushCallback(callback)
    }

    function _update_window_dimensions() {
        let uwidth = window.innerWidth - 2 * SIDE_MARGIN;
        let uheight = window.innerHeight;
        if (top_ref && top_ref.current) {
            uheight = uheight - top_ref.current.offsetTop;
        }
        else {
            uheight = uheight - USUAL_TOOLBAR_HEIGHT
        }
        set_usable_height(uheight);
        set_usable_width(uwidth)
    }

    function _handleTabChange(newTabId, prevTabId, event) {
        set_selected_tab_id(newTabId);
        pushCallback(_update_window_dimensions)
    }

    function getIconColor(paneId) {
        return paneId == selected_tab_id ? "white" : "#CED9E0"
    }

    let container_pane = (
        <AdminPane {...props}
                   usable_width={usable_width}
                   usable_height={usable_height}
                   res_type="container"
                   allow_search_inside={false}
                   allow_search_metadata={false}
                   MenubarClass={ContainerMenubar}
                   updatePaneState={_updatePaneState}
                   {...pane_states_ref.current["container"]}
                   {...props.errorDrawerFuncs}
                   errorDrawerFuncs={props.errorDrawerFuncs}
                   tsocket={tsocket}
                   colnames={col_names.container}
                   id_field="Id"

        />
    );
    let user_pane = (
        <AdminPane {...props}
                   usable_width={usable_width}
                   usable_height={usable_height}
                   res_type="user"
                   allow_search_inside={false}
                   allow_search_metadata={false}
                   MenubarClass={UserMenubar}
                   updatePaneState={_updatePaneState}
                   {...pane_states_ref.current["user"]}
                   {...props.errorDrawerFuncs}
                   errorDrawerFuncs={props.errorDrawerFuncs}
                   tsocket={tsocket}
                   colnames={col_names.user}
                   id_field="_id"

        />
    );
    let outer_style = {
        width: "100%",
        height: usable_height,
        paddingLeft: 0
    };
    let outer_class = "pane-holder";
    if (theme.dark_theme) {
        outer_class = `${outer_class} bp5-dark`;
    } else {
        outer_class = `${outer_class} light-theme`;
    }
    return (
        <Fragment>
            <TacticNavbar is_authenticated={window.is_authenticated}
                          selected={null}
                          show_api_links={false}
                          extra_text=""
                          page_id={window.library_id}
                          user_name={window.username}/>
            <ViewerContext.Provider value={{readOnly: false}}>
                <div className={outer_class} ref={top_ref} style={outer_style}>
                    <Tabs id="the_container" style={{marginTop: 100}}
                             selectedTabId={selected_tab_id}
                             renderActiveTabPanelOnly={true}
                             vertical={true} large={true} onChange={_handleTabChange}>
                        <Tab id="containers-pane" panel={container_pane}>
                            <Tooltip content="Containers" position={Position.RIGHT}>
                                <Icon icon="box" size={20} tabIndex={-1} color={getIconColor("collections-pane")}/>
                            </Tooltip>
                        </Tab>
                        <Tab id="users-pane" panel={user_pane}>
                            <Tooltip content="users" position={Position.RIGHT}>
                                <Icon icon="user" size={20} tabIndex={-1} color={getIconColor("collections-pane")}/>
                            </Tooltip>
                        </Tab>
                    </Tabs>
                </div>
            </ViewerContext.Provider>
        </Fragment>
    )
}

AdministerHomeApp = memo(AdministerHomeApp);

function ContainerMenubar(props) {

    const statusFuncs = useContext(StatusContext);

    function _doFlashStopSpinner(data) {
        statusFuncs.stopSpinner();
        doFlash(data)
    }

    function _container_logs () {
        let cont_id = props.selected_resource.Id;
        $.getJSON($SCRIPT_ROOT + '/container_logs/' + cont_id, function (data) {
            props.setConsoleText(data.log_text)
        });
    }

    function _clear_user_func (event) {
        statusFuncs.startSpinner();
        $.getJSON($SCRIPT_ROOT + '/clear_user_containers', _doFlashStopSpinner);
    }

    function _reset_server_func (event) {
        statusFuncs.startSpinner();
        $.getJSON($SCRIPT_ROOT + '/reset_server/' + library_id, _doFlashStopSpinner);
    }

   function  _destroy_container () {
        statusFuncs.startSpinner();
        let cont_id = props.selected_resource.Id;
        $.getJSON($SCRIPT_ROOT + '/kill_container/' + cont_id, (data) => {
                _doFlashStopSpinner(data);
                if (data.success) {
                    props.delete_row(cont_id);
                }
            }
        );
        statusFuncs.stopSpinner();

    }

     function menu_specs() {
        return {
            Danger: [
                {name_text: "Reset Host Container", icon_name: "reset",
                    click_handler: _reset_server_func},
                {name_text: "Kill All User Containers", icon_name: "clean",
                    click_handler: _clear_user_func},
                {name_text: "Kill One Container", icon_name: "console",
                    click_handler: _destroy_container},
            ],
        };
    }
    return <LibraryMenubar menu_specs={menu_specs()}
                           context_menu_items={null}
                           multi_select={false}
                           controlled={false}
                           am_selected={false}
                           refreshTab={props.refresh_func}
                           closeTab={null}
                           resource_name=""
                           showErrorDrawerButton={false}
    />
}

ContainerMenubar.propTypes = {
    selected_resource: PropTypes.object,
    list_of_selected: PropTypes.array,
    setConsoleText: PropTypes.func,
    delete_row: PropTypes.func,
    refresh_func: PropTypes.func

};

ContainerMenubar = memo(ContainerMenubar);

function UserMenubar(props){
    const dialogFuncs = useContext(DialogContext);

    function _delete_user () {
        let user_id = props.selected_resource._id;
        let username = props.selected_resource.username;
        const confirm_text = `Are you sure that you want to delete user ${username} and all their data ?`;
        dialogFuncs.showModal("ConfirmDialog", {
            title: "Delete User",
            text_body: confirm_text,
            cancel_text: "do nothing",
            submit_text: "delete",
            handleSubmit: ()=>{
                $.getJSON($SCRIPT_ROOT + '/delete_user/' + user_id, doFlash);
            },
            handleClose: dialogFuncs.hideModal,
            handleCancel: null
        });
    }

    function _bump_user_alt_id () {
        let user_id = props.selected_resource._id;
        let username = props.selected_resource.username;
        const confirm_text = "Are you sure that you want to bump the id for user " + String(username) + "?  " +
            "This will effectively log them out";
        dialogFuncs.showModal("ConfirmDialog", {
            title: "Bump User",
            text_body: confirm_text,
            cancel_text: "do nothing",
            submit_text: "bump",
            handleSubmit: ()=>{
                $.getJSON($SCRIPT_ROOT + '/bump_one_alt_id/' + user_id, doFlash);
            },
            handleClose: dialogFuncs.hideModal,
            handleCancel: null
        });
    }

    function _toggle_status () {
        let user_id = props.selected_resource._id;
        $.getJSON($SCRIPT_ROOT + '/toggle_status/' + user_id, doFlash);
    }

    function _bump_all_alt_ids () {
        const confirm_text = "Are you sure that you want to bump all alt ids?" +
            "This will effectively log them out";
        dialogFuncs.showModal("ConfirmDialog", {
            title: "Bump all",
            text_body: confirm_text,
            cancel_text: "do nothing",
            submit_text: "bump",
            handleSubmit: ()=>{
                $.getJSON($SCRIPT_ROOT + '/bump_all_alt_ids', doFlash);
            },
            handleClose: dialogFuncs.hideModal,
            handleCancel: null
        });

    }

    // function _upgrade_all_users () {
    //     const confirm_text = "Are you sure that you want to upgrade all users?";
    //     showConfirmDialogReact("Bump all", confirm_text, "do nothing", "upgrade", function () {
    //         $.getJSON($SCRIPT_ROOT + '/upgrade_all_users', doFlash);
    //     });
    // }

    // function _remove_all_duplicates () {
    //     const confirm_text = "Are you sure that you want to remove all duplicates?";
    //     showConfirmDialogReact("Bump all", confirm_text, "do nothing", "remove", function () {
    //         $.getJSON($SCRIPT_ROOT + '/remove_all_duplicate_collections', doFlash);
    //     });
    // }
    //
    // function update_user_starters (event) {
    //     let user_id = props.selected_resource._id;
    //     const confirm_text = "Are you sure that you want to update starter tiles for user " + String(user_id) + "?";
    //     showConfirmDialogReact("Update User", confirm_text, "do nothing", "update", function () {
    //         $.getJSON($SCRIPT_ROOT + '/update_user_starter_tiles/' + user_id, doFlash);
    //     });
    // }
    //
    // function _migrate_user (event) {
    //     let user_id = props.selected_resource._id;
    //     const confirm_text = "Are you sure that you want to migrate user " + String(user_id) + "?";
    //     showConfirmDialogReact("Migrate User", confirm_text, "do nothing", "migrate", function () {
    //         $.getJSON($SCRIPT_ROOT + '/migrate_user/' + user_id, doFlash);
    //     });
    // }

    function _create_user (event) {
        window.open($SCRIPT_ROOT + '/register');
    }

    function _duplicate_user (event) {
        let username = props.selected_resource.username;
        window.open($SCRIPT_ROOT + '/user_duplicate/' + username);
    }

    function _update_all_collections (event) {
        window.open($SCRIPT_ROOT + '/update_all_collections');
    }

     function menu_specs() {
        return {
            Manage: [
                {name_text: "Create User", icon_name: "new-object",
                    click_handler: _create_user},
                {name_text: "Toggle Status", icon_name: "exchange",
                    click_handler: _toggle_status},
                {name_text: "Delete User", icon_name: "delete",
                    click_handler: _delete_user},
                {name_text: "Bump Alt Id", icon_name: "reset",
                    click_handler: _bump_user_alt_id},
                {name_text: "Bump All Alt Ids", icon_name: "reset",
                    click_handler: _bump_all_alt_ids},
                // {name_text: "Upgrade all users", icon_name: "reset",
                //     click_handler: _upgrade_all_users},
                // {name_text: "Remove All Duplicates", icon_name: "reset",
                //     click_handler: _remove_all_duplicates},
            ]
        };
    }

    return <LibraryMenubar menu_specs={menu_specs()}
                           context_menu_items={null}
                           multi_select={false}
                           controlled={false}
                           am_selected={false}
                           refreshTab={props.refresh_func}
                           closeTab={null}
                           resource_name=""
                           showErrorDrawerButton={false}
    />
}

UserMenubar.propTypes = {
    selected_resource: PropTypes.object,
    list_of_selected: PropTypes.array,
    setConsoleText: PropTypes.func,
    delete_row: PropTypes.func,
    refresh_func: PropTypes.func

};

UserMenubar = memo(UserMenubar);

_administer_home_main();

import "../tactic_css/tactic.scss";
import "../tactic_css/tactic_table.scss";
import "../tactic_css/library_home.scss";

import React, {Fragment} from "react";
import {useState, useEffect, useRef, memo, useContext} from "react";
import { createRoot } from 'react-dom/client';
import PropTypes from 'prop-types';

import {Tabs, Tab, Tooltip, Icon, Position, Slider, Label, FormGroup, Button, HTMLSelect} from "@blueprintjs/core";
import {Regions} from "@blueprintjs/table";

import {TacticSocket, useListeners} from "./tactic_socket"
import {doFlash} from "./toaster"
import {TacticNavbar} from "./blueprint_navbar";
import {handleCallback, postPromise} from "./communication_react"
import {withStatus} from "./toaster";
import {withDialogs} from "./modal_react";


import {AdminPane} from "./administer_pane"
import {ICON_BAR_WIDTH} from "./sizing_tools";
import {ViewerContext} from "./resource_viewer_context";
import {ErrorDrawerContext, withErrorDrawer} from "./error_drawer";
import {guid, withRegisterActivity} from "./utilities_react";
import {LibraryMenubar} from "./library_menubars";
import {useCallbackStack, useStateAndRef} from "./utilities_react";

import {SettingsContext, withSettings} from "./settings";
import {DialogContext} from "./modal_react";
import {StatusContext} from "./toaster"

window.global_id = "a" + guid();  // I don't know why pycharm doesn't like this

let tsocket;

function _administer_home_main () {
    tsocket = new TacticSocket("main", 5000, "admin", window.global_id, async () => {
        tsocket.attachListener('handle-callback', (task_packet) => {
            handleCallback(task_packet, window.global_id)
        });
        let AdministerHomeAppPlus = withRegisterActivity(withSettings(withDialogs(withErrorDrawer(withStatus(AdministerHomeApp)))));
        const domContainer = document.querySelector('#library-home-root');
        const root = createRoot(domContainer);
        root.render(<AdministerHomeAppPlus tsocket={tsocket}/>)
    })
}

const res_types = ["container", "user"];

const col_names = {
    container: ["Id", "Other_name", "Name", "Image", "Owner", "Status", "Uptime"],
    user: ["_id", "username", "full_name", "last_login", "email", "alt_id", "status"]
};

function NamesToDict (acc, item) {
    acc[item] = "";
    return acc;
}

const LOG_LEVELS = ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"];

let initial_pane_states = {};
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
    const [, set_pane_states, pane_states_ref] = useStateAndRef(initial_pane_states);

    const settingsContext = useContext(SettingsContext);
    const statusFuncs = useContext(StatusContext);

    const top_ref = useRef(null);

    const pushCallback = useCallbackStack();

    const dialogFuncs = useContext(DialogContext)

    useListeners(props.tsocket, initSocket);

    useEffect(() => {
        statusFuncs.stopSpinner();
    }, []);

    function initSocket(theSocket) {
        theSocket.attachListener("window-open", (data) => window.open(`${$SCRIPT_ROOT}/load_temp_page/${data["the_id"]}`));
        theSocket.attachListener('close-user-windows', (data) => {
            if (!(data["originator"] == window.global_id)) {
                window.close()
            }
        });
        theSocket.attachListener('doflashUser', doFlash);
        theSocket.attachListener("endSession", function () {
            dialogFuncs.showModal("EndSessionDialog", {})
        })
    }

    function _updatePaneState (res_type, state_update, callback=null) {
        let old_state = Object.assign({}, pane_states_ref.current[res_type]);
        let new_pane_states = Object.assign({}, pane_states_ref.current);
        new_pane_states[res_type] = Object.assign(old_state, state_update);
        set_pane_states(new_pane_states);
        pushCallback(callback)
    }

    function _updatePaneStatePromise(res_type, state_update) {
        return new Promise((resolve, )=>{
            _updatePaneState (res_type, state_update, resolve);
        })
    }

    function _handleTabChange(newTabId) {

        set_selected_tab_id(newTabId);
    }

    function getIconColor(paneId) {
        return paneId == selected_tab_id ? "white" : "#CED9E0"
    }

    let container_pane = (
        <AdminPane {...props}
                   res_type="container"
                   allow_search_inside={false}
                   allow_search_metadata={false}
                   MenubarClass={ContainerMenubar}
                   updatePaneState={_updatePaneState}
                   updatePaneStatePromise={_updatePaneStatePromise}
                   {...pane_states_ref.current["container"]}
                   tsocket={tsocket}
                   extraControls={<AWSControls />}
                   columns={col_names.container}
                   id_field="Id"

        />
    );
    let user_pane = (
        <AdminPane {...props}
                   res_type="user"
                   allow_search_inside={false}
                   allow_search_metadata={false}
                   MenubarClass={UserMenubar}
                   updatePaneState={_updatePaneState}
                   updatePaneStatePromise={_updatePaneStatePromise}
                   {...pane_states_ref.current["user"]}
                   tsocket={tsocket}
                   extraControls={null}
                   columns={col_names.user}
                   id_field="_id"

        />
    );
    let outer_style = {
        width: `calc(100% - ${ICON_BAR_WIDTH}px)`,
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: 0,
        position: "relative"
    };
    let outer_class = "pane-holder admin-pane";
    if (settingsContext.isDark()) {
        outer_class = `${outer_class} bp6-dark`;
    } else {
        outer_class = `${outer_class} light-theme`;
    }
    return (
        <Fragment>
            <TacticNavbar is_authenticated={window.is_authenticated}
                          selected={null}
                          show_api_links={false}
                          extra_text=""
                          user_name={window.username}/>
            <ViewerContext.Provider value={{readOnly: false}}>
                <div className={outer_class} ref={top_ref} style={outer_style}>
                    <Tabs id="admin-tabs" style={{marginTop: 100}}
                             selectedTabId={selected_tab_id}
                             renderActiveTabPanelOnly={true}
                             vertical={true} size="large" onChange={_handleTabChange}>
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

function AWSControls(props) {

    const [desiredIdle, setDesiredIdle] = useState(0);
    const [numberOfQueues, setNumberOfQueues] = useState(0);
    const [trueLogLevel, setTrueLogLevel] = useState("");
    const [redisLogLevel, setRedisLogLevel] = useState("");
    const errorDrawerFuncs = useContext(ErrorDrawerContext);

    async function grabDesiredIdle() {
        return postPromise("host", "get_desired_idle_tiles", {});
    }

    async function grabQueueCounnt() {
        return postPromise("host", "get_queue_count", {})
    }

    function updateQueueCount() {
        grabQueueCounnt()
            .then((data) => {
                if (data.success) {
                    setNumberOfQueues(data.target_value);
                } else {
                    errorDrawerFuncs.addFromError("Error getting queue count", data);
                }
            })
    }

    async function getLogLevelInfo() {
        return postPromise("host", "get_current_log_level", {})
    }

    function updateLogLevels() {
        getLogLevelInfo()
            .then((data) => {
                if (data.success) {
                    setTrueLogLevel(data["true_level"]);
                    setRedisLogLevel(data["redis_level"]);
                } else {
                    errorDrawerFuncs.addFromError("Error getting log level info", data);
                }
            })
    }

    useEffect(() => {
        grabDesiredIdle().then((data) => {
            if (data.success) {
                setDesiredIdle(data.target_value);
            } else {
                errorDrawerFuncs.addFromError("Error getting desired idle tiles", data);
            }
        })
        updateQueueCount()
        updateLogLevels()
    }, []);


    async function postDesiredIdle(newVal) {
        let data = await postPromise("host", "set_desired_idle_tiles", {target_value: newVal});
        if (!data.success) {
            errorDrawerFuncs.addFromError("Error setting desired idle tiles", data);
        }
        return data.success
    }


    async function onChange(newVal) {
        let oldVal = desiredIdle;
        if (newVal === oldVal) {
            return;
        }
        setDesiredIdle(newVal);
        let success = await postDesiredIdle(newVal);
        if (!success) {
            setDesiredIdle(oldVal);
        }
    }

    function onLogLevelSelected(newLevel) {
        if (newLevel === redisLogLevel) {
            return;
        }
        postPromise("host", "set_log_level_task", {target_level: newLevel})
            .then((data) => {
                if (!data.success) {
                    errorDrawerFuncs.addFromError("Error setting log level", data);
                } else {
                    updateLogLevels()
                }
            })
    }


    return (
        <div className="aws-controls" style={{display: "flex", flexDirection: "column", width: 300, margin: 25}}>
            <h4>AWS Controls</h4>
            <div style={{width: 300}}>
                <Label>
                    Desired Idle Tiles: {desiredIdle}
                    <Slider
                        onChange={onChange}
                        min={0}
                        max={50}
                        stepSize={1}
                        labelStepSize={10}
                        value={desiredIdle}
                    />
                </Label>
                <FormGroup label="Number of Queues" className="metadata-form_group" inline={true}>
                    <span style={{lineHeight: "30px"}} className="bp6-ui-text metadata-field">{String(numberOfQueues)}</span>
                    <Button style={{marginLeft: 10}} onClick={updateQueueCount} icon="refresh"/>
                </FormGroup>
                <div style={{display: "inline-flex"}}><h5 style={{marginBottom: 8}}>LogLevel</h5>
                    <Button style={{marginLeft: 10}} onClick={updateLogLevels} icon="refresh"/></div>
                <HTMLSelect options={LOG_LEVELS}
                        onChange={(e)=>{onLogLevelSelected(e.currentTarget.value)}}
                        value={redisLogLevel}/>
                <div className="bp6-ui-text metadata-field">True: {String(trueLogLevel)}</div>
                <div className="bp6-ui-text metadata-field">Redis: {String(redisLogLevel)}</div>
            </div>
        </div>
    )
}

function ContainerMenubar(props) {

    const statusFuncs = useContext(StatusContext);
    const errorDrawerFuncs = useContext(ErrorDrawerContext);

    function _doFlashStopSpinner(data) {
        statusFuncs.stopSpinner();
        doFlash(data)
    }

    async function _clear_user_func () {
        statusFuncs.startSpinner();
        let data = await postPromise("host", 'clear_user_containers_task', {});
        _doFlashStopSpinner(data)
    }

    async function _reset_server_func () {
        statusFuncs.startSpinner();
        let data = await postPromise("host", "reset_server_task", {});
         _doFlashStopSpinner(data)
    }

   async function  _destroy_container () {
        statusFuncs.startSpinner();
        let cont_id = props.selected_resource.Id;
        try {
            let data = await postPromise("host", 'kill_container_task', {cont_id});
            _doFlashStopSpinner(data);
            props.delete_row(cont_id);
        }
        catch (e) {
            errorDrawerFuncs.addFromError("Error destroying container", e);
            statusFuncs.stopSpinner();
        }
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
    const statusFuncs = useContext(StatusContext);
    const errorDrawerFuncs = useContext(ErrorDrawerContext);

    function _delete_user () {
        let true_id = props.selected_resource._id;
        let username = props.selected_resource.username;
        const confirm_text = `Are you sure that you want to delete user ${username} and all their data ?`;
        dialogFuncs.showModal("ConfirmDialog", {
            title: "Delete User",
            text_body: confirm_text,
            cancel_text: "do nothing",
            submit_text: "delete",
            handleSubmit: async ()=>{
                postPromise("host", "delete_user_task", {true_id})
                    .then(doFlash)
            },
            handleClose: dialogFuncs.hideModal,
            handleCancel: null
        });
    }

    async function createSeedDatabase() {
        statusFuncs.startSpinner();
        try {
            let data = await postPromise("host", 'create_seed_database_task', {});
            if (data["success"]) {
                doFlash(data);
                statusFuncs.startSpinner();
            }
            else {
                statusFuncs.stopSpinner();
                errorDrawerFuncs.addFromError("Error creating seed database", data);
            }
        }
        catch (e) {
            errorDrawerFuncs.addFromError("Error creating database", e);
            statusFuncs.stopSpinner();
        }
    }

    function _create_seed_database () {
        const confirm_text = `Are you sure that you want to create the seed database?`;
        dialogFuncs.showModal("ConfirmDialog", {
            title: "Delete User",
            text_body: confirm_text,
            cancel_text: "do nothing",
            submit_text: "create",
            handleSubmit: createSeedDatabase,
            handleClose: dialogFuncs.hideModal,
            handleCancel: null
        });
    }

    async function dumpUserDatabase() {
        let user_id = props.selected_resource._id;
        statusFuncs.startSpinner();
        postPromise("host", "create_user_database", {user_id})
            .then((data) => {
                doFlash(data);
                statusFuncs.startSpinner();
            })
            .catch((e) => {
                errorDrawerFuncs.addFromError("Error creating user database", e);
                statusFuncs.stopSpinner();
            }
        )
    }

    function _dump_user_database () {

        let username = props.selected_resource.username;
        const confirm_text = "Do you want to dump a database for " + String(username) + "?  ";
        dialogFuncs.showModal("ConfirmDialog", {
            title: "Bump User",
            text_body: confirm_text,
            cancel_text: "do nothing",
            submit_text: "create",
            handleSubmit: dumpUserDatabase,
            handleClose: dialogFuncs.hideModal,
            handleCancel: null
        });
    }

    function _bump_user_alt_id () {
        let true_id = props.selected_resource._id;
        let username = props.selected_resource.username;
        const confirm_text = "Are you sure that you want to bump the id for user " + String(username) + "?  " +
            "This will effectively log them out";
        dialogFuncs.showModal("ConfirmDialog", {
            title: "Bump User",
            text_body: confirm_text,
            cancel_text: "do nothing",
            submit_text: "bump",
            handleSubmit: async ()=>{
                postPromise("host", "bump_one_alt_id_task", {true_id})
                    .then(doFlash)
            },
            handleClose: dialogFuncs.hideModal,
            handleCancel: null
        });
    }

    async function _toggle_status () {
        let user_id = props.selected_resource._id;
        postPromise("host", "toggle_user_status_task", {true_id: user_id})
            .then(doFlash);
    }

    function _bump_all_alt_ids () {
        const confirm_text = "Are you sure that you want to bump all alt ids?" +
            "This will effectively log them out";
        dialogFuncs.showModal("ConfirmDialog", {
            title: "Bump all",
            text_body: confirm_text,
            cancel_text: "do nothing",
            submit_text: "bump",
            handleSubmit: async ()=>{
                postPromise("host", "bump_all_alt_ids_task", {})
                    .then(doFlash);
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

    function _create_user () {
        window.open($SCRIPT_ROOT + '/register');
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
                {name_text: "Create Seed Database", icon_name: "database",
                    click_handler: _create_seed_database},
                {name_text: "Dump a User's Database", icon_name: "database",
                    click_handler: _dump_user_database},
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
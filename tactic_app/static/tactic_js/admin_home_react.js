var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import "../tactic_css/tactic.scss";
import "../tactic_css/tactic_table.scss";
import "../tactic_css/library_home.scss";

import React from "react";
import * as ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { Tabs, Tab, Tooltip, Icon, Position } from "@blueprintjs/core";
import { Regions } from "@blueprintjs/table";

import { Toolbar } from "./blueprint_toolbar.js";
import { TacticSocket } from "./tactic_socket.js";
import { showConfirmDialogReact } from "./modal_react.js";
import { doFlash } from "./toaster.js";
import { render_navbar } from "./blueprint_navbar.js";
import { handleCallback } from "./communication_react.js";
import { withStatus } from "./toaster.js";

import { AdminPane } from "./administer_pane.js";
import { SIDE_MARGIN, USUAL_TOOLBAR_HEIGHT, getUsableDimensions } from "./sizing_tools.js";
import { ViewerContext } from "./resource_viewer_context.js";
import { withErrorDrawer } from "./error_drawer.js";
import { doBinding, guid } from "./utilities_react.js";

window.library_id = guid();
window.page_id = window.library_id;
const MARGIN_SIZE = 17;

let tsocket;

function _administer_home_main() {
    render_navbar("library");
    tsocket = new LibraryTacticSocket("library", 5000);
    let AdministerHomeAppPlus = withErrorDrawer(withStatus(AdministerHomeApp, tsocket), tsocket);
    let domContainer = document.querySelector('#library-home-root');
    ReactDOM.render(React.createElement(AdministerHomeAppPlus, null), domContainer);
}

class LibraryTacticSocket extends TacticSocket {

    initialize_socket_stuff() {

        this.socket.emit('join', { "user_id": window.user_id, "library_id": window.library_id });

        this.socket.on("window-open", data => window.open(`${$SCRIPT_ROOT}/load_temp_page/${data["the_id"]}`));
        this.socket.on('handle-callback', handleCallback);
        this.socket.on('close-user-windows', data => {
            if (!(data["originator"] == window.library_id)) {
                window.close();
            }
        });
        this.socket.on('doflash', doFlash);
    }
}

var res_types = ["container", "user"];

var col_names = {
    container: ["Id", "Other_name", "Name", "Image", "Owner", "Status", "Created"],
    user: ["_id", "username", "full_name", "last_login", "email"]
};

function NamesToDict(acc, item) {
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
                sorting_column: "updated",
                sorting_field: "updated_for_sort",
                sorting_direction: "descending",
                multi_select: false,
                list_of_selected: [],
                search_field_value: "",
                search_inside_checked: false,
                search_metadata_checked: false,
                selectedRegions: [Regions.row(0)]
            };
        }
        this.state.pane_states.container.selected_resource = this.top_ref = React.createRef();
        doBinding(this);
    }

    componentDidMount() {
        window.addEventListener("resize", this._update_window_dimensions);
        this.setState({ "mounted": true });
        this._update_window_dimensions();
        this.props.stopSpinner();
    }

    _updatePaneState(res_type, state_update, callback = null) {
        let old_state = Object.assign({}, this.state.pane_states[res_type]);
        let new_pane_states = Object.assign({}, this.state.pane_states);
        new_pane_states[res_type] = Object.assign(old_state, state_update);
        this.setState({ pane_states: new_pane_states }, callback);
    }

    _update_window_dimensions() {
        let uwidth = window.innerWidth - 2 * SIDE_MARGIN;
        let uheight = window.innerHeight;
        if (this.top_ref && this.top_ref.current) {
            uheight = uheight - this.top_ref.current.offsetTop;
        } else {
            uheight = uheight - USUAL_TOOLBAR_HEIGHT;
        }
        this.setState({ usable_height: uheight, usable_width: uwidth });
    }

    _handleTabChange(newTabId, prevTabId, event) {
        this.setState({ selected_tab_id: newTabId }, this._update_window_dimensions);
    }

    getIconColor(paneId) {
        return paneId == this.state.selected_tab_id ? "white" : "#CED9E0";
    }

    render() {
        let container_pane = React.createElement(AdminPane, _extends({}, this.props, {
            res_type: "container",
            allow_search_inside: false,
            allow_search_metadata: false,
            ToolbarClass: ContainerToolbar,
            updatePaneState: this._updatePaneState
        }, this.state.pane_states["container"], this.props.errorDrawerFuncs, {
            errorDrawerFuncs: this.props.errorDrawerFuncs,
            tsocket: tsocket,
            colnames: col_names.container,
            id_field: "Id"

        }));
        let user_pane = React.createElement(AdminPane, _extends({}, this.props, {
            res_type: "user",
            allow_search_inside: false,
            allow_search_metadata: false,
            ToolbarClass: UserToolbar,
            updatePaneState: this._updatePaneState
        }, this.state.pane_states["user"], this.props.errorDrawerFuncs, {
            errorDrawerFuncs: this.props.errorDrawerFuncs,
            tsocket: tsocket,
            colnames: col_names.user,
            id_field: "_id"

        }));
        let outer_style = { width: this.state.usable_width,
            height: this.state.usable_height,
            paddingLeft: 0
        };
        return React.createElement(
            ViewerContext.Provider,
            { value: { readOnly: false } },
            React.createElement(
                "div",
                { className: "pane-holder", ref: this.top_ref, style: outer_style },
                React.createElement(
                    Tabs,
                    { id: "the_container", style: { marginTop: 100 },
                        selectedTabId: this.state.selected_tab_id,
                        renderActiveTabPanelOnly: true,
                        vertical: true, large: true, onChange: this._handleTabChange },
                    React.createElement(
                        Tab,
                        { id: "containers-pane", panel: container_pane },
                        React.createElement(
                            Tooltip,
                            { content: "Containers", position: Position.RIGHT },
                            React.createElement(Icon, { icon: "box", iconSize: 20, tabIndex: -1, color: this.getIconColor("collections-pane") })
                        )
                    ),
                    React.createElement(
                        Tab,
                        { id: "users-pane", panel: user_pane },
                        React.createElement(
                            Tooltip,
                            { content: "users", position: Position.RIGHT },
                            React.createElement(Icon, { icon: "user", iconSize: 20, tabIndex: -1, color: this.getIconColor("collections-pane") })
                        )
                    )
                )
            )
        );
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
                    new_button = { name_text: button[0],
                        click_handler: button[1],
                        icon_name: button[2],
                        multi_select: button[3] };
                    new_group.push(new_button);
                }
            }
            if (new_group.length != 0) {
                new_bgs.push(new_group);
            }
        }
        return new_bgs;
    }

    render() {
        let outer_style = {
            display: "flex",
            flexDirection: "row",
            position: "relative",
            left: this.props.left_position,
            marginBottom: 10
        };
        return React.createElement(Toolbar, { button_groups: this.prepare_button_groups(),
            file_adders: null,
            alternate_outer_style: outer_style,
            sendRef: this.props.sendRef,
            popup_buttons: null
        });
    }
}

AdminToolbar.propTypes = {
    button_groups: PropTypes.array,
    left_position: PropTypes.number,
    sendRef: PropTypes.func
};

class ContainerToolbar extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
    }

    _doFlashStopSpinner(data) {
        this.props.stopSpinner();
        doFlash(data);
    }

    _container_logs() {
        let cont_id = this.props.selected_resource.Id;
        let self = this;
        $.getJSON($SCRIPT_ROOT + '/container_logs/' + cont_id, function (data) {
            self.props.setConsoleText(data.log_text);
        });
    }

    _clear_user_func(event) {
        this.props.startSpinner();
        $.getJSON($SCRIPT_ROOT + '/clear_user_containers/' + window.library_id, this._doFlashStopSpinner);
    }

    _reset_server_func(event) {
        this.props.startSpinner();
        $.getJSON($SCRIPT_ROOT + '/reset_server/' + library_id, this._doFlashStopSpinner);
    }

    _destroy_container() {
        this.props.startSpinner();
        let cont_id = this.props.selected_resource.Id;
        let self = this;
        $.getJSON($SCRIPT_ROOT + '/kill_container/' + cont_id, data => {
            self._doFlashStopSpinner(data);
            if (data.success) {
                self.props.delete_row(cont_id);
            }
        });
        this.props.stopSpinner();
    }

    get button_groups() {
        return [[["reset", this._reset_server_func, "reset", false], ["killall", this._clear_user_func, "clean", false], ["killone", this._destroy_container, "delete", false]], [["log", this._container_logs, "console", false], ["refresh", this.props.refresh_func, "refresh", false]]];
    }

    render() {
        return React.createElement(AdminToolbar, { button_groups: this.button_groups,
            left_position: this.props.left_position,
            sendRef: this.props.sendRef
        });
    }
}

ContainerToolbar.propTypes = {
    selected_resource: PropTypes.object,
    list_of_selected: PropTypes.array,
    setConsoleText: PropTypes.func,
    delete_row: PropTypes.func,
    refresh_func: PropTypes.func

};

class UserToolbar extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
    }

    _delete_user() {
        let user_id = this.props.selected_resource._id;
        const confirm_text = "Are you sure that you want to delete user " + String(user_id) + "?";
        showConfirmDialogReact("Delete User", confirm_text, "do nothing", "delete", function () {
            $.getJSON($SCRIPT_ROOT + '/delete_user/' + user_id, doFlash);
        });
    }

    _update_user_starters(event) {
        let user_id = this.props.selected_resource._id;
        const confirm_text = "Are you sure that you want to update starter tiles for user " + String(user_id) + "?";
        showConfirmDialogReact("Update User", confirm_text, "do nothing", "update", function () {
            $.getJSON($SCRIPT_ROOT + '/update_user_starter_tiles/' + user_id, doFlash);
        });
    }

    _migrate_user(event) {
        let user_id = this.props.selected_resource._id;
        const confirm_text = "Are you sure that you want to migrate user " + String(user_id) + "?";
        showConfirmDialogReact("Migrate User", confirm_text, "do nothing", "migrate", function () {
            $.getJSON($SCRIPT_ROOT + '/migrate_user/' + user_id, doFlash);
        });
    }

    _create_user(event) {
        window.open($SCRIPT_ROOT + '/register');
    }

    _duplicate_user(event) {
        let username = this.props.selected_resource.username;
        window.open($SCRIPT_ROOT + '/user_duplicate/' + username);
    }

    _update_all_collections(event) {
        window.open($SCRIPT_ROOT + '/update_all_collections');
    }

    get button_groups() {
        return [[["create", this._create_user, "new-object", false], ["duplicate", this._duplicate_user, "duplicate", false], ["delete", this._delete_user, "delete", false], ["update", this._update_user_starters, "automatic-updates", false], ["refresh", this.props.refresh_func, "refresh", false]]];
    }

    render() {
        return React.createElement(AdminToolbar, { button_groups: this.button_groups,
            left_position: this.props.left_position,
            sendRef: this.props.sendRef
        });
    }
}

UserToolbar.propTypes = {
    selected_resource: PropTypes.object,
    list_of_selected: PropTypes.array,
    setConsoleText: PropTypes.func,
    delete_row: PropTypes.func,
    refresh_func: PropTypes.func

};

_administer_home_main();
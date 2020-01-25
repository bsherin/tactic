

import React from "react";
import PropTypes from 'prop-types';

import { ResizeSensor } from "@blueprintjs/core";

import { ResourceviewerToolbar } from "./blueprint_toolbar.js";
import { CombinedMetadata } from "./blueprint_mdata_fields.js";
import { showModalReact } from "./modal_react.js";
import { TacticSocket } from "./tactic_socket.js";
import { HorizontalPanes } from "./resizing_layouts.js";
import { handleCallback, postAjax } from "./communication_react.js";
import { doBinding } from "./utilities_react.js";

import { doFlash, doFlashAlways } from "./toaster.js";
import { getUsableDimensions } from "./sizing_tools.js";

export { ResourceViewerApp, ResourceViewerSocket, copyToLibrary, sendToRepository };

class ResourceViewerSocket extends TacticSocket {
    initialize_socket_stuff() {
        this.socket.emit('join', { "room": window.user_id });
        this.socket.emit('join-main', { "room": window.resource_viewer_id, "user_id": user_id });
        this.socket.on('handle-callback', handleCallback);
        this.socket.on('close-user-windows', data => {
            if (!(data["originator"] == window.resource_viewer_id)) {
                window.close();
            }
        });
        this.socket.on("doFlash", function (data) {
            doFlash(data);
        });
    }
}

function copyToLibrary(res_type, resource_name) {
    $.getJSON($SCRIPT_ROOT + `get_resource_names/${res_type}`, function (data) {
        showModal(`Import ${res_type}`, `New ${res_type} Name`, ImportResource, resource_name, data["resource_names"]);
    });
    function ImportResource(new_name) {
        const result_dict = {
            "res_type": res_type,
            "res_name": resource_name,
            "new_res_name": new_name
        };
        postAjax("copy_from_repository", result_dict, doFlashAlways);
    }
}

function sendToRepository(res_type, resource_name) {
    $.getJSON($SCRIPT_ROOT + `get_repository_resource_names/${res_type}`, function (data) {
        showModalReact(`Share ${res_type}`, `New ${res_type} Name`, ShareResource, resource_name, data["resource_names"]);
    });
    function ShareResource(new_name) {
        const result_dict = {
            "res_type": res_type,
            "res_name": resource_name,
            "new_res_name": new_name
        };
        postAjax("send_to_repository", result_dict, doFlashAlways);
    }
}

class ResourceViewerApp extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        this.savedContent = props.the_content;
        this.savedTags = props.tags;
        this.savedNotes = props.notes;
        let self = this;
        this.mousetrap = new Mousetrap();
        this.mousetrap.bind(['command+s', 'ctrl+s'], function (e) {
            self.props.saveMe();
            e.preventDefault();
        });
        let aheight = getUsableDimensions().usable_height;
        let awidth = getUsableDimensions().usable_width - 170;
        this.state = {
            available_height: aheight,
            available_width: awidth
        };
        this.state.mounted = false;
    }

    componentDidMount() {
        window.addEventListener("resize", this._update_window_dimensions);
        this.setState({ "mounted": true });
        this._update_window_dimensions();
        this.props.stopSpinner();
    }

    _update_window_dimensions() {
        this.setState(getUsableDimensions());
    }

    _handleResize(entries) {
        for (let entry of entries) {
            if (entry.target.className == "resource-viewer-holder") {
                this.setState({ available_width: entry.contentRect.width,
                    available_height: entry.contentRect.height
                });
                return;
            }
        }
    }

    render() {
        let left_pane = React.createElement(
            React.Fragment,
            null,
            React.createElement(ResourceviewerToolbar, { button_groups: this.props.button_groups,
                resource_name: this.props.resource_name,
                res_type: this.props.res_type }),
            this.props.children
        );
        //let available_height = this.get_new_hp_height(this.hp_ref);
        let right_pane = React.createElement(CombinedMetadata, { tags: this.props.tags,
            outer_style: { marginTop: 100, marginLeft: 20, overflow: "auto", padding: 15,
                backgroundColor: "#f5f8fa", marginRight: 20 },
            created: this.props.created,
            notes: this.props.notes,
            handleChange: this.props.handleStateChange,
            res_type: this.props.res_type });

        return React.createElement(
            ResizeSensor,
            { onResize: this._handleResize, observeParents: true },
            React.createElement(HorizontalPanes, { available_width: this.state.available_width,
                available_height: this.state.available_height,
                left_pane: left_pane,
                show_handle: true,
                right_pane: right_pane,
                am_outer: true
            })
        );
    }
}

ResourceViewerApp.propTypes = {
    resource_name: PropTypes.string,
    res_type: PropTypes.string,
    button_groups: PropTypes.array,
    created: PropTypes.string,
    tags: PropTypes.array,
    notes: PropTypes.string,
    handleStateChange: PropTypes.func,
    meta_outer: PropTypes.string,
    saveMe: PropTypes.func,
    children: PropTypes.element
};
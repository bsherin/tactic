

import React from "react";
import PropTypes from 'prop-types';

import { ResizeSensor} from "@blueprintjs/core";

import {CombinedMetadata} from "./blueprint_mdata_fields.js";
import {showModalReact} from "./modal_react.js";
import {HorizontalPanes} from "./resizing_layouts.js";
import {handleCallback, postAjax} from "./communication_react.js"
import {doBinding} from "./utilities_react.js";
import {TacticMenubar} from "./menu_utilities.js"

import {doFlash, doFlashAlways} from "./toaster.js";
import {SIDE_MARGIN} from "./sizing_tools.js"
import {SearchForm} from "./library_widgets";

export {ResourceViewerApp, copyToLibrary, sendToRepository}

function copyToLibrary(res_type, resource_name) {
    $.getJSON($SCRIPT_ROOT + `get_resource_names/${res_type}`, function(data) {
        showModalReact(`Import ${res_type}`, `New ${res_type} Name`, ImportResource, resource_name, data["resource_names"])
        }
    );
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
    $.getJSON($SCRIPT_ROOT + `get_repository_resource_names/${res_type}`, function(data) {
        showModalReact(`Share ${res_type}`, `New ${res_type} Name`, ShareResource, resource_name, data["resource_names"])
        }
    );
    function ShareResource(new_name) {
        const result_dict = {
            "res_type": res_type,
            "res_name": resource_name,
            "new_res_name": new_name
        };
        postAjax("send_to_repository", result_dict, doFlashAlways)
    }
}

class ResourceViewerApp extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        this.initSocket();
        this.top_ref = React.createRef();
        this.savedContent = props.the_content;
        this.savedTags = props.tags;
        this.savedNotes = props.notes;
        let self = this;
        this.state = {mounted: false};
    }

    initSocket() {
        let self = this;
        this.props.tsocket.attachListener('handle-callback', (task_packet)=>{
            handleCallback(task_packet, self.props.resource_viewer_id)
        });
        if (!this.props.controlled) {
            this.props.tsocket.attachListener('close-user-windows', (data) => {
                if (!(data["originator"] == self.props.resource_viewer_id)) {
                    window.close()
                }
            });
            this.props.tsocket.attachListener("doFlash", function (data) {
                doFlash(data)
            });
        }
    }

    componentDidMount() {
        this.setState({"mounted": true});
        // this._update_window_dimensions();
        this.props.stopSpinner()
    }

    render() {
        let left_pane = (
            <React.Fragment>
                {this.props.show_search &&
                    <div style={{display: "flex", justifyContent: "flex-end", marginBottom: 5, marginTop: 15}}>
                        <SearchForm
                            update_search_state={this.props.update_search_state}
                            search_string={this.props.search_string}
                            search_ref={this.props.search_ref}
                        />
                    </div>
                    }
                {this.props.children}
            </React.Fragment>
        );
        //let available_height = this.get_new_hp_height(this.hp_ref);

        let right_pane = (
            <React.Fragment>
                <CombinedMetadata tags={this.props.tags}
                                  outer_style={{marginTop: 0, marginLeft: 20, overflow: "auto", padding: 15,
                                                marginRight: 0, height: "100%"}}
                                  created={this.props.created}
                                  notes={this.props.notes}
                                  readOnly={this.props.readOnly}
                                  handleChange={this.props.handleStateChange}
                                  res_type={this.props.res_type} />
                </React.Fragment>
        );

        return(
            <React.Fragment>
                <TacticMenubar menu_specs={this.props.menu_specs}
                               dark_theme={this.props.dark_theme}
                               showRefresh={window.in_context}
                               showClose={window.in_context}
                               refreshTab={this.props.refreshTab}
                               closeTab={this.props.closeTab}
                               resource_name={this.props.resource_name}
                               showErrorDrawerButton={this.props.showErrorDrawerButton}
                               toggleErrorDrawer={this.props.toggleErrorDrawer}
                />
                <ResizeSensor onResize={this._handleResize} observeParents={true}>
                    <div ref={this.top_ref} style={{width: this.props.usable_width, height: this.props.usable_height, marginLeft: 15, marginTop: 0}}>
                       <HorizontalPanes available_width={this.props.usable_width - SIDE_MARGIN}
                                        available_height={this.props.usable_height}
                                        left_pane={left_pane}
                                        show_handle={true}
                                        right_pane={right_pane}
                                        initial_width_fraction={.65}
                                        am_outer={true}
                        />
                    </div>
                </ResizeSensor>
            </React.Fragment>
        )
    }
}

ResourceViewerApp.propTypes = {
    resource_name: PropTypes.string,
    setResourceNameState: PropTypes.func,
    refreshTab: PropTypes.func,
    closeTab: PropTypes.func,
    res_type: PropTypes.string,
    menu_specs: PropTypes.object,
    created: PropTypes.string,
    tags: PropTypes.array,
    notes: PropTypes.string,
    handleStateChange: PropTypes.func,
    meta_outer: PropTypes.string,
    dark_theme: PropTypes.bool,
    tsocket: PropTypes.object,
    saveMe: PropTypes.func,
    children: PropTypes.element,
    show_search: PropTypes.bool,
    update_search_state: PropTypes.func,
    search_ref: PropTypes.object,
    showErrorDrawerButton: PropTypes.bool,
    toggleErrorDrawer: PropTypes.func,
};

ResourceViewerApp.defaultProps ={
    showErrorDrawerButton: false,
    toggleErrorDrawer: null,
    dark_theme: false,
    am_selected: true,
    controlled: false,
    refreshTab: null,
    closeTab: null,
    search_ref: null
};

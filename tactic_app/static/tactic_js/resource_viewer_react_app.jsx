

import React from "react";
import PropTypes from 'prop-types';

import { ResizeSensor} from "@blueprintjs/core";

import {ResourceviewerToolbar} from "./blueprint_toolbar.js";
import {CombinedMetadata} from "./blueprint_mdata_fields.js";
import {showModalReact} from "./modal_react.js";
import {HorizontalPanes} from "./resizing_layouts.js";
import {handleCallback, postAjax} from "./communication_react.js"
import {doBinding} from "./utilities_react.js";
import {TopRightButtons} from "./blueprint_react_widgets.js";

import {doFlash, doFlashAlways} from "./toaster.js";
import {SIDE_MARGIN} from "./sizing_tools.js"
import {TacticContext} from "./tactic_context.js";

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

    constructor(props, context) {
        super(props, context);
        doBinding(this);
        this.initSocket();
        this.top_ref = React.createRef();
        this.savedContent = props.the_content;
        this.savedTags = props.tags;
        this.savedNotes = props.notes;
        let self = this;
        this.mousetrap = new Mousetrap();
        this.mousetrap.bind(['command+s', 'ctrl+s'], (e)=>{
            if (self.context.am_selected){
                self.props.saveMe();
                e.preventDefault()
            }
        });

        this.state = {mounted: false};
    }

    initSocket() {
        let self = this;
        this.context.tsocket.attachListener('handle-callback', (task_packet)=>{
            handleCallback(task_packet, self.props.resource_viewer_id)
        });
        if (!this.context.controlled) {
            this.context.tsocket.attachListener('close-user-windows', (data) => {
                if (!(data["originator"] == self.props.resource_viewer_id)) {
                    window.close()
                }
            });
            this.context.tsocket.attachListener("doFlash", function (data) {
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
                <ResourceviewerToolbar button_groups={this.props.button_groups}
                                       setResourceNameState={this.props.setResourceNameState}
                                       resource_name={this.props.resource_name}
                                       show_search={this.props.show_search}
                                       search_string={this.props.search_string}
                                       update_search_state={this.props.update_search_state}
                                       res_type={this.props.res_type}/>
                {this.props.children}
            </React.Fragment>
        );
        //let available_height = this.get_new_hp_height(this.hp_ref);

        let right_pane = (
            <React.Fragment>
                {window.in_context &&
                    <TopRightButtons refreshTab={this.props.refreshTab} closeTab={this.props.closeTab}/>
                }
                <CombinedMetadata tags={this.props.tags}
                                  outer_style={{marginTop: 90, marginLeft: 20, overflow: "auto", padding: 15,
                                                marginRight: 20}}
                                  created={this.props.created}
                                  notes={this.props.notes}
                                  handleChange={this.props.handleStateChange}
                                  res_type={this.props.res_type} />
                </React.Fragment>
        );

        return(
            <ResizeSensor onResize={this._handleResize} observeParents={true}>
                <div ref={this.top_ref} style={{width: this.props.usable_width, height: this.props.usable_height}}>
                   <HorizontalPanes available_width={this.props.usable_width - 2 * SIDE_MARGIN}
                                    available_height={this.props.usable_height}
                                    left_pane={left_pane}
                                    show_handle={true}
                                    right_pane={right_pane}
                                    am_outer={true}
                    />
                </div>
            </ResizeSensor>
        )
    }
}

ResourceViewerApp.propTypes = {
    resource_name: PropTypes.string,
    setResourceNameState: PropTypes.func,
    refreshTab: PropTypes.func,
    closeTab: PropTypes.func,
    res_type: PropTypes.string,
    button_groups: PropTypes.array,
    created: PropTypes.string,
    tags: PropTypes.array,
    notes: PropTypes.string,
    handleStateChange: PropTypes.func,
    meta_outer: PropTypes.string,
    dark_theme: PropTypes.bool,
    tsocket: PropTypes.object,
    saveMe: PropTypes.func,
    children: PropTypes.element
};

ResourceViewerApp.defaultProps ={
    dark_theme: false,
    am_selected: true,
    controlled: false,
    refreshTab: null,
    closeTab: null,
};

ResourceViewerApp.contextType = TacticContext;

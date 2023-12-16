import React from "react";
import PropTypes from 'prop-types';
import {Fragment, useState, useEffect, useRef, memo, useContext} from 'react';

import {KeyTrap} from "./key_trap";
import {CombinedMetadata} from "./blueprint_mdata_fields";
import {HorizontalPanes} from "./resizing_layouts";
import {handleCallback, postAjax} from "./communication_react"
import {TacticMenubar} from "./menu_utilities"
import {doFlash, StatusContext, messageOrError} from "./toaster";
import {SIDE_MARGIN} from "./sizing_tools"
import {SearchForm} from "./library_widgets";
import {useConnection} from "./utilities_react";
import {postAjaxPromise} from "./communication_react";

export {ResourceViewerApp, copyToLibrary, sendToRepository}

function copyToLibrary(res_type, resource_name, dialogFuncs, statusFuncs, errorDrawerFuncs) {
    $.getJSON($SCRIPT_ROOT + `get_resource_names/${res_type}`, function (data) {
            dialogFuncs.showModal("ModalDialog", {
                        title: `Import ${res_type}`,
                        field_title: `New ${res_type} Name`,
                        handleSubmit: ImportResource,
                        default_value: resource_name,
                        existing_names: data.resource_names,
                        checkboxes: [],
                        handleCancel: null,
                        handleClose: dialogFuncs.hideModal,
                    })
        }
    );

    function ImportResource(new_name) {
        const result_dict = {
            "res_type": res_type,
            "res_name": resource_name,
            "new_res_name": new_name
        };
        postAjax("copy_from_repository", result_dict, (data)=>{
            messageOrError(data, statusFuncs, errorDrawerFuncs)
        });
    }
}

function sendToRepository(res_type, resource_name, dialogFuncs, statusFuncs, errorDrawerFuncs) {
    $.getJSON($SCRIPT_ROOT + `get_repository_resource_names/${res_type}`, function (data) {
            dialogFuncs.showModal("ModalDialog", {
                        title: `Share ${res_type}`,
                        field_title: `New ${res_type} Name`,
                        handleSubmit: ShareResource,
                        default_value: resource_name,
                        existing_names: data.resource_names,
                        checkboxes: [],
                        handleCancel: null,
                        handleClose: dialogFuncs.hideModal,
                    })
        }
    );

    function ShareResource(new_name) {
        const result_dict = {
            "res_type": res_type,
            "res_name": resource_name,
            "new_res_name": new_name
        };
        postAjax("send_to_repository", result_dict, (data)=>{
            messageOrError(data, statusFuncs, errorDrawerFuncs)
        })
    }
}

function ResourceViewerApp(props) {

    const top_ref = useRef(null);
    const savedContent = useRef(props.the_content);
    const savedTags = useRef(props.split_tags);
    const savedNotes = useRef(props.notes);
    const key_bindings = useRef([]);
    const [all_tags, set_all_tags] = useState([]);

    const statusFuncs = useContext(StatusContext);

    // Only used when not in context
    const connection_status = useConnection(props.tsocket, initSocket);

    useEffect(() => {
        statusFuncs.stopSpinner();
    }, []);

    useEffect(() => {
        if (!props.readOnly) {
            let data_dict = {
                pane_type: props.res_type,
                is_repository: false,
                show_hidden: true
            };
            postAjaxPromise("get_tag_list", data_dict)
                .then(data => {
                    set_all_tags(data.tag_list)
                })
        }
    }, []);

    function initSocket() {
        props.tsocket.attachListener('handle-callback', (task_packet) => {
            handleCallback(task_packet, props.resource_viewer_id)
        });

        if (!props.controlled) {
            props.tsocket.attachListener('close-user-windows', (data) => {
                if (!(data["originator"] == props.resource_viewer_id)) {
                    window.close()
                }
            });
            props.tsocket.attachListener("doFlashUser", function (data) {
                doFlash(data)
            });
        }
    }

    let left_pane = (
        <Fragment>
            {props.show_search &&
                <div style={{display: "flex", justifyContent: "flex-end", marginBottom: 5, marginTop: 15}}>
                    <SearchForm
                        update_search_state={props.update_search_state}
                        search_string={props.search_string}
                        regex={props.regex}
                        search_ref={props.search_ref}
                        allow_regex={props.allow_regex_search}
                        number_matches={props.search_matches}
                    />
                </div>
            }
            {props.children}
        </Fragment>
    );

    let right_pane = (
        <CombinedMetadata tags={props.tags}
                          outer_style={{
                              marginTop: 0, marginLeft: 10, overflow: "auto", padding: 15,
                              marginRight: 0, height: "100%"
                          }}
                          all_tags={all_tags}
                          created={props.created}
                          notes={props.notes}
                          icon={props.mdata_icon}
                          readOnly={props.readOnly}
                          handleChange={props.handleStateChange}
                          pane_type={props.res_type}/>
    );

    return (
        <Fragment>
            <TacticMenubar menu_specs={props.menu_specs}
                           connection_status={connection_status}
                           showRefresh={window.in_context}
                           showClose={window.in_context}
                           refreshTab={props.refreshTab}
                           closeTab={props.closeTab}
                           resource_name={props.resource_name}
                           showErrorDrawerButton={props.showErrorDrawerButton}
            />
            <div ref={top_ref}
                 style={{width: props.usable_width, height: props.usable_height, marginLeft: 15, marginTop: 0}}>
                <HorizontalPanes available_width={props.usable_width - SIDE_MARGIN}
                                 available_height={props.usable_height}
                                 left_pane={left_pane}
                                 show_handle={true}
                                 right_pane={right_pane}
                                 initial_width_fraction={.65}
                                 am_outer={true}
                />
            </div>
            {!window.in_context &&
                <Fragment>
                    <KeyTrap global={true} bindings={key_bindings.current}/>
                </Fragment>
            }
        </Fragment>
    )
}

ResourceViewerApp = memo(ResourceViewerApp);

ResourceViewerApp.propTypes = {
    resource_name: PropTypes.string,
    search_string: PropTypes.string,
    search_matches: PropTypes.number,
    setResourceNameState: PropTypes.func,
    refreshTab: PropTypes.func,
    closeTab: PropTypes.func,
    res_type: PropTypes.string,
    menu_specs: PropTypes.object,
    created: PropTypes.string,
    tags: PropTypes.array,
    notes: PropTypes.string,
    mdata_icon: PropTypes.string,
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
    allow_regex_search: PropTypes.bool,
    regex: PropTypes.bool
};

ResourceViewerApp.defaultProps = {
    search_string: "",
    search_matches: null,
    showErrorDrawerButton: false,
    dark_theme: false,
    am_selected: true,
    controlled: false,
    refreshTab: null,
    closeTab: null,
    search_ref: null,
    allow_regex_search: false,
    regex: false,
    mdata_icon: null
};

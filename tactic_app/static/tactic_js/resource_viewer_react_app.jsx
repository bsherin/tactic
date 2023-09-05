import React from "react";
import PropTypes from 'prop-types';
import {Fragment, useState, useEffect, useRef, memo} from 'react';

import {TacticOmnibar} from "./TacticOmnibar";
import {KeyTrap} from "./key_trap";
import {CombinedMetadata} from "./blueprint_mdata_fields";
import {HorizontalPanes} from "./resizing_layouts.js";
import {handleCallback, postAjax} from "./communication_react.js"
import {TacticMenubar} from "./menu_utilities.js"
import {doFlash, doFlashAlways} from "./toaster.js";
import {SIDE_MARGIN} from "./sizing_tools.js"
import {SearchForm} from "./library_widgets";
import {useConstructor, useConnection} from "./utilities_react";

export {ResourceViewerApp, copyToLibrary, sendToRepository}

function copyToLibrary(res_type, resource_name, dialogFuncs) {
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
        postAjax("copy_from_repository", result_dict, doFlashAlways);
    }
}

function sendToRepository(res_type, resource_name, dialogFuncs) {
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
        postAjax("send_to_repository", result_dict, doFlashAlways)
    }
}

function ResourceViewerApp(props) {

    const top_ref = useRef(null);
    const savedContent = useRef(props.the_content);
    const savedTags = useRef(props.split_tags);
    const savedNotes = useRef(props.notes);
    const omniGetters = useRef({});
    const key_bindings = useRef([]);

    // Only used when not in context
    const [showOmnibar, setShowOmnibar] = useState(false);
    const connection_status = useConnection(props.tsocket, initSocket);

    useConstructor(() => {
        if (!window.in_context) {
            key_bindings.current = [
                [["ctrl+space"], _showOmnibar],
            ];
        }
    });

    useEffect(() => {
        props.stopSpinner();
        if (props.registerOmniFunction) {
            props.registerOmniFunction(_omniFunction);
        }
    }, []);

    function initSocket() {
        props.tsocket.attachListener('handle-callback', (task_packet) => {
            handleCallback(task_packet, props.resource_viewer_id)
        });
        props.tsocket.attachListener("doFlash", function (data) {
            doFlash(data)
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

    function _showOmnibar() {
        setShowOmnibar(true)
    }

    function _closeOmnibar() {
        setShowOmnibar(false)
    }

    function _omniFunction() {
        let omni_items = [];
        for (let ogetter in omniGetters.current) {
            omni_items = omni_items.concat(omniGetters.current[ogetter]())
        }
        return omni_items
    }

    function _registerOmniGetter(name, the_function) {
        omniGetters.current[name] = the_function
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
                           toggleErrorDrawer={props.toggleErrorDrawer}
                           registerOmniGetter={_registerOmniGetter}
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
                    <TacticOmnibar omniGetters={[_omniFunction]}
                                   showOmnibar={showOmnibar}
                                   closeOmnibar={_closeOmnibar}
                                   is_authenticated={window.is_authenticated}
                                   setTheme={props.setTheme}
                                   page_id={props.resource_viewer_id}
                    />
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
    toggleErrorDrawer: PropTypes.func,
    allow_regex_search: PropTypes.bool,
    regex: PropTypes.bool
};

ResourceViewerApp.defaultProps = {
    search_string: "",
    search_matches: null,
    showErrorDrawerButton: false,
    toggleErrorDrawer: null,
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

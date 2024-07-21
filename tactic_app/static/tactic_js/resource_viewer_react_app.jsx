import React from "react";
import {Fragment, useState, useEffect, useRef, memo, useContext} from 'react';

import {CombinedMetadata} from "./blueprint_mdata_fields";
import {HorizontalPanes} from "./resizing_layouts2";
import {handleCallback} from "./communication_react"
import {TacticMenubar} from "./menu_utilities"
import {doFlash, StatusContext} from "./toaster";
import {BOTTOM_MARGIN, SIDE_MARGIN, SizeContext, useSize} from "./sizing_tools"
import {SearchForm} from "./library_widgets";
import {useConnection} from "./utilities_react";
import {postAjaxPromise} from "./communication_react";

export {ResourceViewerApp, copyToLibrary, sendToRepository}

async function copyToLibrary(res_type, resource_name, dialogFuncs, statusFuncs, errorDrawerFuncs) {
    try {
        let data = await postAjaxPromise(`get_resource_names/${res_type}`);
        let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
            title: `Import ${res_type}`,
            field_title: `New ${res_type} Name`,
            default_value: resource_name,
            existing_names: data.resource_names,
            checkboxes: [],
            handleClose: dialogFuncs.hideModal,
        });
        const result_dict = {
            "res_type": res_type,
            "res_name": resource_name,
            "new_res_name": new_name
        };
        await postAjaxPromise("copy_from_repository", result_dict);
        statusFuncs.statusMessage(`Copied resource from repository`)
    }
    catch (e) {
        if (e != "canceled") {
            errorDrawerFuncs.addFromError(`Error copying from repository`, e)
        }
    }
}

async function sendToRepository(res_type, resource_name, dialogFuncs, statusFuncs, errorDrawerFuncs) {
    try {
        let data = await postAjaxPromise(`get_repository_resource_names/${res_type}`, {});
        let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
            title: `Share ${res_type}`,
            field_title: `New ${res_type} Name`,
            default_value: resource_name,
            existing_names: data.resource_names,
            checkboxes: [],
            handleClose: dialogFuncs.hideModal,
        });
        const result_dict = {
            "res_type": res_type,
            "res_name": resource_name,
            "new_res_name": new_name
        };
        await postAjaxPromise("send_to_repository", result_dict);
        statusFuncs.statusMessage(`Sent resource to repository`)
    }
    catch (e) {
        if (e != "canceled") {
            errorDrawerFuncs.addFromError(`Error sending to repository`, e)
        }
    }
}

const metadata_outer_style = {
  marginTop: 0, marginLeft: 10, overflow: "auto", padding: 25,
  marginRight: 0, height: "100%",
};

function ResourceViewerApp(props) {
    props = {
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
        mdata_icon: null,
        additional_metadata: null,
        ...props
    };

    const top_ref = useRef(null);
    const savedContent = useRef(props.the_content);
    const savedTags = useRef(props.split_tags);
    const savedNotes = useRef(props.notes);
    const [all_tags, set_all_tags] = useState([]);

    const statusFuncs = useContext(StatusContext);
    const sizeInfo = useContext(SizeContext);

    // Only used when not in context
    const connection_status = useConnection(props.tsocket, initSocket);

    const [usable_width, usable_height, topX, topY] = useSize(top_ref, 0, "ResourceViewer");

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
                          useTags={props.tags != null}
                          expandWidth={true}
                          outer_style={metadata_outer_style}
                          all_tags={all_tags}
                          created={props.created}
                          updated={props.updated}
                          notes={props.notes}
                          useNotes={props.notes != null}
                          icon={props.mdata_icon}
                          readOnly={props.readOnly}
                          handleChange={props.handleStateChange}
                          additional_metadata={props.additional_metadata}
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
                           showIconBar={true}
                           showMetadataDrawerButton={false}
                           showAssistantDrawerButton={true}
                           showErrorDrawerButton={true}
            />
            <div ref={top_ref}
                 style={{
                     width: usable_width,
                     height: usable_height,
                     marginLeft: 15, marginTop: 0}}>
                <HorizontalPanes left_pane={left_pane}
                                 show_handle={true}
                                 right_pane={right_pane}
                                 initial_width_fraction={.65}
                                 am_outer={true}
                                 bottom_margin={BOTTOM_MARGIN}
                                 right_margin={SIDE_MARGIN}
                />
            </div>
        </Fragment>
    )
}

ResourceViewerApp = memo(ResourceViewerApp);


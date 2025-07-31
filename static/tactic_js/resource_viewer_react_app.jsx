import React from "react";
import {Fragment, useEffect, useRef, memo, useContext} from 'react';

import {CombinedMetadata} from "./combined_metadata";
import {HorizontalPanes} from "./resizing_allotment";
import {handleCallback} from "./communication_react"
import {TacticMenubar} from "./menu_utilities"
import {doFlash, StatusContext} from "./toaster";
import {BOTTOM_MARGIN, SIDE_MARGIN} from "./sizing_tools"
import {useConnection} from "./utilities_react";
import {postAjaxPromise} from "./communication_react";

export {ResourceViewerApp, copyToLibrary, sendToRepository}

const PADDING = 20

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
  marginTop: 0, marginLeft: 0, overflow: "auto", padding: 25,
  marginRight: 0, height: "100%",
};

function ResourceViewerApp(props) {
    props = {
        search_string: "",
        padTop: false,
        search_matches: null,
        showErrorDrawerButton: false,
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

    const statusFuncs = useContext(StatusContext);

    // Only used when not in context
    const connection_status = useConnection(props.tsocket, initSocket);

    useEffect(() => {
        statusFuncs.stopSpinner();
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
            <div className={`resource-viewer-left-pane-holder ${props.padTop ? "top-padded" : ""}`}
                style={{
                    height: "100%", width: "100%",
                    position: "relative",
                    overflow: "auto", display: "flex", flexDirection: "column"}}>
                <div style={{
                    height: "100%", width: "100%",
                    position: "relative",
                    overflow: "auto", display: "flex", flexDirection: "column"}}>
                {props.children}
                </div>
            </div>
        </Fragment>
    );

    let right_pane = (
        <CombinedMetadata expandWidth={true}
                          tsocket={props.tsocket}
                          useTags={true}
                          useNotes={true}
                          readOnly={props.readOnly}
                          res_name={props.resource_name}
                          res_type={props.res_type}/>
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
                           showSettingsDrawerButton={true}
            />
            <div ref={top_ref}
                 className="resource-viewer-hp-holder"
                 style={{
                     display: "flex",
                     flexGrow: 1,
                     width: "100%",
                     position: "relative",
                     marginTop: 0}}>
                <HorizontalPanes left_pane={left_pane}
                                 show_handle={true}
                                 right_pane={right_pane}
                                 initial_width_fraction={.65}
                                 am_outer={true}
                />
            </div>
        </Fragment>
    )
}

ResourceViewerApp = memo(ResourceViewerApp);


import React from "react";
import {Fragment, useEffect, useRef, memo, useContext} from 'react';

import {CombinedMetadata} from "./combined_metadata";
import {HorizontalPanes} from "./resizing_allotment";
import {TacticMenubar} from "./menu_utilities"
import {doFlash, StatusContext} from "./toaster";
import {useConnection} from "./tactic_socket";
import {postPromise} from "./communication_react";
import {DialogContext} from "./modal_react";

export {ResourceViewerApp, copyToLibrary, sendToRepository}

async function copyToLibrary(res_type, resource_name, dialogFuncs, statusFuncs, errorDrawerFuncs) {
    try {
        let data = await postPromise("host", "get_resource_names_task", {res_type});
        let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
            title: `Import ${res_type}`,
            field_title: `New ${res_type} Name`,
            default_value: resource_name,
            existing_names: data.res_names,
            checkboxes: [],
            handleClose: dialogFuncs.hideModal,
        });
        const result_dict = {
            "res_type": res_type,
            "res_name": resource_name,
            "new_res_name": new_name
        };
        await postPromise("host", "copy_from_repository_task", result_dict);
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
        let data = await postPromise("host", "get_resource_names_task", {res_type, is_repository: true});
        let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
            title: `Share ${res_type}`,
            field_title: `New ${res_type} Name`,
            default_value: resource_name,
            existing_names: data.res_names,
            checkboxes: [],
            handleClose: dialogFuncs.hideModal,
        });
        const result_dict = {
            "res_type": res_type,
            "res_name": resource_name,
            "new_res_name": new_name
        };
        await postPromise("host", "send_to_repository_task", result_dict);
        statusFuncs.statusMessage(`Sent resource to repository`)
    }
    catch (e) {
        if (e != "canceled") {
            errorDrawerFuncs.addFromError(`Error sending to repository`, e)
        }
    }
}

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
    const dialogFuncs = useContext(DialogContext)

    // Only used when not in context
    const connection_status = useConnection(props.tsocket, initSocket);

    useEffect(() => {
        statusFuncs.stopSpinner();
    }, []);

    function initSocket(theSocket) {

        if (!props.controlled) {
            theSocket.attachListener('close-user-windows', (data) => {
                if (!(data["originator"] == window.global_id)) {
                    window.close()
                }
            });
            theSocket.attachListener("doFlashUser", function (data) {
                doFlash(data)
            });
            theSocket.attachListener("endSession", function () {
                dialogFuncs.showModal("EndSessionDialog", {})
            })
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
                     minHeight: 0,
                     minWidth: 0,
                     width: "100%",
                     position: "relative",
                     overflow: "hidden",
                     marginTop: 0}}>
                <HorizontalPanes left_pane={left_pane}
                                 show_handle={true}
                                 right_pane={right_pane}
                                 initial_width_fraction={.65}
                                 handleResizeEnd={null}
                                 am_outer={true}
                />
            </div>
        </Fragment>
    )
}

ResourceViewerApp = memo(ResourceViewerApp);


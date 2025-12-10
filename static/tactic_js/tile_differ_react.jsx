import "../tactic_css/tactic.scss";
import "../tactic_css/themeable.scss";

import React from "react";
import {Fragment, useState, useEffect, memo, useRef, useContext} from "react";
import { createRoot } from 'react-dom/client';
import {MergeViewerApp} from "./merge_viewer_app";
import {doFlash, StatusContext} from "./toaster"
import {handleCallback, postPromise, postWithCallback} from "./communication_react"
import {ErrorDrawerContext, withErrorDrawer} from "./error_drawer";
import {withStatus} from "./toaster";
import {guid, useStateAndRef, useCallbackStack, withRegisterActivity} from "./utilities_react";
import {TacticNavbar} from "./blueprint_navbar";
import {TacticSocket, useConnection} from "./tactic_socket";
import {withSettings} from "./settings";
import {DialogContext, withDialogs} from "./modal_react";

window.global_id = "a" + guid();

async function tile_differ_main() {
    function gotProps(the_props) {
        let TileDifferAppPlus = withRegisterActivity(withSettings(withDialogs(withErrorDrawer(withStatus(TileDifferApp)))));
        let the_element = <TileDifferAppPlus {...the_props}
                                             controlled={false}
                                             changeName={null}
        />;
        const domContainer = document.querySelector('#root');
        const root = createRoot(domContainer);
        root.render(
            <div style={{
                display: "flex", flexDirection: "column",
                position: "relative",
                height: "100%",
                width: "100%"
            }}>
                {the_element}
            </div>
        )
    }

    try {
        tile_differ_props({}, null, gotProps)
    } catch (e) {
        let fallback = "Tile differ failed to load";
        if ("message" in e) {
            fallback = fallback + " " + e.message
        }
        const domContainer = document.querySelector('#root');
        const root = createRoot(domContainer);
        let the_element = <pre>{fallback}</pre>;
        root.render(the_element);
    }
}

function tile_differ_props(data, registerDirtyMethod, finalCallback) {
    let tsocket = new TacticSocket("main", 5000, "differ", window.global_id, () => {
            tsocket.attachListener('handle-callback', (task_packet) => {
            handleCallback(task_packet, window.global_id)
        });
        finalCallback({
            local_id: window.global_id,
            tsocket: tsocket,
            tile_list: [],
            resource_name: window.resource_name,
            second_resource_name: "second_resource_name" in window ? window.second_resource_name : null,
            edit_content: "",
            is_repository: false,
            registerDirtyMethod: registerDirtyMethod
        })
    })
}

function TileDifferApp(props) {

    const [edit_content, set_edit_content, edit_content_ref] = useStateAndRef(props.edit_content);
    const [right_content, set_right_content] = useState("");
    const [tile_popup_val, set_tile_popup_val] = useState(props.second_resource_name == "none" ?
        props.resource_name : props.second_resource_name);
    const [tile_list, set_tile_list] = useState(props.tile_list);
    const [second_resource_name, set_second_resource_name] = useState("");
    const [initialized, setInitialized] = useState(false);

    const connection_status = useConnection(props.tsocket, initSocket);

    const savedContent = useRef(props.edit_content);

    const statusFuncs = useContext(StatusContext);
    const errorDrawerFuncs = useContext(ErrorDrawerContext);
    const dialogFuncs = useContext(DialogContext)
    const pushCallback = useCallbackStack();

    useEffect(() => {
        window.addEventListener("beforeunload", function (e) {
            if (_dirty()) {
                e.preventDefault();
            }
            postWithCallback("host", "end_client_session_task", {global_id: window.global_id, force_forward: true})
            props.tsocket.disconnect()
        });
    }, []);

    useEffect(()=>{
        postPromise("host", "get_tile_content_task", {"tile_module_name": window.resource_name})
            .then((data) => {
                postPromise("host", "get_tile_names_task", {})
                    .then((data2) => {
                        set_tile_list(data2["tile_names"]);
                        set_edit_content(data.tile_content);
                        savedContent.current = data.tile_content;
                        getRightTileCode(tile_popup_val).then();
                        pushCallback(() => {
                            setInitialized(true);
                        })
                    })
            })

    }, []);

    function initSocket(theSocket) {
        theSocket.attachListener("window-open", (data) => window.open(`${$SCRIPT_ROOT}/load_temp_page/${data["the_id"]}`));
        theSocket.attachListener('close-user-windows', (data) => {
            if (!(data["originator"] == window.global_id)) {
                window.close()
            }
        });
        theSocket.attachListener('doflashUser', doFlash);
        if (!window.in_context) {
            theSocket.attachListener("endSession", function () {
                dialogFuncs.showModal("EndSessionDialog", {})
            })
        }
    }

    async function getRightTileCode(tile_name) {
        if (!tile_name) return;
        let data = await postPromise("host", "get_tile_content_task", {tile_module_name: tile_name});
        if (!data || !data.success) {
            errorDrawerFuncs.addErrorDrawerEntry({
                title: "Error getting module code",
                content: data.message
            });
        } else {
            set_right_content(data.tile_content);
        }
    }


    async function handleSelectChange(new_value) {
        if (!new_value) return;
        set_tile_popup_val(new_value);
        await getRightTileCode(new_value);
    }

    function handleEditChange(new_code) {
        set_edit_content(new_code)
    }

    async function saveFromLeft() {
        let data_dict = {
            "module_name": window.resource_name,
            "module_code": edit_content_ref.current
        };
        try {
            await postPromise("host", "update_from_left_task", data_dict);
            statusFuncs.statusMessage("Updated from left");
        }
        catch(e){
            errorDrawerFuncs.addErrorDrawerEntry({
                title: "Error saving from left",
                content: "message" in e ? e.message : ""
            });
        }
    }

    function _dirty() {
        return edit_content_ref.current != savedContent.current
    }

    return (
        <Fragment>
            {!props.controlled} {
            <TacticNavbar is_authenticated={window.is_authenticated}
                          selected={null}
                          show_api_links={true}
                          user_name={window.username}/>
        }

            <MergeViewerApp connection_status={connection_status}
                            initialized={initialized}
                            resource_name={window.resource_name}
                            option_list={tile_list}
                            select_val={tile_popup_val}
                            edit_content={edit_content}
                            right_content={right_content}
                            handleSelectChange={handleSelectChange}
                            handleEditChange={handleEditChange}
                            saveHandler={saveFromLeft}
            />
        </Fragment>
    )
}

TileDifferApp = memo(TileDifferApp);

if (!window.in_context) {
    tile_differ_main().then();
}
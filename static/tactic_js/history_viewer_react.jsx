/**
 * Created by bls910
 */

import "../tactic_css/tactic.scss";
import "../tactic_css/themeable.scss";

import React from "react";
import {Fragment, useState, useEffect, memo, useRef, useContext} from "react";
import { createRoot } from 'react-dom/client';

import {MergeViewerApp} from "./merge_viewer_app";
import {doFlash, StatusContext} from "./toaster.js"
import {handleCallback, postPromise} from "./communication_react.js"
import {withErrorDrawer, ErrorDrawerContext} from "./error_drawer.js";
import {withStatus} from "./toaster.js";

import {guid} from "./utilities_react.js";
import {TacticNavbar} from "./blueprint_navbar";
import {TacticSocket} from "./tactic_socket.js";
import {useCallbackStack, useConnection, useStateAndRef} from "./utilities_react";
import {withSettings} from "./settings";

window.global_id = "a" + guid();

async function history_viewer_main ()  {
    function gotProps(the_props) {
        let HistoryViewerAppPlus = withSettings(withErrorDrawer(withStatus(HistoryViewerApp)));
        let the_element = <HistoryViewerAppPlus {...the_props}
                                             controlled={false}
                                             changeName={null}/>;
        const domContainer = document.querySelector('#root');
        const root = createRoot(domContainer);
        root.render(
            <div style={{display: "flex", flexDirection: "column",
                position: "relative",
                height: "100%",
                width: "100%"}}>
                {the_element}
            </div>
        )
    }

    try {
        history_viewer_props({}, null, gotProps);
    }
    catch (e) {
        let fallback = "History viewer failed to load";
        if ("message" in e) {
            fallback = fallback + " " + e.message
        }
        const domContainer = document.querySelector('#root');
        const root = createRoot(domContainer);
        let the_element = <pre>{fallback}</pre>;
        root.render(the_element);
    }
}

function history_viewer_props(data, registerDirtyMethod, finalCallback) {
    let tsocket = new TacticSocket("main", 5000, "history_viewer", window.global_id, ()=> {
        tsocket.attachListener('handle-callback', (task_packet) => {
            handleCallback(task_packet, window.global_id)
        });
        finalCallback({
            local_id: window.global_id,
            tsocket: tsocket,
            history_list: [],
            resource_name: window.resource_name,
            edit_content: "",
            is_repository: false,
            registerDirtyMethod: registerDirtyMethod
        })
    })
}

function HistoryViewerApp(props) {

    const [edit_content, set_edit_content, edit_content_ref] = useStateAndRef();
    const [right_content, set_right_content] = useState("");
    const [history_popup_val, set_history_popup_val] = useState("");
    const [history_list, set_history_list] = useState(props.history_list);
    const [initialized, setInitialized] = useState(false);

    const [resource_name, ] = useState(props.resource_name);
    const connection_status = useConnection(props.tsocket, initSocket);

    const savedContent = useRef("");

    const statusFuncs = useContext(StatusContext);
    const errorDrawerFuncs = useContext(ErrorDrawerContext);

    const pushCallback = useCallbackStack();

    useEffect(()=>{
        function beforeUnloadFunc(e) {
            if (_dirty()) {
                e.preventDefault();
                e.returnValue = ''
            }
            props.tsocket.disconnect()
        }
        window.addEventListener("beforeunload", beforeUnloadFunc);
        return (() => {
            props.tsocket.disconnect();
            window.removeEventListener("beforeunload", beforeUnloadFunc)
        })
    }, []);

    useEffect(() => {
        postPromise("host", "get_tile_content_task", {"tile_module_name": window.resource_name})
            .then((data) => {
                postPromise("host", "get_checkpoint_dates_task", {"module_name": window.resource_name})
                    .then((data2) => {
                        set_history_list(data2.checkpoints);
                        set_edit_content(data.tile_content);
                        savedContent.current = data.tile_content;
                        pushCallback(() => {
                            setInitialized(true);
                            set_history_popup_val(data2.checkpoints[0]["update_string"]);
                            getCheckpointCode(data2.checkpoints[0]["updatestring_for_sort"]);
                        })
                    })
        });

    }, []);

    function initSocket() {
        props.tsocket.attachListener("window-open", (data) => window.open(`${$SCRIPT_ROOT}/load_temp_page/${data["the_id"]}`));
        props.tsocket.attachListener('close-user-windows', (data) => {
            if (!(data["originator"] == window.global_id)) {
                window.close()
            }
        });
        props.tsocket.attachListener('doflashUser', doFlash);
    }

    function getCheckpointCode(updatestring_for_sort) {
        postPromise("host", "get_checkpoint_code_task", {"module_name": resource_name, "updatestring_for_sort": updatestring_for_sort})
            .then((data) => {
                    set_right_content(data.module_code);
                })
            .catch((data)=>{
                errorDrawerFuncs.addErrorDrawerEntry({
                    title: "Error getting checkpoint code",
                    content: "message" in data ? data.message : ""
                });
            });
    }

    function handleSelectChange(new_value) {
        if (!new_value) return;
        set_history_popup_val(new_value);
        for (let item of history_list) {
            if (item["updatestring"] == new_value){
                let updatestring_for_sort = item["updatestring_for_sort"];
                getCheckpointCode(updatestring_for_sort);
                return
            }
        }
    }

    function handleEditChange(new_code) {
        set_edit_content(new_code)
    }

    function doCheckpointPromise() {
        return new Promise (async function (resolve, reject) {
            let data = postPromise("host", "checkpoint_module_task", {"module_name": props.resource_name});
            if (data.success) {
                resolve(data)
            }
            else {
                reject(data)
            }
        })
    }

    function checkpointThenSaveFromLeft() {
        doCheckpointPromise()
            .then(function () {
                postPromise("host", "get_checkpoint_dates_task", {"module_name": resource_name})
                    .then((data) => {
                        set_history_list(data["checkpoints"])
                    })
                    .catch((data)=>{
                        errorDrawerFuncs.addErrorDrawerEntry({
                            title: "Error getting checkpoint dates",
                            content: "message" in data ? data.message : ""
                        });
                    });
                saveFromLeft()
            })
            .catch((data)=>{
                errorDrawerFuncs.addErrorDrawerEntry({
                    title: "Error checkpointing module",
                    content: "message" in data ? data.message : ""
                });
            })
    }

    function saveFromLeft() {
        let data_dict = {
            "module_name": props.resource_name,
            "module_code": edit_content_ref.current
        };
        postPromise("host", "update_from_left_task", data_dict)
            .then(()=>{
                statusFuncs.statusMessage("Updated from left")
            })
            .catch((data)=>{
                errorDrawerFuncs.addErrorDrawerEntry({
                    title: "Error updating from left",
                    content: "message" in data ? data.message : ""
                });
            })
    }

    function _dirty() {
        return edit_content_ref.current != savedContent.current
    }

    let option_list = history_list.map((item) => item["updatestring"]);
    return (
            <Fragment>
                {!props.controlled} {
                    <TacticNavbar is_authenticated={window.is_authenticated}
                                  selected={null}
                                  show_api_links={true}
                                  global_id={props.global_id}
                                  user_name={window.username}/>
                }
                <MergeViewerApp connection_status={connection_status}
                                initialized={initialized}
                                resource_name={props.resource_name}
                                option_list={option_list}
                                select_val={history_popup_val}
                                edit_content={edit_content_ref.current}
                                right_content={right_content}
                                handleSelectChange={handleSelectChange}
                                handleEditChange={handleEditChange}
                                saveHandler={checkpointThenSaveFromLeft}
            />
        </Fragment>
    )
}


HistoryViewerApp = memo(HistoryViewerApp);

if (!window.in_context) {
    try {
        history_viewer_main().then();
    }
    catch(e) {
        console.log("Error at the top level")
    }
}
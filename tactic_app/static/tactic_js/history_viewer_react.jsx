/**
 * Created by bls910
 */

import "../tactic_css/tactic.scss";

import React from "react";
import {Fragment, useState, useEffect, memo, useRef, useContext} from "react";
import { createRoot } from 'react-dom/client';
// import { HotkeysProvider } from "@blueprintjs/core";

import {MergeViewerApp} from "./merge_viewer_app";
import {doFlash, StatusContext} from "./toaster.js"
import {postAjax, postAjaxPromise} from "./communication_react.js"
import {withErrorDrawer, ErrorDrawerContext} from "./error_drawer.js";
import {withStatus} from "./toaster.js";
import {withSizeContext} from "./sizing_tools";

import {guid} from "./utilities_react.js";
import {TacticNavbar} from "./blueprint_navbar";
import {TacticSocket} from "./tactic_socket.js";
import {useCallbackStack, useConnection} from "./utilities_react";
import {withTheme} from "./theme";

async function history_viewer_main ()  {
    function gotProps(the_props) {
        let HistoryViewerAppPlus = withTheme(withErrorDrawer(withStatus(HistoryViewerApp)));
        let the_element = <HistoryViewerAppPlus {...the_props}
                                             controlled={false}
                                             initial_theme={window.theme}
                                             changeName={null}/>;
        const domContainer = document.querySelector('#root');
        const root = createRoot(domContainer);
        root.render(
           // <HotkeysProvider>
                the_element
           // </HotkeysProvider>
        )
    }

    let get_url = "get_module_code";

    try {
        let data = await postAjaxPromise(`${get_url}/${window.resource_name}`, {});
        var edit_content = data.the_content;
        let data2 = await postAjaxPromise("get_checkpoint_dates", {"module_name": window.resource_name});
        data.history_list = data2.checkpoints;
        data.resource_name = window.resource_name;
        history_viewer_props(data, null, gotProps);
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
    let resource_viewer_id = guid();
    var tsocket = new TacticSocket("main", 5000, "history_viewer", resource_viewer_id);
    finalCallback({
        resource_viewer_id: resource_viewer_id,
        tsocket: tsocket,
        history_list: data.history_list,
        resource_name: data.resource_name,
        edit_content: data.the_content,
        is_repository: false,
        registerDirtyMethod: registerDirtyMethod
    })
}

function HistoryViewerApp(props) {

    const [edit_content, set_edit_content] = useState(props.edit_content);
    const [right_content, set_right_content] = useState("");
    const [history_popup_val, set_history_popup_val] = useState(props.history_list[0]["updatestring"]);
    const [history_list, set_history_list] = useState(props.history_list);

    const [resource_name, set_resource_name] = useState(props.resource_name);
    const connection_status = useConnection(props.tsocket, initSocket);

    const savedContent = useRef(props.edit_content);

    const statusFuncs = useContext(StatusContext);
    const errorDrawerFuncs = useContext(ErrorDrawerContext);
    const pushCallback = useCallbackStack();

    useEffect(()=>{
        function beforeUnloadFunc(e) {
            if (_dirty()) {
                e.preventDefault();
                e.returnValue = ''
            }
        }
        window.addEventListener("beforeunload", beforeUnloadFunc);
        return (() => {
            props.tsocket.disconnect();
            window.removeEventListener("beforeunload", beforeUnloadFunc)
        })
    }, []);

    function initSocket() {
        props.tsocket.attachListener("window-open", (data) => window.open(`${$SCRIPT_ROOT}/load_temp_page/${data["the_id"]}`));
        props.tsocket.attachListener('close-user-windows', (data) => {
            if (!(data["originator"] == window.library_id)) {
                window.close()
            }
        });
        props.tsocket.attachListener('doflashUser', doFlash);
    }

    function handleSelectChange(new_value) {
        set_history_popup_val(new_value);
        for (let item of history_list) {
            if (item["updatestring"] == new_value){
                let updatestring_for_sort = item["updatestring_for_sort"];
                postAjaxPromise("get_checkpoint_code", {"module_name": resource_name, "updatestring_for_sort": updatestring_for_sort})
                    .then((data) => {
                            set_right_content(data.module_code);
                        })
                    .catch((data)=>{
                        errorDrawerFuncs.addErrorDrawerEntry({
                            title: "Error getting checkpoint code",
                            content: "message" in data ? data.message : ""
                        });
                    });
                return
            }
        }
    }

    function handleEditChange(new_code) {
        set_edit_content(new_code)
    }

    function doCheckpointPromise() {
        return new Promise (function (resolve, reject) {
            postAjax("checkpoint_module", {"module_name": props.resource_name}, function (data) {
                if (data.success) {
                    resolve(data)
                }
                else {
                    reject(data)
                }
            });
        })
    }

    function checkpointThenSaveFromLeft() {
        let self = this;
        let current_popup_val = history_popup_val;
        doCheckpointPromise()
            .then(function () {
                postAjaxPromise("get_checkpoint_dates", {"module_name": resource_name})
                    .then((data) => {
                        set_history_list(data.checkpoints)
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
            "module_code": edit_content
        };
        postAjaxPromise("update_from_left", data_dict)
            .then((data)=>{
                statusFuncs.statusMessage("Updated from left")
            })
            .catch((data)=>{
                errorDrawerFuncs.addErrorDrawerEntry({
                    title: "Error updating from left",
                    content: "message" in data ? data.message : ""
                });
            })
    }

    function dirty() {
        return edit_content != savedContent.current
    }

    let option_list = history_list.map((item) => item["updatestring"]);
    return (
            <Fragment>
                {!props.controlled} {
                    <TacticNavbar is_authenticated={window.is_authenticated}
                                  selected={null}
                                  show_api_links={true}
                                  page_id={props.resource_viewer_id}
                                  user_name={window.username}/>
                }
                <MergeViewerApp connection_status={connection_status}
                                page_id={props.resource_viewer_id}
                                resource_viewer_id={props.resource_viewer_id}
                                resource_name={props.resource_name}
                                option_list={option_list}
                                select_val={history_popup_val}
                                edit_content={edit_content}
                                right_content={right_content}
                                handleSelectChange={handleSelectChange}
                                handleEditChange={handleEditChange}
                                saveHandler={checkpointThenSaveFromLeft}
            />
        </Fragment>
    )
}


HistoryViewerApp = withSizeContext(memo(HistoryViewerApp));

if (!window.in_context) {
    try {
        history_viewer_main().then();
    }
    catch(e) {
        console.log("Error at the top level")
    }
}
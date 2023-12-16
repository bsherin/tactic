import "../tactic_css/tactic.scss";

import React from "react";
import {Fragment, useState, useEffect, memo, useRef, useContext} from "react";
import * as ReactDOM from 'react-dom'
import PropTypes from 'prop-types';

import {MergeViewerApp} from "./merge_viewer_app";
import {doFlash, StatusContext} from "./toaster"
import {postAjaxPromise} from "./communication_react"
import {ErrorDrawerContext, withErrorDrawer} from "./error_drawer";
import {withStatus} from "./toaster";
import {guid, useConnection} from "./utilities_react";
import {TacticNavbar} from "./blueprint_navbar";
import {TacticSocket} from "./tactic_socket";
import {useCallbackStack} from "./utilities_react";
import {withTheme} from "./theme";

function tile_differ_main() {
    function gotProps(the_props) {
        let TileDifferAppPlus = withTheme(withErrorDrawer(withStatus(TileDifferApp)));
        let the_element = <TileDifferAppPlus {...the_props}
                                             controlled={false}
                                             initial_theme={window.theme}
                                             changeName={null}
        />;
        let domContainer = document.querySelector('#root');
        ReactDOM.render(the_element, domContainer)

    }

    function failedToLoad(data) {
        let fallback = "Tile differ failed to load";
        if ("message" in data) {
            fallback = fallback + " " + data.message
        }
        let domContainer = document.querySelector('#root');
        let the_element = <pre>{fallback}</pre>;
        return ReactDOM.render(the_element, domContainer);
    }

    let get_url = "get_module_code";

    postAjaxPromise(`${get_url}/${window.resource_name}`, {})
        .then(function (data) {
                var edit_content = data.the_content;
                postAjaxPromise("get_tile_names")
                    .then(function (data2) {
                        data.tile_list = data2.tile_names;
                        data.resource_name = window.resource_name,
                            data.second_resource_name = window.second_resource_name;
                        tile_differ_props(data, null, gotProps)
                    })
                    .catch((data)=>{
                        failedToLoad(data)
                    })

            }
        )
        .catch((data)=>{
            failedToLoad(data)
        });
}

function tile_differ_props(data, registerDirtyMethod, finalCallback) {
    let resource_viewer_id = guid();
    var tsocket = new TacticSocket("main", 5000, "differ", resource_viewer_id);
    finalCallback({
        resource_viewer_id: resource_viewer_id,
        tsocket: tsocket,
        tile_list: data.tile_list,
        resource_name: data.resource_name,
        second_resource_name: data.second_resource_name,
        edit_content: data.the_content,
        is_repository: false,
        registerDirtyMethod: registerDirtyMethod
    })
}

function TileDifferApp(props) {

    const [edit_content, set_edit_content] = useState(props.edit_content);
    const [right_content, set_right_content] = useState("");
    const [tile_popup_val, set_tile_popup_val] = useState(props.second_resource_name == "none" ?
        props.resource_name : props.second_resource_name);
    const [tile_list, set_tile_list] = useState(props.tile_list);

    const [resource_name, set_resource_name] = useState(props.resource_name);
    const connection_status = useConnection(props.tsocket, initSocket);

    const savedContent = useRef(props.edit_content);

    const pushCallback = useCallbackStack();

    const statusFuncs = useContext(StatusContext);
    const errorDrawerFuncs = useContext(ErrorDrawerContext);

    useEffect(() => {
        window.addEventListener("beforeunload", function (e) {
            if (_dirty()) {
                e.preventDefault();
                e.returnValue = ''
            }
        });
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
        set_tile_popup_val(new_value);
        let self = this;
        postAjaxPromise("get_module_code/" + new_value, {})
            .then((data) => {
                set_right_content(data.the_content);
            })
            .catch((data)=>{
                errorDrawerFuncs.addErrorDrawerEntry({
                    title: "Error getting module code",
                    content: "message" in data ? data.message : ""
                });
            });
    }

    function handleEditChange(new_code) {
        set_edit_content(new_code)
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

TileDifferApp.propTypes = {
    resource_name: PropTypes.string,
    tile_list: PropTypes.array,
    edit_content: PropTypes.string,
    second_resource_name: PropTypes.string
};

TileDifferApp = memo(TileDifferApp);

if (!window.in_context) {
    tile_differ_main();
}
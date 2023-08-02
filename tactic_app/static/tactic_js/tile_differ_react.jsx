import "../tactic_css/tactic.scss";

import React from "react";
import {Fragment, useState, useEffect, memo, useRef} from "react";
import * as ReactDOM from 'react-dom'
import PropTypes from 'prop-types';

import {MergeViewerApp} from "./merge_viewer_app";
import {doFlash} from "./toaster"
import {postAjaxPromise} from "./communication_react"
import {withErrorDrawer} from "./error_drawer";
import {withStatus} from "./toaster";
import {guid} from "./utilities_react";
import {TacticNavbar} from "./blueprint_navbar";
import {TacticSocket} from "./tactic_socket";
import {useCallbackStack} from "./utilities_react";

function tile_differ_main() {
    function gotProps(the_props) {
        let TileDifferAppPlus = withErrorDrawer(withStatus(TileDifferApp));
        let the_element = <TileDifferAppPlus {...the_props}
                                             controlled={false}
                                             initial_theme={window.theme}
                                             changeName={null}
        />;
        let domContainer = document.querySelector('#root');
        ReactDOM.render(the_element, domContainer)

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
                    .catch(doFlash)

            }
        )
        .catch(doFlash);
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

    const [dark_theme, set_dark_theme] = useState(props.initial_theme === "dark");
    const [resource_name, set_resource_name] = useState(props.resource_name);

    const savedContent = useRef(props.edit_content);

    const pushCallback = useCallbackStack();

    useEffect(() => {
        window.addEventListener("beforeunload", function (e) {
            if (_dirty()) {
                e.preventDefault();
                e.returnValue = ''
            }
        });
        initSocket();
        if (!props.controlled) {
            window.dark_theme = dark_theme
        }
        return (() => {
            tsocket.disconnect();
        })
    }, []);

    function initSocket() {
        props.tsocket.attachListener("window-open", (data) => window.open(`${$SCRIPT_ROOT}/load_temp_page/${data["the_id"]}`));
        props.tsocket.attachListener('close-user-windows', (data) => {
            if (!(data["originator"] == window.library_id)) {
                window.close()
            }
        });
        props.tsocket.attachListener('doflash', doFlash);
        props.tsocket.attachListener('doflashUser', doFlash);
    }

    function _setTheme(dark_theme) {
        set_dark_theme(dark_theme);
        pushCallback(() => {
            if (!window.in_context) {
                window.dark_theme = dark_theme
            }
        })
    }

    function handleSelectChange(new_value) {
        set_tile_popup_val(new_value);
        let self = this;
        postAjaxPromise("get_module_code/" + new_value, {})
            .then((data) => {
                set_right_content(data.the_content);
            })
            .catch(doFlash);
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
            .then(doFlash)
            .catch(doFlash)
    }

    function dirty() {
        return edit_content != savedContent.current
    }

    let actual_dark_theme = props.controlled ? props.dark_theme : dark_theme;
    return (
        <Fragment>
            {!props.controlled} {
            <TacticNavbar is_authenticated={window.is_authenticated}
                          dark_theme={actual_dark_theme}
                          setTheme={_setTheme}
                          selected={null}
                          show_api_links={true}
                          page_id={props.resource_viewer_id}
                          user_name={window.username}/>
        }

            <MergeViewerApp {...props.statusFuncs}
                            page_id={props.resource_viewer_id}
                            setTheme={props.controlled ? null : _setTheme}
                            dark_theme={actual_dark_theme}
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
// noinspection JSCheckFunctionSignatures

import "../tactic_css/tactic.scss";
import "../tactic_css/tactic_table.scss";
import "../tactic_css/library_home.scss";

import React from "react";
import { createRoot } from 'react-dom/client';
import {Fragment, useEffect, useRef, memo, useContext} from "react";

import {TacticSocket} from "./tactic_socket";
import {doFlash} from "./toaster.js";
import {LibraryPane} from "./library_pane";
import {withStatus} from "./toaster";
import {withErrorDrawer} from "./error_drawer";
import {guid, useConnection } from "./utilities_react";
import {TacticNavbar} from "./blueprint_navbar";
import {AllMenubar} from "./library_menubars"
import {SettingsContext, withSettings} from "./settings";
import {ICON_BAR_WIDTH} from "./sizing_tools";
import {withDialogs} from "./modal_react";
import {StatusContext} from "./toaster"
import {withAssistant} from "./assistant";
import {handleCallback} from "./communication_react";

export {LibraryHomeApp, library_id}
const library_id = guid();
if (!window.in_context) {
    window.main_id = library_id;
}

function LibraryHomeApp(props) {
    const top_ref = useRef(null);

    const settingsContext = useContext(SettingsContext);
    const statusFuncs = useContext(StatusContext);

    const connection_status = useConnection(props.tsocket, initSocket);

    useEffect(() => {
        statusFuncs.stopSpinner(null);
    }, []);

    function initSocket() {
        props.tsocket.attachListener("window-open", data => window.open(`${$SCRIPT_ROOT}/load_temp_page/${data["the_id"]}`));
        if (!window.in_context) {
            props.tsocket.attachListener("doFlashUser", function (data) {
                doFlash(data)
            });
            props.tsocket.attachListener('close-user-windows', (data) => {
                if (!(data["originator"] == library_id)) {
                    window.close()
                }
            });
            props.tsocket.attachListener('handle-callback', (task_packet) => {
                handleCallback(task_packet, window.main_id)
            });
        }
    }

    let lib_props = {...props};
    let all_pane = (
        <LibraryPane {...lib_props}
                     connection_status={connection_status}
                     columns={{
                         "icon:th": {first_sort: "ascending"},
                         "name": {first_sort: "ascending"},
                         "icon:upload": {first_sort: "ascending"},
                         "created": {first_sort: "descending"},
                         "updated": {first_sort: "ascending"},
                         "tags": {first_sort: "ascending"},
                         "size": {first_sort: "descending"}
                     }}
                     pane_type="all"
                     handleCreateViewer={props.handleCreateViewer}
                     open_resources_ref={props.open_resources_ref}
                     allow_search_inside={true}
                     allow_search_metadata={true}
                     MenubarClass={AllMenubar}
                     {...props.errorDrawerFuncs}
                     errorDrawerFuncs={props.errorDrawerFuncs}
                     library_id={library_id}
        />
    );

   let outer_style = {
       width: `calc(100% - ${ICON_BAR_WIDTH}px)`,
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: 0,
        position: "relative"
    };
    let outer_class = "";
    if (!window.in_context) {
        outer_style.height = "100%";
        outer_class = "pane-holder  ";
        if (settingsContext.isDark()) {
            outer_class = `${outer_class} bp6-dark`;
        } else {
            outer_class = `${outer_class} light-theme`;
        }
    }
    return (
        <Fragment>
            { !props.controlled &&
                <TacticNavbar is_authenticated={window.is_authenticated}
                              selected={null}
                              show_api_links={false}
                              extra_text={window.database_type == "Local" ? "" : window.database_type}
                              page_id={library_id}
                              user_name={window.username}/>
            }
            <div className={outer_class} ref={top_ref} style={outer_style}>
                    { all_pane }
            </div>
        </Fragment>
    )
}

LibraryHomeApp = memo(LibraryHomeApp);

function _library_home_main() {
    const tsocket = new TacticSocket("main", 5000, "library", library_id);
    const LibraryHomeAppPlus = withSettings(withDialogs(withErrorDrawer(withStatus(withAssistant(LibraryHomeApp)))));
    const domContainer = document.querySelector('#library-home-root');
    const root = createRoot(domContainer);
    root.render(
        <div style={{display: "flex", flexDirection: "column",
                position: "relative",
                height: "100%",
                width: "100%"}}>
            <LibraryHomeAppPlus tsocket={tsocket}
                                controlled={false}/>
        </div>
    )
}

if (!window.in_context) {
    _library_home_main();
}


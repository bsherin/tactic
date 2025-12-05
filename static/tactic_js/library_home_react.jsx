// noinspection JSCheckFunctionSignatures

if (!window.in_context) {
    import("../tactic_css/tactic.scss");
    import("../tactic_css/tactic_table.scss");
    import("../tactic_css/library_home.scss");
    import("../tactic_css/resource_viewer.scss");
    import ("../tactic_css/themeable.scss");
}

import React from "react";
import { createRoot } from 'react-dom/client';
import {Fragment, useEffect, useRef, memo, useContext, useState} from "react";

import {TacticSocket} from "./tactic_socket";
import {doFlash} from "./toaster.js";
import {LibraryPane} from "./library_pane";
import {withStatus} from "./toaster";
import {withErrorDrawer} from "./error_drawer";
import {guid, useConnection, withRegisterActivity} from "./utilities_react";
import {TacticNavbar} from "./blueprint_navbar";
import {AllMenubar} from "./library_menubars"
import {SettingsContext, withSettings} from "./settings";
import {ICON_BAR_WIDTH} from "./sizing_tools";
import {DialogContext, withDialogs} from "./modal_react";
import {StatusContext} from "./toaster"
import {withAssistant} from "./assistant";
import {handleCallback} from "./communication_react";
import {base_columns} from "./library_widgets";

export {LibraryHomeApp}
const library_id = "a" + guid();
if (!window.in_context) {
    window.global_id = library_id;
}

function LibraryHomeApp(props) {
    const top_ref = useRef(null);

    const settingsContext = useContext(SettingsContext);
    const statusFuncs = useContext(StatusContext);
    const [columns, setColumns] = useState([]);

    const connection_status = useConnection(props.tsocket, initSocket);
   const dialogFuncs = useContext(DialogContext);

    useEffect(() => {
        statusFuncs.stopSpinner(null);
    }, []);

    useEffect(() => {
        setColumns([...base_columns, ...settingsContext.settingsRef.current.library_columns]);
    }, [settingsContext.settingsRef.current.library_columns]);

    function initSocket() {
        props.tsocket.attachListener("window-open", data => window.open(`${$SCRIPT_ROOT}/load_temp_page/${data["the_id"]}`));
        if (!window.in_context) {
            props.tsocket.attachListener("doFlashUser", function (data) {
                doFlash(data)
            });
            props.tsocket.attachListener('close-user-windows', (data) => {
                if (!(data["originator"] == window.global_id)) {
                    window.close()
                }
            });
            props.tsocket.attachListener("endSession", function () {
                dialogFuncs.showModal("EndSessionDialog", {})
            })
        }
    }

    function updateColumns(new_columns) {
        new_columns = new_columns.filter(col => !base_columns.includes(col));
        const unique = [...new Set(new_columns)];
        settingsContext.updateSetting("library_columns", unique);
    }

    let lib_props = {...props};
    let all_pane = (
        <LibraryPane {...lib_props}
                     connection_status={connection_status}
                     columns={columns}
                     updateColumns={updateColumns}
                     handleCreateViewer={props.handleCreateViewer}
                     setCurrentMetabook={props.setCurrentMetabook}
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
    let outer_class = "resource-viewer-holder top";
    if (!window.in_context) {
        outer_style.height = "100%";
        outer_class = `${outer_class} pane-holder ${settingsContext.isDark() ? "bp6-dark" : "light-theme"}`
    }
    return (
        <Fragment>
            { !props.controlled &&
                <TacticNavbar is_authenticated={window.is_authenticated}
                              selected={null}
                              show_api_links={false}
                              extra_text={window.database_type == "Local" ? "" : window.database_type}
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
    const tsocket = new TacticSocket("main", 5000, "library", library_id, ()=>{
            tsocket.attachListener('handle-callback', (task_packet) => {
                handleCallback(task_packet, library_id)
            });
        const LibraryHomeAppPlus = withRegisterActivity(withSettings(withDialogs(withErrorDrawer(withStatus(withAssistant(LibraryHomeApp))))));
        const domContainer = document.querySelector('#library-home-root');
        const root = createRoot(domContainer);
        root.render(
            <LibraryHomeAppPlus tsocket={tsocket}
                                controlled={false}/>
        )
    });
}

if (!window.in_context) {
    _library_home_main();
}


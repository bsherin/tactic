import "../tactic_css/tactic.scss";
import "../tactic_css/tactic_table.scss";
import "../tactic_css/library_home.scss";
import "../tactic_css/resource_viewer.scss";

import React from "react";
import {Fragment, useEffect, useRef, memo, useContext} from "react";
import {createRoot} from 'react-dom/client';

import {TacticSocket} from "./tactic_socket"
import {handleCallback} from "./communication_react"
import {LibraryPane} from "./library_pane"
import {withStatus} from "./toaster";
import {withErrorDrawer} from "./error_drawer";
import {useConnection, guid} from "./utilities_react";
import {TacticNavbar} from "./blueprint_navbar";

import {SettingsContext, withSettings} from "./settings";
import {withDialogs} from "./modal_react";
import {StatusContext} from "./toaster"

import {RepositoryAllMenubar} from "./repository_menubars";
import {ICON_BAR_WIDTH} from "./sizing_tools";
import {all_columns} from "./library_widgets";

export {RepositoryHomeApp}

const library_id = "a" + guid();
window.global_id = library_id;


let tsocket;

function RepositoryHomeApp(props) {

    const connection_status = useConnection(props.tsocket, initSocket);
    const settingsContext = useContext(SettingsContext);
    const statusFuncs = useContext(StatusContext);

    const top_ref = useRef(null);

    useEffect(() => {
        statusFuncs.stopSpinner();
    }, []);

    function initSocket() {
        let tsocket = props.tsocket;
        tsocket.attachListener("window-open", data => window.open(`${$SCRIPT_ROOT}/load_temp_page/${data["the_id"]}`));
        if (!window.in_context) {
            tsocket.attachListener('close-user-windows', (data) => {
                if (!(data["originator"] == window.global_id)) {
                    window.close()
                }
            });
        }
    }

    let lib_props = {...props};
    let all_pane = (
        <LibraryPane {...lib_props}
                     connection_status={connection_status}
                     columns={all_columns}
                     updateColumns={null}
                     handleCreateViewer={null}
                     open_resources_ref={null}
                     allow_search_inside={true}
                     allow_search_metadata={true}
                     MenubarClass={RepositoryAllMenubar}
                     {...props.errorDrawerFuncs}
                     errorDrawerFuncs={props.errorDrawerFuncs}
                     library_id={library_id}
                     is_repository={true}
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
    outer_style.height = "100%";
    outer_class = `${outer_class} pane-holder ${settingsContext.isDark() ? "bp6-dark" : "light-theme"}`;
    return (
        <Fragment>
            <TacticNavbar is_authenticated={window.is_authenticated}
                          selected={null}
                          global_id={window.global_id}
                          show_api_links={false}
                          extra_text={window.repository_type == "Local" ? "" : window.repository_type}
                          user_name={window.username}/>
            <div id="repository_container" className={outer_class} ref={top_ref} style={outer_style}>
                    {all_pane}
            </div>
        </Fragment>
    )
}

RepositoryHomeApp = memo(RepositoryHomeApp);


function _repository_home_main() {
    tsocket = new TacticSocket("main", 5000, "repository", library_id, ()=>{
        tsocket.attachListener('handle-callback', (task_packet) => {
            handleCallback(task_packet, library_id)
        });
        tsocket.socket.emit('join-repository', {});
        let RepositoryHomeAppPlus = withSettings(withDialogs(withErrorDrawer(withStatus(RepositoryHomeApp))));
        const domContainer = document.querySelector('#library-home-root');
        const root = createRoot(domContainer);
        root.render(
            <div style={{
                display: "flex", flexDirection: "column",
                position: "relative",
                height: "100%",
                width: "100%"
            }}>
                <RepositoryHomeAppPlus controlled={false}
                                       tsocket={tsocket}/>
            </div>
        )
    });

}

_repository_home_main();

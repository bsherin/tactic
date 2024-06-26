import "../tactic_css/tactic.scss";
import "../tactic_css/tactic_table.scss";
import "../tactic_css/library_home.scss";

import React from "react";
import {Fragment, useEffect, useRef, memo, useContext} from "react";
import { createRoot } from 'react-dom/client';

import {TacticSocket} from "./tactic_socket"
import {handleCallback} from "./communication_react"
import {LibraryPane} from "./library_pane"
import {withStatus} from "./toaster";
import {withErrorDrawer} from "./error_drawer";
import {useCallbackStack, useConnection} from "./utilities_react";
import {TacticNavbar} from "./blueprint_navbar";

import {ThemeContext, withTheme} from "./theme";
import {withDialogs} from "./modal_react";
import {StatusContext} from "./toaster"

import {RepositoryAllMenubar} from "./repository_menubars";
import {library_id} from "./library_home_react";
import {BOTTOM_MARGIN, useSize, withSizeContext, SizeContext} from "./sizing_tools";

export {RepositoryHomeApp}

const MARGIN_SIZE = 17;
let tsocket;

const controllable_props = ["usable_height", "usable_width"];

function RepositoryHomeApp(props) {

    const connection_status = useConnection(props.tsocket, initSocket);
    const theme = useContext(ThemeContext);
    const statusFuncs = useContext(StatusContext);

    const top_ref = useRef(null);
    const [usable_width, usable_height, topX, topY] = useSize(top_ref, 0, "Repository");

    const pushCallback = useCallbackStack("repository_home");

    useEffect(() => {
        statusFuncs.stopSpinner();
    }, []);

    function initSocket() {
        let tsocket = props.tsocket;
        tsocket.attachListener("window-open", data => window.open(`${$SCRIPT_ROOT}/load_temp_page/${data["the_id"]}`));
        if (!window.in_context) {
            tsocket.attachListener('handle-callback', (task_packet) => {
                handleCallback(task_packet, window.library_id)
            });
            tsocket.attachListener('close-user-windows', (data) => {
                if (!(data["originator"] == window.library_id)) {
                    window.close()
                }
            });
        }
    }

    function getIconColor(paneId) {
        return paneId == selected_tab_id ? "white" : "#CED9E0"
    }

    let lib_props = {...props};
    let all_pane = (
        <LibraryPane {...lib_props}
                     connection_status={connection_status}
                     columns={{
                         "icon:th": {"first_sort": "ascending"},
                         "name": {"first_sort": "ascending"},
                         "icon:upload": {"first_sort": "ascending"},
                         "created": {"first_sort": "descending"},
                         "updated": {"first_sort": "ascending"},
                         "tags": {"first_sort": "ascending"},
                         "size": {"first_sort": "descending"}
                     }}
                     pane_type="all"
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
        width: "100%",
        height: "100%",
        paddingLeft: 0
    };
    let outer_class = "library-pane-holder  ";
    if (theme.dark_theme) {
        outer_class = `${outer_class} bp5-dark`;
    } else {
        outer_class = `${outer_class} light-theme`;
    }
    return (
        <Fragment>
            <TacticNavbar is_authenticated={window.is_authenticated}
                          selected={null}
                          page_id={library_id}
                          show_api_links={false}
                          extra_text={window.repository_type == "Local" ? "" : window.repository_type}
                          user_name={window.username}/>
            <div id="repository_container" className={outer_class} ref={top_ref} style={outer_style}>
                <SizeContext.Provider value={{
                    topX: topX,
                    topY: topY,
                    availableWidth: usable_width,
                    availableHeight: usable_height - BOTTOM_MARGIN
                }}>
                    { all_pane }
                </SizeContext.Provider>
            </div>
        </Fragment>
    )
}

RepositoryHomeApp = memo(RepositoryHomeApp);


function _repository_home_main() {
    tsocket = new TacticSocket("main", 5000, "repository", library_id);
    tsocket.socket.emit('join-repository', {});
    let RepositoryHomeAppPlus = withSizeContext(withTheme(withDialogs(withErrorDrawer(withStatus(RepositoryHomeApp)))));
    const domContainer = document.querySelector('#library-home-root');
    const root = createRoot(domContainer);
    root.render(<RepositoryHomeAppPlus initial_theme={window.theme}
                                           controlled={false}
                                           tsocket={tsocket}/>)
}

_repository_home_main();

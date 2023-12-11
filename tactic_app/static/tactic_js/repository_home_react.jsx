import "../tactic_css/tactic.scss";
import "../tactic_css/tactic_table.scss";
import "../tactic_css/library_home.scss";

import React from "react";
import {Fragment, useState, useEffect, useRef, memo, useContext} from "react";
import * as ReactDOM from 'react-dom'

import {TacticSocket} from "./tactic_socket"
import {handleCallback} from "./communication_react"
import {doFlash} from "./toaster"
import {LibraryPane} from "./library_pane"
import {getUsableDimensions} from "./sizing_tools";
import {withStatus} from "./toaster";
import {withErrorDrawer} from "./error_drawer";
import {useCallbackStack, useConnection, useConstructor} from "./utilities_react";
import {TacticNavbar} from "./blueprint_navbar";

import {ThemeContext, withTheme} from "./theme";
import {withDialogs} from "./modal_react";
import {StatusContext} from "./toaster"

import {RepositoryAllMenubar} from "./repository_menubars";
import {library_id} from "./library_home_react";

export {RepositoryHomeApp}

const MARGIN_SIZE = 17;
let tsocket;

const controllable_props = ["usable_height", "usable_width"];

function RepositoryHomeApp(props) {

    const connection_status = useConnection(props.tsocket, initSocket);

    const [usable_height, set_usable_height] = useState(null);
    const [usable_width, set_usable_width] = useState(null);

    const theme = useContext(ThemeContext);
    const statusFuncs = useContext(StatusContext);

    const top_ref = useRef(null);

    useConstructor(() => {
        const aheight = getUsableDimensions(true).usable_height_no_bottom;
        const awidth = getUsableDimensions(true).usable_width - 170;
        set_usable_height(aheight);
        set_usable_width(awidth);
    });

    const pushCallback = useCallbackStack("repository_home");

    useEffect(() => {
        statusFuncs.stopSpinner();
        window.addEventListener("resize", _handleResize);
        _handleResize();
    }, []);

    function initSocket() {
        let tsocket = props.tsocket;
        tsocket.attachListener("window-open", data => window.open(`${$SCRIPT_ROOT}/load_temp_page/${data["the_id"]}`));
        tsocket.attachListener("doFlash", function (data) {
            doFlash(data)
        });
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

    function _handleResize() {
        set_usable_width(window.innerWidth - top_ref.current.offsetLeft);
        set_usable_height(window.innerHeight - top_ref.current.offsetTop)
    }

    function getIconColor(paneId) {
        return paneId == selected_tab_id ? "white" : "#CED9E0"
    }

    let lib_props = {...props};
    lib_props.usable_width = usable_width;
    lib_props.usable_height = usable_height;
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
                { all_pane }
            </div>
        </Fragment>
    )
}

RepositoryHomeApp = memo(RepositoryHomeApp);


function _repository_home_main() {
    tsocket = new TacticSocket("main", 5000, "repository", library_id);
    tsocket.socket.emit('join-repository', {});
    let RepositoryHomeAppPlus = withTheme(withDialogs(withErrorDrawer(withStatus(RepositoryHomeApp))));
    let domContainer = document.querySelector('#library-home-root');
    ReactDOM.render(<RepositoryHomeAppPlus initial_theme={window.theme}
                                           controlled={false}
                                           tsocket={tsocket}/>, domContainer)
}

_repository_home_main();

import "../tactic_css/tactic.scss";
import "../tactic_css/tactic_table.scss";
import "../tactic_css/library_home.scss";

import React from "react";
import {Fragment, useState, useEffect, useRef, memo} from "react";
import * as ReactDOM from 'react-dom'

import {Tabs, Tab, Tooltip, Icon, Position} from "@blueprintjs/core";
import {Regions} from "@blueprintjs/table";

import {TacticSocket} from "./tactic_socket"
import {handleCallback} from "./communication_react"
import {doFlash} from "./toaster"
import {LibraryPane} from "./library_pane"
import {getUsableDimensions, SIDE_MARGIN, USUAL_TOOLBAR_HEIGHT} from "./sizing_tools";
import {withStatus} from "./toaster";
import {withErrorDrawer} from "./error_drawer";
import {useCallbackStack, useConstructor} from "./utilities_react";
import {guid} from "./utilities_react";
import {TacticNavbar} from "./blueprint_navbar";
import {res_types} from "./library_pane";

import {
    RepositoryCollectionMenubar, RepositoryProjectMenubar, RepositoryTileMenubar,
    RepositoryListMenubar, RepositoryCodeMenubar
} from "./repository_menubars"

export {repository_props, RepositoryHomeApp}

const MARGIN_SIZE = 17;
const TAB_BAR_WIDTH = 50;

let tsocket;

function _repository_home_main() {
    window.library_id = guid();
    tsocket = new TacticSocket(
        "main",
        5000,
        "repository",
        window.library_id
    );
    let RepositoryHomeAppPlus = withErrorDrawer(withStatus(RepositoryHomeApp));
    let domContainer = document.querySelector('#library-home-root');
    ReactDOM.render(<RepositoryHomeAppPlus {...repository_props()}
                                           initial_theme={window.theme}
                                           controlled={false}
                                           tsocket={tsocket}
                                           registerLibraryTabChanger={null}/>, domContainer)
}

function repository_props() {
    return {library_id: guid()}
}

const controllable_props = ["usable_height", "usable_width"];

var initial_pane_states = {};

for (let res_type of res_types) {
    initial_pane_states[res_type] = {
        left_width_fraction: .65,
        selected_resource: {"name": "", "tags": "", "notes": "", "updated": "", "created": ""},
        selected_rows: [],
        tag_button_state: {
            expanded_tags: [],
            active_tag: "all",
            tree: []
        },
        sort_field: "updated",
        sort_direction: "descending",
        filterType: res_type,
        multi_select: false,
        list_of_selected: [],
        search_string: "",
        search_inside: false,
        search_metadata: false,
        selectedRegions: [Regions.row(0)]
    }
}

function RepositoryHomeApp(props) {

    const [selected_tab_id, set_selected_tab_id] = useState();
    const [pane_states, set_pane_state] = useState(initial_pane_states);

    const [usable_height, set_usable_height] = useState(getUsableDimensions(true).usable_height_no_bottom);
    const [usable_width, set_usable_width] = useState(getUsableDimensions(true).usable_width - 170);
    const [dark_theme, set_dark_theme] = useState(props.initial_theme === "dark");

    const top_ref = useRef(null);

    useConstructor(() => {
        if (props.registerLibraryTabChanger) {
            props.registerLibraryTabChanger(_handleTabChange)
        }
    });

    const pushCallback = useCallbackStack();

    useEffect(() => {
        initSocket();
        props.stopSpinner();
        if (!props.controlled) {
            window.dark_theme = dark_theme;
            window.addEventListener("resize", _update_window_dimensions);
            _update_window_dimensions();
        }
        return (() => {
            props.tsocket.disconnect()
        })
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
            tsocket.attachListener("doFlashUser", function (data) {
                doFlash(data)
            });
            tsocket.attachListener('close-user-windows', (data) => {
                if (!(data["originator"] == window.library_id)) {
                    window.close()
                }
            });
        }
    }

    function _updatePaneState(res_type, state_update, callback = null) {
        let old_state = Object.assign({}, pane_states[res_type]);
        let new_pane_states = Object.assign({}, pane_states);
        new_pane_states[res_type] = Object.assign(old_state, state_update);
        set_pane_states(new_pane_states);
        pushCallback(callback)
    }

    function _update_window_dimensions() {
        if (!props.controlled) {
            let uwidth = window.innerWidth - 2 * SIDE_MARGIN;
            let uheight = window.innerHeight;
            if (top_ref && top_ref.current) {
                uheight = uheight - top_ref.current.offsetTop;
            } else {
                uheight = uheight - USUAL_TOOLBAR_HEIGHT
            }
            set_usable_height(uheight);
            set_usable_width(uwidth)
        }
    }

    function _setTheme(dark_theme) {
        set_dark_theme(dark_theme);
        pushCallback(() => {
            window.dark_theme = dark_theme
        })
    }

    function _handleTabChange(newTabId, prevTabId, event) {
        set_selected_tab_id(newTabId);
        pushCallback(_update_window_dimensions)
    }

    function getIconColor(paneId) {
        return paneId == selected_tab_id ? "white" : "#CED9E0"
    }

    let tsocket = props.tsocket;
    let actual_dark_theme = props.controlled ? props.dark_theme : dark_theme;
    let lib_props = {...props};
    if (!props.controlled) {
        lib_props.usable_width = usable_width - TAB_BAR_WIDTH;
        lib_props.usable_height = usable_height;
    }
    let collection_pane = (
        <LibraryPane {...lib_props}
                     pane_type="collection"
                     allow_search_inside={false}
                     allow_search_metadata={false}
                     MenubarClass={RepositoryCollectionMenubar}
                     updatePaneState={_updatePaneState}
                     {...pane_states["collection"]}
                     {...props.errorDrawerFuncs}
                     errorDrawerFuncs={props.errorDrawerFuncs}
                     is_repository={true}/>
    );
    let projects_pane = (<LibraryPane {...lib_props}
                                      pane_type="project"
                                      allow_search_inside={false}
                                      allow_search_metadata={true}
                                      MenubarClass={RepositoryProjectMenubar}
                                      updatePaneState={_updatePaneState}
                                      {...pane_states["project"]}
                                      {...props.errorDrawerFuncs}
                                      errorDrawerFuncs={props.errorDrawerFuncs}
                                      is_repository={true}/>
    );
    let tiles_pane = (<LibraryPane {...lib_props}
                                   pane_type="tile"
                                   allow_search_inside={true}
                                   allow_search_metadata={true}
                                   MenubarClass={RepositoryTileMenubar}
                                   updatePaneState={_updatePaneState}
                                   {...pane_states["tile"]}
                                   {...props.errorDrawerFuncs}
                                   errorDrawerFuncs={props.errorDrawerFuncs}
                                   is_repository={true}/>
    );
    let lists_pane = (<LibraryPane {...lib_props}
                                   pane_type="list"
                                   allow_search_inside={true}
                                   allow_search_metadata={true}
                                   MenubarClass={RepositoryListMenubar}
                                   updatePaneState={_updatePaneState}
                                   {...pane_states["list"]}
                                   {...props.errorDrawerFuncs}
                                   errorDrawerFuncs={props.errorDrawerFuncs}
                                   is_repository={true}/>
    );
    let code_pane = (<LibraryPane {...lib_props}
                                  pane_type="code"
                                  allow_search_inside={true}
                                  allow_search_metadata={true}
                                  MenubarClass={RepositoryCodeMenubar}
                                  updatePaneState={_updatePaneState}
                                  {...pane_states["code"]}
                                  {...props.errorDrawerFuncs}
                                  errorDrawerFuncs={props.errorDrawerFuncs}
                                  is_repository={true}/>
    );
    let outer_style = {
        width: "100%",
        height: usable_height,
        paddingLeft: 0
    };
    let outer_class = "";
    if (!props.controlled) {
        outer_class = "library-pane-holder  ";
        if (dark_theme) {
            outer_class = `${outer_class} bp5-dark`;
        } else {
            outer_class = `${outer_class} light-theme`;
        }
    }
    return (
        <Fragment>
            {!props.controlled &&
                <TacticNavbar is_authenticated={window.is_authenticated}
                              dark_theme={dark_theme}
                              setTheme={_setTheme}
                              selected={null}
                              page_id={props.library_id}
                              show_api_links={false}
                              extra_text={window.repository_type == "Local" ? "" : window.repository_type}
                              user_name={window.username}/>
            }
            <div id="repository_container" className={outer_class} ref={top_ref} style={outer_style}>
                <div style={{width: lib_props.usable_width}}>
                    <Tabs id="the_container" style={{marginTop: 100}}
                          selectedTabId={selected_tab_id}
                          renderActiveTabPanelOnly={true}
                          vertical={true} large={true} onChange={_handleTabChange}>
                        <Tab id="collections-pane" panel={collection_pane}>
                            <Tooltip content="Collections" position={Position.RIGHT}>
                                <Icon icon="box" size={20} tabIndex={-1} color={getIconColor("collections-pane")}/>
                            </Tooltip>
                        </Tab>
                        <Tab id="projects-pane" panel={projects_pane}>
                            <Tooltip content="Projects" position={Position.RIGHT}>
                                <Icon icon="projects" size={20} tabIndex={-1}
                                      color={getIconColor("projects-pane")}/>
                            </Tooltip>
                        </Tab>
                        <Tab id="tiles-pane" panel={tiles_pane}>
                            <Tooltip content="Tiles" position={Position.RIGHT}>
                                <Icon icon="application" size={20} tabIndex={-1}
                                      color={getIconColor("tiles-pane")}/>
                            </Tooltip>
                        </Tab>
                        <Tab id="lists-pane" panel={lists_pane}>
                            <Tooltip content="Lists" position={Position.RIGHT}>
                                <Icon icon="list" size={20} tabIndex={-1} color={getIconColor("lists-pane")}/>
                            </Tooltip>
                        </Tab>
                        <Tab id="code-pane" panel={code_pane}>
                            <Tooltip content="Code" position={Position.RIGHT}>
                                <Icon icon="code" tabIndex={-1} color={getIconColor("code-pane")}/>
                            </Tooltip>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </Fragment>
    )
}

RepositoryHomeApp = memo(RepositoryHomeApp);

if (!window.in_context) {
    _repository_home_main();
}

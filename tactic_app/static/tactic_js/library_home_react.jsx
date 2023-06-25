// noinspection JSCheckFunctionSignatures

import "../tactic_css/tactic.scss";
import "../tactic_css/tactic_table.scss";
import "../tactic_css/library_home.scss";

import React from "react";
import * as ReactDOM from 'react-dom'
import PropTypes from 'prop-types';
import {Fragment, useState, useEffect, useRef, memo} from "react";

import {Tabs, Tab, Tooltip, Icon, Position} from "@blueprintjs/core";

import {TacticOmnibar} from "./TacticOmnibar";
import {TacticSocket} from "./tactic_socket";
import {handleCallback} from "./communication_react";
import {doFlash} from "./toaster.js";
import {LibraryPane} from "./library_pane";
import {icon_dict} from "./blueprint_mdata_fields";
import {getUsableDimensions} from "./sizing_tools";
import {withStatus} from "./toaster";
import {withErrorDrawer} from "./error_drawer";
import {KeyTrap} from "./key_trap";
import {guid, useCallbackStack, useConstructor, useStateAndRef} from "./utilities_react";
import {TacticNavbar} from "./blueprint_navbar";
import {
    AllMenubar, CollectionMenubar, ProjectMenubar, TileMenubar,
    ListMenubar, CodeMenubar
} from "./library_menubars"

const TAB_BAR_WIDTH = 50;

export {LibraryHomeApp}

function _library_home_main() {
    const library_id = guid();
    const tsocket = new TacticSocket("main", 5000, library_id);
    const LibraryHomeAppPlus = withErrorDrawer(withStatus(LibraryHomeApp));
    const domContainer = document.querySelector('#library-home-root');
    ReactDOM.render(<LibraryHomeAppPlus library_id={library_id}
                                        tsocket={tsocket}
                                        registerOmniFunction={null}
                                        controlled={false}
                                        initial_theme={window.theme}
                                        registerLibraryTabChanger={null}/>, domContainer)
}

const tab_panes = ["all-pane", "collections-pane", "projects-pane", "tiles-pane", "lists-pane", "code-pane"];
const controllable_props = ["usable_width", "usable_height"];

function LibraryHomeApp(props) {

    const omniGetters = useRef({});
    const [selected_tab_id, set_selected_tab_id, selected_tab_id_ref] = useStateAndRef("all-pane");
    const [showOmnibar, setShowOmnibar] = useState(false);
    const [usable_height, set_usable_height] = useState(null);
    const [usable_width, set_usable_width] = useState(null);
    const [dark_theme, set_dark_theme] = useState(null);

    const pushCallback = useCallbackStack();

    const top_ref = useRef(null);

    const key_bindings = [
        [["ctrl+space"], _showOmnibar],
        [["tab"], _goToNextPane],
        [["shift+tab"], _goToPreviousPane]
    ];

    useConstructor(() => {
        if (props.registerOmniFunction) {
            props.registerOmniFunction(_omniFunction);
        }
        if (props.registerLibraryTabChanger) {
            props.registerLibraryTabChanger(_handleTabChange)
        }
        if (!window.in_context) {
            const aheight = getUsableDimensions(true).usable_height_no_bottom;
            const awidth = getUsableDimensions(true).usable_width - 170;
            set_usable_height(aheight);
            set_usable_width(awidth);
            set_dark_theme(props.initial_theme === "dark");
        }
    });

    useEffect(() => {
        initSocket();
        props.stopSpinner(null);
        if (!props.controlled) {
            window.dark_theme = dark_theme;
            window.addEventListener("resize", _handleResize);
            _handleResize();
        }
        return (() => {
            props.tsocket.disconnect()
        })
    }, []);

    function initSocket() {
        props.tsocket.attachListener('handle-callback', (task_packet) => {
            handleCallback(task_packet, props.library_id)
        });
        props.tsocket.attachListener("window-open", data => window.open(`${$SCRIPT_ROOT}/load_temp_page/${data["the_id"]}`));
        props.tsocket.attachListener("doFlash", function (data) {
            doFlash(data)
        });
        if (!window.in_context) {

            props.tsocket.attachListener("doFlashUser", function (data) {
                doFlash(data)
            });
            props.tsocket.attachListener('close-user-windows', (data) => {
                if (!(data["originator"] == library_id)) {
                    window.close()
                }
            });
        }
    }

    function _showOmnibar() {
        setShowOmnibar(true)
    }

    function _closeOmnibar() {
        setShowOmnibar(false)
    }

    function _omniFunction() {
        let omni_items = [];
        for (let ogetter in omniGetters.current) {
            omni_items = omni_items.concat(omniGetters.current[ogetter]())
        }
        return omni_items
    }

    function _registerOmniGetter(name, the_function) {
        omniGetters.current[name] = the_function
    }

    function _setTheme(dark_theme) {
        set_dark_theme(dark_theme);
        pushCallback(() => {
            window.dark_theme = dark_theme
        })
    }

    // This mechanism in _handleTabChange necessary in order to force the pane to change
    // before updating window dimensions (which seems to be necessary to get
    // the pane to be appropriately sized when it's shown
    function _handleTabChange(newTabId, prevTabId, event) {
        set_selected_tab_id(newTabId)
    }

    function _goToNextPane() {
        let tabIndex = tab_panes.indexOf(selected_tab_id_ref.current) + 1;
        if (tabIndex === tab_panes.length) {
            tabIndex = 0
        }
        set_selected_tab_id(tab_panes[tabIndex])
    }

    function _goToPreviousPane() {
        let tabIndex = tab_panes.indexOf(selected_tab_id_ref.current) - 1;
        if (tabIndex === -1) {
            tabIndex = tab_panes.length - 1
        }
        set_selected_tab_id(tab_panes[tabIndex])
    }

    function getIconColor(paneId) {
        return paneId === selected_tab_id_ref.current ? "white" : "#CED9E0"
    }

    function _handleResize() {
        set_usable_width(window.innerWidth - top_ref.current.offsetLeft);
        set_usable_height(window.innerHeight - top_ref.current.offsetTop)
    }

    let real_dark_theme = props.controlled ? props.dark_theme : dark_theme;
    let lib_props = {...props};
    if (!props.controlled) {
        lib_props.usable_width = usable_width - TAB_BAR_WIDTH;
        lib_props.usable_height = usable_height;
    }
    let get_all_panes = !window.in_context || window.library_style == "tabbed";
    let all_pane = (
        <LibraryPane {...lib_props}
                     columns={{
                         "icon:th": {"sort_field": "type", "first_sort": "ascending"},
                         "name": {"sort_field": "name", "first_sort": "ascending"},
                         "icon:upload": {"sort_field": null, "first_sort": "ascending"},
                         "created": {"sort_field": "created_for_sort", "first_sort": "descending"},
                         "updated": {"sort_field": "updated_for_sort", "first_sort": "ascending"},
                         "tags": {"sort_field": "tags", "first_sort": "ascending"},
                         "size": {"sort_field": "size_for_sort", "first_sort": "descending"}
                     }}
                     pane_type="all"
                     handleCreateViewer={props.handleCreateViewer}
                     open_resources={props.open_resources ? props.open_resources["all"] : null}
                     allow_search_inside={true}
                     allow_search_metadata={true}
                     MenubarClass={AllMenubar}
                     registerOmniGetter={_registerOmniGetter}
                     {...props.errorDrawerFuncs}
                     errorDrawerFuncs={props.errorDrawerFuncs}
                     library_id={props.library_id}
        />
    );
    if (get_all_panes) {
        var collection_pane = (
            <LibraryPane {...lib_props}
                         columns={{
                             "icon:th": {"sort_field": "type", "first_sort": "ascending"},
                             "name": {"sort_field": "name", "first_sort": "ascending"},
                             "created": {"sort_field": "created_for_sort", "first_sort": "descending"},
                             "updated": {"sort_field": "updated_for_sort", "first_sort": "ascending"},
                             "tags": {"sort_field": "tags", "first_sort": "ascending"},
                             "size": {"sort_field": "size_for_sort", "first_sort": "descending"}
                         }}
                         pane_type="collection"
                         handleCreateViewer={props.handleCreateViewer}
                         open_resources={props.open_resources ? props.open_resources["collection"] : null}
                         allow_search_inside={false}
                         allow_search_metadata={false}
                         MenubarClass={CollectionMenubar}
                         registerOmniGetter={_registerOmniGetter}
                         {...props.errorDrawerFuncs}
                         errorDrawerFuncs={props.errorDrawerFuncs}
                         library_id={props.library_id}
            />
        );
        var projects_pane = (
            <LibraryPane {...lib_props}
                         columns={{
                             "icon:th": {"sort_field": "type", "first_sort": "ascending"},
                             "name": {"sort_field": "name", "first_sort": "ascending"},
                             "created": {"sort_field": "created_for_sort", "first_sort": "descending"},
                             "updated": {"sort_field": "updated_for_sort", "first_sort": "ascending"},
                             "tags": {"sort_field": "tags", "first_sort": "ascending"},
                             "size": {"sort_field": "size_for_sort", "first_sort": "descending"}
                         }}
                         pane_type="project"
                         handleCreateViewer={props.handleCreateViewer}
                         open_resources={props.open_resources ? props.open_resources["project"] : null}
                         allow_search_inside={false}
                         allow_search_metadata={true}
                         MenubarClass={ProjectMenubar}
                         registerOmniGetter={_registerOmniGetter}
                         {...props.errorDrawerFuncs}
                         library_id={props.library_id}
            />
        );
        var tiles_pane = (
            <LibraryPane {...lib_props}
                         columns={{
                             "icon:th": {"sort_field": "type", "first_sort": "ascending"},
                             "name": {"sort_field": "name", "first_sort": "ascending"},
                             "icon:upload": {"sort_field": null, "first_sort": "ascending"},
                             "created": {"sort_field": "created_for_sort", "first_sort": "descending"},
                             "updated": {"sort_field": "updated_for_sort", "first_sort": "ascending"},
                             "tags": {"sort_field": "tags", "first_sort": "ascending"}
                         }}
                         pane_type="tile"
                         handleCreateViewer={props.handleCreateViewer}
                         open_resources={props.open_resources ? props.open_resources["tile"] : null}
                         allow_search_inside={true}
                         allow_search_metadata={true}
                         MenubarClass={TileMenubar}
                         registerOmniGetter={_registerOmniGetter}
                         {...props.errorDrawerFuncs}
                         library_id={props.library_id}
            />
        );
        var lists_pane = (
            <LibraryPane {...lib_props}
                         columns={{
                             "icon:th": {"sort_field": "type", "first_sort": "ascending"},
                             "name": {"sort_field": "name", "first_sort": "ascending"},
                             "created": {"sort_field": "created_for_sort", "first_sort": "descending"},
                             "updated": {"sort_field": "updated_for_sort", "first_sort": "ascending"},
                             "tags": {"sort_field": "tags", "first_sort": "ascending"},
                         }}
                         pane_type="list"
                         open_resources={props.open_resources ? props.open_resources["list"] : null}
                         allow_search_inside={true}
                         allow_search_metadata={true}
                         MenubarClass={ListMenubar}
                         registerOmniGetter={_registerOmniGetter}
                         {...props.errorDrawerFuncs}
                         library_id={props.library_id}
            />
        );
        var code_pane = (
            <LibraryPane {...lib_props}
                         columns={{
                             "icon:th": {"sort_field": "type", "first_sort": "ascending"},
                             "name": {"sort_field": "name", "first_sort": "ascending"},
                             "created": {"sort_field": "created_for_sort", "first_sort": "descending"},
                             "updated": {"sort_field": "updated_for_sort", "first_sort": "ascending"},
                             "tags": {"sort_field": "tags", "first_sort": "ascending"},
                         }}
                         pane_type="code"
                         handleCreateViewer={props.handleCreateViewer}
                         open_resources={props.open_resources ? props.open_resources["code"] : null}
                         allow_search_inside={true}
                         allow_search_metadata={true}
                         MenubarClass={CodeMenubar}
                         registerOmniGetter={_registerOmniGetter}
                         {...props.errorDrawerFuncs}
                         library_id={props.library_id}
            />
        );
    }
    let outer_style = {
        width: "100%",
        paddingLeft: 0
    };
    let outer_class = "";
    if (!props.controlled) {
        outer_class = "library-pane-holder  ";
        if (dark_theme) {
            outer_class = `${outer_class} bp4-dark`;
        } else {
            outer_class = `${outer_class} light-theme`;
        }
    }
    var extra_tabs = [];
    if (get_all_panes) {
        let tab_specs = [
            ["collections", "collection", collection_pane],
            ["projects", "project", projects_pane],
            ["tiles", "tile", tiles_pane],
            ["lists", "list", lists_pane],
            ["code", "code", code_pane],
        ];
        for (let tlist of tab_specs) {
            let new_tab = (
                <Tab id={tlist[0] + "-pane"} panel={tlist[2]}>
                    <Tooltip content={tlist[0]} position={Position.RIGHT} intent="warning">
                        <Icon icon={icon_dict[tlist[1]]} iconSize={20} tabIndex={-1}
                              color={getIconColor(tlist[0] + "-pane")}/>
                    </Tooltip>
                </Tab>
            );
            extra_tabs.push(new_tab)
        }
    }

    return (
        <Fragment>
            {!props.controlled &&
                <TacticNavbar is_authenticated={window.is_authenticated}
                              dark_theme={dark_theme}
                              registerOmniFunction={(register_func) => _registerOmniFunction("navbar", register_func)}
                              set_theme={props.controlled ? props.setTheme : _setTheme}
                              selected={null}
                              show_api_links={false}
                              extra_text={window.database_type == "Local" ? "" : window.database_type}
                              page_id={props.library_id}
                              user_name={window.username}/>
            }
            <div className={outer_class} ref={top_ref} style={outer_style}>
                <Tabs id="the_container" style={{marginTop: 100, height: "100%"}}
                      selectedTabId={selected_tab_id_ref.current}
                      renderActiveTabPanelOnly={true}
                      vertical={true} large={true} onChange={_handleTabChange}>
                    <Tab id="all-pane" panel={all_pane}>
                        <Tooltip content="All" position={Position.RIGHT} intent="warning">
                            <Icon icon={icon_dict["all"]} iconSize={20} tabIndex={-1} color={getIconColor("all-pane")}/>
                        </Tooltip>
                    </Tab>
                    {extra_tabs}
                </Tabs>
            </div>

            {!window.in_context &&
                <Fragment>
                    <TacticOmnibar omniGetters={[_omniFunction]}
                                   showOmnibar={showOmnibar}
                                   closeOmnibar={_closeOmnibar}
                    />
                    <KeyTrap global={true} bindings={key_bindings}/>
                </Fragment>
            }
        </Fragment>
    )
}

LibraryHomeApp = memo(LibraryHomeApp);

LibraryHomeApp.propTypes = {
    open_resources: PropTypes.object
};

LibraryHomeApp.defaultProps = {
    open_resources: null
};


if (!window.in_context) {
    _library_home_main();
}


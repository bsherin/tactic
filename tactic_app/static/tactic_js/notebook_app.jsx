import "../tactic_css/tactic.scss";
import "../tactic_css/tactic_console.scss";
import "../tactic_css/tactic_main.scss";

import React from "react";
import {Fragment, useEffect, useRef, memo, useMemo, useContext, useReducer, useCallback} from "react";
import { createRoot } from 'react-dom/client';

import {TacticNavbar} from "./blueprint_navbar";
import {TacticMenubar} from "./menu_utilities";
import {ProjectMenu} from "./main_menus_react";
import {ConsoleComponent} from "./console_component";
import {consoleItemsReducer} from "./console_support";
import {doFlash, StatusContext} from "./toaster"
import {withStatus} from "./toaster";
import {renderSpinnerMessage, SelectedPaneContext, useConnection, useStateAndRef} from "./utilities_react";

import {postAjaxPromise, postAjax} from "./communication_react"
import {ExportsViewer} from "./export_viewer_react";
import {HorizontalPanes} from "./resizing_layouts2";
import {ErrorDrawerContext, withErrorDrawer} from "./error_drawer";
import {withSizeContext, useSize, SizeProvider} from "./sizing_tools";
import {useCallbackStack, useConstructor, useReducerAndRef} from "./utilities_react";
import {notebook_props, notebookReducer} from "./notebook_support";

import {withTheme, ThemeContext} from "./theme";
import {withDialogs} from "./modal_react";


const MARGIN_SIZE = 10;
const BOTTOM_MARGIN = 35;
const MARGIN_ADJUSTMENT = 8; // This is the amount at the top of both the table and the conso
const MENU_BAR_HEIGHT = 30; // will only appear when in context

const cc_style = {marginTop: MARGIN_SIZE};

export {NotebookApp}

function NotebookApp(props) {
    props = {
        refreshTab: null,
        closeTab: null,
        ...props
    };

    const last_save = useRef({});
    const main_outer_ref = useRef(null);
    const updateExportsList = useRef(null);
    const connection_status = useConnection(props.tsocket, initSocket);
    const [console_selected_items, set_console_selected_items, console_selected_items_ref] = useStateAndRef([]);

    const [console_items, dispatch, console_items_ref] = useReducerAndRef(consoleItemsReducer, []);
    const [mState, mDispatch] = useReducer(notebookReducer, {
        show_exports_pane: props.is_project && props.interface_state ? props.interface_state["show_exports_pane"] : true,
        console_width_fraction: props.is_project && props.interface_state ? props.interface_state["console_width_fraction"] : .5,
        console_is_zoomed: true,
        console_is_shrunk: false,
        resource_name: props.resource_name,
        is_project: props.is_project,
    });
    const theme = useContext(ThemeContext);
    const statusFuncs = useContext(StatusContext);
    const errorDrawerFuncs = useContext(ErrorDrawerContext);

    const pushCallback = useCallbackStack();
    const selectedPane = useContext(SelectedPaneContext);
    const [usable_width, usable_height, topX, topY] = useSize(main_outer_ref, 0, "NotebookApp");

    useConstructor(()=>{
        dispatch({
            type: "initialize",
            new_items: props.is_project && props.interface_state ? props.interface_state["console_items"] : []
        })
    });

    useEffect(() => {
        if (props.controlled) {
            props.registerDirtyMethod(_dirty);
        } else {
            window.addEventListener("beforeunload", function (e) {
                if (_dirty()) {
                    e.preventDefault();
                    e.returnValue = ''
                }
            });
        }
        function sendRemove() {
            console.log("got the beacon");
            navigator.sendBeacon("/remove_mainwindow", JSON.stringify({"main_id": props.main_id}));
        }
        window.addEventListener("unload", sendRemove);
        _updateLastSave();
        statusFuncs.stopSpinner();

        if (!props.controlled) {
            document.title = mState.resource_name;
        }

        return (() => {
            delete_my_containers();
            window.removeEventListener("unload", sendRemove);
        })
    }, []);

    function am_selected() {
        return selectedPane.amSelected(selectedPane.tab_id, selectedPane.selectedTabIdRef)
    }

    function _cProp(pname) {
        return props.controlled ? props[pname] : mState[pname]
    }

    const save_state = {
        console_items: console_items,
        show_exports_pane: mState.show_exports_pane,
        console_width_fraction: mState.console_width_fraction
    };

    const _setMainStateValue = useCallback(function (field_name, new_value, callback=null) {
        mDispatch({
            type: "change_field",
            field: field_name,
            new_value: new_value
        });
        pushCallback(callback)
    }, []);

    function _updateLastSave() {
        last_save.current = save_state
    }

    function _dirty() {
        let current_state = save_state;
        for (let k in current_state) {
            if (current_state[k] != last_save.current[k]) {
                return true
            }
        }
        return false
    }

    function delete_my_containers() {
        postAjax("/remove_mainwindow", {"main_id": props.main_id});
    }

    function initSocket() {

        props.tsocket.attachListener("window-open", data => {
            window.open(`${$SCRIPT_ROOT}/load_temp_page/${data["the_id"]}`)
        });

        if (!window.in_context) {
            props.tsocket.attachListener("doFlashUser", function (data) {
                doFlash(data)
            });

            props.tsocket.attachListener('close-user-windows', function (data) {
                if (!(data["originator"] == main_id)) {
                    window.close()
                }
            });
        }
    }

    const _handleConsoleFractionChange = useCallback((left_width, right_width, new_fraction)=>{
        _setMainStateValue("console_width_fraction", new_fraction)
    }, []);

    function _setProjectName(new_project_name, callback = null) {
        if (props.controlled) {
            props.updatePanel({
                res_type: "project",
                title: new_project_name,
                panel: {resource_name: new_project_name, is_project: true}
            }, () => {
                pushCallback(callback)
            })
        } else {
            mDispatch({
                type: "change_multiple_fields",
                newPartialState: {
                    resource_name: new_project_name,
                    is_project: true
                }
            });
            pushCallback(callback);
        }
    }

    let my_props = {...props};
    if (!props.controlled) {
        my_props.resource_name = mState.resource_name;
        my_props.is_project = mState.is_project
    }
    let project_name = my_props.is_project ? props.resource_name : "";
    let menus = (
        <Fragment>
            <ProjectMenu main_id={props.main_id}
                         project_name={project_name}
                         is_notebook={true}
                         is_juptyer={props.is_jupyter}
                         setProjectName={_setProjectName}
                         console_items={console_items_ref.current}
                         tile_list={[]}
                         mState={mState}
                         setMainStateValue={_setMainStateValue}
                         updateLastSave={_updateLastSave}
                         changeCollection={null}
                         disabled_items={my_props.is_project ? [] : ["Save"]}
                         hidden_items={["Open Console as Notebook", "Export Table as Collection", "divider2", "Change collection"]}
            />
        </Fragment>
    );
    let console_pane = (
        <ConsoleComponent main_id={props.main_id}
                          tsocket={props.tsocket}
                          handleCreateViewer={props.handleCreateViewer}
                          controlled={props.controlled}
                          console_items={console_items_ref}
                          console_selected_items_ref={console_selected_items_ref}
                          set_console_selected_items={set_console_selected_items}
                          dispatch={dispatch}
                          mState={mState}
                          setMainStateValue={_setMainStateValue}
                          zoomable={false}
                          shrinkable={false}
                          style={cc_style}
        />
    );
    let exports_pane;
    if (mState.show_exports_pane) {
        exports_pane = <ExportsViewer main_id={props.main_id}
                                      tsocket={props.tsocket}
                                      setUpdate={(ufunc) => {
                                          updateExportsList.current = ufunc
                                      }}
                                      console_is_shrunk={mState.console_is_shrunk}
                                      console_is_zoomed={mState.console_is_zoomed}
                                      style={cc_style}
        />
    } else {
        exports_pane = <div></div>
    }

    const outer_style = useMemo(()=>{
        return {width: "100%", height: usable_height}
    }, [usable_height]);

    return (
        <Fragment>
            {!window.in_context &&
                <TacticNavbar is_authenticated={window.is_authenticated}
                              user_name={window.username}
                              menus={null}
                              page_id={props.main_id}
                />
            }

            <TacticMenubar connection_status={connection_status}
                           menus={menus}
                           showRefresh={true}
                           showClose={true}
                           page_id={props.main_id}
                           refreshTab={props.refreshTab}
                           closeTab={props.closeTab}
                           resource_name={_cProp("resource_name")}
                           showErrorDrawerButton={true}
            />
            <div className={`main-outer ${theme.dark_theme ? "bp5-dark" : "light-theme"}`}
                 ref={main_outer_ref}
                 style={outer_style}>
                <SizeProvider value={{
                    availableWidth: usable_width,
                    availableHeight: usable_height - BOTTOM_MARGIN,
                    topX: topX,
                    topY: topY
                }}>
                <HorizontalPanes left_pane={console_pane}
                                 right_pane={exports_pane}
                                 show_handle={true}
                                 initial_width_fraction={mState.console_width_fraction}
                                 controlled={true}
                                 dragIconSize={15}
                                 handleSplitUpdate={_handleConsoleFractionChange}
                />
            </SizeProvider>
            </div>
        </Fragment>
    )

}

NotebookApp = memo(NotebookApp);

function main_main() {
    function gotProps(the_props) {
        let NotebookAppPlus = withSizeContext(withTheme(withDialogs(withErrorDrawer(withStatus(NotebookApp)))));
        let the_element = <NotebookAppPlus {...the_props}
                                           controlled={false}
                                           initial_theme={window.theme}
                                           changeName={null}
        />;
        const domContainer = document.querySelector('#main-root');
        const root = createRoot(domContainer);
        root.render(the_element)
    }

    renderSpinnerMessage("Starting up ...");
    var target = window.is_new_notebook ? "new_notebook_in_context" : "main_project_in_context";
    var resource_name = window.is_new_notebook ? "" : window.project_name;

    let post_data = {"resource_name": resource_name};
    if (window.is_new_notebook) {
        post_data.temp_data_id = window.temp_data_id
    }

    postAjaxPromise(target, post_data)
        .then((data) => {
            notebook_props(data, null, gotProps)
        })
}


if (!window.in_context) {
    main_main();
}


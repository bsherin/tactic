import {TacticSocket, useConnection} from "./tactic_socket";
import {get_ppi, guid} from "./utilities_react";

if (!window.in_context) {
    import("../tactic_css/tactic.scss");
    import("../tactic_css/tactic_console.scss");
    import("../tactic_css/tactic_main.scss");
    import ("../tactic_css/themeable.scss");
}

import React from "react";
import {Fragment, useEffect, useRef, memo, useContext, useCallback} from "react";
import { createRoot } from 'react-dom/client';

import {TacticNavbar} from "./blueprint_navbar";
import {TacticMenubar} from "./menu_utilities";
import {ProjectMenu, ViewMenu} from "./main_menus_react";
import {ConsoleComponent} from "./console_component";
import {consoleItemsReducer, createConsoleUndoAction} from "./console_support";
import {withUndo, makeUndoable, UndoContext} from "./undo";
import {doFlash, StatusContext} from "./toaster"
import {withStatus} from "./toaster";
import {renderSpinnerMessage, useStateAndRef, withRegisterActivity} from "./utilities_react";
import {ICON_BAR_WIDTH} from "./sizing_tools";

import {
    postPromise,
    handleCallback,
    postWithCallbackMain,
    postWithCallback
} from "./communication_react"
import {ExportsViewer} from "./export_viewer_react";
import {HorizontalPanes} from "./resizing_allotment";
import {withErrorDrawer} from "./error_drawer";
import {MetadataContext} from "./metadata_drawer";
import {withAssistant} from "./assistant";
import {useCallbackStack, useConstructor, useReducerAndRef} from "./utilities_react";
import {notebook_props, notebookReducer} from "./notebook_support";

import {withSettings, SettingsContext} from "./settings";
import {withDialogs, DialogContext} from "./modal_react";
import {MetadataDrawer} from "./metadata_drawer";

export {NotebookApp}

function NotebookApp(props) {
    props = {
        refreshTab: null,
        closeTab: null,
        ...props
    };

    const last_save = useRef({});
    const updateExportsList = useRef(null);
    const connection_status = useConnection(props.tsocket, initSocket);
    const [, set_console_selected_items, console_selected_items_ref] = useStateAndRef([]);
    const  {undoStackRef} = useContext(UndoContext);


    const [console_items, dispatchBase, console_items_ref] = useReducerAndRef(consoleItemsReducer, []);
    const dispatch = makeUndoable(dispatchBase,console_items_ref, createConsoleUndoAction, undoStackRef);
    const [mState, mDispatch, mStateRef] = useReducerAndRef(notebookReducer, {
        show_exports_pane: props.is_project && props.interface_state ? props.interface_state["show_exports_pane"] : true,
        console_width_fraction: props.is_project && props.interface_state && "console_width_fraction" in props.interface_state
            ? props.interface_state["console_width_fraction"] : .5,
        console_is_zoomed: true,
        console_is_shrunk: false,
        resource_name: props.resource_name,
        is_project: props.is_project,
        show_metadata: false,
        pseudoTileStatus: "not initialized",

    });
    const settingsContext = useContext(SettingsContext);
    const statusFuncs = useContext(StatusContext);
    const dialogFuncs = useContext(DialogContext)

    const pushCallback = useCallbackStack();

    useConstructor(()=>{
        dispatch({
            type: "initialize",
            new_items: props.is_project && props.interface_state ? props.interface_state["console_items"] : []
        }, true)
    });

    useEffect(() => {
        if (props.controlled) {
            props.registerDirtyMethod(_dirty);
        } else {
            window.addEventListener("beforeunload", function (e) {
                if (_dirty()) {
                    e.preventDefault();
                }
                postWithCallback("host", "end_client_session_task", {global_id: window.global_id, force_forward: true})
                props.tsocket.disconnect()
            });
        }
        function sendRemove() {
            console.log("got the beacon");
            navigator.sendBeacon("/remove_mainwindow", JSON.stringify({"local_id": props.local_id}));
        }
        window.addEventListener("unload", sendRemove);
        _updateLastSave();
        statusFuncs.stopSpinner();

        if (!props.controlled) {
            document.title = mState.resource_name;
        }
        getPseudoTileStatus();
        return (() => {
            if (props.controlled) {
                postWithCallbackMain(props.local_id, "end_main_session_task", {sid: props.local_id})
            }
            window.removeEventListener("unload", sendRemove);
        })
    }, []);

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

    function initSocket(theSocket) {

        theSocket.attachListener("window-open", data => {
            window.open(`${$SCRIPT_ROOT}/load_temp_page/${data["the_id"]}`)
        });
        theSocket.attachListener("pseudo-tile-status", updatePseudoTileStatus);
        if (!window.in_context) {
            theSocket.attachListener("doFlashUser", function (data) {
                doFlash(data)
            });

            theSocket.attachListener('close-user-windows', function (data) {
                if (!(data["originator"] == window.global_id)) {
                    window.close()
                }
            });
            theSocket.attachListener("endSession", function () {
                dialogFuncs.showModal("EndSessionDialog", {})
            })

        }

    }

    function updatePseudoTileStatus(data) {
        if (mState.pseudoTileStatus == "loaded") {
            return
        }
        setPseudoTileStatus(data.status);
    }

    function setPseudoTileStatus(status) {
        _setMainStateValue("pseudoTileStatus", status);
    }

    function getPseudoTileStatus() {
        postPromise("main_service", "get_pseudo_tile_status", {"sid": props.local_id}, props.local_id)
            .then((data) => {
                updatePseudoTileStatus(data);
            }
        )
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

    const showMetadata = useCallback(()=>{
        _setMainStateValue("show_metadata", true);
    }, []);

    const hideMetadata = useCallback(()=>{
        _setMainStateValue("show_metadata", false);
    }, []);

    const toggleMetadata = useCallback(()=>{
        _setMainStateValue("show_metadata", !mStateRef.current.show_metadata)
    }, []);

    let my_props = {...props};
    if (!props.controlled) {
        my_props.resource_name = mState.resource_name;
        my_props.is_project = mState.is_project
    }
    let project_name = my_props.is_project ? props.resource_name : "";
    let menus = (
        <Fragment>
            <ProjectMenu local_id={props.local_id}
                         project_name={project_name}
                         is_notebook={true}
                         is_juptyer={props.is_jupyter}
                         setProjectName={_setProjectName}
                         console_items={console_items_ref.current}
                         dispatch={dispatch}
                         pushCallback={pushCallback}
                         tile_list={[]}
                         mState={mState}
                         setMainStateValue={_setMainStateValue}
                         updateLastSave={_updateLastSave}
                         changeCollection={null}
                         disabled_items={my_props.is_project ? [] : ["Save"]}
                         hidden_items={["Open Console as Notebook", "Export Table as Collection", "divider2", "Change collection"]}
            />
            <ViewMenu local_id={props.local_id}
                      project_name={project_name}
                      is_notebook={true}
                      is_juptyer={props.is_jupyter}
                      table_is_shrunk={true}
                      toggleTableShrink={null}
                      show_exports_pane={mState.show_exports_pane}
                      show_console_pane={true}
                      show_metadata={mState.show_metadata}
                      setMainStateValue={_setMainStateValue}
            />
        </Fragment>
    );
    let console_pane = (
        <ConsoleComponent local_id={props.local_id}
                          tsocket={props.tsocket}
                          handleCreateViewer={props.handleCreateViewer}
                          controlled={props.controlled}
                          console_items={console_items_ref}
                          console_items_not_ref={console_items}
                          console_selected_items_ref={console_selected_items_ref}
                          set_console_selected_items={set_console_selected_items}
                          dispatch={dispatch}
                          mState={mState}
                          setMainStateValue={_setMainStateValue}
                          zoomable={false}
                          shrinkable={false}
        />
    );
    let exports_pane;
    if (mState.show_exports_pane) {
        exports_pane = <ExportsViewer local_id={props.local_id}
                                      tsocket={props.tsocket}
                                      setUpdate={(ufunc) => {
                                          updateExportsList.current = ufunc
                                      }}
                                      console_is_shrunk={mState.console_is_shrunk}
                                      console_is_zoomed={mState.console_is_zoomed}
        />
    } else {
        exports_pane = <div></div>
    }

    let outer_style = {
        width: `calc(100% - ${ICON_BAR_WIDTH}px)`,
        height: "100%",
        flex: "1 1 0",
        overflow: "auto",
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: 0,
        position: "relative"
    };

    return (
        <Fragment>
            {!window.in_context &&
                <TacticNavbar is_authenticated={window.is_authenticated}
                              user_name={window.username}
                              menus={null}
                />
            }
            <MetadataContext.Provider value={{
                showMetadata: showMetadata,
                toggleMetadata: toggleMetadata,
                hideMetadata: hideMetadata
            }}>
            <div className={`main-outer ${settingsContext.isDark() ? "bp6-dark" : "light-theme"}`}
                 style={outer_style}>
                <TacticMenubar connection_status={connection_status}
                               menus={menus}
                               showRefresh={true}
                               showClose={true}
                               local_id={props.local_id}
                               refreshTab={props.refreshTab}
                               closeTab={props.closeTab}
                               resource_name={_cProp("resource_name")}
                               showIconBar={true}
                               showErrorDrawerButton={true}
                               showMetadataDrawerButton={true}
                               showAssistantDrawerButton={true}
                               showSettingsDrawerButton={true}
                />
                    <HorizontalPanes left_pane={console_pane}
                                     right_pane={exports_pane}
                                     show_handle={true}
                                     initial_width_fraction={mState.console_width_fraction}
                                     controlled={true}
                                     className="project-outer-padding"
                                     handleSplitUpdate={_handleConsoleFractionChange}
                    />
            </div>
                </MetadataContext.Provider>
            <MetadataDrawer res_type="project"
                            res_name={project_name}
                            tsocket={props.tsocket}
                            readOnly={false}
                            is_repository={false}
                            show_drawer={mState.show_metadata}
                            position="right"
                            onClose={hideMetadata}
                            size="45%"
                />
        </Fragment>
    )
}

NotebookApp = memo(NotebookApp);

function main_main() {
    function gotProps(the_props) {
        let NotebookAppPlus = withUndo(withRegisterActivity(withSettings(withDialogs(withErrorDrawer(withStatus(withAssistant(NotebookApp)))))));
        let the_element = <NotebookAppPlus {...the_props}
                                           controlled={false}
                                           changeName={null}
        />;
        const domContainer = document.querySelector('#main-root');
        const root = createRoot(domContainer);
        root.render(
            <div style={{display: "flex", flexDirection: "column",
                position: "relative",
                height: "100%",
                width: "100%"}}>
                {the_element}
            </div>
        )
    }

    renderSpinnerMessage("Starting up ...");
    const local_id = "a" + guid();
    window.global_id = local_id;
    let resource_name = window.is_new_notebook ? "" : window.project_name;

    let tsocket = new TacticSocket("main", 5000, "notebook", local_id, async () => {
        tsocket.attachListener('handle-callback', (task_packet) => {
            handleCallback(task_packet, local_id)
        });
        if (window.is_new_notebook) {
            postPromise("main_service", "initialize_session_for_new_notebook", {
                temp_data_id: temp_data_id,
                global_id: window.global_id,
                base_figure_url: window.base_figure_url,
                local_id: local_id, username: window.username, ppi: get_ppi()
            })
                .then((data) => {
                    data.tsocket = tsocket;
                    data.local_id = local_id;
                    data.read_only = window.read_only;
                    data.is_repository = window.is_repository;
                    notebook_props(data, null, gotProps)
                })
        }
        else {
            postPromise("main_service", "initialize_session_from_save", {
                project_name: resource_name, global_id: window.global_id,
                base_figure_url: window.base_figure_url,
                local_id: local_id, username: window.username, ppi: get_ppi()
            })
                .then((data) => {
                    data.tsocket = tsocket;
                    data.local_id = local_id;
                    data.read_only = window.read_only;
                    data.is_repository = window.is_repository;
                    notebook_props(data, null, gotProps)
                })
        }

    })
}


if (!window.in_context) {
    main_main();
}


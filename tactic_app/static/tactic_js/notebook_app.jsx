import "../tactic_css/tactic.scss";
import "../tactic_css/tactic_console.scss";
import "../tactic_css/tactic_main.scss";

import React from "react";
import {Fragment, useEffect, useRef, memo, useContext, useReducer} from "react";
import * as ReactDOM from 'react-dom'
import PropTypes from 'prop-types';

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
import {HorizontalPanes} from "./resizing_layouts";
import {ErrorDrawerContext, withErrorDrawer} from "./error_drawer";
import {getUsableDimensions} from "./sizing_tools";
import {useCallbackStack, useConstructor, useReducerAndRef} from "./utilities_react";
import {notebook_props, notebookReducer} from "./notebook_support";

import {withTheme, ThemeContext} from "./theme";
import {withDialogs} from "./modal_react";


const MARGIN_SIZE = 10;
const BOTTOM_MARGIN = 20;
const MARGIN_ADJUSTMENT = 8; // This is the amount at the top of both the table and the conso
const USUAL_TOOLBAR_HEIGHT = 50;
const MENU_BAR_HEIGHT = 30; // will only appear when in context

export {NotebookApp}

function NotebookApp(props) {

    const last_save = useRef({});
    const main_outer_ref = useRef(null);
    const updateExportsList = useRef(null);
    const height_adjustment = useRef(props.controlled ? MENU_BAR_HEIGHT : 0);
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
        usable_height: getUsableDimensions(true).usable_height_no_bottom,
        usable_width: getUsableDimensions(true).usable_width - 170
    });
    const theme = useContext(ThemeContext);
    const statusFuncs = useContext(StatusContext);
    const errorDrawerFuncs = useContext(ErrorDrawerContext);

    const pushCallback = useCallbackStack();
    const selectedPane = useContext(SelectedPaneContext);

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
        _updateLastSave();
        statusFuncs.stopSpinner();

        if (!props.controlled) {
            document.title = mState.resource_name;
            window.addEventListener("resize", _update_window_dimensions);
            _update_window_dimensions();
        }

        return (() => {
            delete_my_containers()
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

    function _setMainStateValue(field_name, new_value, callback = null) {
        mDispatch({
            type: "change_field",
            field: field_name,
            new_value: new_value
        });
        pushCallback(callback)
    }

    function _update_window_dimensions() {
        let uwidth;
        let uheight;
        if (main_outer_ref && main_outer_ref.current) {
            uheight = window.innerHeight - main_outer_ref.current.offsetTop;
            uwidth = window.innerWidth - main_outer_ref.current.offsetLeft;
        } else {
            uheight = window.innerHeight - USUAL_TOOLBAR_HEIGHT;
            uwidth = window.innerWidth - 2 * MARGIN_SIZE;
        }
        mDispatch({
            type: "change_multiple_fields",
            newPartialState: {
                usable_height: uheight,
                usable_width: uwidth
            }
        });
    }

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

    function _handleConsoleFractionChange(left_width, right_width, new_fraction) {
        _setMainStateValue("console_width_fraction", new_fraction)
    }

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

    function get_zoomed_console_height() {
        if (main_outer_ref.current) {
            return _cProp("usable_height") - height_adjustment.current - BOTTOM_MARGIN;
        } else {
            return _cProp("usable_height") - height_adjustment.current - 50
        }
    }

    let my_props = {...props};
    if (!props.controlled) {
        my_props.resource_name = mState.resource_name;
        my_props.usable_height = mState.usable_height;
        my_props.usable_width = mState.usable_width;
        my_props.is_project = mState.is_project
    }
    let true_usable_width = my_props.usable_width;
    let console_available_height = get_zoomed_console_height() - MARGIN_ADJUSTMENT;
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
                          console_available_height={console_available_height - MARGIN_SIZE}
                          console_available_width={true_usable_width * mState.console_width_fraction - 16}
                          zoomable={false}
                          shrinkable={false}
                          style={{marginTop: MARGIN_SIZE}}
        />
    );
    let exports_pane;
    if (mState.show_exports_pane) {
        exports_pane = <ExportsViewer main_id={props.main_id}
                                      tsocket={props.tsocket}
                                      setUpdate={(ufunc) => {
                                          updateExportsList.current = ufunc
                                      }}
                                      available_height={console_available_height - MARGIN_SIZE}
                                      console_is_shrunk={mState.console_is_shrunk}
                                      console_is_zoomed={mState.console_is_zoomed}
                                      style={{marginTop: MARGIN_SIZE}}
        />
    } else {
        exports_pane = <div></div>
    }

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
                 style={{width: "100%", height: my_props.usable_height - height_adjustment.current}}>
                <HorizontalPanes left_pane={console_pane}
                                 right_pane={exports_pane}
                                 show_handle={true}
                                 available_height={console_available_height}
                                 available_width={true_usable_width}
                                 initial_width_fraction={mState.console_width_fraction}
                                 controlled={true}
                                 dragIconSize={15}
                                 handleSplitUpdate={_handleConsoleFractionChange}
                />
            </div>
        </Fragment>
    )

}

NotebookApp = memo(NotebookApp);

NotebookApp.propTypes = {
    console_items: PropTypes.array,
    console_component: PropTypes.object,
    is_project: PropTypes.bool,
    interface_state: PropTypes.object,
    refreshTab: PropTypes.func,
    closeTab: PropTypes.func,
};

NotebookApp.defaultProps = {
    refreshTab: null,
    closeTab: null,
};

function main_main() {
    function gotProps(the_props) {
        let NotebookAppPlus = withTheme(withDialogs(withErrorDrawer(withStatus(NotebookApp))));
        let the_element = <NotebookAppPlus {...the_props}
                                           controlled={false}
                                           initial_theme={window.theme}
                                           changeName={null}
        />;
        const domContainer = document.querySelector('#main-root');
        ReactDOM.render(the_element, domContainer)
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


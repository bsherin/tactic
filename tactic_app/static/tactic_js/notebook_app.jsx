import "../tactic_css/tactic.scss";
import "../tactic_css/tactic_console.scss";
import "../tactic_css/tactic_main.scss";

import React from "react";
import {Fragment, useState, useEffect, useRef, memo} from "react";
import * as ReactDOM from 'react-dom'
import PropTypes from 'prop-types';

import {TacticNavbar} from "./blueprint_navbar";
import {TacticMenubar} from "./menu_utilities";
import {ProjectMenu} from "./main_menus_react";
import {TacticSocket} from "./tactic_socket";
import {ConsoleComponent, itemsReducer} from "./console_component";
import {doFlash} from "./toaster"
import {withStatus} from "./toaster";
import {get_ppi, renderSpinnerMessage} from "./utilities_react";
import {TacticOmnibar} from "./TacticOmnibar";
import {KeyTrap} from "./key_trap";

import {handleCallback, postWithCallback, postAjaxPromise, postAjax} from "./communication_react"
import {ExportsViewer} from "./export_viewer_react";
import {HorizontalPanes} from "./resizing_layouts";
import {withErrorDrawer} from "./error_drawer";
import {getUsableDimensions} from "./sizing_tools";
import {useCallbackStack, useConstructor, useReducerAndRef} from "./utilities_react";

const MARGIN_SIZE = 10;
const BOTTOM_MARGIN = 20;
const MARGIN_ADJUSTMENT = 8; // This is the amount at the top of both the table and the conso
const USUAL_TOOLBAR_HEIGHT = 50;
const MENU_BAR_HEIGHT = 30; // will only appear when in context

var tsocket;
var ppi;

export {notebook_props, NotebookApp}

function main_main() {
    function gotProps(the_props) {
        let NotebookAppPlus = withErrorDrawer(withStatus(NotebookApp));
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

function notebook_props(data, registerDirtyMethod, finalCallback, registerOmniFunction) {

    ppi = get_ppi();
    let main_id = data.main_id;
    if (!window.in_context) {
        window.main_id = main_id;
    }

    tsocket = new TacticSocket("main", 5000, main_id, function (response) {
        tsocket.socket.on("remove-ready-block", readyListener);
        tsocket.socket.emit('client-ready', {
            "room": main_id, "user_id": window.user_id, "participant": "client",
            "rb_id": data.ready_block_id, "main_id": main_id
        })
    });
    tsocket.socket.on('finish-post-load', _finish_post_load_in_context);

    function readyListener() {
        _everyone_ready_in_context(finalCallback)
    }

    let is_totally_new = !data.is_jupyter && !data.is_project && (data.temp_data_id == "");
    let opening_from_temp_id = data.temp_data_id != "";


    window.addEventListener("unload", function sendRemove() {
        console.log("got the beacon");
        navigator.sendBeacon("/remove_mainwindow", JSON.stringify({"main_id": main_id}));
    });

    function _everyone_ready_in_context() {
        if (!window.in_context) {
            renderSpinnerMessage("Everyone is ready, initializing...");
        }
        tsocket.socket.off("remove-ready-block", readyListener);
        tsocket.attachListener('handle-callback', (task_packet) => {
            handleCallback(task_packet, main_id)
        });
        window.base_figure_url = data.base_figure_url;
        let data_dict = {
            "doc_type": "notebook",
            "base_figure_url": data.base_figure_url,
            "user_id": window.user_id,
            "ppi": ppi
        };
        if (is_totally_new) {
            postWithCallback(main_id, "initialize_mainwindow", data_dict, _finish_post_load_in_context, null, main_id)
        } else {
            if (data.is_jupyter) {
                data_dict["doc_type"] = "jupyter";
                data_dict["project_name"] = data.project_name;
            } else if (data.is_project) {
                data_dict["project_name"] = data.project_name;
            } else {
                data_dict["unique_id"] = data.temp_data_id;
            }
            postWithCallback(main_id, "initialize_project_mainwindow", data_dict, null, null, main_id)
        }
    }

    function _finish_post_load_in_context(fdata) {
        if (!window.in_context) {
            renderSpinnerMessage("Creating the page...");
        }
        tsocket.socket.off("finish-post-load", _finish_post_load_in_context);
        var interface_state;
        if (data.is_project || opening_from_temp_id) {
            interface_state = fdata.interface_state
        }
        let domContainer = document.querySelector('#main-root');
        if (data.is_project || opening_from_temp_id) {
            finalCallback({
                is_project: true,
                main_id: main_id,
                resource_name: data.project_name,
                tsocket: tsocket,
                interface_state: interface_state,
                is_notebook: true,
                is_juptyer: data.is_jupyter,
                initial_theme: window.theme,
                registerDirtyMethod: registerDirtyMethod,
                registerOmniFunction: registerOmniFunction
            })
        } else {
            finalCallback({
                is_project: false,
                main_id: main_id,
                resource_name: data.project_name,
                tsocket: tsocket,
                interface_state: null,
                is_notebook: true,
                is_juptyer: data.is_jupyter,
                initial_theme: window.theme,
                registerDirtyMethod: registerDirtyMethod,
                registerOmniFunction: registerOmniFunction
            })
        }
    }
}

const save_attrs = ["console_items", "show_exports_pane", "console_width_fraction"];
const controllable_props = ["is_project", "resource_name", "usable_width", "usable_height"];

function NotebookApp(props) {

    const last_save = useRef({});
    const main_outer_ref = useRef(null);
    const omniGetters = useRef({});
    const updateExportsList = useRef(null);
    const height_adjustment = useRef(props.controlled ? MENU_BAR_HEIGHT : 0);

    const [usable_height, set_usable_height] = useState(() => {
        return getUsableDimensions(true).usable_height_no_bottom
    });
    const [usable_width, set_usable_width] = useState(() => {
        return getUsableDimensions(true).usable_width - 170
    });

    const [console_items, dispatch, console_items_ref] = useReducerAndRef(itemsReducer, []);
    const [show_exports_pane, set_show_exports_pane] = useState(true);
    const [console_width_fraction, set_console_width_fraction] = useState(.5);

    // These will only be used if not controlled
    const [sdark_theme, set_dark_theme] = useState(true);
    const [sresource_name, set_sresource_name] = useState("");
    const [showOmnibar, setShowOmnibar] = useState(false);
    const [is_project, set_is_project] = useState(false);

    const key_bindings = [[["ctrl+space"], _showOmnibar]];

    const pushCallback = useCallbackStack();

    useConstructor(()=>{
        set_show_exports_pane(props.is_project ? props.interface_state["show_exports_pane"] : true);
        set_console_width_fraction(props.is_project ? props.interface_state["console_width_fraction"] : .5);
        set_dark_theme(props.initial_theme === "dark");
        set_sresource_name(props.resource_name);
        set_is_project(props.is_project);
        dispatch({
            type: "initialize",
            new_items: props.is_project ? props.interface_state["console_items"] : []
        })

    });

    useEffect(() => {
        initSocket();
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
        if (props.registerOmniFunction) {
            props.registerOmniFunction(_omniFunction);
        }
        _updateLastSave();
        props.stopSpinner();

        if (!props.controlled) {
            document.title = sresource_name;
            window.dark_theme = sdark_theme;
            window.addEventListener("resize", _update_window_dimensions);
            _update_window_dimensions();
        }

        return (() => {
            tsocket.disconnect();
            delete_my_containers()
        })
    }, []);

    const cPropGetters = {
            usable_width: usable_width,
            usable_height: usable_height,
            resource_name: sresource_name,
            is_project: is_project
    };

    const stateSetters = {
        show_exports_pane: set_show_exports_pane,
    };

    function _cProp(pname) {
        return props.controlled ? props[pname] : cPropGetters[pname]
    }


    function interface_state() {
        return {console_items, show_exports_pane, console_width_fraction}
    }

    function _setMainStateValue(field_name, new_value, callback = null) {
        // console.log(`field_name is ${field_name} new_value is ${String(new_value)}`);
        if (!(field_name in stateSetters)) {
            console.log(`trying to set field_name ${field_name} that don't have a setter for`);
            return;
        }
        stateSetters[field_name](new_value);
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
        set_usable_height(uheight);
        set_usable_width(uwidth)
    }

    function _updateLastSave() {
        last_save.current = interface_state()
    }

    function _dirty() {
        let current_state = interface_state();
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
        props.tsocket.attachListener("doFlash", function (data) {
            doFlash(data)
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

    function _setTheme(dark_theme) {
        set_dark_theme(dark_theme);
        pushCallback(() => {
            window.dark_theme = dark_theme
        })
    }

    function _handleConsoleFractionChange(left_width, right_width, new_fraction) {
        set_console_width_fraction(new_fraction)
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
            set_sresource_name(new_project_name);
            set_is_project(true);
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
        omniGetters.current[name] = the_function;
    }

    let actual_dark_theme = props.controlled ? props.dark_theme : sdark_theme;
    let my_props = {...props};
    if (!props.controlled) {
        my_props.resource_name = sresource_name;
        my_props.usable_height = usable_height;
        my_props.usable_width = usable_width;
        my_props.is_project = is_project
    }
    let true_usable_width = my_props.usable_width;
    let console_available_height = get_zoomed_console_height() - MARGIN_ADJUSTMENT;
    let project_name = my_props.is_project ? props.resource_name : "";
    let menus = (
        <Fragment>
            <ProjectMenu {...props.statusFuncs}
                         main_id={props.main_id}
                         project_name={project_name}
                         is_notebook={true}
                         is_juptyer={props.is_jupyter}
                         setProjectName={_setProjectName}
                         postAjaxFailure={props.postAjaxFailure}
                         console_items={console_items_ref.current}
                         interface_state={interface_state()}
                         updateLastSave={_updateLastSave}
                         changeCollection={null}
                         disabled_items={my_props.is_project ? [] : ["Save"]}
                         registerOmniGetter={_registerOmniGetter}
                         hidden_items={["Open Console as Notebook", "Export Table as Collection", "divider2", "Change collection"]}
            />
        </Fragment>
    );
    let console_pane = (
        <ConsoleComponent {...props.statusFuncs}
                          main_id={props.main_id}
                          tsocket={props.tsocket}
                          dark_theme={actual_dark_theme}
                          handleCreateViewer={props.handleCreateViewer}
                          controlled={props.controlled}
                          am_selected={props.am_selected}
                          pushCallback={pushCallback}
                          console_items={console_items_ref}
                          dispatch={dispatch}
                          console_is_shrunk={false}
                          console_is_zoomed={true}
                          show_exports_pane={show_exports_pane}
                          setMainStateValue={_setMainStateValue}
                          console_available_height={console_available_height - MARGIN_SIZE}
                          console_available_width={true_usable_width * console_width_fraction - 16}
                          zoomable={false}
                          shrinkable={false}
                          style={{marginTop: MARGIN_SIZE}}
        />
    );
    let exports_pane;
    if (show_exports_pane) {
        exports_pane = <ExportsViewer main_id={props.main_id}
                                      tsocket={props.tsocket}
                                      setUpdate={(ufunc) => {
                                          updateExportsList.current = ufunc
                                      }}
                                      available_height={console_available_height - MARGIN_SIZE}
                                      console_is_shrunk={false}
                                      console_is_zoomed={true}
                                      style={{marginTop: MARGIN_SIZE}}
        />
    } else {
        exports_pane = <div></div>
    }

    return (
        <Fragment>
            {!window.in_context &&
                <TacticNavbar is_authenticated={window.is_authenticated}
                              dark_theme={actual_dark_theme}
                              setTheme={props.controlled ? props.setTheme : _setTheme}
                              user_name={window.username}
                              menus={null}
                              page_id={props.main_id}
                />
            }

            <TacticMenubar dark_theme={actual_dark_theme}
                           menus={menus}
                           showRefresh={true}
                           showClose={true}
                           page_id={props.main_id}
                           refreshTab={props.refreshTab}
                           closeTab={props.closeTab}
                           resource_name={_cProp("resource_name")}
                           showErrorDrawerButton={true}
                           toggleErrorDrawer={props.toggleErrorDrawer}
            />
            <div className={`main-outer ${actual_dark_theme ? "bp5-dark" : "light-theme"}`}
                 ref={main_outer_ref}
                 style={{width: "100%", height: my_props.usable_height - height_adjustment.current}}>
                <HorizontalPanes left_pane={console_pane}
                                 right_pane={exports_pane}
                                 show_handle={true}
                                 available_height={console_available_height}
                                 available_width={true_usable_width}
                                 initial_width_fraction={console_width_fraction}
                                 controlled={true}
                                 dragIconSize={15}
                                 handleSplitUpdate={_handleConsoleFractionChange}
                />
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

if (!window.in_context) {
    main_main();
}


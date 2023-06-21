

import "../tactic_css/tactic.scss";
import "../tactic_css/tactic_console.scss";
import "../tactic_css/tactic_main.scss";

import React from "react";
import { Fragment } from 'react';
import * as ReactDOM from 'react-dom'
import PropTypes from 'prop-types';

import {TacticNavbar} from "./blueprint_navbar.js";
import {TacticMenubar} from "./menu_utilities.js";
import {ProjectMenu} from "./main_menus_react.js";
import {TacticSocket} from "./tactic_socket.js";
import {ConsoleComponent} from "./console_component.js";
import {doFlash} from "./toaster.js"
import {withStatus} from "./toaster.js";
import {doBinding, get_ppi, renderSpinnerMessage} from "./utilities_react.js";
import {TacticOmnibar} from "./TacticOmnibar";
import {KeyTrap} from "./key_trap";

import {handleCallback, postWithCallback, postAjaxPromise, postAjax} from "./communication_react.js"
import {ExportsViewer} from "./export_viewer_react";
import {HorizontalPanes} from "./resizing_layouts";
import {withErrorDrawer} from "./error_drawer.js";
import {getUsableDimensions} from "./sizing_tools.js";

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
        .then((data)=>{
            notebook_props(data, null, gotProps)
        })
}

function notebook_props(data, registerDirtyMethod, finalCallback, registerOmniFunction) {

    ppi = get_ppi();
    let main_id = data.main_id;
    if (!window.in_context) {
        window.main_id = main_id;
    }

    var tsocket = new TacticSocket("main", 5000, main_id, function(response) {
        tsocket.socket.on("remove-ready-block", readyListener);
        tsocket.socket.emit('client-ready', {"room": main_id, "user_id": window.user_id, "participant": "client",
            "rb_id": data.ready_block_id, "main_id": main_id})
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
        if (!window.in_context){
            renderSpinnerMessage("Everyone is ready, initializing...");
        }
        tsocket.socket.off("remove-ready-block", readyListener);
        tsocket.attachListener('handle-callback', (task_packet)=>{handleCallback(task_packet, main_id)});
        window.base_figure_url = data.base_figure_url;
        let data_dict = {
                "doc_type": "notebook",
                "base_figure_url": data.base_figure_url,
                "user_id": window.user_id,
                "ppi": ppi
        };
        if (is_totally_new) {
            postWithCallback(main_id, "initialize_mainwindow", data_dict, _finish_post_load_in_context, null, main_id)
        }
        else {
            if (data.is_jupyter) {
                data_dict["doc_type"] = "jupyter";
                data_dict["project_name"] = data.project_name;
            }
            else if (data.is_project) {
                data_dict["project_name"] = data.project_name;
            }
            else  {
                data_dict["unique_id"] = data.temp_data_id;
            }
            postWithCallback(main_id, "initialize_project_mainwindow", data_dict, null, null, main_id)
        }
    }

    function _finish_post_load_in_context(fdata) {
        if (!window.in_context){
            renderSpinnerMessage("Creating the page...");
        }
        tsocket.socket.off("finish-post-load", _finish_post_load_in_context);
        var interface_state;
        if (data.is_project || opening_from_temp_id) {
            interface_state = fdata.interface_state
        }
        let domContainer = document.querySelector('#main-root');
        if (data.is_project || opening_from_temp_id) {
            finalCallback({ is_project: true,
                           main_id: main_id,
                           resource_name: data.project_name,
                           tsocket: tsocket,
                           interface_state: interface_state,
                           is_notebook: true,
                           is_juptyer: data.is_jupyter,
                           initial_theme: window.theme,
                            registerDirtyMethod: registerDirtyMethod,
                            registerOmniFunction: registerOmniFunction
            })}
            else {
                finalCallback({ is_project: false,
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

class NotebookApp extends React.Component {
    constructor (props) {
        super(props);
        doBinding(this);
        this.initSocket();

        this.last_save = {};
        this.main_outer_ref = React.createRef();
        this.socket_counter = null;
        if (this.props.registerOmniFunction) {
            this.props.registerOmniFunction(this._omniFunction);
        }
        this.omniGetters = {};
        this.state = {
            mounted: false,
            console_items: [],
            console_width_fraction: .5,
            show_exports_pane: true,
        };

        let self = this;
        if (this.props.controlled) {
            props.registerDirtyMethod(this._dirty);
            this.height_adjustment = MENU_BAR_HEIGHT;
        }
        else {
            this.height_adjustment = 0;
            this.state.dark_theme = props.initial_theme === "dark";
            this.state.resource_name = props.resource_name;
            this.state.usable_height = getUsableDimensions(true).usable_height_no_bottom;
            this.state.usable_width = getUsableDimensions(true).usable_width - 170;
            this.state.is_project = props.is_project;
            window.addEventListener("beforeunload", function (e) {
                if (self._dirty()) {
                    e.preventDefault();
                    e.returnValue = ''
                }
            });
        }
        if (props.is_project) {
            for (let attr of save_attrs) {
                this.state[attr] = this.props.interface_state[attr]
            }
        }
        if (!window.in_context) {
            this.key_bindings = [
                [["ctrl+space"], this._showOmnibar],
            ];
            this.state.showOmnibar = false;
        }

    }

    _cProp(pname) {
        return this.props.controlled ? this.props[pname] :  this.state[pname]
    }


    _update_window_dimensions() {
        let uwidth;
        let uheight;
        if (this.main_outer_ref && this.main_outer_ref.current) {
            uheight = window.innerHeight - this.main_outer_ref.current.offsetTop;
            uwidth = window.innerWidth - this.main_outer_ref.current.offsetLeft;
        }
        else {
            uheight = window.innerHeight - USUAL_TOOLBAR_HEIGHT;
            uwidth = window.innerWidth - 2 * MARGIN_SIZE;
        }
        this.setState({usable_height: uheight, usable_width: uwidth})
    }

    _updateLastSave() {
        this.last_save = this.interface_state
    }

    _dirty() {
        let current_state = this.interface_state;
        for (let k in current_state) {
            if (current_state[k] != this.last_save[k]) {
                return true
            }
        }
        return false
    }

    componentDidMount() {
        this.setState({"mounted": true});
        this._updateLastSave();
        this.props.stopSpinner();

        if (!this.props.controlled) {
            document.title = this.state.resource_name;
            window.dark_theme = this.state.dark_theme;
            window.addEventListener("resize", this._update_window_dimensions);
            this._update_window_dimensions();
        }
    }

    componentWillUnmount() {
        this.props.tsocket.disconnect();
        this.delete_my_containers()
    }

    delete_my_containers() {
        postAjax("/remove_mainwindow", {"main_id": this.props.main_id});
    }

    initSocket() {
        let self = this;

        this.props.tsocket.attachListener("window-open", data => {
            window.open(`${$SCRIPT_ROOT}/load_temp_page/${data["the_id"]}`)
        });
        this.props.tsocket.attachListener("doFlash", function(data) {
            doFlash(data)
        });

        if (!window.in_context) {
            this.props.tsocket.attachListener("doFlashUser", function(data) {
                doFlash(data)
                });

            this.props.tsocket.attachListener('close-user-windows', function(data){
                if (!(data["originator"] == main_id)) {
                    window.close()
                }
            });
        }
    }

    _setTheme(dark_theme) {
        this.setState({dark_theme: dark_theme}, ()=> {
            window.dark_theme = this.state.dark_theme
        })
    }

    _setMainStateValue(field_name, value, callback=null) {
        let new_state = {};
        new_state[field_name] = value;
        this.setState(new_state, callback);
    }


    _broadcast_event_to_server(event_name, data_dict, callback) {
        data_dict.main_id = this.props.main_id;
        data_dict.event_name = event_name;
        postWithCallback(this.props.main_id, "distribute_events_stub", data_dict, callback, null, this.props.main-id)
    }

    _handleConsoleFractionChange(left_width, right_width, new_fraction) {
        this.setState({console_width_fraction: new_fraction})
    }

    get interface_state() {
        let interface_state = {};
        for (let attr of save_attrs) {
            interface_state[attr] = this.state[attr]
        }
        return interface_state
    }

    _setProjectName(new_project_name, callback=null) {
        let self = this;
        if (this.props.controlled) {
            this.props.updatePanel({res_type: "project", title: new_project_name, panel: {resource_name: new_project_name, is_project: true}}, ()=>{
                self.setState({is_jupyter: false}, callback)
            })
        }
        else {
            this.setState({resource_name: new_project_name, is_project: true, is_jupyter: false}, callback);
        }
    }

    get_zoomed_console_height() {
        if (this.state.mounted && this.main_outer_ref.current) {
            return this._cProp("usable_height")  - this.height_adjustment - BOTTOM_MARGIN;
        }
        else {
            return this._cProp("usable_height") - this.height_adjustment - 50
        }
    }

    _showOmnibar() {
        this.setState({showOmnibar: true})
    }

    _closeOmnibar() {
        this.setState({showOmnibar: false})
    }

    _omniFunction() {
        let omni_items = [];
        for (let ogetter in this.omniGetters) {
            omni_items = omni_items.concat(this.omniGetters[ogetter]())
        }
        return omni_items
    }

    _registerOmniGetter(name, the_function) {
        this.omniGetters[name] = the_function;
    }

    render () {
        let dark_theme = this.props.controlled ? this.props.dark_theme : this.state.dark_theme;
        let my_props = {...this.props};
        if (!this.props.controlled) {
            for (let prop_name of controllable_props) {
                my_props[prop_name] = this.state[prop_name]
            }
        }
        let true_usable_width = my_props.usable_width;
        let console_available_height = this.get_zoomed_console_height() - MARGIN_ADJUSTMENT;
        let project_name = my_props.is_project ? this.props.resource_name : "";
        let menus = (
            <Fragment>
                <ProjectMenu {...this.props.statusFuncs}
                             main_id={this.props.main_id}
                             project_name={project_name}
                             is_notebook={true}
                             is_juptyer={this.props.is_jupyter}
                             setProjectName={this._setProjectName}
                             postAjaxFailure={this.props.postAjaxFailure}
                             console_items={this.state.console_items}
                             interface_state={this.interface_state}
                             updateLastSave={this._updateLastSave}
                             changeCollection={null}
                             disabled_items={my_props.is_project ? [] : ["Save"]}
                             registerOmniGetter={this._registerOmniGetter}
                             hidden_items={["Open Console as Notebook", "Export Table as Collection", "divider2", "Change collection"]}
                />
            </Fragment>
        );
        let console_pane = (
            <ConsoleComponent {...this.props.statusFuncs}
                  main_id={this.props.main_id}
                  tsocket={this.props.tsocket}
                  dark_theme={dark_theme}
                  handleCreateViewer={this.props.handleCreateViewer}
                  controlled={this.props.controlled}
                  am_selected={this.props.am_selected}
                  console_items={this.state.console_items}
                  console_is_shrunk={false}
                  console_is_zoomed={true}
                  show_exports_pane={this.state.show_exports_pane}
                  setMainStateValue={this._setMainStateValue}
                  console_available_height={console_available_height - MARGIN_SIZE}
                  console_available_width={true_usable_width * this.state.console_width_fraction - 16}
                  zoomable={false}
                  shrinkable={false}
                  style={{marginTop: MARGIN_SIZE}}
                  />
        );
        let exports_pane;
        if (this.state.show_exports_pane) {
            exports_pane = <ExportsViewer main_id={this.props.main_id}
                                          tsocket={this.props.tsocket}
                                          setUpdate={(ufunc)=>{this.updateExportsList = ufunc}}
                                          setMainStateValue={this._setMainStateValue}
                                          available_height={console_available_height - MARGIN_SIZE}
                                          console_is_shrunk={false}
                                          console_is_zoomed={true}
                                          style={{marginTop: MARGIN_SIZE}}
            />
        }
        else {
            exports_pane = <div></div>
        }
        let outer_class = "main-outer";
        if (dark_theme) {
            outer_class = outer_class + " bp4-dark";
        }
        else {
            outer_class = outer_class + " light-theme"
        }
        let outer_style = {
            width: "100%",
            height: my_props.usable_height - this.height_adjustment,
        };
        let stheme = this.props.controlled ? this.props.setTheme : this._setTheme;
        return (
            <Fragment>
                {!window.in_context &&
                    <TacticNavbar is_authenticated={window.is_authenticated}
                          dark_theme={dark_theme}
                          setTheme={stheme}
                          user_name={window.username}
                          menus={null}
                          page_id={this.props.main_id}
                    />
                }

                <TacticMenubar dark_theme={dark_theme}
                               menus={menus}
                               showRefresh={true}
                               showClose={true}
                               page_id={this.props.main_id}
                               refreshTab={this.props.refreshTab}
                               closeTab={this.props.closeTab}
                               resource_name={this._cProp("resource_name")}
                               showErrorDrawerButton={true}
                               toggleErrorDrawer={this.props.toggleErrorDrawer}
                />
                <div className={outer_class} ref={this.main_outer_ref} style={outer_style}>
                    <HorizontalPanes left_pane={console_pane}
                                     right_pane={exports_pane}
                                     show_handle={true}
                                     available_height={console_available_height}
                                     available_width={true_usable_width}
                                     initial_width_fraction={this.state.console_width_fraction}
                                     controlled={true}
                                     dragIconSize={15}
                                     handleSplitUpdate={this._handleConsoleFractionChange}
                        />
                    </div>
                {!window.in_context &&
                    <Fragment>
                        <TacticOmnibar omniGetters={[this._omniFunction]}
                                       showOmnibar={this.state.showOmnibar}
                                       closeOmnibar={this._closeOmnibar}
                        />
                        <KeyTrap global={true} bindings={this.key_bindings}/>
                    </Fragment>
                }
            </Fragment>
        )
    }
}

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


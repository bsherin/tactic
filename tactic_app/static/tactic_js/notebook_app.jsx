

import "../tactic_css/tactic.scss";
import "../tactic_css/tactic_console.scss";

import React from "react";
import * as ReactDOM from 'react-dom'
import PropTypes from 'prop-types';

import {TacticNavbar} from "./blueprint_navbar.js";
import {ProjectMenu} from "./main_menus_react.js";
import {TacticSocket} from "./tactic_socket.js";
import {ConsoleComponent} from "./console_component.js";
import {doFlash} from "./toaster.js"
import {withStatus} from "./toaster.js";
import {doBinding, get_ppi} from "./utilities_react.js";

import {handleCallback, postWithCallback, postAsyncFalse, postAjaxPromise} from "./communication_react.js"
import {ExportsViewer} from "./export_viewer_react";
import {HorizontalPanes} from "./resizing_layouts";

const MARGIN_SIZE = 17;
const BOTTOM_MARGIN = 20;
const USUAL_TOOLBAR_HEIGHT = 50;

var tsocket;
var ppi;

export {main_notebook_in_context}

class MainTacticSocket extends TacticSocket {

    initialize_socket_stuff(reconnect=false) {
        this.socket.emit('join', {"room": window.user_id});
        if (reconnect) {
            this.socket.emit('join-main', {"room": this.extra_args.main_id, "user_id": window.user_id}, function (response) {
            })
        }

        this.socket.on('handle-callback', handleCallback);
        let self = this;
        this.socket.on('forcedisconnect', function() {
            self.socket.disconnect()
        });
        this.socket.on('close-user-windows', function(data){
                    postAsyncFalse("host", "remove_mainwindow_task", {"main_id": this.extra_args.main_id});
                    if (!(data["originator"] == this.extra_args.main_id)) {
                        window.close()
                    }
                });
        this.socket.on("window-open", function(data) {
            window.open($SCRIPT_ROOT + "/load_temp_page/" + data["the_id"])
        });

        this.socket.on("notebook-open", function(data) {
            window.open($SCRIPT_ROOT + "/open_notebook/" + data["the_id"])
        });
        this.socket.on("doFlash", function(data) {
            doFlash(data)
        });
    }
}

function main_main() {
    function gotElement(the_element) {
        const domContainer = document.querySelector('#main-root');
        ReactDOM.render(the_element, domContainer)
    }
    var resource_name;
    var target;

    if (window.is_new_notebook) {
        target = "new_notebook_in_context";
        resource_name = ""
    }
    else {
        target = "main_project_in_context";
        resource_name = window.project_name
    }

    postAjaxPromise(target, {"resource_name": resource_name})
        .then((data)=>{
            main_notebook_in_context(data, null, gotElement)
        })
}

function main_notebook_in_context(data, registerThemeSetter, finalCallback, ref=null) {

    var tsocket = new MainTacticSocket("main",
        5000,
        {main_id: data.main_id});
    ppi = get_ppi();
    let main_id = data.main_id;
    if (!window.in_context) {
        window.main_id = data.main_id;  // needed for postWithCallback
    }
    let is_totally_new = !data.is_jupyter && !data.is_project && (data.temp_data_id == "");
    let opening_from_temp_id = data.temp_data_id != "";
    tsocket.socket.on('finish-post-load', _finish_post_load_in_context);
    tsocket.socket.on("remove-ready-block", _everyone_ready_in_context);
    tsocket.socket.emit('join-main', {"room": main_id, "user_id": window.user_id}, function(response) {
        console.log("emitting client-read");
            tsocket.socket.emit('client-ready', {"room": main_id, "user_id": window.user_id, "participant": "client",
            "rb_id": data.ready_block_id})
    });

    window.addEventListener("unload", function sendRemove() {
        navigator.sendBeacon("/remove_mainwindow", JSON.stringify({"main_id": main_id}));
    });

    function _everyone_ready_in_context() {
        console.log("entering everyone ready");
        let data_dict = {
                "doc_type": "notebook",
                "base_figure_url": data.base_figure_url,
                "user_id": window.user_id,
                "ppi": ppi
        };
        if (is_totally_new) {
            console.log("about to intialize");
            postWithCallback(main_id, "initialize_mainwindow", data_dict, _finish_post_load_in_context)
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
            console.log("about to intialize project");
            postWithCallback(main_id, "initialize_project_mainwindow", data_dict)
        }
    }

    function _finish_post_load_in_context(fdata) {
        let NotebookAppPlus = withStatus(NotebookApp, tsocket, true, ref);
        var interface_state;
        if (data.is_project || opening_from_temp_id) {
            interface_state = fdata.interface_state
        }
        let domContainer = document.querySelector('#main-root');
        if (data.is_project || opening_from_temp_id) {
            finalCallback(<NotebookAppPlus initial_is_project={true}
                                           main_id={main_id}
                                           registerThemeSetter={registerThemeSetter}
                                           initial_project_name={data.project_name}
                                           tsocket={tsocket}
                                           interface_state={interface_state}
                                           is_juptyer={data.is_jupyter}
                                           initial_theme={window.theme}/>)
            }
            else {
                finalCallback(<NotebookAppPlus initial_is_project={false}
                                               main_id={main_id}
                                               registerThemeSetter={registerThemeSetter}
                                               initial_project_name={data.project_name}
                                               tsocket={tsocket}
                                               interface_state={null}
                                               is_juptyer={data.is_jupyter}
                                               initial_theme={window.theme}/>)
            }
    }
}

const save_attrs = ["console_items", "show_exports_pane", "console_width_fraction"];

class NotebookApp extends React.Component {
    constructor (props) {
        super(props);
        doBinding(this);
        this.last_save = {};
        this.main_outer_ref = React.createRef();
        this.state = {
            mounted: false,
            console_items: [],
            project_name: this.props.initial_project_name,
            is_project: this.props.initial_is_project,
            usable_width: window.innerWidth - 2 * MARGIN_SIZE,
            usable_height: window.innerHeight - BOTTOM_MARGIN,
            console_width_fraction: .5,
            show_exports_pane: true,
            dark_theme: this.props.initial_theme == "dark"
        };
        if (this.state.is_project) {
            for (let attr of save_attrs) {
                this.state[attr] = this.props.interface_state[attr]
            }
        }
        let self = this;
        window.addEventListener("beforeunload", function (e) {
            if (self.dirty()) {
                e.preventDefault();
                e.returnValue = ''
            }
        });
    }

    componentDidMount() {
        this.setState({"mounted": true});
        window.addEventListener("resize", this._update_window_dimensions);
        if (!window.is_context) {
            document.title = this.state.is_project ? this.state.project_name : "New Notebook";
        }
        this._updateLastSave();
        this.props.stopSpinner();
        this.props.setStatusTheme(this.state.dark_theme);
        if (!window.is_context) {
            window.dark_theme = this.state.dark_theme
        }
        if (window.in_context) {
            this.props.registerThemeSetter(this._setTheme);
        }
        this._update_window_dimensions()
    }

    _setTheme(dark_theme) {
        this.setState({dark_theme: dark_theme}, ()=> {
            this.props.setStatusTheme(dark_theme);
            window.dark_theme = this.state.dark_theme
        })
    }

    _update_window_dimensions() {
        let uwidth;
        if (this.main_outer_ref && this.main_outer_ref.current) {
            uwidth = window.innerWidth - MARGIN_SIZE - this.main_outer_ref.current.offsetLeft
        }
        else {
            uwidth = window.innerWidth - 2 * MARGIN_SIZE
        }
        this.setState({
            "usable_width": uwidth,
            "usable_height": window.innerHeight - BOTTOM_MARGIN - USUAL_TOOLBAR_HEIGHT
        });
    }

    _handleConsoleFractionChange(left_width, right_width, new_fraction) {
        this.setState({console_width_fraction: new_fraction})
    }

    _setMainStateValue(field_name, value, callback=null) {
        let new_state = {};
        new_state[field_name] = value;
        this.setState(new_state, callback);
    }

    _broadcast_event_to_server(event_name, data_dict, callback) {
        data_dict.main_id = this.props.main_id;
        data_dict.event_name = event_name;
        postWithCallback(this.props.main_id, "distribute_events_stub", data_dict, callback)
    }

    get interface_state() {
        let interface_state = {};
        for (let attr of save_attrs) {
            interface_state[attr] = this.state[attr]
        }
        return interface_state
    }

    _updateLastSave() {
        this.last_save = this.interface_state
    }

    dirty() {
        let current_state = this.interface_state;
        for (let k in current_state) {
            if (current_state[k] != this.last_save[k]) {
                return true
            }
        }
        return false
    }

    render () {
        let disabled_items = [];
        if (!this.state.is_project || this.props.is_jupyter) {
            disabled_items.push("Save")
        }
        let console_available_height = this.state.usable_height - USUAL_TOOLBAR_HEIGHT;
        let menus = (
            <React.Fragment>
                <ProjectMenu {...this.props.statusFuncs}
                             main_id={this.props.main_id}
                             project_name={this.state.project_name}
                             is_notebook={this.props.is_notebook}
                             is_juptyer={this.props.is_jupyter}
                             setMainStateValue={this._setMainStateValue}
                             postAjaxFailure={this.props.postAjaxFailure}
                             console_items={this.state.console_items}
                             interface_state={this.interface_state}
                             updateLastSave={this._updateLastSave}
                             changeCollection={null}
                             disabled_items={disabled_items}
                             hidden_items={["Open Console as Notebook", "Export Table as Collection", "Change collection"]}
                />
            </React.Fragment>
        );
        let console_pane = (
            <ConsoleComponent {...this.props.statusFuncs}
                  main_id={this.props.main_id}
                  console_items={this.state.console_items}
                  console_is_shrunk={false}
                  console_is_zoomed={true}
                  show_exports_pane={this.state.show_exports_pane}
                  setMainStateValue={this._setMainStateValue}
                  console_available_height={console_available_height - MARGIN_SIZE}
                  console_available_width={this.state.usable_width * this.state.console_width_fraction - 16}
                  zoomable={false}
                  shrinkable={false}
                  dark_theme={this.state.dark_theme}
                  style={{marginTop: MARGIN_SIZE}}
                  tsocket={this.props.tsocket}
                  />
        );
        let exports_pane;
        if (this.state.show_exports_pane) {
            exports_pane = <ExportsViewer main_id={this.props.main_id}
                                          setUpdate={(ufunc)=>{this.updateExportsList = ufunc}}
                                          available_height={console_available_height - MARGIN_SIZE}
                                          console_is_shrunk={false}
                                          console_is_zoomed={this.state.console_is_zoomed}
                                          style={{marginTop: MARGIN_SIZE}}
                                          tsocket={this.props.tsocket}
            />
        }
        else {
            exports_pane = <div></div>
        }
        let outer_class = "main-outer";
        if (this.state.dark_theme) {
            outer_class = outer_class + " bp3-dark";
        }
        else {
            outer_class = outer_class + " light-theme"
        }
        console.log("returning");
        return (
            <React.Fragment>
                <TacticNavbar is_authenticated={window.is_authenticated}
                    user_name={window.username}
                    menus={menus}
                    dark_theme={this.state.dark_theme}
                    set_parent_theme={this._setTheme}
                    show_api_links={true}
                    min_navbar={window.in_context}
                />
                <div className={outer_class} ref={this.main_outer_ref}>

                    <HorizontalPanes left_pane={console_pane}
                                     right_pane={exports_pane}
                                     show_handle={true}
                                     available_height={console_available_height}
                                     available_width={this.state.usable_width}
                                     initial_width_fraction={this.state.console_width_fraction}
                                     controlled={true}
                                     left_margin={MARGIN_SIZE}
                                     dragIconSize={15}
                                     handleSplitUpdate={this._handleConsoleFractionChange}
                        />
                </div>
            </React.Fragment>
        )
    }
}

NotebookApp.propTypes = {
    console_items: PropTypes.array,
    console_component: PropTypes.object,
    is_project: PropTypes.bool,
    interface_state: PropTypes.object,
};



if (!window.in_context) {
    main_main();
}


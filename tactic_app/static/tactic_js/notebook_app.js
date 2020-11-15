var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import "../tactic_css/tactic.scss";
import "../tactic_css/tactic_console.scss";

import React from "react";
import * as ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { TacticNavbar } from "./blueprint_navbar.js";
import { ProjectMenu } from "./main_menus_react.js";
import { TacticSocket } from "./tactic_socket.js";
import { ConsoleComponent } from "./console_component.js";
import { doFlash } from "./toaster.js";
import { withStatus } from "./toaster.js";
import { doBinding, get_ppi } from "./utilities_react.js";

import { handleCallback, postWithCallback, postAsyncFalse } from "./communication_react.js";
import { ExportsViewer } from "./export_viewer_react";
import { HorizontalPanes } from "./resizing_layouts";

const MARGIN_SIZE = 17;
const BOTTOM_MARGIN = 20;
const USUAL_TOOLBAR_HEIGHT = 50;

let tsocket;
let ppi;

// Note: it seems like the sendbeacon doesn't work if this callback has a line
// before the sendbeacon
window.addEventListener("unload", function sendRemove() {
    navigator.sendBeacon("/remove_mainwindow", JSON.stringify({ "main_id": window.main_id }));
});

function _main_main() {
    //render_navbar();
    console.log("entering _notebook_main");
    ppi = get_ppi();
    tsocket = new MainTacticSocket("main", 5000);
    tsocket.socket.emit('join-main', { "room": main_id, "user_id": window.user_id }, function () {
        _after_main_joined();
    });
    tsocket.socket.on('finish-post-load', _finish_post_load);
}

function _after_main_joined() {
    let data_dict = {
        "doc_type": "notebook",
        "base_figure_url": window.base_figure_url,
        "user_id": window.user_id,
        "library_id": window.main_id,
        "ppi": ppi
    };
    if (window.is_totally_new) {
        console.log("about to intialize");
        postWithCallback(window.main_id, "initialize_mainwindow", data_dict, _finish_post_load);
    } else {
        if (window.is_jupyter) {
            data_dict["doc_type"] = "jupyter";
            data_dict["project_name"] = window._project_name;
        } else if (is_project) {
            data_dict["project_name"] = window._project_name;
        } else {
            data_dict["unique_id"] = window.temp_data_id;
        }
        postWithCallback(main_id, "initialize_project_mainwindow", data_dict);
    }
}

function _finish_post_load(data) {
    let NotebookAppPlus = withStatus(NotebookApp, tsocket, true);
    var interface_state;
    if (window.is_project || window.opening_from_temp_id) {
        interface_state = data.interface_state;
    }
    let domContainer = document.querySelector('#main-root');
    if (window.is_project || window.opening_from_temp_id) {
        ReactDOM.render(React.createElement(NotebookAppPlus, { is_project: true,
            interface_state: interface_state,
            initial_theme: window.theme
        }), domContainer);
    } else {
        ReactDOM.render(React.createElement(NotebookAppPlus, { is_project: false,
            interface_state: null,
            initial_theme: window.theme
        }), domContainer);
    }
}

const save_attrs = ["console_items", "show_exports_pane", "console_width_fraction"];

class NotebookApp extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
        this.last_save = {};
        this.state = {
            mounted: false,
            console_items: [],
            usable_width: window.innerWidth - 2 * MARGIN_SIZE,
            usable_height: window.innerHeight - BOTTOM_MARGIN,
            console_width_fraction: .5,
            show_exports_pane: true,
            dark_theme: this.props.initial_theme == "dark"
        };
        if (this.props.is_project) {
            for (let attr of save_attrs) {
                this.state[attr] = this.props.interface_state[attr];
            }
        }
        let self = this;
        window.addEventListener("beforeunload", function (e) {
            if (self.dirty()) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    }

    componentDidMount() {
        this.setState({ "mounted": true });
        window.addEventListener("resize", this._update_window_dimensions);
        document.title = window.is_project ? window._project_name : "New Notebook";
        this._updateLastSave();
        this.props.stopSpinner();
        this.props.setStatusTheme(this.state.dark_theme);
        window.dark_theme = this.state.dark_theme;
    }

    _setTheme(dark_theme) {
        this.setState({ dark_theme: dark_theme }, () => {
            this.props.setStatusTheme(dark_theme);
            window.dark_theme = this.state.dark_theme;
        });
    }

    _update_window_dimensions() {
        this.setState({
            "usable_width": window.innerWidth - 2 * MARGIN_SIZE,
            "usable_height": window.innerHeight - BOTTOM_MARGIN - USUAL_TOOLBAR_HEIGHT
        });
    }

    _handleConsoleFractionChange(left_width, right_width, new_fraction) {
        this.setState({ console_width_fraction: new_fraction });
    }

    _setMainStateValue(field_name, value, callback = null) {
        let new_state = {};
        new_state[field_name] = value;
        this.setState(new_state, callback);
    }

    _broadcast_event_to_server(event_name, data_dict, callback) {
        data_dict.main_id = window.main_id;
        data_dict.event_name = event_name;
        postWithCallback(main_id, "distribute_events_stub", data_dict, callback);
    }

    get interface_state() {
        let interface_state = {};
        for (let attr of save_attrs) {
            interface_state[attr] = this.state[attr];
        }
        return interface_state;
    }

    _updateLastSave() {
        this.last_save = this.interface_state;
    }

    dirty() {
        let current_state = this.interface_state;
        for (let k in current_state) {
            if (current_state[k] != this.last_save[k]) {
                return true;
            }
        }
        return false;
    }

    render() {
        let disabled_items = [];
        if (!window.is_project || window.is_jupyter) {
            disabled_items.push("Save");
        }
        let console_available_height = this.state.usable_height - USUAL_TOOLBAR_HEIGHT;
        let menus = React.createElement(
            React.Fragment,
            null,
            React.createElement(ProjectMenu, _extends({}, this.props.statusFuncs, {
                postAjaxFailure: this.props.postAjaxFailure,
                console_items: this.state.console_items,
                interface_state: this.interface_state,
                updateLastSave: this._updateLastSave,
                changeCollection: null,
                disabled_items: disabled_items,
                hidden_items: ["Open Console as Notebook", "Export Table as Collection", "Change collection"]
            }))
        );
        let console_pane = React.createElement(ConsoleComponent, _extends({}, this.props.statusFuncs, {
            console_items: this.state.console_items,
            console_is_shrunk: false,
            console_is_zoomed: true,
            show_exports_pane: this.state.show_exports_pane,
            setMainStateValue: this._setMainStateValue,
            console_available_height: console_available_height - MARGIN_SIZE,
            console_available_width: this.state.usable_width * this.state.console_width_fraction - 16,
            zoomable: false,
            shrinkable: false,
            tsocket: tsocket,
            dark_theme: this.state.dark_theme,
            style: { marginTop: MARGIN_SIZE }
        }));
        let exports_pane;
        if (this.state.show_exports_pane) {
            exports_pane = React.createElement(ExportsViewer, { setUpdate: ufunc => this.updateExportsList = ufunc,
                available_height: console_available_height - MARGIN_SIZE,
                console_is_shrunk: false,
                console_is_zoomed: this.state.console_is_zoomed,
                tsocket: tsocket,
                style: { marginTop: MARGIN_SIZE }
            });
        } else {
            exports_pane = React.createElement("div", null);
        }
        let outer_class = "main-outer";
        if (this.state.dark_theme) {
            outer_class = outer_class + " bp3-dark";
        } else {
            outer_class = outer_class + " light-theme";
        }
        return React.createElement(
            React.Fragment,
            null,
            React.createElement(
                "div",
                { className: outer_class },
                React.createElement(TacticNavbar, { is_authenticated: window.is_authenticated,
                    user_name: window.username,
                    menus: menus,
                    dark_theme: this.state.dark_theme,
                    set_parent_theme: this._setTheme,
                    show_api_links: true
                }),
                React.createElement(HorizontalPanes, { left_pane: console_pane,
                    right_pane: exports_pane,
                    show_handle: true,
                    available_height: console_available_height,
                    available_width: this.state.usable_width,
                    initial_width_fraction: this.state.console_width_fraction,
                    controlled: true,
                    left_margin: MARGIN_SIZE,
                    dragIconSize: 15,
                    handleSplitUpdate: this._handleConsoleFractionChange
                })
            )
        );
    }
}

NotebookApp.propTypes = {
    console_items: PropTypes.array,
    console_component: PropTypes.object,
    is_project: PropTypes.bool,
    interface_state: PropTypes.object
};

class MainTacticSocket extends TacticSocket {

    initialize_socket_stuff() {
        this.socket.emit('join', { "room": user_id });
        this.socket.on('handle-callback', handleCallback);
        this.socket.on('close-user-windows', function (data) {
            postAsyncFalse("host", "remove_mainwindow_task", { "main_id": main_id });
            if (!(data["originator"] == main_id)) {
                window.close();
            }
        });
        this.socket.on("window-open", function (data) {
            window.open($SCRIPT_ROOT + "/load_temp_page/" + data["the_id"]);
        });

        this.socket.on("notebook-open", function (data) {
            window.open($SCRIPT_ROOT + "/open_notebook/" + data["the_id"]);
        });
        this.socket.on("doFlash", function (data) {
            doFlash(data);
        });
    }
}
_main_main();
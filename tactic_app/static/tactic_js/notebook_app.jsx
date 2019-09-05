
import {TacticNavbar} from "./base_module.js";
import {TacticSocket} from "./tactic_socket.js"
import {ProjectMenu} from "./main_menus_react.js";
import {ConsoleComponent} from "./console_react.js";
import {showModalReact} from "./modal_react.js";

const MARGIN_SIZE = 17;
const BOTTOM_MARGIN = 35;

let tsocket;
let ppi;

window.dirty = false;

function _main_main() {
    //render_navbar();
    console.log("entering _notebook_main");
    ppi = get_ppi();
    tsocket = new MainTacticSocket("main", 5000);
    tsocket.socket.on('finish-post-load', _finish_post_load)
}

function _after_main_joined() {
    let data_dict = {
            "doc_type": "notebook",
            "base_figure_url": window.base_figure_url,
            "use_ssl": window.use_ssl,
            "user_id": window.user_id,
            "library_id": window.main_id,
            "ppi": ppi
    };
    if (window.is_totally_new) {
        console.log("about to intialize");
        postWithCallback(window.main_id, "initialize_mainwindow", data_dict)
    }
    else {
        if (window.is_jupyter) {
            data_dict["doc_type"] = "jupyter";
            data_dict["project_name"] = window._project_name;
        }
        else if (is_project) {
            data_dict["project_name"] = window._project_name;
        }
        else  {
            data_dict["unique_id"] = window.temp_data_id;
        }
        postWithCallback(main_id, "initialize_project_mainwindow", data_dict)
    }
}

function _finish_post_load(data) {
    var interface_state;
    if (window.is_project) {
        window._collection_name = data.collection_name;
        window.doc_names = data.doc_names;
        window.short_collection_name = data.short_collection_name;
        interface_state = data.interface_state
    }

    let domContainer = document.querySelector('#main-root');
    if (window.is_project) {
        ReactDOM.render(<NotebookApp is_project={true}
                                 interface_state={interface_state}
                                 />,
            domContainer)
        }
        else {
            ReactDOM.render(<NotebookApp is_project={false}
                                     interface_state={null}
                                     />,
            domContainer)
        }
}

const save_attrs = ["console_items"];

class NotebookApp extends React.Component {
    constructor (props) {
        super(props);
        doBinding(this);
        this.state = {
            mounted: false,
            usable_width: window.innerWidth - 2 * MARGIN_SIZE - 30,
            usable_height: window.innerHeight - BOTTOM_MARGIN,
            console_items: [],
            console_item_with_focus: null,
            show_console_error_log: false,
            console_error_log_text: "",

        };
        if (this.props.is_project) {
            for (let attr of save_attrs) {
                this.state[attr] = this.props.interface_state[attr]
            }
        }
    }

    componentDidMount() {
        this.setState({"mounted": true});
        window.addEventListener("resize", this._update_window_dimensions);
        stopSpinner();
        tsocket.socket.on("console-message", this._handleConsoleMessage);

    }

    _setConsoleItemValue(unique_id, field, value) {
        let entry = this.get_console_item_entry(unique_id);
        entry[field] = value;
        this.replace_console_item_entry(unique_id, entry)
    }

    replace_console_item_entry(unique_id, new_entry) {
        let new_console_items = [...this.state.console_items];
        let cindex = this.consoleItemIndex(unique_id);
        new_console_items.splice(cindex, 1, new_entry);
        this.setState({console_items: new_console_items})
    }

    get_console_item_entry(unique_id) {
        return Object.assign({}, this.state.console_items[this.consoleItemIndex(unique_id)])
    }

    consoleItemIndex(unique_id) {
        let counter = 0;
        for (let entry of this.state.console_items) {
            if (entry.unique_id == unique_id) {
                return counter
            }
            ++counter;
        }
        return -1
    }

    _resortConsoleItems(new_sort_list) {
        let new_console_items = [];
        for (let uid of new_sort_list) {
            let new_entry = this.get_console_item_entry(uid);
            new_console_items.push(new_entry)
        }
        this.setState({console_items: new_console_items})
    }
    
    _goToNextCell(unique_id) {
        let next_index = this.consoleItemIndex(unique_id) + 1;
        if (next_index == this.state.console_items.length) return;
        let next_id = this.state.console_items[next_index].unique_id;
        this._setConsoleItemValue(next_id, "set_focus", true)
    }

    _closeConsoleItem(unique_id) {
        let cindex = this.consoleItemIndex(unique_id);
        let new_console_items = [...this.state.console_items];
        new_console_items.splice(cindex, 1);
        this.setState({console_items: new_console_items});
    }

    _addConsoleEntry(new_entry, force_open=true, set_focus=false) {
        new_entry.set_focus = set_focus;
        let insert_index;
        if (this.state.console_item_with_focus == null) {
            insert_index = this.state.console_items.length
        }
        else {
            insert_index = this.consoleItemIndex(this.state.console_item_with_focus) + 1
        }
        let new_console_items = [... this.state.console_items];
        new_console_items.splice(insert_index, 0, new_entry);
        let new_state = {console_items: new_console_items};
        if (force_open) {
            new_state.console_is_shrunk = false
        }

        this.setState(new_state)
    }

    _setMainStateValue(field_name, value, callback=null) {
        let new_state = {};
        new_state[field_name] = value;
        this.setState(new_state, callback);
    }

    _stopConsoleSpinner(data) {
        let new_entry = this.get_console_item_entry(data.console_id);
        new_entry.show_spinner = false;
        new_entry.execution_count = data.execution_count;
        this.replace_console_item_entry(data.console_id, new_entry)
    }

    _appendConsoleItemOutput(data) {
        let current = this.get_console_item_entry(data.console_id).output_text;
        if (current != "") {
            current += "<br>"
        }
        this._setConsoleItemValue(data.console_id, "output_text", current + data.message)
    }

    _handleConsoleMessage(data) {
        let self = this;
        let handlerDict = {
            consoleLog: (data)=>self._addConsoleEntry(data.message, data.force_open),
            stopConsoleSpinner: this._stopConsoleSpinner,
            consoleCodePrint: this._appendConsoleItemOutput
        };
        handlerDict[data.console_message](data)
    }

     _update_window_dimensions() {
        this.setState({
            "usable_width": window.innerWidth - 2 * MARGIN_SIZE - 30,
            "usable_height": window.innerHeight - BOTTOM_MARGIN
        });
    }


    _broadcast_event_to_server(event_name, data_dict, callback) {
        data_dict.main_id = window.main_id;
        data_dict.event_name = event_name;
        postWithCallback(main_id, "distribute_events_stub", data_dict, callback)
    }

    _saveProject () {
        // let console_node = cleanse_bokeh(document.getElementById("console"));
        let self = this;
        const result_dict = {
            "main_id": window.main_id,
        };
        let interface_state = {};
        for (let attr of save_attrs) {
            interface_state[attr] = this.state[attr]
        }

        result_dict.interface_state = interface_state;

        //tableObject.startTableSpinner();
        startSpinner();
        postWithCallback(window.main_id, "update_project", result_dict, updateSuccess);
        function updateSuccess(data) {
            if (data.success) {
                self.setState({"show_table_spinner": false});
                clearStatusMessage();
                data.alert_type = "alert-success";
                dirty = false;
                data.timeout = 2000;
                doFlashStopSpinner(data)
            }
            else {
                self.setState({"show_table_spinner": false});
                clearStatusMessage();
                data.alert_type = "alert-warning";
                dirty = false;
                doFlashStopSpinner(data)
            }
        }
    }

    _saveProjectAs() {
        startSpinner();
        let self = this;
        postWithCallback("host", "get_project_names", {"user_id": window.user_id}, function (data) {
            let checkboxes;
            showModalReact("Save Notebook As", "New Notebook Name", CreateNewProject,
                      "NewNotebook", data["project_names"])
        });

        function CreateNewProject (new_name) {
            //let console_node = cleanse_bokeh(document.getElementById("console"));
            const result_dict = {
                "project_name": new_name,
                "main_id": window.main_id,
                "doc_type": "notebook",
                "purgetiles": true
            };
            let interface_state = {};
            for (let attr of save_attrs) {
                interface_state[attr] = self.state[attr]
            }

            result_dict.interface_state = interface_state;

            // tableObject.startTableSpinner();
            postWithCallback(main_id, "save_new_notebook_project", result_dict, save_as_success);

            function save_as_success(data_object) {
                if (data_object["success"]) {
                    //tableObject.stopTableSpinner();
                    let is_jupyter = false;
                    clearStatusMessage();
                    // menus["Project"].enable_menu_item("save");
                    // if (DOC_TYPE != "notebook") {
                    //     tableObject.project_name = data_object["project_name"];
                    // }
                    //tableObject.set_table_title()
                    // $("#project-name").html(tableObject.project_name);
                    // $("title").html(data_object["project_name"]);
                    data_object.alert_type = "alert-success";
                    data_object.timeout = 2000;
                    window._project_name = data_object.project_name;  // When menus recreated, it checks _project_name
                    // dirty = false;
                    data_object["message"] = data_object["message"];

                    postWithCallback("host", "update_project_selector_list", {'user_id': window.user_id});
                    doFlashStopSpinner(data_object);
                }
                else {
                    //tableObject.stopTableSpinner();
                    clearStatusMessage();
                    data_object["message"] = data_object["message"];
                    data_object["alert-type"] = "alert-warning";
                    doFlashStopSpinner(data_object)
                }
            }
        }
    }

    render () {

        let menus = (
            <React.Fragment>
                <ProjectMenu saveProjectAs={this._saveProjectAs}
                             saveProject={this._saveProject}
                />
            </React.Fragment>
        );
        return (
            <React.Fragment>
                <TacticNavbar is_authenticated={window.is_authenticated}
                              user_name={window.username}
                              menus={menus}
                />
                <ConsoleComponent console_items={this.state.console_items}
                                  error_log_text={this.state.console_error_log_text}
                                  am_shrunk={false}
                                  am_zoomed={false}
                                  am_notebook={true}
                                  show_error_log={this.state.show_console_error_log}
                                  available_height={this.state.usable_height}
                                  setConsoleItemValue={this._setConsoleItemValue}
                                  setMainStateValue={this._setMainStateValue}
                                  handleItemDelete={this._closeConsoleItem}
                                  goToNextCell={this._goToNextCell}
                                  resortConsoleItems={this._resortConsoleItems}/>
            </React.Fragment>
        )
    }
}

NotebookApp.propTypes = {
    is_project: PropTypes.bool,
    interface_state: PropTypes.object
};

class MainTacticSocket extends TacticSocket {

    initialize_socket_stuff() {
        this.socket.emit('join', {"room": user_id});
        this.socket.emit('join-main', {"room": main_id}, function() {
            _after_main_joined();
        });
        this.socket.on('handle-callback', handleCallback);
        this.socket.on('close-user-windows', function(data){
                    postAsyncFalse("host", "remove_mainwindow_task", {"main_id": main_id});
                    if (!(data["originator"] == main_id)) {
                        window.close()
                    }
                });
        this.socket.on('stop-heartbeat', function(data) {
            clearInterval(heartbeat_timer)
        });
        this.socket.on("window-open", function(data) {
            window.open($SCRIPT_ROOT + "/load_temp_page/" + data["the_id"])
        });

        this.socket.on("doFlash", function(data) {
            doFlash(data)
        });
        this.socket.on('show-status-msg', function (data){
            statusMessage(data)
        });
        this.socket.on("clear-status-msg", function (){
           clearStatusMessage()
        });

        this.socket.on("stop-status-spinner", function (){
           stopSpinner()
        });
    }
}

_main_main();
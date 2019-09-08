
import {TacticNavbar} from "./base_module.js";
import {ProjectMenu} from "./main_menus_react.js";
import {ConsoleComponent} from "./console_react.js";
import {withConsole} from "./with_console_hoc.js";
import {TacticSocket} from "./tactic_socket.js";

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
    tsocket.socket.emit('join-main', {"room": main_id}, function() {
            _after_main_joined();
        });
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
    if (window.is_project || window.opening_from_temp_id) {
        interface_state = data.interface_state
    }
    let domContainer = document.querySelector('#main-root');
    let MainComp = withConsole(NotebookApp, tsocket);
    if (window.is_project || window.opening_from_temp_id) {
        ReactDOM.render(<MainComp is_project={true}
                                  interface_state={interface_state}
                                 />,
            domContainer)
        }
        else {
            ReactDOM.render(<MainComp is_project={false}
                                      interface_state={null}
                                     />,
            domContainer)
        }
}

const save_attrs = [];
const save_prop_attrs = ["console_items", "console_is_shrunk"];

class NotebookApp extends React.Component {
    constructor (props) {
        super(props);
        doBinding(this);
        this.state = {
            mounted: false,
            usable_width: window.innerWidth - 2 * MARGIN_SIZE - 30,
            usable_height: window.innerHeight - BOTTOM_MARGIN,
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
        document.title = window.is_project ? window._project_name : this.props.short_collection_name;
        stopSpinner();
    }

    _setMainStateValue(field_name, value, callback=null) {
        let new_state = {};
        new_state[field_name] = value;
        this.setState(new_state, callback);
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

    get interface_state() {
        let interface_state = {};
        for (let attr of save_attrs) {
            interface_state[attr] = this.state[attr]
        }
        for (let attr of save_prop_attrs) {
            interface_state[attr] = this.props[attr]
        }
        return interface_state
    }

    render () {

        let menus = (
            <React.Fragment>
                <ProjectMenu console_items={this.state.console_items}
                             interface_state={this.interface_state}
                             changeCollection={null}
                             disabled_items={window.is_project ? [] : ["Save"]}
                             hidden_items={["Open Console as Notebook", "Export Table as Collection", "change collection"]}
                />
            </React.Fragment>
        );
        return (
            <React.Fragment>
                <TacticNavbar is_authenticated={window.is_authenticated}
                              user_name={window.username}
                              menus={menus}
                />
                <ConsoleComponent console_items={this.props.console_items}
                                  error_log_text={this.state.console_error_log_text}
                                  am_shrunk={false}
                                  am_zoomed={false}
                                  am_notebook={true}
                                  show_error_log={this.state.show_console_error_log}
                                  available_height={this.state.usable_height}
                                  setConsoleItemValue={this.props.setConsoleItemValue}
                                  setConsoleFieldValue={this.props.setConsoleFieldValue}
                                  setMainStateValue={this._setMainStateValue}
                                  handleItemDelete={this.props.handleConsoleItemDelete}
                                  goToNextCell={this.props.goToNextConsoleCell}
                                  resortConsoleItems={this.props.resortConsoleItems}/>
            </React.Fragment>
        )
    }
}

NotebookApp.propTypes = {
    console_items: PropTypes.array,
    console_is_shrunk: PropTypes.bool, // not used
    is_project: PropTypes.bool,
    interface_state: PropTypes.object,
    setConsoleItemValue: PropTypes.func,
    setConsoleFieldValue: PropTypes.func,
    setConsoleState: PropTypes.func,
    goToNextConsoleCell: PropTypes.func,
    handleConsoleItemDelete: PropTypes.func,
    resortConsoleItems: PropTypes.func,
};

class MainTacticSocket extends TacticSocket {

    initialize_socket_stuff() {
        this.socket.emit('join', {"room": user_id});
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

        this.socket.on("notebook-open", function(data) {
            window.open($SCRIPT_ROOT + "/open_notebook/" + data["the_id"])
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
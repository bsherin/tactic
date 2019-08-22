
import {render_navbar} from "./base_module.js";
import {MainTableCard} from "./table_react.js";
import {TacticSocket} from "./tactic_socket.js"
import {HorizontalPanes, VerticalPanes} from "./resizing_layouts.js";

const MARGIN_SIZE = 17;
const BOTTOM_MARGIN = 35;

let tsocket;
let ppi;

function _main_main() {
    render_navbar();
    console.log("entering start_post_load");
    let dirty = false;
    ppi = get_ppi();
    tsocket = new MainTacticSocket("main", 5000);
    tsocket.socket.on('finish-post-load', function (data) {
        postWithCallback(window.main_id, "grab_data", {"doc_name":window.doc_names[0]}, function (data) {
                let domContainer = document.querySelector('#main-root');
                ReactDOM.render(<MainApp short_collection_name={window.short_collection_name}
                                         column_names={data.table_spec.header_list}
                                         initial_data_rows={data.data_rows}
                                         initial_column_widths={data.table_spec.column_widths}
                                         doc_names={window.doc_names}/>,
                    domContainer)
        });
    })
}

function _after_main_joined() {

    let data_dict = {
        "collection_name": window._collection_name,
        "doc_type": "table",
        "base_figure_url": window.base_figure_url,
        "use_ssl": window.use_ssl,
        "user_id": window.user_id,
        "ppi": ppi
    };
    postWithCallback(main_id, "initialize_mainwindow", data_dict)
}


class MainApp extends React.Component {
    constructor (props) {
        super(props);
        doBinding(this);
        this.table_container_ref = React.createRef();
        this.state = {
            mounted: false,
            usable_width: window.innerWidth - 2 * MARGIN_SIZE - 30,
            usable_height: window.innerHeight - BOTTOM_MARGIN,
            height_fraction: .95,
            show_table_spinner: false,
            current_doc_name: props.doc_names[0],
            data_rows: props.initial_data_rows,
        }
    }

    componentDidMount() {
        this.setState({"mounted": true});
        window.addEventListener("resize", this._update_window_dimensions);
        stopSpinner()

    }

     _update_window_dimensions() {
        this.setState({
            "usable_width": window.innerWidth - 2 * MARGIN_SIZE - 30,
            "usable_height": window.innerHeight - BOTTOM_MARGIN
        });
    }

    _handleVerticalSplitUpdate(top_height, bottom_height, top_fraction) {
        this.setState({height_fraction: top_fraction})
    }

    get_hp_height () {
        if (this.state.mounted) {
            return (this.state.usable_height - this.table_container_ref.current.getBoundingClientRect().top) * this.state.height_fraction - 30;
        }
        else {
            return this.state.usable_height - 100
        }
    }

    get_vp_height () {
        if (this.state.mounted) {
            return this.state.usable_height - this.table_container_ref.current.getBoundingClientRect().top;
        }
        else {
            return this.state.usable_height - 50
        }
    }

    render () {
        let hp_height = this.get_hp_height();
        let vp_height = this.get_vp_height();
        let table_pane =  (
            <React.Fragment>
                <div ref={this.table_container_ref}>
                    <MainTableCard
                        handleTableShrink={this._handleTableShrink}
                        handleFilter={this._handleFilter}
                        handleUnFilter={this._handleUnfilter}
                        short_collection_name={this.props.short_collection_name}
                        handleChangeDoc={this._handleChangeDoc}
                        doc_names={this.props.doc_names}
                        column_names={this.props.column_names}
                        initial_column_widths={this.props.initial_column_widths}
                        data_rows={this.state.data_rows}
                        show_table_spinner={this.state.show_table_spinner}
                        available_height={hp_height}
                    />
                </div>
            </React.Fragment>
        );
        let tile_pane = (
            <div>tiles here</div>
        );
        let bottom_pane = (
            <div>Consoles and exports here</div>
        );

        let top_pane = (
            <HorizontalPanes left_pane={table_pane}
                             right_pane={tile_pane}
                             available_height={hp_height}
                             available_width={this.state.usable_width}
                             initial_width_fraction={.65}
            />
        );
        return (
            <VerticalPanes top_pane={top_pane}
                           bottom_pane={bottom_pane}
                           available_width={this.state.usable_width}
                           available_height={vp_height}
                           initial_height_fraction={.9}
                           handleSplitUpdate={this._handleVerticalSplitUpdate}

            />
        )
    }
}

MainApp.propTypes = {
    short_collection_name: PropTypes.string,
    column_names: PropTypes.array,
    initial_data_rows: PropTypes.array,
    initial_column_widths: PropTypes.array,
    doc_names: PropTypes.array,

};

class MainTacticSocket extends TacticSocket {

    initialize_socket_stuff() {
        this.socket.emit('join', {"room": user_id});
        this.socket.emit('join-main', {"room": main_id}, function() {
            _after_main_joined();
        });
        this.socket.on('tile-message', function (data) {
            tile_dict[data.tile_id][data.tile_message](data)
        });
        this.socket.on('table-message', function (data) {
            tableObject[data.table_message](data)
        });
        this.socket.on('console-message', function (data) {
            consoleObject[data.console_message](data)
        });
        this.socket.on('export-viewer-message', function(data) {
            exportViewerObject[data.export_viewer_message](data)
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

        this.socket.on('update-menus', function() {
            if (done_loading){
                postWithCallback("host", "get_tile_types", {"user_id": user_id}, function (data) {
                    clear_all_menus();
                    build_and_render_menu_objects(data.tile_types);
                    })
                }
            });
        this.socket.on('change-doc', function(data){
            $("#doc-selector").val(data.doc_name);
            if (table_is_shrunk) {
                tableObject.expandTable()
            }
            if (data.hasOwnProperty("row_id")) {
                change_doc($("#doc-selector")[0], data.row_id)
            }
            else {
                change_doc($("#doc-selector")[0], null)
            }

        });
    }
}

_main_main();
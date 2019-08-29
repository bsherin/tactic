
import {TacticNavbar} from "./base_module.js";
import {MainTableCard} from "./table_react.js";
import {TacticSocket} from "./tactic_socket.js"
import {HorizontalPanes, VerticalPanes} from "./resizing_layouts.js";
import {ProjectMenu, ColumnMenu} from "./main_menus_react.js";

const MARGIN_SIZE = 17;
const BOTTOM_MARGIN = 35;

let tsocket;
let ppi;

function _main_main() {
    //render_navbar();
    console.log("entering start_post_load");
    let dirty = false;
    ppi = get_ppi();
    tsocket = new MainTacticSocket("main", 5000);
    tsocket.socket.on('finish-post-load', _finish_post_load)
}

function _after_main_joined() {
    if (is_project) {
        let data_dict = {
            "project_name": window._project_name,
            "doc_type": "table",
            "library_id": window.main_id,
            "base_figure_url": window.base_figure_url,
            "use_ssl": window.use_ssl,
            "user_id": window.user_id,
            "ppi": ppi
        };
        postWithCallback(main_id, "initialize_project_mainwindow", data_dict)
    }

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

function _finish_post_load(data) {
    if (window.is_project) {
        window._collection_name = data.collection_name;
        window.doc_names = data.doc_names;
        window.short_collection_name(data.short_collection_name);

    }
    postWithCallback(window.main_id, "grab_data", {"doc_name":window.doc_names[0]}, function (data) {
            let domContainer = document.querySelector('#main-root');
            ReactDOM.render(<MainApp short_collection_name={window.short_collection_name}
                                     initial_column_names={data.table_spec.header_list}
                                     initial_data_rows={data.data_rows}
                                     initial_is_first_chunk={data.is_first_chunk}
                                     initial_is_last_chunk={data.is_last_chunk}
                                     initial_column_widths={data.table_spec.column_widths}
                                     initial_hidden_columns_list={data.table_spec.hidden_columns_list}
                                     console_html={data.console_html}
                                     doc_names={window.doc_names}/>,
                domContainer)
    });
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
            data_rows: props.initial_data_rows,
            is_first_chunk: props.initial_is_first_chunk,
            is_last_chunk: props.initial_is_last_chunk,
            scroll_top: 0,
            selected_column: null,
            table_spec: {column_names: this.props.initial_column_names,
                column_widths: this.props.initial_column_widths,
                hidden_columns_list: this.props.initial_hidden_columns_list,
                current_doc_name: props.doc_names[0]
            }
        }
    }

    componentDidMount() {
        this.setState({"mounted": true});
        window.addEventListener("resize", this._update_window_dimensions);
        let self = this;
        tsocket.socket.on('table-message', function (data) {
            self[data.table_message](data)
        });
        stopSpinner();
    }

    refill_table(data_object) {
        let new_table_spec = Object.assign({}, this.state.table_spec);
        new_table_spec.current_doc_name = data_object.doc_name;

        this.setState({
            data_rows: data_object.data_rows,
            is_first_chunk: data_object.is_first_chunk,
            is_last_chunk: data_object.is_last_chunk,
            table_spec: new_table_spec,
            scroll_top: 0
        })
    }

    set_visible_doc(doc_name, func) {
        const data_dict = {"doc_name": doc_name};
        if (func === null) {
            postWithCallback(window.main_id, "set_visible_doc", data_dict)
        }
        else {
            postWithCallback(window.main_id, "set_visible_doc", data_dict, func)
        }
    }

    _setSelectedColumn(col_name) {
        this.setState({selected_column: col_name})
    }

    _shift_column_left() {
        let cnum = this.state.table_spec.column_names.indexOf(this.state.selected_column);
        if (cnum == 0) return;
        let target_col = this.state.table_spec.column_names[cnum - 1];
        this._moveColumn(this.state.selected_column, target_col);
    }

    _shift_column_right() {
        let cnum = this.state.table_spec.column_names.indexOf(this.state.selected_column);
        if (cnum == (this.state.table_spec.column_names.length - 1)) return;
        let target_col = this.state.table_spec.column_names[cnum + 2];
        this._moveColumn(this.state.selected_column, target_col);
    }

    _moveColumn(tag_to_move, place_to_move) {
        let colnames = [...this.state.table_spec.column_names];
        let start_index = colnames.indexOf(tag_to_move);
        colnames.splice(start_index, 1);
        let end_index = colnames.indexOf(place_to_move);
        colnames.splice(end_index, 0, tag_to_move);
        let cwidths = [...this.state.table_spec.column_widths];
        let width_to_move = cwidths[start_index];
        cwidths.splice(start_index, 1);
        cwidths.splice(end_index, 0, width_to_move);
        this._updateTableSpec({column_names: colnames, column_widths: cwidths}, true)
    }
    
    _setStateFromDataObject(data, doc_name, func=null) {
        this.setState({
            data_rows: data.data_rows,
            is_first_chunk: data.is_first_chunk,
            is_last_chunk: data.is_last_chunk,
            table_spec: {column_names: data.table_spec.header_list,
                column_widths: data.table_spec.column_widths,
                hidden_columns_list: data.table_spec.hidden_columns_list,
                current_doc_name: doc_name
            }
        }, func);
    }

    _handleChangeDoc(new_doc_name) {
        let self = this;
        postWithCallback(window.main_id, "grab_data", {"doc_name":new_doc_name}, function (data) {
            stopSpinner();
            clearStatusMessage();
            self._setStateFromDataObject(data, new_doc_name);
            self.set_visible_doc(new_doc_name);
        })
    }

    _handleScroll(new_top) {
        this.setState({scroll_top: new_top})
    }

    _handleLastInView(last_row_index, old_top_edge_pos) {
        if (this.state.is_last_chunk) return;
        let self = this;
        let nrows = this.state.data_rows.length;
        postWithCallback(window.main_id, "grab_next_chunk", {"doc_name": this.state.table_spec.current_doc_name}, function (data) {
            let top_edge_pos = $("#table-area tbody tr:last").position().top;
            self._setStateFromDataObject(data, self.state.table_spec.current_doc_name, function () {
                const old_last_row = $('#table-area tbody tr')[nrows - data.step_size + 1];
                const rowpos = $(old_last_row).position();
                self.setState({"scroll_top": rowpos.top - top_edge_pos + $("#table-area tbody")[0].scrollTop})
            });
            stopSpinner();
        });
    }

    _handleFirstInView() {
        if (this.state.is_first_chunk) return;
        let self = this;
        postWithCallback(window.main_id, "grab_previous_chunk", {"doc_name": this.state.table_spec.current_doc_name}, function (data) {
            let top_edge_pos = $("#table-area tbody tr:first").position().top;
            self._setStateFromDataObject(data, self.state.table_spec.current_doc_name, function () {
                const old_last_row = $('#table-area tbody tr')[data.step_size - 1];
                const rowpos = $(old_last_row).position();
                self.setState({"scroll_top": rowpos.top - top_edge_pos + $("#table-area tbody")[0].scrollTop})
            });
            stopSpinner()
        })

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

    _updateTableSpec(spec_update, broadcast=false) {
        let new_tspec = Object.assign(this.state.table_spec, spec_update);
        this.setState({table_spec: new_tspec});
        if (broadcast) {
            this._broadcast_event_to_server("UpdateTableSpec", spec_update)
        }
    }

    _broadcast_event_to_server(event_name, data_dict, callback) {
        data_dict.main_id = window.main_id;
        data_dict.event_name = event_name;
        data_dict.doc_name = this.state.table_spec.current_doc_name;
        postWithCallback(main_id, "distribute_events_stub", data_dict, callback)
    }

    render () {
        let hp_height = this.get_hp_height();
        let vp_height = this.get_vp_height();
        let menus = (
            <React.Fragment>
                <ProjectMenu/>
                <ColumnMenu shiftColumnLeft={this.state.selected_column == null ? null : this._shift_column_left}
                            shiftColumnRight={this.state.selected_column == null ? null : this._shift_column_right}
                />
            </React.Fragment>
        );
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
                        data_rows={this.state.data_rows}
                        show_table_spinner={this.state.show_table_spinner}
                        available_height={hp_height}
                        table_spec={this.state.table_spec}
                        scroll_top={this.state.scroll_top}
                        handleScroll={this._handleScroll}
                        updateTableSpec={this._updateTableSpec}
                        handleFirstInView={this._handleFirstInView}
                        handleLastInView={this._handleLastInView}
                        is_last_chunk={this.state.is_last_chunk}
                        is_first_chunk={this.state.is_first_chunk}
                        selected_column={this.state.selected_column}
                        setSelectedColumn={this._setSelectedColumn}
                        moveColumn={this._moveColumn}
                        broadcast_event_to_server={this._broadcast_event_to_server}
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
            <React.Fragment>
                <TacticNavbar is_authenticated={window.is_authenticated}
                              user_name={window.username}
                              menus={menus}
                />
                <VerticalPanes top_pane={top_pane}
                               bottom_pane={bottom_pane}
                               available_width={this.state.usable_width}
                               available_height={vp_height}
                               initial_height_fraction={.9}
                               handleSplitUpdate={this._handleVerticalSplitUpdate}
                />
            </React.Fragment>
        )
    }
}

MainApp.propTypes = {
    short_collection_name: PropTypes.string,
    initial_column_names: PropTypes.array,
    initial_data_rows: PropTypes.array,
    initial_is_first_chunk: PropTypes.bool,
    initial_is_last_chunk: PropTypes.bool,
    initial_column_widths: PropTypes.array,
    initial_hidden_columns_list: PropTypes.array,
    console_html: PropTypes.string,
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
        // this.socket.on('table-message', function (data) {
        //     tableObject[data.table_message](data)
        // });
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
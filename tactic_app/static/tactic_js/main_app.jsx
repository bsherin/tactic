
import {TacticNavbar} from "./base_module.js";
import {MainTableCard, MainTableCardHeader, FreeformBody, TableHeader, TableBody, compute_added_column_width} from "./table_react.js";
import {TacticSocket} from "./tactic_socket.js"
import {HorizontalPanes, VerticalPanes} from "./resizing_layouts.js";
import {ProjectMenu, ColumnMenu, MenuComponent} from "./main_menus_react.js";
import {TileComponent} from "./tile_react.js";
import {ConsoleComponent} from "./console_react.js";
import {ExportsViewer} from "./export_viewer_react.js";
import {showModalReact, showSelectDialog} from "./modal_react.js";

const MARGIN_SIZE = 17;
const BOTTOM_MARGIN = 35;

const EXTRA_TABLE_AREA_SPACE = 500;


const HEARTBEAT_INTERVAL = 10000; //milliseconds
var heartbeat_timer = setInterval( function(){
   postAjax("register_heartbeat", {"main_id": window.main_id}, function () {});
}, HEARTBEAT_INTERVAL );

let tsocket;
let ppi;

function _main_main() {
    //render_navbar();
    console.log("entering start_post_load");
    ppi = get_ppi();
    tsocket = new MainTacticSocket("main", 5000);
    tsocket.socket.on('finish-post-load', _finish_post_load)
}

function _after_main_joined() {
    if (window.is_project) {
        let data_dict = {
            "project_name": window._project_name,
            "doc_type": window.doc_type,
            "library_id": window.main_id,
            "base_figure_url": window.base_figure_url,
            "use_ssl": window.use_ssl,
            "user_id": window.user_id,
            "ppi": ppi
        };
        postWithCallback(main_id, "initialize_project_mainwindow", data_dict)
    }
    else {
        let data_dict = {
            "collection_name": window._collection_name,
            "doc_type": window.doc_type,
            "base_figure_url": window.base_figure_url,
            "use_ssl": window.use_ssl,
            "user_id": window.user_id,
            "ppi": ppi
        };
        postWithCallback(main_id, "initialize_mainwindow", data_dict)
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
    postWithCallback(window.main_id, "grab_data", {"doc_name":window.doc_names[0]}, function (data) {
            let domContainer = document.querySelector('#main-root');
            if (window.is_freeform) {
                if (window.is_project) {
                    ReactDOM.render(<MainApp is_project={true}
                                             interface_state={interface_state}
                                             initial_data_text={data.data_text}
                                             initial_doc_names={window.doc_names}/>,
                    domContainer)

                }
                else {
                    ReactDOM.render(<MainApp is_project={false}
                                             interface_state={null}
                                             initial_data_text={data.data_text}
                                             initial_doc_names={window.doc_names}/>,
                    domContainer)
                }
            }
            else {
                if (window.is_project) {
                    ReactDOM.render(<MainApp is_project={true}
                                             interface_state={interface_state}
                                             initial_column_names={data.table_spec.header_list}
                                             initial_data_rows={data.data_rows}
                                             initial_is_first_chunk={data.is_first_chunk}
                                             initial_is_last_chunk={data.is_last_chunk}
                                             initial_column_widths={data.table_spec.column_widths}
                                             initial_hidden_columns_list={data.table_spec.hidden_columns_list}
                                             initial_doc_names={window.doc_names}/>,
                    domContainer)
                }
                else {
                    ReactDOM.render(<MainApp is_project={false}
                                             interface_state={null}
                                             initial_column_names={data.table_spec.header_list}
                                             initial_data_rows={data.data_rows}
                                             initial_is_first_chunk={data.is_first_chunk}
                                             initial_is_last_chunk={data.is_last_chunk}
                                             initial_column_widths={data.table_spec.column_widths}
                                             initial_hidden_columns_list={data.table_spec.hidden_columns_list}
                                             initial_doc_names={window.doc_names}/>,
                    domContainer)
                }
            }

    });
}

const save_attrs = ["height_fraction", "tile_list", "table_is_shrunk", "console_width_fraction", "console_items",
    'console_is_shrunk', 'console_is_zoomed', "show_exports_pane", "horizontal_fraction", "pipe_dict"];


class MainApp extends React.Component {
    constructor (props) {
        super(props);
        doBinding(this);
        this.table_container_ref = React.createRef();
        this.tile_div_ref = React.createRef();
        this.tbody_ref = React.createRef();
        let base_state = {
                mounted: false,
                doc_names: props.initial_doc_names,
                short_collection_name: window.short_collection_name,
                usable_width: window.innerWidth - 2 * MARGIN_SIZE - 30,
                usable_height: window.innerHeight - BOTTOM_MARGIN,
                height_fraction: .85,
                tile_types: {},
                tile_list: [],
                search_text: "",
                alt_search_text: null,
                table_is_shrunk: false,
                console_width_fraction: .5,
                console_items: [],
                console_is_shrunk: true,
                console_is_zoomed: false,
                console_item_with_focus: null,
                show_console_error_log: false,
                console_error_log_text: "",
                show_exports_pane: false,
                horizontal_fraction: .65,
                pipe_dict: {},
                pipe_dict_updated: false,

        };
        let additions;
        if (window.is_freeform) {
            additions = {
                data_text: props.initial_data_text,
                table_spec: {
                    current_doc_name: props.initial_doc_names[0]
                }
            }
        }
        else {
            additions = {
                show_table_spinner: false,
                data_rows: props.initial_data_rows,
                cells_to_color_text: {},
                is_first_chunk: props.initial_is_first_chunk,
                is_last_chunk: props.initial_is_last_chunk,
                force_row_to_top: null,
                scroll_top: 0,
                selected_column: null,
                selected_row: null,
                table_is_filtered: false,
                table_spec: {column_names: this.props.initial_column_names,
                    column_widths: this.props.initial_column_widths,
                    hidden_columns_list: this.props.initial_hidden_columns_list,
                    current_doc_name: props.initial_doc_names[0]
                },
            };
        }
        this.state= Object.assign(base_state, additions);

        if (this.props.is_project) {
            for (let attr of save_attrs) {
                this.state[attr] = this.props.interface_state[attr]
            }
        }
    }

    componentDidMount() {
        this.setState({"mounted": true});
        window.addEventListener("resize", this._update_window_dimensions);
        document.title = window.is_project ? window._project_name : this.state.short_collection_name;
        let self = this;
        tsocket.socket.on('table-message', function (data) {
            self._handleTableMessage(data)
        });
        postWithCallback("host", "get_tile_types", {"user_id": window.user_id}, function (data) {
            self.setState({tile_types: data.tile_types});
        });

        tsocket.socket.on("tile-message", this._handleTileMessage);
        tsocket.socket.on("console-message", this._handleConsoleMessage);
        tsocket.socket.on("export-viewer-message", this._handleExportViewerMessage);
        tsocket.socket.on("update-menus", function () {
            postWithCallback("host", "get_tile_types", {"user_id": window.user_id}, function (data) {
                self.setState({tile_types: data.tile_types});
            });
        });
        tsocket.socket.on('tile-source-change', function (data) {
            self._markSourceChange(data.tile_type)
        });
        tsocket.socket.on('change-doc', function(data){
            let row_id = data.hasOwnProperty("row_id") ? data.row_id : null;
            if (self.state.table_is_shrunk) {
                self.setState({table_is_shrunk: false})
            }
            self._handleChangeDoc(data.doc_name, row_id)
        });
        this.createTileSorter();
        this._updateExportsList();
        if (!window.is_project) {
            stopSpinner();
        }
    }

    get tile_sorter_exists() {
        return $("#tile-div").hasClass("ui-sortable")
    }

    componentDidUpdate() {
        if (!this.tile_sorter_exists) {
            this.createTileSorter()
        }
    }

    // Every item in tile_list is a list of this form
    _createTileEntry(tile_name, tile_type, tile_id, form_data) {
        return {
            tile_name: tile_name,
            tile_type: tile_type,
            tile_id: tile_id,
            form_data: form_data,
            tile_height: 345,
            tile_width: 410,
            show_form: false,
            show_spinner: false,
            source_changed: false,
            javascript_code: null,
            javascript_arg_dict: null,
            show_log: false,
            log_content: "",
            shrunk: false,
            front_content: ""}
    }

    _resortTiles(new_sort_list) {
        let new_tile_list = [];
        for (let tid of new_sort_list) {
            let new_entry = this.get_tile_entry(tid);
            new_tile_list.push(new_entry)
        }
        this.setState({tile_list: new_tile_list})
    }

    createTileSorter() {
        let self = this;
        $(this.tile_div_ref.current).sortable({
            handle: '.card-header',
            tolerance: 'pointer',
            revert: 'invalid',
            forceHelperSize: true,
            stop: function() {
                const new_sort_list = $(self.tile_div_ref.current).sortable("toArray");
                self._resortTiles(new_sort_list);
            }
        });
        this.setState({tile_sorter_exists: true});
    }

    _markSourceChange(tile_type) {
        let new_tile_list = [...this.state.tile_list];
        let change_list = [];
        for (let entry of new_tile_list) {
            if (entry.tile_type == tile_type) {
                change_list.push(entry.tile_id)
            }
        }
        for (let tid of change_list) {
            this._setTileValue(tid, "source_changed", true)
        }
    }

    get_tile_entry(tile_id) {
        let tindex = this.tileIndex(tile_id);
        if (tindex == -1) return null;
        return Object.assign({}, this.state.tile_list[this.tileIndex(tile_id)])
    }

    replace_tile_entry(tile_id, new_entry, callback=null) {
        let new_tile_list = [...this.state.tile_list];
        let tindex = this.tileIndex(tile_id);
        new_tile_list.splice(tindex, 1, new_entry);
        this.setState({tile_list: new_tile_list}, callback)
    }

    tileIndex(tile_id) {
        let counter = 0;
        for (let entry of this.state.tile_list) {
            if (entry.tile_id == tile_id) {
                return counter
            }
            ++counter;
        }
        return -1
    }

    _closeTile(tile_id) {
        let tindex = this.tileIndex(tile_id);
        let new_tile_list = [...this.state.tile_list];
        new_tile_list.splice(tindex, 1);
        this.setState({tile_list: new_tile_list});
        const data_dict = {
            main_id: window.main_id,
            tile_id: tile_id
        };
        postWithCallback(window.main_id, "RemoveTile", data_dict);
    }

    _setTileValue(tile_id, field, value, callback=null) {
        let entry = this.get_tile_entry(tile_id);
        entry[field] = value;
        this.replace_tile_entry(tile_id, entry, callback)
    }

    _setTileState(tile_id, new_state, callback) {
        let entry = this.get_tile_entry(tile_id);
        for (let field in new_state) {
            entry[field] = new_state[field]
        }
        this.replace_tile_entry(tile_id, entry, callback)
    }

    _displayTileContentWithJavascript(tile_id, data) {
        this._setTileState(tile_id, {front_content: data.html,
            javascript_code: data.javascript_code,
            javascript_arg_dict: data.arg_dict})
    }

    _displayTileContent(tile_id, data) {
        this._setTileState(tile_id, {front_content: data.html,
            javascript_code: null,
            javascript_arg_dict: null})
    }

    _handleTileMessage(data) {
        let self = this;
        let handlerDict = {
            hideOptions: (tile_id, data)=>self._setTileValue(tile_id, "show_form", false),
            startSpinner: (tile_id, data)=>self._setTileValue(tile_id, "show_spinner", true),
            stopSpinner: (tile_id, data)=>self._setTileValue(tile_id, "show_spinner", false),
            displayTileContent: self._displayTileContent,
            displayFormContent: (tile_id, data)=>self._setTileValue(tile_id, "form_data", data.form_data),
            displayTileContentWithJavascript: self._displayTileContentWithJavascript
        };
        let tile_id = data.tile_id;
        handlerDict[data.tile_message](tile_id, data)
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

    _updateExportsList() {
        let self = this;
        postWithCallback(window.main_id, "get_full_pipe_dict", {}, function (data) {
            self.setState({pipe_dict: data.pipe_dict, pipe_dict_updated: true})
        })
    }

    _toggleExports() {
        this.setState({show_exports_pane: !this.state.show_exports_pane})
    }

    _handleExportViewerMessage(data) {
        let self = this;
        let handlerDict = {
            update_exports_popup: ()=>self._updateExportsList()
        };
        handlerDict[data.export_viewer_message](data)
    }

    _handleSearchFieldChange(search_text) {
        this.setState({search_text: search_text, alt_search_text: null});
        if ((search_text == null) && (!window.is_freeform)) {
            this.setState({cells_to_color_text: {}})
        }
    }

    _setAltSearchText(the_text) {
        this.setState({alt_search_text: the_text})
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

    _forceRowToTop(offset_top) {
        let scroll_top = offset_top - $('#table-area tbody tr')[0].offsetTop;
        this.setState({scroll_top: scroll_top, force_row_to_top: null})
    }
    
    _scrollRowToTop(row_index) {
        try {
            let top_of_top_row = $($('#table-area tbody tr')[0]).position().top;
            let top_of_given_row = $($('#table-area tbody tr')[row_index]).position().top;
            this.setState({scroll_top: top_of_given_row - top_of_top_row})
        }
        catch (e) {
            console.log("got an error trying to go to a row")
        }
    }
    _handleChangeDoc(new_doc_name, row_id=null) {
        let self = this;
        if ((row_id == null) || window.is_freeform) {
            postWithCallback(window.main_id, "grab_data", {"doc_name": new_doc_name}, function (data) {
            stopSpinner();
            clearStatusMessage();
            if (window.is_freeform) {
                let new_table_spec = {"current_doc_name": new_doc_name};
                self.setState({"data_text": data.data_text, "table_spec": new_table_spec})
            }
            else {
                self._setStateFromDataObject(data, new_doc_name, ()=>{
                    self.setState({scroll_top: 0})
                });
            }
            self.set_visible_doc(new_doc_name);
          })
        }
        else {
            const data_dict = {"doc_name": new_doc_name, "row_id": row_id};
            postWithCallback(main_id, "grab_chunk_with_row", data_dict, function (data) {
                let row_index = data.actual_row;
                self._setStateFromDataObject(data, new_doc_name, ()=>{
                    self.setState({force_row_to_top: row_index})
                })
            });
        }
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
            let top_fraction = this.state.console_is_shrunk ? 1 : this.state.height_fraction;
            return (this.state.usable_height - this.tile_div_ref.current.getBoundingClientRect().top) * top_fraction - 30;
        }
        else {
            return this.state.usable_height - 100
        }
    }

    get_vp_height () {
        if (this.state.mounted) {
            return this.state.usable_height - this.tile_div_ref.current.getBoundingClientRect().top;
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

    _tile_command(menu_id) {
        var existing_tile_names = [];
        for (let tile_entry of this.state.tile_list) {
            existing_tile_names.push(tile_entry.tile_name)
        }
        let self = this;
        showModalReact("Create " + menu_id, "New Tile Name", createNewTile, menu_id, existing_tile_names);

        function createNewTile(tile_name) {
            startSpinner();
            statusMessageText("Creating Tile " + tile_name);
            const data_dict = {};
            const tile_type = menu_id;
            data_dict["tile_name"] = tile_name;
            data_dict["tile_type"] = tile_type;
            data_dict["user_id"] = window.user_id;
            data_dict["parent"] = window.main_id;
            postWithCallback(window.main_id, "create_tile", data_dict, function (create_data) {
                if (create_data.success) {
                    let new_tile_entry = self._createTileEntry(tile_name,
                        menu_id,
                        create_data.tile_id,
                        create_data.form_data);
                    let new_tile_list = [...self.state.tile_list];
                    new_tile_list.push(new_tile_entry);
                    self.setState({"tile_list": new_tile_list});
                    self._updateExportsList();
                    clearStatusMessage();
                    stopSpinner()
                }
            })
        }
    }

    create_tile_menus() {
        let menu_items = [];
        for (let category in this.state.tile_types) {
            let option_dict = {};
            for (let ttype of this.state.tile_types[category]) {
                option_dict[ttype] = () => this._tile_command(ttype);
            }
            menu_items.push(<MenuComponent menu_name={category}
                                           option_dict={option_dict}
                                           disabled_items={[]}
                                           key={category}
            />)
        }
        return menu_items
    }

    _toggleTableShrink () {
        this.setState({table_is_shrunk: !this.state.table_is_shrunk,
            tile_sorter_exists: false
        })
    }

    _handleHorizontalFractionChange(new_fraction) {
        this.setState({horizontal_fraction: new_fraction})
    }

    _handleConsoleFractionChange(new_fraction) {
        this.setState({console_width_fraction: new_fraction})
    }

    // Table doctype-only methods start here

    _getTableBodyHeight(table_available_height) {
        if (!this.state.mounted || !this.tbody_ref.current) {
            return table_available_height- 50;
        }
        else {
            let top_offset = this.tbody_ref.current.getBoundingClientRect().top - this.table_container_ref.current.getBoundingClientRect().top;
            return table_available_height - top_offset
        }
    }

    compute_table_width() {
        let self = this;
        function reducer(accumulator, current_value, index) {
            if (self.state.table_spec.hidden_columns_list.includes(self.state.table_spec.column_names[index])) {
                return accumulator
            }
            else{
                return accumulator + current_value
            }
        }
        return this.state.table_spec.column_widths.reduce(reducer) + EXTRA_TABLE_AREA_SPACE;
    }

    _setFreeformDoc(doc_name, new_content) {
        if (doc_name == this.state.table_spec.current_doc_name) {
            this.setState({data_text: new_content})
        }
    }

     _handleTableMessage(data) {
        let self = this;
        let handlerDict = {
            refill_table: self._refill_table,
            dehighlightAllText: (data)=>self._handleSearchFieldChange(null),
            highlightTxtInDocument: (data)=>self._setAltSearchText(data.text_to_find),
            setCellContent: (data)=>self._setCellContent(data.row, data.column_header, data.new_content),
            colorTxtInCell: (data)=>self._colorTextInCell(data.row_id, data.column_header, data.token_text, data.color_dict),
            setFreeformContent: (data)=>self._setFreeformDoc(data.doc_name, data.new_content)
        };
        handlerDict[data.table_message](data)
    }

    _setCellContent(row_index, column_header, new_content) {
        let new_data_rows = [...this.state.data_rows];
        let the_row = Object.assign({}, new_data_rows[row_index]);
        the_row[column_header] = new_content;
        new_data_rows.splice(row_index, 1, the_row);
        this.setState({data_rows: new_data_rows})

    }

    _colorTextInCell(row_id, column_header, token_text, color_dict) {
        let ccd = Object.assign({}, this.state.cells_to_color_text);
        let entry;
        if (ccd.hasOwnProperty(row_id)) {
            entry = Object.assicn({}, ccd.row_id)
        }
        else {
            entry = {}
        }
        entry[column_header] = {token_text:token_text, color_dict: color_dict};
        ccd[row_id] = entry;
        this.setState({cells_to_color_text: ccd})
    }

    _refill_table(data_object) {
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

    _hideColumn() {
        let hc_list = [...this.state.table_spec.hidden_columns_list];
        hc_list.push(this.state.selected_column);
        this._updateTableSpec({hidden_columns_list: hc_list}, true)
    }

    _hideColumnInAll() {
        let hc_list = [...this.state.table_spec.hidden_columns_list];
        hc_list.push(this.state.selected_column);
        this._updateTableSpec({hidden_columns_list: hc_list}, false);
        const data_dict = {"column_name": this.state.selected_column};
        this._broadcast_event_to_server("HideColumnInAllDocs", data_dict)
    }

    _unhideAllColumns() {
        this._updateTableSpec({hidden_columns_list: ["__filename__"]}, true)

    }

    _addColumn(add_in_all=false) {
        let self = this;
        let title = add_in_all ? "Create Column All Documents" : "Create Column This Document";
        showModalReact(title, "New Column Name", function (new_name) {
            let cwidth = compute_added_column_width(new_name);
            self._updateTableSpec({column_names: [...self.state.table_spec.column_names, new_name],
                column_widths: [...self.state.table_spec.column_widths, cwidth]}, false);
            const data_dict = {"column_name": new_name,
                                "doc_name": self.state.current_doc_name,
                                "column_width": cwidth,
                                "all_docs": add_in_all};
            self._broadcast_event_to_server("CreateColumn", data_dict);
        })
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

    _changeCollection() {
        startSpinner();
        let self = this;
        postWithCallback("host", "get_collection_names",{"user_id": user_id}, function (data) {
            let collection_names = data["collection_names"];
            let option_names = [];
            for (var collection of collection_names) {
                option_names.push(collection)
            }
            showSelectDialog("Select New Collection", "New Collection", "Cancel",
                "Submit", changeTheCollection, option_names)
        });
        function changeTheCollection(new_collection_name) {
            const result_dict = {
                    "new_collection_name": new_collection_name,
                    "main_id": window.main_id
                };

            postWithCallback(window.main_id, "change_collection", result_dict, changeCollectionResult);
            function changeCollectionResult(data_object) {
                if (data_object.success) {
                    window._collection_name = data_object.collection_name;
                    self.setState({doc_names: data_object.doc_names,
                        short_collection_name: data_object.short_collection_name
                    }, self._handleChangeDoc(data_object.doc_names[0]));
                    stopSpinner();
                }
                else {
                    clearStatusMessage();
                    doFlashStopSpinner(data_object)
                }
            }
        }
    }

    get interface_state() {
        let interface_state = {};
        for (let attr of save_attrs) {
            interface_state[attr] = this.state[attr]
        }
        return interface_state
    }

    render () {
        let vp_height = this.get_vp_height();
        let hp_height = this.get_hp_height();

        let menus = (
            <React.Fragment>
                <ProjectMenu console_items={this.state.console_items}
                             interface_state={this.interface_state}
                             changeCollection={this._changeCollection}
                             disabled_items={window.is_project ? [] : ["Save"]}
                             hidden_items={["Export as Jupyter Notebook"]}
                />
                <ColumnMenu moveColumn={this._moveColumn}
                            table_spec={this.state.table_spec}
                            disable_all={this.state.selected_column == null}
                            hideColumn={this._hideColumn}
                            hideInAll={this._hideColumnInAll}
                            unhideAllColumns={this._unhideAllColumns}
                            addColumn={this._addColumn}
                            addColumnInAll={()=>this._addColumn(true)}
                />
                {this.create_tile_menus()}
            </React.Fragment>
        );
        let console_header_height = 35;
        let table_available_height = this.state.console_is_shrunk ? hp_height - console_header_height : hp_height;
        let table_style = {display: "block", tableLayout: "fixed"};
        if (this.state.table_spec.column_widths != null) {
            table_style["width"] = this.compute_table_width();
        }
        let card_header = (
            <MainTableCardHeader toggleShrink={this._toggleTableShrink}
                                 short_collection_name={this.state.short_collection_name}
                                 handleChangeDoc={this._handleChangeDoc}
                                 doc_names={this.state.doc_names}
                                 current_doc_name={this.state.table_spec.current_doc_name}
                                 show_table_spinner={this.state.show_table_spinner}
                                 handleSearchFieldChange={this._handleSearchFieldChange}
                                 search_text={this.state.search_text}
                                 setMainStateValue={this._setMainStateValue}
                                 table_is_filtered={this.state.table_is_filtered}
                                 show_filter_button={!window.is_freeform}
                                 broadcast_event_to_server={this._broadcast_event_to_server}
            />
        );
        let card_body;
        if (window.is_freeform) {
            card_body = <FreeformBody my_ref={this.tbody_ref}
                                      data_text={this.state.data_text}
                                      code_container_height={this._getTableBodyHeight(table_available_height)}
                                      search_text={this.state.search_text}
                                      alt_search_text={this.state.alt_search_text}
            />
        } else {
            card_body = (
                <table id="table-area" style={table_style}>
                    <TableHeader column_names={this.state.table_spec.column_names}
                                 column_widths={this.state.table_spec.column_widths}
                                 hidden_columns_list={this.state.table_spec.hidden_columns_list}
                                 selected_column={this.state.selected_column}
                                 setMainStateValue={this._setMainStateValue}
                                 moveColumn={this._moveColumn}
                    />
                    <TableBody my_ref={this.tbody_ref}
                               updateTableSpec={this._updateTableSpec}
                               table_spec={this.state.table_spec}
                               broadcast_event_to_server={this._broadcast_event_to_server}
                               data_rows={this.state.data_rows}
                               force_row_to_top={this.state.force_row_to_top}
                               forceRowToTop={this._forceRowToTop}
                               cells_to_color_text={this.state.cells_to_color_text}
                               column_names={this.state.table_spec.column_names}
                               column_widths={this.state.table_spec.column_widths}
                               hidden_columns_list={this.state.table_spec.hidden_columns_list}
                               height={this._getTableBodyHeight(table_available_height)}
                               scroll_top={this.state.scroll_top}
                               is_last_chunk={this.state.is_last_chunk}
                               is_first_chunk={this.state.is_first_chunk}
                               selected_column={this.state.selected_column}
                               selected_row={this.state.selected_row}
                               search_text={this.state.search_text}
                               alt_search_text={this.state.alt_search_text}
                               setMainStateValue={this._setMainStateValue}
                               handleFirstInView={this._handleFirstInView}
                               handleLastInView={this._handleLastInView}
                    />
                </table>
            );
        }

        let table_pane =  (
            <React.Fragment>
                <div ref={this.table_container_ref}>
                    <MainTableCard
                        card_body={card_body}
                        card_header={card_header}
                        table_spec={this.state.table_spec}
                        broadcast_event_to_server={this._broadcast_event_to_server}
                        updateTableSpec={this._updateTableSpec}
                    />
                </div>
            </React.Fragment>
        );
        let tile_pane = (
                <div id="tile-div" style={{height: hp_height}} ref={this.tile_div_ref}>
                    {this.state.tile_list.length > 0 &&
                        this.state.tile_list.map((entry) => (
                            <TileComponent tile_name={entry.tile_name}
                                           key={entry.tile_name}
                                           tile_id={entry.tile_id}
                                           source_changed={entry.source_changed}
                                           form_data={entry.form_data}
                                           front_content={entry.front_content}
                                           show_log={entry.show_log}
                                           show_form={entry.show_form}
                                           show_spinner={entry.show_spinner}
                                           shrunk={entry.shrunk}
                                           log_content={entry.log_content}
                                           tile_width={entry.tile_width}
                                           tile_height={entry.tile_height}
                                           javascript_code={entry.javascript_code}
                                           javascript_arg_dict={entry.javascript_arg_dict}
                                           handleClose={this._closeTile}
                                           setTileValue={this._setTileValue}
                                           setTileState={this._setTileState}
                                           current_doc_name={this.state.table_spec.current_doc_name}
                                           selected_row={this.state.selected_row}
                                           broadcast_event={this._broadcast_event_to_server}
                                           table_is_shrunk={this.state.table_is_shrunk}/>
                            )
                        )
                    }
                </div>
        );
        let exports_pane;
        if (this.state.show_exports_pane) {
            exports_pane = <ExportsViewer pipe_dict={this.state.pipe_dict}
                                          pipe_dict_updated={this.props.pipe_dict_updated}
                                          available_height={vp_height - hp_height}/>
        }
        else {
            exports_pane = <div></div>
        }
        let console_pane = <ConsoleComponent console_items={this.state.console_items}
                                             error_log_text={this.state.console_error_log_text}
                                             am_shrunk={this.state.console_is_shrunk}
                                             am_zoomed={this.state.console_is_zoomed}
                                             show_error_log={this.state.show_console_error_log}
                                             available_height={vp_height - hp_height}
                                             setConsoleItemValue={this._setConsoleItemValue}
                                             setMainStateValue={this._setMainStateValue}
                                             handleItemDelete={this._closeConsoleItem}
                                             goToNextCell={this._goToNextCell}
                                             resortConsoleItems={this._resortConsoleItems}
                                             toggleExports={this._toggleExports}/>;
        let bottom_pane = (
            <HorizontalPanes left_pane={console_pane}
                             right_pane={exports_pane}
                             available_height={vp_height - hp_height}
                             available_width={this.state.usable_width}
                             initial_width_fraction={this.state.console_width_fraction}
                             controlled={true}
                             handleFractionChange={this._handleConsoleFractionChange}
                />
        );
        let top_pane;
        if (this.state.table_is_shrunk) {
            top_pane = (
                <React.Fragment>
                    <button type='button' className="btn" onClick={this._toggleTableShrink}>
                        <span className="fas fa-window-maximize"></span>
                    </button>
                    {tile_pane}
                    {this.state.console_is_shrunk &&
                        bottom_pane
                    }
                </React.Fragment>
            )
        }
        else {
            top_pane = (
                <React.Fragment>
                    <HorizontalPanes left_pane={table_pane}
                         right_pane={tile_pane}
                         available_height={hp_height}
                         available_width={this.state.usable_width}
                         initial_width_fraction={this.state.horizontal_fraction}
                         controlled={true}
                         handleFractionChange={this._handleHorizontalFractionChange}
                    />
                    {this.state.console_is_shrunk &&
                        bottom_pane
                    }
                </React.Fragment>

            );
        }
        return (
            <React.Fragment>
                <TacticNavbar is_authenticated={window.is_authenticated}
                              user_name={window.username}
                              menus={menus}
                />
                {this.state.console_is_shrunk &&
                    top_pane
                }
                {!this.state.console_is_shrunk &&
                    <VerticalPanes top_pane={top_pane}
                               bottom_pane={bottom_pane}
                               available_width={this.state.usable_width}
                               available_height={vp_height}
                               initial_height_fraction={this.state.height_fraction}
                               handleSplitUpdate={this._handleVerticalSplitUpdate}
                    />
                }

            </React.Fragment>
        )
    }
}

MainApp.propTypes = {
    is_project: PropTypes.bool,
    interface_state: PropTypes.object,
    short_collection_name: PropTypes.string,
    initial_doc_names: PropTypes.array,
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
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { TacticNavbar } from "./blueprint_navbar.js";
import { MainTableCard, MainTableCardHeader, FreeformBody } from "./table_react.js";
import { BlueprintTable, compute_added_column_width } from "./blueprint_table.js";
import { TacticSocket } from "./tactic_socket.js";
import { HorizontalPanes, VerticalPanes } from "./resizing_layouts.js";
import { ProjectMenu, ColumnMenu, ViewMenu, MenuComponent } from "./main_menus_react.js";
import { TileContainer } from "./tile_react.js";
import { ExportsViewer } from "./export_viewer_react.js";
import { showModalReact, showSelectDialog } from "./modal_react.js";
import { ConsoleComponent } from "./console_component.js";
import { handleCallback, postAjax, postWithCallback, postAsyncFalse } from "./communication_react.js";
import { doFlash } from "./toaster.js";
import { withStatus } from "./toaster.js";
import { withErrorDrawer } from "./error_drawer.js";

let Bp = blueprint;
let Bpt = bptable;

export { MainTacticSocket };

const MARGIN_SIZE = 17;
const BOTTOM_MARGIN = 35; // includes space for status messages at bottom
const MARGIN_ADJUSTMENT = 8; // This is the amount at the top of both the table and the console
const CONSOLE_HEADER_HEIGHT = 35;
const EXTRA_TABLE_AREA_SPACE = 500;

const HEARTBEAT_INTERVAL = 10000; //milliseconds
var heartbeat_timer = setInterval(function () {
    postAjax("register_heartbeat", { "main_id": window.main_id }, function () {});
}, HEARTBEAT_INTERVAL);

let tsocket;
let ppi;

window.onunload = function (e) {
    postAsyncFalse("host", "remove_mainwindow_task", { "main_id": window.main_id });
};

function _main_main() {
    //render_navbar();
    console.log("entering start_post_load");
    ppi = get_ppi();
    tsocket = new MainTacticSocket("main", 5000);
    tsocket.socket.emit('join-main', { "room": main_id }, function () {
        _after_main_joined();
    });
    tsocket.socket.on('finish-post-load', _finish_post_load);
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
        postWithCallback(main_id, "initialize_project_mainwindow", data_dict);
    } else {
        let data_dict = {
            "collection_name": window._collection_name,
            "doc_type": window.doc_type,
            "base_figure_url": window.base_figure_url,
            "use_ssl": window.use_ssl,
            "user_id": window.user_id,
            "ppi": ppi
        };
        postWithCallback(main_id, "initialize_mainwindow", data_dict);
    }
}

function _finish_post_load(data) {
    let MainAppPlus = withErrorDrawer(withStatus(MainApp, tsocket), tsocket);
    var interface_state;
    if (window.is_project) {
        window._collection_name = data.collection_name;
        window.doc_names = data.doc_names;
        window.short_collection_name = data.short_collection_name;
        interface_state = data.interface_state;
    }
    if (window.is_freeform) {
        postWithCallback(window.main_id, "grab_freeform_data", { "doc_name": window.doc_names[0], "set_visible_doc": true }, function (data) {
            let domContainer = document.querySelector('#main-root');
            if (window.is_project) {
                ReactDOM.render(React.createElement(MainAppPlus, { is_project: true,
                    interface_state: interface_state,
                    initial_data_text: data.data_text,
                    initial_doc_names: window.doc_names }), domContainer);
            } else {
                ReactDOM.render(React.createElement(MainAppPlus, { is_project: false,
                    interface_state: null,
                    initial_data_text: data.data_text,
                    initial_doc_names: window.doc_names }), domContainer);
            }
        });
    } else {
        postWithCallback(window.main_id, "grab_chunk_by_row_index", { "doc_name": window.doc_names[0], "row_index": 0, "set_visible_doc": true }, function (data) {
            let domContainer = document.querySelector('#main-root');
            if (window.is_project) {
                ReactDOM.render(React.createElement(MainAppPlus, { is_project: true,
                    interface_state: interface_state,
                    total_rows: data.total_rows,
                    initial_column_names: data.table_spec.header_list,
                    initial_data_row_dict: data.data_row_dict,
                    initial_column_widths: data.table_spec.column_widths,
                    initial_hidden_columns_list: data.table_spec.hidden_columns_list,
                    initial_doc_names: window.doc_names }), domContainer);
            } else {

                ReactDOM.render(React.createElement(MainAppPlus, { is_project: false,
                    interface_state: null,
                    total_rows: data.total_rows,
                    initial_column_names: data.table_spec.header_list,
                    initial_data_row_dict: data.data_row_dict,
                    initial_column_widths: data.table_spec.column_widths,
                    initial_hidden_columns_list: data.table_spec.hidden_columns_list,
                    initial_doc_names: window.doc_names }), domContainer);
            }
        });
    }
}

const save_attrs = ["tile_list", "table_is_shrunk", "console_width_fraction", "horizontal_fraction", "pipe_dict", "console_items", "console_is_shrunk", "height_fraction", "show_exports_pane", 'console_is_zoomed'];

class MainApp extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
        this.table_container_ref = React.createRef();
        this.tile_div_ref = React.createRef();
        this.tbody_ref = React.createRef();
        this.table_ref = React.createRef();
        let base_state = {
            mounted: false,
            doc_names: props.initial_doc_names,
            short_collection_name: window.short_collection_name,
            console_items: [],
            awaiting_data: false,
            console_is_shrunk: true,
            show_exports_pane: false,
            console_is_zoomed: false,
            tile_types: {},
            tile_list: [],
            search_text: "",
            usable_width: window.innerWidth - 2 * MARGIN_SIZE,
            usable_height: window.innerHeight - BOTTOM_MARGIN,
            height_fraction: .85,
            alt_search_text: null,
            table_is_shrunk: false,
            console_width_fraction: .5,
            horizontal_fraction: .65
        };
        let additions;
        if (window.is_freeform) {
            additions = {
                data_text: props.initial_data_text,
                table_spec: {
                    current_doc_name: props.initial_doc_names[0]
                }
            };
        } else {
            additions = {
                show_table_spinner: false,
                data_row_dict: props.initial_data_row_dict,
                total_rows: props.total_rows,
                cells_to_color_text: {},
                force_row_to_top: null,
                selected_column: null,
                selected_row: null,
                table_is_filtered: false,
                table_spec: { column_names: this.props.initial_column_names,
                    column_widths: this.props.initial_column_widths,
                    hidden_columns_list: this.props.initial_hidden_columns_list,
                    current_doc_name: props.initial_doc_names[0]
                }
            };
        }
        if (window.is_notebook) {
            this.state.console_is_shrunk = false;
        }
        this.state = Object.assign(base_state, additions);

        if (this.props.is_project) {
            for (let attr of save_attrs) {
                this.state[attr] = this.props.interface_state[attr];
            }
            for (let entry of this.state.tile_list) {
                entry.finished_loading = false;
            }
        }
        this.updateExportsList = null;
    }

    _update_window_dimensions() {
        this.setState({
            "usable_width": window.innerWidth - 2 * MARGIN_SIZE,
            "usable_height": window.innerHeight - BOTTOM_MARGIN
        });
    }

    componentDidMount() {
        this.setState({ "mounted": true });
        window.addEventListener("resize", this._update_window_dimensions);
        document.title = window.is_project ? window._project_name : this.state.short_collection_name;
        let self = this;
        tsocket.socket.on('table-message', function (data) {
            self._handleTableMessage(data);
        });
        postWithCallback("host", "get_tile_types", { "user_id": window.user_id }, function (data) {
            self.setState({ tile_types: data.tile_types });
        });

        tsocket.socket.on("update-menus", function () {
            postWithCallback("host", "get_tile_types", { "user_id": window.user_id }, function (data) {
                self.setState({ tile_types: data.tile_types });
            });
        });

        tsocket.socket.on('change-doc', function (data) {
            let row_id = data.hasOwnProperty("row_id") ? data.row_id : null;
            if (self.state.table_is_shrunk) {
                self.setState({ table_is_shrunk: false });
            }
            self._handleChangeDoc(data.doc_name, row_id);
        });
        if (!window.is_project) {
            self.props.stopSpinner();
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
            finished_loading: true,
            front_content: "" };
    }

    _setMainStateValue(field_name, value, callback = null) {
        let new_state = {};
        new_state[field_name] = value;
        this.setState(new_state, callback);
    }

    _handleSearchFieldChange(search_text) {
        this.setState({ search_text: search_text, alt_search_text: null });
        if (search_text == null && !window.is_freeform) {
            this.setState({ cells_to_color_text: {} });
        }
    }

    _setAltSearchText(the_text) {
        this.setState({ alt_search_text: the_text });
    }

    set_visible_doc(doc_name, func) {
        const data_dict = { "doc_name": doc_name };
        if (func === null) {
            postWithCallback(window.main_id, "set_visible_doc", data_dict);
        } else {
            postWithCallback(window.main_id, "set_visible_doc", data_dict, func);
        }
    }

    _handleChangeDoc(new_doc_name, row_index = 0) {
        let self = this;
        this.setState({ show_table_spinner: true });
        if (window.is_freeform) {
            postWithCallback(window.main_id, "grab_freeform_data", { "doc_name": new_doc_name, "set_visible_doc": true }, function (data) {
                self.props.stopSpinner();
                self.props.clearStatusMessage();
                let new_table_spec = { "current_doc_name": new_doc_name };
                self.setState({ "data_text": data.data_text, "table_spec": new_table_spec }, () => {
                    self.setState({ show_table_spinner: false });
                });
                self.set_visible_doc(new_doc_name);
            });
        } else {
            const data_dict = { "doc_name": new_doc_name, "row_index": row_index, "set_visible_doc": true };
            postWithCallback(main_id, "grab_chunk_by_row_index", data_dict, function (data) {
                self._setStateFromDataObject(data, new_doc_name, () => {
                    self.setState({ show_table_spinner: false });
                });
            });
        }
    }

    _handleVerticalSplitUpdate(top_height, bottom_height, top_fraction) {
        this.setState({ height_fraction: top_fraction });
    }

    _updateTableSpec(spec_update, broadcast = false) {
        let new_tspec = Object.assign(this.state.table_spec, spec_update);
        this.setState({ table_spec: new_tspec });
        if (broadcast) {
            this._broadcast_event_to_server("UpdateTableSpec", spec_update);
        }
    }

    _broadcast_event_to_server(event_name, data_dict, callback) {
        data_dict.main_id = window.main_id;
        data_dict.event_name = event_name;
        data_dict.doc_name = this.state.table_spec.current_doc_name;
        postWithCallback(main_id, "distribute_events_stub", data_dict, callback);
    }

    _tile_command(menu_id) {
        var existing_tile_names = [];
        for (let tile_entry of this.state.tile_list) {
            existing_tile_names.push(tile_entry.tile_name);
        }
        let self = this;
        showModalReact("Create " + menu_id, "New Tile Name", createNewTile, menu_id, existing_tile_names);

        function createNewTile(tile_name) {
            self.props.startSpinner();
            self.props.statusMessage("Creating Tile " + tile_name);
            const data_dict = {};
            const tile_type = menu_id;
            data_dict["tile_name"] = tile_name;
            data_dict["tile_type"] = tile_type;
            data_dict["user_id"] = window.user_id;
            data_dict["parent"] = window.main_id;
            postWithCallback(window.main_id, "create_tile", data_dict, function (create_data) {
                if (create_data.success) {
                    let new_tile_entry = self._createTileEntry(tile_name, menu_id, create_data.tile_id, create_data.form_data);
                    let new_tile_list = [...self.state.tile_list];
                    new_tile_list.push(new_tile_entry);
                    self.setState({ "tile_list": new_tile_list });
                    if (self.updateExportsList) self.updateExportsList();
                    self.props.clearStatusMessage();
                    self.props.stopSpinner();
                } else {
                    self.props.addErrorDrawerEntry({ title: "Error creating tile", content: data.message });
                }
            });
        }
    }

    create_tile_menus() {
        let menu_items = [];
        for (let category in this.state.tile_types) {
            let option_dict = {};
            for (let ttype of this.state.tile_types[category]) {
                option_dict[ttype] = () => this._tile_command(ttype);
            }
            menu_items.push(React.createElement(MenuComponent, { menu_name: category,
                option_dict: option_dict,
                disabled_items: [],
                key: category
            }));
        }
        return menu_items;
    }

    _toggleTableShrink() {
        this.setState({ table_is_shrunk: !this.state.table_is_shrunk,
            tile_sorter_exists: false
        });
    }

    _handleHorizontalFractionChange(left_width, right_width, new_fraction) {
        this.setState({ horizontal_fraction: new_fraction });
    }

    _handleConsoleFractionChange(left_width, right_width, new_fraction) {
        this.setState({ console_width_fraction: new_fraction });
    }

    // Table doctype-only methods start here

    _getTableBodyHeight(table_available_height) {
        if (!this.state.mounted || !this.tbody_ref.current) {
            return table_available_height - 50;
        } else {
            let top_offset = this.tbody_ref.current.getBoundingClientRect().top - this.table_container_ref.current.getBoundingClientRect().top;
            let madjust = this.state.console_is_shrunk ? 2 * MARGIN_ADJUSTMENT : MARGIN_ADJUSTMENT;
            return table_available_height - top_offset - madjust;
        }
    }

    compute_table_width() {
        let self = this;
        function reducer(accumulator, current_value, index) {
            if (self.state.table_spec.hidden_columns_list.includes(self.state.table_spec.column_names[index])) {
                return accumulator;
            } else {
                return accumulator + current_value;
            }
        }
        return this.state.table_spec.column_widths.reduce(reducer) + EXTRA_TABLE_AREA_SPACE;
    }

    _setFreeformDoc(doc_name, new_content) {
        if (doc_name == this.state.table_spec.current_doc_name) {
            this.setState({ data_text: new_content });
        }
    }

    _handleTableMessage(data) {
        let self = this;
        let handlerDict = {
            refill_table: self._refill_table,
            dehighlightAllText: data => self._handleSearchFieldChange(null),
            highlightTxtInDocument: data => self._setAltSearchText(data.text_to_find),
            setCellContent: data => self._setCellContent(data.row, data.column_header, data.new_content),
            colorTxtInCell: data => self._colorTextInCell(data.row_id, data.column_header, data.token_text, data.color_dict),
            setFreeformContent: data => self._setFreeformDoc(data.doc_name, data.new_content)
        };
        handlerDict[data.table_message](data);
    }

    _setCellContent(row_id, column_header, new_content, broadcast = false) {
        let new_data_row_dict = Object.assign({}, this.state.data_row_dict);
        let the_row = Object.assign({}, new_data_row_dict[row_id]);
        the_row[column_header] = new_content;
        new_data_row_dict[row_id] = the_row;
        this.setState({ data_row_dict: new_data_row_dict });
        let data = { id: row_id, column_header: column_header, new_content: new_content, cellchange: false };
        if (broadcast) {
            this._broadcast_event_to_server("SetCellContent", data, null);
        }
    }

    _colorTextInCell(row_id, column_header, token_text, color_dict) {
        let ccd = Object.assign({}, this.state.cells_to_color_text);
        let entry;
        if (ccd.hasOwnProperty(row_id)) {
            entry = Object.assign({}, ccd[row_id]);
        } else {
            entry = {};
        }
        entry[column_header] = { token_text: token_text, color_dict: color_dict };
        ccd[row_id] = entry;
        this.setState({ cells_to_color_text: ccd });
    }

    _refill_table(data_object) {
        this._setStateFromDataObject(data_object, data_object.doc_name);
    }

    _moveColumn(tag_to_move, place_to_move) {
        let colnames = [...this.state.table_spec.column_names];
        let start_index = colnames.indexOf(tag_to_move);
        colnames.splice(start_index, 1);
        let end_index = colnames.indexOf(place_to_move);
        colnames.splice(end_index, 0, tag_to_move);

        let fnames = this._filteredColumnNames();
        start_index = fnames.indexOf(tag_to_move);
        fnames.splice(start_index, 1);
        end_index = fnames.indexOf(place_to_move);

        let cwidths = [...this.state.table_spec.column_widths];
        let width_to_move = cwidths[start_index];
        cwidths.splice(start_index, 1);
        cwidths.splice(end_index, 0, width_to_move);
        this._updateTableSpec({ column_names: colnames, column_widths: cwidths }, true);
    }

    _hideColumn() {
        let hc_list = [...this.state.table_spec.hidden_columns_list];
        let fnames = this._filteredColumnNames();
        let cname = this.state.selected_column;
        let col_index = fnames.indexOf(cname);
        let cwidths = [...this.state.table_spec.column_widths];
        cwidths.splice(col_index, 1);
        hc_list.push(cname);
        this._updateTableSpec({ hidden_columns_list: hc_list, column_widths: cwidths }, true);
    }

    _hideColumnInAll() {
        let hc_list = [...this.state.table_spec.hidden_columns_list];
        let fnames = this._filteredColumnNames();
        let cname = this.state.selected_column;
        let col_index = fnames.indexOf(cname);
        let cwidths = [...this.state.table_spec.column_widths];
        cwidths.splice(col_index, 1);
        hc_list.push(cname);
        this._updateTableSpec({ hidden_columns_list: hc_list, column_widths: cwidths }, false);
        const data_dict = { "column_name": this.state.selected_column };
        this._broadcast_event_to_server("HideColumnInAllDocs", data_dict);
    }

    _unhideAllColumns() {
        this._updateTableSpec({ hidden_columns_list: ["__filename__"] }, true);
    }

    _addColumn(add_in_all = false) {
        let self = this;
        let title = add_in_all ? "Create Column All Documents" : "Create Column This Document";
        showModalReact(title, "New Column Name", function (new_name) {
            let cwidth = compute_added_column_width(new_name);
            self._updateTableSpec({ column_names: [...self.state.table_spec.column_names, new_name],
                column_widths: [...self.state.table_spec.column_widths, cwidth] }, false);
            const data_dict = { "column_name": new_name,
                "doc_name": self.state.table_spec.current_doc_name,
                "column_width": cwidth,
                "all_docs": add_in_all };
            self._broadcast_event_to_server("CreateColumn", data_dict);
        });
    }

    _setStateFromDataObject(data, doc_name, func = null) {
        this.setState({
            data_row_dict: data.data_row_dict,
            total_rows: data.total_rows,
            table_spec: { column_names: data.table_spec.header_list,
                column_widths: data.table_spec.column_widths,
                hidden_columns_list: data.table_spec.hidden_columns_list,
                current_doc_name: doc_name
            }
        }, func);
    }

    _initiateDataGrab(row_index) {
        this.setState({ awaiting_data: true }, () => {
            this._grabNewChunkWithRow(row_index);
        });
    }

    _grabNewChunkWithRow(row_index) {
        let self = this;
        postWithCallback(window.main_id, "grab_chunk_by_row_index", { doc_name: this.state.table_spec.current_doc_name, row_index: row_index }, function (data) {
            let new_data_row_dict = Object.assign(self.state.data_row_dict, data.data_row_dict);
            self.setState({ data_row_dict: new_data_row_dict, awaiting_data: false });
        });
    }

    _changeCollection() {
        this.props.startSpinner();
        let self = this;
        postWithCallback("host", "get_collection_names", { "user_id": user_id }, function (data) {
            let collection_names = data["collection_names"];
            let option_names = [];
            for (var collection of collection_names) {
                option_names.push(collection);
            }
            showSelectDialog("Select New Collection", "New Collection", "Cancel", "Submit", changeTheCollection, option_names);
        });
        function changeTheCollection(new_collection_name) {
            const result_dict = {
                "new_collection_name": new_collection_name,
                "main_id": window.main_id
            };

            postWithCallback(window.main_id, "change_collection", result_dict, changeCollectionResult);
            function changeCollectionResult(data_object) {
                if (data_object.success) {
                    if (!window.is_project) document.title = new_collection_name;
                    window._collection_name = data_object.collection_name;
                    self.setState({ doc_names: data_object.doc_names, short_collection_name: data_object.short_collection_name }, () => {
                        self._handleChangeDoc(data_object.doc_names[0]);
                    });
                    self.props.stopSpinner();
                } else {
                    self.props.clearStatusMessage();
                    self.props.stopSpinner();
                    self.props.addErrorDrawerEntry({ title: "Error changing collection", content: data_object.message });
                }
            }
        }
    }

    get interface_state() {
        let interface_state = {};
        for (let attr of save_attrs) {
            interface_state[attr] = this.state[attr];
        }
        return interface_state;
    }

    get_hp_height() {
        if (this.state.mounted && this.tile_div_ref.current) {
            let top_fraction = this.state.console_is_shrunk ? 1 : this.state.height_fraction;
            return (this.state.usable_height - this.tile_div_ref.current.getBoundingClientRect().top) * top_fraction;
        } else {
            return this.state.usable_height - 100;
        }
    }

    get_vp_height() {
        if (this.state.mounted && this.tile_div_ref.current) {
            return this.state.usable_height - this.tile_div_ref.current.getBoundingClientRect().top;
        } else {
            return this.state.usable_height - 50;
        }
    }

    _filteredColumnNames() {
        let self = this;
        return this.state.table_spec.column_names.filter(name => {
            return !(self.state.table_spec.hidden_columns_list.includes(name) || name == "__id__");
        });
    }

    render() {
        let vp_height;
        let hp_height;
        let console_available_height;
        if (this.state.console_is_zoomed || window.is_notebook) {
            console_available_height = this.state.usable_height - 50;
        } else {
            vp_height = this.get_vp_height();
            hp_height = this.get_hp_height();
            console_available_height = vp_height - hp_height - MARGIN_ADJUSTMENT - 1;
        }
        let disabled_column_items = [];
        if (!this.state.selected_column) {
            disabled_column_items = ["Shift Left", "Shift Right", "Hide", "Hide in All Docs"];
        }
        let menus = React.createElement(
            React.Fragment,
            null,
            React.createElement(ProjectMenu, _extends({}, this.props.statusFuncs, {
                console_items: this.state.console_items,
                interface_state: this.interface_state,
                changeCollection: this._changeCollection,
                disabled_items: window.is_project ? [] : ["Save"],
                hidden_items: ["Export as Jupyter Notebook"]
            })),
            !window.is_freeform && React.createElement(ColumnMenu, _extends({}, this.props.statusFuncs, {
                moveColumn: this._moveColumn,
                table_spec: this.state.table_spec,
                filtered_column_names: this._filteredColumnNames(),
                selected_column: this.state.selected_column,
                disabled_items: disabled_column_items,
                hideColumn: this._hideColumn,
                hideInAll: this._hideColumnInAll,
                unhideAllColumns: this._unhideAllColumns,
                addColumn: this._addColumn
            })),
            React.createElement(ViewMenu, _extends({}, this.props.statusFuncs, {
                table_is_shrunk: this.state.table_is_shrunk,
                toggleTableShrink: this._toggleTableShrink,
                openErrorDrawer: this.props.openErrorDrawer
            })),
            React.createElement(Bp.NavbarDivider, null),
            this.create_tile_menus()
        );
        let table_available_height = this.state.console_is_shrunk ? hp_height - CONSOLE_HEADER_HEIGHT : hp_height;
        let table_style = { display: "block", tableLayout: "fixed" };
        if (this.state.table_spec.column_widths != null) {
            table_style["width"] = this.compute_table_width();
        }
        let card_header = React.createElement(MainTableCardHeader, { toggleShrink: this._toggleTableShrink,
            short_collection_name: this.state.short_collection_name,
            handleChangeDoc: this._handleChangeDoc,
            doc_names: this.state.doc_names,
            current_doc_name: this.state.table_spec.current_doc_name,
            show_table_spinner: this.state.show_table_spinner,
            handleSearchFieldChange: this._handleSearchFieldChange,
            search_text: this.state.search_text,
            setMainStateValue: this._setMainStateValue,
            table_is_filtered: this.state.table_is_filtered,
            show_filter_button: !window.is_freeform,
            broadcast_event_to_server: this._broadcast_event_to_server
        });
        let card_body;
        if (window.is_freeform) {
            card_body = React.createElement(FreeformBody, { my_ref: this.tbody_ref,
                data_text: this.state.data_text,
                code_container_height: this._getTableBodyHeight(table_available_height),
                search_text: this.state.search_text,
                alt_search_text: this.state.alt_search_text
            });
        } else {
            card_body = React.createElement(BlueprintTable, { my_ref: this.tbody_ref,
                ref: this.table_ref,
                awaiting_data: this.state.awaiting_data,
                initiateDataGrab: this._initiateDataGrab,
                height: this._getTableBodyHeight(table_available_height),
                column_names: this.state.table_spec.column_names,
                setCellContent: this._setCellContent,
                filtered_column_names: this._filteredColumnNames(),
                moveColumn: this._moveColumn,
                column_widths: this.state.table_spec.column_widths,
                hidden_columns_list: this.state.table_spec.hidden_columns_list,
                updateTableSpec: this._updateTableSpec,
                setMainStateValue: this._setMainStateValue,
                selected_column: this.state.selected_column,
                selected_row: this.state.selected_row,
                search_text: this.state.search_text,
                alt_search_text: this.state.alt_search_text,
                cells_to_color_text: this.state.cells_to_color_text,
                total_rows: this.state.total_rows,
                broadcast_event_to_server: this._broadcast_event_to_server,
                data_row_dict: this.state.data_row_dict });
        }

        let tile_pane = React.createElement(TileContainer, { height: table_available_height,
            tile_div_ref: this.tile_div_ref,
            tile_list: this.state.tile_list,
            current_doc_name: this.state.table_spec.current_doc_name,
            table_is_shrunk: this.state.table_is_shrunk,
            selected_row: this.state.selected_row,
            broadcast_event: this._broadcast_event_to_server,
            setMainStateValue: this._setMainStateValue,
            tsocket: tsocket
        });

        let exports_pane;
        if (this.state.show_exports_pane) {
            exports_pane = React.createElement(ExportsViewer, { setUpdate: ufunc => this.updateExportsList = ufunc,
                available_height: console_available_height,
                console_is_shrunk: this.state.console_is_shrunk,
                tsocket: tsocket
            });
        } else {
            exports_pane = React.createElement("div", null);
        }

        let console_pane = React.createElement(ConsoleComponent, { console_items: this.state.console_items,
            console_is_shrunk: this.state.console_is_shrunk,
            console_is_zoomed: this.state.console_is_zoomed,
            show_exports_pane: this.state.show_exports_pane,
            setMainStateValue: this._setMainStateValue,
            console_available_height: console_available_height,
            tsocket: tsocket
        });

        let bottom_pane = React.createElement(HorizontalPanes, { left_pane: console_pane,
            right_pane: exports_pane,
            available_height: console_available_height,
            available_width: this.state.usable_width,
            initial_width_fraction: this.state.console_width_fraction,
            controlled: true,
            handleSplitUpdate: this._handleConsoleFractionChange
        });
        let table_pane = React.createElement(
            React.Fragment,
            null,
            React.createElement(
                "div",
                { ref: this.table_container_ref },
                React.createElement(MainTableCard, {
                    card_body: card_body,
                    card_header: card_header,
                    table_spec: this.state.table_spec,
                    broadcast_event_to_server: this._broadcast_event_to_server,
                    updateTableSpec: this._updateTableSpec
                })
            ),
            this.state.console_is_shrunk && bottom_pane
        );
        let top_pane;
        if (this.state.table_is_shrunk) {
            top_pane = React.createElement(
                React.Fragment,
                null,
                tile_pane,
                this.state.console_is_shrunk && bottom_pane
            );
        } else {
            top_pane = React.createElement(HorizontalPanes, { left_pane: table_pane,
                right_pane: tile_pane,
                available_height: hp_height,
                available_width: this.state.usable_width,
                initial_width_fraction: this.state.horizontal_fraction,
                controlled: true,
                handleSplitUpdate: this._handleHorizontalFractionChange
            });
        }
        return React.createElement(
            React.Fragment,
            null,
            React.createElement(TacticNavbar, { is_authenticated: window.is_authenticated,
                user_name: window.username,
                menus: menus
            }),
            this.state.console_is_zoomed && bottom_pane,
            !this.state.console_is_zoomed && this.state.console_is_shrunk && top_pane,
            !this.state.console_is_zoomed && !this.state.console_is_shrunk && React.createElement(VerticalPanes, { top_pane: top_pane,
                bottom_pane: bottom_pane,
                available_width: this.state.usable_width,
                available_height: vp_height,
                initial_height_fraction: this.state.height_fraction,
                handleSplitUpdate: this._handleVerticalSplitUpdate,
                overflow: "hidden"
            })
        );
    }
}

MainApp.propTypes = {
    interface_state: PropTypes.object,
    initial_doc_names: PropTypes.array,
    initial_column_names: PropTypes.array,
    initial_data_row_dict: PropTypes.object,
    initial_column_widths: PropTypes.array,
    initial_hidden_columns_list: PropTypes.array,
    doc_names: PropTypes.array
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
        this.socket.on('stop-heartbeat', function (data) {
            clearInterval(heartbeat_timer);
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

import "../tactic_css/tactic.scss";
import "../tactic_css/tactic_main.scss";
import "../tactic_css/tactic_table.scss";
import "../tactic_css/tactic_console.scss";
import "../tactic_css/tactic_select.scss"

import React from "react";
import * as ReactDOM from 'react-dom'
import PropTypes from 'prop-types';

import { NavbarDivider } from "@blueprintjs/core";
import _ from 'lodash';

import {TacticNavbar} from "./blueprint_navbar.js";
import {TacticMenubar} from "./menu_utilities.js";
import {MainTableCard, MainTableCardHeader, FreeformBody} from "./table_react.js";
import {BlueprintTable, compute_added_column_width} from "./blueprint_table.js";
import {TacticSocket} from "./tactic_socket.js"
import {HorizontalPanes, VerticalPanes} from "./resizing_layouts.js";
import {ProjectMenu, DocumentMenu, ColumnMenu, RowMenu, ViewMenu, MenuComponent} from "./main_menus_react.js";
import {TileContainer} from "./tile_react.js";
import {ExportsViewer} from "./export_viewer_react.js";
import {showModalReact, showSelectDialog} from "./modal_react.js";
import {ConsoleComponent} from "./console_component.js";
import {handleCallback, postWithCallback, postAjaxPromise, postAjax} from "./communication_react.js";
import {doFlash} from "./toaster.js"
import {withStatus} from "./toaster.js";
import {withErrorDrawer} from "./error_drawer.js";
import {doBinding, get_ppi, renderSpinnerMessage} from "./utilities_react.js";
import {getUsableDimensions} from "./sizing_tools.js";
import {ErrorBoundary} from "./error_boundary";

export {main_props, MainApp}

const MARGIN_SIZE = 0;
const BOTTOM_MARGIN = 30;  // includes space for status messages at bottom
const MARGIN_ADJUSTMENT = 8; // This is the amount at the top of both the table and the console
const CONSOLE_HEADER_HEIGHT = 35;
const EXTRA_TABLE_AREA_SPACE = 500;
const USUAL_TOOLBAR_HEIGHT = 50;
const MENU_BAR_HEIGHT = 30; // will only appear when in context

let ppi;

function main_main() {
    function gotProps(the_props) {
        let MainAppPlus = withErrorDrawer(withStatus(MainApp));
        let the_element = <MainAppPlus {...the_props}
                                       controlled={false}
                                       initial_theme={window.theme}
                                       changeName={null}
        />;
        const domContainer = document.querySelector('#main-root');
        ReactDOM.render(the_element, domContainer)
    }

    renderSpinnerMessage("Starting up ...");
    const target = window.project_name == "" ? "main_collection_in_context" : "main_project_in_context";
    const resource_name = window.project_name == "" ? window.collection_name : window.project_name;

    postAjaxPromise(target, {"resource_name": resource_name})
        .then((data)=>{
            main_props(data, null, gotProps)
        })
}


function main_props(data, registerDirtyMethod, finalCallback) {

    ppi = get_ppi();
    let main_id = data.main_id;
    if (!window.in_context) {
        window.main_id = main_id;
    }
    let initial_tile_types;

    var tsocket = new TacticSocket("main", 5000, main_id, function(response) {
            tsocket.socket.on("remove-ready-block", readyListener);
            initial_tile_types = response.tile_types;
            tsocket.socket.emit('client-ready', {"room": main_id, "user_id": window.user_id,
                "participant": "client", "rb_id": data.ready_block_id, "main_id": main_id})
    });

    tsocket.socket.on('finish-post-load', _finish_post_load_in_context);

    function readyListener() {
        _everyone_ready_in_context(finalCallback)
    }

    window.addEventListener("unload", function sendRemove(event) {
        navigator.sendBeacon("/remove_mainwindow", JSON.stringify({"main_id": main_id}));
    });

    function _everyone_ready_in_context() {
        if (!window.in_context){
            renderSpinnerMessage("Everyone is ready, initializing...");
        }
        tsocket.socket.off("remove-ready-block", readyListener);
        tsocket.attachListener('handle-callback', (task_packet)=>{handleCallback(task_packet, main_id)});
        if (data.is_project) {
            let data_dict = {
                "project_name": data.project_name,
                "doc_type": data.doc_type,
                "base_figure_url": data.base_figure_url,
                "user_id": window.user_id,
                "ppi": ppi
            };
            postWithCallback(main_id, "initialize_project_mainwindow", data_dict, null, null, main_id)
        }
        else {
            let data_dict = {
                "collection_name": data.collection_name,
                "doc_type": data.doc_type,
                "base_figure_url": data.base_figure_url,
                "user_id": window.user_id,
                "ppi": ppi
            };
            postWithCallback(main_id, "initialize_mainwindow", data_dict, _finish_post_load_in_context, null, main_id)
        }
    }
    function _finish_post_load_in_context(fdata) {
        if (!window.in_context){
            renderSpinnerMessage("Creating the page...");
        }
        tsocket.socket.off("finish-post-load", _finish_post_load_in_context);
        var interface_state;
        if (data.is_project) {
            interface_state = fdata.interface_state;
            // legacy below lines needed for older saves
            if (!("show_exports_pane" in interface_state)) {
                interface_state["show_exports_pane"] = true
            }
            if (!("show_console_pane" in interface_state)) {
                interface_state["show_console_pane"] = true
            }
        }
        if (data.is_freeform) {
            finalCallback({is_project: data.is_project,
                           main_id: main_id,
                           is_freeform: true,
                           resource_name: data.is_project ? data.project_name : data.short_collection_name,
                           is_notebook: false,
                           is_jupyter: false,
                           tsocket: tsocket,
                           short_collection_name: data.short_collection_name,
                           initial_tile_types: initial_tile_types,
                           interface_state: interface_state,
                           initial_data_text: fdata.data_text,
                           initial_theme: window.theme,
                           initial_doc_names: fdata.doc_names,
                            registerDirtyMethod: registerDirtyMethod
            })

        }
        else {
            finalCallback({is_project: data.is_project,
                           main_id: main_id,
                           is_freeform: false,
                           is_notebook: false,
                           is_jupyter: false,
                           tsocket: tsocket,
                           resource_name: data.is_project ? data.project_name : data.short_collection_name,
                           short_collection_name: data.short_collection_name,
                           initial_tile_types: initial_tile_types,
                           interface_state: interface_state,
                           total_rows: fdata.total_rows,
                           initial_theme: window.theme,
                           initial_column_names: fdata.table_spec.header_list,
                           initial_data_row_dict: fdata.data_row_dict,
                           initial_column_widths: fdata.table_spec.column_widths,
                           initial_hidden_columns_list: fdata.table_spec.hidden_columns_list,
                           initial_cell_backgrounds: fdata.table_spec.cell_backgrounds,
                           initial_doc_names: fdata.doc_names,
                           registerDirtyMethod: registerDirtyMethod
            });
        }

    }

}

const save_attrs = ["tile_list", "table_is_shrunk", "console_width_fraction", "horizontal_fraction", "pipe_dict",
"console_items", "console_is_shrunk", "height_fraction", "show_exports_pane", "show_console_pane", 'console_is_zoomed'];

const controllable_props = ["is_project", "resource_name", "usable_width", "usable_height"];

class MainApp extends React.Component {
    constructor (props) {
        super(props);
        doBinding(this);
        this.initSocket();
        this.table_container_ref = React.createRef();
        this.tile_div_ref = React.createRef();
        this.tbody_ref = React.createRef();
        this.table_ref = React.createRef();
        this.main_outer_ref = React.createRef();
        this.last_save = {};
        this.resizing = false;
        this.socket_counter = null;
        let base_state = {
                mounted: false,
                doc_names: props.initial_doc_names,
                short_collection_name: this.props.short_collection_name,
                console_items: [],
                console_is_shrunk: true,
                show_exports_pane: true,
                show_console_pane: true,
                console_is_zoomed: false,
                tile_types: this.props.initial_tile_types,
                tile_list: [],
                search_text: "",
                height_fraction: .85,
                alt_search_text: null,
                table_is_shrunk: false,
                console_width_fraction: .5,
                horizontal_fraction: .65,
        };
        let additions;
        if (this.props.is_freeform) {
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
                data_row_dict: props.initial_data_row_dict,
                total_rows: props.total_rows,
                cells_to_color_text: {},
                force_row_to_top: null,
                selected_column: null,
                selected_row: null,
                selected_regions: null,
                table_is_filtered: false,
                spreadsheet_mode: false,
                table_spec: {column_names: this.props.initial_column_names,
                    column_widths: this.props.initial_column_widths,
                    cell_backgrounds: this.props.initial_cell_backgrounds,
                    hidden_columns_list: this.props.initial_hidden_columns_list,
                    current_doc_name: props.initial_doc_names[0]
                },
            };
        }
        this.state= Object.assign(base_state, additions);
        let self = this;

        if (this.props.controlled) {
            props.registerDirtyMethod(this._dirty);
            this.height_adjustment = MENU_BAR_HEIGHT;
        }
        else {
            this.height_adjustment = 0;
            this.state.dark_theme = props.initial_theme === "dark";
            this.state.usable_height = getUsableDimensions(true).usable_height_no_bottom;
            this.state.usable_width = getUsableDimensions(true).usable_width - 170;
            this.state.resource_name = props.resource_name;
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
            for (let entry of this.state.tile_list) {
                entry.finished_loading = false
            }
        }
        this.updateExportsList = null;
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

    _update_menus_listener(data) {
        let self = this;
        postWithCallback("host", "get_tile_types", {"user_id": window.user_id}, function (data) {
            self.setState({tile_types: data.tile_types});
        }), null, self.props.main_id;
    }

    _change_doc_listener(data) {
        let self = this;
        if (data.main_id == this.props.main_id) {
            let row_id = data.hasOwnProperty("row_id") ? data.row_id : null;
            if (self.state.table_is_shrunk) {
                self.setState({table_is_shrunk: false})
            }
            self._handleChangeDoc(data.doc_name, row_id)
        }
    }

    initSocket() {
        let self = this;
        if (!window.in_context) {
            this.props.tsocket.attachListener("window-open", data => {
                window.open(`${$SCRIPT_ROOT}/load_temp_page/${data["the_id"]}`)
            });
            this.props.tsocket.attachListener('close-user-windows', function(data){
                if (!(data["originator"] == main_id)) {
                    window.close()
                }
            });
            this.props.tsocket.attachListener("notebook-open", function(data) {
                window.open($SCRIPT_ROOT + "/new_notebook_with_data/" + data.temp_data_id)
            });
            this.props.tsocket.attachListener("doFlash", function(data) {
                doFlash(data)
            });
        }
        else {
            this.props.tsocket.attachListener("notebook-open", function(data) {
                const the_view = `${$SCRIPT_ROOT}/new_notebook_in_context`;
                postAjaxPromise(the_view, {temp_data_id: data.temp_data_id, resource_name: ""})
                    .then(self.props.handleCreateViewer)
                    .catch(doFlash);
            })
        }
        this.props.tsocket.attachListener('forcedisconnect', function() {
            self.props.tsocket.socket.disconnect()
        });

        this.props.tsocket.attachListener('table-message', this._handleTableMessage);
        this.props.tsocket.attachListener("update-menus", this._update_menus_listener);
        this.props.tsocket.attachListener('change-doc', this._change_doc_listener);
        this.props.tsocket.attachListener('handle-callback', (task_packet)=>{handleCallback(task_packet, this.props.main_id)});
    }

    _setTheme(dark_theme) {
        this.setState({dark_theme: dark_theme}, ()=> {
            if (!window.in_context) {
                window.dark_theme = this.state.dark_theme
            }
        })
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
            front_content: ""}
    }

    _setMainStateValue(field_name, value=null, callback=null) {
        if (typeof(field_name) == "object") {
            this.setState(field_name, callback)
        }
        else {
            let new_state = {};
            new_state[field_name] = value;
            this.setState(new_state, callback);
        }
    }

    _handleSearchFieldChange(search_text) {
        this.setState({search_text: search_text, alt_search_text: null});
        if ((search_text == null) && (!this.props.is_freeform)) {
            this.setState({cells_to_color_text: {}})
        }
    }
    
    _handleSpreadsheetModeChange(event) {
        this.setState({"spreadsheet_mode": event.target.checked});
    }

    _setAltSearchText(the_text) {
        this.setState({alt_search_text: the_text})
    }

    set_visible_doc(doc_name, func) {
        const data_dict = {"doc_name": doc_name};
        if (func === null) {
            postWithCallback(this.props.main_id, "set_visible_doc", data_dict, null, null, this.props.main_id)
        }
        else {
            postWithCallback(this.props.main_id, "set_visible_doc", data_dict, func, null, this.props.main_id)
        }
    }

    _handleChangeDoc(new_doc_name, row_index=0) {
        let self = this;
        this.setState({show_table_spinner: true});
        if (this.props.is_freeform) {
            postWithCallback(this.props.main_id, "grab_freeform_data", {"doc_name": new_doc_name, "set_visible_doc": true}, function (data) {
                self.props.stopSpinner();
                self.props.clearStatusMessage();
                let new_table_spec = {"current_doc_name": new_doc_name};
                self.setState({"data_text": data.data_text, "table_spec": new_table_spec}, ()=> {
                    self.setState({ show_table_spinner: false});
                });
                self.set_visible_doc(new_doc_name);
              }, null, self.props.main_id)
        }
        else {
            const data_dict = {"doc_name": new_doc_name, "row_index": row_index, "set_visible_doc": true};
            postWithCallback(this.props.main_id, "grab_chunk_by_row_index", data_dict, function (data) {
                self._setStateFromDataObject(data, new_doc_name, ()=>{
                    self.setState({ show_table_spinner: false});
                    self.table_ref.current._scrollToRow(row_index);
                });
            }, null, this.props.main_id);
        }
    }

    _handleVerticalSplitUpdate(top_height, bottom_height, top_fraction) {
        this.setState({height_fraction: top_fraction})
    }

    _updateTableSpec(spec_update, broadcast=false) {
        let new_tspec = _.cloneDeep(this.state.table_spec);
        new_tspec = Object.assign(new_tspec, spec_update);
        this.setState({table_spec: new_tspec});
        if (broadcast) {
            spec_update["doc_name"] = this.state.table_spec.current_doc_name;
            postWithCallback(this.props.main_id, "UpdateTableSpec", spec_update, null, null, this.props.main_id);
            // this._broadcast_event_to_server("UpdateTableSpec", spec_update)
        }
    }

    _broadcast_event_to_server(event_name, data_dict, callback) {
        data_dict.main_id = this.props.main_id;
        data_dict.event_name = event_name;
        data_dict.doc_name = this.state.table_spec.current_doc_name;
        postWithCallback(this.props.main_id, "distribute_events_stub", data_dict, callback, null, this.props.main_id)
    }

    _tile_command(menu_id) {
        var existing_tile_names = [];
        for (let tile_entry of this.state.tile_list) {
            existing_tile_names.push(tile_entry.tile_name)
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
            data_dict["parent"] = self.props.main_id;
            postWithCallback(self.props.main_id, "create_tile", data_dict, function (create_data) {
                if (create_data.success) {
                    let new_tile_entry = self._createTileEntry(tile_name,
                        menu_id,
                        create_data.tile_id,
                        create_data.form_data);
                    let new_tile_list = [...self.state.tile_list];
                    new_tile_list.push(new_tile_entry);
                    self.setState({"tile_list": new_tile_list});
                    if (self.updateExportsList) self.updateExportsList();
                    self.props.clearStatusMessage();
                    self.props.stopSpinner()
                }
                else {
                    self.props.addErrorDrawerEntry({title: "Error creating tile", content: create_data})
                }
            }, null, self.props.main_id)
        }
    }

    create_tile_menus() {
        let menu_items = [];
        let sorted_categories = [...Object.keys(this.state.tile_types)];
        sorted_categories.sort();
        for (let category of sorted_categories) {
            let option_dict = {};
            let sorted_types = [...this.state.tile_types[category]];
            sorted_types.sort();
            for (let ttype of sorted_types) {
                option_dict[ttype] = () => this._tile_command(ttype);
            }
            menu_items.push(<MenuComponent menu_name={category}
                                           option_dict={option_dict}
                                           binding_dict={{}}
                                           icon_dict={{}}
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

    _handleHorizontalFractionChange(left_width, right_width, new_fraction) {
        this.setState({horizontal_fraction: new_fraction})
    }

    _handleResizeStart() {
        this.resizing = true;
    }
    _handleResizeEnd() {
        this.resizing = false;
    }

    _handleConsoleFractionChange(left_width, right_width, new_fraction) {
        this.setState({console_width_fraction: new_fraction})
    }

    // Table doctype-only methods start here

    _getTableBodyHeight(table_available_height) {
        if (!this.state.mounted || !this.tbody_ref.current) {
            return table_available_height - 50;
        }
        else {
            let top_offset = this.tbody_ref.current.getBoundingClientRect().top - this.table_container_ref.current.getBoundingClientRect().top;
            let madjust = this.state.console_is_shrunk ? 2 * MARGIN_ADJUSTMENT : MARGIN_ADJUSTMENT;
            return table_available_height - top_offset - madjust
        }
    }

    _setFreeformDoc(doc_name, new_content) {
        if (doc_name == this.state.table_spec.current_doc_name) {
            this.setState({data_text: new_content})
        }
    }

     _handleTableMessage(data) {
        if (data.main_id == this.props.main_id) {
            let self = this;
            let handlerDict = {
                refill_table: self._refill_table,
                dehighlightAllText: (data)=>self._handleSearchFieldChange(null),
                highlightTxtInDocument: (data)=>self._setAltSearchText(data.text_to_find),
                updateNumberRows: (data)=>self._updateNumberRows(data.doc_name, data.number_rows),
                setCellContent: (data)=>self._setCellContent(data.row, data.column_header, data.new_content),
                colorTxtInCell: (data)=>self._colorTextInCell(data.row_id, data.column_header, data.token_text, data.color_dict),
                setFreeformContent: (data)=>self._setFreeformDoc(data.doc_name, data.new_content),
                updateDocList: (data)=>self._updateDocList(data.doc_names, data.visible_doc),
                setCellBackground: (data)=>self._setCellBackgroundColor(data.row, data.column_header, data.color)
            };
            handlerDict[data.table_message](data)
        }
    }

    _setCellContent(row_id, column_header, new_content, broadcast = false) {
        let new_data_row_dict = Object.assign({}, this.state.data_row_dict);
        let the_row = Object.assign({}, new_data_row_dict[row_id]);
        the_row[column_header] = new_content;
        new_data_row_dict[row_id] = the_row;
        this.setState({data_row_dict: new_data_row_dict});
        let data = {id: row_id, column_header: column_header, new_content: new_content, cellchange: false};
        if (broadcast) {
            this._broadcast_event_to_server("SetCellContent", data, null)
        }
    }

    _setCellBackgroundColor(row_id, column_header, color) {
        let new_table_spec = _.cloneDeep(this.state.table_spec);
        if (!new_table_spec.cell_backgrounds.hasOwnProperty(row_id)) {
            new_table_spec.cell_backgrounds[row_id] = {}
        }
        new_table_spec.cell_backgrounds[row_id][column_header] = color;
        this._updateTableSpec(new_table_spec)
    }

    _colorTextInCell(row_id, column_header, token_text, color_dict) {
        let ccd = Object.assign({}, this.state.cells_to_color_text);
        let entry;
        if (ccd.hasOwnProperty(row_id)) {
            entry = Object.assign({}, ccd[row_id])
        }
        else {
            entry = {}
        }
        entry[column_header] = {token_text:token_text, color_dict: color_dict};
        ccd[row_id] = entry;
        this.setState({cells_to_color_text: ccd})
    }

    _refill_table(data_object) {
        this._setStateFromDataObject(data_object, data_object.doc_name);
    }

    _moveColumn(tag_to_move, place_to_move) {
        let colnames = [...this.state.table_spec.column_names];
        let start_index = colnames.indexOf(tag_to_move);
        colnames.splice(start_index, 1);

        if (!place_to_move) {
            colnames.push(tag_to_move)
        }
        else {
            let end_index = colnames.indexOf(place_to_move);
            colnames.splice(end_index, 0, tag_to_move);
        }

        let fnames = this._filteredColumnNames();
        start_index = fnames.indexOf(tag_to_move);
        fnames.splice(start_index, 1);

        let cwidths = [...this.state.table_spec.column_widths];
        let width_to_move = cwidths[start_index];
        cwidths.splice(start_index, 1);

        if (!place_to_move) {
            cwidths.push(width_to_move)
        }
        else {
            let end_index = fnames.indexOf(place_to_move);
            cwidths.splice(end_index, 0, width_to_move);
        }

        this._updateTableSpec({column_names: colnames, column_widths: cwidths}, true)
    }


    _hideColumn() {
        let hc_list = [...this.state.table_spec.hidden_columns_list];
        let fnames = this._filteredColumnNames();
        let cname = this.state.selected_column;
        let col_index = fnames.indexOf(cname);
        let cwidths = [...this.state.table_spec.column_widths];
        cwidths.splice(col_index, 1);
        hc_list.push(cname);
        this._updateTableSpec({hidden_columns_list: hc_list, column_widths: cwidths}, true)
    }

    _hideColumnInAll() {
        let hc_list = [...this.state.table_spec.hidden_columns_list];
        let fnames = this._filteredColumnNames();
        let cname = this.state.selected_column;
        let col_index = fnames.indexOf(cname);
        let cwidths = [...this.state.table_spec.column_widths];
        cwidths.splice(col_index, 1);
        hc_list.push(cname);
        this._updateTableSpec({hidden_columns_list: hc_list, column_widths: cwidths}, false);
        const data_dict = {"column_name": this.state.selected_column};
        this._broadcast_event_to_server("HideColumnInAllDocs", data_dict)
    }

    _unhideAllColumns() {
        this._updateTableSpec({hidden_columns_list: ["__filename__"]}, true)

    }

    _deleteRow() {
        postWithCallback(this.props.main_id, "delete_row",
            {"document_name": this.state.table_spec.current_doc_name,
                "index": this.state.selected_row
            })
    }

    _insertRow(index) {
        postWithCallback(this.props.main_id, "insert_row",
            {"document_name": this.state.table_spec.current_doc_name,
                "index": index,
                "row_dict": {}
            }, null, null, this.props.main_id)
    }

    _duplicateRow() {
         postWithCallback(this.props.main_id, "insert_row",
            {"document_name": this.state.table_spec.current_doc_name,
                "index": this.state.selected_row,
                "row_dict": this.state.data_row_dict[this.state.selected_row]
            }, null, null, this.props.main_id)
    }


    _deleteColumn(delete_in_all=false) {
        let fnames = this._filteredColumnNames();
        let cname = this.state.selected_column;
        let col_index = fnames.indexOf(cname);
        let cwidths = [...this.state.table_spec.column_widths];
        cwidths.splice(col_index, 1);
        let hc_list = _.without(this.state.table_spec.hidden_columns_list, cname);
        let cnames = _.without(this.state.table_spec.column_names, cname);
        this._updateTableSpec({
            column_names: cnames,
            hidden_columns_list: hc_list,
            column_widths: cwidths}, false);
        const data_dict = {"column_name": cname,
                            "doc_name": this.state.table_spec.current_doc_name,
                            "all_docs": delete_in_all};
        postWithCallback(this.props.main_id, "DeleteColumn", data_dict, null, null, this.props.main_id);
    }

    _addColumn(add_in_all=false) {
        let self = this;
        let title = add_in_all ? "Create Column All Documents" : "Create Column This Document";
        showModalReact(title, "New Column Name", function (new_name) {
            let cwidth = compute_added_column_width(new_name);
            self._updateTableSpec({column_names: [...self.state.table_spec.column_names, new_name],
                column_widths: [...self.state.table_spec.column_widths, cwidth]}, false);
            const data_dict = {"column_name": new_name,
                                "doc_name": self.state.table_spec.current_doc_name,
                                "column_width": cwidth,
                                "all_docs": add_in_all};
            self._broadcast_event_to_server("CreateColumn", data_dict);
        })
    }

    _setStateFromDataObject(data, doc_name, func=null) {
        this.setState({
            data_row_dict: data.data_row_dict,
            total_rows: data.total_rows,
            table_spec: {column_names: data.table_spec.header_list,
                column_widths: data.table_spec.column_widths,
                hidden_columns_list: data.table_spec.hidden_columns_list,
                cell_backgrounds: data.table_spec.cell_backgrounds,
                current_doc_name: doc_name
            }
        }, func);
    }

    _initiateDataGrab(row_index) {
        this._grabNewChunkWithRow(row_index)
    }

    _grabNewChunkWithRow(row_index) {
        let self = this;
        postWithCallback(this.props.main_id, "grab_chunk_by_row_index",
            {doc_name: this.state.table_spec.current_doc_name, row_index: row_index}, function (data) {
            let new_data_row_dict = Object.assign(self.state.data_row_dict, data.data_row_dict);
            self.setState({data_row_dict: new_data_row_dict})
        }, null, this.props.main_id)
    }

    _changeCollection() {
        this.props.startSpinner();
        let self = this;
        postWithCallback("host", "get_collection_names",{"user_id": user_id}, function (data) {
            let option_names = data["collection_names"];
            showSelectDialog("Select New Collection", "New Collection", "Cancel",
                "Submit", changeTheCollection, option_names)
        }, null, this.props.main_id);
        function changeTheCollection(new_collection_name) {
            const result_dict = {
                    "new_collection_name": new_collection_name,
                    "main_id": this.props.main_id
                };

            postWithCallback(self.props.main_id, "change_collection", result_dict, changeCollectionResult, null, self.props.main_id);
            function changeCollectionResult(data_object) {
                if (data_object.success) {
                    if (!window.in_context && !this.state.is_project) document.title = new_collection_name;
                    window._collection_name = data_object.collection_name;
                    self.setState({doc_names: data_object.doc_names, short_collection_name: data_object.short_collection_name},
                        ()=>{self._handleChangeDoc(data_object.doc_names[0])});
                    self.props.stopSpinner();
                }
                else {
                    self.props.clearStatusMessage();
                    self.props.stopSpinner();
                    self.props.addErrorDrawerEntry({title: "Error changing collection", content: data_object.message})
                }
            }
        }
    }

    _updateDocList(doc_names, visible_doc) {
        let self = this;
        this.setState({doc_names: doc_names},
                        ()=>{self._handleChangeDoc(visible_doc)})
    }

    get interface_state() {
        let interface_state = {};
        for (let attr of save_attrs) {
            interface_state[attr] = this.state[attr]
        }
        return interface_state
    }

    get_hp_height () {
        if (this.state.mounted && this.tile_div_ref.current) {
            if (this.state.console_is_shrunk) {
                // return this._cProp("usable_height") - this.tile_div_ref.current.getBoundingClientRect().top - CONSOLE_HEADER_HEIGHT;
                return this._cProp("usable_height") - CONSOLE_HEADER_HEIGHT - BOTTOM_MARGIN - this.height_adjustment;
            }
            else {
                return (this._cProp("usable_height") - BOTTOM_MARGIN - this.height_adjustment) * this.state.height_fraction;
            }
        }
        else {
            return this._cProp("usable_height") - 100
        }
    }

    get_vp_height () {
        if (this.state.mounted && this.tile_div_ref.current) {
            return this._cProp("usable_height") - this.height_adjustment - BOTTOM_MARGIN;
        }
        else {
            return this._cProp("usable_height") - this.height_adjustment - 50
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

    _filteredColumnNames() {
        let self = this;
        return this.state.table_spec.column_names.filter((name)=>{
            return !(self.state.table_spec.hidden_columns_list.includes(name) || (name == "__id__"));
        })
    }

    _setProjectName(new_project_name) {
        let self = this;
        if (this.props.controlled) {
            this.props.updatePanel({res_type: "project", title: new_project_name, panel: {resource_name: new_project_name, is_project: true}}, ()=>{
                self.setState({is_jupyter: false})
            })
        }
        else {
            this.setState({"resource_name": new_project_name, "is_project": true})
        }
    }

    render() {
        let dark_theme = this.props.controlled ? this.props.dark_theme : this.state.dark_theme;
        let vp_height;
        let hp_height;
        let console_available_height;
        let my_props = {...this.props};
        if (!this.props.controlled) {
            for (let prop_name of controllable_props) {
                my_props[prop_name] = this.state[prop_name]
            }
        }
        let true_usable_width = my_props.usable_width;
        if (this.state.console_is_zoomed) {
            console_available_height = this.get_zoomed_console_height() - MARGIN_ADJUSTMENT;
        } else {
            vp_height = this.get_vp_height();
            hp_height = this.get_hp_height();
            if (this.state.console_is_shrunk) {
                console_available_height = CONSOLE_HEADER_HEIGHT;
            }
            else {
                console_available_height = vp_height - hp_height - MARGIN_ADJUSTMENT - 3;
            }
        }
        let disabled_column_items = [];
        if (this.state.selected_column == null) {
            disabled_column_items = [
                "Shift Left","Shift Right", "Hide", "Hide in All Docs", "Delete Column", "Delete Column In All Docs"
            ]
        }
        let disabled_row_items = [];
        if (this.state.selected_row == null) {
            disabled_row_items = ["Delete Row", "Insert Row Before", "Insert Row After", "Duplicate Row"]
        }
        let project_name = my_props.is_project ? this.props.resource_name : "";
        let menus = (
            <React.Fragment>
                <ProjectMenu {...this.props.statusFuncs}
                             main_id={this.props.main_id}
                             project_name={project_name}
                             is_notebook={this.props.is_notebook}
                             is_juptyer={this.props.is_jupyter}
                             setMainStateValue={this._setMainStateValue}
                             setProjectName={this._setProjectName}
                             postAjaxFailure={this.props.postAjaxFailure}
                             console_items={this.state.console_items}
                             interface_state={this.interface_state}
                             changeCollection={this._changeCollection}
                             updateLastSave={this._updateLastSave}
                             disabled_items={my_props.is_project ? [] : ["Save"]}
                             hidden_items={["Export as Jupyter Notebook"]}
                />
                <DocumentMenu {...this.props.statusFuncs}
                              documentNames={this.state.doc_names}
                              currentDoc={this.state.table_spec.current_doc_name}

                />
                {!this.props.is_freeform &&
                    <ColumnMenu {...this.props.statusFuncs}
                                main_id={this.props.main_id}
                                project_name={project_name}
                                is_notebook={this.props.is_notebook}
                                is_juptyer={this.props.is_jupyter}
                                moveColumn={this._moveColumn}
                                table_spec={this.state.table_spec}
                                filtered_column_names={this._filteredColumnNames()}
                                selected_column={this.state.selected_column}
                                disabled_items={disabled_column_items}
                                hideColumn={this._hideColumn}
                                hideInAll={this._hideColumnInAll}
                                unhideAllColumns={this._unhideAllColumns}
                                addColumn={this._addColumn}
                                deleteColumn={this._deleteColumn}
                    />
                }
                {!this.props.is_freeform &&
                    <RowMenu {...this.props.statusFuncs}
                             main_id={this.props.main_id}
                             project_name={project_name}
                             is_notebook={this.props.is_notebook}
                             is_juptyer={this.props.is_jupyter}
                             deleteRow={this._deleteRow}
                             insertRowBefore={()=>{this._insertRow(this.state.selected_row)}}
                             insertRowAfter={()=>{this._insertRow(this.state.selected_row +1)}}
                             duplicateRow={this._duplicateRow}
                             selected_row={this.state.selected_row}
                             disabled_items={disabled_row_items}
                    />
                }
                <ViewMenu {...this.props.statusFuncs}
                            main_id={this.props.main_id}
                             project_name={project_name}
                             is_notebook={this.props.is_notebook}
                             is_juptyer={this.props.is_jupyter}
                          table_is_shrunk={this.state.table_is_shrunk}
                          toggleTableShrink={this._toggleTableShrink}
                          openErrorDrawer={this.props.openErrorDrawer}
                          show_exports_pane={this.state.show_exports_pane}
                          show_console_pane={this.state.show_console_pane}
                          setMainStateValue={this._setMainStateValue}
                />
                <NavbarDivider/>
                {this.create_tile_menus()}
            </React.Fragment>
        );
        let table_available_height = hp_height;
        let card_header = (
            <MainTableCardHeader main_id={this.props.main_id}
                                 toggleShrink={this._toggleTableShrink}
                                 short_collection_name={this.state.short_collection_name}
                                 handleChangeDoc={this._handleChangeDoc}
                                 doc_names={this.state.doc_names}
                                 current_doc_name={this.state.table_spec.current_doc_name}
                                 show_table_spinner={this.state.show_table_spinner}
                                 selected_row={this.state.selected_row}
                                 handleSearchFieldChange={this._handleSearchFieldChange}
                                 search_text={this.state.search_text}
                                 setMainStateValue={this._setMainStateValue}
                                 table_is_filtered={this.state.table_is_filtered}
                                 show_filter_button={!this.props.is_freeform}
                                 spreadsheet_mode={this.state.spreadsheet_mode}
                                 handleSpreadsheetModeChange={this._handleSpreadsheetModeChange}
                                 broadcast_event_to_server={this._broadcast_event_to_server}
            />
        );

        let card_body;
        if (this.props.is_freeform) {
            card_body = <FreeformBody main_id={this.props.main_id}
                                      my_ref={this.tbody_ref}
                                      document_name={this.state.table_spec.current_doc_name}
                                      data_text={this.state.data_text}
                                      code_container_height={this._getTableBodyHeight(table_available_height)}
                                      search_text={this.state.search_text}
                                      setMainStateValue={this._setMainStateValue}
                                      alt_search_text={this.state.alt_search_text}
            />
        } else {
            card_body = (
                <BlueprintTable main_id={this.props.main_id}
                                my_ref={this.tbody_ref}
                                ref={this.table_ref}
                                initiateDataGrab={this._initiateDataGrab}
                                height={this._getTableBodyHeight(table_available_height)}
                                column_names={this.state.table_spec.column_names}
                                setCellContent={this._setCellContent}
                                filtered_column_names={this._filteredColumnNames()}
                                moveColumn={this._moveColumn}
                                column_widths={this.state.table_spec.column_widths}
                                hidden_columns_list={this.state.table_spec.hidden_columns_list}
                                updateTableSpec={this._updateTableSpec}
                                setMainStateValue={this._setMainStateValue}
                                selected_regions={this.state.selected_regions}
                                selected_column={this.state.selected_column}
                                selected_row={this.state.selected_row}
                                search_text={this.state.search_text}
                                alt_search_text={this.state.alt_search_text}
                                cells_to_color_text={this.state.cells_to_color_text}
                                cell_backgrounds={this.state.table_spec.cell_backgrounds}
                                total_rows={this.state.total_rows}
                                broadcast_event_to_server={this._broadcast_event_to_server}
                                spreadsheet_mode={this.state.spreadsheet_mode}
                                data_row_dict={this.state.data_row_dict}/>
            )

        }

        let tile_container_height = this.state.console_is_shrunk ? table_available_height - MARGIN_ADJUSTMENT : table_available_height;
        let tile_pane = (
            <TileContainer  main_id={this.props.main_id}
                            tsocket={this.props.tsocket}
                            dark_theme={this.props.dark_theme}
                            height={tile_container_height}
                           tile_div_ref={this.tile_div_ref}
                           tile_list={_.cloneDeep(this.state.tile_list)}
                           current_doc_name={this.state.table_spec.current_doc_name}
                           table_is_shrunk={this.state.table_is_shrunk}
                           selected_row={this.state.selected_row}
                           broadcast_event={this._broadcast_event_to_server}
                           setMainStateValue={this._setMainStateValue}
            />
        );

        let exports_pane;
        if (this.state.show_exports_pane) {
            exports_pane = <ExportsViewer main_id={this.props.main_id}
                                          tsocket={this.props.tsocket}
                                          setUpdate={(ufunc)=>{this.updateExportsList = ufunc}}
                                          setMainStateValue={this._setMainStateValue}
                                          available_height={console_available_height}
                                          console_is_shrunk={this.state.console_is_shrunk}
                                          console_is_zoomed={this.state.console_is_zoomed}
            />
        }
        else {
            exports_pane = <div></div>
        }
        let console_pane;
        if (this.state.show_console_pane) {
            console_pane = (
                <ConsoleComponent main_id={this.props.main_id}
                                  tsocket={this.props.tsocket}
                                  dark_theme={dark_theme}
                                  handleCreateViewer={this.props.handleCreateViewer}
                                  controlled={this.props.controlled}
                                  am_selected={this.props.am_selected}
                                  console_items={this.state.console_items}
                                  console_is_shrunk={this.state.console_is_shrunk}
                                  console_is_zoomed={this.state.console_is_zoomed}
                                  show_exports_pane={this.state.show_exports_pane}
                                  setMainStateValue={this._setMainStateValue}
                                  console_available_height={console_available_height}
                                  console_available_width={true_usable_width * this.state.console_width_fraction - 16}
                                  />
                );
        }
        else {
            let console_available_width = true_usable_width * this.state.console_width_fraction - 16;
            console_pane = <div style={{width: console_available_width}}></div>
        }


        let bottom_pane = (
            <HorizontalPanes left_pane={console_pane}
                             right_pane={exports_pane}
                             show_handle={!this.state.console_is_shrunk}
                             available_height={console_available_height}
                             available_width={true_usable_width}
                             initial_width_fraction={this.state.console_width_fraction}
                             dragIconSize={15}
                             handleSplitUpdate={this._handleConsoleFractionChange}
                />
        );
        let table_pane =  (
            <React.Fragment>
                <div ref={this.table_container_ref}>
                    <MainTableCard
                        main_id={this.props.main_id}
                        card_body={card_body}
                        card_header={card_header}
                        table_spec={this.state.table_spec}
                        broadcast_event_to_server={this._broadcast_event_to_server}
                        updateTableSpec={this._updateTableSpec}
                    />
                </div>
            </React.Fragment>
        );
        let top_pane;
        if (this.state.table_is_shrunk) {
            top_pane = (
                <React.Fragment>
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
                                     show_handle={true}
                                     scrollAdjustSelectors={[".bp3-table-quadrant-scroll-container", "#tile-div"]}
                                     available_width={true_usable_width}
                                     initial_width_fraction={this.state.horizontal_fraction}
                                     dragIconSize={15}
                                     handleSplitUpdate={this._handleHorizontalFractionChange}
                                     handleResizeStart={this._handleResizeStart}
                                     handleResizeEnd={this._handleResizeEnd}
                    />
                    {this.state.console_is_shrunk &&
                        bottom_pane
                    }
                </React.Fragment>
            );
        }
        let outer_class = "main-outer";
        if (dark_theme) {
            outer_class = outer_class + " bp3-dark";
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
            <ErrorBoundary>
                {!window.in_context &&
                    <TacticNavbar is_authenticated={window.is_authenticated}
                              dark_theme={dark_theme}
                              setTheme={stheme}
                              user_name={window.username}
                              menus={null}
                              page_id={this.props.main_id}
                    />
                }
                <TacticMenubar  dark_theme={dark_theme}
                                      menus={menus}
                                      showRefresh={true}
                                      showClose={true}
                                      refreshTab={this.props.refreshTab}
                                      closeTab={this.props.closeTab}
                                      resource_name={this._cProp("resource_name")}
                                      showErrorDrawerButton={true}
                                      toggleErrorDrawer={this.props.toggleErrorDrawer}
                    />
                <ErrorBoundary>
                    <div className={outer_class} ref={this.main_outer_ref} style={outer_style}>
                        {this.state.console_is_zoomed &&
                            bottom_pane
                        }
                        {!this.state.console_is_zoomed && this.state.console_is_shrunk &&
                            top_pane
                        }
                        {!this.state.console_is_zoomed && !this.state.console_is_shrunk &&
                            <VerticalPanes top_pane={top_pane}
                                           bottom_pane={bottom_pane}
                                           show_handle={true}
                                           available_width={true_usable_width}
                                           available_height={vp_height}
                                           initial_height_fraction={this.state.height_fraction}
                                           dragIconSize={15}
                                           scrollAdjustSelectors={[".bp3-table-quadrant-scroll-container", "#tile-div"]}
                                           handleSplitUpdate={this._handleVerticalSplitUpdate}
                                           handleResizeStart={this._handleResizeStart}
                                           handleResizeEnd={this._handleResizeEnd}
                                           overflow="hidden"
                            />
                        }
                    </div>
                </ErrorBoundary>
            </ErrorBoundary>
        )
    }
}

MainApp.propTypes = {
    controlled: PropTypes.bool,
    am_selected: PropTypes.bool,
    changeResourceName: PropTypes.func,
    changeResourceTitle: PropTypes.func,
    changeResourceProps: PropTypes.func,
    updatePanel: PropTypes.func,
    refreshTab: PropTypes.func,
    closeTab: PropTypes.func,
    interface_state: PropTypes.object,
    initial_doc_names: PropTypes.array,
    initial_column_names: PropTypes.array,
    initial_data_row_dict: PropTypes.object,
    initial_column_widths: PropTypes.array,
    initial_hidden_columns_list: PropTypes.array,
    doc_names: PropTypes.array,
};

MainApp.defaultProps = {
    am_selected: true,
    controlled: false,
    changeResourceName: null,
    changeResourceTitle: null,
    changeResourceProps: null,
    refreshTab: null,
    closeTab: null,
    updatePanel: null
};

if (!window.in_context) {
    main_main();
}
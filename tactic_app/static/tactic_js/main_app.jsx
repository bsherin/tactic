import "../tactic_css/tactic.scss";
import "../tactic_css/tactic_main.scss";
import "../tactic_css/tactic_table.scss";
import "../tactic_css/tactic_console.scss";
import "../tactic_css/tactic_select.scss"

import React from "react";
import {Fragment, useEffect, useRef, useReducer, memo} from "react";
import * as ReactDOM from 'react-dom'
import PropTypes from 'prop-types';

import {NavbarDivider} from "@blueprintjs/core";
import _ from 'lodash';

import {main_props, mainReducer} from "./main_support"
import {TacticNavbar} from "./blueprint_navbar";
import {TacticMenubar} from "./menu_utilities";
import {MainTableCard, MainTableCardHeader, FreeformBody} from "./table_react";
import {BlueprintTable, compute_added_column_width} from "./blueprint_table";
import {HorizontalPanes, VerticalPanes} from "./resizing_layouts";
import {ProjectMenu, DocumentMenu, ColumnMenu, RowMenu, ViewMenu, MenuComponent} from "./main_menus_react";
import {TileContainer, tilesReducer} from "./tile_react";
import {ExportsViewer} from "./export_viewer_react";
import {showModalReact, showSelectDialog} from "./modal_react";
import {ConsoleComponent} from "./console_component";
import {consoleItemsReducer} from "./console_support";
import {handleCallback, postWithCallback, postAjaxPromise, postAjax} from "./communication_react";
import {doFlash} from "./toaster"
import {withStatus} from "./toaster";
import {withErrorDrawer} from "./error_drawer";
import {renderSpinnerMessage, useConnection} from "./utilities_react";
import {getUsableDimensions} from "./sizing_tools";
import {ErrorBoundary} from "./error_boundary";
import {TacticOmnibar} from "./TacticOmnibar";
import {KeyTrap} from "./key_trap";
import {useCallbackStack, useReducerAndRef} from "./utilities_react";

export {MainApp}

const MARGIN_SIZE = 0;
const BOTTOM_MARGIN = 30;  // includes space for status messages at bottom
const MARGIN_ADJUSTMENT = 8; // This is the amount at the top of both the table and the console
const CONSOLE_HEADER_HEIGHT = 35;
const EXTRA_TABLE_AREA_SPACE = 500;
const USUAL_TOOLBAR_HEIGHT = 50;
const MENU_BAR_HEIGHT = 30; // will only appear when in context

const iStateDefaults = {
    table_is_shrunk: false,
    tile_list: [],
    console_items: [],
    console_width_fraction: .5,
    horizontal_fraction: .65,
    console_is_shrunk: true,
    height_fraction: .85,
    show_exports_pane: true,
    show_console_pane: true,
    console_is_zoomed: false
};

function MainApp(props) {

    function iStateOrDefault(pname) {
        if (props.is_project) {
            if ("interface_state" in props && props.interface_state && pname in props.interface_state) {
                return props.interface_state[pname]
            }
        }
        return iStateDefaults[pname]
    }

    const key_bindings = [[["ctrl+space"], _showOmnibar]];

    const last_save = useRef({});
    const resizing = useRef(false);
    const updateExportsList = useRef(null);
    const omniGetters = useRef({});
    const height_adjustment = useRef(0);
    const table_container_ref = useRef(null);
    const tile_div_ref = useRef(null);
    const tbody_ref = useRef(null);
    const main_outer_ref = useRef(null);
    const set_table_scroll = useRef(null);

    const [console_items, dispatch, console_items_ref] = useReducerAndRef(consoleItemsReducer, iStateOrDefault("console_items"));
    const [tile_list, tileDispatch, tile_list_ref] = useReducerAndRef(tilesReducer, iStateOrDefault("tile_list"));

    const [mState, mDispatch] = useReducer(mainReducer, {
        table_is_shrunk: iStateOrDefault("table_is_shrunk"),
        console_width_fraction: iStateOrDefault("console_width_fraction"),
        horizontal_fraction: iStateOrDefault("console_width_fraction"),
        height_fraction: iStateOrDefault("height_fraction"),
        console_is_shrunk: iStateOrDefault("console_is_shrunk"),
        console_is_zoomed: iStateOrDefault("console_is_zoomed"),
        show_exports_pane: iStateOrDefault("show_exports_pane"),
        show_console_pane: iStateOrDefault("show_console_pane"),

        table_spec: props.initial_table_spec,
        data_text: props.is_freeform ? props.initial_data_text : null,
        data_row_dict: props.is_freeform ? null : props.initial_data_row_dict,
        total_rows: props.is_freeform ? null : props.total_rows,
        doc_names: props.initial_doc_names,
        short_collection_name: props.short_collection_name,

        tile_types: props.initial_tile_types,
        tile_icon_dict: props.initial_tile_icon_dict,

        alt_search_text: null,
        selected_column: null,
        selected_row: null,
        selected_regions: [],
        table_is_filtered: false,
        search_text: "",
        soft_wrap: false,

        show_table_spinner: false,
        cells_to_color_text: {},
        spreadsheet_mode: false,

        // These will maybe only be used if not controlled
        dark_theme: props.initial_theme === "dark",
        resource_name: props.resource_name,
        showOmnibar: false,
        is_project: props.is_project,
        usable_height: getUsableDimensions(true).usable_height_no_bottom,
        usable_width: getUsableDimensions(true).usable_width - 170
    });
    const connection_status = useConnection(props.tsocket, initSocket);

    const pushCallback = useCallbackStack();

    useEffect(() => {
        if (props.controlled) {
            props.registerDirtyMethod(_dirty);
            height_adjustment.current = MENU_BAR_HEIGHT;
        } else {
            window.addEventListener("beforeunload", function (e) {
                if (_dirty()) {
                    e.preventDefault();
                    e.returnValue = ''
                }
            });
        }
        if (props.registerOmniFunction) {
            props.registerOmniFunction(_omniFunction);
        }
        _updateLastSave();
        props.stopSpinner();
        if (!props.controlled) {
            document.title = mState.resource_name;
            window.dark_theme = mState.dark_theme;
            window.addEventListener("resize", _update_window_dimensions);
            _update_window_dimensions();
        }

        return (() => {
            delete_my_containers()
        })
    }, []);

    function _cProp(pname) {
        return props.controlled ? props[pname] : mState[pname]
    }

    const save_state = {
        tile_list: tile_list,
        console_items: console_items,
        table_is_shrunk: mState.table_is_shrunk,
        console_width_fraction: mState.console_width_fraction,
        horizontal_fraction: mState.horizontal_fraction,
        console_is_shrunk: mState.console_is_shrunk,
        height_fraction: mState.height_fraction,
        show_exports_pane: mState.show_exports_pane,
        show_console_pane: mState.show_console_pane,
        console_is_zoomed: mState.console_is_zoomed
    };

    // This will only be called if not controlled
    function _update_window_dimensions() {
        let uwidth;
        let uheight;
        if (main_outer_ref && main_outer_ref.current) {
            uheight = window.innerHeight - main_outer_ref.current.offsetTop;
            uwidth = window.innerWidth - main_outer_ref.current.offsetLeft;
        } else {
            uheight = window.innerHeight - USUAL_TOOLBAR_HEIGHT;
            uwidth = window.innerWidth - 2 * MARGIN_SIZE;
        }
        mDispatch({
            type: "change_multiple_fields",
            newPartialState: {
                usable_height: uheight,
                usable_width: uwidth
            }
        });
    }

    function _updateLastSave() {
        last_save.current = save_state
    }

    function _dirty() {
        let current_state = save_state;
        for (let k in current_state) {
            if (current_state[k] != last_save.current[k]) {
                return true
            }
        }
        return false
    }

    function delete_my_containers() {
        postAjax("/remove_mainwindow", {"main_id": props.main_id});
    }

    function _update_menus_listener(data) {
        postWithCallback("host", "get_tile_types", {"user_id": window.user_id}, function (data) {
            mDispatch({
                type: "change_multiple_fields",
                newPartialState: {
                    type_types: data.tile_types,
                    tile_icon_dict: data.icon_dict
                }
            });
        }), null, props.main_id;
    }

    function _change_doc_listener(data) {
        if (data.main_id == props.main_id) {
            let row_id = data.hasOwnProperty("row_id") ? data.row_id : null;
            if (mState.table_is_shrunk) {
                _setMainStateValue("table_is_shrunk", false)
            }
            _handleChangeDoc(data.doc_name, row_id)
        }
    }

    function initSocket() {
        props.tsocket.attachListener("window-open", data => {
            window.open(`${$SCRIPT_ROOT}/load_temp_page/${data["the_id"]}`)
        });
        props.tsocket.attachListener("doFlash", function (data) {
            doFlash(data)
        });
        if (!window.in_context) {
            props.tsocket.attachListener('close-user-windows', function (data) {
                if (!(data["originator"] == main_id)) {
                    window.close()
                }
            });
            props.tsocket.attachListener("notebook-open", function (data) {
                window.open($SCRIPT_ROOT + "/new_notebook_with_data/" + data.temp_data_id)
            });
            props.tsocket.attachListener("doFlashUser", function (data) {
                doFlash(data)
            });
        } else {
            props.tsocket.attachListener("notebook-open", function (data) {
                const the_view = `${$SCRIPT_ROOT}/new_notebook_in_context`;
                postAjaxPromise(the_view, {temp_data_id: data.temp_data_id, resource_name: ""})
                    .then(props.handleCreateViewer)
                    .catch(doFlash);
            })
        }
        props.tsocket.attachListener('table-message', _handleTableMessage);
        props.tsocket.attachListener("update-menus", _update_menus_listener);
        props.tsocket.attachListener('change-doc', _change_doc_listener);
        props.tsocket.attachListener('handle-callback', (task_packet) => {
            handleCallback(task_packet, props.main_id)
        });
    }

    function setTheme(dark_theme) {
        _setMainStateValue("dark_theme", dark_theme);
        pushCallback(() => {
            window.dark_theme = dark_theme
        })
    }

    // Every item in tile_list is a list of this form
    function _createTileEntry(tile_name, tile_type, tile_id, form_data) {
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
            log_since: null,
            max_console_lines: 100,
            shrunk: false,
            finished_loading: true,
            front_content: ""
        }
    }

    function _setMainStateValue(field_name, new_value = null, callback = null) {
        if (typeof (field_name) == "object") {
            mDispatch({
                type: "change_multiple_fields",
                newPartialState: field_name
            })
        } else {
            mDispatch({
                type: "change_field",
                field: field_name,
                new_value: new_value
            });
            pushCallback(callback)
        }
    }

    function _handleSearchFieldChange(lsearch_text) {
        mDispatch({
            type: "change_multiple_fields",
            newPartialState: {
                search_text: lsearch_text,
                alt_search_text: null
            }
        });
        if ((lsearch_text == null) && (!props.is_freeform)) {
            _setMainStateValue("cells_to_color_text", {})
        }
    }

    function _handleSpreadsheetModeChange(event) {
        _setMainStateValue("spreadsheet_mode", event.target.checked)
    }

    function _handleSoftWrapChange(event) {
        _setMainStateValue("soft_wrap", event.target.checked)
    }

    function _setAltSearchText(the_text) {
        _setMainStateValue("alt_search_text", the_text)
    }

    function set_visible_doc(doc_name, func) {
        const data_dict = {"doc_name": doc_name};
        if (func === null) {
            postWithCallback(props.main_id, "set_visible_doc", data_dict, null, null, props.main_id)
        } else {
            postWithCallback(props.main_id, "set_visible_doc", data_dict, func, null, props.main_id)
        }
    }

    function _handleChangeDoc(new_doc_name, row_index = 0) {
        _setMainStateValue("show_table_spinner", true);
        if (props.is_freeform) {
            postWithCallback(props.main_id, "grab_freeform_data", {
                "doc_name": new_doc_name,
                "set_visible_doc": true
            }, function (data) {
                props.stopSpinner();
                props.clearStatusMessage();
                let new_table_spec = {"current_doc_name": new_doc_name};
                mDispatch({
                    type: "change_multiple_fields",
                    newPartialState: {
                        data_text: data.data_text,
                        table_spec: new_table_spec,
                        visible_doc: new_doc_name
                    },

                });
                pushCallback(() => {
                    _setMainStateValue("show_table_spinner", false)
                });
            }, null, props.main_id)
        } else {
            const data_dict = {"doc_name": new_doc_name, "row_index": row_index, "set_visible_doc": true};
            postWithCallback(props.main_id, "grab_chunk_by_row_index", data_dict, function (data) {
                _setStateFromDataObject(data, new_doc_name, () => {
                    _setMainStateValue("show_table_spinner", false);
                    set_table_scroll.current = row_index;
                });
            }, null, props.main_id);
        }
    }

    function _handleVerticalSplitUpdate(top_height, bottom_height, top_fraction) {
        _setMainStateValue("height_fraction", top_fraction)
    }

    function _updateTableSpec(spec_update, broadcast = false) {
        mDispatch({
            type: "update_table_spec",
            spec_update: spec_update
        });
        if (broadcast) {
            spec_update["doc_name"] = mState.table_spec.current_doc_name;
            postWithCallback(props.main_id, "UpdateTableSpec", spec_update, null, null, props.main_id);
        }
    }

    function _broadcast_event_to_server(event_name, data_dict, callback) {
        data_dict.main_id = props.main_id;
        data_dict.event_name = event_name;
        data_dict.doc_name = mState.table_spec.current_doc_name;
        postWithCallback(props.main_id, "distribute_events_stub", data_dict, callback, null, props.main_id)
    }

    function _tile_command(menu_id) {
        var existing_tile_names = [];
        for (let tile_entry of tile_list) {
            existing_tile_names.push(tile_entry.tile_name)
        }
        showModalReact("Create " + menu_id, "New Tile Name", createNewTile, menu_id, existing_tile_names);

        function createNewTile(tile_name) {
            props.startSpinner();
            props.statusMessage("Creating Tile " + tile_name);
            const data_dict = {
                tile_name: tile_name,
                tile_type: menu_id,
                user_id: window.user_id,
                parent: props.main_id
            };
            postWithCallback(props.main_id, "create_tile", data_dict, function (create_data) {
                if (create_data.success) {
                    let new_tile_entry = _createTileEntry(tile_name,
                        menu_id,
                        create_data.tile_id,
                        create_data.form_data);
                    tileDispatch({
                        type: "add_at_index",
                        insert_index: tile_list.length,
                        new_item: new_tile_entry
                    });
                    if (updateExportsList.current) updateExportsList.current();
                    props.clearStatusMessage();
                    props.stopSpinner()
                } else {
                    props.addErrorDrawerEntry({title: "Error creating tile", content: create_data})
                }
            }, null, props.main_id)
        }
    }

    function _showOmnibar() {
        _setMainStateValue("showOmnibar", true)
    }

    function _closeOmnibar() {
        _setMainStateValue("showOmnibar", false)
    }

    function _omniFunction() {
        let omni_items = [];
        for (let ogetter in omniGetters.current) {
            omni_items = omni_items.concat(omniGetters.current[ogetter]())
        }
        omni_items = omni_items.concat(_getTileOmniItems());
        return omni_items
    }

    function _registerOmniGetter(name, the_function) {
        omniGetters.current[name] = the_function;
    }

    function _getTileOmniItems() {
        let omni_items = [];
        let sorted_categories = [...Object.keys(mState.tile_types)];
        sorted_categories.sort();
        for (let category of sorted_categories) {
            let sorted_types = [...mState.tile_types[category]];
            sorted_types.sort();
            for (let ttype of sorted_types) {
                omni_items.push({
                    category: category,
                    display_text: ttype,
                    search_text: ttype,
                    icon_name: mState.tile_icon_dict[ttype],
                    the_function: () => _tile_command(ttype)
                })
            }
        }
        return omni_items
    }

    function create_tile_menus() {
        let menu_items = [];
        let sorted_categories = [...Object.keys(mState.tile_types)];
        sorted_categories.sort();
        for (let category of sorted_categories) {
            let option_dict = {};
            let icon_dict = {};
            let sorted_types = [...mState.tile_types[category]];
            sorted_types.sort();
            for (let ttype of sorted_types) {
                option_dict[ttype] = () => _tile_command(ttype);
                icon_dict[ttype] = mState.tile_icon_dict[ttype]
            }
            menu_items.push(<MenuComponent menu_name={category}
                                           option_dict={option_dict}
                                           binding_dict={{}}
                                           icon_dict={icon_dict}
                                           disabled_items={[]}
                                           key={category}
            />)
        }
        return menu_items
    }

    function _toggleTableShrink() {
        _setMainStateValue("table_is_shrunk", !mState.table_is_shrunk)
    }

    function _handleHorizontalFractionChange(left_width, right_width, new_fraction) {
        _setMainStateValue("horizontal_fraction", new_fraction)
    }

    function _handleResizeStart() {
        resizing.current = true;
    }

    function _handleResizeEnd() {
        resizing.current = false;
    }

    function _handleConsoleFractionChange(left_width, right_width, new_fraction) {
        _setMainStateValue("console_width_fraction", new_fraction)
    }

    // Table doctype-only methods start here

    function _getTableBodyHeight(table_available_height) {
        if (!tbody_ref.current) {
            return table_available_height - 50;
        } else {
            let top_offset = tbody_ref.current.getBoundingClientRect().top - table_container_ref.current.getBoundingClientRect().top;
            let madjust = mState.console_is_shrunk ? 2 * MARGIN_ADJUSTMENT : MARGIN_ADJUSTMENT;
            return table_available_height - top_offset - madjust
        }
    }

    function _setFreeformDoc(doc_name, new_content) {
        if (doc_name == mState.table_spec.current_doc_name) {
            _setMainStateValue("data_text", new_content)
        }
    }

    function _handleTableMessage(data) {
        if (data.main_id == props.main_id) {
            let handlerDict = {
                refill_table: _refill_table,
                dehighlightAllText: (data) => _handleSearchFieldChange(null),
                highlightTxtInDocument: (data) => _setAltSearchText(data.text_to_find),
                updateNumberRows: (data) => _updateNumberRows(data.doc_name, data.number_rows),
                setCellContent: (data) => _setCellContent(data.row, data.column_header, data.new_content),
                colorTxtInCell: (data) => _colorTextInCell(data.row_id, data.column_header, data.token_text, data.color_dict),
                setFreeformContent: (data) => _setFreeformDoc(data.doc_name, data.new_content),
                updateDocList: (data) => _updateDocList(data.doc_names, data.visible_doc),
                setCellBackground: (data) => _setCellBackgroundColor(data.row, data.column_header, data.color)
            };
            handlerDict[data.table_message](data)
        }
    }

    function _setCellContent(row_id, column_header, new_content, broadcast = false) {
        mDispatch({
            type: "set_cell_content",
            row_id: row_id,
            column_header: column_header,
            new_content: new_content
        });
        let data = {id: row_id, column_header: column_header, new_content: new_content, cellchange: false};
        if (broadcast) {
            _broadcast_event_to_server("SetCellContent", data, null)
        }
    }

    function _setCellBackgroundColor(row_id, column_header, color) {
        mDispatch({
            type: "set_cell_background",
            row_id: row_id,
            column_header: column_header
        })
    }

    function _colorTextInCell(row_id, column_header, token_text, color_dict) {
        mDispatch({
            type: "set_cells_to_color_text",
            row_id: row_id,
            column_header: column_header,
            token_text: token_text,
            color_dict: color_dict
        })
    }

    function _refill_table(data_object) {
        _setStateFromDataObject(data_object, data_object.doc_name);
    }

    function _moveColumn(tag_to_move, place_to_move) {
        let colnames = [...mState.table_spec.column_names];
        let start_index = colnames.indexOf(tag_to_move);
        colnames.splice(start_index, 1);

        if (!place_to_move) {
            colnames.push(tag_to_move)
        } else {
            let end_index = colnames.indexOf(place_to_move);
            colnames.splice(end_index, 0, tag_to_move);
        }

        let fnames = _filteredColumnNames();
        start_index = fnames.indexOf(tag_to_move);
        fnames.splice(start_index, 1);

        let cwidths = [...mState.table_spec.column_widths];
        let width_to_move = cwidths[start_index];
        cwidths.splice(start_index, 1);

        if (!place_to_move) {
            cwidths.push(width_to_move)
        } else {
            let end_index = fnames.indexOf(place_to_move);
            cwidths.splice(end_index, 0, width_to_move);
        }
        _updateTableSpec({column_names: colnames, column_widths: cwidths}, true)
    }

    function _hideColumn() {
        let hc_list = [...mState.table_spec.hidden_columns_list];
        let fnames = _filteredColumnNames();
        let cname = mState.selected_column;
        let col_index = fnames.indexOf(cname);
        let cwidths = [...mState.table_spec.column_widths];
        cwidths.splice(col_index, 1);
        hc_list.push(cname);
        _updateTableSpec({hidden_columns_list: hc_list, column_widths: cwidths}, true)
    }

    function _hideColumnInAll() {
        let hc_list = [...mState.table_spec.hidden_columns_list];
        let fnames = _filteredColumnNames();
        let cname = mState.selected_column;
        let col_index = fnames.indexOf(cname);
        let cwidths = [...mState.table_spec.column_widths];
        cwidths.splice(col_index, 1);
        hc_list.push(cname);
        _updateTableSpec({hidden_columns_list: hc_list, column_widths: cwidths}, false);
        const data_dict = {"column_name": mState.selected_column};
        _broadcast_event_to_server("HideColumnInAllDocs", data_dict)
    }

    function _unhideAllColumns() {
        _updateTableSpec({hidden_columns_list: ["__filename__"]}, true)
    }

    function _clearTableScroll() {
        set_table_scroll.current = null
    }

    function _deleteRow() {
        postWithCallback(props.main_id, "delete_row", {
            "document_name": mState.table_spec.current_doc_name,
            "index": mState.selected_row
        }, null)
    }

    function _insertRow(index) {
        postWithCallback(props.main_id, "insert_row", {
            "document_name": mState.table_spec.current_doc_name,
            "index": index,
            "row_dict": {}
        }, null, null, props.main_id)
    }

    function _duplicateRow() {
        postWithCallback(props.main_id, "insert_row", {
            "document_name": mState.table_spec.current_doc_name,
            "index": mState.selected_row,
            "row_dict": mState.data_text[mState.selected_row]
        }, null, null, props.main_id)
    }

    function _deleteColumn(delete_in_all = false) {
        let fnames = _filteredColumnNames();
        let cname = mState.selected_column;
        let col_index = fnames.indexOf(cname);
        let cwidths = [...mState.table_spec.column_widths];
        cwidths.splice(col_index, 1);
        let hc_list = _.without(mState.table_spec.hidden_columns_list, cname);
        let cnames = _.without(mState.table_spec.column_names, cname);
        _updateTableSpec({
            column_names: cnames,
            hidden_columns_list: hc_list,
            column_widths: cwidths
        }, false);
        const data_dict = {
            "column_name": cname,
            "doc_name": mState.table_spec.current_doc_name,
            "all_docs": delete_in_all
        };
        postWithCallback(props.main_id, "DeleteColumn", data_dict, null, null, props.main_id);
    }

    function _addColumn(add_in_all = false) {
        let title = add_in_all ? "Create Column All Documents" : "Create Column This Document";
        showModalReact(title, "New Column Name", function (new_name) {
            let cwidth = compute_added_column_width(new_name);
            _updateTableSpec({
                column_names: [...mState.table_spec.column_names, new_name],
                column_widths: [...mState.table_spec.column_widths, cwidth]
            }, false);
            const data_dict = {
                "column_name": new_name,
                "doc_name": mState.table_spec.current_doc_name,
                "column_width": cwidth,
                "all_docs": add_in_all
            };
            _broadcast_event_to_server("CreateColumn", data_dict);
        }, "newcol", mState.table_spec.column_names)
    }

    function _setStateFromDataObject(data, doc_name, func = null) {
        mDispatch({
            type: "change_multiple_fields",
            newPartialState: {
                data_row_dict: data.data_row_dict,
                total_rows: data.total_rows,
                table_spec: {
                    column_names: data.table_spec.header_list,
                    column_widths: data.table_spec.column_widths,
                    hidden_columns_list: data.table_spec.hidden_columns_list,
                    cell_backgrounds: data.table_spec.cell_backgrounds,
                    current_doc_name: doc_name
                }
            }
        });
        pushCallback(func)
    }

    function _initiateDataGrab(row_index) {
        _grabNewChunkWithRow(row_index)
    }

    function _grabNewChunkWithRow(row_index) {
        postWithCallback(props.main_id, "grab_chunk_by_row_index",
            {doc_name: mState.table_spec.current_doc_name, row_index: row_index}, function (data) {
                mDispatch({
                    type: "update_data_row_dict",
                    new_data_row_dict: data.data_row_dict
                });
            }, null, props.main_id)
    }

    function _changeCollection() {
        props.startSpinner();
        postWithCallback("host", "get_collection_names", {"user_id": user_id}, function (data) {
            let option_names = data["collection_names"];
            showSelectDialog("Select New Collection", "New Collection", "Cancel",
                "Submit", changeTheCollection, option_names)
        }, null, props.main_id);

        function changeTheCollection(new_collection_name) {
            const result_dict = {
                "new_collection_name": new_collection_name,
                "main_id": props.main_id
            };

            postWithCallback(props.main_id, "change_collection", result_dict, changeCollectionResult, null, props.main_id);

            function changeCollectionResult(data_object) {
                if (data_object.success) {
                    if (!window.in_context && !_cProp("is_project")) document.title = new_collection_name;
                    window._collection_name = data_object.collection_name;
                    mDispatch({
                        type: "change_multiple_fields",
                        newPartialState: {
                            doc_names: data_object.doc_names,
                            short_collection_name: data_object.short_collection_name
                        }
                    });
                    pushCallback(() => {
                        _handleChangeDoc(data_object.doc_names[0])
                    });
                    props.stopSpinner();
                } else {
                    props.clearStatusMessage();
                    props.stopSpinner();
                    props.addErrorDrawerEntry({title: "Error changing collection", content: data_object.message})
                }
            }
        }
    }

    function _updateDocList(doc_names, visible_doc) {
        _setMainStateValue("doc_names", doc_names);
        pushCallback(() => {
            _handleChangeDoc(visible_doc)
        })
    }

    function get_hp_height() {
        if (tile_div_ref.current) {
            if (mState.console_is_shrunk) {
                return _cProp("usable_height") - CONSOLE_HEADER_HEIGHT - BOTTOM_MARGIN - height_adjustment.current;
            } else {
                return (_cProp("usable_height") - BOTTOM_MARGIN - height_adjustment.current) * mState.height_fraction;
            }
        } else {
            return _cProp("usable_height") - 100
        }
    }

    function get_vp_height() {
        if (tile_div_ref.current) {
            return _cProp("usable_height") - height_adjustment.current - BOTTOM_MARGIN;
        } else {
            return _cProp("usable_height") - height_adjustment.current - 50
        }
    }

    function get_zoomed_console_height() {
        if (main_outer_ref.current) {
            return _cProp("usable_height") - height_adjustment.current - BOTTOM_MARGIN;
        } else {
            return _cProp("usable_height") - height_adjustment.current - 50
        }
    }

    function _filteredColumnNames() {
        return mState.table_spec.column_names.filter((name) => {
            return !(mState.table_spec.hidden_columns_list.includes(name) || (name == "__id__"));
        })
    }

    function _setProjectName(new_project_name, callback = null) {
        if (props.controlled) {
            props.updatePanel({
                res_type: "project",
                title: new_project_name,
                panel: {resource_name: new_project_name, is_project: true}
            });
            pushCallback(() => {
                pushCallback(callback)
            })
        } else {
            mDispatch({
                type: "change_multiple_fields",
                newPartialState: {
                    resource_name: new_project_name,
                    is_project: true
                }
            });
            pushCallback(callback)
        }
    }

    let actual_dark_theme = props.controlled ? props.dark_theme : mState.dark_theme;
    let vp_height;
    let hp_height;
    let console_available_height;
    let my_props = {...props};
    if (!props.controlled) {
        my_props.is_project = mState.is_project;
        my_props.resource_name = mState.resource_name;
        my_props.usable_width = mState.usable_width;
        my_props.usable_height = mState.usable_height
    }
    let true_usable_width = my_props.usable_width;
    if (mState.console_is_zoomed) {
        console_available_height = get_zoomed_console_height() - MARGIN_ADJUSTMENT;
    } else {
        vp_height = get_vp_height();
        hp_height = get_hp_height();
        if (mState.console_is_shrunk) {
            console_available_height = CONSOLE_HEADER_HEIGHT;
        } else {
            console_available_height = vp_height - hp_height - MARGIN_ADJUSTMENT - 3;
        }
    }
    let disabled_column_items = [];
    if (mState.selected_column == null) {
        disabled_column_items = [
            "Shift Left", "Shift Right", "Hide", "Hide in All Docs", "Delete Column", "Delete Column In All Docs"
        ]
    }
    let disabled_row_items = [];
    if (mState.selected_row == null) {
        disabled_row_items = ["Delete Row", "Insert Row Before", "Insert Row After", "Duplicate Row"]
    }
    let project_name = my_props.is_project ? props.resource_name : "";
    let menus = (
        <Fragment>
            <ProjectMenu {...props.statusFuncs}
                         main_id={props.main_id}
                         project_name={project_name}
                         is_notebook={props.is_notebook}
                         is_juptyer={props.is_jupyter}
                         setProjectName={_setProjectName}
                         postAjaxFailure={props.postAjaxFailure}
                         console_items={console_items_ref.current}
                         tile_list={tile_list_ref.current}
                         mState={mState}
                         setMainStateValue={_setMainStateValue}
                         updateLastSave={_updateLastSave}
                         changeCollection={_changeCollection}
                         disabled_items={my_props.is_project ? [] : ["Save"]}
                         registerOmniGetter={_registerOmniGetter}
                         hidden_items={["Export as Jupyter Notebook"]}
            />
            <DocumentMenu {...props.statusFuncs}
                          main_id={props.main_id}
                          documentNames={mState.doc_names}
                          registerOmniGetter={_registerOmniGetter}
                          currentDoc={mState.table_spec.current_doc_name}

            />
            {!props.is_freeform &&
                <ColumnMenu {...props.statusFuncs}
                            main_id={props.main_id}
                            project_name={project_name}
                            is_notebook={props.is_notebook}
                            is_juptyer={props.is_jupyter}
                            moveColumn={_moveColumn}
                            table_spec={mState.table_spec}
                            filtered_column_names={_filteredColumnNames()}
                            selected_column={mState.selected_column}
                            disabled_items={disabled_column_items}
                            hideColumn={_hideColumn}
                            hideInAll={_hideColumnInAll}
                            unhideAllColumns={_unhideAllColumns}
                            addColumn={_addColumn}
                            registerOmniGetter={_registerOmniGetter}
                            deleteColumn={_deleteColumn}
                />
            }
            {!props.is_freeform &&
                <RowMenu {...props.statusFuncs}
                         main_id={props.main_id}
                         project_name={project_name}
                         is_notebook={props.is_notebook}
                         is_juptyer={props.is_jupyter}
                         deleteRow={_deleteRow}
                         insertRowBefore={() => {
                             _insertRow(mState.selected_row)
                         }}
                         insertRowAfter={() => {
                             _insertRow(mState.selected_row + 1)
                         }}
                         duplicateRow={_duplicateRow}
                         selected_row={mState.selected_row}
                         registerOmniGetter={_registerOmniGetter}
                         disabled_items={disabled_row_items}
                />
            }
            <ViewMenu {...props.statusFuncs}
                      main_id={props.main_id}
                      project_name={project_name}
                      is_notebook={props.is_notebook}
                      is_juptyer={props.is_jupyter}
                      table_is_shrunk={mState.table_is_shrunk}
                      toggleTableShrink={_toggleTableShrink}
                      openErrorDrawer={props.openErrorDrawer}
                      show_exports_pane={mState.show_exports_pane}
                      show_console_pane={mState.show_console_pane}
                      registerOmniGetter={_registerOmniGetter}
                      setMainStateValue={_setMainStateValue}
            />
            <NavbarDivider/>
            {create_tile_menus()}
        </Fragment>
    );
    let table_available_height = hp_height;
    let card_header = (
        <MainTableCardHeader main_id={props.main_id}
                             toggleShrink={_toggleTableShrink}
                             mState={mState}
                             setMainStateValue={_setMainStateValue}
                             handleChangeDoc={_handleChangeDoc}
                             handleSearchFieldChange={_handleSearchFieldChange}
                             show_filter_button={!props.is_freeform}
                             handleSpreadsheetModeChange={_handleSpreadsheetModeChange}
                             handleSoftWrapChange={_handleSoftWrapChange}
                             broadcast_event_to_server={_broadcast_event_to_server}
                             is_freeform={props.is_freeform}
        />
    );

    let card_body;
    if (props.is_freeform) {
        card_body = <FreeformBody main_id={props.main_id}
                                  ref={tbody_ref}
                                  dark_theme={actual_dark_theme}
                                  code_container_width={mState.horizontal_fraction * true_usable_width}
                                  code_container_height={_getTableBodyHeight(table_available_height)}
                                  mState={mState}
                                  setMainStateValue={_setMainStateValue}

        />
    } else {
        card_body = (
            <BlueprintTable main_id={props.main_id}
                            ref={tbody_ref}
                            clearScroll={_clearTableScroll}
                            initiateDataGrab={_initiateDataGrab}
                            height={_getTableBodyHeight(table_available_height)}
                            setCellContent={_setCellContent}
                            filtered_column_names={_filteredColumnNames()}
                            moveColumn={_moveColumn}
                            updateTableSpec={_updateTableSpec}
                            setMainStateValue={_setMainStateValue}
                            mState={mState}
                            set_scroll={set_table_scroll.current}
                            broadcast_event_to_server={_broadcast_event_to_server}
            />
        )
    }

    let tile_container_height = mState.console_is_shrunk ? table_available_height - MARGIN_ADJUSTMENT : table_available_height;
    let tile_pane = (
        <div ref={tile_div_ref}>
            <TileContainer main_id={props.main_id}
                           tsocket={props.tsocket}
                           dark_theme={actual_dark_theme}
                           height={tile_container_height}
                           tile_list={tile_list_ref}
                           current_doc_name={mState.table_spec.current_doc_name}
                           selected_row={mState.selected_row}
                           table_is_shrunk={mState.table_is_shrunk}
                           broadcast_event={_broadcast_event_to_server}
                           goToModule={props.goToModule}
                           tileDispatch={tileDispatch}
                           setMainStateValue={_setMainStateValue}
            />
        </div>
    );

    let exports_pane;
    if (mState.show_exports_pane) {
        exports_pane = <ExportsViewer main_id={props.main_id}
                                      tsocket={props.tsocket}
                                      setUpdate={(ufunc) => {
                                          updateExportsList.current = ufunc
                                      }}
                                      setMainStateValue={_setMainStateValue}
                                      available_height={console_available_height}
                                      console_is_shrunk={mState.console_is_shrunk}
                                      console_is_zoomed={mState.console_is_zoomed}
        />
    } else {
        exports_pane = <div></div>
    }
    let console_pane;
    if (mState.show_console_pane) {
        console_pane = (
            <ConsoleComponent {...props.statusFuncs}
                              main_id={props.main_id}
                              tsocket={props.tsocket}
                              dark_theme={actual_dark_theme}
                              handleCreateViewer={props.handleCreateViewer}
                              controlled={props.controlled}
                              am_selected={props.am_selected}
                              console_items={console_items_ref}
                              dispatch={dispatch}
                              mState={mState}
                              setMainStateValue={_setMainStateValue}
                              console_available_height={console_available_height}
                              console_available_width={true_usable_width * mState.console_width_fraction - 16}
                              zoomable={true}
                              shrinkable={true}
            />
        );
    } else {
        let console_available_width = true_usable_width * mState.console_width_fraction - 16;
        console_pane = <div style={{width: console_available_width}}></div>
    }


    let bottom_pane = (
        <HorizontalPanes left_pane={console_pane}
                         right_pane={exports_pane}
                         show_handle={!mState.console_is_shrunk}
                         available_height={console_available_height}
                         available_width={true_usable_width}
                         initial_width_fraction={mState.console_width_fraction}
                         dragIconSize={15}
                         handleSplitUpdate={_handleConsoleFractionChange}
        />
    );
    let table_pane = (
        <Fragment>
            <div ref={table_container_ref}>
                <MainTableCard
                    main_id={props.main_id}
                    card_body={card_body}
                    card_header={card_header}
                    table_spec={mState.table_spec}
                    broadcast_event_to_server={_broadcast_event_to_server}
                    updateTableSpec={_updateTableSpec}
                />
            </div>
        </Fragment>
    );
    let top_pane;
    if (mState.table_is_shrunk) {
        top_pane = (
            <Fragment>
                <div style={{paddingLeft: 10}}>
                    {tile_pane}
                </div>
                {mState.console_is_shrunk && bottom_pane}
            </Fragment>
        )
    } else {
        top_pane = (
            <Fragment>
                <HorizontalPanes left_pane={table_pane}
                                 right_pane={tile_pane}
                                 available_height={hp_height}
                                 show_handle={true}
                                 scrollAdjustSelectors={[".bp5-table-quadrant-scroll-container", "#tile-div"]}
                                 available_width={true_usable_width}
                                 initial_width_fraction={mState.horizontal_fraction}
                                 dragIconSize={15}
                                 handleSplitUpdate={_handleHorizontalFractionChange}
                                 handleResizeStart={_handleResizeStart}
                                 handleResizeEnd={_handleResizeEnd}
                />
                {mState.console_is_shrunk && bottom_pane}
            </Fragment>
        );
    }

    return (
        <ErrorBoundary>
            {!window.in_context &&
                <TacticNavbar is_authenticated={window.is_authenticated}
                              dark_theme={actual_dark_theme}
                              setTheme={props.setTheme}
                              user_name={window.username}
                              menus={null}
                              page_id={props.main_id}
                />
            }
            <TacticMenubar dark_theme={actual_dark_theme}
                           connection_status={connection_status}
                           menus={menus}
                           showRefresh={true}
                           showClose={true}
                           refreshTab={props.refreshTab}
                           closeTab={props.closeTab}
                           resource_name={_cProp("resource_name")}
                           showErrorDrawerButton={true}
                           toggleErrorDrawer={props.toggleErrorDrawer}
                           extraButtons={[
                               {
                                   onClick: _toggleTableShrink,
                                   icon: mState.table_is_shrunk ? "th" : "th-disconnect"
                               }
                           ]}
            />
            <ErrorBoundary>
                <div className={`main-outer ${actual_dark_theme ? "bp5-dark" : "light-theme"}`}
                     ref={main_outer_ref}
                     style={{width: "100%", height: my_props.usable_height - height_adjustment.current}}>
                    {mState.console_is_zoomed &&
                        bottom_pane
                    }
                    {!mState.console_is_zoomed && mState.console_is_shrunk &&
                        top_pane
                    }
                    {!mState.console_is_zoomed && !mState.console_is_shrunk &&
                        <VerticalPanes top_pane={top_pane}
                                       bottom_pane={bottom_pane}
                                       show_handle={true}
                                       available_width={true_usable_width}
                                       available_height={vp_height}
                                       initial_height_fraction={mState.height_fraction}
                                       dragIconSize={15}
                                       scrollAdjustSelectors={[".bp5-table-quadrant-scroll-container", "#tile-div"]}
                                       handleSplitUpdate={_handleVerticalSplitUpdate}
                                       handleResizeStart={_handleResizeStart}
                                       handleResizeEnd={_handleResizeEnd}
                                       overflow="hidden"
                        />
                    }
                </div>
                {!window.in_context &&
                    <Fragment>
                        <TacticOmnibar omniGetters={[_omniFunction]}
                                       page_id={props.main_id}
                                       showOmnibar={mState.showOmnibar}
                                       closeOmnibar={_closeOmnibar}
                        />
                        <KeyTrap global={true} bindings={key_bindings}/>
                    </Fragment>
                }
            </ErrorBoundary>
        </ErrorBoundary>
    )
}

MainApp = memo(MainApp);

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
    initial_data_row_dict: PropTypes.object,
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
        .then((data) => {
            main_props(data, null, gotProps, null)
        })
}

if (!window.in_context) {
    main_main();
}
import {TacticSocket, useConnection} from "./tactic_socket";

if (!window.in_context) {
    import("../tactic_css/tactic.scss");
    import("../tactic_css/tactic_console.scss");
    import("../tactic_css/tactic_main.scss");
    import("../tactic_css/tactic_table.scss");
    import ("../tactic_css/themeable.scss");
}

import React from "react";
import {Fragment, useEffect, useRef, memo, useContext, useCallback} from "react";
import {createRoot} from 'react-dom/client';
import {NavbarDivider} from "@blueprintjs/core";
import {Regions} from "@blueprintjs/table"
import _ from 'lodash';

import {main_props, mainReducer} from "./main_support"
import {TacticNavbar} from "./blueprint_navbar";
import {TacticMenubar} from "./menu_utilities";
import {MainTableCard, MainTableCardHeader, FreeformBody} from "./table_react";
import {BlueprintTable, compute_added_column_width} from "./blueprint_table";
import {HorizontalPanes, VerticalPanes} from "./resizing_allotment";
import {ProjectMenu, DocumentMenu, ColumnMenu, RowMenu, ViewMenu, MenuComponent} from "./main_menus_react";
import {TileContainer} from "./tile_container";
import {tilesReducer} from "./tile_container_support"
import {ExportsViewer} from "./export_viewer_react";
import {ConsoleComponent} from "./console_component";
import {consoleItemsReducer} from "./console_support";
import {handleCallback, postPromise, postPromiseMain, postWithCallbackMain, postWithCallback} from "./communication_react";
import {doFlash} from "./toaster"
import {withStatus} from "./toaster";
import {withErrorDrawer} from "./error_drawer";
import {get_ppi, guid, renderSpinnerMessage, useConstructor, useStateAndRef} from "./utilities_react";
import {ICON_BAR_WIDTH} from "./sizing_tools";
import {ErrorBoundary} from "./error_boundary";
import {useCallbackStack, useReducerAndRef, withRegisterActivity} from "./utilities_react";
import {SettingsContext, withSettings} from "./settings";
import {withPool} from "./pool_tree"
import {withAssistant} from "./assistant";
import {DialogContext, withDialogs} from "./modal_react";
import {StatusContext} from "./toaster";
import {ErrorDrawerContext} from "./error_drawer";
import {MetadataDrawer, MetadataContext} from "./metadata_drawer";

export {MainApp}

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
    props = {
        controlled: false,
        changeResourceName: null,
        refreshTab: null,
        closeTab: null,
        updatePanel: null,
        ...props
    };

    function iStateOrDefault(pname) {
        if (props.is_project) {
            if ("interface_state" in props && props.interface_state && pname in props.interface_state) {
                return props.interface_state[pname]
            }
        }
        return iStateDefaults[pname]
    }

    const errorDrawerFuncs = useContext(ErrorDrawerContext);

    const last_save = useRef({});
    const updateExportsList = useRef(null);
    const main_outer_ref = useRef(null);
    const set_table_scroll = useRef(null);

    const [, set_console_selected_items, console_selected_items_ref] = useStateAndRef([]);
    const [console_items, dispatch, console_items_ref] = useReducerAndRef(consoleItemsReducer, []);
    const [tile_list, tileDispatch, tile_list_ref] = useReducerAndRef(tilesReducer);


    const settingsContext = useContext(SettingsContext);
    const dialogFuncs = useContext(DialogContext);
    const statusFuncs = useContext(StatusContext);

    const [mState, mDispatch, mStateRef] = useReducerAndRef(mainReducer, {
        update_index: 0,
        table_is_shrunk: props.doc_type == "none" || iStateOrDefault("table_is_shrunk"),
        console_width_fraction: iStateOrDefault("console_width_fraction"),
        horizontal_fraction: iStateOrDefault("horizontal_fraction"),
        height_fraction: iStateOrDefault("height_fraction"),
        console_is_shrunk: iStateOrDefault("console_is_shrunk"),
        console_is_zoomed: iStateOrDefault("console_is_zoomed"),
        show_exports_pane: iStateOrDefault("show_exports_pane"),
        show_console_pane: iStateOrDefault("show_console_pane"),
        show_metadata: false,
        pseudoTileStatus: "not initialized",

        table_spec: props.initial_table_spec,
        doc_type: props.doc_type,
        data_text: props.doc_type == "freeform" ? props.initial_data_text : "",
        data_row_dict: props.doc_type == "freeform" ? {} : props.initial_data_row_dict,
        total_rows: props.doc_type == "freeform" ? 0 : props.total_rows,
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
        resource_name: props.resource_name,
        is_project: props.is_project,
    });

    const connection_status = useConnection(props.tsocket, initSocket);

    const pushCallback = useCallbackStack();

    useConstructor(() => {
        dispatch({
            type: "initialize",
            new_items: props.is_project && props.interface_state ? props.interface_state["console_items"] : []
        });

        tileDispatch({
                type: "initialize",
                new_items: iStateOrDefault("tile_list")
            }
        )
    });
    useEffect(() => {
        if (props.controlled) {
            props.registerDirtyMethod(_dirty);
        } else {
            window.addEventListener("beforeunload", function (e) {
                if (_dirty()) {
                    e.preventDefault();
                }
                postWithCallback("host", "end_client_session_task", {global_id: window.global_id, force_forward: true})
                props.tsocket.disconnect()
            });
        }
        _updateLastSave();
        statusFuncs.stopSpinner();
        if (!props.controlled) {
            document.title = mState.resource_name;
        }

        function sendRemove() {
            console.log("got the beacon");
            navigator.sendBeacon("/remove_mainwindow", JSON.stringify({local_id: props.local_id}));
        }

        window.addEventListener("unload", sendRemove);
        getPseudoTileStatus();
        postPromiseMain(props.local_id, "load_modules", {})
            .then(() => {
                for (let tile_entry of tile_list_ref.current) {
                    postPromiseMain(props.local_id, "initialize_tile_from_save",
                        {sid: props.local_id, tile_id: tile_entry.tile_id})
                        .then((tile_data) => {
                            let new_tile_id = tile_data.tile_id;
                            tileDispatch({
                                type: "change_item_state",
                                tile_id: tile_entry.tile_id,
                                new_state: {
                                    loading_status: "loaded",
                                    tile_id: new_tile_id,
                                }
                            });
                        })
                        .catch((tile_data) => {
                            let new_tile_id = tile_data.tile_id;
                            tileDispatch({
                                type: "change_item_state",
                                tile_id: tile_entry.tile_id,
                                new_state: {
                                    loading_status: "loaded",
                                    tile_id: new_tile_id,
                                }
                            });
                        })
                }
            });

        return (() => {
            if (props.controlled) {
                postWithCallbackMain(props.local_id, "end_main_session_task", {sid: props.local_id})
            }
            window.removeEventListener("unload", sendRemove);
        })

    }, []);

    useEffect(() => {
        const data = {
            active_row_id: mState.selected_row,
            doc_name: mState.table_spec.current_doc_name
        };
        _broadcast_event_to_server("MainTableRowSelect", data)
    }, [mState.selected_row]);

    function _filteredColumnNames() {
        return mState.table_spec.column_names.filter((name) => {
            return !(mState.table_spec.hidden_columns_list.includes(name) || (name == "__id__"));
        })
    }


    function updatePseudoTileStatus(data) {
        if (mState.pseudoTileStatus == "loaded") {
            return
        }
        setPseudoTileStatus(data.status);
    }

    function setPseudoTileStatus(status) {
        _setMainStateValue("pseudoTileStatus", status);
    }

    function getPseudoTileStatus() {
        postPromise("main_service", "get_pseudo_tile_status", {"sid": props.local_id}, props.local_id)
            .then((data) => {
                updatePseudoTileStatus(data);
            }
        )
    }

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

    async function _update_menus_listener() {
        let data = await postPromise("host", "get_tile_types_task", {"user_id": window.user_id}, props.local_id);
        mDispatch({
            type: "change_multiple_fields",
            newPartialState: {
                tile_types: data.tile_types,
                tile_icon_dict: data.icon_dict
            }
        })
    }

    async function _change_doc_listener(data) {
        if (data.local_id == props.local_id) {
            let row_id = data.hasOwnProperty("row_id") ? data.row_id : null;
            let scroll_to_row = data.hasOwnProperty("scroll_to_row") ? data.scroll_to_row : true;
            let select_row = data.hasOwnProperty("select_row") ? data.select_row : true;
            if (mState.table_is_shrunk) {
                _setMainStateValue("table_is_shrunk", false)
            }
            await _handleChangeDoc(data.doc_name, row_id, scroll_to_row, select_row)
        }
    }

    function initSocket(theSocket) {
        theSocket.attachListener("window-open", data => {
            window.open(`${$SCRIPT_ROOT}/load_temp_page/${data["the_id"]}`)
        });
        theSocket.attachListener("pseudo-tile-status", updatePseudoTileStatus);
        if (!window.in_context) {
            theSocket.attachListener('close-user-windows', function (data) {
                if (!(data["originator"] == window.global_id)) {
                    window.close()
                }
            });
            theSocket.attachListener("notebook-open", function (data) {
                window.open($SCRIPT_ROOT + "/new_notebook_with_data/" + data.temp_data_id)
            });
            theSocket.attachListener("doFlashUser", function (data) {
                doFlash(data)
            });
        } else {
            theSocket.attachListener("notebook-open", async function (data) {
                try {
                    props.handleCreateViewer("new-notebook", null, null, data.temp_data_id)
                } catch (e) {
                    errorDrawerFuncs.addFromError(`Error saving list`, e)
                }
            })
        }
        theSocket.attachListener('table-message', _handleTableMessage);
        theSocket.attachListener("update-menus", _update_menus_listener);
        // theSocket.attachListener("tile-status-message", _handleTileStatusMessage);
        theSocket.attachListener('change-doc', _change_doc_listener);
        if (!props.controlled) {
            theSocket.attachListener("endSession", function () {
                dialogFuncs.showModal("EndSessionDialog", {})
            })
        }
    }

    function isFreeform() {
        return mState.doc_type == "freeform"
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
            shrunk: false,
            loading_status: "waiting",
            front_content: ""
        }
    }

    const _setMainStateValue = useCallback((field_name, new_value = null, callback = null) => {
        if (typeof (field_name) == "object") {
            mDispatch({
                type: "change_multiple_fields",
                newPartialState: field_name
            });
            pushCallback(callback)
        } else {
            mDispatch({
                type: "change_field",
                field: field_name,
                new_value: new_value
            });
            pushCallback(callback)
        }
    });

    function _handleSearchFieldChange(lsearch_text) {
        mDispatch({
            type: "change_multiple_fields",
            newPartialState: {
                search_text: lsearch_text,
                alt_search_text: null
            }
        });
        if ((lsearch_text == null) && (!isFreeform())) {
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

    async function _handleChangeDoc(new_doc_name, row_index = 0, scroll_to_row = true, select_row = true) {
        _setMainStateValue("show_table_spinner", true);
        if (isFreeform()) {
            try {
                let data = await postPromiseMain(props.local_id, "grab_freeform_data", {
                    "doc_name": new_doc_name,
                    "set_visible_doc": true
                }, props.local_id);
                statusFuncs.stopSpinner();
                statusFuncs.clearStatusMessage();
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
            } catch (e) {
                errorDrawerFuncs.addFromError("Error changing doc", e)
            }
        } else {
            try {
                const data_dict = {"doc_name": new_doc_name, "row_index": row_index, "set_visible_doc": true};
                let data = await postPromiseMain(props.local_id, "grab_chunk_by_row_index", data_dict, props.local_id);
                _setStateFromDataObject(data, new_doc_name, () => {
                    _setMainStateValue("show_table_spinner", false);
                    if (select_row) {
                        _setMainStateValue({
                            selected_regions: [Regions.row(row_index)],
                            selected_row: row_index,
                            selected_column: null
                        }, null)
                    }
                    if (scroll_to_row) {
                        set_table_scroll.current = row_index;
                    }
                });
            } catch (e) {
                errorDrawerFuncs.addFromError("Error changing doc", e)
            }

        }
    }

    function _handleVerticalSplitUpdate(top_height, bottom_height, top_fraction) {
        _setMainStateValue("height_fraction", top_fraction)
    }

    function _updateTableSpec(spec_update, broadcast = false, callback = null) {
        mDispatch({
            type: "update_table_spec",
            spec_update: spec_update
        });
        if (broadcast) {
            spec_update["doc_name"] = mState.table_spec.current_doc_name;
            if (callback == null) {
                callback = updateUpdateIndex;
            }
            postWithCallbackMain(props.local_id, "UpdateTableSpec", spec_update, callback, null, props.local_id);
        }
    }

    const _broadcast_event_to_server = useCallback((event_name, data_dict, callback = null) => {
        data_dict.local_id = props.local_id;
        data_dict.event_name = event_name;
        if (!("doc_name" in data_dict)) {
            data_dict.doc_name = mState.table_spec.current_doc_name;
        }
        postWithCallbackMain(props.local_id, "distribute_events_stub", data_dict, callback, null, props.local_id)
    }, [props.local_id, mState.table_spec.current_doc_name]);

    function _broadcast_event_promise(event_name, data_dict) {
        data_dict.local_id = props.local_id;
        data_dict.event_name = event_name;
        if (!("doc_name" in data_dict)) {
            data_dict.doc_name = mState.table_spec.current_doc_name;
        }
        return postPromiseMain(props.local_id, "distribute_events_stub", data_dict, props.local_id)
    }

    async function _tile_command(menu_id) {
        let existing_tile_names = [];
        for (let tile_entry of tile_list) {
            existing_tile_names.push(tile_entry["tile_name"])
        }
        try {
            let tile_name = await dialogFuncs.showModalPromise("ModalDialog", {
                title: "Create " + menu_id,
                field_title: "New Tile Name",
                default_value: menu_id,
                existing_names: existing_tile_names,
                checkboxes: [],
                handleClose: dialogFuncs.hideModal
            });
            const temp_id = "temp_" + guid()
            const data_dict = {
                tile_name: tile_name,
                tile_type: menu_id,
                user_id: window.user_id,
                parent: props.local_id,
                temp_id: temp_id
            };

            let new_tile_entry = _createTileEntry(tile_name,
                menu_id,
                temp_id,
                []);
            tileDispatch({
                type: "add_at_index",
                insert_index: tile_list.length,
                new_item: new_tile_entry
            });
            let create_data = await postPromiseMain(props.local_id, "create_tile", data_dict, props.local_id);
            tileDispatch({
                type: "change_item_state",
                tile_id: temp_id,
                new_state: {
                    loading_status: "loaded",
                    tile_id: create_data.tile_id,
                    form_data: create_data.form_data
                }
            });
            if (updateExportsList.current) updateExportsList.current();

        } catch (e) {
            if (e != "canceled") {
                errorDrawerFuncs.addFromError(`Error creating tile}`, e)
            }
            statusFuncs.clearStatusMessage();
            statusFuncs.stopSpinner()
        }

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

    function _handleConsoleFractionChange(left_width, right_width, new_fraction) {
        _setMainStateValue("console_width_fraction", new_fraction)
    }

    // Table doctype-only methods start here

    function _setFreeformDoc(doc_name, new_content) {
        if (doc_name == mState.table_spec.current_doc_name) {
            _setMainStateValue("data_text", new_content)
        }
    }

    function _handleTableMessage(data) {
        if (data.local_id == props.local_id) {
            // noinspection JSUnusedGlobalSymbols
            let handlerDict = {
                refill_table: _refill_table,
                dehighlightAllText: () => _handleSearchFieldChange(null),
                highlightTxtInDocument: (data) => _setAltSearchText(data.text_to_find),
                setCellContent: (data) => _setCellContent(data.row, data.column_header, data.new_content),
                colorTxtInCell: (data) => _colorTextInCell(data.row_id, data.column_header, data.token_text, data.color_dict),
                setFreeformContent: (data) => _setFreeformDoc(data.doc_name, data.new_content),
                updateDocList: (data) => _updateDocList(data.doc_names, data.visible_doc),
                setCellBackground: (data) => _setCellBackgroundColor(data.doc_name, data.row, data.column_header, data.color)
            };
            handlerDict[data["table_message"]](data)
        }
    }

    function _setCellContent(row_id, column_header, new_content, broadcast = false) {
        mDispatch({
            type: "set_cell_content",
            row_id: row_id,
            column_header: column_header,
            new_content: new_content
        });
        let data = {doc_name: mState.table_spec.current_doc_name, id: row_id, column_header: column_header,
            new_content: new_content, cellchange: false};
        if (broadcast) {
            _broadcast_event_to_server("SetCellContent", data, null)
        }
    }

    function _setCellBackgroundColor (doc_name, row_id, column_header, color) {
        mDispatch({
            type: "set_cell_background",
            doc_name: doc_name,
            row_id: row_id,
            color: color,
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
        _setStateFromDataObject(data_object, data_object.doc_name, updateUpdateIndex);
    }

    function updateUpdateIndex() {
        _setMainStateValue("update_index", mState.update_index + 1);
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

    async function _hideColumnInAll() {
        let hc_list = [...mState.table_spec.hidden_columns_list];
        let fnames = _filteredColumnNames();
        let cname = mState.selected_column;
        let col_index = fnames.indexOf(cname);
        let cwidths = [...mState.table_spec.column_widths];
        cwidths.splice(col_index, 1);
        hc_list.push(cname);
        const data_dict = {"column_name": mState.selected_column};
        await _broadcast_event_promise("HideColumnInAllDocs", data_dict, false);
        _updateTableSpec({hidden_columns_list: hc_list, column_widths: cwidths}, true);
    }

    function _unhideAllColumns() {
        _updateTableSpec({hidden_columns_list: ["__filename__"]}, true)
    }

    const _clearTableScroll = useCallback(() => {
        set_table_scroll.current = null
    }, []);

    async function _deleteRow() {
        await postPromiseMain(props.local_id, "delete_row", {
            "document_name": mState.table_spec.current_doc_name,
            "index": mState.selected_row
        })
            .then(updateUpdateIndex);
    }

    async function _insertRow(index) {
        await postPromiseMain(props.local_id, "insert_row", {
            "document_name": mState.table_spec.current_doc_name,
            "index": index,
            "row_dict": {}
        }, props.local_id)
            .then(updateUpdateIndex)
    }

    async function _duplicateRow() {
        await postPromiseMain(props.local_id, "insert_row", {
            "document_name": mState.table_spec.current_doc_name,
            "index": mState.selected_row,
            "row_dict": mState.data_row_dict[mState.selected_row]
        }, props.local_id)
            .then(updateUpdateIndex)
    }

    async function _deleteColumn(delete_in_all = false) {
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
        await postPromiseMain(props.local_id, "delete_column", data_dict, props.local_id)
            .then(updateUpdateIndex)
    }

    async function _addColumn(add_in_all = false) {
        try {
            let title = add_in_all ? "Create Column All Documents" : "Create Column This Document";
            let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
                title: title,
                field_title: "New Column Name",
                default_value: "newcol",
                existing_names: mState.table_spec.column_names,
                checkboxes: [],
                handleClose: dialogFuncs.hideModal,
            });
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
            _broadcast_event_to_server("CreateColumn", data_dict, updateUpdateIndex);
        } catch (e) {
            if (e != "canceled") {
                errorDrawerFuncs.addFromError(`Error adding column`, e)
            }
        }
    }

    function _setStateFromDataObject(data, doc_name, func = null) {
        mDispatch({
            type: "change_multiple_fields",
            newPartialState: {
                data_row_dict: data.data_row_dict,
                total_rows: data.total_rows,
                table_spec: {
                    column_names: data.table_spec["header_list"],
                    column_widths: data.table_spec.column_widths,
                    hidden_columns_list: data.table_spec.hidden_columns_list,
                    cell_backgrounds: data.table_spec.cell_backgrounds,
                    current_doc_name: doc_name
                }
            }
        });
        pushCallback(func)
    }

    const _initiateDataGrab = useCallback(async (row_index) => {
        await _grabNewChunkWithRow(row_index)
    }, []);

    async function _grabNewChunkWithRow(row_index) {
        try {
            let data = await postPromiseMain(props.local_id, "grab_chunk_by_row_index",
                {doc_name: mStateRef.current.table_spec.current_doc_name, row_index: row_index}, props.local_id);
            mDispatch({
                type: "update_data_row_dict",
                new_data_row_dict: data.data_row_dict
            });
        } catch (e) {
            errorDrawerFuncs.addFromError("Error grabbing data chunk", e)
        }
    }

    async function _removeCollection() {
        try {
            const result_dict = {
                "new_collection_name": null,
                "local_id": props.local_id
            };

            let data_object = await postPromiseMain(props.local_id, "remove_collection_from_project", result_dict, props.local_id);
            let table_spec = {
                current_doc_name: ""
            };
            mDispatch({
                type: "change_multiple_fields",
                newPartialState: {
                    doc_names: [],
                    table_is_shrunk: true,
                    short_collection_name: data_object.short_collection_name,
                    doc_type: "none",
                    table_spec: table_spec
                }
            });
        } catch (e) {
            errorDrawerFuncs.addFromError("Error removing collection", e)
        }
    }

    async function _changeCollection() {
        try {
            statusFuncs.startSpinner();
            let data = await postPromise("host", "get_collection_names_task", {"user_id": user_id}, props.local_id);
            let new_collection_name = await dialogFuncs.showModalPromise("SelectDialog", {
                title: "Select New Collection",
                select_label: "New Collection",
                cancel_text: "Cancel",
                submit_text: "Submit",
                option_list: data["collection_names"],
                handleClose: dialogFuncs.hideModal,
            });
            const result_dict = {
                "new_collection_name": new_collection_name,
                "local_id": props.local_id
            };
            let data_object = await postPromiseMain(props.local_id, "change_collection", result_dict, props.local_id);
            if (!window.in_context && !_cProp("is_project")) document.title = new_collection_name;
            window._collection_name = data_object.collection_name;
            let table_spec;
            if (data_object.doc_type == "table") {
                table_spec = {
                    column_names: data_object.table_spec["header_list"],
                    column_widths: data_object.table_spec.column_widths,
                    cell_backgrounds: data_object.table_spec.cell_backgrounds,
                    hidden_columns_list: data_object.table_spec.hidden_columns_list,
                    current_doc_name: data_object.doc_names[0]
                }
            } else if (data_object.doc_type == "freeform") {
                table_spec = {
                    current_doc_name: data_object.doc_names[0]
                }
            } else {
                table_spec = {
                    current_doc_name: ""
                }
            }
            mDispatch({
                type: "change_multiple_fields",
                newPartialState: {
                    doc_names: data_object.doc_names,
                    table_is_shrunk: data_object.doc_type == "none",
                    short_collection_name: data_object.short_collection_name,
                    doc_type: data_object.doc_type,
                    table_spec: table_spec
                }
            });
            pushCallback(() => {
                _handleChangeDoc(data_object.doc_names[0])
            });
            statusFuncs.clearStatusMessage();
            statusFuncs.stopSpinner();
        } catch (e) {
            if (e != "canceled") {
                errorDrawerFuncs.addFromError(`Error changing collection`, e)
            }
            statusFuncs.clearStatusMessage();
            statusFuncs.stopSpinner();
        }
    }

    function _updateDocList(doc_names, visible_doc) {
        _setMainStateValue("doc_names", doc_names);
        pushCallback(async () => {
            await _handleChangeDoc(visible_doc)
        })
    }

    function showMetadata() {
        _setMainStateValue("show_metadata", true);
    }

    function hideMetadata() {
        _setMainStateValue("show_metadata", false);
    }

    function toggleMetadata() {
        _setMainStateValue("show_metadata", !mStateRef.current.show_metadata)
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

    let my_props = {...props};
    if (!props.controlled) {
        my_props.is_project = mState.is_project;
        my_props.resource_name = mState.resource_name;
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
    let disabled_project_items = [];
    if (!my_props.is_project) {
        disabled_project_items.push("Save")
    }
    if (mState.doc_type == "none") {
        disabled_project_items.push("Export Table as Collection");
        disabled_project_items.push("Remove Collection")
    }
    let menus = (
        <Fragment>
            <ProjectMenu local_id={props.local_id}
                         project_name={project_name}
                         is_notebook={props.is_notebook}
                         is_juptyer={props.is_jupyter}
                         setProjectName={_setProjectName}
                         console_items={console_items_ref.current}
                         pushCallback={pushCallback}
                         dispatch={dispatch}
                         tile_list={tile_list_ref.current}
                         mState={mState}
                         setMainStateValue={_setMainStateValue}
                         updateLastSave={_updateLastSave}
                         changeCollection={_changeCollection}
                         removeCollection={_removeCollection}
                         disabled_items={disabled_project_items}
                         hidden_items={["Export as Jupyter Notebook"]}
            />
            {mState.doc_type != "none" &&
                <DocumentMenu local_id={props.local_id}
                              documentNames={mState.doc_names}
                              currentDoc={mState.table_spec.current_doc_name}

                />
            }
            {!isFreeform() && mState.doc_type != "none" &&
                <ColumnMenu local_id={props.local_id}
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
                            deleteColumn={_deleteColumn}
                />
            }
            {!isFreeform() && mState.doc_type != "none" &&
                <RowMenu local_id={props.local_id}
                         project_name={project_name}
                         is_notebook={props.is_notebook}
                         is_juptyer={props.is_jupyter}
                         deleteRow={_deleteRow}
                         insertRowBefore={async () => {
                             await _insertRow(mState.selected_row)
                         }}
                         insertRowAfter={async () => {
                             await _insertRow(mState.selected_row + 1)
                         }}
                         duplicateRow={_duplicateRow}
                         selected_row={mState.selected_row}
                         disabled_items={disabled_row_items}
                />
            }
            <ViewMenu local_id={props.local_id}
                      project_name={project_name}
                      is_notebook={props.is_notebook}
                      is_juptyer={props.is_jupyter}
                      table_is_shrunk={mState.table_is_shrunk}
                      toggleTableShrink={mState.doc_type == "none" ? null : _toggleTableShrink}
                      show_exports_pane={mState.show_exports_pane}
                      show_console_pane={mState.show_console_pane}
                      show_metadata={mState.show_metadata}
                      setMainStateValue={_setMainStateValue}
            />
            <NavbarDivider/>
            {create_tile_menus()}
        </Fragment>
    );
    let card_body;
    let card_header;
    if (mState.doc_type != "none") {
        card_header = (
            <MainTableCardHeader local_id={props.local_id}
                                 toggleShrink={mState.doc_type == "none" ? null : _toggleTableShrink}
                                 mState={mState}
                                 setMainStateValue={_setMainStateValue}
                                 handleChangeDoc={_handleChangeDoc}
                                 handleSearchFieldChange={_handleSearchFieldChange}
                                 show_filter_button={!isFreeform()}
                                 handleSpreadsheetModeChange={_handleSpreadsheetModeChange}
                                 handleSoftWrapChange={_handleSoftWrapChange}
                                 errorDrawerFuncs={errorDrawerFuncs}
                                 is_freeform={isFreeform()}
            />
        );


        if (isFreeform()) {
            card_body = <FreeformBody local_id={props.local_id}
                                      mState={mState}
                                      setMainStateValue={_setMainStateValue}

            />
        } else {
            card_body = (
                <BlueprintTable local_id={props.local_id}
                                clearScroll={_clearTableScroll}
                                initiateDataGrab={_initiateDataGrab}
                                setCellContent={_setCellContent}
                                filtered_column_names={_filteredColumnNames()}
                                moveColumn={_moveColumn}
                                updateTableSpec={_updateTableSpec}
                                setMainStateValue={_setMainStateValue}
                                mState={mState}
                                set_scroll={set_table_scroll}
                />
            )
        }
    }
    let tile_pane = (
        <TileContainer local_id={props.local_id}
                       tsocket={props.tsocket}
                       tile_list={tile_list_ref}
                       current_doc_name={mState.table_spec.current_doc_name}
                       selected_row={mState.selected_row}
                       table_is_shrunk={mState.table_is_shrunk}
                       broadcast_event={_broadcast_event_to_server}
                       goToModule={props.goToModule}
                       tileDispatch={tileDispatch}
                       setMainStateValue={_setMainStateValue}
        />
    );

    let exports_pane;
    if (mState.show_exports_pane) {
        exports_pane = <ExportsViewer local_id={props.local_id}
                                      tsocket={props.tsocket}
                                      setUpdate={(ufunc) => {
                                          updateExportsList.current = ufunc
                                      }}
                                      setMainStateValue={_setMainStateValue}
                                      console_is_shrunk={mState.console_is_shrunk}
                                      console_is_zoomed={mState.console_is_zoomed}
        />
    } else {
        exports_pane = <div></div>
    }
    let console_pane;
    if (mState.show_console_pane) {
        console_pane = (
            <ConsoleComponent local_id={props.local_id}
                              tsocket={props.tsocket}
                              handleCreateViewer={props.handleCreateViewer}
                              controlled={props.controlled}
                              console_items={console_items_ref}
                              console_items_not_ref={console_items}
                              console_selected_items_ref={console_selected_items_ref}
                              set_console_selected_items={set_console_selected_items}
                              dispatch={dispatch}
                              mState={mState}
                              setMainStateValue={_setMainStateValue}
                              zoomable={true}
                              shrinkable={true}
                              style={null}
            />
        );
    } else {
        console_pane = <div style={{width: "100%"}}></div>
    }

    let bottom_pane = (
        <HorizontalPanes left_pane={console_pane}
                         right_pane={exports_pane}
                         show_handle={true}
                         fixed_height={mState.console_is_shrunk}
                         initial_width_fraction={mState.console_width_fraction}
                         handleSplitUpdate={_handleConsoleFractionChange}
        />
    );
    let table_pane;
    if (mState.doc_type != "none") {
        table_pane = (
            <MainTableCard style={{padding: 0}}
                           card_body={card_body}
                           card_header={card_header}
            />
        )
    }
    let top_pane;
    if (mState.table_is_shrunk) {
        top_pane = tile_pane
    } else {
        top_pane = (
            <HorizontalPanes left_pane={table_pane}
                             right_pane={tile_pane}
                             show_handle={true}
                             initial_width_fraction={mState.horizontal_fraction}
                             handleSplitUpdate={_handleHorizontalFractionChange}
            />
        );
    }
    let extra_menubar_buttons = [];
    if (mState.doc_type != "none") {
        extra_menubar_buttons = [{onClick: _toggleTableShrink, icon: mState.table_is_shrunk ? "th" : "th-disconnect"}];
    }
    let outer_style = {
        width: `calc(100% - ${ICON_BAR_WIDTH}px)`,
        height: "100%",
        flex: "1 1 0",
        minHeight: 0,
        overflow: "auto",
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: 0,
        position: "relative"
    };
    return (
        <ErrorBoundary>
            {!window.in_context &&
                <TacticNavbar is_authenticated={window.is_authenticated}
                              user_name={window.username}
                              menus={null}
                />
            }
            <MetadataContext.Provider value={{
                showMetadata: showMetadata,
                toggleMetadata: toggleMetadata,
                hideMetadata: hideMetadata
            }}>
                <div className={`main-outer ${settingsContext.isDark() ? "bp6-dark" : "light-theme"}`}
                     ref={main_outer_ref}
                     style={outer_style}>
                    <TacticMenubar connection_status={connection_status}
                                   menus={menus}
                                   showRefresh={true}
                                   showClose={true}
                                   refreshTab={props.refreshTab}
                                   closeTab={props.closeTab}
                                   resource_name={_cProp("resource_name")}
                                   showIconBar={true}
                                   showErrorDrawerButton={true}
                                   showMetadataDrawerButton={true}
                                   showAssistantDrawerButton={true}
                                   showSettingsDrawerButton={true}
                                   extraButtons={extra_menubar_buttons}
                    />

                    <ErrorBoundary>

                        {mState.console_is_zoomed &&
                            <HorizontalPanes left_pane={console_pane}
                                             right_pane={exports_pane}
                                             show_handle={true}
                                             fixed_height={mState.console_is_shrunk}
                                             initial_width_fraction={mState.console_width_fraction}
                                             className="project-outer-padding"
                                             handleSplitUpdate={_handleConsoleFractionChange}
                            />
                        }
                        {!mState.console_is_zoomed && mState.console_is_shrunk &&
                            <div className="project-outer-padding"
                                 style={{
                                     flex: "1 1 0",
                                     minHeight: 0,
                                     overflow: "auto",
                                     display: "flex",
                                     flexDirection: "column"
                                 }}
                            >
                                <div style={{
                                    flex: "1 1 0",
                                    minWidth: 0,
                                    overflow: "auto"
                                }}>
                                    {top_pane}
                                </div>
                                <div className="shrunk-console">
                                    {bottom_pane}
                                </div>
                            </div>
                        }
                        {!mState.console_is_zoomed && !mState.console_is_shrunk &&
                            <VerticalPanes top_pane={top_pane}
                                           bottom_pane={bottom_pane}
                                           show_handle={true}
                                           initial_height_fraction={mState.height_fraction}
                                           handleSplitUpdate={_handleVerticalSplitUpdate}
                                           className="project-outer-padding"
                                           overflow="hidden"
                            />
                        }
                    </ErrorBoundary>
                </div>
                <MetadataDrawer res_type="project"
                                res_name={_cProp("resource_name")}
                                tsocket={props.tsocket}
                                readOnly={false}
                                is_repository={false}
                                show_drawer={mState.show_metadata}
                                position="right"
                                onClose={hideMetadata}
                                size="45%"
                />

            </MetadataContext.Provider>
        </ErrorBoundary>
    )
}

MainApp = memo(MainApp);

function main_main() {
    function gotProps(the_props) {
        let MainAppPlus = withRegisterActivity(withPool(withSettings(withDialogs(withErrorDrawer(withStatus(withAssistant(MainApp)))))));
        let the_element = <MainAppPlus {...the_props}
                                       controlled={false}
                                       changeName={null}
        />;
        const domContainer = document.querySelector('#main-root');
        const root = createRoot(domContainer);
        root.render(
            <div style={{
                display: "flex", flexDirection: "column",
                position: "relative",
                height: "100%",
                width: "100%"
            }}>
                {the_element}
            </div>
        )
    }

    renderSpinnerMessage("Starting up ...");
    const local_id = "a" + guid();
    window.global_id = local_id;
    const resource_name = window.project_name == "" ? window.collection_name : window.project_name;
    let tsocket = new TacticSocket("main", 5000, "project", local_id, async () => {
        tsocket.attachListener('handle-callback', (task_packet) => {
            handleCallback(task_packet, local_id)
        });
        if (window.project_name == "") {
            if (window.collection_name != "") {
                postPromise("main_service", "initialize_session_from_collection", {
                    collection_name: resource_name, global_id: window.global_id,
                    base_figure_url: window.base_figure_url,
                    local_id: local_id, username: window.username, ppi: get_ppi()
                })
                    .then((data) => {
                        data.tsocket = tsocket;
                        data.local_id = local_id;
                        data.read_only = window.read_only;
                        data.is_repository = window.is_repository;
                        main_props(data, null, gotProps)
                    })

            } else {
                postPromise("main_service", "initialize_session_for_new_project", {
                    base_figure_url: window.base_figure_url, global_id: window.global_id,
                    local_id: local_id, username: window.username, ppi: get_ppi()
                })
                    .then((data) => {
                        data.tsocket = tsocket;
                        data.local_id = local_id;
                        data.read_only = window.read_only;
                        data.is_repository = window.is_repository;
                        main_props(data, null, gotProps)
                    })
            }
        } else {
            postPromise("main_service", "initialize_session_from_save", {
                project_name: resource_name, global_id: window.global_id,
                base_figure_url: window.base_figure_url,
                local_id: local_id, username: window.username, ppi: get_ppi()
            })
                .then((data) => {
                    data.tsocket = tsocket;
                    data.local_id = local_id;
                    data.read_only = window.read_only;
                    data.is_repository = window.is_repository;
                    main_props(data, null, gotProps)
                })
        }
    })

}

if (!window.in_context) {
    main_main();
}
import "../tactic_css/tactic.scss";
import "../tactic_css/tactic_main.scss";
import "../tactic_css/tactic_table.scss";
import "../tactic_css/tactic_console.scss";
import "../tactic_css/tactic_select.scss"

import React from "react";
import {Fragment, useState, useEffect, useRef, memo} from "react";
import * as ReactDOM from 'react-dom'
import PropTypes from 'prop-types';

import {NavbarDivider} from "@blueprintjs/core";
import _ from 'lodash';

import {TacticNavbar} from "./blueprint_navbar";
import {TacticMenubar} from "./menu_utilities";
import {MainTableCard, MainTableCardHeader, FreeformBody} from "./table_react";
import {BlueprintTable, compute_added_column_width} from "./blueprint_table";
import {TacticSocket} from "./tactic_socket"
import {HorizontalPanes, VerticalPanes} from "./resizing_layouts";
import {ProjectMenu, DocumentMenu, ColumnMenu, RowMenu, ViewMenu, MenuComponent} from "./main_menus_react";
import {TileContainer} from "./tile_react";
import {ExportsViewer} from "./export_viewer_react";
import {showModalReact, showSelectDialog} from "./modal_react";
import {ConsoleComponent, itemsReducer} from "./console_component";
import {handleCallback, postWithCallback, postAjaxPromise, postAjax} from "./communication_react";
import {doFlash} from "./toaster"
import {withStatus} from "./toaster";
import {withErrorDrawer} from "./error_drawer";
import {get_ppi, renderSpinnerMessage} from "./utilities_react";
import {getUsableDimensions} from "./sizing_tools";
import {ErrorBoundary} from "./error_boundary";
import {TacticOmnibar} from "./TacticOmnibar";
import {KeyTrap} from "./key_trap";
import {useCallbackStack, useReducerAndRef} from "./utilities_react";

export {main_props, MainApp}

const MARGIN_SIZE = 0;
const BOTTOM_MARGIN = 30;  // includes space for status messages at bottom
const MARGIN_ADJUSTMENT = 8; // This is the amount at the top of both the table and the console
const CONSOLE_HEADER_HEIGHT = 35;
const EXTRA_TABLE_AREA_SPACE = 500;
const USUAL_TOOLBAR_HEIGHT = 50;
const MENU_BAR_HEIGHT = 30; // will only appear when in context

var tsocket;
let ppi;
const tstr = `some text ${MARGIN_SIZE}`;

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

function main_props(data, registerDirtyMethod, finalCallback, registerOmniFunction) {

    ppi = get_ppi();
    let main_id = data.main_id;
    if (!window.in_context) {
        window.main_id = main_id;
    }
    let initial_tile_types;
    let initial_tile_icon_dict;

    tsocket = new TacticSocket("main", 5000, main_id, function (response) {
        tsocket.socket.on("remove-ready-block", readyListener);
        initial_tile_types = response.tile_types;
        initial_tile_icon_dict = response.icon_dict;
        tsocket.socket.emit('client-ready', {
            "room": main_id, "user_id": window.user_id,
            "participant": "client", "rb_id": data.ready_block_id, "main_id": main_id
        })
    });

    tsocket.socket.on('finish-post-load', _finish_post_load_in_context);

    function readyListener() {
        _everyone_ready_in_context(finalCallback)
    }

    window.addEventListener("unload", function sendRemove(event) {
        navigator.sendBeacon("/remove_mainwindow", JSON.stringify({"main_id": main_id}));
    });

    function _everyone_ready_in_context() {
        if (!window.in_context) {
            renderSpinnerMessage("Everyone is ready, initializing...");
        }
        tsocket.socket.off("remove-ready-block", readyListener);
        tsocket.attachListener('handle-callback', (task_packet) => {
            handleCallback(task_packet, main_id)
        });
        window.base_figure_url = data.base_figure_url;
        if (data.is_project) {
            let data_dict = {
                "project_name": data.project_name,
                "doc_type": data.doc_type,
                "base_figure_url": data.base_figure_url,
                "user_id": window.user_id,
                "ppi": ppi
            };
            postWithCallback(main_id, "initialize_project_mainwindow", data_dict, null, null, main_id)
        } else {
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
        if (!window.in_context) {
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
            for (let entry of interface_state.tile_list) {
                entry.finished_loading = false
            }
        }
        if (data.is_freeform) {
            finalCallback({
                is_project: data.is_project,
                main_id: main_id,
                is_freeform: true,
                resource_name: data.is_project ? data.project_name : data.short_collection_name,
                is_notebook: false,
                is_jupyter: false,
                tsocket: tsocket,
                short_collection_name: data.short_collection_name,
                initial_tile_types: initial_tile_types,
                initial_tile_icon_dict: initial_tile_icon_dict,
                interface_state: interface_state,
                initial_data_text: fdata.data_text,
                initial_table_spec: {
                    current_doc_name: fdata.doc_names[0]
                },
                initial_theme: window.theme,
                initial_doc_names: fdata.doc_names,
                registerDirtyMethod: registerDirtyMethod,
                registerOmniFunction: registerOmniFunction
            })
        } else {
            finalCallback({
                is_project: data.is_project,
                main_id: main_id,
                is_freeform: false,
                is_notebook: false,
                is_jupyter: false,
                tsocket: tsocket,
                resource_name: data.is_project ? data.project_name : data.short_collection_name,
                short_collection_name: data.short_collection_name,
                initial_tile_types: initial_tile_types,
                initial_tile_icon_dict: initial_tile_icon_dict,
                initial_table_spec: {
                    column_names: fdata.table_spec.header_list,
                    column_widths: fdata.table_spec.column_widths,
                    cell_backgrounds: fdata.table_spec.cell_backgrounds,
                    hidden_columns_list: fdata.table_spec.hidden_columns_list,
                    current_doc_name: fdata.doc_names[0]
                },
                interface_state: interface_state,
                total_rows: fdata.total_rows,
                initial_theme: window.theme,
                initial_data_row_dict: fdata.data_row_dict,
                initial_doc_names: fdata.doc_names,
                registerDirtyMethod: registerDirtyMethod,
                registerOmniFunction: registerOmniFunction
            });
        }

    }

}

const save_attrs = ["tile_list", "table_is_shrunk", "console_width_fraction", "horizontal_fraction",
    "console_items", "console_is_shrunk", "height_fraction", "show_exports_pane", "show_console_pane", 'console_is_zoomed'];

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

const controllable_props = ["is_project", "resource_name", "usable_width", "usable_height"];

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

    // These are the attributes that are saved
    const [console_items, dispatch, console_items_ref] = useReducerAndRef(itemsReducer, iStateOrDefault("console_items"));
    const [tile_list, set_tile_list] = useState(iStateOrDefault("tile_list"));
    const [table_is_shrunk, set_table_is_shrunk] = useState(iStateOrDefault("table_is_shrunk"));
    const [console_width_fraction, set_console_width_fraction] = useState(iStateOrDefault("console_width_fraction"));
    const [horizontal_fraction, set_horizontal_fraction] = useState(iStateOrDefault("horizontal_fraction"));
    const [height_fraction, set_height_fraction] = useState(iStateOrDefault("height_fraction"));
    const [console_is_shrunk, set_console_is_shrunk] = useState(iStateOrDefault("console_is_shrunk"));
    const [show_exports_pane, set_show_exports_pane] = useState(iStateOrDefault("show_exports_pane"));
    const [show_console_pane, set_show_console_pane] = useState(iStateOrDefault("show_console_pane"));
    const [console_is_zoomed, set_console_is_zoomed] = useState(iStateOrDefault("console_is_zoomed"));

    const [table_spec, set_table_spec] = useState(props.initial_table_spec);
    const [data_text, set_data_text] = useState(props.is_freeform ? props.initial_data_text : null);
    const [data_row_dict, set_data_row_dict] = useState(props.is_freeform ? null : props.initial_data_row_dict);
    const [total_rows, set_total_rows] = useState(props.is_freeform ? null : props.total_rows);

    const [doc_names, set_doc_names] = useState(props.initial_doc_names);
    const [short_collection_name, set_short_collection_name] = useState(props.short_collection_name);

    const [tile_types, set_tile_types] = useState(props.initial_tile_types);
    const [tile_icon_dict, set_tile_icon_dict] = useState(props.initial_tile_icon_dict);

    const [alt_search_text, set_alt_search_text] = useState(null);
    const [selected_column, set_selected_column] = useState(null);
    const [selected_row, set_selected_row] = useState(null);
    const [selected_regions, set_selected_regions] = useState([]);
    const [table_is_filtered, set_table_is_filtered] = useState(false);
    const [search_text, set_search_text] = useState("");

    const [soft_wrap, set_soft_wrap] = useState(false);

    const [show_table_spinner, set_show_table_spinner] = useState(false);
    const [cells_to_color_text, set_cells_to_color_text] = useState({});
    const [force_row_to_top, set_force_row_to_top] = useState(null);
    const [spreadsheet_mode, set_spreadsheet_mode] = useState(false);

    // These will maybe only be used if not controlled
    const [is_project, set_is_project] = useState(props.is_project);
    const [sdark_theme, set_dark_theme] = useState(props.initial_theme === "dark");
    const [sresource_name, set_sresource_name] = useState(props.resource_name);
    const [showOmnibar, setShowOmnibar] = useState(false);
    const [usable_height, set_usable_height] = useState(() => {
        return getUsableDimensions(true).usable_height_no_bottom
    });
    const [usable_width, set_usable_width] = useState(() => {
        return getUsableDimensions(true).usable_width - 170
    });

    var stateSetters = {
        tile_list: set_tile_list,
        table_is_shrunk: set_table_is_shrunk,
        show_exports_pane: set_show_exports_pane,
        console_width_fraction: set_console_width_fraction,
        horizontal_fraction: set_horizontal_fraction,
        console_is_shrunk: set_console_is_shrunk,
        console_is_zoomed: set_console_is_zoomed,
        selected_regions: set_selected_regions,
        selected_column: set_selected_column,
        selected_row: set_selected_row,
        show_console_pane: set_show_console_pane,
        table_is_filtered: set_table_is_filtered,
    };

    const pushCallback = useCallbackStack();

    useEffect(() => {
        initSocket();
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
            document.title = sresource_name;
            window.dark_theme = sdark_theme;
            window.addEventListener("resize", _update_window_dimensions);
            _update_window_dimensions();
        }

        return (() => {
            tsocket.disconnect();
            delete_my_containers()
        })
    }, []);

    function cPropGetters() {
        return {
            is_project: is_project,
            usable_width: usable_width,
            usable_height: usable_height,
            resource_name: sresource_name,
        }
    }

    function _cProp(pname) {
        return props.controlled ? props[pname] : cPropGetters()[pname]
    }

    function interface_state() {
        return {
            tile_list, table_is_shrunk, console_items, console_width_fraction,
            horizontal_fraction, console_is_shrunk, height_fraction, show_exports_pane,
            show_console_pane, console_is_zoomed
        }
    }

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
        set_usable_height(uheight);
        set_usable_width(uwidth);
    }


    function _updateLastSave() {
        last_save.current = interface_state()
    }

    function _dirty() {
        let current_state = interface_state();
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
            set_tile_types(data.tile_types);
            set_tile_icon_dict(data.icon_dict);
        }), null, props.main_id;
    }

    function _change_doc_listener(data) {
        if (data.main_id == props.main_id) {
            let row_id = data.hasOwnProperty("row_id") ? data.row_id : null;
            if (table_is_shrunk) {
                set_table_is_shrunk(false)
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
        set_dark_theme(dark_theme);
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
            for (let f in field_name) {
                stateSetters[f](field_name[f]);
            }
        } else {
            stateSetters[field_name](new_value);
        }
        pushCallback(callback)
    }

    function _handleSearchFieldChange(lsearch_text) {
        set_search_text(lsearch_text);
        set_alt_search_text(null);
        if ((lsearch_text == null) && (!props.is_freeform)) {
            set_cells_to_color_text({})
        }
    }

    function _handleSpreadsheetModeChange(event) {
        set_spreadsheet_mode(event.target.checked);
    }

    function _handleSoftWrapChange(event) {
        set_soft_wrap(event.target.checked);
    }

    function _setAltSearchText(the_text) {
        set_alt_search_text(the_text)
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
        set_show_table_spinner(true);
        if (props.is_freeform) {
            postWithCallback(props.main_id, "grab_freeform_data", {
                "doc_name": new_doc_name,
                "set_visible_doc": true
            }, function (data) {
                props.stopSpinner();
                props.clearStatusMessage();
                let new_table_spec = {"current_doc_name": new_doc_name};
                set_data_text(data.data_text);
                set_table_spec(new_table_spec);
                pushCallback(() => {
                    set_show_table_spinner(false);
                });
                set_visible_doc(new_doc_name);
            }, null, props.main_id)
        } else {
            const data_dict = {"doc_name": new_doc_name, "row_index": row_index, "set_visible_doc": true};
            postWithCallback(props.main_id, "grab_chunk_by_row_index", data_dict, function (data) {
                _setStateFromDataObject(data, new_doc_name, () => {
                    set_show_table_spinner(false);
                    set_table_scroll.current = row_index;
                });
            }, null, props.main_id);
        }
    }

    function _handleVerticalSplitUpdate(top_height, bottom_height, top_fraction) {
        set_height_fraction(top_fraction)
    }

    function _updateTableSpec(spec_update, broadcast = false) {
        let new_tspec = _.cloneDeep(table_spec);
        new_tspec = Object.assign(new_tspec, spec_update);
        set_table_spec(new_tspec);
        if (broadcast) {
            spec_update["doc_name"] = table_spec.current_doc_name;
            postWithCallback(props.main_id, "UpdateTableSpec", spec_update, null, null, props.main_id);
        }
    }

    function _broadcast_event_to_server(event_name, data_dict, callback) {
        data_dict.main_id = props.main_id;
        data_dict.event_name = event_name;
        data_dict.doc_name = table_spec.current_doc_name;
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
            const data_dict = {};
            const tile_type = menu_id;
            data_dict["tile_name"] = tile_name;
            data_dict["tile_type"] = tile_type;
            data_dict["user_id"] = window.user_id;
            data_dict["parent"] = props.main_id;
            postWithCallback(props.main_id, "create_tile", data_dict, function (create_data) {
                if (create_data.success) {
                    let new_tile_entry = _createTileEntry(tile_name,
                        menu_id,
                        create_data.tile_id,
                        create_data.form_data);
                    let new_tile_list = [...tile_list];
                    new_tile_list.push(new_tile_entry);
                    set_tile_list(new_tile_list);
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
        setShowOmnibar(true)
    }

    function _closeOmnibar() {
        setShowOmnibar(false)
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
        let sorted_categories = [...Object.keys(tile_types)];
        sorted_categories.sort();
        for (let category of sorted_categories) {
            let sorted_types = [...tile_types[category]];
            sorted_types.sort();
            for (let ttype of sorted_types) {
                omni_items.push(
                    {
                        category: category,
                        display_text: ttype,
                        search_text: ttype,
                        icon_name: tile_icon_dict[ttype],
                        the_function: () => _tile_command(ttype)
                    }
                )

            }

        }
        return omni_items
    }

    function create_tile_menus() {
        let menu_items = [];
        let sorted_categories = [...Object.keys(tile_types)];
        sorted_categories.sort();
        for (let category of sorted_categories) {
            let option_dict = {};
            let icon_dict = {};
            let sorted_types = [...tile_types[category]];
            sorted_types.sort();
            for (let ttype of sorted_types) {
                option_dict[ttype] = () => _tile_command(ttype);
                icon_dict[ttype] = tile_icon_dict[ttype]
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
        set_table_is_shrunk(!table_is_shrunk);
    }

    function _handleHorizontalFractionChange(left_width, right_width, new_fraction) {
        set_horizontal_fraction(new_fraction)
    }

    function _handleResizeStart() {
        resizing.current = true;
    }

    function _handleResizeEnd() {
        resizing.current = false;
    }

    function _handleConsoleFractionChange(left_width, right_width, new_fraction) {
        set_console_width_fraction(new_fraction)
    }

    // Table doctype-only methods start here

    function _getTableBodyHeight(table_available_height) {
        if (!tbody_ref.current) {
            return table_available_height - 50;
        } else {
            let top_offset = tbody_ref.current.getBoundingClientRect().top - table_container_ref.current.getBoundingClientRect().top;
            let madjust = console_is_shrunk ? 2 * MARGIN_ADJUSTMENT : MARGIN_ADJUSTMENT;
            return table_available_height - top_offset - madjust
        }
    }

    function _setFreeformDoc(doc_name, new_content) {
        if (doc_name == table_spec.current_doc_name) {
            set_data_text(new_content)
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
        let new_data_row_dict = Object.assign({}, data_row_dict);
        let the_row = Object.assign({}, new_data_row_dict[row_id]);
        the_row[column_header] = new_content;
        new_data_row_dict[row_id] = the_row;
        set_data_row_dict(new_data_row_dict);
        let data = {id: row_id, column_header: column_header, new_content: new_content, cellchange: false};
        if (broadcast) {
            _broadcast_event_to_server("SetCellContent", data, null)
        }
    }

    function _setCellBackgroundColor(row_id, column_header, color) {
        let new_table_spec = _.cloneDeep(table_spec);
        if (!new_table_spec.cell_backgrounds.hasOwnProperty(row_id)) {
            new_table_spec.cell_backgrounds[row_id] = {}
        }
        new_table_spec.cell_backgrounds[row_id][column_header] = color;
        _updateTableSpec(new_table_spec)
    }

    function _colorTextInCell(row_id, column_header, token_text, color_dict) {
        let ccd = Object.assign({}, cells_to_color_text);
        let entry;
        if (ccd.hasOwnProperty(row_id)) {
            entry = Object.assign({}, ccd[row_id])
        } else {
            entry = {}
        }
        entry[column_header] = {token_text: token_text, color_dict: color_dict};
        ccd[row_id] = entry;
        set_cells_to_color_text(ccd)
    }

    function _refill_table(data_object) {
        _setStateFromDataObject(data_object, data_object.doc_name);
    }

    function _moveColumn(tag_to_move, place_to_move) {
        let colnames = [...table_spec.column_names];
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

        let cwidths = [...table_spec.column_widths];
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
        let hc_list = [...table_spec.hidden_columns_list];
        let fnames = _filteredColumnNames();
        let cname = selected_column;
        let col_index = fnames.indexOf(cname);
        let cwidths = [...table_spec.column_widths];
        cwidths.splice(col_index, 1);
        hc_list.push(cname);
        _updateTableSpec({hidden_columns_list: hc_list, column_widths: cwidths}, true)
    }

    function _hideColumnInAll() {
        let hc_list = [...table_spec.hidden_columns_list];
        let fnames = _filteredColumnNames();
        let cname = selected_column;
        let col_index = fnames.indexOf(cname);
        let cwidths = [...table_spec.column_widths];
        cwidths.splice(col_index, 1);
        hc_list.push(cname);
        _updateTableSpec({hidden_columns_list: hc_list, column_widths: cwidths}, false);
        const data_dict = {"column_name": selected_column};
        _broadcast_event_to_server("HideColumnInAllDocs", data_dict)
    }

    function _unhideAllColumns() {
        _updateTableSpec({hidden_columns_list: ["__filename__"]}, true)

    }

    function _clearTableScroll() {
        set_table_scroll.current = null
    }

    function _deleteRow() {
        postWithCallback(props.main_id, "delete_row",
            {
                "document_name": table_spec.current_doc_name,
                "index": selected_row
            }, null)
    }

    function _insertRow(index) {
        postWithCallback(props.main_id, "insert_row",
            {
                "document_name": table_spec.current_doc_name,
                "index": index,
                "row_dict": {}
            }, null, null, props.main_id)
    }

    function _duplicateRow() {
        postWithCallback(props.main_id, "insert_row",
            {
                "document_name": table_spec.current_doc_name,
                "index": selected_row,
                "row_dict": data_row_dict[selected_row]
            }, null, null, props.main_id)
    }


    function _deleteColumn(delete_in_all = false) {
        let fnames = _filteredColumnNames();
        let cname = selected_column;
        let col_index = fnames.indexOf(cname);
        let cwidths = [...table_spec.column_widths];
        cwidths.splice(col_index, 1);
        let hc_list = _.without(table_spec.hidden_columns_list, cname);
        let cnames = _.without(table_spec.column_names, cname);
        _updateTableSpec({
            column_names: cnames,
            hidden_columns_list: hc_list,
            column_widths: cwidths
        }, false);
        const data_dict = {
            "column_name": cname,
            "doc_name": table_spec.current_doc_name,
            "all_docs": delete_in_all
        };
        postWithCallback(props.main_id, "DeleteColumn", data_dict, null, null, props.main_id);
    }

    function _addColumn(add_in_all = false) {
        let title = add_in_all ? "Create Column All Documents" : "Create Column This Document";
        showModalReact(title, "New Column Name", function (new_name) {
            let cwidth = compute_added_column_width(new_name);
            _updateTableSpec({
                column_names: [...table_spec.column_names, new_name],
                column_widths: [...table_spec.column_widths, cwidth]
            }, false);
            const data_dict = {
                "column_name": new_name,
                "doc_name": table_spec.current_doc_name,
                "column_width": cwidth,
                "all_docs": add_in_all
            };
            _broadcast_event_to_server("CreateColumn", data_dict);
        }, "newcol", table_spec.column_names)
    }

    function _setStateFromDataObject(data, doc_name, func = null) {
        set_data_row_dict(data.data_row_dict);
        set_total_rows(data.total_rows),
            set_table_spec({
                column_names: data.table_spec.header_list,
                column_widths: data.table_spec.column_widths,
                hidden_columns_list: data.table_spec.hidden_columns_list,
                cell_backgrounds: data.table_spec.cell_backgrounds,
                current_doc_name: doc_name
            });
        pushCallback(func)
    }

    function _initiateDataGrab(row_index) {
        _grabNewChunkWithRow(row_index)
    }

    function _grabNewChunkWithRow(row_index) {
        postWithCallback(props.main_id, "grab_chunk_by_row_index",
            {doc_name: table_spec.current_doc_name, row_index: row_index}, function (data) {
                let new_data_row_dict = Object.assign(data_row_dict, data.data_row_dict);
                set_data_row_dict(new_data_row_dict)
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
                    set_doc_names(data_object.doc_names);
                    set_short_collection_name(data_object.short_collection_name);
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
        set_doc_names(doc_names);
        pushCallback(() => {
            _handleChangeDoc(visible_doc)
        })
    }

    function get_hp_height() {
        if (tile_div_ref.current) {
            if (console_is_shrunk) {
                return _cProp("usable_height") - CONSOLE_HEADER_HEIGHT - BOTTOM_MARGIN - height_adjustment.current;
            } else {
                return (_cProp("usable_height") - BOTTOM_MARGIN - height_adjustment.current) * height_fraction;
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
        return table_spec.column_names.filter((name) => {
            return !(table_spec.hidden_columns_list.includes(name) || (name == "__id__"));
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
            set_sresource_name(new_project_name);
            set_is_project(true);
            pushCallback(callback)
        }
    }

    let actual_dark_theme = props.controlled ? props.dark_theme : sdark_theme;
    let vp_height;
    let hp_height;
    let console_available_height;
    let my_props = {...props};
    if (!props.controlled) {
        my_props.is_project = is_project;
        my_props.resource_name = sresource_name;
        my_props.usable_width = usable_width;
        my_props.usable_height = usable_height
    }
    let true_usable_width = my_props.usable_width;
    if (console_is_zoomed) {
        console_available_height = get_zoomed_console_height() - MARGIN_ADJUSTMENT;
    } else {
        vp_height = get_vp_height();
        hp_height = get_hp_height();
        if (console_is_shrunk) {
            console_available_height = CONSOLE_HEADER_HEIGHT;
        } else {
            console_available_height = vp_height - hp_height - MARGIN_ADJUSTMENT - 3;
        }
    }
    let disabled_column_items = [];
    if (selected_column == null) {
        disabled_column_items = [
            "Shift Left", "Shift Right", "Hide", "Hide in All Docs", "Delete Column", "Delete Column In All Docs"
        ]
    }
    let disabled_row_items = [];
    if (selected_row == null) {
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
                         setMainStateValue={_setMainStateValue}
                         setProjectName={_setProjectName}
                         postAjaxFailure={props.postAjaxFailure}
                         console_items={console_items}
                         interface_state={interface_state()}
                         changeCollection={_changeCollection}
                         updateLastSave={_updateLastSave}
                         disabled_items={my_props.is_project ? [] : ["Save"]}
                         registerOmniGetter={_registerOmniGetter}
                         hidden_items={["Export as Jupyter Notebook"]}
            />
            <DocumentMenu {...props.statusFuncs}
                          main_id={props.main_id}
                          documentNames={doc_names}
                          registerOmniGetter={_registerOmniGetter}
                          currentDoc={table_spec.current_doc_name}

            />
            {!props.is_freeform &&
                <ColumnMenu {...props.statusFuncs}
                            main_id={props.main_id}
                            project_name={project_name}
                            is_notebook={props.is_notebook}
                            is_juptyer={props.is_jupyter}
                            moveColumn={_moveColumn}
                            table_spec={table_spec}
                            filtered_column_names={_filteredColumnNames()}
                            selected_column={selected_column}
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
                             _insertRow(selected_row)
                         }}
                         insertRowAfter={() => {
                             _insertRow(selected_row + 1)
                         }}
                         duplicateRow={_duplicateRow}
                         selected_row={selected_row}
                         registerOmniGetter={_registerOmniGetter}
                         disabled_items={disabled_row_items}
                />
            }
            <ViewMenu {...props.statusFuncs}
                      main_id={props.main_id}
                      project_name={project_name}
                      is_notebook={props.is_notebook}
                      is_juptyer={props.is_jupyter}
                      table_is_shrunk={table_is_shrunk}
                      toggleTableShrink={_toggleTableShrink}
                      openErrorDrawer={props.openErrorDrawer}
                      show_exports_pane={show_exports_pane}
                      show_console_pane={show_console_pane}
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
                             short_collection_name={short_collection_name}
                             handleChangeDoc={_handleChangeDoc}
                             doc_names={doc_names}
                             current_doc_name={table_spec.current_doc_name}
                             show_table_spinner={show_table_spinner}
                             selected_row={selected_row}
                             handleSearchFieldChange={_handleSearchFieldChange}
                             search_text={search_text}
                             setMainStateValue={_setMainStateValue}
                             table_is_filtered={table_is_filtered}
                             show_filter_button={!props.is_freeform}
                             spreadsheet_mode={spreadsheet_mode}
                             handleSpreadsheetModeChange={_handleSpreadsheetModeChange}
                             soft_wrap={soft_wrap}
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
                                  document_name={table_spec.current_doc_name}
                                  data_text={data_text}
                                  code_container_height={_getTableBodyHeight(table_available_height)}
                                  search_text={search_text}
                                  soft_wrap={soft_wrap}
                                  setMainStateValue={_setMainStateValue}
                                  code_container_width={horizontal_fraction * true_usable_width}
                                  alt_search_text={alt_search_text}
        />
    } else {
        card_body = (
            <BlueprintTable main_id={props.main_id}
                            ref={tbody_ref}
                            set_scroll={set_table_scroll.current}
                            clearScroll={_clearTableScroll}
                            initiateDataGrab={_initiateDataGrab}
                            height={_getTableBodyHeight(table_available_height)}
                            column_names={table_spec.column_names}
                            setCellContent={_setCellContent}
                            filtered_column_names={_filteredColumnNames()}
                            moveColumn={_moveColumn}
                            column_widths={table_spec.column_widths}
                            hidden_columns_list={table_spec.hidden_columns_list}
                            updateTableSpec={_updateTableSpec}
                            setMainStateValue={_setMainStateValue}
                            selected_regions={selected_regions}
                            selected_column={selected_column}
                            selected_row={selected_row}
                            search_text={search_text}
                            alt_search_text={alt_search_text}
                            cells_to_color_text={cells_to_color_text}
                            cell_backgrounds={table_spec.cell_backgrounds}
                            total_rows={total_rows}
                            broadcast_event_to_server={_broadcast_event_to_server}
                            spreadsheet_mode={spreadsheet_mode}
                            data_row_dict={data_row_dict}/>
        )

    }

    let tile_container_height = console_is_shrunk ? table_available_height - MARGIN_ADJUSTMENT : table_available_height;
    let tile_pane = (
        <div ref={tile_div_ref}>
            <TileContainer main_id={props.main_id}
                           tsocket={props.tsocket}
                           dark_theme={props.dark_theme}
                           height={tile_container_height}
                // tile_div_ref={tile_div_ref}
                           tile_list={_.cloneDeep(tile_list)}
                           current_doc_name={table_spec.current_doc_name}
                           table_is_shrunk={table_is_shrunk}
                           selected_row={selected_row}
                           broadcast_event={_broadcast_event_to_server}
                           goToModule={props.goToModule}
                           setMainStateValue={_setMainStateValue}
            />
        </div>
    );

    let exports_pane;
    if (show_exports_pane) {
        exports_pane = <ExportsViewer main_id={props.main_id}
                                      tsocket={props.tsocket}
                                      setUpdate={(ufunc) => {
                                          updateExportsList.current = ufunc
                                      }}
                                      setMainStateValue={_setMainStateValue}
                                      available_height={console_available_height}
                                      console_is_shrunk={console_is_shrunk}
                                      console_is_zoomed={console_is_zoomed}
        />
    } else {
        exports_pane = <div></div>
    }
    let console_pane;
    if (show_console_pane) {
        console_pane = (
            <ConsoleComponent {...props.statusFuncs}
                              main_id={props.main_id}
                              tsocket={props.tsocket}
                              dark_theme={actual_dark_theme}
                              handleCreateViewer={props.handleCreateViewer}
                              controlled={props.controlled}
                              am_selected={props.am_selected}
                              pushCallback={pushCallback}
                              console_items={console_items_ref}
                              dispatch={dispatch}
                              console_is_shrunk={console_is_shrunk}
                              console_is_zoomed={console_is_zoomed}
                              show_exports_pane={show_exports_pane}
                              setMainStateValue={_setMainStateValue}
                              console_available_height={console_available_height}
                              console_available_width={true_usable_width * console_width_fraction - 16}
                              zoomable={true}
                              shrinkable={true}
            />
        );
    } else {
        let console_available_width = true_usable_width * console_width_fraction - 16;
        console_pane = <div style={{width: console_available_width}}></div>
    }


    let bottom_pane = (
        <HorizontalPanes left_pane={console_pane}
                         right_pane={exports_pane}
                         show_handle={!console_is_shrunk}
                         available_height={console_available_height}
                         available_width={true_usable_width}
                         initial_width_fraction={console_width_fraction}
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
                    table_spec={table_spec}
                    broadcast_event_to_server={_broadcast_event_to_server}
                    updateTableSpec={_updateTableSpec}
                />
            </div>
        </Fragment>
    );
    let top_pane;
    if (table_is_shrunk) {
        top_pane = (
            <Fragment>
                <div style={{paddingLeft: 10}}>
                    {tile_pane}
                </div>
                {console_is_shrunk && bottom_pane}
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
                                 initial_width_fraction={horizontal_fraction}
                                 dragIconSize={15}
                                 handleSplitUpdate={_handleHorizontalFractionChange}
                                 handleResizeStart={_handleResizeStart}
                                 handleResizeEnd={_handleResizeEnd}
                />
                {console_is_shrunk && bottom_pane}
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
                                   icon: table_is_shrunk ? "th" : "th-disconnect"
                               }
                           ]}
            />
            <ErrorBoundary>
                <div className={`main-outer ${actual_dark_theme ? "bp5-dark" : "light-theme"}`}
                     ref={main_outer_ref}
                     style={{width: "100%", height: my_props.usable_height - height_adjustment.current}}>
                    {console_is_zoomed &&
                        bottom_pane
                    }
                    {!console_is_zoomed && console_is_shrunk &&
                        top_pane
                    }
                    {!console_is_zoomed && !console_is_shrunk &&
                        <VerticalPanes top_pane={top_pane}
                                       bottom_pane={bottom_pane}
                                       show_handle={true}
                                       available_width={true_usable_width}
                                       available_height={vp_height}
                                       initial_height_fraction={height_fraction}
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
                                       showOmnibar={showOmnibar}
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

if (!window.in_context) {
    main_main();
}
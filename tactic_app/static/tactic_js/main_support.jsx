import {get_ppi, renderSpinnerMessage} from "./utilities_react";
import {handleCallback} from "./communication_react";
import {TacticSocket} from "./tactic_socket";
import {postWithCallback} from "./communication_react";

let ppi;

export {main_props, mainReducer}

function main_props(data, registerDirtyMethod, finalCallback) {
    var tsocket;
    ppi = get_ppi();
    let main_id = data.main_id;
    if (!window.in_context) {
        window.main_id = main_id;
    }
    let initial_tile_types;
    let initial_tile_icon_dict;

    tsocket = new TacticSocket("main", 5000, "main_app", main_id, function (response) {
        tsocket.socket.on("remove-ready-block", readyListener);
        initial_tile_types = response.tile_types;
        initial_tile_icon_dict = response.icon_dict;
        tsocket.socket.emit('client-ready', {
            "room": main_id, "user_id": window.user_id,
            "participant": "client", "rb_id": data.ready_block_id, "main_id": main_id
        })
    });

    tsocket.attachListener('finish-post-load', _finish_post_load_in_context);

    function readyListener() {
        _everyone_ready_in_context(finalCallback)
    }

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
        if (data.doc_type == "none") {
            finalCallback({
                is_project: data.is_project,
                main_id: main_id,
                is_freeform: false,
                doc_type: data.doc_type,
                resource_name: data.is_project ? data.project_name : "",

                is_notebook: false,
                is_jupyter: false,
                tsocket: tsocket,
                short_collection_name: "",
                initial_tile_types: initial_tile_types,
                initial_tile_icon_dict: initial_tile_icon_dict,
                interface_state: interface_state,
                initial_data_text: fdata.data_text,
                initial_table_spec: {
                    current_doc_name: ""
                },
                initial_theme: window.theme,
                initial_doc_names: [],
                registerDirtyMethod: registerDirtyMethod,
            })
        }
        else if (data.is_freeform) {
            finalCallback({
                is_project: data.is_project,
                main_id: main_id,
                doc_type: data.doc_type,
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
            })
        } else {
            finalCallback({
                is_project: data.is_project,
                main_id: main_id,
                doc_type: data.doc_type,
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
            });
        }

    }

}

function mainReducer(mState, action) {
    var newMstate;
    switch (action.type) {
        case "change_field":
            newMstate = {...mState};
            newMstate[action.field] = action.new_value;
            break;
        case "change_multiple_fields":
            newMstate = {...mState, ...action.newPartialState};
            break;
        case "update_table_spec":
            newMstate = {...mState};
            newMstate.table_spec = {...mState.table_spec, ...action.spec_update};
            break;
        case "set_cell_content":
            newMstate = {...mState};
            let new_data_row_dict = {...mState.data_row_dict};
            let the_row = {...new_data_row_dict[action.row_id]};
            the_row[action.column_header] = action.new_content;
            new_data_row_dict[action.row_id] = the_row;
            newMstate.data_row_dict = new_data_row_dict;
            break;
        case "set_cell_background":
            newMstate = {...mState};
            let new_cell_backgrounds = {...mState.table_spec.cell_backgrounds};
            if (!new_cell_backgrounds.hasOwnProperty(action.row_id)) {
                new_cell_backgrounds[action.row_id] = {}
            }
            new_cell_backgrounds[action.row_id][action.column_header] = color;
            newMstate.table_spec = {...mState.table_spec, cell_backgrounds: new_cell_backgrounds};
            break;
        case "set_cells_to_color_text":
            newMstate = {...mState};
            let ccd = {...newMstate.cells_to_color_text};
            let entry = {...ccd[action.row_id]};
            entry[action.column_header] = {token_text: action.token_text, color_dict: action.color_dict};
            ccd[action.row_id] = entry;
            newMstate.cells_to_color_text = ccd;
            break;
        case "update_data_row_dict":
            newMstate = {...mState};
            newMstate.data_row_dict = {...mState.data_row_dict, ...action.new_data_row_dict};
            break;
        default:
            console.log("Got Unknown action: " + action.type);
            newMstate = {...mState};
    }
    return newMstate
}
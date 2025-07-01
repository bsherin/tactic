import {createContext} from "react";
import {TacticSocket} from "./tactic_socket";
import {renderSpinnerMessage} from "./utilities_react";
import {handleCallback, postPromise} from "./communication_react";
import {correctOptionListTypes} from "./creator_modules_react";

export {creator_props}

export {MakerPaneContext}

const MakerPaneContext = createContext(null);

function creator_props(data, registerDirtyMethod, finalCallback) {

    let mdata = data.mdata;
    let module_name = data.resource_name;
    let module_viewer_id = data.module_viewer_id;
    window.name = module_viewer_id;

    if (!window.in_context) {
        window.main_id = module_viewer_id;
    }

    async function readyListener() {
        await _everyone_ready_in_context(finalCallback);
    }

    var tsocket = new TacticSocket("main", 5000, "creator", module_viewer_id, function () {
        tsocket.socket.on("remove-ready-block", readyListener);
        tsocket.socket.emit('client-ready', {
            "room": data.module_viewer_id, "user_id": window.user_id, "participant": "client",
            "rb_id": data.ready_block_id, "main_id": data.module_viewer_id
        })
    });
    let tile_collection_name = data.tile_collection_name;


    async function _everyone_ready_in_context(finalCallback) {
        if (!window.in_context) {
            renderSpinnerMessage("Everyone is ready, initializing...", '#creator-root');
        }
        let the_content = {
            "module_name": module_name,
            "module_viewer_id": module_viewer_id,
            "tile_collection_name": tile_collection_name,
            "user_id": window.user_id,
            "version_string": window.version_string
        };

        tsocket.attachListener('handle-callback', (task_packet) => {
            handleCallback(task_packet, module_viewer_id)
        });
        let data_object = await postPromise(module_viewer_id, "initialize_parser",
            the_content, module_viewer_id);

        if (!window.in_context) {
            renderSpinnerMessage("Creating the page...", '#creator-root');
        }

        tsocket.socket.off("remove-ready-block", readyListener);
        let parsed_data = data_object.the_content;
        let all_handler_methods = data_object.all_handler_methods;
        let initial_line_number = !window.in_context && window.line_number ? window.line_number : null;
        let interface_state = null;
        if ("interface_state" in mdata) {
            interface_state = mdata.interface_state;
            delete mdata.interface_state;
        }

        finalCallback(
            {
                resource_name: module_name,
                tsocket: tsocket,
                module_viewer_id: module_viewer_id,
                main_id: module_viewer_id,
                is_mpl: parsed_data.is_mpl,
                is_d3: parsed_data.is_d3,
                initial_line_number: initial_line_number,
                standard_methods_list: parsed_data.standard_methods_list,
                user_methods_list: parsed_data.user_methods_list,
                used_handler_methods_list: parsed_data.used_handler_methods_list,
                mdata: mdata,
                option_list: correctOptionListTypes(parsed_data.option_dict),
                export_list: parsed_data.export_list,
                additional_save_attrs: parsed_data.additional_save_attrs,
                all_handler_methods: all_handler_methods,
                registerDirtyMethod: registerDirtyMethod,
                interface_state: interface_state,
            }
        );
    }
}


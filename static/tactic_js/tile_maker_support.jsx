import {createContext} from "react";
// import {TacticSocket} from "./tactic_socket";
import {isInt, renderSpinnerMessage} from "./utilities_react";
import {handleCallback, postPromise} from "./communication_react";
import _ from "lodash";

export {creator_props}

export {MakerPaneContext}

const MakerPaneContext = createContext(null);

function correctOptionListTypes(option_list) {
    let copied_olist = _.cloneDeep(option_list);
    for (let option of copied_olist) {
        option.default = correctType(option.type, option.default);
        // The following is needed because when reordering rows BpOrderableTable return the special_list
        // as a string
        if (option.type == "custom_list") {
            if (typeof option.special_list == 'string') {
                option.special_list = eval(option.special_list)
            }
        }
    }
    return copied_olist
}

function correctType(type, val, error_flag = "__ERROR__") {
    let result;
    if (val == null || val.length == 0) {
        return null
    }
    switch (type) {
        case "int":
            if (isInt(val)) {
                result = typeof val == "number" ? val : parseInt(val)
            } else {
                result = error_flag
            }
            break;
        case "float":
            if (isNaN(Number(val)) && isNaN(parseFloat(val))) {
                result = error_flag
            } else {
                result = typeof val == "number" ? val : parseFloat(val)
            }
            break;
        case "boolean":
            if (typeof val == "boolean") {
                result = val
            } else {
                let lval = val.toLowerCase();
                if (lval == "false") {
                    result = false
                } else if (lval == "true") {
                    result = true;
                } else {
                    result = error_flag;
                }
            }
            break;
        default:
            result = val;
            break;
    }
    return result
}

async function creator_props(data, registerDirtyMethod, finalCallback) {

    let mdata = data.mdata;
    let module_name = data.resource_name;
    let local_id = data.local_id;
    let tile_collection_name = data.tile_collection_name;
    let tsocket = data.tsocket;
    window.name = local_id;

    if (!window.in_context) {
        window.global_id = local_id;
    }

    if (window.in_context) {
        tsocket.attachListener('handle-callback', (task_packet) => {
            handleCallback(task_packet, local_id)
        });
    }
    let data_object = await postPromise("module_viewer", "initialize_parser",
        {local_id: local_id}, local_id);

    if (!window.in_context) {
        renderSpinnerMessage("Creating the page...", '#creator-root');
    }

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
            local_id: local_id,
            tsocket: tsocket,
            readOnly: data.is_repository,
            is_repository: data.is_repository,
            initial_line_number: initial_line_number,
            render_content_info: parsed_data.render_content_info,
            globals_info: parsed_data.globals_info,
            user_methods_list: parsed_data.user_methods_list,
            javascript_functions_list: parsed_data.javascript_functions_list,
            used_handler_methods_list: parsed_data.used_handler_methods_list,
            mdata: mdata,
            option_list: correctOptionListTypes(parsed_data.option_dict),
            widget_list: parsed_data.widget_list ? parsed_data.widget_list : [],
            export_list: parsed_data.export_list,
            additional_save_attrs: parsed_data.additional_save_attrs,
            all_handler_methods: all_handler_methods,
            registerDirtyMethod: registerDirtyMethod,
            interface_state: interface_state,
        }
    );
}


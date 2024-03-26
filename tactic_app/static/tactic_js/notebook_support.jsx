import {get_ppi, renderSpinnerMessage} from "./utilities_react";
import {TacticSocket} from "./tactic_socket";
import {handleCallback, postWithCallback} from "./communication_react";

export {notebook_props, notebookReducer}

var ppi;

function notebook_props(data, registerDirtyMethod, finalCallback) {
    var tsocket;
    ppi = get_ppi();
    let main_id = data.main_id;
    if (!window.in_context) {
        window.main_id = main_id;
    }

    tsocket = new TacticSocket("main", 5000, "notebook_app", main_id, function (response) {
        tsocket.socket.on("remove-ready-block", readyListener);
        tsocket.socket.emit('client-ready', {
            "room": main_id, "user_id": window.user_id, "participant": "client",
            "rb_id": data.ready_block_id, "main_id": main_id
        })
    });
    tsocket.socket.on('finish-post-load', _finish_post_load_in_context);

    function readyListener() {
        _everyone_ready_in_context(finalCallback)
    }

    let is_totally_new = !data.is_jupyter && !data.is_project && (data.temp_data_id == "");
    let opening_from_temp_id = data.temp_data_id != "";

    function _everyone_ready_in_context() {
        if (!window.in_context) {
            renderSpinnerMessage("Everyone is ready, initializing...");
        }
        tsocket.socket.off("remove-ready-block", readyListener);
        tsocket.attachListener('handle-callback', (task_packet) => {
            handleCallback(task_packet, main_id)
        });
        window.base_figure_url = data.base_figure_url;
        let data_dict = {
            "doc_type": "notebook",
            "base_figure_url": data.base_figure_url,
            "user_id": window.user_id,
            "ppi": ppi
        };
        if (is_totally_new) {
            postWithCallback(main_id, "initialize_mainwindow", data_dict, _finish_post_load_in_context, null, main_id)
        } else {
            if (data.is_jupyter) {
                data_dict["doc_type"] = "jupyter";
                data_dict["project_name"] = data.project_name;
            } else if (data.is_project) {
                data_dict["project_name"] = data.project_name;
            } else {
                data_dict["unique_id"] = data.temp_data_id;
            }
            postWithCallback(main_id, "initialize_project_mainwindow", data_dict, null, null, main_id)
        }
    }

    function _finish_post_load_in_context(fdata) {
        if (!window.in_context) {
            renderSpinnerMessage("Creating the page...");
        }
        tsocket.socket.off("finish-post-load", _finish_post_load_in_context);
        var interface_state;
        if (data.is_project || opening_from_temp_id) {
            interface_state = fdata.interface_state
        }
        let domContainer = document.querySelector('#main-root');
        if (data.is_project || opening_from_temp_id) {
            finalCallback({
                is_project: true,
                main_id: main_id,
                resource_name: data.project_name,
                tsocket: tsocket,
                interface_state: interface_state,
                is_notebook: true,
                is_juptyer: data.is_jupyter,
                initial_theme: window.theme,
                registerDirtyMethod: registerDirtyMethod,
            })
        } else {
            finalCallback({
                is_project: false,
                main_id: main_id,
                resource_name: data.project_name,
                tsocket: tsocket,
                interface_state: null,
                is_notebook: true,
                is_juptyer: data.is_jupyter,
                initial_theme: window.theme,
                registerDirtyMethod: registerDirtyMethod,
            })
        }
    }
}

function notebookReducer(mState, action) {
    var newMstate;
    if (action.type == "change_field") {
        newMstate = {...mState};
        newMstate[action.field] = action.new_value;
    }
    else if (action.type == "change_multiple_fields") {
        newMstate = {...mState, ...action.newPartialState};
    }
    else {
        console.log("Got Unknown action: " + action.type);
        newMstate = {...mState};
    }
    return newMstate
}
import {handleCallback} from "./communication_react";

export {notebook_props, notebookReducer}

function notebook_props(data, registerDirtyMethod, finalCallback) {
    let local_id = data.local_id;
    let tsocket = data.tsocket;
    if (!window.in_context) {
        window.global_id = local_id;
    }
    tsocket.attachListener('handle-callback', (task_packet) => {
        handleCallback(task_packet, local_id)
    });

    let opening_from_temp_id = data.temp_data_id != "";

    let interface_state;
    if (data.is_project || opening_from_temp_id) {
        interface_state = data.interface_state
    }
    if (data.is_project || opening_from_temp_id) {
        finalCallback({
            is_project: true,
            local_id: local_id,
            resource_name: data.project_name,
            tsocket: tsocket,
            interface_state: interface_state,
            is_notebook: true,
            is_juptyer: data.is_jupyter,
            readOnly: data.read_only,
            is_repository: data.is_repository,
            registerDirtyMethod: registerDirtyMethod,
        })
    } else {
        finalCallback({
            is_project: false,
            local_id: local_id,
            resource_name: data.project_name,
            tsocket: tsocket,
            interface_state: null,
            is_notebook: true,
            is_juptyer: data.is_jupyter,
            readOnly: data.read_only,
            is_repository: data.is_repository,
            registerDirtyMethod: registerDirtyMethod,
        })
    }
}

function notebookReducer(mState, action) {
    let newMstate;
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
var callbacks = {};

function handleCallback (task_packet) {
    var task_id = task_packet.callback_id;
    var func = callbacks[task_id];
    delete callbacks[task_id];
    func(task_packet.response_data);
}


function postWithCallback(dest_id, task_type, task_data, callback_func){
    var task_packet =  {
        "source": "client",
        "dest": dest_id,
        "task_type": task_type,
        "task_data": task_data,
        "response_data": null,
        "main_id": main_id
    };
    if (typeof callback_func != "undefined") {
        var unique_id = guid();
        callbacks[unique_id] = callback_func;
        task_packet.callback_id = unique_id
    }
    else {
        task_packet.callback_id = null
    }
    $.ajax({
        url: $SCRIPT_ROOT + "/post_from_client",
        contentType : 'application/json',
        type : 'POST',
        async: true,
        data: JSON.stringify(task_packet),
        dataType: 'json'
    });
}

function postWithCallbackNoMain(dest_id, task_type, task_data, callback_func){
    var task_packet =  {
        "source": "client",
        "dest": dest_id,
        "task_type": task_type,
        "task_data": task_data,
        "response_data": null,
    };
    if (typeof callback_func != "undefined") {
        var unique_id = guid();
        callbacks[unique_id] = callback_func;
        task_packet.callback_id = unique_id
    }
    else {
        task_packet.callback_id = null
    }
    $.ajax({
        url: $SCRIPT_ROOT + "/post_from_client",
        contentType : 'application/json',
        type : 'POST',
        async: true,
        data: JSON.stringify(task_packet),
        dataType: 'json'
    });
}


function broadcast_event_to_server(event_name, data_dict, callback) {
    data_dict.main_id = main_id;
    data_dict.event_name = event_name
    data_dict.doc_name = tableObject.current_spec.doc_name;
    data_dict.active_row_index = tableObject.active_row;
    postWithCallback(main_id, "distribute_events_stub", data_dict, callback)
}
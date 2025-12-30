function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function postNoCallback(dest_id, task_type, task_data, special_main_id=null){
    const task_packet =  {
        "source": "client",
        "dest": dest_id,
        "task_type": task_type,
        "task_data": task_data,
        "response_data": null,
        "main_id": special_main_id ? special_main_id : window.main_id,
        "expiration": null,
        "request_id": guid(),
    };

    task_packet.callback_id = null;
    task_packet.callback_type = "no_callback";
    task_packet.reply_to = null;
    $.ajax({
        url: $SCRIPT_ROOT + "/post_from_client",
        contentType : 'application/json',
        type : 'POST',
        async: true,
        data: JSON.stringify(task_packet),
        dataType: 'json',
        error: null
    });
}

function sendTileMessage(tile_id, event_name, event_data) {
    postNoCallback(tile_id, "TileMessage",
        {"tile_id": tile_id, "event_data": event_data, "event_name": event_name})
}

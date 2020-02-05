
import {guid} from "./utilities_react.js";

export {handleCallback, postAjax, postAjaxPromise, postAjaxUploadPromise, postWithCallback,
    postWithCallbackAsyncFalse, postWithCallbackNoMain, postAjaxUpload, postAsyncFalse, postBeacon}

let callbacks = {};

let megaplex_port = "8085";

function handleCallback (task_packet) {
    let task_id = task_packet.callback_id;
    let func = callbacks[task_id];
    delete callbacks[task_id];
    func(task_packet.response_data);
}

function postAjax(target, data, callback) {
    if (target[0] == "/") {
        target = target.slice(1)
    }
    $.ajax({
        url: $SCRIPT_ROOT + "/" + target,
        contentType: 'application/json',
        type: 'POST',
        async: true,
        data: JSON.stringify(data),
        dataType: 'json',
        success: callback
    });
}

function postAjaxPromise(target, data) {
    return new Promise (function(resolve, reject) {
        if (target[0] == "/") {
            target = target.slice(1)
        }
        $.ajax({
            url: $SCRIPT_ROOT + "/" + target,
            contentType: 'application/json',
            type: 'POST',
            async: true,
            data: JSON.stringify(data),
            dataType: 'json',
            success: (data) => {
                if (data.success) {
                    resolve(data)
                }
                reject(data)
            }
        })
    });
}

function postAjaxUpload(target, form_data, callback) {
    if (target[0] == "/") {
        target = target.slice(1)
    }
    $.ajax({
        url: $SCRIPT_ROOT + "/" + target,
        type: 'POST',
        data: form_data,
        contentType: false,
        processData: false,
        success: callback
    });
}

function postAjaxUploadPromise(target, form_data) {
    return new Promise(function(resolve, reject) {
        if (target[0] == "/") {
            target = target.slice(1)
        }
        $.ajax({
            url: $SCRIPT_ROOT + "/" + target,
            type: 'POST',
            data: form_data,
            contentType: false,
            processData: false,
            success: (data) => {
                if (data.success) {
                    resolve(data)
                }
                reject(data)
            }
        })
    })
}

function postWithCallback(dest_id, task_type, task_data, callback_func){
    const task_packet =  {
        "source": "client",
        "dest": dest_id,
        "task_type": task_type,
        "task_data": task_data,
        "response_data": null,
        "main_id": main_id,
        "expiration": null
    };
    if ((typeof callback_func != "undefined") && (callback_func != null)) {
        const unique_id = guid();
        callbacks[unique_id] = callback_func;
        task_packet.callback_id = unique_id;
        task_packet.callback_type = "callback_no_context";
        task_packet.reply_to = "client"
    }
    else {
        task_packet.callback_id = null;
        task_packet.callback_type = "no_callback";
        task_packet.reply_to = null
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

function postWithCallbackAsyncFalse(dest_id, task_type, task_data, callback_func){
    const task_packet =  {
        "source": "client",
        "dest": dest_id,
        "task_type": task_type,
        "task_data": task_data,
        "response_data": null,
        "main_id": main_id,
        "expiration": null
    };
    if ((typeof callback_func != "undefined") && (callback_func != null)) {
        const unique_id = guid();
        callbacks[unique_id] = callback_func;
        task_packet.callback_id = unique_id;
        task_packet.callback_type = "callback_no_context";
        task_packet.reply_to = "client"
    }
    else {
        task_packet.callback_id = null;
        task_packet.callback_type = "no_callback";
        task_packet.reply_to = null
    }
    $.ajax({
        url: $SCRIPT_ROOT + "/post_from_client",
        contentType : 'application/json',
        type : 'POST',
        async: false,
        data: JSON.stringify(task_packet),
        dataType: 'json'
    });
}

function postBeacon(dest_id, task_type, task_data) {
    const task_packet =  {
        "source": "client",
        "dest": dest_id,
        "task_type": task_type,
        "task_data": task_data,
        "response_data": null,
        "main_id": main_id,
        "reply_to": null,
        "callback_id": null,
        "callback_type": "no_callback",
        "expiration": null
    };
    navigator.sendBeacon($SCRIPT_ROOT + "/post_from_client", json.stringify(task_packet))
}

function postAsyncFalse(dest_id, task_type, task_data){
    const task_packet =  {
        "source": "client",
        "dest": dest_id,
        "task_type": task_type,
        "task_data": task_data,
        "response_data": null,
        "main_id": main_id,
        "reply_to": null,
        "callback_id": null,
        "callback_type": "no_callback",
        "expiration": null
    };

    $.ajax({
        url: $SCRIPT_ROOT + "/post_from_client",
        contentType : 'application/json',
        type : 'POST',
        async: false,
        data: JSON.stringify(task_packet),
        dataType: 'json',
    });
}

function postWithCallbackNoMain(dest_id, task_type, task_data, callback_func){
    const task_packet =  {
        "source": "client",
        "dest": dest_id,
        "task_type": task_type,
        "task_data": task_data,
        "response_data": null,
        "expiration": null
    };
    if (typeof callback_func != "undefined") {
        const unique_id = guid();
        callbacks[unique_id] = callback_func;
        task_packet.callback_id = unique_id;
        task_packet.callback_type = "callback_no_context";
        task_packet.reply_to = "client"
    }
    else {
        task_packet.callback_id = null;
        task_packet.callback_type = "no_callback";
        task_packet.reply_to = null
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




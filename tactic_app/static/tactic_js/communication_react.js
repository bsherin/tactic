
import {guid} from "./utilities_react.js";

export {handleCallback, postAjax, postAjaxPromise, postWithCallback, postPromise, postFormDataPromise}

let callbacks = {};

let megaplex_port = "8085";

function handleCallback(task_packet, room_id) {
    if (task_packet["room"] == room_id) {
        let task_id = task_packet.callback_id;
        if (task_id in callbacks) {
            let func = callbacks[task_id];
            delete callbacks[task_id];
            func(task_packet.response_data);
        }
    }
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

function postFormDataPromise(target, formData) {
    return new Promise(function(resolve, reject) {
        if (target[0] == "/") {
            target = target.slice(1)
        }
        $.ajax({
            url: $SCRIPT_ROOT + "/" + target,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                resolve(response)
            },
            error: function (xhr, status, error) {
                reject(xhr.responseText);
            }
        });
    })
}

function postAjaxPromise(target, data = {}) {
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
                else {
                    reject(data)
                }
            }
        })
    });
}

function postPromise(dest_id, task_type, task_data, special_main_id=null) {
    return new Promise(function(resolve, reject) {
        function tentResolve(data) {
            if ("success" in data && !data.success) {
                reject(data)
            }
            else {
                resolve(data)
            }
        }
        postWithCallback(dest_id, task_type, task_data, tentResolve, reject, special_main_id)
    })
}

function postWithCallback(dest_id, task_type, task_data, callback_func, error_callback=null, special_main_id=null){
    const task_packet =  {
        "source": "client",
        "dest": dest_id,
        "task_type": task_type,
        "task_data": task_data,
        "response_data": null,
        "main_id": special_main_id ? special_main_id : window.main_id,
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
        dataType: 'json',
        error: error_callback
    });
}





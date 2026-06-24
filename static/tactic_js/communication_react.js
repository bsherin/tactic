import {guid} from "./utilities_react";

export {
    handleCallback, postAjax, postAjaxPromise, postWithCallback, postPromise, postPromiseMain,
    postWithCallbackMain, postFormDataPromise, getBlobPromise
}

let callbacks = {};

function handleCallback(task_packet, room) {
    if (task_packet["room"] == room) {
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
    return new Promise(function (resolve, reject) {
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
    return new Promise(function (resolve, reject) {
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
                } else {
                    reject(data)
                }
            },
            error: function (xhr, status, error) {
                reject(xhr.responseText);
            }
        })
    });
}

async function getBlobPromise(target, data = {}) {
    if (target[0] === "/") target = target.slice(1);

    const url = new URL($SCRIPT_ROOT + "/" + target, window.location.origin);
    Object.entries(data).forEach(([k, v]) => url.searchParams.set(k, v));

    const resp = await fetch(url.toString(), {method: "GET"});
    const blob = await resp.blob();

    // fake an xhr-ish object so your caller doesn’t change much
    const xhrLike = {
        status: resp.status,
        getResponseHeader: (name) => resp.headers.get(name),
        responseURL: resp.url
    };

    if (!resp.ok) {
        // try to read useful error text
        const text = await blob.text().catch(() => "");
        throw text || `HTTP ${resp.status}`;
    }

    return [blob, "success", xhrLike];
}


function postPromise(dest_id, task_type, task_data, room = null) {
    return new Promise(function (resolve, reject) {
        function tentResolve(data) {
            if (data && "success" in data && !data.success) {
                reject(data)
            } else {
                resolve(data)
            }
        }

        function errorCallback(qXHR, textStatus, errorThrown) {
            reject({
                success: false, message: errorThrown,
                title: "Post Ajax Failure: {}".format(textStatus)
            })
        }

        postWithCallback(dest_id, task_type, task_data, tentResolve, errorCallback, room)
    })
}

function postPromiseMain(local_id, task_type, task_data, room = null) {
    return new Promise(function (resolve, reject) {
        function tentResolve(data) {
            if (data && "success" in data && !data.success) {
                reject(data)
            } else {
                resolve(data)
            }
        }

        function errorCallback(qXHR, textStatus, errorThrown) {
            reject({
                success: false, message: errorThrown,
                title: "Post Ajax Failure: {}".format(textStatus)
            })
        }

        postWithCallbackMain(local_id, task_type, task_data, tentResolve, errorCallback, room)
    })
}

function postWithCallbackMain(local_id, task_type, task_data, callback_func, error_callback = null, room = null) {
    task_data["local_id"] = local_id
    task_data["sid"] = local_id
    const dest_id = "main_service"
    postWithCallback(dest_id, task_type, task_data, callback_func, error_callback, room)
}

function postWithCallback(dest_id, task_type, task_data, callback_func, error_callback = null, room = null) {
    if (!("user_id" in task_data)) {
        task_data["user_id"] = window.user_id;
    }
    const task_packet = {
        "source": "client",
        "task_id": guid(),
        "dest": dest_id,
        "task_type": task_type,
        "task_data": task_data,
        "response_data": null,
        "global_id": window.global_id,
        "expiration": null,
        "request_id": guid()
    };

    task_packet.room = room == null ? window.global_id : room;

    if ((typeof callback_func != "undefined") && (callback_func != null)) {
        const unique_id = guid();
        callbacks[unique_id] = callback_func;
        task_packet.callback_id = unique_id;
        task_packet.callback_type = "callback_no_context";
        task_packet.reply_to = "client"
    } else {
        task_packet.callback_id = null;
        task_packet.callback_type = "no_callback";
        task_packet.reply_to = null
    }
    $.ajax({
        url: $SCRIPT_ROOT + "/post_from_client",
        contentType: 'application/json',
        type: 'POST',
        async: true,
        data: JSON.stringify(task_packet),
        dataType: 'json',
        error: error_callback
    });
}





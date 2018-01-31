let callbacks = {};

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
        "main_id": main_id
    };
    if ((typeof callback_func != "undefined") && (callback_func != null)) {
        const unique_id = guid();
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

function postAsyncFalse(dest_id, task_type, task_data){
    const task_packet =  {
        "source": "client",
        "dest": dest_id,
        "task_type": task_type,
        "task_data": task_data,
        "response_data": null,
        "main_id": main_id,
        "callback_id": null
    };

    $.ajax({
        url: $SCRIPT_ROOT + "/post_from_client",
        contentType : 'application/json',
        type : 'POST',
        async: false,
        data: JSON.stringify(task_packet),
        dataType: 'json'
    });
}

function postWithCallbackNoMain(dest_id, task_type, task_data, callback_func){
    const task_packet =  {
        "source": "client",
        "dest": dest_id,
        "task_type": task_type,
        "task_data": task_data,
        "response_data": null
    };
    if (typeof callback_func != "undefined") {
        const unique_id = guid();
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


function broadcast_event_to_server(event_name, data_dict, callback, tobject=null) {
    let table_object;
    if (tobject == null) {
        table_object = tableObject
    }
    else {
        table_object = tobject
    }
    data_dict.main_id = main_id;
    data_dict.event_name = event_name;
    data_dict.doc_name = table_object.current_doc_name;
    data_dict.active_row_index = table_object.active_row;
    data_dict.active_row_id = table_object.active_row_id;
    postWithCallback(main_id, "distribute_events_stub", data_dict, callback)
}

class TacticSocket {

    constructor (name_space, retry_interval) {

        this.name_space = name_space;
        this.recInterval = null;
        this.retry_interval = retry_interval;
        this.connectme();
        this.initialize_socket_stuff();
        this.watchForDisconnect();
    }

    connectme() {
        if (use_ssl) {
            this.socket = io.connect(`https://${document.domain}:${location.port}/${this.name_space}`);
        }
        else {
            this.socket = io.connect(`http://${document.domain}:${location.port}/${this.name_space}`);
        }
    }

    initialize_socket_stuff() {}

    watchForDisconnect() {
        let self = this;
        this.socket.on("disconnect", function () {
            doFlash({"message": "lost server connection"});
            self.socket.close();
            self.recInterval = setInterval(function () {
                self.attemptReconnect();
            }, self.retry_interval)
        });
    }
    attemptReconnect() {
        if (this.socket.connected) {
            clearInterval(this.recInterval);
            this.initialize_socket_stuff();
            this.watchForDisconnect();
            doFlash({"message": "reconnected to server"})
        }
        else {
            this.connectme()
        }
    }
}


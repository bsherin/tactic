
let tsocket;
let dirty;
let tile_types;
var tableObject;

const BOTTOM_MARGIN = 35;
var done_loading = false;

const HEARTBEAT_INTERVAL = 10000; //milliseconds
setInterval( function(){
   postAjax("register_heartbeat", {"main_id": main_id}, function () {});
}, HEARTBEAT_INTERVAL );

let tooltip_dict = {
    "clear-console-button": "clear console output"
};

class MainTacticSocket extends TacticSocket {

    initialize_socket_stuff() {
        this.socket.emit('join', {"room": user_id});
        this.socket.emit('join-main', {"room": main_id});
        this.socket.on('tile-message', function (data) {
            tile_dict[data.tile_id][data.tile_message](data)
        });
        this.socket.on('table-message', function (data) {
            tableObject[data.table_message](data)
        });
        this.socket.on('handle-callback', handleCallback);
        this.socket.on('close-user-windows', function(data){
                    postAsyncFalse("host", "remove_mainwindow_task", {"main_id": main_id});
                    if (!(data["originator"] == main_id)) {
                        window.close()
                    }
                });
        this.socket.on("window-open", function(data) {
            window.open($SCRIPT_ROOT + "/load_temp_page/" + data["the_id"])
        });
        this.socket.on("doFlash", function(data) {
            doFlash(data)
        });
        this.socket.on('show-status-msg', function (data){
            statusMessage(data)
        });
        this.socket.on("clear-status-msg", function (){
           clearStatusMessage()
        });
    }
}

function start_post_load() {
    console.log("entering start_post_load");
    dirty = false;
    $("#outer-container").css({"margin-left": String(MARGIN_SIZE) + "px"});
    $("#outer-container").css({"margin-right": String(MARGIN_SIZE) + "px"});
    $("#outer-container").css({"margin-top": "0px", "margin-bottom": "0px"});
    tsocket = new MainTacticSocket("main", 5000);
    tsocket.socket.on("begin-post-load", function () {
        let data_dict = {
            "doc_type": "notebook",
            "project_collection_name": _project_collection_name,
            "base_figure_url": base_figure_url,
            "use_ssl": use_ssl,
            "user_id": user_id
        };
        if (is_project) {
            data_dict["project_name"] = _project_name;
            data_dict["library_id"] = main_id;
            postWithCallback(main_id, "initialize_project_mainwindow", data_dict)
        }
        else if (temp_data_id != "") {
            data_dict["unique_id"] = temp_data_id;
            postWithCallback(main_id, "initialize_project_mainwindow", data_dict)
            }
        else {
            postWithCallback(main_id, "initialize_mainwindow", data_dict)
        }
    });
    tsocket.socket.on('finish-post-load', function (data) {
            if (is_project || (temp_data_id != "")) {
                $("#console").html(data.console_html);
            }
            build_and_render_menu_objects();
            continue_loading()
        });
    tsocket.socket.emit('ready-to-begin', {"room": main_id});
}

function continue_loading() {
    $("#outer-container").css("display", "block");
    tableObject = new TableObjectClass(({}));
    if (is_project || temp_data_id != "") {
        postWithCallback(main_id, "get_saved_console_code", {}, function (data) {
                const saved_console_code = data["saved_console_code"];
                for (let uid in saved_console_code) {
                    if (!saved_console_code.hasOwnProperty(uid)) continue;
                    console.log("getting codearea " + uid);
                    const codearea = document.getElementById(uid);
                    codearea.innerHTML = "";
                    consoleObject.createConsoleCodeInCodearea(uid, codearea);
                    consoleObject.consoleCMObjects[uid].doc.setValue(saved_console_code[uid]);
                    consoleObject.consoleCMObjects[uid].refresh();
                }
            });
    }
    consoleObject.prepareNotebook();
    stopSpinner();
    if (is_project) {
        menus["Project"].enable_menu_item("save");
    }
    initializeTooltips();
    done_loading = true
}

function removeMainwindow() {
    postAsyncFalse("host", "remove_mainwindow_task", {"main_id": main_id})
}

spinner_html = '<span class="loader-small"></span>';
console_spinner_html = '<span class="loader-console"></span>';


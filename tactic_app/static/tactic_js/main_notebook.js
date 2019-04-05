
let tsocket;
let dirty;
var tableObject;
DOC_TYPE = "notebook";
const BOTTOM_MARGIN = 35;
var done_loading = false;
var ppi;

const HEARTBEAT_INTERVAL = 10000; //milliseconds
var heartbeat_timer = setInterval( function(){
   postAjax("register_heartbeat", {"main_id": main_id}, function () {});
}, HEARTBEAT_INTERVAL );

let tooltip_dict = {
    "clear-console-button": "clear console output"
};

class MainTacticSocket extends TacticSocket {

    initialize_socket_stuff() {
        self = this;
        this.socket.emit('join', {"room": user_id});
        this.socket.emit('join-main', {"room": main_id}, function() {
            _after_main_joined();
        });
        this.socket.on('tile-message', function (data) {
            tile_dict[data.tile_id][data.tile_message](data)
        });
        this.socket.on('console-message', function (data) {
            consoleObject[data.console_message](data)
        });
        this.socket.on('handle-callback', handleCallback);
        this.socket.on('close-user-windows', function(data){
                    postAsyncFalse("host", "remove_mainwindow_task", {"main_id": main_id});
                    if (!(data["originator"] == main_id)) {
                        window.close()
                    }
                });
        this.socket.on('stop-heartbeat', function(data) {
            clearInterval(heartbeat_timer)
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

function _notebook_main() {
    console.log("entering _notebook_main");
    ppi = get_ppi();
    dirty = false;
    tsocket = new MainTacticSocket("main", 5000);
    tsocket.socket.on('finish-post-load', function (data) {
        console.log("got finish-post-load");
        build_and_render_menu_objects();
        create_and_fill_console(data.console_html)
    });
}

function _after_main_joined() {
    let data_dict = {
            "doc_type": "notebook",
            "base_figure_url": base_figure_url,
            "use_ssl": use_ssl,
            "user_id": user_id,
            "library_id": main_id,
            "ppi": ppi
    };
    if (is_totally_new) {
        console.log("about to intialize");
        postWithCallback(main_id, "initialize_mainwindow", data_dict)
    }
    else  {
        if (is_jupyter) {
            data_dict["doc_type"] = "jupyter";
            data_dict["project_name"] = _project_name;
        }
        else if (is_project) {
            data_dict["project_name"] = _project_name;
        }
        else  {
            data_dict["unique_id"] = temp_data_id;
        }
        postWithCallback(main_id, "initialize_project_mainwindow", data_dict)
    }
}

function create_and_fill_console(console_html) {
    $("#outer-container").css("display", "block");
    consoleObject = new ConsoleObjectClass();
    let self = this;
    if (is_jupyter) {
        consoleObject.load_jupyter_cell_data();
    }
    else if (is_project || temp_data_id != "") {
        consoleObject.load_saved_console_code(console_html)
    }
    consoleObject.prepareNotebook();
    if (is_project && !is_jupyter) {
        menus["Project"].enable_menu_item("save");
    }
    else {
        menus["Project"].disable_menu_item("save")
    }
    initializeTooltips();
    stopSpinner();
    done_loading = true
}

function removeMainwindow() {
    postAsyncFalse("host", "remove_mainwindow_task", {"main_id": main_id})
}

spinner_html = '<span class="loader-small"></span>';
console_spinner_html = '<span class="loader-console"></span>';


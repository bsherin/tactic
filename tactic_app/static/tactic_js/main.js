
let tsocket;
let dirty;
var tableObject;
var ppi;

const BOTTOM_MARGIN = 35;
var done_loading = false;

const HEARTBEAT_INTERVAL = 10000; //milliseconds
setInterval( function(){
   postAjax("register_heartbeat", {"main_id": main_id}, function () {});
}, HEARTBEAT_INTERVAL );

let tooltip_dict = {
    "shrink-table-button": "shrink/expand table",
    "doc-selector": "select document",
    "search-button": "highlight matching text",
    "filter-button": "show matching rows",
    "unfilter-button": "show all rows",
    "show-console-button": "show/hide the console",
    "hide-console-button": "show/hide the console",
    "clear-console-button": "clear console output"
};

class MainTacticSocket extends TacticSocket {

    initialize_socket_stuff() {
        this.socket.emit('join', {"room": user_id});
        this.socket.emit('join-main', {"room": main_id}, function() {
            _after_main_joined();
        });
        this.socket.on('tile-message', function (data) {
            tile_dict[data.tile_id][data.tile_message](data)
        });
        this.socket.on('table-message', function (data) {
            tableObject[data.table_message](data)
        });
        this.socket.on('console-message', function (data) {
            consoleObject[data.console_message](data)
        });
        this.socket.on('export-viewer-message', function(data) {
            exportViewerObject[data.export_viewer_message](data)
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

        this.socket.on("notebook-open", function(data) {
            window.open($SCRIPT_ROOT + "/open_notebook/" + data["the_id"])
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

        this.socket.on("stop-status-spinner", function (){
           stopSpinner()
        });

        this.socket.on('update-menus', function() {
            if (done_loading){
                postWithCallback("host", "get_tile_types", {"user_id": user_id}, function (data) {
                    clear_all_menus();
                    build_and_render_menu_objects(data.tile_types);
                    })
                }
            });
        this.socket.on('change-doc', function(data){
            $("#doc-selector").val(data.doc_name);
            if (table_is_shrunk) {
                tableObject.expandTable()
            }
            if (data.hasOwnProperty("row_id")) {
                change_doc($("#doc-selector")[0], data.row_id)
            }
            else {
                change_doc($("#doc-selector")[0], null)
            }

        });
    }
}

function _main_main() {
    console.log("entering start_post_load");
    dirty = false;
    ppi = get_ppi();
    tsocket = new MainTacticSocket("main", 5000);
    tsocket.socket.on('finish-post-load', function (data) {
        if (is_project) {
            _collection_name = data.collection_name;
            doc_names = data.doc_names;
            $("#doc-selector-label").html(data.short_collection_name);
            let doc_popup = "";
            for (let dname of doc_names) {
                doc_popup = doc_popup + `<option>${dname}</option>`
            }
            $("#doc-selector").html(doc_popup)
        }
        let console_html = data.console_html;
        postWithCallback("host", "get_tile_types", {"user_id": user_id}, function (data) {
            build_and_render_menu_objects(data.tile_types);
            create_table_and_console(console_html)
        })
    });
    tsocket.socket.on('recreate-saved-tile', create_tile_from_save);
    tsocket.socket.on('tile-source-change', function (data) {
        for (let tid in tile_dict) {
            if (!tile_dict.hasOwnProperty(tid)) {
                continue;
            }
            if (tile_dict[tid].tile_type == data["tile_type"])
                $("#" + tid).addClass("tile-source-changed")
        }
    });
}
function _after_main_joined() {
    if (is_project) {
        let data_dict = {
            "project_name": _project_name,
            "doc_type": DOC_TYPE,
            "library_id": main_id,
            "base_figure_url": base_figure_url,
            "use_ssl": use_ssl,
            "user_id": user_id,
            "ppi": ppi
        };
        postWithCallback(main_id, "initialize_project_mainwindow", data_dict)
    }
    else {
        let data_dict = {
            "collection_name": _collection_name,
            "doc_type": DOC_TYPE,
            "base_figure_url": base_figure_url,
            "use_ssl": use_ssl,
            "user_id": user_id,
            "ppi": ppi
        };
        postWithCallback(main_id, "initialize_mainwindow", data_dict)
    }
}

function create_tile_from_save(data) {
    let tile_id = data["tile_id"];
    let tile_save_results = data["tile_saved_results"];
    let tile_sort_list = data["tile_sort_list"];
    let tile_type = data["tile_type"];
    const tile_html = tile_save_results.tile_html;

    // Get the index to position the tile properly
    let current_sort_list = $("#tile-div").sortable("toArray");

    let revised_tile_sort_list = [];

    for (let t of tile_sort_list) {
        if ((t == tile_id) || (current_sort_list.includes(t))) {
            revised_tile_sort_list.push(t)
        }
    }
    let new_tile_index = revised_tile_sort_list.indexOf(tile_id);

    const new_tile_object = new TileObject(tile_id, tile_html, false, tile_save_results.tile_name, new_tile_index, tile_type);
    tile_dict[tile_id] = new_tile_object;
    new_tile_object.saved_size = tile_save_results.saved_size;
    const sortable_tables = $(new_tile_object.full_selector() + " table.sortable");
    $.each(sortable_tables, function (index, the_table) {
        sorttable.makeSortable(the_table)
    });
    new_tile_object.hideOptions();
    new_tile_object.hideTileLog();
    // If I don't do the thing below, then the tile doesn't resize unless it's rerun first
    if (tile_save_results.is_d3) {
        postWithCallback(tile_id, "RefreshTileFromSave", {})
    }
    if (table_is_shrunk) {
        $("#" + tile_id).addClass("tile-panel-float")
    }
}

function create_table_and_console(console_html) {
    consoleObject = new ConsoleObjectClass();
    exportViewerObject = new exportViewerObjectClass();
    tableObject = new TableObjectClass();
    if (is_project) {
        postWithCallback(main_id, "grab_project_data", {"doc_name": String(doc_names[0])}, function(data) {
            console.log("Entering grab_project_data callback");
            $("#outer-container").css("display", "block");
            $("#table-area").css("display", "block");
            tablespec_dict = {};
            for (let spec in data.tablespec_dict) {
                if (!data.tablespec_dict.hasOwnProperty(spec)){
                    continue;
                }
                tablespec_dict[spec] = new TableSpec(data.tablespec_dict[spec])
            }
            tableObject.initialize_table(data);
            consoleObject.load_saved_console_code(console_html);

            // Note that the visible doc has to be definitely set
            // before creating the tiles. It is needed in order to set the list of column headers
            // in tile forms.
            set_visible_doc(doc_names[0], function () {
                if (data.is_shrunk) {
                    tableObject.shrinkTable()
                }
                else {
                    table_is_shrunk = false
                }
                menus["Project"].enable_menu_item("save");
                })
            })
    }
    else {
        tableObject.set_doc(String(doc_names[0]));
    }

    $("#tile-div").sortable({
        handle: '.card-header',
        tolerance: 'pointer',
        revert: 'invalid',
        forceHelperSize: true,
        stop: function() {
            const new_sort_list = $("#tile-div").sortable("toArray");
            postWithCallback(main_id, "UpdateSortList", {"sort_list": new_sort_list})
        }
    });

    initializeTooltips();
    done_loading = true
}

function set_visible_doc(doc_name, func) {
    const data_dict = {"doc_name": doc_name};
    if (func === null) {
        postWithCallback(main_id, "set_visible_doc", data_dict)
    }
    else {
        postWithCallback(main_id, "set_visible_doc", data_dict, func)
    }
}


function removeMainwindow() {
    postAsyncFalse("host", "remove_mainwindow_task", {"main_id": main_id})
}

spinner_html = '<span class="loader-small"></span>';
console_spinner_html = '<span class="loader-console"></span>';



let socket;
let dirty;
let tile_types;
var tableObject;

const BOTTOM_MARGIN = 35;

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

function start_post_load() {
    console.log("entering start_post_load");
    dirty = false;
    $("#outer-container").css({"margin-left": String(MARGIN_SIZE) + "px"});
    $("#outer-container").css({"margin-right": String(MARGIN_SIZE) + "px"});
    $("#outer-container").css({"margin-top": "0px", "margin-bottom": "0px"});
    if (use_ssl) {
        socket = io.connect('https://' + document.domain + ':' + location.port + '/main');
    }
    else {
        socket = io.connect('http://' + document.domain + ':' + location.port + '/main');
    }
    socket.emit('join', {"room": user_id});
    socket.emit('join-main', {"room": main_id});
    socket.emit('ready-to-begin', {"room": main_id});
    socket.on('tile-message', function (data) {
        tile_dict[data.tile_id][data.tile_message](data)
    });
    socket.on('table-message', function (data) {
        tableObject[data.table_message](data)
    });
    socket.on('export-viewer-message', function(data) {
        exportViewerObject[data.export_viewer_message](data)
    });
    socket.on('handle-callback', handleCallback);
    socket.on('close-user-windows', function(data){
                postAsyncFalse("host", "remove_mainwindow_task", {"main_id": main_id});
                if (!(data["originator"] == main_id)) {
                    window.close()
                }
            });
    socket.on('finish-post-load', function (data) {
        if (is_project) {
            $("#console").html(data.console_html);
            if (!is_notebook) {
                _collection_name = data.collection_name;
                doc_names = data.doc_names;
                $("#doc-selector-label").html(data.short_collection_name);
                let doc_popup = "";
                for (let dname of doc_names) {
                    doc_popup = doc_popup + `<option>${dname}</option>`
                }
                $("#doc-selector").html(doc_popup)
            }
        }
        if (is_notebook) {
            build_and_render_menu_objects();
            continue_loading()
        }
        else {
            postWithCallback("host", "get_tile_types", {"user_id": user_id}, function (data) {
                tile_types = data.tile_types;
                build_and_render_menu_objects();
                continue_loading()
            })
        }
    });
    socket.on("window-open", function(data) {
        window.open($SCRIPT_ROOT + "/load_temp_page/" + data["the_id"])
    });
    socket.on("doFlash", function(data) {
        doFlash(data)
    });
    socket.on('show-status-msg', function (data){
        statusMessage(data)
    });
    socket.on("clear-status-msg", function (){
       clearStatusMessage()
    });
    socket.on("begin-post-load", function () {
        if (is_project) {
            let data_dict = {
                "project_name": _project_name,
                "doc_type": DOC_TYPE,
                "project_collection_name": _project_collection_name,
                "user_manage_id": main_id,
                "mongo_uri": mongo_uri,
                "base_figure_url": base_figure_url,
                "use_ssl": use_ssl,
                "user_id": user_id
            };
            postWithCallback(main_id, "initialize_project_mainwindow", data_dict)
        }
        else {
            let data_dict = {
                "collection_name": _collection_name,
                "doc_type": DOC_TYPE,
                "project_collection_name": _project_collection_name,
                "mongo_uri": mongo_uri,
                "base_figure_url": base_figure_url,
                "use_ssl": use_ssl
            };
            postWithCallback(main_id, "initialize_mainwindow", data_dict)
        }
    })
}

function continue_loading() {
    if (!is_notebook) {
        socket.on('update-menus', function() {
            postWithCallback("host", "get_tile_types", {"user_id": user_id}, function (data) {
                tile_types = data.tile_types;
                clear_all_menus();
                build_and_render_menu_objects();
            })});
        socket.on('change-doc', function(data){
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

    if (_project_name != "") {
        if (is_notebook) {
            $("#outer-container").css("display", "block");
            tableObject = new TableObjectClass(({}));
            postWithCallback(main_id, "get_saved_console_code", {}, function (data) {
                    const saved_console_code = data["saved_console_code"];
                    // global_scc = saved_console_code;
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
            consoleObject.prepareNotebook();
            menus["Project"].enable_menu_item("save");
            stopSpinner();
        }
        else {
            postWithCallback(main_id, "grab_project_data", {"doc_name": String(doc_names[0])}, function(data) {
                console.log("Entering grab_project_data callback");
                // $("#loading-message").css("display", "none");
                // $("#reload-message").css("display", "none");
                $("#outer-container").css("display", "block");
                $("#table-area").css("display", "block");
                // if (data.hasOwnProperty("hidden_columns_list")) {
                //     hidden_columns_list = data.hidden_columns_list;
                // }
                tablespec_dict = {};
                for (let spec in data.tablespec_dict) {
                    if (!data.tablespec_dict.hasOwnProperty(spec)){
                        continue;
                    }
                    tablespec_dict[spec] = new TableSpec(data.tablespec_dict[spec])
                }
                tableObject = new TableObjectClass((data)); // consoleObject is created in here
                postWithCallback(main_id, "get_saved_console_code", {}, function (data) {
                    const saved_console_code = data["saved_console_code"];
                    // global_scc = saved_console_code;
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

                // Note that the visible doc has to be definitely set
                // before creating the tiles. It is needed in order to set the list of column headers
                // in tile forms.
                set_visible_doc(doc_names[0], function () {
                    $.each(data.tile_ids, function(index, tile_id){
                        create_tile_from_save(tile_id)
                    });
                    if (data.is_shrunk) {
                        tableObject.shrinkTable()
                    }
                    else {
                        table_is_shrunk = false
                    }

                    menus["Project"].enable_menu_item("save");
                    postWithCallback(main_id, "DisplayCreateErrors", {});
                    stopSpinner();

                    function create_tile_from_save(tile_id) {
                        const tile_html = data.tile_save_results[tile_id].tile_html;
                        const new_tile_object = new TileObject(tile_id, tile_html, false, data.tile_save_results[tile_id].tile_name);
                        tile_dict[tile_id] = new_tile_object;
                        new_tile_object.saved_size = data.tile_save_results[tile_id].saved_size;
                        const sortable_tables = $(new_tile_object.full_selector() + " table.sortable");
                        $.each(sortable_tables, function (index, the_table) {
                            sorttable.makeSortable(the_table)
                        });
                        new_tile_object.hideOptions();
                        new_tile_object.hideTileLog();
                        // If I don't do the thing below, then the tile doesn't resize unless it's rerun first
                        if (data.tile_save_results[tile_id].is_d3) {
                            postWithCallback(tile_id, "RefreshTileFromSave", {})
                            }
                        }
                    })
                })
            }
        }
    else {
        if (is_notebook) {
            $("#outer-container").css("display", "block");
            tableObject = new TableObjectClass(({}));
            consoleObject.prepareNotebook();
            stopSpinner();
            clearStatusMessage();
        }
        else {
            postWithCallback(main_id, "grab_data", {"doc_name":String(doc_names[0])}, function (data) {
                // $("#loading-message").css("display", "none");
                // $("#reload-message").css("display", "none");
                $("#outer-container").css("display", "block");
                $("#table-area").css("display", "block");
                tableObject = new TableObjectClass((data));
                set_visible_doc(doc_names[0], null);
                stopSpinner();
                clearStatusMessage();
            })
        }

    }

    if (!is_notebook) {
        $("#tile-div").sortable({
            handle: '.panel-heading',
            tolerance: 'pointer',
            revert: 'invalid',
            forceHelperSize: true,
            stop: function() {
                const new_sort_list = $("#tile-div").sortable("toArray");
                postWithCallback(main_id, "UpdateSortList", {"sort_list": new_sort_list})
            }
        });
    }

    initializeTooltips();
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

function change_doc(el, row_id) {
    $("#table-area").css("display", "none");
    // $("#reload-message").css("display", "block");
    startSpinner();
    const doc_name = $(el).val();
    if (row_id == null) {
        postWithCallback(main_id, "grab_data", {"doc_name":doc_name}, function (data) {
        // $("#loading-message").css("display", "none");
        // $("#reload-message").css("display", "none");
        $("#outer-container").css("display", "block");
        $("#table-area").css("display", "block");
        tableObject.initialize_table(data);
        stopSpinner();
        set_visible_doc(doc_name, null)
        })
    }
    else {
        const data_dict = {"doc_name": doc_name, "row_id": row_id};
        if (DOC_TYPE == "table") {
            postWithCallback(main_id, "grab_chunk_with_row", data_dict, function (data) {
                // $("#loading-message").css("display", "none");
                // $("#reload-message").css("display", "none");
                $("#outer-container").css("display", "block");
                $("#table-area").css("display", "block");
                tableObject.initialize_table(data);
                const tr_element = $("#table-area tbody")[0].rows[data.actual_row];
                scrollIntoView(tr_element, $("#table-area tbody"));
                $(tr_element).addClass("selected-row");
                tableObject.active_row = data.actual_row;
                tableObject.active_row_id = row_id;
                set_visible_doc(doc_name, null);
                stopSpinner();
                clearStatusMessage();
            })
        }
        else {
            postWithCallback(main_id, "grab_data", {"doc_name":doc_name}, function (data) {
                // $("#loading-message").css("display", "none");
                // $("#reload-message").css("display", "none");
                $("#outer-container").css("display", "block");
                $("#table-area").css("display", "block");
                tableObject.initialize_table(data);
                myCodeMirror.scrollIntoView(row_id);
                tableObject.active_row = row_id;
                set_visible_doc(doc_name, null);
                stopSpinner();
                clearStatusMessage()
            })
        }
    }
}

function removeMainwindow() {
    postAsyncFalse("host", "remove_mainwindow_task", {"main_id": main_id})
}

spinner_html = '<span class="loader-small"></span>';
console_spinner_html = '<span class="loader-extra-small"></span>';


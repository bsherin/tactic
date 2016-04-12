var socket;
var console_visible;
var saved_console_size;
var dirty;
var tile_types;

var tooltip_dict = {
    "shrink-table-button": "shrink/expand table",
    "doc-selector": "select document",
    "search-button": "highlight matching text",
    "filter-button": "show matching rows",
    "unfilter-button": "show all rows",
    "show-console-button": "show/hide the console",
    "hide-console-button": "show/hide the console",
    "clear-console-button": "clear console output"
};

function initializeConsole() {
    saved_console_size = 150;
    var pan = $("#console-panel");
    $("#console").fadeOut();
    var hheight = $('#console-heading').outerHeight();
    pan.outerHeight(hheight);
    pan.find(".triangle-bottom").hide();
    pan.find(".triangle-right").show();
    console_visible = false

}

function shrinkConsole (){
    saved_console_size = $("#console-panel").outerHeight();
    var pan = $("#console-panel");
    var hheight = $("#console-heading").outerHeight();
    $("#console").fadeOut("fast", function () {
        pan.outerHeight(hheight);
        pan.resizable('destroy');
        pan.find(".triangle-bottom").hide();
        pan.find(".triangle-right").show();
        tableObject.resize_table_area();
        console_visible = false
    });
}

function expandConsole(){
    var pan = $("#console-panel");
    pan.outerHeight(saved_console_size);
    pan.find(".triangle-right").hide();
    pan.find(".triangle-bottom").show();
    $("#console").fadeIn();
    $("#console").outerHeight(pan.innerHeight()- $("#console-heading").outerHeight());
    console_visible = true;
    tableObject.resize_table_area();
    pan.resizable({
            handles: "n",
            resize: function (event, ui) {
                ui.position.top = 0;
                tableObject.resize_table_area();
                $("#console").outerHeight(ui.size.height- $("#console-heading").outerHeight())
            }
        });
}

function closeLogItem(e) {
    $(e.parentElement.parentElement).remove()
}


function addBlankConsoleText() {
    $.getJSON($SCRIPT_ROOT + '/add_blank_console_text/'  + String(main_id), function(data) {
        if (!data.success) {
            doFlash(data)
        }
    })
}

function openLogWindow() {
    var result_dict = {
        "console_html": $('#console').html()
    };
    $.ajax({
            url: $SCRIPT_ROOT + "/send_log_html/" + String(main_id),
            contentType : 'application/json',
            type : 'POST',
            async: true,
            data: JSON.stringify(result_dict),
            dataType: 'json',
            success: function (data) {
                if (data.success) {
                     window.open($SCRIPT_ROOT + "/open_log_window/" + String(main_id))
                }
                else {
                    doFlash(data)
                }
            }
    });
}

function start_post_load() {
    //spinner = new Spinner({scale: 1.0}).spin();
    //$("#loading-message").html(spinner.el);
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
    $.getJSON($SCRIPT_ROOT + "/get_tile_types", function (data) {
        tile_types = data.tile_types;
        build_and_render_menu_objects();
        continue_loading()
    })
}

function continue_loading() {
    socket.on('update-menus', function(data) {
        $.getJSON($SCRIPT_ROOT + "/get_tile_types", function (data) {
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
    if (_project_name != "") {
        $.getJSON($SCRIPT_ROOT + "/grab_project_data/" + String(main_id) + "/" + String(doc_names[0]), function(data) {
                console.log("Entering grab_project_data callback")
                $("#loading-message").css("display", "none");
                $("#reload-message").css("display", "none");
                $("#outer-container").css("display", "block");
                $("#table-area").css("display", "block");
                hidden_columns_list = data.hidden_columns_list;
                tablespec_dict = {};
                for (var spec in data.tablespec_dict) {
                    if (!data.tablespec_dict.hasOwnProperty(spec)){
                        continue;
                    }
                    tablespec_dict[spec] = create_tablespec(data.tablespec_dict[spec])
                }
                tableObject.initialize_table(data);

                // Note that the visible doc has to be definitely set
                // before creating the tiles. It is needed in order to set the list of column headers
                // in tile forms.
                set_visible_doc(doc_names[0], function () {
                    var tile_ids = data.tile_ids;
                    create_tile_from_save(0);
                    menus["Project"].enable_menu_item("save");
                    broadcast_event_to_server("DisplayCreateErrors", {});

                    function create_tile_from_save(index) {
                        if (index == tile_ids.length) {
                            if (data.is_shrunk) {
                                tableObject.shrinkTable()
                            }
                            else {
                                table_is_shrunk = false
                            }
                            return
                        }
                        var tile_id = tile_ids[index];
                        var data_dict = {};
                        data_dict["tile_id"] = tile_id;
                        data_dict["main_id"] = main_id;
                        $.ajax({
                            url: $SCRIPT_ROOT + "/create_tile_from_save_request/" + String(tile_id),
                            contentType: 'application/json',
                            type: 'POST',
                            data: JSON.stringify(data_dict),
                            dataType: 'json',
                            error: function (jqXHR, textStatus, errorThrown) {
                                console.log("Error creating tile from save: " + textStatus + " " + errorThrown)
                            },
                            success: function (data) {
                                // todo it dies in the next line
                                var new_tile_object = new TileObject(data.tile_id, data.tile_html, false);
                                tile_dict[data.tile_id] = new_tile_object;
                                new_tile_object.saved_size = data.saved_size;
                                var sortable_tables = $(new_tile_object.full_selector() + " table.sortable");
                                $.each(sortable_tables, function (index, the_table) {
                                    sorttable.makeSortable(the_table)
                                });
                                new_tile_object.hideOptions();
                                create_tile_from_save(index + 1)
                            }
                        })
                    }
            })
            })
    }
else {
        $.getJSON($SCRIPT_ROOT + "/grab_data/" + String(main_id) + "/" + String(doc_names[0]), function (data) {
            $("#loading-message").css("display", "none");
            $("#reload-message").css("display", "none");
            $("#outer-container").css("display", "block");
            $("#table-area").css("display", "block");
            tablespec_dict = {};
            tableObject.initialize_table(data);
            set_visible_doc(doc_names[0], null)
        })
    }

    $("#tile-div").sortable({
        handle: '.panel-heading',
        tolerance: 'pointer',
        revert: 'invalid',
        forceHelperSize: true,
        stop: function( event, ui ) {
            var new_sort_list = $("#tile-div").sortable("toArray");
            broadcast_event_to_server("UpdateSortList", {"sort_list": new_sort_list})
        }
    });

    $("#console").sortable({
        handle: '.panel-heading',
        tolerance: 'pointer',
        revert: 'invalid',
        forceHelperSize: true
    });

    initializeTooltips();

    socket.emit('join', {"room": user_id});
    socket.emit('join', {"room": main_id});
    socket.on('tile-message', function (data) {
        // console.log("received tile message " + data.message);
        tile_dict[data.tile_id][data.message](data)
    });
    socket.on('table-message', function (data) {
        // console.log("received table message " + data.message);
        tableObject[data.message](data)
    });
    socket.on('handle-callback', handleCallback)
    socket.on('close-user-windows', function(data){
        $.ajax({
            url: $SCRIPT_ROOT + "/remove_mainwindow/" + String(main_id),
            contentType: 'application/json',
            type: 'POST'
        });
        window.close()
    })
}

function set_visible_doc(doc_name, func) {
    if (func == null) {
        $.ajax({
            url: $SCRIPT_ROOT + "/set_visible_doc/" + String(main_id) + "/" + String(doc_name),
            contentType: 'application/json',
            type: 'POST'
        })
    }
    else {
        $.ajax({
            url: $SCRIPT_ROOT + "/set_visible_doc/" + String(main_id) + "/" + String(doc_name),
            contentType: 'application/json',
            type: 'POST',
            success: func
        })
    }
}

function change_doc(el, row_id) {
    $("#table-area").css("display", "none");
    $("#reload-message").css("display", "block");
    var doc_name = $(el).val();
    if (row_id == null) {
        $.getJSON($SCRIPT_ROOT + "/grab_data/" + String(main_id) + "/" + String(doc_name), function (data) {
        $("#loading-message").css("display", "none");
        $("#reload-message").css("display", "none");
        $("#outer-container").css("display", "block");
        $("#table-area").css("display", "block");
        tableObject.initialize_table(data);
        set_visible_doc(doc_name, null)
        })
    }
    else {
        var data_dict = {"doc_name": doc_name, "row_id": row_id, "main_id": main_id};
        $.ajax({
            url: $SCRIPT_ROOT + "/grab_chunk_with_row",
            contentType : 'application/json',
            type : 'POST',
            data: JSON.stringify(data_dict),
            success: function (data) {
                $("#loading-message").css("display", "none");
                $("#reload-message").css("display", "none");
                $("#outer-container").css("display", "block");
                $("#table-area").css("display", "block");
                tableObject.initialize_table(data);
                var tr_element = $("#table-area tbody")[0].rows[data.actual_row];
                scrollIntoView(tr_element, $("#table-area tbody"));
                $(tr_element).addClass("selected-row");
                self.active_row = data.actual_row;
                set_visible_doc(doc_name, null)
            }
        })
    }

}

function broadcast_event_to_server(event_name, data_dict, callback) {
    data_dict.main_id = main_id;
    data_dict.doc_name = tableObject.current_spec.doc_name;
    data_dict.active_row_index = tableObject.active_row;
    if (arguments.length == 2) {
        $.ajax({
            url: $SCRIPT_ROOT + "/distribute_events/" + event_name,
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(data_dict)
        });
    }
    else {
        $.ajax({
            url: $SCRIPT_ROOT + "/distribute_events/" + event_name,
            contentType: 'application/json',
            type: 'POST',
            data: JSON.stringify(data_dict),
            success: callback
        });
    }
}

function removeMainwindow() {
    $.getJSON($SCRIPT_ROOT + "/remove_mainwindow/" + String(main_id))
}

spinner_html = '<span class="loader-small"></span>';


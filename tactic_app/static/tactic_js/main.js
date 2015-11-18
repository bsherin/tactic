var socket;
var console_visible;

function initializeConsole() {
    saved_console_size = 150;
    var pan = $("#console-panel");
    $("#console").fadeOut();
    var hheight = $("#console-heading").outerHeight();
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

function start_post_load() {
    //spinner = new Spinner({scale: 1.0}).spin();
    //$("#loading-message").html(spinner.el);
    $("#outer-container").css({"margin-left": String(MARGIN_SIZE) + "px"});
    $("#outer-container").css({"margin-right": String(MARGIN_SIZE) + "px"});
    $("#outer-container").css({"margin-top": "0px", "margin-bottom": "0px"});
    initializeConsole();
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
    if (_project_name != "") {
        $.getJSON($SCRIPT_ROOT + "/grab_project_data/" + String(main_id) + "/" + String(doc_names[0]), function(data) {
                $("#loading-message").css("display", "none");
                $("#reload-message").css("display", "none");
                $("#outer-container").css("display", "block");
                $("#table-area").css("display", "block");
                tablespec_dict = {};
                for (spec in data.tablespec_dict) {
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
                    for (var i = 0; i < tile_ids.length; ++i) {
                        create_tile_from_save(tile_ids[i])
                    }
                    menus["Project"].enable_menu_item("save");
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
        forceHelperSize: true
    });

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
    socket.on('close-user-windows', function(data){
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

function change_doc(el) {
    $("#table-area").css("display", "none");
    $("#reload-message").css("display", "block");
    doc_name = $(el).val();
    $.getJSON($SCRIPT_ROOT + "/grab_data/" + String(main_id) + "/" + String(doc_name), function (data) {
            $("#loading-message").css("display", "none");
            $("#reload-message").css("display", "none");
            $("#outer-container").css("display", "block");
            $("#table-area").css("display", "block");
            tableObject.initialize_table(data);
            set_visible_doc(doc_name, null)
        })
}

function broadcast_event_to_server(event_name, data_dict) {
    data_dict.main_id = main_id;
    data_dict.doc_name = tableObject.current_spec.doc_name;
    data_dict.active_row_index = tableObject.active_row;
    $.ajax({
        url: $SCRIPT_ROOT + "/distribute_events/" + event_name,
        contentType : 'application/json',
        type : 'POST',
        data: JSON.stringify(data_dict)
    });
}

spinner_html = '<span class="loader-small"></span>';


var socket;

function start_post_load() {
    $.getJSON($SCRIPT_ROOT + "/get_additional_params", function (data) {
        tile_types = data.tile_types;
        build_menu_objects();
        render_menus();
    });
    if (_project_name == "") {
        $.getJSON($SCRIPT_ROOT + "/grab_data/" + String(main_id), load_stub);
    }
    else {
        $.getJSON($SCRIPT_ROOT + "/grab_project_data/" + String(main_id), load_project_stub)
    }
    $("#tile-div").sortable({
        handle: '.panel-heading',
        tolerance: 'pointer',
        revert: 'invalid',
        forceHelperSize: true
    });
    socket = io.connect('http://' + document.domain + ':' + location.port + '/main');
    socket.emit('join', {"room": user_id});
    socket.emit('join', {"room": main_id});
    socket.on('tile-message', function (data) {
        tile_dict[data.tile_id][data.message](data)
    });
}
function load_stub(data_object) {
    tableObject.load_data(data_object);
}

function load_project_stub(data_object) {
    tableObject.load_data(data_object);
    var tile_ids = data_object.tile_ids;
    for (var i = 0; i < tile_ids.length; ++i) {
        create_tile_from_save(tile_ids[i])
    }
}

function resize_stub(data_object) {
    tableObject.resize_table_area()
    $("#tile-area").height(window.innerHeight - 80 - $("#tile-area").offset().top);
}

function save_project() {
    var result_dict = {
        //"project_name": _project_name,
        //"data_collection_name": _collection_name,
        "main_id": main_id,
        "hidden_list": tableObject.hidden_list,
        "header_struct": tableObject.header_struct
    };
    $.ajax({
        url: $SCRIPT_ROOT + "/update_project",
        contentType : 'application/json',
        type : 'POST',
        async: false,
        data: JSON.stringify(result_dict),
        dataType: 'json',
        success: doFlash
    });
}

function save_project_as() {
    _project_name = $("#project-name-modal-field").val();
    var result_dict = {
        "project_name": _project_name,
        //"data_collection_name": _collection_name,
        "main_id": main_id,
        "hidden_list": tableObject.hidden_list,
        "header_struct": tableObject.header_struct
    };
    $.ajax({
        url: $SCRIPT_ROOT + "/save_new_project",
        contentType : 'application/json',
        type : 'POST',
        async: true,
        data: JSON.stringify(result_dict),
        dataType: 'json',
        success: save_as_success
    });
    $('#save-project-modal').modal('hide')
}

function save_as_success(data_object) {
    menus["Project"].enable_menu_item("menu-save");
    doFlash(data_object)
}


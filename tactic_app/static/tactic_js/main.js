var socket;

function start_post_load() {
    $.getJSON($SCRIPT_ROOT + "/get_additional_params", function (data){
        tile_types = data.tile_types;
        build_menu_objects();
        render_menus();
    });
    if (_project_name == "") {
        $.getJSON($SCRIPT_ROOT + "/grab_data/" + String(_collection_name), load_stub);
    }
    else {
        $.getJSON($SCRIPT_ROOT + "/grab_project_data/" + String(_project_name), load_stub)
    }
    $("#tile-div").sortable({
        handle: '.panel-heading',
        tolerance: 'pointer',
        revert: 'invalid',
        forceHelperSize: true
    });
    socket = io.connect('http://'+document.domain + ':' + location.port  + '/main');
    socket.emit('join', {"room":  user_id});
    socket.emit('join', {"room":  main_id});
    socket.on('update-tile', function(data) {
        initiate_tile_refresh(data["tile_id"])
    });
    socket.on('push-direct-update', function(data) {
        refreshTileContent(data)
    });
}

function load_stub(data_object) {
    tableObject.load_data(data_object)
}

function resize_stub(data_object) {
    tableObject.resize_table_area()
}

function save_project() {
    var result_dict = {
        "project_name": _project_name,
        "data_collection_name": _collection_name,
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
        "data_collection_name": _collection_name,
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

function show_the_modal() {
    $('#save-project-modal').modal();
}



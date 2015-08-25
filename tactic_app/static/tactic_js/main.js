var socket;

function start_post_load() {
    $.getJSON($SCRIPT_ROOT + "/get_additional_params", function (data) {
        tile_types = data.tile_types;
        build_and_render_menu_objects();
    });
    if (_project_name == "") {
        $.getJSON($SCRIPT_ROOT + "/grab_data/" + String(main_id), function (data) {
            tableObject.load_data(data)
        })
    }
    else {
        $.getJSON($SCRIPT_ROOT + "/grab_project_data/" + String(main_id), function(data) {
            tableObject.load_data(data);
            var tile_ids = data.tile_ids;
            for (var i = 0; i < tile_ids.length; ++i) {
                create_tile_from_save(tile_ids[i])
            }
        })
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



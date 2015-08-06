
function create_new_tile(menu_id) {
    data_dict = {}
    data_dict["main_id"] = main_id;
    $.ajax({
        url: $SCRIPT_ROOT + "/create_tile/" + String(menu_id),
        contentType : 'application/json',
        type : 'POST',
        data: JSON.stringify(data_dict),
        dataType: 'json',
        success: function (data) {
            $("#tile-div").append(data.html);
            $("#tile_body_" + data.tile_id).flip({
                "trigger": "manual",
                "autoSize": false,
                "forceWidth": true,
                "forceHeight": true
            });
            $("#tile_id_" + data.tile_id).resizable({
                handles: "se",
                resize: resize_tile_area
            });
        }
    })
}

function resize_tile_area(event, ui) {
    var header_element = ui.element.children(".panel-heading")[0];
    var hheight = $(header_element).outerHeight();
    var front_element = ui.element.find(".front")[0];
    $(front_element).outerHeight(ui.size.height - hheight);
    $(front_element).outerWidth(ui.size.width);
    var back_element = ui.element.find(".back")[0];
    $(back_element).outerHeight(ui.size.height - hheight);
    $(back_element).outerWidth(ui.size.width)
}

function create_tile_relevant_event(event_name, data_dict){
    data_dict["main_id"] = main_id
    $.ajax({
        url: $SCRIPT_ROOT + "/tile_relevant_event/" + event_name,
        contentType : 'application/json',
        type : 'POST',
        data: JSON.stringify(data_dict)
    });
}

function initiate_tile_refresh(tile_id) {
    data_dict["main_id"] = main_id
    $.ajax({
        url: $SCRIPT_ROOT + "/get_tile_content/" + String(tile_id),
        contentType : 'application/json',
        type : 'POST',
        data: JSON.stringify(data_dict),
        success: refreshTileContent
    });
}

function submitOptions(tile_id){
    var data = {};
    data["main_id"] = main_id;
    $("#tile_id_" + tile_id + " input").each(function () {
            data[$(this).attr('id')] = $(this).val()
        }
    );
    $.ajax({
        url: $SCRIPT_ROOT + "/submit_options/" + tile_id,
        contentType : 'application/json',
        type : 'POST',
        async: false,
        data: JSON.stringify(data),
        dataType: 'json',
        success: refreshTileContent
    });
}

function refreshTileContent(data) {
    $("#tile_id_" + data.tile_id + " .front").html(data["html"])
    $("#tile_body_" + data.tile_id).flip(false)
}

function closeMe(tile_id){
    $('#tile_id_' + tile_id).remove();
}

function flipMe(tile_id){
    $("#tile_body_" + tile_id).flip('toggle');
}
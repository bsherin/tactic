__author__ = 'bls910'
function closeMe(tile_id){
    $('#tile_id_' + tile_id).remove();
}

function flipMe(tile_id){
    $("#tile_body_" + tile_id).flip('toggle');
}

function submitOptions(tile_id){
    var data = {};
    $("#tile_id_" + tile_id + " input").each(function () {
            data[$(this).attr('id')] = $(this).val()
        }
    )
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


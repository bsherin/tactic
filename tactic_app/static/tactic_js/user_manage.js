/**
 * Created by bls910 on 7/18/15.
 */

function start_post_load() {
    socket = io.connect('http://'+document.domain + ':' + location.port  + '/user_manage');
    socket.emit('join', {"user_id":  user_id});
    socket.on('update-project-list', function(data) {
        $("#project-selector").html(data.html)
    });
    socket.on('update-collection-list', function(data) {
        $("#collection-selector").html(data.html)
    });
    socket.on('update-list-list', function(data) {
        $("#list-selector").html(data.html)
    });
    socket.on('update-tile-list', function(data) {
        $("#tile-selector").html(data.html)
    });
    socket.on('close-user-windows', function(data){
        window.close()
    })
}

// We want to catch the submit for the various file uploaders to
// send via ajax
$('#list-load-form').submit(function(e) {
    $.ajax( {
      url: $SCRIPT_ROOT + '/add_list',
      type: 'POST',
      data: new FormData( this ),
      processData: false,
      contentType: false
    } );
    e.preventDefault();
  } );

$('#tile-load-form').submit(function(e) {
    $.ajax( {
      url: $SCRIPT_ROOT + '/add_tile',
      type: 'POST',
      data: new FormData( this ),
      processData: false,
      contentType: false
    } );
    e.preventDefault();
  } );

$('#collection-load-form').submit(function(e) {
    var fdata = new FormData( this )
    $('#name-collection-modal').modal();
    $("#create-button").unbind(); // Remove previous bindings to the create button.
    $("#create-button").click(createIt);
    e.preventDefault();

    function createIt() {
        name = $("#new-collection-name-modal-field").val();
        $.ajax({
            url: $SCRIPT_ROOT + '/load_files/' + name,
            type: 'POST',
            data: fdata,
            processData: false,
            contentType: false,
            success: file_load_response
        })
        $('#name-collection-modal').modal('hide')
    }

  })

function file_load_response(data) {
    doFlash(data)
}

function view_selected_list() {
    var list_name = $('#list-selector > .btn.active').text().trim();
    if (list_name == "") {
        doFlash({"message": "Selection a tile first.", "alert_type": "alert-info"})
        return
    }
    window.open($SCRIPT_ROOT + "/view_list/" + String(list_name))
}

function load_selected_tile() {
    var tile_name = $('#tile-selector > .btn.active').text().trim();
    if (tile_name == "") {
        doFlash({"message": "Select a tile first.", "alert_type": "alert-info"})
        return
    }
    $.getJSON($SCRIPT_ROOT + '/load_tile/' + tile_name)
}

function load_selected_collection() {
    var collection_name = $('#collection-selector > .btn.active').text().trim();
    if (collection_name == "") {
        doFlash({"message": "Selection a data collection first.", "alert_type": "alert-info"})
        return
    }
    window.open($SCRIPT_ROOT + "/main/" + collection_name)
}
function load_selected_project() {
    var project_name = $('#project-selector > .btn.active').text().trim();
    if (project_name == "") {
        doFlash({"message": "Selection a project first.", "alert_type": "alert-info"})
        return
    }
    window.open($SCRIPT_ROOT + "/main_project/" + project_name)
}

function delete_selected_collection() {
    var collection_name = $('#collection-selector > .btn.active').text().trim();
    if (collection_name == "") {
        doFlash({"message": "Select a data collection first.", "alert_type": "alert-info"})
        return
    }
    $.post($SCRIPT_ROOT + "/delete_collection/" + String(collection_name))
}

function delete_selected_project() {
    var project_name = $('#project-selector > .btn.active').text().trim();
    if (project_name == "") {
        doFlash({"message": "Select a project first.", "alert_type": "alert-info"})
        return
    }
    $.post($SCRIPT_ROOT + "/delete_project/" + String(project_name))
}

function delete_selected_list() {
    var list_name = $('#list-selector > .btn.active').text().trim();
    if (list_name == "") {
        doFlash({"message": "Select a list first.", "alert_type": "alert-info"})
        return
    }
    $.post($SCRIPT_ROOT + "/delete_list/" + String(list_name))
}

function delete_selected_tile() {
    var tile_name = $('#tile-selector > .btn.active').text().trim();
    if (tile_name == "") {
        doFlash({"message": "Select a tile first.", "alert_type": "alert-info"})
        return
    }
    $.post($SCRIPT_ROOT + "/delete_tile/" + String(tile_name))
}

function show_duplicate_list_modal() {
    var list_name = $('#list-selector > .btn.active').text().trim();
    if (list_name == "") {
        doFlash({"message": "Select a list first.", "alert_type": "alert-info"})
        return
    }
    $('#duplicate-list-modal').modal();
}

function show_duplicate_collection_modal() {
    var collection_name = $('#collection-selector > .btn.active').text().trim();
    if (collection_name == "") {
        doFlash({"message": "Selection a data collection first.", "alert_type": "alert-info"})
        return
    }
    $('#duplicate-collection-modal').modal();
}

function create_duplicate_collection() {
    var collection_to_copy = $('#collection-selector > .btn.active').text().trim();
    var new_collection_name = $("#collection-name-modal-field").val();
    var result_dict = {
        "new_collection_name": new_collection_name,
        "collection_to_copy": collection_to_copy,
    };
    $.ajax({
        url: $SCRIPT_ROOT + "/duplicate_collection",
        contentType : 'application/json',
        type : 'POST',
        async: true,
        data: JSON.stringify(result_dict),
        dataType: 'json',
    });
    $('#duplicate-collection-modal').modal('hide')
}

function create_duplicate_list() {
    var list_to_copy = $('#list-selector > .btn.active').text().trim();
    var new_list_name = $("#list-name-modal-field").val();
    var result_dict = {
        "new_list_name": new_list_name,
        "list_to_copy": list_to_copy,
    };
    $.ajax({
        url: $SCRIPT_ROOT + "/create_duplicate_list",
        contentType : 'application/json',
        type : 'POST',
        async: true,
        data: JSON.stringify(result_dict),
        dataType: 'json',
    });
    $('#duplicate-list-modal').modal('hide')
}


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

$('#collection-load-form').submit(function(e) {
    $.ajax( {
      url: $SCRIPT_ROOT + '/load_single_file',
      type: 'POST',
      data: new FormData( this ),
      processData: false,
      contentType: false
    } );
    e.preventDefault();
  } );


function view_selected_list() {
    var list_name = $('#list-selector > .btn.active').text().trim();
    window.open($SCRIPT_ROOT + "/view_list/" + String(list_name))
}

function load_selected_collection() {
    var collection_name = $('#collection-selector > .btn.active').text().trim();
    window.open($SCRIPT_ROOT + "/main/" + collection_name)
}
function load_selected_project() {
    var project_name = $('#project-selector > .btn.active').text().trim();
    window.open($SCRIPT_ROOT + "/main_project/" + project_name)
}

function delete_selected_collection() {
    var collection_name = $('#collection-selector > .btn.active').text().trim();
    $.post($SCRIPT_ROOT + "/delete_collection/" + String(collection_name))
}

function delete_selected_project() {
    var project_name = $('#project-selector > .btn.active').text().trim();
    $.post($SCRIPT_ROOT + "/delete_project/" + String(project_name))
}

function delete_selected_list() {
    var list_name = $('#list-selector > .btn.active').text().trim();
    $.post($SCRIPT_ROOT + "/delete_list/" + String(list_name))
}


function show_duplicate_list_modal() {
    $('#duplicate-list-modal').modal();
}

function show_duplicate_collection_modal() {
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


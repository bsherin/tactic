/**
 * Created by bls910 on 7/18/15.
 */

function start_post_load() {
    socket = io.connect('http://'+document.domain + ':' + location.port  + '/user_manage');
    socket.emit('join', {"user_id":  user_id});
    socket.on('update-project-list', update_project_list);
    socket.on('update-collection-list', update_collection_list);
    socket.on('update-list-list', update_list_list);
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
      url: $SCRIPT_ROOT + '/add_file_as_collection',
      type: 'POST',
      data: new FormData( this ),
      processData: false,
      contentType: false
    } );
    e.preventDefault();
  } );

function update_project_list() {
    $("#project-selector").load($SCRIPT_ROOT + "/update_projects")
}

function update_collection_list() {
    $("#collection-selector").load($SCRIPT_ROOT + "/update_collections")
}

function update_list_list() {
    $("#list-selector").load($SCRIPT_ROOT + "/update_lists")
}

function load_selected_collection() {
    var collection_name = $('#collection-selector > .btn.active').text().trim();
    window.open($SCRIPT_ROOT + "/main/" + collection_name)
}

function delete_selected_collection() {
    var collection_name = $('#collection-selector > .btn.active').text().trim();
    $.post($SCRIPT_ROOT + "/delete_collection/" + String(collection_name))
}

function load_selected_project() {
    var project_name = $('#project-selector > .btn.active').text().trim();
    window.open($SCRIPT_ROOT + "/main_project/" + project_name)
}

function delete_selected_project() {
    var project_name = $('#project-selector > .btn.active').text().trim();
    $.post($SCRIPT_ROOT + "/delete_project/" + String(project_name))
}

function delete_selected_list() {
    var list_name = $('#list-selector > .btn.active').text().trim();
    $.post($SCRIPT_ROOT + "/delete_list/" + String(list_name))
}

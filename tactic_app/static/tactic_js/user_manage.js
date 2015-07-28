/**
 * Created by bls910 on 7/18/15.
 */

function start_post_load() {
    socket = io.connect('http://'+document.domain + ':' + location.port  + '/user_manage');
    socket.emit('join', {"user_id":  user_id});
    socket.on('update-project-list', update_project_list);
    socket.on('update-collection-list', update_collection_list);
}

function update_project_list() {
    $("#project-selector").load($SCRIPT_ROOT + "/update_projects")
}

function update_collection_list() {
    $("#collection-selector").load($SCRIPT_ROOT + "/update_collections")
}

function load_selected_collection() {
    var collection_name = $('#collection-selector > .btn.active').text().trim();
    window.open($SCRIPT_ROOT + "/main/" + collection_name)
}

function delete_selected_collection() {
    var collection_name = $('#collection-selector > .btn.active').text().trim();
    $.post($SCRIPT_ROOT + "/delete_collection/" + String(collection_name))
    //$("#collection-selector").load($SCRIPT_ROOT + "/delete_collection/" + String(collection_name))
}

function load_selected_project() {
    var project_name = $('#project-selector > .btn.active').text().trim();
    window.open($SCRIPT_ROOT + "/main_project/" + project_name)
}

function delete_selected_project() {
    var project_name = $('#project-selector > .btn.active').text().trim();
    $.post($SCRIPT_ROOT + "/delete_project/" + String(project_name))
    //$("#project-selector").load($SCRIPT_ROOT + "/delete_project/" + String(project_name))
}

/**
 * Created by bls910 on 7/18/15.
 */

function load_selected_collection() {
    var collection_name = $('#collection-selector > .btn.active').text().trim();
    window.open("/main/" + collection_name)
}

function delete_selected_collection() {
    var collection_name = $('#collection-selector > .btn.active').text().trim();
    $("#collection-selector").load("/delete_collection/" + String(collection_name))
}


function load_selected_project() {
    var project_name = $('#project-selector > .btn.active').text().trim();
    window.open("/main_project/" + project_name)
}

function delete_selected_project() {
    var project_name = $('#project-selector > .btn.active').text().trim();
    $("#project-selector").load("/delete_project/" + String(project_name))
}

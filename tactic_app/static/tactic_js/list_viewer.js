

var mousetrap = new Mousetrap();
var savedList = null;
var savedTags = null;
var savedNotes = null;

mousetrap.bind("esc", function() {
    clearStatusArea();
});

mousetrap.bind(['command+s', 'ctrl+s'], function(e) {
    updateList();
    e.preventDefault()
});


function start_post_load() {
    var listarea = document.getElementById("listarea");

    $("#listarea").css('height', window.innerHeight - $("#listarea").offset().top - 40);
    saveList = the_list_as_string;

    var result_dict = {"res_type": "list", "res_name": list_name};
    postAjax("grab_metadata", result_dict, got_metadata);
    function got_metadata(data) {
        if (data.success) {
            $(".created").html(data.datestring);
            $("#list-tags")[0].value = data.tags;
            $("#list-notes")[0].value = data.notes;
            savedTags = data.tags;
            savedNotes = data.notes
        }
        else {
            // doFlash(data)
            $(".created").html("");
            $("#list-tags")[0].value = "";
            $("#list-tags").html("");
            $("#list-notes")[0].value = "";
            $("#list-notes").html("");
        }
    }
}

function dirty() {
    var the_list_as_string = listarea.value;
    var tags = $("#list-tags").val();
    var notes = $("#list-notes").val();
    if ((the_list_as_string == savedList) && (tags == savedTags) && (notes == savedNotes)) {
        return false
    }
    else {
        return true
    }
}

function renameList() {
    console.log("entering rename")
    $.getJSON($SCRIPT_ROOT + "get_resource_names/list", function(data) {
        var list_names = data["resource_names"];
        var index = list_names.indexOf(list_name);
        if (index >= 0) {
          list_names.splice(index, 1);
        }
        showModal("Rename List", "Name for this list", RenameListResource, list_name, list_names)
    }
    );
    function RenameListResource(new_name) {
        var the_data = {"new_name": new_name};
        postAjax("rename_list/" + list_name, the_data, renameSuccess);
        function renameSuccess(data) {
            if (data.success) {
                list_name = new_name;
                $("#list-name").text(list_name)
            }
            else {
                doFlash(data)
            }

        }
    }
}

function updateList() {
    var new_list_as_string = listarea.value;
    var tags = $("#list-tags").val();
    var notes = $("#list-notes").val();
    var result_dict = {
        "list_name": list_name,
        "new_list_as_string": new_list_as_string,
        "tags": tags,
        "notes": notes
        };
    postAjax("update_list", result_dict, update_success);
    function update_success(data) {
        if (data.success) {
            savedList = new_list_as_string;
            savedTags = tags;
            savedNotes = notes;
            data.timeout = 2000;
        }
        doFlash(data)
    }
}

function saveListAs() {
    doFlash({"message": "not implemented yet"})
}

function copyToLibrary() {
    $.getJSON($SCRIPT_ROOT + "get_resource_names/list", function(data) {
        showModal("Import list", "New list Name", ImportListResource, list_name, data["resource_names"])
        }
    );
    function ImportListResource(new_name) {
        var result_dict = {
            "res_type": "list",
            "res_name": list_name,
            "new_res_name": new_name
        };
        postAjax("copy_from_repository", result_dict, doFlashAlways);
    }
}

function sendToRepository() {
    $.getJSON($SCRIPT_ROOT + "get_repository_resource_names/list", function(data) {
        showModal("Share list", "New list Name", ShareListResource, list_name, data["resource_names"])
        }
    );
    function ShareListResource(new_name) {
        var result_dict = {
            "res_type": "list",
            "res_name": list_name,
            "new_res_name": new_name
        };
        postAjax("send_to_repository", result_dict, doFlashAlways)
    }
}
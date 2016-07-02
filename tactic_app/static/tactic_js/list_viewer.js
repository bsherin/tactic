

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
    $.ajax({
            url: $SCRIPT_ROOT + "/grab_metadata",
            contentType : 'application/json',
            type : 'POST',
            async: true,
            data: JSON.stringify(result_dict),
            dataType: 'json',
            success: got_metadata
    });
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
    showModal("Rename list", "Name for this list", function (new_name) {
        the_data = {"new_name": new_name};
        $.ajax({
            url: $SCRIPT_ROOT + "/rename_module/" + module_name,
            contentType : 'application/json',
            type : 'POST',
            async: true,
            data: JSON.stringify(the_data),
            dataType: 'json',
            success: renameSuccess
        });
        function renameSuccess(data) {
            if (data.success) {
                module_name = new_name;
                $("#module-name").text(module_name)
            }
            else {
                doFlash(data)
            }

        }
    });
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
    $.ajax({
        url: $SCRIPT_ROOT + "/update_list",
        contentType : 'application/json',
        type : 'POST',
        async: true,
        data: JSON.stringify(result_dict),
        dataType: 'json',
        success: update_success
    });
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
    showModal("Import list", "New list Name", function (new_name) {
        var result_dict = {
            "res_type": "list",
            "res_name": list_name,
            "new_res_name": new_name
        };

        $.ajax({
            url: $SCRIPT_ROOT + 'copy_from_repository',
            contentType: 'application/json',
            type: 'POST',
            async: true,
            data: JSON.stringify(result_dict),
            dataType: 'json',
            success: doFlash
        });
    });
}
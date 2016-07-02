/**
 * Created by bls910 on 10/4/15.
 */

var current_theme = "default";
var mousetrap = new Mousetrap();
var myCodeMirror;
var savedCode = null;
var savedTags = null;
var savedNotes = null;

mousetrap.bind("esc", function() {
    clearStatusArea();
});

mousetrap.bind(['command+s', 'ctrl+s'], function(e) {
    updateModule();
    e.preventDefault()
});

mousetrap.bind(['command+l', 'ctrl+;l'], function(e) {
    loadModule();
    e.preventDefault()
});

function start_post_load() {
    var codearea = document.getElementById("codearea");
    myCodeMirror = CodeMirror.fromTextArea(codearea, {
        lineNumbers: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        indentUnit: 4,
        readOnly: view_only
    });
    myCodeMirror.setOption("extraKeys", {
      Tab: function(cm) {
        var spaces = Array(5).join(" ");
        cm.replaceSelection(spaces);
      }
    });
    $(".CodeMirror").css('height', window.innerHeight - $(".CodeMirror").offset().top - 20);
    savedCode = myCodeMirror.getValue();

    var result_dict = {"res_type": "tile", "res_name": module_name};
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
            $("#tile-module .created").html(data.datestring);
            $("#tile-tags")[0].value = data.tags;
            $("#tile-notes")[0].value = data.notes;
            savedTags = data.tags;
            savedNotes = data.notes
        }
        else {
            // doFlash(data)
            $("#tile-module .created").html("");
            $("#tile-tags")[0].value = "";
            $("#tile-tags").html("");
            $("#tile-notes")[0].value = "";
            $("#tile-notes").html("");
        }
    }
}

function dirty() {
    var the_code = myCodeMirror.getValue();
    var tags = $("#tile-tags").val();
    var notes = $("#tile-notes").val();
    if ((the_code == savedCode) && (tags == savedTags) && (notes == savedNotes)) {
        return false
    }
    else {
        return true
    }
}

function changeTheme() {
    if (current_theme == "default") {
        myCodeMirror.setOption("theme", "pastel-on-dark");
        document.body.style.backgroundColor = "grey";
        current_theme = "dark"
    }
    else {
        myCodeMirror.setOption("theme", "default");
        document.body.style.backgroundColor = "white";
        current_theme = "default"
    }
}

function renameModule() {
    console.log("entering rename")
    showModal("Rename module", "Name for this module", function (new_name) {
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

function updateModule() {
    var new_code = myCodeMirror.getValue();
    var tags = $("#tile-tags").val();
    var notes = $("#tile-notes").val();
    var result_dict = {
        "module_name": module_name,
        "new_code": new_code,
        "tags": tags,
        "notes": notes
        };
    $.ajax({
        url: $SCRIPT_ROOT + "/update_module",
        contentType : 'application/json',
        type : 'POST',
        async: true,
        data: JSON.stringify(result_dict),
        dataType: 'json',
        success: update_success
    });
    function update_success(data) {
        if (data.success) {
            savedCode = new_code;
            savedTags = tags;
            savedNotes = notes;
            data.timeout = 2000;
        }
        doFlash(data)
    }
}

function loadModule() {
    var new_code = myCodeMirror.getValue();
    var tags = $("#tile-tags").val();
    var notes = $("#tile-notes").val();
    var result_dict = {
        "module_name": module_name,
        "new_code": new_code,
        "tags": tags,
        "notes": notes
        };
    $.ajax({
        url: $SCRIPT_ROOT + "/update_module",
        contentType : 'application/json',
        type : 'POST',
        async: true,
        data: JSON.stringify(result_dict),
        dataType: 'json',
        success: function (data) {
            if (data.success) {
                savedCode = new_code;
                savedTags = tags;
                savedNotes = notes;
                data.timeout = 2000;
                $.getJSON($SCRIPT_ROOT + '/load_tile_module/' + String(module_name), load_success)
            }
            else {
                doFlash(data)
            }
        }

    });
    function load_success(data) {
        if (data.success) {
            data.timeout = 2000;
        }
        doFlash(data)
    }
}

function saveModuleAs() {
    doFlash({"message": "not implemented yet"})
}

function copyToLibrary() {
    showModal("Import tile", "New tile Name", function (new_name) {
        var result_dict = {
            "res_type": "tile",
            "res_name": module_name,
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
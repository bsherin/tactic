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
    updateCode();
    e.preventDefault()
});


function start_post_load() {
    var codearea = document.getElementById("codearea");
    myCodeMirror = CodeMirror.fromTextArea(codearea, {
        lineNumbers: true,
        matchBrackets: true,
        highlightSelectionMatches: true,
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
    resize_dom_to_bottom_given_selector(".CodeMirror", 20);
    savedCode = myCodeMirror.getDoc().getValue();

    var result_dict = {"res_type": "code", "res_name": code_name};
    postAjax("grab_metadata", result_dict, got_metadata);
    function got_metadata(data) {
        if (data.success) {
            $(".created").html(data.datestring);
            $("#code-tags")[0].value = data.tags;
            $("#code-notes")[0].value = data.notes;
            savedTags = data.tags;
            savedNotes = data.notes
        }
        else {
            // doFlash(data)
            $(".created").html("");
            $("#code-tags")[0].value = "";
            $("#code-tags").html("");
            $("#code-notes")[0].value = "";
            $("#code-notes").html("");
        }
    }
}

function dirty() {
    var the_code = myCodeMirror.getDoc().getValue();
    var tags = $("#code-tags").val();
    var notes = $("#code-notes").val();
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

function renameCode() {
    console.log("entering rename");
    $.getJSON($SCRIPT_ROOT + "get_resource_names/code", function(data) {
            code_names = data["resource_names"];
            var index = code_names.indexOf(code_name);
            if (index >= 0) {
              code_names.splice(index, 1);
            }
            showModal("Rename code resource", "Name for this code resource", RenameCodeResource, code_name, code_names)
        }
    );
    function RenameCodeResource (new_name) {
        the_data = {"new_name": new_name};
        postAjax("rename_code/" + code_name, the_data, renameSuccess);
        function renameSuccess(data) {
            if (data.success) {
                code_name = new_name;
                $("#code-name").text(code_name)
            }
            else {
                doFlash(data)
            }

        }
    }
}

function updateCode() {
    var new_code = myCodeMirror.getDoc().getValue();
    var tags = $("#code-tags").val();
    var notes = $("#code-notes").val();
    var result_dict = {
        "code_name": code_name,
        "new_code": new_code,
        "tags": tags,
        "notes": notes
        };
    postAjax("update_code", result_dict, update_success);
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

function saveCodeAs() {
    doFlash({"message": "not implemented yet"})
}

function copyToLibrary() {
    $.getJSON($SCRIPT_ROOT + "get_resource_names/code", function(data) {
            showModal("Import code resource", "New Code Resource Name", ImportCodeResource, code_name, data["resource_names"])
        }
    );
    function ImportCodeResource (new_name) {
        var result_dict = {
            "res_type": "code",
            "res_name": code_name,
            "new_res_name": new_name
        };
        postAjax("copy_from_repository", result_dict, doFlashAlways)
    }
}

function sendToRepository() {   // tactic change sendtorepository code
    $.getJSON($SCRIPT_ROOT + "get_repository_resource_names/code", function (data) {
            showModal("Share code resource", "New Code Resource Name", ShareCodeResource, code_name, data["resource_names"])
        }
    );
    function ShareCodeResource(new_name) {
        var result_dict = {
            "res_type": "code",
            "res_name": code_name,
            "new_res_name": new_name
        };
        postAjax("send_to_repository", result_dict, doFlashAlways)
    }
}
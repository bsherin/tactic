/**
 * Created by bls910 on 10/4/15.
 */
// tactic_document code_viewer
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
    savedCode = myCodeMirror.getDoc().getValue();

    var result_dict = {"res_type": "code", "res_name": code_name};
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
    console.log("entering rename")
    showModal("Rename code resource", "Name for this code resource", function (new_name) {
        the_data = {"new_name": new_name};
        $.ajax({
            url: $SCRIPT_ROOT + "/rename_code/" + code_name,
            contentType : 'application/json',
            type : 'POST',
            async: true,
            data: JSON.stringify(the_data),
            dataType: 'json',
            success: renameSuccess
        });
        function renameSuccess(data) {
            if (data.success) {
                code_name = new_name;
                $("#code-name").text(code_name)
            }
            else {
                doFlash(data)
            }

        }
    });
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
    $.ajax({
        url: $SCRIPT_ROOT + "/update_code",
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

function saveCodeAs() {
    doFlash({"message": "not implemented yet"})
}

function copyToLibrary() {
    showModal("Import code resource", "New code resource name", function (new_name) {
        var result_dict = {
            "res_type": "code",
            "res_name": code_name,
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
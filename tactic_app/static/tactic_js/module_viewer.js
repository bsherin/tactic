/**
 * Created by bls910 on 10/4/15.
 */

var current_theme = "default";
var mousetrap = new Mousetrap();

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
    codearea = document.getElementById("codearea");
    myCodeMirror = CodeMirror.fromTextArea(codearea, {
        lineNumbers: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        indentUnit: 4
    });
    myCodeMirror.setOption("extraKeys", {
      Tab: function(cm) {
        var spaces = Array(5).join(" ");
        cm.replaceSelection(spaces);
      }
    });
    $(".CodeMirror").css('height', window.innerHeight - $(".CodeMirror").offset().top - 20)

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
            $("#tile-module .created").html(data.datestring)
            $("#tile-tags")[0].value = data.tags;
            $("#tile-notes")[0].value = data.notes;
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

function updateModule() {
    var new_code = myCodeMirror.getValue();
    var tags = $("#tile-tags").val();
    var notes = $("#tile-notes").val()
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
        success: doFlash
    });
}

function loadModule() {
    var new_code = myCodeMirror.getValue();
    var tags = $("#tile-tags").val();
    var notes = $("#tile-notes").val()
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
        success: function () {
            $.getJSON($SCRIPT_ROOT + '/load_tile_module/' + String(module_name), success=doFlash)
        }
    });
}

function saveModuleAs() {
    doFlash({"message": "not implemented yet"})
}
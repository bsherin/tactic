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
    var result_dict = {
    "module_name": module_name,
    "new_code": new_code
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
    var result_dict = {
    "module_name": module_name,
    "new_code": new_code
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
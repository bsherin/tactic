/**
 * Created by bls910 on 10/4/15.
 */

function start_post_load() {
    codearea = document.getElementById("codearea")
    myCodeMirror = CodeMirror.fromTextArea(codearea, {
        lineNumbers: true
    });
    myCodeMirror.setOption("extraKeys", {
      Tab: function(cm) {
        var spaces = Array(5).join(" ");
        cm.replaceSelection(spaces);
      }
    });
}

function updateModule() {
    var new_code = myCodeMirror.getValue();
    var result_dict = {
    "module_name": module_name,
    "new_code": new_code,
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
    $.getJSON($SCRIPT_ROOT + '/load_tile_module/' + String(module_name), success=doFlash)
}

function saveModuleAs() {
    doFlash({"message": "not implemented yet"})
}
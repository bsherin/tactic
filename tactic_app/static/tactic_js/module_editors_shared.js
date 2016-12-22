/**
 * Created by parallels on 12/22/16.
 */

var extra_autocomplete_list = [];

var mousetrap = new Mousetrap();
mousetrap.bind("esc", function() {
    clearStatusArea();
});

mousetrap.bind(['command+s', 'ctrl+s'], function(e) {
    updateModule();
    e.preventDefault()
});

mousetrap.bind(['command+l', 'ctrl+l'], function(e) {
    loadModule();
    e.preventDefault()
});

function createCMArea(codearea) {
    cmobject = CodeMirror(codearea, {
        lineNumbers: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        indentUnit: 4,
        readOnly: false
    });
    cmobject.setOption("extraKeys", {
          Tab: function(cm) {
            var spaces = Array(5).join(" ");
            cm.replaceSelection(spaces);
          },
          "Ctrl-Space": "autocomplete"
        });
    return cmobject
}

postAjax("get_api_dict", {}, function (data) {
    api_dict_by_category = data.api_dict_by_category;
    api_dict_by_name = data.api_dict_by_name;
    ordered_api_categories = data.ordered_api_categories;
    var api_list = [];
    ordered_api_categories.forEach(function(cat) {
        api_dict_by_category[cat].forEach(function (entry) {
            api_list.push(entry["name"])
        })
    });
    CodeMirror.commands.autocomplete = function(cm) {
        cm.showHint({hint: CodeMirror.hint.anyword, api_list: api_list,
            extra_autocomplete_list: extra_autocomplete_list});
    };
});

function doSave(update_success) {
    var new_code = myCodeMirror.getDoc().getValue();
    var tags = $("#tile-tags").val();
    var notes = $("#tile-notes").val();
    var result_dict;

    if (this_viewer == "viewer") {
        result_dict = {
            "module_name": module_name,
            "category": category,
            "tags": tags,
            "notes": notes,
            "new_code": new_code,
            "last_saved": this_viewer
        };
    }
    else {
        var category = $("#tile-category").val();
        if (category.length == 0) {
            category = "basic"
        }
        var new_dp_code = "";
        if (is_mpl) {
            new_dp_code = myDPCodeMirror.getDoc().getValue();
        }
        result_dict = {
            "module_name": module_name,
            "category": category,
            "tags": tags,
            "notes": notes,
            "exports": exportManager.export_list,
            "options": optionManager.option_dict,
            "extra_methods": methodManager.get_extra_functions(),
            "render_content_body": new_code,
            "is_mpl": is_mpl,
            "draw_plot_body": new_dp_code,
            "last_saved": this_viewer
        };
    }

    postAjax("update_module", result_dict, success_func);
    function success_func(data) {
        update_success(data, new_code, tags, notes)
    }
}

function updateModule() {
    doSave(update_success);
    function update_success(data, new_code, tags, notes) {
        if (data.success) {
            savedCode = new_code;
            savedTags = tags;
            savedNotes = notes;
            data.timeout = 2000;
            if (this_viewer == "creator"){
                var new_dp_code = "";
                if (is_mpl) {
                    savedDPCode = myDPCodeMirror.getDoc().getValue();
                }
            }
        }
        doFlash(data)
    }
}

function loadModule() {
    doSave(save_success);
    function save_success(data, new_code, tags, notes) {
            if (data.success) {
                savedCode = new_code;
                savedTags = tags;
                savedNotes = notes;
                data.timeout = 2000;
                if (this_viewer == "creator"){
                    var new_dp_code = "";
                    if (is_mpl) {
                        savedDPCode = myDPCodeMirror.getDoc().getValue();
                    }
                }
                $.getJSON($SCRIPT_ROOT + '/load_tile_module/' + String(module_name), load_success)
            }
            else {
                doFlash(data)
            }
    }
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

function showAPI(){
    if (this_viewer == "creator") {
        $("#resource-area").toggle();
    }

    $("#api-area").toggle();
    resize_dom_to_bottom("#api-area", 20);
}

function renameModule() {
    console.log("entering rename");
    $.getJSON($SCRIPT_ROOT + "get_resource_names/tile", function(data) {
            var module_names = data["resource_names"];
            var index = module_names.indexOf(module_name);
            if (index >= 0) {
              module_names.splice(index, 1);
            }
            showModal("Rename Module", "Name for this module", RenameModuleResource, module_name, module_names)
        }
    );
    function RenameModuleResource (new_name) {
        var the_data = {"new_name": new_name};
        postAjax("rename_module/" + module_name, the_data, renameSuccess);
        function renameSuccess(data) {
            if (data.success) {
                module_name = new_name;
                $("#module-name").text(module_name)
            }
            else {
                doFlash(data)
            }

        }
    }
}

function changeTheme() {
    if (current_theme == "default") {
        myCodeMirror.setOption("theme", "pastel-on-dark");
        if (this_viewer == "creator") {
            myDPCodeMirror.setOption("theme", "pastel-on-dark");
        }
        document.body.style.backgroundColor = "grey";
        current_theme = "dark"
    }
    else {
        myCodeMirror.setOption("theme", "default");
        if (this_viewer == "creator") {
            myDPCodeMirror.setOption("theme", "default");
        }
        document.body.style.backgroundColor = "white";
        current_theme = "default"
    }
}

function copyToLibrary() {
    $.getJSON($SCRIPT_ROOT + "get_resource_names/tile", function(data) {
        showModal("Import Tile", "New Tile Name", ImportTileModule, module_name, data["resource_names"])
        }
    );
    function ImportTileModule(new_name) {
        var result_dict = {
            "res_type": "tile",
            "res_name": module_name,
            "new_res_name": new_name
        };
        postAjax("copy_from_repository", result_dict, doFlashAlways);
    }
}

function sendToRepository() { // Note this shares the last saved version
    $.getJSON($SCRIPT_ROOT + "get_repository_resource_names/tile", function(data) {
        showModal("Share tile", "New Tile Name", ShareTileResource, module_name, data["resource_names"])
        }
    );
    function ShareTileResource(new_name) {
        var result_dict = {
            "res_type": "tile",
            "res_name": module_name,
            "new_res_name": new_name
        };
        postAjax("send_to_repository", result_dict, doFlashAlways)
    }
}

function dirty() {
    var the_code = myCodeMirror.getDoc().getValue();
    var tags = $("#tile-tags").val();
    var notes = $("#tile-notes").val();
    if ((this_viewer == "creator") && is_mpl) {
        var dp_code = myDPCodeMirror.getDoc().getValue();
        return !((the_code == savedCode) && (dp_code == savedDPCode) && (tags == savedTags) && (notes == savedNotes));
    }
    else {
        return !((the_code == savedCode) && (tags == savedTags) && (notes == savedNotes));
    }
}
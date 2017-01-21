/**
 * Created by parallels on 12/22/16.
 */

let extra_autocomplete_list = [];
let cmobjects_to_search = [];
let cmobjects = [];

const mousetrap = new Mousetrap();
mousetrap.bind("esc", function() {
    clearStatusArea();
});



postAjax("get_api_dict", {}, function (data) {
    let api_dict_by_category = data.api_dict_by_category;
    let api_dict_by_name = data.api_dict_by_name;
    let ordered_api_categories = data.ordered_api_categories;
    let api_list = [];
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

function searchInAll() {
    cmobjects_to_search.forEach(function(cm) {
        CodeMirror.commands.find(cm)
    })
}

function clearSelections() {
    cmobjects.forEach(function (cm){
        CodeMirror.commands.clearSearch(cm);
        CodeMirror.commands.singleSelection(cm);
    })
}

CodeMirror.keyMap["default"]["Esc"] = clearSelections;
is_mac = CodeMirror.keyMap["default"].hasOwnProperty("Cmd-S");
mousetrap.bind(['esc'], function(e) {
    clearSelections();
    e.preventDefault()
});

if (is_mac) {
    CodeMirror.keyMap["default"]["Cmd-S"] = updateModule;
    mousetrap.bind(['command+s'], function(e) {
        updateModule();
        e.preventDefault()
    });

    mousetrap.bind(['command+l'], function(e) {
        loadModule();
        e.preventDefault()
    });
    mousetrap.bind(['command+f'], function(e) {
        searchInAll();
        e.preventDefault()
    });
}
else {
    CodeMirror.keyMap["default"]["Ctrl-S"] = updateModule;
    mousetrap.bind(['ctrl+s'], function(e) {
        updateModule();
        e.preventDefault()
    });

    mousetrap.bind(['ctrl+l'], function(e) {
        loadModule();
        e.preventDefault()
    });
    mousetrap.bind(['ctrl+f'], function(e) {
        searchInAll();
        e.preventDefault()
    });
}

function createCMArea(codearea, include_in_global_search) {
    let cmobject = CodeMirror(codearea, {
        lineNumbers: true,
        matchBrackets: true,
        highlightSelectionMatches: true,
        autoCloseBrackets: true,
        indentUnit: 4,
        readOnly: false
    });
    cmobject.setOption("extraKeys", {
          Tab: function(cm) {
            let spaces = Array(5).join(" ");
            cm.replaceSelection(spaces);
          },
          "Ctrl-Space": "autocomplete"
        });
    if (include_in_global_search) {
        cmobjects_to_search.push(cmobject);
    }
    cmobjects.push(cmobject);
    return cmobject
}

function doSave(update_success) {
    const new_code = myCodeMirror.getDoc().getValue();
    const tags = $("#tile-tags").val();
    const notes = $("#tile-notes").val();
    let result_dict;
    let category;

    if (this_viewer == "viewer") {
        category = null;
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
        category = $("#tile-category").val();
        if (category.length == 0) {
            category = "basic"
        }
        let new_dp_code = "";
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
        update_success(data, new_code, tags, notes, category)
    }
}

function updateModule() {
    doSave(update_success);
    function update_success(data, new_code, tags, notes, category) {
        if ((this_viewer == "creator") && (data.render_content_line_number != 0)) {
            myCodeMirror.setOption("firstLineNumber", data.render_content_line_number + 1);
            myCodeMirror.refresh()
        }
        if ((this_viewer == "creator") && (is_mpl) && (data.draw_plot_line_number != 0)) {
            myDPCodeMirror.setOption("firstLineNumber", data.draw_plot_line_number + 1);
            myDPCodeMirror.refresh()
        }

        if (data.success) {
            savedCode = new_code;
            savedTags = tags;
            savedNotes = notes;
            data.timeout = 2000;
            if (this_viewer == "creator"){
                savedCategory = category;
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
    function save_success(data, new_code, tags, notes, category) {
            if ((this_viewer == "creator") && (data.render_content_line_number != 0)) {
                myCodeMirror.setOption("firstLineNumber", data.render_content_line_number + 1)
                myCodeMirror.refresh()
            }
            if ((this_viewer == "creator") && (is_mpl) && (data.draw_plot_line_number != 0)) {
                myDPCodeMirror.setOption("firstLineNumber", data.draw_plot_line_number + 1)
                myDPCodeMirror.refresh()
            }
            if (data.success) {
                savedCode = new_code;
                savedTags = tags;
                savedNotes = notes;
                data.timeout = 2000;
                if (this_viewer == "creator"){
                    savedCategory = category;
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
    resize_dom_to_bottom_given_selector("#api-area", 20);
}

function renameModule() {
    console.log("entering rename");
    $.getJSON($SCRIPT_ROOT + "get_resource_names/tile", function(data) {
            const module_names = data["resource_names"];
            const index = module_names.indexOf(module_name);
            if (index >= 0) {
              module_names.splice(index, 1);
            }
            showModal("Rename Module", "Name for this module", RenameModuleResource, module_name, module_names)
        }
    );
    function RenameModuleResource (new_name) {
        const the_data = {"new_name": new_name};
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
        const result_dict = {
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
        const result_dict = {
            "res_type": "tile",
            "res_name": module_name,
            "new_res_name": new_name
        };
        postAjax("send_to_repository", result_dict, doFlashAlways)
    }
}

function dirty() {
    const the_code = myCodeMirror.getDoc().getValue();
    const tags = $("#tile-tags").val();
    const notes = $("#tile-notes").val();

    let is_clean = (the_code == savedCode) && (tags == savedTags) && (notes == savedNotes);
    if (this_viewer == "creator") {
        new_methods = methodManager.cmobject.getValue();
        const category = $("#tile-category").val();
        is_clean = is_clean && (new_methods == savedMethods) && !optionManager.changed &&
            !exportManager.changed && (category == savedCategory);
        if (is_mpl) {
            const dp_code = myDPCodeMirror.getDoc().getValue();
            is_clean = is_clean && (dp_code == savedDPCode);
        }
    }
    return !is_clean
}

tactic_keymap_pcDefault = {
"Ctrl-A": "selectAll", "Ctrl-D": "deleteLine", "Ctrl-Z": "undo", "Shift-Ctrl-Z": "redo", "Ctrl-Y": "redo",
"Ctrl-Home": "goDocStart", "Ctrl-End": "goDocEnd", "Ctrl-Up": "goLineUp", "Ctrl-Down": "goLineDown",
"Ctrl-Left": "goGroupLeft", "Ctrl-Right": "goGroupRight", "Alt-Left": "goLineStart", "Alt-Right": "goLineEnd",
"Ctrl-Backspace": "delGroupBefore", "Ctrl-Delete": "delGroupAfter", "Ctrl-S": updateModule, "Ctrl-F": "find",
"Ctrl-G": "findNext", "Shift-Ctrl-G": "findPrev", "Shift-Ctrl-F": "replace", "Shift-Ctrl-R": "replaceAll",
"Ctrl-[": "indentLess", "Ctrl-]": "indentMore",
"Ctrl-U": "undoSelection", "Shift-Ctrl-U": "redoSelection", "Alt-U": "redoSelection",
fallthrough: "basic"
};
// Very basic readline/emacs-style bindings, which are standard on Mac.

tactic_keymap_macDefault = {
"Cmd-A": "selectAll", "Cmd-D": "deleteLine", "Cmd-Z": "undo", "Shift-Cmd-Z": "redo", "Cmd-Y": "redo",
"Cmd-Home": "goDocStart", "Cmd-Up": "goDocStart", "Cmd-End": "goDocEnd", "Cmd-Down": "goDocEnd", "Alt-Left": "goGroupLeft",
"Alt-Right": "goGroupRight", "Cmd-Left": "goLineLeft", "Cmd-Right": "goLineRight", "Alt-Backspace": "delGroupBefore",
"Ctrl-Alt-Backspace": "delGroupAfter", "Alt-Delete": "delGroupAfter", "Cmd-S": updateModule, "Cmd-F": "find",
"Cmd-G": "findNext", "Shift-Cmd-G": "findPrev", "Cmd-Alt-F": "replace", "Shift-Cmd-Alt-F": "replaceAll",
"Cmd-[": "indentLess", "Cmd-]": "indentMore", "Cmd-Backspace": "delWrappedLineLeft", "Cmd-Delete": "delWrappedLineRight",
"Cmd-U": "undoSelection", "Shift-Cmd-U": "redoSelection", "Ctrl-Up": "goDocStart", "Ctrl-Down": "goDocEnd",
fallthrough: ["basic", "emacsy"]
};
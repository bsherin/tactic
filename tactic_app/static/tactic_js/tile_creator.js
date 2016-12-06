/**
 * Created by bls910 on 10/4/15.
 */
var current_theme = "default";
var mousetrap = new Mousetrap();
var myCodeMirror;
var savedCode = null;
var savedTags = null;
var savedNotes = null;
var creator_resource_module_template;
var res_types = ["option"];
var opt_dict = null;
var rt_code = null;

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

function start_post_load() {
    var data = {};
    data.module_name = module_name;
    $.ajax({
        url: $SCRIPT_ROOT + "/parse_code",
        contentType: 'application/json',
        type: 'POST',
        async: true,
        data: JSON.stringify(data),
        dataType: 'json',
        success: parse_success
    });
}

function parse_success(data) {
    opt_dict = data.option_dict;
    rt_code = data.render_template_code;
    $.get($SCRIPT_ROOT + "/get_creator_resource_module_template", function(template) {
        creator_resource_module_template = $(template).filter('#creator-resource-module-template').html(); // tactic_todo problem is here
        optionManager.create_module_html();
        // exportManager.create_module_html();
        res_types.forEach(function (element, index, array) {
                $("#" + element + "-selector").load($SCRIPT_ROOT + "/request_update_creator_selector_list/" + element, function () {
                    select_resource_button(element, null);
                    sorttable.makeSortable($("#" + element + "-selector table")[0]);
                    var updated_header = $("#" + element + "-selector table th")[2];
                    // We do the sort below twice to get the most recent dates first.
                    sorttable.innerSortFunction.apply(updated_header, []);
                    sorttable.innerSortFunction.apply(updated_header, []);
                })
            });
        $(".resource-module").on("click", ".resource-selector .selector-button", selector_click);
        continue_loading()
    })
}

var option_manager_specifics = {

    buttons: [
        {"name": "refresh", "func": "refresh_container_table", "button_class": "btn btn-info"}
    ],


    refresh_container_table: function (event) {
        var manager = event.data.manager;
        $.getJSON($SCRIPT_ROOT + '/refresh_container_table');
        event.preventDefault();
    },

    create_module_html: function () {
        var res = Mustache.to_html(creator_resource_module_template, this);
        $("#" + this.res_type + "-module").html(res);
    }

};

var optionManager = new ResourceManager("option", option_manager_specifics);

function continue_loading() {
    var codearea = document.getElementById("codearea");
    myCodeMirror = CodeMirror(codearea, {
        lineNumbers: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        indentUnit: 4,
        readOnly: view_only
        });
    myCodeMirror.setValue(rt_code);
    myCodeMirror.setOption("extraKeys", {
      Tab: function(cm) {
        var spaces = Array(5).join(" ");
        cm.replaceSelection(spaces);
      }
    });
    $(".CodeMirror").css('height', window.innerHeight - $(".CodeMirror").offset().top - 20);
    $("#api-area").css('height', window.innerHeight - $("#api-area").offset().top - 20);
    savedCode = myCodeMirror.getDoc().getValue();

    var result_dict = {"res_type": "tile", "res_name": module_name};
    var acc = document.getElementsByClassName("accordion");
    var i;
    for (i = 0; i < acc.length; i++) {
        acc[i].onclick = function(){
            this.classList.toggle("active");
            this.nextElementSibling.classList.toggle("show");
        }
    }
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
            $("#tile-tags")[0].value = data.tags;
            $("#tile-notes")[0].value = data.notes;
            savedTags = data.tags;
            savedNotes = data.notes
        }
        else {
            // doFlash(data)
            $(".created").html("");
            $("#tile-tags")[0].value = "";
            $("#tile-tags").html("");
            $("#tile-notes")[0].value = "";
            $("#tile-notes").html("");
        }
    }
}

function dirty() {
    var the_code = myCodeMirror.getDoc().getValue();
    var tags = $("#tile-tags").val();
    var notes = $("#tile-notes").val();
    return !((the_code == savedCode) && (tags == savedTags) && (notes == savedNotes));
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

function showAPI(){
        $("#api-area").toggle()
        $("#api-area").css('height', window.innerHeight - $("#api-area").offset().top - 20);
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
    }
}

function updateModule() {
    var new_code = myCodeMirror.getDoc().getValue();
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
    var new_code = myCodeMirror.getDoc().getValue();
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

        $.ajax({
            url: $SCRIPT_ROOT + 'copy_from_repository',
            contentType: 'application/json',
            type: 'POST',
            async: true,
            data: JSON.stringify(result_dict),
            dataType: 'json',
            success: doFlash
        });
    }
}

function sendToRepository() {
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

        $.ajax({
            url: $SCRIPT_ROOT + 'send_to_repository',
            contentType: 'application/json',
            type: 'POST',
            async: true,
            data: JSON.stringify(result_dict),
            dataType: 'json',
            success: doFlash
        });
    }
}

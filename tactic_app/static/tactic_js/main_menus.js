/**
 * Created by bls910 on 8/1/15.
 */

var menus = {};
var menu_item_index = {};
var column_menu;
var project_menu;
var mousetrap = new Mousetrap();
var menu_template;
$.get($SCRIPT_ROOT + "/get_menu_template", function(template){
    menu_template = $(template).filter('#menu-template').html();
});

function clear_all_menus() {
    menus = {};
    menu_item_index = {};
    $("#menu-area").html(" ")
}

function MenuObject(menu_name, menu_function, options) {
    this.menu_name = menu_name;
    this.options = options;
    this.perform_menu_item = menu_function
}

// This is the menu_object base prototype
MenuObject.prototype = {
    shortcuts: {},
    render_menu: function () {
        var self = this;
        var options_list = create_options_list();
        return Mustache.to_html(menu_template, {
            "menu_name": this.menu_name ,
            "options": options_list
        });

        function create_options_list() {
            var result = [];
            var key_text;
            var scuts = menus[self.menu_name].shortcuts;
            for (var i = 0; i < self.options.length; ++i) {
                var opt = self.options[i];
                if (scuts.hasOwnProperty(opt)){
                    key_text = scuts[opt].keys[0]
                }
                else {
                    key_text = ""
                }
                result.push({"option_name": opt, "key_text": key_text})
            }
            return result
        }
    },

    add_options_to_index: function () {
        for (var i = 0; i < this.options.length; ++i) {
            menu_item_index[this.options[i]] = this.menu_name
        }
    },

    remove_options_from_index: function() {
        for (var i = 0; i < this.options.length; ++i) {
            delete menu_item_index[this.options[i]]
        }
    },

    disable_items: function (disable_list) {
        for (var i = 0; i < disable_list.length; ++i) {
            this.disable_menu_item(disable_list[i])
        }
    },

    enable_items: function (enable_list) {
        for (var i = 0; i < enable_list.length; ++i) {
            this.enable_menu_item(enable_list[i])
        }
    },

    perform_menu_item: function (menu_id) {
    },

    disable_menu_item: function (item_id) {
        $("#" + item_id).closest('li').addClass("disabled");
        var menu = menus[menu_item_index[item_id]];
        if (menu.shortcuts.hasOwnProperty(item_id)) {
            var scut = menu.shortcuts[item_id];
            mousetrap.unbind(scut.keys);
            if (scut.hasOwnProperty("fallthrough")) {
                mousetrap.bind(scut.keys, function (e) {
                    scut.fallthrough();
                    e.preventDefault()
                })
            }
        }
    },
    enable_menu_item: function (item_id) {
        $("#" + item_id).closest('li').removeClass("disabled");
        var menu = menus[menu_item_index[item_id]];
        if (menu.shortcuts.hasOwnProperty(item_id)) {
            var scut = menu.shortcuts[item_id];
            //mousetrap.unbind(scut.keys);
            mousetrap.bind(scut.keys, function (e) {
                scut.command();
                e.preventDefault()
            })
        }
    }
};

function bind_to_keys(shortcuts) {
    for (var option in shortcuts) {
        if (!shortcuts.hasOwnProperty(option)) continue;
        mousetrap.bind(shortcuts[option].keys, function(e) {
            option.command();
            e.preventDefault()
        });
    }
    mousetrap.bind(['command+s', 'ctrl+s'], function(e) {
        save_project();
        e.preventDefault()
    })
}

mousetrap.bind("esc", function() {
    if (tableObject.selected_header != null) {
        deselect_header(tableObject.selected_header)
    }
    broadcast_event_to_server("DehighlightTable", {});
    clearStatusArea();
    clearStatusMessage();
});

function build_and_render_menu_objects() {
    // Create the column_menu object
    column_menu = new MenuObject("Column", column_command,["shift-left", "shift-right", "hide", "unhide", "add-column", "add-column-all-docs"]);
    menus[column_menu.menu_name] = column_menu;
    column_menu.add_options_to_index();

    // Create the project_menu object
    project_menu = new MenuObject("Project", project_command,["save-as", "save", "export-table-as-collection"]);
    menus[project_menu.menu_name] = project_menu;
    project_menu.add_options_to_index();
    project_menu.shortcuts = {
        "save": {"keys": ['ctrl+s', 'command+s'],
                "command": save_project,
                "fallthrough": function () {
                    saveProjectAs()
                }
        }
    };
    bind_to_keys(project_menu.shortcuts);

    // Create the tile_menus
    for (var category in tile_types) {
        if (!tile_types.hasOwnProperty(category)) {
            continue;
        }
        var new_tile_menu = new MenuObject(category, tile_command, tile_types[category]);
        menus[new_tile_menu.menu_name] = new_tile_menu;
        new_tile_menu.add_options_to_index();
    }

    render_menus();

    function render_menus() {
        for (var m in menus) {
            if (menus.hasOwnProperty(m)) {
                $("#menu-area").append(menus[m].render_menu())
            }
        }
        $(".menu-item").click(function(e) {
            var item_id = e.currentTarget.id;
            var menu_name = menu_item_index[item_id];
            //$(e.currentTarget).parents(".dropdown-menu").dropdown("toggle")s;
            if (!is_disabled(item_id)) {
                menus[menu_name].perform_menu_item(item_id)
            }
            e.preventDefault()
        });
        disable_require_column_select();
        if (_project_name == "") {
            project_menu.disable_items(["save"]);
        }

        function is_disabled (menu_id) {
            return $("#" + menu_id).parent().hasClass("disabled")
        }
    }
}

function column_command(menu_id) {
    var column_header = tableObject.selected_header;
    if (column_header != null) {
        switch (menu_id) {
            case "shift-left":
            {
                deselect_header(column_header);
                tableObject.current_spec.shift_column_left(column_header);
                tableObject.build_table();
                dirty = true;
                break;
            }
            case "shift-right":
            {
                deselect_header(column_header);
                tableObject.current_spec.shift_column_right(column_header);
                tableObject.build_table();
                dirty = true;
                break;
            }
            case "hide":
            {
                deselect_header(column_header);
                var col_class = ".column-" + column_header;
                $(col_class).fadeOut();
                //tableObject.current_spec.hidden_list.push(column_header);
                hidden_columns_list.push(column_header);
                dirty = true;
                break;
            }
        }
    }
    else if (menu_id == "unhide") {
        hidden_columns_list = ["__filename__"];
        tableObject.build_table();
        dirty = true;
    }
    else if (menu_id == "add-column-all-docs") {
        createColumn();
        dirty = true;
    }
    else if (menu_id == "add-column") {
        createColumnThisDoc();
        dirty = true;
    }
}

function createColumn() {
    showModal("Create Column All Docs", "New Column Name", function (new_name) {
        var column_name = new_name;
        for (var doc in tablespec_dict) {
            if (tablespec_dict.hasOwnProperty(doc)) {
                tablespec_dict[doc].header_list.push(column_name)
            }
        }
        // Then rebuild the table
        tableObject.build_table();
        get_column(column_name).text(" ");  // This seems to be necessary for the column to be editable

        // Then change the current data_dict back on the server
        var data_dict = {"column_name": column_name};
        broadcast_event_to_server("CreateColumn", data_dict, function () {
            dirty = true
        })
    })
}

function createColumnThisDoc() {
    showModal("Create Column This Doc", "New Column Name", function (new_name) {
        var column_name = new_name;
        tableObject.current_spec.header_list.push(column_name)
        // Then rebuild the table
        tableObject.build_table();
        get_column(column_name).text(" ");  // This seems to be necessary for the column to be editable

        // Then change the current data_dict back on the server
        var data_dict = {"column_name": column_name};
        broadcast_event_to_server("CreateColumn", data_dict, function () {
            dirty = true
        })
    })
}

function saveProjectAs() {
    postWithCallback("host", "get_project_names", {"user_id": user_id}, function (data) {
        checkboxes = [{"checkname": "purgetiles", "checktext": "Include only currently used tiles"}];
        showModal("Save Project As", "New Project Name", CreateNewProject,
                  "NewProject", data["project_names"], checkboxes)
    });

    function CreateNewProject (new_name, checkresults) {
            var result_dict = {
                "project_name": new_name,
                "main_id": main_id,
                "tablespec_dict": tablespec_dict,
                "console_html": $("#console").html(),
                "console_cm_code": getConsoleCMCode(),
                "doc_type": DOC_TYPE,
                "purgetiles": checkresults["purgetiles"]
            };
            if (DOC_TYPE == "table") {
                result_dict.hidden_columns_list = hidden_columns_list
            }

            tableObject.startTableSpinner();
            postWithCallback(main_id, "save_new_project", result_dict, save_as_success);
            function save_as_success(data_object) {
                if (data_object["success"]) {
                    tableObject.stopTableSpinner();
                    clearStatusMessage();
                    menus["Project"].enable_menu_item("save");
                    tableObject.project_name = data_object["project_name"];
                    //tableObject.set_table_title()
                    $("#project-name").html(tableObject.project_name);
                    $("title").html(data_object["project_name"]);
                    data_object.alert_type = "alert-success";
                    data_object.timeout = 2000;
                    _project_name = data_object.project_name;  // When menus recreated, it checks _project_name
                    dirty = false;
                    data_object["message"] = data_object["message_string"];
                    doFlash(data_object);
                    postWithCallback("host", "update_project_selector_list", {'user_id': user_id})
                }
                else {
                    tableObject.stopTableSpinner();
                    clearStatusMessage();
                    data_object["message"] = data_object["message_string"];
                    doFlash(data_object)
                }
            }
    }
}

function save_project() {
    var result_dict = {
        "main_id": main_id,
        "tablespec_dict": tablespec_dict,
        "console_html": $("#console").html(),
        "console_cm_code": getConsoleCMCode()
    };
    if (DOC_TYPE == "table") {
        result_dict.hidden_columns_list = hidden_columns_list
    }
    tableObject.startTableSpinner();
    postWithCallback(main_id, "update_project", result_dict, updateSuccess);
    function updateSuccess(data) {
        if (data.success) {
            tableObject.stopTableSpinner();
            clearStatusMessage();
            data.alert_type = "alert-success";
            dirty = false;
            data.timeout = 2000;
            doFlash(data)
        }
        else {
            tableObject.stopTableSpinner();
            clearStatusMessage();
            data.alert_type = "alert-warning";
            dirty = false;
            doFlash(data)
        }
    }
}

function project_command(menu_id) {
    switch (menu_id) {
        case "save-as":
        {
            saveProjectAs();
            break;
        }
        case "save":
        {
            save_project();
            break;
        }
        case "export-table-as-collection":
        {
            exportDataTable();
            break;
        }
    }
}

function downloadVisibleDocument() {
    showModal("Download Data Table", "New File Name", function (new_name) {
        window.open($SCRIPT_ROOT + "/download_table/" + main_id + "/" + new_name)
    })
}


function exportDataTable() {
    showModal("Export Data", "New Collection Name", function (new_name) {
            var result_dict = {
                "export_name": new_name,
                "main_id": main_id,
                "user_id": user_id
            };
            $.ajax({
                url: $SCRIPT_ROOT + "/export_data",
                contentType : 'application/json',
                type : 'POST',
                async: true,
                data: JSON.stringify(result_dict),
                dataType: 'json'
            });
    })
}

function tile_command(menu_id) {
    var existing_tile_names = [];
    for (var tile_id in tile_dict) {
        if (!tile_dict.hasOwnProperty(tile_id)) continue;
        existing_tile_names.push(tile_dict[tile_id].tile_name)
    }
    showModal("Create " + menu_id, "New Tile Name", createNewTile, menu_id, existing_tile_names);

    function createNewTile(tile_name) {
        var data_dict = {};
        var tile_type = menu_id;
        data_dict["tile_name"] = tile_name;
        data_dict["tile_type"] = tile_type;
        data_dict["user_id"] = user_id;
        postWithCallback("host", "create_tile_container", data_dict, function (data) {
            var tile_id = data["tile_id"];
            data_dict["tile_id"] = tile_id;
            data_dict["tile_address"] = data["tile_address"];
            postWithCallback("host", "get_module_code", data_dict, function (data) {
                data_dict["tile_code"] = data["module_code"];
                postWithCallback("host", "get_lists_classes_functions", data_dict, function (data) {
                    data_dict["list_names"] = data["list_names"];
                    data_dict["class_names"] = data["class_names"];
                    data_dict["function_names"] = data["function_names"];
                    data_dict["collection_names"] = data["collection_names"];
                    postWithCallback(main_id, "create_tile", data_dict, function (data) {
                        if (data.success) {
                            data_dict["form_html"] = data["html"] ;
                            postWithCallback("host", "render_tile", data_dict, function(data) {
                                var new_tile_object = new TileObject(tile_id, data.html, true, tile_name);
                                tile_dict[tile_id] = new_tile_object;
                                new_tile_object.spin_and_refresh();
                                dirty = true;
                            })
                        }
                    })
                })
            })
        })
    }
}

function disable_require_column_select(){
    column_menu.disable_items(["shift-left", "shift-right", "hide"])
}

function enable_require_column_select(){
    column_menu.enable_items(["shift-left", "shift-right", "hide"])
}





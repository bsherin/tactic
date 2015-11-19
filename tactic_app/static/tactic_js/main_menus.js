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
})

function clear_all_menus() {
    menus = {}
    menu_item_index = {}
    $("#menu-area").html(" ")
}

// This is the menu_object base prototype
var menu_object = {
    menu_name: "",
    options: [],
    shortcuts: {},
    render_menu: function () {
        var self = this;
        var options_list = create_options_list();
        var res = Mustache.to_html(menu_template, {
            "menu_name": this.menu_name ,
            "options": options_list
        });
        return res

        function create_options_list() {
            var result = [];
            var scuts = menus[self.menu_name].shortcuts
            for (var i = 0; i < self.options.length; ++i) {
                var opt = self.options[i]
                if (scuts.hasOwnProperty(opt)){
                    var key_text = scuts[opt].keys[0]
                }
                else {
                    var key_text = ""
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
            var scut = menu.shortcuts[item_id]
            mousetrap.unbind(scut.keys);
            if (scut.hasOwnProperty("fallthrough")) {
                mousetrap.bind(scut.keys, function (e) {
                    scut.fallthrough()
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
}

function bind_to_keys(shortcuts) {
    for (option in shortcuts) {
        if (!shortcuts.hasOwnProperty()) continue;
        mousetrap.bind(option.keys, function(e) {
            option.command()
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
})

function build_and_render_menu_objects() {
    // Create the column_menu object
    column_menu = Object.create(menu_object);
    column_menu.menu_name = "Column";
    column_menu.options = ["shift-left", "shift-right", "hide", "unhide", "add-column"];
    column_menu.perform_menu_item = column_command;
    menus[column_menu.menu_name] = column_menu;
    column_menu.add_options_to_index();

    // Create the project_menu object
    project_menu = Object.create(menu_object);
    project_menu.menu_name = "Project";
    project_menu.options = ["save-as", "save", "export-data"];
    project_menu.perform_menu_item = project_command;
    menus[project_menu.menu_name] = project_menu;
    project_menu.add_options_to_index();
    project_menu.shortcuts = {
        "save": {"keys": ['ctrl+s', 'command+s'],
                "command": save_project,
                "fallthrough": function () {
                    saveProjectAs()
                }
        }
    }
    bind_to_keys(project_menu.shortcuts);

    // Create the tile_menus
    for (category in tile_types) {
        if (!tile_types.hasOwnProperty(category)) {
            continue;
        }
        var new_tile_menu = Object.create(menu_object);
        new_tile_menu.menu_name = category;
        new_tile_menu.perform_menu_item = tile_command;
        menus[new_tile_menu.menu_name] = new_tile_menu;
        new_tile_menu.options = tile_types[category];
        new_tile_menu.add_options_to_index();
    }

    render_menus()

    function render_menus() {
        for (var m in menus) {
            if (menus.hasOwnProperty(m)) {
                $("#menu-area").append(menus[m].render_menu())
            }
        };
        $(".menu-item").click(function(e) {
            var item_id = e.currentTarget.id;
            var menu_name = menu_item_index[item_id]
            menus[menu_name].perform_menu_item(item_id)
            e.preventDefault()
        });
        disable_require_column_select()
        project_menu.disable_items(["save"])

    }
}

function column_command(menu_id) {
    var column_header = tableObject.selected_header;
    if (column_header != null) {
        switch (menu_id) {
            case "shift-left":
            {
                deselect_header(column_header)
                tableObject.current_spec.shift_column_left(column_header)
                tableObject.build_table();
                break;
            }
            case "shift-right":
            {
                deselect_header(column_header)
                tableObject.current_spec.shift_column_right(column_header)
                tableObject.build_table();
                break;
            }
            case "hide":
            {
                deselect_header(column_header);
                var col_class = ".column-" + column_header;
                $(col_class).fadeOut();
                tableObject.current_spec.hidden_list.push(column_header);
                break;
            }
        }
    }
    else if (menu_id == "unhide") {
        tableObject.current_spec.hidden_list = ["__filename__"];
        tableObject.build_table();
    }
    else if (menu_id == "add-column") {
        createColumn()
    }
};

function createColumn() {
    showModal("Create Columnm", "New Column Name", function (new_name) {
            column_name = new_name;
            for (var doc in tablespec_dict) {
                if (tablespec_dict.hasOwnProperty(doc)) {
                    tablespec_dict[doc].header_list.push(column_name)
                }
            }

            // Then rebuild the table
            tableObject.build_table()

            // Then change the current data_dict back on the server
            var data_dict = {"column_name": column_name,
                            "main_id": main_id};
            $.ajax({
                url: $SCRIPT_ROOT + "/distribute_events/CreateColumn",
                contentType : 'application/json',
                type : 'POST',
                async: true,
                data: JSON.stringify(data_dict),
                dataType: 'json',
            });
    })
}

function saveProjectAs() {
    showModal("Save Project As", "New Project Name", function (new_name) {
                var result_dict = {
                "project_name": new_name,
                "main_id": main_id,
                "tablespec_dict": tablespec_dict
            };
            $.ajax({
                    url: $SCRIPT_ROOT + "/save_new_project",
                    contentType : 'application/json',
                    type : 'POST',
                    async: true,
                    data: JSON.stringify(result_dict),
                    dataType: 'json',
                    success: save_as_success
            });
            function save_as_success(data_object) {
                if (data_object["success"]) {
                    menus["Project"].enable_menu_item("save");
                    tableObject.project_name = data_object["project_name"]
                    //tableObject.set_table_title()
                    $("#project-name").html(tableObject.project_name)
                    data_object.alert_type = "alert-success"
                    doFlash(data_object)
                }
            }
    })
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
        case "export-data":
        {
            exportDataTable()
        }
    }
}

function exportDataTable() {
    showModal("Export Data", "New Collection Name", function (new_name) {
            var result_dict = {
                "export_name": new_name,
                "main_id": main_id,
            }
            $.ajax({
                url: $SCRIPT_ROOT + "/export_data",
                contentType : 'application/json',
                type : 'POST',
                async: true,
                data: JSON.stringify(result_dict),
                dataType: 'json',
                success: doFlash
            });
    })
}

function tile_command(menu_id) {

    showModal("Create " + menu_id, "New Tile Name", createNewTile, menu_id)

    function createNewTile(tile_name) {
        var data_dict = {};
        var tile_type = menu_id;
        data_dict["main_id"] = main_id;
        data_dict["tile_name"] = tile_name;
        $.ajax({
            url: $SCRIPT_ROOT + "/create_tile_request/" + String(tile_type),
            contentType : 'application/json',
            type : 'POST',
            data: JSON.stringify(data_dict),
            dataType: 'json',
            success: function (data) {
                if (data.success) {
                    var new_tile_object = Object.create(tile_object);
                    new_tile_object.tile_id = data.tile_id;
                    $("#tile-div").append(data.html);
                    $("#tile_body_" + data.tile_id).flip({
                        "trigger": "manual",
                        "autoSize": false,
                        "forceWidth": true,
                        "forceHeight": true
                    });
                    var new_tile_elem = $("#tile_id_" + data.tile_id)
                    new_tile_elem.resizable({
                        handles: "se",
                        resize: resize_tile_area,
                        stop: function () {
                            new_tile_object.broadcastTileSize(new_tile_object)
                        }
                    });
                    jQuery.data(new_tile_elem[0], "my_tile_id", data.tile_id)
                    listen_for_clicks();
                    $("#tile_id_" + data.tile_id).find(".triangle-right").hide()

                    tile_dict[data.tile_id] = new_tile_object;
                    do_resize(data.tile_id);
                    new_tile_object.broadcastTileSize(new_tile_object);
                    data_dict.tile_id = data.tile_id
                    spin_and_refresh(data_dict.tile_id)
                }
            }
        })
    }
}

function disable_require_column_select(){
    column_menu.disable_items(["shift-left", "shift-right", "hide"])
}

function enable_require_column_select(){
    column_menu.enable_items(["shift-left", "shift-right", "hide"])
}

function save_project() {
    var result_dict = {
        "main_id": main_id,
        "tablespec_dict": tablespec_dict
        //"tablespec_dict": tablespec_dict
    };
    $.ajax({
        url: $SCRIPT_ROOT + "/update_project",
        contentType : 'application/json',
        type : 'POST',
        async: false,
        data: JSON.stringify(result_dict),
        dataType: 'json',
        success: doFlash
    });
}



/**
 * Created by bls910 on 8/1/15.
 */

var menus = {};
var menu_item_index = {};
var column_menu;
var project_menu;
var tile_menu;

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
}

// This is the menu_object base prototype
var menu_object = {
    menu_name: "",
    options: [],
    menu_template: '<li class="dropdown">' +
        '<a href="#" class="dropdown-toggle" id="{{menu_name}}-menu" data-toggle="dropdown">' +
        '{{menu_name}}<span class="caret"></span></a>' +
        '<ul class="dropdown-menu">' +
        '{{#options}}' +
        '<li><a class="menu-item" id="{{.}}" href="#">{{.}}</a></li>' +
        '{{/options}}</li>',
    render_menu: function () {
        res = Mustache.to_html(this.menu_template, {
                    "menu_name": this.menu_name,
                    "options": this.options});
        return res
    },
    add_options_to_index: function () {
        for (var i = 0; i< this.options.length; ++i){
            menu_item_index[this.options[i]] = this.menu_name
        }
    },
    disable_items: function(disable_list) {
        for (var i = 0; i< disable_list.length; ++i){
            this.disable_menu_item(disable_list[i])
        }
    },
    enable_items: function(enable_list) {
        for (var i = 0; i< enable_list.length; ++i){
            this.enable_menu_item(enable_list[i])
        }
    },
    perform_menu_item: function(menu_id) {},
    disable_menu_item: function (item_id) {
            $("#" + item_id).closest('li').addClass("disabled")
        },
    enable_menu_item: function(item_id) {
            $("#" + item_id).closest('li').removeClass("disabled")
        }
    };

function column_command(menu_id) {
    var the_id = tableObject.selected_header;
    if (the_id != null) {
        switch (menu_id) {
            case "shift-left":
            {
                deselect_header(the_id)
                var parent_struct = tableObject.header_struct.find_parent_of_id(the_id);
                parent_struct.shift_child_left(the_id);
                tableObject.build_table();
                break;
            }
            case "shift-right":
            {
                deselect_header(the_id)
                var parent_struct = tableObject.header_struct.find_parent_of_id(the_id);
                parent_struct.shift_child_right(the_id);
                tableObject.build_table();
                break;
            }
            case "hide":
            {
                deselect_header(the_id);
                col_class = ".header" + the_id;
                $(col_class).fadeOut();
                tableObject.hidden_list.push(the_id);
                resize_from_sub_headers($("#" + the_id).data("super_headers"))
                break;
            }
        }
    }
    if (menu_id == "unhide") {
        tableObject.hidden_list = [];
        tableObject.build_table();
    }
};

function project_command(menu_id) {
    switch (menu_id) {
        case "save-as":
        {
            $('#save-project-modal').modal();
            break;
        }
        case "save":
        {
            save_project();
        }
    }
}

function tile_command(menu_id) {
    create_new_tile(menu_id)

}

function disable_require_column_select(){
    column_menu.disable_items(["shift-left", "shift-right", "hide"])
}

function enable_require_column_select(){
    column_menu.enable_items(["shift-left", "shift-right", "hide"])
}

function build_menu_objects() {
    // Create the column_menu object
    column_menu = Object.create(menu_object);
    column_menu.menu_name = "Column";
    column_menu.options = ["shift-left", "shift-right", "hide", "unhide"];
    column_menu.perform_menu_item = column_command;
    menus[column_menu.menu_name] = column_menu;
    column_menu.add_options_to_index();

    // Create the project_menu object
    project_menu = Object.create(menu_object);
    project_menu.menu_name = "Project";
    project_menu.options = ["save-as", "save"];
    project_menu.perform_menu_item = project_command;
    menus[project_menu.menu_name] = project_menu;
    project_menu.add_options_to_index();

    // Create the project_menu object
    tile_menu = Object.create(menu_object);
    tile_menu.menu_name = "Tile";
    tile_menu.perform_menu_item = tile_command;
    menus[tile_menu.menu_name] = tile_menu;
    tile_menu.options = tile_types;
    tile_menu.add_options_to_index();
}


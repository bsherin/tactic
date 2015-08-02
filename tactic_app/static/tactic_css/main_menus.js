/**
 * Created by bls910 on 8/1/15.
 */

//function disable_menu_item(item_id) {
//    $("#" + item_id).closest('li').addClass("disabled")
//}
//
//function enable_menu_item(item_id) {
//    $("#" + item_id).closest('li').removeClass("disabled")
//}

menus = {}

var menu_object = {
    menu_name: "",
    options: [],
    menu_template: '<li class="dropdown">' +
    '<a href="#" class="dropdown-toggle" id="{{menu_name}}" data-toggle="dropdown">' +
    '{{menu_name}}<span class="caret"></span></a>' +
    '<ul class="dropdown-menu">' +
    '{{#options}}' +
    '<li><a class="menu-item" id="{{.}}" href="#">{{.}}</a></li>' +
    '{{/options}}',
    render_menu: function () {
        res = Mustache.to_html(this.menu_template, {
                    "menu_name": this.menu_name,
                    "options": options})
        return res
    },
    perform_menu_item: function(menu_id) {}
}


var column_menu = Object.create(menu_object);
column_menu.name = "column-menu"
column_menu.options = ["menu-shift-left", "menu-shift-right", "menu-hide", "menu-unhide"];
column_menu.perform_menu_item = column_command;
menus["column_menu"] = column_menu


$(".menu-item").click(function(e) {
    menu_id = e.currentTarget.id;
    menu_name = $("#" + item_id).closest('a').attr("id");
    menus[menu_name].perform_menu_item(menu_id)
    e.preventDefault()
})

function column_command(menu_id) {
    var the_id = tableObject.selected_header;
    if (the_id != null) {
        switch (menu_id) {
            case "menu-shift-left": {
                deselect_header(the_d)
                var parent_struct = tableObject.header_struct.find_parent_of_id(the_id);
                parent_struct.shift_child_left(the_id);
                tableObject.build_table();
                break;
            }
            case "menu-shift-right": {
                deselect_header(the_id)
                var parent_struct = tableObject.header_struct.find_parent_of_id(the_id);
                parent_struct.shift_child_right(the_id);
                tableObject.build_table();
                break;
            }
            case "menu-hide": {;
                deselect_header(the_id);
                col_class = ".header" + the_id;
                $(col_class).fadeOut();
                tableObject.hidden_list.push(the_id);
                break;
            }
        }
    }
    if (menu_id == "menu-unhide") {
        tableObject.hidden_list = [];
        tableObject.build_table();
    }
}
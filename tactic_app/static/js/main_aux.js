/**
 * Created by bls910 on 7/18/15.
 */

$(".column-menu-item").click(function(e) {
    column_command(e.currentTarget.id)
    e.preventDefault()
})

$(".project-menu-item").click(function(e) {
    project_command(e.currentTarget.id)
    e.preventDefault()
})

function save_project_as() {
    var new_project_name = $("#project-name-modal-field").val();
    var result_dict = {"project_name": new_project_name,
        "header_struct": tableObject.header_struct}
    var result_as_json = JSON.stringify(result_dict)
    $.getJSON("/save_new_project", data={"the_data": result_as_json}, success=doFlash);
    var x = 7;
}

function column_command(menu_id) {
    var the_id = tableObject.selected_header
    tableObject.selected_header = null;
    if (the_id != null) {
        switch (menu_id) {
            case "menu-shift-left": {
                var parent_struct = tableObject.header_struct.find_parent_of_id(the_id);
                parent_struct.shift_child_left(the_id);
                break;
            }
            case "menu-shift-right": {
                var parent_struct = tableObject.header_struct.find_parent_of_id(the_id);
                parent_struct.shift_child_right(the_id);
                break;
            }
            case "menu-hide": {
                var my_struct = tableObject.header_struct.find_struct_by_id(the_id);
                my_struct.hidden = true;
                break;
            }
        }
        tableObject.build_table();
    }
    if (menu_id == "menu-unhide") {
        tableObject.header_struct.unhide_all();
        tableObject.build_table();
    }
}

function project_command(menu_id) {
    switch (menu_id) {
        case "menu-save-as": {
            $('#save-project-modal').modal()
        }
    }
}

function click_header(el) {
    var the_id = $(el).attr("id");
    if (the_id === tableObject.selected_header) {
        $(el).css('background-color', HEADER_NORMAL_COLOR);
        tableObject.selected_header = null
    }
    else {
        if (tableObject.selected_header != null) {
            $("#" + tableObject.selected_header).css('background-color', HEADER_NORMAL_COLOR)
        }
        $(el).css('background-color', HEADER_SELECT_COLOR);
        tableObject.selected_header = the_id
    }
}

function start_post_load() {
    $.getJSON("/grab_data/" + String(collection_name), load_stub);
}

function load_stub(data_object) {
    tableObject.load_data(data_object)
}

function resize_stub(data_object) {
    tableObject.resize_table_area()
}
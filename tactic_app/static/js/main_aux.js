/**
 * Created by bls910 on 7/18/15.
 */

$(".column-menu-item").click(function(e) {
    column_command(e.currentTarget.id)
    e.preventDefault()
})

$(".project-menu-item").click(function(e) {
    project_command(e.currentTarget.id);
    e.preventDefault()
})

function disable_menu_item(item_id) {
    $("#" + item_id).closest('li').addClass("disabled")
}

function enable_menu_item(item_id) {
    $("#" + item_id).closest('li').removeClass("disabled")
}

function save_project() {
    var result_dict = {
        "project_name": _project_name,
        "data_collection_name": _collection_name,
        "hidden_list": tableObject.hidden_list,
        "header_struct": tableObject.header_struct
    };
    $.ajax({
        url:"/update_project",
        contentType : 'application/json',
        type : 'POST',
        async: false,
        data: JSON.stringify(result_dict),
        dataType: 'json',
        success: doFlash
    });
}

function save_project_as() {
    _project_name = $("#project-name-modal-field").val();
    var result_dict = {
        "project_name": _project_name,
        "data_collection_name": _collection_name,
        "hidden_list": tableObject.hidden_list,
        "header_struct": tableObject.header_struct
    };
    $.ajax({
        url:"/save_new_project",
        contentType : 'application/json',
        type : 'POST',
        async: false,
        data: JSON.stringify(result_dict),
        dataType: 'json',
        success: doFlash
    });
    $('#save-project-modal').modal('hide')
}

function save_as_success(data_object) {
    enable_menu_item("menu-save");
    doFlash(data_object)
}

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
                deselect_header(the_id)
                $(".header" + the_id).css("display", "none");
                tableObject.hidden_list.push(the_id)
                //var my_struct = tableObject.header_struct.find_struct_by_id(the_id);
                //my_struct.hidden = true;
                break;
            }
        }
    }
    if (menu_id == "menu-unhide") {
        if (the_id != null) {
            deselect_header(the_id)
        }
        for (var i = 0; i < this.tableObject.hidden_list.length; ++i) {
            the_id = this.tableObject.hidden_list[i];
            $(".header" + the_id).css("display", "table-cell");
        }
        tableObject.hidden_list = [];
    }
}
function project_command(menu_id) {
    switch (menu_id) {
        case "menu-save-as": {
            $("#modal-area").load("/save_as_modal", function() {$('#save-as-project-modal').modal()});
        }
        case "menu-save": {
            save_project();
        }
    }
}

function disable_require_column_select (){
    $(".require-column-select").closest('li').addClass('disabled')
}

function enable_require_column_select (){
    $(".require-column-select").closest('li').removeClass('disabled')
}

function click_header(el) {
    var the_id = $(el).attr("id");
    if (the_id === tableObject.selected_header) {
        deselect_header(the_id);
        //$(el).css('background-color', HEADER_NORMAL_COLOR);
        //$(".header" + the_id).css('background-color', TABLE_NORMAL_COLOR);
        //tableObject.selected_header = null
        //disable_require_column_select()
    }
    else {
        if (tableObject.selected_header != null) {
            deselect_header(tableObject.selected_header)
            //$("#" + tableObject.selected_header).css('background-color', HEADER_NORMAL_COLOR)
            //$(".header" + tableObject.selected_header).css('background-color', TABLE_NORMAL_COLOR)
        }
        select_header(the_id);
    }
}

function deselect_header(the_id) {
    $(".header" + the_id).css('background-color', TABLE_NORMAL_COLOR);
    $("#" + the_id).css('background-color', HEADER_NORMAL_COLOR);
    tableObject.selected_header = null
    disable_require_column_select()
}

function select_header(the_id) {
    $(".header" + the_id).css('background-color', TABLE_SELECT_COLOR)
    $("#" + the_id) .css('background-color', HEADER_SELECT_COLOR);
    tableObject.selected_header = the_id
    enable_require_column_select()
}

function start_post_load() {
    if (_project_name == "") {
        $.getJSON("/grab_data/" + String(_collection_name), load_stub);
    }
    else {
        $.getJSON("/grab_project_data/" + String(_project_name), load_stub)
    }
}

function load_stub(data_object) {
    tableObject.load_data(data_object)
}

function resize_stub(data_object) {
    tableObject.resize_table_area()
}
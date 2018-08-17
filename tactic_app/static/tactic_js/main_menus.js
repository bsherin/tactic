/**
 * Created by bls910 on 8/1/15.
 */
let menus = {};
let menu_item_index = {};
let column_menu;
let project_menu;
const mousetrap = new Mousetrap();
let menu_template;


$.get($SCRIPT_ROOT + "/get_menu_template", function(template){
    menu_template = $(template).filter('#menu-template').html();
});

mousetrap.bind("esc", function() {
    if (tableObject.selected_header != null) {
        deselect_header(tableObject.selected_header)
    }
    broadcast_event_to_server("DehighlightTable", {});
    clearStatusMessage();
    stopSpinner()
});

function clear_all_menus() {
    menus = {};
    menu_item_index = {};
    $("#menu-area").html(" ")
}

class MenuObject {
    constructor (menu_name, menu_function, options) {
        this.menu_name = menu_name;
        this.options = options;
        this.perform_menu_item = menu_function;
        this.shortcuts = {}
    }

    render_menu () {
        const options_list = this.create_options_list();
        return Mustache.to_html(menu_template, {
                "menu_name": this.menu_name,
                "options": options_list
        })
    }

    create_options_list() {
        const result = [];
        let key_text;
        const scuts = menus[this.menu_name].shortcuts;
        for (let i = 0; i < this.options.length; ++i) {
            const opt = this.options[i];
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

    add_options_to_index () {
        for (let i = 0; i < this.options.length; ++i) {
            menu_item_index[this.options[i]] = this.menu_name
        }
    }

    remove_options_from_index() {
        for (let i = 0; i < this.options.length; ++i) {
            delete menu_item_index[this.options[i]]
        }
    }

    disable_items (disable_list) {
        for (let i = 0; i < disable_list.length; ++i) {
            this.disable_menu_item(disable_list[i])
        }
    }

    enable_items (enable_list) {
        for (let i = 0; i < enable_list.length; ++i) {
            this.enable_menu_item(enable_list[i])
        }
    }

    perform_menu_item (menu_id) {
    }

    disable_menu_item (item_id) {
        $("#" + item_id).addClass("disabled");
        const menu = menus[menu_item_index[item_id]];
        if (menu.shortcuts.hasOwnProperty(item_id)) {
            const scut = menu.shortcuts[item_id];
            mousetrap.unbind(scut.keys);
            if (scut.hasOwnProperty("fallthrough")) {
                mousetrap.bind(scut.keys, function (e) {
                    scut.fallthrough();
                    e.preventDefault()
                })
            }
        }
    }
    enable_menu_item (item_id) {
        $("#" + item_id).removeClass("disabled");
        const menu = menus[menu_item_index[item_id]];
        if (menu.shortcuts.hasOwnProperty(item_id)) {
            const scut = menu.shortcuts[item_id];
            //mousetrap.unbind(scut.keys);
            mousetrap.bind(scut.keys, function (e) {
                scut.command();
                e.preventDefault()
            })
        }
    }
}

function bind_to_keys(shortcuts) {
    for (let option in shortcuts) {
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

function build_and_render_menu_objects() {

    // Create the project_menu object
    if (is_notebook){
        project_menu = new MenuObject("Project", project_command,["save-as", "save"]);
    }

    else {
        project_menu = new MenuObject("Project", project_command,["save-as", "save", "open-console-as-notebook", "export-table-as-collection", "change-collection"]);
    }

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

    if (!is_notebook) {
        // Create the column_menu object
        column_menu = new MenuObject("Column", column_command,["shift-left", "shift-right", "hide", "hide-in-all-docs", "unhide", "add-column", "add-column-all-docs"]);
        menus[column_menu.menu_name] = column_menu;
        column_menu.add_options_to_index();

        bind_to_keys(project_menu.shortcuts);

        // Create the tile_menus
        for (let category in tile_types) {
            if (!tile_types.hasOwnProperty(category)) {
                continue;
            }
            const new_tile_menu = new MenuObject(category, tile_command, tile_types[category]);
            menus[new_tile_menu.menu_name] = new_tile_menu;
            new_tile_menu.add_options_to_index();
        }

    }

    render_menus();

    function render_menus() {
        for (let m in menus) {
            if (menus.hasOwnProperty(m)) {
                $("#menu-area").append(menus[m].render_menu())
            }
        }
        $(".dropdown-item").click(function(e) {
            const item_id = e.currentTarget.id;
            const menu_name = menu_item_index[item_id];
            //$(e.currentTarget).parents(".dropdown-menu").dropdown("toggle")s;
            if (!is_disabled(item_id)) {
                menus[menu_name].perform_menu_item(item_id)
            }
            e.preventDefault()
        });
        if (!is_notebook) {
            disable_require_column_select();
        }
        if (_project_name == "") {
            project_menu.disable_items(["save"]);
        }

        function is_disabled (menu_id) {
            return $("#" + menu_id).parent().hasClass("disabled")
        }
    }
}

function column_command(menu_id) {
    const sanitized_column_header = tableObject.selected_header;
    const column_header = tableObject.current_spec.header_from_sanitized_header(sanitized_column_header);
    if (sanitized_column_header != null) {
        switch (menu_id) {
            case "shift-left":
            {
                deselect_header(sanitized_column_header);
                tableObject.current_spec.shift_column_left(column_header);
                updateHeaderList();
                tableObject.broadcast_column_widths();
                dirty = true;
                break;
            }
            case "shift-right":
            {
                deselect_header(sanitized_column_header);
                tableObject.current_spec.shift_column_right(column_header);
                updateHeaderList();
                tableObject.broadcast_column_widths();
                dirty = true;
                break;
            }
            case "hide":
            {
                deselect_header(sanitized_column_header);
                const col_class = ".column-" + sanitized_column_header;
                $(col_class).fadeOut();
                tableObject.current_spec.hidden_columns_list.push(column_header);
                dirty = true;
                updateHeaderList();
                tableObject.broadcast_column_widths();
                break;
            }
            case "hide-in-all-docs":
            {
                deselect_header(sanitized_column_header);
                const col_class = ".column-" + sanitized_column_header;
                $(col_class).fadeOut();
                tableObject.current_spec.hidden_columns_list.push(column_header);
                dirty = true;
                hideColumnInAll(column_header);
                break;
            }

        }
    }
    if (menu_id == "unhide") {
        tableObject.current_spec.hidden_columns_list = ["__filename__"];
        tableObject.build_table();
        updateHeaderList();
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

function updateHeaderList() {
    const data_dict = {"header_list": tableObject.current_spec.header_list,
                       "hidden_columns_list": tableObject.current_spec.hidden_columns_list,
                       "doc_name": tableObject.current_doc_name};
    broadcast_event_to_server("UpdateHeaderListOrder", data_dict, function () {
        dirty = true
    })
}

function hideColumnInAll(column_name) {
    const data_dict = {"column_name": column_name};
    broadcast_event_to_server("HideColumnInAllDocs", data_dict, function () {
        dirty = true
    })
}

function createColumn() {
    showModal("Create Column All Docs", "New Column Name", function (new_name) {
        const column_name = new_name;
        tableObject.current_spec.header_list.push(column_name);
        let cwidth = tableObject.compute_added_column_width(column_name);
        tableObject.current_spec.column_widths.push(cwidth);
        tableObject.current_spec.sanitize_headers();
        tableObject.build_table();
        get_column(tableObject.current_spec.sanitized_header_from_header(column_name)).text(" ");  // This seems to be necessary for the column to be editable

        const data_dict = {"column_name": column_name, "column_width": cwidth, "all_docs": true};
        broadcast_event_to_server("CreateColumn", data_dict, function () {
            dirty = true
        })
    })
}

function createColumnThisDoc() {
    showModal("Create Column This Doc", "New Column Name", function (new_name) {
        const column_name = new_name;
        tableObject.current_spec.header_list.push(column_name);
        let cwidth = tableObject.compute_added_column_width(column_name);
        tableObject.current_spec.column_widths.push(cwidth);
        tableObject.current_spec.sanitize_headers();
        tableObject.build_table();
        get_column(tableObject.current_spec.sanitized_header_from_header(column_name)).text(" ");  // This seems to be necessary for the column to be editable

        const data_dict = {"column_name": column_name,
                           "doc_name": tableObject.current_doc_name,
                            "column_width": cwidth,
                           "all_docs": false};
        broadcast_event_to_server("CreateColumn", data_dict, function () {
            dirty = true
        });
    })
}

function changeCollection() {
    startSpinner();
    postWithCallback("host", "get_collection_names",{"user_id": user_id}, function (data) {
        let collection_names = data["collection_names"];
        let option_names = [];
        for (var collection of collection_names) {
            option_names.push({"option": collection})
        }
        showSelectModal("Select New Collection", "New Collection", changeTheCollection, option_names)
    });

    function changeTheCollection(new_collection_name) {
        const result_dict = {
                "new_collection_name": new_collection_name,
                "main_id": main_id
            };

        postWithCallback(main_id, "change_collection", result_dict, changeCollectionResult);
        function changeCollectionResult(data_object) {
            if (data_object.success) {
                doc_names = data_object.doc_names;
                _collection_name = data_object.collection_name;
                $("#doc-selector-label").html(data_object.short_collection_name);
                let doc_popup = "";
                for (let dname of doc_names) {
                    doc_popup = doc_popup + `<option>${dname}</option>`
                }
                $("#doc-selector").html(doc_popup);
                change_doc($("#doc-selector")[0], null);
                stopSpinner();
            }
            else {
                clearStatusMessage();
                data_object["message"] = data_object["message_string"];
                doFlashStopSpinner(data_object)
            }
        }
    }

}

function consoleToNotebook() {
    const result_dict = {
        "main_id": main_id,
        "console_html": $("#console").html(),
        "user_id": user_id,
        "console_cm_code": consoleObject.getConsoleCMCode(),
    };
    postWithCallback(main_id, "console_to_notebook", result_dict)
}

function saveProjectAs() {
    startSpinner();
    postWithCallback("host", "get_project_names", {"user_id": user_id}, function (data) {
        let checkboxes;
        if (is_notebook) {
            checkboxes = []
        }
        else {
            checkboxes = [{"checkname": "purgetiles", "checktext": "Include only currently used tiles"}];
        }
        showModal("Save Project As", "New Project Name", CreateNewProject,
                  "NewProject", data["project_names"], checkboxes)
    });

    function CreateNewProject (new_name, checkresults) {
            const result_dict = {
                "project_name": new_name,
                "main_id": main_id,
                "console_html": $("#console").html(),
                "console_cm_code": consoleObject.getConsoleCMCode(),
                "doc_type": DOC_TYPE
            };

            // tableObject.startTableSpinner();
            if (is_notebook) {
                postWithCallback(main_id, "save_new_notebook_project", result_dict, save_as_success);
            }
            else {
                result_dict["purgetiles"] = checkresults["purgetiles"];
                postWithCallback(main_id, "save_new_project", result_dict, save_as_success);
            }

            function save_as_success(data_object) {
                if (data_object["success"]) {
                    //tableObject.stopTableSpinner();
                    clearStatusMessage();
                    menus["Project"].enable_menu_item("save");
                    tableObject.project_name = data_object["project_name"];
                    //tableObject.set_table_title()
                    // $("#project-name").html(tableObject.project_name);
                    $("title").html(data_object["project_name"]);
                    data_object.alert_type = "alert-success";
                    data_object.timeout = 2000;
                    _project_name = data_object.project_name;  // When menus recreated, it checks _project_name
                    dirty = false;
                    data_object["message"] = data_object["message_string"];

                    postWithCallback("host", "update_project_selector_list", {'user_id': user_id});
                    doFlashStopSpinner(data_object);
                }
                else {
                    //tableObject.stopTableSpinner();
                    clearStatusMessage();
                    data_object["message"] = data_object["message_string"];
                    data_object["alert-type"] = "alert-warning";
                    doFlashStopSpinner(data_object)
                }
            }
    }
}

function save_project() {
    const result_dict = {
        "main_id": main_id,
        "console_html": $("#console").html(),
        "console_cm_code": consoleObject.getConsoleCMCode()
    };

    //tableObject.startTableSpinner();
    startSpinner();
    postWithCallback(main_id, "update_project", result_dict, updateSuccess);
    function updateSuccess(data) {
        if (data.success) {
            tableObject.stopTableSpinner();
            clearStatusMessage();
            data.alert_type = "alert-success";
            dirty = false;
            data.timeout = 2000;
            doFlashStopSpinner(data)
        }
        else {
            tableObject.stopTableSpinner();
            clearStatusMessage();
            data.alert_type = "alert-warning";
            dirty = false;
            doFlashStopSpinner(data)
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
        case "open-console-as-notebook":
        {
            consoleToNotebook();
            break;
        }
        case "export-table-as-collection":
        {
            exportDataTable();
            break;
        }
        case "change-collection":
        {
            changeCollection();
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
            const result_dict = {
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
    const existing_tile_names = [];
    for (let tile_id in tile_dict) {
        if (!tile_dict.hasOwnProperty(tile_id)) continue;
        existing_tile_names.push(tile_dict[tile_id].tile_name)
    }
    showModal("Create " + menu_id, "New Tile Name", createNewTile, menu_id, existing_tile_names);

    function createNewTile(tile_name) {
        startSpinner();
        statusMessageText("Creating Tile " + tile_name);
        const data_dict = {};
        const tile_type = menu_id;
        data_dict["tile_name"] = tile_name;
        data_dict["tile_type"] = tile_type;
        data_dict["user_id"] = user_id;
        data_dict["parent"] = main_id;
        postWithCallback(main_id, "create_tile", data_dict, function (create_data) {

            if (create_data.success) {
                let tile_id = create_data["tile_id"];
                data_dict["form_html"] = create_data["html"];
                data_dict["tile_id"] = create_data["tile_id"];
                postWithCallback("host", "render_tile", data_dict, function (render_data) {
                    const new_tile_object = new TileObject(tile_id, render_data.html, true, tile_name);
                    tile_dict[tile_id] = new_tile_object;
                    new_tile_object.spin_and_refresh();
                    exportViewerObject.update_exports_popup();
                    dirty = true;
                    clearStatusMessage();
                    stopSpinner();
                })
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





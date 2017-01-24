/**
 * Created by bls910 on 10/4/15.
 */
let current_theme = "default";
let myCodeMirror;
let myDPCodeMirror;
let savedCode = null;
let savedTags = null;
let savedNotes = null;
let savedCategory = null;
let savedMethods = null;
const user_manage_id = guid();
let is_mpl = null;
let this_viewer = "creator";
let savedDPCode;

let parsed_data;
const resource_managers = {};


function start_post_load() {
    if (use_ssl) {
        socket = io.connect('https://'+ document.domain + ':' + location.port  + '/user_manage');
    }
    else {
        socket = io.connect('http://'+document.domain + ':' + location.port  + '/user_manage');
    }
    socket.emit('join', {"user_id":  user_id, "user_manage_id":  user_manage_id});

    window.onresize = function () {
        resize_all_areas();
    };

    $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
        if ($(e.currentTarget).attr("value") == "method") {
            resize_method_module();
            resource_managers["method_module"].cmobject.refresh();
        }
    });

    socket.on('doflash', doFlash);

    postAjaxPromise("parse_code", {"module_name": module_name})
        .then((result) => {
            setup_code_areas(result);
            setup_resource_modules();
            create_api_listeners()
        })
        .catch(doFlash)
}

function setup_code_areas(result) {
    parsed_data = result;
    savedMethods = parsed_data.extra_functions;
    savedTags = parsed_data.tags;
    savedNotes = parsed_data.notes;
    savedCategory = parsed_data.category;
    is_mpl = parsed_data.is_mpl;

    set_metadata_fields(parsed_data.datestring, parsed_data.tags, parsed_data.notes, parsed_data.category);

    const codearea = document.getElementById("codearea");
    myCodeMirror = createCMArea(codearea, false, parsed_data.render_content_code, parsed_data.render_content_line_number + 1);
    savedCode = myCodeMirror.getDoc().getValue();

    if (is_mpl) {
        const drawplotcodearea = document.getElementById("drawplotcodearea");
        myDPCodeMirror = createCMArea(drawplotcodearea, false, parsed_data.draw_plot_code, parsed_data.draw_plot_line_number + 1);
        let dpba = $("#drawplotboundingarea");
        dpba.css("display", "block");
        savedDPCode = myDPCodeMirror.getDoc().getValue();
        dpba.resizable({
                handles: "s",
                resize: function (event, ui) {
                    resize_dparea_from_height(ui.size.height);
                    resize_code_area();
                }
            });
    }
}

function setup_resource_modules() {
    $.get($SCRIPT_ROOT + "/get_resource_module_template", function(template) {
        resource_module_template = $(template).filter('#resource-module-template').html();

        // Note there's a kluge here: these managers require the global variable parsed_data to be set.
        resource_managers["option_module"] = new OptionManager("option_module", "option", resource_module_template, "#option-module-holder");
        resource_managers["export_module"] = new ExportManager("export_module", "export", resource_module_template, "#export-module-holder");
        resource_managers["method_module"] = new MethodManager("method_module", "method", resource_module_template, "#method-module-holder");

        $(".resource-module").on("click", ".main-content .selector-button", selector_click);
        $("#export-create-button").on("click", {"manager": resource_managers["export_module"]}, resource_managers["export_module"].createNewExport);
        $("#option-create-button").on("click", {"manager": resource_managers["option_module"]}, resource_managers["option_module"].createNewOption);

    });
}

function create_api_listeners() {
    const acc = document.getElementsByClassName("accordion");
    for (let element of acc) {
        element.onclick = function(){
            this.classList.toggle("active");
            this.nextElementSibling.classList.toggle("show");
        }
    }
    resize_all_areas();
}

function rebuild_autocomplete_list() {
    if (resource_managers.hasOwnProperty("option_module") && resource_managers.hasOwnProperty("export_module")) {
        extra_autocomplete_list = resource_managers["option_module"].get_option_names();
        extra_autocomplete_list.concat(resource_managers["export_module"].export_list)
    }
}

class OptionManager extends CreatorResourceManager {
    set_extra_properties() {
        super.set_extra_properties();
        this.update_view = "get_option_table";
        this.option_dict = parsed_data.option_dict;
        this.data_attr = "option_dict";
        this.button_groups = [
            {
                "buttons": [
                    {"name": "delete", "func": "delete_option_func", "button_class": "btn-default"},
                    {"name": "refresh", "func": "refresh_option_table", "button_class": "btn-default"}
                ]
            }
        ]
    }

    add_listeners() {
        super.add_listeners();
        $("#option-type-input").on("change", function () {
            let option_type = $("#option-type-input").val();
            if (option_type == "custom_list") {
                $("#special-list-group").css("display", "inline-block");
                $("#option-tag-group").css("display", "none")
            }
            else if ((option_type == "class_select") || (option_type == "function_select")) {
                $("#option-tag-group").css("display", "inline-block");
                $("#special-list-group").css("display", "none")
            }
            else {
                $("#special-list-group").css("display", "none");
                $("#option-tag-group").css("display", "none")
            }
            });
    }

    refresh_option_table (event) {
        let manager = event.data.manager;
        manager.update_main_content();
        return false
    }

    get_option_names () {
        let result = [];
        for (let opt of this.option_dict) {
            result.push(opt.name)
        }
        return result
    }

    delete_option_func (event) {
        let manager = event.data.manager;
        let option_name = manager.check_for_selection("option", 0);
        const confirm_text = "Are you sure that you want to delete option " + option_name + "?";
        confirmDialog("Delete Option", confirm_text, "do nothing", "delete", function () {
            const index = manager.option_index(option_name);
            manager.option_dict.splice(index, 1);
            manager.changed = true;
            manager.update_main_content()
        });
        return false
    }

    option_index (option_name) {
        for (let i = 0; i < this.option_dict.length; ++i) {
            if (option_name == this.option_dict[i].name) {
                return i
            }
        }
        return -1
    }

    option_exists (option_name) {
        for (let opt of this.option_dict) {
            if (option_name == opt.name) {
                return true
            }
        }
        return false
    }

    getInteger (val) {
        i = parseInt(val);
        if (isNaN(i) || i != parseFloat(val)) {
            return false
        }
        else {
            return i
        }
    }

    createNewOption (event) {
        let manager = event.data.manager;
        // let manager = resource_managers["option_module"];
        let option_name = $("#option-name-input").val();
        let option_type = $("#option-type-input").val();
        let option_default = $("#option-default-input").val();
        if (option_name.length == 0) {
            doFlash({"message": "Specify an option name.", "alert_type": "alert-warning"})
        }
        else if (manager.option_exists(option_name)) {
            doFlash({"message": "Option name exists.", "alert_type": "alert-warning"})
        }
        else {
            let new_option = {"name": option_name, "type": option_type};
            if (option_default.length > 0) {
                if (option_type == "int") {
                    option_default = manager.getInteger(option_default);
                    if (!option_default) {
                        doFlash({"message": "Invalid default value.", "alert_type": "alert-warning"});
                        return false
                    }
                }
                else if (option_type == "boolean") {
                    if (["true", "True", "false", "false"].indexOf(option_default) == -1) {
                        doFlash({"message": "Invalid default value.", "alert_type": "alert-warning"});
                        return false
                    }
                    option_default = (option_default == "true") || (option_default == "True");
                }
                new_option["default"] = option_default;
            }
            if (option_type == "custom_list") {
                new_option["special_list"] = $("#option-list-input").val();
            }
            else if ((option_type == "class_select") || (option_type == "function_select")) {
                new_option["tag"] = $("#option-tag-input").val()
            }
            manager.option_dict.push(new_option);
            manager.changed = true;
            manager.update_main_content();
        }
        return false
    }
}

class ExportManager extends CreatorResourceManager {

    set_extra_properties() {
        super.set_extra_properties();
        this.update_view = "get_export_table";
        this.export_list = parsed_data.export_list;
        this.data_attr = "export_list";
        this.button_groups = [
            {"buttons": [
                    {"name": "delete", "func": "delete_export_func", "button_class": "btn-default"},
                    {"name": "refresh", "func": "refresh_export_table", "button_class": "btn-default"}]
            }]
    }

    refresh_export_table () {
        this.update_main_content()
    }

    delete_export_func (event) {
        const manager = event.data.manager;
        let export_name = manager.check_for_selection("export", 0);
        const confirm_text = "Are you sure that you want to delete export " + export_name + "?";
        confirmDialog("Delete Export", confirm_text, "do nothing", "delete", function () {
            const index = manager.export_list.indexOf(export_name);
            manager.export_list.splice(index, 1);
            manager.changed = true;
            manager.update_main_content()
        });
        return false
    }


    createNewExport (event) {
        const manager = event.data.manager;
        let export_name = $("#export-name-input").val();
        if (manager.export_list.indexOf(export_name) != -1) {
            doFlash({"message": "Export already exists.", "alert_type": "alert-warning"});
            return false
        }
        else {
            manager.export_list.push(export_name);
            manager.changed = true;
            manager.update_main_content()
        }
        return false
    }
}

class MethodManager extends CreatorResourceManager {

    set_extra_properties() {
        super.set_extra_properties();
        this.extra_functions = parsed_data.extra_functions;
        this.data_attr = "extra_functions";
        this.include_button_well = false;
    }

    update_main_content() {
        this.cmobject = createCMArea(this.get_main_content_dom()[0], false);
        this.get_main_content_dom().find(".CodeMirror").resizable({handles: "se"});
        this.get_main_content_dom().find(".CodeMirror").height(100);
        this.fill_content();
    }

    fill_content () {
        this.cmobject.setValue(this.extra_functions)
    }

    get_extra_functions () {
        return this.cmobject.getValue()
    }

    refresh_methods () {
        this.fill_content()
    }
}

function resize_dparea() {
    let dpba = $("#drawplotboundingarea");
    if (dpba.length > 0) {
        let the_height = [window.innerHeight - dpba.offset().top - 20] / 2;
        resize_dparea_from_height(the_height)
    }
}

function resize_dparea_from_height(the_height) {
    let dpba = $("#drawplotboundingarea");
    dpba.css('height', the_height);
    let dpca = $("#drawplotcodearea");
    if (dpca.length > 0) {
        let dpca_height = the_height - (dpca.offset().top - dpba.offset().top);
        dpca.css('height', dpca_height);
        $("#drawplotcodearea .CodeMirror").css('height', dpca_height);
    }
    if (myDPCodeMirror != null) {
        myDPCodeMirror.refresh();
    }
}

function resize_code_area() {
    resize_dom_to_bottom_given_selector("#codearea", 20);
    resize_dom_to_bottom_given_selector("#codearea .CodeMirror", 20);
    if (myCodeMirror != null) {
        myCodeMirror.refresh();
    }
}

function resize_method_module() {
    resize_dom_to_bottom_given_selector("#method_module .CodeMirror", 20);
}

function resize_api_and_tab_areas() {
    resize_dom_to_bottom_given_selector("#api-area", 20);
    resize_dom_to_bottom_given_selector(".tab-pane", 20);
}

function resize_all_areas() {
    if (is_mpl) {
        resize_dparea()
    }
    resize_code_area();
    resize_method_module();
    resize_api_and_tab_areas()
}

function set_metadata_fields(created, tags, notes, category = null) {
    $(".created").html(created);
    $("#tile-tags")[0].value = tags;
    $("#tile-notes")[0].value = notes;
    if (category != null) {
        $("#tile-category")[0].value = category;
    }
}

function selector_click(event) {
    const row_element = $(event.target).closest('tr');
    resource_managers[get_current_res_type() + "_module"].selector_click(row_element[0])
}

function insertApiItem(the_item) {
    myCodeMirror.getDoc().replaceSelection("self." + api_dict_by_name[the_item].signature);
    return false
}

function insertApiItemDP(the_item) {
    myDPCodeMirror.getDoc().replaceSelection("self." + api_dict_by_name[the_item].signature);
    return false
}
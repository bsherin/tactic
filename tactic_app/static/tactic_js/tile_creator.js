/**
 * Created by bls910 on 10/4/15.
 */

let creator_viewer;

function start_post_load() {
    creator_viewer = new CreatorViewer(module_name, "tile", "parse_code");
    creator_viewer.resize_all_areas();
}

class CreatorViewer extends ModuleViewerAbstract {
    do_extra_setup () {
        super.do_extra_setup();
        this.this_viewer = "creator";
        this.savedCategory = null;
        this.savedMethods = null;
        this.resource_managers = {};
        this.is_mpl = false;
        this.savedCode = null;
        this.savedDPCode = null;
        this.myCodeMirror = null;
        this.myDPCodeMirror = null;
        let self = this;
        $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
            if ($(e.currentTarget).attr("value") == "method") {
                self.resize_method_module();
                self.resource_managers["method_module"].cmobject.refresh();
            }
        });
        window.onresize = function () {
            self.resize_all_areas();
        };
    }

    get exportManager() {
        return this.resource_managers["export_module"]
    }

    get optionManager() {
        return this.resource_managers["option_module"]
    }

    get methodManager() {
        return this.resource_managers["method_module"]
    }

    get button_bindings() {
        return {"save_button": this.saveMe,
            "save_as_button": this.saveModuleAs,
            "load_button": this.loadModule,
            "share_button": this.sendToRepository,
            "change_theme_button": this.changeTheme,
            "show_api_button": this.showAPI}
    }

    got_resource (the_content) {
        this.parsed_data = the_content;
        this.setup_code_areas();
        this.setup_resource_modules();
        let self = this;
        postAjaxPromise("get_api_html", {})
            .then(function (data) {
                $("#aux-area").html(data.api_html);
                self.create_api_listeners();
                self.resize_all_areas()
            })
            .catch(doFlash);
    }

    setup_code_areas() {
        this.savedMethods = this.parsed_data.extra_functions;
        this.is_mpl = this.parsed_data.is_mpl;

        const codearea = document.getElementById("codearea");
        this.myCodeMirror = this.createCMArea(codearea, false, this.parsed_data.render_content_code, this.parsed_data.render_content_line_number + 1);
        this.savedCode = this.myCodeMirror.getDoc().getValue();

        if (this.is_mpl) {
            const drawplotcodearea = document.getElementById("drawplotcodearea");
            this.myDPCodeMirror = this.createCMArea(drawplotcodearea, false, this.parsed_data.draw_plot_code, this.parsed_data.draw_plot_line_number + 1);
            let dpba = $("#drawplotboundingarea");
            dpba.css("display", "block");
            this.savedDPCode = this.myDPCodeMirror.getDoc().getValue();
            let self = this;
            dpba.resizable({
                    handles: "s",
                    resize: function (event, ui) {
                        self.resize_dparea_from_height(ui.size.height);
                        self.resize_code_area();
                    }
                });
        }
    }

    setup_resource_modules() {
        let self = this;
        let result_dict = {"res_type": this.res_type, "res_name": this.resource_name};
        postAjaxPromise("grab_metadata", result_dict)
            .then(function (data) {
                self.set_metadata_fields(data.date_string, data.tags, data.notes, self.parsed_data.category)
            })
            .catch(function () {
                self.set_metadata_fields("", "", "", "")
            });
        $.get($SCRIPT_ROOT + "/get_resource_module_template", function(template) {
            const resource_module_template = $(template).filter('#resource-module-template').html();

            // Note there's a kluge here: these managers require the global variable parsed_data to be set.
            self.resource_managers["option_module"] = new OptionManager("option_module", "option", resource_module_template, "#option-module-holder", {"viewer": self});
            self.resource_managers["export_module"] = new ExportManager("export_module", "export", resource_module_template, "#export-module-holder", {"viewer": self});
            self.resource_managers["method_module"] = new MethodManager("method_module", "method", resource_module_template, "#method-module-holder", {"viewer": self});

            $(".resource-module").on("click", ".main-content .selector-button", {"viewer": self}, self.selector_click);
            $("#export-create-button").on("click", {"manager": self.resource_managers["export_module"]}, self.resource_managers["export_module"].createNewExport);
            $("#option-create-button").on("click", {"manager": self.resource_managers["option_module"]}, self.resource_managers["option_module"].createNewOption);

        });
    }

    set_metadata_fields(created, tags, notes, category=null) {
        super.set_metadata_fields(created, tags, notes);
        if (category != null) {
            $("#category")[0].value = category;
            this.savedCategory = category;
        }
    }

    rebuild_autocomplete_list() {
        if (this.resource_managers.hasOwnProperty("option_module") && this.resource_managers.hasOwnProperty("export_module")) {
            this.extra_autocomplete_list = this.resource_managers["option_module"].get_option_names();
            this.extra_autocomplete_list.concat(this.resource_managers["export_module"].export_list)
        }
    }

    resize_dparea() {
        let dpba = $("#drawplotboundingarea");
        if (dpba.length > 0) {
            let the_height = [window.innerHeight - dpba.offset().top - 20] / 2;
            this.resize_dparea_from_height(the_height)
        }
    }
    resize_dparea_from_height(the_height) {
        let dpba = $("#drawplotboundingarea");
        dpba.css('height', the_height);
        let dpca = $("#drawplotcodearea");
        if (dpca.length > 0) {
            let dpca_height = the_height - (dpca.offset().top - dpba.offset().top);
            dpca.css('height', dpca_height);
            $("#drawplotcodearea .CodeMirror").css('height', dpca_height);
        }
        if (this.myDPCodeMirror != null) {
            this.myDPCodeMirror.refresh();
        }
    }
    resize_code_area() {
        resize_dom_to_bottom_given_selector("#codearea", 20);
        resize_dom_to_bottom_given_selector("#codearea .CodeMirror", 20);
        if (this.myCodeMirror != null) {
            this.myCodeMirror.refresh();
        }
    }

    resize_method_module() {
        resize_dom_to_bottom_given_selector("#method_module .CodeMirror", 20);
    }

    resize_api_and_tab_areas() {
        resize_dom_to_bottom_given_selector("#aux-area", 20);
        resize_dom_to_bottom_given_selector(".tab-pane", 20);
    }

    resize_all_areas() {
        if (this.is_mpl) {
            this.resize_dparea()
        }
        this.resize_code_area();
        this.resize_method_module();
        this.resize_api_and_tab_areas()
    }

    selector_click(event) {
        const row_element = $(event.target).closest('tr');
        event.data.viewer.resource_managers[get_current_res_type() + "_module"].selector_click(row_element[0])
    }

    insertApiItem(the_item) {
        this.myCodeMirror.getDoc().replaceSelection("self." + this.api_dict_by_name[the_item].signature);
        return false
    }

    insertApiItemDP(the_item) {
        this.myDPCodeMirror.getDoc().replaceSelection("self." + this.api_dict_by_name[the_item].signature);
        return false
    }
}

class OptionManager extends CreatorResourceManager {
    set_extra_properties() {
        super.set_extra_properties();
        this.update_view = "get_option_table";
        this.option_dict = this.viewer.parsed_data.option_dict;
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
        this.export_list = this.viewer.parsed_data.export_list;
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
        this.extra_functions = this.viewer.parsed_data.extra_functions;
        this.data_attr = "extra_functions";
        this.include_button_well = false;
    }

    update_main_content() {
        this.cmobject = this.viewer.createCMArea(this.get_main_content_dom()[0], false);
        this.get_main_content_dom().find(".CodeMirror").resizable({handles: "se"});
        this.get_main_content_dom().find(".CodeMirror").height(100);
        this.fill_content();
    }

    fill_content () {
        this.cmobject.setValue(this.extra_functions)
    }

    get_extra_functions () {
        return this.cmobject.getDoc().getValue()
    }

    refresh_methods () {
        this.fill_content()
    }
}


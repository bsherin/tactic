/**
 * Created by bls910 on 10/4/15.
 */

let creator_viewer;

const BOTTOM_MARGIN = 50;

const HEARTBEAT_INTERVAL = 10000; //milliseconds
setInterval( function(){
   postAjax("register_heartbeat", {"main_id": main_id}, function () {});
}, HEARTBEAT_INTERVAL );

class CreatorViewerSocket extends TacticSocket {
    initialize_socket_stuff () {
        this.socket.emit('join', {"room": user_id});
        this.socket.emit('join-main', {"room": module_viewer_id});
        this.socket.on('stop-spinner', stopSpinner);
        this.socket.on('start-spinner', startSpinner);
        this.socket.on('handle-callback', handleCallback);
        this.socket.on('close-user-windows', (data) => {
            if (!(data["originator"] == this.user_manage_id)) {
                window.close()
            }
        });
        this.socket.on("doFlash", function(data) {
            doFlash(data)
        });
    }
}

function start_post_load() {
    startSpinner();
    statusMessageText("loading " + module_name);
    tsocket = new CreatorViewerSocket("main", 5000);
    tsocket.socket.on("begin-post-load", function () {
            creator_viewer = new CreatorViewer(module_name, "tile", "initialize_module_viewer_container");
            creator_viewer.resize_to_window();
        });
    tsocket.socket.emit('ready-to-begin', {"room": main_id});
}

class CreatorViewer extends ModuleViewerAbstract {
    constructor(resource_name, res_type, get_url) {
        super(resource_name, res_type, null);

        let the_content = {"module_name": module_name,
                        "module_viewer_id": module_viewer_id,
                        "tile_collection_name": tile_collection_name,
                        "user_id": user_id,
                        "version_string": version_string};
        postWithCallback(module_viewer_id, "initialize_parser", the_content, this.got_parsed_data);

    }

    got_parsed_data(data_object) {
        creator_viewer.parsed_data = data_object["the_content"];
        creator_viewer.is_mpl = creator_viewer.parsed_data.is_mpl;
        creator_viewer.is_d3 = creator_viewer.parsed_data.is_d3;
        creator_viewer.setup_code_areas();
        creator_viewer.setup_resource_modules();
        self = creator_viewer;
        self.resize_to_window();
        clearStatusMessage();
        stopSpinner()
    }
    do_extra_setup () {
        super.do_extra_setup();
        this.this_viewer = "creator";
        this.savedCategory = null;
        this.resource_managers = {};
        this.is_mpl = false;
        this.is_d3 = false;
        this.myCodeMirror = null;
        this.myDPCodeMirror = null;
        this.myJSCodeMirror = null;
        this.current_tab_selector = "#metadata-module-outer";
        let self = this;
        $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
            self.current_tab_selector = $(e.currentTarget).attr("href");
            resize_dom_to_bottom_given_selector(self.current_tab_selector, BOTTOM_MARGIN);
            if ($(e.currentTarget).attr("value") == "method") {
                self.resize_method_module();
                self.resource_managers["method_module"].cmobject.refresh();
            }
        });
    }

    update_width(new_width_fraction) {
        const main_width = $("#main-container").width();
        const usable_width = main_width - 10 - 15;  // 15 is for the row outdent, 10 is a fudge factor
        this.current_width_fraction = new_width_fraction;
        this.left_div.width(usable_width * new_width_fraction);
        const left_div_margin = 25;  // This is hard coped in tile_creator.html
        if (include_right) {
            this.right_div.width((1 - new_width_fraction) * usable_width - left_div_margin)
        }
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
            "checkpoint_button": this.saveAndCheckpoint,
            "save_as_button": this.saveModuleAs,
            "load_button": this.loadModule,
            "share_button": this.sendToRepository,
            "history_button": this.showHistoryViewer,
            "differ_button": this.showTileDiffer,}
    }

    setup_code_areas() {
        const codearea = document.getElementById("codearea");
        this.myCodeMirror = this.createCMArea(codearea, false, this.parsed_data.render_content_code, this.parsed_data.render_content_line_number + 1);
        this.myCodeMirror.getDoc().markClean();

        if (this.is_mpl) {
            const drawplotcodearea = document.getElementById("drawplotcodearea");
            this.myDPCodeMirror = this.createCMArea(drawplotcodearea, false, this.parsed_data.draw_plot_code, this.parsed_data.draw_plot_line_number + 1);
            let dpba = $("#drawplotboundingarea");
            dpba.css("display", "block");
            this.myDPCodeMirror.getDoc().markClean();
            let self = this;
            dpba.resizable({
                    handles: "s",
                    resize: function (event, ui) {
                        self.resize_dparea_from_height(ui.size.height);
                        self.resize_code_area();
                    }
                });
        }

        if (this.is_d3) {
            const jscriptcodearea = document.getElementById("jscriptcodearea");
            this.myJSCodeMirror = this.createJSCMArea(jscriptcodearea, false, this.parsed_data.jscript_code, 1);
            let jsba = $("#jscriptboundingarea");
            jsba.css("display", "block");
            this.myJSCodeMirror.getDoc().markClean();
            let self = this;
            jsba.resizable({
                    handles: "s",
                    resize: function (event, ui) {
                        self.resize_jsarea_from_height(ui.size.height);
                        self.resize_code_area();
                    }
                });
        }
    }

    setup_resource_modules() {
        let self = this;
        let result_dict = {"res_type": this.res_type, "res_name": this.resource_name, "is_repository": false};
        postAjaxPromise("grab_metadata", result_dict)
            .then(function (data) {
                self.set_metadata_fields(data.datestring, data.tags, data.notes, self.parsed_data.category);
            })
            .catch(function () {
                self.set_metadata_fields("", "", "", "")
            });
        $.get($SCRIPT_ROOT + "/get_resource_module_template", function(template) {
            const resource_module_template = $(template).filter('#resource-module-template').html();

            // Note there's a kluge here: these managers require the global variable parsed_data to be set.
            let extras = {"viewer": self, "module_viewer_id": module_viewer_id};
            self.resource_managers["option_module"] = new OptionManager("option_module", "option", resource_module_template, "#option-module-holder", extras);
            self.resource_managers["export_module"] = new ExportManager("export_module", "export", resource_module_template, "#export-module-holder", extras);
            self.resource_managers["method_module"] = new MethodManager("method_module", "method", resource_module_template, "#method-module-holder", extras);

            $(".resource-module").on("click", ".main-content .selector-button", {"viewer": self}, self.selector_click);
            $("#export-create-button").on("click", {"manager": self.resource_managers["export_module"]}, self.resource_managers["export_module"].createNewExport);
            $("#option-create-button").on("click", {"manager": self.resource_managers["option_module"]}, self.resource_managers["option_module"].createNewOption);

        });
    }

    doSavePromise() {
        let self = this;
        return new Promise (function (resolve, reject) {
            const new_code = self.myCodeMirror.getDoc().getValue();
            const tags = self.get_tags_string();
            const notes = $("#notes").val();
            let result_dict;
            let category;

            category = $("#category").val();
            if (category.length == 0) {
                category = "basic"
            }
            let new_dp_code = "";
            if (self.is_mpl) {
                new_dp_code = self.myDPCodeMirror.getDoc().getValue();
            }
            let new_js_code = "";
            if (self.is_d3) {
                new_js_code = self.myJSCodeMirror.getDoc().getValue();
            }
            result_dict = {
                "module_name": self.resource_name,
                "category": category,
                "tags": tags,
                "notes": notes,
                "exports": self.exportManager.export_list,
                "options": self.optionManager.option_dict,
                "extra_methods": self.methodManager.get_extra_functions(),
                "render_content_body": new_code,
                "is_mpl": self.is_mpl,
                "is_d3": self.is_d3,
                "draw_plot_body": new_dp_code,
                "jscript_body": new_js_code,
                "last_saved": self.this_viewer
            };
            postWithCallback(module_viewer_id, "update_module", result_dict, function (data) {
                if (data.success) {
                    self.save_success(data, new_code, tags, notes, category);
                    data.new_code = new_code;
                    resolve(data)
                }
                else {
                    reject(data)
                }
            })
        })
    }

    save_success(data, new_code, tags, notes, category) {
        let self = this;
        if (data.render_content_line_number != 0) {
            self.myCodeMirror.setOption("firstLineNumber", data.render_content_line_number + 1);
            self.myCodeMirror.refresh()
        }
        if (data.extra_methods_line_number != 0) {
            self.methodManager.extra_methods_line_number = data.extra_methods_line_number;
            self.methodManager.cmobject.setOption("firstLineNumber", data.extra_methods_line_number);
            self.methodManager.cmobject.refresh();
            self.methodManager.cmobject.markClean();
        }
        if ((self.is_mpl) && (data.draw_plot_line_number != 0)) {
            self.myDPCodeMirror.setOption("firstLineNumber", data.draw_plot_line_number + 1);
            self.myDPCodeMirror.refresh();
        }
        self.myCodeMirror.getDoc().markClean();
        self.savedTags = tags;
        self.savedNotes = notes;
        data.timeout = 2000;
        self.savedCategory = category;
        if (self.is_mpl) {
            self.myDPCodeMirror.getDoc().markClean();

        }
        if (self.is_d3) {
            self.myJSCodeMirror.getDoc().markClean();
        }
    }

    set_metadata_fields(created, tags, notes, category=null) {
        $("#created").html(created);
        this.set_tag_list(tags);
        this.markdown_helper.setNotesValue(this.meta_outer, notes);
        this.savedTags = tags;
        this.savedNotes = notes;
        this.markdown_helper.convertMarkdown(this.meta_outer, true, "#metadata-module-outer");
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
    resize_jsarea() {
        let jsba = $("#jscriptboundingarea");
        if (jsba.length > 0) {
            let the_height = [window.innerHeight - jsba.offset().top - 20] / 2;
            this.resize_jsarea_from_height(the_height)
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
    resize_jsarea_from_height(the_height) {
        let jsba = $("#jscriptboundingarea");
        jsba.css('height', the_height);
        let jsca = $("#jscriptcodearea");
        if (jsca.length > 0) {
            let jsca_height = the_height - (jsca.offset().top - jsba.offset().top);
            jsca.css('height', jsca_height);
            $("#jscriptcodearea .CodeMirror").css('height', jsca_height);
        }
        if (this.myJSCodeMirror != null) {
            this.myJSCodeMirror.refresh();
        }
    }
    resize_code_area() {
        resize_dom_to_bottom_given_selector("#codearea", BOTTOM_MARGIN);
        resize_dom_to_bottom_given_selector("#codearea .CodeMirror", BOTTOM_MARGIN);
        if (this.myCodeMirror != null) {
            this.myCodeMirror.refresh();
        }
    }

    resize_method_module() {
        resize_dom_to_bottom_given_selector("#method_module .CodeMirror", BOTTOM_MARGIN);
    }

    resize_api_and_tab_areas() {
        resize_dom_to_bottom_given_selector("#aux-area", BOTTOM_MARGIN);
        resize_dom_to_bottom_given_selector(this.current_tab_selector, BOTTOM_MARGIN);
    }

    resize_to_window() {
        if (this.is_mpl) {
            this.resize_dparea()
        }
        if (this.is_d3) {
            this.resize_jsarea()
        }
        for (let manager in this.resource_managers) {
            this.resource_managers[manager].resize_to_window()
        }
        this.resize_code_area();
        this.resize_api_and_tab_areas();
        this.update_width(this.current_width_fraction);
        this.markdown_helper.updateMarkdownHeight(this.meta_outer, "#metadata-module-outer");
    }

    selector_click(event) {
        const row_element = $(event.target).closest('tr');
        event.data.viewer.resource_managers[get_current_res_type() + "_module"].selector_click(row_element[0])
    }

    insertApiItem(the_item) {
        if (this.api_dict_by_name[the_item].category == "Global Functions") {
            this.myCodeMirror.getDoc().replaceSelection(this.api_dict_by_name[the_item].signature);
        }
        else {
            this.myCodeMirror.getDoc().replaceSelection("self." + this.api_dict_by_name[the_item].signature);
        }
        return false
    }

    insertApiItemDP(the_item) {
        this.myDPCodeMirror.getDoc().replaceSelection("self." + this.api_dict_by_name[the_item].signature);
        return false
    }
}

class OptionManager extends CreatorResourceManager {

    resize_to_window() {
        resize_dom_to_bottom_given_selector("#option-module-outer", 20);
    }

    set_extra_properties() {
        super.set_extra_properties();
        this.update_view = "get_option_table";
        this.option_dict = this.viewer.parsed_data.option_dict;
        this.data_attr = "option_dict";
        this.taggable_option_types = ["class_select", "function_select", "pipe_select", "list_select",
                                      "collection_select"];
        this.button_groups = [
            {
                "buttons": [
                    {"name": "delete", "func": "delete_option_func", "button_class": "btn-outline-secondary", "icon_name": "trash"},
                    {"name": "refresh", "func": "refresh_option_table", "button_class": "btn-outline-secondary", "icon_name": "sync-alt"}
                ]
            },
            {
                "buttons": [
                    {"name": "to meta", "func": "send_doc_text", "button_class": "btn-outline-secondary", "icon_name": "list"}
                ]
            }
        ]
    }

    add_listeners() {
        super.add_listeners();
        let self = this;
        $("#option-type-input").on("change", function () {
                let option_type = $("#option-type-input").val();
                if (option_type == "custom_list") {
                    $("#special-list-group").css("display", "inline-block");
                }
                else {
                    $("#special-list-group").css("display", "none");
                }
                if (self.taggable_option_types.indexOf(option_type) >= 0) {
                    $("#option-tag-group").css("display", "inline-block");
                    }
                else {
                    $("#option-tag-group").css("display", "none")
                }
            });
    }

    refresh_option_table (event) {
        let manager = event.data.manager;
        manager.update_main_content();
        return false
    }

    send_doc_text (event) {
        let manager = event.data.manager;
        let res_string = "\n\noptions: \n\n";
        for (let opt of manager.option_dict) {
            res_string += ` * \`${opt.name}\` (${opt.type}): \n`
        }
        $('.nav-tabs a[href="#metadata-module-outer"]').tab('show');
        let self = creator_viewer;
        let md = creator_viewer.markdown_helper;
        md.setNotesValue(self.meta_outer, md.getNotesValue(self.meta_outer) + res_string);
        md.getMarkdownField(self.meta_outer).click();
    }

    update_option_order () {
        let rows = this.get_main_content_dom().find("tbody tr");
        let new_option_list = [];
        for (let i = 0; i < rows.length; ++i) {
            let r = rows[i];
            let name = $(r).attr("value");
            for (let opt of this.option_dict) {
                if (opt.name == name) {
                    new_option_list.push(opt);
                    break
                }
            }
        }
        this.option_dict = new_option_list;
        this.changed = true
    }

    fill_content(the_html) {
        let fields = ["name", "type", "default", "special_list", "tags"];
        let manager = creator_viewer.optionManager;
        super.fill_content(the_html);
        let self = this;
        this.get_main_content_dom().find("td").attr("contenteditable", true);
        this.get_main_content_dom().find("td").blur(function(event) {
            let cell_index = event.target.cellIndex;
            let row_index = $(event.target).parent()[0].rowIndex - 1;  // We subtract one for the header row
            let new_value = $(event.target).html();
            let field_name = fields[cell_index];
            if (field_name == "type") {
                if (!option_types.includes(new_value)) {
                    doFlash({"message": "Invalid option_type.", "alert_type": "alert-warning"});
                    $(event.target).html(self.option_dict[row_index][field_name]);
                    return false
                }
            }
            else if (field_name == "default") {
                let option_type = self.option_dict[row_index]["type"];
                if (self.check_default_value(manager, option_type, new_value)) {
                    if (option_type == "boolean") {
                        new_value = (new_value == "true") || (new_value == "True");
                    }
                    if (option_type == "int") {
                        new_value = manager.getInteger(new_value);
                    }
                }
                else {
                    $(event.target).html(self.option_dict[row_index][field_name]);
                    return false
                }
            }
            self.option_dict[row_index][field_name] = new_value;
            return true
        });

        this.get_main_content_dom().find("tbody").sortable( {
            handle: ".ui-icon",
            update: function () {self.update_option_order()}
        })
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
        let i = parseInt(val);
        if (isNaN(i) || i != parseFloat(val)) {
            return false
        }
        else {
            return i
        }
    }

    check_default_value (manager, option_type, option_default) {
         if (option_type == "int") {
            option_default = manager.getInteger(option_default);
            if (!option_default) {
                doFlash({"message": "Invalid default value.", "alert_type": "alert-warning"});
                return false
            }
         }
        else if (option_type == "boolean") {
            if (["true", "True", "false", "False"].indexOf(option_default) == -1) {
                doFlash({"message": "Invalid default value.", "alert_type": "alert-warning"});
                return false
            }
        }
        return true
    }

    createNewOption (event) {
        let manager = event.data.manager;
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
                if (manager.check_default_value(manager, option_type, option_default)) {
                    if (option_type == "boolean") {
                        option_default = (option_default == "true") || (option_default == "True");
                    }
                    if (option_type == "int") {
                        option_default = manager.getInteger(option_default);
                    }
                    new_option["default"] = option_default;
                }
            }
            if (option_type == "custom_list") {
                new_option["special_list"] = $("#option-list-input").val();
            }
            if (manager.taggable_option_types.indexOf(option_type) >= 0) {
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


    resize_to_window() {
        resize_dom_to_bottom_given_selector("#export_module .CodeMirror", BOTTOM_MARGIN);
    }

    set_extra_properties() {
        super.set_extra_properties();
        this.update_view = "get_export_table";
        this.export_list = this.viewer.parsed_data.export_list;
        this.data_attr = "export_list";
        this.button_groups = [
            {"buttons": [
                    {"name": "delete", "func": "delete_export_func", "button_class": "btn-outline-secondary", "icon_name": "trash"},
                    {"name": "refresh", "func": "refresh_export_table", "button_class": "btn-outline-secondary", "icon_name": "sync-alt"}]
            },
            {
                "buttons": [
                    {"name": "to meta", "func": "send_doc_text", "button_class": "btn-outline-secondary", "icon_name": "list"}
                ]
            }
        ]
    }

    refresh_export_table () {
        this.update_main_content()
    }

    send_doc_text (event) {
        let manager = event.data.manager;
        let res_string = "\n\nexports: \n\n";
        for (let exp of manager.export_list) {
            res_string += ` * \`${exp.name}\`: \n`
        }
        $('.nav-tabs a[href="#metadata-module-outer"]').tab('show');
        let self = creator_viewer;
        let md = creator_viewer.markdown_helper;
        md.setNotesValue(self.meta_outer, md.getNotesValue(self.meta_outer) + res_string);
        md.getMarkdownField(self.meta_outer).click();
    }

    update_export_order () {
        let rows = this.get_main_content_dom().find("tbody tr");
        let new_export_list = [];
        for (let i = 0; i < rows.length; ++i) {
            let r = rows[i];
            let name = $(r).attr("value");
            for (let exp of this.export_list) {
                if (exp.name == name) {
                    new_export_list.push(exp);
                    break
                }
            }
        }
        this.export_list = new_export_list;
        this.changed = true
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

    fill_content(the_html) {
        let fields = ["name", "tags"];
        super.fill_content(the_html);
        let self = this;
        this.get_main_content_dom().find("td").attr("contenteditable", true);
        this.get_main_content_dom().find("td").blur(function(event) {
            let cell_index = event.target.cellIndex;
            let row_index = $(event.target).parent()[0].rowIndex - 1;  // We subtract one for the header row
            let new_value = $(event.target).html();
            let field_name = fields[cell_index];
            self.export_list[row_index][field_name] = new_value;
            return true
        });

        this.get_main_content_dom().find("tbody").sortable( {
            handle: ".ui-icon",
            update: function () {self.update_export_order()}
        })
    }

    createNewExport (event) {
        const manager = event.data.manager;
        let export_name = $("#export-name-input").val();
        let export_tags = $("#export-tags-input").val();
        if (manager.export_list.indexOf(export_name) != -1) {
            doFlash({"message": "Export already exists.", "alert_type": "alert-warning"});
            return false
        }
        else {
            manager.export_list.push({"name": export_name, "tags": export_tags});
            manager.changed = true;
            manager.update_main_content()
        }
        return false
    }
}

class MethodManager extends CreatorResourceManager {


    resize_to_window() {
        resize_dom_to_bottom_given_selector("#method-module-outer", 20);
    }

    set_extra_properties() {
        super.set_extra_properties();
        this.extra_functions = this.viewer.parsed_data.extra_functions;
        this.extra_methods_line_number = this.viewer.parsed_data.extra_methods_line_number;
        this.data_attr = "extra_functions";
        this.include_button_well = false;
    }

    update_main_content() {
        this.cmobject = this.viewer.createCMArea(this.get_main_content_dom()[0], false, null, this.extra_methods_line_number);
        this.get_main_content_dom().find(".CodeMirror").resizable({handles: "se"});
        this.get_main_content_dom().find(".CodeMirror").height("100%");
        this.get_main_content_dom().width("100%");
        this.fill_content();
        this.cmobject.getDoc().markClean();
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

function removeCreatorwindow() {
    postAsyncFalse("host", "remove_mainwindow_task", {"main_id": main_id})
}

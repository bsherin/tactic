/**
 * Created by bls910 on 10/4/15.
 */
const current_theme = "default";
let myCodeMirror;
let myDPCodeMirror;
let savedCode = null;
let savedTags = null;
let savedNotes = null;
let savedCategory = null;
let savedMethods = null;
let creator_resource_module_template;
let rt_code = null;
let render_content_line_number = 0;
let draw_plot_line_number = 0;
const user_manage_id = guid();
let is_mpl = null;
let draw_plot_code = null;
let this_viewer = "creator";
let savedDPCode;


$(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
    if ($(e.currentTarget).attr("value") == "method") {
        resize_dom_to_bottom_given_selector("#method-module .CodeMirror", 20);
        methodManager.cmobject.refresh();
    }
});

function start_post_load() {
    if (use_ssl) {
        socket = io.connect('https://'+ document.domain + ':' + location.port  + '/user_manage');
    }
    else {
        socket = io.connect('http://'+document.domain + ':' + location.port  + '/user_manage');
    }
    socket.emit('join', {"user_id":  user_id, "user_manage_id":  user_manage_id});

    window.onresize = function () {
        if (is_mpl) {
            let dpba = $("#drawplotboundingarea");
            if (dpba.length > 0) {
                let the_height = [window.innerHeight - dpba.offset().top - 20] / 2;
                dpba.css('height', the_height);
            }
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
        resize_dom_to_bottom_given_selector("#codearea", 20);
        resize_dom_to_bottom_given_selector("#codearea .CodeMirror", 20);
        resize_dom_to_bottom_given_selector("#api-area", 20);
        resize_dom_to_bottom_given_selector("#method-module .CodeMirror", 20);
        resize_dom_to_bottom_given_selector(".tab-pane", 20);
        if (myCodeMirror != null) {
            myCodeMirror.refresh();
        }
        if (methodManager.cmobject != null) {
            methodManager.cmobject.refresh();
        }
    };

    socket.on('doflash', doFlash);
    const data = {};
    data.module_name = module_name;
    postAjax("parse_code", data, parse_success)
}

function parse_success(data) {
    if (!data.success) {
        doFlash(data)
    }
    else {
        rt_code = data.render_content_code;
        render_content_line_number = data.render_content_line_number;
        draw_plot_line_number = data.draw_plot_line_number;
        optionManager.option_dict = data.option_dict;
        exportManager.export_list = data.export_list;
        methodManager.extra_functions = data.extra_functions;
        savedMethods = data.extra_functions;
        $(".created").html(data.datestring);
        $("#tile-tags")[0].value = data.tags;
        $("#tile-notes")[0].value = data.notes;
        $("#tile-category")[0].value = data.category;
        savedTags = data.tags;
        savedNotes = data.notes;
        savedCategory = data.category;
        is_mpl = data.is_mpl;
        draw_plot_code = data.draw_plot_code;

        $.get($SCRIPT_ROOT + "/get_creator_resource_module_template", function(template) {
            creator_resource_module_template = $(template).filter('#creator-resource-module-template').html();
            res_managers = [optionManager, exportManager, methodManager];

            res_managers.forEach(function (manager, index, array) {
                manager.create_module_html();
                manager.fill_content();
                });
            $(".resource-module").on("click", ".resource-selector .selector-button", selector_click);
            optionManager.add_listeners();
            exportManager.add_listeners();
            postAjax("get_api_dict", {}, continue_loading)
        })
    }

}

function rebuild_autocomplete_list() {
    extra_autocomplete_list = [];
    optionManager.option_dict.forEach(function(entry) {
        extra_autocomplete_list.push(entry.name)
    });
    exportManager.export_list.forEach(function(entry) {
        extra_autocomplete_list.push(entry)
    })
}

const option_manager_specifics = {

    changed: false,

    buttons: [
        {"name": "delete", "func": "delete_option_func", "button_class": "btn btn-danger"},
        {"name": "refresh", "func": "refresh_option_table", "button_class": "btn btn-info"}
    ],

    fill_content: function () {
        data = {"option_dict": this.option_dict};
        rebuild_autocomplete_list();
        postAjax("get_option_table", data, function (result) {
            if (!result.success) {
                doFlash(result)
            }
            else {
                $("#option-selector").html(result.html);
                select_resource_button("option", null);
                sorttable.makeSortable($("#option-selector table")[0]);
                const updated_header = $("#option-selector table th")[0];
                sorttable.innerSortFunction.apply(updated_header, []);
            }
        });
    },

    refresh_option_table: function () {
        this.fill_content();
        return false
    },

    delete_option_func: function (event) {
        manager = event.data.manager;
        option_name = manager.check_for_selection("option", 0);
        const confirm_text = "Are you sure that you want to delete option " + option_name + "?";
        confirmDialog("Delete Option", confirm_text, "do nothing", "delete", function () {
            const index = manager.option_index(option_name);
            manager.option_dict.splice(index, 1);
            manager.changed = true;
            manager.fill_content()
        });
        return false
    },

    create_module_html: function () {
        const res = Mustache.to_html(creator_resource_module_template, this);
        $("#option-module").html(res);
        $("#option-type-input").on("change", function () {
            option_type = $("#option-type-input").val();
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
        })

    },

    option_index: function (option_name) {
        for (i = 0; i < this.option_dict.length; ++i) {
            if (option_name == this.option_dict[i].name) {
                return i
            }
        }
        return -1
    },

    option_exists: function (option_name) {
        for (i = 0; i < this.option_dict.length; ++i) {
            if (option_name == this.option_dict[i].name) {
                return true
            }
        }
        return false
    },

    getInteger: function (val) {
        i = parseInt(val);
        if (isNaN(i) || i != parseFloat(val)) {
            return false
        }
        else {
            return i
        }
    },

    createNewOption: function (event) {
        manager = optionManager;
        const data = {};
        option_name = $("#option-name-input").val();
        option_type = $("#option-type-input").val();
        option_default = $("#option-default-input").val();
        if (option_name.length == 0) {
            doFlash({"message": "Specify an option name.", "alert_type": "alert-warning"})
        }
        else if (manager.option_exists(option_name)) {
            doFlash({"message": "Option name exists.", "alert_type": "alert-warning"})
        }
        else {
            new_option = {"name": option_name, "type": option_type};
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
            optionManager.fill_content();
        }
        return false
    }
};

const optionManager = new ResourceManager("option", option_manager_specifics);
$("#option-create-button").on("click", optionManager.createNewOption);


const export_manager_specifics = {

    changed: false,

    buttons: [
        {"name": "delete", "func": "delete_export_func", "button_class": "btn btn-danger"},
        {"name": "refresh", "func": "refresh_export_table", "button_class": "btn btn-info"}
    ],

    fill_content: function () {
        data = {"export_list": this.export_list};
        rebuild_autocomplete_list();
        postAjax("get_export_table", data, function (result) {
            if (!result.success) {
                doFlash(result)
            }
            else {
                $("#export-selector").html(result.html);
                select_resource_button("export", null);
                if ($("#export-selector table").length > 0) {
                    sorttable.makeSortable($("#export-selector table")[0]);
                }
                if ($("#export-selector table th").length > 0) {
                    const updated_header = $("#export-selector table th")[0];
                    sorttable.innerSortFunction.apply(updated_header, []);
                }
            }
        });
    },

    refresh_export_table: function () {
        this.fill_content();
        return false
    },

    delete_export_func: function (event) {
        const manager = event.data.manager;
        export_name = manager.check_for_selection("export", 0);
        const confirm_text = "Are you sure that you want to delete export " + export_name + "?";
        confirmDialog("Delete Export", confirm_text, "do nothing", "delete", function () {
            const index = manager.export_list.indexOf(export_name);
            manager.export_list.splice(index, 1);
            manager.changed = true;
            manager.fill_content()
        });
        return false
    },

    create_module_html: function () {
        const res = Mustache.to_html(creator_resource_module_template, this);
        $("#export-module").html(res);
    },

    createNewExport: function (event) {
        manager = exportManager;
        const data = {};
        export_name = $("#export-name-input").val();
        if (manager.export_list.indexOf(export_name) != -1) {
            doFlash({"message": "Export already exists.", "alert_type": "alert-warning"});
            return false
        }
        else {
            manager.export_list.push(export_name);
            manager.changed = true;
            manager.fill_content()
        }
        return false
    }
};

const exportManager = new ResourceManager("export", export_manager_specifics);
$("#export-create-button").on("click", exportManager.createNewExport);



const method_manager_specifics = {

    add_listeners: function () {
        let x = 3;
    },

    fill_content: function () {
        methodManager.cmobject.setValue(this.extra_functions)
    },

    get_extra_functions: function () {
        return methodManager.cmobject.getValue()
    },

    refresh_methods: function () {
        this.fill_content()
    },

    create_module_html: function () {
        const codearea = document.getElementById("method-module");
        this.cmobject = createCMArea(codearea, false);
        $(codearea).find(".CodeMirror").resizable({handles: "se"});
        $(codearea).find(".CodeMirror").height(100);
    }

};

const methodManager = new ResourceManager("method", method_manager_specifics);

function continue_loading(data) {
    const codearea = document.getElementById("codearea");
    myCodeMirror = createCMArea(codearea, false);
    if (render_content_line_number != 0) {
        myCodeMirror.setOption("firstLineNumber", render_content_line_number + 1)
    }
    myCodeMirror.setValue(rt_code);
    if (is_mpl) {
        const drawplotcodearea = document.getElementById("drawplotcodearea");
        myDPCodeMirror = createCMArea(drawplotcodearea, false);
        myDPCodeMirror.setValue(draw_plot_code);
        if (draw_plot_line_number != 0) {
            myDPCodeMirror.setOption("firstLineNumber", draw_plot_line_number + 1)
        }
        let dpba = $("#drawplotboundingarea");
        dpba.css("display", "block");
        myDPCodeMirror.refresh();
        if (dpba.length > 0) {
            the_height = [window.innerHeight - dpba.offset().top - 20] / 2;
            dpba.css('height', the_height);
        }
        let dpca = $("#drawplotcodearea");
        if (dpca.length > 0) {
            let dpca_height = the_height - (dpca.offset().top - dpba.offset().top);
            dpca.css('height', dpca_height);
            $("#drawplotcodearea .CodeMirror").css('height', dpca_height);
        }

        savedDPCode = myDPCodeMirror.getDoc().getValue();
        dpba.resizable({
                handles: "s",
                resize: function (event, ui) {
                    // ui.position.top = 0;
                    dpba.css('height', ui.size.height);

                    let the_height = ui.size.height;
                    dpba.css('height', the_height);
                    let dpca_height = the_height - ($("#drawplotcodearea").offset().top - dpba.offset().top);
                    $("#drawplotcodearea").css('height', dpca_height);
                    $("#drawplotcodearea .CodeMirror").css('height', dpca_height);

                    resize_dom_to_bottom_given_selector("#codearea", 20);
                    resize_dom_to_bottom_given_selector("#codearea .CodeMirror", 20);

                    myDPCodeMirror.refresh();
                }
                // resize: handle_resize
            });
    }

    resize_dom_to_bottom_given_selector("#codearea", 20);
    resize_dom_to_bottom_given_selector("#codearea .CodeMirror", 20);
    resize_dom_to_bottom_given_selector("#api-area", 20);
    resize_dom_to_bottom_given_selector("#method-module .CodeMirror", 20);
    resize_dom_to_bottom_given_selector(".tab-pane", 20);
    myCodeMirror.refresh();

    savedCode = myCodeMirror.getDoc().getValue();

    const result_dict = {"res_type": "tile", "res_name": module_name};
    const acc = document.getElementsByClassName("accordion");
    let i;
    for (let element of acc) {
        element.onclick = function(){
            this.classList.toggle("active");
            this.nextElementSibling.classList.toggle("show");
        }
    }
    postAjax("grab_metadata", result_dict, got_metadata);
    window.onresize();
    function got_metadata(data) {
        if (data.success) {
            $(".created").html(data.datestring);
            $("#tile-tags")[0].value = data.tags;
            $("#tile-notes")[0].value = data.notes;
            savedTags = data.tags;
            savedNotes = data.notes
        }
        else {
            // doFlash(data)
            $(".created").html("");
            $("#tile-tags")[0].value = "";
            $("#tile-tags").html("");
            $("#tile-notes")[0].value = "";
            $("#tile-notes").html("");
        }
    }
}

function insertApiItem(the_item) {
    myCodeMirror.getDoc().replaceSelection("self." + api_dict_by_name[the_item].signature);
    return false
}

function insertApiItemDP(the_item) {
    myDPCodeMirror.getDoc().replaceSelection("self." + api_dict_by_name[the_item].signature);
    return false
}

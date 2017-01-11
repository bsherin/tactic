/**
 * Created by bls910 on 7/18/15.
 */

var resource_module_template;
var repository_module_template;
var mousetrap = new Mousetrap();
var repository_visible = false;
var user_manage_id = guid();
var page_id = user_manage_id;

mousetrap.bind("esc", function() {
    clearStatusArea();
    clearStatusMessage();
    resource_managers[get_current_res_type()].unfilter_me(current_manager_kind())
});


mousetrap.bind(['command+f', 'ctrl+f'], function(e) {
    var res_type = get_current_res_type();
    document.getElementById(res_type + "-search").focus();
    e.preventDefault()
});

var res_types = ["list", "collection", "project", "tile", "code"];
var resource_managers = {};

function get_manager_outer(res_type, manager_type) {
    return $("#" + manager_type + "-" + res_type + "-outer")
}

function get_manager_dom(res_type, manager_type, selector) {
    return $("#" + manager_type + "-" + res_type + "-outer").find(selector)
}

function start_post_load() {
    if (use_ssl) {
        socket = io.connect('https://'+ document.domain + ':' + location.port  + '/user_manage');
    }
    else {
        socket = io.connect('http://'+document.domain + ':' + location.port  + '/user_manage');
    }
    window.onresize = resize_window;

    socket.emit('join', {"user_id":  user_id, "user_manage_id":  user_manage_id});

    socket.on("window-open", function(data) {
        window.open($SCRIPT_ROOT + "/load_temp_page/" + data["the_id"])
    });

    socket.on('update-selector-list', function(data) {
        var res_type = data.res_type;
        var manager = resource_managers[res_type];
        manager.get_resource_selector_dom("resource").html(data.html);
        if (data.hasOwnProperty("select")) {
            manager.select_resource_button("resource", data.select)
        }
        else {
            manager.select_resource_button("resource", null)
        }
        sorttable.makeSortable(manager.get_resource_table("resource")[0]);
        var updated_header = manager.get_resource_selector_dom("resource").find("table th")[2];
        // We do the sort below twice to get the most recent dates first.
        sorttable.innerSortFunction.apply(updated_header, []);
        sorttable.innerSortFunction.apply(updated_header, []);
    });

    socket.on('update-tag-list', function (data) {
        var res_type = data.res_type;
        var manager = resource_managers[res_type];
        var active_tag_button = null;
        var all_tag_buttons = manager.get_all_tag_buttons("resource");
        $.each(all_tag_buttons, function (index, but) {
            if ($(but).hasClass("active")) {
                active_tag_button = $(but).html()
            }
        });
        manager.get_tag_button_dom("resource").html(data.html);
        all_tag_buttons = manager.get_all_tag_buttons("resource");
        if (active_tag_button != null) {
            $.each(all_tag_buttons, function (index, but) {
                if ($(but).html() == active_tag_button) {
                    $(but).addClass("active")
                }
            });
        }
    });

    socket.on('stop-spinner', function () {
        stopSpinner()
    });

    socket.on('start-spinner', function () {
        startSpinner()
    });

    socket.on('show-status-msg', function (data){
        statusMessage(data)
    });

    socket.on("clear-status-msg", function (){
       clearStatusMessage()
    });

    socket.on('update-loaded-tile-list', function(data) {
        $("#loaded-tile-list").html(data.html)
    });

    socket.on('close-user-windows', function(data){
        if (!(data["originator"] == user_manage_id)) {
            window.close()
        }

    });
    
    socket.on('doflash', doFlash);
    console.log("about to create");
    $.get($SCRIPT_ROOT + "/get_resource_module_template", function(template) {
        resource_module_template = $(template).filter('#resource-module-template').html();
        listManager.create_module_html();
        collectionManager.create_module_html();
        projectManager.create_module_html();
        tileManager.create_module_html();
        codeManager.create_module_html();

        var manager_kind = "resource";
        res_types.forEach(function (res_type) {
            var manager = resource_managers[res_type];
            manager.get_resource_selector_dom(manager_kind).load($SCRIPT_ROOT + "/request_update_selector_list/" + res_type, function () {
                manager.select_resource_button(manager_kind, null);
                sorttable.makeSortable(manager.get_resource_table(manager_kind)[0]);
                var updated_header = manager.get_resource_selector_dom(manager_kind).find("table th")[2];
                // We do the sort below twice to get the most recent dates first.
                sorttable.innerSortFunction.apply(updated_header, []);
                sorttable.innerSortFunction.apply(updated_header, []);
            });
            manager.get_tag_button_dom(manager_kind).load($SCRIPT_ROOT + "/request_update_tag_list/" + res_type)
        });

        get_manager_dom("tile", "resource", ".loaded-tile-list").load($SCRIPT_ROOT + "/request_update_loaded_tile_list");

        var repository_manager_kind = "repository";
        res_types.forEach(function (element) {
            var rep_manager = resource_managers[element];
            rep_manager.get_resource_selector_dom(repository_manager_kind).load($SCRIPT_ROOT + "/request_update_repository_selector_list/" + element, function () {
                rep_manager.select_resource_button(repository_manager_kind, null);
                sorttable.makeSortable(rep_manager.get_resource_table(repository_manager_kind)[0])
            });
            rep_manager.get_tag_button_dom(repository_manager_kind).load($SCRIPT_ROOT + "/request_update_repository_tag_list/" + element)
        });

        listManager.add_listeners();
        collectionManager.add_listeners();
        projectManager.add_listeners();
        tileManager.add_listeners();
        codeManager.add_listeners();


        $(".resource-module").on("click", ".resource-selector .selector-button", selector_click);
        $(".resource-module").on("dblclick", ".resource-selector .selector-button", selector_double_click);
        $(".resource-module").on("click", ".search-resource-button", search_resource);

        $(".resource-module").on("click", ".search-tags-button", search_resource_tags);
        $(".resource-module").on("click", ".resource-unfilter-button", unfilter_resource);

        $(".resource-module").on("click", ".save-metadata-button", save_metadata);
        $(".resource-module").on("click", ".tag-button-list button", tag_button_clicked);

        $(".resource-module").on("keyup", ".search-field", function(e) {
            var res_type;
            var fake_event;
            if (e.which == 13) {
                res_type = get_current_res_type();
                fake_event = {"target": {"value": res_type}};
                search_resource(fake_event);
                e.preventDefault();
            }
            else {
                res_type = get_current_res_type();
                fake_event = {"target": {"value": res_type}};
                search_resource(fake_event);
            }
        });
        resize_window();
        $('a[data-toggle="tab"]').on('shown.bs.tab', function () {
            resize_window()
        });
        stopSpinner()
    })
}

function toggleRepository() {
    if (repository_visible) {
        $(".repository-outer").fadeOut(function (){
            $(".resource-outer").fadeIn(function() {
                repository_visible = false;
                $("#view-title").text(saved_title);
                $("#toggle-repository-button").text("Show Repository");
                $(".page-header").removeClass("repository-title");
                resize_window()
            })
        })
    }
    else {
        $(".resource-outer").fadeOut(function(){
            $(".repository-outer").fadeIn(function () {
                repository_visible = true;
                $("#view-title").text("Repository");
                $("#toggle-repository-button").text("Hide Repository");
                $(".page-header").addClass("repository-title");
                resize_window()
            })
        })
    }
    return(false)
}

function showAdmin() {
    window.open($SCRIPT_ROOT + "/admin_interface")
}

function startSpinner() {
    $("#spinner").css("display", "inline-block")
}

function stopSpinner() {
    $("#spinner").css("display", "none")
}

function doFlashStopSpinner(data) {
    stopSpinner();
    doFlash(data)
}

function resize_window() {
    res_types.forEach(function (res_type) {
        var manager = resource_managers[res_type];
        var rsw_row = manager.get_resource_selector_row("resource");
        if (rsw_row.length > 0) {
            var h = window.innerHeight - 50 - rsw_row.offset().top;
            rsw_row.outerHeight(h);
        }
        var rep_row = manager.get_resource_selector_row("resource");
        if (rep_row.length > 0) {
            var srowh = window.innerHeight - 50 - rep_row.offset().top;
            rep_row.outerHeight(srowh);
        }
        var tselector = manager.get_tag_button_dom("resource");
        if (tselector.length > 0) {
            var tselector_height = window.innerHeight - 50 - tselector.offset().top;
            tselector.outerHeight(tselector_height);
        }
        var trepselector = manager.get_tag_button_dom("repository");
        if (trepselector.length > 0) {
            var trepselector_height = window.innerHeight - 50 - trepselector.offset().top;
            trepselector.outerHeight(trepselector_height)
        }
    })
}

var list_manager_specifics = {
    show_add: true,
    show_multiple: false,
    view_view: '/view_list/',
    repository_view_view: '/repository_view_list/',
    duplicate_view: '/create_duplicate_list',
    delete_view: '/delete_list/',
    double_click_func: "view_func",
    repository_double_click_func: "repository_view_func",
    file_adders: [
        {"name": "add_list", "func": "add_list", "button_class": "btn-default" }
    ],
    button_groups: [
        {"buttons": [{"name": "view", "func": "view_func", "button_class": "btn-default"}]},
        {"buttons": [{"name": "duplicate", "func": "duplicate_func", "button_class": "btn-default"}]},
        {"buttons": [{"name": "share", "func": "send_repository_func", "button_class": "btn-default"}]},
        {"buttons": [{"name": "delete", "func": "delete_func", "button_class": "btn-default"}]}
    ],
    repository_buttons: [
        {"name": "view", "func": "repository_view_func", "button_class": "btn-default"}
    ],
    add_list: function (event) {
        var fdata = new FormData(this);
        postAjaxUpload("add_list", fdata, doFlashOnFailure(data));
        event.preventDefault();
    }
};

var listManager = new ResourceManager("list", list_manager_specifics);
resource_managers["list"] = listManager;

//noinspection JSUnusedGlobalSymbols
var col_manager_specifics = {
    show_add: true,
    show_multiple: true,
    duplicate_view: '/duplicate_collection',
    delete_view: '/delete_collection/',
    load_view: "/main/",
    double_click_func: "load_func",
    file_adders: [
        {"name": "import_as_table", "func": "import_as_table", "button_class": "btn-default" },
        {"name": "import_as_freeform", "func": "import_as_freeform", "button_class": "btn-default" }
    ],
    button_groups: [
        {buttons: [
            {"name": "load", "func": "load_func", "button_class": "btn btn-default"}
            ]},
        {buttons: [
            {"name": "duplicate", "func": "duplicate_func", "button_class": "btn-default"},
            {"name": "combine_collections", "func": "combineCollections", "button_class": "btn-default"}]},
        {buttons: [{"name": "download", "func": "downloadCollection", "button_class": "btn btn-default"},
            {"name": "share", "func": "send_repository_func", "button_class": "btn-default"}]},
        {buttons: [
            {"name": "delete", "func": "delete_func", "button_class": "btn-default"}]}
    ],
    import_as_table: function (event) {
        var the_data = new FormData(this);
        $.getJSON($SCRIPT_ROOT + "get_resource_names/collection", function(data) {
                showModal("Import as table", "New collection Name", CreateNewCollection, "NewCollection", data["resource_names"])
            }
        );
        function CreateNewCollection(new_name) {
            startSpinner();
            postAjaxUpload("import_as_table/" + new_name, the_data, doFlashStopSpinner);
        }
        event.preventDefault();
    },
    import_as_freeform: function (event) {
        var the_data = new FormData(this);
       $.getJSON($SCRIPT_ROOT + "get_resource_names/collection", function(data) {
                showModal("Import as table", "New collection Name", CreateNewCollection, "NewCollection", data["resource_names"])
            }
        );
        function CreateNewCollection(new_name) {
            startSpinner();
            postAjaxUpload("import_as_freeform/" + new_name, the_data, doFlashStopSpinner);
        }
        event.preventDefault();
    },
    downloadCollection: function (event) {
        var manager = event.data.manager;
        var res_name = manager.check_for_selection("resource");
        if (res_name == "") return;
        showModal("Download Collection as Excel Notebook", "New File Name", function (new_name) {
            window.open($SCRIPT_ROOT + "/download_collection/" + res_name + "/" + new_name)
        }, res_name + ".xls")
    },
    combineCollections: function (event) {
        var manager = event.data.manager;
        var res_name = manager.check_for_selection("resource");
        if (res_name == "") return;
        showModal("Name of collection to combine with " + res_name, "collection Name", function (other_name) {
            startSpinner();
            var target =$SCRIPT_ROOT + "/combine_collections/" + res_name + "/" + other_name;
            $.post(target, doFlashStopSpinner);
        })
    }
};

var collectionManager = new ResourceManager("collection", col_manager_specifics);
resource_managers["collection"] = collectionManager;

var project_manager_specifics = {
    show_add: false,
    load_view: "",
    delete_view: "/delete_project/",
    double_click_func: "load_func",
    button_groups: [
        {buttons: [
            {"name": "load", "func": "load_func", "button_class": "btn-default"}
        ]},
        {buttons: [
            {"name": "share", "func": "send_repository_func", "button_class": "btn-default"}
        ]},
        {buttons: [
            {"name": "delete", "func": "delete_func", "button_class": "btn-default"}
        ]}
    ],

    load_func: function (event) {
        var manager = event.data.manager;
        var res_name = manager.check_for_selection("resource");
        if (res_name == "") return;
        var data = {"project_name": res_name, "user_id": user_id, "user_manage_id": user_manage_id};
        startSpinner();
        postWithCallbackNoMain("host", "main_project", data)
    }
};

var projectManager = new ResourceManager("project", project_manager_specifics);
resource_managers["project"] = projectManager;

var tile_manager_specifics = {
    show_multiple: false,
    new_view: '/create_tile_module',
    view_view: '/view_module/',
    creator_view: '/view_in_creator/',
    last_saved_view: '/last_saved_view/',
    repository_view_view: '/repository_view_module/',
    delete_view: "/delete_tile_module/",
    duplicate_view: '/create_duplicate_tile',
    double_click_func: "dc_view_func",
    repository_double_click_func: "repository_view_func",
    show_loaded_list: true,
    popup_buttons: [{"name": "new",
                    "button_class": "btn-default",
                    "option_list": [{"opt_name": "BasicTileTemplate", "opt_func": "new_basic_tile"},
                                    {"opt_name": "ExpandedTileTemplate", "opt_func": "new_expanded_tile"},
                                    {"opt_name": "MatplotlibTileTemplate", "opt_func": "new_matplotlib_tile"}]},
                    {"name": "new_in_creator",
                    "button_class": "btn-default",
                    "option_list": [{"opt_name": "StandardTile", "opt_func": "new_basic_in_creator"},
                                    {"opt_name": "MatplotlibTile", "opt_func": "new_mpl_in_creator"}]}],
    file_adders: [
        {"name": "add_module", "func": "add_tile_module", "button_class": "btn-default" }
    ],
    button_groups: [
        {buttons: [
            {"name": "view", "func": "view_func", "button_class": "btn-default"},
            {"name": "view_in_creator", "func": "creator_view_func", "button_class": "btn-default"},
            {"name": "load", "func": "load_func", "button_class": "btn-default"},
            {"name": "unload", "func": "unload_func", "button_class": "btn-default"}
        ]},
        {buttons: [
            {"name": "duplicate", "func": "duplicate_func", "button_class": "btn-default"}
        ]},
        {buttons: [
            {"name": "share", "func": "send_repository_func", "button_class": "btn-default"}
        ]},
        {buttons: [
            {"name": "delete", "func": "delete_func", "button_class": "btn-default"}
        ]}
    ],

    repository_buttons: [
        {"name": "view", "func": "repository_view_func", "button_class": "btn-default"}
    ],

    creator_view_func: function (event) {
        var manager = event.data.manager;
        var res_name = manager.check_for_selection("resource");
        if (res_name == "") return;
        window.open($SCRIPT_ROOT + manager.creator_view + String(res_name))
    },

    dc_view_func: function (event) {
        var manager = event.data.manager;
        var res_name = manager.check_for_selection("resource");
        if (res_name == "") return;
        window.open($SCRIPT_ROOT + manager.last_saved_view + String(res_name))
    },

    load_func: function (event) {
        var manager = event.data.manager;
        var res_name = manager.check_for_selection("resource");
        if (res_name == "") return;
        $.getJSON($SCRIPT_ROOT + '/load_tile_module/' + String(res_name), doFlash)
    },
    unload_func: function (event) {
        var manager = event.data.manager;
        var res_name = manager.check_for_selection("resource");
        if (res_name == "") return;
        $.getJSON($SCRIPT_ROOT + '/unload_all_tiles', doFlash)
    },

    add_tile_module: function (event) {
        var form_data = new FormData(this);
        postAjaxUpload("add_tile_module", form_data, doFlashOnFailure(data));
        event.preventDefault();
    },

    new_in_creator: function (event, template_name) {
        var manager = event.data.manager;
        $.getJSON($SCRIPT_ROOT + "get_resource_names/tile", function(data) {
                showModal("New Tile", "New Tile Name", CreateNewTileModule, "NewTileModule", data["resource_names"])
            }
        );
        function CreateNewTileModule (new_name) {
            var result_dict = {
                "template_name": template_name,
                "new_res_name": new_name,
                "last_saved": "creator"
            };
            postAjax(manager.new_view, result_dict, function(data) {
                    if (data.success){
                        window.open($SCRIPT_ROOT + manager.creator_view + String(new_name))
                    }
                    else {
                        doFlash(data)
                    }
            });
        }
        event.preventDefault();
    },

    new_basic_in_creator: function (event) {
        tileManager.new_in_creator(event, "BasicTileTemplate");
        event.preventDefault();
    },

    new_mpl_in_creator: function (event) {
        tileManager.new_in_creator(event, "MatplotlibTileTemplate");
        event.preventDefault();
    },

    new_basic_tile: function (event) {
        tileManager.new_tile (event, "BasicTileTemplate");
    },

    new_expanded_tile: function (event) {
        tileManager.new_tile (event, "ExpandedTileTemplate");
    },

    new_matplotlib_tile: function (event) {
        tileManager.new_tile (event, "MatplotlibTileTemplate");
    },

    new_tile: function (event, template_name) {
        var manager = event.data.manager;
        $.getJSON($SCRIPT_ROOT + "get_resource_names/tile", function(data) {
                showModal("New Tile", "New Tile Name", CreateNewTileModule, "NewTileModule", data["resource_names"])
            }
        );
        function CreateNewTileModule (new_name) {
            var result_dict = {
                "template_name": template_name,
                "new_res_name": new_name,
                "last_saved": "viewer"
            };
            postAjax(manager.new_view, result_dict, function(data) {
                    if (data.success){
                        window.open($SCRIPT_ROOT + manager.view_view + String(new_name))
                    }
                    else {
                        doFlash(data)
                    }
            })
        }
        event.preventDefault();
    }
};

var tileManager = new ResourceManager("tile", tile_manager_specifics);
resource_managers["tile"] = tileManager;

var code_manager_specifics = {
    show_multiple: false,
    new_view: '/create_code',
    view_view: '/view_code/',
    repository_view_view: '/repository_view_code/',
    delete_view: "/delete_code/",
    duplicate_view: '/create_duplicate_code',
    double_click_func: "view_func",
    repository_double_click_func: "repository_view_func",
    show_loaded_list: true,
    popup_buttons: [{"name": "new",
                    "button_class": "btn-default",
                    "option_list": [{"opt_name": "BasicCodeTemplate", "opt_func": "new_code"}]}],
    file_adders: [
        {"name": "add_code", "func": "add_code", "button_class": "btn-default" }
    ],
    button_groups: [
        {buttons: [
            {"name": "view", "func": "view_func", "button_class": "btn-default"}
        ]},
        {buttons: [
            {"name": "duplicate", "func": "duplicate_func", "button_class": "btn-default"}
        ]},
        {buttons: [
            {"name": "share", "func": "send_repository_func", "button_class": "btn-default"}
        ]},
        {buttons: [
            {"name": "delete", "func": "delete_func", "button_class": "btn-default"}
        ]}
    ],

    repository_buttons: [
        {"name": "view", "func": "repository_view_func", "button_class": "btn-default"}
    ],
    add_code: function (event) {
        var form_data = new FormData(this);
        postAjaxUpload("add_code", form_data, doFlashOnFailure(data));
        event.preventDefault();
    },
    new_code: function (event) {
        var manager = event.data.manager;
        var template_name = "BasicCodeTemplate";
        $.getJSON($SCRIPT_ROOT + "get_resource_names/code", function(data) {
                showModal("New Code Resource", "New Code Resource Name", CreateNewCodeResource, "NewCodeResource", data["resource_names"])
            }
        );

        function CreateNewCodeResource (new_name) {
            var result_dict = {
                "template_name": template_name,
                "new_res_name": new_name
            };
            postAjax(manager.new_view, result_dict, function(data) {
                if (data.success){
                    window.open($SCRIPT_ROOT + manager.view_view + String(new_name))
                }
                else {
                    doFlash(data)
                }
            });
        }
        event.preventDefault();
    }
};

var codeManager = new ResourceManager("code", code_manager_specifics);
resource_managers["code"] = codeManager;
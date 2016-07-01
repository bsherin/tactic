/**
 * Created by bls910 on 7/18/15.
 */

var resource_module_template;
var repository_module_template;
var mousetrap = new Mousetrap();
var repository_visible = false;
var user_manage_id = guid();

mousetrap.bind("esc", function() {
    clearStatusArea();
    clearStatusMessage();
});

var res_types = ["list", "collection", "project", "tile"];
var resource_managers = {};

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
        $("#" + res_type + "-selector").html(data.html);
        if (data.hasOwnProperty("select")) {
            select_resource_button(res_type, data.select)
        }
        else {
            select_resource_button(res_type, null)
        }
        sorttable.makeSortable($("#" + res_type + "-selector table")[0]);
        var updated_header = $("#" + res_type + "-selector table th")[2];
        // We do the sort below twice to get the most recent dates first.
        sorttable.innerSortFunction.apply(updated_header, []);
        sorttable.innerSortFunction.apply(updated_header, []);
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

    socket.on("clear-status-msg", function (data){
       clearStatusMessage()
    });

    socket.on('update-loaded-tile-list', function(data) {
        $("#loaded-tile-list").html(data.html)
    });

    socket.on('close-user-windows', function(data){
        window.close()
    });
    
    socket.on('doflash', doFlash);
    console.log("about to create");
    $.get($SCRIPT_ROOT + "/get_resource_module_template", function(template) {
        resource_module_template = $(template).filter('#resource-module-template').html();
        repository_module_template = $(template).filter('#repository-module-template').html();
        listManager.create_module_html();
        collectionManager.create_module_html();
        projectManager.create_module_html();
        tileManager.create_module_html();

        res_types.forEach(function (element, index, array) {
            $("#" + element + "-selector").load($SCRIPT_ROOT + "/request_update_selector_list/" + element, function () {
                select_resource_button(element, null);
                sorttable.makeSortable($("#" + element + "-selector table")[0]);
                var updated_header = $("#" + element + "-selector table th")[2];
                // We do the sort below twice to get the most recent dates first.
                sorttable.innerSortFunction.apply(updated_header, []);
                sorttable.innerSortFunction.apply(updated_header, []);
            })
        });

        $("#loaded-tile-list").load($SCRIPT_ROOT + "/request_update_loaded_tile_list");

        res_types.forEach(function (element, index, array) {
            $("#repository-" + element + "-selector").load($SCRIPT_ROOT + "/request_update_repository_selector_list/" + element, function () {
                select_repository_button(element, null);
                sorttable.makeSortable($("#repository-" + element + "-selector table")[0])
            })
        });

        listManager.add_listeners();
        collectionManager.add_listeners();
        projectManager.add_listeners();
        tileManager.add_listeners();
        $(".resource-module").on("click", ".resource-selector .selector-button", selector_click);
        $(".resource-module").on("dblclick", ".resource-selector .selector-button", selector_double_click);
        $(".resource-module").on("click", ".repository-selector .selector-button", repository_selector_click);
        $(".resource-module").on("dblclick", ".repository-selector .selector-button", repository_selector_double_click);
        $(".resource-module").on("click", ".search-resource-button", search_resource);
        $(".resource-module").on("click", ".search-tags-button", search_resource_tags);
        $(".resource-module").on("click", ".resource-unfilter-button", unfilter_resource);
        $(".resource-module").on("click", ".save-metadata-button", save_metadata);
        $(".resource-module").on("click", ".search-repository-resource-button", search_repository_resource);
        $(".resource-module").on("click", ".search-repository-tags-button", search_repository_resource_tags);
        $(".resource-module").on("click", ".repository-resource-unfilter-button", unfilter_repository_resource);
        $(".resource-module").on("keypress", ".search-field", function(e) {
            if (e.which == 13) {
                the_id = e.target.id;
                var regexp = /^(\w+?)-/;
                var res_type = regexp.exec(the_id)[1];
                fake_event = {"target": {"value": res_type}};
                search_resource(fake_event);
                e.preventDefault();
            }
        });
        $(".resource-module").on("keypress", ".repository-search-field", function(e) {
            if (e.which == 13) {
                the_id = e.target.id;
                var regexp = /^repository-(\w+?)-/;
                var res_type = regexp.exec(the_id)[1];
                fake_event = {"target": {"value": res_type}};
                search_repository_resource(fake_event);
                e.preventDefault();
            }
        });
        resize_window();
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
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

function startSpinner() {
    $("#spinner").css("display", "inline-block")
}

function stopSpinner() {
    $("#spinner").css("display", "none")
}

function resize_window() {
    res_types.forEach(function (val, ind, array) {
        var h = window.innerHeight - 50 - $("#" + val + "-selector-row").offset().top;
        $("#" + val + "-selector-row").outerHeight(h);
        var h = window.innerHeight - 50 - $("#repository-" + val + "-selector-row").offset().top;
        $("#repository-" + val + "-selector-row").outerHeight(h);
    })
}

var list_manager_specifics = {
    show_add: true,
    show_multiple: false,
    view_view: '/view_list/',
    repository_view_view: '/repository_view_list/',
    duplicate_view: '/create_duplicate_list',
    delete_view: '/delete_list/',
    add_view: "/add_list",
    double_click_func: "view_func",
    repository_double_click_func: "repository_view_func",
    buttons: [
        {"name": "view", "func": "view_func", "button_class": "btn-primary"},
        {"name": "duplicate", "func": "duplicate_func", "button_class": "btn-success"},
        {"name": "delete", "func": "delete_func", "button_class": "btn-danger"}
    ],
    repository_buttons: [
        {"name": "view", "func": "repository_view_func", "button_class": "btn-primary"}
    ]
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
    buttons: [
        {"name": "load", "func": "load_func", "button_class": "btn btn-primary"},
        {"name": "duplicate", "func": "duplicate_func", "button_class": "btn-success"},
        {"name": "delete", "func": "delete_func", "button_class": "btn-danger"}
    ],
    add_func: function (event) {
        var manager = event.data.manager;
        var the_data = new FormData(this);
        showModal("Create Collection", "Name for this collection", function (new_name) {
            startSpinner();
            $.ajax({
                url: $SCRIPT_ROOT + "/load_files/" + new_name,
                type: 'POST',
                data: the_data,
                processData: false,
                contentType: false,
                success: addSuccess
            });
            function addSuccess(data) {
                stopSpinner();
                doFlash(data)
            }
        });
    event.preventDefault();
    }
};

var collectionManager = new ResourceManager("collection", col_manager_specifics);
resource_managers["collection"] = collectionManager;

var project_manager_specifics = {
    show_add: false,
    load_view: "",
    delete_view: "/delete_project/",
    double_click_func: "load_func",
    buttons: [
        {"name": "load", "func": "load_func", "button_class": "btn-primary"},
        {"name": "delete", "func": "delete_func", "button_class": "btn-danger"}
    ],
    load_func: function (event) {
        var manager = event.data.manager;
        var res_name = manager.check_for_selection(manager.res_type);
        if (res_name == "") return;
        var data = {"project_name": res_name, "user_id": user_id, "user_manage_id": user_manage_id};
        startSpinner();
        postWithCallbackNoMain("host", "main_project", data)
    }
};

var projectManager = new ResourceManager("project", project_manager_specifics);
resource_managers["project"] = projectManager;

var tile_manager_specifics = {
    show_add: true,
    show_multiple: false,
    new_view: '/create_tile_module',
    add_view: '/add_tile_module',
    view_view: '/view_module/',
    repository_view_view: '/repository_view_module/',
    delete_view: "/delete_tile_module/",
    duplicate_view: '/create_duplicate_tile',
    double_click_func: "view_func",
    repository_double_click_func: "repository_view_func",
    show_loaded_list: true,
    popup_buttons: [{"name": "new",
                    "button_class": "btn-success",
                    "option_list": [{"opt_name": "BasicTileTemplate", "opt_func": "new_tile"},
                                    {"opt_name": "ExpandedTileTemplate", "opt_func": "new_tile"},
                                    {"opt_name": "MatplotlibTileTemplate", "opt_func": "new_tile"}]}],

    buttons: [
        {"name": "view", "func": "view_func", "button_class": "btn-primary"},
        {"name": "load", "func": "load_func", "button_class": "btn-primary"},
        {"name": "duplicate", "func": "duplicate_func", "button_class": "btn-success"},
        {"name": "unload", "func": "unload_func", "button_class": "btn-warning"},
        {"name": "delete", "func": "delete_func", "button_class": "btn-danger"}
    ],
    
    repository_buttons: [
        {"name": "view", "func": "repository_view_func", "button_class": "btn-primary"}
    ],
    load_func: function (event) {
        var manager = event.data.manager;
        var res_name = manager.check_for_selection("tile");
        if (res_name == "") return;
        $.getJSON($SCRIPT_ROOT + '/load_tile_module/' + String(res_name), doFlash)
    },
    unload_func: function (event) {
        var manager = event.data.manager;
        var res_name = manager.check_for_selection("tile");
        if (res_name == "") return;
        $.getJSON($SCRIPT_ROOT + '/userunload_all_tiles', doFlash)
    },

    new_tile: function (event) {
        var manager = event.data.manager;
        var template_name = event.data.opt_name;
        showModal("New Tile", "New Tile Name", function (new_name) {
            var result_dict = {
                "template_name": template_name,
                "new_res_name": new_name
            };

            $.ajax({
                url: $SCRIPT_ROOT + manager.new_view,
                contentType: 'application/json',
                type: 'POST',
                async: true,
                data: JSON.stringify(result_dict),
                dataType: 'json',
                success: function(data) {
                    if (data.success){
                        window.open($SCRIPT_ROOT + manager.view_view + String(new_name))
                    }
                    else {
                        doFlash(data)
                    }
                }
            });
        });
        event.preventDefault();
    }
};

var tileManager = new ResourceManager("tile", tile_manager_specifics);
resource_managers["tile"] = tileManager;

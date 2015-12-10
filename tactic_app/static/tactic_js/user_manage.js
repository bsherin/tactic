/**
 * Created by bls910 on 7/18/15.
 */

var resource_module_template;
var repository_module_template;
var mousetrap = new Mousetrap();
var repository_visible = false

mousetrap.bind("esc", function() {
    clearStatusArea();
})


var res_types = ["list", "collection", "project", "tile"]

function start_post_load() {
    if (use_ssl) {
        socket = io.connect('https://'+document.domain + ':' + location.port  + '/user_manage');
    }
    else {
        socket = io.connect('http://'+document.domain + ':' + location.port  + '/user_manage');
    }
    window.onresize = resize_window;


    socket.emit('join', {"user_id":  user_id});

    socket.on('update-selector-list', function(data) {
        res_type = data.res_type
        $("#" + res_type + "-selector").html(data.html);
        if (data.hasOwnProperty("select")) {
            select_resource_button(res_type, data.select)
        }
        else {
            select_resource_button(res_type, null)
        }
    });

    socket.on('start-spinner', function () {
        stopSpinner()
    })

    socket.on('start-spinner', function () {
        startSpinner()
    })

    socket.on('update-loaded-tile-list', function(data) {
        $("#loaded-tile-list").html(data.html)
    });
    socket.on('close-user-windows', function(data){
        window.close()
    });
    console.log("about to create")
    $.get($SCRIPT_ROOT + "/get_resource_module_template", function(template) {
        resource_module_template = $(template).filter('#resource-module-template').html();
        repository_module_template = $(template).filter('#repository-module-template').html();
        listManager.create_module_html();
        collectionManager.create_module_html();
        projectManager.create_module_html();
        tileManager.create_module_html();

        res_types.forEach(function(element, index, array){
            $("#"+ element + "-selector").load($SCRIPT_ROOT + "/request_update_selector_list/" + element, function () {
                select_resource_button(element, null)
            })
        });

        $("#loaded-tile-list").load($SCRIPT_ROOT + "/request_update_loaded_tile_list");

        res_types.forEach(function(element, index, array){
            $("#repository-"+ element + "-selector").load($SCRIPT_ROOT + "/request_update_repository_selector_list/" + element, function () {
                select_repository_button(element, null)
            })
        });

        listManager.add_listeners();
        collectionManager.add_listeners();
        projectManager.add_listeners();
        tileManager.add_listeners();
        $(".resource-module").on("click", ".resource-selector .selector-button", selector_click)
        $(".resource-module").on("click", ".repository-selector .selector-button", repository_selector_click)
        $(".resource-module").on("click", ".search-resource-button", search_resource)
        $(".resource-module").on("click", ".search-tags-button", search_resource_tags)
        $(".resource-module").on("click", ".resource-unfilter-button", unfilter_resource)
        $(".resource-module").on("click", ".save-metadata-button", save_metadata)
        $(".resource-module").on("click", ".search-repository-resource-button", search_repository_resource)
        $(".resource-module").on("click", ".search-repository-tags-button", search_repository_resource_tags)
        $(".resource-module").on("click", ".repository-resource-unfilter-button", unfilter_repository_resource)
        $("#toggle-repos-button").click(function () {
            if (repository_visible) {
                $(".repository-outer").fadeOut()
                $(".resource-outer").removeClass("col-xs-6")
                $(".resource-outer").addClass("col-xs-12")
                repository_visible = false
            }
            else {
                $(".repository-outer").fadeIn()
                $(".resource-outer").removeClass("col-xs-12")
                $(".resource-outer").addClass("col-xs-6")
                repository_visible = true
            }
        })
        resize_window();
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            ref_type = $(e.target).attr("value")
            var h = window.innerHeight - 50 - $("#" + ref_type + "-selector-row").offset().top
            $("#" + ref_type + "-selector-row").outerHeight(h);
        })
        $("#spinner").css("display", "none")
    })
}

function startSpinner() {
    $("#spinner").css("display", "inline-block")
}

function stopSpinner() {
    $("#spinner").css("display", "none")
}

function resize_window() {
    res_types.forEach(function (val, ind, array) {
        var h = window.innerHeight - 50 - $("#" + val + "-selector-row").offset().top
        $("#" + val + "-selector-row").outerHeight(h);
    })
}

var listManager = Object.create(resourceManager);
listManager.res_type = "list";
listManager.show_load = false;

var collectionManager = Object.create(resourceManager);

col_manager_specifics = {
    res_type: "collection",
    add_view: "/load_files/",
    load_view: "/main/",
    view_view: "",
    show_view: false,
    show_multiple: true,
    duplicate_view: '/duplicate_collection',
    delete_view: '/delete_collection/',
    add_func: function (event) {
        var manager = event.data.manager;
        the_data = new FormData(this);
        showModal("Create Collection", "Name for this collection", function (new_name) {
            startSpinner()
            $.ajax({
                url: $SCRIPT_ROOT + "/load_files/" + new_name,
                type: 'POST',
                data: the_data,
                processData: false,
                contentType: false,
                success: doFlash
            });
            function addSuccess(data) {
                stopSpinner()
                doFlash(data)
            }
        })

    event.preventDefault();
    }
}

updateObject(collectionManager, col_manager_specifics);

var projectManager = Object.create(resourceManager);

project_manager_specifics = {
    res_type: "project",
    show_add: false,
    show_view: false,
    show_duplicate: false,
    load_view: "/main_project/",
    delete_view: "/delete_project/",
}
updateObject(projectManager, project_manager_specifics);

var videoManager = Object.create(resourceManager);

video_manager_specifics = {
    res_type: "video",
    show_add: false,
    show_view: false,
    show_duplicate: false,
    show_load: false,
    delete_view: "/delete_video/",
}
updateObject(videoManager, video_manager_specifics);

var tileManager = Object.create(resourceManager);

tile_manager_specifics = {
    res_type: "tile",
    show_new: true,
    show_duplicate: false,
    show_loaded_list: true,
    new_view: '/create_tile_module',
    add_view: '/add_tile_module',
    view_view: 'view_module/',
    load_view: "/load_tile_module/",
    delete_view: "/delete_tile_module/",
    load_func: function (event) {
        var manager = event.data.manager
        var res_name = manager.check_for_selection(manager.res_type);
        if (res_name == "") return;
        $.getJSON($SCRIPT_ROOT + '/load_tile_module/' + String(res_name), success=doFlash)
    }
}
updateObject(tileManager, tile_manager_specifics);

/**
 * Created by bls910 on 7/18/15.
 */

var resource_module_template;

function start_post_load() {
    socket = io.connect('http://'+document.domain + ':' + location.port  + '/user_manage');
    socket.emit('join', {"user_id":  user_id});
    socket.on('update-project-list', function(data) {
        $("#project-selector").html(data.html)
    });
    socket.on('update-collection-list', function(data) {
        $("#collection-selector").html(data.html)
    });
    socket.on('update-list-list', function(data) {
        $("#list-selector").html(data.html)
    });
    socket.on('update-video-list', function(data) {
        $("#video-selector").html(data.html)
    });
    socket.on('update-tile-module-list', function(data) {
        $("#tile-selector").html(data.html)
    });
    socket.on('update-loaded-tile-list', function(data) {
        $("#loaded-tile-list").html(data.html)
    });
    socket.on('close-user-windows', function(data){
        window.close()
    });
    console.log("about to create")
    $.get($SCRIPT_ROOT + "/get_resource_module_template", function(template){
        resource_module_template = $(template).filter('#resource-module-template').html();
        listManager.create_module_html();
        collectionManager.create_module_html();
        projectManager.create_module_html();
        tileManager.create_module_html();
        $("#list-selector").load($SCRIPT_ROOT + "/request_update_list_list")
        $("#collection-selector").load($SCRIPT_ROOT + "/request_update_collection_list")
        $("#project-selector").load($SCRIPT_ROOT + "/request_update_project_list")
        $("#tile-selector").load($SCRIPT_ROOT + "/request_update_tile_list")
        listManager.add_listeners();
        collectionManager.add_listeners();
        projectManager.add_listeners();
        tileManager.add_listeners();
        CameraTag.setup()
    })
}

var resourceManager = {
    show_add: true,
    show_multiple:false,
    show_load: true,
    show_view: true,
    show_duplicate: true,
    show_delete: true,
    show_loaded_list: false,
    res_type: "list",
    add_view: "/add_list",
    load_view: '',
    view_view: '/view_list/',
    duplicate_view: '/create_duplicate_list',
    delete_view: '/delete_list/',
    add_listeners: function () {
        $("#duplicate-" + this.res_type + "-button").click({"manager": this}, this.duplicate_func);
        $("#add-" + this.res_type + "-form").submit({"manager": this}, this.add_func);
        $("#view-" + this.res_type + "-button").click({"manager": this}, this.view_func);
        $("#load-" + this.res_type + "-button").click({"manager": this}, this.load_func);
        $("#delete-" + this.res_type + "-button").click({"manager": this}, this.delete_func);
    },

    add_func: function (event) {
        var manager = event.data.manager
        $.ajax({
            url: $SCRIPT_ROOT + manager.add_view,
            type: 'POST',
            data: new FormData(this),
            processData: false,
            contentType: false
        });
        event.preventDefault();
    },

    load_func: function (event) {
        var manager = event.data.manager
        var res_name = manager.check_for_selection(manager.res_type);
        if (res_name == "") return;
        window.open($SCRIPT_ROOT + manager.load_view + String(res_name))
    },

    view_func: function (event) {
        var manager = event.data.manager
        var res_name = manager.check_for_selection(manager.res_type);
        if (res_name == "") return;
        window.open($SCRIPT_ROOT + manager.view_view + String(res_name))
    },

    duplicate_func: function (event) {
        var manager = event.data.manager
        var res_name = manager.check_for_selection(manager.res_type);
        if (res_name == "") return;
        showModal("Duplicate " + manager.res_type, "New " + manager.res_type + " Name", function (new_name) {
            var result_dict = {
                "new_res_name": new_name,
                "res_to_copy": res_name,
            };

            $.ajax({
                url: $SCRIPT_ROOT + manager.duplicate_view,
                contentType: 'application/json',
                type: 'POST',
                async: true,
                data: JSON.stringify(result_dict),
                dataType: 'json',
            });
        })
    },
    delete_func: function (event) {
        var manager = event.data.manager
        var res_name = manager.check_for_selection(manager.res_type);
        if (res_name == "") return;
        $.post($SCRIPT_ROOT + manager.delete_view + String(res_name))
    },

    check_for_selection: function (res_type) {
        var res_name = $('#' + res_type + '-selector > .btn.active').text().trim();
        if (res_name == "") {
            doFlash({"message": "Select a " + res_type + " first.", "alert_type": "alert-info"})
        }
        return res_name
    },

    create_module_html: function () {
        var res = Mustache.to_html(resource_module_template, this);
        $("#" + this.res_type + "-module").html(res);
    }
}

function updateObject(o1, o2) {
    for (prop in o2) {
        if (o2.hasOwnProperty(prop)){
            o1[prop] = o2[prop]
        }
    }
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
            $.ajax({
                url: $SCRIPT_ROOT + "/load_files/" + new_name,
                type: 'POST',
                data: the_data,
                processData: false,
                contentType: false,
                success: doFlash
            });
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
    show_duplicate: false,
    show_loaded_list: true,
    add_view: '/add_tile_module',
    view_view: 'view_module/',
    load_view: "/load_tile_module/",
    delete_view: "/delete_tile_module/",
    load_func: function (event) {
        var manager = event.data.manager
        var res_name = manager.check_for_selection(manager.res_type);
        if (res_name == "") return;
        $.getJSON($SCRIPT_ROOT + '/load_tile_module/' + String(res_name))
    }
}
updateObject(tileManager, tile_manager_specifics);

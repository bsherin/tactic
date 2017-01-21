/**
 * Created by bls910 on 7/18/15.
 */

let resource_module_template;
const mousetrap = new Mousetrap();
const user_manage_id = guid();

mousetrap.bind("esc", function() {
    clearStatusArea();
    clearStatusMessage();
});

const res_types = ["container", "user"];
const resource_managers = {};
const repository_visible = false;


function current_manager_kind() {
    return "resource"
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

    socket.on('update-selector-list', function(data) {
        resource_managers[data.res_type].fill_selector("resource", data.html, data.select)
    });

    socket.on('doflash', doFlash);
    $.get($SCRIPT_ROOT + "/get_resource_module_template", function(template) {
        resource_module_template = $(template).filter('#resource-module-template').html();
        resource_managers["container"] = new AdminResourceManager("container", resource_module_template, container_manager_specifics);
        resource_managers["user"] = new AdminResourceManager("user", resource_module_template, user_manager_specifics);

        $(".resource-module").on("click", ".resource-selector .selector-button", selector_click);
        $(".resource-module").on("dblclick", ".resource-selector .selector-button", selector_double_click);

        $(".resource-module").on("keyup", ".search-field", function(e) {
            let res_type;
            if (e.which == 13) {
                res_type = get_current_res_type();
                resource_managers[res_type].search_my_resource();
                e.preventDefault();
            }
            else {
                res_type = get_current_res_type();
                resource_managers[res_type].search_my_resource();
            }
            });
            resize_window();
            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            resize_window()
            });
            stopSpinner()
        })
}

let container_manager_specifics = {

    button_groups: [
        {"buttons": [
            {"name": "reset-server", "func": "reset_server_func", "button_class": "btn-default"},
            {"name": "clear-user-containers", "func": "clear_user_func", "button_class": "btn-default"},
            {"name": "destroy-container", "func": "destroy_container", "button_class": "btn-default"},
            ]},
        {"buttons": [
            {"name": "container-logs", "func": "container_logs", "button_class": "btn-default"},
            {"name": "refresh", "func": "refresh_container_table", "button_class": "btn-default"}
        ]}
    ],
    clear_user_func: function (event) {
        $.getJSON($SCRIPT_ROOT + '/clear_user_containers/' + user_manage_id, doFlash);
        event.preventDefault();
    },
    reset_server_func: function (event) {
        $.getJSON($SCRIPT_ROOT + '/reset_server/' + user_manage_id, doFlash);
        event.preventDefault();
    },
    destroy_container: function (event) {
        let manager = event.data.manager;
        cont_id = manager.check_for_selection("container", 4);
        $.getJSON($SCRIPT_ROOT + '/destroy_container/' + cont_id, doFlash);
        event.preventDefault();
    },

    container_logs: function (event) {
        let manager = event.data.manager;
        cont_id = manager.check_for_selection("resource");
        $.getJSON($SCRIPT_ROOT + '/container_logs/' + cont_id, function (data) {
            the_html = "<pre><small>" + data.log_text + "</small></pre>";
            $("#container-aux-area").html(the_html)
        });
        event.preventDefault();
    },

    refresh_container_table: function (event) {
        let manager = event.data.manager;
        $.getJSON($SCRIPT_ROOT + '/refresh_container_table');
        event.preventDefault();
    },

};

let user_manager_specifics = {

    button_groups: [
        {"buttons": [
            {"name": "create_user", "func": "create_user_func", "button_class": "btn-default"},
            {"name": "delete_user", "func": "delete_user_func", "button_class": "btn-default"},
            {"name": "refresh", "func": "refresh_user_table", "button_class": "btn-default"}
        ]}
    ],

    refresh_user_table: function (event) {
        const manager = event.data.manager;
        $.getJSON($SCRIPT_ROOT + '/refresh_user_table');
        event.preventDefault();
    },

    delete_user_func: function (event) {
        const manager = event.data.manager;
        user_id = manager.check_for_selection("user", 0);
        const confirm_text = "Are you sure that you want to delete user " + String(user_id) + "?";
        confirmDialog("Delete User", confirm_text, "do nothing", "delete", function () {
            $.getJSON($SCRIPT_ROOT + '/delete_user/' + user_id, doFlash);
        });
        event.preventDefault();
    },

    create_user_func: function (event) {
        window.open($SCRIPT_ROOT + '/register');
        event.preventDefault();
    },
};


function resize_window() {

    for (let res_type of res_types) {
        if (resource_managers.hasOwnProperty(res_type)) {
            const manager = resource_managers[res_type];
            const rsw_row = manager.get_resource_selector_row("resource");
            resize_dom_to_bottom(rsw_row, 50);;
            resize_dom_to_bottom($("#" + res_type + "-aux-area"), 50);
        }
    }
}

function startSpinner() {
    $("#spinner").css("display", "inline-block")
}

function stopSpinner() {
    $("#spinner").css("display", "none")
}

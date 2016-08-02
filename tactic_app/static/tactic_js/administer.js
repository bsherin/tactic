/**
 * Created by bls910 on 7/18/15.
 */

var admin_resource_module_template;
var mousetrap = new Mousetrap();
var user_manage_id = guid();

mousetrap.bind("esc", function() {
    clearStatusArea();
    clearStatusMessage();
});

var res_types = ["container"];
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

    socket.on('doflash', doFlash);
    $.get($SCRIPT_ROOT + "/get_admin_resource_module_template", function(template) {
            admin_resource_module_template = $(template).filter('#admin-resource-module-template').html();
            containerManager.create_module_html();

            res_types.forEach(function (element, index, array) {
                $("#" + element + "-selector").load($SCRIPT_ROOT + "/request_update_admin_selector_list/" + element, function () {
                    select_resource_button(element, null);
                    sorttable.makeSortable($("#" + element + "-selector table")[0]);
                    var updated_header = $("#" + element + "-selector table th")[2];
                    // We do the sort below twice to get the most recent dates first.
                    sorttable.innerSortFunction.apply(updated_header, []);
                    sorttable.innerSortFunction.apply(updated_header, []);
                })
            });

            containerManager.add_listeners();
            $(".resource-module").on("click", ".resource-selector .selector-button", selector_click);
            $(".resource-module").on("dblclick", ".resource-selector .selector-button", selector_double_click);

            $(".resource-module").on("click", ".resource-unfilter-button", unfilter_resource);

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

var container_manager_specifics = {
    show_add: false,
    show_multiple: false,

    buttons: [
        {"name": "clear-user-containers", "func": "clear_user_func", "button_class": "btn btn-danger"},
        {"name": "destroy-container", "func": "destroy_container", "button_class": "btn btn-warning"},
        {"name": "container-logs", "func": "container_logs", "button_class": "btn btn-info"},
    ],
    clear_user_func: function (event) {
        $.getJSON($SCRIPT_ROOT + '/clear_user_containers', doFlash);
        event.preventDefault();
    },
    destroy_container: function (event) {
        var manager = event.data.manager;
        cont_id = manager.check_for_selection("container", 1);
        $.getJSON($SCRIPT_ROOT + '/destroy_container/' + cont_id, doFlash);
        event.preventDefault();
    },

    container_logs: function (event) {
        var manager = event.data.manager;
        cont_id = manager.check_for_selection("container", 1);
        $.getJSON($SCRIPT_ROOT + '/container_logs/' + cont_id, function (data) {
            the_html = "<pre><small>" + data.log_text + "</small></pre>";
            $("#container-module #aux-area").html(the_html)
        });
        event.preventDefault();
    },

    create_module_html: function () {
        var res = Mustache.to_html(admin_resource_module_template, this);
        $("#" + this.res_type + "-module").html(res);
    }

};

var containerManager = new ResourceManager("container", container_manager_specifics);
resource_managers["container"] = containerManager;

function resize_window() {
    res_types.forEach(function (val, ind, array) {
        var h = window.innerHeight - 50 - $("#" + val + "-selector-row").offset().top;
        $("#" + val + "-selector-row").outerHeight(h);
    })
}

function clearUserContainers() {
    $.getJSON($SCRIPT_ROOT + '/clear_user_containers', function(data) {

        doFlash(data);

    })
}


function startSpinner() {
    $("#spinner").css("display", "inline-block")
}

function stopSpinner() {
    $("#spinner").css("display", "none")
}

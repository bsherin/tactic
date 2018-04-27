/**
 * Created by bls910 on 7/18/15.
 */

let resource_module_template;
const mousetrap = new Mousetrap();
const user_manage_id = guid();

mousetrap.bind("esc", function() {
    clearStatusMessage();
    resource_managers[get_current_module_id()].unfilter_me()
});

mousetrap.bind(['down'], (e) => {
    const mod_id = get_current_module_id();
    resource_managers[mod_id].go_to_next_row();
    e.preventDefault()
});

mousetrap.bind(['up'], (e) => {
    const mod_id = get_current_module_id();
    resource_managers[mod_id].go_to_previous_row();
    e.preventDefault()
});

mousetrap.bind(['enter', 'space'], (e) => {
    const mod_id = get_current_module_id();
    let rm = resource_managers[mod_id];
    let row_element = rm.get_active_selector_button();
    const res_type = get_current_res_type();
    e.data = {"manager": rm, "res_type": res_type};
    rm[rm.double_click_func](e);
    e.preventDefault()
});


const res_types = ["container", "user"];
const resource_managers = {};
const repository_visible = false;


function get_current_module_id() {
    let res_type = get_current_res_type();
    return `${res_type}_module`
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

    socket.on("clear-status-msg", function (){
       clearStatusMessage()
    });

    socket.on('update-selector-list', function(data) {
        resource_managers[data.res_type + "_module"].fill_content(data.html, data.select)
    });

    socket.on('doflash', doFlash);
    $.get($SCRIPT_ROOT + "/get_resource_module_template", function(template) {
        resource_module_template = $(template).filter('#resource-module-template').html();
        resource_managers["container_module"] = new ContainerManager("container_module", "container", resource_module_template, "#container-module", null, true, false);
        resource_managers["user_module"] = new UserManager("user_module", "user", resource_module_template, "#user-module", null, true, false);

        $(".resource-module").on("click", ".main-content .selector-button", selector_click);
        $(".resource-module").on("dblclick", ".main-content .selector-button", selector_double_click);

        $(".resource-module").on("keyup", ".search-field", function(e) {
            if (e.which == 13) {
                resource_managers[get_current_module_id()].search_my_resource();
                e.preventDefault();
            }
            else {
                resource_managers[get_current_module_id()].search_my_resource();
            }
            });
            resize_window();
            $('a[data-toggle="tab"]').on('shown.bs.tab', function () {
                let current_modid = get_current_module_id();
                for (let module_id in resource_managers) {
                    const manager = resource_managers[module_id];
                    if (module_id == current_modid){
                        manager.turn_on_horizontal_resize()
                    }
                    else {
                        manager.turn_off_horizontal_resize()
                    }
                    manager.resize_to_window()
                }
            });
            stopSpinner();
            resource_managers[get_current_module_id()].turn_on_horizontal_resize();
        })
}

function selector_click(event) {
    const row_element = $(event.target).closest('tr');
    resource_managers[get_current_module_id()].selector_click(row_element[0])
}

function selector_double_click(event) {
    const row_element = $(event.target).closest('tr');
    const res_type = get_current_res_type();
    let manager = resource_managers[get_current_module_id()];
    manager.get_all_selector_buttons().removeClass("active");
    row_element.addClass("active");
    event.data = {"manager": manager, "res_type": res_type};
    manager.double_click_func(event)
}

class ContainerManager extends AdminResourceManager {
    set_extra_properties() {
        super.set_extra_properties();
        this.double_click_func = "container_logs";
        this.button_groups = [
            {
                "buttons": [
                    {"name": "reset-server", "func": "reset_server_func", "button_class": "btn-outline-secondary"},
                    {"name": "clear-user-containers", "func": "clear_user_func", "button_class": "btn-outline-secondary"},
                    {"name": "destroy-container", "func": "destroy_container", "button_class": "btn-outline-secondary"},
                ]
            },
            {
                "buttons": [
                    {"name": "container-logs", "func": "container_logs", "button_class": "btn-outline-secondary"},
                    {"name": "refresh", "func": "refresh_container_table", "button_class": "btn-outline-secondary"}
                ]
            }
        ]
    }
    clear_user_func (event) {
        startSpinner();
        $.getJSON($SCRIPT_ROOT + '/clear_user_containers/' + user_manage_id, doFlashStopSpinner);
        event.preventDefault();
    }
    reset_server_func (event) {
        startSpinner();
        $.getJSON($SCRIPT_ROOT + '/reset_server/' + user_manage_id, doFlashStopSpinner);
        event.preventDefault();
    }
    destroy_container (event) {
        startSpinner();
        let manager = event.data.manager;
        let cont_id = manager.check_for_selection("container", 4);
        $.getJSON($SCRIPT_ROOT + '/kill_container/' + cont_id, doFlashStopSpinner);
        event.preventDefault();
    }

    container_logs (event) {
        let manager = event.data.manager;
        let cont_id = manager.check_for_selection();
        /**
         * @param {{log_text:boolean}} data
         */
        $.getJSON($SCRIPT_ROOT + '/container_logs/' + cont_id, function (data) {
            let the_html = "<pre><small>" + data.log_text + "</small></pre>";
            manager.get_aux_right_dom().css("display", "inline-block");
            manager.get_aux_right_dom().html(the_html)
        });
        event.preventDefault();
    }

    refresh_container_table (event) {
        $.getJSON($SCRIPT_ROOT + '/refresh_container_table');
        event.preventDefault();
    }

}

class UserManager extends AdminResourceManager {
    set_extra_properties() {
        super.set_extra_properties();
        this.double_click_func = function () {};
        this.button_groups = [
            {
                "buttons": [
                    {"name": "create_user", "func": "create_user_func", "button_class": "btn-outline-secondary"},
                    {"name": "duplicate_user", "func": "duplicate_user_func", "button_class": "btn-outline-secondary"},
                    {"name": "delete_user", "func": "delete_user_func", "button_class": "btn-outline-secondary"},
                    {"name": "refresh", "func": "refresh_user_table", "button_class": "btn-outline-secondary"}
                ]
            }
        ]
    }

    refresh_user_table (event) {
        $.getJSON($SCRIPT_ROOT + '/refresh_user_table');
        event.preventDefault();
    }

    delete_user_func (event) {
        const manager = event.data.manager;
        user_id = manager.check_for_selection("user", 0);
        const confirm_text = "Are you sure that you want to delete user " + String(user_id) + "?";
        confirmDialog("Delete User", confirm_text, "do nothing", "delete", function () {
            $.getJSON($SCRIPT_ROOT + '/delete_user/' + user_id, doFlash);
        });
        event.preventDefault();
    }

    create_user_func (event) {
        window.open($SCRIPT_ROOT + '/register');
        event.preventDefault();
    }

    duplicate_user_func (event) {
        window.open($SCRIPT_ROOT + '/user_duplicate');
        event.preventDefault();
    }
}

function resize_window() {
    for (let module_id in resource_managers) {
        const manager = resource_managers[module_id];
        const rsw_row = manager.get_main_content_row();
        resize_dom_to_bottom(rsw_row, 50);
        const rselector = manager.get_aux_right_dom();
        resize_dom_to_bottom(rselector, 50);
    }
}

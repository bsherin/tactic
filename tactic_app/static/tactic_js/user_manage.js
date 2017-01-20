/**
 * Created by bls910 on 7/18/15.ss
 */
let resource_module_template;
let repository_module_template;
const mousetrap = new Mousetrap();
let repository_visible = false;
const user_manage_id = guid();
const page_id = user_manage_id;
const res_types = ["list", "collection", "project", "tile", "code"];
const resource_managers = {};

mousetrap.bind("esc", () => {
    clearStatusArea();
    clearStatusMessage();
    resource_managers[get_current_res_type()].unfilter_me()
});

mousetrap.bind(['command+f', 'ctrl+f'], (e) => {
    const res_type = get_current_res_type();
    resource_managers[res_type].get_search_field(current_manager_kind()).focus();
    e.preventDefault()
});

function start_post_load() {
    if (use_ssl) {
        socket = io.connect(`https://${document.domain}:${location.port}/user_manage`);
    }
    else {
        socket = io.connect(`http://${document.domain}:${location.port}/user_manage`);
    }
    window.onresize = resize_window;

    socket.emit('join', {"user_id":  user_id, "user_manage_id":  user_manage_id});

    socket.on("window-open", (data) => window.open(`${$SCRIPT_ROOT}/load_temp_page/${data["the_id"]}`));

    socket.on('update-selector-list', (data) => {
        resource_managers[data.res_type].fill_selector("resource", data.html, data.select)
    });

    socket.on('update-tag-list', (data) => {
        resource_managers[data.res_type].refresh_tag_buttons("resource", data.html)
    });

    socket.on('stop-spinner', stopSpinner);
    socket.on('start-spinner', startSpinner);
    socket.on('show-status-msg', statusMessage);
    socket.on("clear-status-msg", clearStatusMessage);
    socket.on('update-loaded-tile-list', (data) => $("#loaded-tile-list").html(data.html));
    socket.on('close-user-windows', (data) => {
        if (!(data["originator"] == user_manage_id)) {
            window.close()
        }
    });
    socket.on('doflash', doFlash);
    console.log("about to create");
    $.get(`${$SCRIPT_ROOT}/get_resource_module_template`, function(template) {
        resource_module_template = $(template).filter('#resource-module-template').html();
        resource_managers["list"] = new ResourceManager("list", resource_module_template, list_manager_specifics);
        resource_managers["collection"] = new ResourceManager("collection", resource_module_template, col_manager_specifics);
        resource_managers["project"] = new ResourceManager("project", resource_module_template, project_manager_specifics);
        resource_managers["tile"] = new ResourceManager("tile", resource_module_template, tile_manager_specifics);
        resource_managers["code"] = new ResourceManager("code", resource_module_template, code_manager_specifics);


        get_manager_dom("tile", "resource", ".loaded-tile-list").load(`${$SCRIPT_ROOT}/request_update_loaded_tile_list`);

        $(".resource-module").on("click", ".resource-selector .selector-button", selector_click);
        $(".resource-module").on("dblclick", ".resource-selector .selector-button", selector_double_click);
        $(".resource-module").on("click", ".tag-button-list button", tag_button_clicked);

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
    window.open(`{$SCRIPT_ROOT}/admin_interface`)
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

    for (let res_type of res_types) {
        if (resource_managers.hasOwnProperty(res_type)) {
            const manager = resource_managers[res_type];
            const rsw_row = manager.get_resource_selector_row("resource");
            resize_dom_to_bottom(rsw_row, 50);
            const rep_row = manager.get_resource_selector_row("resource");
            resize_dom_to_bottom(rep_row, 50);
            const tselector = manager.get_tag_button_dom("resource");
            resize_dom_to_bottom(tselector, 50);
            const trepselector = manager.get_tag_button_dom("repository");
            resize_dom_to_bottom(trepselector, 50);
        }
    }
}

const list_manager_specifics = {
    show_add: true,
    show_multiple: false,
    view_view: '/view_list/',
    repository_view_view: '/repository_view_list/',
    duplicate_view: '/create_duplicate_list',
    delete_view: '/delete_list/',
    double_click_func: "view_func",
    repository_double_click_func: "repository_view_func",
    file_adders: [
        {"name": "add_list", "func": "add_list", "button_class": "btn-default"}
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
    add_list (event) {
        const fdata = new FormData(this);
        postAjaxUploadPromise("add_list", fdata)
            .then(() => {})
            .catch(doFlash);
        event.preventDefault();
    }
};

//noinspection JSUnusedGlobalSymbols
const col_manager_specifics = {
    show_add: true,
    show_multiple: true,
    duplicate_view: '/duplicate_collection',
    delete_view: '/delete_collection/',
    load_view: "/main/",
    double_click_func: "load_func",
    file_adders: [
        {"name": "import_as_table", "func": "import_as_table", "button_class": "btn-default"},
        {"name": "import_as_freeform", "func": "import_as_freeform", "button_class": "btn-default"}
    ],
    button_groups: [
        {
            buttons: [
                {"name": "load", "func": "load_func", "button_class": "btn btn-default"}
            ]
        },
        {
            buttons: [
                {"name": "duplicate", "func": "duplicate_func", "button_class": "btn-default"},
                {"name": "combine_collections", "func": "combineCollections", "button_class": "btn-default"}]
        },
        {
            buttons: [{"name": "download", "func": "downloadCollection", "button_class": "btn btn-default"},
                {"name": "share", "func": "send_repository_func", "button_class": "btn-default"}]
        },
        {
            buttons: [
                {"name": "delete", "func": "delete_func", "button_class": "btn-default"}]
        }
    ],
    import_as_table (event) {
        const the_data = new FormData(this);
        $.getJSON(`${$SCRIPT_ROOT}get_resource_names/collection`, function (data) {
                showModal("Import as table", "New collection Name", CreateNewCollection, "NewCollection", data["resource_names"])
            }
        );
        function CreateNewCollection(new_name) {
            startSpinner();
            postAjaxUpload("import_as_table/" + new_name, the_data, doFlashStopSpinner);
        }

        event.preventDefault();
    },
    import_as_freeform (event) {
        const the_data = new FormData(this);
        $.getJSON(`${$SCRIPT_ROOT}get_resource_names/collection`, function (data) {
                showModal("Import as table", "New collection Name", CreateNewCollection, "NewCollection", data["resource_names"])
            }
        );
        function CreateNewCollection(new_name) {
            startSpinner();
            postAjaxUpload("import_as_freeform/" + new_name, the_data, doFlashStopSpinner);
        }

        event.preventDefault();
    },
    downloadCollection (event) {
        const manager = event.data.manager;
        const res_name = manager.check_for_selection("resource");
        if (res_name == "") return;
        showModal("Download Collection as Excel Notebook", "New File Name", function (new_name) {
            window.open(`${$SCRIPT_ROOT}/download_collection/` + res_name + "/" + new_name)
        }, res_name + ".xls")
    },
    combineCollections (event) {
        const manager = event.data.manager;
        const res_name = manager.check_for_selection("resource");
        if (res_name == "") return;
        showModal("Name of collection to combine with " + res_name, "collection Name", function (other_name) {
            startSpinner();
            const target = `${$SCRIPT_ROOT}/combine_collections/${res_name }/${other_name}`;
            $.post(target, doFlashStopSpinner);
        })
    }
};

const project_manager_specifics = {
    show_add: false,
    load_view: "",
    delete_view: "/delete_project/",
    double_click_func: "load_func",
    button_groups: [
        {
            buttons: [
                {"name": "load", "func": "load_func", "button_class": "btn-default"}
            ]
        },
        {
            buttons: [
                {"name": "share", "func": "send_repository_func", "button_class": "btn-default"}
            ]
        },
        {
            buttons: [
                {"name": "delete", "func": "delete_func", "button_class": "btn-default"}
            ]
        }
    ],

    load_func (event) {
        const manager = event.data.manager;
        const res_name = manager.check_for_selection("resource");
        if (res_name == "") return;
        const data = {"project_name": res_name, "user_id": user_id, "user_manage_id": user_manage_id};
        startSpinner();
        postWithCallbackNoMain("host", "main_project", data)
    }
};

const tile_manager_specifics = {
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
    popup_buttons: [{
        "name": "new",
        "button_class": "btn-default",
        "option_list": [{"opt_name": "BasicTileTemplate", "opt_func": "new_basic_tile"},
            {"opt_name": "ExpandedTileTemplate", "opt_func": "new_expanded_tile"},
            {"opt_name": "MatplotlibTileTemplate", "opt_func": "new_matplotlib_tile"}]
    },
        {
            "name": "new_in_creator",
            "button_class": "btn-default",
            "option_list": [{"opt_name": "StandardTile", "opt_func": "new_basic_in_creator"},
                {"opt_name": "MatplotlibTile", "opt_func": "new_mpl_in_creator"}]
        }],
    file_adders: [
        {"name": "add_module", "func": "add_tile_module", "button_class": "btn-default"}
    ],
    button_groups: [
        {
            buttons: [
                {"name": "view", "func": "view_func", "button_class": "btn-default"},
                {"name": "view_in_creator", "func": "creator_view_func", "button_class": "btn-default"},
                {"name": "load", "func": "load_func", "button_class": "btn-default"},
                {"name": "unload", "func": "unload_func", "button_class": "btn-default"}
            ]
        },
        {
            buttons: [
                {"name": "duplicate", "func": "duplicate_func", "button_class": "btn-default"}
            ]
        },
        {
            buttons: [
                {"name": "share", "func": "send_repository_func", "button_class": "btn-default"}
            ]
        },
        {
            buttons: [
                {"name": "delete", "func": "delete_func", "button_class": "btn-default"}
            ]
        }
    ],

    repository_buttons: [
        {"name": "view", "func": "repository_view_func", "button_class": "btn-default"}
    ],

    creator_view_func (event) {
        const manager = event.data.manager;
        const res_name = manager.check_for_selection("resource");
        if (res_name == "") return;
        window.open($SCRIPT_ROOT + manager.creator_view + String(res_name))
    },

    dc_view_func (event) {
        const manager = event.data.manager;
        const res_name = manager.check_for_selection("resource");
        if (res_name == "") return;
        window.open($SCRIPT_ROOT + manager.last_saved_view + String(res_name))
    },

    load_func (event) {
        const manager = event.data.manager;
        const res_name = manager.check_for_selection("resource");
        if (res_name == "") return;
        $.getJSON(`${$SCRIPT_ROOT}/load_tile_module/${res_name}`, doFlash)
    },
    unload_func (event) {
        const manager = event.data.manager;
        const res_name = manager.check_for_selection("resource");
        if (res_name == "") return;
        $.getJSON(`${$SCRIPT_ROOT}/unload_all_tiles`, doFlash)
    },

    add_tile_module (event) {
        const form_data = new FormData(this);
        postAjaxUpload("add_tile_module", form_data, doFlashOnFailure(data));
        event.preventDefault();
    },

    new_in_creator (event, template_name) {
        const manager = event.data.manager;
        $.getJSON(`${$SCRIPT_ROOT}/get_resource_names/tile`, function (data) {
                showModal("New Tile", "New Tile Name", CreateNewTileModule, "NewTileModule", data["resource_names"])
            }
        );
        function CreateNewTileModule(new_name) {
            const result_dict = {
                "template_name": template_name,
                "new_res_name": new_name,
                "last_saved": "creator"
            };
            postAjaxPromise(manager.new_view, result_dict)
                .then(() => window.open($SCRIPT_ROOT + manager.creator_view + String(new_name)))
                .catch(doFlash)
            }
        event.preventDefault();
    },

    new_basic_in_creator (event) {
        event.data.manager.new_in_creator(event, "BasicTileTemplate");
        event.preventDefault();
    },

    new_mpl_in_creator (event) {
        event.data.manager.new_in_creator(event, "MatplotlibTileTemplate");
        event.preventDefault();
    },

    new_basic_tile (event) {
        event.data.manager.new_tile(event, "BasicTileTemplate");
    },

    new_expanded_tile (event) {
        event.data.manager.new_tile(event, "ExpandedTileTemplate");
    },

    new_matplotlib_tile (event) {
        event.data.manager.new_tile(event, "MatplotlibTileTemplate");
    },

    new_tile (event, template_name) {
        const manager = event.data.manager;
        $.getJSON($SCRIPT_ROOT + "get_resource_names/tile", function (data) {
                showModal("New Tile", "New Tile Name", CreateNewTileModule, "NewTileModule", data["resource_names"])
            }
        );
        function CreateNewTileModule(new_name) {
            const result_dict = {
                "template_name": template_name,
                "new_res_name": new_name,
                "last_saved": "viewer"
            };
            postAjaxPromise(manager.new_view, result_dict)
                .then(() => window.open($SCRIPT_ROOT + manager.view_view + String(new_name)))
                .catch(doFlash)
            }
        event.preventDefault();
    }
};

const code_manager_specifics = {
    show_multiple: false,
    new_view: '/create_code',
    view_view: '/view_code/',
    repository_view_view: '/repository_view_code/',
    delete_view: "/delete_code/",
    duplicate_view: '/create_duplicate_code',
    double_click_func: "view_func",
    repository_double_click_func: "repository_view_func",
    show_loaded_list: true,
    popup_buttons: [{
        "name": "new",
        "button_class": "btn-default",
        "option_list": [{"opt_name": "BasicCodeTemplate", "opt_func": "new_code"}]
    }],
    file_adders: [
        {"name": "add_code", "func": "add_code", "button_class": "btn-default"}
    ],
    button_groups: [
        {
            buttons: [
                {"name": "view", "func": "view_func", "button_class": "btn-default"}
            ]
        },
        {
            buttons: [
                {"name": "duplicate", "func": "duplicate_func", "button_class": "btn-default"}
            ]
        },
        {
            buttons: [
                {"name": "share", "func": "send_repository_func", "button_class": "btn-default"}
            ]
        },
        {
            buttons: [
                {"name": "delete", "func": "delete_func", "button_class": "btn-default"}
            ]
        }
    ],

    repository_buttons: [
        {"name": "view", "func": "repository_view_func", "button_class": "btn-default"}
    ],
    add_code (event) {
        const form_data = new FormData(this);
        postAjaxUpload("add_code", form_data, doFlashOnFailure(data));
        event.preventDefault();
    },
    new_code (event) {
        const manager = event.data.manager;
        const template_name = "BasicCodeTemplate";
        $.getJSON(`${$SCRIPT_ROOT}/get_resource_names/code`, function (data) {
                showModal("New Code Resource", "New Code Resource Name", CreateNewCodeResource, "NewCodeResource", data["resource_names"])
            }
        );

        function CreateNewCodeResource(new_name) {
            const result_dict = {
                "template_name": template_name,
                "new_res_name": new_name
            };
            postAjaxPromise(manager.new_view, result_dict)
                .then(() => window.open($SCRIPT_ROOT + manager.view_view + String(new_name)))
                .catch(doFlash)
        }
        event.preventDefault();
    }
};

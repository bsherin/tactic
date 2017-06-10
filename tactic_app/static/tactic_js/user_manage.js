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
    clearStatusMessage();
    resource_managers[get_current_module_id()].unfilter_me()
});

mousetrap.bind(['command+f', 'ctrl+f'], (e) => {
    const mod_id = get_current_module_id();
    resource_managers[mod_id].get_search_field().focus();
    e.preventDefault()
});

function get_current_module_id() {
    let res_type = get_current_res_type();
    if (repository_visible) {
        return `repository_${res_type}_module`
    }
    else {
        return `${res_type}_module`
    }
}

function start_post_load() {
    let socket;
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
        const manager = resource_managers[data.module_id];
        manager.fill_content(data.html);
        manager.select_resource_button(data.select)
    });

    socket.on('update-tag-list', (data) => {
        resource_managers[data.module_id].refresh_tag_buttons(data.html)
    });

    socket.on('stop-spinner', stopSpinner);
    socket.on('start-spinner', startSpinner);
    socket.on('show-status-msg', statusMessage);
    socket.on("clear-status-msg", clearStatusMessage);
    socket.on('update-loaded-tile-list', (data) => {
        resource_managers["tile_module"].get_aux_right_dom().html(data.html)
    });
    socket.on('close-user-windows', (data) => {
        if (!(data["originator"] == user_manage_id)) {
            window.close()
        }
    });
    socket.on('doflash', doFlash);
    console.log("about to create");
    $.get(`${$SCRIPT_ROOT}/get_resource_module_template`, function(template) {
        resource_module_template = $(template).filter('#resource-module-template').html();
        resource_managers["list_module"] = new ListManager("list_module", "list", resource_module_template, "#list-module-outer");
        resource_managers["repository_list_module"] = new RepositoryListManager("repository_list_module", "list", resource_module_template, "#list-module-outer");
        resource_managers["collection_module"] = new CollectionManager("collection_module", "collection", resource_module_template, "#collection-module-outer");
        resource_managers["repository_collection_module"] = new RepositoryCollectionManager("repository_collection_module", "collection", resource_module_template, "#collection-module-outer");
        resource_managers["project_module"] = new ProjectManager("project_module", "project", resource_module_template, "#project-module-outer");
        resource_managers["repository_project_module"] = new RepositoryProjectManager("repository_project_module", "project", resource_module_template, "#project-module-outer");
        resource_managers["tile_module"] = new TileManager("tile_module", "tile", resource_module_template, "#tile-module-outer");
        resource_managers["repository_tile_module"] = new RepositoryTileManager("repository_tile_module", "tile", resource_module_template, "#tile-module-outer");
        resource_managers["code_module"] = new CodeManager("code_module", "code", resource_module_template, "#code-module-outer");
        resource_managers["repository_code_module"] = new RepositoryCodeManager("repository_code_module", "code", resource_module_template, "#code-module-outer");

        $(".resource-module").on("click", ".main-content .selector-button", selector_click);
        $(".resource-module").on("dblclick", ".main-content .selector-button", selector_double_click);
        $(".resource-module").on("click", ".tag-button-list button", tag_button_clicked);

        $(".resource-module").on("keyup", ".search-field", function(e) {
            if (e.which == 13) {
                let mod_id = get_current_module_id();
                resource_managers[mod_id].search_my_resource();
                e.preventDefault();
            }
            else {
                let mod_id = get_current_module_id();
                resource_managers[mod_id].search_my_resource();
            }
        });
        $(".resource-module").on("keyup", ".search-tags-field", function(e) {
            if (e.which == 13) {
                let mod_id = get_current_module_id();
                resource_managers[mod_id].search_my_tags();
                e.preventDefault();
            }
            else {
                let mod_id = get_current_module_id();
                resource_managers[mod_id].search_my_tags();
            }
        });
        resize_window();
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (event) {
            // $(event.currentTarget).attr("href")
            current_modid = get_current_module_id()
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
        stopSpinner()
        resource_managers[get_current_module_id()].turn_on_horizontal_resize();
    })
}

function toggleRepository() {
    for (let res_type of res_types) {
        let old_manager;
        let new_manager;
        if (repository_visible) {
            old_manager = resource_managers[`repository_${res_type}_module`];
            new_manager = resource_managers[`${res_type}_module`];
        }
        else {
            new_manager = resource_managers[`repository_${res_type}_module`];
            old_manager = resource_managers[`${res_type}_module`];

        }
        old_manager.get_module_dom().css("display", "none");
        old_manager.turn_off_horizontal_resize();
        new_manager.get_module_dom().css("display", "block");
    }
    if (repository_visible) {
        repository_visible = false;
        $("#toggle-repository-button").text("Show Repository");
        $("#view_title").text(saved_title);
        $(".page-header").removeClass("repository-title");
        }
    else {
        repository_visible = true;
        $("#toggle-repository-button").text("Hide Repository");
        $("#view_title").text("Repository");
        $(".page-header").addClass("repository-title");
    }
    resize_window();
    resource_managers[get_current_module_id()].turn_on_horizontal_resize();
    return(false)
}

function selector_click(event) {
    if (event.originalEvent.detail <= 1) {  // Will suppress on second click of a double-click
        const row_element = $(event.target).closest('tr');
        resource_managers[get_current_module_id()].selector_click(row_element[0])
    }
}

function selector_double_click(event) {
    const row_element = $(event.target).closest('tr');
    const res_type = get_current_res_type();
    let manager = resource_managers[get_current_module_id()];
    manager.get_all_selector_buttons().removeClass("active");
    row_element.addClass("active");
    event.data = {"manager": manager, "res_type": res_type};
    manager[manager.double_click_func](event)
}

function tag_button_clicked(event) {
    const txt = event.target.innerHTML;
    resource_managers[get_current_module_id()].search_given_tags([txt])
    resource_managers[get_current_module_id()].set_tag_button_state(txt);
}

function showAdmin() {
    window.open(`${$SCRIPT_ROOT}/admin_interface`)
}


function resize_window() {
    for (let module_id in resource_managers) {
        const manager = resource_managers[module_id];
        manager.resize_to_window()
    }
}

class ListManager extends UserManagerResourceManager {
    set_extra_properties() {
        super.set_extra_properties();
        this.start_hidden = false;
        this.update_view = "request_update_selector_list";
        this.update_tag_view = "request_update_tag_list";
        this.view_view = '/view_list/';
        this.delete_view = `/delete_list`;
        this.double_click_func = "view_func";
        this.duplicate_view = '/create_duplicate_list';

        this.file_adders =[
            {"name": "add_list", "func": "add_list", "button_class": "btn-default", "show_multiple": false}
        ];
        this.button_groups = [
            {"buttons": [{"name": "view", "func": "view_func", "button_class": "btn-default"}]},
            {"buttons": [{"name": "duplicate", "func": "duplicate_func", "button_class": "btn-default"},
                         {"name": "rename", "func": "rename_func", "button_class": "btn-default"}]},
            {"buttons": [{"name": "share", "func": "send_repository_func", "button_class": "btn-default"}]},
            {"buttons": [{"name": "delete", "func": "delete_func", "button_class": "btn-default"}]}
        ]
    }

    add_list (event) {
        const fdata = new FormData(this);
        postAjaxUploadPromise("add_list", fdata)
            .then(() => {})
            .catch(doFlash);
        event.preventDefault();
    }
}

class RepositoryListManager extends UserManagerResourceManager {
    set_extra_properties() {
        super.set_extra_properties();
        this.is_repository = true;
        this.start_hidden = true;
        this.update_view = "request_update_repository_selector_list";
        this.update_tag_view = "request_update_repository_tag_list";
        this.view_view = '/repository_view_list/';
        this.double_click_func = "view_func";
        this.button_groups = [
            {"buttons": [{"name": "view", "func": "view_func", "button_class": "btn-default"},
                        {"name": "copy_to_libary", "func": "repository_copy_func", "button_class": "btn-default"}
            ]}
        ]
    }
}

class CollectionManager extends UserManagerResourceManager {
    set_extra_properties() {
        super.set_extra_properties();
        this.start_hidden = false;
        this.update_view = "request_update_selector_list";
        this.update_tag_view = "request_update_tag_list";
        this.delete_view = `/delete_collection`;
        this.double_click_func = "load_func";
        this.duplicate_view = '/duplicate_collection';
        this.load_view = "/main/";

        this.file_adders = [
            {"name": "import_as_table", "func": "import_as_table", "button_class": "btn-default", show_multiple: true},
            {
                "name": "import_as_freeform",
                "func": "import_as_freeform",
                "button_class": "btn-default",
                show_multiple: true
            }
        ];
        this.button_groups = [
            {buttons: [
                    {"name": "load", "func": "load_func", "button_class": "btn btn-default"}]
            },
            {buttons: [
                    {"name": "duplicate", "func": "duplicate_func", "button_class": "btn-default"},
                    {"name": "rename", "func": "rename_func", "button_class": "btn-default"},
                    {"name": "combine_collections", "func": "combineCollections", "button_class": "btn-default"}]
            },
            {buttons: [{"name": "download", "func": "downloadCollection", "button_class": "btn btn-default"},
                    {"name": "share", "func": "send_repository_func", "button_class": "btn-default"}]
            },
            {buttons: [
                    {"name": "delete", "func": "delete_func", "button_class": "btn-default"}]
            }
        ];
    }
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
    };
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
    };
    downloadCollection (event) {
        const manager = event.data.manager;
        const res_name = manager.check_for_selection("resource");
        if (res_name == "") return;
        showModal("Download Collection as Excel Notebook", "New File Name", function (new_name) {
            window.open(`${$SCRIPT_ROOT}/download_collection/` + res_name + "/" + new_name)
        }, res_name + ".xls")
    };
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
}

class RepositoryCollectionManager extends UserManagerResourceManager {
    set_extra_properties() {
        super.set_extra_properties();
        this.is_repository = true;
        this.start_hidden = true;
        this.update_view = "request_update_repository_selector_list";
        this.update_tag_view = "request_update_repository_tag_list";
        this.button_groups = [
            {"buttons": [{"name": "copy_to_libary", "func": "repository_copy_func", "button_class": "btn-default"}]}
        ]
    }
}

class ProjectManager extends UserManagerResourceManager {
    set_extra_properties() {
        super.set_extra_properties();
        this.start_hidden = false;
        this.update_view = "request_update_selector_list";
        this.update_tag_view = "request_update_tag_list";
        this.load_view = "";
        this.delete_view = "/delete_project";
        this.double_click_func = "load_func";
        this.load_view = "/main_project/";
        this.button_groups = [
            {buttons: [
                    {"name": "load", "func": "load_func", "button_class": "btn-default"}]
            },
            {buttons: [
                    {"name": "rename", "func": "rename_func", "button_class": "btn-default"},
                    {"name": "share", "func": "send_repository_func", "button_class": "btn-default"}]
            },
            {buttons: [
                    {"name": "delete", "func": "delete_func", "button_class": "btn-default"}]
            }
        ];
    }

}

class RepositoryProjectManager extends UserManagerResourceManager {
    set_extra_properties() {
        super.set_extra_properties();
        this.is_repository = true;
        this.start_hidden = true;
        this.update_view = "request_update_repository_selector_list";
        this.update_tag_view = "request_update_repository_tag_list";
        this.button_groups = [
            {"buttons": [{"name": "copy_to_libary", "func": "repository_copy_func", "button_class": "btn-default"}]}
        ]
    }
}

class TileManager extends UserManagerResourceManager {
    set_extra_properties() {
        super.set_extra_properties();
        this.aux_right = true;
        this.start_hidden = false;
        this.update_view = "request_update_selector_list";
        this.update_tag_view = "request_update_tag_list";
        this.new_view = '/create_tile_module';
        this.view_view = '/view_module/';
        this.creator_view = '/view_in_creator/';
        this.last_saved_view = '/last_saved_view/';
        this.delete_view = "/delete_tile_module";
        this.duplicate_view = '/create_duplicate_tile';
        this.double_click_func = "dc_view_func";
        this.popup_buttons = [{
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
                    {"opt_name": "MatplotlibTile", "opt_func": "new_mpl_in_creator"},
                    {"opt_name": "D3Tile", "opt_func": "new_d3_in_creator"}]
            }];
        this.file_adders = [
            {
                "name": "add_module",
                "func": "add_tile_module",
                "button_class": "btn-default",
                "show_multiple": false,
            }
        ];
        this.button_groups = [
            {buttons: [
                    {"name": "view", "func": "view_func", "button_class": "btn-default"},
                    {"name": "view_in_creator", "func": "creator_view_func", "button_class": "btn-default"},
                    {"name": "load", "func": "load_func", "button_class": "btn-default"},
                    {"name": "unload", "func": "unload_func", "button_class": "btn-default"}]
            },
            {buttons: [
                    {"name": "duplicate", "func": "duplicate_func", "button_class": "btn-default"},
                    {"name": "rename", "func": "rename_func", "button_class": "btn-default"}]
            },
            {buttons: [
                    {"name": "share", "func": "send_repository_func", "button_class": "btn-default"}]
            },
            {buttons: [
                    {"name": "delete", "func": "delete_func", "button_class": "btn-default"}]
            }
        ]
    }

    update_aux_content() {
        super.update_aux_content();
        this.get_aux_right_dom().load(`${$SCRIPT_ROOT}/request_update_loaded_tile_list`)
    }

    creator_view_func (event) {
        const manager = event.data.manager;
        const res_name = manager.check_for_selection("resource");
        if (res_name == "") return;
        window.open($SCRIPT_ROOT + manager.creator_view + String(res_name))
    }

    dc_view_func (event) {
        const manager = event.data.manager;
        const res_name = manager.check_for_selection("resource");
        if (res_name == "") return;
        window.open($SCRIPT_ROOT + manager.last_saved_view + String(res_name))
    }

    load_func (event) {
        const manager = event.data.manager;
        const res_name = manager.check_for_selection("resource");
        if (res_name == "") return;
        $.getJSON(`${$SCRIPT_ROOT}/load_tile_module/${res_name}`, doFlash)
    }
    unload_func (event) {
        const manager = event.data.manager;
        const res_name = manager.check_for_selection("resource");
        if (res_name == "") return;
        $.getJSON(`${$SCRIPT_ROOT}/unload_all_tiles`, doFlash)
    }

    add_tile_module (event) {
        const form_data = new FormData(this);
        postAjaxUpload("add_tile_module", form_data, doFlashOnFailure(data));
        event.preventDefault();
    }

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
    }

    new_basic_in_creator (event) {
        event.data.manager.new_in_creator(event, "BasicTileTemplate");
        event.preventDefault();
    }

    new_mpl_in_creator (event) {
        event.data.manager.new_in_creator(event, "MatplotlibTileTemplate");
        event.preventDefault();
    }

    new_d3_in_creator (event) {
        event.data.manager.new_in_creator(event, "D3TileTemplate");
        event.preventDefault();
    }

    new_basic_tile (event) {
        event.data.manager.new_tile(event, "BasicTileTemplate");
    }

    new_expanded_tile (event) {
        event.data.manager.new_tile(event, "ExpandedTileTemplate");
    }

    new_matplotlib_tile (event) {
        event.data.manager.new_tile(event, "MatplotlibTileTemplate");
    }

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
}

class RepositoryTileManager extends UserManagerResourceManager {
    set_extra_properties() {
        super.set_extra_properties();
        this.is_repository = true;
        this.start_hidden = true;
        this.update_view = "request_update_repository_selector_list";
        this.update_tag_view = "request_update_repository_tag_list";
        this.view_view = '/repository_view_module/';
        this.double_click_func = "view_func";
        this.button_groups = [
            {"buttons": [{"name": "view", "func": "view_func", "button_class": "btn-default"},
                    {"name": "copy_to_libary", "func": "repository_copy_func", "button_class": "btn-default"}]
            }
        ]
    };
}

class CodeManager extends UserManagerResourceManager {
    set_extra_properties() {
        super.set_extra_properties();
        this.start_hidden = false;
        this.update_view = "request_update_selector_list";
        this.update_tag_view = "request_update_tag_list";
        this.new_view = '/create_code';
        this.view_view = '/view_code/';
        this.delete_view = "/delete_code";
        this.duplicate_view = '/create_duplicate_code';
        this.double_click_func = "view_func";
        this.popup_buttons = [{
            "name": "new",
            "button_class": "btn-default",
            "option_list": [{"opt_name": "BasicCodeTemplate", "opt_func": "new_code"}]
        }];
        this.file_adders = [
            {"name": "add_code", "func": "add_code", "button_class": "btn-default", show_multiple: false}
        ];
        this.button_groups = [
            {buttons: [
                    {"name": "view", "func": "view_func", "button_class": "btn-default"}]
            },
            {buttons: [
                    {"name": "duplicate", "func": "duplicate_func", "button_class": "btn-default"},
                    {"name": "rename", "func": "rename_func", "button_class": "btn-default"}]
            },
            {buttons: [
                    {"name": "share", "func": "send_repository_func", "button_class": "btn-default"}]
            },
            {buttons: [
                    {"name": "delete", "func": "delete_func", "button_class": "btn-default"}]
            }
        ];
    }
    add_code (event) {
        const form_data = new FormData(this);
        postAjaxUpload("add_code", form_data, doFlashOnFailure(data));
        event.preventDefault();
    }
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
}

class RepositoryCodeManager extends UserManagerResourceManager {
    set_extra_properties() {
        super.set_extra_properties();
        this.is_repository = true;
        this.start_hidden = true;
        this.update_view = "request_update_repository_selector_list";
        this.update_tag_view = "request_update_repository_tag_list";
        this.view_view = '/repository_view_code/';
        this.double_click_func = "view_func";
        this.button_groups = [
            {"buttons": [{"name": "view", "func": "view_func", "button_class": "btn-default"},
                    {"name": "copy_to_libary", "func": "repository_copy_func", "button_class": "btn-default"}]
            }
        ]
    };
}

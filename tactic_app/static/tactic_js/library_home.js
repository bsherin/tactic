/**
 * Created by bls910 on 7/18/15.ss
 */

let saved_title = $("#view-title").text();
let resource_module_template;
let repository_module_template;
const mousetrap = new Mousetrap();
let repository_visible = false;
let tsocket;
const library_id = guid();
const page_id = library_id;
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

function get_current_module_id() {
    let res_type = get_current_res_type();
    if (repository_visible) {
        return `repository_${res_type}_module`
    }
    else {
        return `${res_type}_module`
    }
}

class LibraryTacticSocket extends TacticSocket {

    initialize_socket_stuff() {

        this.socket.emit('join', {"user_id":  user_id, "library_id":  library_id});

        this.socket.on("window-open", (data) => window.open(`${$SCRIPT_ROOT}/load_temp_page/${data["the_id"]}`));

        this.socket.on('update-selector-list', (data) => {
            const manager = resource_managers[data.module_id];
            manager.fill_content(data.html);
            manager.select_resource_button(data.select);
            manager.tag_button_list.refresh_from_selectors();
        });

        this.socket.on('update-tag-list', (data) => {
            resource_managers[data.module_id].tag_button_list.refresh_given_taglist(data.tag_list)
        });

        this.socket.on('handle-callback', handleCallback);
        this.socket.on('stop-spinner', stopSpinner);
        this.socket.on('start-spinner', startSpinner);
        this.socket.on('show-status-msg', statusMessage);
        this.socket.on("clear-status-msg", clearStatusMessage);
        this.socket.on('update-loaded-tile-list', (data) => {
            resource_managers["tile_module"].get_aux_right_dom().html(data.html)
        });
        this.socket.on('close-user-windows', (data) => {
            if (!(data["originator"] == library_id)) {
                window.close()
            }
        });
        this.socket.on('doflash', doFlash);
    }
}

function _library_home_main() {
    tsocket = new LibraryTacticSocket("library", 5000);

    var module_info =
        {"list_module": ListManager,
            "repository_list_module": RepositoryListManager,
            "collection_module": CollectionManager,
            "repository_collection_module": RepositoryCollectionManager,
            "project_module": ProjectManager,
            "repository_project_module": RepositoryProjectManager,
            "tile_module": TileManager,
            "repository_tile_module": RepositoryTileManager,
            "code_module": CodeManager,
            "repository_code_module": RepositoryCodeManager,
            "all_module": AllManager,
            "repository_all_module": RepositoryAllManager
        };

    window.onresize = resize_window;
    console.log("about to create");
    $.get(`${$SCRIPT_ROOT}/get_resource_module_template`, function(template) {
        let resource_module_template = $(template).filter('#resource-module-template').html();
        for (var module_name in module_info) {
            resource_managers[module_name] = new module_info[module_name](resource_module_template)
        }

        resize_window();
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (event) {
            // $(event.currentTarget).attr("href")
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

function toggleRepository() {
    for (let res_type of res_types.concat("all")) {
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
        old_manager.get_module_dom().removeClass("d-flex");
        old_manager.turn_off_horizontal_resize();
        new_manager.get_module_dom().css("display", "flex");
    }
    if (repository_visible) {
        repository_visible = false;
        $("#toggle-repository-button").text("Show Repository");
        $("#view_title").text(saved_title);
        $(".page-header").removeClass("repository-title");
        $("#nav-list").removeClass("repo")
        }
    else {
        repository_visible = true;
        $("#toggle-repository-button").text("Hide Repository");
        $("#view_title").text("Repository");
        $(".page-header").addClass("repository-title");
        $("#nav-list").addClass("repo")
    }
    resize_window();
    resource_managers[get_current_module_id()].turn_on_horizontal_resize();
    return(false)
}

function resize_window() {
    for (let module_id in resource_managers) {
        const manager = resource_managers[module_id];
        manager.resize_to_window()
    }
}

class ListManager extends LibraryResourceManager {
    constructor (resource_module_template) {
        super ("list_module", "list", resource_module_template, "#list-module-outer", "notrepo")
    }

    set_extra_properties() {
        super.set_extra_properties();
        this.start_hidden = false;
        this.allow_search_inside = true;
        this.allow_metadata_search = true;
        this.search_inside_view = "search_inside_lists";
        this.search_metadata_view = "search_list_metadata";
        this.update_view = "request_update_selector_list";
        this.update_tag_view = "request_update_tag_list";
        this.view_view = '/view_list/';
        this.delete_view = `/delete_list`;
        this.double_click_func = "view_func";
        this.duplicate_view = '/create_duplicate_list';
        this.refresh_task = 'update_list_selector_list';

        this.file_adders =[
            {"name": "add_list", "func": "add_list", "button_class": "btn-outline-secondary", "show_multiple": false,"icon_name": "cloud-upload"}
        ];
        this.button_groups = [
            {"buttons": [{"name": "edit", "func": "view_func", "button_class": "btn-outline-secondary", "icon_name": "pencil"}]},
            {"buttons": [{"name": "duplicate", "func": "duplicate_func", "button_class": "btn-outline-secondary", "icon_name": "copy"},
                         {"name": "rename", "func": "rename_func", "button_class": "btn-outline-secondary", "icon_name": "edit"}]},
            {"buttons": [{"name": "share", "func": "send_repository_func", "button_class": "btn-outline-secondary", "icon_name": "share"}]},
            {"buttons": [{"name": "delete", "func": "delete_func", "button_class": "btn-outline-secondary", "icon_name": "trash"}]},
            {"buttons": [{"name": "refresh", "func": "refresh_func", "button_class": "btn-outline-secondary", "icon_name": "sync-alt"}]}
        ]
    }

    add_list (event) {
        const fdata = new FormData(this);
        let manager = event.data.manager;
        postAjaxUploadPromise("add_list", fdata)
            .then((data) => {
                    manager.insert_new_row(data.new_row, 0);
                    manager.select_first_row();
                    resource_managers["all_module"].insert_new_row(data.new_all_row, 0)
            })
            .catch(doFlash);
        event.preventDefault();
    }
}

class RepositoryListManager extends LibraryResourceManager {
    constructor(resource_module_template) {
        super("repository_list_module", "list", resource_module_template, "#list-module-outer", "repo")
    }
    set_extra_properties() {
        super.set_extra_properties();
        this.is_repository = true;
        this.start_hidden = true;
        this.update_view = "request_update_repository_selector_list";
        this.update_tag_view = "request_update_repository_tag_list";
        this.view_view = '/repository_view_list/';
        this.double_click_func = "view_func";
        this.button_groups = [
            {"buttons": [{"name": "view", "func": "view_func", "button_class": "btn-outline-secondary", "icon_name": "book-open"},
                        {"name": "copy", "func": "repository_copy_func", "button_class": "btn-outline-secondary", "icon_name": "share"}
            ]}
        ]
    }
}

class CollectionManager extends LibraryResourceManager {
    constructor (resource_module_template) {
        super ("collection_module", "collection", resource_module_template, "#collection-module-outer", "notrepo")
    }
    set_extra_properties() {
        super.set_extra_properties();
        this.start_hidden = false;
        this.update_view = "request_update_selector_list";
        this.update_tag_view = "request_update_tag_list";
        this.delete_view = `/delete_collection`;
        this.double_click_func = "view_func";
        this.duplicate_view = '/duplicate_collection';
        this.view_view = "/main/";
        this.refresh_task = 'update_collection_selector_list';

        this.file_adders = [
            {"name": "import", "func": "import_collection", "button_class": "btn-outline-secondary", show_multiple: true, "icon_name": "cloud-upload"}
        ];
        this.button_groups = [
            {buttons: [

                    {"name": "open", "func": "view_func", "button_class": "btn btn-outline-secondary", "icon_name": "book-open"}]
            },
            {buttons: [
                    {"name": "duplicate", "func": "duplicate_func", "button_class": "btn-outline-secondary", "icon_name": "copy"},
                    {"name": "rename", "func": "rename_func", "button_class": "btn-outline-secondary", "icon_name": "edit"},
                    {"name": "combine", "func": "combineCollections", "button_class": "btn-outline-secondary", "icon_name": "plus-square"}]
            },
            {buttons: [{"name": "download", "func": "downloadCollection", "button_class": "btn btn-outline-secondary", "icon_name": "cloud-download"},
                    {"name": "share", "func": "send_repository_func", "button_class": "btn-outline-secondary", "icon_name": "share"}]
            },
            {buttons: [
                    {"name": "delete", "func": "delete_func", "button_class": "btn-outline-secondary", "icon_name": "trash"}]
            },
            {"buttons":
                    [{"name": "refresh", "func": "refresh_func", "button_class": "btn-outline-secondary", "icon_name": "sync-alt"}]
            }
        ];
    }

    displayImportResults(data) {
        let title = "Collection Created";
        let message = "";
        let number_of_errors;
        if (data.file_decoding_errors == null) {
            message = "No decoding errors were encounters"
        }
        else {
            message = "<b>Decoding errors were enountered</b>";
            for (let filename in data.file_decoding_errors) {
                number_of_errors = String(data.file_decoding_errors[filename].length);
                message = message + `<br>${filename}: ${number_of_errors} errors`;
            }
        }
        alertify.alert(title, message).set({'pinnable': false, 'modal':false})
    }

    import_collection (event) {
        const the_data = new FormData(this);
        let manager = event.data.manager;
        let checkboxes = [{"checkname": "import_as_freeform", "checktext": "Import as freeform"}];
        $.getJSON(`${$SCRIPT_ROOT}get_resource_names/collection`, function (data) {
                showModal("Import collection", "New collection Name", CreateNewCollection, "NewCollection", data["resource_names"], checkboxes)
            }
        );
        function CreateNewCollection(new_name, check_results) {
            startSpinner();
            let url_base;
            if (check_results["import_as_freeform"]) {
                url_base = "import_as_freeform"
            }
            else {
                url_base = "import_as_table"
            }
            postAjaxUploadPromise(`${url_base}/${new_name}/${library_id}`, the_data)
                .then((data) => {
                        clearStatusMessage();
                        manager.displayImportResults(data);
                        manager.insert_new_row(data.new_row, 0);
                        manager.select_first_row();
                        resource_managers["all_module"].insert_new_row(data.new_all_row, 0);
                        stopSpinner();
                })
                .catch(doFlash);
        }
        event.preventDefault();
    };

    downloadCollection (event) {
        const manager = event.data.manager;
        const res_name = manager.check_for_selection("resource");
        if (res_name == "") return;
        showModal("Download Collection as Excel Notebook", "New File Name", function (new_name) {
            window.open(`${$SCRIPT_ROOT}/download_collection/` + res_name + "/" + new_name)
        }, res_name + ".xlsx")
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

class RepositoryCollectionManager extends LibraryResourceManager {
    constructor (resource_module_template) {
        super ("repository_collection_module", "collection", resource_module_template, "#collection-module-outer", "repo")
    }
    set_extra_properties() {
        super.set_extra_properties();
        this.is_repository = true;
        this.start_hidden = true;
        this.update_view = "request_update_repository_selector_list";
        this.update_tag_view = "request_update_repository_tag_list";
        this.button_groups = [
            {"buttons": [{"name": "copy", "func": "repository_copy_func", "button_class": "btn-outline-secondary", "icon_name": "share"}]}
        ]
    }
}

class ProjectManager extends LibraryResourceManager {
    constructor (resource_module_template) {
        super ("project_module", "project", resource_module_template, "#project-module-outer", "notrepo")
    }
    set_extra_properties() {
        super.set_extra_properties();
        this.start_hidden = false;
        this.allow_metadata_search = true;
        this.search_metadata_view = "search_project_metadata";
        this.update_view = "request_update_selector_list";
        this.update_tag_view = "request_update_tag_list";
        this.load_view = "";
        this.delete_view = "/delete_project";
        this.duplicate_view = '/duplicate_project';
        this.double_click_func = "view_func";
        this.view_view = "/main_project/";
        this.refresh_task = 'update_project_selector_list';
        this.button_groups = [
            {buttons: [
                    {"name": "notebook", "func": "newNotebook", "button_class": "btn btn-outline-secondary", "icon_name": "book"},
                    {"name": "open", "func": "view_func", "button_class": "btn-outline-secondary", "icon_name": "book-open"}]
            },
            {buttons: [
                    {"name": "rename", "func": "rename_func", "button_class": "btn-outline-secondary", "icon_name": "edit"},
                    {"name": "duplicate", "func": "duplicate_func", "button_class": "btn-outline-secondary", "icon_name": "copy"}]
            },
            {buttons: [
                    {"name": "share", "func": "send_repository_func", "button_class": "btn-outline-secondary", "icon_name": "share"}]
            },
            {buttons: [
                    {"name": "delete", "func": "delete_func", "button_class": "btn-outline-secondary", "icon_name": "trash"}]
            },
            {"buttons": [
                {"name": "refresh", "func": "refresh_func", "button_class": "btn-outline-secondary", "icon_name": "sync-alt"}]
            }
        ];
    }

    newNotebook (event) {
        window.open(`${$SCRIPT_ROOT}/new_notebook`)
    }

}

class RepositoryProjectManager extends LibraryResourceManager {
    constructor (resource_module_template) {
        super ("repository_project_module", "project", resource_module_template, "#project-module-outer", "repo")
    }
    set_extra_properties() {
        super.set_extra_properties();
        this.is_repository = true;
        this.start_hidden = true;
        this.update_view = "request_update_repository_selector_list";
        this.update_tag_view = "request_update_repository_tag_list";
        this.button_groups = [
            {"buttons": [{"name": "copy", "func": "repository_copy_func", "button_class": "btn-outline-secondary", "icon_name": "share"}]}
        ]
    }
}

class TileManager extends LibraryResourceManager {
    constructor (resource_module_template) {
        super ("tile_module", "tile", resource_module_template, "#tile-module-outer", "notrepo")
    }
    set_extra_properties() {
        super.set_extra_properties();
        this.aux_right = true;
        this.start_hidden = false;
        this.allow_search_inside = true;
        this.allow_metadata_search = true;
        this.search_inside_view = "search_inside_tiles";
        this.search_metadata_view = "search_tile_metadata";
        this.update_view = "request_update_selector_list";
        this.update_tag_view = "request_update_tag_list";
        this.new_view = '/create_tile_module';
        this.view_view = '/view_module/';
        this.creator_view = '/view_in_creator/';
        this.last_saved_view = '/last_saved_view/';
        this.delete_view = "/delete_tile_module";
        this.duplicate_view = '/create_duplicate_tile';
        this.double_click_func = "dc_view_func";
        this.refresh_task = 'update_tile_selector_list';
        this.popup_buttons = [{
            "name": "new",
            "button_class": "btn-outline-secondary",
            "icon_name": "plus-circle",
            "option_list": [{"opt_name": "BasicTileTemplate", "opt_func": "new_basic_tile"},
                {"opt_name": "ExpandedTileTemplate", "opt_func": "new_expanded_tile"},
                {"opt_name": "MatplotlibTileTemplate", "opt_func": "new_matplotlib_tile"}]
            },
            {
                "name": "creator",
                "button_class": "btn-outline-secondary",
                "icon_name": "plus-circle",
                "option_list": [{"opt_name": "StandardTile", "opt_func": "new_basic_in_creator"},
                    {"opt_name": "MatplotlibTile", "opt_func": "new_mpl_in_creator"},
                    {"opt_name": "D3Tile", "opt_func": "new_d3_in_creator"}]
            }];
        this.file_adders = [
            // {
            //     "name": "add_module",
            //     "func": "add_tile_module",
            //     "button_class": "btn-outline-secondary",
            //     "show_multiple": false,
            // }
        ];
        this.button_groups = [
            {buttons: [
                    {"name": "edit", "func": "view_func", "button_class": "btn-outline-secondary", "icon_name": "pencil"},
                    {"name": "creator", "func": "creator_view_func", "button_class": "btn-outline-secondary", "icon_name": "pencil-alt"},
                    {"name": "load", "func": "load_func", "button_class": "btn-outline-secondary", "icon_name": "arrow-from-bottom"},
                    {"name": "unload", "func": "unload_func", "button_class": "btn-outline-secondary", "icon_name": "ban"}]
            },
            {buttons: [
                    {"name": "duplicate", "func": "duplicate_func", "button_class": "btn-outline-secondary", "icon_name": "copy"},
                    {"name": "rename", "func": "rename_func", "button_class": "btn-outline-secondary", "icon_name": "edit"}]
            },
            {buttons: [
                    {"name": "share", "func": "send_repository_func", "button_class": "btn-outline-secondary", "icon_name": "share"}]
            },
            {buttons: [
                    {"name": "delete", "func": "delete_func", "button_class": "btn-outline-secondary", "icon_name": "trash"}]
            },
            {"buttons": [{"name": "refresh", "func": "refresh_func", "button_class": "btn-outline-secondary", "icon_name": "sync-alt"}]}
        ]
    }

    update_aux_content() {
        this.tag_button_list.create_tag_buttons(this.update_tag_view);
        this.get_aux_right_dom().css("display", "inline-block");
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
        postWithCallbackNoMain("host", "load_tile_module_task", {"tile_module_name": res_name, "user_id": user_id}, doFlash)

       // $.getJSON(`${$SCRIPT_ROOT}/load_tile_module/${res_name}`, doFlash)
    }
    unload_func (event) {
        const manager = event.data.manager;
        const res_name = manager.check_for_selection("resource");
        if (res_name == "") return;
        $.getJSON(`${$SCRIPT_ROOT}/unload_all_tiles`, doFlash)
    }

    add_tile_module (event) {
        const form_data = new FormData(this);
        let manager = event.data.manager;
        postAjaxUploadPromise("add_tile_module", form_data)
            .then((data) => {
                    manager.insert_new_row(data.new_row, 0);
                    manager.select_first_row();
                    resource_managers["all_module"].insert_new_row(data.new_all_row, 0)
            })
            .catch(doFlash);
        event.preventDefault();
    }

    new_in_creator (event, template_name, select_all = false) {
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
                .then((data) => {
                    manager.insert_new_row(data.new_row, 0);

                    resource_managers["all_module"].insert_new_row(data.new_all_row, 0);
                    if (select_all) {
                        resource_managers["all_module"].select_first_row()
                    }
                    else {
                        manager.select_first_row();
                    }
                    window.open($SCRIPT_ROOT + manager.creator_view + String(new_name))
                })
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
                .then((data) => {
                    manager.insert_new_row(data.new_row, 0);
                    manager.select_first_row();
                    resource_managers["all_module"].insert_new_row(data.new_all_row, 0);
                    window.open($SCRIPT_ROOT + manager.view_view + String(new_name))
                })
                .catch(doFlash)
            }
        event.preventDefault();
    }
}

class RepositoryTileManager extends LibraryResourceManager {
    constructor (resource_module_template) {
        super ("repository_tile_module", "tile", resource_module_template, "#tile-module-outer", "repo")
    }
    set_extra_properties() {
        super.set_extra_properties();
        this.is_repository = true;
        this.start_hidden = true;
        this.update_view = "request_update_repository_selector_list";
        this.update_tag_view = "request_update_repository_tag_list";
        this.view_view = '/repository_view_module/';
        this.double_click_func = "view_func";
        this.button_groups = [
            {"buttons": [{"name": "view", "func": "view_func", "button_class": "btn-outline-secondary", "icon_name": "book-open"},
                    {"name": "copy", "func": "repository_copy_func", "button_class": "btn-outline-secondary", "icon_name": "share"}]
            }
        ]
    };
}

class CodeManager extends LibraryResourceManager {
    constructor (resource_module_template) {
        super ("code_module", "code", resource_module_template, "#code-module-outer", "notrepo")
    }
    set_extra_properties() {
        super.set_extra_properties();
        this.start_hidden = false;
        this.allow_search_inside = true;
        this.allow_metadata_search = true;
        this.search_inside_view = "search_inside_code";
        this.search_metadata_view = "search_code_metadata";
        this.update_view = "request_update_selector_list";
        this.update_tag_view = "request_update_tag_list";
        this.new_view = '/create_code';
        this.view_view = '/view_code/';
        this.delete_view = "/delete_code";
        this.duplicate_view = '/create_duplicate_code';
        this.double_click_func = "view_func";
        this.refresh_task = 'update_code_selector_list';
        this.popup_buttons = [{
            "name": "new",
            "button_class": "btn-outline-secondary",
            "icon_name": "plus-circle",
            "option_list": [{"opt_name": "BasicCodeTemplate", "opt_func": "new_code"}]
        }];
        this.file_adders = [
            // {"name": "add_code", "func": "add_code", "button_class": "btn-outline-secondary", show_multiple: false}
        ];
        this.button_groups = [
            {buttons: [
                    {"name": "edit", "func": "view_func", "button_class": "btn-outline-secondary", "icon_name": "pencil"}]
            },
            {buttons: [
                    {"name": "duplicate", "func": "duplicate_func", "button_class": "btn-outline-secondary", "icon_name": "copy"},
                    {"name": "rename", "func": "rename_func", "button_class": "btn-outline-secondary", "icon_name": "edit"}]
            },
            {buttons: [
                    {"name": "share", "func": "send_repository_func", "button_class": "btn-outline-secondary", "icon_name": "share"}]
            },
            {buttons: [
                    {"name": "delete", "func": "delete_func", "button_class": "btn-outline-secondary", "icon_name": "trash"}]
            },
            {"buttons": [{"name": "refresh", "func": "refresh_func", "button_class": "btn-outline-secondary", "icon_name": "sync-alt"}]}
        ];
    }

    new_code (event, select_all = false) {
        const template_name = "BasicCodeTemplate";
        $.getJSON(`${$SCRIPT_ROOT}/get_resource_names/code`, function (data) {
                showModal("New Code Resource", "New Code Resource Name", CreateNewCodeResource, "NewCodeResource", data["resource_names"])
            }
        );
        const manager = event.data.manager;
        function CreateNewCodeResource(new_name) {
            const result_dict = {
                "template_name": template_name,
                "new_res_name": new_name
            };
            postAjaxPromise("/create_code", result_dict)
                .then((data) => {
                    manager.insert_new_row(data.new_row, 0);
                    resource_managers["all_module"].insert_new_row(data.new_all_row, 0);
                    if (select_all) {
                        resource_managers["all_module"].select_first_row()
                    }
                    else {
                        manager.select_first_row();
                    }
                    window.open($SCRIPT_ROOT + "/view_code/" + String(new_name))
                })
                .catch(doFlash)
        }
        event.preventDefault();
    }
}

class RepositoryCodeManager extends LibraryResourceManager {
    constructor (resource_module_template) {
        super ("repository_code_module", "code", resource_module_template, "#code-module-outer", "repo")
    }
    set_extra_properties() {
        super.set_extra_properties();
        this.is_repository = true;
        this.start_hidden = true;
        this.update_view = "request_update_repository_selector_list";
        this.update_tag_view = "request_update_repository_tag_list";
        this.view_view = '/repository_view_code/';
        this.double_click_func = "view_func";
        this.button_groups = [
            {"buttons": [{"name": "view", "func": "view_func", "button_class": "btn-outline-secondary", "icon_name": "book-open"},
                {"name": "copy", "func": "repository_copy_func", "button_class": "btn-outline-secondary", "icon_name": "share"}]
            }
        ]
    };
}

class AllManager extends LibraryResourceManager {
    constructor (resource_module_template, is_repo=false) {
        if (is_repo){
            super ("repository_all_module", "all", resource_module_template, "#all-module-outer", "repo")
        }
        else {
            super ("all_module", "all", resource_module_template, "#all-module-outer", "notrepo")
        }
    }
    set_extra_properties() {
        super.set_extra_properties();
        this.start_hidden = false;
        this.update_view = "request_update_selector_list";
        this.update_tag_view = "request_update_tag_list";
        this.double_click_func = "dc_view_func";
        this.refresh_task = 'update_all_selector_list';
        this.popup_buttons = [{
            "name": "new",
            "button_class": "btn-outline-secondary",
            "icon_name": "plus-circle",
            "option_list": [
                {"opt_name": "StandardTile", "opt_func": "new_basic_in_creator"},
                {"opt_name": "MatplotlibTile", "opt_func": "new_mpl_in_creator"},
                {"opt_name": "D3Tile", "opt_func": "new_d3_in_creator"},
                {"opt_name": "NewCode", "opt_func": "new_code"}]
        }];
        this.file_adders = [
            // {"name": "import_as_table", "func": "import_as_table", "button_class": "btn-outline-secondary", show_multiple: true},
            // {"name": "import_as_freeform", "func": "import_as_freeform", "button_class": "btn-outline-secondary", show_multiple: true},
            // {"name": "add_module", "func": "add_tile_module", "button_class": "btn-outline-secondary", "show_multiple": false},
            // {"name": "add_list", "func": "add_list", "button_class": "btn-outline-secondary", "show_multiple": false},
            // {"name": "add_code", "func": "add_code", "button_class": "btn-outline-secondary", show_multiple: false}
        ];
        this.button_groups = [
            {
                buttons: [
                    {"name": "open", "func": "view_func", "button_class": "btn-outline-secondary", "icon_name": "book-open", "applicable_types": res_types},
                    {
                        "name": "creator",
                        "func": "creator_view_func",
                        "button_class": "btn-outline-secondary",
                        "icon_name": "pencil-alt",
                        "applicable_types": ["tile"]
                    },
                    {"name": "load", "func": "load_func", "button_class": "btn-outline-secondary", "icon_name": "arrow-from-bottom", "applicable_types": ["tile"]},
                    {
                        "name": "unload",
                        "func": "unload_func",
                        "button_class": "btn-outline-secondary",
                        "icon_name": "ban",
                        "applicable_types": ["tile"]
                    }]
            },
            {
                buttons: [
                    {
                        "name": "duplicate",
                        "func": "duplicate_func",
                        "button_class": "btn-outline-secondary", "icon_name": "copy",
                        "applicable_types": ["list", "collection", "tile", "code"]
                    },
                    {
                        "name": "rename",
                        "func": "rename_func",
                        "button_class": "btn-outline-secondary", "icon_name": "edit",
                        "applicable_types": res_types
                    }]
            },
            {
                buttons: [
                    {
                        "name": "share",
                        "func": "send_repository_func",
                        "button_class": "btn-outline-secondary", "icon_name": "share",
                        "applicable_types": res_types
                    },
                    {
                        "name": "combine",
                        "func": "combineCollections",
                        "button_class": "btn-outline-secondary", "icon_name": "plus-square",
                        "applicable_types": ["collection"]
                    },
                    {
                        "name": "download",
                        "func": "downloadCollection",
                        "button_class": "btn btn-outline-secondary", "icon_name": "download",
                        "applicable_types": ["collection"]
                    }]
            },
            {
                buttons: [
                    {
                        "name": "delete",
                        "func": "delete_func",
                        "button_class": "btn-outline-secondary", "icon_name": "trash",
                        "applicable_types": res_types
                    }]
            },
            {
                buttons: [
                    {
                        "name": "refresh",
                        "func": "refresh_func",
                        "button_class": "btn-outline-secondary", "icon_name": "sync-alt",
                        "applicable_types": res_types
                    }]
            }
        ];
    }

    new_basic_in_creator(event) {
        event.data.manager = resource_managers["tile_module"];
        resource_managers["tile_module"].new_in_creator(event, "BasicTileTemplate", true);
        event.preventDefault();
    }

    new_mpl_in_creator(event) {
        event.data.manager = resource_managers["tile_module"];
        resource_managers["tile_module"].new_in_creator(event, "MatplotlibTileTemplate", true)
    }

    new_d3_in_creator(event) {
        event.data.manager = resource_managers["tile_module"];
        resource_managers["tile_module"].new_in_creator(event, "D3TileTemplate", true)
    }

    new_code(event) {
        event.data.manager = resource_managers["code_module"];
        resource_managers["code_module"].new_code(event, true);
    }

    selected_resource_type() {
        return $(this.get_active_selector_button()[0]).find("td")[1].getAttribute("sorttable_customkey")
    }

    selected_resource_type_from_row_element(row_element) {
        return $(row_element).children()[1].getAttribute("sorttable_customkey")
    }

    res_manager(res_type) {
        return resource_managers[`${res_type}_module`]
    }

    view_func(event) {
        const manager = event.data.manager;
        const res_name = manager.check_for_selection();
        if (res_name == "") return;
        const res_type = manager.selected_resource_type();
        window.open($SCRIPT_ROOT + manager.res_manager(res_type).view_view + String(res_name))
    }

    dc_view_func(event) {
        const manager = event.data.manager;
        const res_name = manager.check_for_selection();
        if (res_name == "") return;
        const res_type = manager.selected_resource_type();
        if (res_type == "tile") {
            window.open($SCRIPT_ROOT + manager.res_manager(res_type).last_saved_view + String(res_name))
        }
        else {
            window.open($SCRIPT_ROOT + manager.res_manager(res_type).view_view + String(res_name))
        }
    }

    duplicate_func(event) {
        const manager = event.data.manager;
        const res_name = manager.check_for_selection();
        if (res_name == "") return;
        const res_type = manager.selected_resource_type();
        $.getJSON($SCRIPT_ROOT + "get_resource_names/" + res_type, function (data) {
                showModal(`Duplicate ${res_type}`, "New Name", DuplicateResource, res_name, data["resource_names"])
            }
        );
        function DuplicateResource(new_name) {
            const result_dict = {
                "new_res_name": new_name,
                "res_to_copy": res_name
            };
            postAjaxPromise(manager.res_manager(res_type).duplicate_view, result_dict)
                .then((data) => {
                    manager.res_manager(res_type).insert_new_row(data.new_row, 0);
                    manager.insert_new_row(data.new_all_row, 0);
                    manager.select_first_row();
                })
                .catch(doFlash)
        }
    }

    rename_func(event) {
        const manager = event.data.manager;
        const res_name = manager.check_for_selection("resource");
        if (res_name == "") return;
        const the_type = manager.selected_resource_type();
        $.getJSON($SCRIPT_ROOT + "get_resource_names/" + the_type, function (data) {
                const res_names = data["resource_names"];
                const index = res_names.indexOf(res_name);
                if (index >= 0) {
                    res_names.splice(index, 1);
                }
                showModal(`Rename ${the_type}`, "New Name", RenameResource, res_name, res_names)
            }
        );
        function RenameResource(new_name) {
            const the_data = {"new_name": new_name};
            postAjax(`rename_resource/${the_type}/${res_name}`, the_data, renameSuccess);
            function renameSuccess(data) {
                if (!data.success) {
                    doFlash(data);
                    return false
                }
                else {
                    manager.get_selector_table_row(res_name, the_type).children()[0].innerHTML = new_name;
                    manager.get_selector_table_row(res_name, the_type).attr("value", new_name);
                    manager.res_manager(the_type).get_selector_table_row(res_name).children()[0].innerHTML = new_name;
                    manager.res_manager(the_type).get_selector_table_row(res_name).attr("value", new_name)
                }

            }
        }
    }

    downloadCollection(event) {
        const manager = event.data.manager;
        const res_name = manager.check_for_selection("resource");
        if (res_name == "") return;
        const the_type = manager.selected_resource_type();
        if (!(the_type == "collection")) return;
        showModal("Download Collection as Excel Notebook", "New File Name", function (new_name) {
            window.open(`${$SCRIPT_ROOT}/download_collection/` + res_name + "/" + new_name)
        }, res_name + ".xlsx")
    };

    combineCollections(event) {
        const manager = event.data.manager;
        const res_name = manager.check_for_selection("resource");
        if (res_name == "") return;
        const the_type = manager.selected_resource_type();
        if (!(the_type == "collection")) return;
        showModal("Name of collection to combine with " + res_name, "collection Name", function (other_name) {
            startSpinner();
            const target = `${$SCRIPT_ROOT}/combine_collections/${res_name}/${other_name}`;
            $.post(target, doFlashStopSpinner);
        })
    }

    creator_view_func(event) {
        const manager = event.data.manager;
        const res_name = manager.check_for_selection("resource");
        if (res_name == "") return;
        const the_type = manager.selected_resource_type();
        if (!(the_type == "tile")) return;
        window.open($SCRIPT_ROOT + manager.res_manager("tile").creator_view + String(res_name))
    }

    load_func(event) {
        const manager = event.data.manager;
        const res_name = manager.check_for_selection("resource");
        if (res_name == "") return;
        const the_type = manager.selected_resource_type();
        if (!(the_type == "tile")) return;
        postWithCallbackNoMain("host", "load_tile_module_task", {"tile_module_name": res_name, "user_id": user_id}, doFlash)
        // $.getJSON(`${$SCRIPT_ROOT}/load_tile_module/${res_name}`, doFlash);
    }

    unload_func(event) {
        const manager = event.data.manager;
        const res_name = manager.check_for_selection("resource");
        if (res_name == "") return;
        const the_type = manager.selected_resource_type();
        if (!(the_type == "tile")) return;
        $.getJSON(`${$SCRIPT_ROOT}/unload_all_tiles`, doFlash)
    }

    send_repository_func(event) {
        const manager = event.data.manager;
        const res_name = manager.check_for_selection("resource");
        if (res_name == "") {
            doFlash({"message": `Select a ${manager.res_type} first.`, "alert_type": "alert-info"})
        }
        const the_type = manager.selected_resource_type();
        $.getJSON($SCRIPT_ROOT + "get_repository_resource_names/" + the_type, function (data) {
                showModal(`Share ${the_type}`, `New ${the_type} Name`, ShareResource, res_name, data["resource_names"])
            }
        );
        function ShareResource(new_name) {
            const result_dict = {
                "res_type": the_type,
                "res_name": res_name,
                "new_res_name": new_name
            };
            postAjaxPromise(manager.send_repository_view, result_dict)
                .then(doFlash)
                .catch(doFlash);
        }

        return res_name
    }

    delete_func(event) {
        const manager = event.data.manager;
        const res_name = manager.check_for_selection("resource");
        if (res_name == "") return;
        const confirm_text = `Are you sure that you want to delete ${res_name}?`;
        const the_type = manager.selected_resource_type();
        confirmDialog(`Delete ${the_type}`, confirm_text, "do nothing", "delete", function () {
            postAjaxPromise(manager.res_manager(the_type).delete_view, {"resource_name": res_name})
                .then(() => {
                    let active_row = manager.get_active_selector_button("resource");
                    active_row.fadeOut("slow", function () {
                        active_row.remove();
                        manager.select_first_row()
                    });
                    let specific_manager_row = manager.res_manager(the_type).get_selector_table_row(res_name);
                    specific_manager_row.fadeOut("slow", function () {
                        specific_manager_row.remove()
                    });
                })
        })
    }

    set_button_activations(the_type) {
        for (let group of this.button_groups) {
            for (let but of group.buttons) {
                if (but.applicable_types.includes(the_type)) {
                    $(`button[value=${but.name}-all]`).css("display", "flex")
                }
                else {
                    $(`button[value=${but.name}-all]`).css("display", "none")
                }
            }
        }
    }

    selector_click(row_element, custom_got_metadata) {
        if (!this.handling_selector_click) {  // We want to make sure we are not already processing a click
            this.handling_selector_click = true;
            const res_name = row_element.getAttribute("value");
            const the_type = this.selected_resource_type_from_row_element(row_element);
            this.set_button_activations(the_type);
            const result_dict = {"res_type": the_type, "res_name": res_name, "is_repository": this.is_repository};
            this.get_all_selector_buttons().removeClass("active");
            const self = this;
            var got_metadata;
            if (custom_got_metadata == undefined) {
                got_metadata = default_got_metadata
            }
            else {
                got_metadata = custom_got_metadata
            }
            if (this.include_metadata) {
                postAjaxPromise("grab_metadata", result_dict)
                    .then(got_metadata)
                    .catch(got_metadata)
            }

            $(row_element).addClass("active");

            function default_got_metadata(data) {
                if (data.success) {
                    self.set_resource_metadata(res_name, data.datestring, data.tags, data.notes, data.additional_mdata);
                }
                else {
                    // doFlash(data)
                    self.clear_resource_metadata()
                }
                self.handling_selector_click = false;
            }
        }
    }

    update_selector_tags(res_name, res_type, new_tags) {
        let row_to_change = this.get_selector_table_row(res_name, res_type);
        row_to_change.children().slice(-1)[0].innerHTML = new_tags;
        // if (row_to_change.hasClass("active")) {
        //     this.set_tag_list(new_tags)
        // }
    }

    get_selector_table_row(name, res_type) {
        const possible_rows = this.get_module_element(`tr[value='${name}']`);
        let self = this;
        let result = null;
        let row_element;
        for (let i = 0; row_element = possible_rows[i]; ++i) {
            const cells = $(row_element).children();
            self.get_module_element(`tr[value='${name}']`);
            let the_type = cells[1].getAttribute("sorttable_customkey");
            if (the_type == res_type) {
                result = $(row_element)
            }
        }
        return result
    }

    save_my_metadata(flash = false) {
        const res_name = this.get_active_selector_button().attr("value");
        const tags = this.get_tags_string();
        const notes = this.markdown_helper.getNotesValue(this.get_module_dom());
        const the_type = this.selected_resource_type();
        const result_dict = {
            "res_type": the_type, "res_name": res_name,
            "tags": tags, "notes": notes, "module_id": `${the_type}_module`
        };
        const self = this;
        postAjaxPromise("save_metadata", result_dict)
            .then(function (data) {
                self.get_selector_table_row(res_name, the_type).children().slice(-1)[0].innerHTML = tags;
                self.tag_button_list.refresh_given_taglist(data.all_tags);
                self.res_manager(the_type).update_selector_tags(res_name, tags);
                self.res_manager(the_type).tag_button_list.refresh_given_taglist(data.res_tags);
                self.markdown_helper.convertMarkdown(self.get_module_dom());
                if (flash) {
                    doFlash(data)
                }
            })
            .catch(doFlash)
    }

    //
    delete_tag(tag) {
        const confirm_text = `Are you sure that you want to the tag ${tag} for all resource types?`;
        let self = this;
        confirmDialog(`Delete tag`, confirm_text, "do nothing", "delete", function () {
            for (let res_type of res_types) {
                resource_managers[`${res_type}_module`].DoTagDelete(tag)
            }
        })
    }

    rename_tag(old_tag) {
        let self = this;
        showModal(`Rename tag ${old_tag}`, `New name for this tag for all resource types`, RenameTag, old_tag);

        function RenameTag(new_tag) {
            for (let res_type of res_types) {
                resource_managers[`${res_type}_module`].DoTagRename(old_tag, new_tag)
            }
        }
    }

    remove_tag_from_all_rows(tag, res_type) {
        const all_rows = this.get_all_selector_buttons();
        $.each(all_rows, function (index, row_element) {
            const cells = $(row_element).children();
            let the_type = cells[1].innerHTML;
            if ((res_type == "all") || (the_type == res_type)) {
                const tag_text = $(cells.slice(-1)[0]).text().toLowerCase();
                if (tag_text != "") {
                    const taglist = tag_text.split(" ");
                    if (taglist.includes(tag)) {
                        let tag_index = taglist.indexOf(tag);
                        taglist.splice(tag_index, 1);
                        let newtags;
                        if (taglist.empty()) {
                            newtags = ""
                        }
                        else {
                            newtags = taglist[0];
                            for (let ptag of taglist.slice(1)) {
                                newtags = newtags + " " + ptag
                            }
                        }
                        cells.slice(-1)[0].innerHTML = newtags
                    }
                }
            }

        });
        if ((res_type == "all") || (this.selected_resource_type() == res_type)) {
            this.tageditor_onchange_enabled = false;
            this.get_tags_field().tagEditor('removeTag', tag, true);
            this.tageditor_onchange_enabled = true;
        }
    }

    rename_tag_in_all_rows(old_tag, new_tag, res_type) {
        const all_rows = this.get_all_selector_buttons();
        $.each(all_rows, function (index, row_element) {
            const cells = $(row_element).children();
            let the_type = cells[1].innerHTML;
            if ((res_type == "all") || (the_type == res_type)) {
                const tag_text = $(cells.slice(-1)[0]).text().toLowerCase();
                if (tag_text != "") {
                    const taglist = tag_text.split(" ");
                    if (taglist.includes(old_tag)) {
                        let tag_index = taglist.indexOf(old_tag);
                        if (taglist.includes(new_tag)) {
                            taglist.splice(tag_index, 1);
                        }
                        else {
                            taglist[tag_index] = new_tag
                        }
                        let newtags;
                        newtags = taglist[0];
                        for (let ptag of taglist.slice(1)) {
                            newtags = newtags + " " + ptag
                        }
                        cells.slice(-1)[0].innerHTML = newtags
                    }
                }
            }
        });
        if ((res_type == "all") || (this.selected_resource_type() == res_type)) {
            if (this.get_tags().includes(old_tag)) {
                this.tageditor_onchange_enabled = false;
                this.get_tags_field().tagEditor('removeTag', old_tag, false);
                if (!this.get_tags().includes(new_tag)) {
                    this.get_tags_field().tagEditor('addTag', new_tag, false)
                }
                this.tageditor_onchange_enabled = false;
            }
        }
    }
}

class RepositoryAllManager extends AllManager {
    constructor (resource_module_template) {
        super (resource_module_template, true)
    }
    set_extra_properties() {
        super.set_extra_properties();
        this.is_repository = true;
        this.start_hidden = true;
        this.update_view = "request_update_repository_selector_list";
        this.update_tag_view = "request_update_repository_tag_list";
        this.double_click_func = "view_func";
        this.popup_buttons = [];
        this.button_groups = [
            {
                "buttons": [
                    {"name": "view", "func": "view_func", "button_class": "btn-outline-secondary", "icon_name": "book-open", "applicable_types": res_types},
                    {"name": "copy", "func": "repository_copy_func", "button_class": "btn-outline-secondary", "icon_name": "share", "applicable_types": ["tile", "code", "list"]}
                ]
            }
        ]
    }
    repository_res_manager(res_type) {
        return resource_managers[`repository_${res_type}_module`]
    }
    view_func (event) {
        const manager = event.data.manager;
        const res_name = manager.check_for_selection();
        if (res_name == "") return;
        const res_type = manager.selected_resource_type();
        window.open($SCRIPT_ROOT + manager.repository_res_manager(res_type).view_view + String(res_name))
    }
    repository_copy_func (event) {
        const manager = event.data.manager;
        const res_name = manager.check_for_selection();
        if (res_name == "") {
            doFlash({"message": `Select a ${manager.res_type} first.`, "alert_type": "alert-info"})
        }
        const res_type = manager.selected_resource_type();

        $.getJSON($SCRIPT_ROOT + "get_resource_names/" + res_type, function (data) {
                showModal("Import " + res_type, "New Name", ImportResource, res_name, data["resource_names"])
            }
        );
        function ImportResource(new_name) {
            const result_dict = {
                "res_type": res_type,
                "res_name": res_name,
                "new_res_name": new_name
            };
            postAjaxPromise(manager.repository_res_manager(res_type).repository_copy_view, result_dict)
                .then(doFlash)
                .catch(doFlash);
        }
        return res_name
    }
}
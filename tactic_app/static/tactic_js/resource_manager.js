/**
 * Created by bls910 on 11/1/15.
 */

function get_current_res_type() {
    const module_id_str = $(".nav-tabs .active a").attr("href");
    const reg_exp = /\#(\S*)?\-/;
    return module_id_str.match(reg_exp)[1]
}

function current_manager_kind() {
    if (repository_visible) {
        return "repository"
    }
    else {
        return "resource"
    }
}

class ResourceManager {
    constructor (res_type, specifics) {
        this.res_type = res_type;
        this.file_adders = [];
        this.show_multiple = false;
        this.repository_copy_view = '/copy_from_repository';
        this.send_repository_view = '/send_to_repository';
        this.show_loaded_list = false;
        this.popup_buttons = [];
        this.repository_buttons = [];
        Object.assign(this, specifics);
        this.textify_button_names();
    }

    add_listeners() {
        for (let bgroup of this.button_groups) {
            for (let value of bgroup.buttons) {
                this.bind_button(value, "resource");
            }
        }
        self = this;
        $.each(this.repository_buttons, function (index, value) {
            self.bind_button(value, "repository")
        });
        $.each(this.file_adders, function(index, value) {
            self.bind_form(value, "resource")
            }
        );
        self.bind_button({"name": "repository-copy", "func": "repository_copy_func"}, "repository");

        $.each(self.popup_buttons, function (index, value) {
            $.each(value.option_list, function (index, opt) {
                self.bind_option({"name": opt.opt_name, "func": opt.opt_func}, "resource")
            })
        });
    }

   add_func(event) {
        const manager = event.data.manager;
        form_data = new FormData(this);
        postAjaxUploadPromise(manager.add_view, form_data)
            .then(doNothing)
            .catch(doFlash);
        event.preventDefault();
    }

    load_func (event) {
        const manager = event.data.manager;
        const res_name = manager.check_for_selection("resource");
        if (res_name == "") return;
        window.open($SCRIPT_ROOT + manager.load_view + String(res_name))
    }

    view_func (event) {
        const manager = event.data.manager;
        const res_name = manager.check_for_selection("resource");
        if (res_name == "") return;
        window.open($SCRIPT_ROOT + manager.view_view + String(res_name))
    }

    duplicate_func (event) {
        const manager = event.data.manager;
        const res_name = manager.check_for_selection("resource");
        const the_type = manager.res_type;
        if (res_name == "") return;
        $.getJSON($SCRIPT_ROOT + "get_resource_names/" + the_type, function(data) {
                showModal(`Duplicate ${manager.res_type}`, "New Tile Name", DuplicateResource, res_name, data["resource_names"])
            }
        );
        function DuplicateResource(new_name) {
            const result_dict = {
                "new_res_name": new_name,
                "res_to_copy": res_name
            };
            postAjaxPromise(manager.duplicate_view, result_dict)
                .then(() => {;})
                .catch(doFlash)
        }
    }

    delete_func (event) {
        const manager = event.data.manager;
        const res_name = manager.check_for_selection("resource");
        if (res_name == "") return;
        const confirm_text = `Are you sure that you want to delete ${res_name}?`;
        confirmDialog(`Delete ${manager.res_type}`, confirm_text, "do nothing", "delete", function () {
            manager.get_active_selector_button("resource").fadeOut();
            manager.get_tags_field("resource").html("");
            manager.get_notes_field("resource").html("");
            $.post($SCRIPT_ROOT + manager.delete_view + String(res_name))
        })
    }

    send_repository_func (event) {
        const manager = event.data.manager;
        const res_name = manager.check_for_selection("resource");
        if (res_name == "") {
            doFlash({"message": `Select a ${manager.res_type} first.`, "alert_type": "alert-info"})
        }
        $.getJSON($SCRIPT_ROOT + "get_repository_resource_names/" + manager.res_type, function(data) {
            showModal(`Share ${manager.res_type}`, `New ${manager.res_type} Name`, ShareResource, res_name, data["resource_names"])
            }
        );
        function ShareResource(new_name) {
            const result_dict = {
                "res_type": manager.res_type,
                "res_name": res_name,
                "new_res_name": new_name
            };
            postAjaxPromise(manager.send_repository_view, result_dict)
                .then(doFlash)
                .catch(doFlash);
        }
        return res_name
    }

    repository_view_func (event) {
        const manager = event.data.manager;
        const res_name = manager.check_for_selection("repository");
        if (res_name == "") return;
        window.open($SCRIPT_ROOT + manager.repository_view_view + String(res_name))
    }

    repository_copy_func (event) {
        const manager = event.data.manager;
        const res_name = manager.check_for_selection("repository");
        if (res_name == "") {
            doFlash({"message": `Select a ${manager.res_type} first.`, "alert_type": "alert-info"})
        }
        $.getJSON($SCRIPT_ROOT + "get_resource_names/" + manager.res_type, function(data) {
            showModal("Import " + manager.res_type, "New Name", ImportResource, res_name, data["resource_names"])
            }
        );
        function ImportResource(new_name) {
            const result_dict = {
                "res_type": manager.res_type,
                "res_name": res_name,
                "new_res_name": new_name
            };
            postAjaxPromise(manager.repository_copy_view, result_dict)
                .then(doFlash)
                .catch(doFlash);
        }
        return res_name
    }

    // Functions to access the various parts of a resource manager dom

    bind_button (value, manager_kind) {
        const button_value = value.name + "-" + this.res_type;
        const bselector = `button[value='${button_value}']`;
        get_manager_outer(this.res_type, manager_kind).on("click", bselector, {"manager": this}, this[value.func])
    }

    bind_option (value, manager_kind) {
        const button_value = value.name + "-" + this.res_type;
        const bselector = `a[value='${button_value}']`;
        get_manager_outer(this.res_type, manager_kind).on("click", bselector, {"manager": this}, this[value.func])
    }

    bind_form (value, manager_kind) {
        const form_value = value.name + "-" + this.res_type + "-form";
        const fselector = `form[value='${form_value}']`;
        get_manager_outer(this.res_type, manager_kind).on("submit", fselector, {"manager": this}, this[value.func])
    }


    get_resource_selector_dom (manager_kind) {
        return get_manager_dom(this.res_type, manager_kind, ".resource-selector")
    }

    get_resource_selector_row (manager_kind) {
        return get_manager_dom(this.res_type, manager_kind, ".selector-row ")
    }

    get_resource_table (manager_kind) {
        return get_manager_dom(this.res_type, manager_kind, ".resource-selector table")
    }

    get_button(manager_kind, name) { // not currently used
        const button_value = name + "-" + this.res_type;
        return get_manager_dom(this.res_type, manager_kind, `button[value='${button_value}']`)
    }

    get_form(manager_kind, name){ // not currently used
        const form_value = name + "-" + this.res_type + "-form";
        return get_manager_dom(this.res_type, manager_kind, `form[value='${form_value}']`)
    }

    get_created_field(manager_kind) {
        return get_manager_dom(this.res_type, manager_kind, ".created");
    }

    get_notes_field(manager_kind) {
        return get_manager_dom(this.res_type, manager_kind, ".notes-field")
    }

    get_tags_field(manager_kind) {
         return get_manager_dom(this.res_type, manager_kind, ".tags-field")
    }

    get_search_field(manager_kind) {
        return get_manager_dom(this.res_type, manager_kind, ".search-field")
    }

    get_active_selector_button(manager_kind) {
        return get_manager_dom(this.res_type, manager_kind, ".selector-button.active");
    }

    get_all_selector_buttons(manager_kind) {
        return get_manager_dom(this.res_type, manager_kind, ".selector-button")
    }

    get_named_selector_button(manager_kind, name) {
        return get_manager_dom(this.res_type, manager_kind, `.selector-button[value='${name}']`)
    }

    get_all_tag_buttons (manager_kind) {
        return get_manager_dom(this.res_type, manager_kind, ".tag-button-list button")
    }

    get_tag_button_dom (manager_kind) {
        return get_manager_dom(this.res_type, manager_kind, ".tag-button-list")
    }

    // a couple of utility functions

    textify_button_names () {
        let but;
        let i;
        let but_text;
        this.button_groups.forEach(function(bgroup) {
              for (i=0; i < bgroup.buttons.length; ++i) {
                  but = bgroup.buttons[i];
                  but_text = but["name"].replace(/_/g, ' ');
                  bgroup.buttons[i]["name_text"] = but_text
              }
        });
      for (i=0; i < this.popup_buttons.length; ++i) {
          but = this.popup_buttons[i];
          but_text = but["name"].replace(/_/g, ' ');
          this.popup_buttons[i]["name_text"] = but_text
      }
      for (i=0; i < this.repository_buttons.length; ++i) {
          but = this.repository_buttons[i];
          but_text = but["name"].replace(/_/g, ' ');
          this.repository_buttons[i]["name_text"] = but_text
      }
      for (i=0; i < this.file_adders.length; ++i) {
          but = this.file_adders[i];
          but_text = but["name"].replace(/_/g, ' ');
          this.file_adders[i]["name_text"] = but_text
      }
    }

    check_for_selection (manager_kind) {
        //var res_name = $('#' + res_type + '-selector > .btn.active').text().trim();
        const res_name = this.get_active_selector_button(manager_kind).attr("value");
        if (res_name == "") {
            doFlash({"message": `Select a ${manager.res_type} first.`, "alert_type": "alert-info"})
        }
        return res_name
    }

    create_module_html () {
        this.prefix = "resource";
        this.is_repository = false;
        this.is_not_repository = true;
        let res = Mustache.to_html(resource_module_template, this);
        this.prefix = "repository";
        this.is_repository = true;
        this.is_not_repository = false;
        const repos_res = Mustache.to_html(resource_module_template, this);
        res = res + repos_res;
        $("#" + this.res_type + "-module").html(res);
    }

    select_resource_button(manager_kind, res_name) {
        if (res_name == null) {
            const all_selectors = this.get_all_selector_buttons(manager_kind);
            if (all_selectors.length > 0) {
                selector_click({"target": all_selectors[0]});
            }
            else {
                this.clear_resource_metadata(manager_kind)
            }
        }
        else {
            this.get_resource_selector_dom(manager_kind).scrollTop(this.get_named_selector_button(manager_kind, res_name).position().top);
            selector_click({"target": this.get_named_selector_button(manager_kind, res_name)[0]})
        }
    }

    // metadata related functions

   clear_resource_metadata(manager_kind) {
        this.set_resource_metadata(manager_kind, "", "", "")
    }

    set_resource_metadata(manager_kind, created, tags, notes) {
        this.get_created_field(manager_kind).html(created);
        this.get_tags_field(manager_kind).html("");
        this.get_tags_field(manager_kind)[0].value = tags;
        this.get_notes_field(manager_kind).html("");
        this.get_notes_field(manager_kind)[0].value = notes;
    }

    save_my_metadata () {
        const res_name = this.get_active_selector_button("resource").attr("value");
        const tags = this.get_tags_field("resource").val();
        const notes = this.get_notes_field("resource").val();
        const result_dict = {"res_type": this.res_type, "res_name": res_name, "tags": tags, "notes": notes};
        const self = this;
        postAjaxPromise("save_metadata", result_dict)
            .then(function(data) {
                self.get_active_selector_button("resource").children()[3].innerHTML = tags;
                doFlash(data)
            })
            .catch(doFlash)
    }


    // Search, tag button

    search_my_resource (manager_kind){
        this.deactivate_tag_buttons(manager_kind);
        const txt = this.get_search_field(manager_kind)[0].value.toLowerCase();
        const all_rows = this.get_all_selector_buttons(manager_kind);
        $.each(all_rows, function (index, row_element) {
            const cells = $(row_element).children();
            const res_name = row_element.getAttribute("value").toLowerCase();
            const tag_text = $(cells[3]).text().toLowerCase();
            if ((res_name.search(txt) == -1) && (tag_text.search(txt) == -1)) {
                $(row_element).hide()
            }
            else {
                $(row_element).show()
            }
        });
        this.show_hide_tag_buttons(manager_kind, txt)
    }

    search_given_tag (manager_kind, txt) {
        const all_rows = this.get_all_selector_buttons(manager_kind);
        this.deactivate_tag_buttons(manager_kind);
        $.each(all_rows, function (index, row_element) {
            const cells = $(row_element).children();
            const tag_text = $(cells[3]).text().toLowerCase();
            if (tag_text.search(txt) == -1) {
                $(row_element).hide()
            }
            else {
                $(row_element).show()
            }
        });
        this.set_tag_button_state(txt, manager_kind);
    }

    unfilter_me () {
        const manager_kind = current_manager_kind();
        const all_rows = this.get_all_selector_buttons(manager_kind);
        $.each(all_rows, function (index, row_element) {
                $(row_element).show()
        });
        this.deactivate_tag_buttons(manager_kind);
        this.show_all_tag_buttons(manager_kind)
    }

    set_tag_button_state (txt, manager_kind) {
        const all_tag_buttons = this.get_all_tag_buttons(manager_kind);
        $.each(all_tag_buttons, function (index, but) {
            if (but.innerHTML == txt) {
                $(but).addClass("active")
            }
            else {
                $(but).removeClass("active")
            }
        })
    }

    show_hide_tag_buttons (manager_kind, txt) {
        const all_tag_buttons = this.get_all_tag_buttons(manager_kind);
        $.each(all_tag_buttons, function (index, but) {
            const tag_text = but.innerHTML;
            if (tag_text.search(txt) == -1) {
                $(but).hide()
            }
            else {
                $(but).show()
            }
        })
    }

    show_all_tag_buttons (manager_kind) {
        const all_tag_buttons = this.get_all_tag_buttons(manager_kind);
        $.each(all_tag_buttons, function (index, but) {
                $(but).show()
        })
    }

    deactivate_tag_buttons (manager_kind) {
        const all_tag_buttons = this.get_all_tag_buttons(manager_kind);
        $.each(all_tag_buttons, function (index, but) {
            $(but).removeClass("active")
        })
    }
}

function selector_click(event) {
    const row_element = $(event.target).closest('tr');
    const res_name = row_element[0].getAttribute("value");
    const res_type = get_current_res_type();

    const result_dict = {"res_type": res_type, "res_name": res_name};
    let manager_kind;
    const manager = resource_managers[res_type];
    if (repository_visible) {
        manager_kind = "repository";
        manager.get_all_selector_buttons(manager_kind).removeClass("active");
        postAjaxPromise("grab_repository_metadata", result_dict)
            .then(got_metadata)
            .catch(got_metadata)
    }
    else {
        manager_kind = "resource";
        manager.get_all_selector_buttons(manager_kind).removeClass("active");
        postAjaxPromise("grab_metadata", result_dict)
            .then(got_metadata)
            .catch(got_metadata)
    }

    row_element.addClass("active");

    function got_metadata(data) {
        if (data.success) {
            manager.set_resource_metadata(manager_kind, data.datestring, data.tags, data.notes);
        }
        else {
            // doFlash(data)
            manager.clear_resource_metadata(manager_kind)
        }
    }
}

function selector_double_click(event) {
    const row_element = $(event.target).closest('tr');
    const res_type = get_current_res_type();
    const manager = resource_managers[res_type];
    const manager_kind = current_manager_kind();

    manager.get_all_selector_buttons(manager_kind).removeClass("active");
    row_element.addClass("active");
    if (repository_visible) {
        manager[manager.repository_double_click_func]({data: {manager: manager}})
    }
    else {
        manager[manager.double_click_func]({data: {manager: manager}})
    }

}

function search_resource(event){
    resource_managers[event.target.value].search_my_resource(current_manager_kind())
}

function search_resource_tags(event) {
    const res_type = event.target.value;
    const manager_kind = current_manager_kind();
    const manager = resource_managers[res_type];
    const txt = manager.get_search_field(manager_kind)[0].value.toLowerCase();
    manager.search_given_tag(manager_kind, txt);
    manager.show_hide_tag_buttons(manager_kind, txt)
}


function tag_button_clicked(event) {
    const res_type = event.target.value;
    const txt = event.target.innerHTML;
    resource_managers[res_type].search_given_tag(current_manager_kind(), txt)
}

function unfilter_resource(event) {
    const res_type = event.target.value;
    resource_managers[res_type].unfilter_me(current_manager_kind())
}

function save_metadata(event) {
    resource_managers[event.target.value].save_my_metadata();
}
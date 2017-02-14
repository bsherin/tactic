/**
 * Created by bls910 on 1/21/17.
 */

class UserManagerResourceManager extends ResourceManager{

    constructor (module_id, res_type, resource_module_template, destination_selector) {
        super(module_id, res_type, resource_module_template, destination_selector)
    }

    set_extra_properties() {
        this.include_metadata = true;
        this.include_search_toolbar = true;
        this.aux_left = true;
        this.repository_copy_view = '/copy_from_repository';
        this.send_repository_view = '/send_to_repository';
    }
    update_main_content() {
        const self = this;
        $.getJSON(`${$SCRIPT_ROOT}/${this.update_view}/${this.res_type}`, function (data) {
            self.fill_content(data.html, null);
            self.select_resource_button(null);
        })
    }

    fill_content(the_html) {
        this.get_main_content_dom().html(the_html);
        sorttable.makeSortable(this.get_resource_table()[0]);
        const updated_header = this.get_main_content_dom().find("table th")[2];
        sorttable.innerSortFunction.apply(updated_header, []);
        sorttable.innerSortFunction.apply(updated_header, []);
    }

    check_for_selection () {
        //var res_name = $('#' + res_type + '-selector > .btn.active').text().trim();
        const res_name = this.get_active_selector_button().attr("value");
        if (res_name == "") {
            doFlash({"message": `Select a ${this.res_type} first.`, "alert_type": "alert-info"})
        }
        return res_name
    }

    search_my_resource (){
        this.deactivate_tag_buttons();
        const txt = this.get_search_field()[0].value.toLowerCase();
        const all_rows = this.get_all_selector_buttons();
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
        this.show_hide_tag_buttons(txt)
    }

    unfilter_me () {
        const all_rows = this.get_all_selector_buttons();
        $.each(all_rows, function (index, row_element) {
                $(row_element).show()
        });
        this.deactivate_tag_buttons();
        this.show_all_tag_buttons();
    }

    update_aux_content() {
        this.create_tag_buttons(this.update_tag_view);
    }

    create_tag_buttons(url_string) {
        const self = this;
        $.getJSON(`${$SCRIPT_ROOT}/${url_string}/${this.res_type}`, function (data) {
            self.fill_tag_buttons(data.html, null);
        })
    }

    fill_tag_buttons(the_html) {
        this.get_aux_left_dom().append(the_html)
    }

    get_all_tag_buttons () {
        return this.get_module_element(".tag-button-list button")
    }

    search_given_tag (txt) {
        const all_rows = this.get_all_selector_buttons();
        this.deactivate_tag_buttons();
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
        this.set_tag_button_state(txt);
    }

    search_my_tags() {
        const txt = this.get_search_field()[0].value.toLowerCase();
        this.search_given_tag(txt);
        this.show_hide_tag_buttons(txt)
    }

    refresh_tag_buttons(the_html) {
        let active_tag_button = this.get_active_tag_button();
        manager.fill_tag_buttons(the_html);
        manager.set_tag_button_state(active_tag_button);
    }

    set_tag_button_state (txt) {
        const all_tag_buttons = this.get_all_tag_buttons();
        $.each(all_tag_buttons, function (index, but) {
            if (but.innerHTML == txt) {
                $(but).addClass("active")
            }
            else {
                $(but).removeClass("active")
            }
        })
    }

    get_active_tag_button () {
        let all_tag_buttons = this.get_all_tag_buttons();
        let active_tag_button = null;
        $.each(all_tag_buttons, (index, but) => {
            if ($(but).hasClass("active")) {
                active_tag_button = $(but).html()
            }
        });
        return active_tag_button
    }

    show_hide_tag_buttons (txt) {
        const all_tag_buttons = this.get_all_tag_buttons();
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

    show_all_tag_buttons () {
        const all_tag_buttons = this.get_all_tag_buttons();
        $.each(all_tag_buttons, function (index, but) {
                $(but).show()
        })
    }

    deactivate_tag_buttons () {
        const all_tag_buttons = this.get_all_tag_buttons();
        $.each(all_tag_buttons, function (index, but) {
            $(but).removeClass("active")
        })
    }

    add_func(event) {
        const manager = event.data.manager;
        const form_data = new FormData(this);
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
                showModal(`Duplicate ${manager.res_type}`, "New Name", DuplicateResource, res_name, data["resource_names"])
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

    rename_func (event) {
        const manager = event.data.manager;
        const res_name = manager.check_for_selection("resource");
        const the_type = manager.res_type;
        if (res_name == "") return;
        $.getJSON($SCRIPT_ROOT + "get_resource_names/" + the_type, function(data) {
                const res_names = data["resource_names"];
                const index = res_names.indexOf(res_name);
                if (index >= 0) {
                    res_names.splice(index, 1);
                }
                showModal(`Rename ${manager.res_type}`, "New Name", RenameResource, res_name, res_names)
            }
        );
        function RenameResource(new_name) {
            const the_data = {"new_name": new_name};
            postAjax(`rename_resource/${the_type}/${res_name}`, the_data, renameSuccess);
            function renameSuccess(data) {
                if (data.success) {
                    self.resource_name = new_name;
                    $("#rename-button").text(self.resource_name)
                }
                else {
                    doFlash(data);
                    return false
                }

            }
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

    repository_copy_func (event) {
        const manager = event.data.manager;
        const res_name = manager.check_for_selection();
        if (res_name == "") {
            doFlash({"message": `Select a ${manager.res_type} first.`, "alert_type": "alert-info"})
        }
        $.getJSON($SCRIPT_ROOT + "get_resource_names/" + manager.res_type, function (data) {
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
}
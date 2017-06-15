/**
 * Created by bls910 on 1/21/17.
 */

class UserManagerResourceManager extends ResourceManager{

    constructor (module_id, res_type, resource_module_template, destination_selector) {
        super(module_id, res_type, resource_module_template, destination_selector, false)
        this.last_search = null;
    }

    set_extra_properties() {
        this.include_metadata = true;
        this.include_search_toolbar = true;
        this.include_tags_search = true;
        this.aux_left = true;
        this.repository_copy_view = '/copy_from_repository';
        this.send_repository_view = '/send_to_repository';
    }
    update_main_content() {
        const self = this;
        $.getJSON(`${$SCRIPT_ROOT}/${this.update_view}/${this.res_type}`, function (data) {
            self.fill_content(data.html, null);
            self.select_resource_button(null);
            self.create_search_tag_editor()
        })
    }

    fill_content(the_html) {
        this.get_main_content_dom().html(the_html);
        sorttable.makeSortable(this.get_resource_table()[0]);
        const updated_header = this.get_main_content_dom().find("table th").slice(-2)[0];
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

    // Metadata fields related related

    get_tags() {
        return this.get_tags_field().tagEditor('getTags')[0].tags
    }

    get_tags_string() {
        let taglist = this.get_tags();
        let tags = "";
        for (let tag of taglist) {
            tags = tags + tag + " "
        }
        return tags.trim();
    }

    remove_all_tags() {
        let tags = this.get_tags();
        for (let i = 0; i < tags.length; i++) {
            this.get_tags_field().tagEditor('removeTag', tags[i]);
        }
    }

    create_tag_editor(initial_tag_list) {
        let self = this;
        let data_dict = {"res_type": this.res_type, "is_repository": this.is_repository};
        postAjaxPromise("get_tag_list", data_dict)
            .then(function(data) {
                let all_tags = data.tag_list;
                self.get_tags_field().tagEditor({
                    initialTags: initial_tag_list,
                    autocomplete: {
                        delay: 0, // show suggestions immediately
                        position: { collision: 'flip' }, // automatic menu position up/down
                        source: all_tags
                    },
                    placeholder: "Tags...",
                    beforeTagSave: function (field, editor, tags, tag, val) {
                        if (self.is_repository) {
                            return false
                        }
                    },
                    onChange: function () {
                        if (!self.is_repository) {
                            self.save_my_metadata(false)
                        }
                }});
            })
            .catch(doFlash)
    }

    set_tag_list(tagstring) {
        this.get_tags_field().tagEditor('destroy');
        this.get_tags_field().html("");
        let taglist = tagstring.split(" ");
        this.create_tag_editor(taglist);
    }

    set_resource_metadata(created, tags, notes) {
        this.get_created_field().html(created);
        this.set_tag_list(tags);
        this.get_notes_field().html("");
        this.get_notes_field()[0].value = notes;
    }

    save_my_metadata (flash = true) {
        const res_name = this.get_active_selector_button().attr("value");
        const tags = this.get_tags_string();
        const notes = this.get_notes_field().val();
        const result_dict = {"res_type": this.res_type, "res_name": res_name,
            "tags": tags, "notes": notes, "module_id": this.module_id};
        const self = this;
        postAjaxPromise("save_metadata", result_dict)
            .then(function(data) {
                self.get_selector_table_row(res_name).children()[3].innerHTML = tags;
                if (flash) {
                    doFlash(data)
                }
            })
            .catch(doFlash)
    }

    // search related

    replay_last_search() {
        if (!this.last_search) return;
        let func = this.last_search["function"];
        let val = this.last_search["value"];
        switch (func) {
            case "search_my_resource":
                this.get_search_field()[0].value = val;
                this.search_my_resource();
                break;
            case "search_my_tags":
                this.set_tag_button_state(val);
                this.set_search_tag_list(taglist);
                this.search_my_tags();
                break;
            case "search_active_tag_buttons":
                this.set_tag_button_state(val);
                this.search_active_tag_buttons()
        }
    }

    tagMatch (search_tags, item_tags) {
        if (search_tags.empty()) {
            return true
        }
        for (let item of search_tags) {
            if (!item_tags.includes(item)) {
                return false
            }
        }
        return true
    }

    search_my_resource (){
        const txt = this.get_search_field()[0].value.toLowerCase();
        const all_rows = this.get_all_selector_buttons();
        this.deactivate_tag_buttons();
        let searchtags = [];
        if (txt == "") {
            searchtags = []
        }
        else {
            searchtags = txt.split(" ");
        }
        let self = this;
        let current_tags = [];
        $.each(all_rows, function (index, row_element) {
            const cells = $(row_element).children();
            const res_name = row_element.getAttribute("value").toLowerCase();
            const tag_text = $(cells.slice(-1)[0]).text().toLowerCase();
            const taglist = tag_text.split(" ");
            if ((res_name.search(txt) == -1) && (!self.tagMatch(searchtags, taglist))) {
                $(row_element).fadeOut()
            }
            else {
                $(row_element).fadeIn();
                current_tags = current_tags.concat(taglist);
            }
        });
        current_tags = remove_duplicates(current_tags);
        this.show_hide_tag_buttons(current_tags);
        this.last_search = {"function": "search_my_resource", "value": txt}
    }

    unfilter_me () {
        const all_rows = this.get_all_selector_buttons();
        $.each(all_rows, function (index, row_element) {
                $(row_element).fadeIn()
        });
        this.deactivate_tag_buttons();
        this.show_all_tag_buttons();
        this.get_search_field().val("");
        this.last_search = null;
    }

    search_given_tags (searchtags) {
        const all_rows = this.get_all_selector_buttons();
        let self = this;
        let current_tags = [];
        $.each(all_rows, function (index, row_element) {
            const cells = $(row_element).children();
            const tag_text = $(cells.slice(-1)[0]).text().toLowerCase();
            const taglist = tag_text.split(" ");
            if (!self.tagMatch(searchtags, taglist)) {
                $(row_element).fadeOut()
            }
            else {
                $(row_element).fadeIn();
                current_tags = current_tags.concat(taglist);
            }
        });
        current_tags = remove_duplicates(current_tags);
        this.show_hide_tag_buttons(current_tags)
    }

    create_search_tag_editor(initial_tag_list) {
        let self = this;
        let data_dict = {"res_type": this.res_type, "is_repository": this.is_repository};
        postAjaxPromise("get_tag_list", data_dict)
            .then(function(data) {
                let all_tags = data.tag_list;
                self.get_search_tags_field().tagEditor({
                    initialTags: initial_tag_list,
                    autocomplete: {
                        delay: 0, // show suggestions immediately
                        position: {collision: 'flip'}, // automatic menu position up/down
                        source: all_tags
                    },
                    placeholder: "Tags...",
                    onChange: function () {
                        self.search_my_tags()
                    }
                });
            })
            .catch(doFlash)
    }

    get_search_tags() {
        return this.get_search_tags_field().tagEditor('getTags')[0].tags
    }

    clear_search_tag_list() {
        this.get_search_tags_field().tagEditor('destroy');
        this.get_search_tags_field().val("");
        this.create_search_tag_editor([]);
    }

    set_search_tag_list(taglist) {
        this.get_search_tags_field().tagEditor('destroy');
        this.get_search_tags_field().val("");
    }

    search_my_tags() {
        const searchtags = this.get_search_tags();
        this.search_given_tags(searchtags);
        this.set_tag_button_state(searchtags);
        this.last_search = {"function": "search_my_tags", "value": searchtags}

    }

    // tag button related

    unfilter_tags () {
        const all_rows = this.get_all_selector_buttons();
        $.each(all_rows, function (index, row_element) {
                $(row_element).fadeIn()
        });
        this.deactivate_tag_buttons();
        this.show_all_tag_buttons();
        this.clear_search_tag_list();
        this.last_search = null
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
        this.get_aux_left_dom().html(the_html)
    }

    get_all_tag_buttons () {
        return this.get_module_element(".tag-button-list button")
    }

    refresh_tag_buttons(the_html) {
        let active_tag_buttons = this.get_active_tag_buttons();
        this.fill_tag_buttons(the_html);
        this.set_tag_button_state(active_tag_buttons);
    }

    set_tag_button_state (tag_list) {
        const all_tag_buttons = this.get_all_tag_buttons();
        $.each(all_tag_buttons, function (index, but) {
            if (tag_list.includes(but.innerHTML)) {
                $(but).addClass("active")
            }
            else {
                $(but).removeClass("active")
            }
        })
    }

    search_active_tag_buttons() {
        let active_tag_buttons = this.get_active_tag_buttons();
        this.search_given_tags(active_tag_buttons);
        this.last_search = {"function": "search_active_tag_buttons", "value": active_tag_buttons}
    }

    get_active_tag_buttons () {
        let all_tag_buttons = this.get_all_tag_buttons();
        let active_tag_buttons = [];
        $.each(all_tag_buttons, (index, but) => {
            if ($(but).hasClass("active")) {
                active_tag_buttons.push($(but).html())
            }
        });
        return active_tag_buttons
    }

    show_hide_tag_buttons (searchtags) {
        const all_tag_buttons = this.get_all_tag_buttons();
        $.each(all_tag_buttons, function (index, but) {
            const tag_text = but.innerHTML;
            if (searchtags.empty()) {
                $(but).fadeIn()
            }
            else {
                if (!searchtags.includes(tag_text)) {
                    $(but).fadeOut()
                }
                else {
                    $(but).fadeIn()
                }
            }
        })
    }

    show_all_tag_buttons () {
        const all_tag_buttons = this.get_all_tag_buttons();
        $.each(all_tag_buttons, function (index, but) {
                $(but).fadeIn()
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

    // button action functions

    view_func (event) {
        const manager = event.data.manager;
        const res_name = manager.check_for_selection("resource");
        if (res_name == "") return;
        window.open($SCRIPT_ROOT + manager.view_view + String(res_name))
    }

    insert_new_row (new_row, index) {
        this.get_resource_table().find("tbody > tr").eq(index).before(new_row);
        this.get_resource_table().find("tbody > tr").eq(index).fadeIn("slow")
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
                .then((data) => {
                    manager.insert_new_row(data.new_row, 0);
                    manager.select_first_row();
                    resource_managers["all_module"].insert_new_row(data.new_all_row, 0)
                })
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
                if (!data.success) {
                    doFlash(data);
                    return false
                }
                else {
                    manager.get_selector_table_row(res_name).children()[0].innerHTML = new_name;
                    manager.get_selector_table_row(res_name).attr("value", new_name);
                    resource_managers["all_module"].get_selector_table_row(res_name).children()[0].innerHTML = new_name;
                    resource_managers["all_module"].get_selector_table_row(res_name).attr("value", new_name)
                }
            }
        }
    }

    select_first_row() {
        const all_selectors = this.get_all_selector_buttons();
        if (all_selectors.length > 0) {
            this.selector_click(all_selectors[0]);
        }
    }

    delete_func (event) {
        const manager = event.data.manager;
        const res_name = manager.check_for_selection("resource");
        if (res_name == "") return;
        const confirm_text = `Are you sure that you want to delete ${res_name}?`;
        confirmDialog(`Delete ${manager.res_type}`, confirm_text, "do nothing", "delete", function () {
            postAjaxPromise(manager.delete_view, {"resource_name": res_name})
                .then(() => {
                    let active_row = manager.get_active_selector_button();
                    active_row.fadeOut("slow", function () {
                        active_row.remove();
                        manager.select_first_row()
                    });
                    let all_manager_row = resource_managers["all_module"].get_selector_table_row(res_name);
                    all_manager_row.fadeOut("slow", function () {
                        all_manager_row.remove();
                    });
                })
                .catch(doFlash);
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
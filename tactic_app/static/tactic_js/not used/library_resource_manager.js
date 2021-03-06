/**
 * Created by bls910 on 1/21/17.
 */


class SelectorDragManager extends DragManager {
    constructor (manager) {
        super (manager, manager.get_main_content_dom(), ".selector-button", ["tagname"], "draghover", true)
    }

    handle_drag_over(event) {
        const row_element = $(event.target).closest('tr');
        row_element.addClass(this.hover_style)
    }

    handle_drag_leave(event) {
        const row_element = $(event.target).closest('tr');
        row_element.removeClass(this.hover_style)
    }

    handle_drag_start(event) {
        let res_name = event.target.getAttribute("value");
        let res_names = this.manager.get_all_active_selector_names();
        if (res_names.length > 1 && res_names.includes(res_name)) {
            // this.set_datum(event, "multi_select", "true");
            this.set_datum(event, "multi_select", "true");
        }
        else {
            this.set_datum(event, "multi_select", "false");
            this.set_datum(event, "resourcename", res_name);
        }
    }

    handle_drop(event) {
        const self = this;
        var tag = this.get_datum(event, "tagname");
        const row_element = $(event.target).closest('tr');
        row_element.removeClass(this.hover_style);
        const res_name = row_element[0].getAttribute("value");
        let res_names = this.manager.get_all_active_selector_names();
        if (res_names.length == 1 || !res_names.includes(res_name)) {
            this.select_and_add_tag(row_element[0], tag);
        }
        else {
            const result_dict = {"res_type": this.manager.res_type, "res_names": res_names,
                "tags": [tag], "module_id": this.manager.module_id};
            postAjaxPromise("add_tags", result_dict)
                .then(function(data) {
                    let utags = data.updated_tags;
                    for (let res_name in utags) {
                        self.manager.get_selector_table_row(res_name).children().slice(-1)[0].innerHTML = utags[res_name];
                        resource_managers["all_module"].update_selector_tags(res_name, self.manager.res_type, utags[res_name]);
                    }
                    self.manager.tag_button_list.refresh_given_taglist(data.res_tags);
                    resource_managers["all_module"].tag_button_list.refresh_given_taglist(data.all_tags);
                    self.manager.selector_click(row_element[0], "__none__", true)
                })
                .catch(doFlash)
        }
    }

    select_and_add_tag(row_element, newtag) {
        const self = this;
        this.manager.selector_click(row_element, got_metadata);

        function got_metadata(data) {
            if (data.success) {
                let new_tag_string = data.tags + " " + newtag;
                self.manager.set_resource_metadata(data.res_name, data.datestring, new_tag_string, data.notes, data.additional_mdata);
                self.manager.save_my_metadata();
                self.manager.resize_to_window();
            }
            else {
                self.manager.clear_resource_metadata()
            }
            self.manager.handling_selector_click = false;
        }
    }
}
class TagButtonDragManager extends DragManager {
    constructor (manager) {
        super(manager, manager.get_aux_left_dom(), ".tag-button-list button",
            ["multi_select", "resourcename"], "draghover", true)
    }

    handle_drag_start(event) {
        let tag = event.target.dataset.fulltag;
        this.set_datum(event, "tagname", tag);
    }

    handle_drop(event) {
        let tag = event.target.dataset.fulltag;
        $(event.target).removeClass(this.hover_style);
        var multi_select = this.get_datum(event,"multi_select");
        let self = this;
        if (multi_select == "true") {  // seems like it comes through as a string
            let res_names = this.manager.get_all_active_selector_names();
            const result_dict = {"res_type": this.manager.res_type, "res_names": res_names,
                "tags": [tag], "module_id": this.manager.module_id};
            postAjaxPromise("add_tags", result_dict)
                .then(function(data) {
                    let utags = data.updated_tags;
                    for (let res_name in utags) {
                        self.manager.get_selector_table_row(res_name).children().slice(-1)[0].innerHTML = utags[res_name];
                        resource_managers["all_module"].update_selector_tags(res_name, self.manager.res_type, utags[res_name]);
                    }
                    self.manager.tag_button_list.refresh_given_taglist(data.res_tags);
                    resource_managers["all_module"].tag_button_list.refresh_given_taglist(data.all_tags);
                    let one_res_name = Object.keys(utags)[0];
                    self.manager.selector_click(self.manager.get_selector_table_row(one_res_name)[0], "__none__", true)
                })
                .catch(doFlash)
        }
        else {
            var res_name = this.get_datum(event, "resourcename");
            let row_element = this.manager.get_named_selector_button(res_name);
            this.select_and_add_tag(row_element[0], tag)
        }

    }

    select_and_add_tag(row_element, newtag) {
        const self = this;
        this.manager.selector_click(row_element, got_metadata);

        function got_metadata(data) {
            if (data.success) {
                let new_tag_string = data.tags + " " + newtag;
                self.manager.set_resource_metadata(data.res_name, data.datestring, new_tag_string, data.notes, data.additional_mdata);
                self.manager.save_my_metadata();
                self.manager.resize_to_window();
            }
            else {
                self.manager.clear_resource_metadata()
            }
            self.manager.handling_selector_click = false;
        }
    }
}

class LibraryResourceManager extends ResourceManager{

    constructor (module_id, res_type, resource_module_template, destination_selector, class_string) {
        super(module_id, res_type, resource_module_template, destination_selector, class_string);
    }

    add_listeners() {
        super.add_listeners();
        let self = this;
        let mcd = this.get_main_content_dom();
        let md = this.get_module_dom();
        if (!this.is_repository) {
            md.on("blur", ".notes-field", function () {
                self.save_my_metadata(false)
            });

            md.on("click", ".notes-field-markdown-output", function () {
                self.markdown_helper.hideMarkdown(self.get_module_dom());
                self.markdown_helper.focusNotes(self.get_module_dom())
            });
            md.on("click", ".tag-button-delete", event => self.tag_button_delete_clicked(event));
            md.on("click", ".edit-tags-button", event => self.edit_tags_button_clicked(event));
            md.on("keyup", ".search-field", function(e) {
                if (e.which == 13) {
                    self.search_my_resource();
                    e.preventDefault();
                }
                else {
                    self.search_my_resource();
                }
            });
            md.on("click", ".resource-name", function () {
                if (self.get_all_active_selector_names().length == 1) {
                    var fake_event = {"data": {"manager": self}};
                    self.rename_func(fake_event)
                }
            });
            this.setup_context_menus();
        }
        md.on("mouseup", ".tag-button-list button", event => self.tag_button_clicked(event));
        mcd.on("dblclick", ".selector-button", event => self.selector_double_click(event));
        mcd.on("click", ".selector-button", function(event) {
            if (event.originalEvent.detail <= 1) {  // Will suppress on second click of a double-click
                const row_element = $(event.target).closest('tr');
                self.selector_click(row_element[0], "__none__", event.shiftKey)
            }
        });
    }

    setup_context_menus() {
        this.context_menu_funcs = {
            "open": this[this.double_click_func],
            "rename": this.rename_func,
            "duplicate": this.duplicate_func,
            "delete": this.delete_func
        };
        this.context_menu_items = {
            "open": {name: "Open", icon: "far fa-book-open"},
            "rename": {name: "Rename", icon: "far fa-edit"},
            "duplicate": {name: "Duplicate", icon: "far fa-copy"},
            "delete": {name: "Delete", icon: "fas fa-trash"}
        };
        this.context_menu_funcs = {...this.context_menu_funcs, ...this.specific_context_menu_functions};
        this.context_menu_items = {...this.context_menu_items, ...this.specific_context_menu_items};
        let self = this;
        $.contextMenu({
            selector: `#${self.module_id} .selector-button`,
            callback: function(key, options) {
                var fake_event = {"data": {"manager": resource_managers[get_current_module_id()]}};
                var res_name = $(this).attr("value");
                self.context_menu_funcs[key](fake_event, res_name)
            },
            items: self.context_menu_items,
            events: {
                show: function (options) {
                    this.addClass("context-menu-active")
                },
                hide: function (options) {
                    this.removeClass("context-menu-active")
                }
            }
        });

        $.contextMenu({
            selector: `#${self.module_id} .tag-button-list button`,
            items: {
                "rename_tag": {
                    name: "Rename Tag",
                    icon: "far fa-edit",
                    callback: function (key, options, event) {
                        let tag = this[0].dataset.fulltag;
                        if (tag != "__all__") {
                            self.rename_tag(tag)
                        }
                    }
                },
                "delete_tag": {
                    name: "Delete Tag",
                    icon: "far fa-trash",
                    callback: function (key, options, event) {
                        let tag = this[0].dataset.fulltag;
                        if (tag != "__all__") {
                            self.delete_tag(tag)
                        }
                    }
                }
            }
        })
    }

    set_button_activations(multi_select=false) {
        if (!multi_select) {
            for (let group of this.button_groups) {
                for (let but of group.buttons) {
                    $(`button[value=${but.name}-${this.res_type}]`).css("display", "flex")
                }
            }
        }
        else {
            for (let group of this.button_groups) {
                for (let but of group.buttons) {
                    if (but.multi_select) {
                        $(`button[value=${but.name}-${this.res_type}]`).css("display", "flex")
                    }
                    else {
                        $(`button[value=${but.name}-${this.res_type}]`).css("display", "none")
                    }
                }
            }
        }

    }

    selector_double_click(event) {
        const row_element = $(event.target).closest('tr');
        this.get_all_selector_buttons().removeClass("active");
        row_element.addClass("active");
        event.data = {"manager": this, "res_type": this.res_type};
        this[this.double_click_func](event)
    }

    tag_button_delete_clicked(event) {
        let but = $(event.target);
        let tag = but.closest(".tag-button")[0].dataset.fulltag;
        this.delete_tag(tag);
    }

    edit_tags_button_clicked(event) {
        this.tag_button_list.toggle_edit_button_mode();
    }

    tag_button_clicked(event) {
        let rawbut = event.target;
        let but = $(rawbut);
        if (but.hasClass('tag-button-delete')) return;  // We don't want a click on the delete to bubble up.
        if (rawbut.tagName.toLowerCase() != "button") {
            if ($(rawbut).hasClass("tag-expander")) {
                but = $(rawbut).closest(".tag-button");
                if (but.hasClass("has_children")) {
                    this.tag_button_list.toggle_shrink_state(but)
                }
                return
            }
            else {
                rawbut = $(rawbut).closest(".tag-button")[0];
                but = $(rawbut);
            }
        }

        if (this.tag_button_list.tag_button_mode == "edit") {
            let tag = but[0].dataset.fulltag;
            if (tag != "__all__") {
                this.rename_tag(tag)
            }
        }
        else {
            if (!but.hasClass("active")) {
                this.tag_button_list.set_active_button(but);
            }
            this.scroll_to_active_button()
        }
    }

    set_extra_properties() {
        this.tag_button_list = new TagButtonList(this);
        this.include_metadata = true;
        this.include_search_toolbar = true;
        this.include_tags_search = true;
        this.aux_left = true;
        this.repository_copy_view = '/copy_from_repository';
        this.send_repository_view = '/send_to_repository';
        this.specific_context_menu_functions = {};
        this.specific_context_menu_items = {}
    }

    update_main_content() {
        const self = this;
        $.getJSON(`${$SCRIPT_ROOT}/${this.update_view}/${this.res_type}`, function (data) {
            self.fill_content(data.html, null);
            self.select_resource_button(null);
        })
    }

    resize_to_window() {
        const rsw_row = this.get_main_content_row();
        resize_dom_to_bottom(rsw_row, 50);
        const left_div = this.get_left_div();
        resize_dom_to_bottom(left_div, 50);
        const right_div = this.get_right_div();
        resize_dom_to_bottom(right_div, 50);
        const tselector = this.get_aux_left_dom();
        resize_dom_to_bottom(tselector, 50);
        const rselector = this.get_aux_right_dom();
        resize_dom_to_bottom(rselector, 50);
        this.tag_button_list.resize_me();
        this.update_width(this.current_width_fraction)
    }

    fill_content(the_html) {
        this.get_main_content_dom().html(the_html);
        sorttable.makeSortable(this.get_resource_table()[0]);
        const updated_header = this.get_main_content_dom().find("table th").slice(-2)[0];
        sorttable.innerSortFunction.apply(updated_header, []);
        sorttable.innerSortFunction.apply(updated_header, []);
        this.selector_drag_manager = new SelectorDragManager(this);
    }

    check_for_selection () {
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

    add_tags(tags) {
        let active_element = document.activeElement;
        this.setting_tags = true;
        for (let i = 0; i < tags.length; i++) {
            this.get_tags_field().tagEditor('addTag', tags[i], true);
        }
        this.setting_tags = false;
        if ($(active_element).hasClass("search-field")) {
            active_element.focus()
        }
        else {
            active_element.blur()
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
                    forceLowercase: true,
                    autocomplete: {
                        delay: 0, // show suggestions immediately
                        position: { collision: 'flip' }, // automatic menu position up/down
                        source: all_tags
                    },
                    placeholder: "Tags...",
                    beforeTagSave: function (field, editor, tags, tag, val) {
                        if (self.is_repository && !self.setting_tags) {
                            return false
                        }
                    },
                    onChange: function () {
                        if (!self.setting_tags && !self.is_repository && self.tageditor_onchange_enabled) {
                            self.save_my_metadata(false)
                        }
                }});
                self.tageditor_onchange_enabled = true
            })
            .catch(doFlash)
    }

    remove_all_tags() {
        let active_element = document.activeElement;
        let tags = this.get_tags();
        this.setting_tags = true;
        for (let i = 0; i < tags.length; i++) {
            this.get_tags_field().tagEditor('removeTag', tags[i], true);
        }
        this.setting_tags = false;
        if ($(active_element).hasClass("search-field")) {
            active_element.focus()
        }
        else {
            active_element.blur()
        }
    }

    set_tag_list(tagstring) {
        let taglist = tagstring.split(" ");
        if (this.get_tags() == undefined) {
            this.create_tag_editor(taglist)
        }
        else {
            this.remove_all_tags();
            this.add_tags(taglist);
        }
    }

    selector_click(row_element, custom_got_metadata="__none__", shift_key_down=false) {
        if (!this.handling_selector_click) {  // We want to make sure we are not already processing a click
            this.handling_selector_click = true;
            const res_name = row_element.getAttribute("value");
            const result_dict = {"res_type": this.res_type, "res_name": res_name, "is_repository": this.is_repository};
            if (!shift_key_down) {
                this.get_all_selector_buttons().removeClass("active");
            }

            const self = this;
            var got_metadata;
            $(row_element).addClass("active");

            if (shift_key_down) {
                this.set_button_activations(true);
                this.get_notes_field()[0].readOnly = true;
                if (this.include_metadata) {
                    result_dict["res_name_list"] = this.get_all_active_selector_names();
                    postAjaxPromise("grab_multi_metadata", result_dict)
                        .then(got_multi_metadata)
                        .catch(got_multi_metadata)
                } else {
                    self.handling_selector_click = false
                }


                this.handling_selector_click = false
            }
            else {
                this.set_button_activations(false);
                this.get_notes_field()[0].readOnly = false;
                if (custom_got_metadata == "__none__") {
                    got_metadata = default_got_metadata
                } else {
                    got_metadata = custom_got_metadata
                }
                if (this.include_metadata) {
                    postAjaxPromise("grab_metadata", result_dict)
                        .then(got_metadata)
                        .catch(got_metadata)
                } else {
                    self.handling_selector_click = false
                }
            }

            function default_got_metadata(data) {
                if (data.success) {
                    self.set_resource_metadata(res_name, data.datestring, data.tags, data.notes, data.additional_mdata);
                    self.resize_to_window();
                }
                else {
                    // doFlash(data)
                    self.clear_resource_metadata()
                }
                self.handling_selector_click = false;
            }

            function got_multi_metadata(data) {
                if (data.success) {
                    self.set_resource_metadata("__multiple__", "", data.common_tags, "", {});
                    self.resize_to_window();
                }
                else {
                    // doFlash(data)
                    self.clear_resource_metadata()
                }
                self.handling_selector_click = false;
            }

        }
    }

    format_metadata(name, valstring) {
        return `<div><span class="text-primary">${name}:</span> ${valstring}</div>`
    }

    set_resource_metadata(resource_name, created, tags, notes, additional_mdata) {
        this.get_resource_name_field().html(resource_name);
        this.get_created_field().html(this.format_metadata("created", created));
        this.set_tag_list(tags);
        let md = this.get_module_dom();
        this.markdown_helper.clearNotes(md);
        this.markdown_helper.setNotesValue(md, notes);
        this.markdown_helper.convertMarkdown(md);
        let added_string = "";
        for (let name in additional_mdata) {
            let val = additional_mdata[name];
            let valstring;
            if (Array.isArray(val)){
                valstring = "";
                let isfirst = true;
                for (let it of val) {
                    if (!isfirst) {
                        valstring += ", ";
                    }
                    isfirst = false;
                    valstring += String(it)
                }
            }
            else {
                valstring = String(val)
            }
            added_string = added_string + this.format_metadata(name, valstring)
        }

        this.get_additional_mdata_field().html(added_string)
    }

    save_my_metadata (flash = false) {
        let res_names = this.get_all_active_selector_names();
        const tags = this.get_tags_string();
        if (res_names.length == 1) {
            const res_name = res_names[0];
            const notes = this.markdown_helper.getNotesValue(this.get_module_dom());
            const result_dict = {"res_type": this.res_type, "res_name": res_name,
                "tags": tags, "notes": notes, "module_id": this.module_id};
            const self = this;
            postAjaxPromise("save_metadata", result_dict)
                .then(function(data) {
                    self.get_selector_table_row(res_name).children().slice(-1)[0].innerHTML = tags;
                    self.tag_button_list.refresh_given_taglist(data.res_tags);
                    resource_managers["all_module"].update_selector_tags(res_name, self.res_type, tags);
                    resource_managers["all_module"].tag_button_list.refresh_given_taglist(data.all_tags);
                    self.markdown_helper.convertMarkdown(self.get_module_dom());
                    if (flash) {
                        doFlash(data)
                    }
                })
                .catch(doFlash)
        }
        else {
            const result_dict = {"res_type": this.res_type, "res_names": res_names, "tags": tags,
                "module_id": this.module_id};
            const self = this;
            postAjaxPromise("overwrite_common_tags", result_dict)
                .then(function(data) {
                    let utags = data.updated_tags;
                    for (let res_name in utags) {
                        self.get_selector_table_row(res_name).children().slice(-1)[0].innerHTML = utags[res_name];
                        resource_managers["all_module"].update_selector_tags(res_name, self.res_type, utags[res_name]);
                    }
                    self.tag_button_list.refresh_given_taglist(data.res_tags);
                    resource_managers["all_module"].tag_button_list.refresh_given_taglist(data.all_tags);
                    self.markdown_helper.convertMarkdown(self.get_module_dom());
                    if (flash) {
                        doFlash(data)
                    }
                })
                .catch(doFlash)
        }

    }

    match_any_tag (search_tags, item_tags) {
        for (let tag of item_tags) {
            if (search_tags.includes(tag)) {
                return true
            }
        }
        return false
    }

    show_hide_from_matchlist(match_list) {
        const all_rows = this.get_all_selector_buttons();
        $.each(all_rows, function (index, row_element) {
            const res_name = row_element.getAttribute("value");
            if (match_list.includes(res_name)) {
                $(row_element).addClass("showme");
                $(row_element).removeClass("hideme");
            }
            else {
                $(row_element).addClass("hideme");
                $(row_element).removeClass("showme");
            }
        });
        this.hide_table_rows(all_rows.filter(".hideme"));
        this.show_table_rows(all_rows.filter(".showme"));
        if (!this.active_selector_is_visible()){
            this.select_first_row()
        }
    }

    search_inside () {
        return this.allow_search_inside && $(this.get_module_element(".search-inside-checkbox")[0]).prop('checked')
    }

    search_metadata () {
        return this.allow_metadata_search && $(this.get_module_element(".metadata-search-checkbox")[0]).prop('checked')
    }

    search_my_resource () {
        const txt = this.get_search_field()[0].value.toLowerCase();
        this.tag_button_list.get_all_tag_buttons().removeClass("active");
        let searchtags = [];
        if (txt == "") {
            searchtags = []
        }
        else {
            searchtags = txt.split(" ");
        }
        let matching_tags = this.tag_button_list.find_matching_tags(searchtags);

        const all_rows = this.get_all_selector_buttons();
        if (matching_tags.empty() && (txt == "")) {
            this.show_table_rows(all_rows);
        }
        else {

            let self = this;
            if (this.search_inside()) {
                let search_info = {"search_text": txt};
                postAjaxPromise(self.search_inside_view, search_info)
                    .then((data) => {
                        var match_list = data.match_list;
                        if (this.search_metadata()) {
                            postAjaxPromise(self.search_metadata_view, search_info)
                                .then((data) => {
                                    match_list = match_list.concat(data.match_list);
                                    self.show_hide_from_matchlist(match_list)
                                })
                                .catch(doFlash);
                        }
                        else {
                            self.show_hide_from_matchlist(match_list)
                        }
                    })
                    .catch(doFlash);
                return
            }
            if (this.search_metadata()) {
                let search_info = {"search_text": txt};
                postAjaxPromise(self.search_metadata_view, search_info)
                    .then((data) => {
                        self.show_hide_from_matchlist(data.match_list)
                    })
                    .catch(doFlash);
                return
            }
            $.each(all_rows, function (index, row_element) {
                const cells = $(row_element).children();
                const res_name = row_element.getAttribute("value").toLowerCase();
                const tag_text = $(cells.slice(-1)[0]).text().toLowerCase();
                const taglist = tag_text.split(" ");

                if ((res_name.search(txt) != -1) || (self.match_any_tag(matching_tags, taglist))) {
                    $(row_element).addClass("showme");
                    $(row_element).removeClass("hideme");
                }
                else {
                    $(row_element).addClass("hideme");
                    $(row_element).removeClass("showme");
                }
            });
            this.hide_table_rows(all_rows.filter(".hideme"));
            this.show_table_rows(all_rows.filter(".showme"));

            if (!this.active_selector_is_visible()) {
                this.select_first_row()
            }
        }
    }

    unfilter_me () {
        // const all_rows = this.get_all_selector_buttons();
        // this.show_table_rows(all_rows);
        //
        // this.tag_button_list.deactivate_all_buttons();
        this.tag_button_list.set_active_tag("__all__");
        this.get_search_field().val("");
    }

    show_table_rows (the_rows) {
        the_rows.css("display", "table-row")
    }

    hide_table_rows (the_rows) {
        the_rows.css("display", "none")
    }

    // tag button related

    update_aux_content() {
        this.tag_button_list.create_tag_buttons(this.update_tag_view);
        this.get_aux_right_dom().css("display", "none");
    }

    update_selector_tags(res_name, new_tags) {
        this.get_selector_table_row(res_name).children().slice(-1)[0].innerHTML = new_tags;
        // if (this.get_active_selector_button().attr("value") == res_name) {
        //     this.set_tag_list(new_tags)
        // }
    }

    remove_tag_from_all_rows(tag) {
        const all_rows = this.get_all_selector_buttons();
        $.each(all_rows, function (index, row_element) {
            const cells = $(row_element).children();
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
        });
        this.tageditor_onchange_enabled = false;
        this.get_tags_field().tagEditor('removeTag', tag, true);
        this.tageditor_onchange_enabled = true;
    }

    rename_tag_in_all_rows(old_tag, new_tag) {
        const all_rows = this.get_all_selector_buttons();
        $.each(all_rows, function (index, row_element) {
            const cells = $(row_element).children();
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
        });
        if (this.get_tags().includes(old_tag)){
            this.tageditor_onchange_enabled = false;
            this.get_tags_field().tagEditor('removeTag', old_tag, true);
            if (!this.get_tags().includes(new_tag)){
                this.get_tags_field().tagEditor('addTag', new_tag, true)
            }
            this.tageditor_onchange_enabled = true;
        }
    }

    DoTagDelete(tag) {
        const result_dict = {"res_type": this.res_type, "tag": tag, "module_id": this.module_id};
        let self = this;
        postAjaxPromise("delete_tag", result_dict)
            .then(function(data) {
                self.remove_tag_from_all_rows(tag);
                self.tag_button_list.refresh_given_taglist(data.res_tags);
                resource_managers["all_module"].remove_tag_from_all_rows(tag, self.res_type);
                resource_managers["all_module"].tag_button_list.refresh_given_taglist(data.all_tags);
                if (!self.active_selector_is_visible()){
                    self.select_first_row()
                }
            })
            .catch(doFlash)
    }

    delete_tag(tag) {
        const confirm_text = `Are you sure that you want to delete the tag <b style="color:red">${tag}</b> for this resource type?`;
        let self = this;
        confirmDialog(`Delete tag`, confirm_text, "do nothing", "delete", function () {
            self.DoTagDelete(tag)
        })
    }

    DoTagRename(old_tag, new_tag_base) {
        let child_tags = this.tag_button_list.get_all_children(old_tag);
        let immediate_parent = "";
        if (old_tag.search("/") != -1) {
            immediate_parent = this.tag_button_list.get_immediate_tag_parent(old_tag) + "/"
        }
        let new_tag = immediate_parent + new_tag_base;
        let tag_changes = [[old_tag, new_tag]];
        for (let child_tag of child_tags) {
            let new_child_tag = child_tag.replace(old_tag, new_tag);  // this won't deal properly with all cases
            tag_changes.push([child_tag, new_child_tag])
        }

        const result_dict = {"res_type": this.res_type, "tag_changes": tag_changes, "module_id": this.module_id};
        let self = this;
        postAjaxPromise("rename_tag", result_dict)
            .then(function (data) {
                for (let tag_change of tag_changes) {
                    let new_tag = tag_change[1];
                    let old_tag = tag_change[0];
                    if (!(new_tag == old_tag)) {
                        self.rename_tag_in_all_rows(old_tag, new_tag);
                        resource_managers["all_module"].rename_tag_in_all_rows(old_tag, new_tag, self.res_type);

                        if (!self.active_selector_is_visible()){
                            self.select_first_row()
                        }
                    }
                }
                self.tag_button_list.refresh_given_taglist(data.res_tags);
                resource_managers["all_module"].tag_button_list.refresh_given_taglist(data.all_tags);

            })
            .catch(doFlash)
    }

    rename_tag(old_tag) {
        let self = this;
        let tag_base = this.tag_button_list.get_tag_base(old_tag);
        showModal(`Rename tag ${tag_base}`, `New name for this tag`, RenameTag, tag_base);

        function RenameTag(new_tag_base) {
            self.DoTagRename(old_tag, new_tag_base)
        }
    }

    add_func(event) {
        const manager = event.data.manager;
        const form_data = new FormData(this);
        //noinspection JSUnresolvedVariable
        postAjaxUploadPromise(manager.add_view, form_data)
            .then(doNothing)
            .catch(doFlash);
        event.preventDefault();
    }

    // button action functions

    view_func (event, res_name) {
        const manager = event.data.manager;
        if (typeof(res_name) == "undefined") {
            res_name = manager.check_for_selection("resource");
        }
        if (res_name == "") return;
        window.open($SCRIPT_ROOT + manager.view_view + String(res_name))
    }

    insert_new_row (new_row, index) {
        this.get_resource_table().find("tbody > tr").eq(index).before(new_row);
        this.get_resource_table().find("tbody > tr").eq(index).fadeIn("slow")
    }

    duplicate_func (event, res_name) {
        const manager = event.data.manager;
        if (typeof(res_name) == "undefined") {
            res_name = manager.check_for_selection("resource");
        }
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

    rename_func (event, res_name) {
        const manager = event.data.manager;
        if (typeof(res_name) == "undefined") {
            res_name = manager.check_for_selection("resource");
        }
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
                    manager.get_resource_name_field().html(new_name);
                    resource_managers["all_module"].get_selector_table_row(res_name, the_type).children()[0].innerHTML = new_name;
                    resource_managers["all_module"].get_selector_table_row(res_name, the_type).attr("value", new_name)
                }
            }
        }
    }

    select_first_row() {
        const all_selectors = this.get_all_selector_buttons();
        const visible_rows = all_selectors.filter(function() { return $(this).css("display") == "table-row" });
        if (visible_rows.length > 0) {
            this.selector_click(visible_rows[0]);
        }
    }


    delete_func (event, res_name) {
        const manager = event.data.manager;
        var res_names;
        if (typeof(res_name) == "undefined") {
            res_names = manager.get_all_active_selector_names();
            if (res_names.length == 0) return;
        }
        else {
            res_names = [res_name];
        }

        var confirm_text;
        if (res_names.length==1) {
            let res_name = res_names[0];
            confirm_text = `Are you sure that you want to delete ${res_name}?`;
        }
        else {
            confirm_text = `Are you sure that you want to delete multiple items?`;
        }

        confirmDialog(`Delete ${manager.res_type}`, confirm_text, "do nothing", "delete", function () {
            postAjaxPromise(manager.delete_view, {"resource_names": res_names})
                .then(() => {
                    for (let res_name of res_names) {
                        let arow = manager.get_selector_table_row(res_name);
                        arow.fadeOut("slow", function () {
                            arow.remove();
                            manager.select_first_row()
                        })
                    }
                    for (let res_name of res_names) {
                        let all_manager_row = resource_managers["all_module"].get_selector_table_row(res_name, manager.res_type);
                        all_manager_row.fadeOut("slow", function () {
                            all_manager_row.remove();
                        });
                    }

                })
                .catch(doFlash);
        })
    }

    refresh_func(event) {
        const manager = event.data.manager;
        postWithCallbackNoMain("host", manager.refresh_task, {"user_id": user_id})
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
/**
 * Created by bls910 on 1/21/17.
 */

class TagButtonList {
    constructor (manager) {
        this.manager = manager;
        this.tag_button_mode = "select";
        this.res_type = this.manager.res_type;
    }

    get_module_element(selector) {
        return this.manager.get_module_element(selector)
    }

    fix_tag_button_width() {
        let w = this.get_tag_button_group().width();
        this.get_tag_button_group().css("min-width", w)
    }

    get_all_tag_buttons () {
        return this.get_module_element(".tag-button-list button")
    }

    get_tag_button_list() {
        return this.get_module_element(".tag-button-list")
    }

    get_tag_button_group () {
        return this.get_module_element(".tag-button-list .btn-group-vertical")
    }

    get_tag_button_deleters () {
        return this.get_module_element(".tag-button-list .tag-button-delete")
    }

    create_tag_buttons(url_string) {
        const self = this;
        $.getJSON(`${$SCRIPT_ROOT}/${url_string}/${this.manager.res_type}`, function (data) {
            let visible_tags = [];
            for (let the_tag of data.tag_list) {
                if (the_tag.search("/") == -1) {
                    visible_tags.push(the_tag)
                }
            }
            self.create_button_html(data.tag_list, visible_tags);
        })
    }

    resize_me() {
        resize_dom_to_bottom(this.get_tag_button_list(), 50);
    }

    toggle_edit_button_mode(mode) {
        if (this.tag_button_mode == "edit") {
            this.set_edit_button_mode("select")
        }
        else {
            this.set_edit_button_mode("edit")
        }
    }

    set_edit_button_mode (mode) {
        if (mode == "edit") {
            this.tag_button_mode = "edit";
            this.get_module_element(".edit-tags-button").addClass("active");
            this.get_tag_button_deleters().addClass("delete-visible")
        }
        else {
            this.tag_button_mode = "select";
            this.get_module_element(".edit-tags-button").removeClass("active");
            this.get_tag_button_deleters().removeClass("delete-visible")
        }
    }

    set_button_state_from_taglist (tag_list) {
        const all_tag_buttons = this.get_all_tag_buttons();
        $.each(all_tag_buttons, function (index, but) {
            if (tag_list.includes(but.dataset.fulltag)) {
                $(but).addClass("active")
            }
            else {
                $(but).removeClass("active")
            }
        });
        this.show_hide_subtag_buttons_from_actives();
    }

    refresh_from_selectors() {
        let tag_list = this.get_all_selector_tags();
        this.refresh_given_taglist(tag_list)
    }

    refresh_given_taglist(tag_list) {
        let active_tag_buttons = this.get_active_tags();
        let visible_tags = this.get_currently_visible_tags();
        visible_tags = visible_tags.concat(active_tag_buttons);
        visible_tags = remove_duplicates(visible_tags);
        this.create_button_html(tag_list, visible_tags);
        this.set_button_state_from_taglist(active_tag_buttons);
        this.set_edit_button_mode(this.tag_button_mode);
    }

    get_active_tags() {
        let all_tag_buttons = this.get_all_tag_buttons();
        let active_tag_buttons = [];
        $.each(all_tag_buttons, (index, but) => {
            if ($(but).hasClass("active")) {
                active_tag_buttons.push(but.dataset.fulltag)
            }
        });
        return active_tag_buttons
    }

    get_currently_visible_tags() {
        const all_rows = this.manager.get_all_selector_buttons();
        const visible_rows = all_rows.filter(function() { return $(this).css("display") == "table-row" });
        let self = this;
        let visible_tags = [];
        $.each(visible_rows, function (index, row_element) {
            const cells = $(row_element).children();
            const tag_text = $(cells.slice(-1)[0]).text().toLowerCase();
            const taglist = tag_text.split(" ");
            visible_tags = visible_tags.concat(taglist);
        });
        visible_tags = remove_duplicates(visible_tags);
        return visible_tags
    }

    get_all_selector_tags() {
        const all_rows = this.manager.get_all_selector_buttons();
        let self = this;
        let all_tags = [];
        $.each(all_rows, function (index, row_element) {
            const cells = $(row_element).children();
            const tag_text = $(cells.slice(-1)[0]).text().toLowerCase();
            if (tag_text != "") {
                const taglist = tag_text.split(" ");
                all_tags = all_tags.concat(taglist);
            }
        });
        all_tags = remove_duplicates(all_tags);
        all_tags.splice(all_tags.indexOf(""), 1);
        return all_tags.sort()
    }

    get_all_parent_tags(tag_list){
        var ptags = [];
        for (let the_tag of tag_list){
            ptags = ptags.concat(this.get_parent_tags(the_tag))
        }
        ptags = remove_duplicates(ptags);
        return ptags
    }

    tag_depth(the_tag) {
        return (the_tag.match(/\//g) || []).length;
    }

    create_button_html(tag_list, visible_buttons) {
        let tag_button_html = `<div class="btn-group-vertical btn-group-sm" role="group">`;
        let parent_tags = this.get_all_parent_tags(tag_list);
        let indent_amount = 12;
        for (let tag of tag_list) {
            let new_html;
            let tag_base = this.get_tag_base(tag);
            var prefix;
            var hcclass;
            let mleft = indent_amount * this.tag_depth(tag);
            let has_children = parent_tags.includes(tag);

            if (has_children) {
                hcclass = "has_children";
                prefix = `<span class="tag-expander fas fa-caret-right" style="margin-left:${mleft}px"></span><span class="tag-expander fas fa-caret-down" style="display:none; margin-left:${mleft}px"></span><span class="tag-icon fal fa-folder"></span>`
            }
            else {
                hcclass = "no_children";
                prefix = `<span style="margin-left:${mleft + indent_amount}px"></span></span><span class="tag-icon fal fa-hashtag"></span>`
            }
            if ((visible_buttons == "all") || (visible_buttons.includes(tag))) {
                new_html = `<button type="button" data-fulltag="${tag}" class="btn btn-outline-secondary tag-button ${hcclass} showme" style="display: block" value="${this.res_type}">${prefix}${tag_base}<span class="tag-button-delete"></span></button>`
            }
            else {
                new_html = `<button type="button" data-fulltag="${tag}" class="btn btn-outline-secondary tag-button ${hcclass} hideme" style="display: none" value="${this.res_type}">${prefix}${tag_base}<span class="tag-button-delete"></span></button>`
            }
            tag_button_html = tag_button_html + new_html + "\n"
        }
        tag_button_html = tag_button_html + "</div>";
        let the_html;
        if (this.manager.is_repository) {
            the_html = `<div class='tag-button-list'>${tag_button_html}</div>`
        }
        else {
            the_html = `<div><button type='button' class='btn btn-outline-secondary edit-tags-button' style='border:none; font-size:12px'>edit tags</button></div>
            <div class='tag-button-list'>${tag_button_html}</div>`
        }
        this.manager.get_aux_left_dom().html(the_html);
        this.resize_me()
    }

    has_slash(tag_text) {
        return (tag_text.search("/") != -1)
    }

    get_all_subtag_buttons() {
        const all_tag_buttons = this.get_all_tag_buttons();
        var subtag_buttons = [];
        var self = this;
         $.each(all_tag_buttons, function (index, but) {
             const tag_text = but.dataset.fulltag;
             if (self.has_slash(tag_text)) {
                 subtag_buttons.push(but)
             }
         });
        return $(subtag_buttons)
    }

    get_immediate_tag_parent(the_tag) {
        let re = /\/\w*$/;
        return the_tag.replace(re, "")
    }

    get_tag_base(the_tag) {
        if (!this.has_slash(the_tag)){
            return the_tag
        }
        else {
            let re = /\/\w*$/;
            return re.exec(the_tag)[0].slice(1)
        }
    }

    expand_tags(item_tags) {
        var expanded_tags = item_tags.slice(0);
        for (let the_tag of item_tags) {
            expanded_tags = expanded_tags.concat(this.get_parent_tags(the_tag))
        }
        expanded_tags = remove_duplicates(expanded_tags);
        return expanded_tags
    }

    get_parent_tags(the_tag) {
        if (the_tag.search("/") == -1) {
            return []
        }
        else {
            let parent_tag = this.get_immediate_tag_parent(the_tag);
            let ptags = this.get_parent_tags(parent_tag);
            ptags.push(parent_tag);
            return ptags
        }
    }

    deactivate_subtags(the_tag) {
        let subtag_buttons = this.get_all_subtag_buttons();
        let self = this;
        $.each(subtag_buttons, function (index, but) {
             let but_tag = but.dataset.fulltag;
             let ptags = self.get_parent_tags(but_tag);
             if (ptags.includes(the_tag)) {
                 $(but).removeClass("active");
             }
         })
    }

    is_subtag_of(the_tag, active_tags) {
        if (the_tag.search("/") == -1) {
            return false
        }
        let the_parent = this.get_immediate_tag_parent(the_tag);
        return active_tags.includes(the_parent)
    }

    show_hide_subtag_buttons_from_actives() {
        const active_tags = this.get_active_tags();
        const subtag_buttons = this.get_all_subtag_buttons();
        var self = this;
        $.each(subtag_buttons, function (index, but) {
            const tag_text = but.dataset.fulltag;
            if (self.is_subtag_of(tag_text, active_tags)) {
                if ($(but).css("display") == "none") {
                    $(but).addClass("showme")
                }
            }
            else {
                if ($(but).css("display") != "none") {
                    $(but).addClass("hideme")
                }
            }
        });
        this.show_buttons(subtag_buttons.filter(".showme"));
        this.fix_tag_button_width();
        this.hide_buttons(subtag_buttons.filter(".hideme"));
    }

    show_hide_buttons_given_taglist(searchtags) {
        const all_tag_buttons = this.get_all_tag_buttons();
        all_tag_buttons.removeClass("hideme");
        all_tag_buttons.removeClass("showme");
        const active_tags = this.get_active_tags();
        self = this;

        if (searchtags.empty()) {
            $.each(all_tag_buttons, function (index, but) {
                const tag_text = but.dataset.fulltag;
                if (!self.has_slash(tag_text)) {
                    if ($(but).css("display") == "none") {
                        $(but).addClass("showme")
                    }
                }
                else {
                    if ($(but).css("display") != "none") {
                        $(but).addClass("hideme")
                    }
                }
            })
        }
        else {
            $.each(all_tag_buttons, function (index, but) {
                const tag_text = but.dataset.fulltag;
                if (searchtags.includes(tag_text) || self.is_subtag_of(tag_text, active_tags)) {
                    if ($(but).css("display") == "none") {
                        $(but).addClass("showme")
                    }
                }
                else {
                    if ($(but).css("display") != "none") {
                        $(but).addClass("hideme")
                    }
                }
            });
        }

        this.show_buttons(all_tag_buttons.filter(".showme"));
        this.hide_buttons(all_tag_buttons.filter(".hideme"));
        this.show_hide_subtag_buttons_from_actives();
        this.fix_tag_button_width();
    }

    show_buttons(the_tag_buttons) {
        the_tag_buttons.slideDown();
    }

    hide_buttons(the_tag_buttons) {
        the_tag_buttons.slideUp();
    }

    unfilter_all() {
        this.deactivate_all_buttons();
        this.show_all_buttons();
    }

    show_all_buttons () {
        const all_tag_buttons = this.get_all_tag_buttons();
        var buttons_to_show = [];
        var buttons_to_hide = [];
        var self = this;
        $.each(all_tag_buttons, function (index, but) {
            const tag_text = but.dataset.fulltag;
            if (!self.has_slash(tag_text)) {
                buttons_to_show.push(but)
            }
            else {
                buttons_to_hide.push(but)
            }
        });
        this.show_buttons($(buttons_to_show));
        this.hide_buttons($(buttons_to_hide));
    }

    deactivate_all_buttons () {
        const all_tag_buttons = this.get_all_tag_buttons();
        all_tag_buttons.removeClass("active");
    }

}

class UserManagerResourceManager extends ResourceManager{

    constructor (module_id, res_type, resource_module_template, destination_selector, class_string) {
        super(module_id, res_type, resource_module_template, destination_selector, class_string);
    }

    add_listeners() {
        super.add_listeners();
        if (!this.is_repository) {
            let self = this;
            this.get_module_dom().on("blur", ".notes-field", function () {
                self.save_my_metadata(false)
            });

            this.get_module_dom().on("click", ".notes-field-markdown-output", function () {
                self.markdown_helper.hideMarkdown(self.get_module_dom());
                self.markdown_helper.focusNotes(self.get_module_dom())
            })
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
                    forceLowercase: true,
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
                        if (!self.is_repository && self.tageditor_onchange_enabled) {
                            self.save_my_metadata(false)
                        }
                }});
                self.tageditor_onchange_enabled = true
            })
            .catch(doFlash)
    }

    set_tag_list(tagstring) {
        this.get_tags_field().tagEditor('destroy');
        this.get_tags_field().html("");
        let taglist = tagstring.split(" ");
        this.create_tag_editor(taglist);
    }

    format_metadata(name, valstring) {
        return `<div><span class="text-primary">${name}:</span> ${valstring}</div>`
    }

    set_resource_metadata(created, tags, notes, additional_mdata) {
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
        const res_name = this.get_active_selector_button().attr("value");
        const tags = this.get_tags_string();
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

    tagMatch (search_tags, item_tags) {
        if (search_tags.empty()) {
            return true
        }
        let expanded_item_tags = this.tag_button_list.expand_tags(item_tags);  // tactic_working
        for (let item of search_tags) {
            if (!expanded_item_tags.includes(item)) {
                return false
            }
        }
        return true
    }

    search_my_resource (){
        const txt = this.get_search_field()[0].value.toLowerCase();

        this.tag_button_list.deactivate_all_buttons();
        let searchtags = [];
        if (txt == "") {
            searchtags = []
        }
        else {
            searchtags = txt.split(" ");
        }
        this.search_given_tags(searchtags, txt);
    }

    unfilter_me () {
        const all_rows = this.get_all_selector_buttons();
        this.show_table_rows(all_rows);

        this.tag_button_list.deactivate_all_buttons();
        this.tag_button_list.show_all_buttons();
        this.get_search_field().val("");
    }

    show_table_rows (the_rows) {
        the_rows.css("display", "table-row")
    }

    hide_table_rows (the_rows) {
        the_rows.css("display", "none")
    }

    search_given_tags (searchtags, txt="__NONE__") {
        const all_rows = this.get_all_selector_buttons();
        let self = this;
        let current_tags = [];
        $.each(all_rows, function (index, row_element) {
            const cells = $(row_element).children();
            const res_name = row_element.getAttribute("value").toLowerCase();
            const tag_text = $(cells.slice(-1)[0]).text().toLowerCase();
            const taglist = tag_text.split(" ");
            if ((res_name.search(txt) == -1) && (!self.tagMatch(searchtags, taglist))) {
                $(row_element).addClass("hideme");
                $(row_element).removeClass("showme");
            }
            else {
                $(row_element).addClass("showme");
                $(row_element).removeClass("hideme");
                current_tags = current_tags.concat(taglist);
            }
        });
        this.hide_table_rows(all_rows.filter(".hideme"));
        this.show_table_rows(all_rows.filter(".showme"));
        current_tags = remove_duplicates(current_tags);
        var active_tags = this.tag_button_list.get_active_tags();
        var tags_to_show = [];
        for (let the_tag of current_tags) {
            if ((the_tag.search("/") == -1) || (this.tag_button_list.is_subtag_of(the_tag, active_tags))) {
                tags_to_show.push(the_tag)
            }
        }
        for (let the_tag of active_tags) {
            if (!tags_to_show.includes(the_tag)) {
                tags_to_show.push(the_tag)
            }
        }
        this.tag_button_list.show_hide_buttons_given_taglist(tags_to_show);
        if (!this.active_selector_is_visible()){
            this.select_first_row()
        }
    }

    // tag button related

    unfilter_tags () {
        this.tag_button_list.unfilter_all();
        this.clear_search_tag_list();
        const all_rows = this.get_all_selector_buttons();
        this.show_table_rows(all_rows);
    }

    update_aux_content() {
        this.tag_button_list.create_tag_buttons(this.update_tag_view);
        this.get_aux_right_dom().css("display", "none");
    }

    update_selector_tags(res_name, new_tags) {
        this.get_selector_table_row(res_name).children().slice(-1)[0].innerHTML = new_tags;
        if (this.get_active_selector_button().attr("value") == res_name) {
            this.set_tag_list(new_tags)
        }
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
        const confirm_text = `Are you sure that you want delete to the tag ${tag} for this resource type?`;
        let self = this;
        confirmDialog(`Delete tag`, confirm_text, "do nothing", "delete", function () {
            self.DoTagDelete(tag)
        })
    }

    DoTagRename(old_tag, new_tag) {
        const result_dict = {"res_type": this.res_type, "old_tag": old_tag, "new_tag": new_tag, "module_id": this.module_id};
        let self = this;
        postAjaxPromise("rename_tag", result_dict)
            .then(function (data) {
                if (!(new_tag == old_tag)) {
                    self.rename_tag_in_all_rows(old_tag, new_tag);
                    self.tag_button_list.refresh_given_taglist(data.res_tags);
                    resource_managers["all_module"].rename_tag_in_all_rows(old_tag, new_tag, self.res_type);
                    resource_managers["all_module"].tag_button_list.refresh_given_taglist(data.all_tags);
                    if (!self.active_selector_is_visible()){
                        self.select_first_row()
                    }
                }
            })
            .catch(doFlash)
    }

    rename_tag(old_tag) {
        let self = this;
        showModal(`Rename tag ${old_tag}`, `New name for this tag`, RenameTag, old_tag);

        function RenameTag(new_tag) {
            self.DoTagRename(old_tag, new_tag)
        }

    }

    search_active_tag_buttons() {
        let active_tag_buttons = this.tag_button_list.get_active_tags();
        this.search_given_tags(active_tag_buttons);
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
        const visible_rows = all_selectors.filter(function() { return $(this).css("display") == "table-row" });
        if (visible_rows.length > 0) {
            this.selector_click(visible_rows[0]);
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
                    let all_manager_row = resource_managers["all_module"].get_selector_table_row(res_name, manager.res_type);
                    all_manager_row.fadeOut("slow", function () {
                        all_manager_row.remove();
                    });
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
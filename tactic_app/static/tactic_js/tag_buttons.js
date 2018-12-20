
class TagButtonList {
    constructor (manager) {
        this.manager = manager;
        this.tag_button_mode = "select";
        this.res_type = this.manager.res_type;
        self = this;
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
            self.create_button_html(data.tag_list);
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

    refresh_from_selectors() {
        let tag_list = this.get_all_selector_tags();
        this.refresh_given_taglist(tag_list)
    }

    set_expanded_folders(expanded_folder_tags) {
        for (let tag of expanded_folder_tags) {
            let but = this.get_button_from_tag(tag);
            if (but.length != 0) {
                but.removeClass("shrunk");
                but.addClass("expanded");
            }
        }
        this.compute_visibility()
    }

    refresh_given_taglist(tag_list) {
        let active_tag = this.get_active_tag();
        let expanded_folder_tags = this.get_expanded_folder_tags();
        this.create_button_html(tag_list);
        this.set_active_tag(active_tag);
        this.set_expanded_folders(expanded_folder_tags);
        this.set_edit_button_mode(this.tag_button_mode);
    }

    get_active_button () {
        return this.get_module_element(".tag-button.active");
    }

    get_active_tag() {
        const active_tag_button = this.get_active_button();
        if (active_tag_button.length == 0) {
            return "__all__"
        }
        return active_tag_button[0].dataset.fulltag
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

    tag_depth(the_tag) {
        return (the_tag.match(/\//g) || []).length;
    }

    get_expanded_folder_buttons() {
        return this.get_module_element(".tag-button-list .has_children.expanded")
    }

    get_expanded_folder_tags() {
        var exp_folders = this.get_expanded_folder_buttons();
        var exp_tags = [];
        $.each(exp_folders, function (index, but) {
            exp_tags.push(but.dataset.fulltag)
        });
        return exp_tags
    }

    subtag_visible(the_tag, expanded_folders) {
        let all_parents = this.get_parent_tags(the_tag);
        for (let parent of all_parents) {
            if (!expanded_folders.includes(parent)) {
                return false
            }
        }
        return true
    }

    compute_visibility() {
        let expanded_folders = this.get_expanded_folder_tags();
        const subtag_buttons = this.get_all_subtag_buttons();
        var self = this;
        subtag_buttons.removeClass("hideme");
        subtag_buttons.removeClass("showme");
        $.each(subtag_buttons, function (index, but) {
            const tag_text = but.dataset.fulltag;
            if (self.subtag_visible(tag_text, expanded_folders)) {
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
        this.hide_buttons(subtag_buttons.filter(".hideme"));
        this.fix_tag_button_width();
    }

    toggle_shrink_state(but) {
        but.toggleClass("shrunk expanded");
        this.compute_visibility();
    }

    tagMatch(search_tag, item_tags) {
        let tags_to_match = item_tags.concat(this.get_all_parent_tags(item_tags));
        return tags_to_match.includes(search_tag)
    }

    search_given_tag(the_tag) {
        const all_rows = this.manager.get_all_selector_buttons();
        if (the_tag == "__all__") {
            this.manager.show_table_rows(all_rows);
        }
        else {
            let self = this;
            $.each(all_rows, function (index, row_element) {
                const cells = $(row_element).children();
                const res_name = row_element.getAttribute("value").toLowerCase();
                const tag_text = $(cells.slice(-1)[0]).text().toLowerCase();
                const taglist = tag_text.split(" ");
                if (!self.tagMatch(the_tag, taglist)) {
                    $(row_element).addClass("hideme");
                    $(row_element).removeClass("showme");
                }
                else {
                    $(row_element).addClass("showme");
                    $(row_element).removeClass("hideme");
                }
            });
            this.manager.hide_table_rows(all_rows.filter(".hideme"));
            this.manager.show_table_rows(all_rows.filter(".showme"));
        }
    }

    search_active_tag() {
        const active_tag = this.get_active_tag();
        this.search_given_tag(active_tag)
    }

    set_active_button(but) {
        this.get_all_tag_buttons().removeClass("active");
        if (but != null) {
            but.addClass("active");
        }
        this.search_active_tag();
        if (!this.manager.active_selector_is_visible()){
            this.manager.select_first_row()
        }
    }

    get_button_from_tag(tag) {
        return this.get_module_element(`[data-fulltag='${tag}']`);
    }

    set_active_tag(tag) {
        let the_but = this.get_button_from_tag(tag);
        if (the_but.length == 0) {
            this.set_active_button(null)
        }
        else {
            this.set_active_button(the_but)
        }
    }

    create_button_html(tag_list) {
        let tag_button_html = `<div class="btn-group-vertical btn-group-sm" role="group">`;
        let indent_amount = 12;
        let parent_tags = this.get_all_parent_tags(tag_list);
        tag_list = tag_list.concat(parent_tags);
        tag_list = remove_duplicates(tag_list);
        tag_list.sort();

        var hcclass = "";
        var prefix = `<span style="margin-left:${indent_amount}px"></span></span><span class="tag-icon-tag fal fa-tags"></span><span class="tag-icon-tag fas fa-tags"></span>`;
        var new_html = `<button type="button" data-fulltag="__all__" class="btn btn-outline-secondary tag-button active root-tag ${hcclass} showme" style="display: block" value="${this.res_type}">${prefix}all</span></button>`;
        tag_button_html = tag_button_html + new_html + "\n";

        for (let tag of tag_list) {
            let tag_base = this.get_tag_base(tag);

            let mleft = indent_amount * this.tag_depth(tag);
            let has_children = parent_tags.includes(tag);

            if (has_children) {
                hcclass = "has_children shrunk";
                prefix = `<span class="tag-expander fal fa-caret-right" style="margin-left:${mleft}px"></span><span class="tag-expander fal fa-caret-down" style="display:none; margin-left:${mleft}px"></span><span class="tag-icon-folder fal fa-folder"></span><span class="tag-icon-folder fas fa-folder"></span>`
            }
            else {
                hcclass = "no_children";
                prefix = `<span style="margin-left:${mleft + indent_amount}px"></span></span><span class="tag-icon-tag fal fa-tag"></span><span class="tag-icon-tag fas fa-tag"></span>`
            }
            if (!this.has_slash(tag)) {
                new_html = `<button type="button" data-fulltag="${tag}" class="btn btn-outline-secondary tag-button root-tag ${hcclass} showme" style="display: block" value="${this.res_type}">${prefix}${tag_base}<span class="tag-button-delete"></span></button>`
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
        this.resize_me();
        this.manager.tag_button_drag_manager = new TagButtonDragManager(this.manager);
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

    get_all_tags() {
        const all_tag_buttons = this.get_all_tag_buttons();
        var tag_list = [];
        $.each(all_tag_buttons, function (index, but) {
             tag_list.push(but.dataset.fulltag);
         });
        return tag_list
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

    get_all_parent_tags(tag_list) {
        var ptags = [];
        for (let the_tag of tag_list){
            ptags = ptags.concat(this.get_parent_tags(the_tag))
        }
        ptags = remove_duplicates(ptags);
        return ptags
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

    get_all_children(the_tag) {
        let all_tags = this.get_all_tags();
        let child_list = [];
        for (let tag of all_tags) {
            let parents = this.get_parent_tags(tag);
            if (parents.includes(the_tag)) {
                child_list.push(tag)
            }
        }
        return child_list
    }

    find_matching_tags(tag_list) {
        const all_tag_buttons = this.get_all_tag_buttons();
        var self = this;
        var matching_tags = [];
        $.each(all_tag_buttons, function (index, but) {
            let but_tag = but.dataset.fulltag;
            let tag_base = self.get_tag_base(but_tag);
            if ((tag_list.includes(but_tag) || tag_list.includes(tag_base))) {
                matching_tags.push(but_tag)
            }
        });
        return matching_tags
    }

    get_immediate_tag_parent(the_tag) {
        let re = /\/\w*$/;
        return the_tag.replace(re, "")
    }

    is_subtag_of(the_tag, active_tags) {
        if (the_tag.search("/") == -1) {
            return false
        }
        let the_parent = this.get_immediate_tag_parent(the_tag);
        return active_tags.includes(the_parent)
    }

    show_buttons(the_tag_buttons) {
        the_tag_buttons.show("blind");
    }

    hide_buttons(the_tag_buttons) {
        the_tag_buttons.hide("blind");
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
        this.set_active_button(null)
    }
}

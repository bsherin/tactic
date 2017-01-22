/**
 * Created by bls910 on 11/1/15.
 */

function get_current_res_type() {
    const module_id_str = $(".nav-tabs .active a").attr("href");
    const reg_exp = /\#(\S*)?\-/;
    return module_id_str.match(reg_exp)[1]
}

function get_manager_outer(res_type, manager_type) {
    return $("#" + manager_type + "-" + res_type + "-outer")
}

function get_manager_dom(res_type, manager_type, selector) {
    return $("#" + manager_type + "-" + res_type + "-outer").find(selector)
}

const manager_kinds = ["resource", "repository"];

class ResourceManager {
    constructor (module_id, res_type, resource_module_template, specifics, destination_selector) {
        this.destination_selector = destination_selector;
        this.res_type = res_type;
        this.module_id = module_id;


        this.popup_buttons = [];
        this.buttons=[];
        this.file_adders = [];

        Object.assign(this, specifics);
        this.set_extra_properties();
        this.textify_button_names();
        this.resource_module_template = resource_module_template;
        this.create_module_html();
        this.add_listeners()
    }

    set_extra_properties() {
        this.include_metadata = false;
        this.start_hidden = false;
        self.include_search_toolbar = true;
    }

    add_listeners() {
        for (let bgroup of this.button_groups) {
            for (let value of bgroup.buttons) {
                this.bind_button(value);
            }
        }
        let self = this;
        $.each(this.file_adders, function(index, value) {
            self.bind_form(value)
            }
        );

        $.each(self.popup_buttons, function (index, value) {
            $.each(value.option_list, function (index, opt) {
                self.bind_option({"name": opt.opt_name, "func": opt.opt_func}, "resource")
            })
        });

        this.bind_standard_button(".search-resource-button", this.search_my_resource);
        this.bind_standard_button(".search-tags-button", this.search_my_tags);
        this.bind_standard_button(".resource-unfilter-button", this.unfilter_me);
        this.bind_standard_button(".save-metadata-button", this.save_my_metadata);
    }


    bind_standard_button(bselector, func) {
        this.get_module_dom().on("click", bselector, func.bind(this));
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

    get_module_dom() {
        return $("#" + this.module_id)
    }

    get_main_content_row() {
        return this.get_module_element(".main-content-row")
    }

    get_module_element(selector) {
        return this.get_module_dom().find(selector)
    }

    get_main_content_dom () {
        return this.get_module_element(".main-content")
    }


    get_resource_table () {
        return this.get_module_element(".main-content table")
    }

    get_button(name) { // not currently used
        const button_value = name + "-" + this.res_type;
        return this.get_module_element(`button[value='${button_value}']`)
    }

    get_form(name){ // not currently used
        const form_value = name + "-" + this.res_type + "-form";
        return this.get_module_element(`form[value='${form_value}']`)
    }

    get_created_field() {
        return this.get_module_element(".created");
    }

    get_notes_field() {
        return this.get_module_element(".notes-field")
    }

    get_tags_field() {
         return this.get_module_element(".tags-field")
    }

    get_search_field() {
        return this.get_module_element(".search-field")
    }

    get_search_button() {
        return this.get_module_element(".search-resource-button")
    }

    get_active_selector_button() {
        return this.get_module_element(".selector-button.active");
    }

    get_all_selector_buttons() {
        return this.get_module_element(".selector-button")
    }

    get_named_selector_button(name) {
        return this.get_module_element(`.selector-button[value='${name}']`)
    }

    get_all_tag_buttons () {
        return this.get_module_element(".tag-button-list button")
    }

    get_aux_left_dom () {
        return this.get_module_element(".aux-left")
    }

    get_aux_right_dom () {
        return this.get_module_element(".aux-right")
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
      for (i=0; i < this.file_adders.length; ++i) {
          but = this.file_adders[i];
          but_text = but["name"].replace(/_/g, ' ');
          this.file_adders[i]["name_text"] = but_text
      }
    }

    create_module_html () {
        let res = Mustache.to_html(this.resource_module_template, this);
        $(this.destination_selector).append(res);
        this.update_main_content();
        this.update_aux_content();
    }

    update_aux_content() {

    }

    selector_click(row_element) {
        const res_name = row_element.getAttribute("value");
        const result_dict = {"res_type": this.res_type, "res_name": res_name};
        this.get_all_selector_buttons().removeClass("active");
        const self = this;
        this.get_all_selector_buttons().removeClass("active");
        if (this.include_metadata) {
            postAjaxPromise("grab_metadata", result_dict)
            .then(got_metadata)
            .catch(got_metadata)
        }

        $(row_element).addClass("active");

        function got_metadata(data) {
            if (data.success) {
                self.set_resource_metadata(data.datestring, data.tags, data.notes);
            }
            else {
                // doFlash(data)
                self.clear_resource_metadata()
            }
        }
    }

    select_resource_button(res_name) {
        if (res_name == null) {
            const all_selectors = this.get_all_selector_buttons();
            if (all_selectors.length > 0) {
                this.selector_click(all_selectors[0]);
            }
            else {
                this.clear_resource_metadata(manager_kind)
            }
        }
        else {
            this.get_main_content_dom().scrollTop(this.get_named_selector_button(res_name).position().top);
            this.selector_click(this.get_named_selector_button(res_name)[0])
        }
    }

    // metadata related functions

   clear_resource_metadata() {
        this.set_resource_metadata("", "", "")
    }

    set_resource_metadata(created, tags, notes) {
        this.get_created_field().html(created);
        this.get_tags_field().html("");
        this.get_tags_field()[0].value = tags;
        this.get_notes_field().html("");
        this.get_notes_field()[0].value = notes;
    }

    save_my_metadata () {
        const res_name = this.get_active_selector_button().attr("value");
        const tags = this.get_tags_field().val();
        const notes = this.get_notes_field().val();
        const result_dict = {"res_type": this.res_type, "res_name": res_name, "tags": tags, "notes": notes};
        const self = this;
        postAjaxPromise("save_metadata", result_dict)
            .then(function(data) {
                self.get_active_selector_button().children()[3].innerHTML = tags;
                doFlash(data)
            })
            .catch(doFlash)
    }


    // Search, tag button

   search_my_resource  () {
        const manager_kind = "resource";
        const txt = this.get_search_field(manager_kind)[0].value.toLowerCase();
        const all_rows = this.get_all_selector_buttons(manager_kind);
        $.each(all_rows, function (index, row_element) {
            const cells = $(row_element).children();
            let found = false;
            for (let i = 0; i < cells.length; i+=1) {
                let cell_text = $(cells[i]).text().toLowerCase();
                if (cell_text.search(txt) != -1) {
                    found = true;
                    break;
                }
            }
            if (found) {
                $(row_element).show()
            }
            else {
                $(row_element).hide()
            }
        })
    }

    search_my_tags() {
        const txt = this.get_search_field()[0].value.toLowerCase();
        this.search_given_tag(txt);
        this.show_hide_tag_buttons(txt)
    }

    create_tag_buttons(url_string) {
        const self = this;
        $.getJSON(`${$SCRIPT_ROOT}/${url_string}/${this.res_type}`, function (data) {
            self.fill_tag_buttons(data.html, null);
        })
    }

    fill_tag_buttons(manager_kind, the_html) {
        this.get_aux_left().append(the_html)
    }

    refresh_tag_buttons(the_html) {
        let active_tag_button = this.get_active_tag_button();
        manager.fill_tag_buttons(the_html);
        manager.set_tag_button_state(active_tag_button);
    }

    unfilter_me () {
        const all_rows = this.get_all_selector_buttons();
        $.each(all_rows, function (index, row_element) {
                $(row_element).show()
        });
        this.deactivate_tag_buttons();
        this.show_all_tag_buttons()
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
}

function selector_click(event) {
    const row_element = $(event.target).closest('tr');
    resource_managers[get_current_res_type()].selector_click(row_element[0])

}

function selector_double_click(event) {
    const row_element = $(event.target).closest('tr');
    const res_type = get_current_res_type();

    manager.get_all_selector_buttons().removeClass("active");
    row_element.addClass("active");
    manager[manager.double_click_func]({})
}

function tag_button_clicked(event) {
    const res_type = event.target.value;
    const txt = event.target.innerHTML;
    resource_managers[res_type].search_given_tag( txt)
}

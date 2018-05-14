/**
 * Created by bls910 on 11/1/15.
 */

MARGIN_SIZE = 50;

function get_current_res_type() {
    const module_id_str = $("#nav-list a.active").attr("href");
    // noinspection RegExpRedundantEscape
    const reg_exp = /\#(\S*?)\-module/;
    return module_id_str.match(reg_exp)[1]
}

class ResourceManager {
    constructor (module_id, res_type, resource_module_template, destination_selector, class_string="", extras_dict=null, include_right=true, include_markdown=true) {
        this.destination_selector = destination_selector;
        this.res_type = res_type;
        this.module_id = module_id;
        this.include_right = include_right;

        // These additional parameters are relevant to the rendering of the template
        this.include_metadata = false;
        this.include_above_main_area = false;
        this.include_button_well = true;
        this.start_hidden = false;
        this.is_repository = false;
        this.include_search_toolbar = true;
        this.include_tags_search = true;
        this.popup_buttons = [];
        this.button_groups = [];
        this.file_adders = [];
        this.aux_left = false;
        this.aux_right = false;
        this.extras_dict = extras_dict;
        this.set_extra_properties();
        this.textify_button_names();
        this.resource_module_template = resource_module_template;
        this.class_string = class_string;
        this.create_module_html();
        this.add_listeners();
        if (include_right) {
            this.update_width(.5);
        }
        else {
            this.update_width(1.0)
        }
        this.handling_selector_click = false;
        if (include_markdown) {
            this.markdown_helper = new MarkdownHelper(".notes-field", ".notes-field-markdown-output");
        }
        let self = this;
    }


    update_width(new_width_fraction) {
        const usable_width = window.innerWidth - 2 * MARGIN_SIZE - 30;
        this.current_width_fraction = new_width_fraction;
        this.get_left_div().width(usable_width * new_width_fraction);
        if (this.include_right) {
            this.get_right_div().width((1 - new_width_fraction) * usable_width)
        }

    }

    turn_on_horizontal_resize () {
        let self = this;
        this.get_left_div().resizable({
            handles: "e",
            resize: function (event, ui) {
                const usable_width = window.innerWidth - 2 * MARGIN_SIZE - 30;
                let new_width_fraction = 1.0 * ui.size.width / usable_width;
                ui.position.left = ui.originalPosition.left;
                self.update_width(new_width_fraction)
            }
        });
    }

    turn_off_horizontal_resize () {
        if (this.get_left_div().resizable("instance") != undefined) {
            this.get_left_div().resizable("destroy")
        }
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
        this.update_width(this.current_width_fraction)
    }


    set_extra_properties() { }

    create_module_html () {
        let res = Mustache.to_html(this.resource_module_template, this);
        $(this.destination_selector).append(res);
        this.update_main_content();
        this.update_aux_content();
    }

    update_main_content() { }

    update_aux_content() { }



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

        if (this.include_search_toolbar) {
            this.bind_standard_button(".search-resource-button", this.search_my_resource);
            this.bind_standard_button(".resource-unfilter-button", this.unfilter_me);
            this.bind_standard_button(".save-metadata-button", function () {
                self.save_my_metadata (false)
            });
            if (this.include_tags_search) {
                this.bind_standard_button(".search-tags-button", this.search_my_tags);
                this.bind_standard_button(".tags-unfilter-button", this.unfilter_tags);
            }
        }
        // this.get_tags_field().blur(function () {
        //     self.save_my_metadata(false)
        // });

    }

    bind_standard_button(bselector, func) {
        this.get_module_dom().on("click", bselector, func.bind(this));
    }

    bind_button (value) {
        const button_value = value.name + "-" + this.res_type;
        const bselector = `button[value='${button_value}']`;
        this.get_module_dom().on("click", bselector, {"manager": this}, this[value.func])
    }

    bind_option (value) {
        const button_value = value.name + "-" + this.res_type;
        const bselector = `a[value='${button_value}']`;
        this.get_module_dom().on("click", bselector, {"manager": this}, this[value.func])
    }

    bind_form (value) {
        const form_value = value.name + "-" + this.res_type + "-form";
        const fselector = `form[value='${form_value}']`;
        this.get_module_dom().on("submit", fselector, {"manager": this}, this[value.func])
    }

    // Functions to access the various parts of a resource manager dom

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

    get_left_div () {
        return this.get_module_element(".left-div")
    }

    get_right_div () {
        return this.get_module_element(".right-div")
    }


    get_resource_table () {
        return this.get_module_element(".main-content table")
    }

    get_button(name) { // not currently used
        const button_value = name + "-" + this.res_type;
        return this.get_module_element(`button[value='${button_value}']`)
    }

    get_selector_table_row(name) {
        return this.get_module_element(`tr[value='${name}']`)
    }

    get_form(name){ // not currently used
        const form_value = name + "-" + this.res_type + "-form";
        return this.get_module_element(`form[value='${form_value}']`)
    }

    get_created_field() {
        return this.get_module_element(".created");
    }


    get_tags_field() {
         return this.get_module_element(".tags-field")
    }

    get_additional_mdata_field() {
        return this.get_module_element(".additional-mdata")
    }

    get_search_field() {
        return this.get_module_element(".search-field")
    }

    get_search_tags_field() {
        return this.get_module_element(".search-tags-field")
    }

    get_search_tags_editor() {
        return this.get_module_element(".search-toolbar .tag-editor")
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

    get_aux_left_dom () {
        return this.get_module_element(".aux-left")
    }

    get_aux_right_dom () {
        return this.get_module_element(".aux-right")
    }

    active_selector_is_visible() {
        return this.get_active_selector_button().css("display") != "none"
    }

    // a couple of utility functions

    textify_button_names () {
        let but_text;
        for (let bgroup of this.button_groups) {
            for (let but of bgroup.buttons) {
                  but_text = but["name"].replace(/_/g, ' ');
                  but["name_text"] = but_text
              }
        }
        for (let but of this.popup_buttons) {
          but_text = but["name"].replace(/_/g, ' ');
          but["name_text"] = but_text
        }
        for (let but of this.file_adders) {
          but_text = but["name"].replace(/_/g, ' ');
          but["name_text"] = but_text
        }
    }

    selector_click(row_element) {
        if (!this.handling_selector_click) {  // We want to make sure we are not already processing a click
            this.handling_selector_click = true;
            const res_name = row_element.getAttribute("value");
            const result_dict = {"res_type": this.res_type, "res_name": res_name, "is_repository": this.is_repository};
            this.get_all_selector_buttons().removeClass("active");
            const self = this;
            if (this.include_metadata) {
                postAjaxPromise("grab_metadata", result_dict)
                    .then(got_metadata)
                    .catch(got_metadata)
            }
            else {
                self.handling_selector_click = false
            }

            $(row_element).addClass("active");

            function got_metadata(data) {
                if (data.success) {
                    self.set_resource_metadata(data.datestring, data.tags, data.notes, data.additional_mdata);
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

    go_to_next_row() {
        let rindex = this.get_active_selector_button()[0].rowIndex;
        if (rindex < this.get_all_selector_buttons().length) {
            let sbs = this.get_all_selector_buttons();
            this.selector_click(sbs[rindex]) // Note that rindex is already one larger because of heading row
        }
    }

    go_to_previous_row() {
        let rindex = this.get_active_selector_button()[0].rowIndex;
        if (rindex > 1) {
            let sbs = this.get_all_selector_buttons();
            this.selector_click(sbs[rindex - 2]) // Note that rindex is already one larger because of heading row
        }
    }

    select_resource_button(res_name) {
        if (res_name == null) {
            const all_selectors = this.get_all_selector_buttons();
            if (all_selectors.length > 0) {
                this.selector_click(all_selectors[0]);
            }
            else {
                this.clear_resource_metadata()
            }
        }
        else {
            this.get_main_content_dom().scrollTop(this.get_named_selector_button(res_name).position().top);
            this.selector_click(this.get_named_selector_button(res_name)[0])
        }
    }

    // metadata related functions

   clear_resource_metadata() {
        this.set_resource_metadata("", "", "", {})
    }

    set_resource_metadata(created, tags, notes, additional_mdata) {
        this.get_created_field().html(created);
        this.get_tags_field().html("");
        this.get_tags_field()[0].value = tags;
        this.markdown_helper.setNotesValue(this.get_module_dom(), notes);
    }

    save_my_metadata (flash = false) {
        const res_name = this.get_active_selector_button().attr("value");
        const tags = this.get_tags_field().val();
        const notes = this.markdown_helper.getNotesValue(this.get_module_dom());
        const result_dict = {"res_type": this.res_type, "res_name": res_name, "tags": tags, "notes": notes};
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

    // Search

   search_my_resource  () {
        const txt = this.get_search_field()[0].value.toLowerCase();
        const all_rows = this.get_all_selector_buttons();
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

    unfilter_me () {
        const all_rows = this.get_all_selector_buttons();
        all_rows.show();
    }

    unfilter_tags () {
        const all_rows = this.get_all_selector_buttons();
        all_rows.show();
    }

    search_my_tags () {}

}

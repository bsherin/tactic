/**
 * Created by bls910 on 11/1/15.
 */


class AdminResourceManager extends ResourceManager {

    create_module_html () {
        this.is_repository = false;
        this.is_not_repository = true;
        this.include_metadata = false;
        this.show_loaded_list = false;
        this.show_aux_area = true;
        this.prefix = "resource";
        let res = Mustache.to_html(this.resource_module_template, this);
        $("#" + this.res_type + "-module").html(res);
        this.update_selector("resource");
    }

    set_extra_properties () {
        ;
    }

    add_listeners () {
        for (let bgroup of this.button_groups) {
            for (let value of bgroup.buttons) {
                this.bind_button(value, "resource");
            }
        }
    }

    update_selector(manager_kind) {
        const self = this;
        let url_string = "request_update_admin_selector_list";
        $.getJSON(`${$SCRIPT_ROOT}/${url_string}/${this.res_type}`, function (data) {
            self.fill_selector(manager_kind, data.html, null);
        })
    }

    selector_click(row_element) {
        const res_name = row_element.getAttribute("value");
        const result_dict = {"res_type": this.res_type, "res_name": res_name};
        let manager_kind = "resource";
        this.get_all_selector_buttons(manager_kind).removeClass("active");
        const self = this;

        $(row_element).addClass("active");

    }

    clear_resource_metadata(manager_kind) {
        ;
    }

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

}

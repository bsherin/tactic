/**
 * Created by bls910 on 11/1/15.
 */


class AdminResourceManager extends ResourceManager {

    set_extra_properties () {
        this.include_metadata = false;
        this.include_search_toolbar = true;
        this.aux_right = true
    }

    add_listeners () {
        for (let bgroup of this.button_groups) {
            for (let value of bgroup.buttons) {
                this.bind_button(value, "resource");
            }
        }
    }

    update_main_content() {
        const self = this;
        let url_string = "request_update_admin_selector_list";
        $.getJSON(`${$SCRIPT_ROOT}/${url_string}/${this.res_type}`, function (data) {
            self.fill_content(data.html);
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


    clear_resource_metadata(manager_kind) {
        ;
    }

}

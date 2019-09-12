/**
 * Created by bls910 on 11/1/15.
 */


class AdminResourceManager extends ResourceManager {

    set_extra_properties () {
        this.include_metadata = false;
        this.include_search_toolbar = true;
        this.include_tags_search = false;
        this.aux_right = true
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
        const updated_header = this.get_main_content_dom().find("table th").slice(-1)[0];
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

    clear_resource_metadata() {

    }

}

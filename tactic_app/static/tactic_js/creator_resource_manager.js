/**
 * Created by bls910 on 11/1/15.
 */


class CreatorResourceManager extends ResourceManager {

    set_extra_properties () {
        this.include_metadata = false;
        this.include_search_toolbar = false;
        this.aux_right = false;
        this.change = false;
    }

    update_main_content () {
        let data = {};
        data[this.data_attr] = this[this.data_attr];
        rebuild_autocomplete_list();
        let self = this;
        postAjaxPromise(this.update_view, data)
            .then(function (result) {
                    self.fill_content(result.html);
                    self.select_resource_button(null);
                })
            .catch(doFlash)
    }

    fill_content(the_html) {
        this.get_main_content_dom().html(the_html);
        if (this.get_resource_table().length > 0) {
            sorttable.makeSortable(this.get_resource_table()[0]);
            const updated_header = this.get_main_content_dom().find("table th")[0];
            sorttable.innerSortFunction.apply(updated_header, []);
        }
    }

    check_for_selection () {
        const res_name = this.get_active_selector_button().attr("value");
        if (res_name == "") {
            doFlash({"message": `Select a ${this.res_type} first.`, "alert_type": "alert-info"})
        }
        return res_name
    }

    clear_resource_metadata() {}

}

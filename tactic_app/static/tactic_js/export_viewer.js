/**
 * Created by bls910 on 2/4/17.
 */

let exportViewerObject = null;

class exportViewerObjectClass {
    constructor () {
        this.update_width(.5);
        this.current_export = null;
        this.add_listeners();
        this.update_exports_popup();
    }

    get exports_panel () {
        return $("#exports-panel")
    }

    get exports_body () {
        return $("#exports-body")
    }

    get exports_heading () {
        return $("#exports-heading")
    }

    get exports_popup () {
        return $("#exports-popup")
    }

    update_exports_popup() {
        let self = this;
        postWithCallback(main_id, "get_exports_list_html", {}, function (data) {
            self.populate_exports(data.the_html)
        })
    }

    populate_exports(new_html) {
        this.exports_popup.html(new_html)
    }

    get exports_info () {
        return $("#exports-info")
    }

    get exports_keys () {
        return $("#exports-keys");
    }

    populate_keys(new_html) {
        this.exports_keys.html(new_html)
    }

    set_exports_info(new_info) {
        self.exports_info.html(new_info);
    }

    get exports_tail () {
        return $("#exports-tail")
    }

    set_exports_tail(new_tail) {
        self.exports_tail.html(new_tail);
    }

    update_width(new_width_fraction) {
        const usable_width = window.innerWidth - 2 * MARGIN_SIZE - 30;
        this.exports_panel.width(usable_width * new_width_fraction)
    }

    update_height(hgt) {
        this.exports_body.outerHeight(hgt - this.exports_heading.outerHeight())
    }

    add_listeners () {
        let self = this;
        this.exports_popup.change(function () {
            self.set_new_export(this.value)
        })
    }

    set_new_export(new_export) {
        this.current_export = new_export;
        let self = this;
        postWithCallback(main_id, "get_export_info", {"export_name": new_export}, function (data) {
            self.current_type = data.type;
            self.set_exports_info(data.info_string);
            self.set_exports_tail("");
            if (data.hasOwnProperty("keys_html")) {
                self.exports_keys.css("display", "inline-block");
                self.populate_keys("keys_html")
            }
            else {
                self.exports_keys.css("display", "none");
            }

        })
    }

    turn_on_horizontal_resize () {
        self = this;
        this.exports_panel.resizable({
                handles: "w",
                resize: function (event, ui) {
                    const usable_width = window.innerWidth - 2 * MARGIN_SIZE - 30;
                    new_width_fraction = 1.0 * ui.size.width / usable_width;
                    self.update_width(new_width_fraction)
                    consoleObject.update_width(1 - new_width_fraction)
                }
            });
    }

    turn_off_horizontal_resize() {
        this.exports_panel.resizable('destroy')
    }
}
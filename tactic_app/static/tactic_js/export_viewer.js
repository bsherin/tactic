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
        this.export_list = [];
        this.key_list = null
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

    get exports_show_button() {
        return $("#exports-show-button")
    }

    get exports_refresh_button() {
        return $("#exports-refresh-button")
    }

    get exports_send_console_button() {
        return $("#exports-send-console-button")
    }

    get exports_popup () {
        return $("#exports-popup")
    }

    update_exports_popup() {
        let self = this;
        postWithCallback(main_id, "get_exports_list_html", {}, function (data) {
            self.populate_exports(data.the_html);
            self.export_list = data.export_list;
            self.set_exports_popup(self.current_export);
            let new_export = self.exports_popup.val();
            if (new_export != self.current_export) {
                self.set_new_export(new_export)
            }

        })
    }

    set_exports_popup (the_val) {
        if ((self.current_export == null) || (exports.indexOf(the_val) == -1)) {
            this.exports_popup.val(this.export_list[0])
        }
        else {
            this.exports_popup.val(the_val)
        }

    }

    populate_exports(new_html) {
        this.exports_popup.html(new_html)
    }

    get exports_info () {
        return $("#exports-info")
    }

    get exports_keys () {
        return $("#keys-popup");
    }

    populate_keys(new_html) {
        this.exports_keys.html(new_html)
    }

    set_exports_keys(the_val) {
        this.exports_keys.val(the_val)
    }

    set_exports_info(new_info) {
        this.exports_info.html(new_info);
    }

    get exports_tail () {
        return $("#exports-tail")
    }

    set_exports_tail(new_tail) {
        this.exports_tail.html(new_tail);
    }

    update_width(new_width_fraction) {
        const usable_width = window.innerWidth - 2 * MARGIN_SIZE - 30;
        this.current_width_fraction = new_width_fraction;
        this.exports_panel.width(usable_width * new_width_fraction)
    }

    resize_to_window() {
        this.update_width(this.current_width_fraction)
    }

    update_height(hgt) {
        this.exports_body.outerHeight(hgt - this.exports_heading.outerHeight())
    }

    add_listeners () {
        let self = this;
        this.exports_refresh_button.click(function () {
            self.set_new_export(self.exports_popup.val())
        });

        this.exports_popup.change(function () {
            self.set_new_export(this.value)
        });
        this.exports_show_button.click(function ()  {
            self.show_value()
        });
        this.exports_send_console_button.click(function () {
            self.send_to_console()
        });
        this.exports_tail.keypress(function(e) {
            if (e.which == 13) {
                self.show_value();
                e.preventDefault();
            }
        });

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
                self.populate_keys(data.keys_html);
                self.set_exports_keys(data.key_list[0]);
                self.key_list = data.key_list
            }
            else {
                self.exports_keys.css("display", "none");
                self.key_list = null
            }

        })
    }

    show_value() {
        const tail = this.exports_tail.val();
        let send_data = {"export_name": this.current_export, "tail": tail}
        if (!(this.key_list == null)) {
            send_data["key"] = this.exports_keys.val()
        }
        let self = this;
        postWithCallback(main_id, "evaluate_export", send_data, function (data) {
            self.exports_body.html(data.the_html)
        })
    }

    send_to_console() {
        const tail = this.exports_tail.val();
        let full_export_name = this.current_export;
        if (!(this.key_list == null)) {
            full_export_name = full_export_name +`[${this.exports_keys.val()}]`
        }
        full_export_name = full_export_name + tail;
        consoleObject.addConsoleCodeWithCode(`self.get_pipe_value("${full_export_name}")`)
    }

}
/**
 * Created by bls910 on 1/24/17.
 * This class corresponds to one of the windows for viewing and editing
 * the contents of a resource.
 */

MARGIN_SIZE = 17;

class ResourceViewer {
    constructor(resource_name, res_type, get_url) {
        this.resource_name = resource_name;
        this.res_type = res_type;
        this.mousetrap = new Mousetrap();
        this.savedContent = null;
        this.do_extra_setup();
        let self = this;
        this.mousetrap.bind(['command+s', 'ctrl+s'], function (e) {
            self.saveMe();
            e.preventDefault()
        });
        this.bind_buttons();
        $("#rename-button").click(this.rename_me.bind(this));
        if (include_right) {
            this.update_width(.5);
            this.turn_on_horizontal_resize()
        }
        else {
            this.update_width(1.0)
        }
        self = this;
        window.onresize = function () {
            self.resize_to_window()
        };
        postAjaxPromise(`${get_url}/${resource_name}`, {})
            .then(function (data) {
                self.got_resource(data.the_content)
            })
            .catch(doFlash);
    }

    update_width(new_width_fraction) {
        const usable_width = window.innerWidth - 2 * MARGIN_SIZE - 30;
        this.current_width_fraction = new_width_fraction;
        this.left_div.width(usable_width * new_width_fraction);
        if (include_right) {
            this.right_div.width((1 - new_width_fraction) * usable_width)
        }

    }

    get left_div() {
        return $("#left-div")
    }

    get right_div() {
        return $("#right-div")
    }

    turn_on_horizontal_resize () {
        self = this;
        this.left_div.resizable({
            handles: "e",
            resize: function (event, ui) {
                const usable_width = window.innerWidth - 2 * MARGIN_SIZE - 30;
                let new_width_fraction = 1.0 * ui.size.width / usable_width;
                // self.update_width(new_width_fraction)
                ui.position.left = ui.originalPosition.left;
                self.update_width(new_width_fraction)
            }
        });
    }

    resize_to_window() {
        resize_dom_to_bottom_given_selector("#main_content", 40);
        this.update_width(this.current_width_fraction)
    }


    set_metadata_fields(created, tags, notes) {
        $(".created").html(created);
        $("#tags")[0].value = tags;
        $("#notes")[0].value = notes;
        this.savedTags = tags;
        this.savedNotes = notes;
    }

    bind_buttons() {
        for (let but_name in this.button_bindings) {
            const bselector = `button[value='${but_name}']`;
            $(bselector).click(this.button_bindings[but_name].bind(this))
        }
    }

    do_extra_setup() {
    };
    get button_bindings() {
    };

    get_current_content() {
    };

    construct_html_from_the_content(the_content) {
    };

    saveMe() {
    };

    saveMeAs() {
    };

    set_main_content(the_content) {
        $("#main_content").html(the_content)
    }

    got_resource(the_content) {
        this.saved_content = the_content;
        let the_html = this.construct_html_from_the_content(the_content);
        this.set_main_content(the_html);
        resize_dom_to_bottom_given_selector("#main_content", 40);

        let result_dict = {"res_type": this.res_type, "res_name": this.resource_name};
        let self = this;
        postAjaxPromise("grab_metadata", result_dict)
            .then(function (data) {
                self.set_metadata_fields(data.date_string, data.tags, data.notes)
            })
            .catch(function () {
                self.set_metadata_fields("", "", "")
            })
    }

    rename_me() {
        console.log("entering rename");
        self = this;
        $.getJSON($SCRIPT_ROOT + `get_resource_names/${this.res_type}`, function (data) {
                const res_names = data["resource_names"];
                const index = res_names.indexOf(self.resource_name);
                if (index >= 0) {
                    res_names.splice(index, 1);
                }
                showModal(`Rename ${self.res_type}`, `Name for this ${self.res_type}`, RenameResource, self.resource_name, res_names)
            }
        );
        function RenameResource(new_name) {
            const the_data = {"new_name": new_name};
            postAjax(`rename_resource/${self.res_type}/${self.resource_name}`, the_data, renameSuccess);
            function renameSuccess(data) {
                if (data.success) {
                    self.resource_name = new_name;
                    $("#rename-button").text(self.resource_name)
                }
                else {
                    doFlash(data);
                    return false
                }

            }
        }
    }

    sendToRepository() {
        self = this;
        $.getJSON($SCRIPT_ROOT + `get_repository_resource_names/${this.res_type}`, function(data) {
            showModal(`Share ${self.res_type}`, `New ${self.res_type} Name`, ShareResource, self.resource_name, data["resource_names"])
            }
        );
        function ShareResource(new_name) {
            const result_dict = {
                "res_type": self.res_type,
                "res_name": self.resource_name,
                "new_res_name": new_name
            };
            postAjax("send_to_repository", result_dict, doFlashAlways)
        }
    }

    copyToLibrary() {
        self = this;
        $.getJSON($SCRIPT_ROOT + `get_resource_names/${this.res_type}`, function(data) {
            showModal(`Import ${self.res_type}`, `New ${self.res_type} Name`, ImportResource, self.resource_name, data["resource_names"])
            }
        );
        function ImportResource(new_name) {
            const result_dict = {
                "res_type": self.res_type,
                "res_name": self.resource_name,
                "new_res_name": new_name
            };
            postAjax("copy_from_repository", result_dict, doFlashAlways);
        }
    }

    dirty() {
        let current_content = this.get_current_content();
        const tags = $("#tags").val();
        const notes = $("#notes").val();
        return !((current_content == this.saved_content) && (tags == this.savedTags) && (notes == this.savedNotes))
    }
}

/**
 * Created by bls910 on 1/24/17.
 * This class corresponds to one of the windows for viewing and editing
 * the contents of a resource.
 */

MARGIN_SIZE = 17;

let this_viewer;
let tsocket;

class ResourceViewerSocket extends TacticSocket {
    initialize_socket_stuff() {
        this.socket.emit('join', {"room": user_id});
        this.socket.emit('join-main', {"room": resource_viewer_id});
        this.socket.on('handle-callback', handleCallback);
        this.socket.on('stop-spinner', stopSpinner);
        this.socket.on('start-spinner', startSpinner);
        this.socket.on('close-user-windows', (data) => {
            if (!(data["originator"] == resource_viewer_id)) {
                window.close()
            }
        });
        this.socket.on("doFlash", function(data) {
            doFlash(data)
        });
    }
}

class ResourceViewer {
    constructor(resource_name, res_type, get_url) {
        this_viewer = this;
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
        if (get_url) {
            tsocket = new ResourceViewerSocket("main", 5000);
            postAjaxPromise(`${get_url}/${resource_name}`, {})
                .then(function (data) {
                    self.got_resource(data.the_content)
                })
                .catch(doFlash);
        }
        this.meta_outer = $("#right-div");
        this.markdown_helper = new MarkdownHelper("#notes", "#notes-field-markdown-output");
        $("#notes").blur(function () {
            self.markdown_helper.convertMarkdown(self.meta_outer);
        });

        $("#notes-field-markdown-output").click(function (e) {
            e.preventDefault();
            self.markdown_helper.hideMarkdown(self.meta_outer);
            self.markdown_helper.focusNotes(self.meta_outer)
        })
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
        let self = this;
        this.left_div.resizable({
            handles: "e",
            resize: function (event, ui) {
                const usable_width = window.innerWidth - 2 * MARGIN_SIZE - 30;
                let new_width_fraction = 1.0 * ui.size.width / usable_width;
                ui.position.left = ui.originalPosition.left;
                self.update_width(new_width_fraction)
            }
        });
    }

    resize_to_window() {
        resize_dom_to_bottom_given_selector("#main_content", 40);
        resize_dom_to_bottom_given_selector("#right-div", 40);
        this.update_width(this.current_width_fraction);
        // this.markdown_helper.updateMarkdownHeight(this.meta_outer, "#metadata-module-outer");
    }

    get_tags_field() {
        return $("#tags")
    }

    get_tags() {
        return this.get_tags_field().tagEditor('getTags')[0].tags
    }

    get_tags_string() {
        let taglist = this.get_tags();
        let tags = "";
        for (let tag of taglist) {
            tags = tags + tag + " "
        }
        return tags.trim();
    }

    remove_all_tags() {
        let tags = this.get_tags();
        for (let i = 0; i < tags.length; i++) {
            this.get_tags_field().tagEditor('removeTag', tags[i]);
        }
    }

    create_tag_editor(initial_tag_list) {
        let self = this;
        let data_dict = {"res_type": this.res_type, "is_repository": false};
        postAjaxPromise("get_tag_list", data_dict)
            .then(function(data) {
                let all_tags = data.tag_list;
                self.get_tags_field().tagEditor({
                    initialTags: initial_tag_list,
                    forceLowercase: true,
                    autocomplete: {
                        delay: 0, // show suggestions immediately
                        position: { collision: 'flip' }, // automatic menu position up/down
                        source: all_tags
                    },
                    placeholder: "Tags...",});
            })
            .catch(doFlash)
    }

    set_tag_list(tagstring) {
        this.get_tags_field().tagEditor('destroy');
        this.get_tags_field().html("");
        let taglist = tagstring.split(" ");
        this.create_tag_editor(taglist);
    }

    set_metadata_fields(created, tags, notes) {
        $("#created").html(created);
        this.set_tag_list(tags);
        this.markdown_helper.setNotesValue(this.meta_outer, notes);
        this.savedTags = tags;
        this.savedNotes = notes;
        this.markdown_helper.convertMarkdown(this.meta_outer);
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

        let result_dict = {"res_type": this.res_type, "res_name": this.resource_name, "is_repository": false};
        let self = this;
        postAjaxPromise("grab_metadata", result_dict)
            .then(function (data) {
                self.set_metadata_fields(data.datestring, data.tags, data.notes)
            })
            .catch(function () {
                self.set_metadata_fields("", "", "")
            })
    }

    rename_me() {
        console.log("entering rename");
        let self = this;
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
        let self = this;
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
        let self = this;
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
        const tags = this.get_tags_string();
        const notes = this.markdown_helper.getNotesValue(this.meta_outer);
        return !((current_content == this.saved_content) && (tags == this.savedTags) && (notes == this.savedNotes))
    }
}

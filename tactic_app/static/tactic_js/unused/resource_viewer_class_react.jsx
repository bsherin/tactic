/**
 * Created by bls910 on 1/24/17.
 * This class corresponds to one of the windows for viewing and editing
 * the contents of a resource.
 */


const MARGIN_SIZE = 17;

let this_viewer;
let tsocket;

import {Toolbar} from "./react_toolbar.js"
import {CombinedMetadata} from "./react_mdata_fields.js";

export {ResourceViewer, ResourceviewerToolbar}

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

class Namebutton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {"current_name": props.resource_name};
        this.rename_me = this.rename_me.bind(this)
    }

    rename_me() {
        console.log("entering rename");
        var self = this;
        var res_type = this.props.res_type;
        var current_name = this.state.current_name;
        $.getJSON($SCRIPT_ROOT + `get_resource_names/${res_type}`, function (data) {
                const res_names = data["resource_names"];
                const index = res_names.indexOf(current_name);
                if (index >= 0) {
                    res_names.splice(index, 1);
                }
                showModal(`Rename ${res_type}`, `Name for this ${res_type}`, RenameResource, current_name, res_names)
            }
        );
        function RenameResource(new_name) {
            const the_data = {"new_name": new_name};
            postAjax(`rename_resource/${res_type}/${current_name}`, the_data, renameSuccess);
            function renameSuccess(data) {
                if (data.success) {
                    self.props.resource_name = new_name;
                    self.setState({"current_name": new_name});
                }
                else {
                    doFlash(data);
                    return false
                }

            }
        }
    }

    render() {
        return (<button id="rename-button"
                        type="button"
                        className="btn btn-outline-secondary res-name-button"
                        onClick={this.rename_me}>
                {this.state.current_name}
            </button>
        )
    }
}

function ResourceviewerToolbar(props) {
    return (
        <span>
            <Toolbar button_groups={props.button_groups}/>
            <Namebutton resource_name={props.resource_name}
                        res_type={props.res_type}/>
        </span>
    )
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
        let domContainer = document.querySelector('#toolbar-place');
        ReactDOM.render(<ResourceviewerToolbar button_groups={this.button_groups}
                                               resource_name={this.resource_name}
                                               resource_viewer={this}/>, domContainer);

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

    get_tags() {
        return this.combined_meta.tags
    }

    get_tags_string() {
        let taglist = this.get_tags();
        let tags = "";
        for (let tag of taglist) {
            tags = tags + tag + " "
        }
        return tags.trim();
    }

    get_notes() {
        return this.combined_meta.notes
    }

    set_metadata_fields(created, tagstring, notes) {
        let tags = tagstring.split(" ");
        let domContainer = document.querySelector('#resource-area');
        this.combined_meta = ReactDOM.render(<CombinedMetadata tags={tags}
                                                               created={created}
                                                               notes={notes}
                                                               meta_outer={this.meta_outer}
                                                               res_type={this.res_type}/>, domContainer);
        this.savedTags = tags;
        this.savedNotes = notes;
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
        const notes = this.get_notes();
        return !((current_content == this.saved_content) && (tags == this.savedTags) && (notes == this.savedNotes))
    }
}

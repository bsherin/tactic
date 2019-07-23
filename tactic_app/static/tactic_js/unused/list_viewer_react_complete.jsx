/**
 * Created by bls910 on 1/24/17.
 */

let list_viewer;

const MARGIN_SIZE = 17;

import {CombinedMetadata} from "./react_mdata_fields.js";
import {ResourceviewerToolbar} from "./react_toolbar.js";

let get_url = "get_list";

function start_post_load ()  {

    var tsocket = new ResourceViewerSocket("main", 5000);
    postAjaxPromise(`${get_url}/${resource_name}`, {})
        .then(function (data) {
            var the_content = data.the_content;
            let result_dict = {"res_type": "list", "res_name": resource_name, "is_repository": false};
            let domContainer = document.querySelector('#root');
            postAjaxPromise("grab_metadata", result_dict)
			        .then(function (data) {
                        ReactDOM.render(<ListViewerApp resource_name={resource_name}
                                                       the_content={the_content}
                                                       created={data.datestring}
                                                       tags={data.tags.split(" ")}
                                                       notes={data.notes}
                                                       meta_outer="#right-div"/>, domContainer);
			        })
			        .catch(function () {
			            ReactDOM.render(<ListViewerApp resource_name={resource_name}
                                                       the_content={the_content}
                                                       created=""
                                                       tags=""
                                                       notes=""
                                                       meta_outer="#right-div"/>, domContainer);
			        })
        })
        .catch(doFlash);
}

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

class ListEditor extends React.Component {

    render() {
        let tstyle = {
            "height": "100%",
            "display": "inline-block"
        };
        let mcstyle = {
            "height": "100%"
        };
        return (
            <div id="main_content" style={mcstyle}>
                <textarea id="listarea" style={tstyle} value={this.props.the_content} onChange={this.props.handleChange}/>
            </div>
        )
    }
}


class ListViewerApp extends React.Component {

    constructor(props) {
        super(props);
        this.left_div_ref = React.createRef();
        this.right_div_ref = React.createRef();
        this.savedContent = props.the_content;
        this.savedTags = props.tags;
        this.savedNotes = props.notes;

        this.state = {
            "current_width_fraction": .5,
            "list_content": props.the_content,
            "notes": props.notes,
            "tags": props.tags,
            "left_div_height": 1000,
            "right_div_height": 1000
        };
        let self = this;
        window.onbeforeunload = function(e) {
            if (self.dirty()) {
                return "Any unsaved changes will be lost."
            }
        };
        this.mousetrap = new Mousetrap();
        this.mousetrap.bind(['command+s', 'ctrl+s'], function (e) {
            self.saveMe();
            e.preventDefault()
        });

        this.handleListChange = this.handleListChange.bind(this);
        this.handleNotesChange = this.handleNotesChange.bind(this);
        this.handleTagsChange = this.handleTagsChange.bind(this);
        this.resize_to_window = this.resize_to_window.bind(this)
    }

    get button_groups() {
            return [[{"name": "save_button",  "button_class": "btn-outline-secondary", "name_text": "Save", "icon_name": "save", "click_handler": this.saveMe.bind(this)},
                     {"name": "save_as_button", "button_class": "btn-outline-secondary", "name_text": "Save as...", "icon_name": "save", "click_handler": this.saveMeAs.bind(this)},
                      {"name": "share_button", "button_class": "btn-outline-secondary", "name_text": "Share", "icon_name": "share","click_handler": this.sendToRepository.bind(this)}
                      ]]
    }

    handleNotesChange(event) {
        this.setState({"notes": event.target.value});
    }

    handleTagsChange(field, editor, tags){
        this.setState({"tags": tags})
    }

    update_width(new_width_fraction) {
        this.setState({"current_width_fraction": new_width_fraction})
    }

    get_new_height (element_ref, bottom_margin) {  // test
        return window.innerHeight - $(element_ref.current).offset().top - bottom_margin
    }

    resize_to_window() {  // tactic_working reactify this
        this.setState({
            "left_div_height": this.get_new_height(this.left_div_ref, 40),
            "right_div_height": this.get_new_height(this.right_div_ref, 40)
        });
    }

    turn_on_horizontal_resize () {
        let self = this;
        $(this.left_div_ref.current).resizable({
            handles: "e",
            resize: function (event, ui) {
                const usable_width = window.innerWidth - 2 * MARGIN_SIZE - 30;
                let new_width_fraction = 1.0 * ui.size.width / usable_width;
                ui.position.left = ui.originalPosition.left;
                self.update_width(new_width_fraction)
            }
        });
    }
    
    componentDidMount() {
        this.turn_on_horizontal_resize();
        window.addEventListener("resize", this.resize_to_window);
        this.resize_to_window();
        stopSpinner();
    }

    handleListChange(event) {
        this.setState({"list_content": event.target.value});
    }


    render() {
        const usable_width = window.innerWidth - 2 * MARGIN_SIZE - 30;
        let left_div_style = {
            "marginTop": 20,
            "display": "inline-block",
            "verticalAlign": "top",
            "width": usable_width * this.state.current_width_fraction,
            "height": this.state.left_div_height
        };
        let mstyle = {
            "verticalAlign": "top",
            "marginLeft": "5px",
            "marginTop": "10px",
            "maxWidth": "600px"
        };
        let right_div_style = {
            "marginTop": "20px",
            "display": "inline-block",
            "verticalAlign": "top",
            "width": (1 - this.state.current_width_fraction) * usable_width,
            "height": this.state.right_div_height
        };
        return(
            <React.Fragment>
                <ResourceviewerToolbar button_groups={this.button_groups}
                                   resource_name={this.props.resource_name}
                                   res_type="list"/>
                <div id="left-div" ref={this.left_div_ref} className="res-viewer-resizer" style={left_div_style}>
                    <ListEditor the_content={this.state.list_content} handleChange={this.handleListChange}/>
                </div>
                <div id="right-div" ref={this.right_div_ref} className="resource-viewer-right"  style={right_div_style}>
                    <div id="resource-area" style={mstyle}>
                        <CombinedMetadata tags={this.state.tags}
                                               created={this.props.created}
                                               notes={this.state.notes}
                                               meta_outer={this.props.meta_outer}
                                               handleTagsChange={this.handleTagsChange}
                                               handleNotesChange={this.handleNotesChange}
                                               res_type="list"/>
                    </div>

                </div>
            </React.Fragment>
        )
    }

    get_tags() {
        return this.state.tags
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
        return this.state.notes
    }

    saveMe() {
        const new_list_as_string = this.state.list_content;
        const tags = this.get_tags_string();
        const notes = this.get_notes();
        const result_dict = {
            "list_name": this.props.resource_name,
            "new_list_as_string": new_list_as_string,
            "tags": tags,
            "notes": notes
        };
        let self = this;
        postAjax("update_list", result_dict, update_success);
        function update_success(data) {
            if (data.success) {
                self.savedContent = new_list_as_string;
                self.savedTags = tags;
                self.savedNotes = notes;
                data.timeout = 2000;
            }
            doFlash(data);
            return false
        }
    }

    saveMeAs(e) {
        doFlash({"message": "not implemented yet", "timeout": 10});
        return false
    }

    sendToRepository() {
        let self = this;
        $.getJSON($SCRIPT_ROOT + `get_repository_resource_names/list`, function(data) {
            showModal(`Share list`, `New list Name`, ShareResource, self.props.resource_name, data["resource_names"])
            }
        );
        function ShareResource(new_name) {
            const result_dict = {
                "res_type": "list",
                "res_name": self.props.resource_name,
                "new_res_name": new_name
            };
            postAjax("send_to_repository", result_dict, doFlashAlways)
        }
    }

    dirty() {
        let current_content = this.state.list_content;
        const tags = this.get_tags();
        const notes = this.get_notes();
        return !((current_content == this.savedContent) && (tags == this.savedTags) && (notes == this.savedNotes))
    }
}

start_post_load();
/**
 * Created by bls910
 */

import {ResourceViewerSocket, ResourceViewerApp} from "./resource_viewer_react_app.js";

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

class ListEditor extends React.Component {

    render() {
        let tastyle = {"resize": "horizontal"};
        return (
            <div id="listarea-container">
                <textarea id="listarea"
                          style={tastyle}
                          value={this.props.the_content}
                          onChange={this.props.handleChange}/>
            </div>
        )
    }
}

ListEditor.propTypes = {
    the_content: PropTypes.string,
    handleChange: PropTypes.func,
};

class ListViewerApp extends React.Component {

    constructor(props) {
        super(props);
        this.savedContent = props.the_content;
        this.savedTags = props.tags;
        this.savedNotes = props.notes;
        window.onbeforeunload = function(e) {
            if (self.dirty()) {
                return "Any unsaved changes will be lost."
            }
        };

        this.state = {
            "list_content": props.the_content,
            "notes": props.notes,
            "tags": props.tags,
        };
        let self = this;

        this.handleListChange = this.handleListChange.bind(this);
        this.handleNotesChange = this.handleNotesChange.bind(this);
        this.handleTagsChange = this.handleTagsChange.bind(this);
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

    handleListChange(event) {
        this.setState({"list_content": event.target.value});
    }

    get_tags_string() {
        let taglist = this.state.tags;
        let tags = "";
        for (let tag of taglist) {
            tags = tags + tag + " "
        }
        return tags.trim();
    }

    render() {
        return (
            <ResourceViewerApp res_type="list"
                               resource_name={this.props.resource_name}
                               button_groups={this.button_groups}
                               handleNotesChange={this.handleNotesChange}
                               handleTagsChange={this.handleTagsChange}
                               created={this.props.created}
                               notes={this.state.notes}
                               tags={this.state.tags}
                               saveMe={this.saveMe}
                               meta_outer={this.props.meta_outer}>
                    <ListEditor the_content={this.state.list_content} handleChange={this.handleListChange}/>
            </ResourceViewerApp>
        )
    }

    saveMe() {
        const new_list_as_string = this.state.list_content;
        const tags = this.get_tags_string();
        const notes = this.state.notes;
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
        let res_type = "list";
        $.getJSON($SCRIPT_ROOT + `get_repository_resource_names/${res_type}`, function(data) {
            showModal(`Share list ${res_type}`, `New list Name`, ShareResource, self.props.resource_name, data["resource_names"])
            }
        );
        function ShareResource(new_name) {
            const result_dict = {
                "res_type": res_type,
                "res_name": self.props.resource_name,
                "new_res_name": new_name
            };
            postAjax("send_to_repository", result_dict, doFlashAlways)
        }
    }

    dirty() {
        let current_content = this.state.list_content;
        const tags = this.state.tags;
        const notes = this.state.notes;
        return !((current_content == this.savedContent) && (tags == this.savedTags) && (notes == this.savedNotes))
    }
}

ListViewerApp.propTypes = {
    resource_name: PropTypes.string,
    the_content: PropTypes.string,
    created: PropTypes.string,
    tags: PropTypes.array,
    notes: PropTypes.string,
    meta_outer: PropTypes.string
};


start_post_load();
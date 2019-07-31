/**
 * Created by bls910
 */

import {ResourceViewerSocket, ResourceViewerApp, copyToLibrary, sendToRepository} from "./resource_viewer_react_app.js";
import {ReactCodemirror} from "./react-codemirror.js";
import {ViewerContext} from "./resource_viewer_context.js";

function code_viewer_main ()  {
    let get_url = window.is_respository ? "repository_get_code_code" : "get_code_code";
    let get_mdata_url = window.is_respository ? "grab_repository_metadata" : "grab_metadata";

    var tsocket = new ResourceViewerSocket("main", 5000);
    postAjaxPromise(`${get_url}/${window.resource_name}`, {})
        .then(function (data) {
            var the_content = data.the_content;
            let result_dict = {"res_type": "code", "res_name": window.resource_name, "window.is_respository": false};
            let domContainer = document.querySelector('#root');
            postAjaxPromise(get_mdata_url, result_dict)
			        .then(function (data) {
                        ReactDOM.render(<CodeViewerApp resource_name={window.resource_name}
                                                       the_content={the_content}
                                                       created={data.datestring}
                                                       tags={data.tags.split(" ")}
                                                       notes={data.notes}
                                                       readOnly={window.read_only}
                                                       window.is_respository={window.is_respository}
                                                       meta_outer="#right-div"/>, domContainer);
			        })
			        .catch(function () {
			            ReactDOM.render(<CodeViewerApp resource_name={window.resource_name}
                                                       the_content={the_content}
                                                       created=""
                                                       tags={[]}
                                                       notes=""
                                                       readOnly={window.read_only}
                                                       window.is_respository={window.is_respository}
                                                       meta_outer="#right-div"/>, domContainer);
			        })
        })
        .catch(doFlash);
}

class CodeViewerApp extends React.Component {

    constructor(props) {
        super(props);
        this.savedContent = props.the_content;
        this.savedTags = props.tags;
        this.savedNotes = props.notes;
        let self = this;
        window.onbeforeunload = function(e) {
            if (self.dirty()) {
                return "Any unsaved changes will be lost."
            }
        };

        this.state = {
            "code_content": props.the_content,
            "notes": props.notes,
            "tags": props.tags,
        };

        this.handleNotesChange = this.handleNotesChange.bind(this);
        this.handleTagsChange = this.handleTagsChange.bind(this);
        this.handleCodeChange = this.handleCodeChange.bind(this);
    }

    get button_groups() {
        let bgs;
        if (this.props.is_respository) {
             bgs =[[{"name_text": "Copy", "icon_name": "share",
                        "click_handler": () => {copyToLibrary("code", this.props.resource_name)}}]
            ]
        }
        else {
            bgs = [[{"name_text": "Save", "icon_name": "save", "click_handler": this.saveMe},
                    {"name_text": "Save as...", "icon_name": "save", "click_handler": this.saveMeAs},
                    {"name_text": "Share", "icon_name": "share",
                          "click_handler": () => {sendToRepository("code", this.props.resource_name)}}]
            ]
        }

        for (let bg of bgs) {
            for (let but of bg) {
                but.click_handler = but.click_handler.bind(this)
            }
        }
        return bgs

    }

    handleCodeChange(new_code) {
        this.setState({"code_content": new_code})
    }

    handleNotesChange(event) {
        this.setState({"notes": event.target.value});
    }

    handleTagsChange(field, editor, tags){
        this.setState({"tags": tags})
    }

    render() {
        let the_context = {"readOnly": this.props.readOnly};
        return (
            <ViewerContext.Provider value={the_context}>
                <ResourceViewerApp res_type="code"
                                   resource_name={this.props.resource_name}
                                   button_groups={this.button_groups}
                                   handleNotesChange={this.handleNotesChange}
                                   handleTagsChange={this.handleTagsChange}
                                   created={this.props.created}
                                   notes={this.state.notes}
                                   tags={this.state.tags}
                                   saveMe={this.saveMe}
                                   meta_outer={this.props.meta_outer}>
                    <ReactCodemirror code_content={this.state.code_content}
                                     handleChange={this.handleCodeChange}
                                     saveMe={this.saveMe}
                                     readOnly={this.props.readOnly}
                      />
                </ResourceViewerApp>
            </ViewerContext.Provider>
        )
    }
    
    get_tags_string() {
        let taglist = this.state.tags;
        let tags = "";
        for (let tag of taglist) {
            tags = tags + tag + " "
        }
        return tags.trim();
    }

    saveMe() {
        const new_code = this.state.code_content;
        const tagstring = this.get_tags_string();
        const notes = this.state.notes;
        const tags = this.state.tags;  // In case it's modified wile saving
        const result_dict = {
            "code_name": this.props.resource_name,
            "new_code": new_code,
            "tags": tagstring,
            "notes": notes,
            "window.user_id": window.user_id
        };
        let self = this;
        postWithCallback("host","update_code_task", result_dict, update_success);
        function update_success(data) {
            if (data.success) {
                self.savedContent = new_code;
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


    dirty() {
        let current_content = this.state.code_content;
        const tags = this.state.tags;
        const notes = this.state.notes;
        return !((current_content == this.savedContent) && (tags == this.savedTags) && (notes == this.savedNotes))
    }
}

CodeViewerApp.propTypes = {
    resource_name: PropTypes.string,
    the_content: PropTypes.string,
    created: PropTypes.string,
    tags: PropTypes.array,
    notes: PropTypes.string,
    readOnly: PropTypes.bool,
    is_respository: PropTypes.bool,
    meta_outer: PropTypes.string
};


code_viewer_main();
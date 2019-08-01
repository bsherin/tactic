/**
 * Created by bls910
 */

import { ResourceViewerSocket, ResourceViewerApp, copyToLibrary, sendToRepository } from "./resource_viewer_react_app.js";
import { ViewerContext } from "./resource_viewer_context.js";

function list_viewer_main() {
    let get_url = window.is_repository ? "repository_get_list" : "get_list";
    let get_mdata_url = window.is_repository ? "grab_repository_metadata" : "grab_metadata";

    var tsocket = new ResourceViewerSocket("main", 5000);
    postAjaxPromise(`${get_url}/${window.resource_name}`, {}).then(function (data) {
        var the_content = data.the_content;
        let result_dict = { "res_type": "list", "res_name": window.resource_name, "is_repository": false };
        let domContainer = document.querySelector('#root');
        postAjaxPromise(get_mdata_url, result_dict).then(function (data) {
            ReactDOM.render(React.createElement(ListViewerApp, { resource_name: window.resource_name,
                the_content: the_content,
                created: data.datestring,
                tags: data.tags.split(" "),
                notes: data.notes,
                readOnly: window.read_only,
                is_repository: window.is_repository,
                meta_outer: "#right-div" }), domContainer);
        }).catch(function () {
            ReactDOM.render(React.createElement(ListViewerApp, { resource_name: window.resource_name,
                the_content: the_content,
                created: "",
                tags: [],
                notes: "",
                readOnly: window.read_only,
                is_repository: window.is_repository,
                meta_outer: "#right-div" }), domContainer);
        });
    }).catch(doFlash);
}

class ListEditor extends React.Component {

    render() {
        let tastyle = { "resize": "horizontal" };
        return React.createElement(
            "div",
            { id: "listarea-container" },
            React.createElement("textarea", { id: "listarea",
                style: tastyle,
                value: this.props.the_content,
                onChange: this.props.handleChange,
                readOnly: this.context.readOnly
            })
        );
    }
}
ListEditor.contextType = ViewerContext;

ListEditor.propTypes = {
    the_content: PropTypes.string,
    handleChange: PropTypes.func,
    readOnly: PropTypes.bool
};

class ListViewerApp extends React.Component {

    constructor(props) {
        super(props);
        this.savedContent = props.the_content;
        this.savedTags = props.tags;
        this.savedNotes = props.notes;
        let self = this;
        window.onbeforeunload = function (e) {
            if (self.dirty()) {
                return "Any unsaved changes will be lost.";
            }
        };

        this.state = {
            "list_content": props.the_content,
            "notes": props.notes,
            "tags": props.tags
        };

        this.handleListChange = this.handleListChange.bind(this);
        this.handleNotesChange = this.handleNotesChange.bind(this);
        this.handleTagsChange = this.handleTagsChange.bind(this);
    }

    get button_groups() {
        let bgs;
        if (this.props.is_repository) {
            bgs = [[{ "name_text": "Copy", "icon_name": "share",
                "click_handler": () => {
                    copyToLibrary("list", this.props.resource_name);
                } }]];
        } else {
            bgs = [[{ "name_text": "Save", "icon_name": "save", "click_handler": this.saveMe }, { "name_text": "Save as...", "icon_name": "save", "click_handler": this.saveMeAs }, { "name_text": "Share", "icon_name": "share",
                "click_handler": () => {
                    sendToRepository("list", this.props.resource_name);
                } }]];
        }
        for (let bg of bgs) {
            for (let but of bg) {
                but.click_handler = but.click_handler.bind(this);
            }
        }
        return bgs;
    }

    handleNotesChange(event) {
        this.setState({ "notes": event.target.value });
    }

    handleTagsChange(field, editor, tags) {
        this.setState({ "tags": tags });
    }

    handleListChange(event) {
        this.setState({ "list_content": event.target.value });
    }

    get_tags_string() {
        let taglist = this.state.tags;
        let tags = "";
        for (let tag of taglist) {
            tags = tags + tag + " ";
        }
        return tags.trim();
    }

    render() {

        let the_context = { "readOnly": this.props.readOnly };
        return React.createElement(
            ViewerContext.Provider,
            { value: the_context },
            React.createElement(
                ResourceViewerApp,
                { res_type: "list",
                    resource_name: this.props.resource_name,
                    button_groups: this.button_groups,
                    handleNotesChange: this.handleNotesChange,
                    handleTagsChange: this.handleTagsChange,
                    created: this.props.created,
                    notes: this.state.notes,
                    tags: this.state.tags,
                    saveMe: this.saveMe,
                    meta_outer: this.props.meta_outer },
                React.createElement(ListEditor, { the_content: this.state.list_content,
                    handleChange: this.handleListChange
                })
            )
        );
    }

    saveMe() {
        const new_list_as_string = this.state.list_content;
        const tagstring = this.get_tags_string();
        const notes = this.state.notes;
        const tags = this.state.tags; // In case it's modified wile saving
        const result_dict = {
            "list_name": this.props.resource_name,
            "new_list_as_string": new_list_as_string,
            "tags": tagstring,
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
            return false;
        }
    }

    saveMeAs(e) {
        doFlash({ "message": "not implemented yet", "timeout": 10 });
        return false;
    }

    dirty() {
        let current_content = this.state.list_content;
        const tags = this.state.tags;
        const notes = this.state.notes;
        return !(current_content == this.savedContent && tags == this.savedTags && notes == this.savedNotes);
    }
}

ListViewerApp.propTypes = {
    resource_name: PropTypes.string,
    the_content: PropTypes.string,
    created: PropTypes.string,
    tags: PropTypes.array,
    notes: PropTypes.string,
    readOnly: PropTypes.bool,
    is_repository: PropTypes.bool,
    meta_outer: PropTypes.string
};

list_viewer_main();
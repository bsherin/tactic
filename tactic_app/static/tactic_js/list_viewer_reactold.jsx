/**
 * Created by bls910 on 1/24/17.
 */

let list_viewer;

import {ResourceViewer, ResourceviewerToolbar} from "./resource_viewer_class_react.js";


function start_post_load ()  {
    if (is_repository) {
        list_viewer = new RepositoryListViewer(resource_name, "list", "repository_get_list")
    }
    else {
        list_viewer = new ListViewer(resource_name, "list", "get_list")
    }
    stopSpinner()
}

class ListEditor extends React.Component {

    render() {
        let tstyle = {
            "height": "100%",
            "display": "inline-block"
        };
        return (
            <div id = "main_content">
                <textarea id="listarea" style={tstyle}>{this.props.the_content}</textarea>
            </div>
        )
    }
}

class ListViewerApp extends React.Component {

    get button_groups() {
            return [[{"name": "save_button",  "button_class": "btn-outline-secondary", "name_text": "Save", "icon_name": "save", "click_handler": this.saveMe.bind(this)},
                     {"name": "save_as_button", "button_class": "btn-outline-secondary", "name_text": "Save as...", "icon_name": "save", "click_handler": this.saveMeAs.bind(this)},
                      {"name": "share_button", "button_class": "btn-outline-secondary", "name_text": "Share", "icon_name": "share","click_handler": this.sendToRepository.bind(this)}
                      ]]
    }

    render() {
        let left_div_style = {
            "margin-top": 20,
            "display": "inline-block",
            "vertical-align": "top"
        };
        let mstyle = {
            "vertical-align": "top",
            "margin-left": "5px",
            "margin-top": "10px",
            "max-width": "600px"
        }
        return(
            <Fragment>
                <ResourceviewerToolbar button_groups={this.button_groups}
                                   resource_name={this.props.resource_name}
                                   res_type="list"/>
                <div id="left-div" className="res-viewer-resizer" style=left_div_style>
                    <ListEditor the_content={this.props.the_content}/>
                </div>
                <div id="resource-area" style={mstyle}>
				    <CombinedMetadata tags={this.props.tags}
	                                       created={this.props.created}
	                                       notes={this.props.notes}
	                                       meta_outer={this.props.meta_outer}
	                                       res_type={this.props.res_type}/>

                </div>
            </Fragment>
        )
    }
}

class ListViewer extends ResourceViewer {

    construct_html_from_the_content(the_content) {
        return `<textarea id="listarea" style="height: 100%; display:inline-block; resize:both">${the_content}</textarea>`;
    }

    get_current_content() {
        return $("#listarea").val();
    }

    get button_groups() {
            return [[{"name": "save_button",  "button_class": "btn-outline-secondary", "name_text": "Save", "icon_name": "save", "click_handler": this.saveMe.bind(this)},
                     {"name": "save_as_button", "button_class": "btn-outline-secondary", "name_text": "Save as...", "icon_name": "save", "click_handler": this.saveMeAs.bind(this)},
                      {"name": "share_button", "button_class": "btn-outline-secondary", "name_text": "Share", "icon_name": "share","click_handler": this.sendToRepository.bind(this)}
                      ]]
    }

    saveMe() {
        const new_list_as_string = $("#listarea").val();
        const tags = this.get_tags_string();
        const notes = this.get_notes();
        const result_dict = {
            "list_name": this.resource_name,
            "new_list_as_string": new_list_as_string,
            "tags": tags,
            "notes": notes
        };
        postAjax("update_list", result_dict, update_success);
        function update_success(data) {
            if (data.success) {
                this.savedContent = new_list_as_string;
                this.savedTags = tags;
                this.savedNotes = notes;
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

}

class RepositoryListViewer extends ListViewer {

    construct_html_from_the_content(the_content) {
        return `<textarea id="listarea" style="height: 100%; display:inline-block" readonly>${the_content}</textarea>`;
    }

    get button_bindings() {
        return {"copy_button": this.copyToLibrary};
    }

    get_current_content() {
        return $("#listarea").val();
    }

}

start_post_load();
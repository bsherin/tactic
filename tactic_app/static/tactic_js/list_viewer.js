/**
 * Created by bls910 on 1/24/17.
 */

let list_viewer;

function start_post_load ()  {
    if (is_repository) {
        list_viewer = new RepositoryListViewer(resource_name, "list", "repository_get_list")
    }
    else {
        list_viewer = new ListViewer(resource_name, "list", "get_list")
    }
    stopSpinner()
}

class ListViewer extends ResourceViewer {

    construct_html_from_the_content(the_content) {
        return `<textarea id="listarea" style="height: 100%; display:inline-block">${the_content}</textarea>`;
    }

    get_current_content() {
        return $("#listarea").val();
    }

    get button_bindings() {
        return {"save_button": this.saveMe, "save_as_button": this.saveMeAs, "share_button": this.sendToRepository};
    }


    saveMe() {
        const new_list_as_string = $("#listarea").val();
        const tags = this.get_tags_string();
        const notes = $("#notes").val();
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
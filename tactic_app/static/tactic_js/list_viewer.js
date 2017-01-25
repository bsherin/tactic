/**
 * Created by bls910 on 1/24/17.
 */

let list_viewer;

function start_post_load ()  {
    if (is_repository) {
        list_viewer = new RepositoryListViewer(resource_name, "repository_get_list")
    }
    else {
        list_viewer = new ListViewer(resource_name, "get_list")
    }
}

class ListViewer extends ResourceViewer {

    construct_html_from_the_content(the_content) {
        return `<textarea id="listarea" style="height: 100%; display:inline-block">${the_content}</textarea>`;
    }

    get_current_content() {
        return $("#listarea").val();
    }

    get button_bindings() {
        return {"save_button": this.saveMe, "save_as_button": this.saveMeAs};
    }

    rename_me() {
        console.log("entering rename");
        self = this;
        $.getJSON($SCRIPT_ROOT + "get_resource_names/list", function(data) {
            const list_names = data["resource_names"];
            const index = list_names.indexOf(self.resource_name);
            if (index >= 0) {
              list_names.splice(index, 1);
            }
            showModal("Rename List", "Name for this list", RenameListResource, self.resource_name, list_names)
        }
        );
        function RenameListResource(new_name) {
            const the_data = {"new_name": new_name};
            postAjax("rename_list/" + self.resource_name, the_data, renameSuccess);
            function renameSuccess(data) {
                if (data.success) {
                    self.resource_name = new_name;
                    $("#rename-button").text(self.resource_name)
                }
                else {
                    doFlash(data)
                }

            }
        }
    }

    saveMe() {
        const new_list_as_string = $("#listarea").val();
        const tags = $("#tags").val();
        const notes = $("#notes").val();
        const result_dict = {
            "list_name": this.resource_name,
            "new_list_as_string": new_list_as_string,
            "tags": tags,
            "notes": notes
        };
        postAjax("update_list", result_dict, update_success);
        self = this;
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

    sendToRepository() {
        $.getJSON($SCRIPT_ROOT + "get_repository_resource_names/list", function(data) {
            showModal("Share list", "New list Name", ShareListResource, resource_name, data["resource_names"])
            }
        );
        function ShareListResource(new_name) {
            const result_dict = {
                "res_type": "list",
                "res_name": resource_name,
                "new_res_name": new_name
            };
            postAjax("send_to_repository", result_dict, doFlashAlways)
        }
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

    copyToLibrary() {
        self = this;
        $.getJSON($SCRIPT_ROOT + "get_resource_names/list", function(data) {
            showModal("Import list", "New list Name", ImportListResource, resource_name, data["resource_names"])
            }
        );
        function ImportListResource(new_name) {
            const result_dict = {
                "res_type": "list",
                "res_name": self.resource_name,
                "new_res_name": new_name
            };
            postAjax("copy_from_repository", result_dict, doFlashAlways);
        }
    }
}
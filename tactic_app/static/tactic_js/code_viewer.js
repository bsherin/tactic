/**
 * Created by bls910 on 10/4/15.
 */

let code_viewer;

function start_post_load() {
    if (is_repository) {
            code_viewer = new RepositoryCodeViewer(resource_name, "code", "repository_get_code_code")
    }
    else {
            code_viewer = new CodeViewer(resource_name, "code", "get_code_code")
    }
    stopSpinner()
}

class CodeViewer extends ModuleViewerAbstract {

    do_extra_setup () {
        super.do_extra_setup();
    }

    get button_bindings() {
        return {"save_button": this.saveMe,
            "save_as_button": this.saveCodeAs,
            "share_button": this.sendToRepository,
            "change_theme_button": this.changeTheme,
            "show_api_button": this.showAPI}
    }

    get_current_content () {
         return this.myCodeMirror.getDoc().getValue();
    }

    construct_html_from_the_content(the_content) {
        return the_content;
    }

    set_main_content(the_content) {
        let codearea = document.getElementById("main_content");
        this.myCodeMirror = this.createCMArea(codearea, true, the_content, 1);
        if (is_repository) {
            this.myCodeMirror.setOption("readOnly", true)
        }
        this.myCodeMirror.refresh();
        let self = this;
        /**
         * @param {{api_html:boolean}} data
         */
        postAjaxPromise("get_api_html", {})
            .then(function (data) {
                $("#aux-area").html(data.api_html);
                self.create_api_listeners();
            })
            .catch(doFlash)
    }

    saveMe() {
        const new_code = this.myCodeMirror.getDoc().getValue();
        const tags = this.get_tags_string();
        const notes = $("#notes").val();
        const result_dict = {
            "code_name": this.resource_name,
            "new_code": new_code,
            "tags": tags,
            "notes": notes
            };
        postAjax("update_code", result_dict, update_success);
        function update_success(data) {
            if (data.success) {
                this.savedCode = new_code;
                this.savedTags = tags;
                this.savedNotes = notes;
                data.timeout = 2000;
            }
            doFlash(data);
            return false
        }
    }

    saveCodeAs() {
        doFlash({"message": "not implemented yet"});
        return false
    }

}

class RepositoryCodeViewer extends CodeViewer {

    get button_bindings() {
        return {"copy_button": this.copyToLibrary};
    }

}


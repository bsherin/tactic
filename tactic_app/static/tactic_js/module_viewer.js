/**
 * Created by bls910 on 10/4/15.
 */
let current_theme = "default";
let myCodeMirror;
let savedCode = null;
let savedTags = null;
let savedNotes = null;
const this_viewer = "viewer";

let module_viewer;

function start_post_load() {
    if (is_repository) {
            module_viewer = new RepositoryModuleViewer(resource_name, "tile", "repository_get_module_code")
    }
    else {
            module_viewer = new ModuleViewer(resource_name, "tile", "get_module_code")
    }
}

class ModuleViewer extends ModuleViewerAbstract {

    do_extra_setup () {
        super.do_extra_setup();
    }

    get button_bindings() {
        return {"save_button": this.saveMe,
            "save_as_button": this.saveModuleAs,
            "load_button": this.loadModule,
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
        self = this;
        postAjaxPromise("get_api_html", {})
            .then(function (data) {
                $("#aux-area").html(data.api_html);
                self.create_api_listeners();
            })
            .catch(doFlash)
    }
}


class RepositoryModuleViewer extends ModuleViewer {

    get button_bindings() {
        return {"copy_button": this.copyToLibrary};
    }

}
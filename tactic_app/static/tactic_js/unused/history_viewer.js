/**
 * Created by bls910 on 10/4/15.
 */

let history_viewer;

function start_post_load() {
    history_viewer = new HistoryViewer(resource_name, "tile", "get_module_code");
    stopSpinner()
}

class HistoryViewer extends ModuleViewerAbstract {

    do_extra_setup() {
        super.do_extra_setup();
    }

    get button_bindings() {
        return {"save_button": this.checkpointThenSaveFromLeft}
    }

    createMergeArea(codearea, include_in_global_search = false, initial_left = null, initial_right = null) {
        let cmobject = CodeMirror.MergeView(codearea, {
            value: initial_left,
            lineNumbers: true,
            matchBrackets: true,
            highlightSelectionMatches: true,
            autoCloseBrackets: true,
            indentUnit: 4,
            readOnly: false,
            orig: initial_right
        });
        cmobject.edit.setOption("extraKeys", {
            Tab: function (cm) {
                let spaces = new Array(5).join(" ");
                cm.replaceSelection(spaces);
            },
            "Ctrl-Space": "autocomplete"
        });

        $(".CodeMirror").css("height", "100%");
        $(".CodeMirror-merge").css("height", "100%");
        $(".CodeMirror-merge-pane").css("height", "100%");
        if (include_in_global_search) {
            this.cmobjects_to_search.push(cmobject);
        }
        this.cmobjects.push(cmobject);
        return cmobject
    }

    got_resource(the_content) {
        this.saved_content = the_content;
        let the_html = this.construct_html_from_the_content(the_content);
        this.set_main_content(the_html);
        resize_dom_to_bottom_given_selector("#main_content", 40);
    }

    checkpointThenSaveFromLeft() {
        let self = this;
        let current_popup_val = this.history_popup.val();
        this.doCheckpointPromise()
            .then(function () {
                postAjaxPromise("get_checkpoint_dates", {"module_name": self.resource_name})
                    .then((data) => {
                        self.history_list = data.checkpoints;
                        self.populateHistoryList();
                        self.history_popup.val(current_popup_val);
                        self.refreshAreas();
                    })
                    .catch(doFlash);
                self.saveFromLeft()
            })
            .catch(doFlash)
    }

    saveFromLeft() {
        let data_dict = {
            "module_name": self.resource_name,
            "module_code": this.getLeftViewer()
        };
        postAjaxPromise("update_from_left", data_dict)
            .then(doFlash)
            .catch(doFlash)
    }


    get_current_content () {
         return this.myCodeMirror.edit.getValue();
    }

    get history_popup() {
        return $("#history_popup")
    }

    construct_html_from_the_content(the_content) {
        return the_content;
    }

    setRightViewer(the_code) {
        this.myCodeMirror.right.orig.setValue(the_code)
    }

    setLeftViewer(the_code) {
        this.myCodeMirror.edit.setValue(the_code)
    }

    getLeftViewer() {
        return this.myCodeMirror.edit.getValue()
    }

    update_right_viewer(newdata) {
        let self = this;
        for (let item of this.history_list) {
            if (item["updatestring"] == newdata){
                let updatestring_for_sort = item["updatestring_for_sort"];
                postAjaxPromise("get_checkpoint_code", {"module_name": self.resource_name, "updatestring_for_sort": updatestring_for_sort})
                    .then((data) => {
                            self.setRightViewer(data.module_code);
                            self.refreshAreas();
                        })
                    .catch(doFlash);
                return
            }
        }
    }

    populateHistoryList() {
        let self = this;
        let hl = '<span style="position: absolute; bottom: 0">Current</span><select id="history_popup" class="form-control" style="margin-bottom: 5px">';
        for (let item of this.history_list) {
            hl += `<option>${item["updatestring"]}</option>\n`
        }
        hl += "</select>";
        $("#above_main").html(hl);
        this.history_popup.change(function () {
            self.update_right_viewer(this.value)
        });
    }

    refreshAreas() {
        let right_width = $($(".CodeMirror-merge-right")[0]).width();
        let left_pos = $($(".CodeMirror-merge-right")[0]).offset().left;
        this.history_popup.width(right_width);
        this.history_popup.offset({"left": left_pos});
        this.myCodeMirror.edit.refresh();
        this.myCodeMirror.right.orig.refresh()
    }

    set_main_content(the_content) {
        let codearea = document.getElementById("main_content");
        let self = this;
        postAjaxPromise("get_checkpoint_dates", {"module_name": this.resource_name})
            .then(function (data) {
                    self.history_list = data.checkpoints;
                    self.populateHistoryList();
                        postAjaxPromise("get_checkpoint_code", {"module_name": self.resource_name, "updatestring_for_sort": self.history_list[0]["updatestring_for_sort"]})
                            .then((data) => {
                                    self.myCodeMirror = self.createMergeArea(codearea, true, the_content, data.module_code);
                                    resize_dom_to_bottom_given_selector("#main_content", 40);
                                    self.refreshAreas();
                                    window.onresize = function () {
                                        resize_dom_to_bottom_given_selector("#main_content", 40);
                                        self.refreshAreas();
                                    }
                                })
                            .catch(doFlash)
                })
            .catch(doFlash)
    }
}

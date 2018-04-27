/**
 * Created by bls910 on 10/4/15.
 */

let tile_differ;

function start_post_load() {
    tile_differ = new TileDiffer(resource_name, "tile", "get_module_code");
    stopSpinner()
}

class TileDiffer extends ModuleViewerAbstract {

    do_extra_setup() {
        super.do_extra_setup();
    }

    get button_bindings() {
        return {"save_button": this.saveFromLeft}
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

    get tile_popup() {
        return $("#tile_popup")
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

    update_right_viewer(tname) {
        let self = this;
        postAjaxPromise("get_module_code/" + tname, {})
            .then((data) => {
                    self.setRightViewer(data.the_content);
                    self.refreshAreas();
                })
            .catch(doFlash);
    }

    populateTileList() {
        let self = this;
        let hl = '<span style="position: absolute; bottom: 0">Current</span><select id="tile_popup" class="form-control" style="margin-bottom: 5px">';
        for (let item of this.tile_list) {
            hl += `<option>${item}</option>\n`
        }
        hl += "</select>";
        $("#above_main").html(hl);
        this.tile_popup.change(function () {
            self.update_right_viewer(this.value)
        });
    }

    refreshAreas() {
        let right_width = $($(".CodeMirror-merge-right")[0]).width();
        let left_pos = $($(".CodeMirror-merge-right")[0]).offset().left;
        this.tile_popup.width(right_width);
        this.tile_popup.offset({"left": left_pos});
        this.myCodeMirror.edit.refresh();
        this.myCodeMirror.right.orig.refresh()
    }

    set_main_content(the_content) {
        let codearea = document.getElementById("main_content");
        let self = this;
        postAjaxPromise("get_tile_names")
            .then(function (data) {
                    self.tile_list = data.tile_names;
                    self.populateTileList();
                    postAjaxPromise("get_module_code/" + self.resource_name, {})
                        .then((data) => {
                                self.myCodeMirror = self.createMergeArea(codearea, true, the_content, data.the_content);
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


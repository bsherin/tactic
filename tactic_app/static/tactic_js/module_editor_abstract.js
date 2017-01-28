/**
 * Created by parallels on 12/22/16.
 */


class ModuleViewerAbstract extends ResourceViewer {

    do_extra_setup() {
        this.extra_autocomplete_list = [];
        this.cmobjects_to_search = [];
        this.cmobjects = [];
        this.api_dict_by_name = {};
        this.api_dict_by_category = {};
        this.ordered_api_categories = [];
        this.this_viewer = "viewer";
        this.myCodemirror = null;
        this.myDPCodeMirror = null;
        this.current_theme = "default";
        this.api_list = null;

        this.create_api();
        this.create_keymap()

    }

    create_api() {
        let self = this;
        postAjax("get_api_dict", {}, function (data) {
            self.api_dict_by_category = data.api_dict_by_category;
            self.api_dict_by_name = data.api_dict_by_name;
            self.ordered_api_categories = data.ordered_api_categories;

            self.api_list = [];
            for (let cat of self.ordered_api_categories) {
                for (let entry of self.api_dict_by_category[cat]) {
                    self.api_list.push(entry["name"])
                }
            }

            CodeMirror.commands.autocomplete = function (cm) {
                cm.showHint({
                    hint: CodeMirror.hint.anyword, api_list: self.api_list,
                    extra_autocomplete_list: self.extra_autocomplete_list
                });
            };
        })
    }

    create_api_listeners() {
        const acc = document.getElementsByClassName("accordion");
        for (let i=0; i < acc.length; ++i) {
            let element = acc[i];
            element.onclick = function(){
            this.classList.toggle("active");
            this.nextElementSibling.classList.toggle("show");
            }
        }
    }

    create_keymap() {
        let self = this;
        CodeMirror.keyMap["default"]["Esc"] = function () {self.clearSelections()};
        let is_mac = CodeMirror.keyMap["default"].hasOwnProperty("Cmd-S");

        this.mousetrap.bind(['escape'], function (e) {
            self.clearSelections();
            e.preventDefault()
        });

        if (is_mac) {
            CodeMirror.keyMap["default"]["Cmd-S"] = function () {self.saveMe()};

            this.mousetrap.bind(['command+l'], function (e) {
                self.loadModule();
                e.preventDefault()
            });
            this.mousetrap.bind(['command+f'], function (e) {
                self.searchInAll();
                e.preventDefault()
            });
        }
        else {
            CodeMirror.keyMap["default"]["Ctrl-S"] = function () {self.saveMe()};

            this.mousetrap.bind(['ctrl+l'], function (e) {
                self.loadModule();
                e.preventDefault()
            });
            this.mousetrap.bind(['ctrl+f'], function (e) {
                self.searchInAll();
                e.preventDefault()
            });
        }
    }

    searchInAll() {
        for (let cm of this.cmobjects_to_search) {
            CodeMirror.commands.find(cm)
        }
    }

    clearSelections() {
        for (let cm of this.cmobjects_to_search)  {
            CodeMirror.commands.clearSearch(cm);
            CodeMirror.commands.singleSelection(cm);
        }
    }

    createCMArea(codearea, include_in_global_search = false, initial_value = null, first_line_number = 1) {
        let cmobject = CodeMirror(codearea, {
            lineNumbers: true,
            matchBrackets: true,
            highlightSelectionMatches: true,
            autoCloseBrackets: true,
            indentUnit: 4,
            readOnly: false
        });
        if (first_line_number != 1) {
            cmobject.setOption("firstLineNumber", first_line_number)
        }
        if (initial_value != null) {
            cmobject.setValue(initial_value);
        }

        cmobject.setOption("extraKeys", {
            Tab: function (cm) {
                let spaces = new Array(5).join(" ");
                cm.replaceSelection(spaces);
            },
            "Ctrl-Space": "autocomplete"
        });
        $(".CodeMirror").css("height", "100%");
        if (include_in_global_search) {
            this.cmobjects_to_search.push(cmobject);
        }
        this.cmobjects.push(cmobject);
        return cmobject
    }

    doSave(update_success) {
        const new_code = this.myCodeMirror.getDoc().getValue();
        const tags = $("#tags").val();
        const notes = $("#notes").val();
        let result_dict;
        let category;

        if (this.this_viewer == "viewer") {
            category = null;
            result_dict = {
                "module_name": this.resource_name,
                "category": category,
                "tags": tags,
                "notes": notes,
                "new_code": new_code,
                "last_saved": this.this_viewer
            };
        }
        else {
            category = $("#category").val();
            if (category.length == 0) {
                category = "basic"
            }
            let new_dp_code = "";
            if (this.is_mpl) {
                new_dp_code = this.myDPCodeMirror.getDoc().getValue();
            }
            result_dict = {
                "module_name": this.resource_name,
                "category": category,
                "tags": tags,
                "notes": notes,
                "exports": this.exportManager.export_list,
                "options": this.optionManager.option_dict,
                "extra_methods": this.methodManager.get_extra_functions(),
                "render_content_body": new_code,
                "is_mpl": this.is_mpl,
                "draw_plot_body": new_dp_code,
                "last_saved": this.this_viewer
            };
        }

        postAjax("update_module", result_dict, success_func);
        function success_func(data) {
            update_success(data, new_code, tags, notes, category)
        }
    }

    saveMe() {
        this.doSave(update_success);
        let self = this;
        function update_success(data, new_code, tags, notes, category) {
            if ((self.this_viewer == "creator") && (data.render_content_line_number != 0)) {
                self.myCodeMirror.setOption("firstLineNumber", data.render_content_line_number + 1);
                self.myCodeMirror.refresh()
            }
            if ((self.this_viewer == "creator") && (self.is_mpl) && (data.draw_plot_line_number != 0)) {
                self.myDPCodeMirror.setOption("firstLineNumber", data.draw_plot_line_number + 1);
                self.myDPCodeMirror.refresh()
            }

            if (data.success) {
                self.savedContent = new_code;
                self.savedTags = tags;
                self.savedNotes = notes;
                data.timeout = 2000;
                if (self.this_viewer == "creator") {
                    self.savedCategory = category;
                    if (self.is_mpl) {
                        savedDPCode = self.myDPCodeMirror.getDoc().getValue();
                    }
                }
            }
            doFlash(data)
        }
    }

    loadModule() {
        this.doSave(save_success);
        let self = this;
        function save_success(data, new_code, tags, notes, category) {
            if ((self.this_viewer == "creator") && (data.render_content_line_number != 0)) {
                self.myCodeMirror.setOption("firstLineNumber", data.render_content_line_number + 1);
                self.myCodeMirror.refresh()
            }
            if ((self.this_viewer == "creator") && (self.is_mpl) && (data.draw_plot_line_number != 0)) {
                self.myDPCodeMirror.setOption("firstLineNumber", data.draw_plot_line_number + 1);
                self.myDPCodeMirror.refresh();
            }
            if (data.success) {
                self.savedContent = new_code;
                self.savedTags = tags;
                self.savedNotes = notes;
                data.timeout = 2000;
                if (self.this_viewer == "creator") {
                    self.savedCategory = category;
                    if (self.is_mpl) {
                        self.savedDPCode = self.myDPCodeMirror.getDoc().getValue();
                    }
                }
                $.getJSON($SCRIPT_ROOT + '/load_tile_module/' + String(self.resource_name), load_success)
            }
            else {
                doFlash(data)
            }
        }

        function load_success(data) {
            if (data.success) {
                data.timeout = 2000;
            }
            doFlash(data);
            return false
        }
    }

    saveModuleAs() {
        doFlash({"message": "not implemented yet"});
        return false
    }

    showAPI() {
        if (this.this_viewer == "creator") {
            $("#resource-area").toggle();
        }

        $("#aux-area").toggle();
        resize_dom_to_bottom_given_selector("#aux-area", 20);
    }

    changeTheme() {
        if (this.current_theme == "default") {
            this.myCodeMirror.setOption("theme", "pastel-on-dark");
            if ((this.this_viewer == "creator") && this.is_mpl) {
                this.myDPCodeMirror.setOption("theme", "pastel-on-dark");
            }
            document.body.style.backgroundColor = "grey";
            this.current_theme = "dark"
        }
        else {
            this.myCodeMirror.setOption("theme", "default");
            if ((this.this_viewer == "creator") && this.is_mpl) {
                this.myDPCodeMirror.setOption("theme", "default");
            }
            document.body.style.backgroundColor = "white";
            this.current_theme = "default"
        }
    }

    dirty() {
        const the_code = this.myCodeMirror.getDoc().getValue();
        const tags = $("#tile-tags").val();
        const notes = $("#tile-notes").val();

        let is_clean = (the_code == this.savedContent) && (tags == this.savedTags) && (notes == this.savedNotes);
        if (this.this_viewer == "creator") {
            let new_methods = this.methodManager.cmobject.getValue();
            const category = $("#tile-category").val();
            is_clean = is_clean && (new_methods == this.savedMethods) && !this.optionManager.changed && !this.exportManager.changed && (category == this.savedCategory);
            if (this.is_mpl) {
                const dp_code = this.myDPCodeMirror.getDoc().getValue();
                is_clean = is_clean && (dp_code == this.savedDPCode);
            }
        }
        return !is_clean
    }

}

tactic_keymap_pcDefault = {
"Ctrl-A": "selectAll", "Ctrl-D": "deleteLine", "Ctrl-Z": "undo", "Shift-Ctrl-Z": "redo", "Ctrl-Y": "redo",
"Ctrl-Home": "goDocStart", "Ctrl-End": "goDocEnd", "Ctrl-Up": "goLineUp", "Ctrl-Down": "goLineDown",
"Ctrl-Left": "goGroupLeft", "Ctrl-Right": "goGroupRight", "Alt-Left": "goLineStart", "Alt-Right": "goLineEnd",
"Ctrl-Backspace": "delGroupBefore", "Ctrl-Delete": "delGroupAfter", "Ctrl-S": "saveMe", "Ctrl-F": "find",
"Ctrl-G": "findNext", "Shift-Ctrl-G": "findPrev", "Shift-Ctrl-F": "replace", "Shift-Ctrl-R": "replaceAll",
"Ctrl-[": "indentLess", "Ctrl-]": "indentMore",
"Ctrl-U": "undoSelection", "Shift-Ctrl-U": "redoSelection", "Alt-U": "redoSelection",
fallthrough: "basic"
};
// Very basic readline/emacs-style bindings, which are standard on Mac.

tactic_keymap_macDefault = {
"Cmd-A": "selectAll", "Cmd-D": "deleteLine", "Cmd-Z": "undo", "Shift-Cmd-Z": "redo", "Cmd-Y": "redo",
"Cmd-Home": "goDocStart", "Cmd-Up": "goDocStart", "Cmd-End": "goDocEnd", "Cmd-Down": "goDocEnd", "Alt-Left": "goGroupLeft",
"Alt-Right": "goGroupRight", "Cmd-Left": "goLineLeft", "Cmd-Right": "goLineRight", "Alt-Backspace": "delGroupBefore",
"Ctrl-Alt-Backspace": "delGroupAfter", "Alt-Delete": "delGroupAfter", "Cmd-S": "saveMe", "Cmd-F": "find",
"Cmd-G": "findNext", "Shift-Cmd-G": "findPrev", "Cmd-Alt-F": "replace", "Shift-Cmd-Alt-F": "replaceAll",
"Cmd-[": "indentLess", "Cmd-]": "indentMore", "Cmd-Backspace": "delWrappedLineLeft", "Cmd-Delete": "delWrappedLineRight",
"Cmd-U": "undoSelection", "Shift-Cmd-U": "redoSelection", "Ctrl-Up": "goDocStart", "Ctrl-Down": "goDocEnd",
fallthrough: ["basic", "emacsy"]
};
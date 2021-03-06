let consoleObject = null;


MARGIN_SIZE = 5;
INITIAL_LEFT_FRACTION = .69;

class ConsoleObjectClass {
    constructor () {
        this.saved_console_size = 150;
        const pan = this.console_panel;
        this.console_dom.css("display", "none");
        pan.find(".triangle-bottom").hide();
        pan.find(".triangle-right").show();
        pan.find("#zoom-console-button").show();
        pan.find("#unzoom-console-button").hide();
        this.console_visible = false;
        this.consoleCMObjects = {};
        this.console_dom.sortable({
            handle: '.card-header',
            tolerance: 'pointer',
            revert: 'invalid',
            forceHelperSize: true
        });
        this.add_listeners();
        this.console_panel.width();
        this.update_width(.5);
        this.exports_visible = false;
        this.console_zoomed = false;
        this.current_panel_focus = null;
        this.markdown_helper = new MarkdownHelper(".console-text", ".text-panel-output");
        this.pseudo_tile_id = null;
        this.saved_console_dom_visibility = "block";
        this.saved_error_dom_visibility = "none";
    }

    get console_panel () {
        return $("#console-panel")
    }

    get console_heading() {
        return $('#console-heading')
    }

    get console_dom () {
        return $("#console")
    }

    get error_dom () {
        return $("#console_error_log")
    }

     getOutputElement(cid) {
         return $("#" + cid).closest(".log-panel").find(".log-code-output");
     }

     getContainingPanel(cid) {
        return $("#" + cid).closest(".log-panel")
     }

     getSpinPlace(cid) {
        return $("#" + cid).closest(".log-panel").find(".console-spin-place");
     }
     getExecutionCounterElement(cid) {
        return $("#" + cid).closest(".log-panel").find(".execution-counter");
     }

    update_width(new_width_fraction) {
        const usable_width = window.innerWidth - 2 * MARGIN_SIZE - 30;
        this.current_width_fraction = new_width_fraction;
        this.console_panel.width(usable_width * new_width_fraction)
    }

    resize_to_window() {
        if (!this.console_zoomed) {
            this.update_width(this.current_width_fraction)
        }
        else {
            let gb = $("#grid-bottom");
            gb.height(window.innerHeight - $("#grid-bottom").offset().top - BOTTOM_MARGIN);
            this.update_height(gb.height());
            let saved_fraction = this.current_width_fraction;
            this.update_width(1);
            this.current_width_fraction = saved_fraction
        }

    }

    showHideExports() {
        if (this.exports_visible) {
            $("#exports-panel").css("display", "none");
            this.exports_visible = false
        }
        else {
            $("#exports-panel").css("display", "inline-block");
            exportViewerObject.update_height($("#grid-bottom").innerHeight());
            this.exports_visible = true
        }
    }

    add_listeners () {
        let self = this;
        $("#show-console-button").click(function () {
            self.expandConsole()
        });
        $("#hide-console-button").click(function () {
            self.shrinkConsole()
        });

        $("#zoom-console-button").click(function () {
            self.zoomConsole()
        });
        $("#unzoom-console-button").click(function () {
            self.unzoomConsole()
        });

        $("#show-exports-button").click(function () {
            self.showHideExports()
        });

        $("#clear-console-button").click(function () {
            self.clearConsole()
        });
        $("#delete-all-console-button").click(function () {
            self.deleteAllConsoleItems()
        });
        $("#add-blank-code-button").click(function (e) {
            self.addConsoleCodearea(e);
            e.preventDefault();
        });
        $("#add-blank-text-button").click(function (e) {
            self.addConsoleText("");
            e.preventDefault();
        });
        $("#console-error-log-button").click(function(e) {
            self.toggleConsoleErrorLog()
        });
         $("#main-error-log-button").click(function(e) {
            self.toggleMainErrorLog()
        });
        this.console_dom.on("click", ".shrink-log-button", {"cobject": this}, this.toggleLogItem);
        this.console_dom.on("click", ".expand-log-button", {"cobject": this}, this.toggleLogItem);
        this.console_dom.on("click", ".close-log-button", {"cobject": this}, this.closeLogItem);
        this.console_dom.on("click", ".run-log-button", {"cobject": this}, this.runConsoleCode);
        this.console_dom.on("click", ".convert-markdown-button", {"cobject": this}, function (e) {
            const el = $(e.target).closest(".log-panel");
            self.markdown_helper.toggleMarkdown(el);
        });
        this.console_dom.on("click", ".clear-code-button", {"cobject": this}, this.clearConsoleCode);
        this.console_dom.on("focus", ".log-panel", {"cobject": this}, this.setPanelFocus);
        this.console_dom.on("click", ".text-panel-output", {"cobject": this}, function (e) {
            const el = $(e.target).closest(".log-panel");
            self.markdown_helper.hideMarkdown(el);
        });
    }

    update_height(hgt) {
        this.console_panel.innerHeight(hgt);
        this.console_dom.outerHeight(hgt - this.console_heading.outerHeight());
        this.error_dom.outerHeight(hgt - this.console_heading.outerHeight())
    }

    turn_on_resize () {
        let self = this;
        this.console_panel.resizable({
            handles: "e",
            resize: function (event, ui) {
                const usable_width = window.innerWidth - 2 * MARGIN_SIZE - 30;
                let new_width_fraction = 1.0 * ui.size.width / usable_width;
                // self.update_width(new_width_fraction)
                ui.position.left = ui.originalPosition.left;
                self.current_width_fraction = new_width_fraction;
                exportViewerObject.update_width(1 - new_width_fraction)
            }
        });

        $("#grid-bottom").resizable({
            handles: "n",
            resize: function (event, ui) {
                ui.position.top = 0;
                if (DOC_TYPE != "notebook") {
                    tableObject.resize_table_area();
                }
                consoleObject.update_height(ui.size.height);
                exportViewerObject.update_height(ui.size.height)
            }
        });

    }

    turn_off_resize() {
        this.console_panel.resizable('destroy');
        $("#grid-bottom").resizable('destroy')
    }

    update_grid_bottom_height() {
        $("#grid-bottom").innerHeight(Math.max(exportViewerObject.exports_panel.outerHeight(), consoleObject.console_panel.outerHeight()))
    }

    get_cell_with_focus() {
        let el = document.activeElement;
        parent = $(el).closest(".log-panel");
        if (parent.length == 0) {
            return null
        }
        else {
            return parent[0]
        }
    }

    go_to_next_cell() {
        let c = this.get_cell_with_focus();
        if (c == null) {
            return
        }
        let next_cell = c.nextSibling;
        if (next_cell == null) {
            return
        }
        let code_element_list = next_cell.getElementsByClassName("console-code");
        while (code_element_list.length == 0){
            next_cell = next_cell.nextSibling;
            if (next_cell == null) {
                return
            }
            code_element_list = next_cell.getElementsByClassName("console-code");
        }
        let code_element = code_element_list[0];
        let cm_object = this.consoleCMObjects[code_element.id];
        cm_object.focus();
        cm_object.setCursor({line: 0, ch: 0})


    }

    shrinkConsole () {
        const pan = this.console_panel;
        this.saved_console_size = $("#grid-bottom").outerHeight();
        exportViewerObject.exports_body.css("display", "none");
        this.saved_console_dom_visibility = this.console_dom.css("display");
        this.saved_error_dom_visibility = this.error_dom.css("display");
        this.console_dom.css("display", "none");
        this.error_dom.css("display", "none");
        this.console_panel.outerHeight(this.console_heading.outerHeight());
        if (!is_notebook){
            exportViewerObject.exports_panel.outerHeight(this.console_heading.outerHeight());
        }
        pan.find(".triangle-bottom").hide();
        pan.find(".triangle-right").show();
        this.update_grid_bottom_height();
        if (DOC_TYPE != "notebook") {
            tableObject.resize_table_area();
        }
        this.console_visible = false;
        this.turn_off_resize()
    }

    expandConsole(){
        const pan = this.console_panel;
        const gb = $("#grid-bottom");
        gb.outerHeight(this.saved_console_size);
        pan.find(".triangle-right").hide();
        pan.find(".triangle-bottom").show();
        if (!is_notebook){
            exportViewerObject.exports_body.fadeIn();
            exportViewerObject.update_height(gb.innerHeight());
        }
        this.console_panel.outerHeight(gb.innerHeight());
        this.console_dom.css("display", this.saved_console_dom_visibility);
        this.error_dom.css("display", this.saved_error_dom_visibility);
        consoleObject.update_height(gb.innerHeight());
        this.console_visible = true;
        if (DOC_TYPE != "notebook") {
            tableObject.resize_table_area();
        }
        this.turn_on_resize();
        for (let uid in this.consoleCMObjects) {
            if (!this.consoleCMObjects.hasOwnProperty(uid)) continue;
            this.consoleCMObjects[uid].refresh()
        }
    }

    zoomConsole()  {
        const pan = this.console_panel;
        $("#exports-panel").css("display", "none");
        this.console_zoomed = true;
        $(".grid-left").hide();
        $(".grid-right").hide();
        if (!this.console_visible) {
            this.expandConsole();
            this.console_visible = false;
        }
        else {
            this.saved_console_size = $("#grid-bottom").outerHeight();
        }
        this.turn_off_resize();
        this.resize_to_window();
        pan.find(".triangle-bottom").hide();
        $("#show-exports-button").hide();
        $("#zoom-console-button").hide();
        $("#unzoom-console-button").show();
    }

    prepareNotebook() {
        const pan = this.console_panel;
        this.console_zoomed = true;
        this.expandConsole();
        this.turn_off_resize();
        let gb = $("#grid-bottom");
        gb.height(window.innerHeight - $("#grid-bottom").offset().top - BOTTOM_MARGIN);
        this.update_height(gb.height());
        let saved_fraction = this.current_width_fraction;
        this.update_width(1);
        pan.find(".triangle-bottom").hide();
        pan.find(".triangle-right").hide();
        $("#show-exports-button").hide();
        $("#zoom-console-button").hide();
        $("#unzoom-console-button").hide();
    }

    unzoomConsole() {
        this.console_zoomed = false;
        $(".grid-left").show();
        $(".grid-right").show();
        let saved_visibility = this.console_visible;
        this.expandConsole();

        if (!saved_visibility) {
            this.shrinkConsole()
        }

        if (this.exports_visible) {
            $("#exports-panel").css("display", "inline-block");
        }
        this.turn_on_resize();
        this.resize_to_window();
        $("#zoom-console-button").show();
        $("#unzoom-console-button").hide();
        $("#show-exports-button").show();
    }

    setPanelFocus(e) {
        let self = e.data.cobject;
        self.current_panel_focus = $(this);
    }

    toggleLogItem(e) {
        let self = e.data.cobject;
        const el = $(e.target).closest(".log-panel");
        el.toggleClass("log-panel-visible log-panel-invisible");
        if (el.hasClass("log-panel-visible")) {
            if (!(el.find(".console-code").length == 0)) {
                let uid = el.find(".console-code")[0].id;
                self.consoleCMObjects[uid].refresh();
            }
        }
    }

    closeLogItem(e) {
        let self = e.data.cobject;
        const el = $(e.target).closest(".log-panel");
        if (!(el.find(".console-code").length == 0)) {
            let uid = el.find(".console-code")[0].id;
            delete self.consoleCMObjects[uid];
        }
        el.remove()
    }

    runConsoleCode(e) {
        let self = e.data.cobject;
        const el = $(e.target).closest(".log-panel");
        const uid = el.find(".console-code")[0].id;
        const the_code = self.consoleCMObjects[uid].getValue();
        self.startConsoleSpinner(uid);
        postWithCallback(main_id, "exec_console_code", {"the_code": the_code, "console_id": uid})
    }


    getConsoleCMCode() {
        const result = {};
        for (let cmi in this.consoleCMObjects) {
            if (!this.consoleCMObjects.hasOwnProperty(cmi)) continue;
            result[cmi] = this.consoleCMObjects[cmi].getValue();
        }
        return result
    }

    clearConsoleCode(e) {
        let self = e.data.cobject;
        let el = $(e.target).closest(".log-panel");
        const uid = el.find(".console-code")[0].id;
        let output_el = self.getOutputElement(uid);
        output_el.html("");
    }

    check_for_element(elstring, callback) {
        const rec = function () {
            setTimeout(function () {
                if ($(elstring).length > 0) {
                    callback()
                } else
                    rec();
            }, 10);
        };
        rec();
    }

    load_jupyter_cell_data() {
        let self = this;
        postWithCallback(main_id, "get_jupyter_cell_data", {}, function (data) {
            let cell_data = data["cell_data"];

            postWithCallbackAsyncFalse("host", "print_cells_to_console",
                                    {"user_id": user_id, "cells": cell_data, "main_id": main_id},function(data) {
                self.initialize_from_cell_list(data["cells"])
            })
        })
    }

    initialize_from_cell_list(new_cell_data) {
        for (let cell_dict of new_cell_data) {
            let content = cell_dict["source"].join("");
            let unique_id = cell_dict["unique_id"];
            let self = this;
            this.check_for_element("#" + unique_id, function () {
                if (cell_dict["cell_type"] == "code") {
                    const codearea = document.getElementById(unique_id);
                    self.createConsoleCodeInCodearea(unique_id, codearea);
                    self.setConsoleCode(unique_id, content)
                }
                else {
                    self.setTextContent(unique_id, content)
                }
            })
        }
    }

    load_saved_console_code(console_html) {
        $("#console").html(console_html);
        this.bindAllTextKeys();
        let self = this;
        postWithCallback(main_id, "get_saved_console_code", {}, function (data) {
                self.initialize_from_saved_console_code(data["saved_console_code"])
        });
    }

    initialize_from_saved_console_code(saved_console_code) {
        for (let uid in saved_console_code) {
            if (!saved_console_code.hasOwnProperty(uid)) continue;
            console.log("getting codearea " + uid);
            const codearea = document.getElementById(uid);
            codearea.innerHTML = "";
            this.createConsoleCodeInCodearea(uid, codearea);
            this.consoleCMObjects[uid].doc.setValue(saved_console_code[uid]);
            this.consoleCMObjects[uid].refresh();
        }
    }

    bindTextKeys(el) {
        let self = this;
        var mousetrap = new Mousetrap(el);
        mousetrap.bind(['ctrl+enter', 'command+enter'], (e) => {
            const el = $(e.target).closest(".log-panel");
            self.markdown_helper.toggleMarkdown(el);
            self.go_to_next_cell();
            e.preventDefault()
        });
        mousetrap.bind(['ctrl+alt+c'], (e) => {
            self.addConsoleCodearea();
            e.preventDefault()
        });
        mousetrap.bind(['ctrl+alt+t'], (e) => {
            self.addConsoleText("");
            e.preventDefault()
        })
    }

    bindAllTextKeys() {
        var text_log_elements = document.getElementsByClassName("text-log-item");
        for (let el of text_log_elements) {
            this.bindTextKeys(el);
        }

    }

    addConsoleText(the_text) {
        let self = this;
        postWithCallbackAsyncFalse(main_id, "create_blank_text_area", {}, function (data) {
            if (!data.success) {
                doFlash(data)
            }
            else {
                self.check_for_element("#" + data["unique_id"], function() {
                    $($("#" + data["unique_id"]).find(".console-text")[0]).html(the_text);
                })
            }
        });
    }

    setConsoleCode(uid, the_code) {
        this.consoleCMObjects[uid].setValue(the_code);
        this.consoleCMObjects[uid].refresh()
    }

    setTextContent(uid, the_text) {
        let el = document.getElementById(uid);
        $($(el).find(".console-text")[0]).html(the_text);
        this.markdown_helper.toggleMarkdown($(el));
    }

    createConsoleCodeInCodearea(uid, codearea) {
        self = this;
        this.consoleCMObjects[uid] = CodeMirror(codearea, {
            lineNumbers: true,
            matchBrackets: true,
            highlightSelectionMatches: false,
            autoCloseBrackets: true,
            indentUnit: 4,
            readOnly: false,
            extraKeys: {
                'Ctrl-Enter': function(cm) {
                    let the_code = cm.getValue();
                    self.startConsoleSpinner(cm.tactic_uid);

                    postWithCallback(main_id, "exec_console_code",
                        {"the_code": the_code, "console_id": cm.tactic_uid},
                        function() {
                            self.go_to_next_cell();
                        })
                },
                'Cmd-Enter': function (cm) {
                    let the_code = cm.getValue();
                    self.startConsoleSpinner(cm.tactic_uid);
                    postWithCallback(main_id, "exec_console_code",
                        {"the_code": the_code, "console_id": cm.tactic_uid},
                        function () {
                            self.go_to_next_cell()
                        })
                },
                'Ctrl-Alt-C': function (cm) {
                    self.addConsoleCodearea()
                },
                'Ctrl-Alt-T': function (cm) {
                    self.addConsoleText("")
                }
            }
        });
        this.consoleCMObjects[uid].tactic_uid = uid;
    }

    /**
     * @param {{force_open:boolean, message:string}} data_object
     */
    consoleLog (data_object) {
        const force_open = data_object.force_open;
        if ((this.current_panel_focus != null) && (this.current_panel_focus.index() == -1)) {
            this.current_panel_focus = null
        }
        if (this.current_panel_focus == null) {
            this.console_dom.append(data_object.message);
        }
        else {
            this.current_panel_focus.after(data_object.message);

        }
        if (force_open && !this.console_visible && !this.console_zoomed) {
            this.expandConsole()
        }
        let child_array = this.console_dom.children();
        let new_child;
        if (this.current_panel_focus == null) {
            new_child = child_array[child_array.length - 1];
        }
        else {
            new_child = child_array[this.current_panel_focus.index() + 1];
        }
        const scripts = $(new_child).find(".resize-rerun");
        altScrollIntoView(new_child, this.console_dom[0]);
        for (let i = 0; i < scripts.length; i = i+1) {
            eval(scripts[i].innerHTML)
        }
        if ($(new_child).find(".console-text").length == 1) {
            $(new_child).find(".console-text").focus()
        }
        this.bindAllTextKeys();
     }
    /**
     * @param {{force_open:boolean, console_id:string, message:string}} data_object
     */
     consoleCodeLog (data_object) {
        const force_open = data_object.force_open;
        let el = this.getOutputElement(data_object.console_id);
        el.append(data_object.message);
        if (force_open && !this.console_visible) {
            this.expandConsole()
        }
        const scripts = el.find(".resize-rerun");
        for (let i = 0; i < scripts.length; i = i+1) {
            eval(scripts[i].innerHTML)
        }
        this.stopConsoleSpinner(data_object)
     }

     consoleCodePrint (data_object) {
        let el = this.getOutputElement(data_object.console_id);
        let mstring = data_object.message + "<br>";
        el.append(mstring)
     }

    clearConsole () {
         let self = this;
        $(".log-panel-body").each(function () {
            if ($(this).hasClass("console-code")) {
                let uid = $(this).attr("id");
                self.getOutputElement(uid).html("");
                self.getExecutionCounterElement(uid).html("[]")
            }
            else if ($(this).hasClass("error-log-panel")) {
                $($(this).closest(".log-panel")).remove()
            }
        });
        $("#console")[0].scrollTop = $("#console")[0].scrollHeight;
        postWithCallback(main_id, "clear_console_namespace", {})
     }

     deleteAllConsoleItems() {
         $("#console").html("")
     }

    addConsoleCodearea(e) {
        let self = this;
        postWithCallback(main_id, "create_console_code_area", {}, function(data) {
            if (!data.success) {
                doFlash(data)
            }
            else {
                self.check_for_element("#" + data["unique_id"], function () {
                    const codearea = document.getElementById(data["unique_id"]);
                    self.createConsoleCodeInCodearea(data["unique_id"], codearea);
                    self.consoleCMObjects[data["unique_id"]].focus()
                })
            }
        });
    }

    startConsoleSpinner (uid) {
        this.getOutputElement(uid).html("");
        this.getContainingPanel(uid).addClass("running");
        this.getSpinPlace(uid).html(console_spinner_html);
    }

    stopConsoleSpinner (data_object) {
        let uid = data_object.console_id;
        this.getContainingPanel(uid).removeClass("running");
        this.getSpinPlace(uid).html("");
        this.getExecutionCounterElement(uid).html("[" + String(data_object["execution_count"] + "]"))
    }

    addConsoleCodeWithCode(the_code) {
        let self = this;
        postWithCallbackAsyncFalse(main_id, "create_console_code_area", {}, function(data) {
            if (!data.success) {
                doFlash(data)
            }
            else {
                self.check_for_element("#" + data["unique_id"], function () {
                    const codearea = document.getElementById(data["unique_id"]);
                    self.createConsoleCodeInCodearea(data["unique_id"], codearea);
                    self.setConsoleCode(data["unique_id"], the_code)
                })
            }
        })
    }

    toggleConsoleErrorLog  () {
         if ($("#console_error_log").css("display") == "none") {
             this.getPseudoShowConsoleErrorLog()
         }
         else {
             this.hideConsoleErrorLog()
         }
    }

    toggleMainErrorLog  () {
         if ($("#console_error_log").css("display") == "none") {
             this.showMainErrorLog()
         }
         else {
             this.hideConsoleErrorLog()
         }
    }

    showMainErrorLog () {
         self = this;
         if (!this.console_visible && !this.console_zoomed) {
            this.expandConsole()
        }
         postWithCallback("host", "get_container_log", {"container_id": main_id}, function (res) {
            const the_html = "<pre>" + res["log_text"] + "</pre>";
            $("#console_error_log").html(the_html);
            self.console_dom.hide("blind");
            $("#console_error_log").show("blind");
     })
}

    showConsoleErrorLog() {
         self = this;
         if (!this.console_visible && !this.console_zoomed) {
            this.expandConsole()
        }
         postWithCallback("host", "get_container_log", {"container_id": self.pseudo_tile_id}, function (res) {
                const the_html = "<pre>" + res["log_text"] + "</pre>";
                $("#console_error_log").html(the_html);
                self.console_dom.hide("blind");
                $("#console_error_log").show("blind");
         })
    }


    getPseudoShowConsoleErrorLog() {
         const self = this;
         if (self.pseudo_tile_id == null) {
              postWithCallback(main_id, "get_pseudo_tile_id", {}, function (res) {
                  self.pseudo_tile_id = res["pseudo_tile_id"];
                  self.showConsoleErrorLog()
              })
         }
         else {
            self.showConsoleErrorLog()
         }
    }

    hideConsoleErrorLog() {
        $("#console_error_log").hide("blind",);
        this.console_dom.show("blind");
    }

}

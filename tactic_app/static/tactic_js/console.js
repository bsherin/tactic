let consoleObject = null;

class ConsoleObjectClass {
    constructor () {
        this.saved_console_size = 150;
        const pan = this.console_panel;
        this.console_dom.css("display", "none");
        pan.find(".triangle-bottom").hide();
        pan.find(".triangle-right").show();
        this.console_visible = false;
        this.consoleCMObjects = {};
        this.console_dom.sortable({
            handle: '.panel-heading',
            tolerance: 'pointer',
            revert: 'invalid',
            forceHelperSize: true
        });
        this.add_listeners();
        this.console_panel.width();
        this.update_width(.5);
        this.exports_visible = false;

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

    update_width(new_width_fraction) {
        const usable_width = window.innerWidth - 2 * MARGIN_SIZE - 30;
        this.current_width_fraction = new_width_fraction;
        this.console_panel.width(usable_width * new_width_fraction)
    }

    resize_to_window() {
        this.update_width(this.current_width_fraction)
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

        $("#show-exports-button").click(function () {
            self.showHideExports()
        });

        $("#open-log-button").click(function () {
            self.openLogWindow()
        });
        $("#clear-console-button").click(function () {
            self.clearConsole()
        });
        $("#add-blank-code-button").click(function () {
            self.addConsoleCodearea()
        });
        $("#add-blank-text-button").click(function () {
            self.addBlankConsoleText()
        });
        this.console_dom.on("click", ".close-log-button", {"cobject": this}, this.closeLogItem);
        this.console_dom.on("click", ".run-log-button", {"cobject": this}, this.runConsoleCode);
        this.console_dom.on("click", ".clear-code-button", {"cobject": this}, this.clearConsoleCode);
    }

    update_height(hgt) {
        this.console_dom.outerHeight(hgt - this.console_heading.outerHeight())
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
                tableObject.resize_table_area();
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

    shrinkConsole () {
        const pan = this.console_panel;
        this.saved_console_size = $("#grid-bottom").outerHeight();
        exportViewerObject.exports_body.css("display", "none");
        this.console_dom.css("display", "none");
        pan.find(".triangle-bottom").hide();
        pan.find(".triangle-right").show();
        this.update_grid_bottom_height();
        tableObject.resize_table_area();
        this.console_visible = false;
        this.turn_off_resize()
    }

    expandConsole(){
        const pan = this.console_panel;
        const gb = $("#grid-bottom");
        gb.outerHeight(this.saved_console_size);
        pan.find(".triangle-right").hide();
        pan.find(".triangle-bottom").show();
        exportViewerObject.exports_body.fadeIn();
        this.console_dom.fadeIn();
        consoleObject.update_height(gb.innerHeight());
        exportViewerObject.update_height(gb.innerHeight());
        this.console_visible = true;
        tableObject.resize_table_area();
        this.turn_on_resize();
        for (let uid in this.consoleCMObjects) {
            if (!this.consoleCMObjects.hasOwnProperty(uid)) continue;
            this.consoleCMObjects[uid].refresh()
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
        let el = $(e.target).closest(".log-panel");
        const uid = el.find(".console-code")[0].id;
        el = $("#" + uid).parent().find(".log-code-output");
        el.html("");
    }

    addBlankConsoleText() {
        const print_string = "<div contenteditable='true'></div>";
        const task_data = {"print_string": print_string};
        postWithCallback(main_id, "print_to_console_event", task_data, function(data) {
            if (!data.success) {
                doFlash(data)
            }
        })
    }

    setConsoleCode(uid, the_code) {
        this.consoleCMObjects[uid].setValue(the_code);
        this.consoleCMObjects[uid].refresh()
    }

    createConsoleCodeInCodearea(uid, codearea) {
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
                    postWithCallback(main_id, "exec_console_code", {"the_code": the_code, "console_id": cm.tactic_uid})
                },
                'Cmd-Enter': function (cm) {
                    let the_code = cm.getValue();
                    postWithCallback(main_id, "exec_console_code", {"the_code": the_code, "console_id": cm.tactic_uid})
                }
            }
        });
        this.consoleCMObjects[uid].tactic_uid = uid;
        $(codearea).find(".CodeMirror").resizable({handles: "se"});
        $(codearea).find(".CodeMirror").height(100)
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
    /**
     * @param {{force_open:boolean, message_string:string}} data_object
     */
    consoleLog (data_object) {
        const force_open = data_object.force_open;
        this.console_dom.append(data_object.message_string);
        if (force_open && !this.console_visible) {
            this.expandConsole()
        }
        this.console_dom[0].scrollTop = this.console_dom[0].scrollHeight;
        const child_array = this.console_dom.children();
        const last_child = child_array[child_array.length - 1];
        const scripts = $(last_child).find(".resize-rerun");
        for (let i = 0; i < scripts.length; i = i+1) {
            eval(scripts[i].innerHTML)
        }
     }
    /**
     * @param {{force_open:boolean, console_id:string, message_string:string}} data_object
     */
     consoleCodeLog (data_object) {
        const force_open = data_object.force_open;
        let el = $("#" + data_object.console_id).parent().find(".log-code-output");
        el.html(data_object.message_string);
        if (force_open && !this.console_visible) {
            this.expandConsole()
        }
        const scripts = el.find(".resize-rerun");
        for (let i = 0; i < scripts.length; i = i+1) {
            eval(scripts[i].innerHTML)
        }
        this.stopConsoleSpinner(data_object.console_id)
     }

    clearConsole () {
        $(".log-panel-body").each(function () {
            if ($(this).hasClass("console-code")) {
                let uid = $(this).attr("id");
                let el = $("#" + uid).parent().find(".log-code-output");
                el.html("")
            }
            else {
                $($(this).closest(".log-panel")).remove()
            }
        });
        $("#console")[0].scrollTop = $("#console")[0].scrollHeight
     }

    addConsoleCodearea() {
        let self = this;
        postWithCallback(main_id, "create_console_code_area", {}, function(data) {
            if (!data.success) {
                doFlash(data)
            }
            else {
                self.check_for_element("#" + data["unique_id"], function () {
                    const codearea = document.getElementById(data["unique_id"]);
                    self.createConsoleCodeInCodearea(data["unique_id"], codearea)
                })
            }
        })
    }

    startConsoleSpinner (uid) {
        let cc = $("#" + uid).parent();
        cc.find(".console-spin-place").html(console_spinner_html);
    }

    stopConsoleSpinner (uid) {
        let cc = $("#" + uid).parent();
        cc.find(".console-spin-place").html("");
    }

    addConsoleCodeWithCode(the_code) {
        let self = this;
        postWithCallback(main_id, "create_console_code_area", {}, function(data) {
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

    openLogWindow() {
        const task_data = {
            "console_html": this.console_dom.html()
        };
        postWithCallback(main_id, "open_log_window", task_data)
    }

}
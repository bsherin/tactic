
const tile_dict = {};
const MAX_STARTING_TILE_WIDTH = 450;

const using_touch = "ontouchend" in document;

if (using_touch) {
    click_event = "touchstart"
}
else {
    click_event = "click"
}


class TileObject {
    constructor(tile_id, html, is_new_tile, tile_name) {
        this.tile_id = tile_id;
        this.codeMirrorObjects = {};
        this.tile_name = tile_name;
        this.spinner = null;
        this.tileHeaderButtons = {
            "tile-close": "closeMe",
            "tile-reload": "reloadMe",
            "tile-log-params": "logParams",
            "tile-logme": "logMe",
            "tile-container-log": "toggleContainerLog",
            "tile-expandme": "expandMe",
            "tile-shrinkme": "shrinkMe",
            "tile-options": "toggleOptions"
        };

        // tactic_todo This line can give an error if there's a problem with embedded javascript code
        try {
            $("#tile-div").append(html);  // This append has to be after the flip or weird things happen
        }
        catch (err) {
            console.log(`Got an error appending the html for tile ${this.tile_name}: ${err.message}`)
        }

        const self = this;
        $(this.full_selector() + " .codearea").each(function () {
            const theId = $(this).attr("id");
            self.codeMirrorObjects[theId] = CodeMirror.fromTextArea(this, {
                matchBrackets: true,
                highlightSelectionMatches: false,
                autoCloseBrackets: true,
                indentUnit: 4
            });
            const cm_element = $($(this).siblings(".CodeMirror")[0]);
            cm_element.resizable({handles: "se"});
            cm_element.height(100)
        });
        $(this.full_selector()).resizable({
            handles: "se",
            resize: self.resize_tile_area,
            stop: function () {
                self.broadcastTileSize();
            }
        });
        // tactic_todo Is this stuff with my_tile_id really needed? Note that the id has the tile_id.
        jQuery.data($(this.full_selector())[0], "my_tile_id", this.tile_id);
        this.listen_for_clicks();

        if (is_new_tile) {
            $(this.full_selector()).find(".triangle-right").hide();
            const starting_width = $(this.full_selector()).outerWidth();
            if (starting_width > MAX_STARTING_TILE_WIDTH) {
                $(this.full_selector()).outerWidth(MAX_STARTING_TILE_WIDTH)
            }
            if (table_is_shrunk) {
                $(this.full_selector()).addClass("tile-panel-float");  // This has to happen for do_resize
            }
            this.do_resize();
            this.broadcastTileSize();
        }
        else {
            const scripts = $(this.full_selector()).find(".tile-display-area").find("script");
            for (let i = 0; i < scripts.length; i = i + 1) {
                eval(scripts[i].innerHTML)
            }
            this.saved_size = $(this.full_selector()).outerHeight()
        }
    }
    full_selector () {
        return "#" + this.tile_id;
    }

    submitOptions () {
        const data = {};
        data["main_id"] = main_id;
        const self = this;
        $(this.full_selector() + " .CodeMirror").each(function () {
            const theTextArea = $($(this).siblings(".codearea")[0]);
            const theId = theTextArea.attr("id");
            const theCode = self.codeMirrorObjects[theId].getValue();
            theTextArea.text(theCode)
        });
        $(this.full_selector() + " .back input").each(function () {
                if (this.type == "checkbox") {
                    data[$(this).attr('id')] = this.checked
                }
                else {
                    data[$(this).attr('id')] = $(this).val()
                }
            }
        );
        $(this.full_selector() + " .back select").each(function() {
            if ($(this).find(":selected").length == 0) {
                data[$(this).attr("id")] = ""
            }
            else {
                data[$(this).attr("id")] = $(this).find(":selected").val()
            }
        });
        $(this.full_selector() + " .back select :selected").each(function () {
            data[$(this).parent().attr('id')] = $(this).val()
        }
        );
        $(this.full_selector() + " .back textarea").each(function () {
            data[$(this).attr('id')] = $(this).val()
            }
        );

        data["tile_id"] = this.tile_id;
        dirty = true;
        broadcast_event_to_server("UpdateOptions", data)
    }

    get_current_html() {
        return $(this.full_selector() + " .tile-display-area").html();
    }

    broadcastTileSize () {
        const w = $(this.full_selector() + " .tile-display-area").width();
        const h = $(this.full_selector() + " .tile-display-area").height();
        const full_tile_width = $(this.full_selector()).outerWidth();
        const full_tile_height = $(this.full_selector()).outerHeight();
        const header_height = $(this.full_selector() + " .tile-panel-heading").outerHeight();
        const front_height = $(this.full_selector() + " .front").outerHeight();
        const front_width = $(this.full_selector() + " .front").outerWidth();
        const back_height = $(this.full_selector() + " .back").outerHeight();
        const back_width = $(this.full_selector() + " .back").outerWidth();
        const tile_log_height = $(this.full_selector() + " .tile-log").outerHeight();
        const tile_log_width = $(this.full_selector() + " .tile-log").outerWidth();
        const tda_height = $(this.full_selector() + " .tile-display-area").outerHeight();
        const tda_width = $(this.full_selector() + " .tile-display-area").outerWidth();
        const the_margin = $(".tile-display-area").css("margin-left").replace("px", "");
        const data_dict = {
            "tile_id": this.tile_id, "width": w, "height": h, "header_height": header_height,
            "full_tile_width": full_tile_width, "full_tile_height": full_tile_height,
            "front_height": front_height, "front_width": front_width,
            "tile_log_height": tile_log_height, "tile_log_width": tile_log_width,
            "back_height": back_height, "back_width": back_width,
            "tda_height": tda_height, "tda_width": tda_width,
            "margin": the_margin
        };
        dirty = true;
        postWithCallback(this.tile_id, "TileSizeChange", data_dict)
    }

    do_resize (){
        const el = $(this.full_selector());
        const ui = {
            "element": el,
            "size": {"width": el.outerWidth(), "height": el.outerHeight()}
        };
        this.resize_tile_area(null, ui);
    }

    reloadMe () {
        const self = this;
        const data_dict = {"tile_id": this.tile_id, "tile_name": this.tile_name};
        this.startSpinner();
        postWithCallback(main_id, "reload_tile", data_dict, reload_success);

        function reload_success (data) {
            if (data.success) {
                self.displayFormContent(data);
                dirty = true;
                if (data.options_changed) {
                    self.stopSpinner();
                    self.showOptions()
                }
                else {
                    self.spin_and_refresh()
                }
            }
            self.start_spinner()
        }
    }

    logParams () {
        const data_dict = {};
        data_dict["main_id"] = main_id;
        data_dict["tile_id"] = this.tile_id;
        postWithCallback(this.tile_id, "LogParams", data_dict)
    }

    logMe () {
        const data_dict = {};
        data_dict["main_id"] = main_id;
        data_dict["tile_id"] = this.tile_id;
        postWithCallback(this.tile_id, "LogTile", data_dict)
    }

    setTileSize (data) {
        const el = $(this.full_selector());
        el.width(data.width);
        el.height(data.height);
        const ui = {
            "element": el,
            "size": data
        };
        dirty = true;
        this.resize_tile_area(null, ui);
    }

    displayTileContent  (data) {
        $(this.full_selector() + " .tile-display-area").html(data["html"]);
        const sortable_tables = $(this.full_selector() + " table.sortable");
        $.each(sortable_tables, function (index, the_table) {
            sorttable.makeSortable(the_table)
        });
        dirty = true;
        this.hideOptions();
        this.hideTileLog();
    }

    displayFormContent  (data) {
        $(this.full_selector() + " #form-display-area").html(data["html"]);
        let self = this;
        $(this.full_selector() + " .codearea").each(function () {
            const theId = $(this).attr("id");
            self.codeMirrorObjects[theId] = CodeMirror.fromTextArea(this, {
                matchBrackets: true,
                highlightSelectionMatches: false,
                autoCloseBrackets: true,
                indentUnit: 4
            });
            const cm_element = $($(this).siblings(".CodeMirror")[0]);
            cm_element.resizable({handles: "se"});
            cm_element.height(100)
        });
    }

    refreshCodeAreas () {
        let self = this;
        $(this.full_selector() + " .codearea").each(function () {
            const theId = $(this).attr("id");
            self.codeMirrorObjects[theId].refresh()
        })
    }

    startSpinner () {
        $(this.full_selector() + " #spin-place").html(spinner_html);
    }

    stopSpinner  () {
        $(this.full_selector() + " #spin-place").html("");
    }

    execute_d3_func(data) {
        const w = $(this.full_selector() + " .tile-display-area").width();
        const h = $(this.full_selector() + " .tile-display-area").height();
        console.log(String(data.arg_dict));
        try {
            this.d3func(data.selector + " .d3plot", w, h, data.arg_dict);
            postWithCallback(this.tile_id, "set_current_html", {"current_html": this.get_current_html()})
        }
        catch(err) {
            doFlash({"alert-type": "alert-warning", "message": "Error executing javascript function: " + err.message})
        }
    }

    set_d3_javascript(data) {
        try{
            eval("this.d3func = " + data["javascript_code"])
        }
        catch(err) {
            doFlash({"alert-type": "alert-warning", "message": "Error evaluating javascript: " + err.message})
        }

    }

    closeMe (){
        const my_tile_id = this.tile_id;
        dirty = true;
        $(this.full_selector()).fadeOut("slow", function () {
            $(this).remove();
            const data_dict = {};
            data_dict["main_id"] = main_id;
            data_dict["tile_id"] = my_tile_id;
            postWithCallback(main_id, "RemoveTile", data_dict);
            delete tile_dict[my_tile_id]
        });
    }

    shrinkMe  (callback){
        dirty = true;
        const el = $(this.full_selector());
        // Don't want to shrink if already shrunk. This was getting called twice on mobile
        if ($(this.full_selector()).find(".tile-body").css("display") != "none") {
            this.saved_size = el.outerHeight();
            postWithCallback(this.tile_id, "ShrinkTile", {});
            el.find(".tile-body").fadeOut("fast", function () {
                const hheight = el.find(".tile-panel-heading").outerHeight();
                el.outerHeight(hheight);
                el.resizable('destroy');
                el.find(".triangle-bottom").hide();
                el.find(".triangle-right").show();
                if (arguments.length == 1) {
                    callback()
                }
            })
        }

    }

    expandMe  (){
        dirty = true;
        const el = $(this.full_selector());
        // The next line prevents calling this twice
        if ($(this.full_selector()).find(".tile-body").css("display") == "none") {
            el.outerHeight(this.saved_size);
            $(this.full_selector()).find(".triangle-right").hide();
            $(this.full_selector()).find(".triangle-bottom").show();
            $(this.full_selector()).find(".tile-body").fadeIn();
            const self = this;
            postWithCallback(this.tile_id, "ExpandTile", {});
            $(this.full_selector()).resizable({
                    handles: "se",
                    resize: self.resize_tile_area,
                    stop  () {
                        self.broadcastTileSize()
                    }
                });
        }
    }

    resize_tile_area  (event, ui) {
        const header_element = ui.element.children(".panel-heading")[0];
        const hheight = $(header_element).outerHeight();
        const front_element = ui.element.find(".front")[0];
        $(front_element).outerHeight(ui.size.height - hheight);
        $(front_element).outerWidth(ui.size.width);
        const display_area = ui.element.find(".tile-display-area");
        const the_margin = $(".tile-display-area").css("margin-left").replace("px", "");
        $(display_area).outerHeight(ui.size.height - hheight - the_margin * 2);
        $(display_area).outerWidth(ui.size.width - the_margin * 2);
        const back_element = ui.element.find(".back")[0];
        $(back_element).outerHeight(ui.size.height - hheight);
        $(back_element).outerWidth(ui.size.width);
        const pbody = ui.element.find(".panel-body")[0];
        const log_element = ui.element.find(".tile-log")[0];
        $(log_element).outerHeight(ui.size.height - hheight);
        $(log_element).outerWidth(ui.size.width);

        $(pbody).outerHeight(ui.size.height - hheight);
        const computed_width = ui.element.width();
        const computed_height = ui.element.height();
        ui.element.width(computed_width);
        ui.element.height(computed_height);
        const scripts = $(ui.element.find(".tile-display-area")).find(".resize-rerun");
        for (let i = 0; i < scripts.length; i = i+1) {
            eval(scripts[i].innerHTML)
        }
    }

    toggleOptions  (){
        if ($("#tile_body_" + this.tile_id + " .back")[0].style.display == "none") {
            this.showOptions();
        }
        else {
            this.hideOptions();
        }
    }

    hideOptions  (){
        $("#tile_body_" + this.tile_id + " .back").hide("blind");

    }
    showOptions  (){
        $("#tile_body_" + this.tile_id + " .back").show("blind");
        this.refreshCodeAreas()
    }

    toggleContainerLog  () {
        if ($("#tile_body_" + this.tile_id + " .tile-log")[0].style.display == "none") {
            this.showTileLog()
        }
        else {
            this.hideTileLog()
        }
    }

    showTileLog () {
        const self = this;
        postWithCallback("host", "get_container_log", {"container_id": self.tile_id}, function (res) {
            const the_html = "<pre>" + res["log_text"] + "</pre>";
            $("#tile_body_" + self.tile_id + " .tile-log-area").html(the_html);
            $("#tile_body_" + self.tile_id + " .tile-log").show("blind");
        })
    }

    hideTileLog  () {
        $("#tile_body_" + this.tile_id + " .tile-log").hide("blind");
    }

    spin_and_refresh  () {
        // I'm chaining these with callbacks just to make sure they don't get out of order
        const self = this;
        postWithCallback(self.tile_id, "StartSpinner", {}, function () {
            postWithCallback(self.tile_id, "RefreshTile", {}, function() {
                postWithCallback(self.tile_id, "StopSpinner", {})
            })
        })

    }

    refreshFromSave  (final_callback) {
        postWithCallback(self.tile_id, "SetSizeFromSave", {}, function() {
            postWithCallback(self.tile_id, "RefreshTileFromSave", {}, final_callback)
        })
    }

    listen_for_clicks () {
        const full_frontal_selector = this.full_selector() + " .front";
        let the_id;

        $(this.full_selector()).on(click_event, ".header-but", function (e) {
            the_id = $(e.target).closest(".tile-panel").attr("id");
            const tobject = tile_dict[the_id];
            if ($(e.target).hasClass("header-but")){ // this is necessary to make this work on firefox
                the_id = e.target.id
            }
            else {
                the_id = e.target.parentElement.id
            }
            tobject[tobject.tileHeaderButtons[the_id]]()
        });

        $(full_frontal_selector).on(click_event, '.word-clickable', function(e) {
            const tile_id = jQuery.data(e, "my_tile_id");
            const s = window.getSelection();
            const range = s.getRangeAt(0);
            const node = s.anchorNode;
            while ((range.toString().indexOf(' ') !== 0) && (range.startOffset !== 0)) {
              range.setStart(node, (range.startOffset - 1));
            }
            const nlen = node.textContent.length;
            if (range.startOffset !== 0) {
              range.setStart(node, range.startOffset + 1);
            }

            do {
              range.setEnd(node, range.endOffset + 1);

            } while (range.toString().indexOf(' ') == -1 &&
              range.toString().trim() !== '' &&
              range.endOffset < nlen);

            const str = range.toString().trim();
              const data_dict = {};
              const p = $(e.target).closest(".tile-panel")[0];
              data_dict["tile_id"] = $(p).data("my_tile_id");
              data_dict["clicked_text"] = str;
              data_dict.main_id = main_id;
              data_dict.doc_name = tableObject.current_spec.doc_name;
            if (DOC_TYPE == "table") {
                data_dict.active_row_index = tableObject.active_row;
                data_dict.active_row_id = tableObject.active_row_id;
            }
            else {
                data_dict.active_row_id = tableObject.active_line;
            }
              postWithCallback(data_dict["tile_id"], "TileWordClick", data_dict)
        });

        $(full_frontal_selector).on(click_event, '.cell-clickable', function(e) {
            const tile_id = jQuery.data(e, "my_tile_id");
            const txt = $(this).text();

            const data_dict = {};
            const p = $(e.target).closest(".tile-panel")[0];
            data_dict["tile_id"] = $(p).data("my_tile_id");
            data_dict["clicked_cell"] = txt;
            data_dict.main_id = main_id;
            data_dict.doc_name = tableObject.current_spec.doc_name;
            if (DOC_TYPE == "table") {
                data_dict.active_row_index = tableObject.active_row;
                data_dict.active_row_id = tableObject.active_row_id;
            }
            else {
                data_dict.active_row_id = tableObject.active_line;
            }
            postWithCallback(data_dict["tile_id"], "TileCellClick", data_dict)
        });

        $(full_frontal_selector).on(click_event, '.element-clickable', function(e) {
            const tile_id = jQuery.data(e, "my_tile_id");

            const data_dict = {};
            const p = $(e.target).closest(".tile-panel")[0];
            data_dict["tile_id"] = $(p).data("my_tile_id");
            const dset = e.target.dataset;
            data_dict.dataset = {};
            for (let key in dset) {
                if (!dset.hasOwnProperty(key)) continue;
                data_dict.dataset[key] = dset[key]
            }
            data_dict.main_id = main_id;
            data_dict.doc_name = tableObject.current_spec.doc_name;
            if (DOC_TYPE == "table") {
                data_dict.active_row_index = tableObject.active_row;
                data_dict.active_row_id = tableObject.active_row_id;
            }
            else {
                data_dict.active_row_id = tableObject.active_line;
            }
            postWithCallback(data_dict["tile_id"], "TileElementClick", data_dict)
        });

        $(full_frontal_selector).on(click_event, '.row-clickable', function(e) {
            const cells = $(this).children();
            const row_vals = [];
            cells.each(function() {
                row_vals.push($(this).text())
            });
            const tile_id = jQuery.data(e, "my_tile_id");

            const data_dict = {};
            const p = $(e.target).closest(".tile-panel")[0];
            data_dict["tile_id"] = $(p).data("my_tile_id");
            data_dict["clicked_row"] = row_vals;
            data_dict.main_id = main_id;
            data_dict.doc_name = tableObject.current_spec.doc_name;
            if (DOC_TYPE == "table") {
                data_dict.active_row_index = tableObject.active_row;
                data_dict.active_row_id = tableObject.active_row_id;
            }
            else {
                data_dict.active_row_id = tableObject.active_line;
            }
            postWithCallback(data_dict["tile_id"], "TileRowClick", data_dict)
        });

        $(full_frontal_selector).on(click_event, 'button', function(e) {
            const p = $(e.target).closest(".tile-panel")[0];
            const data = {};
            data["tile_id"] = $(p).data("my_tile_id");
            data["button_value"] = e.target.value;
            data.main_id = main_id;
            data.doc_name = tableObject.current_spec.doc_name;
            if (DOC_TYPE == "table") {
                data.active_row_index = tableObject.active_row;
                data.active_row_id = tableObject.active_row_id;
            }
            else {
                data.active_row_id = tableObject.active_line;
            }
            postWithCallback(data["tile_id"], "TileButtonClick", data)
        });

        $(full_frontal_selector).on('submit', 'form', function(e) {
            const form_data = {};
            let the_form = e.target;
            let data = {};
            const p = $(e.target).closest(".tile-panel")[0];
            data["tile_id"] = $(p).data("my_tile_id");
            for (let i = 0; i < the_form.length; i += 1) {
                form_data[the_form[i]["name"]] = the_form[i]["value"]
            }
            data.main_id = main_id;
            data.doc_name = tableObject.current_spec.doc_name;
            if (DOC_TYPE == "table") {
                data.active_row_index = tableObject.active_row;
                data.active_row_id = tableObject.active_row_id;
            }
            else {
                data.active_row_id = tableObject.active_line;
            }
            data["form_data"] = form_data;
            postWithCallback(data["tile_id"], "TileFormSubmit", data);
            return false

        });

        $(full_frontal_selector).on("change", 'select', function (e) {
            const p = $(e.target).closest(".tile-panel")[0];
            const data = {};
            data["tile_id"] = $(p).data("my_tile_id");
            data.select_value = e.target.value;
            data.main_id = main_id;
            data.doc_name = tableObject.current_spec.doc_name;
            if (DOC_TYPE == "table") {
                data.active_row_index = tableObject.active_row;
                data.active_row_id = tableObject.active_row_id;
            }
            else {
                data.active_row_id = tableObject.active_line;
            }
            postWithCallback(data["tile_id"], "SelectChange", data)
        });


        $(full_frontal_selector).on('change', 'textarea', function(e) {
            const p = $(e.target).closest(".tile-panel")[0];
            const data = {};
            data["tile_id"] = $(p).data("my_tile_id");
            data["text_value"] = e.target.value;
            postWithCallback(data["tile_id"], "TileTextAreaChange", data)
        });
    }

}
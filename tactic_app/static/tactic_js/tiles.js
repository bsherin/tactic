
var tile_dict = {};
var MAX_STARTING_TILE_WIDTH = 450;

function showZoomedImage(el) {
    var src = el.src;
    var image_string = "<img class='output-plot' src='" + src +  "' lt='Image Placeholder'>";
    $("#image-modal .modal-body").html(image_string);
    $("#image-modal").modal()
}

// tactic_change tile_name
function TileObject(tile_id, html, is_new_tile, tile_name) {
    this.tile_id = tile_id;
    this.codeMirrorObjects = {};
    this.tile_name = tile_name;

    $("#tile-div").append(html);  // This append has to be after the flip or weird things happen

    self = this;
    $(this.full_selector() + " .codearea").each( function () {
        theId = $(this).attr("id");
        self.codeMirrorObjects[theId] = CodeMirror.fromTextArea(this, {
            matchBrackets: true,
            autoCloseBrackets: true,
            indentUnit: 4
        });
        cm_element = $($(this).siblings(".CodeMirror")[0]);
        cm_element.resizable({handles: "se"});
        cm_element.height(100)
    });
    $(this.full_selector()).resizable({
        handles: "se",
        resize: self.resize_tile_area,
        stop: function () {
            self.broadcastTileSize()
        }
    });
    // tactic_todo Is this stuff with my_tile_id really needed? Note that the id has the tile_id.
    jQuery.data($(this.full_selector())[0], "my_tile_id", this.tile_id);
    this.listen_for_clicks();

    if (is_new_tile) {
        $(this.full_selector()).find(".triangle-right").hide();
        var starting_width = $(this.full_selector()).outerWidth();
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
        var scripts = $(this.full_selector()).find(".tile-display-area").find("script");
        for (var i = 0; i < scripts.length; i = i+1) {
            eval(scripts[i].innerHTML)
        }
        this.saved_size = $(this.full_selector()).outerHeight()
    }
}

TileObject.prototype = {
    spinner: null,
    full_selector: function() {
        return "#" + this.tile_id;
    },
    submitOptions: function () {
        var data = {};
        data["main_id"] = main_id;
        var self = this;
        $(this.full_selector() + " .CodeMirror").each(function () {
            var theTextArea = $($(this).siblings(".codearea")[0]);
            var theId = theTextArea.attr("id");
            var theCode = self.codeMirrorObjects[theId].getValue();
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
        $(this.full_selector() + " .back select :selected").each(function () {
                data[$(this).parent().attr('id')] = $(this).text()
            }
        );
        $(this.full_selector() + " .back textarea").each(function () {
            data[$(this).attr('id')] = $(this).val()
            }
        );

        data["tile_id"] = this.tile_id;
        dirty = true;
        broadcast_event_to_server("UpdateOptions", data)
    },
    broadcastTileSize: function() {
        var w = $(this.full_selector() + " .tile-display-area").width();
        var h = $(this.full_selector() + " .tile-display-area").height();
        var full_tile_width =  $(this.full_selector()).outerWidth();
        var full_tile_height = $(this.full_selector()).outerHeight();
        var header_height = $(this.full_selector() + " .tile-panel-heading").outerHeight();
        var front_height = $(this.full_selector() + " .front").outerHeight();
        var front_width = $(this.full_selector() + " .front").outerWidth();
        var back_height = $(this.full_selector() + " .back").outerHeight();
        var back_width = $(this.full_selector() + " .back").outerWidth();
        var tile_log_height = $(this.full_selector() + " .tile-log").outerHeight();
        var tile_log_width = $(this.full_selector() + " .tile-log").outerWidth();
        var tda_height = $(this.full_selector() + " .tile-display-area").outerHeight();
        var tda_width = $(this.full_selector() + " .tile-display-area").outerWidth();
        var the_margin = $(".tile-display-area").css("margin-left").replace("px", "");
        var data_dict = {"tile_id": this.tile_id, "width": w, "height": h, "header_height": header_height,
            "full_tile_width": full_tile_width, "full_tile_height": full_tile_height,
            "front_height": front_height, "front_width": front_width,
            "tile_log_height": tile_log_height, "tile_log_width": tile_log_width,
            "back_height": back_height, "back_width": back_width,
            "tda_height": tda_height, "tda_width": tda_width,
            "margin": the_margin
        };
        dirty = true;
        postWithCallback(this.tile_id, "TileSizeChange", data_dict)
    },
    do_resize: function(){
        var el = $(this.full_selector());
        var ui = {
            "element": el,
            "size": {"width": el.outerWidth(), "height": el.outerHeight()}
        };
        this.resize_tile_area(null, ui);
    },

    reloadMe: function() {
        var self = this;
        var data_dict = {"tile_id": this.tile_id};
        postWithCallback(main_id, "reload_tile", data_dict, reload_success);

        function reload_success (data) {
            if (data.success) {
                self.displayFormContent(data);
                self.spin_and_refresh();
                dirty = true;
            }
        }
    },

    logParams: function() {
        data_dict = {};
        data_dict["main_id"] = main_id;
        data_dict["tile_id"] = this.tile_id;
        postWithCallback(this.tile_id, "LogParams", data_dict)
    },

    logMe: function() {
        data_dict = {};
        data_dict["main_id"] = main_id;
        data_dict["tile_id"] = this.tile_id;
        postWithCallback(this.tile_id, "LogTile", data_dict)
    },

    showContainerLog: function() {
        data_dict = {};
        data_dict["main_id"] = main_id;
        data_dict["tile_id"] = this.tile_id;
        postWithCallback(this.tile_id, "ShowContainerLog", data_dict)
    },

    setTileSize: function(data) {
        var el = $(this.full_selector());
        el.width(data.width);
        el.height(data.height);
        var ui = {
            "element": el,
            "size": data
        };
        dirty = true;
        this.resize_tile_area(null, ui);
    },

    displayTileContent: function (data) {
        $(this.full_selector() + " .tile-display-area").html(data["html"]);
        var sortable_tables = $(this.full_selector() + " table.sortable");
        $.each(sortable_tables, function (index, the_table) {
            sorttable.makeSortable(the_table)
        });
        dirty = true;
        this.hideOptions();
        this.hideTileLog();
    },

    displayFormContent: function (data) {
        $(this.full_selector() + " #form-display-area").html(data["html"]);
    },

    startSpinner: function() {
        $(this.full_selector() + " #spin-place").html(spinner_html);
    },

    stopSpinner: function () {
        $(this.full_selector() + " #spin-place").html("");
    },

    closeMe: function(){
        var my_tile_id = this.tile_id;
        dirty = true;
        $(this.full_selector()).fadeOut("slow", function () {
            $(this).remove();
            var data_dict = {};
            data_dict["main_id"] = main_id;
            data_dict["tile_id"] = my_tile_id;
            postWithCallback(main_id, "RemoveTile", data_dict)
        });
    },

    shrinkMe: function (callback){
        dirty = true;
        var el = $(this.full_selector());
        this.saved_size = el.outerHeight();
        postWithCallback(this.tile_id, "ShrinkTile", {});
        el.find(".tile-body").fadeOut("fast", function () {
            var hheight = el.find(".tile-panel-heading").outerHeight();
            el.outerHeight(hheight);
            el.resizable('destroy');
            el.find(".triangle-bottom").hide();
            el.find(".triangle-right").show();
            if (arguments.length == 1) {
                callback()
            }
        })
    },
    expandMe: function (){
        dirty = true;
        var el = $(this.full_selector());
        el.outerHeight(this.saved_size);
        $(this.full_selector()).find(".triangle-right").hide();
        $(this.full_selector()).find(".triangle-bottom").show();
        $(this.full_selector()).find(".tile-body").fadeIn();
        var self = this;
        postWithCallback(this.tile_id, "ExpandTile", {});
        $(this.full_selector()).resizable({
                handles: "se",
                resize: self.resize_tile_area,
                stop: function () {
                    self.broadcastTileSize()
                }
            });
    },
    resize_tile_area: function (event, ui) {
        var header_element = ui.element.children(".panel-heading")[0];
        var hheight = $(header_element).outerHeight();
        var front_element = ui.element.find(".front")[0];
        $(front_element).outerHeight(ui.size.height - hheight);
        $(front_element).outerWidth(ui.size.width);
        var display_area = ui.element.find(".tile-display-area");
        var the_margin = $(".tile-display-area").css("margin-left").replace("px", "");
        $(display_area).outerHeight(ui.size.height - hheight - the_margin * 2);
        $(display_area).outerWidth(ui.size.width - the_margin * 2);
        var back_element = ui.element.find(".back")[0];
        $(back_element).outerHeight(ui.size.height - hheight);
        $(back_element).outerWidth(ui.size.width);
        var pbody = ui.element.find(".panel-body")[0];
        var log_element = ui.element.find(".tile-log")[0];
        $(log_element).outerHeight(ui.size.height - hheight);
        $(log_element).outerWidth(ui.size.width);

        $(pbody).outerHeight(ui.size.height - hheight);
        var computed_width = ui.element.width();
        var computed_height = ui.element.height();
        ui.element.width(computed_width);
        ui.element.height(computed_height);
        var scripts = $(ui.element.find(".tile-display-area")).find(".resize-rerun");
        for (var i = 0; i < scripts.length; i = i+1) {
            eval(scripts[i].innerHTML)
        }
    },

    toggleOptions: function (){
        if ($("#tile_body_" + this.tile_id + " .back")[0].style.display == "none") {
            this.showOptions();
        }
        else {
            this.hideOptions();
        }
    },
    hideOptions: function (){
        //$("#tile_body_" + this.tile_id + " .front").fadeIn();
        //$("#tile_body_" + this.tile_id).flip(false);
        //$("#tile_body_" + this.tile_id + " .back").fadeOut()
        $("#tile_body_" + this.tile_id + " .back").hide("blind");

    },
    showOptions: function (){
        $("#tile_body_" + this.tile_id + " .back").show("blind");
        //$("#tile_body_" + this.tile_id).flip(false);
        //$("#tile_body_" + this.tile_id + " .front").fadeOut()
    },
    toggleContainerLog: function () {
        if ($("#tile_body_" + this.tile_id + " .tile-log")[0].style.display == "none") {
            this.showTileLog()
        }
        else {
            this.hideTileLog()
        }
    },
    showTileLog: function() {
        var self = this;
        postWithCallback("host", "get_container_log", {"container_id": self.tile_id}, function (res) {
            the_html = "<pre>" + res["log_text"] + "</pre>";
            $("#tile_body_" + self.tile_id + " .tile-log-area").html(the_html);
            $("#tile_body_" + self.tile_id + " .tile-log").show("blind");
        })
    },
    hideTileLog: function () {
        $("#tile_body_" + this.tile_id + " .tile-log").hide("blind");
    },
    spin_and_refresh: function () {
        // I'm chaining these with callbacks just to make sure they don't get out of order
        var self = this;
        postWithCallback(self.tile_id, "StartSpinner", {}, function () {
            postWithCallback(self.tile_id, "RefreshTile", {}, function() {
                postWithCallback(self.tile_id, "StopSpinner", {})
            })
        })

    },
    refreshFromSave: function (final_callback) {
        postWithCallback(self.tile_id, "SetSizeFromSave", {}, function() {
            postWithCallback(self.tile_id, "RefreshTileFromSave", {}, final_callback)
        })
    },

    tileHeaderButtons: {"tile-close": "closeMe",
            "tile-reload": "reloadMe",
            "tile-log-params": "logParams",
            "tile-logme": "logMe",
            "tile-container-log": "toggleContainerLog",
            "tile-expandme": "expandMe",
            "tile-shrinkme": "shrinkMe",
            "tile-options": "toggleOptions"
    },

    listen_for_clicks: function() {
        var full_frontal_selector = this.full_selector() + " .front";

        $(this.full_selector()).on('click touchstart', ".header-but", function (e) {
            the_id = $(e.target).closest(".tile-panel").attr("id");
            tobject = tile_dict[the_id];
            if ($(e.target).hasClass("header-but")){ // this is necessary to make this work on firefox
                var the_id = e.target.id
            }
            else {
                var the_id = e.target.parentElement.id
            }
            tobject[tobject.tileHeaderButtons[the_id]]()
        });

        $(full_frontal_selector).on('click', '.word-clickable', function(e) {
            var tile_id = jQuery.data(e, "my_tile_id");
            var s = window.getSelection();
            var range = s.getRangeAt(0);
            var node = s.anchorNode;
            while ((range.toString().indexOf(' ') !== 0) && (range.startOffset !== 0)) {
              range.setStart(node, (range.startOffset - 1));
            }
            var nlen = node.textContent.length;
            if (range.startOffset !== 0) {
              range.setStart(node, range.startOffset + 1);
            }

            do {
              range.setEnd(node, range.endOffset + 1);

            } while (range.toString().indexOf(' ') == -1 &&
              range.toString().trim() !== '' &&
              range.endOffset < nlen);

            var str = range.toString().trim();
              var data_dict = {};
              var p = $(e.target).closest(".tile-panel")[0];
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
        $(full_frontal_selector).on('click', '.cell-clickable', function(e) {
            var tile_id = jQuery.data(e, "my_tile_id");
            var txt = $(this).text();

            var data_dict = {};
            var p = $(e.target).closest(".tile-panel")[0];
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
        $(full_frontal_selector).on('click', '.element-clickable', function(e) {
            var tile_id = jQuery.data(e, "my_tile_id");
            var txt = $(this).text();

            var data_dict = {};
            var p = $(e.target).closest(".tile-panel")[0];
            data_dict["tile_id"] = $(p).data("my_tile_id");
            dset = e.target.dataset;
            data_dict.dataset = {};
            for (key in dset) {
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
        $(full_frontal_selector).on('click', '.row-clickable', function(e) {
            //var cells = $(this).closest("tr").children()
            var cells = $(this).children();
            var row_vals = [];
            cells.each(function() {
                row_vals.push($(this).text())
            });
            var tile_id = jQuery.data(e, "my_tile_id");

            var data_dict = {};
            var p = $(e.target).closest(".tile-panel")[0];
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
        $(full_frontal_selector).on('click', 'button', function(e) {
            var p = $(e.target).closest(".tile-panel")[0];
            var data = {};
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
        $(full_frontal_selector).on('change', 'textarea', function(e) {
            var p = $(e.target).closest(".tile-panel")[0];
            var data = {};
            data["tile_id"] = $(p).data("my_tile_id");
            data["text_value"] = e.target.value;
            postWithCallback(data["tile_id"], "TileTextAreaChange", data)
        });
    }

};
/**
 * Created by bls910 on 7/11/15.
 */
// This controls how wide the widest field can be as
// a fraction of the containing panel

DOC_TYPE = "freeform";

MARGIN_SIZE = 5;
INITIAL_LEFT_FRACTION = .69;

var body_template;
var body_template_hidden;

var table_is_shrunk = false;

function doSearch(t) {
    console.log("do search on " + t);
    var data_dict = {"text_to_find": t};
    broadcast_event_to_server("DehighlightTable", data_dict, function () {
        if (t !== "") {
            broadcast_event_to_server("SearchTable", data_dict);
        }
    });
    return false
}

function doFilter(t) {
    console.log("do filter on " + t);
    var data_dict = {"text_to_find": t};
    broadcast_event_to_server("UnfilterTable", data_dict, function () {
        if (t !== "") {
            broadcast_event_to_server("FilterTable", data_dict);
        }
    });
    return false
}

function doUnfilter() {
    broadcast_event_to_server("UnfilterTable", {});
    return false
}

// This object stores information that defines how a table is displayed
// There will be one for each document in a table.
tableSpec = {
    "doc_name": null,
    "table_width": null,
};

function create_tablespec(dict) {
    var spec = Object.create(tableSpec);
    spec.doc_name = dict.doc_name;
    spec.table_width = dict.table_width;
    return spec
}

var tablespec_dict = {};

var tableObject = {
    table_id: "freeform-area",
    collection_name: null,
    data_text: null,

    initialize_table: function (data_object){
        this.highlighted_cells = [];
        if (data_object.hasOwnProperty("left_fraction")) {
            this.left_fraction = data_object.left_fraction
        }
        else {
            this.left_fraction = INITIAL_LEFT_FRACTION;
        }
        this.left_fraction_save = this.left_fraction;
        this.collection_name = _collection_name;
        this.project_name = _project_name;
        //this.short_collection_name = _collection_name.replace(/^.*?\.data_collection\./, "");
        this.data_text = data_object["data_text"];
        this.current_doc_name = data_object["doc_name"];

        if (!tablespec_dict.hasOwnProperty(this.current_doc_name)) {
            this.current_spec = create_tablespec(
                {"doc_name": this.current_doc_name,
                "table_width": null
                });
            tablespec_dict[this.current_doc_name] = this.current_spec;
        }
        else {
            this.current_spec = tablespec_dict[this.current_doc_name]
        }
        if (this.project_name == "") {
            menus["Project"].disable_menu_item('save')
        }
        //noinspection JSUnresolvedVariable
        this.build_table(); // This is separated out because it is called from elsewhere.
        var self = this;
    },

    // tactic_new added refill_table to freeform
    refill_table: function(data_object) {
        this.data_text = data_object["data_text"];
        this.current_doc_name = data_object["doc_name"];
        myCodeMirror.setValue(data_object["new_content"])
    },


    build_table: function (max_table_size) {
        var self = this;
        this.active_line = null;
        initializeConsole();
        var html_result = create_all_html(this.data_text);
        $("#" + this.table_id).html(html_result);
        var tablearea = document.getElementById(this.table_id);
        myCodeMirror = CodeMirror.fromTextArea(tablearea, {
            lineNumbers: true,
            readOnly: false,
            mode: "Plain Text",
            lineWrapping: true,
            firstLineNumber: 0
        });

        $("#project-name").html(this.project_name);
        setup_resize_listeners();
        this.resize_table_area();
        myCodeMirror.on("changes", function(cminstance, changeobj_array) {
            handleTextChange(changeobj_array)
        });
        // tactic_new listen for selection, active line change
        myCodeMirror.on("cursorActivity", function(cminstance) {
            var the_text = myCodeMirror.getSelection();
            var the_dict;
            if (the_text.length > 0) {
                the_dict = {"selected_text": the_text};
                broadcast_event_to_server("TextSelect", the_dict)
            }
            self.active_line = myCodeMirror.getCursor("anchor").line
        });


        function create_all_html(data_text) {
            //This method constructs all of the table html

            html_result = data_text;

            return html_result;
        }

        function handleTextChange(changeobj_array) {
            // tactic_change handle_textchange: perhaps makes this work on changeobjects
            dirty = true;
            current_content = myCodeMirror.getValue();
            var data_dict = {
                    "new_content": current_content,
                    "doc_name": self.current_doc_name};
            broadcast_event_to_server("FreeformTextChange", data_dict, null)
        }

        function setup_resize_listeners() {
            // $("#table-area").resizable({
            //     handles: "e",
            //     stop: save_table_width
            // });
            $("#main-panel").resizable({
                handles: "e",
                resize: handle_resize
            });

            function handle_resize(event, ui) {
                dirty = true;

                if (this.id == "main-panel") {
                    self.left_fraction = ui.size.width / (window.innerWidth - 2 * MARGIN_SIZE - 20);
                    broadcast_event_to_server("UpdateLeftFraction", {left_fraction: self.left_fraction});
                    self.resize_table_area();
                }
            }
        }

        function save_table_width() {
            resize = true;

            self.current_spec.table_width = $("#freeform-area").width();

            //broadcast_event_to_server("SaveTableSpec", {"tablespec": self.current_spec})
        }

    },


    resize_table_area: function () {
        var usable_width = window.innerWidth - 2 * MARGIN_SIZE - 30;
        if (!(this.left_fraction == 0)) {
            $(".grid-left").width(usable_width * this.left_fraction);
        }
        $(".grid-right").width(usable_width * (1 - this.left_fraction));
        $(".CodeMirror").css('height', window.innerHeight - $("#console-panel").outerHeight() - 30- $(".CodeMirror").offset().top);
        $("#tile-area").height(window.innerHeight - $("#console-panel").outerHeight() - 30 - $("#tile-area").offset().top);
        $("#main-panel").width(""); // We do this so that this will resize when the window is resized.
    },

    /* shrinkTable and expandTable are called from html inline */

    shrinkTable: function() {
        dirty = true;
        this.left_fraction_save = this.left_fraction;

        //$(".grid-left")[0].classList.add("scaling-style");
        $("#main-panel").css("display", "none");
        $("#table-icon").css("display", "block");
        var usable_width = window.innerWidth - 2 * MARGIN_SIZE - 10;
        this.left_fraction = ($("#table-icon").outerWidth() + MARGIN_SIZE) / usable_width;
        table_is_shrunk = true;
        broadcast_event_to_server("UpdateTableShrinkState", {"is_shrunk": true});
        this.resize_table_area();
        $(".tile-panel").addClass("tile-panel-float")
    },

    expandTable: function() {
        this.left_fraction = this.left_fraction_save;
        $("#table-icon").css("display", "none");
        $("#main-panel").css("display", "block");
        this.resize_table_area();
        table_is_shrunk = false;
        broadcast_event_to_server("UpdateTableShrinkState", {"is_shrunk": false});
        $(".tile-panel").removeClass("tile-panel-float")
    },

    /* The commands below will be called by the server with emit_table_message */


    consoleLog: function(data_object) {
        var force_open = data_object.force_open;
        $("#console").append(data_object.message_string);
        if (force_open && !console_visible) {
            expandConsole()
        }
        $("#console")[0].scrollTop = $("#console")[0].scrollHeight;
        var child_array = $("#console").children();
        var last_child = child_array[child_array.length - 1];
        var scripts = $(last_child).find(".resize-rerun");
        for (var i = 0; i < scripts.length; i = i+1) {
            eval(scripts[i].innerHTML)
        }
    },

    // tactic_new setfreeformcontent
    setFreeformContent: function(data_object) {
        if (data_object["doc_name"] == this.current_doc_name) {
            myCodeMirror.setValue(data_object["new_content"])
        }
    },

    clearConsole: function(data_object) {
        $("#console").html("");
        $("#console")[0].scrollTop = $("#console")[0].scrollHeight
    },

    startTableSpinner: function () {
        $("#table-spin-place").html(spinner_html);
    },

    stopTableSpinner: function () {
        $("#table-spin-place").html("");
    },

};

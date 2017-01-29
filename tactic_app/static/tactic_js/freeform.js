/**
 * Created by bls910 on 7/11/15.
 */
// This controls how wide the widest field can be as
// a fraction of the containing panel

DOC_TYPE = "freeform";

MARGIN_SIZE = 5;
INITIAL_LEFT_FRACTION = .69;

let body_template;
let body_template_hidden;
let table_is_shrunk = false;
let myCodeMirror = null;
let tablespec_dict = {};

function doSearch(t) {
    console.log("do search on " + t);
    const data_dict = {"text_to_find": t};
    broadcast_event_to_server("DehighlightTable", data_dict, function () {
        if (t !== "") {
            broadcast_event_to_server("SearchTable", data_dict);
        }
    });
    return false
}

function mySearchOverlay(query, caseInsensitive) {
    if (typeof query == "string")
      query = new RegExp(query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), caseInsensitive ? "gi" : "g");
    else if (!query.global)
      query = new RegExp(query.source, query.ignoreCase ? "gi" : "g");

    return {token: function(stream) {
      query.lastIndex = stream.pos;
      const match = query.exec(stream.string);
      if (match && match.index == stream.pos) {
        stream.pos += match[0].length || 1;
        return "searching"; // I believe this causes the style .cm-searching to be applied
      } else if (match) {
        stream.pos = match.index;
      } else {
        stream.skipToEnd();
      }
    }};
  }


function doFilter(t) {
    console.log("do filter on " + t);
    const data_dict = {"text_to_find": t};
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

class TableSpec {
    constructor(dict) {
        this.doc_name = dict.doc_name;
        this.table_width = dict.table_width;
    }
}

class TableObjectClass {
    constructor (data_object ) {
        this.collection_name = null;
        this.data_text = null;
        this.overlay_list = [];
        this.initialize_table(data_object)
    }

    initialize_table (data_object) {
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
            this.current_spec = new TableSpec(
                {
                    "doc_name": this.current_doc_name,
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

        if (myCodeMirror == null) {
            const tablearea = document.getElementById("freeform-area");
            myCodeMirror = CodeMirror(tablearea, {
                lineNumbers: true,
                readOnly: false,
                mode: "Plain Text",
                lineWrapping: true,
                firstLineNumber: 0
            });
        }
        //noinspection JSUnresolvedVariable
        this.build_table(); // This is separated out because it is called from elsewhere.
    }

    // refill_table is currently not used for freeform docs
    refill_table (data_object) {
        this.data_text = data_object["data_text"];
        this.current_doc_name = data_object["doc_name"];
        myCodeMirror.setVal(data_object["new_content"])
    }

    highlightTxtInDocument (data_object) {
        const text_to_find = data_object.text_to_find;
        const overlay = mySearchOverlay(text_to_find, true);
        myCodeMirror.addOverlay(overlay);
        this.overlay_list.push(overlay)
    }

    dehighlightAllText () {
        let overlay = this.overlay_list.pop();
        if (overlay != null) {
            myCodeMirror.removeOverlay(overlay);
        }
    }

    build_table (max_table_size) {
        const self = this;
        this.active_line = null;
        consoleObject = new ConsoleObjectClass();
        let html_result = create_all_html(this.data_text);
        myCodeMirror.setValue(html_result);
        this.old_content = html_result;

        $("#project-name").html(this.project_name);
        setup_resize_listeners();
        this.resize_table_area();
        myCodeMirror.on("update", function (cminstance) {
            handleTextChange()
        });
        myCodeMirror.on("cursorActivity", function (cminstance) {
            const the_text = myCodeMirror.getDoc().getSelection();
            let the_dict;
            if (the_text.length > 0) {
                the_dict = {"selected_text": the_text};
                broadcast_event_to_server("TextSelect", the_dict)
            }
            self.active_line = myCodeMirror.getDoc().getCursor("anchor").line
        });

        function create_all_html(data_text) {
            return data_text;
        }

        function handleTextChange() {
            dirty = true;
            let current_content = myCodeMirror.getDoc().getValue();
            if (current_content != self.old_content) {
                const data_dict = {
                    "new_content": current_content,
                    "doc_name": self.current_doc_name
                };
                self.old_content = current_content;
                broadcast_event_to_server("FreeformTextChange", data_dict, null)
            }
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
                self.left_fraction = ui.size.width / (window.innerWidth - 2 * MARGIN_SIZE - 20);
                broadcast_event_to_server("UpdateLeftFraction", {left_fraction: self.left_fraction});
                self.resize_table_area();
            }
        }

        function save_table_width() {
            // let resize = true;
            self.current_spec.table_width = $("#freeform-area").width();

            //broadcast_event_to_server("SaveTableSpec", {"tablespec": self.current_spec})
        }

    }

    resize_table_area () {
        const usable_width = window.innerWidth - 2 * MARGIN_SIZE - 30;
        if (!(this.left_fraction == 0)) {
            $(".grid-left").width(usable_width * this.left_fraction);
        }
        $(".grid-right").width(usable_width * (1 - this.left_fraction));
        if ($("#freeform-area .CodeMirror").length > 0) {
            $("#freeform-area .CodeMirror").css('height', window.innerHeight - consoleObject.console_panel.outerHeight() - 30 - $("#freeform-area .CodeMirror").offset().top);
        }
        if ($("#tile-area").length > 0) {
            $("#tile-area").height(window.innerHeight - consoleObject.console_panel.outerHeight() - 30 - $("#tile-area").offset().top);
        }
        $("#main-panel").width(""); // We do this so that this will resize when the window is resized.
        myCodeMirror.refresh()
    }

    /* shrinkTable and expandTable are called from html inline */

    shrinkTable () {
        dirty = true;
        this.left_fraction_save = this.left_fraction;

        //$(".grid-left")[0].classList.add("scaling-style");
        $("#main-panel").css("display", "none");
        $("#table-icon").css("display", "block");
        const usable_width = window.innerWidth - 2 * MARGIN_SIZE - 10;
        this.left_fraction = ($("#table-icon").outerWidth() + MARGIN_SIZE) / usable_width;
        table_is_shrunk = true;
        broadcast_event_to_server("UpdateTableShrinkState", {"is_shrunk": true});
        this.resize_table_area();
        $(".tile-panel").addClass("tile-panel-float")
    }

    expandTable () {
        this.left_fraction = this.left_fraction_save;
        $("#table-icon").css("display", "none");
        $("#main-panel").css("display", "block");
        this.resize_table_area();
        table_is_shrunk = false;
        broadcast_event_to_server("UpdateTableShrinkState", {"is_shrunk": false});
        $(".tile-panel").removeClass("tile-panel-float")
    }

    /* The commands below will be called by the server with emit_table_message */


    consoleLog (data_object) {
        consoleObject.consoleLog(data_object);
    }

    consoleCodeLog (data_object) {
        consoleObject.consoleCodeLog(data_object)
    }

    clearConsole () {
        consoleObject.clearConsole()
     }

    setFreeformContent (data_object) {
        if (data_object["doc_name"] == this.current_doc_name) {
            myCodeMirror.getDoc().setValue(data_object["new_content"])
        }
    }


    startTableSpinner () {
        $("#table-spin-place").html(spinner_html);
    }

    stopTableSpinner () {
        $("#table-spin-place").html("");
    }

}

/**
 * Created by bls910 on 7/11/15.
 */
// This controls how wide the widest field can be as
// a fraction of the containing panel

MAX_BIGFIELD_FRACTION = 1;
ADDED_HEADER_WIDTH = 0;
MARGIN_SIZE = 5;
INITIAL_LEFT_FRACTION = .69;

DOC_TYPE = "table";

let header_template;
let body_template;
let body_template_hidden;
let tablespec_dict = {};
let table_is_shrunk = false;

$.get($SCRIPT_ROOT + "/get_table_templates", function(template){
    header_template = $(template).filter('#header-template').html();
    body_template = $(template).filter('#body-template').html();
    body_template_hidden = $(template).filter('#body-template-hidden').html();
});

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

function get_header(header_name) {
    return $("thead .column-" + header_name)
}
function get_column(header_name) {
    return $("tbody .column-" + header_name)
}

function deselect_header(header_name) {
    get_column(header_name).removeClass("selected-column");
    get_header(header_name).removeClass("selected-header");
    tableObject.selected_header = null;
    disable_require_column_select()
}

function select_header(header_name) {
    get_column(header_name).addClass("selected-column");
    get_header(header_name).addClass("selected-header");
    tableObject.selected_header = header_name;
    enable_require_column_select()
}

// This object stores information that defines how a table is displayed
// There will be one for each document in a table.

class TableSpec {
    constructor(dict) {
        this.doc_name = dict.doc_name;
        this.header_list = dict.table_spec.header_list;
        this.table_width = dict.table_spec.table_width;
        this.column_widths = dict.table_spec.column_widths;
        this.hidden_columns_list = dict.table_spec.hidden_columns_list
    }

    shift_column_left (column_name) {
        for (let i = 0; i < this.header_list.length; ++i) {
            if (this.header_list[i] == column_name) {
                if (i == 0) {
                    return;
                }
                else {
                    this.header_list.splice(i, 1);
                    this.header_list.splice(i - 1, 0, column_name);
                    let column_width = this.column_widths[i];
                    this.column_widths.splice(i, 1);
                    this.column_widths.splice(i - 1, 0, column_width)
                }
            }
        }
    }

    shift_column_right (column_name) {
        for (let i = 0; i < (this.header_list.length - 1); ++i) {
            if (this.header_list[i] == column_name) {
                this.header_list.splice(i, 1);
                this.header_list.splice(i + 1, 0, column_name);
                let column_width = this.column_widths[i];
                this.column_widths.splice(i, 1);
                this.column_widths.splice(i + 1, 0, column_width)
            }
        }
    }
}

class TableObjectClass {
    constructor (data_object) {
        this.table_id = "table-area";
        this.collection_name = null;
        this.data_rows = null;
        this.selected_header = null;
        this.highlighted_cells = [];
        this.initialize_table (data_object);
    }


    initialize_table (data_object){
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
        this.data_rows = data_object["data_rows"];
        this.background_colors = data_object["background_colors"];
        this.current_doc_name = data_object["doc_name"];
        this.is_first_chunk = data_object["is_first_chunk"];
        this.is_last_chunk = data_object["is_last_chunk"];
        this.getting_new_chunk = false;

        this.current_spec = new TableSpec(data_object);

        if (this.project_name == "") {
            menus["Project"].disable_menu_item('save')
        }
        //noinspection JSUnresolvedVariable
        this.build_table(data_object.max_table_size); // This is separated out because it is called from elsewhere.
        const self = this;
        $("#table-area tbody").scroll(function(){
            if (self.getting_new_chunk) {
                return false
            }
            if ($('#table-area tbody tr:last').isOnScreen()){
                if (!self.is_last_chunk ) {
                    self.getting_new_chunk = true;
                    const nrows = $('#table-area tbody tr').length;
                    postWithCallback(main_id, "grab_next_chunk", {"doc_name": self.current_doc_name}, function (data) {
                        const top_edge_pos = $("#table-area tbody tr:last").position().top;
                        tableObject.refill_table(data);
                        // The last row will now be at this position
                        //noinspection JSUnresolvedVariable
                        const old_last_row = $('#table-area tbody tr')[nrows - data.step_size - 1];
                        const rowpos = $(old_last_row).position();
                        $('#table-area tbody').scrollTop(rowpos.top - top_edge_pos);
                        self.getting_new_chunk = false;
                    })
                }
            }
            if ($("#table-area tbody tr:first").isOnScreen()) {
                if (!self.is_first_chunk) {
                    self.getting_new_chunk = true;
                    postWithCallback(main_id, "grab_previous_chunk", {"doc_name": self.current_doc_name}, function (data) {
                        const top_edge_pos = $("#table-area tbody tr:first").position().top;
                        tableObject.refill_table(data);
                        // The last row will now be at this position
                        //noinspection JSUnresolvedVariable
                        const old_last_row = $('#table-area tbody tr')[data.step_size - 1];
                        const rowpos = $(old_last_row).position();
                        $('#table-area tbody').scrollTop(rowpos.top - top_edge_pos);
                        self.getting_new_chunk = false;
                    })
                }
            }
        })
    }

    refill_table (data_object) {
        this.data_rows = data_object["data_rows"];
        this.current_doc_name = data_object["doc_name"];
        this.is_first_chunk = data_object["is_first_chunk"];
        this.is_last_chunk = data_object["is_last_chunk"];
        this.background_colors = data_object["background_colors"];
        const header_list = this.current_spec.header_list;
        const all_rows = $("#table-area tbody tr");
        all_rows.removeClass("hidden-row");
        const nrows = all_rows.length;

        const rowpos = $('#table-area tr:first').position();
        $('#table-area tbody').scrollTop(rowpos.top);
        let i;
        for (i = 0; i < this.data_rows.length; ++i) {
            for (let c = 0; c < header_list.length; ++c) {
                const td_element = $("#table-area tbody")[0].rows[i].cells[c];
                const new_content = this.data_rows[i][header_list[c]];
                $(td_element).html(new_content)
            }
        }
        this.color_all_bgs();
        for (; i < nrows; ++i) {
            $(all_rows[i]).addClass("hidden-row")
        }
     }

    clear_all_bgs () {
      $("#table-area tbody td").css("background-color", "")
     }

    color_all_bgs () {
        this.clear_all_bgs();
        for (let row in this.background_colors) {
            if (!this.background_colors.hasOwnProperty(row)) continue;
            for (let cheader in this.background_colors[row]) {
                if (!this.background_colors[row].hasOwnProperty(cheader)) continue;
                tableObject.colorCellBackground(row, cheader, this.background_colors[row][cheader])
            }
        }
     }

    build_table  (max_table_size) {
        const self = this;
        this.active_row = null;
        this.active_row_id = null;
        if (consoleObject == null) {
            consoleObject = new ConsoleObjectClass()
        }
        if (exportViewerObject == null) {
            exportViewerObject = new exportViewerObjectClass()
        }
        const html_result = create_all_html(this.table_id, this.data_rows, this.current_spec.header_list, max_table_size, this.is_last_chunk);
        $("#" + this.table_id).html(html_result);
        for (let i = 0; i < this.current_spec.hidden_columns_list.length; ++i) {
            $(".column-" + this.current_spec.hidden_columns_list[i]).css("display", "none");
        }
        $("td.column-__id__").attr("contenteditable", false);
        $("td.column-__filename__").attr("contenteditable", false);
        this.color_all_bgs();
        $("#project-name").html(this.project_name);
        this.resize_table_area();
        this.freeze_column_widths();
        setup_resize_listeners();
        //broadcast_event_to_server("SaveTableSpec", {"tablespec": this.current_spec})
         $('#table-area td').blur(handle_cell_change);


        // Listen for the cursor to be placed in row
        $("#table-area").on('focus', 'td', function() {
              const row_index = $(this).closest("tr")[0].rowIndex - 1; //Substract one for the header row
              const old_row = $("#table-area tbody tr")[self.active_row];
              $(old_row).removeClass("selected-row");
              const new_row = $("#table-area tbody tr")[row_index];
              $(new_row).addClass("selected-row");
              self.active_row = row_index;
              self.active_row_id = self.data_rows[row_index]["__id__"]
        });

        // Listen for the user to click on a header
        $("#table-area th").on("click", function (event) {
            const el = event.target;
            const the_header = $(el).attr("id");
            if (the_header === self.selected_header) {
                deselect_header(the_header);
            }
            else {
                if (self.selected_header != null) {
                    deselect_header(self.selected_header)
                }
                select_header(the_header);
            }
        });

        $("#table-area td").mouseup(function () {
            const the_text = document.getSelection().toString();
            let the_dict;
            if (the_text.length > 0) {
                the_dict = {"selected_text": the_text};
                broadcast_event_to_server("TextSelect", the_dict)
            }
        });

        function create_all_html(table_id, data_rows, header_list, max_table_size, is_last_chunk) {
            //This method constructs all of the table html

            const headers = [];
            for (let i = 0; i < header_list.length; ++i) {
                headers.push({"header": header_list[i]})
            }
            let html_result = Mustache.to_html(header_template, {"headers": headers});

            let body_html = "";
            let i;

            for (i = 0; i < data_rows.length; ++i) {
                let cell_list = [];
                for (let c = 0; c < header_list.length; ++c) {
                    cell_list.push({"rownumber": String(i), "header": header_list[c], "value": data_rows[i][header_list[c]]})
                }
                let row_html = Mustache.to_html(body_template, {
                    "row_id": data_rows[i]["__id__"].toString(),
                    "cells": cell_list
                });
                body_html = body_html + row_html;
            }
            if (i < max_table_size) {
                let cell_list = [];
                for (let c = 0; c < header_list.length; ++c) {
                    cell_list.push({"rownumber": String(i), "header": header_list[c], "value": ""})
                }
                for (; i < max_table_size; ++i) {
                    let row_html = Mustache.to_html(body_template_hidden, {
                    "row_id": "",
                    "cells": cell_list
                    });
                    body_html = body_html + row_html;
                }
            }
            html_result += "<tbody>" + body_html + "</tbody>";
            return html_result;
        }

        function setup_resize_listeners() {
            if ($("#table-area").hasClass("ui-resizable")){
                $("#table-area").resizable("destroy"); // This is needed in the case where we're changing docs.
            }
            $(".can-resize").resizable({
                handles: "e",
                resize: handle_resize,
                stop: save_column_widths.bind(self)
            });

            $("#table-area").resizable({
                handles: "e",
                stop  () {
                    self.current_spec.column_widths = null;
                    self.freeze_column_widths();
                }
            });
            $("#main-panel").resizable({
                handles: "e",
                resize: handle_resize
            });

            function handle_resize(event, ui) {
                dirty = true;
                let header_element;
                if (this.tagName == "TH") {
                    header_element = ui.element;
                }
                if (this.tagName == "TD") {
                    const cellIndex = ui.element[0].cellIndex;
                    const header_row_element = $("#table-area thead tr")[0];
                    header_element = $(header_row_element.children[cellIndex])
                }
                if ((this.tagName == "TH") || (this.tagName == "TD")) {
                    const h_class = "column-" + header_element.attr("id");
                    $("." + h_class).innerWidth(ui.size.width);
                    $("." + h_class).css("maxWidth", ui.size.width);
                    self.current_spec.column_widths[ui.element[0].cellIndex] = ui.element[0].offsetWidth;
                }
                if (this.id == "main-panel") {
                    self.left_fraction = ui.size.width / (window.innerWidth - 2 * MARGIN_SIZE - 20);
                    broadcast_event_to_server("UpdateLeftFraction", {left_fraction: self.left_fraction});
                    self.resize_table_area();
                }
            }
        }

        function save_column_widths() {
            const col_cells = $("#table-area tbody tr:first td");
            const result = [];
            for (let i = 0; i < col_cells.length; ++i) {
                result.push(col_cells[i].offsetWidth)
            }
            this.current_spec.column_widths = result;
            this.current_spec.table_width = $("#table-area").width();

            this.update_column_widths()
        }


        function handle_cell_change () {
            // This is called when the user directly edits a cell.
            // It is assumed that this points to the DOM element that was changed.
            dirty = true;
            let current_content = $(this).html();

            // turn any brs in the middle into newlines
            let rexp = new RegExp("\<br\>([\\w\\s])", "g");
            current_content = current_content.replace(rexp, "\\n");

            // get rid of any other tags and trim
            rexp = new RegExp("\<.*?\>", "g");
            current_content = current_content.replace(rexp, " ");
            current_content = current_content.trim();

            const rindex = this.parentElement.rowIndex - 1;
            const cindex = this.cellIndex;
            const column_header = self.current_spec.header_list[cindex];
            const old_content = self.data_rows[rindex][column_header];
            const id_selector = "#row-" + String(rindex) + "-col-__id__";
            const row_id = parseInt($(this.parentElement).children(id_selector).text());
            if (current_content != old_content) {
                self.data_rows[rindex][column_header] = current_content;
                const data_dict = {
                    "id": row_id,
                    "column_header": column_header,
                    "old_content": old_content,
                    "new_content": current_content,
                    "doc_name": self.current_doc_name
                };
                broadcast_event_to_server("CellChange", data_dict, null)
            }
        }
     }

    update_column_widths() {
        broadcast_event_to_server("UpdateColumnWidths", {"docname": this.docname,
            "column_widths": this.current_spec.column_widths,
            "table_width": this.current_spec.table_width}, null, this)
    }

    freeze_column_widths () {
        // This modifies this.column_widths and this.table_width
        // This is only called by initialize_table.
        // But I split it out because it's so big.
        const tidstr = "#table-area";
        const ncols = this.current_spec.header_list.length;
        const all_rows = $(tidstr).find("tr");
        const saved_table_width = $(tidstr).width();
 
        let the_row;
        let the_width;
        let the_text;
        let the_child;

        const panel_width = $("#main-panel").width();
        const max_field_width = panel_width * MAX_BIGFIELD_FRACTION;


        if (this.current_spec.column_widths == null) {
            let column_widths = [];
            for (let c = 0; c < ncols; ++c) {
                column_widths.push(0);
            }
            // Get the max width of each column
            for (let r = 0; r < all_rows.length; ++r) {
                the_row = all_rows[r];

                for (let c = 0; c < ncols; ++c) {
                    the_child = the_row.cells[c];
                    the_width = the_child.offsetWidth + ADDED_HEADER_WIDTH;
                    the_text = the_child.innerHTML;

                    if (the_width > max_field_width) {
                        the_width = max_field_width
                    }

                    if (the_width > column_widths[c]) {
                        column_widths[c] = the_width
                    }
                }
            }

            let total = 0;
            $.each(column_widths, function () {
                total += this;
            });

            // Since the largest entry in each column might not be from the same row, the total might be too big
            // Also, if we have made the table wider there might be extra space
            // So rescale each column to fit in the space vailable
            // I substract 35 because something is taking up extra space there.
            const fract = (saved_table_width - 35) / total;
            for (let c = 0; c < column_widths.length; ++c) {
                column_widths[c] = fract * column_widths[c]
            }
            this.current_spec.table_width = saved_table_width;
            this.current_spec.column_widths = column_widths;
            this.update_column_widths()
        }

        $("#table-area").width(String(this.current_spec.table_width));

        // Set all column widths
        let new_width;
        for (let r = 0; r < all_rows.length; ++r) {
            let the_row = all_rows[r];
            let c = 0;
            while (c < ncols){
                the_child = the_row.cells[c];
                new_width = this.current_spec.column_widths[c];
                the_child.style.width = String(new_width) + "px";
                the_child.style.maxWidth = String(new_width) + "px";
                c += 1
            }
        }
     }

    resize_table_area  () {
        const usable_width = window.innerWidth - 2 * MARGIN_SIZE - 30;
        if (!(this.left_fraction == 0)) {
            $(".grid-left").width(usable_width * this.left_fraction);
        }
        $(".grid-right").width(usable_width * (1 - this.left_fraction));

        if ($("#table-area tbody").length > 0) {
            $("#table-area tbody").height(window.innerHeight - $("#grid-bottom").outerHeight() - 30 - $("#table-area tbody").offset().top);
        }

        if ($("#tile-area").length > 0) {
            $("#tile-area").height(window.innerHeight - $("#grid-bottom").outerHeight() - 30 - $("#tile-area").offset().top);
        }
        $("#main-panel").width(""); // We do this so that this will resize when the window is resized.
     }

    hideRows (hide_list) {
        const rows = $('#table-area tbody tr');
        for (let i = 0; i < hide_list.length; ++i) {
            const rnum = hide_list[i];
            rows.eq(rnum).addClass("hidden-row")
        }
     }

    getCellElementByRowColIndex (rindex, cindex) {
        return $("#table-area tbody")[0].rows[rindex].cells[cindex]
     }

    dehighlightTxtInCell (data_object) {
        const rindex = data_object.row_index;
        const cheader = data_object.column_header;
        const cindex = this.current_spec.header_list.indexOf(cheader);
        try {
            const td_element = $("#table-area tbody")[0].rows[rindex].cells[cindex];
            $(td_element).text(this.data_rows[rindex][cheader]);
        }
        catch (err) {
            console.log(err.message + " row index " + rindex + "_col_index_ " + cindex)
        }
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

    setCellContent (data) {
        //It is assumed that this is called on the currently visible document only.
        //It will be called by the server, when the server wants to tell the client
        //there is a change in a cell in the visible document
        dirty = true;
        const cheader = data.column_header;
        const new_content = data.new_content;
        const row_index = data.row;
        const cell_index = this.current_spec.header_list.indexOf(cheader);
        if (cell_index == -1) {
            console.log("invalid signature");
            return
        }
        const td_element = $("#table-area tbody")[0].rows[row_index].cells[cell_index];
        $(td_element).html(new_content);
        this.data_rows[row_index][cheader]= new_content
     }

    // setCellBackground assumes this is intended for the current document
    setCellBackground (data) {
        dirty = true;
        const cheader = data.column_header;
        const row = data.row;
        const bcolor = data.color;
        this.colorCellBackground(row, cheader, bcolor)
     }

    // It is assumed that this is coloring the currently visible document.
    colorCellBackground (rindex, cheader, bcolor) {
        dirty = true;
        const cindex = this.current_spec.header_list.indexOf(cheader);
        try {
            const el = this.getCellElementByRowColIndex(rindex, cindex);
            $(el).css("background-color", bcolor);
        }
        catch(err) {
            console.log(err.message + " row index " + rindex + "_col_index_ " + cindex)
        }
     }

    highlightTxtInDocument (data_object) {
        const rindex = data_object.row_index;
        const cheader = data_object.column_header;
        const text_to_find = data_object.text_to_find;
        const cindex = this.current_spec.header_list.indexOf(cheader);
        try {
            const el = this.getCellElementByRowColIndex(rindex, cindex);
            const regex = new RegExp(text_to_find, "gi");
            el.innerHTML = el.innerHTML.replace(regex, function (matched) {
                    return "<span class=\"highlight \">" + matched + "</span>";
                });
            this.highlighted_cells.push({"row_index": rindex, "column_header": cheader})
        }
        catch(err) {
            console.log(err.message + " row index " + rindex + "_col_index_ " + cindex)
        }
     }

    colorTxtInCell (data_object) {
        const rindex = data_object.row_index;
        const cheader = data_object.column_header;
        const token_text = data_object.token_text;
        const color_dict = data_object.color_dict;
        const cindex = this.current_spec.header_list.indexOf(cheader);

        let result = "";

        try {
            const el = this.getCellElementByRowColIndex(rindex, cindex);
            for (let i = 0; i < token_text.length; ++i) {
                w = token_text[i];
                if (color_dict.hasOwnProperty(w)) {
                    result = result + "<span style='background-color: " + color_dict[w] + "' > " + w + "</span>";
                }
                else {
                    result = result + " " + w
                }
            }
            result = result.trim();
            el.innerHTML = result;
            this.highlighted_cells.push({"row_index": rindex, "column_header": cheader})
        }
        catch(err) {
            console.log(err.message + " row index " + rindex + "_col_index_ " + cindex)
        }
     }

    consoleLog (data_object) {
        consoleObject.consoleLog(data_object);
    }

    consoleCodeLog (data_object) {
        consoleObject.consoleCodeLog(data_object)
    }

    clearConsole () {
        consoleObject.clearConsole()
     }

    dehighlightAllText () {
        const self = this;
        this.highlighted_cells.forEach(function(c){
            self.dehighlightTxtInCell(c)
        });
        this.highlighted_cells = []
     }

    startTableSpinner  () {
        $("#table-spin-place").html(spinner_html);
     }

    stopTableSpinner  () {
        $("#table-spin-place").html("");
     }

    rowup  (clicked_element) {
          const $row = $(clicked_element).parents('tr');
          if ($row.index() === 1) return; // Don't go above the header
          $row.prev().before($row.get(0));
     }
    rowdown  (clicked_element) {
          const $row = $(clicked_element).parents('tr');
          $row.next().after($row.get(0));
     }
    rowremove  (clicked_element) {
        $(clicked_element).parents('tr').detach();
    }
}

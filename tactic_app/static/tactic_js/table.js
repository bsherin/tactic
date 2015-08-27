/**
 * Created by bls910 on 7/11/15.
 */
// This controls how wide the widest field can be as
// a fraction of the containing panel
MAX_BIGFIELD_FRACTION = .25;
SHOW_ALL_HEADER_ROWS = true;
ADDED_HEADER_WIDTH = 35;
HEADER_SELECT_COLOR = "#9d9d9d";
HEADER_NORMAL_COLOR = "#c9e2b3";
TABLE_SELECT_COLOR = "#e0e0e0";
TABLE_NORMAL_COLOR = "#ffffff";
TABLE_BORDER_STYLE = "1px solid #9d9d9d;"
MAX_HEIGHT = 300;

function click_header(el) {
    var the_id = $(el).attr("id");
    if (the_id === tableObject.selected_header) {
        deselect_header(the_id);
    }
    else {
        if (tableObject.selected_header != null) {
            deselect_header(tableObject.selected_header)
        }
        select_header(the_id);
    }
}

function resize_from_sub_headers (el_list) {
    for (var i = 0; i < el_list.length; ++i) {
        var total_width = 0;
        var el = el_list[i];
        var slist = $(el).data("sub_headers")
        for (var j = 0; j < slist.length; ++j) {
            sub_id = $(slist[j]).attr("id")
            if ($.inArray(sub_id, tableObject.hidden_list) == -1) {
                total_width += $(slist[j]).outerWidth()
            }
        }
        if (total_width === 0) {
            $(el).fadeOut();
        }
        else {
            $(el).outerWidth(total_width)
        }
    }
}

function resize_whole_column(event, ui) {
    var header_element = ui.element;
    var h_class = "header" + header_element.attr("id");
    $("." + h_class).outerWidth(ui.size.width);
    resize_from_sub_headers(ui.element.data("super_headers"))
    tableObject.column_widths[ui.element[0].cellIndex] = ui.element[0].offsetWidth;
}

function text_select(e) {
    var the_text = document.getSelection().toString();
    var the_dict;
    if (the_text.length > 0) {
        the_dict = {"selected_text": the_text};
        broadcast_event_to_server("text_select", the_dict)
    }
}

function handle_cell_change () {
    var current_content = $(this).html();

    //Get rid fo the extra br tags that appear
    // First just get rid of the one at the end
    current_content = current_content.replace(/\<br\>$/, "");
    // Now turn any brs in the middle into newlines
    current_content = current_content.replace(/\<br\>/g, "\n");
    var rindex = this.parentElement.rowIndex - tableObject.header_rows;
    var cindex = this.cellIndex;
    var sig = tableObject.signature_list[cindex];
    //var old_content = tableObject.get_cell_value_from_sig(tableObject.doc_list[rindex], sig);
    var old_content = tableObject.table_array[rindex][cindex];
    if (current_content != old_content) {
        tableObject.table_array[rindex][cindex] = current_content;
        tableObject.update_doc_list(rindex, sig, current_content)
        data_dict = {
            "row_index": rindex,
            "signature": sig,
            "old_content": old_content,
            "new_content": current_content}
        broadcast_event_to_server("CellChange", data_dict)
    }
}

function deselect_header(the_id) {
    $("tbody .header" + the_id).css('background-color', TABLE_NORMAL_COLOR);
    $("tbody .header" + the_id).css('border', TABLE_BORDER_STYLE);
    $("thead .header" + the_id).css('background-color', HEADER_NORMAL_COLOR);
    $("thead .header" + the_id).css('border', TABLE_BORDER_STYLE);
    tableObject.selected_header = null
    disable_require_column_select()
}

function select_header(the_id) {
    $(".header" + the_id).css('background-color', TABLE_SELECT_COLOR)
    $("#" + the_id).css('background-color', HEADER_SELECT_COLOR);
    tableObject.selected_header = the_id
    enable_require_column_select()
}

header0bject = {
    name: "placeholder",
    id: null,
    span: 0,
    depth: 0,
    child_list: [],
    hidden: null,
    shift_child_left: function (child_id) {
        var i;
        var the_child;
        for (i = 0; i < this.child_list.length; ++i) {
            if (this.child_list[i].id == child_id) {
                if (i == 0){
                    return;
                }
                else {
                    the_child = this.child_list[i];
                    this.child_list.splice(i,1)
                    this.child_list.splice(i - 1, 0, the_child)
                    return
                }
            }
        }

    },
    shift_child_right: function (child_id) {
        var i;
        var the_child;
        // Note that we don't check the last one
        // on the list because that one can't move to the right
        for (i = 0; i < (this.child_list.length - 1); ++i) {
            if (this.child_list[i].id == child_id) {
                the_child = this.child_list[i];
                this.child_list.splice(i,1)
                this.child_list.splice(i + 1, 0, the_child)
                return
            }
        }
        return
    },
    find_parent_of_id: function (child_id) {
        var i;
        for (i = 0; i < this.child_list.length; ++i) {
            if (this.child_list[i].id == child_id) {
                return this;
            }
        }
        for (i = 0; i < this.child_list.length; ++i) {
            result = this.child_list[i].find_parent_of_id(child_id)
            if (result != null){
                return result
            }
        }
        return null
    },
    find_struct_by_id: function (child_id) {
        var i;
        for (i = 0; i < this.child_list.length; ++i) {
            if (this.child_list[i].id == child_id) {
                return this.child_list[i];
            }
        }
        for (i = 0; i < this.child_list.length; ++i) {
            result = this.child_list[i].find_struct_by_id(child_id)
            if (result != null){
                return result
            }
        }
        return null
    },

}

var tableObject = {
    table_id: "table-area",
    next_header_id: 0,
    header_struct: null,
    signature_list: [],
    collection_name: null,

    // doc_list and table_array are two different represenations of the content of the table
    // doc_list is used when the table is refreshed from scratch. So it has to be kept
    // updated. table_array is just a little easier to use.

    doc_list: null,
    table_array: [],

    column_widths: null,
    selected_header: null,
    hidden_list: [],

    load_data: function (data_object){
        this.collection_name = _collection_name;
        this.project_name = _project_name;
        this.short_collection_name = _collection_name.replace(/^.*?\.data_collection\./, "");
        this.doc_list = data_object["the_rows"];
        var sample_row = this.doc_list[0];
        if (data_object.hasOwnProperty("next_header_id")){
            this.next_header_id = data_object["next_header_id"]
        }
        if (data_object.hasOwnProperty("header_struct")) {
            this.header_struct = rebuild_header_struct(data_object["header_struct"])
            this.hidden_list = data_object["hidden_list"];
        }
        else {
            this.header_struct = this.find_headers(this.collection_name, sample_row);
            menus["Project"].disable_menu_item('save')
        }
        this.build_table();
        function rebuild_header_struct(hstruct) {
            var true_hstruct = Object.create(header0bject);
            for (var prop in hstruct) {
                if (!hstruct.hasOwnProperty(prop)) continue;
                true_hstruct[prop] = hstruct[prop]
            }

            for (var i = 0; i < hstruct.child_list.length; ++i) {
                true_hstruct.child_list[i] = rebuild_header_struct(hstruct.child_list[i])
            }
            return true_hstruct
        }
    },

    build_table: function() {
        this.signature_list = this.build_signature_list(this.header_struct, []);
        this.table_array = this.build_table_array();
        this.create_all_html();
        this.resize_table_area();
        this.column_widths = this.freeze_header(this.table_id);
        label_super_headers();
        label_sub_headers();
        this.header_rows = $("thead").children().length;
        $('#table-area td').blur(handle_cell_change)

        function true_col_index(el) {
            var cell_index = el.cellIndex;
            var sib_collection = el.parentElement.children
            ind = 0;
            for (var i = 0; i < cell_index; ++i) {
                ind = ind + sib_collection[i].colSpan
            }
            return ind
        }

        function label_super_headers () {
            $("th").each(function(index){
                var shs = find_super_headers(this)
                $(this).data("super_headers", shs)
            })
            function find_super_headers(el) {
                var the_row = el.parentElement.rowIndex;
                var true_col = true_col_index(el);
                var header_rows = $("thead").children()
                var super_headers = []

                var the_th, hrow, ths, i, j, tc_index;
                for (i = (the_row - 1); i >= 0; --i){
                    hrow = header_rows[i];
                    ths = $(hrow).children();
                    for (j = 0; j < ths.length ; ++j) {
                        the_th = ths[j];
                        tc_index = true_col_index(the_th)
                        if ((tc_index <= true_col) && ((tc_index + the_th.colSpan - 1) >= true_col)) {
                            super_headers.push(the_th)
                            break;
                        }
                    }
                }
                return super_headers
            }
        }

        function label_sub_headers () {
            $("th").each(function(index){
                var shs = find_sub_headers(this)
                $(this).data("sub_headers", shs)
            });

            function find_sub_headers (el) {
                var the_row = el.parentElement.rowIndex;
                var true_col = true_col_index(el);
                var cspan = el.colSpan
                var header_rows = $("thead").children()
                var sub_headers = []
                var the_th, hrow, ths, i, j, tch
                for (i = the_row + 1; i < header_rows.length; ++i){
                    hrow = header_rows[i];
                    ths = $(hrow).children();
                    for (j = 0; j < ths.length ; ++j) {
                        the_th = ths[j];
                        tch = true_col_index(the_th)
                        if ((tch >= true_col) && (tch < (true_col + el.colSpan))){
                            sub_headers.push(the_th)
                        }
                    }
                }
                return sub_headers
            }

        }
    },

    build_table_array: function(){
        var i, j, k, sig, current;
        table_array = [];
        for (i = 0; i < this.doc_list.length; ++i) {
            table_array.push([]);
            for (j = 0; j < this.signature_list.length; ++j) {
                sig = this.signature_list[j];
                current = this.doc_list[i];
                // Note the loop below starts at 1 because my signature list has an extra
                // root node listed at the start
                for (k = 1; k < sig.length; ++k) {
                    current = current[sig[k][0]]
                }
                table_array[i].push(current)
            }
        }
        return table_array
    },

    create_all_html: function (){
            var header_html = "<thead>" + this.get_header_html(this.header_struct) + "</thead>";
            var end_columns = "<td>" +
                "<span class='table-remove glyphicon glyphicon-remove'onclick=tableObject.rowremove(this) ></span>" +
                "</td>" +
                "<td>" +
                "<span class='table-up glyphicon glyphicon-arrow-up' onclick=tableObject.rowup(this)></span> " +
                "<span class='table-down glyphicon glyphicon-arrow-down' onclick=tableObject.rowdown(this)></span>" +
                "</td> " +
                "</tr>";
            this.set_table_title(this.project_name)
            ta = $("#" + this.table_id);
            ta.html(header_html);
            var row_html;
            var body_html = "";
            var i;
            for (i = 0; i < this.table_array.length; ++i) {
                row_html = "<tr>";
                row_html = row_html + this.get_row_html(i);
                row_html= row_html + end_columns;
                body_html = body_html + row_html;
            }
            ta.append("<tbody>" + body_html + "</body>");
            for (i = 0; i < this.hidden_list.length; ++i) {
                $(".header" + this.hidden_list[i]).css("display", "none");
            }
            $("thead").css('background-color', HEADER_NORMAL_COLOR);
            $(".can-resize").resizable({
                handles: "e",
                resize: resize_whole_column
            })
    },

    set_table_title: function (){
        the_html = "<span style='text-align:left;'>Project: " + this.project_name + "<span style='float:right;'>Collection: " + this.short_collection_name + "</span></span>"
        $("#data-title").html(the_html);
    },

    resize_table_area: function() {
            $(document).ready(function () {
                $("tbody").height(window.innerHeight - 80 - $("tbody").offset().top);
            })
    },
    find_headers: function (the_key, the_value) {
            var span = 0;
            var depth_list = [];
            var depth;
            var working_list = [];
            var result;
            var new_header_object = Object.create(header0bject)
            var i;
            if (the_value == null) {
                the_value = " "
            }
            switch (the_value.constructor) {
                case String:{
                    new_header_object.name = the_key;
                    new_header_object.span = 1;
                    new_header_object.depth = 0;
                    new_header_object.id = this.next_header_id;
                    this.next_header_id += 1;
                    new_header_object.child_list = [];
                    new_header_object.hidden = false;
                    return new_header_object;
                }
                case Object: {
                    for (i in the_value) {
                        if (the_value.hasOwnProperty(i)) {
                            result = this.find_headers(i, the_value[i])
                            span += result.span
                            depth_list.push(result.depth)
                            working_list.push(result)
                        }
                    }
                    new_header_object.name = the_key;
                    new_header_object.span = span;
                    new_header_object.id = this.next_header_id;
                    this.next_header_id += 1;
                    depth = 1 + Math.max.apply(null, depth_list)
                    new_header_object.depth = depth;
                    new_header_object.child_list = working_list;
                    new_header_object.hidden = false;
                    return new_header_object;
                }
            }
        },
    get_header_html: function (hstruct) {
            var depth;
            var res = "";
            var res_object;
            var total_span;
            var i;

            //Here we start with depth - 1 because we don't want to print the table title.
            var ncols = this.signature_list.length + 2;
            if (SHOW_ALL_HEADER_ROWS) {
                for (depth = (hstruct.depth - 1); depth >= 0; --depth) {
                    res_object = this.build_header_html_for_depth(hstruct, depth, "");
                    var new_html = res_object.html;
                    total_span = res_object.total_span;
                    for (i = total_span; i < ncols; ++i) {
                        new_html += "<th colspan='1'> </th>"
                    }
                    res = res + "<tr>" + new_html + "</tr>"
                }
            }
            else {
                res_object = this.build_header_html_for_depth(hstruct, 0, "")
                new_html = res_object.html;
                total_span = res.total_span;
                for (i = total_span; i < ncols; ++i) {
                    new_html += "<th colspan='1'> </th>"
                }
                res = res + "<tr>" + new_html + "</tr>";
            }
            return res
        },
    build_header_html_for_depth: function (hstruct, depth, class_text) {
            var res = "";
            var i, total_span;
            var th_template = "<th colspan='{{span}}' id='{{id}}' class='{{class_text}}' onclick='click_header(this)'>" +
                "{{the_text}}" +
                "</th>"
            var th_template_resize = "<th colspan='{{span}}' id='{{id}}' class='{{class_text}} can-resize' onclick='click_header(this)'>" +
                "{{the_text}}" +
                "</th>"
            class_text = class_text + "header" + hstruct.id +" "
            if (hstruct.depth == depth){
                if (hstruct.span == 1) {
                    res = Mustache.to_html(th_template_resize, {
                        "span": hstruct.span,
                        "the_text": hstruct.name.toLowerCase(),
                        "id": String(hstruct.id),
                        "class_text": class_text
                    })
                }
                else {
                    res = Mustache.to_html(th_template, {
                        "span": hstruct.span,
                        "the_text": hstruct.name.toLowerCase(),
                        "id": String(hstruct.id),
                        "class_text": class_text
                    })
                }
                total_span = hstruct.span;
            }
            else {
                total_span = 0
            }
            for (i = 0; i < hstruct.child_list.length; ++i){
                var res_object = this.build_header_html_for_depth(hstruct.child_list[i], depth, class_text)
                res = res + res_object.html
                total_span += res_object.total_span
                //res = res + this.build_header_html_for_depth(hstruct.child_list[i], depth, class_text, total_span)
            }
            return {"html": res, "total_span":total_span}
        },

    build_signature_list: function (hstruct, sofar) {
        var i;
        var result = [];
        var newsofar = sofar.slice(0)
        newsofar.push([hstruct.name, "header" + hstruct.id])
        if (hstruct.child_list.length == 0) {
            return [newsofar]
        }
        for (i = 0; i < hstruct.child_list.length; ++i) {
            result = result.concat(this.build_signature_list(hstruct.child_list[i], newsofar))
        }
        return result
    },

    get_row_html: function (row_index) {
            var i;
            var j;
            var sig;
            var current;
            var res = ""
            var td_template = "<td contenteditable='true' onmouseup='text_select(event)' class='{{class_text}} mousetrap')>{{the_text}}</td>"
            // Note the loop below starts at 1 because my signature list has an extra
            // root node listed at the start
            class_text = [];

            for (i = 0; i < this.table_array[row_index].length; ++i) {
                sig = this.signature_list[i];
                current = this.table_array[row_index][i]
                var id_text = ""
                for (j = 1; j < sig.length; ++j) {
                        id_text = id_text + sig[j][1] + " "
                }
                res = res + Mustache.to_html(td_template, {"the_text": current, "class_text": id_text.trim()})
            }
            return res
        },

    //This is no longer used.
    get_cell_value_from_sig: function(row_dict, sig) {
        var current = row_dict;
        // Note the loop below starts at 1 because my signature list has an extra
        // root node listed at the start
        for (var j = 1; j < sig.length; ++j) {
            current = current[sig[j][0]]
        }
        return current
    },

    update_doc_list: function (row_index, sig, new_content){
        var the_row = this.doc_list[row_index]
        var result = the_row
        for (var j = 1; j < (sig.length - 1); ++j) {
            field = sig[j]
            result = result[field[0]]
        }
        result[sig[sig.length - 1][0]] = new_content

    },

    freeze_header: function (table_id) {
            tidstr = "#" + this.table_id
            var ncols = $(tidstr).find("tbody tr:first td").length
            var all_rows = $(tidstr).find("tr")
            column_widths = [];
            //this.big_fields = []
            for (c = 0; c < ncols; ++c){
                column_widths.push(0);
                //this.big_fields.push(0)
            }
            var the_row;
            var the_width;
            var the_text;

            var panel_width = $("#main-panel").width()
            var max_field_width = panel_width * MAX_BIGFIELD_FRACTION;

            // Get the max width of each column
            for (var r = 0; r < all_rows.length; ++r) {
                the_row = all_rows[r]
                ncols = the_row.cells.length

                for (c = 0; c < ncols; ++c){
                    the_child = the_row.cells[c];
                    the_width = the_child.offsetWidth + ADDED_HEADER_WIDTH;
                    the_text = the_child.innerHTML;

                    the_colspan = the_child.colSpan;

                    if (the_colspan == 1){
                        if (the_width > max_field_width) {
                            the_width = max_field_width
                        }
                        //if (the_text.length > 100) {
                        //    this.big_fields[c] = 1
                        //}
                       if (the_width > column_widths[c]){
                           column_widths[c] = the_width
                        }
                    }
                }
            }

            var total = 0;
            $.each(column_widths, function() {
                total += this;
            })
            $("#" + this.table_id).width(String(total));

            // Set all column widths
            var i;
            var new_width;
            var c;
            var the_child;
            var the_colspan;
            var entry_counter;
            for (r = 0; r < all_rows.length; ++r) {
                the_row = all_rows[r];
                ncols = this.signature_list.length + 2; // We add 2 for the 2 extra columns added at the end
                c = 0;
                entry_counter = 0;
                while (c < ncols){
                    the_child = the_row.cells[entry_counter];
                    the_colspan = the_child.colSpan;
                    new_width = 0;
                    for (i = 0; i < the_colspan; ++i){
                        new_width = new_width + column_widths[c + i]
                    }
                    the_child.style.width = String(new_width) + "px";
                    //if ((the_colspan == 1) && (big_fields[c] == 1)){
                    //    the_child.style.minWidth = MIN_BIGFIELD_WIDTH
                    //}
                    c = c + the_colspan
                    entry_counter += 1
                }
            }
        return column_widths
    },
    rowup: function (clicked_element) {
          var $row = $(clicked_element).parents('tr');
          if ($row.index() === 1) return; // Don't go above the header
          $row.prev().before($row.get(0));
    },
    rowdown: function (clicked_element) {
          var $row = $(clicked_element).parents('tr');
          $row.next().after($row.get(0));
    },
    rowremove: function (clicked_element) {
        $(clicked_element).parents('tr').detach();
    }
}

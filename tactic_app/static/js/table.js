/**
 * Created by bls910 on 7/11/15.
 */
// This controls how wide the widest field can be as
// a fraction of the containing panel
MAX_BIGFIELD_FRACTION = .25;
SHOW_ALL_HEADER_ROWS = true;
ADDED_HEADER_WIDTH = 35;
HEADER_SELECT_COLOR = "#9d9d9d";
HEADER_NORMAL_COLOR = "#ddd"

header0bject = {
    name: "placeholder",
    id: null,
    span: 0,
    depth: 0,
    child_list: [],
    hidden: false,
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
    unhide_all: function() {
        this.hidden = false;
        for (var i = 0; i < this.child_list.length; ++i) {
            this.child_list[i].unhide_all();
        }
    }
}

var tableObject = {
    table_id: "table-area",
    next_header_id: 0,
    header_struct: null,
    signature_list: [],
    collection_name: null,
    doc_list: null,
    column_widths: null,
    big_fields: null, // Right now I don't think this is used for anything.
    selected_header: null,

    load_data: function (data_object){
            this.collection_name = data_object["collection_name"]
            this.doc_list = data_object["the_rows"]

            var sample_row = this.doc_list[0];
            this.header_struct = this.find_headers(this.collection_name, sample_row);
            this.build_table()
        },
    build_table: function() {
            this.signature_list = [];
            this.build_signature_list(this.header_struct, []);
            this.create_all_html();
            this.resize_table_area();
            this.freeze_header(this.table_id);
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
            $("#data-title").html(this.header_struct.name)
            ta = $("#" + this.table_id);
            ta.html(header_html);
            var row_html;
            var body_html = "";
            var i;
            for (i = 0; i < this.doc_list.length; ++i) {
                row_html = "<tr>";
                row_html = row_html + this.get_row_html(this.doc_list[i]);
                row_html= row_html + end_columns;
                body_html = body_html + row_html;
            }
            ta.append("<tbody>" + body_html + "</body>")
    },
    resize_table_area: function() {
            $(document).ready(function () {
                $("tbody").height(window.innerHeight - 40 - $("tbody").offset().top);
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
                    return new_header_object;
                }
            }
        },
    get_header_html: function (hstruct) {
            var depth;
            var res = "";

            //Here we start with depth - 1 because we don't want to print the table title.
            if (SHOW_ALL_HEADER_ROWS) {
                for (depth = (hstruct.depth - 1); depth >= 0; --depth) {
                    res = res + "<tr>"
                    res = res + this.build_header_html_for_depth(hstruct, depth)
                    res = res + "</tr>"
                }
            }
            else {
                res = "<tr>" + build_header_html_for_depth(hstruct, 0) + "</tr>"
            }
            return res
        },
    build_header_html_for_depth: function (hstruct, depth) {
            var res = "";
            var i;
            //var th_template = "<th colspan='{{span}}' id='{{id}}' onmouseenter='mouse_enter_header(this)' onmouseleave='mouse_leave_header(this)'>" +
            //    "{{the_text}}" +
            //    "</th>"

            var th_template = "<th colspan='{{span}}' id='{{id}}' onclick='click_header(this)'>" +
                "{{the_text}}" +
                "</th>"
            if (hstruct.depth == depth){
                res = Mustache.to_html(th_template, {"span": hstruct.span, "the_text": hstruct.name.toLowerCase(), "id": String(hstruct.id)})
            }
            for (i = 0; i < hstruct.child_list.length; ++i){
                if (hstruct.child_list[i].hidden == false) {
                    res = res + this.build_header_html_for_depth(hstruct.child_list[i], depth)
                }
            }
            return res
        },
    build_signature_list: function (hstruct, sofar) {
            var me = hstruct.name
            var i;
            var newsofar = sofar.slice(0)
            newsofar.push(me)
            if (hstruct.child_list.length == 0) {
                this.signature_list.push(newsofar)
                return
            }
            for (i = 0; i < hstruct.child_list.length; ++i) {
                if (hstruct.child_list[i].hidden == false) {
                    this.build_signature_list(hstruct.child_list[i], newsofar)
                }
            }
            return
        },
    get_row_html: function (row_dict) {
            var i;
            var j;
            var sig;
            var current;
            res = ""
            var td_template = "<td contenteditable='true'>{{the_text}}</td>"
            for (i = 0; i < this.signature_list.length; ++i) {
                sig = this.signature_list[i];
                current = row_dict;
                // Note the loop below starts at 1 because my signature list has an extra
                // root node listed at the start
                for (j = 1; j < sig.length; ++j) {
                    current = current[sig[j]]
                }
                res = res + Mustache.to_html(td_template, {"the_text": current})
            }
            return res
        },
    freeze_header: function (table_id) {
            tidstr = "#" + this.table_id
            var ncols = $(tidstr).find("tbody tr:first td").length
            var all_rows = $(tidstr).find("tr")
            this.column_widths = [];
            this.big_fields = []
            for (c = 0; c < ncols; ++c){
                this.column_widths.push(0);
                this.big_fields.push(0)
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
                        if (the_text.length > 100) {
                            this.big_fields[c] = 1
                        }
                       if (the_width > this.column_widths[c]){
                            this.column_widths[c] = the_width
                        }
                    }
                }
            }

            var total = 0;
            $.each(this.column_widths, function() {
                total += this;
            })
            $("#" + this.table_id).width(String(total));

            // Set all column widths
            var i;
            var new_width
            for (r = 0; r < all_rows.length; ++r) {
                the_row = all_rows[r]
                ncols = the_row.cells.length
                c = 0
                while (c < ncols){
                    the_child = the_row.cells[c];
                    the_colspan = the_child.colSpan;
                    new_width = 0;
                    for (i = 0; i < the_colspan; ++i){
                        new_width = new_width + this.column_widths[c + i]
                    }
                    the_child.style.width = String(new_width) + "px";
                    //if ((the_colspan == 1) && (big_fields[c] == 1)){
                    //    the_child.style.minWidth = MIN_BIGFIELD_WIDTH
                    //}
                    c = c + the_colspan
                }
            }
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


//function click_left (clicked_element) {
//    var $hcell = $(clicked_element).parents('th');
//    var the_id = $hcell.attr("id");
//    var parent_struct = tableObject.header_struct.find_parent_of_id(the_id);
//    parent_struct.shift_child_left(the_id);
//    tableObject.build_table();
//}
//
//function click_right (clicked_element) {
//    var $hcell = $(clicked_element).parents('th');
//    var the_id = $hcell.attr("id");
//    var parent_struct = tableObject.header_struct.find_parent_of_id(the_id);
//    parent_struct.shift_child_right(the_id);
//    tableObject.build_table()
//}
//
//function hide_column (clicked_element) {
//    var $hcell = $(clicked_element).parents('th');
//    var the_id = $hcell.attr("id");
//    var my_struct = tableObject.header_struct.find_struct_by_id(the_id);
//    my_struct.hidden = true;
//    tableObject.build_table();
//}
//function mouse_enter_header(el) {
//    header_save = el.innerHTML
//    new_html = "<span class='glyphicon header-glyphicon glyphicon-arrow-left' onclick=click_left(this)></span>" +
//        header_save + "<span class='glyphicon header-glyphicon glyphicon-arrow-right' onclick=click_right(this)></span>" +
//            "<span class='glyphicon header-glyphicon glyphicon-remove' onclick=hide_column(this)></span>"
//
//    $(el).html(new_html)
//}
//function mouse_leave_header(el) {
//    $(el).html(header_save)
//}
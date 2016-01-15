
var tile_dict = {}

function showZoomedImage(el) {
    src = el.src
    image_string = "<img class='output-plot' src='" + src +  "' lt='Image Placeholder'>"
    $("#image-modal .modal-body").html(image_string)
    $("#image-modal").modal()
}



function TileObject(tile_id, html, broadcast_size) {
    this.tile_id = tile_id;
    $("#tile-div").append(html);
    $("#tile_body_" + this.tile_id).flip({
        "trigger": "manual",
        "autoSize": false,
        "forceWidth": true,
        "forceHeight": true
    });
    var self = this
    $(this.full_selector()).resizable({
        handles: "se",
        resize: self.resize_tile_area,
        stop: function () {
            self.broadcastTileSize()
        }
    });
    jQuery.data($(this.full_selector())[0], "my_tile_id", this.tile_id)
    this.listen_for_clicks();
    $(this.full_selector()).find(".triangle-right").hide()
    this.do_resize();
    if (broadcast_size){
        this.broadcastTileSize();
    }
}

TileObject.prototype = {
    spinner: null,
    full_selector: function() {
        return "#" + this.tile_id;
    },
    submitOptions: function (){
        var data = {};
        data["main_id"] = main_id;
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

        data["tile_id"] = this.tile_id
        broadcast_event_to_server("UpdateOptions", data)
    },
    broadcastTileSize: function() {
        var w = $(this.full_selector() + " .tile-display-area").width();
        var h = $(this.full_selector() + " .tile-display-area").height();
        var full_tile_w =  $(this.full_selector()).width();
        var full_tile_h = $(this.full_selector()).height();
        var data_dict = {"tile_id": this.tile_id, "width": w, "height": h,
                          "full_tile_width": full_tile_w, "full_tile_height": full_tile_h};
        broadcast_event_to_server("TileSizeChange", data_dict)
    },
    do_resize: function(){
        el = $(this.full_selector());
        ui = {
            "element": el,
            "size": {"width": el.outerWidth(), "height": el.outerHeight()}
        };
        this.resize_tile_area(null, ui);
    },

    setTileSize: function(data) {
        el = $(this.full_selector());
        el.width(data.width);
        el.height(data.height);
        ui = {
            "element": el,
            "size": data
        };
        this.resize_tile_area(null, ui);
    },

    displayTileContent: function (data) {
        $(this.full_selector() + " .tile-display-area").html(data["html"]);
        var sortable_tables = $(this.full_selector() + " table.sortable")
        $.each(sortable_tables, function (index, the_table) {
            sorttable.makeSortable(the_table)
        })
        this.showFront()
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
        var my_tile_id = this.tile_id
        $(this.full_selector()).fadeOut("slow", function () {
            $(this).remove();
            var data_dict = {}
            data_dict["main_id"] = main_id;
            data_dict["tile_id"] = my_tile_id
            broadcast_event_to_server("RemoveTile", data_dict)
        });
    },

    shrinkMe: function (){
        el = $(this.full_selector());
        this.saved_size = el.outerHeight();
        broadcast_event_to_server("ShrinkTile", {tile_id: this.tile_id});
        el.find(".tile-body").fadeOut("fast", function () {
            var hheight = el.find(".tile-panel-heading").outerHeight()
            el.outerHeight(hheight)
            el.resizable('destroy');
            el.find(".triangle-bottom").hide();
            el.find(".triangle-right").show();
            }
        );

    },
    expandMe: function (){
        el = $(this.full_selector())
        el.outerHeight(this.saved_size)
        el = $(this.full_selector()).find(".triangle-right").hide();
        el = $(this.full_selector()).find(".triangle-bottom").show();
        el = $(this.full_selector()).find(".tile-body").fadeIn();
        var self = this;
        broadcast_event_to_server("ExpandTile", {tile_id: this.tile_id});
        el = $(this.full_selector()).resizable({
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
        the_margin = $(".tile-display-area").css("margin-left").replace("px", "")
        $(display_area).outerHeight(ui.size.height - hheight - the_margin * 2);
        $(display_area).outerWidth(ui.size.width - the_margin * 2);
        var back_element = ui.element.find(".back")[0];
        $(back_element).outerHeight(ui.size.height - hheight);
        $(back_element).outerWidth(ui.size.width);
        computed_width = ui.element.width()
        computed_height = ui.element.height()
        ui.element.width(computed_width)
        ui.element.height(computed_height)
        var scripts = $(ui.element.find(".tile-display-area")).find("script")
        for (var i = 0; i < scripts.length; i = i+1) {
            eval(scripts[i].innerHTML)
        }
    },

    flipMe: function (){
        if ($("#tile_body_" + this.tile_id + " .back")[0].style.display == "none") {
            this.showBack();
        }
        else {
            this.showFront();
        }
    },
    showFront: function (){
        $("#tile_body_" + this.tile_id + " .front").fadeIn()
        $("#tile_body_" + this.tile_id).flip(false);
        $("#tile_body_" + this.tile_id + " .back").fadeOut()

    },
    showBack: function (){
        $("#tile_body_" + this.tile_id + " .back").fadeIn()
        $("#tile_body_" + this.tile_id).flip(true);
        $("#tile_body_" + this.tile_id + " .front").fadeOut()

    },
    spin_and_refresh: function () {
        // I'm chaining these with callbacks just to make sure they don't get out of order
        broadcast_event_to_server("StartSpinner", {"tile_id": this.tile_id}, function () {
            broadcast_event_to_server("RefreshTile", {"tile_id": this.tile_id}, function() {
                broadcast_event_to_server("StopSpinner", {"tile_id": this.tile_id})
            })
        })

    },
    refreshFromSave: function () {
        broadcast_event_to_server("SetSizeFromSave", {"tile_id": this.tile_id}, function() {
            broadcast_event_to_server("RefreshTileFromSave", {"tile_id": this.tile_id})
        })
    },
    listen_for_clicks: function() {
        $(".front").on('click', '.word-clickable', function(e) {
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
              broadcast_event_to_server("TileWordClick", data_dict)
        });
        $(".front").on('click', '.cell-clickable', function(e) {

            var tile_id = jQuery.data(e, "my_tile_id");
            var txt = $(this).text()

            var data_dict = {};
            var p = $(e.target).closest(".tile-panel")[0];
            data_dict["tile_id"] = $(p).data("my_tile_id");
            data_dict["clicked_cell"] = txt;
            broadcast_event_to_server("TileCellClick", data_dict)
        });
        $(".front").on('click', '.row-clickable', function(e) {
            //var cells = $(this).closest("tr").children()
            var cells = $(this).children()
            var row_vals = []
            cells.each(function() {
                row_vals.push($(this).text())
            })
            var tile_id = jQuery.data(e, "my_tile_id");

            var data_dict = {};
            var p = $(e.target).closest(".tile-panel")[0];
            data_dict["tile_id"] = $(p).data("my_tile_id");
            data_dict["clicked_row"] = row_vals;
            broadcast_event_to_server("TileRowClick", data_dict)
        });
        $(".front").on('click', 'button', function(e) {
            var p = $(e.target).closest(".tile-panel")[0];
            var data = {}
            data["tile_id"] = $(p).data("my_tile_id");
            data["button_value"] = e.target.value
            broadcast_event_to_server("TileButtonClick", data)
        });
    }

};
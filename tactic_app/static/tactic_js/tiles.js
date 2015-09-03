

var tile_dict = {}

function create_new_tile(menu_id) {
    var data_dict = {};
    data_dict["main_id"] = main_id;
    $.ajax({
        url: $SCRIPT_ROOT + "/create_tile_request/" + String(menu_id),
        contentType : 'application/json',
        type : 'POST',
        data: JSON.stringify(data_dict),
        dataType: 'json',
        success: function (data) {
            $("#tile-div").append(data.html);
            $("#tile_body_" + data.tile_id).flip({
                "trigger": "manual",
                "autoSize": false,
                "forceWidth": true,
                "forceHeight": true
            });
            var new_tile_elem = $("#tile_id_" + data.tile_id)
            new_tile_elem.resizable({
                handles: "se",
                resize: resize_tile_area
            });
            jQuery.data(new_tile_elem[0],"my_tile_id", data.tile_id)
            listen_for_clicks();
            $("#tile_id_" + data.tile_id).find(".triangle-right").hide()
            new_tile_object = Object.create(tile_object);
            new_tile_object.tile_id = data.tile_id;
            tile_dict[data.tile_id] = new_tile_object;
            do_resize(data.tile_id);
            //new_tile_object.initiateTileRefresh();
            data_dict.tile_id = data.tile_id
            spin_and_refresh(data_dict.tile_id)
        }
    })
}

function spin_and_refresh(tile_id) {
    broadcast_event_to_server("StartSpinner", {"tile_id": tile_id})
    broadcast_event_to_server("RefreshTile", {"tile_id": tile_id})
    broadcast_event_to_server("StopSpinner", {"tile_id": tile_id})
}

function listen_for_clicks() {
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
    $(".front").on('click', 'button', function(e) {
        var p = $(e.target).closest(".tile-panel")[0];
        var data = {}
        data["tile_id"] = $(p).data("my_tile_id");
        data["button_value"] = e.target.value
        broadcast_event_to_server("TileButtonClick", data)
    });
}

function create_tile_from_save(tile_id) {
    var data_dict = {};
    data_dict["tile_id"] = tile_id;
    data_dict["main_id"] = main_id;
    $.ajax({
        url: $SCRIPT_ROOT + "/create_tile_from_save_request/" + String(tile_id),
        contentType : 'application/json',
        type : 'POST',
        data: JSON.stringify(data_dict),
        dataType: 'json',
        success: function (data) {
            $("#tile-div").append(data.html);
            $("#tile_body_" + data.tile_id).flip({
                "trigger": "manual",
                "autoSize": false,
                "forceWidth": true,
                "forceHeight": true
            });
            $("#tile_id_" + data.tile_id).resizable({
                handles: "se",
                resize: resize_tile_area
            });
            new_tile_object = Object.create(tile_object);
            new_tile_object.tile_id = data.tile_id;
            tile_dict[data.tile_id] = new_tile_object;
            do_resize(data.tile_id);
            listen_for_clicks();
            $("#tile_id_" + data.tile_id).find(".triangle-right").hide()
            //new_tile_object.initiateTileRefresh();
            broadcast_event_to_server("RefreshTileFromSave", {"tile_id": data.tile_id})
        }
    })
}

function broadcast_event_to_server(event_name, data_dict) {
    data_dict["main_id"] = main_id;
    $.ajax({
        url: $SCRIPT_ROOT + "/distribute_events/" + event_name,
        contentType : 'application/json',
        type : 'POST',
        data: JSON.stringify(data_dict)
    });
}

function resize_tile_area(event, ui) {
    var header_element = ui.element.children(".panel-heading")[0];
    var hheight = $(header_element).outerHeight();
    var front_element = ui.element.find(".front")[0];
    $(front_element).outerHeight(ui.size.height - hheight);
    $(front_element).outerWidth(ui.size.width);
    var display_area = ui.element.find("#tile-display-area");
    the_margin = $("#tile-display-area").css("margin-left").replace("px", "")
    $(display_area).outerHeight(ui.size.height - hheight - the_margin * 2);
    $(display_area).outerWidth(ui.size.width - the_margin * 2);
    var back_element = ui.element.find(".back")[0];
    $(back_element).outerHeight(ui.size.height - hheight);
    $(back_element).outerWidth(ui.size.width)
}

function do_resize(tile_id){
    el = $("#tile_id_" + tile_id);
    ui = {
        "element": el,
        "size": {"width": el.outerWidth(), "height": el.outerHeight()}
    };
    resize_tile_area(null, ui);
}


var tile_object = {
    tile_id: null,
    spinner: null,
    full_selector: function() {
        return "#tile_id_" + this.tile_id;
    },
    submitOptions: function (){
        var data = {};
        data["main_id"] = main_id;
        $(this.full_selector() + " .back input").each(function () {
                data[$(this).attr('id')] = $(this).val()
            }
        );
        $(this.full_selector() + " .back select :selected").each(function () {
                data[$(this).parent().attr('id')] = $(this).text()
            }
        );
        $(this.full_selector() + " .back textarea").each(function () {
                lines = $(this).val().split(/\n/);
                clean_lines = []
                for (l = 0; l < lines.length; ++l){
                    clean_lines.push($.trim(lines[l]))
                }
                data[$(this).attr('id')] = clean_lines
            }
        );
        data["tile_id"] = this.tile_id
        broadcast_event_to_server("UpdateOptions", data)
    },
    displayTileContent: function (data) {
        $(this.full_selector() + " #tile-display-area").html(data["html"]);
        this.showFront()
    },
    startSpinner: function() {
        this.spinner = new Spinner({scale: 0.4, left:"15px"}).spin();
        $(this.full_selector() + " #spin-place").html(this.spinner.el);
    },

    stopSpinner: function () {
        this.spinner.stop();
        this.spinner = null
    },

    closeMe: function(){
        var my_tile_id = this.tile_id
        $(this.full_selector()).fadeOut("slow", function () {
            //var tile_id = $(this).attr("id")
            $(this).remove();
            var data_dict = {}
            data_dict["main_id"] = main_id;
            data_dict["tile_id"] = my_tile_id
            broadcast_event_to_server("RemoveTile", data_dict)
        });
    },

    shrinkMe: function (){
        el = $(this.full_selector())
        el.find(".tile-body").fadeOut();
        el.slideToggle({
            "duration": "medium",
            "step": function (now, tween) {
                if (tween.prop == "height") {
                    hheight = $(tween.elem).children(".panel-heading").outerHeight()
                    if (now <= hheight){
                        $(tween.elem).stop()

                    }
                }
            }
        })
        el.resizable('destroy');
        el.find(".triangle-bottom").hide();
        el.find(".triangle-right").show();
    },
    expandMe: function (){
        el = $(this.full_selector())
        el = $(this.full_selector()).slideToggle({
            "duration": "medium",
        })
        el = $(this.full_selector()).find(".triangle-right").hide();
        el = $(this.full_selector()).find(".triangle-bottom").show();
        el = $(this.full_selector()).find(".tile-body").fadeIn();
        el = $(this.full_selector()).resizable({
                handles: "se",
                resize: resize_tile_area
            });
    },

    flipMe: function (){
        $("#tile_body_" + this.tile_id).flip('toggle');
    },
    showFront: function (){
        $("#tile_body_" + this.tile_id).flip(false);
    }
};
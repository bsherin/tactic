

var tile_dict = {}

function create_new_tile(menu_id) {
    data_dict = {};
    data_dict["main_id"] = main_id;
    $.ajax({
        url: $SCRIPT_ROOT + "/create_tile/" + String(menu_id),
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
            new_tile_object.initiateTileRefresh();
        }
    })
}

function create_tile_from_save(tile_id) {
    data_dict = {};
    data_dict["tile_id"] = tile_id;
    data_dict["main_id"] = main_id;
    $.ajax({
        url: $SCRIPT_ROOT + "/create_tile_from_save/" + String(tile_id),
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
            new_tile_object.initiateTileRefresh();
        }
    })
}

function create_tile_relevant_event(event_name, data_dict) {
    data_dict["main_id"] = main_id;
    $.ajax({
        url: $SCRIPT_ROOT + "/tile_relevant_event/" + event_name,
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

// This is needed just because of one callback in tile_object
function refresh_tile_content(data){
    tile_dict[data.tile_id].refreshTileContent(data)
}

var tile_object = {
    tile_id: null,
    spinner: null,
    full_selector: function() {
        return "#tile_id_" + this.tile_id;
    },
    initiateTileRefresh: function () {
        data_dict["main_id"] = main_id;
        $.ajax({
            url: $SCRIPT_ROOT + "/get_tile_content/" + String(this.tile_id),
            contentType : 'application/json',
            type : 'POST',
            data: JSON.stringify(data_dict),
            success: refresh_tile_content
        });
    },
    submitOptions: function (){
        var data = {};
        data["main_id"] = main_id;
        $(this.full_selector() + " input").each(function () {
                data[$(this).attr('id')] = $(this).val()
            }
        );
        $(this.full_selector() + " select :selected").each(function () {
                data[$(this).parent().attr('id')] = $(this).text()
            }
        );
        $.ajax({
            url: $SCRIPT_ROOT + "/submit_options/" + this.tile_id,
            contentType : 'application/json',
            type : 'POST',
            async: false,
            data: JSON.stringify(data),
            dataType: 'json'
        });
    },
    refreshTileContent: function (data) {
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
        $(this.full_selector()).remove();
        data_dict["main_id"] = main_id;
        $.ajax({
            url: $SCRIPT_ROOT + "/remove_tile/" + this.tile_id,
            contentType : 'application/json',
            type : 'POST',
            async: false,
            data: JSON.stringify(data_dict),
            dataType: 'json'
        });

    },

    flipMe: function (){
        $("#tile_body_" + this.tile_id).flip('toggle');
    },
    showFront: function (){
        $("#tile_body_" + this.tile_id).flip(false);
    }
};
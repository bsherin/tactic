/**
 * Created by bls910 on 11/1/15.
 */

function updateObject(o1, o2) {
    for (var prop in o2) {
        if (o2.hasOwnProperty(prop)){
            o1[prop] = o2[prop]
        }
    }
}

String.prototype.format = function() {
  var str = this;
  for (var i = 0; i < arguments.length; i++) {
    var reg = new RegExp("\\{" + i + "\\}", "gm");
    str = str.replace(reg, arguments[i]);
  }
  return str;
};

function objectKeys(obj) {
    var result = [];
    for (var key in obj){
        if (!obj.hasOwnProperty(key)) continue;
        result.push(key)
    }
    return result
}

function ResourceManager(res_type, specifics) {
    this.res_type = res_type;
    updateObject(this, specifics);
    this.add_listeners()
}

ResourceManager.prototype = {
    add_listeners: function () {
        var self = this;
        $.each(this.buttons, function (index, value) {
            $("#{0}-{1}-button".format(value.name, self.res_type)).click({"manager": self}, self[value.func])
        });
    },

    check_for_selection: function (res_type, col_num) {
        if (col_num == null) {
            col_num = 0
        }
        //var res_name = $('#' + res_type + '-selector > .btn.active').text().trim();
        var res_name = $('.resource-selector .' + res_type + '-selector-button.active').children()[col_num].innerHTML;
        if (res_name == "") {
            doFlash({"message": "Select a " + res_type + " first.", "alert_type": "alert-info"})
        }
        return res_name
    },

    check_for_repository_selection: function (res_type) {
        //var res_name = $('#' + res_type + '-selector > .btn.active').text().trim();
        var res_name = $('.repository-selector .' + res_type + '-selector-button.active').children()[0].innerHTML;
        if (res_name == "") {
            doFlash({"message": "Select a " + res_type + " first.", "alert_type": "alert-info"})
        }
        return res_name
    },

    create_module_html: function () {
            var res = Mustache.to_html(admin_resource_module_template, this);
            $("#" + this.res_type + "-module").html(res);
        }

};


function select_resource_button(res_type, res_name) {
    if (res_name == null) {
        if ($("#" + res_type + "-selector").children().length > 0) {
            selector_click({"target": $("#" + res_type + "-module tbody tr")[0]});
        }
    }
    else {
        $("#" + res_type + "-selector").scrollTop($("#" + res_type + "-selector-" + res_name).position().top);
        selector_click({"target": document.getElementById(res_type + "-selector-" + res_name)})
    }
}

function selector_click(event) {
    var row_element = $(event.target).closest('tr');
    var cells = row_element.children();
    var res_name = $(cells[0]).text();
    var tab_parent = $(event.target).closest(".tab-pane");
    var regexp = /^(\w+?)-/;
    var res_type = regexp.exec(tab_parent.attr("id"))[1];
    $(".resource-selector ." + res_type + "-selector-button").removeClass("active");
    row_element.addClass("active");
    //var res_name = $('.resource-selector .' + res_type + '-selector-button.active')[0].value;
    var result_dict = {"res_type": res_type, "res_name": res_name};
}

function selector_double_click(event) {
    var row_element = $(event.target).closest('tr');
    var cells = row_element.children();
    var res_name = $(cells[0]).text();
    var tab_parent = $(event.target).closest(".tab-pane");
    var regexp = /^(\w+?)-/;
    var res_type = regexp.exec(tab_parent.attr("id"))[1];
    $(".resource-selector ." + res_type + "-selector-button").removeClass("active");
    row_element.addClass("active");
    //var res_name = $('.resource-selector .' + res_type + '-selector-button.active')[0].value;
    var result_dict = {"res_type": res_type, "res_name": res_name};
    var the_manager = resource_managers[res_type];
    the_manager[the_manager.double_click_func]({data: {manager: the_manager}})
}


function search_resource(event) {
    unfilter_resource(event)
    var res_type = event.target.value;
    var txt = document.getElementById(res_type + '-search').value.toLowerCase();
    var all_rows = $("#" + res_type + "-selector tbody tr");
    $.each(all_rows, function (index, row_element) {
        var cells = $(row_element).children();
        var res_name = $(cells[0]).text().toLowerCase();
        if (res_name.search(txt) == -1) {
            $(row_element).fadeOut()
        }
    });
    select_resource_button(res_type, null)
}

function search_repository_resource(event) {
    unfilter_repository_resource(event)
    var res_type = event.target.value;
    var txt = document.getElementById("repository-" + res_type + '-search').value.toLowerCase();
    var all_rows = $("#repository-" + res_type + "-selector tbody tr");
    $.each(all_rows, function (index, row_element) {
        var cells = $(row_element).children();
        var res_name = $(cells[0]).text().toLowerCase();
        if (res_name.search(txt) == -1) {
            $(row_element).fadeOut()
        }
    });
    select_repository_button(res_type, null);
}

function search_resource_tags(event) {
    unfilter_resource(event)
    var res_type = event.target.value;
    var txt = document.getElementById(res_type + '-search').value.toLowerCase();
    var all_rows = $("#" + res_type + "-selector tbody tr");
    $.each(all_rows, function (index, row_element) {
        var cells = $(row_element).children();
        var tag_text = $(cells[3]).text().toLowerCase();
        if (tag_text.search(txt) == -1) {
            $(row_element).fadeOut()
        }
    });
    select_resource_button(res_type, null)
}

function unfilter_resource(event) {
    var res_type = event.target.value;
    var all_rows = $("#" + res_type + "-selector tbody tr");
    $.each(all_rows, function (index, row_element) {
            $(row_element).fadeIn()
    })
}

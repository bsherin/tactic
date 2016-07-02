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
    show_add: true,
    show_multiple:false,
    repository_copy_view: '/copy_from_repository',
    show_loaded_list: false,
    add_listeners: function () {
        var self = this;
        $.each(this.buttons, function (index, value) {
            $("#{0}-{1}-button".format(value.name, self.res_type)).click({"manager": self}, self[value.func])
        });
        $.each(this.repository_buttons, function (index, value) {
            $("#repository-{0}-{1}-button".format(value.name, self.res_type)).click({"manager": self}, self[value.func])
        });
        if (this.show_add) {
            $("#add-{0}-form".format(self.res_type)).submit({"manager": self}, self.add_func)
        }
        $("#repository-copy-" + self.res_type + "-button").click({"manager": self}, self.repository_copy_func);

        $.each(this.popup_buttons, function (index, value) {
            $.each(value.option_list, function (index, opt) {
                $("#{0}-{1}-button".format(opt.opt_name, self.res_type)).click({"manager": self, "opt_name": opt.opt_name}, self[opt.opt_func])
            })
        });
    },

    add_func: function (event) {
        var manager = event.data.manager;
        $.ajax({
            url: $SCRIPT_ROOT + manager.add_view,
            type: 'POST',
            data: new FormData(this),
            processData: false,
            contentType: false,
            success: function(data) {
                if (!data.success) {
                    doFlash(data)
                }
            }
        });
        event.preventDefault();
    },

    popup_buttons: [],

    repository_buttons: [],

    load_func: function (event) {
        var manager = event.data.manager;
        var res_name = manager.check_for_selection(manager.res_type);
        if (res_name == "") return;
        window.open($SCRIPT_ROOT + manager.load_view + String(res_name))
    },

    view_func: function (event) {
        var manager = event.data.manager;
        var res_name = manager.check_for_selection(manager.res_type);
        if (res_name == "") return;
        window.open($SCRIPT_ROOT + manager.view_view + String(res_name))
    },

    duplicate_func: function (event) {
        var manager = event.data.manager;
        var res_name = manager.check_for_selection(manager.res_type);
        if (res_name == "") return;
        showModal("Duplicate " + manager.res_type, "New " + manager.res_type + " Name", function (new_name) {
            var result_dict = {
                "new_res_name": new_name,
                "res_to_copy": res_name
            };

            $.ajax({
                url: $SCRIPT_ROOT + manager.duplicate_view,
                contentType: 'application/json',
                type: 'POST',
                async: true,
                data: JSON.stringify(result_dict),
                dataType: 'json',
                success: function(data) {
                    if (!data.success) {
                        doFlash(data)
                    }
                }
            });
        })
    },

    new_func: function (event) {
        var manager = event.data.manager;
        showModal("New " + manager.res_type, "New " + manager.res_type + " Name", function (new_name) {
            var result_dict = {
                "new_res_name": new_name
            };

            $.ajax({
                url: $SCRIPT_ROOT + manager.new_view,
                contentType: 'application/json',
                type: 'POST',
                async: true,
                data: JSON.stringify(result_dict),
                dataType: 'json',
                success: function(data) {
                    if (data.success){
                        window.open($SCRIPT_ROOT + manager.view_view + String(new_name))
                    }
                    else {
                        doFlash(data)
                    }
                }
            });
        })
    },

    delete_func: function (event) {
        var manager = event.data.manager;
        var res_name = manager.check_for_selection(manager.res_type);
        if (res_name == "") return;
        confirm_text = "Are you sure that you want to delete " + res_name + "?";
        confirmDialog("Delete " + manager.res_type, confirm_text, "do nothing", "delete", function () {
            $('#list-selector .' + manager.res_type + '-selector-button.active').fadeOut();
            $("#" + manager.res_type + "-module .created").html("");
            $("#" + manager.res_type + "-tags").html("");
            $("#" + manager.res_type + "-notes").html("");
            $.post($SCRIPT_ROOT + manager.delete_view + String(res_name))
        })
    },

    repository_view_func: function (event) {
        var manager = event.data.manager;
        var res_name = manager.check_for_repository_selection(manager.res_type);
        if (res_name == "") return;
        window.open($SCRIPT_ROOT + manager.repository_view_view + String(res_name))
    },

    repository_copy_func: function (event) {
        var manager = event.data.manager;
        var res_name = manager.check_for_repository_selection(manager.res_type);
        if (res_name == "") {
            doFlash({"message": "Select a " + res_type + " first.", "alert_type": "alert-info"})
        }
        showModal("Import " + manager.res_type, "New " + manager.res_type + " Name", function (new_name) {
            var result_dict = {
                "res_type": manager.res_type,
                "res_name": res_name,
                "new_res_name": new_name
            };

            $.ajax({
                url: $SCRIPT_ROOT + manager.repository_copy_view,
                contentType: 'application/json',
                type: 'POST',
                async: true,
                data: JSON.stringify(result_dict),
                dataType: 'json',
                success: doFlash
            });
        });
        return res_name
    },

    check_for_selection: function (res_type) {
        //var res_name = $('#' + res_type + '-selector > .btn.active').text().trim();
        var res_name = $('.resource-selector .' + res_type + '-selector-button.active').children()[0].innerHTML;
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
        var res = Mustache.to_html(resource_module_template, this);
        var repos_res = Mustache.to_html(repository_module_template, this);
        res = res + repos_res;
        $("#" + this.res_type + "-module").html(res);
    }
};


function select_resource_button(res_type, res_name) {
    if (res_name == null) {
        if ($("#" + res_type + "-selector").children().length > 0) {
            selector_click({"target": $("#" + res_type + "-module tbody tr")[0]});
        }
        else {
            clear_resource_metadata(res_type)
        }
    }
    else {
        $("#" + res_type + "-selector").scrollTop($("#" + res_type + "-selector-" + res_name).position().top);
        selector_click({"target": document.getElementById(res_type + "-selector-" + res_name)})
    }
}

function select_repository_button(res_type, res_name) {
    if (res_name == null) {
        if ($("#repository-" + res_type + "-selector").children().length > 0) {
            repository_selector_click({"target": $("#repository-" + res_type + "-selector-row tbody tr")[0]});
        }
        else {
            clear_repository_resource_metadata(res_type)
        }
    }
    else {
        $("#" + res_type + "-selector").scrollTop($("#repository-" + res_type + "-selector-" + res_name).position().top);
        repository_selector_click({"target": document.getElementById("repository-" + res_type + "-selector-" + res_name)})
    }
}

function clear_resource_metadata(res_type) {
    $("#" + res_type + "-module .created").html("");
    $("#" + res_type + "-tags")[0].value = "";
    $("#" + res_type + "-tags").html("");
    $("#" + res_type + "-notes")[0].value = "";
    $("#" + res_type + "-notes").html("");
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
    $.ajax({
            url: $SCRIPT_ROOT + "/grab_metadata",
            contentType : 'application/json',
            type : 'POST',
            async: true,
            data: JSON.stringify(result_dict),
            dataType: 'json',
            success: got_metadata
    });
    function got_metadata(data) {
        if (data.success) {
            $("#" + res_type + "-module .created").html(data.datestring);
            $("#" + res_type + "-tags")[0].value = data.tags;
            $("#" + res_type + "-notes")[0].value = data.notes;
        }
        else {
            // doFlash(data)
            clear_resource_metadata(res_type)
        }
    }
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

function repository_selector_double_click(event) {
    var row_element = $(event.target).closest('tr');
    var cells = row_element.children();
    var res_name = $(cells[0]).text();
    var tab_parent = $(event.target).closest(".tab-pane");
    var regexp = /^(\w+?)-/;
    var res_type = regexp.exec(tab_parent.attr("id"))[1];
    $(".repository-selector ." + res_type + "-selector-button").removeClass("active");
    row_element.addClass("active");
    //var res_name = $('.resource-selector .' + res_type + '-selector-button.active')[0].value;
    var result_dict = {"res_type": res_type, "res_name": res_name};
    var the_manager = resource_managers[res_type];
    the_manager[the_manager.repository_double_click_func]({data: {manager: the_manager}})
}

function clear_repository_resource_metadata(res_type) {
    $("#" + res_type + "-module .repository-created").html("");
    $("#" + res_type + "-repository-tags")[0].value = "";
    $("#" + res_type + "-repository-tags").html("");
    $("#" + res_type + "-repository-notes")[0].value = "";
    $("#" + res_type + "-repository-notes").html("");
}

function repository_selector_click(event) {
    var row_element = $(event.target).closest('tr');
    var cells = row_element.children();
    var res_name = $(cells[0]).text();
    var tab_parent = $(event.target).closest(".tab-pane");
    var regexp = /^(\w+?)-/;
    var res_type = regexp.exec(tab_parent.attr("id"))[1];
    $(".repository-selector ." + res_type + "-selector-button").removeClass("active");
    row_element.addClass("active");
    var result_dict = {"res_type": res_type, "res_name": res_name};
    $.ajax({
            url: $SCRIPT_ROOT + "/grab_repository_metadata",
            contentType : 'application/json',
            type : 'POST',
            async: true,
            data: JSON.stringify(result_dict),
            dataType: 'json',
            success: got_metadata
    });
    function got_metadata(data) {
        if (data.success) {
            $("#" + res_type + "-module .repository-created").html(data.datestring);
            $("#" + res_type + "-repository-tags")[0].value = data.tags;
            $("#" + res_type + "-repository-notes")[0].value = data.notes;
        }
        else {
            // doFlash(data)
            clear_repository_resource_metadata(res_type)
        }
    }
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

function search_repository_resource_tags(event) {
    unfilter_repository_resource(event)
    var res_type = event.target.value;
    var txt = document.getElementById("repository-" + res_type + '-search').value.toLowerCase();
    var all_rows = $("#repository-" + res_type + "-selector tbody tr");
    $.each(all_rows, function (index, row_element) {
        var cells = $(row_element).children();
        var tag_text = $(cells[3]).text().toLowerCase();
        if (tag_text.search(txt) == -1) {
            $(row_element).fadeOut()
        }
    });
    select_repository_button(res_type, null)
}

function unfilter_resource(event) {
    var res_type = event.target.value;
    var all_rows = $("#" + res_type + "-selector tbody tr");
    $.each(all_rows, function (index, row_element) {
            $(row_element).fadeIn()
    })
}

function unfilter_repository_resource(event) {
    var res_type = event.target.value;
    var all_rows = $("#repository-" + res_type + "-selector tbody tr");
    $.each(all_rows, function (index, row_element) {
            $(row_element).fadeIn()
        });
    select_repository_button(res_type, null);
}

function save_metadata(event) {
    var res_type = event.target.value;
    var res_name = $('.resource-selector .' + res_type + '-selector-button.active').children()[0].innerHTML;
    var tags = $("#" + res_type + "-tags").val();
    var notes = $("#" + res_type + "-notes").val();
    var result_dict = {"res_type": res_type, "res_name": res_name, "tags": tags, "notes": notes};
        $.ajax({
            url: $SCRIPT_ROOT + "/save_metadata",
            contentType : 'application/json',
            type : 'POST',
            async: true,
            data: JSON.stringify(result_dict),
            dataType: 'json',
            success: doFlash
    });
}
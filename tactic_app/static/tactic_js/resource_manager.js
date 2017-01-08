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
    this.add_listeners();
    this.textify_button_names();
}

ResourceManager.prototype = {
    file_adders: [],
    show_multiple:false,
    repository_copy_view: '/copy_from_repository',
    send_repository_view: '/send_to_repository',
    show_loaded_list: false,
    add_listeners: function () {
        var self = this;
        this.button_groups.forEach(function(bgroup) {
            bgroup.buttons.forEach(function(value){
                $("#{0}-{1}-button".format(value.name, self.res_type)).click({"manager": self}, self[value.func])
            })
        });
        // $.each(this.buttons, function (index, value) {
        //     $("#{0}-{1}-button".format(value.name, self.res_type)).click({"manager": self}, self[value.func])
        // });
        $.each(this.repository_buttons, function (index, value) {
            $("#repository-{0}-{1}-button".format(value.name, self.res_type)).click({"manager": self}, self[value.func])
        });
        $.each(this.file_adders, function(index, value) {
                $("#{0}-{1}-form".format(value.name, self.res_type)).submit({"manager": self}, self[value.func])
            }
        );
        $("#repository-copy-" + self.res_type + "-button").click({"manager": self}, self.repository_copy_func);

        $.each(this.popup_buttons, function (index, value) {
            $.each(value.option_list, function (index, opt) {
                $("#{0}-{1}-button".format(opt.opt_name, self.res_type)).click({"manager": self, "opt_name": opt.opt_name}, self[opt.opt_func])
            })
        });
    },

    textify_button_names: function () {
        var but;
        var i;
        var but_text;
        this.button_groups.forEach(function(bgroup) {
              for (i=0; i < bgroup.buttons.length; ++i) {
                  but = bgroup.buttons[i];
                  but_text = but["name"].replace(/_/g, ' ');
                  bgroup.buttons[i]["name_text"] = but_text
              }
        });
      for (i=0; i < this.popup_buttons.length; ++i) {
          but = this.popup_buttons[i];
          but_text = but["name"].replace(/_/g, ' ');
          this.popup_buttons[i]["name_text"] = but_text
      }
      for (i=0; i < this.repository_buttons.length; ++i) {
          but = this.repository_buttons[i];
          but_text = but["name"].replace(/_/g, ' ');
          this.repository_buttons[i]["name_text"] = but_text
      }
      for (i=0; i < this.file_adders.length; ++i) {
          but = this.file_adders[i];
          but_text = but["name"].replace(/_/g, ' ');
          this.file_adders[i]["name_text"] = but_text
      }
    },

    add_func: function (event) {
        var manager = event.data.manager;
        form_data = new FormData(this);
        postAjaxUpload(manager.add_view, form_data, doFlashOnFailure);
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
        var the_type = manager.res_type;
        if (res_name == "") return;
        $.getJSON($SCRIPT_ROOT + "get_resource_names/" + the_type, function(data) {
                showModal("Duplicate " + manager.res_type, "New Tile Name", DuplicateResource, res_name, data["resource_names"])
            }
        );
        function DuplicateResource(new_name) {
            var result_dict = {
                "new_res_name": new_name,
                "res_to_copy": res_name
            };
            postAjax(manager.duplicate_view, result_dict, doFlashOnFailure)
        }
    },

    delete_func: function (event) {
        var manager = event.data.manager;
        var res_name = manager.check_for_selection(manager.res_type);
        if (res_name == "") return;
        var confirm_text = "Are you sure that you want to delete " + res_name + "?";
        confirmDialog("Delete " + manager.res_type, confirm_text, "do nothing", "delete", function () {
            $('#list-selector .' + manager.res_type + '-selector-button.active').fadeOut();
            $("#" + manager.res_type + "-module .created").html("");
            $("#" + manager.res_type + "-tags").html("");
            $("#" + manager.res_type + "-notes").html("");
            $.post($SCRIPT_ROOT + manager.delete_view + String(res_name))
        })
    },

    send_repository_func: function (event) {
        var manager = event.data.manager;
        var res_name = manager.check_for_selection(manager.res_type);
        if (res_name == "") {
            doFlash({"message": "Select a " + manager.res_type + " first.", "alert_type": "alert-info"})
        }
        $.getJSON($SCRIPT_ROOT + "get_repository_resource_names/" + manager.res_type, function(data) {
            showModal("Share " + manager.res_type, "New " + manager.res_type + " Name", ShareResource, res_name, data["resource_names"])
            }
        );
        function ShareResource(new_name) {
            var result_dict = {
                "res_type": manager.res_type,
                "res_name": res_name,
                "new_res_name": new_name
            };
            postAjax(manager.send_repository_view, result_dict, doFlashAlways)
        }
        return res_name
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
            doFlash({"message": "Select a " + manager.res_type + " first.", "alert_type": "alert-info"})
        }
        $.getJSON($SCRIPT_ROOT + "get_resource_names/" + manager.res_type, function(data) {
            showModal("Import " + manager.res_type, "New Name", ImportResource, res_name, data["resource_names"])
            }
        );
        function ImportResource(new_name) {
            var result_dict = {
                "res_type": manager.res_type,
                "res_name": res_name,
                "new_res_name": new_name
            };
            postAjax(manager.repository_copy_view, result_dict, doFlashAlways)
        }
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
    postAjax("grab_metadata", result_dict, got_metadata);
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
    var tab_parent = $(event.target).closest(".tab-pane");
    var regexp = /^(\w+?)-/;
    var res_type = regexp.exec(tab_parent.attr("id"))[1];
    $(".resource-selector ." + res_type + "-selector-button").removeClass("active");
    row_element.addClass("active");
    var the_manager = resource_managers[res_type];
    the_manager[the_manager.double_click_func]({data: {manager: the_manager}})
}

function repository_selector_double_click(event) {
    var row_element = $(event.target).closest('tr');
    var tab_parent = $(event.target).closest(".tab-pane");
    var regexp = /^(\w+?)-/;
    var res_type = regexp.exec(tab_parent.attr("id"))[1];
    $(".repository-selector ." + res_type + "-selector-button").removeClass("active");
    row_element.addClass("active");
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
    postAjax("grab_repository_metadata", result_dict, got_metadata);
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
    unfilter_resource(event);
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
    unfilter_repository_resource(event);
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

function search_given_tag(txt, res_type) {
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

function search_resource_tags(event) {
    unfilter_resource(event);
    var res_type = event.target.value;
    var txt = document.getElementById(res_type + '-search').value.toLowerCase();
    search_given_tag(txt, res_type)
}


function tag_button_clicked(event) {
    unfilter_resource(event);
    var res_type = event.target.value;
    var txt = event.target.innerHTML;
    $(event.target).addClass("active");
    search_given_tag(txt, res_type)
}

function search_repository_resource_tags(event) {
    unfilter_repository_resource(event);
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

function get_current_res_type() {
    var module_id_str = $(".nav-tabs .active a").attr("href")
    var reg_exp = /\#(\S*)?\-/
    return module_id_str.match(reg_exp)[1]
}

function unfilter_resource_type(res_type) {
    var all_rows = $("#" + res_type + "-selector tbody tr");
    $.each(all_rows, function (index, row_element) {
            $(row_element).fadeIn()
    });
    var all_tag_buttons = $("#" + res_type + "-tag-buttons button");
    $.each(all_tag_buttons, function (index, but) {
        $(but).removeClass("active")
    })
}

function unfilter_resource(event) {
    var res_type = event.target.value;
    unfilter_resource_type(res_type)
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
    postAjax("save_metadata", result_dict, function(data) {
        if (data.success) {
            $('.resource-selector .' + res_type + '-selector-button.active').children()[3].innerHTML = tags
        }
        doFlashAlways(data)
    });
}
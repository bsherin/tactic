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
}

function objectKeys(obj) {
    result = []
    for (key in obj){
        if (!obj.hasOwnProperty(key)) continue;
        result.push(key)
    }
    return result
}

function ResourceManager(res_type, specifics) {
    this.res_type = res_type;
    updateObject(this, specifics)
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
        })
        if (this.show_add) {
            $("#add-{0}-form".format(self.res_type)).submit({"manager": self}, self.add_func)
        }
        $("#repository-copy-" + self.res_type + "-button").click({"manager": self}, self.repository_copy_func);

    },

    add_func: function (event) {
        var manager = event.data.manager;
        $.ajax({
            url: $SCRIPT_ROOT + manager.add_view,
            type: 'POST',
            data: new FormData(this),
            processData: false,
            contentType: false
        });
        event.preventDefault();
    },

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
                dataType: 'json'
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
                dataType: 'json'
            });
        })
    },

    delete_func: function (event) {
        var manager = event.data.manager;
        var res_name = manager.check_for_selection(manager.res_type);
        if (res_name == "") return;
        $('#list-selector .' + manager.res_type + '-selector-button.active').fadeOut();
        $("#" + manager.res_type + "-module .created").html("");
        $("#" + manager.res_type + "-tags").html("");
        $("#" + manager.res_type + "-notes").html("");
        $.post($SCRIPT_ROOT + manager.delete_view + String(res_name))
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
                dataType: 'json'
            });
        });
        return res_name
    },

    check_for_selection: function (res_type) {
        //var res_name = $('#' + res_type + '-selector > .btn.active').text().trim();
        var res_name = $('.resource-selector .' + res_type + '-selector-button.active')[0].value;
        if (res_name == "") {
            doFlash({"message": "Select a " + res_type + " first.", "alert_type": "alert-info"})
        }
        return res_name
    },

    check_for_repository_selection: function (res_type) {
        //var res_name = $('#' + res_type + '-selector > .btn.active').text().trim();
        var res_name = $('.repository-selector .' + res_type + '-selector-button.active')[0].value;
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
            selector_click({"target": $("#" + res_type + "-selector").children()[0]});
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
            repository_selector_click({"target": $("#repository-" + res_type + "-selector").children()[0]});
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
    var re = /^(\w+?)-/;
    var res_type = re.exec($(event.target).attr("id"))[1];
    $(".resource-selector ." + res_type + "-selector-button").removeClass("active");
    $(event.target).addClass("active");
    var res_name = $('.resource-selector .' + res_type + '-selector-button.active')[0].value;
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

function clear_repository_resource_metadata(res_type) {
    $("#" + res_type + "-module .repository-created").html("");
    $("#" + res_type + "-repository-tags")[0].value = "";
    $("#" + res_type + "-repository-tags").html("");
    $("#" + res_type + "-repository-notes")[0].value = "";
    $("#" + res_type + "-repository-notes").html("");
}

function repository_selector_click(event) {
    var re = /^repository-(\w+?)-/;
    var res_type = re.exec($(event.target).attr("id"))[1];
    $(".repository-selector ." + res_type + "-selector-button").removeClass("active");
    $(event.target).addClass("active");
    var res_name = $('.repository-selector .' + res_type + '-selector-button.active')[0].value;
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
    var res_type = event.target.value;
    var txt = document.getElementById(res_type + '-search').value;
    var data_dict = {"text": txt, "res_type": res_type , "search_type": "search", "location": "current_user"};
    $.ajax({
        url: $SCRIPT_ROOT + "/search_resource",
        contentType : 'application/json',
        type : 'POST',
        async: true,
        data: JSON.stringify(data_dict),
        dataType: 'json',
        success: search_success
    });
    function search_success(data) {
        $("#" + res_type + "-selector").html(data.html)
        select_resource_button(res_type, null)
    }
}

function search_repository_resource(event) {
    var res_type = event.target.value;
    var txt = document.getElementById("repository-" + res_type + '-search').value;
    var data_dict = {"text": txt, "res_type": res_type , "search_type": "search", "location": "repository"};
    $.ajax({
        url: $SCRIPT_ROOT + "/search_resource",
        contentType : 'application/json',
        type : 'POST',
        async: true,
        data: JSON.stringify(data_dict),
        dataType: 'json',
        success: search_success
    });
    function search_success(data) {
        $("#repository-" + res_type + "-selector").html(data.html)
        select_repository_button(res_type, null)
    }
}

function search_resource_tags(event) {
    var res_type = event.target.value;
    var txt = document.getElementById(res_type + '-search').value;
    var data_dict = {"text": txt, "res_type": res_type , "search_type": "tags", "location": "current_user"};
    $.ajax({
        url: $SCRIPT_ROOT + "/search_resource",
        contentType : 'application/json',
        type : 'POST',
        async: true,
        data: JSON.stringify(data_dict),
        dataType: 'json',
        success: search_success
    });
    function search_success(data) {
        $("#" + res_type + "-selector").html(data.html)
        select_resource_button(res_type, null)
    }
}

function search_repository_resource_tags(event) {
    var res_type = event.target.value;
    var txt = document.getElementById("repository-" + res_type + '-search').value;
    var data_dict = {"text": txt, "res_type": res_type , "search_type": "tags", "location": "repository"};
    $.ajax({
        url: $SCRIPT_ROOT + "/search_resource",
        contentType : 'application/json',
        type : 'POST',
        async: true,
        data: JSON.stringify(data_dict),
        dataType: 'json',
        success: search_success
    });
    function search_success(data) {
        $("#repository-" + res_type + "-selector").html(data.html)
        select_repository_button(res_type, null)
    }
}

function unfilter_resource(event) {
    var res_type = event.target.value;
    $("#" + res_type + "-selector").load($SCRIPT_ROOT + "/request_update_selector_list/" + res_type, function () {
        select_resource_button(res_type, null)
    });

}

function unfilter_repository_resource(event) {
    var res_type = event.target.value;
    $("#repository-" + res_type + "-selector").load($SCRIPT_ROOT + "/request_update_repository_selector_list/" + res_type, function () {
        select_repository_button(res_type, null)
    });
}

function save_metadata(event) {
    var res_type = event.target.value
    var res_name = $('.' + res_type + '-selector-button.active')[0].value
    var tags = $("#" + res_type + "-tags").val();
    var notes = $("#" + res_type + "-notes").val()
    var result_dict = {"res_type": res_type, "res_name": res_name, "tags": tags, "notes": notes}
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
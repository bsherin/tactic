/**
 * Created by bls910 on 6/12/15.
 */

var modal_template;
var confirm_template;
var tooltips;

$.get($SCRIPT_ROOT + "/get_modal_template", function(template){
    modal_template = $(template).filter('#modal-template').html();
    confirm_template = $(template).filter('#confirm-template').html();
});

alertify.set('notifier','position', 'top-right');

alertbox = alertify.alert()
        .setting({
             'basic': true,
            'modal': false,
            'frameless': true,
            'closable': false,
            'transition': 'fade',
            'resizable': true
        });

function statusMessage(data) {
    var timeout;
    if (data.hasOwnProperty("timeout") && (data.timeout != null)) {
        timeout = data.timeout
    } else {
        timeout = 0
    }

    if (!alertbox.isOpen()){
        alertbox.setContent(data.message).show().resizeTo("25%", 50).moveTo(0,0)
    } else {
        alertbox.setContent(data.message)
    }
}

function clearStatusMessage() {
    alertbox.close();
}

function doFlashOnFailure(data) {
    doFlash(data, false)
}

function doFlashOnSuccess(data) {
    doFlash(data, true)
}

function doFlashAlways(data) {
    doFlash(data)
}

function doFlash(data, success) {
    // Flash a bootstrap-styled warning in status-area
    // data should be a dict with message and type fields.
    // type can be alert-success, alert-warning, alert-info, alert-danger
    var alert_type;
    var message;
    var timeout;
    var msg;
    if (arguments.length != 1) {
        if (data.success != success) {
            return
        }
    }
    if (!data.hasOwnProperty("alert_type")){
        alert_type = "alert-info"
    }
    else {
        alert_type = data.alert_type
    }
    if (!data.hasOwnProperty("message")){
        message = "Unspecified message"
    }
    else {
        message = data.message
    }
    if (!data.hasOwnProperty("timeout")) {
        timeout = 0
    } else {
        timeout = data.timeout
    }

    if (alert_type == "alert-success") {
        msg = alertify.success(message, timeout);

    } else if(alert_type =="alert-warning") {
        msg = alertify.error(message, timeout);

    } else {
        msg = alertify.message(message, timeout);
    }

     $('body').one('click', function(){
        msg.dismiss();
     });
}

function scrollIntoView(element, container) {
  var containerTop = $(container).scrollTop();
  var containerBottom = containerTop + $(container).height();
  var elemTop = element.offsetTop;
  var elemBottom = elemTop + $(element).height();
  if (elemTop < containerTop) {
    $(container).scrollTop(elemTop);
  } else if (elemBottom > containerBottom) {
    $(container).scrollTop(elemBottom - $(container).height());
  }
}

function tooltipper() {
    return tooltip_dict[this.id];
}

opts_top = {
    delay: { "show": 1000, "hide": 100 },
    title: tooltipper,
    placement: "top"
};

opts_bottom = {
    delay: { "show": 1000, "hide": 100 },
    title: tooltipper,
    placement: "bottom"
};

function initializeTooltips() {
    $('.tooltip-top[data-toggle="tooltip"]').tooltip(options=opts_top);
    $('.tooltip-bottom[data-toggle="tooltip"]').tooltip(options=opts_bottom);
}

function toggleTooltips() {
    $('[data-toggle="tooltip"]').tooltip('toggle');
    return (false)
}

function clearStatusArea() {
    $("#status-area").fadeOut()
}

function resize_dom_to_bottom(selector, bottom_margin) {
    $(selector).css('height', window.innerHeight - $(selector).offset().top - bottom_margin)
}

function confirmDialog(modal_title, modal_text, cancel_text, submit_text, submit_function) {
    var res = Mustache.to_html(confirm_template, {
        "modal_title": modal_title,
        "modal_text": modal_text,
        "cancel_text": cancel_text,
        "submit_text": submit_text
    });

    $("#modal-area").html(res);
    $("#modal-dialog").modal();

    $("#modal-submit-button").on("click", submit_handler);

    function submit_handler() {
        $("#modal-dialog").modal("hide");
        submit_function()
    }
}

function showModal(modal_title, field_title, submit_function, default_value, existing_names, checkboxes) {
    var data_dict = {"modal_title": modal_title, "field_title": field_title};

    if (typeof existing_names == "undefined") {
        existing_names = []
    }

    if (typeof checkboxes == "undefined") {
        checkboxes = []
    }

    var name_counter = 1;
    var default_name = default_value;
    while (name_exists(default_name)) {
        name_counter += 1;
        default_name = default_value + String(name_counter)
    }

    var res = Mustache.to_html(modal_template, {
        "modal_title": modal_title,
        "field_title": field_title,
        "checkboxes": checkboxes
    });
    $("#modal-area").html(res);
    $('#modal-dialog').on('shown.bs.modal', function () {
        $('#modal-text-input-field').focus();
    });
    $("#modal-dialog").modal();

    if (!(default_name == undefined)) {
        $("#modal-text-input-field").val(default_name)
    }

    $("#modal-submit-button").on("click", submit_handler);


    $('.submitter-field').keypress(function(e) {
        if (e.which == 13) {
            submit_handler();
            e.preventDefault();
        }
    });

    function name_exists(name) {
        return (existing_names.indexOf(name) > -1)
    }

    function submit_handler() {
        var result = $("#modal-text-input-field").val();
        checkresults = {};
        for (var i = 0; i < checkboxes.length; i++) {
            cname = checkboxes[i]["checkname"]
            checkresults[cname] = $("#" + cname).is(":checked")
        }
        var msg;
        if (name_exists(result)) {
            msg = "That name already exists";
            $("#warning_field").html(msg)
        }
        else if (result == "") {
            msg = "An empty name is not allowed here.";
            $("#warning_field").html(msg)
        }
        else {
            $("#modal-dialog").modal("hide");
            if (checkboxes.length > 0) {
                submit_function(result, checkresults)
            }
            else {
               submit_function(result)
            }
        }
    }
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}